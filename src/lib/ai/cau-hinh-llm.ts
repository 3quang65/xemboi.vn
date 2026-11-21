// Cấu hình LLM qua 9router (cổng tương thích OpenAI của anh, https://token.vip.vn/v1).
// - Lưu trong CaiDat khóa "LLM": cổng, mô hình cho từng việc, nhiệt độ. Sửa ở /quan-tri/ai/mo-hinh.
// - Khóa API CHỈ ở biến môi trường NINEROUTER_API_KEY (không bao giờ lưu CSDL, không trả về trình duyệt, không ghi nhật ký).
// - Hai việc: "chat" (trợ lý công khai: nhiều lượt, ngắn) và "soan" (AI soạn bản nháp: dài, cần trích dẫn chuẩn).
import { prisma } from '@/lib/prisma';

export type ViecLlm = 'chat' | 'soan';
export type CauHinhLlm = {
  baseUrl: string;
  moHinh: Record<ViecLlm, string>;
  nhietDo: Record<ViecLlm, number>;
};

export const KHOA_CAI_DAT = 'LLM';
/** Mặc định (22/11/2026): GPT 6 qua kết nối Codex của 9router. Luna cho việc ngắn số lượng lớn; 6.1-sol cho soạn (thử thật: trích dẫn đạt, ghi rõ tên sách nguồn). */
export const MAC_DINH: CauHinhLlm = {
  baseUrl: 'https://token.vip.vn/v1',
  moHinh: { chat: 'cx/gpt-6-luna', soan: 'cx/gpt-6.1-sol' },
  nhietDo: { chat: 0.65, soan: 0.4 },
};

const RE_MO_HINH = /^[A-Za-z0-9][A-Za-z0-9._:/\-[\]]{0,99}$/;

/** Chuẩn hóa dữ liệu từ CSDL hoặc form; trường sai thì lấy mặc định. */
export function chuanHoa(x: unknown): CauHinhLlm {
  const o = (x && typeof x === 'object' ? x : {}) as Partial<CauHinhLlm>;
  const url = typeof o.baseUrl === 'string' && /^https?:\/\/[^\s]+$/.test(o.baseUrl.trim()) ? o.baseUrl.trim().replace(/\/+$/, '') : MAC_DINH.baseUrl;
  const mh = (v: ViecLlm) => {
    const s = typeof o.moHinh?.[v] === 'string' ? o.moHinh[v].trim() : '';
    return RE_MO_HINH.test(s) ? s : MAC_DINH.moHinh[v];
  };
  const nd = (v: ViecLlm) => {
    const n = Number(o.nhietDo?.[v]);
    return Number.isFinite(n) ? Math.min(1.5, Math.max(0, Math.round(n * 100) / 100)) : MAC_DINH.nhietDo[v];
  };
  return { baseUrl: url, moHinh: { chat: mh('chat'), soan: mh('soan') }, nhietDo: { chat: nd('chat'), soan: nd('soan') } };
}

let bo: { luc: number; gt: CauHinhLlm } | null = null;
/** Đọc cấu hình (giữ 30 giây). CSDL lỗi thì dùng mặc định. */
export async function docCauHinhLlm(boQuaBoNho = false): Promise<CauHinhLlm> {
  if (!boQuaBoNho && bo && Date.now() - bo.luc < 30_000) return bo.gt;
  let gt = MAC_DINH;
  try {
    const r = await prisma.caiDat.findUnique({ where: { khoa: KHOA_CAI_DAT } });
    if (r) gt = chuanHoa(r.giaTri);
  } catch {}
  bo = { luc: Date.now(), gt };
  return gt;
}
export function xoaBoNhoCauHinh() { bo = null; }

export function khoaApi(): string { return process.env.NINEROUTER_API_KEY?.trim() || ''; }
/** Chỉ để hiển thị: có khóa không và 4 ký tự cuối. */
export function tomTatKhoa() { const k = khoaApi(); return { co: !!k, cuoi: k ? k.slice(-4) : '' }; }

type TinNhan = { role: 'system' | 'user' | 'assistant'; content: string };
export type KetQuaGoi = { ok: true; vanBan: string; moHinh: string; ms: number; tokenVao?: number; tokenRa?: number } | { ok: false; loi: string; ms: number; trangThai?: number };

/** Gọi một lần, không luồng (ghi rõ stream:false: 9router thiếu trường này sẽ trả SSE). */
export async function goiLlm(viec: ViecLlm, tinNhan: TinNhan[], o: { moHinh?: string; maxTokens?: number; cauHinh?: CauHinhLlm; hetGioMs?: number } = {}): Promise<KetQuaGoi> {
  const t0 = Date.now();
  const khoa = khoaApi();
  if (!khoa) return { ok: false, loi: 'Chưa có NINEROUTER_API_KEY trong biến môi trường', ms: 0 };
  const ch = o.cauHinh ?? (await docCauHinhLlm());
  const moHinh = o.moHinh ?? ch.moHinh[viec];
  try {
    const res = await fetch(`${ch.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${khoa}` },
      body: JSON.stringify({ model: moHinh, messages: tinNhan, stream: false, temperature: ch.nhietDo[viec], ...(o.maxTokens ? { max_tokens: o.maxTokens } : {}) }),
      signal: AbortSignal.timeout(o.hetGioMs ?? 120_000),
    });
    const ms = Date.now() - t0;
    const chu = await res.text();
    if (!res.ok) return { ok: false, loi: `HTTP ${res.status}: ${chu.slice(0, 300)}`, ms, trangThai: res.status };
    let j: { choices?: { message?: { content?: string } }[]; model?: string; usage?: { prompt_tokens?: number; completion_tokens?: number } };
    try { j = JSON.parse(chu); } catch { return { ok: false, loi: `Cổng trả về không phải JSON (${res.headers.get('content-type') ?? '?'})`, ms }; }
    const vanBan = j.choices?.[0]?.message?.content ?? '';
    if (!vanBan) return { ok: false, loi: 'Cổng trả JSON nhưng không có nội dung', ms };
    return { ok: true, vanBan, moHinh: j.model || moHinh, ms, tokenVao: j.usage?.prompt_tokens, tokenRa: j.usage?.completion_tokens };
  } catch (e) {
    return { ok: false, loi: e instanceof Error ? e.message : String(e), ms: Date.now() - t0 };
  }
}

/** Danh sách mô hình cổng đang mở cho khóa này (GET /models). */
export async function layDanhSachMoHinh(cauHinh?: CauHinhLlm): Promise<{ ok: true; ds: string[] } | { ok: false; loi: string }> {
  const khoa = khoaApi();
  if (!khoa) return { ok: false, loi: 'Chưa có NINEROUTER_API_KEY trong biến môi trường' };
  const ch = cauHinh ?? (await docCauHinhLlm());
  try {
    const res = await fetch(`${ch.baseUrl}/models`, { headers: { Authorization: `Bearer ${khoa}` }, signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return { ok: false, loi: `HTTP ${res.status}` };
    const j = (await res.json()) as { data?: { id?: string }[] };
    return { ok: true, ds: (j.data ?? []).map((m) => m.id).filter((x): x is string => typeof x === 'string').sort() };
  } catch (e) {
    return { ok: false, loi: e instanceof Error ? e.message : String(e) };
  }
}

/** Lọc dòng GPT (tiền tố cx/ của kết nối Codex, hoặc tên chứa gpt). */
export const laMoHinhGpt = (id: string) => /^cx\//.test(id) || /gpt/i.test(id);

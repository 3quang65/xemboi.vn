// Tìm tri thức cho trợ lý công khai (chat, hỏi thầy, hội đồng) trên kho RAG mới.
// Chỉ đọc qua view rag_doan_cong_khai / rag_nguon_cong_khai: không bao giờ chạm đoạn NOI_BO hay bảng gốc.
// Cách tìm giống cấu hình đang dùng trên VPS (docs/v2/bao-cao-danh-gia-rag.md): từ khóa BM25 + bảng thuật ngữ
// + viết lại câu hỏi bằng gx/qwen3.6. LLM lỗi hoặc quá giờ thì chỉ dùng bảng thuật ngữ.
import { Prisma, type PrismaClient } from '@prisma/client';
import { timLai, napBangThuatNgu, type MucThuatNgu } from './tim-lai';
import { vietLaiCauHoi } from './viet-lai-cau';

export type DoanCongKhai = {
  id: string;
  nguonMa: string;
  tieuDe: string; // tên sách (Hán Việt nếu có) › đường dẫn chương
  mang: string[];
  noiDung: string; // nguyên văn, đã cắt
  hanViet: string | null;
  ghiCong: string | null;
  diem: number;
};

export const CO_RAG_V2 = () => process.env.RAG_V2 === '1';

// Bảng thuật ngữ đổi rất ít: giữ trong bộ nhớ 10 phút.
let boNho: { luc: number; bang: MucThuatNgu[] } | null = null;
async function bangThuatNgu(db: PrismaClient) {
  if (!boNho || Date.now() - boNho.luc > 600_000) boNho = { luc: Date.now(), bang: await napBangThuatNgu(db) };
  return boNho.bang;
}

const cat = (s: string, n: number) => (s.length > n ? s.slice(0, n) + '…' : s);

/**
 * Trả tối đa `k` đoạn công khai liên quan tới câu hỏi tiếng Việt.
 * `vietLai: false` để bỏ bước LLM (ví dụ khi đã gọi nhiều lần trong một yêu cầu).
 */
export async function timCongKhai(db: PrismaClient, cau: string, o: { k?: number; vietLai?: boolean; hetGioMs?: number; ghiLog?: boolean } = {}) {
  const batDau = Date.now();
  const q = cau.trim().slice(0, 500);
  if (!q) return { doan: [] as DoanCongKhai[], vietLai: null, ms: 0 };
  const bang = await bangThuatNgu(db);
  const vl = o.vietLai === false ? null : await vietLaiCauHoi(q, { hetGioMs: o.hetGioMs ?? 6_000, soLan: 1 }).catch(() => null);
  const kq = await timLai(db, { cau: q, bang, phamVi: Prisma.sql`TRUE`, congKhai: true, vietLai: vl?.ok ? vl : null, k: o.k ?? 4 });
  const ids = kq.ketQua.map((x) => x.id);
  const dong = ids.length ? await db.$queryRaw<{ id: bigint; vanBan: string; hanViet: string | null; duongDan: string[]; ma: string; tenGoc: string; tenHanViet: string | null; mang: string[]; ghiCong: string | null; duocTrichDai: boolean }[]>`
    SELECT d.id, d."vanBan", d."hanViet", d."duongDan", n.ma, n."tenGoc", n."tenHanViet", n.mang, n."ghiCong", n."duocTrichDai"
    FROM rag_doan_cong_khai d JOIN rag_nguon_cong_khai n ON n.id = d."nguonId"
    WHERE d.id = ANY(${ids}::bigint[])` : [];
  const theoId = new Map(dong.map((x) => [String(x.id), x]));
  const doan: DoanCongKhai[] = [];
  for (const r of kq.ketQua) {
    const x = theoId.get(String(r.id));
    if (!x) continue;
    const dai = x.duocTrichDai ? 900 : 400; // nguồn chưa cho trích dài: đưa LLM ít chữ hơn
    doan.push({
      id: String(x.id), nguonMa: x.ma,
      tieuDe: [x.tenHanViet || x.tenGoc, ...(x.duongDan ?? []).slice(0, 3)].join(' › '),
      mang: x.mang ?? [], noiDung: cat(x.vanBan, dai), hanViet: x.hanViet ? cat(x.hanViet, dai) : null, ghiCong: x.ghiCong, diem: r.diem,
    });
  }
  const ms = Date.now() - batDau;
  if (o.ghiLog !== false) {
    await db.ragTruyVanLog.create({ data: { nguCanh: 'CONG_KHAI', truyVan: q, soKetQua: doan.length, coNoiBo: false, ms } }).catch(() => undefined);
  }
  return { doan, vietLai: vl?.ok ? { tuKhoa: vl.tuKhoa, moHinh: vl.moHinh } : null, ms };
}

// Viết lại câu hỏi bằng LLM để tìm trong sách chữ Hán khi máy chủ không nhúng được câu hỏi (VPS 2 GB).
// LLM đọc câu tiếng Việt, trả thuật ngữ chữ Hán phồn thể có thể có nguyên văn trong đoạn sách, và một câu văn ngôn mẫu.
// Chỉ dùng model gx/ của 9router (cụm máy nhà anh, không tính phí). Lỗi hoặc quá giờ thì người gọi dùng bảng thuật ngữ như cũ.
import { goiLlm, docCauHinhLlm } from '@/lib/ai/cau-hinh-llm';

export const MO_HINH_VIET_LAI = 'gx/qwen3.6-35b-nvfp4'; // chọn theo bộ đo 100 câu (docs/v2/bao-cao-danh-gia-rag.md)

const HE_THONG = `Bạn là người tra cứu sách cổ chữ Hán về tử vi đẩu số, tử bình (bát tự), Kinh Dịch và bói dịch, chọn ngày, phong thủy, ngũ hành.
Người dùng hỏi bằng tiếng Việt. Hãy đoán đoạn sách cổ nào trả lời câu hỏi và viết ra những chữ có khả năng xuất hiện NGUYÊN VĂN trong đoạn đó.
Chỉ trả về một đối tượng JSON, không giải thích:
{"tu_khoa": ["…"], "doan": "…"}
- tu_khoa: 3–12 thuật ngữ hoặc cụm chữ Hán PHỒN THỂ, mỗi mục 1–8 chữ: tên sao, cung, can chi, tên quẻ, tên hào (初九, 九二, 六三…), thần sát, tên thiên/chương, cụm từ đặc trưng. Không dịch nghĩa, không phiên âm.
- doan: một câu văn ngôn phồn thể, tối đa 60 chữ, như sách cổ có thể viết để trả lời.
Tuyệt đối không viết tiếng Việt trong JSON.`;

// Hai ví dụ mẫu, cố ý chọn chủ đề không có trong bộ câu hỏi chuẩn (docs/v2/rag-cau-hoi-chuan.csv) để kết quả đo không bị lộ đề.
const VI_DU: { role: 'user' | 'assistant'; content: string }[] = [
  { role: 'user', content: 'Vũ Khúc ở cung Thìn thì tính cách ra sao?' },
  { role: 'assistant', content: '{"tu_khoa": ["武曲", "辰", "辰宮", "武曲守命", "財帛主", "入廟", "剛毅"], "doan": "武曲屬金，為財帛之主，辰戌入廟，主人剛毅果決。"}' },
  { role: 'user', content: 'Hào đầu quẻ Tỉnh nói gì?' },
  { role: 'assistant', content: '{"tu_khoa": ["井", "初六", "井泥不食", "舊井無禽"], "doan": "初六，井泥不食，舊井無禽。"}' },
];

export type KetQuaVietLai = { ok: true; tuKhoa: string[]; doan: string; ms: number; moHinh: string } | { ok: false; loi: string; ms: number };

const coHan = (s: string) => /\p{Script=Han}/u.test(s);

/** Rút JSON từ câu trả lời (có thể bọc ``` hoặc có chữ thừa), chỉ giữ mục có chữ Hán. */
export function docKetQuaVietLai(vanBan: string): { tuKhoa: string[]; doan: string } | null {
  const m = vanBan.match(/\{[\s\S]*\}/);
  if (!m) return null;
  let j: { tu_khoa?: unknown; doan?: unknown };
  try { j = JSON.parse(m[0]); } catch { return null; }
  const tk = Array.isArray(j.tu_khoa) ? j.tu_khoa : [];
  const tuKhoa = [...new Set(tk.filter((x): x is string => typeof x === 'string')
    .map((x) => x.replace(/[^\p{Script=Han}]/gu, ''))
    .filter((x) => x.length >= 1 && x.length <= 12 && coHan(x)))].slice(0, 15);
  const doan = typeof j.doan === 'string' ? j.doan.replace(/\s+/g, '').slice(0, 120) : '';
  if (!tuKhoa.length && !coHan(doan)) return null;
  return { tuKhoa, doan: coHan(doan) ? doan : '' };
}

export { capHan as capChuHan } from './tim-lai';

export async function vietLaiCauHoi(cau: string, o: { moHinh?: string; hetGioMs?: number; soLan?: number } = {}): Promise<KetQuaVietLai> {
  const ch = await docCauHinhLlm();
  let ms = 0, loi = '';
  for (let lan = 0; lan < (o.soLan ?? 2); lan++) { // sai định dạng thì thử lại một lần
    const r = await goiLlm('chat', [{ role: 'system', content: HE_THONG }, ...VI_DU, { role: 'user', content: cau.slice(0, 500) }], {
      moHinh: o.moHinh ?? MO_HINH_VIET_LAI,
      maxTokens: 600,
      hetGioMs: o.hetGioMs ?? 8_000, // chạy thật: Qwen3.6 trung bình 2,9 giây
      cauHinh: { ...ch, nhietDo: { ...ch.nhietDo, chat: lan === 0 ? 0 : 0.3 } },
    });
    ms += r.ms;
    if (!r.ok) return { ok: false, loi: r.loi, ms };
    const kq = docKetQuaVietLai(r.vanBan);
    if (kq) return { ok: true, ...kq, ms, moHinh: r.moHinh };
    loi = 'LLM không trả JSON chữ Hán hợp lệ';
  }
  return { ok: false, loi, ms };
}

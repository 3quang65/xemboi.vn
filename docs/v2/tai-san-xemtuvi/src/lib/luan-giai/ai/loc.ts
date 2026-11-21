// Bộ lọc sau cùng của luận giải AI: từ cấm (tu-cam.json) và kiểm tra mã quy tắc sau khi AI viết lại.

export interface TuCamCauHinh {
  tuCam: string[];
  thayThe: Record<string, string>;
}

const thoat = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const chuan = (s: string) => s.toLowerCase().replace(/\s+/g, '');

/** Cụm từ → regex không phân biệt hoa thường, mỗi khoảng trắng khớp 0..n khoảng trắng bất kỳ. */
function mau(cum: string): RegExp {
  const kyTu = Array.from(cum.normalize('NFC').replace(/\s+/g, '')).map(thoat);
  return new RegExp(kyTu.join('\\s*'), 'giu');
}

/**
 * Thay từ cấm bằng cách nói thay; không thay được thì trả null (bỏ cả câu).
 * Dài trước ngắn để cụm dài được xử lý trước.
 */
export function locTuCam(cau: string, cfg: TuCamCauHinh): string | null {
  let kq = cau.normalize('NFC');
  const thayThe = new Map(Object.entries(cfg.thayThe).map(([k, v]) => [chuan(k), v]));
  const ds = [...cfg.tuCam].sort((a, b) => b.length - a.length);
  for (const cum of ds) {
    const re = mau(cum);
    if (!re.test(kq)) continue;
    const thay = thayThe.get(chuan(cum));
    if (thay === undefined) return null;
    kq = kq.replace(mau(cum), thay);
  }
  // Phòng trường hợp cách nói thay lại chứa từ cấm khác.
  const g = chuan(kq);
  return ds.some((c) => g.includes(chuan(c))) ? null : kq;
}

/**
 * Văn bản AI trả về: mỗi dòng một câu kết thúc bằng [MÃ]. Giữ câu có mã nằm trong tập hợp lệ
 * (lấy mã hợp lệ đầu tiên), bỏ câu không mã hoặc mã lạ. Trả về câu đã gỡ mã.
 */
export function kiemTraMaSauViet(van: string, hopLe: Set<string>): { text: string; id: string }[] {
  const kq: { text: string; id: string }[] = [];
  for (const dong of van.split(/\r?\n/)) {
    const ma = [...dong.matchAll(/\[([A-Za-z0-9_-]+)\]/g)].map((m) => m[1]);
    const id = ma.find((m) => hopLe.has(m));
    if (!id) continue;
    const text = dong.replace(/\[[A-Za-z0-9_-]+\]/g, '').replace(/^\s*[-*\d.)]+\s+/, '').replace(/\s+/g, ' ').trim();
    if (text) kq.push({ text, id });
  }
  return kq;
}

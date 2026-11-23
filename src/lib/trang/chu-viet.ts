// Quy tắc 24/11/2026: frontend chỉ hiện tiếng Việt, không chữ Hán (docs/v2/22-chuan-truc-quan.md).
// Dùng cho dữ liệu lấy từ CSDL (nguồn sách, thuật ngữ) vốn ghi kèm chữ Hán.

/** Chữ Hán (CJK, mở rộng A, tương thích) và dấu câu CJK (《》、。，：；！？「」…). */
export const CHU_HAN = /[㐀-䶿一-鿿豈-﫿　-〿！-？]/;
const CHUOI_HAN = /[㐀-䶿一-鿿豈-﫿　-〿！-？]+/g;

export const coChuHan = (s: string | null | undefined) => !!s && CHU_HAN.test(s);

/**
 * Bỏ mọi đoạn chữ Hán, dọn ngoặc rỗng, dấu thừa và khoảng trắng.
 * "陳摶 Trần Đoàn (thác danh); 潘希尹 Phan Hy Doãn bổ tập" → "Trần Đoàn (thác danh); Phan Hy Doãn bổ tập".
 */
export function boChuHan(s: string): string {
  return s
    .replace(CHUOI_HAN, ' ')
    .replace(/\(\s*[,;·:–-]?\s*\)/g, ' ')
    .replace(/\[\s*\]/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+([,;:.)])/g, '$1')
    .replace(/([,;:·–-])\s*(?=[,;:·]|$)/g, '')
    .replace(/^[\s,;:·–-]+/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export const boChuHanHoacNull = (s: string | null): string | null => {
  if (s === null) return null;
  const k = boChuHan(s);
  return k || null;
};

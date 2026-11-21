// Hàm thuần nhẹ (giờ sinh, múi giờ), không phụ thuộc engine an sao: component tải đầu trang dùng được
// mà không kéo cả tuvi-raw.js (~40 KB). index.ts xuất lại nên chỗ gọi cũ không đổi.

export function muiGioHopLe(m: unknown): m is number {
  return typeof m === 'number' && Number.isFinite(m) && m >= -12 && m <= 14 && Number.isInteger(m * 4);
}
/** "UTC+7", "UTC-5", "UTC+5:30". */
export function nhanMuiGio(m: number): string {
  const a = Math.abs(m), h = Math.floor(a), p = Math.round((a - h) * 60);
  return `UTC${m < 0 ? '-' : '+'}${h}${p ? ':' + String(p).padStart(2, '0') : ''}`;
}

export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;
/** Tên canh giờ của giờ đồng hồ 0–23 (23h là Tý muộn, 0h là Tý sớm). */
export function canhGio(gio: number): string {
  return gio === 23 ? 'Tý muộn' : gio === 0 ? 'Tý sớm' : CHI[Math.floor(((gio + 1) % 24) / 2)];
}
export const GIO_SINH = [
  'Tý (23h–1h)', 'Sửu (1h–3h)', 'Dần (3h–5h)', 'Mão (5h–7h)', 'Thìn (7h–9h)', 'Tỵ (9h–11h)',
  'Ngọ (11h–13h)', 'Mùi (13h–15h)', 'Thân (15h–17h)', 'Dậu (17h–19h)', 'Tuất (19h–21h)', 'Hợi (21h–23h)',
] as const;

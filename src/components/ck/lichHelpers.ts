export const NAM_MIN = 1900;
export const NAM_MAX = 2100;

export const THU_VI = [
  'Chủ nhật',
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
] as const;

export const NHAN_THU_NGAN = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;

export const TEN_THU_DAY_DU = [
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
  'Chủ nhật',
] as const;

export function hai(n: number): string {
  return String(n).padStart(2, '0');
}

export function trongPhamViNam(nam: number): boolean {
  return Number.isInteger(nam) && nam >= NAM_MIN && nam <= NAM_MAX;
}

export function tenThangAmClient(thang: number, nhuan = false): string {
  const ten = thang === 1 ? 'Giêng' : thang === 12 ? 'Chạp' : String(thang);
  return `tháng ${ten}${nhuan ? ' nhuận' : ''}`;
}

export function nhanNgayAmChu(ngay: number, vietHoa = false): string {
  const tienTo = ngay <= 10 ? (vietHoa ? 'Mùng' : 'mùng') : vietHoa ? 'Ngày' : 'ngày';
  return `${tienTo} ${ngay}`;
}

export function dinhDangNgayVN(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function dinhDangNgayThangVN(iso: string): string {
  const [, m, d] = iso.split('-');
  if (!m || !d) return iso;
  return `${d}/${m}`;
}

export function duongDanThang(nam: number, thang: number): string {
  return `/lich-am/${nam}/${hai(thang)}`;
}

export function duongDanNgay(nam: number, thang: number, ngay: number): string {
  return `/lich-am/${nam}/${hai(thang)}/${hai(ngay)}`;
}

export function duongDanNgayTuIso(iso: string): string | null {
  const [yStr, mStr, dStr] = iso.split('-');
  const y = Number(yStr);
  const m = Number(mStr);
  const d = Number(dStr);
  if (!trongPhamViNam(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
  return duongDanNgay(y, m, d);
}

export function thuTuIso(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '';
  const dt = new Date(Date.UTC(y, m - 1, d));
  return THU_VI[dt.getUTCDay()] ?? '';
}

export function ngayKeTiep(
  nam: number,
  thang: number,
  ngay: number,
  buoc: -1 | 1,
): { nam: number; thang: number; ngay: number } | null {
  const dt = new Date(Date.UTC(nam, thang - 1, ngay + buoc));
  const y = dt.getUTCFullYear();
  if (!trongPhamViNam(y)) return null;
  return {
    nam: y,
    thang: dt.getUTCMonth() + 1,
    ngay: dt.getUTCDate(),
  };
}

export function ngayDuongHopLe(d: number, m: number, y: number): boolean {
  if (![d, m, y].every(Number.isInteger)) return false;
  if (!trongPhamViNam(y) || m < 1 || m > 12 || d < 1) return false;
  const maxNgay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return d <= maxNgay;
}

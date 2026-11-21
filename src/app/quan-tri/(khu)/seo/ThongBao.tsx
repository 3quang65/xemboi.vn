// Thông báo sau thao tác (?bao=… hoặc ?loi=…) và vài hàm định dạng dùng chung cho khu SEO.
export default function ThongBao({ bao, loi }: { bao?: string; loi?: string }) {
  if (loi) return <div className="qt-bao loi" role="alert">{loi}</div>;
  if (bao) return <div className="qt-bao" role="status">{bao}</div>;
  return null;
}

export const so = (n: number | bigint | null | undefined) => (n == null ? '–' : Number(n).toLocaleString('vi-VN'));
export const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : '–');

export function nhanTrangThai(t: string) {
  const lop =
    t === 'XUAT_BAN' || t === 'GIU' ? 'tot'
    : t === 'LOAI_DINH_VI' || t === 'THUONG_HIEU_DOI_THU' || t === 'AN' || t === 'LOAI_VINH_VIEN' ? 'xau'
    : t === 'MOI' || t === 'NHAP' || t === 'CHO_QUYET' ? 'vua' : '';
  return <span className={`qt-nhan ${lop}`}>{t}</span>;
}

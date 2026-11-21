// Thành phần thông báo, định dạng số và nhãn tiếng Việt dùng chung cho khu RAG.
export function ThongBao({ bao, loi }: { bao?: string; loi?: string }) {
  if (loi) return <div className="qt-bao loi" role="alert">{loi}</div>;
  if (bao) return <div className="qt-bao" role="status">{bao}</div>;
  return null;
}

export const so = (n: number | bigint | null | undefined) =>
  n == null ? '–' : Number(n).toLocaleString('vi-VN');

export const pct = (a: number, b: number) =>
  b ? `${((a / b) * 100).toFixed(1)}%` : '–';

export function ngayGio(d: Date | string | null | undefined) {
  if (!d) return '–';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '–';
  return dt.toLocaleString('vi-VN');
}

export function catVanBan(s: string | null | undefined, toiDa = 400) {
  if (!s) return '';
  if (s.length <= toiDa) return s;
  return s.slice(0, toiDa).trimEnd() + '…';
}

export const TEN_PHAP_LY: Record<string, string> = {
  A: 'A · Công cộng / mở',
  B: 'B · Cần xin phép',
  C: 'C · Bản quyền',
};

export const TEN_PHAM_VI: Record<string, string> = {
  CONG_KHAI: 'Công khai',
  NOI_BO: 'Nội bộ',
};

export const TEN_XIN_PHEP: Record<string, string> = {
  KHONG_CAN: 'Không cần',
  CHUA_XIN: 'Chưa xin',
  DA_GUI: 'Đã gửi thư',
  DONG_Y: 'Đã đồng ý',
  TU_CHOI: 'Từ chối',
  CAN_TRA_PHI: 'Cần trả phí',
};

export const TEN_TRANG_THAI_NGUON: Record<string, string> = {
  DANH_MUC: 'Danh mục',
  DANG_NAP: 'Đang nạp',
  DA_NAP: 'Đã nạp',
  TAM_DUNG: 'Tạm dừng',
  LOAI: 'Loại bỏ',
};

export const TEN_TRANG_THAI_VIEC: Record<string, string> = {
  CHO: 'Chờ chạy',
  DANG_CHAY: 'Đang chạy',
  XONG: 'Hoàn tất',
  LOI: 'Lỗi',
  HUY: 'Đã hủy',
};

export const TEN_LOAI_VIEC: Record<string, string> = {
  PHAT_HIEN: 'Phát hiện tệp',
  TRICH: 'Trích văn bản',
  OCR: 'Nhận dạng chữ (OCR)',
  PHIEN_AM: 'Phiên âm',
  LAM_SACH: 'Làm sạch',
  CAT_DOAN: 'Cắt đoạn',
  NHUNG: 'Tạo vector',
  NAP_DB: 'Nạp CSDL',
  TAO_CHI_MUC: 'Tạo chỉ mục',
  NHUNG_TRANG_SEO: 'Tạo vector trang SEO',
};

export const TEN_NOI_CHAY: Record<string, string> = {
  MAY_TRAM: 'Máy trạm',
  VPS: 'Máy chủ (VPS)',
};

export const TEN_LOAI_DOAN: Record<string, string> = {
  chinh_van: 'Chính văn',
  chu: 'Chú thích',
  so: 'Sớ giải',
  phu: 'Phú',
  bang: 'Bảng',
  giang: 'Bài giảng',
};

export const TEN_TRUONG_SUA: Record<string, string> = {
  van_ban: 'Văn bản gốc',
  van_ban_chuan: 'Văn bản chuẩn',
  han_viet: 'Phiên âm Hán Việt',
  dich_vi: 'Bản dịch tiếng Việt',
  da_soat: 'Trạng thái soát',
};

export function nhanPhapLy(pl: string) {
  const lop = pl === 'A' ? 'tot' : pl === 'B' ? 'vua' : pl === 'C' ? 'xau' : '';
  return <span className={`qt-nhan ${lop}`}>{TEN_PHAP_LY[pl] ?? pl}</span>;
}

export function nhanPhamVi(pv: string) {
  const lop = pv === 'CONG_KHAI' ? 'tot' : pv === 'NOI_BO' ? 'vua' : '';
  return <span className={`qt-nhan ${lop}`}>{TEN_PHAM_VI[pv] ?? pv}</span>;
}

export function nhanTrangThaiNguon(tt: string) {
  const lop = tt === 'DA_NAP' ? 'tot' : tt === 'DANG_NAP' ? 'vua' : tt === 'LOAI' ? 'xau' : '';
  return <span className={`qt-nhan ${lop}`}>{TEN_TRANG_THAI_NGUON[tt] ?? tt}</span>;
}

export function nhanTrangThaiViec(tt: string) {
  const lop =
    tt === 'XONG' ? 'tot'
      : tt === 'LOI' ? 'xau'
        : tt === 'CHO' || tt === 'DANG_CHAY' ? 'vua'
          : '';
  return <span className={`qt-nhan ${lop}`}>{TEN_TRANG_THAI_VIEC[tt] ?? tt}</span>;
}

export function nhanLoaiDoan(loai: string) {
  return <span className="qt-nhan">{TEN_LOAI_DOAN[loai] ?? loai}</span>;
}

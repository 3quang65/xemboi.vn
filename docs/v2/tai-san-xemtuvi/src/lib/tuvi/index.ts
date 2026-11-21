// Lớp bọc có kiểu dữ liệu cho bộ máy an sao (tuvi-raw.js, xem NOTICE).
// Mọi phần giao diện và luận giải chỉ được gọi qua file này,
// để sau này thay/sửa engine mà không ảnh hưởng chỗ khác.

// eslint-disable-next-line @typescript-eslint/no-require-imports
import TuViRaw from './tuvi-raw.js';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import LichRaw from './lich-raw.js';

export type NguHanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
export type DacTinh = 'M' | 'V' | 'Đ' | 'B' | 'H';

export interface Sao {
  key: string;
  ten: string;
  hanh: NguHanh;
  loai: 'chinh' | 'cat' | 'sat';
  dacTinh: DacTinh | null;
  dacTinhTen: 'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Hãm' | null;
  hoa: string | null;
}

export interface Cung {
  chi: number; // 0 = Tý … 11 = Hợi
  tenChi: string;
  can: string;
  ten: string; // Mệnh, Phụ Mẫu, …
  hanhCung: NguHanh;
  laThan: boolean;
  tuan: boolean;
  triet: boolean;
  chinhTinh: Sao[];
  catTinh: Sao[];
  hungTinh: Sao[];
  phuTinh: Sao[];
  trangSinh: string;
  daiVan: string;
  daiVanTu: number;
  tieuHan: string;
}

/** Quy ước an sao ở các điểm trường phái khác nhau (đặc tả mục 10). Không truyền thì dùng mặc định. */
export interface QuyUoc {
  muiGioLich: 'lichSu' | 'utc7';
  gioTyMuon: 'ngaySau' | 'giuNgay';
  /** 10.6 — Hỏa, Linh tuổi Tỵ Dậu Sửu: câu phú (Hỏa Mão, Linh Tuất) hay engine cũ (Hỏa Tuất, Linh Mão) */
  hoaLinh: 'cauPhu' | 'ansaotuvi';
  /** 10.8 — Thiên Khôi, Thiên Việt: Toàn Thư (mặc định), biến thể "Canh Tân phùng Mã Hổ", hay engine cũ */
  khoiViet: 'toanThu' | 'canhTanMaHo' | 'ansaotuvi';
  /** 10.9 — Phá Toái: iztro/sách Trung Quốc (mặc định) hay engine cũ (đổi Tỵ và Dậu) */
  phaToai: 'iztro' | 'ansaotuvi';
  /** 10.10 — Lưu Hà: sách Trung Quốc (Đinh Thân, Canh Thìn) hay engine cũ (Đinh Thìn, Canh Thân) */
  luuHa: 'trungQuoc' | 'ansaotuvi';
  /** 10.11 — Thiên Trù can Quý: Tuất (mặc định) hay Hợi (iztro) */
  thienTruQuy: 'tuat' | 'hoi';
  /** 10.7 — Thiên Giải: Thân + 2(M−1) (mặc định), theo cặp tháng, hay Thân + (M−1) */
  thienGiai: 'thienLuong' | 'capThang' | 'thanThuan';
  /** 10.14 — Mệnh chủ tra theo chi năm sinh (mặc định, phái Việt) hay chi cung Mệnh */
  menhChu: 'chiNam' | 'cungMenh';
  /** Mục 6 đặc tả — độ sáng Tử Vi ở Tý, Ngọ: Tý Bình, Ngọ Miếu (mặc định), cùng Miếu, hay cùng Bình */
  tuViTyNgo: 'ansaotuvi' | 'cungMieu' | 'cungBinh';
  /** Mục 6 đặc tả — độ sáng Hóa Lộc, Quyền, Kỵ: theo bảng ansaotuvi (mặc định) hay không ghi */
  dacTinhHoa: 'ansaotuvi' | 'an';
}

export interface ThongTinSinh {
  lich: 'duong' | 'am';
  ngay: number;
  thang: number;
  nam: number;
  nhuan?: boolean;
  gio: number; // 0–23, giờ đồng hồ
  phut?: number; // 0–59
  mienNamTruoc1975?: boolean; // sinh ở miền Nam, giờ khai sinh theo đồng hồ UTC+8 (1960–1975)
  /** Sinh ở nước ngoài, chỉ dùng khi nhập dương lịch: gio/phut là giờ đồng hồ nơi sinh. Loại trừ mienNamTruoc1975. */
  sinhNuocNgoai?: boolean;
  /** Múi giờ nơi sinh theo giờ đồng hồ khi đó (−12…+14, bước 0,25; đã gồm giờ mùa hè nếu có). Bắt buộc khi sinhNuocNgoai. */
  muiGioUTC?: number;
  /** Tên nước, chỉ để hiển thị/lưu; engine không dùng. */
  nuoc?: string;
  gioiTinh: 'nam' | 'nu';
  ten?: string;
  quyUoc?: Partial<QuyUoc>;
}

export interface LaSo {
  ten: string;
  gioiTinh: 'Nam' | 'Nữ';
  amDuong: string;
  amDuongLy: string;
  duong: { ngay: number; thang: number; nam: number };
  am: { ngay: number; thang: number; nam: number; nhuan: boolean };
  gio: { chi: string; khoang: string; canChi: string; dongHo: string };
  canChi: { nam: string; thang: string; ngay: string; gio: string };
  conGiap: string;
  banMenh: string;
  hanhMenh: NguHanh;
  cuc: string;
  cucHanh: NguHanh;
  sinhKhac: string;
  menhTai: string;
  thanTai: string;
  menhChu: string; // theo quy ước menhChu
  menhChuCach: { theoChiNam: string; theoCungMenh: string };
  thanChu: string;
  tuan: string;
  triet: string;
  /** Giờ sinh sau khi quy về giờ chuẩn UTC+7 (đặc tả 1.2) */
  gioChuan: { ngay: number; thang: number; nam: number; gio: string; daQuyDoi: boolean; nguon?: 'nuocNgoai' };
  /** Chỉ có khi sinh ở nước ngoài: giờ khai sinh theo đồng hồ nơi sinh, để viết câu quy ước */
  nuocNgoai: { muiGioUTC: number; ngay: number; thang: number; nam: number; gio: string } | null;
  /** Múi giờ đã dùng để đổi âm lịch (8 với ngày trước 1968) */
  amLichTz: 7 | 8;
  /** Chỉ số nội bộ (0 = Giáp/Tý) để an sao lưu */
  chiSo: { canNam: number; chiNam: number; thang: number; gio: number };
  quyUoc: QuyUoc;
  cung: Cung[]; // 12 phần tử, chỉ số = chi (0 = Tý)
}

/** Sao lưu niên, lưu tứ hóa và vận hạn của một năm xem (đặc tả mục 7). Chỉ số cung: 0 = Tý … 11 = Hợi. */
export interface LuuNien {
  namXem: number; // năm âm lịch
  canChi: string;
  tuoiMu: number;
  saoLuu: { key: string; ten: string; chi: number }[];
  luuTuHoa: { hoa: 'Hóa Lộc' | 'Hóa Quyền' | 'Hóa Khoa' | 'Hóa Kỵ'; sao: string; chi: number }[];
  luuThaiTue: number;
  daiVan: number | null;
  tieuHan: number | null;
  luuNguyet: number[]; // cung của tháng 1…12
}

interface Engine {
  anLaSo(opts: ThongTinSinh): LaSo;
  anLuuNien(ls: LaSo, namXem: number, tuyChon?: { dayDu?: boolean }): LuuNien;
  tomTat(ls: LaSo): string;
}

const engine = TuViRaw as unknown as Engine;
const Lich = LichRaw as unknown as { duongSangAm(d: number, m: number, y: number): { nam: number } };

import { muiGioHopLe, nhanMuiGio } from './nhe';
export { muiGioHopLe, nhanMuiGio };

/** Kiểm tra dữ liệu đầu vào trước khi an sao. Trả về thông báo lỗi tiếng Việt, hoặc null nếu hợp lệ. */
export function kiemTraThongTin(t: Partial<ThongTinSinh>): string | null {
  const { ngay, thang, nam, gio, gioiTinh } = t;
  if (!gioiTinh) return 'Vui lòng chọn giới tính.';
  if (!Number.isInteger(nam) || nam! < 1900 || nam! > 2100) return 'Năm sinh cần trong khoảng 1900–2100.';
  if (!Number.isInteger(thang) || thang! < 1 || thang! > 12) return 'Tháng sinh không hợp lệ.';
  if (!Number.isInteger(ngay) || ngay! < 1 || ngay! > 31) return 'Ngày sinh không hợp lệ.';
  if (!Number.isInteger(gio) || gio! < 0 || gio! > 23) return 'Vui lòng chọn giờ sinh.';
  if (t.phut != null && (!Number.isInteger(t.phut) || t.phut < 0 || t.phut > 59)) return 'Phút sinh cần trong khoảng 0–59.';
  if (t.sinhNuocNgoai) {
    if (t.mienNamTruoc1975) return 'Chỉ chọn một trong hai: sinh ở nước ngoài hoặc sinh ở miền Nam trước 1975.';
    if (t.lich !== 'am' && !muiGioHopLe(t.muiGioUTC)) return 'Vui lòng chọn múi giờ nơi sinh (từ UTC−12 đến UTC+14).';
  }
  if (t.lich === 'duong') {
    const d = new Date(Date.UTC(nam!, thang! - 1, ngay!));
    if (d.getUTCDate() !== ngay) return 'Ngày dương lịch không tồn tại.';
  } else if (ngay! > 30) {
    return 'Tháng âm lịch chỉ có tối đa 30 ngày.';
  }
  return null;
}

/** Lập lá số. Ném lỗi nếu ngày âm lịch không tồn tại. */
export function lapLaSo(t: ThongTinSinh): LaSo {
  const loi = kiemTraThongTin(t);
  if (loi) throw new Error(loi);
  return engine.anLaSo(t);
}

/** Các quy ước đã áp dụng cho lá số này, viết cho người xem ("Lá số lập theo…"). */
export function moTaQuyUoc(ls: LaSo): string[] {
  const ds: string[] = [];
  const g = ls.gioChuan;
  if (g.nguon === 'nuocNgoai' && ls.nuocNgoai) {
    const n = ls.nuocNgoai;
    ds.push(`Giờ khai sinh ${n.gio} ngày ${n.ngay}/${n.thang}/${n.nam} (${nhanMuiGio(n.muiGioUTC)}) quy về giờ chuẩn UTC+7 = ${g.gio} ngày ${g.ngay}/${g.thang}/${g.nam}.`);
  } else if (g.daQuyDoi) ds.push(`Giờ khai sinh miền Nam (đồng hồ UTC+8) đã quy về giờ chuẩn: ${g.gio} ngày ${g.ngay}/${g.thang}/${g.nam}.`);
  if (g.gio.startsWith('23:')) {
    ds.push(ls.quyUoc.gioTyMuon === 'ngaySau'
      ? 'Sinh từ 23 giờ: tính sang ngày hôm sau (giờ Tý của ngày mới).'
      : 'Sinh từ 23 giờ: giữ ngày sinh cũ, chỉ đổi sang giờ Tý (theo lựa chọn của bạn).');
  }
  if (ls.amLichTz === 8) ds.push('Âm lịch trước năm 1968 tính theo lịch thời đó (múi giờ UTC+8).');
  else if (ls.quyUoc.muiGioLich === 'utc7' && ls.duong.nam < 1968) ds.push('Âm lịch trước năm 1968 tính theo múi giờ UTC+7 như lịch hiện nay (theo lựa chọn của bạn).');
  return ds;
}

/**
 * An sao lưu cho năm âm lịch namXem. Mặc định 9 sao lưu phổ biến ở phái Việt và lưu tứ hóa;
 * dayDu thêm Lưu Khôi, Việt, Xương, Khúc, Hồng Loan, Thiên Hỷ.
 */
export function luuNien(ls: LaSo, namXem: number, dayDu = false): LuuNien {
  return engine.anLuuNien(ls, namXem, { dayDu });
}

/** Năm âm lịch hiện tại theo giờ Việt Nam. */
export function namAmHienTai(): number {
  const vn = new Date(Date.now() + 7 * 3600 * 1000);
  return Lich.duongSangAm(vn.getUTCDate(), vn.getUTCMonth() + 1, vn.getUTCFullYear()).nam;
}

/** Tóm tắt lá số thành văn bản gọn (dùng làm đầu vào cho phần luận giải). */
export function tomTatLaSo(ls: LaSo): string {
  return engine.tomTat(ls);
}

export { CHI, canhGio, GIO_SINH } from './nhe';

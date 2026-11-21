// Lớp bọc TypeScript đầy đủ kiểu cho bộ máy an sao Tử Vi v2 (tuvi-raw.js, xem NOTICE).
// Đầu vào, đầu ra và toàn bộ tùy chọn trường phái bám theo mục 9 & mục 10 của đặc tả
// docs/v2/tai-san-xemtuvi/docs/nghien-cuu/tuvi-an-sao-spec.md.

import TuViRaw from './tuvi-raw.js';
import { duongSangAm } from './am-lich';
import { muiGioHopLe, nhanMuiGio } from './nhe';

export { muiGioHopLe, nhanMuiGio, CHI, canhGio, GIO_SINH } from './nhe';

export type NguHanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
export type DacTinh = 'M' | 'V' | 'Đ' | 'B' | 'H';
export type DacTinhTen = 'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Hãm';
export type LoaiSao = 'chinh' | 'cat' | 'sat';
export type HoaTen = 'Hóa Lộc' | 'Hóa Quyền' | 'Hóa Khoa' | 'Hóa Kỵ';

export interface Sao {
  key: string;
  ten: string;
  hanh: NguHanh;
  loai: LoaiSao;
  dacTinh: DacTinh | null;
  dacTinhTen: DacTinhTen | null;
  hoa: HoaTen | null;
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

/**
 * Toàn bộ điểm bất đồng trường phái (đặc tả mục 10).
 * Không truyền thì dùng mặc định theo đặc tả; kết quả lá số luôn trả kèm đối tượng QuyUoc đã áp dụng.
 */
export interface QuyUoc {
  /** 10.1 — Giờ Tý muộn 23:00–23:59: sang ngày sau (mặc định), giữ ngày, hoặc cộng ngày âm giữ tháng (iztro) */
  gioTyMuon: 'ngaySau' | 'giuNgay' | 'congNgayAm';
  /** 10.2 — Múi giờ tính âm lịch trước 01/01/1968: UTC+8 trước 1968 (mặc định) hay UTC+7 mọi năm */
  muiGioLich: 'lichSu' | 'utc7';
  /** 10.3 — Giờ đồng hồ miền Nam 1960–1975 (UTC+8): đổi theo IANA về UTC+7 (mặc định) hay không đổi */
  chuanHoaGioMienNam: 'iana' | 'khong';
  /** 10.4 — Tứ hóa can Canh, Nhâm: bảng Việt (mặc định) hay phái Trung Quốc (iztro) */
  tuHoa: 'viet' | 'trungQuoc';
  /** 10.5 — Chiều đếm Hỏa/Linh: phái Việt theo âm dương nam nữ (mặc định) hay cả hai thuận (iztro) */
  chieuHoaLinh: 'viet' | 'thuan';
  /** 10.6 — Hỏa, Linh tuổi Tỵ Dậu Sửu: câu phú (Hỏa Mão, Linh Tuất — mặc định) hay ansaotuvi cũ */
  hoaLinh: 'cauPhu' | 'ansaotuvi';
  /** 10.7 — Thiên Giải: Thân + 2(M−1) (mặc định), theo cặp tháng, hay Thân + (M−1) */
  thienGiai: 'thienLuong' | 'capThang' | 'thanThuan';
  /** 10.8 — Thiên Khôi, Thiên Việt: Toàn Thư (mặc định), "Canh Tân phùng Mã Hổ", hay ansaotuvi cũ */
  khoiViet: 'toanThu' | 'canhTanMaHo' | 'ansaotuvi';
  /** 10.9 — Phá Toái: bảng chuẩn iztro/sách TQ (mặc định) hay ansaotuvi cũ */
  phaToai: 'iztro' | 'ansaotuvi';
  /** 10.10 — Lưu Hà: Đinh Thân, Canh Thìn (mặc định) hay ansaotuvi cũ */
  luuHa: 'trungQuoc' | 'ansaotuvi';
  /** 10.11 — Thiên Trù can Quý: Tuất (mặc định) hay Hợi (iztro) */
  thienTruQuy: 'tuat' | 'hoi';
  /** 10.12 — Thiên Thương, Thiên Sứ: cố định Thương Nô/Sứ Tật (mặc định) hay Trung Châu đổi chỗ cho Âm Nam/Dương Nữ */
  thuongSu: 'coDinh' | 'trungChau';
  /** 10.13 — Tháng nhuận: an như tháng chính (mặc định), chia đôi ở ngày 15, hay tính tháng sau */
  thangNhuan: 'thangChinh' | 'chiaNgay15' | 'thangSau';
  /** 10.14 — Mệnh chủ: tra theo chi năm sinh (mặc định, phái Việt) hay chi cung Mệnh */
  menhChu: 'chiNam' | 'cungMenh';
  /** 10.15 — Tuần, Triệt: hai cung ở vạch giữa (mặc định, phái Việt) hay chọn một cung (iztro) */
  tuanTriet: 'haiCung' | 'motCung';
  /** 10.16 — Bảng độ sáng: bảng Việt (mặc định) */
  bangDoSang: 'viet';
  /** Mục 6 — Độ sáng Tử Vi ở Tý, Ngọ: Tý Bình/Ngọ Miếu (mặc định), cùng Miếu, hay cùng Bình */
  tuViTyNgo: 'ansaotuvi' | 'cungMieu' | 'cungBinh';
  /** Mục 6 — Độ sáng Hóa Lộc, Quyền, Kỵ: theo ansaotuvi (mặc định) hay ẩn */
  dacTinhHoa: 'ansaotuvi' | 'an';
  /** 10.17 — Ranh giới năm: theo mùng 1 Tết âm lịch (mặc định Tử Vi) */
  ranhGioiNam: 'tet';
  /** 10.18 — Hiệu chỉnh giờ mặt trời thực: mặc định false (dùng giờ đồng hồ chuẩn UTC+7) */
  gioMatTroiThuc: false;
}

export interface ThongTinSinh {
  lich: 'duong' | 'am';
  ngay: number;
  thang: number;
  nam: number;
  nhuan?: boolean;
  gio: number; // 0–23, giờ đồng hồ
  phut?: number; // 0–59
  /** Sinh ở miền Nam giai đoạn 01/01/1960–13/06/1975 (đồng hồ UTC+8) */
  mienNamTruoc1975?: boolean;
  /** Sinh ở nước ngoài (chỉ áp dụng khi lich = 'duong'). Loại trừ mienNamTruoc1975. */
  sinhNuocNgoai?: boolean;
  /** Múi giờ đồng hồ nơi sinh (−12…+14, bước 0,25). Bắt buộc khi sinhNuocNgoai = true. */
  muiGioUTC?: number;
  /** Tên nước (chỉ để hiển thị/lưu) */
  nuoc?: string;
  gioiTinh: 'nam' | 'nu';
  ten?: string;
  quyUoc?: Partial<QuyUoc>;
}

export interface GioChuan {
  ngay: number;
  thang: number;
  nam: number;
  gio: string; // "HH:MM"
  daQuyDoi: boolean;
  nguon?: 'nuocNgoai';
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
  /** Mệnh chủ theo quy ước đang chọn (mặc định: theo chi năm sinh) */
  menhChu: string;
  /** Hai cách tra Mệnh chủ (mục 9 & 8.2) để hiển thị đối chiếu */
  menhChuCach: { theoChiNam: string; theoCungMenh: string };
  thanChu: string;
  /** Chuỗi tên cung Tuần, Triệt (vd "Thân–Dậu") */
  tuan: string;
  triet: string;
  /** Mảng chỉ số cung 0–11 của Tuần, Triệt (mục 9: 2 phần tử mặc định, 1 phần tử nếu tuanTriet = 'motCung') */
  tuanCung: number[];
  trietCung: number[];
  /** Giờ sinh sau khi chuẩn hóa về UTC+7 (mục 1.2 & mục 9) */
  gioChuan: GioChuan;
  /** Giờ khai sinh gốc khi sinh ở nước ngoài */
  nuocNgoai: { muiGioUTC: number; ngay: number; thang: number; nam: number; gio: string } | null;
  /** Múi giờ đã dùng để đổi âm lịch (8 cho ngày trước 1968 theo quy ước lịch sử) */
  amLichTz: 7 | 8;
  /** Chỉ số nội bộ (0 = Giáp/Tý) để an lưu niên */
  chiSo: { canNam: number; chiNam: number; thang: number; gio: number };
  /** Toàn bộ quy ước trường phái đã áp dụng cho lá số này (mục 9 & 10) */
  quyUoc: QuyUoc;
  /** 12 cung theo địa chi 0 = Tý … 11 = Hợi */
  cung: Cung[];
}

/** Sao lưu niên, lưu tứ hóa và vận hạn năm xem (đặc tả mục 7 & mục 9). Chỉ số cung: 0 = Tý … 11 = Hợi. */
export interface LuuNien {
  namXem: number;
  canChi: string;
  tuoiMu: number;
  saoLuu: { key: string; ten: string; chi: number }[];
  luuTuHoa: { hoa: HoaTen; sao: string; chi: number }[];
  luuThaiTue: number;
  daiVan: number | null;
  tieuHan: number | null;
  luuNguyet: number[]; // 12 chỉ số cung cho tháng 1…12 âm lịch
}

interface Engine {
  anLaSo(opts: ThongTinSinh): LaSo;
  anLuuNien(ls: LaSo, namXem: number, tuyChon?: { dayDu?: boolean }): LuuNien;
  tomTat(ls: LaSo): string;
  QUY_UOC_MAC_DINH: QuyUoc;
}

const engine = TuViRaw as unknown as Engine;

export const QUY_UOC_MAC_DINH: Readonly<QuyUoc> = Object.freeze({ ...engine.QUY_UOC_MAC_DINH });

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

/** Lập lá số Tử Vi v2. Ném lỗi nếu đầu vào hoặc ngày âm lịch không hợp lệ. */
export function lapLaSo(input: ThongTinSinh): LaSo {
  const loi = kiemTraThongTin(input);
  if (loi) throw new Error(loi);
  return engine.anLaSo(input);
}

/**
 * An sao lưu, lưu tứ hóa, đại vận, tiểu hạn và lưu nguyệt cho năm âm lịch `namXem` (mục 7 & 9).
 * Mặc định trả 9 sao lưu phổ biến phái Việt; truyền `dayDu = true` để thêm 6 sao phụ.
 */
export function luuNien(ls: LaSo, namXem: number, dayDu = false): LuuNien {
  return engine.anLuuNien(ls, namXem, { dayDu });
}

/** Các quy ước đã áp dụng cho lá số, viết thành câu dễ hiểu để hiển thị công khai ("Lá số lập theo…"). */
export function moTaQuyUoc(ls: LaSo): string[] {
  const ds: string[] = [];
  const g = ls.gioChuan;
  if (g.nguon === 'nuocNgoai' && ls.nuocNgoai) {
    const n = ls.nuocNgoai;
    ds.push(`Giờ khai sinh ${n.gio} ngày ${n.ngay}/${n.thang}/${n.nam} (${nhanMuiGio(n.muiGioUTC)}) quy về giờ chuẩn UTC+7 = ${g.gio} ngày ${g.ngay}/${g.thang}/${g.nam}.`);
  } else if (g.daQuyDoi) {
    ds.push(`Giờ khai sinh miền Nam (đồng hồ UTC+8) đã quy về giờ chuẩn: ${g.gio} ngày ${g.ngay}/${g.thang}/${g.nam}.`);
  }
  if (g.gio.startsWith('23:')) {
    if (ls.quyUoc.gioTyMuon === 'ngaySau') {
      ds.push('Sinh từ 23 giờ: tính sang ngày hôm sau (giờ Tý của ngày mới).');
    } else if (ls.quyUoc.gioTyMuon === 'congNgayAm') {
      ds.push('Sinh từ 23 giờ: cộng 1 ngày âm, giữ tháng âm (theo tùy chọn iztro).');
    } else {
      ds.push('Sinh từ 23 giờ: giữ ngày sinh cũ, chỉ đổi sang giờ Tý (theo lựa chọn của bạn).');
    }
  }
  if (ls.am.nhuan) {
    const tn = ls.quyUoc.thangNhuan;
    ds.push(
      tn === 'thangChinh'
        ? 'Sinh tháng nhuận: an sao như tháng chính (quy ước Nam Phái).'
        : tn === 'chiaNgay15'
          ? 'Sinh tháng nhuận: ngày 1–15 tính tháng chính, từ ngày 16 tính tháng sau.'
          : 'Sinh tháng nhuận: tính sang tháng sau.'
    );
  }
  if (ls.amLichTz === 8) {
    ds.push('Âm lịch trước năm 1968 tính theo lịch thời đó (múi giờ UTC+8).');
  } else if (ls.quyUoc.muiGioLich === 'utc7' && ls.duong.nam < 1968) {
    ds.push('Âm lịch trước năm 1968 tính theo múi giờ UTC+7 như lịch hiện nay (theo lựa chọn của bạn).');
  }
  return ds;
}

/** Năm âm lịch hiện tại theo giờ Việt Nam (UTC+7). */
export function namAmHienTai(): number {
  const vn = new Date(Date.now() + 7 * 3600 * 1000);
  return duongSangAm(vn.getUTCDate(), vn.getUTCMonth() + 1, vn.getUTCFullYear()).nam;
}

/** Tóm tắt lá số thành văn bản gọn để truyền cho tầng luận giải. */
export function tomTatLaSo(ls: LaSo): string {
  return engine.tomTat(ls);
}

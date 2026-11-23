/**
 * am-lich.ts — Chuyển đổi dương lịch ↔ âm lịch Việt Nam và tính Can Chi, Nạp Âm.
 *
 * Mã nguồn này được viết độc lập, không dựa trên mã Hồ Ngọc Đức.
 *
 * Nguồn công thức thiên văn công khai:
 *  - Ngày Julius (JDN): Jean Meeus, "Astronomical Algorithms", 2nd ed. (1998), Chương 7 (tr. 59–63).
 *  - Thời điểm trăng mới (Sóc): Jean Meeus, "Astronomical Algorithms", 2nd ed. (1998), Chương 49
 *    (mốc J2000, công thức 49.1, bảng hiệu chỉnh tuần hoàn tr. 351 và 14 số hạng hành tinh A1–A14).
 *  - Kinh độ hoàng đạo biểu kiến Mặt Trời: VSOP87D từ ./tiet-khi.mjs (Bretagnon & Francou 1988,
 *    trích từ gói astronomia — giấy phép MIT; kèm hiệu chỉnh FK5, quang sai, đốt sai Meeus 22.2).
 *  - Hiệu chỉnh thời gian ΔT = TT − UT: đa thức phân đoạn của Fred Espenak & Jean Meeus,
 *    NASA TP-2006-214141 ("Five Millennium Canon of Solar Eclipses").
 *  - Quy tắc lịch âm dương Việt Nam công khai (đặc tả mục 1.5 & 2.1):
 *      + Tháng 11 âm lịch là tháng chứa ngày Đông chí (kinh độ Mặt Trời 270°).
 *      + Giữa hai tháng 11 liên tiếp có 13 kỳ sóc thì có tháng nhuận: tháng đầu tiên sau tháng 11
 *        không chứa trung khí (kinh độ Mặt Trời không vượt bội số 30° trong tháng).
 *      + Múi giờ lịch sử Việt Nam: UTC+8 cho ngày trước 01/01/1968, UTC+7 từ 01/01/1968.
 */

import { kinhDoTaiJde } from './tiet-khi.mjs';
import { uocLuongDeltaT } from './delta-t.mjs';
export { uocLuongDeltaT };

const RAD = Math.PI / 180;
const J2000_JD = 2451545.0;
const CHU_KY_SOC = 29.530588861;

export type NguHanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
export type CheDoMuiGio = number | 'lichSu';

export interface NgayDuong {
  ngay: number;
  thang: number;
  nam: number;
}

export interface NgayAm {
  ngay: number;
  thang: number;
  nam: number;
  nhuan: boolean;
}

export interface CapCanChi {
  can: number;
  chi: number;
  tenCan: string;
  tenChi: string;
  ten: string;
}

export const THIEN_CAN = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý',
] as const;

export const DIA_CHI = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi',
] as const;

export const TEN_CON_GIAP = [
  'Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn',
] as const;

export const KHUNG_GIO = [
  '23:00–00:59', '01:00–02:59', '03:00–04:59', '05:00–06:59',
  '07:00–08:59', '09:00–10:59', '11:00–12:59', '13:00–14:59',
  '15:00–16:59', '17:00–18:59', '19:00–20:59', '21:00–22:59',
] as const;

// 30 nạp âm cổ điển (đặc tả mục 3.1), mỗi nạp âm ứng với 2 hoa giáp liên tiếp.
const BANG_NAP_AM: readonly string[] = [
  'Hải Trung Kim', 'Lô Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa',
  'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ',
  'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc',
  'Bích Thượng Thổ', 'Kim Bạch Kim', 'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim',
  'Tang Đố Mộc', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy',
];

function chiaDuDuong(giaTri: number, mau: number): number {
  return ((giaTri % mau) + mau) % mau;
}

// ---- 1. Ngày Julius (Meeus Chương 7, tr. 59–63) ----

/**
 * Đổi ngày dương lịch (Gregory từ 15/10/1582, Julius trước đó) sang số ngày Julius nguyên (JDN).
 * Quy ước: JDN là số nguyên ứng với 12:00 UT của ngày đó (ví dụ 01/01/2000 → 2451545).
 */
export function soNgayJulius(ngay: number, thang: number, nam: number): number {
  let y = nam;
  let m = thang;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const laGregory = nam > 1582 || (nam === 1582 && (thang > 10 || (thang === 10 && ngay >= 15)));
  let bu = 0;
  if (laGregory) {
    const theKy = Math.floor(y / 100);
    bu = 2 - theKy + Math.floor(theKy / 4);
  }
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + ngay + bu - 1524;
}

/** Đổi số ngày Julius nguyên (JDN) về ngày dương lịch { ngay, thang, nam } (Meeus Chương 7, tr. 63). */
export function tuSoNgayJulius(jdn: number): NgayDuong {
  const z = Math.floor(jdn);
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const ngay = b - d - Math.floor(30.6001 * e);
  const thang = e < 14 ? e - 1 : e - 13;
  const nam = thang > 2 ? c - 4716 : c - 4715;
  return { ngay, thang, nam };
}

/** Mốc JDN của ngày 01/01/1968 — thời điểm lịch âm Việt Nam chính thức chuyển sang UTC+7. */
export const JDN_MOC_1968 = soNgayJulius(1, 1, 1968);

/** Múi giờ lịch âm lịch sử theo năm dương lịch: UTC+8 trước 1968, UTC+7 từ 1968. */
export function muiGioLichSuTheoNam(nam: number): 7 | 8 {
  return nam < 1968 ? 8 : 7;
}

/** Múi giờ lịch âm lịch sử theo JDN: UTC+8 trước 01/01/1968, UTC+7 từ 01/01/1968. */
export function muiGioLichSuTheoJdn(jdn: number): 7 | 8 {
  return jdn < JDN_MOC_1968 ? 8 : 7;
}

// ---- 2. Hiệu chỉnh ΔT = TT − UT (Espenak & Meeus, NASA TP-2006-214141) ----

// Đa thức Espenak–Meeus nằm ở ./delta-t.mjs (dùng chung với tiet-khi.mjs).

function deltaTTuJd(jd: number): number {
  return uocLuongDeltaT(2000 + (jd - J2000_JD) / 365.25);
}

// ---- 3. Thời điểm trăng mới / Sóc (Meeus 2nd ed. 1998, Chương 49) ----

// 25 số hạng tuần hoàn chính cho pha Trăng mới (Meeus 1998, tr. 351):
// [hệ số ngày, lũy thừa E, bội M, bội M', bội F, bội Ω]
const SO_HANG_TRANG_MOI: readonly (readonly [number, number, number, number, number, number])[] = [
  [-0.40720, 0, 0, 1, 0, 0],
  [0.17241, 1, 1, 0, 0, 0],
  [0.01608, 0, 0, 2, 0, 0],
  [0.01039, 0, 0, 0, 2, 0],
  [0.00739, 1, -1, 1, 0, 0],
  [-0.00514, 1, 1, 1, 0, 0],
  [0.00208, 2, 2, 0, 0, 0],
  [-0.00111, 0, 0, 1, -2, 0],
  [-0.00057, 0, 0, 1, 2, 0],
  [0.00056, 1, 1, 2, 0, 0],
  [-0.00042, 0, 0, 3, 0, 0],
  [0.00042, 1, 1, 0, 2, 0],
  [0.00038, 1, 1, 0, -2, 0],
  [-0.00024, 1, -1, 2, 0, 0],
  [-0.00017, 0, 0, 0, 0, 1],
  [-0.00007, 0, 2, 1, 0, 0],
  [0.00004, 0, 0, 2, -2, 0],
  [0.00004, 0, 3, 0, 0, 0],
  [0.00003, 0, 1, 1, -2, 0],
  [0.00003, 0, 0, 2, 2, 0],
  [-0.00003, 0, 1, 1, 2, 0],
  [0.00003, 0, -1, 1, 2, 0],
  [-0.00002, 0, -1, 1, -2, 0],
  [-0.00002, 0, 1, 3, 0, 0],
  [0.00002, 0, 0, 4, 0, 0],
];

// 14 số hạng nhiễu loạn hành tinh A1–A14 (Meeus 1998, tr. 351–352):
// [hệ số ngày, góc gốc độ, tốc độ theo k, hệ số T²]
const SO_HANG_HANH_TINH: readonly (readonly [number, number, number, number])[] = [
  [0.000325, 299.77, 0.107408, -0.009173],
  [0.000165, 251.88, 0.016321, 0],
  [0.000164, 251.83, 26.651886, 0],
  [0.000126, 349.42, 36.412478, 0],
  [0.000110, 84.66, 18.206239, 0],
  [0.000062, 141.74, 53.303771, 0],
  [0.000060, 207.14, 2.453732, 0],
  [0.000056, 154.84, 7.306860, 0],
  [0.000047, 34.52, 27.261239, 0],
  [0.000042, 207.19, 0.121824, 0],
  [0.000040, 291.34, 1.844379, 0],
  [0.000037, 161.72, 24.198154, 0],
  [0.000035, 239.56, 25.513099, 0],
  [0.000023, 331.55, 3.592518, 0],
];

/**
 * Thời điểm trăng mới (Sóc) thực thứ `chiSoSoc` (k nguyên, k = 0 là Sóc 06/01/2000),
 * trả về JDE (thang thời gian động lực học TT).
 */
export function jdeTrangMoi(chiSoSoc: number): number {
  const k = Math.round(chiSoSoc);
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t2 * t2;

  // Công thức 49.1: JDE trăng mới trung bình
  const jdeTrungBinh = 2451550.09766
    + CHU_KY_SOC * k
    + 0.00015437 * t2
    - 0.000000150 * t3
    + 0.00000000073 * t4;

  // Độ lệch tâm quỹ đạo Trái Đất (47.6) và 4 đối số cơ bản (49.4–49.7)
  const e = 1 - 0.002516 * t - 0.0000074 * t2;
  const e2 = e * e;
  const mMt = (2.5534 + 29.10535670 * k - 0.0000014 * t2 - 0.00000011 * t3) * RAD;
  const mTrang = (201.5643 + 385.81693528 * k + 0.0107582 * t2 + 0.00001238 * t3 - 0.000000058 * t4) * RAD;
  const fTrang = (160.7108 + 390.67050284 * k - 0.0016118 * t2 - 0.00000227 * t3 + 0.000000011 * t4) * RAD;
  const nutLen = (124.7746 - 1.56375588 * k + 0.0020672 * t2 + 0.00000215 * t3) * RAD;

  let hieuChinh = 0;
  for (let i = 0; i < SO_HANG_TRANG_MOI.length; i++) {
    const [heSo, bacE, bM, bMp, bF, bOm] = SO_HANG_TRANG_MOI[i];
    const goc = bM * mMt + bMp * mTrang + bF * fTrang + bOm * nutLen;
    const nhanE = bacE === 0 ? 1 : bacE === 1 ? e : e2;
    hieuChinh += heSo * nhanE * Math.sin(goc);
  }
  for (let i = 0; i < SO_HANG_HANH_TINH.length; i++) {
    const [heSo, goc0, tocDo, heSoT2] = SO_HANG_HANH_TINH[i];
    const goc = (goc0 + tocDo * k + heSoT2 * t2) * RAD;
    hieuChinh += heSo * Math.sin(goc);
  }

  return jdeTrungBinh + hieuChinh;
}

/** Số ngày Julius (JDN) của ngày dân dụng chứa thời điểm Sóc thứ `chiSoSoc` theo múi giờ `muiGio`. */
export function ngaySoc(chiSoSoc: number, muiGio = 7): number {
  const jde = jdeTrangMoi(chiSoSoc);
  const jdUt = jde - deltaTTuJd(jde) / 86400;
  return Math.floor(jdUt + 0.5 + muiGio / 24);
}

// ---- 4. Kinh độ Mặt Trời (VSOP87D từ tiet-khi.mjs) và Trung khí ----

/** Kinh độ hoàng đạo biểu kiến Mặt Trời (độ, 0–360) tại 00:00 giờ địa phương (`muiGio`) của ngày `jdn`. */
export function kinhDoMatTroiLuc0Gio(jdn: number, muiGio = 7): number {
  const jdUt = jdn - 0.5 - muiGio / 24;
  const jde = jdUt + deltaTTuJd(jdUt) / 86400;
  return kinhDoTaiJde(jde);
}

/** Cung hoàng đạo 30° (0..11) tại 00:00 giờ địa phương của ngày `jdn` (9 = từ Đông chí 270° đến 300°). */
function cungTrungKhiLuc0Gio(jdn: number, muiGio: number): number {
  return Math.floor(kinhDoMatTroiLuc0Gio(jdn, muiGio) / 30);
}

/**
 * Tìm ngày dân dụng (JDN) xảy ra Đông chí (kinh độ Mặt Trời = 270°) trong năm dương lịch `nam`
 * theo múi giờ `muiGio`. Đông chí luôn rơi vào khoảng 20–23/12 dương lịch.
 */
function ngayDongChi(nam: number, muiGio: number): number {
  let jdn = soNgayJulius(20, 12, nam);
  // Quét từng ngày từ 20/12 cho tới khi sang 00:00 ngày kế tiếp Mặt Trời đã vượt mốc 270° (cung 9)
  for (let buoc = 0; buoc < 6; buoc++) {
    const hienTai = jdn + buoc;
    if (cungTrungKhiLuc0Gio(hienTai + 1, muiGio) === 9) {
      return hienTai;
    }
  }
  throw new Error(`Không xác định được ngày Đông chí năm ${nam}`);
}

// ---- 5. Cấu trúc chu kỳ Đông chí (Tuế) và quy tắc tháng 11 / tháng nhuận ----

interface ThangAmTrongChuKy {
  batDau: number;   // JDN mùng 1 tháng âm (bao gồm)
  ketThuc: number;  // JDN mùng 1 tháng kế tiếp (không bao gồm)
  thang: number;    // 1..12
  namAm: number;    // năm âm lịch của tháng này
  nhuan: boolean;
}

interface ChuKyDongChi {
  dau: number;
  cuoi: number;
  cacThang: ThangAmTrongChuKy[];
}

const BO_NHO_CHU_KY = new Map<string, ChuKyDongChi>();

/** Tìm chỉ số Sóc k sao cho tháng âm [ngaySoc(k), ngaySoc(k+1)) chứa ngày `jdnMucTieu`. */
function timChiSoSocChuaNgay(jdnMucTieu: number, muiGio: number): number {
  let k = Math.round((jdnMucTieu - 2451550.26) / CHU_KY_SOC);
  while (ngaySoc(k, muiGio) > jdnMucTieu) k--;
  while (ngaySoc(k + 1, muiGio) <= jdnMucTieu) k++;
  return k;
}

/**
 * Dựng danh sách toàn bộ các tháng âm lịch từ tháng 11 năm `namDC` (chứa Đông chí năm `namDC`)
 * đến trước tháng 11 năm `namDC + 1` theo múi giờ `muiGio`.
 */
function chuKyDongChi(namDC: number, muiGio: number): ChuKyDongChi {
  const khoa = `${namDC}|${muiGio}`;
  const daCo = BO_NHO_CHU_KY.get(khoa);
  if (daCo) return daCo;

  const dcDau = ngayDongChi(namDC, muiGio);
  const dcSau = ngayDongChi(namDC + 1, muiGio);
  const kDau = timChiSoSocChuaNgay(dcDau, muiGio);
  const kSau = timChiSoSocChuaNgay(dcSau, muiGio);
  const soThang = kSau - kDau; // 12 (năm thường) hoặc 13 (có tháng nhuận trong chu kỳ)

  const mocSoc: number[] = [];
  for (let i = 0; i <= soThang; i++) {
    mocSoc.push(ngaySoc(kDau + i, muiGio));
  }

  let viTriNhuan = -1;
  if (soThang === 13) {
    // Quy tắc công khai: tháng đầu tiên sau tháng 11 không chứa trung khí là tháng nhuận.
    // Một tháng [mocSoc[i], mocSoc[i+1)) không chứa trung khí khi cung 30° lúc 0h hai đầu bằng nhau.
    for (let i = 1; i < soThang; i++) {
      if (cungTrungKhiLuc0Gio(mocSoc[i], muiGio) === cungTrungKhiLuc0Gio(mocSoc[i + 1], muiGio)) {
        viTriNhuan = i;
        break;
      }
    }
  }

  const cacThang: ThangAmTrongChuKy[] = [];
  for (let i = 0; i < soThang; i++) {
    const laNhuan = viTriNhuan >= 0 && i === viTriNhuan;
    const thuTuThangThuong = viTriNhuan >= 0 && i >= viTriNhuan ? i - 1 : i;
    const thang = ((10 + thuTuThangThuong) % 12) + 1;
    const namAm = thuTuThangThuong < 2 ? namDC : namDC + 1;
    cacThang.push({
      batDau: mocSoc[i],
      ketThuc: mocSoc[i + 1],
      thang,
      namAm,
      nhuan: laNhuan,
    });
  }

  const ketQua: ChuKyDongChi = {
    dau: mocSoc[0],
    cuoi: mocSoc[soThang],
    cacThang,
  };
  BO_NHO_CHU_KY.set(khoa, ketQua);
  return ketQua;
}

// ---- 6. API chuyển đổi lịch Dương ↔ Âm ----

function giaiQuyetMuiGioDuong(jdn: number, muiGio: CheDoMuiGio): number {
  return muiGio === 'lichSu' ? muiGioLichSuTheoJdn(jdn) : muiGio;
}

/**
 * Đổi ngày dương lịch sang ngày âm lịch Việt Nam.
 * `muiGio`: số giờ lệch UTC (mặc định 7), hoặc `'lichSu'` (UTC+8 trước 01/01/1968, UTC+7 từ 1968).
 */
export function duongSangAm(ngay: number, thang: number, nam: number, muiGio: CheDoMuiGio = 7): NgayAm {
  const jdn = soNgayJulius(ngay, thang, nam);
  const tz = giaiQuyetMuiGioDuong(jdn, muiGio);

  // JDN nằm trong chu kỳ Đông chí của năm `nam - 1` hoặc `nam` (hiếm khi lệch thêm 1 ở biên)
  let chuKy = chuKyDongChi(nam - 1, tz);
  if (jdn >= chuKy.cuoi) {
    chuKy = chuKyDongChi(nam, tz);
  } else if (jdn < chuKy.dau) {
    chuKy = chuKyDongChi(nam - 2, tz);
  }

  for (let i = 0; i < chuKy.cacThang.length; i++) {
    const th = chuKy.cacThang[i];
    if (jdn >= th.batDau && jdn < th.ketThuc) {
      return {
        ngay: jdn - th.batDau + 1,
        thang: th.thang,
        nam: th.namAm,
        nhuan: th.nhuan,
      };
    }
  }
  throw new Error(`Không tìm thấy tháng âm lịch cho ngày ${ngay}/${thang}/${nam}`);
}

/**
 * Đổi ngày âm lịch sang ngày dương lịch.
 * Trả về `null` nếu tháng nhuận không tồn tại hoặc ngày vượt quá số ngày của tháng (29/30).
 * `muiGio`: số giờ lệch UTC (mặc định 7), hoặc `'lichSu'` (tự dùng UTC+8 nếu kết quả trước 01/01/1968).
 */
export function amSangDuong(
  ngay: number,
  thang: number,
  nam: number,
  nhuan = false,
  muiGio: CheDoMuiGio = 7,
): NgayDuong | null {
  if (!Number.isInteger(ngay) || !Number.isInteger(thang) || !Number.isInteger(nam)) return null;
  if (thang < 1 || thang > 12 || ngay < 1 || ngay > 30) return null;

  const doiTheoTz = (tz: number): NgayDuong | null => {
    const namDC = thang >= 11 ? nam : nam - 1;
    const chuKy = chuKyDongChi(namDC, tz);
    for (let i = 0; i < chuKy.cacThang.length; i++) {
      const th = chuKy.cacThang[i];
      if (th.namAm === nam && th.thang === thang && th.nhuan === Boolean(nhuan)) {
        const soNgay = th.ketThuc - th.batDau;
        if (ngay > soNgay) return null;
        return tuSoNgayJulius(th.batDau + ngay - 1);
      }
    }
    return null;
  };

  if (muiGio === 'lichSu') {
    const kq7 = doiTheoTz(7);
    if (!kq7 || soNgayJulius(kq7.ngay, kq7.thang, kq7.nam) < JDN_MOC_1968) {
      const kq8 = doiTheoTz(8);
      if (kq8 && soNgayJulius(kq8.ngay, kq8.thang, kq8.nam) < JDN_MOC_1968) return kq8;
    }
    return kq7;
  }

  return doiTheoTz(muiGio);
}

/** Đổi dương → âm theo quy ước lịch sử Việt Nam (UTC+8 trước 01/01/1968, UTC+7 từ 01/01/1968). */
export function duongSangAmLichSu(ngay: number, thang: number, nam: number): NgayAm {
  return duongSangAm(ngay, thang, nam, 'lichSu');
}

/** Đổi âm → dương theo quy ước lịch sử Việt Nam (UTC+8 trước 01/01/1968, UTC+7 từ 01/01/1968). */
export function amSangDuongLichSu(ngay: number, thang: number, nam: number, nhuan = false): NgayDuong | null {
  return amSangDuong(ngay, thang, nam, nhuan, 'lichSu');
}

/**
 * Tháng nhuận của năm âm lịch `namAm` (1..12), hoặc 0 nếu năm đó không nhuận.
 * Quét cả chu kỳ Đông chí `namAm - 1` (tháng 1..10) và `namAm` (tháng 11..12),
 * nên xử lý đúng cả trường hợp tháng 11 nhuận như năm 2033.
 */
export function thangNhuan(namAm: number, muiGio: CheDoMuiGio = 7): number {
  const tz = muiGio === 'lichSu' ? muiGioLichSuTheoNam(namAm) : muiGio;
  for (const namDC of [namAm - 1, namAm]) {
    const chuKy = chuKyDongChi(namDC, tz);
    for (let i = 0; i < chuKy.cacThang.length; i++) {
      const th = chuKy.cacThang[i];
      if (th.namAm === namAm && th.nhuan) return th.thang;
    }
  }
  return 0;
}

/** Số ngày (29 hoặc 30) của một tháng âm lịch; trả về 0 nếu tháng không tồn tại. */
export function soNgayThangAm(thang: number, nam: number, nhuan = false, muiGio: CheDoMuiGio = 7): number {
  const tz = muiGio === 'lichSu' ? muiGioLichSuTheoNam(nam) : muiGio;
  const namDC = thang >= 11 ? nam : nam - 1;
  const chuKy = chuKyDongChi(namDC, tz);
  for (let i = 0; i < chuKy.cacThang.length; i++) {
    const th = chuKy.cacThang[i];
    if (th.namAm === nam && th.thang === thang && th.nhuan === Boolean(nhuan)) {
      return th.ketThuc - th.batDau;
    }
  }
  return 0;
}

// ---- 7. Can Chi (năm, tháng, ngày, giờ) & Nạp Âm (đặc tả mục 2.1 & 3.1) ----

function taoCapCanChi(can: number, chi: number): CapCanChi {
  const c = chiaDuDuong(can, 10);
  const z = chiaDuDuong(chi, 12);
  const tenCan = THIEN_CAN[c];
  const tenChi = DIA_CHI[z];
  return { can: c, chi: z, tenCan, tenChi, ten: `${tenCan} ${tenChi}` };
}

/** Can Chi của năm âm lịch `namAm`. */
export function canChiNam(namAm: number): CapCanChi {
  return taoCapCanChi(namAm + 6, namAm + 8);
}

/** Can Chi của tháng âm lịch (Ngũ Hổ Độn, tháng Giêng là tháng Dần). Tháng nhuận dùng tháng chính. */
export function canChiThang(thangAm: number, namAm: number): CapCanChi {
  const canNam = chiaDuDuong(namAm + 6, 10);
  const canThangGieng = (canNam % 5) * 2 + 2;
  return taoCapCanChi(canThangGieng + (thangAm - 1), thangAm + 1);
}

/** Can Chi của ngày theo số ngày Julius `jdn`. */
export function canChiNgay(jdn: number): CapCanChi {
  return taoCapCanChi(jdn + 9, jdn + 1);
}

/** Chỉ số canh giờ (0 = Tý … 11 = Hợi) của giờ đồng hồ 0..23. */
export function chiCanhGio(gioDongHo: number): number {
  return Math.floor(chiaDuDuong(gioDongHo + 1, 24) / 2);
}

/** Thiên can khởi giờ Tý theo thiên can ngày (Ngũ Thử Độn). */
export function canGioTy(canNgay: number): number {
  return (chiaDuDuong(canNgay, 10) % 5) * 2;
}

/**
 * Can Chi của giờ sinh theo thiên can ngày (0..9) và giờ đồng hồ (0..23)
 * hoặc chỉ số canh giờ (0..11) khi `laChi = true`.
 */
export function canChiGio(canNgay: number, gioHoacChi: number, laChi = false): CapCanChi {
  const chi = laChi ? chiaDuDuong(gioHoacChi, 12) : chiCanhGio(gioHoacChi);
  return taoCapCanChi(canGioTy(canNgay) + chi, chi);
}

/** Ghép tên Can Chi đầy đủ từ chỉ số { can, chi }. */
export function tenCanChi(cc: { can: number; chi: number }): string {
  return `${THIEN_CAN[chiaDuDuong(cc.can, 10)]} ${DIA_CHI[chiaDuDuong(cc.chi, 12)]}`;
}

/** Tra Nạp Âm (bảng 30 nhóm cổ điển) từ chỉ số thiên can (0..9) và địa chi (0..11). */
export function napAm(can: number, chi: number): string {
  const c = chiaDuDuong(can, 10);
  const z = chiaDuDuong(chi, 12);
  // Chỉ số hoa giáp 0..59 thỏa n ≡ c (mod 10) và n ≡ z (mod 12): n = (6c − 5z) mod 60
  const hoaGiap = chiaDuDuong(6 * c - 5 * z, 60);
  return BANG_NAP_AM[Math.floor(hoaGiap / 2)];
}

/** Ngũ hành của tên Nạp Âm (chữ cuối: Kim, Mộc, Thủy, Hỏa, Thổ). */
export function hanhNapAm(tenNapAm: string): NguHanh {
  const tuCuoi = tenNapAm.trim().split(/\s+/).pop();
  return tuCuoi as NguHanh;
}

/** Đổi tên múi giờ IANA hoặc số giờ về số giờ lệch UTC (phục vụ tương thích với bộ kiểm thử). */
export function muiGioSo(muiGio: number | string = 7): number {
  if (typeof muiGio === 'number') {
    if (!Number.isFinite(muiGio) || muiGio < -12 || muiGio > 14) {
      throw new RangeError(`Múi giờ không hợp lệ: ${muiGio}`);
    }
    return muiGio;
  }
  try {
    const dt = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: muiGio,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).formatToParts(dt);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const localMs = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'));
    return (localMs - dt.getTime()) / 3600000;
  } catch {
    throw new RangeError(`Múi giờ IANA không hợp lệ: ${muiGio}`);
  }
}

const AmLich = {
  THIEN_CAN,
  DIA_CHI,
  TEN_CON_GIAP,
  KHUNG_GIO,
  JDN_MOC_1968,
  soNgayJulius,
  tuSoNgayJulius,
  muiGioLichSuTheoNam,
  muiGioLichSuTheoJdn,
  uocLuongDeltaT,
  jdeTrangMoi,
  ngaySoc,
  kinhDoMatTroiLuc0Gio,
  duongSangAm,
  amSangDuong,
  duongSangAmLichSu,
  amSangDuongLichSu,
  thangNhuan,
  soNgayThangAm,
  canChiNam,
  canChiThang,
  canChiNgay,
  chiCanhGio,
  canGioTy,
  canChiGio,
  tenCanChi,
  napAm,
  hanhNapAm,
  muiGioSo,
};

export default AmLich;

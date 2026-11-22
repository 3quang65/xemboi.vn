// Dữ liệu Kinh Dịch cho trang công khai v2: 8 quái, 64 quẻ (thứ tự Văn Vương), cách lập quẻ.
// Chỉ phần TÍNH ĐƯỢC. Lời quẻ và diễn giải lấy từ NoiDung đã duyệt (noi-dung.ts), không sinh tại chỗ.
import { DIA_CHI, canChiNam, chiCanhGio, duongSangAm, soNgayJulius, tuSoNgayJulius } from '@/lib/tuvi-v2/am-lich';

// Thay `gieoQueDich` của v1 (src/lib/core/tutru-boidich.ts) vốn chỉ có 11 quẻ và tự viết lời khuyên.

export type Hao = 0 | 1; // 0 âm, 1 dương

export type Quai = { ten: string; tuong: string; hanh: string; hao: [Hao, Hao, Hao]; soTienThien: number };

/** 8 quái, hào đọc từ dưới lên. Số Tiên thiên: Càn 1 … Khôn 8. */
export const BAT_QUAI: Quai[] = [
  { ten: 'Càn', tuong: 'Thiên', hanh: 'Kim', hao: [1, 1, 1], soTienThien: 1 },
  { ten: 'Đoài', tuong: 'Trạch', hanh: 'Kim', hao: [1, 1, 0], soTienThien: 2 },
  { ten: 'Ly', tuong: 'Hỏa', hanh: 'Hỏa', hao: [1, 0, 1], soTienThien: 3 },
  { ten: 'Chấn', tuong: 'Lôi', hanh: 'Mộc', hao: [1, 0, 0], soTienThien: 4 },
  { ten: 'Tốn', tuong: 'Phong', hanh: 'Mộc', hao: [0, 1, 1], soTienThien: 5 },
  { ten: 'Khảm', tuong: 'Thủy', hanh: 'Thủy', hao: [0, 1, 0], soTienThien: 6 },
  { ten: 'Cấn', tuong: 'Sơn', hanh: 'Thổ', hao: [0, 0, 1], soTienThien: 7 },
  { ten: 'Khôn', tuong: 'Địa', hanh: 'Thổ', hao: [0, 0, 0], soTienThien: 8 },
];

// [số Văn Vương, tên ngắn, thượng quái, hạ quái]
const BANG: [number, string, string, string][] = [
  [1, 'Càn', 'Càn', 'Càn'], [2, 'Khôn', 'Khôn', 'Khôn'], [3, 'Truân', 'Khảm', 'Chấn'], [4, 'Mông', 'Cấn', 'Khảm'],
  [5, 'Nhu', 'Khảm', 'Càn'], [6, 'Tụng', 'Càn', 'Khảm'], [7, 'Sư', 'Khôn', 'Khảm'], [8, 'Tỷ', 'Khảm', 'Khôn'],
  [9, 'Tiểu Súc', 'Tốn', 'Càn'], [10, 'Lý', 'Càn', 'Đoài'], [11, 'Thái', 'Khôn', 'Càn'], [12, 'Bĩ', 'Càn', 'Khôn'],
  [13, 'Đồng Nhân', 'Càn', 'Ly'], [14, 'Đại Hữu', 'Ly', 'Càn'], [15, 'Khiêm', 'Khôn', 'Cấn'], [16, 'Dự', 'Chấn', 'Khôn'],
  [17, 'Tùy', 'Đoài', 'Chấn'], [18, 'Cổ', 'Cấn', 'Tốn'], [19, 'Lâm', 'Khôn', 'Đoài'], [20, 'Quán', 'Tốn', 'Khôn'],
  [21, 'Phệ Hạp', 'Ly', 'Chấn'], [22, 'Bí', 'Cấn', 'Ly'], [23, 'Bác', 'Cấn', 'Khôn'], [24, 'Phục', 'Khôn', 'Chấn'],
  [25, 'Vô Vọng', 'Càn', 'Chấn'], [26, 'Đại Súc', 'Cấn', 'Càn'], [27, 'Di', 'Cấn', 'Chấn'], [28, 'Đại Quá', 'Đoài', 'Tốn'],
  [29, 'Khảm', 'Khảm', 'Khảm'], [30, 'Ly', 'Ly', 'Ly'], [31, 'Hàm', 'Đoài', 'Cấn'], [32, 'Hằng', 'Chấn', 'Tốn'],
  [33, 'Độn', 'Càn', 'Cấn'], [34, 'Đại Tráng', 'Chấn', 'Càn'], [35, 'Tấn', 'Ly', 'Khôn'], [36, 'Minh Di', 'Khôn', 'Ly'],
  [37, 'Gia Nhân', 'Tốn', 'Ly'], [38, 'Khuê', 'Ly', 'Đoài'], [39, 'Kiển', 'Khảm', 'Cấn'], [40, 'Giải', 'Chấn', 'Khảm'],
  [41, 'Tổn', 'Cấn', 'Đoài'], [42, 'Ích', 'Tốn', 'Chấn'], [43, 'Quải', 'Đoài', 'Càn'], [44, 'Cấu', 'Càn', 'Tốn'],
  [45, 'Tụy', 'Đoài', 'Khôn'], [46, 'Thăng', 'Khôn', 'Tốn'], [47, 'Khốn', 'Đoài', 'Khảm'], [48, 'Tỉnh', 'Khảm', 'Tốn'],
  [49, 'Cách', 'Đoài', 'Ly'], [50, 'Đỉnh', 'Ly', 'Tốn'], [51, 'Chấn', 'Chấn', 'Chấn'], [52, 'Cấn', 'Cấn', 'Cấn'],
  [53, 'Tiệm', 'Tốn', 'Cấn'], [54, 'Quy Muội', 'Chấn', 'Đoài'], [55, 'Phong', 'Chấn', 'Ly'], [56, 'Lữ', 'Ly', 'Cấn'],
  [57, 'Tốn', 'Tốn', 'Tốn'], [58, 'Đoài', 'Đoài', 'Đoài'], [59, 'Hoán', 'Tốn', 'Khảm'], [60, 'Tiết', 'Khảm', 'Đoài'],
  [61, 'Trung Phu', 'Tốn', 'Đoài'], [62, 'Tiểu Quá', 'Chấn', 'Cấn'], [63, 'Ký Tế', 'Khảm', 'Ly'], [64, 'Vị Tế', 'Ly', 'Khảm'],
];

const quaiTheoTen = (ten: string) => BAT_QUAI.find((q) => q.ten === ten)!;

export type Que = {
  so: number;
  tenNgan: string;
  /** Tên đầy đủ: "Thủy Lôi Truân", "Thuần Càn". */
  ten: string;
  slug: string;
  thuong: Quai;
  ha: Quai;
  /** 6 hào từ dưới lên. */
  hao: Hao[];
};

function boDau(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export const QUE_64: Que[] = BANG.map(([so, tenNgan, t, h]) => {
  const thuong = quaiTheoTen(t);
  const ha = quaiTheoTen(h);
  const ten = t === h ? `Thuần ${tenNgan}` : `${thuong.tuong} ${ha.tuong} ${tenNgan}`;
  return {
    so, tenNgan, ten, thuong, ha,
    slug: `${String(so).padStart(2, '0')}-${boDau(ten).toLowerCase().replace(/\s+/g, '-')}`,
    hao: [...ha.hao, ...thuong.hao],
  };
});

export function queTheoSo(so: number): Que | undefined {
  return QUE_64[so - 1];
}
export function queTheoSlug(slug: string): Que | undefined {
  return QUE_64.find((q) => q.slug === slug);
}
/** Tìm quẻ theo 6 hào (từ dưới lên). */
export function queTheoHao(hao: Hao[]): Que {
  const k = hao.join('');
  return QUE_64.find((q) => q.hao.join('') === k)!;
}

/** Quẻ hỗ: hào 2-3-4 làm hạ, 3-4-5 làm thượng. */
export function queHo(hao: Hao[]): Que {
  return queTheoHao([hao[1], hao[2], hao[3], hao[2], hao[3], hao[4]]);
}

export type KetQuaGieo = {
  cach: 'dong-xu' | 'mai-hoa';
  /** Với đồng xu: 6 giá trị 6/7/8/9 từ dưới lên. */
  giaTriHao?: number[];
  queChu: Que;
  queBien: Que | null;
  queHo: Que;
  /** Hào động, đánh số 1..6 từ dưới lên. */
  haoDong: number[];
  moTa: string[];
};

function lapKetQua(cach: KetQuaGieo['cach'], hao: Hao[], haoDong: number[], moTa: string[], giaTriHao?: number[]): KetQuaGieo {
  const bien = hao.map((x, i) => (haoDong.includes(i + 1) ? ((1 - x) as Hao) : x));
  return {
    cach, giaTriHao, haoDong, moTa,
    queChu: queTheoHao(hao),
    queBien: haoDong.length ? queTheoHao(bien) : null,
    queHo: queHo(hao),
  };
}

/**
 * Gieo 3 đồng xu 6 lần (từ hào sơ lên hào thượng).
 * Mỗi lần: mặt ngửa = 3, sấp = 2; tổng 6 lão âm (động), 7 thiếu dương, 8 thiếu âm, 9 lão dương (động).
 * `giaTri` cho phép truyền sẵn 6 kết quả (để test / để người dùng tự gieo xu thật rồi nhập).
 */
export function gieoDongXu(giaTri?: number[]): KetQuaGieo {
  let ds = giaTri;
  if (!ds) {
    const r = new Uint8Array(18);
    crypto.getRandomValues(r);
    ds = Array.from({ length: 6 }, (_, i) => [0, 1, 2].reduce((t, j) => t + (r[i * 3 + j] & 1 ? 3 : 2), 0));
  }
  if (ds.length !== 6 || ds.some((x) => ![6, 7, 8, 9].includes(x))) throw new RangeError('Cần 6 giá trị 6, 7, 8 hoặc 9.');
  const hao = ds.map((x) => (x % 2 === 1 ? 1 : 0) as Hao);
  const dong = ds.flatMap((x, i) => (x === 6 || x === 9 ? [i + 1] : []));
  return lapKetQua('dong-xu', hao, dong, [
    'Gieo 3 đồng xu 6 lần, từ hào sơ (dưới) lên hào thượng.',
    'Ngửa tính 3, sấp tính 2: 6 là lão âm, 9 là lão dương (hào động); 7 thiếu dương, 8 thiếu âm.',
  ], ds);
}

/**
 * Lập quẻ Mai Hoa theo thời gian (âm lịch):
 * thượng quái = (số chi năm + tháng âm + ngày âm) mod 8; hạ quái = (tổng trên + số chi giờ) mod 8; hào động = tổng mod 6.
 * Số chi: Tý 1 … Hợi 12. Số quái theo Tiên thiên (Càn 1 … Khôn 8; dư 0 lấy 8; dư 0 của hào lấy 6).
 */
export function queMaiHoaTheoThoiGian(chiNam: number, thangAm: number, ngayAm: number, chiGio: number): KetQuaGieo {
  const soNam = chiNam + 1;
  const soGio = chiGio + 1;
  const tren = soNam + thangAm + ngayAm;
  const duoi = tren + soGio;
  const so = (n: number, m: number) => (n % m === 0 ? m : n % m);
  const thuong = BAT_QUAI.find((q) => q.soTienThien === so(tren, 8))!;
  const ha = BAT_QUAI.find((q) => q.soTienThien === so(duoi, 8))!;
  const dong = so(duoi, 6);
  return lapKetQua('mai-hoa', [...ha.hao, ...thuong.hao], [dong], [
    `Số năm (chi) ${soNam} + tháng ${thangAm} + ngày ${ngayAm} = ${tren}; chia 8 dư ${so(tren, 8)} → thượng quái ${thuong.ten}.`,
    `Cộng số giờ (chi) ${soGio} = ${duoi}; chia 8 dư ${so(duoi, 8)} → hạ quái ${ha.ten}.`,
    `${duoi} chia 6 dư ${dong} → hào ${dong} động.`,
  ]);
}

/** Quẻ Mai Hoa theo thời điểm `luc` (mặc định bây giờ), giờ Việt Nam. */
export function queMaiHoaHienTai(luc = new Date()): KetQuaGieo & { thoiDiem: string } {
  const vn = new Date(luc.getTime() + 7 * 3600000);
  const ngay = vn.getUTCDate();
  const thang = vn.getUTCMonth() + 1;
  const nam = vn.getUTCFullYear();
  const gio = vn.getUTCHours();
  // Giờ Tý (23:00) đã sang ngày âm hôm sau theo phép Mai Hoa.
  const ngayTinh = gio === 23 ? tuSoNgayJulius(soNgayJulius(ngay, thang, nam) + 1) : { ngay, thang, nam };
  const am = duongSangAm(ngayTinh.ngay, ngayTinh.thang, ngayTinh.nam);
  const chiNam = canChiNam(am.nam).chi;
  const chiGio = chiCanhGio(gio);
  const kq = queMaiHoaTheoThoiGian(chiNam, am.thang, am.ngay, chiGio);
  const hai = (n: number) => String(n).padStart(2, '0');
  return {
    ...kq,
    thoiDiem: `${hai(gio)}:${hai(vn.getUTCMinutes())} ngày ${ngay}/${thang}/${nam} (âm ${am.ngay}/${am.thang}${am.nhuan ? ' nhuận' : ''} năm ${canChiNam(am.nam).ten}, giờ ${DIA_CHI[chiGio]})`,
  };
}

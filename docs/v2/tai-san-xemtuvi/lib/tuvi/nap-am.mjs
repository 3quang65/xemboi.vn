// lib/tuvi/nap-am.mjs — Bảng nạp âm 60 hoa giáp
// Nguồn bảng: 《三命通会》 (Tam Mệnh Thông Hội, Vạn Dân Anh, 1578) — bảng "60 hoa giáp nạp âm"
//   và bảng ngũ hành nạp âm lưu hành trong Tử Vi Đẩu Số Tân Biên (Vũ Tài Lục).
// Mỗi cặp can chi liên tiếp chia chung một nạp âm (30 nhóm × 2).

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// 30 nhóm nạp âm theo thứ tự từ Giáp Tý (chỉ số cặp 0–1) đến Nhâm Tuất/Quý Hợi (58–59)
export const NAP_AM_NHOM = [
  { ten: 'Hải Trung Kim', hanh: 'Kim' },      // 0  Giáp Tý – Ất Sửu
  { ten: 'Lư Trung Hỏa', hanh: 'Hỏa' },       // 1  Bính Dần – Đinh Mão
  { ten: 'Đại Lâm Mộc', hanh: 'Mộc' },        // 2  Mậu Thìn – Kỷ Tỵ
  { ten: 'Lộ Bàng Thổ', hanh: 'Thổ' },        // 3  Canh Ngọ – Tân Mùi
  { ten: 'Kiếm Phong Kim', hanh: 'Kim' },     // 4  Nhâm Thân – Quý Dậu
  { ten: 'Sơn Đầu Hỏa', hanh: 'Hỏa' },        // 5  Giáp Tuất – Ất Hợi
  { ten: 'Giản Hạ Thủy', hanh: 'Thủy' },      // 6  Bính Tý – Đinh Sửu
  { ten: 'Thành Đầu Thổ', hanh: 'Thổ' },      // 7  Mậu Dần – Kỷ Mão
  { ten: 'Bạch Lạp Kim', hanh: 'Kim' },       // 8  Canh Thìn – Tân Tỵ
  { ten: 'Dương Liễu Mộc', hanh: 'Mộc' },     // 9  Nhâm Ngọ – Quý Mùi
  { ten: 'Tuyền Trung Thủy', hanh: 'Thủy' },  // 10 Giáp Thân – Ất Dậu
  { ten: 'Ốc Thượng Thổ', hanh: 'Thổ' },      // 11 Bính Tuất – Đinh Hợi
  { ten: 'Tích Lịch Hỏa', hanh: 'Hỏa' },      // 12 Mậu Tý – Kỷ Sửu
  { ten: 'Tùng Bách Mộc', hanh: 'Mộc' },      // 13 Canh Dần – Tân Mão
  { ten: 'Trường Lưu Thủy', hanh: 'Thủy' },   // 14 Nhâm Thìn – Quý Tỵ
  { ten: 'Sa Trung Kim', hanh: 'Kim' },       // 15 Giáp Ngọ – Ất Mùi
  { ten: 'Sơn Hạ Hỏa', hanh: 'Hỏa' },         // 16 Bính Thân – Đinh Dậu
  { ten: 'Bình Địa Mộc', hanh: 'Mộc' },       // 17 Mậu Tuất – Kỷ Hợi
  { ten: 'Bích Thượng Thổ', hanh: 'Thổ' },    // 18 Canh Tý – Tân Sửu
  { ten: 'Kim Bạch Kim', hanh: 'Kim' },       // 19 Nhâm Dần – Quý Mão
  { ten: 'Phú Đăng Hỏa', hanh: 'Hỏa' },       // 20 Giáp Thìn – Ất Tỵ
  { ten: 'Thiên Hà Thủy', hanh: 'Thủy' },     // 21 Bính Ngọ – Đinh Mùi
  { ten: 'Đại Trạch Thổ', hanh: 'Thổ' },      // 22 Mậu Thân – Kỷ Dậu
  { ten: 'Thoa Xuyến Kim', hanh: 'Kim' },     // 23 Canh Tuất – Tân Hợi
  { ten: 'Tang Đố Mộc', hanh: 'Mộc' },        // 24 Nhâm Tý – Quý Sửu
  { ten: 'Đại Khê Thủy', hanh: 'Thủy' },      // 25 Giáp Dần – Ất Mão
  { ten: 'Sa Trung Thổ', hanh: 'Thổ' },       // 26 Bính Thìn – Đinh Tỵ
  { ten: 'Thiên Thượng Hỏa', hanh: 'Hỏa' },   // 27 Mậu Ngọ – Kỷ Mùi
  { ten: 'Thạch Lựu Mộc', hanh: 'Mộc' },      // 28 Canh Thân – Tân Dậu
  { ten: 'Đại Hải Thủy', hanh: 'Thủy' },      // 29 Nhâm Tuất – Quý Hợi
];

/** Chỉ số 0–59 của cặp can chi; trả -1 nếu không phải cặp hợp lệ. */
export function chiSo(can, chi) {
  const ci = CAN.indexOf(can);
  const zi = CHI.indexOf(chi);
  if (ci < 0 || zi < 0 || ci % 2 !== zi % 2) return -1;
  for (let i = 0; i < 60; i++) if (i % 10 === ci && i % 12 === zi) return i;
  return -1;
}

/** Cặp can chi thứ i (0–59). */
export function hoaGiap(i) {
  if (!Number.isInteger(i) || i < 0 || i > 59) throw new RangeError(`Chỉ số hoa giáp phải trong 0–59: ${i}`);
  return `${CAN[i % 10]} ${CHI[i % 12]}`;
}

/** Nạp âm theo chỉ số 0–59: {hoaGiap, ten, hanh}. */
export function napAmTheoChiSo(i) {
  if (!Number.isInteger(i) || i < 0 || i > 59) throw new RangeError(`Chỉ số hoa giáp phải trong 0–59: ${i}`);
  const nhom = NAP_AM_NHOM[Math.floor(i / 2)];
  return { hoaGiap: hoaGiap(i), ten: nhom.ten, hanh: nhom.hanh };
}

/** Nạp âm theo cặp can chi: {hoaGiap, ten, hanh} hoặc null nếu cặp sai. */
export function napAm(can, chi) {
  const i = chiSo(can, chi);
  return i < 0 ? null : napAmTheoChiSo(i);
}

/** Can chi của năm dương lịch (năm âm lịch tương ứng — lưu ý Tết). */
export function canChiCuaNam(nam) {
  if (!Number.isInteger(nam)) throw new RangeError('Năm phải là số nguyên');
  return { can: CAN[((nam - 4) % 10 + 10) % 10], chi: CHI[((nam - 4) % 12 + 12) % 12] };
}

/** Toàn bộ 60 dòng (dùng để sinh data/tuvi/nap-am.json và kiểm tra). */
export function bangNapAm() {
  return Array.from({ length: 60 }, (_, i) => ({
    stt: i + 1,
    can: CAN[i % 10],
    chi: CHI[i % 12],
    hoaGiap: hoaGiap(i),
    napAm: NAP_AM_NHOM[Math.floor(i / 2)].ten,
    hanh: NAP_AM_NHOM[Math.floor(i / 2)].hanh,
  }));
}

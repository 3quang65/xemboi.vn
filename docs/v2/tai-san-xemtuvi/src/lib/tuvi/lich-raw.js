/*
 * lich.js — Lịch âm Việt Nam (mặc định múi giờ UTC+7), can chi, tiết khí,
 * giờ/ngày hoàng đạo, 12 trực, ngày kỵ và chấm điểm xem ngày.
 * Thuật toán đổi lịch: Hồ Ngọc Đức (dựa trên "Astronomical Algorithms" của Jean Meeus).
 * Chạy được cả trên trình duyệt (window.Lich) lẫn Node (require).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Lich = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var PI = Math.PI;
  var TZ = 7;
  function INT(d) { return Math.floor(d); }

  var CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  var CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  var CON_GIAP = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];
  var THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  var TIET_KHI = ['Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng', 'Hạ chí', 'Tiểu thử',
    'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ', 'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết',
    'Đại tuyết', 'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'];
  var GIO_KHOANG = ['23h–1h', '1h–3h', '3h–5h', '5h–7h', '7h–9h', '9h–11h', '11h–13h', '13h–15h', '15h–17h', '17h–19h', '19h–21h', '21h–23h'];

  var NAP_AM = ['Hải Trung Kim', 'Lô Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa',
    'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ',
    'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc',
    'Bích Thượng Thổ', 'Kim Bạch Kim', 'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim',
    'Tang Đố Mộc', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'];

  // ---------- Thiên văn ----------
  function jdFromDate(dd, mm, yy) {
    var a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
    var jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    return jd;
  }
  function jdToDate(jd) {
    var a, b, c;
    if (jd > 2299160) { a = jd + 32044; b = INT((4 * a + 3) / 146097); c = a - INT((b * 146097) / 4); }
    else { b = 0; c = jd + 32082; }
    var d = INT((4 * c + 3) / 1461), e = c - INT((1461 * d) / 4), m = INT((5 * e + 2) / 153);
    return [e - INT((153 * m + 2) / 5) + 1, m + 3 - 12 * INT(m / 10), b * 100 + d - 4800 + INT(m / 10)];
  }
  function newMoon(k) {
    var T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
    var Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    var M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    var Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    var F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    var C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr) - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    var deltat = T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;
    return Jd1 + C1 - deltat;
  }
  function sunLongitudeRad(jdn) {
    var T = (jdn - 2451545.0) / 36525, T2 = T * T, dr = PI / 180;
    var M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    var L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    var L = (L0 + DL) * dr;
    return L - PI * 2 * INT(L / (PI * 2));
  }
  function getSunLongitude(dayNumber, tz) { return INT(sunLongitudeRad(dayNumber - 0.5 - tz / 24) / PI * 6); }
  function getNewMoonDay(k, tz) { return INT(newMoon(k) + 0.5 + tz / 24); }
  function getLunarMonth11(yy, tz) {
    var off = jdFromDate(31, 12, yy) - 2415021, k = INT(off / 29.530588853);
    var nm = getNewMoonDay(k, tz);
    if (getSunLongitude(nm, tz) >= 9) nm = getNewMoonDay(k - 1, tz);
    return nm;
  }
  function getLeapMonthOffset(a11, tz) {
    var k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5), last, i = 1;
    var arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
    do { last = arc; i++; arc = getSunLongitude(getNewMoonDay(k + i, tz), tz); } while (arc !== last && i < 14);
    return i - 1;
  }

  /** Dương → Âm. Trả về {ngay, thang, nam, nhuan}. tz: múi giờ tính lịch (mặc định 7) */
  function duongSangAm(dd, mm, yy, tz) {
    tz = tz || TZ;
    var dayNumber = jdFromDate(dd, mm, yy);
    var k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    var monthStart = getNewMoonDay(k + 1, tz);
    if (monthStart > dayNumber) monthStart = getNewMoonDay(k, tz);
    var a11 = getLunarMonth11(yy, tz), b11 = a11, lunarYear;
    if (a11 >= monthStart) { lunarYear = yy; a11 = getLunarMonth11(yy - 1, tz); }
    else { lunarYear = yy + 1; b11 = getLunarMonth11(yy + 1, tz); }
    var lunarDay = dayNumber - monthStart + 1;
    var diff = INT((monthStart - a11) / 29), leap = false, lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      var leapDiff = getLeapMonthOffset(a11, tz);
      if (diff >= leapDiff) { lunarMonth = diff + 10; if (diff === leapDiff) leap = true; }
    }
    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
    return { ngay: lunarDay, thang: lunarMonth, nam: lunarYear, nhuan: leap };
  }

  /** Âm → Dương. Trả về {ngay, thang, nam} hoặc null nếu không có tháng nhuận đó. tz như duongSangAm */
  function amSangDuong(ld, lm, ly, nhuan, tz) {
    tz = tz || TZ;
    var a11, b11;
    if (lm < 11) { a11 = getLunarMonth11(ly - 1, tz); b11 = getLunarMonth11(ly, tz); }
    else { a11 = getLunarMonth11(ly, tz); b11 = getLunarMonth11(ly + 1, tz); }
    var k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    var off = lm - 11; if (off < 0) off += 12;
    if (b11 - a11 > 365) {
      var leapOff = getLeapMonthOffset(a11, tz), leapMonth = leapOff - 2;
      if (leapMonth < 0) leapMonth += 12;
      if (nhuan && lm !== leapMonth) return null;
      if (nhuan || off >= leapOff) off += 1;
    } else if (nhuan) return null;
    var monthStart = getNewMoonDay(k + off, tz);
    var r = jdToDate(monthStart + ld - 1);
    // kiểm tra ngày 30 có tồn tại không
    var back = duongSangAm(r[0], r[1], r[2], tz);
    if (back.ngay !== ld || back.thang !== lm) return null;
    return { ngay: r[0], thang: r[1], nam: r[2] };
  }

  /** Tháng nhuận của năm âm (0 nếu không có) */
  function thangNhuan(ly) {
    var a11 = getLunarMonth11(ly - 1, TZ), b11 = getLunarMonth11(ly, TZ);
    if (b11 - a11 <= 365) return 0;
    var lm = getLeapMonthOffset(a11, TZ) - 2;
    if (lm < 0) lm += 12;
    return lm;
  }

  /** Số ngày của tháng âm */
  function soNgayThangAm(lm, ly, nhuan) {
    return amSangDuong(30, lm, ly, nhuan) ? 30 : 29;
  }

  // ---------- Can chi ----------
  function canChiNam(ly) { return { can: (ly + 6) % 10, chi: (ly + 8) % 12 }; }
  function canChiThang(lm, ly) { return { can: (ly * 12 + lm + 3) % 10, chi: (lm + 1) % 12 }; }
  function canChiNgay(jd) { return { can: (jd + 9) % 10, chi: (jd + 1) % 12 }; }
  function canGioTy(canNgay) { return (canNgay % 5) * 2; }
  function ten(cc) { return CAN[cc.can] + ' ' + CHI[cc.chi]; }
  function napAm(can, chi) { var n = ((6 * can - 5 * chi) % 60 + 60) % 60; return NAP_AM[INT(n / 2)]; }
  function hanhCuaNapAm(s) { return s.split(' ').pop(); }
  function chiGio(h) { return INT(((h + 1) % 24) / 2); }

  function tietKhi(jd) { return TIET_KHI[INT(sunLongitudeRad(jd + 0.5 - TZ / 24) / PI * 12)]; }
  /** Chi của tháng theo tiết khí (Dần bắt đầu từ Lập xuân) — dùng cho 12 trực */
  function chiThangTiet(jd) {
    var deg = sunLongitudeRad(jd + 0.5 - TZ / 24) * 180 / PI;
    return (2 + INT(((deg - 315 + 360) % 360) / 30)) % 12;
  }

  // ---------- Hoàng đạo ----------
  var THAN = ['Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước', 'Kim Quỹ', 'Kim Đường', 'Bạch Hổ', 'Ngọc Đường', 'Thiên Lao', 'Huyền Vũ', 'Tư Mệnh', 'Câu Trận'];
  var THAN_TOT = [true, true, false, false, true, true, false, true, false, false, true, false];

  function ngayHoangDao(lm, chiNgay) {
    var start = ((lm - 1) % 6) * 2;
    var i = (chiNgay - start + 12) % 12;
    return { than: THAN[i], tot: THAN_TOT[i] };
  }
  function gioHoangDao(chiNgay, canNgay) {
    var start = (8 + (chiNgay % 6) * 2) % 12, out = [];
    var c0 = canGioTy(canNgay);
    for (var h = 0; h < 12; h++) {
      var i = (h - start + 12) % 12;
      out.push({ chi: h, ten: CHI[h], canChi: CAN[(c0 + h) % 10] + ' ' + CHI[h], khoang: GIO_KHOANG[h], than: THAN[i], tot: THAN_TOT[i] });
    }
    return out;
  }

  // ---------- 12 trực ----------
  var TRUC = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'];
  var TRUC_Y = [
    'Tốt cho xuất hành, khai trương; kỵ động thổ, an táng.',
    'Tốt cho cúng giải, dọn dẹp, chữa bệnh; kỵ cưới hỏi, đi xa.',
    'Tốt cho cầu tài, khai trương, nhập trạch; kỵ kiện tụng, an táng.',
    'Ngày bình hòa, làm việc thường ngày, sửa sang nhà cửa đều được.',
    'Tốt cho cưới hỏi, ký kết, mua bán, nhập trạch; kỵ kiện tụng, xuất hành.',
    'Tốt cho xây dựng, tuyển người, cầu tài; kỵ xuất hành, dời nhà.',
    'Ngày xấu, chỉ nên phá dỡ nhà cũ, chữa bệnh; kỵ việc lớn.',
    'Ngày xấu, nên cúng bái, giữ gìn; kỵ việc lớn, đi xa.',
    'Ngày tốt, hợp cưới hỏi, khai trương, nhập trạch, làm nhà; kỵ kiện tụng.',
    'Tốt cho thu tiền, mua sắm, nhập kho; kỵ khai trương, an táng.',
    'Tốt cho khai trương, cưới hỏi, làm nhà, xuất hành; kỵ an táng.',
    'Nên an táng, đắp đê, giữ gìn; kỵ khai trương, cưới hỏi, đi xa.'
  ];
  function truc(jd) { var cc = canChiNgay(jd); var i = (cc.chi - chiThangTiet(jd) + 12) % 12; return { ten: TRUC[i], idx: i, y: TRUC_Y[i] }; }

  // ---------- Ngày kỵ ----------
  var TAM_NUONG = [3, 7, 13, 18, 22, 27];
  var NGUYET_KY = [5, 14, 23];
  var DUONG_CONG = { 1: [13], 2: [11], 3: [9], 4: [7], 5: [5], 6: [3], 7: [8, 29], 8: [27], 9: [25], 10: [23], 11: [21], 12: [19] };
  function ngayKy(am) {
    var r = [];
    if (TAM_NUONG.indexOf(am.ngay) >= 0) r.push('Tam Nương');
    if (NGUYET_KY.indexOf(am.ngay) >= 0) r.push('Nguyệt Kỵ');
    if ((DUONG_CONG[am.thang] || []).indexOf(am.ngay) >= 0) r.push('Dương Công Kỵ Nhật');
    return r;
  }
  function xung(a, b) { return (a - b + 12) % 12 === 6; }
  function lucXung(chi) { return (chi + 6) % 12; }
  function tamHop(chi) { return [chi, (chi + 4) % 12, (chi + 8) % 12]; }

  /** Thông tin đầy đủ của 1 ngày dương lịch */
  function thongTinNgay(dd, mm, yy) {
    var jd = jdFromDate(dd, mm, yy);
    var am = duongSangAm(dd, mm, yy);
    var ccN = canChiNgay(jd), ccT = canChiThang(am.thang, am.nam), ccY = canChiNam(am.nam);
    var hd = ngayHoangDao(am.thang, ccN.chi);
    var tr = truc(jd);
    return {
      duong: { ngay: dd, thang: mm, nam: yy, thu: THU[(jd + 1) % 7] },
      am: am,
      canChi: { ngay: ten(ccN), thang: ten(ccT), nam: ten(ccY) },
      ccNgay: ccN, ccNam: ccY,
      napAmNgay: napAm(ccN.can, ccN.chi),
      tietKhi: tietKhi(jd),
      hoangDao: hd,
      truc: tr,
      ky: ngayKy(am),
      tuoiXung: [CAN[(ccN.can + 4) % 10] + ' ' + CHI[lucXung(ccN.chi)], CAN[(ccN.can + 6) % 10] + ' ' + CHI[lucXung(ccN.chi)]],
      chiXung: CHI[lucXung(ccN.chi)],
      gio: gioHoangDao(ccN.chi, ccN.can),
      jd: jd
    };
  }

  // ---------- Xem ngày theo việc ----------
  var VIEC = {
    cuoihoi: { ten: 'Cưới hỏi', tot: [2, 4, 8, 10], xau: [1, 6, 7, 11] },
    dongtho: { ten: 'Động thổ, làm nhà', tot: [4, 5, 8, 10], xau: [0, 6, 7] },
    nhaptrach: { ten: 'Nhập trạch, về nhà mới', tot: [2, 4, 8, 10], xau: [5, 6, 7, 11] },
    muaxe: { ten: 'Mua xe, mua tài sản', tot: [2, 4, 8, 9, 10], xau: [6, 7] },
    khaitruong: { ten: 'Khai trương', tot: [0, 2, 8, 10], xau: [6, 7, 9, 11] },
    xuathanh: { ten: 'Xuất hành, đi xa', tot: [0, 8, 10], xau: [1, 4, 6, 7, 11] },
    kyket: { ten: 'Ký hợp đồng, giao dịch', tot: [4, 5, 8, 10], xau: [6, 7] },
    antang: { ten: 'An táng, ma chay', tot: [1, 3, 11], xau: [0, 2, 10] }
  };

  /** Chấm điểm 1 ngày cho 1 việc. namSinhAm: năm sinh âm lịch của gia chủ (tùy chọn) */
  function danhGiaNgay(info, viec, namSinhAm) {
    var v = VIEC[viec], diem = 50, ly = [];
    if (info.hoangDao.tot) { diem += 20; ly.push({ tot: true, t: 'Ngày hoàng đạo (' + info.hoangDao.than + ')' }); }
    else { diem -= 15; ly.push({ tot: false, t: 'Ngày hắc đạo (' + info.hoangDao.than + ')' }); }
    if (v.tot.indexOf(info.truc.idx) >= 0) { diem += 15; ly.push({ tot: true, t: 'Trực ' + info.truc.ten + ' hợp việc ' + v.ten.toLowerCase() }); }
    else if (v.xau.indexOf(info.truc.idx) >= 0) { diem -= 20; ly.push({ tot: false, t: 'Trực ' + info.truc.ten + ' kỵ việc ' + v.ten.toLowerCase() }); }
    else ly.push({ tot: null, t: 'Trực ' + info.truc.ten + ' (bình thường)' });
    if (viec !== 'antang') {
      info.ky.forEach(function (k) { diem -= k === 'Dương Công Kỵ Nhật' ? 25 : 20; ly.push({ tot: false, t: 'Phạm ngày ' + k }); });
    }
    if (namSinhAm) {
      var cy = canChiNam(namSinhAm);
      if (xung(info.ccNgay.chi, cy.chi)) { diem -= 25; ly.push({ tot: false, t: 'Ngày ' + CHI[info.ccNgay.chi] + ' xung tuổi ' + CHI[cy.chi] }); }
      else if (tamHop(cy.chi).indexOf(info.ccNgay.chi) >= 0) { diem += 10; ly.push({ tot: true, t: 'Ngày ' + CHI[info.ccNgay.chi] + ' tam hợp tuổi ' + CHI[cy.chi] }); }
    }
    diem = Math.max(0, Math.min(100, diem));
    return { diem: diem, muc: diem >= 70 ? 'Tốt' : diem >= 50 ? 'Trung bình' : 'Xấu', lyDo: ly };
  }

  /** Liệt kê các ngày trong khoảng [từ, đến] (Date) cho 1 việc, sắp theo điểm */
  function timNgayTot(tu, den, viec, namSinhAm) {
    var out = [], d = new Date(tu.getFullYear(), tu.getMonth(), tu.getDate());
    var end = new Date(den.getFullYear(), den.getMonth(), den.getDate());
    var n = 0;
    while (d <= end && n < 400) {
      var info = thongTinNgay(d.getDate(), d.getMonth() + 1, d.getFullYear());
      var dg = danhGiaNgay(info, viec, namSinhAm);
      out.push({ info: info, dg: dg });
      d.setDate(d.getDate() + 1); n++;
    }
    return out;
  }

  // ---------- Tuổi làm nhà / cưới ----------
  var HOANG_OC = ['Nhất Cát', 'Nhì Nghi', 'Tam Địa Sát', 'Tứ Tấn Tài', 'Ngũ Thọ Tử', 'Lục Hoang Ốc'];
  var HOANG_OC_XAU = [false, false, true, false, true, true];
  function xemTuoi(namSinhAm, namXem) {
    var tuoi = namXem - namSinhAm + 1; // tuổi mụ
    var kl = tuoi % 9, kimLau = [1, 3, 6, 8].indexOf(kl) >= 0;
    var KL_TEN = { 1: 'Kim Lâu Thân (hại bản thân)', 3: 'Kim Lâu Thê (hại vợ/chồng)', 6: 'Kim Lâu Tử (hại con)', 8: 'Kim Lâu Lục Súc (hại vật nuôi, tài sản)' };
    var ho = (INT(tuoi / 10) - 1 + tuoi % 10) % 6; if (ho < 0) ho += 6;
    var cy = canChiNam(namSinhAm), cx = canChiNam(namXem);
    var TAM_TAI = {}; // nhóm tam hợp -> 3 năm tam tai
    [[8, 0, 4, [2, 3, 4]], [2, 6, 10, [8, 9, 10]], [11, 3, 7, [5, 6, 7]], [5, 9, 1, [11, 0, 1]]].forEach(function (g) {
      TAM_TAI[g[0]] = g[3]; TAM_TAI[g[1]] = g[3]; TAM_TAI[g[2]] = g[3];
    });
    var tamTai = TAM_TAI[cy.chi].indexOf(cx.chi) >= 0;
    return {
      tuoiMu: tuoi,
      kimLau: kimLau ? KL_TEN[kl] : null,
      hoangOc: HOANG_OC[ho], hoangOcXau: HOANG_OC_XAU[ho],
      tamTai: tamTai,
      namXem: ten(cx)
    };
  }


  /* ---------- Sao chiếu mệnh (Cửu Diệu) và vận hạn (Bát hạn) theo tuổi mụ ---------- */
  var CUU_DIEU = {
    'La Hầu': { tot: false, y: 'sao khẩu thiệt, chủ chuyện thị phi, giấy tờ, lời ra tiếng vào', xau: [1, 7] },
    'Thổ Tú': { tot: false, y: 'sao tiểu nhân, chủ chuyện đi lại vất vả, người dưới khó bảo, việc nhà hơi rối', xau: [4, 8] },
    'Thủy Diệu': { tot: null, y: 'sao phúc lộc nhưng hay đi kèm chuyện sông nước, lời nói; người làm ăn xa thì có lộc', xau: [4, 8], hay: [9] },
    'Thái Bạch': { tot: false, y: 'sao hao tài, chủ chuyện tiền ra nhiều hơn tiền vào, dễ có người nhờ vả vay mượn', xau: [5] },
    'Thái Dương': { tot: true, y: 'sao tốt cho nam giới, chủ công danh hanh thông, được người trên nâng đỡ', hay: [6, 10] },
    'Vân Hán': { tot: false, y: 'sao nóng, chủ chuyện va chạm, kiện tụng nhỏ, nóng nảy dễ hỏng việc', xau: [2, 8] },
    'Kế Đô': { tot: false, y: 'sao ám, chủ chuyện buồn phiền trong nhà, đi xa nên cẩn thận, đặc biệt kỵ với nữ giới', xau: [3, 9] },
    'Thái Âm': { tot: true, y: 'sao tốt cho nữ giới, chủ tiền tài, danh lợi, việc nhà êm ấm', hay: [9], xau: [11] },
    'Mộc Đức': { tot: true, y: 'sao phúc đức, chủ hôn nhân, hòa thuận, có quý nhân, sức khỏe nên giữ đường máu huyết', hay: [10, 12] }
  };
  var DIEU_NAM = ['Mộc Đức', 'La Hầu', 'Thổ Tú', 'Thủy Diệu', 'Thái Bạch', 'Thái Dương', 'Vân Hán', 'Kế Đô', 'Thái Âm'];
  var DIEU_NU = ['Thủy Diệu', 'Kế Đô', 'Vân Hán', 'Mộc Đức', 'Thái Âm', 'Thổ Tú', 'La Hầu', 'Thái Dương', 'Thái Bạch'];
  var BAT_HAN = {
    'Huỳnh Tuyền': 'hạn chủ về sức khỏe, nên chăm lo ăn ngủ, khám định kỳ',
    'Tam Kheo': 'hạn chủ về chân tay, đi lại, nên cẩn thận khi xe cộ, leo trèo',
    'Ngũ Mộ': 'hạn chủ về hao tài nhẹ, tiền bạc nên tiêu có kế hoạch',
    'Thiên Tinh': 'hạn chủ về giấy tờ, tranh chấp, ký kết nên đọc kỹ',
    'Toán Tận': 'hạn chủ về tiền bạc dễ thất thoát, không nên cho vay hay đầu tư liều',
    'Thiên La': 'hạn chủ về tinh thần, dễ lo nghĩ nhiều, nên nghỉ ngơi hợp lý',
    'Địa Võng': 'hạn chủ về lời ăn tiếng nói, chuyện thị phi, nên giữ mồm giữ miệng',
    'Diêm Vương': 'hạn chủ về người thân ở xa, nên năng hỏi thăm, chăm lo gia đình'
  };
  var HAN_NAM = ['Huỳnh Tuyền', 'Tam Kheo', 'Ngũ Mộ', 'Thiên Tinh', 'Toán Tận', 'Thiên La', 'Địa Võng', 'Diêm Vương'];
  var HAN_NU = ['Toán Tận', 'Thiên Tinh', 'Ngũ Mộ', 'Tam Kheo', 'Huỳnh Tuyền', 'Diêm Vương', 'Địa Võng', 'Thiên La'];
  /** Sao chiếu mệnh và hạn của người sinh năm âm namSinhAm, giới tính 'nam'|'nu', trong năm âm namXem */
  function saoHan(namSinhAm, gioiTinh, namXem) {
    var tuoi = namXem - namSinhAm + 1, nu = gioiTinh === 'nu';
    var tenSao = (nu ? DIEU_NU : DIEU_NAM)[tuoi % 9];
    var iHan = tuoi >= 10 ? ((tuoi - 10 - INT((tuoi - 10) / 10)) % 8 + 8) % 8 : -1;
    var tenHan = iHan >= 0 ? (nu ? HAN_NU : HAN_NAM)[iHan] : null;
    var sao = CUU_DIEU[tenSao];
    var tot = sao.tot;
    if (tenSao === 'Thái Dương') tot = !nu ? true : null;   // tốt cho nam, nữ thì bình
    if (tenSao === 'Thái Âm') tot = nu ? true : null;       // tốt cho nữ, nam thì bình
    var y = sao.y;
    if (tenSao === 'Thái Dương' && nu) y = 'sao sáng, với nữ giới thì bình hòa: có lộc, có người giúp, chỉ không rực rỡ bằng nam giới';
    if (tenSao === 'Thái Âm' && !nu) y = 'sao hiền, với nam giới thì bình hòa: tiền bạc đều đặn, gia đạo yên, hợp việc tính toán, làm đêm';
    return { tuoi: tuoi, sao: { ten: tenSao, tot: tot, y: y, thangXau: sao.xau || [], thangTot: sao.hay || [] }, han: tenHan ? { ten: tenHan, y: BAT_HAN[tenHan] } : null };
  }
  /** Quan hệ giữa tuổi (chi năm sinh) và chi của năm xem: năm tuổi, xung, hại, hình, tam hợp, lục hợp */
  function quanHeChi(a, b) {
    var d = ((a - b) % 12 + 12) % 12, ds = [];
    if (a === b) ds.push('nam'); // năm tuổi
    if (d === 6) ds.push('xung');
    if ((a + b) % 12 === 1) ds.push('lucHop');            // Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
    if ((a + b) % 12 === 7 && a !== b) ds.push('hai');      // Tý-Mùi, Sửu-Ngọ, Dần-Tỵ, Mão-Thìn, Thân-Hợi, Dậu-Tuất
    if (a !== b && (d === 4 || d === 8)) ds.push('tamHop');
    var HINH = [[2, 5], [5, 8], [8, 2], [1, 10], [10, 7], [7, 1], [0, 3], [3, 0]];
    if (HINH.some(function (h) { return (h[0] === a && h[1] === b) || (h[0] === b && h[1] === a); })) ds.push('hinh');
    return ds;
  }


  /* ---------- Xem tuổi hợp: vợ chồng, làm ăn ---------- */
  var QUAI = { 1: ['Khảm', 'Thủy'], 2: ['Khôn', 'Thổ'], 3: ['Chấn', 'Mộc'], 4: ['Tốn', 'Mộc'], 6: ['Càn', 'Kim'], 7: ['Đoài', 'Kim'], 8: ['Cấn', 'Thổ'], 9: ['Ly', 'Hỏa'] };
  var DONG_TU = ['Khảm', 'Ly', 'Chấn', 'Tốn'];
  /** Cung phi bát trạch theo năm sinh âm và giới tính */
  function cungPhi(namAm, gioiTinh) {
    var yy = namAm % 100, k;
    if (gioiTinh === 'nu') k = namAm < 2000 ? (yy - 4) % 9 : (yy + 6) % 9;
    else k = namAm < 2000 ? (100 - yy) % 9 : (99 - yy) % 9;
    k = ((k % 9) + 9) % 9; if (k === 0) k = 9;
    if (k === 5) k = gioiTinh === 'nu' ? 8 : 2;
    var q = QUAI[k];
    return { ten: q[0], hanh: q[1], nhom: DONG_TU.indexOf(q[0]) >= 0 ? 'Đông tứ mệnh' : 'Tây tứ mệnh' };
  }
  var BT_THU = ['Khảm', 'Khôn', 'Chấn', 'Tốn', 'Càn', 'Đoài', 'Cấn', 'Ly'];
  var BT = [ // hàng: cung người 1, cột: cung người 2 (theo thứ tự BT_THU)
    ['PV', 'TM', 'TY', 'SK', 'LS', 'HH', 'NQ', 'DN'],
    ['TM', 'PV', 'HH', 'NQ', 'DN', 'TY', 'SK', 'LS'],
    ['TY', 'HH', 'PV', 'DN', 'NQ', 'TM', 'LS', 'SK'],
    ['SK', 'NQ', 'DN', 'PV', 'HH', 'LS', 'TM', 'TY'],
    ['LS', 'DN', 'NQ', 'HH', 'PV', 'SK', 'TY', 'TM'],
    ['HH', 'TY', 'TM', 'LS', 'SK', 'PV', 'DN', 'NQ'],
    ['NQ', 'SK', 'LS', 'TM', 'TY', 'DN', 'PV', 'HH'],
    ['DN', 'LS', 'SK', 'TY', 'TM', 'NQ', 'HH', 'PV']
  ];
  var BT_TEN = { SK: ['Sinh Khí', true], TY: ['Thiên Y', true], DN: ['Diên Niên', true], PV: ['Phục Vị', true], TM: ['Tuyệt Mệnh', false], NQ: ['Ngũ Quỷ', false], LS: ['Lục Sát', false], HH: ['Họa Hại', false] };
  var SINH_H = { Kim: 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
  function quanHeHanh(a, b) { return a === b ? 'binh' : SINH_H[a] === b || SINH_H[b] === a ? 'sinh' : 'khac'; }
  var CAN_HOP = [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]];
  function quanHeCan(a, b) {
    if (CAN_HOP.some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); })) return 'hop';
    var d = ((a - b) % 10 + 10) % 10;
    if (d === 4 || d === 6) return 'khac';
    return 'binh';
  }

  var QUAI_HUONG = { 'Khảm': 'Bắc', 'Khôn': 'Tây Nam', 'Chấn': 'Đông', 'Tốn': 'Đông Nam', 'Càn': 'Tây Bắc', 'Đoài': 'Tây', 'Cấn': 'Đông Bắc', 'Ly': 'Nam' };
  /** Hướng tốt, xấu theo cung phi (bát trạch) */
  function huongTheoCung(namAm, gioiTinh) {
    var cp = cungPhi(namAm, gioiTinh), hang = BT[BT_THU.indexOf(cp.ten)], tot = [], xau = [];
    var THU_TU = ['SK', 'TY', 'DN', 'PV', 'TM', 'NQ', 'LS', 'HH'];
    THU_TU.forEach(function (k) { var j = hang.indexOf(k), x = { ten: BT_TEN[k][0], huong: QUAI_HUONG[BT_THU[j]] }; (BT_TEN[k][1] ? tot : xau).push(x); });
    return { cungPhi: cp, tot: tot, xau: xau };
  }
  /**
   * Xem hợp tuổi hai người. a, b: { nam: năm sinh âm, gioi: 'nam'|'nu' }. kieu: 'vochong' | 'laman'.
   * Trả về điểm /10 và 5 tiêu chí: Mệnh, Thiên can, Địa chi, Cung phi, Thiên mệnh.
   */
  function xemHop(a, b, kieu) {
    var ca = canChiNam(a.nam), cb = canChiNam(b.nam);
    var na = napAm(ca.can, ca.chi), nb = napAm(cb.can, cb.chi);
    var ha = hanhCuaNapAm(na), hb = hanhCuaNapAm(nb);
    var pa = cungPhi(a.nam, a.gioi), pb = cungPhi(b.nam, b.gioi);
    var tc = [];
    var qm = quanHeHanh(ha, hb);
    tc.push({ id: 'menh', ten: 'Mệnh (ngũ hành nạp âm)', ct: na + ' và ' + nb, diem: qm === 'sinh' ? 2 : qm === 'binh' ? 1 : 0,
      kq: qm === 'sinh' ? 'Tương sinh' : qm === 'binh' ? 'Bình hòa' : 'Tương khắc',
      giai: qm === 'sinh' ? (SINH_H[ha] === hb ? ha + ' sinh ' + hb + ': người thứ nhất hay vun vén, nâng đỡ người thứ hai.' : hb + ' sinh ' + ha + ': người thứ hai hay vun vén, nâng đỡ người thứ nhất.') : qm === 'binh' ? 'Cùng hành ' + ha + ': hiểu nhau nhanh, chỉ cần tránh cùng cứng một lúc.' : (SINH_H[ha] ? 'Hai hành khắc nhau (' + ha + ' và ' + hb + '): tính khác nhau, cần một người mềm lại khi có chuyện.' : '') });
    var qc = quanHeCan(ca.can, cb.can);
    tc.push({ id: 'can', ten: 'Thiên can', ct: CAN[ca.can] + ' và ' + CAN[cb.can], diem: qc === 'hop' ? 2 : qc === 'binh' ? 1 : 0,
      kq: qc === 'hop' ? 'Tương hợp' : qc === 'binh' ? 'Bình hòa' : 'Tương phá',
      giai: qc === 'hop' ? 'Can hợp: chí hướng gặp nhau, bàn việc dễ thống nhất.' : qc === 'binh' ? 'Can bình: không cản không giúp, hợp nhau nhờ cách cư xử.' : 'Can phá: cách nghĩ hay lệch nhau, việc lớn nên bàn kỹ và có người thứ ba góp ý.' });
    var qhc = quanHeChi(ca.chi, cb.chi), xau = qhc.filter(function (x) { return x === 'xung' || x === 'hai' || x === 'hinh'; }), tot = qhc.filter(function (x) { return x === 'tamHop' || x === 'lucHop'; });
    var TEN_QH = { xung: 'lục xung', hai: 'lục hại', hinh: 'tương hình', tamHop: 'tam hợp', lucHop: 'lục hợp', nam: 'cùng tuổi' };
    tc.push({ id: 'chi', ten: 'Địa chi', ct: CHI[ca.chi] + ' và ' + CHI[cb.chi], diem: tot.length && !xau.length ? 2 : xau.length ? 0 : 1,
      kq: tot.length && !xau.length ? 'Hợp (' + tot.map(function (x) { return TEN_QH[x]; }).join(', ') + ')' : xau.length ? 'Kỵ (' + xau.map(function (x) { return TEN_QH[x]; }).join(', ') + ')' : 'Bình hòa',
      giai: tot.length && !xau.length ? 'Hai con giáp hợp nhau: ở cạnh nhau thấy dễ chịu, gặp khó thì cùng gánh.' : xau.length ? 'Hai con giáp có chỗ kỵ: dễ va nhau chuyện nhỏ hằng ngày. Biết trước thì nhường được.' : 'Hai con giáp không xung không hợp: êm đềm, tình cảm do mình vun.' });
    var bt = BT[BT_THU.indexOf(pa.ten)][BT_THU.indexOf(pb.ten)], btn = BT_TEN[bt];
    tc.push({ id: 'phi', ten: 'Cung phi bát trạch', ct: pa.ten + ' và ' + pb.ten, diem: btn[1] ? 2 : 0, kq: btn[0] + (btn[1] ? ' (tốt)' : ' (xấu)'),
      giai: { SK: 'Sinh Khí: hai người ở cạnh nhau thêm sức sống, làm ăn phát đạt.', TY: 'Thiên Y: hay chăm sóc nhau, có người giúp lúc khó.', DN: 'Diên Niên: bền lâu, gắn bó, hợp nhất cho chuyện lâu dài.', PV: 'Phục Vị: yên ổn, hiểu ý nhau.', TM: 'Tuyệt Mệnh: dân gian xem là kỵ nhất; vợ chồng hay cộng sự cần tôn trọng khác biệt, chuyện tiền bạc rõ ràng.', NQ: 'Ngũ Quỷ: dễ có lời ra tiếng vào, người ngoài xen vào chuyện hai người.', LS: 'Lục Sát: dễ hiểu lầm vì lời nói, nói chuyện thẳng thắn với nhau là gỡ.', HH: 'Họa Hại: hay có việc nhỏ lặt vặt làm phiền lòng, kiên nhẫn là qua.' }[bt] });
    var qt = quanHeHanh(pa.hanh, pb.hanh);
    tc.push({ id: 'menhPhi', ten: 'Thiên mệnh năm sinh', ct: pa.hanh + ' và ' + pb.hanh, diem: qt === 'sinh' ? 2 : qt === 'binh' ? 1 : 0, kq: qt === 'sinh' ? 'Tương sinh' : qt === 'binh' ? 'Bình hòa' : 'Tương khắc',
      giai: qt === 'sinh' ? 'Hành cung phi sinh nhau: bổ trợ cho nhau.' : qt === 'binh' ? 'Cùng hành: hòa hợp, ít sóng gió.' : 'Hành cung phi khắc nhau: cần nhường nhịn, chia việc rõ ràng.' });
    var diem = tc.reduce(function (t, x) { return t + x.diem; }, 0);
    var muc = diem >= 8 ? 'Rất hợp' : diem >= 6 ? 'Khá hợp' : diem >= 4 ? 'Hợp vừa phải' : 'Cần vun đắp nhiều';
    return { diem: diem, muc: muc, tieuChi: tc, a: { canChi: ten(ca), napAm: na, cungPhi: pa }, b: { canChi: ten(cb), napAm: nb, cungPhi: pb }, kieu: kieu === 'laman' ? 'laman' : 'vochong' };
  }

  return {
    CAN: CAN, CHI: CHI, CON_GIAP: CON_GIAP, THU: THU, GIO_KHOANG: GIO_KHOANG, TRUC: TRUC, VIEC: VIEC,
    jdFromDate: jdFromDate, jdToDate: jdToDate,
    duongSangAm: duongSangAm, amSangDuong: amSangDuong, thangNhuan: thangNhuan, soNgayThangAm: soNgayThangAm,
    canChiNam: canChiNam, canChiThang: canChiThang, canChiNgay: canChiNgay, canGioTy: canGioTy, ten: ten,
    napAm: napAm, hanhCuaNapAm: hanhCuaNapAm, chiGio: chiGio, tietKhi: tietKhi,
    ngayHoangDao: ngayHoangDao, gioHoangDao: gioHoangDao, truc: truc, ngayKy: ngayKy,
    xung: xung, thongTinNgay: thongTinNgay, danhGiaNgay: danhGiaNgay, timNgayTot: timNgayTot, xemTuoi: xemTuoi,
    saoHan: saoHan, quanHeChi: quanHeChi, cungPhi: cungPhi, xemHop: xemHop, huongTheoCung: huongTheoCung, CUU_DIEU: CUU_DIEU, BAT_HAN: BAT_HAN
  };
});

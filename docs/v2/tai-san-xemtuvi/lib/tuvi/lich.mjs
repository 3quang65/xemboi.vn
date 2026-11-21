// lib/tuvi/lich.mjs — Chuyển đổi dương lịch <-> âm lịch Việt Nam 1900–2100
// Thuật toán Hồ Ngọc Đức (Âm lịch Việt Nam), múi giờ UTC+7.
// Nguồn: http://www.informatik.uni-leipzig.de/~duc/amlich/ (Hồ Ngọc Đức, 2004)
// Bản tự chứa (không phụ thuộc repo) để chạy trong phòng cách ly.

const TEN_MUI_GIO = {
  'Asia/Ho_Chi_Minh': 7,
  'Asia/Saigon': 7,
  'Asia/Bangkok': 7,
  'Asia/Phnom_Penh': 7,
  'Asia/Vientiane': 7,
  'UTC': 0,
  'Etc/UTC': 0,
  'Asia/Tokyo': 9,
  'Asia/Shanghai': 8,
};

export function muiGioSo(muiGio = 'Asia/Ho_Chi_Minh') {
  if (typeof muiGio === 'number') {
    if (!Number.isFinite(muiGio) || muiGio < -12 || muiGio > 14) {
      throw new RangeError(`Múi giờ không hợp lệ: ${muiGio}`);
    }
    return muiGio;
  }
  if (typeof muiGio === 'string' && Object.prototype.hasOwnProperty.call(TEN_MUI_GIO, muiGio)) {
    return TEN_MUI_GIO[muiGio];
  }
  throw new RangeError(`Chưa hỗ trợ tên múi giờ: ${muiGio}`);
}

const INT = (d) => Math.floor(d);

function jdFromDate(dd, mm, yy) {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

function jdToDate(jd) {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = b * 100 + d - 4800 + INT(m / 10);
  return { ngay: day, thang: month, nam: year };
}

function NewMoon(k) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltat;
}

function SunLongitude(jdn) {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - Math.PI * 2 * INT(L / (Math.PI * 2));
  return L;
}

function getSunLongitude(dayNumber, timeZone) {
  return INT((SunLongitude(dayNumber - 0.5 - timeZone / 24) / Math.PI) * 6);
}

function getNewMoonDay(k, timeZone) {
  const jd = NewMoon(k);
  return INT(jd + 0.5 + timeZone / 24);
}

function getLunarMonth11(yy, timeZone) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11, timeZone) {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

function tachNgay(ngay) {
  if (ngay instanceof Date) {
    if (Number.isNaN(ngay.getTime())) throw new RangeError('Ngày không hợp lệ');
    return { ngay: ngay.getUTCDate(), thang: ngay.getUTCMonth() + 1, nam: ngay.getUTCFullYear() };
  }
  if (typeof ngay === 'string') {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(ngay.trim());
    if (!m) throw new RangeError(`Chuỗi ngày không hợp lệ (cần YYYY-MM-DD): ${ngay}`);
    return { nam: +m[1], thang: +m[2], ngay: +m[3] };
  }
  if (ngay && typeof ngay === 'object') {
    const nam = ngay.nam ?? ngay.year;
    const thang = ngay.thang ?? ngay.month;
    const d = ngay.ngay ?? ngay.day;
    if ([nam, thang, d].some((v) => !Number.isInteger(v))) {
      throw new RangeError('Đối tượng ngày cần {ngay, thang, nam}');
    }
    return { ngay: d, thang, nam };
  }
  throw new RangeError('Ngày cần là Date, "YYYY-MM-DD" hoặc {ngay, thang, nam}');
}

/**
 * Chuyển dương lịch sang âm lịch.
 * @param {Date|string|{ngay:number,thang:number,nam:number}} ngay
 * @param {string|number} muiGio tên múi giờ hoặc độ lệch giờ (mặc định 'Asia/Ho_Chi_Minh')
 * @returns {{nam:number, thang:number, ngay:number, nhuan:number}}
 */
export function duongSangAm(ngay, muiGio = 'Asia/Ho_Chi_Minh') {
  const { ngay: dd, thang: mm, nam: yy } = tachNgay(ngay);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) throw new RangeError(`Ngày dương lịch không hợp lệ: ${dd}/${mm}/${yy}`);
  if (yy < 1800 || yy > 2200) throw new RangeError(`Ngoài phạm vi hỗ trợ (1800–2200): ${yy}`);
  const tz = muiGioSo(muiGio);

  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, tz);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, tz);
  }
  let a11 = getLunarMonth11(yy, tz);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, tz);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, tz);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, tz);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return { nam: lunarYear, thang: lunarMonth, ngay: lunarDay, nhuan: lunarLeap };
}

/**
 * Chuyển âm lịch sang dương lịch (nghịch đảo).
 * @param {number} nam năm âm lịch
 * @param {number} thang tháng âm (1–12)
 * @param {number} ngay ngày âm (1–30)
 * @param {number} nhuan 0/1 — có phải tháng nhuận
 * @param {string|number} muiGio
 */
export function amSangDuong(nam, thang, ngay, nhuan = 0, muiGio = 'Asia/Ho_Chi_Minh') {
  const tz = muiGioSo(muiGio);
  if (![nam, thang, ngay, nhuan].every(Number.isInteger)) throw new RangeError('nam/thang/ngay/nhuan phải là số nguyên');
  if (thang < 1 || thang > 12) throw new RangeError(`Tháng âm không hợp lệ: ${thang}`);
  if (ngay < 1 || ngay > 30) throw new RangeError(`Ngày âm không hợp lệ: ${ngay}`);
  let a11, b11;
  if (thang < 11) {
    a11 = getLunarMonth11(nam - 1, tz);
    b11 = getLunarMonth11(nam, tz);
  } else {
    a11 = getLunarMonth11(nam, tz);
    b11 = getLunarMonth11(nam + 1, tz);
  }
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = thang - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, tz);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (nhuan !== 0 && thang !== leapMonth) {
      throw new RangeError(`Tháng ${thang} năm ${nam} không phải tháng nhuận (tháng nhuận là ${leapMonth})`);
    }
    if (nhuan !== 0 || off >= leapOff) off += 1;
  } else if (nhuan !== 0) {
    throw new RangeError(`Năm ${nam} không có tháng nhuận`);
  }
  const monthStart = getNewMoonDay(k + off, tz);
  return jdToDate(monthStart + ngay - 1);
}

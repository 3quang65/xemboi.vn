// Kiểm thử độc lập bộ đổi lịch viết mới src/lib/tuvi-v2/am-lich.ts
// (Meeus Chương 7 & 49 + VSOP87D tiet-khi.mjs + ΔT Espenak-Meeus)
// và đối chiếu đầu ra 1900–2100 với lich-raw.js (chỉ dùng làm đáp án so sánh).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import * as A from '../../src/lib/tuvi-v2/am-lich.ts';

const require = createRequire(import.meta.url);
const HndOracle = require('./doi-chieu/lich-raw.js');
const docJson = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));

test('[am-lich] Độc lập: Meeus Chương 49 ví dụ 49.a (k = -283) & ngày Julius J2000', () => {
  // Jean Meeus, Astronomical Algorithms (2nd ed., 1998), Example 49.a, p. 353:
  // New Moon of Feb 1977 (k = -283) -> JDE = 2443192.65118
  const jde = A.jdeTrangMoi(-283);
  assert.ok(Math.abs(jde - 2443192.65118) < 0.00002, `JDE(-283) = ${jde}`);

  // Mốc J2000 (01/01/2000 12:00 UT) = JDN 2451545; 01/01/1968 = 2439857
  assert.equal(A.soNgayJulius(1, 1, 2000), 2451545);
  assert.deepEqual(A.tuSoNgayJulius(2451545), { ngay: 1, thang: 1, nam: 2000 });
  assert.equal(A.soNgayJulius(15, 10, 1582), 2299161);
  assert.equal(A.soNgayJulius(4, 10, 1582), 2299160);
  assert.deepEqual(A.tuSoNgayJulius(2299161), { ngay: 15, thang: 10, nam: 1582 });
  assert.deepEqual(A.tuSoNgayJulius(2299160), { ngay: 4, thang: 10, nam: 1582 });
});

test('[am-lich] Độc lập: 108/108 ngày mùng 1 Tết 1984–2091 (tet-wikipedia-1984-2091.json, UTC+7)', () => {
  const { rows } = docJson('../../src/lib/tuvi-v2/data/tet-wikipedia-1984-2091.json');
  assert.equal(rows.length, 108);
  const sai = [];
  for (const { nam, duong } of rows) {
    const [d, m, y] = duong.split('/').map(Number);
    const duongKq = A.amSangDuong(1, 1, nam, false, 7);
    if (!duongKq || duongKq.ngay !== d || duongKq.thang !== m || duongKq.nam !== y) {
      sai.push(`amSangDuong(${nam}): ${JSON.stringify(duongKq)} ≠ ${duong}`);
    }
    const amKq = A.duongSangAm(d, m, y, 7);
    if (amKq.ngay !== 1 || amKq.thang !== 1 || amKq.nam !== nam || amKq.nhuan !== false) {
      sai.push(`duongSangAm(${duong}): ${JSON.stringify(amKq)}`);
    }
  }
  assert.deepEqual(sai, []);
});

test('[am-lich] Độc lập: 200/200 mốc chuẩn 1900–2099 (lich-moc-chuan.json, UTC+7) & round-trip', () => {
  const { moc } = docJson('../../src/lib/tuvi-v2/data/lich-moc-chuan.json');
  assert.equal(moc.length, 200);
  const sai = [];
  for (const { duong, am } of moc) {
    const [d, m, y] = duong.split('/').map(Number);
    const kq = A.duongSangAm(d, m, y, 7);
    if (kq.ngay !== am.ngay || kq.thang !== am.thang || kq.nam !== am.nam || (kq.nhuan ? 1 : 0) !== am.nhuan) {
      sai.push(`${duong}: ${JSON.stringify(kq)} ≠ ${JSON.stringify(am)}`);
    }
    const nguoc = A.amSangDuong(kq.ngay, kq.thang, kq.nam, kq.nhuan, 7);
    if (!nguoc || nguoc.ngay !== d || nguoc.thang !== m || nguoc.nam !== y) {
      sai.push(`round-trip ${duong}: ${JSON.stringify(nguoc)}`);
    }
  }
  assert.deepEqual(sai, []);
});

test('[am-lich] Độc lập: sửa lỗi thangNhuan(2033) = 11 và các năm nhuận trọng điểm', () => {
  assert.equal(A.thangNhuan(1984, 7), 0);
  assert.equal(A.thangNhuan(1985, 7), 2);
  assert.equal(A.thangNhuan(1987, 7), 7);
  assert.equal(A.thangNhuan(2020, 7), 4);
  assert.equal(A.thangNhuan(2023, 7), 2);
  assert.equal(A.thangNhuan(2025, 7), 6);
  // Lỗi cũ ở lich-raw.js trả về 0; bản mới xử lý đúng tháng 11 nhuận năm 2033
  assert.equal(A.thangNhuan(2033, 7), 11);
  const m1 = A.amSangDuong(1, 11, 2033, true, 7);
  assert.ok(m1 !== null, 'Mùng 1 tháng 11 nhuận năm 2033 phải tồn tại');
  const am = A.duongSangAm(m1.ngay, m1.thang, m1.nam, 7);
  assert.deepEqual(am, { ngay: 1, thang: 11, nam: 2033, nhuan: true });
  // Từ chối tháng nhuận không tồn tại & ngày 30 ở tháng thiếu
  assert.equal(A.amSangDuong(1, 1, 2025, true, 7), null);
});

test('[am-lich] Độc lập: múi giờ lịch sử Việt Nam (UTC+8 trước 1968, UTC+7 từ 1968)', () => {
  assert.equal(A.muiGioLichSuTheoNam(1967), 8);
  assert.equal(A.muiGioLichSuTheoNam(1968), 7);
  // 01/02/1965: 30/12 Giáp Thìn (UTC+8) vs 01/01 Ất Tỵ (UTC+7) — đặc tả mục 1.5
  assert.deepEqual(A.duongSangAmLichSu(1, 2, 1965), { ngay: 30, thang: 12, nam: 1964, nhuan: false });
  assert.deepEqual(A.duongSangAm(1, 2, 1965, 7), { ngay: 1, thang: 1, nam: 1965, nhuan: false });
  assert.deepEqual(A.amSangDuongLichSu(30, 12, 1964, false), { ngay: 1, thang: 2, nam: 1965 });
  // Tết Mậu Thân 1968 miền Bắc (UTC+7): 29/01/1968
  assert.deepEqual(A.duongSangAmLichSu(29, 1, 1968), { ngay: 1, thang: 1, nam: 1968, nhuan: false });
  // Tết 1985 Việt Nam (UTC+7): 21/01/1985 vs Trung Quốc (UTC+8): 20/02/1985
  assert.deepEqual(A.duongSangAm(21, 1, 1985, 7), { ngay: 1, thang: 1, nam: 1985, nhuan: false });
  assert.deepEqual(A.duongSangAm(20, 2, 1985, 8), { ngay: 1, thang: 1, nam: 1985, nhuan: false });
});

test('[am-lich] Độc lập: Can Chi năm, tháng, ngày, giờ & Nạp Âm theo đặc tả 2.1 & 3.1', () => {
  assert.equal(A.canChiNam(1984).ten, 'Giáp Tý');
  assert.equal(A.canChiNam(2027).ten, 'Đinh Mùi');
  // Ngũ Hổ Độn: năm Giáp/Kỷ tháng Giêng Bính Dần; năm Đinh/Nhâm tháng Giêng Nhâm Dần
  assert.equal(A.canChiThang(1, 1984).ten, 'Bính Dần');
  assert.equal(A.canChiThang(1, 2027).ten, 'Nhâm Dần');
  assert.equal(A.canChiThang(12, 1973).ten, 'Ất Sửu'); // TC01 (bài mẫu Lê Bảo Huy)
  // Ngày 30/12/1973 = Canh Tý; giờ Hợi (22:30) = Đinh Hợi (TC01)
  const ccNgay = A.canChiNgay(A.soNgayJulius(30, 12, 1973));
  assert.equal(ccNgay.ten, 'Canh Tý');
  assert.equal(A.canChiGio(ccNgay.can, 22).ten, 'Đinh Hợi');
  // Nạp âm theo bảng 3.1
  assert.equal(A.napAm(0, 0), 'Hải Trung Kim');
  assert.equal(A.napAm(2, 2), 'Lô Trung Hỏa');
  assert.equal(A.napAm(9, 11), 'Đại Hải Thủy');
  assert.equal(A.hanhNapAm('Lô Trung Hỏa'), 'Hỏa');
});

test('[am-lich] Toàn diện 1900–2100 (73.414 ngày): round-trip 100% & không bao giờ có ngày 0', () => {
  const dau = A.soNgayJulius(1, 1, 1900);
  const cuoi = A.soNgayJulius(31, 12, 2100);
  assert.equal(cuoi - dau + 1, 73414);
  for (let j = dau; j <= cuoi; j++) {
    const d = A.tuSoNgayJulius(j);
    assert.equal(A.soNgayJulius(d.ngay, d.thang, d.nam), j);
    const am7 = A.duongSangAm(d.ngay, d.thang, d.nam, 7);
    assert.ok(am7.ngay >= 1 && am7.ngay <= 30, `Ngày âm bất hợp lệ ${JSON.stringify(am7)}`);
    const lai7 = A.amSangDuong(am7.ngay, am7.thang, am7.nam, am7.nhuan, 7);
    assert.deepEqual(lai7, d, `Round-trip TZ+7 lệch tại ${d.ngay}/${d.thang}/${d.nam}`);
  }
});

test('[am-lich] Đối chiếu 1900–2100 với lich-raw.js: ghi nhận đủ ca lệch và xác minh nguyên nhân', () => {
  const dau = A.soNgayJulius(1, 1, 1900);
  const cuoi = A.soNgayJulius(31, 12, 2100);
  let lechTz7 = 0;
  let lechLichSu = 0;
  const loiNgay0CuTz7 = [];
  const loiNgay0CuLichSu = [];

  for (let j = dau; j <= cuoi; j++) {
    const d = A.tuSoNgayJulius(j);

    const m7 = A.duongSangAm(d.ngay, d.thang, d.nam, 7);
    const c7 = HndOracle.duongSangAm(d.ngay, d.thang, d.nam, 7);
    if (m7.ngay !== c7.ngay || m7.thang !== c7.thang || m7.nam !== c7.nam || m7.nhuan !== c7.nhuan) {
      lechTz7++;
      if (c7.ngay === 0) loiNgay0CuTz7.push(`${d.ngay}/${d.thang}/${d.nam}`);
    }

    const tz = j < A.JDN_MOC_1968 ? 8 : 7;
    const mLs = A.duongSangAm(d.ngay, d.thang, d.nam, 'lichSu');
    const cLs = HndOracle.duongSangAm(d.ngay, d.thang, d.nam, tz);
    if (mLs.ngay !== cLs.ngay || mLs.thang !== cLs.thang || mLs.nam !== cLs.nam || mLs.nhuan !== cLs.nhuan) {
      lechLichSu++;
      if (cLs.ngay === 0) loiNgay0CuLichSu.push(`${d.ngay}/${d.thang}/${d.nam}`);
    }
  }

  // TZ+7: 122 ngày lệch = 2 ngày lỗi ngay:0 của lich-raw.js (7/5/2054, 9/4/2062)
  //       + 4 tháng có kỳ Sóc sát 00:00 (20/6/1944, 7/7/1967, 9/12/2072, 15/11/2077).
  assert.equal(lechTz7, 122);
  assert.deepEqual(loiNgay0CuTz7, ['7/5/2054', '9/4/2062']);

  // Chế độ lịch sử (UTC+8 <1968, UTC+7 ≥1968): 64 ngày lệch = 4 ngày lỗi ngay:0 của lich-raw.js
  // + 2 tháng tương lai xa (9/12/2072, 15/11/2077); 0 lệch trong giai đoạn 1948–2053.
  assert.equal(lechLichSu, 64);
  assert.deepEqual(loiNgay0CuLichSu, ['19/4/1939', '22/3/1947', '7/5/2054', '9/4/2062']);
});

// Kiểm thử bộ máy lịch và an sao. Chạy: npm test (không cần cài thêm gói).
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../src/lib/tuvi/lich-raw.js');
const T = require('../src/lib/tuvi/tuvi-raw.js');

const CHINH_TINH = ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh', 'Thiên Phủ',
  'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'];

function viTri(ls, tenSao) {
  return ls.cung.filter((c) => c.chinhTinh.concat(c.phuTinh).some((s) => s.ten === tenSao)).map((c) => c.tenChi);
}

test('Đổi lịch: Tết Nguyên đán theo lịch Việt Nam', () => {
  // [dương lịch] → mùng 1 tháng Giêng
  for (const [d, m, y] of [[17, 2, 2026], [29, 1, 2025], [10, 2, 2024], [22, 1, 2023], [25, 1, 2020]]) {
    const am = L.duongSangAm(d, m, y);
    assert.equal(am.ngay, 1, `${d}/${m}/${y}`);
    assert.equal(am.thang, 1, `${d}/${m}/${y}`);
    assert.equal(am.nam, y);
  }
});

test('Đổi lịch: năm 1985 Việt Nam ăn Tết sớm hơn Trung Quốc một tháng', () => {
  const am = L.duongSangAm(21, 1, 1985);
  assert.deepEqual([am.ngay, am.thang, am.nam], [1, 1, 1985]);
});

test('Đổi lịch: tháng nhuận', () => {
  assert.equal(L.thangNhuan(2023), 2);
  assert.equal(L.thangNhuan(2025), 6);
  assert.equal(L.thangNhuan(2020), 4);
});

test('Đổi lịch: âm → dương → âm khớp nhau trong 1900–2100', () => {
  for (let y = 1900; y <= 2100; y += 7) {
    for (let m = 1; m <= 12; m += 3) {
      const duong = L.amSangDuong(15, m, y, false);
      const am = L.duongSangAm(duong.ngay, duong.thang, duong.nam);
      assert.deepEqual([am.ngay, am.thang, am.nam], [15, m, y]);
    }
  }
});

test('Lá số mẫu 20/12/1995 18h nam (đối chiếu site xemtuvi.vn cũ)', () => {
  const ls = T.anLaSo({ lich: 'duong', ngay: 20, thang: 12, nam: 1995, gio: 18, gioiTinh: 'nam' });
  assert.equal(ls.banMenh, 'Sơn Đầu Hỏa');
  assert.equal(ls.cuc, 'Thổ Ngũ Cục');
  assert.equal(ls.menhTai, 'Dần');
  assert.match(ls.thanTai, /^Thân/);
  assert.deepEqual(viTri(ls, 'Tử Vi'), ['Ngọ']);
  assert.deepEqual(viTri(ls, 'Thiên Cơ'), ['Tỵ']);
  assert.deepEqual(viTri(ls, 'Vũ Khúc'), ['Dần']);
  assert.deepEqual(viTri(ls, 'Thiên Tướng'), ['Dần']);
  assert.deepEqual(viTri(ls, 'Phá Quân'), ['Thân']);
  assert.deepEqual(viTri(ls, 'Tham Lang'), ['Tý']);
  assert.deepEqual(viTri(ls, 'Thái Âm'), ['Hợi']);
  assert.deepEqual(viTri(ls, 'Lộc Tồn'), ['Mão']);
  assert.deepEqual(viTri(ls, 'Địa Kiếp'), ['Thân']);
  assert.deepEqual(viTri(ls, 'Địa Không'), ['Dần']);
  assert.deepEqual(viTri(ls, 'Đà La'), ['Dần']);
});

test('Quy luật bất biến trên 3.000 lá số ngẫu nhiên', () => {
  let seed = 12345;
  const rnd = (n) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
  for (let i = 0; i < 3000; i++) {
    const nam = 1930 + rnd(90), thang = 1 + rnd(12), ngay = 1 + rnd(28), gio = rnd(24);
    const ls = T.anLaSo({ lich: 'duong', ngay, thang, nam, gio, gioiTinh: rnd(2) ? 'nam' : 'nu' });
    const tag = `${ngay}/${thang}/${nam} ${gio}h`;
    // Mỗi chính tinh xuất hiện đúng một lần
    for (const s of CHINH_TINH) assert.equal(viTri(ls, s).length, 1, `${s} ${tag}`);
    // Tử Vi và Thiên Phủ đối xứng qua trục Dần–Thân
    const tv = L.CHI.indexOf(viTri(ls, 'Tử Vi')[0]), tp = L.CHI.indexOf(viTri(ls, 'Thiên Phủ')[0]);
    assert.equal((tv + tp) % 12, 4, `Tử Vi/Thiên Phủ ${tag}`);
    // Đủ 12 cung chức năng, đúng một cung Mệnh và một cung có Thân
    assert.equal(new Set(ls.cung.map((c) => c.ten)).size, 12, tag);
    assert.equal(ls.cung.filter((c) => c.laThan).length, 1, tag);
    // Kình Dương, Đà La kẹp Lộc Tồn
    const lt = L.CHI.indexOf(viTri(ls, 'Lộc Tồn')[0]);
    assert.equal(viTri(ls, 'Kình Dương')[0], L.CHI[(lt + 1) % 12], tag);
    assert.equal(viTri(ls, 'Đà La')[0], L.CHI[(lt + 11) % 12], tag);
    // Đại vận cung Mệnh bắt đầu đúng bằng số cục
    const soCuc = { 'Thủy Nhị Cục': 2, 'Mộc Tam Cục': 3, 'Kim Tứ Cục': 4, 'Thổ Ngũ Cục': 5, 'Hỏa Lục Cục': 6 }[ls.cuc];
    assert.equal(ls.cung.find((c) => c.ten === 'Mệnh').daiVanTu, soCuc, tag);
  }
});

test('Nhập giờ phút: canh giờ theo giờ đồng hồ, lá số ghi lại giờ phút', () => {
  const ls = T.anLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1990, gio: 7, phut: 30, gioiTinh: 'nam' });
  assert.equal(ls.gio.chi, 'Thìn');
  assert.equal(ls.gio.dongHo, '07:30');
  assert.equal(T.anLaSo({ lich: 'duong', ngay: 15, thang: 8, nam: 1990, gio: 0, gioiTinh: 'nam' }).gio.dongHo, '00:00');
});

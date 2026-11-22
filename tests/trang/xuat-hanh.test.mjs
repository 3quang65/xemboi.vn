// /xem-ngay/xuat-hanh: giờ hoàng đạo và hướng thần mùng 1–10 Tết. Bảng hướng đối chiếu lại với nguyên văn Ngọc hạp ký.
// Chạy: npx tsx --test tests/trang/xuat-hanh.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { xuatHanhTet, BAI_CA_HUONG } from '../../src/lib/trang/xuat-hanh.ts';
import { ngayLich } from '../../src/lib/trang/lich.ts';

const CAN = '甲乙丙丁戊己庚辛壬癸';
const HUONG = { 艮: 'Đông Bắc', 乾: 'Tây Bắc', 坤: 'Tây Nam', 離: 'Nam', 巽: 'Đông Nam', 東北: 'Đông Bắc', 西北: 'Tây Bắc', 西南: 'Tây Nam', 東南: 'Đông Nam', 東: 'Đông', 西: 'Tây', 南: 'Nam', 北: 'Bắc' };

/** Đọc bài ca: mỗi cụm "<các can><chữ đệm><hướng>" gán hướng cho các can đứng trước nó. */
function docBaiCa(van) {
  const kq = Array(10).fill(null);
  const re = new RegExp(`([${CAN}]+)[^${CAN}]*?(東北|西北|西南|東南|艮|乾|坤|離|巽|東|西|南|北)`, 'g');
  for (const m of van.replace(/^[^。]*大吉。/, '').matchAll(re)) for (const c of m[1]) kq[CAN.indexOf(c)] = HUONG[m[2]];
  return kq;
}

for (const b of BAI_CA_HUONG) {
  test(`Bảng ${b.ten} khớp nguyên văn ${b.tenBai}`, () => {
    assert.deepEqual(b.theoCan, docBaiCa(b.nguyenVan));
  });
}

test('Tết Đinh Mùi 2027: mùng 1 là thứ Bảy 06/02/2027, đủ 10 ngày liên tiếp', () => {
  const x = xuatHanhTet(2027);
  assert.equal(x.canChiNam, 'Đinh Mùi');
  assert.equal(x.ngay.length, 10);
  assert.equal(x.ngay[0].iso, '2027-02-06');
  assert.equal(x.ngay[0].thu, 'Thứ bảy');
  assert.equal(x.ngay[9].iso, '2027-02-15');
  for (const n of x.ngay) {
    const ct = ngayLich(...n.iso.split('-').reverse().map(Number));
    assert.equal(ct.am.thang, 1);
    assert.equal(ct.am.ngay, n.mung);
    assert.equal(n.canChiNgay, ct.canChiNgay.ten);
    assert.equal(n.gioHoangDao.length, 6);
  }
});

test('Hướng theo can ngày: can giống nhau thì hướng giống nhau; Giáp và Kỷ cùng Hỷ thần Đông Bắc', () => {
  const ds = [...xuatHanhTet(2027).ngay, ...xuatHanhTet(2028).ngay];
  const theoCan = new Map();
  for (const n of ds) {
    const truoc = theoCan.get(n.canNgay);
    if (truoc) assert.deepEqual(n.huong, truoc);
    theoCan.set(n.canNgay, n.huong);
  }
  for (const n of ds) if (n.canNgay === 'Giáp' || n.canNgay === 'Kỷ') assert.equal(n.huong.hyThan, 'Đông Bắc');
});

test('Năm ngoài phạm vi thì báo lỗi', () => {
  assert.throws(() => xuatHanhTet(1700), RangeError);
  assert.throws(() => xuatHanhTet(2027.5), RangeError);
});

test('Năm hiện trên trang: trong mùng 1–10 giữ năm đó, qua mùng 10 thì sang Tết sau', async () => {
  const { namXuatHanh } = await import('../../src/lib/trang/xuat-hanh.ts');
  const luc = (iso) => new Date(`${iso}T03:00:00Z`); // 10 giờ sáng giờ Việt Nam
  assert.equal(namXuatHanh(luc('2026-11-22')), 2027);
  assert.equal(namXuatHanh(luc('2027-02-06')), 2027); // mùng 1
  assert.equal(namXuatHanh(luc('2027-02-15')), 2027); // mùng 10
  assert.equal(namXuatHanh(luc('2027-02-16')), 2028); // mùng 11
});

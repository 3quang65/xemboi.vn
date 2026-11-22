// docs/v2/19: dữ liệu lịch cho trang công khai. Số đối chiếu lấy từ lịch Hồ Ngọc Đức (informatik.uni-leipzig.de/~duc/amlich).
// Chạy: npx tsx --test tests/trang/lich.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { ngayLich, thangLich, homNay, ngayHienTaiVN, tenThangAm, ngayHopLe, tietKhiNam } from '../../src/lib/trang/lich.ts';

test('Tết Bính Ngọ 2026: 17/02/2026 là mùng 1 tháng Giêng', () => {
  const d = ngayLich(17, 2, 2026);
  assert.deepEqual(d.am, { ngay: 1, thang: 1, nam: 2026, nhuan: false });
  assert.equal(d.canChiNam.ten, 'Bính Ngọ');
  assert.equal(d.thu, 'Thứ ba');
  assert.ok(d.ngayLe.some((l) => l.ten === 'Tết Nguyên Đán'));
  assert.equal(d.tenThangAm, 'tháng Giêng');
});

test('Giao thừa: ngày cuối tháng Chạp Ất Tỵ là 16/02/2026', () => {
  const d = ngayLich(16, 2, 2026);
  assert.equal(d.am.thang, 12);
  assert.equal(d.am.ngay, d.soNgayThangAm);
  assert.ok(d.ngayLe.some((l) => l.ten === 'Giao thừa'));
  const g = thangLich(2026, 2).hang.flat().find((o) => o.iso === '2026-02-16');
  assert.ok(g.ngayLe.some((l) => l.ten === 'Giao thừa'));
});

test('can chi ngày và giờ hoàng đạo: 01/01/2000 là ngày Mậu Ngọ', () => {
  const d = ngayLich(1, 1, 2000);
  assert.equal(d.canChiNgay.ten, 'Mậu Ngọ');
  assert.equal(d.thu, 'Thứ bảy');
  // Ngày Ngọ: hoàng đạo Tý, Sửu, Mão, Ngọ, Thân, Dậu
  assert.deepEqual(d.gioHoangDao.map((g) => g.chi), ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Thân', 'Dậu']);
  assert.equal(d.gio.length, 12);
  assert.equal(d.gio[0].canChi, 'Nhâm Tý');
});

test('tiết khí: Lập xuân 2026 bắt đầu 04/02', () => {
  const d = ngayLich(4, 2, 2026);
  assert.equal(d.tietKhi.ten, 'Lập xuân');
  assert.equal(d.tietKhi.batDau, '2026-02-04');
  assert.equal(d.tietKhi.batDauHomNay, true);
  const ds = tietKhiNam(2026);
  assert.equal(ds.length, 24);
  assert.ok(ds.some((t) => t.ten === 'Lập xuân' && t.ngay === '2026-02-04'));
});

test('lưới tháng: 6 hàng × 7 cột, bắt đầu Thứ hai, đánh dấu hôm nay', () => {
  const luc = new Date('2026-11-22T03:00:00Z');
  const l = thangLich(2026, 11, luc);
  assert.equal(l.hang.length, 6);
  assert.ok(l.hang.every((h) => h.length === 7));
  assert.equal(l.hang[0][0].iso, '2026-10-26'); // 01/11/2026 là Chủ nhật
  assert.equal(l.hang.flat().filter((o) => o.laHomNay).map((o) => o.iso)[0], '2026-11-22');
  assert.equal(l.hang.flat().filter((o) => o.trongThang).length, 30);
  assert.deepEqual(l.thangSau, { nam: 2026, thang: 12 });
  assert.deepEqual(thangLich(2026, 1).thangTruoc, { nam: 2025, thang: 12 });
});

test('giờ Việt Nam: 23:30 UTC ngày 21 là ngày 22 ở Việt Nam', () => {
  assert.deepEqual(ngayHienTaiVN(new Date('2026-11-21T23:30:00Z')), { ngay: 22, thang: 11, nam: 2026 });
  assert.equal(homNay(new Date('2026-11-21T23:30:00Z')).iso, '2026-11-22');
});

test('kiểm hợp lệ', () => {
  assert.equal(ngayHopLe(29, 2, 2024), true);
  assert.equal(ngayHopLe(29, 2, 2026), false);
  assert.equal(ngayHopLe(1, 13, 2026), false);
  assert.throws(() => ngayLich(31, 4, 2026), RangeError);
  assert.equal(tenThangAm(12), 'tháng Chạp');
  assert.equal(tenThangAm(4, true), 'tháng 4 nhuận');
});

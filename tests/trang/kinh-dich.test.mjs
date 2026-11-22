// docs/v2/19 F4: 64 quẻ và cách lập quẻ. Chạy: npx tsx --test tests/trang/kinh-dich.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { QUE_64, queTheoSo, queTheoSlug, queHo, gieoDongXu, queMaiHoaTheoThoiGian } from '../../src/lib/trang/kinh-dich.ts';

test('64 quẻ đủ, không trùng hào, không trùng slug', () => {
  assert.equal(QUE_64.length, 64);
  assert.equal(new Set(QUE_64.map((q) => q.hao.join(''))).size, 64);
  assert.equal(new Set(QUE_64.map((q) => q.slug)).size, 64);
  QUE_64.forEach((q, i) => assert.equal(q.so, i + 1));
  assert.equal(queTheoSo(1).ten, 'Thuần Càn');
  assert.equal(queTheoSo(11).ten, 'Địa Thiên Thái');
  assert.equal(queTheoSo(3).ten, 'Thủy Lôi Truân');
  assert.equal(queTheoSo(63).ten, 'Thủy Hỏa Ký Tế');
  assert.equal(queTheoSlug('11-dia-thien-thai').so, 11);
  assert.equal(queTheoSlug('01-thuan-can').so, 1);
});

test('quẻ hỗ và đồng xu', () => {
  assert.equal(queHo(queTheoSo(11).hao).so, 54); // Thái hỗ Quy Muội
  assert.equal(queHo(queTheoSo(1).hao).so, 1);
  const kq = gieoDongXu([9, 9, 9, 9, 9, 9]);
  assert.equal(kq.queChu.so, 1);
  assert.equal(kq.queBien.so, 2);
  assert.deepEqual(kq.haoDong, [1, 2, 3, 4, 5, 6]);
  const tinh = gieoDongXu([7, 7, 7, 8, 8, 8]);
  assert.equal(tinh.queChu.so, 11);
  assert.equal(tinh.queBien, null);
  const ngauNhien = gieoDongXu();
  assert.equal(ngauNhien.giaTriHao.length, 6);
  assert.throws(() => gieoDongXu([1, 2, 3]));
});

test('Mai Hoa: ví dụ Quan mai (năm Thìn, tháng 12, ngày 17, giờ Thân) ra Cách biến Hàm', () => {
  const kq = queMaiHoaTheoThoiGian(4, 12, 17, 8);
  assert.equal(kq.queChu.ten, 'Trạch Hỏa Cách');
  assert.deepEqual(kq.haoDong, [1]);
  assert.equal(kq.queBien.ten, 'Trạch Sơn Hàm');
});

test('Mai Hoa hiện tại: 23h sang ngày âm sau', async () => {
  const { queMaiHoaHienTai } = await import('../../src/lib/trang/kinh-dich.ts');
  // 22/11/2026 10:00 giờ VN = 03:00 UTC
  const kq = queMaiHoaHienTai(new Date(Date.UTC(2026, 10, 22, 3, 0)));
  assert.match(kq.thoiDiem, /^10:00 ngày 22\/11\/2026/);
  assert.equal(kq.haoDong.length, 1);
  const k23 = queMaiHoaHienTai(new Date(Date.UTC(2026, 10, 22, 16, 30)));
  const k00 = queMaiHoaHienTai(new Date(Date.UTC(2026, 10, 22, 17, 30)));
  assert.equal(k23.queChu.so, k00.queChu.so); // cùng ngày âm, cùng giờ Tý
});

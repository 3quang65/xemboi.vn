// docs/v2/19 F4: dữ liệu từ điển Tử vi. Chạy: npx tsx --test tests/trang/tu-vi-tu-dien.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { CUNG_TU_VI, CHINH_TINH, chinhTinhTheoSlug, cungTheoSlug } from '../../src/lib/trang/tu-vi-tu-dien.ts';

test('12 cung, 14 chính tinh, slug duy nhất', () => {
  assert.equal(CUNG_TU_VI.length, 12);
  assert.equal(CUNG_TU_VI[0].ten, 'Mệnh');
  assert.equal(cungTheoSlug('phu-the').ten, 'Phu Thê');
  assert.equal(CHINH_TINH.length, 14);
  assert.equal(new Set(CHINH_TINH.map((s) => s.slug)).size, 14);
});

test('Tử Vi hành Thổ; miếu hãm khớp bảng engine', () => {
  const tv = chinhTinhTheoSlug('tu-vi');
  assert.equal(tv.hanh, 'Thổ');
  assert.equal(tv.dacTinh.length, 12);
  assert.ok(tv.dacTinh.every((d) => d.ten));
  // Bảng engine 'BĐMBVMMĐMBVB': Dần M, Ngọ M
  assert.equal(tv.dacTinh[2].ma, 'M');
  assert.ok(tv.mieuVuong.includes('Dần') && tv.mieuVuong.includes('Ngọ'));
  assert.equal(chinhTinhTheoSlug('thai-duong').hanh, 'Hỏa');
});

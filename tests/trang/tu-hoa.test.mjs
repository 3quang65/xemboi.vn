// Tứ Hóa (Lệnh 48). Chạy: npx tsx --test tests/trang/tu-hoa.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { BANG_TU_HOA, BANG_TU_HOA_TQ, SO_PHAI_TU_HOA, TRICH_TU_HOA, GHI_CHU_TU_HOA, canCuaNam, tuHoaCuaCan } from '../../src/lib/trang/tu-hoa.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

const ten = (d) => [d.sao.loc.ten, d.sao.quyen.ten, d.sao.khoa.ten, d.sao.ky.ten];

test('bảng Việt: Giáp Liêm Phá Vũ Dương; Canh Nhật Vũ Đồng Âm; Nhâm Lương Tử Phủ Vũ', () => {
  assert.equal(BANG_TU_HOA.length, 10);
  assert.deepEqual(ten(tuHoaCuaCan(1)), ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương']);
  assert.deepEqual(ten(tuHoaCuaCan(7)), ['Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Thái Âm']);
  assert.deepEqual(ten(tuHoaCuaCan(9)), ['Thiên Lương', 'Tử Vi', 'Thiên Phủ', 'Vũ Khúc']);
  assert.deepEqual(ten(tuHoaCuaCan(5)), ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ']);
});

test('chỉ Canh, Nhâm khác phái; bảng TQ: Canh Khoa Âm Kỵ Đồng, Nhâm Khoa Tả Phù', () => {
  assert.deepEqual(BANG_TU_HOA.filter((d) => d.khacPhai).map((d) => d.can), ['Canh', 'Nhâm']);
  assert.deepEqual(ten(BANG_TU_HOA_TQ[6]), ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng']);
  assert.equal(BANG_TU_HOA_TQ[8].sao.khoa.ten, 'Tả Phù');
  // Bảng so phái khớp bảng máy
  const v = SO_PHAI_TU_HOA[0].phai[0], t = SO_PHAI_TU_HOA[0].phai[2];
  assert.deepEqual([v.loc, v.quyen, v.khoa, v.ky], ten(tuHoaCuaCan(7)));
  assert.deepEqual([t.loc, t.quyen, t.khoa, t.ky], ten(BANG_TU_HOA_TQ[6]));
  assert.equal(SO_PHAI_TU_HOA[1].phai[2].khoa, BANG_TU_HOA_TQ[8].sao.khoa.ten);
});

test('câu phú Toàn thư khớp bảng Việt ở 8 can không bàn cãi', () => {
  assert.equal(TRICH_TU_HOA.dich.length, 10);
  assert.ok(TRICH_TU_HOA.nguyenVan.includes('庚日武陰同'));
  for (const s of [...TRICH_TU_HOA.dich, TRICH_TU_HOA.giaiThich, ...Object.values(GHI_CHU_TU_HOA)]) assert.ok(!coChuHan(s));
});

test('can năm: 2024 Giáp, 2026 Bính, 1990 Canh; chính tinh có đường dẫn, phụ tinh không', () => {
  assert.equal(canCuaNam(2024), 1);
  assert.equal(canCuaNam(2026), 3);
  assert.equal(canCuaNam(1990), 7);
  assert.equal(tuHoaCuaCan(1).sao.loc.duongDan, '/tu-vi/sao/liem-trinh');
  assert.equal(tuHoaCuaCan(3).sao.khoa.duongDan, null); // Văn Xương
});

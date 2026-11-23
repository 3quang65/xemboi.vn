// 10 thiên thể chiêm tinh (Lệnh 50). Chạy: npx tsx --test tests/trang/hanh-tinh.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { HANH_TINH_CHI_TIET, TRICH_HANH_TINH, cungHienTai, hanhTinhTheoSlug } from '../../src/lib/trang/hanh-tinh.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

test('10 trang, 7 cổ điển có chi tiết, 3 hành tinh ngoài không', () => {
  assert.equal(HANH_TINH_CHI_TIET.length, 10);
  assert.equal(HANH_TINH_CHI_TIET.filter((h) => h.coDienChiTiet).length, 7);
  assert.equal(new Set(HANH_TINH_CHI_TIET.map((h) => h.slug)).size, 10);
  assert.equal(hanhTinhTheoSlug('sao-thien-vuong').coDienChiTiet, null);
});

test('theo Tetrabiblos: Thổ hung, ngày, dương, nhà Ma Kết Bảo Bình, vượng Thiên Bình, hãm Bạch Dương; Kim cát, âm, đêm', () => {
  const tho = hanhTinhTheoSlug('sao-tho').coDienChiTiet;
  assert.deepEqual([tho.cat, tho.gioi, tho.ngayDem], ['hung', 'duong', 'ngay']);
  assert.deepEqual(tho.nha.map((c) => c.ten), ['Ma Kết', 'Bảo Bình']);
  assert.equal(tho.vuong.ten, 'Thiên Bình');
  assert.equal(tho.ham.ten, 'Bạch Dương');
  const kim = hanhTinhTheoSlug('sao-kim').coDienChiTiet;
  assert.deepEqual([kim.cat, kim.gioi, kim.ngayDem], ['cat', 'am', 'dem']);
  assert.equal(hanhTinhTheoSlug('mat-troi').coDienChiTiet.nha[0].ten, 'Sư Tử');
  assert.equal(hanhTinhTheoSlug('sao-hoa').coDienChiTiet.ngayDem, 'dem');
});

test('câu trích có trong bản Gutenberg; bản dịch không có chữ Hán', () => {
  const tep = 'D:/VibeCode/Antigravity/thu-vien-rag/gutenberg/TX01__pg70850.txt';
  const goc = existsSync(tep) ? readFileSync(tep, 'utf8').replace(/\s+/g, ' ') : null;
  for (const t of Object.values(TRICH_HANH_TINH)) {
    if (goc) assert.ok(goc.includes(t.en), t.en.slice(0, 40));
    assert.ok(!coChuHan(t.vi) && t.vi.length > 20);
  }
});

test('vị trí hiện tại: Mặt Trời 24/11/2026 ở Nhân Mã', () => {
  const r = cungHienTai('mat-troi', new Date(Date.UTC(2026, 10, 24, 5)));
  assert.equal(r.cung.ten, 'Nhân Mã');
  assert.ok(r.doTrongCung >= 0 && r.doTrongCung < 30);
});

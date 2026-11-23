// Cặp con giáp (Lệnh 48). Chạy: npx tsx --test tests/trang/cap-con-giap.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { capConGiap, capKhacCua, docSlugCap, maTranCap, quanHeHaiChi, tatCaCap } from '../../src/lib/trang/cap-con-giap.ts';
import { quanHeChi } from '../../src/lib/trang/xem-tuoi.ts';
import { TRICH_BAT_TU } from '../../src/lib/trang/bat-tu-truc-quan.ts';

const CAM = /hóa giải|vật phẩm|sát khí|cải vận|xui|tai họa|đại kỵ/i;

test('đủ 78 cặp, slug duy nhất, Tỵ dùng "ti"', () => {
  const ds = tatCaCap();
  assert.equal(ds.length, 78);
  assert.equal(new Set(ds.map((c) => c.slug)).size, 78);
  assert.equal(capConGiap(0, 5).slug, 'ty-va-ti');
  assert.equal(capConGiap(5, 0).slug, 'ty-va-ti');
});

test('các cặp mẫu: Dần–Ngọ tam hợp; Tý–Sửu lục hợp; Tý–Ngọ xung; Dần–Tỵ hại + hình; Sửu–Mùi xung + hình; Thìn–Thìn tự hình', () => {
  const loai = (a, b) => quanHeHaiChi(a, b).map((q) => q.loai).sort();
  assert.deepEqual(loai(2, 6), ['tam-hop']);
  assert.deepEqual(loai(0, 1), ['luc-hop', 'tam-hoi']);
  assert.deepEqual(loai(0, 6), ['xung']);
  assert.deepEqual(loai(2, 5), ['hai', 'hinh']);
  assert.deepEqual(loai(1, 7), ['hinh', 'xung']);
  assert.deepEqual(loai(4, 4), ['tu-hinh']);
  assert.deepEqual(loai(0, 0), []);
  assert.deepEqual(loai(0, 3), ['hinh']);
  assert.equal(capConGiap(1, 7).nhomChinh, 'xung');
  assert.equal(capConGiap(2, 3).nhomChinh, 'khong'); // Dần Mão: chỉ cùng tam hội
});

test('khớp quanHeChi của trang xem tuổi ở mọi cặp khác chi (tốt ↔ hợp, xấu ↔ xung/hại)', () => {
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) {
    const cu = quanHeChi(a, b).muc;
    const ds = quanHeHaiChi(a, b).map((q) => q.loai);
    const hop = ds.includes('tam-hop') || ds.includes('luc-hop');
    const xau = ds.includes('xung') || ds.includes('hai');
    if (cu === 'tot') assert.ok(hop, `${a}-${b}`);
    if (hop) assert.equal(cu, 'tot', `${a}-${b}`);
    if (!hop && xau) assert.equal(cu, 'xau', `${a}-${b}`);
  }
});

test('mọi trích dẫn có trong TRICH_BAT_TU; câu không chứa từ cấm; slug đảo được nhận và chuẩn hóa', () => {
  for (const c of tatCaCap()) {
    assert.ok(!CAM.test(c.tomTat), c.slug);
    for (const q of c.quanHe) { for (const m of q.trich) assert.ok(TRICH_BAT_TU[m], m); assert.ok(!CAM.test(q.cau)); }
  }
  assert.deepEqual(docSlugCap('ngo-va-dan'), { a: 2, b: 6, chuan: false, slugChuan: 'dan-va-ngo' });
  assert.equal(docSlugCap('dan-va-ngo').chuan, true);
  assert.equal(docSlugCap('meo-va-cho'), null);
});

test('ma trận 12×12 đối xứng; 11 cặp khác của mỗi chi', () => {
  const m = maTranCap();
  for (let a = 0; a < 12; a++) for (let b = 0; b < 12; b++) assert.equal(m.o[a][b].duongDan, m.o[b][a].duongDan);
  assert.equal(capKhacCua(3).length, 11);
});

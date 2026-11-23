// Dữ liệu trực quan nhóm tra cứu (Lệnh 45). Chạy: npx tsx --test tests/trang/tra-cuu-truc-quan.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { CON_GIAP, HOA_GIAP, quanHeHanh } from '../../src/lib/trang/can-chi.ts';
import { TRICH_BAT_TU } from '../../src/lib/trang/bat-tu-truc-quan.ts';
import { docNhanhNamSinh, luoi60HoaGiap, quanHeConGiap, vongConGiap, vongNguHanh } from '../../src/lib/trang/tra-cuu-truc-quan.ts';

const CAM = /hóa giải|vật phẩm|sát khí|cải vận|xui|tai họa/i;

test('vòng ngũ hành: cạnh sinh và khắc khớp quanHeHanh', () => {
  const v = vongNguHanh();
  assert.equal(v.dinh.length, 5);
  assert.equal(v.canh.length, 10);
  for (const c of v.canh) {
    const q = quanHeHanh(c.tu);
    assert.equal(c.den, c.loai === 'sinh' ? q.sinhRa : q.khac, `${c.tu} ${c.loai} ${c.den}`);
  }
  assert.equal(v.dinh[0].hanh, 'Hỏa');
  assert.equal(v.dinh[0].y, -1);
  const m = vongNguHanh('Mộc');
  assert.equal(m.canh.filter((c) => c.noiBat).length, 4);
  assert.deepEqual(Object.fromEntries(m.dinh.map((d) => [d.hanh, d.vaiTro])), { 'Hỏa': 'sinh-ra', 'Thổ': 'khac', 'Kim': 'bi-khac', 'Thủy': 'duoc-sinh', 'Mộc': 'chinh' });
});

test('quan hệ con giáp khớp bảng CON_GIAP, có trích dẫn hợp lệ', () => {
  for (let i = 0; i < 12; i++) {
    const q = quanHeConGiap(i);
    const c = CON_GIAP[i];
    assert.deepEqual([...q.tamHop.chi].sort(), [...c.tamHop].sort(), c.chi);
    assert.equal(q.lucHop, c.lucHop);
    assert.equal(q.xung, c.lucXung);
    assert.ok(q.tamHoi.chi.includes(c.chi));
    assert.notEqual(q.hai, c.chi);
    for (const ds of Object.values(q.trich)) for (const ma of ds) assert.ok(TRICH_BAT_TU[ma], ma);
  }
  // Dần: hình vô ân với Tỵ, Thân; Ngọ: tự hình; Tý: hình vô lễ với Mão.
  assert.deepEqual(quanHeConGiap(2).hinh, { nhom: 'vo-an', chi: ['Dần', 'Tỵ', 'Thân'] });
  assert.equal(quanHeConGiap(6).tuHinh, true);
  assert.equal(quanHeConGiap(6).hinh, null);
  assert.deepEqual(quanHeConGiap(0).hinh, { nhom: 'vo-le', chi: ['Tý', 'Mão'] });
  assert.equal(quanHeConGiap(0).hai, 'Mùi');
});

test('vòng con giáp: 12 chi cách 30°', () => {
  const v = vongConGiap();
  assert.equal(v.length, 12);
  v.forEach((x, i) => assert.equal(x.goc, i * 30));
  assert.equal(v[0].chi, 'Tý');
});

test('lưới 60 hoa giáp: đúng 1 ô năm nay, mỗi ô có năm cách nhau 60', () => {
  const l = luoi60HoaGiap(2026);
  assert.equal(l.length, 60);
  assert.deepEqual(l.filter((o) => o.laNamNay).map((o) => o.ten), ['Bính Ngọ']);
  for (const o of l) {
    assert.equal(o.cacNam.length, 2);
    assert.equal(o.cacNam[1] - o.cacNam[0], 60);
  }
  assert.equal(l[0].ten, HOA_GIAP[0].ten);
});

test('Đọc nhanh năm sinh 1990', () => {
  const d = docNhanhNamSinh(1990, 2026);
  assert.ok(d.cau.startsWith('Sinh năm âm 1990 là tuổi Canh Ngọ (Ngựa), nạp âm Lộ Bàng Thổ hành Thổ'), d.cau);
  assert.ok(d.cau.endsWith('Năm 2026 tròn 37 tuổi mụ.'));
  assert.equal(d.the.length, 5);
  assert.ok(!CAM.test(d.cau + d.the.map((t) => t.chiTiet).join('')));
});

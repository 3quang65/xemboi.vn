// docs/v2/19 F3: dữ liệu Can chi & mệnh. Chạy: npx tsx --test tests/trang/can-chi.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HOA_GIAP, NAP_AM, CON_GIAP, namSinh, cungPhi, slugViet, hoaGiapTheoSlug, napAmTheoSlug, conGiapTheoSlug,
  quanHeHanh, mauHopMenh, danhSachNamSinh, namCuaHoaGiap, namSinhHopLe,
} from '../../src/lib/trang/can-chi.ts';

test('bảng 60 hoa giáp, 30 nạp âm, 12 con giáp đủ và slug duy nhất', () => {
  assert.equal(HOA_GIAP.length, 60);
  assert.equal(new Set(HOA_GIAP.map((h) => h.slug)).size, 60);
  assert.equal(NAP_AM.length, 30);
  assert.equal(new Set(NAP_AM.map((n) => n.slug)).size, 30);
  assert.equal(CON_GIAP.length, 12);
  assert.equal(hoaGiapTheoSlug('giap-ty').napAm, 'Hải Trung Kim');
  assert.equal(napAmTheoSlug('hai-trung-kim').hoaGiap[1].ten, 'Ất Sửu');
  assert.equal(conGiapTheoSlug('ty').ten, 'Chuột');
  assert.equal(slugViet('Lư Trung Hỏa'), 'lu-trung-hoa');
  assert.equal(slugViet('Đinh Mão'), 'dinh-mao');
});

test('sinh năm 1990: Canh Ngọ, Lộ Bàng Thổ; nam Khảm, nữ Cấn; Tết 27/01/1990', () => {
  const t = namSinh(1990);
  assert.equal(t.canChi, 'Canh Ngọ');
  assert.equal(t.conGiap, 'Ngựa');
  assert.equal(t.napAm, 'Lộ Bàng Thổ');
  assert.equal(t.hanh, 'Thổ');
  assert.equal(t.cungPhiNam.ten, 'Khảm');
  assert.equal(t.cungPhiNu.ten, 'Cấn');
  assert.equal(t.tuNgay, '1990-01-27');
  assert.equal(t.denNgay, '1991-02-14');
  assert.equal(t.tuoiAm(2026), 37);
});

test('cung phi các mốc quen thuộc', () => {
  assert.equal(cungPhi(2000, 'nam').ten, 'Ly');
  assert.equal(cungPhi(2000, 'nu').ten, 'Càn');
  assert.equal(cungPhi(1985, 'nam').ten, 'Càn');
  assert.equal(cungPhi(1985, 'nu').ten, 'Ly');
  // số 5: nam gửi Khôn, nữ gửi Cấn (1986: nam số 5 → Khôn; 1990: nữ số 5 → Cấn)
  assert.deepEqual([cungPhi(1986, 'nam').so, cungPhi(1986, 'nam').ten], [5, 'Khôn']);
  assert.deepEqual([cungPhi(1990, 'nu').so, cungPhi(1990, 'nu').ten], [5, 'Cấn']);
  assert.equal(cungPhi(1987, 'nam').ten, 'Tốn');
});

test('ngũ hành sinh khắc và màu', () => {
  assert.deepEqual(quanHeHanh('Thổ'), { hanh: 'Thổ', sinhRa: 'Kim', duocSinhBoi: 'Hỏa', khac: 'Thủy', biKhacBoi: 'Mộc' });
  const m = mauHopMenh('Kim');
  assert.ok(m.banMenh.includes('trắng') && m.tuongSinh.includes('vàng') && m.nenTranh.includes('đỏ'));
});

test('danh sách năm sinh 1930–2030 và năm của hoa giáp', () => {
  const ds = danhSachNamSinh();
  assert.equal(ds.flatMap((n) => n.nam).length, 101);
  assert.equal(ds[0].thapKy, 1930);
  assert.deepEqual(namCuaHoaGiap(hoaGiapTheoSlug('canh-ngo'), 1900, 2050), [1930, 1990, 2050]);
  assert.equal(namSinhHopLe(1929), false);
  assert.throws(() => namSinh(2031), RangeError);
});

// test/tuvi/nap-am.test.mjs — run: node --test test/tuvi/nap-am.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  CAN, CHI, NAP_AM_NHOM, chiSo, hoaGiap, napAm, napAmTheoChiSo, canChiCuaNam, bangNapAm,
} from '../../lib/tuvi/nap-am.mjs';

const json = JSON.parse(fs.readFileSync(new URL('../../data/tuvi/nap-am.json', import.meta.url), 'utf8'));

test('JSON đúng 60 dòng, đánh số 1–60 liên tục', () => {
  assert.equal(json.soDong, 60);
  assert.equal(json.rows.length, 60);
  assert.deepEqual(json.rows.map((r) => r.stt), Array.from({ length: 60 }, (_, i) => i + 1));
});

test('không trùng: 60 hoa giáp và 60 nạp âm không lặp cặp can chi', () => {
  const ten = json.rows.map((r) => r.hoaGiap);
  assert.equal(new Set(ten).size, 60);
  const cap = json.rows.map((r) => `${r.can}|${r.chi}`);
  assert.equal(new Set(cap).size, 60);
  // 30 nạp âm × đúng 2 cặp can chi
  const dem = new Map();
  for (const r of json.rows) dem.set(r.napAm, (dem.get(r.napAm) || 0) + 1);
  assert.equal(dem.size, 30);
  assert.deepEqual([...new Set(dem.values())], [2]);
});

test('round-trip 60/60: chỉ số → can chi → chỉ số → nạp âm', () => {
  let dung = 0;
  for (let i = 0; i < 60; i++) {
    const row = json.rows[i];
    assert.equal(row.hoaGiap, hoaGiap(i));
    assert.equal(row.can, CAN[i % 10]);
    assert.equal(row.chi, CHI[i % 12]);
    assert.equal(chiSo(row.can, row.chi), i);
    const n = napAm(row.can, row.chi);
    assert.equal(n.ten, row.napAm);
    assert.equal(n.hanh, row.hanh);
    assert.equal(chiSo(...row.hoaGiap.split(' ')), i);
    dung++;
  }
  assert.equal(dung, 60);
});

test('module sinh đúng bảng JSON (60/60)', () => {
  assert.deepEqual(bangNapAm(), json.rows);
});

test('5 mốc đối chiếu sách (Tam Mệnh Thông Hội / Tử Vi Đẩu Số Tân Biên)', () => {
  const sach = [
    ['Giáp', 'Tý', 'Hải Trung Kim'],
    ['Bính', 'Dần', 'Lư Trung Hỏa'],
    ['Mậu', 'Thìn', 'Đại Lâm Mộc'],
    ['Canh', 'Ngọ', 'Lộ Bàng Thổ'],
    ['Quý', 'Hợi', 'Đại Hải Thủy'],
  ];
  for (const [can, chi, ten] of sach) assert.equal(napAm(can, chi).ten, ten, `${can} ${chi}`);
});

test('ngũ hành đúng cho 5 mốc + can chi năm', () => {
  assert.equal(napAm('Giáp', 'Tý').hanh, 'Kim');
  assert.equal(napAm('Bính', 'Dần').hanh, 'Hỏa');
  assert.equal(napAm('Mậu', 'Thìn').hanh, 'Mộc');
  assert.equal(napAm('Canh', 'Ngọ').hanh, 'Thổ');
  assert.equal(napAm('Quý', 'Hợi').hanh, 'Thủy');
  assert.deepEqual(canChiCuaNam(1984), { can: 'Giáp', chi: 'Tý' });
  assert.deepEqual(canChiCuaNam(2024), { can: 'Giáp', chi: 'Thìn' });
  assert.deepEqual(canChiCuaNam(2025), { can: 'Ất', chi: 'Tỵ' });
});

test('cặp can chi sai bị loại', () => {
  assert.equal(chiSo('Giáp', 'Sửu'), -1); // lệch chẵn lẻ
  assert.equal(napAm('Giáp', 'Sửu'), null);
  assert.throws(() => napAmTheoChiSo(60), RangeError);
  assert.throws(() => hoaGiap(-1), RangeError);
});

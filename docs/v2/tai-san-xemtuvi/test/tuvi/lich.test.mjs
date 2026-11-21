// test/tuvi/lich.test.mjs — run: node --test test/tuvi/lich.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { duongSangAm, amSangDuong, muiGioSo } from '../../lib/tuvi/lich.mjs';

const doc = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));

test('200 mốc chuẩn (10 mốc mỗi thập kỷ, 1900–2099) khớp 0 sai', () => {
  const { moc } = doc('../../data/tuvi/lich-moc-chuan.json');
  assert.equal(moc.length, 200);
  const sai = [];
  for (const { duong, am } of moc) {
    const [d, m, y] = duong.split('/').map(Number);
    const r = duongSangAm(`${y}-${m}-${d}`);
    if (r.ngay !== am.ngay || r.thang !== am.thang || r.nam !== am.nam || r.nhuan !== am.nhuan) {
      sai.push(`${duong} -> ${JSON.stringify(r)} (chuẩn ${JSON.stringify(am)})`);
    }
  }
  assert.deepEqual(sai, []);
});

test('108 ngày Tết 1984–2091 (bảng Wikipedia, UTC+7) khớp 0 sai', () => {
  const { rows } = doc('../../data/tuvi/tet-wikipedia-1984-2091.json');
  assert.equal(rows.length, 108);
  const sai = [];
  for (const { nam, duong } of rows) {
    const r = amSangDuong(nam, 1, 1);
    const [d, m, y] = duong.split('/').map(Number);
    if (r.ngay !== d || r.thang !== m || r.nam !== y) sai.push(`${nam}: ${JSON.stringify(r)} ≠ ${duong}`);
  }
  assert.deepEqual(sai, []);
});

test('ba mốc bắt buộc', () => {
  assert.deepEqual(duongSangAm('2000-02-29'), { nam: 2000, thang: 1, ngay: 25, nhuan: 0 });
  assert.deepEqual(duongSangAm('1999-12-31'), { nam: 1999, thang: 11, ngay: 24, nhuan: 0 });
  assert.deepEqual(duongSangAm('1950-02-19'), { nam: 1950, thang: 1, ngay: 3, nhuan: 0 });
});

test('round-trip dương → âm → dương 200/200', () => {
  const { moc } = doc('../../data/tuvi/lich-moc-chuan.json');
  const sai = [];
  for (const { duong } of moc) {
    const [d, m, y] = duong.split('/').map(Number);
    const l = duongSangAm(`${y}-${m}-${d}`);
    const s = amSangDuong(l.nam, l.thang, l.ngay, l.nhuan);
    if (s.ngay !== d || s.thang !== m || s.nam !== y) sai.push(`${duong} -> ${JSON.stringify(l)} -> ${JSON.stringify(s)}`);
  }
  assert.deepEqual(sai, []);
});

test('nhận tên múi giờ và độ lệch giờ như nhau', () => {
  assert.equal(muiGioSo('Asia/Ho_Chi_Minh'), 7);
  assert.deepEqual(duongSangAm('2000-02-29', 'Asia/Ho_Chi_Minh'), duongSangAm('2000-02-29', 7));
});

test('tháng nhuận: 2025 có tháng 6 nhuận, round-trip đúng', () => {
  const l = duongSangAm('2025-07-25'); // 1/6 nhuận Ất Tỵ
  assert.equal(l.thang, 6);
  assert.equal(l.nhuan, 1);
  const s = amSangDuong(l.nam, l.thang, l.ngay, l.nhuan);
  assert.deepEqual(s, { ngay: 25, thang: 7, nam: 2025 });
  // tháng 6 thường (nhuan=0) vẫn tồn tại và khác ngày
  const thuong = amSangDuong(2025, 6, 1, 0);
  assert.notDeepEqual(thuong, s);
});

test('dữ liệu vào sai bị từ chối', () => {
  assert.throws(() => duongSangAm('2025-13-01'), RangeError);
  assert.throws(() => duongSangAm('không-phải-ngày'), RangeError);
  assert.throws(() => duongSangAm('2025-01-01', 'Asia/Khong_Co'), RangeError);
  assert.throws(() => amSangDuong(2025, 1, 1, 1), RangeError); // 2025 nhuận tháng 6, không phải tháng 1
});

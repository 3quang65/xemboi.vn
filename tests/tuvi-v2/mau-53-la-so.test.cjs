// Test MỚI: Đối chiếu engine JS (src/lib/tuvi-v2) trên toàn bộ 53 lá số mẫu
// (11 lá trong tuvi-test-cases.json + 42 lá trong nghien-cuu/mau/mo-rong.json).
// So sánh các trường: lunar, canChi, menh, than, cuc, tuHoa, chinhTinh.
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../../src/lib/tuvi-v2/tuvi-raw.js');
const { cases: tcCases } = require('../../docs/v2/tai-san-xemtuvi/docs/nghien-cuu/tuvi-test-cases.json');
const mrCases = require('../../docs/v2/tai-san-xemtuvi/nghien-cuu/mau/mo-rong.json');

function layTuHoa(ls) {
  const kq = {};
  for (const cg of ls.cung) {
    for (const s of cg.chinhTinh.concat(cg.phuTinh)) {
      if (s.hoa) kq[s.hoa] = s.ten;
    }
  }
  return kq;
}

function layChinhTinh(ls) {
  const kq = {};
  for (const cg of ls.cung) {
    for (const s of cg.chinhTinh) kq[s.ten] = cg.tenChi;
  }
  return kq;
}

function kiemTraLaSo(mau, laMoRong) {
  const i = mau.input;
  const ls = T.anLaSo({
    lich: i.lich || 'duong',
    ngay: i.ngay,
    thang: i.thang,
    nam: i.nam,
    nhuan: i.nhuan,
    gio: i.gio,
    phut: i.phut,
    gioiTinh: i.gioiTinh,
  });
  const kv = mau.kyVong;
  const lunarMongDoi = laMoRong ? kv.lunar : kv.amLich;

  assert.deepEqual(ls.am, lunarMongDoi, `${mau.id}: lệch lunar`);
  assert.deepEqual(ls.canChi, kv.canChi, `${mau.id}: lệch canChi`);
  assert.equal(ls.menhTai, kv.menh, `${mau.id}: lệch menh`);
  assert.equal(ls.thanTai.split(' ')[0], kv.than, `${mau.id}: lệch than`);
  assert.equal(ls.cuc, kv.cuc, `${mau.id}: lệch cuc`);
  assert.deepEqual(layTuHoa(ls), kv.tuHoa, `${mau.id}: lệch tuHoa`);
  assert.deepEqual(layChinhTinh(ls), kv.chinhTinh, `${mau.id}: lệch chinhTinh`);
  assert.ok(ls.quyUoc && ls.quyUoc.gioTyMuon === 'ngaySau', `${mau.id}: thiếu quyUoc trong kết quả`);
}

test('Tổng số lá số mẫu đúng 53 (11 TC + 42 MR)', () => {
  assert.equal(tcCases.length, 11);
  assert.equal(mrCases.length, 42);
  assert.equal(tcCases.length + mrCases.length, 53);
});

for (const c of tcCases) {
  test(`[53 mẫu / TC] ${c.id} — ${c.ten}`, () => {
    kiemTraLaSo(c, false);
  });
}

for (const c of mrCases) {
  test(`[53 mẫu / MR] ${c.id} — ${c.ten}`, () => {
    kiemTraLaSo(c, true);
  });
}

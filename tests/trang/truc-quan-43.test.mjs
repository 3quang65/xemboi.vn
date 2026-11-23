// Dữ liệu trực quan Lệnh 43. Chạy: npx tsx --test tests/trang/truc-quan-43.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { lapLaSoCongKhai } from '../../src/lib/trang/la-so.ts';
import { gieoDongXu } from '../../src/lib/trang/kinh-dich.ts';
import { xemTuoiVoChong } from '../../src/lib/trang/xem-tuoi.ts';
import { docNhanhQue, docNhanhTuVi, docNhanhXemTuoi, gianNhan, sauHao, tamPhuongTuChinh } from '../../src/lib/trang/truc-quan-43.ts';

const CAM = /hóa giải|vật phẩm|sát khí|cải vận/i;
const kheNhoNhat = (r) => {
  const sx = [...r].sort((a, b) => a - b);
  let m = Infinity;
  for (let i = 0; i < sx.length; i++) m = Math.min(m, i === sx.length - 1 ? sx[0] + 360 - sx[i] : sx[i + 1] - sx[i]);
  return m;
};
const cach = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };

test('tam phương tứ chính: Dần → Ngọ, Tuất tam hợp, Thân xung chiếu', () => {
  assert.deepEqual(tamPhuongTuChinh(2), { ban: 2, tamHop: [6, 10], xungChieu: 8, tatCa: [2, 6, 8, 10] });
  for (let c = 0; c < 12; c++) {
    const t = tamPhuongTuChinh(c);
    assert.equal(new Set(t.tatCa).size, 4);
    assert.equal(tamPhuongTuChinh(t.xungChieu).xungChieu, c);
  }
});

test('Đọc nhanh tử vi khớp lá số', () => {
  const r = lapLaSoCongKhai({ lich: 'duong', ngay: 15, thang: 8, nam: 1990, gio: 9, gioiTinh: 'nam', namXem: 2026 });
  assert.ok(r.ok);
  const kq = r.ketQua;
  const d = docNhanhTuVi(kq);
  const menh = kq.laSo.cung.find((c) => c.ten === 'Mệnh');
  assert.equal(d.tamPhuongMenh.ban, menh.chi);
  assert.ok(d.cau.startsWith(`Mệnh an tại ${menh.tenChi}`));
  assert.ok(d.cau.includes(kq.laSo.cuc));
  assert.equal(d.the.length, kq.daiVan.some((x) => x.dangChay) ? 5 : 4);
  assert.ok(!CAM.test(d.cau + d.the.map((t) => t.chiTiet).join('')));
});

test('Quẻ: 6 hào, hào động đổi ở quẻ biến', () => {
  const kq = gieoDongXu([7, 8, 9, 7, 6, 8]);
  const h = sauHao(kq);
  assert.equal(h.length, 6);
  assert.deepEqual(h.filter((x) => x.dong).map((x) => x.thu), [3, 5]);
  assert.deepEqual(h.map((x) => x.haoBien), kq.queBien.hao);
  const d = docNhanhQue(kq);
  assert.ok(d.cau.includes('hào tam, hào ngũ') && d.cau.includes(kq.queBien.ten));
  assert.equal(d.the.length, 4);
  const tinh = docNhanhQue(gieoDongXu([7, 8, 7, 8, 7, 8]));
  assert.ok(tinh.cau.includes('không có hào động'));
  assert.equal(tinh.the.length, 3);
});

test('Xem tuổi: thẻ theo tiêu chí, không dùng chữ "xấu"', () => {
  const kq = xemTuoiVoChong(1990, 1992);
  const d = docNhanhXemTuoi(kq);
  assert.equal(d.the.length, kq.tieuChi.length);
  assert.ok(d.cau.includes(`${kq.dem.tot} hợp`));
  for (const t of d.the) assert.ok(!/xấu/i.test(t.giaTri));
});

test('giãn nhãn: đủ khoảng cách, giữ vị trí khi đã thưa, lệch ít', () => {
  const thua = [10, 50, 100, 200, 300];
  assert.deepEqual(gianNhan(thua, 8), thua);
  // Cụm đối xứng giãn đều quanh tâm.
  assert.deepEqual(gianNhan([100, 100, 100], 8).map((x) => Math.round(x)), [92, 100, 108]);
  const ca = [[100, 101, 102, 103, 104], [355, 357, 1, 3], [0, 0, 0, 120, 121], [10, 12, 14, 16, 18, 20, 22, 24, 26, 28]];
  for (const g of ca) {
    const r = gianNhan(g, 8);
    assert.ok(kheNhoNhat(r) >= 8 - 1e-6, `${g} → ${r}`);
    for (let i = 0; i < g.length; i++) assert.ok(cach(r[i], g[i]) <= (8 * g.length) / 2 + 1e-6, `${g} → ${r}`);
  }
  for (let s = 1; s <= 300; s++) {
    const g = Array.from({ length: 12 }, (_, i) => Math.abs(Math.sin(s * 97 + i * 13) * 1e4) % 360);
    assert.ok(kheNhoNhat(gianNhan(g, 9)) >= 9 - 1e-6, `seed ${s}`);
  }
});

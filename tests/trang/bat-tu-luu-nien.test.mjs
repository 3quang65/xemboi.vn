// Lưu niên và tam trụ bát tự. Chạy: npx tsx --test tests/trang/bat-tu-luu-nien.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { lapLaSoBatTu } from '../../src/lib/trang/bat-tu.ts';
import { quanHeTru } from '../../src/lib/trang/bat-tu-truc-quan.ts';
import { lapTamTru, luuNienBatTu, namTrongDaiVan } from '../../src/lib/trang/bat-tu-luu-nien.ts';

const CAM = /hóa giải|vật phẩm|sát khí|cải vận|xui|tai họa/i;
const ca1 = lapLaSoBatTu({ ngay: 1, thang: 6, nam: 1990, gio: 8, phut: 30, gioiTinh: 'nu', namXem: 2026 });

test('lưu niên 2026 Bính Ngọ với ca 1: can hợp Tân–Bính, tự hình Ngọ–Ngọ; Bính là Kiếp tài của Đinh', () => {
  const l = luuNienBatTu(ca1, 2026);
  assert.equal(l.canChi, 'Bính Ngọ');
  assert.equal(l.thapThanCan, 'Kiếp tài');
  const tom = l.quanHe.map((q) => `${q.loai}:${q.tru.join('')}:${q.chu.join('-')}`).sort();
  assert.deepEqual(tom, ['can-hop:14:Tân-Bính', 'tu-hinh:04:Ngọ-Ngọ']);
  assert.ok(l.quanHe.every((q) => q.tru.includes(4)));
  assert.ok(!CAM.test(l.cau));
});

test('lưu niên: quét 1990–2040 không lẫn quan hệ nội bộ 4 trụ', () => {
  const noiBo = quanHeTru(ca1).length;
  for (let y = 1990; y <= 2040; y++) {
    const l = luuNienBatTu(ca1, y);
    assert.ok(l.quanHe.every((q) => q.tru.includes(4)), `${y}`);
    assert.ok(l.cau.startsWith(`Năm ${y} là năm ${l.canChi}`));
  }
  assert.equal(quanHeTru(ca1).length, noiBo);
});

test('namTrongDaiVan: 10 năm liên tiếp, can chi đúng vòng 60', () => {
  const ds = namTrongDaiVan(ca1, 3);
  assert.equal(ds.length, 10);
  assert.equal(ds[0].nam, ca1.daiVan.ds[2].tuNam);
  assert.equal(ds.find((x) => x.nam === 2026).canChi, 'Bính Ngọ');
  assert.deepEqual(namTrongDaiVan(ca1, 9), []);
});

test('tam trụ: ngày thường không có điểm chưa chắc về trụ; 6 chữ', () => {
  const t = lapTamTru({ ngay: 1, thang: 6, nam: 1990, gioiTinh: 'nu', namXem: 2026 });
  assert.deepEqual(t.laSo.tru.slice(0, 3).map((x) => x.canChi), ['Canh Ngọ', 'Tân Tỵ', 'Đinh Dậu']);
  assert.equal(Object.values(t.demNguHanh).reduce((a, b) => a + b, 0), 6);
  assert.ok(t.chuaChac.every((c) => c.startsWith('Tuổi khởi vận')));
  assert.ok(t.quanHe.every((q) => q.tru.every((i) => i < 3)));
  // Ca 1 có tam hợp thiếu Sửu (Tỵ tháng, Dậu ngày) vẫn thấy khi bỏ trụ giờ; lục hợp Dậu–Thìn (có giờ) thì không.
  assert.deepEqual(t.quanHe.map((q) => q.loai), ['thieu-tam-hop']);
});

test('tam trụ: ngày có tiết Thanh minh (05/04/1975) báo trụ tháng chưa chắc; ngày Lập xuân báo cả năm', () => {
  const t = lapTamTru({ ngay: 5, thang: 4, nam: 1975, gioiTinh: 'nam' });
  assert.ok(t.chuaChac.some((c) => c.startsWith('Trụ tháng đổi trong ngày sinh')));
  assert.ok(!t.chuaChac.some((c) => c.startsWith('Trụ năm')));
  const lx = lapTamTru({ ngay: 4, thang: 2, nam: 2024, gioiTinh: 'nu' });
  assert.ok(lx.chuaChac.some((c) => c.startsWith('Trụ năm')));
  assert.ok(lx.chuaChac.some((c) => c.startsWith('Trụ tháng')));
  assert.ok(!CAM.test(t.cau + lx.cau));
});

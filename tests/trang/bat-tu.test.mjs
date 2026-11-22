// docs/v2/19 F4: lá số Bát tự. Chạy: npx tsx --test tests/trang/bat-tu.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { lapLaSoBatTu, thapThan, kiemTraDauVao } from '../../src/lib/trang/bat-tu.ts';

const cc = (ls) => ls.tru.map((t) => t.canChi);

test('1/1/2000 12:00: trụ năm theo Lập xuân, ngày Mậu Ngọ', () => {
  const ls = lapLaSoBatTu({ ngay: 1, thang: 1, nam: 2000, gio: 12, gioiTinh: 'nam', namXem: 2026 });
  assert.deepEqual(cc(ls), ['Kỷ Mão', 'Bính Tý', 'Mậu Ngọ', 'Mậu Ngọ']);
  assert.equal(ls.nhatChu.can, 'Mậu');
  assert.equal(ls.tru[1].thapThanCan, 'Thiên ấn'); // Bính (Hỏa dương) sinh Mậu (Thổ dương)
  // Kỷ là can âm, nam âm đi nghịch: vận 1 lùi một bước từ Bính Tý.
  assert.equal(ls.daiVan.chieu, 'nghịch');
  assert.equal(ls.daiVan.ds[0].canChi, 'Ất Hợi');
  assert.equal(ls.daiVan.ds.filter((d) => d.dangChay).length, 1);
  assert.equal(Object.values(ls.demNguHanh).reduce((a, b) => a + b, 0), 8);
});

test('quanh Lập xuân 2024 (4/2 16:27): đổi trụ năm và trụ tháng', () => {
  const truoc = lapLaSoBatTu({ ngay: 4, thang: 2, nam: 2024, gio: 15, gioiTinh: 'nu' });
  const sau = lapLaSoBatTu({ ngay: 4, thang: 2, nam: 2024, gio: 17, gioiTinh: 'nu' });
  assert.equal(truoc.tru[0].canChi, 'Quý Mão');
  assert.equal(truoc.tru[1].canChi, 'Ất Sửu');
  assert.equal(sau.tru[0].canChi, 'Giáp Thìn');
  assert.equal(sau.tru[1].canChi, 'Bính Dần');
});

test('15/8/1990 10:00 nam: Canh Ngọ, tháng Giáp Thân; 23h sang ngày sau', () => {
  const ls = lapLaSoBatTu({ ngay: 15, thang: 8, nam: 1990, gio: 10, gioiTinh: 'nam' });
  assert.equal(ls.tru[0].canChi, 'Canh Ngọ');
  assert.equal(ls.tru[1].canChi, 'Giáp Thân');
  assert.equal(ls.tru[3].chi, 'Tỵ');
  assert.equal(ls.daiVan.chieu, 'thuận');
  assert.equal(ls.daiVan.ds[0].canChi, 'Ất Dậu');
  const dem23 = lapLaSoBatTu({ ngay: 15, thang: 8, nam: 1990, gio: 23, gioiTinh: 'nam' });
  const ngaySau = lapLaSoBatTu({ ngay: 16, thang: 8, nam: 1990, gio: 0, gioiTinh: 'nam' });
  assert.equal(dem23.tru[2].canChi, ngaySau.tru[2].canChi);
  assert.equal(dem23.tru[3].canChi, ngaySau.tru[3].canChi);
  const khongDoi = lapLaSoBatTu({ ngay: 15, thang: 8, nam: 1990, gio: 23, gioiTinh: 'nam', doiNgayLuc23: false });
  assert.equal(khongDoi.tru[2].canChi, ls.tru[2].canChi);
});

test('thập thần và kiểm tra đầu vào', () => {
  assert.equal(thapThan(0, 0), 'Tỷ kiên'); // Giáp–Giáp
  assert.equal(thapThan(0, 1), 'Kiếp tài');
  assert.equal(thapThan(0, 2), 'Thực thần'); // Giáp sinh Bính
  assert.equal(thapThan(0, 3), 'Thương quan');
  assert.equal(thapThan(0, 4), 'Thiên tài'); // Giáp khắc Mậu
  assert.equal(thapThan(0, 5), 'Chính tài');
  assert.equal(thapThan(0, 6), 'Thất sát'); // Canh khắc Giáp
  assert.equal(thapThan(0, 7), 'Chính quan');
  assert.equal(thapThan(0, 8), 'Thiên ấn'); // Nhâm sinh Giáp
  assert.equal(thapThan(0, 9), 'Chính ấn');
  assert.match(kiemTraDauVao({ ngay: 31, thang: 2, nam: 2000, gio: 1, gioiTinh: 'nam' }), /Ngày/);
  assert.match(kiemTraDauVao({ ngay: 1, thang: 1, nam: 1800, gio: 1, gioiTinh: 'nam' }), /1900/);
  assert.equal(kiemTraDauVao({ ngay: 1, thang: 1, nam: 1990, gio: 1, gioiTinh: 'nu' }), null);
});

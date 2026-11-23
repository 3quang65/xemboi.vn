// Cụm Lịch P2 (Lệnh 47): giờ hoàng đạo, 24 tiết khí, ngày lễ âm lịch.
// Chạy: npx tsx --test tests/trang/lich-mua.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TIET_KHI_24, bangGioHoangDao, gioHoangDaoNgay, leQuaCacNam, leSapToi, leTrongNamAm, mocTiet, tietHienTai,
  tietKe, tietKhiTrongNam, TRICH_GIO_HOANG_DAO, NGUON_72_HAU,
} from '../../src/lib/trang/lich-mua.ts';
import { ngayLich } from '../../src/lib/trang/lich.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

test('giờ hoàng đạo theo Hiệp kỷ khớp bảng 6 mẫu GIO_HD đang dùng ở lich.ts, mọi ngày 2026', () => {
  for (let jd = 0; jd < 365; jd++) {
    const t = new Date(Date.UTC(2026, 0, 1 + jd));
    const [d, m, y] = [t.getUTCDate(), t.getUTCMonth() + 1, t.getUTCFullYear()];
    const a = gioHoangDaoNgay(d, m, y).gio.map((g) => g.hoangDao);
    const b = ngayLich(d, m, y).gio.map((g) => g.hoangDao);
    assert.deepEqual(a, b, `${d}/${m}/${y}`);
    assert.equal(a.filter(Boolean).length, 6);
  }
});

test('ngày Tý: giờ Thân là Thanh long, giờ Dậu là Minh đường (câu Hiệp kỷ quyển 5)', () => {
  // 2026-01-06 là ngày Giáp Tý? Tìm một ngày Tý bất kỳ.
  let x;
  for (let d = 1; d <= 12; d++) { x = gioHoangDaoNgay(d, 1, 2026); if (x.ngay.canChiNgay.chi === 0) break; }
  assert.equal(x.ngay.canChiNgay.chi, 0);
  assert.equal(x.gio[8].than, 'Thanh long');
  assert.equal(x.gio[9].than, 'Minh đường');
  assert.ok(TRICH_GIO_HOANG_DAO.nguyenVan.includes('子日申時起青龍酉時為明堂'));
  assert.equal(x.tomTat, 'Tý, Sửu, Mão, Ngọ, Thân, Dậu');
});

test('bảng giờ hoàng đạo: 6 dòng, mỗi dòng 6 giờ, hai chi ngày xung nhau', () => {
  const b = bangGioHoangDao();
  assert.equal(b.length, 6);
  for (const r of b) assert.equal(r.gio.length, 6);
  assert.deepEqual(b[0].chiNgay, ['Tý', 'Ngọ']);
});

test('24 tiết khí: đủ 24, kinh độ cách 15°, 12 tiết + 12 trung khí, 72 hậu dịch tiếng Việt', () => {
  assert.equal(TIET_KHI_24.length, 24);
  TIET_KHI_24.forEach((t, i) => assert.equal(t.kinhDo, (315 + i * 15) % 360));
  assert.equal(TIET_KHI_24.filter((t) => t.loai === 'tiet').length, 12);
  for (const t of TIET_KHI_24) {
    assert.equal(t.hau.length, 3);
    for (const h of t.hau) { assert.ok(coChuHan(h.nguyenVan)); assert.ok(!coChuHan(h.dich) && h.dich.length > 3, t.slug); }
    assert.ok(!coChuHan(t.nghiaTen));
  }
  assert.ok(!coChuHan(NGUON_72_HAU.ketLuanDich + NGUON_72_HAU.ghiChuDiaLy));
  assert.equal(new Set(TIET_KHI_24.map((t) => t.slug)).size, 24);
});

test('tiết khí 2026: Lập xuân 04/02, Hạ chí 21/06, Đông chí 22/12 (giờ Việt Nam); sắp theo thời gian', () => {
  const ds = tietKhiTrongNam(2026);
  assert.equal(ds.length, 24);
  for (let i = 1; i < 24; i++) assert.ok(ds[i].iso > ds[i - 1].iso);
  assert.equal(mocTiet('lap-xuan', 2026).ngay, '2026-02-04');
  assert.equal(mocTiet('ha-chi', 2026).ngay, '2026-06-21');
  assert.equal(mocTiet('dong-chi', 2026).ngay, '2026-12-22');
  assert.match(mocTiet('lap-xuan', 2026).gio, /^\d\d:\d\d$/);
});

test('tiết hiện tại và tiết kế', () => {
  const r = tietHienTai(new Date(Date.UTC(2026, 10, 24, 5)));
  assert.equal(r.dang.slug, 'tieu-tuyet');
  assert.equal(r.ke.slug, 'dai-tuyet');
  assert.deepEqual([tietKe('lap-xuan').truoc.slug, tietKe('lap-xuan').sau.slug], ['dai-han', 'vu-thuy']);
});

test('ngày lễ: khớp các mốc đã biết', () => {
  const tim = (slug, n) => leQuaCacNam(slug, n, n)[0];
  assert.equal(tim('tet-nguyen-dan', 2026).duong, '2026-02-17');
  assert.equal(tim('ram-thang-gieng', 2028).duong, '2028-02-09');
  assert.equal(tim('via-than-tai', 2027).duong, '2027-02-15');
  assert.equal(tim('via-than-tai', 2028).duong, '2028-02-04');
  assert.equal(tim('ram-thang-7', 2027).duong, '2027-08-16');
  assert.equal(tim('trung-thu', 2027).duong, '2027-09-15');
  // Giao thừa: ngày trước Tết năm sau.
  assert.equal(tim('giao-thua', 2025).duong, '2026-02-16');
  assert.equal(leQuaCacNam('trung-thu').length, 16);
  const nam = leTrongNamAm(2026);
  for (let i = 1; i < nam.length; i++) assert.ok(nam[i].duong >= nam[i - 1].duong);
});

test('lễ sắp tới tính cả hôm nay, có giờ hoàng đạo', () => {
  const r = leSapToi('trung-thu', new Date(Date.UTC(2026, 10, 24, 5)));
  assert.equal(r.namAm, 2027);
  assert.equal(r.duong, '2027-09-15');
  assert.ok(r.conNgay > 0);
  assert.equal(r.gioHoangDao.split(', ').length, 6);
});

// docs/v2/19: siêu dữ liệu từ SeoTrang và menu/breadcrumb trang công khai v2.
// Chạy: npx tsx --env-file=.env --test tests/trang/meta-dieu-huong.test.mjs
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../../src/lib/prisma.ts';
import { thongTinTrang, metaTrang, dienMau, chuanHoaDuongDan } from '../../src/lib/trang/meta.ts';
import { menuChinh, chanTrang, breadcrumb, schemaBreadcrumb, trangDaDung } from '../../src/lib/trang/dieu-huong.ts';
const trangDaDungF4 = () => trangDaDung(4);

after(() => prisma.$disconnect());

test('dienMau và chuanHoaDuongDan', () => {
  assert.equal(dienMau('Sinh năm {yyyy} mệnh gì', { yyyy: 1990 }), 'Sinh năm 1990 mệnh gì');
  assert.equal(dienMau('{a}-{b}', { a: 'x' }), 'x-{b}');
  assert.equal(dienMau('Tuổi {Can Chi}, {Nạp âm}', { 'Can Chi': 'Canh Ngọ', 'Nạp âm': 'Lộ Bàng Thổ' }), 'Tuổi Canh Ngọ, Lộ Bàng Thổ');
  assert.equal(chuanHoaDuongDan('tu-vi/'), '/tu-vi');
  assert.equal(chuanHoaDuongDan('/'), '/');
  assert.equal(chuanHoaDuongDan('/lich-am?x=1'), '/lich-am');
});

test('trang chủ XUAT_BAN thì được index, trang NHAP thì không', async () => {
  const home = await prisma.seoTrang.findUnique({ where: { duongDan: '/' } });
  const t = await thongTinTrang('/', { title: 'x' });
  assert.equal(t.nguon, home ? 'rieng' : 'khong');
  assert.equal(t.duocIndex, !!home && home.trangThai === 'XUAT_BAN' && !home.noindex);
  if (home) assert.equal(t.title, home.title);

  const nhap = await prisma.seoTrang.findFirst({ where: { trangThai: 'NHAP', NOT: { duongDan: { contains: '{' } } } });
  if (nhap) {
    const m = await metaTrang(nhap.duongDan, { title: 'x' });
    assert.deepEqual(m.robots, { index: false, follow: true });
  }
});

test('trang không có trong SeoTrang: dùng mặc định, noindex', async () => {
  const t = await thongTinTrang('/khong-ton-tai-[thu]', { title: 'Mặc định', h1: 'H1 mặc định' });
  assert.equal(t.nguon, 'khong');
  assert.equal(t.title, 'Mặc định');
  assert.equal(t.h1, 'H1 mặc định');
  assert.equal(t.duocIndex, false);
});

test('trang lập trình dùng dòng mẫu và điền tham số', async () => {
  const mau = await prisma.seoTrang.findFirst({ where: { duongDan: { contains: '{yyyy}' } } });
  if (!mau) return;
  const that = mau.duongDan.replace('{yyyy}', '1990').replace(/\{[a-z]+\}/g, '01');
  const t = await thongTinTrang(that, { title: 'x' }, mau.duongDan, { yyyy: 1990, mm: '01', dd: '01' });
  assert.equal(t.nguon, 'mau');
  assert.ok(!t.title.includes('{'));
  assert.ok(t.canonical.endsWith(that));
});

test('menu chỉ hiện trang đã dựng; breadcrumb đi theo cha', () => {
  const f1 = menuChinh(1);
  assert.deepEqual(f1.map((m) => m.href), ['/tu-vi']);
  assert.deepEqual(f1[0].con.map((m) => m.href), ['/tu-vi/lap-la-so', '/tu-vi-2027']);
  assert.equal(menuChinh(5).length, 10);
  assert.deepEqual(menuChinh(5).filter((m) => m.them).map((m) => m.href), ['/than-so-hoc', '/chiem-tinh']);
  assert.deepEqual(breadcrumb('/chiem-tinh/cung-hoang-dao/bo-cap', 'Cung Bọ Cạp').map((m) => m.ten), ['Trang chủ', 'Chiêm tinh', '12 cung hoàng đạo', 'Cung Bọ Cạp']);
  assert.deepEqual(breadcrumb('/than-so-hoc/so-chu-dao/7', 'Số chủ đạo 7').map((m) => m.ten), ['Trang chủ', 'Thần số học', 'Số chủ đạo', 'Số chủ đạo 7']);
  assert.deepEqual(breadcrumb('/than-so-hoc/nam-ca-nhan/3', 'Năm cá nhân 3').map((m) => m.href), ['/', '/than-so-hoc', '/than-so-hoc/nam-ca-nhan/3']);
  assert.deepEqual(breadcrumb('/phong-thuy/cuu-tinh/2027', 'Cửu tinh năm 2027').map((m) => m.ten), ['Trang chủ', 'Phong thủy', 'Cửu tinh', 'Cửu tinh năm 2027']);
  assert.deepEqual(breadcrumb('/chiem-tinh/ban-do-sao', 'Bản đồ sao').map((m) => m.ten), ['Trang chủ', 'Chiêm tinh', 'Bản đồ sao']);
  assert.deepEqual(breadcrumb('/phong-thuy/cung-phi/kham-thuy', 'Cung Khảm').map((m) => m.ten), ['Trang chủ', 'Phong thủy', 'Cung phi', 'Cung Khảm']);
  assert.deepEqual(breadcrumb('/xem-ngay/cuoi-hoi/thang-02-2027', 'Tháng 2/2027').map((m) => m.ten), ['Trang chủ', 'Xem ngày', 'Ngày cưới', 'Tháng 2/2027']);
  assert.deepEqual(breadcrumb('/xem-ngay/xuat-hanh').map((m) => m.href), ['/', '/lich-am', '/tet', '/xem-ngay/xuat-hanh']);
  assert.ok(trangDaDungF4().has('/kinh-dich/gieo-que'));
  assert.deepEqual(breadcrumb('/kinh-dich/que/01-thuan-can', 'Quẻ Thuần Càn').map((m) => m.href), ['/', '/kinh-dich', '/kinh-dich/64-que', '/kinh-dich/que/01-thuan-can']);
  assert.ok(!trangDaDungF4().has('/goi'));
  assert.ok(trangDaDung(5).has('/nguon') && !trangDaDung(5).has('/goi'), 'bảng giá chờ anh, để đợt 6');
  assert.ok(trangDaDung(5).has('/phuong-phap/gio-ty') && !trangDaDung(4).has('/phuong-phap/gio-ty'));
  assert.deepEqual(breadcrumb('/bai-viet/x', 'Bài').map((m) => m.href), ['/', '/kien-thuc', '/bai-viet/x']);
  assert.deepEqual(breadcrumb('/phuong-phap/gio-ty').map((m) => m.ten), ['Trang chủ', 'Phương pháp', 'Giờ Tý']);
  assert.ok(chanTrang(5).at(-1).muc.some((m) => m.href === '/lien-he'));

  assert.deepEqual(breadcrumb('/tu-vi/lap-la-so').map((m) => m.href), ['/', '/tu-vi', '/tu-vi/lap-la-so']);
  assert.deepEqual(breadcrumb('/tu-vi-2027').map((m) => m.href), ['/', '/tu-vi', '/tu-vi-2027']);
  assert.deepEqual(breadcrumb('/sinh-nam/1990', 'Sinh năm 1990').map((m) => m.ten), ['Trang chủ', 'Can chi & mệnh', 'Sinh năm', 'Sinh năm 1990']);
  assert.deepEqual(breadcrumb('/').map((m) => m.href), ['/']);
  const s = schemaBreadcrumb(breadcrumb('/tu-vi'));
  assert.equal(s.itemListElement[1].item, 'https://xemboi.vn/tu-vi');
});

test('trangDaDung theo đợt', async () => {
  const { trangDaDung } = await import('../../src/lib/trang/dieu-huong.ts');
  const f1 = trangDaDung(1);
  assert.ok(f1.has('/') && f1.has('/tu-vi/lap-la-so') && f1.has('/tu-vi-2027'));
  assert.ok(!f1.has('/lich-am') && !f1.has('/goi'));
  assert.ok(trangDaDung(2).has('/lich-am/doi-ngay'));
  assert.ok(trangDaDung(2).has('/tet'));
  assert.ok(!trangDaDung(1).has('/tet'));
});

test('mẫu còn chỗ trống chưa điền thì dùng mặc định', async () => {
  const t = await thongTinTrang('/sinh-nam/1990', { title: 'Mặc định 1990', h1: 'H1 1990' }, '/sinh-nam/{yyyy}', { yyyy: 1990 });
  assert.equal(t.nguon, 'mau');
  assert.equal(t.title, 'Mặc định 1990'); // title mẫu có {Can Chi} chưa truyền
  assert.equal(t.h1, 'Sinh năm 1990 mệnh gì?');
  const du = await thongTinTrang('/sinh-nam/1990', { title: 'x' }, '/sinh-nam/{yyyy}', { yyyy: 1990, 'Can Chi': 'Canh Ngọ', 'Nạp âm': 'Lộ Bàng Thổ' });
  assert.equal(du.title, 'Sinh năm 1990 mệnh gì? Tuổi Canh Ngọ, Lộ Bàng Thổ');
});

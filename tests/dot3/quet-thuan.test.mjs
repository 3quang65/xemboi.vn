// Đợt 3: hàm thuần của bộ quét liên kết (src/lib/seo/quet.ts). Chạy: npx tsx --test tests/dot3/quet-thuan.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { chuanHoaDuong, rutTrich, rutSitemap, tinhDoSau } from '../../src/lib/seo/quet.ts';

const G = 'http://localhost:3047';

test('chuanHoaDuong: tương đối, tuyệt đối cùng site, bỏ ngoài/tệp/quản trị', () => {
  assert.equal(chuanHoaDuong('/tu-vi/', '/', G), '/tu-vi');
  assert.equal(chuanHoaDuong('sao/tu-vi?x=1#a', '/tu-vi/', G), '/tu-vi/sao/tu-vi');
  assert.equal(chuanHoaDuong('http://localhost:3047/lich-am', '/', G), '/lich-am');
  assert.equal(chuanHoaDuong('https://google.com/x', '/', G), null);
  assert.equal(chuanHoaDuong('mailto:a@b.c', '/', G), null);
  assert.equal(chuanHoaDuong('#top', '/', G), null);
  assert.equal(chuanHoaDuong('/anh/a.png', '/', G), null);
  assert.equal(chuanHoaDuong('/quan-tri/seo', '/', G), null);
  assert.equal(chuanHoaDuong('/api/x', '/', G), null);
  assert.equal(chuanHoaDuong('/van-khan/m%E1%BB%93ng-1', '/', G), '/van-khan/mồng-1');
  assert.equal(chuanHoaDuong('/a?b=1&amp;c=2', '/', G), '/a');
});

test('rutTrich: anchor, nofollow, canonical, robots, title; bỏ script và chú thích', () => {
  const html = `<html><head><title>Lịch &amp; ngày</title>
    <link rel="canonical" href="https://xemboi.vn/lich-am"><meta name="robots" content="noindex, follow"></head>
    <body><!-- <a href="/an">ẩn</a> --><script>var s='<a href="/js">x</a>'</script>
    <a href="/tu-vi" class="x"><span>Tử</span> vi</a>
    <a href='/con-giap' aria-label="12 con giáp"><svg></svg></a>
    <a href="/anh"><img src="/a.webp" alt="Ảnh đẹp"></a>
    <a href="/tra" rel="nofollow">trả</a>
    <a href="https://ngoai.vn">ngoài</a></body></html>`;
  const r = rutTrich(html, '/', G);
  assert.deepEqual(r.lienKet, [
    { den: '/tu-vi', anchor: 'Tử vi' },
    { den: '/con-giap', anchor: '12 con giáp' },
    { den: '/anh', anchor: 'Ảnh đẹp' },
  ]);
  assert.equal(r.canonical, 'https://xemboi.vn/lich-am');
  assert.equal(r.robots, 'noindex, follow');
  assert.equal(r.title, 'Lịch & ngày');
});

test('rutSitemap: chỉ mục trả sitemap con, nhóm trả đường dẫn (bỏ tên miền)', () => {
  const cm = rutSitemap('<sitemapindex><sitemap><loc>https://xemboi.vn/sitemap/tu-vi.xml</loc></sitemap></sitemapindex>', G);
  assert.deepEqual(cm, { trang: [], con: ['/sitemap/tu-vi.xml'] });
  const nh = rutSitemap('<urlset><url><loc>https://xemboi.vn/</loc></url><url><loc>https://xemboi.vn/tu-vi/</loc></url></urlset>', G);
  assert.deepEqual(nh, { trang: ['/', '/tu-vi'], con: [] });
});

test('tinhDoSau: BFS ngắn nhất, trang không tới được thì vắng', () => {
  const c = new Map([['/', new Set(['/a', '/b'])], ['/a', new Set(['/c'])], ['/b', new Set(['/c'])], ['/c', new Set(['/d'])], ['/x', new Set(['/'])]]);
  const d = tinhDoSau('/', c);
  assert.equal(d.get('/'), 0); assert.equal(d.get('/c'), 2); assert.equal(d.get('/d'), 3);
  assert.equal(d.has('/x'), false);
});

import { duongNamKe, QUY_TAC_MAC_DINH } from '../../src/lib/seo/quy-tac-lien-ket.ts';
test('duongNamKe: thay đúng cụm năm, không bắt số khác', () => {
  assert.deepEqual(duongNamKe('/tu-vi-2027'), { truoc: '/tu-vi-2026', sau: '/tu-vi-2028', nam: 2027 });
  assert.deepEqual(duongNamKe('/lich-am/2027/02'), { truoc: '/lich-am/2026/02', sau: '/lich-am/2028/02', nam: 2027 });
  assert.equal(duongNamKe('/tu-vi/12-con-giap'), null);
  assert.equal(duongNamKe('/sinh-nam/12345'), null);
});
test('QUY_TAC_MAC_DINH: đủ 07 mục 2.4, tên không trùng', () => {
  assert.equal(new Set(QUY_TAC_MAC_DINH.map((q) => q.ten)).size, QUY_TAC_MAC_DINH.length);
  for (const k of ['KE_HOACH', 'CUNG_NHOM', 'NAM_KE', 'DICH_CO_DINH', 'HIEN_THI']) assert.ok(QUY_TAC_MAC_DINH.some((q) => q.dieuKien.kieu === k), k);
});

import { loaiAnchor, danhGiaAnchor } from '../../src/lib/seo/anchor.ts';
test('loaiAnchor và danhGiaAnchor: phân loại và ngưỡng', () => {
  assert.equal(loaiAnchor('Lịch âm', 'lịch âm'), 'CHINH_XAC');
  assert.equal(loaiAnchor('Xem lịch âm hôm nay', 'lịch âm'), 'MOT_PHAN');
  assert.equal(loaiAnchor('Xem thêm', 'lịch âm'), 'CHUNG_CHUNG');
  assert.equal(loaiAnchor('XemBoi.vn', 'lịch âm'), 'THUONG_HIEU');
  assert.equal(loaiAnchor('Tết Đinh Mùi', 'lịch âm'), 'KHAC');
  const d = danhGiaAnchor(['lịch âm', 'Lịch âm', 'lịch âm', 'lịch âm 2027', 'xem thêm'], 'lịch âm');
  assert.equal(d.tong, 5); assert.equal(d.theoLoai.CHINH_XAC, 3);
  assert.deepEqual(d.canhBao, ['CHINH_XAC_NHIEU']);
  assert.deepEqual(danhGiaAnchor(['lịch âm'], 'lịch âm').canhBao, []); // dưới ngưỡng tối thiểu
});

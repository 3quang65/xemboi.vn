// docs/v2/19 mục 2.2: markdown an toàn và chỉ đọc bản đã xuất bản. Chạy: npx tsx --env-file=.env --test tests/trang/noi-dung.test.mjs
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../../src/lib/prisma.ts';
import { tachMarkdown, tachDongChu, hrefAnToan, noiDungTheoDuongDan } from '../../src/lib/trang/noi-dung.ts';

after(() => prisma.$disconnect());

test('liên kết nguy hiểm bị bỏ, liên kết nội bộ và http giữ', () => {
  assert.equal(hrefAnToan('javascript:alert(1)'), null);
  assert.equal(hrefAnToan('//evil.com'), null);
  assert.equal(hrefAnToan('/tu-vi'), '/tu-vi');
  assert.equal(hrefAnToan('https://a.vn/x'), 'https://a.vn/x');
  assert.deepEqual(tachDongChu('[x](javascript:1)'), [{ loai: 'chu', chu: 'x' }]);
  assert.deepEqual(tachDongChu('a **b** *c* [d](/e)'), [
    { loai: 'chu', chu: 'a ' }, { loai: 'dam', chu: 'b' }, { loai: 'chu', chu: ' ' }, { loai: 'nghieng', chu: 'c' },
    { loai: 'chu', chu: ' ' }, { loai: 'lienKet', chu: 'd', href: '/e' },
  ]);
});

test('markdown thành khối; bỏ HTML và ảnh', () => {
  const k = tachMarkdown('## Tiêu đề\n\nĐoạn một\ndòng hai <script>x</script>\n\n- a\n- b\n\n1. x\n2. y\n\n> trích\n\n![anh](/a.png) chữ');
  assert.deepEqual(k.map((x) => x.loai), ['tieuDe', 'doan', 'danhSach', 'danhSach', 'trich', 'doan']);
  assert.equal(k[0].cap, 2);
  assert.equal(k[1].noi[0].chu, 'Đoạn một dòng hai x');
  assert.equal(k[3].coThuTu, true);
  assert.equal(k[5].noi[0].chu, 'chữ');
  assert.deepEqual(tachMarkdown(null), []);
});

test('thân HTML của bài v1 giữ được tiêu đề, danh sách, đậm, liên kết', () => {
  const k = tachMarkdown(`<p>Mở <strong>đầu</strong> &amp; ý</p>
      <h3>1. Nguyên lý</h3>
      <ul><li>Mệnh</li><li><b>Thân</b></li></ul>
      <ol><li>a</li><li>b</li></ol>
      <p>Xem <a href="/tu-vi">lá số</a> <a href="javascript:x">hỏng</a><script>alert(1)</script></p>
      <blockquote><p>trích</p></blockquote>`);
  assert.deepEqual(k.map((x) => x.loai), ['doan', 'tieuDe', 'danhSach', 'danhSach', 'doan', 'trich']);
  assert.deepEqual(k[0].noi, [{ loai: 'chu', chu: 'Mở ' }, { loai: 'dam', chu: 'đầu' }, { loai: 'chu', chu: ' & ý' }]);
  assert.equal(k[1].cap, 3);
  assert.equal(k[2].coThuTu, false);
  assert.equal(k[3].coThuTu, true);
  assert.ok(k[4].noi.some((d) => d.loai === 'lienKet' && d.href === '/tu-vi'));
  assert.ok(!JSON.stringify(k).includes('javascript') && !JSON.stringify(k).includes('alert'));
});

test('chỉ trả nội dung DA_XUAT_BAN có phiên bản xuất bản', async () => {
  assert.equal(await noiDungTheoDuongDan('/khong-co-[thu]'), null);
  const t = await prisma.seoTrang.findFirst({ where: { noiDung: { trangThai: { not: 'DA_XUAT_BAN' } } }, select: { duongDan: true } });
  if (t) assert.equal(await noiDungTheoDuongDan(t.duongDan), null);
  const xb = await prisma.seoTrang.findFirst({ where: { noiDung: { trangThai: 'DA_XUAT_BAN', phienBanXuatBanId: { not: null } } }, select: { duongDan: true } });
  if (xb) assert.ok((await noiDungTheoDuongDan(xb.duongDan))?.than.length >= 0);
});

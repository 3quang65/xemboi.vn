// Đợt 3: quetSite với CSDL thật, site giả trong bộ nhớ, phạm vi /_thu-quet (dữ liệu [THỬ], dọn ở after).
// Chạy: npx tsx --env-file=.env --test tests/dot3/quet-csdl.test.mjs
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { quetSite } from '../../src/lib/seo/quet.ts';

const db = new PrismaClient();
const T = '/_thu-quet';
const trong = (p) => p === T || p.startsWith(T + '/');
const id = {};

// Đồ thị: gốc → a, b; a → c (404) và d (301); b → a; e (XUAT_BAN, không ai trỏ: mồ côi); f noindex trong sitemap;
// g canonical lệch; a → h → i → k → l (l sâu 5... qua chuỗi).
const SITE = {
  [T]: `<a href="${T}/a">A</a><a href="${T}/b">B</a><a href="${T}/h">H</a><link rel="canonical" href="https://xemboi.vn${T}">`,
  [`${T}/a`]: `<link rel="canonical" href="https://xemboi.vn${T}/a"><a href="${T}/c">C hỏng</a><a href="${T}/d">D chuyển</a>`,
  [`${T}/b`]: `<link rel="canonical" href="https://xemboi.vn${T}/b"><a href="${T}/a">về A</a><a href="${T}/f">F</a><a href="${T}/g">G</a>`,
  [`${T}/e`]: `<link rel="canonical" href="https://xemboi.vn${T}/e">mồ côi`,
  [`${T}/f`]: `<link rel="canonical" href="https://xemboi.vn${T}/f"><meta name="robots" content="noindex">`,
  [`${T}/g`]: `<link rel="canonical" href="https://xemboi.vn${T}/khac">`,
  [`${T}/h`]: `<link rel="canonical" href="https://xemboi.vn${T}/h"><a href="${T}/i">I</a>`,
  [`${T}/i`]: `<link rel="canonical" href="https://xemboi.vn${T}/i"><a href="${T}/k">K</a>`,
  [`${T}/k`]: `<link rel="canonical" href="https://xemboi.vn${T}/k"><a href="${T}/l">L</a>`,
  [`${T}/l`]: `<link rel="canonical" href="https://xemboi.vn${T}/l">sâu`,
};
const tai = async (p) => (p === `${T}/d` ? { ma: 301, html: '', viTri: '/' } : SITE[p] != null ? { ma: 200, html: `<html><head><title>[THỬ] ${p}</title></head><body>${SITE[p]}</body></html>` } : { ma: 404, html: '' });
const sitemap = `<urlset>${[`${T}/e`, `${T}/f`].map((p) => `<url><loc>https://xemboi.vn${p}</loc></url>`).join('')}</urlset>`;
const taiSitemap = async (p) => (p === '/sitemap.xml' ? sitemap : null);

before(async () => {
  for (const k of ['', '/a', '/b', '/c', '/e', '/f', '/g', '/l']) {
    const t = await db.seoTrang.create({ data: { duongDan: T + k, loai: 'BAI', title: `[THỬ] quét ${k || 'gốc'}`, nhomSitemap: 'thu', trangThai: 'XUAT_BAN' } });
    id[k || 'goc'] = t.id;
  }
});
after(async () => {
  const ids = Object.values(id);
  await db.seoCanhBao.deleteMany({ where: { trangId: { in: ids } } });
  await db.seoCanhBao.deleteMany({ where: { chiTiet: { path: ['tu'], string_starts_with: T } } });
  await db.seoCanhBao.deleteMany({ where: { chiTiet: { path: ['duong'], string_starts_with: T } } });
  await db.seoTrang.deleteMany({ where: { id: { in: ids } } }); // SeoLienKet xóa theo Cascade
  await db.$disconnect();
});

test('quetSite: đồ thị, độ sâu, mồ côi, liên kết hỏng/chuyển, noindex trong sitemap, canonical lệch; chạy lại không trùng', async () => {
  const bc = await quetSite(db, { goc: 'http://localhost:3047', tai, taiSitemap, batDau: T, chiDuong: trong, nghiMs: 0 });
  assert.equal(bc.catNgang, false);
  assert.equal(bc.lienKetHong, 1);
  assert.equal(bc.lienKetChuyenHuong, 1);
  assert.equal(bc.moCoi, 1); // e
  assert.equal(bc.noindexTrongSitemap, 1); // f
  assert.equal(bc.canonicalLech, 1); // g
  assert.equal(bc.quaSau, 1); // l: gốc→h→i→k→l = 4
  // Chỉ ghi liên kết giữa hai SeoTrang: gốc→a, gốc→b, a→c, b→a, b→f, b→g (h,i,k,d không có trong CSDL).
  assert.equal(bc.lienKetGhiCsdl, 6);
  const a = await db.seoTrang.findUnique({ where: { id: id['/a'] } });
  assert.equal(a.doSau, 1); assert.equal(a.soLienKetVao, 2); assert.equal(a.soLienKetRa, 2); assert.equal(a.maHttpLanQuet, 200);
  const c = await db.seoTrang.findUnique({ where: { id: id['/c'] } });
  assert.equal(c.maHttpLanQuet, 404);
  const l = await db.seoTrang.findUnique({ where: { id: id['/l'] } });
  assert.equal(l.doSau, 4);
  const lk = await db.seoLienKet.findFirst({ where: { tuTrangId: id['/b'], denTrangId: id['/a'] } });
  assert.equal(lk.anchor, 'về A'); assert.equal(lk.nguon, 'QUET');

  const mo1 = await db.seoCanhBao.count({ where: { trangThai: 'MO', OR: [{ trangId: { in: Object.values(id) } }, { chiTiet: { path: ['tu'], string_starts_with: T } }] } });
  const bc2 = await quetSite(db, { goc: 'http://localhost:3047', tai, taiSitemap, batDau: T, chiDuong: trong, nghiMs: 0 });
  assert.equal(bc2.canhBaoMoi, 0);
  assert.equal(bc2.lienKetGhiCsdl, 6);
  assert.equal(await db.seoLienKet.count({ where: { tuTrangId: { in: Object.values(id) } } }), 6);

  // Sửa lỗi: e có người trỏ tới → cảnh báo mồ côi tự đóng.
  // Đồng thời: một gợi ý quy tắc b→e đang DE_XUAT; khi HTML đã có b→e thì chỉ còn MỘT dòng DANG_CO, giữ quyTacId.
  await db.seoLienKet.create({ data: { tuTrangId: id['/b'], denTrangId: id['/e'], anchor: '[THỬ] gợi ý', nguon: 'QUY_TAC', trangThai: 'DE_XUAT', quyTacId: 'thu-quy-tac' } });
  SITE[`${T}/b`] += `<a href="${T}/e">E</a>`;
  const bc3 = await quetSite(db, { goc: 'http://localhost:3047', tai, taiSitemap, batDau: T, chiDuong: trong, nghiMs: 0 });
  assert.equal(bc3.moCoi, 0);
  assert.equal(bc3.canhBaoDong, 1);
  const mo3 = await db.seoCanhBao.count({ where: { trangThai: 'MO', OR: [{ trangId: { in: Object.values(id) } }, { chiTiet: { path: ['tu'], string_starts_with: T } }] } });
  assert.equal(mo3, mo1 - 1);
  const be = await db.seoLienKet.findMany({ where: { tuTrangId: id['/b'], denTrangId: id['/e'] } });
  assert.equal(be.length, 1);
  assert.equal(be[0].trangThai, 'DANG_CO'); assert.equal(be[0].nguon, 'QUET'); assert.equal(be[0].quyTacId, 'thu-quy-tac'); assert.equal(be[0].anchor, 'E');
  // Quét lại lần nữa: vẫn một dòng, vẫn giữ quyTacId.
  await quetSite(db, { goc: 'http://localhost:3047', tai, taiSitemap, batDau: T, chiDuong: trong, nghiMs: 0 });
  const be2 = await db.seoLienKet.findMany({ where: { tuTrangId: id['/b'], denTrangId: id['/e'] } });
  assert.equal(be2.length, 1); assert.equal(be2[0].quyTacId, 'thu-quy-tac');
});

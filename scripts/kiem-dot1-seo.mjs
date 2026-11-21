// Nghiệm thu SEO Đợt 1 (docs/v2/17 mục 8): sitemap không có trang noindex/nháp, 301 phục vụ đúng, 410 đúng.
// Chạy khi dev server đang mở: node scripts/kiem-dot1-seo.mjs [http://localhost:3047]
// Dữ liệu thử được tạo rồi xóa/hoàn lại ngay trong script.
import { PrismaClient } from '@prisma/client';

const B = process.argv[2] || 'http://localhost:3047';
const p = new PrismaClient();
let loi = 0;
const ok = (dk, ten) => { console.log(`${dk ? '✓' : '✗'} ${ten}`); if (!dk) loi++; };
const cho = (ms) => new Promise((r) => setTimeout(r, ms));

async function urlSitemap() {
  const idx = await (await fetch(`${B}/sitemap.xml`)).text();
  const con = [...idx.matchAll(/<loc>https?:\/\/[^/]+(\/sitemap\/[^<]+)<\/loc>/g)].map((m) => m[1]);
  const ds = [];
  for (const c of con) {
    const x = await (await fetch(B + c)).text();
    ds.push(...[...x.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/'));
  }
  return { con, ds };
}

try {
  // 1. Sitemap không chứa trang noindex, nháp, mẫu.
  const { con, ds } = await urlSitemap();
  const xau = await p.seoTrang.findMany({ where: { OR: [{ noindex: true }, { trangThai: { not: 'XUAT_BAN' } }] }, select: { duongDan: true } });
  const tapXau = new Set(xau.map((t) => t.duongDan));
  ok(con.length > 0 && ds.length > 0, `sitemap chỉ mục có ${con.length} nhóm, ${ds.length} URL`);
  ok(!ds.some((u) => tapXau.has(u) && !['/'].includes(u)), 'không URL nào thuộc trang noindex/nháp');
  ok(!ds.some((u) => u.includes('{') || u.includes('#')), 'không có trang mẫu {tham số}');
  ok(new Set(ds).size === ds.length, 'không URL trùng giữa các nhóm');
  ok(!ds.some((u) => /^\/(quan-tri|admin|api|la-so)/.test(u)), 'không có khu quản trị, API hay lá số');

  // 2. Đặt tạm một trang đang xuất bản thành noindex → phải rời sitemap; hoàn lại.
  const t = await p.seoTrang.findFirst({ where: { trangThai: 'XUAT_BAN', noindex: false, duongDan: { not: '/' } } });
  if (t) {
    await p.seoTrang.update({ where: { id: t.id }, data: { noindex: true } });
    try { ok(!(await urlSitemap()).ds.includes(t.duongDan), `bật noindex cho ${t.duongDan} → rời sitemap`); }
    finally { await p.seoTrang.update({ where: { id: t.id }, data: { noindex: false } }); }
    ok((await urlSitemap()).ds.includes(t.duongDan), `tắt noindex → ${t.duongDan} trở lại sitemap`);
  }

  // 3. Chuyển hướng: 301 đường thường, regex có $1, 410; giữ query.
  const THU = [
    { tuDuongDan: '/_kiem-thu-301', denUrl: '/tu-vi-2027', ma: 301, nguon: 'TAY' },
    { tuDuongDan: '^/_kiem-thu-re/(\\d{4})$', denUrl: '/sinh-nam/$1', ma: 301, nguon: 'TAY', laBieuThuc: true },
    { tuDuongDan: '/_kiem-thu-410', denUrl: '/', ma: 410, nguon: 'TAY' },
  ];
  await p.seoChuyenHuong.deleteMany({ where: { tuDuongDan: { in: THU.map((x) => x.tuDuongDan) } } });
  for (const x of THU) await p.seoChuyenHuong.create({ data: { ...x, ghiChu: 'kiem-dot1-seo, tự xóa' } });
  try {
    console.log('  (chờ 62 giây cho bộ nhớ đệm chuyển hướng làm mới)');
    await cho(62_000);
    const r1 = await fetch(`${B}/_kiem-thu-301?utm_source=x`, { redirect: 'manual' });
    ok(r1.status === 301 && /\/tu-vi-2027\?utm_source=x$/.test(r1.headers.get('location') || ''), `301 /_kiem-thu-301 → ${r1.status} ${r1.headers.get('location')}`);
    const r2 = await fetch(`${B}/_kiem-thu-re/1990`, { redirect: 'manual' });
    ok(r2.status === 301 && (r2.headers.get('location') || '').endsWith('/sinh-nam/1990'), `regex → ${r2.status} ${r2.headers.get('location')}`);
    const r3 = await fetch(`${B}/_kiem-thu-410`, { redirect: 'manual' });
    ok(r3.status === 410, `410 → ${r3.status}`);
    const r4 = await fetch(`${B}/tu-vi-2027`, { redirect: 'manual' });
    ok(r4.status === 200, `trang thường không bị chuyển → ${r4.status}`);
    await cho(6_000); // bộ đếm lượt truy ghi sau 5 giây
    const dem = await p.seoChuyenHuong.findFirst({ where: { tuDuongDan: '/_kiem-thu-301' } });
    ok((dem?.soLanTruy ?? 0) >= 1, `đếm lượt truy: ${dem?.soLanTruy}`);
  } finally {
    await p.seoChuyenHuong.deleteMany({ where: { tuDuongDan: { in: THU.map((x) => x.tuDuongDan) } } });
  }

  // 4. Robots.
  const rb = await (await fetch(`${B}/robots.txt`)).text();
  ok(/Disallow: \/quan-tri/.test(rb) && /Disallow: \/api\//.test(rb) && /Sitemap: .*\/sitemap\.xml/.test(rb), 'robots chặn khu quản trị, trỏ sitemap');
  ok(!/Disallow: \/la-so/.test(rb), 'robots không chặn /la-so (để Google thấy noindex)');
} finally {
  await p.$disconnect();
}
process.exit(loi ? 1 : 0);

// Sitemap chỉ mục theo nhóm (docs/v2/17 mục 1.5): chỉ trang XUAT_BAN, không noindex, không phải trang mẫu,
// không có canonical trỏ đi nơi khác. lastmod = ngày cập nhật nội dung thật (không dùng "bây giờ").
import { prisma } from '@/lib/prisma';
import { urlHienTai } from './sitemap-cu';

export const GOC_SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://xemboi.vn').replace(/\/+$/, '');
const NHOM_CU = 'hien-tai';
const TOI_DA = 45_000;

type Dong = { duong: string; lastmod: Date | null; doi?: string; uuTien?: number };

const thoat = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ngay = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

async function trangDb(nhom?: string) {
  const ds = await prisma.seoTrang.findMany({
    where: { trangThai: 'XUAT_BAN', noindex: false, ...(nhom ? { nhomSitemap: nhom } : {}), NOT: [{ duongDan: { contains: '{' } }, { duongDan: { contains: '#' } }] },
    select: { duongDan: true, canonical: true, nhomSitemap: true, ngayCapNhatNoiDung: true, ngayXuatBan: true, capNhatLuc: true },
    orderBy: { duongDan: 'asc' },
  });
  // Canonical trỏ sang URL khác thì trang này không vào sitemap.
  return ds.filter((t) => !t.canonical || t.canonical === t.duongDan || t.canonical === GOC_SITE + t.duongDan);
}

/** Danh sách nhóm và lastmod lớn nhất, cho sitemap chỉ mục. */
export async function nhomSitemap(): Promise<{ nhom: string; lastmod: Date | null; so: number }[]> {
  const ds = await trangDb();
  const theoNhom = new Map<string, { lastmod: Date | null; so: number }>();
  for (const t of ds) {
    const lm = t.ngayCapNhatNoiDung;
    const x = theoNhom.get(t.nhomSitemap) ?? { lastmod: null, so: 0 };
    x.so++; if (lm && (!x.lastmod || lm > x.lastmod)) x.lastmod = lm;
    theoNhom.set(t.nhomSitemap, x);
  }
  const daCo = new Set(ds.map((t) => t.duongDan));
  const cu = urlHienTai().filter((u) => !daCo.has(u.duong));
  const kq = [...theoNhom].map(([nhom, x]) => ({ nhom, ...x }));
  if (cu.length) kq.push({ nhom: NHOM_CU, lastmod: null, so: cu.length });
  return kq.sort((a, b) => a.nhom.localeCompare(b.nhom));
}

export async function dongCuaNhom(nhom: string): Promise<Dong[] | null> {
  if (nhom === NHOM_CU) {
    const daCo = new Set((await trangDb()).map((t) => t.duongDan));
    return urlHienTai().filter((u) => !daCo.has(u.duong)).map((u) => ({ duong: u.duong, lastmod: null, doi: u.doi, uuTien: u.uuTien }));
  }
  const ds = await trangDb(nhom);
  if (!ds.length) return null;
  return ds.slice(0, TOI_DA).map((t) => ({ duong: t.duongDan, lastmod: t.ngayCapNhatNoiDung }));
}

export function xmlChiMuc(ds: { nhom: string; lastmod: Date | null }[]) {
  const muc = ds.map((n) => `  <sitemap><loc>${thoat(`${GOC_SITE}/sitemap/${n.nhom}.xml`)}</loc>${n.lastmod ? `<lastmod>${ngay(n.lastmod)}</lastmod>` : ''}</sitemap>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${muc.join('\n')}\n</sitemapindex>\n`;
}

export function xmlNhom(ds: Dong[]) {
  const muc = ds.map((d) => {
    const p = [`<loc>${thoat(GOC_SITE + d.duong)}</loc>`];
    if (d.lastmod) p.push(`<lastmod>${ngay(d.lastmod)}</lastmod>`);
    if (d.doi) p.push(`<changefreq>${d.doi}</changefreq>`);
    if (d.uuTien != null) p.push(`<priority>${d.uuTien.toFixed(2)}</priority>`);
    return `  <url>${p.join('')}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${muc.join('\n')}\n</urlset>\n`;
}

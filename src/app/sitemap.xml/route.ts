import { nhomSitemap, xmlChiMuc } from '@/lib/seo/sitemap';

export const dynamic = 'force-dynamic';

export async function GET() {
  const xml = xmlChiMuc(await nhomSitemap());
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=600, s-maxage=3600' } });
}

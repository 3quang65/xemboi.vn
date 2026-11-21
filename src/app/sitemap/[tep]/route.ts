import { dongCuaNhom, xmlNhom } from '@/lib/seo/sitemap';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ tep: string }> }) {
  const { tep } = await params;
  const m = tep.match(/^([a-z0-9-]{1,40})\.xml$/);
  const ds = m ? await dongCuaNhom(m[1]) : null;
  if (!ds) return new Response('Không có sitemap này.', { status: 404 });
  return new Response(xmlNhom(ds), { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=600, s-maxage=3600' } });
}

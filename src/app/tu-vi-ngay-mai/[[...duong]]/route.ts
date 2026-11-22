// Trang v1 đã gỡ (docs/v2/19 mục 2.1): trang gốc chuyển 301 sang lịch ngày mai v2;
// các trang con theo con giáp (nhóm tu_vi_hang_ngay đã loại) trả 410.
type Ctx = { params: Promise<{ duong?: string[] }> };

async function xuLy(req: Request, { params }: Ctx) {
  const { duong } = await params;
  if (!duong?.length) return Response.redirect(new URL('/lich-am/ngay-mai', req.url), 301);
  return new Response('Trang này đã bị gỡ.', { status: 410, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
}
export const GET = xuLy;
export const HEAD = xuLy;

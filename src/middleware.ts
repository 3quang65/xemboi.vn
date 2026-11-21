// 1) Chặn sớm khu quản trị (docs/v2/17 mục 5.1): middleware chỉ kiểm CÓ phiên hoặc khóa;
//    kiểm thật (phiên còn hạn, vai trò, quyền) nằm ở layout và từng route handler.
// 2) Phục vụ chuyển hướng từ SeoChuyenHuong cho trang công khai (17 mục 1.4).
import { NextResponse, type NextRequest } from 'next/server';
import { daXacThucQuanTri } from '@/lib/r1/admin-auth';
import { timChuyenHuong } from '@/lib/seo/chuyen-huong';

export const config = {
  // Mọi đường dẫn trừ tài nguyên tĩnh của Next và tệp có đuôi (ảnh, css, js, xml, txt...).
  matcher: ['/((?!_next/|.*\\.[a-zA-Z0-9]{2,5}$).*)'],
  runtime: 'nodejs',
};

const KHONG_INDEX = 'noindex, nofollow, noarchive';
const COOKIE_PHIEN = 'qt_phien';
const MO_CONG_KHAI = new Set(['/quan-tri/dang-nhap', '/api/quan-tri/dang-nhap']);
const KHU_QUAN_TRI = /^\/(admin|quan-tri|api\/admin|api\/quan-tri)(\/|$)/;

function themHeader(res: NextResponse) {
  res.headers.set('X-Robots-Tag', KHONG_INDEX);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export async function middleware(req: NextRequest) {
  const duong = req.nextUrl.pathname;

  if (KHU_QUAN_TRI.test(duong)) {
    if (MO_CONG_KHAI.has(duong) || req.cookies.get(COOKIE_PHIEN)?.value || daXacThucQuanTri(req)) {
      return themHeader(NextResponse.next());
    }
    if (duong.startsWith('/api/')) {
      return themHeader(NextResponse.json({ ok: false, error: 'Chưa đăng nhập quản trị' }, { status: 401 }));
    }
    const url = req.nextUrl.clone();
    url.pathname = '/quan-tri/dang-nhap';
    url.search = '';
    return themHeader(NextResponse.redirect(url));
  }

  if (duong.startsWith('/api/') || (req.method !== 'GET' && req.method !== 'HEAD')) return NextResponse.next();

  const ch = await timChuyenHuong(req.headers.get('host'), duong).catch(() => null);
  if (!ch) return NextResponse.next();
  if (ch.ma === 410) return new NextResponse('Trang này đã bị gỡ.', { status: 410, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  const den = new URL(ch.den, req.nextUrl.origin);
  // Giữ query của yêu cầu gốc nếu đích không có query riêng.
  if (!den.search && req.nextUrl.search) den.search = req.nextUrl.search;
  return NextResponse.redirect(den, ch.ma);
}

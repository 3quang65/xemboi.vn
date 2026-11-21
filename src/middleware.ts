// Đợt 0 (docs/v2/17 mục 8): chặn toàn bộ khu quản trị cũ khi chưa đăng nhập bằng ADMIN_KEY.
// Các route /api/admin/** vẫn tự kiểm lại (yeuCauQuanTri) để không phụ thuộc riêng vào middleware.
import { NextResponse, type NextRequest } from 'next/server';
import { daXacThucQuanTri } from '@/lib/r1/admin-auth';

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin', '/api/admin/:path*'],
  runtime: 'nodejs',
};

const KHONG_INDEX = 'noindex, nofollow, noarchive';

export function middleware(req: NextRequest) {
  if (daXacThucQuanTri(req)) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', KHONG_INDEX);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }

  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { ok: false, error: 'Chưa đăng nhập quản trị' },
      { status: 401, headers: { 'X-Robots-Tag': KHONG_INDEX, 'Cache-Control': 'no-store' } },
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = '/quan-tri/r1';
  url.search = '';
  const res = NextResponse.redirect(url);
  res.headers.set('X-Robots-Tag', KHONG_INDEX);
  return res;
}

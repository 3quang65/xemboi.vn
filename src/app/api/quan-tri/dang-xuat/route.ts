import { NextResponse } from 'next/server';
import { COOKIE_PHIEN, thuHoiPhien } from '@/lib/quan-tri/phien';

export async function POST(req: Request) {
  const ma = (req.headers.get('cookie') || '').split(';').map((s) => s.trim()).find((s) => s.startsWith(COOKIE_PHIEN + '='))?.slice(COOKIE_PHIEN.length + 1);
  await thuHoiPhien(ma ? decodeURIComponent(ma) : null);
  // Gửi từ form (trình duyệt) thì quay về trang đăng nhập; gọi bằng fetch thì trả JSON.
  const res = (req.headers.get('accept') || '').includes('text/html')
    ? NextResponse.redirect(new URL('/quan-tri/dang-nhap', req.url), 303)
    : NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_PHIEN);
  return res;
}

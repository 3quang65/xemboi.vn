import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  coCauHinhAdminKey,
  kiemTraKhoaQuanTri,
  taoTokenQuanTri,
} from '@/lib/r1/admin-auth';

export async function POST(req: Request) {
  if (!coCauHinhAdminKey()) {
    return NextResponse.json(
      { ok: false, loi: 'Chưa cấu hình biến môi trường ADMIN_KEY trên máy chủ.' },
      { status: 500 },
    );
  }

  try {
    const body = (await req.json()) as { key?: string };
    const key = typeof body.key === 'string' ? body.key : '';
    if (!kiemTraKhoaQuanTri(key)) {
      return NextResponse.json({ ok: false, loi: 'Khóa quản trị không đúng.' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, taoTokenQuanTri(key.trim()), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 giờ
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, loi: 'Yêu cầu không hợp lệ.' }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}

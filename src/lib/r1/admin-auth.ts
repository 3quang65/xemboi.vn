import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';

export const ADMIN_COOKIE_NAME = 'r1_admin_session';

function layAdminKey(): string {
  return (process.env.ADMIN_KEY || '').trim();
}

export function taoTokenQuanTri(key: string): string {
  return crypto.createHmac('sha256', key).update('xemboi-r1-quan-tri-v1').digest('hex');
}

function soSanhAnToan(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function kiemTraKhoaQuanTri(khoaNhap: string): boolean {
  const key = layAdminKey();
  if (!key || !khoaNhap) return false;
  return soSanhAnToan(khoaNhap.trim(), key);
}

export function daXacThucQuanTri(req: NextRequest): boolean {
  const key = layAdminKey();
  if (!key) return false;

  const headerKey = req.headers.get('x-admin-key');
  if (headerKey && soSanhAnToan(headerKey.trim(), key)) {
    return true;
  }

  const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookieToken && soSanhAnToan(cookieToken, taoTokenQuanTri(key))) {
    return true;
  }

  return false;
}

export function coCauHinhAdminKey(): boolean {
  return layAdminKey().length > 0;
}

function layCookie(req: Request, ten: string): string | undefined {
  const raw = req.headers.get('cookie') || '';
  for (const phan of raw.split(';')) {
    const i = phan.indexOf('=');
    if (i > 0 && phan.slice(0, i).trim() === ten) return decodeURIComponent(phan.slice(i + 1).trim());
  }
  return undefined;
}

/** Kiểm quyền cho route handler nhận `Request` thường. Trả về Response 401 nếu chưa đăng nhập, null nếu hợp lệ. */
export function yeuCauQuanTri(req: Request): Response | null {
  const key = layAdminKey();
  if (key) {
    const headerKey = req.headers.get('x-admin-key');
    if (headerKey && soSanhAnToan(headerKey.trim(), key)) return null;
    const token = layCookie(req, ADMIN_COOKIE_NAME);
    if (token && soSanhAnToan(token, taoTokenQuanTri(key))) return null;
  }
  return Response.json(
    { ok: false, error: 'Chưa đăng nhập quản trị' },
    { status: 401, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } },
  );
}

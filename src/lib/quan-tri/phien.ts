// Phiên đăng nhập quản trị (docs/v2/17 mục 5.1).
// Cookie chứa mã ngẫu nhiên 32 byte; CSDL chỉ lưu SHA-256 của mã. HttpOnly, SameSite=Lax, Secure khi production, 7 ngày.
import crypto from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Prisma, TaiKhoan, VaiTro } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { coQuyen, type Quyen } from './quyen';

export const COOKIE_PHIEN = 'qt_phien';
const HAN_PHIEN_MS = 7 * 24 * 60 * 60 * 1000;

export type NguoiDung = Pick<TaiKhoan, 'id' | 'email' | 'hoTen' | 'vaiTro' | 'mangDuyet'>;

const bam = (ma: string) => crypto.createHash('sha256').update(ma).digest('hex');

export function tuyChonCookiePhien(hetHan: Date) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: hetHan,
  };
}

export async function taoPhien(taiKhoanId: string, ip?: string | null, userAgent?: string | null) {
  const ma = crypto.randomBytes(32).toString('base64url');
  const hetHan = new Date(Date.now() + HAN_PHIEN_MS);
  await prisma.phienDangNhap.create({
    data: { maBam: bam(ma), taiKhoanId, ip: ip ?? null, userAgent: userAgent?.slice(0, 300) ?? null, hetHan },
  });
  return { ma, hetHan };
}

export async function nguoiDungTuMa(ma: string | undefined | null): Promise<NguoiDung | null> {
  if (!ma) return null;
  const p = await prisma.phienDangNhap.findUnique({
    where: { maBam: bam(ma) },
    include: { taiKhoan: { select: { id: true, email: true, hoTen: true, vaiTro: true, mangDuyet: true, dangHoatDong: true } } },
  });
  if (!p || p.thuHoiLuc || p.hetHan < new Date() || !p.taiKhoan.dangHoatDong) return null;
  const { dangHoatDong: _bo, ...nd } = p.taiKhoan;
  return nd;
}

export async function thuHoiPhien(ma: string | undefined | null) {
  if (!ma) return;
  await prisma.phienDangNhap.updateMany({ where: { maBam: bam(ma), thuHoiLuc: null }, data: { thuHoiLuc: new Date() } });
}

function layCookie(req: Request, ten: string): string | undefined {
  for (const phan of (req.headers.get('cookie') || '').split(';')) {
    const i = phan.indexOf('=');
    if (i > 0 && phan.slice(0, i).trim() === ten) return decodeURIComponent(phan.slice(i + 1).trim());
  }
  return undefined;
}

export const ipCua = (h: Headers) => (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || null;

/** Dùng trong server component / layout. Chưa đăng nhập → /quan-tri/dang-nhap; thiếu quyền → /quan-tri?thieu-quyen. */
export async function yeuCauQuyen(quyen?: Quyen): Promise<NguoiDung> {
  const nd = await nguoiDungTuMa((await cookies()).get(COOKIE_PHIEN)?.value);
  if (!nd) redirect('/quan-tri/dang-nhap');
  if (quyen && !coQuyen(nd.vaiTro, quyen)) redirect('/quan-tri?thieu-quyen=' + encodeURIComponent(quyen));
  return nd;
}

/** Lấy người dùng hiện tại trong server component, không chuyển hướng. */
export async function nguoiDungHienTai(): Promise<NguoiDung | null> {
  return nguoiDungTuMa((await cookies()).get(COOKIE_PHIEN)?.value);
}

/** Dùng trong route handler. Trả về người dùng, hoặc Response 401/403 để trả ngay. */
export async function kiemQuyenApi(req: Request, quyen: Quyen): Promise<NguoiDung | Response> {
  const nd = await nguoiDungTuMa(layCookie(req, COOKIE_PHIEN));
  const h = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };
  if (!nd) return Response.json({ ok: false, loi: 'Chưa đăng nhập' }, { status: 401, headers: h });
  if (!coQuyen(nd.vaiTro, quyen)) return Response.json({ ok: false, loi: 'Không đủ quyền: ' + quyen }, { status: 403, headers: h });
  return nd;
}

/** Người dùng từ cookie phiên của một Request (không kiểm quyền). */
export async function nguoiDungCuaRequest(req: Request): Promise<NguoiDung | null> {
  return nguoiDungTuMa(layCookie(req, COOKIE_PHIEN));
}

export function laVaiTro(nd: NguoiDung | null, v: VaiTro) {
  return Boolean(nd?.vaiTro.includes(v));
}

type Tx = Prisma.TransactionClient | typeof prisma;

/** Ghi nhật ký thao tác (chỉ thêm). Gọi trong cùng giao dịch với thao tác khi có thể. */
export async function ghiNhatKy(
  tx: Tx,
  nd: NguoiDung | null,
  hanhDong: string,
  doiTuong: string,
  doiTuongId: string | number | bigint | null,
  truoc?: unknown,
  sau?: unknown,
) {
  let ip: string | null = null;
  try { ip = ipCua(await headers()); } catch { /* ngoài request */ }
  await tx.nhatKyThaoTac.create({
    data: {
      taiKhoanId: nd?.id ?? null,
      hanhDong,
      doiTuong,
      doiTuongId: doiTuongId == null ? null : String(doiTuongId),
      truoc: truoc === undefined ? undefined : (JSON.parse(JSON.stringify(truoc, (_k, v) => (typeof v === 'bigint' ? String(v) : v))) as Prisma.InputJsonValue),
      sau: sau === undefined ? undefined : (JSON.parse(JSON.stringify(sau, (_k, v) => (typeof v === 'bigint' ? String(v) : v))) as Prisma.InputJsonValue),
      ip,
    },
  });
}

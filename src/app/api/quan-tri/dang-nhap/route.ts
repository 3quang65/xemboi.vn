// Đăng nhập tài khoản quản trị (docs/v2/17 mục 5.1).
// 5 lần sai trong 15 phút → khóa 15 phút, tính theo email và theo IP.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { kiemMatKhau } from '@/lib/quan-tri/mat-khau';
import { COOKIE_PHIEN, ghiNhatKy, ipCua, taoPhien, tuyChonCookiePhien } from '@/lib/quan-tri/phien';

const SO_LAN_TOI_DA = 5;
const KHOA_MS = 15 * 60 * 1000;
const theoIp = new Map<string, { n: number; tu: number }>();

function ipBiKhoa(ip: string) {
  const x = theoIp.get(ip);
  if (!x) return false;
  if (Date.now() - x.tu > KHOA_MS) { theoIp.delete(ip); return false; }
  return x.n >= SO_LAN_TOI_DA;
}
function ipSai(ip: string) {
  const x = theoIp.get(ip);
  if (!x || Date.now() - x.tu > KHOA_MS) theoIp.set(ip, { n: 1, tu: Date.now() });
  else x.n++;
}

// Băm giả để thời gian trả lời như nhau khi email không tồn tại.
const BAM_GIA = '$scrypt$N=32768,r=8,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export async function POST(req: Request) {
  const ip = ipCua(req.headers) || 'khong-ro';
  const loi = (thongBao: string, status = 401) =>
    NextResponse.json({ ok: false, loi: thongBao }, { status, headers: { 'Cache-Control': 'no-store' } });

  if (ipBiKhoa(ip)) return loi('Sai quá nhiều lần. Thử lại sau 15 phút.', 429);

  let email = '', matKhau = '';
  try {
    const body = (await req.json()) as { email?: unknown; matKhau?: unknown };
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    matKhau = typeof body.matKhau === 'string' ? body.matKhau : '';
  } catch {
    return loi('Yêu cầu không hợp lệ.', 400);
  }
  if (!email || !matKhau) return loi('Thiếu email hoặc mật khẩu.', 400);

  const tk = await prisma.taiKhoan.findUnique({ where: { email } });
  if (tk?.khoaDen && tk.khoaDen > new Date()) return loi('Tài khoản đang tạm khóa do sai nhiều lần. Thử lại sau.', 429);

  const dung = await kiemMatKhau(matKhau, tk?.matKhauBam ?? BAM_GIA);
  if (!tk || !dung || !tk.dangHoatDong) {
    ipSai(ip);
    if (tk) {
      const soLanSai = tk.soLanSai + 1;
      await prisma.taiKhoan.update({
        where: { id: tk.id },
        data: soLanSai >= SO_LAN_TOI_DA ? { soLanSai: 0, khoaDen: new Date(Date.now() + KHOA_MS) } : { soLanSai },
      });
      await ghiNhatKy(prisma, null, 'tai_khoan.dang_nhap_sai', 'TaiKhoan', tk.id, undefined, { soLanSai });
    }
    return loi('Email hoặc mật khẩu không đúng.');
  }

  await prisma.taiKhoan.update({ where: { id: tk.id }, data: { soLanSai: 0, khoaDen: null, lanDangNhapCuoi: new Date() } });
  const { ma, hetHan } = await taoPhien(tk.id, ip, req.headers.get('user-agent'));
  await ghiNhatKy(prisma, { id: tk.id, email: tk.email, hoTen: tk.hoTen, vaiTro: tk.vaiTro, mangDuyet: tk.mangDuyet }, 'tai_khoan.dang_nhap', 'TaiKhoan', tk.id);

  const res = NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  res.cookies.set(COOKIE_PHIEN, ma, tuyChonCookiePhien(hetHan));
  return res;
}

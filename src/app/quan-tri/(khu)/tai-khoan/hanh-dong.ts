'use server';
// Quản lý tài khoản quản trị (docs/v2/17 mục 5.1). Chỉ QUAN_TRI. Không bao giờ ghi mật khẩu hay mã băm vào nhật ký.
// Chống tự khóa: không tự bỏ vai trò QUAN_TRI của mình, không tự vô hiệu hóa, luôn còn ít nhất một QUAN_TRI hoạt động.
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Prisma, VaiTro } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';
import { bamMatKhau, kiemDoManhMatKhau } from '@/lib/quan-tri/mat-khau';

const DUONG = '/quan-tri/tai-khoan';
const HOP_LE: VaiTro[] = ['QUAN_TRI', 'BIEN_TAP', 'CHUYEN_GIA_DUYET', 'XEM_SO_LIEU'];
const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const veLai = (bao: string, loi = false): never => redirect(`${DUONG}?${loi ? 'loi' : 'bao'}=${encodeURIComponent(bao)}`);
const CHON = { id: true, email: true, hoTen: true, vaiTro: true, mangDuyet: true, dangHoatDong: true } as const;

function docVaiTro(f: FormData): VaiTro[] {
  return HOP_LE.filter((v) => f.getAll('vaiTro').includes(v));
}
function docMang(f: FormData): string[] {
  return [...new Set(chu(f, 'mangDuyet').split(/[,\s]+/).map((s) => s.trim().toUpperCase()).filter((s) => /^[A-Z0-9_-]{1,20}$/.test(s)))];
}

/** Đếm QUAN_TRI đang hoạt động, trừ tài khoản `tru` (để biết thao tác có làm mất quản trị cuối cùng không). */
async function conQuanTriKhac(tx: Prisma.TransactionClient, tru: string) {
  return tx.taiKhoan.count({ where: { id: { not: tru }, dangHoatDong: true, vaiTro: { has: 'QUAN_TRI' } } });
}

export async function taoTaiKhoan(f: FormData) {
  const nd = await yeuCauQuyen('tai_khoan.quan_ly');
  const email = chu(f, 'email').toLowerCase();
  const hoTen = chu(f, 'hoTen');
  const vaiTro = docVaiTro(f);
  const mangDuyet = docMang(f);
  const matKhau = String(f.get('matKhau') ?? '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) veLai('Email không hợp lệ', true);
  if (!hoTen) veLai('Cần họ tên (tên thật hoặc bút danh của người thật)', true);
  if (!vaiTro.length) veLai('Chọn ít nhất một vai trò', true);
  const yeu = kiemDoManhMatKhau(matKhau);
  if (yeu) veLai(yeu, true);
  if (await prisma.taiKhoan.findUnique({ where: { email } })) veLai(`Email ${email} đã có tài khoản`, true);
  const matKhauBam = await bamMatKhau(matKhau);
  await prisma.$transaction(async (tx) => {
    const tk = await tx.taiKhoan.create({ data: { email, hoTen, matKhauBam, vaiTro, mangDuyet }, select: CHON });
    await ghiNhatKy(tx, nd, 'tai_khoan.tao', 'TaiKhoan', tk.id, undefined, tk);
  });
  revalidatePath(DUONG);
  veLai(`Đã tạo tài khoản ${email}. Gửi mật khẩu tạm cho người dùng qua kênh riêng và nhắc đổi.`);
}

export async function suaTaiKhoan(f: FormData) {
  const nd = await yeuCauQuyen('tai_khoan.quan_ly');
  const id = chu(f, 'id');
  const hoTen = chu(f, 'hoTen');
  const vaiTro = docVaiTro(f);
  const mangDuyet = docMang(f);
  const dangHoatDong = f.get('dangHoatDong') === 'on';
  if (!hoTen || !vaiTro.length) veLai('Cần họ tên và ít nhất một vai trò', true);
  let loi = '';
  await prisma.$transaction(async (tx) => {
    const truoc = await tx.taiKhoan.findUnique({ where: { id }, select: CHON });
    if (!truoc) { loi = 'Không tìm thấy tài khoản'; return; }
    if (id === nd.id && (!vaiTro.includes('QUAN_TRI') || !dangHoatDong)) { loi = 'Không tự bỏ quyền quản trị hoặc tự vô hiệu hóa tài khoản của mình'; return; }
    const mat = truoc.vaiTro.includes('QUAN_TRI') && truoc.dangHoatDong && (!vaiTro.includes('QUAN_TRI') || !dangHoatDong);
    if (mat && (await conQuanTriKhac(tx, id)) === 0) { loi = 'Phải còn ít nhất một quản trị đang hoạt động'; return; }
    const sau = await tx.taiKhoan.update({ where: { id }, data: { hoTen, vaiTro, mangDuyet, dangHoatDong }, select: CHON });
    // Bớt quyền hoặc khóa thì thu hồi phiên ngay, để quyền cũ không còn dùng được.
    const botQuyen = truoc.vaiTro.some((v) => !vaiTro.includes(v)) || (truoc.dangHoatDong && !dangHoatDong);
    if (botQuyen) await tx.phienDangNhap.updateMany({ where: { taiKhoanId: id, thuHoiLuc: null }, data: { thuHoiLuc: new Date() } });
    await ghiNhatKy(tx, nd, 'tai_khoan.sua', 'TaiKhoan', id, truoc, { ...sau, thuHoiPhien: botQuyen });
  });
  if (loi) veLai(loi, true);
  revalidatePath(DUONG);
  veLai('Đã lưu tài khoản.');
}

export async function datLaiMatKhau(f: FormData) {
  const nd = await yeuCauQuyen('tai_khoan.quan_ly');
  const id = chu(f, 'id');
  const matKhau = String(f.get('matKhau') ?? '');
  const yeu = kiemDoManhMatKhau(matKhau);
  if (yeu) veLai(yeu, true);
  const matKhauBam = await bamMatKhau(matKhau);
  let email = '';
  await prisma.$transaction(async (tx) => {
    const tk = await tx.taiKhoan.update({ where: { id }, data: { matKhauBam, soLanSai: 0, khoaDen: null }, select: { email: true } });
    email = tk.email;
    await tx.phienDangNhap.updateMany({ where: { taiKhoanId: id, thuHoiLuc: null }, data: { thuHoiLuc: new Date() } });
    await ghiNhatKy(tx, nd, 'tai_khoan.dat_lai_mat_khau', 'TaiKhoan', id, undefined, { email, thuHoiPhien: true });
  });
  revalidatePath(DUONG);
  veLai(`Đã đặt lại mật khẩu cho ${email} và đăng xuất mọi phiên của tài khoản này.`);
}

export async function thuHoiPhien(f: FormData) {
  const nd = await yeuCauQuyen('tai_khoan.quan_ly');
  const id = chu(f, 'id');
  if (id === nd.id) veLai('Muốn đăng xuất chính mình thì dùng nút Đăng xuất', true);
  let n = 0;
  await prisma.$transaction(async (tx) => {
    n = (await tx.phienDangNhap.updateMany({ where: { taiKhoanId: id, thuHoiLuc: null }, data: { thuHoiLuc: new Date() } })).count;
    await ghiNhatKy(tx, nd, 'tai_khoan.thu_hoi_phien', 'TaiKhoan', id, undefined, { soPhien: n });
  });
  revalidatePath(DUONG);
  veLai(`Đã thu hồi ${n} phiên đăng nhập.`);
}

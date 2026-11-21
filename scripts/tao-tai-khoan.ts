// Tạo hoặc đặt lại tài khoản quản trị (docs/v2/17 mục 5.1).
// Chạy trên máy chủ (ai có shell và DATABASE_URL thì đã là người được tin):
//   npx tsx scripts/tao-tai-khoan.ts --email anh@example.com --ten "Tên" --vai-tro QUAN_TRI
//   (mật khẩu: đặt biến MAT_KHAU_MOI, hoặc nhập khi được hỏi; không truyền qua tham số dòng lệnh)
//   --vai-tro nhận nhiều giá trị ngăn bằng dấu phẩy: QUAN_TRI,BIEN_TAP,CHUYEN_GIA_DUYET,XEM_SO_LIEU
//   --mang A,B (mảng 07b giao cho chuyên gia duyệt)
import readline from 'node:readline';
import { PrismaClient, type VaiTro } from '@prisma/client';
import { bamMatKhau, kiemDoManhMatKhau } from '../src/lib/quan-tri/mat-khau';

const HOP_LE: VaiTro[] = ['QUAN_TRI', 'BIEN_TAP', 'CHUYEN_GIA_DUYET', 'XEM_SO_LIEU'];

function thamSo(ten: string): string | undefined {
  const i = process.argv.indexOf('--' + ten);
  return i > 0 ? process.argv[i + 1] : undefined;
}

async function hoiMatKhau(): Promise<string> {
  if (process.env.MAT_KHAU_MOI) return process.env.MAT_KHAU_MOI;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  const hoi = (c: string) => new Promise<string>((res) => rl.question(c, res));
  const a = await hoi('Mật khẩu mới (≥ 12 ký tự): ');
  const b = await hoi('Nhập lại: ');
  rl.close();
  if (a !== b) throw new Error('Hai lần nhập không khớp.');
  return a;
}

async function main() {
  const email = (thamSo('email') || '').trim().toLowerCase();
  const hoTen = (thamSo('ten') || '').trim();
  const vaiTro = (thamSo('vai-tro') || 'QUAN_TRI').split(',').map((s) => s.trim()) as VaiTro[];
  const mang = (thamSo('mang') || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!email || !hoTen) throw new Error('Cần --email và --ten.');
  const sai = vaiTro.filter((v) => !HOP_LE.includes(v));
  if (sai.length) throw new Error('Vai trò không hợp lệ: ' + sai.join(', '));

  const matKhau = await hoiMatKhau();
  const yeu = kiemDoManhMatKhau(matKhau);
  if (yeu) throw new Error(yeu);

  const prisma = new PrismaClient();
  try {
    const matKhauBam = await bamMatKhau(matKhau);
    const tk = await prisma.taiKhoan.upsert({
      where: { email },
      create: { email, hoTen, matKhauBam, vaiTro, mangDuyet: mang },
      update: { hoTen, matKhauBam, vaiTro, mangDuyet: mang, soLanSai: 0, khoaDen: null, dangHoatDong: true },
    });
    // Đặt lại mật khẩu thì thu hồi mọi phiên cũ.
    await prisma.phienDangNhap.updateMany({ where: { taiKhoanId: tk.id, thuHoiLuc: null }, data: { thuHoiLuc: new Date() } });
    await prisma.nhatKyThaoTac.create({
      data: { hanhDong: 'tai_khoan.tao_hoac_dat_lai', doiTuong: 'TaiKhoan', doiTuongId: tk.id, sau: { email, vaiTro, mangDuyet: mang } },
    });
    console.log(`Đã lưu tài khoản ${email} (${vaiTro.join(', ')}).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('Lỗi:', e instanceof Error ? e.message : e);
  process.exit(1);
});

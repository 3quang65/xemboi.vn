'use server';
// Server action quản lý khách hàng (Đợt 2 - Lệnh 22). Chỉ quản trị (quyền khach_hang.sua).
// Không gọi updateCustomer (hàm cũ nuốt lỗi và fallback bộ nhớ).
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';

class LoiNghiepVu extends Error {}

const DUONG_DS = '/quan-tri/khach-hang';
const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function veLai(duong: string, bao: string, loi = false): never {
  redirect(`${duong}?${loi ? 'loi' : 'bao'}=${encodeURIComponent(bao)}`);
}

function docNhan(raw: string): string[] {
  const ds = raw
    .split(/[,\n]/)
    .map((s) => s.trim().slice(0, 80))
    .filter(Boolean);
  return [...new Set(ds)].slice(0, 30);
}

export async function suaKhachHang(f: FormData) {
  const nd = await yeuCauQuyen('khach_hang.sua');

  const id = chu(f, 'id');
  if (!id) veLai(DUONG_DS, 'Thiếu mã khách hàng', true);
  const quayVe = `${DUONG_DS}/${encodeURIComponent(id)}`;

  const rawDiem = chu(f, 'leadScore');
  const diemSo = Number(rawDiem);
  if (!rawDiem || !Number.isFinite(diemSo)) {
    veLai(quayVe, 'Điểm tiềm năng phải là số hợp lệ trong khoảng 0–100', true);
  }
  const leadScore = Math.max(0, Math.min(100, Math.round(diemSo)));
  const tags = docNhan(String(f.get('tags') ?? ''));
  const adminNotes = String(f.get('adminNotes') ?? '').replace(/\r\n/g, '\n').trim() || null;

  let loi: string | null = null;

  try {
    await prisma.$transaction(async (tx) => {
      const truoc = await tx.customerProfile.findUnique({
        where: { id },
        select: { tags: true, adminNotes: true, leadScore: true },
      });
      if (!truoc) {
        throw new LoiNghiepVu('Không tìm thấy hồ sơ khách hàng trong cơ sở dữ liệu.');
      }

      const sau = await tx.customerProfile.update({
        where: { id },
        data: { tags, adminNotes, leadScore },
        select: { tags: true, adminNotes: true, leadScore: true },
      });

      await ghiNhatKy(tx, nd, 'khach_hang.sua', 'CustomerProfile', id, truoc, sau);
    });
  } catch (e: unknown) {
    loi = e instanceof LoiNghiepVu ? e.message : 'Không lưu được thông tin khách hàng. Vui lòng thử lại.';
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath(DUONG_DS);
  revalidatePath(quayVe);
  veLai(quayVe, 'Đã cập nhật nhãn, ghi chú và điểm tiềm năng.');
}

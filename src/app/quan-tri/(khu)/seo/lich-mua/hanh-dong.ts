'use server';
// Server action cập nhật trạng thái và ghi chú lịch nội dung mùa vụ (/quan-tri/seo/lich-mua).
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';

const TRANG_THAI_HOP_LE = ['CHUA_LAM', 'DANG_LAM', 'XONG', 'HOAN'] as const;
const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function veLichMua(bao: string, loi = false): never {
  redirect(`/quan-tri/seo/lich-mua?${loi ? 'loi' : 'bao'}=${encodeURIComponent(bao)}`);
}

export async function capNhatLichMua(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  const id = chu(f, 'id');
  const trangThai = chu(f, 'trangThai');
  const ghiChuRaw = chu(f, 'ghiChu');

  if (!id || !TRANG_THAI_HOP_LE.includes(trangThai as (typeof TRANG_THAI_HOP_LE)[number])) {
    veLichMua('Trạng thái hoặc mã lịch mùa vụ không hợp lệ', true);
  }
  if (ghiChuRaw.length > 2000) {
    veLichMua('Ghi chú tối đa 2.000 ký tự', true);
  }

  const kq = await prisma.$transaction(async (tx) => {
    const truoc = await tx.seoLichMua.findUnique({ where: { id } });
    if (!truoc) return { ok: false as const, loi: 'Không thấy dòng lịch mùa vụ' };

    const ghiChu = ghiChuRaw || null;
    const sau = await tx.seoLichMua.update({
      where: { id },
      data: { trangThai, ghiChu },
    });

    await ghiNhatKy(
      tx,
      nd,
      'seo.lich_mua',
      'SeoLichMua',
      id,
      { ten: truoc.ten, trangThai: truoc.trangThai, ghiChu: truoc.ghiChu },
      { ten: sau.ten, trangThai: sau.trangThai, ghiChu: sau.ghiChu },
    );

    return { ok: true as const, ten: sau.ten };
  });

  if (!kq.ok) veLichMua(kq.loi, true);

  revalidatePath('/quan-tri/seo/lich-mua');
  veLichMua(`Đã lưu mùa vụ “${kq.ten}”`);
}

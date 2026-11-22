'use server';
// Server actions cho trang xếp hạng Search Console (/quan-tri/seo/xep-hang).
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';

const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function locQuayVe(raw: string, macDinh: string): string {
  if (raw && raw.startsWith('/quan-tri/seo/xep-hang') && !raw.startsWith('//')) return raw;
  return macDinh;
}

function veLai(duong: string, bao: string, loi = false): never {
  const u = new URL(duong, 'http://localhost');
  u.searchParams.delete('bao');
  u.searchParams.delete('loi');
  u.searchParams.set(loi ? 'loi' : 'bao', bao);
  redirect(`${u.pathname}${u.search}`);
}

export async function xuLyCanhBaoGsc(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  const id = chu(f, 'id');
  const trangThai = chu(f, 'trangThai');
  const quayVe = locQuayVe(chu(f, 'quayVe'), '/quan-tri/seo/xep-hang?tab=canh-bao');

  if (!id || (trangThai !== 'DA_XU_LY' && trangThai !== 'BO_QUA')) {
    veLai(quayVe, 'Yêu cầu xử lý cảnh báo không hợp lệ', true);
  }

  const kq = await prisma.$transaction(async (tx) => {
    const truoc = await tx.seoCanhBao.findUnique({ where: { id } });
    if (!truoc) return { ok: false as const, loi: 'Không thấy cảnh báo' };
    const nguon =
      truoc.chiTiet && typeof truoc.chiTiet === 'object'
        ? (truoc.chiTiet as Record<string, unknown>).nguon
        : null;
    if ((truoc.loai !== 'TUT_HANG' && truoc.loai !== 'TRUNG_Y_DINH') || nguon !== 'gsc') {
      return { ok: false as const, loi: 'Bản ghi này không phải cảnh báo Search Console' };
    }
    if (truoc.trangThai !== 'MO') {
      return { ok: false as const, loi: 'Cảnh báo này không còn ở trạng thái mở' };
    }

    const luc = new Date();
    const sau = await tx.seoCanhBao.update({
      where: { id },
      data: { trangThai, xuLyLuc: luc, xuLyBoiId: nd.id },
    });

    await ghiNhatKy(
      tx,
      nd,
      'seo.canh_bao',
      'SeoCanhBao',
      id,
      {
        loai: truoc.loai,
        trangId: truoc.trangId,
        trangThai: truoc.trangThai,
        xuLyLuc: truoc.xuLyLuc,
        xuLyBoiId: truoc.xuLyBoiId,
        chiTiet: truoc.chiTiet,
      },
      {
        loai: sau.loai,
        trangId: sau.trangId,
        trangThai: sau.trangThai,
        xuLyLuc: sau.xuLyLuc,
        xuLyBoiId: sau.xuLyBoiId,
      },
    );

    return { ok: true as const, trangId: truoc.trangId };
  });

  if (!kq.ok) veLai(quayVe, kq.loi, true);

  revalidatePath('/quan-tri/seo/xep-hang');
  revalidatePath('/quan-tri/seo/lien-ket');
  if (kq.trangId) revalidatePath(`/quan-tri/seo/trang/${kq.trangId}`);
  veLai(quayVe, trangThai === 'DA_XU_LY' ? 'Đã đánh dấu xử lý cảnh báo GSC' : 'Đã bỏ qua cảnh báo GSC');
}

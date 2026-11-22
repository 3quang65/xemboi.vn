'use server';
// Server actions cho trang đánh giá RAG (/quan-tri/rag/danh-gia). Không viết SQL thô.
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';
import { LA_MA_CHINH_THUC } from './HienThi';

const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function locQuayVe(raw: string, macDinh: string): string {
  if (raw && raw.startsWith('/quan-tri/rag/danh-gia') && !raw.startsWith('//')) return raw;
  return macDinh;
}

function veLai(duong: string, bao: string, loi = false): never {
  const u = new URL(duong, 'http://localhost');
  u.searchParams.delete('bao');
  u.searchParams.delete('loi');
  u.searchParams.set(loi ? 'loi' : 'bao', bao);
  redirect(`${u.pathname}${u.search}`);
}

export async function suaGhiChuCauHoi(f: FormData) {
  const nd = await yeuCauQuyen('rag.sua_doan');
  const id = chu(f, 'id');
  const ghiChu = chu(f, 'ghiChu');
  const quayVe = locQuayVe(chu(f, 'quayVe'), '/quan-tri/rag/danh-gia?tab=cau-hoi');

  if (!id || LA_MA_CHINH_THUC.test(id)) {
    veLai(quayVe, 'Không được sửa câu hỏi trong bộ đo chính thức (Q001–Q999)', true);
  }
  if (ghiChu.length > 1000) {
    veLai(quayVe, 'Ghi chú tối đa 1.000 ký tự', true);
  }

  const kq = await prisma.$transaction(async (tx) => {
    const truoc = await tx.ragCauHoiChuan.findUnique({ where: { id } });
    if (!truoc) return { ok: false as const, loi: 'Không tìm thấy câu hỏi chuẩn' };
    if (LA_MA_CHINH_THUC.test(truoc.id)) {
      return { ok: false as const, loi: 'Không được sửa câu hỏi bộ đo chính thức' };
    }

    const sau = await tx.ragCauHoiChuan.update({
      where: { id },
      data: { ghiChu: ghiChu || null },
    });

    await ghiNhatKy(
      tx,
      nd,
      'rag.cau_hoi_chuan',
      'RagCauHoiChuan',
      id,
      { id: truoc.id, cauHoi: truoc.cauHoi, ghiChu: truoc.ghiChu },
      { id: sau.id, cauHoi: sau.cauHoi, ghiChu: sau.ghiChu },
    );
    return { ok: true as const };
  });

  if (!kq.ok) veLai(quayVe, kq.loi, true);

  revalidatePath('/quan-tri/rag/danh-gia');
  veLai(quayVe, `Đã cập nhật ghi chú cho câu ${id}`);
}

export async function xoaCauHoiChuan(f: FormData) {
  const nd = await yeuCauQuyen('rag.sua_doan');
  const id = chu(f, 'id');
  const quayVe = locQuayVe(chu(f, 'quayVe'), '/quan-tri/rag/danh-gia?tab=cau-hoi');

  if (!id || LA_MA_CHINH_THUC.test(id)) {
    veLai(quayVe, 'Không được xóa câu hỏi trong bộ đo chính thức (Q001–Q999)', true);
  }

  const kq = await prisma.$transaction(async (tx) => {
    const truoc = await tx.ragCauHoiChuan.findUnique({ where: { id } });
    if (!truoc) return { ok: false as const, loi: 'Không tìm thấy câu hỏi chuẩn' };
    if (LA_MA_CHINH_THUC.test(truoc.id)) {
      return { ok: false as const, loi: 'Không được xóa câu hỏi bộ đo chính thức' };
    }

    await tx.ragCauHoiChuan.delete({ where: { id } });

    await ghiNhatKy(
      tx,
      nd,
      'rag.cau_hoi_chuan',
      'RagCauHoiChuan',
      id,
      {
        id: truoc.id,
        cauHoi: truoc.cauHoi,
        mang: truoc.mang,
        doanDung: truoc.doanDung.map(String),
        nguonDungMa: truoc.nguonDungMa,
        viTriDung: truoc.viTriDung,
        ghiChu: truoc.ghiChu,
      },
      null,
    );
    return { ok: true as const };
  });

  if (!kq.ok) veLai(quayVe, kq.loi, true);

  revalidatePath('/quan-tri/rag/danh-gia');
  veLai(quayVe, `Đã xóa câu hỏi chuẩn ${id}`);
}

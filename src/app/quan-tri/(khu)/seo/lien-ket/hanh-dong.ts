'use server';
// Server actions cho khu quản trị liên kết nội bộ (/quan-tri/seo/lien-ket).
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';

const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function locQuayVe(raw: string, macDinh: string): string {
  if (raw && raw.startsWith('/quan-tri/seo/') && !raw.startsWith('//')) return raw;
  return macDinh;
}

function veLai(duong: string, bao: string, loi = false): never {
  const u = new URL(duong, 'http://localhost');
  u.searchParams.delete('bao');
  u.searchParams.delete('loi');
  u.searchParams.set(loi ? 'loi' : 'bao', bao);
  redirect(`${u.pathname}${u.search}`);
}

export async function xuLyCanhBao(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  const id = chu(f, 'id');
  const trangThai = chu(f, 'trangThai');
  const quayVe = locQuayVe(chu(f, 'quayVe'), '/quan-tri/seo/lien-ket?tab=canh-bao');

  if (!id || (trangThai !== 'DA_XU_LY' && trangThai !== 'BO_QUA')) {
    veLai(quayVe, 'Yêu cầu xử lý cảnh báo không hợp lệ', true);
  }

  const kq = await prisma.$transaction(async (tx) => {
    const truoc = await tx.seoCanhBao.findUnique({ where: { id } });
    if (!truoc) return { ok: false as const, loi: 'Không thấy cảnh báo' };
    if (truoc.trangThai !== 'MO') return { ok: false as const, loi: 'Cảnh báo này không còn ở trạng thái mở' };

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

  revalidatePath('/quan-tri/seo/lien-ket');
  if (kq.trangId) revalidatePath(`/quan-tri/seo/trang/${kq.trangId}`);
  veLai(quayVe, trangThai === 'DA_XU_LY' ? 'Đã đánh dấu xử lý cảnh báo' : 'Đã bỏ qua cảnh báo');
}

async function capNhatTrangThaiGoiY(
  nd: Awaited<ReturnType<typeof yeuCauQuyen>>,
  f: FormData,
  hanhDong: 'CHAP_NHAN' | 'BO_QUA',
) {
  const id = chu(f, 'id');
  const anchor = chu(f, 'anchor');
  const quayVe = locQuayVe(chu(f, 'quayVe'), '/quan-tri/seo/lien-ket?tab=goi-y');

  if (!id) {
    veLai(quayVe, 'Thiếu mã gợi ý liên kết', true);
  }
  if (hanhDong === 'CHAP_NHAN') {
    if (!anchor) veLai(quayVe, 'Anchor không được để trống', true);
    if (anchor.length > 200) veLai(quayVe, 'Anchor tối đa 200 ký tự', true);
  }

  const kq = await prisma.$transaction(async (tx) => {
    const truoc = await tx.seoLienKet.findUnique({
      where: { id },
      include: {
        tuTrang: { select: { duongDan: true } },
        denTrang: { select: { duongDan: true } },
      },
    });
    if (!truoc) return { ok: false as const, loi: 'Không thấy gợi ý liên kết' };
    if (truoc.trangThai !== 'DE_XUAT') {
      return { ok: false as const, loi: 'Gợi ý liên kết này không còn ở trạng thái đề xuất' };
    }

    const sau = await tx.seoLienKet.update({
      where: { id },
      data: hanhDong === 'CHAP_NHAN' ? { trangThai: 'DA_DUYET', anchor } : { trangThai: 'BO_QUA' },
    });

    await ghiNhatKy(
      tx,
      nd,
      'seo.goi_y_lien_ket',
      'SeoLienKet',
      id,
      {
        tuDuongDan: truoc.tuTrang.duongDan,
        denDuongDan: truoc.denTrang.duongDan,
        trangThai: truoc.trangThai,
        anchor: truoc.anchor,
      },
      {
        tuDuongDan: truoc.tuTrang.duongDan,
        denDuongDan: truoc.denTrang.duongDan,
        trangThai: sau.trangThai,
        anchor: sau.anchor,
      },
    );

    return {
      ok: true as const,
      tuTrangId: truoc.tuTrangId,
      denTrangId: truoc.denTrangId,
      tuDuongDan: truoc.tuTrang.duongDan,
      denDuongDan: truoc.denTrang.duongDan,
    };
  });

  if (!kq.ok) veLai(quayVe, kq.loi, true);

  revalidatePath('/quan-tri/seo/lien-ket');
  revalidatePath(`/quan-tri/seo/trang/${kq.tuTrangId}`);
  revalidatePath(`/quan-tri/seo/trang/${kq.denTrangId}`);
  veLai(
    quayVe,
    hanhDong === 'CHAP_NHAN'
      ? `Đã duyệt gợi ý ${kq.tuDuongDan} → ${kq.denDuongDan}`
      : `Đã bỏ qua gợi ý ${kq.tuDuongDan} → ${kq.denDuongDan}`,
  );
}

export async function chapNhanGoiYLienKet(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  await capNhatTrangThaiGoiY(nd, f, 'CHAP_NHAN');
}

export async function boQuaGoiYLienKet(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  await capNhatTrangThaiGoiY(nd, f, 'BO_QUA');
}

export async function batTatQuyTacLienKet(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  const id = chu(f, 'id');
  const quayVe = locQuayVe(chu(f, 'quayVe'), '/quan-tri/seo/lien-ket?tab=quy-tac');

  if (!id) veLai(quayVe, 'Thiếu mã quy tắc', true);

  const kq = await prisma.$transaction(async (tx) => {
    const truoc = await tx.seoQuyTacLienKet.findUnique({ where: { id } });
    if (!truoc) return { ok: false as const, loi: 'Không thấy quy tắc liên kết' };

    const sau = await tx.seoQuyTacLienKet.update({
      where: { id },
      data: { batTat: !truoc.batTat },
    });

    await ghiNhatKy(
      tx,
      nd,
      'seo.quy_tac_lien_ket',
      'SeoQuyTacLienKet',
      id,
      { ten: truoc.ten, batTat: truoc.batTat },
      { ten: sau.ten, batTat: sau.batTat },
    );

    return { ok: true as const, ten: sau.ten, batTat: sau.batTat };
  });

  if (!kq.ok) veLai(quayVe, kq.loi, true);

  revalidatePath('/quan-tri/seo/lien-ket');
  veLai(quayVe, `Đã ${kq.batTat ? 'bật' : 'tắt'} quy tắc “${kq.ten}”`);
}

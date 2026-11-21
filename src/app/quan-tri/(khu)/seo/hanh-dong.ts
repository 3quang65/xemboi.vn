'use server';
// Thao tác ghi của khu SEO. Mỗi hàm tự kiểm quyền và ghi nhật ký trong cùng giao dịch.
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ChinhSachLoai, TrangThaiTrang, TrangThaiTuKhoa } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { docDanhSach, docKeywordPlanner, ganTheoQuyTac, giaiMa, gopVaoKho } from '@/lib/seo/kho-tu-khoa';
import { chuanHoaDuongDan, lamMoiChuyenHuong } from '@/lib/seo/chuyen-huong';
import { kiemTuCam } from '@/lib/seo/tu-cam';

const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const veLai = (duong: string, bao: string, loi = false): never => redirect(`${duong}${duong.includes('?') ? '&' : '?'}${loi ? 'loi' : 'bao'}=${encodeURIComponent(bao)}`);

// ---------- Từ khóa ----------

export async function ganTayTuKhoa(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  const id = chu(f, 'id'), maTrang = chu(f, 'maTrang'), quayVe = chu(f, 'quayVe') || '/quan-tri/seo/tu-khoa';
  const tk = await prisma.seoTuKhoa.findUnique({ where: { id } });
  if (!tk) veLai(quayVe, 'Không thấy từ khóa', true);
  let trangDichId: string | null = null;
  if (maTrang) {
    const t = await prisma.seoTrang.findFirst({ where: { OR: [{ maTrang }, { duongDan: maTrang }] }, select: { id: true } });
    if (!t) veLai(quayVe, `Không thấy trang “${maTrang}”`, true);
    trangDichId = t!.id;
  }
  await prisma.$transaction(async (tx) => {
    const sau = await tx.seoTuKhoa.update({
      where: { id },
      data: { trangDichId, nhomLoaiId: null, cachGan: 'TAY', quyTacId: null, trangThai: (trangDichId ? 'GIU' : 'MOI') as TrangThaiTuKhoa },
    });
    await ghiNhatKy(tx, nd, 'seo.tu_khoa.gan_tay', 'SeoTuKhoa', id, { trangDichId: tk!.trangDichId, cachGan: tk!.cachGan }, { trangDichId: sau.trangDichId });
  });
  revalidatePath('/quan-tri/seo');
  veLai(quayVe, `Đã gán tay “${tk!.chuoi}”`);
}

export async function traVeQuyTac(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  const id = chu(f, 'id'), quayVe = chu(f, 'quayVe') || '/quan-tri/seo/tu-khoa';
  await prisma.$transaction(async (tx) => {
    await tx.seoTuKhoa.update({ where: { id }, data: { cachGan: null } });
    await ghiNhatKy(tx, nd, 'seo.tu_khoa.tra_ve_quy_tac', 'SeoTuKhoa', id);
  });
  await ganTheoQuyTac(prisma);
  revalidatePath('/quan-tri/seo');
  veLai(quayVe, 'Đã trả từ khóa về gán theo quy tắc');
}

export async function chayLaiGan() {
  const nd = await yeuCauQuyen('seo.sua');
  const kq = await ganTheoQuyTac(prisma);
  await ghiNhatKy(prisma, nd, 'seo.gan.chay_lai', 'SeoQuyTacGan', null, undefined, kq);
  revalidatePath('/quan-tri/seo');
  veLai('/quan-tri/seo/do-phu', `Đã gán lại ${kq.soTuKhoa.toLocaleString('vi-VN')} từ khóa (gán tay giữ nguyên)`);
}

export async function nhapTepTuKhoa(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  const tep = f.get('tep');
  const loai = chu(f, 'loai');
  const duong = '/quan-tri/seo/tu-khoa/nhap';
  if (!(tep instanceof File) || !tep.size) veLai(duong, 'Chưa chọn tệp', true);
  const t = tep as File;
  if (t.size > 20 * 1024 * 1024) veLai(duong, 'Tệp quá 20 MB', true);
  if (!['KEYWORD_PLANNER', 'AUTOCOMPLETE', 'GOI_Y_GOOGLE', 'KHAC'].includes(loai)) veLai(duong, 'Loại tệp không hợp lệ', true);
  const text = giaiMa(new Uint8Array(await t.arrayBuffer()));
  let kq: Awaited<ReturnType<typeof gopVaoKho>> | null = null;
  let loiDoc: string | null = null;
  try {
    if (loai === 'KEYWORD_PLANNER') {
      const { dong, khoang } = docKeywordPlanner(text);
      kq = await gopVaoKho(prisma, dong, loai, t.name, khoang, nd.id);
    } else {
      const nguon = loai === 'AUTOCOMPLETE' ? 'AC' : loai === 'GOI_Y_GOOGLE' ? 'GG' : 'TAY';
      kq = await gopVaoKho(prisma, docDanhSach(text, nguon), loai, t.name, null, nd.id);
    }
  } catch (e) {
    loiDoc = e instanceof Error ? e.message : 'Không đọc được tệp';
  }
  if (loiDoc || !kq) veLai(duong, loiDoc ?? 'Không đọc được tệp', true);
  const gan = await ganTheoQuyTac(prisma);
  await ghiNhatKy(prisma, nd, 'seo.tu_khoa.nhap', 'SeoLoNhap', kq!.lo.id, undefined, { tenTep: t.name, loai, soDong: kq!.soDong, soMoi: kq!.soMoi, soCapNhat: kq!.soCapNhat });
  revalidatePath('/quan-tri/seo');
  veLai(duong, `“${t.name}”: ${kq!.soDong} dòng, ${kq!.soMoi} từ mới, ${kq!.soCapNhat} cập nhật. Đã gán lại ${gan.soTuKhoa} từ khóa.`);
}

// ---------- Nhóm loại ----------

export async function doiChinhSachNhom(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  const id = chu(f, 'id'), chinhSach = chu(f, 'chinhSach') as ChinhSachLoai, ghiChu = chu(f, 'ghiChu');
  if (!['LOAI_VINH_VIEN', 'DE_DANH_LANDING', 'CHO_QUYET'].includes(chinhSach)) veLai('/quan-tri/seo/tu-khoa-loai', 'Chính sách không hợp lệ', true);
  await prisma.$transaction(async (tx) => {
    const truoc = await tx.seoNhomLoai.findUniqueOrThrow({ where: { id } });
    const sau = await tx.seoNhomLoai.update({
      where: { id },
      data: { chinhSach, ghiChu: ghiChu || truoc.ghiChu, capNhatBoi: nd.email, nguonQuyet: `${nd.hoTen} ${new Date().toLocaleDateString('vi-VN')}` },
    });
    await ghiNhatKy(tx, nd, 'seo.nhom_loai.doi_chinh_sach', 'SeoNhomLoai', id, { chinhSach: truoc.chinhSach }, { chinhSach: sau.chinhSach });
  });
  revalidatePath('/quan-tri/seo/tu-khoa-loai');
  veLai('/quan-tri/seo/tu-khoa-loai', 'Đã đổi chính sách');
}

// ---------- Trang ----------

export async function luuTrang(f: FormData) {
  const nd = await yeuCauQuyen('seo.sua');
  const id = chu(f, 'id');
  const quayVe = `/quan-tri/seo/trang/${id}`;
  const truoc = await prisma.seoTrang.findUnique({ where: { id } });
  if (!truoc) veLai('/quan-tri/seo/trang', 'Không thấy trang', true);
  const t = truoc!;
  const duongDan = chuanHoaDuongDan(chu(f, 'duongDan') || t.duongDan);
  const title = chu(f, 'title'), metaDescription = chu(f, 'metaDescription'), h1 = chu(f, 'h1'), canonical = chu(f, 'canonical');
  const trangThai = (chu(f, 'trangThai') || t.trangThai) as TrangThaiTrang;
  const noindex = f.get('noindex') === 'on';
  if (!title) veLai(quayVe, 'Title không được trống', true);
  if (!['NHAP', 'XUAT_BAN', 'AN', 'DA_CHUYEN'].includes(trangThai)) veLai(quayVe, 'Trạng thái không hợp lệ', true);
  if (trangThai === 'XUAT_BAN' && duongDan.includes('{')) veLai(quayVe, 'Trang mẫu có {tham số} không xuất bản trực tiếp được', true);

  // Từ cấm: CHAN_CUNG trong title/meta/h1 thì không cho lưu khi xuất bản.
  const loiCam: string[] = [];
  for (const [ten, gt, pv] of [['Title', title, 'TIEU_DE'], ['Meta', metaDescription, 'META'], ['H1', h1, 'H1']] as const) {
    const k = await kiemTuCam(prisma, gt, pv);
    if (k.chan) loiCam.push(`${ten}: ${k.viPham.filter((v) => v.xuLy === 'CHAN_CUNG').map((v) => `“${v.cum}”`).join(', ')}`);
  }
  if (loiCam.length && trangThai === 'XUAT_BAN') veLai(quayVe, 'Có từ cấm, không xuất bản được. ' + loiCam.join('; '), true);

  const doiDuong = duongDan !== t.duongDan;
  if (doiDuong && (await prisma.seoTrang.findUnique({ where: { duongDan } }))) veLai(quayVe, `Đường dẫn ${duongDan} đã thuộc trang khác`, true);

  await prisma.$transaction(async (tx) => {
    const sau = await tx.seoTrang.update({
      where: { id },
      data: {
        duongDan, title, metaDescription: metaDescription || null, h1: h1 || null, canonical: canonical || null, noindex, trangThai,
        ghiDeMau: true, ngayCapNhatNoiDung: new Date(),
        ngayXuatBan: trangThai === 'XUAT_BAN' && !t.ngayXuatBan ? new Date() : t.ngayXuatBan,
      },
    });
    // Đổi slug của trang đã xuất bản: tự tạo 301 cũ → mới, nối lại các 301 đang trỏ về đường cũ (không để chuỗi).
    if (doiDuong && t.trangThai === 'XUAT_BAN' && !t.duongDan.includes('{')) {
      await tx.seoChuyenHuong.deleteMany({ where: { tuMien: 'xemboi.vn', tuDuongDan: duongDan } });
      await tx.seoChuyenHuong.updateMany({ where: { denUrl: t.duongDan }, data: { denUrl: duongDan } });
      await tx.seoChuyenHuong.upsert({
        where: { tuMien_tuDuongDan: { tuMien: 'xemboi.vn', tuDuongDan: t.duongDan } },
        create: { tuDuongDan: t.duongDan, denUrl: duongDan, nguon: 'DOI_SLUG', taoBoiId: nd.id, ghiChu: `Tự tạo khi đổi đường dẫn trang ${t.maTrang ?? t.id}` },
        update: { denUrl: duongDan, batTat: true, nguon: 'DOI_SLUG' },
      });
    }
    const chon = (x: typeof t) => ({ duongDan: x.duongDan, title: x.title, metaDescription: x.metaDescription, h1: x.h1, canonical: x.canonical, noindex: x.noindex, trangThai: x.trangThai });
    await ghiNhatKy(tx, nd, 'seo.trang.sua', 'SeoTrang', id, chon(t), chon(sau));
  });
  lamMoiChuyenHuong();
  revalidatePath('/quan-tri/seo/trang');
  revalidatePath(duongDan);
  veLai(quayVe, (doiDuong && t.trangThai === 'XUAT_BAN' ? `Đã lưu và tạo 301 ${t.duongDan} → ${duongDan}. ` : 'Đã lưu. ') + (loiCam.length ? 'Lưu ý từ cấm: ' + loiCam.join('; ') : ''));
}

// ---------- Chuyển hướng ----------

export async function themChuyenHuong(f: FormData) {
  const nd = await yeuCauQuyen('seo.redirect');
  const duong = '/quan-tri/seo/chuyen-huong';
  const tuMien = (chu(f, 'tuMien') || 'xemboi.vn').toLowerCase().replace(/^www\./, '');
  if (tuMien !== 'xemboi.vn' && !coQuyen(nd.vaiTro, 'seo.redirect_ten_mien')) veLai(duong, 'Chỉ quản trị viên được thêm chuyển hướng từ tên miền khác', true);
  const laBieuThuc = f.get('laBieuThuc') === 'on';
  const tuDuongDan = laBieuThuc ? chu(f, 'tuDuongDan') : chuanHoaDuongDan(chu(f, 'tuDuongDan'));
  const denUrl = chu(f, 'denUrl');
  const ma = Number(chu(f, 'ma') || 301);
  if (!tuDuongDan || !denUrl) veLai(duong, 'Cần đường dẫn nguồn và đích', true);
  if (![301, 302, 307, 308, 410].includes(ma)) veLai(duong, 'Mã HTTP không hợp lệ', true);
  if (!laBieuThuc && tuMien === 'xemboi.vn' && tuDuongDan === denUrl) veLai(duong, 'Nguồn và đích trùng nhau', true);
  if (!/^(\/|https:\/\/)/.test(denUrl)) veLai(duong, 'Đích phải bắt đầu bằng / hoặc https://', true);
  if (laBieuThuc) { let hopLe = true; try { new RegExp(tuDuongDan); } catch { hopLe = false; } if (!hopLe) veLai(duong, 'Biểu thức không hợp lệ', true); }
  await prisma.$transaction(async (tx) => {
    const ch = await tx.seoChuyenHuong.upsert({
      where: { tuMien_tuDuongDan: { tuMien, tuDuongDan } },
      create: { tuMien, tuDuongDan, denUrl, ma, laBieuThuc, nguon: 'TAY', ghiChu: chu(f, 'ghiChu') || null, taoBoiId: nd.id },
      update: { denUrl, ma, laBieuThuc, batTat: true, ghiChu: chu(f, 'ghiChu') || null },
    });
    await ghiNhatKy(tx, nd, 'seo.chuyen_huong.luu', 'SeoChuyenHuong', ch.id, undefined, { tuMien, tuDuongDan, denUrl, ma });
  });
  lamMoiChuyenHuong();
  revalidatePath(duong);
  veLai(duong, `Đã lưu ${tuDuongDan} → ${denUrl} (${ma})`);
}

export async function batTatChuyenHuong(f: FormData) {
  const nd = await yeuCauQuyen('seo.redirect');
  const id = chu(f, 'id');
  await prisma.$transaction(async (tx) => {
    const c = await tx.seoChuyenHuong.findUniqueOrThrow({ where: { id } });
    if (c.tuMien !== 'xemboi.vn' && !coQuyen(nd.vaiTro, 'seo.redirect_ten_mien')) throw new Error('Thiếu quyền tên miền');
    await tx.seoChuyenHuong.update({ where: { id }, data: { batTat: !c.batTat } });
    await ghiNhatKy(tx, nd, 'seo.chuyen_huong.bat_tat', 'SeoChuyenHuong', id, { batTat: c.batTat }, { batTat: !c.batTat });
  });
  lamMoiChuyenHuong();
  revalidatePath('/quan-tri/seo/chuyen-huong');
  veLai('/quan-tri/seo/chuyen-huong', 'Đã đổi trạng thái');
}

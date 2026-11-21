'use server';
// Server action của khu Nội dung (Đợt 2). Mọi hàm gọi yeuCauQuyen() ở dòng đầu và ghiNhatKy() trong cùng giao dịch.
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma, type KetLuanDuyet, type LoaiNoiDung, type TrangThaiNoiDung } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, type NguoiDung, yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { KHOI, noiKhoi, type KhoiMuc } from '@/lib/noi-dung/khoi';
import { taoNguCanhAi } from '@/lib/noi-dung/ngu-canh-ai';
import { chamOnpage } from '@/lib/noi-dung/onpage';
import { kiemChuyen, phaiNoindex, trangThaiSauKhiLuu, type Duyet, type NguCanhChuyen } from '@/lib/noi-dung/quy-trinh';
import { kiemTrichDan, timMaDoan } from '@/lib/noi-dung/trich-dan';
import { layTuCam } from '@/lib/seo/tu-cam';
import { demLoiChan, DS_LOAI_NOI_DUNG, DS_TRANG_THAI_ND, MA_MANG_HOP_LE } from './HienThi';

class LoiNghiepVu extends Error {}

const LOAI_HOP_LE = new Set<string>(DS_LOAI_NOI_DUNG);
const TRANG_THAI_HOP_LE = new Set<string>(DS_TRANG_THAI_ND);
const MANG_HOP_LE = new Set<string>(MA_MANG_HOP_LE);
const KET_LUAN_HOP_LE = new Set<string>(['DONG_Y', 'YEU_CAU_SUA', 'TU_CHOI']);

const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const vanBanGiuDong = (f: FormData, k: string) => String(f.get(k) ?? '').replace(/\r\n/g, '\n');

function veLai(duong: string, bao: string, loi = false): never {
  redirect(`${duong}${duong.includes('?') ? '&' : '?'}${loi ? 'loi' : 'bao'}=${encodeURIComponent(bao)}`);
}

function docMang(f: FormData): string[] {
  const ds = f.getAll('mang').map((v) => String(v).trim()).filter((m) => MANG_HOP_LE.has(m));
  return [...new Set(ds)];
}

function phanTichNgay(raw: string): Date | null | undefined {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function rutDuongDanCanonical(can: string | null | undefined): string | null {
  const s = can?.trim();
  if (!s) return null;
  if (s.startsWith('/')) return s.split(/[?#]/)[0] || '/';
  try {
    return new URL(s).pathname || '/';
  } catch {
    return null;
  }
}

function docKhoiTuForm(f: FormData): KhoiMuc {
  const khoi: KhoiMuc = {};
  for (const { ma } of KHOI) {
    const gt = vanBanGiuDong(f, ma).trim();
    if (gt) khoi[ma] = gt;
  }
  if (f.get('k5KhongApDung') === 'on') {
    khoi.k5KhongApDung = true;
  }
  return khoi;
}

function thongBaoLoi(e: unknown, macDinh: string): string {
  if (e instanceof LoiNghiepVu) return e.message;
  return macDinh;
}

async function luuPhienBanTrongTx(
  tx: Prisma.TransactionClient,
  nd: NguoiDung,
  noiDungId: string,
  duLieu: { khoi: KhoiMuc | null; than: string | null; ghiChu: string | null; khoiPhucTuSo?: number },
) {
  const noiDung = await tx.noiDung.findUnique({
    where: { id: noiDungId },
    include: {
      trang: {
        include: { tuKhoaChinh: { select: { chuoi: true } } },
      },
      phienBan: {
        orderBy: { so: 'desc' },
        take: 1,
        select: { so: true },
      },
    },
  });
  if (!noiDung) throw new LoiNghiepVu('Không tìm thấy mục nội dung.');

  const laTuDien = noiDung.loai === 'MUC_TU_DIEN';
  const khoi = laTuDien ? (duLieu.khoi ?? {}) : null;
  const than = laTuDien ? null : (duLieu.than ?? '');
  const vanBanKiemMa = laTuDien ? noiKhoi(khoi) : (than ?? '');

  // 1. Tìm mọi [D:n] và chỉ nạp các đoạn từ view công khai.
  const maDoan = timMaDoan(vanBanKiemMa);
  const nguCanh = await taoNguCanhAi(tx, maDoan);

  // 2. Kiểm trích dẫn; đánh dấu rõ mã nằm trong biLoai (không tồn tại hoặc là nội bộ).
  const biLoaiSet = new Set(nguCanh.biLoai);
  const trichDan = kiemTrichDan({
    khoi: laTuDien ? khoi : undefined,
    than: laTuDien ? undefined : than,
    doanDaGui: nguCanh.doan,
  });
  for (const l of trichDan.loi) {
    if (l.ma === 'MA_DOAN_BIA') {
      const khop = l.thongBao.match(/\[D:(\d+)\]/);
      if (khop && biLoaiSet.has(khop[1])) {
        l.thongBao = `Mã đoạn bịa [D:${khop[1]}]: đoạn không tồn tại hoặc là nội bộ`;
      }
    }
  }

  // 3. Chấm điểm onpage (phiên bản mới chưa có chuyên gia duyệt nên coChuyenGiaDuyet = false).
  const trang = noiDung.trang;
  const duongDanTrang = trang?.duongDan ?? '';
  let canonicalDich: { trangThai: string; noindex: boolean } | null = null;
  const can = trang?.canonical?.trim();
  if (can && can !== duongDanTrang && !can.endsWith(duongDanTrang)) {
    const duongCan = rutDuongDanCanonical(can);
    if (duongCan) {
      canonicalDich = await tx.seoTrang.findUnique({
        where: { duongDan: duongCan },
        select: { trangThai: true, noindex: true },
      });
    }
  }

  const tuCam = await layTuCam(tx, true);
  const onpage = chamOnpage({
    loai: noiDung.loai,
    duongDan: duongDanTrang,
    tuKhoaChinh: trang?.tuKhoaChinh?.chuoi ?? null,
    title: trang?.title ?? null,
    meta: trang?.metaDescription ?? null,
    h1: trang?.h1 ?? null,
    khoi: laTuDien ? khoi : undefined,
    than: laTuDien ? undefined : than,
    canonical: trang?.canonical ?? null,
    canonicalDich,
    jsonLd: trang?.schemaJsonLd != null ? JSON.stringify(trang.schemaJsonLd) : null,
    soTrichHopLe: trichDan.maHopLe.length,
    loiTrichDan: trichDan.loi,
    coChuyenGiaDuyet: false,
    tuCam,
  });

  // 4. Tạo NoiDungPhienBan mới (không sửa/xóa bản cũ).
  const soCu = noiDung.phienBan[0]?.so ?? 0;
  const soMoi = soCu + 1;
  const kiemTraJson = JSON.parse(JSON.stringify({ onpage, trichDan })) as Prisma.InputJsonValue;

  const pb = await tx.noiDungPhienBan.create({
    data: {
      noiDungId: noiDung.id,
      so: soMoi,
      khoi: laTuDien ? (khoi as Prisma.InputJsonValue) : Prisma.JsonNull,
      than: laTuDien ? null : than,
      nguonTao: 'TAY',
      taoBoiId: nd.id,
      ghiChu: duLieu.ghiChu || null,
      kiemTra: kiemTraJson,
    },
  });

  // 5. Tạo các dòng NoiDungTrichDan từ maHopLe.
  if (trichDan.maHopLe.length > 0) {
    const ids = [...new Set(trichDan.maHopLe.map((m) => BigInt(m.doanId)))];
    const dsDoan = await tx.ragDoan.findMany({
      where: { id: { in: ids } },
      select: { id: true, nguonId: true, duongDan: true },
    });
    const mapDoan = new Map(dsDoan.map((d) => [String(d.id), d]));

    await tx.noiDungTrichDan.createMany({
      data: trichDan.maHopLe.map((m) => {
        const d = mapDoan.get(m.doanId);
        return {
          phienBanId: pb.id,
          khoi: m.khoi ? Number(m.khoi.slice(1)) : null,
          doanId: BigInt(m.doanId),
          nguonId: d?.nguonId ?? null,
          kieu: 'TOM_Y',
          viTri: d && d.duongDan.length > 0 ? d.duongDan.join(' › ') : null,
        };
      }),
    });
  }

  // 6. Đổi trạng thái theo trangThaiSauKhiLuu và cập nhật điểm onpage trên SeoTrang gắn kèm.
  const trangThaiMoi = trangThaiSauKhiLuu(noiDung.trangThai, 'TAY');
  await tx.noiDung.update({
    where: { id: noiDung.id },
    data: {
      trangThai: trangThaiMoi,
      bienTapId: noiDung.bienTapId ?? nd.id,
    },
  });

  if (trang) {
    await tx.seoTrang.update({
      where: { id: trang.id },
      data: {
        diemOnpage: onpage.diem,
        chiTietDiem: JSON.parse(JSON.stringify(onpage.loi)) as Prisma.InputJsonValue,
        chamLuc: new Date(),
      },
    });
  }

  // 7. Ghi nhật ký nd.luu_phien_ban trong cùng giao dịch.
  await ghiNhatKy(
    tx,
    nd,
    'nd.luu_phien_ban',
    'NoiDung',
    noiDung.id,
    { trangThai: noiDung.trangThai, soCu },
    {
      trangThai: trangThaiMoi,
      soMoi,
      phienBanId: pb.id,
      diem: onpage.diem,
      soTrichHopLe: trichDan.maHopLe.length,
      biLoai: nguCanh.biLoai,
      ...(duLieu.khoiPhucTuSo ? { khoiPhucTuSo: duLieu.khoiPhucTuSo } : {}),
    },
  );

  return {
    soMoi,
    diem: onpage.diem,
    trangThaiCu: noiDung.trangThai,
    trangThaiMoi,
    biLoai: nguCanh.biLoai,
    seoTrangId: trang?.id ?? null,
  };
}

// ---------- Tạo mới ----------

export async function taoNoiDung(f: FormData) {
  const nd = await yeuCauQuyen('noi_dung.soan');
  const duong = '/quan-tri/noi-dung/moi';
  const loai = chu(f, 'loai');
  const tieuDe = chu(f, 'tieuDe');
  const mang = docMang(f);
  const seoTrangId = chu(f, 'seoTrangId') || null;
  const canDuyetPhapLy = f.get('canDuyetPhapLy') === 'on';
  const hanCapNhat = phanTichNgay(chu(f, 'hanCapNhat'));

  if (!LOAI_HOP_LE.has(loai)) veLai(duong, 'Loại nội dung không hợp lệ.', true);
  if (!tieuDe) veLai(duong, 'Tiêu đề không được để trống.', true);
  if (hanCapNhat === undefined) veLai(duong, 'Hạn cập nhật không hợp lệ.', true);

  let taoId: string | null = null;
  let loi: string | null = null;

  try {
    const kq = await prisma.$transaction(async (tx) => {
      if (seoTrangId) {
        const trang = await tx.seoTrang.findUnique({
          where: { id: seoTrangId },
          select: { id: true, noiDungId: true, duongDan: true },
        });
        if (!trang) throw new LoiNghiepVu('Trang SEO đã chọn không tồn tại.');
        if (trang.noiDungId) throw new LoiNghiepVu(`Trang SEO ${trang.duongDan} đã gắn nội dung khác.`);
      }

      const moi = await tx.noiDung.create({
        data: {
          loai: loai as LoaiNoiDung,
          tieuDe,
          mang,
          trangThai: 'NHAP',
          bienTapId: nd.id,
          canDuyetPhapLy,
          hanCapNhat,
        },
      });

      if (seoTrangId) {
        const gan = await tx.seoTrang.updateMany({
          where: { id: seoTrangId, noiDungId: null },
          data: { noiDungId: moi.id },
        });
        if (gan.count !== 1) {
          throw new LoiNghiepVu('Trang SEO vừa được gắn cho nội dung khác, vui lòng chọn lại.');
        }
      }

      await ghiNhatKy(
        tx,
        nd,
        'nd.tao',
        'NoiDung',
        moi.id,
        undefined,
        { loai: moi.loai, tieuDe: moi.tieuDe, mang: moi.mang, seoTrangId },
      );

      return moi.id;
    });
    taoId = kq;
  } catch (e) {
    loi = thongBaoLoi(e, 'Không tạo được mục nội dung mới.');
  }

  if (loi || !taoId) veLai(duong, loi ?? 'Không tạo được mục nội dung mới.', true);

  revalidatePath('/quan-tri/noi-dung');
  if (seoTrangId) revalidatePath('/quan-tri/seo/trang');
  veLai(`/quan-tri/noi-dung/${taoId}`, `Đã tạo “${tieuDe}” ở trạng thái Nháp.`);
}

// ---------- Lưu phiên bản & Khôi phục ----------

export async function luuPhienBan(f: FormData) {
  const nd = await yeuCauQuyen('noi_dung.soan');
  const id = chu(f, 'id');
  if (!id) veLai('/quan-tri/noi-dung', 'Thiếu mã nội dung.', true);
  const quayVe = `/quan-tri/noi-dung/${id}`;

  const khoi = docKhoiTuForm(f);
  const than = vanBanGiuDong(f, 'than').trim();
  const ghiChu = chu(f, 'ghiChu') || null;

  let loi: string | null = null;
  let bao = '';

  try {
    const kq = await prisma.$transaction(async (tx) => {
      return luuPhienBanTrongTx(tx, nd, id, { khoi, than, ghiChu });
    });

    const phan = [`Đã lưu phiên bản v${kq.soMoi} (điểm onpage ${kq.diem}/100).`];
    if (kq.trangThaiMoi !== kq.trangThaiCu) {
      phan.push(`Trạng thái chuyển sang ${kq.trangThaiMoi}.`);
    }
    if (kq.biLoai.length > 0) {
      phan.push(
        `Phát hiện mã đoạn bịa (${kq.biLoai.map((m) => `[D:${m}]`).join(', ')}): đoạn không tồn tại hoặc là nội bộ.`,
      );
    }
    bao = phan.join(' ');
  } catch (e) {
    loi = thongBaoLoi(e, 'Không lưu được phiên bản mới.');
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath('/quan-tri/noi-dung');
  revalidatePath(quayVe);
  veLai(quayVe, bao);
}

export async function khoiPhucPhienBan(f: FormData) {
  const nd = await yeuCauQuyen('noi_dung.soan');
  const id = chu(f, 'id');
  const phienBanId = chu(f, 'phienBanId');
  if (!id || !phienBanId) veLai('/quan-tri/noi-dung', 'Thiếu mã nội dung hoặc phiên bản.', true);
  const quayVe = `/quan-tri/noi-dung/${id}`;

  let loi: string | null = null;
  let bao = '';

  try {
    const kq = await prisma.$transaction(async (tx) => {
      const pbCu = await tx.noiDungPhienBan.findUnique({
        where: { id: phienBanId },
        select: { id: true, noiDungId: true, so: true, khoi: true, than: true },
      });
      if (!pbCu || pbCu.noiDungId !== id) {
        throw new LoiNghiepVu('Không tìm thấy phiên bản cần khôi phục.');
      }

      const khoiCu = pbCu.khoi && typeof pbCu.khoi === 'object' && !Array.isArray(pbCu.khoi)
        ? (pbCu.khoi as KhoiMuc)
        : null;
      const res = await luuPhienBanTrongTx(tx, nd, id, {
        khoi: khoiCu,
        than: pbCu.than ?? '',
        ghiChu: `Khôi phục từ phiên bản v${pbCu.so}`,
        khoiPhucTuSo: pbCu.so,
      });
      return { ...res, tuSo: pbCu.so };
    });

    bao = `Đã khôi phục v${kq.tuSo} thành phiên bản mới v${kq.soMoi} (điểm ${kq.diem}/100).`;
    if (kq.biLoai.length > 0) {
      bao += ` Mã đoạn bịa (${kq.biLoai.map((m) => `[D:${m}]`).join(', ')}): đoạn không tồn tại hoặc là nội bộ.`;
    }
  } catch (e) {
    loi = thongBaoLoi(e, 'Không khôi phục được phiên bản.');
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath('/quan-tri/noi-dung');
  revalidatePath(quayVe);
  veLai(quayVe, bao);
}

// ---------- Chuyển trạng thái ----------

export async function chuyenTrangThai(f: FormData) {
  const nd = await yeuCauQuyen('noi_dung.xem');
  const id = chu(f, 'id');
  const den = chu(f, 'den');
  if (!id) veLai('/quan-tri/noi-dung', 'Thiếu mã nội dung.', true);
  const quayVe = `/quan-tri/noi-dung/${id}`;

  if (!TRANG_THAI_HOP_LE.has(den)) veLai(quayVe, 'Trạng thái đích không hợp lệ.', true);
  if (den === 'AI_SOAN') veLai(quayVe, 'Chức năng AI soạn chưa bật (Đợt 2b).', true);

  let loi: string | null = null;
  let bao = '';

  try {
    const kq = await prisma.$transaction(async (tx) => {
      const noiDung = await tx.noiDung.findUnique({
        where: { id },
        include: {
          trang: { select: { id: true, ngayXuatBan: true } },
          phienBan: { orderBy: { so: 'desc' }, take: 1 },
          duyet: true,
          aiViec: { orderBy: { taoLuc: 'desc' }, take: 1, select: { trangThai: true } },
        },
      });
      if (!noiDung) throw new LoiNghiepVu('Không tìm thấy mục nội dung.');

      const pbCuoi = noiDung.phienBan[0] ?? null;
      const duyetHopLe: Duyet[] = noiDung.duyet.map((d) => ({
        phienBanId: d.phienBanId,
        vaiTro: d.vaiTro,
        ketLuan: d.ketLuan,
        nguoiDuyetId: d.nguoiDuyetId,
      }));

      const nguCanh: NguCanhChuyen = {
        nguoiId: nd.id,
        coQuyen: (q) => coQuyen(nd.vaiTro, q),
        phienBan: pbCuoi
          ? {
              id: pbCuoi.id,
              nguonTao: (pbCuoi.nguonTao as 'TAY' | 'AI' | 'NHAP_CU') || 'TAY',
              soLoiChan: demLoiChan(noiDung.loai, pbCuoi.kiemTra),
            }
          : null,
        aiDatTrichDan: noiDung.aiViec[0]?.trangThai === 'XONG',
        chuyenGiaId: noiDung.chuyenGiaId,
        canDuyetPhapLy: noiDung.canDuyetPhapLy,
        duyet: duyetHopLe,
      };

      const kiem = kiemChuyen(noiDung.trangThai, den as TrangThaiNoiDung, nguCanh);
      if (!kiem.duoc) throw new LoiNghiepVu(kiem.lyDo);

      const luc = new Date();
      let noindexSau: boolean | null = null;

      if (den === 'DA_XUAT_BAN' && pbCuoi) {
        await tx.noiDung.update({
          where: { id },
          data: {
            trangThai: 'DA_XUAT_BAN',
            phienBanXuatBanId: pbCuoi.id,
            ngayXuatBan: luc,
          },
        });

        if (noiDung.trang) {
          noindexSau = phaiNoindex(pbCuoi.id, duyetHopLe);
          await tx.seoTrang.update({
            where: { id: noiDung.trang.id },
            data: {
              trangThai: 'XUAT_BAN',
              noindex: noindexSau,
              ngayXuatBan: noiDung.trang.ngayXuatBan ?? luc,
              ngayCapNhatNoiDung: luc,
            },
          });
        }
      } else {
        await tx.noiDung.update({
          where: { id },
          data: { trangThai: den as TrangThaiNoiDung },
        });
      }

      await ghiNhatKy(
        tx,
        nd,
        'nd.chuyen_trang_thai',
        'NoiDung',
        id,
        {
          trangThai: noiDung.trangThai,
          phienBanXuatBanId: noiDung.phienBanXuatBanId,
        },
        {
          trangThai: den,
          ...(den === 'DA_XUAT_BAN' && pbCuoi
            ? { phienBanXuatBanId: pbCuoi.id, seoNoindex: noindexSau }
            : {}),
        },
      );

      return { truoc: noiDung.trangThai, sau: den, noindexSau };
    });

    bao = `Đã chuyển trạng thái từ ${kq.truoc} sang ${kq.sau}.`;
    if (kq.sau === 'DA_XUAT_BAN' && kq.noindexSau !== null) {
      bao += ` Trang SEO gắn kèm đặt XUAT_BAN, noindex=${kq.noindexSau}.`;
    }
  } catch (e) {
    loi = thongBaoLoi(e, 'Không chuyển được trạng thái.');
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath('/quan-tri/noi-dung');
  revalidatePath(quayVe);
  revalidatePath('/quan-tri/seo/trang');
  veLai(quayVe, bao);
}

// ---------- Giao chuyên gia ----------

export async function giaoChuyenGia(f: FormData) {
  const nd = await yeuCauQuyen('noi_dung.soan');
  const id = chu(f, 'id');
  const chuyenGiaId = chu(f, 'chuyenGiaId') || null;
  if (!id) veLai('/quan-tri/noi-dung', 'Thiếu mã nội dung.', true);
  const quayVe = `/quan-tri/noi-dung/${id}`;

  let loi: string | null = null;
  let bao = '';

  try {
    const kq = await prisma.$transaction(async (tx) => {
      const noiDung = await tx.noiDung.findUnique({ where: { id } });
      if (!noiDung) throw new LoiNghiepVu('Không tìm thấy mục nội dung.');

      let tenCg: string | null = null;
      if (chuyenGiaId) {
        const cg = await tx.taiKhoan.findFirst({
          where: {
            id: chuyenGiaId,
            dangHoatDong: true,
            vaiTro: { has: 'CHUYEN_GIA_DUYET' },
            ...(noiDung.mang.length > 0 ? { mangDuyet: { hasSome: noiDung.mang } } : {}),
          },
          select: { id: true, hoTen: true, email: true, mangDuyet: true },
        });
        if (!cg) {
          throw new LoiNghiepVu('Chuyên gia không hợp lệ, đang khóa hoặc không phụ trách mảng của mục này.');
        }
        if (noiDung.mang.length === 0) {
          throw new LoiNghiepVu('Mục nội dung chưa gắn mảng nên không khớp mảng duyệt của chuyên gia.');
        }
        tenCg = cg.hoTen;
      }

      await tx.noiDung.update({
        where: { id },
        data: { chuyenGiaId },
      });

      await ghiNhatKy(
        tx,
        nd,
        'nd.giao_chuyen_gia',
        'NoiDung',
        id,
        { chuyenGiaId: noiDung.chuyenGiaId },
        { chuyenGiaId },
      );

      return tenCg;
    });

    bao = kq ? `Đã giao chuyên gia ${kq}.` : 'Đã bỏ giao chuyên gia.';
  } catch (e) {
    loi = thongBaoLoi(e, 'Không cập nhật được chuyên gia duyệt.');
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath('/quan-tri/noi-dung');
  revalidatePath(quayVe);
  veLai(quayVe, bao);
}

// ---------- Duyệt chuyên môn & Duyệt pháp lý ----------

export async function duyetNoiDung(f: FormData) {
  const nd = await yeuCauQuyen('noi_dung.duyet');
  const id = chu(f, 'id');
  const ketLuan = chu(f, 'ketLuan');
  const nhanXet = vanBanGiuDong(f, 'nhanXet').trim() || null;
  if (!id) veLai('/quan-tri/noi-dung', 'Thiếu mã nội dung.', true);
  const quayVe = `/quan-tri/noi-dung/${id}`;

  if (!KET_LUAN_HOP_LE.has(ketLuan)) veLai(quayVe, 'Kết luận duyệt không hợp lệ.', true);

  let loi: string | null = null;
  let bao = '';

  try {
    const kq = await prisma.$transaction(async (tx) => {
      const noiDung = await tx.noiDung.findUnique({
        where: { id },
        include: {
          phienBan: { orderBy: { so: 'desc' }, take: 1 },
          duyet: true,
        },
      });
      if (!noiDung) throw new LoiNghiepVu('Không tìm thấy mục nội dung.');
      if (noiDung.chuyenGiaId !== nd.id) {
        throw new LoiNghiepVu('Chỉ chuyên gia được giao mới có quyền duyệt mục này.');
      }

      const pbCuoi = noiDung.phienBan[0] ?? null;
      if (!pbCuoi) throw new LoiNghiepVu('Mục này chưa có phiên bản nào để duyệt.');

      const banDuyet = await tx.noiDungDuyet.create({
        data: {
          noiDungId: id,
          phienBanId: pbCuoi.id,
          vaiTro: 'CHUYEN_GIA',
          nguoiDuyetId: nd.id,
          ketLuan: ketLuan as KetLuanDuyet,
          nhanXet,
        },
      });

      const den: TrangThaiNoiDung = ketLuan === 'DONG_Y' ? 'DA_DUYET' : 'CAN_SUA';
      const duyetHopLe: Duyet[] = [...noiDung.duyet, banDuyet].map((d) => ({
        phienBanId: d.phienBanId,
        vaiTro: d.vaiTro,
        ketLuan: d.ketLuan,
        nguoiDuyetId: d.nguoiDuyetId,
      }));

      const nguCanh: NguCanhChuyen = {
        nguoiId: nd.id,
        coQuyen: (q) => coQuyen(nd.vaiTro, q),
        phienBan: {
          id: pbCuoi.id,
          nguonTao: (pbCuoi.nguonTao as 'TAY' | 'AI' | 'NHAP_CU') || 'TAY',
          soLoiChan: demLoiChan(noiDung.loai, pbCuoi.kiemTra),
        },
        chuyenGiaId: noiDung.chuyenGiaId,
        canDuyetPhapLy: noiDung.canDuyetPhapLy,
        duyet: duyetHopLe,
      };

      const kiem = kiemChuyen(noiDung.trangThai, den, nguCanh);
      if (!kiem.duoc) throw new LoiNghiepVu(kiem.lyDo);

      await tx.noiDung.update({
        where: { id },
        data: {
          trangThai: den,
          ...(den === 'DA_DUYET' ? { ngayDuyetChuyenGia: new Date() } : {}),
        },
      });

      await ghiNhatKy(
        tx,
        nd,
        'nd.duyet',
        'NoiDung',
        id,
        { trangThai: noiDung.trangThai },
        {
          trangThai: den,
          phienBanId: pbCuoi.id,
          soPhienBan: pbCuoi.so,
          vaiTro: 'CHUYEN_GIA',
          ketLuan,
          nhanXet,
        },
      );

      return { den, so: pbCuoi.so };
    });

    bao = `Đã ghi nhận duyệt phiên bản v${kq.so}, trạng thái chuyển sang ${kq.den}.`;
  } catch (e) {
    loi = thongBaoLoi(e, 'Không lưu được kết quả duyệt.');
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath('/quan-tri/noi-dung');
  revalidatePath(quayVe);
  veLai(quayVe, bao);
}

export async function duyetPhapLy(f: FormData) {
  const nd = await yeuCauQuyen('noi_dung.duyet');
  const id = chu(f, 'id');
  const ketLuan = chu(f, 'ketLuan');
  const nhanXet = vanBanGiuDong(f, 'nhanXet').trim() || null;
  if (!id) veLai('/quan-tri/noi-dung', 'Thiếu mã nội dung.', true);
  const quayVe = `/quan-tri/noi-dung/${id}`;

  if (!nd.vaiTro.includes('QUAN_TRI')) {
    veLai(quayVe, 'Chỉ tài khoản Quản trị mới ghi duyệt pháp lý.', true);
  }
  if (!KET_LUAN_HOP_LE.has(ketLuan)) veLai(quayVe, 'Kết luận duyệt không hợp lệ.', true);

  let loi: string | null = null;
  let bao = '';

  try {
    const so = await prisma.$transaction(async (tx) => {
      const noiDung = await tx.noiDung.findUnique({
        where: { id },
        include: { phienBan: { orderBy: { so: 'desc' }, take: 1 } },
      });
      if (!noiDung) throw new LoiNghiepVu('Không tìm thấy mục nội dung.');
      if (!noiDung.canDuyetPhapLy) throw new LoiNghiepVu('Mục này không yêu cầu duyệt pháp lý.');
      const pbCuoi = noiDung.phienBan[0] ?? null;
      if (!pbCuoi) throw new LoiNghiepVu('Mục này chưa có phiên bản nào để duyệt.');

      await tx.noiDungDuyet.create({
        data: {
          noiDungId: id,
          phienBanId: pbCuoi.id,
          vaiTro: 'PHAP_LY',
          nguoiDuyetId: nd.id,
          ketLuan: ketLuan as KetLuanDuyet,
          nhanXet,
        },
      });

      await ghiNhatKy(
        tx,
        nd,
        'nd.duyet_phap_ly',
        'NoiDung',
        id,
        undefined,
        {
          phienBanId: pbCuoi.id,
          soPhienBan: pbCuoi.so,
          vaiTro: 'PHAP_LY',
          ketLuan,
          nhanXet,
        },
      );

      return pbCuoi.so;
    });

    bao = `Đã ghi duyệt pháp lý cho phiên bản v${so}.`;
  } catch (e) {
    loi = thongBaoLoi(e, 'Không lưu được duyệt pháp lý.');
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath(quayVe);
  veLai(quayVe, bao);
}

// ---------- Cập nhật thông tin chung & gắn SeoTrang ----------

export async function capNhatThongTinNoiDung(f: FormData) {
  const nd = await yeuCauQuyen('noi_dung.soan');
  const id = chu(f, 'id');
  if (!id) veLai('/quan-tri/noi-dung', 'Thiếu mã nội dung.', true);
  const quayVe = `/quan-tri/noi-dung/${id}`;

  const tieuDe = chu(f, 'tieuDe');
  const mang = docMang(f);
  const seoTrangId = chu(f, 'seoTrangId') || null;
  const canDuyetPhapLy = f.get('canDuyetPhapLy') === 'on';
  const hanCapNhat = phanTichNgay(chu(f, 'hanCapNhat'));

  if (!tieuDe) veLai(quayVe, 'Tiêu đề không được để trống.', true);
  if (hanCapNhat === undefined) veLai(quayVe, 'Hạn cập nhật không hợp lệ.', true);

  let loi: string | null = null;
  let bao = '';

  try {
    await prisma.$transaction(async (tx) => {
      const truoc = await tx.noiDung.findUnique({
        where: { id },
        include: { trang: { select: { id: true } } },
      });
      if (!truoc) throw new LoiNghiepVu('Không tìm thấy mục nội dung.');

      let chuyenGiaIdMoi = truoc.chuyenGiaId;
      if (chuyenGiaIdMoi) {
        const cg = await tx.taiKhoan.findUnique({
          where: { id: chuyenGiaIdMoi },
          select: { mangDuyet: true, dangHoatDong: true, vaiTro: true },
        });
        const hopLe =
          cg &&
          cg.dangHoatDong &&
          cg.vaiTro.includes('CHUYEN_GIA_DUYET') &&
          mang.some((m) => cg.mangDuyet.includes(m));
        if (!hopLe) chuyenGiaIdMoi = null;
      }

      const trangCuId = truoc.trang?.id ?? null;
      if (seoTrangId !== trangCuId) {
        if (trangCuId) {
          await tx.seoTrang.updateMany({
            where: { id: trangCuId, noiDungId: id },
            data: { noiDungId: null },
          });
        }
        if (seoTrangId) {
          const gan = await tx.seoTrang.updateMany({
            where: { id: seoTrangId, noiDungId: null },
            data: { noiDungId: id },
          });
          if (gan.count !== 1) {
            throw new LoiNghiepVu('Trang SEO đã chọn không tồn tại hoặc đang gắn nội dung khác.');
          }
        }
      }

      await tx.noiDung.update({
        where: { id },
        data: {
          tieuDe,
          mang,
          canDuyetPhapLy,
          hanCapNhat,
          chuyenGiaId: chuyenGiaIdMoi,
        },
      });

      await ghiNhatKy(
        tx,
        nd,
        'nd.cap_nhat',
        'NoiDung',
        id,
        {
          tieuDe: truoc.tieuDe,
          mang: truoc.mang,
          canDuyetPhapLy: truoc.canDuyetPhapLy,
          seoTrangId: trangCuId,
          chuyenGiaId: truoc.chuyenGiaId,
        },
        {
          tieuDe,
          mang,
          canDuyetPhapLy,
          seoTrangId,
          chuyenGiaId: chuyenGiaIdMoi,
        },
      );
    });

    bao = 'Đã cập nhật thông tin chung.';
  } catch (e) {
    loi = thongBaoLoi(e, 'Không cập nhật được thông tin.');
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath('/quan-tri/noi-dung');
  revalidatePath(quayVe);
  revalidatePath('/quan-tri/seo/trang');
  veLai(quayVe, bao);
}

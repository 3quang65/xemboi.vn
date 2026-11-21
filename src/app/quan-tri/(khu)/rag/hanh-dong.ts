'use server';
// Thao tác ghi của khu RAG. Mỗi hàm tự kiểm quyền ngay dòng đầu và ghi nhật ký trong cùng giao dịch.
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { TrangThaiXinPhep } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';
import { dieuKienPhamVi, phanTichBigInt, phanTichInt } from '@/lib/rag/pham-vi';

const XIN_PHEP_HOP_LE = new Set<string>(['KHONG_CAN', 'CHUA_XIN', 'DA_GUI', 'DONG_Y', 'TU_CHOI', 'CAN_TRA_PHI']);
const TRANG_THAI_NGUON_HOP_LE = new Set<string>(['DANH_MUC', 'DANG_NAP', 'DA_NAP', 'TAM_DUNG', 'LOAI']);

const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const vanBanGiuDong = (f: FormData, k: string) => String(f.get(k) ?? '').replace(/\r\n/g, '\n').trim() || null;

function anToanQuayVe(raw: string, macDinh: string) {
  return raw.startsWith('/quan-tri/rag/') ? raw : macDinh;
}

function veLai(duong: string, bao: string, loi = false): never {
  redirect(`${duong}${duong.includes('?') ? '&' : '?'}${loi ? 'loi' : 'bao'}=${encodeURIComponent(bao)}`);
}

function dichLoiTrigger(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  const khopTrigger = msg.match(/Nguồn [^\n]+ không được để CONG_KHAI/);
  if (khopTrigger) {
    return `Không thể chuyển sang Công khai: ${khopTrigger[0]}. Chỉ nguồn pháp lý A hoặc đã được đồng ý xin phép và bỏ cờ “Chỉ dùng nội bộ” mới được Công khai.`;
  }
  if (msg.includes('23514') || msg.includes('rag_nguon_pham_vi_hop_le')) {
    return 'Vi phạm quy tắc phạm vi của cơ sở dữ liệu: chỉ nguồn pháp lý A hoặc đã đồng ý xin phép và bỏ cờ “Chỉ dùng nội bộ” mới được để Công khai.';
  }
  return 'Không lưu được thay đổi. Vui lòng kiểm tra dữ liệu và thử lại.';
}

// ---------- Nguồn RAG ----------

export async function capNhatNguon(f: FormData) {
  const nd = await yeuCauQuyen('rag.quan_ly_nguon');
  const id = phanTichInt(chu(f, 'id'));
  if (id === null) veLai('/quan-tri/rag/nguon', 'Mã nguồn không hợp lệ', true);

  const quayVe = `/quan-tri/rag/nguon/${id}`;
  const chiNoiBo = f.get('chiNoiBo') === 'on';
  const xinPhep = chu(f, 'xinPhep');
  const trangThai = chu(f, 'trangThai');
  const ghiChuPhapLy = vanBanGiuDong(f, 'ghiChuPhapLy');

  if (!XIN_PHEP_HOP_LE.has(xinPhep)) veLai(quayVe, 'Trạng thái xin phép không hợp lệ', true);
  if (!TRANG_THAI_NGUON_HOP_LE.has(trangThai)) veLai(quayVe, 'Trạng thái nạp không hợp lệ', true);

  let loi: string | null = null;
  let bao = 'Đã cập nhật nguồn.';

  try {
    const ketQua = await prisma.$transaction(async (tx) => {
      const truoc = await tx.ragNguon.findUnique({ where: { id } });
      if (!truoc) return null;

      // Không truyền phamVi vào data: trigger trg_rag_nguon_pham_vi tự tính và đồng bộ xuống rag_doan.
      const sau = await tx.ragNguon.update({
        where: { id },
        data: {
          chiNoiBo,
          xinPhep: xinPhep as TrangThaiXinPhep,
          trangThai,
          ghiChuPhapLy,
        },
      });

      await ghiNhatKy(
        tx,
        nd,
        'rag.nguon.sua',
        'RagNguon',
        id,
        {
          chiNoiBo: truoc.chiNoiBo,
          xinPhep: truoc.xinPhep,
          trangThai: truoc.trangThai,
          ghiChuPhapLy: truoc.ghiChuPhapLy,
          phamVi: truoc.phamVi,
        },
        {
          chiNoiBo: sau.chiNoiBo,
          xinPhep: sau.xinPhep,
          trangThai: sau.trangThai,
          ghiChuPhapLy: sau.ghiChuPhapLy,
          phamVi: sau.phamVi,
        },
      );
      return sau;
    });

    if (!ketQua) {
      loi = 'Không tìm thấy nguồn này.';
    } else if (!ketQua.chiNoiBo && ketQua.phamVi === 'NOI_BO') {
      bao = `Đã lưu nguồn ${ketQua.ma}. Phạm vi vẫn giữ là Nội bộ do nguồn ${ketQua.phapLy} chưa được đồng ý xin phép.`;
    } else {
      bao = `Đã lưu nguồn ${ketQua.ma} (phạm vi hiện tại: ${ketQua.phamVi === 'CONG_KHAI' ? 'Công khai' : 'Nội bộ'}).`;
    }
  } catch (e) {
    loi = dichLoiTrigger(e);
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath('/quan-tri/rag/nguon');
  revalidatePath(quayVe);
  revalidatePath('/quan-tri/rag/doan');
  veLai(quayVe, bao);
}

// ---------- Hàng đợi xử lý ----------

export async function chayLaiViec(f: FormData) {
  const nd = await yeuCauQuyen('rag.quan_ly_nguon');
  const id = phanTichBigInt(chu(f, 'id'));
  const quayVe = anToanQuayVe(chu(f, 'quayVe'), '/quan-tri/rag/hang-doi');
  if (id === null) veLai(quayVe, 'Mã việc không hợp lệ', true);

  let loi: string | null = null;
  let nguonId: number | null = null;

  try {
    const kq = await prisma.$transaction(async (tx) => {
      const truoc = await tx.ragViec.findUnique({ where: { id } });
      if (!truoc) return { loi: 'Không tìm thấy việc xử lý này.' };
      if (truoc.trangThai !== 'LOI') return { loi: 'Chỉ việc đang ở trạng thái Lỗi mới bấm Chạy lại được.' };

      const sau = await tx.ragViec.update({
        where: { id },
        data: {
          trangThai: 'CHO',
          soLanThu: 0,
          loi: null,
          batDauLuc: null,
          ketThucLuc: null,
          nhanBoi: null,
        },
      });
      await ghiNhatKy(
        tx,
        nd,
        'rag.viec.chay_lai',
        'RagViec',
        id,
        { trangThai: truoc.trangThai, soLanThu: truoc.soLanThu },
        { trangThai: sau.trangThai, soLanThu: sau.soLanThu },
      );
      return { loi: null, nguonId: sau.nguonId };
    });

    loi = kq.loi;
    nguonId = kq.nguonId ?? null;
  } catch {
    loi = 'Không đặt lại được việc này. Vui lòng thử lại.';
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath('/quan-tri/rag/hang-doi');
  if (nguonId !== null) revalidatePath(`/quan-tri/rag/nguon/${nguonId}`);
  veLai(quayVe, `Đã đưa việc #${String(id)} về trạng thái Chờ chạy.`);
}

export async function huyViec(f: FormData) {
  const nd = await yeuCauQuyen('rag.quan_ly_nguon');
  const id = phanTichBigInt(chu(f, 'id'));
  const quayVe = anToanQuayVe(chu(f, 'quayVe'), '/quan-tri/rag/hang-doi');
  if (id === null) veLai(quayVe, 'Mã việc không hợp lệ', true);

  let loi: string | null = null;
  let nguonId: number | null = null;

  try {
    const kq = await prisma.$transaction(async (tx) => {
      const truoc = await tx.ragViec.findUnique({ where: { id } });
      if (!truoc) return { loi: 'Không tìm thấy việc xử lý này.' };
      if (truoc.trangThai !== 'CHO' && truoc.trangThai !== 'DANG_CHAY') {
        return { loi: 'Chỉ hủy được việc đang Chờ chạy hoặc Đang chạy.' };
      }

      const sau = await tx.ragViec.update({
        where: { id },
        data: { trangThai: 'HUY', ketThucLuc: new Date() },
      });
      await ghiNhatKy(
        tx,
        nd,
        'rag.viec.huy',
        'RagViec',
        id,
        { trangThai: truoc.trangThai },
        { trangThai: sau.trangThai },
      );
      return { loi: null, nguonId: sau.nguonId };
    });

    loi = kq.loi;
    nguonId = kq.nguonId ?? null;
  } catch {
    loi = 'Không hủy được việc này. Vui lòng thử lại.';
  }

  if (loi) veLai(quayVe, loi, true);

  revalidatePath('/quan-tri/rag/hang-doi');
  if (nguonId !== null) revalidatePath(`/quan-tri/rag/nguon/${nguonId}`);
  veLai(quayVe, `Đã hủy việc #${String(id)}.`);
}

// ---------- Sửa đoạn ----------

export async function suaDoan(f: FormData) {
  const nd = await yeuCauQuyen('rag.sua_doan');
  const id = phanTichBigInt(chu(f, 'id'));
  if (id === null) veLai('/quan-tri/rag/doan', 'Mã đoạn không hợp lệ', true);

  const quayVe = `/quan-tri/rag/doan/${String(id)}`;
  const vanBanChuan = vanBanGiuDong(f, 'vanBanChuan');
  const hanViet = vanBanGiuDong(f, 'hanViet');
  const dichVi = vanBanGiuDong(f, 'dichVi');
  const daSoat = f.get('daSoat') === 'on';

  let loi: string | null = null;
  let khongDoi = false;

  try {
    const kq = await prisma.$transaction(async (tx) => {
      // Ép điều kiện phạm vi cả lúc ghi để tài khoản thiếu rag.xem_noi_bo không thể sửa đoạn NOI_BO.
      const truoc = await tx.ragDoan.findFirst({
        where: { AND: [{ id }, dieuKienPhamVi(nd)] },
      });
      if (!truoc) return { loi: 'Không tìm thấy đoạn hoặc bạn không có quyền truy cập đoạn này.' };

      const thayDoi: { truong: string; cu: string; moi: string }[] = [];
      if ((truoc.vanBanChuan ?? '') !== (vanBanChuan ?? '')) {
        thayDoi.push({ truong: 'van_ban_chuan', cu: truoc.vanBanChuan ?? '', moi: vanBanChuan ?? '' });
      }
      if ((truoc.hanViet ?? '') !== (hanViet ?? '')) {
        thayDoi.push({ truong: 'han_viet', cu: truoc.hanViet ?? '', moi: hanViet ?? '' });
      }
      if ((truoc.dichVi ?? '') !== (dichVi ?? '')) {
        thayDoi.push({ truong: 'dich_vi', cu: truoc.dichVi ?? '', moi: dichVi ?? '' });
      }
      const doiSoat = truoc.daSoat !== daSoat;
      if (thayDoi.length === 0 && doiSoat) {
        thayDoi.push({ truong: 'da_soat', cu: String(truoc.daSoat), moi: String(daSoat) });
      }

      if (thayDoi.length === 0) {
        return { loi: null, khongDoi: true };
      }

      for (const td of thayDoi) {
        await tx.ragDoanSua.create({
          data: {
            doanId: id,
            truong: td.truong,
            truoc: td.cu,
            sau: td.moi,
            nguoiSuaId: nd.id,
          },
        });
      }

      const sau = await tx.ragDoan.update({
        where: { id },
        data: {
          vanBanChuan,
          hanViet,
          dichVi,
          daSoat,
          phienBan: { increment: 1 },
        },
      });

      await ghiNhatKy(
        tx,
        nd,
        'rag.doan.sua',
        'RagDoan',
        id,
        {
          vanBanChuan: truoc.vanBanChuan,
          hanViet: truoc.hanViet,
          dichVi: truoc.dichVi,
          daSoat: truoc.daSoat,
          phienBan: truoc.phienBan,
        },
        {
          vanBanChuan: sau.vanBanChuan,
          hanViet: sau.hanViet,
          dichVi: sau.dichVi,
          daSoat: sau.daSoat,
          phienBan: sau.phienBan,
          cacTruongSua: thayDoi.map((t) => t.truong),
        },
      );

      return { loi: null, khongDoi: false };
    });

    loi = kq.loi;
    khongDoi = Boolean(kq.khongDoi);
  } catch {
    loi = 'Không lưu được bản sửa đoạn. Vui lòng thử lại.';
  }

  if (loi) veLai(quayVe, loi, true);
  if (khongDoi) veLai(quayVe, 'Không có nội dung nào thay đổi.');

  revalidatePath('/quan-tri/rag/doan');
  revalidatePath(quayVe);
  veLai(quayVe, 'Đã lưu bản sửa đoạn và ghi nhật ký.');
}

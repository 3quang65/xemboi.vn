// Nhãn tiếng Việt, kiểu kiểm tra, phân tích JSON kiểm tra, cắt preview Google và diff dòng cho khu Nội dung.
import type { LoaiNoiDung, TrangThaiNoiDung } from '@prisma/client';
import type { LoiNoiDung } from '@/lib/noi-dung/khoi';

export function ThongBao({ bao, loi }: { bao?: string; loi?: string }) {
  if (loi) return <div className="qt-bao loi" role="alert">{loi}</div>;
  if (bao) return <div className="qt-bao" role="status">{bao}</div>;
  return null;
}

export const TEN_LOAI_NOI_DUNG: Record<LoaiNoiDung, string> = {
  MUC_TU_DIEN: 'Mục từ điển',
  BAI: 'Bài kiến thức',
  CONG_CU: 'Trang công cụ',
  NGUON_SACH: 'Nguồn sách',
  PHUONG_PHAP: 'Phương pháp',
  HUB: 'Trang chủ đề (Hub)',
};

export const DS_LOAI_NOI_DUNG: LoaiNoiDung[] = [
  'MUC_TU_DIEN',
  'BAI',
  'CONG_CU',
  'NGUON_SACH',
  'PHUONG_PHAP',
  'HUB',
];

export const TEN_TRANG_THAI_ND: Record<TrangThaiNoiDung, string> = {
  NHAP: 'Nháp',
  AI_SOAN: 'AI soạn',
  BIEN_TAP: 'Biên tập',
  CHO_CHUYEN_GIA: 'Chờ chuyên gia',
  CAN_SUA: 'Cần sửa',
  DA_DUYET: 'Đã duyệt',
  DA_XUAT_BAN: 'Đã xuất bản',
  CAN_CAP_NHAT: 'Cần cập nhật',
  LUU_TRU: 'Lưu trữ',
};

export const DS_TRANG_THAI_ND: TrangThaiNoiDung[] = [
  'NHAP',
  'AI_SOAN',
  'BIEN_TAP',
  'CHO_CHUYEN_GIA',
  'CAN_SUA',
  'DA_DUYET',
  'DA_XUAT_BAN',
  'CAN_CAP_NHAT',
  'LUU_TRU',
];

export const TEN_NUT_CHUYEN: Record<TrangThaiNoiDung, string> = {
  NHAP: 'Đưa về Nháp',
  AI_SOAN: 'AI soạn',
  BIEN_TAP: 'Chuyển sang Biên tập',
  CHO_CHUYEN_GIA: 'Gửi duyệt',
  CAN_SUA: 'Yêu cầu sửa',
  DA_DUYET: 'Duyệt',
  DA_XUAT_BAN: 'Xuất bản',
  CAN_CAP_NHAT: 'Đánh dấu cần cập nhật',
  LUU_TRU: 'Lưu trữ',
};

/** Khớp danh sách chuyển tiếp hợp lệ trong src/lib/noi-dung/quy-trinh.ts. */
export const SAU_TRANG_THAI: Record<TrangThaiNoiDung, TrangThaiNoiDung[]> = {
  NHAP: ['AI_SOAN', 'BIEN_TAP', 'LUU_TRU'],
  AI_SOAN: ['BIEN_TAP', 'NHAP', 'LUU_TRU'],
  BIEN_TAP: ['CHO_CHUYEN_GIA', 'AI_SOAN', 'LUU_TRU'],
  CHO_CHUYEN_GIA: ['DA_DUYET', 'CAN_SUA', 'BIEN_TAP'],
  CAN_SUA: ['BIEN_TAP', 'LUU_TRU'],
  DA_DUYET: ['DA_XUAT_BAN', 'BIEN_TAP'],
  DA_XUAT_BAN: ['CAN_CAP_NHAT', 'LUU_TRU'],
  CAN_CAP_NHAT: ['BIEN_TAP', 'LUU_TRU'],
  LUU_TRU: ['NHAP'],
};

/** 18 mảng theo docs/v2/07b-phan-loai-huyen-hoc.md. */
export const TEN_MANG: Record<string, string> = {
  A: 'Lịch và thời gian',
  B: 'Can chi – Ngũ hành – Con giáp',
  C: 'Tử vi Đẩu số',
  D: 'Bát tự / Tứ trụ',
  E: 'Xem ngày giờ',
  F: 'Xem tuổi',
  G: 'Phong thủy',
  H: 'Kinh Dịch',
  I: 'Xin xăm',
  J: 'Thần số học',
  K: 'Chiêm tinh phương Tây',
  L: 'Tarot',
  M: 'Tướng số',
  N: 'Đặt tên con',
  O: 'Giải mộng',
  P: 'Văn khấn và phong tục',
  Q: 'Human Design',
  R: 'Nền tảng và khác',
};

export const MA_MANG_HOP_LE = Object.keys(TEN_MANG);

export const TEN_VAI_TRO_DUYET: Record<string, string> = {
  BIEN_TAP: 'Biên tập',
  CHUYEN_GIA: 'Chuyên gia',
  PHAP_LY: 'Pháp lý',
};

export const TEN_KET_LUAN_DUYET: Record<string, string> = {
  DONG_Y: 'Đồng ý',
  YEU_CAU_SUA: 'Yêu cầu sửa',
  TU_CHOI: 'Từ chối',
};

export const TEN_KIEU_TRICH: Record<string, string> = {
  NGUYEN_VAN: 'Nguyên văn',
  DICH: 'Dịch',
  TOM_Y: 'Tóm ý',
  THAM_KHAO: 'Tham khảo',
};

export const TEN_NGUON_TAO: Record<string, string> = {
  TAY: 'Biên tập tay',
  AI: 'AI soạn',
  NHAP_CU: 'Nhập từ bản cũ',
};

export function nhanTrangThaiNd(tt: string) {
  const lop =
    tt === 'DA_XUAT_BAN' || tt === 'DA_DUYET'
      ? 'tot'
      : tt === 'CAN_SUA' || tt === 'CAN_CAP_NHAT'
        ? 'xau'
        : tt === 'CHO_CHUYEN_GIA' || tt === 'BIEN_TAP'
          ? 'vua'
          : '';
  return <span className={`qt-nhan ${lop}`}>{TEN_TRANG_THAI_ND[tt as TrangThaiNoiDung] ?? tt}</span>;
}

export function nhanDiemOnpage(diem: number | null | undefined) {
  if (diem == null) return <span className="qt-nhan">–</span>;
  const lop = diem >= 80 ? 'tot' : diem >= 55 ? 'vua' : 'xau';
  return <span className={`qt-nhan ${lop}`}>{diem}/100</span>;
}

export function ngayGio(d: Date | string | null | undefined) {
  if (!d) return '–';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '–';
  return dt.toLocaleString('vi-VN');
}

export function ngayNgan(d: Date | string | null | undefined) {
  if (!d) return '–';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return '–';
  return dt.toLocaleDateString('vi-VN');
}

export type KetQuaOnpageLuu = {
  diem: number;
  loi: LoiNoiDung[];
  chan: boolean;
  chanIndex: boolean;
};

export type KetQuaTrichDanLuu = {
  dat: boolean;
  loi: LoiNoiDung[];
  maHopLe: { doanId: string; khoi: string | null }[];
};

export type KiemTraLuu = {
  onpage?: KetQuaOnpageLuu;
  trichDan?: KetQuaTrichDanLuu;
};

export function docKiemTra(raw: unknown): KiemTraLuu {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return raw as KiemTraLuu;
}

/** Đếm số lỗi chặn của một phiên bản theo kết quả lưu trong kiemTra. */
export function demLoiChan(loai: LoaiNoiDung, raw: unknown): number {
  const kt = docKiemTra(raw);
  const loiOnpage = kt.onpage?.loi ?? [];
  const soChanOnpage = loiOnpage.filter((l) => l.muc === 'CHAN').length;
  if (loai === 'MUC_TU_DIEN' || loai === 'BAI') return soChanOnpage;
  const loiTd = kt.trichDan?.loi ?? [];
  return soChanOnpage + loiTd.filter((l) => l.muc === 'CHAN').length;
}

/** Cắt title theo bề rộng ước tính tối đa (mặc định 580 px). */
export function catTitleTheoBeRong(title: string, doRong: (s: string) => number, toiDaPx = 580): { chu: string; biCat: boolean } {
  const sach = title.trim();
  if (!sach || doRong(sach) <= toiDaPx) return { chu: sach, biCat: false };
  const chars = [...sach];
  let cuoi = chars.length;
  while (cuoi > 1 && doRong(chars.slice(0, cuoi).join('').trimEnd() + '…') > toiDaPx) {
    cuoi -= 1;
  }
  return { chu: chars.slice(0, cuoi).join('').trimEnd() + '…', biCat: true };
}

export function catMeta(meta: string, toiDa = 158): { chu: string; biCat: boolean } {
  const sach = meta.trim();
  if (sach.length <= toiDa) return { chu: sach, biCat: false };
  return { chu: sach.slice(0, toiDa - 1).trimEnd() + '…', biCat: true };
}

export type DongDiff = { loai: 'giu' | 'xoa' | 'them'; noiDung: string };

/** Diff theo dòng dùng LCS đơn giản, tự rút gọn nếu văn bản quá lớn. */
export function diffTheoDong(cu: string, moi: string): DongDiff[] {
  const a = cu.replace(/\r\n/g, '\n').split('\n');
  const b = moi.replace(/\r\n/g, '\n').split('\n');
  if (a.length === 1 && a[0] === '' && b.length === 1 && b[0] === '') return [];

  // Rút gọn tiền tố và hậu tố giống nhau để giảm kích thước bảng DP.
  let dau = 0;
  while (dau < a.length && dau < b.length && a[dau] === b[dau]) dau += 1;
  let cuoiA = a.length - 1;
  let cuoiB = b.length - 1;
  while (cuoiA >= dau && cuoiB >= dau && a[cuoiA] === b[cuoiB]) {
    cuoiA -= 1;
    cuoiB -= 1;
  }

  const kq: DongDiff[] = [];
  for (let i = 0; i < dau; i += 1) kq.push({ loai: 'giu', noiDung: a[i] });

  const midA = a.slice(dau, cuoiA + 1);
  const midB = b.slice(dau, cuoiB + 1);

  if (midA.length * midB.length > 250_000) {
    for (const d of midA) kq.push({ loai: 'xoa', noiDung: d });
    for (const d of midB) kq.push({ loai: 'them', noiDung: d });
  } else if (midA.length || midB.length) {
    const m = midA.length;
    const n = midB.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i -= 1) {
      for (let j = n - 1; j >= 0; j -= 1) {
        dp[i][j] = midA[i] === midB[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    let i = 0;
    let j = 0;
    while (i < m && j < n) {
      if (midA[i] === midB[j]) {
        kq.push({ loai: 'giu', noiDung: midA[i] });
        i += 1;
        j += 1;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        kq.push({ loai: 'xoa', noiDung: midA[i] });
        i += 1;
      } else {
        kq.push({ loai: 'them', noiDung: midB[j] });
        j += 1;
      }
    }
    while (i < m) {
      kq.push({ loai: 'xoa', noiDung: midA[i] });
      i += 1;
    }
    while (j < n) {
      kq.push({ loai: 'them', noiDung: midB[j] });
      j += 1;
    }
  }

  for (let i = cuoiA + 1; i < a.length; i += 1) kq.push({ loai: 'giu', noiDung: a[i] });
  return kq;
}

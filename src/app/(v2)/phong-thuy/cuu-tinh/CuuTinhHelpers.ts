import {
  TRICH_CUU_TINH,
  NAM_CUU_TINH_DEN,
  NAM_CUU_TINH_TU,
  NAM_TRANG_CUU_TINH,
  cungCuaSao,
  saoSo,
  type NamCuuTinh,
} from '@/lib/trang/cuu-tinh';
import type { MacDinhTrang, ThamSoMau, ThongTinTrang } from '@/lib/trang/meta';

export const GOC_SITE = 'https://xemboi.vn';
export const MAU_SEO_CUU_TINH_NAM = '/phong-thuy/cuu-tinh/{nam}';

export const MAC_DINH_CUU_TINH: MacDinhTrang = {
  title: 'Cửu tinh năm, tháng: sao nào bay tới phương nào',
  h1: 'Cửu tinh năm, tháng',
  description:
    'Tra Cửu tinh (Tử bạch) theo năm và 12 tháng tiết: sao vào trung cung, vị trí 9 sao ở 9 phương. Tính theo Hiệp kỷ biện phương thư, trích nguyên văn.',
};

export const PHU_CUU_TINH =
  'Sao nào vào trung cung, bay tới phương nào theo năm và 12 tháng tiết, trích nguyên văn Hiệp kỷ biện phương thư.';

/** Thứ tự 9 cung theo Lạc thư đặt Nam ở trên: hàng trên Tốn-Ly-Khôn, giữa Chấn-Trung-Đoài, dưới Cấn-Khảm-Càn. */
export const THU_TU_LUOI_LAC_THU = [4, 9, 2, 3, 5, 7, 8, 1, 6] as const;

export const BON_SAO_HIEP_KY = [1, 6, 8, 9] as const;

export const TRICH_DAN_CUU_TINH = [
  {
    khoa: 'lacThu',
    nhan: 'Vị trí gốc của 9 sao',
    trich: TRICH_CUU_TINH.lacThu,
  },
  {
    khoa: 'thuanBo',
    nhan: 'Cách bay: thuận bố cửu cung',
    trich: TRICH_CUU_TINH.thuanBo,
  },
  {
    khoa: 'saoNam',
    nhan: 'Sao năm',
    trich: TRICH_CUU_TINH.saoNam,
  },
  {
    khoa: 'saoThang',
    nhan: 'Sao tháng',
    trich: TRICH_CUU_TINH.saoThang,
  },
  {
    khoa: 'tenVaHanh',
    nhan: 'Tên và hành của 9 sao',
    trich: TRICH_CUU_TINH.tenVaHanh,
  },
] as const;

export function tenViTriCung(c: {
  ten: string;
  phuong: string;
  soLacThu: number;
}): string {
  if (c.soLacThu === 5) return 'Trung cung (Giữa nhà)';
  return `${c.phuong} (${c.ten})`;
}

export function macDinhCuuTinhNam(data: NamCuuTinh): MacDinhTrang {
  const saoTrung = saoSo(data.ban.trung);
  const phuongNguHoang = tenViTriCung(cungCuaSao(data.ban, 5));
  return {
    title: `Cửu tinh năm ${data.nam}: sao bay 9 phương, 12 tháng`,
    h1: `Cửu tinh năm ${data.nam} (${data.canChi})`,
    description: `Cửu tinh năm ${data.nam} (${data.canChi}): ${saoTrung.ten} vào trung cung, Ngũ hoàng ở ${phuongNguHoang}; bàn 12 tháng tiết kèm ngày đổi tháng. Tính theo Hiệp kỷ biện phương thư.`,
  };
}

export function thamSoCuuTinhNam(data: NamCuuTinh): ThamSoMau {
  return {
    nam: data.nam,
    canChi: data.canChi,
    'sao trung': saoSo(data.ban.trung).ten,
    phương: tenViTriCung(cungCuaSao(data.ban, 5)),
  };
}

/** Định dạng Date (UTC) sang giờ Việt Nam (UTC+7): "dd/mm/yyyy hh:mm". */
export function dinhDangNgayGioVN(d: Date): string {
  const v = new Date(d.getTime() + 7 * 3600_000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(v.getUTCDate())}/${pad(v.getUTCMonth() + 1)}/${v.getUTCFullYear()} ${pad(v.getUTCHours())}:${pad(v.getUTCMinutes())}`;
}

export function phanTichNamCuuTinh(raw: string): number | null {
  if (!/^\d{4}$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= NAM_CUU_TINH_TU && n <= NAM_CUU_TINH_DEN
    ? n
    : null;
}

export function phanTichNamTrangRieng(raw: string): number | null {
  if (!/^\d{4}$/.test(raw)) return null;
  const n = Number(raw);
  return NAM_TRANG_CUU_TINH.includes(n) ? n : null;
}

export function tenThangTiet(thang: number): string {
  return thang === 1 ? 'Tháng giêng' : `Tháng ${thang}`;
}

/** Lớp điểm nhấn màu theo đúng tên màu của sao (bạch, hắc, bích, lục, hoàng, xích, tử). */
export function lopMauSao(so: number): string {
  switch (so) {
    case 1:
    case 6:
    case 8:
      return 'ck-pt-ct-mau-bach';
    case 2:
      return 'ck-pt-ct-mau-hac';
    case 3:
      return 'ck-pt-ct-mau-bich';
    case 4:
      return 'ck-pt-ct-mau-luc';
    case 5:
      return 'ck-pt-ct-mau-hoang';
    case 7:
      return 'ck-pt-ct-mau-xich';
    case 9:
      return 'ck-pt-ct-mau-tu';
    default:
      return 'ck-pt-ct-mau-bach';
  }
}

export function taoSchemaCuuTinhWebPage(
  tt: Pick<ThongTinTrang, 'title' | 'canonical' | 'description'>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: tt.title,
    url: tt.canonical,
    inLanguage: 'vi',
    ...(tt.description ? { description: tt.description } : {}),
  };
}

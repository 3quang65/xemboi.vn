import type { MacDinhTrang, ThongTinTrang } from '@/lib/trang/meta';
import {
  SO_CHU_DAO,
  SO_MASTER,
  rutGon,
  soGoc,
  thongKeSoChuDao,
  type NgaySinh,
} from '@/lib/trang/than-so-hoc';

export const GOC_SITE = 'https://xemboi.vn';
export const MAU_SEO_SO_CHU_DAO = '/than-so-hoc/so-chu-dao/{n}';
export const MAU_SEO_NAM_CA_NHAN = '/than-so-hoc/nam-ca-nhan/{n}';
export const NGAY_VI_DU: NgaySinh = { ngay: 15, thang: 8, nam: 1990 };
export const TEN_VI_DU = 'Nguyễn Văn An';

export const MAC_DINH_HUB: MacDinhTrang = {
  title: 'Thần số học: cách tính số chủ đạo, năm cá nhân, theo tên',
  h1: 'Thần số học: cách tính có giải thích',
  description:
    'Thần số học (nhân số học) cộng chữ số ngày sinh, họ tên thành các chỉ số. Cách tính từng bước, hai quy ước số chủ đạo, các điểm sách tính khác nhau.',
};

export const MAC_DINH_SO_CHU_DAO: MacDinhTrang = {
  title: 'Tính số chủ đạo online theo ngày sinh – có cách tính',
  h1: 'Tính số chủ đạo',
  description:
    'Nhập ngày sinh dương lịch để tính số chủ đạo, kèm từng bước cộng số theo hai quy ước và cách giữ số 11, 22, 33.',
};

export const MAC_DINH_BIEU_DO: MacDinhTrang = {
  title: 'Biểu đồ ngày sinh thần số học: lưới 3x3, 4 đỉnh cao',
  h1: 'Biểu đồ ngày sinh',
  description:
    'Vẽ biểu đồ ngày sinh 3x3, đếm số có và thiếu, các hàng đủ và trống (mũi tên), tính 4 đỉnh cao theo tuổi. Từng bước tính, ghi rõ quy ước.',
};

export const MAC_DINH_THEO_TEN: MacDinhTrang = {
  title: 'Thần số học theo tên: bảng chữ cái tiếng Việt',
  h1: 'Thần số học theo tên',
  description:
    'Quy đổi họ tên tiếng Việt sang số theo bảng Pythagoras: chỉ số tên, linh hồn (nguyên âm), nhân cách (phụ âm). Tính ngay trên máy bạn, không gửi tên đi.',
};

export function macDinhSoChuDao(n: number): MacDinhTrang {
  return {
    title: `Số chủ đạo ${n}: cách tính, ngày sinh nào ra số ${n}`,
    h1: `Số chủ đạo ${n}`,
    description: `Số chủ đạo ${n} trong thần số học: tổng chữ số nào ra ${n}, ví dụ ngày sinh, tỉ lệ ngày sinh 1930–2030 ra số ${n} theo hai cách tính.`,
  };
}

export function macDinhNamCaNhan(n: number): MacDinhTrang {
  return {
    title: `Năm cá nhân ${n}: cách tính, ngày sinh nào rơi vào số ${n}`,
    h1: `Năm cá nhân ${n}`,
    description: `Năm cá nhân ${n} trong thần số học: cộng ngày, tháng sinh với năm đang xét; bảng ngày sinh có năm cá nhân ${n} trong năm nay và năm sau.`,
  };
}

export type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

export function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export function kiemCoThamSo(sp: Record<string, string | string[] | undefined>): boolean {
  return Object.values(sp).some((v) =>
    Array.isArray(v)
      ? v.some((item) => item.trim() !== '')
      : typeof v === 'string' && v.trim() !== '',
  );
}

let cachedThongKe: ReturnType<typeof thongKeSoChuDao> | null = null;

export function layThongKeSoChuDao() {
  if (!cachedThongKe) cachedThongKe = thongKeSoChuDao();
  return cachedThongKe;
}

export function dinhDangSo(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

export function dinhDangTiLe(dem: number, tong: number): string {
  return `${((dem / tong) * 100).toFixed(1).replace('.', ',')}%`;
}

export function laSoMaster(n: number): boolean {
  return (SO_MASTER as readonly number[]).includes(n);
}

export function laSoChuDaoHopLe(n: number): boolean {
  return (SO_CHU_DAO as readonly number[]).includes(n);
}

/** Nối chuỗi bước rút gọn: vd [33] -> "33 → giữ nguyên", [39, 12, 3] -> "39 → 12 → 3". */
export function dinhDangBuoc(buoc: number[], giu: readonly number[] = SO_MASTER): string {
  const chuoi = buoc.join(' → ');
  const cuoi = buoc[buoc.length - 1];
  return cuoi !== undefined && giu.includes(cuoi) ? `${chuoi} → giữ nguyên` : chuoi;
}

/** Bước rút từng phần ngày/tháng/năm ở cách 2 (giữ 11, 22). */
export function dinhDangBuocPhan(n: number): string {
  return dinhDangBuoc(rutGon(n, [11, 22]).buoc, [11, 22]);
}

export function serializeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

export function taoSchemaCollectionPage(
  tt: Pick<ThongTinTrang, 'title' | 'canonical' | 'description'>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: tt.title,
    url: tt.canonical,
    inLanguage: 'vi',
    ...(tt.description ? { description: tt.description } : {}),
  };
}

export function taoSchemaWebApplication(
  tt: Pick<ThongTinTrang, 'title' | 'canonical' | 'description'>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tt.title,
    url: tt.canonical,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    inLanguage: 'vi',
    ...(tt.description ? { description: tt.description } : {}),
  };
}

export function taoSchemaDefinedTermSoChuDao(n: number, canonical: string) {
  const moTa = laSoMaster(n)
    ? `Tổng chữ số ngày sinh dương lịch rút gọn ra ${n} và giữ nguyên, không rút về ${soGoc(n)}.`
    : `Tổng chữ số ngày sinh dương lịch rút gọn ra ${n}.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: `Số chủ đạo ${n}`,
    description: moTa,
    url: canonical,
    inDefinedTermSet: `${GOC_SITE}/than-so-hoc/so-chu-dao`,
  };
}

export function taoSchemaDefinedTermNamCaNhan(n: number, canonical: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: `Năm cá nhân ${n}`,
    description: `Tổng chữ số ngày sinh, tháng sinh và năm đang xét rút gọn về ${n}.`,
    url: canonical,
    inDefinedTermSet: `${GOC_SITE}/than-so-hoc`,
  };
}

export function taoSchemaWebPage(
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

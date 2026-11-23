import type { MacDinhTrang, ThamSoMau, ThongTinTrang } from '@/lib/trang/meta';
import { boChuHan } from '@/lib/trang/chu-viet';
import {
  BAT_CUNG,
  DU_NIEN_8,
  NGUYEN,
  cungTheoTen,
  type CungBatTrach,
} from '@/lib/trang/phong-thuy';

export function lamSachChuHanDauCau(s: string): string {
  const k = boChuHan(s);
  return k ? k.charAt(0).toLocaleUpperCase('vi-VN') + k.slice(1) : '';
}

export const GOC_SITE = 'https://xemboi.vn';
export const MAU_SEO_CUNG = '/phong-thuy/cung-phi/{cung}';
export const URL_BAT_TRACH = `${GOC_SITE}/phong-thuy/bat-trach`;
export const NAM_PT_TU = 1900;
export const NAM_PT_DEN = 2100;

export const MAC_DINH_HUB: MacDinhTrang = {
  title: 'Phong thủy Bát trạch: cung phi, 8 du niên, hướng nhà có nguồn',
  h1: 'Phong thủy có nguồn sách',
  description:
    'Phong thủy dương trạch theo phép Bát trạch: tính cung phi theo năm sinh, bảng 8 du niên, xem hướng nhà theo 24 sơn. Trích sách Hiệp kỷ biện phương thư, không bán vật phẩm.',
};

export const MAC_DINH_CUNG_PHI: MacDinhTrang = {
  title: 'Tra cung phi bát trạch theo năm sinh nam, nữ',
  h1: 'Tra cung phi bát trạch',
  description:
    'Tính cung phi theo năm sinh âm lịch và giới tính: Đông tứ mệnh hay Tây tứ mệnh, 4 phương cát, 4 phương hung. Cách tính tam nguyên ghi rõ, trích sách Hiệp kỷ.',
};

export const MAC_DINH_BAT_TRACH: MacDinhTrang = {
  title: 'Bát trạch: 8 du niên theo cung phi, cách lập có nguồn',
  h1: 'Bát trạch: 8 hướng theo cung phi',
  description:
    'Bảng 8 du niên bát trạch (Sinh khí, Thiên y, Diên niên, Phục vị và 4 du niên hung) cho 8 cung, cách lập bằng biến hào, trích sách Hiệp kỷ biện phương thư.',
};

export const MAC_DINH_HUONG_NHA: MacDinhTrang = {
  title: 'Hướng nhà hợp tuổi: tra theo độ la bàn và cung phi',
  h1: 'Hướng nhà hợp tuổi',
  description:
    'Nhập độ la bàn của hướng nhà để biết sơn, quái, Đông hay Tây tứ trạch; ghép với cung phi theo năm sinh để xem phương đó ứng du niên nào. Cách tính ghi rõ.',
};

export function macDinhCung(c: CungBatTrach): MacDinhTrang {
  return {
    title: `Cung ${c.ten} trong bát trạch: hướng tốt, năm sinh`,
    h1: `Cung ${c.ten} (bát trạch)`,
    description: `Cung phi ${c.ten} thuộc ${c.nhom} tứ mệnh, hành ${c.hanh}. Các năm sinh nam, nữ có cung ${c.ten} và 8 phương du niên theo Hiệp kỷ biện phương thư.`,
  };
}

export function thamSoCung(c: CungBatTrach): ThamSoMau {
  return {
    cung: c.slug,
    Tên: c.ten,
    tên: c.ten.toLowerCase(),
    'Đông/Tây': c.nhom,
    Hành: c.hanh,
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

export function phanTichNam(raw: string): number | null {
  if (!/^\d{4}$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= NAM_PT_TU && n <= NAM_PT_DEN ? n : null;
}

export function phanTichGioiTinh(raw: string | undefined): 'nam' | 'nu' | null {
  if (raw === 'nam' || raw === 'nu') return raw;
  return null;
}

export function phanTichDo(raw: string): number | null {
  const chuan = raw.replace(',', '.').trim();
  if (!/^\d+(?:\.\d+)?$/.test(chuan)) return null;
  const v = Number(chuan);
  if (!Number.isFinite(v) || v < 0 || v >= 360) return null;
  return v;
}

export function dinhDangDo(d: number): string {
  const r = Math.round(d * 10) / 10;
  const chuan = r >= 360 ? 0 : r;
  return `${String(chuan).replace('.', ',')}°`;
}

export const CUNG_DONG_TU: CungBatTrach[] = ['Khảm', 'Ly', 'Chấn', 'Tốn'].map(
  (ten) => cungTheoTen(ten)!,
);

export const CUNG_TAY_TU: CungBatTrach[] = ['Càn', 'Khôn', 'Cấn', 'Đoài'].map(
  (ten) => cungTheoTen(ten)!,
);

/** 8 cung xếp theo chiều kim đồng hồ từ chính Bắc (dùng cho bảng khoảng độ 24 sơn). */
export const CUNG_THEO_CHIEU_KIM: CungBatTrach[] = [
  'Khảm',
  'Cấn',
  'Chấn',
  'Tốn',
  'Ly',
  'Khôn',
  'Đoài',
  'Càn',
].map((ten) => cungTheoTen(ten)!);

/** Bảng 3 nguyên kèm cung khởi theo Cửu cung kiến trạch (quyển 35, tờ 9b). */
export const NGUYEN_KHOI = [
  { ...NGUYEN[0], namKhoi: '1 Khảm', nuKhoi: '5 trung' },
  { ...NGUYEN[1], namKhoi: '4 Tốn', nuKhoi: '2 Khôn' },
  { ...NGUYEN[2], namKhoi: '7 Đoài', nuKhoi: '8 Cấn' },
] as const;

export const NUT_HUONG_NHANH = [
  { ten: 'Bắc', do: 0 },
  { ten: 'Đông Bắc', do: 45 },
  { ten: 'Đông', do: 90 },
  { ten: 'Đông Nam', do: 135 },
  { ten: 'Nam', do: 180 },
  { ten: 'Tây Nam', do: 225 },
  { ten: 'Tây', do: 270 },
  { ten: 'Tây Bắc', do: 315 },
] as const;

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

export function taoSchemaDefinedTermSetBatTrach(
  tt: Pick<ThongTinTrang, 'h1' | 'canonical'>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: tt.h1,
    url: tt.canonical,
    inLanguage: 'vi',
    hasDefinedTerm: DU_NIEN_8.map((d) => ({
      '@type': 'DefinedTerm',
      name: d.ten,
      additionalType: d.cat ? 'Cát' : 'Hung',
    })),
  };
}

export function taoSchemaDefinedTermCung(
  cung: CungBatTrach,
  canonical: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: `Cung ${cung.ten}`,
    url: canonical,
    inDefinedTermSet: URL_BAT_TRACH,
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

export { BAT_CUNG };

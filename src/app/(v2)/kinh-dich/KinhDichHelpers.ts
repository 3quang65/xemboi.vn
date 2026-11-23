import {
  bang64,
  duongDanQue,
  KHAC_BAN,
  tenViTriHao,
  type QuaiChiTiet,
} from '@/lib/trang/chu-dich';
import type { Que } from '@/lib/trang/kinh-dich';
import type { MacDinhTrang, ThamSoMau, ThongTinTrang } from '@/lib/trang/meta';

export const GOC_SITE = 'https://xemboi.vn';
export const MAU_SEO_QUE = '/kinh-dich/que/{nn}-{ten}';
export const MAU_SEO_QUAI = '/kinh-dich/bat-quai/{quai}';
export const URL_64_QUE = `${GOC_SITE}/kinh-dich/64-que`;

export const MAC_DINH_HUB: MacDinhTrang = {
  title: 'Kinh Dịch: 64 quẻ nguyên văn, bát quái và gieo quẻ',
  h1: 'Kinh Dịch: 64 quẻ và cách gieo',
  description:
    '64 quẻ, mỗi quẻ 6 hào, ghép từ 2 trong 8 quái; nguyên văn lời quẻ, lời hào theo bản Chu Dịch Kanripo.',
};

export const MAC_DINH_64_QUE: MacDinhTrang = {
  title: '64 quẻ Kinh Dịch: bảng tên, ký hiệu, quái trên dưới',
  h1: '64 quẻ Kinh Dịch',
  description:
    'Danh sách 64 quẻ Kinh Dịch theo thứ tự Văn Vương và bảng tra 8 × 8 theo quái trên, quái dưới.',
};

/** Tách slug quẻ dạng "03-thuy-loi-truan" tại dấu gạch đầu tiên. */
export function tachSlugQue(slug: string): { nn: string; ten: string } {
  const i = slug.indexOf('-');
  if (i <= 0) return { nn: '', ten: slug };
  return { nn: slug.slice(0, i), ten: slug.slice(i + 1) };
}

/** Tham số điền mẫu SeoTrang cho trang quẻ (/kinh-dich/que/{nn}-{ten}). */
export function thamSoQue(que: Que): ThamSoMau {
  const { nn, ten } = tachSlugQue(que.slug);
  return {
    nn,
    ten,
    'Tên đầy đủ': que.ten,
    'tên đầy đủ': que.ten.toLowerCase(),
    Tên: que.tenNgan,
    tên: que.tenNgan.toLowerCase(),
    số: String(que.so),
    n: String(que.so),
  };
}

/** Tham số điền mẫu SeoTrang cho trang quái (/kinh-dich/bat-quai/{quai}). */
export function thamSoQuai(quai: QuaiChiTiet): ThamSoMau {
  return {
    quai: quai.slug,
    Tên: quai.ten,
    Quái: quai.ten,
    quái: quai.ten.toLowerCase(),
  };
}

export function macDinhQue(que: Que): MacDinhTrang {
  return {
    title: `Quẻ ${que.ten} (${que.so}) – Kinh Dịch: nguyên văn lời quẻ, lời hào`,
    h1: `Quẻ ${que.ten}`,
    description: `Quẻ số ${que.so} ${que.ten}: hình 6 hào, nguyên văn lời quẻ và 6 hào theo Chu Dịch Kanripo, cùng quẻ hỗ, quẻ đảo và quẻ đối.`,
  };
}

export function macDinhQuai(quai: QuaiChiTiet): MacDinhTrang {
  return {
    title: `Quái ${quai.ten} trong bát quái: tượng, tính, phương theo Thuyết quái`,
    h1: `Quái ${quai.ten}`,
    description: `Quái ${quai.ten} (${quai.tuong}): hình 3 hào, trích nguyên văn thiên Thuyết quái và danh sách các quẻ có quái ${quai.ten}.`,
  };
}

/**
 * Lọc ghi chú khác bản cho lời quẻ ("quẻ từ") hoặc một vị trí hào Hán (vd "六五").
 */
export function khacBanTheoViTri(ds: typeof KHAC_BAN, viTriCanTim: string) {
  if (ds.length === 0) return [];
  const khoa =
    viTriCanTim === 'quẻ từ'
      ? 'quẻ từ'
      : tenViTriHao(viTriCanTim).toLowerCase();
  return ds.filter((k) => k.viTri.toLowerCase() === khoa);
}

export function serializeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
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

export function taoSchemaDefinedTermSet64(
  tt: Pick<ThongTinTrang, 'h1' | 'canonical'>,
  ds64: ReturnType<typeof bang64>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: tt.h1,
    url: tt.canonical,
    inLanguage: 'vi',
    hasDefinedTerm: ds64.map((x) => ({
      '@type': 'DefinedTerm',
      name: x.que.ten,
      alternateName: x.han,
      url: `${GOC_SITE}${duongDanQue(x.que)}`,
    })),
  };
}

export function taoSchemaDefinedTerm(
  ten: string,
  han: string,
  canonical: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: ten,
    alternateName: han,
    url: canonical,
    inDefinedTermSet: URL_64_QUE,
  };
}

let bang64Cache: ReturnType<typeof bang64> | null = null;

/** Tra nhanh dòng bang64 (gồm kyHieu, han) theo số Văn Vương 1..64. */
export function thongTinNganTheoSo(so: number) {
  if (!bang64Cache) bang64Cache = bang64();
  return bang64Cache[so - 1];
}

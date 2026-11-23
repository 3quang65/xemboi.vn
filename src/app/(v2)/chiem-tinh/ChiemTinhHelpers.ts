import type { Metadata } from 'next';
import {
  CUNG_HOANG_DAO,
  TEN_LOAI,
  duongDanCung,
  khoangCungTrongNam,
  type CungHoangDao,
  type HanhTinh,
  type LoaiCung,
  type NgayGioVN,
  type TrichAnh,
} from '@/lib/trang/chiem-tinh';
import type { MacDinhTrang, ThamSoMau, ThongTinTrang } from '@/lib/trang/meta';

export const GOC_SITE = 'https://xemboi.vn';
export const MAU_SEO_CUNG = '/chiem-tinh/cung-hoang-dao/{cung}';

export const BAY_HANH_TINH: readonly HanhTinh[] = [
  'Mặt Trời',
  'Mặt Trăng',
  'Sao Thủy',
  'Sao Kim',
  'Sao Hỏa',
  'Sao Mộc',
  'Sao Thổ',
];

export const THU_TU_LOAI: readonly LoaiCung[] = [
  'chi',
  'phan',
  'co-dinh',
  'song-the',
];

export const MAC_DINH_HUB: MacDinhTrang = {
  title: 'Chiêm tinh: 12 cung hoàng đạo theo Tetrabiblos, tra cung',
  h1: 'Chiêm tinh học',
  description:
    'Chiêm tinh phương Tây theo Tetrabiblos của Ptolemy: 12 cung hoàng đạo, nhà của hành tinh, tam hợp, vượng và hãm. Tra cung theo ngày giờ sinh.',
};

export const MAC_DINH_CUNG_HOANG_DAO: MacDinhTrang = {
  title: '12 cung hoàng đạo: ngày sinh, tra cung',
  h1: '12 cung hoàng đạo',
  description:
    'Tra cung hoàng đạo theo ngày giờ sinh dương lịch, giờ chuyển cung tính theo kinh độ Mặt Trời. Bảng 12 cung: ngày bắt đầu, hành tinh chủ nhà.',
};

export const MAC_DINH_BAN_DO_SAO: MacDinhTrang = {
  title: 'Bản đồ sao cá nhân miễn phí tiếng Việt',
  h1: 'Bản đồ sao',
  description:
    'Lập bản đồ sao cá nhân theo ngày, giờ, nơi sinh: vị trí hành tinh, cung mọc, 12 nhà. Nguồn lịch thiên văn ghi rõ.',
};

/** Thêm U+FE0E để ký hiệu thiên thể/cung luôn vẽ dạng chữ, không thành emoji. */
export function kyHieuChu(s: string): string {
  return s.endsWith('\uFE0E') ? s : `${s}\uFE0E`;
}

export function macDinhCung(c: CungHoangDao, khoang: string): MacDinhTrang {
  return {
    title: `Cung ${c.ten}: ngày sinh, hành tinh chủ nhà theo sách`,
    h1: `Cung ${c.ten}`,
    description: `Cung ${c.ten}: Mặt Trời vào cung khoảng ${khoang}, giờ chuyển cung từng năm, hành tinh chủ nhà, tam hợp theo Tetrabiblos. Không phán tính cách.`,
  };
}

export function lamSachChuAnhMeta(s: string): string {
  return s
    .replace(/:\s*natal chart\b/gi, '')
    .replace(/\s*\(natal chart\)/gi, (_m, _off, str) =>
      /cá nhân/i.test(str) ? '' : ' cá nhân',
    )
    .replace(/\bnatal chart\b/gi, 'bản đồ sao cá nhân')
    .replace(/:\s*tên tiếng Anh,\s*/gi, ': ')
    .replace(/,\s*tên tiếng Anh(?=[,.:;]|$)/gi, '')
    .replace(/,\s*tên tiếng Anh\s+/gi, ', ')
    .replace(
      /\s*\((?:Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces|Ascendant|Midheaven)\)/gi,
      '',
    )
    .replace(/\(\s*\)/g, '')
    .replace(/\s+([,.:;])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function lamSachMetaChiemTinh(meta: Metadata): Metadata {
  const title =
    typeof meta.title === 'string'
      ? lamSachChuAnhMeta(meta.title)
      : meta.title && typeof meta.title === 'object' && 'absolute' in meta.title
        ? { ...meta.title, absolute: lamSachChuAnhMeta(String(meta.title.absolute)) }
        : meta.title;
  const description =
    typeof meta.description === 'string'
      ? lamSachChuAnhMeta(meta.description)
      : meta.description;
  const openGraph = meta.openGraph
    ? {
        ...meta.openGraph,
        title:
          typeof meta.openGraph.title === 'string'
            ? lamSachChuAnhMeta(meta.openGraph.title)
            : meta.openGraph.title,
        description:
          typeof meta.openGraph.description === 'string'
            ? lamSachChuAnhMeta(meta.openGraph.description)
            : meta.openGraph.description,
      }
    : meta.openGraph;
  return { ...meta, title, description, openGraph };
}

export function lamSachThongTinChiemTinh(tt: ThongTinTrang): ThongTinTrang {
  return {
    ...tt,
    title: lamSachChuAnhMeta(tt.title),
    h1: lamSachChuAnhMeta(tt.h1),
    description: tt.description ? lamSachChuAnhMeta(tt.description) : null,
  };
}

export type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

export function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export function kiemCoThamSo(
  sp: Record<string, string | string[] | undefined>,
): boolean {
  return Object.keys(sp).length > 0;
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Đọc chuỗi giờ "HH:MM" (từ input type="time"). Sai hoặc ngoài 00:00–23:59 thì undefined. */
export function docGio(
  s: string | undefined | null,
): { gio: number; phut: number } | undefined {
  if (!s) return undefined;
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return undefined;
  const gio = Number(m[1]);
  const phut = Number(m[2]);
  if (!Number.isInteger(gio) || !Number.isInteger(phut)) return undefined;
  if (gio < 0 || gio > 23 || phut < 0 || phut > 59) return undefined;
  return { gio, phut };
}

export function vietNgayVN(g: NgayGioVN): string {
  return `${pad2(g.ngay)}/${pad2(g.thang)}/${g.nam}`;
}

export function vietNgayThang(g: NgayGioVN): string {
  return `${pad2(g.ngay)}/${pad2(g.thang)}`;
}

export function vietGioPhut(g: NgayGioVN): string {
  return `${pad2(g.gio)}:${pad2(g.phut)}`;
}

export function formatKhoangNamNay(thu: number, namNay: number): string {
  const k = khoangCungTrongNam(thu, namNay);
  const truoc = new Date(
    Date.UTC(k.ketThuc.nam, k.ketThuc.thang - 1, k.ketThuc.ngay - 1),
  );
  return `${k.batDau.ngay}/${k.batDau.thang} – ${truoc.getUTCDate()}/${truoc.getUTCMonth() + 1}`;
}

export function thamSoSeoCung(
  c: CungHoangDao,
  namNay: number,
): ThamSoMau {
  return {
    cung: c.slug,
    Tên: c.ten,
    tên: c.ten.toLowerCase(),
    English: '',
    khoang: formatKhoangNamNay(c.thu, namNay),
  };
}

/** Cung hãm không có trichVuong riêng thì lấy câu của hành tinh đó tại cung vượng của nó. */
export function trichChoHam(ham: HanhTinh): TrichAnh | null {
  return CUNG_HOANG_DAO.find((x) => x.vuong === ham)?.trichVuong ?? null;
}

export function nhanHanhTinh(h: HanhTinh): string {
  return h;
}

export function nhanLoai(l: LoaiCung): string {
  return TEN_LOAI[l].ten;
}

export function nhanAmDuong(duong: boolean): string {
  return duong ? 'Dương (thuộc ngày)' : 'Âm (thuộc đêm)';
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
  tt: Pick<ThongTinTrang, 'title' | 'description'>,
  canonicalUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tt.title,
    url: canonicalUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    inLanguage: 'vi',
    ...(tt.description ? { description: tt.description } : {}),
  };
}

export function taoSchemaDefinedTermSet12Cung() {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: '12 cung hoàng đạo theo Tetrabiblos',
    url: `${GOC_SITE}/chiem-tinh/cung-hoang-dao`,
    inLanguage: 'vi',
    hasDefinedTerm: CUNG_HOANG_DAO.map((c) => ({
      '@type': 'DefinedTerm',
      name: `Cung ${c.ten}`,
      ...(c.tenKhac.length > 0 ? { alternateName: c.tenKhac } : {}),
      url: `${GOC_SITE}${duongDanCung(c)}`,
    })),
  };
}

export function taoSchemaDefinedTermCung(
  c: CungHoangDao,
  canonical: string,
  description: string | null,
) {
  const alternateName = Array.from(new Set(c.tenKhac));
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: `Cung ${c.ten}`,
    ...(alternateName.length > 0 ? { alternateName } : {}),
    url: canonical,
    inDefinedTermSet: `${GOC_SITE}/chiem-tinh/cung-hoang-dao`,
    ...(description ? { description } : {}),
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

// Siêu dữ liệu SEO cho trang công khai v2 (docs/v2/19 mục 1.3, 2.3).
// Nguồn: bảng SeoTrang (sửa ở /quan-tri/seo/trang). Trang chỉ được index khi XUAT_BAN và không noindex.
// Trang lập trình (vd /sinh-nam/1990) không có dòng riêng thì dùng dòng mẫu (/sinh-nam/{yyyy}) và điền tham số.
import type { Metadata } from 'next';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { GOC_SITE } from '@/lib/seo/sitemap';

export type MacDinhTrang = { title: string; description?: string; h1?: string };
export type ThamSoMau = Record<string, string | number>;

export type ThongTinTrang = {
  duongDan: string;
  title: string;
  description: string | null;
  h1: string;
  canonical: string;
  duocIndex: boolean;
  schemaJsonLd: unknown | null;
  anhChiaSe: string | null;
  /** 'rieng' = có dòng SeoTrang cho đúng đường dẫn; 'mau' = dùng dòng mẫu; 'khong' = chưa có trong SeoTrang. */
  nguon: 'rieng' | 'mau' | 'khong';
};

const CHON = { duongDan: true, title: true, metaDescription: true, h1: true, canonical: true, noindex: true, trangThai: true, schemaJsonLd: true, anhChiaSe: true } as const;

const docDong = cache(async (duongDan: string) => {
  try {
    return await prisma.seoTrang.findUnique({ where: { duongDan }, select: CHON });
  } catch {
    return null; // CSDL lỗi: trang vẫn hiện, chỉ không được index
  }
});

/** Điền {yyyy}, {chi}... vào chuỗi mẫu. Tham số thiếu thì giữ nguyên dấu ngoặc để dễ thấy lỗi. */
export function dienMau(s: string, ts: ThamSoMau = {}): string {
  return s.replace(/\{([a-z0-9_-]+)\}/gi, (m, k: string) => (k in ts ? String(ts[k]) : m));
}

export function chuanHoaDuongDan(p: string): string {
  const s = ('/' + p.trim()).replace(/\/{2,}/g, '/').replace(/[?#].*$/, '');
  return s.length > 1 ? s.replace(/\/+$/, '') : '/';
}

const tuyetDoi = (u: string) => (/^https?:\/\//.test(u) ? u : GOC_SITE + chuanHoaDuongDan(u));

/**
 * Thông tin SEO của một trang. `mau` là đường dẫn dòng mẫu trong SeoTrang (vd '/sinh-nam/{yyyy}'), `thamSo` điền vào nó.
 * Không có dòng nào thì dùng `macDinh` và trả duocIndex = false.
 */
export async function thongTinTrang(duongDan: string, macDinh: MacDinhTrang, mau?: string, thamSo?: ThamSoMau): Promise<ThongTinTrang> {
  const dd = chuanHoaDuongDan(duongDan);
  const rieng = await docDong(dd);
  const dongMau = !rieng && mau ? await docDong(chuanHoaDuongDan(mau)) : null;
  const d = rieng ?? dongMau;
  const nguon: ThongTinTrang['nguon'] = rieng ? 'rieng' : dongMau ? 'mau' : 'khong';
  if (!d && process.env.NODE_ENV !== 'production') console.warn(`[trang] ${dd} chưa có trong SeoTrang: noindex`);
  const dien = (s: string | null | undefined) => (s ? dienMau(s, thamSo) : s ?? null);
  const canonicalRieng = rieng?.canonical ? tuyetDoi(rieng.canonical) : null;
  return {
    duongDan: dd,
    title: dien(d?.title) || macDinh.title,
    description: dien(d?.metaDescription) || macDinh.description || null,
    h1: dien(d?.h1) || macDinh.h1 || macDinh.title,
    canonical: canonicalRieng ?? GOC_SITE + dd,
    duocIndex: !!d && d.trangThai === 'XUAT_BAN' && !d.noindex && !(canonicalRieng && canonicalRieng !== GOC_SITE + dd),
    schemaJsonLd: (rieng?.schemaJsonLd as unknown) ?? null,
    anhChiaSe: d?.anhChiaSe ?? null,
    nguon,
  };
}

/** Dùng trong generateMetadata của page.tsx thuộc src/app/(v2). */
export async function metaTrang(duongDan: string, macDinh: MacDinhTrang, mau?: string, thamSo?: ThamSoMau): Promise<Metadata> {
  const t = await thongTinTrang(duongDan, macDinh, mau, thamSo);
  return {
    title: { absolute: t.title },
    description: t.description ?? undefined,
    alternates: { canonical: t.canonical },
    robots: t.duocIndex ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: 'website', locale: 'vi_VN', siteName: 'XemBói.vn', url: t.canonical, title: t.title,
      description: t.description ?? undefined, ...(t.anhChiaSe ? { images: [{ url: t.anhChiaSe }] } : {}),
    },
  };
}

/** H1 của trang (cùng nguồn với title, để biên tập sửa ở một chỗ). */
export async function h1Trang(duongDan: string, macDinh: MacDinhTrang, mau?: string, thamSo?: ThamSoMau): Promise<string> {
  return (await thongTinTrang(duongDan, macDinh, mau, thamSo)).h1;
}

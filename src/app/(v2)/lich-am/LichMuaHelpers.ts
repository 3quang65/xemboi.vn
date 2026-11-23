import { hai, ngayDuongHopLe, trongPhamViNam } from '@/components/ck/lichHelpers';
import type { Hanh } from '@/lib/trang/can-chi';
import { NAM_LICH_MUA_DEN, NAM_LICH_MUA_TU } from '@/lib/trang/lich-mua';
import type { ThongTinTrang } from '@/lib/trang/meta';
import { soNgayJulius, type NgayDuong } from '@/lib/tuvi-v2/am-lich';

export type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

export const DS_NAM_LICH_MUA: number[] = Array.from(
  { length: NAM_LICH_MUA_DEN - NAM_LICH_MUA_TU + 1 },
  (_, i) => NAM_LICH_MUA_TU + i,
);

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

export function isoTuNgayDuong(d: NgayDuong): string {
  return `${d.nam}-${hai(d.thang)}-${hai(d.ngay)}`;
}

export function phanTichNgayIso(
  raw: string | undefined,
): { d: number; m: number; y: number; iso: string } | null {
  if (!raw) return null;
  const s = raw.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (!trongPhamViNam(y) || !ngayDuongHopLe(d, m, y)) return null;
  return { d, m, y, iso: `${match[1]}-${match[2]}-${match[3]}` };
}

export function phanTichNamLichMua(raw: string | undefined): number | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!/^\d{4}$/.test(s)) return null;
  const nam = Number(s);
  if (nam < NAM_LICH_MUA_TU || nam > NAM_LICH_MUA_DEN) return null;
  return nam;
}

export function kepNamLichMua(nam: number): number {
  if (nam < NAM_LICH_MUA_TU) return NAM_LICH_MUA_TU;
  if (nam > NAM_LICH_MUA_DEN) return NAM_LICH_MUA_DEN;
  return nam;
}

export function soNgayGiuaIso(tuIso: string, denIso: string): number {
  const [y1, m1, d1] = tuIso.split('-').map(Number);
  const [y2, m2, d2] = denIso.split('-').map(Number);
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 0;
  return soNgayJulius(d2, m2, y2) - soNgayJulius(d1, m1, y1);
}

export type ThongTinMuaTiet = {
  ma: 'xuan' | 'ha' | 'thu' | 'dong';
  ten: string;
  hanh: Hanh;
  hanhSlug: 'moc' | 'hoa' | 'kim' | 'thuy';
};

export function muaCuaTiet(thangTiet: number): ThongTinMuaTiet {
  if (thangTiet >= 1 && thangTiet <= 3) {
    return { ma: 'xuan', ten: 'Xuân', hanh: 'Mộc', hanhSlug: 'moc' };
  }
  if (thangTiet >= 4 && thangTiet <= 6) {
    return { ma: 'ha', ten: 'Hạ', hanh: 'Hỏa', hanhSlug: 'hoa' };
  }
  if (thangTiet >= 7 && thangTiet <= 9) {
    return { ma: 'thu', ten: 'Thu', hanh: 'Kim', hanhSlug: 'kim' };
  }
  return { ma: 'dong', ten: 'Đông', hanh: 'Thủy', hanhSlug: 'thuy' };
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

export function serializeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

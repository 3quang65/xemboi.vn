import {
  CON_GIAP,
  HOA_GIAP,
  NAM_SINH_DEN,
  NAM_SINH_TU,
  NGUON_NAP_AM,
  conGiapTheoSlug,
  namCuaHoaGiap,
  slugViet,
  type ConGiap,
  type Hanh,
  type HoaGiap,
} from '@/lib/trang/can-chi';

export const HANH_SLUG: Record<Hanh, string> = {
  Kim: 'kim',
  Mộc: 'moc',
  Thủy: 'thuy',
  Hỏa: 'hoa',
  Thổ: 'tho',
};

export const SLUG_HANH: Record<string, Hanh> = {
  kim: 'Kim',
  moc: 'Mộc',
  thuy: 'Thủy',
  hoa: 'Hỏa',
  tho: 'Thổ',
};

export const HANH_CLASS: Record<Hanh, string> = {
  Kim: 'ck-hanh-kim',
  Mộc: 'ck-hanh-moc',
  Thủy: 'ck-hanh-thuy',
  Hỏa: 'ck-hanh-hoa',
  Thổ: 'ck-hanh-tho',
};

export const HANH_MAU_HEX: Record<Hanh, string> = {
  Kim: '#5E6670',
  Mộc: '#1A7429',
  Thủy: '#102A5C',
  Hỏa: '#C8150C',
  Thổ: '#A04F00',
};

export const MAU_SAC_HEX: Record<string, string> = {
  trắng: '#F9F8F4',
  xám: '#889098',
  ghi: '#B4BAC0',
  bạc: '#D4D9DF',
  đen: '#1D1D20',
  'xanh dương': '#1F4E9E',
  'xanh nước biển': '#256DB3',
  'xanh lá': '#227C36',
  đỏ: '#C6211A',
  hồng: '#DE7792',
  cam: '#DC6B19',
  tím: '#6F3D8E',
  vàng: '#E3B93B',
  nâu: '#7E4E29',
  'vàng đất': '#B4792B',
};

/**
 * Tách riêng slug của địa chi Tỵ thành "ti" để không trùng với "ty" của Tý
 * (trong can-chi.ts chưa sửa do vùng cấm, slugViet("Tý") và slugViet("Tỵ") cùng ra "ty").
 */
export function slugConGiap(chi: string): string {
  if (chi === 'Tỵ') return 'ti';
  return slugViet(chi);
}

export function duongDanConGiap(chi: string): string {
  return `/con-giap/${slugConGiap(chi)}`;
}

export function timConGiapTheoSlug(slug: string): ConGiap | undefined {
  if (slug === 'ti') return CON_GIAP.find((c) => c.chi === 'Tỵ');
  return conGiapTheoSlug(slug);
}

export function tenConGiapTheoChi(chi: string): string {
  return CON_GIAP.find((c) => c.chi === chi)?.ten ?? chi;
}

export function duongDanHanh(h: Hanh): string {
  return `/ngu-hanh/${HANH_SLUG[h]}`;
}

export function chuoiNguonNapAm(): string {
  return NGUON_NAP_AM.join('; ');
}

export function hoaGiapLanCan(stt: number): { truoc: HoaGiap; sau: HoaGiap } {
  const idx = stt - 1;
  return {
    truoc: HOA_GIAP[(idx - 1 + 60) % 60],
    sau: HOA_GIAP[(idx + 1) % 60],
  };
}

export function conGiapLanCan(thuTu: number): { truoc: ConGiap; sau: ConGiap } {
  const idx = thuTu - 1;
  return {
    truoc: CON_GIAP[(idx - 1 + 12) % 12],
    sau: CON_GIAP[(idx + 1) % 12],
  };
}

export function namCuaConGiap(cg: ConGiap, tu = NAM_SINH_TU, den = NAM_SINH_DEN): number[] {
  return cg.hoaGiap
    .flatMap((h) => namCuaHoaGiap(h, tu, den))
    .sort((a, b) => a - b);
}

export function toViSlug(str: string): string {
  return (str || 'khach')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Encodes chart birth parameters into a deterministic, human-readable SEO permalink slug:
 * Example: "la-so-tu-vi-nguyen-van-an-1990-nam-canh-ngo-d15m06y1990g12s1l0n0v2026"
 */
export function buildChartSlug(params: {
  ten: string;
  ngay: number;
  thang: number;
  nam: number;
  gio: number;
  gt: 'nam' | 'nu' | string;
  lich?: 'duong' | 'am' | string;
  nhuan?: boolean;
  namXem?: number;
  canChiNam?: string;
}): string {
  const nameSlug = toViSlug(params.ten || 'duong-so');
  const gtSlug = params.gt === 'nu' || params.gt === 'NU' ? 'nu' : 'nam';
  const canChiSlug = params.canChiNam ? '-' + toViSlug(params.canChiNam) : '';
  const d = String(params.ngay).padStart(2, '0');
  const m = String(params.thang).padStart(2, '0');
  const y = String(params.nam);
  const g = String(params.gio).padStart(2, '0');
  const s = gtSlug === 'nam' ? '1' : '0';
  const l = params.lich === 'am' ? '1' : '0';
  const n = params.nhuan ? '1' : '0';
  const v = String(params.namXem || 2026);
  return `la-so-tu-vi-${nameSlug}-${y}-${gtSlug}${canChiSlug}-d${d}m${m}y${y}g${g}s${s}l${l}n${n}v${v}`;
}

export function parseChartSlug(slug: string): {
  ten: string;
  ngay: number;
  thang: number;
  nam: number;
  gio: number;
  gt: 'nam' | 'nu';
  lich: 'duong' | 'am';
  nhuan: boolean;
  namXem: number;
} | null {
  const match = slug.match(/-d(\d{2})m(\d{2})y(\d{4})g(\d{2})s([01])l([01])n([01])v(\d{4})$/);
  if (!match) {
    return {
      ten: 'Đương Số',
      ngay: 15,
      thang: 6,
      nam: 1990,
      gio: 12,
      gt: 'nam',
      lich: 'duong',
      nhuan: false,
      namXem: 2026,
    };
  }
  const [, d, m, y, g, s, l, n, v] = match;
  const prefix = slug
    .slice(0, slug.length - match[0].length)
    .replace(/^la-so-tu-vi-/, '')
    .replace(/-\d{4}-(nam|nu).*$/, '');
  const ten = prefix
    ? prefix
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Đương Số';
  return {
    ten,
    ngay: parseInt(d, 10),
    thang: parseInt(m, 10),
    nam: parseInt(y, 10),
    gio: parseInt(g, 10),
    gt: s === '1' ? 'nam' : 'nu',
    lich: l === '1' ? 'am' : 'duong',
    nhuan: n === '1',
    namXem: parseInt(v, 10),
  };
}

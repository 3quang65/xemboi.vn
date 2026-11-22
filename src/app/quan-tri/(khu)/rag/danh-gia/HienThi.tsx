import { MO_HINH_VIET_LAI } from '@/lib/rag/viet-lai-cau';

export const DS_MANG = [
  'tu-vi',
  'kinh-dich',
  'bat-tu',
  'chon-ngay',
  'phong-thuy',
  'ngu-hanh',
] as const;

export const TEN_MANG: Record<string, string> = {
  'tu-vi': 'Tử vi',
  'kinh-dich': 'Kinh Dịch',
  'bat-tu': 'Bát tự',
  'chon-ngay': 'Chọn ngày',
  'phong-thuy': 'Phong thủy',
  'ngu-hanh': 'Ngũ hành',
};

export const TEN_DO_KHO: Record<string, string> = {
  de: 'Dễ',
  vua: 'Vừa',
  kho: 'Khó',
};

export const LA_MA_CHINH_THUC = /^Q\d{3}$/;

export type CauHinhDg = {
  ten: string;
  nhanh: string[];
  vietLai: string | null;
  capChuCauMau: boolean;
  hitAt10: number;
  msMoiCauVector: number | null;
};

export type ChiTietCauDg = {
  ma: string;
  hang: number | null;
  recall10: number;
  dungNguonTop1: boolean;
  top5: string[];
};

export function docChiTiet(raw: unknown): ChiTietCauDg[] {
  if (!Array.isArray(raw)) return [];
  const kq: ChiTietCauDg[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    if (typeof o.ma !== 'string') continue;
    const hang = typeof o.hang === 'number' && Number.isFinite(o.hang) ? o.hang : null;
    const recall10 = typeof o.recall10 === 'number' && Number.isFinite(o.recall10) ? o.recall10 : 0;
    const dungNguonTop1 = Boolean(o.dungNguonTop1);
    const top5 = Array.isArray(o.top5) ? o.top5.map((x) => String(x)) : [];
    kq.push({ ma: o.ma, hang, recall10, dungNguonTop1, top5 });
  }
  return kq;
}

export function docCauHinh(raw: unknown, chiTiet?: ChiTietCauDg[]): CauHinhDg {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const ten = typeof o.ten === 'string' && o.ten.trim() ? o.ten.trim() : '–';
  const nhanh = Array.isArray(o.nhanh) ? o.nhanh.map((x) => String(x)) : [];
  const vietLai = typeof o.vietLai === 'string' && o.vietLai.trim() ? o.vietLai.trim() : null;
  const capChuCauMau = Boolean(o.capChuCauMau);
  const msMoiCauVector =
    typeof o.msMoiCauVector === 'number' && Number.isFinite(o.msMoiCauVector) ? o.msMoiCauVector : null;
  let hitAt10 = typeof o.hitAt10 === 'number' && Number.isFinite(o.hitAt10) ? o.hitAt10 : -1;
  if (hitAt10 < 0 && chiTiet && chiTiet.length > 0) {
    const trung = chiTiet.filter((c) => c.hang != null && c.hang <= 10).length;
    hitAt10 = trung / chiTiet.length;
  }
  if (hitAt10 < 0) hitAt10 = 0;
  return { ten, nhanh, vietLai, capChuCauMau, hitAt10, msMoiCauVector };
}

export function laDangDungVps(moHinhNhung: string, ch: CauHinhDg): boolean {
  return moHinhNhung === 'khong' && ch.vietLai === MO_HINH_VIET_LAI && !ch.capChuCauMau;
}

export function boTienToGx(s: string | null): string {
  if (!s) return '–';
  return s.replace(/^gx\//, '');
}

export function soThapPhan(n: number | null | undefined, le = 2): string {
  if (n == null || !Number.isFinite(n)) return '–';
  return n.toLocaleString('vi-VN', { minimumFractionDigits: le, maximumFractionDigits: le });
}

export function dinhDangPhanTram(n: number | null | undefined, le = 1): string {
  if (n == null || !Number.isFinite(n)) return '–';
  return `${(n * 100).toLocaleString('vi-VN', { minimumFractionDigits: le, maximumFractionDigits: le })}%`;
}

// Dữ liệu tính được cho từ điển Tử vi v2 (docs/v2/19 F4): 12 cung, 14 chính tinh, bảng miếu hãm theo 12 địa chi.
// Nguồn: bộ máy an sao src/lib/tuvi-v2/tuvi-raw.js (chuyển thể TuViMCP, Apache-2.0; quy tắc theo sách cụ Thiên Lương).
// Diễn giải ý nghĩa cung/sao lấy từ NoiDung đã duyệt, không viết ở đây.
import TuViRaw from '@/lib/tuvi-v2/tuvi-raw';
import { DIA_CHI } from '@/lib/tuvi-v2/am-lich';
import { slugViet, type Hanh } from './can-chi';

type Raw = { CUNG: string[]; SAO: Record<string, [string, string, number]>; DAC_TINH: Record<string, string> };
const raw = TuViRaw as unknown as Raw;

const HANH_MA: Record<string, Hanh> = { K: 'Kim', M: 'Mộc', T: 'Thủy', H: 'Hỏa', O: 'Thổ' };
export const TEN_DAC_TINH: Record<string, string> = { M: 'Miếu', V: 'Vượng', Đ: 'Đắc', B: 'Bình hòa', H: 'Hãm' };

export type CungTuVi = { thuTu: number; ten: string; slug: string };
/** 12 cung theo thứ tự an từ Mệnh đi nghịch (Mệnh, Phụ Mẫu, Phúc Đức...). */
export const CUNG_TU_VI: CungTuVi[] = raw.CUNG.map((ten, i) => ({ thuTu: i + 1, ten, slug: slugViet(ten) }));
export const cungTheoSlug = (slug: string) => CUNG_TU_VI.find((c) => c.slug === slug);

export type DacTinhTaiChi = { chi: string; ma: string; ten: string };
export type ChinhTinh = { key: string; ten: string; slug: string; hanh: Hanh; dacTinh: DacTinhTaiChi[]; mieuVuong: string[]; ham: string[] };

const CHINH_TINH_KEYS = Object.keys(raw.SAO).filter((k) => raw.SAO[k][2] === 1);

export const CHINH_TINH: ChinhTinh[] = CHINH_TINH_KEYS.map((key) => {
  const [ten, h] = raw.SAO[key];
  const bang = [...(raw.DAC_TINH[key] ?? '')];
  const dacTinh = DIA_CHI.map((chi, i) => ({ chi, ma: bang[i] ?? '', ten: TEN_DAC_TINH[bang[i]] ?? '' }));
  return {
    key, ten, slug: slugViet(ten), hanh: HANH_MA[h],
    dacTinh, mieuVuong: dacTinh.filter((d) => d.ma === 'M' || d.ma === 'V').map((d) => d.chi), ham: dacTinh.filter((d) => d.ma === 'H').map((d) => d.chi),
  };
});
export const chinhTinhTheoSlug = (slug: string) => CHINH_TINH.find((s) => s.slug === slug);

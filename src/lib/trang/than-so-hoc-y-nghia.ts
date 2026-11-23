// Ý nghĩa các con số thần số học: lời của Nhật Nguyệt (nhatnguyet.org) và đoạn nguyên văn sách thần số học 1905–1926.
// Dữ liệu: du-lieu/than-so-hoc-nhat-nguyet.json, sinh từ du-lieu/knowledge/numerology của repo Nhat-Nguyet (commit 708b5c3).
// Giấy phép: lời của site CC BY-NC 4.0, anh Cường cho dùng trước, xin phép sau (sổ docs/v2/14-so-giay-phep.md).
// Đoạn sách cổ: phạm vi công cộng. Từ 24/11/2026 trang chỉ hiện bản dịch tiếng Việt (`vi`, `chuongVi`, `sachVi`;
// dịch nghĩa: xemboi, du-lieu/than-so-hoc-trich-vi.json); `en`, `sach`, `chuong` giữ để đối chiếu, không hiển thị.
// Chỉ dùng ở server component (tệp JSON khoảng 160 KB).
import NN from './du-lieu/than-so-hoc-nhat-nguyet.json';
import TRICH_VI from './du-lieu/than-so-hoc-trich-vi.json';

export type ChiSoTSH = 'so-chu-dao' | 'ngay-sinh' | 'thai-do' | 'dinh-cao' | 'thach-thuc' | 'nam-ca-nhan' | 'no-nghiep';

export type LoaiLoi = 'yNghia' | 'manh' | 'yeu' | 'ngheNghiep' | 'tinhCam' | 'taiChinh' | 'sucKhoe' | 'loiNhac';

/** Nhãn hiển thị, theo đúng thứ tự nên in. */
export const NHAN_LOI: readonly { k: LoaiLoi; ten: string }[] = [
  { k: 'yNghia', ten: 'Ý nghĩa' },
  { k: 'manh', ten: 'Điểm mạnh' },
  { k: 'yeu', ten: 'Điểm yếu' },
  { k: 'ngheNghiep', ten: 'Công việc' },
  { k: 'tinhCam', ten: 'Tình cảm' },
  { k: 'taiChinh', ten: 'Tiền bạc' },
  { k: 'sucKhoe', ten: 'Sức khỏe' },
  { k: 'loiNhac', ten: 'Lời nhắc' },
];

export type TrichSach = { id: string; sach: string; sachVi: string; tacGia: string; chuong: string; en: string; vi: string; chuongVi: string };

export type YNghiaSo = {
  chiSo: ChiSoTSH;
  so: number;
  /** Tên chỉ số theo Nhật Nguyệt, vd "Số chủ đạo", và tên tiếng Anh. */
  tenChiSo: string;
  tenAnh: string;
  /** Câu tả chỉ số (giống nhau cho mọi số), nếu có. */
  moTaChiSo?: string;
  /** Lời Nhật Nguyệt theo loại, chỉ những loại có. */
  loi: { k: LoaiLoi; ten: string; vb: string }[];
  /** Đoạn sách viết riêng cho chỉ số này (hiện chỉ số chủ đạo, ngày sinh có). */
  trichRieng: TrichSach[];
  /** Đoạn sách viết về con số này nói chung, không riêng cho chỉ số. Trang phải ghi rõ như vậy. */
  trichChung: TrichSach[];
};

type Kho = {
  nguon: string; url: string;
  chiSo: Record<string, { ten: string; en: string; moTa?: string }>;
  don: Record<string, { vb: Partial<Record<LoaiLoi, string>>; rieng: string[]; chung: string[] }>;
  trich: Record<string, Omit<TrichSach, 'id'>>;
};
const KHO = NN as unknown as Kho;

export const NGUON_Y_NGHIA = { ten: 'Nhật Nguyệt', url: 'https://nhatnguyet.org', ghiCong: KHO.nguon } as const;

/**
 * Sửa lỗi nhận dạng chữ (OCR) hiển nhiên trong bản quét archive.org mà kho Nhật Nguyệt chép lại.
 * Chỉ sửa ký tự máy đọc sai (dấu phẩy thành "y", "11" thành "1 1"…), không đổi chữ của tác giả.
 * JSON giữ nguyên như nguồn; đã đối chiếu từng chỗ với ngữ cảnh câu (kiểm 23/11/2026).
 */
export const SUA_OCR: readonly (readonly [string, string])[] = [
  ['alonenessy adversity', 'aloneness, adversity'],
  ['done,, though', 'done, though'],
  ['exist,, it', 'exist, it'],
  ['enthusiasm y inspiration', 'enthusiasm, inspiration'],
  ['driving force y brings', 'driving force, brings'],
  ['ability y daring', 'ability, daring'],
  ['fioneer spirit', 'pioneer spirit'],
  ['mechanic j he', 'mechanic; he'],
  ['many iis who', 'many 11s who'],
  [' 1 1 ', ' 11 '],
  ['NicoMACHUS', 'Nicomachus'],
  ['May 2oth-27th', 'May 20th-27th'],
  ['usually.attract', 'usually attract'],
  ['consciousness, a8 in', 'consciousness, as in'],
];

const suaOcr = (s: string): string => SUA_OCR.reduce((t, [sai, dung]) => t.split(sai).join(dung), s);

const layTrich = (ids: string[]): TrichSach[] => ids.map((id) => {
  const t = KHO.trich[id];
  const d = (TRICH_VI.trich as Record<string, { vi: string; chuongVi: string }>)[id];
  return { id, ...t, en: suaOcr(t.en), vi: d.vi, chuongVi: d.chuongVi };
});

/** Ý nghĩa của số `so` ở chỉ số `chiSo`. undefined nếu kho không có (vd năm cá nhân 11). */
export function yNghia(chiSo: ChiSoTSH, so: number): YNghiaSo | undefined {
  const d = KHO.don[`${chiSo}:${so}`];
  const c = KHO.chiSo[chiSo];
  if (!d || !c) return undefined;
  return {
    chiSo, so, tenChiSo: c.ten, tenAnh: c.en, moTaChiSo: c.moTa,
    loi: NHAN_LOI.filter((n) => d.vb[n.k]).map((n) => ({ ...n, vb: d.vb[n.k]! })),
    trichRieng: layTrich(d.rieng),
    trichChung: layTrich(d.chung),
  };
}

/** Các số kho có lời hoặc đoạn trích, theo chỉ số. */
export const soCoYNghia = (chiSo: ChiSoTSH): number[] =>
  Object.keys(KHO.don).filter((k) => k.startsWith(`${chiSo}:`)).map((k) => Number(k.split(':')[1])).sort((a, b) => a - b);

/** Danh sách sách (không trùng) có đoạn được trích, để in mục nguồn. */
/** `sachVi` để hiển thị; `sach` (tên gốc tiếng Anh) chỉ để đối chiếu. */
export function sachDuocTrich(ds: TrichSach[]): { sach: string; sachVi: string; tacGia: string }[] {
  const m = new Map<string, { sachVi: string; tacGia: string }>();
  for (const t of ds) if (!m.has(t.sach)) m.set(t.sach, { sachVi: t.sachVi, tacGia: t.tacGia });
  return [...m].map(([sach, v]) => ({ sach, ...v }));
}

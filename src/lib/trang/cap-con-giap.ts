// Cặp con giáp (trang /xem-tuoi/{chi-a}-va-{chi-b}, 78 cặp kể cả cùng chi; Lệnh 48).
// Chỉ ghép các quan hệ địa chi có sách dẫn (bảng và câu trích ở bat-tu-truc-quan.ts: Tam mệnh thông hội, Hiệp kỷ).
// Không chấm điểm, không phán "hợp/không hợp" cả đời: trang nói rõ chi năm chỉ là một phần, xem kỹ bằng năm sinh.
import { DIA_CHI } from '@/lib/tuvi-v2/am-lich';
import { CON_GIAP, type ConGiap, type Hanh } from './can-chi';
import {
  HINH, LUC_HAI, LUC_HOP, TAM_HOI, TAM_HOP, TU_HINH, NHOM_CUA_LOAI, TEN_LOAI_QUAN_HE,
  type LoaiQuanHe, type MaTrichBatTu, type NhomQuanHe,
} from './bat-tu-truc-quan';

export type QuanHeCap = {
  loai: LoaiQuanHe;
  ten: string;
  nhom: NhomQuanHe;
  /** Một câu tiếng Việt mô tả quan hệ, chỉ nêu điều sách ghi. */
  cau: string;
  trich: MaTrichBatTu[];
};

export type CapConGiap = {
  a: ConGiap;
  b: ConGiap;
  slug: string;
  duongDan: string;
  cungChi: boolean;
  quanHe: QuanHeCap[];
  /** Nhóm chính để tô ô ma trận: hợp > xung > hình > hại > không. */
  nhomChinh: NhomQuanHe | 'khong';
  tomTat: string;
};

export const GHI_CHU_CAP =
  'Đây chỉ là quan hệ giữa hai địa chi của năm sinh, một trong nhiều yếu tố các sách dùng. Cùng một cặp con giáp có tới 25 cặp năm sinh khác nhau (khác can, khác nạp âm). Sách cũng dặn gặp xung, gặp hình không được vội luận là xấu. Muốn xem kỹ, nhập năm sinh cụ thể ở trang xem tuổi vợ chồng.';

const coCap = (ds: [number, number, ...unknown[]][], a: number, b: number) => ds.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const TEN_NHOM_HINH = { 'vo-an': 'hình vô ân', 'tri-the': 'hình trì thế', 'vo-le': 'hình vô lễ' } as const;

const qh = (loai: LoaiQuanHe, cau: string, trich: MaTrichBatTu[]): QuanHeCap => ({ loai, ten: TEN_LOAI_QUAN_HE[loai], nhom: NHOM_CUA_LOAI[loai], cau, trich });

/** Quan hệ giữa hai chi (0 = Tý). Thứ tự a, b không quan trọng. */
export function quanHeHaiChi(a: number, b: number): QuanHeCap[] {
  const A = DIA_CHI[a], B = DIA_CHI[b];
  const kq: QuanHeCap[] = [];
  if (a === b) {
    if (TU_HINH.includes(a)) kq.push(qh('tu-hinh', `${A} gặp ${A} là tự hình (Thìn, Ngọ, Dậu, Hợi).`, ['tuHinh', 'hinhKhongVoiDoan']));
    return kq;
  }
  const th = TAM_HOP.find(([ba]) => ba.includes(a) && ba.includes(b));
  if (th) kq.push(qh('tam-hop', `${A} và ${B} cùng nhóm tam hợp ${th[0].map((k) => DIA_CHI[k]).join(', ')} (hóa ${th[1]}). Sách ghi đủ ba chữ mới thành cục.`, ['tamHop']));
  const thoi = TAM_HOI.find(([ba]) => ba.includes(a) && ba.includes(b));
  if (thoi) kq.push({ ...qh('tam-hoi', `${A} và ${B} cùng nhóm tam hội ${thoi[0].map((k) => DIA_CHI[k]).join(', ')} (phương ${thoi[1]}).`, ['tamHoi']), nhom: 'chua-thanh' });
  if (coCap(LUC_HOP, a, b)) kq.push(qh('luc-hop', `${A} và ${B} là cặp lục hợp.`, ['lucHop', 'lucHop2']));
  if ((a - b + 12) % 12 === 6) kq.push(qh('xung', `${A} và ${B} đối nhau qua tâm vòng 12 chi: lục xung.`, ['xung', 'xungKhongVoiDoan']));
  const h = HINH.find(([x, y]) => (x === a && y === b) || (x === b && y === a));
  if (h) {
    const ma: MaTrichBatTu[] = ['hinh', ...(h[2] === 'vo-an' ? ['hinhVoAn' as const] : h[2] === 'tri-the' ? ['hinhTriThe' as const] : []), 'hinhKhongVoiDoan'];
    kq.push(qh('hinh', `${A} và ${B} thuộc ${TEN_NHOM_HINH[h[2]]}.`, ma));
  }
  if (coCap(LUC_HAI, a, b)) kq.push(qh('hai', `${A} và ${B} là cặp lục hại.`, ['hai']));
  return kq;
}

const THU_TU_NHOM: (NhomQuanHe | 'khong')[] = ['hop', 'xung', 'hinh', 'hai', 'khong'];

export const slugCap = (a: number, b: number) => {
  const [x, y] = a <= b ? [a, b] : [b, a];
  return `${CON_GIAP[x].slug}-va-${CON_GIAP[y].slug}`;
};

export function capConGiap(a: number, b: number): CapConGiap {
  const [x, y] = a <= b ? [a, b] : [b, a];
  const quanHe = quanHeHaiChi(x, y);
  // Tam hội hai chữ chỉ là cùng phương, không tính vào ô ma trận.
  const nhom = new Set<NhomQuanHe | 'khong'>(quanHe.filter((q) => q.loai !== 'tam-hoi').map((q) => q.nhom));
  const nhomChinh = THU_TU_NHOM.find((n) => nhom.has(n)) ?? 'khong';
  const A = CON_GIAP[x], B = CON_GIAP[y];
  const tenA = `tuổi ${A.chi} (${A.ten})`, tenB = `tuổi ${B.chi} (${B.ten})`;
  const tomTat = x === y
    ? (quanHe.length ? `Hai người cùng ${tenA}: ${quanHe.map((q) => q.ten.toLowerCase()).join(', ')}.` : `Hai người cùng ${tenA}: sách không xếp cặp cùng chi này vào nhóm hợp, xung, hình, hại nào.`)
    : (quanHe.length
      ? `${tenA.charAt(0).toUpperCase() + tenA.slice(1)} và ${tenB}: ${quanHe.map((q) => q.ten.toLowerCase()).join(', ')}.`
      : `${tenA.charAt(0).toUpperCase() + tenA.slice(1)} và ${tenB} không thuộc nhóm hợp, xung, hình, hại nào trong sách.`);
  const slug = slugCap(x, y);
  return { a: A, b: B, slug, duongDan: `/xem-tuoi/${slug}`, cungChi: x === y, quanHe, nhomChinh, tomTat };
}

/** Đủ 78 cặp (66 cặp khác chi + 12 cặp cùng chi), theo thứ tự Tý → Hợi. */
export function tatCaCap(): CapConGiap[] {
  const kq: CapConGiap[] = [];
  for (let a = 0; a < 12; a++) for (let b = a; b < 12; b++) kq.push(capConGiap(a, b));
  return kq;
}

/** Đọc slug "dan-va-ngo". `chuan: false` khi thứ tự đảo (trang nên chuyển 301 sang `slugChuan`). */
export function docSlugCap(slug: string): { a: number; b: number; chuan: boolean; slugChuan: string } | null {
  const m = /^([a-z]+)-va-([a-z]+)$/.exec(slug);
  if (!m) return null;
  const a = CON_GIAP.findIndex((c) => c.slug === m[1]);
  const b = CON_GIAP.findIndex((c) => c.slug === m[2]);
  if (a < 0 || b < 0) return null;
  const slugChuan = slugCap(a, b);
  return { a: Math.min(a, b), b: Math.max(a, b), chuan: slugChuan === slug, slugChuan };
}

/** Ma trận 12 × 12 cho trang chỉ mục: mỗi ô là nhóm chính và đường dẫn trang cặp. */
export function maTranCap(): { chi: string[]; o: { nhom: NhomQuanHe | 'khong'; duongDan: string; ten: string[] }[][] } {
  return {
    chi: CON_GIAP.map((c) => c.chi),
    o: CON_GIAP.map((_, a) => CON_GIAP.map((__, b) => {
      const c = capConGiap(a, b);
      return { nhom: c.nhomChinh, duongDan: c.duongDan, ten: c.quanHe.map((q) => q.ten) };
    })),
  };
}

/** 11 cặp khác của một chi, để trang cặp liên kết chéo. */
export function capKhacCua(chi: number): CapConGiap[] {
  return CON_GIAP.map((_, b) => capConGiap(chi, b)).filter((c) => !(c.a.thuTu - 1 === chi && c.b.thuTu - 1 === chi));
}

export type { Hanh };

// Dữ liệu Can chi & mệnh cho trang công khai v2 (docs/v2/19 F3): sinh năm, 60 hoa giáp, nạp âm, con giáp, ngũ hành.
// Chỉ gồm phần TÍNH ĐƯỢC (bảng tra, công thức). Diễn giải lấy từ NoiDung đã duyệt (src/lib/trang/noi-dung.ts, F5).
// Nguồn bảng nạp âm: src/lib/tuvi-v2/data/nap-am.json (Tam Mệnh Thông Hội; Tử Vi Đẩu Số Tân Biên).
import { DIA_CHI, TEN_CON_GIAP, THIEN_CAN, amSangDuong, canChiNam, soNgayJulius, tuSoNgayJulius } from '@/lib/tuvi-v2/am-lich';
import bangNapAm from '@/lib/tuvi-v2/data/nap-am.json';

export type Hanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
export const NGU_HANH: Hanh[] = ['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ']; // thứ tự tương sinh: Kim sinh Thủy sinh Mộc...
export const NGUON_NAP_AM: string[] = bangNapAm.nguon;

const SINH: Record<Hanh, Hanh> = { Kim: 'Thủy', Thủy: 'Mộc', Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim' };
const KHAC: Record<Hanh, Hanh> = { Kim: 'Mộc', Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim' };
const tim = <T,>(m: Record<Hanh, T>, v: T) => (Object.keys(m) as Hanh[]).find((k) => m[k] === v)!;

export type QuanHeHanh = { hanh: Hanh; sinhRa: Hanh; duocSinhBoi: Hanh; khac: Hanh; biKhacBoi: Hanh };
export function quanHeHanh(h: Hanh): QuanHeHanh {
  return { hanh: h, sinhRa: SINH[h], duocSinhBoi: tim(SINH, h), khac: KHAC[h], biKhacBoi: tim(KHAC, h) };
}

/** Slug không dấu: "Hải Trung Kim" → "hai-trung-kim", "Giáp Tý" → "giap-ty". */
export function slugViet(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ---------- 60 hoa giáp ----------
export type HoaGiap = { stt: number; can: string; chi: string; ten: string; slug: string; napAm: string; slugNapAm: string; hanh: Hanh; conGiap: string; amDuong: 'Dương' | 'Âm' };

export const HOA_GIAP: HoaGiap[] = bangNapAm.rows.map((r) => ({
  stt: r.stt, can: r.can, chi: r.chi, ten: r.hoaGiap, slug: slugViet(r.hoaGiap), napAm: r.napAm, slugNapAm: slugViet(r.napAm),
  hanh: r.hanh as Hanh, conGiap: TEN_CON_GIAP[DIA_CHI.indexOf(r.chi as (typeof DIA_CHI)[number])], amDuong: r.stt % 2 === 1 ? 'Dương' : 'Âm',
}));

export function hoaGiapTheoSlug(slug: string): HoaGiap | undefined {
  return HOA_GIAP.find((h) => h.slug === slug);
}

/** Các năm dương (gần đúng theo năm âm) mang can chi này trong khoảng [tu, den]. */
export function namCuaHoaGiap(h: HoaGiap, tu = 1900, den = 2100): number[] {
  const ds: number[] = [];
  for (let y = tu; y <= den; y++) if (canChiNam(y).ten === h.ten) ds.push(y);
  return ds;
}

// ---------- 30 nạp âm ----------
export type NapAm = { ten: string; slug: string; hanh: Hanh; hoaGiap: [HoaGiap, HoaGiap] };
export const NAP_AM: NapAm[] = Array.from({ length: 30 }, (_, i) => {
  const a = HOA_GIAP[2 * i], b = HOA_GIAP[2 * i + 1];
  return { ten: a.napAm, slug: a.slugNapAm, hanh: a.hanh, hoaGiap: [a, b] };
});
export const napAmTheoSlug = (slug: string) => NAP_AM.find((n) => n.slug === slug);

// ---------- 12 con giáp ----------
export type ConGiap = { chi: string; ten: string; slug: string; thuTu: number; hanhChi: Hanh; amDuong: 'Dương' | 'Âm'; hoaGiap: HoaGiap[]; tamHop: string[]; lucXung: string; lucHop: string };
const HANH_CHI: Hanh[] = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
const LUC_HOP = [1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi
export const CON_GIAP: ConGiap[] = DIA_CHI.map((chi, i) => ({
  chi, ten: TEN_CON_GIAP[i], slug: slugViet(chi), thuTu: i + 1, hanhChi: HANH_CHI[i], amDuong: i % 2 === 0 ? 'Dương' : 'Âm',
  hoaGiap: HOA_GIAP.filter((h) => h.chi === chi),
  tamHop: [i, (i + 4) % 12, (i + 8) % 12].sort((a, b) => a - b).map((k) => DIA_CHI[k]),
  lucXung: DIA_CHI[(i + 6) % 12], lucHop: DIA_CHI[LUC_HOP[i]],
}));
export const conGiapTheoSlug = (slug: string) => CON_GIAP.find((c) => c.slug === slug);

// ---------- cung phi (Bát trạch) ----------
export type CungPhi = { so: number; ten: string; hanh: Hanh; nhom: 'Đông tứ mệnh' | 'Tây tứ mệnh' };
const CUNG: Record<number, Omit<CungPhi, 'so'>> = {
  1: { ten: 'Khảm', hanh: 'Thủy', nhom: 'Đông tứ mệnh' }, 2: { ten: 'Khôn', hanh: 'Thổ', nhom: 'Tây tứ mệnh' },
  3: { ten: 'Chấn', hanh: 'Mộc', nhom: 'Đông tứ mệnh' }, 4: { ten: 'Tốn', hanh: 'Mộc', nhom: 'Đông tứ mệnh' },
  6: { ten: 'Càn', hanh: 'Kim', nhom: 'Tây tứ mệnh' }, 7: { ten: 'Đoài', hanh: 'Kim', nhom: 'Tây tứ mệnh' },
  8: { ten: 'Cấn', hanh: 'Thổ', nhom: 'Tây tứ mệnh' }, 9: { ten: 'Ly', hanh: 'Hỏa', nhom: 'Đông tứ mệnh' },
};
/**
 * Cung phi theo năm âm sinh. Nam: (11 − Y mod 9) mod 9; Nữ: (Y mod 9 + 4) mod 9; 0 → 9.
 * Số 5 không có quẻ: nam gửi Khôn (2), nữ gửi Cấn (8). Ví dụ 1990: nam Khảm, nữ Cấn; 2000: nam Ly, nữ Càn.
 */
export function cungPhi(namAm: number, gioiTinh: 'nam' | 'nu'): CungPhi {
  const r = ((namAm % 9) + 9) % 9;
  let so = gioiTinh === 'nam' ? (11 - r) % 9 : (r + 4) % 9;
  if (so === 0) so = 9;
  const that = so === 5 ? (gioiTinh === 'nam' ? 2 : 8) : so;
  return { so, ...CUNG[that] };
}

// ---------- màu theo ngũ hành ----------
// Quy ước ngũ hành – ngũ sắc phổ biến: Kim trắng/xám/ghi, Thủy đen/xanh dương, Mộc xanh lá, Hỏa đỏ/hồng/tím, Thổ vàng/nâu.
export const MAU_HANH: Record<Hanh, string[]> = {
  Kim: ['trắng', 'xám', 'ghi', 'bạc'], Thủy: ['đen', 'xanh dương', 'xanh nước biển'], Mộc: ['xanh lá'],
  Hỏa: ['đỏ', 'hồng', 'cam', 'tím'], Thổ: ['vàng', 'nâu', 'vàng đất'],
};
export type MauHopMenh = { hanh: Hanh; banMenh: string[]; tuongSinh: string[]; nenTranh: string[]; cheKhac: string[] };
/** Màu bản mệnh, màu của hành sinh ra mệnh (tương sinh), màu của hành khắc mệnh (nên tránh), màu của hành mệnh khắc. */
export function mauHopMenh(h: Hanh): MauHopMenh {
  const q = quanHeHanh(h);
  return { hanh: h, banMenh: MAU_HANH[h], tuongSinh: MAU_HANH[q.duocSinhBoi], nenTranh: MAU_HANH[q.biKhacBoi], cheKhac: MAU_HANH[q.khac] };
}

// ---------- sinh năm ----------
export const NAM_SINH_TU = 1930;
export const NAM_SINH_DEN = 2030;

export type ThongTinNamSinh = {
  nam: number; canChi: string; can: string; chi: string; conGiap: string; hoaGiap: HoaGiap;
  napAm: string; slugNapAm: string; hanh: Hanh; quanHe: QuanHeHanh;
  /** Năm âm bắt đầu từ Tết (mùng 1 tháng Giêng) và kết thúc trước Tết năm sau, ngày dương 'YYYY-MM-DD'. */
  tuNgay: string; denNgay: string;
  cungPhiNam: CungPhi; cungPhiNu: CungPhi; mau: MauHopMenh;
  tuoiAm: (namXem: number) => number;
};

const isoTu = (d: { ngay: number; thang: number; nam: number }) => `${d.nam}-${String(d.thang).padStart(2, '0')}-${String(d.ngay).padStart(2, '0')}`;

export function namSinhHopLe(nam: number): boolean {
  return Number.isInteger(nam) && nam >= NAM_SINH_TU && nam <= NAM_SINH_DEN;
}

/** Thông tin người sinh năm âm `nam`. Ném lỗi ngoài khoảng 1930–2030. */
export function namSinh(nam: number): ThongTinNamSinh {
  if (!namSinhHopLe(nam)) throw new RangeError(`Năm ngoài khoảng ${NAM_SINH_TU}–${NAM_SINH_DEN}: ${nam}`);
  const cc = canChiNam(nam);
  const hg = HOA_GIAP.find((h) => h.ten === cc.ten)!;
  const tet = amSangDuong(1, 1, nam)!;
  const tetSau = amSangDuong(1, 1, nam + 1)!;
  const truocTetSau = tuSoNgayJulius(soNgayJulius(tetSau.ngay, tetSau.thang, tetSau.nam) - 1);
  return {
    nam, canChi: cc.ten, can: THIEN_CAN[cc.can], chi: DIA_CHI[cc.chi], conGiap: TEN_CON_GIAP[cc.chi], hoaGiap: hg,
    napAm: hg.napAm, slugNapAm: hg.slugNapAm, hanh: hg.hanh, quanHe: quanHeHanh(hg.hanh),
    tuNgay: isoTu(tet), denNgay: isoTu(truocTetSau),
    cungPhiNam: cungPhi(nam, 'nam'), cungPhiNu: cungPhi(nam, 'nu'), mau: mauHopMenh(hg.hanh),
    tuoiAm: (namXem: number) => namXem - nam + 1,
  };
}

/** Danh sách năm cho trang chỉ mục /sinh-nam, nhóm theo thập kỷ. */
export function danhSachNamSinh(): { thapKy: number; nam: { nam: number; canChi: string; napAm: string; hanh: Hanh }[] }[] {
  const nhom = new Map<number, { nam: number; canChi: string; napAm: string; hanh: Hanh }[]>();
  for (let y = NAM_SINH_TU; y <= NAM_SINH_DEN; y++) {
    const cc = canChiNam(y).ten;
    const hg = HOA_GIAP.find((h) => h.ten === cc)!;
    const k = Math.floor(y / 10) * 10;
    if (!nhom.has(k)) nhom.set(k, []);
    nhom.get(k)!.push({ nam: y, canChi: cc, napAm: hg.napAm, hanh: hg.hanh });
  }
  return [...nhom].map(([thapKy, nam]) => ({ thapKy, nam }));
}

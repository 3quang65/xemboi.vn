// 10 thiên can (trang /can-chi/thien-can/{can}, Lệnh 49).
// Chỉ ghép dữ liệu tính được đã có: hành, âm dương (bat-tu.ts), ngũ hợp (CAN_HOP), thập thần (thapThan), 6 hoa giáp (HOA_GIAP),
// Tứ Hóa tử vi (tu-hoa.ts), trường sinh và lộc theo câu Tam mệnh thông hội quyển 5 (rag_doan 4611).
import { THIEN_CAN } from '@/lib/tuvi-v2/am-lich';
import { HANH_CAN, thapThan, type ThapThan } from './bat-tu';
import { CAN_HOP, type TrichDoan } from './bat-tu-truc-quan';
import { HOA_GIAP, slugViet, type HoaGiap, type Hanh } from './can-chi';
import { THAP_THAN_CHI_TIET } from './thap-than';
import { tuHoaCuaCan, type DongTuHoa } from './tu-hoa';

/** Câu sách: can nào sinh ở đâu, tử ở đâu, lộc ở đâu (theo cặp). */
export const TRICH_SINH_TU_LOC: TrichDoan = {
  nguon: 'tamMenh', doanId: 4611, viTri: '', viTriViet: 'Quyển 5 · Luận cổ nhân lập Ấn, Thực, Quan, Tài danh nghĩa',
  nguyenVan: '甲生亥死午乙生午死亥就禄於寅卯…丙生寅死酉丁生酉死寅就禄於巳午…庚生巳死子辛生子死巳就禄於申酉…壬生申死卯癸生卯死申就禄於亥子…戊生寅死酉巳生酉死寅就禄於巳午與火同位',
  dich: 'Giáp sinh ở Hợi, tử ở Ngọ; Ất sinh ở Ngọ, tử ở Hợi; lộc ở Dần Mão. Bính sinh ở Dần, tử ở Dậu; Đinh sinh ở Dậu, tử ở Dần; lộc ở Tỵ Ngọ. Canh sinh ở Tỵ, tử ở Tý; Tân sinh ở Tý, tử ở Tỵ; lộc ở Thân Dậu. Nhâm sinh ở Thân, tử ở Mão; Quý sinh ở Mão, tử ở Thân; lộc ở Hợi Tý. Mậu sinh ở Dần, tử ở Dậu; Kỷ sinh ở Dậu, tử ở Dần; lộc ở Tỵ Ngọ, cùng vị với Hỏa.',
};

// Thứ tự theo THIEN_CAN: Giáp … Quý. [sinh, tử, lộc (cặp)]
const SINH_TU_LOC: [string, string, string][] = [
  ['Hợi', 'Ngọ', 'Dần, Mão'], ['Ngọ', 'Hợi', 'Dần, Mão'], ['Dần', 'Dậu', 'Tỵ, Ngọ'], ['Dậu', 'Dần', 'Tỵ, Ngọ'],
  ['Dần', 'Dậu', 'Tỵ, Ngọ'], ['Dậu', 'Dần', 'Tỵ, Ngọ'], ['Tỵ', 'Tý', 'Thân, Dậu'], ['Tý', 'Tỵ', 'Thân, Dậu'],
  ['Thân', 'Mão', 'Hợi, Tý'], ['Mão', 'Thân', 'Hợi, Tý'],
];

export type ThienCan = {
  thuTu: number;
  ten: string;
  slug: string;
  duongDan: string;
  hanh: Hanh;
  amDuong: 'Dương' | 'Âm';
  /** Can ngũ hợp và hành hóa. */
  hop: { can: string; slug: string; hoa: Hanh };
  /** Can cách 7 vị, cùng âm dương và khắc can này (Thất sát của can này). */
  satCuaCan: string;
  sinh: string;
  tu: string;
  loc: string;
  /** Can này làm nhật chủ: 10 can gặp là thần gì. */
  thapThan: { can: string; than: ThapThan; duongDan: string }[];
  hoaGiap: HoaGiap[];
  tuHoa: DongTuHoa;
};

export const THIEN_CAN_CHI_TIET: ThienCan[] = THIEN_CAN.map((ten, i) => {
  const cap = CAN_HOP.find(([a, b]) => a === i || b === i)!;
  const h = cap[0] === i ? cap[1] : cap[0];
  const sat = THIEN_CAN.findIndex((_, x) => thapThan(i, x) === 'Thất sát');
  const [sinh, tu, loc] = SINH_TU_LOC[i];
  return {
    thuTu: i + 1, ten, slug: slugViet(ten), duongDan: `/can-chi/thien-can/${slugViet(ten)}`,
    hanh: HANH_CAN[i], amDuong: i % 2 === 0 ? 'Dương' : 'Âm',
    hop: { can: THIEN_CAN[h], slug: slugViet(THIEN_CAN[h]), hoa: cap[2] },
    satCuaCan: THIEN_CAN[sat], sinh, tu, loc,
    thapThan: THIEN_CAN.map((c, x) => {
      const than = thapThan(i, x);
      return { can: c, than, duongDan: THAP_THAN_CHI_TIET.find((t) => t.ten === than)!.duongDan };
    }),
    hoaGiap: HOA_GIAP.filter((g) => g.can === ten),
    tuHoa: tuHoaCuaCan(i + 1),
  };
});

export const thienCanTheoSlug = (slug: string) => THIEN_CAN_CHI_TIET.find((c) => c.slug === slug);

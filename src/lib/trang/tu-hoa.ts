// Tứ Hóa theo can năm (trang /tu-vi/tu-hoa, Lệnh 48).
// Bảng lấy thẳng từ bộ máy an sao (tuvi-raw.js: TU_HOA_VIET mặc định, TU_HOA_TQ theo iztro), không chép tay.
// Câu phú gốc: Tử Vi Đẩu Số toàn thư, quyển 2, "An thân mệnh lệ" (rag_doan 151, Wikisource, CC BY-SA 4.0).
// Chỗ khác nhau giữa các phái: đặc tả an sao mục 10.4 (docs/v2/tai-san-xemtuvi/docs/nghien-cuu/tuvi-an-sao-spec.md).
// Chỉ nêu sao nào hóa gì; không viết luận giải tốt xấu.
import TuViRaw from '@/lib/tuvi-v2/tuvi-raw';
import { THIEN_CAN } from '@/lib/tuvi-v2/am-lich';
import { slugViet } from './can-chi';
import { CHINH_TINH } from './tu-vi-tu-dien';

type Raw = { SAO: Record<string, [string, string, number]>; TU_HOA_VIET: (string[] | null)[]; TU_HOA_TQ: (string[] | null)[] };
const raw = TuViRaw as unknown as Raw;

export type MaHoa = 'loc' | 'quyen' | 'khoa' | 'ky';
export const BON_HOA: { ma: MaHoa; ten: string }[] = [
  { ma: 'loc', ten: 'Hóa Lộc' }, { ma: 'quyen', ten: 'Hóa Quyền' }, { ma: 'khoa', ten: 'Hóa Khoa' }, { ma: 'ky', ten: 'Hóa Kỵ' },
];

export type SaoHoa = { key: string; ten: string; /** Có trang /tu-vi/sao/{slug} khi là chính tinh. */ duongDan: string | null };
export type DongTuHoa = { canSo: number; can: string; slugCan: string; sao: Record<MaHoa, SaoHoa>; khacPhai: boolean };

const saoHoa = (key: string): SaoHoa => {
  const ten = raw.SAO[key][0];
  const ct = CHINH_TINH.find((s) => s.key === key);
  return { key, ten, duongDan: ct ? `/tu-vi/sao/${ct.slug}` : null };
};

function bang(nguon: (string[] | null)[]): DongTuHoa[] {
  return THIEN_CAN.map((can, i) => {
    const r = nguon[i + 1]!;
    const sao = Object.fromEntries(BON_HOA.map((h, k) => [h.ma, saoHoa(r[k])])) as Record<MaHoa, SaoHoa>;
    const khac = raw.TU_HOA_VIET[i + 1]!.some((x, k) => raw.TU_HOA_TQ[i + 1]![k] !== x);
    return { canSo: i + 1, can, slugCan: slugViet(can), sao, khacPhai: khac };
  });
}

/** Bảng xemboi dùng khi an lá số (mặc định: sách Việt). */
export const BANG_TU_HOA: DongTuHoa[] = bang(raw.TU_HOA_VIET);
/** Bảng iztro (phổ biến ở sách, phần mềm Trung Quốc hiện nay). */
export const BANG_TU_HOA_TQ: DongTuHoa[] = bang(raw.TU_HOA_TQ);

export const tuHoaCuaCan = (canSo: number) => BANG_TU_HOA[canSo - 1];

/** Can của năm âm lịch (năm 4 là Giáp: (năm − 4) mod 10). */
export const canCuaNam = (namAm: number) => (((namAm - 4) % 10) + 10) % 10 + 1;

/** Câu phú Tứ Hóa trong Toàn thư. Nguyên văn chỉ lưu để đối chiếu, không hiển thị. */
export const TRICH_TU_HOA = {
  nguon: { tenHanViet: 'Tử Vi Đẩu Số toàn thư', tacGia: 'tương truyền Trần Đoàn', ghiCong: 'Văn bản: Wikisource, CC BY-SA 4.0', url: 'https://zh.wikisource.org/wiki/紫微斗數全書' },
  doanId: 151,
  viTriViet: 'Quyển 2 · An thân mệnh lệ',
  nguyenVan: '甲廉破武陽為伴，乙機梁紫月交侵，丙同機昌廉貞位，丁月同機巨門尋，戊貪月弼機為主，己武貪梁曲最平，庚日武陰同為首，辛巨陽曲昌至臨，壬梁紫府武宿是，癸破巨陰貪狼停。如甲生人廉貞化祿、破軍化權、武曲化科、太陽化忌是也，余仿此。',
  /** Dịch nghĩa của xemboi: mỗi vế kể bốn sao theo thứ tự Lộc, Quyền, Khoa, Kỵ. */
  dich: [
    'Giáp: Liêm, Phá, Vũ, Dương.', 'Ất: Cơ, Lương, Tử, Nguyệt (Thái Âm).', 'Bính: Đồng, Cơ, Xương, Liêm Trinh.',
    'Đinh: Nguyệt, Đồng, Cơ, Cự Môn.', 'Mậu: Tham, Nguyệt, Bật, Cơ.', 'Kỷ: Vũ, Tham, Lương, Khúc.',
    'Canh: Nhật (Thái Dương), Vũ, Âm, Đồng.', 'Tân: Cự, Dương, Khúc, Xương.', 'Nhâm: Lương, Tử, Phủ, Vũ.',
    'Quý: Phá, Cự, Âm, Tham Lang.',
  ],
  giaiThich: 'Sách giải: như người sinh năm Giáp thì Liêm Trinh hóa Lộc, Phá Quân hóa Quyền, Vũ Khúc hóa Khoa, Thái Dương hóa Kỵ; các can khác theo đó mà suy.',
};

/** Ba cách ghi ở hai can còn bàn cãi. Cột "Toàn thư" theo câu phú trên. */
export const SO_PHAI_TU_HOA: { can: string; phai: { ten: string; nguon: string; loc: string; quyen: string; khoa: string; ky: string }[] }[] = [
  {
    can: 'Canh',
    phai: [
      { ten: 'Sách Việt (xemboi dùng)', nguon: 'Thái Thứ Lang, Thiên Lương', loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thiên Đồng', ky: 'Thái Âm' },
      { ten: 'Toàn thư', nguon: 'Tử Vi Đẩu Số toàn thư, quyển 2', loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thái Âm', ky: 'Thiên Đồng' },
      { ten: 'Phần mềm Trung Quốc (iztro)', nguon: 'thư viện iztro', loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thái Âm', ky: 'Thiên Đồng' },
    ],
  },
  {
    can: 'Nhâm',
    phai: [
      { ten: 'Sách Việt (xemboi dùng)', nguon: 'Thái Thứ Lang, Thiên Lương', loc: 'Thiên Lương', quyen: 'Tử Vi', khoa: 'Thiên Phủ', ky: 'Vũ Khúc' },
      { ten: 'Toàn thư', nguon: 'Tử Vi Đẩu Số toàn thư, quyển 2', loc: 'Thiên Lương', quyen: 'Tử Vi', khoa: 'Thiên Phủ', ky: 'Vũ Khúc' },
      { ten: 'Phần mềm Trung Quốc (iztro)', nguon: 'thư viện iztro', loc: 'Thiên Lương', quyen: 'Tử Vi', khoa: 'Tả Phù', ky: 'Vũ Khúc' },
    ],
  },
];

export const GHI_CHU_TU_HOA = {
  viTri: 'Sao Hóa đứng cùng cung với sao được hóa. Ví dụ năm Giáp, Hóa Lộc nằm ở cung có Liêm Trinh.',
  luuNien: 'Lưu Tứ Hóa: lấy can của năm đang xem tra cùng bảng này, hóa vào sao gốc trên lá số. Lá số xemboi có hiện các sao lưu Tứ Hóa của năm đang xem.',
  phiHoa: 'Phi hóa là cách dùng can của từng cung (không chỉ can năm sinh) để tra bảng này, rồi xem sao hóa rơi vào cung nào. Cách này của phái Phi tinh; lá số xemboi chưa dùng phi hóa.',
  doiPhai: 'Cuối mỗi lá số xemboi, phần quy ước an sao ghi rõ đã dùng bảng Tứ Hóa nào.',
};

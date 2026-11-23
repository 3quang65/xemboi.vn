// 10 thiên thể trong chiêm tinh (trang /chiem-tinh/hanh-tinh/{x}, Lệnh 50).
// 7 thiên thể cổ: chỉ những gì Tetrabiblos quyển I ghi: tính chất (ch. IV), cát/hung (ch. V), dương/âm (ch. VI), ngày/đêm (ch. VII),
// nhà (ch. XX), vượng/hãm (ch. XXII). Ba hành tinh ngoài: chỉ năm phát hiện và vị trí tính được, ghi rõ không có trong sách.
// Bản dịch Ashmand 1822 (Gutenberg #70850, thu-vien-rag/gutenberg/TX01__pg70850.txt); `en` chỉ để đối chiếu, trang in `vi`.
import { CUNG_HOANG_DAO, TRICH, type CungHoangDao, type HanhTinh, type TrichAnh } from './chiem-tinh';
import { GHI_CHU_NGOAI, THIEN_THE, TRICH_THIEN_THE, kinhDoThienThe, type TenThienThe } from './ban-do-sao';
import { slugViet } from './can-chi';

export const TRICH_HANH_TINH = {
  catTinh: {
    en: 'Therefore, two of the planets, on account of their temperate quality, and because heat and moisture are predominant in them, are considered by the ancients as benefic, or causers of good: these are Jupiter and Venus. And the Moon also is so considered for the same reasons.',
    vi: 'Vì vậy, hai hành tinh, do có tính ôn hòa và vì nóng, ẩm trội hơn trong chúng, được người xưa coi là cát tinh, tức sinh ra điều tốt: đó là Sao Mộc và Sao Kim. Mặt Trăng cũng được coi như vậy vì cùng lý do.',
    chuong: 'V', trang: 14,
  },
  hungTinh: {
    en: 'But Saturn and Mars are esteemed of a contrary nature, and malefic, or causers of evil: the first from his excess of cold, the other from his excess of dryness.',
    vi: 'Còn Sao Thổ và Sao Hỏa được coi là có tính ngược lại, là hung tinh, tức gây ra điều xấu: sao thứ nhất vì quá lạnh, sao kia vì quá khô.',
    chuong: 'V', trang: 14,
  },
  trungTinh: {
    en: 'The Sun and Mercury are deemed of common influence, and productive either of good or evil in unison with whatever planets they may be connected with.',
    vi: 'Mặt Trời và Sao Thủy được coi là có ảnh hưởng chung, sinh ra tốt hay xấu tùy theo các hành tinh mà chúng đi cùng.',
    chuong: 'V', trang: 14,
  },
  amTinh: {
    en: 'The Moon and Venus are therefore said to be feminine, since their qualities are principally moist.',
    vi: 'Vì vậy Mặt Trăng và Sao Kim được gọi là âm (giống cái), vì tính chất của chúng chủ yếu là ẩm.',
    chuong: 'VI', trang: 14,
  },
  duongTinh: {
    en: 'The Sun, Saturn, Jupiter, and Mars are called masculine. Mercury is common to both genders, because at certain times he produces dryness, and at others moisture, and performs each in an equal ratio.',
    vi: 'Mặt Trời, Sao Thổ, Sao Mộc và Sao Hỏa được gọi là dương (giống đực). Sao Thủy chung cả hai, vì có lúc sinh khô, có lúc sinh ẩm, mỗi bên ngang nhau.',
    chuong: 'VI', trang: 14,
  },
  ngayDem: {
    en: 'Hence, again, the Moon and Venus are esteemed to be nocturnal; the Sun and Jupiter, diurnal; and Mercury, common; since in his matutine position he is diurnal, but nocturnal when vespertine.',
    vi: 'Do đó, Mặt Trăng và Sao Kim được coi là thuộc đêm; Mặt Trời và Sao Mộc thuộc ngày; Sao Thủy thì chung, vì khi mọc trước Mặt Trời buổi sáng thì thuộc ngày, khi lặn sau Mặt Trời buổi tối thì thuộc đêm.',
    chuong: 'VII', trang: 15,
  },
  thoHoa: {
    en: 'Hence the coldness of Saturn is allotted to the day, to counterbalance its heat; and the dryness of Mars to the night, to counterbalance its moisture.',
    vi: 'Vì vậy cái lạnh của Sao Thổ được xếp vào ban ngày để cân lại sức nóng của ngày; cái khô của Sao Hỏa được xếp vào ban đêm để cân lại hơi ẩm của đêm.',
    chuong: 'VII', trang: 15,
  },
} as const satisfies Record<string, TrichAnh>;

type Cat = 'cat' | 'hung' | 'chung';
const CAT: Record<HanhTinh, Cat> = { 'Sao Mộc': 'cat', 'Sao Kim': 'cat', 'Mặt Trăng': 'cat', 'Sao Thổ': 'hung', 'Sao Hỏa': 'hung', 'Mặt Trời': 'chung', 'Sao Thủy': 'chung' };
const GIOI: Record<HanhTinh, 'duong' | 'am' | 'chung'> = { 'Mặt Trăng': 'am', 'Sao Kim': 'am', 'Mặt Trời': 'duong', 'Sao Thổ': 'duong', 'Sao Mộc': 'duong', 'Sao Hỏa': 'duong', 'Sao Thủy': 'chung' };
const NGAY_DEM: Record<HanhTinh, 'ngay' | 'dem' | 'chung'> = { 'Mặt Trăng': 'dem', 'Sao Kim': 'dem', 'Sao Hỏa': 'dem', 'Mặt Trời': 'ngay', 'Sao Mộc': 'ngay', 'Sao Thổ': 'ngay', 'Sao Thủy': 'chung' };

export const TEN_CAT: Record<Cat, string> = { cat: 'Cát tinh', hung: 'Hung tinh', chung: 'Ảnh hưởng chung' };
export const TEN_GIOI = { duong: 'Dương', am: 'Âm', chung: 'Chung cả hai' } as const;
export const TEN_NGAY_DEM = { ngay: 'Thuộc ngày', dem: 'Thuộc đêm', chung: 'Chung ngày đêm' } as const;

export type HanhTinhChiTiet = {
  ten: TenThienThe;
  slug: string;
  duongDan: string;
  kyHieu: string;
  coDien: boolean;
  phatHien?: number;
  /** Chỉ có với 7 thiên thể cổ. */
  coDienChiTiet: null | {
    tinhChat: TrichAnh;
    cat: Cat; gioi: 'duong' | 'am' | 'chung'; ngayDem: 'ngay' | 'dem' | 'chung';
    trich: TrichAnh[];
    nha: CungHoangDao[];
    vuong: CungHoangDao | null;
    ham: CungHoangDao | null;
  };
};

export const HANH_TINH_CHI_TIET: HanhTinhChiTiet[] = THIEN_THE.map((t) => {
  const slug = slugViet(t.ten);
  const base = { ten: t.ten, slug, duongDan: `/chiem-tinh/hanh-tinh/${slug}`, kyHieu: t.kyHieu, coDien: t.coDien, phatHien: t.phatHien };
  if (!t.coDien) return { ...base, coDienChiTiet: null };
  const h = t.ten as HanhTinh;
  const cat = CAT[h], gioi = GIOI[h], ngayDem = NGAY_DEM[h];
  const trich: TrichAnh[] = [
    cat === 'cat' ? TRICH_HANH_TINH.catTinh : cat === 'hung' ? TRICH_HANH_TINH.hungTinh : TRICH_HANH_TINH.trungTinh,
    gioi === 'am' ? TRICH_HANH_TINH.amTinh : TRICH_HANH_TINH.duongTinh,
    TRICH_HANH_TINH.ngayDem,
    ...(h === 'Sao Thổ' || h === 'Sao Hỏa' ? [TRICH_HANH_TINH.thoHoa] : []),
  ];
  const nha = CUNG_HOANG_DAO.filter((c) => c.chuNha === h);
  const vuong = CUNG_HOANG_DAO.find((c) => c.vuong === h) ?? null;
  const ham = CUNG_HOANG_DAO.find((c) => c.ham === h) ?? null;
  return { ...base, coDienChiTiet: { tinhChat: TRICH_THIEN_THE[h], cat, gioi, ngayDem, trich, nha, vuong, ham } };
});

export const hanhTinhTheoSlug = (slug: string) => HANH_TINH_CHI_TIET.find((h) => h.slug === slug);

/** Câu nhà (ch. XX) và vượng (ch. XXII) dùng lại từ chiem-tinh.ts: `nha[i].trichNha`, `vuong?.trichVuong`. */
export const TRICH_NHA_VUONG = { nha: (c: CungHoangDao) => c.trichNha, vuong: (c: CungHoangDao | null) => c?.trichVuong ?? null };

/** Hành tinh đang ở cung nào lúc `luc` (kinh độ biểu kiến, tính bằng astronomy-engine). */
export function cungHienTai(slug: string, luc = new Date()): { cung: CungHoangDao; doTrongCung: number } | null {
  const t = THIEN_THE.find((x) => slugViet(x.ten) === slug);
  if (!t) return null;
  const kd = ((kinhDoThienThe(t.body, luc) % 360) + 360) % 360;
  return { cung: CUNG_HOANG_DAO[Math.floor(kd / 30)], doTrongCung: Math.floor(kd % 30) };
}

export { GHI_CHU_NGOAI, TRICH };

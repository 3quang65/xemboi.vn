// Chiêm tinh phương Tây: 12 cung hoàng đạo (hoàng đạo nhiệt đới, theo kinh độ Mặt Trời).
// Phần tính: ngày giờ Mặt Trời vào từng cung lấy từ kinh độ biểu kiến (tiet-khi.mjs, VSOP87D; cùng engine với tiết khí).
//   Cung thứ i bắt đầu ở 30·i độ, trùng các trung khí: Xuân phân 0° = Bạch Dương, Hạ chí 90° = Cự Giải…
// Phần tính chất: chỉ những gì Ptolemy ghi trong Tetrabiblos quyển I (bản dịch Anh J. M. Ashmand 1822, Project Gutenberg #70850, phạm vi công cộng):
//   ch. XIV (chí, phân, cố định, song thể), XV (dương/âm), XX (nhà của hành tinh), XXI (tam hợp), XXII (vượng, hãm).
// Không có: tính cách theo cung, "hợp cung nào", nguyên tố Lửa/Đất/Khí/Nước (Tetrabiblos không dùng các tên này).
import { kinhDoMatTroi } from '@/lib/tuvi-v2/tiet-khi.mjs';

export const NGUON_TETRABIBLOS = {
  ten: 'Tetrabiblos (Ptolemy, thế kỷ II)',
  ban: 'Bản dịch tiếng Anh của J. M. Ashmand (1822), Project Gutenberg #70850',
  url: 'https://www.gutenberg.org/ebooks/70850',
  giayPhep: 'Phạm vi công cộng',
  ghiCong: 'Văn bản: Ptolemy, Tetrabiblos, J. M. Ashmand dịch (1822), bản Project Gutenberg #70850',
  ghiChuTrich: 'Trích nguyên văn bản dịch Anh 1822, bỏ số chú thích của người dịch. xemboi không dịch lại đoạn trích.',
} as const;

/** Một câu trích nguyên văn Ashmand. `chuong` là số chương quyển I, `trang` là trang theo mục lục bản 1822. */
export type TrichAnh = { en: string; chuong: string; trang: number };

export type HanhTinh = 'Mặt Trời' | 'Mặt Trăng' | 'Sao Thủy' | 'Sao Kim' | 'Sao Hỏa' | 'Sao Mộc' | 'Sao Thổ';
export const TEN_ANH_HANH_TINH: Record<HanhTinh, string> = {
  'Mặt Trời': 'Sun', 'Mặt Trăng': 'Moon', 'Sao Thủy': 'Mercury', 'Sao Kim': 'Venus', 'Sao Hỏa': 'Mars', 'Sao Mộc': 'Jupiter', 'Sao Thổ': 'Saturn',
};

export type LoaiCung = 'chi' | 'phan' | 'co-dinh' | 'song-the';
export const TEN_LOAI: Record<LoaiCung, { ten: string; en: string }> = {
  chi: { ten: 'Chí', en: 'tropical' },
  phan: { ten: 'Phân', en: 'equinoctial' },
  'co-dinh': { ten: 'Cố định', en: 'fixed' },
  'song-the': { ten: 'Song thể', en: 'bicorporeal' },
};

export const TRICH: Record<string, TrichAnh> = {
  loaiChi: { en: 'The tropical signs are two: viz. the first thirty degrees after the summer solstice, which compose the sign of Cancer; and the first thirty degrees after the winter solstice, composing the sign of Capricorn.', chuong: 'XIV', trang: 23 },
  loaiPhan: { en: 'There are also two equinoctial signs: Aries, the first after the vernal equinox; and Libra, the first after the autumnal equinox: they are so called, because the Sun, when in the first point of either, makes the day and night equal.', chuong: 'XIV', trang: 23 },
  loaiCoDinh: { en: 'Those signs, which severally follow immediately after the two tropical and the two equinoctial signs, are termed fixed, because, during the Sun’s presence in them, the cold, heat, moisture or dryness, of the season, which commenced on his arrival in the preceding tropical or equinoctial sign, is then more firmly established', chuong: 'XIV', trang: 23 },
  loaiSongThe: { en: 'The bicorporeal signs severally follow the fixed signs; and, being thus intermediately placed between the fixed and the tropical signs, they participate in the constitutional properties of both, from their first to their last degrees.', chuong: 'XIV', trang: 23 },
  amDuong: { en: 'Again, among the twelve signs, six are called masculine and diurnal, and six feminine and nocturnal. They are arranged in alternate order, one after the other, as the day is followed by the night, and as the male is coupled with the female.', chuong: 'XV', trang: 23 },
  nhaNhatNguyet: { en: 'Leo for the Sun, as being masculine; and Cancer for the Moon, as being feminine.', chuong: 'XX', trang: 28 },
  nhaTho: { en: 'Saturn, therefore, since he is cold and inimical to heat, moving also in a superior orbit most remote from the luminaries, occupies the signs opposite to Cancer and Leo: these are Aquarius and Capricorn', chuong: 'XX', trang: 28 },
  nhaMoc: { en: 'Jupiter has a favourable temperament, and is situated beneath the sphere of Saturn; he therefore occupies the next two signs, Sagittarius and Pisces.', chuong: 'XX', trang: 28 },
  nhaHoa: { en: 'Mars is dry in nature, and beneath the sphere of Jupiter: he takes the next two signs, of a nature similar to his own, viz. Aries and Scorpio', chuong: 'XX', trang: 28 },
  nhaKim: { en: 'Venus, possessing a favourable temperament, and placed beneath the sphere of Mars, takes the next two signs, Taurus and Libra.', chuong: 'XX', trang: 28 },
  nhaThuy: { en: 'hence he is placed nearest to both luminaries, and the remaining two signs, Gemini and Virgo, are allotted to him.', chuong: 'XX', trang: 28 },
  tamHop1: { en: 'The first triangle, or triplicity, is formed by three masculine signs, Aries, Leo, and Sagittarius, having the Sun, Jupiter, and Mars as lords by house.', chuong: 'XXI', trang: 29 },
  tamHop2: { en: 'The second triplicity, formed by Taurus, Virgo, and Capricorn, is allotted to the dominion of the Moon and Venus, since it consists of feminine signs. The Moon rules it by night, and Venus by day.', chuong: 'XXI', trang: 29 },
  tamHop3: { en: 'The third triplicity is composed of Gemini, Libra, and Aquarius, masculine signs. It holds connection with Saturn and Mercury by containing their houses, and is therefore attributed to them, and not to Mars, to which planet it bears no relation.', chuong: 'XXI', trang: 29 },
  tamHop4: { en: 'The fourth triplicity, formed by Cancer, Scorpio, and Pisces, is left to the remaining planet, Mars, who has right in it by means of his house, Scorpio.', chuong: 'XXI', trang: 29 },
  vuongNhat: { en: 'his exaltation, therefore, is determined to be in Aries, as, when present in that sign, he begins to lengthen the days, and the influence of his heating nature increases at the same time. His fall is placed in Libra, for the converse reasons.', chuong: 'XXII', trang: 31 },
  vuongTho: { en: 'Saturn on the contrary, in order to preserve his station opposite to the Sun, in this respect, as well as in regard to their respective houses, obtains his exaltation in Libra, and his fall in Aries', chuong: 'XXII', trang: 31 },
  vuongNguyet: { en: 'begins to augment her light in Taurus, the first sign of her own triplicity, which is consequently ascribed to be her exaltation; while Scorpio, the opposite sign, is her fall.', chuong: 'XXII', trang: 31 },
  vuongMoc: { en: 'since he becomes most northerly, and augments his peculiar influence when in Cancer, accordingly obtains his exaltation in that sign, and his fall in Capricorn.', chuong: 'XXII', trang: 31 },
  vuongHoa: { en: 'Mars possesses a fiery nature, which receives its greatest intensity in Capricorn, in which sign this planet becomes most southerly; his exaltation is therefore placed in Capricorn, in opposition to that of Jupiter, and his fall in Cancer.', chuong: 'XXII', trang: 31 },
  vuongKim: { en: 'Venus is of a moist nature, and becomes chiefly moist when in Pisces. Under that sign a dampness begins to be perceptible in the atmosphere, and Venus, from being in that sign, derives an augmentation of her own proper influence: her exaltation is consequently placed therein, and her fall in Virgo.', chuong: 'XXII', trang: 31 },
  vuongThuy: { en: 'in opposition to her, therefore, he takes his exaltation in Virgo, in which sign the autumnal dryness makes its first appearance; and he receives his fall in Pisces.', chuong: 'XXII', trang: 31 },
};
export const viTriTrich = (t: TrichAnh) => `Tetrabiblos, quyển I, chương ${t.chuong} (bản Ashmand 1822, tr. ${t.trang})`;

export type TamHop = { thu: 1 | 2 | 3 | 4; chuNgay: HanhTinh; chuDem: HanhTinh; phuong: string; trich: TrichAnh };
/** 4 tam hợp theo ch. XXI: chủ ban ngày, ban đêm và phương gió Ptolemy gán. */
export const TAM_HOP: readonly TamHop[] = [
  { thu: 1, chuNgay: 'Mặt Trời', chuDem: 'Sao Mộc', phuong: 'Bắc, pha Tây Bắc', trich: TRICH.tamHop1 },
  { thu: 2, chuNgay: 'Sao Kim', chuDem: 'Mặt Trăng', phuong: 'Nam, pha Đông', trich: TRICH.tamHop2 },
  { thu: 3, chuNgay: 'Sao Thổ', chuDem: 'Sao Thủy', phuong: 'Đông, pha Đông Bắc', trich: TRICH.tamHop3 },
  { thu: 4, chuNgay: 'Sao Kim', chuDem: 'Mặt Trăng', phuong: 'Tây, pha Tây Nam', trich: TRICH.tamHop4 },
];

export type CungHoangDao = {
  thu: number; // 0 = Bạch Dương
  ten: string; tenKhac: string[]; en: string; la: string; kyHieu: string; slug: string;
  tuDo: number; // kinh độ hoàng đạo bắt đầu
  loai: LoaiCung; duong: boolean; // dương (masculine, diurnal) hay âm
  chuNha: HanhTinh; tamHop: 1 | 2 | 3 | 4;
  vuong: HanhTinh | null; ham: HanhTinh | null; // exaltation, fall (ch. XXII)
  trichNha: TrichAnh; trichVuong: TrichAnh | null;
};

const C = (thu: number, ten: string, tenKhac: string[], en: string, la: string, kyHieu: string, slug: string, loai: LoaiCung,
  chuNha: HanhTinh, trichNha: TrichAnh, vuong: HanhTinh | null, ham: HanhTinh | null, trichVuong: TrichAnh | null): CungHoangDao => ({
  thu, ten, tenKhac, en, la, kyHieu, slug, tuDo: thu * 30, loai, duong: thu % 2 === 0, chuNha, tamHop: ((thu % 4) + 1) as 1 | 2 | 3 | 4,
  vuong, ham, trichNha, trichVuong,
});

// Ký hiệu kèm U+FE0E để trình duyệt vẽ dạng chữ, không thành emoji.
export const CUNG_HOANG_DAO: readonly CungHoangDao[] = [
  C(0, 'Bạch Dương', [], 'Aries', 'Aries', '♈︎', 'bach-duong', 'phan', 'Sao Hỏa', TRICH.nhaHoa, 'Mặt Trời', 'Sao Thổ', TRICH.vuongNhat),
  C(1, 'Kim Ngưu', [], 'Taurus', 'Taurus', '♉︎', 'kim-nguu', 'co-dinh', 'Sao Kim', TRICH.nhaKim, 'Mặt Trăng', null, TRICH.vuongNguyet),
  C(2, 'Song Tử', [], 'Gemini', 'Gemini', '♊︎', 'song-tu', 'song-the', 'Sao Thủy', TRICH.nhaThuy, null, null, null),
  C(3, 'Cự Giải', [], 'Cancer', 'Cancer', '♋︎', 'cu-giai', 'chi', 'Mặt Trăng', TRICH.nhaNhatNguyet, 'Sao Mộc', 'Sao Hỏa', TRICH.vuongMoc),
  C(4, 'Sư Tử', [], 'Leo', 'Leo', '♌︎', 'su-tu', 'co-dinh', 'Mặt Trời', TRICH.nhaNhatNguyet, null, null, null),
  C(5, 'Xử Nữ', ['Trinh Nữ'], 'Virgo', 'Virgo', '♍︎', 'xu-nu', 'song-the', 'Sao Thủy', TRICH.nhaThuy, 'Sao Thủy', 'Sao Kim', TRICH.vuongThuy),
  C(6, 'Thiên Bình', [], 'Libra', 'Libra', '♎︎', 'thien-binh', 'phan', 'Sao Kim', TRICH.nhaKim, 'Sao Thổ', 'Mặt Trời', TRICH.vuongTho),
  C(7, 'Bọ Cạp', ['Thiên Yết', 'Hổ Cáp'], 'Scorpio', 'Scorpius', '♏︎', 'bo-cap', 'co-dinh', 'Sao Hỏa', TRICH.nhaHoa, null, 'Mặt Trăng', TRICH.vuongNguyet),
  C(8, 'Nhân Mã', [], 'Sagittarius', 'Sagittarius', '♐︎', 'nhan-ma', 'song-the', 'Sao Mộc', TRICH.nhaMoc, null, null, null),
  C(9, 'Ma Kết', [], 'Capricorn', 'Capricornus', '♑︎', 'ma-ket', 'chi', 'Sao Thổ', TRICH.nhaTho, 'Sao Hỏa', 'Sao Mộc', TRICH.vuongHoa),
  C(10, 'Bảo Bình', [], 'Aquarius', 'Aquarius', '♒︎', 'bao-binh', 'co-dinh', 'Sao Thổ', TRICH.nhaTho, null, null, null),
  C(11, 'Song Ngư', [], 'Pisces', 'Pisces', '♓︎', 'song-ngu', 'song-the', 'Sao Mộc', TRICH.nhaMoc, 'Sao Kim', 'Sao Thủy', TRICH.vuongKim),
];

export const cungTheoSlug = (s: string) => CUNG_HOANG_DAO.find((c) => c.slug === s);
export const cungTheoThu = (i: number) => CUNG_HOANG_DAO[((i % 12) + 12) % 12];
export const trichLoai = (l: LoaiCung) => ({ chi: TRICH.loaiChi, phan: TRICH.loaiPhan, 'co-dinh': TRICH.loaiCoDinh, 'song-the': TRICH.loaiSongThe }[l]);
export const tamHopCua = (c: CungHoangDao) => TAM_HOP[c.tamHop - 1];
/** 3 cung cùng tam hợp (gồm chính nó). */
export const cungCungTamHop = (c: CungHoangDao) => CUNG_HOANG_DAO.filter((x) => x.tamHop === c.tamHop);
/** Cung đối (cách 180°). */
export const cungDoi = (c: CungHoangDao) => cungTheoThu(c.thu + 6);
/** Cung có hành tinh này làm chủ nhà (1 hoặc 2 cung). */
export const nhaCuaHanhTinh = (h: HanhTinh) => CUNG_HOANG_DAO.filter((c) => c.chuNha === h);

// ---------- Ngày giờ Mặt Trời vào cung ----------

const NGAY_MS = 86_400_000;
const lechGoc = (a: number, b: number) => ((a - b + 540) % 360) - 180;

/** Thời điểm (Date, UTC) Mặt Trời đạt kinh độ `do` gần mốc `uocLuong` (±4 ngày), chia đôi tới dưới 1 giây. */
function timVaoCung(doKinh: number, uocLuong: number): Date {
  let a = uocLuong - 4 * NGAY_MS, b = uocLuong + 4 * NGAY_MS;
  if (!(lechGoc(kinhDoMatTroi(new Date(a)), doKinh) <= 0 && lechGoc(kinhDoMatTroi(new Date(b)), doKinh) > 0)) {
    throw new Error(`Không tìm thấy lúc Mặt Trời tới ${doKinh}° quanh ${new Date(uocLuong).toISOString()}`);
  }
  while (b - a > 500) {
    const m = (a + b) / 2;
    if (lechGoc(kinhDoMatTroi(new Date(m)), doKinh) <= 0) a = m; else b = m;
  }
  return new Date(Math.round((a + b) / 2));
}

/** Mốc ước lượng ngày vào cung (UTC) theo năm dương lịch: Bạch Dương ~20/3; các cung cách nhau theo chuyển động Mặt Trời trung bình. */
const NGAY_UOC: readonly [number, number][] = [[3, 20], [4, 20], [5, 21], [6, 21], [7, 22], [8, 23], [9, 23], [10, 23], [11, 22], [12, 22], [1, 20], [2, 19]];

const CACHE = new Map<number, Date[]>();
/** 12 thời điểm Mặt Trời vào cung trong năm dương lịch `nam`, theo thứ tự cung (Bạch Dương … Song Ngư; Ma Kết vào cuối tháng 12). */
export function mocVaoCung(nam: number): Date[] {
  const c = CACHE.get(nam);
  if (c) return c;
  const kq = NGAY_UOC.map(([t, d], i) => timVaoCung(i * 30, Date.UTC(nam, t - 1, d)));
  CACHE.set(nam, kq);
  return kq;
}

export type NgayGioVN = { ngay: number; thang: number; nam: number; gio: number; phut: number };
export function sangGioVN(d: Date): NgayGioVN {
  const v = new Date(d.getTime() + 7 * 3600_000);
  return { ngay: v.getUTCDate(), thang: v.getUTCMonth() + 1, nam: v.getUTCFullYear(), gio: v.getUTCHours(), phut: v.getUTCMinutes() };
}
export const vietGioVN = (g: NgayGioVN) =>
  `${String(g.gio).padStart(2, '0')}:${String(g.phut).padStart(2, '0')} ngày ${String(g.ngay).padStart(2, '0')}/${String(g.thang).padStart(2, '0')}/${g.nam}`;

/** Cung theo kinh độ Mặt Trời tại thời điểm `d`. */
export const cungTaiThoiDiem = (d: Date) => cungTheoThu(Math.floor((((kinhDoMatTroi(d) % 360) + 360) % 360) / 30));

export type KetQuaTraCung = {
  cung: CungHoangDao;
  kinhDo: number;
  /** Ngày này có lúc Mặt Trời chuyển cung (theo giờ VN): cung trước, cung sau và giờ chuyển. */
  chuyen: { truoc: CungHoangDao; sau: CungHoangDao; luc: NgayGioVN } | null;
  /** Có nhập giờ hay lấy 12:00 làm mặc định. */
  coGio: boolean;
};

/**
 * Tra cung theo ngày sinh dương lịch (giờ Việt Nam). Không nhập giờ thì lấy 12:00;
 * nếu ngày đó Mặt Trời đổi cung thì trả `chuyen` để trang nói rõ.
 */
export function traCung(ngay: number, thang: number, nam: number, gio?: number, phut = 0): KetQuaTraCung {
  const coGio = gio !== undefined;
  const luc = new Date(Date.UTC(nam, thang - 1, ngay, (coGio ? gio! : 12) - 7, phut));
  const kinhDo = ((kinhDoMatTroi(luc) % 360) + 360) % 360;
  const cung = cungTheoThu(Math.floor(kinhDo / 30));
  const dauNgay = Date.UTC(nam, thang - 1, ngay) - 7 * 3600_000;
  const truoc = cungTaiThoiDiem(new Date(dauNgay)), sau = cungTaiThoiDiem(new Date(dauNgay + NGAY_MS - 1));
  let chuyen: KetQuaTraCung['chuyen'] = null;
  if (truoc.thu !== sau.thu) {
    const ds = [nam - 1, nam, nam + 1].flatMap((y) => mocVaoCung(y));
    const m = ds.find((x) => x.getTime() >= dauNgay && x.getTime() < dauNgay + NGAY_MS)!;
    chuyen = { truoc, sau, luc: sangGioVN(m) };
  }
  return { cung, kinhDo, chuyen, coGio };
}

export type KhoangNgay = { tu: { ngay: number; thang: number }; den: { ngay: number; thang: number } };

/**
 * Ngày vào cung sớm nhất và muộn nhất (giờ VN) trong các năm [tu, den]. Dùng cho câu "Mặt Trời vào cung X từ ngày a đến ngày b tháng m".
 */
export function khoangNgayVaoCung(thu: number, tu = 1930, den = 2030) {
  let som: NgayGioVN | null = null, muon: NgayGioVN | null = null;
  const key = (g: NgayGioVN) => g.thang * 100 + g.ngay;
  for (let y = tu; y <= den; y++) {
    const g = sangGioVN(mocVaoCung(y)[thu]);
    if (!som || key(g) < key(som)) som = g;
    if (!muon || key(g) > key(muon)) muon = g;
  }
  return { som: som!, muon: muon!, tu, den };
}

/**
 * Mặt Trời ở cung `thu` trong lần vào cung thuộc năm dương lịch `nam`: từ `batDau` tới `ketThuc` (lúc vào cung kế, giờ VN).
 * Bảo Bình, Song Ngư vào cung tháng 1, 2 của `nam`; Ma Kết vào cuối tháng 12 và kết thúc tháng 1 năm sau.
 */
export function khoangCungTrongNam(thu: number, nam: number): { batDau: NgayGioVN; ketThuc: NgayGioVN } {
  const batDau = sangGioVN(mocVaoCung(nam)[thu]);
  const ke = thu === 9 ? mocVaoCung(nam + 1)[10] : mocVaoCung(nam)[(thu + 1) % 12];
  return { batDau, ketThuc: sangGioVN(ke) };
}

export const duongDanCung = (c: CungHoangDao) => `/chiem-tinh/cung-hoang-dao/${c.slug}`;
export const TRANG_CHIEM_TINH = ['/chiem-tinh', '/chiem-tinh/cung-hoang-dao', ...CUNG_HOANG_DAO.map(duongDanCung)];

/** Câu giới hạn: đúng mẫu docs/v2/07 mục 3.3. */
export const GIOI_HAN =
  'Đây là tri thức văn hóa phương Tây để tham khảo và tự suy ngẫm. Chưa có nghiên cứu khoa học nào chứng minh khả năng dự báo. Không thay tư vấn y tế, tài chính, pháp lý.';

/** Vì sao trang không có phần tính cách, hợp cung. */
export const GHI_CHU_TINH_CACH =
  'Tetrabiblos không mô tả tính cách người theo cung Mặt Trời. Các bài "tính cách 12 cung", "cung nào hợp cung nào" là của chiêm tinh hiện đại, mỗi nguồn một kiểu, và xemboi chưa có nguồn được phép trích, nên trang chưa đăng phần này.';

export const GHI_CHU_HOANG_DAO =
  'Cung ở đây là cung hoàng đạo nhiệt đới: chia hoàng đạo thành 12 phần 30° tính từ điểm Xuân phân. Đây không phải chòm sao cùng tên trên trời; do tuế sai, các chòm sao đã lệch so với 12 cung này.';

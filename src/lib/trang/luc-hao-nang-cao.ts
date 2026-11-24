// Lục hào nâng cao (trang /kinh-dich/luc-hao, Lệnh 53). Chỉ phần TÍNH ĐƯỢC theo lời sách, không luận việc:
// - dụng thần theo việc hỏi: Tăng san bốc Dịch chương 8 (đoạn 23859), tự xem lấy hào Thế (23864); nguyên, kỵ, cừu thần (23860);
//   nhiều hào cùng loại thì chọn hào vượng (23860);
// - vượng tướng theo tháng (chương 15 phụ, 23871); nhật thần: ám động, phá (chương 22, 23891);
// - phục thần: Hỏa châu lâm, Lục thân căn nguyên (7642): lục thân của bản cung nằm dưới hào của quẻ;
// - ứng kỳ: chương 26 phụ 3 (23905): chỉ các câu có điều kiện rõ, không làm phần "thái vượng", "đại tượng cát hung".
// Đối chiếu trang Việt: docs/v2/doi-chieu/mai-hoa-luc-hao.md, docs/v2/doi-chieu/luc-hao-nang-cao.md.
import { DIA_CHI } from '@/lib/tuvi-v2/am-lich';
import { HANH_CHI } from './bat-tu';
import { quanHeHanh, type Hanh } from './can-chi';
import { queTheoHao, type Hao } from './kinh-dich';
import { LUC_THAN, chiCuaQue, lucThanCua, type HaoAn, type LucThan, type QueAn, type TrichLucHao } from './luc-hao';

export const NGUON_HOA_CHAU_LAM = {
  ma: 'WS09', tenHanViet: 'Hỏa châu lâm', tacGia: 'Ma Y đạo giả (thác danh)', nienDai: 'Tống (thác danh)',
  ghiCong: 'Văn bản: Wikisource, CC BY-SA 4.0', url: 'https://zh.wikisource.org/wiki/火珠林',
} as const;

/** Câu sách cho phần nâng cao. `nguon`: 'WS07' Tăng san bốc Dịch, 'WS09' Hỏa châu lâm. `nguyenVan` chỉ để đối chiếu, KHÔNG hiển thị. */
export type TrichNangCao = TrichLucHao & { nguon: 'WS07' | 'WS09' };

export const TRICH_NANG_CAO = {
  nguyetKienDung: {
    nguon: 'WS07', doanId: 23872, viTriViet: 'Chương 16 · Nguyệt kiến',
    nguyenVan: '卦無用神卽以月建爲用神，不必尋伏神也。',
    dich: 'Trong quẻ không có dụng thần thì lấy nguyệt kiến làm dụng thần, không cần tìm phục thần.',
  },
  dungThan: {
    nguon: 'WS07', doanId: 23859, viTriViet: 'Chương 8 · Dụng thần',
    nguyenVan: '父母爻：占父母卽以卦中之父母爻爲神。…占天地、城池、墻垣，宅捨、屋宇，舟車、衣服、雨具、綢緞，布匹、章奏、文書及書館文契也以父母爻爲用神…官鬼爻：占功名、官府、雷霆鬼神、妻占夫皆以官鬼爻爲用神。占亂臣賊盜邪崇也以官鬼爻爲用神…兄弟爻：占兄弟、姐妹、族中兄弟、姑姨、妹夫及結拜兄弟都以兄弟爻爲用神。…占姊丈妹夫以世爻爲用神…妻財爻：占妻妾、婢、僕、役，我驅使之人皆以要財爻爲用神。占貨財、珠寶、倉庫一切使用之財物亦以妻財爻爲用神。子孫爻：占子孫、占女、女婿、侄、甥、門生凡在我子孫輩中皆以子孫爻爲用神。占忠臣、良將、醫藥、僧、道、兵卒皆以子孫爻爲用神。占六畜、禽獸亦以子孫爻爲用神。',
    dich: 'Hào Phụ mẫu: xem cha mẹ thì lấy hào Phụ mẫu trong quẻ làm dụng thần; ông bà, chú bác, cô dì, thầy, cha mẹ vợ cũng vậy. Xem nhà cửa, thành quách, tường rào, xe thuyền, quần áo, đồ che mưa, vải lụa, tấu sớ, văn thư, khế ước cũng lấy hào Phụ mẫu. … Hào Quan quỷ: xem công danh, việc quan, sấm sét quỷ thần, vợ xem chồng đều lấy hào Quan quỷ; xem giặc cướp trộm cắp cũng vậy. … Hào Huynh đệ: xem anh chị em, anh em trong họ, anh em kết nghĩa đều lấy hào Huynh đệ. … Xem anh rể, em rể thì lấy hào Thế làm dụng thần. … Hào Thê tài: xem vợ, thiếp, người giúp việc, người mình sai bảo đều lấy hào Thê tài; xem hàng hóa, châu báu, kho đụn, mọi thứ tiền của dùng được cũng lấy hào Thê tài. Hào Tử tôn: xem con cháu, con gái, con rể, cháu, học trò đều lấy hào Tử tôn; xem thầy thuốc, thuốc men, tăng, đạo sĩ, binh lính, gia súc, chim thú cũng lấy hào Tử tôn.',
  },
  tuXem: {
    nguon: 'WS07', doanId: 23864, viTriViet: 'Chương 10 · Nguyên thần, kỵ thần có sức và không sức',
    nguyenVan: '自占病世爻亥水爲用神，被未土忌神動而克水，幸得酉金元神亦動',
    dich: 'Tự xem bệnh của mình thì hào Thế (Hợi Thủy) là dụng thần; hào Mùi Thổ là kỵ thần động khắc Thủy, may có hào Dậu Kim là nguyên thần cũng động.',
  },
  nguyenKyCuu: {
    nguon: 'WS07', doanId: 23860, viTriViet: 'Chương 9 · Dụng thần, nguyên thần, kỵ thần, cừu thần',
    nguyenVan: '用神，卽前各類之用神也。元神，生用神之神卽爲元神。忌神克用神之爻也。仇神者克元神而生忌神也。',
    dich: 'Dụng thần là dụng thần của các loại kể ở chương trước. Nguyên thần là thần sinh ra dụng thần. Kỵ thần là hào khắc dụng thần. Cừu thần là thần khắc nguyên thần và sinh kỵ thần.',
  },
  chonHaoVuong: {
    nguon: 'WS07', doanId: 23860, viTriViet: 'Chương 9 · Dụng thần, nguyên thần, kỵ thần, cừu thần',
    nguyenVan: '此卦辰土⚊未土⚊戌土⚊三重父母爻，當擇其旺者而用之，今辰土父母臨月建，卽用辰土爲用神',
    dich: 'Quẻ này có ba hào Phụ mẫu (Thìn, Mùi, Tuất), nên chọn hào vượng mà dùng; nay hào Phụ mẫu Thìn lâm nguyệt kiến, nên lấy Thìn làm dụng thần.',
  },
  vuongTuong: {
    nguon: 'WS07', doanId: 23871, viTriViet: 'Chương 15 phụ · Vượng tướng bốn mùa',
    nguyenVan: '正月寅爲月建，寅木旺，卯木次之。二月卯當月建，卯木旺，寅木次之。正二月木爲旺、火爲相，其餘金火土作休囚。三月辰爲月建辰土旺，丑未之土次之，土生金，金爲相，相𨿽不旺，還有餘气，其餘俱作休囚。…六月未爲月建，未土旺，辰戌次之，土生金，金爲相，火𨿽衰，但有餘气，其餘俱作休囚。…十二月丑爲月建，丑土旺，辰戌之土次之，土生金，金爲相，水𨿽衰，還有餘气，其餘俱作休囚。',
    dich: 'Tháng Giêng, Dần là nguyệt kiến: Dần Mộc vượng, Mão Mộc kém hơn. Tháng Hai, Mão là nguyệt kiến: Mão Mộc vượng, Dần Mộc kém hơn. Tháng Giêng, tháng Hai Mộc vượng, Hỏa tướng, các hành khác là hưu tù. Tháng Ba, Thìn là nguyệt kiến: Thìn Thổ vượng, Sửu Mùi kém hơn; Thổ sinh Kim nên Kim tướng, tướng tuy không vượng vẫn còn dư khí; còn lại là hưu tù. … Tháng Sáu, Mùi là nguyệt kiến: Mùi Thổ vượng, Thìn Tuất kém hơn; Kim tướng; Hỏa tuy suy nhưng còn dư khí; còn lại là hưu tù. … Tháng Mười Hai, Sửu là nguyệt kiến: Sửu Thổ vượng, Thìn Tuất kém hơn; Kim tướng; Thủy tuy suy vẫn còn dư khí; còn lại là hưu tù. (Các tháng khác theo cùng lối: tháng Tư, Năm Hỏa vượng, Thổ tướng; tháng Bảy, Tám Kim vượng, Thủy tướng; tháng Chín Thổ vượng, Kim tướng; tháng Mười, Mười Một Thủy vượng, Mộc tướng.)',
  },
  amDong: {
    nguon: 'WS07', doanId: 23891, viTriViet: 'Chương 22 · Ám động',
    nguyenVan: '靜爻旺相日辰沖之爲暗動，靜爻休囚日辰沖之爲破',
    dich: 'Hào tĩnh mà vượng tướng, bị nhật thần xung là ám động; hào tĩnh mà hưu tù, bị nhật thần xung là phá.',
  },
  phucThan: {
    nguon: 'WS09', doanId: 7642, viTriViet: 'Lục thân căn nguyên',
    nguyenVan: '又問：何謂旁通？曰：本宮之六親在飛象之下，為之親王，為之伏神。旁宮之飛象加伏神之上，為飛象',
    dich: 'Hỏi: thế nào là bàng thông? Đáp: lục thân của bản cung nằm dưới phi tượng, gọi là phục thần. Hào của quẻ đang xem đặt lên trên phục thần thì gọi là phi tượng.',
  },
  ungKy: {
    nguon: 'WS07', doanId: 23905, viTriViet: 'Chương 26 phụ 3 · Ứng kỳ',
    nguyenVan: '靜而逢值逢沖…動而逢合逢值…衰絕者，遇生遇旺…入三墓俱喜沖開…遇六合亦宜相擊…月破喜塡…旬空最愛塡沖',
    dich: 'Hào tĩnh thì ứng vào ngày gặp đúng chi ấy hoặc ngày xung. Hào động thì ứng vào ngày hợp hoặc ngày gặp đúng chi ấy. Hào suy tuyệt thì chờ tháng ngày sinh nó hoặc tháng ngày nó vượng. Hào nhập mộ thì chờ ngày xung mở mộ. Hào gặp lục hợp thì chờ ngày xung tan hợp. Nguyệt phá thì chờ điền thực (ngày hợp, hoặc tháng gặp đúng chi ấy). Tuần không thì chờ ngày điền thực hoặc ngày xung.',
  },
} as const satisfies Record<string, TrichNangCao>;

// ---------- Vượng suy ----------

export type MucVuong = 'Vượng' | 'Tướng' | 'Hưu tù';
export type VuongSuy = { muc: MucVuong; lamNguyetKien: boolean; duKhi: boolean };

/** Vượng tướng của một chi theo nguyệt kiến (23871): cùng hành tháng là vượng, hành tháng sinh ra là tướng, còn lại hưu tù. */
export function vuongSuyTheoThang(chiThang: number, chiHao: number): VuongSuy {
  const hThang = HANH_CHI[chiThang], hHao = HANH_CHI[chiHao];
  const muc: MucVuong = hHao === hThang ? 'Vượng' : quanHeHanh(hThang).sinhRa === hHao ? 'Tướng' : 'Hưu tù';
  // Dư khí sách ghi riêng: tháng Sáu (Mùi) Hỏa, tháng Mười Hai (Sửu) Thủy.
  const duKhi = muc === 'Hưu tù' && ((chiThang === 7 && hHao === 'Hỏa') || (chiThang === 1 && hHao === 'Thủy'));
  return { muc, lamNguyetKien: chiThang === chiHao, duKhi };
}

const xung = (a: number, b: number) => Math.abs(a - b) === 6;
const hop = (a: number, b: number) => (a + b) % 12 === 1;
const chiXung = (c: number) => (c + 6) % 12;
const chiHop = (c: number) => (13 - c) % 12;
/** Mộ của hành (theo chương 26 phụ 1): Kim Sửu, Mộc Mùi, Hỏa Tuất, Thủy và Thổ Thìn. */
const MO: Record<Hanh, number> = { Kim: 1, Mộc: 7, Hỏa: 10, Thủy: 4, Thổ: 4 };

export type QuanHeNgay = 'Lâm nhật thần' | 'Ngày sinh' | 'Ngày khắc' | 'Ngày hợp' | 'Ngày xung' | 'Ám động' | 'Nhật phá';

/** Quan hệ của nhật thần với một hào. Hào tĩnh bị ngày xung: vượng tướng là ám động, hưu tù là nhật phá (23891). */
export function quanHeNgay(chiNgay: number, chiHao: number, dong: boolean, vs: VuongSuy): QuanHeNgay[] {
  const kq: QuanHeNgay[] = [];
  const hN = HANH_CHI[chiNgay], hH = HANH_CHI[chiHao];
  if (chiNgay === chiHao) kq.push('Lâm nhật thần');
  else if (quanHeHanh(hN).sinhRa === hH) kq.push('Ngày sinh');
  else if (quanHeHanh(hN).khac === hH) kq.push('Ngày khắc');
  if (hop(chiNgay, chiHao)) kq.push('Ngày hợp');
  if (xung(chiNgay, chiHao)) kq.push(dong ? 'Ngày xung' : vs.muc === 'Hưu tù' ? 'Nhật phá' : 'Ám động');
  return kq;
}

// ---------- Phục thần ----------

export type PhucThan = { viTri: number; lucThan: LucThan; chi: string; hanh: Hanh; phiThan: HaoAn };

/** Lục thân vắng trong quẻ: lấy từ quẻ thuần của cung, đặt dưới hào cùng vị trí (phi thần). */
export function phucThan(qa: QueAn): PhucThan[] {
  const vang = LUC_THAN.filter((l) => !qa.hao.some((h) => h.lucThan === l));
  if (!vang.length) return [];
  const thuan = queTheoHao([...qa.cung.hao, ...qa.cung.hao] as Hao[]);
  return chiCuaQue(thuan).flatMap((c, i) => {
    const lt = lucThanCua(qa.hanhCung, HANH_CHI[c]);
    return vang.includes(lt) ? [{ viTri: i + 1, lucThan: lt, chi: DIA_CHI[c], hanh: HANH_CHI[c], phiThan: qa.hao[i] }] : [];
  });
}

// ---------- Dụng thần theo việc hỏi ----------

export type DungThanLoai = LucThan | 'Thế';
export type ViecHoi = { ma: string; ten: string; dung: DungThanLoai; trich: 'dungThan' | 'tuXem' };

/** Theo chương 8 (23859); "bản thân" theo ví dụ tự xem bệnh (23864). Thứ tự như sách. */
export const VIEC_HOI: ViecHoi[] = [
  { ma: 'ban-than', ten: 'Tự xem cho mình', dung: 'Thế', trich: 'tuXem' },
  { ma: 'cha-me', ten: 'Cha mẹ, ông bà, chú bác, cô dì, thầy, cha mẹ vợ', dung: 'Phụ mẫu', trich: 'dungThan' },
  { ma: 'nha-cua', ten: 'Nhà cửa, tường rào', dung: 'Phụ mẫu', trich: 'dungThan' },
  { ma: 'xe-thuyen', ten: 'Xe thuyền, quần áo, vải lụa', dung: 'Phụ mẫu', trich: 'dungThan' },
  { ma: 'van-thu', ten: 'Văn thư, giấy tờ, khế ước', dung: 'Phụ mẫu', trich: 'dungThan' },
  { ma: 'cong-danh', ten: 'Công danh, việc quan', dung: 'Quan quỷ', trich: 'dungThan' },
  { ma: 'chong', ten: 'Vợ xem cho chồng', dung: 'Quan quỷ', trich: 'dungThan' },
  { ma: 'trom-cuop', ten: 'Trộm cắp, giặc cướp', dung: 'Quan quỷ', trich: 'dungThan' },
  { ma: 'anh-em', ten: 'Anh chị em, anh em họ, anh em kết nghĩa', dung: 'Huynh đệ', trich: 'dungThan' },
  { ma: 'anh-re', ten: 'Anh rể, em rể', dung: 'Thế', trich: 'dungThan' },
  { ma: 'vo', ten: 'Chồng xem cho vợ', dung: 'Thê tài', trich: 'dungThan' },
  { ma: 'nguoi-lam', ten: 'Người giúp việc, người mình sai bảo', dung: 'Thê tài', trich: 'dungThan' },
  { ma: 'tien-cua', ten: 'Tiền của, hàng hóa, châu báu', dung: 'Thê tài', trich: 'dungThan' },
  { ma: 'con-chau', ten: 'Con cháu, con rể, học trò', dung: 'Tử tôn', trich: 'dungThan' },
  { ma: 'thuoc', ten: 'Thuốc men, thầy thuốc', dung: 'Tử tôn', trich: 'dungThan' },
  { ma: 'gia-suc', ten: 'Gia súc, chim thú', dung: 'Tử tôn', trich: 'dungThan' },
];

/** Vòng lục thân theo ngũ hành của cung: Phụ mẫu sinh Huynh đệ, Huynh đệ sinh Tử tôn, Tử tôn sinh Thê tài, Thê tài sinh Quan quỷ, Quan quỷ sinh Phụ mẫu. */
const VONG: LucThan[] = ['Phụ mẫu', 'Huynh đệ', 'Tử tôn', 'Thê tài', 'Quan quỷ'];
const sau = (l: LucThan, n: number) => VONG[(VONG.indexOf(l) + n + 5) % 5];

/** Nguyên thần sinh dụng; kỵ thần khắc dụng; cừu thần khắc nguyên thần và sinh kỵ thần (23860). */
export function nguyenKyCuu(dung: LucThan): { nguyen: LucThan; ky: LucThan; cuu: LucThan } {
  return { nguyen: sau(dung, -1), ky: sau(dung, -2), cuu: sau(dung, -3) };
}

export type HaoNangCao = HaoAn & { vuongSuy: VuongSuy | null; nhatThan: QuanHeNgay[] };

export type KetQuaDungThan = {
  viec: ViecHoi;
  lucThan: LucThan;
  /** Các hào mang dụng thần (hoặc hào Thế). Rỗng thì xem `phuc`. */
  cacHao: HaoNangCao[];
  /** Dụng thần vắng trong quẻ: phục thần cùng loại. */
  phuc: PhucThan[];
  /** Dụng thần vắng mà nguyệt kiến mang đúng hành ấy: sách lấy nguyệt kiến làm dụng thần, không cần tìm phục (23872). */
  nguyetKien: boolean;
  /** Có từ hai hào trở lên: hào lâm nguyệt kiến hoặc vượng (theo câu "chọn hào vượng mà dùng"); null nếu không phân được. */
  haoVuong: number | null;
  nguyen: { lucThan: LucThan; cacHao: number[] };
  ky: { lucThan: LucThan; cacHao: number[] };
  cuu: { lucThan: LucThan; cacHao: number[] };
};

/** Thêm vượng suy theo tháng và quan hệ nhật thần cho từng hào. `chiThang`, `chiNgay` theo chỉ số Tý 0 … Hợi 11. */
export function haoNangCao(qa: QueAn, chiThang: number | null, chiNgay: number | null): HaoNangCao[] {
  return qa.hao.map((h) => {
    const c = DIA_CHI.indexOf(h.chi as never);
    const vs = chiThang === null ? null : vuongSuyTheoThang(chiThang, c);
    return { ...h, vuongSuy: vs, nhatThan: chiNgay === null || !vs ? [] : quanHeNgay(chiNgay, c, h.dong, vs) };
  });
}

const DIEM_VUONG = (h: HaoNangCao) => (!h.vuongSuy ? 0 : h.vuongSuy.lamNguyetKien ? 3 : h.vuongSuy.muc === 'Vượng' ? 2 : h.vuongSuy.muc === 'Tướng' ? 1 : 0);

export function dungThanTheoViec(qa: QueAn, hao: HaoNangCao[], maViec: string, chiThang: number | null = null): KetQuaDungThan | null {
  const viec = VIEC_HOI.find((v) => v.ma === maViec);
  if (!viec) return null;
  const haoThe = hao.find((h) => h.theUng === 'Thế')!;
  const lucThan = viec.dung === 'Thế' ? haoThe.lucThan : viec.dung;
  const cacHao = viec.dung === 'Thế' ? [haoThe] : hao.filter((h) => h.lucThan === lucThan);
  let haoVuong: number | null = null;
  if (cacHao.length > 1) {
    const diem: number[] = cacHao.map((h) => DIEM_VUONG(h));
    const max = Math.max(...diem);
    if (max > 0 && diem.filter((d) => d === max).length === 1) haoVuong = cacHao[diem.indexOf(max)].viTri;
  }
  const nkc = nguyenKyCuu(lucThan);
  const tim = (l: LucThan) => hao.filter((h) => h.lucThan === l).map((h) => h.viTri);
  return {
    viec, lucThan, cacHao, haoVuong,
    phuc: cacHao.length ? [] : phucThan(qa).filter((p) => p.lucThan === lucThan),
    nguyetKien: !cacHao.length && chiThang !== null && lucThanCua(qa.hanhCung, HANH_CHI[chiThang]) === lucThan,
    nguyen: { lucThan: nkc.nguyen, cacHao: tim(nkc.nguyen) },
    ky: { lucThan: nkc.ky, cacHao: tim(nkc.ky) },
    cuu: { lucThan: nkc.cuu, cacHao: tim(nkc.cuu) },
  };
}

// ---------- Ứng kỳ ----------

export type MocUngKy = { dieuKien: string; ngay: string[]; thang?: string[] };

/**
 * Các mốc ngày (tháng) sách nêu cho một hào (thường là hào dụng thần), theo chương 26 phụ 3 (23905).
 * Chỉ áp các câu có điều kiện tính được; trả về mọi câu khớp, không chọn giúp.
 */
export function ungKy(h: HaoNangCao, chiThang: number | null, chiNgay: number | null): MocUngKy[] {
  const c = DIA_CHI.indexOf(h.chi as never);
  const ten = (ds: number[]) => [...new Set(ds)].map((x) => DIA_CHI[x]);
  const kq: MocUngKy[] = [];
  if (h.tuanKhong) kq.push({ dieuKien: 'Tuần không: chờ ngày điền thực hoặc ngày xung', ngay: ten([c, chiXung(c)]) });
  if (h.nguyetPha) kq.push({ dieuKien: 'Nguyệt phá: chờ ngày hợp, hoặc tháng gặp đúng chi', ngay: ten([chiHop(c)]), thang: ten([c]) });
  if (h.dong) kq.push({ dieuKien: 'Hào động: chờ ngày hợp hoặc ngày gặp đúng chi', ngay: ten([chiHop(c), c]) });
  else kq.push({ dieuKien: 'Hào tĩnh: chờ ngày gặp đúng chi hoặc ngày xung', ngay: ten([c, chiXung(c)]) });
  const hopVoi = [chiThang, chiNgay].filter((x): x is number => x !== null && hop(x, c));
  if (hopVoi.length) kq.push({ dieuKien: 'Gặp hợp (với tháng hoặc ngày): chờ ngày xung tan hợp', ngay: ten([chiXung(c), ...hopVoi.map((x) => chiXung(x))]) });
  const mo = MO[h.hanh];
  if ([chiThang, chiNgay].includes(mo)) kq.push({ dieuKien: `Nhập mộ ở ${DIA_CHI[mo]}: chờ ngày xung mở mộ`, ngay: ten([chiXung(mo)]) });
  if (h.vuongSuy?.muc === 'Hưu tù') {
    const sinh = quanHeHanh(h.hanh).duocSinhBoi;
    const chiCua = (hh: Hanh) => HANH_CHI.flatMap((x, i) => (x === hh ? [i] : []));
    kq.push({ dieuKien: 'Hưu tù: chờ tháng ngày sinh nó hoặc tháng ngày nó vượng', ngay: ten([...chiCua(sinh), ...chiCua(h.hanh)]) });
  }
  return kq;
}

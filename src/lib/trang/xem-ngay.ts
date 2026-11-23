// Ngày tốt xấu cho cụm /xem-ngay (docs/v2/16-seo-trang.csv nhóm XN). Chỉ dữ liệu tính được, không có lời bình.
//
// Ba lớp, mỗi lớp ghi rõ nguồn để trang hiện cho người xem. Các lớp có thể nói khác nhau; trang hiện cả ba, không gộp thành điểm.
//  1. Thập nhị trực (建除): trực = (chi ngày − chi tháng) mod 12, tháng tính theo tiết (tháng 1 = Dần, từ Lập xuân).
//     Đã đối chiếu 716/716 ô của 月表 trong 協紀辨方書 Hiệp kỷ biện phương thư (tests/trang/doi-chieu/hiep-ky-nguyet-bieu.json).
//     Câu ca trực và việc lấy từ 玉匣記 Ngọc hạp ký (WS12, rag_doan 8068).
//  2. Mười hai thần hoàng đạo / hắc đạo (青龍…勾陳): quy tắc trong Hiệp kỷ 卷七 黃道黑道 (KR3g0051, rag_doan 6239):
//     tháng Dần, Thân khởi Thanh long ở ngày Tý; Mão, Dậu ở Dần; Thìn, Tuất ở Thìn; Tỵ, Hợi ở Ngọ; Tý, Ngọ ở Thân; Sửu, Mùi ở Tuất; đi thuận.
//     Sáu thần hoàng đạo là Tư mệnh, Kim quỹ, Minh đường, Ngọc đường, Thanh long, Thiên đức (sách ghi ứng với Tý Ngọ Mão Dậu Dần Mùi, rag_doan 6240–6241).
//     Chính Hiệp kỷ ghi rằng cách chia này không có căn cứ thiên văn; trang nên nói điều đó.
//  3. Nghi/kỵ và thần sát: bảng của thư viện mở lunar-javascript 1.7.8 (6tail, MIT). Thư viện không ghi sách gốc,
//     có cả mục hiện đại (mua xe, lắp máy). Trang phải ghi "theo bảng của lunar-javascript, không rõ sách gốc".
//
// Tháng theo tiết tính bằng giờ Việt Nam (UTC+7), mức ngày: ngày nào có tiết bắt đầu thì cả ngày thuộc tháng mới.
// Cách tính này có thể lệch một ngày so với lịch Trung Quốc (UTC+8) khi tiết rơi vào khoảng 23:00–24:00 giờ Bắc Kinh.
import L from 'lunar-javascript';
import { canChiThang, type CapCanChi } from '@/lib/tuvi-v2/am-lich';
import { kinhDoMatTroi } from '@/lib/tuvi-v2/tiet-khi.mjs';
import { ngayHopLe, ngayLich, type ChiTietNgay } from './lich';
import { TEN_NGHI_KY, TEN_THAN_SAT } from './xem-ngay-thuat-ngu';

const { LunarUtil } = L;

export const CAN_HAN = '甲乙丙丁戊己庚辛壬癸';
export const CHI_HAN = '子丑寅卯辰巳午未申酉戌亥';
const hanCanChi = (cc: CapCanChi) => CAN_HAN[cc.can] + CHI_HAN[cc.chi];

export const NAM_XEM_NGAY_TU = 1900;
export const NAM_XEM_NGAY_DEN = 2100;

// ---------- Nguồn ----------

export const NGUON_XEM_NGAY = {
  hiepKy: {
    ma: 'KR3g0051', tenGoc: '欽定協紀辨方書', tenHanViet: 'Khâm định Hiệp kỷ biện phương thư',
    nienDai: 'Thanh, Càn Long', ghiCong: 'Văn bản: Kanripo, CC BY-SA 4.0', url: 'https://github.com/kanripo/KR3g0051',
  },
  ngocHap: {
    ma: 'WS12', tenGoc: '玉匣記', tenHanViet: 'Ngọc hạp ký',
    nienDai: 'thác danh Hứa chân nhân', ghiCong: 'Văn bản: Wikisource, CC BY-SA 4.0', url: 'https://zh.wikisource.org/wiki/玉匣記',
  },
  lunarJs: {
    ma: 'lunar-javascript', ten: 'lunar-javascript 1.7.8', tacGia: '6tail', giayPhep: 'MIT',
    url: 'https://github.com/6tail/lunar-javascript',
    ghiChu: 'Bảng nghi kỵ và thần sát của thư viện mở này không ghi sách gốc, có cả mục hiện đại như mua xe, lắp máy.',
  },
} as const;

/** Các đoạn nguyên văn trang có thể trích (đã có trong kho RAG, phạm vi công khai). */
export const TRICH_DOAN = {
  /** Ngọc hạp ký: trực nào hoàng, trực nào hắc, và việc hợp từng trực. */
  ngocHapTruc: {
    nguon: 'ngocHap' as const, doanId: 8068, viTri: '黃黑道日當用之事',
    nguyenVan: '建滿平收黑，除危定執黃，成開皆可用，閉破不相當。又，黃黑道日當用之事：建宜出行收嫁娶，定直冠帶滿修倉，破除療病執宜捕，危本安床開葬良，成開作所成交吉，平乃作事總平常。',
  },
  /** Hiệp kỷ: quy tắc khởi 12 thần. */
  hiepKyThan: {
    nguon: 'hiepKy' as const, doanId: 6239, viTri: '卷七 · 黃道黑道',
    nguyenVan: '黄黒二道者，黄道六黑道六，共十有二，以配十有二辰。一青龍，二明堂，三天刑，四朱雀，五金匱，六天德，七白虎，八玉堂，九天牢，十元武，十一司命，十二勾陳。其法則寅申青龍起子，卯酉起寅，辰戌起辰，巳亥起午，子午起申，丑未起戌，順行十二辰。',
  },
  /** Hiệp kỷ tự nhận xét: không có lý do thiên văn để chỉ sáu thần kia là hoàng đạo. */
  hiepKyNhanXet: {
    nguon: 'hiepKy' as const, doanId: 6241, viTri: '卷七 · 黃道黑道',
    nguyenVan: '今按黄道為日行躔度，無只以子午卯酉寅未為黄道之理。',
  },
} as const;

// ---------- Thập nhị trực ----------

export type NhomTruc = 'hoang' | 'hac' | 'kha-dung' | 'bat-tuong';
export const TEN_NHOM_TRUC: Record<NhomTruc, string> = {
  hoang: 'Hoàng (theo Ngọc hạp ký)', hac: 'Hắc (theo Ngọc hạp ký)', 'kha-dung': 'Dùng được', 'bat-tuong': 'Không nên',
};

export type Truc = {
  chiSo: number; ten: string; han: string; nhom: NhomTruc;
  /** Việc câu ca Ngọc hạp ký gán cho trực này (dịch sát), null nếu câu ca không nói. */
  viec: string | null; viecHan: string | null;
};

export const TRUC: Truc[] = [
  { chiSo: 0, ten: 'Kiến', han: '建', nhom: 'hac', viec: 'nên xuất hành', viecHan: '建宜出行' },
  { chiSo: 1, ten: 'Trừ', han: '除', nhom: 'hoang', viec: 'chữa bệnh', viecHan: '破除療病' },
  { chiSo: 2, ten: 'Mãn', han: '滿', nhom: 'hac', viec: 'sửa kho', viecHan: '滿修倉' },
  { chiSo: 3, ten: 'Bình', han: '平', nhom: 'hac', viec: 'làm việc gì cũng bình thường', viecHan: '平乃作事總平常' },
  { chiSo: 4, ten: 'Định', han: '定', nhom: 'hoang', viec: 'lễ đội mũ thắt đai', viecHan: '定直冠帶' },
  { chiSo: 5, ten: 'Chấp', han: '執', nhom: 'hoang', viec: 'nên bắt bớ', viecHan: '執宜捕' },
  { chiSo: 6, ten: 'Phá', han: '破', nhom: 'bat-tuong', viec: 'chữa bệnh', viecHan: '破除療病' },
  { chiSo: 7, ten: 'Nguy', han: '危', nhom: 'hoang', viec: 'kê giường', viecHan: '危本安床' },
  { chiSo: 8, ten: 'Thành', han: '成', nhom: 'kha-dung', viec: 'làm việc, giao dịch thành tốt', viecHan: '成開作所成交吉' },
  { chiSo: 9, ten: 'Thu', han: '收', nhom: 'hac', viec: 'cưới gả', viecHan: '收嫁娶' },
  { chiSo: 10, ten: 'Khai', han: '開', nhom: 'kha-dung', viec: 'an táng; làm việc, giao dịch tốt', viecHan: '開葬良；成開作所成交吉' },
  { chiSo: 11, ten: 'Bế', han: '閉', nhom: 'bat-tuong', viec: null, viecHan: null },
];

/** Chỉ số trực (0 = Kiến) từ chi tháng tiết và chi ngày (0 = Tý). */
export function chiSoTruc(chiThang: number, chiNgay: number): number {
  return (((chiNgay - chiThang) % 12) + 12) % 12;
}

// ---------- 12 thần hoàng đạo / hắc đạo ----------

export type ThanNgay = { chiSo: number; ten: string; han: string; hoangDao: boolean };
export const THAN_12: ThanNgay[] = [
  { chiSo: 0, ten: 'Thanh long', han: '青龍', hoangDao: true },
  { chiSo: 1, ten: 'Minh đường', han: '明堂', hoangDao: true },
  { chiSo: 2, ten: 'Thiên hình', han: '天刑', hoangDao: false },
  { chiSo: 3, ten: 'Chu tước', han: '朱雀', hoangDao: false },
  { chiSo: 4, ten: 'Kim quỹ', han: '金匱', hoangDao: true },
  { chiSo: 5, ten: 'Thiên đức', han: '天德', hoangDao: true },
  { chiSo: 6, ten: 'Bạch hổ', han: '白虎', hoangDao: false },
  { chiSo: 7, ten: 'Ngọc đường', han: '玉堂', hoangDao: true },
  { chiSo: 8, ten: 'Thiên lao', han: '天牢', hoangDao: false },
  { chiSo: 9, ten: 'Huyền vũ', han: '元武', hoangDao: false },
  { chiSo: 10, ten: 'Tư mệnh', han: '司命', hoangDao: true },
  { chiSo: 11, ten: 'Câu trần', han: '勾陳', hoangDao: false },
];

/** Chi ngày (0 = Tý) mà Thanh long khởi, theo chi tháng tiết: Dần/Thân → Tý, Mão/Dậu → Dần, … */
export function chiKhoiThanhLong(chiThang: number): number {
  return ((((chiThang - 2) % 6) + 6) % 6) * 2;
}

export function chiSoThan(chiThang: number, chiNgay: number): number {
  return (((chiNgay - chiKhoiThanhLong(chiThang)) % 12) + 12) % 12;
}

// ---------- Tháng theo tiết (giờ Việt Nam) ----------

export type ThangTiet = {
  /** 0 = tháng Dần (từ Lập xuân) … 11 = tháng Sửu (từ Tiểu hàn). */
  thuTu: number;
  canChi: CapCanChi;
  han: string;
};

/** Tháng tiết của một ngày dương lịch: lấy kinh độ Mặt Trời lúc hết ngày (24:00 giờ Việt Nam). */
export function thangTiet(ngay: number, thang: number, nam: number): ThangTiet {
  const lambda = kinhDoMatTroi(new Date(Date.UTC(nam, thang - 1, ngay, 17)));
  const thuTu = Math.floor(((((lambda - 315) % 360) + 360) % 360) / 30);
  // Tháng Tý, Sửu đầu năm dương lịch vẫn thuộc năm tiết trước (năm tiết đổi tại Lập xuân).
  const namTiet = thang <= 2 && thuTu >= 10 ? nam - 1 : nam;
  const canChi = canChiThang(thuTu + 1, namTiet);
  return { thuTu, canChi, han: hanCanChi(canChi) };
}

// ---------- Nghi kỵ, thần sát (lunar-javascript) ----------

export type Muc = { han: string; ten: string };
const lamMuc = (ds: string[], bang: Record<string, string>): Muc[] =>
  ds.filter((h) => h !== '无').map((h) => ({ han: h, ten: bang[h] ?? h }));

// ---------- Một ngày ----------

export type NgayXem = {
  iso: string;
  /** Dữ liệu lịch chung (âm lịch, giờ hoàng đạo theo Hồ Ngọc Đức…). Lưu ý `lich.canChiThang` là theo tháng âm, khác `thangTiet`. */
  lich: ChiTietNgay;
  thangTiet: ThangTiet;
  ngayHan: string;
  truc: Truc;
  than: ThanNgay;
  nghi: Muc[];
  ky: Muc[];
  catThan: Muc[];
  hungSat: Muc[];
};

function kiemNam(nam: number) {
  if (!Number.isInteger(nam) || nam < NAM_XEM_NGAY_TU || nam > NAM_XEM_NGAY_DEN) throw new RangeError(`Năm ngoài phạm vi: ${nam}`);
}

export function xemNgay(ngay: number, thang: number, nam: number): NgayXem {
  kiemNam(nam);
  if (!ngayHopLe(ngay, thang, nam)) throw new RangeError(`Ngày không hợp lệ: ${ngay}/${thang}/${nam}`);
  const lich = ngayLich(ngay, thang, nam);
  const tt = thangTiet(ngay, thang, nam);
  const ccNgay = lich.canChiNgay;
  const ngayHan = hanCanChi(ccNgay);
  const chiThang = tt.canChi.chi;
  return {
    iso: lich.iso,
    lich,
    thangTiet: tt,
    ngayHan,
    truc: TRUC[chiSoTruc(chiThang, ccNgay.chi)],
    than: THAN_12[chiSoThan(chiThang, ccNgay.chi)],
    nghi: lamMuc(LunarUtil.getDayYi(tt.han, ngayHan), TEN_NGHI_KY),
    ky: lamMuc(LunarUtil.getDayJi(tt.han, ngayHan), TEN_NGHI_KY),
    catThan: lamMuc(LunarUtil.getDayJiShen(chiThang, ngayHan), TEN_THAN_SAT),
    hungSat: lamMuc(LunarUtil.getDayXiongSha(chiThang, ngayHan), TEN_THAN_SAT),
  };
}

// ---------- Theo việc ----------

export type MaViec = 'cuoi-hoi' | 'khai-truong' | 'dong-tho' | 'nhap-trach' | 'mua-xe' | 'cat-toc' | 'xuat-hanh';

export type Viec = {
  ma: MaViec;
  ten: string;
  /** Mục nghi/kỵ chính (chữ Hán giản thể như lunar-javascript). Ngày hợp = có mục chính trong "nghi" và không có trong "kỵ". */
  chinh: string[];
  /** Mục liên quan, chỉ để hiện kèm. */
  phu: string[];
  /** Trực câu ca Ngọc hạp ký gán việc này (để trang nhắc), nếu có. */
  trucCauCa: number[];
  /** Ghi chú trang phải hiện khi việc không có mục riêng trong bảng. */
  ghiChu: string | null;
};

export const VIEC: Record<MaViec, Viec> = {
  'cuoi-hoi': { ma: 'cuoi-hoi', ten: 'Cưới hỏi', chinh: ['嫁娶'], phu: ['纳采', '订盟', '问名', '纳婿'], trucCauCa: [9], ghiChu: null },
  'khai-truong': { ma: 'khai-truong', ten: 'Khai trương', chinh: ['开市'], phu: ['交易', '立券', '纳财', '挂匾'], trucCauCa: [8, 10], ghiChu: null },
  'dong-tho': { ma: 'dong-tho', ten: 'Động thổ', chinh: ['动土'], phu: ['起基', '修造', '上梁', '竖柱'], trucCauCa: [], ghiChu: null },
  'nhap-trach': { ma: 'nhap-trach', ten: 'Nhập trạch', chinh: ['入宅'], phu: ['移徙', '安床', '安香'], trucCauCa: [], ghiChu: null },
  'mua-xe': {
    ma: 'mua-xe', ten: 'Mua xe', chinh: ['交易'], phu: ['纳财', '立券'], trucCauCa: [8, 10],
    ghiChu: 'Bảng nghi kỵ theo ngày không có mục mua xe. Trang dùng mục Giao dịch (交易), kèm Nạp tài và Lập khoán.',
  },
  'cat-toc': { ma: 'cat-toc', ten: 'Cắt tóc', chinh: ['理发'], phu: ['整手足甲', '沐浴'], trucCauCa: [], ghiChu: null },
  'xuat-hanh': { ma: 'xuat-hanh', ten: 'Xuất hành', chinh: ['出行'], phu: ['移徙'], trucCauCa: [0], ghiChu: null },
};

export type NgayTheoViec = {
  iso: string;
  ngay: number;
  thu: string;
  am: string;
  canChiNgay: string;
  truc: Truc;
  than: ThanNgay;
  /** 'hop': mục chính có trong nghi; 'ky': mục chính có trong kỵ; 'khac': không nhắc. */
  ket: 'hop' | 'ky' | 'khac';
  phuNghi: Muc[];
};

export type ThangTheoViec = { viec: Viec; nam: number; thang: number; ngay: NgayTheoViec[]; hop: NgayTheoViec[]; ky: NgayTheoViec[] };

export function ngayTheoViec(ma: MaViec, nam: number, thang: number): ThangTheoViec {
  kiemNam(nam);
  if (!Number.isInteger(thang) || thang < 1 || thang > 12) throw new RangeError(`Tháng không hợp lệ: ${thang}`);
  const viec = VIEC[ma];
  if (!viec) throw new RangeError(`Việc không có: ${ma}`);
  const ds: NgayTheoViec[] = [];
  for (let d = 1; d <= 31 && ngayHopLe(d, thang, nam); d++) {
    const x = xemNgay(d, thang, nam);
    const coNghi = x.nghi.some((m) => viec.chinh.includes(m.han));
    const coKy = x.ky.some((m) => viec.chinh.includes(m.han));
    const am = x.lich.am;
    ds.push({
      iso: x.iso, ngay: d, thu: x.lich.thu,
      am: `${am.ngay}/${am.thang}${am.nhuan ? ' nhuận' : ''}`,
      canChiNgay: x.lich.canChiNgay.ten,
      truc: x.truc, than: x.than,
      ket: coKy ? 'ky' : coNghi ? 'hop' : 'khac',
      phuNghi: x.nghi.filter((m) => viec.phu.includes(m.han)),
    });
  }
  return { viec, nam, thang, ngay: ds, hop: ds.filter((n) => n.ket === 'hop'), ky: ds.filter((n) => n.ket === 'ky') };
}

// ---------- Trang tháng (/xem-ngay/thang-mm-yyyy và /xem-ngay/{viec}/thang-mm-yyyy) ----------

/** Năm có trang tháng (ngoài khoảng: 404). Cùng khoảng với trang lịch năm được index. */
export const NAM_TRANG_THANG_TU = 2020;
export const NAM_TRANG_THANG_DEN = 2035;

/** Đọc đoạn "thang-11-2026" (tháng 2 chữ số). Sai mẫu hoặc ngoài khoảng năm thì null. */
export function phanTichThangXemNgay(doan: string): { nam: number; thang: number } | null {
  const m = /^thang-(\d{2})-(\d{4})$/.exec(doan);
  if (!m) return null;
  const thang = Number(m[1]);
  const nam = Number(m[2]);
  if (thang < 1 || thang > 12 || nam < NAM_TRANG_THANG_TU || nam > NAM_TRANG_THANG_DEN) return null;
  return { nam, thang };
}

export const doanThang = (nam: number, thang: number) => `thang-${String(thang).padStart(2, '0')}-${nam}`;

/** Tháng trước và sau (null nếu ra ngoài khoảng có trang). */
export function thangKe(nam: number, thang: number): { truoc: { nam: number; thang: number } | null; sau: { nam: number; thang: number } | null } {
  const t = thang === 1 ? { nam: nam - 1, thang: 12 } : { nam, thang: thang - 1 };
  const s = thang === 12 ? { nam: nam + 1, thang: 1 } : { nam, thang: thang + 1 };
  const trong = (x: { nam: number }) => x.nam >= NAM_TRANG_THANG_TU && x.nam <= NAM_TRANG_THANG_DEN;
  return { truoc: trong(t) ? t : null, sau: trong(s) ? s : null };
}

/** Mọi ngày của một tháng dương lịch, đủ ba lớp. */
export function thangXemNgay(nam: number, thang: number): NgayXem[] {
  kiemNam(nam);
  if (!Number.isInteger(thang) || thang < 1 || thang > 12) throw new RangeError(`Tháng không hợp lệ: ${thang}`);
  const ds: NgayXem[] = [];
  for (let d = 1; d <= 31 && ngayHopLe(d, thang, nam); d++) ds.push(xemNgay(d, thang, nam));
  return ds;
}

/**
 * Việc có trang riêng /xem-ngay/{ma} và /xem-ngay/{ma}/thang-mm-yyyy. Không có 'xuat-hanh':
 * /xem-ngay/xuat-hanh là trang giờ xuất hành Tết (XN-XUATHANH), việc xuất hành chỉ hiện ở trang hub và trang ngày.
 */
export const MA_VIEC_CO_TRANG: MaViec[] = ['cuoi-hoi', 'khai-truong', 'dong-tho', 'nhap-trach', 'mua-xe', 'cat-toc'];
export const laMaViec = (s: string): s is MaViec => (MA_VIEC_CO_TRANG as string[]).includes(s);

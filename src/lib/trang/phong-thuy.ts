// Phong thủy Bát trạch: cung phi, 8 du niên, 24 sơn và 8 phương.
// Nguồn: 欽定協紀辨方書 Khâm định Hiệp kỷ biện phương thư (1739), bản Kanripo KR3g0051 (CC BY-SA 4.0).
//   卷2 二十四方位 (24 sơn thuộc 8 cung), 卷2 大遊年變卦 (cách lập 8 du niên cho xem nhà), 卷35 男女九宫 (cung phi nam nữ).
// Số quyển ghi theo sách. Kanripo thiếu 卷14 nên tệp KR3g0051_0NN từ 014 trở đi là quyển NN+1 (vd tệp 034 = 卷35).
// Phần không có trong Hiệp kỷ (số 5 gửi Khôn/Cấn) ghi rõ là quy ước, không gán cho sách.
import { BAT_QUAI, type Hao } from './kinh-dich';
import { HOA_GIAP, NAM_SINH_DEN, NAM_SINH_TU, cungPhi, type CungPhi, type Hanh } from './can-chi';

export const NGUON_HIEP_KY = {
  ten: 'Khâm định Hiệp kỷ biện phương thư (欽定協紀辨方書)',
  nam: 'soạn theo lệnh vua Càn Long, xong năm 1739',
  ban: 'Kanripo KR3g0051, bản Văn Uyên Các tứ khố toàn thư',
  url: 'https://github.com/kanripo/KR3g0051',
  giayPhep: 'CC BY-SA 4.0',
  ghiCong: 'Văn bản: Kanripo, CC BY-SA 4.0',
  ngatCau: 'Bản gốc không có dấu câu; dấu câu trong phần trích do xemboi thêm để dễ đọc.',
} as const;

/** Một câu trích nguyên văn: `han` có dấu câu do xemboi thêm; bỏ dấu câu thì phải khớp đúng bản Kanripo. */
export type TrichDan = { han: string; phienAm: string; quyen: number; trang: string };

export const TRICH = {
  cuuCungKienTrach: {
    han: '三元經曰：九宫建宅，男命上元甲子起坎一，中元甲子起巽四，下元甲子起兑七，逆行九宫；女命上元甲子起中五，中元甲子起坤二，下元甲子起艮八，順行九宫。',
    phienAm: 'Tam nguyên kinh viết: Cửu cung kiến trạch, nam mệnh thượng nguyên giáp tý khởi Khảm nhất, trung nguyên giáp tý khởi Tốn tứ, hạ nguyên giáp tý khởi Đoài thất, nghịch hành cửu cung; nữ mệnh thượng nguyên giáp tý khởi trung ngũ, trung nguyên giáp tý khởi Khôn nhị, hạ nguyên giáp tý khởi Cấn bát, thuận hành cửu cung.',
    quyen: 35, trang: '9b',
  },
  caiChinh: {
    han: '世俗誤以上元為中元，遂謂上元起兑七，中元起坎一，下元起巽四。康熙五十六年奉㫖改正。',
    phienAm: 'Thế tục ngộ dĩ thượng nguyên vi trung nguyên, toại vị thượng nguyên khởi Đoài thất, trung nguyên khởi Khảm nhất, hạ nguyên khởi Tốn tứ. Khang Hy ngũ thập lục niên phụng chỉ cải chính.',
    quyen: 35, trang: '10a',
  },
  khangHy23: {
    han: '康熙二十三年甲子，一白入中宫。',
    phienAm: 'Khang Hy nhị thập tam niên giáp tý, nhất bạch nhập trung cung.',
    quyen: 8, trang: '26b',
  },
  daiDuNien: {
    han: '大遊年變卦，相宅家用之。',
    phienAm: 'Đại du niên biến quái, tướng trạch gia dụng chi.',
    quyen: 2, trang: '43a',
  },
  dongTayTuTrach: {
    han: '陽宅之法，以乾兌為老陽，艮坤為老隂，離震為少隂，巽坎為少陽。二老相配為西四宅，二少相配為東四宅，東西各自相配為吉，交錯相配為凶。',
    phienAm: 'Dương trạch chi pháp, dĩ Càn Đoài vi lão dương, Cấn Khôn vi lão âm, Ly Chấn vi thiếu âm, Tốn Khảm vi thiếu dương. Nhị lão tương phối vi Tây tứ trạch, nhị thiếu tương phối vi Đông tứ trạch, Đông Tây các tự tương phối vi cát, giao thác tương phối vi hung.',
    quyen: 2, trang: '44a',
  },
  phienQuai: {
    han: '翻卦之法，皆以上一爻變為生氣貪狼，下二爻變為天醫巨門，三爻俱變為延年武曲，三爻俱不變為伏位輔弼。',
    phienAm: 'Phiên quái chi pháp, giai dĩ thượng nhất hào biến vi Sinh khí Tham lang, hạ nhị hào biến vi Thiên y Cự môn, tam hào câu biến vi Diên niên Vũ khúc, tam hào câu bất biến vi Phục vị Phụ bật.',
    quyen: 2, trang: '44a',
  },
  thuTuSao: {
    han: '以貪狼、廉貞、武曲、文曲、禄存、巨門、破軍、輔弼為序。如乾為本宫，乾上爻變為兌為貪狼，兌中爻變為震為五鬼，震下爻變為坤為武曲，坤中爻變為坎為文曲，坎上爻變為巽為禄存，巽中爻變為艮為巨門，艮下爻變為離為破軍，離中爻變復為乾為輔弼。',
    phienAm: 'Dĩ Tham lang, Liêm trinh, Vũ khúc, Văn khúc, Lộc tồn, Cự môn, Phá quân, Phụ bật vi tự. Như Càn vi bản cung, Càn thượng hào biến vi Đoài vi Tham lang, Đoài trung hào biến vi Chấn vi Ngũ quỷ, Chấn hạ hào biến vi Khôn vi Vũ khúc, Khôn trung hào biến vi Khảm vi Văn khúc, Khảm thượng hào biến vi Tốn vi Lộc tồn, Tốn trung hào biến vi Cấn vi Cự môn, Cấn hạ hào biến vi Ly vi Phá quân, Ly trung hào biến phục vi Càn vi Phụ bật.',
    quyen: 2, trang: '43b',
  },
  sonHuong: {
    han: '子山則必午向。',
    phienAm: 'Tý sơn tắc tất Ngọ hướng.',
    quyen: 2, trang: '2b',
  },
  batCung: {
    han: '戌乾亥屬乾，壬子癸屬坎，丑艮寅屬艮，甲卯乙屬震，辰巽巳屬巽，丙午丁屬離，未坤申屬坤，庚酉辛屬兌，謂之八宫。',
    phienAm: 'Tuất Càn Hợi thuộc Càn, Nhâm Tý Quý thuộc Khảm, Sửu Cấn Dần thuộc Cấn, Giáp Mão Ất thuộc Chấn, Thìn Tốn Tỵ thuộc Tốn, Bính Ngọ Đinh thuộc Ly, Mùi Khôn Thân thuộc Khôn, Canh Dậu Tân thuộc Đoài, vị chi bát cung.',
    quyen: 2, trang: '3a',
  },
} satisfies Record<string, TrichDan>;

/** Ghi trích dẫn: "Hiệp kỷ biện phương thư, quyển 2, tờ 44a". */
export const viTriTrich = (t: TrichDan) => `Hiệp kỷ biện phương thư, quyển ${t.quyen}, tờ ${t.trang}`;

// ---------- 8 cung (quái) dùng trong Bát trạch ----------
export type Nhom = 'Đông' | 'Tây';
export type CungBatTrach = {
  ten: string; han: string; slug: string; kyHieu: string; hao: [Hao, Hao, Hao];
  /** Số Lạc thư (cửu cung). */
  so: number; hanh: Hanh;
  /** Phương theo 24 sơn (quyển 2): ba sơn thuộc cung, sơn giữa là chính phương. */
  phuong: string; son: [string, string, string];
  /** Khoảng độ la bàn (0° = Bắc, theo chiều kim đồng hồ), đầu bao gồm, cuối không. */
  tuDo: number; denDo: number;
  nhom: Nhom;
  /** Lão dương, lão âm, thiếu âm, thiếu dương (quyển 2, tờ 44a). */
  loai: 'lão dương' | 'lão âm' | 'thiếu âm' | 'thiếu dương';
};

const THEM: Record<string, Omit<CungBatTrach, 'ten' | 'hao' | 'hanh' | 'tuDo' | 'denDo'>> = {
  'Càn': { han: '乾', slug: 'can-thien', kyHieu: '☰', so: 6, phuong: 'Tây Bắc', son: ['Tuất', 'Càn', 'Hợi'], nhom: 'Tây', loai: 'lão dương' },
  'Đoài': { han: '兌', slug: 'doai-trach', kyHieu: '☱', so: 7, phuong: 'Tây', son: ['Canh', 'Dậu', 'Tân'], nhom: 'Tây', loai: 'lão dương' },
  'Ly': { han: '離', slug: 'ly-hoa', kyHieu: '☲', so: 9, phuong: 'Nam', son: ['Bính', 'Ngọ', 'Đinh'], nhom: 'Đông', loai: 'thiếu âm' },
  'Chấn': { han: '震', slug: 'chan-loi', kyHieu: '☳', so: 3, phuong: 'Đông', son: ['Giáp', 'Mão', 'Ất'], nhom: 'Đông', loai: 'thiếu âm' },
  'Tốn': { han: '巽', slug: 'ton-phong', kyHieu: '☴', so: 4, phuong: 'Đông Nam', son: ['Thìn', 'Tốn', 'Tỵ'], nhom: 'Đông', loai: 'thiếu dương' },
  'Khảm': { han: '坎', slug: 'kham-thuy', kyHieu: '☵', so: 1, phuong: 'Bắc', son: ['Nhâm', 'Tý', 'Quý'], nhom: 'Đông', loai: 'thiếu dương' },
  'Cấn': { han: '艮', slug: 'can-son', kyHieu: '☶', so: 8, phuong: 'Đông Bắc', son: ['Sửu', 'Cấn', 'Dần'], nhom: 'Tây', loai: 'lão âm' },
  'Khôn': { han: '坤', slug: 'khon-dia', kyHieu: '☷', so: 2, phuong: 'Tây Nam', son: ['Mùi', 'Khôn', 'Thân'], nhom: 'Tây', loai: 'lão âm' },
};

/** 24 sơn theo chiều kim đồng hồ, bắt đầu từ Tý (chính Bắc, 352,5°–7,5°). */
export const HAI_TU_SON = ['Tý', 'Quý', 'Sửu', 'Cấn', 'Dần', 'Giáp', 'Mão', 'Ất', 'Thìn', 'Tốn', 'Tỵ', 'Bính', 'Ngọ', 'Đinh', 'Mùi', 'Khôn', 'Thân', 'Canh', 'Dậu', 'Tân', 'Tuất', 'Càn', 'Hợi', 'Nhâm'] as const;

const doCuaSon = (son: string) => HAI_TU_SON.indexOf(son as (typeof HAI_TU_SON)[number]) * 15;
const chuanDo = (d: number) => ((d % 360) + 360) % 360;

/** 8 cung theo thứ tự tiên thiên (Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn), giống BAT_QUAI. */
export const BAT_CUNG: CungBatTrach[] = BAT_QUAI.map((q) => {
  const t = THEM[q.ten];
  const giua = doCuaSon(t.son[1]);
  return { ten: q.ten, hao: q.hao, hanh: q.hanh as Hanh, ...t, tuDo: chuanDo(giua - 22.5), denDo: chuanDo(giua + 22.5) };
});
export const cungTheoTen = (ten: string) => BAT_CUNG.find((c) => c.ten === ten);
export const cungTheoSlug = (slug: string) => BAT_CUNG.find((c) => c.slug === slug);

// ---------- 8 du niên (đại du niên, quyển 2) ----------
export type DuNien = {
  ten: string; han: string; sao: string; saoHan: string; cat: boolean;
  /** Hào biến so với cung gốc (sơ, trung, thượng): 1 = biến. */
  bien: [Hao, Hao, Hao];
  moTaBien: string;
  trich: TrichDan;
};

export const DU_NIEN_8: DuNien[] = [
  { ten: 'Sinh khí', han: '生氣', sao: 'Tham lang', saoHan: '貪狼', cat: true, bien: [0, 0, 1], moTaBien: 'biến hào trên cùng',
    trich: { han: '是為最吉之象，故小遊年、大遊年皆以為生氣也。', phienAm: 'Thị vi tối cát chi tượng, cố tiểu du niên, đại du niên giai dĩ vi Sinh khí dã.', quyen: 2, trang: '45b–46a' } },
  { ten: 'Thiên y', han: '天醫', sao: 'Cự môn', saoHan: '巨門', cat: true, bien: [1, 1, 0], moTaBien: 'biến hai hào dưới',
    trich: { han: '大遊年以三爻全變之卦老長中少正配為吉，不曰福徳而曰延年，則以此為天醫，皆吉卦也。', phienAm: 'Đại du niên dĩ tam hào toàn biến chi quái lão trưởng trung thiếu chính phối vi cát, bất viết Phúc đức nhi viết Diên niên, tắc dĩ thử vi Thiên y, giai cát quái dã.', quyen: 2, trang: '49b' } },
  { ten: 'Diên niên', han: '延年', sao: 'Vũ khúc', saoHan: '武曲', cat: true, bien: [1, 1, 1], moTaBien: 'biến cả ba hào',
    trich: { han: '相宅家以隂陽正配為吉，故大遊年取皆應之義為延年。', phienAm: 'Tướng trạch gia dĩ âm dương chính phối vi cát, cố đại du niên thủ giai ứng chi nghĩa vi Diên niên.', quyen: 2, trang: '52b' } },
  { ten: 'Phục vị', han: '伏位', sao: 'Phụ bật', saoHan: '輔弼', cat: true, bien: [0, 0, 0], moTaBien: 'không biến hào nào (chính cung đó)',
    trich: { han: '三爻俱不變者，則自得本宫。', phienAm: 'Tam hào câu bất biến giả, tắc tự đắc bản cung.', quyen: 2, trang: '44b' } },
  { ten: 'Họa hại', han: '禍害', sao: 'Lộc tồn', saoHan: '禄存', cat: false, bien: [1, 0, 0], moTaBien: 'biến hào dưới cùng',
    trich: { han: '大遊年既取相尅者為鬼，則以此為禍害，皆不吉也。', phienAm: 'Đại du niên ký thủ tương khắc giả vi quỷ, tắc dĩ thử vi Họa hại, giai bất cát dã.', quyen: 2, trang: '48b' } },
  { ten: 'Lục sát', han: '六煞', sao: 'Văn khúc', saoHan: '文曲', cat: false, bien: [1, 0, 1], moTaBien: 'biến hào trên và hào dưới',
    trich: { han: '大遊年則以其為本宫卦第六變，故為六煞，皆不吉也。', phienAm: 'Đại du niên tắc dĩ kỳ vi bản cung quái đệ lục biến, cố vi Lục sát, giai bất cát dã.', quyen: 2, trang: '50b' } },
  { ten: 'Ngũ quỷ', han: '五鬼', sao: 'Liêm trinh', saoHan: '廉貞', cat: false, bien: [0, 1, 1], moTaBien: 'biến hai hào trên',
    trich: { han: '大遊年則以其老少不相配為凶，又以相尅為鬼，故為五鬼。', phienAm: 'Đại du niên tắc dĩ kỳ lão thiếu bất tương phối vi hung, hựu dĩ tương khắc vi quỷ, cố vi Ngũ quỷ.', quyen: 2, trang: '47b' } },
  { ten: 'Tuyệt mệnh', han: '絶命', sao: 'Phá quân', saoHan: '破軍', cat: false, bien: [0, 1, 0], moTaBien: 'biến hào giữa',
    trich: { han: '是為最凶之象，故小遊年、大遊年皆以為絶命也。', phienAm: 'Thị vi tối hung chi tượng, cố tiểu du niên, đại du niên giai dĩ vi Tuyệt mệnh dã.', quyen: 2, trang: '51b' } },
];
export const duNienTheoTen = (ten: string) => DU_NIEN_8.find((d) => d.ten === ten);

/** Du niên giữa hai cung: so từng hào, hào khác nhau là hào biến (quyển 2, tờ 44a–52b). */
export function duNienGiua(a: string, b: string): DuNien {
  const ca = cungTheoTen(a), cb = cungTheoTen(b);
  if (!ca || !cb) throw new Error(`Không có cung ${a} hoặc ${b}`);
  const bien = ca.hao.map((h, i) => (h === cb.hao[i] ? 0 : 1)).join('');
  return DU_NIEN_8.find((d) => d.bien.join('') === bien)!;
}

/** Phiên quái từ cung gốc theo thứ tự sao (quyển 2, tờ 43b): thượng, trung, hạ, trung, thượng, trung, hạ, trung. */
export function phienQuai(goc: string): { cung: string; sao: string }[] {
  const BUOC = [2, 1, 0, 1, 2, 1, 0, 1];
  const SAO = ['Tham lang', 'Liêm trinh', 'Vũ khúc', 'Văn khúc', 'Lộc tồn', 'Cự môn', 'Phá quân', 'Phụ bật'];
  let hao = [...cungTheoTen(goc)!.hao] as Hao[];
  return BUOC.map((viTri, i) => {
    hao = hao.map((h, k) => (k === viTri ? ((1 - h) as Hao) : h));
    return { cung: BAT_CUNG.find((c) => c.hao.join('') === hao.join(''))!.ten, sao: SAO[i] };
  });
}

// ---------- cung phi ----------
export const NGUYEN = [
  { ten: 'Thượng nguyên', tu: 1864, den: 1923 },
  { ten: 'Trung nguyên', tu: 1924, den: 1983 },
  { ten: 'Hạ nguyên', tu: 1984, den: 2043 },
] as const;
/** Nguyên của năm âm: mốc Khang Hy 23 (1684) là thượng nguyên (quyển 8, tờ 26b); mỗi nguyên 60 năm, ba nguyên 180 năm. */
export function nguyenCuaNam(nam: number): string {
  const k = ((Math.floor((nam - 1684) / 60) % 3) + 3) % 3;
  return NGUYEN[k].ten;
}

export type KetQuaCungPhi = CungPhi & {
  nam: number; gioiTinh: 'nam' | 'nu'; canChi: string; nguyen: string;
  /** Cung dùng để xem Bát trạch (số 5 đã gửi sang Khôn hoặc Cấn). */
  cung: CungBatTrach;
  /** true khi số cửu cung là 5 (trung cung), phải gửi: nam sang Khôn, nữ sang Cấn. */
  guiCung: boolean;
};

export const GHI_CHU_GUI_CUNG = 'Số 5 là trung cung, không có quẻ. Cách phổ biến trong các sách Bát trạch là nam gửi sang Khôn, nữ gửi sang Cấn. Hiệp kỷ biện phương thư không chép quy ước này.';

export function tinhCungPhi(nam: number, gioiTinh: 'nam' | 'nu'): KetQuaCungPhi {
  const cp = cungPhi(nam, gioiTinh);
  const hg = HOA_GIAP[(((nam - 1984) % 60) + 60) % 60];
  return { ...cp, nam, gioiTinh, canChi: hg.ten, nguyen: nguyenCuaNam(nam), cung: cungTheoTen(cp.ten)!, guiCung: cp.so === 5 };
}

/** 8 phương với du niên của cung phi; 4 cát trước (Sinh khí, Thiên y, Diên niên, Phục vị) rồi 4 hung. */
export function batPhuong(cung: string): { cung: CungBatTrach; duNien: DuNien }[] {
  return DU_NIEN_8.map((d) => ({ duNien: d, cung: BAT_CUNG.find((c) => duNienGiua(cung, c.ten) === d)! }));
}

/** Năm sinh (NAM_SINH_TU..NAM_SINH_DEN) có cung phi `ten`, chia nam và nữ. */
export function namTheoCung(ten: string, tu = NAM_SINH_TU, den = NAM_SINH_DEN) {
  const ds = (g: 'nam' | 'nu') => {
    const kq: { nam: number; canChi: string; guiCung: boolean }[] = [];
    for (let y = tu; y <= den; y++) { const c = tinhCungPhi(y, g); if (c.ten === ten) kq.push({ nam: y, canChi: c.canChi, guiCung: c.guiCung }); }
    return kq;
  };
  return { nam: ds('nam'), nu: ds('nu') };
}

// ---------- hướng nhà theo độ la bàn ----------
export type KetQuaHuong = {
  doHuong: number; sonHuong: string; cungHuong: CungBatTrach;
  doToa: number; sonToa: string; cungToa: CungBatTrach;
  /** Nhà gọi theo cung của sơn tọa (lưng nhà): Đông tứ trạch hay Tây tứ trạch. */
  trach: Nhom;
};
export const sonTheoDo = (d: number) => HAI_TU_SON[Math.floor(chuanDo(d + 7.5) / 15) % 24];
export const cungTheoSon = (son: string) => BAT_CUNG.find((c) => c.son.includes(son))!;

/** Hướng (mặt nhà nhìn ra) theo độ; tọa là phía ngược lại (子山則必午向). */
export function xetHuong(doHuong: number): KetQuaHuong {
  const h = chuanDo(doHuong), t = chuanDo(doHuong + 180);
  const cungToa = cungTheoSon(sonTheoDo(t));
  return { doHuong: h, sonHuong: sonTheoDo(h), cungHuong: cungTheoSon(sonTheoDo(h)), doToa: t, sonToa: sonTheoDo(t), cungToa, trach: cungToa.nhom };
}

// ---------- trang ----------
export const duongDanCungPhi = (c: CungBatTrach) => `/phong-thuy/cung-phi/${c.slug}`;
export const TRANG_PHONG_THUY = ['/phong-thuy', '/phong-thuy/cung-phi', '/phong-thuy/bat-trach', '/phong-thuy/huong-nha', ...BAT_CUNG.map(duongDanCungPhi)];

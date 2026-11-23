// Lục hào nạp giáp (trang /kinh-dich/luc-hao). Chỉ phần TÍNH ĐƯỢC, theo Tăng san bốc Dịch (Dã Hạc lão nhân, Thanh; rag_nguon 94):
// tám cung (đoạn 23847), thế ứng (23857), nạp chi trong ngoài (23854), lục thân (23855, 23858), lục thần theo can ngày (23879),
// tuần không (23899). Bảng an sẵn 64 quẻ của sách (23848–23853) dùng để kiểm (tests/trang/luc-hao.test.mjs).
// Không đoán việc: trang chỉ an quẻ.
import { DIA_CHI, THIEN_CAN } from '@/lib/tuvi-v2/am-lich';
import { HANH_CHI, lapLaSoBatTu } from './bat-tu';
import { quanHeHanh, type Hanh } from './can-chi';
import { BAT_QUAI, queTheoHao, type Hao, type Quai, type Que } from './kinh-dich';

export const NGUON_LUC_HAO = {
  ma: 'WS07', tenHanViet: 'Tăng san bốc Dịch', tacGia: 'Dã Hạc lão nhân, Lý Văn Huy san định', nienDai: 'Thanh',
  ghiCong: 'Văn bản: Wikisource, CC BY-SA 4.0', url: 'https://zh.wikisource.org/wiki/增刪卜易',
} as const;

export type TrichLucHao = { doanId: number; nguyenVan: string; viTriViet: string; dich: string };

export const TRICH_LUC_HAO = {
  tamCung: {
    doanId: 23847, viTriViet: 'Chương 2 · Tên 64 quẻ theo tám cung',
    nguyenVan: '乾宮八卦：﹝俱屬金﹞乾爲天，天風姤，天山遁，天地否，風地觀，山地剝，火地晉，火天大有。',
    dich: 'Tám quẻ cung Càn (đều thuộc Kim): Càn vi Thiên, Thiên Phong Cấu, Thiên Sơn Độn, Thiên Địa Bĩ, Phong Địa Quán, Sơn Địa Bác, Hỏa Địa Tấn, Hỏa Thiên Đại Hữu. (Bảy cung kia xếp theo cùng một lối.)',
  },
  theUng: {
    doanId: 23857, viTriViet: 'Chương 6 · An thế ứng',
    nguyenVan: '乾爲天「世」在六﹐天風姤「世」在初﹐天山遁「世」在二﹐天地否「世」在三﹐天地觀「世」在四﹐山地剝「世」在五﹐火地晉「世」在四﹐火天大有「世」退在三。隔世爻兩位卽是應爻﹐餘卦仿此。',
    dich: 'Càn vi Thiên thế ở hào sáu, Thiên Phong Cấu thế ở hào đầu, Thiên Sơn Độn thế ở hào hai, Thiên Địa Bĩ thế ở hào ba, Phong Địa Quán thế ở hào bốn, Sơn Địa Bác thế ở hào năm, Hỏa Địa Tấn thế ở hào bốn, Hỏa Thiên Đại Hữu thế lùi về hào ba. Cách hào thế hai vị là hào ứng; các quẻ khác theo đó mà suy.',
  },
  napChi: {
    doanId: 23854, viTriViet: 'Chương 4 · Nạp chi cho tám quái',
    nguyenVan: '乾在內：子水寅木辰土。乾在外：午火申金戌土。坎在內：寅木辰土午火。坎在外：申金戌土子水。辰在內：辰土午火申金。辰在外：戌土子水寅木。震在內：子水寅木辰土。震在外；午火申金戌土。巽在內：丑土亥水酉金。巽在外：未土巳火卯木。離在內：卯木丑土亥水。離在外：酉金未土巳火。坤在內：未土巳火卯木。坤在外：丑土亥水酉金。兌在內：巳火卯木丑土。兌在外：亥水酉金未土。',
    dich: 'Càn ở trong: Tý Thủy, Dần Mộc, Thìn Thổ; Càn ở ngoài: Ngọ Hỏa, Thân Kim, Tuất Thổ. Khảm ở trong: Dần Mộc, Thìn Thổ, Ngọ Hỏa; Khảm ở ngoài: Thân Kim, Tuất Thổ, Tý Thủy. Cấn ở trong: Thìn Thổ, Ngọ Hỏa, Thân Kim; Cấn ở ngoài: Tuất Thổ, Tý Thủy, Dần Mộc. Chấn ở trong: Tý Thủy, Dần Mộc, Thìn Thổ; Chấn ở ngoài: Ngọ Hỏa, Thân Kim, Tuất Thổ. Tốn ở trong: Sửu Thổ, Hợi Thủy, Dậu Kim; Tốn ở ngoài: Mùi Thổ, Tỵ Hỏa, Mão Mộc. Ly ở trong: Mão Mộc, Sửu Thổ, Hợi Thủy; Ly ở ngoài: Dậu Kim, Mùi Thổ, Tỵ Hỏa. Khôn ở trong: Mùi Thổ, Tỵ Hỏa, Mão Mộc; Khôn ở ngoài: Sửu Thổ, Hợi Thủy, Dậu Kim. Đoài ở trong: Tỵ Hỏa, Mão Mộc, Sửu Thổ; Đoài ở ngoài: Hợi Thủy, Dậu Kim, Mùi Thổ. (Quái trong là ba hào dưới, kể từ hào đầu lên; bản chép ghi nhầm chữ Cấn thành chữ Thìn.)',
  },
  lucThan: {
    doanId: 23855, viTriViet: 'Chương 5 · An lục thân',
    nguyenVan: '乾兌宮金兄、土父、木財、火鬼、水子。乾兌宮八卦都屬金。坎宮水兄、火財、土鬼、金父、木子。坎宮八卦都屬水。坤艮宮土兄、火父、木鬼、水財、金子。坤艮宮八卦都屬土。離宮火兄、水鬼、土子、木父，金財。離宮八卦都屬火。震巽木兄、水父、金鬼、火子、土財。震巽宮八卦都屬木。',
    dich: 'Cung Càn, Đoài: Kim là Huynh đệ, Thổ là Phụ mẫu, Mộc là Thê tài, Hỏa là Quan quỷ, Thủy là Tử tôn; tám quẻ cung Càn, Đoài đều thuộc Kim. Cung Khảm: Thủy là Huynh đệ, Hỏa là Thê tài, Thổ là Quan quỷ, Kim là Phụ mẫu, Mộc là Tử tôn; tám quẻ cung Khảm đều thuộc Thủy. Cung Khôn, Cấn: Thổ là Huynh đệ, Hỏa là Phụ mẫu, Mộc là Quan quỷ, Thủy là Thê tài, Kim là Tử tôn; đều thuộc Thổ. Cung Ly: Hỏa là Huynh đệ, Thủy là Quan quỷ, Thổ là Tử tôn, Mộc là Phụ mẫu, Kim là Thê tài; đều thuộc Hỏa. Cung Chấn, Tốn: Mộc là Huynh đệ, Thủy là Phụ mẫu, Kim là Quan quỷ, Hỏa là Tử tôn, Thổ là Thê tài; đều thuộc Mộc.',
  },
  haoBien: {
    doanId: 23858, viTriViet: 'Chương 7 · Hào động và quẻ biến',
    nguyenVan: '六爻不動則不變，動則必變，…變出之爻安六親者仍照正卦而推，餘卦仿此。',
    dich: 'Sáu hào không động thì không biến, động thì ắt biến. … Hào biến ra an lục thân vẫn theo quẻ chính mà suy; các quẻ khác theo đó.',
  },
  lucThan6: {
    doanId: 23879, viTriViet: 'Chương 18 · Lục thần',
    nguyenVan: '|甲乙日|丙丁日|戊日|己日|庚辛日|壬癸日上爻|元武|靑龍|朱雀|勾陳|滕蛇|白虎',
    dich: 'Bảng lục thần theo can ngày: ngày Giáp Ất, hào đầu Thanh Long; ngày Bính Đinh, hào đầu Chu Tước; ngày Mậu, hào đầu Câu Trần; ngày Kỷ, hào đầu Đằng Xà; ngày Canh Tân, hào đầu Bạch Hổ; ngày Nhâm Quý, hào đầu Huyền Vũ; từ hào đầu lên theo thứ tự Thanh Long, Chu Tước, Câu Trần, Đằng Xà, Bạch Hổ, Huyền Vũ.',
  },
  tuanKhong: {
    doanId: 23899, viTriViet: 'Chương 26 · Tuần không',
    nguyenVan: '甲子旬中戌亥空甲戌旬中申酉空甲申旬中午未空甲午旬中辰巳空甲辰旬中寅卯空甲寅旬中子丑空何謂旬空？如甲子至癸酉日爲一旬，此十日之內，並無戌亥，以爻逢戌亥爲空亡，又名旬空，餘仿此。',
    dich: 'Tuần Giáp Tý không Tuất Hợi; tuần Giáp Tuất không Thân Dậu; tuần Giáp Thân không Ngọ Mùi; tuần Giáp Ngọ không Thìn Tỵ; tuần Giáp Thìn không Dần Mão; tuần Giáp Dần không Tý Sửu. Thế nào là tuần không? Như từ ngày Giáp Tý đến ngày Quý Dậu là một tuần, trong mười ngày ấy không có Tuất, Hợi, nên hào gặp Tuất, Hợi là không vong, còn gọi là tuần không; các tuần khác theo đó.',
  },
  lucHop: {
    doanId: 23881, viTriViet: 'Chương 19 · Lục hợp',
    nguyenVan: '卦逢六合者卽如天地否卦內外六爻自相和合是也，不動亦是。六沖卦變六和卦者，假令得乾爲天乃是八純六沖卦',
    dich: 'Quẻ gặp lục hợp, như quẻ Thiên Địa Bĩ, sáu hào trong ngoài tự hợp với nhau, không động cũng vậy. … Như được Càn vi Thiên, đó là quẻ bát thuần lục xung.',
  },
} as const satisfies Record<string, TrichLucHao>;

export const LUC_THAN = ['Phụ mẫu', 'Huynh đệ', 'Quan quỷ', 'Thê tài', 'Tử tôn'] as const;
export type LucThan = (typeof LUC_THAN)[number];
export const LUC_THAN_6 = ['Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ'] as const;
export type LucThan6 = (typeof LUC_THAN_6)[number];

/** Nạp chi (chỉ số Tý 0 … Hợi 11), [trong: hào 1, 2, 3], [ngoài: hào 4, 5, 6]. */
const NAP_CHI: Record<string, [number[], number[]]> = {
  'Càn': [[0, 2, 4], [6, 8, 10]], 'Khảm': [[2, 4, 6], [8, 10, 0]], 'Cấn': [[4, 6, 8], [10, 0, 2]], 'Chấn': [[0, 2, 4], [6, 8, 10]],
  'Tốn': [[1, 11, 9], [7, 5, 3]], 'Ly': [[3, 1, 11], [9, 7, 5]], 'Khôn': [[7, 5, 3], [1, 11, 9]], 'Đoài': [[5, 3, 1], [11, 9, 7]],
};

/** Thứ tự tám cung như sách liệt kê (23847). */
export const THU_TU_CUNG = ['Càn', 'Khảm', 'Cấn', 'Chấn', 'Tốn', 'Ly', 'Khôn', 'Đoài'] as const;
const VI_TRI_THE = [6, 1, 2, 3, 4, 5, 4, 3];
const TEN_THU_TU = ['Bát thuần', 'Nhất thế', 'Nhị thế', 'Tam thế', 'Tứ thế', 'Ngũ thế', 'Du hồn', 'Quy hồn'];

export type QueTrongCung = { que: Que; cung: Quai; thuTu: number; tenThuTu: string; the: number; ung: number };

/** 64 quẻ xếp vào 8 cung: từ quẻ thuần, lần lượt đổi hào 1 → 5, rồi đổi lại hào 4 (du hồn), rồi đổi lại ba hào dưới (quy hồn). */
export const TAM_CUNG: QueTrongCung[] = THU_TU_CUNG.flatMap((ten) => {
  const cung = BAT_QUAI.find((q) => q.ten === ten)!;
  let h = [...cung.hao, ...cung.hao] as Hao[];
  const lat = (i: number) => { h = h.map((x, j) => (j === i ? ((1 - x) as Hao) : x)); };
  const ds: Hao[][] = [[...h]];
  for (const i of [0, 1, 2, 3, 4]) { lat(i); ds.push([...h]); }
  lat(3); ds.push([...h]);
  lat(0); lat(1); lat(2); ds.push([...h]);
  return ds.map((hao, thuTu) => {
    const the = VI_TRI_THE[thuTu];
    return { que: queTheoHao(hao), cung, thuTu, tenThuTu: TEN_THU_TU[thuTu], the, ung: the > 3 ? the - 3 : the + 3 };
  });
});

export const cungCuaQue = (soQue: number) => TAM_CUNG.find((x) => x.que.so === soQue)!;

export function lucThanCua(hanhCung: Hanh, hanhHao: Hanh): LucThan {
  if (hanhCung === hanhHao) return 'Huynh đệ';
  const q = quanHeHanh(hanhCung);
  if (q.duocSinhBoi === hanhHao) return 'Phụ mẫu';
  if (q.sinhRa === hanhHao) return 'Tử tôn';
  if (q.biKhacBoi === hanhHao) return 'Quan quỷ';
  return 'Thê tài';
}

/** Chi của 6 hào (từ hào đầu) theo nạp chi của quái trong và quái ngoài. */
export function chiCuaQue(que: Que): number[] {
  return [...NAP_CHI[que.ha.ten][0], ...NAP_CHI[que.thuong.ten][1]];
}

/** Hai chi tuần không của ngày (can, chi theo chỉ số). */
export function tuanKhong(can: number, chi: number): [number, number] {
  const dau = (((chi - can) % 12) + 12) % 12;
  return [(dau + 10) % 12, (dau + 11) % 12];
}

/** Hào đầu bắt đầu từ thần nào theo can ngày (23879). */
export function lucThanTheoCan(can: number): LucThan6[] {
  const dau = [0, 0, 1, 1, 2, 3, 4, 4, 5, 5][can];
  return Array.from({ length: 6 }, (_, i) => LUC_THAN_6[(dau + i) % 6]);
}

const xung = (a: number, b: number) => Math.abs(a - b) === 6;
const hop = (a: number, b: number) => (a + b) % 12 === 1;

export type HaoAn = {
  viTri: number;
  hao: Hao;
  dong: boolean;
  chi: string;
  hanh: Hanh;
  lucThan: LucThan;
  theUng: 'Thế' | 'Ứng' | null;
  lucThan6: LucThan6 | null;
  tuanKhong: boolean;
  nguyetPha: boolean;
  /** Chỉ với hào động: chi, hành và lục thân của hào biến (lục thân theo cung quẻ chính). */
  bien: { chi: string; hanh: Hanh; lucThan: LucThan } | null;
};

export type QueAn = {
  que: Que;
  cung: Quai;
  hanhCung: Hanh;
  tenThuTu: string;
  queBien: Que | null;
  cungQueBien: Quai | null;
  /** 6 hào từ dưới lên. */
  hao: HaoAn[];
  lucXung: boolean;
  lucHop: boolean;
  thoiGian: { thang: string; ngay: string; tuanKhong: [string, string] } | null;
};

/**
 * An quẻ lục hào. `hao`: 6 hào từ dưới lên; `haoDong`: số thứ tự hào động (1..6).
 * `thoiGian` (tùy chọn): can chi tháng (theo tiết) và ngày để an lục thần, tuần không, nguyệt phá.
 */
export function anQue(hao: Hao[], haoDong: number[], thoiGian?: { canNgay: number; chiNgay: number; canThang: number; chiThang: number }): QueAn {
  const que = queTheoHao(hao);
  const vt = cungCuaQue(que.so);
  const hanhCung = vt.cung.hanh as Hanh;
  const chi = chiCuaQue(que);
  const bienHao = hao.map((x, i) => (haoDong.includes(i + 1) ? ((1 - x) as Hao) : x));
  const queBien = haoDong.length ? queTheoHao(bienHao) : null;
  const chiBien = queBien ? chiCuaQue(queBien) : null;
  const than6 = thoiGian ? lucThanTheoCan(thoiGian.canNgay) : null;
  const khong = thoiGian ? tuanKhong(thoiGian.canNgay, thoiGian.chiNgay) : null;
  const ds: HaoAn[] = hao.map((x, i) => {
    const c = chi[i];
    const dong = haoDong.includes(i + 1);
    return {
      viTri: i + 1, hao: x, dong, chi: DIA_CHI[c], hanh: HANH_CHI[c], lucThan: lucThanCua(hanhCung, HANH_CHI[c]),
      theUng: vt.the === i + 1 ? 'Thế' : vt.ung === i + 1 ? 'Ứng' : null,
      lucThan6: than6 ? than6[i] : null,
      tuanKhong: khong ? khong.includes(c) : false,
      nguyetPha: thoiGian ? xung(c, thoiGian.chiThang) : false,
      bien: dong && chiBien ? { chi: DIA_CHI[chiBien[i]], hanh: HANH_CHI[chiBien[i]], lucThan: lucThanCua(hanhCung, HANH_CHI[chiBien[i]]) } : null,
    };
  });
  return {
    que, cung: vt.cung, hanhCung, tenThuTu: vt.tenThuTu, queBien, cungQueBien: queBien ? cungCuaQue(queBien.so).cung : null, hao: ds,
    lucXung: [0, 1, 2].every((i) => xung(chi[i], chi[i + 3])),
    lucHop: [0, 1, 2].every((i) => hop(chi[i], chi[i + 3])),
    thoiGian: thoiGian && khong ? {
      thang: `${THIEN_CAN[thoiGian.canThang]} ${DIA_CHI[thoiGian.chiThang]}`,
      ngay: `${THIEN_CAN[thoiGian.canNgay]} ${DIA_CHI[thoiGian.chiNgay]}`,
      tuanKhong: [DIA_CHI[khong[0]], DIA_CHI[khong[1]]],
    } : null,
  };
}

/** Can chi tháng (theo tiết) và ngày của một thời điểm giờ Việt Nam, để an quẻ. */
export function thoiGianAnQue(ngay: number, thang: number, nam: number, gio: number, phut = 0) {
  const ls = lapLaSoBatTu({ ngay, thang, nam, gio, phut, gioiTinh: 'nam' });
  const tThang = ls.tru[1], tNgay = ls.tru[2];
  return {
    canThang: THIEN_CAN.indexOf(tThang.can as never), chiThang: DIA_CHI.indexOf(tThang.chi as never),
    canNgay: THIEN_CAN.indexOf(tNgay.can as never), chiNgay: DIA_CHI.indexOf(tNgay.chi as never),
  };
}

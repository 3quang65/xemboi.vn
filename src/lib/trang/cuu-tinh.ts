// Cửu tinh (Tử bạch) năm và tháng: sao nào vào trung cung, bay tới phương nào.
// Nguồn: 欽定協紀辨方書 Khâm định Hiệp kỷ biện phương thư (1739), bản Kanripo KR3g0051 (CC BY-SA 4.0).
//   卷8 tờ 25a–28a: cửu cung Lạc thư, "三元年九星入中宫", "三元月九星入中宫", cách thuận bố cửu cung.
//   卷2 tờ 28b: tên sao và hành của 9 sao.
//   卷15–19 年表 (Kanripo thiếu 卷14): vị trí nhất bạch, lục bạch, bát bạch, cửu tử từng năm, dùng làm bộ đối chiếu trong test.
// Chỉ có phần tính và nguyên văn. Không luận hóa giải, không gợi ý vật phẩm (định vị ở docs/v2/04).
import { lietKeTietKhi } from '@/lib/tuvi-v2/tiet-khi.mjs';
import { cungTheoTen, type TrichDan } from './phong-thuy';
import type { Hanh } from './can-chi';

export type SaoCuuTinh = {
  so: number;
  /** Tên theo màu, vd "Nhất bạch". */
  ten: string;
  han: string;
  /** Tên theo Bắc Đẩu ở 卷2, vd "Tham lang". */
  tenBacDau: string;
  hanh: Hanh;
};

export const CUU_TINH: readonly SaoCuuTinh[] = [
  { so: 1, ten: 'Nhất bạch', han: '一白', tenBacDau: 'Tham lang', hanh: 'Thủy' },
  { so: 2, ten: 'Nhị hắc', han: '二黑', tenBacDau: 'Cự môn', hanh: 'Thổ' },
  { so: 3, ten: 'Tam bích', han: '三碧', tenBacDau: 'Lộc tồn', hanh: 'Mộc' },
  { so: 4, ten: 'Tứ lục', han: '四緑', tenBacDau: 'Văn khúc', hanh: 'Mộc' },
  { so: 5, ten: 'Ngũ hoàng', han: '五黄', tenBacDau: 'Liêm trinh', hanh: 'Thổ' },
  { so: 6, ten: 'Lục bạch', han: '六白', tenBacDau: 'Vũ khúc', hanh: 'Kim' },
  { so: 7, ten: 'Thất xích', han: '七赤', tenBacDau: 'Phá quân', hanh: 'Kim' },
  { so: 8, ten: 'Bát bạch', han: '八白', tenBacDau: 'Tả phụ', hanh: 'Thổ' },
  { so: 9, ten: 'Cửu tử', han: '九紫', tenBacDau: 'Hữu bật', hanh: 'Hỏa' },
];
export const saoSo = (so: number) => CUU_TINH[so - 1];

export const TRICH_CUU_TINH = {
  lacThu: {
    han: '一白居坎，二黑居坤，三碧居震，四緑居巽，五黄居中，六白居乾，七赤居兌，八白居艮，九紫居離。',
    phienAm: 'Nhất bạch cư Khảm, nhị hắc cư Khôn, tam bích cư Chấn, tứ lục cư Tốn, ngũ hoàng cư trung, lục bạch cư Càn, thất xích cư Đoài, bát bạch cư Cấn, cửu tử cư Ly.',
    quyen: 8, trang: '25a',
  },
  saoNam: {
    han: '攷原曰：上元甲子中宫起一白，中元甲子起四緑，下元甲子起七赤，三元一百八十年而一週，葢一百八十者，以宫數九與花甲六十俱可以度盡也。逐年逆轉。',
    phienAm: 'Khảo nguyên viết: Thượng nguyên giáp tý trung cung khởi nhất bạch, trung nguyên giáp tý khởi tứ lục, hạ nguyên giáp tý khởi thất xích, tam nguyên nhất bách bát thập niên nhi nhất chu, cái nhất bách bát thập giả, dĩ cung số cửu dữ hoa giáp lục thập câu khả dĩ độ tận dã. Trục niên nghịch chuyển.',
    quyen: 8, trang: '26a',
  },
  thuanBo: {
    han: '以其年所值星入中宫順布九宫，如康熙二十三年甲子一白入中宫，二黑在乾，三碧在兌，四緑在艮，五黄在離，六白在坎，七赤在坤，八白在震，九紫在巽。',
    phienAm: 'Dĩ kỳ niên sở trị tinh nhập trung cung thuận bố cửu cung, như Khang Hy nhị thập tam niên giáp tý nhất bạch nhập trung cung, nhị hắc tại Càn, tam bích tại Đoài, tứ lục tại Cấn, ngũ hoàng tại Ly, lục bạch tại Khảm, thất xích tại Khôn, bát bạch tại Chấn, cửu tử tại Tốn.',
    quyen: 8, trang: '26b',
  },
  saoThang: {
    han: '以子午卯酉年為上元，正月起八白；辰戌丑未年為中元，正月起五黄；寅申巳亥年為下元，正月起二黑；逐月逆轉，亦以其月所值星入中宫順布九宫，與年九星同。',
    phienAm: 'Dĩ Tý Ngọ Mão Dậu niên vi thượng nguyên, chính nguyệt khởi bát bạch; Thìn Tuất Sửu Mùi niên vi trung nguyên, chính nguyệt khởi ngũ hoàng; Dần Thân Tỵ Hợi niên vi hạ nguyên, chính nguyệt khởi nhị hắc; trục nguyệt nghịch chuyển, diệc dĩ kỳ nguyệt sở trị tinh nhập trung cung thuận bố cửu cung, dữ niên cửu tinh đồng.',
    quyen: 8, trang: '27b–28a',
  },
  tenVaHanh: {
    han: '以九宫而論，則貪狼為一白屬水，巨門為二黑屬土，禄存為三碧，文曲為四緑屬木，廉貞為五黄屬土，武曲為六白，破軍為七赤屬金，左輔為八白屬土，右弼為九紫屬火。',
    phienAm: 'Dĩ cửu cung nhi luận, tắc Tham lang vi nhất bạch thuộc Thủy, Cự môn vi nhị hắc thuộc Thổ, Lộc tồn vi tam bích, Văn khúc vi tứ lục thuộc Mộc, Liêm trinh vi ngũ hoàng thuộc Thổ, Vũ khúc vi lục bạch, Phá quân vi thất xích thuộc Kim, Tả phụ vi bát bạch thuộc Thổ, Hữu bật vi cửu tử thuộc Hỏa.',
    quyen: 2, trang: '28b',
  },
} satisfies Record<string, TrichDan>;

/** Năm và tháng tính theo tiết khí. Hiệp kỷ chỉ ghi "chính nguyệt"; cách tính theo tiết là cách các sách lịch dùng. */
export const GHI_CHU_MOC =
  'Năm Cửu tinh đổi ở tiết Lập xuân (khoảng 4/2 dương lịch), không phải ở Tết âm lịch. Tháng cũng tính theo tiết: tháng giêng bắt đầu từ Lập xuân, tháng hai từ Kinh trập, và cứ thế. Hiệp kỷ chỉ ghi "chính nguyệt"; tính theo tiết là cách các sách lịch dùng.';

/** 9 cung theo thứ tự thuận bố (trung, Càn, Đoài, Cấn, Ly, Khảm, Khôn, Chấn, Tốn), tức số Lạc thư 5, 6, 7, 8, 9, 1, 2, 3, 4. */
export type CungCuuTinh = { ten: string; han: string; phuong: string; soLacThu: number };
const TRUNG_CUNG: CungCuuTinh = { ten: 'Trung cung', han: '中', phuong: 'Giữa nhà', soLacThu: 5 };
export const CUU_CUNG: readonly CungCuuTinh[] = [
  TRUNG_CUNG,
  ...['Càn', 'Đoài', 'Cấn', 'Ly', 'Khảm', 'Khôn', 'Chấn', 'Tốn'].map((ten) => {
    const c = cungTheoTen(ten)!;
    return { ten: c.ten, han: c.han, phuong: c.phuong, soLacThu: c.so };
  }),
];

const mod9 = (n: number) => ((n % 9) + 9) % 9;
/** Sao rơi vào cung có số Lạc thư `p` khi sao `trung` vào trung cung (thuận bố). */
export const saoTaiCung = (trung: number, p: number) => mod9(trung - 1 + p - 5) + 1;

export type BanCuuTinh = { trung: number; cung: (CungCuuTinh & { sao: SaoCuuTinh })[] };

/** Bàn cửu tinh khi sao `trung` vào trung cung. `cung` theo thứ tự CUU_CUNG. */
export function banCuuTinh(trung: number): BanCuuTinh {
  if (!Number.isInteger(trung) || trung < 1 || trung > 9) throw new RangeError('Sao trung cung phải từ 1 đến 9');
  return { trung, cung: CUU_CUNG.map((c) => ({ ...c, sao: saoSo(saoTaiCung(trung, c.soLacThu)) })) };
}

/** Cung (phương) có sao `so` trên bàn. */
export const cungCuaSao = (ban: BanCuuTinh, so: number) => ban.cung.find((c) => c.sao.so === so)!;

/** Sao trung cung của năm (năm tính từ Lập xuân). Theo đúng câu 卷8 tờ 26a: mốc 1684 thượng nguyên. */
export function saoNam(nam: number): number {
  const lech = (((nam - 1684) % 180) + 180) % 180;
  const nguyen = Math.floor(lech / 60);
  return mod9([1, 4, 7][nguyen] - 1 - (lech % 60)) + 1;
}

/** Chi của năm, 0 = Tý. */
const chiNam = (nam: number) => (((nam - 4) % 12) + 12) % 12;
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
/** Sao khởi tháng giêng theo chi năm (卷8 tờ 27b–28a). */
const KHOI_THANG = [8, 5, 2]; // Tý Ngọ Mão Dậu; Thìn Tuất Sửu Mùi; Dần Thân Tỵ Hợi
const nhomChi = (chi: number) => (chi % 3 === 0 ? 0 : chi % 3 === 1 ? 1 : 2);

/** Sao trung cung của tháng tiết `thang` (1 = tháng Dần, bắt đầu từ Lập xuân; 12 = tháng Sửu) trong năm `nam`. */
export function saoThang(nam: number, thang: number): number {
  if (!Number.isInteger(thang) || thang < 1 || thang > 12) throw new RangeError('Tháng tiết từ 1 đến 12');
  return mod9(KHOI_THANG[nhomChi(chiNam(nam))] - 1 - (thang - 1)) + 1;
}

/** Tên tiết mở đầu tháng tiết 1..12. */
export const TIET_DAU_THANG = ['Lập xuân', 'Kinh trập', 'Thanh minh', 'Lập hạ', 'Mang chủng', 'Tiểu thử', 'Lập thu', 'Bạch lộ', 'Hàn lộ', 'Lập đông', 'Đại tuyết', 'Tiểu hàn'];
/** Kinh độ Mặt Trời của tiết mở đầu tháng tiết `thang`. */
const kinhDoTiet = (thang: number) => (315 + (thang - 1) * 30) % 360;

export const NAM_CUU_TINH_TU = 1901;
export const NAM_CUU_TINH_DEN = 2099;

export type ThangCuuTinh = { thang: number; chi: string; tiet: string; batDau: Date; ban: BanCuuTinh };
export type NamCuuTinh = {
  nam: number; canChi: string; nguyen: string; batDau: Date; ketThuc: Date;
  ban: BanCuuTinh; thang: ThangCuuTinh[];
};

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const canChiNam = (nam: number) => `${CAN[(((nam - 4) % 10) + 10) % 10]} ${CHI[chiNam(nam)]}`;
const NGUYEN_NAM = ['Thượng nguyên', 'Trung nguyên', 'Hạ nguyên'];

function mocTiet(namDuong: number, kinhDo: number): Date {
  const m = (lietKeTietKhi(namDuong) as { kinhDo: number; thoiDiem: Date }[]).find((t) => t.kinhDo === kinhDo);
  if (!m) throw new Error(`Thiếu tiết ${kinhDo}° năm ${namDuong}`);
  return m.thoiDiem;
}

/** Bàn cửu tinh năm `nam` và 12 tháng, kèm thời điểm đổi (giờ UTC trong Date). */
export function cuuTinhNam(nam: number): NamCuuTinh {
  if (!Number.isInteger(nam) || nam < NAM_CUU_TINH_TU || nam > NAM_CUU_TINH_DEN) {
    throw new RangeError(`Năm trong khoảng ${NAM_CUU_TINH_TU}–${NAM_CUU_TINH_DEN}`);
  }
  const thang: ThangCuuTinh[] = Array.from({ length: 12 }, (_, i) => {
    const t = i + 1;
    // Tháng 12 (Sửu) bắt đầu ở Tiểu hàn, rơi vào đầu năm dương lịch sau.
    const batDau = mocTiet(t === 12 ? nam + 1 : nam, kinhDoTiet(t));
    return { thang: t, chi: CHI[(t + 1) % 12], tiet: TIET_DAU_THANG[i], batDau, ban: banCuuTinh(saoThang(nam, t)) };
  });
  const lech = (((nam - 1684) % 180) + 180) % 180;
  return {
    nam, canChi: canChiNam(nam), nguyen: NGUYEN_NAM[Math.floor(lech / 60)],
    batDau: thang[0].batDau, ketThuc: mocTiet(nam + 1, 315),
    ban: banCuuTinh(saoNam(nam)), thang,
  };
}

/** Năm tiết và tháng tiết chứa thời điểm `d`. */
export function thangTietTai(d: Date): { nam: number; thang: number } {
  const y = Number(new Date(d.getTime() + 7 * 3600000).getUTCFullYear());
  const nam = d < mocTiet(y, 315) ? y - 1 : y;
  let thang = 1;
  for (let t = 2; t <= 12; t++) if (d >= mocTiet(t === 12 ? nam + 1 : nam, kinhDoTiet(t))) thang = t;
  return { nam, thang };
}

export const duongDanCuuTinh = (nam: number) => `/phong-thuy/cuu-tinh/${nam}`;
/** Năm có trang riêng. Năm khác vẫn tra được trên trang chính. */
export const NAM_TRANG_CUU_TINH = Array.from({ length: 16 }, (_, i) => 2020 + i);
export const TRANG_CUU_TINH = ['/phong-thuy/cuu-tinh', ...NAM_TRANG_CUU_TINH.map(duongDanCuuTinh)];

/** Câu tả bảng năm của Hiệp kỷ, chỉ nói điều sách ghi (không thêm cát hung cho 5 sao còn lại). */
export const GHI_CHU_BON_SAO =
  'Trong bảng từng năm (quyển 15–19), Hiệp kỷ chỉ ghi chỗ của Nhất bạch, Lục bạch, Bát bạch và Cửu tử, đặt dưới mục "Khai sơn lập hướng tu phương cát" (開山立向修方吉). Năm sao còn lại sách không ghi trong mục này.';

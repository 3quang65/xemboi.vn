// Xem tuổi vợ chồng và tuổi xông đất (docs/v2/19 F4). Chỉ đối chiếu các bảng quan hệ truyền thống, ghi rõ từng tiêu chí;
// không cộng thành "điểm số phán quyết", không lời hù dọa (quy tắc nội dung docs/v2/04, 07).
// Bảng: thiên can ngũ hợp và tương xung; địa chi tam hợp, lục hợp, lục xung, lục hại, tứ hành xung;
// ngũ hành nạp âm sinh khắc; du niên Bát trạch theo cung phi (Bát Trạch Minh Cảnh).
import { DIA_CHI, THIEN_CAN, canChiNam } from '@/lib/tuvi-v2/am-lich';
import { HOA_GIAP, cungPhi, quanHeHanh, type Hanh } from './can-chi';

export type MucDanhGia = 'tot' | 'binh' | 'xau';
export type TieuChi = { ma: string; ten: string; muc: MucDanhGia; giaiThich: string };

const CAN_HOP: [number, number][] = [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]]; // Giáp–Kỷ, Ất–Canh, Bính–Tân, Đinh–Nhâm, Mậu–Quý
const CAN_XUNG: [number, number][] = [[0, 6], [1, 7], [2, 8], [3, 9]]; // Giáp–Canh, Ất–Tân, Bính–Nhâm, Đinh–Quý
const LUC_HOP: [number, number][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
const LUC_HAI: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
const TU_HANH_XUNG = [[2, 8, 5, 11], [0, 6, 3, 9], [4, 10, 1, 7]]; // Dần Thân Tỵ Hợi; Tý Ngọ Mão Dậu; Thìn Tuất Sửu Mùi

const cap = (ds: [number, number][], a: number, b: number) => ds.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

export function quanHeCan(a: number, b: number): TieuChi {
  const ten = `Thiên can ${THIEN_CAN[a]} – ${THIEN_CAN[b]}`;
  if (cap(CAN_HOP, a, b)) return { ma: 'can', ten, muc: 'tot', giaiThich: `${THIEN_CAN[a]} và ${THIEN_CAN[b]} thuộc ngũ hợp thiên can.` };
  if (cap(CAN_XUNG, a, b)) return { ma: 'can', ten, muc: 'xau', giaiThich: `${THIEN_CAN[a]} và ${THIEN_CAN[b]} là cặp can tương xung.` };
  return { ma: 'can', ten, muc: 'binh', giaiThich: 'Không thuộc cặp hợp hay xung.' };
}

export function quanHeChi(a: number, b: number): TieuChi {
  const ten = `Địa chi ${DIA_CHI[a]} – ${DIA_CHI[b]}`;
  if (a !== b && (a - b + 12) % 4 === 0) return { ma: 'chi', ten, muc: 'tot', giaiThich: `${DIA_CHI[a]} và ${DIA_CHI[b]} cùng nhóm tam hợp.` };
  if (cap(LUC_HOP, a, b)) return { ma: 'chi', ten, muc: 'tot', giaiThich: `${DIA_CHI[a]} và ${DIA_CHI[b]} là cặp lục hợp.` };
  if ((a - b + 12) % 12 === 6) return { ma: 'chi', ten, muc: 'xau', giaiThich: `${DIA_CHI[a]} và ${DIA_CHI[b]} là cặp lục xung (cũng thuộc tứ hành xung).` };
  if (cap(LUC_HAI, a, b)) return { ma: 'chi', ten, muc: 'xau', giaiThich: `${DIA_CHI[a]} và ${DIA_CHI[b]} là cặp lục hại.` };
  if (a !== b && TU_HANH_XUNG.some((n) => n.includes(a) && n.includes(b))) return { ma: 'chi', ten, muc: 'xau', giaiThich: `${DIA_CHI[a]} và ${DIA_CHI[b]} cùng nhóm tứ hành xung.` };
  return { ma: 'chi', ten, muc: 'binh', giaiThich: a === b ? 'Cùng một chi.' : 'Không thuộc nhóm hợp hay xung.' };
}

export function quanHeNapAm(a: Hanh, b: Hanh, tenA = 'Người thứ nhất', tenB = 'người thứ hai'): TieuChi {
  const ten = `Ngũ hành nạp âm ${a} – ${b}`;
  const q = quanHeHanh(a);
  if (a === b) return { ma: 'nap-am', ten, muc: 'binh', giaiThich: 'Cùng hành (bình hòa).' };
  if (q.sinhRa === b) return { ma: 'nap-am', ten, muc: 'tot', giaiThich: `${a} sinh ${b}: ${tenA} sinh cho ${tenB}.` };
  if (q.duocSinhBoi === b) return { ma: 'nap-am', ten, muc: 'tot', giaiThich: `${b} sinh ${a}: ${tenB} sinh cho ${tenA.toLowerCase()}.` };
  if (q.khac === b) return { ma: 'nap-am', ten, muc: 'xau', giaiThich: `${a} khắc ${b}.` };
  return { ma: 'nap-am', ten, muc: 'xau', giaiThich: `${b} khắc ${a}.` };
}

// Du niên Bát trạch: hàng = cung người 1, cột = cung người 2; thứ tự Càn, Khảm, Cấn, Chấn, Tốn, Ly, Khôn, Đoài.
const BAT_CUNG = ['Càn', 'Khảm', 'Cấn', 'Chấn', 'Tốn', 'Ly', 'Khôn', 'Đoài'];
const DU_NIEN: string[][] = [
  ['Phục vị', 'Lục sát', 'Thiên y', 'Ngũ quỷ', 'Họa hại', 'Tuyệt mệnh', 'Diên niên', 'Sinh khí'],
  ['Lục sát', 'Phục vị', 'Ngũ quỷ', 'Thiên y', 'Sinh khí', 'Diên niên', 'Tuyệt mệnh', 'Họa hại'],
  ['Thiên y', 'Ngũ quỷ', 'Phục vị', 'Lục sát', 'Tuyệt mệnh', 'Họa hại', 'Sinh khí', 'Diên niên'],
  ['Ngũ quỷ', 'Thiên y', 'Lục sát', 'Phục vị', 'Diên niên', 'Sinh khí', 'Họa hại', 'Tuyệt mệnh'],
  ['Họa hại', 'Sinh khí', 'Tuyệt mệnh', 'Diên niên', 'Phục vị', 'Thiên y', 'Ngũ quỷ', 'Lục sát'],
  ['Tuyệt mệnh', 'Diên niên', 'Họa hại', 'Sinh khí', 'Thiên y', 'Phục vị', 'Lục sát', 'Ngũ quỷ'],
  ['Diên niên', 'Tuyệt mệnh', 'Sinh khí', 'Họa hại', 'Ngũ quỷ', 'Lục sát', 'Phục vị', 'Thiên y'],
  ['Sinh khí', 'Họa hại', 'Diên niên', 'Tuyệt mệnh', 'Lục sát', 'Ngũ quỷ', 'Thiên y', 'Phục vị'],
];
const DU_NIEN_TOT = new Set(['Sinh khí', 'Thiên y', 'Diên niên', 'Phục vị']);

export function duNien(cungA: string, cungB: string): string {
  return DU_NIEN[BAT_CUNG.indexOf(cungA)][BAT_CUNG.indexOf(cungB)];
}

// ---------- vợ chồng ----------
export type NguoiXem = { nam: number; canChi: string; napAm: string; hanh: Hanh; cungPhi: string };
export type KetQuaVoChong = { chong: NguoiXem; vo: NguoiXem; tieuChi: TieuChi[]; dem: Record<MucDanhGia, number> };

const nguoi = (nam: number, gioiTinh: 'nam' | 'nu'): NguoiXem => {
  const cc = canChiNam(nam);
  const hg = HOA_GIAP.find((h) => h.ten === cc.ten)!;
  return { nam, canChi: cc.ten, napAm: hg.napAm, hanh: hg.hanh, cungPhi: cungPhi(nam, gioiTinh).ten };
};

export const NAM_XEM_TUOI_TU = 1930;
export const NAM_XEM_TUOI_DEN = 2010;

/** Đối chiếu tuổi chồng (năm âm sinh) và vợ theo 4 tiêu chí truyền thống. */
export function xemTuoiVoChong(namChong: number, namVo: number): KetQuaVoChong {
  for (const y of [namChong, namVo]) if (!Number.isInteger(y) || y < NAM_XEM_TUOI_TU || y > NAM_XEM_TUOI_DEN) throw new RangeError(`Năm sinh cần trong khoảng ${NAM_XEM_TUOI_TU}–${NAM_XEM_TUOI_DEN}`);
  const chong = nguoi(namChong, 'nam'), vo = nguoi(namVo, 'nu');
  const ccC = canChiNam(namChong), ccV = canChiNam(namVo);
  const dn = duNien(chong.cungPhi, vo.cungPhi);
  const tieuChi: TieuChi[] = [
    { ...quanHeNapAm(chong.hanh, vo.hanh, 'Chồng', 'vợ'), ten: `Mệnh (nạp âm): ${chong.napAm} – ${vo.napAm}` },
    quanHeCan(ccC.can, ccV.can),
    quanHeChi(ccC.chi, ccV.chi),
    { ma: 'cung-phi', ten: `Cung phi (Bát trạch): ${chong.cungPhi} – ${vo.cungPhi}`, muc: DU_NIEN_TOT.has(dn) ? 'tot' : 'xau', giaiThich: `Hai cung phối thành ${dn}${DU_NIEN_TOT.has(dn) ? ' (thuộc nhóm du niên tốt)' : ' (thuộc nhóm du niên không cát)'}.` },
  ];
  const dem = { tot: 0, binh: 0, xau: 0 } as Record<MucDanhGia, number>;
  tieuChi.forEach((t) => dem[t.muc]++);
  return { chong, vo, tieuChi, dem };
}

// ---------- xông đất ----------
export type UngVienXongDat = { nam: number; canChi: string; napAm: string; tuoiAm: number; tot: number; xau: number; tieuChi: TieuChi[] };

/**
 * Gợi ý tuổi người xông đất cho gia chủ sinh năm `namChu`, Tết năm âm `namTet`.
 * Tiêu chí: chi và can của khách so với năm Tết và gia chủ, nạp âm khách so với gia chủ.
 * Chỉ xét khách 18–70 tuổi âm. Sắp theo (số tiêu chí tốt − xấu) rồi ít xấu hơn.
 */
export function goiYXongDat(namChu: number, namTet: number, gioiHan = 12): { chu: NguoiXem; namTet: { nam: number; canChi: string }; ungVien: UngVienXongDat[] } {
  if (!Number.isInteger(namChu) || namChu < NAM_XEM_TUOI_TU || namChu > NAM_XEM_TUOI_DEN) throw new RangeError('Năm sinh gia chủ không hợp lệ');
  const ccTet = canChiNam(namTet), ccChu = canChiNam(namChu);
  const chu = nguoi(namChu, 'nam');
  const ds: UngVienXongDat[] = [];
  for (let y = namTet - 69; y <= namTet - 17; y++) {
    const cc = canChiNam(y);
    const k = nguoi(y, 'nam');
    const tieuChi: TieuChi[] = [
      { ...quanHeChi(cc.chi, ccTet.chi), ma: 'chi-nam', ten: `Chi khách – chi năm ${ccTet.ten}` },
      { ...quanHeCan(cc.can, ccTet.can), ma: 'can-nam', ten: `Can khách – can năm ${ccTet.ten}` },
      { ...quanHeChi(cc.chi, ccChu.chi), ma: 'chi-chu', ten: `Chi khách – chi gia chủ ${ccChu.ten}` },
      { ...quanHeNapAm(k.hanh, chu.hanh, 'Khách', 'gia chủ'), ma: 'nap-am-chu', ten: `Nạp âm khách ${k.napAm} – gia chủ ${chu.napAm}` },
    ];
    const tot = tieuChi.filter((t) => t.muc === 'tot').length, xau = tieuChi.filter((t) => t.muc === 'xau').length;
    if (xau === 0 && tot >= 2) ds.push({ nam: y, canChi: cc.ten, napAm: k.napAm, tuoiAm: namTet - y + 1, tot, xau, tieuChi });
  }
  ds.sort((a, b) => b.tot - a.tot || a.tuoiAm - b.tuoiAm);
  return { chu, namTet: { nam: namTet, canChi: ccTet.ten }, ungVien: ds.slice(0, gioiHan) };
}

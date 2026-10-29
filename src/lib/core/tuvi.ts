// @ts-ignore
import TuViRaw from './tuvi-raw.js';
import { Lich } from './lich';

export interface HoroscopeStar {
  key: string;
  ten: string;
  hanh: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  loai: 'chinh' | 'cat' | 'sat';
  dacTinh: 'M' | 'V' | 'Đ' | 'B' | 'H' | null;
  dacTinhTen: 'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Hãm' | null;
  hoa: string | null;
  isLuu?: boolean;
}

export interface HoroscopePalace {
  chi: number;
  tenChi: string;
  can: string;
  ten: string;
  hanhCung: string;
  laThan: boolean;
  tuan: boolean;
  triet: boolean;
  chinhTinh: HoroscopeStar[];
  catTinh: HoroscopeStar[];
  hungTinh: HoroscopeStar[];
  phuTinh: HoroscopeStar[];
  luuTinh?: HoroscopeStar[];
  trangSinh: string;
  daiVan: string;
  daiVanTu: number;
  tieuHan: string;
}

export interface HoroscopeInput {
  lich: 'duong' | 'am';
  ngay: number;
  thang: number;
  nam: number;
  nhuan?: boolean;
  gio: number; // 0..23
  gioiTinh: 'nam' | 'nu';
  ten?: string;
  namXem?: number;
  hoanCanh?: {
    hn?: string;
    cv?: string;
    con?: string;
    bk?: string;
  };
}

export type Sao = HoroscopeStar;
export type CungLaSo = HoroscopePalace;
export type LaSoTuVi = HoroscopeResult;

export interface HoroscopeResult {
  namXem?: number;
  ten: string;
  gioiTinh: 'Nam' | 'Nữ';
  amDuong: string;
  amDuongLy: string;
  duong: { ngay: number; thang: number; nam: number };
  am: { ngay: number; thang: number; nam: number; nhuan: boolean };
  gio: { chi: string; khoang: string; canChi: string };
  canChi: { nam: string; thang: string; ngay: string; gio: string };
  conGiap: string;
  banMenh: string;
  hanhMenh: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  cuc: string;
  cucHanh: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  sinhKhac: string;
  menhTai: string;
  thanTai: string;
  menhChu: string;
  thanChu: string;
  tuan: string;
  triet: string;
  cung: HoroscopePalace[];
  hoanCanh?: HoroscopeInput['hoanCanh'];
}

const LOC_TON_BY_CAN = [0, 3, 4, 6, 7, 6, 7, 9, 10, 12, 1];
const THIEN_MA_BY_CHI_MOD4 = [6, 3, 12, 9];

function dichCung(c: number, ...offsets: number[]): number {
  let x = +c;
  for (const off of offsets) x += +off;
  x = ((x % 12) + 12) % 12;
  return x === 0 ? 12 : x;
}

/**
 * Tính các sao Lưu Niên (Lưu Thái Tuế, Lưu Tang Môn, Lưu Bạch Hổ, Lưu Thiên Khốc,
 * Lưu Thiên Hư, Lưu Lộc Tồn, Lưu Kình Dương, Lưu Đà La, Lưu Thiên Mã) theo năm xem hạn
 */
export function anSaoLuuNien(namXemAm: number): Record<number, HoroscopeStar[]> {
  const canNam = ((namXemAm + 6) % 10) + 1;
  const chiNam = ((namXemAm + 8) % 12) + 1;
  const luuByPos: Record<number, HoroscopeStar[]> = {};
  for (let i = 1; i <= 12; i++) luuByPos[i] = [];

  const add = (pos: number, key: string, ten: string, hanh: HoroscopeStar['hanh'], loai: 'cat' | 'sat') => {
    luuByPos[pos].push({ key, ten, hanh, loai, dacTinh: null, dacTinhTen: null, hoa: null, isLuu: true });
  };

  add(chiNam, 'luuThaiTue', 'L.Thái Tuế', 'Hỏa', 'sat');
  add(dichCung(chiNam, 2), 'luuTangMon', 'L.Tang Môn', 'Mộc', 'sat');
  add(dichCung(chiNam, 8), 'luuBachHo', 'L.Bạch Hổ', 'Kim', 'sat');
  add(dichCung(7, chiNam - 1), 'luuThienHu', 'L.Thiên Hư', 'Thủy', 'sat');
  add(dichCung(7, -chiNam + 1), 'luuThienKhoc', 'L.Thiên Khốc', 'Thủy', 'sat');

  const lt = LOC_TON_BY_CAN[canNam];
  add(lt, 'luuLocTon', 'L.Lộc Tồn', 'Thổ', 'cat');
  add(dichCung(lt, 1), 'luuKinhDuong', 'L.Kình Dương', 'Kim', 'sat');
  add(dichCung(lt, -1), 'luuDaLa', 'L.Đà La', 'Kim', 'sat');
  add(THIEN_MA_BY_CHI_MOD4[chiNam % 4], 'luuThienMa', 'L.Thiên Mã', 'Hỏa', 'cat');

  return luuByPos;
}

const rawTuVi = (TuViRaw as any)?.default || TuViRaw;

export function anLaSo(opts: HoroscopeInput): HoroscopeResult {
  const res: HoroscopeResult = rawTuVi.anLaSo(opts) as any;
  if (opts.hoanCanh) res.hoanCanh = opts.hoanCanh;
  const namXem = opts.namXem || Lich.duongSangAm(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).nam;
  const luuMap = anSaoLuuNien(namXem);
  res.cung.forEach((c, idx) => {
    c.luuTinh = luuMap[idx + 1] || [];
  });
  return res;
}

export function tomTat(ls: HoroscopeResult): string {
  return rawTuVi.tomTat(ls);
}

export const TuVi = {
  anLaSo,
  tomTat,
  anSaoLuuNien,
  CUNG: rawTuVi.CUNG as string[],
  DAC_TEN: rawTuVi.DAC_TEN as Record<string, string>,
};

export default TuVi;

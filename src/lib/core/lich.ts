// @ts-ignore
import LichRaw from './lich-raw.js';

export interface LunarDate {
  ngay: number;
  thang: number;
  nam: number;
  nhuan: boolean;
}

export interface SolarDate {
  ngay: number;
  thang: number;
  nam: number;
  thu?: string;
}

export interface CanChiIndex {
  can: number;
  chi: number;
}

export interface GioHoangDaoItem {
  chi: number;
  ten: string;
  canChi: string;
  khoang: string;
  than: string;
  tot: boolean;
}

export interface DayFullInfo {
  duong: SolarDate;
  am: LunarDate;
  canChi: { ngay: string; thang: string; nam: string };
  ccNgay: CanChiIndex;
  ccNam: CanChiIndex;
  napAmNgay: string;
  tietKhi: string;
  hoangDao: { than: string; tot: boolean };
  truc: { ten: string; idx: number; y: string };
  ky: string[];
  tuoiXung: string[];
  chiXung: string;
  gio: GioHoangDaoItem[];
  jd: number;
}

export const Lich: {
  CAN: string[];
  CHI: string[];
  CON_GIAP: string[];
  THU: string[];
  GIO_KHOANG: string[];
  TRUC: string[];
  VIEC: Record<string, { ten: string; tot: number[]; xau: number[] }>;
  CUU_DIEU: Record<string, any>;
  BAT_HAN: Record<string, string>;
  jdFromDate: (dd: number, mm: number, yy: number) => number;
  jdToDate: (jd: number) => number[];
  duongSangAm: (dd: number, mm: number, yy: number) => LunarDate;
  amSangDuong: (ld: number, lm: number, ly: number, nhuan?: boolean) => SolarDate | null;
  thangNhuan: (ly: number) => number;
  soNgayThangAm: (lm: number, ly: number, nhuan?: boolean) => number;
  canChiNam: (ly: number) => CanChiIndex;
  canChiThang: (lm: number, ly: number) => CanChiIndex;
  canChiNgay: (jd: number) => CanChiIndex;
  canGioTy: (canNgay: number) => number;
  ten: (cc: CanChiIndex) => string;
  napAm: (can: number, chi: number) => string;
  hanhCuaNapAm: (napAmStr: string) => string;
  chiGio: (hour24: number) => number;
  tietKhi: (jd: number) => string;
  ngayHoangDao: (lm: number, chiNgay: number) => { than: string; tot: boolean };
  gioHoangDao: (chiNgay: number, canNgay: number) => GioHoangDaoItem[];
  truc: (jd: number) => { ten: string; idx: number; y: string };
  ngayKy: (am: LunarDate) => string[];
  xung: (a: number, b: number) => boolean;
  thongTinNgay: (dd: number, mm: number, yy: number) => DayFullInfo;
  danhGiaNgay: (info: DayFullInfo, viec: string, namSinhAm?: number | null) => { diem: number; muc: string; lyDo: Array<{ tot: boolean | null; t: string }> };
  timNgayTot: (tu: Date, den: Date, viec: string, namSinhAm?: number | null) => Array<{ info: DayFullInfo; dg: any }>;
  xemTuoi: (namSinhAm: number, namXem: number) => { tuoiMu: number; kimLau: string | null; hoangOc: string; hoangOcXau: boolean; tamTai: boolean; namXem: string };
  saoHan: (namSinhAm: number, gioiTinh: 'nam' | 'nu', namXem: number) => any;
  quanHeChi: (a: number, b: number) => string[];
  cungPhi: (namAm: number, gioiTinh: 'nam' | 'nu') => { ten: string; hanh: string; nhom: string };
  xemHop: (a: { nam: number; gioi: 'nam' | 'nu' }, b: { nam: number; gioi: 'nam' | 'nu' }, kieu: 'vochong' | 'laman') => any;
  huongTheoCung: (namAm: number, gioiTinh: 'nam' | 'nu') => any;
} = (LichRaw as any)?.default || LichRaw;

export default Lich;

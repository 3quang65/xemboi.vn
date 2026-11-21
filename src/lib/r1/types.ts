import type { LaSo, LuuNien, NguHanh } from '@/lib/tuvi-v2';

export const R1_EVENT_NAMES = [
  'xem_trang',
  'bat_dau_form',
  'lap_la_so',
  'xem_gia',
  'bam_mua_79',
  'bam_mua_149',
  'gui_lien_he',
  'bo_form',
] as const;

export type R1EventName = (typeof R1_EVENT_NAMES)[number];
export type NutGiaR1 = '79k' | '149k';

export interface UtmParams {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export interface R1EventRecord {
  id: string;
  sessionId: string;
  eventName: R1EventName;
  coGioSinh: boolean | null;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  createdAt: string;
}

export interface R1LeadRecord {
  id: string;
  emailHoacZalo: string;
  nutGiaDaBam: NutGiaR1;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  dongYLuc: string;
  hanXoa: string;
  createdAt: string;
}

export interface NhanDinhMienPhi {
  id: string;
  nhom: 'menh_than' | 'nam_2027';
  canCu: string; // Định dạng bắt buộc: [Căn cứ: Cung X – Sao Y]
  tieuDe: string;
  noiDung: string;
  nguon: string[];
  ghiChuKiemDuyet?: string;
}

export interface KetQuaCoGio {
  loai: 'co_gio';
  laSo: LaSo;
  luuNien2027: LuuNien;
  moTaQuyUoc: string[];
  nhanDinhMenhThan: NhanDinhMienPhi[]; // Tối đa 3 nhận định Mệnh–Thân
  chuDe2027: NhanDinhMienPhi | null; // 1 chủ đề năm 2027 từ kho câu tĩnh
  anNut149k: false;
}

export interface KetQuaChuaRoGio {
  loai: 'chua_ro_gio';
  duong: { ngay: number; thang: number; nam: number };
  am: { ngay: number; thang: number; nam: number; nhuan: boolean };
  gioiTinh: 'Nam' | 'Nữ';
  canChiNam: string;
  canChiThang: string;
  canChiNgay: string;
  conGiap: string;
  banMenh: string;
  hanhMenh: NguHanh;
  tuoiMu2027: number;
  tongQuan2027: {
    namXem: string;
    napAm2027: string;
    quanHeNguHanh: string;
    moTaQuanHe: string;
    goiYDinhHuong: string;
    canCu: string;
  };
  lyDoKhongAn12Cung: string;
  anNut149k: true;
}

export type KetQuaR1 = KetQuaCoGio | KetQuaChuaRoGio;

export interface WilsonInterval {
  successes: number;
  total: number;
  rate: number; // 0..1
  lower: number; // 0..1
  upper: number; // 0..1
}

export type TrangThaiNguongR1 = 'DAT' | 'CHUA_RO' | 'TRUOT';

export interface DanhGiaNguongR1 {
  trangThai: TrangThaiNguongR1;
  nhan: string;
  duMau: boolean;
  lyDo: string;
}

export interface DongPheuUtm {
  utmKey: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  xemTrang: number;
  batDauForm: number;
  boForm: number;
  tyLeBoForm: number;
  lapLaSo: number;
  coGioSinh: number;
  chuaRoGio: number;
  tyLeChuaRoGio: WilsonInterval;
  xemGia: number;
  bamMua79: number;
  bamMua149: number;
  bamMuaTong: number;
  guiLienHe: number;
  soLeadTrongBang: number;
  clickPerChart: WilsonInterval;
  leadPerChart: WilsonInterval;
  tyLe79TrongClick: number;
  tyLe149TrongClick: number;
  coGioBam79: number;
  coGioBam149: number;
  danhGia: DanhGiaNguongR1;
}

export interface BaoCaoPheuR1 {
  tongHop: DongPheuUtm;
  theoUtm: DongPheuUtm[];
  nguong: {
    coMauToiThieu: number;
    coMauKhuyenNghi: number;
    clickDat: number;
    clickTruot: number;
    leadDat: number;
    chuaRoGioCanhBao: number;
  };
}

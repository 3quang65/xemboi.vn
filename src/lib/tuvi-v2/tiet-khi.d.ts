export const TIET_KHI: readonly string[];

export interface MocTietKhi {
  ten: string;
  chiSo: number;
  kinhDo: number;
  thoiDiem: Date;
}

export interface ThongTinTietKhi extends MocTietKhi {
  batDau: Date;
  ketThuc: Date;
}

export function deltaT(ngay: Date): number;
export function kinhDoTaiJde(jde: number): number;
export function kinhDoMatTroi(ngay: Date): number;
export function timMoc(kinhDo: number, nam: number): Date;
export function lietKeTietKhi(nam: number): MocTietKhi[];
export function dinhDangMuiGio(ngay: Date, tz?: number): string;
export function dinhDangVN(ngay: Date): string;
export function tietKhi(ngay: Date | number | string): ThongTinTietKhi;

declare const TietKhiDefault: {
  TIET_KHI: typeof TIET_KHI;
  kinhDoMatTroi: typeof kinhDoMatTroi;
  kinhDoTaiJde: typeof kinhDoTaiJde;
  timMoc: typeof timMoc;
  lietKeTietKhi: typeof lietKeTietKhi;
  tietKhi: typeof tietKhi;
  dinhDangVN: typeof dinhDangVN;
  dinhDangMuiGio: typeof dinhDangMuiGio;
  deltaT: typeof deltaT;
};
export default TietKhiDefault;

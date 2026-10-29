// @ts-ignore
import HomNayRaw from './homnay-raw.js';
export const HomNay: {
  ngayVN: (soNgay?: number, goc?: Date) => { d: number; m: number; y: number };
  ngay: (d: number, m: number, y: number) => any;
  tuoi: (chi: number, d: number, m: number, y: number, n?: any) => any;
  tatCa: (d: number, m: number, y: number) => { ngay: any; tuoi: any[] };
  SLUG: string[];
  chiTuSlug: (s: string) => number;
  TEN_MAT: Record<string, string>;
} = (HomNayRaw as any)?.default || HomNayRaw;
export default HomNay;

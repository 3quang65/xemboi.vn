// @ts-ignore
import TronDoiRaw from './trondoi-raw.js';
export const TronDoi: {
  luan: (namAm: number, gioi: 'nam' | 'nu') => {
    tieuDe: string;
    moTa: string;
    text: string;
    canChi: string;
    napAm: string;
    hanh: string;
    cungPhi: string;
    conGiap: string;
    slug: string;
  };
  slug: (namAm: number, gioi: 'nam' | 'nu') => string;
  boDau: (s: string) => string;
} = (TronDoiRaw as any)?.default || TronDoiRaw;
export default TronDoi;

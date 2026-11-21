export interface DoanLuan { ma: string; cau: string; dacTinh: string[]; nguon: string[] }
export function chonDoanMenh(
  chinhTinh: { ten: string; dacTinh: string | null }[],
  duLieu?: unknown,
): { voChinhDieu: boolean; doan: DoanLuan[] };
export const TOI_DA: number;

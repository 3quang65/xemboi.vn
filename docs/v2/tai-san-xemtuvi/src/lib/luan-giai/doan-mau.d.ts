export interface DoanMau { cung: string; tenChi: string; chinhTinh: string[]; ma: string; cau: string; nguon: string[] }
export function chonDoanMau(
  cacCung: { ten: string; chi: number; tenChi: string; chinhTinh: string[] }[],
  duLieu?: unknown,
): DoanMau | null;
export function tachDoanMau(cau: string): { ro: string; mo: string };

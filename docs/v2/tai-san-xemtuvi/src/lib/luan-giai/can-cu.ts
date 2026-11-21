/** Dòng "Căn cứ" dưới mỗi nhận định: chỉ in phần dữ liệu có thật, không in chỗ trống. */
export interface ThamChieuHienThi {
  sao?: string[];
  yeuTo?: string[];
  cung?: string;
  nguon?: string;
  truongPhai?: string;
}

export function dongCanCu(t: ThamChieuHienThi): string {
  const phan: string[] = [];
  const sao = (t.sao ?? []).filter(Boolean);
  const yeuTo = (t.yeuTo ?? []).filter(Boolean);
  if (sao.length) phan.push(`sao ${sao.join(', ')}`);
  if (yeuTo.length) phan.push(`yếu tố ${yeuTo.join(', ')}`);
  if (t.cung) phan.push(`cung ${t.cung}`);
  if (t.nguon) phan.push(`nguồn ${t.nguon}`);
  if (t.truongPhai) phan.push(`trường phái ${t.truongPhai}`);
  return phan.length ? `Căn cứ: ${phan.join('; ')}` : '';
}

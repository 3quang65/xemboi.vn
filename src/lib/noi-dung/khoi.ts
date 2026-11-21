// Khuôn 9 khối của mục từ điển (docs/v2/07 mục 2.3; 17 mục 2.1 và 1.2.2 tiêu chí 8). Hàm thuần, không đụng CSDL.

export const KHOI = [
  { ma: 'k1', ten: 'Tên và tên khác', tang: 'nhanh' },
  { ma: 'k2', ten: 'Tóm tắt 2 câu', tang: 'nhanh' },
  { ma: 'k3', ten: 'Truyền thống nói gì', tang: 'nhanh' },
  { ma: 'k4', ten: 'Các phái khác nhau ở đâu', tang: 'sau' },
  { ma: 'k5', ten: 'Cách tính', tang: 'sau' },
  { ma: 'k6', ten: 'Khoa học nói gì', tang: 'sau' },
  { ma: 'k7', ten: 'Liên quan', tang: 'sau' },
  { ma: 'k8', ten: 'Nguồn', tang: 'sau' },
  { ma: 'k9', ten: 'Người duyệt, ngày duyệt, giới hạn', tang: 'cuoi' },
] as const;

export type MaKhoi = (typeof KHOI)[number]['ma'];
/** Giá trị lưu ở NoiDungPhienBan.khoi. Mỗi khối là markdown; k5 được để trống nếu đánh dấu không áp dụng. */
export type KhoiMuc = Partial<Record<MaKhoi, string>> & { k5KhongApDung?: boolean };
export type LoiNoiDung = { ma: string; muc: 'CHAN' | 'CANH_BAO' | 'CHAN_INDEX' | 'CONG'; khoi?: MaKhoi; thongBao: string };

const trong = (s: string | undefined) => !s || !s.replace(/\s+/g, '');

/** Đoạn văn = khối chữ ngăn bởi dòng trống; bỏ tiêu đề markdown và dòng chỉ có ký hiệu bảng. */
export function tachDoanVan(md: string): string[] {
  return md.split(/\n\s*\n/).map((d) => d.trim())
    .filter((d) => d && !/^#{1,6}\s/.test(d) && !/^[|\-:\s]+$/.test(d));
}

/** Kiểm đủ 9 khối. Thiếu khối nào thì chặn (tiêu chí 8). k5 trống chỉ được khi k5KhongApDung. */
export function kiemDuKhoi(k: KhoiMuc | null | undefined): LoiNoiDung[] {
  const loi: LoiNoiDung[] = [];
  for (const { ma, ten } of KHOI) {
    if (ma === 'k5' && k?.k5KhongApDung) continue;
    if (trong(k?.[ma])) loi.push({ ma: 'THIEU_KHOI', muc: 'CHAN', khoi: ma, thongBao: `Thiếu khối ${ma.slice(1)} "${ten}"${ma === 'k5' ? ' (hoặc đánh dấu "không áp dụng")' : ''}` });
  }
  return loi;
}

/** Ghép các khối thành một văn bản để kiểm từ cấm và đếm từ. */
export function noiKhoi(k: KhoiMuc | null | undefined): string {
  return KHOI.map(({ ma }) => k?.[ma] ?? '').filter(Boolean).join('\n\n');
}

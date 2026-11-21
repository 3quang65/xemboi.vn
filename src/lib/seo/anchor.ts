// Phân bố anchor text theo trang đích (docs/v2/17 mục 1.3 bước 5). Hàm thuần; ngưỡng là [GIẢ ĐỊNH], đọc từ tham số.
export type LoaiAnchor = 'CHINH_XAC' | 'MOT_PHAN' | 'THUONG_HIEU' | 'CHUNG_CHUNG' | 'KHAC';

const CHUNG = ['xem thêm', 'tại đây', 'ở đây', 'chi tiết', 'đọc thêm', 'xem ngay', 'bấm vào đây', 'click', 'link', 'tìm hiểu thêm', 'xem', 'tiếp', 'đọc tiếp', 'nguồn'];

/** Chuẩn hóa để so: chữ thường, bỏ dấu câu, gộp khoảng trắng (giữ dấu tiếng Việt). */
export const chuanChu = (s: string) => s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

export function loaiAnchor(anchor: string, tuKhoaChinh: string | null | undefined): LoaiAnchor {
  const a = chuanChu(anchor);
  if (!a) return 'CHUNG_CHUNG';
  if (CHUNG.includes(a)) return 'CHUNG_CHUNG';
  if (/xemboi|xem bói|^https?|^www|\.vn\b/.test(anchor.toLowerCase())) return 'THUONG_HIEU';
  const k = chuanChu(tuKhoaChinh ?? '');
  if (!k) return 'KHAC';
  if (a === k) return 'CHINH_XAC';
  const tuK = k.split(' ');
  const trung = tuK.filter((t) => a.split(' ').includes(t)).length;
  if (a.includes(k) || trung / tuK.length >= 0.5) return 'MOT_PHAN';
  return 'KHAC';
}

export type NguongAnchor = { chinhXac: number; motAnchor: number; chungChung: number; toiThieu: number };
/** [GIẢ ĐỊNH] 17 mục 1.3: khớp chính xác > 50 %, một anchor > 60 %, chung chung > 30 %. Dưới `toiThieu` liên kết thì chưa cảnh báo. */
export const NGUONG_MAC_DINH: NguongAnchor = { chinhXac: 0.5, motAnchor: 0.6, chungChung: 0.3, toiThieu: 5 };

export type DanhGiaAnchor = {
  tong: number;
  theoLoai: Record<LoaiAnchor, number>;
  hayGapNhat: { anchor: string; so: number } | null;
  canhBao: ('CHINH_XAC_NHIEU' | 'MOT_ANCHOR_AP_DAO' | 'CHUNG_CHUNG_NHIEU')[];
};

export function danhGiaAnchor(anchors: string[], tuKhoaChinh: string | null | undefined, n: NguongAnchor = NGUONG_MAC_DINH): DanhGiaAnchor {
  const theoLoai: Record<LoaiAnchor, number> = { CHINH_XAC: 0, MOT_PHAN: 0, THUONG_HIEU: 0, CHUNG_CHUNG: 0, KHAC: 0 };
  const dem = new Map<string, { anchor: string; so: number }>();
  for (const a of anchors) {
    theoLoai[loaiAnchor(a, tuKhoaChinh)]++;
    const k = chuanChu(a);
    const x = dem.get(k) ?? { anchor: a, so: 0 };
    x.so++; dem.set(k, x);
  }
  const tong = anchors.length;
  const hayGapNhat = [...dem.values()].sort((a, b) => b.so - a.so)[0] ?? null;
  const canhBao: DanhGiaAnchor['canhBao'] = [];
  if (tong >= n.toiThieu) {
    if (theoLoai.CHINH_XAC / tong > n.chinhXac) canhBao.push('CHINH_XAC_NHIEU');
    if (hayGapNhat && hayGapNhat.so / tong > n.motAnchor) canhBao.push('MOT_ANCHOR_AP_DAO');
    if (theoLoai.CHUNG_CHUNG / tong > n.chungChung) canhBao.push('CHUNG_CHUNG_NHIEU');
  }
  return { tong, theoLoai, hayGapNhat, canhBao };
}

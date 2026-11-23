// Dữ liệu cho phần trực quan của cụm Xem ngày (docs/v2/22, Lệnh 41):
//  - daiGio(): dải 12 giờ trong ngày, đánh dấu giờ hoàng đạo và giờ hiện tại (giờ Việt Nam).
//  - chonNgayHopNhat(): vài ngày hợp nhất cho một việc trong N ngày tới, mỗi ngày kèm lý do ghép từ dữ liệu 3 lớp.
// Thứ tự xếp là quy ước của xemboi, công bố nguyên văn trong `TIEU_CHI_XEP` để trang in ra; không chấm điểm, không phần trăm.
import { soNgayJulius, tuSoNgayJulius, type NgayDuong } from '@/lib/tuvi-v2/am-lich';
import { ngayHienTaiVN, type ChiTietNgay, type GioTrongNgay } from './lich';
import { TEN_NHOM_TRUC, VIEC, xemNgay, type MaViec, type Muc, type NhomTruc, type NgayXem, type ThanNgay, type Truc, type Viec } from './xem-ngay';

// ---------- Dải 12 giờ ----------

/** Chỉ số giờ (0 = Tý: 23:00–00:59, 1 = Sửu: 01:00–02:59, …) của một thời điểm, theo giờ Việt Nam. */
export function chiGioVN(luc: Date): number {
  const v = new Date(luc.getTime() + 7 * 3600_000);
  const gio = v.getUTCHours();
  return Math.floor(((gio + 1) % 24) / 2);
}

export type OGio = GioTrongNgay & {
  chiSo: number;
  /** Đang là giờ này (chỉ khi ngày xem là hôm nay theo giờ Việt Nam). */
  hienTai: boolean;
  /** Giờ đã qua trong hôm nay. */
  daQua: boolean;
};
export type DaiGio = { gio: OGio[]; soHoangDao: number; laHomNay: boolean; ghiChuTy: string };

export const GHI_CHU_GIO_TY =
  'Giờ Tý tính từ 23:00 tới 00:59. Dải giờ này theo can chi của ngày đang xem, nên 23:00–23:59 cuối ngày được ghi chung vào giờ Tý đầu ngày.';

export function daiGio(ngay: ChiTietNgay, luc = new Date()): DaiGio {
  const hom = ngayHienTaiVN(luc);
  const laHomNay = hom.ngay === ngay.duong.ngay && hom.thang === ngay.duong.thang && hom.nam === ngay.duong.nam;
  const v = new Date(luc.getTime() + 7 * 3600_000);
  // 23:xx là giờ Tý của ngày hôm sau theo can chi; trong dải của hôm nay coi như đã qua hết, không có giờ hiện tại.
  const sau23 = v.getUTCHours() === 23;
  const hienTai = laHomNay && !sau23 ? chiGioVN(luc) : -1;
  const gio = ngay.gio.map((g, i) => ({
    ...g, chiSo: i,
    hienTai: i === hienTai,
    daQua: laHomNay && (sau23 || (hienTai >= 0 && i < hienTai)),
  }));
  return { gio, soHoangDao: gio.filter((g) => g.hoangDao).length, laHomNay, ghiChuTy: GHI_CHU_GIO_TY };
}

// ---------- Ngày hợp nhất cho một việc ----------

export type KetNgay = 'hop' | 'ky' | 'khac';

/** Cùng quy tắc với ngayTheoViec(): kỵ thắng nghi; "hop" khi mục chính có trong nghi và không có trong kỵ. */
export function ketTheoViec(viec: Viec, x: NgayXem): KetNgay {
  const coNghi = x.nghi.some((m) => viec.chinh.includes(m.han));
  const coKy = x.ky.some((m) => viec.chinh.includes(m.han));
  return coKy ? 'ky' : coNghi ? 'hop' : 'khac';
}

const HANG_TRUC: Record<NhomTruc, number> = { hoang: 0, 'kha-dung': 0, hac: 1, 'bat-tuong': 2 };

export const TIEU_CHI_XEP = [
  'Chỉ lấy ngày mà bảng nghi kỵ ghi "nên" việc này và không ghi "kỵ".',
  'Trong các ngày đó, ưu tiên ngày thuộc 6 thần hoàng đạo.',
  'Rồi tới ngày có trực thuộc nhóm hoàng hoặc dùng được theo câu ca Ngọc hạp ký.',
  'Rồi tới ngày bảng còn ghi nên thêm các việc liên quan.',
  'Bằng nhau thì lấy ngày gần hơn.',
] as const;

export const GHI_CHU_CHON_NGAY =
  'Cách xếp trên là quy ước của xemboi để rút gọn danh sách, không phải điểm số. Chưa xét tuổi người làm việc.';

export type NgayChon = {
  iso: string;
  duong: NgayDuong;
  thu: string;
  am: string;
  canChiNgay: string;
  truc: Truc;
  than: ThanNgay;
  phuNghi: Muc[];
  /** Từng dòng lý do, ghép từ dữ liệu. */
  lyDo: string[];
  /** Ngày đứng đầu danh sách. */
  dauDanh: boolean;
};

export type KetQuaChonNgay = {
  viec: Viec;
  tu: NgayDuong;
  den: NgayDuong;
  soNgay: number;
  /** Số ngày hợp / kỵ / không nhắc trong khoảng. */
  dem: Record<KetNgay, number>;
  chon: NgayChon[];
  tieuChi: readonly string[];
  ghiChu: string;
};

const hai = (n: number) => String(n).padStart(2, '0');

function lyDoNgay(viec: Viec, x: NgayXem, phuNghi: Muc[]): string[] {
  const chinh = x.nghi.filter((m) => viec.chinh.includes(m.han));
  const ds = [
    `Bảng nghi kỵ ghi nên: ${chinh.map((m) => `${m.han} ${m.ten}`).join(", ")}.`,
    `Thần ngày: ${x.than.ten} (${x.than.han}), ${x.than.hoangDao ? 'hoàng đạo' : 'hắc đạo'}.`,
    `Trực ${x.truc.ten} (${x.truc.han}): ${TEN_NHOM_TRUC[x.truc.nhom].toLowerCase()}.`,
  ];
  if (phuNghi.length) ds.push(`Cũng ghi nên: ${phuNghi.map((m) => m.ten).join(', ')}.`);
  return ds;
}

/** Chọn tối đa `soChon` ngày hợp nhất cho việc `ma` trong `soNgay` ngày kể từ `tu` (tính cả ngày `tu`). */
export function chonNgayHopNhat(ma: MaViec, tu: NgayDuong = ngayHienTaiVN(), soNgay = 30, soChon = 3): KetQuaChonNgay {
  const viec = VIEC[ma];
  if (!viec) throw new RangeError(`Việc không có: ${ma}`);
  if (!Number.isInteger(soNgay) || soNgay < 1 || soNgay > 120) throw new RangeError('Khoảng ngày từ 1 tới 120.');
  const jd0 = soNgayJulius(tu.ngay, tu.thang, tu.nam);
  const dem: Record<KetNgay, number> = { hop: 0, ky: 0, khac: 0 };
  const ungVien: { x: NgayXem; phuNghi: Muc[]; jd: number }[] = [];
  for (let k = 0; k < soNgay; k++) {
    const d = tuSoNgayJulius(jd0 + k);
    const x = xemNgay(d.ngay, d.thang, d.nam);
    const ket = ketTheoViec(viec, x);
    dem[ket]++;
    if (ket === 'hop') ungVien.push({ x, phuNghi: x.nghi.filter((m) => viec.phu.includes(m.han)), jd: jd0 + k });
  }
  ungVien.sort((a, b) =>
    Number(b.x.than.hoangDao) - Number(a.x.than.hoangDao)
    || HANG_TRUC[a.x.truc.nhom] - HANG_TRUC[b.x.truc.nhom]
    || b.phuNghi.length - a.phuNghi.length
    || a.jd - b.jd);
  const chon = ungVien.slice(0, soChon).map(({ x, phuNghi }, i): NgayChon => {
    const am = x.lich.am;
    return {
      iso: x.iso, duong: x.lich.duong, thu: x.lich.thu,
      am: `${am.ngay}/${am.thang}${am.nhuan ? ' nhuận' : ''}`,
      canChiNgay: x.lich.canChiNgay.ten,
      truc: x.truc, than: x.than, phuNghi,
      lyDo: lyDoNgay(viec, x, phuNghi),
      dauDanh: i === 0,
    };
  });
  return { viec, tu, den: tuSoNgayJulius(jd0 + soNgay - 1), soNgay, dem, chon, tieuChi: TIEU_CHI_XEP, ghiChu: GHI_CHU_CHON_NGAY };
}

/** Gập dòng iCalendar ở 75 byte UTF-8 (RFC 5545 mục 3.1), không cắt giữa một ký tự. */
function gapDong(dong: string): string {
  const ra: string[] = [];
  let cur = '';
  let byte = 0;
  for (const ch of dong) {
    const b = new TextEncoder().encode(ch).length;
    if (byte + b > (ra.length ? 74 : 75)) { ra.push(cur); cur = ''; byte = 0; }
    cur += ch; byte += b;
  }
  ra.push(cur);
  return ra.join('\r\n ');
}

/** Lịch iCalendar (.ics) cho các ngày đã chọn: sự kiện cả ngày, không chứa thông tin cá nhân. */
export function lichIcs(kq: KetQuaChonNgay, goc = 'https://xemboi.vn', luc = new Date()): string {
  const dau = luc.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const dong = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//xemboi.vn//xem-ngay//VI', 'CALSCALE:GREGORIAN'];
  for (const n of kq.chon) {
    const d = `${n.duong.nam}${hai(n.duong.thang)}${hai(n.duong.ngay)}`;
    const sau = tuSoNgayJulius(soNgayJulius(n.duong.ngay, n.duong.thang, n.duong.nam) + 1);
    const ds = `${sau.nam}${hai(sau.thang)}${hai(sau.ngay)}`;
    const moTa = n.lyDo.join(' ').replace(/[,;\\]/g, (c) => `\\${c}`);
    dong.push(
      'BEGIN:VEVENT',
      `UID:${kq.viec.ma}-${d}@xemboi.vn`,
      `DTSTAMP:${dau}`,
      `DTSTART;VALUE=DATE:${d}`,
      `DTEND;VALUE=DATE:${ds}`,
      `SUMMARY:${kq.viec.ten}: ngày ${n.canChiNgay} (âm ${n.am})`,
      `DESCRIPTION:${moTa}`,
      `URL:${goc}/xem-ngay/${kq.viec.ma}`,
      'END:VEVENT',
    );
  }
  dong.push('END:VCALENDAR');
  return dong.map(gapDong).join('\r\n') + '\r\n';
}


// ---------- Đọc nhanh một ngày ----------

export type TheNgay = { ma: 'than' | 'truc' | 'nghi-ky' | 'gio'; nhan: string; giaTri: string; muc?: 'tot' | 'binh' | 'diu'; chiTiet: string };
export type DocNhanhNgay = { cau: string; the: TheNgay[] };

/** Câu tóm tắt và thẻ cho một ngày; mọi câu ghép từ dữ liệu 3 lớp và bảng giờ. */
export function docNhanhNgay(x: NgayXem, luc = new Date()): DocNhanhNgay {
  const l = x.lich;
  const dg = daiGio(l, luc);
  const gioTot = dg.gio.filter((g) => g.hoangDao);
  const gioToi = dg.laHomNay ? gioTot.find((g) => g.hienTai || !g.daQua) : undefined;
  const cau = `${l.thu} ${String(l.duong.ngay).padStart(2, '0')}/${String(l.duong.thang).padStart(2, '0')}/${l.duong.nam}, `
    + `âm lịch ${l.am.ngay} ${l.tenThangAm}: ngày ${l.canChiNgay.ten}, thần ${x.than.ten} (${x.than.hoangDao ? 'hoàng đạo' : 'hắc đạo'}), trực ${x.truc.ten}; `
    + `bảng ghi ${x.nghi.length} việc nên, ${x.ky.length} việc kỵ.`;
  return {
    cau,
    the: [
      {
        ma: 'than', nhan: 'Thần ngày (12 thần)', giaTri: x.than.ten, muc: x.than.hoangDao ? 'tot' : 'diu',
        chiTiet: `${x.than.han}, ${x.than.hoangDao ? 'thuộc 6 thần hoàng đạo' : 'thuộc 6 thần hắc đạo'}. Hiệp kỷ ghi cách chia này không có căn cứ thiên văn.`,
      },
      {
        ma: 'truc', nhan: 'Trực (12 trực)', giaTri: x.truc.ten, muc: x.truc.nhom === 'hoang' || x.truc.nhom === 'kha-dung' ? 'tot' : x.truc.nhom === 'hac' ? 'binh' : 'diu',
        chiTiet: `${x.truc.han}, ${TEN_NHOM_TRUC[x.truc.nhom].toLowerCase()}${x.truc.viec ? `. Câu ca: ${x.truc.viec}` : ''}.`,
      },
      {
        ma: 'nghi-ky', nhan: 'Nghi / kỵ', giaTri: `${x.nghi.length} nên · ${x.ky.length} kỵ`,
        chiTiet: x.nghi.length ? `Nên: ${x.nghi.slice(0, 4).map((m) => m.ten).join(', ')}${x.nghi.length > 4 ? '…' : ''}.` : 'Bảng không ghi việc nên.',
      },
      {
        ma: 'gio', nhan: dg.laHomNay ? 'Giờ hoàng đạo kế tiếp' : 'Giờ hoàng đạo', giaTri: gioToi ? `${gioToi.chi} ${gioToi.khung}` : `${gioTot.length} giờ`,
        chiTiet: gioTot.map((g) => g.chi).join(', ') + '.',
      },
    ],
  };
}

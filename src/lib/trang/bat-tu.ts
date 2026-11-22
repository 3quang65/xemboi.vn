// Lá số Bát tự (Tứ trụ) cho trang công khai v2: chỉ phần TÍNH ĐƯỢC, không có luận giải.
// Thay `lapTuTru` của v1 (src/lib/core/tutru-boidich.ts) vốn lấy trụ tháng theo tháng âm
// và tự sinh lời luận — cả hai đều sai quy tắc Tử Bình.
//
// Quy ước (ghi ra `quyUoc` để trang hiện cho người xem):
//  - Trụ năm đổi tại Lập xuân (kinh độ Mặt Trời 315°), không đổi tại Tết âm lịch.
//  - Trụ tháng đổi tại 12 "tiết" (kinh độ 315° + 30°·k), tháng Dần bắt đầu từ Lập xuân; can tháng theo Ngũ Hổ Độn.
//  - Trụ ngày theo số ngày Julius; mặc định ngày đổi lúc 23:00 (giờ Tý đầu thuộc ngày hôm sau).
//  - Trụ giờ theo canh giờ 2 tiếng, can giờ theo Ngũ Thử Độn từ can ngày.
//  - Dùng giờ đồng hồ Việt Nam (UTC+7), không đổi sang giờ mặt trời thật.
//  - Đại vận: dương nam / âm nữ đi thuận, âm nam / dương nữ đi nghịch; tuổi khởi vận = số ngày tới tiết kế (thuận)
//    hoặc từ tiết trước (nghịch) chia 3 (3 ngày = 1 năm, 1 ngày = 4 tháng).
import {
  DIA_CHI, THIEN_CAN, canChiGio, canChiNam, canChiNgay, canChiThang, napAm, soNgayJulius, type CapCanChi,
} from '@/lib/tuvi-v2/am-lich';
import { kinhDoMatTroi, lietKeTietKhi } from '@/lib/tuvi-v2/tiet-khi.mjs';
import type { Hanh } from './can-chi';

export const HANH_CAN: Hanh[] = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
export const HANH_CHI: Hanh[] = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];

/** Tàng can trong địa chi: [bản khí, trung khí, dư khí] (chỉ số thiên can). */
export const TANG_CAN: number[][] = [
  [9], // Tý: Quý
  [5, 9, 7], // Sửu: Kỷ Quý Tân
  [0, 2, 4], // Dần: Giáp Bính Mậu
  [1], // Mão: Ất
  [4, 1, 9], // Thìn: Mậu Ất Quý
  [2, 4, 6], // Tỵ: Bính Mậu Canh
  [3, 5], // Ngọ: Đinh Kỷ
  [5, 3, 1], // Mùi: Kỷ Đinh Ất
  [6, 8, 4], // Thân: Canh Nhâm Mậu
  [7], // Dậu: Tân
  [4, 7, 3], // Tuất: Mậu Tân Đinh
  [8, 0], // Hợi: Nhâm Giáp
];

const SINH: Record<Hanh, Hanh> = { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' };
const KHAC: Record<Hanh, Hanh> = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' };

export const THAP_THAN = [
  'Tỷ kiên', 'Kiếp tài', 'Thực thần', 'Thương quan', 'Thiên tài',
  'Chính tài', 'Thất sát', 'Chính quan', 'Thiên ấn', 'Chính ấn',
] as const;
export type ThapThan = (typeof THAP_THAN)[number];

/** Thập thần của thiên can `can` so với nhật chủ `nhatChu` (chỉ số 0..9). */
export function thapThan(nhatChu: number, can: number): ThapThan {
  const h1 = HANH_CAN[nhatChu];
  const h2 = HANH_CAN[can];
  const cungAmDuong = nhatChu % 2 === can % 2;
  const chon = (cung: ThapThan, khac: ThapThan) => (cungAmDuong ? cung : khac);
  if (h1 === h2) return chon('Tỷ kiên', 'Kiếp tài');
  if (SINH[h1] === h2) return chon('Thực thần', 'Thương quan');
  if (KHAC[h1] === h2) return chon('Thiên tài', 'Chính tài');
  if (KHAC[h2] === h1) return chon('Thất sát', 'Chính quan');
  return chon('Thiên ấn', 'Chính ấn'); // h2 sinh h1
}

export type TruBatTu = {
  ten: 'Năm' | 'Tháng' | 'Ngày' | 'Giờ';
  can: string;
  chi: string;
  canChi: string;
  hanhCan: Hanh;
  hanhChi: Hanh;
  amDuong: 'Dương' | 'Âm';
  napAm: string;
  /** Thập thần của thiên can; trụ ngày là "Nhật chủ". */
  thapThanCan: ThapThan | 'Nhật chủ';
  tangCan: { can: string; hanh: Hanh; thapThan: ThapThan }[];
};

export type DaiVanBatTu = { thuTu: number; canChi: string; hanhCan: Hanh; hanhChi: Hanh; tuTuoi: number; tuNam: number; dangChay: boolean };

export type LaSoBatTu = {
  dauVao: { ngay: number; thang: number; nam: number; gio: number; phut: number; gioiTinh: 'nam' | 'nu' };
  tru: [TruBatTu, TruBatTu, TruBatTu, TruBatTu];
  nhatChu: { can: string; hanh: Hanh; amDuong: 'Dương' | 'Âm' };
  /** Đếm 8 chữ (4 can + 4 chi) theo ngũ hành. */
  demNguHanh: Record<Hanh, number>;
  /** Hành không xuất hiện trong 8 chữ. */
  thieuHanh: Hanh[];
  tiet: { truoc: { ten: string; luc: string }; sau: { ten: string; luc: string } };
  daiVan: { chieu: 'thuận' | 'nghịch'; khoiVan: { nam: number; thang: number }; ds: DaiVanBatTu[] };
  quyUoc: string[];
};

export type DauVaoBatTu = {
  ngay: number; thang: number; nam: number; gio: number; phut?: number;
  gioiTinh: 'nam' | 'nu';
  /** true (mặc định): 23:00–23:59 tính sang ngày hôm sau. */
  doiNgayLuc23?: boolean;
  /** Năm dương đang xem, để đánh dấu đại vận đang chạy. */
  namXem?: number;
};

const NAM_TU = 1900;
const NAM_DEN = 2100;

const hai = (n: number) => String(n).padStart(2, '0');
function gioVN(d: Date): string {
  const x = new Date(d.getTime() + 7 * 3600000);
  return `${hai(x.getUTCDate())}/${hai(x.getUTCMonth() + 1)}/${x.getUTCFullYear()} ${hai(x.getUTCHours())}:${hai(x.getUTCMinutes())}`;
}

/** 12 tiết (kinh độ ≡ 15 mod 30) quanh năm `nam`, theo thời gian. */
function cacTiet(nam: number): { ten: string; kinhDo: number; thoiDiem: Date }[] {
  const ds: { ten: string; kinhDo: number; thoiDiem: Date }[] = [];
  for (const y of [nam - 1, nam, nam + 1]) {
    for (const m of lietKeTietKhi(y) as { ten: string; kinhDo: number; thoiDiem: Date }[]) {
      if (m.kinhDo % 30 === 15) ds.push(m);
    }
  }
  return ds.sort((a, b) => a.thoiDiem.getTime() - b.thoiDiem.getTime());
}

function lamTru(ten: TruBatTu['ten'], cc: CapCanChi, nhatChu: number): TruBatTu {
  return {
    ten,
    can: cc.tenCan,
    chi: cc.tenChi,
    canChi: cc.ten,
    hanhCan: HANH_CAN[cc.can],
    hanhChi: HANH_CHI[cc.chi],
    amDuong: cc.can % 2 === 0 ? 'Dương' : 'Âm',
    napAm: napAm(cc.can, cc.chi),
    thapThanCan: ten === 'Ngày' ? 'Nhật chủ' : thapThan(nhatChu, cc.can),
    tangCan: TANG_CAN[cc.chi].map((c) => ({ can: THIEN_CAN[c], hanh: HANH_CAN[c], thapThan: thapThan(nhatChu, c) })),
  };
}

export function kiemTraDauVao(v: Partial<DauVaoBatTu>): string | null {
  const { ngay, thang, nam, gio, phut = 0, gioiTinh } = v;
  if (![ngay, thang, nam, gio, phut].every((x) => Number.isInteger(x))) return 'Ngày giờ sinh chưa đủ.';
  if (nam! < NAM_TU || nam! > NAM_DEN) return `Năm sinh trong khoảng ${NAM_TU}–${NAM_DEN}.`;
  if (thang! < 1 || thang! > 12) return 'Tháng không hợp lệ.';
  const d = new Date(Date.UTC(nam!, thang! - 1, ngay!));
  if (d.getUTCDate() !== ngay || d.getUTCMonth() !== thang! - 1) return 'Ngày không có trong tháng.';
  if (gio! < 0 || gio! > 23 || phut < 0 || phut > 59) return 'Giờ sinh không hợp lệ.';
  if (gioiTinh !== 'nam' && gioiTinh !== 'nu') return 'Chọn giới tính.';
  return null;
}

export function lapLaSoBatTu(v: DauVaoBatTu): LaSoBatTu {
  const loi = kiemTraDauVao(v);
  if (loi) throw new RangeError(loi);
  const { ngay, thang, nam, gio, gioiTinh, doiNgayLuc23 = true } = v;
  const phut = v.phut ?? 0;
  const luc = new Date(Date.UTC(nam, thang - 1, ngay, gio, phut) - 7 * 3600000);

  // Tiết trước/sau thời điểm sinh.
  const tiet = cacTiet(nam);
  const iSau = tiet.findIndex((t) => t.thoiDiem.getTime() > luc.getTime());
  const tietSau = tiet[iSau];
  const tietTruoc = tiet[iSau - 1];

  // Trụ năm: đổi tại Lập xuân.
  const lapXuan = tiet.filter((t) => t.kinhDo === 315 && t.thoiDiem.getTime() <= luc.getTime()).pop()!;
  const namTru = Number(gioVN(lapXuan.thoiDiem).slice(6, 10));
  const ccNam = canChiNam(namTru);

  // Trụ tháng: số tiết đã qua kể từ Lập xuân (0 = Dần).
  const lambda = kinhDoMatTroi(luc);
  const thuTuThang = Math.floor((((lambda - 315) % 360) + 360) % 360 / 30);
  const ccThang = canChiThang(thuTuThang + 1, namTru);

  // Trụ ngày (23h sang ngày sau nếu theo quy ước mặc định).
  const jdn = soNgayJulius(ngay, thang, nam) + (doiNgayLuc23 && gio === 23 ? 1 : 0);
  const ccNgay = canChiNgay(jdn);
  const ccGio = canChiGio(ccNgay.can, gio);

  const nhatChu = ccNgay.can;
  const tru: LaSoBatTu['tru'] = [
    lamTru('Năm', ccNam, nhatChu),
    lamTru('Tháng', ccThang, nhatChu),
    lamTru('Ngày', ccNgay, nhatChu),
    lamTru('Giờ', ccGio, nhatChu),
  ];

  const demNguHanh: Record<Hanh, number> = { Kim: 0, Mộc: 0, Thủy: 0, Hỏa: 0, Thổ: 0 };
  for (const t of tru) { demNguHanh[t.hanhCan]++; demNguHanh[t.hanhChi]++; }
  const thieuHanh = (Object.keys(demNguHanh) as Hanh[]).filter((h) => demNguHanh[h] === 0);

  // Đại vận.
  const duongNam = ccNam.can % 2 === 0;
  const thuan = (duongNam && gioiTinh === 'nam') || (!duongNam && gioiTinh === 'nu');
  const msNgay = 86400000;
  const soNgay = thuan
    ? (tietSau.thoiDiem.getTime() - luc.getTime()) / msNgay
    : (luc.getTime() - tietTruoc.thoiDiem.getTime()) / msNgay;
  const tongThang = Math.round(soNgay * 4); // 1 ngày = 4 tháng
  const khoiVan = { nam: Math.floor(tongThang / 12), thang: tongThang % 12 };
  const namXem = v.namXem ?? new Date(Date.now() + 7 * 3600000).getUTCFullYear();
  const namKhoi = nam + khoiVan.nam + (thang + khoiVan.thang > 12 ? 1 : 0);
  const ds: DaiVanBatTu[] = [];
  for (let i = 1; i <= 8; i++) {
    const buoc = thuan ? i : -i;
    const can = (((ccThang.can + buoc) % 10) + 10) % 10;
    const chi = (((ccThang.chi + buoc) % 12) + 12) % 12;
    const tuNam = namKhoi + (i - 1) * 10;
    ds.push({
      thuTu: i,
      canChi: `${THIEN_CAN[can]} ${DIA_CHI[chi]}`,
      hanhCan: HANH_CAN[can],
      hanhChi: HANH_CHI[chi],
      tuTuoi: tuNam - nam + 1, // tuổi mụ
      tuNam,
      dangChay: namXem >= tuNam && namXem < tuNam + 10,
    });
  }

  return {
    dauVao: { ngay, thang, nam, gio, phut, gioiTinh },
    tru,
    nhatChu: { can: ccNgay.tenCan, hanh: HANH_CAN[nhatChu], amDuong: nhatChu % 2 === 0 ? 'Dương' : 'Âm' },
    demNguHanh,
    thieuHanh,
    tiet: {
      truoc: { ten: tietTruoc.ten, luc: gioVN(tietTruoc.thoiDiem) },
      sau: { ten: tietSau.ten, luc: gioVN(tietSau.thoiDiem) },
    },
    daiVan: { chieu: thuan ? 'thuận' : 'nghịch', khoiVan, ds },
    quyUoc: [
      'Trụ năm đổi tại Lập xuân, không đổi tại Tết âm lịch.',
      'Trụ tháng đổi tại 12 tiết; tháng Dần bắt đầu từ Lập xuân.',
      doiNgayLuc23 ? 'Sinh từ 23:00 tính sang ngày hôm sau (giờ Tý đầu).' : 'Ngày đổi lúc 0:00.',
      'Dùng giờ đồng hồ Việt Nam (UTC+7), chưa đổi sang giờ mặt trời thật.',
      'Tuổi đại vận tính theo tuổi mụ.',
    ],
  };
}

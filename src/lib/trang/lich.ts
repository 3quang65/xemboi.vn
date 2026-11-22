// Dữ liệu lịch cho trang công khai v2: hôm nay, chi tiết một ngày, lưới tháng (docs/v2/19 mục 1.3).
// Engine: src/lib/tuvi-v2/am-lich.ts (thuật toán Hồ Ngọc Đức, múi giờ +7) và tiet-khi.mjs (Meeus).
// Giờ hoàng đạo theo bảng 6 mẫu của Hồ Ngọc Đức (amlich.js, GIO_HD), tra theo địa chi của ngày.
import {
  DIA_CHI, KHUNG_GIO, TEN_CON_GIAP, amSangDuong, canChiGio, canChiNam, canChiNgay, canChiThang, duongSangAm,
  hanhNapAm, napAm, soNgayJulius, thangNhuan, tuSoNgayJulius, type CapCanChi, type NgayAm, type NgayDuong,
} from '@/lib/tuvi-v2/am-lich';
import { tietKhi, lietKeTietKhi } from '@/lib/tuvi-v2/tiet-khi.mjs';

export const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'] as const;

const GIO_HD = ['110100101100', '001101001011', '110011010010', '101100110100', '001011001101', '010010110011'];

export type GioTrongNgay = { chi: string; khung: string; canChi: string; hoangDao: boolean };
export type NgayLe = { ten: string; loai: 'am' | 'duong' };

export type ChiTietNgay = {
  duong: NgayDuong;
  am: NgayAm;
  thu: string;
  /** 'YYYY-MM-DD' để làm khóa và đường dẫn. */
  iso: string;
  canChiNgay: CapCanChi;
  canChiThang: CapCanChi;
  canChiNam: CapCanChi;
  conGiapNam: string;
  napAmNgay: string;
  hanhNgay: string;
  /** Tên tháng âm, vd "tháng Chạp", "tháng 4 nhuận". */
  tenThangAm: string;
  soNgayThangAm: 29 | 30;
  tietKhi: { ten: string; batDau: string; ketThuc: string; batDauHomNay: boolean };
  gio: GioTrongNgay[];
  gioHoangDao: GioTrongNgay[];
  ngayLe: NgayLe[];
};

const hai = (n: number) => String(n).padStart(2, '0');
const isoDuong = (d: NgayDuong) => `${d.nam}-${hai(d.thang)}-${hai(d.ngay)}`;
// Mốc 12:00 giờ Việt Nam của một ngày dương, để tra tiết khí không lệch ngày.
const trua = (d: NgayDuong) => new Date(Date.UTC(d.nam, d.thang - 1, d.ngay, 5));
const ngayVN = (x: Date) => {
  const v = new Date(x.getTime() + 7 * 3600_000);
  return `${v.getUTCFullYear()}-${hai(v.getUTCMonth() + 1)}-${hai(v.getUTCDate())}`;
};

export function tenThangAm(thang: number, nhuan = false): string {
  const ten = thang === 1 ? 'Giêng' : thang === 12 ? 'Chạp' : String(thang);
  return `tháng ${ten}${nhuan ? ' nhuận' : ''}`;
}

const LE_AM: Record<string, string> = {
  '1-1': 'Tết Nguyên Đán', '2-1': 'Mùng 2 Tết', '3-1': 'Mùng 3 Tết', '15-1': 'Rằm tháng Giêng (Tết Nguyên Tiêu)',
  '3-3': 'Tết Hàn thực', '10-3': 'Giỗ Tổ Hùng Vương', '15-4': 'Lễ Phật đản', '5-5': 'Tết Đoan ngọ',
  '15-7': 'Rằm tháng Bảy (Vu Lan)', '15-8': 'Tết Trung thu', '23-12': 'Ông Công ông Táo',
};
const LE_DUONG: Record<string, string> = {
  '1-1': 'Tết Dương lịch', '14-2': 'Lễ Tình nhân', '8-3': 'Quốc tế Phụ nữ', '30-4': 'Ngày Thống nhất', '1-5': 'Quốc tế Lao động',
  '1-6': 'Quốc tế Thiếu nhi', '2-9': 'Quốc khánh', '20-10': 'Ngày Phụ nữ Việt Nam', '20-11': 'Ngày Nhà giáo Việt Nam', '24-12': 'Đêm Giáng sinh', '25-12': 'Lễ Giáng sinh',
};

/** `cuoiThangAm`: ngày này là ngày cuối của tháng âm (để nhận Giao thừa ở tháng Chạp 29 hoặc 30 ngày). */
export function ngayLe(duong: NgayDuong, am: NgayAm, cuoiThangAm: boolean): NgayLe[] {
  const kq: NgayLe[] = [];
  if (!am.nhuan) {
    const le = LE_AM[`${am.ngay}-${am.thang}`];
    if (le) kq.push({ ten: le, loai: 'am' });
    if (am.thang === 12 && cuoiThangAm) kq.push({ ten: 'Giao thừa', loai: 'am' });
  }
  if (!kq.length && (am.ngay === 1 || am.ngay === 15)) kq.push({ ten: am.ngay === 1 ? 'Mùng 1' : 'Ngày rằm', loai: 'am' });
  const ld = LE_DUONG[`${duong.ngay}-${duong.thang}`];
  if (ld) kq.push({ ten: ld, loai: 'duong' });
  return kq;
}

function soNgayCuaThangAm(am: NgayAm): 29 | 30 {
  const dau = amSangDuong(1, am.thang, am.nam, am.nhuan);
  if (!dau) return 30;
  const jdnDau = soNgayJulius(dau.ngay, dau.thang, dau.nam);
  const sau = tuSoNgayJulius(jdnDau + 29);
  return duongSangAm(sau.ngay, sau.thang, sau.nam).ngay === 30 ? 30 : 29;
}

const laCuoiThangAm = (jdn: number) => {
  const sau = tuSoNgayJulius(jdn + 1);
  return duongSangAm(sau.ngay, sau.thang, sau.nam).ngay === 1;
};

/** Kiểm ngày dương hợp lệ (năm 1800–2199, giới hạn kiểm thử của engine). */
export function ngayHopLe(d: number, m: number, y: number): boolean {
  if (![d, m, y].every(Number.isInteger) || y < 1800 || y > 2199 || m < 1 || m > 12 || d < 1) return false;
  return d <= new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Toàn bộ thông tin một ngày dương lịch. Ném lỗi nếu ngày không hợp lệ. */
export function ngayLich(ngay: number, thang: number, nam: number): ChiTietNgay {
  if (!ngayHopLe(ngay, thang, nam)) throw new RangeError(`Ngày không hợp lệ: ${ngay}/${thang}/${nam}`);
  const duong = { ngay, thang, nam };
  const jdn = soNgayJulius(ngay, thang, nam);
  const am = duongSangAm(ngay, thang, nam);
  const ccNgay = canChiNgay(jdn);
  const nap = napAm(ccNgay.can, ccNgay.chi);
  const mau = GIO_HD[ccNgay.chi % 6];
  const gio: GioTrongNgay[] = DIA_CHI.map((chi, i) => ({
    chi, khung: KHUNG_GIO[i], canChi: canChiGio(ccNgay.can, i, true).ten, hoangDao: mau[i] === '1',
  }));
  const tk = tietKhi(trua(duong));
  const soNgay = soNgayCuaThangAm(am);
  return {
    duong, am, iso: isoDuong(duong), thu: THU[(jdn + 1) % 7],
    canChiNgay: ccNgay, canChiThang: canChiThang(am.thang, am.nam), canChiNam: canChiNam(am.nam),
    conGiapNam: TEN_CON_GIAP[canChiNam(am.nam).chi],
    napAmNgay: nap, hanhNgay: hanhNapAm(nap),
    tenThangAm: tenThangAm(am.thang, am.nhuan), soNgayThangAm: soNgay,
    tietKhi: { ten: tk.ten, batDau: ngayVN(tk.batDau), ketThuc: ngayVN(tk.ketThuc), batDauHomNay: ngayVN(tk.batDau) === isoDuong(duong) },
    gio, gioHoangDao: gio.filter((g) => g.hoangDao),
    ngayLe: ngayLe(duong, am, am.ngay === soNgay),
  };
}

/** Ngày dương hiện tại theo giờ Việt Nam (UTC+7). */
export function ngayHienTaiVN(luc = new Date()): NgayDuong {
  const v = new Date(luc.getTime() + 7 * 3600_000);
  return { ngay: v.getUTCDate(), thang: v.getUTCMonth() + 1, nam: v.getUTCFullYear() };
}

export function homNay(luc = new Date()): ChiTietNgay {
  const d = ngayHienTaiVN(luc);
  return ngayLich(d.ngay, d.thang, d.nam);
}

export function ngayMai(luc = new Date()): ChiTietNgay {
  return homNay(new Date(luc.getTime() + 86_400_000));
}

export type ONgay = {
  duong: NgayDuong; iso: string; am: NgayAm; trongThang: boolean; laHomNay: boolean;
  /** Nhãn âm ngắn: "1/4" ở mùng 1 và ngày đầu lưới, còn lại chỉ số ngày. */
  nhanAm: string; canChiNgay: string; ngayLe: NgayLe[];
};
export type LuoiThang = {
  nam: number; thang: number; tieuDe: string; thangAm: string[];
  /** 6 hàng × 7 cột, bắt đầu Thứ hai. */
  hang: ONgay[][];
  thangTruoc: { nam: number; thang: number }; thangSau: { nam: number; thang: number };
};

/** Lưới tháng dương lịch kèm ngày âm (bắt đầu Thứ hai, luôn 6 hàng). */
export function thangLich(nam: number, thang: number, luc = new Date()): LuoiThang {
  if (!ngayHopLe(1, thang, nam)) throw new RangeError(`Tháng không hợp lệ: ${thang}/${nam}`);
  const jdn1 = soNgayJulius(1, thang, nam);
  const lechThu = (jdn1 + 1) % 7; // 0 = Chủ nhật
  const batDau = jdn1 - ((lechThu + 6) % 7);
  const homNayIso = isoDuong(ngayHienTaiVN(luc));
  const thangAm = new Set<string>();
  const hang: ONgay[][] = [];
  for (let h = 0; h < 6; h++) {
    const dong: ONgay[] = [];
    for (let c = 0; c < 7; c++) {
      const jdn = batDau + h * 7 + c;
      const duong = tuSoNgayJulius(jdn);
      const am = duongSangAm(duong.ngay, duong.thang, duong.nam);
      const trongThang = duong.thang === thang;
      if (trongThang) thangAm.add(`${tenThangAm(am.thang, am.nhuan)} năm ${canChiNam(am.nam).ten}`);
      const dauLuoi = h === 0 && c === 0;
      dong.push({
        duong, iso: isoDuong(duong), am, trongThang, laHomNay: isoDuong(duong) === homNayIso,
        nhanAm: am.ngay === 1 || dauLuoi ? `${am.ngay}/${am.thang}${am.nhuan ? 'N' : ''}` : String(am.ngay),
        canChiNgay: canChiNgay(jdn).ten,
        ngayLe: trongThang ? ngayLe(duong, am, laCuoiThangAm(jdn)) : [],
      });
    }
    hang.push(dong);
  }
  return {
    nam, thang, tieuDe: `Tháng ${thang} năm ${nam}`, thangAm: [...thangAm], hang,
    thangTruoc: thang === 1 ? { nam: nam - 1, thang: 12 } : { nam, thang: thang - 1 },
    thangSau: thang === 12 ? { nam: nam + 1, thang: 1 } : { nam, thang: thang + 1 },
  };
}

/** 24 tiết khí của một năm dương, ngày theo giờ Việt Nam. */
export function tietKhiNam(nam: number): { ten: string; ngay: string }[] {
  const ds: { ten: string; thoiDiem: Date }[] = lietKeTietKhi(nam);
  return ds.map((m) => ({ ten: m.ten, ngay: ngayVN(m.thoiDiem) })).sort((x, y) => x.ngay.localeCompare(y.ngay));
}

/** Tháng nhuận của năm âm (0 nếu không nhuận). */
export { thangNhuan };

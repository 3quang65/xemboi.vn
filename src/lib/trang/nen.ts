// Dữ liệu cho các trang nền v2 (docs/v2/19 F5): nguồn sách, từ điển thuật ngữ, danh sách bài, bảng tháng nhuận.
// Chỉ trả trường công khai. Nguồn sách: chỉ phamVi = CONG_KHAI; không trả đường dẫn cục bộ, ghi chú pháp lý nội bộ.
import { cache } from 'react';
import { prisma, nemLoiKhiBuild } from '@/lib/prisma';
import { thangNhuan, amSangDuong } from '@/lib/tuvi-v2/am-lich';
import { CON_GIAP, HOA_GIAP, NAP_AM, slugViet } from './can-chi';
import { CHINH_TINH, CUNG_TU_VI } from './tu-vi-tu-dien';
import { boChuHan, boChuHanHoacNull, coChuHan } from './chu-viet';

// ---------- nguồn sách ----------
export const TEN_LOAI_NGUON: Record<string, string> = {
  sach_co: 'Sách cổ', sach_hien_dai: 'Sách hiện đại', hoc_thuat: 'Học thuật', bo_du_lieu: 'Bộ dữ liệu', noi_bo_xemboi: 'Tài liệu của xemboi',
};

/** "E Xem ngày" → "Xem ngày"; mảnh hỏng do tách dấu phẩy ("thần sát)") bị bỏ; "B Can chi (nạp âm" → "Can chi". */
export function chuanHoaMang(ds: string[]): string[] {
  const kq: string[] = [];
  for (const m of ds) {
    const k = m.trim().match(/^[A-Z]\s+(.+)$/);
    if (!k) continue;
    const ten = k[1].replace(/\s*\(.*$/, '').trim();
    if (ten && !kq.includes(ten)) kq.push(ten);
  }
  return kq;
}

/** Ghi chú biên mục ("metadata ghi 1600") đổi sang lời đọc được cho người xem. */
export function lamSachGhiChu(s: string | null): string | null {
  if (!s) return s;
  return s.replace(/\s*\(metadata\)/g, ' (theo thư mục số hóa)').replace(/metadata ghi/g, 'thư mục số hóa ghi').trim();
}

export type NguonCongKhai = {
  ma: string; slug: string; tenGoc: string; tenHanViet: string | null; tenHienThi: string;
  tacGia: string | null; nienDai: string | null; banIn: string | null; ngonNgu: string[];
  mang: string[]; loaiNguon: string; tenLoai: string; url: string | null; giayPhep: string | null; ghiCong: string | null;
  uuTien: number | null;
};

export const danhSachNguonCongKhai = cache(async (): Promise<NguonCongKhai[]> => {
  try {
    const ds = await prisma.ragNguon.findMany({
      where: { phamVi: 'CONG_KHAI' },
      select: { ma: true, tenGoc: true, tenHanViet: true, tacGia: true, nienDai: true, banIn: true, ngonNgu: true, mang: true, loaiNguon: true, url: true, giayPhep: true, ghiCong: true, uuTien: true },
      orderBy: [{ uuTien: 'asc' }, { ma: 'asc' }],
    });
    const daDung = new Set<string>();
    return ds.map((n) => {
      let slug = slugViet(n.tenHanViet || '') || n.ma.toLowerCase();
      if (daDung.has(slug)) slug = `${slug}-${n.ma.toLowerCase()}`;
      daDung.add(slug);
      const url = n.url && /^https?:\/\//.test(n.url) ? n.url : null;
      return {
        // Trường hiển thị đã bỏ chữ Hán (quy tắc 24/11/2026); `tenGoc` giữ nguyên để tìm kiếm, trang không in ra.
        ...n, slug, url,
        tenHienThi: boChuHan(n.tenHanViet || n.tenGoc) || n.ma,
        tenHanViet: boChuHanHoacNull(n.tenHanViet),
        tacGia: boChuHanHoacNull(lamSachGhiChu(n.tacGia)), nienDai: boChuHanHoacNull(lamSachGhiChu(n.nienDai)),
        banIn: boChuHanHoacNull(n.banIn), ghiCong: boChuHanHoacNull(n.ghiCong),
        mang: chuanHoaMang(n.mang), tenLoai: TEN_LOAI_NGUON[n.loaiNguon] ?? n.loaiNguon,
      };
    });
  } catch (e) {
    nemLoiKhiBuild(e);
    return [];
  }
});

export async function nguonTheoSlug(slug: string): Promise<NguonCongKhai | undefined> {
  return (await danhSachNguonCongKhai()).find((n) => n.slug === slug);
}

/** Số đoạn trích đã xuất bản dẫn tới một nguồn (để hiện "được trích ở N bài"). */
export const soBaiTrichNguon = cache(async (ma: string): Promise<number> => {
  try {
    const ds = await prisma.noiDungTrichDan.findMany({
      where: { nguon: { ma }, phienBan: { noiDung: { trangThai: 'DA_XUAT_BAN' } } },
      select: { phienBan: { select: { noiDungId: true } } },
    });
    return new Set(ds.map((d) => d.phienBan.noiDungId)).size;
  } catch (e) {
    nemLoiKhiBuild(e);
    return 0;
  }
});

// ---------- từ điển thuật ngữ ----------
export const TEN_MANG: Record<string, string> = {
  'tu-vi': 'Tử vi', 'bat-tu': 'Bát tự', 'kinh-dich': 'Kinh Dịch', 'phong-thuy': 'Phong thủy', 'chon-ngay': 'Chọn ngày', chung: 'Thuật ngữ chung',
};
const THU_TU_MANG = ['chung', 'tu-vi', 'bat-tu', 'kinh-dich', 'chon-ngay', 'phong-thuy'];

export type ThuatNguHienThi = { han: string; hanViet: string; bienThe: string[]; mang: string; lienKet: string | null };

/** Trang v2 đã có cho thuật ngữ (khớp tên Hán Việt, không phân biệt hoa thường). */
function lienKetThuatNgu(hanViet: string): string | null {
  const k = hanViet.toLowerCase().normalize('NFC');
  const sao = CHINH_TINH.find((s) => s.ten.toLowerCase() === k);
  if (sao) return `/tu-vi/sao/${sao.slug}`;
  const cung = CUNG_TU_VI.find((c) => c.ten.toLowerCase() === k || `cung ${c.ten.toLowerCase()}` === k);
  if (cung) return `/tu-vi/cung/${cung.slug}`;
  const hg = HOA_GIAP.find((h) => h.ten.toLowerCase() === k);
  if (hg) return `/can-chi/${hg.slug}`;
  const na = NAP_AM.find((n) => n.ten.toLowerCase() === k);
  if (na) return `/nap-am/${na.slug}`;
  const cg = CON_GIAP.find((c) => c.chi.toLowerCase() === k);
  if (cg) return `/con-giap/${cg.slug}`;
  if (k === 'ngũ hành') return '/ngu-hanh';
  if (k === 'nạp âm') return '/nap-am';
  if (k === 'lục thập hoa giáp' || k === 'hoa giáp') return '/can-chi/60-hoa-giap';
  if (k === 'tứ trụ' || k === 'bát tự') return '/bat-tu';
  return null;
}

export const danhSachThuatNgu = cache(async (): Promise<{ mang: string; ten: string; muc: ThuatNguHienThi[] }[]> => {
  try {
    const ds = await prisma.thuatNgu.findMany({ orderBy: [{ mang: 'asc' }, { hanViet: 'asc' }] });
    const nhom = new Map<string, ThuatNguHienThi[]>();
    for (const t of ds) {
      // `han` chỉ để đối chiếu, trang không in; biến thể chỉ giữ cách viết tiếng Việt.
      const muc = { han: t.han, hanViet: t.hanViet, bienThe: t.bienThe.filter((b) => !coChuHan(b)), mang: t.mang, lienKet: lienKetThuatNgu(t.hanViet) };
      nhom.set(t.mang, [...(nhom.get(t.mang) ?? []), muc]);
    }
    const thuTu = (m: string) => (THU_TU_MANG.indexOf(m) + 1 || 99);
    return [...nhom.entries()]
      .sort((a, b) => thuTu(a[0]) - thuTu(b[0]))
      .map(([mang, muc]) => ({ mang, ten: TEN_MANG[mang] ?? mang, muc: muc.sort((a, b) => a.hanViet.localeCompare(b.hanViet, 'vi')) }));
  } catch (e) {
    nemLoiKhiBuild(e);
    return [];
  }
});

// ---------- bài viết đã xuất bản ----------
export type BaiTomTat = { tieuDe: string; duongDan: string; tomTat: string | null; ngayXuatBan: Date | null; mang: string[] };

/** Bài (BAI, PHUONG_PHAP) đã xuất bản, mới nhất trước. `tienTo` lọc theo đường dẫn, ví dụ "/kien-thuc". */
export const danhSachBaiViet = cache(async (tienTo?: string): Promise<BaiTomTat[]> => {
  try {
    const ds = await prisma.noiDung.findMany({
      where: {
        trangThai: 'DA_XUAT_BAN', phienBanXuatBanId: { not: null }, loai: { in: ['BAI', 'PHUONG_PHAP'] },
        trang: tienTo ? { duongDan: { startsWith: tienTo } } : { isNot: null },
      },
      select: { tieuDe: true, mang: true, ngayXuatBan: true, phienBanXuatBanId: true, trang: { select: { duongDan: true } } },
      orderBy: { ngayXuatBan: 'desc' },
    });
    const pb = await prisma.noiDungPhienBan.findMany({
      where: { id: { in: ds.map((d) => d.phienBanXuatBanId!) } },
      select: { id: true, tomTat: true },
    });
    const tt = new Map(pb.map((p) => [p.id, p.tomTat]));
    return ds.filter((d) => d.trang).map((d) => ({
      tieuDe: d.tieuDe, duongDan: d.trang!.duongDan, tomTat: tt.get(d.phienBanXuatBanId!) ?? null, ngayXuatBan: d.ngayXuatBan, mang: d.mang,
    }));
  } catch (e) {
    nemLoiKhiBuild(e);
    return [];
  }
});

// ---------- tháng nhuận ----------
/** `thangNeuUtc7`: chỉ có ở vài năm trước 1968 khi tính theo UTC+7 ra tháng nhuận khác (1917, 1922, 1938). */
export type DongThangNhuan = { namAm: number; thangNhuan: number; tuNgay: string; denNgay: string; thangNeuUtc7: number | null };

const hai = (n: number) => String(n).padStart(2, '0');

/**
 * Các năm âm có tháng nhuận trong [tu, den], kèm ngày dương bắt đầu và kết thúc tháng nhuận.
 * Theo quy ước lịch sử Việt Nam như bộ máy lá số: UTC+8 trước 01/01/1968, UTC+7 từ đó.
 */
export function bangThangNhuan(tu = 1900, den = 2100): DongThangNhuan[] {
  const kq: DongThangNhuan[] = [];
  for (let y = tu; y <= den; y++) {
    const t = thangNhuan(y, 'lichSu');
    if (!t) continue;
    const dau = amSangDuong(1, t, y, true, 'lichSu');
    const sau = t === 12 ? amSangDuong(1, 1, y + 1, false, 'lichSu') : amSangDuong(1, t + 1, y, false, 'lichSu');
    const t7 = thangNhuan(y, 7);
    if (!dau || !sau) continue;
    const cuoi = new Date(Date.UTC(sau.nam, sau.thang - 1, sau.ngay - 1));
    kq.push({
      namAm: y, thangNhuan: t,
      tuNgay: `${hai(dau.ngay)}/${hai(dau.thang)}/${dau.nam}`,
      denNgay: `${hai(cuoi.getUTCDate())}/${hai(cuoi.getUTCMonth() + 1)}/${cuoi.getUTCFullYear()}`,
      thangNeuUtc7: t7 !== t ? t7 : null,
    });
  }
  return kq;
}

// ---------- bảng quy ước tính (trang /phuong-phap) ----------
// Ghi đúng những gì bộ máy đang làm: tuvi-v2 QuyUoc (đặc tả mục 10), bat-tu.ts, lịch âm. Không phải lời bình.
export type QuyUocTinh = { ma: string; mang: 'Lịch âm' | 'Tử vi' | 'Bát tự'; chuDe: string; macDinh: string; khac: string[]; xemThem?: string };

export const BANG_QUY_UOC: QuyUocTinh[] = [
  { ma: 'lich-thuat-toan', mang: 'Lịch âm', chuDe: 'Thuật toán âm lịch', macDinh: 'Thuật toán thiên văn của Hồ Ngọc Đức (điểm Sóc, trung khí).', khac: [] },
  { ma: 'lich-mui-gio', mang: 'Lịch âm', chuDe: 'Múi giờ trước 01/01/1968', macDinh: 'UTC+8 trước 1968, UTC+7 từ 1968, như lịch Việt Nam thời đó.', khac: ['UTC+7 cho mọi năm (chọn được khi lập lá số).'], xemThem: '/phuong-phap/thang-nhuan' },
  { ma: 'lich-thang-nhuan', mang: 'Lịch âm', chuDe: 'Tháng nhuận', macDinh: 'Năm có 13 tháng giữa hai tháng 11 (tháng chứa Đông chí): tháng đầu tiên không chứa trung khí là tháng nhuận.', khac: [], xemThem: '/phuong-phap/thang-nhuan' },
  { ma: 'tv-gio-ty', mang: 'Tử vi', chuDe: 'Sinh từ 23:00 đến 23:59', macDinh: 'Tính sang ngày hôm sau (giờ Tý của ngày mới).', khac: ['Giữ ngày sinh cũ, chỉ đổi sang giờ Tý.', 'Cộng 1 ngày âm, giữ tháng âm (cách của thư viện iztro).'], xemThem: '/phuong-phap/gio-ty' },
  { ma: 'tv-thang-nhuan', mang: 'Tử vi', chuDe: 'Sinh tháng nhuận', macDinh: 'An sao như tháng chính.', khac: ['Ngày 1–15 tính tháng chính, từ ngày 16 tính tháng sau.', 'Tính sang tháng sau.'], xemThem: '/phuong-phap/thang-nhuan' },
  { ma: 'tv-mien-nam', mang: 'Tử vi', chuDe: 'Giờ đồng hồ miền Nam 1960–1975', macDinh: 'Đổi từ UTC+8 về giờ chuẩn UTC+7 theo dữ liệu múi giờ IANA.', khac: ['Không đổi.'] },
  { ma: 'tv-gio-mat-troi', mang: 'Tử vi', chuDe: 'Giờ mặt trời thật', macDinh: 'Không hiệu chỉnh; dùng giờ đồng hồ chuẩn UTC+7.', khac: [] },
  { ma: 'tv-ranh-gioi-nam', mang: 'Tử vi', chuDe: 'Ranh giới năm', macDinh: 'Mùng 1 Tết âm lịch.', khac: [] },
  { ma: 'tv-tu-hoa', mang: 'Tử vi', chuDe: 'Tứ hóa can Canh, Nhâm', macDinh: 'Bảng phái Việt.', khac: ['Bảng phái Trung Quốc.'], xemThem: '/phuong-phap/nam-phai-bac-phai' },
  { ma: 'tv-hoa-linh', mang: 'Tử vi', chuDe: 'Chiều an Hỏa Tinh, Linh Tinh', macDinh: 'Phái Việt: theo âm dương nam nữ; tuổi Tỵ Dậu Sửu theo câu phú (Hỏa Mão, Linh Tuất).', khac: ['Cả hai đi thuận.'] },
  { ma: 'tv-khoi-viet', mang: 'Tử vi', chuDe: 'Thiên Khôi, Thiên Việt', macDinh: 'Theo Tử Vi Đẩu Số Toàn Thư.', khac: ['Theo câu "Canh Tân phùng Mã Hổ".'] },
  { ma: 'tv-thien-giai', mang: 'Tử vi', chuDe: 'Thiên Giải', macDinh: 'Từ cung Thân, đi 2 cung cho mỗi tháng (theo cụ Thiên Lương).', khac: ['Theo cặp tháng.', 'Từ cung Thân, mỗi tháng một cung.'] },
  { ma: 'tv-thien-tru', mang: 'Tử vi', chuDe: 'Thiên Trù can Quý', macDinh: 'Cung Tuất.', khac: ['Cung Hợi.'] },
  { ma: 'tv-thuong-su', mang: 'Tử vi', chuDe: 'Thiên Thương, Thiên Sứ', macDinh: 'Cố định ở Nô bộc và Tật ách.', khac: ['Đổi chỗ cho Âm nam, Dương nữ (phái Trung Châu).'] },
  { ma: 'tv-menh-chu', mang: 'Tử vi', chuDe: 'Mệnh chủ', macDinh: 'Tra theo chi năm sinh (phái Việt).', khac: ['Tra theo chi cung Mệnh.'] },
  { ma: 'tv-tuan-triet', mang: 'Tử vi', chuDe: 'Tuần, Triệt', macDinh: 'Đặt ở vạch giữa hai cung (phái Việt).', khac: ['Chọn một cung.'] },
  { ma: 'tv-do-sang', mang: 'Tử vi', chuDe: 'Độ sáng (miếu, vượng, đắc, hãm)', macDinh: 'Bảng phái Việt; Tử Vi ở Tý là Bình, ở Ngọ là Miếu.', khac: [], xemThem: '/tu-vi/sao' },
  { ma: 'bt-nam', mang: 'Bát tự', chuDe: 'Trụ năm', macDinh: 'Đổi tại Lập xuân, không đổi tại Tết âm lịch.', khac: [] },
  { ma: 'bt-thang', mang: 'Bát tự', chuDe: 'Trụ tháng', macDinh: 'Đổi tại 12 tiết; tháng Dần bắt đầu từ Lập xuân; can tháng theo Ngũ Hổ Độn.', khac: [] },
  { ma: 'bt-ngay', mang: 'Bát tự', chuDe: 'Sinh từ 23:00', macDinh: 'Tính sang ngày hôm sau (giờ Tý đầu).', khac: ['Đổi ngày lúc 0:00 (chọn được khi lập).'], xemThem: '/phuong-phap/gio-ty' },
  { ma: 'bt-gio', mang: 'Bát tự', chuDe: 'Giờ dùng để tính', macDinh: 'Giờ đồng hồ Việt Nam (UTC+7), chưa đổi sang giờ mặt trời thật.', khac: [] },
  { ma: 'bt-dai-van', mang: 'Bát tự', chuDe: 'Đại vận', macDinh: 'Dương nam, âm nữ đi thuận; âm nam, dương nữ đi nghịch. Tuổi khởi vận = số ngày tới tiết (3 ngày = 1 năm); tuổi ghi theo tuổi mụ.', khac: [] },
];

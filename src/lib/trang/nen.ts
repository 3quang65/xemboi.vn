// Dữ liệu cho các trang nền v2 (docs/v2/19 F5): nguồn sách, từ điển thuật ngữ, danh sách bài, bảng tháng nhuận.
// Chỉ trả trường công khai. Nguồn sách: chỉ phamVi = CONG_KHAI; không trả đường dẫn cục bộ, ghi chú pháp lý nội bộ.
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { thangNhuan, amSangDuong } from '@/lib/tuvi-v2/am-lich';
import { CON_GIAP, HOA_GIAP, NAP_AM, slugViet } from './can-chi';
import { CHINH_TINH, CUNG_TU_VI } from './tu-vi-tu-dien';

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
        ...n, slug, url, tenHienThi: n.tenHanViet || n.tenGoc, tacGia: lamSachGhiChu(n.tacGia), nienDai: lamSachGhiChu(n.nienDai),
        mang: chuanHoaMang(n.mang), tenLoai: TEN_LOAI_NGUON[n.loaiNguon] ?? n.loaiNguon,
      };
    });
  } catch {
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
  } catch {
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
      const muc = { han: t.han, hanViet: t.hanViet, bienThe: t.bienThe, mang: t.mang, lienKet: lienKetThuatNgu(t.hanViet) };
      nhom.set(t.mang, [...(nhom.get(t.mang) ?? []), muc]);
    }
    const thuTu = (m: string) => (THU_TU_MANG.indexOf(m) + 1 || 99);
    return [...nhom.entries()]
      .sort((a, b) => thuTu(a[0]) - thuTu(b[0]))
      .map(([mang, muc]) => ({ mang, ten: TEN_MANG[mang] ?? mang, muc: muc.sort((a, b) => a.hanViet.localeCompare(b.hanViet, 'vi')) }));
  } catch {
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
  } catch {
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

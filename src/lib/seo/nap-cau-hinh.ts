// Nạp cấu hình SEO từ tài liệu: cụm 08, trang 16, quy tắc gán 16, nhóm loại, từ cấm.
// Mọi hàm đều chạy lại được: khóa tự nhiên (ma, maTrang, ten quy tắc, cum) quyết định cập nhật hay thêm.
import type { LoaiTrang, Prisma, PrismaClient, YDinh, ChinhSachLoai } from '@prisma/client';
import { docCsv } from './kho-tu-khoa';

type Db = PrismaClient | Prisma.TransactionClient;

// ---------- Cụm 08 ----------

const Y_DINH: Record<string, YDinh> = {
  'dùng công cụ': 'CONG_CU', 'tra cứu': 'TRA_CUU', 'so sánh': 'SO_SANH',
  'điều hướng thương hiệu': 'THUONG_HIEU', 'thương hiệu': 'THUONG_HIEU', 'mua (giao dịch)': 'GIAO_DICH', 'giao dịch': 'GIAO_DICH',
};
export const yDinhTuChu = (s: string): YDinh => Y_DINH[s.trim().toLowerCase()] ?? 'CHUA_RO';

export async function napCum08(db: Db, text: string) {
  const dong = docCsv(text).filter((r) => r.cum);
  for (const r of dong) {
    const data = {
      ten: r.tu_khoa_chinh || r.cum, tuKhoaChinh: r.tu_khoa_chinh || null, yDinh: yDinhTuChu(r.y_dinh || ''),
      congCuTrang: r.cong_cu_trang || null, diem: r.diem ? Number(r.diem) : null, tang: r.tang || null, muaVu: r.mua_vu || null,
    };
    await db.seoCum.upsert({ where: { ma: r.cum }, create: { ma: r.cum, ...data }, update: data });
  }
  return dong.length;
}

// ---------- Trang 16 ----------

const LOAI: Record<string, LoaiTrang> = {
  trang_chu: 'TRANG_CHU', hub: 'HUB', dieu_huong: 'HUB', cong_cu: 'CONG_CU', tu_dien: 'TU_DIEN', bai_viet: 'BAI', mua_vu: 'BAI', lap_trinh: 'KHAC',
};

function loaiTrang(loai: string, url: string, ma: string): LoaiTrang {
  if (ma === 'GOI' || url.startsWith('/goi')) return 'SAN_PHAM';
  if (ma.startsWith('PP')) return 'PHUONG_PHAP';
  if (url.startsWith('/nguon')) return 'NGUON';
  if (loai === 'lap_trinh') {
    if (/^\/(lich-am|xem-ngay)/.test(url)) return 'LICH';
    if (/\{yyyy\}/.test(url)) return 'THEO_NAM';
  }
  return LOAI[loai] ?? 'KHAC';
}

/** Nhóm sitemap theo khu nội dung (đoạn đầu của đường dẫn). */
export function nhomSitemapTu(url: string): string {
  const d = url.split('/')[1] || '';
  if (!d) return 'chinh';
  if (/^(lich-am|tiet-khi|xem-ngay|ngay-le)/.test(d)) return 'lich';
  if (/^tu-vi/.test(d)) return 'tu-vi';
  if (/^(can-chi|nap-am|ngu-hanh|con-giap|sinh-nam|xem-tuoi)/.test(d)) return 'can-chi';
  if (/^(bat-tu|tu-tru)/.test(d)) return 'bat-tu';
  if (/^(chiem-tinh|cung-hoang-dao)/.test(d)) return 'chiem-tinh';
  if (/^(than-so-hoc|kinh-dich|boi-bai|giai-mong|phong-thuy|boi)/.test(d)) return 'tra-cuu';
  if (/^(nguon|phuong-phap|tac-gia|gioi-thieu|kien-thuc)/.test(d)) return 'nguon';
  return 'khac';
}

/**
 * Nạp 16-seo-trang.csv: mỗi dòng một SeoTrang (khóa maTrang). Dòng có {tham số} trong URL thì thêm SeoMauTrang,
 * trang mẫu giữ ở NHAP (không vào sitemap; trang con sinh theo mẫu khi có engine).
 * Không ghi đè title/meta/h1/noindex của trang đã sửa tay (ghiDeMau = true).
 * `daCo` là tập đường dẫn đang chạy thật trên web: những trang đó được đánh XUAT_BAN.
 */
export async function napTrangCsv(db: Db, text: string, daCo: Set<string>) {
  const dong = docCsv(text).filter((r) => r.page_id && r.url);
  // Hai mẫu cùng URL (ví dụ chính tinh và phụ tinh cùng /tu-vi/sao/{sao}): mẫu thứ hai gắn mã trang vào đường dẫn.
  const demUrl = new Map<string, number>();
  for (const r of dong) demUrl.set(r.url, (demUrl.get(r.url) ?? 0) + 1);
  const daThay = new Set<string>();
  let soMau = 0;
  for (const r of dong) {
    const coThamSo = r.url.includes('{');
    const loai = loaiTrang(r.loai_trang, r.url, r.page_id);
    const nhom = nhomSitemapTu(r.url);
    const noindex = /^\s*NOINDEX/i.test(r.ghi_chu || '');
    let mauTrangId: string | null = null;
    if (coThamSo) {
      const ma = r.page_id.toLowerCase();
      const mau = {
        ten: r.tu_khoa_chinh || r.page_id, loaiTrang: loai, mauDuongDan: r.url, mauTitle: r.title_mau || r.tu_khoa_chinh,
        mauMeta: r.meta_mau || '', mauH1: r.h1_mau || r.tu_khoa_chinh, nguonDuLieu: 'chua-co',
        dieuKienIndex: noindex ? { luon: 'noindex' } : undefined, nhomSitemap: nhom,
      };
      mauTrangId = (await db.seoMauTrang.upsert({ where: { ma }, create: { ma, ...mau }, update: mau })).id;
      soMau++;
    }
    const cu = await db.seoTrang.findUnique({ where: { maTrang: r.page_id }, select: { id: true, ghiDeMau: true, trangThai: true } });
    let duongDan = r.url;
    if ((demUrl.get(r.url) ?? 0) > 1) { if (daThay.has(r.url)) duongDan = `${r.url}#${r.page_id}`; daThay.add(r.url); }
    const coBan = { duongDan, loai, mauTrangId, nhomSitemap: nhom, thamSoMau: { tang: r.tang, uuTien: r.uu_tien, mang: r.mang, cha: r.cha, yDinh: r.y_dinh } };
    const noiDung = { title: r.title_mau || r.tu_khoa_chinh || r.page_id, metaDescription: r.meta_mau || null, h1: r.h1_mau || null, noindex };
    const trangThai = !coThamSo && daCo.has(r.url) ? 'XUAT_BAN' : 'NHAP';
    if (!cu) {
      await db.seoTrang.create({ data: { maTrang: r.page_id, ...coBan, ...noiDung, trangThai, ngayXuatBan: trangThai === 'XUAT_BAN' ? new Date() : null } });
    } else {
      await db.seoTrang.update({
        where: { id: cu.id },
        data: { ...coBan, ...(cu.ghiDeMau ? {} : noiDung), ...(cu.trangThai === 'NHAP' && trangThai === 'XUAT_BAN' ? { trangThai, ngayXuatBan: new Date() } : {}) },
      });
    }
  }
  return { soTrang: dong.length, soMau };
}

// ---------- Quy tắc gán 16 + nhóm loại ----------

type QuyTacJson = { page_id: string; uu_tien: number; khop?: string[]; tru?: string[] };

/** Chính sách mặc định theo 17 mục 1.1.2. Các nhóm khác: CHO_QUYET. */
const CHINH_SACH: Record<string, { cs: ChinhSachLoai; nguon: string }> = {
  co_bac_so_de: { cs: 'LOAI_VINH_VIEN', nguon: '07 mục 3.5; 08 mục 3.3' },
  thai_nhi_nguoi_de_ton_thuong: { cs: 'LOAI_VINH_VIEN', nguon: '07 mục 3.5' },
  le_giai_han_tru_ta: { cs: 'LOAI_VINH_VIEN', nguon: '04 mục 3.4; 07 mục 3.5' },
  y_te_sinh_mo: { cs: 'LOAI_VINH_VIEN', nguon: '07 mục 3.5' },
  hu_doa_so_phan: { cs: 'LOAI_VINH_VIEN', nguon: '03; 07 mục 3.5' },
  hua_hen_chinh_xac_100: { cs: 'LOAI_VINH_VIEN', nguon: '07 mục 3.5' },
  thuong_hieu_doi_thu: { cs: 'DE_DANH_LANDING', nguon: 'anh 21/11/2026' },
};

const LY_DO: Record<string, string> = {
  co_bac_so_de: 'Cờ bạc, số đề, xin số', thai_nhi_nguoi_de_ton_thuong: 'Thai nhi, người dễ tổn thương',
  le_giai_han_tru_ta: 'Lễ giải hạn, trừ tà, bùa', vat_pham: 'Bán vật phẩm phong thủy', y_te_sinh_mo: 'Y tế, chọn giờ sinh mổ',
  tang_le_trung_tang: 'Tang lễ, trùng tang', hu_doa_so_phan: 'Hù dọa số phận', hua_hen_chinh_xac_100: 'Hứa hẹn chính xác 100%',
  chi_tay_sinh_trac: 'Chỉ tay, sinh trắc', not_ruoi: 'Nốt ruồi', sim_bien_so_so_dep: 'Sim, biển số, số đẹp',
  sao_han_tra_cuu: 'Tra sao hạn', thay_dia_phuong_dich_vu: 'Thầy và dịch vụ địa phương', diem_bao_dan_gian: 'Điềm báo dân gian',
  nhieu_thiet_bi_thu_tuc: 'Nhiễu: thiết bị, thủ tục', nhieu_dia_danh_quan_cong_ty: 'Nhiễu: địa danh, quán, công ty',
  nhieu_game_phim_nhac: 'Nhiễu: game, phim, nhạc', nhieu_khac_nghia: 'Nhiễu: khác nghĩa', thuong_hieu_doi_thu: 'Thương hiệu đối thủ',
  nguoi_noi_tieng: 'Người nổi tiếng', tai_lieu_ban_quyen: 'Tài liệu có bản quyền', tu_vi_hang_ngay: 'Tử vi hằng ngày theo tuổi',
  boi_vui_xep_hang: 'Bói vui, xếp hạng', boi_theo_ten_khong_can_cu: 'Bói theo tên, không căn cứ',
};

/**
 * Nạp 16-quy-tac-gan-tu-khoa.json. Mỗi phần tử thành một SeoQuyTacGan (tên = page_id + số thứ tự),
 * các mẫu `khop` gộp thành một biểu thức. Nhóm LOAI:* thành SeoNhomLoai (giữ chính sách đã đổi tay).
 * Quy tắc cũ không còn trong tệp thì tắt (không xóa, để giữ lịch sử).
 */
export async function napQuyTac(db: Db, ds: QuyTacJson[]) {
  const nhom = [...new Set(ds.filter((q) => q.page_id.startsWith('LOAI:')).map((q) => q.page_id.slice(5)))];
  for (const ma of nhom) {
    const mac = CHINH_SACH[ma] ?? { cs: 'CHO_QUYET' as ChinhSachLoai, nguon: '16 vòng 2' };
    await db.seoNhomLoai.upsert({
      where: { ma },
      create: { ma, lyDo: LY_DO[ma] ?? ma, chinhSach: mac.cs, nguonQuyet: mac.nguon },
      update: { lyDo: LY_DO[ma] ?? ma },
    });
  }
  const dem = new Map<string, number>();
  const tenGiu: string[] = [];
  const goc = Date.now() - ds.length * 1000;
  for (const [i, q] of ds.entries()) {
    const n = (dem.get(q.page_id) ?? 0) + 1; dem.set(q.page_id, n);
    const ten = `${q.page_id}#${n}`;
    tenGiu.push(ten);
    const bieuThuc = (q.khop ?? []).map((r) => `(?:${r})`).join('|') || '(?!)';
    const ketQua = q.page_id.startsWith('LOAI:')
      ? { nhomLoai: q.page_id.slice(5), tru: q.tru ?? [] }
      : { maTrang: q.page_id, tru: q.tru ?? [] };
    // Kiểm biểu thức trước khi ghi: lỗi ở đây nghĩa là tệp quy tắc sai.
    new RegExp(bieuThuc, 'iu'); (q.tru ?? []).forEach((t) => new RegExp(t, 'iu'));
    const cu = await db.seoQuyTacGan.findFirst({ where: { ten }, select: { id: true } });
    // taoLuc tăng dần theo thứ tự trong tệp: cùng uuTien thì quy tắc đứng trước thắng (như gan-tu-khoa.mjs).
    const data = { bieuThuc, ketQua, uuTien: q.uu_tien, batTat: true, taoLuc: new Date(goc + i * 1000) };
    if (cu) await db.seoQuyTacGan.update({ where: { id: cu.id }, data });
    else await db.seoQuyTacGan.create({ data: { ten, ...data } });
  }
  const tat = await db.seoQuyTacGan.updateMany({ where: { ten: { notIn: tenGiu } }, data: { batTat: false } });
  return { soQuyTac: ds.length, soNhomLoai: nhom.length, soTat: tat.count };
}

// ---------- Từ cấm ----------

export type MucTuCam = { cum: string; nhom: string; xuLy: 'CHAN_CUNG' | 'GAN_CO' | 'THAY_THE'; thayBang?: string | null; nguon: string };

export async function napTuCam(db: Db, ds: MucTuCam[]) {
  const map = new Map<string, MucTuCam>();
  for (const m of ds) {
    const cum = m.cum.normalize('NFC').trim().toLowerCase();
    if (!cum) continue;
    const cu = map.get(cum);
    // Cùng cụm từ hai nguồn: giữ cách xử lý nặng hơn, gộp nguồn.
    const nang = (x: MucTuCam['xuLy']) => ({ CHAN_CUNG: 3, THAY_THE: 2, GAN_CO: 1 })[x];
    if (!cu) map.set(cum, { ...m, cum });
    else map.set(cum, { ...(nang(m.xuLy) > nang(cu.xuLy) ? m : cu), cum, thayBang: cu.thayBang ?? m.thayBang, nguon: [...new Set([cu.nguon, m.nguon])].join('; ') });
  }
  const PHAM_VI = ['TIEU_DE', 'META', 'H1', 'THAN_BAI', 'NUT', 'ANH'];
  for (const m of map.values()) {
    const data = { nhom: m.nhom, xuLy: m.xuLy, thayBang: m.thayBang ?? null, nguon: m.nguon, phamVi: PHAM_VI };
    await db.tuCam.upsert({ where: { cum: m.cum }, create: { cum: m.cum, ...data }, update: data });
  }
  return map.size;
}

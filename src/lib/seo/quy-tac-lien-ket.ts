// Gợi ý liên kết theo quy tắc (docs/v2/17 mục 1.3 bước 3; quy tắc gốc ở 07 mục 2.4 và cột lien_ket_ra của 16-seo-trang.csv).
// Mỗi quy tắc nằm trong SeoQuyTacLienKet; `dieuKien.kieu` quyết định cách kiểm:
//   KE_HOACH     trang phải trỏ tới các trang ghi ở cột lien_ket_ra (16-seo-trang.csv)
//   DICH_CO_DINH trang (lọc theo loại/mảng/tiền tố) phải trỏ tới `denMau` (đường dẫn cụ thể)
//   CUNG_NHOM    trang từ điển trỏ 3–5 trang cùng `cha` và cùng loại
//   NAM_KE       trang có năm trong đường dẫn trỏ năm trước và năm sau
//   HIEN_THI     chỉ ghi nhận: liên kết sinh lúc hiển thị (lá số → từ điển, trích dẫn → /nguon), không gợi ý
// Kết quả: SeoLienKet nguon QUY_TAC, trangThai DE_XUAT. Cặp đã có (đang có, đã duyệt, đã BỎ QUA) thì không gợi ý lại.
import type { LoaiTrang, PrismaClient } from '@prisma/client';

export type KieuQuyTac = 'KE_HOACH' | 'DICH_CO_DINH' | 'CUNG_NHOM' | 'NAM_KE' | 'HIEN_THI';
export type DieuKien = { kieu: KieuQuyTac; mang?: string[]; tienTo?: string[]; nguon?: string };

export type QuyTacMau = {
  ten: string; tuLoai?: LoaiTrang; dieuKien: DieuKien; denMau: string; mauAnchor: string[];
  soToiThieu: number; soToiDa: number; batBuoc: boolean;
};

/** Bộ quy tắc nạp sẵn (07 mục 2.4). `ten` là khóa để nạp lại không trùng. */
export const QUY_TAC_MAC_DINH: QuyTacMau[] = [
  { ten: 'Kế hoạch liên kết ra (16-seo-trang.csv)', dieuKien: { kieu: 'KE_HOACH', nguon: '16-seo-trang.csv cột lien_ket_ra' }, denMau: '{lien_ket_ra}', mauAnchor: ['{title}'], soToiThieu: 0, soToiDa: 20, batBuoc: false },
  { ten: 'Mục từ điển → 3–5 mục cùng nhóm', tuLoai: 'TU_DIEN', dieuKien: { kieu: 'CUNG_NHOM' }, denMau: '{cung_cha}', mauAnchor: ['{h1}'], soToiThieu: 3, soToiDa: 5, batBuoc: false },
  { ten: 'Mục từ điển tử vi → form lập lá số', tuLoai: 'TU_DIEN', dieuKien: { kieu: 'DICH_CO_DINH', mang: ['tu-vi'] }, denMau: '/tu-vi/lap-la-so', mauAnchor: ['Xem sao này trên lá số của bạn'], soToiThieu: 1, soToiDa: 1, batBuoc: false },
  { ten: 'Trang năm ↔ năm trước, năm sau', dieuKien: { kieu: 'NAM_KE' }, denMau: '{nam_ke}', mauAnchor: ['{nam}'], soToiThieu: 2, soToiDa: 2, batBuoc: false },
  { ten: 'Mọi trang → /phuong-phap (chân trang)', dieuKien: { kieu: 'DICH_CO_DINH' }, denMau: '/phuong-phap', mauAnchor: ['Cách xemboi tính và biên tập'], soToiThieu: 1, soToiDa: 1, batBuoc: true },
  { ten: 'Xem tuổi, xem ngày → bài "Vì sao các nơi xem tuổi khác nhau"', dieuKien: { kieu: 'DICH_CO_DINH', mang: ['xem-tuoi', 'xem-ngay'] }, denMau: '/kien-thuc/vi-sao-cac-noi-xem-tuoi-khac-nhau', mauAnchor: ['Vì sao các nơi xem tuổi cho kết quả khác nhau'], soToiThieu: 1, soToiDa: 1, batBuoc: true },
  { ten: 'Lá số → mục từ điển của từng sao, cung, can chi', dieuKien: { kieu: 'HIEN_THI' }, denMau: '/tu-vi/sao/{sao}', mauAnchor: ['{ten_sao}'], soToiThieu: 0, soToiDa: 0, batBuoc: true },
  { ten: 'Trích dẫn → /nguon/<sach>', dieuKien: { kieu: 'HIEN_THI' }, denMau: '/nguon/{sach}', mauAnchor: ['{ten_sach}'], soToiThieu: 0, soToiDa: 0, batBuoc: true },
];

/** Nạp/cập nhật bộ quy tắc mặc định (khớp theo tên). Không đụng cờ bật/tắt người dùng đã đặt. */
export async function napQuyTacMacDinh(db: PrismaClient) {
  let moi = 0, sua = 0;
  for (const q of QUY_TAC_MAC_DINH) {
    const data = { tuLoai: q.tuLoai ?? null, dieuKien: q.dieuKien, denMau: q.denMau, mauAnchor: q.mauAnchor, soToiThieu: q.soToiThieu, soToiDa: q.soToiDa, batBuoc: q.batBuoc };
    const cu = await db.seoQuyTacLienKet.findFirst({ where: { ten: q.ten } });
    if (cu) { await db.seoQuyTacLienKet.update({ where: { id: cu.id }, data }); sua++; }
    else { await db.seoQuyTacLienKet.create({ data: { ten: q.ten, ...data } }); moi++; }
  }
  return { moi, sua };
}

type Trang = { id: string; duongDan: string; loai: LoaiTrang; title: string; h1: string | null; noindex: boolean; trangThai: string; mang: string | null; cha: string | null; maTrang: string | null };

const RE_NAM = /(^|[/-])((?:19|20)\d{2})(?=$|[/-])/;

/** Đường dẫn năm trước / năm sau (thay đúng một cụm 4 chữ số năm đầu tiên). */
export function duongNamKe(duong: string): { truoc: string; sau: string; nam: number } | null {
  const m = duong.match(RE_NAM);
  if (!m) return null;
  const nam = Number(m[2]);
  const thay = (n: number) => duong.replace(RE_NAM, `$1${n}`);
  return { truoc: thay(nam - 1), sau: thay(nam + 1), nam };
}

export type GoiY = { tuTrangId: string; denTrangId: string; anchor: string; quyTacId: string };
/** `thieu`: số liên kết quy tắc đòi mà HTML chưa có (kể cả đã gợi ý trước đó); `goiYMoi`: số gợi ý tạo mới lần này. */
export type BaoCaoQuyTac = { quyTac: { ten: string; kieu: KieuQuyTac; trangXet: number; thieu: number; goiYMoi: number }[]; goiYMoi: number };

/**
 * Xét mọi quy tắc đang bật trên các SeoTrang cụ thể (không phải mẫu có {…}), bỏ trang AN/DA_CHUYEN.
 * `keHoach`: duongDan → danh sách duongDan đích (từ cột lien_ket_ra, script dịch page_id → url).
 * Không gợi ý tới trang noindex, trang chính nó, hoặc cặp đã có trong SeoLienKet (mọi nguồn, mọi trạng thái).
 */
export async function goiYTheoQuyTac(db: PrismaClient, o: { keHoach?: Map<string, string[]>; ghi?: boolean } = {}): Promise<BaoCaoQuyTac> {
  const quyTac = await db.seoQuyTacLienKet.findMany({ where: { batTat: true }, orderBy: { ten: 'asc' } });
  const raw = await db.seoTrang.findMany({
    where: { NOT: [{ duongDan: { contains: '{' } }], trangThai: { notIn: ['AN', 'DA_CHUYEN'] } },
    select: { id: true, duongDan: true, loai: true, title: true, h1: true, noindex: true, trangThai: true, maTrang: true, thamSoMau: true },
  });
  const trang: Trang[] = raw.map((t) => {
    const ts = (t.thamSoMau ?? {}) as Record<string, unknown>;
    return { ...t, mang: typeof ts.mang === 'string' ? ts.mang : null, cha: typeof ts.cha === 'string' ? ts.cha : null };
  });
  const theoDuong = new Map(trang.map((t) => [t.duongDan, t]));
  const moiLienKet = await db.seoLienKet.findMany({ select: { tuTrangId: true, denTrangId: true, trangThai: true } });
  const daCo = new Set(moiLienKet.map((l) => `${l.tuTrangId}|${l.denTrangId}`)); // mọi trạng thái: để không gợi ý lại
  const ra = new Map<string, Set<string>>(); // chỉ liên kết thật đang có trong HTML: để đếm "thiếu"
  for (const l of moiLienKet) if (l.trangThai === 'DANG_CO') { if (!ra.has(l.tuTrangId)) ra.set(l.tuTrangId, new Set()); ra.get(l.tuTrangId)!.add(l.denTrangId); }

  const goiY: GoiY[] = [];
  const daGoiY = new Set<string>();
  const them = (tu: Trang, den: Trang | undefined, anchor: string, quyTacId: string) => {
    if (!den || den.id === tu.id || den.noindex) return false;
    const k = `${tu.id}|${den.id}`;
    if (daCo.has(k) || daGoiY.has(k)) return false;
    daGoiY.add(k);
    goiY.push({ tuTrangId: tu.id, denTrangId: den.id, anchor: anchor.slice(0, 200), quyTacId });
    return true;
  };
  const anchorCua = (mau: string, den: Trang, nam?: number) =>
    mau.replace('{title}', den.h1 || den.title).replace('{h1}', den.h1 || den.title).replace('{nam}', String(nam ?? ''));

  const bao: BaoCaoQuyTac['quyTac'] = [];
  for (const q of quyTac) {
    const dk = (q.dieuKien ?? { kieu: 'HIEN_THI' }) as DieuKien;
    const xet = trang.filter((t) =>
      (!q.tuLoai || t.loai === q.tuLoai) &&
      (!dk.mang?.length || (t.mang != null && dk.mang.includes(t.mang))) &&
      (!dk.tienTo?.length || dk.tienTo.some((p) => t.duongDan.startsWith(p))));
    let thieu = 0, moi = 0;
    const mau = q.mauAnchor[0] ?? '{title}';
    if (dk.kieu === 'HIEN_THI') { bao.push({ ten: q.ten, kieu: dk.kieu, trangXet: 0, thieu: 0, goiYMoi: 0 }); continue; }
    for (const t of xet) {
      const coRa = ra.get(t.id) ?? new Set<string>();
      if (dk.kieu === 'KE_HOACH') {
        for (const d of o.keHoach?.get(t.duongDan) ?? []) {
          const den = theoDuong.get(d);
          if (den && !coRa.has(den.id)) { thieu++; if (them(t, den, anchorCua(mau, den), q.id)) moi++; }
        }
      } else if (dk.kieu === 'DICH_CO_DINH') {
        const den = theoDuong.get(q.denMau);
        if (den && den.id !== t.id && !coRa.has(den.id)) { thieu++; if (them(t, den, anchorCua(mau, den), q.id)) moi++; }
      } else if (dk.kieu === 'CUNG_NHOM') {
        if (!t.cha) continue;
        const anhEm = trang.filter((x) => x.id !== t.id && x.cha === t.cha && x.loai === t.loai && !x.noindex).sort((a, b) => a.duongDan.localeCompare(b.duongDan));
        const daTro = anhEm.filter((x) => coRa.has(x.id)).length;
        const can = Math.min(q.soToiThieu, anhEm.length) - daTro;
        if (can <= 0) continue;
        thieu++;
        let them1 = 0;
        for (const x of anhEm) { if (them1 >= Math.min(can, q.soToiDa - daTro)) break; if (!coRa.has(x.id) && them(t, x, anchorCua(mau, x), q.id)) { them1++; moi++; } }
      } else if (dk.kieu === 'NAM_KE') {
        const nk = duongNamKe(t.duongDan);
        if (!nk) continue;
        for (const [d, n] of [[nk.truoc, nk.nam - 1], [nk.sau, nk.nam + 1]] as const) {
          const den = theoDuong.get(d);
          if (den && !coRa.has(den.id)) { thieu++; if (them(t, den, anchorCua(mau, den, n), q.id)) moi++; }
        }
      }
    }
    bao.push({ ten: q.ten, kieu: dk.kieu, trangXet: xet.length, thieu, goiYMoi: moi });
  }
  if (o.ghi !== false && goiY.length) {
    for (let i = 0; i < goiY.length; i += 1000) {
      await db.seoLienKet.createMany({ data: goiY.slice(i, i + 1000).map((g) => ({ ...g, nguon: 'QUY_TAC' as const, trangThai: 'DE_XUAT' as const })) });
    }
  }
  return { quyTac: bao, goiYMoi: goiY.length };
}

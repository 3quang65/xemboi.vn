// Kho từ khóa SEO (docs/v2/17 mục 1.1): chuẩn hóa, nhập tệp, gán theo quy tắc, báo cáo phủ.
import type { Prisma, PrismaClient, TrangThaiTuKhoa } from '@prisma/client';

type Db = PrismaClient | Prisma.TransactionClient;

// ---------- Chuẩn hóa ----------

/** NFC, chữ thường, gộp khoảng trắng (giống docs/v2/tu-khoa/gop-tu-khoa.py). Không gộp hai dạng dấu (thủy/thuỷ). */
export function chuanHoaTuKhoa(s: string): string {
  return s.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function boDau(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

const THANG: Record<string, string> = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };

/** "Nov 2025" → "2025-11" */
export function thangKP(s: string): string | null {
  const m = s.trim().match(/^([A-Za-z]{3})[a-z]*\s+(\d{4})$/);
  return m && THANG[m[1].toLowerCase()] ? `${m[2]}-${THANG[m[1].toLowerCase()]}` : null;
}

export type DongTuKhoa = {
  chuoi: string;
  luongTim?: number | null;
  luongTheoThang?: Record<string, number> | null;
  canhTranh?: string | null;
  chiSoCanhTranh?: number | null;
  nguon: string[];
};

/** Tính tháng cao nhất (1–12) và hệ số mùa vụ = max / trung bình 12 tháng. */
export function muaVu(theoThang: Record<string, number> | null | undefined) {
  if (!theoThang) return { thangCaoNhat: null, heSoMuaVu: null };
  const ds = Object.entries(theoThang).filter(([, v]) => Number.isFinite(v));
  if (!ds.length) return { thangCaoNhat: null, heSoMuaVu: null };
  const tb = ds.reduce((s, [, v]) => s + v, 0) / ds.length;
  const [kMax, vMax] = ds.reduce((a, b) => (b[1] > a[1] ? b : a));
  return { thangCaoNhat: Number(kMax.slice(5, 7)), heSoMuaVu: tb > 0 ? Math.round((vMax / tb) * 100) / 100 : null };
}

// ---------- Bộ đọc tệp ----------

/** Giải mã tệp tải lên: dò BOM UTF-16LE/BE và UTF-8. */
export function giaiMa(buf: Uint8Array): string {
  if (buf[0] === 0xff && buf[1] === 0xfe) return new TextDecoder('utf-16le').decode(buf.subarray(2));
  if (buf[0] === 0xfe && buf[1] === 0xff) return new TextDecoder('utf-16be').decode(buf.subarray(2));
  // UTF-16LE không BOM: byte thứ hai của ký tự ASCII là 0.
  if (buf.length > 4 && buf[1] === 0 && buf[3] === 0) return new TextDecoder('utf-16le').decode(buf);
  return new TextDecoder('utf-8').decode(buf).replace(/^﻿/, '');
}

function soKP(s: string | undefined): number | null {
  if (s == null || s.trim() === '' || s.trim() === '--') return null;
  const n = Number(s.replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? Math.round(n) : null;
}

/** Bản xuất Keyword Planner: các dòng tiêu đề phụ, rồi hàng cột (tab), có cột "Searches: <tháng>". */
export function docKeywordPlanner(text: string): { dong: DongTuKhoa[]; khoang: string | null } {
  const lines = text.split(/\r?\n/);
  const iHd = lines.findIndex((l) => /^"?Keyword"?\t/.test(l));
  if (iHd < 0) throw new Error('Không thấy hàng tiêu đề "Keyword" của Keyword Planner.');
  const hd = lines[iHd].split('\t').map((h) => h.replace(/^"|"$/g, '').trim());
  const iVol = hd.indexOf('Avg. monthly searches');
  const iCt = hd.indexOf('Competition');
  const iCs = hd.indexOf('Competition (indexed value)');
  const thang = hd.map((h, i) => [i, h.startsWith('Searches: ') ? thangKP(h.slice(10)) : null] as const).filter(([, t]) => t);
  const dong: DongTuKhoa[] = [];
  for (const l of lines.slice(iHd + 1)) {
    const c = l.split('\t').map((x) => x.replace(/^"|"$/g, ''));
    const chuoi = chuanHoaTuKhoa(c[0] || '');
    if (!chuoi || chuoi.length > 120) continue;
    const theoThang: Record<string, number> = {};
    for (const [i, t] of thang) { const v = soKP(c[i]); if (v != null) theoThang[t as string] = v; }
    dong.push({
      chuoi,
      luongTim: iVol >= 0 ? soKP(c[iVol]) : null,
      luongTheoThang: Object.keys(theoThang).length ? theoThang : null,
      canhTranh: iCt >= 0 ? c[iCt] || null : null,
      chiSoCanhTranh: iCs >= 0 ? soKP(c[iCs]) : null,
      nguon: ['KP'],
    });
  }
  const ts = thang.map(([, t]) => t as string).sort();
  return { dong, khoang: ts.length ? `${ts[0]}…${ts[ts.length - 1]}` : null };
}

/** Danh sách chuỗi (autocomplete, gợi ý): mỗi dòng một từ khóa, lấy cột đầu nếu là CSV. */
export function docDanhSach(text: string, nguon: string): DongTuKhoa[] {
  const out: DongTuKhoa[] = [];
  for (const l of text.split(/\r?\n/)) {
    const o = l.trim().startsWith('"') ? l.trim().replace(/^"|"$/g, '') : l.split(',')[0];
    const chuoi = chuanHoaTuKhoa(o || '');
    if (chuoi && chuoi.length <= 120) out.push({ chuoi, nguon: [nguon] });
  }
  return out;
}

/** Tách một dòng CSV có ngoặc kép. */
export function tachCsv(dong: string): string[] {
  const out: string[] = []; let cur = ''; let q = false;
  for (let i = 0; i < dong.length; i++) {
    const ch = dong[i];
    if (q) { if (ch === '"') { if (dong[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true; else if (ch === ',') { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}

export function docCsv(text: string): Record<string, string>[] {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.length);
  const hd = tachCsv(lines[0]);
  return lines.slice(1).map((l) => { const c = tachCsv(l); return Object.fromEntries(hd.map((h, i) => [h, c[i] ?? ''])); });
}

// ---------- Ghi vào kho ----------

/**
 * Gộp các dòng vào SeoTuKhoa (khóa là chuỗi đã chuẩn hóa). Chạy lại cùng tệp không sinh dòng trùng.
 * Lượng tìm mới chỉ ghi đè khi có số; nguồn được hợp lại.
 */
export async function gopVaoKho(db: Db, dong: DongTuKhoa[], loai: string, tenTep: string, khoang: string | null, nhapBoiId?: string | null) {
  // Gộp trùng trong chính tệp: giữ lượng lớn nhất.
  const map = new Map<string, DongTuKhoa>();
  for (const d of dong) {
    const cu = map.get(d.chuoi);
    if (!cu) map.set(d.chuoi, { ...d, nguon: [...d.nguon] });
    else {
      if ((d.luongTim ?? -1) > (cu.luongTim ?? -1)) Object.assign(cu, { luongTim: d.luongTim, luongTheoThang: d.luongTheoThang ?? cu.luongTheoThang, canhTranh: d.canhTranh ?? cu.canhTranh, chiSoCanhTranh: d.chiSoCanhTranh ?? cu.chiSoCanhTranh });
      cu.nguon = [...new Set([...cu.nguon, ...d.nguon])];
    }
  }
  const ds = [...map.values()];
  const daCo = new Set(
    (await db.$queryRaw<{ chuoi: string }[]>`SELECT chuoi FROM "SeoTuKhoa" WHERE chuoi = ANY(${ds.map((d) => d.chuoi)}::text[])`).map((r) => r.chuoi),
  );
  const LO = 2000;
  for (let i = 0; i < ds.length; i += LO) {
    const lo = ds.slice(i, i + LO);
    const mv = lo.map((d) => muaVu(d.luongTheoThang));
    await db.$executeRaw`
      INSERT INTO "SeoTuKhoa" (id, chuoi, "chuoiKhongDau", "luongTim", "luongTheoThang", "thangCaoNhat", "heSoMuaVu", "canhTranh", "chiSoCanhTranh", nguon, "capNhatLuc")
      SELECT 'tk_' || md5(x.chuoi), x.chuoi, x.kd, x.vol, x.ttj::jsonb, x.tcn, x.hs, x.ct, x.cs, string_to_array(x.ng, '+'), now()
      FROM unnest(
        ${lo.map((d) => d.chuoi)}::text[], ${lo.map((d) => boDau(d.chuoi))}::text[], ${lo.map((d) => d.luongTim ?? null)}::int[],
        ${lo.map((d) => (d.luongTheoThang ? JSON.stringify(d.luongTheoThang) : null))}::text[], ${mv.map((m) => m.thangCaoNhat)}::int[],
        ${mv.map((m) => m.heSoMuaVu)}::float8[], ${lo.map((d) => d.canhTranh ?? null)}::text[], ${lo.map((d) => d.chiSoCanhTranh ?? null)}::int[],
        ${lo.map((d) => d.nguon.join('+'))}::text[]
      ) AS x(chuoi, kd, vol, ttj, tcn, hs, ct, cs, ng)
      ON CONFLICT (chuoi) DO UPDATE SET
        "luongTim"       = COALESCE(EXCLUDED."luongTim", "SeoTuKhoa"."luongTim"),
        "luongTheoThang" = COALESCE(EXCLUDED."luongTheoThang", "SeoTuKhoa"."luongTheoThang"),
        "thangCaoNhat"   = COALESCE(EXCLUDED."thangCaoNhat", "SeoTuKhoa"."thangCaoNhat"),
        "heSoMuaVu"      = COALESCE(EXCLUDED."heSoMuaVu", "SeoTuKhoa"."heSoMuaVu"),
        "canhTranh"      = COALESCE(EXCLUDED."canhTranh", "SeoTuKhoa"."canhTranh"),
        "chiSoCanhTranh" = COALESCE(EXCLUDED."chiSoCanhTranh", "SeoTuKhoa"."chiSoCanhTranh"),
        nguon            = ARRAY(SELECT DISTINCT unnest("SeoTuKhoa".nguon || EXCLUDED.nguon) ORDER BY 1),
        "capNhatLuc"     = now()`;
  }
  const soMoi = ds.filter((d) => !daCo.has(d.chuoi)).length;
  const lo = await db.seoLoNhap.create({
    data: { tenTep, loai, khoangThoiGian: khoang, soDong: dong.length, soMoi, soCapNhat: ds.length - soMoi, nhapBoiId: nhapBoiId ?? null },
  });
  return { lo, soDong: dong.length, soKhongTrung: ds.length, soMoi, soCapNhat: ds.length - soMoi };
}

// ---------- Quy tắc gán ----------

export type KetQuaQuyTac = { maTrang?: string; nhomLoai?: string; tru?: string[] };

const trangThaiChoNhom = (ma: string): TrangThaiTuKhoa =>
  ma === 'thuong_hieu_doi_thu' ? 'THUONG_HIEU_DOI_THU' : 'LOAI_DINH_VI';

/**
 * Gán lại mọi từ khóa không gán tay theo quy tắc bật (uuTien nhỏ khớp trước, khớp đầu tiên thắng).
 * Từ khóa không khớp quy tắc nào được trả về MOI, bỏ trang đích.
 */
export async function ganTheoQuyTac(db: Db) {
  const quyTac = (await db.seoQuyTacGan.findMany({ where: { batTat: true }, orderBy: [{ uuTien: 'asc' }, { taoLuc: 'asc' }] })).map((q) => {
    const kq = q.ketQua as KetQuaQuyTac;
    return { id: q.id, re: new RegExp(q.bieuThuc, 'iu'), tru: (kq.tru ?? []).map((t) => new RegExp(t, 'iu')), kq };
  });
  const trang = new Map((await db.seoTrang.findMany({ where: { maTrang: { not: null } }, select: { id: true, maTrang: true } })).map((t) => [t.maTrang!, t.id]));
  const nhom = new Map((await db.seoNhomLoai.findMany({ select: { id: true, ma: true } })).map((n) => [n.ma, n.id]));
  const tuKhoa = await db.seoTuKhoa.findMany({ where: { OR: [{ cachGan: null }, { cachGan: 'QUY_TAC' }] }, select: { id: true, chuoi: true } });

  const ids: string[] = [], trangIds: (string | null)[] = [], quyIds: (string | null)[] = [], nhomIds: (string | null)[] = [], tts: string[] = [];
  const dem = new Map<string, number>();
  for (const t of tuKhoa) {
    const q = quyTac.find((r) => r.re.test(t.chuoi) && !r.tru.some((x) => x.test(t.chuoi)));
    ids.push(t.id);
    if (!q) { trangIds.push(null); quyIds.push(null); nhomIds.push(null); tts.push('MOI'); continue; }
    dem.set(q.id, (dem.get(q.id) ?? 0) + 1);
    quyIds.push(q.id);
    if (q.kq.nhomLoai) { trangIds.push(null); nhomIds.push(nhom.get(q.kq.nhomLoai) ?? null); tts.push(trangThaiChoNhom(q.kq.nhomLoai)); }
    else { trangIds.push(q.kq.maTrang ? trang.get(q.kq.maTrang) ?? null : null); nhomIds.push(null); tts.push('GIU'); }
  }
  const LO = 3000;
  for (let i = 0; i < ids.length; i += LO) {
    await db.$executeRaw`
      UPDATE "SeoTuKhoa" k SET "trangDichId" = x.tr, "quyTacId" = x.qt, "nhomLoaiId" = x.nh, "trangThai" = x.tt::"TrangThaiTuKhoa",
             "cachGan" = CASE WHEN x.qt IS NULL THEN NULL ELSE 'QUY_TAC'::"CachGan" END, "capNhatLuc" = now()
      FROM unnest(${ids.slice(i, i + LO)}::text[], ${trangIds.slice(i, i + LO)}::text[], ${quyIds.slice(i, i + LO)}::text[],
                  ${nhomIds.slice(i, i + LO)}::text[], ${tts.slice(i, i + LO)}::text[]) AS x(id, tr, qt, nh, tt)
      WHERE k.id = x.id`;
  }
  await db.$executeRaw`UPDATE "SeoQuyTacGan" SET "soKhop" = 0`;
  for (const [id, n] of dem) await db.seoQuyTacGan.update({ where: { id }, data: { soKhop: n } });
  return { soTuKhoa: tuKhoa.length, soCoQuyTac: dem.size ? [...dem.values()].reduce((a, b) => a + b, 0) : 0 };
}

// ---------- Báo cáo phủ ----------

export async function baoCaoPhu(db: Db) {
  const [tong] = await db.$queryRaw<{ n: bigint; v: bigint | null; loaiN: bigint; loaiV: bigint | null; coN: bigint; coV: bigint | null; chuaN: bigint; chuaV: bigint | null; xbN: bigint; xbV: bigint | null }[]>`
    SELECT count(*) n, sum("luongTim") v,
           count(*) FILTER (WHERE "nhomLoaiId" IS NOT NULL) "loaiN", sum("luongTim") FILTER (WHERE "nhomLoaiId" IS NOT NULL) "loaiV",
           count(*) FILTER (WHERE "nhomLoaiId" IS NULL AND "trangDichId" IS NOT NULL) "coN",
           sum("luongTim") FILTER (WHERE "nhomLoaiId" IS NULL AND "trangDichId" IS NOT NULL) "coV",
           count(*) FILTER (WHERE "nhomLoaiId" IS NULL AND "trangDichId" IS NULL) "chuaN",
           sum("luongTim") FILTER (WHERE "nhomLoaiId" IS NULL AND "trangDichId" IS NULL) "chuaV",
           count(*) FILTER (WHERE t."trangThai" = 'XUAT_BAN') "xbN", sum("luongTim") FILTER (WHERE t."trangThai" = 'XUAT_BAN') "xbV"
    FROM "SeoTuKhoa" k LEFT JOIN "SeoTrang" t ON t.id = k."trangDichId"`;
  const n = (x: bigint | null) => Number(x ?? 0);
  return {
    tong: n(tong.n), tongLuong: n(tong.v),
    loai: n(tong.loaiN), loaiLuong: n(tong.loaiV),
    coTrang: n(tong.coN), coTrangLuong: n(tong.coV),
    chuaGan: n(tong.chuaN), chuaGanLuong: n(tong.chuaV),
    daPhu: n(tong.xbN), daPhuLuong: n(tong.xbV),
  };
}

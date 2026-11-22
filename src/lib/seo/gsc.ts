// Đồng bộ Google Search Console (docs/v2/17 mục 1.5). Không thêm thư viện: tự ký JWT RS256 bằng node:crypto.
// - Khóa tài khoản dịch vụ là tệp JSON NGOÀI repo (đường dẫn qua tham số); không bao giờ ghi CSDL, không ghi nhật ký.
// - Kéo theo ngày: date×page×query×device → SeoGscNgay; date×page×device → SeoGscTrangNgay (Google ẩn truy vấn hiếm,
//   nên tổng theo trang lớn hơn tổng theo truy vấn). Mỗi ngày kéo lại thì THAY toàn bộ dòng của ngày đó (chạy lại an toàn).
// - Cảnh báo: TUT_HANG (7 ngày gần nhất so với 28 ngày trước đó) và TRUNG_Y_DINH (17 mục 1.1 bước 7b). Ngưỡng [GIẢ ĐỊNH].
import crypto from 'node:crypto';
import { Prisma, type PrismaClient } from '@prisma/client';

export type KhoaDichVu = { client_email: string; private_key: string; token_uri?: string };
type Fetch = typeof fetch;

const PHAM_VI = 'https://www.googleapis.com/auth/webmasters.readonly';
const b64url = (b: Buffer | string) => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

/** JWT assertion cho luồng tài khoản dịch vụ (RFC 7523), hạn 1 giờ. */
export function taoJwt(k: KhoaDichVu, nayGiay = Math.floor(Date.now() / 1000)): string {
  const dau = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const than = b64url(JSON.stringify({ iss: k.client_email, scope: PHAM_VI, aud: k.token_uri || 'https://oauth2.googleapis.com/token', iat: nayGiay, exp: nayGiay + 3600 }));
  const ky = crypto.createSign('RSA-SHA256').update(`${dau}.${than}`).sign(k.private_key);
  return `${dau}.${than}.${b64url(ky)}`;
}

export async function layToken(k: KhoaDichVu, f: Fetch = fetch): Promise<string> {
  const r = await f(k.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: taoJwt(k) }).toString(),
    signal: AbortSignal.timeout(30_000),
  });
  const j = (await r.json().catch(() => ({}))) as { access_token?: string; error?: string; error_description?: string };
  if (!r.ok || !j.access_token) throw new Error(`Không lấy được token Google (${r.status}): ${j.error ?? ''} ${j.error_description ?? ''}`.trim());
  return j.access_token;
}

export type DongGsc = { keys: string[]; clicks: number; impressions: number; position: number };

/** Một truy vấn searchAnalytics, tự phân trang 25.000 dòng/lần. */
export async function truyVan(token: string, site: string, body: { startDate: string; endDate: string; dimensions: string[] }, f: Fetch = fetch, toiDaDong = 500_000): Promise<DongGsc[]> {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const kq: DongGsc[] = [];
  for (let startRow = 0; startRow < toiDaDong; startRow += 25_000) {
    const r = await f(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, type: 'web', rowLimit: 25_000, startRow, dataState: 'final' }),
      signal: AbortSignal.timeout(60_000),
    });
    const j = (await r.json().catch(() => ({}))) as { rows?: DongGsc[]; error?: { message?: string } };
    if (!r.ok) throw new Error(`Search Console trả ${r.status}: ${j.error?.message ?? ''}`);
    const ds = j.rows ?? [];
    kq.push(...ds);
    if (ds.length < 25_000) break;
  }
  return kq;
}

/** URL tuyệt đối → đường dẫn như SeoTrang.duongDan ("/a/b", không dấu / cuối). */
export function duongTuUrl(u: string): string {
  try { let p = decodeURIComponent(new URL(u).pathname); if (p.length > 1) p = p.replace(/\/+$/, ''); return p || '/'; } catch { return u; }
}

const ngayChuoi = (d: Date) => d.toISOString().slice(0, 10);
const cacNgay = (tu: string, den: string) => {
  const ds: string[] = [];
  for (let d = new Date(`${tu}T00:00:00Z`); ngayChuoi(d) <= den; d = new Date(d.getTime() + 86_400_000)) ds.push(ngayChuoi(d));
  return ds;
};

export type BaoCaoGsc = { ngay: number; dongTruyVan: number; dongTrang: number; tuNgay: string; denNgay: string };

/**
 * Kéo dữ liệu [tuNgay, denNgay] (YYYY-MM-DD), từng ngày một, thay dữ liệu cũ của ngày đó.
 * `goi` cho phép test truyền hàm giả thay cho truyVan thật.
 */
export async function dongBoGsc(db: PrismaClient, o: { site: string; tuNgay: string; denNgay: string; goi: (body: { startDate: string; endDate: string; dimensions: string[] }) => Promise<DongGsc[]>; log?: (s: string) => void }): Promise<BaoCaoGsc> {
  const trang = new Map((await db.seoTrang.findMany({ select: { id: true, duongDan: true } })).map((t) => [t.duongDan, t.id]));
  let dongTruyVan = 0, dongTrang = 0;
  const ds = cacNgay(o.tuNgay, o.denNgay);
  for (const ngay of ds) {
    const [q, p] = await Promise.all([
      o.goi({ startDate: ngay, endDate: ngay, dimensions: ['date', 'page', 'query', 'device'] }),
      o.goi({ startDate: ngay, endDate: ngay, dimensions: ['date', 'page', 'device'] }),
    ]);
    const d = new Date(`${ngay}T00:00:00Z`);
    const dongQ = q.map((r) => ({ ngay: d, url: r.keys[1], trangId: trang.get(duongTuUrl(r.keys[1])) ?? null, truyVan: r.keys[2].slice(0, 500), thietBi: r.keys[3], hienThi: Math.round(r.impressions), nhap: Math.round(r.clicks), viTriTB: r.position }));
    const dongP = p.map((r) => ({ ngay: d, url: r.keys[1], trangId: trang.get(duongTuUrl(r.keys[1])) ?? null, thietBi: r.keys[2], hienThi: Math.round(r.impressions), nhap: Math.round(r.clicks), viTriTB: r.position }));
    await db.$transaction(async (tx) => {
      await tx.seoGscNgay.deleteMany({ where: { ngay: d } });
      await tx.seoGscTrangNgay.deleteMany({ where: { ngay: d } });
      for (let i = 0; i < dongQ.length; i += 5000) await tx.seoGscNgay.createMany({ data: dongQ.slice(i, i + 5000), skipDuplicates: true });
      for (let i = 0; i < dongP.length; i += 5000) await tx.seoGscTrangNgay.createMany({ data: dongP.slice(i, i + 5000), skipDuplicates: true });
    }, { timeout: 300_000 });
    dongTruyVan += dongQ.length; dongTrang += dongP.length;
    o.log?.(`${ngay}: ${dongQ.length} dòng truy vấn, ${dongP.length} dòng trang`);
  }
  return { ngay: ds.length, dongTruyVan, dongTrang, tuNgay: o.tuNgay, denNgay: o.denNgay };
}

export type NguongGsc = { hienThiToiThieu7: number; tutViTri: number; giamNhap: number; nhapToiThieu28: number; tyLeUrl2: number };
export const NGUONG_GSC: NguongGsc = { hienThiToiThieu7: 50, tutViTri: 3, giamNhap: 0.4, nhapToiThieu28: 20, tyLeUrl2: 0.2 };

export type CanhBaoGsc = { loai: 'TUT_HANG' | 'TRUNG_Y_DINH'; trangId: string | null; khoa: string; mucDo: number; chiTiet: Record<string, unknown> };

/**
 * Tính cảnh báo trên dữ liệu đã lưu, mốc là ngày mới nhất có dữ liệu.
 * A = 7 ngày đến mốc; B = 28 ngày ngay trước A. Vị trí trung bình có trọng số theo lượt hiển thị.
 */
export async function tinhCanhBaoGsc(db: PrismaClient, n: NguongGsc = NGUONG_GSC): Promise<{ moc: string | null; canhBao: CanhBaoGsc[] }> {
  const m = await db.seoGscTrangNgay.aggregate({ _max: { ngay: true } });
  const moc = m._max.ngay;
  if (!moc) return { moc: null, canhBao: [] };
  // So theo chuỗi ::date: tham số Date là timestamp, Postgres đổi cột DATE theo múi giờ phiên nên lệch một ngày.
  const truMoc = (n: number) => ngayChuoi(new Date(moc.getTime() - n * 86_400_000));
  const a0 = truMoc(6), b0 = truMoc(34), b1 = truMoc(7), m0 = truMoc(0);
  const canhBao: CanhBaoGsc[] = [];

  // Tụt hạng theo cặp trang–truy vấn.
  const cap = await db.$queryRaw<{ url: string; truyVan: string; trangId: string | null; hA: number; vA: number | null; hB: number; vB: number | null }[]>(Prisma.sql`
    SELECT "url", "truyVan", MAX("trangId") AS "trangId",
      SUM(CASE WHEN "ngay" >= ${a0}::date THEN "hienThi" ELSE 0 END)::int AS "hA",
      SUM(CASE WHEN "ngay" >= ${a0}::date THEN "viTriTB" * "hienThi" ELSE 0 END) / NULLIF(SUM(CASE WHEN "ngay" >= ${a0}::date THEN "hienThi" ELSE 0 END), 0) AS "vA",
      SUM(CASE WHEN "ngay" <= ${b1}::date THEN "hienThi" ELSE 0 END)::int AS "hB",
      SUM(CASE WHEN "ngay" <= ${b1}::date THEN "viTriTB" * "hienThi" ELSE 0 END) / NULLIF(SUM(CASE WHEN "ngay" <= ${b1}::date THEN "hienThi" ELSE 0 END), 0) AS "vB"
    FROM "SeoGscNgay" WHERE "ngay" BETWEEN ${b0}::date AND ${m0}::date
    GROUP BY "url", "truyVan"`);
  for (const r of cap) {
    if (r.vA == null || r.vB == null || r.hA < n.hienThiToiThieu7) continue;
    const tut = Number(r.vA) - Number(r.vB);
    if (tut >= n.tutViTri) canhBao.push({ loai: 'TUT_HANG', trangId: r.trangId, khoa: `q|${r.url}|${r.truyVan}`, mucDo: tut >= 10 ? 1 : 2,
      chiTiet: { nguon: 'gsc', kieu: 'vi_tri', url: r.url, truyVan: r.truyVan, viTri7: Math.round(Number(r.vA) * 10) / 10, viTri28: Math.round(Number(r.vB) * 10) / 10, hienThi7: r.hA } });
  }
  // Tụt nhấp theo trang (so trung bình ngày).
  const tr = await db.$queryRaw<{ url: string; trangId: string | null; nA: number; nB: number }[]>(Prisma.sql`
    SELECT "url", MAX("trangId") AS "trangId",
      SUM(CASE WHEN "ngay" >= ${a0}::date THEN "nhap" ELSE 0 END)::int AS "nA",
      SUM(CASE WHEN "ngay" <= ${b1}::date THEN "nhap" ELSE 0 END)::int AS "nB"
    FROM "SeoGscTrangNgay" WHERE "ngay" BETWEEN ${b0}::date AND ${m0}::date GROUP BY "url"`);
  for (const r of tr) {
    if (r.nB < n.nhapToiThieu28) continue;
    const tbA = r.nA / 7, tbB = r.nB / 28;
    if (tbB > 0 && (tbB - tbA) / tbB >= n.giamNhap) canhBao.push({ loai: 'TUT_HANG', trangId: r.trangId, khoa: `p|${r.url}`, mucDo: 1,
      chiTiet: { nguon: 'gsc', kieu: 'nhap', url: r.url, nhapNgay7: Math.round(tbA * 10) / 10, nhapNgay28: Math.round(tbB * 10) / 10 } });
  }
  // Trùng ý định: một truy vấn hiện ở ≥ 2 URL trong 28 ngày gần nhất, URL thứ hai ≥ 20 % lượt hiển thị.
  const t0 = truMoc(27);
  const tv = await db.$queryRaw<{ truyVan: string; url: string; trangId: string | null; h: number }[]>(Prisma.sql`
    SELECT "truyVan", "url", MAX("trangId") AS "trangId", SUM("hienThi")::int AS "h"
    FROM "SeoGscNgay" WHERE "ngay" BETWEEN ${t0}::date AND ${m0}::date GROUP BY "truyVan", "url"`);
  const theoTv = new Map<string, typeof tv>();
  for (const r of tv) { if (!theoTv.has(r.truyVan)) theoTv.set(r.truyVan, []); theoTv.get(r.truyVan)!.push(r); }
  for (const [q, ds] of theoTv) {
    if (ds.length < 2) continue;
    ds.sort((a, b) => b.h - a.h);
    const tong = ds.reduce((s, x) => s + x.h, 0);
    if (tong > 0 && ds[1].h / tong >= n.tyLeUrl2) canhBao.push({ loai: 'TRUNG_Y_DINH', trangId: ds[1].trangId, khoa: `t|${q}`, mucDo: 2,
      chiTiet: { nguon: 'gsc', truyVan: q, url: ds.slice(0, 5).map((x) => ({ url: x.url, hienThi: x.h })), tyLeUrl2: Math.round((ds[1].h / tong) * 100) / 100 } });
  }
  return { moc: ngayChuoi(moc), canhBao };
}

/** Ghi cảnh báo GSC: giữ cái còn đúng, đóng cái không còn, thêm cái mới (cùng cách với bộ quét). */
export async function ghiCanhBaoGsc(db: PrismaClient, ds: CanhBaoGsc[]) {
  const cu = await db.seoCanhBao.findMany({ where: { trangThai: 'MO', loai: { in: ['TUT_HANG', 'TRUNG_Y_DINH'] } }, select: { id: true, chiTiet: true } });
  const khoaCu = (c: unknown) => ((c ?? {}) as { nguon?: string; khoa?: string }).nguon === 'gsc' ? ((c as { khoa?: string }).khoa ?? null) : null;
  const moi = new Set(ds.map((d) => d.khoa));
  const daCo = new Set<string>();
  const dong: string[] = [];
  for (const c of cu) { const k = khoaCu(c.chiTiet); if (!k) continue; if (moi.has(k)) daCo.add(k); else dong.push(c.id); }
  if (dong.length) await db.seoCanhBao.updateMany({ where: { id: { in: dong } }, data: { trangThai: 'DA_XU_LY', xuLyLuc: new Date() } });
  const them = ds.filter((d) => !daCo.has(d.khoa));
  if (them.length) await db.seoCanhBao.createMany({ data: them.map((d) => ({ loai: d.loai, trangId: d.trangId, mucDo: d.mucDo, chiTiet: { ...d.chiTiet, khoa: d.khoa } as object })) });
  return { moi: them.length, dong: dong.length };
}

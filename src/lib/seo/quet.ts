// Quét trang hằng đêm (docs/v2/17 mục 1.3): đồ thị liên kết nội bộ, độ sâu, mồ côi, lệch canonical/robots.
// - Bắt đầu từ "/" + mọi <loc> trong sitemap + trang XUAT_BAN trong CSDL; đi theo <a href> cùng site.
// - Tốc độ mặc định 2 yêu cầu/giây; không theo chuyển hướng (ghi lại mã 3xx để báo liên kết trỏ vào trang chuyển).
// - Chỉ ghi SeoLienKet khi CẢ HAI đầu là SeoTrang (khóa ngoại); trang ngoài CSDL vẫn tính vào báo cáo.
// - Cảnh báo SeoCanhBao: tự đóng (DA_XU_LY) khi lần quét sau không còn thấy lỗi; không tạo trùng.
import type { PrismaClient } from '@prisma/client';

export type KetQuaTai = { ma: number; html: string; viTri?: string | null };
export type TaiTrang = (duong: string) => Promise<KetQuaTai>;

export type ThongTinTrang = {
  lienKet: { den: string; anchor: string }[];
  canonical: string | null;
  robots: string | null;
  title: string | null;
};

const BO_QUA_DUONG = /^\/(api|_next|quan-tri|admin)(\/|$)/;
const DUOI_TEP = /\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|css|js|json|xml|txt|mp3|mp4|woff2?)$/i;

const giaiMa = (s: string) =>
  s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, k: string) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' })[k] ?? '');

/** Chuẩn hóa một href về đường dẫn nội bộ ("/a/b"), hoặc null nếu là liên kết ngoài, tệp, hay khu quản trị. */
export function chuanHoaDuong(href: string, tuDuong: string, goc: string): string | null {
  const h = giaiMa(href.trim());
  if (!h || /^(mailto:|tel:|javascript:|data:|#)/i.test(h)) return null;
  let u: URL;
  try { u = new URL(h, goc.replace(/\/+$/, '') + tuDuong); } catch { return null; }
  const g = new URL(goc);
  const cungSite = u.host === g.host || u.host.replace(/^www\./, '') === g.host.replace(/^www\./, '');
  if (!cungSite || !/^https?:$/.test(u.protocol)) return null;
  let p = decodeURIComponentAnToan(u.pathname);
  if (p.length > 1) p = p.replace(/\/+$/, '');
  if (BO_QUA_DUONG.test(p) || DUOI_TEP.test(p)) return null;
  return p || '/';
}
function decodeURIComponentAnToan(s: string) { try { return decodeURIComponent(s); } catch { return s; } }

const thuocTinh = (the: string, ten: string) => {
  const m = the.match(new RegExp(`\\s${ten}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? (m[2] ?? m[3] ?? m[4] ?? '') : null;
};
const boThe = (s: string) => giaiMa(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

/** Rút liên kết nội bộ, canonical, meta robots, title từ HTML (không cần thư viện; HTML do chính site mình render). */
export function rutTrich(html: string, tuDuong: string, goc: string): ThongTinTrang {
  const sach = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, '');
  const lienKet: ThongTinTrang['lienKet'] = [];
  for (const m of sach.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = thuocTinh(m[1], 'href');
    if (href == null) continue;
    const rel = (thuocTinh(m[1], 'rel') ?? '').toLowerCase();
    if (rel.includes('nofollow')) continue;
    const den = chuanHoaDuong(href, tuDuong, goc);
    if (!den) continue;
    let anchor = boThe(m[2]);
    if (!anchor) anchor = (thuocTinh(m[1], 'aria-label') ?? thuocTinh(m[1], 'title') ?? '').trim();
    if (!anchor) { const alt = m[2].match(/<img\b[^>]*\salt\s*=\s*"([^"]*)"/i); anchor = alt ? giaiMa(alt[1]).trim() : ''; }
    lienKet.push({ den, anchor: anchor.slice(0, 200) });
  }
  let canonical: string | null = null;
  let robots: string | null = null;
  for (const m of sach.matchAll(/<link\b([^>]*)>/gi)) {
    if ((thuocTinh(m[1], 'rel') ?? '').toLowerCase().split(/\s+/).includes('canonical')) { canonical = thuocTinh(m[1], 'href'); break; }
  }
  for (const m of sach.matchAll(/<meta\b([^>]*)>/gi)) {
    const ten = (thuocTinh(m[1], 'name') ?? '').toLowerCase();
    if (ten === 'robots' || ten === 'googlebot') { robots = ((robots ? robots + ', ' : '') + (thuocTinh(m[1], 'content') ?? '')).toLowerCase(); }
  }
  const t = sach.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return { lienKet, canonical, robots, title: t ? boThe(t[1]) : null };
}

/** Rút đường dẫn từ sitemap (chỉ mục hoặc nhóm). Trả cả sitemap con để tải tiếp. */
export function rutSitemap(xml: string, goc: string): { trang: string[]; con: string[] } {
  const loc = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => giaiMa(m[1]));
  const laChiMuc = /<sitemapindex\b/i.test(xml);
  const duong = (u: string) => { try { const x = new URL(u, goc); let p = decodeURIComponentAnToan(x.pathname); if (p.length > 1) p = p.replace(/\/+$/, ''); return p || '/'; } catch { return null; } };
  const ds = loc.map(duong).filter((x): x is string => !!x);
  return laChiMuc ? { trang: [], con: ds } : { trang: ds, con: [] };
}

/** BFS từ gốc: độ sâu (số lần nhấp ngắn nhất). Trang không tới được thì không có trong kết quả. */
export function tinhDoSau(goc: string, canh: Map<string, Set<string>>): Map<string, number> {
  const sau = new Map<string, number>([[goc, 0]]);
  const hang = [goc];
  for (let i = 0; i < hang.length; i++) {
    const u = hang[i];
    for (const v of canh.get(u) ?? []) if (!sau.has(v)) { sau.set(v, sau.get(u)! + 1); hang.push(v); }
  }
  return sau;
}

const laNoindex = (robots: string | null) => !!robots && /\bnoindex\b/.test(robots);
const chuanCanonical = (c: string | null, goc: string) => {
  if (!c) return null;
  try { const u = new URL(c, goc); let p = decodeURIComponentAnToan(u.pathname); if (p.length > 1) p = p.replace(/\/+$/, ''); return { host: u.host, duong: p || '/' }; } catch { return null; }
};

export type BaoCaoQuet = {
  batDau: string; xong: string; giay: number;
  daTai: number; loiTai: number; theoMa: Record<string, number>;
  lienKetNoiBo: number; lienKetGhiCsdl: number;
  trangCsdlDaQuet: number; trangNgoaiCsdl: number;
  moCoi: number; quaSau: number; lienKetHong: number; lienKetChuyenHuong: number; noindexTrongSitemap: number; canonicalLech: number;
  canhBaoMoi: number; canhBaoDong: number; catNgang: boolean;
};

type TuyChon = { goc: string; tai: TaiTrang; batDau?: string; chiDuong?: (duong: string) => boolean; taiSitemap?: (duong: string) => Promise<string | null>; toiDa?: number; nghiMs?: number; ghi?: boolean; log?: (s: string) => void };

const LOAI_QUET = ['MO_COI', 'QUA_SAU', 'LOI_HTTP', 'NOINDEX_TRONG_SITEMAP', 'CANONICAL_LECH'] as const;

/**
 * Quét toàn site rồi ghi kết quả (nếu `ghi` khác false).
 * - `tai(duong)` lấy HTML (đã render) và mã HTTP, không theo chuyển hướng.
 * - `toiDa`: trần số trang (mặc định 10.000). Chạm trần thì báo `catNgang` và KHÔNG tạo cảnh báo mồ côi (đồ thị chưa đủ).
 */
export async function quetSite(db: PrismaClient, o: TuyChon): Promise<BaoCaoQuet> {
  const t0 = new Date();
  const log = o.log ?? (() => {});
  const toiDa = o.toiDa ?? 10_000;
  const nghi = o.nghiMs ?? 500;
  const goc = o.goc.replace(/\/+$/, '');
  const batDau = o.batDau ?? '/';
  const nhan = o.chiDuong ?? (() => true); // giới hạn phạm vi (quét một nhánh, hoặc test)

  // 1) Hạt giống: "/", sitemap, trang XUAT_BAN.
  const trongSitemap = new Set<string>();
  if (o.taiSitemap) {
    const hang = ['/sitemap.xml'];
    const daXem = new Set<string>();
    while (hang.length && daXem.size < 200) {
      const s = hang.shift()!;
      if (daXem.has(s)) continue;
      daXem.add(s);
      const xml = await o.taiSitemap(s).catch(() => null);
      if (!xml) continue;
      const r = rutSitemap(xml, goc);
      r.trang.filter(nhan).forEach((p) => trongSitemap.add(p));
      hang.push(...r.con);
    }
  }
  const csdl = (await db.seoTrang.findMany({ select: { id: true, duongDan: true, trangThai: true, noindex: true, canonical: true } })).filter((t) => nhan(t.duongDan));
  const theoDuong = new Map(csdl.map((t) => [t.duongDan, t]));
  const hat = [batDau, ...trongSitemap, ...csdl.filter((t) => t.trangThai === 'XUAT_BAN' && !t.duongDan.includes('{')).map((t) => t.duongDan)];

  // 2) Đi theo liên kết.
  const thongTin = new Map<string, { ma: number; viTri?: string | null; tt?: ThongTinTrang }>();
  const canh = new Map<string, Set<string>>();
  const anchorCua = new Map<string, Map<string, string>>(); // tu → den → anchor đầu tiên
  const hang: string[] = [];
  const daXep = new Set<string>();
  const xep = (p: string) => { if (nhan(p) && !daXep.has(p)) { daXep.add(p); hang.push(p); } };
  hat.forEach(xep);
  let catNgang = false;
  for (let i = 0; i < hang.length; i++) {
    if (thongTin.size >= toiDa) { catNgang = true; break; }
    const p = hang[i];
    let kq: KetQuaTai;
    try { kq = await o.tai(p); } catch { kq = { ma: 0, html: '' }; }
    const muc: { ma: number; viTri?: string | null; tt?: ThongTinTrang } = { ma: kq.ma, viTri: kq.viTri };
    if (kq.ma === 200 && kq.html) {
      muc.tt = rutTrich(kq.html, p, goc);
      const den = new Set<string>();
      const an = new Map<string, string>();
      for (const l of muc.tt.lienKet) {
        if (l.den === p) continue;
        den.add(l.den);
        if (!an.has(l.den) || (!an.get(l.den) && l.anchor)) an.set(l.den, l.anchor);
        xep(l.den);
      }
      canh.set(p, den);
      anchorCua.set(p, an);
    }
    thongTin.set(p, muc);
    if (thongTin.size % 100 === 0) log(`đã tải ${thongTin.size} trang, còn ${hang.length - i - 1} trong hàng`);
    if (nghi > 0) await new Promise((r) => setTimeout(r, nghi));
  }

  // 3) Chỉ số.
  const doSau = tinhDoSau(batDau, canh);
  const vao = new Map<string, number>();
  for (const [, ds] of canh) for (const v of ds) vao.set(v, (vao.get(v) ?? 0) + 1);
  const theoMa: Record<string, number> = {};
  for (const [, m] of thongTin) theoMa[String(m.ma)] = (theoMa[String(m.ma)] ?? 0) + 1;

  type CB = { loai: (typeof LOAI_QUET)[number]; trangId: string | null; mucDo: number; khoa: string; chiTiet: Record<string, unknown> };
  const canhBao: CB[] = [];
  let lienKetHong = 0, lienKetChuyenHuong = 0;
  for (const [tu, ds] of canh) {
    for (const den of ds) {
      const m = thongTin.get(den);
      if (!m) continue;
      const loi = m.ma === 0 || m.ma >= 400 ? 'hong' : m.ma >= 300 ? 'chuyen' : null;
      if (!loi) continue;
      if (loi === 'hong') lienKetHong++; else lienKetChuyenHuong++;
      canhBao.push({ loai: 'LOI_HTTP', trangId: theoDuong.get(tu)?.id ?? null, mucDo: loi === 'hong' ? 1 : 3, khoa: `${tu}→${den}`,
        chiTiet: { nguon: 'quet', tu, den, ma: m.ma, viTri: m.viTri ?? null, anchor: anchorCua.get(tu)?.get(den) ?? '' } });
    }
  }
  let moCoi = 0, quaSau = 0, noindexTrongSitemap = 0, canonicalLech = 0;
  const hostGoc = new URL(goc).host;
  for (const [p, m] of thongTin) {
    const t = theoDuong.get(p);
    const id = t?.id ?? null;
    const coLienKetVao = (vao.get(p) ?? 0) > 0 || p === batDau;
    const canCoLienKet = trongSitemap.has(p) || t?.trangThai === 'XUAT_BAN';
    if (m.ma === 200 && canCoLienKet && !coLienKetVao && !catNgang) {
      moCoi++; canhBao.push({ loai: 'MO_COI', trangId: id, mucDo: 2, khoa: p, chiTiet: { nguon: 'quet', duong: p, trongSitemap: trongSitemap.has(p) } });
    }
    const d = doSau.get(p);
    if (m.ma === 200 && d != null && d > 3) {
      quaSau++; canhBao.push({ loai: 'QUA_SAU', trangId: id, mucDo: 3, khoa: p, chiTiet: { nguon: 'quet', duong: p, doSau: d } });
    }
    if (m.ma === 200 && m.tt && trongSitemap.has(p) && laNoindex(m.tt.robots)) {
      noindexTrongSitemap++; canhBao.push({ loai: 'NOINDEX_TRONG_SITEMAP', trangId: id, mucDo: 1, khoa: p, chiTiet: { nguon: 'quet', duong: p, robots: m.tt.robots } });
    }
    if (m.ma === 200 && m.tt && t) {
      const thuc = chuanCanonical(m.tt.canonical, goc);
      const mong = chuanCanonical(t.canonical || p, goc);
      // Bỏ qua khác tên miền (máy trạm render canonical https://xemboi.vn/... khi quét localhost): chỉ so đường dẫn.
      const lech = !thuc ? 'thieu' : mong && thuc.duong !== mong.duong ? 'khac' : null;
      if (lech) {
        canonicalLech++; canhBao.push({ loai: 'CANONICAL_LECH', trangId: id, mucDo: 2, khoa: p,
          chiTiet: { nguon: 'quet', duong: p, kieu: lech, thucTe: m.tt.canonical, mongDoi: t.canonical || p, hostThucTe: thuc?.host ?? null, hostQuet: hostGoc } });
      }
    }
  }

  // 4) Ghi CSDL.
  let lienKetGhiCsdl = 0, canhBaoMoi = 0, canhBaoDong = 0, trangCsdlDaQuet = 0;
  const luc = new Date();
  if (o.ghi !== false) {
    const daQuet = [...thongTin.keys()].map((p) => theoDuong.get(p)).filter((t): t is NonNullable<typeof t> => !!t);
    trangCsdlDaQuet = daQuet.length;
    const dong: { tuTrangId: string; denTrangId: string; anchor: string }[] = [];
    for (const [tu, ds] of canh) {
      const a = theoDuong.get(tu);
      if (!a) continue;
      for (const den of ds) { const b = theoDuong.get(den); if (b) dong.push({ tuTrangId: a.id, denTrangId: b.id, anchor: anchorCua.get(tu)?.get(den) ?? '' }); }
    }
    lienKetGhiCsdl = dong.length;
    const idDaQuet = daQuet.map((t) => t.id);
    await db.$transaction(async (tx) => {
      // Liên kết QUET của các trang vừa quét: thay toàn bộ bằng kết quả mới. Liên kết đề xuất/tay giữ nguyên.
      for (let i = 0; i < idDaQuet.length; i += 1000) await tx.seoLienKet.deleteMany({ where: { nguon: 'QUET', tuTrangId: { in: idDaQuet.slice(i, i + 1000) } } });
      for (let i = 0; i < dong.length; i += 1000) {
        await tx.seoLienKet.createMany({ data: dong.slice(i, i + 1000).map((d) => ({ ...d, nguon: 'QUET' as const, trangThai: 'DANG_CO' as const, quetLuc: luc })) });
      }
      // Đề xuất đã có thật trong HTML thì coi như xong.
      if (dong.length) {
        const cap = new Set(dong.map((d) => `${d.tuTrangId}|${d.denTrangId}`));
        const deXuat = await tx.seoLienKet.findMany({ where: { nguon: { not: 'QUET' }, trangThai: { in: ['DE_XUAT', 'DA_DUYET'] } }, select: { id: true, tuTrangId: true, denTrangId: true } });
        const xong = deXuat.filter((x) => cap.has(`${x.tuTrangId}|${x.denTrangId}`)).map((x) => x.id);
        if (xong.length) await tx.seoLienKet.updateMany({ where: { id: { in: xong } }, data: { trangThai: 'DANG_CO', quetLuc: luc } });
      }
    }, { timeout: 120_000 });
    for (const t of daQuet) {
      const m = thongTin.get(t.duongDan)!;
      await db.seoTrang.update({ where: { id: t.id }, data: {
        maHttpLanQuet: m.ma, quetLuc: luc, doSau: doSau.get(t.duongDan) ?? null,
        soLienKetVao: vao.get(t.duongDan) ?? 0, soLienKetRa: canh.get(t.duongDan)?.size ?? 0,
      } });
    }
    // Cảnh báo: giữ cái còn đúng, đóng cái không còn, thêm cái mới.
    const cu = await db.seoCanhBao.findMany({ where: { trangThai: 'MO', loai: { in: [...LOAI_QUET] } }, select: { id: true, loai: true, chiTiet: true } });
    const khoaCu = (c: { loai: string; chiTiet: unknown }) => {
      const x = (c.chiTiet ?? {}) as Record<string, unknown>;
      const duong = String(c.loai === 'LOI_HTTP' ? x.tu : x.duong);
      return x.nguon !== 'quet' || !nhan(duong) ? null : `${c.loai}|${c.loai === 'LOI_HTTP' ? `${x.tu}→${x.den}` : x.duong}`;
    };
    const conMo = new Set(canhBao.map((c) => `${c.loai}|${c.khoa}`));
    const daCo = new Set<string>();
    const dongLai: string[] = [];
    for (const c of cu) {
      const k = khoaCu(c);
      if (!k) continue;
      if (conMo.has(k)) daCo.add(k);
      else if (!catNgang) dongLai.push(c.id); // quét dở thì không đóng gì: trang chưa tới không có nghĩa là đã hết lỗi
    }
    if (dongLai.length) { await db.seoCanhBao.updateMany({ where: { id: { in: dongLai } }, data: { trangThai: 'DA_XU_LY', xuLyLuc: luc } }); canhBaoDong = dongLai.length; }
    const moi = canhBao.filter((c) => !daCo.has(`${c.loai}|${c.khoa}`));
    for (let i = 0; i < moi.length; i += 1000) {
      await db.seoCanhBao.createMany({ data: moi.slice(i, i + 1000).map((c) => ({ loai: c.loai, trangId: c.trangId, mucDo: c.mucDo, chiTiet: c.chiTiet as object })) });
    }
    canhBaoMoi = moi.length;
  } else {
    trangCsdlDaQuet = [...thongTin.keys()].filter((p) => theoDuong.has(p)).length;
  }

  const t1 = new Date();
  return {
    batDau: t0.toISOString(), xong: t1.toISOString(), giay: Math.round((t1.getTime() - t0.getTime()) / 1000),
    daTai: thongTin.size, loiTai: [...thongTin.values()].filter((m) => m.ma === 0 || m.ma >= 400).length, theoMa,
    lienKetNoiBo: [...canh.values()].reduce((s, d) => s + d.size, 0), lienKetGhiCsdl,
    trangCsdlDaQuet, trangNgoaiCsdl: [...thongTin.keys()].filter((p) => !theoDuong.has(p)).length,
    moCoi, quaSau, lienKetHong, lienKetChuyenHuong, noindexTrongSitemap, canonicalLech,
    canhBaoMoi, canhBaoDong, catNgang,
  };
}

/** Tải qua HTTP thật, không theo chuyển hướng, có hết giờ. Đánh dấu User-Agent để log nhận ra. */
export function taiQuaHttp(goc: string, hetGioMs = 20_000): { tai: TaiTrang; taiSitemap: (duong: string) => Promise<string | null> } {
  const g = goc.replace(/\/+$/, '');
  const ua = { 'User-Agent': 'xemboi-quet/1.0 (+noi-bo)', Accept: 'text/html,application/xml' };
  return {
    tai: async (duong) => {
      const r = await fetch(g + encodeURI(duong), { redirect: 'manual', headers: ua, signal: AbortSignal.timeout(hetGioMs) });
      const loai = r.headers.get('content-type') ?? '';
      const html = r.status === 200 && loai.includes('html') ? await r.text() : (await r.body?.cancel(), '');
      return { ma: r.status, html, viTri: r.headers.get('location') };
    },
    taiSitemap: async (duong) => {
      const r = await fetch(g + duong, { headers: ua, signal: AbortSignal.timeout(hetGioMs) });
      return r.ok ? r.text() : null;
    },
  };
}

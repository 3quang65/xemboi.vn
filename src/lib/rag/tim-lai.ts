// Tìm lai cho RAG (docs/v2/17 mục 3.4, 12 mục 5.2–5.3): mở rộng thuật ngữ Hán-Việt → Hán, nhánh từ khóa BM25
// trên chuỗi con (chạy được với chữ Hán trên CSDL ctype C, nơi pg_trgm và tsvector không tách được chữ Hán),
// nhánh vector (pgvector, khi có vector câu hỏi), và gộp RRF.
// Phạm vi luôn do người gọi đưa vào bằng sqlPhamVi(...) của pham-vi.ts: tệp này không tự quyết phạm vi.
import { Prisma, type PrismaClient } from '@prisma/client';

export type MucThuatNgu = { han: string; hanViet: string; bienThe: string[]; mang: string };

// Cách bỏ dấu kiểu cũ (hoà, thuỷ) → kiểu mới (hòa, thủy), để khớp bảng thuật ngữ.
const DAU_CU: [RegExp, string][] = [
  [/oà/g, 'òa'], [/oá/g, 'óa'], [/oả/g, 'ỏa'], [/oã/g, 'õa'], [/oạ/g, 'ọa'],
  [/oè/g, 'òe'], [/oé/g, 'óe'], [/oẻ/g, 'ỏe'], [/oẽ/g, 'õe'], [/oẹ/g, 'ọe'],
  [/uỳ/g, 'ùy'], [/uý/g, 'úy'], [/uỷ/g, 'ủy'], [/uỹ/g, 'ũy'], [/uỵ/g, 'ụy'],
];

/** Chữ thường NFC, bỏ dấu câu, gộp khoảng trắng, đổi cách bỏ dấu kiểu cũ. Giữ chữ Hán. */
export function chuanCau(s: string): string {
  let t = s.normalize('NFC').toLowerCase();
  for (const [a, b] of DAU_CU) t = t.replace(a, b);
  return t.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}

// Quẻ một âm tiết (Khiêm, Cách, Quan…) dễ trùng chữ thường ("tính cách"): chỉ mở rộng khi câu có ngữ cảnh Kinh Dịch.
const NGU_CANH_DICH = /(?<![\p{L}])(quẻ|hào|dịch|kinh dịch|bói)(?![\p{L}])/u;
const SO_HAO: Record<string, [string, string]> = {
  '1': ['初九', '初六'], 'một': ['初九', '初六'], 'sơ': ['初九', '初六'], 'đầu': ['初九', '初六'],
  '2': ['九二', '六二'], 'hai': ['九二', '六二'], 'nhị': ['九二', '六二'],
  '3': ['九三', '六三'], 'ba': ['九三', '六三'], 'tam': ['九三', '六三'],
  '4': ['九四', '六四'], 'bốn': ['九四', '六四'], 'tứ': ['九四', '六四'],
  '5': ['九五', '六五'], 'năm': ['九五', '六五'], 'ngũ': ['九五', '六五'],
  '6': ['上九', '上六'], 'sáu': ['上九', '上六'], 'thượng': ['上九', '上六'], 'cuối': ['上九', '上六'],
};

export type KetQuaMoRong = { han: string[]; khop: { cum: string; han: string }[]; conLai: string };

/**
 * Tìm cụm Hán-Việt trong câu (khớp dài nhất trước, theo ranh giới từ), trả các thuật ngữ chữ Hán.
 * `conLai` là câu sau khi xóa các cụm đã khớp, dùng để lấy từ khóa tiếng Việt.
 */
export function moRongThuatNgu(cau: string, bang: MucThuatNgu[]): KetQuaMoRong {
  let thap = ` ${chuanCau(cau)} `;
  const coDich = NGU_CANH_DICH.test(thap);
  const cum: { cum: string; han: string; motAm: boolean; mang: string }[] = [];
  for (const m of bang) for (const c of [m.hanViet, ...m.bienThe]) {
    const k = chuanCau(c);
    if (k) cum.push({ cum: k, han: m.han, motAm: !k.includes(' '), mang: m.mang });
  }
  cum.sort((a, b) => b.cum.length - a.cum.length);
  const han: string[] = [];
  const khop: KetQuaMoRong['khop'] = [];
  const them = (h: string, c: string) => { if (!han.includes(h)) han.push(h); khop.push({ cum: c, han: h }); };

  // "hào 3", "hào thứ ba", "hào sơ", "hào thượng"
  thap = thap.replace(/ hào (?:thứ )?(\d|một|hai|ba|bốn|năm|sáu|sơ|đầu|nhị|tam|tứ|ngũ|thượng|cuối)(?= )/gu, (_, so: string) => {
    for (const h of SO_HAO[so] ?? []) them(h, `hào ${so}`);
    return ' hào ';
  });
  // Cụm dài trước; cùng một cụm có thể ứng nhiều chữ Hán (thân → 申, 身) nên gom theo cụm.
  const daXet = new Set<string>();
  for (const c of cum) {
    if (daXet.has(c.cum)) continue;
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${c.cum.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'gu');
    if (!re.test(thap)) continue;
    const cungCum = cum.filter((x) => x.cum === c.cum && !(x.motAm && x.mang === 'kinh-dich' && !coDich));
    daXet.add(c.cum);
    if (!cungCum.length) continue;
    for (const x of cungCum) them(x.han, x.cum);
    thap = thap.replace(re, ' ');
  }
  return { han, khop, conLai: thap.replace(/\s+/g, ' ').trim() };
}

// Từ hỏi và hư từ: không dùng làm từ khóa.
const TU_BO = new Set(('là gì nghĩa thế nào ra sao có không được những các cái của và với thì mà như nói gì về trong khi nào bao nhiêu ' +
  'người tôi bạn mình gặp ở tại đâu sao vì nếu sẽ đã đang này kia đó hay hoặc nên phải theo cho một hai rất lắm thì việc điều ý').split(' '));

/** Từ khóa tiếng Việt: cặp âm tiết liền nhau, bỏ cặp toàn hư từ. Dùng cho các đoạn tiếng Việt (bản dịch, phong tục). */
export function tuKhoaViet(conLai: string): string[] {
  const am = conLai.split(' ').filter((x) => x && !/\p{Script=Han}/u.test(x));
  const ra = new Set<string>();
  for (let i = 0; i + 1 < am.length; i++) {
    if (TU_BO.has(am[i]) && TU_BO.has(am[i + 1])) continue;
    if (TU_BO.has(am[i]) || TU_BO.has(am[i + 1])) continue;
    ra.add(`${am[i]} ${am[i + 1]}`);
  }
  return [...ra];
}

export type DongKetQua = { id: bigint; diem: number };

/**
 * Nhánh từ khóa: BM25 với tf = số lần xuất hiện chuỗi con (không cần tách từ), k1 = 1.2, b = 0.75.
 * `phamVi` là điều kiện SQL trên bí danh d (sqlPhamVi(nd, 'd') hoặc Prisma.sql`d."phamVi" = ...`).
 */
export async function timTuKhoa(db: PrismaClient, o: { tuKhoa: string[]; phamVi: Prisma.Sql; k?: number }): Promise<DongKetQua[]> {
  const tk = [...new Set(o.tuKhoa.map((x) => x.toLowerCase()).filter(Boolean))].slice(0, 40);
  if (!tk.length) return [];
  const r = await db.$queryRaw<{ id: bigint; diem: number }[]>(Prisma.sql`
    WITH t(tu) AS (SELECT DISTINCT unnest(${tk}::text[])),
    d AS MATERIALIZED (SELECT d.id, lower(coalesce(d."vanBanChuan", d."vanBan")) AS vb FROM rag_doan d WHERE ${o.phamVi}),
    tong AS (SELECT count(*)::float8 AS n, greatest(avg(length(vb)), 1)::float8 AS tb FROM d),
    m AS (SELECT d.id, t.tu, length(d.vb)::float8 AS dai,
            ((length(d.vb) - length(replace(d.vb, t.tu, ''))) / length(t.tu))::float8 AS tf
          FROM d JOIN t ON strpos(d.vb, t.tu) > 0),
    df AS (SELECT tu, count(*)::float8 AS df FROM m GROUP BY tu)
    SELECT m.id, sum(ln(1 + (tong.n - df.df + 0.5) / (df.df + 0.5)) * m.tf * 2.2 / (m.tf + 1.2 * (0.25 + 0.75 * m.dai / tong.tb)))::float8 AS diem
    FROM m JOIN df USING (tu) CROSS JOIN tong
    GROUP BY m.id ORDER BY diem DESC, m.id LIMIT ${o.k ?? 100}`);
  return r.map((x) => ({ id: x.id, diem: Number(x.diem) }));
}

/** Nhánh vector: cosine trên pgvector (chỉ mục HNSW). Vector câu hỏi phải cùng mô hình với cột embedding (bge-m3). */
export async function timVector(db: PrismaClient, o: { vector: number[]; phamVi: Prisma.Sql; k?: number }): Promise<DongKetQua[]> {
  if (o.vector.length !== 1024 || o.vector.some((x) => !Number.isFinite(x))) throw new Error('Vector câu hỏi phải có 1024 số');
  const v = `[${o.vector.join(',')}]`;
  return db.$transaction(async (tx) => {
    await tx.$executeRaw`SET LOCAL hnsw.ef_search = 100`;
    const r = await tx.$queryRaw<{ id: bigint; diem: number }[]>(Prisma.sql`
      SELECT d.id, (1 - (d.embedding <=> ${v}::vector))::float8 AS diem FROM rag_doan d
      WHERE d.embedding IS NOT NULL AND ${o.phamVi} ORDER BY d.embedding <=> ${v}::vector LIMIT ${o.k ?? 100}`);
    return r.map((x) => ({ id: x.id, diem: Number(x.diem) }));
  });
}

export type DongGop = { id: bigint; diem: number; hang: Record<string, number> };

/** Reciprocal Rank Fusion: diem = Σ trongSo / (k + hạng). Mặc định k = 60 (Cormack và cộng sự, 2009). */
export function gopRrf(nhanh: { ten: string; ketQua: { id: bigint }[]; trongSo?: number }[], k = 60): DongGop[] {
  const gop = new Map<bigint, DongGop>();
  for (const n of nhanh) n.ketQua.forEach((r, i) => {
    const x = gop.get(r.id) ?? { id: r.id, diem: 0, hang: {} };
    x.diem += (n.trongSo ?? 1) / (k + i + 1);
    x.hang[n.ten] = i + 1;
    gop.set(r.id, x);
  });
  return [...gop.values()].sort((a, b) => b.diem - a.diem || (a.id < b.id ? -1 : 1));
}

/** Đọc bảng thuật ngữ từ CSDL (bảng thuat_ngu). */
export async function napBangThuatNgu(db: PrismaClient): Promise<MucThuatNgu[]> {
  return db.thuatNgu.findMany({ select: { han: true, hanViet: true, bienThe: true, mang: true } });
}

/** Tìm lai đầy đủ: mở rộng → từ khóa (+ vector nếu có) → RRF. */
export async function timLai(db: PrismaClient, o: { cau: string; bang: MucThuatNgu[]; phamVi: Prisma.Sql; vector?: number[]; k?: number }) {
  const mr = moRongThuatNgu(o.cau, o.bang);
  const tuKhoa = [...mr.han, ...tuKhoaViet(mr.conLai)];
  const tk = await timTuKhoa(db, { tuKhoa, phamVi: o.phamVi, k: 100 });
  const vt = o.vector ? await timVector(db, { vector: o.vector, phamVi: o.phamVi, k: 100 }) : [];
  const gop = gopRrf([{ ten: 'tu_khoa', ketQua: tk }, ...(vt.length ? [{ ten: 'vector', ketQua: vt }] : [])]);
  return { moRong: mr, tuKhoa, ketQua: gop.slice(0, o.k ?? 10) };
}

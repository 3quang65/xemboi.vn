// Gợi ý liên kết theo độ gần ngữ nghĩa (docs/v2/17 mục 1.3 bước 4). Vector trang do tools/rag-may-tram/nhung_trang_seo.py ghi.
// Mỗi trang lấy tối đa `soGoiY` trang gần nhất chưa có cặp nào trong SeoLienKet (mọi trạng thái, nên cặp đã bỏ qua không quay lại),
// ưu tiên cùng mảng (cộng `thuongCungMang` vào cosine), loại trang đích noindex, trang mẫu {…}, trang ẩn/đã chuyển.
import { Prisma, type PrismaClient } from '@prisma/client';

export type GoiYNguNghia = { tuTrangId: string; denTrangId: string; doGan: number; anchor: string };
export type BaoCaoNguNghia = { trangCoVector: number; goiYMoi: number; capDaCo: number; mau: { tu: string; den: string; doGan: number }[] };

export async function goiYNguNghia(
  db: PrismaClient,
  o: { soGoiY?: number; nguong?: number; thuongCungMang?: number; ghi?: boolean } = {},
): Promise<BaoCaoNguNghia> {
  const soGoiY = o.soGoiY ?? 10, nguong = o.nguong ?? 0.65, thuong = o.thuongCungMang ?? 0.05;
  const gan = await db.$queryRaw<{ tu: string; den: string; doGan: number }[]>(Prisma.sql`
    WITH t AS (SELECT id, embedding FROM "SeoTrang"
               WHERE embedding IS NOT NULL AND "duongDan" NOT LIKE '%{%' AND "trangThai" NOT IN ('AN', 'DA_CHUYEN'))
    SELECT a.id AS tu, b.id AS den, (1 - (a.embedding <=> b.embedding))::float8 AS "doGan"
    FROM t a CROSS JOIN LATERAL (
      SELECT s.id, s.embedding FROM "SeoTrang" s
      WHERE s.id <> a.id AND s.embedding IS NOT NULL AND NOT s.noindex AND s."duongDan" NOT LIKE '%{%' AND s."trangThai" NOT IN ('AN', 'DA_CHUYEN')
      ORDER BY a.embedding <=> s.embedding LIMIT ${soGoiY * 3}) b`);
  const trang = new Map((await db.seoTrang.findMany({
    select: { id: true, duongDan: true, title: true, h1: true, thamSoMau: true, tuKhoaChinh: { select: { chuoi: true } } },
  })).map((t) => [t.id, t]));
  const mang = (id: string) => ((trang.get(id)?.thamSoMau ?? {}) as { mang?: unknown }).mang ?? null;
  // Cặp đã có từ nguồn khác (QUET, QUY_TAC, TAY) thì bỏ khỏi danh sách xét; cặp NGU_NGHIA cũ (kể cả BO_QUA) vẫn giữ chỗ
  // trong top, nên chạy lại không đôn trang xa hơn lên và không gợi ý lại cặp đã bỏ qua.
  const lk = await db.seoLienKet.findMany({ select: { tuTrangId: true, denTrangId: true, nguon: true } });
  const khac = new Set(lk.filter((l) => l.nguon !== 'NGU_NGHIA').map((l) => `${l.tuTrangId}|${l.denTrangId}`));
  const cuNn = new Set(lk.filter((l) => l.nguon === 'NGU_NGHIA').map((l) => `${l.tuTrangId}|${l.denTrangId}`));

  const theoTu = new Map<string, { den: string; doGan: number; diem: number }[]>();
  let capDaCo = 0;
  for (const g of gan) {
    if (g.doGan < nguong) continue;
    if (khac.has(`${g.tu}|${g.den}`)) { capDaCo++; continue; }
    const m = mang(g.tu);
    const diem = g.doGan + (m != null && m === mang(g.den) ? thuong : 0);
    if (!theoTu.has(g.tu)) theoTu.set(g.tu, []);
    theoTu.get(g.tu)!.push({ den: g.den, doGan: g.doGan, diem });
  }
  const goiY: GoiYNguNghia[] = [];
  for (const [tu, ds] of theoTu) for (const x of ds.sort((a, b) => b.diem - a.diem).slice(0, soGoiY)) {
    if (cuNn.has(`${tu}|${x.den}`)) { capDaCo++; continue; }
    const d = trang.get(x.den)!;
    goiY.push({ tuTrangId: tu, denTrangId: x.den, doGan: Math.round(x.doGan * 10_000) / 10_000, anchor: (d.tuKhoaChinh?.chuoi || d.h1 || d.title).slice(0, 200) });
  }
  if (o.ghi && goiY.length) {
    await db.seoLienKet.createMany({ data: goiY.map((g) => ({ ...g, nguon: 'NGU_NGHIA' as const, trangThai: 'DE_XUAT' as const })) });
  }
  const mau = [...goiY].sort((a, b) => b.doGan - a.doGan).slice(0, 10).map((g) => ({ tu: trang.get(g.tuTrangId)!.duongDan, den: trang.get(g.denTrangId)!.duongDan, doGan: g.doGan }));
  return { trangCoVector: new Set(gan.map((g) => g.tu)).size, goiYMoi: goiY.length, capDaCo, mau };
}

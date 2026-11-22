// Đợt 3: đường tìm của trợ lý công khai (src/lib/rag/tim-cong-khai.ts) không bao giờ trả đoạn NOI_BO.
// Dữ liệu thử nằm trong giao dịch và bị hoàn tác. Không gọi LLM (vietLai: false).
// Chạy: npx tsx --env-file=.env --test tests/dot3/rag-cong-khai.test.mjs
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient, Prisma } from '@prisma/client';
import { timTuKhoa } from '../../src/lib/rag/tim-lai.ts';
import { timCongKhai } from '../../src/lib/rag/tim-cong-khai.ts';

const db = new PrismaClient();
after(() => db.$disconnect());
class HoanTac extends Error {}
async function trongGiaoDich(fn) {
  try { await db.$transaction(async (tx) => { await fn(tx); throw new HoanTac(); }, { timeout: 30000 }); }
  catch (e) { if (!(e instanceof HoanTac)) throw e; }
}

const CHU = '玄祕訣甲乙'; // chuỗi không có trong kho thật

test('timTuKhoa congKhai: đoạn NOI_BO chứa từ khóa không lọt ra, bảng gốc thì thấy', () => trongGiaoDich(async (tx) => {
  const [n] = await tx.$queryRaw`INSERT INTO rag_nguon (ma, "tenGoc", "loaiNguon", "phapLy", "chiNoiBo", "xinPhep", "phamVi", "capNhatLuc")
    VALUES ('TEST_V2_C', '[THỬ]', 'sach_co', 'C'::"PhapLy", true, 'CHUA_XIN'::"TrangThaiXinPhep", 'NOI_BO'::"PhamVi", now()) RETURNING id`;
  const [d] = await tx.$queryRaw`INSERT INTO rag_doan ("nguonId", "duongDan", "thuTu", loai, "vanBan", "vanBanChuan", "bamNoiDung", "capNhatLuc")
    VALUES (${n.id}, ARRAY['thu'], 1, 'chinh_van', ${CHU}, ${CHU}, md5(${CHU}), now()) RETURNING id, "phamVi"::text AS p`;
  assert.equal(d.p, 'NOI_BO');
  const goc = await timTuKhoa(tx, { tuKhoa: [CHU], phamVi: Prisma.sql`TRUE` });
  assert.ok(goc.some((x) => x.id === d.id), 'bảng gốc (quản trị) thấy đoạn thử');
  const ck = await timTuKhoa(tx, { tuKhoa: [CHU], phamVi: Prisma.sql`TRUE`, congKhai: true });
  assert.equal(ck.length, 0, 'view công khai không thấy');
}));

test('timCongKhai: mọi đoạn trả về đều CONG_KHAI, có tiêu đề sách, cắt độ dài', async () => {
  const { doan } = await timCongKhai(db, 'Thiên Lương ở cung Ngọ nghĩa là gì', { k: 4, vietLai: false, ghiLog: false });
  if (!doan.length) return; // CSDL chưa có kho RAG
  assert.ok(doan.length <= 4);
  const p = await db.$queryRaw`SELECT "phamVi"::text AS p FROM rag_doan WHERE id = ANY(${doan.map((x) => BigInt(x.id))}::bigint[])`;
  assert.ok(p.every((x) => x.p === 'CONG_KHAI'));
  for (const x of doan) { assert.ok(x.tieuDe.length > 0); assert.ok(x.noiDung.length <= 901); }
  assert.deepEqual((await timCongKhai(db, '   ', { vietLai: false })).doan, []);
});

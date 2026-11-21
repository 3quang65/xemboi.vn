// Đoạn nội bộ không bao giờ vào ngữ cảnh gửi LLM ngoài (docs/v2/17 mục 2.3 bước 6). Chạy trên CSDL thật, mọi thứ hoàn tác.
// Chạy: npx tsx --test tests/dot2/ngu-canh-ai.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { taoNguCanhAi } from '../../src/lib/noi-dung/ngu-canh-ai.ts';

const prisma = new PrismaClient();
after(() => prisma.$disconnect());
class HoanTac extends Error {}
async function trongGiaoDich(fn) {
  try { await prisma.$transaction(async (tx) => { await fn(tx); throw new HoanTac(); }, { timeout: 20000 }); }
  catch (e) { if (!(e instanceof HoanTac)) throw e; }
}
const q = (tx, sql, ...p) => tx.$queryRawUnsafe(sql, ...p);

async function themNguonDoan(tx, ma, phapLy, phamVi, vanBan) {
  const [n] = await q(tx, `INSERT INTO rag_nguon (ma, "tenGoc", "loaiNguon", "phapLy", "chiNoiBo", "xinPhep", "phamVi", "capNhatLuc")
    VALUES ($1, $1, 'sach_co', $2::"PhapLy", false, 'CHUA_XIN'::"TrangThaiXinPhep", $3::"PhamVi", now()) RETURNING id`, ma, phapLy, phamVi);
  const [d] = await q(tx, `INSERT INTO rag_doan ("nguonId", "duongDan", "thuTu", loai, "vanBan", "bamNoiDung", "phamVi", "capNhatLuc")
    VALUES ($1, ARRAY['thu'], 1, 'chinh_van', $2, md5($2), $3::"PhamVi", now()) RETURNING id, "phamVi"`, n.id, vanBan, phamVi);
  return d;
}

test('taoNguCanhAi loại đoạn nội bộ dù người gọi truyền mã của nó', () => trongGiaoDich(async (tx) => {
  const ck = await themNguonDoan(tx, 'TEST_AI_A', 'A', 'CONG_KHAI', '天機星屬木');
  const nb = await themNguonDoan(tx, 'TEST_AI_C', 'C', 'NOI_BO', '機密之書不得外傳');
  assert.equal(nb.phamVi, 'NOI_BO');
  const r = await taoNguCanhAi(tx, [ck.id, nb.id, 'abc', '999999999999']);
  assert.deepEqual(r.doan.map((d) => d.id), [String(ck.id)]);
  assert.ok(r.biLoai.includes(String(nb.id)), 'mã nội bộ phải nằm trong danh sách bị loại');
  assert.ok(!r.vanBan.includes('機密'), 'văn bản nội bộ không được lọt vào ngữ cảnh');
  assert.match(r.vanBan, new RegExp(`\\[D:${ck.id}\\]`));
}));

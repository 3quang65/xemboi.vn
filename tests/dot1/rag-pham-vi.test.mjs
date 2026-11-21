// Test bắt buộc của Đợt 1 (docs/v2/17 mục 3.5, 8): nguồn C / nội bộ không bao giờ lọt ra phạm vi công khai.
// Chạy trên CSDL thật (DATABASE_URL), mọi thao tác nằm trong giao dịch và bị hoàn tác.
// Chạy: node --test tests/dot1/rag-pham-vi.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
after(() => prisma.$disconnect());

class HoanTac extends Error {}

/** Chạy fn trong một giao dịch rồi luôn hoàn tác. */
async function trongGiaoDich(fn) {
  try {
    await prisma.$transaction(async (tx) => {
      await fn(tx);
      throw new HoanTac();
    }, { timeout: 20000 });
  } catch (e) {
    if (!(e instanceof HoanTac)) throw e;
  }
}

const q = (tx, sql, ...p) => tx.$queryRawUnsafe(sql, ...p);
const x = (tx, sql, ...p) => tx.$executeRawUnsafe(sql, ...p);

async function themNguon(tx, ma, phapLy, { chiNoiBo = false, xinPhep = 'CHUA_XIN', phamVi = 'NOI_BO' } = {}) {
  const [r] = await q(tx,
    `INSERT INTO rag_nguon (ma, "tenGoc", "loaiNguon", "phapLy", "chiNoiBo", "xinPhep", "phamVi", "capNhatLuc")
     VALUES ($1, $1, 'sach_co', $2::"PhapLy", $3, $4::"TrangThaiXinPhep", $5::"PhamVi", now()) RETURNING id, "phamVi"`,
    ma, phapLy, chiNoiBo, xinPhep, phamVi);
  return r;
}

async function themDoan(tx, nguonId, { phamVi = 'CONG_KHAI', dichViNguonId = null, vanBan = '紫微星' } = {}) {
  const [r] = await q(tx,
    `INSERT INTO rag_doan ("nguonId", "duongDan", "thuTu", loai, "vanBan", "bamNoiDung", "phamVi", "dichViNguonId", "capNhatLuc")
     VALUES ($1, ARRAY['thu'], 1, 'chinh_van', $2, md5($2), $3::"PhamVi", $4, now()) RETURNING id, "phamVi", tsv IS NOT NULL AS co_tsv`,
    nguonId, vanBan, phamVi, dichViNguonId);
  return r;
}

test('nguồn C luôn NOI_BO, kể cả khi gắn chiNoiBo=false', () => trongGiaoDich(async (tx) => {
  const c = await themNguon(tx, 'TEST_C1', 'C', { chiNoiBo: false });
  assert.equal(c.phamVi, 'NOI_BO');
}));

test('đặt CONG_KHAI cho nguồn C bằng SQL bị từ chối', async () => {
  await assert.rejects(
    trongGiaoDich(async (tx) => {
      const c = await themNguon(tx, 'TEST_C2', 'C');
      await x(tx, `UPDATE rag_nguon SET "phamVi" = 'CONG_KHAI' WHERE id = $1`, c.id);
    }),
    /không được để CONG_KHAI/,
  );
});

test('chèn nguồn C với phamVi CONG_KHAI bị từ chối', async () => {
  await assert.rejects(
    trongGiaoDich((tx) => themNguon(tx, 'TEST_C3', 'C', { phamVi: 'CONG_KHAI' })),
    /không được để CONG_KHAI/,
  );
});

test('nguồn B chỉ công khai khi đã được đồng ý và bỏ cờ nội bộ', () => trongGiaoDich(async (tx) => {
  const b = await themNguon(tx, 'TEST_B1', 'B', { chiNoiBo: false });
  assert.equal(b.phamVi, 'NOI_BO');
  const [b2] = await q(tx, `UPDATE rag_nguon SET "xinPhep" = 'DONG_Y' WHERE id = $1 RETURNING "phamVi"`, b.id);
  assert.equal(b2.phamVi, 'CONG_KHAI');
}));

test('đoạn của nguồn C bị ép NOI_BO dù máy trạm gửi CONG_KHAI', () => trongGiaoDich(async (tx) => {
  const c = await themNguon(tx, 'TEST_C4', 'C');
  const d = await themDoan(tx, c.id, { phamVi: 'CONG_KHAI' });
  assert.equal(d.phamVi, 'NOI_BO');
  assert.equal(d.co_tsv, true);
}));

test('đoạn nguồn A dùng bản dịch từ nguồn C thì NOI_BO', () => trongGiaoDich(async (tx) => {
  const a = await themNguon(tx, 'TEST_A1', 'A');
  const c = await themNguon(tx, 'TEST_C5', 'C');
  assert.equal(a.phamVi, 'CONG_KHAI');
  assert.equal((await themDoan(tx, a.id)).phamVi, 'CONG_KHAI');
  assert.equal((await themDoan(tx, a.id, { dichViNguonId: c.id })).phamVi, 'NOI_BO');
}));

test('gắn cờ nội bộ cho nguồn A thì mọi đoạn của nó về NOI_BO và rời view công khai', () => trongGiaoDich(async (tx) => {
  const a = await themNguon(tx, 'TEST_A2', 'A');
  const d = await themDoan(tx, a.id);
  const [{ n: truoc }] = await q(tx, `SELECT count(*)::int AS n FROM rag_doan_cong_khai WHERE id = $1`, d.id);
  assert.equal(truoc, 1);
  await x(tx, `UPDATE rag_nguon SET "chiNoiBo" = true WHERE id = $1`, a.id);
  const [d2] = await q(tx, `SELECT "phamVi" FROM rag_doan WHERE id = $1`, d.id);
  assert.equal(d2.phamVi, 'NOI_BO');
  const [{ n: sau }] = await q(tx, `SELECT count(*)::int AS n FROM rag_doan_cong_khai WHERE id = $1`, d.id);
  assert.equal(sau, 0);
}));

test('view công khai không chứa đoạn NOI_BO nào', async () => {
  const [{ n }] = await prisma.$queryRawUnsafe(
    `SELECT count(*)::int AS n FROM rag_doan_cong_khai v JOIN rag_doan d ON d.id = v.id WHERE d."phamVi" <> 'CONG_KHAI'`);
  assert.equal(n, 0);
});

test('vai trò xemboi_web không đọc được bảng gốc, chỉ đọc view', () => trongGiaoDich(async (tx) => {
  await x(tx, 'SET LOCAL ROLE xemboi_web');
  const [{ n }] = await q(tx, 'SELECT count(*)::int AS n FROM rag_doan_cong_khai');
  assert.ok(n >= 0);
  await assert.rejects(q(tx, 'SELECT 1 FROM rag_doan LIMIT 1'), /permission denied/);
}));

test('vai trò xemboi_worker không đổi được pháp lý nguồn', () => trongGiaoDich(async (tx) => {
  await x(tx, 'SET LOCAL ROLE xemboi_worker');
  await assert.rejects(x(tx, `UPDATE rag_nguon SET "phapLy" = 'A'`), /permission denied/);
}));

test('vai trò xemboi_quantri không sửa, xóa được nhật ký', () => trongGiaoDich(async (tx) => {
  await x(tx, 'SET LOCAL ROLE xemboi_quantri');
  await assert.rejects(x(tx, `DELETE FROM "NhatKyThaoTac"`), /permission denied/);
}));

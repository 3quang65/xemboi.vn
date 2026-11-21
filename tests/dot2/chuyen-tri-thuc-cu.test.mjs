// Chuyển AgentKnowledgeDoc → RagNguon nội bộ (docs/v2/17 mục 6.4). Chạy trên CSDL thật, mọi dòng hoàn tác; tệp ghi vào thư mục tạm.
// Chạy: npx tsx --test tests/dot2/chuyen-tri-thuc-cu.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { chuyenTriThuc, maNguonXb, THU_MUC_CON } from '../../scripts/chuyen-tri-thuc-cu.ts';

const prisma = new PrismaClient();
const thuVien = mkdtempSync(path.join(tmpdir(), 'xb-tri-thuc-'));
after(async () => { await prisma.$disconnect(); rmSync(thuVien, { recursive: true, force: true }); });
class HoanTac extends Error {}
async function trongGiaoDich(fn) {
  try { await prisma.$transaction(async (tx) => { await fn(tx); throw new HoanTac(); }, { timeout: 30000 }); }
  catch (e) { if (!(e instanceof HoanTac)) throw e; }
}

test('mỗi tài liệu cũ thành một nguồn nội bộ hạng C, gắn trợ lý, chạy lại không nhân đôi', () => trongGiaoDich(async (tx) => {
  const ag = await tx.aiAgent.create({ data: { slug: '_thu-tri-thuc', name: '[THỬ]', title: '[THỬ]', systemPrompt: '-', welcomeMessage: '-', suggestedQuestions: [] } });
  const a = await tx.agentKnowledgeDoc.create({ data: { agentId: ag.id, title: '[THỬ] Sao Tử Vi', category: 'TU_VI', sourceType: 'CRAWLED', rawContent: 'Tử Vi là đế tinh.\r\nChủ quyền uy.' } });
  await tx.agentKnowledgeDoc.create({ data: { agentId: ag.id, title: '[THỬ] rỗng', category: 'TU_VI', sourceType: 'SEEDED', rawContent: '   ' } });

  const k1 = await chuyenTriThuc(tx, { thuVien });
  assert.equal(k1.moi, 1);
  assert.equal(k1.rong, 1);
  const ma = maNguonXb(a.id);
  assert.match(ma, /^XB-[0-9a-f]{10}$/);
  const ng = await tx.ragNguon.findUnique({ where: { ma }, include: { tacTu: { select: { id: true } } } });
  assert.equal(ng.phapLy, 'C');
  assert.equal(ng.phamVi, 'NOI_BO');
  assert.equal(ng.chiNoiBo, true);
  assert.equal(ng.loaiNguon, 'noi_bo_xemboi');
  assert.equal(ng.trangThaiTai, 'đã tải');
  assert.deepEqual(ng.tacTu.map((x) => x.id), [ag.id]);
  assert.equal(readFileSync(path.join(thuVien, THU_MUC_CON, `${ma}.txt`), 'utf8'), 'Tử Vi là đế tinh.\nChủ quyền uy.');

  const k2 = await chuyenTriThuc(tx, { thuVien });
  assert.equal(k2.moi, 0);
  assert.equal(k2.giuNguyen, 1);

  await tx.agentKnowledgeDoc.update({ where: { id: a.id }, data: { rawContent: 'Tử Vi là đế tinh, bản sửa.' } });
  const k3 = await chuyenTriThuc(tx, { thuVien });
  assert.equal(k3.capNhatTep, 1);
  assert.equal(await tx.ragNguon.count({ where: { ma } }), 1);
  assert.equal(readFileSync(path.join(thuVien, THU_MUC_CON, `${ma}.txt`), 'utf8'), 'Tử Vi là đế tinh, bản sửa.');
}));

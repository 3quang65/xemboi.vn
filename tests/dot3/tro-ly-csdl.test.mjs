// Đợt 3: trợ lý sửa trong quản trị (AiAgent) và mẫu few-shot (CaiDat AI_FEW_SHOT) có hiệu lực ở chat.
// Cần đã chạy scripts/seed-ai-agent.ts. Bản ghi bị sửa tạm được trả lại như cũ.
// Chạy: npx tsx --env-file=.env --test tests/dot3/tro-ly-csdl.test.mjs
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { lamMoiFewShot, boCacheTroLy, fewShotTrongBoNho, docFewShot } from '../../src/lib/ai/few-shot.ts';
import { getAgentBySlug, DEFAULT_AGENTS } from '../../src/lib/ai/agent-persona.ts';

const db = new PrismaClient();
after(() => db.$disconnect());

test('bản sửa trong AiAgent thắng bản mặc định, tắt trợ lý thì về mặc định', async () => {
  const goc = await db.aiAgent.findUnique({ where: { slug: 'thay-tam-an' } });
  if (!goc) return; // chưa seed
  const macDinh = DEFAULT_AGENTS.find((a) => a.slug === 'thay-tam-an');
  try {
    await db.aiAgent.update({ where: { slug: 'thay-tam-an' }, data: { systemPrompt: '[THỬ] prompt tạm', name: '[THỬ] Tâm An' } });
    boCacheTroLy(); await lamMoiFewShot(db);
    const a = getAgentBySlug('thay-tam-an');
    assert.ok(a.systemPrompt.startsWith('[THỬ] prompt tạm'));
    assert.equal(a.name, '[THỬ] Tâm An');
    await db.aiAgent.update({ where: { slug: 'thay-tam-an' }, data: { isActive: false } });
    boCacheTroLy(); await lamMoiFewShot(db);
    assert.ok(getAgentBySlug('thay-tam-an').systemPrompt.startsWith(macDinh.systemPrompt.slice(0, 50)));
  } finally {
    await db.aiAgent.update({ where: { slug: 'thay-tam-an' }, data: { systemPrompt: goc.systemPrompt, name: goc.name, isActive: goc.isActive } });
    boCacheTroLy(); await lamMoiFewShot(db);
  }
  assert.equal(getAgentBySlug('thay-tam-an').name, goc.name);
});

test('few-shot đọc từ CaiDat và được nối vào prompt của đúng thầy', async () => {
  const ds = await docFewShot(db);
  assert.ok(ds.length > 0);
  assert.deepEqual(fewShotTrongBoNho(), ds);
  const m = ds[0];
  assert.ok(getAgentBySlug(m.agentSlug).systemPrompt.includes(m.userQuestion));
});

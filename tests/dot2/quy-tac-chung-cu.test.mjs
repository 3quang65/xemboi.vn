// Quy tắc chứng cứ (ý từ taibu "解读通则") phải có trong prompt của mọi trợ lý, kể cả bản sửa trong quản trị.
// Chạy: npx tsx --test tests/dot2/quy-tac-chung-cu.test.mjs  (không cần CSDL: dùng db giả)
import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_AGENTS, DAU_QUY_TAC_CHUNG_CU, QUY_TAC_CHUNG_CU, getAgentBySlug } from '../../src/lib/ai/agent-persona.ts';
import { boCacheTroLy, lamMoiFewShot } from '../../src/lib/ai/few-shot.ts';

const dem = (s, t) => s.split(t).length - 1;

test('Mọi trợ lý mặc định có đúng một lần quy tắc chứng cứ', () => {
  for (const a of DEFAULT_AGENTS) {
    const p = getAgentBySlug(a.slug).systemPrompt;
    assert.equal(dem(p, DAU_QUY_TAC_CHUNG_CU), 1, a.slug);
  }
});

test('Prompt sửa trong quản trị vẫn được nối quy tắc chứng cứ', async () => {
  const db = {
    caiDat: { findUnique: async () => null },
    aiAgent: {
      findMany: async () => [{
        slug: 'thay-minh-triet', name: 'Thầy Minh Triết', title: 'Tử vi', avatarUrl: null, temperature: 0.5,
        systemPrompt: 'Bản prompt anh sửa trong quản trị, không có quy tắc.', welcomeMessage: '', suggestedQuestions: [], isActive: true,
      }],
    },
  };
  boCacheTroLy();
  await lamMoiFewShot(db, 0);
  const p = getAgentBySlug('thay-minh-triet').systemPrompt;
  assert.ok(p.startsWith('Bản prompt anh sửa trong quản trị'));
  assert.equal(dem(p, DAU_QUY_TAC_CHUNG_CU), 1);
  boCacheTroLy();
});

test('Nội dung quy tắc: thiếu dữ kiện, không tuyệt đối, không bán hóa giải', () => {
  assert.match(QUY_TAC_CHUNG_CU, /chưa đủ dữ kiện/);
  assert.match(QUY_TAC_CHUNG_CU, /Không dùng "chắc chắn"/);
  assert.match(QUY_TAC_CHUNG_CU, /Không khuyên mua vật phẩm/);
  const tuePhong = DEFAULT_AGENTS.find((a) => a.slug === 'thay-tue-phong');
  assert.ok(!/vật phẩm|Cải Vận/.test(tuePhong.title + tuePhong.systemPrompt + tuePhong.suggestedQuestions.join(' ')));
});

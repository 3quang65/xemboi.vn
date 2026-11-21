// Cấu hình LLM qua 9router: chuẩn hóa dữ liệu và thân yêu cầu gửi cổng. fetch giả, không gọi mạng.
// Chạy: npx tsx --test tests/dot2/cau-hinh-llm.test.mjs
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { chuanHoa, goiLlm, laMoHinhGpt, MAC_DINH } from '../../src/lib/ai/cau-hinh-llm.ts';
import { prisma } from '../../src/lib/prisma.ts';

after(() => prisma.$disconnect());
const fetchGoc = globalThis.fetch;
after(() => { globalThis.fetch = fetchGoc; });

test('chuanHoa: giá trị sai rơi về mặc định, nhiệt độ bị kẹp', () => {
  assert.deepEqual(chuanHoa(null), MAC_DINH);
  const c = chuanHoa({ baseUrl: 'javascript:alert(1)', moHinh: { chat: 'cx/gpt-6-luna', soan: 'x y; rm' }, nhietDo: { chat: 9, soan: 'abc' } });
  assert.equal(c.baseUrl, MAC_DINH.baseUrl);
  assert.equal(c.moHinh.chat, 'cx/gpt-6-luna');
  assert.equal(c.moHinh.soan, MAC_DINH.moHinh.soan);
  assert.equal(c.nhietDo.chat, 1.5);
  assert.equal(c.nhietDo.soan, MAC_DINH.nhietDo.soan);
  assert.equal(chuanHoa({ baseUrl: 'https://token.vip.vn/v1///' }).baseUrl, 'https://token.vip.vn/v1');
  assert.equal(chuanHoa({ moHinh: { chat: 'cx/gpt-6-sol[1m]' } }).moHinh.chat, 'cx/gpt-6-sol[1m]');
});

test('laMoHinhGpt', () => {
  assert.ok(laMoHinhGpt('cx/gpt-6-sol'));
  assert.ok(!laMoHinhGpt('ds/deepseek-v4-pro'));
});

test('goiLlm: thiếu khóa thì không gọi mạng', async () => {
  const cu = process.env.NINEROUTER_API_KEY;
  delete process.env.NINEROUTER_API_KEY;
  let goi = 0;
  globalThis.fetch = async () => { goi++; return new Response('{}'); };
  const r = await goiLlm('chat', [{ role: 'user', content: 'x' }], { cauHinh: MAC_DINH });
  assert.equal(r.ok, false);
  assert.equal(goi, 0);
  if (cu !== undefined) process.env.NINEROUTER_API_KEY = cu;
});

test('goiLlm: gửi stream:false, đúng mô hình theo việc, đọc usage', async () => {
  const cu = process.env.NINEROUTER_API_KEY;
  process.env.NINEROUTER_API_KEY = 'sk-gia-1234';
  let url, than, xacThuc;
  globalThis.fetch = async (u, o) => {
    url = u; than = JSON.parse(o.body); xacThuc = o.headers.Authorization;
    return new Response(JSON.stringify({ model: 'gpt-6-sol', choices: [{ message: { content: 'OK' } }], usage: { prompt_tokens: 12, completion_tokens: 1 } }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const r = await goiLlm('soan', [{ role: 'user', content: 'x' }], { cauHinh: MAC_DINH, maxTokens: 16 });
  assert.equal(r.ok, true);
  assert.equal(r.vanBan, 'OK');
  assert.equal(r.tokenVao, 12);
  assert.equal(url, 'https://token.vip.vn/v1/chat/completions');
  assert.equal(than.stream, false);
  assert.equal(than.model, MAC_DINH.moHinh.soan);
  assert.equal(than.temperature, MAC_DINH.nhietDo.soan);
  assert.equal(than.max_tokens, 16);
  assert.equal(xacThuc, 'Bearer sk-gia-1234');
  if (cu === undefined) delete process.env.NINEROUTER_API_KEY; else process.env.NINEROUTER_API_KEY = cu;
});

test('goiLlm: cổng trả SSE thay vì JSON thì báo rõ', async () => {
  process.env.NINEROUTER_API_KEY = 'sk-gia-1234';
  globalThis.fetch = async () => new Response('data: {}\n\n', { status: 200, headers: { 'content-type': 'text/event-stream' } });
  const r = await goiLlm('chat', [{ role: 'user', content: 'x' }], { cauHinh: MAC_DINH });
  assert.equal(r.ok, false);
  assert.match(r.loi, /text\/event-stream/);
  delete process.env.NINEROUTER_API_KEY;
});

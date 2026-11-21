// Kiểm Đợt 0: mọi route /api/admin/** và trang /admin/** phải chặn khi chưa đăng nhập.
// Chạy: node scripts/kiem-dot0.mjs [http://localhost:3047]   (đọc ADMIN_KEY từ .env, không in ra)
import fs from 'node:fs';
const GOC = process.argv[2] || 'http://localhost:3047';
const env = fs.readFileSync('.env', 'utf8');
const KEY = (env.match(/^ADMIN_KEY=(.*)$/m)?.[1] || '').trim().replace(/^["']|["']$/g, '');
const ROUTE = [
  ['GET', '/api/admin/agents'], ['POST', '/api/admin/agents'],
  ['GET', '/api/admin/agents/x/knowledge'], ['POST', '/api/admin/agents/x/knowledge'],
  ['GET', '/api/admin/analytics/overview'],
  ['GET', '/api/admin/conversations'], ['POST', '/api/admin/conversations'],
  ['POST', '/api/admin/conversations/simulate'],
  ['GET', '/api/admin/customers'], ['POST', '/api/admin/customers'],
  ['GET', '/api/admin/customers/x'], ['PATCH', '/api/admin/customers/x'],
  ['GET', '/api/admin/inquiries'], ['POST', '/api/admin/inquiries'],
  ['GET', '/api/admin/inquiries/external'], ['POST', '/api/admin/inquiries/external'],
];
let loi = 0;
const ok = (dk, msg) => { console.log((dk ? 'ĐẠT ' : 'HỎNG ') + msg); if (!dk) loi++; };
for (const [m, p] of ROUTE) {
  const r = await fetch(GOC + p, { method: m, headers: { 'content-type': 'application/json' }, body: m === 'GET' ? undefined : '{}', redirect: 'manual' });
  ok(r.status === 401, `${m} ${p} không khóa → ${r.status}`);
  // Có khóa: gửi thân không phải JSON để handler dừng ở req.json(), không ghi gì vào DB.
  const r2 = await fetch(GOC + p, { method: m, headers: { 'content-type': 'application/json', 'x-admin-key': KEY }, body: m === 'GET' ? undefined : 'khong-phai-json', redirect: 'manual' });
  ok(r2.status !== 401, `${m} ${p} có khóa → ${r2.status}`);
  const r3 = await fetch(GOC + p, { method: m, headers: { 'content-type': 'application/json', 'x-admin-key': 'sai' + KEY }, body: m === 'GET' ? undefined : '{}', redirect: 'manual' });
  ok(r3.status === 401, `${m} ${p} khóa sai → ${r3.status}`);
}
for (const p of ['/admin', '/admin/customers', '/admin/agents']) {
  const r = await fetch(GOC + p, { redirect: 'manual' });
  ok([307, 308].includes(r.status) && (r.headers.get('location') || '').includes('/quan-tri/r1'), `${p} không khóa → ${r.status} ${r.headers.get('location') || ''}`);
  ok((r.headers.get('x-robots-tag') || '').includes('noindex'), `${p} có X-Robots-Tag noindex`);
}
const rb = await (await fetch(GOC + '/robots.txt')).text();
ok(/Disallow: \/admin/.test(rb), 'robots.txt chặn /admin');
const sm = await (await fetch(GOC + '/sitemap.xml')).text();
ok(!/\/la-so\/|\/admin/.test(sm), 'sitemap.xml không có /la-so/ hay /admin');
const ls = await fetch(GOC + '/la-so/test');
const html = await ls.text();
ok(/<meta name="robots" content="[^"]*noindex/.test(html), `/la-so/test có meta noindex (HTTP ${ls.status})`);
console.log(loi ? `\n${loi} mục HỎNG` : '\nTất cả ĐẠT');
process.exit(loi ? 1 : 0);

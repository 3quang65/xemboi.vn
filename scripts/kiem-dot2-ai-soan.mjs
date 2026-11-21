// Nghiệm thu Đợt 2b: trang soạn hiện khung "AI soạn" bật, đúng mô hình, cho biên tập; chuyên gia không thấy.
// Chạy khi dev server đang mở: node --env-file=.env scripts/kiem-dot2-ai-soan.mjs [http://localhost:3047]
// Mật khẩu thử đọc từ ngoài repo (may-tram/tai-khoan-thu.json), không in ra. Mục [THỬ] tạo rồi xóa.
import fs from 'node:fs';
import { PrismaClient } from '@prisma/client';
const B = process.argv[2] || 'http://localhost:3047';
const TK = JSON.parse(fs.readFileSync('D:/VibeCode/Antigravity/may-tram/tai-khoan-thu.json', 'utf8'));
const db = new PrismaClient();
async function dangNhap(email) {
  const v = TK[email];
  const matKhau = typeof v === 'string' ? v : v.matKhau;
  const r = await fetch(`${B}/api/quan-tri/dang-nhap`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, matKhau }) });
  return (r.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).find((c) => c.startsWith('qt_phien='));
}
let loi = 0;
const n = await db.noiDung.create({ data: { loai: 'MUC_TU_DIEN', tieuDe: '[THỬ] kiểm AI soạn', mang: ['A'], trangThai: 'NHAP' } });
try {
  for (const [email, kyVong] of [['bt@xemboi.test', true], ['cg@xemboi.test', false]]) {
    const ck = await dangNhap(email);
    const html = await (await fetch(`${B}/quan-tri/noi-dung/${n.id}`, { headers: { cookie: ck } })).text();
    const co = html.includes('AI soạn bản nháp');
    const bat = co && !html.includes('Chưa có khóa 9router') && /cx\/gpt-[\w.\-]+/.test(html);
    const dat = kyVong ? bat : !co;
    console.log(`${dat ? '✓' : '✗'} ${email}: khung AI soạn ${co ? (bat ? 'bật, mô hình ' + (html.match(/Mô hình: (cx\/[\w.\-[\]]+)/)?.[1] ?? '?') : 'có nhưng tắt') : 'không hiện'}`);
    if (!dat) loi++;
    await fetch(`${B}/api/quan-tri/dang-xuat`, { method: 'POST', headers: { cookie: ck } });
  }
} finally {
  await db.noiDung.delete({ where: { id: n.id } });
  await db.$disconnect();
}
process.exit(loi ? 1 : 0);

// Nghiệm thu Đợt 1: mỗi vai trò chỉ thấy menu của mình và bị chặn ở trang không có quyền.
// Chạy khi dev server đang mở: node scripts/kiem-dot1-quyen.mjs [http://localhost:3047]
// Mật khẩu thử đọc từ ngoài repo (may-tram/tai-khoan-thu.json), không in ra.
import fs from 'node:fs';
const B = process.argv[2] || 'http://localhost:3047';
const TK = JSON.parse(fs.readFileSync('D:/VibeCode/Antigravity/may-tram/tai-khoan-thu.json', 'utf8'));
const TRANG = ['/quan-tri/seo/tu-khoa', '/quan-tri/seo/do-phu', '/quan-tri/seo/tu-khoa-loai', '/quan-tri/seo/trang', '/quan-tri/seo/chuyen-huong', '/quan-tri/seo/tu-khoa/nhap', '/quan-tri/r1', '/quan-tri/tai-khoan', '/quan-tri/ai/mo-hinh', '/quan-tri/so-lieu', '/quan-tri/khach-hang', '/quan-tri/hoi-thoai', '/quan-tri/ai/tro-ly'];
const CHI_QT = ['/quan-tri/r1', '/quan-tri/tai-khoan', '/quan-tri/ai/mo-hinh', '/quan-tri/khach-hang', '/quan-tri/hoi-thoai', '/quan-tri/ai/tro-ly'];
// Trang phải chứa chuỗi này khi vào được (bắt lỗi trang trả 200 nhưng vỡ).
const CHUA = { '/quan-tri/ai/mo-hinh': 'Mô hình AI', '/quan-tri/tai-khoan': 'Tạo tài khoản' };
// Kỳ vọng theo src/lib/quan-tri/quyen.ts
const KY_VONG = {
  'qt@xemboi.test': TRANG,
  'bt@xemboi.test': TRANG.filter((t) => !CHI_QT.includes(t)),
  'cg@xemboi.test': [],
  'sl@xemboi.test': ['/quan-tri/seo/tu-khoa', '/quan-tri/seo/do-phu', '/quan-tri/seo/tu-khoa-loai', '/quan-tri/seo/trang', '/quan-tri/seo/chuyen-huong', '/quan-tri/so-lieu'], // r1.xem chỉ QUAN_TRI (dữ liệu khách)
};
let loi = 0;
for (const [email, v] of Object.entries(TK)) {
  const matKhau = typeof v === 'string' ? v : v.matKhau ?? v.mat_khau ?? v.password;
  const r = await fetch(`${B}/api/quan-tri/dang-nhap`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, matKhau }) });
  const ck = (r.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).find((c) => c.startsWith('qt_phien='));
  if (!ck) { console.log(`✗ ${email}: đăng nhập ${r.status}`); loi++; continue; }
  const home = await (await fetch(`${B}/quan-tri`, { headers: { cookie: ck }, redirect: 'manual' })).text();
  const menu = [...home.matchAll(/href="(\/quan-tri[^"]*|\/admin[^"]*)"/g)].map((m) => m[1]);
  const duoc = [];
  for (const t of TRANG) {
    const res = await fetch(B + t, { headers: { cookie: ck }, redirect: 'manual' });
    if (res.status === 200) {
      duoc.push(t);
      if (CHUA[t] && !(await res.text()).includes(CHUA[t])) { console.log(`  ✗ ${email} ${t}: 200 nhưng thiếu "${CHUA[t]}"`); loi++; }
    }
    else if (!(res.status >= 300 && res.status < 400 && (res.headers.get('location') || '').includes('thieu-quyen'))) { console.log(`  ? ${email} ${t}: ${res.status} ${res.headers.get('location')}`); }
  }
  const kv = KY_VONG[email] ?? [];
  const sai = TRANG.filter((t) => duoc.includes(t) !== kv.includes(t));
  const menuSai = TRANG.filter((t) => menu.includes(t) !== kv.includes(t));
  console.log(`${sai.length || menuSai.length ? '✗' : '✓'} ${email}: vào được ${duoc.length}/${TRANG.length}; menu ${[...new Set(menu)].length} mục${sai.length ? '; sai quyền: ' + sai.join(' ') : ''}${menuSai.length ? '; sai menu: ' + menuSai.join(' ') : ''}`);
  if (sai.length || menuSai.length) loi++;
  await fetch(`${B}/api/quan-tri/dang-xuat`, { method: 'POST', headers: { cookie: ck } });
}
// Khu /admin cũ: trang chuyển 308 sang /quan-tri (middleware), kể cả khi chưa đăng nhập.
for (const [cu, moi] of [['/admin/dashboard', '/quan-tri/so-lieu'], ['/admin/customers/abc', '/quan-tri/khach-hang/abc'], ['/admin/conversations', '/quan-tri/hoi-thoai'], ['/admin/agents', '/quan-tri/ai/tro-ly'], ['/admin/inquiries', '/quan-tri']]) {
  const r = await fetch(B + cu, { redirect: 'manual' });
  const den = new URL(r.headers.get('location') || '/', B).pathname;
  const dung = r.status === 308 && den === moi;
  console.log(`${dung ? '✓' : '✗'} ${cu} → ${r.status} ${den}`);
  if (!dung) loi++;
}
const khong = await fetch(`${B}/quan-tri/seo/tu-khoa`, { redirect: 'manual' });
console.log(`${khong.status === 307 ? '✓' : '✗'} chưa đăng nhập → ${khong.status} ${khong.headers.get('location')}`);
process.exit(loi ? 1 : 0);

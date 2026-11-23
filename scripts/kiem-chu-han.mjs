// Kiểm chữ Hán trên frontend (quy tắc 24/11/2026: trang chỉ hiện tiếng Việt).
// Bò liên kết nội bộ từ trang chủ của máy dev, mỗi mẫu đường dẫn tối đa 2 trang, cộng các trang có tham số ở THEM.
// Đếm chữ Hán trong chữ hiển thị, <title>, meta description, aria-label, title, alt. Thoát mã 1 nếu còn chữ Hán.
// Chạy: node scripts/kiem-chu-han.mjs [http://localhost:3047]
const GOC = process.argv[2] ?? 'http://localhost:3047';
const THEM = [
  '/bat-tu/lap-la-so?ngay=1&thang=6&nam=1990&gio=8&phut=30&gioiTinh=nu&ln=2026',
  '/bat-tu/lap-la-so?ngay=1&thang=6&nam=1990&gioiTinh=nu&khongRoGio=1',
  '/kinh-dich/gieo-que?xu=7,8,9,7,6,8',
  '/xem-tuoi/vo-chong?chong=1990&vo=1992',
  '/xem-tuoi/xong-dat?chu=1985&tet=2026',
  '/phong-thuy/huong-nha?do=135&nam=1990&gt=nu',
  '/chiem-tinh/ban-do-sao?ngay=1962-02-03&gio=12:00&tinh=ha-noi',
  '/than-so-hoc/bieu-do-ngay-sinh?ngay=1990-06-01',
  '/xem-ngay/khai-truong?trong=60',
  '/lich-am/2026/11/24', '/sinh-nam/1990', '/tu-vi/lap-la-so',
  '/kinh-dich/que/01-thuan-can', '/kinh-dich/bat-quai/can-thien', '/phong-thuy/cuu-tinh/2027',
  '/xem-ngay/xuat-hanh', '/nguon', '/tu-dien', '/con-giap/dan', '/nap-am/lo-bang-tho',
  '/lich-am/gio-hoang-dao', '/lich-am/gio-hoang-dao?ngay=2026-11-23', '/tiet-khi', '/tiet-khi?nam=2030', '/tiet-khi/lap-xuan', '/tiet-khi/ha-chi',
  '/lich-am/ngay-le', '/lich-am/ngay-le?nam=2027', '/lich-am/ngay-le/trung-thu', '/lich-am/ngay-le/giao-thua',
  '/xem-tuoi/con-giap', '/xem-tuoi/dan-va-ti', '/xem-tuoi/thin-va-thin', '/tu-vi/tu-hoa', '/tu-vi/tu-hoa?nam=1990',
  '/bat-tu/thap-than/that-sat', '/bat-tu/thap-than/thien-an', '/can-chi/thien-can/giap', '/can-chi/thien-can/canh',
];
const HAN = /[㐀-䶿一-鿿豈-﫿　-〿]/g;
const mau = (p) => p.split('?')[0].replace(/\/[^/]+$/, '/*');
const dem = new Map();
const hang = ['/', ...THEM];
const da = new Set();
const kq = [];
while (hang.length && da.size < 300) {
  const p = hang.shift();
  if (da.has(p)) continue;
  const m = mau(p);
  if (!THEM.includes(p) && !p.includes('?') && (dem.get(m) ?? 0) >= 2) continue;
  da.add(p); dem.set(m, (dem.get(m) ?? 0) + 1);
  let html;
  try {
    const r = await fetch(GOC + p);
    if (!r.ok) { kq.push({ p, loi: r.status }); continue; }
    html = await r.text();
  } catch (e) { kq.push({ p, loi: String(e) }); continue; }
  const thuocTinh = [...html.matchAll(/\s(?:aria-label|title|alt)="([^"]*)"/g)].map((x) => x[1]).join(' ');
  const dau = (html.match(/<title>[\s\S]*?<\/title>|<meta name="description"[^>]*>/g) ?? []).join(' ');
  const than = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<head>[\s\S]*?<\/head>/, '');
  const text = `${dau} ${than} ${thuocTinh}`.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ');
  const chu = text.match(HAN) ?? [];
  if (chu.length) {
    const vd = []; const re = /.{0,25}[㐀-鿿].{0,25}/g; let x;
    while ((x = re.exec(text)) && vd.length < 3) vd.push(x[0].trim());
    kq.push({ p, so: chu.length, vd });
  }
  for (const [, href] of html.matchAll(/href="(\/[^"#]*)"/g)) {
    if (/^\/(_next|api|quan-tri)|\.(xml|ics|png|svg|ico|css|js|txt)$/.test(href)) continue;
    const h = href.replace(/&amp;/g, '&');
    if (!da.has(h)) hang.push(h);
  }
}
kq.sort((a, b) => (b.so ?? 0) - (a.so ?? 0));
const coHan = kq.filter((k) => k.so);
console.log(`Đã quét ${da.size} trang; ${coHan.length} trang có chữ Hán`);
for (const k of kq) console.log(k.loi ? `LỖI ${k.loi} ${k.p}` : `${String(k.so).padStart(5)} ${k.p} | ${k.vd.join(' || ')}`);
process.exit(coHan.length || kq.some((k) => k.loi) ? 1 : 0);

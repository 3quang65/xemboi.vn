// Sao lưu CSDL Postgres (gồm vector) theo docs/v2/17 mục 5.3: pg_dump -Fc, giữ 7 bản ngày + 4 bản tuần.
// Chạy được trên máy trạm (Windows) và VPS (Linux). Không in mật khẩu: đọc DATABASE_URL rồi chuyển qua PGPASSWORD.
//   node scripts/sao-luu-csdl.mjs [--thu-muc <dir>] [--pg-bin <dir>] [--chi-xem]
// Mặc định: thư mục D:/VibeCode/Antigravity/may-tram/sao-luu (Windows) hoặc ~/sao-luu/xemboi (Linux).
// Sau khi dump, chạy pg_restore --list để chắc tệp đọc được; lỗi thì thoát mã 1 và không xoay vòng.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const thamSo = (ten) => { const i = process.argv.indexOf(ten); return i > 0 ? process.argv[i + 1] : undefined; };
const WIN = process.platform === 'win32';
const GOC = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const THU_MUC = thamSo('--thu-muc') ?? (WIN ? 'D:/VibeCode/Antigravity/may-tram/sao-luu' : path.join(os.homedir(), 'sao-luu', 'xemboi'));
const PG_BIN = thamSo('--pg-bin') ?? (WIN ? 'D:/VibeCode/Antigravity/may-tram/pgsql/bin' : '');
const CHI_XEM = process.argv.includes('--chi-xem');
const GIU_NGAY = 7, GIU_TUAN = 4;

function docDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const env = path.join(GOC, '.env');
  if (!fs.existsSync(env)) throw new Error('Thiếu DATABASE_URL (không có .env)');
  const dong = fs.readFileSync(env, 'utf8').split(/\r?\n/).find((d) => /^DATABASE_URL\s*=/.test(d));
  if (!dong) throw new Error('Thiếu DATABASE_URL trong .env');
  return dong.replace(/^DATABASE_URL\s*=\s*/, '').replace(/^["']|["']$/g, '');
}

const lenh = (ten) => (PG_BIN ? path.join(PG_BIN, ten + (WIN ? '.exe' : '')) : ten);
const hai = (n) => String(n).padStart(2, '0');
const tenTep = (d) => `xemboi-${d.getFullYear()}${hai(d.getMonth() + 1)}${hai(d.getDate())}-${hai(d.getHours())}${hai(d.getMinutes())}.dump`;
const RE_TEP = /^xemboi-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})\.dump$/;

function tuanIso(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const thu = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - thu);
  const dauNam = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${Math.ceil(((t - dauNam) / 864e5 + 1) / 7)}`;
}

/** Trả danh sách tệp cần xóa: giữ bản mới nhất của 7 ngày gần nhất và của 4 tuần gần nhất. */
export function chonTepXoa(ten) {
  const ds = ten.map((t) => { const m = t.match(RE_TEP); return m && { t, d: new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) }; })
    .filter(Boolean).sort((a, b) => b.d - a.d);
  const giu = new Set();
  const ngay = new Set(), tuan = new Set();
  for (const x of ds) {
    const kNgay = x.d.toDateString();
    if (!ngay.has(kNgay) && ngay.size < GIU_NGAY) { ngay.add(kNgay); giu.add(x.t); }
    const kTuan = tuanIso(x.d);
    if (!tuan.has(kTuan) && tuan.size < GIU_TUAN) { tuan.add(kTuan); giu.add(x.t); }
  }
  return ds.filter((x) => !giu.has(x.t)).map((x) => x.t);
}

function main() {
  fs.mkdirSync(THU_MUC, { recursive: true });
  if (CHI_XEM) { console.log('Sẽ xóa:', chonTepXoa(fs.readdirSync(THU_MUC))); return; }

  const u = new URL(docDatabaseUrl());
  const env = { ...process.env, PGPASSWORD: decodeURIComponent(u.password) };
  const db = u.pathname.replace(/^\//, '');
  const dich = path.join(THU_MUC, tenTep(new Date()));
  const tam = dich + '.dang-ghi';
  const batDau = Date.now();
  const r = spawnSync(lenh('pg_dump'), ['-Fc', '-Z', '6', '-h', u.hostname, '-p', u.port || '5432', '-U', decodeURIComponent(u.username), '-d', db, '-f', tam], { env, encoding: 'utf8' });
  if (r.status !== 0) { fs.rmSync(tam, { force: true }); console.error('pg_dump lỗi:', (r.stderr || r.error?.message || '').slice(0, 2000)); process.exit(1); }

  const ls = spawnSync(lenh('pg_restore'), ['--list', tam], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const soMuc = (ls.stdout || '').split('\n').filter((d) => d && !d.startsWith(';')).length;
  if (ls.status !== 0 || soMuc < 10) { console.error(`Tệp sao lưu không đọc được (pg_restore --list: ${soMuc} mục). Giữ tệp ${tam} để xem.`); process.exit(1); }
  fs.renameSync(tam, dich);

  const mb = (fs.statSync(dich).size / 1048576).toFixed(1);
  const xoa = chonTepXoa(fs.readdirSync(THU_MUC));
  for (const t of xoa) fs.rmSync(path.join(THU_MUC, t));
  console.log(`Đã sao lưu ${path.basename(dich)}: ${mb} MB, ${soMuc} mục, ${((Date.now() - batDau) / 1000).toFixed(0)} giây. Xóa ${xoa.length} bản cũ.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPathSafe(import.meta.url))) main();
function fileURLToPathSafe(u) { return decodeURIComponent(new URL(u).pathname.replace(/^\/([A-Za-z]:)/, '$1')); }

// Gán từng từ khóa trong tat-ca-tu-khoa.csv vào trang theo docs/v2/16-quy-tac-gan-tu-khoa.json, đo tỷ lệ phủ.
// Chạy: node docs/v2/tu-khoa/gan-tu-khoa.mjs
// Đầu ra: docs/v2/tu-khoa/gan-tu-khoa.csv (từ khóa → trang) và gan-tu-khoa-bao-cao.md
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const D = path.dirname(fileURLToPath(import.meta.url));
const V2 = path.resolve(D, '..');
const quyTac = JSON.parse(fs.readFileSync(path.join(V2, '16-quy-tac-gan-tu-khoa.json'), 'utf8'))
  .map((q) => ({ ...q, khop: (q.khop ?? []).map((r) => new RegExp(r)), tru: (q.tru ?? []).map((r) => new RegExp(r)) }))
  .sort((a, b) => a.uu_tien - b.uu_tien);
const trangCsv = fs.existsSync(path.join(V2, '16-seo-trang.csv')) ? fs.readFileSync(path.join(V2, '16-seo-trang.csv'), 'utf8') : '';
const idTrang = new Set(trangCsv.split(/\r?\n/).slice(1).map((l) => l.split(',')[0].replace(/^"|"$/g, '')).filter(Boolean));

const dong = fs.readFileSync(path.join(D, 'tat-ca-tu-khoa.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean);
const kq = [];
for (const l of dong) {
  const c = l.split(',');
  const tk = c[0], vol = Number(c[1] || 0);
  let trang = null, soKhop = 0;
  for (const q of quyTac) {
    if (q.khop.some((r) => r.test(tk)) && !q.tru.some((r) => r.test(tk))) { soKhop++; if (!trang) trang = q.page_id; }
  }
  kq.push({ tk, vol, trang, soKhop });
}
fs.writeFileSync(path.join(D, 'gan-tu-khoa.csv'), 'tu_khoa,luong_tim,page_id,so_quy_tac_khop\n' + kq.map((r) => `${r.tk},${r.vol || ''},${r.trang ?? ''},${r.soKhop}`).join('\n'));

const tong = (xs) => xs.reduce((s, r) => s + r.vol, 0);
const loai = kq.filter((r) => r.trang?.startsWith('LOAI'));
const coTrang = kq.filter((r) => r.trang && !r.trang.startsWith('LOAI'));
const chua = kq.filter((r) => !r.trang);
const conLai = kq.length - loai.length;
const theoTrang = new Map();
for (const r of coTrang) { const x = theoTrang.get(r.trang) ?? { n: 0, v: 0, top: [] }; x.n++; x.v += r.vol; x.top.push(r); theoTrang.set(r.trang, x); }
const theoLoai = new Map();
for (const r of loai) { const x = theoLoai.get(r.trang) ?? { n: 0, v: 0 }; x.n++; x.v += r.vol; theoLoai.set(r.trang, x); }
const lacId = [...theoTrang.keys()].filter((id) => idTrang.size && !idTrang.has(id));
const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) + '%' : '-');

const bc = [
  '# Kết quả gán từ khóa vào trang (tự sinh)', '',
  `- Tổng từ khóa: ${kq.length}, tổng lượng ${tong(kq).toLocaleString('vi')}.`,
  `- Bị LOẠI theo định vị: ${loai.length} từ khóa, lượng ${tong(loai).toLocaleString('vi')}.`,
  `- Đã có trang: ${coTrang.length}/${conLai} từ khóa (${pct(coTrang.length, conLai)}); lượng ${tong(coTrang).toLocaleString('vi')}/${(tong(kq) - tong(loai)).toLocaleString('vi')} (**${pct(tong(coTrang), tong(kq) - tong(loai))}**).`,
  `- Chưa gán: ${chua.length} từ khóa, lượng ${tong(chua).toLocaleString('vi')}.`,
  `- Số trang nhận từ khóa: ${theoTrang.size}. page_id không có trong 16-seo-trang.csv: ${lacId.length ? lacId.join(', ') : 'không'}.`,
  `- Trang trong CSV không nhận từ khóa nào: ${[...idTrang].filter((id) => !theoTrang.has(id)).join(', ') || 'không'}.`, '',
  '## Nhóm LOẠI', '', '| nhóm | số từ khóa | lượng |', '|---|---:|---:|',
  ...[...theoLoai].sort((a, b) => b[1].v - a[1].v).map(([k, x]) => `| ${k} | ${x.n} | ${x.v.toLocaleString('vi')} |`), '',
  '## Từ khóa theo trang (top 60 theo lượng)', '', '| page_id | số từ khóa | lượng | 5 từ khóa lớn nhất |', '|---|---:|---:|---|',
  ...[...theoTrang].sort((a, b) => b[1].v - a[1].v).slice(0, 60).map(([k, x]) => `| ${k} | ${x.n} | ${x.v.toLocaleString('vi')} | ${x.top.sort((a, b) => b.vol - a.vol).slice(0, 5).map((r) => r.tk).join('; ')} |`), '',
  '## 300 từ khóa chưa gán, lượng lớn nhất', '', '| từ khóa | lượng |', '|---|---:|',
  ...chua.sort((a, b) => b.vol - a.vol).slice(0, 300).map((r) => `| ${r.tk} | ${r.vol || ''} |`), '',
  '## 100 từ khóa khớp từ 3 quy tắc trở lên (cần soát thứ tự ưu tiên)', '', '| từ khóa | lượng | trang được chọn | số quy tắc khớp |', '|---|---:|---|---:|',
  ...kq.filter((r) => r.soKhop >= 3).sort((a, b) => b.vol - a.vol).slice(0, 100).map((r) => `| ${r.tk} | ${r.vol || ''} | ${r.trang} | ${r.soKhop} |`),
];
fs.writeFileSync(path.join(D, 'gan-tu-khoa-bao-cao.md'), bc.join('\n'));
console.log(bc.slice(2, 8).join('\n'));

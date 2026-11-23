// 24 tiết khí 1900–2100 so với IMCCE (Miriade, INPOP). Tệp lấy từ repo Nhat-Nguyet (doi-chieu/du-lieu, CC BY 4.0,
// "Dữ liệu: Nhật Nguyệt (nhatnguyet.org)"), ghi sổ docs/v2/14-so-giay-phep.md.
// Trước khi sửa ΔT (23/11/2026) lệch tối đa 126 giây; sau khi sửa tối đa 15 giây.
// Chạy: npx tsx --test tests/tuvi-v2/tiet-khi-imcce.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { lietKeTietKhi } from '../../src/lib/tuvi-v2/tiet-khi.mjs';

test('Tiết khí khớp IMCCE trong 20 giây, 1900–2100', () => {
  const dong = readFileSync(new URL('./doi-chieu/imcce-tiet-khi-1900-2100.tsv', import.meta.url), 'utf8')
    .split('\n').filter((l) => /^\d{4}-/.test(l));
  assert.ok(dong.length > 4800);
  let max = 0, chiMax = '';
  for (const l of dong) {
    const [ngay, gio, kd] = l.trim().split('\t');
    const t = Date.parse(`${ngay}T${gio}Z`);
    const y = +ngay.slice(0, 4);
    const ung = [y - 1, y, y + 1].flatMap((n) => lietKeTietKhi(n)).filter((x) => x.kinhDo === +kd);
    const lech = Math.min(...ung.map((x) => Math.abs(x.thoiDiem - t))) / 1000;
    if (lech > max) { max = lech; chiMax = l.trim(); }
  }
  assert.ok(max < 20, `lệch tối đa ${max.toFixed(1)} s tại ${chiMax}`);
});

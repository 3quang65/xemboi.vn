// Kiểm thử bảo vệ bản quyền: quét toàn bộ thư mục src/ (trừ src/lib/core/ cũ),
// FAIL nếu còn bất kỳ tệp mã nguồn nào nhắc tới lich-raw hoặc doi-chieu,
// hoặc nếu các tệp Hồ Ngọc Đức cũ vẫn tồn tại trong src/lib/tuvi-v2/.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const SRC_DIR = path.join(ROOT, 'src');
const CORE_DIR = path.join(SRC_DIR, 'lib', 'core');
const MAU_DATA_DIR = path.join(SRC_DIR, 'lib', 'tuvi-v2', 'data', 'mau');

function quetTep(thuMuc, ketQua = []) {
  for (const muc of fs.readdirSync(thuMuc, { withFileTypes: true })) {
    const dayDu = path.join(thuMuc, muc.name);
    if (muc.isDirectory()) {
      if (dayDu === CORE_DIR) continue; // trừ src/lib/core cũ
      quetTep(dayDu, ketQua);
    } else if (muc.isFile()) {
      ketQua.push(dayDu);
    }
  }
  return ketQua;
}

test('[bảo vệ bản quyền] Quét toàn bộ src/ (trừ src/lib/core): không tồn tại tệp lịch cũ và không nhắc lich-raw / doi-chieu', () => {
  // 1. Bảo đảm 3 tệp Hồ Ngọc Đức đã dời hẳn ra khỏi src/lib/tuvi-v2/
  for (const tepCu of ['lich-raw.js', 'lich-raw.d.ts', 'lich.mjs']) {
    const duongDanCu = path.join(SRC_DIR, 'lib', 'tuvi-v2', tepCu);
    assert.equal(fs.existsSync(duongDanCu), false, `Tệp cũ vẫn còn trong src/: ${duongDanCu}`);
    const duongDanMoi = path.join(ROOT, 'tests', 'tuvi-v2', 'doi-chieu', tepCu);
    assert.equal(fs.existsSync(duongDanMoi), true, `Thiếu tệp đối chiếu tại: ${duongDanMoi}`);
    const dongDau = fs.readFileSync(duongDanMoi, 'utf8').split(/\r?\n/)[0];
    assert.ok(
      dongDau.includes('Mã Hồ Ngọc Đức, chỉ dùng làm đáp án so sánh trong test, cấm import vào src/.'),
      `Thiếu câu cảnh báo ở đầu ${tepCu}`,
    );
  }

  // 2. Quét toàn bộ tệp trong src/ (trừ src/lib/core cũ; riêng data/mau/*.json chỉ là dữ liệu nguồn kiểm chứng tĩnh không có import)
  const viPham = [];
  for (const tep of quetTep(SRC_DIR)) {
    const rel = path.relative(ROOT, tep).replace(/\\/g, '/');
    const noiDung = fs.readFileSync(tep, 'utf8');
    if (tep.startsWith(MAU_DATA_DIR + path.sep)) {
      if (/doi-chieu/i.test(noiDung)) viPham.push(`${rel}: nhắc tới doi-chieu`);
      continue;
    }
    if (/lich-raw|doi-chieu/i.test(noiDung)) {
      viPham.push(`${rel}: nhắc tới lich-raw hoặc doi-chieu`);
    }
  }
  assert.deepEqual(viPham, []);
});

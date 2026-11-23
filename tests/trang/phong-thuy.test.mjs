// /phong-thuy/*: cung phi, 8 du niên, 24 sơn; trích dẫn khớp nguyên văn Hiệp kỷ biện phương thư (Kanripo KR3g0051).
// Chạy: npx tsx --test tests/trang/phong-thuy.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  BAT_CUNG, DU_NIEN_8, HAI_TU_SON, TRICH, TRANG_PHONG_THUY, batPhuong, cungTheoSlug, duNienGiua, namTheoCung,
  nguyenCuaNam, phienQuai, sonTheoDo, tinhCungPhi, xetHuong,
} from '../../src/lib/trang/phong-thuy.ts';
import { duNien } from '../../src/lib/trang/xem-tuoi.ts';

const KANRIPO = process.env.KANRIPO_DIR ?? join(process.cwd(), '..', 'thu-vien-rag', 'kanripo');
const tep = (q) => join(KANRIPO, 'KR3g0051', `KR3g0051_${String(q).padStart(3, '0')}.txt`);
const sach = (q) => readFileSync(tep(q), 'utf8').replace(/<pb:[^>]*>/g, '').replace(/[¶\s]/g, '');
const boDau = (s) => s.replace(/[，。、：；]/g, '');

test('Du niên tính từ hào biến khớp bảng tay ở xem-tuoi cho cả 64 cặp', () => {
  for (const a of BAT_CUNG) for (const b of BAT_CUNG) assert.equal(duNienGiua(a.ten, b.ten).ten, duNien(a.ten, b.ten), `${a.ten}-${b.ten}`);
});

test('Phiên quái từ Càn đúng thứ tự sao trong sách; mọi cung phiên đủ 8 cung và về lại chính nó', () => {
  assert.deepEqual(phienQuai('Càn').map((x) => x.cung), ['Đoài', 'Chấn', 'Khôn', 'Khảm', 'Tốn', 'Cấn', 'Ly', 'Càn']);
  for (const c of BAT_CUNG) {
    const p = phienQuai(c.ten);
    assert.equal(new Set(p.map((x) => x.cung)).size, 8);
    assert.equal(p[7].cung, c.ten);
    // Sao và du niên đi cặp như câu 翻卦之法 và đoạn thứ tự sao.
    for (const { cung, sao } of p) assert.equal(duNienGiua(c.ten, cung).sao, sao, `${c.ten}->${cung}`);
  }
});

test('4 du niên cát là cặp cùng nhóm Đông/Tây (東西各自相配為吉)', () => {
  assert.equal(DU_NIEN_8.filter((d) => d.cat).length, 4);
  for (const a of BAT_CUNG) for (const b of BAT_CUNG) assert.equal(duNienGiua(a.ten, b.ten).cat, a.nhom === b.nhom);
  assert.deepEqual(BAT_CUNG.filter((c) => c.nhom === 'Đông').map((c) => c.ten).sort(), ['Chấn', 'Khảm', 'Ly', 'Tốn']);
});

test('Cung phi theo câu 九宫建宅: giáp tý mỗi nguyên, nam nghịch, nữ thuận', () => {
  const dau = { 1864: ['Khảm', 5], 1924: ['Tốn', 2], 1984: ['Đoài', 8] };
  for (const [y, [nam, soNu]] of Object.entries(dau)) {
    assert.equal(tinhCungPhi(+y, 'nam').ten, nam);
    assert.equal(tinhCungPhi(+y, 'nu').so, soNu);
  }
  for (let y = 1930; y < 2030; y++) {
    assert.equal((tinhCungPhi(y, 'nam').so - tinhCungPhi(y + 1, 'nam').so + 9) % 9, 1, `nam ${y}`);
    assert.equal((tinhCungPhi(y + 1, 'nu').so - tinhCungPhi(y, 'nu').so + 9) % 9, 1, `nữ ${y}`);
  }
  const g = tinhCungPhi(1968, 'nam'); // số 5 → gửi Khôn
  assert.equal(g.so, 5); assert.ok(g.guiCung); assert.equal(g.cung.ten, 'Khôn');
  assert.equal(tinhCungPhi(1990, 'nu').cung.ten, 'Cấn');
  assert.equal(tinhCungPhi(1984, 'nam').canChi, 'Giáp Tý');
  assert.equal(nguyenCuaNam(1684), 'Thượng nguyên'); assert.equal(nguyenCuaNam(1990), 'Hạ nguyên'); assert.equal(nguyenCuaNam(1983), 'Trung nguyên');
});

test('24 sơn, 8 phương và hướng/tọa', () => {
  assert.equal(HAI_TU_SON.length, 24);
  assert.equal(sonTheoDo(0), 'Tý'); assert.equal(sonTheoDo(359), 'Tý'); assert.equal(sonTheoDo(7.5), 'Quý'); assert.equal(sonTheoDo(180), 'Ngọ');
  const h = xetHuong(180); // nhà hướng Nam, tọa Bắc
  assert.equal(h.cungHuong.ten, 'Ly'); assert.equal(h.cungToa.ten, 'Khảm'); assert.equal(h.trach, 'Đông');
  assert.equal(xetHuong(225).cungToa.ten, 'Cấn');
  const phuong = batPhuong('Khảm');
  assert.deepEqual(phuong.slice(0, 4).map((p) => p.cung.phuong), ['Đông Nam', 'Đông', 'Nam', 'Bắc']);
  assert.equal(new Set(BAT_CUNG.flatMap((c) => c.son)).size, 24);
});

test('Năm sinh theo cung, slug, danh sách trang', () => {
  let tong = 0;
  for (const c of BAT_CUNG) { const n = namTheoCung(c.ten); tong += n.nam.length + n.nu.length; }
  assert.equal(tong, 2 * 101);
  assert.equal(cungTheoSlug('can-son').ten, 'Cấn');
  assert.equal(TRANG_PHONG_THUY.length, 12);
});

test('Trích dẫn khớp nguyên văn KR3g0051 (bỏ qua khi máy không có kho Kanripo)', { skip: !existsSync(tep(2)) }, () => {
  const ds = [...Object.values(TRICH), ...DU_NIEN_8.map((d) => d.trich)];
  for (const t of ds) {
    assert.ok(sach(t.quyen).includes(boDau(t.han)), t.han);
    assert.ok(t.phienAm.length > t.han.length / 2);
  }
});

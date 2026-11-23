// Lục hào nạp giáp. Chạy: npx tsx --test tests/trang/luc-hao.test.mjs
// Đã đối chiếu cả bảng an sẵn 64 quẻ của Tăng san bốc Dịch (rag_doan 23848–23853): 383/384 hào khớp;
// hào lệch duy nhất là hào đầu quẻ Khốn, bảng chép "卯" nhưng theo quy tắc nạp chi của chính sách (23854, Khảm ở trong: Dần Thìn Ngọ) là Dần.
import test from 'node:test';
import assert from 'node:assert/strict';
import { TAM_CUNG, TRICH_LUC_HAO, anQue, cungCuaQue, lucThanTheoCan, thoiGianAnQue, tuanKhong } from '../../src/lib/trang/luc-hao.ts';
import { QUE_64, queTheoSlug } from '../../src/lib/trang/kinh-dich.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

const q = (tenNgan) => QUE_64.find((x) => x.tenNgan === tenNgan);
const dong = (an) => an.hao.map((h) => `${h.lucThan} ${h.chi}${h.theUng ? ' ' + h.theUng : ''}`).reverse();

test('tám cung theo đúng thứ tự sách (23847)', () => {
  assert.equal(TAM_CUNG.length, 64);
  assert.equal(new Set(TAM_CUNG.map((x) => x.que.so)).size, 64);
  const cung = (ten) => TAM_CUNG.filter((x) => x.cung.ten === ten).map((x) => x.que.tenNgan);
  assert.deepEqual(cung('Càn'), ['Càn', 'Cấu', 'Độn', 'Bĩ', 'Quán', 'Bác', 'Tấn', 'Đại Hữu']);
  assert.deepEqual(cung('Khảm'), ['Khảm', 'Tiết', 'Truân', 'Ký Tế', 'Cách', 'Phong', 'Minh Di', 'Sư']);
  assert.deepEqual(cung('Cấn'), ['Cấn', 'Bí', 'Đại Súc', 'Tổn', 'Khuê', 'Lý', 'Trung Phu', 'Tiệm']);
  assert.deepEqual(cung('Chấn'), ['Chấn', 'Dự', 'Giải', 'Hằng', 'Thăng', 'Tỉnh', 'Đại Quá', 'Tùy']);
  assert.deepEqual(cung('Tốn'), ['Tốn', 'Tiểu Súc', 'Gia Nhân', 'Ích', 'Vô Vọng', 'Phệ Hạp', 'Di', 'Cổ']);
  assert.deepEqual(cung('Ly'), ['Ly', 'Lữ', 'Đỉnh', 'Vị Tế', 'Mông', 'Hoán', 'Tụng', 'Đồng Nhân']);
  assert.deepEqual(cung('Khôn'), ['Khôn', 'Phục', 'Lâm', 'Thái', 'Đại Tráng', 'Quải', 'Nhu', 'Tỷ']);
  assert.deepEqual(cung('Đoài'), ['Đoài', 'Khốn', 'Tụy', 'Hàm', 'Kiển', 'Khiêm', 'Tiểu Quá', 'Quy Muội']);
  assert.deepEqual(TAM_CUNG.slice(0, 8).map((x) => x.the), [6, 1, 2, 3, 4, 5, 4, 3]);
});

test('an quẻ khớp các quẻ chép trong sách', () => {
  // 23855: Càn vi Thiên
  assert.deepEqual(dong(anQue(q('Càn').hao, [])), ['Phụ mẫu Tuất Thế', 'Huynh đệ Thân', 'Quan quỷ Ngọ', 'Phụ mẫu Thìn Ứng', 'Thê tài Dần', 'Tử tôn Tý']);
  // 23854: Thiên Phong Cấu
  assert.deepEqual(dong(anQue(q('Cấu').hao, [])), ['Phụ mẫu Tuất', 'Huynh đệ Thân', 'Quan quỷ Ngọ Ứng', 'Huynh đệ Dậu', 'Tử tôn Hợi', 'Phụ mẫu Sửu Thế']);
  // 23863: Trạch Phong Đại Quá
  assert.deepEqual(dong(anQue(q('Đại Quá').hao, [])), ['Thê tài Mùi', 'Quan quỷ Dậu', 'Phụ mẫu Hợi Thế', 'Quan quỷ Dậu', 'Phụ mẫu Hợi', 'Thê tài Sửu Ứng']);
  assert.equal(cungCuaQue(q('Khốn').so).the, 1);
  assert.equal(anQue(q('Khốn').hao, []).hao[0].chi, 'Dần');
});

test('hào biến: lục thân theo cung quẻ chính (23858: Thủy Thiên Nhu biến Thiên Thủy Tụng)', () => {
  const an = anQue(q('Nhu').hao, [1, 3, 4, 6]);
  assert.equal(an.queBien.tenNgan, 'Tụng');
  assert.equal(an.cung.ten, 'Khôn');
  const b = (i) => `${an.hao[i - 1].bien.lucThan} ${an.hao[i - 1].bien.chi}`;
  assert.equal(b(6), 'Huynh đệ Tuất');
  assert.equal(b(4), 'Phụ mẫu Ngọ');
  assert.equal(b(3), 'Phụ mẫu Ngọ');
  assert.equal(b(1), 'Quan quỷ Dần');
  assert.equal(an.hao[1].bien, null);
});

test('lục thần, tuần không, nguyệt phá, lục xung, lục hợp', () => {
  // 23880: ngày Mậu Tý, Sơn Địa Bác: hào sáu Chu Tước, hào năm Thanh Long, hào bốn Huyền Vũ
  const an = anQue(q('Bác').hao, [], { canNgay: 4, chiNgay: 0, canThang: 0, chiThang: 2 });
  assert.deepEqual([an.hao[5].lucThan6, an.hao[4].lucThan6, an.hao[3].lucThan6], ['Chu Tước', 'Thanh Long', 'Huyền Vũ']);
  assert.deepEqual(lucThanTheoCan(0)[0], 'Thanh Long');
  assert.deepEqual(lucThanTheoCan(9)[0], 'Huyền Vũ');
  // 23899: Giáp Tý không Tuất Hợi; ngày Ất Mão (tuần Giáp Dần) không Tý Sửu
  assert.deepEqual(tuanKhong(0, 0), [10, 11]);
  assert.deepEqual(tuanKhong(1, 3), [0, 1]);
  assert.deepEqual(tuanKhong(0, 2), [0, 1]);
  // Tháng Dần: hào Thân bị nguyệt phá
  assert.ok(an.hao.filter((h) => h.nguyetPha).every((h) => h.chi === 'Thân'));
  // 23881: Càn là bát thuần lục xung; Bĩ là lục hợp
  assert.ok(anQue(q('Càn').hao, []).lucXung);
  assert.ok(anQue(q('Bĩ').hao, []).lucHop);
  assert.equal(QUE_64.filter((x) => anQue(x.hao, []).lucXung).length, 10);
  assert.equal(QUE_64.filter((x) => anQue(x.hao, []).lucHop).length, 8);
  // 24/11/2026 sau Lập đông: tháng Hợi
  assert.equal(thoiGianAnQue(24, 11, 2026, 10).chiThang, 11);
});

test('câu sách: có nguyên văn để đối chiếu, bản dịch không có chữ Hán', () => {
  for (const t of Object.values(TRICH_LUC_HAO)) {
    assert.ok(coChuHan(t.nguyenVan), String(t.doanId));
    assert.ok(!coChuHan(t.dich) && !coChuHan(t.viTriViet), String(t.doanId));
  }
});

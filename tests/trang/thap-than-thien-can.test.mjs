// Thập thần và 10 thiên can (Lệnh 49). Chạy: npx tsx --test tests/trang/thap-than-thien-can.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { THAP_THAN_CHI_TIET, TRICH_THAP_THAN, bangThapThan, thapThanTheoSlug } from '../../src/lib/trang/thap-than.ts';
import { THIEN_CAN_CHI_TIET, TRICH_SINH_TU_LOC, thienCanTheoSlug } from '../../src/lib/trang/thien-can.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

test('10 thập thần, slug duy nhất, mỗi thần đúng một can cho mỗi nhật chủ', () => {
  assert.equal(THAP_THAN_CHI_TIET.length, 10);
  assert.equal(new Set(THAP_THAN_CHI_TIET.map((t) => t.slug)).size, 10);
  for (const t of THAP_THAN_CHI_TIET) assert.equal(new Set(t.bang.map((r) => r.can)).size, 10, t.slug);
  const b = bangThapThan();
  for (let a = 0; a < 10; a++) assert.equal(new Set(b.o[a]).size, 10);
});

test('khớp ví dụ trong sách: Giáp gặp Tân Chính quan, Canh Thất sát, Kỷ Chính tài, Mậu Thiên tài, Đinh Thương quan, Bính Thực thần; Giáp ngày Tý tháng (Quý) Chính ấn, Nhâm Thiên ấn', () => {
  const tim = (slug) => thapThanTheoSlug(slug).bang[0].can;
  assert.equal(tim('chinh-quan'), 'Tân');
  assert.equal(tim('that-sat'), 'Canh');
  assert.equal(tim('chinh-tai'), 'Kỷ');
  assert.equal(tim('thien-tai'), 'Mậu');
  assert.equal(tim('thuong-quan'), 'Đinh');
  assert.equal(tim('thuc-than'), 'Bính');
  assert.equal(tim('chinh-an'), 'Quý');
  assert.equal(tim('thien-an'), 'Nhâm');
  assert.equal(tim('ty-kien'), 'Giáp');
  assert.equal(tim('kiep-tai'), 'Ất');
  // Ất gặp Canh là Chính quan, gặp Tân là Thất sát (sách: 乙見庚 正官, 乙見辛 偏官)
  assert.equal(thapThanTheoSlug('chinh-quan').bang[1].can, 'Canh');
  assert.equal(thapThanTheoSlug('that-sat').bang[1].can, 'Tân');
});

test('mọi mã trích tồn tại; dịch không có chữ Hán; nguyên văn có chữ Hán', () => {
  for (const t of THAP_THAN_CHI_TIET) for (const m of t.trich) assert.ok(TRICH_THAP_THAN[m], m);
  for (const tr of [...Object.values(TRICH_THAP_THAN), TRICH_SINH_TU_LOC]) {
    assert.ok(!coChuHan(tr.dich) && !coChuHan(tr.viTriViet));
    assert.ok(coChuHan(tr.nguyenVan));
  }
});

test('10 thiên can: hợp, Thất sát, sinh tử lộc, 6 hoa giáp, tứ hóa', () => {
  assert.equal(THIEN_CAN_CHI_TIET.length, 10);
  const giap = thienCanTheoSlug('giap');
  assert.deepEqual([giap.hanh, giap.amDuong, giap.hop.can, giap.hop.hoa, giap.satCuaCan], ['Mộc', 'Dương', 'Kỷ', 'Thổ', 'Canh']);
  assert.deepEqual([giap.sinh, giap.tu, giap.loc], ['Hợi', 'Ngọ', 'Dần, Mão']);
  assert.equal(giap.hoaGiap.length, 6);
  assert.equal(giap.tuHoa.sao.loc.ten, 'Liêm Trinh');
  const quy = thienCanTheoSlug('quy');
  assert.deepEqual([quy.hanh, quy.amDuong, quy.hop.can, quy.sinh], ['Thủy', 'Âm', 'Mậu', 'Mão']);
  for (const c of THIEN_CAN_CHI_TIET) {
    assert.equal(c.thapThan.length, 10);
    assert.equal(c.thapThan[c.thuTu - 1].than, 'Tỷ kiên');
  }
});

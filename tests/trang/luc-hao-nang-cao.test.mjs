// Lục hào nâng cao (dụng thần, vượng suy, nhật thần, phục thần, ứng kỳ). Chạy: npx tsx --test tests/trang/luc-hao-nang-cao.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { anQue } from '../../src/lib/trang/luc-hao.ts';
import {
  TRICH_NANG_CAO, VIEC_HOI, dungThanTheoViec, haoNangCao, nguyenKyCuu, phucThan, quanHeNgay, ungKy, vuongSuyTheoThang,
} from '../../src/lib/trang/luc-hao-nang-cao.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

// Chi: Tý 0, Sửu 1, Dần 2, Mão 3, Thìn 4, Tỵ 5, Ngọ 6, Mùi 7, Thân 8, Dậu 9, Tuất 10, Hợi 11.
const xu = (s) => {
  const v = [...s].map(Number);
  return { hao: v.map((x) => x % 2), dong: v.flatMap((x, i) => (x === 6 || x === 9 ? [i + 1] : [])) };
};

test('vượng tướng theo nguyệt kiến (23871)', () => {
  assert.deepEqual(vuongSuyTheoThang(11, 11), { muc: 'Vượng', lamNguyetKien: true, duKhi: false });
  assert.deepEqual(vuongSuyTheoThang(11, 0), { muc: 'Vượng', lamNguyetKien: false, duKhi: false });
  assert.equal(vuongSuyTheoThang(11, 3).muc, 'Tướng'); // tháng Hợi: Mộc tướng
  assert.equal(vuongSuyTheoThang(11, 8).muc, 'Hưu tù');
  assert.equal(vuongSuyTheoThang(4, 9).muc, 'Tướng'); // tháng Thìn: Kim tướng
  assert.deepEqual(vuongSuyTheoThang(7, 6), { muc: 'Hưu tù', lamNguyetKien: false, duKhi: true }); // tháng Mùi: Hỏa còn dư khí
  assert.equal(vuongSuyTheoThang(1, 0).duKhi, true); // tháng Sửu: Thủy còn dư khí
  assert.equal(vuongSuyTheoThang(4, 6).duKhi, false);
});

test('nhật thần: ám động, nhật phá (23891)', () => {
  const vuong = { muc: 'Vượng', lamNguyetKien: false, duKhi: false };
  const tu = { muc: 'Hưu tù', lamNguyetKien: false, duKhi: false };
  assert.deepEqual(quanHeNgay(8, 2, false, vuong), ['Ngày khắc', 'Ám động']);
  assert.deepEqual(quanHeNgay(8, 2, false, tu), ['Ngày khắc', 'Nhật phá']);
  assert.deepEqual(quanHeNgay(8, 2, true, tu), ['Ngày khắc', 'Ngày xung']);
  assert.deepEqual(quanHeNgay(0, 1, false, tu), ['Ngày hợp']); // ngày Tý hợp hào Sửu
  assert.deepEqual(quanHeNgay(11, 3, false, tu), ['Ngày sinh']);
  assert.deepEqual(quanHeNgay(4, 4, true, tu), ['Lâm nhật thần']);
});

test('nguyên, kỵ, cừu thần (23860)', () => {
  assert.deepEqual(nguyenKyCuu('Thê tài'), { nguyen: 'Tử tôn', ky: 'Huynh đệ', cuu: 'Phụ mẫu' });
  assert.deepEqual(nguyenKyCuu('Phụ mẫu'), { nguyen: 'Quan quỷ', ky: 'Thê tài', cuu: 'Tử tôn' });
  assert.deepEqual(nguyenKyCuu('Quan quỷ'), { nguyen: 'Thê tài', ky: 'Tử tôn', cuu: 'Huynh đệ' });
});

test('phục thần: Ký Tế thiếu Thê tài, Ngọ dưới hào 3 (khớp daogiao.io.vn)', () => {
  const { hao, dong } = xu('987678');
  const qa = anQue(hao, dong);
  assert.equal(qa.que.tenNgan, 'Ký Tế');
  const p = phucThan(qa);
  assert.equal(p.length, 1);
  assert.equal(p[0].lucThan, 'Thê tài');
  assert.equal(p[0].chi, 'Ngọ');
  assert.equal(p[0].viTri, 3);
  assert.equal(p[0].phiThan.chi, 'Hợi');
  assert.deepEqual(phucThan(anQue(xu('777777').hao, [])), []); // quẻ thuần đủ năm lục thân
});

test('ví dụ sách 23860: tháng Thìn, ngày Mậu Thân, xem bệnh cha, Càn biến Tiểu Súc', () => {
  const qa = anQue([1, 1, 1, 1, 1, 1], [4], { canNgay: 4, chiNgay: 8, canThang: 0, chiThang: 4 });
  assert.equal(qa.queBien.tenNgan, 'Tiểu Súc');
  const hao = haoNangCao(qa, 4, 8);
  const kq = dungThanTheoViec(qa, hao, 'cha-me');
  assert.deepEqual(kq.cacHao.map((h) => `${h.chi} ${h.viTri}`), ['Thìn 3', 'Tuất 6']);
  // Sách: "辰土父母臨月建，卽用辰土爲用神".
  assert.equal(kq.haoVuong, 3);
  assert.deepEqual(kq.ky.cacHao, [2]); // Thê tài Dần là kỵ thần (sách: 寅木…克辰土)
  // Sách gọi Dần bị ngày Thân xung là "暗動", dù tháng Thìn Mộc là hưu tù theo 23871; trang in theo quy tắc chương 22 (nhật phá)
  // và ghi chỗ lệch này ở docs/v2/doi-chieu/luc-hao-nang-cao.md để người duyệt xem.
  assert.deepEqual(hao[1].nhatThan, ['Ngày khắc', 'Nhật phá']);
});

test('dụng thần theo việc: hào Thế, vắng dụng thần thì lấy phục thần', () => {
  const { hao, dong } = xu('987678');
  const qa = anQue(hao, dong, { canNgay: 8, chiNgay: 2, canThang: 5, chiThang: 11 });
  const h = haoNangCao(qa, 11, 2);
  const tai = dungThanTheoViec(qa, h, 'tien-cua');
  assert.equal(tai.cacHao.length, 0);
  assert.deepEqual(tai.phuc.map((p) => p.chi), ['Ngọ']);
  assert.deepEqual(tai.nguyen.cacHao, [1]);
  assert.deepEqual(tai.ky.cacHao, [3, 6]);
  const ban = dungThanTheoViec(qa, h, 'ban-than');
  assert.deepEqual(ban.cacHao.map((x) => x.viTri), [3]);
  assert.equal(ban.lucThan, 'Huynh đệ');
  assert.equal(dungThanTheoViec(qa, h, 'khong-co'), null);
  // Nguyệt kiến mang hành dụng thần (23872): tháng Ngọ Hỏa là Thê tài của cung Khảm → lấy nguyệt kiến, không cần phục.
  assert.equal(dungThanTheoViec(qa, h, 'tien-cua', 11).nguyetKien, false);
  assert.equal(dungThanTheoViec(qa, h, 'tien-cua', 6).nguyetKien, true);
  assert.equal(dungThanTheoViec(qa, h, 'cha-me', 6).nguyetKien, false); // có hào Phụ mẫu thì không xét
  assert.equal(new Set(VIEC_HOI.map((v) => v.ma)).size, VIEC_HOI.length);
});

test('ứng kỳ (23905)', () => {
  const { hao, dong } = xu('987678');
  const qa = anQue(hao, dong, { canNgay: 8, chiNgay: 2, canThang: 5, chiThang: 11 });
  const h = haoNangCao(qa, 11, 2);
  // Hào 1 Mão động, tháng Hợi hợp? (Hợi–Dần hợp, Mão không) → động: ngày hợp Tuất hoặc ngày Mão.
  const u1 = ungKy(h[0], 11, 2);
  assert.deepEqual(u1.find((x) => x.dieuKien.startsWith('Hào động')).ngay, ['Tuất', 'Mão']);
  // Hào 6 Tý tĩnh, vượng tháng Hợi → tĩnh: ngày Tý hoặc Ngọ.
  const u6 = ungKy(h[5], 11, 2);
  assert.deepEqual(u6.map((x) => x.dieuKien), ['Hào tĩnh: chờ ngày gặp đúng chi hoặc ngày xung']);
  assert.deepEqual(u6[0].ngay, ['Tý', 'Ngọ']);
  // Hào 4 Thân Kim động, tháng Hợi hưu tù → có mốc sinh vượng (Thổ, Kim).
  const u4 = ungKy(h[3], 11, 2);
  assert.deepEqual(u4.find((x) => x.dieuKien.startsWith('Hưu tù')).ngay, ['Sửu', 'Thìn', 'Mùi', 'Tuất', 'Thân', 'Dậu']);
  // Tuần không: ngày Nhâm Dần, tuần không Thìn Tỵ; nguyệt phá tháng Hợi là Tỵ.
  const qa2 = anQue(xu('777777').hao, [], { canNgay: 8, chiNgay: 2, canThang: 5, chiThang: 11 });
  const h2 = haoNangCao(qa2, 11, 2);
  assert.ok(ungKy(h2[2], 11, 2).some((x) => x.dieuKien.startsWith('Tuần không') && x.ngay.join() === 'Thìn,Tuất'));
});

test('bản dịch không có chữ Hán', () => {
  for (const [k, t] of Object.entries(TRICH_NANG_CAO)) assert.equal(coChuHan(t.dich), false, k);
  for (const v of VIEC_HOI) assert.equal(coChuHan(v.ten), false, v.ma);
});

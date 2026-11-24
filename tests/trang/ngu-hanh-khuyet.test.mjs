// Ngũ hành khuyết theo ba cách đếm. Chạy: npx tsx --test tests/trang/ngu-hanh-khuyet.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { baCachDem, hanhVuongTheoThang, nguTrangThai, TRICH_VUONG_TUONG, TRICH_KHONG_VOI_LUAN } from '../../src/lib/trang/ngu-hanh-khuyet.ts';
import { lapLaSoBatTu } from '../../src/lib/trang/bat-tu.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

test('vượng tướng hưu tù tử đúng câu sách (23391)', () => {
  assert.deepEqual(nguTrangThai('Mộc'), { Mộc: 'Vượng', Hỏa: 'Tướng', Thủy: 'Hưu', Kim: 'Tù', Thổ: 'Tử' }); // xuân
  assert.deepEqual(nguTrangThai('Hỏa'), { Hỏa: 'Vượng', Thổ: 'Tướng', Mộc: 'Hưu', Thủy: 'Tù', Kim: 'Tử' }); // hạ
  assert.deepEqual(nguTrangThai('Thổ'), { Thổ: 'Vượng', Kim: 'Tướng', Hỏa: 'Hưu', Mộc: 'Tù', Thủy: 'Tử' }); // tháng Sáu
  assert.deepEqual(nguTrangThai('Kim'), { Kim: 'Vượng', Thủy: 'Tướng', Thổ: 'Hưu', Hỏa: 'Tù', Mộc: 'Tử' }); // thu
  assert.deepEqual(nguTrangThai('Thủy'), { Thủy: 'Vượng', Mộc: 'Tướng', Kim: 'Hưu', Thổ: 'Tù', Hỏa: 'Tử' }); // đông
});

test('hành vượng theo tháng tiết', () => {
  assert.deepEqual(hanhVuongTheoThang(7), { hanh: 'Thổ', theoMua: false }); // Mùi, tháng Sáu
  assert.deepEqual(hanhVuongTheoThang(4), { hanh: 'Mộc', theoMua: true }); // Thìn
  assert.equal(hanhVuongTheoThang(0).hanh, 'Thủy');
  assert.equal(hanhVuongTheoThang(9).hanh, 'Kim');
});

test('ba cách đếm trên một lá số: cách 2 có đủ tàng can, tổng khớp', () => {
  const ls = lapLaSoBatTu({ ngay: 10, thang: 4, nam: 1996, gio: 10, gioiTinh: 'nam' });
  const k = baCachDem(ls);
  const tong = (d) => Object.values(d).reduce((a, b) => a + b, 0);
  assert.equal(tong(k.cach1.dem), 8);
  const soTang = k.cach2.chiTiet.reduce((a, x) => a + x.tangCan.length, 0);
  assert.equal(tong(k.cach2.dem), 4 + soTang);
  // Cách 2 không bao giờ thiếu nhiều hành hơn cách 1 cộng thêm (mỗi chi có bản khí cùng hành chi).
  for (const h of k.cach2.thieu) assert.ok(k.cach1.thieu.includes(h));
  assert.equal(k.cach3.chiThang, ls.tru[1].chi);
});

test('bản dịch không có chữ Hán', () => {
  assert.equal(coChuHan(TRICH_VUONG_TUONG.dich), false);
  assert.equal(coChuHan(TRICH_KHONG_VOI_LUAN.dich), false);
});

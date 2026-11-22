// docs/v2/19 F4: xem tuổi vợ chồng, xông đất. Chạy: npx tsx --test tests/trang/xem-tuoi.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { quanHeCan, quanHeChi, quanHeNapAm, duNien, xemTuoiVoChong, goiYXongDat } from '../../src/lib/trang/xem-tuoi.ts';

test('quan hệ can, chi, nạp âm', () => {
  assert.equal(quanHeCan(0, 5).muc, 'tot'); // Giáp – Kỷ
  assert.equal(quanHeCan(0, 6).muc, 'xau'); // Giáp – Canh
  assert.equal(quanHeCan(0, 1).muc, 'binh');
  assert.equal(quanHeChi(8, 0).muc, 'tot'); // Thân – Tý tam hợp
  assert.equal(quanHeChi(0, 1).muc, 'tot'); // Tý – Sửu lục hợp
  assert.equal(quanHeChi(0, 6).muc, 'xau'); // Tý – Ngọ xung
  assert.equal(quanHeChi(0, 7).muc, 'xau'); // Tý – Mùi hại
  assert.equal(quanHeChi(0, 3).muc, 'xau'); // Tý – Mão cùng tứ hành xung
  assert.equal(quanHeChi(0, 2).muc, 'binh');
  assert.equal(quanHeNapAm('Kim', 'Thủy').muc, 'tot');
  assert.equal(quanHeNapAm('Kim', 'Mộc').muc, 'xau');
  assert.equal(quanHeNapAm('Kim', 'Kim').muc, 'binh');
});

test('du niên Bát trạch đối xứng và đúng các cặp quen thuộc', () => {
  const C = ['Càn', 'Khảm', 'Cấn', 'Chấn', 'Tốn', 'Ly', 'Khôn', 'Đoài'];
  for (const a of C) for (const b of C) assert.equal(duNien(a, b), duNien(b, a), `${a}-${b}`);
  assert.equal(duNien('Khảm', 'Tốn'), 'Sinh khí');
  assert.equal(duNien('Càn', 'Đoài'), 'Sinh khí');
  assert.equal(duNien('Ly', 'Khảm'), 'Diên niên');
  assert.equal(duNien('Càn', 'Ly'), 'Tuyệt mệnh');
});

test('vợ chồng 1990 – 1992: đủ 4 tiêu chí và đếm', () => {
  const k = xemTuoiVoChong(1990, 1992);
  assert.equal(k.chong.canChi, 'Canh Ngọ');
  assert.equal(k.vo.canChi, 'Nhâm Thân');
  assert.equal(k.tieuChi.length, 4);
  assert.equal(k.dem.tot + k.dem.binh + k.dem.xau, 4);
  // Chồng Khảm (1990 nam); vợ 1992 nữ: (1992 mod 9 = 3) + 4 = 7 → Đoài. Khảm – Đoài = Họa hại
  assert.equal(k.vo.cungPhi, 'Đoài');
  assert.equal(k.tieuChi.find((t) => t.ma === 'cung-phi').muc, 'xau');
  assert.throws(() => xemTuoiVoChong(1800, 1990), RangeError);
});

test('xông đất: chỉ gợi ý tuổi không có tiêu chí xấu, 18–70 tuổi', () => {
  const g = goiYXongDat(1985, 2027);
  assert.equal(g.namTet.canChi, 'Đinh Mùi');
  assert.ok(g.ungVien.length > 0 && g.ungVien.length <= 12);
  for (const u of g.ungVien) {
    assert.equal(u.xau, 0);
    assert.ok(u.tuoiAm >= 18 && u.tuoiAm <= 70);
    assert.ok(u.tot >= 2);
  }
});

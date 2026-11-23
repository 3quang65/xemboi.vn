// Dữ liệu trực quan cho thần số học, hướng nhà, cửu tinh (Lệnh 42).
// Chạy: npx tsx --test tests/trang/phan-truc-quan.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { batPhuong, tinhCungPhi, xetHuong } from '../../src/lib/trang/phong-thuy.ts';
import { banCuuTinh, cuuTinhNam } from '../../src/lib/trang/cuu-tinh.ts';
import { bonDinhCao } from '../../src/lib/trang/than-so-hoc.ts';
import {
  VI_TRI_LUOI_CUU_TINH, dinhCaoHienTai, docNhanhCuuTinh, docNhanhHuongNha, docNhanhThanSo, duongBay, laBanCaNhan,
} from '../../src/lib/trang/phan-truc-quan.ts';

const CAM = /hóa giải|vật phẩm|sát khí|cải vận|xui|tai họa/i;

test('thần số học 01/06/1990, năm 2026: số chủ đạo 8, năm cá nhân 8, đỉnh cao đúng chặng tuổi', () => {
  const d = { ngay: 1, thang: 6, nam: 1990 };
  const r = docNhanhThanSo(d, 2026);
  assert.equal(r.the[0].giaTri, '8');
  assert.equal(r.the[1].giaTri, '8');
  const dc = bonDinhCao(d);
  const k = r.chiSoDinhHienTai;
  assert.ok(36 >= dc[k].tuTuoi && (dc[k].denTuoi === null || 36 <= dc[k].denTuoi));
  assert.ok(r.cau.startsWith('Số chủ đạo 8; năm 2026 là năm cá nhân 8;'));
  assert.ok(!CAM.test(r.cau));
});

test('đỉnh cao hiện tại phủ mọi tuổi 0–110, không có khe', () => {
  for (const nam of [1950, 1975, 1990, 2005]) {
    const dc = bonDinhCao({ ngay: 17, thang: 9, nam });
    for (let t = 0; t <= 110; t++) {
      const k = dinhCaoHienTai(dc, t);
      assert.ok(t >= dc[k].tuTuoi && (dc[k].denTuoi === null || t <= dc[k].denTuoi), `${nam} tuổi ${t}`);
    }
  }
});

test('la bàn cá nhân: 24 sơn cách 15°, 8 quái mỗi quái 3 sơn, du niên khớp batPhuong', () => {
  const lb = laBanCaNhan('Khảm', 135);
  assert.equal(lb.son.length, 24);
  lb.son.forEach((o, i) => assert.equal(o.goc, i * 15));
  assert.equal(lb.quai.length, 8);
  for (const q of lb.quai) assert.equal(lb.son.filter((o) => o.cung.ten === q.cung.ten).length, 3);
  const bp = new Map(batPhuong('Khảm').map((x) => [x.cung.ten, x.duNien.ten]));
  for (const o of lb.son) assert.equal(o.duNien.ten, bp.get(o.cung.ten));
  const xh = xetHuong(135);
  assert.deepEqual(lb.son.filter((o) => o.laHuong).map((o) => o.son), [xh.sonHuong]);
  assert.deepEqual(lb.son.filter((o) => o.laToa).map((o) => o.son), [xh.sonToa]);
  // Tâm mỗi quái nằm đúng sơn giữa của quái.
  for (const q of lb.quai) assert.equal(lb.son.find((o) => o.goc === q.goc)?.son, q.cung.son[1], q.cung.ten);
});

test('Đọc nhanh hướng nhà: có và không có độ hướng', () => {
  const cp = tinhCungPhi(1990, 'nu');
  const a = docNhanhHuongNha(1990, 'nu');
  assert.ok(a.cau.includes(`cung phi ${cp.cung.ten}`));
  assert.equal(a.the.length, 2);
  const b = docNhanhHuongNha(1990, 'nu', 135);
  assert.equal(b.the.length, 5);
  assert.ok(b.cau.includes('Nhà hướng 135°'));
  assert.ok(!CAM.test(a.cau + b.cau + b.the.map((t) => t.chiTiet).join('')));
});

test('cửu tinh 2027: Cửu tử trung cung, Ngũ hoàng ở Bắc (khớp trang hiện có); đường bay đúng Lạc thư', () => {
  const r = docNhanhCuuTinh(2027, new Date(Date.UTC(2027, 5, 15)));
  assert.equal(r.the[0].giaTri, '9 Cửu tử');
  assert.equal(r.the[1].giaTri, 'Bắc');
  assert.equal(r.the.length, 3);
  const n = cuuTinhNam(2027);
  const db = duongBay(n.ban);
  assert.deepEqual(db.map((x) => x.so), [9, 1, 2, 3, 4, 5, 6, 7, 8]);
  // Lạc thư (Nam trên): 4 9 2 / 3 5 7 / 8 1 6 khi Ngũ hoàng trung cung.
  const ban5 = banCuuTinh(5);
  const luoi = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const c of ban5.cung) { const [h, k] = VI_TRI_LUOI_CUU_TINH[c.ten]; luoi[h][k] = c.sao.so; }
  assert.deepEqual(luoi, [[4, 9, 2], [3, 5, 7], [8, 1, 6]]);
  // Không ở năm 2027 thì không có thẻ tháng.
  assert.equal(docNhanhCuuTinh(2027, new Date(Date.UTC(2030, 5, 15))).the.length, 2);
});

test('ganRanhSon: ranh sơn ở 7,5° + 15°·k, báo đổi quái đúng', async () => {
  const { ganRanhSon } = await import('../../src/lib/trang/phan-truc-quan.ts');
  const { xetHuong } = await import('../../src/lib/trang/phong-thuy.ts');
  assert.equal(ganRanhSon(135).gan, false);
  assert.equal(ganRanhSon(135).cachDo, 7.5);
  // 113° gần ranh 112,5° giữa Thìn (105°) và Tốn (120°): cùng quái Tốn.
  const a = ganRanhSon(113);
  assert.equal(a.gan, true);
  assert.equal(a.sonKe, xetHuong(112).sonHuong);
  // 157° gần ranh 157,5° giữa Tỵ (150°, quái Tốn) và Bính (165°, quái Ly): đổi quái.
  const b = ganRanhSon(157);
  assert.equal(b.sonKe, xetHuong(158).sonHuong);
  assert.equal(b.doiQuai, true);
  assert.ok(b.cau.includes('du niên sẽ khác'));
  for (let d = 0; d < 360; d += 0.5) {
    const r = ganRanhSon(d, 15);
    assert.notEqual(r.sonKe, xetHuong(d).sonHuong, `${d}`);
    assert.ok(r.cachDo >= 0 && r.cachDo <= 7.5);
  }
});

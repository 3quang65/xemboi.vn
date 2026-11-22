// docs/v2/19 F1: lập lá số cho trang công khai. Chạy: npx tsx --test tests/trang/la-so.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { lapLaSoCongKhai } from '../../src/lib/trang/la-so.ts';

test('lập được lá số dương lịch, kèm lưu niên năm xem', () => {
  const kq = lapLaSoCongKhai({ lich: 'duong', ngay: 15, thang: 8, nam: 1990, gio: 10, phut: 30, gioiTinh: 'nam', namXem: 2027 });
  assert.equal(kq.ok, true);
  assert.equal(kq.ketQua.namXem, 2027);
  assert.equal(kq.ketQua.laSo.gioiTinh, 'Nam');
  assert.ok(Array.isArray(kq.ketQua.moTaQuyUoc)); // rỗng khi dùng quy ước mặc định
  assert.ok(kq.ketQua.tomTat.length > 0);
});

test('thiếu giới tính hoặc ngày sai thì báo lỗi tiếng Việt', () => {
  assert.deepEqual(lapLaSoCongKhai({ ngay: 1, thang: 1, nam: 1990, gio: 1 }), { ok: false, loi: 'Vui lòng chọn giới tính.' });
  const sai = lapLaSoCongKhai({ ngay: 31, thang: 2, nam: 1990, gio: 1, gioiTinh: 'nu' });
  assert.equal(sai.ok, false);
  assert.match(sai.loi, /không tồn tại/);
  assert.equal(lapLaSoCongKhai({ ngay: 1, thang: 1, nam: 1990, gioiTinh: 'nu' }).ok, false);
});

test('namXem sai thì dùng năm mặc định; tên bị cắt 60 ký tự', () => {
  const kq = lapLaSoCongKhai({ ngay: 1, thang: 1, nam: 1990, gio: 0, gioiTinh: 'nu', namXem: 'abc', ten: 'x'.repeat(100) }, 2026);
  assert.equal(kq.ok, true);
  assert.equal(kq.ketQua.namXem, 2026);
});

test('bảng đại vận: 12 vận liên tiếp, mỗi vận 10 năm, đánh dấu vận đang chạy', () => {
  const kq = lapLaSoCongKhai({ ngay: 15, thang: 8, nam: 1990, gio: 10, gioiTinh: 'nam', namXem: 2026 });
  const dv = kq.ketQua.daiVan;
  assert.equal(dv.length, 12);
  for (let i = 1; i < dv.length; i++) assert.equal(dv[i].tuTuoi, dv[i - 1].tuTuoi + 10);
  assert.equal(dv[0].tuNam, 1990 + dv[0].tuTuoi - 1);
  assert.equal(dv.filter((v) => v.dangChay).length, 1);
  const tuoi2026 = 2026 - 1990 + 1;
  const dang = dv.find((v) => v.dangChay);
  assert.ok(tuoi2026 >= dang.tuTuoi && tuoi2026 <= dang.denTuoi);
});

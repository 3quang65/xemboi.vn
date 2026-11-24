// Mai hoa Dịch số (Lệnh 51). Chạy: npx tsx --test tests/trang/mai-hoa.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { TRICH_MAI_HOA, VI_DU_SACH, phanTichMaiHoa, queMaiHoaTheoSo, queMaiHoaTheoThoiGian, quanHeVoiThe, queMaiHoaLuc } from '../../src/lib/trang/mai-hoa.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

const vd = (ma) => VI_DU_SACH.find((v) => v.ma === ma);
const lap = (v) => phanTichMaiHoa(queMaiHoaTheoThoiGian(v.chiNam, v.thang, v.ngay, v.chiGio));

test('Quán mai: Thìn năm, tháng 12, ngày 17, giờ Thân → Trạch Hỏa Cách, hào 1 động, biến Hàm, hỗ Càn Tốn; Đoài thể, Ly khắc thể, biến Cấn sinh thể', () => {
  const p = lap(vd('quan-mai'));
  assert.equal(p.ketQua.queChu.ten, 'Trạch Hỏa Cách');
  assert.deepEqual(p.ketQua.haoDong, [1]);
  assert.equal(p.ketQua.queBien.tenNgan, 'Hàm');
  assert.deepEqual([p.queHo.thuong.ten, p.queHo.ha.ten], ['Càn', 'Tốn']);
  assert.equal(p.the.ten, 'Đoài');
  assert.equal(p.dung.ten, 'Ly');
  assert.equal(p.cacQuai[0].quanHe, 'khac-the');
  assert.equal(p.bien.ten, 'Cấn');
  assert.equal(p.cacQuai.find((q) => q.vai === 'bien').quanHe, 'sinh-the');
  assert.equal(p.loiSachTheDung, 'Dụng khắc thể, mọi việc hung.');
});

test('Mẫu đơn: Tỵ năm, tháng 3, ngày 16, giờ Mão → Thiên Phong Cấu, hào 5 động, biến Đỉnh, hỗ hai lần Càn; Tốn thể, Càn khắc thể', () => {
  const p = lap(vd('mau-don'));
  assert.equal(p.ketQua.queChu.ten, 'Thiên Phong Cấu');
  assert.deepEqual(p.ketQua.haoDong, [5]);
  assert.equal(p.ketQua.queBien.tenNgan, 'Đỉnh');
  assert.deepEqual([p.queHo.thuong.ten, p.queHo.ha.ten], ['Càn', 'Càn']);
  assert.equal(p.the.ten, 'Tốn');
  assert.equal(p.dung.ten, 'Càn');
  assert.ok(p.cacQuai.slice(0, 3).every((q) => q.quanHe === 'khac-the'));
});

test('Càn, Khôn lấy hỗ của quẻ biến; lập theo số vật; quan hệ ngũ hành', () => {
  // Số 1, giờ Tý: Càn trên Càn dưới, tổng 2 → hào 2 động
  const kq = queMaiHoaTheoSo(1, 0);
  assert.equal(kq.queChu.so, 1);
  assert.deepEqual(kq.haoDong, [2]);
  const p = phanTichMaiHoa(kq);
  assert.ok(p.hoTuQueBien);
  assert.notEqual(p.queHo.so, 1);
  assert.equal(queMaiHoaTheoSo(16, 7).queChu.thuong.ten, 'Khôn');
  assert.throws(() => queMaiHoaTheoSo(0, 0));
  assert.equal(quanHeVoiThe('Kim', 'Mộc'), 'the-khac');
  assert.equal(quanHeVoiThe('Kim', 'Thổ'), 'sinh-the');
  assert.equal(quanHeVoiThe('Kim', 'Thủy'), 'the-sinh');
  assert.equal(quanHeVoiThe('Kim', 'Hỏa'), 'khac-the');
  assert.equal(quanHeVoiThe('Kim', 'Kim'), 'ty-hoa');
  assert.ok(queMaiHoaLuc(24, 11, 2026, 10).thoiDiem.startsWith('10:00 ngày 24/11/2026'));
});

test('câu sách: có nguyên văn để đối chiếu, bản dịch không có chữ Hán', () => {
  const ds = [...Object.values(TRICH_MAI_HOA), ...VI_DU_SACH.map((v) => v.trich)];
  for (const t of ds) {
    assert.ok(coChuHan(t.nguyenVan), String(t.doanId));
    assert.ok(!coChuHan(t.dich) && !coChuHan(t.viTriViet), String(t.doanId));
  }
});

test('thịnh suy theo thời lệnh (7395, 7498, 7509)', async () => {
  const { thinhSuyQuai, thinhSuyMaiHoa, phanTichMaiHoa, queMaiHoaTheoThoiGian, TRICH_MAI_HOA_THINH_SUY } = await import('../../src/lib/trang/mai-hoa.ts');
  const { BAT_QUAI } = await import('../../src/lib/trang/kinh-dich.ts');
  const { coChuHan } = await import('../../src/lib/trang/chu-viet.ts');
  const q = (t) => BAT_QUAI.find((x) => x.ten === t);
  // Xuân (Dần): Chấn thịnh, Khôn suy, Ly bình; tháng Thìn: Cấn thịnh, Khảm suy; tháng Hợi: Khảm thịnh, Ly suy.
  assert.equal(thinhSuyQuai(q('Chấn'), 2), 'Thịnh');
  assert.equal(thinhSuyQuai(q('Khôn'), 2), 'Suy');
  assert.equal(thinhSuyQuai(q('Ly'), 2), 'Bình');
  assert.equal(thinhSuyQuai(q('Cấn'), 4), 'Thịnh');
  assert.equal(thinhSuyQuai(q('Khảm'), 7), 'Suy');
  assert.equal(thinhSuyQuai(q('Ly'), 11), 'Suy');
  // Quán mai, tháng 12 (Sửu, Thổ): thể Đoài bình, dụng Ly bình, biến Cấn thịnh.
  const pt = phanTichMaiHoa(queMaiHoaTheoThoiGian(4, 12, 17, 8));
  const ts = thinhSuyMaiHoa(pt, 1, null);
  assert.deepEqual(ts.map((x) => `${x.vai} ${x.quai.ten} ${x.thang}`), ['Thể Đoài Bình', 'Dụng Ly Bình', 'Hỗ dưới Tốn Bình', 'Hỗ trên Càn Bình', 'Biến Cấn Thịnh']);
  for (const t of Object.values(TRICH_MAI_HOA_THINH_SUY)) assert.equal(coChuHan(t.dich), false);
});

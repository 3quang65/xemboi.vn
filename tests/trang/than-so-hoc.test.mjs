// /than-so-hoc/*: số chủ đạo hai cách, năm cá nhân, biểu đồ 3×3, 4 đỉnh cao, tên tiếng Việt.
// Chạy: npx tsx --test tests/trang/than-so-hoc.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BANG_CHU, DUONG_BIEU_DO, SO_CHU_DAO, TRANG_THAN_SO_HOC, bieuDoNgaySinh, bonDinhCao, docNgay, giaTriChu, namCaNhan,
  boDauTen, ngayCoNamCaNhan, rutDon, rutGon, soChuDao, soTuSlug, theoTen, thongKeSoChuDao, tongDanToi, viDuNgay, viDuTheoNam,
} from '../../src/lib/trang/than-so-hoc.ts';

test('Rút gọn giữ 11, 22, 33', () => {
  assert.deepEqual(rutGon(29).buoc, [29, 11]);
  assert.equal(rutGon(33).so, 33);
  assert.deepEqual(rutGon(38).buoc, [38, 11]);
  assert.deepEqual(rutGon(39).buoc, [39, 12, 3]);
  assert.equal(rutGon(29, []).so, 2);
});

test('Đọc ngày: hai dạng, ngày sai trả undefined', () => {
  assert.deepEqual(docNgay('1990-08-15'), { ngay: 15, thang: 8, nam: 1990 });
  assert.deepEqual(docNgay('15/08/1990'), { ngay: 15, thang: 8, nam: 1990 });
  assert.equal(docNgay('2023-02-29'), undefined);
  assert.ok(docNgay('2024-02-29'));
  assert.equal(docNgay('abc'), undefined);
  assert.equal(docNgay('1899-12-31'), undefined);
});

test('Số chủ đạo hai cách', () => {
  const a = soChuDao({ ngay: 15, thang: 8, nam: 1990 });
  assert.equal(a.cach1.tong, 33); assert.equal(a.cach1.so, 33);
  assert.deepEqual(a.cach2.phan, [6, 8, 1]); assert.equal(a.cach2.so, 6);
  assert.ok(a.khac);
  assert.equal(a.cach1.phepCong, '1 + 5 + 8 + 1 + 9 + 9 + 0 = 33');
  // Ví dụ của Taylor (1926): 4/7/1872, tháng + ngày = 11.
  const b = soChuDao({ ngay: 4, thang: 7, nam: 1872 });
  assert.equal(b.cach1.so, 11); assert.equal(b.cach2.so, 2);
  const c = soChuDao({ ngay: 1, thang: 1, nam: 2000 });
  assert.equal(c.cach1.so, 4); assert.equal(c.cach2.so, 4); assert.ok(!c.khac);
  assert.equal(soChuDao({ ngay: 29, thang: 11, nam: 1999 }).cach2.phan[0], 11);
});

test('Thống kê 1930–2030 đủ ngày, mỗi số đều có ngày theo cách 1', () => {
  const t = thongKeSoChuDao();
  assert.equal(t.tongNgay, 36890);
  const tong = (r) => Object.values(r).reduce((a, b) => a + b, 0);
  assert.equal(tong(t.cach1), t.tongNgay); assert.equal(tong(t.cach2), t.tongNgay);
  for (const s of SO_CHU_DAO) assert.ok(t.cach1[s] > 0, `số ${s}`);
  assert.equal(t.cach1[1], 0 + t.cach1[1]); // số 1 có thể có (tổng 10, 19, 28, 37)
  assert.ok(t.soNgayKhac > 0 && t.soNgayKhac < t.tongNgay);
  for (const s of SO_CHU_DAO) for (const d of viDuNgay(s, 1990)) assert.equal(soChuDao(d).cach1.so, s);
  assert.deepEqual(tongDanToi(11), [11, 29, 38, 47]);
  assert.deepEqual(tongDanToi(2), [2, 20]);
  assert.deepEqual([t.tongMin, t.tongMax], [4, 48]); // 1/1/2000 và 29/9/1999
  assert.deepEqual(tongDanToi(2, t.tongMin, t.tongMax), [20]);
  for (const s of SO_CHU_DAO) {
    const v = viDuTheoNam(s);
    assert.equal(v.length, 2, `số ${s}`);
    for (const { ds } of v) { assert.ok(ds.length > 0); for (const d of ds) assert.equal(soChuDao(d).cach1.so, s); }
  }
  assert.deepEqual(viDuTheoNam(2).map((x) => x.nam), [2000, 2001]); // 1990 không có ngày nào ra 2
});

test('Năm cá nhân 1–9, mỗi ngày-tháng thuộc đúng một số', () => {
  assert.equal(namCaNhan(15, 8, 2027).so, rutGon(1 + 5 + 8 + 2 + 0 + 2 + 7, []).so);
  let tong = 0;
  for (let n = 1; n <= 9; n++) for (const t of ngayCoNamCaNhan(n, 2027)) {
    tong += t.ngay.length;
    for (const d of t.ngay) assert.equal(namCaNhan(d, t.thang, 2027).so, n);
  }
  assert.equal(tong, 366);
});

test('Biểu đồ ngày sinh: đếm số, đường đủ, đường trống', () => {
  const b = bieuDoNgaySinh({ ngay: 15, thang: 8, nam: 1990 });
  assert.deepEqual([b.dem[1], b.dem[5], b.dem[8], b.dem[9]], [2, 1, 1, 2]);
  assert.equal(b.soKhong, 1);
  assert.deepEqual(b.thieu, [2, 3, 4, 6, 7]);
  assert.deepEqual(b.duongDay.map((l) => l.ma), ['cheo-1-5-9']);
  assert.deepEqual(b.duongTrong.map((l) => l.ma), []);
  const c = bieuDoNgaySinh({ ngay: 1, thang: 1, nam: 2000 });
  assert.ok(c.duongTrong.some((l) => l.ma === 'hang-tren'));
  assert.equal(DUONG_BIEU_DO.length, 8);
});

test('4 đỉnh cao', () => {
  const p = bonDinhCao({ ngay: 15, thang: 8, nam: 1990 }); // 6, 8, 1; số chủ đạo 33 → 6
  assert.deepEqual(p.map((x) => x.so), [5, 7, 3, 9]);
  assert.deepEqual(p.map((x) => [x.tuTuoi, x.denTuoi]), [[0, 30], [31, 39], [40, 48], [49, null]]);
});

test('Bảng chữ và tên tiếng Việt', () => {
  assert.equal(BANG_CHU.length, 9);
  assert.deepEqual(BANG_CHU[0].chu, ['A', 'J', 'S']);
  assert.deepEqual(BANG_CHU[8].chu, ['I', 'R']);
  assert.equal(giaTriChu('Z'), 8);
  const k = theoTen('Nguyễn Thị Mỹ Đức');
  assert.equal(k.chu.map((c) => c.chu).join(''), 'NGUYENTHIMYDUC');
  assert.equal(k.ten.tong, k.linhHon.tong + k.nhanCach.tong);
  assert.deepEqual(k.chu.filter((c) => c.nguyenAm).map((c) => c.chu).join(''), 'UYEIYU');
  assert.equal(k.linhHon.tong, 3 + 7 + 5 + 9 + 7 + 3);
  assert.equal(theoTen('123 !!'), undefined);
});

test('Danh sách trang và slug', () => {
  assert.equal(TRANG_THAN_SO_HOC.length, 4 + 12 + 9);
  assert.equal(soTuSlug('33', SO_CHU_DAO), 33);
  assert.equal(soTuSlug('10', SO_CHU_DAO), undefined);
  assert.equal(soTuSlug('07', SO_CHU_DAO), undefined);
});

// Ca kiểm Nhật Nguyệt (CC BY 4.0, commit 708b5c3), 600 người. Họ coi Y là phụ âm và giữ 11/22/33 ở đỉnh cao
// khi cộng chữ số thô; mình coi Y là nguyên âm và rút ngày/tháng/năm trước. Hai chỗ đó so theo quy ước.
test('Đối chiếu 600 ca Nhật Nguyệt: số chủ đạo, tên, năm cá nhân, đỉnh cao', () => {
  const { ca } = JSON.parse(readFileSync(new URL('./doi-chieu/nhat-nguyet-than-so-hoc.json', import.meta.url), 'utf8'));
  assert.equal(ca.length, 600);
  let khongY = 0;
  for (const { vao, ra } of ca) {
    const d = { ngay: vao.dd, thang: vao.mm, nam: vao.yyyy };
    const k = `${vao.hoTen} ${vao.dd}/${vao.mm}/${vao.yyyy}`;
    assert.equal(soChuDao(d).cach1.so, ra.soDuongDoi, k);
    assert.equal(namCaNhan(vao.dd, vao.mm, vao.namXem).so, ra.soNamCaNhan, k);
    const t = theoTen(vao.hoTen);
    assert.equal(t.ten.so, ra.soSuMenh, k);
    if (!/Y/i.test(boDauTen(vao.hoTen))) {
      khongY++;
      assert.equal(t.linhHon.so, ra.soLinhHon, k);
      assert.equal(t.nhanCach.so, ra.soNhanCach, k);
    }
    const dc = bonDinhCao(d), r = ra.soDinhCao;
    assert.deepEqual(dc.map((x) => rutDon(x.so)), [r.dinh1, r.dinh2, r.dinh3, r.dinh4].map(rutDon), k);
    assert.deepEqual(dc.slice(0, 3).map((x) => x.denTuoi), [r.tuoiKetThucDinh1, r.tuoiKetThucDinh2, r.tuoiKetThucDinh3], k);
  }
  assert.equal(khongY, 380);
});

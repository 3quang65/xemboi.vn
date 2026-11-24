// Bói tình yêu (khối A, C, E). Chạy: npx tsx --test tests/trang/boi-tinh-yeu.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { boiTinhYeu, gocGiuaHaiCung, nguoiTinhYeu, TEN_GOC, TRICH_GOC_CHIEU, GHI_CHU_TINH_YEU } from '../../src/lib/trang/boi-tinh-yeu.ts';
import { cungTheoThu } from '../../src/lib/trang/chiem-tinh.ts';
import { coChuHan } from '../../src/lib/trang/chu-viet.ts';

test('năm âm đổi ở Tết: sinh 20/01/1990 là tuổi Kỷ Tỵ, không phải Canh Ngọ', () => {
  const n = nguoiTinhYeu({ ngay: 20, thang: 1, nam: 1990 });
  assert.equal(n.namAm, 1989);
  assert.equal(n.chiNam, 5); // Tỵ
  assert.equal(n.truocTet, true);
  const m = nguoiTinhYeu({ ngay: 1, thang: 3, nam: 1990 });
  assert.equal(m.chiNam, 6); // Ngọ
  assert.equal(m.truocTet, false);
});

test('góc giữa hai cung theo Tetrabiblos I.XVI', () => {
  const g = (a, b) => gocGiuaHaiCung(cungTheoThu(a), cungTheoThu(b)).loai;
  assert.equal(g(0, 4), 'tam-hop'); // Bạch Dương – Sư Tử
  assert.equal(g(0, 2), 'luc-hop');
  assert.equal(g(0, 3), 'vuong');
  assert.equal(g(0, 6), 'doi-xung');
  assert.equal(g(0, 1), 'khong-chieu');
  assert.equal(g(0, 7), 'khong-chieu');
  assert.equal(g(11, 1), 'luc-hop'); // Song Ngư – Kim Ngưu, qua điểm 0
  assert.equal(g(5, 5), 'trung');
  assert.equal(TEN_GOC['tam-hop'].hoa, true);
  assert.equal(TEN_GOC.vuong.hoa, false);
});

test('hai người: Tý – Thìn tam hợp; Bạch Dương – Sư Tử cùng tam hợp, cùng dương', () => {
  // 10/04/1996 (Bính Tý, Bạch Dương) và 05/08/2000 (Canh Thìn, Sư Tử).
  const kq = boiTinhYeu({ ngay: 10, thang: 4, nam: 1996 }, { ngay: 5, thang: 8, nam: 2000 });
  assert.equal(kq.a.chiNam, 0);
  assert.equal(kq.b.chiNam, 4);
  assert.ok(kq.conGiap.quanHe.some((q) => q.loai === 'tam-hop'));
  assert.equal(kq.a.cung.cung.slug, 'bach-duong');
  assert.equal(kq.b.cung.cung.slug, 'su-tu');
  assert.equal(kq.hoangDao.goc.loai, 'tam-hop');
  assert.equal(kq.hoangDao.cungTamHop, true);
  assert.equal(kq.hoangDao.cungAmDuong, true);
  assert.equal(kq.hoangDao.chacChan, true);
  // Số chủ đạo: 1+0+4+1+9+9+6 = 30 → 3; 5+8+2+0+0+0 = 15 → 6.
  assert.equal(kq.a.soChuDao, 3);
  assert.equal(kq.b.soChuDao, 6);
  assert.ok(kq.a.tinhCam && kq.a.tinhCam.length > 20);
});

test('sinh đúng ngày đổi cung mà không nhập giờ thì chưa chắc', () => {
  // Mặt Trời vào Sư Tử khoảng 22–23/7 hằng năm; tìm ngày đổi cung trong năm 2000.
  let ngayDoi = null;
  for (let d = 20; d <= 25; d++) if (nguoiTinhYeu({ ngay: d, thang: 7, nam: 2000 }).cung.chuyen) ngayDoi = d;
  assert.ok(ngayDoi);
  const kq = boiTinhYeu({ ngay: ngayDoi, thang: 7, nam: 2000 }, { ngay: 10, thang: 4, nam: 1996 });
  assert.equal(kq.hoangDao.chacChan, false);
  const coGio = boiTinhYeu({ ngay: ngayDoi, thang: 7, nam: 2000 }, { ngay: 10, thang: 4, nam: 1996 }, 23);
  assert.equal(coGio.hoangDao.chacChan, true);
});

test('chữ hiển thị không có chữ Hán', () => {
  assert.equal(coChuHan(TRICH_GOC_CHIEU.vi), false);
  assert.equal(coChuHan(GHI_CHU_TINH_YEU), false);
  for (const g of Object.values(TEN_GOC)) assert.equal(coChuHan(g.ten), false);
});

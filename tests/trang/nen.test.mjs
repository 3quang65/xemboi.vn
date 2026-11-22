// docs/v2/19 F5: dữ liệu trang nền (nguồn, từ điển, bài viết, tháng nhuận). Chạy: npx tsx --env-file=.env --test tests/trang/nen.test.mjs
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../../src/lib/prisma.ts';
import {
  chuanHoaMang, lamSachGhiChu, danhSachNguonCongKhai, nguonTheoSlug, danhSachThuatNgu, danhSachBaiViet, bangThangNhuan,
} from '../../src/lib/trang/nen.ts';

after(() => prisma.$disconnect());

test('nhãn mảng nguồn được làm sạch', () => {
  assert.deepEqual(chuanHoaMang(['E Xem ngày', 'B Can chi (nạp âm', 'thần sát)', 'E Xem ngày', ' A Tử vi ']), ['Xem ngày', 'Can chi', 'Tử vi']);
  assert.deepEqual(chuanHoaMang([]), []);
  assert.equal(lamSachGhiChu('Minh (metadata ghi 1600)'), 'Minh (thư mục số hóa ghi 1600)');
  assert.equal(lamSachGhiChu('熊宗立 Hùng Tông Lập (metadata)'), '熊宗立 Hùng Tông Lập (theo thư mục số hóa)');
});

test('bảng tháng nhuận đúng các năm đã biết', () => {
  const b = bangThangNhuan(2017, 2033);
  const theoNam = Object.fromEntries(b.map((d) => [d.namAm, d]));
  assert.equal(theoNam[2020].thangNhuan, 4);
  assert.equal(theoNam[2020].tuNgay, '23/05/2020');
  assert.equal(theoNam[2020].denNgay, '20/06/2020');
  assert.equal(theoNam[2023].thangNhuan, 2);
  assert.equal(theoNam[2023].tuNgay, '22/03/2023');
  assert.equal(theoNam[2025].thangNhuan, 6);
  assert.equal(theoNam[2025].tuNgay, '25/07/2025');
  assert.equal(theoNam[2025].denNgay, '22/08/2025');
  assert.equal(theoNam[2033].thangNhuan, 11);
  assert.equal(theoNam[2024], undefined);
  assert.equal(theoNam[2025].thangNeuUtc7, null);
  const cu = Object.fromEntries(bangThangNhuan(1900, 1967).map((d) => [d.namAm, d]));
  assert.equal(cu[1917].thangNhuan, 2);
  assert.equal(cu[1917].thangNeuUtc7, 3);
  const ca = bangThangNhuan();
  assert.ok(ca.length > 70 && ca.length < 76, `1900–2100 có ${ca.length} năm nhuận`);
});

test('nguồn công khai: chỉ trường công khai, slug duy nhất, nhãn sạch', async () => {
  const ds = await danhSachNguonCongKhai();
  assert.ok(ds.length > 0);
  assert.equal(new Set(ds.map((n) => n.slug)).size, ds.length);
  for (const n of ds) {
    assert.ok(!('duongDanCucBo' in n) && !('phamVi' in n) && !('ghiChuPhapLy' in n));
    assert.match(n.slug, /^[a-z0-9-]+$/);
    assert.doesNotMatch(`${n.tacGia} ${n.nienDai}`, /metadata/);
    for (const m of n.mang) assert.doesNotMatch(m, /^[A-Z]\s|[()]/);
    if (n.url) assert.match(n.url, /^https?:\/\//);
  }
  assert.equal((await nguonTheoSlug(ds[0].slug))?.ma, ds[0].ma);
  assert.equal(await nguonTheoSlug('khong-co-nguon-nay'), undefined);
});

test('từ điển nhóm theo mảng, có liên kết sang trang đã có', async () => {
  const nhom = await danhSachThuatNgu();
  assert.ok(nhom.length > 0);
  const tat = nhom.flatMap((n) => n.muc);
  assert.ok(tat.length > 300);
  for (const t of tat) if (t.lienKet) assert.match(t.lienKet, /^\/[a-z0-9/-]+$/);
  assert.ok(tat.some((t) => t.lienKet?.startsWith('/tu-vi/sao/')), 'ít nhất một sao có liên kết');
});

test('danh sách bài chỉ gồm bài đã xuất bản có đường dẫn', async () => {
  const ds = await danhSachBaiViet();
  for (const b of ds) {
    assert.match(b.duongDan, /^\//);
    assert.ok(b.tieuDe);
  }
  const kt = await danhSachBaiViet('/kien-thuc');
  assert.ok(kt.every((b) => b.duongDan.startsWith('/kien-thuc')));
});

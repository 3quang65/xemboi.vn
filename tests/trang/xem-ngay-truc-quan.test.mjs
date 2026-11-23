// Xem ngày trực quan (Lệnh 41): dải 12 giờ, ngày hợp nhất theo việc, tệp .ics.
// Chạy: npx tsx --test tests/trang/xem-ngay-truc-quan.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { ngayLich } from '../../src/lib/trang/lich.ts';
import { THAN_12, chiKhoiThanhLong, ngayTheoViec, xemNgay } from '../../src/lib/trang/xem-ngay.ts';
import { chiGioVN, chonNgayHopNhat, daiGio, ketTheoViec, lichIcs, TIEU_CHI_XEP } from '../../src/lib/trang/xem-ngay-truc-quan.ts';
import { VIEC } from '../../src/lib/trang/xem-ngay.ts';

// Giờ VN -> Date UTC
const vn = (y, m, d, h, mi = 0) => new Date(Date.UTC(y, m - 1, d, h - 7, mi));

test('giờ hoàng đạo (bảng Hồ Ngọc Đức) khớp quy tắc 12 thần của Hiệp kỷ áp cho giờ', () => {
  // Hiệp kỷ: 寅申青龍起子, 卯酉起寅 … ; áp cho giờ thì lấy chi NGÀY làm mốc khởi.
  for (let d = 1; d <= 12; d++) {
    const l = ngayLich(d, 1, 2026);
    const khoi = chiKhoiThanhLong(l.canChiNgay.chi);
    l.gio.forEach((g, i) => assert.equal(g.hoangDao, THAN_12[(i - khoi + 12) % 12].hoangDao, `${l.iso} giờ ${g.chi}`));
    assert.equal(l.gioHoangDao.length, 6);
  }
});

test('chiGioVN: ranh giới giờ Tý 23:00 và giờ Sửu 01:00', () => {
  assert.equal(chiGioVN(vn(2026, 11, 24, 23, 0)), 0);
  assert.equal(chiGioVN(vn(2026, 11, 24, 0, 59)), 0);
  assert.equal(chiGioVN(vn(2026, 11, 24, 1, 0)), 1);
  assert.equal(chiGioVN(vn(2026, 11, 24, 12, 30)), 6);
  assert.equal(chiGioVN(vn(2026, 11, 24, 22, 59)), 11);
});

test('daiGio: đánh dấu giờ hiện tại và giờ đã qua chỉ khi là hôm nay', () => {
  const l = ngayLich(24, 11, 2026);
  const a = daiGio(l, vn(2026, 11, 24, 9, 15)); // giờ Tỵ
  assert.ok(a.laHomNay);
  assert.deepEqual(a.gio.filter((g) => g.hienTai).map((g) => g.chi), ['Tỵ']);
  assert.equal(a.gio.filter((g) => g.daQua).length, 5);
  const b = daiGio(l, vn(2026, 11, 25, 9, 15));
  assert.ok(!b.laHomNay && b.gio.every((g) => !g.hienTai && !g.daQua));
  const c = daiGio(l, vn(2026, 11, 24, 23, 30));
  assert.ok(c.gio.every((g) => !g.hienTai && g.daQua));
  assert.equal(a.soHoangDao, 6);
});

test('ketTheoViec trùng quy tắc ngayTheoViec cả tháng, mọi việc', () => {
  for (const ma of Object.keys(VIEC)) {
    for (const [nam, thang] of [[2026, 11], [2027, 2], [2030, 7]]) {
      for (const n of ngayTheoViec(ma, nam, thang).ngay) {
        const [y, m, d] = n.iso.split('-').map(Number);
        assert.equal(ketTheoViec(VIEC[ma], xemNgay(d, m, y)), n.ket, `${ma} ${n.iso}`);
      }
    }
  }
});

test('chonNgayHopNhat: đúng thứ tự công bố, lý do khớp dữ liệu, đếm đủ', () => {
  const tu = { ngay: 24, thang: 11, nam: 2026 };
  for (const ma of Object.keys(VIEC)) {
    const kq = chonNgayHopNhat(ma, tu, 60, 3);
    assert.equal(kq.dem.hop + kq.dem.ky + kq.dem.khac, 60);
    assert.ok(kq.chon.length <= 3 && kq.chon.length === Math.min(3, kq.dem.hop));
    assert.equal(kq.tieuChi, TIEU_CHI_XEP);
    // Mọi ngày khác "hợp" trong khoảng không được tốt hơn ngày cuối danh sách theo tiêu chí.
    const hang = (x) => [x.than.hoangDao ? 0 : 1, ['hoang', 'kha-dung'].includes(x.truc.nhom) ? 0 : x.truc.nhom === 'hac' ? 1 : 2];
    for (let i = 1; i < kq.chon.length; i++) {
      const [a, b] = [hang(kq.chon[i - 1]), hang(kq.chon[i])];
      assert.ok(a[0] < b[0] || (a[0] === b[0] && a[1] <= b[1]), `${ma}: thứ tự sai`);
    }
    for (const n of kq.chon) {
      const x = xemNgay(n.duong.ngay, n.duong.thang, n.duong.nam);
      assert.equal(ketTheoViec(VIEC[ma], x), 'hop');
      assert.ok(n.lyDo[1].includes(x.than.ten) && n.lyDo[2].includes(x.truc.ten));
      assert.ok(n.lyDo.every((s) => !/hóa giải|vật phẩm|sát khí|cải vận|\d+ ?%/.test(s)));
    }
    if (kq.chon.length) assert.ok(kq.chon[0].dauDanh && kq.chon.slice(1).every((n) => !n.dauDanh));
  }
  assert.throws(() => chonNgayHopNhat('khai-truong', tu, 0));
});

test('lichIcs: cấu trúc VCALENDAR hợp lệ, dòng gập ≤ 75 byte', () => {
  const kq = chonNgayHopNhat('khai-truong', { ngay: 24, thang: 11, nam: 2026 }, 60, 3);
  const ics = lichIcs(kq);
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.endsWith('END:VCALENDAR\r\n'));
  assert.equal((ics.match(/BEGIN:VEVENT/g) ?? []).length, kq.chon.length);
  for (const dong of ics.split('\r\n')) assert.ok(new TextEncoder().encode(dong).length <= 75, dong);
  const mo = ics.replace(/\r\n /g, '');
  for (const n of kq.chon) assert.ok(mo.includes(`DTSTART;VALUE=DATE:${n.iso.replaceAll('-', '')}`));
});

test('docNhanhNgay: câu ghép từ dữ liệu, giờ kế tiếp đúng', async () => {
  const { docNhanhNgay } = await import('../../src/lib/trang/xem-ngay-truc-quan.ts');
  const x = xemNgay(24, 11, 2026);
  const d = docNhanhNgay(x, vn(2026, 11, 24, 9, 15));
  assert.ok(d.cau.includes(x.lich.canChiNgay.ten) && d.cau.includes(x.than.ten) && d.cau.includes(x.truc.ten));
  assert.deepEqual(d.the.map((t) => t.ma), ['than', 'truc', 'nghi-ky', 'gio']);
  const gio = d.the[3];
  const tot = x.lich.gio.filter((g) => g.hoangDao);
  const toi = tot.find((g) => x.lich.gio.indexOf(g) >= 5); // giờ Tỵ = 5
  assert.equal(gio.giaTri, `${toi.chi} ${toi.khung}`);
  assert.ok(!/hóa giải|vật phẩm|sát khí|cải vận/.test(d.cau + d.the.map((t) => t.chiTiet).join('')));
});

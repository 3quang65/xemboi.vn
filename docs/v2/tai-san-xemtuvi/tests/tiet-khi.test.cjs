// Kiểm tra 24 tiết khí theo kinh độ Mặt Trời (đặt tại tests/tiet-khi.test.cjs).
// Chạy: node --test tests/tiet-khi.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');

// Nguồn: JPL DE421 qua Skyfield 1.55, kinh độ hoàng đạo biểu kiến, giờ VN (UTC+7).
const MOC = [
  { nam: 2024, ten: 'Xuân phân', vn: '2024-03-20 10:06:24' },
  { nam: 2024, ten: 'Thanh minh', vn: '2024-04-04 14:02:17' },
  { nam: 2024, ten: 'Cốc vũ', vn: '2024-04-19 20:59:45' },
  { nam: 2024, ten: 'Lập hạ', vn: '2024-05-05 07:10:05' },
  { nam: 2024, ten: 'Tiểu mãn', vn: '2024-05-20 19:59:30' },
  { nam: 2024, ten: 'Mang chủng', vn: '2024-06-05 11:09:53' },
  { nam: 2024, ten: 'Hạ chí', vn: '2024-06-21 03:50:59' },
  { nam: 2024, ten: 'Tiểu thử', vn: '2024-07-06 21:20:03' },
  { nam: 2024, ten: 'Đại thử', vn: '2024-07-22 14:44:25' },
  { nam: 2024, ten: 'Lập thu', vn: '2024-08-07 07:09:16' },
  { nam: 2024, ten: 'Xử thử', vn: '2024-08-22 21:55:02' },
  { nam: 2024, ten: 'Bạch lộ', vn: '2024-09-07 10:11:20' },
  { nam: 2024, ten: 'Thu phân', vn: '2024-09-22 19:43:39' },
  { nam: 2024, ten: 'Hàn lộ', vn: '2024-10-08 01:59:57' },
  { nam: 2024, ten: 'Sương giáng', vn: '2024-10-23 05:14:44' },
  { nam: 2024, ten: 'Lập đông', vn: '2024-11-07 05:20:04' },
  { nam: 2024, ten: 'Tiểu tuyết', vn: '2024-11-22 02:56:29' },
  { nam: 2024, ten: 'Đại tuyết', vn: '2024-12-06 22:17:02' },
  { nam: 2024, ten: 'Đông chí', vn: '2024-12-21 16:20:34' },
  { nam: 2024, ten: 'Tiểu hàn', vn: '2024-01-06 03:49:22' },
  { nam: 2024, ten: 'Đại hàn', vn: '2024-01-20 21:07:20' },
  { nam: 2024, ten: 'Lập xuân', vn: '2024-02-04 15:27:07' },
  { nam: 2024, ten: 'Vũ thủy', vn: '2024-02-19 11:13:10' },
  { nam: 2024, ten: 'Kinh trập', vn: '2024-03-05 09:22:46' },
  { nam: 2020, ten: 'Xuân phân', vn: '2020-03-20 10:49:37' },
  { nam: 2020, ten: 'Hạ chí', vn: '2020-06-21 04:43:40' },
  { nam: 2020, ten: 'Thu phân', vn: '2020-09-22 20:30:39' },
  { nam: 2020, ten: 'Đông chí', vn: '2020-12-21 17:02:20' },
  { nam: 2021, ten: 'Xuân phân', vn: '2021-03-20 16:37:28' },
  { nam: 2021, ten: 'Hạ chí', vn: '2021-06-21 10:32:09' },
  { nam: 2021, ten: 'Thu phân', vn: '2021-09-23 02:21:05' },
  { nam: 2021, ten: 'Đông chí', vn: '2021-12-21 22:59:18' },
  { nam: 2022, ten: 'Xuân phân', vn: '2022-03-20 22:33:24' },
  { nam: 2022, ten: 'Hạ chí', vn: '2022-06-21 16:13:51' },
  { nam: 2022, ten: 'Thu phân', vn: '2022-09-23 08:03:42' },
  { nam: 2022, ten: 'Đông chí', vn: '2022-12-22 04:48:13' },
  { nam: 2025, ten: 'Xuân phân', vn: '2025-03-20 16:01:28' },
  { nam: 2025, ten: 'Hạ chí', vn: '2025-06-21 09:42:15' },
  { nam: 2025, ten: 'Thu phân', vn: '2025-09-23 01:19:20' },
  { nam: 2025, ten: 'Đông chí', vn: '2025-12-21 22:03:05' },
];

const giay = (a, b) => Math.abs(new Date(a) - new Date(b)) / 1000;

test('40 mốc tiết khí 2020–2025 lệch ≤ 60 giây so JPL DE421', async () => {
  const { TIET_KHI, timMoc, dinhDangVN } = await import('../src/lib/tuvi/tiet-khi.mjs');
  let lechLonNhat = 0;
  for (const m of MOC) {
    const t = timMoc(TIET_KHI.indexOf(m.ten) * 15, m.nam);
    const lech = giay(dinhDangVN(t).replace(' ', 'T') + '+07:00', m.vn.replace(' ', 'T') + '+07:00');
    lechLonNhat = Math.max(lechLonNhat, lech);
    assert.ok(lech <= 60, `${m.nam} ${m.ten}: lệch ${lech.toFixed(1)} giây (chuẩn ${m.vn})`);
  }
  console.log(`  lệch lớn nhất: ${lechLonNhat.toFixed(1)} giây`);
});

test('Lập Xuân 2024 = 04/02 15:27 giờ Việt Nam ± 2 phút', async () => {
  const { timMoc, dinhDangVN } = await import('../src/lib/tuvi/tiet-khi.mjs');
  const s = dinhDangVN(timMoc(315, 2024));
  assert.ok(s.startsWith('2024-02-04'), s);
  assert.ok(giay(s.replace(' ', 'T') + '+07:00', '2024-02-04T15:27:00+07:00') <= 120, s);
});

test('16:27 ngày 04/02/2024 là giờ UTC+8 (Bắc Kinh), không phải giờ Việt Nam', async () => {
  const { timMoc, dinhDangMuiGio } = await import('../src/lib/tuvi/tiet-khi.mjs');
  assert.ok(dinhDangMuiGio(timMoc(315, 2024), 8).startsWith('2024-02-04 16:27'));
});

test('tietKhi trả đúng tiết khí đang hiệu lực', async () => {
  const { tietKhi } = await import('../src/lib/tuvi/tiet-khi.mjs');
  const t = tietKhi(new Date('2024-06-01T12:00:00+07:00'));
  assert.equal(t.ten, 'Tiểu mãn');
  assert.ok(t.batDau <= new Date('2024-06-01T12:00:00+07:00'));
  assert.ok(t.ketThuc > new Date('2024-06-01T12:00:00+07:00'));
  assert.equal(tietKhi(new Date('2024-01-02T12:00:00+07:00')).ten, 'Đông chí');
});

test('mỗi năm đủ 24 tiết, tăng dần, cách nhau 14–16 ngày', async () => {
  const { lietKeTietKhi } = await import('../src/lib/tuvi/tiet-khi.mjs');
  for (let nam = 2020; nam <= 2025; nam++) {
    const ds = lietKeTietKhi(nam);
    assert.equal(ds.length, 24);
    for (let i = 1; i < ds.length; i++) {
      const ngay = (ds[i].thoiDiem - ds[i - 1].thoiDiem) / 86400000;
      assert.ok(ngay > 14 && ngay < 16, `${nam} ${ds[i].ten}: ${ngay.toFixed(2)} ngày`);
    }
  }
});

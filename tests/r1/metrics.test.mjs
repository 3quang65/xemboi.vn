import test from 'node:test';
import assert from 'node:assert/strict';
import {
  danhGiaNguongR1,
  tinhPheuR1,
  wilson95,
  xuatCsvLeads,
  xuatCsvPheu,
} from '../../src/lib/r1/metrics.ts';

test('[wilson95] Khớp mốc tham chiếu 04 mục 6.2: n = 300, k = 18 (6,0%) → [3,8% – 9,3%]', () => {
  const w = wilson95(18, 300);
  assert.equal(w.successes, 18);
  assert.equal(w.total, 300);
  assert.ok(Math.abs(w.rate - 0.06) < 1e-9);
  assert.ok(Math.abs(w.lower * 100 - 3.83) < 0.1, `lower=${(w.lower * 100).toFixed(2)}%`);
  assert.ok(Math.abs(w.upper * 100 - 9.29) < 0.1, `upper=${(w.upper * 100).toFixed(2)}%`);
});

test('[wilson95] Xử lý biên an toàn: n = 0, k = 0, k = n, và k > n', () => {
  const rong = wilson95(0, 0);
  assert.deepEqual(rong, { successes: 0, total: 0, rate: 0, lower: 0, upper: 0 });

  const khong = wilson95(0, 100);
  assert.equal(khong.rate, 0);
  assert.equal(khong.lower, 0);
  assert.ok(khong.upper > 0.03 && khong.upper < 0.04);

  const dayDu = wilson95(50, 50);
  assert.equal(dayDu.rate, 1);
  assert.equal(dayDu.upper, 1);
  assert.ok(dayDu.lower > 0.92 && dayDu.lower < 0.94);

  const vuot = wilson95(120, 100);
  assert.equal(vuot.successes, 100);
  assert.equal(vuot.rate, 1);
});

test('[danhGiaNguongR1] Chấm đúng 3 mức ĐẠT / CHƯA RÕ / TRƯỢT theo 04 mục 6.2', () => {
  // ĐẠT: click >= 6.0% VÀ lead >= 2.5%
  const dat = danhGiaNguongR1({ charts: 320, clicks: 20, leads: 8 }); // 6.25%, 2.5%
  assert.equal(dat.trangThai, 'DAT');
  assert.equal(dat.duMau, true);

  // CHƯA RÕ: click >= 6% nhưng lead < 2.5%
  const chuaRoLeadThap = danhGiaNguongR1({ charts: 300, clicks: 21, leads: 5 }); // 7.0%, 1.67%
  assert.equal(chuaRoLeadThap.trangThai, 'CHUA_RO');
  assert.equal(chuaRoLeadThap.duMau, true);

  // CHƯA RÕ: click nằm trong [2.5%, 6.0%)
  const chuaRoGiua = danhGiaNguongR1({ charts: 300, clicks: 12, leads: 8 }); // 4.0%, 2.67%
  assert.equal(chuaRoGiua.trangThai, 'CHUA_RO');

  // TRƯỢT: click < 2.5%
  const truot = danhGiaNguongR1({ charts: 300, clicks: 7, leads: 4 }); // 2.33%
  assert.equal(truot.trangThai, 'TRUOT');
  assert.equal(truot.duMau, true);

  // Chưa đủ cỡ mẫu (< 300)
  const thieuMau = danhGiaNguongR1({ charts: 50, clicks: 5, leads: 2 });
  assert.equal(thieuMau.trangThai, 'DAT');
  assert.equal(thieuMau.duMau, false);
});

test('[tinhPheuR1] Tổng hợp đúng phễu theo UTM, chống trùng lặp phiên, tỷ lệ chưa rõ giờ và 79k vs 149k', () => {
  const now = new Date().toISOString();
  const mk = (id, sessionId, eventName, utmSource, coGioSinh = null) => ({
    id,
    sessionId,
    eventName,
    coGioSinh,
    utmSource,
    utmMedium: 'organic',
    utmCampaign: 'tet2027',
    createdAt: now,
  });

  const events = [
    // Phiên s1 (facebook): có giờ sinh, bấm 149k (bấm 2 lần vẫn chỉ tính 1 phiên), gửi liên hệ
    mk('1', 's1', 'xem_trang', 'facebook'),
    mk('2', 's1', 'bat_dau_form', 'facebook'),
    mk('3', 's1', 'lap_la_so', 'facebook', true),
    mk('4', 's1', 'xem_gia', 'facebook'),
    mk('5', 's1', 'bam_mua_149', 'facebook'),
    mk('6', 's1', 'bam_mua_149', 'facebook'),
    mk('7', 's1', 'gui_lien_he', 'facebook'),

    // Phiên s2 (facebook): chưa rõ giờ sinh, bấm 79k
    mk('8', 's2', 'xem_trang', 'facebook'),
    mk('9', 's2', 'bat_dau_form', 'facebook'),
    mk('10', 's2', 'lap_la_so', 'facebook', false),
    mk('11', 's2', 'xem_gia', 'facebook'),
    mk('12', 's2', 'bam_mua_79', 'facebook'),

    // Phiên s3 (facebook): bắt đầu form rồi bỏ ngang
    mk('13', 's3', 'xem_trang', 'facebook'),
    mk('14', 's3', 'bat_dau_form', 'facebook'),
    mk('15', 's3', 'bo_form', 'facebook'),

    // Phiên s4 (tiktok): có giờ sinh, không bấm mua
    mk('16', 's4', 'xem_trang', 'tiktok'),
    mk('17', 's4', 'bat_dau_form', 'tiktok'),
    mk('18', 's4', 'lap_la_so', 'tiktok', true),
    mk('19', 's4', 'xem_gia', 'tiktok'),
  ];

  const leads = [
    {
      id: 'l1',
      emailHoacZalo: 'linh@example.com',
      nutGiaDaBam: '149k',
      utmSource: 'facebook',
      utmMedium: 'organic',
      utmCampaign: 'tet2027',
      dongYLuc: now,
      hanXoa: now,
      createdAt: now,
    },
  ];

  const baoCao = tinhPheuR1(events, leads);
  assert.equal(baoCao.theoUtm.length, 2);

  // Tổng hợp: 3 lá số (2 có giờ, 1 chưa rõ), 2 bấm mua (1 nút 79k, 1 nút 149k), 1 lead, 1 bỏ form
  const t = baoCao.tongHop;
  assert.equal(t.xemTrang, 4);
  assert.equal(t.batDauForm, 4);
  assert.equal(t.boForm, 1);
  assert.equal(t.lapLaSo, 3);
  assert.equal(t.coGioSinh, 2);
  assert.equal(t.chuaRoGio, 1);
  assert.ok(Math.abs(t.tyLeChuaRoGio.rate - 1 / 3) < 1e-9);
  assert.equal(t.bamMua79, 1);
  assert.equal(t.bamMua149, 1);
  assert.equal(t.bamMuaTong, 2);
  assert.equal(t.guiLienHe, 1);
  assert.equal(t.soLeadTrongBang, 1);
  assert.ok(Math.abs(t.clickPerChart.rate - 2 / 3) < 1e-9);
  assert.ok(Math.abs(t.leadPerChart.rate - 1 / 3) < 1e-9);
  assert.equal(t.coGioBam79, 0);
  assert.equal(t.coGioBam149, 1);

  // Xuất CSV có UTF-8 BOM
  const csvPheu = xuatCsvPheu(baoCao);
  assert.ok(csvPheu.startsWith('\uFEFF'));
  assert.ok(csvPheu.includes('TỔNG CỘNG'));
  assert.ok(csvPheu.includes('facebook'));
  assert.ok(csvPheu.includes('tiktok'));

  const csvLeads = xuatCsvLeads(leads);
  assert.ok(csvLeads.startsWith('\uFEFF'));
  assert.ok(csvLeads.includes('linh@example.com'));
  assert.ok(csvLeads.includes('149k'));
});

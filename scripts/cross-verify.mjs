import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = 'd:/VibeCode/Antigravity/xemboi.vn';
const REPORT_PATH =
  'C:/Users/CUONG/.gemini/antigravity/brain/bcb9eb64-b74c-4246-b327-ffc17affe9de/scratch/cross_verify_report.json';

function createXemBoiEngine() {
  const ctx = {};
  ctx.window = ctx;
  ctx.global = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  const lichCode = fs.readFileSync(path.join(ROOT, 'src/lib/core/lich-raw.js'), 'utf8');
  const tuviCode = fs.readFileSync(path.join(ROOT, 'src/lib/core/tuvi-raw.js'), 'utf8');
  vm.runInContext(lichCode, ctx);
  vm.runInContext(tuviCode, ctx);
  return ctx;
}

const TEST_CASES = [
  {
    id: 'CASE_1_NORMAL_DATE',
    desc: 'Ngày bình thường (15/06/1990 Dương lịch, Giờ Ngọ 12h, Nam)',
    input: {
      ten: 'Nguyễn Văn An',
      ngay: 15,
      thang: 6,
      nam: 1990,
      gio: 12,
      gioiTinh: 'nam',
      lich: 'duong',
      nhuan: false,
      namXem: 2026,
    },
  },
  {
    id: 'CASE_2_LEAP_LUNAR_MONTH',
    desc: 'Ngày thuộc tháng Nhuận Âm lịch (10/04/2020 Âm lịch Nhuận -> 01/06/2020 Dương lịch, Giờ Thìn 08h, Nữ)',
    input: {
      ten: 'Trần Thị Bích',
      ngay: 10,
      thang: 4,
      nam: 2020,
      gio: 8,
      gioiTinh: 'nu',
      lich: 'am',
      nhuan: true,
      namXem: 2026,
    },
  },
  {
    id: 'CASE_3_LATE_NIGHT_TY_HOUR',
    desc: 'Sinh vào giờ Tý đêm 23h-01h (20/11/1995 Dương lịch, Giờ Tý 23h, Nam)',
    input: {
      ten: 'Lê Hoàng Nam',
      ngay: 20,
      thang: 11,
      nam: 1995,
      gio: 23,
      gioiTinh: 'nam',
      lich: 'duong',
      nhuan: false,
      namXem: 2026,
    },
  },
];

function compareCharts(xb, ctv) {
  const diffs = [];
  const check = (label, a, b) => {
    const sa = JSON.stringify(a);
    const sb = JSON.stringify(b);
    if (sa !== sb) {
      diffs.push({ field: label, xemboi: a, chotuvi: b });
    }
  };

  check('duong', xb.duong, ctv.duong);
  check('am', xb.am, ctv.am);
  check('canChi', xb.canChi, ctv.canChi);
  check('gio', xb.gio, ctv.gio);
  check('amDuong', xb.amDuong, ctv.amDuong);
  check('amDuongLy', xb.amDuongLy, ctv.amDuongLy);
  check('banMenh', xb.banMenh, ctv.banMenh);
  check('cuc', xb.cuc, ctv.cuc);
  check('cucHanh', xb.cucHanh, ctv.cucHanh);
  check('sinhKhac', xb.sinhKhac, ctv.sinhKhac);
  check('menhTai', xb.menhTai, ctv.menhTai);
  check('thanTai', xb.thanTai, ctv.thanTai);
  check('menhChu', xb.menhChu, ctv.menhChu);
  check('thanChu', xb.thanChu, ctv.thanChu);
  check('tuan', xb.tuan, ctv.tuan);
  check('triet', xb.triet, ctv.triet);

  for (let i = 0; i < 12; i++) {
    const cx = xb.cung[i];
    const cc = ctv.cung[i];
    const pName = `Cung[${i}:${cx.tenChi}]`;
    check(`${pName}.ten`, cx.ten, cc.ten);
    check(`${pName}.can`, cx.can, cc.can);
    check(`${pName}.laThan`, cx.laThan, cc.laThan);
    check(`${pName}.tuan`, cx.tuan, cc.tuan);
    check(`${pName}.triet`, cx.triet, cc.triet);
    check(`${pName}.daiVanTu`, cx.daiVanTu, cc.daiVanTu);
    check(`${pName}.trangSinh`, cx.trangSinh, cc.trangSinh);
    check(`${pName}.tieuHan`, cx.tieuHan, cc.tieuHan);
    check(`${pName}.chinhTinh`, cx.chinhTinh, cc.chinhTinh);
    check(`${pName}.catTinh`, cx.catTinh, cc.catTinh);
    check(`${pName}.hungTinh`, cx.hungTinh, cc.hungTinh);
  }

  return diffs;
}

async function runVerification() {
  console.log('=== BẮT ĐẦU KIỂM THỬ ĐỐI CHIẾU TỰ ĐỘNG (CROSS-VERIFICATION PHASE 5) ===');
  const xbEngine = createXemBoiEngine();

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  console.log('Đang kết nối tới https://www.chotuvi.com để đối chiếu trực tiếp...');
  await page.goto('https://www.chotuvi.com/', { waitUntil: 'networkidle', timeout: 30000 });

  const results = [];
  let totalDiffs = 0;

  for (const tc of TEST_CASES) {
    console.log(`\n▶ Đang chạy ${tc.id}: ${tc.desc}`);
    const xbChart = xbEngine.TuVi.anLaSo(tc.input);

    // Run on live chotuvi.com browser context AND submit DOM form
    const ctvData = await page.evaluate((inp) => {
      // 1. Direct engine call on chotuvi.com window
      const chart = window.TuVi.anLaSo(inp);

      // 2. Also drive DOM form to verify rendered DOM palaces
      const tenInput = document.querySelector('#birthForm input[name="ten"]');
      if (tenInput) tenInput.value = inp.ten;
      const gtBtn = document.querySelector(`#segGender button[data-v="${inp.gioiTinh}"]`);
      if (gtBtn) gtBtn.click();
      const calBtn = document.querySelector(`#segCal button[data-v="${inp.lich}"]`);
      if (calBtn) calBtn.click();
      const nhuanEl = document.querySelector('#birthForm input[name="nhuan"]');
      if (nhuanEl) nhuanEl.checked = Boolean(inp.nhuan);
      document.getElementById('fNam').value = String(inp.nam);
      document.getElementById('fNam').dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('fThang').value = String(inp.thang);
      document.getElementById('fThang').dispatchEvent(new Event('change', { bubbles: true }));
      document.getElementById('fNgay').value = String(inp.ngay);
      document.getElementById('fNgay').dispatchEvent(new Event('change', { bubbles: true }));
      document.getElementById('fGio').value = String(inp.gio);
      document.getElementById('fGio').dispatchEvent(new Event('change', { bubbles: true }));
      document.getElementById('btnXem').click();

      const domPalaces = Array.from(document.querySelectorAll('#chart .palace')).map((el) => ({
        chi: Number(el.getAttribute('data-chi')),
        cc: el.querySelector('.p-cc')?.textContent?.trim(),
        name: el.querySelector('.p-name')?.textContent?.trim(),
        dh: el.querySelector('.p-dh')?.textContent?.trim(),
        chinh: el.querySelector('.p-chinh')?.textContent?.trim(),
      }));

      return { chart, domPalacesCount: domPalaces.length, domPalaces };
    }, tc.input);

    const diffs = compareCharts(xbChart, ctvData.chart);
    totalDiffs += diffs.length;

    const menhPalace = xbChart.cung.find((c) => c.ten === 'Mệnh') || xbChart.cung[0];
    const thanPalace = xbChart.cung.find((c) => c.laThan) || xbChart.cung[0];
    const summary = {
      id: tc.id,
      desc: tc.desc,
      input: tc.input,
      duongLich: `${xbChart.duong.ngay}/${xbChart.duong.thang}/${xbChart.duong.nam}`,
      amLich: `${xbChart.am.ngay}/${xbChart.am.thang}${xbChart.am.nhuan ? ' (Nhuận)' : ''}/${xbChart.am.nam} (${xbChart.canChi.nam})`,
      gioCanChi: `${xbChart.gio.canChi} (${xbChart.gio.khoang})`,
      banMenh: xbChart.banMenh,
      cuc: xbChart.cuc,
      cungMenh: `${menhPalace.tenChi} (${menhPalace.chinhTinh.map((s) => `${s.ten}${s.dacTinh ? `(${s.dacTinh})` : ''}`).join(', ') || 'Vô chính diệu'})`,
      cungThan: `${thanPalace.tenChi} (${thanPalace.ten})`,
      tuan: xbChart.tuan,
      triet: xbChart.triet,
      domPalacesRendered: ctvData.domPalacesCount,
      discrepanciesCount: diffs.length,
      discrepancies: diffs,
      matched100Percent: diffs.length === 0,
    };

    results.push(summary);
    console.log(`  - Dương lịch: ${summary.duongLich} | Âm lịch: ${summary.amLich}`);
    console.log(`  - Giờ sinh: ${summary.gioCanChi} | Bản mệnh: ${summary.banMenh} | Cục: ${summary.cuc}`);
    console.log(`  - Cung Mệnh: ${summary.cungMenh} | Cung Thân: ${summary.cungThan}`);
    console.log(`  - Tuần: ${summary.tuan} | Triệt: ${summary.triet}`);
    console.log(`  - Số sai lệch (Discrepancies): ${summary.discrepanciesCount} -> ${summary.matched100Percent ? 'KHỚP 100% ✅' : 'LỆCH ❌'}`);
  }

  await browser.close();

  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify({ verifiedAt: new Date().toISOString(), totalDiffs, results }, null, 2),
    'utf8'
  );

  console.log(`\n=== KẾT QUẢ TỔNG HỢP: ${totalDiffs === 0 ? 'KHỚP TUYỆT ĐỐI 100% (0 SAI SỐ) TRÊN CẢ 3 BỘ TEST!' : `CÓ ${totalDiffs} SAI LỆCH`} ===`);
  if (totalDiffs > 0) process.exit(1);
}

runVerification().catch((err) => {
  console.error('Cross-verification error:', err);
  process.exit(1);
});

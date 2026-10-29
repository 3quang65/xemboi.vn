import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\CUONG\\.gemini\\antigravity\\brain\\bcb9eb64-b74c-4246-b327-ffc17affe9de\\scratch';

async function inspectChotuvi() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  const networkLogs = [];
  page.on('request', (req) => {
    if (req.url().includes('/api/') || req.resourceType() === 'fetch' || req.resourceType() === 'xhr') {
      networkLogs.push({
        type: 'request',
        method: req.method(),
        url: req.url(),
        postData: req.postData()
      });
    }
  });

  page.on('response', async (res) => {
    if (res.url().includes('/api/') || res.request().resourceType() === 'fetch') {
      let body = '';
      try {
        body = await res.text();
      } catch (e) {}
      networkLogs.push({
        type: 'response',
        status: res.status(),
        url: res.url(),
        body: body.slice(0, 2000)
      });
    }
  });

  console.log('1. Navigating to https://www.chotuvi.com/ ...');
  await page.goto('https://www.chotuvi.com/', { waitUntil: 'networkidle' });

  // Fill form
  console.log('2. Filling #birthForm and clicking #btnXem ...');
  await page.fill('#birthForm input[name="ten"]', 'Nguyễn Văn An');
  await page.selectOption('#fNgay', '15');
  await page.selectOption('#fThang', '6');
  await page.fill('#fNam', '1990');
  await page.selectOption('#fGio', '6'); // Giờ Ngọ (11h-13h)
  await page.click('#btnXem');

  // Wait for chart and reading to render
  await page.waitForSelector('#chart .palace', { timeout: 5000 });
  await page.waitForTimeout(2000);

  const captured = await page.evaluate(() => {
    const chartEl = document.querySelector('#chart');
    const readingEl = document.querySelector('#reading');
    const palaces = Array.from(document.querySelectorAll('#chart .palace')).map((el) => ({
      chi: el.getAttribute('data-chi'),
      className: el.className,
      style: el.getAttribute('style'),
      ariaLabel: el.getAttribute('aria-label'),
      headCC: el.querySelector('.p-cc')?.textContent,
      headName: el.querySelector('.p-name')?.textContent,
      headDH: el.querySelector('.p-dh')?.textContent,
      tags: Array.from(el.querySelectorAll('.p-tags .tag')).map(t => ({ text: t.textContent, className: t.className })),
      chinhHtml: el.querySelector('.p-chinh')?.innerHTML,
      catCol: Array.from(el.querySelectorAll('.p-cols .l > span')).map(s => ({ text: s.textContent, className: s.className })),
      hungCol: Array.from(el.querySelectorAll('.p-cols .r > span')).map(s => ({ text: s.textContent, className: s.className })),
      footLeft: el.querySelector('.p-foot span:first-child')?.textContent,
      footRight: el.querySelector('.p-foot span:last-child')?.textContent
    }));

    const centerEl = document.querySelector('#chart .center');
    const cssVars = {};
    const rootStyle = getComputedStyle(document.documentElement);
    ['--night', '--bg', '--card', '--ink', '--muted', '--line', '--red', '--gold', '--paper', '--kim', '--moc', '--thuy', '--hoa', '--tho'].forEach(v => {
      cssVars[v] = rootStyle.getPropertyValue(v).trim();
    });

    return {
      title: document.title,
      cssVars,
      palaceCount: palaces.length,
      palaces,
      centerHtml: centerEl?.innerHTML,
      readingHtmlSample: readingEl?.innerHTML?.slice(0, 2500),
      chartOuterHtmlSample: chartEl?.outerHTML?.slice(0, 3000)
    };
  });

  const fullReport = {
    inspectedAt: new Date().toISOString(),
    networkLogs,
    captured
  };

  fs.writeFileSync(path.join(outDir, 'playwright_capture.json'), JSON.stringify(fullReport, null, 2));
  console.log('3. Captured Palaces Count:', captured.palaceCount);
  console.log('4. Network Logs Count:', networkLogs.length);
  console.log('5. Sample Palace[0] (Tý):', JSON.stringify(captured.palaces[0], null, 2));

  await browser.close();
}

inspectChotuvi().catch((err) => {
  console.error('Playwright error:', err);
  process.exit(1);
});

const urls = [
  'http://localhost:3005/',
  'http://localhost:3005/la-so/la-so-tu-vi-nguyen-van-an-1990-nam-canh-ngo-d15m06y1990g12s1l0n0v2026',
  'http://localhost:3005/tu-vi-hom-nay',
  'http://localhost:3005/tu-vi-hom-nay/tuoi-ty',
  'http://localhost:3005/tu-vi-ngay-mai',
  'http://localhost:3005/tu-vi-ngay-mai/tuoi-ty',
  'http://localhost:3005/tu-vi-tron-doi',
  'http://localhost:3005/tu-vi-tron-doi/tuoi-canh-ngo',
  'http://localhost:3005/tu-tru',
  'http://localhost:3005/boi-dich',
  'http://localhost:3005/kien-thuc',
  'http://localhost:3005/admin/dashboard',
  'http://localhost:3005/admin/analytics',
  'http://localhost:3005/admin/customers',
  'http://localhost:3005/admin/agents',
  'http://localhost:3005/admin/conversations',
  'http://localhost:3005/api/cau-hinh',
  'http://localhost:3005/api/admin/analytics/overview',
  'http://localhost:3005/api/admin/customers',
  'http://localhost:3005/api/admin/agents',
];

async function checkAll() {
  console.log('=== KIỂM TRA TOÀN BỘ 20 ĐƯỜNG LINK TRẢI NGHIỆM ===');
  let failures = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const ok = res.status >= 200 && res.status < 300;
      console.log(`${ok ? '✓ 200 OK' : '✗ ' + res.status} : ${url}`);
      if (!ok) failures++;
    } catch (e) {
      console.log(`✗ ERROR : ${url} (${e.message})`);
      failures++;
    }
  }
  console.log(`\nKết quả: ${failures === 0 ? 'TẤT CẢ 20/20 ĐƯỜNG LINK HOẠT ĐỘNG HOÀN HẢO! ✅' : `CÓ ${failures} LINK LỖI ❌`}`);
  if (failures > 0) process.exit(1);
}

checkAll();

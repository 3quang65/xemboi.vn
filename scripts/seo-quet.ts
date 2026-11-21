// Quét liên kết nội bộ toàn site (docs/v2/17 mục 1.3). Trên VPS đặt cron ban đêm; ở máy trạm quét dev server.
//   npx tsx --env-file=.env scripts/seo-quet.ts [goc=http://localhost:3047] [--toi-da=10000] [--nghi=500] [--thu]
// --thu: chỉ in báo cáo, không ghi CSDL. Báo cáo lần chạy cuối lưu ở CaiDat "SEO_QUET_LAN_CUOI".
import { PrismaClient } from '@prisma/client';
import { quetSite, taiQuaHttp } from '../src/lib/seo/quet';

const thamSo = process.argv.slice(2);
const co = (ten: string) => thamSo.find((a) => a.startsWith(`--${ten}=`))?.split('=')[1];
const goc = thamSo.find((a) => !a.startsWith('--')) || 'http://localhost:3047';
const thu = thamSo.includes('--thu');

(async () => {
  const db = new PrismaClient();
  try {
    const { tai, taiSitemap } = taiQuaHttp(goc);
    const bc = await quetSite(db, {
      goc, tai, taiSitemap,
      toiDa: Number(co('toi-da') ?? 10_000),
      nghiMs: Number(co('nghi') ?? 500),
      ghi: !thu,
      log: (s) => console.log(s),
    });
    console.log(JSON.stringify(bc, null, 2));
    if (!thu) {
      await db.caiDat.upsert({ where: { khoa: 'SEO_QUET_LAN_CUOI' }, create: { khoa: 'SEO_QUET_LAN_CUOI', giaTri: { ...bc, goc } }, update: { giaTri: { ...bc, goc } } });
    }
  } finally {
    await db.$disconnect();
  }
})().catch((e) => { console.error(e); process.exit(1); });

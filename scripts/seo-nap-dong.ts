// Nạp riêng vài dòng của docs/v2/16-seo-trang.csv vào SeoTrang ở trạng thái NHAP (không tự xuất bản, xem bộ nhớ seo-nap-tu-xuat-ban).
// Dùng cả ở máy trạm và VPS khi thêm cụm trang mới. Chạy: npx tsx --env-file=.env scripts/seo-nap-dong.ts MA1 MA2 ...
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { napTrangCsv } from '../src/lib/seo/nap-cau-hinh';
async function main() {
  const ma = new Set(process.argv.slice(2));
  const dong = readFileSync('docs/v2/16-seo-trang.csv', 'utf8').split(/\r?\n/);
  const chon = dong.filter((l, i) => i === 0 || ma.has(l.match(/^"([^"]+)"/)?.[1] ?? ''));
  console.log('Nạp', chon.length - 1, 'dòng');
  const db = new PrismaClient();
  console.log(await napTrangCsv(db as any, chon.join('\n'), new Set()));
  await db.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });

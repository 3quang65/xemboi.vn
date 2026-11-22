// Sinh gợi ý liên kết theo độ gần ngữ nghĩa (nguon NGU_NGHIA, trangThai DE_XUAT). Chạy sau nhung_trang_seo.py.
//   npx tsx --env-file=.env scripts/seo-goi-y-ngu-nghia.ts [--thu] [--so=10] [--nguong=0.65] (ngưỡng cosine [GIẢ ĐỊNH])
import { PrismaClient } from '@prisma/client';
import { goiYNguNghia } from '../src/lib/seo/goi-y-ngu-nghia';

const thamSo = process.argv.slice(2);
const co = (ten: string) => thamSo.find((a) => a.startsWith(`--${ten}=`))?.split('=')[1];

(async () => {
  const db = new PrismaClient();
  try {
    const bc = await goiYNguNghia(db, { soGoiY: Number(co('so') ?? 10), nguong: Number(co('nguong') ?? 0.65), ghi: !thamSo.includes('--thu') });
    console.log(JSON.stringify(bc, null, 2));
  } finally {
    await db.$disconnect();
  }
})().catch((e) => { console.error(e); process.exit(1); });

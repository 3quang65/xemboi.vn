// Đồng bộ Google Search Console vào SeoGscNgay / SeoGscTrangNgay rồi tính cảnh báo (docs/v2/17 mục 1.5).
//   npx tsx --env-file=.env scripts/seo-gsc.ts [--tu=YYYY-MM-DD] [--den=YYYY-MM-DD] [--lan-dau] [--chi-canh-bao]
// Mặc định kéo lại 5 ngày gần nhất (Google chốt số liệu chậm 2-3 ngày). --lan-dau: kéo 16 tháng.
// Khóa tài khoản dịch vụ: env GSC_KHOA_TEP, mặc định ../may-tram/gsc-xemboi.json (NGOÀI repo). Chưa có tệp thì báo và thoát 0.
// Property: env GSC_SITE, mặc định "sc-domain:xemboi.vn". Báo cáo lần chạy cuối: CaiDat "SEO_GSC_LAN_CUOI".
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { layToken, truyVan, dongBoGsc, tinhCanhBaoGsc, ghiCanhBaoGsc, type KhoaDichVu } from '../src/lib/seo/gsc';

const thamSo = process.argv.slice(2);
const co = (ten: string) => thamSo.find((a) => a.startsWith(`--${ten}=`))?.split('=')[1];
const ngay = (d: Date) => d.toISOString().slice(0, 10);
const truNgay = (n: number) => new Date(Date.now() - n * 86_400_000);

(async () => {
  const tep = process.env.GSC_KHOA_TEP || path.resolve(process.cwd(), '..', 'may-tram', 'gsc-xemboi.json');
  const site = process.env.GSC_SITE || 'sc-domain:xemboi.vn';
  const chiCanhBao = thamSo.includes('--chi-canh-bao');
  if (!chiCanhBao && !fs.existsSync(tep)) {
    console.log(`Chưa có khóa Search Console (${tep}). Bỏ qua đồng bộ.`);
    return;
  }
  const db = new PrismaClient();
  try {
    let bc: object = {};
    if (!chiCanhBao) {
      const khoa = JSON.parse(fs.readFileSync(tep, 'utf8')) as KhoaDichVu;
      if (!khoa.client_email || !khoa.private_key) throw new Error('Tệp khóa thiếu client_email hoặc private_key');
      const token = await layToken(khoa);
      const den = co('den') ?? ngay(truNgay(2));
      const tu = co('tu') ?? (thamSo.includes('--lan-dau') ? ngay(truNgay(16 * 30)) : ngay(truNgay(6)));
      bc = await dongBoGsc(db, { site, tuNgay: tu, denNgay: den, goi: (body) => truyVan(token, site, body), log: (s) => console.log(s) });
    }
    const { moc, canhBao } = await tinhCanhBaoGsc(db);
    const ghi = await ghiCanhBaoGsc(db, canhBao);
    const kq = { ...bc, site, mocCanhBao: moc, canhBao: { tong: canhBao.length, ...ghi }, luc: new Date().toISOString() };
    console.log(JSON.stringify(kq, null, 2));
    await db.caiDat.upsert({ where: { khoa: 'SEO_GSC_LAN_CUOI' }, create: { khoa: 'SEO_GSC_LAN_CUOI', giaTri: kq }, update: { giaTri: kq } });
  } finally {
    await db.$disconnect();
  }
})().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });

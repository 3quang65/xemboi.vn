// Xuất bản vài trang SEO theo maTrang (NHAP → XUAT_BAN, bỏ noindex), kiểm từ cấm như trang quản trị.
// Chỉ chạy khi anh đã duyệt (ghi trong viec-can-anh). Dùng cả ở máy trạm và VPS.
// Chạy: npx tsx --env-file=.env scripts/seo-xuat-ban.ts MA1 MA2 ...   (thêm --thu để chỉ kiểm, không ghi)
import { PrismaClient } from '@prisma/client';
import { kiemTuCam } from '../src/lib/seo/tu-cam';

async function main() {
  const thu = process.argv.includes('--thu');
  const ma = process.argv.slice(2).filter((x) => !x.startsWith('--'));
  if (!ma.length) throw new Error('Cần ít nhất một maTrang');
  const db = new PrismaClient();
  let loi = 0;
  for (const m of ma) {
    const t = await db.seoTrang.findUnique({ where: { maTrang: m } });
    if (!t) { console.log(`${m}: không có dòng SEO`); loi++; continue; }
    if (t.duongDan.includes('{')) { console.log(`${m}: trang mẫu có {tham số}, không xuất bản trực tiếp`); loi++; continue; }
    const cam: string[] = [];
    for (const [ten, gt, pv] of [['Title', t.title, 'TIEU_DE'], ['Meta', t.metaDescription ?? '', 'META'], ['H1', t.h1 ?? '', 'H1']] as const) {
      const k = await kiemTuCam(db as any, gt, pv);
      if (k.chan) cam.push(`${ten}: ${k.viPham.filter((v) => v.xuLy === 'CHAN_CUNG').map((v) => v.cum).join(', ')}`);
    }
    if (cam.length) { console.log(`${m}: có từ cấm, bỏ qua (${cam.join('; ')})`); loi++; continue; }
    if (thu) { console.log(`${m}: ${t.duongDan} đạt, trạng thái ${t.trangThai}, noindex ${t.noindex}`); continue; }
    await db.seoTrang.update({
      where: { id: t.id },
      data: { trangThai: 'XUAT_BAN', noindex: false, ngayXuatBan: t.ngayXuatBan ?? new Date(), ngayCapNhatNoiDung: new Date() },
    });
    console.log(`${m}: đã xuất bản ${t.duongDan}`);
  }
  await db.$disconnect();
  if (loi) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });

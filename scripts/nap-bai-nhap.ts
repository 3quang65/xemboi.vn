// Nạp bài nháp markdown (docs/v2/bai-nhap/*.md) vào NoiDung ở trạng thái NHAP, nối với dòng SeoTrang.
// Không xuất bản: biên tập viên đọc và bấm xuất bản trong /quan-tri (quy trình 07 mục 3.4).
// Đầu tệp: <!-- tieuDe: … --> và <!-- tomTat: … -->; phần còn lại là thân bài markdown.
// Chạy lại được: nếu dòng SEO đã có NoiDung thì thêm phiên bản mới (số tiếp theo), không đổi trạng thái.
//   npx tsx --env-file=.env scripts/nap-bai-nhap.ts MA_TRANG docs/v2/bai-nhap/x.md [--thu]
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { kiemTuCam } from '../src/lib/seo/tu-cam';
import { coChuHan } from '../src/lib/trang/chu-viet';

async function main() {
  const thu = process.argv.includes('--thu');
  const [ma, tep] = process.argv.slice(2).filter((x) => !x.startsWith('--'));
  if (!ma || !tep) throw new Error('Cần MA_TRANG và đường dẫn tệp');
  const goc = readFileSync(tep, 'utf8').replace(/\r\n/g, '\n');
  const lay = (k: string) => new RegExp(`<!--\\s*${k}:\\s*([\\s\\S]*?)\\s*-->`).exec(goc)?.[1].trim() ?? null;
  const tieuDe = lay('tieuDe'), tomTat = lay('tomTat');
  const than = goc.replace(/<!--[\s\S]*?-->\n?/g, '').trim();
  if (!tieuDe || !than) throw new Error('Thiếu tieuDe hoặc thân bài');
  if (coChuHan(than) || coChuHan(tieuDe) || coChuHan(tomTat ?? '')) throw new Error('Bài có chữ Hán');

  const db = new PrismaClient();
  try {
    const t = await db.seoTrang.findUnique({ where: { maTrang: ma }, select: { id: true, duongDan: true, noiDungId: true, nhomSitemap: true } });
    if (!t) throw new Error(`${ma}: không có dòng SEO`);
    const k = await kiemTuCam(db as any, than, 'THAN_BAI');
    if (k.chan) throw new Error(`${ma}: có từ cấm ${k.viPham.filter((v) => v.xuLy === 'CHAN_CUNG').map((v) => v.cum).join(', ')}`);
    const soTu = than.split(/\s+/).length;
    if (thu) { console.log(`${ma}: ${t.duongDan} đạt, ${soTu} từ, ${t.noiDungId ? 'thêm phiên bản' : 'tạo mới'}`); return; }
    if (t.noiDungId) {
      const cuoi = await db.noiDungPhienBan.findFirst({ where: { noiDungId: t.noiDungId }, orderBy: { so: 'desc' }, select: { so: true } });
      await db.noiDungPhienBan.create({ data: { noiDungId: t.noiDungId, so: (cuoi?.so ?? 0) + 1, than, tomTat, nguonTao: 'TAY', ghiChu: `nạp từ ${tep}` } });
      console.log(`${ma}: thêm phiên bản ${(cuoi?.so ?? 0) + 1}`);
    } else {
      const nd = await db.noiDung.create({
        data: { loai: 'BAI', tieuDe, mang: [t.nhomSitemap], trangThai: 'NHAP', phienBan: { create: { so: 1, than, tomTat, nguonTao: 'TAY', ghiChu: `nạp từ ${tep}` } } },
      });
      await db.seoTrang.update({ where: { id: t.id }, data: { noiDungId: nd.id } });
      console.log(`${ma}: tạo NoiDung ${nd.id} (NHAP), ${soTu} từ`);
    }
  } finally {
    await db.$disconnect();
  }
}
main().catch((e) => { console.error(e.message ?? e); process.exit(1); });

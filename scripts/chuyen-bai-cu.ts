// Chuyển bài cũ sang NoiDung (docs/v2/17 mục 6.4, phần Post/Category và CMS_ARTICLES).
// - Mỗi Post (bảng cũ) và mỗi CMS_ARTICLES (mảng tĩnh v1) → NoiDung loại BAI + 1 NoiDungPhienBan nguonTao 'NHAP_CU' + SeoTrang.
// - Bài đang xuất bản → DA_XUAT_BAN nhưng SeoTrang.noindex = true cho tới khi qua quy trình duyệt (07 mục 3.4).
// - Category → nhãn `mang` (slug danh mục).
// - Chạy lại được: khóa là NoiDung.postCuId ('post:<id>' hoặc 'cms:<slug>'); dòng đã có thì bỏ qua.
// - Không xóa hay sửa bảng cũ; trang /bai-viet v1 vẫn hiển thị từ mã cũ tới khi v2 dựng trang đọc NoiDung.
//   npx tsx scripts/chuyen-bai-cu.ts [--thu]     (--thu: chỉ đếm, không ghi)
import { PrismaClient } from '@prisma/client';
import { CMS_ARTICLES } from '../src/lib/core/cms-data';

type Bai = { khoa: string; duongDan: string; tieuDe: string; tomTat: string | null; than: string; mang: string[]; daXuatBan: boolean;
  seoTitle?: string | null; seoDescription?: string | null; canonical?: string | null; jsonLd?: unknown; ngay?: Date };

async function main() {
  const thu = process.argv.includes('--thu');
  const p = new PrismaClient();
  try {
    const post = await p.post.findMany({ include: { category: { select: { slug: true } } } });
    const ds: Bai[] = [
      ...post.map((x) => ({
        khoa: `post:${x.id}`, duongDan: `/bai-viet/${x.slug}`, tieuDe: x.title, tomTat: x.excerpt, than: x.content, mang: [x.category.slug],
        daXuatBan: x.isPublished, seoTitle: x.seoTitle, seoDescription: x.seoDescription, canonical: x.canonicalUrl, jsonLd: x.schemaJsonLd, ngay: x.createdAt,
      })),
      ...CMS_ARTICLES.map((a) => ({
        khoa: `cms:${a.slug}`, duongDan: `/bai-viet/${a.slug}`, tieuDe: a.title, tomTat: a.excerpt, than: a.contentHtml.trim(), mang: [a.categorySlug],
        daXuatBan: true, ngay: new Date(a.publishedAt),
      })),
    ];
    let moi = 0, daCo = 0, trungDuong = 0;
    for (const b of ds) {
      if (await p.noiDung.findUnique({ where: { postCuId: b.khoa } })) { daCo++; continue; }
      const trang = await p.seoTrang.findUnique({ where: { duongDan: b.duongDan } });
      if (trang?.noiDungId) { trungDuong++; console.log(`  bỏ qua ${b.khoa}: ${b.duongDan} đã gắn nội dung khác`); continue; }
      moi++;
      if (thu) continue;
      await p.$transaction(async (tx) => {
        const nd = await tx.noiDung.create({
          data: { loai: 'BAI', tieuDe: b.tieuDe, mang: b.mang, trangThai: b.daXuatBan ? 'DA_XUAT_BAN' : 'BIEN_TAP', postCuId: b.khoa, ngayXuatBan: b.daXuatBan ? b.ngay : null },
        });
        const pb = await tx.noiDungPhienBan.create({
          data: { noiDungId: nd.id, so: 1, than: b.than, tomTat: b.tomTat, nguonTao: 'NHAP_CU', ghiChu: `Chuyển từ ${b.khoa} (thân là HTML của bản cũ)` },
        });
        if (b.daXuatBan) await tx.noiDung.update({ where: { id: nd.id }, data: { phienBanXuatBanId: pb.id } });
        const duLieuTrang = {
          noiDungId: nd.id, noindex: true,
          title: b.seoTitle || b.tieuDe, metaDescription: b.seoDescription || b.tomTat, h1: b.tieuDe,
          canonical: b.canonical || null, schemaJsonLd: (b.jsonLd ?? undefined) as never,
          trangThai: b.daXuatBan ? ('XUAT_BAN' as const) : ('NHAP' as const), ngayXuatBan: b.daXuatBan ? b.ngay : null,
        };
        if (trang) await tx.seoTrang.update({ where: { id: trang.id }, data: duLieuTrang });
        else await tx.seoTrang.create({ data: { ...duLieuTrang, duongDan: b.duongDan, loai: 'BAI', nhomSitemap: 'bai-viet' } });
        await tx.nhatKyThaoTac.create({ data: { hanhDong: 'nd.chuyen_bai_cu', doiTuong: 'NoiDung', doiTuongId: nd.id, sau: { khoa: b.khoa, duongDan: b.duongDan } } });
      });
    }
    console.log(`${thu ? '[THỬ] ' : ''}Post: ${post.length}, CMS_ARTICLES: ${CMS_ARTICLES.length}. Mới ${moi}, đã có ${daCo}, trùng đường dẫn ${trungDuong}.`);
  } finally {
    await p.$disconnect();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });

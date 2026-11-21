import type { Metadata } from 'next';
import Link from 'next/link';
import type { LoaiTrang, Prisma, TrangThaiTrang } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import ThongBao, { nhanTrangThai, so } from '../ThongBao';

export const metadata: Metadata = { title: 'Trang SEO' };
export const dynamic = 'force-dynamic';

const LOAI: LoaiTrang[] = ['TRANG_CHU', 'HUB', 'CONG_CU', 'TU_DIEN', 'BAI', 'NGUON', 'PHUONG_PHAP', 'SAN_PHAM', 'LICH', 'THEO_NAM', 'TAC_GIA', 'KHAC', 'LANDING'];

export default async function DanhSachTrang({ searchParams }: { searchParams: Promise<{ q?: string; loai?: string; tt?: string; bao?: string; loi?: string }> }) {
  await yeuCauQuyen('seo.xem');
  const sp = await searchParams;
  const where: Prisma.SeoTrangWhereInput = {};
  if (sp.q) where.OR = [{ duongDan: { contains: sp.q } }, { maTrang: { contains: sp.q.toUpperCase() } }, { title: { contains: sp.q, mode: 'insensitive' } }];
  if (sp.loai) where.loai = sp.loai as LoaiTrang;
  if (sp.tt) where.trangThai = sp.tt as TrangThaiTrang;
  const ds = await prisma.seoTrang.findMany({
    where, orderBy: [{ maTrang: 'asc' }],
    select: { id: true, maTrang: true, duongDan: true, loai: true, title: true, trangThai: true, noindex: true, nhomSitemap: true, mauTrangId: true, _count: { select: { tuKhoaDich: true } } },
  });
  return (
    <>
      <h1>Trang SEO</h1>
      <p className="qt-phu">{so(ds.length)} trang. Trang mẫu (đường dẫn có {'{tham số}'}) chỉ là khuôn, không vào sitemap.</p>
      <ThongBao bao={sp.bao} loi={sp.loi} />
      <form className="qt-loc" method="get">
        <input className="qt-o" name="q" defaultValue={sp.q} placeholder="Mã, đường dẫn hoặc title" />
        <select className="qt-o" name="loai" defaultValue={sp.loai ?? ''}><option value="">Mọi loại</option>{LOAI.map((l) => <option key={l}>{l}</option>)}</select>
        <select className="qt-o" name="tt" defaultValue={sp.tt ?? ''}><option value="">Mọi trạng thái</option>{['NHAP', 'XUAT_BAN', 'AN', 'DA_CHUYEN'].map((l) => <option key={l}>{l}</option>)}</select>
        <button className="qt-nut" type="submit">Lọc</button>
      </form>
      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead><tr><th>Mã</th><th>Đường dẫn</th><th>Loại</th><th>Title</th><th>Trạng thái</th><th>Sitemap</th><th className="qt-cot-so">Từ khóa</th></tr></thead>
          <tbody>
            {ds.map((t) => (
              <tr key={t.id}>
                <td><Link href={`/quan-tri/seo/trang/${t.id}`}>{t.maTrang ?? '(không mã)'}</Link></td>
                <td>{t.duongDan}{t.mauTrangId && <> <span className="qt-nhan">mẫu</span></>}</td>
                <td>{t.loai}</td>
                <td style={{ maxWidth: 360 }}>{t.title}</td>
                <td>{nhanTrangThai(t.trangThai)}{t.noindex && <> <span className="qt-nhan">noindex</span></>}</td>
                <td>{t.nhomSitemap}</td>
                <td className="qt-cot-so"><Link href={`/quan-tri/seo/tu-khoa?trang=${encodeURIComponent(t.maTrang ?? '')}`}>{so(t._count.tuKhoaDich)}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

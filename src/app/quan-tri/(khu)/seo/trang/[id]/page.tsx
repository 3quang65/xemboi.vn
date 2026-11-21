import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { kiemTuCam } from '@/lib/seo/tu-cam';
import { luuTrang } from '../../hanh-dong';
import ThongBao, { nhanTrangThai, so } from '../../ThongBao';

export const metadata: Metadata = { title: 'Sửa trang SEO' };
export const dynamic = 'force-dynamic';

const dem = (s: string | null | undefined) => (s ?? '').length;

export default async function SuaTrang({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ bao?: string; loi?: string }> }) {
  const nd = await yeuCauQuyen('seo.xem');
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const t = await prisma.seoTrang.findUnique({ where: { id }, include: { mauTrang: { select: { ma: true, mauDuongDan: true } } } });
  if (!t) notFound();
  const sua = coQuyen(nd.vaiTro, 'seo.sua');
  const [tuKhoa, chuyenDen, camTitle, camMeta, camH1] = await Promise.all([
    prisma.seoTuKhoa.findMany({ where: { trangDichId: id }, orderBy: { luongTim: { sort: 'desc', nulls: 'last' } }, take: 30, select: { chuoi: true, luongTim: true, cachGan: true } }),
    prisma.seoChuyenHuong.findMany({ where: { denUrl: t.duongDan }, select: { tuMien: true, tuDuongDan: true, ma: true, batTat: true } }),
    kiemTuCam(prisma, t.title, 'TIEU_DE'), kiemTuCam(prisma, t.metaDescription ?? '', 'META'), kiemTuCam(prisma, t.h1 ?? '', 'H1'),
  ]);
  const cam = [...camTitle.viPham, ...camMeta.viPham, ...camH1.viPham];
  const tongTk = await prisma.seoTuKhoa.aggregate({ where: { trangDichId: id }, _count: true, _sum: { luongTim: true } });

  return (
    <>
      <p className="qt-phu"><Link href="/quan-tri/seo/trang">← Danh sách trang</Link></p>
      <h1>{t.maTrang ?? t.duongDan}</h1>
      <p className="qt-phu">{t.loai} · {nhanTrangThai(t.trangThai)} · sitemap “{t.nhomSitemap}”{t.mauTrang && <> · mẫu {t.mauTrang.ma}</>}{t.ghiDeMau && <> · đã sửa tay (nạp lại từ 16 không ghi đè)</>}</p>
      <ThongBao bao={sp.bao} loi={sp.loi} />
      {cam.length > 0 && <div className="qt-bao loi">Có từ cấm: {cam.map((v) => `“${v.cum}” (${v.xuLy}${v.thayBang ? ` → ${v.thayBang}` : ''})`).join(', ')}</div>}
      <form className="qt-the" action={luuTrang} style={{ display: 'grid', gap: 10, maxWidth: 760 }}>
        <input type="hidden" name="id" value={t.id} />
        <fieldset disabled={!sua} style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          <label style={{ display: 'grid', gap: 4 }}>Đường dẫn {t.trangThai === 'XUAT_BAN' && <small style={{ color: 'var(--muted)' }}>Đổi đường dẫn của trang đã xuất bản sẽ tự tạo 301 từ đường cũ.</small>}
            <input className="qt-o" name="duongDan" defaultValue={t.duongDan} required />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>Title <small style={{ color: 'var(--muted)' }}>{dem(t.title)} ký tự (nên 50–60)</small>
            <input className="qt-o" name="title" defaultValue={t.title} required maxLength={200} />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>Meta description <small style={{ color: 'var(--muted)' }}>{dem(t.metaDescription)} ký tự (nên 120–160)</small>
            <textarea className="qt-o" name="metaDescription" defaultValue={t.metaDescription ?? ''} rows={3} maxLength={400} />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>H1<input className="qt-o" name="h1" defaultValue={t.h1 ?? ''} maxLength={200} /></label>
          <label style={{ display: 'grid', gap: 4 }}>Canonical (để trống = chính nó)<input className="qt-o" name="canonical" defaultValue={t.canonical ?? ''} placeholder="/duong-dan hoặc https://xemboi.vn/..." /></label>
          <div className="qt-loc">
            <label>Trạng thái{' '}
              <select className="qt-o" name="trangThai" defaultValue={t.trangThai}>
                <option value="NHAP">Nháp</option><option value="XUAT_BAN">Xuất bản</option><option value="AN">Ẩn</option><option value="DA_CHUYEN">Đã chuyển</option>
              </select>
            </label>
            <label><input type="checkbox" name="noindex" defaultChecked={t.noindex} /> noindex</label>
          </div>
          {sua && <div><button className="qt-nut" type="submit">Lưu</button></div>}
        </fieldset>
      </form>
      <div className="qt-the">
        <h2>Từ khóa đích: {so(tongTk._count)} từ, {so(tongTk._sum.luongTim)} lượt/tháng</h2>
        <table className="qt-bang">
          <tbody>{tuKhoa.map((k) => <tr key={k.chuoi}><td>{k.chuoi}{k.cachGan === 'TAY' && <> <span className="qt-nhan vua">tay</span></>}</td><td className="qt-cot-so">{so(k.luongTim)}</td></tr>)}</tbody>
        </table>
        {tongTk._count > 30 && <p><Link href={`/quan-tri/seo/tu-khoa?trang=${encodeURIComponent(t.maTrang ?? '')}`}>Xem đủ {so(tongTk._count)} từ khóa →</Link></p>}
      </div>
      {chuyenDen.length > 0 && (
        <div className="qt-the">
          <h2>Chuyển hướng về trang này</h2>
          <ul>{chuyenDen.map((c) => <li key={c.tuMien + c.tuDuongDan}>{c.tuMien}{c.tuDuongDan} ({c.ma}){!c.batTat && ' (đang tắt)'}</li>)}</ul>
        </div>
      )}
    </>
  );
}

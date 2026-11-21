import type { Metadata } from 'next';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { batTatChuyenHuong, themChuyenHuong } from '../hanh-dong';
import ThongBao, { so } from '../ThongBao';

export const metadata: Metadata = { title: 'Chuyển hướng' };
export const dynamic = 'force-dynamic';

export default async function ChuyenHuong({ searchParams }: { searchParams: Promise<{ q?: string; nguon?: string; bao?: string; loi?: string }> }) {
  const nd = await yeuCauQuyen('seo.xem');
  const sp = await searchParams;
  const sua = coQuyen(nd.vaiTro, 'seo.redirect');
  const tenMien = coQuyen(nd.vaiTro, 'seo.redirect_ten_mien');
  const where: Prisma.SeoChuyenHuongWhereInput = {};
  if (sp.q) where.OR = [{ tuDuongDan: { contains: sp.q } }, { denUrl: { contains: sp.q } }];
  if (sp.nguon) where.nguon = sp.nguon;
  const ds = await prisma.seoChuyenHuong.findMany({ where, orderBy: [{ taoLuc: 'desc' }], take: 500 });
  return (
    <>
      <h1>Chuyển hướng</h1>
      <p className="qt-phu">Phục vụ ngay ở middleware; sửa xong có hiệu lực trong vòng 60 giây. Đổi đường dẫn trang đã xuất bản tự tạo 301 (nguồn DOI_SLUG).</p>
      <ThongBao bao={sp.bao} loi={sp.loi} />
      {sua && (
        <form className="qt-the" action={themChuyenHuong} style={{ display: 'grid', gap: 8 }}>
          <h2>Thêm hoặc sửa</h2>
          <div className="qt-loc">
            {tenMien ? <input className="qt-o" name="tuMien" defaultValue="xemboi.vn" aria-label="Tên miền nguồn" style={{ width: 130 }} /> : <input type="hidden" name="tuMien" value="xemboi.vn" />}
            <input className="qt-o" name="tuDuongDan" placeholder="/duong-cu" required aria-label="Đường dẫn nguồn" style={{ minWidth: 220 }} />
            <span>→</span>
            <input className="qt-o" name="denUrl" placeholder="/duong-moi" required aria-label="Đích" style={{ minWidth: 220 }} />
            <select className="qt-o" name="ma" defaultValue="301" aria-label="Mã HTTP"><option>301</option><option>308</option><option>302</option><option>307</option><option>410</option></select>
            <label><input type="checkbox" name="laBieuThuc" /> biểu thức ($1…; $1:2 = đệm 2 chữ số)</label>
          </div>
          <input className="qt-o" name="ghiChu" placeholder="Ghi chú (không bắt buộc)" />
          <div><button className="qt-nut" type="submit">Lưu</button></div>
        </form>
      )}
      <form className="qt-loc" method="get">
        <input className="qt-o" name="q" defaultValue={sp.q} placeholder="Tìm đường dẫn" />
        <select className="qt-o" name="nguon" defaultValue={sp.nguon ?? ''}><option value="">Mọi nguồn</option>{['TAY', 'DOI_SLUG', 'DUONG_CU', 'XEMTUVI'].map((n) => <option key={n}>{n}</option>)}</select>
        <button className="qt-nut" type="submit">Lọc</button>
      </form>
      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead><tr><th>Nguồn</th><th>Đích</th><th>Mã</th><th>Loại</th><th className="qt-cot-so">Lượt</th><th>Lần cuối</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {ds.length === 0 && <tr><td colSpan={7} style={{ color: 'var(--muted)' }}>Chưa có chuyển hướng nào.</td></tr>}
            {ds.map((c) => (
              <tr key={c.id}>
                <td>{c.tuMien !== 'xemboi.vn' && <small>{c.tuMien}</small>}{c.tuDuongDan}{c.laBieuThuc && <> <span className="qt-nhan">regex</span></>}</td>
                <td>{c.ma === 410 ? '– (gỡ hẳn)' : c.denUrl}</td><td>{c.ma}</td><td>{c.nguon}</td><td className="qt-cot-so">{so(c.soLanTruy)}</td>
                <td>{c.lanTruyCuoi?.toLocaleString('vi-VN') ?? '–'}</td>
                <td>
                  {sua && (c.tuMien === 'xemboi.vn' || tenMien) ? (
                    <form action={batTatChuyenHuong}><input type="hidden" name="id" value={c.id} />
                      <button className="qt-nut phu" type="submit" style={{ padding: '3px 8px', whiteSpace: 'nowrap' }}>{c.batTat ? 'Đang bật · Tắt' : 'Đang tắt · Bật'}</button>
                    </form>
                  ) : c.batTat ? 'bật' : 'tắt'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

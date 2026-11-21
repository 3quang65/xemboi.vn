import type { Metadata } from 'next';
import Link from 'next/link';
import type { Prisma, TrangThaiTuKhoa } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { boDau, chuanHoaTuKhoa } from '@/lib/seo/kho-tu-khoa';
import { ganTayTuKhoa, traVeQuyTac } from '../hanh-dong';
import ThongBao, { nhanTrangThai, so } from '../ThongBao';

export const metadata: Metadata = { title: 'Từ khóa' };
export const dynamic = 'force-dynamic';

const CO = 100;
type Tham = { q?: string; tt?: string; trang?: string; nguon?: string; gan?: string; p?: string; bao?: string; loi?: string };

export default async function TrangTuKhoa({ searchParams }: { searchParams: Promise<Tham> }) {
  const nd = await yeuCauQuyen('seo.xem');
  const sp = await searchParams;
  const sua = coQuyen(nd.vaiTro, 'seo.sua');
  const p = Math.max(1, Number(sp.p) || 1);

  const where: Prisma.SeoTuKhoaWhereInput = {};
  if (sp.q) {
    const q = chuanHoaTuKhoa(sp.q);
    where.OR = [{ chuoi: { contains: q } }, { chuoiKhongDau: { contains: boDau(q) } }];
  }
  if (sp.tt === 'LOAI') where.nhomLoaiId = { not: null };
  else if (sp.tt === 'CHUA_GAN') { where.nhomLoaiId = null; where.trangDichId = null; }
  else if (sp.tt) where.trangThai = sp.tt as TrangThaiTuKhoa;
  if (sp.trang) where.trangDich = { maTrang: sp.trang };
  if (sp.nguon) where.nguon = { has: sp.nguon };
  if (sp.gan === 'TAY') where.cachGan = 'TAY';

  const [tong, ds, trang] = await Promise.all([
    prisma.seoTuKhoa.count({ where }),
    prisma.seoTuKhoa.findMany({
      where, orderBy: [{ luongTim: { sort: 'desc', nulls: 'last' } }, { chuoi: 'asc' }], skip: (p - 1) * CO, take: CO,
      include: { trangDich: { select: { maTrang: true, duongDan: true } }, quyTac: { select: { ten: true } }, nhomLoai: { select: { ma: true } } },
    }),
    prisma.seoTrang.findMany({ select: { maTrang: true, duongDan: true }, orderBy: { maTrang: 'asc' } }),
  ]);
  const soTrang = Math.ceil(tong / CO);
  const qs = (thay: Partial<Tham>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, bao: undefined, loi: undefined, ...thay })) if (v) u.set(k, String(v));
    return '?' + u.toString();
  };
  const quayVe = '/quan-tri/seo/tu-khoa' + qs({});

  return (
    <>
      <h1>Từ khóa</h1>
      <p className="qt-phu">{so(tong)} từ khóa khớp bộ lọc. Sắp theo lượng tìm/tháng (Keyword Planner).</p>
      <ThongBao bao={sp.bao} loi={sp.loi} />
      <form className="qt-loc" method="get">
        <input className="qt-o" name="q" defaultValue={sp.q} placeholder="Tìm (có dấu hoặc không dấu)" style={{ minWidth: 240 }} />
        <select className="qt-o" name="tt" defaultValue={sp.tt ?? ''}>
          <option value="">Mọi trạng thái</option>
          <option value="GIU">Có trang (GIU)</option>
          <option value="CHUA_GAN">Chưa gán</option>
          <option value="LOAI">Bị loại (mọi nhóm)</option>
          <option value="THUONG_HIEU_DOI_THU">Thương hiệu đối thủ</option>
          <option value="NHIEU">Nhiễu</option>
        </select>
        <input className="qt-o" name="trang" defaultValue={sp.trang} placeholder="Mã trang, ví dụ TUVI" list="ds-trang" />
        <select className="qt-o" name="nguon" defaultValue={sp.nguon ?? ''}>
          <option value="">Mọi nguồn</option><option value="KP">Keyword Planner</option><option value="AC">Autocomplete</option>
          <option value="GG">Gợi ý Google</option><option value="TAY">Nhập tay</option>
        </select>
        <label><input type="checkbox" name="gan" value="TAY" defaultChecked={sp.gan === 'TAY'} /> Chỉ gán tay</label>
        <button className="qt-nut" type="submit">Lọc</button>
        <Link className="qt-nut phu" href="/quan-tri/seo/tu-khoa">Xóa lọc</Link>
      </form>
      <datalist id="ds-trang">{trang.map((t) => <option key={t.maTrang} value={t.maTrang ?? ''}>{t.duongDan}</option>)}</datalist>
      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr><th>Từ khóa</th><th className="qt-cot-so">Lượng</th><th className="qt-cot-so">Tháng đỉnh</th><th>Nguồn</th><th>Trạng thái</th><th>Trang đích / nhóm loại</th><th>Cách gán</th>{sua && <th>Gán tay</th>}</tr>
          </thead>
          <tbody>
            {ds.map((k) => (
              <tr key={k.id}>
                <td>{k.chuoi}</td>
                <td className="qt-cot-so">{so(k.luongTim)}</td>
                <td className="qt-cot-so">{k.thangCaoNhat ?? '–'}{k.heSoMuaVu && k.heSoMuaVu >= 2 ? ` (×${k.heSoMuaVu})` : ''}</td>
                <td>{k.nguon.join(' ')}</td>
                <td>{nhanTrangThai(k.trangThai)}</td>
                <td>
                  {k.trangDich ? <Link href={qs({ trang: k.trangDich.maTrang ?? undefined, p: undefined })}>{k.trangDich.maTrang}</Link>
                    : k.nhomLoai ? <Link href={`/quan-tri/seo/tu-khoa-loai?nhom=${k.nhomLoai.ma}`}>{k.nhomLoai.ma}</Link> : '–'}
                  {k.trangDich && <div style={{ color: 'var(--muted)', fontSize: 11 }}>{k.trangDich.duongDan}</div>}
                </td>
                <td>{k.cachGan === 'TAY' ? <span className="qt-nhan vua">tay</span> : k.quyTac?.ten ?? '–'}</td>
                {sua && (
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <form action={ganTayTuKhoa} style={{ display: 'inline-flex', gap: 4 }}>
                      <input type="hidden" name="id" value={k.id} /><input type="hidden" name="quayVe" value={quayVe} />
                      <input className="qt-o" name="maTrang" list="ds-trang" placeholder="mã trang" aria-label={`Trang đích cho ${k.chuoi}`} style={{ width: 120, padding: '3px 6px' }} />
                      <button className="qt-nut phu" type="submit" style={{ padding: '3px 8px' }}>Gán</button>
                    </form>
                    {k.cachGan === 'TAY' && (
                      <form action={traVeQuyTac} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={k.id} /><input type="hidden" name="quayVe" value={quayVe} />
                        <button className="qt-nut phu" type="submit" style={{ padding: '3px 8px', marginLeft: 4 }} title="Bỏ gán tay, để quy tắc quyết">↺</button>
                      </form>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="qt-loc">
        {p > 1 && <Link className="qt-nut phu" href={qs({ p: String(p - 1) })}>← Trước</Link>}
        <span>Trang {p}/{Math.max(1, soTrang)}</span>
        {p < soTrang && <Link className="qt-nut phu" href={qs({ p: String(p + 1) })}>Sau →</Link>}
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { doiChinhSachNhom } from '../hanh-dong';
import ThongBao, { nhanTrangThai, so } from '../ThongBao';

export const metadata: Metadata = { title: 'Từ khóa loại' };
export const dynamic = 'force-dynamic';

const TEN_CS: Record<string, string> = { LOAI_VINH_VIEN: 'Loại vĩnh viễn', DE_DANH_LANDING: 'Để dành làm landing', CHO_QUYET: 'Chờ quyết' };

export default async function TuKhoaLoai({ searchParams }: { searchParams: Promise<{ nhom?: string; bao?: string; loi?: string }> }) {
  const nd = await yeuCauQuyen('seo.xem');
  const sp = await searchParams;
  const sua = coQuyen(nd.vaiTro, 'seo.sua');

  const nhom = await prisma.$queryRaw<{ id: string; ma: string; lyDo: string; chinhSach: string; nguonQuyet: string | null; ghiChu: string | null; capNhatBoi: string | null; capNhatLuc: Date; n: bigint; v: bigint | null; top: string[] | null }[]>`
    SELECT g.id, g.ma, g."lyDo", g."chinhSach"::text "chinhSach", g."nguonQuyet", g."ghiChu", g."capNhatBoi", g."capNhatLuc",
           count(k.id) n, sum(k."luongTim") v,
           (array_agg(k.chuoi ORDER BY k."luongTim" DESC NULLS LAST))[1:5] top
    FROM "SeoNhomLoai" g LEFT JOIN "SeoTuKhoa" k ON k."nhomLoaiId" = g.id
    GROUP BY g.id ORDER BY sum(k."luongTim") DESC NULLS LAST`;
  const theoCs = new Map<string, { n: number; v: number }>();
  for (const g of nhom) { const x = theoCs.get(g.chinhSach) ?? { n: 0, v: 0 }; x.n += Number(g.n); x.v += Number(g.v ?? 0); theoCs.set(g.chinhSach, x); }

  const chon = sp.nhom ? nhom.find((g) => g.ma === sp.nhom) : undefined;
  const tuKhoa = chon
    ? await prisma.seoTuKhoa.findMany({ where: { nhomLoaiId: chon.id }, orderBy: { luongTim: { sort: 'desc', nulls: 'last' } }, take: 500, select: { id: true, chuoi: true, luongTim: true, nguon: true, trangThai: true } })
    : [];

  return (
    <>
      <h1>Từ khóa loại</h1>
      <p className="qt-phu">Từ khóa bị loại theo định vị, quản lý riêng (anh quyết 21/11/2026). Không tính vào độ phủ. Nhóm “để dành” là nguồn để dựng landing đối thủ / gõ sai sau này.</p>
      <ThongBao bao={sp.bao} loi={sp.loi} />
      <div className="qt-luoi">
        {['LOAI_VINH_VIEN', 'DE_DANH_LANDING', 'CHO_QUYET'].map((cs) => (
          <div className="qt-so" key={cs}><div className="qt-so-nhan">{TEN_CS[cs]}</div><div className="qt-so-gt">{so(theoCs.get(cs)?.n ?? 0)}</div><div className="qt-so-nhan">{so(theoCs.get(cs)?.v ?? 0)} lượt/tháng</div></div>
        ))}
      </div>
      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead><tr><th>Nhóm</th><th className="qt-cot-so">Số từ</th><th className="qt-cot-so">Lượng</th><th>Từ lớn nhất</th><th>Chính sách</th><th>Quyết bởi</th></tr></thead>
          <tbody>
            {nhom.map((g) => (
              <tr key={g.id} style={g.ma === sp.nhom ? { background: 'var(--line)' } : undefined}>
                <td><Link href={`?nhom=${g.ma}`}><b>{g.lyDo}</b></Link><div style={{ color: 'var(--muted)', fontSize: 11 }}>{g.ma}</div></td>
                <td className="qt-cot-so">{so(g.n)}</td><td className="qt-cot-so">{so(g.v)}</td>
                <td style={{ minWidth: 240, maxWidth: 360 }}>{(g.top ?? []).join('; ')}</td>
                <td>
                  {sua ? (
                    <form action={doiChinhSachNhom} style={{ display: 'flex', gap: 4 }}>
                      <input type="hidden" name="id" value={g.id} />
                      <select className="qt-o" name="chinhSach" defaultValue={g.chinhSach} aria-label={`Chính sách nhóm ${g.ma}`} style={{ padding: '3px 6px' }}>
                        {Object.entries(TEN_CS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                      <button className="qt-nut phu" type="submit" style={{ padding: '3px 8px' }}>Lưu</button>
                    </form>
                  ) : nhanTrangThai(g.chinhSach)}
                </td>
                <td style={{ fontSize: 12 }}>{g.nguonQuyet ?? '–'}{g.capNhatBoi && <div style={{ color: 'var(--muted)' }}>{g.capNhatBoi}</div>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {chon && (
        <div className="qt-the qt-the-cuon">
          <h2>{chon.lyDo}: {so(chon.n)} từ khóa{Number(chon.n) > 500 ? ' (hiện 500 từ lớn nhất)' : ''}</h2>
          <table className="qt-bang">
            <thead><tr><th>Từ khóa</th><th className="qt-cot-so">Lượng</th><th>Nguồn</th><th>Trạng thái</th></tr></thead>
            <tbody>{tuKhoa.map((k) => <tr key={k.id}><td>{k.chuoi}</td><td className="qt-cot-so">{so(k.luongTim)}</td><td>{k.nguon.join(' ')}</td><td>{nhanTrangThai(k.trangThai)}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

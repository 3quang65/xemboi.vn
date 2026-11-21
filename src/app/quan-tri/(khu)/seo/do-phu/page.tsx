import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { baoCaoPhu } from '@/lib/seo/kho-tu-khoa';
import { chayLaiGan } from '../hanh-dong';
import ThongBao, { nhanTrangThai, pct, so } from '../ThongBao';

export const metadata: Metadata = { title: 'Độ phủ từ khóa' };
export const dynamic = 'force-dynamic';

export default async function DoPhu({ searchParams }: { searchParams: Promise<{ bao?: string; loi?: string }> }) {
  const nd = await yeuCauQuyen('seo.xem');
  const sp = await searchParams;
  const p = await baoCaoPhu(prisma);
  const conLai = p.tong - p.loai, luongConLai = p.tongLuong - p.loaiLuong;

  const theoTrang = await prisma.$queryRaw<{ id: string; maTrang: string | null; duongDan: string; trangThai: string; noindex: boolean; n: bigint; v: bigint | null; tk: string | null }[]>`
    SELECT t.id, t."maTrang", t."duongDan", t."trangThai"::text "trangThai", t.noindex, count(k.id) n, sum(k."luongTim") v,
           (array_agg(k.chuoi ORDER BY k."luongTim" DESC NULLS LAST))[1] tk
    FROM "SeoTrang" t LEFT JOIN "SeoTuKhoa" k ON k."trangDichId" = t.id
    GROUP BY t.id ORDER BY sum(k."luongTim") DESC NULLS LAST`;
  const chuaGan = await prisma.seoTuKhoa.findMany({
    where: { trangDichId: null, nhomLoaiId: null }, orderBy: { luongTim: { sort: 'desc', nulls: 'last' } }, take: 50, select: { chuoi: true, luongTim: true },
  });
  const lo = await prisma.seoLoNhap.findMany({ orderBy: { nhapLuc: 'desc' }, take: 1 });

  return (
    <>
      <h1>Độ phủ từ khóa</h1>
      <p className="qt-phu">
        Từ khóa loại không tính vào phủ (17 mục 1.1.2). “Đã phủ” chỉ tính trang đang xuất bản.
        {lo[0] && <> Lần nhập gần nhất: {lo[0].tenTep}, {lo[0].nhapLuc.toLocaleString('vi-VN')}.</>}
      </p>
      <ThongBao bao={sp.bao} loi={sp.loi} />
      <div className="qt-luoi">
        <div className="qt-so"><div className="qt-so-nhan">Tổng từ khóa</div><div className="qt-so-gt">{so(p.tong)}</div><div className="qt-so-nhan">{so(p.tongLuong)} lượt/tháng</div></div>
        <div className="qt-so"><div className="qt-so-nhan">Bị loại (kho riêng)</div><div className="qt-so-gt">{so(p.loai)}</div><div className="qt-so-nhan">{so(p.loaiLuong)} lượt</div></div>
        <div className="qt-so"><div className="qt-so-nhan">Có trang đích</div><div className="qt-so-gt">{pct(p.coTrang, conLai)}</div><div className="qt-so-nhan">{so(p.coTrang)}/{so(conLai)} từ · {pct(p.coTrangLuong, luongConLai)} lượng</div></div>
        <div className="qt-so"><div className="qt-so-nhan">Đã phủ (trang xuất bản)</div><div className="qt-so-gt">{pct(p.daPhuLuong, luongConLai)}</div><div className="qt-so-nhan">{so(p.daPhu)} từ · {so(p.daPhuLuong)} lượt</div></div>
        <div className="qt-so"><div className="qt-so-nhan">Chưa gán</div><div className="qt-so-gt">{so(p.chuaGan)}</div><div className="qt-so-nhan">{so(p.chuaGanLuong)} lượt</div></div>
      </div>
      <div className="qt-the">
        <h2>Tiến độ phủ theo lượng tìm</h2>
        <div className="qt-thanh" aria-label="Đã phủ"><span style={{ width: pct(p.daPhuLuong, luongConLai) }} /></div>
        {coQuyen(nd.vaiTro, 'seo.sua') && (
          <form action={chayLaiGan} style={{ marginTop: 12 }}>
            <button className="qt-nut phu" type="submit">Chạy lại gán theo quy tắc</button> <span className="qt-phu">Gán tay được giữ nguyên.</span>
          </form>
        )}
      </div>
      <div className="qt-the qt-the-cuon">
        <h2>Theo trang ({theoTrang.length})</h2>
        <table className="qt-bang">
          <thead><tr><th>Mã</th><th>Đường dẫn</th><th>Trạng thái</th><th className="qt-cot-so">Số từ</th><th className="qt-cot-so">Lượng</th><th>Từ lớn nhất</th></tr></thead>
          <tbody>
            {theoTrang.map((t) => (
              <tr key={t.id}>
                <td><Link href={`/quan-tri/seo/tu-khoa?trang=${encodeURIComponent(t.maTrang ?? '')}`}>{t.maTrang}</Link></td>
                <td><Link href={`/quan-tri/seo/trang/${t.id}`}>{t.duongDan}</Link></td>
                <td>{nhanTrangThai(t.trangThai)}{t.noindex && <> <span className="qt-nhan">noindex</span></>}</td>
                <td className="qt-cot-so">{so(t.n)}</td><td className="qt-cot-so">{so(t.v)}</td><td>{t.tk ?? '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="qt-the">
        <h2>Từ khóa chưa gán lớn nhất</h2>
        <table className="qt-bang">
          <thead><tr><th>Từ khóa</th><th className="qt-cot-so">Lượng</th></tr></thead>
          <tbody>{chuaGan.map((k) => <tr key={k.chuoi}><td>{k.chuoi}</td><td className="qt-cot-so">{so(k.luongTim)}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}

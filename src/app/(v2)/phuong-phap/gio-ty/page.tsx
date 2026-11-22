import type { Metadata } from 'next';
import Link from 'next/link';
import BangQuyUoc from '@/components/ck/BangQuyUoc';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { BANG_QUY_UOC } from '@/lib/trang/nen';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { DIA_CHI, KHUNG_GIO } from '@/lib/tuvi-v2/am-lich';

const MAC_DINH_GIO_TY = {
  title: 'Sinh giờ Tý (23h–1h) tính ngày nào khi lập lá số?',
  h1: 'Sinh giờ Tý tính ngày nào?',
};

const QUY_UOC_GIO_TY = BANG_QUY_UOC.filter(
  (q) => q.ma === 'tv-gio-ty' || q.ma === 'bt-ngay',
);

const DONG_CANH_GIO: { chi: string; khung: string; laTy?: boolean }[] = [
  { chi: DIA_CHI[0], khung: '23:00–23:59 (Tý đầu, tính ngày hôm sau)', laTy: true },
  { chi: DIA_CHI[0], khung: '00:00–00:59', laTy: true },
  ...DIA_CHI.slice(1).map((chi, idx) => ({
    chi,
    khung: KHUNG_GIO[idx + 1],
  })),
];

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/phuong-phap/gio-ty', MAC_DINH_GIO_TY),
    noiDungTheoDuongDan('/phuong-phap/gio-ty'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function GioTyPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/phuong-phap/gio-ty', MAC_DINH_GIO_TY),
    noiDungTheoDuongDan('/phuong-phap/gio-ty'),
  ]);
  const daDung = trangDaDung();

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/phuong-phap/gio-ty"
      tenCuoi="Giờ Tý"
      toi
    >
      <section className="ck-td-muc" aria-labelledby="ck-pp-gt-bang-tieu">
        <h2 id="ck-pp-gt-bang-tieu" className="ck-td-tieu">
          Bảng 12 canh giờ
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang ck-bang-the">
            <thead>
              <tr>
                <th scope="col">Chi</th>
                <th scope="col">Khoảng giờ</th>
              </tr>
            </thead>
            <tbody>
              {DONG_CANH_GIO.map((g, idx) => (
                <tr key={idx} className={g.laTy ? 'ck-pp-ty-dong' : undefined}>
                  <td data-nhan="Chi">
                    <strong>{g.chi}</strong>
                  </td>
                  <td data-nhan="Khoảng giờ">{g.khung}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-pp-gt-quy-uoc-tieu">
        <h2 id="ck-pp-gt-quy-uoc-tieu" className="ck-td-tieu">
          Quy ước giờ Tý trên xemboi
        </h2>
        <BangQuyUoc
          danhSach={QUY_UOC_GIO_TY}
          duongDanHienTai="/phuong-phap/gio-ty"
        />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="Giải thích giờ Tý" />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Công cụ &amp; phương pháp liên quan</h2>
        <div className="ck-lien-quan-ds">
          {daDung.has('/tu-vi/lap-la-so') ? (
            <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          ) : null}
          {daDung.has('/bat-tu/lap-la-so') ? (
            <Link href="/bat-tu/lap-la-so">Lập lá số bát tự</Link>
          ) : null}
          {daDung.has('/lich-am/doi-ngay') ? (
            <Link href="/lich-am/doi-ngay">Đổi ngày âm dương</Link>
          ) : null}
          <Link href="/phuong-phap">Phương pháp và chuẩn biên tập</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import BangQuyUoc from '@/components/ck/BangQuyUoc';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { homNay } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { BANG_QUY_UOC, bangThangNhuan, type DongThangNhuan } from '@/lib/trang/nen';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { canChiNam } from '@/lib/tuvi-v2/am-lich';

const MAC_DINH_THANG_NHUAN = {
  title: 'Tháng nhuận âm lịch là gì? Sinh tháng nhuận lập lá số',
  h1: 'Tháng nhuận âm lịch là gì',
};

const QUY_UOC_THANG_NHUAN = BANG_QUY_UOC.filter(
  (q) => q.ma === 'lich-thang-nhuan' || q.ma === 'tv-thang-nhuan',
);

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/phuong-phap/thang-nhuan', MAC_DINH_THANG_NHUAN),
    noiDungTheoDuongDan('/phuong-phap/thang-nhuan'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

function BangTheKy({
  id,
  tieuDe,
  dong,
  namAmHienTai,
}: {
  id: string;
  tieuDe: string;
  dong: DongThangNhuan[];
  namAmHienTai: number;
}) {
  return (
    <div id={id} className="ck-pp-nhom ck-pp-nam-moc">
      <h3 className="ck-pp-nhom-tieu">
        {tieuDe} ({dong.length} năm)
      </h3>
      <div className="ck-bang-khung">
        <table className="ck-bang ck-bang-the">
          <thead>
            <tr>
              <th scope="col">Năm âm</th>
              <th scope="col">Can chi</th>
              <th scope="col">Tháng nhuận</th>
              <th scope="col">Từ ngày</th>
              <th scope="col">Đến ngày</th>
            </tr>
          </thead>
          <tbody>
            {dong.map((d) => {
              const laNamNay = d.namAm === namAmHienTai;
              return (
                <tr
                  key={d.namAm}
                  id={laNamNay ? 'nam-hien-tai' : `nam-${d.namAm}`}
                  className={`ck-pp-nam-moc${laNamNay ? ' ck-pp-nam-nay' : ''}`}
                >
                  <td data-nhan="Năm âm">
                    <strong>{d.namAm}</strong>
                    {laNamNay ? (
                      <span className="ck-pp-nhan-nay">Năm hiện tại</span>
                    ) : null}
                  </td>
                  <td data-nhan="Can chi">{canChiNam(d.namAm).ten}</td>
                  <td data-nhan="Tháng nhuận">
                    <div className="ck-pp-thang-o">
                      <span>Tháng {d.thangNhuan} nhuận</span>
                      {d.thangNeuUtc7 !== null ? (
                        <small className="ck-pp-utc7">
                          Nếu tính theo UTC+7 thì nhuận tháng {d.thangNeuUtc7}
                        </small>
                      ) : null}
                    </div>
                  </td>
                  <td data-nhan="Từ ngày">{d.tuNgay}</td>
                  <td data-nhan="Đến ngày">{d.denNgay}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function ThangNhuanPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/phuong-phap/thang-nhuan', MAC_DINH_THANG_NHUAN),
    noiDungTheoDuongDan('/phuong-phap/thang-nhuan'),
  ]);
  const daDung = trangDaDung();
  const dsNhuan = bangThangNhuan();
  const namAmHienTai = homNay().am.nam;
  const coNamNay = dsNhuan.some((d) => d.namAm === namAmHienTai);

  const tk1900 = dsNhuan.filter((d) => d.namAm < 2000);
  const tk2000 = dsNhuan.filter((d) => d.namAm >= 2000);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/phuong-phap/thang-nhuan"
      tenCuoi="Tháng nhuận"
      toi
    >
      <section className="ck-td-muc" aria-labelledby="ck-pp-tn-bang-tieu">
        <h2 id="ck-pp-tn-bang-tieu" className="ck-td-tieu">
          Bảng các năm có tháng nhuận (1900–2100)
        </h2>
        <p className="ck-pp-cau-co-dinh">
          Trước 01/01/1968 tính theo múi giờ UTC+8 như lịch Việt Nam thời đó; từ 1968 theo UTC+7.
        </p>

        <nav className="ck-pp-nhay-the-ky" aria-label="Chọn nhanh theo thế kỷ">
          <a href="#tk-1900">1900–1999 ({tk1900.length} năm)</a>
          <a href="#tk-2000">2000–2100 ({tk2000.length} năm)</a>
          {coNamNay ? (
            <a href="#nam-hien-tai">Năm âm hiện tại ({namAmHienTai})</a>
          ) : null}
        </nav>

        <BangTheKy
          id="tk-1900"
          tieuDe="Thế kỷ XX (1900–1999)"
          dong={tk1900}
          namAmHienTai={namAmHienTai}
        />
        <BangTheKy
          id="tk-2000"
          tieuDe="Thế kỷ XXI (2000–2100)"
          dong={tk2000}
          namAmHienTai={namAmHienTai}
        />
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-pp-tn-quy-uoc-tieu">
        <h2 id="ck-pp-tn-quy-uoc-tieu" className="ck-td-tieu">
          Quy ước tính tháng nhuận trên xemboi
        </h2>
        <BangQuyUoc
          danhSach={QUY_UOC_THANG_NHUAN}
          duongDanHienTai="/phuong-phap/thang-nhuan"
        />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="Giải thích tháng nhuận" />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Công cụ &amp; phương pháp liên quan</h2>
        <div className="ck-lien-quan-ds">
          {daDung.has('/lich-am/doi-ngay') ? (
            <Link href="/lich-am/doi-ngay">Đổi ngày âm dương</Link>
          ) : null}
          {daDung.has('/tu-vi/lap-la-so') ? (
            <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          ) : null}
          <Link href="/phuong-phap">Phương pháp và chuẩn biên tập</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

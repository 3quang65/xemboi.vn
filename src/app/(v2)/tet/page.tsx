import type { Metadata } from 'next';
import Link from 'next/link';
import DemNguocTet from '@/components/ck/DemNguocTet';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  dinhDangNgayVN,
  duongDanNgayTuIso,
  trongPhamViNam,
} from '@/components/ck/lichHelpers';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { leAmTrongNam, tetSapToi } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { canChiNam } from '@/lib/tuvi-v2/am-lich';

export const revalidate = 3600;

const MAC_DINH_TET = {
  title: 'Tết Nguyên Đán vào ngày nào? Còn bao nhiêu ngày đến Tết',
  h1: 'Tết Nguyên Đán vào ngày nào?',
};

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/tet', MAC_DINH_TET);
}

export default async function TetPage() {
  const tt = await thongTinTrang('/tet', MAC_DINH_TET);
  const tet = tetSapToi();
  const daDung = trangDaDung();

  const namTruocAm = tet.namAm - 1;
  const ccTruoc = canChiNam(namTruocAm).ten;
  const leTruoc = leAmTrongNam(namTruocAm)
    .filter((l) => l.ten === 'Ông Công ông Táo' || l.ten === 'Giao thừa')
    .map((l) => ({ ...l, namHienThi: ccTruoc }));
  const leTrong = leAmTrongNam(tet.namAm)
    .filter((l) => l.am.endsWith('/1'))
    .map((l) => ({ ...l, namHienThi: tet.canChi }));

  const cacLeQuanhTet = [...leTruoc, ...leTrong];
  const [yTet, mTet] = tet.ngay.split('-');
  const hrefNgayTet = duongDanNgayTuIso(tet.ngay);
  const hrefThangTet =
    yTet && mTet && trongPhamViNam(Number(yTet)) ? `/lich-am/${yTet}/${mTet}` : null;

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/tet" toi>
      <section className="ck-tet-khung" aria-label={`Đếm ngược Tết ${tet.canChi} ${tet.namAm}`}>
        <div className="ck-tet-tom-tat">
          <p className="ck-tet-moc">
            Tết {tet.canChi} {tet.namAm} vào <strong>{tet.thu}</strong>, ngày{' '}
            <strong>{dinhDangNgayVN(tet.ngay)}</strong>
          </p>
          <p className="ck-tet-con">
            {tet.conNgay === 0 ? 'Hôm nay là Mùng 1 Tết' : `Còn ${tet.conNgay} ngày`}
          </p>
        </div>

        <DemNguocTet
          ngayTetIso={tet.ngay}
          conNgayBanDau={tet.conNgay}
          canChi={tet.canChi}
          namAm={tet.namAm}
        />

        <div className="ck-dieu-huong ck-dieu-huong-giua">
          {hrefNgayTet ? (
            <Link href={hrefNgayTet} className="ck-nut ck-nut-son">
              Chi tiết ngày Mùng 1 Tết
            </Link>
          ) : null}
          {daDung.has('/xem-ngay/xuat-hanh') ? (
            <Link href="/xem-ngay/xuat-hanh" className="ck-nut ck-nut-vien">
              Giờ xuất hành mùng 1–10
            </Link>
          ) : null}
          {hrefThangTet ? (
            <Link href={hrefThangTet} className="ck-nut ck-nut-vien">
              Lịch tháng có Tết
            </Link>
          ) : null}
          {trongPhamViNam(tet.namAm) ? (
            <Link href={`/lich-am/${tet.namAm}`} className="ck-nut ck-nut-vien">
              Lịch âm cả năm {tet.namAm}
            </Link>
          ) : null}
        </div>
      </section>

      <section className="ck-muc-lich" aria-labelledby="ck-tet-ngay-le">
        <h2 id="ck-tet-ngay-le">Các mốc lễ quanh Tết {tet.canChi} {tet.namAm}</h2>
        <div className="ck-bang-khung">
          <table className="ck-bang">
            <thead>
              <tr>
                <th>Dịp lễ</th>
                <th>Ngày âm lịch</th>
                <th>Ngày dương lịch</th>
                <th>Thứ</th>
              </tr>
            </thead>
            <tbody>
              {cacLeQuanhTet.map((le) => {
                const href = duongDanNgayTuIso(le.duong);
                return (
                  <tr key={`${le.ten}-${le.duong}`}>
                    <td>
                      <b>{le.ten}</b>
                    </td>
                    <td>
                      {le.am} ({le.namHienThi})
                    </td>
                    <td>
                      {href ? (
                        <Link href={href}>{dinhDangNgayVN(le.duong)}</Link>
                      ) : (
                        dinhDangNgayVN(le.duong)
                      )}
                    </td>
                    <td>{le.thu}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ck-muc-lich" aria-labelledby="ck-tet-phong-tuc">
        <div className="ck-cho-noi-dung">
          <h2 id="ck-tet-phong-tuc">Phong tục Tết Nguyên Đán</h2>
          <p>Phần giới thiệu phong tục ngày Tết đang biên tập.</p>
        </div>
      </section>
    </KhungTrang>
  );
}

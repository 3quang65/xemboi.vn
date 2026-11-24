import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  dinhDangNgayThangVN,
  dinhDangNgayVN,
  duongDanNgayTuIso,
} from '@/components/ck/lichHelpers';
import {
  DocNhanh,
  TrichNguyenVan,
  type TheDocNhanhItem,
} from '@/components/ck/truc-quan';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import {
  NAM_LICH_MUA_DEN,
  NAM_LICH_MUA_TU,
  NGUON_72_HAU,
  TIET_KHI_24,
  mocTiet,
  tenThangTiet,
  tietKe,
  tietTheoSlug,
  type TietKhi,
} from '@/lib/trang/lich-mua';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  GHI_CHU_PHONG_TUC,
  NGUON_PHONG_TUC,
  PHONG_TUC_TIET_KHI,
} from '@/lib/trang/phong-tuc-ngay-le';
import {
  DS_NAM_LICH_MUA,
  kepNamLichMua,
  muaCuaTiet,
  serializeJsonLd,
  taoSchemaWebPage,
} from '../../lich-am/LichMuaHelpers';
import '../../lich-am/lich-mua.css';

export const revalidate = 3600;

export function generateStaticParams() {
  return TIET_KHI_24.map((t) => ({ tiet: t.slug }));
}

function macDinhTiet(tiet: TietKhi, nam: number) {
  return {
    title: `Tiết ${tiet.ten} ${nam} ngày nào? Ý nghĩa tiết ${tiet.ten}`,
    h1: `Tiết ${tiet.ten}`,
    description: `${tiet.nghiaTen}. Thời điểm bắt đầu tiết ${tiet.ten} các năm ${NAM_LICH_MUA_TU}–${NAM_LICH_MUA_DEN} và ba hậu theo Hiệp kỷ biện phương thư.`,
  };
}

function taoThamSoTiet(tiet: TietKhi, nam: number) {
  const moc = mocTiet(tiet.slug, nam);
  return {
    'Tên': tiet.ten,
    yyyy: nam,
    'giờ': moc?.gio ?? '00:00',
    'dd/mm': moc ? dinhDangNgayThangVN(moc.ngay) : '',
    'độ': `${tiet.kinhDo}°`,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tiet: string }>;
}): Promise<Metadata> {
  const { tiet: slug } = await params;
  const tiet = tietTheoSlug(slug);
  if (!tiet) notFound();
  const namNay = kepNamLichMua(ngayHienTaiVN().nam);
  return metaTrang(
    `/tiet-khi/${tiet.slug}`,
    macDinhTiet(tiet, namNay),
    '/tiet-khi/{tiet}',
    taoThamSoTiet(tiet, namNay),
  );
}

export default async function ChiTietTietKhiPage({
  params,
}: {
  params: Promise<{ tiet: string }>;
}) {
  const { tiet: slug } = await params;
  const tiet = tietTheoSlug(slug);
  if (!tiet) notFound();

  const namNay = kepNamLichMua(ngayHienTaiVN().nam);
  const mocNay = mocTiet(tiet.slug, namNay);
  if (!mocNay) notFound();

  const mocSau = mocTiet(tiet.slug, namNay + 1);
  const daQuaNamNay = mocNay.iso < new Date().toISOString();
  const tt = await thongTinTrang(
    `/tiet-khi/${tiet.slug}`,
    macDinhTiet(tiet, namNay),
    '/tiet-khi/{tiet}',
    taoThamSoTiet(tiet, namNay),
  );

  const mua = muaCuaTiet(tiet.thangTiet);
  const ke = tietKe(tiet.slug);
  const phongTuc = PHONG_TUC_TIET_KHI[tiet.slug];
  const thangTietTen = tenThangTiet(tiet.thangTiet);
  const laTietDau = tiet.loai === 'tiet';

  const cauDocNhanh = `Tiết ${tiet.ten} năm ${namNay} bắt đầu lúc ${mocNay.gio} ${mocNay.thu} ${dinhDangNgayVN(mocNay.ngay)}, Mặt Trời ở kinh độ ${tiet.kinhDo}°. Là ${laTietDau ? 'tiết đầu' : 'trung khí'} của ${thangTietTen}.`;

  const dongNamSau =
    daQuaNamNay && mocSau
      ? `Năm sau (${namNay + 1}): ${mocSau.gio} ${mocSau.thu} ${dinhDangNgayVN(mocSau.ngay)}.`
      : null;

  const theDocNhanh: TheDocNhanhItem[] = [
    {
      ma: 'moc-nam-nay',
      nhan: `Năm ${namNay}`,
      giaTri: `${mocNay.gio} · ${dinhDangNgayThangVN(mocNay.ngay)}`,
      hanh: mua.hanh,
      chiTiet: `${mocNay.thu}, ngày ${dinhDangNgayVN(mocNay.ngay)} (giờ Việt Nam).`,
    },
    {
      ma: 'kinh-do',
      nhan: 'Kinh độ Mặt Trời',
      giaTri: `${tiet.kinhDo}°`,
      hanh: mua.hanh,
      chiTiet: `Mùa ${mua.ten} · ${thangTietTen}.`,
    },
    {
      ma: 'phan-loai',
      nhan: 'Phân loại',
      giaTri: laTietDau ? 'Tiết đầu tháng' : 'Trung khí',
      muc: laTietDau ? 'tot' : 'binh',
      chiTiet: laTietDau
        ? `Mở đầu ${thangTietTen} trong phép xem ngày và bát tự.`
        : `Nằm giữa ${thangTietTen}, không dùng để đổi tháng trong bát tự.`,
    },
  ];

  const dsCacNam = DS_NAM_LICH_MUA.map((nam) => ({
    nam,
    moc: mocTiet(tiet.slug, nam)!,
  }));

  const hrefNgayNay = duongDanNgayTuIso(mocNay.ngay);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tiet.nghiaTen}
      duongDan={`/tiet-khi/${tiet.slug}`}
      tenCuoi={`Tiết ${tiet.ten}`}
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(taoSchemaWebPage(tt)),
        }}
      />

      {/* 1. Đọc nhanh */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-tk-ct-dn">
        <DocNhanh
          tieuDe="Đọc nhanh"
          tieuDeId="ck-lm-tk-ct-dn"
          luoiCot={3}
          cau={cauDocNhanh}
          dongPhu={dongNamSau}
          the={theDocNhanh}
          trenCau={
            <div className="ck-lm-dau-noi-bat">
              <div>
                <p className={`ck-lm-chinh-to ck-tq-hanh-${mua.hanhSlug}`}>
                  {dinhDangNgayVN(mocNay.ngay)}
                </p>
                <p className="ck-lm-phu-dong">
                  <strong>{mocNay.gio}</strong> · {mocNay.thu} · Kinh độ{' '}
                  <strong>{tiet.kinhDo}°</strong> · {thangTietTen}
                </p>
              </div>
              {hrefNgayNay ? (
                <Link href={hrefNgayNay} className="ck-nut ck-nut-vien ck-lm-nut-44">
                  Xem lịch ngày {dinhDangNgayVN(mocNay.ngay)}
                </Link>
              ) : null}
            </div>
          }
        />
      </section>

      {/* 2. Ba hậu của tiết */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-tk-hau-tieu">
        <h2 id="ck-lm-tk-hau-tieu" className="ck-lm-tieu">
          Ba hậu của tiết {tiet.ten}
        </h2>
        <div className="ck-lm-hau-luoi">
          {tiet.hau.map((h, i) => (
            <article key={i} className="ck-lm-hau-the">
              <h3>{i === 0 ? 'Hậu 1 · 5 ngày đầu' : `Hậu ${i + 1}`}</h3>
              <p>{h.dich}</p>
            </article>
          ))}
        </div>

        <TrichNguyenVan
          nhan="Sách ghi"
          dich={NGUON_72_HAU.ketLuanDich}
          viTriViet={`${NGUON_72_HAU.viTriViet} · đoạn ${NGUON_72_HAU.doanId.join(', ')}`}
          tenSach={NGUON_72_HAU.nguon.tenHanViet}
          nienDai={NGUON_72_HAU.nguon.nienDai}
          ghiCong={NGUON_72_HAU.nguon.ghiCong}
          url={NGUON_72_HAU.nguon.url}
          ghiCongDich="Dịch nghĩa: xemboi"
        />

        <div className="ck-lm-dia-ly">
          <p>{NGUON_72_HAU.ghiChuDiaLy}</p>
        </div>
      </section>

      {/* 3. Bảng các năm 2020–2035 */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-tk-nam-tieu">
        <h2 id="ck-lm-tk-nam-tieu" className="ck-lm-tieu">
          Ngày giờ tiết {tiet.ten} các năm {NAM_LICH_MUA_TU}–{NAM_LICH_MUA_DEN}
        </h2>
        <div className="ck-lm-bang-khung">
          <table className="ck-lm-bang ck-lm-bang-nam">
            <thead>
              <tr>
                <th scope="col">Năm</th>
                <th scope="col">Ngày dương</th>
                <th scope="col">Giờ (UTC+7)</th>
                <th scope="col">Thứ</th>
              </tr>
            </thead>
            <tbody>
              {dsCacNam.map(({ nam, moc }) => {
                const laNamNay = nam === namNay;
                const href = duongDanNgayTuIso(moc.ngay);
                return (
                  <tr key={nam} className={laNamNay ? 'ck-lm-hang-nay' : undefined}>
                    <td>
                      <strong>{nam}</strong>
                      {laNamNay ? <span className="ck-lm-nhan-nay">Năm nay</span> : null}
                    </td>
                    <td>
                      {href ? (
                        <Link href={href} className="ck-lm-link-ngay">
                          {dinhDangNgayVN(moc.ngay)}
                        </Link>
                      ) : (
                        dinhDangNgayVN(moc.ngay)
                      )}
                    </td>
                    <td>{moc.gio}</td>
                    <td>{moc.thu}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Phong tục xưa theo sách Việt Nam phong tục (1915) */}
      {phongTuc ? (
        <section className="ck-lm-muc" aria-labelledby="ck-pt-tiet-tieu">
          <div className="ck-pt-khung">
            <h2 id="ck-pt-tiet-tieu" className="ck-lm-tieu">
              Phong tục xưa theo sách <em>Việt Nam phong tục</em> (1915)
            </h2>
            <p className="ck-pt-ghi-chu">{GHI_CHU_PHONG_TUC}</p>
            <p className="ck-pt-tom-tat">{phongTuc.tomTat}</p>
            <div className="ck-pt-ds">
              {phongTuc.trich.map((muc, idx) => (
                <figure key={idx} className="ck-pt-trich">
                  <blockquote className="ck-pt-van">{muc.van}</blockquote>
                  <figcaption className="ck-pt-nguon-doan">
                    <span>{muc.viTriViet}</span>
                    {muc.url ? (
                      <>
                        {' · '}
                        <a href={muc.url} target="_blank" rel="noopener noreferrer nofollow">
                          Đọc nguyên chương
                        </a>
                      </>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
            <footer className="ck-pt-chan">
              Nguồn: {NGUON_PHONG_TUC.tacGia}, <em>{NGUON_PHONG_TUC.tenSach}</em> (
              {NGUON_PHONG_TUC.nam}), phạm vi công cộng;{' '}
              <a href={NGUON_PHONG_TUC.url} target="_blank" rel="noopener noreferrer nofollow">
                bản chép Wikisource, CC BY-SA 4.0
              </a>
              .
            </footer>
          </div>
        </section>
      ) : null}

      {/* 5. Liên kết Bát tự: chỉ hiện ở 12 trang loại 'tiet' */}
      {laTietDau ? (
        <section className="ck-lm-muc" aria-label="Ứng dụng trong bát tự">
          <div className="ck-lm-bat-tu">
            <p>Bát tự đổi tháng ở tiết</p>
            <Link href="/bat-tu/lap-la-so" className="ck-nut ck-nut-vien ck-lm-nut-44">
              Lập lá số bát tự
            </Link>
          </div>
        </section>
      ) : null}

      {/* 5. Điều hướng tiết trước / sau */}
      <nav className="ck-lm-dieu-huong" aria-label="Điều hướng 24 tiết khí">
        <Link href={`/tiet-khi/${ke.truoc.slug}`} className="ck-nut ck-nut-vien ck-lm-nut-44">
          ← Tiết {ke.truoc.ten}
        </Link>
        <Link href="/tiet-khi" className="ck-nut ck-nut-vien ck-lm-nut-44">
          24 tiết khí
        </Link>
        <Link href={`/tiet-khi/${ke.sau.slug}`} className="ck-nut ck-nut-vien ck-lm-nut-44">
          Tiết {ke.sau.ten} →
        </Link>
      </nav>
    </KhungTrang>
  );
}

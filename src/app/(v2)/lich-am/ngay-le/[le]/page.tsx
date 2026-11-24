import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  dinhDangNgayThangVN,
  dinhDangNgayVN,
  duongDanNgayTuIso,
} from '@/components/ck/lichHelpers';
import { DocNhanh, type TheDocNhanhItem } from '@/components/ck/truc-quan';
import type { Hanh } from '@/lib/trang/can-chi';
import { ngayLich } from '@/lib/trang/lich';
import {
  GHI_CHU_LE,
  LE_AM_NAM,
  NAM_LICH_MUA_DEN,
  NAM_LICH_MUA_TU,
  leQuaCacNam,
  leSapToi,
  leTheoSlug,
  type LeAm,
} from '@/lib/trang/lich-mua';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  GHI_CHU_PHONG_TUC,
  NGUON_PHONG_TUC,
  phongTucLe,
} from '@/lib/trang/phong-tuc-ngay-le';
import { serializeJsonLd, taoSchemaWebPage } from '../../LichMuaHelpers';
import '../../lich-mua.css';

export const revalidate = 3600;

const LE_CO_TRANG = LE_AM_NAM.filter((l) => !l.trangRieng);

export function generateStaticParams() {
  return LE_CO_TRANG.map((l) => ({ le: l.slug }));
}

function timLeHopLe(slug: string): LeAm | null {
  if (slug === 'tet-nguyen-dan') return null;
  const le = leTheoSlug(slug);
  if (!le || le.trangRieng) return null;
  return le;
}

function macDinhLe(
  le: LeAm,
  sapToi: NonNullable<ReturnType<typeof leSapToi>>,
) {
  return {
    title: `${le.ten} ${sapToi.namAm} vào ngày nào? Ngày dương lịch các năm`,
    h1: `${le.ten} ${sapToi.namAm} vào ngày nào`,
    description: `${le.ten} năm ${sapToi.canChiNam} (${sapToi.namAm}) rơi vào ${sapToi.thu} ${dinhDangNgayVN(sapToi.duong)} dương lịch. Giờ hoàng đạo ngày này và bảng ngày dương ${NAM_LICH_MUA_TU}–${NAM_LICH_MUA_DEN}.`,
  };
}

function thamSoLe(
  le: LeAm,
  sapToi: NonNullable<ReturnType<typeof leSapToi>>,
) {
  return {
    'Lễ': le.ten,
    yyyy: sapToi.namAm,
    'thứ': sapToi.thu,
    'dd/mm': dinhDangNgayThangVN(sapToi.duong),
    'dd/mm/yyyy': dinhDangNgayVN(sapToi.duong),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ le: string }>;
}): Promise<Metadata> {
  const { le: slug } = await params;
  const le = timLeHopLe(slug);
  if (!le) notFound();
  const sapToi = leSapToi(le.slug);
  if (!sapToi) notFound();

  return metaTrang(
    `/lich-am/ngay-le/${le.slug}`,
    macDinhLe(le, sapToi),
    '/lich-am/ngay-le/{le}',
    thamSoLe(le, sapToi),
  );
}

export default async function ChiTietNgayLePage({
  params,
}: {
  params: Promise<{ le: string }>;
}) {
  const { le: slug } = await params;
  const le = timLeHopLe(slug);
  if (!le) notFound();

  const sapToi = leSapToi(le.slug);
  if (!sapToi) notFound();

  const quaCacNam = leQuaCacNam(le.slug);
  const phongTuc = phongTucLe(le.slug);
  const tt = await thongTinTrang(
    `/lich-am/ngay-le/${le.slug}`,
    macDinhLe(le, sapToi),
    '/lich-am/ngay-le/{le}',
    thamSoLe(le, sapToi),
  );

  const [y, m, d] = sapToi.duong.split('-').map(Number);
  const chiTietNgayToi = ngayLich(d, m, y);
  const hanhNgay = chiTietNgayToi.hanhNgay as Hanh;
  const hanhSlug = HANH_SLUG[hanhNgay] ?? 'tho';

  const thoiGianCon =
    sapToi.conNgay === 0 ? 'là hôm nay' : `còn ${sapToi.conNgay} ngày`;
  const cauDocNhanh = `${le.ten} năm ${sapToi.canChiNam} (${sapToi.namAm}) rơi vào ${sapToi.thu} ${dinhDangNgayVN(sapToi.duong)}, ${thoiGianCon}. Giờ hoàng đạo ngày này: ${sapToi.gioHoangDao}.`;

  const theDocNhanh: TheDocNhanhItem[] = [
    {
      ma: 'ngay-duong-toi',
      nhan: 'Lần tới dương lịch',
      giaTri: dinhDangNgayVN(sapToi.duong),
      hanh: hanhNgay,
      chiTiet: `${sapToi.thu} · Âm lịch ${sapToi.am} năm ${sapToi.canChiNam} (${sapToi.namAm}) · Ngày ${chiTietNgayToi.canChiNgay.ten} (hành ${hanhNgay}).`,
    },
    {
      ma: 'dem-nguoc',
      nhan: 'Thời gian còn lại',
      giaTri: sapToi.conNgay === 0 ? 'Hôm nay' : `Còn ${sapToi.conNgay} ngày`,
      muc: 'tot',
      chiTiet: `Tính theo ngày hiện tại ở Việt Nam (UTC+7).`,
    },
    {
      ma: 'gio-hoang-dao',
      nhan: 'Giờ hoàng đạo ngày này',
      giaTri: sapToi.gioHoangDao,
      muc: 'tot',
      chiTiet: `Tra theo chi ngày ${chiTietNgayToi.canChiNgay.ten} trong Hiệp kỷ biện phương thư.`,
    },
  ];

  const idxLe = LE_AM_NAM.findIndex((item) => item.slug === le.slug);
  const leTruoc = LE_AM_NAM[(idxLe - 1 + LE_AM_NAM.length) % LE_AM_NAM.length];
  const leSau = LE_AM_NAM[(idxLe + 1) % LE_AM_NAM.length];
  const hrefTruoc = leTruoc.trangRieng ?? `/lich-am/ngay-le/${leTruoc.slug}`;
  const hrefSau = leSau.trangRieng ?? `/lich-am/ngay-le/${leSau.slug}`;
  const hrefNgaySapToi = duongDanNgayTuIso(sapToi.duong);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={le.tenKhac ? `${le.ten} còn gọi là ${le.tenKhac}.` : tt.description}
      duongDan={`/lich-am/ngay-le/${le.slug}`}
      tenCuoi={le.ten}
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(taoSchemaWebPage(tt)),
        }}
      />

      {/* 1. Đọc nhanh */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-le-ct-dn">
        <DocNhanh
          tieuDe="Đọc nhanh"
          tieuDeId="ck-lm-le-ct-dn"
          luoiCot={3}
          cau={cauDocNhanh}
          the={theDocNhanh}
          trenCau={
            <div className="ck-lm-dau-noi-bat">
              <div>
                <p className={`ck-lm-chinh-to ck-tq-hanh-${hanhSlug}`}>
                  {dinhDangNgayVN(sapToi.duong)}
                </p>
                <p className="ck-lm-phu-dong">
                  <strong>{sapToi.thu}</strong> · Âm lịch <strong>{sapToi.am}</strong> năm{' '}
                  {sapToi.canChiNam} ({sapToi.namAm})
                  {le.tenKhac ? ` · ${le.tenKhac}` : ''}
                </p>
              </div>
              <Link
                href={`/lich-am/gio-hoang-dao?ngay=${sapToi.duong}`}
                className="ck-nut ck-nut-vien ck-lm-nut-44"
              >
                Giờ hoàng đạo ngày {dinhDangNgayVN(sapToi.duong)}
              </Link>
            </div>
          }
        />
      </section>

      {/* 2. Bảng các năm 2020–2035 */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-le-nam-tieu">
        <h2 id="ck-lm-le-nam-tieu" className="ck-lm-tieu">
          {le.ten} các năm {NAM_LICH_MUA_TU}–{NAM_LICH_MUA_DEN}
        </h2>

        <div className="ck-lm-bang-khung">
          <table className="ck-lm-bang ck-lm-bang-nam">
            <thead>
              <tr>
                <th scope="col">Năm âm</th>
                <th scope="col">Ngày âm</th>
                <th scope="col">Ngày dương</th>
                <th scope="col">Thứ</th>
              </tr>
            </thead>
            <tbody>
              {quaCacNam.map((dong) => {
                const laSapToi = dong.namAm === sapToi.namAm;
                const hrefNgay = duongDanNgayTuIso(dong.duong);
                return (
                  <tr key={dong.namAm} className={laSapToi ? 'ck-lm-hang-nay' : undefined}>
                    <td>
                      <strong>{dong.namAm}</strong> · {dong.canChiNam}
                      {laSapToi ? (
                        <span className="ck-lm-nhan-nay">
                          {sapToi.conNgay === 0 ? 'Hôm nay' : 'Sắp tới'}
                        </span>
                      ) : null}
                    </td>
                    <td>{dong.am}</td>
                    <td>
                      {hrefNgay ? (
                        <Link href={hrefNgay} className="ck-lm-link-ngay">
                          {dinhDangNgayVN(dong.duong)}
                        </Link>
                      ) : (
                        dinhDangNgayVN(dong.duong)
                      )}
                    </td>
                    <td>{dong.thu}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Phong tục xưa theo sách Việt Nam phong tục (1915) */}
      {phongTuc ? (
        <section className="ck-lm-muc" aria-labelledby="ck-pt-tieu">
          <div className="ck-pt-khung">
            <h2 id="ck-pt-tieu" className="ck-lm-tieu">
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

      {/* 4. Ghi chú thuật toán */}
      <section className="ck-lm-muc" aria-label="Ghi chú đổi ngày">
        <div className="ck-lm-ghi-chu">
          <p>{GHI_CHU_LE}</p>
        </div>
      </section>

      {/* 5. Điều hướng lễ trước / sau và liên kết */}
      <nav className="ck-lm-dieu-huong" aria-label="Chuyển giữa các ngày lễ">
        <Link href={hrefTruoc} className="ck-nut ck-nut-vien ck-lm-nut-44">
          ← {leTruoc.ten}
        </Link>
        <Link href="/lich-am/ngay-le" className="ck-nut ck-nut-vien ck-lm-nut-44">
          Tất cả ngày lễ
        </Link>
        <Link href={hrefSau} className="ck-nut ck-nut-vien ck-lm-nut-44">
          {leSau.ten} →
        </Link>
      </nav>

      <nav className="ck-lm-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lm-lien-quan-ds">
          <Link href="/lich-am/ngay-le">Ngày lễ âm lịch</Link>
          <Link href={`/lich-am/gio-hoang-dao?ngay=${sapToi.duong}`}>
            Giờ hoàng đạo ngày {dinhDangNgayVN(sapToi.duong)}
          </Link>
          {hrefNgaySapToi ? (
            <Link href={hrefNgaySapToi}>Lịch ngày {dinhDangNgayVN(sapToi.duong)}</Link>
          ) : null}
          <Link href="/lich-am">Lịch âm hôm nay</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

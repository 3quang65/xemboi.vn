import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  dinhDangNgayVN,
  duongDanNgayTuIso,
} from '@/components/ck/lichHelpers';
import { DocNhanh, type TheDocNhanhItem } from '@/components/ck/truc-quan';
import type { Hanh } from '@/lib/trang/can-chi';
import { ngayHienTaiVN, ngayLich } from '@/lib/trang/lich';
import {
  GHI_CHU_LE,
  NAM_LICH_MUA_DEN,
  NAM_LICH_MUA_TU,
  leTheoSlug,
  leTrongNamAm,
} from '@/lib/trang/lich-mua';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { canChiNam, hanhNapAm, napAm } from '@/lib/tuvi-v2/am-lich';
import {
  DS_NAM_LICH_MUA,
  type SearchParamsInput,
  isoTuNgayDuong,
  kepNamLichMua,
  kiemCoThamSo,
  layMot,
  phanTichNamLichMua,
  serializeJsonLd,
  soNgayGiuaIso,
  taoSchemaWebPage,
} from '../LichMuaHelpers';
import '../lich-mua.css';

export const revalidate = 3600;

function macDinhNgayLe(namAm: number) {
  return {
    title: `Các ngày lễ âm lịch ${namAm}: ngày dương tương ứng`,
    h1: `Ngày lễ âm lịch ${namAm}`,
    description: `Danh sách 11 ngày lễ âm lịch năm ${namAm} quy đổi sang dương lịch theo múi giờ Việt Nam (UTC+7).`,
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const sp = await searchParams;
  const hn = ngayHienTaiVN();
  const namAmHienTai = kepNamLichMua(ngayLich(hn.ngay, hn.thang, hn.nam).am.nam);
  const namChon = phanTichNamLichMua(layMot(sp.nam)) ?? namAmHienTai;
  const base = await metaTrang('/lich-am/ngay-le', macDinhNgayLe(namChon), undefined, {
    yyyy: namChon,
  });
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/lich-am/ngay-le' },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function NgayLeIndexPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const sp = await searchParams;
  const hn = ngayHienTaiVN();
  const homNayIso = isoTuNgayDuong(hn);
  const namAmHienTai = kepNamLichMua(ngayLich(hn.ngay, hn.thang, hn.nam).am.nam);

  const namRaw = layMot(sp.nam);
  const namTrim = namRaw?.trim() ?? '';
  const namParsed = phanTichNamLichMua(namTrim);
  const coLoiNam = namTrim.length > 0 && namParsed === null;
  const namAmChon = namParsed ?? namAmHienTai;

  const tt = await thongTinTrang('/lich-am/ngay-le', macDinhNgayLe(namAmChon), undefined, {
    yyyy: namAmChon,
  });

  const ccNam = canChiNam(namAmChon);
  const hanhNam = hanhNapAm(napAm(ccNam.can, ccNam.chi)) as Hanh;
  const hanhSlug = HANH_SLUG[hanhNam] ?? 'tho';

  const dsLe = leTrongNamAm(namAmChon).map((le) => ({
    ...le,
    conNgay: soNgayGiuaIso(homNayIso, le.duong),
    meta: leTheoSlug(le.slug),
  }));

  const sapToiTrongNam = dsLe.find((l) => l.conNgay >= 0);
  const soDaQua = dsLe.filter((l) => l.conNgay < 0).length;
  const soConLai = dsLe.length - soDaQua;

  const cauDocNhanh = sapToiTrongNam
    ? `Năm ${ccNam.ten} (${namAmChon}) có ${dsLe.length} ngày lễ chính theo âm lịch; gần nhất là ${sapToiTrongNam.ten} vào ${sapToiTrongNam.thu} ${dinhDangNgayVN(sapToiTrongNam.duong)} (${sapToiTrongNam.conNgay === 0 ? 'hôm nay' : `còn ${sapToiTrongNam.conNgay} ngày`}).`
    : `Năm ${ccNam.ten} (${namAmChon}) có ${dsLe.length} ngày lễ chính theo âm lịch, quy đổi sang dương lịch theo múi giờ Việt Nam.`;

  const theDocNhanh: TheDocNhanhItem[] = [
    {
      ma: 'nam-am',
      nhan: 'Năm âm lịch',
      giaTri: `${ccNam.ten} (${namAmChon})`,
      hanh: hanhNam,
      chiTiet: `Mệnh năm: ${napAm(ccNam.can, ccNam.chi)} (hành ${hanhNam}).`,
    },
    sapToiTrongNam
      ? {
          ma: 'le-gan-nhat',
          nhan: sapToiTrongNam.conNgay === 0 ? 'Hôm nay là lễ' : 'Lễ gần nhất trong năm',
          giaTri: sapToiTrongNam.ten,
          muc: 'tot',
          chiTiet: `${sapToiTrongNam.thu} ${dinhDangNgayVN(sapToiTrongNam.duong)} (âm ${sapToiTrongNam.am}) · ${sapToiTrongNam.conNgay === 0 ? 'hôm nay' : `còn ${sapToiTrongNam.conNgay} ngày`}.`,
        }
      : {
          ma: 'le-gan-nhat',
          nhan: 'Trạng thái trong năm',
          giaTri: `Đã qua ${dsLe.length} lễ`,
          muc: 'binh',
          chiTiet: `Tất cả ngày lễ chính năm âm ${namAmChon} đều đã qua so với hôm nay.`,
        },
    {
      ma: 'tong-so-le',
      nhan: 'Số ngày lễ chính',
      giaTri: `${dsLe.length} ngày lễ`,
      muc: 'binh',
      chiTiet:
        soConLai > 0
          ? `${soConLai} lễ chưa tới hoặc hôm nay, ${soDaQua} lễ đã qua.`
          : 'Không tính tháng nhuận; Giao thừa là ngày cuối tháng Chạp.',
    },
  ];

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/lich-am/ngay-le" toi>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(taoSchemaWebPage(tt)),
        }}
      />

      {/* 1. Chọn năm âm */}
      <section className="ck-lm-muc" aria-label="Chọn năm âm lịch">
        <div className="ck-lm-form-khung">
          <form method="get" action="/lich-am/ngay-le" className="ck-lm-form">
            <label className="ck-lm-truong">
              <span>Chọn năm âm ({NAM_LICH_MUA_TU}–{NAM_LICH_MUA_DEN})</span>
              <select name="nam" defaultValue={String(namAmChon)}>
                {DS_NAM_LICH_MUA.map((n) => (
                  <option key={n} value={n}>
                    {n} · {canChiNam(n).ten}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="ck-nut ck-nut-son ck-lm-nut-44">
              Xem năm âm
            </button>
          </form>

          <nav className="ck-lm-dieu-huong-ngay" aria-label="Chuyển nhanh năm âm">
            {namAmChon > NAM_LICH_MUA_TU ? (
              <Link
                href={`/lich-am/ngay-le?nam=${namAmChon - 1}`}
                className="ck-nut ck-nut-vien ck-lm-nut-44"
              >
                ← Năm {namAmChon - 1}
              </Link>
            ) : null}
            {namAmChon !== namAmHienTai || coLoiNam ? (
              <Link href="/lich-am/ngay-le" className="ck-nut ck-nut-vien ck-lm-nut-44">
                Năm nay ({namAmHienTai})
              </Link>
            ) : null}
            {namAmChon < NAM_LICH_MUA_DEN ? (
              <Link
                href={`/lich-am/ngay-le?nam=${namAmChon + 1}`}
                className="ck-nut ck-nut-vien ck-lm-nut-44"
              >
                Năm {namAmChon + 1} →
              </Link>
            ) : null}
          </nav>
        </div>

        {coLoiNam ? (
          <div className="ck-lm-bao-loi" role="status">
            <p>
              Năm âm <strong>{namTrim}</strong> ngoài phạm vi {NAM_LICH_MUA_TU}–{NAM_LICH_MUA_DEN}.
              Đang hiển thị năm {namAmChon}.
            </p>
          </div>
        ) : null}
      </section>

      {/* 2. Đọc nhanh */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-le-dn">
        <DocNhanh
          tieuDe="Tổng quan năm âm"
          tieuDeId="ck-lm-le-dn"
          luoiCot={3}
          cau={cauDocNhanh}
          the={theDocNhanh}
          trenCau={
            <div className="ck-lm-dau-noi-bat">
              <div>
                <p className={`ck-lm-chinh-to ck-tq-hanh-${hanhSlug}`}>
                  Năm {ccNam.ten} ({namAmChon})
                </p>
                <p className="ck-lm-phu-dong">
                  Mệnh <strong>{napAm(ccNam.can, ccNam.chi)}</strong> · Hành{' '}
                  <strong>{hanhNam}</strong> · {dsLe.length} ngày lễ chính theo âm lịch
                </p>
              </div>
              <Link href="/tet" className="ck-nut ck-nut-vien ck-lm-nut-44">
                Đếm ngược Tết Nguyên Đán
              </Link>
            </div>
          }
        />
      </section>

      {/* 3. Danh sách 11 lễ trong năm âm */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-le-ds-tieu">
        <h2 id="ck-lm-le-ds-tieu" className="ck-lm-tieu">
          Danh sách ngày lễ âm lịch năm {ccNam.ten} ({namAmChon})
        </h2>

        <div className="ck-lm-le-luoi">
          {dsLe.map((le) => {
            const daQua = le.conNgay < 0;
            const laHomNay = le.conNgay === 0;
            const laSapToiDau = sapToiTrongNam?.slug === le.slug && sapToiTrongNam?.duong === le.duong;
            const hrefLe = le.meta?.trangRieng ?? `/lich-am/ngay-le/${le.slug}`;
            const hrefNgay = duongDanNgayTuIso(le.duong);

            const theCls = [
              'ck-lm-le-the',
              daQua ? 'ck-lm-le-qua' : '',
              laSapToiDau ? 'ck-lm-le-toi' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <article key={`${le.slug}-${le.duong}`} className={theCls}>
                <div className="ck-lm-le-dau">
                  <div>
                    <Link href={hrefLe} className="ck-lm-le-ten">
                      {le.ten}
                    </Link>
                    {le.meta?.tenKhac ? (
                      <div className="ck-lm-le-ten-khac">Tên khác: {le.meta.tenKhac}</div>
                    ) : null}
                  </div>

                  {laHomNay ? (
                    <span className="ck-lm-le-dem ck-lm-le-dem-nay">Hôm nay</span>
                  ) : daQua ? (
                    <span className="ck-lm-le-dem ck-lm-le-dem-qua">Đã qua</span>
                  ) : (
                    <span className="ck-lm-le-dem ck-lm-le-dem-toi">
                      Còn {le.conNgay} ngày
                    </span>
                  )}
                </div>

                <p className="ck-lm-le-ngay">
                  Âm lịch: <strong>Ngày {le.am}</strong> (năm {le.canChiNam})
                </p>
                <p className="ck-lm-le-ngay">
                  Dương lịch: <strong>{le.thu}</strong>,{' '}
                  {hrefNgay ? (
                    <Link href={hrefNgay} className="ck-lm-link-ngay">
                      {dinhDangNgayVN(le.duong)}
                    </Link>
                  ) : (
                    <strong>{dinhDangNgayVN(le.duong)}</strong>
                  )}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Ghi chú & Thanh minh */}
      <section className="ck-lm-muc" aria-label="Quy ước tính ngày lễ âm lịch">
        <div className="ck-lm-ghi-chu">
          <p>{GHI_CHU_LE}</p>
          <div className="ck-lm-ghi-chu-hanh-dong">
            <Link href="/tiet-khi/thanh-minh" className="ck-nut ck-nut-vien ck-lm-nut-44">
              Thanh minh là tiết khí, xem ngày ở trang tiết
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Liên kết liên quan */}
      <nav className="ck-lm-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lm-lien-quan-ds">
          <Link href="/tet">Tết Nguyên Đán</Link>
          <Link href="/lich-am/gio-hoang-dao">Giờ hoàng đạo</Link>
          <Link href="/tiet-khi">24 tiết khí</Link>
          <Link href="/lich-am">Lịch âm hôm nay</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

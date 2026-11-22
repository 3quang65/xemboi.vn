import type { Metadata } from 'next';
import Link from 'next/link';
import { AnTieuDe, ChiaVach, HoaVanMay } from '@/components/r1/HoaVanE3';
import { TranhDauTrangDai, TranhDauTrangNen } from '@/components/r1/TranhDauTrang';
import { BieuTuongCamKet, BieuTuongCongCu, type LoaiBieuTuongCongCu } from '@/components/ck/BieuTuongE3';
import FormLaSoNgan from '@/components/ck/FormLaSoNgan';
import { R1_COPY } from '@/lib/r1/copy';
import { menuChinh, trangDaDung } from '@/lib/trang/dieu-huong';
import { homNay } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';

export const revalidate = 3600;

const MAC_DINH_TRANG_CHU = {
  title: 'XemBói.vn – Lá số tử vi, lịch âm, tra mệnh có căn cứ',
};

const LUOI_CONG_CU: { ten: string; href: string; loai: LoaiBieuTuongCongCu }[] = [
  { ten: 'Lập lá số tử vi', href: '/tu-vi/lap-la-so', loai: 'tu-vi' },
  { ten: 'Tử vi 2027', href: '/tu-vi-2027', loai: 'tu-vi-2027' },
  { ten: 'Lịch âm hôm nay', href: '/lich-am', loai: 'lich-am' },
  { ten: 'Sinh năm mệnh gì', href: '/sinh-nam', loai: 'menh' },
  { ten: 'Xem tuổi vợ chồng', href: '/xem-tuoi/vo-chong', loai: 'vo-chong' },
  { ten: 'Lá số bát tự', href: '/bat-tu/lap-la-so', loai: 'bat-tu' },
];

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/', MAC_DINH_TRANG_CHU);
}

export default async function HomePageV2() {
  const [tt, daDung, hubs] = await Promise.all([
    thongTinTrang('/', MAC_DINH_TRANG_CHU),
    Promise.resolve(trangDaDung()),
    Promise.resolve(menuChinh()),
  ]);
  const lich = homNay();
  const camKet = R1_COPY?.hero?.loiHua ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'XemBói.vn',
        url: 'https://xemboi.vn',
        logo: 'https://xemboi.vn/icons/icon.svg',
      },
      {
        '@type': 'WebSite',
        name: 'XemBói.vn',
        url: 'https://xemboi.vn',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* 1. Đầu trang tối: Tranh E3 + H1 + Form rút gọn */}
      <section className="ck-dau-trang ck-toi" aria-labelledby="ck-home-h1">
        <TranhDauTrangNen />
        <TranhDauTrangDai />
        <div className="ck-w">
          <div className="ck-lap">
            <div className="ck-minh-o">
              <h1 id="ck-home-h1">{tt.h1}</h1>
              {tt.description ? <p className="ck-minh-o-phu">{tt.description}</p> : null}
            </div>
            <FormLaSoNgan />
          </div>
        </div>
      </section>

      {/* 2. Dải "Hôm nay theo lịch" (nền ngà) */}
      <section className="ck-sec" aria-labelledby="ck-lich-tieu">
        <div className="ck-w">
          <div className="ck-tieu">
            <AnTieuDe />
            <h2 id="ck-lich-tieu">Hôm nay theo lịch</h2>
            <ChiaVach />
          </div>

          <div className="ck-lich-luoi">
            <aside className="ck-bloc" aria-label="Tờ lịch hôm nay">
              <div className="ck-bloc-gay" aria-hidden="true">
                <i />
                <i />
              </div>
              <div className="ck-bloc-to">
                <div className="ck-bloc-dau">
                  <span>Tháng {lich.duong.thang}</span>
                  <span>{lich.duong.nam}</span>
                </div>
                <div className="ck-bloc-ngay">{lich.duong.ngay}</div>
                <div className="ck-bloc-thu">{lich.thu}</div>
                {lich.ngayLe.length > 0 && (
                  <div className="ck-bloc-le">
                    {lich.ngayLe.map((le) => le.ten).join(' · ')}
                  </div>
                )}
                <div className="ck-bloc-am">
                  <div>
                    <small>Âm lịch</small>
                    <b className="ck-bloc-so-am">{lich.am.ngay}</b>
                    <span className="ck-bloc-th-am">{lich.tenThangAm}</span>
                  </div>
                  <div>
                    <small>Can chi</small>
                    <ul>
                      <li>
                        Ngày <b>{lich.canChiNgay.ten}</b>
                      </li>
                      <li>
                        Tháng <b>{lich.canChiThang.ten}</b>
                      </li>
                      <li>
                        Năm <b>{lich.canChiNam.ten}</b>
                      </li>
                      <li>
                        Tiết <b>{lich.tietKhi.ten}</b>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </aside>

            <div className="ck-lich-chi-tiet">
              <h3>
                {lich.thu}, {lich.duong.ngay}/{lich.duong.thang}/{lich.duong.nam} — {lich.am.ngay}{' '}
                {lich.tenThangAm} năm {lich.canChiNam.ten}
              </h3>

              <dl className="ck-lich-thong-tin">
                <div>
                  <dt>Can chi ngày / tháng / năm</dt>
                  <dd>
                    {lich.canChiNgay.ten} · {lich.canChiThang.ten} · {lich.canChiNam.ten}
                  </dd>
                </div>
                <div>
                  <dt>Tiết khí hiện tại</dt>
                  <dd>
                    {lich.tietKhi.ten}
                    {lich.tietKhi.batDauHomNay ? ' (bắt đầu hôm nay)' : ''}
                  </dd>
                </div>
                {lich.ngayLe.length > 0 && (
                  <div>
                    <dt>Ngày lễ / mốc lịch</dt>
                    <dd>{lich.ngayLe.map((le) => le.ten).join(', ')}</dd>
                  </div>
                )}
              </dl>

              <div>
                <strong>Giờ hoàng đạo hôm nay</strong>
                <ul className="ck-gio-hd-ds">
                  {lich.gioHoangDao.map((g) => (
                    <li key={g.chi}>
                      <b>Giờ {g.chi}</b>
                      <span>{g.khung}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ck-lich-cuoi">
                {daDung.has('/lich-am') ? (
                  <Link href="/lich-am" className="ck-nut ck-nut-vien">
                    Xem lịch tháng
                  </Link>
                ) : (
                  <span className="ck-nhan-sap-co">Xem lịch tháng · Sắp có</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ck-dai-may" aria-hidden="true" />

      {/* 3. Lưới công cụ (tấm sơn mài nhỏ kiểu E3) */}
      <section className="ck-sec ck-sec-kem" aria-labelledby="ck-cong-cu-tieu">
        <div className="ck-w">
          <div className="ck-tieu">
            <AnTieuDe />
            <h2 id="ck-cong-cu-tieu">Công cụ tra cứu</h2>
            <ChiaVach />
          </div>

          <div className="ck-mang">
            {LUOI_CONG_CU.map((o) => {
              const mo = daDung.has(o.href);
              const noiDung = (
                <>
                  <span className="ck-tranh-o">
                    <span className="ck-ic">
                      <BieuTuongCongCu loai={o.loai} />
                    </span>
                  </span>
                  <span className="ck-chu-o">
                    <b>{o.ten}</b>
                  </span>
                  <em className={`ck-nhan-trang-thai${mo ? ' ck-mo' : ''}`}>
                    {mo ? 'Đang mở' : 'Sắp có'}
                  </em>
                </>
              );

              return mo ? (
                <Link key={o.href} href={o.href} className="ck-o-cong-cu">
                  {noiDung}
                </Link>
              ) : (
                <div key={o.href} className="ck-o-cong-cu ck-sap-co" aria-disabled="true">
                  {noiDung}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="ck-chuyen" aria-hidden="true">
        <span>
          <i />
          <HoaVanMay />
          <i />
        </span>
      </div>

      {/* 4. Dải hub (theo menuChinh()) */}
      <section className="ck-sec" aria-labelledby="ck-hub-tieu">
        <div className="ck-w">
          <div className="ck-tieu">
            <AnTieuDe />
            <h2 id="ck-hub-tieu">Chuyên mục tra cứu</h2>
            <ChiaVach />
          </div>

          <div className="ck-hub-luoi">
            {hubs.map((hub) => (
              <article key={hub.href} className="ck-hub-the">
                <h3>
                  {daDung.has(hub.href) ? (
                    <Link href={hub.href}>{hub.ten}</Link>
                  ) : (
                    <span>{hub.ten}</span>
                  )}
                </h3>
                {hub.moTa ? <p>{hub.moTa}</p> : null}
                {hub.con && hub.con.length > 0 && (
                  <ul className="ck-hub-con">
                    {hub.con.map((con) => (
                      <li key={con.href}>
                        {daDung.has(con.href) ? (
                          <Link href={con.href}>{con.ten}</Link>
                        ) : (
                          <span>{con.ten} · Sắp có</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Khối cam kết (nguyên văn từ R1_COPY) */}
      {camKet.length > 0 && (
        <section className="ck-gt" aria-label="Cam kết">
          <div className="ck-w">
            <ul className="ck-tin">
              {camKet.map((cau, i) => (
                <li key={i}>
                  <span className="ck-ic-o" aria-hidden="true">
                    <BieuTuongCamKet chiSo={i} />
                  </span>
                  <div>
                    <b>{cau}</b>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

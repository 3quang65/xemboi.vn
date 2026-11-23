import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  dinhDangNgayVN,
  duongDanNgayTuIso,
  hai,
  trongPhamViNam,
} from '@/components/ck/lichHelpers';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  MA_VIEC_CO_TRANG,
  TEN_NHOM_TRUC,
  VIEC,
  doanThang,
  laMaViec,
  ngayTheoViec,
  phanTichThangXemNgay,
  thangKe,
  thangXemNgay,
  type MaViec,
} from '@/lib/trang/xem-ngay';
import BaHeGiaiThich from '../BaHeGiaiThich';
import KhoiViecThang, { TomTatViec } from '../KhoiViecThang';
import {
  NGUON_LUNAR_BAT_BUOC,
  homNayVaNgayMaiVN,
  macDinhThang,
  macDinhViec,
  muoiHaiThangToi,
  serializeJsonLd,
  taoSchemaWebPage,
  thangXemNgayHopLe,
} from '../XemNgayHelpers';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ma: string }>;
}): Promise<Metadata> {
  const { ma } = await params;

  if (laMaViec(ma)) {
    const homNay = ngayHienTaiVN();
    return metaTrang(
      `/xem-ngay/${ma}`,
      macDinhViec(ma, homNay.nam, homNay.thang),
      undefined,
      { yyyy: homNay.nam, m: homNay.thang },
    );
  }

  const parsed = phanTichThangXemNgay(ma);
  if (parsed) {
    const { nam, thang } = parsed;
    const mm = hai(thang);
    return metaTrang(
      `/xem-ngay/${doanThang(nam, thang)}`,
      macDinhThang(nam, thang),
      '/xem-ngay/thang-{mm}-{yyyy}',
      { yyyy: nam, m: thang, mm },
    );
  }

  notFound();
}

async function TrangViec({ ma }: { ma: MaViec }) {
  const { homNay, homNayIso } = homNayVaNgayMaiVN();
  const viec = VIEC[ma];
  const daDung = trangDaDung();
  const duongDan = `/xem-ngay/${ma}`;

  const tt = await thongTinTrang(
    duongDan,
    macDinhViec(ma, homNay.nam, homNay.thang),
    undefined,
    { yyyy: homNay.nam, m: homNay.thang },
  );

  const duLieuThangNay = ngayTheoViec(ma, homNay.nam, homNay.thang);
  const thangSau = thangKe(homNay.nam, homNay.thang).sau;
  const duLieuThangSau = thangSau
    ? ngayTheoViec(ma, thangSau.nam, thangSau.thang)
    : null;

  const ds12Thang = muoiHaiThangToi(homNay.nam, homNay.thang).map((t) => ({
    ...t,
    doan: doanThang(t.nam, t.thang),
    soHop: ngayTheoViec(ma, t.nam, t.thang).hop.length,
  }));

  const coLinkLichAm = daDung.has('/lich-am');
  const coThangChung = thangXemNgayHopLe(homNay.nam, homNay.thang);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan={duongDan} toi>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(taoSchemaWebPage(tt)),
        }}
      />

      {/* 1. Tóm tắt */}
      <TomTatViec viec={viec} />

      {/* 2. Tháng này và tháng sau */}
      <section className="ck-xn-muc" aria-labelledby="ck-xn-viec-thang-tieu">
        <h2 id="ck-xn-viec-thang-tieu" className="ck-xn-tieu">
          Tháng này và tháng sau
        </h2>
        <div className="ck-xn-hai-thang">
          <KhoiViecThang
            duLieu={duLieuThangNay}
            homNayIso={homNayIso}
            coLinkLichAm={coLinkLichAm}
            hienLinkXemCaThang
            tieuDe={`Tháng này (${homNay.thang}/${homNay.nam})`}
          />
          {duLieuThangSau && thangSau ? (
            <KhoiViecThang
              duLieu={duLieuThangSau}
              homNayIso={homNayIso}
              coLinkLichAm={coLinkLichAm}
              hienLinkXemCaThang
              tieuDe={`Tháng sau (${thangSau.thang}/${thangSau.nam})`}
            />
          ) : null}
        </div>
      </section>

      {/* 3. 12 tháng tới */}
      {ds12Thang.length > 0 ? (
        <section className="ck-xn-muc" aria-labelledby="ck-xn-12-thang-tieu">
          <h2 id="ck-xn-12-thang-tieu" className="ck-xn-tieu">
            12 tháng tới ({viec.ten.toLowerCase()})
          </h2>
          <div className="ck-xn-luoi-thang">
            {ds12Thang.map((o) => (
              <Link
                key={o.doan}
                href={`/xem-ngay/${ma}/${o.doan}`}
                className="ck-xn-o-thang"
              >
                <strong>
                  Tháng {o.thang}/{o.nam}
                </strong>
                <span>{o.soHop} ngày ghi nghi</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* 4. Ba hệ nói gì */}
      <BaHeGiaiThich daDung={daDung} />

      {/* 5. Liên kết cuối */}
      <nav className="ck-xn-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-xn-lien-quan-ds">
          {ma === 'cuoi-hoi' && daDung.has('/xem-tuoi/vo-chong') ? (
            <Link href="/xem-tuoi/vo-chong">Xem tuổi vợ chồng</Link>
          ) : null}
          {daDung.has('/xem-ngay') ? (
            <Link href="/xem-ngay">Tổng hợp xem ngày</Link>
          ) : null}
          {coThangChung ? (
            <Link href={`/xem-ngay/${doanThang(homNay.nam, homNay.thang)}`}>
              Bảng xem ngày tháng {homNay.thang}/{homNay.nam}
            </Link>
          ) : null}
          {daDung.has('/lich-am') ? (
            <Link href="/lich-am">Lịch âm hôm nay</Link>
          ) : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

async function TrangThangChung({ nam, thang }: { nam: number; thang: number }) {
  const mm = hai(thang);
  const doan = doanThang(nam, thang);
  const duongDan = `/xem-ngay/${doan}`;

  const tt = await thongTinTrang(
    duongDan,
    macDinhThang(nam, thang),
    '/xem-ngay/thang-{mm}-{yyyy}',
    { yyyy: nam, m: thang, mm },
  );

  const { homNayIso } = homNayVaNgayMaiVN();
  const dsNgay = thangXemNgay(nam, thang);
  const ke = thangKe(nam, thang);
  const daDung = trangDaDung();
  const coLinkLichAm = daDung.has('/lich-am');

  const doanTruoc =
    ke.truoc && thangXemNgayHopLe(ke.truoc.nam, ke.truoc.thang)
      ? doanThang(ke.truoc.nam, ke.truoc.thang)
      : null;
  const doanSau =
    ke.sau && thangXemNgayHopLe(ke.sau.nam, ke.sau.thang)
      ? doanThang(ke.sau.nam, ke.sau.thang)
      : null;

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={duongDan}
      tenCuoi={`Tháng ${thang}/${nam}`}
      toi
      rong
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(taoSchemaWebPage(tt)),
        }}
      />

      {/* Điều hướng tháng & lọc theo việc */}
      <nav className="ck-xn-dieu-huong" aria-label="Chuyển tháng xem ngày">
        <div className="ck-xn-dieu-huong-thang">
          {doanTruoc && ke.truoc ? (
            <Link href={`/xem-ngay/${doanTruoc}`} className="ck-nut ck-nut-vien">
              ← Tháng {ke.truoc.thang}/{ke.truoc.nam}
            </Link>
          ) : null}
          {daDung.has('/xem-ngay') ? (
            <Link href="/xem-ngay" className="ck-nut ck-nut-vien">
              Tổng hợp xem ngày
            </Link>
          ) : null}
          {doanSau && ke.sau ? (
            <Link href={`/xem-ngay/${doanSau}`} className="ck-nut ck-nut-vien">
              Tháng {ke.sau.thang}/{ke.sau.nam} →
            </Link>
          ) : null}
        </div>

        <div className="ck-xn-loc-viec" aria-label="Lọc theo việc tháng này">
          <span className="ck-xn-loc-nhan">Xem theo việc tháng {thang}/{nam}:</span>
          {MA_VIEC_CO_TRANG.map((v) =>
            daDung.has(`/xem-ngay/${v}`) ? (
              <Link
                key={v}
                href={`/xem-ngay/${v}/${doan}`}
                className="ck-xn-loc-nut"
              >
                {VIEC[v].ten}
              </Link>
            ) : null,
          )}
        </div>
      </nav>

      {/* Bảng cả tháng */}
      <section className="ck-xn-muc" aria-labelledby="ck-xn-bang-thang-full">
        <h2 id="ck-xn-bang-thang-full" className="ck-xn-tieu">
          Bảng 3 hệ tháng {thang}/{nam} ({dsNgay.length} ngày)
        </h2>

        <div className="ck-xn-bang-khung">
          <table className="ck-bang ck-xn-bang ck-xn-bang-thang">
            <thead>
              <tr>
                <th scope="col">Ngày dương</th>
                <th scope="col">Âm lịch</th>
                <th scope="col">Can chi</th>
                <th scope="col">12 thần</th>
                <th scope="col">12 trực</th>
                <th scope="col">Nghi (5 mục đầu)</th>
                <th scope="col">Kỵ (5 mục đầu)</th>
              </tr>
            </thead>
            <tbody>
              {dsNgay.map((x) => {
                const hrefNgay = coLinkLichAm ? duongDanNgayTuIso(x.iso) : null;
                const laHomNay = x.iso === homNayIso;
                const nghiDau = x.nghi.slice(0, 5);
                const kyDau = x.ky.slice(0, 5);
                return (
                  <tr
                    key={x.iso}
                    className={laHomNay ? 'ck-xn-hom-nay' : undefined}
                  >
                    <td data-nhan="Ngày dương" className="ck-xn-cot-duong">
                      <div className="ck-xn-duong-nhom">
                        <span className="ck-xn-thu">
                          {x.lich.thu}
                          {laHomNay ? (
                            <span className="ck-xn-nhan ck-xn-nhan-hn">Hôm nay</span>
                          ) : null}
                        </span>
                        {hrefNgay ? (
                          <Link href={hrefNgay}>{dinhDangNgayVN(x.iso)}</Link>
                        ) : (
                          <span>{dinhDangNgayVN(x.iso)}</span>
                        )}
                      </div>
                    </td>
                    <td data-nhan="Âm lịch" className="ck-xn-cot-am">
                      {x.lich.am.ngay}/{x.lich.am.thang}
                      {x.lich.am.nhuan ? ' nhuận' : ''}
                    </td>
                    <td data-nhan="Can chi" className="ck-xn-cot-canchi">
                      <div className="ck-xn-canchi-nhom">
                        <strong>{x.lich.canChiNgay.ten}</strong>
                        <span className="ck-xn-thang-tiet">
                          Tháng {x.thangTiet.canChi.ten} (tiết khí)
                        </span>
                      </div>
                    </td>
                    <td data-nhan="12 thần" className="ck-xn-cot-he">
                      <div className="ck-xn-he-nhom">
                        <strong>{x.than.ten}</strong>
                        <span
                          className={`ck-xn-nhan ${
                            x.than.hoangDao ? 'ck-xn-hoang' : 'ck-xn-hac'
                          }`}
                        >
                          {x.than.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'}
                        </span>
                      </div>
                    </td>
                    <td data-nhan="12 trực" className="ck-xn-cot-he">
                      <div className="ck-xn-he-nhom">
                        <strong>Trực {x.truc.ten}</strong>
                        <span className={`ck-xn-nhan ck-xn-truc-${x.truc.nhom}`}>
                          {TEN_NHOM_TRUC[x.truc.nhom]}
                        </span>
                      </div>
                    </td>
                    <td data-nhan="Nghi" className="ck-xn-cot-muc">
                      {nghiDau.length > 0 ? (
                        <>
                          {nghiDau.map((m) => m.ten).join(', ')}
                          {x.nghi.length > 5 ? ` (+${x.nghi.length - 5})` : ''}
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td data-nhan="Kỵ" className="ck-xn-cot-muc">
                      {kyDau.length > 0 ? (
                        <>
                          {kyDau.map((m) => m.ten).join(', ')}
                          {x.ky.length > 5 ? ` (+${x.ky.length - 5})` : ''}
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="ck-xn-nguon-dong">{NGUON_LUNAR_BAT_BUOC}</p>
      </section>

      {/* Điều hướng tháng dưới bảng */}
      <div className="ck-xn-dieu-huong-thang ck-xn-dieu-huong-cuoi">
        {doanTruoc && ke.truoc ? (
          <Link href={`/xem-ngay/${doanTruoc}`} className="ck-nut ck-nut-vien">
            ← Tháng {ke.truoc.thang}/{ke.truoc.nam}
          </Link>
        ) : null}
        {doanSau && ke.sau ? (
          <Link href={`/xem-ngay/${doanSau}`} className="ck-nut ck-nut-vien">
            Tháng {ke.sau.thang}/{ke.sau.nam} →
          </Link>
        ) : null}
      </div>

      {/* Ba hệ nói gì */}
      <BaHeGiaiThich daDung={daDung} />

      {/* Liên kết cuối */}
      <nav className="ck-xn-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-xn-lien-quan-ds">
          {daDung.has('/xem-ngay') ? (
            <Link href="/xem-ngay">Tổng hợp xem ngày</Link>
          ) : null}
          {coLinkLichAm && trongPhamViNam(nam) ? (
            <Link href={`/lich-am/${nam}/${mm}`}>
              Lịch âm tháng {thang}/{nam}
            </Link>
          ) : null}
          {coLinkLichAm ? <Link href="/lich-am">Lịch âm hôm nay</Link> : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

export default async function XemNgayMaPage({
  params,
}: {
  params: Promise<{ ma: string }>;
}) {
  const { ma } = await params;

  if (laMaViec(ma)) {
    return <TrangViec ma={ma} />;
  }

  const parsed = phanTichThangXemNgay(ma);
  if (parsed) {
    return <TrangThangChung nam={parsed.nam} thang={parsed.thang} />;
  }

  notFound();
}

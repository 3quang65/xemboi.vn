import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { dinhDangNgayVN, hai, trongPhamViNam } from '@/components/ck/lichHelpers';
import { TheNgayChon } from '@/components/ck/truc-quan';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  MA_VIEC_CO_TRANG,
  VIEC,
  doanThang,
  laMaViec,
  ngayTheoViec,
  phanTichThangXemNgay,
  thangKe,
  thangXemNgay,
  type MaViec,
} from '@/lib/trang/xem-ngay';
import { chonNgayHopNhat } from '@/lib/trang/xem-ngay-truc-quan';
import BaHeGiaiThich from '../BaHeGiaiThich';
import KhoiViecThang, { TomTatViec } from '../KhoiViecThang';
import { BangThangTongHop, LuoiLichXemNgay } from '../LuoiLichXemNgay';
import {
  NGUON_LUNAR_BAT_BUOC,
  homNayVaNgayMaiVN,
  isoTuNgayDuong,
  macDinhThang,
  macDinhViec,
  muoiHaiThangToi,
  serializeJsonLd,
  taoSchemaWebPage,
  thangXemNgayHopLe,
} from '../XemNgayHelpers';

export const revalidate = 3600;

const KHOANG_CHO_PHEP = [30, 60, 90] as const;
type KhoangNgay = (typeof KHOANG_CHO_PHEP)[number];

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function kiemCoThamSo(sp: Record<string, string | string[] | undefined>): boolean {
  return Object.values(sp).some((v) =>
    Array.isArray(v)
      ? v.some((item) => item.trim() !== '')
      : typeof v === 'string' && v.trim() !== '',
  );
}

function phanTichKhoang(sp: Record<string, string | string[] | undefined>): KhoangNgay {
  const raw = layMot(sp.trong)?.trim();
  if (raw === '60') return 60;
  if (raw === '90') return 90;
  return 30;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ ma: string }>;
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [{ ma }, sp] = await Promise.all([params, searchParams]);
  const coThamSo = kiemCoThamSo(sp);

  if (laMaViec(ma)) {
    const homNay = ngayHienTaiVN();
    const base = await metaTrang(
      `/xem-ngay/${ma}`,
      macDinhViec(ma, homNay.nam, homNay.thang),
      undefined,
      { yyyy: homNay.nam, m: homNay.thang },
    );
    if (coThamSo) {
      return {
        ...base,
        alternates: { canonical: `https://xemboi.vn/xem-ngay/${ma}` },
        robots: { index: false, follow: true },
      };
    }
    return base;
  }

  const parsed = phanTichThangXemNgay(ma);
  if (parsed) {
    const { nam, thang } = parsed;
    const mm = hai(thang);
    const doan = doanThang(nam, thang);
    const base = await metaTrang(
      `/xem-ngay/${doan}`,
      macDinhThang(nam, thang),
      '/xem-ngay/thang-{mm}-{yyyy}',
      { yyyy: nam, m: thang, mm },
    );
    if (coThamSo) {
      return {
        ...base,
        alternates: { canonical: `https://xemboi.vn/xem-ngay/${doan}` },
        robots: { index: false, follow: true },
      };
    }
    return base;
  }

  notFound();
}

async function TrangViec({ ma, trong }: { ma: MaViec; trong: KhoangNgay }) {
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

  const kqChon = chonNgayHopNhat(ma, homNay, trong, 3);
  const tuStr = dinhDangNgayVN(isoTuNgayDuong(kqChon.tu));
  const denStr = dinhDangNgayVN(isoTuNgayDuong(kqChon.den));

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

      {/* 1. Ngày hợp nhất cho việc (Lệnh 41.3) */}
      <section className="ck-xn-muc" aria-labelledby="ck-xn-hop-nhat-tieu">
        <div className="ck-xn-the ck-xn-tom-tat-viec">
          <div className="ck-xn-hop-nhat-dau">
            <h2 id="ck-xn-hop-nhat-tieu" className="ck-xn-tieu-nho">
              Ngày hợp nhất cho {viec.ten.toLowerCase()}
            </h2>
            <nav className="ck-xn-khoang" aria-label="Chọn khoảng ngày tìm">
              {KHOANG_CHO_PHEP.map((k) => {
                const dangChon = k === trong;
                return (
                  <Link
                    key={k}
                    href={`/xem-ngay/${ma}?trong=${k}`}
                    className={
                      dangChon
                        ? 'ck-xn-khoang-nut ck-xn-khoang-on'
                        : 'ck-xn-khoang-nut'
                    }
                    aria-current={dangChon ? 'page' : undefined}
                  >
                    {k} ngày
                  </Link>
                );
              })}
            </nav>
          </div>

          <p className="ck-xn-chon-tom-tat">
            Từ <strong>{tuStr}</strong> tới <strong>{denStr}</strong>:{' '}
            <strong>{kqChon.dem.hop}</strong> ngày bảng ghi nên,{' '}
            <strong>{kqChon.dem.ky}</strong> ngày ghi kỵ.
          </p>

          {kqChon.chon.length > 0 ? (
            <div className="ck-tq-nc-ds">
              {kqChon.chon.map((n) => (
                <TheNgayChon key={n.iso} ngay={n} coLink={coLinkLichAm} />
              ))}
            </div>
          ) : (
            <div className="ck-xn-trong">
              <p>
                Trong {trong} ngày tới (từ {tuStr} tới {denStr}), bảng nghi kỵ
                không có ngày nào ghi nên {viec.ten.toLowerCase()} mà không kỵ.
              </p>
              {trong < 90 ? (
                <p>
                  Bạn nên chọn khoảng dài hơn:{' '}
                  {trong < 60 ? (
                    <>
                      <Link href={`/xem-ngay/${ma}?trong=60`}>60 ngày</Link>
                      {' hoặc '}
                    </>
                  ) : null}
                  <Link href={`/xem-ngay/${ma}?trong=90`}>90 ngày</Link>.
                </p>
              ) : null}
            </div>
          )}

          <div className="ck-xn-chon-hanh-dong">
            {kqChon.chon.length > 0 ? (
              <a
                href={`/xem-ngay/${ma}/lich.ics?soNgay=${trong}`}
                download
                className="ck-nut ck-nut-vien ck-xn-ics-nut"
              >
                Tải về lịch (.ics)
              </a>
            ) : null}

            <details className="ck-xn-chi-tiet ck-xn-cach-xep">
              <summary>Cách xếp</summary>
              <ol className="ck-xn-tieu-chi">
                {kqChon.tieuChi.map((cau, i) => (
                  <li key={i}>{cau}</li>
                ))}
              </ol>
              <p className="ck-xn-cach-xep-gc">{kqChon.ghiChu}</p>
            </details>
          </div>
        </div>
      </section>

      {/* 2. Tóm tắt tiêu chí lọc */}
      <TomTatViec viec={viec} />

      {/* 3. Tháng này và tháng sau (lưới lịch 7 cột + bảng chi tiết) */}
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

      {/* 4. 12 tháng tới */}
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

      {/* 5. Ba hệ nói gì */}
      <BaHeGiaiThich daDung={daDung} />

      {/* 6. Liên kết cuối */}
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
            <Link
              href={`/xem-ngay/${doanTruoc}`}
              className="ck-nut ck-nut-vien ck-xn-nut-44"
            >
              ← Tháng {ke.truoc.thang}/{ke.truoc.nam}
            </Link>
          ) : null}
          {daDung.has('/xem-ngay') ? (
            <Link href="/xem-ngay" className="ck-nut ck-nut-vien ck-xn-nut-44">
              Tổng hợp xem ngày
            </Link>
          ) : null}
          {doanSau && ke.sau ? (
            <Link
              href={`/xem-ngay/${doanSau}`}
              className="ck-nut ck-nut-vien ck-xn-nut-44"
            >
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

      {/* Lưới lịch 7 cột + bảng chi tiết */}
      <section className="ck-xn-muc" aria-labelledby="ck-xn-bang-thang-full">
        <div className="ck-xn-the">
          <h2 id="ck-xn-bang-thang-full" className="ck-xn-tieu">
            Bảng 3 hệ tháng {thang}/{nam} ({dsNgay.length} ngày)
          </h2>

          <LuoiLichXemNgay
            cheDo="tong-hop"
            nam={nam}
            thang={thang}
            ngayXem={dsNgay}
            homNayIso={homNayIso}
            coLinkLichAm={coLinkLichAm}
          />

          <details className="ck-xn-chi-tiet">
            <summary>Xem dạng bảng ({dsNgay.length} ngày)</summary>
            <BangThangTongHop
              dsNgay={dsNgay}
              homNayIso={homNayIso}
              coLinkLichAm={coLinkLichAm}
            />
          </details>

          <p className="ck-xn-nguon-dong">{NGUON_LUNAR_BAT_BUOC}</p>
        </div>
      </section>

      {/* Điều hướng tháng dưới bảng */}
      <div className="ck-xn-dieu-huong-thang ck-xn-dieu-huong-cuoi">
        {doanTruoc && ke.truoc ? (
          <Link
            href={`/xem-ngay/${doanTruoc}`}
            className="ck-nut ck-nut-vien ck-xn-nut-44"
          >
            ← Tháng {ke.truoc.thang}/{ke.truoc.nam}
          </Link>
        ) : null}
        {doanSau && ke.sau ? (
          <Link
            href={`/xem-ngay/${doanSau}`}
            className="ck-nut ck-nut-vien ck-xn-nut-44"
          >
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
  searchParams,
}: {
  params: Promise<{ ma: string }>;
  searchParams: SearchParamsInput;
}) {
  const [{ ma }, sp] = await Promise.all([params, searchParams]);

  if (laMaViec(ma)) {
    return <TrangViec ma={ma} trong={phanTichKhoang(sp)} />;
  }

  const parsed = phanTichThangXemNgay(ma);
  if (parsed) {
    return <TrangThangChung nam={parsed.nam} thang={parsed.thang} />;
  }

  notFound();
}

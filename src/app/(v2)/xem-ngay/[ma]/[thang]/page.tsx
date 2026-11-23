import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { hai } from '@/components/ck/lichHelpers';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  VIEC,
  doanThang,
  laMaViec,
  ngayTheoViec,
  phanTichThangXemNgay,
  thangKe,
} from '@/lib/trang/xem-ngay';
import BaHeGiaiThich from '../../BaHeGiaiThich';
import KhoiViecThang, { TomTatViec } from '../../KhoiViecThang';
import {
  homNayVaNgayMaiVN,
  macDinhViecThang,
  serializeJsonLd,
  taoSchemaWebPage,
  thangXemNgayHopLe,
} from '../../XemNgayHelpers';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ma: string; thang: string }>;
}): Promise<Metadata> {
  const { ma, thang: doan } = await params;
  if (!laMaViec(ma)) notFound();
  const parsed = phanTichThangXemNgay(doan);
  if (!parsed) notFound();

  const { nam, thang } = parsed;
  const mm = hai(thang);
  return metaTrang(
    `/xem-ngay/${ma}/${doanThang(nam, thang)}`,
    macDinhViecThang(ma, nam, thang),
    '/xem-ngay/{viec}/thang-{mm}-{yyyy}',
    {
      yyyy: nam,
      m: thang,
      mm,
      viec: ma,
      'việc': VIEC[ma].ten.toLowerCase(),
    },
  );
}

export default async function XemNgayViecThangPage({
  params,
}: {
  params: Promise<{ ma: string; thang: string }>;
}) {
  const { ma, thang: doan } = await params;
  if (!laMaViec(ma)) notFound();
  const parsed = phanTichThangXemNgay(doan);
  if (!parsed) notFound();

  const { nam, thang } = parsed;
  const mm = hai(thang);
  const doanChuan = doanThang(nam, thang);
  const duongDan = `/xem-ngay/${ma}/${doanChuan}`;
  const viec = VIEC[ma];

  const tt = await thongTinTrang(
    duongDan,
    macDinhViecThang(ma, nam, thang),
    '/xem-ngay/{viec}/thang-{mm}-{yyyy}',
    {
      yyyy: nam,
      m: thang,
      mm,
      viec: ma,
      'việc': viec.ten.toLowerCase(),
    },
  );

  const duLieu = ngayTheoViec(ma, nam, thang);
  const ke = thangKe(nam, thang);
  const { homNayIso } = homNayVaNgayMaiVN();
  const daDung = trangDaDung();

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
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(taoSchemaWebPage(tt)),
        }}
      />

      {/* 1. Tóm tắt việc */}
      <TomTatViec viec={viec} />

      {/* 2. Điều hướng nhanh */}
      <nav className="ck-xn-dieu-huong" aria-label="Điều hướng tháng theo việc">
        <div className="ck-xn-dieu-huong-thang">
          {doanTruoc && ke.truoc ? (
            <Link
              href={`/xem-ngay/${ma}/${doanTruoc}`}
              className="ck-nut ck-nut-vien"
            >
              ← Tháng {ke.truoc.thang}/{ke.truoc.nam}
            </Link>
          ) : null}
          {daDung.has(`/xem-ngay/${ma}`) ? (
            <Link href={`/xem-ngay/${ma}`} className="ck-nut ck-nut-vien">
              Xem ngày {viec.ten.toLowerCase()} (chung)
            </Link>
          ) : null}
          {thangXemNgayHopLe(nam, thang) ? (
            <Link
              href={`/xem-ngay/${doanChuan}`}
              className="ck-nut ck-nut-vien"
            >
              Bảng cả tháng {thang}/{nam}
            </Link>
          ) : null}
          {doanSau && ke.sau ? (
            <Link
              href={`/xem-ngay/${ma}/${doanSau}`}
              className="ck-nut ck-nut-vien"
            >
              Tháng {ke.sau.thang}/{ke.sau.nam} →
            </Link>
          ) : null}
        </div>
      </nav>

      {/* 3. Danh sách ngày trong tháng */}
      <section className="ck-xn-muc" aria-labelledby="ck-xn-vt-danh-sach">
        <h2 id="ck-xn-vt-danh-sach" className="ck-xn-tieu">
          Ngày {viec.ten.toLowerCase()} tháng {thang}/{nam}
        </h2>
        <KhoiViecThang
          duLieu={duLieu}
          homNayIso={homNayIso}
          coLinkLichAm={daDung.has('/lich-am')}
          hienLinkXemCaThang={false}
          hienNgayKhac
          tieuDe={`Tổng hợp tháng ${thang}/${nam}`}
        />
      </section>

      {/* 4. Ba hệ nói gì */}
      <BaHeGiaiThich daDung={daDung} />

      {/* 5. Liên kết cuối */}
      <nav className="ck-xn-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-xn-lien-quan-ds">
          {ma === 'cuoi-hoi' && daDung.has('/xem-tuoi/vo-chong') ? (
            <Link href="/xem-tuoi/vo-chong">Xem tuổi vợ chồng</Link>
          ) : null}
          {daDung.has(`/xem-ngay/${ma}`) ? (
            <Link href={`/xem-ngay/${ma}`}>Xem ngày {viec.ten.toLowerCase()}</Link>
          ) : null}
          {thangXemNgayHopLe(nam, thang) ? (
            <Link href={`/xem-ngay/${doanChuan}`}>
              Bảng xem ngày tháng {thang}/{nam}
            </Link>
          ) : null}
          {daDung.has('/xem-ngay') ? (
            <Link href="/xem-ngay">Tổng hợp xem ngày</Link>
          ) : null}
          {daDung.has('/lich-am') ? (
            <Link href="/lich-am">Lịch âm hôm nay</Link>
          ) : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

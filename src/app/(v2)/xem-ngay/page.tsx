import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  dinhDangNgayVN,
  duongDanNgayTuIso,
  nhanNgayAmChu,
} from '@/components/ck/lichHelpers';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  MA_VIEC_CO_TRANG,
  TEN_NHOM_TRUC,
  VIEC,
  doanThang,
  ngayTheoViec,
  thangKe,
  xemNgay,
  type Muc,
} from '@/lib/trang/xem-ngay';
import BaHeGiaiThich from './BaHeGiaiThich';
import {
  NGUON_LUNAR_BAT_BUOC,
  homNayVaNgayMaiVN,
  macDinhHub,
  serializeJsonLd,
  taoSchemaWebPage,
  thangXemNgayHopLe,
} from './XemNgayHelpers';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/xem-ngay', macDinhHub());
}

function DanhSachNghiKyThuGon({
  nhan,
  danhSach,
  gioiHan = 8,
}: {
  nhan: string;
  danhSach: Muc[];
  gioiHan?: number;
}) {
  const dau = danhSach.slice(0, gioiHan);
  const conLai = danhSach.slice(gioiHan);

  return (
    <div className="ck-xn-nghi-ky-nhom">
      <h4>{nhan}</h4>
      {danhSach.length === 0 ? (
        <p className="ck-xn-khong-co">Không có</p>
      ) : (
        <>
          <ul className="ck-xn-chip-ds">
            {dau.map((m) => (
              <li key={m.han} className="ck-xn-chip">
                {m.ten}
              </li>
            ))}
          </ul>
          {conLai.length > 0 ? (
            <details className="ck-xn-them">
              <summary>và {conLai.length} việc khác</summary>
              <ul className="ck-xn-chip-ds ck-xn-chip-ds-con">
                {conLai.map((m) => (
                  <li key={m.han} className="ck-xn-chip">
                    {m.ten}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </>
      )}
    </div>
  );
}

export default async function XemNgayHubPage() {
  const macDinh = macDinhHub();
  const tt = await thongTinTrang('/xem-ngay', macDinh);
  const { homNay, ngayMai } = homNayVaNgayMaiVN();
  const hn = xemNgay(homNay.ngay, homNay.thang, homNay.nam);
  const nm = xemNgay(ngayMai.ngay, ngayMai.thang, ngayMai.nam);
  const daDung = trangDaDung();
  const ke = thangKe(homNay.nam, homNay.thang);

  const coLinkLichAm = daDung.has('/lich-am');
  const hrefHomNay = coLinkLichAm ? duongDanNgayTuIso(hn.iso) : null;
  const hrefNgayMai = coLinkLichAm ? duongDanNgayTuIso(nm.iso) : null;

  const dsViec = MA_VIEC_CO_TRANG.map((ma) => ({
    ma,
    ten: VIEC[ma].ten,
    soHop: ngayTheoViec(ma, homNay.nam, homNay.thang).hop.length,
    href: `/xem-ngay/${ma}`,
  }));

  const doanThangNay = doanThang(homNay.nam, homNay.thang);
  const coThangNay = thangXemNgayHopLe(homNay.nam, homNay.thang);
  const doanThangSau = ke.sau ? doanThang(ke.sau.nam, ke.sau.thang) : null;
  const coThangSau = ke.sau
    ? thangXemNgayHopLe(ke.sau.nam, ke.sau.thang)
    : false;

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/xem-ngay" toi>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(taoSchemaWebPage(tt)),
        }}
      />

      {/* 1. Hôm nay và ngày mai */}
      <section className="ck-xn-muc" aria-labelledby="ck-xn-hom-nay-tieu">
        <div className="ck-xn-hom-nay-luoi">
          {/* Thẻ chính: Hôm nay */}
          <article className="ck-xn-the ck-xn-the-hom-nay">
            <div className="ck-xn-ngay-dau">
              <div>
                <h2 id="ck-xn-hom-nay-tieu" className="ck-xn-tieu-nho">
                  Hôm nay: {hn.lich.thu}, {dinhDangNgayVN(hn.iso)}
                </h2>
                <p className="ck-xn-am-lich">
                  Âm lịch:{' '}
                  <strong>
                    {nhanNgayAmChu(hn.lich.am.ngay, true)} {hn.lich.tenThangAm} năm{' '}
                    {hn.lich.canChiNam.ten}
                  </strong>
                </p>
              </div>
              {hrefHomNay ? (
                <Link href={hrefHomNay} className="ck-nut ck-nut-vien">
                  Chi tiết ngày {dinhDangNgayVN(hn.iso)}
                </Link>
              ) : null}
            </div>

            <dl className="ck-xn-can-chi-khung">
              <div>
                <dt>Can chi ngày</dt>
                <dd>
                  <strong>{hn.lich.canChiNgay.ten}</strong>{' '}
                  <span lang="zh-Hant" className="ck-xn-han">
                    ({hn.ngayHan})
                  </span>
                </dd>
              </div>
              <div>
                <dt>Tháng (theo tiết khí)</dt>
                <dd>
                  <strong>{hn.thangTiet.canChi.ten}</strong>{' '}
                  <span lang="zh-Hant" className="ck-xn-han">
                    ({hn.thangTiet.han})
                  </span>
                </dd>
              </div>
            </dl>

            {/* Ba lớp đặt cạnh nhau, không gộp */}
            <div className="ck-xn-ba-lop">
              <div className="ck-xn-lop">
                <h3>Lớp 1 · 12 thần</h3>
                <p className="ck-xn-lop-gia-tri">
                  <strong>{hn.than.ten}</strong>{' '}
                  <span lang="zh-Hant" className="ck-xn-han">
                    ({hn.than.han})
                  </span>
                </p>
                <span
                  className={`ck-xn-nhan ${
                    hn.than.hoangDao ? 'ck-xn-hoang' : 'ck-xn-hac'
                  }`}
                >
                  {hn.than.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'}
                </span>
              </div>

              <div className="ck-xn-lop">
                <h3>Lớp 2 · 12 trực</h3>
                <p className="ck-xn-lop-gia-tri">
                  <strong>Trực {hn.truc.ten}</strong>{' '}
                  <span lang="zh-Hant" className="ck-xn-han">
                    ({hn.truc.han})
                  </span>
                </p>
                <span className={`ck-xn-nhan ck-xn-truc-${hn.truc.nhom}`}>
                  {TEN_NHOM_TRUC[hn.truc.nhom]}
                </span>
                {hn.truc.viec !== null ? (
                  <p className="ck-xn-truc-viec">Câu ca ghi: {hn.truc.viec}</p>
                ) : null}
              </div>

              <div className="ck-xn-lop ck-xn-lop-nghi-ky">
                <h3>Lớp 3 · Nghi, kỵ, cát thần, hung sát</h3>
                <div className="ck-xn-nghi-ky-luoi">
                  <DanhSachNghiKyThuGon nhan="Nghi (nên làm)" danhSach={hn.nghi} />
                  <DanhSachNghiKyThuGon nhan="Kỵ (tránh làm)" danhSach={hn.ky} />
                </div>
                <div className="ck-xn-than-sat-luoi">
                  <DanhSachNghiKyThuGon
                    nhan="Cát thần"
                    danhSach={hn.catThan}
                  />
                  <DanhSachNghiKyThuGon
                    nhan="Hung sát"
                    danhSach={hn.hungSat}
                  />
                </div>
                <p className="ck-xn-nguon-dong">{NGUON_LUNAR_BAT_BUOC}</p>
              </div>
            </div>
          </article>

          {/* Thẻ nhỏ: Ngày mai */}
          <aside className="ck-xn-the ck-xn-the-ngay-mai" aria-label="Xem ngày mai">
            <h2 className="ck-xn-tieu-nho">
              Ngày mai: {nm.lich.thu}, {dinhDangNgayVN(nm.iso)}
            </h2>
            <p className="ck-xn-am-lich">
              Âm lịch:{' '}
              <strong>
                {nhanNgayAmChu(nm.lich.am.ngay, true)} {nm.lich.tenThangAm}
              </strong>
            </p>
            <p className="ck-xn-ngay-mai-dong">
              Ngày <strong>{nm.lich.canChiNgay.ten}</strong> · Tháng (theo tiết khí){' '}
              <strong>{nm.thangTiet.canChi.ten}</strong>
            </p>

            <ul className="ck-xn-ngay-mai-he">
              <li>
                <span>12 thần:</span>{' '}
                <strong>{nm.than.ten}</strong>{' '}
                <span
                  className={`ck-xn-nhan ${
                    nm.than.hoangDao ? 'ck-xn-hoang' : 'ck-xn-hac'
                  }`}
                >
                  {nm.than.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'}
                </span>
              </li>
              <li>
                <span>12 trực:</span>{' '}
                <strong>Trực {nm.truc.ten}</strong>{' '}
                <span className={`ck-xn-nhan ck-xn-truc-${nm.truc.nhom}`}>
                  {TEN_NHOM_TRUC[nm.truc.nhom]}
                </span>
                {nm.truc.viec !== null ? (
                  <span className="ck-xn-ngay-mai-viec"> · {nm.truc.viec}</span>
                ) : null}
              </li>
            </ul>

            {hrefNgayMai ? (
              <Link href={hrefNgayMai} className="ck-nut ck-nut-vien ck-xn-nut-gon">
                Chi tiết ngày mai
              </Link>
            ) : null}
          </aside>
        </div>
      </section>

      {/* 2. Chọn theo việc */}
      <section className="ck-xn-muc" aria-labelledby="ck-xn-viec-tieu">
        <h2 id="ck-xn-viec-tieu" className="ck-xn-tieu">
          Chọn ngày theo việc (tháng {homNay.thang}/{homNay.nam})
        </h2>
        <div className="ck-xn-viec-luoi">
          {dsViec.map((v) => {
            const coTrang = daDung.has(v.href);
            return coTrang ? (
              <Link key={v.ma} href={v.href} className="ck-xn-viec-the">
                <strong className="ck-xn-viec-ten">{v.ten}</strong>
                <span className="ck-xn-viec-dem">
                  {v.soHop} ngày ghi nghi tháng {homNay.thang}/{homNay.nam}
                </span>
              </Link>
            ) : (
              <div key={v.ma} className="ck-xn-viec-the ck-xn-viec-tinh">
                <strong className="ck-xn-viec-ten">{v.ten}</strong>
                <span className="ck-xn-viec-dem">
                  {v.soHop} ngày ghi nghi tháng {homNay.thang}/{homNay.nam}
                </span>
              </div>
            );
          })}

          {daDung.has('/xem-ngay/xuat-hanh') ? (
            <Link href="/xem-ngay/xuat-hanh" className="ck-xn-viec-the ck-xn-viec-tet">
              <strong className="ck-xn-viec-ten">Giờ xuất hành Tết</strong>
              <span className="ck-xn-viec-dem">
                Mùng 1–10 Tết: 6 giờ hoàng đạo &amp; hướng thần
              </span>
            </Link>
          ) : null}
        </div>
      </section>

      {/* 3. Bảng tháng này */}
      {coThangNay || (coThangSau && doanThangSau) ? (
        <section className="ck-xn-muc" aria-labelledby="ck-xn-bang-thang-tieu">
          <div className="ck-xn-the ck-xn-thang-bar">
            <div>
              <h2 id="ck-xn-bang-thang-tieu" className="ck-xn-tieu-nho">
                Bảng xem ngày cả tháng
              </h2>
              <p className="ck-xn-vi-tri">
                Đầy đủ từng ngày dương, âm lịch, 12 thần, 12 trực và 5 mục nghi/kỵ đầu.
              </p>
            </div>
            <div className="ck-xn-thang-nut">
              {coThangNay ? (
                <Link
                  href={`/xem-ngay/${doanThangNay}`}
                  className="ck-nut ck-nut-son"
                >
                  Bảng tháng {homNay.thang}/{homNay.nam}
                </Link>
              ) : null}
              {coThangSau && ke.sau && doanThangSau ? (
                <Link
                  href={`/xem-ngay/${doanThangSau}`}
                  className="ck-nut ck-nut-vien"
                >
                  Bảng tháng {ke.sau.thang}/{ke.sau.nam} →
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* 4. Ba hệ nói gì, theo sách nào */}
      <BaHeGiaiThich daDung={daDung} />

      {/* 5. Liên kết liên quan */}
      <nav className="ck-xn-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-xn-lien-quan-ds">
          {daDung.has('/lich-am') ? (
            <Link href="/lich-am">Lịch âm hôm nay</Link>
          ) : null}
          {daDung.has('/xem-ngay/xuat-hanh') ? (
            <Link href="/xem-ngay/xuat-hanh">Giờ xuất hành Tết</Link>
          ) : null}
          {daDung.has('/xem-tuoi/vo-chong') ? (
            <Link href="/xem-tuoi/vo-chong">Xem tuổi vợ chồng</Link>
          ) : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

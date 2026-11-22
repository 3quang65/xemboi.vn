import type { Metadata } from 'next';
import Link from 'next/link';
import ChonNamSinh from '@/components/ck/ChonNamSinh';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { HuyHieuHanh, NguonNapAm } from '@/components/ck/TheCanChi';
import { HANH_CLASS } from '@/components/ck/canChiHelpers';
import { NGU_HANH, danhSachNamSinh } from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_SINH_NAM = {
  title: 'Tra năm sinh mệnh gì, tuổi con gì (1930–2030)',
  h1: 'Tra mệnh theo năm sinh',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/sinh-nam', MAC_DINH_SINH_NAM),
    noiDungTheoDuongDan('/sinh-nam'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function SinhNamIndexPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/sinh-nam', MAC_DINH_SINH_NAM),
    noiDungTheoDuongDan('/sinh-nam'),
  ]);
  const nhomNam = danhSachNamSinh();

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/sinh-nam" toi>
      <section className="ck-td-muc" aria-label="Tra nhanh năm sinh">
        <ChonNamSinh nhan="Bạn sinh năm nào? (1930–2030)" chuNut="Xem chi tiết" />

        <nav className="ck-thap-ky-nhay" aria-label="Nhảy nhanh theo thập kỷ">
          {nhomNam.map((nh) => (
            <a key={nh.thapKy} href={`#thap-ky-${nh.thapKy}`}>
              {nh.thapKy}s
            </a>
          ))}
        </nav>

        <div className="ck-thap-ky-nhay" aria-label="Màu đánh dấu theo ngũ hành">
          {NGU_HANH.map((h) => (
            <HuyHieuHanh key={h} hanh={h} lienKet />
          ))}
        </div>
      </section>

      {nhomNam.map((nh) => (
        <section
          key={nh.thapKy}
          id={`thap-ky-${nh.thapKy}`}
          className="ck-thap-ky"
          aria-labelledby={`tieu-de-${nh.thapKy}`}
        >
          <h2 id={`tieu-de-${nh.thapKy}`}>Thập kỷ {nh.thapKy}</h2>
          <div className="ck-nam-luoi">
            {nh.nam.map((item) => (
              <Link
                key={item.nam}
                href={`/sinh-nam/${item.nam}`}
                className={`ck-nam-o ${HANH_CLASS[item.hanh]}`}
              >
                <strong>{item.nam}</strong>
                <b>{item.canChi}</b>
                <span>
                  {item.napAm} · {item.hanh}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <NguonNapAm />

      <KhoiDienGiai noiDung={nd} tieuDe="Cách tra năm sinh mệnh gì" />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Xem thêm trong bộ Can chi &amp; mệnh</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/can-chi">Tổng quan Can chi &amp; mệnh</Link>
          <Link href="/can-chi/60-hoa-giap">Bảng 60 hoa giáp</Link>
          <Link href="/nap-am">Bảng 30 nạp âm</Link>
          <Link href="/ngu-hanh">Ngũ hành tương sinh – khắc</Link>
          <Link href="/ngu-hanh/mau-hop-menh">Bảng màu hợp mệnh</Link>
          <Link href="/con-giap">12 con giáp</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

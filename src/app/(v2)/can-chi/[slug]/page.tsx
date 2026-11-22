import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { HuyHieuHanh, NguonNapAm } from '@/components/ck/TheCanChi';
import {
  duongDanConGiap,
  duongDanHanh,
  hoaGiapLanCan,
} from '@/components/ck/canChiHelpers';
import {
  HOA_GIAP,
  hoaGiapTheoSlug,
  namCuaHoaGiap,
  namSinhHopLe,
  type HoaGiap,
} from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

function taoThamSoHoaGiap(hg: HoaGiap, namLienQuan: number[]) {
  return {
    'Can Chi': hg.ten,
    'Nạp âm': hg.napAm,
    n: hg.stt,
    'danh sách': namLienQuan.join(', '),
  };
}

function macDinhHoaGiap(hg: HoaGiap) {
  return {
    title: `Tuổi ${hg.ten}: năm sinh, mệnh ${hg.napAm}, tính chất`,
    h1: `Tuổi ${hg.ten}`,
  };
}

export function generateStaticParams() {
  return HOA_GIAP.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hg = hoaGiapTheoSlug(slug);
  if (!hg) notFound();

  const namLienQuan = namCuaHoaGiap(hg, 1900, 2100);
  const duongDan = `/can-chi/${hg.slug}`;
  const [meta, nd] = await Promise.all([
    metaTrang(
      duongDan,
      macDinhHoaGiap(hg),
      '/can-chi/{can}-{chi}',
      taoThamSoHoaGiap(hg, namLienQuan),
    ),
    noiDungTheoDuongDan(duongDan),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function HoaGiapChiTietPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hg = hoaGiapTheoSlug(slug);
  if (!hg) notFound();

  const namLienQuan = namCuaHoaGiap(hg, 1900, 2100);
  const duongDan = `/can-chi/${hg.slug}`;
  const [ttTrang, nd] = await Promise.all([
    thongTinTrang(
      duongDan,
      macDinhHoaGiap(hg),
      '/can-chi/{can}-{chi}',
      taoThamSoHoaGiap(hg, namLienQuan),
    ),
    noiDungTheoDuongDan(duongDan),
  ]);
  const { truoc, sau } = hoaGiapLanCan(hg.stt);

  return (
    <KhungTrang
      tieuDe={ttTrang.h1}
      phu={ttTrang.description}
      duongDan={duongDan}
      tenCuoi={hg.ten}
      toi
    >
      <section className="ck-tom-tat-menh" aria-label={`Thông tin hoa giáp ${hg.ten}`}>
        <div className="ck-luoi-4">
          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Thứ tự Hoa Giáp</span>
            <strong className="ck-gia-lon">{hg.stt} / 60</strong>
            <p>Âm dương: {hg.amDuong}</p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Can · Chi</span>
            <strong className="ck-gia-lon">
              {hg.can} · {hg.chi}
            </strong>
            <p>Thiên can {hg.can}, địa chi {hg.chi}</p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Mệnh Nạp Âm</span>
            <strong className="ck-gia-lon">
              <Link href={`/nap-am/${hg.slugNapAm}`}>{hg.napAm}</Link>
            </strong>
            <p>
              Hành: <HuyHieuHanh hanh={hg.hanh} lienKet />
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Con giáp</span>
            <strong className="ck-gia-lon">
              <Link href={duongDanConGiap(hg.chi)}>
                {hg.chi} ({hg.conGiap})
              </Link>
            </strong>
            <p>Chu kỳ lặp lại mỗi 60 năm</p>
          </div>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-hg-cac-nam">
        <h2 id="ck-hg-cac-nam" className="ck-td-tieu">
          Các năm {hg.ten} trong khoảng 1900–2100
        </h2>
        <div className="ck-nam-ds">
          {namLienQuan.map((y) =>
            namSinhHopLe(y) ? (
              <Link key={y} href={`/sinh-nam/${y}`} className="ck-nam-the">
                {y}
              </Link>
            ) : (
              <span key={y} className="ck-nam-the">
                {y}
              </span>
            ),
          )}
        </div>
        <NguonNapAm />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe={`Ý nghĩa tuổi ${hg.ten}`} />

      <nav className="ck-dieu-huong" aria-label="Điều hướng trong 60 hoa giáp">
        <Link href={`/can-chi/${truoc.slug}`} className="ck-nut ck-nut-vien">
          ← {truoc.stt}. {truoc.ten}
        </Link>
        <Link href="/can-chi/60-hoa-giap" className="ck-nut ck-nut-vien">
          Bảng 60 hoa giáp
        </Link>
        <Link href={`/can-chi/${sau.slug}`} className="ck-nut ck-nut-vien">
          {sau.stt}. {sau.ten} →
        </Link>
      </nav>

      <nav className="ck-lien-quan" aria-label="Liên kết cùng bộ">
        <h2>Xem thêm liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href={`/nap-am/${hg.slugNapAm}`}>Nạp âm {hg.napAm}</Link>
          <Link href={duongDanHanh(hg.hanh)}>Mệnh {hg.hanh}</Link>
          <Link href={duongDanConGiap(hg.chi)}>
            Tuổi {hg.chi} ({hg.conGiap})
          </Link>
          <Link href="/sinh-nam">Tra mệnh theo năm sinh</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

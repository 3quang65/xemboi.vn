import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { VongNguHanh } from '@/components/ck/truc-quan';
import { DanhSachMau, HuyHieuHanh, NguonNapAm } from '@/components/ck/TheCanChi';
import {
  NAP_AM_HAN,
  duongDanConGiap,
  duongDanHanh,
} from '@/components/ck/canChiHelpers';
import {
  NAP_AM,
  mauHopMenh,
  namCuaHoaGiap,
  namSinhHopLe,
  napAmTheoSlug,
  quanHeHanh,
  type NapAm,
} from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

function taoThamSoNapAm(na: NapAm) {
  return {
    'Nạp âm': na.ten,
    'Hán': NAP_AM_HAN[na.slug] ?? '',
    'Can Chi 1': na.hoaGiap[0].ten,
    'Can Chi 2': na.hoaGiap[1].ten,
  };
}

function macDinhNapAm(na: NapAm) {
  return {
    title: `${na.ten} là gì? Mệnh ${na.ten} sinh năm nào`,
    h1: `${na.ten} là gì`,
  };
}

export function generateStaticParams() {
  return NAP_AM.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const na = napAmTheoSlug(slug);
  if (!na) notFound();

  const duongDan = `/nap-am/${na.slug}`;
  const [meta, nd] = await Promise.all([
    metaTrang(duongDan, macDinhNapAm(na), '/nap-am/{ten}', taoThamSoNapAm(na)),
    noiDungTheoDuongDan(duongDan),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function NapAmChiTietPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const na = napAmTheoSlug(slug);
  if (!na) notFound();

  const duongDan = `/nap-am/${na.slug}`;
  const [ttTrang, nd] = await Promise.all([
    thongTinTrang(duongDan, macDinhNapAm(na), '/nap-am/{ten}', taoThamSoNapAm(na)),
    noiDungTheoDuongDan(duongDan),
  ]);
  const han = NAP_AM_HAN[na.slug] ?? '';
  const qh = quanHeHanh(na.hanh);
  const mau = mauHopMenh(na.hanh);
  const cungHanh = NAP_AM.filter((x) => x.hanh === na.hanh && x.slug !== na.slug);

  return (
    <KhungTrang
      tieuDe={ttTrang.h1}
      phu={ttTrang.description}
      duongDan={duongDan}
      tenCuoi={na.ten}
      toi
    >
      <section className="ck-tom-tat-menh" aria-label={`Tổng quan nạp âm ${na.ten}`}>
        <div className="ck-luoi-4">
          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Nạp âm</span>
            <strong className="ck-gia-lon">{na.ten}</strong>
            {han ? <p>Chữ Hán: {han}</p> : null}
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Ngũ hành</span>
            <div className="ck-gia-lon">
              <HuyHieuHanh hanh={na.hanh} lienKet />
            </div>
            <p>
              {qh.duocSinhBoi} sinh · sinh {qh.sinhRa}
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Hoa giáp thứ nhất</span>
            <strong className="ck-gia-lon">
              <Link href={`/can-chi/${na.hoaGiap[0].slug}`}>{na.hoaGiap[0].ten}</Link>
            </strong>
            <p>
              Số {na.hoaGiap[0].stt}/60 · {na.hoaGiap[0].amDuong}
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Hoa giáp thứ hai</span>
            <strong className="ck-gia-lon">
              <Link href={`/can-chi/${na.hoaGiap[1].slug}`}>{na.hoaGiap[1].ten}</Link>
            </strong>
            <p>
              Số {na.hoaGiap[1].stt}/60 · {na.hoaGiap[1].amDuong}
            </p>
          </div>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-na-vong-hanh">
        <h2 id="ck-na-vong-hanh" className="ck-td-tieu">
          Vòng ngũ hành của {na.ten} (hành {na.hanh})
        </h2>
        <VongNguHanh chon={na.hanh} />
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-na-nam-sinh">
        <h2 id="ck-na-nam-sinh" className="ck-td-tieu">
          Hai tuổi can chi và các năm sinh mệnh {na.ten}
        </h2>
        <div className="ck-luoi-2">
          {na.hoaGiap.map((hg) => {
            const dsNam = namCuaHoaGiap(hg, 1900, 2100);
            return (
              <div key={hg.slug} className="ck-the-du-lieu">
                <h3>
                  <Link href={`/can-chi/${hg.slug}`}>{hg.ten}</Link> (STT {hg.stt}/60)
                </h3>
                <p>
                  Tuổi con{' '}
                  <Link href={duongDanConGiap(hg.chi)}>
                    {hg.chi} ({hg.conGiap})
                  </Link>{' '}
                  · {hg.amDuong}
                </p>
                <div className="ck-nam-ds" style={{ marginTop: 12 }}>
                  {dsNam.map((y) =>
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
              </div>
            );
          })}
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-na-mau">
        <h2 id="ck-na-mau" className="ck-td-tieu">
          Màu sắc theo hành {na.hanh}
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang">
            <thead>
              <tr>
                <th>Nhóm màu</th>
                <th>Màu sắc</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>Bản mệnh ({na.hanh})</b>
                </td>
                <td>
                  <DanhSachMau mau={mau.banMenh} />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Tương sinh ({qh.duocSinhBoi} sinh)</b>
                </td>
                <td>
                  <DanhSachMau mau={mau.tuongSinh} />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Nên tránh ({qh.biKhacBoi} khắc)</b>
                </td>
                <td>
                  <DanhSachMau mau={mau.nenTranh} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <NguonNapAm />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe={`Diễn giải mệnh ${na.ten}`} />

      <nav className="ck-lien-quan" aria-label="Nạp âm cùng hành">
        <h2>Các nạp âm khác thuộc hành {na.hanh}</h2>
        <div className="ck-lien-quan-ds">
          {cungHanh.map((x) => (
            <Link key={x.slug} href={`/nap-am/${x.slug}`}>
              {x.ten}
            </Link>
          ))}
          <Link href="/nap-am">Tất cả 30 nạp âm</Link>
          <Link href={duongDanHanh(na.hanh)}>Chi tiết mệnh {na.hanh}</Link>
          <Link href="/ngu-hanh/mau-hop-menh">Bảng màu hợp mệnh</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

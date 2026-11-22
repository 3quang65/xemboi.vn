import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { DanhSachMau, HuyHieuHanh, NguonNapAm } from '@/components/ck/TheCanChi';
import {
  HANH_HAN,
  HANH_SLUG,
  NAP_AM_HAN,
  SLUG_HANH,
  duongDanHanh,
} from '@/components/ck/canChiHelpers';
import {
  NAP_AM,
  NGU_HANH,
  mauHopMenh,
  quanHeHanh,
  type Hanh,
} from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

function taoThamSoHanh(hanh: Hanh) {
  const ds = NAP_AM.filter((n) => n.hanh === hanh);
  return {
    Hành: hanh,
    'liệt kê': ds.map((n) => n.ten).join(', '),
  };
}

function macDinhHanh(hanh: Hanh) {
  return {
    title: `Mệnh ${hanh} là gì? Màu hợp, mệnh sinh – khắc, năm sinh`,
    h1: `Mệnh ${hanh} là gì`,
  };
}

export function generateStaticParams() {
  return Object.keys(SLUG_HANH).map((hanh) => ({ hanh }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hanh: string }>;
}): Promise<Metadata> {
  const { hanh } = await params;
  const hanhVal = SLUG_HANH[hanh];
  if (!hanhVal) notFound();

  const duongDan = `/ngu-hanh/${HANH_SLUG[hanhVal]}`;
  const [meta, nd] = await Promise.all([
    metaTrang(duongDan, macDinhHanh(hanhVal), '/ngu-hanh/{hanh}', taoThamSoHanh(hanhVal)),
    noiDungTheoDuongDan(duongDan),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function NguHanhChiTietPage({
  params,
}: {
  params: Promise<{ hanh: string }>;
}) {
  const { hanh } = await params;
  const hanhVal = SLUG_HANH[hanh];
  if (!hanhVal) notFound();

  const duongDan = `/ngu-hanh/${HANH_SLUG[hanhVal]}`;
  const [ttTrang, nd] = await Promise.all([
    thongTinTrang(duongDan, macDinhHanh(hanhVal), '/ngu-hanh/{hanh}', taoThamSoHanh(hanhVal)),
    noiDungTheoDuongDan(duongDan),
  ]);
  const qh = quanHeHanh(hanhVal);
  const mau = mauHopMenh(hanhVal);
  const dsNapAm = NAP_AM.filter((n) => n.hanh === hanhVal);
  const hanhKhac = NGU_HANH.filter((x) => x !== hanhVal);

  return (
    <KhungTrang
      tieuDe={ttTrang.h1}
      phu={ttTrang.description}
      duongDan={duongDan}
      tenCuoi={`Mệnh ${hanhVal}`}
      toi
    >
      <section className="ck-tom-tat-menh" aria-label={`Quan hệ sinh khắc hành ${hanhVal}`}>
        <div className="ck-luoi-4">
          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Sinh ra</span>
            <div className="ck-gia-lon">
              <HuyHieuHanh hanh={qh.sinhRa} lienKet />
            </div>
            <p>
              {hanhVal} ({HANH_HAN[hanhVal]}) sinh {qh.sinhRa}
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Được sinh bởi</span>
            <div className="ck-gia-lon">
              <HuyHieuHanh hanh={qh.duocSinhBoi} lienKet />
            </div>
            <p>
              {qh.duocSinhBoi} sinh {hanhVal}
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Khắc</span>
            <div className="ck-gia-lon">
              <HuyHieuHanh hanh={qh.khac} lienKet />
            </div>
            <p>
              {hanhVal} chế khắc {qh.khac}
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Bị khắc bởi</span>
            <div className="ck-gia-lon">
              <HuyHieuHanh hanh={qh.biKhacBoi} lienKet />
            </div>
            <p>
              {qh.biKhacBoi} khắc {hanhVal}
            </p>
          </div>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-hanh-nap-am">
        <h2 id="ck-hanh-nap-am" className="ck-td-tieu">
          6 nạp âm thuộc hành {hanhVal}
        </h2>
        <div className="ck-na-luoi">
          {dsNapAm.map((na) => (
            <Link key={na.slug} href={`/nap-am/${na.slug}`} className="ck-na-o">
              <b>{na.ten}</b>
              {NAP_AM_HAN[na.slug] ? <small>{NAP_AM_HAN[na.slug]}</small> : null}
              <span>
                {na.hoaGiap[0].ten} · {na.hoaGiap[1].ten}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-hanh-mau">
        <h2 id="ck-hanh-mau" className="ck-td-tieu">
          Màu sắc của mệnh {hanhVal}
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
                  <b>Bản mệnh ({hanhVal})</b>
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
                  <b>Chế khắc ({hanhVal} khắc {qh.khac})</b>
                </td>
                <td>
                  <DanhSachMau mau={mau.cheKhac} />
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
        <p className="ck-nguon-nho">
          <Link href="/ngu-hanh/mau-hop-menh">So sánh màu cả 5 hành &amp; tra theo năm sinh →</Link>
        </p>
        <NguonNapAm />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe={`Diễn giải mệnh ${hanhVal}`} />

      <nav className="ck-lien-quan" aria-label="4 hành còn lại và chỉ mục">
        <h2>Các hành khác &amp; danh mục</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/ngu-hanh">Sơ đồ Ngũ hành</Link>
          {hanhKhac.map((x) => (
            <Link key={x} href={duongDanHanh(x)}>
              Mệnh {x} ({HANH_HAN[x]})
            </Link>
          ))}
          <Link href="/ngu-hanh/mau-hop-menh">Màu hợp mệnh</Link>
          <Link href="/sinh-nam">Tra theo năm sinh</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

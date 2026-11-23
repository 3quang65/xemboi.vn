import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { duongDanHanh } from '@/components/ck/canChiHelpers';
import { boChuHan } from '@/lib/trang/chu-viet';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { CHINH_TINH, NGUON_AN_SAO, chinhTinhTheoSlug, type ChinhTinh } from '@/lib/trang/tu-vi-tu-dien';

const LOP_DAC_TINH: Record<string, string> = {
  M: 'ck-dt-nhan ck-dt-m',
  V: 'ck-dt-nhan ck-dt-v',
  Đ: 'ck-dt-nhan ck-dt-d',
  B: 'ck-dt-nhan ck-dt-b',
  H: 'ck-dt-nhan ck-dt-h',
};

function macDinhSao(sao: ChinhTinh) {
  return {
    title: `Sao ${sao.ten} trong tử vi: tính chất, miếu hãm, ý nghĩa`,
    description: `Sao ${sao.ten} thuộc hành ${sao.hanh} trong 14 chính tinh: bảng đặc tính Miếu, Vượng, Đắc, Bình, Hãm qua 12 địa chi.`,
    h1: `Sao ${sao.ten} trong tử vi`,
  };
}

function lamSachMetaSao(meta: Metadata): Metadata {
  const title = typeof meta.title === 'string'
    ? boChuHan(meta.title)
    : meta.title && typeof meta.title === 'object' && 'absolute' in meta.title
      ? { ...meta.title, absolute: boChuHan(String(meta.title.absolute)) }
      : meta.title;
  const description = typeof meta.description === 'string' ? boChuHan(meta.description) : meta.description;
  const openGraph = meta.openGraph
    ? {
        ...meta.openGraph,
        title: typeof meta.openGraph.title === 'string' ? boChuHan(meta.openGraph.title) : meta.openGraph.title,
        description:
          typeof meta.openGraph.description === 'string'
            ? boChuHan(meta.openGraph.description)
            : meta.openGraph.description,
      }
    : meta.openGraph;
  return { ...meta, title, description, openGraph };
}

export function generateStaticParams() {
  return CHINH_TINH.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sao = chinhTinhTheoSlug(slug);
  if (!sao) notFound();

  const duongDan = `/tu-vi/sao/${sao.slug}`;
  const [metaRaw, nd] = await Promise.all([
    metaTrang(duongDan, macDinhSao(sao), '/tu-vi/sao/{sao}', { Tên: sao.ten, Hán: '', nguồn: NGUON_AN_SAO }),
    noiDungTheoDuongDan(duongDan),
  ]);
  const meta = lamSachMetaSao(metaRaw);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function TuViSaoChiTietPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sao = chinhTinhTheoSlug(slug);
  if (!sao) notFound();

  const duongDan = `/tu-vi/sao/${sao.slug}`;
  const [ttTrangRaw, nd] = await Promise.all([
    thongTinTrang(duongDan, macDinhSao(sao), '/tu-vi/sao/{sao}', { Tên: sao.ten, Hán: '', nguồn: NGUON_AN_SAO }),
    noiDungTheoDuongDan(duongDan),
  ]);
  const ttTrang = {
    ...ttTrangRaw,
    title: boChuHan(ttTrangRaw.title),
    h1: boChuHan(ttTrangRaw.h1),
    description: ttTrangRaw.description ? boChuHan(ttTrangRaw.description) : null,
  };
  const daDung = trangDaDung();

  const idx = CHINH_TINH.findIndex((s) => s.slug === sao.slug);
  const saoTruoc = CHINH_TINH[(idx - 1 + CHINH_TINH.length) % CHINH_TINH.length];
  const saoSau = CHINH_TINH[(idx + 1) % CHINH_TINH.length];

  return (
    <KhungTrang
      tieuDe={ttTrang.h1}
      phu={ttTrang.description}
      duongDan={duongDan}
      tenCuoi={`Sao ${sao.ten}`}
      toi
    >
      <section className="ck-tom-tat-menh" aria-label={`Thông tin chính tinh ${sao.ten}`}>
        <div className="ck-luoi-4">
          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Ngũ hành</span>
            <div className="ck-gia-lon">
              <HuyHieuHanh hanh={sao.hanh} lienKet={daDung.has('/ngu-hanh')} />
            </div>
            <p>
              {daDung.has('/ngu-hanh') ? (
                <Link href={duongDanHanh(sao.hanh)}>Xem hành {sao.hanh}</Link>
              ) : (
                `Hành ${sao.hanh}`
              )}
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Nhóm sao</span>
            <strong className="ck-gia-lon">Chính tinh</strong>
            <p>
              Sao thứ {idx + 1}/14 trong bảng 14 chính tinh
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Miếu / Vượng tại</span>
            <strong className="ck-gia-lon">
              {sao.mieuVuong.length > 0 ? sao.mieuVuong.join(', ') : 'Không có'}
            </strong>
            <p>{sao.mieuVuong.length} địa chi miếu hoặc vượng</p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Hãm tại</span>
            <strong className="ck-gia-lon">
              {sao.ham.length > 0 ? sao.ham.join(', ') : 'Không có'}
            </strong>
            <p>
              {sao.ham.length > 0
                ? `${sao.ham.length} địa chi hãm địa`
                : 'Không có chi hãm địa'}
            </p>
          </div>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-sao-dac-tinh-tieu">
        <h2 id="ck-sao-dac-tinh-tieu" className="ck-td-tieu">
          Bảng đặc tính sao {sao.ten} theo 12 địa chi
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang ck-bang-the">
            <thead>
              <tr>
                <th>Địa chi</th>
                <th>Ký hiệu</th>
                <th>Đặc tính</th>
              </tr>
            </thead>
            <tbody>
              {sao.dacTinh.map((dt) => (
                <tr key={dt.chi}>
                  <td data-nhan="Địa chi">
                    <b>{dt.chi}</b>
                  </td>
                  <td data-nhan="Ký hiệu">
                    <b>{dt.ma}</b>
                  </td>
                  <td data-nhan="Đặc tính">
                    <span className={LOP_DAC_TINH[dt.ma] ?? 'ck-dt-nhan'}>{dt.ten}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ck-tv-nguon">
          Bảng miếu hãm theo bộ máy an sao của xemboi (quy tắc theo sách cụ Thiên Lương).
        </p>
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe={`Diễn giải sao ${sao.ten}`} />

      <nav className="ck-dieu-huong" aria-label="Điều hướng giữa 14 chính tinh">
        <Link href={`/tu-vi/sao/${saoTruoc.slug}`} className="ck-nut ck-nut-vien">
          ← {saoTruoc.ten}
        </Link>
        <Link href="/tu-vi/sao" className="ck-nut ck-nut-vien">
          Ma trận 14 chính tinh
        </Link>
        <Link href={`/tu-vi/sao/${saoSau.slug}`} className="ck-nut ck-nut-vien">
          {saoSau.ten} →
        </Link>
      </nav>

      <nav className="ck-lien-quan" aria-label="14 chính tinh và công cụ Tử vi">
        <h2>Các chính tinh khác &amp; công cụ Tử vi</h2>
        <div className="ck-lien-quan-ds">
          {CHINH_TINH.filter((s) => s.slug !== sao.slug).map((s) => (
            <Link key={s.slug} href={`/tu-vi/sao/${s.slug}`}>
              {s.ten}
            </Link>
          ))}
          <Link href="/tu-vi/cung">12 cung tử vi</Link>
          <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          <Link href="/tu-vi/tron-doi">Lá số tử vi trọn đời</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

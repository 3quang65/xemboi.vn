import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { CUNG_TU_VI, cungTheoSlug, type CungTuVi } from '@/lib/trang/tu-vi-tu-dien';

function macDinhCung(cung: CungTuVi) {
  return {
    title: `Cung ${cung.ten} trong tử vi là gì? Ý nghĩa, cách xem`,
    description: `Thông tin vị trí cung ${cung.ten} (cung thứ ${cung.thuTu}/12 tính từ Mệnh, an nghịch), tam hợp và xung chiếu trong lá số tử vi.`,
    h1: `Cung ${cung.ten} trong tử vi`,
  };
}

export function generateStaticParams() {
  return CUNG_TU_VI.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cung = cungTheoSlug(slug);
  if (!cung) notFound();

  const duongDan = `/tu-vi/cung/${cung.slug}`;
  const [meta, nd] = await Promise.all([
    metaTrang(duongDan, macDinhCung(cung), '/tu-vi/cung/{cung}', { Tên: cung.ten, 'lĩnh vực': cung.linhVuc }),
    noiDungTheoDuongDan(duongDan),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function TuViCungChiTietPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cung = cungTheoSlug(slug);
  if (!cung) notFound();

  const duongDan = `/tu-vi/cung/${cung.slug}`;
  const [ttTrang, nd] = await Promise.all([
    thongTinTrang(duongDan, macDinhCung(cung), '/tu-vi/cung/{cung}', { Tên: cung.ten, 'lĩnh vực': cung.linhVuc }),
    noiDungTheoDuongDan(duongDan),
  ]);

  const idx = cung.thuTu - 1;
  const cungTruoc = CUNG_TU_VI[(idx - 1 + 12) % 12];
  const cungSau = CUNG_TU_VI[(idx + 1) % 12];
  const xungChieu = CUNG_TU_VI[(idx + 6) % 12];
  const tamHop1 = CUNG_TU_VI[(idx + 4) % 12];
  const tamHop2 = CUNG_TU_VI[(idx + 8) % 12];

  return (
    <KhungTrang
      tieuDe={ttTrang.h1}
      phu={ttTrang.description}
      duongDan={duongDan}
      tenCuoi={`Cung ${cung.ten}`}
      toi
    >
      <section className="ck-tom-tat-menh" aria-label={`Vị trí cung ${cung.ten}`}>
        <div className="ck-luoi-4">
          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Thứ tự an cung</span>
            <strong className="ck-gia-lon">{cung.thuTu} / 12</strong>
            <p>Thứ tự an nghịch từ Mệnh</p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Vị trí so với Mệnh</span>
            <strong className="ck-gia-lon">
              {cung.thuTu === 1 ? 'Cung Mệnh' : `Thứ ${cung.thuTu}`}
            </strong>
            <p>
              {cung.thuTu === 1
                ? 'Điểm khởi đầu an 12 cung'
                : `Cách Mệnh ${cung.thuTu - 1} cung theo chiều nghịch`}
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Cung xung chiếu</span>
            <strong className="ck-gia-lon">
              <Link href={`/tu-vi/cung/${xungChieu.slug}`}>{xungChieu.ten}</Link>
            </strong>
            <p>Đối diện (cách 6 cung)</p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Tam hợp cung</span>
            <p style={{ marginTop: 4 }}>
              <Link href={`/tu-vi/cung/${tamHop1.slug}`}>
                <b>{tamHop1.ten}</b>
              </Link>{' '}
              ·{' '}
              <Link href={`/tu-vi/cung/${tamHop2.slug}`}>
                <b>{tamHop2.ten}</b>
              </Link>
            </p>
            <p>Bộ ba cung cách nhau 4 cung</p>
          </div>
        </div>
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe={`Diễn giải cung ${cung.ten}`} />

      <nav className="ck-dieu-huong" aria-label="Điều hướng giữa 12 cung">
        <Link href={`/tu-vi/cung/${cungTruoc.slug}`} className="ck-nut ck-nut-vien">
          ← {cungTruoc.thuTu}. {cungTruoc.ten}
        </Link>
        <Link href="/tu-vi/cung" className="ck-nut ck-nut-vien">
          Danh sách 12 cung
        </Link>
        <Link href={`/tu-vi/cung/${cungSau.slug}`} className="ck-nut ck-nut-vien">
          {cungSau.thuTu}. {cungSau.ten} →
        </Link>
      </nav>

      <nav className="ck-lien-quan" aria-label="12 cung và công cụ Tử vi">
        <h2>12 cung và tra cứu Tử vi</h2>
        <div className="ck-lien-quan-ds">
          {CUNG_TU_VI.filter((c) => c.slug !== cung.slug).map((c) => (
            <Link key={c.slug} href={`/tu-vi/cung/${c.slug}`}>
              {c.ten}
            </Link>
          ))}
          <Link href="/tu-vi/sao">14 chính tinh</Link>
          <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          <Link href="/tu-vi/tron-doi">Lá số tử vi trọn đời</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

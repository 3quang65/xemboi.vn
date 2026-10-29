import type { Metadata } from 'next';
import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import HoroscopeChartGrid from '@/components/HoroscopeChartGrid';
import { parseChartSlug } from '@/lib/core/slug';
import { TuVi } from '@/lib/core/tuvi';
import { ThuVien } from '@/lib/core/thuvien';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseChartSlug(slug);
  const laSo = TuVi.anLaSo({
    ten: parsed?.ten || 'Đương Số',
    ngay: parsed?.ngay || 15,
    thang: parsed?.thang || 6,
    nam: parsed?.nam || 1990,
    gio: parsed?.gio ?? 12,
    gioiTinh: parsed?.gt || 'nam',
    lich: parsed?.lich || 'duong',
    nhuan: parsed?.nhuan || false,
    namXem: parsed?.namXem || 2026,
  });
  const title = `Lá Số Tử Vi ${laSo.ten} (${laSo.canChi.nam} ${laSo.duong.nam} - ${laSo.gioiTinh}) – Luận Giải Chi Tiết`;
  const description = `Xem lá số tử vi chuẩn Nam Phái cho ${laSo.ten}, sinh ngày ${laSo.duong.ngay}/${laSo.duong.thang}/${laSo.duong.nam} (Âm lịch ${laSo.am.ngay}/${laSo.am.thang} năm ${laSo.canChi.nam}), Bản mệnh ${laSo.banMenh}, ${laSo.cuc} tại XemBoi.vn.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://xemboi.vn/la-so/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://xemboi.vn/la-so/${slug}`,
      siteName: 'XemBoi.vn',
      type: 'article',
    },
  };
}

export default async function LaSoPermalinkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseChartSlug(slug) || {
    ten: 'Đương Số',
    ngay: 15,
    thang: 6,
    nam: 1990,
    gio: 12,
    gt: 'nam' as const,
    lich: 'duong' as const,
    nhuan: false,
    namXem: 2026,
  };

  const laSo = TuVi.anLaSo({
    ten: parsed.ten,
    ngay: parsed.ngay,
    thang: parsed.thang,
    nam: parsed.nam,
    gio: parsed.gio,
    gioiTinh: parsed.gt,
    lich: parsed.lich,
    nhuan: parsed.nhuan,
    namXem: parsed.namXem,
  });

  const luanGiaiHtml = ThuVien.luan(laSo, '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Lá Số Tử Vi ${laSo.ten} - Tuổi ${laSo.canChi.nam} (${laSo.duong.nam})`,
    author: {
      '@type': 'Person',
      name: 'Bát Đại Danh Sư – XemBoi.vn',
    },
    publisher: {
      '@type': 'Organization',
      name: 'XemBoi.vn',
      url: 'https://xemboi.vn',
    },
    mainEntityOfPage: `https://xemboi.vn/la-so/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `try{localStorage.setItem('xb_cur_laso', ${JSON.stringify(JSON.stringify(laSo))});}catch(e){}`,
        }}
      />
      <SubpageHeader
        title={`Lá Số Tử Vi: ${laSo.ten} (${laSo.canChi.nam} · ${laSo.gioiTinh})`}
        subtitle={`Bản mệnh: ${laSo.banMenh} · ${laSo.cuc} · Chủ Mệnh: ${laSo.menhChu} · Chủ Thân: ${laSo.thanChu}`}
      />
      <main className="wrap">
        <div className="card">
          <h2>Bảng Lá Số Tử Vi 12 Cung Chuẩn Nam Phái</h2>
          <HoroscopeChartGrid laSo={laSo} slug={slug} />
        </div>
        <div className="card">
          <h2>Bản Bình Giải Chi Tiết Lá Số Tử Vi</h2>
          <div
            className="reading"
            dangerouslySetInnerHTML={{ __html: luanGiaiHtml }}
          />
          <div className="chart-actions" style={{ marginTop: 18 }}>
            <Link href="/" className="btn red" style={{ textAlign: 'center', textDecoration: 'none' }}>
              🔮 Lập lá số khác hoặc thỉnh ý Danh Sư trực tiếp
            </Link>
          </div>
        </div>
      </main>
      <SubpageFooter currentPath={`/la-so/${slug}`} />
    </>
  );
}

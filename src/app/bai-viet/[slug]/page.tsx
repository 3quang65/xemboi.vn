import type { Metadata } from 'next';
import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { CMS_ARTICLES } from '@/lib/core/cms-data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const art = CMS_ARTICLES.find((a) => a.slug === slug) || CMS_ARTICLES[0];
  return {
    title: art.title,
    description: art.excerpt,
    alternates: { canonical: `https://xemboi.vn/bai-viet/${art.slug}` },
  };
}

export default async function BaiVietDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const art = CMS_ARTICLES.find((a) => a.slug === slug) || CMS_ARTICLES[0];

  return (
    <>
      <SubpageHeader
        title={art.title}
        subtitle={`Chuyên mục: ${art.categoryName} · Ngày đăng: ${art.publishedAt} · ${art.readingMinutes} phút đọc`}
      />
      <main className="wrap">
        <article className="card">
          <div className="reading" dangerouslySetInnerHTML={{ __html: art.contentHtml }} />
          <div className="chart-actions" style={{ marginTop: 18 }}>
            <Link href="/kien-thuc" className="btn ghost" style={{ textAlign: 'center', textDecoration: 'none' }}>
              ← Quay lại Thư viện Kiến thức
            </Link>
            <Link href="/" className="btn red" style={{ textAlign: 'center', textDecoration: 'none' }}>
              🔮 Lập Lá Số Tử Vi Ngay
            </Link>
          </div>
        </article>
      </main>
      <SubpageFooter currentPath="/kien-thuc" />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { CMS_CATEGORIES, CMS_ARTICLES } from '@/lib/core/cms-data';

export const metadata: Metadata = {
  title: 'Kiến Thức Tử Vi Nam Phái, Tứ Trụ, Kinh Dịch & Phong Thủy – XemBoi.vn',
  description: 'Chuyên mục tổng hợp kiến thức chính thống về Tử Vi Đẩu Số Nam Phái, Thuật toán Âm lịch Hồ Ngọc Đức, Tứ Trụ Bát Tự và Phong Thủy tại XemBoi.vn.',
  alternates: { canonical: 'https://xemboi.vn/kien-thuc' },
};

export default function KienThucPage() {
  return (
    <>
      <SubpageHeader
        title="Thư Viện Kiến Thức Huyền Học & Tử Vi Phương Đông"
        subtitle="Tổng hợp bài viết chuyên sâu về Tử Vi Nam Phái, Lịch Pháp Hồ Ngọc Đức, Tứ Trụ Bát Tự và Kinh Dịch"
      />
      <main className="wrap">
        <div className="card">
          <h2>Chuyên Mục Kiến Thức</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {CMS_CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                }}
              >
                <strong style={{ color: 'var(--red)' }}>{cat.name}</strong>
                <p className="small muted" style={{ marginTop: 6 }}>{cat.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Bài Viết Chuyên Sâu Nổi Bật</h2>
          {CMS_ARTICLES.map((art) => (
            <div key={art.slug} className="subcard" style={{ marginBottom: 12 }}>
              <div className="small muted">
                {art.categoryName} · {art.publishedAt} · {art.readingMinutes} phút đọc
              </div>
              <h3 style={{ margin: '6px 0' }}>
                <Link href={`/bai-viet/${art.slug}`} style={{ color: 'var(--red)', textDecoration: 'none' }}>
                  {art.title}
                </Link>
              </h3>
              <p className="small">{art.excerpt}</p>
              <Link href={`/bai-viet/${art.slug}`} className="small" style={{ color: 'var(--red)', fontWeight: 700 }}>
                Đọc chi tiết →
              </Link>
            </div>
          ))}
        </div>
      </main>
      <SubpageFooter currentPath="/kien-thuc" />
    </>
  );
}

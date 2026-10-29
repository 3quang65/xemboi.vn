import type { Metadata } from 'next';
import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { HomNay } from '@/lib/core/homnay';

export const metadata: Metadata = {
  title: 'Tử Vi Ngày Mai 12 Con Giáp – Dự Báo Sớm Cát Hung & Giờ Tốt',
  description: 'Xem trước tử vi ngày mai của 12 con giáp chính xác tại XemBoi.vn để chủ động sắp xếp công việc, tài chính và xuất hành.',
  alternates: { canonical: 'https://xemboi.vn/tu-vi-ngay-mai' },
};

export default function TuViNgayMaiIndexPage() {
  const { d, m, y } = HomNay.ngayVN(1);
  const all = HomNay.tatCa(d, m, y);

  return (
    <>
      <SubpageHeader
        title={`Tử Vi Ngày Mai 12 Con Giáp (${d}/${m}/${y})`}
        subtitle="Xem sớm vận trình ngày mai để chủ động đón cát lành, hóa giải hung sát"
      />
      <main className="wrap">
        <div className="card">
          <h2>Dự Báo 12 Con Giáp Ngày Mai</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {all.tuoi.map((item: any) => (
              <Link
                key={item.slug}
                href={`/tu-vi-ngay-mai/tuoi-${item.slug}`}
                style={{
                  display: 'block',
                  padding: 14,
                  borderRadius: 12,
                  border: '1px solid var(--line)',
                  background: 'var(--bg)',
                  textDecoration: 'none',
                  color: 'var(--ink)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 18, color: 'var(--red)' }}>Tuổi {item.ten} ({item.conGiap})</strong>
                  <span className="pill ok">{item.sao}/5 ★</span>
                </div>
                <p className="small muted" style={{ margin: '6px 0 0' }}>
                  Màu hợp: {item.mau}
                </p>
                <p className="small" style={{ margin: '6px 0 0' }}>{item.tomTat}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SubpageFooter currentPath="/tu-vi-ngay-mai" />
    </>
  );
}

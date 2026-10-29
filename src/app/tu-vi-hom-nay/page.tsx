import type { Metadata } from 'next';
import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { HomNay } from '@/lib/core/homnay';

export const metadata: Metadata = {
  title: 'Tử Vi Hôm Nay 12 Con Giáp – Xem Vận Trình Ngày Mới Chuẩn Xác',
  description: 'Xem tử vi hôm nay của 12 con giáp (Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi) về công việc, tài lộc, tình cảm, giờ tốt và con số may mắn tại XemBoi.vn.',
  alternates: { canonical: 'https://xemboi.vn/tu-vi-hom-nay' },
};

export default function TuViHomNayIndexPage() {
  const { d, m, y } = HomNay.ngayVN(0);
  const all = HomNay.tatCa(d, m, y);

  return (
    <>
      <SubpageHeader
        title={`Tử Vi Hôm Nay 12 Con Giáp (${d}/${m}/${y})`}
        subtitle="Luận giải vận khí công danh, tài lộc, tình duyên, màu sắc và con số cát lành theo Ngũ Hành nạp âm"
      />
      <main className="wrap">
        <div className="card">
          <h2>Chọn Con Giáp Của Bạn</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {all.tuoi.map((item: any) => (
              <Link
                key={item.slug}
                href={`/tu-vi-hom-nay/tuoi-${item.slug}`}
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
                  Màu hợp: {item.mau} · Số may mắn: {item.so.join(', ')}
                </p>
                <p className="small" style={{ margin: '6px 0 0' }}>{item.tomTat}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SubpageFooter currentPath="/tu-vi-hom-nay" />
    </>
  );
}

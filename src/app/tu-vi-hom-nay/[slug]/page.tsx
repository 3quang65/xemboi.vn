import type { Metadata } from 'next';
import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { HomNay } from '@/lib/core/homnay';

function resolveChiIdx(slug: string): number {
  const clean = slug.replace(/^tuoi-/, '');
  const idx = HomNay.chiTuSlug(clean);
  return idx >= 0 ? idx : 0;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { d, m, y } = HomNay.ngayVN(0);
  const info = HomNay.tuoi(resolveChiIdx(slug), d, m, y);
  return {
    title: `Tử Vi Hôm Nay Tuổi ${info.ten} (${info.conGiap}) – Công Việc, Tài Lộc, Tình Cảm`,
    description: `${info.tomTat} Xem chi tiết tử vi hôm nay tuổi ${info.ten} tại XemBoi.vn.`,
    alternates: { canonical: `https://xemboi.vn/tu-vi-hom-nay/${slug}` },
  };
}

export default async function TuViHomNayDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { d, m, y } = HomNay.ngayVN(0);
  const chiIdx = resolveChiIdx(slug);
  const info = HomNay.tuoi(chiIdx, d, m, y);
  const ngayInfo = HomNay.ngay(d, m, y);
  const detail = (ngayInfo as any)?.info || ngayInfo;

  return (
    <>
      <SubpageHeader
        title={`Tử Vi Hôm Nay Tuổi ${info.ten} (${info.conGiap}) — Ngày ${d}/${m}/${y}`}
        subtitle={`Âm lịch: ${detail?.am?.ngay || 1}/${detail?.am?.thang || 1}/${detail?.am?.nam || y} · Ngày ${detail?.canChi?.ngay || ''} · Đánh giá: ${info.sao}/5 ★`}
      />
      <main className="wrap">
        <div className="card">
          <h2>Tổng Quan Vận Trình Tuổi {info.ten}</h2>
          <p>{info.tomTat}</p>
          <div className="subcard">
            <h3>💼 Sự Nghiệp &amp; Công Việc ({info.mat.congViec}/5 ★)</h3>
            <p>{info.loi.congViec}</p>
          </div>
          <div className="subcard">
            <h3>💰 Tài Lộc &amp; Tiền Bạc ({info.mat.taiLoc}/5 ★)</h3>
            <p>{info.loi.taiLoc}</p>
          </div>
          <div className="subcard">
            <h3>❤️ Tình Cảm &amp; Gia Đạo ({info.mat.tinhCam}/5 ★)</h3>
            <p>{info.loi.tinhCam}</p>
          </div>
          <div className="subcard">
            <h3>🌿 Sức Khỏe ({info.mat.sucKhoe}/5 ★)</h3>
            <p>{info.loi.sucKhoe}</p>
          </div>
          <div className="subcard">
            <h3>🍀 Cẩm Nang May Mắn Hôm Nay</h3>
            <ul>
              <li><strong>Con số may mắn:</strong> {info.so.join(', ')}</li>
              <li><strong>Màu sắc hợp mệnh:</strong> {info.mau}</li>
              <li><strong>Giờ hoàng đạo hợp tuổi:</strong> {info.gio.map((g: any) => `${g.ten} (${g.khoang})`).join(', ')}</li>
            </ul>
            <p style={{ marginTop: 8 }}><strong>Lời khuyên vượng vận:</strong> {info.dan}</p>
          </div>
          <div className="chart-actions" style={{ marginTop: 14 }}>
            <Link href="/tu-vi-hom-nay" className="btn ghost" style={{ textAlign: 'center', textDecoration: 'none' }}>
              ← Xem 12 con giáp hôm nay
            </Link>
            <Link href={`/tu-vi-ngay-mai/tuoi-${info.slug}`} className="btn gold" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Xem tiếp Tử Vi Ngày Mai Tuổi {info.ten} →
            </Link>
          </div>
        </div>
      </main>
      <SubpageFooter currentPath="/tu-vi-hom-nay" />
    </>
  );
}

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
  const { d, m, y } = HomNay.ngayVN(1);
  const info = HomNay.tuoi(resolveChiIdx(slug), d, m, y);
  return {
    title: `Tử Vi Ngày Mai Tuổi ${info.ten} (${info.conGiap}) – Dự Báo Sớm Chuẩn Xác`,
    description: `${info.tomTat} Xem chi tiết tử vi ngày mai tuổi ${info.ten} tại XemBoi.vn.`,
    alternates: { canonical: `https://xemboi.vn/tu-vi-ngay-mai/${slug}` },
  };
}

export default async function TuViNgayMaiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { d, m, y } = HomNay.ngayVN(1);
  const info = HomNay.tuoi(resolveChiIdx(slug), d, m, y);
  const ngayInfo = HomNay.ngay(d, m, y);
  const detail = (ngayInfo as any)?.info || ngayInfo;

  return (
    <>
      <SubpageHeader
        title={`Tử Vi Ngày Mai Tuổi ${info.ten} (${info.conGiap}) — Ngày ${d}/${m}/${y}`}
        subtitle={`Âm lịch: ${detail?.am?.ngay || 1}/${detail?.am?.thang || 1}/${detail?.am?.nam || y} · Ngày ${detail?.canChi?.ngay || ''} · Đánh giá: ${info.sao}/5 ★`}
      />
      <main className="wrap">
        <div className="card">
          <h2>Dự Báo Tổng Quan Ngày Mai Tuổi {info.ten}</h2>
          <p>{info.tomTat}</p>
          <div className="subcard">
            <h3>💼 Công Việc ({info.mat.congViec}/5 ★)</h3>
            <p>{info.loi.congViec}</p>
          </div>
          <div className="subcard">
            <h3>💰 Tài Lộc ({info.mat.taiLoc}/5 ★)</h3>
            <p>{info.loi.taiLoc}</p>
          </div>
          <div className="subcard">
            <h3>❤️ Tình Cảm ({info.mat.tinhCam}/5 ★)</h3>
            <p>{info.loi.tinhCam}</p>
          </div>
          <div className="subcard">
            <h3>🍀 Chỉ Dẫn May Mắn Ngày Mai</h3>
            <ul>
              <li><strong>Số may mắn:</strong> {info.so.join(', ')}</li>
              <li><strong>Màu hợp:</strong> {info.mau}</li>
              <li><strong>Giờ tốt:</strong> {info.gio.map((g: any) => `${g.ten} (${g.khoang})`).join(', ')}</li>
            </ul>
            <p style={{ marginTop: 8 }}><strong>Lời khuyên vượng vận:</strong> {info.dan}</p>
          </div>
          <div className="chart-actions" style={{ marginTop: 14 }}>
            <Link href="/tu-vi-ngay-mai" className="btn ghost" style={{ textAlign: 'center', textDecoration: 'none' }}>
              ← Danh sách 12 con giáp ngày mai
            </Link>
          </div>
        </div>
      </main>
      <SubpageFooter currentPath="/tu-vi-ngay-mai" />
    </>
  );
}

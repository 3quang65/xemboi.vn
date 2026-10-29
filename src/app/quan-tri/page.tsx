import type { Metadata } from 'next';
import SubpageHeader from '@/components/SubpageHeader';

export const metadata: Metadata = {
  title: 'Quản Trị Hệ Thống XemBoi.vn',
  robots: { index: false, follow: false },
};

export default function QuanTriPage() {
  return (
    <>
      <SubpageHeader
        title="Bảng Điều Khiển Quản Trị XemBoi.vn"
        subtitle="Quản lý cấu hình Bát Đại Danh Sư AI, thống kê lá số, đơn tư vấn và thư viện bình giải"
      />
      <main className="wrap">
        <div className="card">
          <h2>Trạng Thái Hệ Thống Core Engine &amp; Database</h2>
          <ul>
            <li><strong>Domain chính thức:</strong> https://xemboi.vn</li>
            <li><strong>Engine Âm Dương Lịch:</strong> Thuật toán Hồ Ngọc Đức (UTC+7) — Hoạt động 100%</li>
            <li><strong>Engine An Sao Tử Vi:</strong> Nam Phái (14 Chính tinh + 100+ Phụ tinh &amp; Lưu tinh) — Hoạt động 100%</li>
            <li><strong>Database Schema:</strong> PostgreSQL + Prisma ORM (HoroscopeChart, Star, StarInterpretation, CachCucInterpretation, TransitInterpretation, Post)</li>
          </ul>
        </div>
      </main>
    </>
  );
}

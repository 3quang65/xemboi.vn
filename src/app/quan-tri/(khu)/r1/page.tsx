import type { Metadata } from 'next';
import QuanTriR1Client from '@/components/r1/QuanTriR1Client';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import './r1-quan-tri.css';

export const metadata: Metadata = {
  title: 'Thí nghiệm R1',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

// Đợt 1: dùng phiên tài khoản (quyền r1.xem) thay cho ADMIN_KEY.
export default async function QuanTriR1Page() {
  await yeuCauQuyen('r1.xem');
  return <QuanTriR1Client daDangNhapBanDau={true} />;
}

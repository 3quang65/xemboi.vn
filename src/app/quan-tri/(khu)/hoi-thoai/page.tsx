import type { Metadata } from 'next';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import HoiThoaiClient from './HoiThoaiClient';

export const metadata: Metadata = { title: 'Hội thoại' };
export const dynamic = 'force-dynamic';

export default async function TrangHoiThoai() {
  const nd = await yeuCauQuyen('hoi_thoai.xem');
  return <HoiThoaiClient tenQuanTri={nd.hoTen} />;
}

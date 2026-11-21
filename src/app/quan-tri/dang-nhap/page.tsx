import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { nguoiDungHienTai } from '@/lib/quan-tri/phien';
import FormDangNhap from './FormDangNhap';
import '../quan-tri.css';

export const metadata: Metadata = { title: 'Đăng nhập quản trị', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function DangNhapPage() {
  if (await nguoiDungHienTai()) redirect('/quan-tri');
  return (
    <main className="qt-dn">
      <FormDangNhap />
    </main>
  );
}

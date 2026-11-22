import type { Metadata } from 'next';
import TrangBaiViet, { taoMetadataBaiViet } from '@/components/ck/TrangBaiViet';
import { danhSachBaiViet } from '@/lib/trang/nen';

export async function generateStaticParams() {
  const ds = await danhSachBaiViet('/kien-thuc/');
  return ds
    .map((b) => b.duongDan.replace(/^\/kien-thuc\//, ''))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return taoMetadataBaiViet(`/kien-thuc/${slug}`);
}

export default async function KienThucChiTietPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TrangBaiViet duongDan={`/kien-thuc/${slug}`} />;
}

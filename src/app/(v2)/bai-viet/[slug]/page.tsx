import type { Metadata } from 'next';
import TrangBaiViet, { taoMetadataBaiViet } from '@/components/ck/TrangBaiViet';
import { danhSachBaiViet } from '@/lib/trang/nen';

export async function generateStaticParams() {
  const ds = await danhSachBaiViet('/bai-viet/');
  return ds
    .map((b) => b.duongDan.replace(/^\/bai-viet\//, ''))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return taoMetadataBaiViet(`/bai-viet/${slug}`);
}

export default async function BaiVietChiTietPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TrangBaiViet duongDan={`/bai-viet/${slug}`} />;
}

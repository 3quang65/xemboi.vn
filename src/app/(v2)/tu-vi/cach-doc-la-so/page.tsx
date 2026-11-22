import type { Metadata } from 'next';
import TrangBaiViet, { taoMetadataBaiViet } from '@/components/ck/TrangBaiViet';

// Bài P1 TUVI-CACHDOC. Chưa có bài xuất bản thì 404; biên tập viên xuất bản ở /quan-tri là trang tự hiện.
export const revalidate = 3600;
const DUONG_DAN = '/tu-vi/cach-doc-la-so';

export async function generateMetadata(): Promise<Metadata> {
  return taoMetadataBaiViet(DUONG_DAN);
}

export default async function CachDocLaSoPage() {
  return <TrangBaiViet duongDan={DUONG_DAN} />;
}

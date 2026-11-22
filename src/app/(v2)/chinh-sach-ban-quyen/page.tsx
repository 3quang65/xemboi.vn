import type { Metadata } from 'next';
import TrangPhapLy, { taoMetadataPhapLy } from '@/components/ck/TrangPhapLy';

const DUONG_DAN = '/chinh-sach-ban-quyen';
const MAC_DINH = {
  title: 'Chính sách bản quyền và trích nguồn của xemboi.vn',
  h1: 'Chính sách bản quyền',
};

export async function generateMetadata(): Promise<Metadata> {
  return taoMetadataPhapLy(DUONG_DAN, MAC_DINH);
}

export default function ChinhSachBanQuyenPage() {
  return (
    <TrangPhapLy
      duongDan={DUONG_DAN}
      macDinh={MAC_DINH}
      choGiu="Nội dung đang được rà soát trước khi đăng."
    />
  );
}

import type { Metadata } from 'next';
import TrangPhapLy, { taoMetadataPhapLy } from '@/components/ck/TrangPhapLy';

const DUONG_DAN = '/chinh-sach-bao-mat-va-cookies';
const MAC_DINH = {
  title: 'Chính sách bảo mật và cookie của xemboi.vn',
  h1: 'Chính sách bảo mật và cookie',
};

export async function generateMetadata(): Promise<Metadata> {
  return taoMetadataPhapLy(DUONG_DAN, MAC_DINH);
}

export default function ChinhSachBaoMatPage() {
  return (
    <TrangPhapLy
      duongDan={DUONG_DAN}
      macDinh={MAC_DINH}
      choGiu="Nội dung đang được rà soát trước khi đăng."
    />
  );
}

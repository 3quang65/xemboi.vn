import type { Metadata } from 'next';
import TrangPhapLy, { taoMetadataPhapLy } from '@/components/ck/TrangPhapLy';

const DUONG_DAN = '/lien-he';
const MAC_DINH = {
  title: 'Liên hệ xemboi.vn: góp ý, báo lỗi, hợp tác',
  h1: 'Liên hệ',
};

export async function generateMetadata(): Promise<Metadata> {
  return taoMetadataPhapLy(DUONG_DAN, MAC_DINH);
}

export default function LienHePage() {
  return (
    <TrangPhapLy
      duongDan={DUONG_DAN}
      macDinh={MAC_DINH}
      choGiu="Thông tin liên hệ đang cập nhật."
    />
  );
}

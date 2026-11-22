import type { Metadata } from 'next';
import TrangPhapLy, { taoMetadataPhapLy } from '@/components/ck/TrangPhapLy';

const DUONG_DAN = '/chinh-sach-su-dung-va-khieu-nai';
const MAC_DINH = {
  title: 'Điều khoản sử dụng, khiếu nại và hoàn tiền của xemboi.vn',
  h1: 'Điều khoản sử dụng và khiếu nại',
};

export async function generateMetadata(): Promise<Metadata> {
  return taoMetadataPhapLy(DUONG_DAN, MAC_DINH);
}

export default function ChinhSachSuDungPage() {
  return (
    <TrangPhapLy
      duongDan={DUONG_DAN}
      macDinh={MAC_DINH}
      choGiu="Nội dung đang được rà soát trước khi đăng."
    />
  );
}

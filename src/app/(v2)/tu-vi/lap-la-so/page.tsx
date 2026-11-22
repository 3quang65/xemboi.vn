import { Suspense } from 'react';
import type { Metadata } from 'next';
import KhungTrang from '@/components/ck/KhungTrang';
import FormLaSo from '@/components/ck/FormLaSo';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';

const MAC_DINH_LAP_LA_SO = {
  title: 'Lập lá số tử vi miễn phí, an sao theo Nam phái',
};

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/tu-vi/lap-la-so', MAC_DINH_LAP_LA_SO);
}

export default async function LapLaSoPage() {
  const tt = await thongTinTrang('/tu-vi/lap-la-so', MAC_DINH_LAP_LA_SO);
  const namXemMacDinh = ngayHienTaiVN().nam;

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/tu-vi/lap-la-so"
      toi
      rong
    >
      <Suspense fallback={<p className="ck-dang-tai">Đang tải biểu mẫu…</p>}>
        <FormLaSo namXemMacDinh={namXemMacDinh} />
      </Suspense>
    </KhungTrang>
  );
}

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import FormLaSo from '@/components/ck/FormLaSo';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_TRON_DOI = {
  title: 'Lá số tử vi trọn đời: lập theo ngày giờ sinh của bạn',
  h1: 'Lá số tử vi trọn đời theo ngày giờ sinh',
};

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

function kiemCoThamSo(sp: Record<string, string | string[] | undefined>): boolean {
  return Object.values(sp).some((v) =>
    Array.isArray(v)
      ? v.some((item) => item.trim() !== '')
      : typeof v === 'string' && v.trim() !== '',
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base, nd] = await Promise.all([
    searchParams,
    metaTrang('/tu-vi/tron-doi', MAC_DINH_TRON_DOI),
    noiDungTheoDuongDan('/tu-vi/tron-doi'),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/tu-vi/tron-doi' },
      robots: { index: false, follow: true },
    };
  }
  return nd ? base : { ...base, robots: { index: false, follow: true } };
}

export default async function TuViTronDoiPage() {
  const tt = await thongTinTrang('/tu-vi/tron-doi', MAC_DINH_TRON_DOI);
  const namXemMacDinh = ngayHienTaiVN().nam;

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/tu-vi/tron-doi"
      toi
      rong
    >
      <Suspense fallback={<p className="ck-dang-tai">Đang tải biểu mẫu…</p>}>
        <FormLaSo namXemMacDinh={namXemMacDinh} tronDoi />
      </Suspense>

      <nav className="ck-lien-quan" aria-label="Liên kết trong cụm Tử vi">
        <h2>Tra cứu Tử vi</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          <Link href="/tu-vi/cung">12 cung tử vi</Link>
          <Link href="/tu-vi/sao">14 chính tinh</Link>
          <Link href="/tu-vi">Tổng quan Tử vi</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

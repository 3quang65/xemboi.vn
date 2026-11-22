import type { Metadata } from 'next';
import DanhSachNguonClient from '@/components/ck/DanhSachNguonClient';
import KhungTrang from '@/components/ck/KhungTrang';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { danhSachNguonCongKhai } from '@/lib/trang/nen';

export const dynamic = 'force-dynamic';

const MAC_DINH_NGUON = {
  title: 'Thư mục nguồn sách: tử vi, lịch, bát tự, Kinh Dịch',
  h1: 'Thư mục nguồn sách',
};

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function coThamSo(sp: Record<string, string | string[] | undefined>): boolean {
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
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/nguon', MAC_DINH_NGUON),
  ]);
  if (coThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/nguon' },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function NguonPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp, ds] = await Promise.all([
    thongTinTrang('/nguon', MAC_DINH_NGUON),
    searchParams,
    danhSachNguonCongKhai(),
  ]);
  const mangBanDau = layMot(sp.mang)?.trim();

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/nguon"
      tenCuoi="Nguồn sách"
      toi
    >
      <p className="ck-ng-gioi-thieu">
        Danh sách sách gốc và bộ dữ liệu xemboi dùng để đối chiếu. Sách còn bản quyền không có liên kết tải.
      </p>

      <DanhSachNguonClient danhSach={ds} mangBanDau={mangBanDau} />
    </KhungTrang>
  );
}

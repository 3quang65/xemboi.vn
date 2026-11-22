import type { Metadata } from 'next';
import Link from 'next/link';
import DoiNgayClient from '@/components/ck/DoiNgayClient';
import KhungTrang from '@/components/ck/KhungTrang';
import { NAM_MAX, NAM_MIN } from '@/components/ck/lichHelpers';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { duongSangAm } from '@/lib/tuvi-v2/am-lich';

const MAC_DINH_DOI_NGAY = {
  title: 'Đổi ngày dương sang âm, âm sang dương (1900–2100)',
  h1: 'Đổi ngày dương sang âm và âm sang dương',
};

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function kiemCoThamSo(sp: Record<string, string | string[] | undefined>): boolean {
  return Object.values(sp).some((v) =>
    Array.isArray(v) ? v.some((item) => item.trim() !== '') : typeof v === 'string' && v.trim() !== '',
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const sp = await searchParams;
  const base = await metaTrang('/lich-am/doi-ngay', MAC_DINH_DOI_NGAY);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/lich-am/doi-ngay' },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function DoiNgayPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/lich-am/doi-ngay', MAC_DINH_DOI_NGAY),
    searchParams,
  ]);

  const chieuRaw = layMot(sp.chieu);
  const chieu: 'duong' | 'am' = chieuRaw === 'am' ? 'am' : 'duong';
  const hn = ngayHienTaiVN();
  const macDinh =
    chieu === 'am' ? duongSangAm(hn.ngay, hn.thang, hn.nam) : { ...hn, nhuan: false };

  const dRaw = Number(layMot(sp.d));
  const mRaw = Number(layMot(sp.m));
  const yRaw = Number(layMot(sp.y));

  const ngay = Number.isInteger(dRaw) && dRaw >= 1 && dRaw <= 31 ? dRaw : macDinh.ngay;
  const thang = Number.isInteger(mRaw) && mRaw >= 1 && mRaw <= 12 ? mRaw : macDinh.thang;
  const nam =
    Number.isInteger(yRaw) && yRaw >= NAM_MIN && yRaw <= NAM_MAX ? yRaw : macDinh.nam;
  const nhuanRaw = layMot(sp.nhuan);
  const coNgayRieng = Boolean(layMot(sp.d) || layMot(sp.m) || layMot(sp.y));
  const nhuan =
    chieu === 'am' &&
    (nhuanRaw !== undefined
      ? nhuanRaw === '1' || nhuanRaw === 'true'
      : !coNgayRieng && Boolean(macDinh.nhuan));

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/lich-am/doi-ngay" toi>
      <DoiNgayClient
        chieuMacDinh={chieu}
        ngayMacDinh={ngay}
        thangMacDinh={thang}
        namMacDinh={nam}
        nhuanMacDinh={nhuan}
      />

      <nav className="ck-dieu-huong" aria-label="Liên kết công cụ lịch âm">
        <Link href="/lich-am" className="ck-nut ck-nut-vien">
          Lịch âm hôm nay
        </Link>
        <Link href="/lich-am/lich-van-nien" className="ck-nut ck-nut-vien">
          Lịch vạn niên
        </Link>
        <Link href="/lich-am/ngay-mai" className="ck-nut ck-nut-vien">
          Lịch âm ngày mai
        </Link>
        <Link href="/tet" className="ck-nut ck-nut-vien">
          Tết Nguyên Đán
        </Link>
      </nav>
    </KhungTrang>
  );
}

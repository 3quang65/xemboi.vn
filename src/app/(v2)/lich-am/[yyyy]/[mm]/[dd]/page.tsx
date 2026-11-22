import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ChiTietNgay from '@/components/ck/ChiTietNgay';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  duongDanNgay,
  duongDanThang,
  hai,
  ngayKeTiep,
  trongPhamViNam,
} from '@/components/ck/lichHelpers';
import { ngayHopLe, ngayLich, type ChiTietNgay as ChiTietNgayData } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';

function phanTichNgay(
  yyyy: string,
  mm: string,
  dd: string,
): { nam: number; thang: number; ngay: number; mm: string; dd: string } | null {
  if (!/^\d{4}$/.test(yyyy) || !/^(0[1-9]|1[0-2])$/.test(mm) || !/^(0[1-9]|[12]\d|3[01])$/.test(dd)) {
    return null;
  }
  const nam = Number(yyyy);
  const thang = Number(mm);
  const ngay = Number(dd);
  if (!trongPhamViNam(nam) || !ngayHopLe(ngay, thang, nam)) return null;
  return { nam, thang, ngay, mm, dd };
}

function taoThamSoNgay(ct: ChiTietNgayData, mm: string, dd: string) {
  return {
    dd,
    mm,
    yyyy: String(ct.duong.nam),
    'âm': `${ct.am.ngay}/${ct.am.thang}${ct.am.nhuan ? ' nhuận' : ''}`,
    'Can Chi': ct.canChiNam.ten,
  };
}

function macDinhNgay(ct: ChiTietNgayData, mm: string, dd: string) {
  return {
    title: `Ngày ${dd}/${mm}/${ct.duong.nam} âm lịch là ngày ${ct.am.ngay}/${ct.am.thang}`,
    h1: `Ngày ${dd}/${mm}/${ct.duong.nam} âm lịch`,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ yyyy: string; mm: string; dd: string }>;
}): Promise<Metadata> {
  const { yyyy, mm, dd } = await params;
  const parsed = phanTichNgay(yyyy, mm, dd);
  if (!parsed) notFound();

  const ct = ngayLich(parsed.ngay, parsed.thang, parsed.nam);
  const meta = await metaTrang(
    `/lich-am/${parsed.nam}/${mm}/${dd}`,
    macDinhNgay(ct, mm, dd),
    '/lich-am/{yyyy}/{mm}/{dd}',
    taoThamSoNgay(ct, mm, dd),
  );
  return { ...meta, robots: { index: false, follow: true } };
}

export default async function LichNgayPage({
  params,
}: {
  params: Promise<{ yyyy: string; mm: string; dd: string }>;
}) {
  const { yyyy, mm, dd } = await params;
  const parsed = phanTichNgay(yyyy, mm, dd);
  if (!parsed) notFound();

  const ct = ngayLich(parsed.ngay, parsed.thang, parsed.nam);
  const tt = await thongTinTrang(
    `/lich-am/${parsed.nam}/${mm}/${dd}`,
    macDinhNgay(ct, mm, dd),
    '/lich-am/{yyyy}/{mm}/{dd}',
    taoThamSoNgay(ct, mm, dd),
  );

  const truoc = ngayKeTiep(parsed.nam, parsed.thang, parsed.ngay, -1);
  const sau = ngayKeTiep(parsed.nam, parsed.thang, parsed.ngay, 1);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={`/lich-am/${parsed.nam}/${mm}/${dd}`}
      tenCuoi={`${dd}/${mm}/${parsed.nam}`}
      toi
    >
      <ChiTietNgay ngay={ct} />

      <nav className="ck-dieu-huong" aria-label="Điều hướng ngày và tháng">
        {truoc ? (
          <Link
            href={duongDanNgay(truoc.nam, truoc.thang, truoc.ngay)}
            className="ck-nut ck-nut-vien"
          >
            ← Ngày trước ({hai(truoc.ngay)}/{hai(truoc.thang)})
          </Link>
        ) : null}
        <Link href={duongDanThang(parsed.nam, parsed.thang)} className="ck-nut ck-nut-vien">
          Tháng {parsed.thang}/{parsed.nam}
        </Link>
        <Link href={`/lich-am/${parsed.nam}`} className="ck-nut ck-nut-vien">
          Năm {parsed.nam}
        </Link>
        {sau ? (
          <Link
            href={duongDanNgay(sau.nam, sau.thang, sau.ngay)}
            className="ck-nut ck-nut-vien"
          >
            Ngày sau ({hai(sau.ngay)}/{hai(sau.thang)}) →
          </Link>
        ) : null}
      </nav>
    </KhungTrang>
  );
}

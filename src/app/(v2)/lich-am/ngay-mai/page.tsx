import type { Metadata } from 'next';
import Link from 'next/link';
import ChiTietNgay from '@/components/ck/ChiTietNgay';
import KhungTrang from '@/components/ck/KhungTrang';
import { duongDanNgay, duongDanThang, hai, ngayKeTiep } from '@/components/ck/lichHelpers';
import { ngayMai, type ChiTietNgay as ChiTietNgayData } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';

export const revalidate = 3600;

const MAC_DINH_NGAY_MAI = {
  title: 'Lịch âm ngày mai: ngày mai là ngày bao nhiêu âm?',
  h1: 'Lịch âm ngày mai',
};

function taoThamSoNgayMai(mai: ChiTietNgayData) {
  return {
    'thứ': mai.thu,
    'dd/mm/yyyy': `${hai(mai.duong.ngay)}/${hai(mai.duong.thang)}/${mai.duong.nam}`,
    'âm': `${mai.am.ngay}/${mai.am.thang}${mai.am.nhuan ? ' nhuận' : ''}`,
    'Can Chi': mai.canChiNam.ten,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const mai = ngayMai();
  return metaTrang('/lich-am/ngay-mai', MAC_DINH_NGAY_MAI, undefined, taoThamSoNgayMai(mai));
}

export default async function NgayMaiPage() {
  const mai = ngayMai();
  const tt = await thongTinTrang(
    '/lich-am/ngay-mai',
    MAC_DINH_NGAY_MAI,
    undefined,
    taoThamSoNgayMai(mai),
  );
  const ngayKia = ngayKeTiep(mai.duong.nam, mai.duong.thang, mai.duong.ngay, 1);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/lich-am/ngay-mai" toi>
      <ChiTietNgay ngay={mai} />

      <nav className="ck-dieu-huong" aria-label="Điều hướng ngày">
        <Link href="/lich-am" className="ck-nut ck-nut-vien">
          ← Lịch âm hôm nay
        </Link>
        <Link
          href={duongDanThang(mai.duong.nam, mai.duong.thang)}
          className="ck-nut ck-nut-vien"
        >
          Lịch tháng {mai.duong.thang}/{mai.duong.nam}
        </Link>
        {ngayKia ? (
          <Link
            href={duongDanNgay(ngayKia.nam, ngayKia.thang, ngayKia.ngay)}
            className="ck-nut ck-nut-vien"
          >
            Ngày kia ({hai(ngayKia.ngay)}/{hai(ngayKia.thang)}) →
          </Link>
        ) : null}
      </nav>
    </KhungTrang>
  );
}

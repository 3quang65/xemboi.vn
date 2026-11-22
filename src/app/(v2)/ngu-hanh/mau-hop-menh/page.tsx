import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import MauHopMenhClient from '@/components/ck/MauHopMenhClient';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { NguonNapAm } from '@/components/ck/TheCanChi';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  NGU_HANH,
  danhSachNamSinh,
  mauHopMenh,
  quanHeHanh,
} from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_MAU_HOP = {
  title: 'Màu hợp mệnh: bảng màu cho 5 mệnh và tra theo năm sinh',
  h1: 'Màu hợp mệnh',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/ngu-hanh/mau-hop-menh', MAC_DINH_MAU_HOP),
    noiDungTheoDuongDan('/ngu-hanh/mau-hop-menh'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function MauHopMenhPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/ngu-hanh/mau-hop-menh', MAC_DINH_MAU_HOP),
    noiDungTheoDuongDan('/ngu-hanh/mau-hop-menh'),
  ]);

  const dsNam = danhSachNamSinh().flatMap((g) => g.nam);
  const bangMau = NGU_HANH.map((h) => ({
    hanh: h,
    slug: HANH_SLUG[h],
    quanHe: quanHeHanh(h),
    mau: mauHopMenh(h),
  }));

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/ngu-hanh/mau-hop-menh" toi>
      <MauHopMenhClient danhSachNam={dsNam} bangMau={bangMau} />

      <NguonNapAm />

      <KhoiDienGiai noiDung={nd} tieuDe="Quy ước ngũ hành – ngũ sắc" />

      <nav className="ck-lien-quan" aria-label="Liên kết cùng bộ">
        <h2>Xem chi tiết từng mệnh</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/ngu-hanh">Sơ đồ Ngũ hành</Link>
          {NGU_HANH.map((h) => (
            <Link key={h} href={`/ngu-hanh/${HANH_SLUG[h]}`}>
              Mệnh {h}
            </Link>
          ))}
          <Link href="/sinh-nam">Tra mệnh theo năm sinh</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

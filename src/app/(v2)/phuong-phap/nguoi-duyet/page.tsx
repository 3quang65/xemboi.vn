import type { Metadata } from 'next';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_NGUOI_DUYET = {
  title: 'Ban biên tập và người duyệt của xemboi.vn',
  h1: 'Ban biên tập và người duyệt',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/phuong-phap/nguoi-duyet', MAC_DINH_NGUOI_DUYET),
    noiDungTheoDuongDan('/phuong-phap/nguoi-duyet'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function NguoiDuyetPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/phuong-phap/nguoi-duyet', MAC_DINH_NGUOI_DUYET),
    noiDungTheoDuongDan('/phuong-phap/nguoi-duyet'),
  ]);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={null}
      duongDan="/phuong-phap/nguoi-duyet"
      tenCuoi="Người duyệt"
      toi
    >
      <KhoiDienGiai noiDung={nd} tieuDe="Ban biên tập và người duyệt" />
    </KhungTrang>
  );
}

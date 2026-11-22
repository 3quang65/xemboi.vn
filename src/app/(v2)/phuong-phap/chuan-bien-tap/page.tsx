import type { Metadata } from 'next';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_CHUAN_BIEN_TAP = {
  title: 'Chuẩn biên tập xemboi.vn: trích nguồn, từ cấm, giới hạn',
  h1: 'Chuẩn biên tập',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/phuong-phap/chuan-bien-tap', MAC_DINH_CHUAN_BIEN_TAP),
    noiDungTheoDuongDan('/phuong-phap/chuan-bien-tap'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function ChuanBienTapPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/phuong-phap/chuan-bien-tap', MAC_DINH_CHUAN_BIEN_TAP),
    noiDungTheoDuongDan('/phuong-phap/chuan-bien-tap'),
  ]);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={null}
      duongDan="/phuong-phap/chuan-bien-tap"
      tenCuoi="Chuẩn biên tập"
      toi
    >
      <KhoiDienGiai noiDung={nd} tieuDe="Chuẩn biên tập" />
    </KhungTrang>
  );
}

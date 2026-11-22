import type { Metadata } from 'next';
import Link from 'next/link';
import BangQuyUoc from '@/components/ck/BangQuyUoc';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { BANG_QUY_UOC } from '@/lib/trang/nen';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_PHUONG_PHAP = {
  title: 'Cách xemboi.vn tính và biên tập: quy ước, nguồn, người duyệt',
  h1: 'Phương pháp và chuẩn biên tập',
};

const CAC_THE_CHUYEN_MUC = [
  { ten: 'Nam phái và Bắc phái', href: '/phuong-phap/nam-phai-bac-phai' },
  { ten: 'Giờ Tý', href: '/phuong-phap/gio-ty' },
  { ten: 'Tháng nhuận', href: '/phuong-phap/thang-nhuan' },
  { ten: 'Chuẩn biên tập', href: '/phuong-phap/chuan-bien-tap' },
  { ten: 'Người duyệt', href: '/phuong-phap/nguoi-duyet' },
  { ten: 'Thư mục nguồn sách', href: '/nguon' },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/phuong-phap', MAC_DINH_PHUONG_PHAP),
    noiDungTheoDuongDan('/phuong-phap'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function PhuongPhapPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/phuong-phap', MAC_DINH_PHUONG_PHAP),
    noiDungTheoDuongDan('/phuong-phap'),
  ]);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/phuong-phap"
      tenCuoi="Phương pháp"
      toi
    >
      <KhoiDienGiai noiDung={nd} tieuDe="Giới thiệu phương pháp" />

      <section className="ck-td-muc" aria-labelledby="ck-pp-quy-uoc-tieu">
        <h2 id="ck-pp-quy-uoc-tieu" className="ck-td-tieu">
          Bảng quy ước tính
        </h2>
        <p className="ck-pp-cau-co-dinh">
          Khi lập lá số, bạn đổi được các quy ước có ghi cách khác.
        </p>

        <BangQuyUoc
          danhSach={BANG_QUY_UOC}
          duongDanHienTai="/phuong-phap"
          chiaNhom
        />
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-pp-trang-con-tieu">
        <h2 id="ck-pp-trang-con-tieu" className="ck-td-tieu">
          Chuyên mục phương pháp &amp; nguồn
        </h2>
        <div className="ck-pp-the-luoi">
          {CAC_THE_CHUYEN_MUC.map((muc) => (
            <Link key={muc.href} href={muc.href} className="ck-pp-the">
              <b>{muc.ten}</b>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </KhungTrang>
  );
}

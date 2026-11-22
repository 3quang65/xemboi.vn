import type { Metadata } from 'next';
import Link from 'next/link';
import BangQuyUoc from '@/components/ck/BangQuyUoc';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { BANG_QUY_UOC } from '@/lib/trang/nen';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_NAM_BAC = {
  title: 'Tử vi Nam phái và Bắc phái khác nhau thế nào?',
  h1: 'Tử vi Nam phái và Bắc phái: các điểm khác nhau',
};

const QUY_UOC_TU_VI_KHAC_BIET = BANG_QUY_UOC.filter(
  (q) => q.mang === 'Tử vi' && q.khac.length > 0,
);

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/phuong-phap/nam-phai-bac-phai', MAC_DINH_NAM_BAC),
    noiDungTheoDuongDan('/phuong-phap/nam-phai-bac-phai'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function NamPhaiBacPhaiPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/phuong-phap/nam-phai-bac-phai', MAC_DINH_NAM_BAC),
    noiDungTheoDuongDan('/phuong-phap/nam-phai-bac-phai'),
  ]);
  const daDung = trangDaDung();

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/phuong-phap/nam-phai-bac-phai"
      tenCuoi="Nam phái và Bắc phái"
      toi
    >
      <section className="ck-td-muc" aria-labelledby="ck-pp-nb-tieu">
        <h2 id="ck-pp-nb-tieu" className="ck-td-tieu">
          Các điểm xemboi cho chọn khi lập lá số
        </h2>
        <BangQuyUoc
          danhSach={QUY_UOC_TU_VI_KHAC_BIET}
          duongDanHienTai="/phuong-phap/nam-phai-bac-phai"
        />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="So sánh Nam phái và Bắc phái" />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Liên kết liên quan</h2>
        <div className="ck-lien-quan-ds">
          {daDung.has('/tu-vi/lap-la-so') ? (
            <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          ) : null}
          {daDung.has('/tu-vi') ? <Link href="/tu-vi">Tổng quan Tử vi</Link> : null}
          <Link href="/phuong-phap">Phương pháp và chuẩn biên tập</Link>
          <Link href="/phuong-phap/gio-ty">Sinh giờ Tý</Link>
          <Link href="/phuong-phap/thang-nhuan">Tháng nhuận âm lịch</Link>
          <Link href="/nguon">Thư mục nguồn sách</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

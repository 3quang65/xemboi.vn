import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { CUNG_TU_VI } from '@/lib/trang/tu-vi-tu-dien';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_CUNG_IDX = {
  title: '12 cung trong lá số tử vi: ý nghĩa từng cung',
  h1: '12 cung trong lá số tử vi',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/tu-vi/cung', MAC_DINH_CUNG_IDX),
    noiDungTheoDuongDan('/tu-vi/cung'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function TuViCungIndexPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/tu-vi/cung', MAC_DINH_CUNG_IDX),
    noiDungTheoDuongDan('/tu-vi/cung'),
  ]);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/tu-vi/cung" toi>
      <section className="ck-td-muc" aria-labelledby="ck-cung-ds-tieu">
        <h2 id="ck-cung-ds-tieu" className="ck-td-tieu">
          12 cung chức năng theo thứ tự an từ Mệnh (an nghịch)
        </h2>

        <div className="ck-cung-luoi">
          {CUNG_TU_VI.map((c) => (
            <Link key={c.slug} href={`/tu-vi/cung/${c.slug}`} className="ck-cung-the">
              <span className="ck-cung-thu-tu">Cung thứ {c.thuTu}/12</span>
              <b>{c.ten}</b>
              <span className="ck-cung-vi-tri">
                {c.thuTu === 1
                  ? 'Cung khởi điểm (gốc)'
                  : `Cách Mệnh ${c.thuTu - 1} cung (an nghịch)`}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="Giải thích 12 cung Tử vi" />

      <nav className="ck-lien-quan" aria-label="Liên kết trong cụm Tử vi">
        <h2>Tra cứu Tử vi</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/tu-vi/sao">14 chính tinh</Link>
          <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          <Link href="/tu-vi/tron-doi">Lá số tử vi trọn đời</Link>
          <Link href="/tu-vi">Tổng quan Tử vi</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

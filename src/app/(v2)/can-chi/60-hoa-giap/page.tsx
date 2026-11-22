import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { HuyHieuHanh, NguonNapAm } from '@/components/ck/TheCanChi';
import { duongDanConGiap } from '@/components/ck/canChiHelpers';
import { HOA_GIAP } from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_HOA_GIAP_IDX = {
  title: 'Lục thập hoa giáp: bảng 60 cặp can chi và nạp âm',
  h1: 'Lục thập hoa giáp',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/can-chi/60-hoa-giap', MAC_DINH_HOA_GIAP_IDX),
    noiDungTheoDuongDan('/can-chi/60-hoa-giap'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function SauMuoiHoaGiapPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/can-chi/60-hoa-giap', MAC_DINH_HOA_GIAP_IDX),
    noiDungTheoDuongDan('/can-chi/60-hoa-giap'),
  ]);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/can-chi/60-hoa-giap" toi>
      <section className="ck-td-muc" aria-labelledby="ck-hg-bang-tieu">
        <h2 id="ck-hg-bang-tieu" className="ck-td-tieu">
          Bảng 60 hoa giáp (từ Giáp Tý đến Quý Hợi)
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang ck-bang-gon">
            <thead>
              <tr>
                <th>STT</th>
                <th>Hoa giáp</th>
                <th>Âm dương</th>
                <th>Nạp âm</th>
                <th>Hành</th>
                <th>Con giáp</th>
              </tr>
            </thead>
            <tbody>
              {HOA_GIAP.map((h) => (
                <tr key={h.stt}>
                  <td>{h.stt}</td>
                  <td>
                    <Link href={`/can-chi/${h.slug}`}>
                      <b>{h.ten}</b>
                    </Link>
                  </td>
                  <td>{h.amDuong}</td>
                  <td>
                    <Link href={`/nap-am/${h.slugNapAm}`}>{h.napAm}</Link>
                  </td>
                  <td>
                    <HuyHieuHanh hanh={h.hanh} lienKet />
                  </td>
                  <td>
                    <Link href={duongDanConGiap(h.chi)}>
                      {h.chi} ({h.conGiap})
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <NguonNapAm />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="Diễn giải Lục thập hoa giáp" />

      <nav className="ck-lien-quan" aria-label="Liên kết cùng bộ">
        <h2>Danh mục liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/can-chi">Tổng quan Can chi &amp; mệnh</Link>
          <Link href="/nap-am">Bảng 30 nạp âm</Link>
          <Link href="/sinh-nam">Tra mệnh theo năm sinh (1930–2030)</Link>
          <Link href="/ngu-hanh">Ngũ hành tương sinh – khắc</Link>
          <Link href="/con-giap">12 con giáp</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

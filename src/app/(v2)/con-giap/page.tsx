import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { VongConGiap } from '@/components/ck/truc-quan';
import { NguonNapAm } from '@/components/ck/TheCanChi';
import { duongDanConGiap } from '@/components/ck/canChiHelpers';
import { CON_GIAP } from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_CON_GIAP_IDX = {
  title: '12 con giáp: thứ tự, năm sinh, tính chất theo sách',
  h1: '12 con giáp',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/con-giap', MAC_DINH_CON_GIAP_IDX),
    noiDungTheoDuongDan('/con-giap'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function ConGiapIndexPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/con-giap', MAC_DINH_CON_GIAP_IDX),
    noiDungTheoDuongDan('/con-giap'),
  ]);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/con-giap" toi>
      <section className="ck-td-muc" aria-labelledby="ck-cg-vong-tieu">
        <h2 id="ck-cg-vong-tieu" className="ck-td-tieu">
          Vòng tròn 12 con giáp
        </h2>
        <VongConGiap />
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-cg-ds-tieu">
        <h2 id="ck-cg-ds-tieu" className="ck-td-tieu">
          12 địa chi từ Tý đến Hợi
        </h2>

        <div className="ck-giap-luoi">
          {CON_GIAP.map((cg) => (
            <Link key={cg.chi} href={duongDanConGiap(cg.chi)} className="ck-giap-the">
              <span className="ck-giap-thu-tu">Thứ {cg.thuTu}</span>
              <b>
                Tuổi {cg.chi} ({cg.ten})
              </b>
              <span className="ck-giap-phu">
                Hành {cg.hanhChi} · {cg.amDuong}
              </span>
            </Link>
          ))}
        </div>

        <NguonNapAm />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="Giải thích 12 con giáp" />

      <nav className="ck-lien-quan" aria-label="Liên kết cùng bộ">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/can-chi">Tổng quan Can chi &amp; mệnh</Link>
          <Link href="/can-chi/60-hoa-giap">Bảng 60 hoa giáp</Link>
          <Link href="/sinh-nam">Tra mệnh theo năm sinh (1930–2030)</Link>
          <Link href="/nap-am">Bảng 30 nạp âm</Link>
          <Link href="/ngu-hanh">Ngũ hành tương sinh – khắc</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

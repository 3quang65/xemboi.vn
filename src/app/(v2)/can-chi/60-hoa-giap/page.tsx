import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { ChuGiaiHanh } from '@/components/ck/truc-quan';
import { HuyHieuHanh, NguonNapAm } from '@/components/ck/TheCanChi';
import { HANH_SLUG, duongDanConGiap } from '@/components/ck/canChiHelpers';
import { HOA_GIAP } from '@/lib/trang/can-chi';
import { homNay } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { luoi60HoaGiap } from '@/lib/trang/tra-cuu-truc-quan';

export const revalidate = 3600;

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
  const namAmHienTai = homNay().am.nam;
  const luoi = luoi60HoaGiap(namAmHienTai);
  const oNamNay = luoi.find((o) => o.laNamNay);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/can-chi/60-hoa-giap" toi rong>
      <section className="ck-td-muc" aria-labelledby="ck-hg-luoi-tieu">
        <h2 id="ck-hg-luoi-tieu" className="ck-td-tieu">
          Lưới 60 hoa giáp (từ Giáp Tý đến Quý Hợi)
        </h2>

        <div className="ck-hg-dau">
          <ChuGiaiHanh />
          <p className="ck-hg-nam-nay">
            Năm âm hiện tại: <strong>{namAmHienTai}</strong>
            {oNamNay ? ` (${oNamNay.ten})` : ''}
          </p>
        </div>

        <ol className="ck-hg-luoi">
          {luoi.map((o) => {
            const hanhSlug = HANH_SLUG[o.hanh];
            return (
              <li key={o.stt}>
                <Link
                  href={`/can-chi/${o.slug}`}
                  className={`ck-hg-o ck-tq-nen-${hanhSlug}${o.laNamNay ? ' ck-hg-o-nay' : ''}`}
                  data-nam-nay={o.laNamNay ? '1' : '0'}
                >
                  <span className="ck-hg-o-dau">
                    <span className="ck-hg-stt">{o.stt}</span>
                    {o.laNamNay ? <span className="ck-hg-tag">Năm nay</span> : null}
                  </span>
                  <strong className={`ck-hg-ten ck-tq-hanh-${hanhSlug}`}>{o.ten}</strong>
                  <span className="ck-hg-nap-am">{o.napAm}</span>
                  <span className="ck-hg-nam">{o.cacNam.join(' · ')}</span>
                </Link>
              </li>
            );
          })}
        </ol>

        <details className="ck-hg-bang-details">
          <summary className="ck-tq-sach-nut">Xem dạng bảng</summary>
          <div className="ck-bang-khung" style={{ marginTop: 12 }}>
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
        </details>
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

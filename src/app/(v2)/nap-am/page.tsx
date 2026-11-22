import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { HuyHieuHanh, NguonNapAm } from '@/components/ck/TheCanChi';
import { HANH_SLUG, NAP_AM_HAN } from '@/components/ck/canChiHelpers';
import { NAP_AM, NGU_HANH } from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_NAP_AM_IDX = {
  title: 'Nạp âm là gì? 30 nạp âm ngũ hành và cách tính',
  h1: 'Nạp âm là gì',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/nap-am', MAC_DINH_NAP_AM_IDX),
    noiDungTheoDuongDan('/nap-am'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function NapAmIndexPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/nap-am', MAC_DINH_NAP_AM_IDX),
    noiDungTheoDuongDan('/nap-am'),
  ]);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/nap-am" toi>
      <nav className="ck-thap-ky-nhay" aria-label="Nhảy nhanh theo ngũ hành">
        {NGU_HANH.map((h) => (
          <a key={h} href={`#nhom-${HANH_SLUG[h]}`}>
            Mệnh {h} (6)
          </a>
        ))}
      </nav>

      {NGU_HANH.map((h) => {
        const ds = NAP_AM.filter((n) => n.hanh === h);
        const slug = HANH_SLUG[h];
        return (
          <section
            key={h}
            id={`nhom-${slug}`}
            className="ck-na-nhom"
            aria-labelledby={`tieu-nhom-${slug}`}
          >
            <div className="ck-na-dau">
              <h2 id={`tieu-nhom-${slug}`}>Nạp âm hành {h}</h2>
              <HuyHieuHanh hanh={h} lienKet />
            </div>

            <div className="ck-na-luoi">
              {ds.map((na) => (
                <Link key={na.slug} href={`/nap-am/${na.slug}`} className="ck-na-o">
                  <b>{na.ten}</b>
                  {NAP_AM_HAN[na.slug] ? <small>{NAP_AM_HAN[na.slug]}</small> : null}
                  <span>
                    {na.hoaGiap[0].ten} · {na.hoaGiap[1].ten}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <NguonNapAm />

      <KhoiDienGiai noiDung={nd} tieuDe="Giải thích 30 nạp âm" />

      <nav className="ck-lien-quan" aria-label="Liên kết cùng bộ">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/can-chi">Tổng quan Can chi &amp; mệnh</Link>
          <Link href="/can-chi/60-hoa-giap">Bảng 60 hoa giáp</Link>
          <Link href="/ngu-hanh">Ngũ hành tương sinh – khắc</Link>
          <Link href="/sinh-nam">Tra mệnh theo năm sinh</Link>
          <Link href="/con-giap">12 con giáp</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import TuDienThuatNguClient from '@/components/ck/TuDienThuatNguClient';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { danhSachThuatNgu } from '@/lib/trang/nen';

const MAC_DINH_TU_DIEN = {
  title: 'Từ điển huyền học A–Z: sao, cung, quẻ, can chi, tiết khí',
  h1: 'Từ điển huyền học A–Z',
};

const MUC_TU_DIEN_DA_CO = [
  { href: '/tu-vi/sao', ten: '14 chính tinh', soMuc: '14 chính tinh' },
  { href: '/tu-vi/cung', ten: '12 cung tử vi', soMuc: '12 cung' },
  { href: '/can-chi/60-hoa-giap', ten: '60 hoa giáp', soMuc: '60' },
  { href: '/nap-am', ten: 'Nạp âm', soMuc: '30' },
  { href: '/con-giap', ten: '12 con giáp', soMuc: '12' },
  { href: '/ngu-hanh', ten: 'Ngũ hành', soMuc: '5' },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/tu-dien', MAC_DINH_TU_DIEN);
}

export default async function TuDienPage() {
  const [tt, nhom] = await Promise.all([
    thongTinTrang('/tu-dien', MAC_DINH_TU_DIEN),
    danhSachThuatNgu(),
  ]);
  const daDung = trangDaDung();
  const chiMucHien = MUC_TU_DIEN_DA_CO.filter((m) => daDung.has(m.href));

  const schemaDefinedTermSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: tt.h1,
    url: tt.canonical,
    hasDefinedTerm: nhom.flatMap((g) =>
      g.muc.map((t) => ({
        '@type': 'DefinedTerm',
        name: t.hanViet,
        ...(t.lienKet ? { url: `https://xemboi.vn${t.lienKet}` } : {}),
      })),
    ),
  };

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/tu-dien"
      tenCuoi="Từ điển"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaDefinedTermSet).replace(/</g, '\\u003c'),
        }}
      />

      {chiMucHien.length > 0 ? (
        <section className="ck-td-muc" aria-labelledby="ck-tdt-co-tieu">
          <h2 id="ck-tdt-co-tieu" className="ck-td-tieu">
            Mục từ điển đã có
          </h2>
          <div className="ck-tdt-chi-muc">
            {chiMucHien.map((m) => (
              <Link key={m.href} href={m.href} className="ck-tdt-the">
                <b>{m.ten}</b>
                <span className="ck-tdt-so-muc">{m.soMuc}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="ck-td-muc" aria-labelledby="ck-tdt-thuat-ngu-tieu">
        <h2 id="ck-tdt-thuat-ngu-tieu" className="ck-td-tieu">
          Thuật ngữ
        </h2>
        <TuDienThuatNguClient nhom={nhom} />
      </section>
    </KhungTrang>
  );
}

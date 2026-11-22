import type { Metadata } from 'next';
import { R1_COPY } from '@/lib/r1/copy';
import { breadcrumb, schemaBreadcrumb } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import TrangR1Client from '@/components/r1/TrangR1Client';

const MAC_DINH_TU_VI_2027 = {
  title: R1_COPY.tieuDeTrang,
  description: R1_COPY.moTaMeta,
  h1: R1_COPY.hero.tieuDe,
};

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/tu-vi-2027', MAC_DINH_TU_VI_2027);
}

export default async function TuVi2027Page() {
  const tt = await thongTinTrang('/tu-vi-2027', MAC_DINH_TU_VI_2027);
  const jsonLdBreadcrumb = schemaBreadcrumb(breadcrumb('/tu-vi-2027'));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdBreadcrumb).replace(/</g, '\\u003c'),
        }}
      />
      {tt.schemaJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(tt.schemaJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      ) : null}
      <TrangR1Client trongKhungV2 />
    </>
  );
}

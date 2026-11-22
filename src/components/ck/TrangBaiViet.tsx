import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import NoiDungMd from '@/components/ck/NoiDungMd';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

export function dinhDangDateVN(d: Date): string {
  const v = new Date(d.getTime() + 7 * 3600_000);
  const dd = String(v.getUTCDate()).padStart(2, '0');
  const mm = String(v.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = v.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export async function taoMetadataBaiViet(duongDan: string): Promise<Metadata> {
  const nd = await noiDungTheoDuongDan(duongDan);
  if (!nd) notFound();

  return metaTrang(duongDan, {
    title: nd.tieuDe,
    description: nd.tomTat ?? undefined,
    h1: nd.tieuDe,
  });
}

export default async function TrangBaiViet({ duongDan }: { duongDan: string }) {
  const nd = await noiDungTheoDuongDan(duongDan);
  if (!nd) notFound();

  const tt = await thongTinTrang(duongDan, {
    title: nd.tieuDe,
    description: nd.tomTat ?? undefined,
    h1: nd.tieuDe,
  });

  const ngayDang = nd.ngayXuatBan ? dinhDangDateVN(nd.ngayXuatBan) : null;
  const ngayCapNhat = dinhDangDateVN(nd.capNhatLuc);

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tt.h1,
    datePublished: (nd.ngayXuatBan ?? nd.capNhatLuc).toISOString(),
    dateModified: nd.capNhatLuc.toISOString(),
    ...(nd.tomTat ? { description: nd.tomTat } : {}),
    mainEntityOfPage: tt.canonical,
    publisher: {
      '@type': 'Organization',
      name: 'XemBói.vn',
      url: 'https://xemboi.vn',
    },
  };

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={nd.tomTat ?? tt.description}
      duongDan={duongDan}
      breadcrumbRieng={[
        { ten: 'Trang chủ', href: '/' },
        { ten: 'Kiến thức', href: '/kien-thuc' },
        { ten: nd.tieuDe, href: duongDan },
      ]}
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c'),
        }}
      />

      <article className="ck-bai-doc">
        <p className="ck-bai-ngay">
          {ngayDang ? (
            <>
              Đăng {ngayDang}
              {ngayCapNhat !== ngayDang ? ` · Cập nhật ${ngayCapNhat}` : ''}
            </>
          ) : (
            `Cập nhật ${ngayCapNhat}`
          )}
        </p>

        {nd.than.length > 0 ? <NoiDungMd khoi={nd.than} capGoc={2} /> : null}

        {nd.khoi.length > 0 ? (
          <div className="ck-nd-cac-khoi">
            {nd.khoi.map((k) => (
              <section key={k.ma} className="ck-nd-khoi">
                <h2>{k.ten}</h2>
                <NoiDungMd khoi={k.noi} capGoc={3} />
              </section>
            ))}
          </div>
        ) : null}

        {nd.trichDan.length > 0 ? (
          <section className="ck-bai-nguon" aria-labelledby="ck-bai-nguon-tieu">
            <h2 id="ck-bai-nguon-tieu">Nguồn</h2>
            <ul>
              {nd.trichDan.map((td, idx) => (
                <li key={idx}>
                  {td.tenSach ? <strong>{td.tenSach}</strong> : null}
                  {td.viTri ? <span> ({td.viTri})</span> : null}
                  {td.cauTrich ? <p>"{td.cauTrich}"</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>

      <nav className="ck-lien-quan ck-bai-chan" aria-label="Điều hướng bài viết">
        <h2>Đọc tiếp</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/kien-thuc">Kiến thức huyền học</Link>
          <Link href="/phuong-phap">Phương pháp và chuẩn biên tập</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

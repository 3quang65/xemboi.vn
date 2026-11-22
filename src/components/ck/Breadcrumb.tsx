import Link from 'next/link';
import { schemaBreadcrumb, trangDaDung, type MatXich } from '@/lib/trang/dieu-huong';

export interface BreadcrumbProps {
  danhSach: MatXich[];
  toi?: boolean;
}

export default function Breadcrumb({ danhSach, toi = false }: BreadcrumbProps) {
  if (danhSach.length <= 1) return null;

  const daDung = trangDaDung();
  const jsonLd = schemaBreadcrumb(danhSach);

  return (
    <>
      <nav aria-label="Đường dẫn" className={`ck-vet${toi ? ' ck-toi' : ''}`}>
        <ol>
          {danhSach.map((muc, i) => {
            const laCuoi = i === danhSach.length - 1;
            return (
              <li key={`${muc.href}-${i}`}>
                {laCuoi ? (
                  <b aria-current="page">{muc.ten}</b>
                ) : daDung.has(muc.href) ? (
                  <Link href={muc.href}>{muc.ten}</Link>
                ) : (
                  <span>{muc.ten}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}

import React from 'react';
import Link from 'next/link';
import type { DoanChu, KhoiMd, NoiDungHienThi } from '@/lib/trang/noi-dung';

function locHrefAnToan(href: string): string | null {
  const h = href.trim();
  if (/^\/(?!\/)/.test(h)) return h;
  if (/^https?:\/\/[^\s]+$/i.test(h)) return h;
  return null;
}

function renderDoanChu(ds: DoanChu[]) {
  return ds.map((d, idx) => {
    if (d.loai === 'dam') return <strong key={idx}>{d.chu}</strong>;
    if (d.loai === 'nghieng') return <em key={idx}>{d.chu}</em>;
    if (d.loai === 'lienKet') {
      const anToan = locHrefAnToan(d.href);
      if (!anToan) return <React.Fragment key={idx}>{d.chu}</React.Fragment>;
      if (anToan.startsWith('/')) {
        return (
          <Link key={idx} href={anToan}>
            {d.chu}
          </Link>
        );
      }
      return (
        <a key={idx} href={anToan} target="_blank" rel="noopener noreferrer">
          {d.chu}
        </a>
      );
    }
    return <React.Fragment key={idx}>{d.chu}</React.Fragment>;
  });
}

function TieuDeCap({ cap, noi }: { cap: number; noi: DoanChu[] }) {
  const content = renderDoanChu(noi);
  if (cap <= 2) return <h2>{content}</h2>;
  if (cap === 3) return <h3>{content}</h3>;
  if (cap === 4) return <h4>{content}</h4>;
  return <h5>{content}</h5>;
}

export function NoiDungMd({
  khoi,
  capGoc = 2,
}: {
  khoi: KhoiMd[];
  capGoc?: 2 | 3 | 4;
}) {
  if (!khoi.length) return null;

  return (
    <div className="ck-nd-md">
      {khoi.map((k, idx) => {
        if (k.loai === 'tieuDe') {
          const cap = Math.min(5, Math.max(capGoc, k.cap + (capGoc - 2)));
          return <TieuDeCap key={idx} cap={cap} noi={k.noi} />;
        }
        if (k.loai === 'doan') {
          return <p key={idx}>{renderDoanChu(k.noi)}</p>;
        }
        if (k.loai === 'trich') {
          return <blockquote key={idx}>{renderDoanChu(k.noi)}</blockquote>;
        }
        const Tag = k.coThuTu ? 'ol' : 'ul';
        return (
          <Tag key={idx}>
            {k.muc.map((muc, j) => (
              <li key={j}>{renderDoanChu(muc)}</li>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}

export default NoiDungMd;

export function KhoiDienGiai({
  noiDung,
  tieuDe = 'Diễn giải',
}: {
  noiDung: NoiDungHienThi | null;
  tieuDe?: string;
}) {
  if (!noiDung) {
    return (
      <section className="ck-td-muc" aria-labelledby="ck-dien-giai-tieu">
        <div className="ck-cho-noi-dung">
          <h2 id="ck-dien-giai-tieu">{tieuDe}</h2>
          <p>Phần diễn giải đang biên tập</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ck-td-muc ck-nd-khung" aria-labelledby="ck-dien-giai-tieu">
      <h2 id="ck-dien-giai-tieu" className="ck-td-tieu">
        {noiDung.tieuDe || tieuDe}
      </h2>

      {noiDung.tomTat ? <p className="ck-nd-tom-tat">{noiDung.tomTat}</p> : null}

      {noiDung.than.length > 0 ? <NoiDungMd khoi={noiDung.than} capGoc={3} /> : null}

      {noiDung.khoi.length > 0 ? (
        <div className="ck-nd-cac-khoi">
          {noiDung.khoi.map((k) => (
            <div key={k.ma} className="ck-nd-khoi">
              <h3>{k.ten}</h3>
              <NoiDungMd khoi={k.noi} capGoc={4} />
            </div>
          ))}
        </div>
      ) : null}

      {noiDung.trichDan.length > 0 ? (
        <div className="ck-trich-dan">
          <h3>Nguồn trích dẫn</h3>
          <ul>
            {noiDung.trichDan.map((td, idx) => (
              <li key={idx}>
                {td.tenSach ? <strong>{td.tenSach}</strong> : null}
                {td.viTri ? <span> ({td.viTri})</span> : null}
                {td.cauTrich ? <p>"{td.cauTrich}"</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

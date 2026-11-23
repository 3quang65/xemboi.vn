import './truc-quan.css';

export interface TrichNguyenVanItem {
  doanId: number;
  viTri: string;
  nguyenVan: string;
}

export interface NguonSachItem {
  tenGoc: string;
  tenHanViet: string;
  tacGia?: string;
  nienDai?: string;
  ghiCong: string;
  url: string;
}

export interface TrichNguyenVanProps {
  trich: TrichNguyenVanItem;
  nguon: NguonSachItem;
}

export function TrichNguyenVan({ trich, nguon }: TrichNguyenVanProps) {
  const phan = [nguon.tacGia, nguon.nienDai, trich.viTri]
    .filter(Boolean)
    .join(', ');

  return (
    <figure className="ck-tq-trich">
      <blockquote className="ck-tq-trich-han" lang="zh-Hant">
        {trich.nguyenVan}
      </blockquote>
      <figcaption className="ck-tq-trich-nguon">
        <em>{nguon.tenHanViet}</em> ({nguon.tenGoc})
        {phan ? `, ${phan}` : ''} · đoạn {trich.doanId}.{' '}
        <a href={nguon.url} target="_blank" rel="noopener noreferrer nofollow">
          {nguon.ghiCong}
        </a>
      </figcaption>
    </figure>
  );
}

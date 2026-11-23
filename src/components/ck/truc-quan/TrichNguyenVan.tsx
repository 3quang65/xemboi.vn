import './truc-quan.css';

export interface TrichNguyenVanProps {
  dich: string;
  viTriViet: string;
  tenSach: string;
  ghiCong: string;
  url: string;
  tacGia?: string;
  nienDai?: string;
  doanId?: number;
  ghiCongDich?: string;
  nhan?: string;
}

export function TrichNguyenVan({
  dich,
  viTriViet,
  tenSach,
  ghiCong,
  url,
  tacGia,
  nienDai,
  doanId,
  ghiCongDich = 'Dịch nghĩa: xemboi',
  nhan,
}: TrichNguyenVanProps) {
  const phan = [tacGia, nienDai, viTriViet].filter(Boolean).join(', ');

  return (
    <figure className="ck-tq-trich">
      {nhan ? <span className="ck-tq-trich-nhan">{nhan}</span> : null}
      <blockquote className="ck-tq-trich-dich">{dich}</blockquote>
      <figcaption className="ck-tq-trich-nguon">
        <em>{tenSach}</em>
        {phan ? `, ${phan}` : ''}
        {doanId !== undefined ? ` · đoạn ${doanId}` : ''}.{' '}
        <a href={url} target="_blank" rel="noopener noreferrer nofollow">
          {ghiCong}
        </a>
        <span className="ck-tq-trich-dich-gia">{ghiCongDich}</span>
      </figcaption>
    </figure>
  );
}

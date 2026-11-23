import Link from 'next/link';
import { dinhDangNgayVN, duongDanNgayTuIso } from '@/components/ck/lichHelpers';
import type { NgayChon } from '@/lib/trang/xem-ngay-truc-quan';
import './truc-quan.css';

export interface TheNgayChonProps {
  ngay: NgayChon;
  coLink?: boolean;
}

export function TheNgayChon({ ngay, coLink = true }: TheNgayChonProps) {
  const href = coLink ? duongDanNgayTuIso(ngay.iso) : null;
  const cls = ngay.dauDanh ? 'ck-tq-nc-the ck-tq-nc-dau' : 'ck-tq-nc-the';

  const noiDung = (
    <>
      <div className="ck-tq-nc-dau-hang">
        <div className="ck-tq-nc-tieu">
          <span className="ck-tq-nc-ngay">
            {ngay.thu} {dinhDangNgayVN(ngay.iso)}
          </span>
          <span className="ck-tq-nc-phu">
            Âm {ngay.am} · Ngày {ngay.canChiNgay}
          </span>
        </div>
        {ngay.dauDanh ? (
          <span className="ck-tq-nc-huy-hieu">Hợp nhất trong khoảng</span>
        ) : null}
      </div>

      <ul className="ck-tq-nc-ly-do">
        {ngay.lyDo.map((cau, i) => (
          <li key={i}>{cau}</li>
        ))}
      </ul>

      {href ? <span className="ck-tq-nc-xem">Xem chi tiết ngày →</span> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {noiDung}
      </Link>
    );
  }

  return <article className={cls}>{noiDung}</article>;
}

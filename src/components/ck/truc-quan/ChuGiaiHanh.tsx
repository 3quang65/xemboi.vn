import type { Hanh } from '@/lib/trang/can-chi';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import './truc-quan.css';

const THU_TU_MAC_DINH: readonly Hanh[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];

export interface ChuGiaiHanhProps {
  thuTu?: readonly Hanh[];
  className?: string;
}

export function ChuGiaiHanh({
  thuTu = THU_TU_MAC_DINH,
  className,
}: ChuGiaiHanhProps) {
  return (
    <ul
      className={className ? `ck-tq-hanh-cg ${className}` : 'ck-tq-hanh-cg'}
      aria-label="Chú giải màu ngũ hành"
    >
      {thuTu.map((hanh) => (
        <li key={hanh}>
          <i
            className={`ck-tq-hanh-cham ck-tq-cham-${HANH_SLUG[hanh]}`}
            aria-hidden="true"
          />
          <span>{hanh}</span>
        </li>
      ))}
    </ul>
  );
}

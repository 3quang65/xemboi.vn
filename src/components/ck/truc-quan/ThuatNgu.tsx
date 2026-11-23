import './truc-quan.css';

export interface ThuatNguProps {
  ten: string;
  nghia: string;
  id: string;
  className?: string;
}

export function ThuatNgu({ ten, nghia, id, className }: ThuatNguProps) {
  return (
    <span className={className ? `ck-tq-tn ${className}` : 'ck-tq-tn'}>
      <button type="button" className="ck-tq-tn-nut" popoverTarget={id} title={nghia}>
        <span className="ck-tq-tn-chu">{ten}</span>
      </button>
      <span popover="auto" id={id} className="ck-tq-tn-hop">
        <span className="ck-tq-tn-dau">
          <strong className="ck-tq-tn-ten">{ten}</strong>
          <button
            type="button"
            className="ck-tq-tn-dong"
            popoverTarget={id}
            popoverTargetAction="hide"
            aria-label={`Đóng giải nghĩa ${ten}`}
          >
            ×
          </button>
        </span>
        <span className="ck-tq-tn-nghia">{nghia}</span>
      </span>
    </span>
  );
}

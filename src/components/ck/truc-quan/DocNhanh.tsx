import type { ReactNode } from 'react';
import type { Hanh } from '@/lib/trang/can-chi';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import { TrichNguyenVan, type TrichNguyenVanProps } from './TrichNguyenVan';
import './truc-quan.css';

export type TrichSachDaGiai = TrichNguyenVanProps;

export type MucDocNhanh = 'tot' | 'binh' | 'diu';

export type TheDocNhanhItem = {
  ma: string;
  nhan: string;
  giaTri: string;
  hanh?: Hanh;
  muc?: MucDocNhanh;
  chiTiet: string;
  trich?: string | TrichSachDaGiai;
};

export interface DocNhanhProps {
  cau: string;
  the: TheDocNhanhItem[];
  tieuDe?: string;
  tieuDeId?: string;
  luoiCot?: 3 | 4;
  dongPhu?: ReactNode;
  trenCau?: ReactNode;
  giaiTrich?: (ma: string) => TrichSachDaGiai | null;
  hienNhan?: (the: TheDocNhanhItem) => ReactNode;
}

export function DocNhanh({
  cau,
  the,
  tieuDe = 'Đọc nhanh',
  tieuDeId = 'ck-tq-dn-tieu',
  luoiCot = 3,
  dongPhu,
  trenCau,
  giaiTrich,
  hienNhan,
}: DocNhanhProps) {
  const luoiCls =
    luoiCot === 4 ? 'ck-tq-dn-luoi ck-tq-dn-luoi-4' : 'ck-tq-dn-luoi';

  return (
    <section className="ck-tq-dn" aria-labelledby={tieuDeId}>
      <div className="ck-tq-dn-dau">
        <h2 id={tieuDeId} className="ck-tq-dn-tieu">
          {tieuDe}
        </h2>
        {dongPhu ? <div className="ck-tq-dn-phu">{dongPhu}</div> : null}
      </div>

      {trenCau}

      <p className="ck-tq-dn-cau">{cau}</p>

      <div className={luoiCls}>
        {the.map((muc) => {
          const slug = muc.hanh ? HANH_SLUG[muc.hanh] : undefined;
          const nenCls = slug
            ? `ck-tq-nen-${slug}`
            : muc.muc
              ? `ck-tq-muc-${muc.muc}`
              : '';
          const chuCls = slug
            ? `ck-tq-hanh-${slug}`
            : muc.muc
              ? `ck-tq-chu-${muc.muc}`
              : '';
          const theCls = nenCls ? `ck-tq-dn-the ${nenCls}` : 'ck-tq-dn-the';
          const giaCls = [
            'ck-tq-dn-gia',
            chuCls,
            muc.giaTri.length > 16 ? 'ck-tq-dn-gia-dai' : '',
          ]
            .filter(Boolean)
            .join(' ');

          const sachGhi =
            typeof muc.trich === 'string'
              ? giaiTrich?.(muc.trich) ?? null
              : muc.trich ?? null;

          return (
            <article key={muc.ma} className={theCls}>
              <div className="ck-tq-dn-nhan">
                {hienNhan ? hienNhan(muc) : muc.nhan}
              </div>
              <strong className={giaCls}>{muc.giaTri}</strong>
              <p className="ck-tq-dn-chi-tiet">{muc.chiTiet}</p>
              {sachGhi ? (
                <details className="ck-tq-sach">
                  <summary className="ck-tq-sach-nut">Sách ghi</summary>
                  <TrichNguyenVan {...sachGhi} />
                </details>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

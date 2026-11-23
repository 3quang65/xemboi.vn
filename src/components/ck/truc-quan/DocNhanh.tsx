import type { ReactNode } from 'react';
import type { Hanh } from '@/lib/trang/can-chi';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  TrichNguyenVan,
  type NguonSachItem,
  type TrichNguyenVanItem,
} from './TrichNguyenVan';
import './truc-quan.css';

export type TrichSachDaGiai = {
  trich: TrichNguyenVanItem;
  nguon: NguonSachItem;
};

export type TheDocNhanhItem = {
  ma: string;
  nhan: string;
  giaTri: string;
  hanh?: Hanh;
  chiTiet: string;
  trich?: string | TrichSachDaGiai;
};

export interface DocNhanhProps {
  cau: string;
  the: TheDocNhanhItem[];
  tieuDe?: string;
  dongPhu?: ReactNode;
  trenCau?: ReactNode;
  giaiTrich?: (ma: string) => TrichSachDaGiai | null;
  hienNhan?: (the: TheDocNhanhItem) => ReactNode;
}

export function DocNhanh({
  cau,
  the,
  tieuDe = 'Đọc nhanh',
  dongPhu,
  trenCau,
  giaiTrich,
  hienNhan,
}: DocNhanhProps) {
  return (
    <section className="ck-tq-dn" aria-labelledby="ck-tq-dn-tieu">
      <div className="ck-tq-dn-dau">
        <h2 id="ck-tq-dn-tieu" className="ck-tq-dn-tieu">
          {tieuDe}
        </h2>
        {dongPhu ? <div className="ck-tq-dn-phu">{dongPhu}</div> : null}
      </div>

      {trenCau}

      <p className="ck-tq-dn-cau">{cau}</p>

      <div className="ck-tq-dn-luoi">
        {the.map((muc) => {
          const slug = muc.hanh ? HANH_SLUG[muc.hanh] : undefined;
          const theCls = slug
            ? `ck-tq-dn-the ck-tq-nen-${slug}`
            : 'ck-tq-dn-the';
          const giaCls = [
            'ck-tq-dn-gia',
            slug ? `ck-tq-hanh-${slug}` : '',
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
                  <TrichNguyenVan trich={sachGhi.trich} nguon={sachGhi.nguon} />
                </details>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

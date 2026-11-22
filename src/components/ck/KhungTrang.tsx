import React from 'react';
import { breadcrumb } from '@/lib/trang/dieu-huong';
import Breadcrumb from './Breadcrumb';

export interface KhungTrangProps {
  tieuDe: string;
  phu?: string | null;
  duongDan: string;
  tenCuoi?: string;
  toi?: boolean;
  rong?: boolean;
  children: React.ReactNode;
}

export default function KhungTrang({
  tieuDe,
  phu,
  duongDan,
  tenCuoi,
  toi = false,
  rong = false,
  children,
}: KhungTrangProps) {
  const dsBreadcrumb = breadcrumb(duongDan, tenCuoi);

  return (
    <>
      <section className={`ck-dau-con${toi ? ' ck-toi' : ''}`}>
        <div className={rong ? 'ck-w-rong' : 'ck-w'}>
          <Breadcrumb danhSach={dsBreadcrumb} toi={toi} />
          <h1>{tieuDe}</h1>
          {phu ? <p className="ck-dau-con-phu">{phu}</p> : null}
        </div>
      </section>

      <div className="ck-noi-dung">
        <div className={rong ? 'ck-w-rong' : 'ck-w'}>{children}</div>
      </div>
    </>
  );
}

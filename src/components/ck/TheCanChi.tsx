import React from 'react';
import Link from 'next/link';
import type { Hanh } from '@/lib/trang/can-chi';
import {
  HANH_CLASS,
  MAU_SAC_HEX,
  chuoiNguonNapAm,
  duongDanHanh,
} from './canChiHelpers';

export function HuyHieuHanh({
  hanh,
  lienKet = false,
}: {
  hanh: Hanh;
  lienKet?: boolean;
}) {
  const cls = `ck-huy-hieu ${HANH_CLASS[hanh]}`;
  if (lienKet) {
    return (
      <Link href={duongDanHanh(hanh)} className={`${cls} ck-huy-hieu-link`}>
        {hanh}
      </Link>
    );
  }
  return <span className={cls}>{hanh}</span>;
}

export function NguonNapAm() {
  return <p className="ck-nguon-nho">Bảng nạp âm theo: {chuoiNguonNapAm()}</p>;
}

export function DanhSachMau({ mau }: { mau: string[] }) {
  return (
    <ul className="ck-mau-ds">
      {mau.map((ten) => (
        <li key={ten} className="ck-mau-chip">
          <i
            className="ck-mau-cham"
            style={{ backgroundColor: MAU_SAC_HEX[ten] ?? '#D9C9A6' }}
            aria-hidden="true"
          />
          <span>{ten}</span>
        </li>
      ))}
    </ul>
  );
}

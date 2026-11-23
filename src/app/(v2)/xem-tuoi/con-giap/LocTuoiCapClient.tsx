'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NhomQuanHe } from '@/lib/trang/bat-tu-truc-quan';
import type { Hanh } from '@/lib/trang/can-chi';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';

export type CapCardItem = {
  slug: string;
  duongDan: string;
  chiKhac: string;
  tenConKhac: string;
  hanhKhac: Hanh;
  nhomChinh: NhomQuanHe | 'khong';
  nhanNhom: string[];
  tomTat: string;
};

export type NhomTuoiLoc = {
  thuTu: number;
  chi: string;
  tenCon: string;
  slug: string;
  hanhChi: Hanh;
  cap: CapCardItem[];
};

const KY_HIEU_NHOM: Record<CapCardItem['nhomChinh'], string> = {
  hop: '●',
  'chua-thanh': '·',
  xung: '⇄',
  hinh: '△',
  hai: '◇',
  khong: '–',
};

export function LocTuoiCapClient({ ds }: { ds: NhomTuoiLoc[] }) {
  const [chiChon, setChiChon] = useState<string | null>(null);
  const dsHien = chiChon ? ds.filter((n) => n.chi === chiChon) : ds;

  return (
    <div className="ck-xt-loc-boc">
      <div className="ck-xt-loc-dau">
        <p className="ck-xt-loc-goi-y">
          Tuổi của bạn (chọn 1 tuổi để lọc nhanh 11 cặp):
        </p>
        {chiChon ? (
          <button
            type="button"
            className="ck-xt-loc-reset"
            onClick={() => setChiChon(null)}
          >
            Xem cả 12 tuổi
          </button>
        ) : null}
      </div>

      <div className="ck-xt-loc-nut-ds" role="group" aria-label="Chọn tuổi của bạn">
        {ds.map((nhom) => {
          const dangChon = chiChon === nhom.chi;
          return (
            <button
              key={nhom.chi}
              type="button"
              aria-pressed={dangChon}
              className={`ck-xt-loc-nut${dangChon ? ' ck-xt-loc-nut-chon' : ''}`}
              onClick={() => setChiChon(dangChon ? null : nhom.chi)}
            >
              <strong>{nhom.chi}</strong>
              <span>{nhom.tenCon}</span>
            </button>
          );
        })}
      </div>

      <div className="ck-xt-loc-nhom-ds">
        {dsHien.map((nhom, idx) => (
          <details
            key={nhom.chi}
            className="ck-xt-loc-nhom"
            open={chiChon === nhom.chi || (!chiChon && idx === 0)}
          >
            <summary className="ck-xt-loc-summary">
              <span>
                Tuổi <strong>{nhom.chi}</strong> ({nhom.tenCon}) · 11 cặp khác chi
              </span>
              <span className="ck-xt-loc-summary-phu">Xem 11 cặp</span>
            </summary>

            <ul className="ck-xt-loc-the-ds">
              {nhom.cap.map((c) => {
                const hanhSlug = HANH_SLUG[c.hanhKhac];
                return (
                  <li key={c.slug}>
                    <Link
                      href={c.duongDan}
                      className={`ck-xt-loc-the ck-xt-mt-nen-${c.nhomChinh}`}
                      data-nhom={c.nhomChinh}
                    >
                      <div className="ck-xt-loc-the-dau">
                        <strong className="ck-xt-loc-the-ten">
                          {nhom.chi} + {c.chiKhac}{' '}
                          <span className="ck-xt-loc-the-con">({c.tenConKhac})</span>
                        </strong>
                        <span className={`ck-xt-loc-the-hanh ck-tq-hanh-${hanhSlug}`}>
                          {c.hanhKhac}
                        </span>
                      </div>
                      <div className="ck-xt-loc-the-nhom">
                        <span className="ck-xt-loc-the-ky" aria-hidden="true">
                          {KY_HIEU_NHOM[c.nhomChinh]}
                        </span>
                        <span>
                          {c.nhanNhom.length > 0
                            ? c.nhanNhom.join(' · ')
                            : 'Không thuộc nhóm hợp, xung, hình, hại'}
                        </span>
                      </div>
                      <p className="ck-xt-loc-the-cau">{c.tomTat}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}

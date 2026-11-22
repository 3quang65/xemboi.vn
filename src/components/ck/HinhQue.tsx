import React from 'react';
import Link from 'next/link';
import type { Que } from '@/lib/trang/kinh-dich';

export interface HinhQueProps {
  que: Que;
  nhan?: string;
  haoDong?: number[];
  giaTriHao?: number[];
  daDung?: Set<string>;
}

const TEN_HAO_VI = ['Sơ', 'Nhị', 'Tam', 'Tứ', 'Ngũ', 'Thượng'] as const;

export default function HinhQue({
  que,
  nhan,
  haoDong = [],
  giaTriHao,
  daDung,
}: HinhQueProps) {
  const duongDanQue = `/kinh-dich/que/${que.slug}`;
  const coLink = daDung ? daDung.has(duongDanQue) : false;

  // Vẽ từ hào 6 (trên cùng) xuống hào 1 (dưới cùng)
  const cacHao = [5, 4, 3, 2, 1, 0].map((idx) => {
    const viTri = idx + 1;
    const laDuong = que.hao[idx] === 1;
    const dong = haoDong.includes(viTri);
    const giaTri = giaTriHao?.[idx];
    return { viTri, laDuong, dong, giaTri };
  });

  return (
    <article className="ck-que-the" aria-label={`${nhan ? `${nhan}: ` : ''}${que.ten}`}>
      {nhan ? <span className="ck-que-nhan">{nhan}</span> : null}

      <h3 className="ck-que-ten">
        <span className="ck-que-so">#{que.so}</span>{' '}
        {coLink ? <Link href={duongDanQue}>{que.ten}</Link> : <span>{que.ten}</span>}
      </h3>

      <p className="ck-que-quai">
        Thượng: <b>{que.thuong.ten}</b> ({que.thuong.tuong} · {que.thuong.hanh}) · Hạ:{' '}
        <b>{que.ha.ten}</b> ({que.ha.tuong} · {que.ha.hanh})
      </p>

      <div className="ck-que-hinh" role="img" aria-label={`Hình quẻ ${que.ten}, 6 hào từ dưới lên`}>
        {cacHao.map((h) => (
          <div
            key={h.viTri}
            className={`ck-hao-dong-hang${h.dong ? ' ck-hao-dong' : ''}`}
          >
            <span className="ck-hao-vi">
              H{h.viTri} <small>({TEN_HAO_VI[h.viTri - 1]})</small>
            </span>

            <span className={`ck-hao-vach ${h.laDuong ? 'ck-hao-duong' : 'ck-hao-am'}`} aria-hidden="true">
              {h.laDuong ? (
                <i className="ck-vach-lien" />
              ) : (
                <>
                  <i className="ck-vach-dut" />
                  <i className="ck-vach-dut" />
                </>
              )}
            </span>

            <span className="ck-hao-dau">
              {h.dong ? (
                <span className="ck-hao-chu-dong" title="Hào động">
                  {h.laDuong ? '○' : '×'} Động{h.giaTri ? ` (${h.giaTri})` : ''}
                </span>
              ) : h.giaTri ? (
                <span className="ck-hao-tinh">{h.giaTri}</span>
              ) : (
                <span className="ck-hao-tinh">{h.laDuong ? 'Dương' : 'Âm'}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

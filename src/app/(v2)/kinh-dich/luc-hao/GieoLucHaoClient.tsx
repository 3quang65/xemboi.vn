'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface GieoLucHaoClientProps {
  xuMacDinh: string;
  ngayMacDinh: string;
  gioMacDinh: string;
}

export default function GieoLucHaoClient({
  xuMacDinh,
  ngayMacDinh,
  gioMacDinh,
}: GieoLucHaoClientProps) {
  const router = useRouter();
  const [xu, setXu] = useState(xuMacDinh);
  const [ngay, setNgay] = useState(ngayMacDinh);
  const [gio, setGio] = useState(gioMacDinh);

  function gieo3Xu(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const r = new Uint8Array(18);
    window.crypto.getRandomValues(r);
    const ds = Array.from({ length: 6 }, (_, i) =>
      [0, 1, 2].reduce((t, j) => t + ((r[i * 3 + j] & 1) === 1 ? 3 : 2), 0),
    );
    const chuoi = ds.join('');
    setXu(chuoi);
    const p = new URLSearchParams({ xu: chuoi });
    if (ngay) p.set('ngay', ngay);
    if (gio) p.set('gio', gio);
    router.push(`/kinh-dich/luc-hao?${p.toString()}`);
  }

  return (
    <form className="ck-lh-form-khung" action="/kinh-dich/luc-hao" method="get">
      <div className="ck-lh-form-luoi">
        <label className="ck-lh-o" htmlFor="ck-lh-xu">
          <span>6 số gieo xu (6, 7, 8, 9 từ hào 1 dưới lên)</span>
          <input
            id="ck-lh-xu"
            name="xu"
            type="text"
            inputMode="numeric"
            value={xu}
            onChange={(e) => setXu(e.target.value)}
            placeholder="Ví dụ: 789678"
            required
          />
        </label>

        <label className="ck-lh-o" htmlFor="ck-lh-ngay">
          <span>Ngày gieo (1900–2100)</span>
          <input
            id="ck-lh-ngay"
            name="ngay"
            type="date"
            min="1900-01-01"
            max="2100-12-31"
            value={ngay}
            onChange={(e) => setNgay(e.target.value)}
          />
        </label>

        <label className="ck-lh-o" htmlFor="ck-lh-gio">
          <span>Giờ gieo (VN)</span>
          <input
            id="ck-lh-gio"
            name="gio"
            type="time"
            value={gio}
            onChange={(e) => setGio(e.target.value)}
          />
        </label>
      </div>

      <div className="ck-lh-hanh-dong">
        <a
          href={`/kinh-dich/luc-hao?gieo=1`}
          className="ck-nut ck-nut-son ck-lh-nut"
          onClick={gieo3Xu}
        >
          Gieo 3 đồng xu
        </a>
        <button type="submit" className="ck-nut ck-nut-vien ck-lh-nut">
          An quẻ lục hào
        </button>
      </div>

      <p className="ck-lh-form-ghi">
        6: lão âm (động) · 7: thiếu dương · 8: thiếu âm · 9: lão dương (động). Ví dụ: 777777 là Bát thuần Càn; 987678 có hào 1 và hào 4 động.
      </p>
    </form>
  );
}

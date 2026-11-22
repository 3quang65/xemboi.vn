'use client';

import { useEffect, useState } from 'react';

export interface DemNguocTetProps {
  ngayTetIso: string;
  conNgayBanDau: number;
  canChi: string;
  namAm: number;
}

export default function DemNguocTet({
  ngayTetIso,
  conNgayBanDau,
  canChi,
  namAm,
}: DemNguocTetProps) {
  const [conLai, setConLai] = useState<{ ngay: number; gio: number | null }>({
    ngay: conNgayBanDau,
    gio: null,
  });

  useEffect(() => {
    const mucTieu = Date.parse(`${ngayTetIso}T00:00:00+07:00`);
    const capNhat = () => {
      const hieu = mucTieu - Date.now();
      if (hieu <= 0) {
        setConLai({ ngay: 0, gio: 0 });
        return;
      }
      const ngay = Math.floor(hieu / 86_400_000);
      const gio = Math.floor((hieu % 86_400_000) / 3_600_000);
      setConLai({ ngay, gio });
    };

    capNhat();
    const id = window.setInterval(capNhat, 60_000);
    return () => window.clearInterval(id);
  }, [ngayTetIso]);

  const daToiTet = conLai.ngay === 0 && conLai.gio === 0;

  return (
    <div className="ck-dem-nguoc" aria-live="polite">
      {daToiTet ? (
        <p className="ck-dem-chuc">Chúc mừng năm mới {canChi} {namAm}!</p>
      ) : (
        <div className="ck-dem-o-hang">
          <div className="ck-dem-o">
            <b>{conLai.ngay}</b>
            <span>Ngày</span>
          </div>
          <div className="ck-dem-o">
            <b>{conLai.gio === null ? '—' : conLai.gio}</b>
            <span>Giờ</span>
          </div>
        </div>
      )}
      <p className="ck-dem-ghi-chu">Đếm ngược tới 00:00 Mùng 1 Tết theo giờ Việt Nam (UTC+7)</p>
    </div>
  );
}

'use client';

import { useState } from 'react';

export function NutSaoChepLienKetClient() {
  const [thongBao, setThongBao] = useState('');

  const saoChep = async () => {
    const url = window.location.href;
    let ok = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      const o = document.createElement('textarea');
      o.value = url;
      o.setAttribute('readonly', '');
      o.style.position = 'fixed';
      o.style.opacity = '0';
      document.body.appendChild(o);
      o.select();
      try {
        document.execCommand('copy');
      } catch {}
      document.body.removeChild(o);
    }
    setThongBao('Đã sao chép liên kết');
  };

  return (
    <div className="ck-pt-sao-chep-boc">
      <button type="button" className="ck-nut ck-nut-vien ck-pt-sao-chep-nut" onClick={saoChep}>
        Sao chép liên kết
      </button>
      <span className="ck-pt-sao-chep-tb" role="status" aria-live="polite">
        {thongBao}
      </span>
    </div>
  );
}

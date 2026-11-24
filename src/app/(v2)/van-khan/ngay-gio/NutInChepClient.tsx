'use client';

import { useEffect, useState } from 'react';

export function NutInChepClient({ vanBan }: { vanBan: string }) {
  const [daChep, setDaChep] = useState(false);

  useEffect(() => {
    if (!daChep) return;
    const t = window.setTimeout(() => setDaChep(false), 2600);
    return () => window.clearTimeout(t);
  }, [daChep]);

  async function xuLyChep() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(vanBan);
      } else {
        const ta = document.createElement('textarea');
        ta.value = vanBan;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setDaChep(true);
    } catch {
      setDaChep(false);
    }
  }

  return (
    <div className="ck-vk-hanh-dong ck-vk-an-khi-in">
      <button
        type="button"
        className="ck-nut ck-nut-son ck-vk-nut"
        onClick={() => window.print()}
      >
        In
      </button>
      <button
        type="button"
        className="ck-nut ck-nut-vien ck-vk-nut"
        onClick={xuLyChep}
      >
        {daChep ? 'Đã chép' : 'Chép'}
      </button>
      <span className="ck-vk-thong-bao" role="status" aria-live="polite">
        {daChep ? 'Đã chép vào bộ nhớ tạm' : ''}
      </span>
    </div>
  );
}

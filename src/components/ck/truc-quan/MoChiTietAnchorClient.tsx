'use client';

import { useEffect } from 'react';

export function MoChiTietAnchorClient() {
  useEffect(() => {
    const xuLyClick = (e: MouseEvent) => {
      const mucTieu = e.target instanceof Element ? e.target.closest('a[data-mo-details]') : null;
      if (!mucTieu) return;
      const id = mucTieu.getAttribute('data-mo-details');
      if (!id) return;
      const chiTiet = document.getElementById(id);
      if (!(chiTiet instanceof HTMLDetailsElement)) return;
      e.preventDefault();
      chiTiet.open = true;
      const giamChuyenDong = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      chiTiet.scrollIntoView({ behavior: giamChuyenDong ? 'auto' : 'smooth', block: 'nearest' });
    };

    document.addEventListener('click', xuLyClick);
    return () => document.removeEventListener('click', xuLyClick);
  }, []);

  return null;
}

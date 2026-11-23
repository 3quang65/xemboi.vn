'use client';

import { useEffect } from 'react';

export function KhongRoGioClient({
  checkboxId,
  targetIds,
}: {
  checkboxId: string;
  targetIds: string[];
}) {
  useEffect(() => {
    const cb = document.getElementById(checkboxId);
    if (!(cb instanceof HTMLInputElement)) return;

    const dongBo = () => {
      const khoa = cb.checked;
      for (const id of targetIds) {
        const el = document.getElementById(id);
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLButtonElement
        ) {
          el.disabled = khoa;
        }
      }
    };

    dongBo();
    cb.addEventListener('change', dongBo);
    window.addEventListener('pageshow', dongBo);
    return () => {
      cb.removeEventListener('change', dongBo);
      window.removeEventListener('pageshow', dongBo);
    };
  }, [checkboxId, targetIds]);

  return null;
}

'use client';

import React, { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NAM_SINH_DEN, NAM_SINH_TU } from '@/lib/trang/can-chi';

const DS_NAM_SINH = Array.from(
  { length: NAM_SINH_DEN - NAM_SINH_TU + 1 },
  (_, i) => NAM_SINH_TU + i,
);

export interface ChonNamSinhProps {
  namMacDinh?: number;
  nhan?: string;
  chuNut?: string;
}

export default function ChonNamSinh({
  namMacDinh = 1990,
  nhan = 'Bạn sinh năm nào?',
  chuNut = 'Tra mệnh',
}: ChonNamSinhProps) {
  const router = useRouter();
  const selectId = useId();
  const [nam, setNam] = useState<number>(
    namMacDinh >= NAM_SINH_TU && namMacDinh <= NAM_SINH_DEN ? namMacDinh : 1990,
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/sinh-nam/${nam}`);
  };

  return (
    <form className="ck-tra-nam" onSubmit={onSubmit} aria-label="Tra nhanh mệnh theo năm sinh">
      <label htmlFor={selectId} className="ck-tra-nam-nhan">
        {nhan}
      </label>
      <div className="ck-tra-nam-hang">
        <select
          id={selectId}
          value={nam}
          onChange={(e) => setNam(Number(e.target.value))}
          aria-label="Chọn năm sinh từ 1930 đến 2030"
        >
          {DS_NAM_SINH.map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>
        <button type="submit" className="ck-nut ck-nut-son">
          {chuNut}
        </button>
      </div>
    </form>
  );
}

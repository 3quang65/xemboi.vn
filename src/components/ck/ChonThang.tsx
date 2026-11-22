'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NAM_MAX, NAM_MIN, duongDanThang } from './lichHelpers';

export interface ChonThangProps {
  namMacDinh: number;
  thangMacDinh: number;
}

const DS_NAM = Array.from({ length: NAM_MAX - NAM_MIN + 1 }, (_, i) => NAM_MIN + i);
const DS_THANG = Array.from({ length: 12 }, (_, i) => i + 1);

export default function ChonThang({ namMacDinh, thangMacDinh }: ChonThangProps) {
  const router = useRouter();
  const [nam, setNam] = useState<number>(
    namMacDinh >= NAM_MIN && namMacDinh <= NAM_MAX ? namMacDinh : 2026,
  );
  const [thang, setThang] = useState<number>(
    thangMacDinh >= 1 && thangMacDinh <= 12 ? thangMacDinh : 1,
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(duongDanThang(nam, thang));
  };

  return (
    <form className="ck-chon-thang" onSubmit={onSubmit} aria-label="Chọn tháng và năm để xem lịch">
      <label className="ck-chon-thang-o">
        <span>Tháng</span>
        <select
          aria-label="Chọn tháng"
          value={thang}
          onChange={(e) => setThang(Number(e.target.value))}
        >
          {DS_THANG.map((m) => (
            <option key={m} value={m}>
              Tháng {m}
            </option>
          ))}
        </select>
      </label>

      <label className="ck-chon-thang-o">
        <span>Năm</span>
        <select
          aria-label="Chọn năm"
          value={nam}
          onChange={(e) => setNam(Number(e.target.value))}
        >
          {DS_NAM.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="ck-nut ck-nut-son">
        Xem
      </button>
    </form>
  );
}

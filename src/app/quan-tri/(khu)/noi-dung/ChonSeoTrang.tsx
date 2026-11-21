'use client';

import { useMemo, useState } from 'react';

export type MucSeoTrangChon = {
  id: string;
  maTrang: string | null;
  duongDan: string;
  title: string;
  loai: string;
};

export default function ChonSeoTrang({
  dsTrang,
  macDinhId = '',
}: {
  dsTrang: MucSeoTrangChon[];
  macDinhId?: string;
}) {
  const [tuTim, setTuTim] = useState('');
  const [chonId, setChonId] = useState(macDinhId);

  const daLoc = useMemo(() => {
    const q = tuTim.trim().toLowerCase();
    if (!q) return dsTrang;
    return dsTrang.filter(
      (t) =>
        t.id === chonId ||
        (t.maTrang ?? '').toLowerCase().includes(q) ||
        t.duongDan.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q),
    );
  }, [dsTrang, tuTim, chonId]);

  const dangChon = dsTrang.find((t) => t.id === chonId);

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <input
        className="qt-o"
        type="search"
        value={tuTim}
        onChange={(e) => setTuTim(e.target.value)}
        placeholder="Tìm nhanh SeoTrang theo mã trang hoặc đường dẫn…"
      />
      <select
        className="qt-o"
        name="seoTrangId"
        value={chonId}
        onChange={(e) => setChonId(e.target.value)}
      >
        <option value="">-- Không gắn trang SEO --</option>
        {daLoc.map((t) => (
          <option key={t.id} value={t.id}>
            {(t.maTrang ?? '(không mã)')} · {t.duongDan} — {t.title}
          </option>
        ))}
      </select>
      {dangChon && (
        <small style={{ color: 'var(--muted)' }}>
          Đã chọn: <b>{dangChon.maTrang ?? dangChon.duongDan}</b> ({dangChon.loai}) — {dangChon.title}
        </small>
      )}
    </div>
  );
}

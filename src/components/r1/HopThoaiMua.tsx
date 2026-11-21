'use client';

import React, { useEffect, useRef, useState } from 'react';
import { R1_COPY } from '@/lib/r1/copy';
import type { NutGiaR1, UtmParams } from '@/lib/r1/types';
import { HoaVanGoc4 } from './HoaVanE3';

interface HopThoaiMuaProps {
  mo: boolean;
  nutGia: NutGiaR1;
  utm: UtmParams;
  onDong: () => void;
  onGuiThanhCong: () => void;
}

export default function HopThoaiMua({
  mo,
  nutGia,
  utm,
  onDong,
  onGuiThanhCong,
}: HopThoaiMuaProps) {
  const [emailHoacZalo, setEmailHoacZalo] = useState('');
  const [dongY, setDongY] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState('');
  const [thanhCongHanXoa, setThanhCongHanXoa] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!mo) return;
    setLoi('');
    setThanhCongHanXoa(null);
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDong();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', handleKey);
    };
  }, [mo, onDong]);

  if (!mo) return null;

  const tenGoi = nutGia === '149k' ? R1_COPY.gia.nut149 : R1_COPY.gia.nut79;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoi('');
    if (!emailHoacZalo.trim()) {
      setLoi('Vui lòng nhập Email hoặc số Zalo của bạn.');
      return;
    }
    if (!dongY) {
      setLoi('Vui lòng tích ô đồng ý xử lý dữ liệu trước khi gửi.');
      return;
    }

    setDangGui(true);
    try {
      const res = await fetch('/api/r1/lien-he', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailHoacZalo: emailHoacZalo.trim(),
          nutGiaDaBam: nutGia,
          dongY: true,
          utmSource: utm.utmSource,
          utmMedium: utm.utmMedium,
          utmCampaign: utm.utmCampaign,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        loi?: string;
        hanXoa?: string;
      };
      if (!res.ok || !data.ok) {
        setLoi(
          res.status >= 500
            ? 'Chưa lưu được, bạn thử lại sau ít phút'
            : data.loi || 'Chưa lưu được, bạn thử lại sau ít phút',
        );
        return;
      }
      setThanhCongHanXoa(data.hanXoa || '');
      setEmailHoacZalo('');
      setDongY(false);
      onGuiThanhCong();
    } catch {
      setLoi('Chưa lưu được, bạn thử lại sau ít phút');
    } finally {
      setDangGui(false);
    }
  }

  return (
    <div
      className="r1e-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onDong();
      }}
    >
      <div
        className="r1e-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="r1-modal-title"
      >
        <HoaVanGoc4 />
        <div className="r1e-modal-head">
          <div>
            <h2 id="r1-modal-title">{R1_COPY.hopThoaiMua.tieuDe}</h2>
            <div className="r1e-modal-sub">
              Bạn vừa bấm: <strong>{tenGoi}</strong>
            </div>
          </div>
          <button
            type="button"
            className="r1e-modal-close"
            onClick={onDong}
            aria-label="Đóng hộp thoại"
          >
            ×
          </button>
        </div>

        <blockquote className="r1e-honest-quote">
          {R1_COPY.hopThoaiMua.doanNguyenVan}
        </blockquote>

        {thanhCongHanXoa !== null ? (
          <div className="r1e-success-box" role="status">
            <p className="r1e-success-title">{R1_COPY.hopThoaiMua.thongBaoThanhCong}</p>
            {thanhCongHanXoa && (
              <p className="r1e-success-meta">
                Hạn lưu tối đa theo cam kết 60 ngày:{' '}
                <strong>{new Date(thanhCongHanXoa).toLocaleDateString('vi-VN')}</strong>.
              </p>
            )}
            <button
              type="button"
              className="r1e-nut r1e-nut-son r1e-nut-lon"
              onClick={onDong}
            >
              Quay lại xem lá số
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {loi && (
              <div className="r1e-alert-error" role="alert">
                {loi}
              </div>
            )}

            <div className="r1e-o-nhap">
              <label htmlFor="r1-lead-contact">{R1_COPY.hopThoaiMua.nhanLienHe}</label>
              <input
                ref={inputRef}
                id="r1-lead-contact"
                type="text"
                value={emailHoacZalo}
                onChange={(e) => setEmailHoacZalo(e.target.value)}
                placeholder={R1_COPY.hopThoaiMua.goiYLienHe}
                autoComplete="email"
                required
              />
            </div>

            <label className="r1e-chua-ro" htmlFor="r1-lead-consent">
              <input
                id="r1-lead-consent"
                type="checkbox"
                checked={dongY}
                onChange={(e) => setDongY(e.target.checked)}
                required
              />
              <span>{R1_COPY.hopThoaiMua.dongYLuuLienHe}</span>
            </label>

            <button
              type="submit"
              className="r1e-nut r1e-nut-son r1e-nut-lon"
              disabled={dangGui}
            >
              {dangGui ? R1_COPY.hopThoaiMua.nutDangGui : R1_COPY.hopThoaiMua.nutGui}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

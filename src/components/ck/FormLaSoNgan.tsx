'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import { CANH_GIO_OPTIONS } from './BieuTuongE3';

function laNgayDuongHopLe(ngay: number, thang: number, nam: number): boolean {
  if (!Number.isInteger(nam) || nam < 1900 || nam > 2100) return false;
  if (!Number.isInteger(thang) || thang < 1 || thang > 12) return false;
  if (!Number.isInteger(ngay) || ngay < 1 || ngay > 31) return false;
  const d = new Date(Date.UTC(nam, thang - 1, ngay));
  return d.getUTCFullYear() === nam && d.getUTCMonth() === thang - 1 && d.getUTCDate() === ngay;
}

export default function FormLaSoNgan() {
  const router = useRouter();
  const [gioiTinh, setGioiTinh] = useState<'nam' | 'nu'>('nam');
  const [ngay, setNgay] = useState('15');
  const [thang, setThang] = useState('8');
  const [nam, setNam] = useState('1990');
  const [gio, setGio] = useState('9');
  const [loi, setLoi] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoi('');
    const d = Number(ngay);
    const m = Number(thang);
    const y = Number(nam);
    const g = Number(gio);

    if (!Number.isInteger(y) || y < 1900 || y > 2100) {
      setLoi('Năm sinh cần trong khoảng 1900–2100.');
      return;
    }
    if (!laNgayDuongHopLe(d, m, y)) {
      setLoi('Ngày dương lịch không tồn tại. Vui lòng kiểm tra lại.');
      return;
    }

    const qs = new URLSearchParams({
      ngay: String(d),
      thang: String(m),
      nam: String(y),
      gio: String(g),
      gioiTinh,
    });
    router.push(`/tu-vi/lap-la-so?${qs.toString()}`);
  }

  return (
    <form
      action="/tu-vi/lap-la-so"
      method="get"
      className="ck-to-giay"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="ck-form-ngan-tieu"
    >
      <HoaVanGoc4 />
      <div className="ck-form-tit">
        <HoaVanMay />
        <h2 id="ck-form-ngan-tieu">Lập lá số Tử Vi</h2>
        <HoaVanMay flipped />
      </div>

      {loi && (
        <div className="ck-loi" role="alert">
          {loi}
        </div>
      )}

      <div className="ck-o-nhap">
        <span className="ck-nhan-o" id="ck-ngan-gt">
          Giới tính
        </span>
        <div className="ck-chon" role="radiogroup" aria-labelledby="ck-ngan-gt">
          <label>
            <input
              type="radio"
              name="gioiTinh"
              value="nam"
              checked={gioiTinh === 'nam'}
              onChange={() => setGioiTinh('nam')}
            />
            Nam
          </label>
          <label>
            <input
              type="radio"
              name="gioiTinh"
              value="nu"
              checked={gioiTinh === 'nu'}
              onChange={() => setGioiTinh('nu')}
            />
            Nữ
          </label>
        </div>
      </div>

      <div className="ck-o-nhap ck-hang">
        <label className="ck-o-con" htmlFor="ck-ngan-ngay">
          <span>Ngày dương</span>
          <select id="ck-ngan-ngay" name="ngay" value={ngay} onChange={(e) => setNgay(e.target.value)}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="ck-o-con" htmlFor="ck-ngan-thang">
          <span>Tháng</span>
          <select
            id="ck-ngan-thang"
            name="thang"
            value={thang}
            onChange={(e) => setThang(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="ck-o-con" htmlFor="ck-ngan-nam">
          <span>Năm</span>
          <input
            id="ck-ngan-nam"
            name="nam"
            type="number"
            min={1900}
            max={2100}
            inputMode="numeric"
            value={nam}
            onChange={(e) => setNam(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="ck-o-nhap">
        <label className="ck-o-con" htmlFor="ck-ngan-gio">
          <span>Giờ sinh</span>
          <select id="ck-ngan-gio" name="gio" value={gio} onChange={(e) => setGio(e.target.value)}>
            {CANH_GIO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.nhan}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" className="ck-nut ck-nut-son ck-nut-lon">
        Lập lá số
      </button>

      <p className="ck-ghi-nho">
        Múi giờ Việt Nam (UTC+7). Sinh từ 23:00 tính giờ Tý ngày hôm sau.
      </p>
    </form>
  );
}

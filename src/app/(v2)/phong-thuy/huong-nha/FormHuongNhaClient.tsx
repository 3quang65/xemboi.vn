'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import {
  NAM_PT_DEN,
  NAM_PT_TU,
  NUT_HUONG_NHANH,
} from '../PhongThuyHelpers';

export default function FormHuongNhaClient({
  doBanDau,
  namBanDau,
  gtBanDau,
  loi,
  coLinkDoiNgay,
}: {
  doBanDau: string;
  namBanDau: string;
  gtBanDau: '' | 'nam' | 'nu';
  loi: string | null;
  coLinkDoiNgay: boolean;
}) {
  const [doText, setDoText] = useState(doBanDau);

  return (
    <form className="ck-to-giay" action="/phong-thuy/huong-nha" method="get">
      <HoaVanGoc4 />
      <div className="ck-form-tit">
        <HoaVanMay />
        <h2>Nhập độ la bàn hướng nhà</h2>
        <HoaVanMay flipped />
      </div>

      {loi ? (
        <div className="ck-loi" role="alert">
          {loi}
        </div>
      ) : null}

      <div className="ck-o-nhap">
        <label htmlFor="ck-hn-do">
          Độ la bàn hướng nhà (0–359,9°; 0° là chính Bắc)
        </label>
        <input
          id="ck-hn-do"
          name="do"
          type="text"
          inputMode="decimal"
          value={doText}
          onChange={(e) => setDoText(e.target.value)}
          placeholder="Ví dụ: 180 hoặc 135,5"
          required
        />
      </div>

      <p className="ck-pt-nhanh-nhan">Chọn nhanh 8 chính phương:</p>
      <div className="ck-pt-nut-nhanh-ds">
        {NUT_HUONG_NHANH.map((nut) => {
          const dangChon = doText.trim() === String(nut.do);
          return (
            <button
              key={nut.ten}
              type="button"
              className={`ck-pt-nut-nhanh${dangChon ? ' ck-pt-nut-nhanh-chon' : ''}`}
              onClick={() => setDoText(String(nut.do))}
            >
              {nut.ten} ({nut.do}°)
            </button>
          );
        })}
      </div>

      <div className="ck-pt-form-2cot">
        <label className="ck-o-con" htmlFor="ck-hn-nam">
          <span>Năm sinh âm lịch (tùy chọn, {NAM_PT_TU}–{NAM_PT_DEN})</span>
          <input
            id="ck-hn-nam"
            name="nam"
            type="text"
            inputMode="numeric"
            defaultValue={namBanDau}
            placeholder="Ví dụ: 1990"
          />
        </label>

        <label className="ck-o-con" htmlFor="ck-hn-gt">
          <span>Giới tính (nếu nhập năm sinh)</span>
          <select id="ck-hn-gt" name="gt" defaultValue={gtBanDau}>
            <option value="">— Không xét tuổi —</option>
            <option value="nam">Nam</option>
            <option value="nu">Nữ</option>
          </select>
        </label>
      </div>

      <button type="submit" className="ck-nut ck-nut-son ck-nut-lon ck-pt-nut-chinh">
        Xem sơn, quái hướng và tọa
      </button>

      <p className="ck-ghi-nho ck-pt-ghi-nam">
        Năm tính theo năm âm lịch. Sinh trước Tết thì dùng năm âm lịch trước đó
        {coLinkDoiNgay ? (
          <>
            {' '}
            (<Link href="/lich-am/doi-ngay">đổi ngày dương sang âm →</Link>)
          </>
        ) : null}
        .
      </p>
    </form>
  );
}

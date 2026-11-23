'use client';

import React, { useState } from 'react';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import { theoTen, type KetQuaTen } from '@/lib/trang/than-so-hoc';
import { KetQuaTenHienThi } from './KetQuaTenUi';

export default function TinhTheoTenClient() {
  const [nhap, setNhap] = useState('');
  const [loi, setLoi] = useState<string | null>(null);
  const [ketQua, setKetQua] = useState<{ hoTen: string; duLieu: KetQuaTen } | null>(null);

  const xuLyTinh = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sach = nhap.trim();
    const kq = theoTen(sach);
    if (!kq) {
      setLoi('Vui lòng nhập họ tên có ít nhất một chữ cái (A–Z hoặc tiếng Việt có dấu).');
      setKetQua(null);
      return;
    }
    setLoi(null);
    setKetQua({ hoTen: sach, duLieu: kq });
  };

  return (
    <>
      <div className="ck-tsh-form-khung">
        <form className="ck-to-giay" onSubmit={xuLyTinh} noValidate>
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2>Nhập họ tên đủ dấu</h2>
            <HoaVanMay flipped />
          </div>

          {loi ? (
            <div className="ck-loi" role="alert">
              {loi}
            </div>
          ) : null}

          <div className="ck-o-nhap">
            <label htmlFor="ck-tsh-ten-input">Họ và tên (có dấu hoặc không dấu)</label>
            <input
              id="ck-tsh-ten-input"
              type="text"
              value={nhap}
              onChange={(e) => setNhap(e.target.value)}
              placeholder="Ví dụ: Nguyễn Thị Mỹ Đức"
              autoComplete="off"
            />
          </div>

          <button type="submit" className="ck-nut ck-nut-son ck-nut-lon ck-tsh-nut-chinh">
            Tính
          </button>

          <p className="ck-ghi-nho ck-tsh-ghi-ngay">
            Tên chỉ được tính trên máy bạn, không gửi đi.
          </p>
        </form>
      </div>

      {ketQua ? (
        <section className="ck-td-muc" aria-labelledby="ck-tsh-ten-kq-tieu">
          <h2 id="ck-tsh-ten-kq-tieu" className="ck-td-tieu">
            Kết quả quy đổi cho {ketQua.hoTen}
          </h2>
          <KetQuaTenHienThi ketQua={ketQua.duLieu} hoTenGoc={ketQua.hoTen} />
        </section>
      ) : null}
    </>
  );
}

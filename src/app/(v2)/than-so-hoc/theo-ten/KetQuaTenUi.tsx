import React from 'react';
import Link from 'next/link';
import {
  SO_MASTER,
  duongDanSoChuDao,
  type CachTinh,
  type KetQuaTen,
} from '@/lib/trang/than-so-hoc';
import { dinhDangBuoc, laSoChuDaoHopLe } from '../ThanSoHocHelpers';

function TheChiSoTen({
  nhan,
  moTa,
  chiSo,
}: {
  nhan: string;
  moTa: string;
  chiSo: CachTinh;
}) {
  const coTrang = laSoChuDaoHopLe(chiSo.so);
  return (
    <div className="ck-tsh-chi-so-the">
      <div className="ck-tsh-chi-so-dau">
        <div>
          <h3>{nhan}</h3>
          <p className="ck-tsh-chi-so-phu">{moTa}</p>
        </div>
        {coTrang ? (
          <Link
            href={duongDanSoChuDao(chiSo.so)}
            className="ck-tsh-so-nho-link"
            aria-label={`${nhan}: số ${chiSo.so}`}
          >
            {chiSo.so}
          </Link>
        ) : (
          <span className="ck-tsh-so-nho-link ck-tsh-so-khong-link">{chiSo.so}</span>
        )}
      </div>
      <p className="ck-tsh-phep-cong">{chiSo.phepCong}</p>
      <p className="ck-tsh-buoc-dong">Rút gọn: {dinhDangBuoc(chiSo.buoc, SO_MASTER)}</p>
      {coTrang ? (
        <p className="ck-tsh-chi-so-xem">
          <Link href={duongDanSoChuDao(chiSo.so)}>Xem cách tính số {chiSo.so} →</Link>
        </p>
      ) : null}
    </div>
  );
}

/** Hiển thị từng chữ đã bỏ dấu + 3 chỉ số theo tên (dùng được ở cả client và server). */
export function KetQuaTenHienThi({
  ketQua,
  hoTenGoc,
}: {
  ketQua: KetQuaTen;
  hoTenGoc: string;
}) {
  return (
    <div className="ck-tsh-ten-kq">
      <p className="ck-tsh-ten-tom-tat">
        Chuỗi chữ sau khi bỏ dấu cho <strong>{hoTenGoc}</strong>:{' '}
        <code className="ck-tsh-chuoi-bo-dau">
          {ketQua.chu.map((c) => c.chu).join('')}
        </code>{' '}
        ({ketQua.chu.length} chữ cái)
      </p>

      <div className="ck-tsh-chu-luoi" aria-label="Bảng quy đổi từng chữ cái">
        {ketQua.chu.map((c, idx) => (
          <div
            key={`${c.chu}-${idx}`}
            className={`ck-tsh-chu-o${c.nguyenAm ? ' ck-tsh-chu-nguyen-am' : ''}`}
          >
            <span className="ck-tsh-chu-goc">{c.goc}</span>
            <span className="ck-tsh-chu-bo-dau">{c.chu}</span>
            <strong className="ck-tsh-chu-so">{c.so}</strong>
            <span className="ck-tsh-chu-loai">{c.nguyenAm ? 'nguyên âm' : 'phụ âm'}</span>
          </div>
        ))}
      </div>

      <div className="ck-tsh-ba-chi-so">
        <TheChiSoTen nhan="Chỉ số tên" moTa="Cộng mọi chữ cái" chiSo={ketQua.ten} />
        <TheChiSoTen nhan="Linh hồn" moTa="Cộng các nguyên âm" chiSo={ketQua.linhHon} />
        <TheChiSoTen nhan="Nhân cách" moTa="Cộng các phụ âm" chiSo={ketQua.nhanCach} />
      </div>
    </div>
  );
}

'use client';

import React, { useId, useState } from 'react';
import Link from 'next/link';
import type { Hanh, MauHopMenh, QuanHeHanh } from '@/lib/trang/can-chi';
import { HANH_CLASS, MAU_SAC_HEX } from './canChiHelpers';

export interface MucNamMau {
  nam: number;
  canChi: string;
  napAm: string;
  hanh: Hanh;
}

export interface DongBangMau {
  hanh: Hanh;
  slug: string;
  quanHe: QuanHeHanh;
  mau: MauHopMenh;
}

export interface MauHopMenhClientProps {
  danhSachNam: MucNamMau[];
  bangMau: DongBangMau[];
}

function NhanMauNho({ mau }: { mau: string[] }) {
  return (
    <ul className="ck-mau-ds">
      {mau.map((ten) => (
        <li key={ten} className="ck-mau-chip">
          <i
            className="ck-mau-cham"
            style={{ backgroundColor: MAU_SAC_HEX[ten] ?? '#D9C9A6' }}
            aria-hidden="true"
          />
          <span>{ten}</span>
        </li>
      ))}
    </ul>
  );
}

export default function MauHopMenhClient({
  danhSachNam,
  bangMau,
}: MauHopMenhClientProps) {
  const selectId = useId();
  const [namChon, setNamChon] = useState<number>(1990);
  const [daTra, setDaTra] = useState<number | null>(null);

  const mucHienTai =
    daTra !== null ? danhSachNam.find((m) => m.nam === daTra) ?? null : null;

  const timVaCuon = (namMoi: number) => {
    setDaTra(namMoi);
    const muc = danhSachNam.find((m) => m.nam === namMoi);
    const dong = muc ? bangMau.find((b) => b.hanh === muc.hanh) : null;
    if (dong && typeof document !== 'undefined') {
      const el = document.getElementById(`hanh-${dong.slug}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    timVaCuon(namChon);
  };

  return (
    <>
      <section className="ck-td-muc" aria-label="Tra màu hợp mệnh theo năm sinh">
        <form className="ck-tra-nam" onSubmit={onSubmit}>
          <label htmlFor={selectId} className="ck-tra-nam-nhan">
            Chọn năm sinh để đối chiếu hành
          </label>
          <div className="ck-tra-nam-hang">
            <select
              id={selectId}
              value={namChon}
              onChange={(e) => setNamChon(Number(e.target.value))}
              aria-label="Năm sinh từ 1930 đến 2030"
            >
              {danhSachNam.map((m) => (
                <option key={m.nam} value={m.nam}>
                  {m.nam} — {m.canChi} ({m.hanh})
                </option>
              ))}
            </select>
            <button type="submit" className="ck-nut ck-nut-son">
              Đối chiếu màu
            </button>
          </div>
        </form>

        {mucHienTai ? (
          <div className="ck-ket-qua-mau" aria-live="polite">
            <div>
              <strong>Sinh năm {mucHienTai.nam}</strong> — tuổi{' '}
              <b>{mucHienTai.canChi}</b>, mệnh <b>{mucHienTai.napAm}</b> (hành{' '}
              <span className={`ck-huy-hieu ${HANH_CLASS[mucHienTai.hanh]}`}>
                {mucHienTai.hanh}
              </span>
              ).
            </div>
            <Link href={`/sinh-nam/${mucHienTai.nam}`} className="ck-nut ck-nut-vien">
              Xem chi tiết năm {mucHienTai.nam} →
            </Link>
          </div>
        ) : null}
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-bang-mau-5-hanh">
        <h2 id="ck-bang-mau-5-hanh" className="ck-td-tieu">
          Bảng màu theo 5 hành ngũ hành
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang ck-bang-the">
            <thead>
              <tr>
                <th>Mệnh</th>
                <th>Màu bản mệnh</th>
                <th>Màu tương sinh</th>
                <th>Màu nên tránh</th>
              </tr>
            </thead>
            <tbody>
              {bangMau.map((dong) => {
                const laDongChon = mucHienTai?.hanh === dong.hanh;
                return (
                  <tr
                    key={dong.slug}
                    id={`hanh-${dong.slug}`}
                    className={laDongChon ? 'ck-hang-chon' : undefined}
                  >
                    <td data-nhan="Mệnh">
                      <div>
                        <Link
                          href={`/ngu-hanh/${dong.slug}`}
                          className={`ck-huy-hieu ck-huy-hieu-link ${HANH_CLASS[dong.hanh]}`}
                        >
                          {dong.hanh}
                        </Link>
                        <small className="ck-mau-ghi-chu">
                          {dong.quanHe.duocSinhBoi} sinh · {dong.quanHe.biKhacBoi} khắc
                        </small>
                      </div>
                    </td>
                    <td data-nhan="Bản mệnh">
                      <NhanMauNho mau={dong.mau.banMenh} />
                    </td>
                    <td data-nhan="Tương sinh">
                      <NhanMauNho mau={dong.mau.tuongSinh} />
                    </td>
                    <td data-nhan="Nên tránh">
                      <NhanMauNho mau={dong.mau.nenTranh} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

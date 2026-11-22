'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ThuatNguHienThi } from '@/lib/trang/nen';

type NhomThuatNgu = { mang: string; ten: string; muc: ThuatNguHienThi[] };

function boDau(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export default function TuDienThuatNguClient({ nhom }: { nhom: NhomThuatNgu[] }) {
  const [tuKhoa, setTuKhoa] = useState<string>('');

  const tongTatCa = useMemo(
    () => nhom.reduce((tong, g) => tong + g.muc.length, 0),
    [nhom],
  );

  const nhomDaLoc = useMemo(() => {
    const qRaw = tuKhoa.trim().toLowerCase();
    const qKhongDau = boDau(tuKhoa.trim());
    if (!qRaw) return nhom;

    return nhom
      .map((g) => ({
        ...g,
        muc: g.muc.filter((t) => {
          const chuoi = [t.hanViet, t.han, ...t.bienThe].join(' ');
          return chuoi.toLowerCase().includes(qRaw) || boDau(chuoi).includes(qKhongDau);
        }),
      }))
      .filter((g) => g.muc.length > 0);
  }, [nhom, tuKhoa]);

  const tongHienTai = useMemo(
    () => nhomDaLoc.reduce((tong, g) => tong + g.muc.length, 0),
    [nhomDaLoc],
  );

  return (
    <div>
      <div className="ck-tdt-khung-loc">
        <div className="ck-tdt-loc-hang">
          <label htmlFor="ck-tdt-loc" className="ck-tdt-loc-nhan">
            Lọc thuật ngữ
          </label>
          <input
            id="ck-tdt-loc"
            type="search"
            className="ck-tdt-loc"
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            placeholder="Nhập tên Hán Việt, chữ Hán hoặc tên gọi khác..."
          />
          <span className="ck-tdt-dem">
            Đang hiện <strong>{tongHienTai}</strong> / {tongTatCa} mục
          </span>
        </div>

        {nhomDaLoc.length > 0 ? (
          <nav className="ck-tdt-muc-luc" aria-label="Mục lục nhóm thuật ngữ">
            {nhomDaLoc.map((g) => (
              <a key={g.mang} href={`#nhom-${g.mang}`}>
                <span>{g.ten}</span>
                <small>({g.muc.length})</small>
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      {nhomDaLoc.length === 0 ? (
        <div className="ck-tdt-rong">Không tìm thấy thuật ngữ phù hợp.</div>
      ) : (
        nhomDaLoc.map((g) => (
          <section
            key={g.mang}
            id={`nhom-${g.mang}`}
            className="ck-tdt-nhom"
            aria-labelledby={`ck-tdt-tieu-${g.mang}`}
          >
            <div className="ck-tdt-nhom-dau">
              <h3 id={`ck-tdt-tieu-${g.mang}`}>{g.ten}</h3>
              <span>{g.muc.length} thuật ngữ</span>
            </div>

            <ul className="ck-tdt-ds">
              {g.muc.map((t, idx) => (
                <li key={`${g.mang}-${t.hanViet}-${idx}`} className="ck-tdt-muc">
                  <div className="ck-tdt-dong-chinh">
                    {t.lienKet ? (
                      <Link href={t.lienKet}>
                        <strong>{t.hanViet}</strong>
                      </Link>
                    ) : (
                      <strong>{t.hanViet}</strong>
                    )}
                    <span className="ck-tdt-han">{t.han}</span>
                  </div>
                  {t.bienThe.length > 0 ? (
                    <span className="ck-tdt-bien-the">còn gọi: {t.bienThe.join(', ')}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

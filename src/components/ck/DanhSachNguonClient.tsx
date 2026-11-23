'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { NguonCongKhai } from '@/lib/trang/nen';

function boDau(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export default function DanhSachNguonClient({
  danhSach,
  mangBanDau,
}: {
  danhSach: NguonCongKhai[];
  mangBanDau?: string;
}) {
  const cacMang = useMemo(() => {
    const dem = new Map<string, number>();
    for (const n of danhSach) {
      for (const m of n.mang) {
        dem.set(m, (dem.get(m) ?? 0) + 1);
      }
    }
    return [...dem.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], 'vi'))
      .map(([ten, soLuong]) => ({ ten, soLuong }));
  }, [danhSach]);

  const mangHopLeBanDau = useMemo(() => {
    if (!mangBanDau) return '';
    const q = boDau(mangBanDau.trim());
    const khop = cacMang.find((m) => boDau(m.ten) === q);
    return khop ? khop.ten : '';
  }, [cacMang, mangBanDau]);

  const [mangChon, setMangChon] = useState<string>(mangHopLeBanDau);
  const [tuKhoa, setTuKhoa] = useState<string>('');

  const danhSachLoc = useMemo(() => {
    const qRaw = tuKhoa.trim().toLowerCase();
    const qKhongDau = boDau(tuKhoa.trim());

    return danhSach.filter((n) => {
      if (mangChon && !n.mang.includes(mangChon)) return false;
      if (!qRaw) return true;
      const chuoi = [n.tenHienThi, n.tenGoc, n.tenHanViet ?? '', n.tacGia ?? ''].join(' ');
      return chuoi.toLowerCase().includes(qRaw) || boDau(chuoi).includes(qKhongDau);
    });
  }, [danhSach, mangChon, tuKhoa]);

  const dangLoc = mangChon !== '' || tuKhoa.trim() !== '';

  return (
    <section className="ck-td-muc" aria-label="Danh sách nguồn tham khảo">
      <div className="ck-ng-bo-loc">
        <div className="ck-ng-tim-khung">
          <label htmlFor="ck-ng-tim" className="ck-ng-tim-nhan">
            Tìm theo tên sách hoặc tác giả
          </label>
          <input
            id="ck-ng-tim"
            type="search"
            className="ck-ng-tim"
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            placeholder="Nhập tên sách hoặc tác giả..."
          />
        </div>

        <p className="ck-ng-mang-tieu">Lọc theo mảng</p>
        <div className="ck-ng-mang-ds" role="group" aria-label="Lọc theo mảng">
          <button
            type="button"
            className={`ck-ng-nut-mang${mangChon === '' ? ' ck-on' : ''}`}
            aria-pressed={mangChon === ''}
            onClick={() => setMangChon('')}
          >
            Tất cả ({danhSach.length})
          </button>
          {cacMang.map((m) => (
            <button
              key={m.ten}
              type="button"
              className={`ck-ng-nut-mang${mangChon === m.ten ? ' ck-on' : ''}`}
              aria-pressed={mangChon === m.ten}
              onClick={() => setMangChon((cu) => (cu === m.ten ? '' : m.ten))}
            >
              {m.ten} ({m.soLuong})
            </button>
          ))}
        </div>
      </div>

      <div className="ck-ng-dem-hang">
        <span>
          Đang hiện <strong>{danhSachLoc.length}</strong> / {danhSach.length} nguồn
          {mangChon ? ` · Mảng: ${mangChon}` : ''}
        </span>
        {dangLoc ? (
          <button
            type="button"
            className="ck-ng-xoa-loc"
            onClick={() => {
              setMangChon('');
              setTuKhoa('');
            }}
          >
            Xem tất cả
          </button>
        ) : null}
      </div>

      {danhSachLoc.length === 0 ? (
        <div className="ck-ng-rong">Không tìm thấy nguồn phù hợp với bộ lọc hiện tại.</div>
      ) : (
        <ul className="ck-ng-ds">
          {danhSachLoc.map((n) => (
            <li key={n.ma} className="ck-ng-muc">
              <Link href={`/nguon/${n.slug}`} className="ck-ng-ten">
                {n.tenHienThi}
              </Link>
              {n.tacGia || n.nienDai ? (
                <p className="ck-ng-meta">
                  {[n.tacGia, n.nienDai].filter(Boolean).join(' · ')}
                </p>
              ) : null}
              <div className="ck-ng-nhan-hang">
                <span className="ck-ng-nhan">{n.tenLoai}</span>
                {n.giayPhep ? <span className="ck-ng-nhan-gp">{n.giayPhep}</span> : null}
                {n.mang.map((m) => (
                  <span key={m} className="ck-ng-nhan-mang">
                    {m}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

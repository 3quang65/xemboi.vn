'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface GieoQueClientProps {
  giaTriBanDau?: number[];
  dangLaMaiHoa?: boolean;
}

function giaTriMacDinh(banDau?: number[]): number[] {
  if (banDau && banDau.length === 6) return banDau;
  return [7, 7, 7, 8, 8, 8];
}

const LUA_CHON_NGUA = [
  { giaTri: 6, nhan: '0 ngửa, 3 sấp — Lão âm (6, động)' },
  { giaTri: 7, nhan: '1 ngửa, 2 sấp — Thiếu dương (7)' },
  { giaTri: 8, nhan: '2 ngửa, 1 sấp — Thiếu âm (8)' },
  { giaTri: 9, nhan: '3 ngửa, 0 sấp — Lão dương (9, động)' },
] as const;

export default function GieoQueClient({
  giaTriBanDau,
  dangLaMaiHoa = false,
}: GieoQueClientProps) {
  const router = useRouter();
  const [haoThuCong, setHaoThuCong] = useState<number[]>(() => giaTriMacDinh(giaTriBanDau));

  function gieoNgauNhien() {
    const r = new Uint8Array(18);
    window.crypto.getRandomValues(r);
    const ds = Array.from({ length: 6 }, (_, i) =>
      [0, 1, 2].reduce((tong, j) => tong + ((r[i * 3 + j] & 1) === 1 ? 3 : 2), 0),
    );
    setHaoThuCong(ds);
    router.push(`/kinh-dich/gieo-que?xu=${ds.join(',')}`);
  }

  function lapTheoNhapTay(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/kinh-dich/gieo-que?xu=${haoThuCong.join(',')}`);
  }

  function lapMaiHoaHienTai() {
    if (dangLaMaiHoa) {
      router.refresh();
      return;
    }
    router.push('/kinh-dich/gieo-que?cach=mai-hoa');
  }

  return (
    <section className="ck-kd-khung-dieu-khien" aria-label="Cách lập quẻ Kinh Dịch">
      <div className="ck-kd-cach-luoi">
        <div className="ck-the-du-lieu ck-kd-hop">
          <h2>1. Gieo 3 đồng xu (6 lần)</h2>
          <p>
            Mỗi lần tung 3 đồng xu, ghi từ hào Sơ (dưới) lên hào Thượng (trên). Ngửa tính 3, sấp
            tính 2; tổng 6 hoặc 9 là hào động.
          </p>
          <div className="ck-kd-hanh-dong">
            <button type="button" className="ck-nut ck-nut-son" onClick={gieoNgauNhien}>
              Gieo
            </button>
          </div>

          <details className="ck-kd-nhap-tay" open={Boolean(giaTriBanDau)}>
            <summary>Tự nhập kết quả 6 lần gieo xu thật</summary>
            <form onSubmit={lapTheoNhapTay} className="ck-kd-nhap-form">
              <div className="ck-kd-nhap-luoi">
                {haoThuCong.map((val, idx) => (
                  <label key={idx} className="ck-o-con">
                    <span>Lần {idx + 1} (Hào {idx + 1})</span>
                    <select
                      value={val}
                      onChange={(e) => {
                        const next = [...haoThuCong];
                        next[idx] = Number(e.target.value);
                        setHaoThuCong(next);
                      }}
                    >
                      {LUA_CHON_NGUA.map((opt) => (
                        <option key={opt.giaTri} value={opt.giaTri}>
                          {opt.nhan}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <button type="submit" className="ck-nut ck-nut-vien">
                Lập quẻ từ kết quả tự gieo
              </button>
            </form>
          </details>
        </div>

        <div className="ck-the-du-lieu ck-kd-hop">
          <h2>2. Lập quẻ Mai Hoa theo giờ hiện tại</h2>
          <p>
            Quy đổi thời điểm hiện tại theo múi giờ Việt Nam (UTC+7) sang chi năm, tháng âm, ngày
            âm và chi giờ (từ 23:00 tính sang ngày âm hôm sau) để lập quẻ và 1 hào động.
          </p>
          <div className="ck-kd-hanh-dong">
            <button type="button" className="ck-nut ck-nut-son" onClick={lapMaiHoaHienTai}>
              {dangLaMaiHoa ? 'Cập nhật giờ hiện tại' : 'Lập quẻ Mai Hoa theo giờ hiện tại'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

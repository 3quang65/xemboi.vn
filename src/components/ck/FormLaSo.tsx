'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import LaSo12Cung from '@/components/r1/LaSo12Cung';
import type { KetQuaLaSo, PhanHoiLaSo } from '@/lib/trang/la-so';
import { CANH_GIO_OPTIONS, gioSangCanhGioValue } from './BieuTuongE3';

export interface FormLaSoProps {
  namXemMacDinh: number;
}

function kiemTraTrenTrinhDuyet(p: {
  lich: 'duong' | 'am';
  ngay: number;
  thang: number;
  nam: number;
  gio: number;
  phutStr: string;
  gioiTinh: 'nam' | 'nu';
  namXem: number;
}): string | null {
  if (p.gioiTinh !== 'nam' && p.gioiTinh !== 'nu') return 'Vui lòng chọn giới tính.';
  if (!Number.isInteger(p.nam) || p.nam < 1900 || p.nam > 2100) {
    return 'Năm sinh cần trong khoảng 1900–2100.';
  }
  if (!Number.isInteger(p.thang) || p.thang < 1 || p.thang > 12) {
    return 'Tháng sinh không hợp lệ.';
  }
  if (!Number.isInteger(p.ngay) || p.ngay < 1 || p.ngay > (p.lich === 'am' ? 30 : 31)) {
    return p.lich === 'am' ? 'Tháng âm lịch chỉ có tối đa 30 ngày.' : 'Ngày sinh không hợp lệ.';
  }
  if (p.lich === 'duong') {
    const d = new Date(Date.UTC(p.nam, p.thang - 1, p.ngay));
    if (d.getUTCFullYear() !== p.nam || d.getUTCMonth() !== p.thang - 1 || d.getUTCDate() !== p.ngay) {
      return 'Ngày dương lịch không tồn tại.';
    }
  }
  if (!Number.isInteger(p.gio) || p.gio < 0 || p.gio > 23) return 'Vui lòng chọn giờ sinh.';
  const phutTrim = p.phutStr.trim();
  if (phutTrim !== '') {
    const phut = Number(phutTrim);
    if (!Number.isInteger(phut) || phut < 0 || phut > 59) {
      return 'Phút sinh cần trong khoảng 0–59.';
    }
  }
  if (!Number.isInteger(p.namXem) || p.namXem < 1900 || p.namXem > 2100) {
    return 'Năm xem cần trong khoảng 1900–2100.';
  }
  return null;
}

export default function FormLaSo({ namXemMacDinh }: FormLaSoProps) {
  const searchParams = useSearchParams();

  const [lich, setLich] = useState<'duong' | 'am'>('duong');
  const [nhuan, setNhuan] = useState(false);
  const [gioiTinh, setGioiTinh] = useState<'nam' | 'nu'>('nam');
  const [ngay, setNgay] = useState('15');
  const [thang, setThang] = useState('8');
  const [nam, setNam] = useState('1990');
  const [gio, setGio] = useState('9');
  const [phut, setPhut] = useState('');
  const [ten, setTen] = useState('');
  const [namXem, setNamXem] = useState(String(namXemMacDinh));

  const [dangTai, setDangTai] = useState(false);
  const [loi, setLoi] = useState('');
  const [ketQua, setKetQua] = useState<KetQuaLaSo | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);
  const ketQuaRef = useRef<HTMLElement | null>(null);
  const dauFormRef = useRef<HTMLInputElement | null>(null);
  const daTuLapKeyRef = useRef<string | null>(null);

  const goiApiLapLaSo = useCallback(
    async (payload: {
      lich: 'duong' | 'am';
      ngay: number;
      thang: number;
      nam: number;
      nhuan: boolean;
      gio: number;
      phutStr: string;
      gioiTinh: 'nam' | 'nu';
      ten: string;
      namXem: number;
    }) => {
      const loiClient = kiemTraTrenTrinhDuyet(payload);
      if (loiClient) {
        setLoi(loiClient);
        return;
      }

      setLoi('');
      setDangTai(true);
      try {
        const body: Record<string, unknown> = {
          lich: payload.lich,
          ngay: payload.ngay,
          thang: payload.thang,
          nam: payload.nam,
          nhuan: payload.lich === 'am' ? payload.nhuan : false,
          gio: payload.gio,
          gioiTinh: payload.gioiTinh,
          namXem: payload.namXem,
        };
        if (payload.phutStr.trim() !== '') body.phut = Number(payload.phutStr.trim());
        if (payload.ten.trim() !== '') body.ten = payload.ten.trim().slice(0, 60);

        const res = await fetch('/api/v2/la-so', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as PhanHoiLaSo;
        if (!res.ok || !data.ok) {
          setLoi(!data.ok && data.loi ? data.loi : 'Không lập được lá số. Vui lòng kiểm tra lại.');
          return;
        }

        setKetQua(data.ketQua);
        setTimeout(() => {
          ketQuaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      } catch {
        setLoi('Không thể kết nối máy chủ để lập lá số. Vui lòng thử lại.');
      } finally {
        setDangTai(false);
      }
    },
    [],
  );

  // Đọc query từ trang chủ (?ngay&thang&nam&gio&gioiTinh) và tự lập đúng 1 lần
  useEffect(() => {
    const qNgay = searchParams.get('ngay');
    const qThang = searchParams.get('thang');
    const qNam = searchParams.get('nam');
    const qGio = searchParams.get('gio');
    const qGt = searchParams.get('gioiTinh');
    if (!qNgay || !qThang || !qNam || !qGio || (qGt !== 'nam' && qGt !== 'nu')) return;

    const queryKey = searchParams.toString();
    if (daTuLapKeyRef.current === queryKey) return;
    daTuLapKeyRef.current = queryKey;

    const qLich = searchParams.get('lich') === 'am' ? 'am' : 'duong';
    const qNhuan = qLich === 'am' && searchParams.get('nhuan') === '1';
    const qPhut = searchParams.get('phut') ?? '';
    const qTen = searchParams.get('ten') ?? '';
    const qNamXemRaw = Number(searchParams.get('namXem'));
    const qNamXem =
      Number.isInteger(qNamXemRaw) && qNamXemRaw >= 1900 && qNamXemRaw <= 2100
        ? qNamXemRaw
        : namXemMacDinh;

    const nNgay = Number(qNgay);
    const nThang = Number(qThang);
    const nNam = Number(qNam);
    const nGio = Number(qGio);

    setLich(qLich);
    setNhuan(qNhuan);
    setGioiTinh(qGt);
    setNgay(String(nNgay));
    setThang(String(nThang));
    setNam(String(nNam));
    setGio(String(gioSangCanhGioValue(nGio)));
    setPhut(qPhut);
    setTen(qTen);
    setNamXem(String(qNamXem));

    void goiApiLapLaSo({
      lich: qLich,
      ngay: nNgay,
      thang: nThang,
      nam: nNam,
      nhuan: qNhuan,
      gio: nGio,
      phutStr: qPhut,
      gioiTinh: qGt,
      ten: qTen,
      namXem: qNamXem,
    });
  }, [goiApiLapLaSo, namXemMacDinh, searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void goiApiLapLaSo({
      lich,
      ngay: Number(ngay),
      thang: Number(thang),
      nam: Number(nam),
      nhuan: lich === 'am' ? nhuan : false,
      gio: Number(gio),
      phutStr: phut,
      gioiTinh,
      ten,
      namXem: Number(namXem),
    });
  }

  function handleLapLaSoKhac() {
    setKetQua(null);
    setLoi('');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => dauFormRef.current?.focus(), 120);
  }

  const dongTomTat = ketQua ? ketQua.tomTat.split('\n').filter(Boolean) : [];

  return (
    <>
      <div className="ck-form-khung">
        <form
          ref={formRef}
          className="ck-to-giay"
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby="ck-form-ls-tieu"
        >
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2 id="ck-form-ls-tieu">Thông tin lập lá số</h2>
            <HoaVanMay flipped />
          </div>

          {loi && (
            <div className="ck-loi" role="alert">
              {loi}
            </div>
          )}

          <div className="ck-o-nhap ck-hang-2cot">
            <div>
              <span className="ck-nhan-o" id="ck-ls-lich">
                Loại lịch
              </span>
              <div className="ck-chon" role="radiogroup" aria-labelledby="ck-ls-lich">
                <label>
                  <input
                    ref={dauFormRef}
                    type="radio"
                    name="lich"
                    value="duong"
                    checked={lich === 'duong'}
                    onChange={() => {
                      setLich('duong');
                      setNhuan(false);
                    }}
                  />
                  Dương lịch
                </label>
                <label>
                  <input
                    type="radio"
                    name="lich"
                    value="am"
                    checked={lich === 'am'}
                    onChange={() => setLich('am')}
                  />
                  Âm lịch
                </label>
              </div>
            </div>

            <div>
              <span className="ck-nhan-o" id="ck-ls-gt">
                Giới tính
              </span>
              <div className="ck-chon" role="radiogroup" aria-labelledby="ck-ls-gt">
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
          </div>

          {lich === 'am' && (
            <label className="ck-tick" htmlFor="ck-ls-nhuan">
              <input
                id="ck-ls-nhuan"
                type="checkbox"
                checked={nhuan}
                onChange={(e) => setNhuan(e.target.checked)}
              />
              <span>Tháng nhuận</span>
            </label>
          )}

          <div className="ck-o-nhap ck-hang">
            <label className="ck-o-con" htmlFor="ck-ls-ngay">
              <span>Ngày sinh</span>
              <select id="ck-ls-ngay" value={ngay} onChange={(e) => setNgay(e.target.value)}>
                {Array.from({ length: lich === 'am' ? 30 : 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <label className="ck-o-con" htmlFor="ck-ls-thang">
              <span>Tháng</span>
              <select id="ck-ls-thang" value={thang} onChange={(e) => setThang(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label className="ck-o-con" htmlFor="ck-ls-nam">
              <span>Năm</span>
              <input
                id="ck-ls-nam"
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

          <div className="ck-o-nhap ck-hang">
            <label className="ck-o-con" htmlFor="ck-ls-gio">
              <span>Giờ sinh</span>
              <select id="ck-ls-gio" value={gio} onChange={(e) => setGio(e.target.value)}>
                {CANH_GIO_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.nhan}
                  </option>
                ))}
              </select>
            </label>

            <label className="ck-o-con" htmlFor="ck-ls-phut">
              <span>
                Phút <small>(tùy chọn)</small>
              </span>
              <input
                id="ck-ls-phut"
                type="number"
                min={0}
                max={59}
                inputMode="numeric"
                placeholder="0–59"
                value={phut}
                onChange={(e) => setPhut(e.target.value)}
              />
            </label>

            <label className="ck-o-con" htmlFor="ck-ls-namxem">
              <span>Năm xem</span>
              <input
                id="ck-ls-namxem"
                type="number"
                min={1900}
                max={2100}
                inputMode="numeric"
                value={namXem}
                onChange={(e) => setNamXem(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="ck-o-nhap">
            <label htmlFor="ck-ls-ten">
              Tên <small>(tùy chọn)</small>
            </label>
            <input
              id="ck-ls-ten"
              type="text"
              maxLength={60}
              placeholder="Có thể để trống"
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              autoComplete="off"
            />
          </div>

          <button type="submit" className="ck-nut ck-nut-son ck-nut-lon" disabled={dangTai}>
            {dangTai ? 'Đang lập lá số…' : 'Lập lá số'}
          </button>

          <p className="ck-ghi-nho">
            Giờ tính theo múi giờ Việt Nam (UTC+7). Sinh từ 23:00 trở đi tính giờ Tý ngày hôm sau.
          </p>
        </form>
      </div>

      {dangTai && !ketQua && (
        <p className="ck-dang-tai" role="status" aria-live="polite">
          Đang lập lá số…
        </p>
      )}

      {ketQua && (
        <section ref={ketQuaRef} className="ck-ket-qua" aria-labelledby="ck-kq-tieu">
          <div className="ck-ket-qua-dau">
            <h2 id="ck-kq-tieu">
              {ketQua.laSo.ten ? `Lá số Tử Vi · ${ketQua.laSo.ten}` : 'Kết quả lá số Tử Vi'}
            </h2>
            <div className="ck-hanh-dong-in">
              <button
                type="button"
                className="ck-nut ck-nut-vien"
                onClick={() => window.print()}
              >
                In lá số
              </button>
              <button type="button" className="ck-nut" onClick={handleLapLaSoKhac}>
                Lập lá số khác
              </button>
            </div>
          </div>

          {dongTomTat.length > 0 && (
            <div className="ck-tom-tat">
              <ul className="ck-tom-tat-luoi">
                {dongTomTat.slice(0, 5).map((dong, idx) => (
                  <li key={idx}>{dong}</li>
                ))}
              </ul>
              {dongTomTat.length > 5 && (
                <details>
                  <summary>Xem tóm tắt đủ 12 cung (dạng chữ)</summary>
                  <pre>{ketQua.tomTat}</pre>
                </details>
              )}
            </div>
          )}

          {ketQua.moTaQuyUoc.length > 0 && (
            <div className="ck-tom-tat">
              <ul className="ck-tom-tat-luoi">
                {ketQua.moTaQuyUoc.map((dong, idx) => (
                  <li key={idx}>{dong}</li>
                ))}
              </ul>
            </div>
          )}

          <LaSo12Cung
            laSo={ketQua.laSo}
            luuNien2027={ketQua.luuNien}
            moTaQuyUoc={ketQua.moTaQuyUoc}
          />
        </section>
      )}
    </>
  );
}

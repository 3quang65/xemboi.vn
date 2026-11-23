'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import LaSo12Cung from '@/components/r1/LaSo12Cung';
import { DocNhanh } from '@/components/ck/truc-quan/DocNhanh';
import { ThuatNgu } from '@/components/ck/truc-quan/ThuatNgu';
import { slugViet } from '@/lib/trang/can-chi';
import type { KetQuaLaSo, PhanHoiLaSo } from '@/lib/trang/la-so';
import { docNhanhTuVi, tamPhuongTuChinh } from '@/lib/trang/truc-quan-43';
import { CANH_GIO_OPTIONS, gioSangCanhGioValue } from './BieuTuongE3';

export interface FormLaSoProps {
  namXemMacDinh: number;
  tronDoi?: boolean;
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

export default function FormLaSo({ namXemMacDinh, tronDoi = false }: FormLaSoProps) {
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
  const [chiChon, setChiChon] = useState<number | null>(null);

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
        setChiChon(null);
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
    setChiChon(null);
    setLoi('');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => dauFormRef.current?.focus(), 120);
  }

  const dongTomTat = ketQua ? ketQua.tomTat.split('\n').filter(Boolean) : [];
  const cungMenh = ketQua?.laSo.cung.find((c) => c.ten === 'Mệnh') ?? null;

  const danhSach12Cung = useMemo(() => {
    if (!ketQua) return [];
    const menhChi = ketQua.laSo.cung.find((c) => c.ten === 'Mệnh')?.chi ?? 2;
    return Array.from({ length: 12 }, (_, k) => {
      const chi = (menhChi + k) % 12;
      return ketQua.laSo.cung.find((c) => c.chi === chi);
    }).filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [ketQua]);

  const menhChi = cungMenh?.chi ?? 2;
  const chiDangChon = chiChon ?? menhChi;
  const tamPhuongChon = useMemo(() => tamPhuongTuChinh(chiDangChon), [chiDangChon]);
  const docNhanh = useMemo(() => (ketQua ? docNhanhTuVi(ketQua) : null), [ketQua]);
  const bonCungTamPhuong = useMemo(() => {
    if (!ketQua) return [];
    const vaiTro = ['Bản cung', 'Tam hợp', 'Xung chiếu', 'Tam hợp'] as const;
    return tamPhuongChon.tatCa
      .map((chi, idx) => {
        const cung = ketQua.laSo.cung.find((item) => item.chi === chi);
        return cung ? { cung, vaiTro: vaiTro[idx] } : null;
      })
      .filter(
        (x): x is { cung: NonNullable<typeof ketQua>['laSo']['cung'][number]; vaiTro: (typeof vaiTro)[number] } =>
          Boolean(x),
      );
  }, [ketQua, tamPhuongChon]);
  const cungDangChon = bonCungTamPhuong[0]?.cung ?? cungMenh;

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
            <h2 id="ck-form-ls-tieu">
              {tronDoi ? 'Thông tin lập lá số trọn đời' : 'Thông tin lập lá số'}
            </h2>
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
            {dangTai ? 'Đang lập lá số…' : tronDoi ? 'Lập lá số trọn đời' : 'Lập lá số'}
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
              {ketQua.laSo.ten
                ? `${tronDoi ? 'Lá số Tử Vi trọn đời' : 'Lá số Tử Vi'} · ${ketQua.laSo.ten}`
                : tronDoi
                  ? 'Kết quả lá số Tử Vi trọn đời'
                  : 'Kết quả lá số Tử Vi'}
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

          {docNhanh && (
            <div className="ck-tv-dn-boc">
              <DocNhanh
                cau={docNhanh.cau}
                the={docNhanh.the}
                tieuDeId="ck-tv-dn-tieu"
                hienNhan={(muc) => {
                  if (muc.ma === 'tam-phuong') {
                    return (
                      <>
                        <ThuatNgu
                          ten="Tam phương tứ chính"
                          nghia="Gồm bản cung, hai cung tam hợp (cách ±4 chi) và cung xung chiếu (cách 6 chi)."
                          id="ck-tv-tn-tp"
                        />{' '}
                        của Mệnh
                      </>
                    );
                  }
                  if (muc.ma === 'dai-van') {
                    return (
                      <>
                        <ThuatNgu
                          ten="Đại vận"
                          nghia="Mỗi đại vận kéo dài 10 năm tuổi mụ, đi lần lượt qua 12 cung từ cung Mệnh."
                          id="ck-tv-tn-dv"
                        />{' '}
                        đang chạy
                      </>
                    );
                  }
                  return muc.nhan;
                }}
              />
            </div>
          )}

          <LaSo12Cung
            laSo={ketQua.laSo}
            luuNien2027={ketQua.luuNien}
            moTaQuyUoc={ketQua.moTaQuyUoc}
            highlightedChis={tamPhuongChon.tatCa}
          />

          {danhSach12Cung.length > 0 && (
            <section className="ck-tv-tp-muc" aria-labelledby="ck-tv-tp-tieu">
              <div className="ck-tv-tp-dau">
                <h3 id="ck-tv-tp-tieu" className="ck-tv-tp-tieu">
                  Xem tam phương tứ chính từng cung
                </h3>
                <span className="ck-tv-tp-chu-thich">
                  Chọn cung để soi bản cung, hai cung tam hợp và cung xung chiếu trên lá số.
                </span>
              </div>

              <div
                className="ck-tv-tp-chip-ds"
                role="group"
                aria-label="Chọn cung xem tam phương tứ chính"
              >
                {danhSach12Cung.map((c) => {
                  const dangChon = c.chi === chiDangChon;
                  const trongNhom = !dangChon && tamPhuongChon.tatCa.includes(c.chi);
                  const cls = [
                    'ck-tv-tp-chip',
                    dangChon ? 'ck-tv-tp-chip-chon' : '',
                    trongNhom ? 'ck-tv-tp-chip-nhom' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');
                  return (
                    <button
                      key={c.chi}
                      type="button"
                      className={cls}
                      aria-pressed={dangChon}
                      onClick={() => setChiChon(c.chi)}
                    >
                      {c.ten} · {c.tenChi}
                    </button>
                  );
                })}
              </div>

              {cungDangChon && bonCungTamPhuong.length > 0 && (
                <>
                  <p className="ck-tv-tp-dong">
                    Tam phương tứ chính của <strong>{cungDangChon.ten}</strong>:{' '}
                    {bonCungTamPhuong.map(({ cung }) => `${cung.ten} (${cung.tenChi})`).join(', ')}
                  </p>
                  <div className="ck-tv-tp-luoi">
                    {bonCungTamPhuong.map(({ cung, vaiTro }) => (
                      <article
                        key={cung.chi}
                        className={`ck-tv-tp-the${vaiTro === 'Bản cung' ? ' ck-tv-tp-the-ban' : ''}`}
                      >
                        <span className="ck-tv-tp-vai-tro">{vaiTro}</span>
                        <div className="ck-tv-tp-ten">
                          <Link href={`/tu-vi/cung/${slugViet(cung.ten)}`}>{cung.ten}</Link>{' '}
                          <span>
                            ({cung.can} {cung.tenChi})
                          </span>
                        </div>
                        <p className="ck-tv-tp-sao">
                          {cung.chinhTinh.length > 0
                            ? cung.chinhTinh.map((s, idx) => (
                                <React.Fragment key={s.key}>
                                  {idx > 0 ? ', ' : ''}
                                  <Link href={`/tu-vi/sao/${slugViet(s.ten)}`}>{s.ten}</Link>
                                  {s.dacTinhTen ? ` (${s.dacTinhTen})` : ''}
                                </React.Fragment>
                              ))
                            : 'Vô chính diệu'}
                        </p>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {dongTomTat.length > 0 && (
            <div className="ck-tom-tat">
              <ul className="ck-tom-tat-luoi">
                {dongTomTat.slice(0, 5).map((dong, idx) => (
                  <li key={idx}>{dong}</li>
                ))}
                {cungMenh && (
                  <li>
                    Chính tinh{' '}
                    <Link href={`/tu-vi/cung/${slugViet(cungMenh.ten)}`}>cung {cungMenh.ten}</Link>:{' '}
                    {cungMenh.chinhTinh.length > 0
                      ? cungMenh.chinhTinh.map((s, i) => (
                          <React.Fragment key={s.key}>
                            {i > 0 ? ', ' : ''}
                            <Link href={`/tu-vi/sao/${slugViet(s.ten)}`}>{s.ten}</Link>
                            {s.dacTinh ? ` (${s.dacTinh})` : ''}
                            {s.hoa ? ` · ${s.hoa}` : ''}
                          </React.Fragment>
                        ))
                      : 'Vô chính diệu'}
                  </li>
                )}
              </ul>
              {danhSach12Cung.length > 0 && (
                <details>
                  <summary>Xem tóm tắt đủ 12 cung (dạng chữ)</summary>
                  <p className="ck-tom-tat-chu-thich">
                    Ký hiệu đặc tính sao: M = miếu, V = vượng, Đ = đắc địa, B = bình hòa, H = hãm.
                  </p>
                  <ul className="ck-tom-tat-12cung">
                    {danhSach12Cung.map((c) => {
                      const nhanPhu: string[] = [];
                      if (c.laThan) nhanPhu.push('có Thân');
                      if (c.tuan) nhanPhu.push('bị Tuần');
                      if (c.triet) nhanPhu.push('bị Triệt');
                      return (
                        <li key={c.chi}>
                          <Link href={`/tu-vi/cung/${slugViet(c.ten)}`}>
                            <strong>{c.ten}</strong>
                          </Link>{' '}
                          ({c.can} {c.tenChi}
                          {nhanPhu.length ? `, ${nhanPhu.join(', ')}` : ''}, đại vận {c.daiVan},{' '}
                          {c.trangSinh}):{' '}
                          {c.chinhTinh.length > 0 ? (
                            c.chinhTinh.map((s, i) => (
                              <React.Fragment key={s.key}>
                                {i > 0 ? ', ' : ''}
                                <Link href={`/tu-vi/sao/${slugViet(s.ten)}`}>{s.ten}</Link>
                                {s.dacTinh ? ` (${s.dacTinh})` : ''}
                                {s.hoa ? ` · ${s.hoa}` : ''}
                              </React.Fragment>
                            ))
                          ) : (
                            <span>Vô chính diệu</span>
                          )}
                          {' · '}
                          <span>
                            Cát: {c.catTinh.length ? c.catTinh.map((x) => x.ten).join(', ') : 'không'}
                          </span>
                          {' · '}
                          <span>
                            Hung:{' '}
                            {c.hungTinh.length ? c.hungTinh.map((x) => x.ten).join(', ') : 'không'}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
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

          {tronDoi && ketQua.daiVan.length > 0 && (
            <>
              <section className="ck-dv-muc" aria-labelledby="ck-dv-timeline-tieu">
                <h3 id="ck-dv-timeline-tieu" className="ck-dv-tieu">
                  Dòng thời gian 12 đại vận (mỗi đại vận 10 năm)
                </h3>
                <div className="ck-dv-cuon">
                  <ol className="ck-dv-timeline">
                    {ketQua.daiVan.map((dv) => (
                      <li
                        key={dv.tuTuoi}
                        className={`ck-dv-moc${dv.dangChay ? ' ck-dv-dang-chay' : ''}`}
                      >
                        <span className="ck-dv-cham" aria-hidden="true" />
                        <div className="ck-dv-tuoi">
                          <strong>
                            {dv.tuTuoi}–{dv.denTuoi} tuổi
                          </strong>
                          {dv.dangChay ? <em className="ck-dv-nhan">Đang chạy</em> : null}
                        </div>
                        <div className="ck-dv-nam">
                          {dv.tuNam}–{dv.denNam}
                        </div>
                        <div className="ck-dv-cung">
                          <Link href={`/tu-vi/cung/${slugViet(dv.tenCung)}`}>{dv.tenCung}</Link> ·{' '}
                          <span>{dv.canChi}</span>
                        </div>
                        <div className="ck-dv-sao">
                          {dv.chinhTinh.length > 0
                            ? dv.chinhTinh.map((tenSao, i) => (
                                <React.Fragment key={tenSao}>
                                  {i > 0 ? ', ' : ''}
                                  <Link href={`/tu-vi/sao/${slugViet(tenSao)}`}>{tenSao}</Link>
                                </React.Fragment>
                              ))
                            : 'Vô chính diệu'}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              <section className="ck-dv-muc" aria-labelledby="ck-dv-bang-tieu">
                <h3 id="ck-dv-bang-tieu" className="ck-dv-tieu">
                  Bảng 12 đại vận theo tuổi âm và năm dương
                </h3>
                <div className="ck-bang-khung">
                  <table className="ck-bang ck-bang-the ck-dv-bang">
                    <thead>
                      <tr>
                        <th>Tuổi âm</th>
                        <th>Năm dương</th>
                        <th>Cung</th>
                        <th>Can chi</th>
                        <th>Chính tinh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ketQua.daiVan.map((dv) => (
                        <tr
                          key={dv.tuTuoi}
                          className={dv.dangChay ? 'ck-dv-dang-chay' : undefined}
                        >
                          <td data-nhan="Tuổi âm">
                            <div>
                              <strong>
                                {dv.tuTuoi}–{dv.denTuoi}
                              </strong>
                              {dv.dangChay ? (
                                <span className="ck-dv-nhan" style={{ marginLeft: 8 }}>
                                  Đang chạy
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td data-nhan="Năm dương">
                            {dv.tuNam}–{dv.denNam}
                          </td>
                          <td data-nhan="Cung">
                            <Link href={`/tu-vi/cung/${slugViet(dv.tenCung)}`}>
                              <strong>{dv.tenCung}</strong>
                            </Link>
                          </td>
                          <td data-nhan="Can chi">{dv.canChi}</td>
                          <td data-nhan="Chính tinh">
                            <div>
                              {dv.chinhTinh.length > 0
                                ? dv.chinhTinh.map((tenSao, i) => (
                                    <React.Fragment key={tenSao}>
                                      {i > 0 ? ', ' : ''}
                                      <Link href={`/tu-vi/sao/${slugViet(tenSao)}`}>{tenSao}</Link>
                                    </React.Fragment>
                                  ))
                                : 'Vô chính diệu'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </section>
      )}
    </>
  );
}

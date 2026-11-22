'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TEN_CON_GIAP,
  amSangDuong,
  canChiNam,
  canChiNgay,
  canChiThang,
  duongSangAm,
  hanhNapAm,
  napAm,
  soNgayJulius,
  thangNhuan,
} from '@/lib/tuvi-v2/am-lich';
import {
  NAM_MAX,
  NAM_MIN,
  THU_VI,
  duongDanNgay,
  hai,
  ngayDuongHopLe,
  nhanNgayAmChu,
  tenThangAmClient,
  trongPhamViNam,
} from './lichHelpers';

export interface DoiNgayClientProps {
  chieuMacDinh: 'duong' | 'am';
  ngayMacDinh: number;
  thangMacDinh: number;
  namMacDinh: number;
  nhuanMacDinh?: boolean;
}

interface KetQuaDoi {
  duong: { ngay: number; thang: number; nam: number };
  am: { ngay: number; thang: number; nam: number; nhuan: boolean };
  thu: string;
  ccNgay: string;
  ccThang: string;
  ccNam: string;
  conGiap: string;
  napAmNgay: string;
  hanhNgay: string;
}

function tinhKetQua(
  chieu: 'duong' | 'am',
  d: number,
  m: number,
  y: number,
  nhuan: boolean,
): { kq: KetQuaDoi | null; loi: string | null } {
  if (!Number.isInteger(y) || y < NAM_MIN || y > NAM_MAX) {
    return { kq: null, loi: `Vui lòng nhập năm trong khoảng ${NAM_MIN}–${NAM_MAX}.` };
  }
  if (!Number.isInteger(m) || m < 1 || m > 12) {
    return { kq: null, loi: 'Tháng phải nằm trong khoảng từ 1 đến 12.' };
  }

  let dg: { ngay: number; thang: number; nam: number };
  let am: { ngay: number; thang: number; nam: number; nhuan: boolean };

  if (chieu === 'duong') {
    if (!ngayDuongHopLe(d, m, y)) {
      return { kq: null, loi: `Ngày dương lịch ${d}/${m}/${y} không tồn tại.` };
    }
    dg = { ngay: d, thang: m, nam: y };
    am = duongSangAm(d, m, y);
  } else {
    if (!Number.isInteger(d) || d < 1 || d > 30) {
      return { kq: null, loi: 'Ngày âm lịch phải nằm trong khoảng từ 1 đến 30.' };
    }
    const doi = amSangDuong(d, m, y, nhuan);
    if (!doi) {
      const nh = thangNhuan(y);
      if (nhuan) {
        if (nh === 0) {
          return {
            kq: null,
            loi: `Năm âm lịch ${y} (${canChiNam(y).ten}) không có tháng nhuận.`,
          };
        }
        if (nh !== m) {
          return {
            kq: null,
            loi: `Năm âm lịch ${y} (${canChiNam(y).ten}) chỉ nhuận tháng ${nh}, không có tháng ${m} nhuận.`,
          };
        }
        return {
          kq: null,
          loi: `Tháng ${m} nhuận năm ${y} chỉ có 29 ngày, không có ngày ${d}.`,
        };
      }
      return {
        kq: null,
        loi: `${tenThangAmClient(m, false)} năm ${y} (${canChiNam(y).ten}) chỉ có 29 ngày, không có ngày ${d}.`,
      };
    }
    dg = doi;
    am = { ngay: d, thang: m, nam: y, nhuan };
  }

  const jdn = soNgayJulius(dg.ngay, dg.thang, dg.nam);
  const ccN = canChiNgay(jdn);
  const ccT = canChiThang(am.thang, am.nam);
  const ccNamObj = canChiNam(am.nam);
  const nap = napAm(ccN.can, ccN.chi);

  return {
    kq: {
      duong: dg,
      am,
      thu: THU_VI[(jdn + 1) % 7],
      ccNgay: ccN.ten,
      ccThang: ccT.ten,
      ccNam: ccNamObj.ten,
      conGiap: TEN_CON_GIAP[ccNamObj.chi],
      napAmNgay: nap,
      hanhNgay: hanhNapAm(nap),
    },
    loi: null,
  };
}

export default function DoiNgayClient({
  chieuMacDinh,
  ngayMacDinh,
  thangMacDinh,
  namMacDinh,
  nhuanMacDinh = false,
}: DoiNgayClientProps) {
  const khoiTao = tinhKetQua(chieuMacDinh, ngayMacDinh, thangMacDinh, namMacDinh, nhuanMacDinh);
  const [chieu, setChieu] = useState<'duong' | 'am'>(chieuMacDinh);
  const [ngay, setNgay] = useState<string>(String(ngayMacDinh));
  const [thang, setThang] = useState<string>(String(thangMacDinh));
  const [nam, setNam] = useState<string>(String(namMacDinh));
  const [nhuan, setNhuan] = useState<boolean>(nhuanMacDinh);
  const [ketQua, setKetQua] = useState<KetQuaDoi | null>(khoiTao.kq);
  const [loi, setLoi] = useState<string | null>(khoiTao.loi);

  useEffect(() => {
    setChieu(chieuMacDinh);
    setNgay(String(ngayMacDinh));
    setThang(String(thangMacDinh));
    setNam(String(namMacDinh));
    setNhuan(nhuanMacDinh);
    const r = tinhKetQua(chieuMacDinh, ngayMacDinh, thangMacDinh, namMacDinh, nhuanMacDinh);
    setKetQua(r.kq);
    setLoi(r.loi);
  }, [chieuMacDinh, ngayMacDinh, thangMacDinh, namMacDinh, nhuanMacDinh]);

  const namSo = Number(nam);
  const goiYNhuan =
    Number.isInteger(namSo) && namSo >= NAM_MIN && namSo <= NAM_MAX
      ? (() => {
          const nh = thangNhuan(namSo);
          const cc = canChiNam(namSo).ten;
          return nh > 0 ? `Năm ${namSo} (${cc}) nhuận tháng ${nh}.` : `Năm ${namSo} (${cc}) không có tháng nhuận.`;
        })()
      : null;

  const thucHienDoi = (
    c: 'duong' | 'am',
    dStr: string,
    mStr: string,
    yStr: string,
    laNhuan: boolean,
  ) => {
    const d = Number(dStr);
    const m = Number(mStr);
    const y = Number(yStr);
    const r = tinhKetQua(c, d, m, y, laNhuan);
    setKetQua(r.kq);
    setLoi(r.loi);
  };

  const chonTab = (moi: 'duong' | 'am') => {
    setChieu(moi);
    if (moi === 'duong') setNhuan(false);
    thucHienDoi(moi, ngay, thang, nam, moi === 'am' ? nhuan : false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    thucHienDoi(chieu, ngay, thang, nam, nhuan);
  };

  return (
    <div className="ck-doi-khung">
      <div className="ck-tab-ds" role="tablist" aria-label="Chiều chuyển đổi lịch">
        <button
          type="button"
          role="tab"
          aria-selected={chieu === 'duong'}
          className={`ck-tab${chieu === 'duong' ? ' ck-tab-on' : ''}`}
          onClick={() => chonTab('duong')}
        >
          Dương lịch → Âm lịch
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={chieu === 'am'}
          className={`ck-tab${chieu === 'am' ? ' ck-tab-on' : ''}`}
          onClick={() => chonTab('am')}
        >
          Âm lịch → Dương lịch
        </button>
      </div>

      <form className="ck-to-giay ck-doi-form" onSubmit={onSubmit} noValidate>
        <div className="ck-form-tit">
          <h2>{chieu === 'duong' ? 'Nhập ngày dương lịch' : 'Nhập ngày âm lịch'}</h2>
        </div>

        <div className="ck-hang">
          <label className="ck-o-con">
            <span>Ngày</span>
            <input
              type="number"
              min={1}
              max={chieu === 'duong' ? 31 : 30}
              value={ngay}
              onChange={(e) => setNgay(e.target.value)}
              inputMode="numeric"
            />
          </label>
          <label className="ck-o-con">
            <span>Tháng</span>
            <input
              type="number"
              min={1}
              max={12}
              value={thang}
              onChange={(e) => setThang(e.target.value)}
              inputMode="numeric"
            />
          </label>
          <label className="ck-o-con">
            <span>Năm (1900–2100)</span>
            <input
              type="number"
              min={NAM_MIN}
              max={NAM_MAX}
              value={nam}
              onChange={(e) => setNam(e.target.value)}
              inputMode="numeric"
            />
          </label>
        </div>

        {chieu === 'am' && (
          <div className="ck-doi-nhuan">
            <label className="ck-tick">
              <input
                type="checkbox"
                checked={nhuan}
                onChange={(e) => setNhuan(e.target.checked)}
              />
              <span>Tháng nhuận</span>
            </label>
            {goiYNhuan ? <p className="ck-doi-goi-y">{goiYNhuan}</p> : null}
          </div>
        )}

        {loi && (
          <div className="ck-loi" role="alert">
            {loi}
          </div>
        )}

        <button type="submit" className="ck-nut ck-nut-son ck-nut-lon">
          Đổi ngày
        </button>

        <p className="ck-ghi-nho">
          Tính theo thuật toán thiên văn múi giờ Việt Nam (UTC+7), phạm vi 1900–2100.
        </p>
      </form>

      {ketQua && (
        <section className="ck-doi-kq" aria-live="polite" aria-label="Kết quả đổi ngày">
          <div className="ck-doi-cap">
            <div className="ck-doi-cot">
              <small>Dương lịch</small>
              <strong>
                {ketQua.thu}, {hai(ketQua.duong.ngay)}/{hai(ketQua.duong.thang)}/{ketQua.duong.nam}
              </strong>
            </div>
            <div className="ck-doi-mui" aria-hidden="true">
              ⇄
            </div>
            <div className="ck-doi-cot">
              <small>Âm lịch</small>
              <strong>
                {nhanNgayAmChu(ketQua.am.ngay, true)}{' '}
                {tenThangAmClient(ketQua.am.thang, ketQua.am.nhuan)} năm {ketQua.ccNam}
              </strong>
              <span>
                ({ketQua.am.ngay}/{ketQua.am.thang}
                {ketQua.am.nhuan ? ' nhuận' : ''}/{ketQua.am.nam} âm · tuổi {ketQua.conGiap})
              </span>
            </div>
          </div>

          <dl className="ck-lich-thong-tin">
            <div>
              <dt>Can chi ngày</dt>
              <dd>{ketQua.ccNgay}</dd>
            </div>
            <div>
              <dt>Can chi tháng / năm</dt>
              <dd>
                {ketQua.ccThang} · {ketQua.ccNam}
              </dd>
            </div>
            <div>
              <dt>Nạp âm ngày</dt>
              <dd>
                {ketQua.napAmNgay} (hành {ketQua.hanhNgay})
              </dd>
            </div>
          </dl>

          {trongPhamViNam(ketQua.duong.nam) ? (
            <div className="ck-doi-hanh-dong">
              <Link
                href={duongDanNgay(ketQua.duong.nam, ketQua.duong.thang, ketQua.duong.ngay)}
                className="ck-nut ck-nut-son"
              >
                Xem chi tiết ngày
              </Link>
              <Link
                href={`/lich-am/${ketQua.duong.nam}/${hai(ketQua.duong.thang)}`}
                className="ck-nut ck-nut-vien"
              >
                Xem lịch tháng {ketQua.duong.thang}/{ketQua.duong.nam}
              </Link>
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}

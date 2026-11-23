import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { CAN_HAN, CHI_HAN, HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  ChuGiaiHanh,
  DocNhanh,
  ThuatNgu,
  TrichNguyenVan,
  type TheDocNhanhItem,
  type TrichSachDaGiai,
} from '@/components/ck/truc-quan';
import { kiemTraDauVao, lapLaSoBatTu, type LaSoBatTu } from '@/lib/trang/bat-tu';
import {
  GIAI_NGHIA_BAT_TU,
  NGUON_BAT_TU,
  TEN_NHOM_QUAN_HE,
  TRICH_BAT_TU,
  docNhanh,
  giaoVan,
  nghiaThapThan,
  quanHeTru,
  type MaTrichBatTu,
} from '@/lib/trang/bat-tu-truc-quan';
import type { Hanh } from '@/lib/trang/can-chi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { DaiVanCuonClient } from './DaiVanCuonClient';
import {
  ChuGiaiQuanHe,
  KIEU_NET_QUAN_HE,
  MauNetQuanHeSvg,
  SoDoQuanHeSvg,
} from './SoDoQuanHeSvg';

const MAC_DINH_BAT_TU_LS = {
  title: 'Lập lá số bát tự online – tứ trụ theo tiết khí chuẩn',
  h1: 'Lập lá số bát tự online',
};

const THU_TU_HANH: readonly Hanh[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function kiemCoThamSo(sp: Record<string, string | string[] | undefined>): boolean {
  return Object.values(sp).some((v) =>
    Array.isArray(v)
      ? v.some((item) => item.trim() !== '')
      : typeof v === 'string' && v.trim() !== '',
  );
}

function giaiTrichBatTu(ma: string): TrichSachDaGiai | null {
  if (!(ma in TRICH_BAT_TU)) return null;
  const trich = TRICH_BAT_TU[ma as MaTrichBatTu];
  return { trich, nguon: NGUON_BAT_TU[trich.nguon] };
}

function dinhDangPhanTram(n: number): string {
  const pct = (n / 8) * 100;
  return Number.isInteger(pct) ? `${pct}%` : `${String(pct).replace('.', ',')}%`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base, nd] = await Promise.all([
    searchParams,
    metaTrang('/bat-tu/lap-la-so', MAC_DINH_BAT_TU_LS),
    noiDungTheoDuongDan('/bat-tu/lap-la-so'),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/bat-tu/lap-la-so' },
      robots: { index: false, follow: true },
    };
  }
  return nd ? base : { ...base, robots: { index: false, follow: true } };
}

export default async function BatTuLapLaSoPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/bat-tu/lap-la-so', MAC_DINH_BAT_TU_LS),
    searchParams,
  ]);
  const daDung = trangDaDung();
  const namXem = new Date(Date.now() + 7 * 3600000).getUTCFullYear();

  const ngayRaw = layMot(sp.ngay)?.trim();
  const thangRaw = layMot(sp.thang)?.trim();
  const namRaw = layMot(sp.nam)?.trim();
  const gioRaw = layMot(sp.gio)?.trim();
  const phutRaw = layMot(sp.phut)?.trim();
  const gioiTinhRaw = layMot(sp.gioiTinh)?.trim();
  const doi23Raw = layMot(sp.doiNgayLuc23)?.trim();
  const tuFormRaw = layMot(sp.tuForm)?.trim();

  const coThamSo = Boolean(
    ngayRaw || thangRaw || namRaw || gioRaw || phutRaw || gioiTinhRaw || tuFormRaw,
  );

  const doiNgayLuc23 =
    doi23Raw === '0' || doi23Raw === 'false'
      ? false
      : doi23Raw === '1' || doi23Raw === 'true'
        ? true
        : tuFormRaw === '1'
          ? false
          : true;

  const ngayVal = ngayRaw && /^\d+$/.test(ngayRaw) ? Number(ngayRaw) : 1;
  const thangVal = thangRaw && /^\d+$/.test(thangRaw) ? Number(thangRaw) : 1;
  const namVal = namRaw && /^\d+$/.test(namRaw) ? Number(namRaw) : 2000;
  const gioVal = gioRaw && /^\d+$/.test(gioRaw) ? Number(gioRaw) : 12;
  const phutVal =
    phutRaw === undefined || phutRaw === ''
      ? 0
      : /^\d+$/.test(phutRaw)
        ? Number(phutRaw)
        : NaN;
  const gtVal: 'nam' | 'nu' | undefined =
    gioiTinhRaw === 'nu' ? 'nu' : gioiTinhRaw === 'nam' ? 'nam' : undefined;

  let loi: string | null = null;
  let ketQua: LaSoBatTu | null = null;

  if (coThamSo) {
    const loiDauVao = kiemTraDauVao({
      ngay: ngayRaw ? Number(ngayRaw) : NaN,
      thang: thangRaw ? Number(thangRaw) : NaN,
      nam: namRaw ? Number(namRaw) : NaN,
      gio: gioRaw ? Number(gioRaw) : NaN,
      phut: phutVal,
      gioiTinh: gtVal,
    });
    if (loiDauVao) {
      loi = loiDauVao;
    } else {
      ketQua = lapLaSoBatTu({
        ngay: Number(ngayRaw),
        thang: Number(thangRaw),
        nam: Number(namRaw),
        gio: Number(gioRaw),
        phut: phutVal,
        gioiTinh: gtVal!,
        doiNgayLuc23,
        namXem,
      });
    }
  }

  // Thứ tự truyền thống từ trái sang phải: Giờ, Ngày, Tháng, Năm (đọc từ phải sang trái: Năm → Tháng → Ngày → Giờ)
  const bonTru = ketQua
    ? [ketQua.tru[3], ketQua.tru[2], ketQua.tru[1], ketQua.tru[0]]
    : [];
  const quanHe = ketQua ? quanHeTru(ketQua) : [];
  const dn = ketQua ? docNhanh(ketQua, quanHe) : null;
  const gv = ketQua ? giaoVan(ketQua) : null;
  const quanHeCan = quanHe.filter((q) => q.hang === 'can');
  const quanHeChi = quanHe.filter((q) => q.hang === 'chi');
  const coXung = quanHe.some((q) => q.nhom === 'xung');
  const coHinh = quanHe.some((q) => q.nhom === 'hinh');

  const hienNhanDocNhanh = (muc: TheDocNhanhItem) => {
    if (muc.ma === 'nhat-chu') {
      return (
        <>
          <ThuatNgu
            ten="Nhật chủ"
            nghia={GIAI_NGHIA_BAT_TU['Nhật chủ']}
            id="tn-dn-nhat-chu"
          />{' '}
          (can ngày)
        </>
      );
    }
    if (muc.ma === 'thang-sinh') {
      return (
        <>
          Tháng sinh (
          <ThuatNgu
            ten="lệnh tháng"
            nghia={GIAI_NGHIA_BAT_TU['Lệnh tháng']}
            id="tn-dn-lenh-thang"
          />
          )
        </>
      );
    }
    if (muc.ma === 'dai-van') {
      return (
        <>
          <ThuatNgu
            ten="Đại vận"
            nghia={GIAI_NGHIA_BAT_TU['Đại vận']}
            id="tn-dn-dai-van"
          />{' '}
          đang chạy
        </>
      );
    }
    return muc.nhan;
  };

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/bat-tu/lap-la-so" toi>
      <div className="ck-bt-form-khung">
        <form className="ck-to-giay" action="/bat-tu/lap-la-so" method="get">
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2>Thông tin lập lá số Bát tự</h2>
            <HoaVanMay flipped />
          </div>

          {loi ? (
            <div className="ck-loi" role="alert">
              {loi}
            </div>
          ) : null}

          <input type="hidden" name="tuForm" value="1" />

          <div className="ck-o-nhap">
            <span className="ck-nhan-o" id="ck-bt-gt">
              Giới tính
            </span>
            <div className="ck-chon" role="radiogroup" aria-labelledby="ck-bt-gt">
              <label>
                <input
                  type="radio"
                  name="gioiTinh"
                  value="nam"
                  defaultChecked={gtVal !== 'nu'}
                />
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="gioiTinh"
                  value="nu"
                  defaultChecked={gtVal === 'nu'}
                />
                Nữ
              </label>
            </div>
          </div>

          <div className="ck-bt-hang-3">
            <label className="ck-o-con" htmlFor="ck-bt-ngay">
              <span>Ngày dương</span>
              <select
                id="ck-bt-ngay"
                name="ngay"
                defaultValue={String(ngayVal >= 1 && ngayVal <= 31 ? ngayVal : 1)}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <label className="ck-o-con" htmlFor="ck-bt-thang">
              <span>Tháng dương</span>
              <select
                id="ck-bt-thang"
                name="thang"
                defaultValue={String(thangVal >= 1 && thangVal <= 12 ? thangVal : 1)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label className="ck-o-con" htmlFor="ck-bt-nam">
              <span>Năm (1900–2100)</span>
              <input
                id="ck-bt-nam"
                name="nam"
                type="number"
                min={1900}
                max={2100}
                defaultValue={String(namVal >= 1900 && namVal <= 2100 ? namVal : 2000)}
                inputMode="numeric"
                required
              />
            </label>
          </div>

          <div className="ck-bt-hang-2">
            <label className="ck-o-con" htmlFor="ck-bt-gio">
              <span>Giờ (0–23)</span>
              <select
                id="ck-bt-gio"
                name="gio"
                defaultValue={String(gioVal >= 0 && gioVal <= 23 ? gioVal : 12)}
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')} giờ
                  </option>
                ))}
              </select>
            </label>

            <label className="ck-o-con" htmlFor="ck-bt-phut">
              <span>Phút (0–59)</span>
              <input
                id="ck-bt-phut"
                name="phut"
                type="number"
                min={0}
                max={59}
                defaultValue={
                  Number.isInteger(phutVal) && phutVal >= 0 && phutVal <= 59
                    ? String(phutVal)
                    : '0'
                }
                inputMode="numeric"
              />
            </label>
          </div>

          <label className="ck-tick" htmlFor="ck-bt-doi23">
            <input
              id="ck-bt-doi23"
              type="checkbox"
              name="doiNgayLuc23"
              value="1"
              defaultChecked={doiNgayLuc23}
            />
            <span>Sinh 23:00–23:59 tính sang ngày sau</span>
          </label>

          <button type="submit" className="ck-nut ck-nut-son ck-nut-lon">
            Lập lá số Bát tự
          </button>

          <p className="ck-ghi-nho">
            Tính theo múi giờ Việt Nam (UTC+7); trụ năm và trụ tháng xác định theo kinh độ Mặt
            Trời (tiết khí thiên văn).
          </p>
        </form>
      </div>

      {ketQua && dn && gv ? (
        <>
          <DocNhanh
            cau={dn.cau}
            the={dn.the}
            dongPhu={
              <span>
                Sinh {String(ketQua.dauVao.ngay).padStart(2, '0')}/
                {String(ketQua.dauVao.thang).padStart(2, '0')}/{ketQua.dauVao.nam} ·{' '}
                {String(ketQua.dauVao.gio).padStart(2, '0')}:
                {String(ketQua.dauVao.phut).padStart(2, '0')} ·{' '}
                {ketQua.dauVao.gioiTinh === 'nam' ? 'Nam' : 'Nữ'} (dương lịch, giờ Việt Nam
                UTC+7)
              </span>
            }
            trenCau={
              <div
                className="ck-bt-tam-chu"
                aria-label="Tám chữ Bát tự từ Giờ đến Năm (đọc từ phải sang trái)"
              >
                {bonTru.map((tru) => (
                  <div
                    key={`tam-${tru.ten}`}
                    className={
                      tru.ten === 'Ngày'
                        ? 'ck-bt-tam-cap ck-bt-tam-cap-ngay'
                        : 'ck-bt-tam-cap'
                    }
                  >
                    <span className="ck-bt-tam-tru">
                      {tru.ten === 'Ngày' ? 'Ngày · Bạn' : `Trụ ${tru.ten}`}
                    </span>
                    <div className="ck-bt-tam-hai">
                      <span className="ck-bt-tam-chu-don">
                        <b
                          className={`ck-bt-tam-han ck-tq-hanh-${HANH_SLUG[tru.hanhCan]}`}
                          lang="zh-Hant"
                        >
                          {CAN_HAN[tru.can] ?? ''}
                        </b>
                        <span className="ck-bt-tam-viet">{tru.can}</span>
                      </span>
                      <span className="ck-bt-tam-chu-don">
                        <b
                          className={`ck-bt-tam-han ck-tq-hanh-${HANH_SLUG[tru.hanhChi]}`}
                          lang="zh-Hant"
                        >
                          {CHI_HAN[tru.chi] ?? ''}
                        </b>
                        <span className="ck-bt-tam-viet">{tru.chi}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            }
            giaiTrich={giaiTrichBatTu}
            hienNhan={hienNhanDocNhanh}
          />

          <section className="ck-td-muc" aria-labelledby="ck-bt-tu-tru-tieu">
            <h2 id="ck-bt-tu-tru-tieu" className="ck-td-tieu">
              Tứ trụ (Giờ · Ngày · Tháng · Năm)
            </h2>

            <div className="ck-bt-tru-ghi">
              <p className="ck-bt-tru-thu-tu">
                Đọc từ phải sang trái: Năm ← Tháng ← Ngày ← Giờ.
              </p>
              <div className="ck-bt-tru-thuat-ngu" aria-label="Thuật ngữ Tứ trụ">
                <ThuatNgu
                  ten="Nhật chủ"
                  nghia={GIAI_NGHIA_BAT_TU['Nhật chủ']}
                  id="tn-tru-nhat-chu"
                />
                <ThuatNgu
                  ten="Lệnh tháng"
                  nghia={GIAI_NGHIA_BAT_TU['Lệnh tháng']}
                  id="tn-tru-lenh-thang"
                />
                <ThuatNgu
                  ten="Thập thần"
                  nghia={GIAI_NGHIA_BAT_TU['Thập thần']}
                  id="tn-tru-thap-than"
                />
                <ThuatNgu
                  ten="Tàng can"
                  nghia={GIAI_NGHIA_BAT_TU['Tàng can']}
                  id="tn-tru-tang-can"
                />
                <ThuatNgu
                  ten="Nạp âm"
                  nghia={GIAI_NGHIA_BAT_TU['Nạp âm']}
                  id="tn-tru-nap-am"
                />
              </div>
            </div>

            <div className="ck-bt-tu-tru-khung">
              <SoDoQuanHeSvg quanHe={quanHeCan} viTri="tren" />

              <div className="ck-bt-tru-luoi">
                {bonTru.map((tru, colIdx) => {
                  const laNgay = tru.ten === 'Ngày';
                  const theCls = laNgay
                    ? 'ck-bt-tru-the ck-bt-tru-ngay'
                    : `ck-bt-tru-the ck-tq-nen-${HANH_SLUG[tru.hanhChi]}`;

                  return (
                    <article key={tru.ten} className={theCls}>
                      <div className="ck-bt-tru-phan-dau">
                        <header className="ck-bt-tru-dau">
                          <strong className="ck-bt-tru-ten">Trụ {tru.ten}</strong>
                          {laNgay ? (
                            <div className="ck-bt-tru-nhan-nhom">
                              <span className="ck-bt-tru-nhan-nc">Nhật chủ</span>
                              <span className="ck-bt-tru-nhan-ban">Bạn</span>
                            </div>
                          ) : (
                            <span className="ck-bt-tru-nhan-phu">
                              {tru.ten === 'Tháng' ? 'Lệnh tháng' : tru.amDuong}
                            </span>
                          )}
                        </header>

                        {!laNgay ? (
                          <div className="ck-bt-tt-hang">
                            <span className="ck-bt-tt-pill">
                              <ThuatNgu
                                ten={tru.thapThanCan}
                                nghia={nghiaThapThan(tru.thapThanCan)}
                                id={`tn-can-tt-${colIdx}`}
                              />
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <div className="ck-bt-tru-chu-khoi">
                        <strong
                          className={`ck-bt-chu-can-chi ck-tq-hanh-${HANH_SLUG[tru.hanhCan]}`}
                        >
                          {tru.can}
                        </strong>
                        <span className="ck-bt-chu-phu">
                          <span
                            className={`ck-bt-han-nho ck-tq-hanh-${HANH_SLUG[tru.hanhCan]}`}
                            lang="zh-Hant"
                          >
                            {CAN_HAN[tru.can] ?? ''}
                          </span>{' '}
                          · {tru.hanhCan}
                        </span>
                      </div>

                      <div className="ck-bt-tru-chu-khoi">
                        <strong
                          className={`ck-bt-chu-can-chi ck-tq-hanh-${HANH_SLUG[tru.hanhChi]}`}
                        >
                          {tru.chi}
                        </strong>
                        <span className="ck-bt-chu-phu">
                          <span
                            className={`ck-bt-han-nho ck-tq-hanh-${HANH_SLUG[tru.hanhChi]}`}
                            lang="zh-Hant"
                          >
                            {CHI_HAN[tru.chi] ?? ''}
                          </span>{' '}
                          · {tru.hanhChi}
                        </span>
                      </div>

                      <div className="ck-bt-tru-tang">
                        <span className="ck-bt-tru-muc-nhan">Tàng can</span>
                        <ul className="ck-bt-tang-vien-ds">
                          {tru.tangCan.map((tc, tcIdx) => (
                            <li
                              key={`${tru.ten}-${tc.can}`}
                              className={`ck-bt-tang-vien ck-tq-nen-${HANH_SLUG[tc.hanh]}`}
                            >
                              <b className={`ck-tq-hanh-${HANH_SLUG[tc.hanh]}`}>{tc.can}</b>
                              <span className="ck-bt-tang-tt">
                                <ThuatNgu
                                  ten={tc.thapThan}
                                  nghia={nghiaThapThan(tc.thapThan)}
                                  id={`tn-tang-tt-${colIdx}-${tcIdx}`}
                                />
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <footer className="ck-bt-tru-nap-am">
                        <span className="ck-bt-tru-muc-nhan">Nạp âm</span>
                        <span className="ck-bt-nap-am-ten">{tru.napAm}</span>
                      </footer>
                    </article>
                  );
                })}
              </div>

              <SoDoQuanHeSvg quanHe={quanHeChi} viTri="duoi" />

              <div className="ck-bt-chu-giai-khung">
                <ChuGiaiQuanHe />
                <ChuGiaiHanh />
              </div>
            </div>

            <details className="ck-bt-bang-gap">
              <summary className="ck-bt-bang-gap-nut">Xem dạng bảng</summary>
              <div className="ck-bt-bang-khung">
                <table className="ck-bt-bang">
                  <caption>
                    Sắp theo thứ tự truyền thống từ phải sang trái: Năm ← Tháng ← Ngày ← Giờ
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className="ck-bt-nhan-hang">
                        Hạng mục
                      </th>
                      {bonTru.map((tru) => (
                        <th
                          key={tru.ten}
                          scope="col"
                          className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                        >
                          Trụ {tru.ten}
                          <small>{tru.ten === 'Ngày' ? 'Nhật chủ' : tru.amDuong}</small>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row" className="ck-bt-nhan-hang">
                        Thập thần
                      </th>
                      {bonTru.map((tru) => (
                        <td
                          key={`${tru.ten}-tt`}
                          className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                        >
                          <b>{tru.thapThanCan}</b>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <th scope="row" className="ck-bt-nhan-hang">
                        Thiên can
                      </th>
                      {bonTru.map((tru) => (
                        <td
                          key={`${tru.ten}-can`}
                          className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                        >
                          <strong
                            className={`ck-bt-chu-lon ck-bt-chu-${HANH_SLUG[tru.hanhCan]}`}
                          >
                            {tru.can}
                          </strong>
                          <span className="ck-bt-hanh-phu">{tru.hanhCan}</span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <th scope="row" className="ck-bt-nhan-hang">
                        Địa chi
                      </th>
                      {bonTru.map((tru) => (
                        <td
                          key={`${tru.ten}-chi`}
                          className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                        >
                          <strong
                            className={`ck-bt-chu-lon ck-bt-chu-${HANH_SLUG[tru.hanhChi]}`}
                          >
                            {tru.chi}
                          </strong>
                          <span className="ck-bt-hanh-phu">
                            {CHI_HAN[tru.chi] ?? ''} · {tru.hanhChi}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <th scope="row" className="ck-bt-nhan-hang">
                        Tàng can
                      </th>
                      {bonTru.map((tru) => (
                        <td
                          key={`${tru.ten}-tang`}
                          className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                        >
                          <ul className="ck-bt-tang-ds">
                            {tru.tangCan.map((tc) => (
                              <li key={`${tru.ten}-${tc.can}`}>
                                <b className={`ck-bt-chu-${HANH_SLUG[tc.hanh]}`}>{tc.can}</b>
                                <span>({tc.thapThan})</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <th scope="row" className="ck-bt-nhan-hang">
                        Nạp âm
                      </th>
                      {bonTru.map((tru) => (
                        <td
                          key={`${tru.ten}-na`}
                          className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                        >
                          {tru.napAm}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-bt-quan-he-tieu">
            <h2 id="ck-bt-quan-he-tieu" className="ck-td-tieu">
              Quan hệ giữa các trụ
            </h2>

            {quanHe.length > 0 ? (
              <ul className="ck-bt-qh-ds">
                {quanHe.map((q, idx) => {
                  const cfg = KIEU_NET_QUAN_HE[q.nhom];
                  const nghiaQH =
                    GIAI_NGHIA_BAT_TU[q.ten] ??
                    (q.loai === 'thieu-tam-hop' ? GIAI_NGHIA_BAT_TU['Tam hợp'] : undefined);

                  return (
                    <li
                      key={`${q.loai}-${q.tru.join('')}-${idx}`}
                      className="ck-bt-qh-muc"
                    >
                      <div className="ck-bt-qh-dau">
                        <span
                          className="ck-bt-qh-nhom-huy"
                          style={{
                            color: cfg.mauChu,
                            background: cfg.mauNen,
                            borderColor: cfg.color,
                            borderStyle: cfg.kieuVien,
                          }}
                        >
                          <MauNetQuanHeSvg nhom={q.nhom} width={22} />
                          <span>{TEN_NHOM_QUAN_HE[q.nhom]}</span>
                        </span>
                        <span className="ck-bt-qh-ten">
                          {nghiaQH ? (
                            <ThuatNgu ten={q.ten} nghia={nghiaQH} id={`tn-qh-${idx}`} />
                          ) : (
                            q.ten
                          )}
                        </span>
                      </div>

                      <p className="ck-bt-qh-mota">{q.moTa}</p>

                      {q.trich.length > 0 ? (
                        <details className="ck-tq-sach">
                          <summary className="ck-tq-sach-nut">Sách ghi</summary>
                          <div className="ck-bt-qh-trich-ds">
                            {q.trich.map((ma) => {
                              const tr = TRICH_BAT_TU[ma];
                              return (
                                <TrichNguyenVan
                                  key={ma}
                                  trich={tr}
                                  nguon={NGUON_BAT_TU[tr.nguon]}
                                />
                              );
                            })}
                          </div>
                        </details>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="ck-bt-qh-trong">
                {dn.the.find((t) => t.ma === 'quan-he')?.chiTiet ??
                  'Bốn trụ không có cặp hợp, xung, hình, hại nào theo các bảng đang dùng.'}
              </p>
            )}

            {coXung || coHinh ? (
              <div className="ck-bt-qh-luu-y">
                <p className="ck-bt-qh-luu-y-tieu">
                  Sách ghi về xung, hình (không vội luận là dữ):
                </p>
                {coXung ? (
                  <TrichNguyenVan
                    trich={TRICH_BAT_TU.xungKhongVoiDoan}
                    nguon={NGUON_BAT_TU[TRICH_BAT_TU.xungKhongVoiDoan.nguon]}
                  />
                ) : null}
                {coHinh ? (
                  <TrichNguyenVan
                    trich={TRICH_BAT_TU.hinhKhongVoiDoan}
                    nguon={NGUON_BAT_TU[TRICH_BAT_TU.hinhKhongVoiDoan.nguon]}
                  />
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-bt-ngu-hanh-tieu">
            <h2 id="ck-bt-ngu-hanh-tieu" className="ck-td-tieu">
              Ngũ hành
            </h2>
            <p className="ck-bt-nh-phu">
              Đếm 8 chữ lộ (4 can, 4 chi), chưa tính tàng can.
            </p>

            <div className="ck-bt-nh-khung">
              <div className="ck-bt-nh-luoi">
                {THU_TU_HANH.map((h) => {
                  const soLuong = ketQua.demNguHanh[h] ?? 0;
                  const pct = (soLuong / 8) * 100;
                  const pctChu = dinhDangPhanTram(soLuong);
                  const slug = HANH_SLUG[h];
                  const laNhatChu = h === ketQua.nhatChu.hanh;
                  const laKhuyet = soLuong === 0;

                  return (
                    <div
                      key={h}
                      className={`ck-bt-nh-cot${laKhuyet ? ' ck-bt-nh-khuyet' : ''}`}
                    >
                      <div className="ck-bt-nh-dau">
                        <strong className={`ck-bt-nh-so ck-tq-hanh-${slug}`}>{soLuong}</strong>
                        <span className="ck-bt-nh-pct">{pctChu}</span>
                      </div>

                      <div className="ck-bt-nh-thanh-khung" aria-hidden="true">
                        {laKhuyet ? (
                          <div className="ck-bt-nh-o-khuyet">
                            <span>0, chưa có</span>
                          </div>
                        ) : (
                          <div className={`ck-bt-nh-nen ck-tq-nen-${slug}`}>
                            <div
                              className={`ck-bt-nh-day ck-bt-muc-${slug}`}
                              style={{ '--ck-bt-ty-le': `${pct}%` } as CSSProperties}
                            />
                          </div>
                        )}
                      </div>

                      <div className="ck-bt-nh-chan">
                        <HuyHieuHanh hanh={h} lienKet={daDung.has('/ngu-hanh')} />
                        {laNhatChu ? (
                          <span className="ck-bt-nh-tag ck-bt-nh-tag-nc">Nhật chủ</span>
                        ) : null}
                        {laKhuyet ? (
                          <span className="ck-bt-nh-tag ck-bt-nh-tag-khuyet">Khuyết</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="ck-bt-nh-duoi">
                <ChuGiaiHanh />
              </div>
            </div>
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-bt-dai-van-tieu">
            <h2 id="ck-bt-dai-van-tieu" className="ck-td-tieu">
              <ThuatNgu
                ten="Đại vận"
                nghia={GIAI_NGHIA_BAT_TU['Đại vận']}
                id="tn-muc-dai-van"
              />{' '}
              8 bước (10 năm mỗi bước)
            </h2>

            <p className="ck-bt-khoi-van">{gv.cau}</p>

            <DaiVanCuonClient
              className="ck-bt-dv-dai"
              ariaLabel="Dải đại vận 8 bước (cuộn ngang)"
            >
              {ketQua.daiVan.ds.map((dv) => {
                const [dvCan, dvChi] = dv.canChi.split(' ');
                const daQua = !dv.dangChay && dv.tuNam + 9 < namXem;
                const cls = [
                  'ck-bt-dv-the',
                  dv.dangChay ? 'ck-bt-dv-chay' : '',
                  daQua ? 'ck-bt-dv-qua' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <article
                    key={dv.thuTu}
                    className={cls}
                    data-dang-chay={dv.dangChay ? 'true' : undefined}
                    aria-current={dv.dangChay ? 'step' : undefined}
                  >
                    <div className="ck-bt-dv-dau">
                      <span className="ck-bt-dv-buoc">Vận {dv.thuTu}</span>
                      {dv.dangChay ? (
                        <span className="ck-bt-nhan-chay">Đang chạy</span>
                      ) : null}
                    </div>

                    <strong className="ck-bt-dv-cc">
                      <span className={`ck-tq-hanh-${HANH_SLUG[dv.hanhCan]}`}>{dvCan}</span>{' '}
                      <span className={`ck-tq-hanh-${HANH_SLUG[dv.hanhChi]}`}>{dvChi}</span>
                    </strong>

                    <div className="ck-bt-dv-han" lang="zh-Hant">
                      <span className={`ck-tq-hanh-${HANH_SLUG[dv.hanhCan]}`}>
                        {CAN_HAN[dvCan] ?? ''}
                      </span>
                      <span className={`ck-tq-hanh-${HANH_SLUG[dv.hanhChi]}`}>
                        {CHI_HAN[dvChi] ?? ''}
                      </span>
                    </div>

                    <div className="ck-bt-dv-moc">
                      <b className="ck-bt-dv-nam">
                        {dv.tuNam}–{dv.tuNam + 9}
                      </b>
                      <span className="ck-bt-dv-tuoi">
                        {dv.tuTuoi}–{dv.tuTuoi + 9} tuổi mụ
                      </span>
                    </div>
                  </article>
                );
              })}
            </DaiVanCuonClient>

            <details className="ck-bt-quy-uoc">
              <summary className="ck-bt-quy-uoc-nut">Cách tính</summary>
              <dl className="ck-bt-thong-so">
                <div>
                  <dt>Lệnh tháng (chi tháng)</dt>
                  <dd>
                    Tháng {ketQua.tru[1].chi} ({ketQua.tru[1].canChi}, hành{' '}
                    {ketQua.tru[1].hanhChi})
                  </dd>
                </div>
                <div>
                  <dt>Tiết trước</dt>
                  <dd>
                    {ketQua.tiet.truoc.ten} ({ketQua.tiet.truoc.luc})
                  </dd>
                </div>
                <div>
                  <dt>Tiết sau</dt>
                  <dd>
                    {ketQua.tiet.sau.ten} ({ketQua.tiet.sau.luc})
                  </dd>
                </div>
              </dl>
              <ul>
                {ketQua.quyUoc.map((dong, idx) => (
                  <li key={idx}>{dong}</li>
                ))}
              </ul>
            </details>
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-bt-cho-luan">
            <div className="ck-cho-noi-dung">
              <h2 id="ck-bt-cho-luan">Luận giải lá số Bát tự</h2>
              <p>Phần luận giải đang biên tập</p>
            </div>
          </section>
        </>
      ) : (
        <section className="ck-td-muc" aria-labelledby="ck-bt-cho-gioi-thieu">
          <div className="ck-cho-noi-dung">
            <h2 id="ck-bt-cho-gioi-thieu">Luận giải lá số Bát tự</h2>
            <p>Phần luận giải đang biên tập</p>
          </div>
        </section>
      )}

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Tra cứu liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/bat-tu">Tổng quan Bát tự</Link>
          {daDung.has('/tu-vi/lap-la-so') ? (
            <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          ) : null}
          {daDung.has('/can-chi') ? <Link href="/can-chi">Can chi &amp; mệnh</Link> : null}
          {daDung.has('/ngu-hanh') ? <Link href="/ngu-hanh">Ngũ hành sinh khắc</Link> : null}
          {daDung.has('/lich-am') ? <Link href="/lich-am">Lịch âm hôm nay</Link> : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

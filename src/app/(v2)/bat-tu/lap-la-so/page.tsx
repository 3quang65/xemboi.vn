import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  ChuGiaiHanh,
  DocNhanh,
  ThuatNgu,
  TrichNguyenVan,
  type TheDocNhanhItem,
  type TrichSachDaGiai,
} from '@/components/ck/truc-quan';
import { kiemTraDauVao, lapLaSoBatTu, type LaSoBatTu, type TruBatTu } from '@/lib/trang/bat-tu';
import {
  lapTamTru,
  luuNienBatTu,
  namTrongDaiVan,
  type LuuNienBatTu,
  type TamTru,
} from '@/lib/trang/bat-tu-luu-nien';
import {
  GIAI_NGHIA_BAT_TU,
  NGUON_BAT_TU,
  TEN_NHOM_QUAN_HE,
  TRICH_BAT_TU,
  docNhanh,
  giaoVan,
  muaTheoChiThang,
  nghiaThapThan,
  quanHeTru,
  type MaTrichBatTu,
} from '@/lib/trang/bat-tu-truc-quan';
import type { Hanh } from '@/lib/trang/can-chi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { THAP_THAN_CHI_TIET } from '@/lib/trang/thap-than';
import { DIA_CHI, chiCanhGio } from '@/lib/tuvi-v2/am-lich';
import { DaiVanCuonClient } from './DaiVanCuonClient';
import { KhongRoGioClient } from './KhongRoGioClient';
import {
  ChuGiaiQuanHe,
  DanhSachChipQuanHe,
  KIEU_NET_QUAN_HE,
  MauNetQuanHeSvg,
  SoDoQuanHeSvg,
  type MucQuanHeVe,
} from './SoDoQuanHeSvg';

const MAC_DINH_BAT_TU_LS = {
  title: 'Lập lá số bát tự online – tứ trụ theo tiết khí chuẩn',
  h1: 'Lập lá số bát tự online',
};

const THU_TU_HANH: readonly Hanh[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
const DUONG_DAN_THAP_THAN = new Map<string, string>(
  THAP_THAN_CHI_TIET.map((t) => [t.ten, t.duongDan]),
);

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
  const nguon = NGUON_BAT_TU[trich.nguon];
  return {
    dich: trich.dich,
    viTriViet: trich.viTriViet,
    tenSach: nguon.tenHanViet,
    tacGia: nguon.tacGia,
    nienDai: nguon.nienDai,
    doanId: trich.doanId,
    ghiCong: nguon.ghiCong,
    url: nguon.url,
  };
}

function dinhDangPhanTram(n: number, tong = 8): string {
  const pct = Math.round((n / tong) * 1000) / 10;
  return Number.isInteger(pct) ? `${pct}%` : `${String(pct).replace('.', ',')}%`;
}

function docTamTruDocNhanh(tt: TamTru): { cau: string; the: TheDocNhanhItem[] } {
  const nc = tt.laSo.nhatChu;
  const truThang = tt.laSo.tru[1];
  const mua = muaTheoChiThang(truThang.chi);
  const the: TheDocNhanhItem[] = [
    {
      ma: 'nhat-chu',
      nhan: 'Nhật chủ (can ngày)',
      giaTri: nc.can,
      hanh: nc.hanh,
      chiTiet: `${nc.amDuong} ${nc.hanh}. Sách lấy can ngày làm chủ khi xem bát tự; các trụ khác đối chiếu với can này để ra thập thần.`,
      trich: 'nhatChu',
    },
    {
      ma: 'thang-sinh',
      nhan: 'Tháng sinh (lệnh tháng)',
      giaTri: truThang.canChi,
      hanh: truThang.hanhChi,
      chiTiet: `Tháng ${truThang.chi}, mùa ${mua}, tính từ tiết ${tt.laSo.tiet.truoc.ten} (${tt.laSo.tiet.truoc.luc}) tới ${tt.laSo.tiet.sau.ten}. Chi tháng hành ${truThang.hanhChi}.`,
      trich: 'deCuong',
    },
    {
      ma: 'ngu-hanh',
      nhan: 'Đếm ngũ hành 6 chữ',
      giaTri: THU_TU_HANH.map((h) => `${h} ${tt.demNguHanh[h]}`).join(' · '),
      chiTiet: tt.thieuHanh.length
        ? `Chưa có ${tt.thieuHanh.join(', ')} trong 6 chữ (3 can, 3 chi). Chưa tính trụ giờ và tàng can.`
        : 'Đủ năm hành trong 6 chữ (3 can, 3 chi). Chưa tính trụ giờ và tàng can.',
    },
  ];
  return { cau: tt.cau, the };
}

function TheTruChiTiet({ tru, colIdx }: { tru: TruBatTu; colIdx: number }) {
  const laNgay = tru.ten === 'Ngày';
  const theCls = laNgay
    ? 'ck-bt-tru-the ck-bt-tru-ngay'
    : `ck-bt-tru-the ck-tq-nen-${HANH_SLUG[tru.hanhChi]}`;

  return (
    <article className={theCls}>
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
              {DUONG_DAN_THAP_THAN.has(tru.thapThanCan) ? (
                <Link
                  href={DUONG_DAN_THAP_THAN.get(tru.thapThanCan)!}
                  className="ck-bt-tt-link"
                  title={nghiaThapThan(tru.thapThanCan)}
                >
                  {tru.thapThanCan}
                </Link>
              ) : (
                <ThuatNgu
                  ten={tru.thapThanCan}
                  nghia={nghiaThapThan(tru.thapThanCan)}
                  id={`tn-can-tt-${colIdx}`}
                />
              )}
            </span>
          </div>
        ) : null}
      </div>

      <div className="ck-bt-tru-chu-khoi">
        <strong className={`ck-bt-chu-can-chi ck-tq-hanh-${HANH_SLUG[tru.hanhCan]}`}>
          {tru.can}
        </strong>
        <span className="ck-bt-chu-phu">{tru.hanhCan}</span>
      </div>

      <div className="ck-bt-tru-chu-khoi">
        <strong className={`ck-bt-chu-can-chi ck-tq-hanh-${HANH_SLUG[tru.hanhChi]}`}>
          {tru.chi}
        </strong>
        <span className="ck-bt-chu-phu">{tru.hanhChi}</span>
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
                {DUONG_DAN_THAP_THAN.has(tc.thapThan) ? (
                  <Link
                    href={DUONG_DAN_THAP_THAN.get(tc.thapThan)!}
                    className="ck-bt-tang-link"
                    title={nghiaThapThan(tc.thapThan)}
                  >
                    {tc.thapThan}
                  </Link>
                ) : (
                  <ThuatNgu
                    ten={tc.thapThan}
                    nghia={nghiaThapThan(tc.thapThan)}
                    id={`tn-tang-tt-${colIdx}-${tcIdx}`}
                  />
                )}
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
}

function DanhSachQuanHeChiTiet({
  quanHe,
  prefixId,
  trongText,
}: {
  quanHe: MucQuanHeVe[];
  prefixId: string;
  trongText?: string;
}) {
  const coXung = quanHe.some((q) => q.nhom === 'xung');
  const coHinh = quanHe.some((q) => q.nhom === 'hinh');

  return (
    <>
      {quanHe.length > 0 ? (
        <ul className="ck-bt-qh-ds">
          {quanHe.map((q, idx) => {
            const cfg = KIEU_NET_QUAN_HE[q.nhom];
            const nghiaQH =
              GIAI_NGHIA_BAT_TU[q.ten] ??
              (q.loai === 'thieu-tam-hop' ? GIAI_NGHIA_BAT_TU['Tam hợp'] : undefined);

            return (
              <li
                key={`${prefixId}-${q.loai}-${q.tru.join('')}-${idx}`}
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
                      <ThuatNgu ten={q.ten} nghia={nghiaQH} id={`${prefixId}-${idx}`} />
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
                        const tq = giaiTrichBatTu(ma);
                        return tq ? <TrichNguyenVan key={ma} {...tq} /> : null;
                      })}
                    </div>
                  </details>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : trongText ? (
        <p className="ck-bt-qh-trong">{trongText}</p>
      ) : null}

      {coXung || coHinh ? (
        <div className="ck-bt-qh-luu-y">
          <p className="ck-bt-qh-luu-y-tieu">
            Sách ghi về xung, hình (không vội luận là dữ):
          </p>
          {coXung ? (
            <TrichNguyenVan {...giaiTrichBatTu('xungKhongVoiDoan')!} nhan="Sách ghi" />
          ) : null}
          {coHinh ? (
            <TrichNguyenVan {...giaiTrichBatTu('hinhKhongVoiDoan')!} nhan="Sách ghi" />
          ) : null}
        </div>
      ) : null}
    </>
  );
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
  const khongRoGioRaw = layMot(sp.khongRoGio)?.trim();
  const themGio = layMot(sp.themGio)?.trim() === '1';
  const lnRaw = layMot(sp.ln)?.trim();

  const khongRoGio = khongRoGioRaw === '1' || khongRoGioRaw === 'true';
  const lnSo = lnRaw && /^\d+$/.test(lnRaw) ? Number(lnRaw) : NaN;
  const lnNam =
    Number.isInteger(lnSo) && lnSo >= 1900 && lnSo <= 2100 ? lnSo : null;

  const coThamSo = Boolean(
    ngayRaw ||
    thangRaw ||
    namRaw ||
    gioRaw ||
    phutRaw ||
    gioiTinhRaw ||
    tuFormRaw ||
    khongRoGioRaw,
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
  let tamTru: TamTru | null = null;

  if (coThamSo && !themGio) {
    if (khongRoGio) {
      const loiDauVao = kiemTraDauVao({
        ngay: ngayRaw ? Number(ngayRaw) : NaN,
        thang: thangRaw ? Number(thangRaw) : NaN,
        nam: namRaw ? Number(namRaw) : NaN,
        gio: 12,
        phut: 0,
        gioiTinh: gtVal,
      });
      if (loiDauVao) {
        loi = loiDauVao;
      } else {
        tamTru = lapTamTru({
          ngay: Number(ngayRaw),
          thang: Number(thangRaw),
          nam: Number(namRaw),
          gioiTinh: gtVal!,
          namXem,
        });
        ketQua = tamTru.laSo;
      }
    } else {
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
  }

  // Thứ tự truyền thống từ trái sang phải: Giờ, Ngày, Tháng, Năm (đọc từ phải sang trái: Năm → Tháng → Ngày → Giờ)
  const bonTruHienThi: (TruBatTu | null)[] = ketQua
    ? [tamTru ? null : ketQua.tru[3], ketQua.tru[2], ketQua.tru[1], ketQua.tru[0]]
    : [];
  const quanHe: MucQuanHeVe[] = tamTru
    ? tamTru.quanHe
    : ketQua
      ? quanHeTru(ketQua)
      : [];
  const dn = tamTru
    ? docTamTruDocNhanh(tamTru)
    : ketQua
      ? docNhanh(ketQua, quanHe as ReturnType<typeof quanHeTru>)
      : null;
  const gv = ketQua ? giaoVan(ketQua) : null;
  const luuNien: LuuNienBatTu | null =
    !tamTru && ketQua && lnNam !== null ? luuNienBatTu(ketQua, lnNam) : null;
  const quanHeCan = quanHe.filter((q) => q.hang === 'can');
  const quanHeChi = quanHe.filter((q) => q.hang === 'chi');
  const lnQuanHeCan = luuNien ? luuNien.quanHe.filter((q) => q.hang === 'can') : [];
  const lnQuanHeChi = luuNien ? luuNien.quanHe.filter((q) => q.hang === 'chi') : [];

  const demNguHanh = tamTru ? tamTru.demNguHanh : ketQua?.demNguHanh;
  const tongChuDem = tamTru ? 6 : 8;
  const chuaChacTru = tamTru
    ? tamTru.chuaChac.filter((c) => !c.startsWith('Tuổi khởi vận'))
    : [];
  const chuaChacKhoiVan = tamTru
    ? tamTru.chuaChac.filter((c) => c.startsWith('Tuổi khởi vận'))
    : [];

  const taoUrlLaSo = (opts?: {
    ln?: number;
    themGio?: boolean;
    hash?: string;
  }): string => {
    if (!ketQua) return '/bat-tu/lap-la-so';
    const qs = new URLSearchParams();
    qs.set('ngay', String(ketQua.dauVao.ngay));
    qs.set('thang', String(ketQua.dauVao.thang));
    qs.set('nam', String(ketQua.dauVao.nam));
    qs.set('gioiTinh', ketQua.dauVao.gioiTinh);
    if (opts?.themGio) {
      qs.set('themGio', '1');
    } else if (tamTru) {
      qs.set('khongRoGio', '1');
    } else {
      qs.set('gio', String(ketQua.dauVao.gio));
      qs.set('phut', String(ketQua.dauVao.phut));
      if (tuFormRaw === '1') qs.set('tuForm', '1');
      if (doi23Raw !== undefined) {
        qs.set('doiNgayLuc23', doiNgayLuc23 ? '1' : '0');
      }
      if (opts?.ln !== undefined) {
        qs.set('ln', String(opts.ln));
      }
    }
    const query = qs.toString();
    return opts?.hash
      ? `/bat-tu/lap-la-so?${query}#${opts.hash}`
      : `/bat-tu/lap-la-so?${query}`;
  };

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
        <form id="ck-bt-form" className="ck-to-giay ck-bt-form" action="/bat-tu/lap-la-so" method="get">
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

          {themGio && !loi ? (
            <p className="ck-bt-goi-y-gio" role="status">
              Đã giữ ngày sinh {String(ngayVal).padStart(2, '0')}/
              {String(thangVal).padStart(2, '0')}/{namVal}. Chọn giờ sinh bên dưới rồi bấm Lập lá
              số Bát tự để bổ sung trụ giờ.
            </p>
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

          <label className="ck-tick" htmlFor="ck-bt-khong-ro-gio">
            <input
              id="ck-bt-khong-ro-gio"
              type="checkbox"
              name="khongRoGio"
              value="1"
              defaultChecked={khongRoGio}
            />
            <span>Không rõ giờ sinh (chỉ lập tam trụ năm, tháng, ngày)</span>
          </label>

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
                    {String(h).padStart(2, '0')} giờ ({DIA_CHI[chiCanhGio(h)]})
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

          <label className="ck-tick ck-bt-doi23-o" htmlFor="ck-bt-doi23">
            <input
              id="ck-bt-doi23"
              type="checkbox"
              name="doiNgayLuc23"
              value="1"
              defaultChecked={doiNgayLuc23}
            />
            <span>Sinh 23:00–23:59 tính sang ngày sau</span>
          </label>

          <KhongRoGioClient
            checkboxId="ck-bt-khong-ro-gio"
            targetIds={['ck-bt-gio', 'ck-bt-phut', 'ck-bt-doi23']}
          />

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
              tamTru ? (
                <span>
                  Sinh {String(ketQua.dauVao.ngay).padStart(2, '0')}/
                  {String(ketQua.dauVao.thang).padStart(2, '0')}/{ketQua.dauVao.nam} · Chưa rõ
                  giờ sinh · {ketQua.dauVao.gioiTinh === 'nam' ? 'Nam' : 'Nữ'} (dương lịch, giờ
                  Việt Nam UTC+7)
                </span>
              ) : (
                <span>
                  Sinh {String(ketQua.dauVao.ngay).padStart(2, '0')}/
                  {String(ketQua.dauVao.thang).padStart(2, '0')}/{ketQua.dauVao.nam} ·{' '}
                  {String(ketQua.dauVao.gio).padStart(2, '0')}:
                  {String(ketQua.dauVao.phut).padStart(2, '0')} ·{' '}
                  {ketQua.dauVao.gioiTinh === 'nam' ? 'Nam' : 'Nữ'} (dương lịch, giờ Việt Nam
                  UTC+7)
                </span>
              )
            }
            trenCau={
              <div
                className="ck-bt-tam-chu"
                aria-label={
                  tamTru
                    ? 'Sáu chữ Tam trụ từ Ngày đến Năm (trụ Giờ chưa rõ)'
                    : 'Tám chữ Bát tự từ Giờ đến Năm (đọc từ phải sang trái)'
                }
              >
                {bonTruHienThi.map((tru) =>
                  tru ? (
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
                          <b className={`ck-bt-tam-viet-lon ck-tq-hanh-${HANH_SLUG[tru.hanhCan]}`}>
                            {tru.can}
                          </b>
                          <span className="ck-bt-tam-viet">{tru.hanhCan}</span>
                        </span>
                        <span className="ck-bt-tam-chu-don">
                          <b className={`ck-bt-tam-viet-lon ck-tq-hanh-${HANH_SLUG[tru.hanhChi]}`}>
                            {tru.chi}
                          </b>
                          <span className="ck-bt-tam-viet">{tru.hanhChi}</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div key="tam-gio-trong" className="ck-bt-tam-cap ck-bt-tam-cap-trong">
                      <span className="ck-bt-tam-tru">Trụ Giờ</span>
                      <span className="ck-bt-tam-trong-chu">Chưa rõ giờ</span>
                    </div>
                  ),
                )}
              </div>
            }
            giaiTrich={giaiTrichBatTu}
            hienNhan={hienNhanDocNhanh}
          />

          <section className="ck-td-muc" aria-labelledby="ck-bt-tu-tru-tieu">
            <h2 id="ck-bt-tu-tru-tieu" className="ck-td-tieu">
              {tamTru
                ? 'Tam trụ (chưa rõ giờ sinh)'
                : luuNien
                  ? `Tứ trụ & lưu niên ${luuNien.nam} (Giờ · Ngày · Tháng · Năm · Lưu niên)`
                  : 'Tứ trụ (Giờ · Ngày · Tháng · Năm)'}
            </h2>

            <div className="ck-bt-tru-ghi">
              <p className="ck-bt-tru-thu-tu">
                {tamTru
                  ? 'Đọc từ phải sang trái: Năm ← Tháng ← Ngày (trụ Giờ còn trống).'
                  : luuNien
                    ? `Đọc từ phải sang trái: Năm ← Tháng ← Ngày ← Giờ; cột Lưu niên ${luuNien.nam} phủ bên phải.`
                    : 'Đọc từ phải sang trái: Năm ← Tháng ← Ngày ← Giờ.'}
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

            {chuaChacTru.length > 0 ? (
              <div
                className="ck-bt-chua-chac-ds"
                aria-label="Lưu ý giờ sinh cho trụ năm và trụ tháng"
              >
                {chuaChacTru.map((cau, i) => (
                  <p key={i} className="ck-bt-chua-chac-hop" role="note">
                    {cau}
                  </p>
                ))}
              </div>
            ) : null}

            {luuNien ? (
              (() => {
                const [lnCan, lnChi] = luuNien.canChi.split(' ');
                return (
                  <div id="luu-nien" className="ck-bt-ln-vung">
                    <div className="ck-bt-tu-tru-khung ck-bt-tu-tru-co-ln">
                      <div className="ck-bt-ln-svg-desktop ck-bt-ln-svg-tren-5">
                        <SoDoQuanHeSvg
                          quanHe={[...quanHeCan, ...lnQuanHeCan]}
                          viTri="tren"
                          soCot={5}
                          chiHienSvg
                        />
                      </div>

                      <div className="ck-bt-ln-svg-mobile ck-bt-ln-svg-tren-4">
                        <SoDoQuanHeSvg quanHe={quanHeCan} viTri="tren" soCot={4} />
                      </div>

                      {bonTruHienThi.map((tru, colIdx) =>
                        tru ? <TheTruChiTiet key={tru.ten} tru={tru} colIdx={colIdx} /> : null,
                      )}

                      <article className="ck-bt-tru-the ck-bt-tru-ln">
                        <div className="ck-bt-tru-phan-dau">
                          <header className="ck-bt-tru-dau">
                            <strong className="ck-bt-tru-ten">Lưu niên {luuNien.nam}</strong>
                            <span className="ck-bt-tru-nhan-phu">
                              {luuNien.nam === namXem ? 'Năm hiện tại' : 'Năm đang xem'}
                            </span>
                          </header>

                          <div className="ck-bt-tt-hang">
                            <span className="ck-bt-tt-pill">
                              {DUONG_DAN_THAP_THAN.has(luuNien.thapThanCan) ? (
                                <Link
                                  href={DUONG_DAN_THAP_THAN.get(luuNien.thapThanCan)!}
                                  className="ck-bt-tt-link"
                                  title={nghiaThapThan(luuNien.thapThanCan)}
                                >
                                  {luuNien.thapThanCan}
                                </Link>
                              ) : (
                                <ThuatNgu
                                  ten={luuNien.thapThanCan}
                                  nghia={nghiaThapThan(luuNien.thapThanCan)}
                                  id="tn-ln-can-tt"
                                />
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="ck-bt-tru-chu-khoi">
                          <strong
                            className={`ck-bt-chu-can-chi ck-tq-hanh-${HANH_SLUG[luuNien.hanhCan]}`}
                          >
                            {lnCan}
                          </strong>
                          <span className="ck-bt-chu-phu">{luuNien.hanhCan}</span>
                        </div>

                        <div className="ck-bt-tru-chu-khoi">
                          <strong
                            className={`ck-bt-chu-can-chi ck-tq-hanh-${HANH_SLUG[luuNien.hanhChi]}`}
                          >
                            {lnChi}
                          </strong>
                          <span className="ck-bt-chu-phu">{luuNien.hanhChi}</span>
                        </div>

                        <footer className="ck-bt-tru-nap-am ck-bt-ln-chan-cot">
                          <span className="ck-bt-tru-muc-nhan">Lưu niên</span>
                          <span className="ck-bt-nap-am-ten">
                            Đổi tại Lập xuân {luuNien.nam}
                          </span>
                        </footer>
                      </article>

                      <div className="ck-bt-ln-svg-desktop ck-bt-ln-svg-duoi-5">
                        <SoDoQuanHeSvg
                          quanHe={[...quanHeChi, ...lnQuanHeChi]}
                          viTri="duoi"
                          soCot={5}
                          chiHienSvg
                        />
                      </div>

                      <div className="ck-bt-ln-svg-mobile ck-bt-ln-svg-duoi-4">
                        <SoDoQuanHeSvg quanHe={quanHeChi} viTri="duoi" soCot={4} />
                      </div>

                      <DanhSachChipQuanHe
                        quanHe={luuNien.quanHe}
                        ariaLabel="Quan hệ của lưu niên với bốn trụ"
                        className="ck-bt-ln-chip-ds"
                      />

                      <div className="ck-bt-chu-giai-khung">
                        <ChuGiaiQuanHe />
                        <ChuGiaiHanh />
                      </div>
                    </div>

                    <div className="ck-bt-ln-chi-tiet">
                      <div className="ck-bt-ln-dau">
                        <h3 className="ck-bt-ln-tieu">
                          Lưu niên {luuNien.nam} · {luuNien.canChi}
                        </h3>
                        <a href={taoUrlLaSo()} className="ck-bt-ln-bo">
                          Bỏ lưu niên
                        </a>
                      </div>

                      <p className="ck-bt-ln-cau">{luuNien.cau}</p>

                      <DanhSachQuanHeChiTiet quanHe={luuNien.quanHe} prefixId="tn-ln-qh" />
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="ck-bt-tu-tru-khung">
                <SoDoQuanHeSvg quanHe={quanHeCan} viTri="tren" soCot={4} />

                <div className="ck-bt-tru-luoi">
                  {bonTruHienThi.map((tru, colIdx) =>
                    tru ? (
                      <TheTruChiTiet key={tru.ten} tru={tru} colIdx={colIdx} />
                    ) : (
                      <article key="tru-gio-trong" className="ck-bt-tru-the ck-bt-tru-trong">
                        <div className="ck-bt-tru-phan-dau">
                          <header className="ck-bt-tru-dau">
                            <strong className="ck-bt-tru-ten">Trụ Giờ</strong>
                            <span className="ck-bt-tru-nhan-phu">Chưa xác định</span>
                          </header>
                        </div>

                        <div className="ck-bt-tru-trong-giua">
                          <p className="ck-bt-tru-trong-chu">Chưa rõ giờ</p>
                          <a
                            href={taoUrlLaSo({ themGio: true, hash: 'ck-bt-gio' })}
                            className="ck-bt-tru-them-gio"
                          >
                            Thêm giờ sinh
                          </a>
                        </div>

                        <footer className="ck-bt-tru-nap-am">
                          <span className="ck-bt-tru-muc-nhan">Tam trụ</span>
                          <span className="ck-bt-nap-am-ten">Thiếu can chi giờ</span>
                        </footer>
                      </article>
                    ),
                  )}
                </div>

                <SoDoQuanHeSvg quanHe={quanHeChi} viTri="duoi" soCot={4} />

                <div className="ck-bt-chu-giai-khung">
                  <ChuGiaiQuanHe />
                  <ChuGiaiHanh />
                </div>
              </div>
            )}

            <details className="ck-bt-bang-gap">
              <summary className="ck-bt-bang-gap-nut">Xem dạng bảng</summary>
              <div className="ck-bt-bang-khung">
                <table className="ck-bt-bang">
                  <caption>
                    {tamTru
                      ? 'Sắp theo thứ tự truyền thống từ phải sang trái: Năm ← Tháng ← Ngày (trụ Giờ chưa rõ)'
                      : 'Sắp theo thứ tự truyền thống từ phải sang trái: Năm ← Tháng ← Ngày ← Giờ'}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className="ck-bt-nhan-hang">
                        Hạng mục
                      </th>
                      {bonTruHienThi.map((tru) =>
                        tru ? (
                          <th
                            key={tru.ten}
                            scope="col"
                            className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                          >
                            Trụ {tru.ten}
                            <small>{tru.ten === 'Ngày' ? 'Nhật chủ' : tru.amDuong}</small>
                          </th>
                        ) : (
                          <th key="bang-gio-trong" scope="col">
                            Trụ Giờ
                            <small>Chưa rõ</small>
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row" className="ck-bt-nhan-hang">
                        Thập thần
                      </th>
                      {bonTruHienThi.map((tru) =>
                        tru ? (
                          <td
                            key={`${tru.ten}-tt`}
                            className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                          >
                            {DUONG_DAN_THAP_THAN.has(tru.thapThanCan) ? (
                              <Link
                                href={DUONG_DAN_THAP_THAN.get(tru.thapThanCan)!}
                                className="ck-bt-bang-tt-link"
                              >
                                <b>{tru.thapThanCan}</b>
                              </Link>
                            ) : (
                              <b>{tru.thapThanCan}</b>
                            )}
                          </td>
                        ) : (
                          <td key="bang-gio-tt">Chưa rõ giờ</td>
                        ),
                      )}
                    </tr>

                    <tr>
                      <th scope="row" className="ck-bt-nhan-hang">
                        Thiên can
                      </th>
                      {bonTruHienThi.map((tru) =>
                        tru ? (
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
                        ) : (
                          <td key="bang-gio-can">—</td>
                        ),
                      )}
                    </tr>

                    <tr>
                      <th scope="row" className="ck-bt-nhan-hang">
                        Địa chi
                      </th>
                      {bonTruHienThi.map((tru) =>
                        tru ? (
                          <td
                            key={`${tru.ten}-chi`}
                            className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                          >
                            <strong
                              className={`ck-bt-chu-lon ck-bt-chu-${HANH_SLUG[tru.hanhChi]}`}
                            >
                              {tru.chi}
                            </strong>
                            <span className="ck-bt-hanh-phu">{tru.hanhChi}</span>
                          </td>
                        ) : (
                          <td key="bang-gio-chi">—</td>
                        ),
                      )}
                    </tr>

                    <tr>
                      <th scope="row" className="ck-bt-nhan-hang">
                        Tàng can
                      </th>
                      {bonTruHienThi.map((tru) =>
                        tru ? (
                          <td
                            key={`${tru.ten}-tang`}
                            className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                          >
                            <ul className="ck-bt-tang-ds">
                              {tru.tangCan.map((tc) => (
                                <li key={`${tru.ten}-${tc.can}`}>
                                  <b className={`ck-bt-chu-${HANH_SLUG[tc.hanh]}`}>{tc.can}</b>
                                  {DUONG_DAN_THAP_THAN.has(tc.thapThan) ? (
                                    <Link
                                      href={DUONG_DAN_THAP_THAN.get(tc.thapThan)!}
                                      className="ck-bt-bang-tt-link"
                                    >
                                      ({tc.thapThan})
                                    </Link>
                                  ) : (
                                    <span>({tc.thapThan})</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </td>
                        ) : (
                          <td key="bang-gio-tang">—</td>
                        ),
                      )}
                    </tr>

                    <tr>
                      <th scope="row" className="ck-bt-nhan-hang">
                        Nạp âm
                      </th>
                      {bonTruHienThi.map((tru) =>
                        tru ? (
                          <td
                            key={`${tru.ten}-na`}
                            className={tru.ten === 'Ngày' ? 'ck-bt-cot-ngay' : undefined}
                          >
                            {tru.napAm}
                          </td>
                        ) : (
                          <td key="bang-gio-na">—</td>
                        ),
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-bt-quan-he-tieu">
            <h2 id="ck-bt-quan-he-tieu" className="ck-td-tieu">
              {tamTru ? 'Quan hệ giữa ba trụ' : 'Quan hệ giữa các trụ'}
            </h2>

            <DanhSachQuanHeChiTiet
              quanHe={quanHe}
              prefixId="tn-qh"
              trongText={
                tamTru
                  ? 'Ba trụ năm, tháng, ngày không có cặp hợp, xung, hình, hại nào theo các bảng đang dùng.'
                  : dn.the.find((t) => t.ma === 'quan-he')?.chiTiet ??
                  'Bốn trụ không có cặp hợp, xung, hình, hại nào theo các bảng đang dùng.'
              }
            />
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-bt-ngu-hanh-tieu">
            <h2 id="ck-bt-ngu-hanh-tieu" className="ck-td-tieu">
              Ngũ hành
            </h2>
            <p className="ck-bt-nh-phu">
              {tamTru
                ? 'Đếm 6 chữ (3 can, 3 chi), chưa có trụ giờ.'
                : 'Đếm 8 chữ lộ (4 can, 4 chi), chưa tính tàng can.'}
            </p>

            <div className="ck-bt-nh-khung">
              <div className="ck-bt-nh-luoi">
                {THU_TU_HANH.map((h) => {
                  const soLuong = demNguHanh?.[h] ?? 0;
                  const pct = (soLuong / tongChuDem) * 100;
                  const pctChu = dinhDangPhanTram(soLuong, tongChuDem);
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

            {chuaChacKhoiVan.length > 0 ? (
              <div
                className="ck-bt-chua-chac-ds"
                aria-label="Khoảng tuổi khởi vận theo giờ sinh"
              >
                {chuaChacKhoiVan.map((cau, i) => (
                  <p key={i} className="ck-bt-chua-chac-hop" role="note">
                    {cau}
                  </p>
                ))}
              </div>
            ) : null}

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
                const dsNam = !tamTru ? namTrongDaiVan(ketQua, dv.thuTu) : [];
                const chuaNamChon = lnNam !== null && dsNam.some((x) => x.nam === lnNam);

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

                    <div className="ck-bt-dv-moc">
                      <b className="ck-bt-dv-nam">
                        {dv.tuNam}–{dv.tuNam + 9}
                      </b>
                      <span className="ck-bt-dv-tuoi">
                        {dv.tuTuoi}–{dv.tuTuoi + 9} tuổi mụ
                      </span>
                    </div>

                    {dsNam.length > 0 ? (
                      <details className="ck-bt-dv-10nam" open={chuaNamChon || undefined}>
                        <summary className="ck-bt-dv-10nam-nut">10 năm</summary>
                        <ul className="ck-bt-dv-10nam-ds">
                          {dsNam.map((muc) => {
                            const laNay = muc.nam === namXem;
                            const dangChon = muc.nam === lnNam;
                            const hopLe = muc.nam >= 1900 && muc.nam <= 2100;
                            const [mCan, mChi] = muc.canChi.split(' ');
                            return (
                              <li key={muc.nam}>
                                {hopLe ? (
                                  <a
                                    href={taoUrlLaSo({ ln: muc.nam, hash: 'luu-nien' })}
                                    className={`ck-bt-dv-10nam-link${dangChon ? ' ck-bt-dv-10nam-chon' : ''}${laNay ? ' ck-bt-dv-10nam-nay' : ''}`}
                                    aria-current={dangChon ? 'page' : undefined}
                                    aria-label={
                                      laNay ? `${muc.nam} ${muc.canChi}, năm hiện tại` : undefined
                                    }
                                  >
                                    <span className="ck-bt-dv-10nam-dong">
                                      <strong>{muc.nam}</strong>
                                      {laNay ? (
                                        <span className="ck-bt-dv-nay-huy">
                                          <i className="ck-bt-cham-son" aria-hidden="true" />
                                          <span>Nay</span>
                                        </span>
                                      ) : null}
                                    </span>
                                    <span className="ck-bt-dv-10nam-cc">
                                      {mCan} {mChi}
                                    </span>
                                  </a>
                                ) : (
                                  <span className="ck-bt-dv-10nam-ngoai">
                                    <strong>{muc.nam}</strong> · {muc.canChi}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </details>
                    ) : null}
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

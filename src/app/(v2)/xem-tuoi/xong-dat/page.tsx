import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { dinhDangNgayVN } from '@/components/ck/lichHelpers';
import { namSinhHopLe } from '@/lib/trang/can-chi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { tetSapToi } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import {
  NAM_XEM_TUOI_DEN,
  NAM_XEM_TUOI_TU,
  goiYXongDat,
  type MucDanhGia,
  type NguoiXem,
  type UngVienXongDat,
} from '@/lib/trang/xem-tuoi';
import { canChiNam } from '@/lib/tuvi-v2/am-lich';

const MAC_DINH_XONG_DAT = {
  title: 'Xem tuổi xông đất đầu năm theo tuổi gia chủ',
  h1: 'Tuổi xông đất đầu năm',
};

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

const NHAN_MUC: Record<MucDanhGia, string> = {
  tot: 'Tốt',
  binh: 'Bình',
  xau: 'Xấu',
};

const LOP_MUC: Record<MucDanhGia, string> = {
  tot: 'ck-muc-badge ck-muc-tot',
  binh: 'ck-muc-badge ck-muc-binh',
  xau: 'ck-muc-badge ck-muc-xau',
};

const DS_NAM_CHU = Array.from(
  { length: NAM_XEM_TUOI_DEN - NAM_XEM_TUOI_TU + 1 },
  (_, i) => NAM_XEM_TUOI_TU + i,
).map((nam) => ({
  nam,
  canChi: canChiNam(nam).ten,
}));

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base, nd] = await Promise.all([
    searchParams,
    metaTrang('/xem-tuoi/xong-dat', MAC_DINH_XONG_DAT),
    noiDungTheoDuongDan('/xem-tuoi/xong-dat'),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/xem-tuoi/xong-dat' },
      robots: { index: false, follow: true },
    };
  }
  return nd ? base : { ...base, robots: { index: false, follow: true } };
}

export default async function XongDatPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const tet = tetSapToi();
  const [tt, sp, nd] = await Promise.all([
    thongTinTrang('/xem-tuoi/xong-dat', MAC_DINH_XONG_DAT),
    searchParams,
    noiDungTheoDuongDan('/xem-tuoi/xong-dat'),
  ]);
  const daDung = trangDaDung();

  const chuRaw = layMot(sp.chu)?.trim() ?? '';
  const tetRaw = layMot(sp.tet)?.trim() ?? '';
  const namChuSo = Number(chuRaw);
  const namTetSo = tetRaw !== '' ? Number(tetRaw) : tet.namAm;

  let loi: string | null = null;
  let ketQua: {
    chu: NguoiXem;
    namTet: { nam: number; canChi: string };
    ungVien: UngVienXongDat[];
  } | null = null;

  if (chuRaw !== '' || tetRaw !== '') {
    if (chuRaw === '') {
      loi = 'Vui lòng chọn năm sinh gia chủ.';
    } else if (
      !Number.isInteger(namChuSo) ||
      namChuSo < NAM_XEM_TUOI_TU ||
      namChuSo > NAM_XEM_TUOI_DEN
    ) {
      loi = `Năm sinh gia chủ hợp lệ trong khoảng ${NAM_XEM_TUOI_TU}–${NAM_XEM_TUOI_DEN}.`;
    } else if (!Number.isInteger(namTetSo) || namTetSo < 1950 || namTetSo > 2100) {
      loi = 'Năm Tết cần trong khoảng 1950–2100.';
    } else {
      ketQua = goiYXongDat(namChuSo, namTetSo);
    }
  }

  const macDinhChu =
    Number.isInteger(namChuSo) &&
    namChuSo >= NAM_XEM_TUOI_TU &&
    namChuSo <= NAM_XEM_TUOI_DEN
      ? namChuSo
      : 1985;
  const macDinhTet =
    Number.isInteger(namTetSo) && namTetSo >= 1950 && namTetSo <= 2100 ? namTetSo : tet.namAm;

  const dsNamTetSet = new Set<number>([
    tet.namAm - 1,
    tet.namAm,
    tet.namAm + 1,
    tet.namAm + 2,
    tet.namAm + 3,
    macDinhTet,
  ]);
  const dsNamTet = [...dsNamTetSet]
    .filter((y) => y >= 1950 && y <= 2100)
    .sort((a, b) => a - b)
    .map((nam) => ({ nam, canChi: canChiNam(nam).ten }));

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/xem-tuoi/xong-dat" toi>
      <div className="ck-xt-tet-banner">
        <p>
          Tết <strong>{tet.canChi}</strong> ({tet.namAm}) vào {tet.thu}, ngày{' '}
          <strong>{dinhDangNgayVN(tet.ngay)}</strong> (dương lịch).
        </p>
        {daDung.has('/tet') ? (
          <Link href="/tet" className="ck-nut ck-nut-vien">
            Xem chi tiết Tết {tet.namAm} →
          </Link>
        ) : null}
      </div>

      <div className="ck-xt-form-khung">
        <form className="ck-to-giay" action="/xem-tuoi/xong-dat" method="get">
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2>Chọn tuổi gia chủ</h2>
            <HoaVanMay flipped />
          </div>

          {loi ? (
            <div className="ck-loi" role="alert">
              {loi}
            </div>
          ) : null}

          <div className="ck-xt-form-2cot">
            <label className="ck-o-con" htmlFor="ck-xd-chu">
              <span>Năm sinh gia chủ</span>
              <select id="ck-xd-chu" name="chu" defaultValue={macDinhChu}>
                {DS_NAM_CHU.map((item) => (
                  <option key={item.nam} value={item.nam}>
                    {item.nam} — {item.canChi}
                  </option>
                ))}
              </select>
            </label>

            <label className="ck-o-con" htmlFor="ck-xd-tet">
              <span>Năm Tết</span>
              <select id="ck-xd-tet" name="tet" defaultValue={macDinhTet}>
                {dsNamTet.map((item) => (
                  <option key={item.nam} value={item.nam}>
                    Tết {item.nam} — {item.canChi}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="ck-nut ck-nut-son ck-nut-lon">
            Gợi ý tuổi xông đất
          </button>

          <p className="ck-ghi-nho">
            Chỉ xét khách 18–70 tuổi âm lịch, không có tiêu chí xung khắc trong 4 tiêu chí đối
            chiếu. Năm sinh theo năm âm lịch.
          </p>
        </form>
      </div>

      {ketQua ? (
        <section className="ck-td-muc" aria-labelledby="ck-xd-ket-qua">
          <h2 id="ck-xd-ket-qua" className="ck-td-tieu">
            Tuổi xông đất Tết {ketQua.namTet.canChi} ({ketQua.namTet.nam}) cho gia chủ{' '}
            {ketQua.chu.nam}
          </h2>

          <div className="ck-xd-tom-tat">
            <p>
              Gia chủ sinh năm{' '}
              {daDung.has('/sinh-nam') && namSinhHopLe(ketQua.chu.nam) ? (
                <Link href={`/sinh-nam/${ketQua.chu.nam}`}>
                  <strong>{ketQua.chu.nam}</strong>
                </Link>
              ) : (
                <strong>{ketQua.chu.nam}</strong>
              )}{' '}
              — tuổi <b>{ketQua.chu.canChi}</b>, nạp âm <b>{ketQua.chu.napAm}</b> (
              <HuyHieuHanh hanh={ketQua.chu.hanh} lienKet={daDung.has('/ngu-hanh')} />
              ).
            </p>
            <p>
              Đối chiếu 4 tiêu chí: chi khách với chi năm {ketQua.namTet.canChi}, can khách với can
              năm, chi khách với chi gia chủ và nạp âm khách với gia chủ.
            </p>
          </div>

          {ketQua.ungVien.length === 0 ? (
            <p className="ck-xd-rong">Không có tuổi nào hợp hoàn toàn với mọi sách</p>
          ) : (
            <div className="ck-xd-ds">
              {ketQua.ungVien.map((u) => (
                <article key={u.nam} className="ck-xd-the">
                  <div className="ck-xd-dau">
                    <h3>
                      {daDung.has('/sinh-nam') && namSinhHopLe(u.nam) ? (
                        <Link href={`/sinh-nam/${u.nam}`}>
                          {u.nam} — {u.canChi}
                        </Link>
                      ) : (
                        `${u.nam} — ${u.canChi}`
                      )}
                    </h3>
                    <span className="ck-xd-tuoi">{u.tuoiAm} tuổi âm</span>
                  </div>

                  <p className="ck-xd-nap-am">
                    Nạp âm: <b>{u.napAm}</b> · {u.tot} tiêu chí tốt, {u.xau} tiêu chí xấu
                  </p>

                  <details className="ck-xd-chi-tiet">
                    <summary>Xem 4 tiêu chí đối chiếu</summary>
                    <ul className="ck-xd-tieu-chi">
                      {u.tieuChi.map((tc) => (
                        <li key={tc.ma}>
                          <div className="ck-xd-tieu-chi-dau">
                            <b>{tc.ten}</b>
                            <span className={LOP_MUC[tc.muc]}>{NHAN_MUC[tc.muc]}</span>
                          </div>
                          <p>{tc.giaiThich}</p>
                        </li>
                      ))}
                    </ul>
                  </details>
                </article>
              ))}
            </div>
          )}

          <p className="ck-xt-luu-y">
            Các sách và trường phái có thể khác nhau; kết quả để tham khảo.
          </p>
        </section>
      ) : null}

      <KhoiDienGiai noiDung={nd} tieuDe="Nguyên tắc chọn tuổi xông đất" />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          {daDung.has('/tet') ? <Link href="/tet">Tết Nguyên Đán {tet.namAm}</Link> : null}
          <Link href="/xem-tuoi">Tổng quan Xem tuổi</Link>
          <Link href="/xem-tuoi/vo-chong">Xem tuổi vợ chồng</Link>
          {daDung.has('/sinh-nam') ? <Link href="/sinh-nam">Tra mệnh theo năm sinh</Link> : null}
          {daDung.has('/lich-am') ? <Link href="/lich-am">Lịch âm hôm nay</Link> : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

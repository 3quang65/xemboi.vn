import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { DocNhanh } from '@/components/ck/truc-quan';
import { namSinhHopLe } from '@/lib/trang/can-chi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { cungTheoTen } from '@/lib/trang/phong-thuy';
import { docNhanhXemTuoi } from '@/lib/trang/truc-quan-43';
import {
  NAM_XEM_TUOI_DEN,
  NAM_XEM_TUOI_TU,
  xemTuoiVoChong,
  type KetQuaVoChong,
  type MucDanhGia,
} from '@/lib/trang/xem-tuoi';
import { canChiNam } from '@/lib/tuvi-v2/am-lich';

const MAC_DINH_VO_CHONG = {
  title: 'Xem tuổi vợ chồng: hợp – khắc theo từng hệ, có giải thích',
  h1: 'Xem tuổi vợ chồng có căn cứ',
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

const TRANG_THAI_MUC: Record<
  MucDanhGia,
  { nhan: string; kyHieu: string; lop: 'tot' | 'binh' | 'diu' }
> = {
  tot: { nhan: 'Hợp', kyHieu: '✓', lop: 'tot' },
  binh: { nhan: 'Bình thường', kyHieu: '–', lop: 'binh' },
  xau: { nhan: 'Chưa hợp', kyHieu: '!', lop: 'diu' },
};

const TEN_NGAN_TIEU_CHI: Record<string, string> = {
  'nap-am': 'Mệnh',
  can: 'Thiên can',
  chi: 'Địa chi',
  'cung-phi': 'Cung phi',
};

function lamDiuNhanHienThi(s: string): string {
  return s.replace(/du niên xấu/gi, 'du niên chưa hợp').replace(/\bxấu\b/gi, 'chưa hợp');
}

const DS_NAM_LUA_CHON = Array.from(
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
    metaTrang('/xem-tuoi/vo-chong', MAC_DINH_VO_CHONG),
    noiDungTheoDuongDan('/xem-tuoi/vo-chong'),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/xem-tuoi/vo-chong' },
      robots: { index: false, follow: true },
    };
  }
  return nd ? base : { ...base, robots: { index: false, follow: true } };
}

export default async function XemTuoiVoChongPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp, nd] = await Promise.all([
    thongTinTrang('/xem-tuoi/vo-chong', MAC_DINH_VO_CHONG),
    searchParams,
    noiDungTheoDuongDan('/xem-tuoi/vo-chong'),
  ]);

  const daDung = trangDaDung();
  const chongRaw = layMot(sp.chong)?.trim() ?? '';
  const voRaw = layMot(sp.vo)?.trim() ?? '';
  const coNhap = chongRaw !== '' || voRaw !== '';

  let loi: string | null = null;
  let ketQua: KetQuaVoChong | null = null;

  const chongChon = Number(chongRaw);
  const voChon = Number(voRaw);

  if (coNhap) {
    if (!chongRaw || !voRaw) {
      loi = 'Vui lòng chọn đủ năm sinh chồng và năm sinh vợ.';
    } else if (
      !Number.isInteger(chongChon) ||
      !Number.isInteger(voChon) ||
      chongChon < NAM_XEM_TUOI_TU ||
      chongChon > NAM_XEM_TUOI_DEN ||
      voChon < NAM_XEM_TUOI_TU ||
      voChon > NAM_XEM_TUOI_DEN
    ) {
      loi = `Năm sinh hợp lệ nằm trong khoảng ${NAM_XEM_TUOI_TU}–${NAM_XEM_TUOI_DEN}.`;
    } else {
      ketQua = xemTuoiVoChong(chongChon, voChon);
    }
  }

  const macDinhChong =
    Number.isInteger(chongChon) &&
    chongChon >= NAM_XEM_TUOI_TU &&
    chongChon <= NAM_XEM_TUOI_DEN
      ? chongChon
      : 1990;
  const macDinhVo =
    Number.isInteger(voChon) && voChon >= NAM_XEM_TUOI_TU && voChon <= NAM_XEM_TUOI_DEN
      ? voChon
      : 1992;

  const docNhanh = ketQua ? docNhanhXemTuoi(ketQua) : null;
  const theDocNhanh = docNhanh
    ? docNhanh.the.map((t) => ({ ...t, chiTiet: lamDiuNhanHienThi(t.chiTiet) }))
    : [];

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/xem-tuoi/vo-chong" toi>
      <div className="ck-xt-form-khung">
        <form className="ck-to-giay" action="/xem-tuoi/vo-chong" method="get">
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2>Chọn năm sinh hai người</h2>
            <HoaVanMay flipped />
          </div>

          {loi ? (
            <div className="ck-loi" role="alert">
              {loi}
            </div>
          ) : null}

          <div className="ck-xt-form-2cot">
            <label className="ck-o-con" htmlFor="ck-vc-chong">
              <span>Năm sinh chồng</span>
              <select id="ck-vc-chong" name="chong" defaultValue={macDinhChong}>
                {DS_NAM_LUA_CHON.map((item) => (
                  <option key={item.nam} value={item.nam}>
                    {item.nam} — {item.canChi}
                  </option>
                ))}
              </select>
            </label>

            <label className="ck-o-con" htmlFor="ck-vc-vo">
              <span>Năm sinh vợ</span>
              <select id="ck-vc-vo" name="vo" defaultValue={macDinhVo}>
                {DS_NAM_LUA_CHON.map((item) => (
                  <option key={item.nam} value={item.nam}>
                    {item.nam} — {item.canChi}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="ck-nut ck-nut-son ck-nut-lon">
            Đối chiếu 4 tiêu chí
          </button>

          <p className="ck-ghi-nho">
            Năm sinh theo năm âm lịch; sinh trước Tết tính năm trước.
          </p>
        </form>
      </div>

      {ketQua && docNhanh ? (
        <section className="ck-td-muc" aria-labelledby="ck-vc-ket-qua">
          <h2 id="ck-vc-ket-qua" className="ck-td-tieu">
            Kết quả đối chiếu tuổi {ketQua.chong.nam} và {ketQua.vo.nam}
          </h2>

          <DocNhanh
            cau={docNhanh.cau}
            the={theDocNhanh}
            tieuDeId="ck-xt-dn-tieu"
            luoiCot={4}
          />

          <div className="ck-xt-thanh-tong-khung" aria-label="Thanh tổng 4 tiêu chí">
            <p className="ck-xt-thanh-tom-tat">
              Thanh tổng 4 tiêu chí: <strong>{ketQua.dem.tot} hợp</strong> (✓),{' '}
              <strong>{ketQua.dem.binh} bình thường</strong> (–),{' '}
              <strong>{ketQua.dem.xau} chưa hợp</strong> (!).
            </p>
            <ol className="ck-xt-thanh-tong">
              {ketQua.tieuChi.map((tc) => {
                const ttMuc = TRANG_THAI_MUC[tc.muc];
                const tenNgan = TEN_NGAN_TIEU_CHI[tc.ma] ?? tc.ten.split(':')[0];
                return (
                  <li
                    key={tc.ma}
                    className={`ck-xt-thanh-o ck-xt-thanh-o-${ttMuc.lop}`}
                  >
                    <span className="ck-xt-thanh-ky" aria-hidden="true">
                      {ttMuc.kyHieu}
                    </span>
                    <span className="ck-xt-thanh-ten">{tenNgan}</span>
                    <span className="ck-xt-thanh-muc">{ttMuc.nhan}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="ck-xt-hai-nguoi">
            {[
              { vaiTro: 'Chồng', nguoi: ketQua.chong },
              { vaiTro: 'Vợ', nguoi: ketQua.vo },
            ].map(({ vaiTro, nguoi }) => {
              const cungObj = daDung.has('/phong-thuy/cung-phi')
                ? cungTheoTen(nguoi.cungPhi)
                : undefined;
              return (
                <article key={vaiTro} className="ck-the-du-lieu">
                  <span className="ck-nhan-nho">{vaiTro}</span>
                  <strong className="ck-gia-lon">
                    {nguoi.nam} — {nguoi.canChi}
                  </strong>
                  <p>
                    Nạp âm: <b>{nguoi.napAm}</b> (
                    <HuyHieuHanh
                      hanh={nguoi.hanh}
                      lienKet={daDung.has('/ngu-hanh')}
                    />
                    )
                  </p>
                  <p>
                    Cung phi (Bát trạch):{' '}
                    {cungObj ? (
                      <Link href={`/phong-thuy/cung-phi/${cungObj.slug}`}>
                        <b>{nguoi.cungPhi}</b>
                      </Link>
                    ) : (
                      <b>{nguoi.cungPhi}</b>
                    )}
                  </p>
                  {daDung.has('/sinh-nam') && namSinhHopLe(nguoi.nam) ? (
                    <Link href={`/sinh-nam/${nguoi.nam}`} className="ck-xt-nguoi-link">
                      Xem chi tiết sinh năm {nguoi.nam} →
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="ck-xt-tc-luoi">
            {ketQua.tieuChi.map((tc) => {
              const ttMuc = TRANG_THAI_MUC[tc.muc];
              return (
                <article
                  key={tc.ma}
                  className={`ck-xt-tc-the ck-xt-tc-the-${ttMuc.lop}`}
                >
                  <div className="ck-xt-tc-dau">
                    <h3>{tc.ten}</h3>
                    <span className={`ck-xt-tc-badge ck-xt-tc-badge-${ttMuc.lop}`}>
                      <span aria-hidden="true">{ttMuc.kyHieu}</span> {ttMuc.nhan}
                    </span>
                  </div>
                  <p>{lamDiuNhanHienThi(tc.giaiThich)}</p>
                </article>
              );
            })}
          </div>

          <p className="ck-xt-luu-y">
            Các sách và trường phái có thể khác nhau; kết quả để tham khảo.
          </p>
        </section>
      ) : null}

      <KhoiDienGiai noiDung={nd} tieuDe="Cách đọc kết quả xem tuổi vợ chồng" />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/xem-tuoi">Tổng quan Xem tuổi</Link>
          <Link href="/xem-tuoi/xong-dat">Xem tuổi xông đất</Link>
          {daDung.has('/sinh-nam') ? <Link href="/sinh-nam">Tra mệnh theo năm sinh</Link> : null}
          {daDung.has('/con-giap') ? <Link href="/con-giap">12 con giáp</Link> : null}
          {daDung.has('/ngu-hanh') ? <Link href="/ngu-hanh">Ngũ hành sinh khắc</Link> : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { CHI_HAN, HANH_SLUG } from '@/components/ck/canChiHelpers';
import { kiemTraDauVao, lapLaSoBatTu, type LaSoBatTu } from '@/lib/trang/bat-tu';
import { NGU_HANH } from '@/lib/trang/can-chi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_BAT_TU_LS = {
  title: 'Lập lá số bát tự online – tứ trụ theo tiết khí chuẩn',
  h1: 'Lập lá số bát tự online',
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
      });
    }
  }

  // Thứ tự truyền thống từ trái sang phải: Giờ, Ngày, Tháng, Năm (đọc từ phải sang trái: Năm → Tháng → Ngày → Giờ)
  const bonTru = ketQua
    ? [ketQua.tru[3], ketQua.tru[2], ketQua.tru[1], ketQua.tru[0]]
    : [];

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
                defaultValue={Number.isInteger(phutVal) && phutVal >= 0 && phutVal <= 59 ? String(phutVal) : '0'}
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
            Tính theo múi giờ Việt Nam (UTC+7); trụ năm và trụ tháng xác định theo kinh độ Mặt Trời
            (tiết khí thiên văn).
          </p>
        </form>
      </div>

      {ketQua ? (
        <>
          <section className="ck-bt-tom-tat" aria-label="Thông tin Bát tự">
            <div className="ck-bt-tom-tat-luoi">
              <div className="ck-the-du-lieu">
                <span className="ck-nhan-nho">Ngày giờ sinh (dương lịch)</span>
                <strong className="ck-gia-lon">
                  {String(ketQua.dauVao.ngay).padStart(2, '0')}/
                  {String(ketQua.dauVao.thang).padStart(2, '0')}/{ketQua.dauVao.nam}
                </strong>
                <p>
                  {String(ketQua.dauVao.gio).padStart(2, '0')}:
                  {String(ketQua.dauVao.phut).padStart(2, '0')} ·{' '}
                  {ketQua.dauVao.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}
                </p>
              </div>

              <div className="ck-the-du-lieu">
                <span className="ck-nhan-nho">Nhật chủ (Can ngày)</span>
                <strong className="ck-gia-lon">
                  {ketQua.nhatChu.can} ({ketQua.nhatChu.amDuong})
                </strong>
                <p>
                  Hành: <HuyHieuHanh hanh={ketQua.nhatChu.hanh} lienKet={daDung.has('/ngu-hanh')} />
                </p>
              </div>

              <div className="ck-the-du-lieu">
                <span className="ck-nhan-nho">Tiết khí bao quanh</span>
                <p style={{ marginTop: 4 }}>
                  Trước: <b>{ketQua.tiet.truoc.ten}</b> ({ketQua.tiet.truoc.luc})
                </p>
                <p>
                  Sau: <b>{ketQua.tiet.sau.ten}</b> ({ketQua.tiet.sau.luc})
                </p>
              </div>
            </div>
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-bt-tu-tru-tieu">
            <h2 id="ck-bt-tu-tru-tieu" className="ck-td-tieu">
              Bảng Tứ trụ (Giờ · Ngày · Tháng · Năm)
            </h2>

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
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-bt-ngu-hanh-tieu">
            <h2 id="ck-bt-ngu-hanh-tieu" className="ck-td-tieu">
              Đếm ngũ hành 8 chữ (4 can + 4 chi)
            </h2>

            <div className="ck-bt-hanh-ds">
              {NGU_HANH.map((h) => {
                const soLuong = ketQua.demNguHanh[h] ?? 0;
                const phanTram = Math.round((soLuong / 8) * 100);
                const slug = HANH_SLUG[h];
                return (
                  <div key={h} className="ck-bt-hanh-o">
                    <div className="ck-bt-hanh-dau">
                      <HuyHieuHanh hanh={h} lienKet={daDung.has('/ngu-hanh')} />
                      <span>{soLuong}/8</span>
                    </div>
                    <div className="ck-bt-hanh-thanh" aria-hidden="true">
                      <div
                        className={`ck-bt-hanh-muc ck-bt-muc-${slug}`}
                        style={{ width: `${phanTram}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {ketQua.thieuHanh.length > 0 ? (
              <p className="ck-bt-thieu-hanh">Thiếu hành: {ketQua.thieuHanh.join(', ')}.</p>
            ) : (
              <p className="ck-bt-thieu-hanh">Cả 5 hành đều có mặt trong 8 chữ.</p>
            )}
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-bt-dai-van-tieu">
            <h2 id="ck-bt-dai-van-tieu" className="ck-td-tieu">
              Đại vận 8 bước (10 năm mỗi bước)
            </h2>

            <p className="ck-bt-khoi-van">
              Khởi vận lúc {ketQua.daiVan.khoiVan.nam} tuổi {ketQua.daiVan.khoiVan.thang} tháng,
              đi {ketQua.daiVan.chieu}.
            </p>

            <div className="ck-bang-khung">
              <table className="ck-bang ck-bang-the ck-bt-dv-bang">
                <thead>
                  <tr>
                    <th>Bước</th>
                    <th>Tuổi (tuổi mụ)</th>
                    <th>Từ năm</th>
                    <th>Can chi đại vận</th>
                    <th>Hành Can / Chi</th>
                  </tr>
                </thead>
                <tbody>
                  {ketQua.daiVan.ds.map((dv) => (
                    <tr key={dv.thuTu} className={dv.dangChay ? 'ck-bt-dv-chay' : undefined}>
                      <td data-nhan="Bước">
                        <div>
                          <b>Vận {dv.thuTu}</b>
                          {dv.dangChay ? (
                            <span className="ck-bt-nhan-chay">Đang chạy</span>
                          ) : null}
                        </div>
                      </td>
                      <td data-nhan="Tuổi (mụ)">
                        {dv.tuTuoi}–{dv.tuTuoi + 9} tuổi
                      </td>
                      <td data-nhan="Năm dương">
                        {dv.tuNam}–{dv.tuNam + 9}
                      </td>
                      <td data-nhan="Can chi">
                        <b>{dv.canChi}</b>
                      </td>
                      <td data-nhan="Hành Can / Chi">
                        <div>
                          <HuyHieuHanh hanh={dv.hanhCan} />{' '}
                          <HuyHieuHanh hanh={dv.hanhChi} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <details className="ck-bt-quy-uoc">
              <summary>Cách tính</summary>
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

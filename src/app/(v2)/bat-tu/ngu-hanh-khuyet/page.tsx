import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import { DocNhanh, type TheDocNhanhItem } from '@/components/ck/truc-quan';
import { kiemTraDauVao, lapLaSoBatTu, type LaSoBatTu } from '@/lib/trang/bat-tu';
import { NGUON_BAT_TU } from '@/lib/trang/bat-tu-truc-quan';
import type { Hanh } from '@/lib/trang/can-chi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  NAM_HANH,
  TRICH_KHONG_VOI_LUAN,
  TRICH_VUONG_TUONG,
  baCachDem,
  type BaCachDem,
  type TrangThaiMua,
} from '@/lib/trang/ngu-hanh-khuyet';
import { DIA_CHI, chiCanhGio } from '@/lib/tuvi-v2/am-lich';
import './ngu-hanh-khuyet.css';

export const dynamic = 'force-dynamic';

const MAC_DINH_KHUYET = {
  title: 'Mệnh khuyết hành gì? Đọc ngũ hành vượng – khuyết trong bát tự',
  h1: 'Ngũ hành khuyết trong bát tự',
};

const PHU_TRANG =
  'Đặt ba cách đếm ngũ hành cạnh nhau trên cùng một lá số bát tự để thấy kết quả thay đổi theo cách đếm.';

const MAU_MAC_DINH = {
  ngay: 10,
  thang: 4,
  nam: 1996,
  gio: 10,
  phut: 0,
  gioiTinh: 'nam' as const,
};

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function kiemCoThamSo(sp: Record<string, string | string[] | undefined>): boolean {
  return ['ngay', 'thang', 'nam', 'gio', 'phut', 'gioiTinh'].some((k) => {
    const v = layMot(sp[k]);
    return typeof v === 'string' && v.trim() !== '';
  });
}

function taoCauSoSanh(kq: BaCachDem): string {
  const t1 = kq.cach1.thieu;
  const t2 = kq.cach2.thieu;

  if (t1.length === 0 && t2.length === 0) {
    return 'Hai cách đếm đều đủ năm hành.';
  }

  if (t2.length === 0) {
    if (t1.length === 1) {
      const h = t1[0];
      return `Theo cách 1 lá số thiếu ${h}; thêm tàng can thì ${h} có ${kq.cach2.dem[h]} chữ.`;
    }
    const phanBo = t1.map((h) => `${h} có ${kq.cach2.dem[h]} chữ`).join(', ');
    return `Theo cách 1 lá số thiếu ${t1.join(', ')}; thêm tàng can thì ${phanBo}.`;
  }

  const riengCach1 = t1.filter((h) => !t2.includes(h));
  const goc = `Cả hai cách đều không thấy ${t2.join(', ')}.`;
  if (riengCach1.length === 0) return goc;
  const boSung = riengCach1.map((h) => `${h} có ${kq.cach2.dem[h]} chữ`).join(', ');
  return `${goc} Riêng ${riengCach1.join(', ')} thiếu ở cách 1 nhưng thêm tàng can thì ${boSung}.`;
}

function lopTrangThai(tt: TrangThaiMua): string {
  if (tt === 'Vượng') return 'ck-nhk-tt-vuong';
  if (tt === 'Tướng') return 'ck-nhk-tt-tuong';
  if (tt === 'Tù') return 'ck-nhk-tt-tu';
  if (tt === 'Tử') return 'ck-nhk-tt-tuluc';
  return '';
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/bat-tu/ngu-hanh-khuyet', MAC_DINH_KHUYET),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/bat-tu/ngu-hanh-khuyet' },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function BatTuNguHanhKhuyetPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/bat-tu/ngu-hanh-khuyet', MAC_DINH_KHUYET),
    searchParams,
  ]);
  const daDung = trangDaDung();
  const coThamSo = kiemCoThamSo(sp);

  const ngayRaw = layMot(sp.ngay)?.trim();
  const thangRaw = layMot(sp.thang)?.trim();
  const namRaw = layMot(sp.nam)?.trim();
  const gioRaw = layMot(sp.gio)?.trim();
  const phutRaw = layMot(sp.phut)?.trim();
  const gtRaw = layMot(sp.gioiTinh)?.trim();

  const ngaySo = ngayRaw && /^\d+$/.test(ngayRaw) ? Number(ngayRaw) : NaN;
  const thangSo = thangRaw && /^\d+$/.test(thangRaw) ? Number(thangRaw) : NaN;
  const namSo = namRaw && /^\d+$/.test(namRaw) ? Number(namRaw) : NaN;
  const gioSo = gioRaw && /^\d+$/.test(gioRaw) ? Number(gioRaw) : NaN;
  const phutSo =
    phutRaw === undefined || phutRaw === ''
      ? 0
      : /^\d+$/.test(phutRaw)
        ? Number(phutRaw)
        : NaN;
  const gtVal: 'nam' | 'nu' | undefined =
    gtRaw === 'nu' ? 'nu' : gtRaw === 'nam' ? 'nam' : undefined;

  let loi: string | null = null;
  let laSo: LaSoBatTu | null = null;
  const laMau = !coThamSo;

  if (laMau) {
    laSo = lapLaSoBatTu(MAU_MAC_DINH);
  } else {
    const dauVao = {
      ngay: ngaySo,
      thang: thangSo,
      nam: namSo,
      gio: gioSo,
      phut: phutSo,
      gioiTinh: gtVal,
    };
    const thongBaoLoi = kiemTraDauVao(dauVao);
    if (thongBaoLoi) {
      loi = thongBaoLoi;
    } else {
      laSo = lapLaSoBatTu({
        ngay: ngaySo,
        thang: thangSo,
        nam: namSo,
        gio: gioSo,
        phut: phutSo,
        gioiTinh: gtVal!,
      });
    }
  }

  const ketQua = laSo ? baCachDem(laSo) : null;
  const dauVaoForm = laSo
    ? laSo.dauVao
    : {
        ngay: Number.isInteger(ngaySo) && ngaySo >= 1 && ngaySo <= 31 ? ngaySo : MAU_MAC_DINH.ngay,
        thang:
          Number.isInteger(thangSo) && thangSo >= 1 && thangSo <= 12
            ? thangSo
            : MAU_MAC_DINH.thang,
        nam:
          Number.isInteger(namSo) && namSo >= 1900 && namSo <= 2100 ? namSo : MAU_MAC_DINH.nam,
        gio: Number.isInteger(gioSo) && gioSo >= 0 && gioSo <= 23 ? gioSo : MAU_MAC_DINH.gio,
        phut:
          Number.isInteger(phutSo) && phutSo >= 0 && phutSo <= 59 ? phutSo : MAU_MAC_DINH.phut,
        gioiTinh: gtVal ?? MAU_MAC_DINH.gioiTinh,
      };

  const queryLaSo = new URLSearchParams({
    ngay: String(dauVaoForm.ngay),
    thang: String(dauVaoForm.thang),
    nam: String(dauVaoForm.nam),
    gio: String(dauVaoForm.gio),
    phut: String(dauVaoForm.phut),
    gioiTinh: dauVaoForm.gioiTinh,
  }).toString();

  const hrefLapLaSo = `/bat-tu/lap-la-so?${queryLaSo}`;

  const theDocNhanh: TheDocNhanhItem[] = ketQua
    ? [
        {
          ma: 'cach-1',
          nhan: 'Cách 1: đếm 8 chữ',
          giaTri: ketQua.cach1.thieu.length
            ? `Thiếu ${ketQua.cach1.thieu.join(', ')}`
            : 'Không thiếu hành nào',
          muc: ketQua.cach1.thieu.length ? 'diu' : 'tot',
          chiTiet: NAM_HANH.map((h) => `${h} ${ketQua.cach1.dem[h]}`).join(' · '),
        },
        {
          ma: 'cach-2',
          nhan: 'Cách 2: thêm tàng can',
          giaTri: ketQua.cach2.thieu.length
            ? `Thiếu ${ketQua.cach2.thieu.join(', ')}`
            : 'Không thiếu hành nào',
          muc: ketQua.cach2.thieu.length ? 'diu' : 'tot',
          chiTiet: NAM_HANH.map((h) => `${h} ${ketQua.cach2.dem[h]}`).join(' · '),
        },
        {
          ma: 'cach-3',
          nhan: 'Cách 3: xét tháng sinh',
          giaTri: `${ketQua.cach3.hanhVuong} vượng`,
          hanh: ketQua.cach3.hanhVuong,
          chiTiet: `Sinh tháng ${ketQua.cach3.chiThang}; ${NAM_HANH.map((h) => `${h} ${ketQua.cach3.trangThai[h].toLowerCase()}`).join(', ')}.`,
        },
      ]
    : [];

  const maxDem1 = ketQua ? Math.max(...NAM_HANH.map((h) => ketQua.cach1.dem[h]), 1) : 1;
  const maxDem2 = ketQua ? Math.max(...NAM_HANH.map((h) => ketQua.cach2.dem[h]), 1) : 1;

  const nguonTamMenh = NGUON_BAT_TU.tamMenh;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tt.h1,
    description: PHU_TRANG,
    inLanguage: 'vi',
    url: 'https://xemboi.vn/bat-tu/ngu-hanh-khuyet',
  };

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={PHU_TRANG}
      duongDan="/bat-tu/ngu-hanh-khuyet"
      tenCuoi="Ngũ hành khuyết"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* 1. Đọc nhanh */}
      <DocNhanh
        tieuDe="Đọc nhanh"
        tieuDeId="ck-nhk-dn"
        luoiCot={3}
        cau={
          '"Ngũ hành khuyết" là khi đếm các chữ trong lá số bát tự mà không thấy một hành nào đó. Nhưng đếm thế nào thì mỗi nơi một kiểu. Trang này đếm ba cách trên cùng một lá số để anh chị thấy kết quả khác nhau ra sao.'
        }
        the={theDocNhanh}
      />

      {/* 2. Form (GET) */}
      <section className="ck-nhk-muc" aria-labelledby="ck-nhk-form-tieu">
        <form action="/bat-tu/ngu-hanh-khuyet" method="get" className="ck-nhk-form">
          <h2 id="ck-nhk-form-tieu" className="ck-nhk-form-tieu">
            Chọn ngày giờ sinh để đếm theo ba cách
          </h2>

          {loi ? (
            <div className="ck-loi" role="alert">
              {loi}
            </div>
          ) : null}

          <div className="ck-nhk-form-luoi">
            <div className="ck-nhk-truong">
              <label htmlFor="ck-nhk-ngay">Ngày</label>
              <select id="ck-nhk-ngay" name="ngay" defaultValue={String(dauVaoForm.ngay)}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="ck-nhk-truong">
              <label htmlFor="ck-nhk-thang">Tháng</label>
              <select id="ck-nhk-thang" name="thang" defaultValue={String(dauVaoForm.thang)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="ck-nhk-truong">
              <label htmlFor="ck-nhk-nam">Năm</label>
              <input
                id="ck-nhk-nam"
                name="nam"
                type="number"
                min={1900}
                max={2100}
                inputMode="numeric"
                defaultValue={String(dauVaoForm.nam)}
                required
              />
            </div>

            <div className="ck-nhk-truong">
              <label htmlFor="ck-nhk-gio">Giờ</label>
              <select id="ck-nhk-gio" name="gio" defaultValue={String(dauVaoForm.gio)}>
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')} giờ ({DIA_CHI[chiCanhGio(h)]})
                  </option>
                ))}
              </select>
            </div>

            <div className="ck-nhk-truong">
              <label htmlFor="ck-nhk-gt">Giới tính</label>
              <select id="ck-nhk-gt" name="gioiTinh" defaultValue={dauVaoForm.gioiTinh}>
                <option value="nam">Nam</option>
                <option value="nu">Nữ</option>
              </select>
            </div>
          </div>

          <div className="ck-nhk-form-hanh-dong">
            <button type="submit" className="ck-nut ck-nut-son ck-nhk-nut">
              Đếm
            </button>
            <Link href={hrefLapLaSo} className="ck-nhk-link-phu">
              Xem đủ lá số
            </Link>
          </div>
        </form>
      </section>

      {laSo && ketQua ? (
        <>
          {/* 3. Bốn trụ */}
          <section className="ck-nhk-muc" aria-labelledby="ck-nhk-tu-tru-tieu">
            <h2 id="ck-nhk-tu-tru-tieu" className="ck-nhk-muc-tieu">
              Bốn trụ của lá số
            </h2>
            <div className="ck-nhk-dau-la-so">
              {laMau ? <span className="ck-nhk-nhan-mau">Lá số mẫu</span> : null}
              <span className="ck-nhk-thong-tin-sinh">
                Sinh {String(laSo.dauVao.ngay).padStart(2, '0')}/
                {String(laSo.dauVao.thang).padStart(2, '0')}/{laSo.dauVao.nam} ·{' '}
                {String(laSo.dauVao.gio).padStart(2, '0')}:
                {String(laSo.dauVao.phut).padStart(2, '0')} ·{' '}
                {laSo.dauVao.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}
              </span>
            </div>

            <div className="ck-nhk-tu-tru">
              {laSo.tru.map((t) => (
                <article key={t.ten} className="ck-nhk-tru-the">
                  <div className="ck-nhk-tru-ten">Trụ {t.ten}</div>
                  <div className="ck-nhk-tru-dong">
                    <span className="ck-nhk-tru-chu">{t.can}</span>
                    <HuyHieuHanh hanh={t.hanhCan} />
                  </div>
                  <div className="ck-nhk-tru-dong">
                    <span className="ck-nhk-tru-chu">{t.chi}</span>
                    <HuyHieuHanh hanh={t.hanhChi} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 4. Ba cách đếm, đặt cạnh nhau */}
          <section className="ck-nhk-muc" aria-labelledby="ck-nhk-ba-cach-tieu">
            <h2 id="ck-nhk-ba-cach-tieu" className="ck-nhk-muc-tieu">
              Ba cách đếm trên cùng một lá số
            </h2>

            <div className="ck-nhk-ba-cach">
              {/* Cột 1 */}
              <article className="ck-nhk-cach-the">
                <h3>Cách 1: đếm 8 chữ</h3>
                <p className="ck-nhk-cach-mota">
                  Đếm 4 can và 4 chi, mỗi chữ một lần. Đây là cách phần lớn các trang đang dùng.
                </p>

                <ul className="ck-nhk-thanh-ds" aria-label="Số chữ ngũ hành theo cách 1">
                  {NAM_HANH.map((h: Hanh) => {
                    const n = ketQua.cach1.dem[h];
                    const slug = HANH_SLUG[h];
                    return (
                      <li key={h} className="ck-nhk-thanh-hang">
                        <HuyHieuHanh hanh={h} />
                        {n === 0 ? (
                          <div className="ck-nhk-thanh-trong" aria-hidden="true" />
                        ) : (
                          <div className="ck-nhk-thanh-nen" aria-hidden="true">
                            <div
                              className={`ck-nhk-thanh-day ck-bt-muc-${slug}`}
                              style={
                                { '--ck-nhk-ty-le': `${(n / maxDem1) * 100}%` } as CSSProperties
                              }
                            />
                          </div>
                        )}
                        <strong className={`ck-nhk-so${n === 0 ? ' ck-nhk-so-khong' : ''}`}>
                          {n}
                        </strong>
                      </li>
                    );
                  })}
                </ul>

                {ketQua.cach1.thieu.length > 0 ? (
                  <p className="ck-nhk-ket ck-nhk-ket-thieu">
                    Thiếu: <strong>{ketQua.cach1.thieu.join(', ')}</strong>
                  </p>
                ) : (
                  <p className="ck-nhk-ket ck-nhk-ket-du">Không thiếu hành nào</p>
                )}
              </article>

              {/* Cột 2 */}
              <article className="ck-nhk-cach-the">
                <h3>Cách 2: thêm tàng can</h3>
                <p className="ck-nhk-cach-mota">
                  Đếm 4 can, rồi thay mỗi chi bằng các can ẩn trong chi (tàng can), mỗi can tính
                  một lần, chưa chia nặng nhẹ.
                </p>

                <ul className="ck-nhk-thanh-ds" aria-label="Số chữ ngũ hành theo cách 2">
                  {NAM_HANH.map((h: Hanh) => {
                    const n = ketQua.cach2.dem[h];
                    const slug = HANH_SLUG[h];
                    return (
                      <li key={h} className="ck-nhk-thanh-hang">
                        <HuyHieuHanh hanh={h} />
                        {n === 0 ? (
                          <div className="ck-nhk-thanh-trong" aria-hidden="true" />
                        ) : (
                          <div className="ck-nhk-thanh-nen" aria-hidden="true">
                            <div
                              className={`ck-nhk-thanh-day ck-bt-muc-${slug}`}
                              style={
                                { '--ck-nhk-ty-le': `${(n / maxDem2) * 100}%` } as CSSProperties
                              }
                            />
                          </div>
                        )}
                        <strong className={`ck-nhk-so${n === 0 ? ' ck-nhk-so-khong' : ''}`}>
                          {n}
                        </strong>
                      </li>
                    );
                  })}
                </ul>

                {ketQua.cach2.thieu.length > 0 ? (
                  <p className="ck-nhk-ket ck-nhk-ket-thieu">
                    Thiếu: <strong>{ketQua.cach2.thieu.join(', ')}</strong>
                  </p>
                ) : (
                  <p className="ck-nhk-ket ck-nhk-ket-du">Không thiếu hành nào</p>
                )}

                <details className="ck-nhk-tang-gap">
                  <summary>Tàng can từng chi</summary>
                  <ul className="ck-nhk-tang-ds">
                    {ketQua.cach2.chiTiet.map((ct) => (
                      <li key={ct.tru}>
                        <strong>
                          Trụ {ct.tru} ({ct.chi}):
                        </strong>{' '}
                        {ct.tangCan.map((x) => `${x.can} (${x.hanh})`).join(', ')}
                      </li>
                    ))}
                  </ul>
                </details>
              </article>

              {/* Cột 3 */}
              <article className="ck-nhk-cach-the">
                <h3>Cách 3: xét tháng sinh</h3>
                <p className="ck-nhk-cach-mota">
                  Sách xét hành nào đang vượng theo tháng sinh, rồi xếp năm hành vào vượng, tướng,
                  hưu, tù, tử.
                </p>

                <p className="ck-nhk-thang-tin">
                  Tháng {ketQua.cach3.chiThang} · {ketQua.cach3.hanhVuong} vượng
                </p>

                <ul className="ck-nhk-trang-thai-ds" aria-label="Trạng thái năm hành theo tháng sinh">
                  {NAM_HANH.map((h: Hanh) => {
                    const ttHanh = ketQua.cach3.trangThai[h];
                    return (
                      <li key={h} className={`ck-nhk-trang-thai-the ${lopTrangThai(ttHanh)}`}>
                        <HuyHieuHanh hanh={h} />
                        <span className="ck-nhk-trang-thai-chu">{ttHanh}</span>
                      </li>
                    );
                  })}
                </ul>

                {ketQua.cach3.theoMua ? (
                  <p className="ck-nhk-theo-mua">
                    Tháng {ketQua.cach3.chiThang} xếp theo mùa; sách chỉ nêu riêng tháng Sáu (Mùi)
                    cho Thổ.
                  </p>
                ) : null}
              </article>
            </div>
          </section>

          {/* 5. Câu so sánh */}
          <section className="ck-nhk-muc" aria-labelledby="ck-nhk-ss-tieu">
            <div className="ck-nhk-so-sanh">
              <h2 id="ck-nhk-ss-tieu">Đối chiếu kết quả</h2>
              <p>{taoCauSoSanh(ketQua)}</p>
              <p>Hành ít hay vắng trong lá số chưa nói lên điều tốt hay xấu.</p>
            </div>
          </section>
        </>
      ) : null}

      {/* 6. Sách nói gì */}
      <section className="ck-nhk-muc" aria-labelledby="ck-nhk-sach-tieu">
        <h2 id="ck-nhk-sach-tieu" className="ck-nhk-muc-tieu">
          Sách nói gì
        </h2>
        <div className="ck-nhk-sach-ds">
          {[TRICH_VUONG_TUONG, TRICH_KHONG_VOI_LUAN].map((tr) => (
            <figure key={tr.doanId} className="ck-tq-trich">
              <span className="ck-tq-trich-nhan">Sách ghi</span>
              <blockquote className="ck-tq-trich-dich">{tr.dich}</blockquote>
              <figcaption className="ck-tq-trich-nguon">
                <em>{nguonTamMenh.tenHanViet}</em>, {nguonTamMenh.tacGia}, {nguonTamMenh.nienDai},{' '}
                {tr.viTriViet.replace(/^Tam mệnh thông hội,\s*/, '')} · đoạn {tr.doanId}.{' '}
                <a href={nguonTamMenh.url} target="_blank" rel="noopener noreferrer nofollow">
                  {nguonTamMenh.ghiCong}
                </a>
                <span className="ck-tq-trich-dich-gia">Dịch nghĩa: xemboi</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 7. Các trang khác thường viết gì */}
      <section className="ck-nhk-muc" aria-labelledby="ck-nhk-khac-tieu">
        <div className="ck-nhk-khac">
          <h2 id="ck-nhk-khac-tieu">Các trang khác thường viết gì</h2>
          <p>
            Nhiều trang tính khuyết theo một cách đếm duy nhất, rồi gợi ý màu sắc, đồ vật, đá để
            &quot;bổ&quot; hành thiếu. Hai câu sách trích ở trên không đếm số chữ: sách xét hành
            nào vượng, hành nào suy theo tháng sinh, và dặn thấy vượng chưa chắc là tốt, thấy suy
            chưa chắc là xấu.
          </p>
        </div>
      </section>

      {/* 8. Liên kết */}
      <nav className="ck-nhk-lien-quan" aria-label="Liên kết liên quan">
        <h2>Tra cứu liên quan</h2>
        <div className="ck-nhk-lien-quan-ds">
          <Link href={hrefLapLaSo}>Lập lá số bát tự</Link>
          <Link href="/bat-tu">Tổng quan Bát tự</Link>
          {daDung.has('/ngu-hanh') ? <Link href="/ngu-hanh">Ngũ hành sinh khắc</Link> : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

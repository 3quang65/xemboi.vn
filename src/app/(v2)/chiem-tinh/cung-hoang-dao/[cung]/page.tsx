import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  CUNG_HOANG_DAO,
  cungCungTamHop,
  cungDoi,
  cungTheoSlug,
  duongDanCung,
  khoangCungTrongNam,
  khoangNgayVaoCung,
  mocVaoCung,
  nhaCuaHanhTinh,
  sangGioVN,
  tamHopCua,
  trichLoai,
  vietGioVN,
} from '@/lib/trang/chiem-tinh';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  MAU_SEO_CUNG,
  formatKhoangNamNay,
  lamSachMetaChiemTinh,
  lamSachThongTinChiemTinh,
  macDinhCung,
  nhanAmDuong,
  nhanHanhTinh,
  nhanLoai,
  serializeJsonLd,
  taoSchemaDefinedTermCung,
  taoSchemaWebPage,
  thamSoSeoCung,
  trichChoHam,
  vietNgayThang,
} from '../../ChiemTinhHelpers';
import {
  KhoiGhiChuTinhCach,
  KhoiNguonVaGioiHan,
  Thanh12Cung,
  TrichTetrabiblos,
  Vong12CungSvg,
} from '../../ChiemTinhUi';

export const revalidate = 3600;

export function generateStaticParams() {
  return CUNG_HOANG_DAO.map((c) => ({ cung: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cung: string }>;
}): Promise<Metadata> {
  const { cung } = await params;
  const c = cungTheoSlug(cung);
  if (!c) notFound();

  const namNay = ngayHienTaiVN().nam;
  const duongDan = duongDanCung(c);
  return lamSachMetaChiemTinh(
    await metaTrang(
      duongDan,
      macDinhCung(c, formatKhoangNamNay(c.thu, namNay)),
      MAU_SEO_CUNG,
      thamSoSeoCung(c, namNay),
    ),
  );
}

export default async function ChiTietCungHoangDaoPage({
  params,
}: {
  params: Promise<{ cung: string }>;
}) {
  const { cung } = await params;
  const c = cungTheoSlug(cung);
  if (!c) notFound();

  const namNay = ngayHienTaiVN().nam;
  const duongDan = duongDanCung(c);
  const tt = lamSachThongTinChiemTinh(
    await thongTinTrang(
      duongDan,
      macDinhCung(c, formatKhoangNamNay(c.thu, namNay)),
      MAU_SEO_CUNG,
      thamSoSeoCung(c, namNay),
    ),
  );
  const daDung = trangDaDung();

  const khoangNay = khoangCungTrongNam(c.thu, namNay);
  const khoangSau = khoangCungTrongNam(c.thu, namNay + 1);
  const bang11Nam = Array.from({ length: 11 }, (_, idx) => {
    const nam = namNay - 5 + idx;
    return { nam, gioVao: sangGioVN(mocVaoCung(nam)[c.thu]) };
  });
  const khoang100 = khoangNgayVaoCung(c.thu);

  const cungCungNha = nhaCuaHanhTinh(c.chuNha).filter((x) => x.slug !== c.slug);
  const tamHop = tamHopCua(c);
  const cungTamHop = cungCungTamHop(c);
  const doi = cungDoi(c);

  const daInTrichVuong = Boolean(c.vuong && c.trichVuong);
  const trichHam = c.ham ? trichChoHam(c.ham) ?? c.trichVuong : null;
  const hienTrichHam =
    Boolean(trichHam) && (!daInTrichVuong || trichHam!.vi !== c.trichVuong?.vi);

  const schemaTerm = taoSchemaDefinedTermCung(c, tt.canonical, tt.description);
  const schemaWebPage = taoSchemaWebPage(tt);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={duongDan}
      tenCuoi={`Cung ${c.ten}`}
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaTerm) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaWebPage) }}
      />

      {/* 1. Đầu trang */}
      <section className="ck-ct-dau-the ck-ct-dau-the-co-vong" aria-label={`Tổng quan Cung ${c.ten}`}>
        <div className="ck-ct-dau-cot">
          <div className="ck-ct-dau-trai">
            <span className="ck-ct-ky-trien" aria-hidden="true">
              {c.kyHieu}
            </span>
            <div>
              <h2 className="ck-ct-dau-ten">Cung {c.ten}</h2>
              {c.tenKhac.length > 0 ? (
                <p className="ck-ct-dau-phu">
                  Tên khác: <strong>{c.tenKhac.join(', ')}</strong>
                </p>
              ) : null}
              <p className="ck-ct-dau-phu">
                Từ <strong>{c.tuDo}°</strong> đến <strong>{c.tuDo + 30}°</strong> kinh độ hoàng
                đạo
              </p>
            </div>
          </div>
          <Link
            href="/chiem-tinh/cung-hoang-dao"
            className="ck-nut ck-nut-son ck-ct-nut-chinh"
          >
            Tra cung ngày sinh
          </Link>
        </div>

        <Vong12CungSvg namNay={namNay} cungChon={c.slug} nho />
      </section>

      {/* 2. Ngày Mặt Trời ở cung */}
      <section className="ck-td-muc" aria-labelledby="ck-ct-ngay-o-cung">
        <h2 id="ck-ct-ngay-o-cung" className="ck-td-tieu">
          Ngày Mặt Trời ở cung {c.ten}
        </h2>

        <div className="ck-ct-hai-nam">
          {[
            { nam: namNay, nhan: 'Năm nay', kq: khoangNay },
            { nam: namNay + 1, nhan: 'Năm sau', kq: khoangSau },
          ].map(({ nam, nhan, kq }) => (
            <div key={nam} className="ck-ct-nam-the">
              <h3>
                {nhan} ({nam})
              </h3>
              <p>
                Từ <strong>{vietGioVN(kq.batDau)}</strong> tới{' '}
                <strong>{vietGioVN(kq.ketThuc)}</strong> (giờ Việt Nam).
              </p>
            </div>
          ))}
        </div>

        <div className="ck-ct-bang-boc">
          <table className="ck-ct-bang">
            <thead>
              <tr>
                <th scope="col">Năm</th>
                <th scope="col">Giờ Mặt Trời vào cung {c.ten} (giờ VN)</th>
              </tr>
            </thead>
            <tbody>
              {bang11Nam.map((dong) => (
                <tr
                  key={dong.nam}
                  className={dong.nam === namNay ? 'ck-ct-dong-hien-tai' : undefined}
                >
                  <th scope="row">
                    {dong.nam}
                    {dong.nam === namNay ? ' (năm nay)' : ''}
                  </th>
                  <td>{vietGioVN(dong.gioVao)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="ck-ct-ghi-chu-xe-dich">
          Trong các năm {khoang100.tu}–{khoang100.den}, Mặt Trời vào cung {c.ten} sớm nhất ngày{' '}
          <strong>{vietNgayThang(khoang100.som)}</strong>, muộn nhất ngày{' '}
          <strong>{vietNgayThang(khoang100.muon)}</strong>.
        </p>

        <div className="ck-ct-hanh-dong-dong">
          <Link href="/chiem-tinh/cung-hoang-dao" className="ck-nut ck-nut-vien">
            Mở công cụ tra cung theo ngày giờ sinh →
          </Link>
        </div>
      </section>

      {/* 3. Theo Tetrabiblos */}
      <section className="ck-td-muc" aria-labelledby="ck-ct-tetrabiblos">
        <h2 id="ck-ct-tetrabiblos" className="ck-td-tieu">
          Theo Tetrabiblos
        </h2>

        <div className="ck-ct-bang-boc">
          <table className="ck-ct-bang ck-ct-bang-the ck-ct-thuoc-tinh">
            <tbody>
              <tr>
                <th scope="row" data-nhan="Nhóm">
                  Nhóm
                </th>
                <td data-nhan="Chi tiết">
                  <div>
                    <strong>{nhanLoai(c.loai)}</strong>
                    <TrichTetrabiblos trich={trichLoai(c.loai)} />
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" data-nhan="Dương / Âm">
                  Dương / Âm
                </th>
                <td data-nhan="Chi tiết">
                  <div>
                    <strong>{nhanAmDuong(c.duong)}</strong>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" data-nhan="Chủ nhà">
                  Chủ nhà
                </th>
                <td data-nhan="Chi tiết">
                  <div>
                    <p className="ck-ct-nhom-meta">
                      Chủ nhà: <strong>{nhanHanhTinh(c.chuNha)}</strong>
                      {cungCungNha.length > 0 ? (
                        <>
                          {' '}
                          (cùng hành tinh chủ nhà với{' '}
                          {cungCungNha.map((x, idx) => (
                            <span key={x.slug}>
                              {idx > 0 ? ', ' : ''}
                              <Link href={duongDanCung(x)}>{x.ten}</Link>
                            </span>
                          ))}
                          )
                        </>
                      ) : null}
                    </p>
                    <TrichTetrabiblos trich={c.trichNha} />
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" data-nhan="Tam hợp">
                  Tam hợp
                </th>
                <td data-nhan="Chi tiết">
                  <div>
                    <p className="ck-ct-nhom-meta">
                      <strong>Tam hợp thứ {tamHop.thu}</strong> · Chủ ban ngày:{' '}
                      <strong>{nhanHanhTinh(tamHop.chuNgay)}</strong> · Chủ ban đêm:{' '}
                      <strong>{nhanHanhTinh(tamHop.chuDem)}</strong> · Phương:{' '}
                      <strong>{tamHop.phuong}</strong>
                    </p>
                    <div className="ck-ct-chip-ds">
                      {cungTamHop.map((x) =>
                        x.slug === c.slug ? (
                          <span
                            key={x.slug}
                            className="ck-ct-chip ck-ct-chip-hien-tai"
                          >
                            <span className="ck-ct-ky" aria-hidden="true">
                              {x.kyHieu}
                            </span>
                            <span>{x.ten}</span>
                          </span>
                        ) : (
                          <Link
                            key={x.slug}
                            href={duongDanCung(x)}
                            className="ck-ct-chip"
                          >
                            <span className="ck-ct-ky" aria-hidden="true">
                              {x.kyHieu}
                            </span>
                            <span>{x.ten}</span>
                          </Link>
                        ),
                      )}
                    </div>
                    <TrichTetrabiblos trich={tamHop.trich} />
                  </div>
                </td>
              </tr>

              {c.vuong || c.ham ? (
                <tr>
                  <th scope="row" data-nhan="Vượng / Hãm">
                    Vượng / Hãm
                  </th>
                  <td data-nhan="Chi tiết">
                    <div>
                      {c.vuong ? (
                        <div className="ck-ct-muc-nho">
                          <p className="ck-ct-nhom-meta">
                            Vượng: Cung vượng của{' '}
                            <strong>{nhanHanhTinh(c.vuong)}</strong>
                          </p>
                          {c.trichVuong ? (
                            <TrichTetrabiblos trich={c.trichVuong} />
                          ) : null}
                        </div>
                      ) : null}

                      {c.ham ? (
                        <div className="ck-ct-muc-nho">
                          <p className="ck-ct-nhom-meta">
                            Hãm: Cung hãm của{' '}
                            <strong>{nhanHanhTinh(c.ham)}</strong>
                          </p>
                          {hienTrichHam && trichHam ? (
                            <TrichTetrabiblos trich={trichHam} />
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ) : null}

              <tr>
                <th scope="row" data-nhan="Cung đối">
                  Cung đối
                </th>
                <td data-nhan="Chi tiết">
                  <div>
                    <Link href={duongDanCung(doi)} className="ck-ct-chip">
                      <span className="ck-ct-ky" aria-hidden="true">
                        {doi.kyHieu}
                      </span>
                      <span>Cung {doi.ten}</span>
                    </Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Ghi chú tính cách */}
      <KhoiGhiChuTinhCach />

      {/* 5. Thanh 12 cung chuyển nhanh & liên kết */}
      <section className="ck-td-muc" aria-labelledby="ck-ct-thanh-12-tieu">
        <h2 id="ck-ct-thanh-12-tieu" className="ck-td-tieu">
          Chuyển nhanh 12 cung hoàng đạo
        </h2>
        <Thanh12Cung hienTai={c.slug} />
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/chiem-tinh">Tổng quan Chiêm tinh</Link>
          <Link href="/chiem-tinh/cung-hoang-dao">Bảng 12 cung và tra cung</Link>
        </div>
      </nav>

      {/* 6. Nguồn và giới hạn */}
      <KhoiNguonVaGioiHan daDung={daDung} />
    </KhungTrang>
  );
}

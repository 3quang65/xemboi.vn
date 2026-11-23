import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  DS_TINH,
  DUONG_DAN_BAN_DO,
  GHI_CHU_KHONG_GIO,
  GHI_CHU_NGOAI,
  GHI_CHU_NHA,
  GHI_CHU_NOI_SINH,
  GHI_CHU_TINH,
  LECH_CHON,
  NGUON_BAN_DO,
  TEN_PHAM_VI,
  TRICH_GOC,
  TRICH_THIEN_THE,
  lapBanDo,
  ngayHopLe,
  nhanLech,
  tinhTheoMa,
  vietViTri,
  type BanDoSao,
  type ViTriCung,
} from '@/lib/trang/ban-do-sao';
import {
  duongDanCung,
  sangGioVN,
  type HanhTinh,
} from '@/lib/trang/chiem-tinh';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { docNgay, isoNgay, vietNgay } from '@/lib/trang/than-so-hoc';
import {
  GOC_SITE,
  MAC_DINH_BAN_DO_SAO,
  docGio,
  kiemCoThamSo,
  kyHieuChu,
  lamSachMetaChiemTinh,
  lamSachThongTinChiemTinh,
  layMot,
  pad2,
  serializeJsonLd,
  taoSchemaWebApplication,
  type SearchParamsInput,
} from '../ChiemTinhHelpers';
import {
  KhoiGhiChuHoangDao,
  KhoiGhiChuTinhCach,
  KhoiNguonVaGioiHan,
  TrichTetrabiblos,
} from '../ChiemTinhUi';
import VongBanDoSaoSvg from './VongBanDoSaoSvg';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, baseRaw] = await Promise.all([
    searchParams,
    metaTrang(DUONG_DAN_BAN_DO, MAC_DINH_BAN_DO_SAO),
  ]);
  const base = lamSachMetaChiemTinh(baseRaw);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}${DUONG_DAN_BAN_DO}` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

function ViTriLienKet({ p }: { p: ViTriCung }) {
  const chuoi = vietViTri(p);
  const phanDo = chuoi.slice(0, chuoi.length - p.cung.ten.length);
  return (
    <>
      {phanDo}
      <Link href={duongDanCung(p.cung)}>{p.cung.ten}</Link>
    </>
  );
}

export default async function BanDoSaoPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [ttRaw, sp] = await Promise.all([
    thongTinTrang(DUONG_DAN_BAN_DO, MAC_DINH_BAN_DO_SAO),
    searchParams,
  ]);
  const tt = lamSachThongTinChiemTinh(ttRaw);
  const daDung = trangDaDung();

  const ngayRaw = layMot(sp.ngay)?.trim() ?? '';
  const gioRaw = layMot(sp.gio)?.trim() ?? '';
  const tinhRaw = layMot(sp.tinh)?.trim() ?? '';
  const lechRaw = layMot(sp.lech)?.trim() ?? '';

  const canhBaoThamSo: string[] = [];
  const loiList: string[] = [];

  const haNoiMacDinh = tinhTheoMa('ha-noi') ?? DS_TINH[0];
  let tinhChon = haNoiMacDinh;
  if (tinhRaw) {
    const timTinh = tinhTheoMa(tinhRaw);
    if (timTinh) {
      tinhChon = timTinh;
    } else {
      canhBaoThamSo.push(
        'Không tìm thấy mã tỉnh đã chọn; trang tạm dùng Hà Nội.',
      );
    }
  }

  let lechHopLe: number | undefined;
  if (lechRaw) {
    if (/^-?\d+$/.test(lechRaw) && LECH_CHON.includes(Number(lechRaw))) {
      lechHopLe = Number(lechRaw);
    } else {
      canhBaoThamSo.push(
        'Giá trị múi giờ không nằm trong danh sách hỗ trợ; trang dùng múi giờ tự chọn theo năm và nơi sinh.',
      );
    }
  }

  const ngayDoc = ngayRaw ? docNgay(ngayRaw) : undefined;
  const ngaySinh =
    ngayDoc && ngayHopLe(ngayDoc.nam, ngayDoc.thang, ngayDoc.ngay)
      ? ngayDoc
      : undefined;
  const gioSinh = gioRaw ? docGio(gioRaw) : undefined;

  if (ngayRaw && !ngaySinh) {
    loiList.push(
      'Ngày sinh không hợp lệ hoặc ngoài khoảng 1900–2100. Vui lòng chọn ngày có thật từ 01/01/1900 đến 31/12/2100.',
    );
  }
  if (gioRaw && !gioSinh) {
    loiList.push(
      'Giờ sinh không hợp lệ. Vui lòng nhập theo định dạng HH:MM (00:00–23:59), hoặc để trống nếu không biết.',
    );
  }
  if (!ngayRaw && gioRaw && gioSinh) {
    loiList.push('Vui lòng nhập thêm ngày sinh dương lịch để lập bản đồ sao.');
  }

  let banDo: BanDoSao | null = null;
  let laMacDinh = false;
  let gioHienThi = '';
  let tieuDeKetQua = '';

  if (loiList.length === 0) {
    try {
      if (ngaySinh) {
        banDo = lapBanDo({
          nam: ngaySinh.nam,
          thang: ngaySinh.thang,
          ngay: ngaySinh.ngay,
          gio: gioSinh?.gio,
          phut: gioSinh?.phut,
          noiSinh: tinhChon,
          lechGiay: lechHopLe,
        });
        if (gioSinh) {
          gioHienThi = `${pad2(gioSinh.gio)}:${pad2(gioSinh.phut)}`;
          tieuDeKetQua = `Bản đồ sao ngày ${vietNgay(ngaySinh)} lúc ${gioHienThi} tại ${tinhChon.tinh}`;
        } else {
          tieuDeKetQua = `Bản đồ sao ngày ${vietNgay(ngaySinh)} tại ${tinhChon.tinh}`;
        }
      } else {
        laMacDinh = true;
        const lucVN = sangGioVN(new Date());
        banDo = lapBanDo({
          nam: lucVN.nam,
          thang: lucVN.thang,
          ngay: lucVN.ngay,
          gio: lucVN.gio,
          phut: lucVN.phut,
          noiSinh: tinhChon,
          lechGiay: lechHopLe,
        });
        gioHienThi = `${pad2(lucVN.gio)}:${pad2(lucVN.phut)}`;
        tieuDeKetQua = `Bầu trời lúc ${gioHienThi} ngày ${pad2(lucVN.ngay)}/${pad2(lucVN.thang)}/${lucVN.nam} tại ${tinhChon.tinh}`;
      }
    } catch (err) {
      if (err instanceof RangeError) {
        loiList.push(err.message);
      } else {
        loiList.push('Không tính được bản đồ sao với dữ liệu đã nhập.');
      }
      banDo = null;
    }
  }

  const giaTriNgay = ngaySinh
    ? isoNgay(ngaySinh)
    : /^\d{4}-\d{2}-\d{2}$/.test(ngayRaw)
      ? ngayRaw
      : '';
  const giaTriGio = gioSinh
    ? `${pad2(gioSinh.gio)}:${pad2(gioSinh.phut)}`
    : /^\d{2}:\d{2}$/.test(gioRaw)
      ? gioRaw
      : '';

  const canonicalSach = `${GOC_SITE}${DUONG_DAN_BAN_DO}`;
  const schemaApp = taoSchemaWebApplication(tt, canonicalSach);

  const daChonLechKhac =
    banDo !== null &&
    lechHopLe !== undefined &&
    lechHopLe !== banDo.mucGio.lechGiay;
  const chuaChacMuiGio =
    banDo !== null && !banDo.mucGio.chacChan && lechHopLe === undefined;

  const coDienTrongBang = banDo
    ? banDo.thienThe.filter((t) => t.thienThe.coDien)
    : [];
  const nhaThienDinh =
    banDo?.coGio && banDo.asc && banDo.mc
      ? ((banDo.mc.cung.thu - banDo.asc.cung.thu + 12) % 12) + 1
      : null;
  const matTroi = banDo?.thienThe.find((t) => t.thienThe.ten === 'Mặt Trời') ?? null;
  const matTrang = banDo?.thienThe.find((t) => t.thienThe.ten === 'Mặt Trăng') ?? null;

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={DUONG_DAN_BAN_DO}
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaApp) }}
      />

      {/* 1. Form lập bản đồ sao (GET) */}
      <div className="ck-ct-form-khung">
        <form
          className="ck-to-giay ck-ct-bds-form"
          action={DUONG_DAN_BAN_DO}
          method="get"
        >
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2>Lập bản đồ sao</h2>
            <HoaVanMay flipped />
          </div>

          {loiList.length > 0 ? (
            <div className="ck-loi" role="alert">
              {loiList.map((cau, i) => (
                <div key={i}>{cau}</div>
              ))}
            </div>
          ) : null}

          {canhBaoThamSo.length > 0 ? (
            <div className="ck-ct-bds-canh-bao" role="status">
              {canhBaoThamSo.map((cau, i) => (
                <p key={i}>{cau}</p>
              ))}
            </div>
          ) : null}

          <div className="ck-ct-bds-hang-2">
            <div className="ck-o-nhap">
              <label htmlFor="ck-ct-bds-ngay">
                Ngày sinh dương lịch (1900–2100)
              </label>
              <input
                id="ck-ct-bds-ngay"
                name="ngay"
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                defaultValue={giaTriNgay}
                required
              />
            </div>

            <div className="ck-o-nhap">
              <label htmlFor="ck-ct-bds-gio">
                Giờ sinh <small>(không bắt buộc)</small>
              </label>
              <input
                id="ck-ct-bds-gio"
                name="gio"
                type="time"
                defaultValue={giaTriGio}
              />
              <p className="ck-ct-bds-goi-y">
                Không biết giờ sinh thì để trống.
              </p>
            </div>
          </div>

          <div className="ck-ct-bds-hang-2">
            <div className="ck-o-nhap">
              <label htmlFor="ck-ct-bds-tinh">
                Nơi sinh (tỉnh, thành theo tên cũ)
              </label>
              <select
                id="ck-ct-bds-tinh"
                name="tinh"
                defaultValue={tinhChon.ma}
              >
                {DS_TINH.map((t) => (
                  <option key={t.ma} value={t.ma}>
                    {t.tinh}
                  </option>
                ))}
              </select>
            </div>

            <div className="ck-o-nhap">
              <label htmlFor="ck-ct-bds-lech">Múi giờ</label>
              <select
                id="ck-ct-bds-lech"
                name="lech"
                defaultValue={
                  lechHopLe !== undefined ? String(lechHopLe) : ''
                }
              >
                <option value="">Tự chọn theo năm và nơi sinh</option>
                {LECH_CHON.map((x) => (
                  <option key={x} value={String(x)}>
                    {nhanLech(x)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="ck-nut ck-nut-son ck-nut-lon ck-ct-nut-chinh"
          >
            Lập bản đồ sao
          </button>

          {daDung.has('/lich-am/doi-ngay') ? (
            <p className="ck-ct-ghi-ngay">
              Biết ngày âm lịch thì đổi sang dương lịch ở{' '}
              <Link href="/lich-am/doi-ngay">đổi ngày âm dương</Link>.
            </p>
          ) : null}
        </form>
      </div>

      {/* 2. Kết quả */}
      {banDo ? (
        <>
          <section className="ck-td-muc" aria-labelledby="ck-ct-bds-kq-tieu">
            <h2 id="ck-ct-bds-kq-tieu" className="ck-td-tieu">
              {tieuDeKetQua}
            </h2>

            {/* 2.1. Dòng múi giờ */}
            <div
              className={`ck-ct-bds-mui-gio${chuaChacMuiGio ? ' ck-ct-bds-mui-gio-luu-y' : ''}`}
              role={chuaChacMuiGio ? 'note' : undefined}
              aria-label="Thông tin múi giờ"
            >
              {banDo.coGio ? (
                <p>
                  {laMacDinh ? 'Giờ ' : 'Giờ sinh '}
                  <strong>{gioHienThi}</strong> được tính theo{' '}
                  <strong>{nhanLech(banDo.lechGiay)}</strong>
                  {daChonLechKhac ? '.' : ` (${banDo.mucGio.lyDo})`}
                </p>
              ) : (
                <p>
                  Vị trí lúc 12:00 được tính theo{' '}
                  <strong>{nhanLech(banDo.lechGiay)}</strong>
                  {daChonLechKhac ? '.' : ` (${banDo.mucGio.lyDo})`}
                </p>
              )}

              {daChonLechKhac ? (
                <p>
                  <strong>
                    Bạn chọn {nhanLech(lechHopLe!)}; mặc định là{' '}
                    {banDo.mucGio.nhan}
                  </strong>{' '}
                  ({banDo.mucGio.lyDo}).
                </p>
              ) : null}

              {chuaChacMuiGio ? (
                <p>
                  <strong>
                    Múi giờ giai đoạn này còn chưa chắc. Nếu biết giờ sinh ghi
                    theo múi giờ nào, hãy chọn lại ở ô{' '}
                    <a href="#ck-ct-bds-lech">Múi giờ</a> phía trên.
                  </strong>
                </p>
              ) : null}
            </div>

            {/* 2.1b. 4 thẻ mốc ở đầu kết quả */}
            <div className="ck-ct-bds-moc-luoi" aria-label="Bốn mốc chính trên bản đồ sao">
              {matTroi ? (
                <article className="ck-ct-bds-moc-the">
                  <span className="ck-ct-bds-moc-nhan">
                    <span className="ck-ct-ky" aria-hidden="true">
                      {kyHieuChu(matTroi.thienThe.kyHieu)}
                    </span>{' '}
                    Mặt Trời
                  </span>
                  <strong className="ck-ct-bds-moc-gia">
                    <ViTriLienKet p={matTroi} />
                  </strong>
                  <span className="ck-ct-bds-moc-phu">
                    {matTroi.nha !== null ? `Nhà ${matTroi.nha}` : 'Vị trí lúc 12:00'}
                    {matTroi.phamVi ? ` · ${TEN_PHAM_VI[matTroi.phamVi].ten}` : ''}
                  </span>
                </article>
              ) : null}

              {matTrang ? (
                <article className="ck-ct-bds-moc-the">
                  <span className="ck-ct-bds-moc-nhan">
                    <span className="ck-ct-ky" aria-hidden="true">
                      {kyHieuChu(matTrang.thienThe.kyHieu)}
                    </span>{' '}
                    Mặt Trăng
                  </span>
                  {banDo.coGio ? (
                    <>
                      <strong className="ck-ct-bds-moc-gia">
                        <ViTriLienKet p={matTrang} />
                      </strong>
                      <span className="ck-ct-bds-moc-phu">
                        Nhà {matTrang.nha}
                        {matTrang.phamVi ? ` · ${TEN_PHAM_VI[matTrang.phamVi].ten}` : ''}
                      </span>
                    </>
                  ) : matTrang.trongNgay ? (
                    <>
                      <strong className="ck-ct-bds-moc-gia ck-ct-bds-moc-gia-dai">
                        <ViTriLienKet p={matTrang.trongNgay.tu} /> –{' '}
                        <ViTriLienKet p={matTrang.trongNgay.den} />
                      </strong>
                      <span className="ck-ct-bds-moc-phu">
                        Khoảng trong ngày · lúc 12:00: {vietViTri(matTrang)}
                      </span>
                    </>
                  ) : (
                    <>
                      <strong className="ck-ct-bds-moc-gia">
                        <ViTriLienKet p={matTrang} />
                      </strong>
                      <span className="ck-ct-bds-moc-phu">Vị trí lúc 12:00</span>
                    </>
                  )}
                </article>
              ) : null}

              <article
                className={`ck-ct-bds-moc-the${banDo.coGio && banDo.asc ? '' : ' ck-ct-bds-moc-cho'}`}
              >
                <span className="ck-ct-bds-moc-nhan">Cung mọc</span>
                {banDo.coGio && banDo.asc ? (
                  <>
                    <strong className="ck-ct-bds-moc-gia">
                      <ViTriLienKet p={banDo.asc} />
                    </strong>
                    <span className="ck-ct-bds-moc-phu">Nhà 1 · góc mọc phía Đông</span>
                  </>
                ) : (
                  <>
                    <strong className="ck-ct-bds-moc-gia ck-ct-bds-moc-cho-chu">
                      Cần giờ sinh
                    </strong>
                    <span className="ck-ct-bds-moc-phu">
                      Nhập giờ sinh để tính cung mọc.
                    </span>
                  </>
                )}
              </article>

              <article
                className={`ck-ct-bds-moc-the${banDo.coGio && banDo.mc ? '' : ' ck-ct-bds-moc-cho'}`}
              >
                <span className="ck-ct-bds-moc-nhan">Thiên đỉnh</span>
                {banDo.coGio && banDo.mc ? (
                  <>
                    <strong className="ck-ct-bds-moc-gia">
                      <ViTriLienKet p={banDo.mc} />
                    </strong>
                    <span className="ck-ct-bds-moc-phu">
                      {nhaThienDinh ? `Nhà ${nhaThienDinh} · ` : ''}kinh tuyến trên
                    </span>
                  </>
                ) : (
                  <>
                    <strong className="ck-ct-bds-moc-gia ck-ct-bds-moc-cho-chu">
                      Cần giờ sinh
                    </strong>
                    <span className="ck-ct-bds-moc-phu">
                      Nhập giờ sinh để tính thiên đỉnh.
                    </span>
                  </>
                )}
              </article>
            </div>

            {/* 2.2. Vòng bản đồ SVG */}
            <VongBanDoSaoSvg banDo={banDo} nhanThoiDiem={tieuDeKetQua} />

            {/* 2.3. Ghi chú không giờ ngay trên bảng */}
            {!banDo.coGio ? (
              <aside
                className="ck-ct-bds-ghi-chu"
                aria-label="Ghi chú khi không có giờ sinh"
              >
                <p>{GHI_CHU_KHONG_GIO}</p>
              </aside>
            ) : null}

            {/* 2.4. Bảng vị trí */}
            <div className="ck-ct-bang-boc ck-ct-bds-bang-boc">
              <table className="ck-ct-bang ck-ct-bds-bang">
                <thead>
                  <tr>
                    <th scope="col">Thiên thể</th>
                    <th scope="col">Vị trí</th>
                    <th scope="col">Nhà</th>
                    <th scope="col">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {banDo.coGio && banDo.asc && banDo.mc ? (
                    <>
                      <tr className="ck-ct-bds-hang-goc">
                        <th scope="row">
                          <span className="ck-ct-bds-goc-ten">Cung mọc</span>
                        </th>
                        <td>
                          <ViTriLienKet p={banDo.asc} />
                        </td>
                        <td>1</td>
                        <td>–</td>
                      </tr>
                      <tr className="ck-ct-bds-hang-goc">
                        <th scope="row">
                          <span className="ck-ct-bds-goc-ten">Thiên đỉnh</span>
                        </th>
                        <td>
                          <ViTriLienKet p={banDo.mc} />
                        </td>
                        <td>{nhaThienDinh ?? '–'}</td>
                        <td>–</td>
                      </tr>
                    </>
                  ) : null}

                  {banDo.thienThe.map((t) => {
                    const ghiChu: string[] = [];
                    if (t.nghich) ghiChu.push('nghịch hành');
                    if (t.phamVi) {
                      const pv = TEN_PHAM_VI[t.phamVi];
                      ghiChu.push(`${pv.ten} (Tetrabiblos ch. ${pv.chuong})`);
                    }
                    if (t.trongNgay) {
                      ghiChu.push(
                        `trong ngày: từ ${vietViTri(t.trongNgay.tu)} tới ${vietViTri(t.trongNgay.den)}`,
                      );
                    }

                    return (
                      <tr
                        key={t.thienThe.ten}
                        className={
                          t.thienThe.coDien ? undefined : 'ck-ct-bds-hang-ngoai'
                        }
                      >
                        <th scope="row">
                          <span className="ck-ct-bds-tt-dong">
                            <span className="ck-ct-ky" aria-hidden="true">
                              {kyHieuChu(t.thienThe.kyHieu)}
                            </span>
                            <span>
                              {t.thienThe.ten}
                              {!t.thienThe.coDien ? (
                                <a
                                  href="#ck-ct-bds-ghi-chu-ngoai"
                                  className="ck-ct-bds-sao-ngoai"
                                  aria-label="Xem ghi chú ba hành tinh ngoài Tetrabiblos"
                                >
                                  *
                                </a>
                              ) : null}
                            </span>
                          </span>
                        </th>
                        <td>
                          <ViTriLienKet p={t} />
                        </td>
                        <td>{t.nha !== null ? String(t.nha) : '–'}</td>
                        <td>{ghiChu.length > 0 ? ghiChu.join('; ') : '–'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p id="ck-ct-bds-ghi-chu-ngoai" className="ck-ct-bds-chu-thich">
              * {GHI_CHU_NGOAI}
            </p>

            {banDo.coGio ? (
              <p className="ck-ct-bds-chu-thich">{GHI_CHU_NHA}</p>
            ) : null}

            <KhoiGhiChuTinhCach />
          </section>

          {/* 3. Tetrabiblos nói về các thiên thể và góc */}
          <section className="ck-td-muc" aria-labelledby="ck-ct-bds-sach-tieu">
            <h2 id="ck-ct-bds-sach-tieu" className="ck-td-tieu">
              Tetrabiblos nói về các thiên thể và góc
            </h2>

            <div className="ck-ct-bds-trich-ds">
              {coDienTrongBang.map((t) => {
                const trich = TRICH_THIEN_THE[t.thienThe.ten as HanhTinh];
                return (
                  <details key={t.thienThe.ten} className="ck-ct-bds-chi-tiet">
                    <summary>
                      <span className="ck-ct-ky" aria-hidden="true">
                        {kyHieuChu(t.thienThe.kyHieu)}
                      </span>
                      <span>{t.thienThe.ten}</span>
                    </summary>
                    <div className="ck-ct-bds-chi-tiet-nd">
                      <TrichTetrabiblos trich={trich} />
                    </div>
                  </details>
                );
              })}

              {banDo.coGio ? (
                <>
                  <details className="ck-ct-bds-chi-tiet">
                    <summary>Cung mọc</summary>
                    <div className="ck-ct-bds-chi-tiet-nd">
                      <TrichTetrabiblos trich={TRICH_GOC.asc} />
                    </div>
                  </details>
                  <details className="ck-ct-bds-chi-tiet">
                    <summary>Thiên đỉnh</summary>
                    <div className="ck-ct-bds-chi-tiet-nd">
                      <TrichTetrabiblos trich={TRICH_GOC.mc} />
                    </div>
                  </details>
                </>
              ) : null}
            </div>
          </section>
        </>
      ) : null}

      {/* 4. Phần dưới trang: Cách tính, liên kết, ghi công, nguồn và giới hạn */}
      <section className="ck-td-muc" aria-labelledby="ck-ct-bds-cach-tieu">
        <h2 id="ck-ct-bds-cach-tieu" className="ck-td-tieu">
          Cách tính
        </h2>
        <div className="ck-ct-hop-giay">
          <ul className="ck-ct-bds-cach-tinh">
            <li>
              <strong>Vị trí:</strong> {NGUON_BAN_DO.lich}.
            </li>
            <li>
              <strong>Nơi sinh:</strong> {GHI_CHU_NOI_SINH} {GHI_CHU_TINH}
            </li>
            <li>
              <strong>Múi giờ:</strong> {NGUON_BAN_DO.mucGio}.
            </li>
            <li>
              <strong>Hoàng đạo nhiệt đới:</strong>
              <KhoiGhiChuHoangDao />
            </li>
          </ul>
        </div>
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          {daDung.has('/chiem-tinh') ? (
            <Link href="/chiem-tinh">Tổng quan Chiêm tinh</Link>
          ) : null}
          {daDung.has('/chiem-tinh/cung-hoang-dao') ? (
            <Link href="/chiem-tinh/cung-hoang-dao">12 cung hoàng đạo</Link>
          ) : null}
          {daDung.has('/lich-am/doi-ngay') ? (
            <Link href="/lich-am/doi-ngay">Đổi ngày âm dương</Link>
          ) : null}
        </div>
      </nav>

      <div className="ck-ct-bds-ghi-cong">
        <p>
          Tọa độ tỉnh lỵ:{' '}
          <a
            href="https://www.geonames.org"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            GeoNames
          </a>
          , giấy phép{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            CC BY 4.0
          </a>
          .
        </p>
        <p>
          Tính bằng{' '}
          <a
            href="https://github.com/cosinekitty/astronomy"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            astronomy-engine
          </a>{' '}
          (MIT).
        </p>
      </div>

      <KhoiNguonVaGioiHan daDung={daDung} />
    </KhungTrang>
  );
}

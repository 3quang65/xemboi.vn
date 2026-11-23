import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  CUNG_HOANG_DAO,
  duongDanCung,
  khoangCungTrongNam,
  traCung,
  vietGioVN,
} from '@/lib/trang/chiem-tinh';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { docNgay, isoNgay, vietNgay } from '@/lib/trang/than-so-hoc';
import {
  GOC_SITE,
  MAC_DINH_CUNG_HOANG_DAO,
  docGio,
  kiemCoThamSo,
  layMot,
  nhanHanhTinh,
  pad2,
  serializeJsonLd,
  taoSchemaDefinedTermSet12Cung,
  taoSchemaWebApplication,
  vietGioPhut,
  vietNgayVN,
  type SearchParamsInput,
} from '../ChiemTinhHelpers';
import {
  KhoiGhiChuHoangDao,
  KhoiGhiChuTinhCach,
  KhoiNguonVaGioiHan,
} from '../ChiemTinhUi';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/chiem-tinh/cung-hoang-dao', MAC_DINH_CUNG_HOANG_DAO),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}/chiem-tinh/cung-hoang-dao` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function CungHoangDaoPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/chiem-tinh/cung-hoang-dao', MAC_DINH_CUNG_HOANG_DAO),
    searchParams,
  ]);
  const daDung = trangDaDung();
  const namNay = ngayHienTaiVN().nam;

  const ngayRaw = layMot(sp.ngay)?.trim() ?? '';
  const gioRaw = layMot(sp.gio)?.trim() ?? '';

  const ngaySinh = ngayRaw ? docNgay(ngayRaw) : undefined;
  const gioSinh = gioRaw ? docGio(gioRaw) : undefined;

  const loiList: string[] = [];
  if (ngayRaw && !ngaySinh) {
    loiList.push(
      'Ngày sinh dương lịch không hợp lệ. Vui lòng chọn ngày có thật từ 01/01/1900 đến 31/12/2100.',
    );
  }
  if (gioRaw && !gioSinh) {
    loiList.push(
      'Giờ sinh không hợp lệ. Vui lòng nhập theo định dạng HH:MM từ 00:00 đến 23:59.',
    );
  }
  if (!ngayRaw && gioRaw && gioSinh) {
    loiList.push('Vui lòng nhập thêm ngày sinh dương lịch để tra cung.');
  }

  const ketQua =
    ngaySinh && loiList.length === 0
      ? traCung(
          ngaySinh.ngay,
          ngaySinh.thang,
          ngaySinh.nam,
          gioSinh?.gio,
          gioSinh?.phut,
        )
      : null;

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

  const canonicalSach = `${GOC_SITE}/chiem-tinh/cung-hoang-dao`;
  const schemaApp = taoSchemaWebApplication(tt, canonicalSach);
  const schemaSet = taoSchemaDefinedTermSet12Cung();
  const hrefBanDoSao = ngaySinh
    ? `/chiem-tinh/ban-do-sao?${new URLSearchParams({
        ngay: isoNgay(ngaySinh),
        ...(gioSinh
          ? { gio: `${pad2(gioSinh.gio)}:${pad2(gioSinh.phut)}` }
          : {}),
      }).toString()}`
    : '/chiem-tinh/ban-do-sao';

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/chiem-tinh/cung-hoang-dao"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaSet) }}
      />

      {/* 1. Form tra cung */}
      <div className="ck-ct-form-khung">
        <form
          className="ck-to-giay"
          action="/chiem-tinh/cung-hoang-dao"
          method="get"
        >
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2>Tra cung hoàng đạo</h2>
            <HoaVanMay flipped />
          </div>

          {loiList.length > 0 ? (
            <div className="ck-loi" role="alert">
              {loiList.map((cau, i) => (
                <div key={i}>{cau}</div>
              ))}
            </div>
          ) : null}

          <div className="ck-hang-2cot">
            <div className="ck-o-nhap">
              <label htmlFor="ck-ct-ngay">
                Ngày sinh dương lịch (1900–2100)
              </label>
              <input
                id="ck-ct-ngay"
                name="ngay"
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                defaultValue={giaTriNgay}
                required
              />
            </div>

            <div className="ck-o-nhap">
              <label htmlFor="ck-ct-gio">
                Giờ sinh <small>(không bắt buộc)</small>
              </label>
              <input
                id="ck-ct-gio"
                name="gio"
                type="time"
                defaultValue={giaTriGio}
              />
            </div>
          </div>

          <button
            type="submit"
            className="ck-nut ck-nut-son ck-nut-lon ck-ct-nut-chinh"
          >
            Tra cung hoàng đạo
          </button>

          <p className="ck-ct-ghi-ngay">
            Giờ Việt Nam (UTC+7). Không nhập giờ thì tính lúc 12:00.
            {daDung.has('/lich-am/doi-ngay') ? (
              <>
                {' '}
                Biết ngày âm thì đổi ở{' '}
                <Link href="/lich-am/doi-ngay">đổi ngày âm dương</Link>.
              </>
            ) : null}
          </p>
        </form>
      </div>

      {/* 2. Kết quả tra cung */}
      {ketQua && ngaySinh ? (
        <section className="ck-td-muc" aria-labelledby="ck-ct-kq-tieu">
          <h2 id="ck-ct-kq-tieu" className="ck-td-tieu">
            Kết quả cho ngày {vietNgay(ngaySinh)}
            {gioSinh ? ` lúc ${pad2(gioSinh.gio)}:${pad2(gioSinh.phut)}` : ''}
          </h2>

          <div className="ck-ct-dau-the">
            <div className="ck-ct-dau-trai">
              <span className="ck-ct-ky-trien" aria-hidden="true">
                {ketQua.cung.kyHieu}
              </span>
              <div>
                <h3 className="ck-ct-dau-ten">
                  <Link href={duongDanCung(ketQua.cung)}>
                    Cung {ketQua.cung.ten} ({ketQua.cung.en})
                  </Link>
                </h3>
                <p className="ck-ct-dau-phu">
                  Kinh độ Mặt Trời lúc đó:{' '}
                  <strong>{ketQua.kinhDo.toFixed(2)}°</strong>
                  {ketQua.coGio
                    ? ` (tính theo ${pad2(gioSinh!.gio)}:${pad2(gioSinh!.phut)} giờ Việt Nam)`
                    : ' (tính mặc định lúc 12:00 giờ Việt Nam)'}
                </p>
              </div>
            </div>
            <Link href={duongDanCung(ketQua.cung)} className="ck-nut ck-nut-vien">
              Xem chi tiết Cung {ketQua.cung.ten} →
            </Link>
          </div>

          {ketQua.chuyen ? (
            <div className="ck-ct-chuyen-cung" role="note" aria-label="Lưu ý ngày chuyển cung">
              <p>
                <strong>
                  Ngày {vietNgayVN(ketQua.chuyen.luc)} Mặt Trời chuyển từ{' '}
                  {ketQua.chuyen.truoc.ten} sang {ketQua.chuyen.sau.ten} lúc{' '}
                  {vietGioPhut(ketQua.chuyen.luc)} giờ Việt Nam.
                </strong>
              </p>
              <p>
                Sinh trước giờ này là{' '}
                <Link href={duongDanCung(ketQua.chuyen.truoc)}>
                  {ketQua.chuyen.truoc.ten}
                </Link>
                , từ giờ này là{' '}
                <Link href={duongDanCung(ketQua.chuyen.sau)}>
                  {ketQua.chuyen.sau.ten}
                </Link>
                .
              </p>
              {!ketQua.coGio ? (
                <p>
                  Bạn chưa nhập giờ sinh (kết quả trên đang tính lúc 12:00). Hãy nhập thêm giờ
                  sinh ở biểu mẫu trên để biết chắc bạn thuộc cung nào.
                </p>
              ) : null}
            </div>
          ) : null}

          {daDung.has('/chiem-tinh/ban-do-sao') ? (
            <p className="ck-ct-bds-moi">
              Muốn xem cả Mặt Trăng, các hành tinh và cung mọc:{' '}
              <Link href={hrefBanDoSao}>Lập bản đồ sao</Link>.
            </p>
          ) : null}

          <KhoiGhiChuTinhCach />
        </section>
      ) : null}

      {/* 3. Bảng 12 cung (luôn hiện) */}
      <section className="ck-td-muc" aria-labelledby="ck-ct-bang-12-tieu">
        <h2 id="ck-ct-bang-12-tieu" className="ck-td-tieu">
          Bảng 12 cung hoàng đạo (năm {namNay})
        </h2>

        <div className="ck-ct-bang-boc">
          <table className="ck-ct-bang ck-ct-bang-the">
            <thead>
              <tr>
                <th scope="col">Ký hiệu</th>
                <th scope="col">Cung</th>
                <th scope="col">Tiếng Anh</th>
                <th scope="col">Năm {namNay} (giờ VN)</th>
                <th scope="col">Chủ nhà</th>
                <th scope="col">Tam hợp</th>
              </tr>
            </thead>
            <tbody>
              {CUNG_HOANG_DAO.map((c) => {
                const k = khoangCungTrongNam(c.thu, namNay);
                return (
                  <tr key={c.slug}>
                    <td data-nhan="Ký hiệu">
                      <span className="ck-ct-ky" aria-hidden="true">
                        {c.kyHieu}
                      </span>
                    </td>
                    <th scope="row" data-nhan="Cung">
                      <div>
                        <Link href={duongDanCung(c)} className="ck-ct-bang-ten">
                          {c.ten}
                        </Link>
                        {c.tenKhac.length > 0 ? (
                          <span className="ck-ct-ten-khac">
                            Tên khác: {c.tenKhac.join(', ')}
                          </span>
                        ) : null}
                      </div>
                    </th>
                    <td data-nhan="Tiếng Anh">{c.en}</td>
                    <td data-nhan={`Năm ${namNay}`}>
                      <div>
                        <span className="ck-ct-gio-dong">{vietGioVN(k.batDau)} →</span>
                        <span className="ck-ct-gio-dong">{vietGioVN(k.ketThuc)}</span>
                      </div>
                    </td>
                    <td data-nhan="Chủ nhà">{nhanHanhTinh(c.chuNha)}</td>
                    <td data-nhan="Tam hợp">Tam hợp thứ {c.tamHop}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. Giải thích xê dịch ngày vào cung */}
        <p className="ck-ct-ghi-chu-xe-dich">
          Ngày vào cung xê dịch 1–2 ngày giữa các năm vì năm dương lịch không khớp đúng một vòng
          Mặt Trời (năm nhuận, giờ chuyển). Muốn biết chắc với người sinh sát ngày chuyển, hãy
          nhập cả giờ sinh.
        </p>
      </section>

      {/* 5. Ghi chú hoàng đạo, liên kết hub, nguồn và giới hạn */}
      <KhoiGhiChuHoangDao />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/chiem-tinh">Tổng quan Chiêm tinh</Link>
          {daDung.has('/chiem-tinh/ban-do-sao') ? (
            <Link href="/chiem-tinh/ban-do-sao">Bản đồ sao</Link>
          ) : null}
          {daDung.has('/lich-am/doi-ngay') ? (
            <Link href="/lich-am/doi-ngay">Đổi ngày âm dương</Link>
          ) : null}
        </div>
      </nav>

      <KhoiNguonVaGioiHan daDung={daDung} />
    </KhungTrang>
  );
}

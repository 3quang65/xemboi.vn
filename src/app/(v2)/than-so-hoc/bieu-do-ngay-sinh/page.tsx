import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  bieuDoNgaySinh,
  bonDinhCao,
  docNgay,
  duongDanSoChuDao,
  isoNgay,
  vietNgay,
} from '@/lib/trang/than-so-hoc';
import {
  GOC_SITE,
  MAC_DINH_BIEU_DO,
  NGAY_VI_DU,
  kiemCoThamSo,
  laSoChuDaoHopLe,
  layMot,
  serializeJsonLd,
  taoSchemaWebApplication,
  type SearchParamsInput,
} from '../ThanSoHocHelpers';
import {
  GhiChuNgayDuong,
  KhoiGhiChuYNghia,
  KhoiGioiHan,
  LuoiBieuDoNgaySinh,
} from '../ThanSoHocUi';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/than-so-hoc/bieu-do-ngay-sinh', MAC_DINH_BIEU_DO),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}/than-so-hoc/bieu-do-ngay-sinh` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function BieuDoNgaySinhPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/than-so-hoc/bieu-do-ngay-sinh', MAC_DINH_BIEU_DO),
    searchParams,
  ]);
  const daDung = trangDaDung();
  const jsonLd = taoSchemaWebApplication(tt);

  const ngayRaw = layMot(sp.ngay)?.trim() ?? '';
  let loi: string | null = null;
  const ngaySinh = ngayRaw ? docNgay(ngayRaw) : undefined;
  if (ngayRaw && !ngaySinh) {
    loi =
      'Ngày sinh dương lịch không hợp lệ. Vui lòng chọn ngày có thật từ 01/01/1900 đến 31/12/2100.';
  }

  const bieuDo = ngaySinh ? bieuDoNgaySinh(ngaySinh) : null;
  const dinhCao = ngaySinh ? bonDinhCao(ngaySinh) : null;
  const bieuDoMau = bieuDoNgaySinh(NGAY_VI_DU);

  const giaTriInput = ngaySinh
    ? isoNgay(ngaySinh)
    : /^\d{4}-\d{2}-\d{2}$/.test(ngayRaw)
      ? ngayRaw
      : '';

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/than-so-hoc/bieu-do-ngay-sinh"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. Form ngày sinh */}
      <div className="ck-tsh-form-khung">
        <form className="ck-to-giay" action="/than-so-hoc/bieu-do-ngay-sinh" method="get">
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2>Nhập ngày sinh dương lịch</h2>
            <HoaVanMay flipped />
          </div>

          {loi ? (
            <div className="ck-loi" role="alert">
              {loi}
            </div>
          ) : null}

          <div className="ck-o-nhap">
            <label htmlFor="ck-tsh-bd-ngay">
              Ngày sinh dương lịch (1900–2100)
            </label>
            <input
              id="ck-tsh-bd-ngay"
              name="ngay"
              type="date"
              min="1900-01-01"
              max="2100-12-31"
              defaultValue={giaTriInput}
              required
            />
          </div>

          <button type="submit" className="ck-nut ck-nut-son ck-nut-lon ck-tsh-nut-chinh">
            Vẽ biểu đồ ngày sinh
          </button>

          <GhiChuNgayDuong daDung={daDung} />
        </form>
      </div>

      {/* 2. Kết quả biểu đồ 3 × 3 và 4 đỉnh cao */}
      {bieuDo && dinhCao && ngaySinh ? (
        <section className="ck-td-muc" aria-labelledby="ck-tsh-bd-kq">
          <h2 id="ck-tsh-bd-kq" className="ck-td-tieu">
            Biểu đồ ngày sinh {vietNgay(ngaySinh)}
          </h2>

          <LuoiBieuDoNgaySinh
            bieuDo={bieuDo}
            moTa={`Lưới 3 × 3 biểu đồ ngày sinh ${vietNgay(ngaySinh)}`}
          />

          <p className="ck-tsh-so-sanh-dong">
            Một số sách gọi các đường này là 'mũi tên' và đặt tên riêng cho từng đường; tên gọi khác nhau giữa các sách nên trang chỉ ghi vị trí.
          </p>

          <h3 className="ck-tsh-nhom-so-tieu">4 đỉnh cao theo tuổi</h3>
          <div className="ck-bang-khung">
            <table className="ck-bang ck-bang-the">
              <thead>
                <tr>
                  <th>Thứ tự</th>
                  <th>Phép cộng</th>
                  <th>Số</th>
                  <th>Khoảng tuổi</th>
                </tr>
              </thead>
              <tbody>
                {dinhCao.map((dc) => {
                  const khoangTuoi =
                    dc.denTuoi !== null
                      ? `${dc.tuTuoi}–${dc.denTuoi}`
                      : `${dc.tuTuoi} trở đi`;
                  return (
                    <tr key={dc.thu}>
                      <td data-nhan="Thứ tự">
                        <b>Đỉnh {dc.thu}</b>
                      </td>
                      <td data-nhan="Phép cộng">
                        <code>{dc.phepCong}</code>
                      </td>
                      <td data-nhan="Số">
                        {laSoChuDaoHopLe(dc.so) ? (
                          <Link href={duongDanSoChuDao(dc.so)}>
                            <strong>{dc.so}</strong>
                          </Link>
                        ) : (
                          <strong>{dc.so}</strong>
                        )}
                      </td>
                      <td data-nhan="Khoảng tuổi">{khoangTuoi}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="ck-tsh-so-sanh-dong">
            Đỉnh 1 kết thúc ở tuổi 36 trừ số chủ đạo (rút về 1 chữ số); mỗi đỉnh sau dài 9 năm. Sách khác có thể lấy mốc tuổi khác.
          </p>

          <div className="ck-tsh-hanh-dong-dong">
            <Link
              href={`/than-so-hoc/so-chu-dao?ngay=${isoNgay(ngaySinh)}`}
              className="ck-nut ck-nut-vien"
            >
              Xem số chủ đạo của ngày này →
            </Link>
          </div>

          <KhoiGhiChuYNghia />
        </section>
      ) : null}

      {/* 3. Cách vẽ (luôn hiện): lưới mẫu 15/08/1990 */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-bd-cach-ve">
        <h2 id="ck-tsh-bd-cach-ve" className="ck-td-tieu">
          Cách vẽ và ví dụ mẫu ({vietNgay(NGAY_VI_DU)})
        </h2>
        <p className="ck-tsh-dau-phu" style={{ marginBottom: 14 }}>
          Xếp từng chữ số 1–9 vào 9 ô cố định (hàng trên 3-6-9, hàng giữa 2-5-8, hàng dưới 1-4-7); chữ số 0 đếm riêng và không đặt vào lưới.
        </p>
        <LuoiBieuDoNgaySinh
          bieuDo={bieuDoMau}
          moTa={`Lưới mẫu ngày ${vietNgay(NGAY_VI_DU)}`}
        />
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/than-so-hoc">Tổng quan Thần số học</Link>
          <Link href="/than-so-hoc/so-chu-dao">Tính số chủ đạo</Link>
          <Link href="/than-so-hoc/theo-ten">Thần số học theo tên</Link>
        </div>
      </nav>

      {/* 4. Giới hạn */}
      <KhoiGioiHan />
    </KhungTrang>
  );
}

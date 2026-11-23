import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  SO_MASTER,
  bieuDoNgaySinh,
  bonDinhCao,
  docNgay,
  duongDanSoChuDao,
  isoNgay,
  noNghiepNgaySinh,
  rutDon,
  rutGon,
  thachThuc,
  thaiDo,
  vietNgay,
} from '@/lib/trang/than-so-hoc';
import { yNghia } from '@/lib/trang/than-so-hoc-y-nghia';
import {
  GOC_SITE,
  MAC_DINH_BIEU_DO,
  NGAY_VI_DU,
  dinhDangBuoc,
  kiemCoThamSo,
  laSoChuDaoHopLe,
  laSoMaster,
  layMot,
  serializeJsonLd,
  taoSchemaWebApplication,
  type SearchParamsInput,
} from '../ThanSoHocHelpers';
import {
  GhiChuNgayDuong,
  KhoiGhiChuYNghia,
  KhoiGioiHan,
  KhoiYNghia,
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
  const dsThachThuc = ngaySinh ? thachThuc(ngaySinh) : null;
  const kqThaiDo = ngaySinh ? thaiDo(ngaySinh) : null;
  const soNgaySinh = ngaySinh ? rutDon(ngaySinh.ngay) : null;
  const buocNgaySinh = ngaySinh ? rutGon(ngaySinh.ngay, []).buoc : null;
  const soNoNghiep = ngaySinh ? noNghiepNgaySinh(ngaySinh.ngay) : undefined;
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

      {/* 2. Kết quả biểu đồ 3 × 3 và các chỉ số kèm ý nghĩa */}
      {bieuDo && dinhCao && dsThachThuc && kqThaiDo && soNgaySinh && buocNgaySinh && ngaySinh ? (
        <section className="ck-td-muc" aria-labelledby="ck-tsh-bd-kq">
          <h2 id="ck-tsh-bd-kq" className="ck-td-tieu">
            Biểu đồ ngày sinh {vietNgay(ngaySinh)}
          </h2>

          <LuoiBieuDoNgaySinh
            bieuDo={bieuDo}
            moTa={`Lưới 3 × 3 biểu đồ ngày sinh ${vietNgay(ngaySinh)}`}
          />

          <p className="ck-tsh-so-sanh-dong">
            Một số sách gọi các đường này là &apos;mũi tên&apos; và đặt tên riêng cho từng đường; tên gọi khác nhau giữa các sách nên trang chỉ ghi vị trí.
          </p>

          <KhoiGhiChuYNghia />

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

          <div className="ck-tsh-yn-ds-chi-so">
            {dinhCao.map((dc) => {
              const khoangTuoi =
                dc.denTuoi !== null
                  ? `${dc.tuTuoi}–${dc.denTuoi} tuổi`
                  : `${dc.tuTuoi} tuổi trở đi`;
              return (
                <article key={dc.thu} className="ck-tsh-yn-the">
                  <div className="ck-tsh-yn-the-dau">
                    <h4>
                      Đỉnh {dc.thu} · Số {dc.so}
                    </h4>
                    <span className="ck-tsh-yn-the-phu">{khoangTuoi}</span>
                  </div>
                  <KhoiYNghia
                    y={yNghia('dinh-cao', dc.so)}
                    gon
                    anGhiChu
                    thuGonTrichChung
                    capTieuDe="h4"
                  />
                </article>
              );
            })}
          </div>

          <h3 className="ck-tsh-nhom-so-tieu">4 số thách thức</h3>
          <div className="ck-bang-khung">
            <table className="ck-bang ck-bang-the">
              <thead>
                <tr>
                  <th>Thứ tự</th>
                  <th>Phép trừ</th>
                  <th>Số</th>
                </tr>
              </thead>
              <tbody>
                {dsThachThuc.map((item) => (
                  <tr key={item.thu}>
                    <td data-nhan="Thứ tự">
                      <b>Thách thức {item.thu}</b>
                    </td>
                    <td data-nhan="Phép trừ">
                      <code>{item.phepTru}</code>
                    </td>
                    <td data-nhan="Số">
                      <strong>{item.so}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ck-tsh-yn-ds-chi-so">
            {dsThachThuc.map((item) => (
              <article key={item.thu} className="ck-tsh-yn-the">
                <div className="ck-tsh-yn-the-dau">
                  <h4>
                    Thách thức {item.thu} · Số {item.so}
                  </h4>
                  <code className="ck-tsh-yn-the-phu">{item.phepTru}</code>
                </div>
                <KhoiYNghia
                  y={yNghia('thach-thuc', item.so)}
                  gon
                  anGhiChu
                  capTieuDe="h4"
                />
              </article>
            ))}
          </div>

          <h3 className="ck-tsh-nhom-so-tieu">Số thái độ</h3>
          <article className="ck-tsh-yn-the">
            <div className="ck-tsh-yn-the-dau">
              <h4>Số thái độ {kqThaiDo.so}</h4>
              <span className="ck-tsh-cach-so">{kqThaiDo.so}</span>
            </div>
            <p className="ck-tsh-phep-cong">{kqThaiDo.phepCong}</p>
            {kqThaiDo.buoc.length > 1 || laSoMaster(kqThaiDo.so) ? (
              <p className="ck-tsh-buoc-dong">
                Rút gọn: {dinhDangBuoc(kqThaiDo.buoc, SO_MASTER)}
              </p>
            ) : null}
            <KhoiYNghia
              y={yNghia('thai-do', kqThaiDo.so)}
              gon
              anGhiChu
              capTieuDe="h4"
            />
          </article>

          <h3 className="ck-tsh-nhom-so-tieu">Số ngày sinh</h3>
          <article className="ck-tsh-yn-the">
            <div className="ck-tsh-yn-the-dau">
              <h4>Số ngày sinh {soNgaySinh}</h4>
              <span className="ck-tsh-cach-so">{soNgaySinh}</span>
            </div>
            <p className="ck-tsh-buoc-dong">
              {ngaySinh.ngay > 9
                ? `Ngày sinh ${ngaySinh.ngay} rút gọn: ${dinhDangBuoc(buocNgaySinh, [])}`
                : `Ngày sinh ${ngaySinh.ngay} (số ${soNgaySinh})`}
            </p>
            <KhoiYNghia
              y={yNghia('ngay-sinh', soNgaySinh)}
              gon
              anGhiChu
              capTieuDe="h4"
            />
          </article>

          {soNoNghiep !== undefined ? (
            <>
              <h3 className="ck-tsh-nhom-so-tieu">Nợ nghiệp (số {soNoNghiep})</h3>
              <article className="ck-tsh-yn-the">
                <p className="ck-tsh-yn-no-nghiep-cau">
                  Ngày sinh {ngaySinh.ngay} được thần số học xếp vào nhóm nợ nghiệp (13, 14, 16, 19).
                </p>
                <KhoiYNghia
                  y={yNghia('no-nghiep', soNoNghiep)}
                  gon
                  anGhiChu
                  thuGonTrichChung
                  capTieuDe="h4"
                />
              </article>
            </>
          ) : null}

          <div className="ck-tsh-hanh-dong-dong">
            <Link
              href={`/than-so-hoc/so-chu-dao?ngay=${isoNgay(ngaySinh)}`}
              className="ck-nut ck-nut-vien"
            >
              Xem số chủ đạo của ngày này →
            </Link>
          </div>
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

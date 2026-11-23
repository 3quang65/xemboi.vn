import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import {
  CUNG_HOANG_DAO,
  TAM_HOP,
  TRICH,
  duongDanCung,
  nhaCuaHanhTinh,
  trichLoai,
} from '@/lib/trang/chiem-tinh';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import {
  BAY_HANH_TINH,
  MAC_DINH_HUB,
  THU_TU_LOAI,
  nhanHanhTinh,
  nhanLoai,
  serializeJsonLd,
  taoSchemaCollectionPage,
} from './ChiemTinhHelpers';
import {
  KhoiGhiChuHoangDao,
  KhoiNguonVaGioiHan,
  TrichTetrabiblos,
  Vong12CungSvg,
} from './ChiemTinhUi';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/chiem-tinh', MAC_DINH_HUB);
}

export default async function ChiemTinhHubPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/chiem-tinh', MAC_DINH_HUB),
    noiDungTheoDuongDan('/chiem-tinh'),
  ]);
  const namNay = ngayHienTaiVN().nam;
  const daDung = trangDaDung();
  const jsonLd = taoSchemaCollectionPage(tt);

  const cungDuong = CUNG_HOANG_DAO.filter((c) => c.duong);
  const cungAm = CUNG_HOANG_DAO.filter((c) => !c.duong);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/chiem-tinh"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. Thẻ lớn Tra cung hoàng đạo kèm form ngày sinh nhỏ */}
      <section className="ck-td-muc" aria-labelledby="ck-ct-hub-tra-tieu">
        <div className="ck-ct-hub-the">
          <div className="ck-ct-hub-dau">
            <div>
              <h2 id="ck-ct-hub-tra-tieu">Tra cung hoàng đạo</h2>
              <p>
                Tính kinh độ Mặt Trời theo ngày giờ sinh dương lịch để xác định cung hoàng đạo và
                giờ chuyển cung trong ngày.
              </p>
            </div>
            <Link href="/chiem-tinh/cung-hoang-dao" className="ck-nut ck-nut-vien">
              Xem bảng 12 cung →
            </Link>
          </div>

          <form
            className="ck-ct-mini-form"
            action="/chiem-tinh/cung-hoang-dao"
            method="get"
          >
            <div className="ck-ct-mini-hang">
              <label className="ck-ct-mini-o" htmlFor="ck-ct-hub-ngay">
                <span>Ngày sinh dương lịch (1900–2100)</span>
                <input
                  id="ck-ct-hub-ngay"
                  name="ngay"
                  type="date"
                  min="1900-01-01"
                  max="2100-12-31"
                  defaultValue="1990-08-15"
                  required
                />
              </label>

              <label className="ck-ct-mini-o" htmlFor="ck-ct-hub-gio">
                <span>Giờ sinh (không bắt buộc)</span>
                <input id="ck-ct-hub-gio" name="gio" type="time" />
              </label>

              <button
                type="submit"
                className="ck-nut ck-nut-son ck-ct-nut-chinh"
              >
                Tra cung
              </button>
            </div>

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

        {daDung.has('/chiem-tinh/ban-do-sao') ? (
          <div className="ck-ct-hub-the ck-ct-bds-hub-the">
            <div className="ck-ct-hub-dau">
              <div>
                <h2>Bản đồ sao</h2>
                <p>
                  Vị trí Mặt Trời, Mặt Trăng, các hành tinh và cung mọc lúc bạn
                  sinh.
                </p>
              </div>
              <Link
                href="/chiem-tinh/ban-do-sao"
                className="ck-nut ck-nut-son ck-ct-nut-chinh"
              >
                Lập bản đồ sao →
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      {/* 2. Vòng 12 cung (SVG) */}
      <section className="ck-td-muc" aria-labelledby="ck-ct-vong-muc-tieu">
        <h2 id="ck-ct-vong-muc-tieu" className="ck-td-tieu">
          Vòng 12 cung hoàng đạo (năm {namNay})
        </h2>
        <Vong12CungSvg namNay={namNay} />
      </section>

      {/* 3. Bốn nhóm theo Tetrabiblos */}
      <section className="ck-td-muc" aria-labelledby="ck-ct-bon-nhom-tieu">
        <h2 id="ck-ct-bon-nhom-tieu" className="ck-td-tieu">
          Phân nhóm 12 cung theo Tetrabiblos
        </h2>

        {/* 3a. Chí / Phân / Cố định / Song thể */}
        <div className="ck-ct-nhom-khoi">
          <h3>Chí, Phân, Cố định và Song thể</h3>
          <div className="ck-ct-nhom-luoi">
            {THU_TU_LOAI.map((loai) => {
              const ds = CUNG_HOANG_DAO.filter((c) => c.loai === loai);
              return (
                <div key={loai} className="ck-ct-nhom-the">
                  <h4>{nhanLoai(loai)}</h4>
                  <div className="ck-ct-chip-ds">
                    {ds.map((c) => (
                      <Link key={c.slug} href={duongDanCung(c)} className="ck-ct-chip">
                        <span className="ck-ct-ky" aria-hidden="true">
                          {c.kyHieu}
                        </span>
                        <span>{c.ten}</span>
                      </Link>
                    ))}
                  </div>
                  <TrichTetrabiblos trich={trichLoai(loai)} />
                </div>
              );
            })}
          </div>
        </div>

        {/* 3b. Dương / Âm */}
        <div className="ck-ct-nhom-khoi">
          <h3>Dương và Âm</h3>
          <div className="ck-ct-hop-giay">
            <div className="ck-ct-nhom-luoi">
              <div>
                <p className="ck-ct-nhom-meta">
                  <strong>Dương (thuộc ngày)</strong>
                </p>
                <div className="ck-ct-chip-ds">
                  {cungDuong.map((c) => (
                    <Link key={c.slug} href={duongDanCung(c)} className="ck-ct-chip">
                      <span className="ck-ct-ky" aria-hidden="true">
                        {c.kyHieu}
                      </span>
                      <span>{c.ten}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="ck-ct-nhom-meta">
                  <strong>Âm (thuộc đêm)</strong>
                </p>
                <div className="ck-ct-chip-ds">
                  {cungAm.map((c) => (
                    <Link key={c.slug} href={duongDanCung(c)} className="ck-ct-chip">
                      <span className="ck-ct-ky" aria-hidden="true">
                        {c.kyHieu}
                      </span>
                      <span>{c.ten}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <TrichTetrabiblos trich={TRICH.amDuong} />
          </div>
        </div>

        {/* 3c. 4 tam hợp */}
        <div className="ck-ct-nhom-khoi">
          <h3>4 tam hợp</h3>
          <div className="ck-ct-nhom-luoi">
            {TAM_HOP.map((th) => {
              const ds = CUNG_HOANG_DAO.filter((c) => c.tamHop === th.thu);
              return (
                <div key={th.thu} className="ck-ct-nhom-the">
                  <h4>Tam hợp thứ {th.thu}</h4>
                  <div className="ck-ct-chip-ds">
                    {ds.map((c) => (
                      <Link key={c.slug} href={duongDanCung(c)} className="ck-ct-chip">
                        <span className="ck-ct-ky" aria-hidden="true">
                          {c.kyHieu}
                        </span>
                        <span>{c.ten}</span>
                      </Link>
                    ))}
                  </div>
                  <p className="ck-ct-nhom-meta">
                    Chủ ban ngày: <strong>{nhanHanhTinh(th.chuNgay)}</strong> · Chủ ban đêm:{' '}
                    <strong>{nhanHanhTinh(th.chuDem)}</strong>
                  </p>
                  <p className="ck-ct-nhom-meta">
                    Phương: <strong>{th.phuong}</strong>
                  </p>
                  <TrichTetrabiblos trich={th.trich} />
                </div>
              );
            })}
          </div>
        </div>

        {/* 3d. Nhà của hành tinh */}
        <div className="ck-ct-nhom-khoi">
          <h3>Nhà của hành tinh</h3>
          <div className="ck-ct-bang-boc">
            <table className="ck-ct-bang ck-ct-bang-the">
              <thead>
                <tr>
                  <th scope="col">Hành tinh</th>
                  <th scope="col">Cung chủ nhà</th>
                  <th scope="col">Tetrabiblos ghi</th>
                </tr>
              </thead>
              <tbody>
                {BAY_HANH_TINH.map((h) => {
                  const ds = nhaCuaHanhTinh(h);
                  const trich = ds[0].trichNha;
                  return (
                    <tr key={h}>
                      <th scope="row" data-nhan="Hành tinh">
                        {nhanHanhTinh(h)}
                      </th>
                      <td data-nhan="Cung chủ nhà">
                        <div className="ck-ct-chip-ds">
                          {ds.map((c) => (
                            <Link key={c.slug} href={duongDanCung(c)} className="ck-ct-chip">
                              <span className="ck-ct-ky" aria-hidden="true">
                                {c.kyHieu}
                              </span>
                              <span>{c.ten}</span>
                            </Link>
                          ))}
                        </div>
                      </td>
                      <td data-nhan="Tetrabiblos">
                        <div>
                          <TrichTetrabiblos trich={trich} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Ghi chú hoàng đạo nhiệt đới */}
      <KhoiGhiChuHoangDao />

      {/* 5. Diễn giải chỉ khi có nội dung đã duyệt */}
      {nd ? <KhoiDienGiai noiDung={nd} /> : null}

      {/* 6. Nguồn và giới hạn */}
      <KhoiNguonVaGioiHan daDung={daDung} />
    </KhungTrang>
  );
}

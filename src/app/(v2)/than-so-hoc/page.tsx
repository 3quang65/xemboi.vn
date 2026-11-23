import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import {
  NAM_CA_NHAN,
  SO_MASTER,
  duongDanNamCaNhan,
  duongDanSoChuDao,
} from '@/lib/trang/than-so-hoc';
import { yNghia } from '@/lib/trang/than-so-hoc-y-nghia';
import {
  MAC_DINH_HUB,
  dinhDangTiLe,
  layThongKeSoChuDao,
  serializeJsonLd,
  taoSchemaCollectionPage,
} from './ThanSoHocHelpers';
import {
  BangChuPythagoras,
  DanhSachQuyUoc,
  DongGhiCongYNghia,
  GhiChuNgayDuong,
  KhoiGioiHan,
} from './ThanSoHocUi';

export const revalidate = 3600;

const SO_CO_BAN = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/than-so-hoc', MAC_DINH_HUB);
}

export default async function ThanSoHocHubPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/than-so-hoc', MAC_DINH_HUB),
    noiDungTheoDuongDan('/than-so-hoc'),
  ]);
  const daDung = trangDaDung();
  const tk = layThongKeSoChuDao();
  const jsonLd = taoSchemaCollectionPage(tt);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/than-so-hoc"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. Ba thẻ lớn */}
      <section className="ck-td-muc" aria-label="Công cụ thần số học">
        <div className="ck-tsh-hub-ba">
          <Link href="/than-so-hoc/so-chu-dao" className="ck-tsh-hub-the">
            <span className="ck-tsh-hub-ky" aria-hidden="true">
              1–9 · 11 · 22 · 33
            </span>
            <h2>Tính số chủ đạo</h2>
            <p>
              Cộng chữ số ngày sinh dương lịch theo hai quy ước (cộng dồn và rút từng phần), kèm năm cá nhân năm nay và năm sau.
            </p>
            <span className="ck-nut ck-nut-son">Mở công cụ số chủ đạo</span>
          </Link>

          <Link href="/than-so-hoc/bieu-do-ngay-sinh" className="ck-tsh-hub-the">
            <span className="ck-tsh-hub-ky" aria-hidden="true">
              3 × 3
            </span>
            <h2>Biểu đồ ngày sinh</h2>
            <p>
              Sắp chữ số vào lưới 3 × 3, đếm số có và số thiếu, liệt kê đường đủ và đường trống 3 ô, tính 4 đỉnh cao theo tuổi.
            </p>
            <span className="ck-nut ck-nut-vien">Xem biểu đồ ngày sinh</span>
          </Link>

          <Link href="/than-so-hoc/theo-ten" className="ck-tsh-hub-the">
            <span className="ck-tsh-hub-ky" aria-hidden="true">
              A–Z → 1–9
            </span>
            <h2>Theo họ tên</h2>
            <p>
              Quy đổi từng chữ cái tiếng Việt sang 1–9 ngay trên trình duyệt để tính Chỉ số tên, Linh hồn và Nhân cách.
            </p>
            <span className="ck-nut ck-nut-vien">Tính theo họ tên</span>
          </Link>
        </div>
      </section>

      {/* 2. Form ngày sinh nhỏ */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-mini-tieu">
        <h2 id="ck-tsh-mini-tieu" className="ck-td-tieu">
          Tính nhanh số chủ đạo theo ngày sinh
        </h2>
        <form
          className="ck-tsh-mini-form"
          action="/than-so-hoc/so-chu-dao"
          method="get"
        >
          <div className="ck-tsh-mini-hang">
            <label className="ck-tsh-mini-o" htmlFor="ck-tsh-hub-ngay">
              <span>Ngày sinh dương lịch (1900–2100)</span>
              <input
                id="ck-tsh-hub-ngay"
                name="ngay"
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                defaultValue="1990-08-15"
                required
              />
            </label>
            <button type="submit" className="ck-nut ck-nut-son ck-tsh-nut-chinh">
              Tính số chủ đạo
            </button>
          </div>
          <GhiChuNgayDuong daDung={daDung} />
        </form>
      </section>

      {/* 3. 12 số chủ đạo */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-12-so-tieu">
        <h2 id="ck-tsh-12-so-tieu" className="ck-td-tieu">
          12 số chủ đạo (tỉ lệ ngày sinh {tk.tu}–{tk.den}, cách 1)
        </h2>

        <div className="ck-tsh-so-luoi">
          {SO_CO_BAN.map((n) => {
            const manh = yNghia('so-chu-dao', n)?.loi.find((l) => l.k === 'manh')?.vb;
            return (
              <Link key={n} href={duongDanSoChuDao(n)} className="ck-tsh-so-o">
                <div className="ck-tsh-so-dau">
                  <strong>{n}</strong>
                  <span>{dinhDangTiLe(tk.cach1[n], tk.tongNgay)}</span>
                </div>
                {manh ? <p className="ck-tsh-yn-tom-luoc">{manh}</p> : null}
                <small>Cách tính số {n}</small>
              </Link>
            );
          })}
        </div>

        <h3 className="ck-tsh-nhom-so-tieu">Số giữ nguyên</h3>
        <div className="ck-tsh-so-luoi ck-tsh-so-luoi-master">
          {SO_MASTER.map((n) => {
            const manh = yNghia('so-chu-dao', n)?.loi.find((l) => l.k === 'manh')?.vb;
            return (
              <Link
                key={n}
                href={duongDanSoChuDao(n)}
                className="ck-tsh-so-o ck-tsh-so-o-master"
              >
                <div className="ck-tsh-so-dau">
                  <strong>{n}</strong>
                  <span>{dinhDangTiLe(tk.cach1[n], tk.tongNgay)}</span>
                </div>
                {manh ? <p className="ck-tsh-yn-tom-luoc">{manh}</p> : null}
                <small>Giữ nguyên, không rút tiếp</small>
              </Link>
            );
          })}
        </div>
        <DongGhiCongYNghia className="ck-tsh-yn-nguon-luoi" />
      </section>

      {/* 4. Năm cá nhân 1–9 */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-ncn-tieu">
        <h2 id="ck-tsh-ncn-tieu" className="ck-td-tieu">
          9 số năm cá nhân
        </h2>
        <div className="ck-tsh-nam-hang">
          {NAM_CA_NHAN.map((n) => {
            const moTa = yNghia('nam-ca-nhan', n)?.loi.find((l) => l.k === 'yNghia')?.vb;
            return (
              <Link key={n} href={duongDanNamCaNhan(n)} className="ck-tsh-nam-o">
                <div className="ck-tsh-so-dau">
                  <strong>{n}</strong>
                  <span>Năm cá nhân {n}</span>
                </div>
                {moTa ? <p className="ck-tsh-yn-tom-luoc">{moTa}</p> : null}
              </Link>
            );
          })}
        </div>
        <DongGhiCongYNghia className="ck-tsh-yn-nguon-luoi" />
      </section>

      {/* 5. Cách tính tóm tắt + bảng chữ cái */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-cach-tinh-tieu">
        <h2 id="ck-tsh-cach-tinh-tieu" className="ck-td-tieu">
          Cách tính tóm tắt
        </h2>
        <div className="ck-tsh-hop-giay">
          <ul className="ck-tsh-tom-tat-ds">
            <li>
              <strong>Số chủ đạo:</strong> cộng chữ số ngày sinh dương lịch rồi rút gọn về 1–9 (giữ 11, 22, 33).
            </li>
            <li>
              <strong>Năm cá nhân:</strong> cộng chữ số ngày sinh, tháng sinh với năm đang xét rồi rút gọn về 1–9.
            </li>
            <li>
              <strong>Theo tên:</strong> quy đổi từng chữ cái A–Z ra 1–9 theo bảng 9 cột dưới đây.
            </li>
          </ul>
        </div>
        <BangChuPythagoras />
      </section>

      {/* 6. Quy ước */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-quy-uoc-tieu">
        <h2 id="ck-tsh-quy-uoc-tieu" className="ck-td-tieu">
          Các điểm quy ước giữa các sách
        </h2>
        <div className="ck-tsh-hop-giay">
          <DanhSachQuyUoc />
        </div>
      </section>

      {/* 7. Diễn giải chỉ khi có nội dung đã duyệt */}
      {nd ? <KhoiDienGiai noiDung={nd} /> : null}

      {/* 8. Giới hạn */}
      <KhoiGioiHan />
    </KhungTrang>
  );
}

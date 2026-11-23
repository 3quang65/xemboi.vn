import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import {
  NGUON_HIEP_KY,
  TRICH,
  duongDanCungPhi,
  type CungBatTrach,
} from '@/lib/trang/phong-thuy';
import {
  CUNG_DONG_TU,
  CUNG_TAY_TU,
  MAC_DINH_HUB,
  serializeJsonLd,
  taoSchemaCollectionPage,
} from './PhongThuyHelpers';
import {
  GhiChuNamAm,
  GhiCongHiepKy,
  KhoiTrichDan,
} from './PhongThuyUi';

export const revalidate = 3600;

const CAU_DAN_HUB =
  'Cung phi theo năm sinh âm lịch, bảng 8 du niên Bát trạch, 24 sơn hướng nhà và Cửu tinh năm, tháng theo sách Hiệp kỷ biện phương thư.';

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/phong-thuy', MAC_DINH_HUB);
}

function LuoiNhomCung({
  tieuDe,
  danhSach,
}: {
  tieuDe: string;
  danhSach: CungBatTrach[];
}) {
  return (
    <div className="ck-pt-nhom-khoi">
      <h3>{tieuDe}</h3>
      <div className="ck-pt-cung-luoi">
        {danhSach.map((c) => (
          <Link
            key={c.slug}
            href={duongDanCungPhi(c)}
            className="ck-pt-cung-the"
          >
            <span className="ck-pt-cung-ky" aria-hidden="true">
              {c.kyHieu}
            </span>
            <strong className="ck-pt-cung-ten">{c.ten}</strong>
            <span className="ck-pt-cung-phuong">Phương {c.phuong}</span>
            <span className="ck-pt-cung-nhom">{c.nhom} tứ</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function PhongThuyHubPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/phong-thuy', MAC_DINH_HUB),
    noiDungTheoDuongDan('/phong-thuy'),
  ]);
  const daDung = trangDaDung();
  const jsonLd = taoSchemaCollectionPage(tt);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={CAU_DAN_HUB}
      duongDan="/phong-thuy"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. Ba thẻ lớn */}
      <section className="ck-td-muc" aria-label="Công cụ và bảng tra Bát trạch">
        <div className="ck-pt-hub-ba">
          <Link href="/phong-thuy/cung-phi" className="ck-pt-hub-the">
            <span className="ck-pt-hub-ky" aria-hidden="true">
              ☵ · ☶
            </span>
            <h2>Tra cung phi</h2>
            <p>
              Tính cung phi từ năm sinh âm lịch và giới tính (nam nghịch hành, nữ thuận hành) cùng 8 phương du niên.
            </p>
            <span className="ck-nut ck-nut-son">Mở công cụ cung phi</span>
          </Link>

          <Link href="/phong-thuy/bat-trach" className="ck-pt-hub-the">
            <span className="ck-pt-hub-ky" aria-hidden="true">
              ☰ … ☷
            </span>
            <h2>Bát trạch</h2>
            <p>
              Bảng 8 du niên (4 cát, 4 hung), bảng phối 8 × 8 và thứ tự phiên quái biến hào theo sách.
            </p>
            <span className="ck-nut ck-nut-vien">Xem bảng Bát trạch</span>
          </Link>

          <Link href="/phong-thuy/huong-nha" className="ck-pt-hub-the">
            <span className="ck-pt-hub-ky" aria-hidden="true">
              🧭 24 sơn
            </span>
            <h2>Hướng nhà</h2>
            <p>
              Đổi độ la bàn sang 24 sơn, quái hướng, quái tọa, Đông/Tây tứ trạch và đối chiếu với cung phi.
            </p>
            <span className="ck-nut ck-nut-vien">Xem hướng nhà</span>
          </Link>

          <Link href="/phong-thuy/cuu-tinh" className="ck-pt-hub-the">
            <span className="ck-pt-hub-ky" aria-hidden="true">
              ✦ 9 sao
            </span>
            <h2>Cửu tinh năm, tháng</h2>
            <p>
              Sao nào vào trung cung, bay tới phương nào, theo Hiệp kỷ.
            </p>
            <span className="ck-nut ck-nut-vien">Xem cửu tinh</span>
          </Link>
        </div>
      </section>

      {/* 2. Form nhỏ tra cung phi */}
      <section className="ck-td-muc" aria-labelledby="ck-pt-mini-tieu">
        <h2 id="ck-pt-mini-tieu" className="ck-td-tieu">
          Tra nhanh cung phi theo năm sinh
        </h2>
        <form
          className="ck-pt-mini-form"
          action="/phong-thuy/cung-phi"
          method="get"
        >
          <div className="ck-pt-mini-form-hang">
            <label className="ck-pt-mini-o" htmlFor="ck-pt-hub-nam">
              <span>Năm sinh âm lịch (1900–2100)</span>
              <input
                id="ck-pt-hub-nam"
                name="nam"
                type="text"
                inputMode="numeric"
                defaultValue="1990"
                required
              />
            </label>

            <label className="ck-pt-mini-o" htmlFor="ck-pt-hub-gt">
              <span>Giới tính</span>
              <select id="ck-pt-hub-gt" name="gt" defaultValue="nam">
                <option value="nam">Nam</option>
                <option value="nu">Nữ</option>
              </select>
            </label>

            <button type="submit" className="ck-nut ck-nut-son ck-pt-nut-chinh">
              Tra cung phi
            </button>
          </div>
          <GhiChuNamAm daDung={daDung} />
        </form>
      </section>

      {/* 3. 8 cung chia Đông tứ / Tây tứ */}
      <section className="ck-td-muc" aria-labelledby="ck-pt-8-cung-tieu">
        <h2 id="ck-pt-8-cung-tieu" className="ck-td-tieu">
          8 cung trong Bát trạch
        </h2>
        <div className="ck-pt-nhom-luoi">
          <LuoiNhomCung tieuDe="Đông tứ (Khảm, Ly, Chấn, Tốn)" danhSach={CUNG_DONG_TU} />
          <LuoiNhomCung tieuDe="Tây tứ (Càn, Khôn, Cấn, Đoài)" danhSach={CUNG_TAY_TU} />
        </div>
      </section>

      {/* 4. Trích sách */}
      <section className="ck-td-muc" aria-labelledby="ck-pt-trich-tieu">
        <h2 id="ck-pt-trich-tieu" className="ck-td-tieu">
          Trích từ Hiệp kỷ biện phương thư
        </h2>
        <KhoiTrichDan trich={TRICH.dongTayTuTrach} />
        <KhoiTrichDan trich={TRICH.daiDuNien} />
      </section>

      {/* 5. Diễn giải nếu có bài xuất bản */}
      {nd ? <KhoiDienGiai noiDung={nd} /> : null}

      {/* 6. Nguồn */}
      <section className="ck-td-muc" aria-labelledby="ck-pt-nguon-tieu">
        <h2 id="ck-pt-nguon-tieu" className="ck-td-tieu">
          Nguồn
        </h2>
        <div className="ck-pt-nguon-hop">
          <p>
            <strong>{NGUON_HIEP_KY.ten}</strong> — {NGUON_HIEP_KY.nam}; bản{' '}
            {NGUON_HIEP_KY.ban} ({NGUON_HIEP_KY.giayPhep}).
          </p>
        </div>
        <GhiCongHiepKy daDung={daDung} />
      </section>
    </KhungTrang>
  );
}

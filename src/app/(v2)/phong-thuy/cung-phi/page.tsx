import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { namSinhHopLe } from '@/lib/trang/can-chi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  GHI_CHU_GUI_CUNG,
  TRICH,
  duongDanCungPhi,
  tinhCungPhi,
  type KetQuaCungPhi,
} from '@/lib/trang/phong-thuy';
import {
  GOC_SITE,
  MAC_DINH_CUNG_PHI,
  NAM_PT_DEN,
  NAM_PT_TU,
  NGUYEN_KHOI,
  kiemCoThamSo,
  layMot,
  phanTichGioiTinh,
  phanTichNam,
  serializeJsonLd,
  taoSchemaWebApplication,
  type SearchParamsInput,
} from '../PhongThuyHelpers';
import {
  BangBatPhuong,
  GhiChuNamAm,
  GhiCongHiepKy,
  KhoiTrichDan,
  ThanhTamCung,
} from '../PhongThuyUi';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/phong-thuy/cung-phi', MAC_DINH_CUNG_PHI),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}/phong-thuy/cung-phi` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function CungPhiPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/phong-thuy/cung-phi', MAC_DINH_CUNG_PHI),
    searchParams,
  ]);
  const daDung = trangDaDung();
  const jsonLd = taoSchemaWebApplication(tt);

  const namRaw = layMot(sp.nam)?.trim() ?? '';
  const gtRaw = layMot(sp.gt)?.trim() ?? '';
  const coNhap = namRaw !== '' || gtRaw !== '';

  let loi: string | null = null;
  let ketQua: KetQuaCungPhi | null = null;

  if (coNhap) {
    const nam = phanTichNam(namRaw);
    const gt = phanTichGioiTinh(gtRaw);
    if (!namRaw || nam === null) {
      loi = `Năm sinh âm lịch hợp lệ là số nguyên từ ${NAM_PT_TU} đến ${NAM_PT_DEN}.`;
    } else if (!gt) {
      loi = 'Vui lòng chọn giới tính (Nam hoặc Nữ).';
    } else {
      ketQua = tinhCungPhi(nam, gt);
    }
  }

  const macDinhNam = namRaw || '';
  const macDinhGt = gtRaw === 'nu' ? 'nu' : 'nam';

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/phong-thuy/cung-phi"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. Form nhập năm sinh âm lịch + giới tính */}
      <div className="ck-pt-form-khung">
        <form className="ck-to-giay" action="/phong-thuy/cung-phi" method="get">
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2>Nhập năm sinh âm lịch</h2>
            <HoaVanMay flipped />
          </div>

          {loi ? (
            <div className="ck-loi" role="alert">
              {loi}
            </div>
          ) : null}

          <div className="ck-pt-form-2cot">
            <label className="ck-o-con" htmlFor="ck-cp-nam">
              <span>Năm sinh âm lịch ({NAM_PT_TU}–{NAM_PT_DEN})</span>
              <input
                id="ck-cp-nam"
                name="nam"
                type="text"
                inputMode="numeric"
                defaultValue={macDinhNam}
                placeholder="Ví dụ: 1990"
                required
              />
            </label>

            <div className="ck-o-nhap">
              <span className="ck-nhan-o">Giới tính</span>
              <div className="ck-chon">
                <label>
                  <input
                    type="radio"
                    name="gt"
                    value="nam"
                    defaultChecked={macDinhGt === 'nam'}
                  />
                  <span>Nam</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="gt"
                    value="nu"
                    defaultChecked={macDinhGt === 'nu'}
                  />
                  <span>Nữ</span>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="ck-nut ck-nut-son ck-nut-lon ck-pt-nut-chinh">
            Tra cung phi
          </button>

          <GhiChuNamAm daDung={daDung} />
        </form>
      </div>

      {/* 2 & 3. Kết quả cung phi + Bảng 8 phương */}
      {ketQua ? (
        <section className="ck-td-muc" aria-labelledby="ck-cp-ket-qua">
          <h2 id="ck-cp-ket-qua" className="ck-td-tieu">
            Kết quả cung phi năm {ketQua.nam} ({ketQua.gioiTinh === 'nam' ? 'Nam' : 'Nữ'})
          </h2>

          <div className="ck-pt-ket-qua-dau">
            <div className="ck-pt-dau-chinh">
              <span className="ck-pt-ky-lon" aria-hidden="true">
                {ketQua.cung.kyHieu}
              </span>
              <div>
                <h3 className="ck-pt-ten-lon">
                  Cung {ketQua.cung.ten} {ketQua.cung.kyHieu}{' '}
                  <span lang="zh-Hant" className="ck-pt-han-lon">
                    {ketQua.cung.han}
                  </span>
                </h3>
                {ketQua.guiCung ? (
                  <p className="ck-pt-gui-cung">{GHI_CHU_GUI_CUNG}</p>
                ) : null}
                <div className="ck-pt-thong-tin-dong">
                  <span>
                    Số cửu cung: <b>{ketQua.so}</b>
                    {ketQua.guiCung
                      ? ` (gửi cung ${ketQua.cung.ten}, số ${ketQua.cung.so})`
                      : ''}
                  </span>
                  <span>·</span>
                  <span>
                    Hành:{' '}
                    <HuyHieuHanh
                      hanh={ketQua.hanh}
                      lienKet={daDung.has('/ngu-hanh')}
                    />
                  </span>
                  <span>·</span>
                  <b>{ketQua.nhom}</b>
                  <span>·</span>
                  <span>
                    Năm {ketQua.nam} <b>{ketQua.canChi}</b> ({ketQua.nguyen})
                  </span>
                </div>
              </div>
            </div>

            <div className="ck-pt-lien-ket-cung">
              <Link href={duongDanCungPhi(ketQua.cung)} className="ck-nut ck-nut-vien">
                Xem trang cung {ketQua.cung.ten} →
              </Link>
              {daDung.has('/sinh-nam') && namSinhHopLe(ketQua.nam) ? (
                <Link href={`/sinh-nam/${ketQua.nam}`} className="ck-nut ck-nut-vien">
                  Sinh năm {ketQua.nam} mệnh gì →
                </Link>
              ) : null}
            </div>
          </div>

          <h3 className="ck-td-tieu">8 phương theo cung {ketQua.cung.ten}</h3>
          <BangBatPhuong cungTen={ketQua.cung.ten} />
        </section>
      ) : null}

      {/* 4. Cách tính (luôn hiện) */}
      <section className="ck-td-muc" aria-labelledby="ck-cp-cach-tinh">
        <h2 id="ck-cp-cach-tinh" className="ck-td-tieu">
          Cách tính cung phi theo Tam nguyên
        </h2>

        <KhoiTrichDan trich={TRICH.cuuCungKienTrach} />
        <KhoiTrichDan
          trich={TRICH.khangHy23}
          nhan="Mốc tam nguyên: năm Khang Hy thứ 23 (1684) là Thượng nguyên"
        />
        <KhoiTrichDan trich={TRICH.caiChinh} />

        <div className="ck-bang-khung" style={{ marginTop: 16 }}>
          <table className="ck-bang ck-bang-the">
            <thead>
              <tr>
                <th>Nguyên</th>
                <th>Khoảng năm</th>
                <th>Nam khởi (Giáp Tý)</th>
                <th>Nữ khởi (Giáp Tý)</th>
              </tr>
            </thead>
            <tbody>
              {NGUYEN_KHOI.map((n) => (
                <tr key={n.ten}>
                  <td data-nhan="Nguyên">
                    <b>{n.ten}</b>
                  </td>
                  <td data-nhan="Khoảng năm">
                    {n.tu}–{n.den}
                  </td>
                  <td data-nhan="Nam khởi">{n.namKhoi}</td>
                  <td data-nhan="Nữ khởi">{n.nuKhoi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="ck-pt-cach-tinh-dong">
          Nam đếm lùi (nghịch hành), nữ đếm tới (thuận hành) mỗi năm một cung, chu kỳ 9 năm.
        </p>

        <p className="ck-pt-gui-cung">{GHI_CHU_GUI_CUNG}</p>
      </section>

      {/* 5. Thanh 8 cung & liên kết */}
      <section className="ck-td-muc" aria-labelledby="ck-cp-8-cung">
        <h2 id="ck-cp-8-cung" className="ck-td-tieu">
          8 trang cung Bát trạch
        </h2>
        <ThanhTamCung />
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/phong-thuy">Tổng quan Phong thủy</Link>
          <Link href="/phong-thuy/bat-trach">Bảng Bát trạch (8 du niên)</Link>
          <Link href="/phong-thuy/huong-nha">Xem hướng nhà theo độ la bàn</Link>
          {daDung.has('/sinh-nam') ? (
            <Link href="/sinh-nam">Tra mệnh theo năm sinh</Link>
          ) : null}
          {daDung.has('/ngu-hanh') ? (
            <Link href="/ngu-hanh">Ngũ hành sinh khắc</Link>
          ) : null}
        </div>
      </nav>

      <GhiCongHiepKy daDung={daDung} />
    </KhungTrang>
  );
}

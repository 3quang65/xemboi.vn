import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { namSinhHopLe } from '@/lib/trang/can-chi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  GHI_CHU_GUI_CUNG,
  TRICH,
  duNienGiua,
  duongDanCungPhi,
  tinhCungPhi,
  xetHuong,
  type KetQuaCungPhi,
  type KetQuaHuong,
} from '@/lib/trang/phong-thuy';
import {
  CUNG_THEO_CHIEU_KIM,
  GOC_SITE,
  MAC_DINH_HUONG_NHA,
  NAM_PT_DEN,
  NAM_PT_TU,
  dinhDangDo,
  kiemCoThamSo,
  layMot,
  phanTichDo,
  phanTichGioiTinh,
  phanTichNam,
  serializeJsonLd,
  taoSchemaWebApplication,
  type SearchParamsInput,
} from '../PhongThuyHelpers';
import {
  GhiCongHiepKy,
  HuyHieuCatHung,
  KhoiTrichDan,
} from '../PhongThuyUi';
import FormHuongNhaClient from './FormHuongNhaClient';
import VongHaiTuSonSvg from './VongHaiTuSonSvg';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/phong-thuy/huong-nha', MAC_DINH_HUONG_NHA),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}/phong-thuy/huong-nha` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function HuongNhaPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/phong-thuy/huong-nha', MAC_DINH_HUONG_NHA),
    searchParams,
  ]);
  const daDung = trangDaDung();
  const jsonLd = taoSchemaWebApplication(tt);

  const doRaw = layMot(sp.do)?.trim() ?? '';
  const namRaw = layMot(sp.nam)?.trim() ?? '';
  const gtRaw = layMot(sp.gt)?.trim() ?? '';
  const coNhap = doRaw !== '' || namRaw !== '' || gtRaw !== '';

  let loi: string | null = null;
  let ketQuaHuong: KetQuaHuong | null = null;
  let ketQuaNguoi: KetQuaCungPhi | null = null;

  if (coNhap) {
    const doSo = doRaw ? phanTichDo(doRaw) : null;
    if (!doRaw) {
      loi = 'Vui lòng nhập độ la bàn của hướng nhà (từ 0 đến 359,9).';
    } else if (doSo === null) {
      loi = 'Độ la bàn hợp lệ nằm trong khoảng 0 đến 359,9.';
    } else if (namRaw !== '' || gtRaw !== '') {
      const nam = phanTichNam(namRaw);
      const gt = phanTichGioiTinh(gtRaw);
      if (!namRaw || nam === null) {
        loi = `Năm sinh âm lịch hợp lệ là số nguyên từ ${NAM_PT_TU} đến ${NAM_PT_DEN}.`;
      } else if (!gt) {
        loi = 'Khi nhập năm sinh, vui lòng chọn giới tính (Nam hoặc Nữ).';
      } else {
        ketQuaHuong = xetHuong(doSo);
        ketQuaNguoi = tinhCungPhi(nam, gt);
      }
    } else {
      ketQuaHuong = xetHuong(doSo);
    }
  }

  const gtHopLe = gtRaw === 'nam' || gtRaw === 'nu' ? gtRaw : '';
  const dnHuong =
    ketQuaHuong && ketQuaNguoi
      ? duNienGiua(ketQuaNguoi.cung.ten, ketQuaHuong.cungHuong.ten)
      : null;
  const dnToa =
    ketQuaHuong && ketQuaNguoi
      ? duNienGiua(ketQuaNguoi.cung.ten, ketQuaHuong.cungToa.ten)
      : null;

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/phong-thuy/huong-nha"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. Form nhập độ la bàn hướng nhà & năm sinh tùy chọn */}
      <div className="ck-pt-form-khung">
        <FormHuongNhaClient
          doBanDau={doRaw}
          namBanDau={namRaw}
          gtBanDau={gtHopLe}
          loi={loi}
          coLinkDoiNgay={daDung.has('/lich-am/doi-ngay')}
        />
      </div>

      {/* 2. Kết quả hướng, tọa, trạch & đối chiếu cung phi */}
      {ketQuaHuong ? (
        <section className="ck-td-muc" aria-labelledby="ck-hn-ket-qua">
          <h2 id="ck-hn-ket-qua" className="ck-td-tieu">
            Kết quả hướng {dinhDangDo(ketQuaHuong.doHuong)}
          </h2>

          <div className="ck-pt-huong-toa-luoi">
            <article className="ck-the-du-lieu">
              <span className="ck-nhan-nho">Hướng nhà</span>
              <strong className="ck-gia-lon">
                {dinhDangDo(ketQuaHuong.doHuong)} — Sơn {ketQuaHuong.sonHuong}
              </strong>
              <p>
                Quái:{' '}
                <Link href={duongDanCungPhi(ketQuaHuong.cungHuong)}>
                  {ketQuaHuong.cungHuong.kyHieu} {ketQuaHuong.cungHuong.ten}
                </Link>{' '}
                · Phương: <b>{ketQuaHuong.cungHuong.phuong}</b>
              </p>
            </article>

            <article className="ck-the-du-lieu">
              <span className="ck-nhan-nho">Tọa (phía sau nhà, ngược hướng)</span>
              <strong className="ck-gia-lon">
                {dinhDangDo(ketQuaHuong.doToa)} — Sơn {ketQuaHuong.sonToa}
              </strong>
              <p>
                Quái:{' '}
                <Link href={duongDanCungPhi(ketQuaHuong.cungToa)}>
                  {ketQuaHuong.cungToa.kyHieu} {ketQuaHuong.cungToa.ten}
                </Link>{' '}
                · Phương: <b>{ketQuaHuong.cungToa.phuong}</b>
              </p>
            </article>
          </div>

          <KhoiTrichDan trich={TRICH.sonHuong} />

          <p className="ck-pt-trach-dong">
            Nhà thuộc <strong>{ketQuaHuong.trach} tứ trạch</strong> (tính theo quái của tọa:{' '}
            {ketQuaHuong.cungToa.ten}).
          </p>

          {ketQuaNguoi && dnHuong && dnToa ? (
            <div className="ck-pt-ket-qua-dau">
              <h3 className="ck-pt-ten-lon" style={{ fontSize: 22 }}>
                Đối chiếu với cung {ketQuaNguoi.cung.ten} {ketQuaNguoi.cung.kyHieu} ({ketQuaNguoi.nam}{' '}
                {ketQuaNguoi.canChi}, {ketQuaNguoi.gioiTinh === 'nam' ? 'Nam' : 'Nữ'})
              </h3>
              {ketQuaNguoi.guiCung ? (
                <p className="ck-pt-gui-cung">{GHI_CHU_GUI_CUNG}</p>
              ) : null}
              <div className="ck-pt-thong-tin-dong">
                <span>
                  Số: <b>{ketQuaNguoi.so}</b>
                  {ketQuaNguoi.guiCung
                    ? ` (gửi cung ${ketQuaNguoi.cung.ten}, số ${ketQuaNguoi.cung.so})`
                    : ''}
                </span>
                <span>·</span>
                <span>
                  Hành:{' '}
                  <HuyHieuHanh
                    hanh={ketQuaNguoi.hanh}
                    lienKet={daDung.has('/ngu-hanh')}
                  />
                </span>
                <span>·</span>
                <b>{ketQuaNguoi.nhom}</b>
                <span>·</span>
                <Link href={duongDanCungPhi(ketQuaNguoi.cung)}>
                  Trang cung {ketQuaNguoi.cung.ten} →
                </Link>
                {daDung.has('/sinh-nam') && namSinhHopLe(ketQuaNguoi.nam) ? (
                  <>
                    <span>·</span>
                    <Link href={`/sinh-nam/${ketQuaNguoi.nam}`}>
                      Sinh năm {ketQuaNguoi.nam} →
                    </Link>
                  </>
                ) : null}
              </div>

              <ul className="ck-pt-doi-chieu-ds">
                <li>
                  <span>
                    Phương hướng nhà ({ketQuaHuong.cungHuong.phuong}) với cung{' '}
                    {ketQuaNguoi.cung.ten}: <b>{dnHuong.ten}</b>,{' '}
                    {dnHuong.cat ? 'cát' : 'hung'}
                  </span>
                  <HuyHieuCatHung cat={dnHuong.cat} />
                </li>
                <li>
                  <span>
                    Quái tọa {ketQuaHuong.cungToa.ten} với cung{' '}
                    {ketQuaNguoi.cung.ten}: <b>{dnToa.ten}</b>,{' '}
                    {dnToa.cat ? 'cát' : 'hung'}
                  </span>
                  <HuyHieuCatHung cat={dnToa.cat} />
                </li>
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* 3. Vòng 24 sơn (SVG) */}
      <section className="ck-td-muc" aria-labelledby="ck-hn-vong-tieu">
        <h2 id="ck-hn-vong-tieu" className="ck-td-tieu">
          Vòng 24 sơn và 8 quái
        </h2>
        <VongHaiTuSonSvg ketQua={ketQuaHuong} />
      </section>

      {/* 4. Cách tính (luôn hiện) */}
      <section className="ck-td-muc" aria-labelledby="ck-hn-cach-tinh-tieu">
        <h2 id="ck-hn-cach-tinh-tieu" className="ck-td-tieu">
          Cách quy đổi 24 sơn và 8 quái
        </h2>
        <KhoiTrichDan trich={TRICH.batCung} />

        <p className="ck-pt-cach-tinh-dong">
          24 sơn chia đều 360°, mỗi sơn 15°, Tý ở chính Bắc (352,5°–7,5°).
        </p>

        <div className="ck-bang-khung">
          <table className="ck-bang ck-bang-the">
            <thead>
              <tr>
                <th>Quái</th>
                <th>Phương</th>
                <th>3 sơn thuộc quái</th>
                <th>Khoảng độ la bàn</th>
                <th>Nhóm</th>
              </tr>
            </thead>
            <tbody>
              {CUNG_THEO_CHIEU_KIM.map((c) => (
                <tr key={c.slug}>
                  <td data-nhan="Quái">
                    <Link href={duongDanCungPhi(c)} className="ck-pt-quai-link">
                      <span aria-hidden="true">{c.kyHieu}</span> {c.ten}{' '}
                      <span lang="zh-Hant" className="ck-pt-han-inline">
                        {c.han}
                      </span>
                    </Link>
                  </td>
                  <td data-nhan="Phương">{c.phuong}</td>
                  <td data-nhan="3 sơn">{c.son.join(' – ')}</td>
                  <td data-nhan="Khoảng độ">
                    {dinhDangDo(c.tuDo)} – {dinhDangDo(c.denDo)}
                  </td>
                  <td data-nhan="Nhóm">{c.nhom} tứ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Ghi chú đo hướng */}
        <p className="ck-pt-cach-tinh-dong">
          Trang chỉ tính theo độ la bàn bạn nhập; đo hướng thế nào (cửa chính, mặt tiền) do bạn xác định.
        </p>
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/phong-thuy/cung-phi">Tra cung phi theo năm sinh</Link>
          <Link href="/phong-thuy/bat-trach">Bảng Bát trạch (8 du niên)</Link>
          {daDung.has('/sinh-nam') ? (
            <Link href="/sinh-nam">Tra mệnh theo năm sinh</Link>
          ) : null}
          <Link href="/phong-thuy">Tổng quan Phong thủy</Link>
        </div>
      </nav>

      {/* 6. Ghi công */}
      <GhiCongHiepKy daDung={daDung} />
    </KhungTrang>
  );
}

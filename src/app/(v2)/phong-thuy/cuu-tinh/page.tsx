import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import {
  CUU_TINH,
  NAM_CUU_TINH_DEN,
  NAM_CUU_TINH_TU,
  cuuTinhNam,
  thangTietTai,
  type NamCuuTinh,
} from '@/lib/trang/cuu-tinh';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  GOC_SITE,
  kiemCoThamSo,
  layMot,
  serializeJsonLd,
  taoSchemaWebApplication,
  type SearchParamsInput,
} from '../PhongThuyHelpers';
import { GhiCongHiepKy, KhoiTrichDan } from '../PhongThuyUi';
import {
  MAC_DINH_CUU_TINH,
  PHU_CUU_TINH,
  TRICH_DAN_CUU_TINH,
  lopMauSao,
  phanTichNamCuuTinh,
} from './CuuTinhHelpers';
import {
  DanhSachNamCuuTinh,
  KhoiCuuTinhNam,
  KhoiCuuTinhThang,
} from './CuuTinhUi';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/phong-thuy/cuu-tinh', MAC_DINH_CUU_TINH),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}/phong-thuy/cuu-tinh` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function CuuTinhPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/phong-thuy/cuu-tinh', MAC_DINH_CUU_TINH),
    searchParams,
  ]);
  const daDung = trangDaDung();
  const hienTai = thangTietTai(new Date());
  const jsonLd = taoSchemaWebApplication(tt);

  const namRaw = layMot(sp.nam)?.trim() ?? '';
  let loi: string | null = null;
  let data: NamCuuTinh | null = null;

  if (namRaw === '') {
    data = cuuTinhNam(hienTai.nam);
  } else {
    const namHopLe = phanTichNamCuuTinh(namRaw);
    if (namHopLe === null) {
      loi = `Năm hợp lệ là số nguyên từ ${NAM_CUU_TINH_TU} đến ${NAM_CUU_TINH_DEN}.`;
    } else {
      data = cuuTinhNam(namHopLe);
    }
  }

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={PHU_CUU_TINH}
      duongDan="/phong-thuy/cuu-tinh"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* Form chọn năm */}
      <section className="ck-td-muc" aria-labelledby="ck-pt-ct-chon-nam-tieu">
        <h2 id="ck-pt-ct-chon-nam-tieu" className="ck-sr">
          Chọn năm xem Cửu tinh
        </h2>
        <form
          className="ck-pt-mini-form ck-pt-ct-form"
          action="/phong-thuy/cuu-tinh"
          method="get"
        >
          {loi ? (
            <div className="ck-loi" role="alert">
              {loi}{' '}
              <Link href="/phong-thuy/cuu-tinh">
                Quay lại năm hiện tại ({hienTai.nam})
              </Link>
            </div>
          ) : null}

          <div className="ck-pt-mini-form-hang">
            <label className="ck-pt-mini-o ck-pt-ct-o-nam" htmlFor="ck-pt-ct-nam">
              <span>
                Năm dương lịch ({NAM_CUU_TINH_TU}–{NAM_CUU_TINH_DEN})
              </span>
              <input
                id="ck-pt-ct-nam"
                name="nam"
                type="text"
                inputMode="numeric"
                defaultValue={namRaw || String(hienTai.nam)}
                placeholder={`Ví dụ: ${hienTai.nam}`}
                required
              />
            </label>

            <button
              type="submit"
              className="ck-nut ck-nut-son ck-pt-nut-chinh"
            >
              Xem cửu tinh
            </button>
          </div>

          <p className="ck-pt-ghi-nam">
            Năm và tháng Cửu tinh tính theo tiết khí (mở đầu ở Lập xuân). Mặc định đang chọn năm{' '}
            <b>{hienTai.nam}</b>.
          </p>
        </form>
      </section>

      {/* Khối năm & 12 tháng */}
      {data ? (
        <>
          <KhoiCuuTinhNam data={data} hienLienKetTrangNam />
          <KhoiCuuTinhThang
            data={data}
            thangHienTai={data.nam === hienTai.nam ? hienTai.thang : undefined}
          />
        </>
      ) : null}

      {/* Cách tính theo sách (5 câu nguyên văn) */}
      <section className="ck-td-muc" aria-labelledby="ck-pt-ct-sach-tieu">
        <h2 id="ck-pt-ct-sach-tieu" className="ck-td-tieu">
          Cách tính theo sách
        </h2>
        {TRICH_DAN_CUU_TINH.map((m) => (
          <KhoiTrichDan key={m.khoa} trich={m.trich} nhan={m.nhan} />
        ))}
      </section>

      {/* Bảng 9 sao */}
      <section className="ck-td-muc" aria-labelledby="ck-pt-ct-9-sao-tieu">
        <h2 id="ck-pt-ct-9-sao-tieu" className="ck-td-tieu">
          Bảng 9 sao Cửu tinh
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang ck-bang-the">
            <thead>
              <tr>
                <th>Số</th>
                <th>Tên sao</th>
                <th>Chữ Hán</th>
                <th>Tên Bắc Đẩu</th>
                <th>Hành</th>
              </tr>
            </thead>
            <tbody>
              {CUU_TINH.map((s) => (
                <tr key={s.so}>
                  <td data-nhan="Số">
                    <b>{s.so}</b>
                  </td>
                  <td data-nhan="Tên sao">
                    <span className="ck-pt-ct-bang-ten">
                      <i
                        className={`ck-pt-ct-cham ${lopMauSao(s.so)}`}
                        aria-hidden="true"
                      />
                      <b>{s.ten}</b>
                    </span>
                  </td>
                  <td data-nhan="Chữ Hán">
                    <span lang="zh-Hant" className="ck-pt-han-inline">
                      {s.han}
                    </span>
                  </td>
                  <td data-nhan="Tên Bắc Đẩu">{s.tenBacDau}</td>
                  <td data-nhan="Hành">
                    <HuyHieuHanh
                      hanh={s.hanh}
                      lienKet={daDung.has('/ngu-hanh')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Liên kết các trang năm 2020–2035 */}
      <DanhSachNamCuuTinh />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          {daDung.has('/phong-thuy') ? (
            <Link href="/phong-thuy">Tổng quan Phong thủy</Link>
          ) : null}
          {daDung.has('/phong-thuy/cung-phi') ? (
            <Link href="/phong-thuy/cung-phi">Tra cung phi theo năm sinh</Link>
          ) : null}
          {daDung.has('/phong-thuy/bat-trach') ? (
            <Link href="/phong-thuy/bat-trach">Bảng Bát trạch (8 du niên)</Link>
          ) : null}
          {daDung.has('/phong-thuy/huong-nha') ? (
            <Link href="/phong-thuy/huong-nha">Xem hướng nhà theo độ la bàn</Link>
          ) : null}
        </div>
      </nav>

      <GhiCongHiepKy daDung={daDung} />
    </KhungTrang>
  );
}

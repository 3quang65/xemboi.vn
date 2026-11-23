import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  NAM_TRANG_CUU_TINH,
  cuuTinhNam,
  duongDanCuuTinh,
  thangTietTai,
} from '@/lib/trang/cuu-tinh';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  GOC_SITE,
  kiemCoThamSo,
  layMot,
  serializeJsonLd,
  type SearchParamsInput,
} from '../../PhongThuyHelpers';
import { GhiCongHiepKy } from '../../PhongThuyUi';
import {
  MAU_SEO_CUU_TINH_NAM,
  macDinhCuuTinhNam,
  phanTichLop,
  phanTichNamTrangRieng,
  phanTichThangTiet,
  taoSchemaCuuTinhWebPage,
  thamSoCuuTinhNam,
} from '../CuuTinhHelpers';
import {
  DanhSachNamCuuTinh,
  KhoiCuuTinhNam,
  KhoiCuuTinhThang,
} from '../CuuTinhUi';

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return NAM_TRANG_CUU_TINH.map((nam) => ({ nam: String(nam) }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ nam: string }>;
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [{ nam: namParam }, sp] = await Promise.all([params, searchParams]);
  const nam = phanTichNamTrangRieng(namParam);
  if (nam === null) notFound();

  const data = cuuTinhNam(nam);
  const duongDan = duongDanCuuTinh(nam);
  const base = await metaTrang(
    duongDan,
    macDinhCuuTinhNam(data),
    MAU_SEO_CUU_TINH_NAM,
    thamSoCuuTinhNam(data),
  );
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}${duongDan}` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function CuuTinhNamPage({
  params,
  searchParams,
}: {
  params: Promise<{ nam: string }>;
  searchParams: SearchParamsInput;
}) {
  const [{ nam: namParam }, sp] = await Promise.all([params, searchParams]);
  const nam = phanTichNamTrangRieng(namParam);
  if (nam === null) notFound();

  const data = cuuTinhNam(nam);
  const duongDan = duongDanCuuTinh(nam);
  const tt = await thongTinTrang(
    duongDan,
    macDinhCuuTinhNam(data),
    MAU_SEO_CUU_TINH_NAM,
    thamSoCuuTinhNam(data),
  );
  const daDung = trangDaDung();
  const hienTai = thangTietTai(new Date());
  const jsonLd = taoSchemaCuuTinhWebPage(tt);

  const lop = phanTichLop(layMot(sp.lop)?.trim());
  const thangMacDinh = data.nam === hienTai.nam ? hienTai.thang : 1;
  const thangChon = phanTichThangTiet(layMot(sp.thang)?.trim(), thangMacDinh);

  const coNamTruoc = NAM_TRANG_CUU_TINH.includes(nam - 1);
  const coNamSau = NAM_TRANG_CUU_TINH.includes(nam + 1);

  return (
    <KhungTrang
      tieuDe={`Cửu tinh năm ${data.nam} (${data.canChi})`}
      phu={tt.description}
      duongDan={duongDan}
      tenCuoi={`Cửu tinh năm ${data.nam}`}
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <KhoiCuuTinhNam
        data={data}
        basePath={duongDan}
        lop={lop}
        thangChon={thangChon}
        thangHienTai={data.nam === hienTai.nam ? hienTai.thang : undefined}
      />

      <KhoiCuuTinhThang
        data={data}
        thangHienTai={data.nam === hienTai.nam ? hienTai.thang : undefined}
      />

      {/* Điều hướng năm trước, trang chính, năm sau */}
      <nav
        className="ck-pt-ct-dieu-huong"
        aria-label="Chuyển nhanh theo năm"
      >
        {coNamTruoc ? (
          <Link href={duongDanCuuTinh(nam - 1)} className="ck-nut ck-nut-vien">
            ← Cửu tinh năm {nam - 1}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href="/phong-thuy/cuu-tinh"
          className="ck-nut ck-nut-son ck-pt-nut-chinh"
        >
          Tra Cửu tinh năm khác (1901–2099)
        </Link>
        {coNamSau ? (
          <Link href={duongDanCuuTinh(nam + 1)} className="ck-nut ck-nut-vien">
            Cửu tinh năm {nam + 1} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <DanhSachNamCuuTinh namHienTai={nam} />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/phong-thuy/cuu-tinh">Công cụ Cửu tinh năm, tháng</Link>
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

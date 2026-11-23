import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { DocNhanh, ThuatNgu, type TheDocNhanhItem } from '@/components/ck/truc-quan';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { docNhanhThanSo } from '@/lib/trang/phan-truc-quan';
import {
  NAM_CA_NHAN,
  bieuDoNgaySinh,
  docNgay,
  duongDanNamCaNhan,
  duongDanSoChuDao,
  isoNgay,
  namCaNhan,
  ngayCoNamCaNhan,
  soChuDao,
  soTuSlug,
  vietNgay,
} from '@/lib/trang/than-so-hoc';
import { yNghia } from '@/lib/trang/than-so-hoc-y-nghia';
import {
  GOC_SITE,
  MAU_SEO_NAM_CA_NHAN,
  dinhDangBuoc,
  kiemCoThamSo,
  layMot,
  macDinhNamCaNhan,
  serializeJsonLd,
  taoSchemaDefinedTermNamCaNhan,
  taoSchemaWebPage,
  type SearchParamsInput,
} from '../../ThanSoHocHelpers';
import {
  BonDinhCaoTrucQuan,
  KhoiGioiHan,
  KhoiYNghia,
  LuoiBieuDoNgaySinh,
  NGHIA_THUAT_NGU_TSH,
  ThanhNamCaNhan,
  VongTronSoChuDao,
} from '../../ThanSoHocUi';

export const revalidate = 3600;

export function generateStaticParams() {
  return NAM_CA_NHAN.map((n) => ({ so: String(n) }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ so: string }>;
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [{ so }, sp] = await Promise.all([params, searchParams]);
  const n = soTuSlug(so, NAM_CA_NHAN);
  if (n === undefined) notFound();

  const duongDan = duongDanNamCaNhan(n);
  const base = await metaTrang(duongDan, macDinhNamCaNhan(n), MAU_SEO_NAM_CA_NHAN, {
    n: String(n),
  });
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}${duongDan}` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

function BangNgayTrongNam({
  nam,
  so,
  bang,
}: {
  nam: number;
  so: number;
  bang: { thang: number; ngay: number[] }[];
}) {
  return (
    <div className="ck-tsh-nam-bang-boc">
      <h3>
        Năm {nam} (năm cá nhân {so})
      </h3>
      <table className="ck-tsh-bang-thang">
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Ngày sinh rơi vào số {so}</th>
          </tr>
        </thead>
        <tbody>
          {bang.map((dong) => (
            <tr key={dong.thang}>
              <th>Tháng {dong.thang}</th>
              <td>{dong.ngay.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function NamCaNhanChiTietPage({
  params,
  searchParams,
}: {
  params: Promise<{ so: string }>;
  searchParams: SearchParamsInput;
}) {
  const [{ so }, sp] = await Promise.all([params, searchParams]);
  const n = soTuSlug(so, NAM_CA_NHAN);
  if (n === undefined) notFound();

  const duongDan = duongDanNamCaNhan(n);
  const tt = await thongTinTrang(
    duongDan,
    macDinhNamCaNhan(n),
    MAU_SEO_NAM_CA_NHAN,
    { n: String(n) },
  );

  const ngayRaw = layMot(sp.ngay)?.trim() ?? '';
  const ngaySinh = ngayRaw ? docNgay(ngayRaw) : undefined;
  const loiNgay =
    ngayRaw && !ngaySinh
      ? 'Ngày sinh dương lịch không hợp lệ (1900–2100).'
      : null;

  const namNay = ngayHienTaiVN().nam;
  const namSau = namNay + 1;
  const bangNay = ngayCoNamCaNhan(n, namNay);
  const bangSau = ngayCoNamCaNhan(n, namSau);

  const dongDau = bangNay.find((d) => d.ngay.length > 0)!;
  const ngayDau = dongDau.ngay[0];
  const thangDau = dongDau.thang;
  const kqViDu = namCaNhan(ngayDau, thangDau, namNay);
  const yNghiaSo = yNghia('nam-ca-nhan', n);

  const docNhanh = ngaySinh ? docNhanhThanSo(ngaySinh, namNay) : null;
  const kqSoChuDao = ngaySinh ? soChuDao(ngaySinh) : null;
  const bieuDo = ngaySinh ? bieuDoNgaySinh(ngaySinh) : null;

  const hienNhanDocNhanh = (muc: TheDocNhanhItem) => {
    if (muc.ma === 'so-chu-dao') {
      return (
        <ThuatNgu
          ten={muc.nhan}
          nghia={NGHIA_THUAT_NGU_TSH.soChuDao}
          id="ck-ncn-tn-scd"
        />
      );
    }
    if (muc.ma === 'nam-ca-nhan') {
      return (
        <ThuatNgu
          ten={muc.nhan}
          nghia={NGHIA_THUAT_NGU_TSH.namCaNhan}
          id="ck-ncn-tn-ncn"
        />
      );
    }
    if (muc.ma === 'dinh-cao') {
      return (
        <ThuatNgu
          ten={muc.nhan}
          nghia={NGHIA_THUAT_NGU_TSH.dinhCao}
          id="ck-ncn-tn-dc"
        />
      );
    }
    return muc.nhan;
  };

  const giaTriInput = ngaySinh
    ? isoNgay(ngaySinh)
    : /^\d{4}-\d{2}-\d{2}$/.test(ngayRaw)
      ? ngayRaw
      : '';

  const schemaTerm = taoSchemaDefinedTermNamCaNhan(n, tt.canonical);
  const schemaWebPage = taoSchemaWebPage(tt);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={duongDan}
      tenCuoi={`Năm cá nhân ${n}`}
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaTerm) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaWebPage) }}
      />

      {/* 1. Đầu trang: vòng tròn số lớn + cách tính + ví dụ đầu tiên */}
      <section className="ck-tsh-dau-the" aria-label={`Cách tính năm cá nhân ${n}`}>
        <div className="ck-tsh-dau-trai">
          <span className="ck-tsh-vong-so ck-tsh-vong-nho" aria-hidden="true">
            <span className="ck-tsh-vong-chu">{n}</span>
          </span>
          <div>
            <h2 className="ck-tsh-dau-ten">
              <ThuatNgu
                ten="Năm cá nhân"
                nghia={NGHIA_THUAT_NGU_TSH.namCaNhan}
                id="ck-ncn-dau-tn"
              />{' '}
              {n}
            </h2>
            <p className="ck-tsh-dau-phu">
              Cộng chữ số ngày sinh, tháng sinh với năm đang xét, rút về 1–9.
            </p>
            <p className="ck-tsh-dau-phu">
              Ví dụ ngày{' '}
              <b>
                {String(ngayDau).padStart(2, '0')}/{String(thangDau).padStart(2, '0')}
              </b>{' '}
              trong năm {namNay}: <code>{kqViDu.phepCong}</code> (rút gọn:{' '}
              {dinhDangBuoc(kqViDu.buoc, [])}).
            </p>
          </div>
        </div>
        <Link
          href="/than-so-hoc/so-chu-dao"
          className="ck-nut ck-nut-son ck-tsh-nut-chinh"
        >
          Tính năm cá nhân của bạn
        </Link>
      </section>

      {/* 1b. Nhập ngày sinh để xem trực quan ngay trên trang */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-ncn-tra-tieu">
        <h2 id="ck-tsh-ncn-tra-tieu" className="ck-td-tieu">
          Kiểm tra theo ngày sinh của bạn
        </h2>
        <form className="ck-tsh-mini-form" action={duongDan} method="get">
          {loiNgay ? (
            <div className="ck-loi" role="alert" style={{ marginBottom: 12 }}>
              {loiNgay}
            </div>
          ) : null}
          <div className="ck-tsh-mini-hang">
            <label className="ck-tsh-mini-o" htmlFor="ck-tsh-ncn-ngay">
              <span>Ngày sinh dương lịch (1900–2100)</span>
              <input
                id="ck-tsh-ncn-ngay"
                name="ngay"
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                defaultValue={giaTriInput}
                required
              />
            </label>
            <button type="submit" className="ck-nut ck-nut-son ck-tsh-nut-chinh">
              Xem chỉ số ngày sinh
            </button>
          </div>
        </form>

        {ngaySinh && docNhanh && kqSoChuDao && bieuDo ? (
          <div style={{ marginTop: 20 }}>
            <DocNhanh
              cau={docNhanh.cau}
              the={docNhanh.the}
              luoiCot={4}
              tieuDe={`Kết quả ngày ${vietNgay(ngaySinh)}`}
              tieuDeId="ck-tsh-ncn-dn"
              hienNhan={hienNhanDocNhanh}
            />

            <VongTronSoChuDao
              so={kqSoChuDao.cach1.so}
              phepCong={kqSoChuDao.cach1.phepCong}
              buoc={kqSoChuDao.cach1.buoc}
              nhan="Số chủ đạo"
              href={duongDanSoChuDao(kqSoChuDao.cach1.so)}
              thuatNguId="ck-ncn-vong-scd"
              thuatNguNghia={NGHIA_THUAT_NGU_TSH.soChuDao}
            />

            <h3 className="ck-tsh-nhom-so-tieu">
              4{' '}
              <ThuatNgu
                ten="đỉnh cao"
                nghia={NGHIA_THUAT_NGU_TSH.dinhCao}
                id="ck-ncn-tieu-dc"
              />{' '}
              theo tuổi
            </h3>
            <BonDinhCaoTrucQuan
              ngaySinh={ngaySinh}
              namXet={namNay}
              dinhCao={docNhanh.dinhCao}
              chiSoDinhHienTai={docNhanh.chiSoDinhHienTai}
            />

            <h3 className="ck-tsh-nhom-so-tieu">Lưới ngày sinh 3 × 3</h3>
            <LuoiBieuDoNgaySinh
              bieuDo={bieuDo}
              idPrefix="ck-ncn-bd"
              moTa={`Lưới 3 × 3 biểu đồ ngày sinh ${vietNgay(ngaySinh)}`}
            />
          </div>
        ) : null}
      </section>

      {/* 2. Ý nghĩa năm cá nhân {n} */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-yn-tieu">
        <h2 id="ck-tsh-yn-tieu" className="ck-td-tieu">
          Ý nghĩa năm cá nhân {n}
        </h2>
        <KhoiYNghia y={yNghiaSo} />
      </section>

      {/* 3. Bảng ngày sinh năm nay và năm sau */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-ncn-bang-tieu">
        <h2 id="ck-tsh-ncn-bang-tieu" className="ck-td-tieu">
          Ngày sinh có năm cá nhân {n} ({namNay} và {namSau})
        </h2>
        <div className="ck-tsh-hai-nam-luoi">
          <BangNgayTrongNam nam={namNay} so={n} bang={bangNay} />
          <BangNgayTrongNam nam={namSau} so={n} bang={bangSau} />
        </div>
      </section>

      {/* 3. Quy ước */}
      <p className="ck-tsh-so-sanh-dong">
        Sách lấy mốc đổi năm cá nhân là 1/1, sách lấy ngày sinh nhật.
      </p>

      {/* 5. Thanh 9 số & liên kết */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-ncn-thanh">
        <h2 id="ck-tsh-ncn-thanh" className="ck-td-tieu">
          Chuyển nhanh 9 năm cá nhân
        </h2>
        <ThanhNamCaNhan hienTai={n} />
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/than-so-hoc/so-chu-dao">
            Tính số chủ đạo và năm cá nhân của bạn
          </Link>
          <Link href="/than-so-hoc">Tổng quan Thần số học</Link>
          <Link href="/than-so-hoc/bieu-do-ngay-sinh">Biểu đồ ngày sinh</Link>
          <Link href="/than-so-hoc/theo-ten">Thần số học theo tên</Link>
        </div>
      </nav>

      {/* 6. Giới hạn */}
      <KhoiGioiHan />
    </KhungTrang>
  );
}

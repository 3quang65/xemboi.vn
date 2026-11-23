import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  NAM_CA_NHAN,
  duongDanNamCaNhan,
  namCaNhan,
  ngayCoNamCaNhan,
  soTuSlug,
} from '@/lib/trang/than-so-hoc';
import { yNghia } from '@/lib/trang/than-so-hoc-y-nghia';
import {
  MAU_SEO_NAM_CA_NHAN,
  dinhDangBuoc,
  macDinhNamCaNhan,
  serializeJsonLd,
  taoSchemaDefinedTermNamCaNhan,
  taoSchemaWebPage,
} from '../../ThanSoHocHelpers';
import {
  KhoiGioiHan,
  KhoiYNghia,
  ThanhNamCaNhan,
} from '../../ThanSoHocUi';

export const revalidate = 3600;

export function generateStaticParams() {
  return NAM_CA_NHAN.map((n) => ({ so: String(n) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ so: string }>;
}): Promise<Metadata> {
  const { so } = await params;
  const n = soTuSlug(so, NAM_CA_NHAN);
  if (n === undefined) notFound();

  const duongDan = duongDanNamCaNhan(n);
  return metaTrang(duongDan, macDinhNamCaNhan(n), MAU_SEO_NAM_CA_NHAN, {
    n: String(n),
  });
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
}: {
  params: Promise<{ so: string }>;
}) {
  const { so } = await params;
  const n = soTuSlug(so, NAM_CA_NHAN);
  if (n === undefined) notFound();

  const duongDan = duongDanNamCaNhan(n);
  const tt = await thongTinTrang(
    duongDan,
    macDinhNamCaNhan(n),
    MAU_SEO_NAM_CA_NHAN,
    { n: String(n) },
  );

  const namNay = ngayHienTaiVN().nam;
  const namSau = namNay + 1;
  const bangNay = ngayCoNamCaNhan(n, namNay);
  const bangSau = ngayCoNamCaNhan(n, namSau);

  const dongDau = bangNay.find((d) => d.ngay.length > 0)!;
  const ngayDau = dongDau.ngay[0];
  const thangDau = dongDau.thang;
  const kqViDu = namCaNhan(ngayDau, thangDau, namNay);
  const yNghiaSo = yNghia('nam-ca-nhan', n);

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

      {/* 1. Đầu trang: số lớn + cách tính + ví dụ đầu tiên */}
      <section className="ck-tsh-dau-the" aria-label={`Cách tính năm cá nhân ${n}`}>
        <div className="ck-tsh-dau-trai">
          <span className="ck-tsh-so-trien" aria-hidden="true">
            {n}
          </span>
          <div>
            <h2 className="ck-tsh-dau-ten">Năm cá nhân {n}</h2>
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

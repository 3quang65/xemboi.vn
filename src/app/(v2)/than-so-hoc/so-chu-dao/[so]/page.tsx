import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  SO_CHU_DAO,
  SO_MASTER,
  duongDanSoChuDao,
  isoNgay,
  soChuDao,
  soGoc,
  soTuSlug,
  tongDanToi,
  viDuTheoNam,
  vietNgay,
} from '@/lib/trang/than-so-hoc';
import {
  MAU_SEO_SO_CHU_DAO,
  dinhDangBuoc,
  dinhDangSo,
  dinhDangTiLe,
  laSoMaster,
  layThongKeSoChuDao,
  macDinhSoChuDao,
  serializeJsonLd,
  taoSchemaDefinedTermSoChuDao,
  taoSchemaWebPage,
} from '../../ThanSoHocHelpers';
import {
  KhoiGhiChuYNghia,
  KhoiGioiHan,
  ThanhSoChuDao,
} from '../../ThanSoHocUi';

export const revalidate = 3600;

export function generateStaticParams() {
  return SO_CHU_DAO.map((n) => ({ so: String(n) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ so: string }>;
}): Promise<Metadata> {
  const { so } = await params;
  const n = soTuSlug(so, SO_CHU_DAO);
  if (n === undefined) notFound();

  const duongDan = duongDanSoChuDao(n);
  return metaTrang(duongDan, macDinhSoChuDao(n), MAU_SEO_SO_CHU_DAO, {
    n: String(n),
  });
}

export default async function SoChuDaoChiTietPage({
  params,
}: {
  params: Promise<{ so: string }>;
}) {
  const { so } = await params;
  const n = soTuSlug(so, SO_CHU_DAO);
  if (n === undefined) notFound();

  const duongDan = duongDanSoChuDao(n);
  const tt = await thongTinTrang(
    duongDan,
    macDinhSoChuDao(n),
    MAU_SEO_SO_CHU_DAO,
    { n: String(n) },
  );

  const tk = layThongKeSoChuDao();
  const tongHopLe = tongDanToi(n, tk.tongMin, tk.tongMax);
  const viDuNam = viDuTheoNam(n);

  const masterGiu = laSoMaster(n);
  const soMasterUng = n === 2 ? 11 : n === 4 ? 22 : n === 6 ? 33 : null;

  const schemaTerm = taoSchemaDefinedTermSoChuDao(n, tt.canonical);
  const schemaWebPage = taoSchemaWebPage(tt);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={duongDan}
      tenCuoi={`Số chủ đạo ${n}`}
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

      {/* 1. Đầu trang: số lớn */}
      <section className="ck-tsh-dau-the" aria-label={`Thông tin số chủ đạo ${n}`}>
        <div className="ck-tsh-dau-trai">
          <span className="ck-tsh-so-trien" aria-hidden="true">
            {n}
          </span>
          <div>
            <h2 className="ck-tsh-dau-ten">Số chủ đạo {n}</h2>
            <p className="ck-tsh-dau-phu">
              Thống kê phép tính và tần suất ngày sinh {tk.tu}–{tk.den} cho số {n}.
            </p>
            {masterGiu ? (
              <p className="ck-tsh-ghi-giu">
                Số giữ nguyên, không rút về {soGoc(n)}
              </p>
            ) : null}
          </div>
        </div>
        <Link
          href="/than-so-hoc/so-chu-dao"
          className="ck-nut ck-nut-son ck-tsh-nut-chinh"
        >
          Tính ngày sinh của bạn
        </Link>
      </section>

      {/* 2. Tổng nào ra {n} */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-tong-tieu">
        <h2 id="ck-tsh-tong-tieu" className="ck-td-tieu">
          Tổng nào ra {n}
        </h2>
        <div className="ck-tsh-hop-giay">
          <p>
            Khi cộng mọi chữ số ngày sinh dương lịch (ngày sinh {tk.tu}–{tk.den} có tổng từ {tk.tongMin} đến {tk.tongMax}), các tổng rút gọn ra <strong>{n}</strong> gồm:
          </p>
          <div className="ck-tsh-chip-ds">
            {tongHopLe.map((t) => (
              <span key={t} className="ck-tsh-chip">
                {t}
              </span>
            ))}
          </div>
          {soMasterUng !== null ? (
            <p className="ck-tsh-dau-phu">
              Tổng <strong>{soMasterUng}</strong> được giữ nguyên, không rút về {n}.
            </p>
          ) : null}
        </div>
      </section>

      {/* 3. Ví dụ ngày sinh: hai năm gần 1990, 2000 nhất có ví dụ (viDuTheoNam) */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-vi-du-tieu">
        <h2 id="ck-tsh-vi-du-tieu" className="ck-td-tieu">
          Ví dụ ngày sinh ra số {n}
        </h2>

        <div className="ck-tsh-hai-cach">
          {viDuNam.map(({ nam, ds }) => (
            <div key={nam} className="ck-tsh-cach-the">
              <div className="ck-tsh-cach-dau">
                <h3>Năm {nam} (cách 1)</h3>
              </div>
              {ds.length > 0 ? (
                <ul className="ck-tsh-vi-du-ds">
                  {ds.map((d) => {
                    const kq = soChuDao(d);
                    const iso = isoNgay(d);
                    return (
                      <li key={iso}>
                        <Link
                          href={`/than-so-hoc/so-chu-dao?ngay=${iso}`}
                          className="ck-tsh-vi-du-ngay"
                        >
                          {vietNgay(d)}
                        </Link>
                        <span>
                          {kq.cach1.phepCong}
                          {kq.cach1.buoc.length > 1 || masterGiu
                            ? ` (${dinhDangBuoc(kq.cach1.buoc, SO_MASTER)})`
                            : ''}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="ck-tsh-dau-phu">
                  Không có ngày nào trong năm {nam} có tổng chữ số rút gọn ra {n} theo cách 1.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Bao nhiêu ngày sinh ra {n} (1930–2030) */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-thong-ke-tieu">
        <h2 id="ck-tsh-thong-ke-tieu" className="ck-td-tieu">
          Bao nhiêu ngày sinh ra {n} ({tk.tu}–{tk.den})
        </h2>

        <div className="ck-tsh-thong-ke-cap">
          <div className="ck-tsh-thong-ke-the">
            <h3>Theo cách 1 (cộng dồn)</h3>
            <p className="ck-tsh-thong-ke-so">{dinhDangSo(tk.cach1[n])} ngày</p>
            <p className="ck-tsh-thong-ke-phu">
              Tỉ lệ {dinhDangTiLe(tk.cach1[n], tk.tongNgay)} trên {dinhDangSo(tk.tongNgay)} ngày
            </p>
          </div>

          <div className="ck-tsh-thong-ke-the">
            <h3>Theo cách 2 (rút từng phần)</h3>
            <p className="ck-tsh-thong-ke-so">{dinhDangSo(tk.cach2[n])} ngày</p>
            <p className="ck-tsh-thong-ke-phu">
              Tỉ lệ {dinhDangTiLe(tk.cach2[n], tk.tongNgay)} trên {dinhDangSo(tk.tongNgay)} ngày
            </p>
          </div>
        </div>

        <p className="ck-tsh-so-sanh-dong">
          Hai cách khác nhau ở {dinhDangSo(tk.soNgayKhac)} trên {dinhDangSo(tk.tongNgay)} ngày.
        </p>
      </section>

      {/* 5. Ghi chú phạm vi nội dung */}
      <KhoiGhiChuYNghia />

      {/* 6. Thanh 12 số & liên kết */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-chuyen-12">
        <h2 id="ck-tsh-chuyen-12" className="ck-td-tieu">
          Chuyển nhanh 12 số chủ đạo
        </h2>
        <ThanhSoChuDao hienTai={n} />
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/than-so-hoc/so-chu-dao">Tính số chủ đạo theo ngày sinh</Link>
          <Link href="/than-so-hoc/bieu-do-ngay-sinh">Biểu đồ ngày sinh</Link>
          <Link href="/than-so-hoc/theo-ten">Thần số học theo tên</Link>
          <Link href="/than-so-hoc">Tổng quan Thần số học</Link>
        </div>
      </nav>

      {/* 7. Giới hạn */}
      <KhoiGioiHan />
    </KhungTrang>
  );
}

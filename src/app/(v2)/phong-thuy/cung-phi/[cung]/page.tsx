import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { namSinhHopLe } from '@/lib/trang/can-chi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  BAT_CUNG,
  GHI_CHU_GUI_CUNG,
  cungTheoSlug,
  namTheoCung,
} from '@/lib/trang/phong-thuy';
import {
  MAU_SEO_CUNG,
  dinhDangDo,
  macDinhCung,
  serializeJsonLd,
  taoSchemaDefinedTermCung,
  taoSchemaWebPage,
  thamSoCung,
} from '../../PhongThuyHelpers';
import {
  BangBatPhuong,
  GhiCongHiepKy,
  HinhBaHaoQuai,
  ThanhTamCung,
} from '../../PhongThuyUi';

export const revalidate = 3600;

export function generateStaticParams() {
  return BAT_CUNG.map((c) => ({ cung: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cung: string }>;
}): Promise<Metadata> {
  const { cung: slug } = await params;
  const cung = cungTheoSlug(slug);
  if (!cung) notFound();

  const duongDan = `/phong-thuy/cung-phi/${cung.slug}`;
  return metaTrang(duongDan, macDinhCung(cung), MAU_SEO_CUNG, thamSoCung(cung));
}

export default async function CungPhiChiTietPage({
  params,
}: {
  params: Promise<{ cung: string }>;
}) {
  const { cung: slug } = await params;
  const cung = cungTheoSlug(slug);
  if (!cung) notFound();

  const duongDan = `/phong-thuy/cung-phi/${cung.slug}`;
  const tt = await thongTinTrang(
    duongDan,
    macDinhCung(cung),
    MAU_SEO_CUNG,
    thamSoCung(cung),
  );
  const daDung = trangDaDung();
  const dsNam = namTheoCung(cung.ten);
  const coGuiCung =
    dsNam.nam.some((x) => x.guiCung) || dsNam.nu.some((x) => x.guiCung);

  const schemaTerm = taoSchemaDefinedTermCung(cung, tt.canonical);
  const schemaWebPage = taoSchemaWebPage(tt);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={duongDan}
      tenCuoi={`Cung ${cung.ten}`}
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

      {/* 1. Đầu trang: ký hiệu lớn, tên, chữ Hán, số Lạc thư, hành, nhóm, loại, phương & 3 sơn */}
      <section className="ck-pt-cung-dau" aria-label={`Thông tin cung ${cung.ten}`}>
        <div>
          <div className="ck-pt-dau-chinh">
            <span className="ck-pt-ky-lon" aria-hidden="true">
              {cung.kyHieu}
            </span>
            <div>
              <h2 className="ck-pt-ten-lon">
                Cung {cung.ten}{' '}
                <span lang="zh-Hant" className="ck-pt-han-lon">
                  {cung.han}
                </span>
              </h2>
              <div className="ck-pt-thong-tin-dong">
                <span>
                  Số Lạc thư: <b>{cung.so}</b>
                </span>
                <span>·</span>
                <span>
                  Hành:{' '}
                  <HuyHieuHanh
                    hanh={cung.hanh}
                    lienKet={daDung.has('/ngu-hanh')}
                  />
                </span>
                <span>·</span>
                <b>{cung.nhom} tứ</b>
              </div>
            </div>
          </div>

          <div className="ck-pt-chi-so-luoi">
            <div className="ck-pt-chi-so-o">
              <span>Loại quái</span>
              <b>{cung.loai}</b>
            </div>
            <div className="ck-pt-chi-so-o">
              <span>Phương &amp; 3 sơn</span>
              <b>
                {cung.phuong} ({cung.son.join(', ')}) · {dinhDangDo(cung.tuDo)}–
                {dinhDangDo(cung.denDo)}
              </b>
            </div>
          </div>
        </div>

        <HinhBaHaoQuai hao={cung.hao} ten={cung.ten} />
      </section>

      {/* 2. 8 phương theo cung */}
      <section className="ck-td-muc" aria-labelledby="ck-pt-cung-phuong-tieu">
        <h2 id="ck-pt-cung-phuong-tieu" className="ck-td-tieu">
          8 phương theo cung {cung.ten}
        </h2>
        <BangBatPhuong cungTen={cung.ten} />
      </section>

      {/* 3. Năm sinh có cung {ten} (1930–2030) */}
      <section className="ck-td-muc" aria-labelledby="ck-pt-cung-nam-tieu">
        <h2 id="ck-pt-cung-nam-tieu" className="ck-td-tieu">
          Năm sinh có cung {cung.ten} (1930–2030)
        </h2>

        <div className="ck-pt-nam-hai-cot">
          {[
            { tieuDe: 'Nam mạng', ds: dsNam.nam },
            { tieuDe: 'Nữ mạng', ds: dsNam.nu },
          ].map(({ tieuDe, ds }) => (
            <div key={tieuDe} className="ck-pt-nam-cot">
              <h3>
                {tieuDe} ({ds.length} năm)
              </h3>
              <ul className="ck-pt-nam-ds">
                {ds.map((item) => {
                  const nhan = `${item.nam} ${item.canChi}${item.guiCung ? ' *' : ''}`;
                  return (
                    <li key={item.nam}>
                      {daDung.has('/sinh-nam') && namSinhHopLe(item.nam) ? (
                        <Link
                          href={`/sinh-nam/${item.nam}`}
                          className="ck-pt-nam-muc"
                        >
                          <b>{item.nam}</b> {item.canChi}
                          {item.guiCung ? ' *' : ''}
                        </Link>
                      ) : (
                        <span className="ck-pt-nam-muc">{nhan}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {coGuiCung ? (
          <p className="ck-pt-gui-cung">
            <strong>*</strong> {GHI_CHU_GUI_CUNG}
          </p>
        ) : null}
      </section>

      {/* 4. Thanh 8 cung & liên kết */}
      <section className="ck-td-muc" aria-labelledby="ck-pt-thanh-tieu">
        <h2 id="ck-pt-thanh-tieu" className="ck-td-tieu">
          Chuyển nhanh 8 cung
        </h2>
        <ThanhTamCung hienTaiSlug={cung.slug} />
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/phong-thuy/cung-phi">Tra cung phi theo năm sinh</Link>
          <Link href="/phong-thuy/bat-trach">Bảng Bát trạch (8 du niên)</Link>
          <Link href="/phong-thuy/huong-nha">Xem hướng nhà theo độ la bàn</Link>
          {daDung.has('/kinh-dich/64-que') ? (
            <Link href={`/kinh-dich/bat-quai/${cung.slug}`}>
              Quái {cung.ten} trong Kinh Dịch
            </Link>
          ) : null}
          <Link href="/phong-thuy">Tổng quan Phong thủy</Link>
        </div>
      </nav>

      {/* 5. Ghi công */}
      <GhiCongHiepKy daDung={daDung} />
    </KhungTrang>
  );
}

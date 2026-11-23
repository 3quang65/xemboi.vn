import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { slugConGiap } from '@/components/ck/canChiHelpers';
import {
  DocNhanh,
  MauNetTraCuuSvg,
  ThuatNgu,
  TrichNguyenVan,
  VongConGiap,
  type KieuNetTraCuuKey,
  type TheDocNhanhItem,
} from '@/components/ck/truc-quan';
import {
  GIAI_NGHIA_BAT_TU,
  NGUON_BAT_TU,
  TRICH_BAT_TU,
  type LoaiQuanHe,
} from '@/lib/trang/bat-tu-truc-quan';
import {
  GHI_CHU_CAP,
  capConGiap,
  capKhacCua,
  docSlugCap,
  tatCaCap,
  type CapConGiap,
} from '@/lib/trang/cap-con-giap';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';

const MAU_SEO_CAP = '/xem-tuoi/{chi-a}-va-{chi-b}';

function netTheoLoai(loai: LoaiQuanHe): KieuNetTraCuuKey | null {
  switch (loai) {
    case 'tam-hop':
      return 'tamHop';
    case 'luc-hop':
      return 'lucHop';
    case 'xung':
      return 'xung';
    case 'hinh':
    case 'tu-hinh':
      return 'hinh';
    case 'hai':
      return 'hai';
    default:
      return null;
  }
}

function taoThamSoCap(c: CapConGiap) {
  const quanHe =
    c.quanHe.length > 0
      ? c.quanHe.map((q) => q.ten.toLowerCase()).join(', ')
      : 'không thuộc nhóm hợp, xung, hình, hại nào';
  return {
    A: c.a.chi,
    B: c.b.chi,
    conA: c.a.ten,
    conB: c.b.ten,
    quanHe,
  };
}

function macDinhCap(c: CapConGiap) {
  const h1 = c.cungChi
    ? `Hai người cùng tuổi ${c.a.chi}`
    : `Tuổi ${c.a.chi} và tuổi ${c.b.chi}`;
  const title = c.cungChi
    ? `Hai người cùng tuổi ${c.a.chi} (${c.a.ten}): quan hệ địa chi`
    : `Tuổi ${c.a.chi} và tuổi ${c.b.chi}: quan hệ theo sách`;
  return { title, description: c.tomTat, h1 };
}

export function generateStaticParams() {
  return tatCaCap().map((c) => ({ cap: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cap: string }>;
}): Promise<Metadata> {
  const { cap } = await params;
  const parsed = docSlugCap(cap);
  if (!parsed) notFound();
  if (!parsed.chuan) permanentRedirect(`/xem-tuoi/${parsed.slugChuan}`);

  const c = capConGiap(parsed.a, parsed.b);
  return metaTrang(c.duongDan, macDinhCap(c), MAU_SEO_CAP, taoThamSoCap(c));
}

export default async function CapConGiapPage({
  params,
}: {
  params: Promise<{ cap: string }>;
}) {
  const { cap } = await params;
  const parsed = docSlugCap(cap);
  if (!parsed) notFound();
  if (!parsed.chuan) permanentRedirect(`/xem-tuoi/${parsed.slugChuan}`);

  const c = capConGiap(parsed.a, parsed.b);
  const tt = await thongTinTrang(c.duongDan, macDinhCap(c), MAU_SEO_CAP, taoThamSoCap(c));
  const h1 = c.cungChi
    ? `Hai người cùng tuổi ${c.a.chi}`
    : `Tuổi ${c.a.chi} và tuổi ${c.b.chi}`;
  const tenCuoi = c.cungChi ? `Cùng tuổi ${c.a.chi}` : `${c.a.chi} và ${c.b.chi}`;

  const theDocNhanh: TheDocNhanhItem[] = c.cungChi
    ? [
        {
          ma: 'tuoi-a',
          nhan: 'Địa chi',
          giaTri: c.a.chi,
          hanh: c.a.hanhChi,
          chiTiet: `Con vật: ${c.a.ten} · Ngũ hành chi: ${c.a.hanhChi} · ${c.a.amDuong}.`,
        },
        {
          ma: 'nhom-qh',
          nhan: 'Quan hệ địa chi',
          giaTri: c.quanHe.length > 0 ? c.quanHe.map((q) => q.ten).join(', ') : 'Không có',
          muc: c.nhomChinh === 'khong' ? 'binh' : 'diu',
          chiTiet: c.tomTat,
        },
        {
          ma: 'so-cap',
          nhan: 'Các cặp năm sinh',
          giaTri: '25 cặp năm',
          chiTiet:
            'Cùng tuổi địa chi vẫn có thể khác thiên can và khác mệnh nạp âm theo năm âm lịch.',
        },
      ]
    : [
        {
          ma: 'tuoi-a',
          nhan: `Tuổi ${c.a.chi}`,
          giaTri: c.a.chi,
          hanh: c.a.hanhChi,
          chiTiet: `Con vật: ${c.a.ten} · Ngũ hành chi: ${c.a.hanhChi} · ${c.a.amDuong}.`,
        },
        {
          ma: 'tuoi-b',
          nhan: `Tuổi ${c.b.chi}`,
          giaTri: c.b.chi,
          hanh: c.b.hanhChi,
          chiTiet: `Con vật: ${c.b.ten} · Ngũ hành chi: ${c.b.hanhChi} · ${c.b.amDuong}.`,
        },
        {
          ma: 'nhom-qh',
          nhan: 'Quan hệ địa chi',
          giaTri:
            c.quanHe.length > 0
              ? c.quanHe.map((q) => q.ten).join(' · ')
              : 'Không thuộc nhóm',
          muc: c.nhomChinh === 'hop' ? 'tot' : c.nhomChinh === 'khong' ? 'binh' : 'diu',
          chiTiet: c.tomTat,
        },
      ];

  const capKhacA = capKhacCua(parsed.a);
  const capKhacB = c.cungChi ? [] : capKhacCua(parsed.b);

  return (
    <KhungTrang
      tieuDe={h1}
      phu={tt.description}
      duongDan={c.duongDan}
      tenCuoi={tenCuoi}
      toi
    >
      <DocNhanh cau={c.tomTat} the={theDocNhanh} tieuDeId="ck-xt-cap-dn" />

      <section className="ck-td-muc" aria-labelledby="ck-xt-cap-qh-tieu">
        <h2 id="ck-xt-cap-qh-tieu" className="ck-td-tieu">
          {c.cungChi
            ? `Quan hệ địa chi tuổi ${c.a.chi} (${c.a.ten})`
            : `Quan hệ địa chi giữa ${c.a.chi} (${c.a.ten}) và ${c.b.chi} (${c.b.ten})`}
        </h2>

        <div className="ck-xt-cap-bo-cuc">
          <div>
            <VongConGiap chiChon={c.a.chi} chiCap={c.b.chi} />
          </div>

          <div className="ck-xt-cap-qh-ds">
            {c.quanHe.length === 0 ? (
              <div className="ck-xt-cap-the">
                <p className="ck-xt-cap-cau">{c.tomTat}</p>
              </div>
            ) : (
              c.quanHe.map((q, idx) => {
                const net = netTheoLoai(q.loai);
                const laTamHoi = q.loai === 'tam-hoi';
                const nghia = GIAI_NGHIA_BAT_TU[q.ten];
                const lop = laTamHoi
                  ? 'ck-xt-cap-the ck-xt-cap-the-nho'
                  : `ck-xt-cap-the ck-xt-cap-the-${q.nhom}`;

                return (
                  <article key={`${q.loai}-${idx}`} className={lop}>
                    <div className="ck-xt-cap-the-dau">
                      <span className="ck-xt-cap-the-ten">
                        {net ? <MauNetTraCuuSvg loai={net} /> : null}
                        {nghia ? (
                          <ThuatNgu
                            ten={q.ten}
                            nghia={nghia}
                            id={`ck-xt-cap-tn-${q.loai}`}
                          />
                        ) : (
                          <span>{q.ten}</span>
                        )}
                      </span>
                      {laTamHoi ? (
                        <span className="ck-xt-cap-tag-phu">Cùng phương</span>
                      ) : null}
                    </div>

                    <p className="ck-xt-cap-cau">{q.cau}</p>

                    {q.trich.length > 0 ? (
                      <details className="ck-tq-sach" open>
                        <summary className="ck-tq-sach-nut">Sách ghi</summary>
                        {q.trich.map((ma) => {
                          const trich = TRICH_BAT_TU[ma];
                          const nguon = NGUON_BAT_TU[trich.nguon];
                          return (
                            <TrichNguyenVan
                              key={ma}
                              dich={trich.dich}
                              viTriViet={trich.viTriViet}
                              tenSach={nguon.tenHanViet}
                              tacGia={nguon.tacGia}
                              nienDai={nguon.nienDai}
                              doanId={trich.doanId}
                              ghiCong={nguon.ghiCong}
                              url={nguon.url}
                            />
                          );
                        })}
                      </details>
                    ) : null}
                  </article>
                );
              })
            )}

            <div className="ck-xt-cap-the">
              <div className="ck-xt-cap-the-dau">
                <span className="ck-xt-cap-the-ten">Thông tin hai địa chi</span>
              </div>
              <ul className="ck-xt-cap-chi-ds">
                <li>
                  <Link
                    href={`/con-giap/${slugConGiap(c.a.chi)}`}
                    className="ck-xt-cap-chi-link"
                  >
                    Tuổi {c.a.chi} ({c.a.ten})
                  </Link>
                  <span>
                    · hành <HuyHieuHanh hanh={c.a.hanhChi} lienKet /> · {c.a.amDuong}
                  </span>
                </li>
                {!c.cungChi ? (
                  <li>
                    <Link
                      href={`/con-giap/${slugConGiap(c.b.chi)}`}
                      className="ck-xt-cap-chi-link"
                    >
                      Tuổi {c.b.chi} ({c.b.ten})
                    </Link>
                    <span>
                      · hành <HuyHieuHanh hanh={c.b.hanhChi} lienKet /> · {c.b.amDuong}
                    </span>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>

        <aside className="ck-xt-cap-gioi-han" aria-label="Lưu ý phạm vi xem theo con giáp">
          <p>{GHI_CHU_CAP}</p>
          <div className="ck-xt-cap-hanh-dong">
            <Link href="/xem-tuoi/vo-chong" className="ck-nut ck-nut-son">
              Xem tuổi vợ chồng theo năm sinh
            </Link>
            <Link href="/xem-tuoi/con-giap" className="ck-nut ck-nut-vien">
              Ma trận 12 con giáp
            </Link>
          </div>
        </aside>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-xt-cap-cheo-tieu">
        <h2 id="ck-xt-cap-cheo-tieu" className="ck-td-tieu">
          Các cặp khác để tra tiếp
        </h2>

        <div className="ck-xt-cap-cheo-nhom">
          <h3>
            11 cặp khác của tuổi {c.a.chi} ({c.a.ten})
          </h3>
          <div className="ck-xt-cap-chip-ds">
            {capKhacA.map((item) => {
              const khac = item.a.chi === c.a.chi ? item.b : item.a;
              const qhDs = item.quanHe.filter((q) => q.loai !== 'tam-hoi').map((q) => q.ten);
              return (
                <Link
                  key={item.slug}
                  href={item.duongDan}
                  className={`ck-xt-cap-chip ck-xt-mt-nen-${item.nhomChinh}`}
                >
                  <strong>
                    {c.a.chi} – {khac.chi} ({khac.ten})
                  </strong>
                  <span>{qhDs.length > 0 ? qhDs.join(', ') : 'Không thuộc nhóm'}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {!c.cungChi ? (
          <div className="ck-xt-cap-cheo-nhom">
            <h3>
              11 cặp khác của tuổi {c.b.chi} ({c.b.ten})
            </h3>
            <div className="ck-xt-cap-chip-ds">
              {capKhacB.map((item) => {
                const khac = item.a.chi === c.b.chi ? item.b : item.a;
                const qhDs = item.quanHe
                  .filter((q) => q.loai !== 'tam-hoi')
                  .map((q) => q.ten);
                return (
                  <Link
                    key={item.slug}
                    href={item.duongDan}
                    className={`ck-xt-cap-chip ck-xt-mt-nen-${item.nhomChinh}`}
                  >
                    <strong>
                      {c.b.chi} – {khac.chi} ({khac.ten})
                    </strong>
                    <span>{qhDs.length > 0 ? qhDs.join(', ') : 'Không thuộc nhóm'}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/xem-tuoi/con-giap">Ma trận 12 con giáp</Link>
          <Link href={`/con-giap/${slugConGiap(c.a.chi)}`}>
            Tuổi {c.a.chi} ({c.a.ten})
          </Link>
          {!c.cungChi ? (
            <Link href={`/con-giap/${slugConGiap(c.b.chi)}`}>
              Tuổi {c.b.chi} ({c.b.ten})
            </Link>
          ) : null}
          <Link href="/xem-tuoi/vo-chong">Xem tuổi vợ chồng theo năm sinh</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

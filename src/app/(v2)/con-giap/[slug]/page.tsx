import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import {
  MauNetTraCuuSvg,
  ThuatNgu,
  TrichNguyenVan,
  VongConGiap,
  type KieuNetTraCuuKey,
} from '@/components/ck/truc-quan';
import { HuyHieuHanh, NguonNapAm } from '@/components/ck/TheCanChi';
import {
  GIAI_NGHIA_BAT_TU,
  NGUON_BAT_TU,
  TRICH_BAT_TU,
  type MaTrichBatTu,
} from '@/lib/trang/bat-tu-truc-quan';
import { quanHeConGiap } from '@/lib/trang/tra-cuu-truc-quan';
import {
  conGiapLanCan,
  duongDanConGiap,
  namCuaConGiap,
  slugConGiap,
  tenConGiapTheoChi,
  timConGiapTheoSlug,
} from '@/components/ck/canChiHelpers';
import {
  CON_GIAP,
  namCuaHoaGiap,
  type ConGiap,
} from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

function taoThamSoConGiap(cg: ConGiap, namLienQuan: number[]) {
  return {
    Chi: cg.chi,
    'con vật': cg.ten,
    'danh sách': namLienQuan.join(', '),
  };
}

function macDinhConGiap(cg: ConGiap) {
  return {
    title: `Tuổi ${cg.chi} (${cg.ten}): năm sinh, mệnh, màu hợp, tuổi hợp`,
    h1: `Tuổi ${cg.chi}`,
  };
}

const TEN_NHOM_HINH = {
  'vo-an': 'Hình vô ân',
  'tri-the': 'Hình trì thế',
  'vo-le': 'Hình vô lễ',
} as const;

function SachGhiDetails({ maDs }: { maDs: MaTrichBatTu[] }) {
  if (maDs.length === 0) return null;
  return (
    <details className="ck-tq-sach">
      <summary className="ck-tq-sach-nut">Sách ghi</summary>
      {maDs.map((ma) => {
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
  );
}

function DanhSachChiLienKet({ ds }: { ds: string[] }) {
  return (
    <>
      {ds.map((x, idx) => (
        <span key={x}>
          {idx > 0 ? ' – ' : ''}
          <Link href={duongDanConGiap(x)}>
            {x} ({tenConGiapTheoChi(x)})
          </Link>
        </span>
      ))}
    </>
  );
}

export function generateStaticParams() {
  return CON_GIAP.map((c) => ({ slug: slugConGiap(c.chi) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cg = timConGiapTheoSlug(slug);
  if (!cg) notFound();

  const namLienQuan = namCuaConGiap(cg, 1930, 2030);
  const duongDan = duongDanConGiap(cg.chi);
  const [meta, nd] = await Promise.all([
    metaTrang(
      duongDan,
      macDinhConGiap(cg),
      '/con-giap/{chi}',
      taoThamSoConGiap(cg, namLienQuan),
    ),
    noiDungTheoDuongDan(duongDan),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function ConGiapChiTietPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cg = timConGiapTheoSlug(slug);
  if (!cg) notFound();

  const namLienQuan = namCuaConGiap(cg, 1930, 2030);
  const duongDan = duongDanConGiap(cg.chi);
  const [ttTrang, nd] = await Promise.all([
    thongTinTrang(
      duongDan,
      macDinhConGiap(cg),
      '/con-giap/{chi}',
      taoThamSoConGiap(cg, namLienQuan),
    ),
    noiDungTheoDuongDan(duongDan),
  ]);
  const { truoc, sau } = conGiapLanCan(cg.thuTu);
  const qh = quanHeConGiap(cg.thuTu - 1);
  const cacDongQuanHe: {
    ma: string;
    net: KieuNetTraCuuKey;
    lopNhom: string;
    ten: string;
    idTn: string;
    noiDung: ReactNode;
    trich: MaTrichBatTu[];
  }[] = [
      {
        ma: 'tam-hop',
        net: 'tamHop',
        lopNhom: 'hop',
        ten: 'Tam hợp',
        idTn: 'ck-cg-tn-tam-hop',
        noiDung: (
          <>
            <DanhSachChiLienKet ds={qh.tamHop.chi} /> ({qh.tamHop.hanh} cục)
          </>
        ),
        trich: qh.trich.tamHop,
      },
      {
        ma: 'tam-hoi',
        net: 'tamHop',
        lopNhom: 'hop',
        ten: 'Tam hội',
        idTn: 'ck-cg-tn-tam-hoi',
        noiDung: (
          <>
            <DanhSachChiLienKet ds={qh.tamHoi.chi} /> (cùng phương {qh.tamHoi.hanh})
          </>
        ),
        trich: qh.trich.tamHoi,
      },
      {
        ma: 'luc-hop',
        net: 'lucHop',
        lopNhom: 'hop',
        ten: 'Lục hợp',
        idTn: 'ck-cg-tn-luc-hop',
        noiDung: <DanhSachChiLienKet ds={[qh.chi, qh.lucHop]} />,
        trich: qh.trich.lucHop,
      },
      {
        ma: 'xung',
        net: 'xung',
        lopNhom: 'xung',
        ten: 'Lục xung',
        idTn: 'ck-cg-tn-xung',
        noiDung: <DanhSachChiLienKet ds={[qh.chi, qh.xung]} />,
        trich: qh.trich.xung,
      },
      {
        ma: 'hai',
        net: 'hai',
        lopNhom: 'hai',
        ten: 'Lục hại',
        idTn: 'ck-cg-tn-hai',
        noiDung: <DanhSachChiLienKet ds={[qh.chi, qh.hai]} />,
        trich: qh.trich.hai,
      },
      {
        ma: 'hinh',
        net: 'hinh',
        lopNhom: 'hinh',
        ten: qh.hinh ? 'Tương hình' : 'Tự hình',
        idTn: 'ck-cg-tn-hinh',
        noiDung: qh.hinh ? (
          <>
            {TEN_NHOM_HINH[qh.hinh.nhom]}: <DanhSachChiLienKet ds={qh.hinh.chi} />
          </>
        ) : (
          <>
            Tự hình {qh.chi} – {qh.chi} (nhóm 4 chi tự hình: Thìn, Ngọ, Dậu, Hợi)
          </>
        ),
        trich: qh.trich.hinh,
      },
    ];

  return (
    <KhungTrang
      tieuDe={`${ttTrang.h1} (${cg.ten})`}
      phu={ttTrang.description}
      duongDan={duongDan}
      tenCuoi={`Tuổi ${cg.chi}`}
      toi
    >
      <section className="ck-td-muc" aria-labelledby="ck-cg-qh-tieu">
        <h2 id="ck-cg-qh-tieu" className="ck-td-tieu">
          Vòng quan hệ địa chi của tuổi {cg.chi} ({cg.ten})
        </h2>

        <VongConGiap chiChon={cg.chi} />

        <ul
          className="ck-cg-qh-ds"
          aria-label={`Danh sách quan hệ địa chi của tuổi ${cg.chi}`}
        >
          {cacDongQuanHe.map((dong) => (
            <li key={dong.ma} className={`ck-cg-qh-dong ck-cg-qh-${dong.lopNhom}`}>
              <div className="ck-cg-qh-dau">
                <span className="ck-cg-qh-ten">
                  <MauNetTraCuuSvg loai={dong.net} />
                  <ThuatNgu
                    ten={dong.ten}
                    nghia={GIAI_NGHIA_BAT_TU[dong.ten] ?? ''}
                    id={dong.idTn}
                  />
                </span>
                <span className="ck-cg-qh-chi">{dong.noiDung}</span>
              </div>
              <SachGhiDetails maDs={dong.trich} />
            </li>
          ))}
        </ul>

        <p className="ck-cg-luu-y">
          <em>Tam mệnh thông hội</em> ghi gặp xung hay hình có cát có hung, không vội luận là dữ
          (xem mục Sách ghi ở Lục xung và Tương hình).
        </p>
      </section>

      <section className="ck-td-muc ck-tom-tat-menh" aria-label={`Đặc điểm địa chi ${cg.chi}`}>
        <div className="ck-luoi-4">
          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Địa chi</span>
            <strong className="ck-gia-lon">{cg.chi}</strong>
            <p>
              Con vật: {cg.ten} · Thứ {cg.thuTu}/12
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Hành của chi</span>
            <div className="ck-gia-lon">
              <HuyHieuHanh hanh={cg.hanhChi} lienKet />
            </div>
            <p>Âm dương: {cg.amDuong}</p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Tam hợp</span>
            <strong className="ck-gia-lon">{cg.tamHop.join(' – ')}</strong>
            <p>
              Cùng bộ:{' '}
              {cg.tamHop
                .filter((x) => x !== cg.chi)
                .map((x, idx) => (
                  <span key={x}>
                    {idx > 0 ? ', ' : ''}
                    <Link href={duongDanConGiap(x)}>
                      {x} ({tenConGiapTheoChi(x)})
                    </Link>
                  </span>
                ))}
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Lục hợp &amp; Lục xung</span>
            <p style={{ marginTop: 4 }}>
              Hợp:{' '}
              <Link href={duongDanConGiap(cg.lucHop)}>
                <b>
                  {cg.lucHop} ({tenConGiapTheoChi(cg.lucHop)})
                </b>
              </Link>
            </p>
            <p>
              Xung:{' '}
              <Link href={duongDanConGiap(cg.lucXung)}>
                <b>
                  {cg.lucXung} ({tenConGiapTheoChi(cg.lucXung)})
                </b>
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-cg-5-hoa-giap">
        <h2 id="ck-cg-5-hoa-giap" className="ck-td-tieu">
          5 hoa giáp của tuổi {cg.chi}
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang ck-bang-the">
            <thead>
              <tr>
                <th>Hoa giáp</th>
                <th>Nạp âm</th>
                <th>Hành</th>
                <th>Các năm (1930–2030)</th>
              </tr>
            </thead>
            <tbody>
              {cg.hoaGiap.map((hg) => {
                const namHg = namCuaHoaGiap(hg, 1930, 2030);
                return (
                  <tr key={hg.slug}>
                    <td data-nhan="Hoa giáp">
                      <Link href={`/can-chi/${hg.slug}`}>
                        <b>{hg.ten}</b>
                      </Link>
                    </td>
                    <td data-nhan="Nạp âm">
                      <Link href={`/nap-am/${hg.slugNapAm}`}>{hg.napAm}</Link>
                    </td>
                    <td data-nhan="Hành">
                      <HuyHieuHanh hanh={hg.hanh} lienKet />
                    </td>
                    <td data-nhan="Các năm">
                      <div className="ck-nam-ds">
                        {namHg.map((y) => (
                          <Link key={y} href={`/sinh-nam/${y}`} className="ck-nam-the">
                            {y}
                          </Link>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-cg-nam-sinh">
        <h2 id="ck-cg-nam-sinh" className="ck-td-tieu">
          Các năm sinh tuổi {cg.chi} (1930–2030)
        </h2>
        <div className="ck-nam-ds">
          {namLienQuan.map((y) => (
            <Link key={y} href={`/sinh-nam/${y}`} className="ck-nam-the">
              {y}
            </Link>
          ))}
        </div>
        <NguonNapAm />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe={`Diễn giải tuổi ${cg.chi} (${cg.ten})`} />

      <nav className="ck-dieu-huong" aria-label="Điều hướng trong 12 con giáp">
        <Link href={duongDanConGiap(truoc.chi)} className="ck-nut ck-nut-vien">
          ← Tuổi {truoc.chi} ({truoc.ten})
        </Link>
        <Link href="/con-giap" className="ck-nut ck-nut-vien">
          12 con giáp
        </Link>
        <Link href={duongDanConGiap(sau.chi)} className="ck-nut ck-nut-vien">
          Tuổi {sau.chi} ({sau.ten}) →
        </Link>
      </nav>

      <nav className="ck-lien-quan" aria-label="Liên kết cùng bộ">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/can-chi">Tổng quan Can chi &amp; mệnh</Link>
          <Link href="/sinh-nam">Tra mệnh theo năm sinh</Link>
          <Link href="/can-chi/60-hoa-giap">Bảng 60 hoa giáp</Link>
          <Link href="/nap-am">Bảng 30 nạp âm</Link>
          <Link href="/ngu-hanh">Ngũ hành tương sinh – khắc</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

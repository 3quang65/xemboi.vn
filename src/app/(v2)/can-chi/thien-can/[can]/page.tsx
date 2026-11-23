import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { HANH_SLUG, slugConGiap } from '@/components/ck/canChiHelpers';
import {
  DocNhanh,
  TrichNguyenVan,
  type TheDocNhanhItem,
} from '@/components/ck/truc-quan';
import { NGUON_BAT_TU } from '@/lib/trang/bat-tu-truc-quan';
import { slugViet } from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  THIEN_CAN_CHI_TIET,
  TRICH_SINH_TU_LOC,
  thienCanTheoSlug,
  type ThienCan,
} from '@/lib/trang/thien-can';
import { BON_HOA } from '@/lib/trang/tu-hoa';
import '../../thien-can.css';

const MAU_SEO_THIEN_CAN = '/can-chi/thien-can/{can}';

function taoThamSoThienCan(c: ThienCan) {
  return {
    Tên: c.ten,
    tên: c.ten.toLowerCase(),
    n: c.thuTu,
    Hành: c.hanh,
    'âm/dương': c.amDuong.toLowerCase(),
  };
}

function macDinhThienCan(c: ThienCan) {
  const cau = `Can ${c.ten} là can thứ ${c.thuTu} trong 10 thiên can, hành ${c.hanh}, ${c.amDuong}.`;
  return {
    title: `Can ${c.ten}: ngũ hành ${c.hanh}, ${c.amDuong}, hợp hóa và hoa giáp`,
    description: `${cau} Hợp ${c.hop.can} hóa ${c.hop.hoa}; sinh ở ${c.sinh}, tử ở ${c.tu}, lộc ở ${c.loc}.`,
    h1: `Can ${c.ten}`,
  };
}

export function generateStaticParams() {
  return THIEN_CAN_CHI_TIET.map((c) => ({ can: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ can: string }>;
}): Promise<Metadata> {
  const { can } = await params;
  const c = thienCanTheoSlug(can);
  if (!c) notFound();
  return metaTrang(c.duongDan, macDinhThienCan(c), MAU_SEO_THIEN_CAN, taoThamSoThienCan(c));
}

export default async function ThienCanChiTietPage({
  params,
}: {
  params: Promise<{ can: string }>;
}) {
  const { can } = await params;
  const c = thienCanTheoSlug(can);
  if (!c) notFound();

  const tt = await thongTinTrang(
    c.duongDan,
    macDinhThienCan(c),
    MAU_SEO_THIEN_CAN,
    taoThamSoThienCan(c),
  );
  const h1 = `Can ${c.ten}`;
  const cauDocNhanh = `Can ${c.ten} là can thứ ${c.thuTu} trong 10 thiên can, hành ${c.hanh}, ${c.amDuong}.`;

  const theDocNhanh: TheDocNhanhItem[] = [
    {
      ma: 'hanh',
      nhan: 'Ngũ hành',
      giaTri: c.hanh,
      hanh: c.hanh,
      chiTiet: `Can thứ ${c.thuTu}/10 trong bảng mười thiên can.`,
    },
    {
      ma: 'am-duong',
      nhan: 'Âm dương',
      giaTri: c.amDuong,
      chiTiet: `Can ${c.amDuong.toLowerCase()}, hành ${c.hanh}.`,
    },
    {
      ma: 'ngu-hop',
      nhan: 'Ngũ hợp',
      giaTri: `Hợp ${c.hop.can} hóa ${c.hop.hoa}`,
      hanh: c.hop.hoa,
      chiTiet: `Hợp với ${c.hop.can} hóa ${c.hop.hoa} theo Hiệp kỷ.`,
    },
  ];

  const dsLoc = c.loc.split(',').map((s) => s.trim()).filter(Boolean);
  const nguonTamMenh = NGUON_BAT_TU.tamMenh;

  return (
    <KhungTrang
      tieuDe={h1}
      phu={tt.description}
      duongDan={c.duongDan}
      tenCuoi={h1}
      toi
    >
      <nav className="ck-tc-10-hang" aria-label="10 thiên can">
        {THIEN_CAN_CHI_TIET.map((item) => {
          const hanhSlug = HANH_SLUG[item.hanh];
          const chon = item.slug === c.slug;
          return chon ? (
            <span
              key={item.slug}
              className={`ck-tc-10-o ck-tq-nen-${hanhSlug} ck-tc-10-chon`}
              aria-current="page"
            >
              <strong className={`ck-tq-hanh-${hanhSlug}`}>{item.ten}</strong>
              <span>{item.hanh}</span>
            </span>
          ) : (
            <Link
              key={item.slug}
              href={item.duongDan}
              className={`ck-tc-10-o ck-tq-nen-${hanhSlug}`}
            >
              <strong className={`ck-tq-hanh-${hanhSlug}`}>{item.ten}</strong>
              <span>{item.hanh}</span>
            </Link>
          );
        })}
      </nav>

      <DocNhanh cau={cauDocNhanh} the={theDocNhanh} tieuDeId="ck-tc-dn-tieu" />

      <section className="ck-td-muc" aria-labelledby="ck-tc-qh-tieu">
        <h2 id="ck-tc-qh-tieu" className="ck-td-tieu">
          Quan hệ của can {c.ten}
        </h2>

        <div className="ck-tc-qh-luoi">
          <div className="ck-tc-qh-the">
            <span className="ck-tc-qh-nhan">Ngũ hợp</span>
            <div className="ck-tc-qh-gia">
              <Link href={`/can-chi/thien-can/${c.hop.slug}`} className="ck-tc-link-lon">
                Can {c.hop.can}
              </Link>
              <span>hóa</span>
              <HuyHieuHanh hanh={c.hop.hoa} lienKet />
            </div>
          </div>

          <div className="ck-tc-qh-the">
            <span className="ck-tc-qh-nhan">Thất sát của can {c.ten}</span>
            <div className="ck-tc-qh-gia">
              <Link
                href={`/can-chi/thien-can/${slugViet(c.satCuaCan)}`}
                className="ck-tc-link-lon"
              >
                Can {c.satCuaCan}
              </Link>
              <Link href="/bat-tu/thap-than/that-sat" className="ck-tc-link-lon">
                Xem Thất sát
              </Link>
            </div>
          </div>

          <div className="ck-tc-qh-the">
            <span className="ck-tc-qh-nhan">Sinh và Tử (vòng trường sinh)</span>
            <div className="ck-tc-qh-gia">
              <span>Sinh ở</span>
              <Link href={`/con-giap/${slugConGiap(c.sinh)}`} className="ck-tc-link-lon">
                {c.sinh}
              </Link>
              <span>· Tử ở</span>
              <Link href={`/con-giap/${slugConGiap(c.tu)}`} className="ck-tc-link-lon">
                {c.tu}
              </Link>
            </div>
          </div>

          <div className="ck-tc-qh-the">
            <span className="ck-tc-qh-nhan">Vị trí Lộc</span>
            <div className="ck-tc-qh-gia">
              <span>Lộc tại</span>
              {dsLoc.map((chi, idx) => (
                <span key={chi} className="ck-tc-loc-item">
                  <Link href={`/con-giap/${slugConGiap(chi)}`} className="ck-tc-link-lon">
                    {chi}
                  </Link>
                  {idx < dsLoc.length - 1 ? <span aria-hidden="true">,</span> : null}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="ck-tc-sach-boc">
          <TrichNguyenVan
            dich={TRICH_SINH_TU_LOC.dich}
            viTriViet={TRICH_SINH_TU_LOC.viTriViet}
            tenSach={nguonTamMenh.tenHanViet}
            tacGia={nguonTamMenh.tacGia}
            nienDai={nguonTamMenh.nienDai}
            doanId={TRICH_SINH_TU_LOC.doanId}
            ghiCong={nguonTamMenh.ghiCong}
            url={nguonTamMenh.url}
          />
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-tc-tt-tieu">
        <h2 id="ck-tc-tt-tieu" className="ck-td-tieu">
          Khi can {c.ten} làm nhật chủ (thập thần của 10 can gặp)
        </h2>

        <div className="ck-tc-tt-luoi">
          {c.thapThan.map((item) => {
            const canInfo = THIEN_CAN_CHI_TIET.find((x) => x.ten === item.can)!;
            const hanhSlug = HANH_SLUG[canInfo.hanh];
            return (
              <Link key={item.can} href={item.duongDan} className="ck-tc-tt-o">
                <span className={`ck-tc-tt-can ck-tq-hanh-${hanhSlug}`}>
                  Gặp {item.can} ({canInfo.hanh})
                </span>
                <span className="ck-tc-tt-ten">{item.than}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-tc-hg-tieu">
        <h2 id="ck-tc-hg-tieu" className="ck-td-tieu">
          6 năm hoa giáp của can {c.ten}
        </h2>

        <div className="ck-tc-hg-luoi">
          {c.hoaGiap.map((hg) => (
            <Link key={hg.slug} href={`/can-chi/${hg.slug}`} className="ck-tc-hg-the">
              <div className="ck-tc-hg-dau">
                <strong>{hg.ten}</strong>
                <HuyHieuHanh hanh={hg.hanh} />
              </div>
              <span className="ck-tc-hg-nap">Nạp âm: {hg.napAm}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-tc-tu-hoa-tieu">
        <h2 id="ck-tc-tu-hoa-tieu" className="ck-td-tieu">
          Tứ Hóa tử vi của can {c.ten}
        </h2>

        <div className="ck-tc-tu-hoa-luoi">
          {BON_HOA.map((h) => {
            const sao = c.tuHoa.sao[h.ma];
            return (
              <div key={h.ma} className="ck-tc-th-o">
                <span className="ck-tc-th-hoa">{h.ten}</span>
                {sao.duongDan ? (
                  <Link href={sao.duongDan} className="ck-tc-th-sao-link">
                    {sao.ten}
                  </Link>
                ) : (
                  <strong className="ck-tc-th-sao">{sao.ten}</strong>
                )}
              </div>
            );
          })}
        </div>

        {c.tuHoa.khacPhai ? (
          <p className="ck-tc-khac-phai">
            Can này các phái ghi khác nhau ·{' '}
            <Link href="/tu-vi/tu-hoa#so-phai">Xem so phái Tứ Hóa</Link>
          </p>
        ) : null}
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết Can chi">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/can-chi">Tổng quan Can chi &amp; mệnh</Link>
          <Link href="/can-chi/60-hoa-giap">Bảng 60 hoa giáp</Link>
          <Link href="/tu-vi/tu-hoa">Bảng Tứ Hóa</Link>
          <Link href="/bat-tu/lap-la-so">Lập lá số bát tự</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

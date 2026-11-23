import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  ChuGiaiHanh,
  DocNhanh,
  TrichNguyenVan,
  VongNguHanh,
  type TheDocNhanhItem,
} from '@/components/ck/truc-quan';
import { NGUON_BAT_TU } from '@/lib/trang/bat-tu-truc-quan';
import { slugViet } from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  GHI_CHU_THAP_THAN,
  NHOM_THAP_THAN,
  THAP_THAN_CHI_TIET,
  TRICH_THAP_THAN,
  bangThapThan,
  thapThanTheoSlug,
  type ThapThanChiTiet,
} from '@/lib/trang/thap-than';
import '../../thap-than.css';

const MAU_SEO_THAP_THAN = '/bat-tu/thap-than/{than}';

function taoThamSoThapThan(t: ThapThanChiTiet) {
  return {
    'Thập thần': t.ten,
    'thập thần': t.ten.toLowerCase(),
  };
}

function macDinhThapThan(t: ThapThanChiTiet) {
  return {
    title: `${t.ten} trong bát tự: cách tính, bảng 10 can và trích sách`,
    description: `${t.ten} (${t.nhom}): ${t.dinhNghia} Bảng tra 10 nhật chủ và trích dẫn Tam mệnh thông hội.`,
    h1: `${t.ten} trong bát tự`,
  };
}

export function generateStaticParams() {
  return THAP_THAN_CHI_TIET.map((t) => ({ than: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ than: string }>;
}): Promise<Metadata> {
  const { than } = await params;
  const t = thapThanTheoSlug(than);
  if (!t) notFound();
  return metaTrang(t.duongDan, macDinhThapThan(t), MAU_SEO_THAP_THAN, taoThamSoThapThan(t));
}

export default async function ThapThanChiTietPage({
  params,
}: {
  params: Promise<{ than: string }>;
}) {
  const { than } = await params;
  const t = thapThanTheoSlug(than);
  if (!t) notFound();

  const tt = await thongTinTrang(
    t.duongDan,
    macDinhThapThan(t),
    MAU_SEO_THAP_THAN,
    taoThamSoThapThan(t),
  );
  const h1 = `${t.ten} trong bát tự`;
  const bang10 = bangThapThan();
  const duongDanTheoTen = new Map(THAP_THAN_CHI_TIET.map((item) => [item.ten, item.duongDan]));

  const theDocNhanh: TheDocNhanhItem[] = [
    {
      ma: 'nhom',
      nhan: 'Nhóm thập thần',
      giaTri: t.nhom,
      chiTiet: `Thuộc nhóm ${t.nhom} trong năm cặp thập thần của bát tự.`,
    },
    {
      ma: 'quan-he',
      nhan: 'Quan hệ với nhật chủ',
      giaTri: t.quanHe.charAt(0).toUpperCase() + t.quanHe.slice(1),
      muc: t.quanHe === 'sinh ta' ? 'tot' : t.quanHe === 'khắc ta' ? 'diu' : 'binh',
      chiTiet: 'Đối chiếu ngũ hành giữa can đang xét với can ngày (nhật chủ).',
    },
    {
      ma: 'am-duong',
      nhan: 'Âm dương',
      giaTri: t.cungAmDuong ? 'Cùng âm dương' : 'Khác âm dương',
      chiTiet: t.cungAmDuong
        ? 'Cùng cực âm dương với nhật chủ (dương gặp dương, âm gặp âm).'
        : 'Khác cực âm dương với nhật chủ (dương gặp âm, âm gặp dương).',
    },
  ];

  const nguonTamMenh = NGUON_BAT_TU.tamMenh;

  return (
    <KhungTrang
      tieuDe={h1}
      phu={tt.description}
      duongDan={t.duongDan}
      tenCuoi={t.ten}
      toi
    >
      {t.tenKhac.length > 0 ? (
        <p className="ck-tt-ten-khac">
          Tên gọi khác trong sách: <strong>{t.tenKhac.join(', ')}</strong>
        </p>
      ) : null}

      <DocNhanh cau={t.dinhNghia} the={theDocNhanh} tieuDeId="ck-tt-dn-tieu" />

      <section className="ck-td-muc" aria-labelledby="ck-tt-so-do-tieu">
        <h2 id="ck-tt-so-do-tieu" className="ck-td-tieu">
          Vị trí của {t.ten} trong 5 nhóm thập thần
        </h2>

        <div className="ck-tt-so-do-bo-cuc">
          <VongNguHanh
            quanHeThapThan={{
              quanHe: t.quanHe,
              tenThan: t.ten,
              nhom: t.nhom,
              cungAmDuong: t.cungAmDuong,
            }}
          />

          <div className="ck-tt-nhom-ds">
            {NHOM_THAP_THAN.map((nhom) => {
              const dangChonNhom = nhom.ten === t.nhom;
              return (
                <div
                  key={nhom.ten}
                  className={`ck-tt-nhom-dong${dangChonNhom ? ' ck-tt-nhom-dong-chon' : ''}`}
                >
                  <div className="ck-tt-nhom-dau">
                    <strong>{nhom.ten}</strong>
                    <span>{nhom.quanHe}</span>
                  </div>
                  <div className="ck-tt-chip-ds">
                    {nhom.than.map((tenThan, idx) => {
                      const slugThan = duongDanTheoTen.get(tenThan)!;
                      const laHienTai = tenThan === t.ten;
                      return laHienTai ? (
                        <span
                          key={tenThan}
                          className="ck-tt-chip ck-tt-chip-chon"
                          aria-current="page"
                        >
                          {tenThan} ({idx === 0 ? 'cùng cực' : 'khác cực'})
                        </span>
                      ) : (
                        <Link key={tenThan} href={slugThan} className="ck-tt-chip">
                          {tenThan} ({idx === 0 ? 'cùng cực' : 'khác cực'})
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-tt-bang-nc-tieu">
        <h2 id="ck-tt-bang-nc-tieu" className="ck-td-tieu">
          Bảng 10 nhật chủ và can là {t.ten}
        </h2>

        <div className="ck-tt-nc-dau">
          <ChuGiaiHanh />
        </div>

        <div className="ck-tt-nc-luoi">
          {t.bang.map((dong) => (
            <div key={dong.nhatChu} className="ck-tt-nc-o">
              <div className="ck-tt-nc-cap">
                <Link
                  href={`/can-chi/thien-can/${slugViet(dong.nhatChu)}`}
                  className={`ck-tt-nc-can ck-tq-hanh-${HANH_SLUG[dong.hanhNhatChu]}`}
                >
                  <i
                    className={`ck-tq-hanh-cham ck-tq-cham-${HANH_SLUG[dong.hanhNhatChu]}`}
                    aria-hidden="true"
                  />
                  <span>{dong.nhatChu}</span>
                </Link>
                <span aria-hidden="true">→</span>
                <Link
                  href={`/can-chi/thien-can/${slugViet(dong.can)}`}
                  className={`ck-tt-nc-can ck-tq-hanh-${HANH_SLUG[dong.hanhCan]}`}
                >
                  <i
                    className={`ck-tq-hanh-cham ck-tq-cham-${HANH_SLUG[dong.hanhCan]}`}
                    aria-hidden="true"
                  />
                  <span>{dong.can}</span>
                </Link>
              </div>
              <span className="ck-tt-nc-ten">
                Nhật chủ {dong.nhatChu} · gặp {dong.can}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-tt-sach-tieu">
        <h2 id="ck-tt-sach-tieu" className="ck-td-tieu">
          Sách ghi về {t.ten}
        </h2>

        <div className="ck-tt-trich-ds">
          {t.trich.map((ma) => {
            const tr = TRICH_THAP_THAN[ma];
            return (
              <div key={ma} className="ck-tt-sach-the">
                <TrichNguyenVan
                  dich={tr.dich}
                  viTriViet={tr.viTriViet}
                  tenSach={nguonTamMenh.tenHanViet}
                  tacGia={nguonTamMenh.tacGia}
                  nienDai={nguonTamMenh.nienDai}
                  doanId={tr.doanId}
                  ghiCong={nguonTamMenh.ghiCong}
                  url={nguonTamMenh.url}
                />
              </div>
            );
          })}
        </div>

        <aside className="ck-tt-ghi-chu" aria-label="Lưu ý khi đọc thập thần">
          <p>{GHI_CHU_THAP_THAN}</p>
          <div className="ck-tt-ghi-chu-hanh-dong">
            <Link href="/bat-tu/lap-la-so" className="ck-nut ck-nut-son">
              Lập lá số bát tự
            </Link>
          </div>
        </aside>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-tt-khac-tieu">
        <h2 id="ck-tt-khac-tieu" className="ck-td-tieu">
          Chín thập thần còn lại &amp; bảng 10 × 10
        </h2>

        <div className="ck-tt-chip-ds">
          {THAP_THAN_CHI_TIET.filter((item) => item.slug !== t.slug).map((item) => (
            <Link key={item.slug} href={item.duongDan} className="ck-tt-chip">
              {item.ten}
            </Link>
          ))}
        </div>

        <details className="ck-tq-sach ck-tt-bang-details">
          <summary className="ck-tq-sach-nut">Bảng thập thần đủ 10 can</summary>
          <div className="ck-tt-bang-khung" role="region" aria-label="Bảng thập thần 10 × 10">
            <table className="ck-tt-bang">
              <thead>
                <tr>
                  <th scope="col">Nhật chủ \ Can gặp</th>
                  {bang10.can.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bang10.can.map((nc, a) => (
                  <tr key={nc}>
                    <th scope="row">{nc}</th>
                    {bang10.o[a].map((tenThan, b) => {
                      const href = duongDanTheoTen.get(tenThan)!;
                      const trung = tenThan === t.ten;
                      return (
                        <td key={`${nc}-${bang10.can[b]}`}>
                          <Link
                            href={href}
                            className={`ck-tt-o${trung ? ' ck-tt-o-chon' : ''}`}
                          >
                            {tenThan}
                          </Link>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết Bát tự">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/bat-tu/lap-la-so">Lập lá số bát tự</Link>
          <Link href="/bat-tu">Tổng quan Bát tự</Link>
          <Link href="/can-chi">Can chi &amp; mệnh</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

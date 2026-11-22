import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ChonThang from '@/components/ck/ChonThang';
import KhungTrang from '@/components/ck/KhungTrang';
import LichThang from '@/components/ck/LichThang';
import {
  dinhDangNgayThangVN,
  dinhDangNgayVN,
  duongDanNgay,
  duongDanNgayTuIso,
  duongDanThang,
  hai,
  trongPhamViNam,
} from '@/components/ck/lichHelpers';
import {
  NAM_LICH_INDEX_DEN,
  NAM_LICH_INDEX_TU,
  thangLich,
  tietKhiNam,
  type LuoiThang,
} from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';

function phanTichThangNam(
  yyyy: string,
  mm: string,
): { nam: number; thang: number; mm: string } | null {
  if (!/^\d{4}$/.test(yyyy) || !/^(0[1-9]|1[0-2])$/.test(mm)) return null;
  const nam = Number(yyyy);
  if (!trongPhamViNam(nam)) return null;
  return { nam, thang: Number(mm), mm };
}

function duLieuThang(nam: number, thang: number) {
  const luoi = thangLich(nam, thang);
  const tienTo = `${nam}-${hai(thang)}-`;
  const tietTrongThang = tietKhiNam(nam).filter((t) => t.ngay.startsWith(tienTo));
  const leTrongThang = luoi.hang
    .flat()
    .filter((o) => o.trongThang && o.ngayLe.length > 0);
  const leTen = Array.from(
    new Set(
      leTrongThang
        .flatMap((o) => o.ngayLe.map((l) => l.ten))
        .filter((ten) => ten !== 'Mùng 1' && ten !== 'Ngày rằm'),
    ),
  );
  return { luoi, tietTrongThang, leTrongThang, leTen };
}

function taoThamSoThang(
  nam: number,
  thang: number,
  mm: string,
  tietTrongThang: { ten: string; ngay: string }[],
  leTen: string[],
) {
  return {
    m: String(thang),
    mm,
    yyyy: String(nam),
    'tên tiết': tietTrongThang.map((t) => t.ten).join(', ') || 'trong tháng',
    'tên lễ': leTen.slice(0, 3).join(', ') || 'mùng 1, ngày rằm',
  };
}

function macDinhThang(nam: number, thang: number) {
  return {
    title: `Lịch âm tháng ${thang}/${nam} – lịch âm dương tháng ${thang} năm ${nam}`,
    h1: `Lịch âm tháng ${thang} năm ${nam}`,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ yyyy: string; mm: string }>;
}): Promise<Metadata> {
  const { yyyy, mm } = await params;
  const parsed = phanTichThangNam(yyyy, mm);
  if (!parsed) notFound();

  const { nam, thang } = parsed;
  const { tietTrongThang, leTen } = duLieuThang(nam, thang);
  const meta = await metaTrang(
    `/lich-am/${nam}/${mm}`,
    macDinhThang(nam, thang),
    '/lich-am/{yyyy}/{mm}',
    taoThamSoThang(nam, thang, mm, tietTrongThang, leTen),
  );
  if (nam < NAM_LICH_INDEX_TU || nam > NAM_LICH_INDEX_DEN) {
    return { ...meta, robots: { index: false, follow: true } };
  }
  return meta;
}

export default async function LichThangPage({
  params,
}: {
  params: Promise<{ yyyy: string; mm: string }>;
}) {
  const { yyyy, mm } = await params;
  const parsed = phanTichThangNam(yyyy, mm);
  if (!parsed) notFound();

  const { nam, thang } = parsed;
  const { luoi, tietTrongThang, leTrongThang, leTen }: {
    luoi: LuoiThang;
    tietTrongThang: { ten: string; ngay: string }[];
    leTrongThang: LuoiThang['hang'][number];
    leTen: string[];
  } = duLieuThang(nam, thang);

  const tt = await thongTinTrang(
    `/lich-am/${nam}/${mm}`,
    macDinhThang(nam, thang),
    '/lich-am/{yyyy}/{mm}',
    taoThamSoThang(nam, thang, mm, tietTrongThang, leTen),
  );

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={`/lich-am/${nam}/${mm}`}
      tenCuoi={`Tháng ${thang}/${nam}`}
      toi
    >
      <div className="ck-vn-thanh">
        <ChonThang namMacDinh={nam} thangMacDinh={thang} />
        <Link href={`/lich-am/${nam}`} className="ck-nut ck-nut-vien">
          Lịch cả năm {nam}
        </Link>
      </div>

      <section className="ck-tom-tat-thang" aria-label="Thông tin tháng âm và tiết khí">
        <dl className="ck-lich-thong-tin">
          <div>
            <dt>Rơi vào tháng âm lịch</dt>
            <dd>{luoi.thangAm.join(' · ')}</dd>
          </div>
          <div>
            <dt>Tiết khí trong tháng</dt>
            <dd>
              {tietTrongThang.map((t, i) => {
                const href = duongDanNgayTuIso(t.ngay);
                return (
                  <span key={`${t.ten}-${t.ngay}`}>
                    {i > 0 ? ' · ' : ''}
                    {t.ten} (
                    {href ? (
                      <Link href={href}>{dinhDangNgayThangVN(t.ngay)}</Link>
                    ) : (
                      dinhDangNgayThangVN(t.ngay)
                    )}
                    )
                  </span>
                );
              })}
            </dd>
          </div>
        </dl>
      </section>

      <LichThang luoi={luoi} hienDieuHuong />

      <section className="ck-muc-lich" aria-labelledby="ck-th-ngay-le">
        <h2 id="ck-th-ngay-le">Ngày lễ &amp; mốc lịch tháng {thang}/{nam}</h2>
        <div className="ck-bang-khung">
          <table className="ck-bang">
            <thead>
              <tr>
                <th>Ngày dương</th>
                <th>Ngày âm</th>
                <th>Can chi ngày</th>
                <th>Ngày lễ / mốc lịch</th>
              </tr>
            </thead>
            <tbody>
              {leTrongThang.map((o) => (
                <tr key={o.iso}>
                  <td>
                    <Link href={duongDanNgay(o.duong.nam, o.duong.thang, o.duong.ngay)}>
                      {dinhDangNgayVN(o.iso)}
                    </Link>
                  </td>
                  <td>
                    {o.am.ngay}/{o.am.thang}
                    {o.am.nhuan ? 'N' : ''}
                  </td>
                  <td>{o.canChiNgay}</td>
                  <td>
                    <b>{o.ngayLe.map((l) => l.ten).join(', ')}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <nav className="ck-dieu-huong" aria-label="Chuyển tháng">
        {trongPhamViNam(luoi.thangTruoc.nam) ? (
          <Link
            href={duongDanThang(luoi.thangTruoc.nam, luoi.thangTruoc.thang)}
            className="ck-nut ck-nut-vien"
          >
            ← Tháng {luoi.thangTruoc.thang}/{luoi.thangTruoc.nam}
          </Link>
        ) : null}
        <Link href={`/lich-am/${nam}`} className="ck-nut ck-nut-vien">
          Lịch năm {nam}
        </Link>
        {trongPhamViNam(luoi.thangSau.nam) ? (
          <Link
            href={duongDanThang(luoi.thangSau.nam, luoi.thangSau.thang)}
            className="ck-nut ck-nut-vien"
          >
            Tháng {luoi.thangSau.thang}/{luoi.thangSau.nam} →
          </Link>
        ) : null}
      </nav>
    </KhungTrang>
  );
}

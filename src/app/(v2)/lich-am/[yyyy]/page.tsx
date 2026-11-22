import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { LichThangThuNho } from '@/components/ck/LichThang';
import {
  NAM_MAX,
  NAM_MIN,
  dinhDangNgayThangVN,
  dinhDangNgayVN,
  duongDanNgayTuIso,
  thuTuIso,
  trongPhamViNam,
} from '@/components/ck/lichHelpers';
import {
  NAM_LICH_INDEX_DEN,
  NAM_LICH_INDEX_TU,
  thangLich,
  tongQuanNam,
  type TongQuanNam,
} from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';

function phanTichNam(yyyy: string): number | null {
  if (!/^\d{4}$/.test(yyyy)) return null;
  const nam = Number(yyyy);
  return trongPhamViNam(nam) ? nam : null;
}

function taoThamSoNam(tq: TongQuanNam) {
  return {
    yyyy: String(tq.nam),
    'Can Chi': tq.canChi,
    'dd/mm': dinhDangNgayThangVN(tq.tet),
    'nếu có': tq.thangNhuan > 0 ? `(tháng ${tq.thangNhuan})` : '(không có)',
  };
}

function macDinhNam(tq: TongQuanNam) {
  return {
    title: `Lịch âm ${tq.nam} – lịch âm dương năm ${tq.canChi} ${tq.nam}`,
    h1: `Lịch âm năm ${tq.nam} (${tq.canChi})`,
  };
}

export function generateStaticParams() {
  const ds: { yyyy: string }[] = [];
  for (let y = NAM_LICH_INDEX_TU; y <= NAM_LICH_INDEX_DEN; y++) {
    ds.push({ yyyy: String(y) });
  }
  return ds;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ yyyy: string }>;
}): Promise<Metadata> {
  const { yyyy } = await params;
  const nam = phanTichNam(yyyy);
  if (nam === null) notFound();

  const tq = tongQuanNam(nam);
  const meta = await metaTrang(
    `/lich-am/${nam}`,
    macDinhNam(tq),
    '/lich-am/{yyyy}',
    taoThamSoNam(tq),
  );
  if (!tq.duocIndex) {
    return { ...meta, robots: { index: false, follow: true } };
  }
  return meta;
}

export default async function LichNamPage({
  params,
}: {
  params: Promise<{ yyyy: string }>;
}) {
  const { yyyy } = await params;
  const nam = phanTichNam(yyyy);
  if (nam === null) notFound();

  const tq = tongQuanNam(nam);
  const tt = await thongTinTrang(
    `/lich-am/${nam}`,
    macDinhNam(tq),
    '/lich-am/{yyyy}',
    taoThamSoNam(tq),
  );
  const dsThang = Array.from({ length: 12 }, (_, i) => thangLich(nam, i + 1));
  const tetHref = duongDanNgayTuIso(tq.tet);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={`/lich-am/${nam}`}
      tenCuoi={`Năm ${nam}`}
      toi
    >
      <section className="ck-tom-tat-nam" aria-label={`Tổng quan năm ${nam}`}>
        <dl className="ck-lich-thong-tin">
          <div>
            <dt>Can chi &amp; Con giáp</dt>
            <dd>
              Năm {tq.canChi} (tuổi con {tq.conGiap})
            </dd>
          </div>
          <div>
            <dt>Tết Nguyên Đán</dt>
            <dd>
              {tq.thuTet},{' '}
              {tetHref ? (
                <Link href={tetHref}>{dinhDangNgayVN(tq.tet)}</Link>
              ) : (
                dinhDangNgayVN(tq.tet)
              )}
            </dd>
          </div>
          <div>
            <dt>Tháng nhuận âm lịch</dt>
            <dd>
              {tq.thangNhuan > 0
                ? `Năm nhuận tháng ${tq.thangNhuan}`
                : 'Năm thường (không có tháng nhuận)'}
            </dd>
          </div>
        </dl>

        <nav className="ck-dieu-huong ck-dieu-huong-gon" aria-label="Chuyển năm">
          {nam > NAM_MIN ? (
            <Link href={`/lich-am/${nam - 1}`} className="ck-nut ck-nut-vien">
              ← Năm {nam - 1}
            </Link>
          ) : null}
          <Link href="/lich-am" className="ck-nut ck-nut-vien">
            Lịch âm hôm nay
          </Link>
          {nam < NAM_MAX ? (
            <Link href={`/lich-am/${nam + 1}`} className="ck-nut ck-nut-vien">
              Năm {nam + 1} →
            </Link>
          ) : null}
        </nav>
      </section>

      <section className="ck-muc-lich" aria-labelledby="ck-nam-12-tieu">
        <h2 id="ck-nam-12-tieu">Lịch âm dương 12 tháng năm {nam}</h2>
        <div className="ck-nam-12">
          {dsThang.map((luoi) => (
            <LichThangThuNho key={luoi.thang} luoi={luoi} />
          ))}
        </div>
      </section>

      <section className="ck-muc-lich" aria-labelledby="ck-nam-tiet-khi">
        <h2 id="ck-nam-tiet-khi">24 tiết khí năm {nam}</h2>
        <div className="ck-bang-khung">
          <table className="ck-bang">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tiết khí</th>
                <th>Ngày dương lịch</th>
                <th>Thứ</th>
              </tr>
            </thead>
            <tbody>
              {tq.tietKhi.map((tk, idx) => {
                const href = duongDanNgayTuIso(tk.ngay);
                return (
                  <tr key={`${tk.ten}-${tk.ngay}`}>
                    <td>{idx + 1}</td>
                    <td>
                      <b>{tk.ten}</b>
                    </td>
                    <td>
                      {href ? (
                        <Link href={href}>{dinhDangNgayVN(tk.ngay)}</Link>
                      ) : (
                        dinhDangNgayVN(tk.ngay)
                      )}
                    </td>
                    <td>{thuTuIso(tk.ngay)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ck-muc-lich" aria-labelledby="ck-nam-ngay-le">
        <h2 id="ck-nam-ngay-le">Các ngày lễ âm lịch năm {tq.canChi} ({nam})</h2>
        <div className="ck-bang-khung">
          <table className="ck-bang">
            <thead>
              <tr>
                <th>Ngày lễ</th>
                <th>Ngày âm</th>
                <th>Ngày dương</th>
                <th>Thứ</th>
              </tr>
            </thead>
            <tbody>
              {tq.le.map((le) => {
                const href = duongDanNgayTuIso(le.duong);
                return (
                  <tr key={`${le.ten}-${le.duong}`}>
                    <td>
                      <b>{le.ten}</b>
                    </td>
                    <td>{le.am}</td>
                    <td>
                      {href ? (
                        <Link href={href}>{dinhDangNgayVN(le.duong)}</Link>
                      ) : (
                        dinhDangNgayVN(le.duong)
                      )}
                    </td>
                    <td>{le.thu}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <nav className="ck-dieu-huong" aria-label="Điều hướng năm cuối trang">
        {nam > NAM_MIN ? (
          <Link href={`/lich-am/${nam - 1}`} className="ck-nut ck-nut-vien">
            ← Lịch âm {nam - 1}
          </Link>
        ) : null}
        {nam < NAM_MAX ? (
          <Link href={`/lich-am/${nam + 1}`} className="ck-nut ck-nut-vien">
            Lịch âm {nam + 1} →
          </Link>
        ) : null}
      </nav>
    </KhungTrang>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import ThongBao, { so } from '../ThongBao';
import { dinhDangGioVn, nhanMucDo, TEN_LOAI_CANH_BAO } from '../lien-ket/HienThi';
import { xuLyCanhBaoGsc } from './hanh-dong';
import {
  BieuDoGscSvg,
  dinhDangCtr,
  dinhDangNgayYmd,
  moTaCanhBaoGsc,
  soThapPhan,
  truNgayYmd,
  type BaoCaoGscLuu,
  type DiemBieuDoGsc,
} from './HienThi';

export const metadata: Metadata = { title: 'Xếp hạng Search Console' };
export const dynamic = 'force-dynamic';

const CO = 50;

const TABS = [
  { id: 'tong-quan', ten: 'Tổng quan' },
  { id: 'trang', ten: 'Theo trang' },
  { id: 'truy-van', ten: 'Theo truy vấn' },
  { id: 'canh-bao', ten: 'Cảnh báo' },
] as const;

type TabId = (typeof TABS)[number]['id'];
type KhoangNgay = 7 | 28 | 90;
type ThietBi = 'MOBILE' | 'DESKTOP' | 'TABLET';
type SapTrang = 'hien_thi' | 'nhap' | 'ctr' | 'vi_tri' | 'chenh_vi_tri';
type SapTruyVan = SapTrang | 'so_url';
type Chieu = 'asc' | 'desc';

type Tham = {
  tab?: string;
  ngay?: string;
  tb?: string;
  sap?: string;
  chieu?: string;
  url?: string;
  q?: string;
  tv?: string;
  loai?: string;
  p?: string;
  bao?: string;
  loi?: string;
};

function layTab(raw?: string): TabId {
  return TABS.some((t) => t.id === raw) ? (raw as TabId) : 'tong-quan';
}

function layKhoangNgay(raw?: string): KhoangNgay {
  if (raw === '7') return 7;
  if (raw === '90') return 90;
  return 28;
}

function layThietBi(raw?: string): ThietBi | '' {
  if (raw === 'MOBILE' || raw === 'DESKTOP' || raw === 'TABLET') return raw;
  return '';
}

function laySapTrang(raw?: string): SapTrang {
  if (raw === 'nhap' || raw === 'ctr' || raw === 'vi_tri' || raw === 'chenh_vi_tri') return raw;
  return 'hien_thi';
}

function laySapTruyVan(raw?: string): SapTruyVan {
  if (raw === 'so_url' || raw === 'nhap' || raw === 'ctr' || raw === 'vi_tri' || raw === 'chenh_vi_tri') {
    return raw;
  }
  return 'hien_thi';
}

function layChieu(raw: string | undefined, sap: SapTruyVan): Chieu {
  if (raw === 'asc' || raw === 'desc') return raw;
  return sap === 'vi_tri' ? 'asc' : 'desc';
}

function sqlSapXep(sap: SapTruyVan, chieu: Chieu): Prisma.Sql {
  switch (sap) {
    case 'so_url':
      return chieu === 'asc'
        ? Prisma.sql`ORDER BY "soUrl" ASC, "hienThi" DESC`
        : Prisma.sql`ORDER BY "soUrl" DESC, "hienThi" DESC`;
    case 'nhap':
      return chieu === 'asc'
        ? Prisma.sql`ORDER BY "nhap" ASC, "hienThi" DESC`
        : Prisma.sql`ORDER BY "nhap" DESC, "hienThi" DESC`;
    case 'ctr':
      return chieu === 'asc'
        ? Prisma.sql`ORDER BY "ctr" ASC, "hienThi" DESC`
        : Prisma.sql`ORDER BY "ctr" DESC, "hienThi" DESC`;
    case 'vi_tri':
      return chieu === 'desc'
        ? Prisma.sql`ORDER BY "viTriTB" DESC NULLS LAST, "hienThi" DESC`
        : Prisma.sql`ORDER BY "viTriTB" ASC NULLS LAST, "hienThi" DESC`;
    case 'chenh_vi_tri':
      return chieu === 'asc'
        ? Prisma.sql`ORDER BY "chenhViTri" ASC NULLS LAST, "hienThi" DESC`
        : Prisma.sql`ORDER BY "chenhViTri" DESC NULLS LAST, "hienThi" DESC`;
    case 'hien_thi':
    default:
      return chieu === 'asc'
        ? Prisma.sql`ORDER BY "hienThi" ASC, "nhap" DESC`
        : Prisma.sql`ORDER BY "hienThi" DESC, "nhap" DESC`;
  }
}

function ChenhViTri({ nay, truoc }: { nay: number | null; truoc: number | null }) {
  if (nay == null || truoc == null) return <span style={{ color: 'var(--muted)' }}>–</span>;
  const caiThien = truoc - nay;
  if (Math.abs(caiThien) < 0.05) return <span style={{ color: 'var(--muted)' }}>0,0</span>;
  if (caiThien > 0) {
    return (
      <span className="qt-xg-tot" title={`Từ ${soThapPhan(truoc, 1)} → ${soThapPhan(nay, 1)}`}>
        ▲ +{soThapPhan(caiThien, 1)}
      </span>
    );
  }
  return (
    <span className="qt-xg-xau" title={`Từ ${soThapPhan(truoc, 1)} → ${soThapPhan(nay, 1)}`}>
      ▼ -{soThapPhan(Math.abs(caiThien), 1)}
    </span>
  );
}

export default async function TrangXepHang({ searchParams }: { searchParams: Promise<Tham> }) {
  const nd = await yeuCauQuyen('seo.xem');
  const sp = await searchParams;
  const tab = layTab(sp.tab);
  const ngay = layKhoangNgay(sp.ngay);
  const tb = layThietBi(sp.tb);
  const sua = coQuyen(nd.vaiTro, 'seo.sua');
  const p = Math.max(1, Number(sp.p) || 1);

  const [caiDat, mocTrangRows, mocTvRows, soCanhBaoGsc] = await Promise.all([
    prisma.caiDat.findUnique({ where: { khoa: 'SEO_GSC_LAN_CUOI' } }),
    prisma.$queryRaw<{ moc: string | null }[]>`SELECT to_char(MAX("ngay"), 'YYYY-MM-DD') AS "moc" FROM "SeoGscTrangNgay"`,
    prisma.$queryRaw<{ moc: string | null }[]>`SELECT to_char(MAX("ngay"), 'YYYY-MM-DD') AS "moc" FROM "SeoGscNgay"`,
    prisma.seoCanhBao.count({
      where: {
        trangThai: 'MO',
        loai: { in: ['TUT_HANG', 'TRUNG_Y_DINH'] },
        chiTiet: { path: ['nguon'], equals: 'gsc' },
      },
    }),
  ]);

  const bc = (caiDat?.giaTri ?? null) as BaoCaoGscLuu | null;
  const moc = mocTrangRows[0]?.moc ?? mocTvRows[0]?.moc ?? null;
  const tu = moc ? truNgayYmd(moc, ngay - 1) : null;
  const den = moc;
  const truocTu = moc ? truNgayYmd(moc, 2 * ngay - 1) : null;
  const truocDen = moc ? truNgayYmd(moc, ngay) : null;

  const qs = (thay: Partial<Tham>) => {
    const u = new URLSearchParams();
    const gop: Record<string, string | undefined> = {
      tab,
      ngay: String(ngay),
      tb: sp.tb,
      sap: sp.sap,
      chieu: sp.chieu,
      url: sp.url,
      q: sp.q,
      tv: sp.tv,
      loai: sp.loai,
      p: sp.p,
      ...thay,
    };
    for (const [k, v] of Object.entries(gop)) {
      if (v) u.set(k, String(v));
    }
    const s = u.toString();
    return s ? `/quan-tri/seo/xep-hang?${s}` : '/quan-tri/seo/xep-hang';
  };

  const quayVe = qs({ bao: undefined, loi: undefined });

  return (
    <>
      <h1>Xếp hạng Search Console</h1>
      <p className="qt-phu">
        Theo dõi lượt hiển thị, lượt nhấp, CTR, vị trí trung bình và cảnh báo từ Google Search Console.
      </p>
      <ThongBao bao={sp.bao} loi={sp.loi} />

      {!bc && (
        <div className="qt-the">
          Chưa nối Search Console. Cần tệp khóa service account (xem <code>docs/v2/viec-can-anh.md</code>).
        </div>
      )}

      {bc?.thu && (
        <div className="qt-bao" role="alert">
          <b>Dữ liệu GIẢ để thử giao diện</b>
          {bc.ghiChu ? ` — ${bc.ghiChu}` : ''}
        </div>
      )}

      {bc && (
        <div className="qt-lk-tom-tat">
          <span>
            <b>Lần chạy cuối:</b> {dinhDangGioVn(bc.luc)}
          </span>
          <span>
            <b>Site:</b> {bc.site ?? '–'}
          </span>
          <span>
            <b>Khoảng dữ liệu:</b> {dinhDangNgayYmd(bc.tuNgay)} – {dinhDangNgayYmd(bc.denNgay)} ({so(bc.ngay)} ngày)
          </span>
          <span>
            <b>Số dòng:</b> {so(bc.dongTrang)} dòng trang · {so(bc.dongTruyVan)} dòng truy vấn
          </span>
        </div>
      )}

      <div className="qt-loc" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>Khoảng ngày:</span>
          {([7, 28, 90] as const).map((k) => {
            const dangChon = ngay === k;
            return (
              <Link
                key={k}
                href={qs({ ngay: String(k), p: '1' })}
                className={dangChon ? 'qt-nut qt-lk-nut-nho' : 'qt-nut phu qt-lk-nut-nho'}
                aria-current={dangChon ? 'true' : undefined}
              >
                {k} ngày
              </Link>
            );
          })}
          {tu && den && (
            <span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 6 }}>
              ({dinhDangNgayYmd(tu)} – {dinhDangNgayYmd(den)}, tính lùi từ ngày mới nhất có dữ liệu)
            </span>
          )}
        </div>
      </div>

      <nav className="qt-tab-thanh" aria-label="Phân mục xếp hạng Search Console">
        {TABS.map((t) => {
          const active = t.id === tab;
          const href = t.id === tab ? quayVe : `/quan-tri/seo/xep-hang?tab=${t.id}&ngay=${ngay}`;
          return (
            <Link
              key={t.id}
              href={href}
              className="qt-tab qt-lk-tab"
              aria-current={active ? 'page' : undefined}
            >
              <span>{t.ten}</span>
              {t.id === 'canh-bao' && <span className="qt-nhan">{so(soCanhBaoGsc)}</span>}
            </Link>
          );
        })}
      </nav>

      {tab === 'tong-quan' && (
        <TabTongQuan moc={moc} tu={tu} den={den} truocTu={truocTu} truocDen={truocDen} ngay={ngay} />
      )}
      {tab === 'trang' && (
        <TabTrang
          sp={sp}
          p={p}
          tb={tb}
          tu={tu}
          den={den}
          truocTu={truocTu}
          truocDen={truocDen}
          ngay={ngay}
          qs={qs}
        />
      )}
      {tab === 'truy-van' && (
        <TabTruyVan
          sp={sp}
          p={p}
          tb={tb}
          tu={tu}
          den={den}
          truocTu={truocTu}
          truocDen={truocDen}
          ngay={ngay}
          qs={qs}
        />
      )}
      {tab === 'canh-bao' && (
        <TabCanhBao sp={sp} p={p} sua={sua} ngay={ngay} quayVe={quayVe} qs={qs} />
      )}
    </>
  );
}

type ChiSoTong = {
  hienThi: number;
  nhap: number;
  viTriTB: number | null;
};

async function layTongKhoang(tu: string, den: string, dkTb: Prisma.Sql = Prisma.empty): Promise<ChiSoTong> {
  const rows = await prisma.$queryRaw<{ hienThi: number; nhap: number; viTriTB: number | null }[]>(Prisma.sql`
    SELECT COALESCE(SUM("hienThi"), 0)::float8 AS "hienThi",
           COALESCE(SUM("nhap"), 0)::float8 AS "nhap",
           CASE WHEN SUM("hienThi") > 0 THEN (SUM("viTriTB" * "hienThi") / SUM("hienThi"))::float8 ELSE NULL END AS "viTriTB"
    FROM "SeoGscTrangNgay"
    WHERE "ngay" BETWEEN ${tu}::date AND ${den}::date ${dkTb}
  `);
  const r = rows[0];
  return {
    hienThi: Number(r?.hienThi ?? 0),
    nhap: Number(r?.nhap ?? 0),
    viTriTB: r?.viTriTB == null ? null : Number(r.viTriTB),
  };
}

function DongChenhTong({
  nay,
  truoc,
  kieu,
}: {
  nay: number | null;
  truoc: number | null;
  kieu: 'so' | 'ctr' | 'vi_tri';
}) {
  if (nay == null || truoc == null) {
    return <div className="qt-xg-chenh" style={{ color: 'var(--muted)' }}>Chưa có kỳ trước</div>;
  }
  if (kieu === 'vi_tri') {
    const caiThien = truoc - nay;
    if (Math.abs(caiThien) < 0.05) {
      return <div className="qt-xg-chenh" style={{ color: 'var(--muted)' }}>Không đổi so với kỳ trước</div>;
    }
    const tot = caiThien > 0;
    return (
      <div className={`qt-xg-chenh ${tot ? 'qt-xg-tot' : 'qt-xg-xau'}`}>
        {tot ? '▲' : '▼'} {tot ? 'tốt hơn' : 'tụt'} {soThapPhan(Math.abs(caiThien), 1)} (kỳ trước{' '}
        {soThapPhan(truoc, 1)})
      </div>
    );
  }
  if (kieu === 'ctr') {
    const chenhDiem = (nay - truoc) * 100;
    if (Math.abs(chenhDiem) < 0.01) {
      return <div className="qt-xg-chenh" style={{ color: 'var(--muted)' }}>Không đổi so với kỳ trước</div>;
    }
    const tot = chenhDiem > 0;
    return (
      <div className={`qt-xg-chenh ${tot ? 'qt-xg-tot' : 'qt-xg-xau'}`}>
        {tot ? '▲' : '▼'} {tot ? '+' : '-'}
        {soThapPhan(Math.abs(chenhDiem), 2)} đ%
      </div>
    );
  }
  const chenh = nay - truoc;
  if (chenh === 0) {
    return <div className="qt-xg-chenh" style={{ color: 'var(--muted)' }}>Không đổi so với kỳ trước</div>;
  }
  const tot = chenh > 0;
  const pct = truoc > 0 ? ` (${tot ? '+' : '-'}${soThapPhan((Math.abs(chenh) / truoc) * 100, 1)}%)` : '';
  return (
    <div className={`qt-xg-chenh ${tot ? 'qt-xg-tot' : 'qt-xg-xau'}`}>
      {tot ? '▲' : '▼'} {tot ? '+' : '-'}
      {so(Math.abs(Math.round(chenh)))}
      {pct}
    </div>
  );
}

async function TabTongQuan({
  moc,
  tu,
  den,
  truocTu,
  truocDen,
  ngay,
}: {
  moc: string | null;
  tu: string | null;
  den: string | null;
  truocTu: string | null;
  truocDen: string | null;
  ngay: KhoangNgay;
}) {
  const [nay, truoc, diemNgay, nhomCb] =
    moc && tu && den && truocTu && truocDen
      ? await Promise.all([
          layTongKhoang(tu, den),
          layTongKhoang(truocTu, truocDen),
          prisma.$queryRaw<DiemBieuDoGsc[]>(Prisma.sql`
            SELECT to_char("ngay", 'YYYY-MM-DD') AS "ngay",
                   COALESCE(SUM("hienThi"), 0)::float8 AS "hienThi",
                   COALESCE(SUM("nhap"), 0)::float8 AS "nhap"
            FROM "SeoGscTrangNgay"
            WHERE "ngay" BETWEEN ${tu}::date AND ${den}::date
            GROUP BY "ngay"
            ORDER BY "ngay" ASC
          `),
          prisma.seoCanhBao.groupBy({
            by: ['loai'],
            where: {
              trangThai: 'MO',
              loai: { in: ['TUT_HANG', 'TRUNG_Y_DINH'] },
              chiTiet: { path: ['nguon'], equals: 'gsc' },
            },
            _count: true,
          }),
        ])
      : [
          null,
          null,
          [] as DiemBieuDoGsc[],
          [] as { loai: string; _count: number }[],
        ];

  const coTruoc = Boolean(truoc && truoc.hienThi > 0);
  const ctrNay = nay && nay.hienThi > 0 ? nay.nhap / nay.hienThi : null;
  const ctrTruoc = coTruoc && truoc && truoc.hienThi > 0 ? truoc.nhap / truoc.hienThi : null;

  const demCb = new Map(nhomCb.map((r) => [r.loai, r._count]));
  const cacLoaiGsc = ['TUT_HANG', 'TRUNG_Y_DINH'] as const;

  return (
    <>
      <div className="qt-luoi">
        <div className="qt-so">
          <div className="qt-so-nhan">Tổng hiển thị ({ngay} ngày)</div>
          <div className="qt-so-gt">{nay ? so(nay.hienThi) : 'chưa có dữ liệu'}</div>
          {nay && <DongChenhTong nay={nay.hienThi} truoc={coTruoc ? truoc!.hienThi : null} kieu="so" />}
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Tổng nhấp ({ngay} ngày)</div>
          <div className="qt-so-gt">{nay ? so(nay.nhap) : 'chưa có dữ liệu'}</div>
          {nay && <DongChenhTong nay={nay.nhap} truoc={coTruoc ? truoc!.nhap : null} kieu="so" />}
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">CTR trung bình</div>
          <div className="qt-so-gt">{nay ? dinhDangCtr(nay.nhap, nay.hienThi) : 'chưa có dữ liệu'}</div>
          {nay && <DongChenhTong nay={ctrNay} truoc={ctrTruoc} kieu="ctr" />}
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Vị trí trung bình</div>
          <div className="qt-so-gt">{nay ? soThapPhan(nay.viTriTB, 1) : 'chưa có dữ liệu'}</div>
          {nay && <DongChenhTong nay={nay.viTriTB} truoc={coTruoc ? truoc!.viTriTB : null} kieu="vi_tri" />}
        </div>
      </div>

      <div className="qt-the">
        <h2>Hiển thị &amp; nhấp theo ngày ({ngay} ngày)</h2>
        <BieuDoGscSvg
          diem={diemNgay.map((d) => ({ ngay: d.ngay, hienThi: Number(d.hienThi), nhap: Number(d.nhap) }))}
        />
      </div>

      <div className="qt-the qt-the-cuon">
        <h2>Cảnh báo Search Console đang mở theo loại</h2>
        <p className="qt-phu">Bấm vào một dòng để xem danh sách cảnh báo đã lọc theo loại đó.</p>
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Loại cảnh báo</th>
              <th>Mã loại</th>
              <th className="qt-cot-so">Số cảnh báo mở</th>
              <th>Xem</th>
            </tr>
          </thead>
          <tbody>
            {cacLoaiGsc.map((loai) => {
              const dem = demCb.get(loai) ?? 0;
              const href = `/quan-tri/seo/xep-hang?tab=canh-bao&loai=${loai}&ngay=${ngay}`;
              return (
                <tr key={loai}>
                  <td>
                    <Link href={href}>
                      <b>{TEN_LOAI_CANH_BAO[loai] ?? loai}</b>
                    </Link>
                  </td>
                  <td>
                    <code>{loai}</code>
                  </td>
                  <td className="qt-cot-so">
                    <span className={`qt-nhan ${dem > 0 ? 'xau' : ''}`}>{so(dem)}</span>
                  </td>
                  <td>
                    <Link href={href}>Mở danh sách →</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

type DongTrangGsc = {
  url: string;
  trangId: string | null;
  hienThi: number;
  nhap: number;
  ctr: number;
  viTriTB: number | null;
  viTriTruoc: number | null;
  chenhViTri: number | null;
};

async function TabTrang({
  sp,
  p,
  tb,
  tu,
  den,
  truocTu,
  truocDen,
  ngay,
  qs,
}: {
  sp: Tham;
  p: number;
  tb: ThietBi | '';
  tu: string | null;
  den: string | null;
  truocTu: string | null;
  truocDen: string | null;
  ngay: KhoangNgay;
  qs: (thay: Partial<Tham>) => string;
}) {
  const sap = laySapTrang(sp.sap);
  const chieu = layChieu(sp.chieu, sap);
  const dkTb = tb ? Prisma.sql`AND "thietBi" = ${tb}` : Prisma.empty;
  const orderSql = sqlSapXep(sap, chieu);
  const urlChon = sp.url?.trim() || '';

  const [tongRows, ds, chiTietDiem, chiTietTruyVan] =
    tu && den && truocTu && truocDen
      ? await Promise.all([
          prisma.$queryRaw<{ tong: number }[]>(Prisma.sql`
            SELECT COUNT(DISTINCT "url")::int AS "tong"
            FROM "SeoGscTrangNgay"
            WHERE "ngay" BETWEEN ${tu}::date AND ${den}::date ${dkTb}
          `),
          prisma.$queryRaw<DongTrangGsc[]>(Prisma.sql`
            WITH nay AS (
              SELECT "url", MAX("trangId") AS "trangId",
                     SUM("hienThi")::float8 AS "hienThi",
                     SUM("nhap")::float8 AS "nhap",
                     CASE WHEN SUM("hienThi") > 0 THEN (SUM("viTriTB" * "hienThi") / SUM("hienThi"))::float8 ELSE NULL END AS "viTriTB"
              FROM "SeoGscTrangNgay"
              WHERE "ngay" BETWEEN ${tu}::date AND ${den}::date ${dkTb}
              GROUP BY "url"
            ),
            truoc AS (
              SELECT "url",
                     CASE WHEN SUM("hienThi") > 0 THEN (SUM("viTriTB" * "hienThi") / SUM("hienThi"))::float8 ELSE NULL END AS "viTriTruoc"
              FROM "SeoGscTrangNgay"
              WHERE "ngay" BETWEEN ${truocTu}::date AND ${truocDen}::date ${dkTb}
              GROUP BY "url"
            ),
            hop AS (
              SELECT n."url", n."trangId", n."hienThi", n."nhap",
                     CASE WHEN n."hienThi" > 0 THEN (n."nhap" / n."hienThi")::float8 ELSE 0 END AS "ctr",
                     n."viTriTB",
                     t."viTriTruoc",
                     CASE WHEN n."viTriTB" IS NOT NULL AND t."viTriTruoc" IS NOT NULL
                          THEN (t."viTriTruoc" - n."viTriTB")::float8 ELSE NULL END AS "chenhViTri"
              FROM nay n
              LEFT JOIN truoc t ON t."url" = n."url"
            )
            SELECT * FROM hop
            ${orderSql}
            LIMIT ${CO} OFFSET ${(p - 1) * CO}
          `),
          urlChon
            ? prisma.$queryRaw<DiemBieuDoGsc[]>(Prisma.sql`
                SELECT to_char("ngay", 'YYYY-MM-DD') AS "ngay",
                       COALESCE(SUM("hienThi"), 0)::float8 AS "hienThi",
                       COALESCE(SUM("nhap"), 0)::float8 AS "nhap"
                FROM "SeoGscTrangNgay"
                WHERE "url" = ${urlChon} AND "ngay" BETWEEN ${tu}::date AND ${den}::date ${dkTb}
                GROUP BY "ngay"
                ORDER BY "ngay" ASC
              `)
            : Promise.resolve([] as DiemBieuDoGsc[]),
          urlChon
            ? prisma.$queryRaw<{ truyVan: string; hienThi: number; nhap: number; viTriTB: number | null }[]>(Prisma.sql`
                SELECT "truyVan",
                       SUM("hienThi")::float8 AS "hienThi",
                       SUM("nhap")::float8 AS "nhap",
                       CASE WHEN SUM("hienThi") > 0 THEN (SUM("viTriTB" * "hienThi") / SUM("hienThi"))::float8 ELSE NULL END AS "viTriTB"
                FROM "SeoGscNgay"
                WHERE "url" = ${urlChon} AND "ngay" BETWEEN ${tu}::date AND ${den}::date ${dkTb}
                GROUP BY "truyVan"
                ORDER BY "hienThi" DESC, "nhap" DESC
                LIMIT 100
              `)
            : Promise.resolve([] as { truyVan: string; hienThi: number; nhap: number; viTriTB: number | null }[]),
        ])
      : [[{ tong: 0 }], [], [], []];

  const tong = Number(tongRows[0]?.tong ?? 0);
  const soTrang = Math.max(1, Math.ceil(tong / CO));

  return (
    <>
      <form className="qt-loc" method="get">
        <input type="hidden" name="tab" value="trang" />
        <input type="hidden" name="ngay" value={String(ngay)} />
        {urlChon && <input type="hidden" name="url" value={urlChon} />}
        <select className="qt-o" name="tb" defaultValue={tb} aria-label="Thiết bị">
          <option value="">Mọi thiết bị</option>
          <option value="MOBILE">MOBILE</option>
          <option value="DESKTOP">DESKTOP</option>
          <option value="TABLET">TABLET</option>
        </select>
        <select className="qt-o" name="sap" defaultValue={sap} aria-label="Sắp xếp theo">
          <option value="hien_thi">Sắp theo: Hiển thị</option>
          <option value="nhap">Sắp theo: Nhấp</option>
          <option value="ctr">Sắp theo: CTR</option>
          <option value="vi_tri">Sắp theo: Vị trí TB</option>
          <option value="chenh_vi_tri">Sắp theo: Chênh vị trí</option>
        </select>
        <select className="qt-o" name="chieu" defaultValue={chieu} aria-label="Thứ tự">
          <option value="desc">Giảm dần</option>
          <option value="asc">Tăng dần</option>
        </select>
        <button className="qt-nut" type="submit">
          Áp dụng
        </button>
        <Link className="qt-nut phu" href={`/quan-tri/seo/xep-hang?tab=trang&ngay=${ngay}`}>
          Xóa lọc
        </Link>
        <span className="qt-phu" style={{ margin: 0 }}>
          {so(tong)} URL · {CO} dòng/trang
        </span>
      </form>

      {urlChon && (
        <div className="qt-the">
          <div className="qt-dau-trang" style={{ marginBottom: 10 }}>
            <div>
              <h2 style={{ marginBottom: 2 }}>Chi tiết trang: {urlChon}</h2>
              <p className="qt-phu" style={{ margin: 0 }}>
                Tổng theo truy vấn nhỏ hơn tổng theo trang vì Google ẩn truy vấn hiếm.
              </p>
            </div>
            <Link className="qt-nut phu qt-lk-nut-nho" href={qs({ url: undefined })}>
              Đóng chi tiết
            </Link>
          </div>

          <BieuDoGscSvg
            diem={chiTietDiem.map((d) => ({ ngay: d.ngay, hienThi: Number(d.hienThi), nhap: Number(d.nhap) }))}
            tieuDe="Theo ngày"
          />

          <div className="qt-the-cuon" style={{ marginTop: 12 }}>
            <table className="qt-bang">
              <thead>
                <tr>
                  <th>Truy vấn của URL này</th>
                  <th className="qt-cot-so">Hiển thị</th>
                  <th className="qt-cot-so">Nhấp</th>
                  <th className="qt-cot-so">CTR</th>
                  <th className="qt-cot-so">Vị trí TB</th>
                </tr>
              </thead>
              <tbody>
                {chiTietTruyVan.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ color: 'var(--muted)' }}>
                      chưa có dữ liệu
                    </td>
                  </tr>
                )}
                {chiTietTruyVan.map((r) => (
                  <tr key={r.truyVan}>
                    <td>
                      <Link
                        href={`/quan-tri/seo/xep-hang?tab=truy-van&ngay=${ngay}&tv=${encodeURIComponent(r.truyVan)}${tb ? `&tb=${tb}` : ''}`}
                      >
                        {r.truyVan}
                      </Link>
                    </td>
                    <td className="qt-cot-so">{so(r.hienThi)}</td>
                    <td className="qt-cot-so">{so(r.nhap)}</td>
                    <td className="qt-cot-so">{dinhDangCtr(Number(r.nhap), Number(r.hienThi))}</td>
                    <td className="qt-cot-so">{soThapPhan(r.viTriTB == null ? null : Number(r.viTriTB), 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Đường dẫn</th>
              <th className="qt-cot-so">Hiển thị</th>
              <th className="qt-cot-so">Nhấp</th>
              <th className="qt-cot-so">CTR</th>
              <th className="qt-cot-so">Vị trí TB</th>
              <th className="qt-cot-so">Chênh vị trí</th>
              <th>Chi tiết GSC</th>
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 && (
              <tr>
                <td colSpan={7} style={{ color: 'var(--muted)' }}>
                  chưa có dữ liệu
                </td>
              </tr>
            )}
            {ds.map((r) => {
              const hrefChiTiet = qs({ url: r.url, p: String(p) });
              return (
                <tr key={r.url}>
                  <td>
                    {r.trangId ? (
                      <Link href={`/quan-tri/seo/trang/${r.trangId}`}>
                        <code>{r.url}</code>
                      </Link>
                    ) : (
                      <code>{r.url}</code>
                    )}
                  </td>
                  <td className="qt-cot-so">{so(r.hienThi)}</td>
                  <td className="qt-cot-so">{so(r.nhap)}</td>
                  <td className="qt-cot-so">{dinhDangCtr(Number(r.nhap), Number(r.hienThi))}</td>
                  <td className="qt-cot-so">{soThapPhan(r.viTriTB == null ? null : Number(r.viTriTB), 1)}</td>
                  <td className="qt-cot-so">
                    <ChenhViTri
                      nay={r.viTriTB == null ? null : Number(r.viTriTB)}
                      truoc={r.viTriTruoc == null ? null : Number(r.viTriTruoc)}
                    />
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link href={hrefChiTiet}>Xem chi tiết</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="qt-loc">
        {p > 1 && (
          <Link className="qt-nut phu" href={qs({ p: String(p - 1) })}>
            ← Trước
          </Link>
        )}
        <span>
          Trang {p}/{soTrang}
        </span>
        {p < soTrang && (
          <Link className="qt-nut phu" href={qs({ p: String(p + 1) })}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}

type DongTruyVanGsc = {
  truyVan: string;
  soUrl: number;
  hienThi: number;
  nhap: number;
  ctr: number;
  viTriTB: number | null;
  viTriTruoc: number | null;
  chenhViTri: number | null;
};

type DongUrlCuaTv = {
  truyVan: string;
  url: string;
  trangId: string | null;
  hienThi: number;
  nhap: number;
  viTriTB: number | null;
};

async function TabTruyVan({
  sp,
  p,
  tb,
  tu,
  den,
  truocTu,
  truocDen,
  ngay,
  qs,
}: {
  sp: Tham;
  p: number;
  tb: ThietBi | '';
  tu: string | null;
  den: string | null;
  truocTu: string | null;
  truocDen: string | null;
  ngay: KhoangNgay;
  qs: (thay: Partial<Tham>) => string;
}) {
  const sap = laySapTruyVan(sp.sap);
  const chieu = layChieu(sp.chieu, sap);
  const q = (sp.q ?? '').trim().slice(0, 200);
  const dkTb = tb ? Prisma.sql`AND "thietBi" = ${tb}` : Prisma.empty;
  const pat = q ? `%${q.replace(/[\\%_]/g, '\\$&')}%` : '';
  const dkQ = q ? Prisma.sql`AND "truyVan" ILIKE ${pat} ESCAPE '\'` : Prisma.empty;
  const orderSql = sqlSapXep(sap, chieu);

  const [tongRows, ds] =
    tu && den && truocTu && truocDen
      ? await Promise.all([
          prisma.$queryRaw<{ tong: number }[]>(Prisma.sql`
            SELECT COUNT(DISTINCT "truyVan")::int AS "tong"
            FROM "SeoGscNgay"
            WHERE "ngay" BETWEEN ${tu}::date AND ${den}::date ${dkTb} ${dkQ}
          `),
          prisma.$queryRaw<DongTruyVanGsc[]>(Prisma.sql`
            WITH nay AS (
              SELECT "truyVan",
                     COUNT(DISTINCT "url")::int AS "soUrl",
                     SUM("hienThi")::float8 AS "hienThi",
                     SUM("nhap")::float8 AS "nhap",
                     CASE WHEN SUM("hienThi") > 0 THEN (SUM("viTriTB" * "hienThi") / SUM("hienThi"))::float8 ELSE NULL END AS "viTriTB"
              FROM "SeoGscNgay"
              WHERE "ngay" BETWEEN ${tu}::date AND ${den}::date ${dkTb} ${dkQ}
              GROUP BY "truyVan"
            ),
            truoc AS (
              SELECT "truyVan",
                     CASE WHEN SUM("hienThi") > 0 THEN (SUM("viTriTB" * "hienThi") / SUM("hienThi"))::float8 ELSE NULL END AS "viTriTruoc"
              FROM "SeoGscNgay"
              WHERE "ngay" BETWEEN ${truocTu}::date AND ${truocDen}::date ${dkTb} ${dkQ}
              GROUP BY "truyVan"
            ),
            hop AS (
              SELECT n."truyVan", n."soUrl", n."hienThi", n."nhap",
                     CASE WHEN n."hienThi" > 0 THEN (n."nhap" / n."hienThi")::float8 ELSE 0 END AS "ctr",
                     n."viTriTB",
                     t."viTriTruoc",
                     CASE WHEN n."viTriTB" IS NOT NULL AND t."viTriTruoc" IS NOT NULL
                          THEN (t."viTriTruoc" - n."viTriTB")::float8 ELSE NULL END AS "chenhViTri"
              FROM nay n
              LEFT JOIN truoc t ON t."truyVan" = n."truyVan"
            )
            SELECT * FROM hop
            ${orderSql}
            LIMIT ${CO} OFFSET ${(p - 1) * CO}
          `),
        ])
      : [[{ tong: 0 }], []];

  const tvList = ds.map((r) => r.truyVan);
  const tvChon = sp.tv?.trim() || (q && ds.length === 1 ? ds[0].truyVan : '');
  const tapTv = Array.from(new Set([...tvList, ...(tvChon ? [tvChon] : [])]));

  const urlRows =
    tu && den && tapTv.length > 0
      ? await prisma.$queryRaw<DongUrlCuaTv[]>(Prisma.sql`
          SELECT "truyVan", "url", MAX("trangId") AS "trangId",
                 SUM("hienThi")::float8 AS "hienThi",
                 SUM("nhap")::float8 AS "nhap",
                 CASE WHEN SUM("hienThi") > 0 THEN (SUM("viTriTB" * "hienThi") / SUM("hienThi"))::float8 ELSE NULL END AS "viTriTB"
          FROM "SeoGscNgay"
          WHERE "ngay" BETWEEN ${tu}::date AND ${den}::date ${dkTb} AND "truyVan" = ANY(${tapTv}::text[])
          GROUP BY "truyVan", "url"
          ORDER BY "truyVan" ASC, "hienThi" DESC
        `)
      : [];

  const urlsTheoTv = new Map<string, DongUrlCuaTv[]>();
  for (const r of urlRows) {
    const arr = urlsTheoTv.get(r.truyVan) ?? [];
    arr.push(r);
    urlsTheoTv.set(r.truyVan, arr);
  }

  const chiTietUrls = tvChon ? urlsTheoTv.get(tvChon) ?? [] : [];
  const tongHtTv = chiTietUrls.reduce((s, u) => s + Number(u.hienThi), 0);

  const tong = Number(tongRows[0]?.tong ?? 0);
  const soTrang = Math.max(1, Math.ceil(tong / CO));

  return (
    <>
      <form className="qt-loc" method="get">
        <input type="hidden" name="tab" value="truy-van" />
        <input type="hidden" name="ngay" value={String(ngay)} />
        <input
          className="qt-o"
          name="q"
          defaultValue={q}
          placeholder="Tìm truy vấn..."
          style={{ minWidth: 230 }}
        />
        <select className="qt-o" name="tb" defaultValue={tb} aria-label="Thiết bị">
          <option value="">Mọi thiết bị</option>
          <option value="MOBILE">MOBILE</option>
          <option value="DESKTOP">DESKTOP</option>
          <option value="TABLET">TABLET</option>
        </select>
        <select className="qt-o" name="sap" defaultValue={sap} aria-label="Sắp xếp theo">
          <option value="hien_thi">Sắp theo: Hiển thị</option>
          <option value="nhap">Sắp theo: Nhấp</option>
          <option value="ctr">Sắp theo: CTR</option>
          <option value="vi_tri">Sắp theo: Vị trí TB</option>
          <option value="chenh_vi_tri">Sắp theo: Chênh vị trí</option>
          <option value="so_url">Sắp theo: Số URL</option>
        </select>
        <select className="qt-o" name="chieu" defaultValue={chieu} aria-label="Thứ tự">
          <option value="desc">Giảm dần</option>
          <option value="asc">Tăng dần</option>
        </select>
        <button className="qt-nut" type="submit">
          Lọc
        </button>
        <Link className="qt-nut phu" href={`/quan-tri/seo/xep-hang?tab=truy-van&ngay=${ngay}`}>
          Xóa lọc
        </Link>
        <span className="qt-phu" style={{ margin: 0 }}>
          {so(tong)} truy vấn · {CO} dòng/trang
        </span>
      </form>

      {tvChon && (
        <div className="qt-the">
          <div className="qt-dau-trang" style={{ marginBottom: 10 }}>
            <div>
              <h2 style={{ marginBottom: 2 }}>Phân bổ URL cho truy vấn: «{tvChon}»</h2>
              <p className="qt-phu" style={{ margin: 0 }}>
                Tổng hiển thị {so(tongHtTv)} trên {so(chiTietUrls.length)} URL. Nếu URL thứ hai chiếm ≥ 20% sẽ tô vàng
                cảnh báo trùng ý định.
              </p>
            </div>
            {sp.tv && (
              <Link className="qt-nut phu qt-lk-nut-nho" href={qs({ tv: undefined })}>
                Đóng chi tiết
              </Link>
            )}
          </div>
          <table className="qt-bang">
            <thead>
              <tr>
                <th className="qt-cot-so">#</th>
                <th>URL</th>
                <th className="qt-cot-so">Hiển thị</th>
                <th className="qt-cot-so">Tỷ lệ hiển thị</th>
                <th className="qt-cot-so">Nhấp</th>
                <th className="qt-cot-so">Vị trí TB</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {chiTietUrls.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: 'var(--muted)' }}>
                    chưa có dữ liệu
                  </td>
                </tr>
              )}
              {chiTietUrls.map((u, idx) => {
                const tyLe = tongHtTv > 0 ? Number(u.hienThi) / tongHtTv : 0;
                const trungY = idx === 1 && tyLe >= 0.2;
                return (
                  <tr key={u.url} className={trungY ? 'qt-xg-vang' : undefined}>
                    <td className="qt-cot-so">{idx + 1}</td>
                    <td>
                      <Link
                        href={`/quan-tri/seo/xep-hang?tab=trang&ngay=${ngay}&url=${encodeURIComponent(u.url)}${tb ? `&tb=${tb}` : ''}`}
                      >
                        <code>{u.url}</code>
                      </Link>
                    </td>
                    <td className="qt-cot-so">{so(u.hienThi)}</td>
                    <td className="qt-cot-so">{soThapPhan(tyLe * 100, 1)}%</td>
                    <td className="qt-cot-so">{so(u.nhap)}</td>
                    <td className="qt-cot-so">{soThapPhan(u.viTriTB == null ? null : Number(u.viTriTB), 1)}</td>
                    <td>
                      {trungY ? (
                        <span className="qt-nhan vua">có thể trùng ý định</span>
                      ) : idx === 0 ? (
                        <span className="qt-nhan">URL chính</span>
                      ) : (
                        '–'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Truy vấn</th>
              <th className="qt-cot-so">Số URL</th>
              <th>URL chính</th>
              <th className="qt-cot-so">Hiển thị</th>
              <th className="qt-cot-so">Nhấp</th>
              <th className="qt-cot-so">CTR</th>
              <th className="qt-cot-so">Vị trí TB</th>
              <th className="qt-cot-so">Chênh vị trí</th>
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 && (
              <tr>
                <td colSpan={8} style={{ color: 'var(--muted)' }}>
                  chưa có dữ liệu
                </td>
              </tr>
            )}
            {ds.map((r) => {
              const urls = urlsTheoTv.get(r.truyVan) ?? [];
              const urlChinh = urls[0];
              const tongHt = urls.reduce((s, u) => s + Number(u.hienThi), 0);
              const coTrung = urls.length >= 2 && tongHt > 0 && Number(urls[1].hienThi) / tongHt >= 0.2;
              return (
                <tr key={r.truyVan}>
                  <td>
                    <Link href={qs({ tv: r.truyVan })}>
                      <b>{r.truyVan}</b>
                    </Link>
                    {coTrung && (
                      <span className="qt-nhan vua" style={{ marginLeft: 6 }}>
                        có thể trùng ý định
                      </span>
                    )}
                  </td>
                  <td className="qt-cot-so">{so(r.soUrl)}</td>
                  <td>
                    {urlChinh ? (
                      urlChinh.trangId ? (
                        <Link href={`/quan-tri/seo/trang/${urlChinh.trangId}`}>
                          <code>{urlChinh.url}</code>
                        </Link>
                      ) : (
                        <code>{urlChinh.url}</code>
                      )
                    ) : (
                      '–'
                    )}
                  </td>
                  <td className="qt-cot-so">{so(r.hienThi)}</td>
                  <td className="qt-cot-so">{so(r.nhap)}</td>
                  <td className="qt-cot-so">{dinhDangCtr(Number(r.nhap), Number(r.hienThi))}</td>
                  <td className="qt-cot-so">{soThapPhan(r.viTriTB == null ? null : Number(r.viTriTB), 1)}</td>
                  <td className="qt-cot-so">
                    <ChenhViTri
                      nay={r.viTriTB == null ? null : Number(r.viTriTB)}
                      truoc={r.viTriTruoc == null ? null : Number(r.viTriTruoc)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="qt-loc">
        {p > 1 && (
          <Link className="qt-nut phu" href={qs({ p: String(p - 1) })}>
            ← Trước
          </Link>
        )}
        <span>
          Trang {p}/{soTrang}
        </span>
        {p < soTrang && (
          <Link className="qt-nut phu" href={qs({ p: String(p + 1) })}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}

async function TabCanhBao({
  sp,
  p,
  sua,
  ngay,
  quayVe,
  qs,
}: {
  sp: Tham;
  p: number;
  sua: boolean;
  ngay: KhoangNgay;
  quayVe: string;
  qs: (thay: Partial<Tham>) => string;
}) {
  const loaiLoc = sp.loai === 'TUT_HANG' || sp.loai === 'TRUNG_Y_DINH' ? sp.loai : '';
  const where: Prisma.SeoCanhBaoWhereInput = {
    trangThai: 'MO',
    loai: loaiLoc || { in: ['TUT_HANG', 'TRUNG_Y_DINH'] },
    chiTiet: { path: ['nguon'], equals: 'gsc' },
  };

  const [tong, ds] = await Promise.all([
    prisma.seoCanhBao.count({ where }),
    prisma.seoCanhBao.findMany({
      where,
      orderBy: [{ mucDo: 'asc' }, { taoLuc: 'desc' }, { id: 'desc' }],
      skip: (p - 1) * CO,
      take: CO,
      include: {
        trang: { select: { id: true, duongDan: true } },
      },
    }),
  ]);

  const soTrang = Math.max(1, Math.ceil(tong / CO));

  return (
    <>
      <form className="qt-loc" method="get">
        <input type="hidden" name="tab" value="canh-bao" />
        <input type="hidden" name="ngay" value={String(ngay)} />
        <select className="qt-o" name="loai" defaultValue={loaiLoc} aria-label="Loại cảnh báo">
          <option value="">Mọi loại cảnh báo GSC</option>
          <option value="TUT_HANG">Tụt hạng (TUT_HANG)</option>
          <option value="TRUNG_Y_DINH">Trùng ý định (TRUNG_Y_DINH)</option>
        </select>
        <button className="qt-nut" type="submit">
          Lọc
        </button>
        <Link className="qt-nut phu" href={`/quan-tri/seo/xep-hang?tab=canh-bao&ngay=${ngay}`}>
          Xóa lọc
        </Link>
        <span className="qt-phu" style={{ margin: 0 }}>
          {so(tong)} cảnh báo GSC đang mở
        </span>
      </form>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Loại</th>
              <th>Mức</th>
              <th>Nội dung cảnh báo</th>
              <th>Lúc tạo</th>
              {sua && <th>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 && (
              <tr>
                <td colSpan={sua ? 5 : 4} style={{ color: 'var(--muted)' }}>
                  chưa có dữ liệu
                </td>
              </tr>
            )}
            {ds.map((c) => (
              <tr key={c.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div>
                    <b>{TEN_LOAI_CANH_BAO[c.loai] ?? c.loai}</b>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.loai}</div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{nhanMucDo(c.mucDo)}</td>
                <td>
                  {moTaCanhBaoGsc(c.loai, c.chiTiet)}
                  {c.trang && (
                    <div style={{ fontSize: 11, marginTop: 4 }}>
                      <Link href={`/quan-tri/seo/trang/${c.trang.id}`}>Mở trang {c.trang.duongDan}</Link>
                    </div>
                  )}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{dinhDangGioVn(c.taoLuc)}</td>
                {sua && (
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="qt-lk-form">
                      <form action={xuLyCanhBaoGsc}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="trangThai" value="DA_XU_LY" />
                        <input type="hidden" name="quayVe" value={quayVe} />
                        <button className="qt-nut qt-lk-nut-nho" type="submit">
                          Đã xử lý
                        </button>
                      </form>
                      <form action={xuLyCanhBaoGsc}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="trangThai" value="BO_QUA" />
                        <input type="hidden" name="quayVe" value={quayVe} />
                        <button className="qt-nut phu qt-lk-nut-nho" type="submit">
                          Bỏ qua
                        </button>
                      </form>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="qt-phu" style={{ marginTop: 8 }}>
        Lần đồng bộ sau tự đóng cảnh báo không còn đúng; ngưỡng là giả định (doc 17 mục 1.5).
      </p>

      <div className="qt-loc">
        {p > 1 && (
          <Link className="qt-nut phu" href={qs({ p: String(p - 1) })}>
            ← Trước
          </Link>
        )}
        <span>
          Trang {p}/{soTrang}
        </span>
        {p < soTrang && (
          <Link className="qt-nut phu" href={qs({ p: String(p + 1) })}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}

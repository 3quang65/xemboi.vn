import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { dinhDangDateVN } from '@/components/ck/TrangBaiViet';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { danhSachBaiViet } from '@/lib/trang/nen';

export const dynamic = 'force-dynamic';

const MOI_TRANG = 12;

const MAC_DINH_KIEN_THUC = {
  title: 'Kiến thức huyền học có nguồn: bài giải thích, so sánh',
  h1: 'Kiến thức huyền học',
};

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function phanTichPhanTrang(
  sp: Record<string, string | string[] | undefined>,
  tongBai: number,
) {
  const tongTrang = Math.max(1, Math.ceil(tongBai / MOI_TRANG));
  const coThamSoLa = Object.entries(sp).some(([k, v]) => {
    if (k === 'trang') return false;
    return Array.isArray(v)
      ? v.some((x) => x.trim() !== '')
      : typeof v === 'string' && v.trim() !== '';
  });

  const trangRaw = layMot(sp.trang)?.trim();
  if (!trangRaw) {
    return {
      trang: 1,
      tongTrang,
      coThamSo: coThamSoLa,
      hopLe: !coThamSoLa,
      canonical: 'https://xemboi.vn/kien-thuc',
    };
  }

  if (!/^[1-9]\d*$/.test(trangRaw)) {
    return {
      trang: 1,
      tongTrang,
      coThamSo: true,
      hopLe: false,
      canonical: 'https://xemboi.vn/kien-thuc',
    };
  }

  const n = Number(trangRaw);
  if (n === 1 || n > tongTrang || coThamSoLa) {
    return {
      trang: n,
      tongTrang,
      coThamSo: true,
      hopLe: false,
      canonical: 'https://xemboi.vn/kien-thuc',
    };
  }

  return {
    trang: n,
    tongTrang,
    coThamSo: true,
    hopLe: true,
    canonical: `https://xemboi.vn/kien-thuc?trang=${n}`,
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, ds, base] = await Promise.all([
    searchParams,
    danhSachBaiViet(),
    metaTrang('/kien-thuc', MAC_DINH_KIEN_THUC),
  ]);

  const pt = phanTichPhanTrang(sp, ds.length);
  if (!pt.coThamSo) return base;

  if (!pt.hopLe) {
    return {
      ...base,
      alternates: { canonical: pt.canonical },
      robots: { index: false, follow: true },
    };
  }

  const baseTitle =
    typeof base.title === 'object' && base.title && 'absolute' in base.title
      ? String(base.title.absolute)
      : MAC_DINH_KIEN_THUC.title;
  const titleTrang = `${baseTitle} – Trang ${pt.trang}`;

  return {
    ...base,
    title: { absolute: titleTrang },
    alternates: { canonical: pt.canonical },
    openGraph: {
      ...base.openGraph,
      url: pt.canonical,
      title: titleTrang,
    },
  };
}

export default async function KienThucPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp, ds] = await Promise.all([
    thongTinTrang('/kien-thuc', MAC_DINH_KIEN_THUC),
    searchParams,
    danhSachBaiViet(),
  ]);

  const pt = phanTichPhanTrang(sp, ds.length);
  const batDau = (pt.trang - 1) * MOI_TRANG;
  const baiTrongTrang = ds.slice(batDau, batDau + MOI_TRANG);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/kien-thuc"
      tenCuoi="Kiến thức"
      toi
    >
      {ds.length === 0 ? (
        <div className="ck-cho-noi-dung">
          <p>Bài đang được biên tập</p>
        </div>
      ) : baiTrongTrang.length === 0 ? (
        <div className="ck-cho-noi-dung">
          <p>
            Không có bài viết ở trang này.{' '}
            <Link href="/kien-thuc">Quay lại trang đầu</Link>.
          </p>
        </div>
      ) : (
        <>
          <ul className="ck-bai-ds">
            {baiTrongTrang.map((b) => (
              <li key={b.duongDan} className="ck-bai-the">
                <h2 className="ck-bai-the-tieu">
                  <Link href={b.duongDan}>{b.tieuDe}</Link>
                </h2>
                {b.tomTat ? <p className="ck-bai-tom-tat">{b.tomTat}</p> : null}
                {b.ngayXuatBan ? (
                  <time
                    dateTime={b.ngayXuatBan.toISOString()}
                    className="ck-bai-ngay-the"
                  >
                    {dinhDangDateVN(b.ngayXuatBan)}
                  </time>
                ) : null}
              </li>
            ))}
          </ul>

          {pt.tongTrang > 1 ? (
            <nav className="ck-bai-phan-trang" aria-label="Phân trang bài viết">
              {Array.from({ length: pt.tongTrang }, (_, i) => i + 1).map((so) =>
                so === pt.trang ? (
                  <span key={so} className="ck-on" aria-current="page">
                    {so}
                  </span>
                ) : (
                  <Link
                    key={so}
                    href={so === 1 ? '/kien-thuc' : `/kien-thuc?trang=${so}`}
                  >
                    {so}
                  </Link>
                ),
              )}
            </nav>
          ) : null}
        </>
      )}
    </KhungTrang>
  );
}

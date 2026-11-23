import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  danhSachNguonCongKhai,
  nguonTheoSlug,
  soBaiTrichNguon,
  type NguonCongKhai,
} from '@/lib/trang/nen';

function macDinhNguon(n: NguonCongKhai) {
  return {
    title: `${n.tenHienThi} (${n.tacGia ?? 'khuyết danh'}, ${n.nienDai ?? 'chưa rõ'}) – nội dung, bản quyền`,
    description: `${n.tenHienThi}: tác giả, niên đại, bản in, phân loại và tình trạng bản quyền.`,
    h1: n.tenHienThi,
  };
}

function thamSoNguon(n: NguonCongKhai) {
  return {
    'Tên sách': n.tenHienThi,
    'tác giả': n.tacGia ?? 'khuyết danh',
    năm: n.nienDai ?? 'chưa rõ',
  };
}

export async function generateStaticParams() {
  const ds = await danhSachNguonCongKhai();
  return ds.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const nguon = await nguonTheoSlug(slug);
  if (!nguon) notFound();

  return metaTrang(
    `/nguon/${nguon.slug}`,
    macDinhNguon(nguon),
    '/nguon/{slug-sach}',
    thamSoNguon(nguon),
  );
}

export default async function NguonChiTietPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nguon = await nguonTheoSlug(slug);
  if (!nguon) notFound();

  const duongDan = `/nguon/${nguon.slug}`;
  const [tt, soBai] = await Promise.all([
    thongTinTrang(
      duongDan,
      macDinhNguon(nguon),
      '/nguon/{slug-sach}',
      thamSoNguon(nguon),
    ),
    soBaiTrichNguon(nguon.ma),
  ]);

  const dongThongTin: { nhan: string; giaTri: string }[] = [
    { nhan: 'Tên Hán Việt', giaTri: nguon.tenHanViet ?? '—' },
    { nhan: 'Tác giả', giaTri: nguon.tacGia ?? '—' },
    { nhan: 'Niên đại', giaTri: nguon.nienDai ?? '—' },
    { nhan: 'Bản in', giaTri: nguon.banIn ?? '—' },
    {
      nhan: 'Ngôn ngữ',
      giaTri: nguon.ngonNgu.length > 0 ? nguon.ngonNgu.join(', ') : '—',
    },
    {
      nhan: 'Mảng',
      giaTri: nguon.mang.length > 0 ? nguon.mang.join(', ') : '—',
    },
    { nhan: 'Loại', giaTri: nguon.tenLoai },
    { nhan: 'Giấy phép', giaTri: nguon.giayPhep ?? '—' },
    { nhan: 'Ghi công', giaTri: nguon.ghiCong ?? '—' },
  ];

  const schemaBook = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: nguon.tenHienThi,
    ...(nguon.tacGia
      ? { author: { '@type': 'Person', name: nguon.tacGia } }
      : {}),
    ...(nguon.ngonNgu.length > 0
      ? {
          inLanguage:
            nguon.ngonNgu.length === 1 ? nguon.ngonNgu[0] : nguon.ngonNgu,
        }
      : {}),
    ...(nguon.url ? { url: nguon.url } : {}),
  };

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={duongDan}
      tenCuoi={nguon.tenHienThi}
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaBook).replace(/</g, '\\u003c'),
        }}
      />

      <section className="ck-td-muc" aria-labelledby="ck-ng-tt-tieu">
        <h2 id="ck-ng-tt-tieu" className="ck-td-tieu">
          Thông tin thư mục
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang ck-bang-the ck-ng-chi-tiet-bang">
            <tbody>
              {dongThongTin.map((d) => (
                <tr key={d.nhan}>
                  <th scope="row">{d.nhan}</th>
                  <td data-nhan={d.nhan}>{d.giaTri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {nguon.url || soBai > 0 ? (
          <div className="ck-ng-hanh-dong">
            {nguon.url ? (
              <a
                href={nguon.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="ck-nut"
              >
                Xem bản số hóa
              </a>
            ) : null}
            {soBai > 0 ? (
              <p className="ck-ng-trich-bai">
                Được trích trong {soBai} bài đã xuất bản
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <nav className="ck-lien-quan" aria-label="Điều hướng nguồn sách">
        <h2>Liên kết liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/nguon">Thư mục nguồn sách</Link>
          <Link href="/phuong-phap/chuan-bien-tap">Chuẩn biên tập</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

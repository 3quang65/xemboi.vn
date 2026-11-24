import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { DocNhanh, type TheDocNhanhItem } from '@/components/ck/truc-quan';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  GHI_CHU_VAN_KHAN,
  NGHI_THUC,
  NGUON_GIA_LE,
  TRUONG_DIEN,
  dienMau,
  mauTheoMa,
  type GiaTriDien,
  type TruongDien,
} from '@/lib/trang/van-khan';
import { NutInChepClient } from './NutInChepClient';
import './van-khan.css';

export const dynamic = 'force-dynamic';

const MAC_DINH_VK_GIO = {
  title: 'Văn khấn ngày giỗ ông bà, cha mẹ (giỗ đầu, giỗ thường)',
  h1: 'Văn khấn ngày giỗ',
  description:
    'Văn khấn giỗ đầu, giỗ thường cho ông bà, cha mẹ: văn bản, cách điền tên, nguồn. Có bản tự điền không lưu dữ liệu.',
};

const TRUONG_FORM_GIO: readonly TruongDien[] = [
  'ngay',
  'thang',
  'nam',
  'xungHo',
  'ten',
  'danhXung',
  'nhanVi',
];

const TIEN_TO_NGHI_THUC_GIO = [
  'Lễ giỗ',
  'Làm lễ ở đâu',
  'Đồ lễ',
  'Nơi đặt bàn lễ',
  'Trình tự làm lễ',
];

const TOI_DA_KY_TU = 60;

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

function layChuoi(val: string | string[] | undefined): string {
  const s = Array.isArray(val) ? val[0] : val;
  if (typeof s !== 'string') return '';
  return s.slice(0, TOI_DA_KY_TU);
}

function layGiaTriForm(sp: Record<string, string | string[] | undefined>): {
  giaTri: GiaTriDien;
  coDuLieu: boolean;
} {
  const giaTri: GiaTriDien = {};
  let coDuLieu = false;
  for (const k of TRUONG_FORM_GIO) {
    const v = layChuoi(sp[k]);
    if (v.trim() !== '') {
      giaTri[k] = v;
      coDuLieu = true;
    } else if (v !== '') {
      giaTri[k] = v;
    }
  }
  return { giaTri, coDuLieu };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/van-khan/ngay-gio', MAC_DINH_VK_GIO),
  ]);
  const coQuery = TRUONG_FORM_GIO.some((k) => layChuoi(sp[k]).trim() !== '');
  if (coQuery) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/van-khan/ngay-gio' },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function VanKhanNgayGioPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/van-khan/ngay-gio', MAC_DINH_VK_GIO),
    searchParams,
  ]);

  const mauGio = mauTheoMa('ngay-gio')!;
  const mauTietLe = mauTheoMa('ngay-tiet-le')!;
  const mauThanNha = mauTheoMa('than-trong-nha')!;

  const { giaTri, coDuLieu } = layGiaTriForm(sp);
  const vanDaDien = dienMau('ngay-gio', giaTri);

  const nghiThucGio = NGHI_THUC.filter((d) =>
    TIEN_TO_NGHI_THUC_GIO.some((p) => d.chuDe.startsWith(p)),
  );

  const theDocNhanh: TheDocNhanhItem[] = [
    {
      ma: 'sach-goc',
      nhan: 'Văn bản nguồn',
      giaTri: `${NGUON_GIA_LE.tenSach} (${NGUON_GIA_LE.nam})`,
      muc: 'tot',
      chiTiet: `${NGUON_GIA_LE.tacGia} soạn · ${NGUON_GIA_LE.nhaIn}.`,
    },
    {
      ma: 'chinh-ta',
      nhan: 'Chữ in trên trang',
      giaTri: 'Giữ nguyên bản 1932',
      muc: 'binh',
      chiTiet: 'Giữ nguyên chính tả của sách (như "dỗ" là giỗ, "thần-vị", "giồng cây").',
    },
    {
      ma: 'rieng-tu',
      nhan: 'Điền tên tự động',
      giaTri: 'Không lưu dữ liệu',
      muc: 'diu',
      chiTiet: 'Ô bỏ trống giữ nguyên dấu chấm; chữ nhập chỉ hiện ngay trên trang này.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tt.h1,
    description: tt.description,
    inLanguage: 'vi',
    url: 'https://xemboi.vn/van-khan/ngay-gio',
  };

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/van-khan/ngay-gio"
      breadcrumbRieng={[
        { ten: 'Trang chủ', href: '/' },
        { ten: 'Văn khấn ngày giỗ', href: '/van-khan/ngay-gio' },
      ]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* 1. Đọc nhanh */}
      <div className="ck-vk-an-khi-in">
        <DocNhanh
          tieuDe="Đọc nhanh"
          tieuDeId="ck-vk-gio-dn"
          luoiCot={3}
          cau="Bài khấn ngày giỗ in trong sách Gia lễ giản yếu của Dương Bá Trạc (1932). Điền tên, ngày tháng để có bản in ra; chữ của sách giữ nguyên."
          dongPhu={GHI_CHU_VAN_KHAN}
          the={theDocNhanh}
        />
      </div>

      {/* 2. Form điền tên (GET) */}
      <section className="ck-vk-muc ck-vk-an-khi-in" aria-labelledby="ck-vk-form-tieu">
        <form action="/van-khan/ngay-gio" method="get" className="ck-vk-form">
          <h2 id="ck-vk-form-tieu" className="ck-vk-form-tieu">
            Điền tên, ngày tháng vào bài khấn
          </h2>
          <p className="ck-vk-form-phu">
            Không bắt buộc ô nào; ô nào để trống sẽ giữ nguyên dấu chấm để tự đọc hoặc viết tay.
            Chữ anh chị nhập chỉ hiện ngay trên trang này, không lưu và không gửi đi đâu.
          </p>

          <div className="ck-vk-luoi">
            {TRUONG_FORM_GIO.map((maTruong) => {
              const rong = maTruong === 'danhXung' || maTruong === 'nhanVi' || maTruong === 'xungHo';
              const id = `ck-vk-${maTruong}`;
              return (
                <div
                  key={maTruong}
                  className={`ck-vk-truong${rong ? ' ck-vk-truong-rong' : ''}`}
                >
                  <label htmlFor={id}>{TRUONG_DIEN[maTruong]}</label>
                  <input
                    id={id}
                    name={maTruong}
                    type="text"
                    maxLength={TOI_DA_KY_TU}
                    defaultValue={giaTri[maTruong] ?? ''}
                    autoComplete="off"
                  />
                </div>
              );
            })}
          </div>

          <div className="ck-vk-form-nut">
            <button type="submit" className="ck-nut ck-nut-son ck-vk-nut">
              Điền vào bài khấn
            </button>
            {coDuLieu ? (
              <Link href="/van-khan/ngay-gio" className="ck-nut ck-nut-vien ck-vk-nut">
                Xóa chữ đã điền
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      {/* 3. Kết quả khung văn khấn (giữ lại duy nhất khi in) */}
      <section className="ck-vk-in-vung" aria-labelledby="ck-vk-ket-qua-tieu">
        <h2 id="ck-vk-ket-qua-tieu" className="ck-vk-in-tieu">
          {mauGio.ten}
        </h2>
        <div className="ck-vk-van-ban">{vanDaDien}</div>
        <p className="ck-vk-in-nguon">
          {NGUON_GIA_LE.tenSach}, {NGUON_GIA_LE.tacGia} ({NGUON_GIA_LE.nam}), trang{' '}
          {mauGio.trangSach}.
        </p>
        <NutInChepClient vanBan={vanDaDien} />
      </section>

      {/* 4. Chú thích của tác giả */}
      {mauGio.chuThich?.length ? (
        <section className="ck-vk-muc ck-vk-an-khi-in" aria-labelledby="ck-vk-ct-tieu">
          <div className="ck-vk-the">
            <h2 id="ck-vk-ct-tieu">Chú thích của tác giả</h2>
            <ol className="ck-vk-chu-thich-ds">
              {mauGio.chuThich.map((ct, idx) => {
                const neo = mauGio.neoChuThich?.[idx];
                return (
                  <li key={idx}>
                    {neo ? <strong>{neo}: </strong> : null}
                    {ct}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ) : null}

      {/* 5. Nghi thức theo sách */}
      <section className="ck-vk-muc ck-vk-an-khi-in" aria-label="Nghi thức theo sách">
        <details className="ck-vk-gap">
          <summary className="ck-vk-gap-nut">
            Nghi thức theo sách ({nghiThucGio.length} mục về lễ giỗ và làm lễ)
          </summary>
          <div className="ck-vk-gap-noi-dung">
            {nghiThucGio.map((muc, idx) => (
              <article key={idx} className="ck-vk-doan-sach">
                <h3>{muc.chuDe}</h3>
                <blockquote>{muc.van}</blockquote>
                <p className="ck-vk-vi-tri">
                  {muc.viTri} ·{' '}
                  <a href={muc.url} target="_blank" rel="noopener noreferrer nofollow">
                    Đọc nguyên trang Wikisource
                  </a>
                </p>
              </article>
            ))}
          </div>
        </details>
      </section>

      {/* 6. Mẫu khác trong cùng sách */}
      <section className="ck-vk-muc ck-vk-an-khi-in" aria-label="Mẫu khác trong cùng sách">
        <details className="ck-vk-gap">
          <summary className="ck-vk-gap-nut">Mẫu khác trong cùng sách</summary>
          <div className="ck-vk-gap-noi-dung">
            <article className="ck-vk-doan-sach">
              <h3>{mauTietLe.ten}</h3>
              <p className="ck-vk-ghi-chu-nho">Nguyên văn chữ in trong sách (trang {mauTietLe.trangSach}):</p>
              <div className="ck-vk-mau-van">{mauTietLe.van}</div>
              {mauTietLe.vanTheoChuThich ? (
                <>
                  <p className="ck-vk-ghi-chu-nho">
                    Bản đầy đủ (ráp theo chú thích của tác giả, không phải chữ in):
                  </p>
                  <div className="ck-vk-mau-van">{mauTietLe.vanTheoChuThich}</div>
                </>
              ) : null}
              {mauTietLe.chuThich?.length ? (
                <ul className="ck-vk-chu-thich-phu">
                  {mauTietLe.chuThich.map((ct, i) => (
                    <li key={i}>{ct}</li>
                  ))}
                </ul>
              ) : null}
            </article>

            <article className="ck-vk-doan-sach">
              <h3>{mauThanNha.ten}</h3>
              <p className="ck-vk-ghi-chu-nho">Nguyên văn chữ in trong sách (trang {mauThanNha.trangSach}):</p>
              <div className="ck-vk-mau-van">{mauThanNha.van}</div>
              {mauThanNha.chuThich?.length ? (
                <ul className="ck-vk-chu-thich-phu">
                  {mauThanNha.chuThich.map((ct, i) => (
                    <li key={i}>{ct}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          </div>
        </details>
      </section>

      {/* 7. Nguồn */}
      <section className="ck-vk-muc ck-vk-an-khi-in" aria-labelledby="ck-vk-nguon-tieu">
        <div className="ck-vk-nguon">
          <h2 id="ck-vk-nguon-tieu">Nguồn văn bản</h2>
          <p>
            {NGUON_GIA_LE.tacGia}, <em>{NGUON_GIA_LE.tenSach}</em> ({NGUON_GIA_LE.nam}),{' '}
            {NGUON_GIA_LE.nhaIn}. Phạm vi công cộng (tác giả mất 1944);{' '}
            <a href={NGUON_GIA_LE.url} target="_blank" rel="noopener noreferrer nofollow">
              bản chép Wikisource CC BY-SA 4.0
            </a>{' '}
            (
            <a href={mauGio.url} target="_blank" rel="noopener noreferrer nofollow">
              trang Văn tế và văn khấn
            </a>
            ).
          </p>
          <p>
            Các bài khấn ngày giỗ phổ biến trên mạng hiện nay chép từ sách khác còn bản quyền nên
            trang không đăng lại.
          </p>
        </div>
      </section>

      {/* 8. Liên kết */}
      <nav className="ck-vk-lien-quan ck-vk-an-khi-in" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-vk-lien-quan-ds">
          <Link href="/lich-am">Lịch âm hôm nay</Link>
          <Link href="/lich-am/ngay-le/ram-thang-7">Rằm tháng Bảy</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

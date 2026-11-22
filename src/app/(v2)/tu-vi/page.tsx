import type { Metadata } from 'next';
import Link from 'next/link';
import { BieuTuongCongCu, type LoaiBieuTuongCongCu } from '@/components/ck/BieuTuongE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { menuChinh, trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';

const MAC_DINH_TU_VI = {
  title: 'Tử vi Đẩu số: lá số, 12 cung, 14 chính tinh',
};

const MUC_BO_SUNG: { ten: string; href: string; loai: LoaiBieuTuongCongCu }[] = [
  { ten: 'Lá số trọn đời', href: '/tu-vi/tron-doi', loai: 'tron-doi' },
  { ten: '12 cung', href: '/tu-vi/cung', loai: 'cung' },
  { ten: '14 chính tinh', href: '/tu-vi/sao', loai: 'sao' },
];

function chonIcon(href: string): LoaiBieuTuongCongCu {
  if (href === '/tu-vi-2027') return 'tu-vi-2027';
  if (href === '/tu-vi/tron-doi') return 'tron-doi';
  if (href === '/tu-vi/cung') return 'cung';
  if (href === '/tu-vi/sao') return 'sao';
  return 'tu-vi';
}

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/tu-vi', MAC_DINH_TU_VI);
}

export default async function TuViHubPage() {
  const [tt, daDung, menu] = await Promise.all([
    thongTinTrang('/tu-vi', MAC_DINH_TU_VI),
    Promise.resolve(trangDaDung()),
    Promise.resolve(menuChinh()),
  ]);

  const mucTuVi = menu.find((m) => m.href === '/tu-vi');
  const danhSachThe: { ten: string; href: string; loai: LoaiBieuTuongCongCu }[] = [];
  const daThem = new Set<string>();

  for (const con of mucTuVi?.con ?? []) {
    if (!daThem.has(con.href)) {
      daThem.add(con.href);
      danhSachThe.push({ ten: con.ten, href: con.href, loai: chonIcon(con.href) });
    }
  }
  for (const boSung of MUC_BO_SUNG) {
    if (!daThem.has(boSung.href)) {
      daThem.add(boSung.href);
      danhSachThe.push(boSung);
    }
  }

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/tu-vi" toi>
      <section aria-labelledby="ck-tv-cong-cu">
        <div className="ck-tieu">
          <h2 id="ck-tv-cong-cu">Công cụ &amp; mục tra cứu Tử vi</h2>
        </div>

        <div className="ck-mang">
          {danhSachThe.map((the) => {
            const mo = daDung.has(the.href);
            const noiDung = (
              <>
                <span className="ck-tranh-o">
                  <span className="ck-ic">
                    <BieuTuongCongCu loai={the.loai} />
                  </span>
                </span>
                <span className="ck-chu-o">
                  <b>{the.ten}</b>
                </span>
                <em className={`ck-nhan-trang-thai${mo ? ' ck-mo' : ''}`}>
                  {mo ? 'Đang mở' : 'Sắp có'}
                </em>
              </>
            );

            return mo ? (
              <Link key={the.href} href={the.href} className="ck-o-cong-cu">
                {noiDung}
              </Link>
            ) : (
              <div key={the.href} className="ck-o-cong-cu ck-sap-co" aria-disabled="true">
                {noiDung}
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="ck-tv-la-gi" className="ck-sec">
        <div className="ck-cho-noi-dung">
          <h2 id="ck-tv-la-gi">Tử vi là gì</h2>
          <p>Phần giới thiệu đang biên tập</p>
        </div>
      </section>
    </KhungTrang>
  );
}

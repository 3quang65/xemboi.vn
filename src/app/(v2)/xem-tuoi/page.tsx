import type { Metadata } from 'next';
import Link from 'next/link';
import { BieuTuongCongCu, type LoaiBieuTuongCongCu } from '@/components/ck/BieuTuongE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { dinhDangNgayVN } from '@/components/ck/lichHelpers';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { tetSapToi } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_XEM_TUOI = {
  title: 'Xem tuổi: vợ chồng, xông đất theo từng hệ tính',
  h1: 'Xem tuổi theo từng hệ, có giải thích',
};

const CONG_CU_XEM_TUOI: {
  ten: string;
  moTa: string;
  href: string;
  loai: LoaiBieuTuongCongCu;
}[] = [
  {
    ten: 'Xem tuổi vợ chồng',
    moTa: 'Đối chiếu 4 tiêu chí truyền thống: mệnh nạp âm, thiên can, địa chi và cung phi Bát trạch.',
    href: '/xem-tuoi/vo-chong',
    loai: 'vo-chong',
  },
  {
    ten: 'Xem tuổi xông đất',
    moTa: 'Gợi ý tuổi khách xông đất đầu năm theo chi năm Tết, chi gia chủ, thiên can và nạp âm.',
    href: '/xem-tuoi/xong-dat',
    loai: 'xong-dat',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/xem-tuoi', MAC_DINH_XEM_TUOI),
    noiDungTheoDuongDan('/xem-tuoi'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function XemTuoiHubPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/xem-tuoi', MAC_DINH_XEM_TUOI),
    noiDungTheoDuongDan('/xem-tuoi'),
  ]);
  const tet = tetSapToi();
  const daDung = trangDaDung();

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/xem-tuoi" toi>
      <div className="ck-xt-tet-banner">
        <p>
          Tết sắp tới: <strong>Tết {tet.canChi} {tet.namAm}</strong> vào {tet.thu}, ngày{' '}
          {dinhDangNgayVN(tet.ngay)}.
        </p>
        {daDung.has('/tet') ? (
          <Link href="/tet" className="ck-nut ck-nut-vien">
            Xem lịch Tết {tet.namAm}
          </Link>
        ) : null}
      </div>

      <section className="ck-td-muc" aria-labelledby="ck-xt-cong-cu">
        <h2 id="ck-xt-cong-cu" className="ck-td-tieu">
          Công cụ xem tuổi
        </h2>
        <div className="ck-xt-mang">
          {CONG_CU_XEM_TUOI.map((item) => (
            <Link key={item.href} href={item.href} className="ck-o-cong-cu">
              <span className="ck-tranh-o">
                <span className="ck-ic">
                  <BieuTuongCongCu loai={item.loai} />
                </span>
              </span>
              <span className="ck-chu-o">
                <b>{item.ten}</b>
                <span className="ck-mo-ta-o">{item.moTa}</span>
              </span>
              <em className="ck-nhan-trang-thai ck-mo">Đang mở</em>
            </Link>
          ))}
        </div>
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="Giới thiệu xem tuổi" />

      <nav className="ck-lien-quan" aria-label="Liên kết cùng bộ">
        <h2>Tra cứu liên quan</h2>
        <div className="ck-lien-quan-ds">
          {daDung.has('/sinh-nam') ? <Link href="/sinh-nam">Tra mệnh theo năm sinh</Link> : null}
          {daDung.has('/con-giap') ? <Link href="/con-giap">12 con giáp</Link> : null}
          {daDung.has('/ngu-hanh') ? <Link href="/ngu-hanh">Ngũ hành sinh khắc</Link> : null}
          {daDung.has('/tet') ? <Link href="/tet">Tết Nguyên Đán {tet.namAm}</Link> : null}
          {daDung.has('/tu-vi/lap-la-so') ? (
            <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          ) : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

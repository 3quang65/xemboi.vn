import type { Metadata } from 'next';
import Link from 'next/link';
import { BieuTuongCongCu, type LoaiBieuTuongCongCu } from '@/components/ck/BieuTuongE3';
import ChonNamSinh from '@/components/ck/ChonNamSinh';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { NguonNapAm } from '@/components/ck/TheCanChi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_CAN_CHI = {
  title: 'Can chi, mệnh, ngũ hành: tra theo năm sinh có nguồn',
  h1: 'Can chi, mệnh và ngũ hành',
};

const MUC_TRA_CUU: {
  ten: string;
  moTa: string;
  href: string;
  loai: LoaiBieuTuongCongCu;
}[] = [
  {
    ten: 'Sinh năm bao nhiêu mệnh gì',
    moTa: 'Tra đủ 101 năm (1930–2030): can chi, nạp âm, cung phi, màu hợp và ranh giới Tết.',
    href: '/sinh-nam',
    loai: 'menh',
  },
  {
    ten: '60 hoa giáp',
    moTa: 'Bảng lục thập hoa giáp đầy đủ STT, thiên can, địa chi, âm dương và nạp âm.',
    href: '/can-chi/60-hoa-giap',
    loai: 'hoa-giap',
  },
  {
    ten: '30 nạp âm',
    moTa: '30 mệnh nạp âm chia theo 5 hành và 2 cặp can chi tương ứng mỗi mệnh.',
    href: '/nap-am',
    loai: 'nap-am',
  },
  {
    ten: 'Ngũ hành sinh khắc',
    moTa: 'Sơ đồ vòng tròn tương sinh, tương khắc và bảng chi tiết 5 hành.',
    href: '/ngu-hanh',
    loai: 'ngu-hanh',
  },
  {
    ten: 'Màu hợp mệnh',
    moTa: 'Bảng màu bản mệnh, tương sinh, nên tránh cho 5 mệnh và tra nhanh theo năm sinh.',
    href: '/ngu-hanh/mau-hop-menh',
    loai: 'mau-hop',
  },
  {
    ten: '12 con giáp',
    moTa: 'Thứ tự 12 địa chi từ Tý đến Hợi, tam hợp, lục hợp, lục xung và các năm sinh.',
    href: '/con-giap',
    loai: 'con-giap',
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/can-chi', MAC_DINH_CAN_CHI),
    noiDungTheoDuongDan('/can-chi'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function CanChiHubPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/can-chi', MAC_DINH_CAN_CHI),
    noiDungTheoDuongDan('/can-chi'),
  ]);
  const daDung = trangDaDung();

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/can-chi" toi>
      <section className="ck-td-muc" aria-label="Tra nhanh theo năm sinh">
        <ChonNamSinh nhan="Bạn sinh năm nào?" chuNut="Tra mệnh" />
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-cc-danh-muc">
        <h2 id="ck-cc-danh-muc" className="ck-td-tieu">
          Bảng tra can chi, mệnh và ngũ hành
        </h2>
        <div className="ck-mang">
          {MUC_TRA_CUU.map((m) => (
            <Link key={m.href} href={m.href} className="ck-o-cong-cu">
              <span className="ck-tranh-o">
                <span className="ck-ic">
                  <BieuTuongCongCu loai={m.loai} />
                </span>
              </span>
              <span className="ck-chu-o">
                <b>{m.ten}</b>
                <span className="ck-mo-ta-o">{m.moTa}</span>
              </span>
            </Link>
          ))}
        </div>
        <NguonNapAm />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="Giới thiệu hệ can chi và ngũ hành" />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Tra cứu tiếp</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/sinh-nam">Bảng 101 năm sinh (1930–2030)</Link>
          <Link href="/can-chi/60-hoa-giap">Bảng 60 hoa giáp</Link>
          <Link href="/nap-am">Bảng 30 nạp âm</Link>
          <Link href="/ngu-hanh">Sơ đồ ngũ hành</Link>
          <Link href="/con-giap">12 con giáp</Link>
          {daDung.has('/tu-vi/lap-la-so') ? (
            <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          ) : null}
          {daDung.has('/lich-am') ? <Link href="/lich-am">Lịch âm hôm nay</Link> : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

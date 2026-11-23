import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ck/Breadcrumb';
import ChiTietNgay from '@/components/ck/ChiTietNgay';
import LichThang from '@/components/ck/LichThang';
import { BieuTuongCongCu, type LoaiBieuTuongCongCu } from '@/components/ck/BieuTuongE3';
import { hai } from '@/components/ck/lichHelpers';
import { DaiGio } from '@/components/ck/truc-quan';
import { breadcrumb } from '@/lib/trang/dieu-huong';
import { homNay, thangLich, type ChiTietNgay as ChiTietNgayData } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { daiGio } from '@/lib/trang/xem-ngay-truc-quan';

export const revalidate = 3600;

const MAC_DINH_LICH_AM = {
  title: 'Lịch âm hôm nay – lịch âm dương tháng này | xemboi.vn',
  h1: 'Lịch âm hôm nay',
};

const CONG_CU_LICH: {
  ten: string;
  moTa: string;
  href: string;
  loai: LoaiBieuTuongCongCu;
}[] = [
  {
    ten: 'Đổi ngày âm dương',
    moTa: 'Tra đổi qua lại dương lịch ↔ âm lịch từ năm 1900 đến 2100.',
    href: '/lich-am/doi-ngay',
    loai: 'doi-ngay',
  },
  {
    ten: 'Lịch vạn niên',
    moTa: 'Chọn nhanh bất kỳ tháng năm nào và xem 24 tiết khí.',
    href: '/lich-am/lich-van-nien',
    loai: 'van-nien',
  },
  {
    ten: 'Lịch âm ngày mai',
    moTa: 'Xem nhanh âm dương, can chi, giờ hoàng đạo của ngày mai.',
    href: '/lich-am/ngay-mai',
    loai: 'ngay-mai',
  },
  {
    ten: 'Tết Nguyên Đán',
    moTa: 'Đếm ngược Tết sắp tới và các ngày lễ trọng dịp đầu năm.',
    href: '/tet',
    loai: 'tet',
  },
];

function taoThamSoHomNay(lich: ChiTietNgayData) {
  const thangAmSo = `${hai(lich.am.thang)}${lich.am.nhuan ? ' nhuận' : ''}`;
  return {
    dd: hai(lich.am.ngay),
    mm: thangAmSo,
    'Can Chi': lich.canChiNam.ten,
    'thứ': lich.thu,
    'dd/mm/yyyy': `${hai(lich.duong.ngay)}/${hai(lich.duong.thang)}/${lich.duong.nam}`,
    'âm đầy đủ': `${lich.am.ngay} ${lich.tenThangAm} năm ${lich.canChiNam.ten}`,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const lich = homNay();
  return metaTrang('/lich-am', MAC_DINH_LICH_AM, undefined, taoThamSoHomNay(lich));
}

export default async function LichAmHubPage() {
  const lich = homNay();
  const [tt, luoi] = await Promise.all([
    thongTinTrang('/lich-am', MAC_DINH_LICH_AM, undefined, taoThamSoHomNay(lich)),
    Promise.resolve(thangLich(lich.duong.nam, lich.duong.thang)),
  ]);
  const dsBreadcrumb = breadcrumb('/lich-am');

  return (
    <>
      <section className="ck-dau-con ck-toi">
        <div className="ck-w">
          <Breadcrumb danhSach={dsBreadcrumb} toi />
          <h1>{tt.h1}</h1>
          {tt.description ? <p className="ck-dau-con-phu">{tt.description}</p> : null}
          <div className="ck-lich-dau-khung">
            <ChiTietNgay ngay={lich} toi anBangGio />
          </div>
        </div>
      </section>

      <section className="ck-sec" aria-label="Dải 12 giờ và lịch tháng hiện tại">
        <div className="ck-w">
          <DaiGio dai={daiGio(lich)} tieuDe="Dải 12 giờ hôm nay" />
          <div className="ck-tq-gio-cach">
            <LichThang luoi={luoi} hienDieuHuong />
          </div>
        </div>
      </section>

      <section className="ck-sec ck-sec-kem" aria-labelledby="ck-la-cong-cu">
        <div className="ck-w">
          <div className="ck-tieu">
            <h2 id="ck-la-cong-cu">Công cụ tra cứu lịch âm</h2>
          </div>

          <div className="ck-mang ck-mang-4">
            {CONG_CU_LICH.map((o) => (
              <Link key={o.href} href={o.href} className="ck-o-cong-cu">
                <span className="ck-tranh-o">
                  <span className="ck-ic">
                    <BieuTuongCongCu loai={o.loai} />
                  </span>
                </span>
                <span className="ck-chu-o">
                  <b>{o.ten}</b>
                  <span className="ck-mo-ta-o">{o.moTa}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import ChonThang from '@/components/ck/ChonThang';
import KhungTrang from '@/components/ck/KhungTrang';
import LichThang from '@/components/ck/LichThang';
import {
  dinhDangNgayVN,
  duongDanNgayTuIso,
  thuTuIso,
  trongPhamViNam,
} from '@/components/ck/lichHelpers';
import { ngayHienTaiVN, thangLich, tietKhiNam } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';

export const revalidate = 3600;

const MAC_DINH_VAN_NIEN = {
  title: 'Lịch vạn niên 1900–2100: âm dương, can chi, tiết khí',
  h1: 'Lịch vạn niên trực tuyến 1900–2100',
};

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/lich-am/lich-van-nien', MAC_DINH_VAN_NIEN);
}

export default async function LichVanNienPage() {
  const tt = await thongTinTrang('/lich-am/lich-van-nien', MAC_DINH_VAN_NIEN);
  const h = ngayHienTaiVN();
  const luoi = thangLich(h.nam, h.thang);
  const tietKhi = tietKhiNam(h.nam);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/lich-am/lich-van-nien" toi>
      <div className="ck-vn-thanh">
        <ChonThang namMacDinh={h.nam} thangMacDinh={h.thang} />
        {trongPhamViNam(h.nam) ? (
          <Link href={`/lich-am/${h.nam}`} className="ck-nut ck-nut-vien">
            Xem trọn năm {h.nam}
          </Link>
        ) : null}
      </div>

      <LichThang luoi={luoi} hienDieuHuong />

      <section className="ck-muc-lich" aria-labelledby="ck-vn-tiet-khi">
        <h2 id="ck-vn-tiet-khi">24 tiết khí năm {h.nam}</h2>
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
              {tietKhi.map((tk, i) => {
                const href = duongDanNgayTuIso(tk.ngay);
                return (
                  <tr key={`${tk.ten}-${tk.ngay}`}>
                    <td>{i + 1}</td>
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
    </KhungTrang>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { ChuGiaiHanh, VongNguHanh } from '@/components/ck/truc-quan';
import { DanhSachMau, HuyHieuHanh, NguonNapAm } from '@/components/ck/TheCanChi';
import { duongDanHanh } from '@/components/ck/canChiHelpers';
import { NGU_HANH, mauHopMenh, quanHeHanh } from '@/lib/trang/can-chi';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

const MAC_DINH_NGU_HANH = {
  title: 'Ngũ hành tương sinh, tương khắc: bảng và cách hiểu',
  h1: 'Ngũ hành tương sinh và tương khắc',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/ngu-hanh', MAC_DINH_NGU_HANH),
    noiDungTheoDuongDan('/ngu-hanh'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function NguHanhPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/ngu-hanh', MAC_DINH_NGU_HANH),
    noiDungTheoDuongDan('/ngu-hanh'),
  ]);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/ngu-hanh" toi>
      <section className="ck-td-muc" aria-labelledby="ck-nh-so-do">
        <h2 id="ck-nh-so-do" className="ck-td-tieu">
          Vòng tròn tương sinh và tương khắc
        </h2>
        <VongNguHanh />
        <ChuGiaiHanh className="ck-td-cg-giua" />
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-nh-bang-5">
        <div className="ck-na-dau">
          <h2 id="ck-nh-bang-5">Bảng tra sinh khắc của 5 hành</h2>
          <Link href="/ngu-hanh/mau-hop-menh" className="ck-nut ck-nut-vien">
            Tra màu hợp mệnh
          </Link>
        </div>
        <div className="ck-bang-khung">
          <table className="ck-bang ck-bang-the">
            <thead>
              <tr>
                <th>Hành</th>
                <th>Sinh ra</th>
                <th>Được sinh bởi</th>
                <th>Khắc</th>
                <th>Bị khắc bởi</th>
                <th>Màu bản mệnh</th>
              </tr>
            </thead>
            <tbody>
              {NGU_HANH.map((h) => {
                const q = quanHeHanh(h);
                const m = mauHopMenh(h);
                return (
                  <tr key={h}>
                    <td data-nhan="Hành">
                      <HuyHieuHanh hanh={h} lienKet />
                    </td>
                    <td data-nhan="Sinh ra">
                      <HuyHieuHanh hanh={q.sinhRa} lienKet />
                    </td>
                    <td data-nhan="Được sinh bởi">
                      <HuyHieuHanh hanh={q.duocSinhBoi} lienKet />
                    </td>
                    <td data-nhan="Khắc">
                      <HuyHieuHanh hanh={q.khac} lienKet />
                    </td>
                    <td data-nhan="Bị khắc bởi">
                      <HuyHieuHanh hanh={q.biKhacBoi} lienKet />
                    </td>
                    <td data-nhan="Màu bản mệnh">
                      <DanhSachMau mau={m.banMenh} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <NguonNapAm />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="Giải thích Ngũ hành tương sinh – tương khắc" />

      <nav className="ck-lien-quan" aria-label="Xem từng hành và trang liên quan">
        <h2>Chi tiết từng hành</h2>
        <div className="ck-lien-quan-ds">
          {NGU_HANH.map((h) => (
            <Link key={h} href={duongDanHanh(h)}>
              Mệnh {h}
            </Link>
          ))}
          <Link href="/ngu-hanh/mau-hop-menh">Bảng màu hợp mệnh</Link>
          <Link href="/nap-am">30 nạp âm theo hành</Link>
          <Link href="/sinh-nam">Tra mệnh theo năm sinh</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

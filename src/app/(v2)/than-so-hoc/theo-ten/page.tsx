import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { QUY_UOC, theoTen } from '@/lib/trang/than-so-hoc';
import {
  MAC_DINH_THEO_TEN,
  TEN_VI_DU,
  serializeJsonLd,
  taoSchemaWebApplication,
} from '../ThanSoHocHelpers';
import {
  BangChuPythagoras,
  KhoiGioiHan,
} from '../ThanSoHocUi';
import { KetQuaTenHienThi } from './KetQuaTenUi';
import TinhTheoTenClient from './TinhTheoTenClient';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/than-so-hoc/theo-ten', MAC_DINH_THEO_TEN);
}

export default async function TheoTenPage() {
  const tt = await thongTinTrang('/than-so-hoc/theo-ten', MAC_DINH_THEO_TEN);
  const jsonLd = taoSchemaWebApplication(tt);
  const viDu = theoTen(TEN_VI_DU)!;
  const quyUocTenViet = QUY_UOC[QUY_UOC.length - 1];

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/than-so-hoc/theo-ten"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1 & 2. Phần tính client (không đưa tên lên URL, không gửi request, không localStorage) */}
      <TinhTheoTenClient />

      {/* 3. Phần server luôn hiện */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-bang-chu-tieu">
        <h2 id="ck-tsh-bang-chu-tieu" className="ck-td-tieu">
          Bảng chữ cái Pythagoras (A–Z ra 1–9)
        </h2>
        <BangChuPythagoras />
        <p className="ck-tsh-so-sanh-dong">{quyUocTenViet}</p>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-tsh-ten-mau-tieu">
        <h2 id="ck-tsh-ten-mau-tieu" className="ck-td-tieu">
          Ví dụ cố định: {TEN_VI_DU}
        </h2>
        <KetQuaTenHienThi ketQua={viDu} hoTenGoc={TEN_VI_DU} />
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/than-so-hoc">Tổng quan Thần số học</Link>
          <Link href="/than-so-hoc/so-chu-dao">Tính số chủ đạo</Link>
          <Link href="/than-so-hoc/bieu-do-ngay-sinh">Biểu đồ ngày sinh</Link>
        </div>
      </nav>

      {/* 4. Giới hạn */}
      <KhoiGioiHan />
    </KhungTrang>
  );
}

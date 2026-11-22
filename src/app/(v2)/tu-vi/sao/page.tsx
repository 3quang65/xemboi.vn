import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { HuyHieuHanh } from '@/components/ck/TheCanChi';
import { HANH_CLASS } from '@/components/ck/canChiHelpers';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { CHINH_TINH } from '@/lib/trang/tu-vi-tu-dien';
import { DIA_CHI } from '@/lib/tuvi-v2/am-lich';

const MAC_DINH_SAO_IDX = {
  title: '14 chính tinh trong tử vi: ngũ hành và bảng miếu hãm',
  h1: '14 chính tinh trong tử vi',
};

const LOP_DAC_TINH: Record<string, string> = {
  M: 'ck-dt-nhan ck-dt-m',
  V: 'ck-dt-nhan ck-dt-v',
  Đ: 'ck-dt-nhan ck-dt-d',
  B: 'ck-dt-nhan ck-dt-b',
  H: 'ck-dt-nhan ck-dt-h',
};

const NHAN_NGAN_DAC_TINH: Record<string, string> = {
  M: 'Miếu',
  V: 'Vượng',
  Đ: 'Đắc',
  B: 'Bình',
  H: 'Hãm',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/tu-vi/sao', MAC_DINH_SAO_IDX),
    noiDungTheoDuongDan('/tu-vi/sao'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function TuViSaoIndexPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/tu-vi/sao', MAC_DINH_SAO_IDX),
    noiDungTheoDuongDan('/tu-vi/sao'),
  ]);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/tu-vi/sao" toi rong>
      <section className="ck-td-muc" aria-labelledby="ck-sao-14-tieu">
        <h2 id="ck-sao-14-tieu" className="ck-td-tieu">
          Danh sách 14 chính tinh (tô màu theo ngũ hành)
        </h2>

        <div className="ck-sao-luoi">
          {CHINH_TINH.map((s) => (
            <Link
              key={s.slug}
              href={`/tu-vi/sao/${s.slug}`}
              className={`ck-sao-the ${HANH_CLASS[s.hanh]}`}
            >
              <div className="ck-sao-dau">
                <b className="ck-sao-ten">{s.ten}</b>
                <span className={`ck-huy-hieu ${HANH_CLASS[s.hanh]}`}>{s.hanh}</span>
              </div>
              <span className="ck-sao-tom-tat">
                Miếu/Vượng: {s.mieuVuong.length} cung · Hãm:{' '}
                {s.ham.length > 0 ? `${s.ham.length} cung` : 'không có'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-sao-ma-tran-tieu">
        <h2 id="ck-sao-ma-tran-tieu" className="ck-td-tieu">
          Ma trận 14 chính tinh × 12 địa chi (Miếu, Vượng, Đắc, Bình, Hãm)
        </h2>

        <div className="ck-mt-chu-thich" aria-label="Chú giải mức đặc tính">
          <span>
            <i className="ck-dt-nhan ck-dt-m">Miếu</i> Miếu địa
          </span>
          <span>
            <i className="ck-dt-nhan ck-dt-v">Vượng</i> Vượng địa
          </span>
          <span>
            <i className="ck-dt-nhan ck-dt-d">Đắc</i> Đắc địa
          </span>
          <span>
            <i className="ck-dt-nhan ck-dt-b">Bình</i> Bình hòa
          </span>
          <span>
            <i className="ck-dt-nhan ck-dt-h">Hãm</i> Hãm địa
          </span>
        </div>

        <div
          className="ck-mt-khung"
          role="region"
          aria-label="Bảng ma trận 14 chính tinh theo 12 địa chi (cuộn ngang trên màn hình nhỏ)"
          tabIndex={0}
        >
          <table className="ck-mt-bang">
            <thead>
              <tr>
                <th>Chính tinh</th>
                {DIA_CHI.map((chi) => (
                  <th key={chi} scope="col">
                    {chi}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHINH_TINH.map((s) => (
                <tr key={s.slug}>
                  <td>
                    <Link href={`/tu-vi/sao/${s.slug}`} className="ck-mt-sao-link">
                      <span>{s.ten}</span>
                    </Link>{' '}
                    <HuyHieuHanh hanh={s.hanh} />
                  </td>
                  {s.dacTinh.map((dt) => (
                    <td key={`${s.slug}-${dt.chi}`}>
                      <span className={LOP_DAC_TINH[dt.ma] ?? 'ck-dt-nhan'}>
                        {NHAN_NGAN_DAC_TINH[dt.ma] ?? dt.ten}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="ck-tv-nguon">
          Bảng miếu hãm theo bộ máy an sao của xemboi (quy tắc theo sách cụ Thiên Lương).
        </p>
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="Giải thích 14 chính tinh" />

      <nav className="ck-lien-quan" aria-label="Liên kết trong cụm Tử vi">
        <h2>Tra cứu Tử vi</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/tu-vi/cung">12 cung tử vi</Link>
          <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          <Link href="/tu-vi/tron-doi">Lá số tử vi trọn đời</Link>
          <Link href="/tu-vi">Tổng quan Tử vi</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

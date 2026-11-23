import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { duongDanNgayTuIso, trongPhamViNam } from '@/components/ck/lichHelpers';
import { ChuGiaiDaiGio, DaiGio, TrichNguyenVan } from '@/components/ck/truc-quan';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { ngayLich } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { GHI_CHU_GIO_TY, daiGio } from '@/lib/trang/xem-ngay-truc-quan';
import {
  BAI_CA_HUONG,
  NGUON_XUAT_HANH,
  duongDanNguonXuatHanh,
  namXuatHanh,
  xuatHanhTet,
} from '@/lib/trang/xuat-hanh';
import { THIEN_CAN } from '@/lib/tuvi-v2/am-lich';

export const revalidate = 3600;

function macDinhXuatHanh(namAm: number, canChiNam: string) {
  return {
    title: `Giờ xuất hành mùng 1 Tết ${namAm}: giờ, hướng theo sách`,
    h1: `Giờ xuất hành Tết ${namAm}`,
    description: `Giờ hoàng đạo và hướng Hỷ thần, Tài thần, Phúc thần mùng 1 đến mùng 10 Tết ${canChiNam} ${namAm} theo lịch Hồ Ngọc Đức và Ngọc hạp ký.`,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const namAm = namXuatHanh();
  const x = xuatHanhTet(namAm);
  return metaTrang('/xem-ngay/xuat-hanh', macDinhXuatHanh(namAm, x.canChiNam), undefined, {
    yyyy: namAm,
    'Can Chi': x.canChiNam,
  });
}

export default async function XuatHanhTetPage() {
  const namAm = namXuatHanh();
  const x = xuatHanhTet(namAm);
  const macDinh = macDinhXuatHanh(namAm, x.canChiNam);

  const [tt, hrefNguon] = await Promise.all([
    thongTinTrang('/xem-ngay/xuat-hanh', macDinh, undefined, {
      yyyy: namAm,
      'Can Chi': x.canChiNam,
    }),
    duongDanNguonXuatHanh(),
  ]);

  const daDung = trangDaDung();
  const mung1 = x.ngay[0];

  const schemaWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: tt.title,
    url: tt.canonical,
    inLanguage: 'vi',
    ...(tt.description ? { description: tt.description } : {}),
  };

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/xem-ngay/xuat-hanh" toi>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaWebPage).replace(/</g, '\\u003c'),
        }}
      />

      {/* 1. Tóm tắt */}
      <section className="ck-xh-muc" aria-label="Tóm tắt Tết">
        <div className="ck-xh-tom-tat">
          <p className="ck-xh-tom-tat-cau">
            Tết <strong>{x.canChiNam} {x.namAm}</strong>: mùng 1 là{' '}
            <strong>
              {mung1.thu}, {mung1.duong}
            </strong>
            .
          </p>
          <div className="ck-xh-tom-tat-nut">
            {daDung.has('/tet') ? (
              <Link href="/tet" className="ck-nut ck-nut-vien">
                Đếm ngược Tết {x.namAm}
              </Link>
            ) : null}
            {daDung.has('/xem-tuoi/xong-dat') ? (
              <Link href="/xem-tuoi/xong-dat" className="ck-nut ck-nut-vien">
                Xem tuổi xông đất
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* 2. Dải 12 giờ và hướng xuất hành 10 ngày Tết */}
      <section className="ck-xh-muc" aria-labelledby="ck-xh-bang-tieu">
        <div className="ck-xh-bang-dau">
          <h2 id="ck-xh-bang-tieu" className="ck-xh-tieu">
            Giờ hoàng đạo và hướng xuất hành mùng 1–10 Tết {x.canChiNam} {x.namAm}
          </h2>
          <ChuGiaiDaiGio soHoangDao={6} laHomNay={false} />
        </div>

        <div className="ck-xh-ngay-ds">
          {x.ngay.map((ngay) => {
            const hrefNgay = duongDanNgayTuIso(ngay.iso);
            const [y, m, d] = ngay.iso.split('-').map(Number);
            const dai = daiGio(ngayLich(d, m, y));
            return (
              <article
                key={ngay.iso}
                className={
                  ngay.mung === 1
                    ? 'ck-xh-ngay-the ck-xh-mung1'
                    : 'ck-xh-ngay-the'
                }
              >
                <div className="ck-xh-ngay-dau">
                  <div className="ck-xh-ngay-ten">
                    <strong className="ck-xh-cot-mung">Mùng {ngay.mung}</strong>
                    <span className="ck-xh-thu">{ngay.thu}</span>
                    {hrefNgay && daDung.has('/lich-am') ? (
                      <Link href={hrefNgay} className="ck-xh-ngay-link">
                        {ngay.duong}
                      </Link>
                    ) : (
                      <span>{ngay.duong}</span>
                    )}
                    <span className="ck-xh-cot-canchi">
                      Ngày {ngay.canChiNgay}
                    </span>
                  </div>

                  <dl className="ck-xh-huong-ds">
                    <div>
                      <dt>Hỷ thần</dt>
                      <dd>{ngay.huong.hyThan}</dd>
                    </div>
                    <div>
                      <dt>Tài thần</dt>
                      <dd>{ngay.huong.taiThan}</dd>
                    </div>
                    <div>
                      <dt>Phúc thần</dt>
                      <dd>{ngay.huong.phucThan}</dd>
                    </div>
                  </dl>
                </div>

                <DaiGio
                  dai={dai}
                  tieuDe=""
                  hienChuGiai={false}
                  hienGhiChu={false}
                  gon
                />
              </article>
            );
          })}
        </div>

        <p className="ck-tq-gio-ghi-chu">{GHI_CHU_GIO_TY}</p>
      </section>

      {/* 3. Theo sách nào */}
      <section className="ck-xh-muc" aria-labelledby="ck-xh-sach-tieu">
        <h2 id="ck-xh-sach-tieu" className="ck-xh-tieu">
          Theo sách nào
        </h2>
        <div className="ck-xh-sach-ds">
          {BAI_CA_HUONG.map((bai) => (
            <article key={bai.ma} className="ck-xh-sach-the">
              <div className="ck-xh-sach-dau">
                <h3>
                  {bai.ten} — {bai.tenBaiViet}
                </h3>
              </div>

              <TrichNguyenVan
                nhan="Sách ghi"
                dich={bai.dich}
                viTriViet={bai.viTriViet}
                tenSach={NGUON_XUAT_HANH.tenHanViet}
                doanId={bai.doanId}
                ghiCong={NGUON_XUAT_HANH.ghiCong}
                url={NGUON_XUAT_HANH.url}
              />

              <table className="ck-xh-can-bang">
                <caption className="ck-sr">
                  Hướng {bai.ten} theo 10 thiên can
                </caption>
                <thead>
                  <tr>
                    {THIEN_CAN.map((can) => (
                      <th key={can} scope="col">
                        {can}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {bai.theoCan.map((huong, i) => (
                      <td key={THIEN_CAN[i]} data-can={THIEN_CAN[i]}>
                        {huong}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Nguồn và giới hạn */}
      <section className="ck-xh-muc" aria-labelledby="ck-xh-nguon-tieu">
        <h2 id="ck-xh-nguon-tieu" className="ck-xh-tieu">
          Nguồn và giới hạn
        </h2>
        <div className="ck-xh-nguon">
          <ul className="ck-xh-nguon-ds">
            <li>
              Giờ hoàng đạo tính theo bảng giờ hoàng đạo của lịch Hồ Ngọc Đức,
              giống các trang lịch khác của xemboi.
            </li>
            <li>
              Hướng Hỷ thần, Tài thần, Phúc thần theo ba bài ca trong Ngọc hạp ký, thiên Dân tục
              cát hung nhật. Sách khác có thể ghi hướng khác; trang này chưa đối chiếu sách thứ hai.
            </li>
          </ul>
          <p className="ck-xh-ghi-cong">
            <span>{NGUON_XUAT_HANH.ghiCong}</span>
            <a
              href={NGUON_XUAT_HANH.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Wikisource: {NGUON_XUAT_HANH.tenHanViet}
            </a>
            {hrefNguon && daDung.has('/nguon') ? (
              <Link href={hrefNguon}>Xem thông tin sách</Link>
            ) : null}
          </p>
          {daDung.has('/phuong-phap') ? (
            <p className="ck-xh-pp-link">
              <Link href="/phuong-phap">Cách xemboi chọn và ghi nguồn</Link>
            </p>
          ) : null}
        </div>
      </section>

      {/* 5. Liên kết cuối */}
      <nav className="ck-xh-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-xh-lien-quan-ds">
          {daDung.has('/tet') ? (
            <Link href="/tet">Tết Nguyên Đán {x.namAm}</Link>
          ) : null}
          {daDung.has('/xem-tuoi/xong-dat') ? (
            <Link href="/xem-tuoi/xong-dat">Tuổi xông đất {x.namAm}</Link>
          ) : null}
          {daDung.has('/lich-am/ngay-mai') ? (
            <Link href="/lich-am/ngay-mai">Âm lịch ngày mai</Link>
          ) : null}
          {daDung.has('/lich-am') && trongPhamViNam(x.namAm) ? (
            <Link href={`/lich-am/${x.namAm}`}>Lịch âm năm {x.namAm}</Link>
          ) : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

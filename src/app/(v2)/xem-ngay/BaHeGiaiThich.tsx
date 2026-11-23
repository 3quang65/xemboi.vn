import Link from 'next/link';
import { TrichNguyenVan } from '@/components/ck/truc-quan';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import {
  NGUON_XEM_NGAY,
  TEN_NHOM_TRUC,
  THAN_12,
  TRICH_DOAN,
  TRUC,
} from '@/lib/trang/xem-ngay';
import { NGUON_LUNAR_BAT_BUOC } from './XemNgayHelpers';

export interface BaHeGiaiThichProps {
  daDung?: Set<string>;
}

export default function BaHeGiaiThich({ daDung }: BaHeGiaiThichProps) {
  const hopLe = daDung ?? trangDaDung();

  return (
    <section className="ck-xn-muc" aria-labelledby="ck-xn-ba-he-tieu">
      <h2 id="ck-xn-ba-he-tieu" className="ck-xn-tieu">
        Ba hệ nói gì, theo sách nào
      </h2>

      <p className="ck-xn-luu-y">
        Hai hệ hoàng đạo (theo trực và theo 12 thần) có thể nói khác nhau về cùng một ngày.
        Trang hiện cả hai, không gộp.
      </p>

      <div className="ck-xn-he-ds">
        {/* 1. 12 trực */}
        <article className="ck-xn-the ck-xn-he-the">
          <div className="ck-xn-he-dau">
            <h3>1. Hệ 12 trực (Thập nhị trực)</h3>
          </div>

          <TrichNguyenVan
            nhan="Sách ghi"
            dich={TRICH_DOAN.ngocHapTruc.dich}
            viTriViet={TRICH_DOAN.ngocHapTruc.viTriViet}
            tenSach={NGUON_XEM_NGAY.ngocHap.tenHanViet}
            nienDai={NGUON_XEM_NGAY.ngocHap.nienDai}
            doanId={TRICH_DOAN.ngocHapTruc.doanId}
            ghiCong={NGUON_XEM_NGAY.ngocHap.ghiCong}
            url={NGUON_XEM_NGAY.ngocHap.url}
          />

          <div className="ck-xn-bang-cuon">
            <table className="ck-bang ck-xn-bang-gon">
              <thead>
                <tr>
                  <th scope="col">Trực</th>
                  <th scope="col">Nhóm</th>
                  <th scope="col">Việc theo câu ca</th>
                </tr>
              </thead>
              <tbody>
                {TRUC.map((t) => (
                  <tr key={t.chiSo}>
                    <td className="ck-xn-ten-dam">{t.ten}</td>
                    <td>
                      <span className={`ck-xn-nhan ck-xn-truc-${t.nhom}`}>
                        {TEN_NHOM_TRUC[t.nhom]}
                      </span>
                    </td>
                    <td>{t.viec ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* 2. 12 thần hoàng đạo / hắc đạo */}
        <article className="ck-xn-the ck-xn-he-the">
          <div className="ck-xn-he-dau">
            <h3>2. Hệ 12 thần hoàng đạo / hắc đạo</h3>
          </div>

          <TrichNguyenVan
            nhan="Sách ghi"
            dich={TRICH_DOAN.hiepKyThan.dich}
            viTriViet={TRICH_DOAN.hiepKyThan.viTriViet}
            tenSach={NGUON_XEM_NGAY.hiepKy.tenHanViet}
            nienDai={NGUON_XEM_NGAY.hiepKy.nienDai}
            doanId={TRICH_DOAN.hiepKyThan.doanId}
            ghiCong={NGUON_XEM_NGAY.hiepKy.ghiCong}
            url={NGUON_XEM_NGAY.hiepKy.url}
          />

          <div className="ck-xn-bang-cuon">
            <table className="ck-bang ck-xn-bang-gon">
              <thead>
                <tr>
                  <th scope="col">Thần</th>
                  <th scope="col">Hoàng / Hắc</th>
                </tr>
              </thead>
              <tbody>
                {THAN_12.map((t) => (
                  <tr key={t.chiSo}>
                    <td className="ck-xn-ten-dam">{t.ten}</td>
                    <td>
                      <span
                        className={`ck-xn-nhan ${t.hoangDao ? 'ck-xn-hoang' : 'ck-xn-hac'
                          }`}
                      >
                        {t.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ck-xn-nhan-xet">
            <p className="ck-xn-vi-tri">
              Nhận xét trong {TRICH_DOAN.hiepKyNhanXet.viTriViet}:
            </p>
            <TrichNguyenVan
              nhan="Sách ghi"
              dich={TRICH_DOAN.hiepKyNhanXet.dich}
              viTriViet={TRICH_DOAN.hiepKyNhanXet.viTriViet}
              tenSach={NGUON_XEM_NGAY.hiepKy.tenHanViet}
              nienDai={NGUON_XEM_NGAY.hiepKy.nienDai}
              doanId={TRICH_DOAN.hiepKyNhanXet.doanId}
              ghiCong={NGUON_XEM_NGAY.hiepKy.ghiCong}
              url={NGUON_XEM_NGAY.hiepKy.url}
            />
            <p className="ck-xn-nhan-xet-cau">
              Chính Hiệp kỷ ghi rằng không có lý do thiên văn để chỉ sáu thần này là hoàng đạo.
            </p>
          </div>
        </article>

        {/* 3. Nghi kỵ / cát thần / hung sát */}
        <article className="ck-xn-the ck-xn-he-the">
          <div className="ck-xn-he-dau">
            <h3>3. Nghi / kỵ / cát thần / hung sát</h3>
          </div>
          <p className="ck-xn-nguon-dong">{NGUON_LUNAR_BAT_BUOC}</p>
          <p className="ck-xn-vi-tri">
            Mã nguồn thư viện:{' '}
            <a
              href={NGUON_XEM_NGAY.lunarJs.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {NGUON_XEM_NGAY.lunarJs.ten} ({NGUON_XEM_NGAY.lunarJs.tacGia},{' '}
              {NGUON_XEM_NGAY.lunarJs.giayPhep})
            </a>
            .
          </p>

          {(hopLe.has('/phuong-phap') || hopLe.has('/nguon')) && (
            <p className="ck-xn-pp-links">
              {hopLe.has('/phuong-phap') ? (
                <Link href="/phuong-phap">Cách xemboi đối chiếu và ghi nguồn</Link>
              ) : null}
              {hopLe.has('/phuong-phap') && hopLe.has('/nguon') ? ' · ' : null}
              {hopLe.has('/nguon') ? <Link href="/nguon">Danh mục nguồn sách</Link> : null}
            </p>
          )}
        </article>
      </div>
    </section>
  );
}

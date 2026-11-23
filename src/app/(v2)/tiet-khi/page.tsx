import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  dinhDangNgayVN,
  duongDanNgayTuIso,
} from '@/components/ck/lichHelpers';
import {
  DocNhanh,
  ThuatNgu,
  TrichNguyenVan,
  type TheDocNhanhItem,
} from '@/components/ck/truc-quan';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import {
  NAM_LICH_MUA_DEN,
  NAM_LICH_MUA_TU,
  NGUON_72_HAU,
  TIET_KHI_24,
  TRICH_TIET_THANG,
  tenThangTiet,
  tietHienTai,
  tietKhiTrongNam,
  tietTheoSlug,
} from '@/lib/trang/lich-mua';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  DS_NAM_LICH_MUA,
  type SearchParamsInput,
  kepNamLichMua,
  kiemCoThamSo,
  layMot,
  muaCuaTiet,
  phanTichNamLichMua,
  serializeJsonLd,
  taoSchemaWebPage,
} from '../lich-am/LichMuaHelpers';
import VongTietKhiSvg from './VongTietKhiSvg';
import '../lich-am/lich-mua.css';

export const revalidate = 3600;

const MAC_DINH_TIET_KHI = {
  title: '24 tiết khí: ngày giờ chính xác từng năm và ý nghĩa',
  h1: '24 tiết khí',
  description:
    '24 tiết khí tính theo kinh độ Mặt Trời (giờ Việt Nam UTC+7), phân biệt 12 tiết và 12 trung khí theo Hiệp kỷ biện phương thư.',
};

const THUAT_NGU_TK = {
  id: 'ck-lm-tn-tiet-khi',
  ten: 'Tiết và trung khí',
  nghia:
    'Hai mươi bốn mốc chia vòng 360° kinh độ Mặt Trời thành 24 phần bằng nhau (mỗi phần 15°). 12 "tiết" (Lập xuân, Kinh trập, Thanh minh…) mở đầu tháng theo tiết; 12 "trung khí" (Vũ thủy, Xuân phân…) nằm giữa tháng.',
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const sp = await searchParams;
  const namMacDinh = kepNamLichMua(ngayHienTaiVN().nam);
  const namHopLe = phanTichNamLichMua(layMot(sp.nam));
  const namChon = namHopLe ?? namMacDinh;
  const base = await metaTrang('/tiet-khi', MAC_DINH_TIET_KHI, undefined, { yyyy: namChon });
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/tiet-khi' },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function TietKhiIndexPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const sp = await searchParams;
  const namNay = kepNamLichMua(ngayHienTaiVN().nam);
  const namRaw = layMot(sp.nam);
  const namTrim = namRaw?.trim() ?? '';
  const namParsed = phanTichNamLichMua(namTrim);
  const coLoiNam = namTrim.length > 0 && namParsed === null;
  const namChon = namParsed ?? namNay;

  const tt = await thongTinTrang('/tiet-khi', MAC_DINH_TIET_KHI, undefined, { yyyy: namChon });
  const ht = tietHienTai();
  const dsNam = tietKhiTrongNam(namChon);
  const dangInfo = tietTheoSlug(ht.dang.slug) ?? TIET_KHI_24[0];
  const keInfo = tietTheoSlug(ht.ke.slug) ?? TIET_KHI_24[1];
  const muaDang = muaCuaTiet(dangInfo.thangTiet);

  const cauDauTrang = `Đang ở tiết ${ht.dang.ten} từ ${ht.dang.gio} ${dinhDangNgayVN(ht.dang.ngay)}; tiết kế: ${ht.ke.ten} lúc ${ht.ke.gio} ${dinhDangNgayVN(ht.ke.ngay)}.`;

  const theDocNhanh: TheDocNhanhItem[] = [
    {
      ma: 'tiet-hien-tai',
      nhan: 'Tiết đang hiệu lực',
      giaTri: ht.dang.ten,
      hanh: muaDang.hanh,
      chiTiet: `Từ ${ht.dang.gio} ${ht.dang.thu} ${dinhDangNgayVN(ht.dang.ngay)} · Kinh độ ${dangInfo.kinhDo}° (${dangInfo.loai === 'tiet' ? 'tiết đầu' : 'trung khí'} của ${tenThangTiet(dangInfo.thangTiet)}).`,
    },
    {
      ma: 'tiet-ke-tiep',
      nhan: 'Tiết kế tiếp',
      giaTri: ht.ke.ten,
      hanh: muaCuaTiet(keInfo.thangTiet).hanh,
      chiTiet: `Bắt đầu lúc ${ht.ke.gio} ${ht.ke.thu} ${dinhDangNgayVN(ht.ke.ngay)} · Kinh độ ${keInfo.kinhDo}°.`,
    },
    {
      ma: 'nam-dang-xem',
      nhan: 'Tiết và trung khí',
      giaTri: `Năm ${namChon}`,
      muc: 'binh',
      chiTiet: '24 mốc theo thời gian (12 tiết mở đầu tháng, 12 trung khí giữa tháng).',
    },
  ];

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/tiet-khi" toi>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(taoSchemaWebPage(tt)),
        }}
      />

      {/* 1. Chọn năm */}
      <section className="ck-lm-muc" aria-label="Chọn năm xem 24 tiết khí">
        <div className="ck-lm-form-khung">
          <form method="get" action="/tiet-khi" className="ck-lm-form">
            <label className="ck-lm-truong">
              <span>Chọn năm dương ({NAM_LICH_MUA_TU}–{NAM_LICH_MUA_DEN})</span>
              <select name="nam" defaultValue={String(namChon)}>
                {DS_NAM_LICH_MUA.map((n) => (
                  <option key={n} value={n}>
                    Năm {n}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="ck-nut ck-nut-son ck-lm-nut-44">
              Xem năm
            </button>
          </form>

          <nav className="ck-lm-dieu-huong-ngay" aria-label="Chuyển nhanh năm">
            {namChon > NAM_LICH_MUA_TU ? (
              <Link
                href={`/tiet-khi?nam=${namChon - 1}`}
                className="ck-nut ck-nut-vien ck-lm-nut-44"
              >
                ← Năm {namChon - 1}
              </Link>
            ) : null}
            {namChon !== namNay || coLoiNam ? (
              <Link href="/tiet-khi" className="ck-nut ck-nut-vien ck-lm-nut-44">
                Năm nay ({namNay})
              </Link>
            ) : null}
            {namChon < NAM_LICH_MUA_DEN ? (
              <Link
                href={`/tiet-khi?nam=${namChon + 1}`}
                className="ck-nut ck-nut-vien ck-lm-nut-44"
              >
                Năm {namChon + 1} →
              </Link>
            ) : null}
          </nav>
        </div>

        {coLoiNam ? (
          <div className="ck-lm-bao-loi" role="status">
            <p>
              Năm <strong>{namTrim}</strong> ngoài phạm vi {NAM_LICH_MUA_TU}–{NAM_LICH_MUA_DEN}. Đang
              hiển thị năm {namChon}.
            </p>
          </div>
        ) : null}
      </section>

      {/* 2. Đầu trang & Đọc nhanh */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-tk-dn">
        <DocNhanh
          tieuDe="Hôm nay theo tiết khí"
          tieuDeId="ck-lm-tk-dn"
          luoiCot={3}
          cau={cauDauTrang}
          the={theDocNhanh}
          trenCau={
            <div className="ck-lm-dau-noi-bat">
              <div>
                <p className={`ck-lm-chinh-to ck-tq-hanh-${muaDang.hanhSlug}`}>
                  Tiết {ht.dang.ten}
                </p>
                <p className="ck-lm-phu-dong">
                  Mùa <strong>{muaDang.ten}</strong> (hành {muaDang.hanh}) · Kinh độ{' '}
                  <strong>{dangInfo.kinhDo}°</strong> · {dangInfo.nghiaTen}
                </p>
              </div>
              <Link
                href={`/tiet-khi/${ht.dang.slug}`}
                className="ck-nut ck-nut-vien ck-lm-nut-44"
              >
                Chi tiết tiết {ht.dang.ten}
              </Link>
            </div>
          }
          hienNhan={(the) =>
            the.ma === 'nam-dang-xem' ? <ThuatNgu {...THUAT_NGU_TK} /> : the.nhan
          }
        />
      </section>

      {/* 3. Vòng 24 tiết khí SVG */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-tk-vong-tieu">
        <h2 id="ck-lm-tk-vong-tieu" className="ck-lm-tieu">
          Vòng 24 tiết khí
        </h2>
        <VongTietKhiSvg dang={ht.dang} />
      </section>

      {/* 4. Bảng 24 tiết khí trong năm */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-tk-bang-tieu">
        <h2 id="ck-lm-tk-bang-tieu" className="ck-lm-tieu">
          24 tiết khí năm {namChon} (giờ Việt Nam UTC+7)
        </h2>
        <div className="ck-lm-bang-khung">
          <table className="ck-lm-bang ck-lm-bang-the ck-lm-bang-tk">
            <thead>
              <tr>
                <th scope="col">Tiết khí</th>
                <th scope="col">Loại</th>
                <th scope="col">Ngày dương</th>
                <th scope="col">Giờ</th>
                <th scope="col">Thứ</th>
                <th scope="col">Tháng theo tiết</th>
              </tr>
            </thead>
            <tbody>
              {dsNam.map((moc) => {
                const info = tietTheoSlug(moc.slug);
                const hrefNgay = duongDanNgayTuIso(moc.ngay);
                const laDang = moc.slug === ht.dang.slug && moc.ngay === ht.dang.ngay;
                return (
                  <tr
                    key={`${moc.slug}-${moc.ngay}`}
                    className={laDang ? 'ck-lm-hang-nay' : undefined}
                  >
                    <td>
                      <Link
                        href={`/tiet-khi/${moc.slug}`}
                        className="ck-lm-link-ngay"
                      >
                        {moc.ten}
                      </Link>
                      {laDang ? <span className="ck-lm-nhan-nay">Hôm nay</span> : null}
                    </td>
                    <td data-nhan="Loại">
                      <span
                        className={`ck-lm-loai-nhan ${
                          info?.loai === 'tiet' ? 'ck-lm-loai-tiet' : 'ck-lm-loai-khi'
                        }`}
                      >
                        {info?.loai === 'tiet' ? 'Tiết' : 'Trung khí'}
                      </span>
                    </td>
                    <td data-nhan="Ngày">
                      {hrefNgay ? (
                        <Link href={hrefNgay} className="ck-lm-link-ngay">
                          {dinhDangNgayVN(moc.ngay)}
                        </Link>
                      ) : (
                        dinhDangNgayVN(moc.ngay)
                      )}
                    </td>
                    <td data-nhan="Giờ">{moc.gio}</td>
                    <td data-nhan="Thứ">{moc.thu}</td>
                    <td data-nhan="Tháng tiết">
                      {info ? tenThangTiet(info.thangTiet) : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Khối giải thích & Sách ghi */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-tk-giai-thich">
        <h2 id="ck-lm-tk-giai-thich" className="ck-lm-tieu">
          Tiết, trung khí và tháng theo tiết
        </h2>
        <div className="ck-lm-the ck-lm-cach-tinh">
          <p className="ck-lm-cau-ngan">{NGUON_72_HAU.ghiChuTietKhi}</p>
          <p className="ck-lm-cau-ngan">{TRICH_TIET_THANG.giaiThich}</p>

          <TrichNguyenVan
            nhan="Sách ghi"
            dich={TRICH_TIET_THANG.dich}
            viTriViet={TRICH_TIET_THANG.viTriViet}
            tenSach={TRICH_TIET_THANG.nguon.tenHanViet}
            nienDai={TRICH_TIET_THANG.nguon.nienDai}
            doanId={TRICH_TIET_THANG.doanId}
            ghiCong={TRICH_TIET_THANG.nguon.ghiCong}
            url={TRICH_TIET_THANG.nguon.url}
          />
        </div>
      </section>

      {/* 6. Liên kết liên quan */}
      <nav className="ck-lm-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lm-lien-quan-ds">
          <Link href="/lich-am/gio-hoang-dao">Giờ hoàng đạo</Link>
          <Link href="/lich-am/ngay-le">Ngày lễ âm lịch</Link>
          <Link href="/lich-am">Lịch âm hôm nay</Link>
          <Link href="/bat-tu/lap-la-so">Lập lá số bát tự</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  dinhDangNgayThangVN,
  dinhDangNgayVN,
  duongDanNgayTuIso,
  hai,
  ngayKeTiep,
} from '@/components/ck/lichHelpers';
import {
  DaiGio,
  DocNhanh,
  ThuatNgu,
  TrichNguyenVan,
  type TheDocNhanhItem,
} from '@/components/ck/truc-quan';
import type { Hanh } from '@/lib/trang/can-chi';
import {
  GHI_CHU_GIO_HOANG_DAO,
  TRICH_GIO_HOANG_DAO,
  bangGioHoangDao,
  gioHoangDaoHomNay,
  gioHoangDaoNgay,
} from '@/lib/trang/lich-mua';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { daiGio } from '@/lib/trang/xem-ngay-truc-quan';
import { DIA_CHI } from '@/lib/tuvi-v2/am-lich';
import {
  type SearchParamsInput,
  kiemCoThamSo,
  layMot,
  phanTichNgayIso,
  serializeJsonLd,
  taoSchemaWebPage,
} from '../LichMuaHelpers';
import '../lich-mua.css';

export const revalidate = 3600;

const MAC_DINH_GHD = {
  title: 'Giờ hoàng đạo hôm nay và ngày bất kỳ – cách tính',
  h1: 'Giờ hoàng đạo hôm nay',
  description:
    'Tra giờ hoàng đạo hôm nay và ngày bất kỳ (1900–2100) theo quy tắc khởi Thanh long trong Hiệp kỷ biện phương thư.',
};

const THUAT_NGU_GHD = {
  chiNgay: {
    id: 'ck-lm-tn-chi-ngay',
    ten: 'Chi ngày',
    nghia:
      'Địa chi của ngày âm dương đang xem (một trong 12 chi Tý, Sửu, Dần… Hợi). Hai chi đối xung nhau (như Tý và Ngọ) dùng chung một bảng khởi Thanh long nên có 6 giờ hoàng đạo giống nhau.',
  },
  sauGio: {
    id: 'ck-lm-tn-sau-gio',
    ten: '6 giờ hoàng đạo',
    nghia:
      'Sáu giờ gắn với 6 thần Thanh long, Minh đường, Kim quỹ, Thiên đức, Ngọc đường, Tư mệnh khi đếm thuận 12 thần từ giờ khởi Thanh long của chi ngày; 6 giờ còn lại là hắc đạo.',
  },
} as const;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const sp = await searchParams;
  const homNay = gioHoangDaoHomNay();
  const base = await metaTrang('/lich-am/gio-hoang-dao', MAC_DINH_GHD, undefined, {
    'dd/mm': dinhDangNgayThangVN(homNay.ngay.iso),
  });
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/lich-am/gio-hoang-dao' },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function GioHoangDaoPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const sp = await searchParams;
  const homNay = gioHoangDaoHomNay();
  const ngayRaw = layMot(sp.ngay);
  const ngayTrim = ngayRaw?.trim() ?? '';
  const parsed = phanTichNgayIso(ngayTrim);
  const coLoiNgay = ngayTrim.length > 0 && parsed === null;
  const kq = parsed ? gioHoangDaoNgay(parsed.d, parsed.m, parsed.y) : homNay;

  const tt = await thongTinTrang('/lich-am/gio-hoang-dao', MAC_DINH_GHD, undefined, {
    'dd/mm': dinhDangNgayThangVN(homNay.ngay.iso),
  });

  const dai = daiGio(kq.ngay);
  const bang = bangGioHoangDao();
  const chiNgayTen = DIA_CHI[kq.ngay.canChiNgay.chi];
  const dongNhom = bang.find((r) => r.chiNgay.includes(chiNgayTen));
  const thanhLong = kq.gio.find((g) => g.than === 'Thanh long') ?? kq.gio[0];

  const gioKeTiepDai = dai.laHomNay
    ? dai.gio.find((g) => g.hoangDao && (g.hienTai || !g.daQua))
    : undefined;
  const gioKeTiep = gioKeTiepDai ? kq.gio[gioKeTiepDai.chiSo] : undefined;

  const ngayTruoc = ngayKeTiep(kq.ngay.duong.nam, kq.ngay.duong.thang, kq.ngay.duong.ngay, -1);
  const ngaySau = ngayKeTiep(kq.ngay.duong.nam, kq.ngay.duong.thang, kq.ngay.duong.ngay, 1);

  const amNhan = `${kq.ngay.am.ngay}/${kq.ngay.am.thang}${kq.ngay.am.nhuan ? ' nhuận' : ''}`;
  const cauDocNhanh = `Ngày ${kq.ngay.thu} ${dinhDangNgayVN(kq.ngay.iso)} (âm ${amNhan}), ngày ${kq.ngay.canChiNgay.ten}: giờ hoàng đạo là ${kq.tomTat}.`;

  const theDocNhanh: TheDocNhanhItem[] = [
    {
      ma: 'chi-ngay',
      nhan: 'Chi ngày',
      giaTri: kq.ngay.canChiNgay.ten,
      hanh: kq.ngay.hanhNgay as Hanh,
      chiTiet: `Khởi Thanh long ở giờ ${thanhLong.chi} (${thanhLong.khung}). Nhóm ngày ${dongNhom ? dongNhom.chiNgay.join(', ') : chiNgayTen}.`,
    },
    dai.laHomNay
      ? {
          ma: 'gio-ke-tiep',
          nhan: gioKeTiepDai?.hienTai ? 'Giờ hoàng đạo hiện tại' : 'Giờ hoàng đạo kế tiếp',
          giaTri: gioKeTiep ? `Giờ ${gioKeTiep.chi}` : 'Hết giờ hôm nay',
          muc: gioKeTiep ? 'tot' : 'binh',
          chiTiet: gioKeTiep
            ? `${gioKeTiep.khung} · Thần ${gioKeTiep.than} · ${gioKeTiep.canChi}.`
            : 'Các giờ hoàng đạo hôm nay đều đã qua.',
        }
      : {
          ma: 'khoi-thanh-long',
          nhan: 'Khởi Thanh long',
          giaTri: `Giờ ${thanhLong.chi}`,
          muc: 'tot',
          chiTiet: `${thanhLong.khung} · ${thanhLong.canChi}. Từ đây đếm thuận 12 thần.`,
        },
    {
      ma: 'sau-gio',
      nhan: '6 giờ hoàng đạo',
      giaTri: kq.tomTat,
      muc: 'tot',
      chiTiet: `6 thần hoàng đạo: ${kq.hoangDao.map((g) => g.than).join(', ')}.`,
    },
  ];

  const hanhSlug = HANH_SLUG[kq.ngay.hanhNgay as Hanh] ?? 'tho';
  const hrefNgayChiTiet = duongDanNgayTuIso(kq.ngay.iso);

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/lich-am/gio-hoang-dao" toi>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(taoSchemaWebPage(tt)),
        }}
      />

      {/* 1. Form GET chọn ngày */}
      <section className="ck-lm-muc" aria-label="Chọn ngày xem giờ hoàng đạo">
        <div className="ck-lm-form-khung">
          <form method="get" action="/lich-am/gio-hoang-dao" className="ck-lm-form">
            <label className="ck-lm-truong">
              <span>Chọn ngày dương (1900–2100)</span>
              <input
                type="date"
                name="ngay"
                min="1900-01-01"
                max="2100-12-31"
                defaultValue={kq.ngay.iso}
              />
            </label>
            <button type="submit" className="ck-nut ck-nut-son ck-lm-nut-44">
              Xem giờ hoàng đạo
            </button>
          </form>

          <nav className="ck-lm-dieu-huong-ngay" aria-label="Chuyển nhanh ngày">
            {ngayTruoc ? (
              <Link
                href={`/lich-am/gio-hoang-dao?ngay=${ngayTruoc.nam}-${hai(ngayTruoc.thang)}-${hai(ngayTruoc.ngay)}`}
                className="ck-nut ck-nut-vien ck-lm-nut-44"
              >
                ← Ngày trước
              </Link>
            ) : null}
            {!dai.laHomNay || coLoiNgay ? (
              <Link href="/lich-am/gio-hoang-dao" className="ck-nut ck-nut-vien ck-lm-nut-44">
                Hôm nay
              </Link>
            ) : null}
            {ngaySau ? (
              <Link
                href={`/lich-am/gio-hoang-dao?ngay=${ngaySau.nam}-${hai(ngaySau.thang)}-${hai(ngaySau.ngay)}`}
                className="ck-nut ck-nut-vien ck-lm-nut-44"
              >
                Ngày sau →
              </Link>
            ) : null}
          </nav>
        </div>

        {coLoiNgay ? (
          <div className="ck-lm-bao-loi" role="status">
            <p>
              Ngày <strong>{ngayTrim}</strong> không hợp lệ hoặc ngoài phạm vi 1900–2100. Đang hiện giờ
              hoàng đạo hôm nay ({dinhDangNgayVN(kq.ngay.iso)}).
            </p>
          </div>
        ) : null}
      </section>

      {/* 2. Đọc nhanh */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-ghd-dn">
        <DocNhanh
          tieuDe="Đọc nhanh"
          tieuDeId="ck-lm-ghd-dn"
          luoiCot={3}
          cau={cauDocNhanh}
          the={theDocNhanh}
          trenCau={
            <div className="ck-lm-dau-noi-bat">
              <div>
                <p className={`ck-lm-chinh-to ck-tq-hanh-${hanhSlug}`}>
                  {dinhDangNgayVN(kq.ngay.iso)}
                </p>
                <p className="ck-lm-phu-dong">
                  {kq.ngay.thu} · Âm lịch <strong>{amNhan}</strong> ({kq.ngay.tenThangAm} năm{' '}
                  {kq.ngay.canChiNam.ten}) · Ngày <strong>{kq.ngay.canChiNgay.ten}</strong> (hành{' '}
                  {kq.ngay.hanhNgay})
                </p>
              </div>
              {hrefNgayChiTiet ? (
                <Link href={hrefNgayChiTiet} className="ck-nut ck-nut-vien ck-lm-nut-44">
                  Xem lịch ngày {dinhDangNgayVN(kq.ngay.iso)}
                </Link>
              ) : null}
            </div>
          }
          hienNhan={(the) => {
            if (the.ma === 'chi-ngay') return <ThuatNgu {...THUAT_NGU_GHD.chiNgay} />;
            if (the.ma === 'sau-gio') return <ThuatNgu {...THUAT_NGU_GHD.sauGio} />;
            return the.nhan;
          }}
        />
      </section>

      {/* 3. Dải 12 giờ (dùng lại Lệnh 41) */}
      <section className="ck-lm-muc" aria-label="Dải 12 giờ hoàng đạo và hắc đạo">
        <DaiGio
          dai={dai}
          tenThan={kq.gio.map((g) => g.than)}
          className="ck-lm-dai-gio"
          tieuDe={
            dai.laHomNay
              ? 'Dải 12 giờ hôm nay'
              : `Dải 12 giờ ngày ${dinhDangNgayVN(kq.ngay.iso)}`
          }
        />
      </section>

      {/* 4. Bảng tra 6 dòng */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-ghd-bang-tieu">
        <h2 id="ck-lm-ghd-bang-tieu" className="ck-lm-tieu">
          Bảng tra 6 nhóm giờ hoàng đạo theo chi ngày
        </h2>
        <div className="ck-lm-bang-khung">
          <table className="ck-lm-bang ck-lm-bang-the ck-lm-bang-ghd">
            <thead>
              <tr>
                <th scope="col">Chi ngày</th>
                <th scope="col">Giờ 1</th>
                <th scope="col">Giờ 2</th>
                <th scope="col">Giờ 3</th>
                <th scope="col">Giờ 4</th>
                <th scope="col">Giờ 5</th>
                <th scope="col">Giờ 6</th>
              </tr>
            </thead>
            <tbody>
              {bang.map((dong) => {
                const dangXem = dong.chiNgay.includes(chiNgayTen);
                return (
                  <tr
                    key={dong.chiNgay.join('-')}
                    className={dangXem ? 'ck-lm-hang-nay' : undefined}
                  >
                    <th scope="row">
                      Ngày {dong.chiNgay.join(', ')}
                      {dangXem ? <span className="ck-lm-nhan-nay">Đang xem</span> : null}
                    </th>
                    {dong.gio.map((g) => (
                      <td key={g.chi}>
                        <div className="ck-lm-ghd-o">
                          <strong>{g.chi}</strong>
                          <span>{g.khung}</span>
                          <small>{g.than}</small>
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Cách tính & Sách ghi */}
      <section className="ck-lm-muc" aria-labelledby="ck-lm-ghd-cach-tinh">
        <h2 id="ck-lm-ghd-cach-tinh" className="ck-lm-tieu">
          Cách tính theo sách
        </h2>
        <div className="ck-lm-the ck-lm-cach-tinh">
          <p className="ck-lm-cau-ngan">
            Mỗi ngày, Thanh long khởi ở một giờ tùy chi ngày, rồi đếm thuận 12 thần; 6 thần tốt là
            hoàng đạo.
          </p>

          <TrichNguyenVan
            nhan="Sách ghi"
            dich={TRICH_GIO_HOANG_DAO.dich}
            viTriViet={TRICH_GIO_HOANG_DAO.viTriViet}
            tenSach={TRICH_GIO_HOANG_DAO.nguon.tenHanViet}
            nienDai={TRICH_GIO_HOANG_DAO.nguon.nienDai}
            doanId={TRICH_GIO_HOANG_DAO.doanId}
            ghiCong={TRICH_GIO_HOANG_DAO.nguon.ghiCong}
            url={TRICH_GIO_HOANG_DAO.nguon.url}
          />

          <div className="ck-lm-ghi-chu">
            <p>{GHI_CHU_GIO_HOANG_DAO}</p>
          </div>
        </div>
      </section>

      {/* 6. Liên kết liên quan */}
      <nav className="ck-lm-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lm-lien-quan-ds">
          {hrefNgayChiTiet ? (
            <Link href={hrefNgayChiTiet}>
              Lịch ngày {dinhDangNgayVN(kq.ngay.iso)}
            </Link>
          ) : null}
          <Link href="/xem-ngay">Xem ngày tốt xấu</Link>
          <Link href="/lich-am/ngay-mai">Lịch âm ngày mai</Link>
          <Link href="/lich-am">Lịch âm hôm nay</Link>
          <Link href="/tiet-khi">24 tiết khí</Link>
          <Link href="/lich-am/ngay-le">Ngày lễ âm lịch</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}

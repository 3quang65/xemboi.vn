import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  dinhDangNgayVN,
  duongDanNgayTuIso,
  nhanNgayAmChu,
} from '@/components/ck/lichHelpers';
import {
  DaiGio,
  DocNhanh,
  ThuatNgu,
  type TheDocNhanhItem,
} from '@/components/ck/truc-quan';
import type { Hanh } from '@/lib/trang/can-chi';
import { boChuHan } from '@/lib/trang/chu-viet';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  MA_VIEC_CO_TRANG,
  TEN_NHOM_TRUC,
  VIEC,
  doanThang,
  ngayTheoViec,
  thangKe,
  thangXemNgay,
  xemNgay,
  type Muc,
} from '@/lib/trang/xem-ngay';
import { daiGio, docNhanhNgay } from '@/lib/trang/xem-ngay-truc-quan';
import BaHeGiaiThich from './BaHeGiaiThich';
import { BangThangTongHop, LuoiLichXemNgay } from './LuoiLichXemNgay';
import {
  NGUON_LUNAR_BAT_BUOC,
  homNayVaNgayMaiVN,
  macDinhHub,
  serializeJsonLd,
  taoSchemaWebPage,
  thangXemNgayHopLe,
} from './XemNgayHelpers';

export const revalidate = 3600;

const NGHIA_THUAT_NGU: Record<string, { ten: string; nghia: string; id: string }> = {
  than: {
    ten: 'Thần ngày (12 thần)',
    nghia:
      'Hệ 12 thần hoàng đạo / hắc đạo trong Hiệp kỷ biện phương thư (quyển 7): khởi Thanh long theo chi tháng tiết (Dần/Thân khởi Tý, Mão/Dậu khởi Dần…) rồi đếm thuận tới chi ngày. Gồm 6 thần hoàng đạo (Thanh long, Minh đường, Kim quỹ, Thiên đức, Ngọc đường, Tư mệnh) và 6 thần hắc đạo.',
    id: 'ck-xn-tn-than',
  },
  truc: {
    ten: 'Trực (12 trực)',
    nghia:
      'Thập nhị trực tính theo công thức (chi ngày − chi tháng tiết) chia dư 12, trong đó tháng tiết đổi tại 12 tiết khí chính (tháng Dần bắt đầu từ Lập xuân).',
    id: 'ck-xn-tn-truc',
  },
  gio: {
    ten: 'Giờ hoàng đạo',
    nghia:
      'Bảng 6 mẫu giờ hoàng đạo theo lịch Hồ Ngọc Đức, tra theo địa chi của ngày đang xem; khớp quy tắc khởi 12 thần trong Hiệp kỷ khi áp cho 12 chi giờ trong ngày.',
    id: 'ck-xn-tn-gio',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/xem-ngay', macDinhHub());
}

function DanhSachNghiKyThuGon({
  nhan,
  danhSach,
  gioiHan = 8,
}: {
  nhan: string;
  danhSach: Muc[];
  gioiHan?: number;
}) {
  const dau = danhSach.slice(0, gioiHan);
  const conLai = danhSach.slice(gioiHan);

  return (
    <div className="ck-xn-nghi-ky-nhom">
      <h4>{nhan}</h4>
      {danhSach.length === 0 ? (
        <p className="ck-xn-khong-co">Không có</p>
      ) : (
        <>
          <ul className="ck-xn-chip-ds">
            {dau.map((m) => (
              <li key={m.han} className="ck-xn-chip">
                {m.ten}
              </li>
            ))}
          </ul>
          {conLai.length > 0 ? (
            <details className="ck-xn-them">
              <summary>và {conLai.length} việc khác</summary>
              <ul className="ck-xn-chip-ds ck-xn-chip-ds-con">
                {conLai.map((m) => (
                  <li key={m.han} className="ck-xn-chip">
                    {m.ten}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </>
      )}
    </div>
  );
}

export default async function XemNgayHubPage() {
  const macDinh = macDinhHub();
  const tt = await thongTinTrang('/xem-ngay', macDinh);
  const { homNay, ngayMai, homNayIso } = homNayVaNgayMaiVN();
  const hn = xemNgay(homNay.ngay, homNay.thang, homNay.nam);
  const nm = xemNgay(ngayMai.ngay, ngayMai.thang, ngayMai.nam);
  const docNhanhRaw = docNhanhNgay(hn);
  const docNhanh = {
    ...docNhanhRaw,
    the: docNhanhRaw.the.map((t) => {
      const sach = boChuHan(t.chiTiet);
      return {
        ...t,
        chiTiet: sach
          ? sach.charAt(0).toLocaleUpperCase('vi-VN') + sach.slice(1)
          : '',
      };
    }),
  };
  const daiGioHomNay = daiGio(hn.lich);
  const dsThangNay = thangXemNgay(homNay.nam, homNay.thang);

  const daDung = trangDaDung();
  const ke = thangKe(homNay.nam, homNay.thang);

  const coLinkLichAm = daDung.has('/lich-am');
  const hrefHomNay = coLinkLichAm ? duongDanNgayTuIso(hn.iso) : null;
  const hrefNgayMai = coLinkLichAm ? duongDanNgayTuIso(nm.iso) : null;

  const hanhSlug =
    HANH_SLUG[hn.lich.hanhNgay as Hanh] ?? 'tho';

  const dsViec = MA_VIEC_CO_TRANG.map((ma) => ({
    ma,
    ten: VIEC[ma].ten,
    soHop: ngayTheoViec(ma, homNay.nam, homNay.thang).hop.length,
    href: `/xem-ngay/${ma}`,
  }));

  const doanThangNay = doanThang(homNay.nam, homNay.thang);
  const coThangNay = thangXemNgayHopLe(homNay.nam, homNay.thang);
  const doanThangSau = ke.sau ? doanThang(ke.sau.nam, ke.sau.thang) : null;
  const coThangSau = ke.sau
    ? thangXemNgayHopLe(ke.sau.nam, ke.sau.thang)
    : false;

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/xem-ngay" toi>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(taoSchemaWebPage(tt)),
        }}
      />

      {/* 1. Đầu mục Hôm nay: Đọc nhanh + Dải 12 giờ + Chi tiết 3 lớp + Ngày mai */}
      <section className="ck-xn-muc" aria-labelledby="ck-xn-hom-nay-tieu">
        <DocNhanh
          tieuDe="Hôm nay"
          tieuDeId="ck-xn-hom-nay-tieu"
          luoiCot={4}
          cau={docNhanh.cau}
          the={docNhanh.the as TheDocNhanhItem[]}
          trenCau={
            <div className="ck-xn-hom-nay-dau">
              <div>
                <p className={`ck-xn-ngay-to ck-tq-hanh-${hanhSlug}`}>
                  {dinhDangNgayVN(hn.iso)}
                </p>
                <p className="ck-xn-am-lich">
                  {hn.lich.thu} · Âm lịch{' '}
                  <strong>
                    {nhanNgayAmChu(hn.lich.am.ngay, true)} {hn.lich.tenThangAm}{' '}
                    năm {hn.lich.canChiNam.ten}
                  </strong>{' '}
                  · Ngày <strong>{hn.lich.canChiNgay.ten}</strong> (hành {hn.lich.hanhNgay})
                </p>
              </div>
              {hrefHomNay ? (
                <Link href={hrefHomNay} className="ck-nut ck-nut-vien ck-xn-nut-44">
                  Chi tiết ngày {dinhDangNgayVN(hn.iso)}
                </Link>
              ) : null}
            </div>
          }
          hienNhan={(the) => {
            if (the.ma === 'gio') {
              return (
                <>
                  <ThuatNgu {...NGHIA_THUAT_NGU.gio} />
                  {daiGioHomNay.laHomNay ? ' (kế tiếp)' : ''}
                </>
              );
            }
            const tn = NGHIA_THUAT_NGU[the.ma];
            return tn ? <ThuatNgu {...tn} /> : the.nhan;
          }}
        />

        <div className="ck-xn-gio-khung">
          <DaiGio dai={daiGioHomNay} tieuDe="Dải 12 giờ hôm nay" />
        </div>

        <div className="ck-xn-hom-nay-luoi">
          {/* 3 lớp chi tiết (giữ nguyên nội dung trong details open) */}
          <details open className="ck-xn-the ck-xn-the-hom-nay ck-xn-chi-tiet-hn">
            <summary className="ck-xn-chi-tiet-tieu">
              Chi tiết 3 lớp hôm nay (12 thần, 12 trực, nghi kỵ)
            </summary>

            <dl className="ck-xn-can-chi-khung">
              <div>
                <dt>Can chi ngày</dt>
                <dd>
                  <strong>{hn.lich.canChiNgay.ten}</strong>
                </dd>
              </div>
              <div>
                <dt>Tháng (theo tiết khí)</dt>
                <dd>
                  <strong>{hn.thangTiet.canChi.ten}</strong>
                </dd>
              </div>
            </dl>

            <div className="ck-xn-ba-lop">
              <div className="ck-xn-lop">
                <h3>Lớp 1 · 12 thần</h3>
                <p className="ck-xn-lop-gia-tri">
                  <strong>{hn.than.ten}</strong>
                </p>
                <span
                  className={`ck-xn-nhan ${hn.than.hoangDao ? 'ck-xn-hoang' : 'ck-xn-hac'
                    }`}
                >
                  {hn.than.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'}
                </span>
              </div>

              <div className="ck-xn-lop">
                <h3>Lớp 2 · 12 trực</h3>
                <p className="ck-xn-lop-gia-tri">
                  <strong>Trực {hn.truc.ten}</strong>
                </p>
                <span className={`ck-xn-nhan ck-xn-truc-${hn.truc.nhom}`}>
                  {TEN_NHOM_TRUC[hn.truc.nhom]}
                </span>
                {hn.truc.viec !== null ? (
                  <p className="ck-xn-truc-viec">Câu ca ghi: {hn.truc.viec}</p>
                ) : null}
              </div>

              <div className="ck-xn-lop ck-xn-lop-nghi-ky">
                <h3>Lớp 3 · Nghi, kỵ, cát thần, hung sát</h3>
                <div className="ck-xn-nghi-ky-luoi">
                  <DanhSachNghiKyThuGon nhan="Nghi (nên làm)" danhSach={hn.nghi} />
                  <DanhSachNghiKyThuGon nhan="Kỵ (tránh làm)" danhSach={hn.ky} />
                </div>
                <div className="ck-xn-than-sat-luoi">
                  <DanhSachNghiKyThuGon
                    nhan="Cát thần"
                    danhSach={hn.catThan}
                  />
                  <DanhSachNghiKyThuGon
                    nhan="Hung sát"
                    danhSach={hn.hungSat}
                  />
                </div>
                <p className="ck-xn-nguon-dong">{NGUON_LUNAR_BAT_BUOC}</p>
              </div>
            </div>
          </details>

          {/* Thẻ phụ: Ngày mai */}
          <aside className="ck-xn-the ck-xn-the-ngay-mai" aria-label="Xem ngày mai">
            <h2 className="ck-xn-tieu-nho">
              Ngày mai: {nm.lich.thu}, {dinhDangNgayVN(nm.iso)}
            </h2>
            <p className="ck-xn-am-lich">
              Âm lịch:{' '}
              <strong>
                {nhanNgayAmChu(nm.lich.am.ngay, true)} {nm.lich.tenThangAm}
              </strong>
            </p>
            <p className="ck-xn-ngay-mai-dong">
              Ngày <strong>{nm.lich.canChiNgay.ten}</strong> · Tháng (theo tiết khí){' '}
              <strong>{nm.thangTiet.canChi.ten}</strong>
            </p>

            <ul className="ck-xn-ngay-mai-he">
              <li>
                <span>12 thần:</span>{' '}
                <strong>{nm.than.ten}</strong>{' '}
                <span
                  className={`ck-xn-nhan ${nm.than.hoangDao ? 'ck-xn-hoang' : 'ck-xn-hac'
                    }`}
                >
                  {nm.than.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'}
                </span>
              </li>
              <li>
                <span>12 trực:</span>{' '}
                <strong>Trực {nm.truc.ten}</strong>{' '}
                <span className={`ck-xn-nhan ck-xn-truc-${nm.truc.nhom}`}>
                  {TEN_NHOM_TRUC[nm.truc.nhom]}
                </span>
                {nm.truc.viec !== null ? (
                  <span className="ck-xn-ngay-mai-viec"> · {nm.truc.viec}</span>
                ) : null}
              </li>
              <li>
                <span>Giờ hoàng đạo:</span>{' '}
                <strong>
                  {nm.lich.gioHoangDao
                    .map((g) => `${g.chi} (${g.khung})`)
                    .join(', ')}
                </strong>
              </li>
            </ul>

            {hrefNgayMai ? (
              <Link
                href={hrefNgayMai}
                className="ck-nut ck-nut-vien ck-xn-nut-gon ck-xn-nut-44"
              >
                Chi tiết ngày mai
              </Link>
            ) : null}
          </aside>
        </div>
      </section>

      {/* 2. Chọn ngày theo việc (nút phân đoạn) */}
      <section className="ck-xn-muc" aria-labelledby="ck-xn-viec-tieu">
        <h2 id="ck-xn-viec-tieu" className="ck-xn-tieu">
          Chọn ngày theo việc (tháng {homNay.thang}/{homNay.nam})
        </h2>
        <div className="ck-xn-viec-luoi">
          {dsViec.map((v) => {
            const coTrang = daDung.has(v.href);
            return coTrang ? (
              <Link key={v.ma} href={v.href} className="ck-xn-viec-the">
                <strong className="ck-xn-viec-ten">{v.ten}</strong>
                <span className="ck-xn-viec-dem">
                  {v.soHop} ngày hợp tháng {homNay.thang}
                </span>
              </Link>
            ) : (
              <div key={v.ma} className="ck-xn-viec-the ck-xn-viec-tinh">
                <strong className="ck-xn-viec-ten">{v.ten}</strong>
                <span className="ck-xn-viec-dem">
                  {v.soHop} ngày hợp tháng {homNay.thang}
                </span>
              </div>
            );
          })}

          {daDung.has('/xem-ngay/xuat-hanh') ? (
            <Link href="/xem-ngay/xuat-hanh" className="ck-xn-viec-the ck-xn-viec-tet">
              <strong className="ck-xn-viec-ten">Giờ xuất hành Tết</strong>
              <span className="ck-xn-viec-dem">Mùng 1–10 Tết</span>
            </Link>
          ) : null}
        </div>
      </section>

      {/* 3. Bảng xem ngày cả tháng → lưới lịch 7 cột + <details> Xem dạng bảng */}
      <section className="ck-xn-muc" aria-labelledby="ck-xn-bang-thang-tieu">
        <div className="ck-xn-the">
          <div className="ck-xn-thang-bar">
            <div>
              <h2 id="ck-xn-bang-thang-tieu" className="ck-xn-tieu-nho">
                Bảng xem ngày cả tháng ({homNay.thang}/{homNay.nam})
              </h2>
              <p className="ck-xn-vi-tri">
                Mỗi ô gồm ngày dương, ngày âm, chấm xanh khi thần hoàng đạo và tên 12 trực. Bấm ô để xem chi tiết ngày.
              </p>
            </div>
            {coThangNay || (coThangSau && doanThangSau) ? (
              <div className="ck-xn-thang-nut">
                {coThangNay ? (
                  <Link
                    href={`/xem-ngay/${doanThangNay}`}
                    className="ck-nut ck-nut-son ck-xn-nut-44"
                  >
                    Bảng tháng {homNay.thang}/{homNay.nam}
                  </Link>
                ) : null}
                {coThangSau && ke.sau && doanThangSau ? (
                  <Link
                    href={`/xem-ngay/${doanThangSau}`}
                    className="ck-nut ck-nut-vien ck-xn-nut-44"
                  >
                    Bảng tháng {ke.sau.thang}/{ke.sau.nam} →
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          <LuoiLichXemNgay
            cheDo="tong-hop"
            nam={homNay.nam}
            thang={homNay.thang}
            ngayXem={dsThangNay}
            homNayIso={homNayIso}
            coLinkLichAm={coLinkLichAm}
          />

          <details className="ck-xn-chi-tiet">
            <summary>Xem dạng bảng</summary>
            <BangThangTongHop
              dsNgay={dsThangNay}
              homNayIso={homNayIso}
              coLinkLichAm={coLinkLichAm}
            />
          </details>

          <p className="ck-xn-nguon-dong">{NGUON_LUNAR_BAT_BUOC}</p>
        </div>
      </section>

      {/* 4. Ba hệ nói gì, theo sách nào */}
      <BaHeGiaiThich daDung={daDung} />

      {/* 5. Liên kết liên quan */}
      <nav className="ck-xn-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-xn-lien-quan-ds">
          {daDung.has('/lich-am') ? (
            <Link href="/lich-am">Lịch âm hôm nay</Link>
          ) : null}
          {daDung.has('/xem-ngay/xuat-hanh') ? (
            <Link href="/xem-ngay/xuat-hanh">Giờ xuất hành Tết</Link>
          ) : null}
          {daDung.has('/xem-tuoi/vo-chong') ? (
            <Link href="/xem-tuoi/vo-chong">Xem tuổi vợ chồng</Link>
          ) : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

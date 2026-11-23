import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { DocNhanh, ThuatNgu, type TheDocNhanhItem } from '@/components/ck/truc-quan';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { docNhanhThanSo } from '@/lib/trang/phan-truc-quan';
import {
  SO_MASTER,
  bieuDoNgaySinh,
  docNgay,
  duongDanNamCaNhan,
  duongDanSoChuDao,
  isoNgay,
  namCaNhan,
  soChuDao,
  vietNgay,
} from '@/lib/trang/than-so-hoc';
import { yNghia } from '@/lib/trang/than-so-hoc-y-nghia';
import {
  GOC_SITE,
  MAC_DINH_SO_CHU_DAO,
  NGAY_VI_DU,
  dinhDangBuoc,
  dinhDangBuocPhan,
  kiemCoThamSo,
  layMot,
  serializeJsonLd,
  taoSchemaWebApplication,
  type SearchParamsInput,
} from '../ThanSoHocHelpers';
import {
  BonDinhCaoTrucQuan,
  DanhSachQuyUoc,
  GhiChuNgayDuong,
  KhoiGioiHan,
  KhoiYNghia,
  LuoiBieuDoNgaySinh,
  NGHIA_THUAT_NGU_TSH,
  ThanhSoChuDao,
  VongTronSoChuDao,
} from '../ThanSoHocUi';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/than-so-hoc/so-chu-dao', MAC_DINH_SO_CHU_DAO),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}/than-so-hoc/so-chu-dao` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function CongCuSoChuDaoPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/than-so-hoc/so-chu-dao', MAC_DINH_SO_CHU_DAO),
    searchParams,
  ]);
  const daDung = trangDaDung();
  const jsonLd = taoSchemaWebApplication(tt);

  const ngayRaw = layMot(sp.ngay)?.trim() ?? '';
  let loi: string | null = null;
  const ngaySinh = ngayRaw ? docNgay(ngayRaw) : undefined;
  if (ngayRaw && !ngaySinh) {
    loi =
      'Ngày sinh dương lịch không hợp lệ. Vui lòng chọn ngày có thật từ 01/01/1900 đến 31/12/2100.';
  }

  const ketQua = ngaySinh ? soChuDao(ngaySinh) : null;
  const namNay = ngayHienTaiVN().nam;
  const namSau = namNay + 1;
  const ncnNay = ngaySinh ? namCaNhan(ngaySinh.ngay, ngaySinh.thang, namNay) : null;
  const ncnSau = ngaySinh ? namCaNhan(ngaySinh.ngay, ngaySinh.thang, namSau) : null;
  const docNhanh = ngaySinh ? docNhanhThanSo(ngaySinh, namNay) : null;
  const bieuDo = ngaySinh ? bieuDoNgaySinh(ngaySinh) : null;

  const hienNhanDocNhanh = (muc: TheDocNhanhItem) => {
    if (muc.ma === 'so-chu-dao') {
      return (
        <ThuatNgu
          ten={muc.nhan}
          nghia={NGHIA_THUAT_NGU_TSH.soChuDao}
          id="ck-scd-tn-scd"
        />
      );
    }
    if (muc.ma === 'nam-ca-nhan') {
      return (
        <ThuatNgu
          ten={muc.nhan}
          nghia={NGHIA_THUAT_NGU_TSH.namCaNhan}
          id="ck-scd-tn-ncn"
        />
      );
    }
    if (muc.ma === 'dinh-cao') {
      return (
        <ThuatNgu
          ten={muc.nhan}
          nghia={NGHIA_THUAT_NGU_TSH.dinhCao}
          id="ck-scd-tn-dc"
        />
      );
    }
    return muc.nhan;
  };

  const viDu = soChuDao(NGAY_VI_DU);
  const giaTriInput = ngaySinh
    ? isoNgay(ngaySinh)
    : /^\d{4}-\d{2}-\d{2}$/.test(ngayRaw)
      ? ngayRaw
      : '';

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/than-so-hoc/so-chu-dao"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. Form nhập ngày sinh dương lịch */}
      <div className="ck-tsh-form-khung">
        <form className="ck-to-giay" action="/than-so-hoc/so-chu-dao" method="get">
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2>Nhập ngày sinh dương lịch</h2>
            <HoaVanMay flipped />
          </div>

          {loi ? (
            <div className="ck-loi" role="alert">
              {loi}
            </div>
          ) : null}

          <div className="ck-o-nhap">
            <label htmlFor="ck-tsh-scd-ngay">
              Ngày sinh dương lịch (1900–2100)
            </label>
            <input
              id="ck-tsh-scd-ngay"
              name="ngay"
              type="date"
              min="1900-01-01"
              max="2100-12-31"
              defaultValue={giaTriInput}
              required
            />
          </div>

          <button type="submit" className="ck-nut ck-nut-son ck-nut-lon ck-tsh-nut-chinh">
            Tính số chủ đạo
          </button>

          <GhiChuNgayDuong daDung={daDung} />
        </form>
      </div>

      {/* 2. Kết quả tính số chủ đạo */}
      {ketQua && ngaySinh && ncnNay && ncnSau && docNhanh && bieuDo ? (
        <section className="ck-td-muc" aria-labelledby="ck-tsh-scd-kq">
          <h2 id="ck-tsh-scd-kq" className="ck-td-tieu">
            Kết quả cho ngày {vietNgay(ngaySinh)}
          </h2>

          <DocNhanh
            cau={docNhanh.cau}
            the={docNhanh.the}
            luoiCot={4}
            tieuDeId="ck-tsh-scd-dn"
            hienNhan={hienNhanDocNhanh}
          />

          <VongTronSoChuDao
            so={ketQua.cach1.so}
            phepCong={ketQua.cach1.phepCong}
            buoc={ketQua.cach1.buoc}
            nhan="Số chủ đạo"
            href={duongDanSoChuDao(ketQua.cach1.so)}
            thuatNguId="ck-scd-vong-tn"
            thuatNguNghia={NGHIA_THUAT_NGU_TSH.soChuDao}
            phu={`Tính theo cách 1 (cộng dồn chữ số ngày ${vietNgay(ngaySinh)}).`}
          />

          <div className="ck-tsh-hai-cach">
            <div className="ck-tsh-cach-the">
              <div className="ck-tsh-cach-dau">
                <h3>Cách 1: Cộng dồn</h3>
                <Link
                  href={duongDanSoChuDao(ketQua.cach1.so)}
                  className="ck-tsh-cach-so"
                  aria-label={`Cách 1 ra số ${ketQua.cach1.so}`}
                >
                  {ketQua.cach1.so}
                </Link>
              </div>
              <p className="ck-tsh-phep-cong">{ketQua.cach1.phepCong}</p>
              <p className="ck-tsh-buoc-dong">
                Rút gọn: {dinhDangBuoc(ketQua.cach1.buoc, SO_MASTER)}
              </p>
            </div>

            <div className="ck-tsh-cach-the">
              <div className="ck-tsh-cach-dau">
                <h3>Cách 2: Rút từng phần</h3>
                <Link
                  href={duongDanSoChuDao(ketQua.cach2.so)}
                  className="ck-tsh-cach-so"
                  aria-label={`Cách 2 ra số ${ketQua.cach2.so}`}
                >
                  {ketQua.cach2.so}
                </Link>
              </div>
              <ul className="ck-tsh-phan-ds">
                <li>
                  Ngày {ngaySinh.ngay} → {dinhDangBuocPhan(ngaySinh.ngay)} (lấy{' '}
                  <b>{ketQua.cach2.phan[0]}</b>)
                </li>
                <li>
                  Tháng {ngaySinh.thang} → {dinhDangBuocPhan(ngaySinh.thang)} (lấy{' '}
                  <b>{ketQua.cach2.phan[1]}</b>)
                </li>
                <li>
                  Năm {ngaySinh.nam} → {dinhDangBuocPhan(ngaySinh.nam)} (lấy{' '}
                  <b>{ketQua.cach2.phan[2]}</b>)
                </li>
              </ul>
              <p className="ck-tsh-phep-cong">{ketQua.cach2.phepCong}</p>
              <p className="ck-tsh-buoc-dong">
                Rút gọn: {dinhDangBuoc(ketQua.cach2.buoc, SO_MASTER)}
              </p>
            </div>
          </div>

          {ketQua.khac ? (
            <p className="ck-tsh-so-sanh-dong ck-tsh-so-sanh-khac">
              <strong>
                Hai cách cho kết quả khác nhau:{' '}
                <Link href={duongDanSoChuDao(ketQua.cach1.so)}>{ketQua.cach1.so}</Link> và{' '}
                <Link href={duongDanSoChuDao(ketQua.cach2.so)}>{ketQua.cach2.so}</Link>
              </strong>
            </p>
          ) : (
            <p className="ck-tsh-so-sanh-dong">
              Hai cách cùng ra{' '}
              <Link href={duongDanSoChuDao(ketQua.cach1.so)}>
                <strong>{ketQua.cach1.so}</strong>
              </Link>
            </p>
          )}

          <h3 className="ck-tsh-nhom-so-tieu">
            <ThuatNgu
              ten="Năm cá nhân"
              nghia={NGHIA_THUAT_NGU_TSH.namCaNhan}
              id="ck-scd-tieu-ncn"
            />{' '}
            năm nay và năm sau
          </h3>
          <div className="ck-tsh-nam-cap">
            {[
              { nam: namNay, nhan: 'Năm nay', kq: ncnNay },
              { nam: namSau, nhan: 'Năm sau', kq: ncnSau },
            ].map(({ nam, nhan, kq }) => (
              <div key={nam} className="ck-tsh-cach-the">
                <div className="ck-tsh-cach-dau">
                  <h3>
                    {nhan} ({nam})
                  </h3>
                  <Link
                    href={duongDanNamCaNhan(kq.so)}
                    className="ck-tsh-cach-so"
                    aria-label={`Năm cá nhân ${nam}: số ${kq.so}`}
                  >
                    {kq.so}
                  </Link>
                </div>
                <p className="ck-tsh-phep-cong">{kq.phepCong}</p>
                <p className="ck-tsh-buoc-dong">Rút gọn: {dinhDangBuoc(kq.buoc, [])}</p>
                <p className="ck-tsh-chi-so-xem">
                  <Link href={duongDanNamCaNhan(kq.so)}>Xem trang năm cá nhân {kq.so} →</Link>
                </p>
              </div>
            ))}
          </div>

          <h3 className="ck-tsh-nhom-so-tieu">
            4{' '}
            <ThuatNgu
              ten="đỉnh cao"
              nghia={NGHIA_THUAT_NGU_TSH.dinhCao}
              id="ck-scd-tieu-dc"
            />{' '}
            theo tuổi
          </h3>
          <BonDinhCaoTrucQuan
            ngaySinh={ngaySinh}
            namXet={namNay}
            dinhCao={docNhanh.dinhCao}
            chiSoDinhHienTai={docNhanh.chiSoDinhHienTai}
          />

          <h3 className="ck-tsh-nhom-so-tieu">Lưới ngày sinh 3 × 3</h3>
          <LuoiBieuDoNgaySinh
            bieuDo={bieuDo}
            idPrefix="ck-scd-bd"
            moTa={`Lưới 3 × 3 biểu đồ ngày sinh ${vietNgay(ngaySinh)}`}
          />

          <div className="ck-tsh-hanh-dong-dong">
            <Link
              href={`/than-so-hoc/bieu-do-ngay-sinh?ngay=${isoNgay(ngaySinh)}`}
              className="ck-nut ck-nut-vien"
            >
              Xem biểu đồ ngày sinh →
            </Link>
          </div>

          <h3 className="ck-tsh-nhom-so-tieu">Ý nghĩa số chủ đạo {ketQua.cach1.so}</h3>
          <KhoiYNghia y={yNghia('so-chu-dao', ketQua.cach1.so)} gon capTieuDe="h4" />
        </section>
      ) : null}

      {/* 3. Cách tính (luôn hiện) */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-scd-cach-tinh">
        <h2 id="ck-tsh-scd-cach-tinh" className="ck-td-tieu">
          Cách tính và ví dụ mẫu ({vietNgay(NGAY_VI_DU)})
        </h2>

        <div className="ck-tsh-hai-cach">
          <div className="ck-tsh-cach-the">
            <div className="ck-tsh-cach-dau">
              <h3>Cách 1 (cộng dồn)</h3>
              <span className="ck-tsh-cach-so">{viDu.cach1.so}</span>
            </div>
            <p className="ck-tsh-phep-cong">{viDu.cach1.phepCong}</p>
            <p className="ck-tsh-buoc-dong">
              Rút gọn: {dinhDangBuoc(viDu.cach1.buoc, SO_MASTER)}
            </p>
          </div>

          <div className="ck-tsh-cach-the">
            <div className="ck-tsh-cach-dau">
              <h3>Cách 2 (rút từng phần)</h3>
              <span className="ck-tsh-cach-so">{viDu.cach2.so}</span>
            </div>
            <ul className="ck-tsh-phan-ds">
              <li>
                Ngày {NGAY_VI_DU.ngay} → {dinhDangBuocPhan(NGAY_VI_DU.ngay)}
              </li>
              <li>
                Tháng {NGAY_VI_DU.thang} → {dinhDangBuocPhan(NGAY_VI_DU.thang)}
              </li>
              <li>
                Năm {NGAY_VI_DU.nam} → {dinhDangBuocPhan(NGAY_VI_DU.nam)}
              </li>
            </ul>
            <p className="ck-tsh-phep-cong">{viDu.cach2.phepCong}</p>
            <p className="ck-tsh-buoc-dong">
              Rút gọn: {dinhDangBuoc(viDu.cach2.buoc, SO_MASTER)}
            </p>
          </div>
        </div>

        <h3 className="ck-tsh-nhom-so-tieu">Quy ước tính toán</h3>
        <div className="ck-tsh-hop-giay">
          <DanhSachQuyUoc />
        </div>
      </section>

      {/* 4. Thanh 12 số & liên kết */}
      <section className="ck-td-muc" aria-labelledby="ck-tsh-scd-thanh">
        <h2 id="ck-tsh-scd-thanh" className="ck-td-tieu">
          12 trang số chủ đạo
        </h2>
        <ThanhSoChuDao />
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/than-so-hoc">Tổng quan Thần số học</Link>
          <Link href="/than-so-hoc/bieu-do-ngay-sinh">Biểu đồ ngày sinh</Link>
          <Link href="/than-so-hoc/theo-ten">Thần số học theo tên</Link>
          {daDung.has('/lich-am/doi-ngay') ? (
            <Link href="/lich-am/doi-ngay">Đổi ngày âm dương</Link>
          ) : null}
        </div>
      </nav>

      <KhoiGioiHan />
    </KhungTrang>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { DanhSachMau, HuyHieuHanh, NguonNapAm } from '@/components/ck/TheCanChi';
import {
  HANH_SLUG,
  duongDanConGiap,
  duongDanHanh,
} from '@/components/ck/canChiHelpers';
import { dinhDangNgayVN } from '@/components/ck/lichHelpers';
import {
  NAM_SINH_DEN,
  NAM_SINH_TU,
  namSinh,
  namSinhHopLe,
  type ThongTinNamSinh,
} from '@/lib/trang/can-chi';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { cungTheoTen } from '@/lib/trang/phong-thuy';
import { canChiNam } from '@/lib/tuvi-v2/am-lich';

export const revalidate = 3600;

function phanTichNamSinh(yyyy: string): number | null {
  if (!/^\d{4}$/.test(yyyy)) return null;
  const nam = Number(yyyy);
  return namSinhHopLe(nam) ? nam : null;
}

function taoThamSo(tt: ThongTinNamSinh) {
  return {
    yyyy: String(tt.nam),
    'Can Chi': tt.canChi,
    'Nạp âm': tt.napAm,
    'Hành': tt.hanh,
    'Tết yyyy': dinhDangNgayVN(tt.tuNgay),
    'Tết yyyy+1': dinhDangNgayVN(tt.denNgay),
  };
}

function macDinhNamSinh(tt: ThongTinNamSinh) {
  return {
    title: `Sinh năm ${tt.nam} mệnh gì? Tuổi ${tt.canChi}, ${tt.napAm}`,
    h1: `Sinh năm ${tt.nam} mệnh gì?`,
  };
}

export function generateStaticParams() {
  const ds: { yyyy: string }[] = [];
  for (let y = NAM_SINH_TU; y <= NAM_SINH_DEN; y++) {
    ds.push({ yyyy: String(y) });
  }
  return ds;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ yyyy: string }>;
}): Promise<Metadata> {
  const { yyyy } = await params;
  const nam = phanTichNamSinh(yyyy);
  if (nam === null) notFound();

  const ttNam = namSinh(nam);
  const duongDan = `/sinh-nam/${nam}`;
  const [meta, nd] = await Promise.all([
    metaTrang(duongDan, macDinhNamSinh(ttNam), '/sinh-nam/{yyyy}', taoThamSo(ttNam)),
    noiDungTheoDuongDan(duongDan),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function SinhNamChiTietPage({
  params,
}: {
  params: Promise<{ yyyy: string }>;
}) {
  const { yyyy } = await params;
  const nam = phanTichNamSinh(yyyy);
  if (nam === null) notFound();

  const ttNam = namSinh(nam);
  const duongDan = `/sinh-nam/${nam}`;
  const [ttTrang, nd] = await Promise.all([
    thongTinTrang(duongDan, macDinhNamSinh(ttNam), '/sinh-nam/{yyyy}', taoThamSo(ttNam)),
    noiDungTheoDuongDan(duongDan),
  ]);
  const daDung = trangDaDung();
  const coLinkCungPhi = daDung.has('/phong-thuy/cung-phi');
  const cungNam = coLinkCungPhi ? cungTheoTen(ttNam.cungPhiNam.ten) : undefined;
  const cungNu = coLinkCungPhi ? cungTheoTen(ttNam.cungPhiNu.ten) : undefined;
  const namHienTai = ngayHienTaiVN().nam;
  const cacNamXemTuoi = [namHienTai, namHienTai + 1, namHienTai + 2];

  const tuNgayVN = dinhDangNgayVN(ttNam.tuNgay);
  const denNgayVN = dinhDangNgayVN(ttNam.denNgay);
  const lapXuanVN = dinhDangNgayVN(ttNam.lapXuan);

  return (
    <KhungTrang
      tieuDe={ttTrang.h1}
      phu={ttTrang.description}
      duongDan={duongDan}
      tenCuoi={`Năm ${nam}`}
      toi
    >
      <section className="ck-tom-tat-menh" aria-label={`Tóm tắt tuổi ${ttNam.canChi} ${nam}`}>
        <div className="ck-luoi-4">
          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Tuổi Can Chi</span>
            <strong className="ck-gia-lon">{ttNam.canChi}</strong>
            <p>
              Tuổi con{' '}
              <Link href={duongDanConGiap(ttNam.chi)}>
                {ttNam.chi} ({ttNam.conGiap})
              </Link>
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Mệnh Nạp Âm</span>
            <strong className="ck-gia-lon">
              <Link href={`/nap-am/${ttNam.slugNapAm}`}>{ttNam.napAm}</Link>
            </strong>
            <p>
              Hành: <HuyHieuHanh hanh={ttNam.hanh} lienKet />
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">Âm dương Can Chi</span>
            <strong className="ck-gia-lon">{ttNam.hoaGiap.amDuong}</strong>
            <p>
              Can {ttNam.can} · Chi {ttNam.chi}
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <span className="ck-nhan-nho">60 Hoa Giáp</span>
            <strong className="ck-gia-lon">Số {ttNam.hoaGiap.stt}/60</strong>
            <p>
              <Link href={`/can-chi/${ttNam.hoaGiap.slug}`}>Xem chi tiết {ttNam.canChi}</Link>
            </p>
          </div>
        </div>

        <div className="ck-ranh-gioi">
          <p>
            <strong>Sinh từ {tuNgayVN} đến {denNgayVN} (dương lịch) thuộc năm {ttNam.canChi}.</strong>{' '}
            Nếu sinh trước ngày {tuNgayVN} (trước Mùng 1 Tết) thì tính theo năm âm lịch trước
            {nam > NAM_SINH_TU ? (
              <>
                {' '}
                (xem <Link href={`/sinh-nam/${nam - 1}`}>sinh năm {nam - 1}</Link>)
              </>
            ) : null}
            .
          </p>
          <p>Theo bát tự, ranh giới năm là Lập xuân {lapXuanVN}.</p>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-sn-ngu-hanh">
        <h2 id="ck-sn-ngu-hanh" className="ck-td-tieu">
          Quan hệ ngũ hành của mệnh {ttNam.hanh}
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang">
            <thead>
              <tr>
                <th>Quan hệ</th>
                <th>Hành tương ứng</th>
                <th>Ý nghĩa quy ước</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>Mệnh bản thân</b>
                </td>
                <td>
                  <HuyHieuHanh hanh={ttNam.quanHe.hanh} lienKet />
                </td>
                <td>Bản mệnh nạp âm {ttNam.napAm}</td>
              </tr>
              <tr>
                <td>
                  <b>Sinh ra</b>
                </td>
                <td>
                  <HuyHieuHanh hanh={ttNam.quanHe.sinhRa} lienKet />
                </td>
                <td>
                  {ttNam.hanh} sinh {ttNam.quanHe.sinhRa}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Được sinh bởi</b>
                </td>
                <td>
                  <HuyHieuHanh hanh={ttNam.quanHe.duocSinhBoi} lienKet />
                </td>
                <td>
                  {ttNam.quanHe.duocSinhBoi} sinh {ttNam.hanh}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Khắc</b>
                </td>
                <td>
                  <HuyHieuHanh hanh={ttNam.quanHe.khac} lienKet />
                </td>
                <td>
                  {ttNam.hanh} khắc {ttNam.quanHe.khac}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Bị khắc bởi</b>
                </td>
                <td>
                  <HuyHieuHanh hanh={ttNam.quanHe.biKhacBoi} lienKet />
                </td>
                <td>
                  {ttNam.quanHe.biKhacBoi} khắc {ttNam.hanh}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-sn-cung-phi">
        <h2 id="ck-sn-cung-phi" className="ck-td-tieu">
          Cung phi Bát trạch năm {nam}
        </h2>
        <div className="ck-luoi-2">
          <div className="ck-the-du-lieu">
            <h3>Nam mạng sinh năm {nam}</h3>
            <strong className="ck-gia-lon">
              {cungNam ? (
                <Link href={`/phong-thuy/cung-phi/${cungNam.slug}`}>
                  Cung {ttNam.cungPhiNam.ten}
                </Link>
              ) : (
                `Cung ${ttNam.cungPhiNam.ten}`
              )}{' '}
              (số {ttNam.cungPhiNam.so})
            </strong>
            <p>
              Hành: <HuyHieuHanh hanh={ttNam.cungPhiNam.hanh} lienKet /> · Nhóm{' '}
              <b>{ttNam.cungPhiNam.nhom}</b>
            </p>
          </div>

          <div className="ck-the-du-lieu">
            <h3>Nữ mạng sinh năm {nam}</h3>
            <strong className="ck-gia-lon">
              {cungNu ? (
                <Link href={`/phong-thuy/cung-phi/${cungNu.slug}`}>
                  Cung {ttNam.cungPhiNu.ten}
                </Link>
              ) : (
                `Cung ${ttNam.cungPhiNu.ten}`
              )}{' '}
              (số {ttNam.cungPhiNu.so})
            </strong>
            <p>
              Hành: <HuyHieuHanh hanh={ttNam.cungPhiNu.hanh} lienKet /> · Nhóm{' '}
              <b>{ttNam.cungPhiNu.nhom}</b>
            </p>
          </div>
        </div>
        {coLinkCungPhi && daDung.has('/phong-thuy/bat-trach') ? (
          <p className="ck-nguon-nho">
            <Link href="/phong-thuy/bat-trach">Bát trạch →</Link>
          </p>
        ) : null}
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-sn-mau-hop">
        <h2 id="ck-sn-mau-hop" className="ck-td-tieu">
          Màu hợp mệnh {ttNam.hanh} ({ttNam.napAm})
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang">
            <thead>
              <tr>
                <th>Nhóm màu</th>
                <th>Màu sắc theo quy ước ngũ sắc</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>Bản mệnh ({ttNam.hanh})</b>
                </td>
                <td>
                  <DanhSachMau mau={ttNam.mau.banMenh} />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Tương sinh ({ttNam.quanHe.duocSinhBoi} sinh)</b>
                </td>
                <td>
                  <DanhSachMau mau={ttNam.mau.tuongSinh} />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Nên tránh ({ttNam.quanHe.biKhacBoi} khắc)</b>
                </td>
                <td>
                  <DanhSachMau mau={ttNam.mau.nenTranh} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="ck-nguon-nho">
          <Link href="/ngu-hanh/mau-hop-menh">Xem bảng màu đầy đủ cả 5 mệnh →</Link>
        </p>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-sn-tuoi-am">
        <h2 id="ck-sn-tuoi-am" className="ck-td-tieu">
          Tuổi âm theo năm ({namHienTai}–{namHienTai + 2})
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang">
            <thead>
              <tr>
                <th>Năm xem</th>
                <th>Can chi của năm</th>
                <th>Tuổi âm (tuổi mụ)</th>
              </tr>
            </thead>
            <tbody>
              {cacNamXemTuoi.map((y) => {
                const tuoi = ttNam.tuoiAm(y);
                return (
                  <tr key={y}>
                    <td>
                      <b>Năm {y}</b>
                    </td>
                    <td>{canChiNam(y).ten}</td>
                    <td>{tuoi > 0 ? `${tuoi} tuổi` : 'Chưa tới năm sinh'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <NguonNapAm />
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe={`Diễn giải tuổi ${ttNam.canChi} (${nam})`} />

      <nav className="ck-dieu-huong" aria-label="Chuyển năm sinh">
        {nam > NAM_SINH_TU ? (
          <Link href={`/sinh-nam/${nam - 1}`} className="ck-nut ck-nut-vien">
            ← Năm {nam - 1} ({canChiNam(nam - 1).ten})
          </Link>
        ) : (
          <span />
        )}
        <Link href="/sinh-nam" className="ck-nut ck-nut-vien">
          Danh sách 1930–2030
        </Link>
        {nam < NAM_SINH_DEN ? (
          <Link href={`/sinh-nam/${nam + 1}`} className="ck-nut ck-nut-vien">
            Năm {nam + 1} ({canChiNam(nam + 1).ten}) →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <nav className="ck-lien-quan" aria-label="Liên kết cùng bộ">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href={`/can-chi/${ttNam.hoaGiap.slug}`}>Hoa giáp {ttNam.canChi}</Link>
          <Link href={`/nap-am/${ttNam.slugNapAm}`}>Nạp âm {ttNam.napAm}</Link>
          <Link href={duongDanHanh(ttNam.hanh)}>Mệnh {ttNam.hanh}</Link>
          <Link href={duongDanConGiap(ttNam.chi)}>
            Tuổi {ttNam.chi} ({ttNam.conGiap})
          </Link>
          <Link href="/ngu-hanh/mau-hop-menh">Màu hợp mệnh</Link>
          {daDung.has('/lich-am') ? (
            <Link href={`/lich-am/${nam}`}>Lịch âm năm {nam}</Link>
          ) : null}
          {daDung.has('/tu-vi/lap-la-so') ? (
            <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          ) : null}
        </div>
      </nav>
    </KhungTrang>
  );
}

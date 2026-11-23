import Link from 'next/link';
import { dinhDangNgayVN, duongDanNgayTuIso } from '@/components/ck/lichHelpers';
import {
  TEN_NHOM_TRUC,
  doanThang,
  type NgayTheoViec,
  type ThangTheoViec,
  type Viec,
} from '@/lib/trang/xem-ngay';
import { TEN_NGHI_KY } from '@/lib/trang/xem-ngay-thuat-ngu';
import { LuoiLichXemNgay } from './LuoiLichXemNgay';
import { NGUON_LUNAR_BAT_BUOC, thangXemNgayHopLe } from './XemNgayHelpers';

export function TomTatViec({ viec }: { viec: Viec }) {
  return (
    <section className="ck-xn-muc" aria-label={`Tóm tắt ${viec.ten}`}>
      <div className="ck-xn-the ck-xn-tom-tat-viec">
        <p className="ck-xn-tom-tat-cau">
          Việc tra cứu: <strong>{viec.ten}</strong>
        </p>

        <div className="ck-xn-muc-loc">
          <div className="ck-xn-muc-loc-hang">
            <span className="ck-xn-muc-loc-nhan">Mục nghi kỵ dùng để lọc:</span>
            <ul className="ck-xn-chip-ds">
              {viec.chinh.map((han) => (
                <li key={han} className="ck-xn-chip ck-xn-chip-chinh">
                  <b>{TEN_NGHI_KY[han] ?? han}</b>{' '}
                  <span lang="zh-Hant">({han})</span>
                </li>
              ))}
            </ul>
          </div>

          {viec.phu.length > 0 ? (
            <div className="ck-xn-muc-loc-hang">
              <span className="ck-xn-muc-loc-nhan">Mục liên quan hiện kèm:</span>
              <ul className="ck-xn-chip-ds">
                {viec.phu.map((han) => (
                  <li key={han} className="ck-xn-chip">
                    {TEN_NGHI_KY[han] ?? han}{' '}
                    <span lang="zh-Hant">({han})</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {viec.ghiChu ? (
          <p className="ck-xn-ghi-chu" role="note">
            {viec.ghiChu}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export interface KhoiViecThangProps {
  duLieu: ThangTheoViec;
  homNayIso: string;
  coLinkLichAm: boolean;
  hienLinkXemCaThang?: boolean;
  hienNgayKhac?: boolean;
  tieuDe?: string;
}

function BangNgayViec({
  danhSach,
  homNayIso,
  coLinkLichAm,
  trucCauCa,
  hienPhuNghi,
}: {
  danhSach: NgayTheoViec[];
  homNayIso: string;
  coLinkLichAm: boolean;
  trucCauCa: number[];
  hienPhuNghi: boolean;
}) {
  return (
    <div className="ck-xn-bang-khung">
      <table className="ck-bang ck-xn-bang ck-xn-bang-viec">
        <thead>
          <tr>
            <th scope="col">Dương lịch</th>
            <th scope="col">Âm lịch</th>
            <th scope="col">Can chi ngày</th>
            <th scope="col">12 trực</th>
            <th scope="col">12 thần</th>
            {hienPhuNghi ? <th scope="col">Mục liên quan (nghi)</th> : null}
          </tr>
        </thead>
        <tbody>
          {danhSach.map((n) => {
            const hrefNgay = coLinkLichAm ? duongDanNgayTuIso(n.iso) : null;
            const laHomNay = n.iso === homNayIso;
            const coCauCa = trucCauCa.includes(n.truc.chiSo) && n.truc.viec;
            return (
              <tr key={n.iso} className={laHomNay ? 'ck-xn-hom-nay' : undefined}>
                <td data-nhan="Dương lịch" className="ck-xn-cot-duong">
                  <div className="ck-xn-duong-nhom">
                    <span className="ck-xn-thu">
                      {n.thu}
                      {laHomNay ? (
                        <span className="ck-xn-nhan ck-xn-nhan-hn">Hôm nay</span>
                      ) : null}
                    </span>
                    {hrefNgay ? (
                      <Link href={hrefNgay}>{dinhDangNgayVN(n.iso)}</Link>
                    ) : (
                      <span>{dinhDangNgayVN(n.iso)}</span>
                    )}
                  </div>
                </td>
                <td data-nhan="Âm lịch" className="ck-xn-cot-am">
                  {n.am}
                </td>
                <td data-nhan="Can chi ngày" className="ck-xn-cot-canchi">
                  {n.canChiNgay}
                </td>
                <td data-nhan="12 trực" className="ck-xn-cot-he">
                  <div className="ck-xn-he-nhom">
                    <strong>Trực {n.truc.ten}</strong>
                    <span className={`ck-xn-nhan ck-xn-truc-${n.truc.nhom}`}>
                      {TEN_NHOM_TRUC[n.truc.nhom]}
                    </span>
                    {coCauCa ? (
                      <span className="ck-xn-nhan-ca">
                        Trực {n.truc.ten}: câu ca ghi {n.truc.viec}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td data-nhan="12 thần" className="ck-xn-cot-he">
                  <div className="ck-xn-he-nhom">
                    <strong>{n.than.ten}</strong>
                    <span
                      className={`ck-xn-nhan ${
                        n.than.hoangDao ? 'ck-xn-hoang' : 'ck-xn-hac'
                      }`}
                    >
                      {n.than.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'}
                    </span>
                  </div>
                </td>
                {hienPhuNghi ? (
                  <td data-nhan="Mục liên quan" className="ck-xn-cot-phu">
                    {n.phuNghi.length > 0
                      ? n.phuNghi.map((m) => m.ten).join(', ')
                      : '—'}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function KhoiViecThang({
  duLieu,
  homNayIso,
  coLinkLichAm,
  hienLinkXemCaThang = false,
  hienNgayKhac = false,
  tieuDe,
}: KhoiViecThangProps) {
  const tenThuong = duLieu.viec.ten.toLowerCase();
  const khac = hienNgayKhac ? duLieu.ngay.filter((n) => n.ket === 'khac') : [];
  const coTrangThang = thangXemNgayHopLe(duLieu.nam, duLieu.thang);

  return (
    <article className="ck-xn-khoi-thang">
      <div className="ck-xn-khoi-dau">
        <div>
          <h3>{tieuDe ?? `Tháng ${duLieu.thang}/${duLieu.nam}`}</h3>
          <p className="ck-xn-dem">
            {duLieu.hop.length} ngày ghi nghi · {duLieu.ky.length} ngày ghi kỵ
          </p>
        </div>
        {hienLinkXemCaThang && coTrangThang ? (
          <Link
            href={`/xem-ngay/${duLieu.viec.ma}/${doanThang(duLieu.nam, duLieu.thang)}`}
            className="ck-nut ck-nut-vien ck-xn-nut-44"
          >
            Xem cả tháng {duLieu.thang}/{duLieu.nam}
          </Link>
        ) : null}
      </div>

      <LuoiLichXemNgay
        cheDo="viec"
        nam={duLieu.nam}
        thang={duLieu.thang}
        ngayViec={duLieu.ngay}
        homNayIso={homNayIso}
        coLinkLichAm={coLinkLichAm}
      />

      <details className="ck-xn-chi-tiet">
        <summary>
          Xem dạng bảng ({duLieu.hop.length} ngày nên · {duLieu.ky.length} ngày kỵ)
        </summary>

        <div className="ck-xn-bang-nhom">
          <h4 className="ck-xn-bang-nhom-tieu">
            Bảng ghi nên {tenThuong} ({duLieu.hop.length} ngày)
          </h4>
          {duLieu.hop.length === 0 ? (
            <p className="ck-xn-trong">
              Tháng này bảng nghi kỵ không có ngày nào ghi nghi {tenThuong}.
            </p>
          ) : (
            <BangNgayViec
              danhSach={duLieu.hop}
              homNayIso={homNayIso}
              coLinkLichAm={coLinkLichAm}
              trucCauCa={duLieu.viec.trucCauCa}
              hienPhuNghi
            />
          )}

          <h4 className="ck-xn-bang-nhom-tieu">
            Bảng ghi kỵ {tenThuong} ({duLieu.ky.length} ngày)
          </h4>
          {duLieu.ky.length === 0 ? (
            <p className="ck-xn-trong">Không có ngày nào ghi kỵ trong tháng này.</p>
          ) : (
            <BangNgayViec
              danhSach={duLieu.ky}
              homNayIso={homNayIso}
              coLinkLichAm={coLinkLichAm}
              trucCauCa={duLieu.viec.trucCauCa}
              hienPhuNghi={false}
            />
          )}

          {hienNgayKhac ? (
            <>
              <h4 className="ck-xn-bang-nhom-tieu">
                Các ngày khác không ghi nghi hoặc kỵ ({khac.length} ngày)
              </h4>
              {khac.length === 0 ? (
                <p className="ck-xn-trong">Không có ngày nào thuộc nhóm này.</p>
              ) : (
                <BangNgayViec
                  danhSach={khac}
                  homNayIso={homNayIso}
                  coLinkLichAm={coLinkLichAm}
                  trucCauCa={duLieu.viec.trucCauCa}
                  hienPhuNghi
                />
              )}
            </>
          ) : null}
        </div>
      </details>

      <p className="ck-xn-nguon-dong">{NGUON_LUNAR_BAT_BUOC}</p>
    </article>
  );
}

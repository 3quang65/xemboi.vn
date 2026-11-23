import Link from 'next/link';
import {
  NHAN_THU_NGAN,
  TEN_THU_DAY_DU,
  dinhDangNgayVN,
  duongDanNgayTuIso,
  hai,
} from '@/components/ck/lichHelpers';
import { thangLich } from '@/lib/trang/lich';
import {
  TEN_NHOM_TRUC,
  type NgayTheoViec,
  type NgayXem,
} from '@/lib/trang/xem-ngay';

export type LuoiLichXemNgayProps =
  | {
      cheDo: 'tong-hop';
      nam: number;
      thang: number;
      ngayXem: NgayXem[];
      homNayIso: string;
      coLinkLichAm: boolean;
    }
  | {
      cheDo: 'viec';
      nam: number;
      thang: number;
      ngayViec: NgayTheoViec[];
      homNayIso: string;
      coLinkLichAm: boolean;
    };

export function LuoiLichXemNgay(props: LuoiLichXemNgayProps) {
  const { nam, thang, homNayIso, coLinkLichAm } = props;
  const luoi = thangLich(nam, thang);
  const hang = luoi.hang.filter((dong) => dong.some((o) => o.trongThang));

  const mapTongHop =
    props.cheDo === 'tong-hop'
      ? new Map(props.ngayXem.map((n) => [n.iso, n]))
      : null;
  const mapViec =
    props.cheDo === 'viec'
      ? new Map(props.ngayViec.map((n) => [n.iso, n]))
      : null;

  return (
    <div className="ck-xn-lc-khung">
      <div className="ck-xn-lc-dau">
        <p className="ck-xn-lc-thang-am">{luoi.thangAm.join(' · ')}</p>
      </div>

      <div
        className="ck-xn-lc-bang"
        role="grid"
        aria-label={`Lịch xem ngày tháng ${thang}/${nam}`}
      >
        <div className="ck-xn-lc-thu-hang" role="row">
          {NHAN_THU_NGAN.map((thu, idx) => (
            <div
              key={thu}
              role="columnheader"
              aria-label={TEN_THU_DAY_DU[idx]}
              className={`ck-xn-lc-thu${idx === 6 ? ' ck-xn-lc-cn' : ''}`}
            >
              <span className="ck-xn-lc-thu-ngan">{thu}</span>
              <span className="ck-xn-lc-thu-dai">{TEN_THU_DAY_DU[idx]}</span>
            </div>
          ))}
        </div>

        <div className="ck-xn-lc-luoi">
          {hang.flatMap((dong) =>
            dong.map((o, idx) => {
              const laChuNhat = idx === 6;
              const laHomNay = o.iso === homNayIso;
              const chuAm =
                o.am.ngay === 1
                  ? `${o.am.ngay}/${o.am.thang}${o.am.nhuan ? 'N' : ''}`
                  : String(o.am.ngay);
              const laNhanAm = o.am.ngay === 1 || o.am.ngay === 15;

              if (!o.trongThang) {
                return (
                  <div
                    key={o.iso}
                    className={`ck-xn-lc-o ck-xn-lc-ngoai${laChuNhat ? ' ck-xn-lc-cn' : ''}`}
                    aria-hidden="true"
                  >
                    <span className="ck-xn-lc-tren">
                      <span className="ck-xn-lc-duong">{o.duong.ngay}</span>
                    </span>
                    <span className="ck-xn-lc-am">{chuAm}</span>
                  </div>
                );
              }

              const href = coLinkLichAm ? duongDanNgayTuIso(o.iso) : null;
              let thanHoangDao = false;
              let tenTruc = '';
              let trangThaiLop = '';
              let moTa = '';

              if (mapTongHop) {
                const xn = mapTongHop.get(o.iso);
                if (xn) {
                  thanHoangDao = xn.than.hoangDao;
                  tenTruc = xn.truc.ten;
                  moTa = [
                    `${hai(o.duong.ngay)}/${hai(o.duong.thang)}/${o.duong.nam}`,
                    `Âm ${o.am.ngay}/${o.am.thang}${o.am.nhuan ? ' nhuận' : ''}`,
                    `${xn.than.ten} (${xn.than.hoangDao ? 'hoàng đạo' : 'hắc đạo'})`,
                    `Trực ${xn.truc.ten}`,
                  ].join(' · ');
                }
              } else if (mapViec) {
                const nv = mapViec.get(o.iso);
                if (nv) {
                  thanHoangDao = nv.than.hoangDao;
                  tenTruc = nv.truc.ten;
                  trangThaiLop =
                    nv.ket === 'hop'
                      ? 'ck-xn-lc-hop'
                      : nv.ket === 'ky'
                        ? 'ck-xn-lc-ky'
                        : 'ck-xn-lc-khac';
                  const nhanKet =
                    nv.ket === 'hop'
                      ? 'Bảng ghi nên'
                      : nv.ket === 'ky'
                        ? 'Bảng ghi kỵ'
                        : 'Không nhắc';
                  moTa = [
                    `${hai(o.duong.ngay)}/${hai(o.duong.thang)}/${o.duong.nam}`,
                    `Âm ${nv.am}`,
                    nhanKet,
                    `${nv.than.ten} (${nv.than.hoangDao ? 'hoàng đạo' : 'hắc đạo'})`,
                    `Trực ${nv.truc.ten}`,
                  ].join(' · ');
                }
              }

              const lop = [
                'ck-xn-lc-o',
                trangThaiLop,
                laChuNhat ? 'ck-xn-lc-cn' : '',
                laHomNay ? 'ck-xn-lc-nay' : '',
              ]
                .filter(Boolean)
                .join(' ');

              const noiDung = (
                <>
                  <span className="ck-xn-lc-tren">
                    <span className="ck-xn-lc-duong">{o.duong.ngay}</span>
                    {thanHoangDao ? (
                      <i className="ck-xn-lc-cham" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span
                    className={`ck-xn-lc-am${laNhanAm ? ' ck-xn-lc-am-nhan' : ''}`}
                  >
                    {chuAm}
                  </span>
                  {tenTruc ? (
                    <span className="ck-xn-lc-truc">{tenTruc}</span>
                  ) : null}
                </>
              );

              if (href) {
                return (
                  <Link
                    key={o.iso}
                    href={href}
                    className={lop}
                    title={moTa}
                    aria-label={moTa}
                    aria-current={laHomNay ? 'date' : undefined}
                  >
                    {noiDung}
                  </Link>
                );
              }

              return (
                <div
                  key={o.iso}
                  className={lop}
                  title={moTa}
                  aria-label={moTa}
                >
                  {noiDung}
                </div>
              );
            }),
          )}
        </div>
      </div>

      <ul className="ck-xn-lc-cg" aria-label="Chú giải lịch tháng">
        {props.cheDo === 'viec' ? (
          <>
            <li>
              <span className="ck-xn-lc-mau ck-xn-lc-mau-hop" aria-hidden="true" />
              Bảng ghi nên (hợp)
            </li>
            <li>
              <span className="ck-xn-lc-mau ck-xn-lc-mau-ky" aria-hidden="true" />
              Bảng ghi kỵ
            </li>
            <li>
              <span className="ck-xn-lc-mau ck-xn-lc-mau-khac" aria-hidden="true" />
              Không nhắc
            </li>
          </>
        ) : null}
        <li>
          <span className="ck-xn-lc-cham" aria-hidden="true" />
          Thần hoàng đạo
        </li>
        <li>
          <span className="ck-xn-lc-mau ck-xn-lc-mau-nay" aria-hidden="true" />
          Hôm nay
        </li>
        <li>
          <span className="ck-xn-lc-mau-cn" aria-hidden="true">
            CN
          </span>
          Chủ nhật
        </li>
      </ul>
    </div>
  );
}

export function BangThangTongHop({
  dsNgay,
  homNayIso,
  coLinkLichAm,
}: {
  dsNgay: NgayXem[];
  homNayIso: string;
  coLinkLichAm: boolean;
}) {
  return (
    <div className="ck-xn-bang-khung">
      <table className="ck-bang ck-xn-bang ck-xn-bang-thang">
        <thead>
          <tr>
            <th scope="col">Ngày dương</th>
            <th scope="col">Âm lịch</th>
            <th scope="col">Can chi</th>
            <th scope="col">12 thần</th>
            <th scope="col">12 trực</th>
            <th scope="col">Nghi (5 mục đầu)</th>
            <th scope="col">Kỵ (5 mục đầu)</th>
          </tr>
        </thead>
        <tbody>
          {dsNgay.map((x) => {
            const hrefNgay = coLinkLichAm ? duongDanNgayTuIso(x.iso) : null;
            const laHomNay = x.iso === homNayIso;
            const nghiDau = x.nghi.slice(0, 5);
            const kyDau = x.ky.slice(0, 5);
            return (
              <tr
                key={x.iso}
                className={laHomNay ? 'ck-xn-hom-nay' : undefined}
              >
                <td data-nhan="Ngày dương" className="ck-xn-cot-duong">
                  <div className="ck-xn-duong-nhom">
                    <span className="ck-xn-thu">
                      {x.lich.thu}
                      {laHomNay ? (
                        <span className="ck-xn-nhan ck-xn-nhan-hn">Hôm nay</span>
                      ) : null}
                    </span>
                    {hrefNgay ? (
                      <Link href={hrefNgay}>{dinhDangNgayVN(x.iso)}</Link>
                    ) : (
                      <span>{dinhDangNgayVN(x.iso)}</span>
                    )}
                  </div>
                </td>
                <td data-nhan="Âm lịch" className="ck-xn-cot-am">
                  {x.lich.am.ngay}/{x.lich.am.thang}
                  {x.lich.am.nhuan ? ' nhuận' : ''}
                </td>
                <td data-nhan="Can chi" className="ck-xn-cot-canchi">
                  <div className="ck-xn-canchi-nhom">
                    <strong>{x.lich.canChiNgay.ten}</strong>
                    <span className="ck-xn-thang-tiet">
                      Tháng {x.thangTiet.canChi.ten} (tiết khí)
                    </span>
                  </div>
                </td>
                <td data-nhan="12 thần" className="ck-xn-cot-he">
                  <div className="ck-xn-he-nhom">
                    <strong>{x.than.ten}</strong>
                    <span
                      className={`ck-xn-nhan ${
                        x.than.hoangDao ? 'ck-xn-hoang' : 'ck-xn-hac'
                      }`}
                    >
                      {x.than.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'}
                    </span>
                  </div>
                </td>
                <td data-nhan="12 trực" className="ck-xn-cot-he">
                  <div className="ck-xn-he-nhom">
                    <strong>Trực {x.truc.ten}</strong>
                    <span className={`ck-xn-nhan ck-xn-truc-${x.truc.nhom}`}>
                      {TEN_NHOM_TRUC[x.truc.nhom]}
                    </span>
                  </div>
                </td>
                <td data-nhan="Nghi" className="ck-xn-cot-muc">
                  {nghiDau.length > 0 ? (
                    <>
                      {nghiDau.map((m) => m.ten).join(', ')}
                      {x.nghi.length > 5 ? ` (+${x.nghi.length - 5})` : ''}
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                <td data-nhan="Kỵ" className="ck-xn-cot-muc">
                  {kyDau.length > 0 ? (
                    <>
                      {kyDau.map((m) => m.ten).join(', ')}
                      {x.ky.length > 5 ? ` (+${x.ky.length - 5})` : ''}
                    </>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

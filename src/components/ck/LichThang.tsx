import Link from 'next/link';
import type { LuoiThang } from '@/lib/trang/lich';
import {
  NHAN_THU_NGAN,
  TEN_THU_DAY_DU,
  duongDanNgay,
  duongDanThang,
  hai,
  trongPhamViNam,
} from './lichHelpers';

export interface LichThangProps {
  luoi: LuoiThang;
  hienDieuHuong?: boolean;
}

export default function LichThang({ luoi, hienDieuHuong = false }: LichThangProps) {
  const coTruoc = trongPhamViNam(luoi.thangTruoc.nam);
  const coSau = trongPhamViNam(luoi.thangSau.nam);
  const tatCaO = luoi.hang.flat();

  return (
    <section className="ck-lt-khung" aria-label={luoi.tieuDe}>
      <div className="ck-lt-dau">
        {hienDieuHuong ? (
          <div className="ck-lt-dieu-huong">
            {coTruoc ? (
              <Link
                href={duongDanThang(luoi.thangTruoc.nam, luoi.thangTruoc.thang)}
                className="ck-nut ck-nut-vien ck-lt-nut"
              >
                ← Tháng {luoi.thangTruoc.thang}/{luoi.thangTruoc.nam}
              </Link>
            ) : (
              <span className="ck-lt-nut-tat" aria-disabled="true">
                ← Ngoài phạm vi
              </span>
            )}
          </div>
        ) : null}

        <div className="ck-lt-tieu-de">
          <h2>{luoi.tieuDe}</h2>
          <p className="ck-lt-phu">
            {luoi.thangAm.join(' · ')}
            {trongPhamViNam(luoi.nam) ? (
              <>
                {' · '}
                <Link href={`/lich-am/${luoi.nam}`}>Xem cả năm {luoi.nam}</Link>
              </>
            ) : null}
          </p>
        </div>

        {hienDieuHuong ? (
          <div className="ck-lt-dieu-huong ck-lt-phai">
            {coSau ? (
              <Link
                href={duongDanThang(luoi.thangSau.nam, luoi.thangSau.thang)}
                className="ck-nut ck-nut-vien ck-lt-nut"
              >
                Tháng {luoi.thangSau.thang}/{luoi.thangSau.nam} →
              </Link>
            ) : (
              <span className="ck-lt-nut-tat" aria-disabled="true">
                Ngoài phạm vi →
              </span>
            )}
          </div>
        ) : null}
      </div>

      <div className="ck-lt-bang" role="grid" aria-label={`Lịch ${luoi.tieuDe}`}>
        <div className="ck-lt-thu-hang" role="row">
          {NHAN_THU_NGAN.map((thu, idx) => (
            <div
              key={thu}
              role="columnheader"
              aria-label={TEN_THU_DAY_DU[idx]}
              className={`ck-lt-thu${idx === 6 ? ' ck-lt-cn' : ''}`}
            >
              <span className="ck-lt-thu-ngan">{thu}</span>
              <span className="ck-lt-thu-dai">{TEN_THU_DAY_DU[idx]}</span>
            </div>
          ))}
        </div>

        <div className="ck-lt-luoi">
          {tatCaO.map((o, idx) => {
            const cot = idx % 7;
            const laChuNhat = cot === 6;
            const laNhanAm = o.am.ngay === 1 || o.am.ngay === 15;
            const leDatTen = o.ngayLe.filter((l) => l.ten !== 'Mùng 1' && l.ten !== 'Ngày rằm');
            const coLe = leDatTen.length > 0;
            const tooltip = [
              `${hai(o.duong.ngay)}/${hai(o.duong.thang)}/${o.duong.nam}`,
              `Âm ${o.am.ngay}/${o.am.thang}${o.am.nhuan ? 'N' : ''}`,
              `Ngày ${o.canChiNgay}`,
              ...o.ngayLe.map((l) => l.ten),
            ].join(' · ');

            const lop = [
              'ck-lt-o',
              !o.trongThang ? 'ck-lt-ngoai' : '',
              o.laHomNay ? 'ck-lt-nay' : '',
              laChuNhat ? 'ck-lt-cn' : '',
              coLe ? 'ck-lt-co-le' : '',
            ]
              .filter(Boolean)
              .join(' ');

            const noiDung = (
              <>
                <span className="ck-lt-tren">
                  <span className="ck-lt-duong">{o.duong.ngay}</span>
                  {coLe ? <i className="ck-lt-cham" aria-hidden="true" /> : null}
                </span>
                <span className={`ck-lt-am${laNhanAm ? ' ck-lt-am-nhan' : ''}`}>{o.nhanAm}</span>
                {coLe ? <span className="ck-lt-le-ten">{leDatTen[0].ten}</span> : null}
              </>
            );

            if (!trongPhamViNam(o.duong.nam)) {
              return (
                <div key={o.iso} className={lop} title={tooltip} aria-label={tooltip}>
                  {noiDung}
                </div>
              );
            }

            return (
              <Link
                key={o.iso}
                href={duongDanNgay(o.duong.nam, o.duong.thang, o.duong.ngay)}
                className={lop}
                title={tooltip}
                aria-label={tooltip}
                aria-current={o.laHomNay ? 'date' : undefined}
              >
                {noiDung}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="ck-lt-chu-thich">
        <span>
          <i className="ck-lt-mau-nay" aria-hidden="true" /> Hôm nay
        </span>
        <span>
          <i className="ck-lt-mau-nhan" aria-hidden="true" /> Mùng 1 &amp; ngày rằm
        </span>
        <span>
          <i className="ck-lt-mau-le" aria-hidden="true" /> Ngày lễ (rê chuột xem tên)
        </span>
      </div>
    </section>
  );
}

export function LichThangThuNho({ luoi }: { luoi: LuoiThang }) {
  const tatCaO = luoi.hang.flat();
  return (
    <Link href={duongDanThang(luoi.nam, luoi.thang)} className="ck-lt-mini">
      <div className="ck-lt-mini-dau">
        <h3>Tháng {luoi.thang}</h3>
        <span>{luoi.nam}</span>
      </div>
      <div className="ck-lt-mini-thu" aria-hidden="true">
        {NHAN_THU_NGAN.map((t, idx) => (
          <span key={t} className={idx === 6 ? 'ck-lt-cn' : undefined}>
            {t}
          </span>
        ))}
      </div>
      <div className="ck-lt-mini-luoi">
        {tatCaO.map((o) => {
          const laNhanAm = o.am.ngay === 1 || o.am.ngay === 15;
          const coLe = o.ngayLe.some((l) => l.ten !== 'Mùng 1' && l.ten !== 'Ngày rằm');
          const lop = [
            'ck-lt-mini-o',
            !o.trongThang ? 'ck-lt-ngoai' : '',
            o.laHomNay ? 'ck-lt-nay' : '',
            laNhanAm ? 'ck-lt-am-nhan' : '',
            coLe ? 'ck-lt-co-le' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <span key={o.iso} className={lop}>
              <b>{o.duong.ngay}</b>
              <small>{o.am.ngay === 1 ? `1/${o.am.thang}` : o.am.ngay}</small>
            </span>
          );
        })}
      </div>
    </Link>
  );
}

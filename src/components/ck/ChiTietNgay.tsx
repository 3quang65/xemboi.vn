import type { ChiTietNgay as ChiTietNgayData } from '@/lib/trang/lich';
import { dinhDangNgayThangVN, hai, nhanNgayAmChu } from './lichHelpers';

export interface ChiTietNgayProps {
  ngay: ChiTietNgayData;
  toi?: boolean;
}

export default function ChiTietNgay({ ngay, toi = false }: ChiTietNgayProps) {
  const {
    duong,
    am,
    thu,
    canChiNgay,
    canChiThang,
    canChiNam,
    conGiapNam,
    napAmNgay,
    hanhNgay,
    tenThangAm,
    soNgayThangAm,
    tietKhi,
    gio,
    ngayLe,
  } = ngay;

  const amDayDu = `${nhanNgayAmChu(am.ngay)} ${tenThangAm} năm ${canChiNam.ten}`;

  return (
    <div className={`ck-lich-luoi${toi ? ' ck-ct-toi' : ''}`}>
      <aside className="ck-bloc" aria-label={`Tờ lịch ngày ${hai(duong.ngay)}/${hai(duong.thang)}/${duong.nam}`}>
        <div className="ck-bloc-gay" aria-hidden="true">
          <i />
          <i />
        </div>
        <div className="ck-bloc-to">
          <div className="ck-bloc-dau">
            <span>Tháng {duong.thang}</span>
            <span>{duong.nam}</span>
          </div>
          <div className="ck-bloc-ngay">{duong.ngay}</div>
          <div className="ck-bloc-thu">{thu}</div>
          {ngayLe.length > 0 && (
            <div className="ck-bloc-le">{ngayLe.map((le) => le.ten).join(' · ')}</div>
          )}
          <div className="ck-bloc-am">
            <div>
              <small>Âm lịch</small>
              <b className="ck-bloc-so-am">{am.ngay}</b>
              <span className="ck-bloc-th-am">{tenThangAm}</span>
              <span className="ck-bloc-nam-am">
                {canChiNam.ten} ({soNgayThangAm} ngày)
              </span>
            </div>
            <div>
              <small>Can chi</small>
              <ul>
                <li>
                  Ngày <b>{canChiNgay.ten}</b>
                </li>
                <li>
                  Tháng <b>{canChiThang.ten}</b>
                </li>
                <li>
                  Năm <b>{canChiNam.ten}</b>
                </li>
                <li>
                  Tiết <b>{tietKhi.ten}</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      <div className="ck-lich-chi-tiet">
        <h2>
          {thu}, ngày {hai(duong.ngay)}/{hai(duong.thang)}/{duong.nam} — {amDayDu}
        </h2>

        {ngayLe.length > 0 && (
          <ul className="ck-le-ds" aria-label="Ngày lễ và mốc lịch">
            {ngayLe.map((le) => (
              <li key={`${le.loai}-${le.ten}`} className={`ck-le-the ck-le-${le.loai}`}>
                <span>{le.loai === 'am' ? 'Âm lịch' : 'Dương lịch'}</span>
                <b>{le.ten}</b>
              </li>
            ))}
          </ul>
        )}

        <dl className="ck-lich-thong-tin">
          <div>
            <dt>Âm lịch</dt>
            <dd>
              {nhanNgayAmChu(am.ngay, true)} {tenThangAm} năm {canChiNam.ten} (tuổi {conGiapNam})
            </dd>
          </div>
          <div>
            <dt>Can chi ngày / tháng / năm</dt>
            <dd>
              {canChiNgay.ten} · {canChiThang.ten} · {canChiNam.ten}
            </dd>
          </div>
          <div>
            <dt>Nạp âm ngày</dt>
            <dd>
              {napAmNgay} (hành {hanhNgay})
            </dd>
          </div>
          <div>
            <dt>Tiết khí</dt>
            <dd>
              {tietKhi.ten}{' '}
              {tietKhi.batDauHomNay
                ? '(bắt đầu hôm nay)'
                : `(từ ${dinhDangNgayThangVN(tietKhi.batDau)} đến ${dinhDangNgayThangVN(tietKhi.ketThuc)})`}
            </dd>
          </div>
        </dl>

        <div className="ck-gio-khung">
          <div className="ck-gio-dau">
            <strong>12 giờ trong ngày</strong>
            <span>6 giờ Hoàng đạo được tô nổi bật</span>
          </div>
          <ul className="ck-gio-12">
            {gio.map((g) => (
              <li key={g.chi} className={`ck-gio-o${g.hoangDao ? ' ck-gio-hd' : ''}`}>
                <div className="ck-gio-ten">
                  <b>Giờ {g.chi}</b>
                  <span className="ck-gio-nhan">{g.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'}</span>
                </div>
                <div className="ck-gio-khung-gio">{g.khung}</div>
                <div className="ck-gio-cc">{g.canChi}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

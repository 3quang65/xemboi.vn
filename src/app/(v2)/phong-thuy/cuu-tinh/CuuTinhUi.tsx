import React from 'react';
import Link from 'next/link';
import {
  GHI_CHU_BON_SAO,
  GHI_CHU_MOC,
  NAM_TRANG_CUU_TINH,
  cungCuaSao,
  duongDanCuuTinh,
  saoSo,
  type BanCuuTinh,
  type NamCuuTinh,
} from '@/lib/trang/cuu-tinh';
import {
  BON_SAO_HIEP_KY,
  THU_TU_LUOI_LAC_THU,
  dinhDangNgayGioVN,
  lopMauSao,
  tenThangTiet,
  tenViTriCung,
} from './CuuTinhHelpers';

/** Lưới cửu cung 3×3 đặt Nam ở trên theo Lạc thư. */
export function BangCuuCung({
  ban,
  nho = false,
  hienChuThich = !nho,
}: {
  ban: BanCuuTinh;
  nho?: boolean;
  hienChuThich?: boolean;
}) {
  return (
    <div className={`ck-pt-ct-ban-khung${nho ? ' ck-pt-ct-ban-nho' : ''}`}>
      {hienChuThich ? (
        <p className="ck-pt-ct-huong-chu">
          Nam ở trên, theo cách vẽ Lạc thư trong sách cổ.
        </p>
      ) : null}
      <div
        className="ck-pt-ct-luoi"
        role="group"
        aria-label={`Bàn cửu tinh trung cung ${saoSo(ban.trung).ten}`}
      >
        {THU_TU_LUOI_LAC_THU.map((soLacThu) => {
          const o = ban.cung.find((c) => c.soLacThu === soLacThu)!;
          const laTrung = o.soLacThu === 5;
          const tenPhuong = laTrung ? 'Trung cung' : o.phuong;
          return (
            <div
              key={soLacThu}
              className={`ck-pt-ct-o ${lopMauSao(o.sao.so)}${laTrung ? ' ck-pt-ct-o-trung' : ''}`}
            >
              <span className="ck-pt-ct-o-phuong">
                {tenPhuong}
                {!nho ? (
                  <small className="ck-pt-ct-o-cung">
                    {' '}
                    ({laTrung ? o.phuong : o.ten})
                  </small>
                ) : null}
              </span>
              <div className="ck-pt-ct-o-sao">
                <span className="ck-pt-ct-sao-so">{o.sao.so}</span>
                <strong className="ck-pt-ct-sao-ten">{o.sao.ten}</strong>
              </div>
              <span lang="zh-Hant" className="ck-pt-ct-sao-han">
                {o.sao.han}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Khối năm: tiêu đề sao trung cung, mốc tiết khí, bàn năm, tra nhanh Ngũ hoàng / Nhị hắc và 4 sao Hiệp kỷ. */
export function KhoiCuuTinhNam({
  data,
  hienLienKetTrangNam = false,
}: {
  data: NamCuuTinh;
  hienLienKetTrangNam?: boolean;
}) {
  const saoTrung = saoSo(data.ban.trung);
  const nguHoang = cungCuaSao(data.ban, 5);
  const nhiHac = cungCuaSao(data.ban, 2);

  return (
    <section className="ck-td-muc" aria-labelledby="ck-pt-ct-nam-tieu">
      <div className="ck-pt-ct-nam-dau">
        <h2 id="ck-pt-ct-nam-tieu" className="ck-td-tieu">
          Năm {data.canChi} ({data.nam}), {data.nguyen}: {saoTrung.ten} vào trung cung.
        </h2>
        <p className="ck-pt-ct-moc-nam">
          Từ <strong>{dinhDangNgayGioVN(data.batDau)}</strong> đến{' '}
          <strong>{dinhDangNgayGioVN(data.ketThuc)}</strong> (giờ Việt Nam, UTC+7).
        </p>
        <p className="ck-pt-ct-ghi-moc">{GHI_CHU_MOC}</p>
        {hienLienKetTrangNam && NAM_TRANG_CUU_TINH.includes(data.nam) ? (
          <p className="ck-pt-ct-trang-rieng-link">
            <Link href={duongDanCuuTinh(data.nam)}>
              Mở trang riêng Cửu tinh năm {data.nam} →
            </Link>
          </p>
        ) : null}
      </div>

      <BangCuuCung ban={data.ban} />

      <div className="ck-pt-ct-tra-nhanh">
        <p className="ck-pt-ct-tra-dong">
          Ngũ hoàng ở <strong>{tenViTriCung(nguHoang)}</strong>. Nhị hắc ở{' '}
          <strong>{tenViTriCung(nhiHac)}</strong>.
        </p>
        <p className="ck-pt-ct-bon-sao-chu">{GHI_CHU_BON_SAO}</p>
        <ul className="ck-pt-ct-bon-sao-ds">
          {BON_SAO_HIEP_KY.map((so) => {
            const c = cungCuaSao(data.ban, so);
            const sao = saoSo(so);
            return (
              <li key={so} className="ck-pt-ct-bon-sao-o">
                <span className="ck-pt-ct-bon-sao-ten">
                  <i
                    className={`ck-pt-ct-cham ${lopMauSao(so)}`}
                    aria-hidden="true"
                  />
                  <b>
                    {sao.so} {sao.ten}
                  </b>
                </span>
                <span className="ck-pt-ct-bon-sao-vi">
                  {tenViTriCung(c)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Khối 12 tháng tiết của năm, làm nổi tháng đang hiệu lực (nếu trùng năm hiện tại). */
export function KhoiCuuTinhThang({
  data,
  thangHienTai,
}: {
  data: NamCuuTinh;
  thangHienTai?: number;
}) {
  return (
    <section className="ck-td-muc" aria-labelledby="ck-pt-ct-thang-tieu">
      <h2 id="ck-pt-ct-thang-tieu" className="ck-td-tieu">
        12 tháng tiết năm {data.nam} ({data.canChi})
      </h2>
      <p className="ck-pt-ct-huong-chu ck-pt-ct-huong-trai">
        Nam ở trên, theo cách vẽ Lạc thư trong sách cổ. Giờ đổi tiết tính theo giờ Việt Nam (UTC+7).
      </p>
      <div className="ck-pt-ct-thang-luoi">
        {data.thang.map((t) => {
          const saoTrung = saoSo(t.ban.trung);
          const laHienTai = thangHienTai === t.thang;
          return (
            <article
              key={t.thang}
              className={`ck-pt-ct-thang-the${laHienTai ? ' ck-pt-ct-thang-hien-tai' : ''}`}
              aria-current={laHienTai ? 'date' : undefined}
            >
              <div className="ck-pt-ct-thang-dau">
                <h3>
                  {tenThangTiet(t.thang)} ({t.chi})
                </h3>
                {laHienTai ? (
                  <span className="ck-pt-ct-nhan-hien-tai">Đang hiệu lực</span>
                ) : null}
              </div>
              <p className="ck-pt-ct-thang-moc">
                Tiết <b>{t.tiet}</b> · từ {dinhDangNgayGioVN(t.batDau)}
              </p>
              <p className="ck-pt-ct-thang-trung">
                Trung cung:{' '}
                <b>
                  {saoTrung.so} {saoTrung.ten}
                </b>{' '}
                <span lang="zh-Hant" className="ck-pt-han-inline">
                  {saoTrung.han}
                </span>
              </p>
              <BangCuuCung ban={t.ban} nho hienChuThich={false} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

/** Danh sách liên kết 16 trang năm có sẵn (2020–2035). */
export function DanhSachNamCuuTinh({ namHienTai }: { namHienTai?: number }) {
  return (
    <section className="ck-td-muc" aria-labelledby="ck-pt-ct-ds-nam-tieu">
      <h2 id="ck-pt-ct-ds-nam-tieu" className="ck-td-tieu">
        Cửu tinh theo từng năm (2020–2035)
      </h2>
      <div className="ck-nam-ds">
        {NAM_TRANG_CUU_TINH.map((y) =>
          y === namHienTai ? (
            <span
              key={y}
              className="ck-nam-the ck-pt-ct-nam-hien-tai"
              aria-current="page"
            >
              {y}
            </span>
          ) : (
            <Link key={y} href={duongDanCuuTinh(y)} className="ck-nam-the">
              {y}
            </Link>
          ),
        )}
      </div>
    </section>
  );
}

import React from 'react';
import Link from 'next/link';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  ChuGiaiHanh,
  DocNhanh,
  MoChiTietAnchorClient,
} from '@/components/ck/truc-quan';
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
import { boChuHan } from '@/lib/trang/chu-viet';
import {
  VI_TRI_LUOI_CUU_TINH,
  docNhanhCuuTinh,
  duongBay,
} from '@/lib/trang/phan-truc-quan';
import { lamSachChuHanDauCau } from '../PhongThuyHelpers';
import {
  BON_SAO_HIEP_KY,
  dinhDangNgayGioVN,
  tenThangTiet,
  tenViTriCung,
} from './CuuTinhHelpers';
import { DuongSaoBayClient } from './DuongSaoBayClient';

function sapXepTheoLuoi(ban: BanCuuTinh) {
  return [...ban.cung].sort((a, b) => {
    const [ha, ca] = VI_TRI_LUOI_CUU_TINH[a.ten];
    const [hb, cb] = VI_TRI_LUOI_CUU_TINH[b.ten];
    return ha !== hb ? ha - hb : ca - cb;
  });
}

/** Lưới cửu cung 3×3 đặt Nam ở trên theo VI_TRI_LUOI_CUU_TINH, tô màu theo hành, kèm hoạt cảnh sao bay & details từng ô. */
export function BangCuuCung({
  ban,
  banNam,
  nho = false,
  hienChuThich = !nho,
  idPrefix = 'ck-ct',
}: {
  ban: BanCuuTinh;
  banNam?: BanCuuTinh;
  nho?: boolean;
  hienChuThich?: boolean;
  idPrefix?: string;
}) {
  const luoiO = sapXepTheoLuoi(ban);

  if (nho) {
    return (
      <div className="ck-pt-ct-ban-khung ck-pt-ct-ban-nho">
        <div
          className="ck-pt-ct-luoi"
          role="group"
          aria-label={`Bàn cửu tinh trung cung ${saoSo(ban.trung).ten}`}
        >
          {luoiO.map((o) => {
            const laTrung = o.soLacThu === 5;
            const laNguHoang = o.sao.so === 5;
            const slug = HANH_SLUG[o.sao.hanh];
            const tenPhuong = laTrung ? 'Trung cung' : o.phuong;
            return (
              <div
                key={o.soLacThu}
                className={`ck-pt-ct-o ck-tq-nen-${slug}${laTrung ? ' ck-pt-ct-o-trung' : ''}${laNguHoang ? ' ck-pt-ct-o-ngu-hoang' : ''}`}
              >
                <span className="ck-pt-ct-o-phuong">{tenPhuong}</span>
                <div className="ck-pt-ct-o-sao">
                  <span className={`ck-pt-ct-sao-so ck-tq-hanh-${slug}`}>{o.sao.so}</span>
                  <strong className="ck-pt-ct-sao-ten">{o.sao.ten}</strong>
                </div>
                <span className="ck-pt-ct-sao-han">{o.sao.hanh}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const buoc = duongBay(ban);
  const toaDoTinh = buoc.map((b) => ({
    ...b,
    x: b.o[1] * 100 + 50,
    y: b.o[0] * 100 + 50,
    nhanX: b.o[1] * 100 + 84,
    nhanY: b.o[0] * 100 + 84,
  }));
  const banLabel = `Trung cung ${saoSo(ban.trung).so} ${saoSo(ban.trung).ten}`;

  return (
    <div className="ck-pt-ct-ban-khung">
      <MoChiTietAnchorClient />
      {hienChuThich ? (
        <p className="ck-pt-ct-huong-chu">
          Nam ở trên (theo Lạc thư). Vành ngoài ghi 8 phương để đối chiếu với la bàn Bắc-trên. Bấm một ô để mở chi tiết sao.
        </p>
      ) : null}

      <DuongSaoBayClient buoc={buoc} banLabel={banLabel}>
        <div className="ck-pt-ct-luoi" role="group" aria-label={`Bàn cửu tinh ${banLabel}`}>
          {luoiO.map((o) => {
            const laTrung = o.soLacThu === 5;
            const laNguHoang = o.sao.so === 5;
            const slug = HANH_SLUG[o.sao.hanh];
            const tenPhuong = laTrung ? 'Trung cung' : o.phuong;
            const detailId = `${idPrefix}-o-${o.soLacThu}`;
            const saoNamCung = banNam?.cung.find((c) => c.soLacThu === o.soLacThu)?.sao;

            return (
              <a
                key={o.soLacThu}
                href={`#${detailId}`}
                data-mo-details={detailId}
                className={`ck-pt-ct-o ck-pt-ct-o-link ck-tq-nen-${slug}${laTrung ? ' ck-pt-ct-o-trung' : ''}${laNguHoang ? ' ck-pt-ct-o-ngu-hoang' : ''}`}
                aria-label={`${tenPhuong} (${o.ten}): sao ${o.sao.so} ${o.sao.ten}, hành ${o.sao.hanh}. Bấm xem chi tiết.`}
              >
                <span className="ck-pt-ct-o-phuong">
                  {tenPhuong}
                  <small className="ck-pt-ct-o-cung"> ({laTrung ? o.phuong : o.ten})</small>
                </span>

                {laNguHoang ? <span className="ck-pt-ct-nh-nhan">Ngũ hoàng</span> : null}

                <div className="ck-pt-ct-o-sao">
                  <span className={`ck-pt-ct-sao-so ck-tq-hanh-${slug}`}>{o.sao.so}</span>
                  <strong className="ck-pt-ct-sao-ten">{o.sao.ten}</strong>
                </div>

                <span className="ck-pt-ct-sao-han">{o.sao.hanh}</span>

                {saoNamCung ? (
                  <span className="ck-pt-ct-sao-nam-phu">
                    Năm: {saoNamCung.so} {saoNamCung.ten}
                  </span>
                ) : null}
              </a>
            );
          })}
        </div>
      </DuongSaoBayClient>

      <div className="ck-pt-ct-chu-giai-hang">
        <ChuGiaiHanh />
      </div>

      {/* Đường nối tĩnh trong <details> cho trường hợp không bật JS */}
      <details className="ck-pt-ct-bay-tinh">
        <summary className="ck-pt-ct-bay-tinh-nut">
          Xem đường sao bay dạng tĩnh ({buoc.map((b) => b.so).join(' → ')})
        </summary>
        <div className="ck-pt-ct-bay-tinh-noi">
          <svg
            viewBox="0 0 300 300"
            className="ck-pt-ct-bay-tinh-svg"
            role="img"
            aria-label={`Sơ đồ đường sao bay tĩnh 9 bước: ${buoc.map((b, i) => `${i + 1}. ${b.cung} (sao ${b.so})`).join(', ')}`}
          >
            <rect x={2} y={2} width={296} height={296} fill="#FFFDF8" stroke="#C9AE78" strokeWidth={1.5} />
            <line x1={100} y1={2} x2={100} y2={298} stroke="#E4D7BE" strokeWidth={1} />
            <line x1={200} y1={2} x2={200} y2={298} stroke="#E4D7BE" strokeWidth={1} />
            <line x1={2} y1={100} x2={298} y2={100} stroke="#E4D7BE" strokeWidth={1} />
            <line x1={2} y1={200} x2={298} y2={200} stroke="#E4D7BE" strokeWidth={1} />
            {toaDoTinh.slice(0, -1).map((diem, idx) => {
              const tiep = toaDoTinh[idx + 1];
              return (
                <line
                  key={`${diem.so}-${tiep.so}`}
                  x1={diem.x}
                  y1={diem.y}
                  x2={tiep.x}
                  y2={tiep.y}
                  stroke="#8E1B12"
                  strokeWidth={2.5}
                  strokeDasharray="6 4"
                />
              );
            })}
            {toaDoTinh.map((diem, idx) => (
              <g key={diem.so} transform={`translate(${diem.x}, ${diem.y})`}>
                <circle cx={0} cy={0} r={14} fill="#8E1B12" />
                <text
                  x={0}
                  y={0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={700}
                  fill="#FBF1DA"
                >
                  {idx + 1}
                </text>
                <text
                  x={0}
                  y={24}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10.5}
                  fontWeight={700}
                  fill="#1F140D"
                >
                  Sao {diem.so}
                </text>
              </g>
            ))}
          </svg>
          <ol className="ck-pt-ct-bay-tinh-ds">
            {buoc.map((b, i) => (
              <li key={b.so}>
                <b>Bước {i + 1}:</b> Sao {b.so} ({saoSo(b.so).ten}) → {b.cung}
              </li>
            ))}
          </ol>
        </div>
      </details>

      {/* Bấm từng ô mở <details> chi tiết sao */}
      <div className="ck-pt-ct-chi-tiet-luoi">
        {luoiO.map((o) => {
          const detailId = `${idPrefix}-o-${o.soLacThu}`;
          const laTrung = o.soLacThu === 5;
          const laBonSao = BON_SAO_HIEP_KY.includes(o.sao.so as 1 | 6 | 8 | 9);
          const slug = HANH_SLUG[o.sao.hanh];
          return (
            <details key={detailId} id={detailId} className="ck-pt-ct-o-details">
              <summary className="ck-pt-ct-o-summary">
                <span>
                  <b>{laTrung ? 'Trung cung' : `${o.phuong} (${o.ten})`}</b> · {o.sao.so}{' '}
                  {o.sao.ten}
                </span>
                <span className={`ck-pt-ct-o-tag ck-tq-nen-${slug} ck-tq-hanh-${slug}`}>
                  {o.sao.hanh}
                </span>
              </summary>
              <div className="ck-pt-ct-o-body">
                <p>
                  Sao: <strong>{o.sao.so} {o.sao.ten}</strong> · Tên Bắc Đẩu:{' '}
                  <strong>{o.sao.tenBacDau}</strong> · Hành: <strong>{o.sao.hanh}</strong>.
                </p>
                <p>
                  Vị trí: <strong>{tenViTriCung(o)}</strong> · Số Lạc thư gốc: {o.soLacThu}.
                </p>
                {laBonSao ? (
                  <p>Thuộc 4 sao được Hiệp kỷ ghi trong mục &quot;Khai sơn lập hướng tu phương cát&quot;.</p>
                ) : o.sao.so === 5 ? (
                  <p>Sao Ngũ hoàng hành Thổ, nằm ngoài 4 sao mục Khai sơn lập hướng tu phương cát.</p>
                ) : null}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

/** Khối năm / tháng: Đọc nhanh, phân đoạn Năm / Tháng, lưới 3×3 có vành phương & sao bay, tra nhanh Ngũ hoàng / 4 sao Hiệp kỷ. */
export function KhoiCuuTinhNam({
  data,
  hienLienKetTrangNam = false,
  basePath = '/phong-thuy/cuu-tinh',
  giuThamSoNam = false,
  lop = 'nam',
  thangChon = 1,
  thangHienTai,
}: {
  data: NamCuuTinh;
  hienLienKetTrangNam?: boolean;
  basePath?: string;
  giuThamSoNam?: boolean;
  lop?: 'nam' | 'thang';
  thangChon?: number;
  thangHienTai?: number;
}) {
  const dn = docNhanhCuuTinh(data.nam);
  const theDocNhanh = dn.the.map((t) => {
    const sach = { ...t, chiTiet: lamSachChuHanDauCau(t.chiTiet) };
    return sach.ma === 'ngu-hoang' ? { ...sach, muc: 'diu' as const } : sach;
  });
  const saoTrung = saoSo(data.ban.trung);
  const nguHoang = cungCuaSao(data.ban, 5);
  const nhiHac = cungCuaSao(data.ban, 2);
  const thangObj = data.thang[Math.max(0, Math.min(11, thangChon - 1))];
  const saoTrungThang = saoSo(thangObj.ban.trung);
  const laLopThang = lop === 'thang';

  const taoLink = (lopMoi: 'nam' | 'thang', thangMoi?: number) => {
    const qs = new URLSearchParams();
    if (giuThamSoNam) qs.set('nam', String(data.nam));
    if (lopMoi === 'thang') {
      qs.set('lop', 'thang');
      qs.set('thang', String(thangMoi ?? thangChon));
    }
    const q = qs.toString();
    return q ? `${basePath}?${q}#ck-pt-ct-nam-tieu` : `${basePath}#ck-pt-ct-nam-tieu`;
  };

  return (
    <section className="ck-td-muc" aria-labelledby="ck-pt-ct-nam-tieu">
      <h2 id="ck-pt-ct-nam-tieu" className="ck-td-tieu">
        Cửu tinh năm {data.nam} ({data.canChi})
      </h2>

      <DocNhanh cau={dn.cau} the={theDocNhanh} tieuDeId="ck-pt-ct-dn" />

      <div className="ck-pt-ct-nam-dau" style={{ marginTop: 18 }}>
        <p className="ck-pt-ct-moc-nam">
          <strong>{data.nguyen}</strong>: <strong>{saoTrung.so} {saoTrung.ten}</strong> vào trung cung.{' '}
          Năm đổi ở Lập xuân: từ <strong>{dinhDangNgayGioVN(data.batDau)}</strong> đến{' '}
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

      {/* Nút phân đoạn Năm / Tháng (link thuần HTML) */}
      <div className="ck-pt-ct-lop-thanh" role="navigation" aria-label="Chọn lớp năm hoặc tháng">
        <Link
          href={taoLink('nam')}
          className={`ck-pt-ct-lop-nut${!laLopThang ? ' ck-pt-ct-lop-chon' : ''}`}
          aria-current={!laLopThang ? 'page' : undefined}
        >
          Năm {data.nam}
        </Link>
        <Link
          href={taoLink('thang', thangChon)}
          className={`ck-pt-ct-lop-nut${laLopThang ? ' ck-pt-ct-lop-chon' : ''}`}
          aria-current={laLopThang ? 'page' : undefined}
        >
          Tháng {thangObj.thang} ({thangObj.chi})
        </Link>
      </div>

      {/* Dải 12 tháng tiết (link tới ?lop=thang&thang=N) */}
      <div className="ck-pt-ct-thang-chon-ds" aria-label="Chọn nhanh 12 tháng tiết">
        {data.thang.map((t) => {
          const dangChon = laLopThang && t.thang === thangObj.thang;
          const laNay = thangHienTai === t.thang;
          const sT = saoSo(t.ban.trung);
          return (
            <Link
              key={t.thang}
              href={taoLink('thang', t.thang)}
              className={`ck-pt-ct-thang-chon-muc${dangChon ? ' ck-pt-ct-thang-chon-active' : ''}`}
              aria-current={dangChon ? 'page' : undefined}
            >
              <span>
                T{t.thang} {t.chi}
                {laNay ? ' · Nay' : ''}
              </span>
              <small>
                {sT.so} {sT.ten}
              </small>
            </Link>
          );
        })}
      </div>

      {laLopThang ? (
        <div className="ck-pt-ct-thang-banner" role="status">
          <strong>
            Lớp tháng: {tenThangTiet(thangObj.thang)} ({thangObj.chi}) năm {data.nam}
          </strong>
          <span>
            Bắt đầu từ tiết <b>{thangObj.tiet}</b> lúc{' '}
            <b>{dinhDangNgayGioVN(thangObj.batDau)}</b> (giờ Việt Nam) · Trung cung:{' '}
            <b>
              {saoTrungThang.so} {saoTrungThang.ten}
            </b>
            .
          </span>
        </div>
      ) : null}

      <BangCuuCung
        ban={laLopThang ? thangObj.ban : data.ban}
        banNam={laLopThang ? data.ban : undefined}
        idPrefix={laLopThang ? `ck-ct-${data.nam}-t${thangObj.thang}` : `ck-ct-${data.nam}`}
      />

      <div className="ck-pt-ct-tra-nhanh">
        <p className="ck-pt-ct-tra-dong">
          Năm {data.nam}: Ngũ hoàng ở <strong>{tenViTriCung(nguHoang)}</strong>. Nhị hắc ở{' '}
          <strong>{tenViTriCung(nhiHac)}</strong>.
        </p>
        <p className="ck-pt-ct-bon-sao-chu">{boChuHan(GHI_CHU_BON_SAO)}</p>
        <ul className="ck-pt-ct-bon-sao-ds">
          {BON_SAO_HIEP_KY.map((so) => {
            const c = cungCuaSao(laLopThang ? thangObj.ban : data.ban, so);
            const sao = saoSo(so);
            return (
              <li key={so} className="ck-pt-ct-bon-sao-o">
                <span className="ck-pt-ct-bon-sao-ten">
                  <i
                    className={`ck-tq-hanh-cham ck-tq-cham-${HANH_SLUG[sao.hanh]}`}
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

/** Khối 12 tháng tiết của năm trong <details>, làm nổi tháng đang hiệu lực. */
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
      <details className="ck-pt-xem-bang">
        <summary className="ck-pt-xem-bang-nut">
          Xem cả 12 bàn tháng năm {data.nam}
        </summary>
        <div className="ck-pt-xem-bang-noi">
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
                    </b>
                  </p>
                  <BangCuuCung ban={t.ban} nho hienChuThich={false} />
                </article>
              );
            })}
          </div>
        </div>
      </details>
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

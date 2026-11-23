// Component dùng chung cho cụm /than-so-hoc — CHỈ dùng ở server component (import kho ý nghĩa ~160 KB).
import React from 'react';
import Link from 'next/link';
import {
  BANG_CHU,
  GHI_CHU_Y_NGHIA,
  GIOI_HAN,
  LUOI,
  NAM_CA_NHAN,
  QUY_UOC,
  SO_CHU_DAO,
  SO_MASTER,
  duongDanNamCaNhan,
  duongDanSoChuDao,
  rutDon,
  type BieuDo,
  type DinhCao,
  type NgaySinh,
} from '@/lib/trang/than-so-hoc';
import { tuoiTrongNam } from '@/lib/trang/phan-truc-quan';
import {
  NGUON_Y_NGHIA,
  sachDuocTrich,
  type ChiSoTSH,
  type TrichSach,
  type YNghiaSo,
} from '@/lib/trang/than-so-hoc-y-nghia';
import { MoChiTietAnchorClient, ThuatNgu } from '@/components/ck/truc-quan';
import { dinhDangBuoc, laSoChuDaoHopLe, laSoMaster } from './ThanSoHocHelpers';

export const NGHIA_THUAT_NGU_TSH = {
  soChuDao:
    'Cộng chữ số ngày sinh dương lịch rồi rút gọn về 1–9 (giữ nguyên 11, 22, 33). Một số sách rút gọn riêng ngày, tháng, năm rồi mới cộng.',
  namCaNhan:
    'Cộng chữ số ngày sinh, tháng sinh với năm đang xét rồi rút gọn về 1–9. Sách lấy mốc đổi năm cá nhân là 1/1, sách lấy ngày sinh nhật.',
  dinhCao:
    'Đỉnh 1 kết thúc ở tuổi 36 trừ số chủ đạo (rút về 1 chữ số); mỗi đỉnh sau dài 9 năm. Rút gọn ngày, tháng, năm về 1–9 rồi cộng từng cặp để lập 4 chặng.',
} as const;

/** Ghi chú nguồn lời Nhật Nguyệt và đoạn sách tiếng Anh: đặt ngay trên phần ý nghĩa. */
export function KhoiGhiChuYNghia() {
  return (
    <aside className="ck-tsh-ghi-chu-y-nghia" aria-label="Ghi chú nguồn phần ý nghĩa">
      <p>{GHI_CHU_Y_NGHIA}</p>
    </aside>
  );
}

/** Dòng ghi công bắt buộc cuối mỗi khối ý nghĩa dùng kho Nhật Nguyệt. */
export function DongGhiCongYNghia({ className }: { className?: string }) {
  return (
    <p className={`ck-tsh-yn-nguon${className ? ` ${className}` : ''}`}>
      Dữ liệu: {NGUON_Y_NGHIA.ten} (
      <a href={NGUON_Y_NGHIA.url} target="_blank" rel="noopener">
        nhatnguyet.org
      </a>
      )
    </p>
  );
}

/** Câu giới hạn bắt buộc ở cuối mọi trang thuộc cụm /than-so-hoc. */
export function KhoiGioiHan() {
  return (
    <aside className="ck-nguon-nho ck-tsh-gioi-han" aria-label="Giới hạn tham khảo">
      <p>{GIOI_HAN}</p>
    </aside>
  );
}

/** Lưu ý dùng ngày sinh dương lịch kèm liên kết đổi ngày âm sang dương. */
export function GhiChuNgayDuong({ daDung }: { daDung: Set<string> }) {
  return (
    <p className="ck-ghi-nho ck-tsh-ghi-ngay">
      Dùng ngày sinh dương lịch. Biết ngày âm thì đổi ở{' '}
      {daDung.has('/lich-am/doi-ngay') ? (
        <Link href="/lich-am/doi-ngay">đổi ngày âm dương</Link>
      ) : (
        <span>công cụ đổi ngày âm dương</span>
      )}
      .
    </p>
  );
}

/** Bảng quy đổi 9 cột Pythagoras A–Z ra 1–9. */
export function BangChuPythagoras() {
  return (
    <div className="ck-tsh-bang-chu" role="region" aria-label="Bảng chữ cái Pythagoras 1 đến 9">
      {BANG_CHU.map((cot) => (
        <div key={cot.so} className="ck-tsh-bang-cot">
          <span className="ck-tsh-bang-so">{cot.so}</span>
          <span className="ck-tsh-bang-ds">{cot.chu.join(' · ')}</span>
        </div>
      ))}
    </div>
  );
}

/** Danh sách 5 quy ước tính toán khác nhau giữa các sách. */
export function DanhSachQuyUoc() {
  return (
    <ul className="ck-tsh-quy-uoc-ds">
      {QUY_UOC.map((cau, i) => (
        <li key={i}>{cau}</li>
      ))}
    </ul>
  );
}

/** Thanh chuyển nhanh 12 số chủ đạo (1–9 và nhóm số giữ nguyên 11, 22, 33). */
export function ThanhSoChuDao({ hienTai }: { hienTai?: number }) {
  return (
    <div className="ck-tsh-thanh-so">
      {SO_CHU_DAO.map((s) =>
        s === hienTai ? (
          <span
            key={s}
            className="ck-tsh-thanh-muc ck-tsh-thanh-hien-tai"
            aria-current="page"
          >
            {s}
          </span>
        ) : (
          <Link key={s} href={duongDanSoChuDao(s)} className="ck-tsh-thanh-muc">
            {s}
          </Link>
        ),
      )}
    </div>
  );
}

/** Thanh chuyển nhanh 9 số năm cá nhân (1–9). */
export function ThanhNamCaNhan({ hienTai }: { hienTai?: number }) {
  return (
    <div className="ck-tsh-thanh-so">
      {NAM_CA_NHAN.map((s) =>
        s === hienTai ? (
          <span
            key={s}
            className="ck-tsh-thanh-muc ck-tsh-thanh-hien-tai"
            aria-current="page"
          >
            {s}
          </span>
        ) : (
          <Link key={s} href={duongDanNamCaNhan(s)} className="ck-tsh-thanh-muc">
            {s}
          </Link>
        ),
      )}
    </div>
  );
}

/** Vòng tròn lớn hiển thị Số chủ đạo (hoặc Năm cá nhân), viền đôi cho 11, 22, 33 và phép cộng thu gọn. */
export function VongTronSoChuDao({
  so,
  phepCong,
  buoc,
  nhan = 'Số chủ đạo',
  phu,
  href,
  giuMaster = SO_MASTER,
  thuatNguId,
  thuatNguNghia,
}: {
  so: number;
  phepCong: string;
  buoc: number[];
  nhan?: string;
  phu?: string;
  href?: string;
  giuMaster?: readonly number[];
  thuatNguId?: string;
  thuatNguNghia?: string;
}) {
  const laMaster = laSoMaster(so);
  const chuoiRutGon =
    buoc.length > 1 || (giuMaster.length > 0 && giuMaster.includes(so))
      ? `${phepCong} (${dinhDangBuoc(buoc, giuMaster)})`
      : phepCong;

  const vongEl = (
    <span className={`ck-tsh-vong-so${laMaster ? ' ck-tsh-vong-master' : ''}`}>
      <span className="ck-tsh-vong-chu">{so}</span>
    </span>
  );

  return (
    <div className="ck-tsh-vong-khung">
      <div className="ck-tsh-vong-cot">
        {href ? (
          <Link href={href} className="ck-tsh-vong-link" aria-label={`${nhan} ${so}`}>
            {vongEl}
          </Link>
        ) : (
          vongEl
        )}
        <p className="ck-tsh-vong-phep" aria-label="Phép cộng thu gọn">
          {chuoiRutGon}
        </p>
      </div>

      <div className="ck-tsh-vong-thong-tin">
        <div className="ck-tsh-vong-nhan">
          {thuatNguId && thuatNguNghia ? (
            <ThuatNgu ten={nhan} nghia={thuatNguNghia} id={thuatNguId} />
          ) : (
            nhan
          )}
        </div>
        <h3 className="ck-tsh-vong-tieu">
          {href ? <Link href={href}>{nhan} {so}</Link> : `${nhan} ${so}`}
        </h3>
        {laMaster ? (
          <p className="ck-tsh-ghi-giu">Số giữ nguyên, không rút tiếp</p>
        ) : null}
        {phu ? <p className="ck-tsh-dau-phu">{phu}</p> : null}
      </div>
    </div>
  );
}

/** Kim tự tháp (≥768px) + Dòng thời gian 4 đỉnh cao theo tuổi (4 thẻ dọc ở <768px). */
export function BonDinhCaoTrucQuan({
  ngaySinh,
  namXet,
  dinhCao,
  chiSoDinhHienTai,
}: {
  ngaySinh: NgaySinh;
  namXet: number;
  dinhCao: DinhCao[];
  chiSoDinhHienTai: number;
}) {
  const tuoi = tuoiTrongNam(ngaySinh, namXet);
  const thangRut = rutDon(ngaySinh.thang);
  const ngayRut = rutDon(ngaySinh.ngay);
  const namRut = rutDon(ngaySinh.nam);

  const muc = dinhCao.map((dc, idx) => {
    const namBatDau = ngaySinh.nam + dc.tuTuoi;
    const namKetThuc = dc.denTuoi !== null ? ngaySinh.nam + dc.denTuoi : null;
    const khoangTuoi =
      dc.denTuoi !== null ? `${dc.tuTuoi}–${dc.denTuoi} tuổi` : `từ ${dc.tuTuoi} tuổi`;
    const khoangNam =
      namKetThuc !== null ? `${namBatDau}–${namKetThuc}` : `từ ${namBatDau}`;
    const dangO = idx === chiSoDinhHienTai;
    const laCuoi = idx === dinhCao.length - 1;
    let viTriVachPct = 50;
    if (dangO) {
      if (dc.denTuoi !== null) {
        const span = Math.max(1, dc.denTuoi - dc.tuTuoi);
        viTriVachPct = Math.max(10, Math.min(90, ((tuoi - dc.tuTuoi) / span) * 100));
      } else {
        viTriVachPct = Math.max(14, Math.min(72, ((tuoi - dc.tuTuoi) / 25) * 100));
      }
    }
    return {
      ...dc,
      khoangTuoi,
      khoangNam,
      dangO,
      laCuoi,
      laMaster: laSoMaster(dc.so),
      viTriVachPct: Math.round(viTriVachPct),
      tyLeDoan: dc.denTuoi !== null ? Math.max(8, dc.denTuoi - dc.tuTuoi + 1) : 22,
    };
  });

  const nutDinh = (item: (typeof muc)[number], lopViTri: string) => (
    <div
      className={`ck-tsh-ktt-nut ${lopViTri}${item.dangO ? ' ck-tsh-ktt-dang-o' : ''}`}
    >
      <span className="ck-tsh-ktt-thu">Đỉnh {item.thu}</span>
      <span className={`ck-tsh-ktt-so${item.laMaster ? ' ck-tsh-so-master-nho' : ''}`}>
        {item.so}
      </span>
      <code className="ck-tsh-ktt-cong">{item.phepCong}</code>
      <span className="ck-tsh-ktt-tuoi">{item.khoangTuoi}</span>
      <span className="ck-tsh-ktt-nam">{item.khoangNam}</span>
      {item.dangO ? <span className="ck-tsh-dang-o-nhan">Đang ở đây</span> : null}
    </div>
  );

  return (
    <div className="ck-tsh-dc-khung">
      {/* Kim tự tháp 6 cột ở >= 768px (khớp tâm SVG viewBox 600x320) */}
      <div className="ck-tsh-ktt" aria-label="Kim tự tháp 4 đỉnh cao">
        <svg className="ck-tsh-ktt-svg" viewBox="0 0 600 320" preserveAspectRatio="none" aria-hidden="true">
          <line x1="100" y1="280" x2="200" y2="200" />
          <line x1="300" y1="280" x2="200" y2="200" />
          <line x1="300" y1="280" x2="400" y2="200" />
          <line x1="500" y1="280" x2="400" y2="200" />
          <line x1="200" y1="200" x2="300" y2="120" />
          <line x1="400" y1="200" x2="300" y2="120" />
          <line x1="100" y1="280" x2="300" y2="40" strokeDasharray="5 4" />
          <line x1="500" y1="280" x2="300" y2="40" strokeDasharray="5 4" />
        </svg>

        {nutDinh(muc[3], 'ck-tsh-ktt-d4')}
        {nutDinh(muc[2], 'ck-tsh-ktt-d3')}
        {nutDinh(muc[0], 'ck-tsh-ktt-d1')}
        {nutDinh(muc[1], 'ck-tsh-ktt-d2')}

        <div className="ck-tsh-ktt-goc ck-tsh-ktt-g1">
          <span>Tháng {ngaySinh.thang}</span>
          <strong>{thangRut}</strong>
        </div>
        <div className="ck-tsh-ktt-goc ck-tsh-ktt-g2">
          <span>Ngày {ngaySinh.ngay}</span>
          <strong>{ngayRut}</strong>
        </div>
        <div className="ck-tsh-ktt-goc ck-tsh-ktt-g3">
          <span>Năm {ngaySinh.nam}</span>
          <strong>{namRut}</strong>
        </div>
      </div>

      {/* Dòng thời gian 4 đoạn (thanh ngang trên >= 768px, 4 thẻ xếp dọc ở < 768px) */}
      <div
        className="ck-tsh-dc-thanh"
        role="region"
        aria-label={`Dòng thời gian 4 đỉnh cao, hiện tại ${tuoi} tuổi ở đỉnh ${chiSoDinhHienTai + 1}`}
      >
        {muc.map((item) => (
          <article
            key={item.thu}
            className={`ck-tsh-dc-doan${item.dangO ? ' ck-tsh-dc-dang-o' : ''}${item.laCuoi ? ' ck-tsh-dc-cuoi' : ''}`}
            style={{ flexGrow: item.thu === 1 ? 1.3 : item.laCuoi ? 1.1 : 1 }}
          >
            {item.dangO ? (
              <div
                className="ck-tsh-dc-vach"
                style={{ left: `${item.viTriVachPct}%` }}
                aria-hidden="true"
              />
            ) : null}

            <div className="ck-tsh-dc-noi-dung">
              <div className="ck-tsh-dc-dau">
                <span className="ck-tsh-dc-thu">Đỉnh {item.thu}</span>
                {item.dangO ? (
                  <span className="ck-tsh-dang-o-nhan">Đang ở đây</span>
                ) : null}
              </div>

              <div className="ck-tsh-dc-so-hang">
                <strong className={`ck-tsh-dc-so${item.laMaster ? ' ck-tsh-so-master-nho' : ''}`}>
                  {item.so}
                </strong>
                <code className="ck-tsh-dc-phep">{item.phepCong}</code>
              </div>

              <div className="ck-tsh-dc-tuoi">
                <span>{item.khoangTuoi}</span>
                <span className="ck-tsh-dc-nam">({item.khoangNam})</span>
              </div>

              {item.dangO ? (
                <div className="ck-tsh-dc-tuoi-hien">
                  Tuổi {tuoi} ({namXet})
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/** Tọa độ tâm từng số 1–9 trong viewBox 300 × 300 của lưới LUOI [[3,6,9],[2,5,8],[1,4,7]]. */
const TAM_SO_LUOI: Record<number, [number, number]> = {
  3: [50, 50],
  6: [150, 50],
  9: [250, 50],
  2: [50, 150],
  5: [150, 150],
  8: [250, 150],
  1: [50, 250],
  4: [150, 250],
  7: [250, 250],
};

/** Lưới 3 × 3 biểu đồ ngày sinh kèm đường đủ/trống vẽ bằng vạch bấm mở details và chú thích rõ quy ước. */
export function LuoiBieuDoNgaySinh({
  bieuDo,
  moTa = 'Lưới 3 × 3 biểu đồ ngày sinh',
  idPrefix = 'ck-tsh-bd',
}: {
  bieuDo: BieuDo;
  moTa?: string;
  idPrefix?: string;
}) {
  const tatCaDuong = [
    ...bieuDo.duongDay.map((d) => ({ ...d, loai: 'day' as const })),
    ...bieuDo.duongTrong.map((d) => ({ ...d, loai: 'trong' as const })),
  ];

  return (
    <div className="ck-tsh-bieu-do-bo-cuc">
      <MoChiTietAnchorClient />
      <div className="ck-tsh-luoi-boc">
        <div className="ck-tsh-luoi-3x3" role="grid" aria-label={moTa}>
          {LUOI.map((hang, hi) => (
            <div key={hi} role="row" className="ck-tsh-luoi-hang">
              {hang.map((so) => {
                const lan = bieuDo.dem[so] ?? 0;
                const trong = lan === 0;
                const chuoi = trong ? String(so) : String(so).repeat(lan);
                return (
                  <div
                    key={so}
                    role="gridcell"
                    className={`ck-tsh-o ${trong ? 'ck-tsh-o-trong' : 'ck-tsh-o-co'}`}
                    aria-label={trong ? `Ô số ${so}: thiếu` : `Ô số ${so}: ${chuoi}`}
                  >
                    <span className={trong ? 'ck-tsh-o-chu-mo' : 'ck-tsh-o-chu'}>
                      {chuoi}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {(bieuDo.duongDay.length > 0 || bieuDo.duongTrong.length > 0) && (
            <svg
              className="ck-tsh-luoi-vach"
              viewBox="0 0 300 300"
              preserveAspectRatio="none"
            >
              {bieuDo.duongTrong.map((d) => {
                const [x1, y1] = TAM_SO_LUOI[d.so[0]];
                const [x2, y2] = TAM_SO_LUOI[d.so[2]];
                const detailId = `${idPrefix}-duong-${d.ma}`;
                return (
                  <a
                    key={`trong-${d.ma}`}
                    href={`#${detailId}`}
                    data-mo-details={detailId}
                    className="ck-tsh-vach-link"
                    aria-label={`Đường trống ${d.ten} (${d.so.join('-')}). Bấm xem tên đường.`}
                  >
                    <line x1={x1} y1={y1} x2={x2} y2={y2} className="ck-tsh-vach-vung-bam" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} className="ck-tsh-vach-trong" />
                  </a>
                );
              })}
              {bieuDo.duongDay.map((d) => {
                const [x1, y1] = TAM_SO_LUOI[d.so[0]];
                const [x2, y2] = TAM_SO_LUOI[d.so[2]];
                const detailId = `${idPrefix}-duong-${d.ma}`;
                return (
                  <a
                    key={`day-${d.ma}`}
                    href={`#${detailId}`}
                    data-mo-details={detailId}
                    className="ck-tsh-vach-link"
                    aria-label={`Đường đủ ${d.ten} (${d.so.join('-')}). Bấm xem tên đường.`}
                  >
                    <line x1={x1} y1={y1} x2={x2} y2={y2} className="ck-tsh-vach-vung-bam" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} className="ck-tsh-vach-day" />
                  </a>
                );
              })}
            </svg>
          )}
        </div>

        <p className="ck-tsh-luoi-quy-uoc">
          Hàng trên 3 · 6 · 9, hàng giữa 2 · 5 · 8, hàng dưới 1 · 4 · 7 (không xếp kiểu bàn phím 7 · 8 · 9).
        </p>

        <div className="ck-tsh-chu-thich-vach">
          <span>
            <i className="ck-tsh-mau-day" aria-hidden="true" />
            Đường đủ 3 số (nét liền xanh)
          </span>
          <span>
            <i className="ck-tsh-mau-trong" aria-hidden="true" />
            Đường trống cả 3 số (nét đứt hổ phách)
          </span>
          <span>Bấm vào vạch trên lưới để mở chi tiết đường.</span>
        </div>
      </div>

      <div className="ck-tsh-thong-ke-luoi">
        <div className="ck-tsh-chi-tiet-hop">
          <h3>Số đếm được trên lưới</h3>
          <p>
            Số 0 xuất hiện <b>{bieuDo.soKhong}</b> lần (không đặt vào lưới)
          </p>
          <p>
            Thiếu:{' '}
            <b>{bieuDo.thieu.length > 0 ? bieuDo.thieu.join(', ') : 'Không thiếu số nào'}</b>
          </p>
        </div>

        <div className="ck-tsh-chi-tiet-hop">
          <h3>Đường đủ và đường trống</h3>
          {tatCaDuong.length > 0 ? (
            <div className="ck-tsh-duong-chi-tiet-ds">
              {tatCaDuong.map((d) => {
                const detailId = `${idPrefix}-duong-${d.ma}`;
                const laDay = d.loai === 'day';
                return (
                  <details key={detailId} id={detailId} className="ck-tsh-duong-details">
                    <summary className="ck-tsh-duong-summary">
                      <span>
                        <b>{d.ten}</b> ({d.so.join('-')})
                      </span>
                      <span className={`ck-tsh-duong-tag ${laDay ? 'ck-tsh-tag-day' : 'ck-tsh-tag-trong'}`}>
                        {laDay ? 'Đủ 3 số' : 'Trống cả 3 số'}
                      </span>
                    </summary>
                    <p className="ck-tsh-duong-mo-ta">
                      Gồm 3 ô số: {d.so.map((s) => `${s} (${bieuDo.dem[s] ?? 0} lần)`).join(', ')}.{' '}
                      {laDay
                        ? 'Cả 3 số cùng có mặt trên biểu đồ ngày sinh.'
                        : 'Cả 3 số đều chưa có trong ngày sinh.'}{' '}
                      Một số sách gọi là mũi tên {d.so.join('-')} và đặt tên riêng khác nhau theo từng trường phái.
                    </p>
                  </details>
                );
              })}
            </div>
          ) : (
            <p>Không có đường nào đủ cả 3 số hay trống cả 3 số.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function duongDanTrangSo(chiSo: ChiSoTSH, so: number): string | null {
  if (chiSo === 'so-chu-dao' && laSoChuDaoHopLe(so)) {
    return duongDanSoChuDao(so);
  }
  if (chiSo === 'nam-ca-nhan' && (NAM_CA_NHAN as readonly number[]).includes(so)) {
    return duongDanNamCaNhan(so);
  }
  return null;
}

function TrichSachItem({ trich }: { trich: TrichSach }) {
  const nguon = (
    <figcaption className="ck-tsh-yn-trich-nguon">
      <em>{trich.sachVi}</em>, {trich.tacGia}, {trich.chuongVi}. Dịch nghĩa: xemboi.
    </figcaption>
  );
  if (trich.vi.length > 600) {
    return (
      <figure className="ck-tsh-yn-trich ck-tsh-yn-trich-dai">
        {nguon}
        <details className="ck-tsh-yn-chi-tiet">
          <summary>Đọc đoạn trích</summary>
          <blockquote>{trich.vi}</blockquote>
        </details>
      </figure>
    );
  }
  return (
    <figure className="ck-tsh-yn-trich">
      <blockquote>{trich.vi}</blockquote>
      {nguon}
    </figure>
  );
}

/**
 * Khối hiển thị ý nghĩa Nhật Nguyệt + đoạn nguyên văn sách cổ (server only).
 * Khi `gon` bật: chỉ hiện `loi` và tối đa 2 đoạn `trichRieng` kèm liên kết "Xem thêm" nếu có trang riêng.
 * Có thể bật `thuGonTrichChung` để thu gọn `trichChung` vào `<details>` khi ở chế độ `gon`.
 */
export function KhoiYNghia({
  y,
  gon = false,
  anGhiChu = false,
  thuGonTrichChung = false,
  capTieuDe = 'h3',
}: {
  y: YNghiaSo | undefined;
  gon?: boolean;
  anGhiChu?: boolean;
  thuGonTrichChung?: boolean;
  capTieuDe?: 'h3' | 'h4';
}) {
  if (!y) return null;

  const TieuDe = capTieuDe;
  const tenChiSoThuong = y.tenChiSo.toLocaleLowerCase('vi-VN');
  const trichRiengHien = gon ? y.trichRieng.slice(0, 2) : y.trichRieng;
  const hienTrichChungTrucTiep = !gon && y.trichChung.length > 0;
  const hienTrichChungThuGon = gon && thuGonTrichChung && y.trichChung.length > 0;
  const trichDaHien = [
    ...trichRiengHien,
    ...(hienTrichChungTrucTiep || hienTrichChungThuGon ? y.trichChung : []),
  ];
  const sach = sachDuocTrich(trichDaHien);
  const linkXemThem = gon ? duongDanTrangSo(y.chiSo, y.so) : null;

  return (
    <div className={`ck-tsh-yn-khoi${gon ? ' ck-tsh-yn-gon' : ''}`}>
      {!anGhiChu ? <KhoiGhiChuYNghia /> : null}

      {y.moTaChiSo ? <p className="ck-tsh-yn-mota">{y.moTaChiSo}</p> : null}

      {y.loi.length > 0 ? (
        <dl className="ck-tsh-yn-dl">
          {y.loi.map((muc) => (
            <div key={muc.k} className="ck-tsh-yn-dong">
              <dt>{muc.ten}</dt>
              <dd>{muc.vb}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {trichRiengHien.length > 0 ? (
        <div className="ck-tsh-yn-nhom-trich">
          <TieuDe className="ck-tsh-yn-trich-tieu">
            Sách cổ viết về {tenChiSoThuong} {y.so}
          </TieuDe>
          <div className="ck-tsh-yn-ds-trich">
            {trichRiengHien.map((t) => (
              <TrichSachItem key={t.id} trich={t} />
            ))}
          </div>
        </div>
      ) : null}

      {hienTrichChungTrucTiep ? (
        <div className="ck-tsh-yn-nhom-trich">
          <TieuDe className="ck-tsh-yn-trich-tieu">
            Sách cổ viết về con số {y.so} nói chung
          </TieuDe>
          <p className="ck-tsh-yn-ghi-chung">
            Các đoạn này nói về con số {y.so}, không riêng cho {tenChiSoThuong}.
          </p>
          <div className="ck-tsh-yn-ds-trich">
            {y.trichChung.map((t) => (
              <TrichSachItem key={t.id} trich={t} />
            ))}
          </div>
        </div>
      ) : null}

      {hienTrichChungThuGon ? (
        <details className="ck-tsh-yn-chi-tiet ck-tsh-yn-chi-tiet-nhom">
          <summary>
            Sách cổ viết về con số {y.so} nói chung ({y.trichChung.length} đoạn trích)
          </summary>
          <p className="ck-tsh-yn-ghi-chung">
            Các đoạn này nói về con số {y.so}, không riêng cho {tenChiSoThuong}.
          </p>
          <div className="ck-tsh-yn-ds-trich">
            {y.trichChung.map((t) => (
              <TrichSachItem key={t.id} trich={t} />
            ))}
          </div>
        </details>
      ) : null}

      {linkXemThem ? (
        <p className="ck-tsh-yn-xem-them">
          <Link href={linkXemThem} aria-label={`Xem thêm ý nghĩa ${tenChiSoThuong} ${y.so}`}>
            Xem thêm →
          </Link>
        </p>
      ) : null}

      <div className="ck-tsh-yn-chan">
        <DongGhiCongYNghia />
        {sach.length > 0 ? (
          <p className="ck-tsh-yn-sach">
            Sách được trích:{' '}
            {sach.map((s, i) => (
              <React.Fragment key={s.sach}>
                {i > 0 ? '; ' : null}
                <em>{s.sachVi}</em> ({s.tacGia})
              </React.Fragment>
            ))}
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}

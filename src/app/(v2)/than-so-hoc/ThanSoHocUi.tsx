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
  duongDanNamCaNhan,
  duongDanSoChuDao,
  type BieuDo,
} from '@/lib/trang/than-so-hoc';
import {
  NGUON_Y_NGHIA,
  sachDuocTrich,
  type ChiSoTSH,
  type TrichSach,
  type YNghiaSo,
} from '@/lib/trang/than-so-hoc-y-nghia';
import { laSoChuDaoHopLe } from './ThanSoHocHelpers';

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

/** Lưới 3 × 3 biểu đồ ngày sinh kèm đường đủ/trống vẽ bằng vạch và chú thích chữ. */
export function LuoiBieuDoNgaySinh({
  bieuDo,
  moTa = 'Lưới 3 × 3 biểu đồ ngày sinh',
}: {
  bieuDo: BieuDo;
  moTa?: string;
}) {
  return (
    <div className="ck-tsh-bieu-do-bo-cuc">
      <div className="ck-tsh-luoi-boc">
        <div className="ck-tsh-luoi-3x3" role="grid" aria-label={moTa}>
          {LUOI.map((hang, hi) => (
            <div key={hi} role="row" className="ck-tsh-luoi-hang">
              {hang.map((so) => {
                const lan = bieuDo.dem[so] ?? 0;
                const trong = lan === 0;
                const chuoi = trong ? '' : String(so).repeat(lan);
                return (
                  <div
                    key={so}
                    role="gridcell"
                    className={`ck-tsh-o${trong ? ' ck-tsh-o-trong' : ''}`}
                    aria-label={trong ? `Ô số ${so}: trống` : `Ô số ${so}: ${chuoi}`}
                  >
                    {!trong ? <span className="ck-tsh-o-chu">{chuoi}</span> : null}
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
              aria-hidden="true"
            >
              {bieuDo.duongTrong.map((d) => {
                const [x1, y1] = TAM_SO_LUOI[d.so[0]];
                const [x2, y2] = TAM_SO_LUOI[d.so[2]];
                return (
                  <line
                    key={`trong-${d.ma}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="ck-tsh-vach-trong"
                  />
                );
              })}
              {bieuDo.duongDay.map((d) => {
                const [x1, y1] = TAM_SO_LUOI[d.so[0]];
                const [x2, y2] = TAM_SO_LUOI[d.so[2]];
                return (
                  <line
                    key={`day-${d.ma}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="ck-tsh-vach-day"
                  />
                );
              })}
            </svg>
          )}
        </div>

        <div className="ck-tsh-chu-thich-vach">
          <span>
            <i className="ck-tsh-mau-day" aria-hidden="true" />
            Đường đủ 3 số (nét liền)
          </span>
          <span>
            <i className="ck-tsh-mau-trong" aria-hidden="true" />
            Đường trống cả 3 số (nét đứt)
          </span>
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
          <h3>Đường đủ 3 số</h3>
          {bieuDo.duongDay.length > 0 ? (
            <ul className="ck-tsh-duong-ds">
              {bieuDo.duongDay.map((d) => (
                <li key={d.ma} className="ck-tsh-duong-day-muc">
                  <b>{d.ten}</b> ({d.so.join('-')})
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có đường nào đủ cả 3 số.</p>
          )}
        </div>

        <div className="ck-tsh-chi-tiet-hop">
          <h3>Đường trống cả 3 số</h3>
          {bieuDo.duongTrong.length > 0 ? (
            <ul className="ck-tsh-duong-ds">
              {bieuDo.duongTrong.map((d) => (
                <li key={d.ma} className="ck-tsh-duong-trong-muc">
                  <b>{d.ten}</b> ({d.so.join('-')})
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có đường nào trống cả 3 số.</p>
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
  const dai = trich.en.length > 600;
  if (dai) {
    return (
      <figure className="ck-tsh-yn-trich ck-tsh-yn-trich-dai">
        <figcaption className="ck-tsh-yn-trich-nguon">
          <em>{trich.sach}</em>, {trich.tacGia}, {trich.chuong}.
        </figcaption>
        <details className="ck-tsh-yn-chi-tiet">
          <summary>Đọc đoạn trích (tiếng Anh)</summary>
          <blockquote lang="en">{trich.en}</blockquote>
        </details>
      </figure>
    );
  }
  return (
    <figure className="ck-tsh-yn-trich">
      <blockquote lang="en">{trich.en}</blockquote>
      <figcaption className="ck-tsh-yn-trich-nguon">
        <em>{trich.sach}</em>, {trich.tacGia}, {trich.chuong}.
      </figcaption>
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
                <em>{s.sach}</em> ({s.tacGia})
              </React.Fragment>
            ))}
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}

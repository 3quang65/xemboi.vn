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
  type BieuDo,
  type CachTinh,
  type KetQuaTen,
} from '@/lib/trang/than-so-hoc';
import { dinhDangBuoc, laSoChuDaoHopLe } from './ThanSoHocHelpers';

/** Ghi chú giải thích vì sao trang chưa có phần ý nghĩa, tính cách, nghề hợp. */
export function KhoiGhiChuYNghia() {
  return (
    <aside className="ck-tsh-ghi-chu-y-nghia" aria-label="Ghi chú phạm vi nội dung">
      <p>{GHI_CHU_Y_NGHIA}</p>
    </aside>
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

function TheChiSoTen({
  nhan,
  moTa,
  chiSo,
}: {
  nhan: string;
  moTa: string;
  chiSo: CachTinh;
}) {
  const coTrang = laSoChuDaoHopLe(chiSo.so);
  return (
    <div className="ck-tsh-chi-so-the">
      <div className="ck-tsh-chi-so-dau">
        <div>
          <h3>{nhan}</h3>
          <p className="ck-tsh-chi-so-phu">{moTa}</p>
        </div>
        {coTrang ? (
          <Link
            href={duongDanSoChuDao(chiSo.so)}
            className="ck-tsh-so-nho-link"
            aria-label={`${nhan}: số ${chiSo.so}`}
          >
            {chiSo.so}
          </Link>
        ) : (
          <span className="ck-tsh-so-nho-link ck-tsh-so-khong-link">{chiSo.so}</span>
        )}
      </div>
      <p className="ck-tsh-phep-cong">{chiSo.phepCong}</p>
      <p className="ck-tsh-buoc-dong">Rút gọn: {dinhDangBuoc(chiSo.buoc, SO_MASTER)}</p>
      {coTrang ? (
        <p className="ck-tsh-chi-so-xem">
          <Link href={duongDanSoChuDao(chiSo.so)}>Xem cách tính số {chiSo.so} →</Link>
        </p>
      ) : null}
    </div>
  );
}

/** Hiển thị từng chữ đã bỏ dấu + 3 chỉ số theo tên (dùng được ở cả client và server). */
export function KetQuaTenHienThi({
  ketQua,
  hoTenGoc,
}: {
  ketQua: KetQuaTen;
  hoTenGoc: string;
}) {
  return (
    <div className="ck-tsh-ten-kq">
      <p className="ck-tsh-ten-tom-tat">
        Chuỗi chữ sau khi bỏ dấu cho <strong>{hoTenGoc}</strong>:{' '}
        <code className="ck-tsh-chuoi-bo-dau">
          {ketQua.chu.map((c) => c.chu).join('')}
        </code>{' '}
        ({ketQua.chu.length} chữ cái)
      </p>

      <div className="ck-tsh-chu-luoi" aria-label="Bảng quy đổi từng chữ cái">
        {ketQua.chu.map((c, idx) => (
          <div
            key={`${c.chu}-${idx}`}
            className={`ck-tsh-chu-o${c.nguyenAm ? ' ck-tsh-chu-nguyen-am' : ''}`}
          >
            <span className="ck-tsh-chu-goc">{c.goc}</span>
            <span className="ck-tsh-chu-bo-dau">{c.chu}</span>
            <strong className="ck-tsh-chu-so">{c.so}</strong>
            <span className="ck-tsh-chu-loai">{c.nguyenAm ? 'nguyên âm' : 'phụ âm'}</span>
          </div>
        ))}
      </div>

      <div className="ck-tsh-ba-chi-so">
        <TheChiSoTen nhan="Chỉ số tên" moTa="Cộng mọi chữ cái" chiSo={ketQua.ten} />
        <TheChiSoTen nhan="Linh hồn" moTa="Cộng các nguyên âm" chiSo={ketQua.linhHon} />
        <TheChiSoTen nhan="Nhân cách" moTa="Cộng các phụ âm" chiSo={ketQua.nhanCach} />
      </div>
    </div>
  );
}

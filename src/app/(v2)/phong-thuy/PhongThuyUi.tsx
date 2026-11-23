import React from 'react';
import Link from 'next/link';
import type { Hao } from '@/lib/trang/kinh-dich';
import {
  BAT_CUNG,
  NGUON_HIEP_KY,
  batPhuong,
  duongDanCungPhi,
  viTriTrich,
  type TrichDan,
} from '@/lib/trang/phong-thuy';

/** Khối trích sách: nhãn Sách ghi, bản dịch tiếng Việt, vị trí trong sách và ghi công dịch nghĩa. */
export function KhoiTrichDan({
  trich,
  nhan,
}: {
  trich: TrichDan;
  nhan?: string;
}) {
  return (
    <figure className="ck-pt-trich">
      <span className="ck-pt-trich-nhan">{nhan ?? 'Sách ghi'}</span>
      <blockquote className="ck-pt-trich-noi">
        <p className="ck-pt-trich-dich">{trich.dich}</p>
      </blockquote>
      <figcaption className="ck-pt-vi-tri">
        {viTriTrich(trich)}. <span className="ck-pt-dich-gia">Dịch nghĩa: xemboi</span>
      </figcaption>
    </figure>
  );
}

/** Khối ghi công bắt buộc ở cuối mọi trang cụm /phong-thuy. */
export function GhiCongHiepKy({ daDung }: { daDung: Set<string> }) {
  return (
    <aside className="ck-nguon-nho ck-pt-ghi-cong" aria-label="Ghi công nguồn sách">
      <p>
        {NGUON_HIEP_KY.ghiCong} (
        <a
          href={NGUON_HIEP_KY.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {NGUON_HIEP_KY.url}
        </a>
        ).
      </p>
      <p>{NGUON_HIEP_KY.ngatCau}</p>
      {daDung.has('/nguon') ? (
        <p>
          <Link href="/nguon">Xem danh mục nguồn sách</Link>
        </p>
      ) : null}
    </aside>
  );
}

/** Lưu ý bắt buộc ở mọi ô nhập năm sinh âm lịch. */
export function GhiChuNamAm({ daDung }: { daDung: Set<string> }) {
  return (
    <p className="ck-ghi-nho ck-pt-ghi-nam">
      Năm tính theo năm âm lịch. Sinh trước Tết thì dùng năm âm lịch trước đó
      {daDung.has('/lich-am/doi-ngay') ? (
        <>
          {' '}
          (
          <Link href="/lich-am/doi-ngay">đổi ngày dương sang âm →</Link>
          )
        </>
      ) : null}
      .
    </p>
  );
}

/** Huy hiệu Cát / Không cát luôn kèm chữ, không chỉ phân biệt bằng màu. */
export function HuyHieuCatHung({ cat }: { cat: boolean }) {
  return (
    <span className={`ck-pt-badge ${cat ? 'ck-pt-cat' : 'ck-pt-hung'}`}>
      {cat ? '✦ Cát' : '◇ Không cát'}
    </span>
  );
}

/** Bảng 8 phương ứng 8 du niên của một cung (4 cát trên, 4 không cát dưới). */
export function BangBatPhuong({ cungTen }: { cungTen: string }) {
  const ds = batPhuong(cungTen);
  return (
    <div className="ck-bang-khung">
      <table className="ck-bang ck-bang-the ck-pt-bang-phuong">
        <thead>
          <tr>
            <th>Du niên</th>
            <th>Sao</th>
            <th>Nhóm</th>
            <th>Phương</th>
            <th>Quái của phương</th>
          </tr>
        </thead>
        <tbody>
          {ds.map(({ duNien: d, cung }) => (
            <tr key={d.ten} className={d.cat ? 'ck-pt-hang-cat' : 'ck-pt-hang-hung'}>
              <td data-nhan="Du niên">
                <b>{d.ten}</b>
              </td>
              <td data-nhan="Sao">{d.sao}</td>
              <td data-nhan="Cát / Hung">
                <HuyHieuCatHung cat={d.cat} />
              </td>
              <td data-nhan="Phương">
                <b>{cung.phuong}</b>{' '}
                <span className="ck-pt-phuong-son">({cung.son.join(', ')})</span>
              </td>
              <td data-nhan="Quái">
                <Link href={duongDanCungPhi(cung)} className="ck-pt-quai-link">
                  <span aria-hidden="true">{cung.kyHieu}</span> {cung.ten}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TEN_HAO_3 = ['Sơ', 'Trung', 'Thượng'] as const;

/** Hình 3 hào thể hiện các hào biến khi lập du niên (từ trên xuống dưới: Thượng, Trung, Sơ). */
export function HinhBaHaoBien({
  bien,
  moTa,
}: {
  bien: [Hao, Hao, Hao];
  moTa: string;
}) {
  return (
    <div className="ck-pt-hinh-hao" role="img" aria-label={moTa}>
      {[2, 1, 0].map((idx) => {
        const laBien = bien[idx] === 1;
        return (
          <div
            key={idx}
            className={`ck-pt-hao-hang ${laBien ? 'ck-pt-hao-bien' : 'ck-pt-hao-giu'}`}
          >
            <span className="ck-pt-hao-vi">{TEN_HAO_3[idx]}</span>
            <span className="ck-pt-hao-thanh" aria-hidden="true" />
            <span className="ck-pt-hao-nhan">{laBien ? 'biến' : 'giữ'}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Hình 3 hào âm/dương của một quái (từ trên xuống dưới: Thượng, Trung, Sơ). */
export function HinhBaHaoQuai({ hao, ten }: { hao: [Hao, Hao, Hao]; ten: string }) {
  return (
    <div
      className="ck-pt-hinh-hao"
      role="img"
      aria-label={`Hình 3 hào cung ${ten}, từ dưới lên`}
    >
      {[2, 1, 0].map((idx) => {
        const laDuong = hao[idx] === 1;
        return (
          <div key={idx} className="ck-pt-hao-hang">
            <span className="ck-pt-hao-vi">{TEN_HAO_3[idx]}</span>
            <span className="ck-pt-vach" aria-hidden="true">
              {laDuong ? (
                <i className="ck-pt-net-lien" />
              ) : (
                <>
                  <i className="ck-pt-net-dut" />
                  <i className="ck-pt-net-dut" />
                </>
              )}
            </span>
            <span className="ck-pt-hao-nhan">{laDuong ? 'Dương' : 'Âm'}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Thanh chuyển nhanh 8 cung phi. */
export function ThanhTamCung({ hienTaiSlug }: { hienTaiSlug?: string }) {
  return (
    <div className="ck-pt-thanh-cung">
      {BAT_CUNG.map((c) =>
        c.slug === hienTaiSlug ? (
          <span
            key={c.slug}
            className="ck-pt-thanh-cung-muc ck-pt-thanh-cung-hien-tai"
            aria-current="page"
          >
            {c.kyHieu} {c.ten}
          </span>
        ) : (
          <Link
            key={c.slug}
            href={duongDanCungPhi(c)}
            className="ck-pt-thanh-cung-muc"
          >
            {c.kyHieu} {c.ten}
          </Link>
        ),
      )}
    </div>
  );
}

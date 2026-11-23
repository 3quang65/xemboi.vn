import React from 'react';
import Link from 'next/link';
import {
  KHAC_BAN,
  NGUON_CHU_DICH,
  NGUON_PHIEN_AM,
} from '@/lib/trang/chu-dich';
import type { Hao } from '@/lib/trang/kinh-dich';

export function LienKetKiem({
  href,
  daDung,
  className,
  title,
  children,
}: {
  href: string;
  daDung: Set<string>;
  className?: string;
  title?: string;
  children: React.ReactNode;
}) {
  if (daDung.has(href)) {
    return (
      <Link href={href} className={className} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <span className={className} title={title}>
      {children}
    </span>
  );
}

const TEN_VI_TRI_6 = ['Sơ', 'Nhị', 'Tam', 'Tứ', 'Ngũ', 'Thượng'] as const;

/** Vẽ hình 3 hào (quái) hoặc 6 hào (quẻ) từ trên xuống dưới; phân biệt âm/dương bằng hình. */
export function HinhHao({
  hao,
  moTa,
  tachQuai = false,
}: {
  hao: Hao[];
  moTa: string;
  tachQuai?: boolean;
}) {
  const chiSoTuTren = Array.from({ length: hao.length }, (_, k) => hao.length - 1 - k);

  return (
    <div className="ck-kd-hinh-hao" role="img" aria-label={moTa}>
      {chiSoTuTren.map((idx) => {
        const viTri = idx + 1;
        const laDuong = hao[idx] === 1;
        const nhanViTri =
          hao.length === 6
            ? `Hào ${viTri} (${TEN_VI_TRI_6[idx]})`
            : `Hào ${viTri}`;

        return (
          <React.Fragment key={viTri}>
            {tachQuai && hao.length === 6 && idx === 2 ? (
              <div className="ck-kd-vach-chia-quai" aria-hidden="true" />
            ) : null}
            <div className="ck-kd-hao-hang">
              <span className="ck-kd-hao-nhan">{nhanViTri}</span>
              <span
                className={`ck-kd-vach ${laDuong ? 'ck-kd-vach-duong' : 'ck-kd-vach-am'}`}
                aria-hidden="true"
              >
                {laDuong ? (
                  <i className="ck-kd-net-lien" />
                ) : (
                  <>
                    <i className="ck-kd-net-dut" />
                    <i className="ck-kd-net-dut" />
                  </>
                )}
              </span>
              <span className="ck-kd-hao-cuc">{laDuong ? 'Dương' : 'Âm'}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/** Hiển thị nguyên văn chữ Hán (lang="zh-Hant"), phiên âm ngay dưới (lang="vi") nếu có, và ghi chú khác bản. */
export function DongVanHan({
  han,
  phienAm,
  ghiChuKhacBan,
}: {
  han: string;
  phienAm?: string | null;
  ghiChuKhacBan?: typeof KHAC_BAN;
}) {
  return (
    <div className="ck-kd-van-khoi">
      <p lang="zh-Hant" className="ck-kd-han-van">
        {han}
      </p>
      {phienAm ? (
        <p lang="vi" className="ck-kd-phien-am">
          {phienAm}
        </p>
      ) : null}
      {ghiChuKhacBan && ghiChuKhacBan.length > 0
        ? ghiChuKhacBan.map((k, idx) => (
            <p key={idx} className="ck-kd-khac-ban">
              Bản gốc ghi <span lang="zh-Hant">{k.banGoc}</span>; {k.ghiChu}
            </p>
          ))
        : null}
    </div>
  );
}

/** Khối ghi công cuối trang theo quy định dữ liệu Chu Dịch. */
export function GhiCongChuDich({
  hienPhienAm = true,
  daDung,
}: {
  hienPhienAm?: boolean;
  daDung: Set<string>;
}) {
  return (
    <aside className="ck-nguon-nho ck-kd-ghi-cong" aria-label="Ghi công nguồn văn bản">
      <p>
        {NGUON_CHU_DICH.ghiCong} (
        <a
          href={NGUON_CHU_DICH.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          Kanripo {NGUON_CHU_DICH.ma}
        </a>
        ).
      </p>
      {hienPhienAm ? (
        <p>
          {NGUON_PHIEN_AM.ghiCong} (
          <a
            href={NGUON_PHIEN_AM.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            KasaiDanto/vietnamese_nom_scripts
          </a>
          ).
        </p>
      ) : null}
      {daDung.has('/nguon') ? (
        <p>
          <Link href="/nguon">Xem danh mục nguồn sách</Link>
        </p>
      ) : null}
    </aside>
  );
}

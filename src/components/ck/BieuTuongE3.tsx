import React from 'react';

export interface CanhGioOption {
  value: number;
  nhan: string;
}

export const CANH_GIO_OPTIONS: readonly CanhGioOption[] = [
  { value: 0, nhan: 'Tý sớm (00:00–00:59)' },
  { value: 1, nhan: 'Sửu (01:00–02:59)' },
  { value: 3, nhan: 'Dần (03:00–04:59)' },
  { value: 5, nhan: 'Mão (05:00–06:59)' },
  { value: 7, nhan: 'Thìn (07:00–08:59)' },
  { value: 9, nhan: 'Tỵ (09:00–10:59)' },
  { value: 11, nhan: 'Ngọ (11:00–12:59)' },
  { value: 13, nhan: 'Mùi (13:00–14:59)' },
  { value: 15, nhan: 'Thân (15:00–16:59)' },
  { value: 17, nhan: 'Dậu (17:00–18:59)' },
  { value: 19, nhan: 'Tuất (19:00–20:59)' },
  { value: 21, nhan: 'Hợi (21:00–22:59)' },
  { value: 23, nhan: 'Tý muộn (23:00–23:59)' },
];

/** Quy đổi giờ đồng hồ 0–23 sang giá trị lựa chọn trong CANH_GIO_OPTIONS. */
export function gioSangCanhGioValue(h: number): number {
  if (!Number.isInteger(h) || h < 0 || h > 23) return 9;
  if (h === 0) return 0;
  if (h === 23) return 23;
  return h % 2 === 1 ? h : h - 1;
}

/** Gradient userSpaceOnUse cho biểu tượng vàng lá trên nền sơn mài. */
export function DefBieuTuongCk() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ck-vl-i" gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="44" y2="44">
          <stop offset="0" stopColor="#B8913F" />
          <stop offset="0.25" stopColor="#F3D88F" />
          <stop offset="0.42" stopColor="#FFF0BE" />
          <stop offset="0.6" stopColor="#D2A64C" />
          <stop offset="0.8" stopColor="#F3D88F" />
          <stop offset="1" stopColor="#B8913F" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export type LoaiBieuTuongCongCu =
  | 'tu-vi'
  | 'tu-vi-2027'
  | 'lich-am'
  | 'menh'
  | 'vo-chong'
  | 'bat-tu'
  | 'tron-doi'
  | 'cung'
  | 'sao'
  | 'doi-ngay'
  | 'van-nien'
  | 'ngay-mai'
  | 'tet'
  | 'hoa-giap'
  | 'nap-am'
  | 'ngu-hanh'
  | 'mau-hop'
  | 'con-giap'
  | 'xong-dat'
  | 'kinh-dich';

/** Biểu tượng nét vàng lá theo mẫu E3 cho các ô công cụ. */
export function BieuTuongCongCu({ loai }: { loai: LoaiBieuTuongCongCu }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="url(#ck-vl-i)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(loai === 'tu-vi' || loai === 'cung') && (
        <>
          <rect x="6" y="6" width="36" height="36" />
          <path d="M6 15h9m18 0h9M6 33h9m18 0h9M15 6v9m0 18v9M33 6v9m0 18v9" />
          <rect x="15" y="15" width="18" height="18" />
          <path
            d="M24 18.6l1.5 3.2 3.4.4-2.5 2.3.7 3.4-3.1-1.8-3.1 1.8.7-3.4-2.5-2.3 3.4-.4z"
            fill="url(#ck-vl-i)"
          />
        </>
      )}
      {loai === 'tu-vi-2027' && (
        <>
          <circle cx="24" cy="24" r="17" />
          <circle cx="24" cy="24" r="11.5" strokeDasharray="3 3" />
          <path
            d="M24 11l2.4 8.2 8.6 2.4-8.6 2.4-2.4 8.2-2.4-8.2-8.6-2.4 8.6-2.4z"
            fill="url(#ck-vl-i)"
            fillOpacity="0.35"
          />
        </>
      )}
      {loai === 'lich-am' && (
        <>
          <rect x="9" y="10" width="30" height="31" rx="1.5" />
          <path d="M9 17h30M16 6v7M32 6v7" />
          <path
            d="M27.5 22.5a7.5 7.5 0 1 0 4.2 10.8 5.8 5.8 0 1 1-4.2-10.8z"
            fill="url(#ck-vl-i)"
            fillOpacity="0.4"
          />
        </>
      )}
      {loai === 'menh' && (
        <>
          <circle cx="24" cy="24" r="16" />
          <path d="M24 11l7.6 5.5-2.9 9H19.3l-2.9-9z" fill="url(#ck-vl-i)" fillOpacity="0.22" />
          <circle cx="24" cy="11" r="2" fill="url(#ck-vl-i)" />
          <circle cx="36" cy="20" r="2" fill="url(#ck-vl-i)" />
          <circle cx="31.5" cy="34" r="2" fill="url(#ck-vl-i)" />
          <circle cx="16.5" cy="34" r="2" fill="url(#ck-vl-i)" />
          <circle cx="12" cy="20" r="2" fill="url(#ck-vl-i)" />
        </>
      )}
      {loai === 'vo-chong' && (
        <>
          <circle cx="19" cy="24" r="10" />
          <circle cx="29" cy="24" r="10" />
          <path
            d="M24 17.5c-1.4-2.1-4.4-1.1-3.6 1.3.6 1.6 3.6 3.7 3.6 3.7s3-2.1 3.6-3.7c.8-2.4-2.2-3.4-3.6-1.3z"
            fill="url(#ck-vl-i)"
            fillOpacity="0.55"
          />
        </>
      )}
      {loai === 'bat-tu' && (
        <>
          <path d="M5 8h38M5 42h38" />
          <rect x="8" y="12" width="6" height="26" />
          <rect x="17" y="12" width="6" height="26" />
          <rect x="26" y="12" width="6" height="26" />
          <rect x="35" y="12" width="6" height="26" />
          <path d="M8 25h6M17 25h6M26 25h6M35 25h6" />
        </>
      )}
      {loai === 'tron-doi' && (
        <>
          <path
            d="M24 12c-4-3-10-4-16-3v29c6-1 12 0 16 3 4-3 10-4 16-3V9c-6-1-12 0-16 3z"
            fill="url(#ck-vl-i)"
            fillOpacity="0.14"
          />
          <path d="M24 12v29M12 16h7M12 21h7M12 26h5M29 16h7M29 21h7M29 26h5" />
        </>
      )}
      {loai === 'sao' && (
        <>
          <circle cx="24" cy="24" r="17" strokeOpacity="0.5" />
          <path
            d="M24 8l3.5 11.5L39 23l-11.5 3.5L24 38l-3.5-11.5L9 23l11.5-3.5z"
            fill="url(#ck-vl-i)"
            fillOpacity="0.35"
          />
        </>
      )}
      {loai === 'doi-ngay' && (
        <>
          <circle cx="17" cy="20" r="8" fill="url(#ck-vl-i)" fillOpacity="0.22" />
          <path d="M17 8v3M17 29v3M5 20h3M26 20h3M8.5 11.5l2.2 2.2M23.3 26.3l2.2 2.2M25.5 11.5l-2.2 2.2M10.7 26.3l-2.2 2.2" />
          <path
            d="M35 22a8.5 8.5 0 1 0 4.8 12.2 6.5 6.5 0 1 1-4.8-12.2z"
            fill="url(#ck-vl-i)"
            fillOpacity="0.45"
          />
          <path d="M25 36h15m-3-3l3 3-3 3" />
        </>
      )}
      {loai === 'van-nien' && (
        <>
          <rect x="7" y="10" width="34" height="30" rx="1.5" />
          <path d="M7 18h34M15 6v6M33 6v6M15 24h5M22 24h5M29 24h5M15 30h5M22 30h5M29 30h5" />
        </>
      )}
      {loai === 'ngay-mai' && (
        <>
          <path d="M6 34h36" />
          <path d="M13 34a11 11 0 0 1 22 0" fill="url(#ck-vl-i)" fillOpacity="0.28" />
          <path d="M24 12v6M13 17l3.5 3.5M35 17l-3.5 3.5M9 27h4M35 27h4" />
        </>
      )}
      {loai === 'tet' && (
        <>
          <path d="M24 6v6" />
          <ellipse cx="24" cy="24" rx="12" ry="13" fill="url(#ck-vl-i)" fillOpacity="0.24" />
          <path d="M17 14c2 6 2 14 0 20M31 14c-2 6-2 14 0 20M18 11h12M18 37h12M24 37v6" />
        </>
      )}
      {loai === 'hoa-giap' && (
        <>
          <circle cx="24" cy="24" r="17" />
          <circle cx="24" cy="24" r="10.5" strokeDasharray="3 3" />
          <path d="M24 7v4M24 37v4M7 24h4M37 24h4" />
          <circle cx="24" cy="24" r="4" fill="url(#ck-vl-i)" fillOpacity="0.45" />
        </>
      )}
      {loai === 'nap-am' && (
        <>
          <rect x="8" y="9" width="32" height="30" rx="1.5" />
          <path d="M8 18h32M8 28h32M21 9v30" />
          <circle cx="14.5" cy="13.5" r="1.5" fill="url(#ck-vl-i)" />
          <circle cx="14.5" cy="23" r="1.5" fill="url(#ck-vl-i)" />
          <circle cx="14.5" cy="33.5" r="1.5" fill="url(#ck-vl-i)" />
        </>
      )}
      {loai === 'ngu-hanh' && (
        <>
          <circle cx="24" cy="24" r="16" strokeDasharray="2 3" />
          <path
            d="M24 8l3.7 10.5H39l-9 6.6 3.4 10.7L24 29.3l-9.4 6.5 3.4-10.7-9-6.6h11.3z"
            fill="url(#ck-vl-i)"
            fillOpacity="0.22"
          />
        </>
      )}
      {loai === 'mau-hop' && (
        <>
          <circle cx="24" cy="16" r="6" fill="url(#ck-vl-i)" fillOpacity="0.3" />
          <circle cx="15" cy="29" r="6" fill="url(#ck-vl-i)" fillOpacity="0.22" />
          <circle cx="33" cy="29" r="6" fill="url(#ck-vl-i)" fillOpacity="0.22" />
          <circle cx="24" cy="24" r="17" />
        </>
      )}
      {loai === 'con-giap' && (
        <>
          <circle cx="24" cy="24" r="16" />
          <path d="M24 10v6M24 32v6M10 24h6M32 24h6M14 14l4.2 4.2M29.8 29.8L34 34M34 14l-4.2 4.2M18.2 29.8L14 34" />
          <circle cx="24" cy="24" r="6.5" fill="url(#ck-vl-i)" fillOpacity="0.25" />
        </>
      )}
      {loai === 'xong-dat' && (
        <>
          <path d="M8 22L24 9l16 13" />
          <path d="M12 20v19h24V20" fill="url(#ck-vl-i)" fillOpacity="0.14" />
          <path d="M20 39V27h8v12" />
          <circle cx="24" cy="18" r="2.2" fill="url(#ck-vl-i)" />
        </>
      )}
      {loai === 'kinh-dich' && (
        <>
          <circle cx="24" cy="24" r="17" />
          <path d="M14 16h20M14 22h8M26 22h8M14 28h20M14 34h8M26 34h8" />
        </>
      )}
    </svg>
  );
}

/** Biểu tượng nhỏ 32×32 cho 3 cam kết từ R1_COPY. */
export function BieuTuongCamKet({ chiSo }: { chiSo: number }) {
  if (chiSo === 0) {
    return (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 25c-5-1.6-8.5-5.6-8.5-10.5 3.4 0 6.2 1.7 8.5 4.2 2.3-2.5 5.1-4.2 8.5-4.2 0 4.9-3.5 8.9-8.5 10.5z" />
        <path d="M16 18.5c-1.7-3.3-1.7-7.2 0-10.5 1.7 3.3 1.7 7.2 0 10.5z" />
      </svg>
    );
  }
  if (chiSo === 1) {
    return (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="5" y="8" width="22" height="16" rx="1.5" />
        <path d="M5 26L27 6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 9c-3-2.2-7-2.6-11-2v18c4-.6 8-.2 11 2 3-2.2 7-2.6 11-2V7c-4-.6-8-.2-11 2z" />
      <path d="M16 9v18" />
    </svg>
  );
}

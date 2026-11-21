import React from 'react';

/** Dấu triện son xemboi.vn */
export function TrienXemBoi({ className = 'r1e-trien-o' }: { className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 64 64" role="img" aria-label="Dấu triện xemboi">
        <g filter="url(#r1e-dau-moc)">
          <rect x="3" y="3" width="58" height="58" rx="4" fill="#A8231B" />
          <rect
            x="7.5"
            y="7.5"
            width="49"
            height="49"
            rx="1.5"
            fill="none"
            stroke="#FBEBC8"
            strokeWidth="1.8"
          />
          <path d="M12 32h40" stroke="#FBEBC8" strokeWidth="0.9" opacity="0.7" />
          <text
            x="32"
            y="27.5"
            textAnchor="middle"
            fill="#FBEBC8"
            fontFamily="var(--f-tieu)"
            fontWeight="800"
            fontSize="16.5"
            letterSpacing="0.6"
          >
            XEM
          </text>
          <text
            x="32"
            y="49"
            textAnchor="middle"
            fill="#FBEBC8"
            fontFamily="var(--f-tieu)"
            fontWeight="800"
            fontSize="16.5"
            letterSpacing="0.6"
          >
            BÓI
          </text>
        </g>
      </svg>
    </span>
  );
}

/** 4 góc hồi văn son cho tờ giấy / hộp thoại */
export function HoaVanGoc4() {
  return (
    <>
      {(['r1e-g1', 'r1e-g2', 'r1e-g3', 'r1e-g4'] as const).map((g) => (
        <svg key={g} className={`r1e-goc ${g}`} viewBox="0 0 40 40" aria-hidden="true">
          <path d="M2 38V2h36M7.5 33V7.5H33M13 28V13h15v9h-8v-4" />
        </svg>
      ))}
    </>
  );
}

/** 4 góc vàng lá 40px cho khung lá số và thẻ gói chính */
export function HoaVanGocVang4() {
  return (
    <>
      {(['r1e-g1', 'r1e-g2', 'r1e-g3', 'r1e-g4'] as const).map((g) => (
        <svg key={g} className={`r1e-goc-v ${g}`} viewBox="0 0 60 60" aria-hidden="true">
          <path d="M6 54V6H54" strokeWidth="2.6" />
          <path d="M14 38V14H38" strokeWidth="1.5" />
          <path d="M19.5 28V19.5h8.5v5H23.5v-2.5" strokeWidth="1.4" />
          <path
            d="M38 14c3-5 10-5 11.5 0 1 3.6-2.6 5.6-4.8 3.6M14 38c-5 3-5 10 0 11.5 3.6 1 5.6-2.6 3.6-4.8"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </>
  );
}

/** Họa tiết cuộn mây nhỏ */
export function HoaVanMay({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      className="r1e-may"
      viewBox="0 0 64 24"
      aria-hidden="true"
      style={flipped ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M8 19c-4.5 0-6-6-1.6-7.5C6 6.4 12.2 4.6 15.4 8.4 17.2 3 26.2 2.6 27.6 9c5-1 7.4 5.6 2.8 8.4M28 19H8" />
      <path d="M14 14.6c0-2.2 3.2-2.4 3.4-.3.1 1.3-1.6 1.8-2.1.8M22 12.4c.4-2.2 3.6-2 3.5.2-.1 1.3-1.8 1.6-2.2.6" />
      <path d="M36 17c0-4 5-5.6 7.4-2.6 1.6-3.8 7.6-3.4 8.2.8 3.6-.4 5 4.4 1.6 5.8H38c-1.4 0-2-1.8-2-4z" />
      <path d="M44 16.2c0-1.8 2.6-2 2.8-.2" />
    </svg>
  );
}

/** Ấn tròn kèm cuộn mây đầu mỗi mục */
export function AnTieuDe() {
  return (
    <svg className="r1e-an" viewBox="0 0 92 30" aria-hidden="true">
      <use href="#r1e-an-tieu" />
    </svg>
  );
}

/** Vạch chia có hạt thoi ở giữa */
export function ChiaVach() {
  return (
    <div className="r1e-chia" aria-hidden="true">
      <i />
      <b />
      <i />
    </div>
  );
}

const BAT_QUAI_QUE = [
  [1, 1, 1],
  [0, 1, 1],
  [0, 1, 0],
  [0, 0, 1],
  [0, 0, 0],
  [1, 0, 0],
  [1, 0, 1],
  [1, 1, 0],
] as const;

/** Bát quái chìm ở tâm Thiên bàn */
export function BatQuaiSvg() {
  return (
    <svg
      viewBox="-50 -50 100 100"
      aria-hidden="true"
      fill="currentColor"
      style={{ width: '100%', height: '100%' }}
    >
      <circle r="47" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle r="15" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M0-13a13 13 0 0 1 0 26a6.5 6.5 0 0 1 0-13a6.5 6.5 0 0 0 0-13z" />
      <circle cy="6.5" r="2.2" />
      <circle cy="-6.5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {BAT_QUAI_QUE.map((q, k) => (
        <g key={k} transform={`rotate(${k * 45})`}>
          {q.map((b, j) => {
            const y = -(24 + j * 6.5);
            return b ? (
              <rect key={j} x="-10" y={y} width="20" height="3.6" />
            ) : (
              <React.Fragment key={j}>
                <rect x="-10" y={y} width="8.4" height="3.6" />
                <rect x="1.6" y={y} width="8.4" height="3.6" />
              </React.Fragment>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

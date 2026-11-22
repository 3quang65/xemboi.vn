import React from 'react';
import Link from 'next/link';
import type { Hanh } from '@/lib/trang/can-chi';
import {
  HANH_HAN,
  HANH_MAU_HEX,
  HANH_SLUG,
} from './canChiHelpers';

interface NutHanh {
  hanh: Hanh;
  x: number;
  y: number;
}

const TAM_X = 230;
const TAM_Y = 222;
const BAN_KINH = 148;
const R_NUT = 38;

// Thứ tự vòng tròn tương sinh theo chiều kim đồng hồ: Hỏa → Thổ → Kim → Thủy → Mộc
const THU_TU_VONG: Hanh[] = ['Hỏa', 'Thổ', 'Kim', 'Thủy', 'Mộc'];

const CAC_NUT: NutHanh[] = THU_TU_VONG.map((hanh, i) => {
  const goc = ((-90 + i * 72) * Math.PI) / 180;
  return {
    hanh,
    x: Number((TAM_X + BAN_KINH * Math.cos(goc)).toFixed(1)),
    y: Number((TAM_Y + BAN_KINH * Math.sin(goc)).toFixed(1)),
  };
});

function timNut(hanh: Hanh): NutHanh {
  return CAC_NUT.find((n) => n.hanh === hanh)!;
}

function duongThangCoKhoangCach(a: NutHanh, b: NutHanh, lui: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy);
  const ux = dx / d;
  const uy = dy / d;
  return {
    x1: Number((a.x + ux * lui).toFixed(1)),
    y1: Number((a.y + uy * lui).toFixed(1)),
    x2: Number((b.x - ux * (lui + 5)).toFixed(1)),
    y2: Number((b.y - uy * (lui + 5)).toFixed(1)),
  };
}

function cungSinhCong(a: NutHanh, b: NutHanh) {
  const x1 = a.x - TAM_X;
  const y1 = a.y - TAM_Y;
  const x2 = b.x - TAM_X;
  const y2 = b.y - TAM_Y;
  const goc1 = Math.atan2(y1, x1);
  let goc2 = Math.atan2(y2, x2);
  if (goc2 <= goc1) goc2 += Math.PI * 2;
  const lechNut = (R_NUT + 8) / BAN_KINH;
  const g1 = goc1 + lechNut;
  const g2 = goc2 - lechNut - 0.04;
  return {
    sx: Number((TAM_X + BAN_KINH * Math.cos(g1)).toFixed(1)),
    sy: Number((TAM_Y + BAN_KINH * Math.sin(g1)).toFixed(1)),
    ex: Number((TAM_X + BAN_KINH * Math.cos(g2)).toFixed(1)),
    ey: Number((TAM_Y + BAN_KINH * Math.sin(g2)).toFixed(1)),
  };
}

const CAP_SINH: [Hanh, Hanh][] = [
  ['Mộc', 'Hỏa'],
  ['Hỏa', 'Thổ'],
  ['Thổ', 'Kim'],
  ['Kim', 'Thủy'],
  ['Thủy', 'Mộc'],
];

const CAP_KHAC: [Hanh, Hanh][] = [
  ['Mộc', 'Thổ'],
  ['Thổ', 'Thủy'],
  ['Thủy', 'Hỏa'],
  ['Hỏa', 'Kim'],
  ['Kim', 'Mộc'],
];

export default function SoDoNguHanh() {
  return (
    <div className="ck-so-do-khung">
      <svg
        className="ck-so-do-svg"
        viewBox="0 0 460 440"
        role="img"
        aria-labelledby="ck-so-do-tieu ck-so-do-mo-ta"
      >
        <title id="ck-so-do-tieu">Sơ đồ Ngũ hành tương sinh và tương khắc</title>
        <desc id="ck-so-do-mo-ta">
          Vòng ngoài chỉ chiều tương sinh: Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy,
          Thủy sinh Mộc. Ngôi sao bên trong chỉ chiều tương khắc: Mộc khắc Thổ, Thổ khắc Thủy, Thủy
          khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc.
        </desc>

        <defs>
          <marker
            id="ck-mui-sinh"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#1A7429" />
          </marker>
          <marker
            id="ck-mui-khac"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#8E1B12" />
          </marker>
        </defs>

        <circle
          cx={TAM_X}
          cy={TAM_Y}
          r={BAN_KINH}
          fill="none"
          stroke="#CDB58C"
          strokeWidth="1"
          strokeDasharray="2 4"
        />

        {CAP_SINH.map(([tu, den]) => {
          const arc = cungSinhCong(timNut(tu), timNut(den));
          return (
            <path
              key={`sinh-${tu}-${den}`}
              d={`M ${arc.sx} ${arc.sy} A ${BAN_KINH} ${BAN_KINH} 0 0 1 ${arc.ex} ${arc.ey}`}
              fill="none"
              stroke="#1A7429"
              strokeWidth="2.2"
              markerEnd="url(#ck-mui-sinh)"
            />
          );
        })}

        {CAP_KHAC.map(([tu, den]) => {
          const p = duongThangCoKhoangCach(timNut(tu), timNut(den), R_NUT + 5);
          return (
            <line
              key={`khac-${tu}-${den}`}
              x1={p.x1}
              y1={p.y1}
              x2={p.x2}
              y2={p.y2}
              stroke="#8E1B12"
              strokeWidth="1.8"
              strokeDasharray="6 4"
              markerEnd="url(#ck-mui-khac)"
            />
          );
        })}

        {CAC_NUT.map((nut) => {
          const mau = HANH_MAU_HEX[nut.hanh];
          return (
            <Link key={nut.hanh} href={`/ngu-hanh/${HANH_SLUG[nut.hanh]}`}>
              <g className="ck-so-do-nut">
                <circle
                  cx={nut.x}
                  cy={nut.y}
                  r={R_NUT}
                  fill="#FBF7EE"
                  stroke={mau}
                  strokeWidth="2.5"
                />
                <circle
                  cx={nut.x}
                  cy={nut.y}
                  r={R_NUT - 4.5}
                  fill="none"
                  stroke={mau}
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
                <text
                  x={nut.x}
                  y={nut.y - 4}
                  textAnchor="middle"
                  fill={mau}
                  fontSize="19"
                  fontWeight="700"
                >
                  {HANH_HAN[nut.hanh]}
                </text>
                <text
                  x={nut.x}
                  y={nut.y + 17}
                  textAnchor="middle"
                  fill="#1F140D"
                  fontSize="13.5"
                  fontWeight="700"
                >
                  {nut.hanh}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>

      <div className="ck-so-do-chu-thich">
        <span>
          <i className="ck-net-sinh" aria-hidden="true" />
          Vòng ngoài (nét liền): <b>Tương sinh</b>
        </span>
        <span>
          <i className="ck-net-khac" aria-hidden="true" />
          Sao trong (nét đứt): <b>Tương khắc</b>
        </span>
      </div>
    </div>
  );
}

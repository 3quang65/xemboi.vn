import Link from 'next/link';
import type { Hanh } from '@/lib/trang/can-chi';
import { vongNguHanh, type VongNguHanh as VongNguHanhData } from '@/lib/trang/tra-cuu-truc-quan';
import { HANH_SLUG, duongDanHanh } from '@/components/ck/canChiHelpers';
import './truc-quan.css';

export interface VongNguHanhProps {
  chon?: Hanh;
  idPrefix?: string;
  className?: string;
}

const CX = 180;
const CY = 186;
const R_RING = 123;
const R_NODE = 40;

const HANH_FILL_NHAT: Record<Hanh, string> = {
  Mộc: 'var(--ck-moc-nhat, #E6EFE3)',
  Hỏa: 'var(--ck-hoa-nhat, #FBE9DF)',
  Thổ: 'var(--ck-tho-nhat, #F4E7D4)',
  Kim: 'var(--ck-kim-nhat, #ECEAE4)',
  Thủy: 'var(--ck-thuy-nhat, #E4EBF4)',
};

const HANH_MAU_CHU: Record<Hanh, string> = {
  Mộc: 'var(--ck-moc, #1A7429)',
  Hỏa: 'var(--ck-hoa, #C8150C)',
  Thổ: 'var(--ck-tho, #A04F00)',
  Kim: 'var(--ck-kim, #5E6670)',
  Thủy: 'var(--ck-thuy, #102A5C)',
};

const NHAN_VAI_TRO: Record<
  Exclude<NonNullable<VongNguHanhData['dinh'][number]['vaiTro']>, 'chinh'>,
  string
> = {
  'sinh-ra': 'Sinh ra',
  'duoc-sinh': 'Sinh cho',
  khac: 'Khắc',
  'bi-khac': 'Bị khắc',
};

export function VongNguHanh({ chon, idPrefix, className }: VongNguHanhProps) {
  const data = vongNguHanh(chon);
  const prefix = idPrefix ?? (chon ? `ck-vnh-${HANH_SLUG[chon]}` : 'ck-vnh');
  const markerSinhId = `${prefix}-sinh`;
  const markerKhacId = `${prefix}-khac`;

  const toaDo = new Map(
    data.dinh.map((d) => [
      d.hanh,
      {
        ...d,
        nx: Number((CX + R_RING * d.x).toFixed(2)),
        ny: Number((CY + R_RING * d.y).toFixed(2)),
      },
    ]),
  );

  // Vẽ cạnh mờ trước, cạnh nổi bật sau để không bị đè nét
  const danhSachCanh = [...data.canh].sort(
    (a, b) => Number(a.noiBat) - Number(b.noiBat),
  );

  const moTaSinh = data.canh
    .filter((c) => c.loai === 'sinh')
    .map((c) => `${c.tu} sinh ${c.den}`)
    .join(', ');
  const moTaKhac = data.canh
    .filter((c) => c.loai === 'khac')
    .map((c) => `${c.tu} khắc ${c.den}`)
    .join(', ');
  const ariaLabel = `${chon ? `Vòng ngũ hành đang chọn hành ${chon}. ` : 'Vòng ngũ hành. '}Tương sinh: ${moTaSinh}. Tương khắc: ${moTaKhac}.`;

  return (
    <div className={className ? `ck-tq-vnh-khung ${className}` : 'ck-tq-vnh-khung'}>
      <svg
        viewBox="0 0 360 360"
        className="ck-tq-vnh-svg"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <marker
            id={markerSinhId}
            markerUnits="userSpaceOnUse"
            markerWidth="11"
            markerHeight="11"
            refX="8"
            refY="5"
            orient="auto-start-reverse"
          >
            <path d="M 1 1.5 L 9.5 5 L 1 8.5 z" fill="#1A7429" />
          </marker>
          <marker
            id={markerKhacId}
            markerUnits="userSpaceOnUse"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto-start-reverse"
          >
            <path d="M 1 1.8 L 9 5 L 1 8.2 z" fill="#5A4636" />
          </marker>
        </defs>

        <circle
          cx={CX}
          cy={CY}
          r={R_RING}
          fill="none"
          stroke="#D5BF92"
          strokeWidth={1}
          strokeDasharray="2 4"
        />

        {danhSachCanh.map((c) => {
          const a = toaDo.get(c.tu)!;
          const b = toaDo.get(c.den)!;
          const doMo = chon ? (c.noiBat ? 1 : 0.3) : 1;

          if (c.loai === 'sinh') {
            const g1 = Math.atan2(a.y, a.x) + (R_NODE + 5) / R_RING;
            let g2 = Math.atan2(b.y, b.x) - (R_NODE + 11) / R_RING;
            if (g2 <= g1) g2 += Math.PI * 2;
            const sx = (CX + R_RING * Math.cos(g1)).toFixed(2);
            const sy = (CY + R_RING * Math.sin(g1)).toFixed(2);
            const ex = (CX + R_RING * Math.cos(g2)).toFixed(2);
            const ey = (CY + R_RING * Math.sin(g2)).toFixed(2);

            return (
              <g
                key={`sinh-${c.tu}-${c.den}`}
                opacity={doMo}
                data-loai="sinh"
                data-tu={HANH_SLUG[c.tu]}
                data-den={HANH_SLUG[c.den]}
                data-noi-bat={c.noiBat ? '1' : '0'}
              >
                <path
                  d={`M ${sx} ${sy} A ${R_RING} ${R_RING} 0 0 1 ${ex} ${ey}`}
                  fill="none"
                  stroke="var(--ck-moc, #1A7429)"
                  strokeWidth={c.noiBat ? 3 : chon ? 1.7 : 2.3}
                  strokeLinecap="round"
                  markerEnd={`url(#${markerSinhId})`}
                />
              </g>
            );
          }

          const dx = b.nx - a.nx;
          const dy = b.ny - a.ny;
          const d = Math.hypot(dx, dy);
          const ux = dx / d;
          const uy = dy / d;
          const x1 = (a.nx + ux * (R_NODE + 5)).toFixed(2);
          const y1 = (a.ny + uy * (R_NODE + 5)).toFixed(2);
          const x2 = (b.nx - ux * (R_NODE + 11)).toFixed(2);
          const y2 = (b.ny - uy * (R_NODE + 11)).toFixed(2);

          return (
            <g
              key={`khac-${c.tu}-${c.den}`}
              opacity={doMo}
              data-loai="khac"
              data-tu={HANH_SLUG[c.tu]}
              data-den={HANH_SLUG[c.den]}
              data-noi-bat={c.noiBat ? '1' : '0'}
            >
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#5A4636"
                strokeWidth={c.noiBat ? 2.5 : chon ? 1.5 : 1.9}
                strokeDasharray="7 4"
                markerEnd={`url(#${markerKhacId})`}
              />
            </g>
          );
        })}

        {data.dinh.map((d) => {
          const { nx, ny } = toaDo.get(d.hanh)!;
          const mau = HANH_MAU_CHU[d.hanh];
          const fillNhat = HANH_FILL_NHAT[d.hanh];
          const laChinh = d.vaiTro === 'chinh';
          const nhanVaiTro =
            d.vaiTro && d.vaiTro !== 'chinh' ? NHAN_VAI_TRO[d.vaiTro] : null;

          return (
            <Link
              key={d.hanh}
              href={duongDanHanh(d.hanh)}
              aria-label={`Hành ${d.hanh}${nhanVaiTro ? ` (${nhanVaiTro})` : laChinh ? ' (đang chọn)' : ''}`}
            >
              <g
                className="ck-tq-vnh-nut"
                data-hanh={HANH_SLUG[d.hanh]}
                data-vai-tro={d.vaiTro ?? ''}
              >
                {laChinh ? (
                  <circle
                    cx={nx}
                    cy={ny}
                    r={R_NODE + 5}
                    fill="none"
                    stroke="var(--ck-son, #8E1B12)"
                    strokeWidth={2.2}
                  />
                ) : null}
                <circle
                  cx={nx}
                  cy={ny}
                  r={R_NODE}
                  fill={fillNhat}
                  stroke={mau}
                  strokeWidth={laChinh ? 3 : 2.2}
                />
                {nhanVaiTro ? (
                  <>
                    <text
                      x={nx}
                      y={ny - 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={16.5}
                      fontWeight={700}
                      fill={mau}
                    >
                      {d.hanh}
                    </text>
                    <text
                      x={nx}
                      y={ny + 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={15}
                      fontWeight={600}
                      fill="var(--ck-muc, #1F140D)"
                    >
                      {nhanVaiTro}
                    </text>
                  </>
                ) : (
                  <text
                    x={nx}
                    y={ny}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={17}
                    fontWeight={700}
                    fill={mau}
                  >
                    {d.hanh}
                  </text>
                )}
              </g>
            </Link>
          );
        })}
      </svg>

      <ul className="ck-tq-vnh-cg" aria-label="Chú giải vòng ngũ hành">
        <li>
          <svg width="30" height="12" viewBox="0 0 30 12" aria-hidden="true">
            <line
              x1="2"
              y1="6"
              x2="23"
              y2="6"
              stroke="var(--ck-moc, #1A7429)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path d="M 21 2.5 L 28.5 6 L 21 9.5 z" fill="#1A7429" />
          </svg>
          <span>Tương sinh (vòng ngoài, nét liền)</span>
        </li>
        <li>
          <svg width="30" height="12" viewBox="0 0 30 12" aria-hidden="true">
            <line
              x1="2"
              y1="6"
              x2="23"
              y2="6"
              stroke="#5A4636"
              strokeWidth="2"
              strokeDasharray="6 3"
            />
            <path d="M 21 2.5 L 28.5 6 L 21 9.5 z" fill="#5A4636" />
          </svg>
          <span>Tương khắc (ngôi sao, nét đứt)</span>
        </li>
      </ul>
    </div>
  );
}

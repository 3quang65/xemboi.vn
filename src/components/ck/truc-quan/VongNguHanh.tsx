import Link from 'next/link';
import type { Hanh } from '@/lib/trang/can-chi';
import { vongNguHanh, type VongNguHanh as VongNguHanhData } from '@/lib/trang/tra-cuu-truc-quan';
import { HANH_SLUG, duongDanHanh } from '@/components/ck/canChiHelpers';
import './truc-quan.css';

export type QuanHeVoiNhatChuProp = 'cùng hành' | 'ta sinh' | 'ta khắc' | 'khắc ta' | 'sinh ta';

export interface VongNguHanhProps {
  chon?: Hanh;
  quanHeThapThan?: {
    quanHe: QuanHeVoiNhatChuProp;
    tenThan: string;
    nhom: string;
    cungAmDuong: boolean;
  };
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

export function VongNguHanh({ chon, quanHeThapThan, idPrefix, className }: VongNguHanhProps) {
  if (quanHeThapThan) {
    const CX_TT = 190;
    const CY_TT = 190;
    const prefixTt = idPrefix ?? 'ck-vnh-tt';
    const markerSinhTt = `${prefixTt}-sinh`;
    const markerKhacTt = `${prefixTt}-khac`;
    const qh = quanHeThapThan.quanHe;
    const laCungHanh = qh === 'cùng hành';

    const nutNgoai: {
      ma: Exclude<QuanHeVoiNhatChuProp, 'cùng hành'>;
      x: number;
      y: number;
      nhom: string;
      vai: string;
      loai: 'sinh' | 'khac';
      line: { x1: number; y1: number; x2: number; y2: number };
    }[] = [
      {
        ma: 'sinh ta',
        x: CX_TT,
        y: 52,
        nhom: 'Ấn',
        vai: 'Sinh ta',
        loai: 'sinh',
        line: { x1: CX_TT, y1: 86, x2: CX_TT, y2: 138 },
      },
      {
        ma: 'ta sinh',
        x: 320,
        y: CY_TT,
        nhom: 'Thực thương',
        vai: 'Ta sinh',
        loai: 'sinh',
        line: { x1: 240, y1: CY_TT, x2: 262, y2: CY_TT },
      },
      {
        ma: 'ta khắc',
        x: CX_TT,
        y: 328,
        nhom: 'Tài',
        vai: 'Ta khắc',
        loai: 'khac',
        line: { x1: CX_TT, y1: 240, x2: CX_TT, y2: 292 },
      },
      {
        ma: 'khắc ta',
        x: 60,
        y: CY_TT,
        nhom: 'Quan sát',
        vai: 'Khắc ta',
        loai: 'khac',
        line: { x1: 118, y1: CY_TT, x2: 140, y2: CY_TT },
      },
    ];

    const ariaLabelTt = `Sơ đồ quan hệ ngũ hành của ${quanHeThapThan.tenThan} (${quanHeThapThan.nhom}): ${quanHeThapThan.quanHe} với nhật chủ, ${quanHeThapThan.cungAmDuong ? 'cùng âm dương' : 'khác âm dương'}.`;

    return (
      <div className={className ? `ck-tq-vnh-khung ${className}` : 'ck-tq-vnh-khung'}>
        <svg viewBox="0 0 380 380" className="ck-tq-vnh-svg" role="img" aria-label={ariaLabelTt}>
          <defs>
            <marker
              id={markerSinhTt}
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
              id={markerKhacTt}
              markerUnits="userSpaceOnUse"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="5"
              orient="auto-start-reverse"
            >
              <path d="M 1 1.8 L 9 5 L 1 8.2 z" fill="#8A560F" />
            </marker>
          </defs>

          <circle
            cx={CX_TT}
            cy={CY_TT}
            r={138}
            fill="none"
            stroke="#D5BF92"
            strokeWidth={1}
            strokeDasharray="2 4"
          />

          {nutNgoai.map((n) => {
            const active = qh === n.ma;
            const doMo = active ? 1 : 0.35;
            const laSinh = n.loai === 'sinh';
            return (
              <g key={`line-${n.ma}`} opacity={doMo}>
                <line
                  x1={n.line.x1}
                  y1={n.line.y1}
                  x2={n.line.x2}
                  y2={n.line.y2}
                  stroke={laSinh ? 'var(--ck-moc, #1A7429)' : '#8A560F'}
                  strokeWidth={active ? 3.2 : 1.8}
                  strokeDasharray={laSinh ? undefined : '7 4'}
                  markerEnd={`url(#${laSinh ? markerSinhTt : markerKhacTt})`}
                />
              </g>
            );
          })}

          {laCungHanh ? (
            <circle
              cx={CX_TT}
              cy={CY_TT}
              r={54}
              fill="none"
              stroke="var(--ck-son, #8E1B12)"
              strokeWidth={2.5}
              strokeDasharray="5 3"
            />
          ) : null}

          <circle
            cx={CX_TT}
            cy={CY_TT}
            r={47}
            fill={laCungHanh ? '#FFF4DC' : '#FAF0DC'}
            stroke="var(--ck-son, #8E1B12)"
            strokeWidth={laCungHanh ? 3 : 2.2}
          />
          <text
            x={CX_TT}
            y={laCungHanh ? CY_TT - 14 : CY_TT - 7}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={16}
            fontWeight={700}
            fill="var(--ck-son, #8E1B12)"
          >
            Nhật chủ
          </text>
          <text
            x={CX_TT}
            y={laCungHanh ? CY_TT + 4 : CY_TT + 13}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={14}
            fontWeight={600}
            fill="var(--ck-muc-2, #4A3829)"
          >
            {laCungHanh ? quanHeThapThan.tenThan : 'Ta (can ngày)'}
          </text>
          {laCungHanh ? (
            <text
              x={CX_TT}
              y={CY_TT + 21}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={14}
              fontWeight={700}
              fill="var(--ck-son, #8E1B12)"
            >
              Cùng hành
            </text>
          ) : null}

          {nutNgoai.map((n) => {
            const active = qh === n.ma;
            const laSinh = n.loai === 'sinh';
            const fill = active
              ? laSinh
                ? 'var(--ck-moc-nhat, #E6EFE3)'
                : '#FAF1DC'
              : '#FFFDF8';
            const stroke = active
              ? laSinh
                ? 'var(--ck-moc, #1A7429)'
                : '#B7791F'
              : '#C9AE78';

            return (
              <g key={n.ma} opacity={active ? 1 : 0.48}>
                <rect
                  x={n.x - 55}
                  y={n.y - 31}
                  width={110}
                  height={62}
                  rx={8}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={active ? 2.8 : 1.3}
                />
                <text
                  x={n.x}
                  y={n.y - 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14.5}
                  fontWeight={700}
                  fill={active ? 'var(--ck-son, #8E1B12)' : 'var(--ck-muc, #1F140D)'}
                >
                  {active ? quanHeThapThan.tenThan : n.nhom}
                </text>
                <text
                  x={n.x}
                  y={n.y + 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  fontWeight={600}
                  fill={active ? (laSinh ? '#1A7429' : '#8A560F') : 'var(--ck-muc-3, #6A5442)'}
                >
                  {n.vai}
                </text>
              </g>
            );
          })}
        </svg>

        <ul className="ck-tq-vnh-cg" aria-label="Chú giải sơ đồ thập thần">
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
            <span>Tương sinh (Ấn · Thực thương)</span>
          </li>
          <li>
            <svg width="30" height="12" viewBox="0 0 30 12" aria-hidden="true">
              <line
                x1="2"
                y1="6"
                x2="23"
                y2="6"
                stroke="#8A560F"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
              <path d="M 21 2.5 L 28.5 6 L 21 9.5 z" fill="#8A560F" />
            </svg>
            <span>Tương khắc (Quan sát · Tài)</span>
          </li>
        </ul>
      </div>
    );
  }

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

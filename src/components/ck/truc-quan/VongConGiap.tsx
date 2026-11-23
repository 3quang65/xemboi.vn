import Link from 'next/link';
import type { Hanh } from '@/lib/trang/can-chi';
import { LUC_HOP, TAM_HOP } from '@/lib/trang/bat-tu-truc-quan';
import { quanHeHaiChi } from '@/lib/trang/cap-con-giap';
import { DIA_CHI } from '@/lib/tuvi-v2/am-lich';
import { quanHeConGiap, vongConGiap } from '@/lib/trang/tra-cuu-truc-quan';
import { ChuGiaiHanh } from './ChuGiaiHanh';
import './truc-quan.css';

export type KieuNetTraCuuKey = 'tamHop' | 'lucHop' | 'xung' | 'hai' | 'hinh';

export const KIEU_NET_TRA_CUU: Record<
  KieuNetTraCuuKey,
  {
    ten: string;
    color: string;
    dash?: string;
    width: number;
    cap: 'round' | 'butt';
    mauChu: string;
    mauNen: string;
    kieuVien: 'solid' | 'dotted' | 'dashed';
  }
> = {
  tamHop: {
    ten: 'Tam hợp',
    color: 'var(--ck-moc, #1A7429)',
    dash: undefined,
    width: 2.6,
    cap: 'round',
    mauChu: 'var(--ck-moc, #1A7429)',
    mauNen: 'var(--ck-moc-nhat, #E6EFE3)',
    kieuVien: 'solid',
  },
  lucHop: {
    ten: 'Lục hợp',
    color: 'var(--ck-moc, #1A7429)',
    dash: undefined,
    width: 1.5,
    cap: 'round',
    mauChu: 'var(--ck-moc, #1A7429)',
    mauNen: 'var(--ck-moc-nhat, #E6EFE3)',
    kieuVien: 'solid',
  },
  xung: {
    ten: 'Xung',
    color: '#B7791F',
    dash: '12 6',
    width: 2.5,
    cap: 'butt',
    mauChu: '#8A560F',
    mauNen: '#FAF1DC',
    kieuVien: 'dashed',
  },
  hai: {
    ten: 'Hại',
    color: '#6B5B7B',
    dash: '10 4 2 4',
    width: 2.3,
    cap: 'round',
    mauChu: '#564765',
    mauNen: '#F2EEF6',
    kieuVien: 'dashed',
  },
  hinh: {
    ten: 'Hình',
    color: '#7C4A2D',
    dash: '2 5',
    width: 3,
    cap: 'round',
    mauChu: '#6C3E24',
    mauNen: '#F6ECE4',
    kieuVien: 'dotted',
  },
};

export function MauNetTraCuuSvg({
  loai,
  width = 28,
}: {
  loai: KieuNetTraCuuKey;
  width?: number;
}) {
  const cfg = KIEU_NET_TRA_CUU[loai];
  return (
    <svg
      width={width}
      height={10}
      viewBox={`0 0 ${width} 10`}
      aria-hidden="true"
      className="ck-tq-vcg-mau-net"
    >
      <line
        x1={2}
        y1={5}
        x2={width - 2}
        y2={5}
        stroke={cfg.color}
        strokeWidth={cfg.width}
        strokeDasharray={cfg.dash}
        strokeLinecap={cfg.cap}
      />
    </svg>
  );
}

export interface VongConGiapProps {
  chiChon?: string;
  chiCap?: string;
  hienNetTongQuan?: boolean;
  nho?: boolean;
  idPrefix?: string;
  className?: string;
}

const CX = 210;
const CY = 210;
const R_OUT = 200;
const R_IN = 128;
const R_MID = 164;
const R_LINE = 122;

const HANH_FILL_NHAT: Record<Hanh, string> = {
  Mộc: 'var(--ck-moc-nhat, #E6EFE3)',
  Hỏa: 'var(--ck-hoa-nhat, #FBE9DF)',
  Thổ: 'var(--ck-tho-nhat, #F4E7D4)',
  Kim: 'var(--ck-kim-nhat, #ECEAE4)',
  Thủy: 'var(--ck-thuy-nhat, #E4EBF4)',
};

const HANH_STROKE: Record<Hanh, string> = {
  Mộc: 'var(--ck-moc, #1A7429)',
  Hỏa: 'var(--ck-hoa, #C8150C)',
  Thổ: 'var(--ck-tho, #A04F00)',
  Kim: 'var(--ck-kim, #5E6670)',
  Thủy: 'var(--ck-thuy, #102A5C)',
};

type Diem = { x: number; y: number };

const pt = (deg: number, r: number): Diem => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: Number((CX + r * Math.cos(rad)).toFixed(2)),
    y: Number((CY + r * Math.sin(rad)).toFixed(2)),
  };
};

function hinhQuat(d1: number, d2: number, rTrong: number, rNgoai: number): string {
  const p1 = pt(d1, rNgoai);
  const p2 = pt(d2, rNgoai);
  const p3 = pt(d2, rTrong);
  const p4 = pt(d1, rTrong);
  return `M ${p1.x} ${p1.y} A ${rNgoai} ${rNgoai} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rTrong} ${rTrong} 0 0 0 ${p4.x} ${p4.y} Z`;
}

/** Tạo cung Bézier bậc 2 để tách các dây trùng nhau (đặc biệt trên hình Dần: xung/hại/hình). */
function duongCong(p1: Diem, p2: Diem, lech: number): string {
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const dx = mx - CX;
  const dy = my - CY;
  const dist = Math.hypot(dx, dy);

  let cx = mx;
  let cy = my;
  if (dist < 8) {
    const vx = p2.x - p1.x;
    const vy = p2.y - p1.y;
    const len = Math.hypot(vx, vy) || 1;
    const px = -vy / len;
    const py = vx / len;
    const step = lech < 0 ? -28 : 28;
    cx = mx + px * step;
    cy = my + py * step;
  } else {
    const ux = dx / dist;
    const uy = dy / dist;
    cx = mx + ux * lech;
    cy = my + uy * lech;
  }
  return `M ${p1.x} ${p1.y} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${p2.x} ${p2.y}`;
}

export function VongConGiap({
  chiChon,
  chiCap,
  hienNetTongQuan = false,
  nho = false,
  idPrefix,
  className,
}: VongConGiapProps) {
  const vong = vongConGiap();
  const idxChon = chiChon ? (DIA_CHI as readonly string[]).indexOf(chiChon) : -1;
  const idxCap = chiCap ? (DIA_CHI as readonly string[]).indexOf(chiCap) : -1;
  const cheDoCap = idxChon >= 0 && idxCap >= 0;
  const qh = !cheDoCap && idxChon >= 0 ? quanHeConGiap(idxChon) : null;
  const qhCap = cheDoCap ? quanHeHaiChi(idxChon, idxCap) : null;
  const gocTheoChi = new Map(vong.map((v) => [v.chi, v.goc]));
  const ptChi = (chi: string) => pt(gocTheoChi.get(chi) ?? 0, R_LINE);

  // Vẽ ô đang chọn sau cùng để viền son không bị ô kề đè mất
  const vongSapXep = [...vong].sort(
    (a, b) =>
      Number(a.chi === chiChon || (cheDoCap && a.chi === chiCap)) -
      Number(b.chi === chiChon || (cheDoCap && b.chi === chiCap)),
  );

  const cacCapHinh: [string, string][] = [];
  if (qh?.hinh) {
    const ds = qh.hinh.chi;
    for (let i = 0; i < ds.length; i++) {
      for (let j = i + 1; j < ds.length; j++) {
        cacCapHinh.push([ds[i], ds[j]]);
      }
    }
  }

  const diemNoiBat = new Set<string>();
  if (qh) {
    diemNoiBat.add(qh.chi);
    qh.tamHop.chi.forEach((c) => diemNoiBat.add(c));
    diemNoiBat.add(qh.lucHop);
    diemNoiBat.add(qh.xung);
    diemNoiBat.add(qh.hai);
    qh.hinh?.chi.forEach((c) => diemNoiBat.add(c));
  }

  const netCap: KieuNetTraCuuKey[] = [];
  if (qhCap) {
    for (const q of qhCap) {
      const k: KieuNetTraCuuKey | null =
        q.loai === 'tam-hop'
          ? 'tamHop'
          : q.loai === 'luc-hop'
            ? 'lucHop'
            : q.loai === 'xung'
              ? 'xung'
              : q.loai === 'hai'
                ? 'hai'
                : q.loai === 'hinh' || q.loai === 'tu-hinh'
                  ? 'hinh'
                  : null;
      if (k && !netCap.includes(k)) netCap.push(k);
    }
  }
  const coTamHoiCap = qhCap?.some((q) => q.loai === 'tam-hoi') ?? false;
  const cungChiCap = cheDoCap && idxChon === idxCap;

  const ariaLabel =
    cheDoCap && qhCap
      ? `Vòng 12 con giáp cho cặp ${chiChon} và ${chiCap}: ${qhCap.length > 0 ? qhCap.map((q) => q.ten).join(', ') : 'không thuộc nhóm hợp, xung, hình, hại nào'}.`
      : qh
        ? `Vòng 12 con giáp đang chọn tuổi ${qh.chi}. Tam hợp ${qh.tamHop.chi.join(', ')}; lục hợp ${qh.lucHop}; xung ${qh.xung}; hại ${qh.hai}; ${qh.hinh ? `hình ${qh.hinh.chi.join(', ')}` : qh.tuHinh ? 'tự hình' : 'không có tương hình'}.`
        : hienNetTongQuan
          ? 'Vòng 12 con giáp theo chiều kim đồng hồ từ Tý đến Hợi, kèm các nét tam hợp, lục hợp và lục xung.'
          : 'Vòng 12 con giáp theo chiều kim đồng hồ từ Tý đến Hợi, tô màu theo hành của địa chi.';

  const svgCls = nho ? 'ck-tq-vcg-svg ck-tq-vcg-svg-nho' : 'ck-tq-vcg-svg';
  const khungCls = className ? `ck-tq-vcg-khung ${className}` : 'ck-tq-vcg-khung';

  return (
    <div className={khungCls} data-prefix={idPrefix}>
      <svg viewBox="0 0 420 420" className={svgCls} role="img" aria-label={ariaLabel}>
        <circle
          cx={CX}
          cy={CY}
          r={R_IN - 2}
          fill="#FFFDF8"
          stroke="#CDB58C"
          strokeWidth={1}
        />

        {vongSapXep.map((item) => {
          const laChon = item.chi === chiChon || (cheDoCap && item.chi === chiCap);
          const pos = pt(item.goc, R_MID);
          const stroke = laChon ? 'var(--ck-son, #8E1B12)' : HANH_STROKE[item.hanh];

          return (
            <Link
              key={item.chi}
              href={`/con-giap/${item.slug}`}
              aria-label={`Tuổi ${item.chi} (${item.ten}), hành ${item.hanh}${laChon ? ' (đang xem)' : ''}`}
            >
              <g
                className="ck-tq-vcg-o"
                data-chi={item.chi}
                data-chon={laChon ? '1' : '0'}
              >
                <path
                  d={hinhQuat(item.goc - 15, item.goc + 15, R_IN, R_OUT)}
                  fill={HANH_FILL_NHAT[item.hanh]}
                  stroke={stroke}
                  strokeWidth={laChon ? 3.2 : 1.2}
                  strokeOpacity={laChon ? 1 : 0.65}
                />
                <text
                  className="ck-tq-vcg-chi"
                  x={pos.x}
                  y={pos.y - 7}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={16.5}
                  fontWeight={700}
                  fill={laChon ? 'var(--ck-son, #8E1B12)' : HANH_STROKE[item.hanh]}
                >
                  {item.chi}
                </text>
                <text
                  className="ck-tq-vcg-ten-con"
                  x={pos.x}
                  y={pos.y + 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  fontWeight={500}
                  fill="var(--ck-muc-2, #4A3829)"
                >
                  {item.ten}
                </text>
              </g>
            </Link>
          );
        })}

        {cheDoCap && qhCap ? (
          <g pointerEvents="none">
            {cungChiCap ? (
              <>
                {qhCap.some((q) => q.loai === 'tu-hinh') ? (
                  <circle
                    data-quan-he="hinh"
                    cx={pt(gocTheoChi.get(chiChon!) ?? 0, R_LINE - 16).x}
                    cy={pt(gocTheoChi.get(chiChon!) ?? 0, R_LINE - 16).y}
                    r={13}
                    fill="none"
                    stroke={KIEU_NET_TRA_CUU.hinh.color}
                    strokeWidth={KIEU_NET_TRA_CUU.hinh.width}
                    strokeDasharray={KIEU_NET_TRA_CUU.hinh.dash}
                    strokeLinecap={KIEU_NET_TRA_CUU.hinh.cap}
                  />
                ) : null}
                <text
                  x={CX}
                  y={CY - 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={18}
                  fontWeight={700}
                  fill="var(--ck-son, #8E1B12)"
                >
                  Cùng tuổi {chiChon}
                </text>
                <text
                  x={CX}
                  y={CY + 14}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15.5}
                  fontWeight={600}
                  fill={qhCap.length > 0 ? '#6C3E24' : 'var(--ck-muc-3, #6A5442)'}
                >
                  {qhCap.length > 0 ? 'Tự hình' : 'Không có tự hình'}
                </text>
              </>
            ) : (
              <>
                {qhCap.map((q) => {
                  const pA = ptChi(chiChon!);
                  const pB = ptChi(chiCap!);
                  if (q.loai === 'tam-hop') {
                    return (
                      <path
                        key="cap-tam-hop"
                        data-quan-he="tam-hop"
                        d={duongCong(pA, pB, 18)}
                        fill="none"
                        stroke={KIEU_NET_TRA_CUU.tamHop.color}
                        strokeWidth={KIEU_NET_TRA_CUU.tamHop.width}
                        strokeLinecap={KIEU_NET_TRA_CUU.tamHop.cap}
                      />
                    );
                  }
                  if (q.loai === 'luc-hop') {
                    return (
                      <path
                        key="cap-luc-hop"
                        data-quan-he="luc-hop"
                        d={duongCong(pA, pB, 8)}
                        fill="none"
                        stroke={KIEU_NET_TRA_CUU.lucHop.color}
                        strokeWidth={KIEU_NET_TRA_CUU.lucHop.width}
                        strokeLinecap={KIEU_NET_TRA_CUU.lucHop.cap}
                      />
                    );
                  }
                  if (q.loai === 'xung') {
                    return (
                      <line
                        key="cap-xung"
                        data-quan-he="xung"
                        x1={pA.x}
                        y1={pA.y}
                        x2={pB.x}
                        y2={pB.y}
                        stroke={KIEU_NET_TRA_CUU.xung.color}
                        strokeWidth={KIEU_NET_TRA_CUU.xung.width}
                        strokeDasharray={KIEU_NET_TRA_CUU.xung.dash}
                        strokeLinecap={KIEU_NET_TRA_CUU.xung.cap}
                      />
                    );
                  }
                  if (q.loai === 'hai') {
                    return (
                      <path
                        key="cap-hai"
                        data-quan-he="hai"
                        d={duongCong(pA, pB, 24)}
                        fill="none"
                        stroke={KIEU_NET_TRA_CUU.hai.color}
                        strokeWidth={KIEU_NET_TRA_CUU.hai.width}
                        strokeDasharray={KIEU_NET_TRA_CUU.hai.dash}
                        strokeLinecap={KIEU_NET_TRA_CUU.hai.cap}
                      />
                    );
                  }
                  if (q.loai === 'hinh') {
                    return (
                      <path
                        key="cap-hinh"
                        data-quan-he="hinh"
                        d={duongCong(pA, pB, -22)}
                        fill="none"
                        stroke={KIEU_NET_TRA_CUU.hinh.color}
                        strokeWidth={KIEU_NET_TRA_CUU.hinh.width}
                        strokeDasharray={KIEU_NET_TRA_CUU.hinh.dash}
                        strokeLinecap={KIEU_NET_TRA_CUU.hinh.cap}
                      />
                    );
                  }
                  if (q.loai === 'tam-hoi') {
                    return (
                      <path
                        key="cap-tam-hoi"
                        data-quan-he="tam-hoi"
                        d={duongCong(pA, pB, -10)}
                        fill="none"
                        stroke="#8A7656"
                        strokeWidth={1.8}
                        strokeDasharray="4 4"
                        strokeOpacity={0.85}
                      />
                    );
                  }
                  return null;
                })}

                {qhCap.length === 0 ? (
                  <>
                    <text
                      x={CX}
                      y={CY - 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={18}
                      fontWeight={700}
                      fill="var(--ck-son, #8E1B12)"
                    >
                      {chiChon} – {chiCap}
                    </text>
                    <text
                      x={CX}
                      y={CY + 14}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={15.5}
                      fill="var(--ck-muc-3, #6A5442)"
                    >
                      Không có quan hệ
                    </text>
                  </>
                ) : null}

                {[...new Set([chiChon!, chiCap!])].map((chi) => {
                  const p = ptChi(chi);
                  return (
                    <circle
                      key={`neo-cap-${chi}`}
                      cx={p.x}
                      cy={p.y}
                      r={4.5}
                      fill="var(--ck-son, #8E1B12)"
                      stroke="#FFFDF8"
                      strokeWidth={1.3}
                    />
                  );
                })}
              </>
            )}
          </g>
        ) : qh ? (
          <g pointerEvents="none">
            {/* 1. Tam hợp: tam giác nét liền --ck-moc */}
            <polygon
              data-quan-he="tam-hop"
              points={qh.tamHop.chi
                .map((c) => {
                  const p = ptChi(c);
                  return `${p.x},${p.y}`;
                })
                .join(' ')}
              fill="var(--ck-moc, #1A7429)"
              fillOpacity={0.07}
              stroke={KIEU_NET_TRA_CUU.tamHop.color}
              strokeWidth={KIEU_NET_TRA_CUU.tamHop.width}
              strokeLinejoin="round"
            />

            {/* 2. Lục hợp: nét liền mảnh, hơi cong ra ngoài để tách khỏi hình */}
            <path
              data-quan-he="luc-hop"
              d={duongCong(ptChi(qh.chi), ptChi(qh.lucHop), 14)}
              fill="none"
              stroke={KIEU_NET_TRA_CUU.lucHop.color}
              strokeWidth={KIEU_NET_TRA_CUU.lucHop.width}
              strokeLinecap={KIEU_NET_TRA_CUU.lucHop.cap}
            />

            {/* 3. Xung: đường thẳng qua tâm, gạch dài, hổ phách #B7791F */}
            <line
              data-quan-he="xung"
              x1={ptChi(qh.chi).x}
              y1={ptChi(qh.chi).y}
              x2={ptChi(qh.xung).x}
              y2={ptChi(qh.xung).y}
              stroke={KIEU_NET_TRA_CUU.xung.color}
              strokeWidth={KIEU_NET_TRA_CUU.xung.width}
              strokeDasharray={KIEU_NET_TRA_CUU.xung.dash}
              strokeLinecap={KIEU_NET_TRA_CUU.xung.cap}
            />

            {/* 4. Hại: gạch-chấm, tím xám, cong ra ngoài */}
            <path
              data-quan-he="hai"
              d={duongCong(ptChi(qh.chi), ptChi(qh.hai), 20)}
              fill="none"
              stroke={KIEU_NET_TRA_CUU.hai.color}
              strokeWidth={KIEU_NET_TRA_CUU.hai.width}
              strokeDasharray={KIEU_NET_TRA_CUU.hai.dash}
              strokeLinecap={KIEU_NET_TRA_CUU.hai.cap}
            />

            {/* 5. Hình / Tự hình: chấm dày, nâu, cong vào trong */}
            {cacCapHinh.map(([a, b]) => (
              <path
                key={`hinh-${a}-${b}`}
                data-quan-he="hinh"
                d={duongCong(ptChi(a), ptChi(b), -20)}
                fill="none"
                stroke={KIEU_NET_TRA_CUU.hinh.color}
                strokeWidth={KIEU_NET_TRA_CUU.hinh.width}
                strokeDasharray={KIEU_NET_TRA_CUU.hinh.dash}
                strokeLinecap={KIEU_NET_TRA_CUU.hinh.cap}
              />
            ))}

            {!qh.hinh && qh.tuHinh ? (
              <circle
                data-quan-he="hinh"
                cx={pt(gocTheoChi.get(qh.chi) ?? 0, R_LINE - 16).x}
                cy={pt(gocTheoChi.get(qh.chi) ?? 0, R_LINE - 16).y}
                r={13}
                fill="none"
                stroke={KIEU_NET_TRA_CUU.hinh.color}
                strokeWidth={KIEU_NET_TRA_CUU.hinh.width}
                strokeDasharray={KIEU_NET_TRA_CUU.hinh.dash}
                strokeLinecap={KIEU_NET_TRA_CUU.hinh.cap}
              />
            ) : null}

            {/* Điểm neo ở vành trong */}
            {[...diemNoiBat].map((chi) => {
              const p = ptChi(chi);
              const laChon = chi === qh.chi;
              return (
                <circle
                  key={`neo-${chi}`}
                  cx={p.x}
                  cy={p.y}
                  r={laChon ? 4.5 : 3.2}
                  fill={laChon ? 'var(--ck-son, #8E1B12)' : '#5A4636'}
                  stroke="#FFFDF8"
                  strokeWidth={1.2}
                />
              );
            })}
          </g>
        ) : hienNetTongQuan ? (
          <g pointerEvents="none">
            {TAM_HOP.map(([ba], idx) => (
              <polygon
                key={`tq-th-${idx}`}
                data-quan-he="tam-hop"
                points={ba
                  .map((k) => {
                    const p = ptChi(DIA_CHI[k]);
                    return `${p.x},${p.y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={KIEU_NET_TRA_CUU.tamHop.color}
                strokeWidth={1.6}
                strokeOpacity={0.55}
                strokeLinejoin="round"
              />
            ))}

            {LUC_HOP.map(([a, b], idx) => (
              <path
                key={`tq-lh-${idx}`}
                data-quan-he="luc-hop"
                d={duongCong(ptChi(DIA_CHI[a]), ptChi(DIA_CHI[b]), 10)}
                fill="none"
                stroke={KIEU_NET_TRA_CUU.lucHop.color}
                strokeWidth={1.3}
                strokeOpacity={0.5}
              />
            ))}

            {Array.from({ length: 6 }, (_, i) => {
              const p1 = ptChi(DIA_CHI[i]);
              const p2 = ptChi(DIA_CHI[i + 6]);
              return (
                <line
                  key={`tq-xung-${i}`}
                  data-quan-he="xung"
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={KIEU_NET_TRA_CUU.xung.color}
                  strokeWidth={1.4}
                  strokeDasharray="8 6"
                  strokeOpacity={0.48}
                />
              );
            })}

            <circle
              cx={CX}
              cy={CY}
              r={52}
              fill="#FFFDF8"
              stroke="#CDB58C"
              strokeWidth={1.2}
            />
            <text
              x={CX}
              y={CY - 10}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={17}
              fontWeight={700}
              fill="var(--ck-son, #8E1B12)"
            >
              12 Địa chi
            </text>
            <text
              x={CX}
              y={CY + 14}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={16}
              fill="var(--ck-muc-3, #6A5442)"
            >
              Bấm chọn tuổi
            </text>
          </g>
        ) : (
          <g pointerEvents="none">
            <text
              x={CX}
              y={CY - 10}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={18}
              fontWeight={700}
              fill="var(--ck-son, #8E1B12)"
            >
              12 Địa chi
            </text>
            <text
              x={CX}
              y={CY + 14}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={15}
              fill="var(--ck-muc-3, #6A5442)"
            >
              Bấm một ô để xem
            </text>
          </g>
        )}
      </svg>

      {cheDoCap && qhCap ? (
        netCap.length > 0 || coTamHoiCap ? (
          <ul className="ck-tq-vcg-cg" aria-label="Chú giải kiểu nét quan hệ của cặp">
            {netCap.map((k) => (
              <li key={k}>
                <MauNetTraCuuSvg loai={k} />
                <span>{cungChiCap && k === 'hinh' ? 'Tự hình' : KIEU_NET_TRA_CUU[k].ten}</span>
              </li>
            ))}
            {coTamHoiCap ? (
              <li>
                <svg
                  width={28}
                  height={10}
                  viewBox="0 0 28 10"
                  aria-hidden="true"
                  className="ck-tq-vcg-mau-net"
                >
                  <line
                    x1={2}
                    y1={5}
                    x2={26}
                    y2={5}
                    stroke="#8A7656"
                    strokeWidth={1.8}
                    strokeDasharray="4 4"
                  />
                </svg>
                <span>Tam hội (cùng phương)</span>
              </li>
            ) : null}
          </ul>
        ) : (
          <ChuGiaiHanh className="ck-tq-vcg-hanh-cg" />
        )
      ) : qh ? (
        <ul className="ck-tq-vcg-cg" aria-label="Chú giải 5 kiểu nét quan hệ">
          <li>
            <MauNetTraCuuSvg loai="tamHop" />
            <span>Tam hợp</span>
          </li>
          <li>
            <MauNetTraCuuSvg loai="lucHop" />
            <span>Lục hợp</span>
          </li>
          <li>
            <MauNetTraCuuSvg loai="xung" />
            <span>Xung</span>
          </li>
          <li>
            <MauNetTraCuuSvg loai="hai" />
            <span>Hại</span>
          </li>
          <li>
            <MauNetTraCuuSvg loai="hinh" />
            <span>{qh.tuHinh && !qh.hinh ? 'Tự hình' : 'Hình'}</span>
          </li>
        </ul>
      ) : hienNetTongQuan ? (
        <>
          <ul className="ck-tq-vcg-cg" aria-label="Chú giải các nét tổng quan">
            <li>
              <MauNetTraCuuSvg loai="tamHop" />
              <span>Tam hợp</span>
            </li>
            <li>
              <MauNetTraCuuSvg loai="lucHop" />
              <span>Lục hợp</span>
            </li>
            <li>
              <MauNetTraCuuSvg loai="xung" />
              <span>Lục xung</span>
            </li>
          </ul>
          <ChuGiaiHanh className="ck-tq-vcg-hanh-cg" />
        </>
      ) : (
        <ChuGiaiHanh className="ck-tq-vcg-hanh-cg" />
      )}
    </div>
  );
}

import type { QuanHeLuuNien } from '@/lib/trang/bat-tu-luu-nien';
import {
  TEN_NHOM_QUAN_HE,
  type NhomQuanHe,
  type QuanHeTru,
} from '@/lib/trang/bat-tu-truc-quan';

export type MucQuanHeVe = QuanHeTru | QuanHeLuuNien;

export type KieuNetConfig = {
  color: string;
  dash?: string;
  width: number;
  cap: 'round' | 'butt';
  mauChu: string;
  mauNen: string;
  kieuVien: 'solid' | 'dotted' | 'dashed';
};

export const KIEU_NET_QUAN_HE: Record<NhomQuanHe, KieuNetConfig> = {
  hop: {
    color: 'var(--ck-moc)',
    dash: undefined,
    width: 2.2,
    cap: 'round',
    mauChu: 'var(--ck-moc)',
    mauNen: 'var(--ck-moc-nhat)',
    kieuVien: 'solid',
  },
  'chua-thanh': {
    color: '#6E6A63',
    dash: '2 7',
    width: 2.5,
    cap: 'round',
    mauChu: '#4E4A44',
    mauNen: '#F1EFEA',
    kieuVien: 'dotted',
  },
  xung: {
    color: '#B7791F',
    dash: '12 6',
    width: 2.4,
    cap: 'butt',
    mauChu: '#8A560F',
    mauNen: '#FAF1DC',
    kieuVien: 'dashed',
  },
  hinh: {
    color: '#7C4A2D',
    dash: '2 4',
    width: 2.8,
    cap: 'round',
    mauChu: '#6C3E24',
    mauNen: '#F6ECE4',
    kieuVien: 'dotted',
  },
  hai: {
    color: '#6B5B7B',
    dash: '10 4 2 4',
    width: 2.3,
    cap: 'round',
    mauChu: '#564765',
    mauNen: '#F2EEF6',
    kieuVien: 'dashed',
  },
};

const THU_TU_NHOM: NhomQuanHe[] = ['hop', 'chua-thanh', 'xung', 'hinh', 'hai'];
const TEN_TRU_HOA = ['Năm', 'Tháng', 'Ngày', 'Giờ', 'Lưu niên'] as const;

const COL_X_4 = [50, 150, 250, 350] as const;
const COL_X_5 = [50, 150, 250, 350, 450] as const;
const sangCotHienThi = (t: number) => (t === 4 ? 4 : 3 - t);
const LEVEL_STEP = 44;
const FIRST_DEPTH = 40;
const BASE_PAD = 6;
const OUTER_PAD = 24;

export function MauNetQuanHeSvg({
  nhom,
  width = 28,
}: {
  nhom: NhomQuanHe;
  width?: number;
}) {
  const cfg = KIEU_NET_QUAN_HE[nhom];
  return (
    <svg
      width={width}
      height={10}
      viewBox={`0 0 ${width} 10`}
      aria-hidden="true"
      className="ck-bt-mau-net-svg"
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

export function ChuGiaiQuanHe() {
  return (
    <ul className="ck-bt-cg-qh" aria-label="Chú giải kiểu nét quan hệ">
      {THU_TU_NHOM.map((nhom) => (
        <li key={nhom}>
          <MauNetQuanHeSvg nhom={nhom} width={28} />
          <span>{TEN_NHOM_QUAN_HE[nhom]}</span>
        </li>
      ))}
    </ul>
  );
}

export function nhanNganQuanHe(q: MucQuanHeVe): string {
  switch (q.loai) {
    case 'can-hop':
      return 'Can hợp';
    case 'luc-hop':
      return 'Lục hợp';
    case 'tam-hop':
      return q.hanh ? `Tam hợp ${q.hanh}` : 'Tam hợp';
    case 'tam-hoi':
      return q.hanh ? `Tam hội ${q.hanh}` : 'Tam hội';
    case 'thieu-tam-hop':
      return q.thieu ? `Thiếu ${q.thieu}` : 'Thiếu 1 chữ';
    case 'xung':
      return 'Xung';
    case 'hinh':
      return 'Hình';
    case 'tu-hinh':
      return 'Tự hình';
    case 'hai':
      return 'Hại';
  }
}

/** Tìm y trên đường cong Bézier bậc 3 đối xứng tại hoành độ x. */
function tinhYCuongCong(
  x: number,
  x0: number,
  x2: number,
  baseY: number,
  ctrlY: number,
): number {
  const span = x2 - x0;
  if (span <= 0) return baseY;
  const u = Math.max(0, Math.min(1, (x - x0) / span));
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 18; k++) {
    const mid = (lo + hi) / 2;
    const fx = 3 * mid * mid - 2 * mid * mid * mid;
    if (fx < u) lo = mid;
    else hi = mid;
  }
  const t = (lo + hi) / 2;
  return baseY + (ctrlY - baseY) * (3 * t * (1 - t));
}

type CungDaXep = {
  q: MucQuanHeVe;
  idxGoc: number;
  visCols: number[];
  left: number;
  right: number;
  span: number;
  level: number;
  xOffset: number;
};

function xepTangCung(danhSach: MucQuanHeVe[]): CungDaXep[] {
  const chuanHoa = danhSach.map((q, idxGoc) => {
    const visCols = q.tru.map((t) => sangCotHienThi(t)).sort((a, b) => a - b);
    const left = visCols[0];
    const right = visCols[visCols.length - 1];
    return {
      q,
      idxGoc,
      visCols,
      left,
      right,
      span: right - left,
    };
  });

  chuanHoa.sort(
    (a, b) => a.span - b.span || a.left - b.left || a.idxGoc - b.idxGoc,
  );

  const daXep: CungDaXep[] = [];
  const demCap = new Map<string, number>();

  for (const item of chuanHoa) {
    let minLevel = 0;
    const trungKhoang = (a: { left: number; right: number }, b: { left: number; right: number }) =>
      Math.max(a.left, b.left) < Math.min(a.right, b.right);

    if (item.span >= 2) {
      for (const prev of daXep) {
        if (trungKhoang(item, prev)) {
          minLevel = Math.max(minLevel, prev.level + 1);
        }
      }
    }

    let level = minLevel;
    while (
      daXep.some((prev) => prev.level === level && trungKhoang(item, prev))
    ) {
      level++;
    }

    const pairKey = `${item.left}-${item.right}`;
    const seen = demCap.get(pairKey) ?? 0;
    demCap.set(pairKey, seen + 1);
    const xOffset = seen === 0 ? 0 : seen * 6;

    daXep.push({
      ...item,
      level,
      xOffset,
    });
  }

  return daXep;
}

export function DanhSachChipQuanHe({
  quanHe,
  ariaLabel,
  className = 'ck-bt-qh-chip-ds',
}: {
  quanHe: MucQuanHeVe[];
  ariaLabel: string;
  className?: string;
}) {
  if (quanHe.length === 0) return null;

  return (
    <ul className={className} aria-label={ariaLabel}>
      {quanHe.map((q, idx) => {
        const cfg = KIEU_NET_QUAN_HE[q.nhom];
        const tenTru = q.tru.map((t) => TEN_TRU_HOA[t] ?? '').join('–');
        const chu = q.chu.join(' ');
        return (
          <li
            key={`chip-${q.loai}-${q.tru.join('')}-${idx}`}
            className="ck-bt-qh-chip"
            style={{
              color: cfg.mauChu,
              background: cfg.mauNen,
              borderColor: cfg.color,
              borderStyle: cfg.kieuVien,
            }}
          >
            <MauNetQuanHeSvg nhom={q.nhom} width={20} />
            <span>
              {nhanNganQuanHe(q)} · {tenTru} · {chu}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function SoDoQuanHeSvg({
  quanHe,
  viTri,
  soCot = 4,
  chiHienSvg = false,
}: {
  quanHe: MucQuanHeVe[];
  viTri: 'tren' | 'duoi';
  soCot?: 4 | 5;
  chiHienSvg?: boolean;
}) {
  if (quanHe.length === 0) return null;

  const colX = soCot === 5 ? COL_X_5 : COL_X_4;
  const viewBoxWidth = soCot * 100;
  const cacCung = xepTangCung(quanHe);
  const maxLevel = Math.max(...cacCung.map((c) => c.level));
  const soTang = maxLevel + 1;
  const quaNhieuTang = !chiHienSvg && soTang > 2;
  const tongCao = BASE_PAD + FIRST_DEPTH + maxLevel * LEVEL_STEP + OUTER_PAD;
  const baseY = viTri === 'duoi' ? BASE_PAD : tongCao - BASE_PAD;
  const huong = viTri === 'duoi' ? 1 : -1;

  return (
    <>
      <div
        className={`ck-bt-qh-svg-khung ck-bt-qh-svg-${viTri}${quaNhieuTang ? ' ck-bt-qh-svg-an-mobile' : ''}`}
        style={{ height: `${tongCao}px` }}
        aria-label={
          viTri === 'tren'
            ? 'Sơ đồ quan hệ thiên can giữa các trụ'
            : 'Sơ đồ quan hệ địa chi giữa các trụ'
        }
      >
        <svg
          className="ck-bt-qh-svg"
          viewBox={`0 0 ${viewBoxWidth} ${tongCao}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {cacCung.map((c) => {
            const cfg = KIEU_NET_QUAN_HE[c.q.nhom];
            const depth = FIRST_DEPTH + c.level * LEVEL_STEP;
            const peakY = baseY + huong * depth;
            const ctrlY = baseY + (peakY - baseY) / 0.75;
            const xStart = Math.max(10, colX[c.left] - c.xOffset);
            const xEnd = Math.min(viewBoxWidth - 10, colX[c.right] + c.xOffset);

            const coCotGiua = c.visCols.length === 3;
            const xMidCol = coCotGiua ? colX[c.visCols[1]] : null;
            const yMidCurve =
              xMidCol !== null
                ? tinhYCuongCong(xMidCol, xStart, xEnd, baseY, ctrlY)
                : null;

            return (
              <g key={`${c.q.loai}-${c.q.tru.join('')}-${c.idxGoc}`}>
                <path
                  d={`M ${xStart},${baseY} C ${xStart},${ctrlY} ${xEnd},${ctrlY} ${xEnd},${baseY}`}
                  fill="none"
                  stroke={cfg.color}
                  strokeWidth={cfg.width}
                  strokeDasharray={cfg.dash}
                  strokeLinecap={cfg.cap}
                  vectorEffect="non-scaling-stroke"
                />
                {xMidCol !== null && yMidCurve !== null ? (
                  <line
                    x1={xMidCol}
                    y1={baseY}
                    x2={xMidCol}
                    y2={yMidCurve}
                    stroke={cfg.color}
                    strokeWidth={cfg.width}
                    strokeDasharray={cfg.dash}
                    strokeLinecap={cfg.cap}
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
              </g>
            );
          })}
        </svg>

        {cacCung.map((c) => {
          const cfg = KIEU_NET_QUAN_HE[c.q.nhom];
          const depth = FIRST_DEPTH + c.level * LEVEL_STEP;
          const peakY = baseY + huong * depth;
          const ctrlY = baseY + (peakY - baseY) / 0.75;
          const xStart = Math.max(10, colX[c.left] - c.xOffset);
          const xEnd = Math.min(viewBoxWidth - 10, colX[c.right] + c.xOffset);

          let labelX = (xStart + xEnd) / 2;
          if (c.visCols.length === 3) {
            const xMidCol = colX[c.visCols[1]];
            const leftGap = xMidCol - xStart;
            const rightGap = xEnd - xMidCol;
            if (Math.abs(leftGap - rightGap) > 20) {
              labelX = rightGap > leftGap ? (xMidCol + xEnd) / 2 : (xStart + xMidCol) / 2;
            }
          }
          const labelY = tinhYCuongCong(labelX, xStart, xEnd, baseY, ctrlY);
          const anchorXs = c.visCols.map((vc, k) => {
            if (k === 0) return xStart;
            if (k === c.visCols.length - 1) return xEnd;
            return colX[vc];
          });

          return (
            <div
              key={`overlay-${c.q.loai}-${c.q.tru.join('')}-${c.idxGoc}`}
              className="ck-bt-qh-lop"
            >
              {anchorXs.map((ax, k) => (
                <i
                  key={k}
                  className="ck-bt-qh-cham"
                  style={{
                    left: `${(ax / viewBoxWidth) * 100}%`,
                    top: `${baseY}px`,
                    background: cfg.color,
                  }}
                  aria-hidden="true"
                />
              ))}
              <span
                className={`ck-bt-qh-nhan ck-bt-qh-nhan-${c.q.nhom}`}
                style={{
                  left: `${(labelX / viewBoxWidth) * 100}%`,
                  top: `${labelY}px`,
                }}
              >
                {nhanNganQuanHe(c.q)}
              </span>
            </div>
          );
        })}
      </div>

      {quaNhieuTang ? (
        <DanhSachChipQuanHe
          quanHe={quanHe}
          ariaLabel={
            viTri === 'tren'
              ? 'Danh sách quan hệ thiên can'
              : 'Danh sách quan hệ địa chi'
          }
        />
      ) : null}
    </>
  );
}

import { HANH_MAU_HEX } from '@/components/ck/canChiHelpers';
import type { Hanh } from '@/lib/trang/can-chi';
import {
  TEN_QUAN_HE,
  type PhanTichMaiHoa,
  type QuanHeTheDung,
} from '@/lib/trang/mai-hoa';

const MAU_QUAN_HE: Record<
  QuanHeTheDung,
  { stroke: string; fill: string; text: string; dash?: string }
> = {
  'sinh-the': { stroke: '#2E6B3E', fill: '#E8F3EC', text: '#1F572D' },
  'ty-hoa': { stroke: '#9A7420', fill: '#FBF4DE', text: '#6B5112' },
  'khac-the': { stroke: '#B7791F', fill: '#FDF5E6', text: '#7C4F0F', dash: '7 4' },
  'the-sinh': { stroke: '#7A5229', fill: '#FBF2E9', text: '#6E4720' },
  'the-khac': { stroke: '#475569', fill: '#F1F4F7', text: '#364554', dash: '7 4' },
};

const VI_TRI_HOP: Record<
  'dung' | 'bien' | 'ho-ha' | 'ho-thuong',
  { x: number; y: number; ax: number; ay: number; tx: number; ty: number }
> = {
  dung: { x: 8, y: 8, ax: 140, ay: 118, tx: 222, ty: 165 },
  bien: { x: 320, y: 8, ax: 420, ay: 118, tx: 338, ty: 165 },
  'ho-ha': { x: 8, y: 322, ax: 140, ay: 322, tx: 222, ty: 275 },
  'ho-thuong': { x: 320, y: 322, ax: 420, ay: 322, tx: 338, ty: 275 },
};

export default function SoDoTheDungSvg({ pt }: { pt: PhanTichMaiHoa }) {
  const mauThe = HANH_MAU_HEX[pt.the.hanh as Hanh] ?? '#5E6670';

  return (
    <svg
      className="ck-mh-sodo-svg"
      viewBox="0 0 560 440"
      role="img"
      aria-label={`Sơ đồ ngũ hành giữa thể ${pt.the.ten} (${pt.the.hanh}) và 4 quái Dụng, Hỗ dưới, Hỗ trên, Biến`}
    >
      <defs>
        {(Object.keys(MAU_QUAN_HE) as QuanHeTheDung[]).map((qh) => (
          <marker
            key={qh}
            id={`ck-mh-mui-${qh}`}
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill={MAU_QUAN_HE[qh].stroke} />
          </marker>
        ))}
      </defs>

      {pt.cacQuai.map((item) => {
        const vt = VI_TRI_HOP[item.vai];
        const style = MAU_QUAN_HE[item.quanHe];
        const huongVaoThe = item.quanHe === 'sinh-the' || item.quanHe === 'khac-the';
        const tyHoa = item.quanHe === 'ty-hoa';
        const x1 = tyHoa || huongVaoThe ? vt.ax : vt.tx;
        const y1 = tyHoa || huongVaoThe ? vt.ay : vt.ty;
        const x2 = tyHoa || huongVaoThe ? vt.tx : vt.ax;
        const y2 = tyHoa || huongVaoThe ? vt.ty : vt.ay;

        return (
          <line
            key={`line-${item.vai}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={style.stroke}
            strokeWidth="2.8"
            strokeDasharray={style.dash}
            markerEnd={tyHoa ? undefined : `url(#ck-mh-mui-${item.quanHe})`}
            markerStart={tyHoa ? `url(#ck-mh-mui-${item.quanHe})` : undefined}
          />
        );
      })}

      {/* 4 hộp quái quanh Thể */}
      {pt.cacQuai.map((item) => {
        const vt = VI_TRI_HOP[item.vai];
        const style = MAU_QUAN_HE[item.quanHe];
        const mauHanh = HANH_MAU_HEX[item.quai.hanh as Hanh] ?? '#5E6670';
        const cx = vt.x + 116;

        return (
          <g key={item.vai}>
            <rect
              x={vt.x}
              y={vt.y}
              width="232"
              height="110"
              rx="4"
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth="2"
            />
            <text
              x={cx}
              y={vt.y + 27}
              textAnchor="middle"
              fontSize="22"
              fontWeight="700"
              fill="#4A3829"
            >
              {item.tenVai}
            </text>
            <text
              x={cx}
              y={vt.y + 57}
              textAnchor="middle"
              fontSize="23"
              fontWeight="700"
              fill="#1F140D"
            >
              {`${item.quai.ten} (${item.quai.hanh})`}
            </text>
            <circle cx={vt.x + 22} cy={vt.y + 50} r="6.5" fill={mauHanh} />
            <text
              x={cx}
              y={vt.y + 90}
              textAnchor="middle"
              fontSize="22"
              fontWeight="700"
              fill={style.text}
            >
              {TEN_QUAN_HE[item.quanHe]}
            </text>
          </g>
        );
      })}

      {/* Hộp Thể ở trung tâm */}
      <g>
        <rect
          x="160"
          y="165"
          width="240"
          height="110"
          rx="4"
          fill="#FFFDF8"
          stroke="#8E1B12"
          strokeWidth="3"
        />
        <text
          x="280"
          y="194"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill="#8E1B12"
        >
          THỂ (mình)
        </text>
        <circle cx="188" cy="222" r="7" fill={mauThe} />
        <text
          x="284"
          y="229"
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="#1F140D"
        >
          {`${pt.the.ten} · ${pt.the.hanh}`}
        </text>
        <text
          x="280"
          y="258"
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          fill="#4A3829"
        >
          {`Tượng: ${pt.the.tuong}`}
        </text>
      </g>
    </svg>
  );
}

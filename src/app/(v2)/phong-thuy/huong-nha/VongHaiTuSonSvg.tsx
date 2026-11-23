import React from 'react';
import {
  HAI_TU_SON,
  type KetQuaHuong,
} from '@/lib/trang/phong-thuy';
import { CUNG_THEO_CHIEU_KIM } from '../PhongThuyHelpers';

const CX = 270;
const CY = 270;

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const pt = (deg: number, r: number) => ({
  x: Number((CX + r * Math.cos(rad(deg))).toFixed(2)),
  y: Number((CY + r * Math.sin(rad(deg))).toFixed(2)),
});

function hinhQuat(d1: number, d2: number, rTrong: number, rNgoai: number): string {
  const p1 = pt(d1, rNgoai);
  const p2 = pt(d2, rNgoai);
  const p3 = pt(d2, rTrong);
  const p4 = pt(d1, rTrong);
  return `M ${p1.x} ${p1.y} A ${rNgoai} ${rNgoai} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rTrong} ${rTrong} 0 0 0 ${p4.x} ${p4.y} Z`;
}

const MOC_8 = [
  { deg: 0, ten: 'Bắc 0°' },
  { deg: 45, ten: 'ĐB 45°' },
  { deg: 90, ten: 'Đông 90°' },
  { deg: 135, ten: 'ĐN 135°' },
  { deg: 180, ten: 'Nam 180°' },
  { deg: 225, ten: 'TN 225°' },
  { deg: 270, ten: 'Tây 270°' },
  { deg: 315, ten: 'TB 315°' },
] as const;

export default function VongHaiTuSonSvg({
  ketQua,
}: {
  ketQua: KetQuaHuong | null;
}) {
  const gocHuongStart = ketQua ? pt(ketQua.doHuong, 60) : null;
  const gocHuongEnd = ketQua ? pt(ketQua.doHuong, 196) : null;
  const muiHuong1 = ketQua ? pt(ketQua.doHuong, 203) : null;
  const muiHuong2 = ketQua ? pt(ketQua.doHuong - 4, 189) : null;
  const muiHuong3 = ketQua ? pt(ketQua.doHuong + 4, 189) : null;

  const gocToaStart = ketQua ? pt(ketQua.doToa, 60) : null;
  const gocToaEnd = ketQua ? pt(ketQua.doToa, 192) : null;

  return (
    <div className="ck-pt-vong-khung">
      <svg
        viewBox="0 0 540 540"
        className="ck-pt-vong-svg"
        role="img"
        aria-label={
          ketQua
            ? `Vòng 24 sơn: hướng ${ketQua.sonHuong} (${ketQua.cungHuong.phuong}), tọa ${ketQua.sonToa} (${ketQua.cungToa.phuong})`
            : 'Vòng 24 sơn và 8 cung theo la bàn, chính Bắc ở trên cùng'
        }
      >
        <circle cx={CX} cy={CY} r={204} fill="#FBF7EE" stroke="#C9AE78" strokeWidth={1.2} />

        {/* 8 vùng quái tô nhạt ở vòng trong */}
        {CUNG_THEO_CHIEU_KIM.map((c, idx) => {
          const giua = idx * 45;
          const d1 = giua - 22.5;
          const d2 = giua + 22.5;
          const viTriChu = pt(giua, 104);
          const laDong = c.nhom === 'Đông';
          return (
            <g key={c.slug}>
              <path
                d={hinhQuat(d1, d2, 60, 142)}
                fill={laDong ? '#EDF5EE' : '#FAF0DC'}
                stroke="#C9AE78"
                strokeWidth={1}
              />
              <text
                x={viTriChu.x}
                y={viTriChu.y - 7}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={16}
                fill="#8E1B12"
              >
                {c.kyHieu}
              </text>
              <text
                x={viTriChu.x}
                y={viTriChu.y + 10}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13}
                fontWeight={700}
                fill="#1F140D"
              >
                {c.ten}
              </text>
            </g>
          );
        })}

        {/* 24 sơn vòng ngoài */}
        {HAI_TU_SON.map((son, idx) => {
          const giua = idx * 15;
          const d1 = giua - 7.5;
          const d2 = giua + 7.5;
          const laHuong = ketQua?.sonHuong === son;
          const laToa = ketQua?.sonToa === son;
          const pChu = pt(giua, 173);
          const nen = laHuong
            ? '#FBE3DE'
            : laToa
              ? '#E4EBF7'
              : idx % 2 === 0
                ? '#FBF5E8'
                : '#F3E8D0';
          return (
            <g key={son}>
              <path
                d={hinhQuat(d1, d2, 142, 202)}
                fill={nen}
                stroke="#B8955A"
                strokeWidth={0.9}
              />
              <text
                x={pChu.x}
                y={pChu.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13.5}
                fontWeight={laHuong || laToa ? 700 : 600}
                fill={laHuong ? '#8E1B12' : laToa ? '#1A2342' : '#1F140D'}
              >
                {son}
              </text>
            </g>
          );
        })}

        {/* 8 mốc độ la bàn ngoài cùng */}
        {MOC_8.map((m) => {
          const p = pt(m.deg, 228);
          return (
            <text
              key={m.ten}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={13}
              fontWeight={700}
              fill="#4A3829"
            >
              {m.ten}
            </text>
          );
        })}

        {/* Kim Hướng và Tọa bắt đầu từ rìa vòng tâm để không đè chữ */}
        {gocToaStart &&
        gocToaEnd &&
        gocHuongStart &&
        gocHuongEnd &&
        muiHuong1 &&
        muiHuong2 &&
        muiHuong3 ? (
          <g>
            <line
              x1={gocToaStart.x}
              y1={gocToaStart.y}
              x2={gocToaEnd.x}
              y2={gocToaEnd.y}
              stroke="#1A2342"
              strokeWidth={3}
              strokeDasharray="6 4"
            />
            <circle cx={gocToaEnd.x} cy={gocToaEnd.y} r={5.5} fill="#1A2342" />
            <line
              x1={gocHuongStart.x}
              y1={gocHuongStart.y}
              x2={gocHuongEnd.x}
              y2={gocHuongEnd.y}
              stroke="#8E1B12"
              strokeWidth={3.5}
            />
            <polygon
              points={`${muiHuong1.x},${muiHuong1.y} ${muiHuong2.x},${muiHuong2.y} ${muiHuong3.x},${muiHuong3.y}`}
              fill="#8E1B12"
            />
          </g>
        ) : null}

        {/* Tâm la bàn */}
        <circle cx={CX} cy={CY} r={60} fill="#FFFDF8" stroke="#9C7E4A" strokeWidth={1.3} />
        <text
          x={CX}
          y={CY - 9}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={13.5}
          fontWeight={700}
          fill="#6A5442"
        >
          24 sơn
        </text>
        <text
          x={CX}
          y={CY + 10}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12.5}
          fill="#4A3829"
        >
          Bắc 0° trên
        </text>
      </svg>

      <div className="ck-pt-vong-chu-thich">
        <span>
          <i className="ck-pt-cham-mau" style={{ background: '#EDF5EE', border: '1px solid #96C49F' }} />
          Đông tứ (Khảm, Ly, Chấn, Tốn)
        </span>
        <span>
          <i className="ck-pt-cham-mau" style={{ background: '#FAF0DC', border: '1px solid #C9AE78' }} />
          Tây tứ (Càn, Khôn, Cấn, Đoài)
        </span>
        {ketQua ? (
          <>
            <span>
              <i className="ck-pt-cham-mau" style={{ background: '#8E1B12' }} />
              Kim Hướng ({ketQua.sonHuong})
            </span>
            <span>
              <i className="ck-pt-cham-mau" style={{ background: '#1A2342' }} />
              Kim Tọa ({ketQua.sonToa})
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}

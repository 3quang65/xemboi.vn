import Link from 'next/link';
import { dinhDangNgayThangVN } from '@/components/ck/lichHelpers';
import { TIET_KHI_24, type MocTiet } from '@/lib/trang/lich-mua';
import { muaCuaTiet } from '../lich-am/LichMuaHelpers';

export interface VongTietKhiSvgProps {
  dang: MocTiet;
}

const CX = 270;
const CY = 270;
const R_IN = 96;
const R_OUT = 268;
const R_TEXT = 194;
const R_DOT = 110;

const NEN_MUA: Record<'xuan' | 'ha' | 'thu' | 'dong', string> = {
  xuan: 'var(--ck-moc-nhat, #E6EFE3)',
  ha: 'var(--ck-hoa-nhat, #FBE9DF)',
  thu: 'var(--ck-kim-nhat, #ECEAE4)',
  dong: 'var(--ck-thuy-nhat, #E4EBF4)',
};

const MAU_MUA: Record<'xuan' | 'ha' | 'thu' | 'dong', string> = {
  xuan: 'var(--ck-moc, #1A7429)',
  ha: 'var(--ck-hoa, #C8150C)',
  thu: 'var(--ck-kim, #5E6670)',
  dong: 'var(--ck-thuy, #102A5C)',
};

function pt(deg: number, r: number): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: Number((CX + r * Math.cos(rad)).toFixed(2)),
    y: Number((CY + r * Math.sin(rad)).toFixed(2)),
  };
}

function hinhQuat(d1: number, d2: number, rTrong: number, rNgoai: number): string {
  const p1 = pt(d1, rNgoai);
  const p2 = pt(d2, rNgoai);
  const p3 = pt(d2, rTrong);
  const p4 = pt(d1, rTrong);
  return `M ${p1.x} ${p1.y} A ${rNgoai} ${rNgoai} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rTrong} ${rTrong} 0 0 0 ${p4.x} ${p4.y} Z`;
}

export default function VongTietKhiSvg({ dang }: VongTietKhiSvgProps) {
  const danhSach = TIET_KHI_24.map((t, idx) => ({
    tiet: t,
    idx,
    mua: muaCuaTiet(t.thangTiet),
    d1: idx * 15,
    d2: (idx + 1) * 15,
    mid: idx * 15 + 7.5,
    laDang: t.slug === dang.slug,
  }));

  // Vẽ ô đang hiệu lực sau cùng để viền son không bị ô bên cạnh đè
  const danhSachVe = [...danhSach].sort((a, b) => Number(a.laDang) - Number(b.laDang));
  const dangInfo = danhSach.find((x) => x.laDang);
  const mauTam = dangInfo ? MAU_MUA[dangInfo.mua.ma] : 'var(--ck-son, #8E1B12)';

  const ariaLabel = `Vòng 24 tiết khí bắt đầu từ Lập xuân ở đỉnh trên theo chiều kim đồng hồ. Hôm nay đang ở tiết ${dang.ten} từ ngày ${dinhDangNgayThangVN(dang.ngay)}.`;

  return (
    <div className="ck-lm-vong-khung">
      <svg viewBox="0 0 540 540" className="ck-lm-vong-svg" role="img" aria-label={ariaLabel}>
        <circle
          cx={CX}
          cy={CY}
          r={R_IN - 2}
          fill="#FFFDF8"
          stroke="#CDB58C"
          strokeWidth={1.2}
        />

        {danhSachVe.map(({ tiet, d1, d2, mid, mua, laDang }) => {
          const textPos = pt(mid, R_TEXT);
          const rot = mid < 180 ? mid - 90 : mid + 90;
          const dotPos = pt(mid, R_DOT);
          const tenCls = [
            tiet.loai === 'tiet' ? 'ck-lm-vong-ten-tiet' : 'ck-lm-vong-ten-khi',
            laDang ? 'ck-lm-vong-ten-dang' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <Link
              key={tiet.slug}
              href={`/tiet-khi/${tiet.slug}`}
              aria-label={`Tiết ${tiet.ten} (${tiet.loai === 'tiet' ? 'tiết đầu tháng' : 'trung khí'}, kinh độ ${tiet.kinhDo}°)${laDang ? ' – Hôm nay đang ở tiết này' : ''}`}
            >
              <g
                className="ck-lm-vong-o"
                data-slug={tiet.slug}
                data-loai={tiet.loai}
                data-hom-nay={laDang ? 'true' : undefined}
              >
                <path
                  d={hinhQuat(d1, d2, R_IN, R_OUT)}
                  fill={NEN_MUA[mua.ma]}
                  stroke={laDang ? 'var(--ck-son, #8E1B12)' : 'rgba(31, 20, 13, 0.14)'}
                  strokeWidth={laDang ? 2.8 : 0.8}
                />

                <text
                  className={tenCls}
                  x={textPos.x}
                  y={textPos.y}
                  transform={`rotate(${rot} ${textPos.x} ${textPos.y})`}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={laDang ? 15 : tiet.loai === 'tiet' ? 14 : 13}
                  fontWeight={laDang || tiet.loai === 'tiet' ? 700 : 500}
                  fill={laDang ? 'var(--ck-son, #8E1B12)' : 'var(--ck-muc, #1F140D)'}
                >
                  {tiet.ten}
                </text>

                {laDang ? (
                  <g data-cham-hom-nay="true">
                    <circle
                      cx={dotPos.x}
                      cy={dotPos.y}
                      r={7}
                      fill="var(--ck-son, #8E1B12)"
                      stroke="#FFFDF8"
                      strokeWidth={2.2}
                    />
                  </g>
                ) : null}
              </g>
            </Link>
          );
        })}

        {/* Vạch chia 12 tiết (nét đậm liền) và 12 trung khí (nét mảnh đứt) */}
        <g pointerEvents="none">
          {danhSach.map(({ tiet, d1, idx }) => {
            const pIn = pt(d1, R_IN);
            const pOut = pt(d1, R_OUT);
            const laRanhMua = idx % 6 === 0;
            const laTiet = tiet.loai === 'tiet';
            return (
              <line
                key={`vach-${tiet.slug}`}
                x1={pIn.x}
                y1={pIn.y}
                x2={pOut.x}
                y2={pOut.y}
                stroke={laTiet ? 'var(--ck-muc, #1F140D)' : 'var(--ck-muc-3, #6A5442)'}
                strokeWidth={laRanhMua ? 2.6 : laTiet ? 1.9 : 1}
                strokeDasharray={laTiet ? undefined : '4 3'}
                strokeOpacity={laTiet ? 0.72 : 0.6}
              />
            );
          })}
          <circle
            cx={CX}
            cy={CY}
            r={R_OUT}
            fill="none"
            stroke="#9C7E4A"
            strokeWidth={1.5}
          />
          <circle
            cx={CX}
            cy={CY}
            r={R_IN}
            fill="none"
            stroke="#9C7E4A"
            strokeWidth={1.5}
          />
        </g>

        {/* Tâm vòng: đánh dấu tiết hiện tại */}
        <g pointerEvents="none">
          <text
            className="ck-lm-vong-tam-phu"
            x={CX}
            y={CY - 30}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={19.5}
            fontWeight={700}
            fill="var(--ck-son, #8E1B12)"
          >
            Hôm nay
          </text>
          <text
            x={CX}
            y={CY}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={24}
            fontWeight={700}
            fill={mauTam}
          >
            {dang.ten}
          </text>
          <text
            className="ck-lm-vong-tam-phu"
            x={CX}
            y={CY + 30}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={19.5}
            fontWeight={600}
            fill="var(--ck-muc-2, #4A3829)"
          >
            Từ {dinhDangNgayThangVN(dang.ngay)}
          </text>
        </g>
      </svg>

      <ul className="ck-lm-vong-cg" aria-label="Chú giải vòng 24 tiết khí">
        <li>
          <span className="ck-lm-vong-mau ck-lm-vong-mau-xuan" aria-hidden="true" />
          Xuân (Mộc)
        </li>
        <li>
          <span className="ck-lm-vong-mau ck-lm-vong-mau-ha" aria-hidden="true" />
          Hạ (Hỏa)
        </li>
        <li>
          <span className="ck-lm-vong-mau ck-lm-vong-mau-thu" aria-hidden="true" />
          Thu (Kim)
        </li>
        <li>
          <span className="ck-lm-vong-mau ck-lm-vong-mau-dong" aria-hidden="true" />
          Đông (Thủy)
        </li>
        <li>
          <span className="ck-lm-vong-vach ck-lm-vong-vach-tiet" aria-hidden="true" />
          12 tiết (vạch đậm)
        </li>
        <li>
          <span className="ck-lm-vong-vach ck-lm-vong-vach-khi" aria-hidden="true" />
          12 trung khí (vạch mảnh)
        </li>
        <li>
          <span className="ck-lm-vong-mau ck-lm-vong-mau-nay" aria-hidden="true" />
          Hôm nay ({dang.ten})
        </li>
      </ul>

      <p className="ck-lm-vong-quy-uoc">
        Quy ước vòng: Lập xuân (315°) ở đỉnh trên, 24 tiết khí đi thuận chiều kim đồng hồ. Trên màn
        hình nhỏ chỉ hiện tên 12 tiết chính và tiết đang hiệu lực.
      </p>
    </div>
  );
}

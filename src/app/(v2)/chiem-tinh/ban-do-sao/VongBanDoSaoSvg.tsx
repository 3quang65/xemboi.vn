import type { BanDoSao, ViTriThienThe } from '@/lib/trang/ban-do-sao';
import { CUNG_HOANG_DAO } from '@/lib/trang/chiem-tinh';
import { kyHieuChu } from '../ChiemTinhHelpers';

const CX = 270;
const CY = 270;

const R_CUNG_OUT = 224;
const R_CUNG_IN = 186;
const R_CUNG_MID = 205;
const R_NHA_OUT = 72;
const R_TAM = 42;
const R_NHA_MID = 57;

// 4 tầng bán kính từ ngoài vào trong để các thiên thể sát độ không chồng chữ.
const TANG_R = [165, 138, 111, 86] as const;
const NGUONG_DO = [11.5, 13.5, 16.5, 20.5] as const;

const rad = (deg: number) => (deg * Math.PI) / 180;

const pt = (r: number, deg: number): [number, number] => [
  Number((CX + r * Math.cos(rad(deg))).toFixed(2)),
  Number((CY + r * Math.sin(rad(deg))).toFixed(2)),
];

const khoangGoc = (a: number, b: number): number =>
  Math.abs(((a - b + 540) % 360) - 180);

const kep = (val: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, val));

function pathQuat(a1: number, a2: number, rOut: number, rIn: number): string {
  const [ox1, oy1] = pt(rOut, a1);
  const [ox2, oy2] = pt(rOut, a2);
  const [ix2, iy2] = pt(rIn, a2);
  const [ix1, iy1] = pt(rIn, a1);
  return `M ${ox1} ${oy1} A ${rOut} ${rOut} 0 0 0 ${ox2} ${oy2} L ${ix2} ${iy2} A ${rIn} ${rIn} 0 0 1 ${ix1} ${iy1} Z`;
}

type ThienTheDat = ViTriThienThe & {
  rDat: number;
};

function xepTangThienThe(ds: ViTriThienThe[]): ThienTheDat[] {
  const sap = [...ds].sort((a, b) => a.kinhDo - b.kinhDo);
  const daDatTheoTang: number[][] = TANG_R.map(() => []);

  return sap.map((tt) => {
    let tangChon = -1;
    for (let t = 0; t < TANG_R.length; t++) {
      const cachDu = daDatTheoTang[t].every(
        (k) => khoangGoc(tt.kinhDo, k) >= NGUONG_DO[t],
      );
      if (cachDu) {
        tangChon = t;
        break;
      }
    }

    if (tangChon === -1) {
      let maxMinDist = -1;
      tangChon = 0;
      for (let t = 0; t < TANG_R.length; t++) {
        const minDist = Math.min(
          ...daDatTheoTang[t].map((k) => khoangGoc(tt.kinhDo, k)),
        );
        if (minDist > maxMinDist) {
          maxMinDist = minDist;
          tangChon = t;
        }
      }
    }

    daDatTheoTang[tangChon].push(tt.kinhDo);
    return { ...tt, rDat: TANG_R[tangChon] };
  });
}

function taoMoTaSvg(banDo: BanDoSao, nhanThoiDiem: string): string {
  const mt = banDo.thienThe.find((x) => x.thienThe.ten === 'Mặt Trời');
  const mtr = banDo.thienThe.find((x) => x.thienThe.ten === 'Mặt Trăng');
  const phan: string[] = [nhanThoiDiem];
  if (mt) phan.push(`Mặt Trời ở ${mt.cung.ten}`);
  if (mtr) phan.push(`Mặt Trăng ở ${mtr.cung.ten}`);
  if (banDo.coGio && banDo.asc && banDo.mc) {
    phan.push(`Cung mọc (ASC) ở ${banDo.asc.cung.ten}`);
    phan.push(`Thiên đỉnh (MC) ở ${banDo.mc.cung.ten}`);
    phan.push('chia 12 nhà trọn cung');
  } else {
    phan.push('0 độ Bạch Dương ở bên trái, không có cung mọc và nhà');
  }
  return phan.join(', ');
}

export default function VongBanDoSaoSvg({
  banDo,
  nhanThoiDiem,
}: {
  banDo: BanDoSao;
  nhanThoiDiem: string;
}) {
  const gocGoc = banDo.coGio && banDo.asc ? banDo.asc.kinhDo : 0;
  const gocSvg = (kinhDo: number) => 180 - (kinhDo - gocGoc);

  const thienTheDat = xepTangThienThe(banDo.thienThe);
  const moTaSvg = taoMoTaSvg(banDo, nhanThoiDiem);

  const thetaAsc = banDo.coGio && banDo.asc ? gocSvg(banDo.asc.kinhDo) : null;
  const thetaMc = banDo.coGio && banDo.mc ? gocSvg(banDo.mc.kinhDo) : null;

  return (
    <div className="ck-ct-bds-vong-khung">
      <svg
        className="ck-ct-bds-vong-svg"
        viewBox="0 0 540 540"
        role="img"
        aria-label={moTaSvg}
      >
        <title>{moTaSvg}</title>

        {/* Nền vùng trong */}
        <circle
          cx={CX}
          cy={CY}
          r={R_CUNG_IN}
          className="ck-ct-bds-svg-nen-trong"
        />

        {/* Vành 12 cung hoàng đạo, tăng ngược chiều kim đồng hồ */}
        {CUNG_HOANG_DAO.map((c) => {
          const a1 = gocSvg(c.tuDo);
          const a2 = a1 - 30;
          const mid = a1 - 15;
          const [tx, ty] = pt(R_CUNG_MID, mid);
          return (
            <g key={c.slug}>
              <path
                d={pathQuat(a1, a2, R_CUNG_OUT, R_CUNG_IN)}
                className={
                  c.duong
                    ? 'ck-ct-bds-svg-o-duong'
                    : 'ck-ct-bds-svg-o-am'
                }
              />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={25}
                className="ck-ct-bds-svg-ky-cung"
              >
                {c.kyHieu}
              </text>
            </g>
          );
        })}

        {/* Vòng viền ngoài mảnh */}
        <circle
          cx={CX}
          cy={CY}
          r={R_CUNG_OUT + 4}
          fill="none"
          className="ck-ct-bds-svg-vien-ngoai"
        />

        {/* Khi có giờ sinh: chia 12 nhà trọn cung và đánh số nhà ở vòng trong */}
        {banDo.coGio && banDo.nha ? (
          <g>
            {banDo.nha.map((n) => {
              const a1 = gocSvg(n.cung.tuDo);
              const a2 = a1 - 30;
              const mid = a1 - 15;
              const [x1, y1] = pt(R_TAM, a1);
              const [x2, y2] = pt(R_CUNG_IN, a1);
              const [nx, ny] = pt(R_NHA_MID, mid);
              return (
                <g key={n.so}>
                  <path
                    d={pathQuat(a1, a2, R_NHA_OUT, R_TAM)}
                    className="ck-ct-bds-svg-o-nha"
                  />
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="ck-ct-bds-svg-vach-nha"
                  />
                  <text
                    x={nx}
                    y={ny}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={19}
                    className="ck-ct-bds-svg-nha"
                  >
                    {n.so}
                  </text>
                </g>
              );
            })}
            <circle
              cx={CX}
              cy={CY}
              r={R_NHA_OUT}
              fill="none"
              className="ck-ct-bds-svg-vien-nha"
            />
          </g>
        ) : null}

        {/* Vạch ASC và MC vẽ trước ký hiệu thiên thể để không đè lên chữ */}
        {thetaAsc !== null ? (
          <g>
            {(() => {
              const [x1, y1] = pt(R_TAM, thetaAsc);
              const [x2, y2] = pt(R_CUNG_OUT + 7, thetaAsc);
              const [dx, dy] = pt(R_CUNG_IN, thetaAsc);
              const [lx, ly] = pt(R_CUNG_OUT + 24, thetaAsc);
              return (
                <>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="ck-ct-bds-svg-vach-asc"
                  />
                  <circle
                    cx={dx}
                    cy={dy}
                    r={4}
                    className="ck-ct-bds-svg-cham-asc"
                  />
                  <text
                    x={kep(lx, 24, 516)}
                    y={kep(ly, 18, 522)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={19}
                    className="ck-ct-bds-svg-nhan-asc"
                  >
                    ASC
                  </text>
                </>
              );
            })()}
          </g>
        ) : null}

        {thetaMc !== null ? (
          <g>
            {(() => {
              const [x1, y1] = pt(R_TAM, thetaMc);
              const [x2, y2] = pt(R_CUNG_OUT + 7, thetaMc);
              const [dx, dy] = pt(R_CUNG_IN, thetaMc);
              const [lx, ly] = pt(R_CUNG_OUT + 22, thetaMc);
              return (
                <>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="ck-ct-bds-svg-vach-mc"
                  />
                  <circle
                    cx={dx}
                    cy={dy}
                    r={4}
                    className="ck-ct-bds-svg-cham-mc"
                  />
                  <text
                    x={kep(lx, 24, 516)}
                    y={kep(ly, 18, 522)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={19}
                    className="ck-ct-bds-svg-nhan-mc"
                  >
                    MC
                  </text>
                </>
              );
            })()}
          </g>
        ) : null}

        {/* Lớp 1: Toàn bộ vạch nối thiên thể vẽ trước để không cắt ngang đĩa/ký hiệu khác */}
        {thienTheDat.map((tt) => {
          const theta = gocSvg(tt.kinhDo);
          const [ox, oy] = pt(R_CUNG_IN, theta);
          const [tx, ty] = pt(tt.rDat, theta);
          return (
            <line
              key={`line-${tt.thienThe.en}`}
              x1={ox}
              y1={oy}
              x2={tx}
              y2={ty}
              className={
                tt.thienThe.coDien
                  ? 'ck-ct-bds-svg-noi-tt'
                  : 'ck-ct-bds-svg-noi-ngoai'
              }
            />
          );
        })}

        {/* Lớp 2: Đĩa nền + ký hiệu thiên thể + chữ R */}
        {thienTheDat.map((tt) => {
          const theta = gocSvg(tt.kinhDo);
          const [tx, ty] = pt(tt.rDat, theta);
          return (
            <g key={tt.thienThe.en}>
              <circle
                cx={tx}
                cy={ty}
                r={11.5}
                className="ck-ct-bds-svg-nen-tt"
              />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={24}
                className={
                  tt.thienThe.coDien
                    ? 'ck-ct-bds-svg-tt'
                    : 'ck-ct-bds-svg-tt-ngoai'
                }
              >
                {kyHieuChu(tt.thienThe.kyHieu)}
              </text>
              {tt.nghich ? (
                <text
                  x={tx + 12.5}
                  y={ty - 7}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontSize={18.2}
                  className="ck-ct-bds-svg-r"
                >
                  R
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Vòng tâm */}
        <circle
          cx={CX}
          cy={CY}
          r={R_TAM}
          className="ck-ct-bds-svg-tam"
        />
        <text
          x={CX}
          y={CY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={19}
          className="ck-ct-bds-svg-tam-chu"
        >
          {banDo.coGio ? '12 nhà' : '0° ♈︎'}
        </text>
      </svg>

      <div className="ck-ct-bds-vong-chu-thich" aria-label="Chú thích ký hiệu bản đồ">
        {banDo.coGio ? (
          <>
            <span>
              <i className="ck-ct-bds-cham ck-ct-bds-cham-asc" aria-hidden="true" />
              ASC: Cung mọc
            </span>
            <span>
              <i className="ck-ct-bds-cham ck-ct-bds-cham-mc" aria-hidden="true" />
              MC: Thiên đỉnh
            </span>
          </>
        ) : (
          <span>0° Bạch Dương đặt ở bên trái (9 giờ)</span>
        )}
        <span>R: Nghịch hành</span>
        <span>Ký hiệu nhạt: 3 hành tinh ngoài Tetrabiblos</span>
      </div>
    </div>
  );
}

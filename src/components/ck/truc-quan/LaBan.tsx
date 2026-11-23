import type { LaBanCaNhan } from '@/lib/trang/phan-truc-quan';
import { viTriTrich } from '@/lib/trang/phong-thuy';
import { MoChiTietAnchorClient } from './MoChiTietAnchorClient';
import './truc-quan.css';

export interface LaBanProps {
  laBan: LaBanCaNhan;
  doHuong?: number;
  xoayTheoHuong?: boolean;
  gocRanhGanNhat?: number;
  lienKetXoay?: { href: string; nhan: string };
  idPrefix?: string;
  tieuDe?: string;
}

const CX = 290;
const CY = 290;

const chuanDo = (deg: number) => ((deg % 360) + 360) % 360;

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

function gocChuTiepTuyen(degHienThi: number): number {
  const d = chuanDo(degHienThi);
  return d > 95 && d < 265 ? d + 180 : d;
}

function dinhDangDoNgan(d: number): string {
  const r = Math.round(chuanDo(d) * 10) / 10;
  return `${String(r >= 360 ? 0 : r).replace('.', ',')}°`;
}

const BON_PHUONG_CHINH = [
  { deg: 0, chu: 'B', ten: 'Bắc' },
  { deg: 90, chu: 'Đ', ten: 'Đông' },
  { deg: 180, chu: 'N', ten: 'Nam' },
  { deg: 270, chu: 'T', ten: 'Tây' },
] as const;

export function LaBan({
  laBan,
  doHuong,
  xoayTheoHuong = false,
  gocRanhGanNhat,
  lienKetXoay,
  idPrefix = 'ck-lb',
  tieuDe,
}: LaBanProps) {
  const coCungPhi = Boolean(laBan.cungPhi);
  const coHuong = doHuong !== undefined;
  const dangXoay = Boolean(xoayTheoHuong && coHuong);
  const gocXoay = dangXoay && doHuong !== undefined ? -doHuong : 0;
  const hienThi = (deg: number) => chuanDo(deg + gocXoay);

  const rTam = coHuong ? 22 : 56;
  const rQuaiNgoai = coCungPhi ? 124 : 186;
  const rDuNienTrong = 124;
  const rDuNienNgoai = 186;
  const rSonTrong = 186;
  const rSonNgoai = 234;

  const degHuongHien = coHuong && doHuong !== undefined ? hienThi(doHuong) : null;
  const degToaHien = coHuong && doHuong !== undefined ? hienThi(doHuong + 180) : null;

  const muiTip = degHuongHien !== null ? pt(degHuongHien, 194) : null;
  const muiCanh1 = degHuongHien !== null ? pt(degHuongHien - 4.5, 178) : null;
  const muiCanh2 = degHuongHien !== null ? pt(degHuongHien + 4.5, 178) : null;
  const muiDuoi = degHuongHien !== null ? pt(degHuongHien, 184) : null;
  const toaDiem = degToaHien !== null ? pt(degToaHien, 114) : null;

  let nhanHuongPos: { x: number; y: number } | null = null;
  if (degHuongHien !== null) {
    const rawPos = pt(degHuongHien, 276);
    nhanHuongPos = {
      x: Math.max(46, Math.min(534, rawPos.x)),
      y: Math.max(2, Math.min(578, rawPos.y)),
    };
  }
  const nhanHuongText =
    coHuong && doHuong !== undefined ? `Hướng ${dinhDangDoNgan(doHuong)}` : '';
  const pillW = Math.max(88, nhanHuongText.length * 8.2 + 18);

  const ranhTrong =
    gocRanhGanNhat !== undefined ? pt(hienThi(gocRanhGanNhat), 182) : null;
  const ranhNgoai =
    gocRanhGanNhat !== undefined ? pt(hienThi(gocRanhGanNhat), 240) : null;

  const hatchId = `${idPrefix}-hatch`;
  const sonHuong = laBan.son.find((s) => s.laHuong)?.son;
  const sonToa = laBan.son.find((s) => s.laToa)?.son;

  return (
    <div className="ck-tq-lb">
      <MoChiTietAnchorClient />

      <div className="ck-tq-lb-thanh-tren">
        <div className="ck-tq-lb-ghi-huong">
          {tieuDe ? <strong className="ck-tq-lb-tieu">{tieuDe}</strong> : null}
          <span className="ck-tq-lb-quy-uoc">
            {dangXoay ? 'Đang xoay: hướng nhà ở trên' : 'Bắc ở trên'}
          </span>
        </div>

        {lienKetXoay ? (
          <a href={lienKetXoay.href} className="ck-tq-lb-nut-xoay">
            {lienKetXoay.nhan}
          </a>
        ) : null}
      </div>

      <div className="ck-tq-lb-khung">
        <svg
          viewBox="-18 -18 616 616"
          className="ck-tq-lb-svg"
          role="img"
          aria-label={
            coHuong && doHuong !== undefined
              ? `La bàn${laBan.cungPhi ? ` cung phi ${laBan.cungPhi}` : ''}, hướng ${dinhDangDoNgan(doHuong)}${sonHuong ? ` sơn ${sonHuong}` : ''}${dangXoay ? ', hướng nhà ở trên' : ', Bắc ở trên'}`
              : `La bàn${laBan.cungPhi ? ` 8 phương theo cung phi ${laBan.cungPhi}` : ' 24 sơn và 8 quái'}, Bắc ở trên`
          }
        >
          <defs>
            <pattern
              id={hatchId}
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="7"
                stroke="#B7791F"
                strokeWidth="1.5"
                strokeOpacity="0.24"
              />
            </pattern>
          </defs>

          <circle
            cx={CX}
            cy={CY}
            r={rSonNgoai + 2}
            fill="#FBF7EE"
            stroke="#9C7E4A"
            strokeWidth={1.3}
          />

          {/* 4 chữ B / Đ / N / T ngoài vòng */}
          {BON_PHUONG_CHINH.map((p) => {
            const g = hienThi(p.deg);
            const pos = pt(g, 249);
            return (
              <text
                key={p.chu}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={16}
                fontWeight={700}
                fill={p.chu === 'B' ? '#8E1B12' : '#4A3829'}
                aria-hidden="true"
              >
                {p.chu}
              </text>
            );
          })}

          {/* Lớp nền 8 quái & vòng giữa du niên (bấm mở details) */}
          {laBan.quai.map((q) => {
            const d1 = hienThi(q.goc - 22.5);
            const d2 = hienThi(q.goc + 22.5);
            const detailId = `${idPrefix}-quai-${q.cung.slug}`;
            const laCat = q.duNien?.cat;

            const quaiNen = coCungPhi
              ? '#FFFDF8'
              : q.cung.nhom === 'Đông'
                ? 'var(--ck-moc-nhat, #E6EFE3)'
                : '#FAF0DC';
            const quaiVien = coCungPhi
              ? '#C9AE78'
              : q.cung.nhom === 'Đông'
                ? '#1A7429'
                : '#B8913F';

            return (
              <g key={`nen-${q.cung.slug}`}>
                <a
                  href={`#${detailId}`}
                  data-mo-details={detailId}
                  className="ck-tq-lb-link"
                  aria-label={`Quái ${q.cung.ten} (${q.cung.phuong})${q.duNien ? `: ${q.duNien.ten} — ${q.duNien.cat ? 'cát' : 'không cát'}` : ''}. Bấm để xem chi tiết.`}
                >
                  <path
                    d={hinhQuat(d1, d2, rTam, rQuaiNgoai)}
                    fill={quaiNen}
                    stroke={quaiVien}
                    strokeWidth={1.1}
                    strokeDasharray={!coCungPhi && q.cung.nhom === 'Tây' ? '4 3' : undefined}
                  />
                  {coCungPhi && q.duNien ? (
                    <>
                      <path
                        d={hinhQuat(d1, d2, rDuNienTrong, rDuNienNgoai)}
                        fill={laCat ? 'var(--ck-moc-nhat, #E6EFE3)' : '#FBF4E4'}
                        stroke={laCat ? '#1A7429' : '#B7791F'}
                        strokeWidth={1.4}
                        strokeDasharray={laCat ? undefined : '5 3'}
                      />
                      {!laCat ? (
                        <path
                          d={hinhQuat(d1, d2, rDuNienTrong, rDuNienNgoai)}
                          fill={`url(#${hatchId})`}
                          stroke="none"
                          pointerEvents="none"
                        />
                      ) : null}
                    </>
                  ) : null}
                </a>
              </g>
            );
          })}

          {/* Vòng ngoài: 24 sơn (mỗi sơn 15°) */}
          {laBan.son.map((o, idx) => {
            const d1 = hienThi(o.goc - 7.5);
            const d2 = hienThi(o.goc + 7.5);
            const gGiua = hienThi(o.goc);
            const rot = gocChuTiepTuyen(gGiua);
            const pos = pt(gGiua, 210);
            const nen = o.laHuong
              ? '#FBE6E1'
              : o.laToa
                ? '#E4EBF4'
                : idx % 2 === 0
                  ? '#FFFDF8'
                  : '#F4EBDA';
            const vien = o.laHuong ? '#8E1B12' : o.laToa ? '#1A2342' : '#B8955A';
            return (
              <g key={o.son}>
                <path
                  d={hinhQuat(d1, d2, rSonTrong, rSonNgoai)}
                  fill={nen}
                  stroke={vien}
                  strokeWidth={o.laHuong || o.laToa ? 1.8 : 0.9}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  transform={`rotate(${rot}, ${pos.x}, ${pos.y})`}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={19.5}
                  fontWeight={o.laHuong || o.laToa ? 700 : 600}
                  fill={o.laHuong ? '#8E1B12' : o.laToa ? '#1A2342' : '#1F140D'}
                >
                  {o.son}
                </text>
              </g>
            );
          })}

          {/* Vạch ranh sơn gần nhất khi đo sát ranh */}
          {ranhTrong && ranhNgoai ? (
            <g>
              <line
                x1={ranhTrong.x}
                y1={ranhTrong.y}
                x2={ranhNgoai.x}
                y2={ranhNgoai.y}
                stroke="#B7791F"
                strokeWidth={4}
                strokeLinecap="round"
              />
              <circle cx={ranhNgoai.x} cy={ranhNgoai.y} r={5} fill="#B7791F" />
            </g>
          ) : null}

          {/* Mũi tên Hướng và đoạn Tọa vẽ dưới lớp chữ để không cắt ngang chữ quái/du niên */}
          {toaDiem && muiDuoi && muiTip && muiCanh1 && muiCanh2 ? (
            <g pointerEvents="none">
              <line
                x1={CX}
                y1={CY}
                x2={toaDiem.x}
                y2={toaDiem.y}
                stroke="#1A2342"
                strokeOpacity={0.78}
                strokeWidth={2.8}
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
              <circle cx={toaDiem.x} cy={toaDiem.y} r={4.5} fill="#1A2342" />

              <line
                x1={CX}
                y1={CY}
                x2={muiDuoi.x}
                y2={muiDuoi.y}
                stroke="#8E1B12"
                strokeOpacity={0.82}
                strokeWidth={3.4}
                strokeLinecap="round"
              />
              <polygon
                points={`${muiTip.x},${muiTip.y} ${muiCanh1.x},${muiCanh1.y} ${muiCanh2.x},${muiCanh2.y}`}
                fill="#8E1B12"
              />
            </g>
          ) : null}

          {/* Lớp chữ 8 quái & du niên nằm trên thân mũi tên */}
          {laBan.quai.map((q) => {
            const gGiua = hienThi(q.goc);
            const rot = gocChuTiepTuyen(gGiua);
            const detailId = `${idPrefix}-quai-${q.cung.slug}`;
            const laCat = q.duNien?.cat;
            const rChuQuai = coCungPhi ? 90 : 124;
            const posQuai = pt(gGiua, rChuQuai);
            const posDuNien = pt(gGiua, 155);

            return (
              <a
                key={`chu-${q.cung.slug}`}
                href={`#${detailId}`}
                data-mo-details={detailId}
                className="ck-tq-lb-link"
              >
                <g transform={`translate(${posQuai.x}, ${posQuai.y}) rotate(${rot})`}>
                  <text
                    x={0}
                    y={coCungPhi ? -9 : -14}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={coCungPhi ? 19 : 24}
                    fill="#8E1B12"
                    paintOrder="stroke"
                    stroke="#FFFDF8"
                    strokeWidth={3}
                    strokeLinejoin="round"
                  >
                    {q.cung.kyHieu}
                  </text>
                  <text
                    x={0}
                    y={coCungPhi ? 10 : 9}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={coCungPhi ? 14.5 : 16}
                    fontWeight={700}
                    fill="#1F140D"
                    paintOrder="stroke"
                    stroke="#FFFDF8"
                    strokeWidth={3}
                    strokeLinejoin="round"
                  >
                    {q.cung.ten}
                  </text>
                  {!coCungPhi ? (
                    <text
                      x={0}
                      y={28}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12.5}
                      fontWeight={600}
                      fill="#4A3829"
                    >
                      {q.cung.phuong}
                    </text>
                  ) : null}
                </g>

                {coCungPhi && q.duNien ? (
                  <g transform={`translate(${posDuNien.x}, ${posDuNien.y}) rotate(${rot})`}>
                    <text
                      x={0}
                      y={-7}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={14}
                      fontWeight={700}
                      fill={laCat ? '#1A7429' : '#945F12'}
                      paintOrder="stroke"
                      stroke={laCat ? '#E6EFE3' : '#FBF4E4'}
                      strokeWidth={3}
                      strokeLinejoin="round"
                    >
                      {laCat ? `✦ ${q.duNien.ten}` : `◇ ${q.duNien.ten}`}
                    </text>
                    <text
                      x={0}
                      y={11}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={11.5}
                      fontWeight={600}
                      fill={laCat ? '#1A7429' : '#945F12'}
                      paintOrder="stroke"
                      stroke={laCat ? '#E6EFE3' : '#FBF4E4'}
                      strokeWidth={3}
                      strokeLinejoin="round"
                    >
                      {laCat ? 'Cát' : 'Không cát'}
                    </text>
                  </g>
                ) : null}
              </a>
            );
          })}

          {/* Tâm la bàn */}
          <circle
            cx={CX}
            cy={CY}
            r={rTam}
            fill="#FFFDF8"
            stroke="#9C7E4A"
            strokeWidth={1.4}
          />
          {coHuong ? (
            <circle cx={CX} cy={CY} r={6} fill="#8E1B12" stroke="#FFFDF8" strokeWidth={2} />
          ) : (
            <>
              <text
                x={CX}
                y={CY - 9}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
                fontWeight={700}
                fill="#8E1B12"
              >
                {laBan.cungPhi ? `Cung ${laBan.cungPhi}` : '24 sơn'}
              </text>
              <text
                x={CX}
                y={CY + 10}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fill="#4A3829"
              >
                {laBan.cungPhi ? '8 phương' : '8 quái'}
              </text>
            </>
          )}

          {/* Nhãn Hướng XXX° ở đầu mũi tên */}
          {nhanHuongPos && nhanHuongText ? (
            <g transform={`translate(${nhanHuongPos.x}, ${nhanHuongPos.y})`} pointerEvents="none">
              <rect
                x={-pillW / 2}
                y={-13}
                width={pillW}
                height={26}
                rx={3}
                fill="#8E1B12"
                stroke="#FBE7AE"
                strokeWidth={1.2}
              />
              <text
                x={0}
                y={0.5}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13}
                fontWeight={700}
                fill="#FBF1DA"
              >
                {nhanHuongText}
              </text>
            </g>
          ) : null}
        </svg>

        {/* Chú giải */}
        <ul className="ck-tq-lb-chu-giai" aria-label="Chú giải la bàn">
          {coCungPhi ? (
            <>
              <li>
                <span className="ck-tq-lb-mau ck-tq-lb-mau-cat" aria-hidden="true">
                  ✦
                </span>
                <span>Cát (viền liền)</span>
              </li>
              <li>
                <span className="ck-tq-lb-mau ck-tq-lb-mau-khong-cat" aria-hidden="true">
                  ◇
                </span>
                <span>Không cát (gạch chéo, viền đứt)</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <span className="ck-tq-lb-mau ck-tq-lb-mau-cat" aria-hidden="true" />
                <span>Đông tứ (Khảm, Ly, Chấn, Tốn)</span>
              </li>
              <li>
                <span className="ck-tq-lb-mau ck-tq-lb-mau-khong-cat" aria-hidden="true" />
                <span>Tây tứ (Càn, Khôn, Cấn, Đoài)</span>
              </li>
            </>
          )}
          {coHuong ? (
            <>
              <li>
                <span className="ck-tq-lb-net ck-tq-lb-net-huong" aria-hidden="true" />
                <span>Hướng ({sonHuong})</span>
              </li>
              <li>
                <span className="ck-tq-lb-net ck-tq-lb-net-toa" aria-hidden="true" />
                <span>Tọa ({sonToa}, nét đứt)</span>
              </li>
            </>
          ) : null}
          {gocRanhGanNhat !== undefined ? (
            <li>
              <span className="ck-tq-lb-net ck-tq-lb-net-ranh" aria-hidden="true" />
              <span>Ranh sơn gần nhất</span>
            </li>
          ) : null}
        </ul>
      </div>

      {/* Bấm quái mở <details> bên dưới (cũng hoạt động khi tắt JS nhờ href neo #) */}
      <p className="ck-tq-lb-goi-y">
        Bấm một quái trên la bàn hoặc chọn bên dưới để mở chi tiết phương và 3 sơn:
      </p>
      <div className="ck-tq-lb-chi-tiet-luoi">
        {laBan.quai.map((q) => {
          const detailId = `${idPrefix}-quai-${q.cung.slug}`;
          const dn = q.duNien;
          return (
            <details key={q.cung.slug} id={detailId} className="ck-tq-lb-details">
              <summary className="ck-tq-lb-summary">
                <span className="ck-tq-lb-sum-ten">
                  <span aria-hidden="true">{q.cung.kyHieu}</span> {q.cung.ten} · {q.cung.phuong}
                </span>
                {dn ? (
                  <span className={`ck-tq-lb-tag ${dn.cat ? 'ck-tq-lb-tag-cat' : 'ck-tq-lb-tag-diu'}`}>
                    {dn.cat ? '✦' : '◇'} {dn.ten}
                  </span>
                ) : (
                  <span className="ck-tq-lb-tag ck-tq-lb-tag-binh">{q.cung.nhom} tứ</span>
                )}
              </summary>
              <div className="ck-tq-lb-body">
                <p>
                  Quái <strong>{q.cung.ten}</strong>{' '}
                  <span lang="zh-Hant">({q.cung.han})</span> · 3 sơn:{' '}
                  <strong>{q.cung.son.join(', ')}</strong> ({dinhDangDoNgan(q.tu)}–
                  {dinhDangDoNgan(q.den)}) · {q.cung.nhom} tứ.
                </p>
                {dn ? (
                  <>
                    <p>
                      Du niên: <strong>{dn.ten}</strong>{' '}
                      <span lang="zh-Hant">({dn.han})</span> · Sao: <strong>{dn.sao}</strong>{' '}
                      <span lang="zh-Hant">({dn.saoHan})</span> · {dn.moTaBien} ·{' '}
                      <span className={dn.cat ? 'ck-tq-chu-tot' : 'ck-tq-chu-diu'}>
                        {dn.cat ? 'Cát' : 'Không cát'}
                      </span>
                      .
                    </p>
                    <figure className="ck-tq-trich">
                      <blockquote className="ck-tq-trich-han" lang="zh-Hant">
                        {dn.trich.han}
                      </blockquote>
                      <figcaption className="ck-tq-trich-nguon">
                        {dn.trich.phienAm} — {viTriTrich(dn.trich)}.
                      </figcaption>
                    </figure>
                  </>
                ) : null}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

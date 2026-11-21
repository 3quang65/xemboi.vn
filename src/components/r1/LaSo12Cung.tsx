'use client';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Cung, HoaTen, LaSo, LuuNien, NguHanh, Sao } from '@/lib/tuvi-v2';
import { BatQuaiSvg, ChiaVach, HoaVanGocVang4, TrienXemBoi } from './HoaVanE3';

// Tọa độ 12 cung trên lưới 4x4 truyền thống (0 = Tý .. 11 = Hợi)
const VI_TRI_LUOI_4X4: Record<number, { col: number; row: number }> = {
  5: { col: 1, row: 1 }, // Tỵ
  6: { col: 2, row: 1 }, // Ngọ
  7: { col: 3, row: 1 }, // Mùi
  8: { col: 4, row: 1 }, // Thân
  4: { col: 1, row: 2 }, // Thìn
  9: { col: 4, row: 2 }, // Dậu
  3: { col: 1, row: 3 }, // Mão
  10: { col: 4, row: 3 }, // Tuất
  2: { col: 1, row: 4 }, // Dần
  1: { col: 2, row: 4 }, // Sửu
  0: { col: 3, row: 4 }, // Tý
  11: { col: 4, row: 4 }, // Hợi
};

// Điểm đầu mút tam hợp / xung chiếu trên mép Thiên bàn (%)
const EDGE_PCT: Record<number, [number, number]> = {
  5: [0, 0],
  6: [25, 0],
  7: [75, 0],
  8: [100, 0],
  4: [0, 25],
  9: [100, 25],
  3: [0, 75],
  10: [100, 75],
  2: [0, 100],
  1: [25, 100],
  0: [75, 100],
  11: [100, 100],
};

const CAN_VIET_TAT: Record<string, string> = {
  Giáp: 'G',
  Ất: 'Ấ',
  Bính: 'B',
  Đinh: 'Đ',
  Mậu: 'M',
  Kỷ: 'K',
  Canh: 'C',
  Tân: 'T',
  Nhâm: 'N',
  Quý: 'Q',
};

const HANH_CLS: Record<NguHanh, string> = {
  Kim: 'r1e-c-k',
  Mộc: 'r1e-c-m',
  Thủy: 'r1e-c-t',
  Hỏa: 'r1e-c-h',
  Thổ: 'r1e-c-o',
};

const DAC_TINH_TEN: Record<string, string> = {
  M: 'Miếu',
  V: 'Vượng',
  Đ: 'Đắc',
  B: 'Bình',
  H: 'Hãm',
};

const TAT = [
  'MỆNH',
  'PHỤ',
  'PHÚC',
  'ĐIỀN',
  'QUAN',
  'NÔ',
  'DI',
  'TẬT',
  'TÀI',
  'TỬ',
  'PHỐI',
  'HUYNH',
];

const TRUNG_SET = new Set([
  'Tả Phù',
  'Hữu Bật',
  'Văn Xương',
  'Văn Khúc',
  'Thiên Khôi',
  'Thiên Việt',
  'Lộc Tồn',
  'Thiên Mã',
  'Kình Dương',
  'Đà La',
  'Hỏa Tinh',
  'Linh Tinh',
  'Địa Không',
  'Địa Kiếp',
  'Hóa Lộc',
  'Hóa Quyền',
  'Hóa Khoa',
  'Hóa Kỵ',
]);

const SAO_LUU_META: Record<string, { hanh: NguHanh; cot: 'cat' | 'sat' }> = {
  luu_thaiTue: { hanh: 'Hỏa', cot: 'sat' },
  luu_tangMon: { hanh: 'Mộc', cot: 'sat' },
  luu_bachHo: { hanh: 'Kim', cot: 'sat' },
  luu_thienKhoc: { hanh: 'Thủy', cot: 'sat' },
  luu_thienHu: { hanh: 'Thủy', cot: 'sat' },
  luu_locTon: { hanh: 'Thổ', cot: 'cat' },
  luu_kinhDuong: { hanh: 'Kim', cot: 'sat' },
  luu_daLa: { hanh: 'Kim', cot: 'sat' },
  luu_thienMa: { hanh: 'Hỏa', cot: 'cat' },
  luu_thienKhoi: { hanh: 'Hỏa', cot: 'cat' },
  luu_thienViet: { hanh: 'Hỏa', cot: 'cat' },
  luu_vanXuong: { hanh: 'Kim', cot: 'cat' },
  luu_vanKhuc: { hanh: 'Thủy', cot: 'cat' },
  luu_hongLoan: { hanh: 'Thủy', cot: 'cat' },
  luu_thienHy: { hanh: 'Thủy', cot: 'cat' },
};

const LUU_HOA_META: Record<HoaTen, { hanh: NguHanh; cot: 'cat' | 'sat' }> = {
  'Hóa Lộc': { hanh: 'Mộc', cot: 'cat' },
  'Hóa Quyền': { hanh: 'Hỏa', cot: 'cat' },
  'Hóa Khoa': { hanh: 'Kim', cot: 'cat' },
  'Hóa Kỵ': { hanh: 'Thủy', cot: 'sat' },
};

interface PhuStarRender {
  key: string;
  ten: string;
  hanh: NguHanh;
  dacTinh: string | null;
  luu: boolean;
  namXem?: number;
}

interface TtBadgeItem {
  id: string;
  chis: number[];
  text: string;
}

interface TtPosition {
  id: string;
  text: string;
  title: string;
  left: number;
  top: number;
}

interface TbGeometry {
  w: number;
  h: number;
  pts: [number, number][];
  xung: [number, number];
  cv: number;
}

export interface LaSo12CungProps {
  laSo: LaSo;
  luuNien2027: LuuNien;
  moTaQuyUoc: string[];
  highlightedChis?: number[];
}

function dinhDangGio(dongHo: string): string {
  const parts = dongHo.split(':');
  if (parts.length !== 2) return dongHo;
  const g = parseInt(parts[0], 10);
  if (Number.isNaN(g)) return dongHo;
  return `${g} giờ ${parts[1]} phút`;
}

function buildTtItems(tuanCung: number[], trietCung: number[]): TtBadgeItem[] {
  const cleanTuan = tuanCung.filter((x) => x >= 0 && x <= 11);
  const cleanTriet = trietCung.filter((x) => x >= 0 && x <= 11);
  const sigTuan = [...cleanTuan].sort((a, b) => a - b).join(',');
  const sigTriet = [...cleanTriet].sort((a, b) => a - b).join(',');

  if (cleanTuan.length > 0 && sigTuan === sigTriet) {
    return [{ id: 'tt-chung', chis: cleanTuan, text: 'Tuần – Triệt' }];
  }
  const items: TtBadgeItem[] = [];
  if (cleanTuan.length > 0) items.push({ id: 'tt-tuan', chis: cleanTuan, text: 'Tuần' });
  if (cleanTriet.length > 0) items.push({ id: 'tt-triet', chis: cleanTriet, text: 'Triệt' });
  return items;
}

function tinhDemTuanTriet(items: TtBadgeItem[]): Record<number, { tren: boolean; duoi: boolean }> {
  const map: Record<number, { tren: boolean; duoi: boolean }> = {};
  const add = (chi: number, dir: 'tren' | 'duoi') => {
    if (!map[chi]) map[chi] = { tren: false, duoi: false };
    map[chi][dir] = true;
  };
  for (const item of items) {
    if (item.chis.length >= 2) {
      const a = VI_TRI_LUOI_4X4[item.chis[0]];
      const b = VI_TRI_LUOI_4X4[item.chis[1]];
      if (!a || !b) continue;
      if (a.col === b.col) {
        const trenChi = a.row < b.row ? item.chis[0] : item.chis[1];
        const duoiChi = trenChi === item.chis[0] ? item.chis[1] : item.chis[0];
        add(trenChi, 'duoi');
        add(duoiChi, 'tren');
      } else {
        const dir = a.row === 1 ? 'duoi' : 'tren';
        add(item.chis[0], dir);
        add(item.chis[1], dir);
      }
    } else if (item.chis.length === 1) {
      const p = VI_TRI_LUOI_4X4[item.chis[0]];
      if (p) add(item.chis[0], p.row === 1 ? 'duoi' : 'tren');
    }
  }
  return map;
}

function starTitle(ten: string, hanh: NguHanh, dacTinh: string | null, luu: boolean, namXem?: number): string {
  const parts = [ten, `hành ${hanh}`];
  if (dacTinh && DAC_TINH_TEN[dacTinh]) parts.push(DAC_TINH_TEN[dacTinh]);
  if (luu) parts.push(`sao lưu năm ${namXem ?? 2027}`);
  return parts.join(' · ');
}

function renderSubList(stars: PhuStarRender[]) {
  return (
    <ul>
      {stars.map((s) => (
        <li
          key={s.key}
          className={`${HANH_CLS[s.hanh]}${TRUNG_SET.has(s.ten) ? ' r1e-dam' : ''}${s.luu ? ' r1e-luu' : ''}`}
          title={starTitle(s.ten, s.hanh, s.dacTinh, s.luu, s.namXem)}
        >
          {s.luu ? (
            <>
              <span className="r1e-sr">L. </span>
              {s.ten.replace(/^L\.\s*/, '')}
            </>
          ) : (
            s.ten
          )}
          {s.dacTinh ? (
            <>
              {' '}
              <small>({s.dacTinh})</small>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

interface LuoiLaSoProps {
  laSo: LaSo;
  luuNien2027: LuuNien;
  highlightedChis: number[];
  animateLines?: boolean;
  ariaLabel?: string;
}

function LuoiLaSo4x4({
  laSo,
  luuNien2027,
  highlightedChis,
  animateLines = false,
  ariaLabel = 'Lưới lá số 4 nhân 4: 12 cung ở vành ngoài, thiên bàn ở giữa',
}: LuoiLaSoProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const tbRef = useRef<HTMLDivElement | null>(null);
  const [tbGeom, setTbGeom] = useState<TbGeometry | null>(null);
  const [ttPositions, setTtPositions] = useState<TtPosition[]>([]);

  const menhCung = laSo.cung.find((c) => c.ten === 'Mệnh') ?? laSo.cung[0];
  const menhChi = menhCung?.chi ?? 2;
  const thanCung = laSo.cung.find((c) => c.laThan);
  const ttItems = useMemo(
    () => buildTtItems(laSo.tuanCung ?? [], laSo.trietCung ?? []),
    [laSo.tuanCung, laSo.trietCung],
  );
  const demMap = useMemo(() => tinhDemTuanTriet(ttItems), [ttItems]);

  const luuByChi = useMemo(() => {
    const map = new Map<number, { cat: PhuStarRender[]; sat: PhuStarRender[] }>();
    const ensure = (chi: number) => {
      let entry = map.get(chi);
      if (!entry) {
        entry = { cat: [], sat: [] };
        map.set(chi, entry);
      }
      return entry;
    };
    for (const sl of luuNien2027.saoLuu ?? []) {
      const meta = SAO_LUU_META[sl.key] ?? { hanh: 'Thổ' as NguHanh, cot: 'cat' as const };
      ensure(sl.chi)[meta.cot].push({
        key: `${sl.key}-${sl.chi}`,
        ten: sl.ten,
        hanh: meta.hanh,
        dacTinh: null,
        luu: true,
        namXem: luuNien2027.namXem,
      });
    }
    for (const lh of luuNien2027.luuTuHoa ?? []) {
      const meta = LUU_HOA_META[lh.hoa] ?? { hanh: 'Thổ' as NguHanh, cot: 'cat' as const };
      ensure(lh.chi)[meta.cot].push({
        key: `luu-hoa-${lh.hoa}-${lh.chi}`,
        ten: `L. ${lh.hoa}`,
        hanh: meta.hanh,
        dacTinh: null,
        luu: true,
        namXem: luuNien2027.namXem,
      });
    }
    return map;
  }, [luuNien2027]);

  const measureGeometry = useCallback(() => {
    const tb = tbRef.current;
    if (tb) {
      const w = tb.clientWidth;
      const h = tb.clientHeight;
      if (w > 0 && h > 0) {
        const m = 8;
        const vertex = (chi: number): [number, number] => {
          const e = EDGE_PCT[chi] ?? [50, 50];
          return [
            Math.min(w - m, Math.max(m, (e[0] / 100) * w)),
            Math.min(h - m, Math.max(m, (e[1] / 100) * h)),
          ];
        };
        const t0 = vertex(menhChi);
        const t1 = vertex((menhChi + 4) % 12);
        const t2 = vertex((menhChi + 8) % 12);
        const x = vertex((menhChi + 6) % 12);
        const pts: [number, number][] = [t0, t1, t2];
        let perimeter = 0;
        for (let i = 0; i < 3; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % 3];
          perimeter += Math.hypot(b[0] - a[0], b[1] - a[1]);
        }
        const cv = Math.ceil(perimeter) + 4;
        setTbGeom({ w, h, pts, xung: x, cv });
      }
    }

    const grid = gridRef.current;
    if (grid) {
      const nextPositions: TtPosition[] = [];
      for (const item of ttItems) {
        if (item.chis.length >= 2) {
          const elA = grid.querySelector<HTMLElement>(`.r1e-o[data-chi="${item.chis[0]}"]`);
          const elB = grid.querySelector<HTMLElement>(`.r1e-o[data-chi="${item.chis[1]}"]`);
          const posA = VI_TRI_LUOI_4X4[item.chis[0]];
          const posB = VI_TRI_LUOI_4X4[item.chis[1]];
          const cA = laSo.cung.find((c) => c.chi === item.chis[0]);
          const cB = laSo.cung.find((c) => c.chi === item.chis[1]);
          if (elA && elB && posA && posB) {
            let x = 0;
            let y = 0;
            if (posA.col === posB.col) {
              const lowerEl = posA.row > posB.row ? elA : elB;
              x = lowerEl.offsetLeft + lowerEl.offsetWidth / 2;
              y = lowerEl.offsetTop;
            } else {
              const rightEl = posA.col > posB.col ? elA : elB;
              x = rightEl.offsetLeft;
              y = posA.row === 1 ? rightEl.offsetTop + rightEl.offsetHeight : rightEl.offsetTop;
            }
            nextPositions.push({
              id: item.id,
              text: item.text,
              title: `${item.text} (${cA?.tenChi ?? ''}–${cB?.tenChi ?? ''})`,
              left: x,
              top: y,
            });
          }
        } else if (item.chis.length === 1) {
          const el = grid.querySelector<HTMLElement>(`.r1e-o[data-chi="${item.chis[0]}"]`);
          const pos = VI_TRI_LUOI_4X4[item.chis[0]];
          const c = laSo.cung.find((x) => x.chi === item.chis[0]);
          if (el && pos) {
            nextPositions.push({
              id: item.id,
              text: item.text,
              title: `${item.text} (${c?.tenChi ?? ''})`,
              left: el.offsetLeft + el.offsetWidth / 2,
              top: pos.row === 1 ? el.offsetTop + el.offsetHeight : el.offsetTop,
            });
          }
        }
      }
      setTtPositions(nextPositions);
    }
  }, [laSo.cung, menhChi, ttItems]);

  useLayoutEffect(() => {
    measureGeometry();
    const tb = tbRef.current;
    const grid = gridRef.current;
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measureGeometry);
      return () => window.removeEventListener('resize', measureGeometry);
    }
    const ro = new ResizeObserver(measureGeometry);
    if (tb) ro.observe(tb);
    if (grid) ro.observe(grid);
    if (document.fonts?.ready) {
      document.fonts.ready.then(measureGeometry).catch(() => {});
    }
    return () => ro.disconnect();
  }, [measureGeometry]);

  const luuNguyet = Array.isArray(luuNien2027.luuNguyet) ? luuNien2027.luuNguyet : null;
  const amDuongLyLower =
    laSo.amDuongLy.charAt(0).toLocaleLowerCase('vi') + laSo.amDuongLy.slice(1);
  const thanLabel = thanCung ? `${thanCung.ten} (${thanCung.tenChi})` : laSo.thanTai;

  const tbRows: [string, string, string?][] = [
    ['Họ tên', 'Đã ẩn'],
    ['Năm', String(laSo.duong.nam), laSo.canChi.nam],
    [
      'Tháng',
      `${laSo.duong.thang} (${laSo.am.thang}${laSo.am.nhuan ? ' nhuận' : ''})`,
      laSo.canChi.thang,
    ],
    ['Ngày', `${laSo.duong.ngay} (${laSo.am.ngay})`, laSo.canChi.ngay],
    ['Giờ', dinhDangGio(laSo.gio.dongHo), laSo.gio.canChi],
    ['Năm xem', `${luuNien2027.canChi} (${luuNien2027.namXem}), ${luuNien2027.tuoiMu} tuổi`],
    ['Âm dương', `${laSo.amDuong}, ${amDuongLyLower}`],
    ['Bản mệnh', laSo.banMenh],
    ['Cục', `${laSo.cuc} (${laSo.sinhKhac})`],
    ['Chủ mệnh', laSo.menhChu],
    ['Chủ thân', laSo.thanChu],
    ['Thân cư', thanLabel],
  ];

  const f = (n: number) => n.toFixed(1);

  return (
    <div
      ref={gridRef}
      className={`r1e-laso${animateLines ? ' r1e-laso-anim' : ''}`}
      aria-label={ariaLabel}
    >
      {laSo.cung.map((c: Cung) => {
        const pos = VI_TRI_LUOI_4X4[c.chi];
        if (!pos) return null;
        const dem = demMap[c.chi];
        const isMenh = c.ten === 'Mệnh';
        const isSoi = highlightedChis.includes(c.chi);
        const luuData = luuByChi.get(c.chi);
        const catList: PhuStarRender[] = [
          ...c.catTinh.map((s: Sao) => ({
            key: s.key,
            ten: s.ten,
            hanh: s.hanh,
            dacTinh: s.dacTinh,
            luu: false,
          })),
          ...(luuData?.cat ?? []),
        ];
        const satList: PhuStarRender[] = [
          ...c.hungTinh.map((s: Sao) => ({
            key: s.key,
            ten: s.ten,
            hanh: s.hanh,
            dacTinh: s.dacTinh,
            luu: false,
          })),
          ...(luuData?.sat ?? []),
        ];
        const thangIdx = luuNguyet ? luuNguyet.indexOf(c.chi) : -1;
        const dvIdx =
          luuNien2027.daiVan !== null && luuNien2027.daiVan !== undefined
            ? (c.chi - luuNien2027.daiVan + 12) % 12
            : null;
        const lnIdx = (c.chi - luuNien2027.luuThaiTue + 12) % 12;

        const cls = [
          'r1e-o',
          isMenh ? 'r1e-menh' : '',
          isSoi ? 'r1e-soi' : '',
          pos.col === 4 ? 'r1e-c4' : '',
          pos.row === 4 ? 'r1e-r4' : '',
          dem?.tren ? 'r1e-dem-tren' : '',
          dem?.duoi ? 'r1e-dem-duoi' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={c.chi}
            className={cls}
            data-chi={c.chi}
            style={{ gridRow: pos.row, gridColumn: pos.col }}
          >
            <div className="r1e-o-dau">
              <div className="r1e-o-tr">
                <b title={`${c.can} ${c.tenChi}`}>
                  {CAN_VIET_TAT[c.can] ?? c.can}.{c.tenChi}
                </b>
                <span>
                  {c.chi % 2 ? '−' : '+'}
                  {c.hanhCung}
                </span>
              </div>

              <div className="r1e-o-gi">
                <div className={`r1e-o-ten ${HANH_CLS[c.hanhCung]}`}>
                  {c.ten.toUpperCase()}
                  {c.laThan && <em className="r1e-than">Thân</em>}
                </div>
                {c.chinhTinh.length > 0 ? (
                  c.chinhTinh.map((s) => (
                    <div
                      key={s.key}
                      className={`r1e-ct ${HANH_CLS[s.hanh]}`}
                      title={starTitle(s.ten, s.hanh, s.dacTinh, false)}
                    >
                      {s.ten.toUpperCase()}
                      {s.dacTinh ? (
                        <>
                          {' '}
                          <small>({s.dacTinh})</small>
                        </>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="r1e-vcd">Vô chính diệu</div>
                )}
              </div>

              <div className="r1e-o-ph">
                <b title={`Đại vận ${c.daiVan} tuổi`}>{c.daiVanTu}</b>
                {thangIdx >= 0 && (
                  <span title={`Tháng âm lịch năm ${luuNien2027.namXem}`}>Th.{thangIdx + 1}</span>
                )}
              </div>
            </div>

            <div className="r1e-o-phu">
              {renderSubList(catList)}
              {renderSubList(satList)}
            </div>

            <div className="r1e-o-day">
              {dvIdx !== null ? (
                <span
                  className={dvIdx === 0 ? 'r1e-nhan' : undefined}
                  title="Tên cung theo đại vận đang đi"
                >
                  ĐV.{TAT[dvIdx]}
                </span>
              ) : (
                <span />
              )}
              <span className="r1e-ts" title="Vòng Tràng Sinh">
                {c.trangSinh}
              </span>
              <span
                className={lnIdx === 0 ? 'r1e-nhan' : undefined}
                title={`Tên cung theo lưu niên ${luuNien2027.namXem}`}
              >
                LN.{TAT[lnIdx]}
              </span>
            </div>
          </div>
        );
      })}

      {/* Thiên bàn kiểu tuvi.vn đặt thẳng trên nền ngà */}
      <div ref={tbRef} className="r1e-tb">
        <span className="r1e-tb-bq" aria-hidden="true">
          <BatQuaiSvg />
        </span>

        <svg
          className="r1e-tb-ke"
          viewBox={tbGeom ? `0 0 ${tbGeom.w} ${tbGeom.h}` : undefined}
          aria-hidden="true"
        >
          {tbGeom && (
            <>
              <line
                className="r1e-tb-xung"
                x1={f(tbGeom.pts[0][0])}
                y1={f(tbGeom.pts[0][1])}
                x2={f(tbGeom.xung[0])}
                y2={f(tbGeom.xung[1])}
              />
              <polygon
                className="r1e-tb-tam"
                points={tbGeom.pts.map((p) => `${f(p[0])},${f(p[1])}`).join(' ')}
                style={{ '--cv': String(tbGeom.cv) } as React.CSSProperties}
              />
              {tbGeom.pts.map((p, idx) => (
                <circle key={idx} className="r1e-tb-cham" cx={f(p[0])} cy={f(p[1])} r="4.6" />
              ))}
              <circle
                className="r1e-tb-cham r1e-x"
                cx={f(tbGeom.xung[0])}
                cy={f(tbGeom.xung[1])}
                r="4.2"
              />
            </>
          )}
        </svg>

        <div className="r1e-tb-noi">
          <div className="r1e-tb-sub">xemboi.vn · quy ước Nam phái</div>
          <div className="r1e-tb-tit">Lá Số Tử Vi</div>
          <ChiaVach />
          <table className="r1e-tb-bang">
            <caption>Số trong ngoặc là âm lịch</caption>
            <tbody>
              {tbRows.map(([label, val, cc]) => (
                <tr key={label}>
                  <th>{label}</th>
                  {cc ? (
                    <>
                      <td>{val}</td>
                      <td className="r1e-cc">{cc}</td>
                    </>
                  ) : (
                    <td colSpan={2}>{val}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="r1e-tb-chu">
            <span>
              <svg viewBox="0 0 28 10" aria-hidden="true">
                <path d="M3 5h22" stroke="#B3261C" strokeWidth="1.6" />
                <circle cx="3.5" cy="5" r="2.6" fill="#B3261C" />
                <circle cx="24.5" cy="5" r="2.6" fill="#B3261C" />
              </svg>
              Tam hợp Mệnh
            </span>
            <span>
              <svg viewBox="0 0 28 10" aria-hidden="true">
                <path d="M2 5h24" stroke="#8A6420" strokeWidth="1.4" strokeDasharray="5 4" />
              </svg>
              Xung chiếu Mệnh
            </span>
          </div>
        </div>

        <div className="r1e-tb-trien">
          <TrienXemBoi />
        </div>
      </div>

      {/* Nhãn Tuần / Triệt trên vạch chia cung */}
      {ttPositions.map((p) => (
        <span
          key={p.id}
          className="r1e-tt"
          style={{ left: `${p.left}px`, top: `${p.top}px` }}
          title={p.title}
        >
          {p.text}
        </span>
      ))}
    </div>
  );
}

function ChanLaSo({ namXem }: { namXem: number }) {
  return (
    <div className="r1e-ls-chan">
      <span className="r1e-dsang">
        <b>M</b>Miếu · <b>V</b>Vượng · <b>Đ</b>Đắc · <b>B</b>Bình · <b>H</b>Hãm
      </span>
      <span className="r1e-hanh">
        <span className="r1e-c-k">
          <i style={{ background: 'var(--kim)' }} />
          Kim
        </span>
        <span className="r1e-c-m">
          <i style={{ background: 'var(--moc)' }} />
          Mộc
        </span>
        <span className="r1e-c-t">
          <i style={{ background: 'var(--thuy)' }} />
          Thủy
        </span>
        <span className="r1e-c-h">
          <i style={{ background: 'var(--hoa)' }} />
          Hỏa
        </span>
        <span className="r1e-c-o">
          <i style={{ background: 'var(--tho)' }} />
          Thổ
        </span>
      </span>
      <span>
        <span className="r1e-luu-mau" aria-hidden="true">
          L
        </span>
        sao lưu {namXem} · Họ tên đã ẩn · xemboi.vn
      </span>
    </div>
  );
}

export default function LaSo12Cung({
  laSo,
  luuNien2027,
  moTaQuyUoc,
  highlightedChis = [],
}: LaSo12CungProps) {
  const khungRef = useRef<HTMLDivElement | null>(null);
  const voRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [khungHeight, setKhungHeight] = useState<number | undefined>(undefined);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomMuc, setZoomMuc] = useState(1);

  const capNhatScale = useCallback(() => {
    const khung = khungRef.current;
    const vo = voRef.current;
    if (!khung || !vo) return;
    const w = khung.clientWidth;
    const voW = vo.offsetWidth || 1236;
    const voH = vo.offsetHeight || 1220;
    const s = Math.min(1, w / voW);
    setScale(s);
    setKhungHeight(s < 1 ? Math.ceil(voH * s) : undefined);
  }, []);

  useLayoutEffect(() => {
    capNhatScale();
    const khung = khungRef.current;
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', capNhatScale);
      return () => window.removeEventListener('resize', capNhatScale);
    }
    const ro = new ResizeObserver(capNhatScale);
    if (khung) ro.observe(khung);
    if (voRef.current) ro.observe(voRef.current);
    if (document.fonts?.ready) {
      document.fonts.ready.then(capNhatScale).catch(() => {});
    }
    return () => ro.disconnect();
  }, [capNhatScale, laSo]);

  useEffect(() => {
    if (!zoomOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [zoomOpen]);

  const laThuNho = scale < 0.995;

  // Danh sách 12 cung đọc ở mobile: từ Mệnh đi ngược chiều kim đồng hồ (giống huong-e3.html THU_TU)
  const danhSachCung = useMemo(() => {
    const menh = laSo.cung.find((c) => c.ten === 'Mệnh');
    const start = menh?.chi ?? 2;
    const arr: Cung[] = [];
    for (let k = 0; k < 12; k++) {
      const chi = (start - k + 12) % 12;
      const found = laSo.cung.find((c) => c.chi === chi);
      if (found) arr.push(found);
    }
    return arr;
  }, [laSo.cung]);

  const daiVanCung =
    luuNien2027.daiVan !== null && luuNien2027.daiVan !== undefined
      ? laSo.cung.find((c) => c.chi === luuNien2027.daiVan)
      : undefined;
  const luuThaiTueCung = laSo.cung.find((c) => c.chi === luuNien2027.luuThaiTue);
  const luuNguyet = Array.isArray(luuNien2027.luuNguyet) ? luuNien2027.luuNguyet : null;

  const luuByChi = useMemo(() => {
    const map = new Map<number, { cat: PhuStarRender[]; sat: PhuStarRender[] }>();
    const ensure = (chi: number) => {
      let e = map.get(chi);
      if (!e) {
        e = { cat: [], sat: [] };
        map.set(chi, e);
      }
      return e;
    };
    for (const sl of luuNien2027.saoLuu ?? []) {
      const meta = SAO_LUU_META[sl.key] ?? { hanh: 'Thổ' as NguHanh, cot: 'cat' as const };
      ensure(sl.chi)[meta.cot].push({
        key: `${sl.key}-${sl.chi}`,
        ten: sl.ten,
        hanh: meta.hanh,
        dacTinh: null,
        luu: true,
        namXem: luuNien2027.namXem,
      });
    }
    for (const lh of luuNien2027.luuTuHoa ?? []) {
      const meta = LUU_HOA_META[lh.hoa] ?? { hanh: 'Thổ' as NguHanh, cot: 'cat' as const };
      ensure(lh.chi)[meta.cot].push({
        key: `luu-hoa-${lh.hoa}-${lh.chi}`,
        ten: `L. ${lh.hoa}`,
        hanh: meta.hanh,
        dacTinh: null,
        luu: true,
        namXem: luuNien2027.namXem,
      });
    }
    return map;
  }, [luuNien2027]);

  return (
    <>
      <div className={`r1e-ls-wrap${laThuNho ? ' r1e-hep' : ''}`}>
        {laThuNho && (
          <div className="r1e-ls-cong">
            <span>
              Lá số đã thu nhỏ cho vừa màn hình. Chạm vào lá số hoặc bấm nút để mở xem cỡ thật.
            </span>
            <button
              type="button"
              className="r1e-nut r1e-nut-vien"
              onClick={() => {
                setZoomMuc(1);
                setZoomOpen(true);
              }}
            >
              Phóng to
            </button>
          </div>
        )}

        <div
          ref={khungRef}
          className={`r1e-ls-khung${laThuNho ? ' r1e-nho' : ''}`}
          style={khungHeight ? { height: `${khungHeight}px` } : undefined}
          tabIndex={laThuNho ? 0 : undefined}
          role={laThuNho ? 'button' : undefined}
          aria-label={laThuNho ? 'Lá số tử vi 12 cung. Chạm để phóng to.' : undefined}
          onClick={() => {
            if (laThuNho) {
              setZoomMuc(1);
              setZoomOpen(true);
            }
          }}
          onKeyDown={(e) => {
            if (laThuNho && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              setZoomMuc(1);
              setZoomOpen(true);
            }
          }}
        >
          <div
            ref={voRef}
            className="r1e-ls-vo"
            style={laThuNho ? { transform: `scale(${scale})` } : undefined}
          >
            <HoaVanGocVang4 />
            <div className="r1e-ls-nga">
              <LuoiLaSo4x4
                laSo={laSo}
                luuNien2027={luuNien2027}
                highlightedChis={highlightedChis}
                animateLines
              />
              <ChanLaSo namXem={luuNien2027.namXem} />
            </div>
          </div>
        </div>
      </div>

      {/* Chú giải đọc lá số */}
      <div className="r1e-ls-giai">
        <p>
          <b>Màu sao theo ngũ hành:</b> Kim xám bạc, Mộc xanh lá, Thủy xanh đen, Hỏa đỏ, Thổ vàng
          cam. Màu đã chỉnh để đọc rõ trên nền ngà.
        </p>
        <p>
          <b>Độ sáng</b> (M, V, Đ, B, H) là mức phát huy của sao ở cung đó, không phải nhãn tốt xấu.
        </p>
        <p>
          <b>
            <span className="r1e-luu-mau" aria-hidden="true">
              L
            </span>
            Sao lưu
          </b>{' '}
          năm {luuNien2027.namXem} (trong dữ liệu ghi &ldquo;L.&rdquo;), xếp cuối mỗi cột.{' '}
          {luuNguyet && (
            <>
              <b>Th.</b> là tháng âm lịch năm {luuNien2027.namXem} rơi vào cung.
            </>
          )}
        </p>
        <p>
          {daiVanCung && (
            <>
              <b>ĐV.</b> là tên cung theo đại vận đang đi ({daiVanCung.daiVan} tuổi, cung{' '}
              {daiVanCung.tenChi}).{' '}
            </>
          )}
          <b>LN.</b> là tên cung theo lưu niên {luuNien2027.namXem} (Thái Tuế tại{' '}
          {luuThaiTueCung?.tenChi ?? ''}).
        </p>
        <p>
          <b>Chữ đậm:</b> lục cát, lục sát, Lộc Tồn, Thiên Mã và Tứ Hóa.
        </p>
      </div>

      {/* Công khai quy ước an sao */}
      <details className="r1e-quyuoc">
        <summary>Quy ước an sao đang áp dụng (Nam Phái · công khai minh bạch)</summary>
        <ul>
          <li>
            <strong>Lịch âm:</strong> tính bằng công thức thiên văn Jean Meeus + VSOP87D; múi giờ{' '}
            {laSo.quyUoc.muiGioLich === 'lichSu'
              ? 'lịch sử Việt Nam (UTC+8 trước 1968, UTC+7 từ 1968)'
              : 'UTC+7 cố định'}
            ; ranh giới năm theo mùng 1 Tết âm lịch.
          </li>
          <li>
            <strong>Giờ Tý muộn (23:00–23:59):</strong>{' '}
            {laSo.quyUoc.gioTyMuon === 'ngaySau'
              ? 'tính sang ngày hôm sau (mặc định Nam Phái)'
              : laSo.quyUoc.gioTyMuon}
            .
          </li>
          <li>
            <strong>Tháng nhuận:</strong>{' '}
            {laSo.quyUoc.thangNhuan === 'thangChinh'
              ? 'an sao như tháng chính (mặc định Nam Phái)'
              : laSo.quyUoc.thangNhuan}
            .
          </li>
          <li>
            <strong>Bảng Tứ Hóa &amp; Tuần/Triệt:</strong> Tứ Hóa phái{' '}
            {laSo.quyUoc.tuHoa === 'viet' ? 'Việt' : 'Trung Quốc'}; Tuần/Triệt an{' '}
            {laSo.quyUoc.tuanTriet === 'haiCung' ? '2 cung' : '1 cung'}; Mệnh chủ tra theo{' '}
            {laSo.quyUoc.menhChu === 'chiNam'
              ? `chi năm sinh (${laSo.menhChuCach.theoChiNam}; nếu tra theo cung Mệnh là ${laSo.menhChuCach.theoCungMenh})`
              : 'cung Mệnh'}
            .
          </li>
          {moTaQuyUoc.map((dong, idx) => (
            <li key={idx}>{dong}</li>
          ))}
        </ul>
      </details>

      {/* Danh sách đọc từng cung (hiển thị dưới 1000px như bản mẫu) */}
      <div className="r1e-ds-cung">
        <h3>Đọc từng cung</h3>
        <p>12 cung theo thứ tự từ Mệnh. Chạm vào tên cung để mở.</p>
        <div>
          {danhSachCung.map((c, n) => {
            const luuData = luuByChi.get(c.chi);
            const catList: PhuStarRender[] = [
              ...c.catTinh.map((s) => ({
                key: s.key,
                ten: s.ten,
                hanh: s.hanh,
                dacTinh: s.dacTinh,
                luu: false,
              })),
              ...(luuData?.cat ?? []),
            ];
            const satList: PhuStarRender[] = [
              ...c.hungTinh.map((s) => ({
                key: s.key,
                ten: s.ten,
                hanh: s.hanh,
                dacTinh: s.dacTinh,
                luu: false,
              })),
              ...(luuData?.sat ?? []),
            ];
            const dvIdx =
              luuNien2027.daiVan !== null && luuNien2027.daiVan !== undefined
                ? (c.chi - luuNien2027.daiVan + 12) % 12
                : null;
            const lnIdx = (c.chi - luuNien2027.luuThaiTue + 12) % 12;
            const tags: string[] = [];
            if (c.ten === 'Mệnh') tags.push('Cung Mệnh');
            if (c.laThan) tags.push('Thân cư');
            if (c.tuan) tags.push('Tuần');
            if (c.triet) tags.push('Triệt');
            if (dvIdx === 0) tags.push('Đại vận đang đi');
            if (lnIdx === 0) tags.push(`Lưu Thái Tuế ${luuNien2027.namXem}`);

            const xungCung =
              c.chinhTinh.length === 0
                ? laSo.cung.find((x) => x.chi === (c.chi + 6) % 12)
                : undefined;
            const thangIdx = luuNguyet ? luuNguyet.indexOf(c.chi) : -1;

            return (
              <details
                key={c.chi}
                className={`r1e-dc${c.ten === 'Mệnh' ? ' r1e-dc-menh' : ''}${highlightedChis.includes(c.chi) ? ' r1e-dc-soi' : ''}`}
                open={n === 0}
              >
                <summary>
                  <span className="r1e-dc-so">
                    <span>{n + 1}</span>
                  </span>
                  <span className={`r1e-dc-ten ${HANH_CLS[c.hanhCung]}`}>{c.ten}</span>
                  <span className="r1e-dc-cc">
                    {c.can} {c.tenChi}
                    <br />
                    ĐV {c.daiVanTu}
                  </span>
                  <span className="r1e-dc-ct">
                    {c.chinhTinh.length > 0 ? (
                      c.chinhTinh.map((s, idx) => (
                        <React.Fragment key={s.key}>
                          {idx > 0 ? ', ' : ''}
                          <b className={HANH_CLS[s.hanh]}>
                            {s.ten}
                            {s.dacTinh ? (
                              <>
                                {' '}
                                <small>({s.dacTinh})</small>
                              </>
                            ) : null}
                          </b>
                        </React.Fragment>
                      ))
                    ) : (
                      <i>Vô chính diệu</i>
                    )}
                  </span>
                </summary>
                <div className="r1e-dc-nd">
                  {tags.length > 0 && (
                    <p className="r1e-dc-tag">
                      {tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </p>
                  )}
                  {xungCung && (
                    <p className="r1e-dc-xc">
                      Cung xung chiếu là {xungCung.ten} ({xungCung.tenChi}):{' '}
                      {xungCung.chinhTinh.length > 0
                        ? xungCung.chinhTinh
                            .map((s) => `${s.ten}${s.dacTinh ? ` (${s.dacTinh})` : ''}`)
                            .join(', ')
                        : 'Vô chính diệu'}
                      . Lối đọc quen xem thêm các sao này cho cung vô chính diệu.
                    </p>
                  )}
                  <div className="r1e-dc-2">
                    <div>
                      <h4>Cát tinh</h4>
                      {catList.length > 0 ? renderSubList(catList) : <p>Không có</p>}
                    </div>
                    <div>
                      <h4>Sát tinh</h4>
                      {satList.length > 0 ? renderSubList(satList) : <p>Không có</p>}
                    </div>
                  </div>
                  <p className="r1e-dc-day">
                    Hành cung {c.hanhCung} · Tràng sinh: {c.trangSinh} · Đại vận {c.daiVan} tuổi
                    {thangIdx >= 0 ? ` · Tháng ${thangIdx + 1} năm ${luuNien2027.namXem}` : ''}
                    {dvIdx !== null ? ` · ĐV.${TAT[dvIdx]}` : ''} · LN.{TAT[lnIdx]}
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      </div>

      {/* Lớp phủ phóng to và cuộn cho màn hình nhỏ */}
      {zoomOpen && (
        <div
          className="r1e-zoom-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Phóng to lá số 12 cung"
        >
          <div className="r1e-zoom-bar">
            <span className="r1e-zoom-title">Lá số 12 cung</span>
            <div className="r1e-zoom-ctrls">
              <button
                type="button"
                className="r1e-zoom-btn"
                aria-label="Thu nhỏ"
                onClick={() => setZoomMuc((z) => Math.max(0.6, Number((z - 0.15).toFixed(2))))}
              >
                −
              </button>
              <span className="r1e-zoom-pct">{Math.round(zoomMuc * 100)}%</span>
              <button
                type="button"
                className="r1e-zoom-btn"
                aria-label="Phóng to thêm"
                onClick={() => setZoomMuc((z) => Math.min(1.3, Number((z + 0.15).toFixed(2))))}
              >
                +
              </button>
              <button
                type="button"
                className="r1e-nut r1e-nut-son r1e-zoom-close"
                onClick={() => setZoomOpen(false)}
              >
                Đóng ×
              </button>
            </div>
          </div>

          <div className="r1e-zoom-body">
            <div
              className="r1e-zoom-stage"
              style={{
                width: `${Math.ceil(1236 * zoomMuc)}px`,
                height: `${Math.ceil(1230 * zoomMuc)}px`,
              }}
            >
              <div
                className="r1e-ls-vo"
                style={{ transform: `scale(${zoomMuc})`, transformOrigin: '0 0' }}
              >
                <HoaVanGocVang4 />
                <div className="r1e-ls-nga">
                  <LuoiLaSo4x4
                    laSo={laSo}
                    luuNien2027={luuNien2027}
                    highlightedChis={highlightedChis}
                    ariaLabel="Lá số 12 cung phóng to"
                  />
                  <ChanLaSo namXem={luuNien2027.namXem} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import type { ReactNode } from 'react';
import { so } from '../ThongBao';

export type BaoCaoGscLuu = {
  thu?: boolean;
  ghiChu?: string;
  site?: string;
  ngay?: number;
  dongTruyVan?: number;
  dongTrang?: number;
  tuNgay?: string;
  denNgay?: string;
  mocCanhBao?: string;
  luc?: string;
};

export function soThapPhan(n: number | null | undefined, le = 1): string {
  if (n == null || !Number.isFinite(n)) return '–';
  return n.toLocaleString('vi-VN', { minimumFractionDigits: le, maximumFractionDigits: le });
}

export function dinhDangCtr(nhap: number, hienThi: number): string {
  if (!hienThi) return '–';
  return `${((nhap / hienThi) * 100).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function truNgayYmd(ymd: string, soNgay: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d) - soNgay * 86_400_000);
  return dt.toISOString().slice(0, 10);
}

export function dinhDangNgayYmd(ymd: string | null | undefined): string {
  if (!ymd) return '–';
  const [y, m, d] = ymd.split('-');
  if (!y || !m || !d) return ymd;
  return `${d}/${m}/${y}`;
}

export function ngayNganYmd(ymd: string): string {
  const parts = ymd.split('-');
  if (parts.length !== 3) return ymd;
  return `${parts[2]}/${parts[1]}`;
}

export function moTaCanhBaoGsc(loai: string, chiTietRaw: unknown): ReactNode {
  const ct = chiTietRaw && typeof chiTietRaw === 'object' ? (chiTietRaw as Record<string, unknown>) : {};
  if (loai === 'TUT_HANG' && ct.kieu === 'vi_tri') {
    const truyVan = typeof ct.truyVan === 'string' ? ct.truyVan : '–';
    const url = typeof ct.url === 'string' ? ct.url : '–';
    const viTri28 = typeof ct.viTri28 === 'number' ? soThapPhan(ct.viTri28, 1) : '–';
    const viTri7 = typeof ct.viTri7 === 'number' ? soThapPhan(ct.viTri7, 1) : '–';
    const hienThi7 = typeof ct.hienThi7 === 'number' ? so(ct.hienThi7) : '–';
    return (
      <span>
        «<b>{truyVan}</b>» trên <code>{url}</code>: vị trí {viTri28} → {viTri7} (hiển thị 7 ngày: {hienThi7})
      </span>
    );
  }
  if (loai === 'TUT_HANG' && ct.kieu === 'nhap') {
    const url = typeof ct.url === 'string' ? ct.url : '–';
    const nhapNgay28 = typeof ct.nhapNgay28 === 'number' ? soThapPhan(ct.nhapNgay28, 1) : '–';
    const nhapNgay7 = typeof ct.nhapNgay7 === 'number' ? soThapPhan(ct.nhapNgay7, 1) : '–';
    return (
      <span>
        <code>{url}</code>: nhấp/ngày 28 ngày trước {nhapNgay28} → 7 ngày gần nhất {nhapNgay7}
      </span>
    );
  }
  if (loai === 'TRUNG_Y_DINH') {
    const truyVan = typeof ct.truyVan === 'string' ? ct.truyVan : '–';
    const urls = Array.isArray(ct.url)
      ? ct.url.filter((u): u is { url?: unknown; hienThi?: unknown } => Boolean(u && typeof u === 'object'))
      : [];
    const tyLeUrl2 = typeof ct.tyLeUrl2 === 'number' ? Math.round(ct.tyLeUrl2 * 100) : null;
    return (
      <div>
        <div>
          «<b>{truyVan}</b>» xuất hiện trên nhiều URL
          {tyLeUrl2 != null ? ` (URL thứ hai chiếm ${tyLeUrl2}%)` : ''}:
        </div>
        {urls.length > 0 && (
          <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
            {urls.map((u, i) => (
              <li key={i}>
                <code>{typeof u.url === 'string' ? u.url : '–'}</code>:{' '}
                {typeof u.hienThi === 'number' ? `${so(u.hienThi)} hiển thị` : '–'}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  return <span>{loai}</span>;
}

export type DiemBieuDoGsc = {
  ngay: string;
  hienThi: number;
  nhap: number;
};

export function BieuDoGscSvg({ diem, tieuDe }: { diem: DiemBieuDoGsc[]; tieuDe?: string }) {
  if (!diem.length) {
    return <p className="qt-phu" style={{ margin: 0 }}>chưa có dữ liệu</p>;
  }

  const w = 720;
  const h = 200;
  const padL = 52;
  const padR = 46;
  const padT = 14;
  const padB = 28;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const maxHt = Math.max(1, ...diem.map((d) => d.hienThi));
  const maxNhap = Math.max(1, ...diem.map((d) => d.nhap));

  const xOf = (i: number) =>
    diem.length <= 1 ? padL + plotW / 2 : padL + (i / (diem.length - 1)) * plotW;
  const yHt = (v: number) => padT + plotH - (v / maxHt) * plotH;
  const yNhap = (v: number) => padT + plotH - (v / maxNhap) * plotH;

  const ptsHt = diem.map((d, i) => `${xOf(i).toFixed(1)},${yHt(d.hienThi).toFixed(1)}`).join(' ');
  const ptsNhap = diem.map((d, i) => `${xOf(i).toFixed(1)},${yNhap(d.nhap).toFixed(1)}`).join(' ');

  const ticks = [0, 0.33, 0.67, 1];
  const stepX = Math.max(1, Math.ceil(diem.length / 6));
  const xIndices = new Set<number>();
  for (let i = 0; i < diem.length; i += stepX) xIndices.add(i);
  if (diem.length > 1) xIndices.add(diem.length - 1);

  return (
    <div className="qt-xg-bieu-do">
      <div className="qt-xg-chu-giai">
        {tieuDe && <b>{tieuDe}</b>}
        <span>
          <span className="qt-xg-cham" style={{ background: 'var(--thuy)' }} />
          Hiển thị (trục trái)
        </span>
        <span>
          <span className="qt-xg-cham" style={{ background: 'var(--red)' }} />
          Nhấp (trục phải)
        </span>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        style={{ maxWidth: 860, height: 'auto', display: 'block' }}
        role="img"
        aria-label={tieuDe ? `Biểu đồ ${tieuDe}` : 'Biểu đồ hiển thị và nhấp theo ngày'}
      >
        {ticks.map((t, idx) => {
          const y = padT + plotH - t * plotH;
          const vHt = Math.round(maxHt * t);
          const vNhap = Math.round(maxNhap * t);
          return (
            <g key={idx}>
              <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--line)" strokeWidth="1" />
              <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="10" fill="var(--thuy)">
                {so(vHt)}
              </text>
              <text x={w - padR + 6} y={y + 3} textAnchor="start" fontSize="10" fill="var(--red)">
                {so(vNhap)}
              </text>
            </g>
          );
        })}

        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="var(--line)" strokeWidth="1" />
        <line x1={w - padR} y1={padT} x2={w - padR} y2={padT + plotH} stroke="var(--line)" strokeWidth="1" />
        <line x1={padL} y1={padT + plotH} x2={w - padR} y2={padT + plotH} stroke="var(--line)" strokeWidth="1" />

        {Array.from(xIndices)
          .sort((a, b) => a - b)
          .map((idx) => {
            const x = xOf(idx);
            const anchor = idx === 0 ? 'start' : idx === diem.length - 1 ? 'end' : 'middle';
            return (
              <text key={idx} x={x} y={h - 6} textAnchor={anchor} fontSize="10" fill="var(--muted)">
                {ngayNganYmd(diem[idx].ngay)}
              </text>
            );
          })}

        {diem.length > 1 && (
          <>
            <polyline fill="none" stroke="var(--thuy)" strokeWidth="2" points={ptsHt} />
            <polyline fill="none" stroke="var(--red)" strokeWidth="2" points={ptsNhap} />
          </>
        )}

        {diem.map((d, i) => {
          const cx = xOf(i);
          const cyHt = yHt(d.hienThi);
          const cyNhap = yNhap(d.nhap);
          const tip = `${dinhDangNgayYmd(d.ngay)}: ${so(d.hienThi)} hiển thị, ${so(d.nhap)} nhấp`;
          return (
            <g key={d.ngay}>
              <circle cx={cx} cy={cyHt} r="2.8" fill="var(--thuy)">
                <title>{tip}</title>
              </circle>
              <circle cx={cx} cy={cyNhap} r="2.8" fill="var(--red)">
                <title>{tip}</title>
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

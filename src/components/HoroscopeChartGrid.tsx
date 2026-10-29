'use client';

import React, { useState } from 'react';
import type { LaSoTuVi, CungLaSo, Sao } from '@/lib/core/tuvi';

const POS: Record<number, [number, number]> = {
  5: [1, 1],
  6: [1, 2],
  7: [1, 3],
  8: [1, 4],
  9: [2, 4],
  10: [3, 4],
  11: [4, 4],
  0: [4, 3],
  1: [4, 2],
  2: [4, 1],
  3: [3, 1],
  4: [2, 1],
};

const HANH_CLS: Record<string, string> = {
  Kim: 'h-kim',
  Mộc: 'h-moc',
  Thủy: 'h-thuy',
  Hỏa: 'h-hoa',
  Thổ: 'h-tho',
};

const HC: Record<string, string> = {
  Kim: '#5f5f66',
  Mộc: '#2e7d32',
  Thủy: '#1f4e9c',
  Hỏa: '#c0392b',
  Thổ: '#a0600c',
};

function getCenterCoords(chi: number): [number, number] {
  const p = POS[chi] || [2, 2];
  return [(p[1] - 0.5) * 25, (p[0] - 0.5) * 25];
}

export default function HoroscopeChartGrid({
  laSo,
  slug,
}: {
  laSo: LaSoTuVi;
  slug?: string;
}) {
  const [selectedPalace, setSelectedPalace] = useState<CungLaSo | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const menhChi = laSo.cung.find((c) => c.ten === 'Mệnh')?.chi ?? 0;
  const mCoord = getCenterCoords(menhChi);
  const taiCoord = getCenterCoords((menhChi + 4) % 12);
  const quanCoord = getCenterCoords((menhChi + 8) % 12);
  const diCoord = getCenterCoords((menhChi + 6) % 12);

  const handleDownloadCanvas = async () => {
    setStatusMsg('Đang vẽ ảnh lá số độ phân giải cao (1280×1520)...');
    const M = 40;
    const CELL = 300;
    const W = M * 2 + CELL * 4;
    const TOP = 170;
    const H = TOP + CELL * 4 + 150;
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const g = cv.getContext('2d');
    if (!g) return;

    const SERIF = '"Noto Serif", Georgia, serif';
    const SANS = '"Be Vietnam Pro", Arial, sans-serif';
    const C = {
      bg: '#f4ead5',
      card: '#fffaf0',
      ink: '#2a1d14',
      muted: '#6e5a44',
      red: '#b3361f',
      gold: '#f2c76b',
      menh: '#f6ebc8',
      paper: '#f3e6c8',
      night: '#1d1729',
      line: '#e0d0b0',
    };

    g.fillStyle = C.bg;
    g.fillRect(0, 0, W, H);
    g.fillStyle = C.night;
    g.fillRect(0, 0, W, 130);
    g.textBaseline = 'middle';
    g.fillStyle = C.gold;
    g.font = '700 46px ' + SERIF;
    g.fillText('LÁ SỐ TỬ VI', M, 54);
    g.fillStyle = '#f3e6c8';
    g.font = '500 22px ' + SANS;
    g.fillText(
      (laSo.ten ? laSo.ten + ' · ' : '') +
        laSo.gioiTinh +
        ' · tuổi ' +
        laSo.canChi.nam +
        ' · ' +
        laSo.banMenh,
      M,
      100
    );
    g.textAlign = 'right';
    g.fillStyle = '#c9b896';
    g.font = '600 20px ' + SANS;
    g.fillText('XEMBOI.VN', W - M, 54);
    g.textAlign = 'left';

    const X0 = M;
    const Y0 = TOP;
    g.fillStyle = C.ink;
    g.fillRect(X0 - 3, Y0 - 3, CELL * 4 + 6, CELL * 4 + 6);

    const txt = (
      t: string,
      x: number,
      y: number,
      font: string,
      color: string,
      align: CanvasTextAlign = 'left'
    ) => {
      g.font = font;
      g.fillStyle = color;
      g.textAlign = align;
      g.fillText(t, x, y);
      g.textAlign = 'left';
    };

    laSo.cung.forEach((c) => {
      const p = POS[c.chi];
      const x = X0 + (p[1] - 1) * CELL;
      const y = Y0 + (p[0] - 1) * CELL;
      g.fillStyle = c.ten === 'Mệnh' ? C.menh : C.card;
      g.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      const ix = x + 12;
      const mid = x + CELL / 2;
      txt(c.can + ' ' + c.tenChi, ix, y + 20, '600 15px ' + SANS, C.muted);
      txt(c.ten.toUpperCase(), mid, y + 20, '700 17px ' + SANS, C.red, 'center');
      txt(String(c.daiVanTu), x + CELL - 12, y + 20, '700 17px ' + SANS, C.ink, 'right');

      let cy = y + 52;
      if (c.chinhTinh.length) {
        c.chinhTinh.forEach((s) => {
          const label = s.ten + (s.dacTinh ? ' (' + s.dacTinh + ')' : '');
          txt(label, mid, cy, '700 22px ' + SERIF, HC[s.hanh] || C.ink, 'center');
          cy += 28;
        });
      } else {
        txt('Vô chính diệu', mid, cy, 'italic 400 19px ' + SERIF, C.muted, 'center');
        cy += 28;
      }

      const cat = c.catTinh.filter((s) => !/^Hóa /.test(s.ten));
      const hung = c.hungTinh.filter((s) => s.ten !== 'Hóa Kỵ');
      const lh = 19;
      const maxLines = Math.floor((y + CELL - 34 - cy) / lh) + 1;

      [
        [cat, ix, 'left'] as const,
        [hung, x + CELL - 12, 'right'] as const,
      ].forEach(([ds, colX, align]) => {
        const n = Math.min(ds.length, maxLines);
        for (let i = 0; i < n; i++) {
          const s = ds[i];
          const label =
            i === n - 1 && ds.length > n
              ? '+' + (ds.length - n + 1) + ' sao'
              : s.ten + (s.dacTinh ? ' ' + s.dacTinh : '');
          txt(
            label,
            colX,
            cy - 2 + i * lh,
            '500 15px ' + SANS,
            HC[s.hanh] || C.ink,
            align
          );
        }
      });

      g.strokeStyle = C.line;
      g.setLineDash([4, 3]);
      g.beginPath();
      g.moveTo(x + 10, y + CELL - 28);
      g.lineTo(x + CELL - 10, y + CELL - 28);
      g.stroke();
      g.setLineDash([]);
      txt(c.trangSinh, ix, y + CELL - 14, '500 14px ' + SANS, C.muted);
      txt(
        'Tiểu hạn ' + c.tieuHan,
        x + CELL - 12,
        y + CELL - 14,
        '500 14px ' + SANS,
        C.muted,
        'right'
      );
    });

    const cx0 = X0 + CELL + 1;
    const cy0 = Y0 + CELL + 1;
    const cw = CELL * 2 - 2;
    g.fillStyle = C.paper;
    g.fillRect(cx0, cy0, cw, cw);
    txt(
      laSo.ten || 'Lá số tử vi',
      cx0 + cw / 2,
      cy0 + 50,
      '700 30px ' + SERIF,
      C.ink,
      'center'
    );
    const rows: [string, string][] = [
      ['Dương lịch', `${laSo.duong.ngay}/${laSo.duong.thang}/${laSo.duong.nam}`],
      [
        'Âm lịch',
        `ngày ${laSo.am.ngay} tháng ${laSo.am.thang}${laSo.am.nhuan ? ' (nhuận)' : ''} năm ${laSo.canChi.nam}`,
      ],
      ['Giờ sinh', `${laSo.gio.canChi} (${laSo.gio.khoang})`],
      ['Ngày / tháng', `${laSo.canChi.ngay} / ${laSo.canChi.thang}`],
      ['Âm dương', `${laSo.amDuong} · ${laSo.amDuongLy}`],
      ['Bản mệnh', laSo.banMenh],
      ['Cục', `${laSo.cuc} · ${laSo.sinhKhac}`],
      ['Mệnh chủ', laSo.menhChu],
      ['Thân chủ', laSo.thanChu],
      ['Tuần / Triệt', `${laSo.tuan} / ${laSo.triet}`],
    ];
    rows.forEach((r, i) => {
      const ry = cy0 + 112 + i * 42;
      txt(r[0], cx0 + 40, ry, '400 20px ' + SANS, C.muted);
      txt(r[1], cx0 + 200, ry, '600 20px ' + SANS, C.ink);
    });
    txt('XEMBOI.VN', cx0 + cw / 2, cy0 + cw - 24, '700 18px ' + SERIF, C.red, 'center');

    const fy = Y0 + CELL * 4 + 50;
    const now = new Date();
    txt(
      `Lập ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} tại XemBoi.vn (https://xemboi.vn).`,
      M,
      fy,
      '500 16px ' + SANS,
      C.muted
    );

    const dataUrl = cv.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${slug || 'la-so-xemboi-vn'}.png`;
    a.click();
    setStatusMsg('Đã tải ảnh lá số thành công!');
  };

  const renderSaoColumn = (ds: Sao[], cls: string) => {
    const MAX_MOBI = 3;
    return (
      <span className={cls}>
        {ds.map((s, i) => (
          <span
            key={`${s.ten}-${i}`}
            className={`${HANH_CLS[s.hanh] || ''}${i >= MAX_MOBI ? ' x' : ''}`}
          >
            {s.ten}
            {s.dacTinh ? <span className="dt">{s.dacTinh}</span> : null}
          </span>
        ))}
        {ds.length > MAX_MOBI ? (
          <span className="p-more mobi-more">+{ds.length - MAX_MOBI}</span>
        ) : null}
      </span>
    );
  };

  return (
    <div>
      <div className="chart" id="chart">
        {laSo.cung.map((c) => {
          const p = POS[c.chi];
          const cat = c.catTinh.filter((s) => !/^Hóa /.test(s.ten));
          const hung = c.hungTinh.filter((s) => s.ten !== 'Hóa Kỵ');
          const hasTags = c.laThan || c.tuan || c.triet;
          return (
            <button
              key={c.chi}
              type="button"
              className={`palace${c.ten === 'Mệnh' ? ' menh' : ''}`}
              data-chi={c.chi}
              style={{ gridRow: p[0], gridColumn: p[1] }}
              onClick={() => setSelectedPalace(c)}
            >
              <span className="p-head">
                <span className="p-cc">
                  {c.can.charAt(0)}.{c.tenChi}
                </span>
                <span className="p-name">{c.ten}</span>
                <span className="p-dh">{c.daiVanTu}</span>
              </span>
              {hasTags ? (
                <span className="p-tags">
                  {c.laThan ? <span className="tag">THÂN</span> : null}
                  {c.tuan ? <span className="tag tt">TUẦN</span> : null}
                  {c.triet ? <span className="tag tt">TRIỆT</span> : null}
                </span>
              ) : null}
              <span className="p-chinh">
                {c.chinhTinh.length ? (
                  c.chinhTinh.map((s, idx) => (
                    <React.Fragment key={s.ten}>
                      {idx > 0 ? <br /> : null}
                      <span className={HANH_CLS[s.hanh] || ''}>
                        {s.ten}
                        {s.dacTinh ? <span className="dt">{s.dacTinh}</span> : null}
                      </span>
                      {s.hoa ? (
                        <span className="hoa">{s.hoa.replace('Hóa ', '')}</span>
                      ) : null}
                    </React.Fragment>
                  ))
                ) : (
                  <span className="vcd">Vô chính diệu</span>
                )}
              </span>
              <span className="p-cols">
                {renderSaoColumn(cat, 'l')}
                {renderSaoColumn(hung, 'r')}
              </span>
              <span className="p-foot">
                <span>{c.trangSinh}</span>
                <span>{c.tieuHan}</span>
              </span>
            </button>
          );
        })}

        <div className="center">
          <div className="t">{laSo.ten || 'Lá số tử vi'}</div>
          <dl>
            <dt>Dương lịch</dt>
            <dd>
              {laSo.duong.ngay}/{laSo.duong.thang}/{laSo.duong.nam}
            </dd>
            <dt>Âm lịch</dt>
            <dd>
              {laSo.am.ngay}/{laSo.am.thang}
              {laSo.am.nhuan ? 'n' : ''} {laSo.canChi.nam}
            </dd>
            <dt>Giờ sinh</dt>
            <dd>
              {laSo.gio.canChi} ({laSo.gio.khoang})
            </dd>
            <dt>Ngày / tháng</dt>
            <dd>
              {laSo.canChi.ngay} / {laSo.canChi.thang}
            </dd>
            <dt>Âm dương</dt>
            <dd>
              {laSo.amDuong} · {laSo.amDuongLy}
            </dd>
            <dt>Bản mệnh</dt>
            <dd>{laSo.banMenh}</dd>
            <dt>Cục</dt>
            <dd>
              {laSo.cuc} · {laSo.sinhKhac}
            </dd>
            <dt>Mệnh / Thân chủ</dt>
            <dd>
              {laSo.menhChu} / {laSo.thanChu}
            </dd>
            <dt>Tuần / Triệt</dt>
            <dd>
              {laSo.tuan} / {laSo.triet}
            </dd>
          </dl>
          <div className="wm-brand">XEMBOI.VN</div>
        </div>

        <svg
          className="tam-hop-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon
            points={`${mCoord[0]},${mCoord[1]} ${taiCoord[0]},${taiCoord[1]} ${quanCoord[0]},${quanCoord[1]}`}
            className="th-tamgiac"
          />
          <line
            x1={mCoord[0]}
            y1={mCoord[1]}
            x2={diCoord[0]}
            y2={diCoord[1]}
            className="th-xungchieu"
          />
          <circle cx={mCoord[0]} cy={mCoord[1]} r="1.5" className="th-dot" />
          <circle cx={taiCoord[0]} cy={taiCoord[1]} r="1.5" className="th-dot" />
          <circle cx={quanCoord[0]} cy={quanCoord[1]} r="1.5" className="th-dot" />
          <circle cx={diCoord[0]} cy={diCoord[1]} r="1.5" className="th-dot" />
        </svg>
      </div>

      <div className="legend-h" aria-label="Màu sao theo ngũ hành">
        <span className="h-kim">
          <b>■</b> Kim
        </span>
        <span className="h-moc">
          <b>■</b> Mộc
        </span>
        <span className="h-thuy">
          <b>■</b> Thủy
        </span>
        <span className="h-hoa">
          <b>■</b> Hỏa
        </span>
        <span className="h-tho">
          <b>■</b> Thổ
        </span>
      </div>

      <div className="chart-actions">
        <button className="btn gold" type="button" onClick={handleDownloadCanvas}>
          📥 Tải ảnh lá số (XEMBOI.VN)
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => window.print()}
        >
          🖨️ In / lưu PDF
        </button>
      </div>
      {statusMsg ? (
        <p className="small muted" style={{ marginTop: 8 }}>
          {statusMsg}
        </p>
      ) : null}

      {selectedPalace ? (
        <div
          className="card"
          style={{ marginTop: 14, border: '2px solid var(--gold)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--red)' }}>
              Cung {selectedPalace.ten} ({selectedPalace.can} {selectedPalace.tenChi}) · Đại vận{' '}
              {selectedPalace.daiVanTu} tuổi
            </h3>
            <button
              type="button"
              className="btn ghost"
              style={{ width: 'auto', padding: '4px 12px' }}
              onClick={() => setSelectedPalace(null)}
            >
              Đóng
            </button>
          </div>
          <p className="small muted" style={{ marginTop: 6 }}>
            <strong>Chính tinh:</strong>{' '}
            {selectedPalace.chinhTinh.length
              ? selectedPalace.chinhTinh
                  .map((s) => `${s.ten}${s.dacTinh ? ` (${s.dacTinh})` : ''}${s.hoa ? ` - ${s.hoa}` : ''}`)
                  .join(', ')
              : 'Vô chính diệu'}
          </p>
          <p className="small" style={{ marginTop: 4 }}>
            <strong>Cát tinh (trái):</strong>{' '}
            {selectedPalace.catTinh.map((s) => s.ten).join(', ') || 'Không có'}
          </p>
          <p className="small" style={{ marginTop: 4 }}>
            <strong>Hung / Sát tinh (phải):</strong>{' '}
            {selectedPalace.hungTinh.map((s) => s.ten).join(', ') || 'Không có'}
          </p>
          <p className="small muted" style={{ marginTop: 4 }}>
            <strong>Vòng Trường Sinh:</strong> {selectedPalace.trangSinh} ·{' '}
            <strong>Tiểu hạn:</strong> {selectedPalace.tieuHan}
          </p>
        </div>
      ) : null}
    </div>
  );
}

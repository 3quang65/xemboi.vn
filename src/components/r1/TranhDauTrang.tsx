import React from 'react';

/* Tạo phần nền trời sao, lũy tre, tán đa, sân gạch và trăng vỏ trứng với hạt giống cố định (seed = 7) */
interface SaoCham {
  kind: 'circle';
  cx: string;
  cy: string;
  r: string;
  opacity: string;
}

interface Sao4Canh {
  kind: 'star4';
  x: string;
  y: string;
  size: string;
}

type SaoItem = SaoCham | Sao4Canh;

interface VangQuyItem {
  x: string;
  y: string;
  transform: string;
}

interface CumDaItem {
  outerPath: string;
  innerPath: string;
  fillId: string;
  flakes: VangQuyItem[];
}

interface VoTrungManh {
  fill: string;
  points: string;
}

function buildTranhData() {
  let seed = 7;
  const rd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const f1 = (n: number) => n.toFixed(1);

  const sao: SaoItem[] = [];
  for (let i = 0; i < 150; i++) {
    const x = rd() * 1920;
    const y = rd() * 560;
    if (
      (x > 360 && x < 1060 && y < 300) ||
      Math.hypot(x - 905, y - 392) < 85 ||
      y > 470 ||
      (x > 120 && x < 790 && y > 270)
    ) {
      continue;
    }
    if (i % 9 === 0) {
      const k = 7 + rd() * 6;
      sao.push({
        kind: 'star4',
        x: f1(x - k / 2),
        y: f1(y - k / 2),
        size: f1(k),
      });
    } else {
      sao.push({
        kind: 'circle',
        cx: f1(x),
        cy: f1(y),
        r: f1(0.5 + rd() * 1.1),
        opacity: (0.3 + rd() * 0.55).toFixed(2),
      });
    }
  }

  const buildLuyTre = (y0: number, y1: number) => {
    let x = -30;
    let d = `M-30 712L-30 ${y0}`;
    while (x < 1950) {
      const nx = x + 24 + rd() * 30;
      const ny = y0 + rd() * (y1 - y0);
      const r = f1((nx - x) * 0.62 + 4);
      d += `A${r} ${r} 0 0 1 ${f1(nx)} ${f1(ny)}`;
      x = nx;
    }
    return `${d}L1950 712Z`;
  };

  const treSauPath = buildLuyTre(588, 632);
  const treTruocPath = buildLuyTre(628, 662);

  const buildVong = (cx: number, cy: number, rx: number, ry: number) => {
    const n = Math.max(7, Math.round((Math.PI * (rx + ry)) / 40));
    const p: [number, number][] = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + rd() * 0.2;
      const q = 0.9 + rd() * 0.14;
      p.push([cx + Math.cos(a) * rx * q, cy + Math.sin(a) * ry * q]);
    }
    let d = `M${f1(p[0][0])} ${f1(p[0][1])}`;
    for (let k = 0; k < n; k++) {
      const b = p[(k + 1) % n];
      const c = p[k];
      const r = f1(Math.hypot(b[0] - c[0], b[1] - c[1]) * 0.62);
      d += `A${r} ${r} 0 0 1 ${f1(b[0])} ${f1(b[1])}`;
    }
    return `${d}Z`;
  };

  const buildCum = (cx: number, cy: number, rx: number, ry: number, fillId: string): CumDaItem => {
    const outerPath = buildVong(cx, cy, rx, ry);
    const innerPath = buildVong(cx, cy - ry * 0.12, rx * 0.6, ry * 0.55);
    const flakes: VangQuyItem[] = [];
    for (let j = 0; j < 3; j++) {
      const a = rd() * 6.28;
      const t = rd() * 0.7;
      const fx = f1(cx + Math.cos(a) * rx * t);
      const fy = f1(cy + Math.sin(a) * ry * t);
      flakes.push({
        x: fx,
        y: fy,
        transform: `rotate(30 ${fx} ${fy})`,
      });
    }
    return { outerPath, innerPath, fillId, flakes };
  };

  const tanSau: CumDaItem[] = [
    buildCum(160, 490, 70, 36, 'r1e-tan-2'),
    buildCum(230, 440, 105, 58, 'r1e-tan-1'),
    buildCum(340, 380, 120, 66, 'r1e-tan-2'),
    buildCum(480, 350, 140, 62, 'r1e-tan-1'),
    buildCum(620, 385, 120, 60, 'r1e-tan-3'),
    buildCum(720, 450, 72, 44, 'r1e-tan-2'),
  ];

  const tanTruoc: CumDaItem[] = [
    buildCum(300, 500, 125, 40, 'r1e-tan-1'),
    buildCum(470, 470, 170, 62, 'r1e-tan-2'),
    buildCum(630, 500, 110, 38, 'r1e-tan-1'),
  ];

  let gachDocPath = '';
  for (let xb = -600; xb <= 2500; xb += 130) {
    gachDocPath += `M${f1(920 + ((xb - 920) * 84) / 220)} 684L${xb} 820`;
  }

  const cx = 905;
  const cy = 392;
  const r = 50;
  const g = 7.5;
  const n = 8;
  const pt: Record<string, [number, number]> = {};
  const tones = ['#F4E3B4', '#EBD59C', '#F8EBC6', '#E3C98A', '#F0DDA8'];
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      pt[`${i},${j}`] = [
        cx + i * g + (rd() - 0.5) * g * 0.75,
        cy + j * g + (rd() - 0.5) * g * 0.75,
      ];
    }
  }
  const voTrung: VoTrungManh[] = [];
  const pushPoly = (q: [number, number][]) => {
    let mx = 0;
    let my = 0;
    for (const p of q) {
      mx += p[0];
      my += p[1];
    }
    mx /= q.length;
    my /= q.length;
    if (Math.hypot(mx - cx, my - cy) > r + 3) return;
    voTrung.push({
      fill: tones[Math.floor(rd() * tones.length)],
      points: q
        .map((p) => `${f1(mx + (p[0] - mx) * 0.93)},${f1(my + (p[1] - my) * 0.93)}`)
        .join(' '),
    });
  };
  for (let i = -n; i < n; i++) {
    for (let j = -n; j < n; j++) {
      const a = pt[`${i},${j}`];
      const b = pt[`${i + 1},${j}`];
      const c = pt[`${i + 1},${j + 1}`];
      const d = pt[`${i},${j + 1}`];
      if (rd() < 0.45) {
        pushPoly([a, b, c]);
        pushPoly([a, c, d]);
      } else {
        pushPoly([a, b, c, d]);
      }
    }
  }

  return { sao, treSauPath, treTruocPath, tanSau, tanTruoc, gachDocPath, voTrung };
}

const TRANH_DATA = buildTranhData();

/** Kho defs & bức tranh đầu trang sơn mài đêm trăng */
export function SvgSpriteE3() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="r1e-vl" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8A6420" />
          <stop offset="0.22" stopColor="#E9C977" />
          <stop offset="0.36" stopColor="#FFF0BE" />
          <stop offset="0.52" stopColor="#C99A3E" />
          <stop offset="0.7" stopColor="#F3D88F" />
          <stop offset="1" stopColor="#9C7428" />
        </linearGradient>
        <radialGradient id="r1e-son-may" cx="0.45" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#8E1E15" />
          <stop offset="0.6" stopColor="#5E130C" />
          <stop offset="1" stopColor="#3A0B07" />
        </radialGradient>
        <filter id="r1e-dau-moc" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="2"
            seed="4"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="1.8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <symbol id="r1e-may" viewBox="0 0 160 64">
          <path
            d="M14 56C4 56 3 42 14 40 12 27 27 20 38 27 41 13 61 8 71 20 79 6 104 6 111 22 123 16 139 24 137 37 150 38 152 56 140 56Z"
            fill="url(#r1e-son-may)"
            stroke="url(#r1e-vl)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M27 42c-1-6-9-6-9.5-.5-.3 3.6 4.6 4.6 5.6 1.4M57 28c-.6-8-12-8.6-12.6-1.2-.4 5 6 6.3 7.4 2.1M97 23c-.4-9-13.6-9.6-14.2-1.4-.4 5.6 6.8 7 8.3 2.3M130 40c-.8-6.4-9.6-6.8-10-.6-.3 4 5 5 6 1.5M22 49c12-4 24-4 36 0s24 4 36 0 24-4 36 0"
            fill="none"
            stroke="url(#r1e-vl)"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
        </symbol>
        <symbol id="r1e-sao4" viewBox="-6 -6 12 12">
          <path d="M0-6L1.25-1.25 6 0 1.25 1.25 0 6-1.25 1.25-6 0-1.25-1.25Z" fill="url(#r1e-vl)" />
        </symbol>
        <symbol id="r1e-an-tieu" viewBox="0 0 92 30">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 15h18M72 15h18" />
            <path d="M20 15c-1-4 3-7 6-5 1-4 7-4 8 0" />
            <path d="M72 15c1-4-3-7-6-5-1-4-7-4-8 0" />
            <circle cx="46" cy="15" r="11" />
            <circle cx="46" cy="15" r="7.5" strokeWidth="0.8" />
          </g>
          <path d="M46 8.5l1.6 5 5 1.5-5 1.5-1.6 5-1.6-5-5-1.5 5-1.5z" fill="currentColor" />
        </symbol>

        <linearGradient id="r1e-troi" x1="0" y1="0" x2="0" y2="820" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#060816" />
          <stop offset="0.37" stopColor="#0B0C1C" />
          <stop offset="0.63" stopColor="#150D12" />
          <stop offset="0.84" stopColor="#1E100B" />
          <stop offset="1" stopColor="#120806" />
        </linearGradient>
        <radialGradient
          id="r1e-quang-cham"
          cx="1300"
          cy="140"
          r="760"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#2A3A78" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2A3A78" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="r1e-trang-hao">
          <stop offset="0.3" stopColor="#F6E3AA" stopOpacity="0.26" />
          <stop offset="1" stopColor="#F6E3AA" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="r1e-trang-bong" cx="0.36" cy="0.3" r="0.78">
          <stop offset="0.42" stopColor="#1A0805" stopOpacity="0" />
          <stop offset="1" stopColor="#1A0805" stopOpacity="0.5" />
        </radialGradient>
        <radialGradient id="r1e-den-quang">
          <stop offset="0" stopColor="#FFD27A" stopOpacity="0.5" />
          <stop offset="0.35" stopColor="#F0A848" stopOpacity="0.18" />
          <stop offset="1" stopColor="#F0A848" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="r1e-san" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2E170D" />
          <stop offset="1" stopColor="#110705" />
        </linearGradient>
        <linearGradient id="r1e-suong" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8DCC4" stopOpacity="0" />
          <stop offset="0.5" stopColor="#E8DCC4" stopOpacity="0.07" />
          <stop offset="1" stopColor="#E8DCC4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="r1e-mai" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4E2614" />
          <stop offset="1" stopColor="#1E0C07" />
        </linearGradient>
        <radialGradient id="r1e-tan-1" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#43220F" />
          <stop offset="1" stopColor="#150A07" />
        </radialGradient>
        <radialGradient id="r1e-tan-2" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#2A1511" />
          <stop offset="1" stopColor="#0C0606" />
        </radialGradient>
        <radialGradient id="r1e-tan-3" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#5E180E" />
          <stop offset="1" stopColor="#1E0706" />
        </radialGradient>
        <linearGradient id="r1e-non" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3D88F" />
          <stop offset="1" stopColor="#8A6420" />
        </linearGradient>
        <clipPath id="r1e-trang-cat">
          <circle cx="905" cy="392" r="50" />
        </clipPath>

        <g id="r1e-tranh">
          <rect width="1920" height="820" fill="url(#r1e-troi)" />
          <rect width="1920" height="820" fill="url(#r1e-quang-cham)" />
          <g id="r1e-t-sao">
            {TRANH_DATA.sao.map((item, idx) =>
              item.kind === 'star4' ? (
                <use
                  key={idx}
                  className="r1e-sao-ll"
                  href="#r1e-sao4"
                  x={item.x}
                  y={item.y}
                  width={item.size}
                  height={item.size}
                />
              ) : (
                <circle
                  key={idx}
                  cx={item.cx}
                  cy={item.cy}
                  r={item.r}
                  fill="#F3D88F"
                  fillOpacity={item.opacity}
                />
              ),
            )}
          </g>

          {/* Trăng khảm vỏ trứng */}
          <circle cx="905" cy="392" r="170" fill="url(#r1e-trang-hao)" />
          <g clipPath="url(#r1e-trang-cat)">
            <circle cx="905" cy="392" r="50" fill="#9A7634" />
            <g id="r1e-vo-trung">
              {TRANH_DATA.voTrung.map((m, idx) => (
                <polygon
                  key={idx}
                  fill={m.fill}
                  stroke="#9A7634"
                  strokeWidth="0.35"
                  points={m.points}
                />
              ))}
            </g>
            <circle cx="905" cy="392" r="50" fill="url(#r1e-trang-bong)" />
          </g>
          <circle cx="905" cy="392" r="52.5" fill="none" stroke="url(#r1e-vl)" strokeWidth="1.6" />
          <use href="#r1e-may" x="150" y="200" width="210" height="56" opacity="0.85" />
          <use href="#r1e-may" x="1560" y="170" width="230" height="62" opacity="0.85" />
          <use href="#r1e-may" x="1230" y="300" width="150" height="40" opacity="0.7" />

          {/* Lũy tre xa */}
          <g id="r1e-t-tre">
            <path
              d={TRANH_DATA.treSauPath}
              fill="#170F17"
              stroke="#C9A452"
              strokeOpacity="0.16"
              strokeWidth="0.8"
            />
            <path
              d={TRANH_DATA.treTruocPath}
              fill="#100A0C"
              stroke="#C9A452"
              strokeOpacity="0.1"
              strokeWidth="0.8"
            />
          </g>

          {/* Cây cau bên phải (hiện ở màn rộng) */}
          <g id="r1e-cau" fill="none" stroke="#1A0E0C" strokeLinecap="round">
            <path d="M1640 700C1636 600 1646 480 1662 380" strokeWidth="5" />
            <path
              d="M1662 380C1640 370 1620 378 1604 396M1662 380C1684 366 1704 370 1718 388M1662 380C1650 360 1638 346 1630 330M1662 380C1672 360 1690 348 1700 332M1662 380C1660 360 1662 348 1666 330"
              strokeWidth="3"
            />
            <path
              d="M1662 380C1684 366 1704 370 1718 388M1662 380C1672 360 1690 348 1700 332"
              stroke="url(#r1e-vl)"
              strokeWidth="0.7"
              strokeOpacity="0.45"
            />
          </g>
          <use href="#r1e-cau" transform="translate(330 40) scale(0.9)" />

          {/* Đình làng */}
          <g id="r1e-dinh">
            <ellipse cx="920" cy="630" rx="170" ry="60" fill="url(#r1e-den-quang)" opacity="0.5" />
            <rect x="790" y="590" width="260" height="70" fill="#1C0C08" />
            <rect x="898" y="600" width="44" height="60" fill="#7A3A14" opacity="0.6" />
            <g fill="#5A1A10" stroke="url(#r1e-vl)" strokeWidth="0.5">
              <rect x="797" y="592" width="7" height="68" />
              <rect x="845" y="592" width="7" height="68" />
              <rect x="891" y="592" width="7" height="68" />
              <rect x="942" y="592" width="7" height="68" />
              <rect x="988" y="592" width="7" height="68" />
              <rect x="1036" y="592" width="7" height="68" />
            </g>
            <path
              d="M852 604h39M852 620h39M852 636h39M949 604h39M949 620h39M949 636h39M804 612h41M995 612h41"
              stroke="#C9A452"
              strokeOpacity="0.3"
              strokeWidth="0.7"
            />
            <rect
              x="772"
              y="660"
              width="296"
              height="12"
              fill="#2E160C"
              stroke="url(#r1e-vl)"
              strokeWidth="0.6"
            />
            <rect x="880" y="672" width="80" height="6" fill="#26120A" />
            <rect x="868" y="678" width="104" height="6" fill="#1F0F08" />
            <path
              d="M724 546Q748 590 800 592L1040 592Q1092 590 1116 546Q1098 560 1070 558L1040 530L800 530L770 558Q742 560 724 546Z"
              fill="url(#r1e-mai)"
              stroke="url(#r1e-vl)"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path
              id="r1e-ngoi"
              d="M808 533v57M817 533v57M826 533v57M835 533v57M844 533v57M853 533v57M862 533v57M871 533v57M880 533v57M889 533v57M898 533v57M907 533v57M916 533v57M925 533v57M934 533v57M943 533v57M952 533v57M961 533v57M970 533v57M979 533v57M988 533v57M997 533v57M1006 533v57M1015 533v57M1024 533v57M1033 533v57"
              stroke="#C9A452"
              strokeOpacity="0.32"
              strokeWidth="0.8"
            />
            <path d="M776 586H1064" stroke="#D4AF5C" strokeWidth="0.9" strokeOpacity="0.8" />
            <rect
              x="796"
              y="522"
              width="248"
              height="9"
              fill="#2A120A"
              stroke="url(#r1e-vl)"
              strokeWidth="0.8"
            />
            <path
              d="M800 524q-14-3-16-16q9 2 11 8M1040 524q14-3 16-16q-9 2-11 8"
              fill="none"
              stroke="url(#r1e-vl)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <rect x="856" y="508" width="128" height="16" fill="#140806" />
            <path
              d="M866 510v12M878 510v12M890 510v12M902 510v12M914 510v12M926 510v12M938 510v12M950 510v12M962 510v12M974 510v12"
              stroke="#C9A452"
              strokeOpacity="0.45"
              strokeWidth="0.7"
            />
            <path
              d="M838 512Q850 494 846 482Q866 494 880 494L960 494Q974 494 994 482Q990 494 1002 512Z"
              fill="url(#r1e-mai)"
              stroke="url(#r1e-vl)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <rect
              x="876"
              y="487"
              width="88"
              height="7"
              fill="#2A120A"
              stroke="url(#r1e-vl)"
              strokeWidth="0.7"
            />
            <circle cx="920" cy="478" r="6.5" fill="url(#r1e-vl)" />
            <path
              d="M920 467v-5M911 471l-4-3M929 471l4-3M906 478h-6M934 478h6"
              stroke="url(#r1e-vl)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <path
              d="M880 489q-12-2-14-12q7 1 9 6M960 489q12-2 14-12q-7 1-9 6"
              fill="none"
              stroke="url(#r1e-vl)"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </g>

          {/* Sân đình */}
          <rect y="684" width="1920" height="136" fill="url(#r1e-san)" />
          <g id="r1e-t-gach" stroke="#C9A452" strokeWidth="0.7">
            <path
              d="M0 700H1920M0 716H1920M0 738H1920M0 768H1920M0 806H1920"
              strokeOpacity="0.1"
            />
            <path d={TRANH_DATA.gachDocPath} strokeOpacity="0.07" />
          </g>
          <rect y="630" width="1920" height="80" fill="url(#r1e-suong)" />

          {/* Cây đa: tán sau, rễ phụ, thân, tán trước */}
          <g id="r1e-t-tan-sau">
            {TRANH_DATA.tanSau.map((c, idx) => (
              <React.Fragment key={idx}>
                <path
                  d={c.outerPath}
                  fill={`url(#${c.fillId})`}
                  stroke="url(#r1e-vl)"
                  strokeWidth="1"
                  strokeOpacity="0.55"
                />
                <path
                  d={c.innerPath}
                  fill="none"
                  stroke="#C9A452"
                  strokeOpacity="0.2"
                  strokeWidth="0.8"
                />
                {c.flakes.map((fl, j) => (
                  <rect
                    key={j}
                    x={fl.x}
                    y={fl.y}
                    width="2.2"
                    height="2.2"
                    fill="#E9C977"
                    fillOpacity="0.55"
                    transform={fl.transform}
                  />
                ))}
              </React.Fragment>
            ))}
          </g>
          <g id="r1e-re" fill="none" strokeLinecap="round">
            <g stroke="#2C150C" strokeWidth="2.4">
              <path d="M286 515C284 560 290 600 287 650C286 672 288 692 286 704" />
              <path d="M312 520C314 556 309 590 312 626" />
              <path d="M340 522C338 570 344 612 341 662C340 690 342 712 341 726" />
              <path d="M372 526C374 560 369 594 372 618" />
              <path d="M590 528C588 570 594 610 590 660C589 690 591 710 590 726" />
              <path d="M618 526C620 556 615 586 618 610" />
              <path d="M648 522C646 566 652 604 649 650C648 676 650 694 649 708" />
              <path d="M676 518C678 548 673 576 676 596" />
            </g>
            <g stroke="url(#r1e-vl)" strokeWidth="0.6" strokeOpacity="0.4">
              <path d="M342 522C340 570 346 612 343 662" />
              <path d="M592 528C590 570 596 610 592 660" />
            </g>
          </g>
          <path
            d="M396 724C430 716 442 690 446 650C450 600 438 566 420 540L434 534C454 558 464 580 468 600C472 566 482 548 502 530L514 536C498 560 494 590 496 630C498 680 512 710 552 724Z"
            fill="#1E0E09"
            stroke="url(#r1e-vl)"
            strokeWidth="0.9"
            strokeOpacity="0.55"
          />
          <path
            d="M452 610C458 640 456 680 448 712M482 596C478 630 484 670 496 712"
            fill="none"
            stroke="#C9A452"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          <g fill="none" stroke="#1E0E09" strokeLinecap="round">
            <path d="M428 538C400 510 380 490 350 470" strokeWidth="10" />
            <path d="M508 532C540 505 570 488 610 470" strokeWidth="9" />
            <path d="M466 590C468 540 470 500 474 440" strokeWidth="8" />
          </g>
          <g id="r1e-t-tan-truoc">
            {TRANH_DATA.tanTruoc.map((c, idx) => (
              <React.Fragment key={idx}>
                <path
                  d={c.outerPath}
                  fill={`url(#${c.fillId})`}
                  stroke="url(#r1e-vl)"
                  strokeWidth="1"
                  strokeOpacity="0.55"
                />
                <path
                  d={c.innerPath}
                  fill="none"
                  stroke="#C9A452"
                  strokeOpacity="0.2"
                  strokeWidth="0.8"
                />
                {c.flakes.map((fl, j) => (
                  <rect
                    key={j}
                    x={fl.x}
                    y={fl.y}
                    width="2.2"
                    height="2.2"
                    fill="#E9C977"
                    fillOpacity="0.55"
                    transform={fl.transform}
                  />
                ))}
              </React.Fragment>
            ))}
          </g>

          {/* Chiếu, quầng đèn, thầy bói, người xem, tráp, nón lá */}
          <polygon
            points="606,752 900,752 874,714 630,714"
            fill="#5E3418"
            stroke="#9E2A1A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon
            points="620,747 886,747 864,719 640,719"
            fill="none"
            stroke="#C9A452"
            strokeOpacity="0.55"
            strokeWidth="0.8"
          />
          <path
            d="M650 719l-12 28M680 719l-8 28M710 719l-4 28M740 719v28M770 719l4 28M800 719l8 28M830 719l12 28M860 719l14 28"
            stroke="#C9A452"
            strokeOpacity="0.22"
          />
          <circle className="r1e-den-sang" cx="762" cy="694" r="140" fill="url(#r1e-den-quang)" />

          <g id="r1e-thay">
            <path
              d="M679 680C686 675 699 675 706 680C709 688 712 697 713 704C721 707 727 713 727 720C727 727 721 729 711 729L672 729C663 729 660 726 661 721C662 714 667 709 673 706C674 696 675 688 679 680Z"
              fill="#0D0807"
            />
            <path
              d="M706 680C709 688 712 697 713 704C721 707 727 713 727 720"
              fill="none"
              stroke="url(#r1e-vl)"
              strokeWidth="1.1"
            />
            <path
              d="M681 684C676 694 670 704 664 709L668 713C674 708 680 698 684 690Z"
              fill="#120B08"
              stroke="#8C6A2A"
              strokeWidth="0.5"
            />
            <circle cx="665.5" cy="712" r="2.4" fill="#5A3420" />
            <rect x="689.5" y="671" width="7" height="7" fill="#5A3420" />
            <path d="M691 677L697 688L702 677Z" fill="#E9DCBC" />
            <path d="M689 677L697 690L704 677" fill="none" stroke="url(#r1e-vl)" strokeWidth="0.8" />
            <circle cx="693" cy="666" r="8.2" fill="#5A3420" />
            <path d="M700.6 664.5l2.6 2.6-2.4.7Z" fill="#5A3420" />
            <path
              d="M699 660C702 663 702.5 669 699.5 672"
              fill="none"
              stroke="#F3D88F"
              strokeOpacity="0.75"
              strokeWidth="0.8"
            />
            <path d="M696 671Q701 674 700 682Q697 678 693.5 673Z" fill="#D9CCB0" />
            <path
              d="M682.5 664C682 655 686 651.5 693 651.5C700 651.5 704 655 703.5 664C697 661.5 689 661.5 682.5 664Z"
              fill="#0E0907"
              stroke="url(#r1e-vl)"
              strokeWidth="0.6"
            />
            <path
              d="M684 659C690 656.5 697 656.5 702.5 659M683.6 661.6C690 659.4 697 659.4 703 661.6"
              fill="none"
              stroke="url(#r1e-vl)"
              strokeWidth="0.7"
            />
            <path
              d="M700 683C708 688 714 694 721 696L723 702C715 704 707 701 701 695Z"
              fill="#140C09"
              stroke="url(#r1e-vl)"
              strokeWidth="0.6"
            />
            <path
              d="M720 697L732 694L732 700L720 703ZM732 694L744 697L744 703L732 700Z"
              fill="#EADDBF"
              stroke="#8A6420"
              strokeWidth="0.5"
            />
            <path
              d="M723 698.6l6-1.5M723 700.6l6-1.5M735 696.6l6 1.5M735 698.6l6 1.5"
              stroke="#8A6420"
              strokeWidth="0.4"
            />
            <circle cx="722" cy="700" r="2.5" fill="#5A3420" />
          </g>

          <g id="r1e-khach" transform="matrix(-1 0 0 1 1519 0)">
            <path
              d="M679 680C686 675 699 675 706 680C709 688 712 697 713 704C721 707 727 713 727 720C727 727 721 729 711 729L672 729C663 729 660 726 661 721C662 714 667 709 673 706C674 696 675 688 679 680Z"
              fill="#3A1A0E"
            />
            <path
              d="M706 680C709 688 712 697 713 704C721 707 727 713 727 720"
              fill="none"
              stroke="url(#r1e-vl)"
              strokeWidth="1.1"
            />
            <path d="M689 679L696.5 690L703 679Z" fill="#9E2A1A" />
            <rect x="690" y="672" width="6.5" height="7" fill="#5A3420" />
            <circle cx="693" cy="667" r="7.6" fill="#5A3420" />
            <circle cx="683.5" cy="669" r="3.3" fill="#0E0907" />
            <path
              d="M698.6 661.5C701.5 664 702 669 699 672.5"
              fill="none"
              stroke="#F3D88F"
              strokeOpacity="0.75"
              strokeWidth="0.8"
            />
            <path
              d="M684.5 664C684 656 688 652.5 694 652.5C700 652.5 704 656 703.5 664C698 661.5 690 661.5 684.5 664Z"
              fill="#1A0B07"
              stroke="url(#r1e-vl)"
              strokeWidth="0.6"
            />
            <path
              d="M685 660.5C691 658.4 697 658.4 703 660.5"
              fill="none"
              stroke="url(#r1e-vl)"
              strokeWidth="0.7"
            />
            <path
              d="M700 683C705 689 709 692 713 692L714 697C708 698 703 695 699 690Z"
              fill="#2A120A"
              stroke="url(#r1e-vl)"
              strokeWidth="0.6"
            />
            <circle cx="715" cy="694" r="2.4" fill="#5A3420" />
          </g>

          <g id="r1e-trap">
            <rect
              x="752"
              y="714"
              width="34"
              height="15"
              fill="url(#r1e-son-may)"
              stroke="url(#r1e-vl)"
              strokeWidth="0.7"
            />
            <rect
              x="750"
              y="710"
              width="38"
              height="5"
              fill="#2A0E08"
              stroke="url(#r1e-vl)"
              strokeWidth="0.7"
            />
            <path
              d="M752 718h34M769 714v15"
              stroke="url(#r1e-vl)"
              strokeWidth="0.5"
              strokeOpacity="0.7"
            />
            <ellipse cx="762" cy="709" rx="6" ry="1.8" fill="#C99A3E" />
            <path
              d="M757 709C755 703 758 699 762 699C766 699 769 703 767 709Z"
              fill="#8A6420"
              stroke="url(#r1e-vl)"
              strokeWidth="0.5"
            />
            <path
              d="M759.5 699C758 695 759 690 760.5 686L763.5 686C765 690 766 695 764.5 699Z"
              fill="#F6E3AA"
              fillOpacity="0.35"
              stroke="url(#r1e-vl)"
              strokeWidth="0.5"
            />
            <path
              className="r1e-den-sang"
              d="M762 698C760 695 761 692 762 688.5C763 692 764 695 762 698Z"
              fill="#FFE7A0"
            />
            <rect
              x="776"
              y="698"
              width="7"
              height="12"
              fill="#7A5A22"
              stroke="url(#r1e-vl)"
              strokeWidth="0.5"
            />
            <path
              d="M777.5 698l-1.5-10M779.5 698v-12M781.5 698l1.5-9"
              stroke="#E6C77E"
              strokeWidth="0.9"
            />
          </g>

          <g id="r1e-non-la">
            <path
              d="M896 746L913 726L930 746Q913 750 896 746Z"
              fill="url(#r1e-non)"
              stroke="#5A4020"
              strokeWidth="0.5"
            />
            <path
              d="M913 726L902 746M913 726L908 747M913 726L918 747M913 726L924 746"
              stroke="#6A4A1C"
              strokeOpacity="0.5"
              strokeWidth="0.5"
            />
          </g>
        </g>
      </defs>
    </svg>
  );
}

/** Tranh nền desktop 1920×820 */
export function TranhDauTrangNen() {
  return (
    <svg className="r1e-tranh-nen" viewBox="0 0 1920 820" aria-hidden="true" focusable="false">
      <use href="#r1e-tranh" />
    </svg>
  );
}

/** Dải tranh mobile (cắt gọn cảnh chính, neo đáy) */
export function TranhDauTrangDai() {
  return (
    <svg
      className="r1e-tranh-dai"
      viewBox="190 290 940 470"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Tranh sơn mài đêm trăng: thầy bói áo the khăn xếp ngồi chiếu dưới gốc đa, trước mặt là tráp, đèn dầu và ống thẻ, người xem ngồi đối diện; phía sau là mái đình dưới ánh trăng"
    >
      <use href="#r1e-tranh" />
    </svg>
  );
}

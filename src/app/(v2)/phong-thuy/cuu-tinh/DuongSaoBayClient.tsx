'use client';

import { useState, type ReactNode } from 'react';

export interface BuocSaoBayItem {
  so: number;
  cung: string;
  o: [number, number];
}

export function DuongSaoBayClient({
  buoc,
  banLabel,
  children,
}: {
  buoc: BuocSaoBayItem[];
  banLabel: string;
  children: ReactNode;
}) {
  const [hienBay, setHienBay] = useState(false);
  const [lanChay, setLanChay] = useState(0);

  const toaDo = buoc.map((b) => ({
    ...b,
    x: b.o[1] * 100 + 50,
    y: b.o[0] * 100 + 50,
    nhanX: b.o[1] * 100 + 84,
    nhanY: b.o[0] * 100 + 84,
  }));

  const bamNut = () => {
    if (hienBay) {
      setHienBay(false);
    } else {
      setLanChay((v) => v + 1);
      setHienBay(true);
    }
  };

  const chayLai = () => {
    setLanChay((v) => v + 1);
    setHienBay(true);
  };

  return (
    <div className="ck-pt-ct-bay-boc">
      <div className="ck-pt-ct-bay-thanh">
        <button
          type="button"
          className={`ck-pt-ct-bay-nut${hienBay ? ' ck-pt-ct-bay-nut-bat' : ''}`}
          aria-pressed={hienBay}
          onClick={bamNut}
        >
          {hienBay ? 'Ẩn đường sao bay' : 'Xem sao bay'}
        </button>
        {hienBay ? (
          <button
            type="button"
            className="ck-pt-ct-bay-nut-lai"
            onClick={chayLai}
          >
            Chạy lại
          </button>
        ) : null}
        <span className="ck-pt-ct-bay-mo-ta">
          Thứ tự thuận bố 9 cung theo Lạc thư ({buoc.map((b) => b.so).join(' → ')})
        </span>
      </div>

      <div className="ck-pt-ct-vanh">
        <div className="ck-pt-ct-vanh-tren" aria-hidden="true">
          <span>Đông Nam</span>
          <strong>NAM</strong>
          <span>Tây Nam</span>
        </div>

        <div className="ck-pt-ct-vanh-giua">
          <div className="ck-pt-ct-vanh-trai" aria-hidden="true">
            <strong>ĐÔNG</strong>
          </div>

          <div className="ck-pt-ct-luoi-boc">
            {children}

            <svg
              key={lanChay}
              className={`ck-pt-ct-bay-overlay${hienBay ? ' ck-pt-ct-bay-hien' : ''}`}
              viewBox="0 0 300 300"
              preserveAspectRatio="none"
              role="img"
              aria-label={`Đường sao bay cho ${banLabel}: ${buoc.map((b, i) => `bước ${i + 1} sao ${b.so} tại ${b.cung}`).join(', ')}`}
            >
              {toaDo.slice(0, -1).map((diem, idx) => {
                const tiep = toaDo[idx + 1];
                return (
                  <line
                    key={`${diem.so}-${tiep.so}`}
                    x1={diem.x}
                    y1={diem.y}
                    x2={tiep.x}
                    y2={tiep.y}
                    pathLength={100}
                    className="ck-pt-ct-bay-doan"
                    style={{ animationDelay: `${idx * 0.6}s` }}
                  />
                );
              })}

              {toaDo.map((diem, idx) => (
                <g
                  key={diem.so}
                  transform={`translate(${diem.nhanX}, ${diem.nhanY})`}
                  className="ck-pt-ct-bay-buoc"
                  style={{ animationDelay: `${idx * 0.6}s` }}
                >
                  <circle cx={0} cy={0} r={10} fill="#8E1B12" stroke="#FFFDF8" strokeWidth={1.5} />
                  <text
                    x={0}
                    y={0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={10.5}
                    fontWeight={700}
                    fill="#FBF1DA"
                  >
                    {idx + 1}
                  </text>
                </g>
              ))}

              <g className="ck-pt-ct-bay-cham" aria-hidden="true">
                <circle cx={0} cy={0} r={9} fill="#8E1B12" stroke="#FBE7AE" strokeWidth={2.5} />
              </g>
            </svg>
          </div>

          <div className="ck-pt-ct-vanh-phai" aria-hidden="true">
            <strong>TÂY</strong>
          </div>
        </div>

        <div className="ck-pt-ct-vanh-duoi" aria-hidden="true">
          <span>Đông Bắc</span>
          <strong>BẮC</strong>
          <span>Tây Bắc</span>
        </div>
      </div>
    </div>
  );
}

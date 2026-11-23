import Link from 'next/link';
import {
  CUNG_HOANG_DAO,
  GHI_CHU_HOANG_DAO,
  GHI_CHU_TINH_CACH,
  GIOI_HAN,
  NGUON_TETRABIBLOS,
  duongDanCung,
  mocVaoCung,
  sangGioVN,
  viTriTrich,
  vietGioVN,
  type TrichAnh,
} from '@/lib/trang/chiem-tinh';
import { pad2, vietGioPhut, vietNgayThang } from './ChiemTinhHelpers';

/** Hiển thị câu trích tiếng Anh nguyên văn trong blockquote lang="en" và vị trí chương/trang ngay dưới. */
export function TrichTetrabiblos({ trich }: { trich: TrichAnh }) {
  return (
    <figure className="ck-ct-trich">
      <blockquote lang="en">{trich.en}</blockquote>
      <figcaption className="ck-ct-trich-vi-tri">{viTriTrich(trich)}</figcaption>
    </figure>
  );
}

/** Ghi chú bắt buộc ở chỗ người đọc mong thấy tính cách. */
export function KhoiGhiChuTinhCach() {
  return (
    <aside className="ck-ct-ghi-chu-tc" aria-label="Ghi chú phạm vi nội dung">
      <p>{GHI_CHU_TINH_CACH}</p>
    </aside>
  );
}

/** Ghi chú phân biệt cung hoàng đạo nhiệt đới và chòm sao trên trời. */
export function KhoiGhiChuHoangDao() {
  return (
    <aside className="ck-ct-ghi-chu-hd" aria-label="Ghi chú hoàng đạo nhiệt đới">
      <p>{GHI_CHU_HOANG_DAO}</p>
    </aside>
  );
}

/** Khối nguồn Tetrabiblos, quy tắc trích và giới hạn tham khảo ở cuối mỗi trang. */
export function KhoiNguonVaGioiHan({ daDung }: { daDung: Set<string> }) {
  const nhanLink = 'Project Gutenberg #70850';
  const viTriNhan = NGUON_TETRABIBLOS.ghiCong.indexOf(nhanLink);
  const phanDau =
    viTriNhan >= 0
      ? NGUON_TETRABIBLOS.ghiCong.slice(0, viTriNhan)
      : `${NGUON_TETRABIBLOS.ghiCong} (`;
  const phanCuoi =
    viTriNhan >= 0
      ? NGUON_TETRABIBLOS.ghiCong.slice(viTriNhan + nhanLink.length)
      : ')';

  return (
    <aside className="ck-nguon-nho ck-ct-nguon" aria-label="Nguồn và giới hạn tham khảo">
      <p>
        {phanDau}
        <a
          href={NGUON_TETRABIBLOS.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {nhanLink}
        </a>
        {phanCuoi}.
      </p>
      <p>{NGUON_TETRABIBLOS.ghiChuTrich}</p>
      <p>{GIOI_HAN}</p>
      {daDung.has('/nguon') ? (
        <p className="ck-ct-nguon-link">
          <Link href="/nguon">Xem danh mục nguồn sách</Link>
        </p>
      ) : null}
    </aside>
  );
}

/** Thanh 12 cung chuyển nhanh giữa các trang chi tiết cung. */
export function Thanh12Cung({ hienTai }: { hienTai?: string }) {
  return (
    <div className="ck-ct-thanh-cung">
      {CUNG_HOANG_DAO.map((c) =>
        c.slug === hienTai ? (
          <span
            key={c.slug}
            className="ck-ct-thanh-muc ck-ct-thanh-hien-tai"
            aria-current="page"
          >
            <span className="ck-ct-ky" aria-hidden="true">
              {c.kyHieu}
            </span>
            <span>{c.ten}</span>
          </span>
        ) : (
          <Link key={c.slug} href={duongDanCung(c)} className="ck-ct-thanh-muc">
            <span className="ck-ct-ky" aria-hidden="true">
              {c.kyHieu}
            </span>
            <span>{c.ten}</span>
          </Link>
        ),
      )}
    </div>
  );
}

const TAM_X = 300;
const TAM_Y = 300;
const R_OUT = 290;
const R_IN = 166;
const R_MID = 232;

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number): [number, number] => [
  Number((TAM_X + r * Math.cos(rad(deg))).toFixed(2)),
  Number((TAM_Y + r * Math.sin(rad(deg))).toFixed(2)),
];

function pathCung(a1: number, a2: number): string {
  const [ox1, oy1] = pt(R_OUT, a1);
  const [ox2, oy2] = pt(R_OUT, a2);
  const [ix2, iy2] = pt(R_IN, a2);
  const [ix1, iy1] = pt(R_IN, a1);
  return `M ${ox1} ${oy1} A ${R_OUT} ${R_OUT} 0 0 0 ${ox2} ${oy2} L ${ix2} ${iy2} A ${R_IN} ${R_IN} 0 0 1 ${ix1} ${iy1} Z`;
}

/** Vòng 12 cung hoàng đạo SVG (Bạch Dương bắt đầu ở 9 giờ, ngược chiều kim đồng hồ) kèm 4 mốc phân/chí (hoặc bản nhỏ tô 1 cung). */
export function Vong12CungSvg({
  namNay,
  cungChon,
  nho = false,
}: {
  namNay: number;
  cungChon?: string;
  nho?: boolean;
}) {
  const cungActive = cungChon
    ? CUNG_HOANG_DAO.find((c) => c.slug === cungChon)
    : undefined;

  if (nho) {
    const rInNho = 148;
    const rMidNho = 222;
    const pathNho = (a1: number, a2: number) => {
      const [ox1, oy1] = pt(R_OUT, a1);
      const [ox2, oy2] = pt(R_OUT, a2);
      const [ix2, iy2] = pt(rInNho, a2);
      const [ix1, iy1] = pt(rInNho, a1);
      return `M ${ox1} ${oy1} A ${R_OUT} ${R_OUT} 0 0 0 ${ox2} ${oy2} L ${ix2} ${iy2} A ${rInNho} ${rInNho} 0 0 1 ${ix1} ${iy1} Z`;
    };

    return (
      <div className="ck-ct-vong-khung ck-ct-vong-nho">
        <svg
          className="ck-ct-vong-svg ck-ct-vong-svg-nho"
          viewBox="0 0 600 600"
          role="img"
          aria-label={
            cungActive
              ? `Vòng 12 cung hoàng đạo, đang tô cung ${cungActive.ten} (${cungActive.tuDo}°–${cungActive.tuDo + 30}°)`
              : 'Vòng 12 cung hoàng đạo'
          }
        >
          <circle
            cx={TAM_X}
            cy={TAM_Y}
            r={R_OUT + 5}
            fill="none"
            stroke="#C9A452"
            strokeWidth="1.5"
          />
          {CUNG_HOANG_DAO.map((c) => {
            const a1 = 180 - c.thu * 30;
            const a2 = a1 - 30;
            const mid = (a1 + a2) / 2;
            const [cx, cy] = pt(rMidNho, mid);
            const dangChon = c.slug === cungChon;
            return (
              <a
                key={c.slug}
                href={duongDanCung(c)}
                className="ck-ct-vong-link"
                aria-current={dangChon ? 'page' : undefined}
                aria-label={`Cung ${c.ten} (${c.en}), từ ${c.tuDo}° đến ${c.tuDo + 30}°`}
              >
                <g className={dangChon ? 'ck-ct-vong-o ck-ct-vong-o-chon' : 'ck-ct-vong-o'}>
                  <title>{`Cung ${c.ten} (${c.en})`}</title>
                  <path
                    d={pathNho(a1, a2)}
                    fill={dangChon ? '#8E1B12' : c.duong ? '#FBF7EE' : '#F3E7CF'}
                    stroke={dangChon ? '#5A0F0A' : '#B8913F'}
                    strokeWidth={dangChon ? '2.6' : '1.4'}
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={dangChon ? 'ck-ct-vong-ky ck-ct-vong-ky-chon' : 'ck-ct-vong-ky ck-ct-vong-ky-nho'}
                  >
                    {c.kyHieu}
                  </text>
                </g>
              </a>
            );
          })}
          <circle
            cx={TAM_X}
            cy={TAM_Y}
            r="134"
            fill="#FFFDF8"
            stroke="#C9A452"
            strokeWidth="1.5"
          />
          {cungActive ? (
            <>
              <text
                x={TAM_X}
                y={TAM_Y - 34}
                textAnchor="middle"
                dominantBaseline="central"
                className="ck-ct-vong-tam-ky-nho"
              >
                {cungActive.kyHieu}
              </text>
              <text
                x={TAM_X}
                y={TAM_Y + 14}
                textAnchor="middle"
                dominantBaseline="central"
                className="ck-ct-vong-tam-ten-nho"
              >
                {cungActive.ten}
              </text>
              <text
                x={TAM_X}
                y={TAM_Y + 48}
                textAnchor="middle"
                dominantBaseline="central"
                className="ck-ct-vong-tam-do-nho"
              >
                {`${cungActive.tuDo}°–${cungActive.tuDo + 30}°`}
              </text>
            </>
          ) : null}
        </svg>
      </div>
    );
  }

  const moc = mocVaoCung(namNay);
  const mocBonDiem = [
    {
      ten: 'Xuân phân',
      moTa: '0° Bạch Dương',
      moc: sangGioVN(moc[0]),
      x: 146,
      y: 294,
      anchor: 'start' as const,
      goc: 180,
    },
    {
      ten: 'Hạ chí',
      moTa: '0° Cự Giải',
      moc: sangGioVN(moc[3]),
      x: 300,
      y: 428,
      anchor: 'middle' as const,
      goc: 90,
    },
    {
      ten: 'Thu phân',
      moTa: '0° Thiên Bình',
      moc: sangGioVN(moc[6]),
      x: 454,
      y: 294,
      anchor: 'end' as const,
      goc: 0,
    },
    {
      ten: 'Đông chí',
      moTa: '0° Ma Kết',
      moc: sangGioVN(moc[9]),
      x: 300,
      y: 162,
      anchor: 'middle' as const,
      goc: -90,
    },
  ];

  return (
    <div className="ck-ct-vong-khung">
      <svg
        className="ck-ct-vong-svg"
        viewBox="0 0 600 600"
        role="img"
        aria-label={`Vòng 12 cung hoàng đạo nhiệt đới năm ${namNay}: 12 ô 30 độ, cung Bạch Dương bắt đầu từ mốc Xuân phân bên trái (9 giờ) đi ngược chiều kim đồng hồ tới Song Ngư`}
      >

        <circle
          cx={TAM_X}
          cy={TAM_Y}
          r={R_OUT + 5}
          fill="none"
          stroke="#C9A452"
          strokeWidth="1.2"
        />
        <circle
          cx={TAM_X}
          cy={TAM_Y}
          r={R_IN - 4}
          fill="#FFFDF8"
          stroke="#CDB58C"
          strokeWidth="1"
        />

        {CUNG_HOANG_DAO.map((c) => {
          const a1 = 180 - c.thu * 30;
          const a2 = a1 - 30;
          const mid = (a1 + a2) / 2;
          const [cx, cy] = pt(R_MID, mid);
          return (
            <a
              key={c.slug}
              href={duongDanCung(c)}
              className="ck-ct-vong-link"
              aria-label={`Cung ${c.ten} (${c.en}), từ ${c.tuDo}° đến ${c.tuDo + 30}°`}
            >
              <g className="ck-ct-vong-o">
                <path
                  d={pathCung(a1, a2)}
                  fill={c.duong ? '#FBF7EE' : '#F3E7CF'}
                  stroke="#B8913F"
                  strokeWidth="1.2"
                />
                <text
                  x={cx}
                  y={cy - 13}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="ck-ct-vong-ky"
                >
                  {c.kyHieu}
                </text>
                <text
                  x={cx}
                  y={cy + 13}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="ck-ct-vong-ten"
                >
                  {c.ten}
                </text>
              </g>
            </a>
          );
        })}

        {mocBonDiem.map((m) => {
          const [x1, y1] = pt(R_IN - 6, m.goc);
          const [x2, y2] = pt(R_OUT + 4, m.goc);
          const [dx, dy] = pt(R_IN, m.goc);
          return (
            <g key={m.ten}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#8E1B12"
                strokeWidth="2.4"
              />
              <circle
                cx={dx}
                cy={dy}
                r="4"
                fill="#8E1B12"
                stroke="#FFFDF8"
                strokeWidth="1.5"
              />
              <text
                x={m.x}
                y={m.y}
                textAnchor={m.anchor}
                className="ck-ct-vong-moc-ten"
              >
                {m.ten}
              </text>
              <text
                x={m.x}
                y={m.y + 18}
                textAnchor={m.anchor}
                className="ck-ct-vong-moc-gio"
              >
                {`${vietGioPhut(m.moc)} · ${vietNgayThang(m.moc)}`}
              </text>
            </g>
          );
        })}

        <circle
          cx={TAM_X}
          cy={TAM_Y}
          r="38"
          fill="#FBF5E8"
          stroke="#C9A452"
          strokeWidth="1.2"
        />
        <text
          x={TAM_X}
          y={TAM_Y - 7}
          textAnchor="middle"
          className="ck-ct-vong-tam-tieu"
        >
          Hoàng đạo
        </text>
        <text
          x={TAM_X}
          y={TAM_Y + 13}
          textAnchor="middle"
          className="ck-ct-vong-tam-nam"
        >
          {pad2(namNay)}
        </text>
      </svg>

      <div className="ck-ct-moc-luoi" aria-label={`4 điểm phân và chí năm ${namNay}`}>
        {mocBonDiem.map((m) => (
          <div key={m.ten} className="ck-ct-moc-o">
            <b>{m.ten}</b>
            <span>{m.moTa}</span>
            <small>{vietGioVN(m.moc)} (giờ VN)</small>
          </div>
        ))}
      </div>
    </div>
  );
}

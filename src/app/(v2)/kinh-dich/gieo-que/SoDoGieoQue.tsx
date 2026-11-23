import Link from 'next/link';
import { duongDanQue } from '@/lib/trang/chu-dich';
import type { Hao, KetQuaGieo, Que } from '@/lib/trang/kinh-dich';
import { sauHao, type DongHao } from '@/lib/trang/truc-quan-43';

export interface SoDoGieoQueProps {
  ketQua: KetQuaGieo;
  daDung: Set<string>;
}

const TEN_HAO_VI = ['Sơ', 'Nhị', 'Tam', 'Tứ', 'Ngũ', 'Thượng'] as const;

function tenNhanDong(h: DongHao): string {
  if (h.giaTri === 9 || (h.giaTri === undefined && h.hao === 1)) {
    return '○ lão dương';
  }
  return '× lão âm';
}

function TieuDeQue({
  que,
  daDung,
  chinh = false,
}: {
  que: Que;
  daDung: Set<string>;
  chinh?: boolean;
}) {
  const href = duongDanQue(que);
  const coLink = daDung.has(href);
  const clsTen = chinh ? 'ck-kd-que-ten-chinh' : 'ck-kd-que-ten';

  return (
    <>
      <h3 className={clsTen}>
        <span className="ck-kd-que-so">#{que.so}</span>{' '}
        {coLink ? (
          <Link href={href} className="ck-kd-que-link">
            {que.ten}
          </Link>
        ) : (
          <span>{que.ten}</span>
        )}
      </h3>
      <p className="ck-kd-so-quai">
        Thượng: <b>{que.thuong.ten}</b> ({que.thuong.tuong} · {que.thuong.hanh}) · Hạ:{' '}
        <b>{que.ha.ten}</b> ({que.ha.tuong} · {que.ha.hanh})
      </p>
    </>
  );
}

function VachHao({ laDuong, dong }: { laDuong: boolean; dong?: boolean }) {
  return (
    <span
      className={`ck-kd-bar-khung${dong ? ' ck-kd-bar-dong' : ''}`}
      aria-hidden="true"
    >
      {laDuong ? (
        <i className="ck-kd-bar-lien" />
      ) : (
        <>
          <i className="ck-kd-bar-dut" />
          <i className="ck-kd-bar-dut" />
        </>
      )}
    </span>
  );
}

function QueHoNho({ que, daDung }: { que: Que; daDung: Set<string> }) {
  const href = duongDanQue(que);
  const coLink = daDung.has(href);
  const cacHao: { viTri: number; hao: Hao }[] = [5, 4, 3, 2, 1, 0].map((idx) => ({
    viTri: idx + 1,
    hao: que.hao[idx],
  }));

  return (
    <article className="ck-kd-que-ho-nho" aria-label={`Quẻ hỗ: ${que.ten}`}>
      <div className="ck-kd-ho-dau">
        <div>
          <span className="ck-que-nhan">Quẻ Hỗ</span>
          <h3 className="ck-kd-ho-ten">
            <span className="ck-kd-que-so">#{que.so}</span>{' '}
            {coLink ? (
              <Link href={href} className="ck-kd-que-link">
                {que.ten}
              </Link>
            ) : (
              <span>{que.ten}</span>
            )}
          </h3>
          <p className="ck-kd-so-quai">
            Thượng: <b>{que.thuong.ten}</b> ({que.thuong.tuong}) · Hạ: <b>{que.ha.ten}</b> (
            {que.ha.tuong}) — hào 2–4 làm hạ quái, hào 3–5 làm thượng quái.
          </p>
        </div>

        <div
          className="ck-kd-ho-hinh"
          role="img"
          aria-label={`Hình quẻ hỗ ${que.ten}, 6 hào từ dưới lên`}
        >
          {cacHao.map((h) => (
            <div key={h.viTri} className="ck-kd-ho-hang">
              <span className="ck-kd-ho-vi">H{h.viTri}</span>
              <VachHao laDuong={h.hao === 1} />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function SoDoGieoQue({ ketQua, daDung }: SoDoGieoQueProps) {
  const dsHao = [...sauHao(ketQua)].reverse();
  const queBien = ketQua.queBien;

  return (
    <div className="ck-kd-so-do-boc">
      {queBien ? (
        <div className="ck-kd-doi-que">
          <div className="ck-kd-doi-dau">
            <div className="ck-kd-doi-tieu">
              <span className="ck-que-nhan">Quẻ Chủ</span>
              <TieuDeQue que={ketQua.queChu} daDung={daDung} chinh />
            </div>

            <div className="ck-kd-doi-giua-dau" aria-hidden="true">
              <span>Biến →</span>
            </div>

            <div className="ck-kd-doi-tieu">
              <span className="ck-que-nhan">Quẻ Biến</span>
              <TieuDeQue que={queBien} daDung={daDung} />
            </div>
          </div>

          <div
            className="ck-kd-so-bang"
            role="img"
            aria-label={`Hình quẻ chủ ${ketQua.queChu.ten} biến thành ${queBien.ten}, 6 hào từ dưới lên`}
          >
            {dsHao.map((h) => {
              const tenViTri = TEN_HAO_VI[h.thu - 1];
              const nhanDong = h.dong ? tenNhanDong(h) : null;
              return (
                <div
                  key={h.thu}
                  className={`ck-kd-so-hang${h.dong ? ' ck-kd-so-hang-dong' : ''}`}
                >
                  <div className="ck-kd-so-trai">
                    <div className="ck-kd-so-nhan">
                      {h.dong ? (
                        <span className="ck-kd-dong-bao">
                          <span className="ck-kd-cham-dong" aria-hidden="true" />
                          <span className="ck-kd-nhan-dong">{nhanDong}</span>
                        </span>
                      ) : (
                        <span className="ck-kd-hao-tinh-chu">
                          {h.giaTri ?? (h.hao === 1 ? 'Dương' : 'Âm')}
                        </span>
                      )}
                      <span className="ck-kd-so-vi">
                        H{h.thu} <small>({tenViTri})</small>
                      </span>
                    </div>
                    <VachHao laDuong={h.hao === 1} dong={h.dong} />
                  </div>

                  <div className="ck-kd-so-mui-ten" aria-hidden="true">
                    {h.dong ? (
                      <svg
                        className="ck-kd-mui-ten-svg"
                        viewBox="0 0 48 16"
                        fill="none"
                      >
                        <line
                          x1="2"
                          y1="8"
                          x2="41"
                          y2="8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M36 3.5 L44 8 L36 12.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </div>

                  <div className="ck-kd-so-phai">
                    <VachHao laDuong={h.haoBien === 1} dong={h.dong} />
                    <div className="ck-kd-so-nhan ck-kd-so-nhan-phai">
                      <span className="ck-kd-so-vi">H{h.thu}</span>
                      {h.dong ? (
                        <span className="ck-kd-nhan-bien">
                          → {h.haoBien === 1 ? 'dương' : 'âm'}
                        </span>
                      ) : (
                        <span className="ck-kd-hao-tinh-chu">
                          {h.haoBien === 1 ? 'Dương' : 'Âm'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <article
          className="ck-kd-que-tinh-khung"
          aria-label={`Quẻ chủ ${ketQua.queChu.ten}, sáu hào đều tĩnh`}
        >
          <div className="ck-kd-tinh-dau">
            <span className="ck-que-nhan">Quẻ Chủ</span>
            <span className="ck-kd-nhan-tinh">Sáu hào đều tĩnh</span>
          </div>
          <TieuDeQue que={ketQua.queChu} daDung={daDung} chinh />

          <div
            className="ck-kd-so-bang ck-kd-so-bang-tinh"
            role="img"
            aria-label={`Hình quẻ chủ ${ketQua.queChu.ten}, 6 hào đều tĩnh`}
          >
            {dsHao.map((h) => (
              <div key={h.thu} className="ck-kd-so-hang-tinh">
                <span className="ck-kd-so-vi">
                  H{h.thu} <small>({TEN_HAO_VI[h.thu - 1]})</small>
                </span>
                <VachHao laDuong={h.hao === 1} />
                <span className="ck-kd-hao-tinh-chu">
                  {h.giaTri ?? (h.hao === 1 ? 'Dương' : 'Âm')}
                </span>
              </div>
            ))}
          </div>
        </article>
      )}

      <QueHoNho que={ketQua.queHo} daDung={daDung} />
    </div>
  );
}

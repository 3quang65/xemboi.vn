'use client';

import { useMemo, useState } from 'react';
import { KHOI, type KhoiMuc } from '@/lib/noi-dung/khoi';
import { diffTheoDong } from '../HienThi';

export type PhienBanSoSanh = {
  id: string;
  so: number;
  nguonTao: string;
  khoi: KhoiMuc | null;
  than: string | null;
};

export default function SoSanhPhienBan({
  laTuDien,
  dsPhienBan,
}: {
  laTuDien: boolean;
  dsPhienBan: PhienBanSoSanh[];
}) {
  const [soA, setSoA] = useState<number>(() => (dsPhienBan.length >= 2 ? dsPhienBan[1].so : dsPhienBan[0]?.so ?? 1));
  const [soB, setSoB] = useState<number>(() => dsPhienBan[0]?.so ?? 1);

  const pbA = dsPhienBan.find((p) => p.so === soA);
  const pbB = dsPhienBan.find((p) => p.so === soB);

  const cacPhanDiff = useMemo(() => {
    if (!pbA || !pbB) return [];
    if (!laTuDien) {
      return [
        {
          ma: 'than',
          tieuDe: 'Thân bài (Markdown)',
          dong: diffTheoDong(pbA.than ?? '', pbB.than ?? ''),
        },
      ];
    }
    return KHOI.map(({ ma, ten }) => {
      const cu = pbA.khoi?.[ma] ?? (ma === 'k5' && pbA.khoi?.k5KhongApDung ? '[Không áp dụng]' : '');
      const moi = pbB.khoi?.[ma] ?? (ma === 'k5' && pbB.khoi?.k5KhongApDung ? '[Không áp dụng]' : '');
      return {
        ma,
        tieuDe: `Khối ${ma.slice(1)}: ${ten}`,
        dong: diffTheoDong(cu, moi),
      };
    });
  }, [laTuDien, pbA, pbB]);

  if (dsPhienBan.length < 2) {
    return (
      <div className="qt-the">
        <h2>So sánh hai phiên bản</h2>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Cần ít nhất 2 phiên bản để so sánh.</p>
      </div>
    );
  }

  return (
    <div className="qt-the">
      <h2>So sánh hai phiên bản</h2>
      <div className="qt-loc">
        <label>
          Bản cũ (A){' '}
          <select className="qt-o" value={soA} onChange={(e) => setSoA(Number(e.target.value))}>
            {dsPhienBan.map((p) => (
              <option key={p.id} value={p.so}>
                v{p.so} ({p.nguonTao})
              </option>
            ))}
          </select>
        </label>
        <label>
          Bản mới (B){' '}
          <select className="qt-o" value={soB} onChange={(e) => setSoB(Number(e.target.value))}>
            {dsPhienBan.map((p) => (
              <option key={p.id} value={p.so}>
                v{p.so} ({p.nguonTao})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {cacPhanDiff.map((phan) => {
          const coDoi = phan.dong.some((d) => d.loai !== 'giu');
          return (
            <div key={phan.ma}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                {phan.tieuDe}{' '}
                {!coDoi && <span className="qt-nhan">Không đổi</span>}
                {coDoi && <span className="qt-nhan vua">Có thay đổi</span>}
              </div>
              {coDoi && (
                <div className="qt-diff">
                  {phan.dong.map((d, idx) => (
                    <div
                      key={idx}
                      className={`qt-diff-dong ${
                        d.loai === 'them' ? 'qt-diff-them' : d.loai === 'xoa' ? 'qt-diff-xoa' : 'qt-diff-giu'
                      }`}
                    >
                      {d.loai === 'them' ? '+ ' : d.loai === 'xoa' ? '- ' : '  '}
                      {d.noiDung || ' '}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { Fragment, useState } from 'react';

export type DongNhatKy = {
  id: string;
  luc: string;
  email: string | null;
  hoTen: string | null;
  hanhDong: string;
  doiTuong: string;
  doiTuongId: string | null;
  ip: string | null;
  truoc: unknown;
  sau: unknown;
};

function dinhDangJson(v: unknown): string {
  if (v === null || v === undefined) return 'null';
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

export default function BangNhatKy({ ds }: { ds: DongNhatKy[] }) {
  const [moId, setMoId] = useState<string | null>(null);

  return (
    <div className="qt-the qt-the-cuon">
      <table className="qt-bang">
        <thead>
          <tr>
            <th>Lúc</th>
            <th>Tài khoản</th>
            <th>Hành động</th>
            <th>Đối tượng &amp; mã</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {ds.length === 0 && (
            <tr>
              <td colSpan={5} style={{ color: 'var(--muted)' }}>
                Không có dòng nhật ký nào khớp bộ lọc.
              </td>
            </tr>
          )}
          {ds.map((d) => {
            const dangMo = moId === d.id;
            return (
              <Fragment key={d.id}>
                <tr
                  className="qt-dong-bam"
                  onClick={() => setMoId(dangMo ? null : d.id)}
                  aria-expanded={dangMo}
                >
                  <td style={{ whiteSpace: 'nowrap' }}>{d.luc}</td>
                  <td>
                    {d.email ? (
                      <>
                        <div>{d.email}</div>
                        {d.hoTen && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{d.hoTen}</div>}
                      </>
                    ) : (
                      <span style={{ color: 'var(--muted)' }}>(Hệ thống)</span>
                    )}
                  </td>
                  <td>
                    <code>{d.hanhDong}</code>
                  </td>
                  <td>
                    {d.doiTuong}
                    {d.doiTuongId ? ` #${d.doiTuongId}` : ''}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{d.ip ?? '–'}</td>
                </tr>
                {dangMo && (
                  <tr>
                    <td colSpan={5}>
                      <div className="qt-json-luoi">
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>Trước</div>
                          <pre className="qt-json">{dinhDangJson(d.truoc)}</pre>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>Sau</div>
                          <pre className="qt-json">{dinhDangJson(d.sau)}</pre>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { catVanBan, TEN_LOAI_DOAN, TEN_PHAM_VI } from '../HienThi';
import { luuCauHoiChuan } from './hanh-dong';

export type DongKetQuaClient = {
  id: string;
  nguonId: number;
  nguonMa: string;
  nguonTen: string;
  duongDan: string[];
  loai: string;
  vanBan: string;
  vanBanChuan: string | null;
  hanViet: string | null;
  dichVi: string | null;
  phamVi: string;
  diemTsv: number;
  diemTrgm: number;
  diem: number;
};

const DS_MANG = [
  { ma: 'tu-vi', ten: 'Tử vi (tu-vi)' },
  { ma: 'kinh-dich', ten: 'Kinh Dịch (kinh-dich)' },
  { ma: 'bat-tu', ten: 'Bát tự (bat-tu)' },
  { ma: 'chon-ngay', ten: 'Chọn ngày (chon-ngay)' },
  { ma: 'phong-thuy', ten: 'Phong thủy (phong-thuy)' },
  { ma: 'ngu-hanh', ten: 'Ngũ hành (ngu-hanh)' },
] as const;

function nhanPhamViText(pv: string) {
  const lop = pv === 'CONG_KHAI' ? 'tot' : pv === 'NOI_BO' ? 'vua' : '';
  return <span className={`qt-nhan ${lop}`}>{TEN_PHAM_VI[pv] ?? pv}</span>;
}

function nhanLoaiDoanText(loai: string) {
  return <span className="qt-nhan">{TEN_LOAI_DOAN[loai] ?? loai}</span>;
}

export function KetQuaVaLuuCauHoi({
  ketQua,
  q,
  cach,
  sua,
  quayVe,
}: {
  ketQua: DongKetQuaClient[];
  q: string;
  cach: string;
  sua: boolean;
  quayVe: string;
}) {
  const [daChon, setDaChon] = useState<string[]>([]);

  const doiChon = (id: string, checked: boolean) => {
    setDaChon((cu) => {
      if (checked) {
        if (cu.includes(id) || cu.length >= 10) return cu;
        return [...cu, id];
      }
      return cu.filter((x) => x !== id);
    });
  };

  const bang = (
    <div className="qt-the qt-the-cuon">
      <table className="qt-bang">
        <thead>
          <tr>
            {sua && <th style={{ width: 34 }}>Chọn</th>}
            <th className="qt-cot-so">Hạng</th>
            <th className="qt-cot-so">Điểm</th>
            <th>Mã đoạn</th>
            <th>Nguồn &amp; Đường dẫn</th>
            <th>Nội dung</th>
            <th>Phạm vi</th>
          </tr>
        </thead>
        <tbody>
          {ketQua.length === 0 && (
            <tr>
              <td colSpan={sua ? 7 : 6} style={{ color: 'var(--muted)' }}>
                Không có đoạn nào khớp từ khóa này.
              </td>
            </tr>
          )}
          {ketQua.map((r, i) => {
            const checked = daChon.includes(r.id);
            const khoa = !checked && daChon.length >= 10;
            return (
              <tr key={r.id}>
                {sua && (
                  <td>
                    <input
                      type="checkbox"
                      name="doanId"
                      value={r.id}
                      checked={checked}
                      disabled={khoa}
                      onChange={(e) => doiChon(r.id, e.target.checked)}
                      aria-label={`Chọn đoạn #${r.id} làm đoạn đúng`}
                    />
                  </td>
                )}
                <td className="qt-cot-so">{i + 1}</td>
                <td className="qt-cot-so" style={{ whiteSpace: 'nowrap' }}>
                  <div>
                    <b>{r.diem.toFixed(3)}</b>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 11 }}>
                    {cach === 'lai' ? 'BM25' : `tsv ${r.diemTsv.toFixed(2)} · trgm ${r.diemTrgm.toFixed(2)}`}
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link href={`/quan-tri/rag/doan/${r.id}`}>
                    <b>#{r.id}</b>
                  </Link>
                  <div style={{ marginTop: 4 }}>{nhanLoaiDoanText(r.loai)}</div>
                </td>
                <td style={{ minWidth: 160 }}>
                  <div>
                    <Link href={`/quan-tri/rag/nguon/${r.nguonId}`}>
                      <b>{r.nguonMa}</b>
                    </Link>{' '}
                    · {r.nguonTen}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{r.duongDan.join(' › ') || '–'}</div>
                </td>
                <td style={{ maxWidth: 500 }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{catVanBan(r.vanBanChuan ?? r.vanBan, 400)}</div>
                  {r.hanViet && (
                    <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted)' }}>
                      <b>Hán Việt:</b> {catVanBan(r.hanViet, 200)}
                    </div>
                  )}
                  {r.dichVi && (
                    <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted)' }}>
                      <b>Dịch Việt:</b> {catVanBan(r.dichVi, 200)}
                    </div>
                  )}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{nhanPhamViText(r.phamVi)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (!sua) return bang;

  return (
    <form action={luuCauHoiChuan}>
      <input type="hidden" name="quayVe" value={quayVe} />
      {bang}

      <div className="qt-the">
        <h2>Lưu thành câu hỏi chuẩn</h2>
        <p className="qt-phu" style={{ marginBottom: 12 }}>
          Đánh dấu từ 1 đến 10 đoạn đúng ở bảng trên (đã chọn: <b>{daChon.length}/10</b> đoạn). Mã nguồn đúng được tự đọc
          từ CSDL theo các đoạn đã chọn.
        </p>

        <div className="qt-dg-form-luu">
          <div className="qt-dg-luoi-2">
            <label style={{ display: 'grid', gap: 4 }}>
              Câu hỏi (tối đa 500 ký tự)
              <input className="qt-o" name="cauHoi" defaultValue={q} maxLength={500} required />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              Mảng
              <select className="qt-o" name="mang" defaultValue="tu-vi" required>
                {DS_MANG.map((m) => (
                  <option key={m.ma} value={m.ma}>
                    {m.ten}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="qt-dg-luoi-2">
            <label style={{ display: 'grid', gap: 4 }}>
              Vị trí đúng (tùy chọn)
              <input className="qt-o" name="viTriDung" placeholder="Ví dụ: WS01 · 卷一 · 太微賦" maxLength={300} />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              Ghi chú (tùy chọn, tối đa 1.000 ký tự)
              <input className="qt-o" name="ghiChu" placeholder="Giải thích ngắn gọn..." maxLength={1000} />
            </label>
          </div>

          <div className="qt-loc" style={{ marginBottom: 0 }}>
            <button className="qt-nut" type="submit" disabled={daChon.length === 0}>
              Lưu thành câu hỏi chuẩn
            </button>
            {daChon.length === 0 && (
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                Hãy tích chọn ít nhất 1 đoạn ở bảng trên để bật nút lưu.
              </span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

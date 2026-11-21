import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import ThongBao, { so } from '../ThongBao';
import { dinhDangNgayUtc } from '../lien-ket/HienThi';
import { capNhatLichMua } from './hanh-dong';

export const metadata: Metadata = { title: 'Lịch mùa vụ' };
export const dynamic = 'force-dynamic';

const DS_TRANG_THAI = ['CHUA_LAM', 'DANG_LAM', 'XONG', 'HOAN'] as const;
const TEN_TRANG_THAI: Record<string, string> = {
  CHUA_LAM: 'Chưa làm',
  DANG_LAM: 'Đang làm',
  XONG: 'Xong',
  HOAN: 'Hoãn',
};

function layNgayHomNayVn(): { nam: number; thang: number; ngay: number; chuoi: string } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const lay = (loai: string) => Number(parts.find((p) => p.type === loai)?.value ?? 0);
  const nam = lay('year');
  const thang = lay('month');
  const ngay = lay('day');
  const chuoi = `${String(ngay).padStart(2, '0')}/${String(thang).padStart(2, '0')}/${nam}`;
  return { nam, thang, ngay, chuoi };
}

function tinhSoNgayConLaiVn(hanLenTrang: Date, homNay: { nam: number; thang: number; ngay: number }): number {
  const homNayMs = Date.UTC(homNay.nam, homNay.thang - 1, homNay.ngay);
  const hanMs = Date.UTC(hanLenTrang.getUTCFullYear(), hanLenTrang.getUTCMonth(), hanLenTrang.getUTCDate());
  return Math.round((hanMs - homNayMs) / 86_400_000);
}

function nhanTrangThaiMua(tt: string) {
  const lop = tt === 'XONG' ? 'tot' : tt === 'DANG_LAM' ? 'vua' : '';
  return <span className={`qt-nhan ${lop}`}>{TEN_TRANG_THAI[tt] ?? tt}</span>;
}

export default async function TrangLichMua({
  searchParams,
}: {
  searchParams: Promise<{ bao?: string; loi?: string }>;
}) {
  const nd = await yeuCauQuyen('seo.xem');
  const sp = await searchParams;
  const sua = coQuyen(nd.vaiTro, 'seo.sua');

  const ds = await prisma.seoLichMua.findMany({
    orderBy: [{ hanLenTrang: 'asc' }, { ten: 'asc' }],
  });

  const homNay = layNgayHomNayVn();
  const dong = ds.map((m) => ({
    ...m,
    soNgay: tinhSoNgayConLaiVn(m.hanLenTrang, homNay),
  }));

  const demTt = new Map<string, number>();
  let sapDenHan = 0;
  for (const d of dong) {
    demTt.set(d.trangThai, (demTt.get(d.trangThai) ?? 0) + 1);
    if (d.soNgay < 30 && d.trangThai !== 'XONG' && d.trangThai !== 'HOAN') sapDenHan++;
  }

  return (
    <>
      <h1>Lịch mùa vụ</h1>
      <p className="qt-phu">
        Theo dõi hạn lên trang trước đỉnh tìm kiếm theo giờ Việt Nam (hôm nay: <b>{homNay.chuoi}</b>). Mùa còn dưới 30
        ngày hoặc đã quá hạn được tô đỏ.
      </p>
      <ThongBao bao={sp.bao} loi={sp.loi} />

      <div className="qt-luoi">
        <div className="qt-so">
          <div className="qt-so-nhan">Tổng mùa vụ</div>
          <div className="qt-so-gt">{so(dong.length)}</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Chưa làm / Đang làm</div>
          <div className="qt-so-gt">
            {so(demTt.get('CHUA_LAM') ?? 0)} / {so(demTt.get('DANG_LAM') ?? 0)}
          </div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Xong / Hoãn</div>
          <div className="qt-so-gt">
            {so(demTt.get('XONG') ?? 0)} / {so(demTt.get('HOAN') ?? 0)}
          </div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Chưa xong, &lt; 30 ngày / quá hạn</div>
          <div className="qt-so-gt" style={sapDenHan > 0 ? { color: 'var(--bad)' } : undefined}>
            {so(sapDenHan)}
          </div>
        </div>
      </div>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Mùa vụ</th>
              <th>Đỉnh tìm (từ–đến)</th>
              <th>Hạn lên trang</th>
              <th>Còn lại</th>
              <th>Trạng thái &amp; ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {dong.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: 'var(--muted)' }}>
                  Chưa có dòng lịch mùa vụ nào.
                </td>
              </tr>
            )}
            {dong.map((m) => {
              const gapDo = m.soNgay < 30;
              return (
                <tr key={m.id}>
                  <td>
                    <b>{m.ten}</b>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {dinhDangNgayUtc(m.dinhTu)} – {dinhDangNgayUtc(m.dinhDen)}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{dinhDangNgayUtc(m.hanLenTrang)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {m.soNgay < 0 ? (
                      <span className="qt-nhan xau">quá hạn ({so(Math.abs(m.soNgay))} ngày)</span>
                    ) : m.soNgay === 0 ? (
                      <span className="qt-nhan xau">Hôm nay (0 ngày)</span>
                    ) : gapDo ? (
                      <span className="qt-nhan xau">Còn {so(m.soNgay)} ngày</span>
                    ) : (
                      <span>Còn {so(m.soNgay)} ngày</span>
                    )}
                  </td>
                  <td>
                    {sua ? (
                      <form action={capNhatLichMua} className="qt-lm-form">
                        <input type="hidden" name="id" value={m.id} />
                        <div className="qt-lm-hang">
                          <select
                            className="qt-o"
                            name="trangThai"
                            defaultValue={m.trangThai}
                            aria-label={`Trạng thái mùa vụ ${m.ten}`}
                            style={{ padding: '4px 8px' }}
                          >
                            {DS_TRANG_THAI.map((tt) => (
                              <option key={tt} value={tt}>
                                {TEN_TRANG_THAI[tt]}
                              </option>
                            ))}
                          </select>
                          <button className="qt-nut qt-lk-nut-nho" type="submit">
                            Lưu
                          </button>
                        </div>
                        <textarea
                          className="qt-o qt-lm-ghichu"
                          name="ghiChu"
                          defaultValue={m.ghiChu ?? ''}
                          rows={2}
                          maxLength={2000}
                          aria-label={`Ghi chú mùa vụ ${m.ten}`}
                          placeholder="Ghi chú..."
                        />
                      </form>
                    ) : (
                      <div>
                        <div style={{ marginBottom: 4 }}>{nhanTrangThaiMua(m.trangThai)}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{m.ghiChu || '–'}</div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

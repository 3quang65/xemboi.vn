import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { getAnalyticsSummary } from '@/lib/tracking/tracker-server';
import { so, pct } from '../seo/ThongBao';

export const metadata: Metadata = { title: 'Số liệu lưu lượng' };
export const dynamic = 'force-dynamic';

/** Chỉ giữ 6 ký tự đầu của visitorId để bảo vệ danh tính ở vai trò xem số liệu. */
function rutGonVisitorId(id: string | null | undefined): string {
  const s = (id ?? '').trim();
  if (!s) return '–';
  return s.length > 6 ? `${s.slice(0, 6)}…` : s;
}

function lopHanhVi(eventType: string): string {
  if (eventType === 'GENERATE_CHART') return 'tot';
  if (eventType === 'OPEN_CHAT') return 'vua';
  return '';
}

function dinhDangThoiGian(gt: Date | string): string {
  const d = gt instanceof Date ? gt : new Date(gt);
  if (Number.isNaN(d.getTime())) return '–';
  return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
}

export default async function TrangSoLieu() {
  await yeuCauQuyen('so_lieu.xem');

  const [data, thietBiRaw] = await Promise.all([
    getAnalyticsSummary(),
    prisma.visitorSession
      .groupBy({
        by: ['deviceType'],
        _count: true,
      })
      .then((rows) => rows.map((r) => ({ deviceType: r.deviceType, _count: r._count })))
      .catch(() => [] as { deviceType: string | null; _count: number }[]),
  ]);

  const laDuPhong = 'fallback' in data && Boolean(data.fallback);
  const tongPhienThietBi = thietBiRaw.reduce((tong, r) => tong + r._count, 0);
  const tyLeLapLaSo = data.totalPageViews > 0 ? Math.min(100, (data.chartsGenerated / data.totalPageViews) * 100) : 0;
  const tyLeMoChat = data.chartsGenerated > 0 ? Math.min(100, (data.chatOpened / data.chartsGenerated) * 100) : 0;

  return (
    <>
      <div className="qt-dau-trang">
        <div>
          <h1>Số liệu lưu lượng</h1>
          <p className="qt-phu" style={{ marginBottom: 0 }}>
            Tổng hợp phiên truy cập, lượt xem, lá số đã lập và tương tác chat trực tiếp từ máy chủ.
          </p>
        </div>
        <div className="qt-dau-nut">
          <Link className="qt-nut phu" href="/quan-tri/so-lieu">
            Làm mới
          </Link>
        </div>
      </div>

      {laDuPhong && (
        <div className="qt-bao" role="status">
          Không truy vấn được bảng thống kê từ cơ sở dữ liệu; đang hiển thị dữ liệu dự phòng trong bộ nhớ.
        </div>
      )}

      <div className="qt-luoi">
        <div className="qt-so">
          <div className="qt-so-nhan">Đang online</div>
          <div className="qt-so-gt">{so(data.onlineCount)}</div>
          <div className="qt-so-nhan">Cửa sổ hoạt động 2 phút</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Phiên hôm nay / tổng</div>
          <div className="qt-so-gt">
            {so(data.todaySessions)} / {so(data.totalSessions)}
          </div>
          <div className="qt-so-nhan">Phiên truy cập ghi nhận</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Lượt xem hôm nay / tổng</div>
          <div className="qt-so-gt">
            {so(data.todayPageViews)} / {so(data.totalPageViews)}
          </div>
          <div className="qt-so-nhan">Sự kiện trang</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Lá số đã lập</div>
          <div className="qt-so-gt">{so(data.chartsGenerated)}</div>
          <div className="qt-so-nhan">Sự kiện GENERATE_CHART</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Mở chat</div>
          <div className="qt-so-gt">{so(data.chatOpened)}</div>
          <div className="qt-so-nhan">Sự kiện OPEN_CHAT</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Tỷ lệ chuyển đổi</div>
          <div className="qt-so-gt">{data.conversionRate}</div>
          <div className="qt-so-nhan">Mở chat / Lá số</div>
        </div>
      </div>

      <div className="qt-kh-luoi">
        <div className="qt-the">
          <h2>Phễu tương tác</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>1. Lượt xem trang</span>
                <b>{so(data.totalPageViews)} (100%)</b>
              </div>
              <div className="qt-thanh">
                <span style={{ width: data.totalPageViews > 0 ? '100%' : '0%' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>2. Lập lá số</span>
                <b>
                  {so(data.chartsGenerated)} ({pct(data.chartsGenerated, data.totalPageViews)})
                </b>
              </div>
              <div className="qt-thanh">
                <span style={{ width: `${tyLeLapLaSo.toFixed(1)}%` }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>3. Mở khung chat</span>
                <b>
                  {so(data.chatOpened)} ({data.conversionRate})
                </b>
              </div>
              <div className="qt-thanh">
                <span style={{ width: `${tyLeMoChat.toFixed(1)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="qt-the">
          <h2>Phân bổ thiết bị theo phiên</h2>
          {thietBiRaw.length === 0 ? (
            <p className="qt-phu" style={{ marginBottom: 0 }}>
              Chưa có dữ liệu phiên theo thiết bị.
            </p>
          ) : (
            <table className="qt-bang">
              <thead>
                <tr>
                  <th>Thiết bị</th>
                  <th className="qt-cot-so">Số phiên</th>
                  <th className="qt-cot-so">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                {thietBiRaw.map((tb, idx) => (
                  <tr key={tb.deviceType ?? `tb-${idx}`}>
                    <td>{tb.deviceType || 'Chưa rõ'}</td>
                    <td className="qt-cot-so">{so(tb._count)}</td>
                    <td className="qt-cot-so">{pct(tb._count, tongPhienThietBi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="qt-the qt-the-cuon">
        <h2>20 sự kiện gần nhất</h2>
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Hành vi</th>
              <th>Đường dẫn</th>
              <th>Mã khách</th>
              <th>Thiết bị</th>
            </tr>
          </thead>
          <tbody>
            {data.recentEvents.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: 'var(--muted)' }}>
                  Chưa ghi nhận sự kiện nào.
                </td>
              </tr>
            )}
            {data.recentEvents.map((e: {
              id?: string;
              createdAt: Date | string;
              eventType: string;
              path: string;
              session?: {
                visitorId?: string | null;
                deviceType?: string | null;
                browser?: string | null;
                os?: string | null;
              } | null;
            }, idx: number) => {
              const thongTinThietBi = [e.session?.deviceType, e.session?.browser, e.session?.os]
                .filter(Boolean)
                .join(' · ');
              return (
                <tr key={e.id ?? `evt-${idx}`}>
                  <td style={{ whiteSpace: 'nowrap' }}>{dinhDangThoiGian(e.createdAt)}</td>
                  <td>
                    <span className={`qt-nhan ${lopHanhVi(e.eventType)}`}>{e.eventType}</span>
                  </td>
                  <td style={{ wordBreak: 'break-word' }}>{e.path}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <code>{rutGonVisitorId(e.session?.visitorId)}</code>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{thongTinThietBi || '–'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

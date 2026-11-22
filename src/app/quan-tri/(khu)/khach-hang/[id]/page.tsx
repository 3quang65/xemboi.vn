import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';
import { getCustomerDetail } from '@/lib/crm/customer-service';
import ThongBao from '../../seo/ThongBao';
import { suaKhachHang } from '../hanh-dong';

export const metadata: Metadata = { title: 'Chi tiết khách hàng' };
export const dynamic = 'force-dynamic';

type LunarInfo = {
  canChiYear?: string;
  canChiMonth?: string;
  canChiDay?: string;
  canChiHour?: string;
  banMenh?: string;
  cucName?: string;
  gioDiaChi?: string;
};

function dinhDangNgayGio(gt: Date | string | null | undefined): string {
  if (!gt) return '–';
  const d = gt instanceof Date ? gt : new Date(gt);
  if (Number.isNaN(d.getTime())) return '–';
  return d.toLocaleString('vi-VN');
}

function dinhDangNgay(gt: Date | string | null | undefined): string {
  if (!gt) return '–';
  const d = gt instanceof Date ? gt : new Date(gt);
  if (Number.isNaN(d.getTime())) return '–';
  return d.toLocaleDateString('vi-VN');
}

export default async function TrangChiTietKhachHang({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bao?: string; loi?: string }>;
}) {
  const nd = await yeuCauQuyen('khach_hang.xem');
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const customer = await getCustomerDetail(id);

  if (!customer) {
    return (
      <>
        <p className="qt-phu">
          <Link href="/quan-tri/khach-hang">← Danh sách khách hàng</Link>
        </p>
        <div className="qt-the">
          <h1>Không tìm thấy khách hàng</h1>
          <p className="qt-phu" style={{ marginBottom: 0 }}>
            Hồ sơ mã <code>{id}</code> không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </>
    );
  }

  await ghiNhatKy(prisma, nd, 'khach_hang.xem_chi_tiet', 'CustomerProfile', id);

  const laDuPhong = 'fallback' in customer && Boolean(customer.fallback);
  const am = (customer.lunarBirthInfo ?? null) as LunarInfo | null;
  const tags: string[] = Array.isArray(customer.tags) ? customer.tags : [];
  const chartIds: string[] = Array.isArray(customer.chartIds) ? customer.chartIds : [];
  const sessions = Array.isArray(customer.sessions) ? customer.sessions : [];
  const conversations = Array.isArray(customer.conversations) ? customer.conversations : [];

  return (
    <>
      <p className="qt-phu" style={{ marginBottom: 8 }}>
        <Link href="/quan-tri/khach-hang">← Danh sách khách hàng</Link>
      </p>
      <div className="qt-dau-trang">
        <div>
          <h1>{customer.fullName || 'Khách vãng lai'}</h1>
          <p className="qt-phu" style={{ marginBottom: 0 }}>
            Mã hồ sơ: <code>{customer.id}</code> · Tạo lúc {dinhDangNgayGio(customer.createdAt)} · Cập nhật {dinhDangNgayGio(customer.updatedAt)}
          </p>
        </div>
      </div>

      <ThongBao bao={sp.bao} loi={sp.loi} />

      {laDuPhong && (
        <div className="qt-bao" role="status">
          Đây là hồ sơ mẫu trong bộ nhớ dự phòng, không lưu trong PostgreSQL nên không thể sửa bằng biểu mẫu dưới đây.
        </div>
      )}

      <div className="qt-kh-luoi">
        <div className="qt-the" style={{ marginBottom: 0 }}>
          <h2>Thông tin liên hệ &amp; bản mệnh</h2>
          <table className="qt-bang-ct">
            <tbody>
              <tr>
                <th>Số điện thoại</th>
                <td>{customer.phone || '–'}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{customer.email || '–'}</td>
              </tr>
              <tr>
                <th>Zalo ID</th>
                <td>{customer.zaloId || '–'}</td>
              </tr>
              <tr>
                <th>Visitor ID</th>
                <td>
                  <code>{customer.visitorId || '–'}</code>
                </td>
              </tr>
              <tr>
                <th>Giới tính</th>
                <td>{customer.gender === 'NU' ? 'Nữ' : customer.gender === 'NAM' ? 'Nam' : '–'}</td>
              </tr>
              <tr>
                <th>Ngày sinh dương</th>
                <td>{dinhDangNgay(customer.solarBirthDate)}</td>
              </tr>
              <tr>
                <th>Bản mệnh</th>
                <td>
                  <b>{am?.banMenh || '–'}</b>
                </td>
              </tr>
              <tr>
                <th>Can Chi</th>
                <td>
                  {[am?.canChiYear, am?.canChiMonth, am?.canChiDay, am?.canChiHour].filter(Boolean).join(' · ') || '–'}
                </td>
              </tr>
              <tr>
                <th>Cục / Giờ địa chi</th>
                <td>{[am?.cucName, am?.gioDiaChi].filter(Boolean).join(' · ') || '–'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="qt-the" style={{ marginBottom: 0 }}>
          <h2>Chỉnh sửa nhãn, ghi chú, điểm tiềm năng</h2>
          <form action={suaKhachHang} style={{ display: 'grid', gap: 12 }}>
            <input type="hidden" name="id" value={customer.id} />

            <label className="qt-tl-truong">
              <span>Điểm tiềm năng (0–100)</span>
              <input
                className="qt-o"
                type="number"
                name="leadScore"
                min={0}
                max={100}
                step={1}
                defaultValue={customer.leadScore ?? 0}
                required
                style={{ width: 120 }}
              />
            </label>

            <label className="qt-tl-truong">
              <span>Nhãn (phân cách bằng dấu phẩy hoặc xuống dòng)</span>
              <input
                className="qt-o"
                type="text"
                name="tags"
                defaultValue={tags.join(', ')}
                placeholder="VD: VIP, Đã lập lá số, Cần tư vấn"
              />
              {tags.length > 0 && (
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                  {tags.map((t) => (
                    <span key={t} className="qt-nhan">
                      {t}
                    </span>
                  ))}
                </span>
              )}
            </label>

            <label className="qt-tl-truong">
              <span>Ghi chú quản trị</span>
              <textarea
                className="qt-o qt-nd-o"
                name="adminNotes"
                rows={5}
                defaultValue={customer.adminNotes ?? ''}
                placeholder="Ghi chú nhu cầu khách hàng, lưu ý tư vấn…"
              />
            </label>

            <div>
              <button className="qt-nut" type="submit" disabled={laDuPhong}>
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="qt-the">
        <h2>Lá số đã lập ({chartIds.length})</h2>
        {chartIds.length === 0 ? (
          <p className="qt-phu" style={{ marginBottom: 0 }}>
            Chưa có lá số nào gắn với khách hàng này.
          </p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
            {chartIds.map((cid) => (
              <li key={cid}>
                {/* Trang /la-so/{id} của v1 đã gỡ; chỉ hiện mã lá số. */}
                <code>{cid}</code>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="qt-kh-luoi">
        <div className="qt-the" style={{ marginBottom: 0 }}>
          <h2>Phiên truy cập gần nhất ({sessions.length})</h2>
          {sessions.length === 0 ? (
            <p className="qt-phu" style={{ marginBottom: 0 }}>
              Chưa có phiên truy cập nào.
            </p>
          ) : (
            <table className="qt-bang">
              <thead>
                <tr>
                  <th>Bắt đầu</th>
                  <th>Thiết bị</th>
                  <th className="qt-cot-so">Sự kiện</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s: {
                  id: string;
                  startedAt: Date | string;
                  deviceType?: string | null;
                  browser?: string | null;
                  events?: unknown[];
                }) => (
                  <tr key={s.id}>
                    <td>{dinhDangNgayGio(s.startedAt)}</td>
                    <td>{[s.deviceType, s.browser].filter(Boolean).join(' · ') || '–'}</td>
                    <td className="qt-cot-so">{Array.isArray(s.events) ? s.events.length : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="qt-the" style={{ marginBottom: 0 }}>
          <h2>Hội thoại gần nhất ({conversations.length})</h2>
          {conversations.length === 0 ? (
            <p className="qt-phu" style={{ marginBottom: 0 }}>
              Chưa có cuộc hội thoại nào.
            </p>
          ) : (
            <table className="qt-bang">
              <thead>
                <tr>
                  <th>Mã / Tiêu đề</th>
                  <th>Trạng thái</th>
                  <th className="qt-cot-so">Tin nhắn</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((cv: {
                  id: string;
                  title?: string | null;
                  status?: string;
                  summary?: string | null;
                  messages?: unknown[];
                }) => (
                  <tr key={cv.id}>
                    <td>
                      <div>{cv.title || cv.id}</div>
                      {cv.summary && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{cv.summary}</div>}
                    </td>
                    <td>
                      <span className="qt-nhan">{cv.status || '–'}</span>
                    </td>
                    <td className="qt-cot-so">{Array.isArray(cv.messages) ? cv.messages.length : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { listCustomers } from '@/lib/crm/customer-service';
import ThongBao, { so } from '../seo/ThongBao';

export const metadata: Metadata = { title: 'Khách hàng' };
export const dynamic = 'force-dynamic';

const GIOI_HAN = 50;

type Tham = {
  search?: string;
  q?: string;
  tag?: string;
  page?: string;
  bao?: string;
  loi?: string;
};

/** Che số điện thoại ở danh sách: giữ 2 ký tự đầu và 2 ký tự cuối, ví dụ 09******12. */
function cheSdt(phone: string | null | undefined): string {
  const s = (phone ?? '').trim();
  if (!s) return '–';
  if (s.length <= 4) return '*'.repeat(s.length);
  return `${s.slice(0, 2)}${'*'.repeat(Math.max(4, s.length - 4))}${s.slice(-2)}`;
}

/** Che email ở danh sách: giữ tối đa 2 ký tự đầu trước @, ví dụ ng***@gmail.com. */
function cheEmail(email: string | null | undefined): string {
  const s = (email ?? '').trim();
  if (!s) return '–';
  const at = s.indexOf('@');
  if (at <= 0) return `${s.slice(0, 2)}***`;
  const phanTen = s.slice(0, at);
  const mien = s.slice(at);
  const dau = phanTen.length <= 2 ? phanTen.slice(0, 1) : phanTen.slice(0, 2);
  return `${dau}***${mien}`;
}

export default async function TrangKhachHang({ searchParams }: { searchParams: Promise<Tham> }) {
  await yeuCauQuyen('khach_hang.xem');

  const sp = await searchParams;
  const search = (sp.search ?? sp.q ?? '').trim() || undefined;
  const tag = sp.tag?.trim() || undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const [kq, tagRows] = await Promise.all([
    listCustomers({ page, limit: GIOI_HAN, search, tag }),
    prisma.customerProfile
      .findMany({ select: { tags: true }, take: 500 })
      .catch(() => [] as { tags: string[] }[]),
  ]);

  const tatCaNhan = [...new Set(tagRows.flatMap((r) => r.tags ?? []))].sort((a, b) => a.localeCompare(b, 'vi'));
  const laDuPhong = 'fallback' in kq && Boolean(kq.fallback);
  const soTrang = Math.max(1, kq.totalPages || 1);

  const qs = (thay: Partial<Tham>) => {
    const u = new URLSearchParams();
    const gop: Record<string, string | undefined> = { search, tag, page: String(page), ...thay };
    for (const [k, v] of Object.entries(gop)) {
      if (v) u.set(k, v);
    }
    const s = u.toString();
    return s ? `?${s}` : '';
  };

  return (
    <>
      <h1>Khách hàng</h1>
      <p className="qt-phu">
        Danh sách hồ sơ khách hàng tương tác (đã che số điện thoại và email). Mở chi tiết từng hồ sơ để xem đầy đủ liên hệ và ghi chú.
      </p>
      <ThongBao bao={sp.bao} loi={sp.loi} />

      {laDuPhong && (
        <div className="qt-bao" role="status">
          Không truy vấn được bảng khách hàng từ cơ sở dữ liệu; đang hiển thị danh sách mẫu trong bộ nhớ.
        </div>
      )}

      <form className="qt-loc" method="get">
        <input
          className="qt-o"
          name="search"
          defaultValue={search ?? ''}
          placeholder="Tìm họ tên, SĐT, email…"
          style={{ minWidth: 240 }}
        />
        <input
          className="qt-o"
          name="tag"
          defaultValue={tag ?? ''}
          list="ds-nhan-khach-hang"
          placeholder="Lọc theo nhãn"
          style={{ minWidth: 180 }}
        />
        <datalist id="ds-nhan-khach-hang">
          {tatCaNhan.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
        <button className="qt-nut" type="submit">
          Lọc
        </button>
        <Link className="qt-nut phu" href="/quan-tri/khach-hang">
          Xóa lọc
        </Link>
      </form>

      <p className="qt-phu" style={{ marginBottom: 8 }}>
        Tổng khớp bộ lọc: <b>{so(kq.total)}</b> hồ sơ (trang {page}/{soTrang}).
      </p>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Liên hệ (đã che)</th>
              <th>Bản mệnh</th>
              <th className="qt-cot-so">Điểm</th>
              <th>Nhãn</th>
              <th className="qt-cot-so">Phiên / Hội thoại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {kq.items.length === 0 && (
              <tr>
                <td colSpan={7} style={{ color: 'var(--muted)' }}>
                  Không có hồ sơ khách hàng nào khớp bộ lọc.
                </td>
              </tr>
            )}
            {kq.items.map((c: {
              id: string;
              fullName?: string | null;
              gender?: string | null;
              phone?: string | null;
              email?: string | null;
              lunarBirthInfo?: { banMenh?: string; canChiYear?: string } | null;
              leadScore: number;
              tags?: string[];
              createdAt: Date | string;
              _count?: { sessions?: number; conversations?: number };
            }) => {
              const ngayTao = new Date(c.createdAt).toLocaleDateString('vi-VN');
              return (
                <tr key={c.id}>
                  <td>
                    <Link href={`/quan-tri/khach-hang/${c.id}`}>
                      <b>{c.fullName || 'Khách vãng lai'}</b>
                    </Link>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {c.gender === 'NU' ? 'Nữ' : c.gender === 'NAM' ? 'Nam' : 'Chưa rõ'} · {ngayTao}
                    </div>
                  </td>
                  <td>
                    <div>{cheSdt(c.phone)}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{cheEmail(c.email)}</div>
                  </td>
                  <td>
                    <div>{c.lunarBirthInfo?.banMenh || '–'}</div>
                    {c.lunarBirthInfo?.canChiYear && (
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Tuổi {c.lunarBirthInfo.canChiYear}</div>
                    )}
                  </td>
                  <td className="qt-cot-so">
                    <span className={`qt-nhan ${c.leadScore >= 50 ? 'tot' : c.leadScore >= 20 ? 'vua' : ''}`}>
                      {c.leadScore}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {(c.tags ?? []).length === 0 ? (
                        <span style={{ color: 'var(--muted)' }}>–</span>
                      ) : (
                        (c.tags ?? []).slice(0, 4).map((t) => (
                          <span key={t} className="qt-nhan">
                            {t}
                          </span>
                        ))
                      )}
                      {(c.tags ?? []).length > 4 && (
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>+{(c.tags ?? []).length - 4}</span>
                      )}
                    </div>
                  </td>
                  <td className="qt-cot-so" style={{ whiteSpace: 'nowrap' }}>
                    {so(c._count?.sessions ?? 0)} / {so(c._count?.conversations ?? 0)}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link className="qt-nut phu" href={`/quan-tri/khach-hang/${c.id}`}>
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="qt-loc">
        {page > 1 && (
          <Link className="qt-nut phu" href={`/quan-tri/khach-hang${qs({ page: String(page - 1) })}`}>
            ← Trước
          </Link>
        )}
        <span>
          Trang {page}/{soTrang}
        </span>
        {page < soTrang && (
          <Link className="qt-nut phu" href={`/quan-tri/khach-hang${qs({ page: String(page + 1) })}`}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}

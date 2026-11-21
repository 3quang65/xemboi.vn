import type { Metadata } from 'next';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import BangNhatKy, { type DongNhatKy } from './BangNhatKy';

export const metadata: Metadata = { title: 'Nhật ký thao tác' };
export const dynamic = 'force-dynamic';

const CO = 100;

type Tham = {
  hanhDong?: string;
  taiKhoanId?: string;
  doiTuong?: string;
  tuNgay?: string;
  denNgay?: string;
  p?: string;
};

function phanTichNgayDau(s: string | undefined): Date | null {
  if (!s) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function phanTichNgayCuoi(s: string | undefined): Date | null {
  if (!s) return null;
  const d = new Date(`${s}T23:59:59.999`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default async function TrangNhatKy({ searchParams }: { searchParams: Promise<Tham> }) {
  await yeuCauQuyen('nhat_ky.xem');
  const sp = await searchParams;
  const p = Math.max(1, Number(sp.p) || 1);

  const boLoc: Prisma.NhatKyThaoTacWhereInput[] = [];
  if (sp.hanhDong?.trim()) {
    boLoc.push({ hanhDong: { startsWith: sp.hanhDong.trim() } });
  }
  if (sp.taiKhoanId === '__HE_THONG__') {
    boLoc.push({ taiKhoanId: null });
  } else if (sp.taiKhoanId?.trim()) {
    boLoc.push({ taiKhoanId: sp.taiKhoanId.trim() });
  }
  if (sp.doiTuong?.trim()) {
    boLoc.push({ doiTuong: sp.doiTuong.trim() });
  }

  const tu = phanTichNgayDau(sp.tuNgay);
  const den = phanTichNgayCuoi(sp.denNgay);
  if (tu || den) {
    boLoc.push({
      luc: {
        ...(tu ? { gte: tu } : {}),
        ...(den ? { lte: den } : {}),
      },
    });
  }

  const where: Prisma.NhatKyThaoTacWhereInput = boLoc.length ? { AND: boLoc } : {};

  const [dsTk, dsDoiTuongRaw, tong, ds] = await Promise.all([
    prisma.taiKhoan.findMany({ orderBy: { email: 'asc' }, select: { id: true, email: true, hoTen: true } }),
    prisma.nhatKyThaoTac.findMany({ distinct: ['doiTuong'], orderBy: { doiTuong: 'asc' }, select: { doiTuong: true } }),
    prisma.nhatKyThaoTac.count({ where }),
    prisma.nhatKyThaoTac.findMany({
      where,
      orderBy: [{ luc: 'desc' }, { id: 'desc' }],
      skip: (p - 1) * CO,
      take: CO,
      include: {
        taiKhoan: { select: { email: true, hoTen: true } },
      },
    }),
  ]);

  const dong: DongNhatKy[] = ds.map((r) => ({
    id: String(r.id),
    luc: r.luc.toLocaleString('vi-VN'),
    email: r.taiKhoan?.email ?? null,
    hoTen: r.taiKhoan?.hoTen ?? null,
    hanhDong: r.hanhDong,
    doiTuong: r.doiTuong,
    doiTuongId: r.doiTuongId,
    ip: r.ip,
    truoc: r.truoc,
    sau: r.sau,
  }));

  const soTrang = Math.max(1, Math.ceil(tong / CO));
  const qs = (thay: Partial<Tham>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...thay })) {
      if (v) u.set(k, String(v));
    }
    const s = u.toString();
    return s ? `?${s}` : '';
  };

  return (
    <>
      <h1>Nhật ký thao tác</h1>
      <p className="qt-phu">
        Chỉ đọc · mới nhất trước · {CO} dòng/trang · tổng khớp bộ lọc: <b>{tong.toLocaleString('vi-VN')}</b>. Bấm một dòng để xem JSON trước/sau.
      </p>

      <form className="qt-loc" method="get">
        <input
          className="qt-o"
          name="hanhDong"
          defaultValue={sp.hanhDong}
          placeholder="Tiền tố hành động (vd: nd., seo.)"
        />
        <select className="qt-o" name="taiKhoanId" defaultValue={sp.taiKhoanId ?? ''}>
          <option value="">Mọi tài khoản</option>
          <option value="__HE_THONG__">(Hệ thống)</option>
          {dsTk.map((t) => (
            <option key={t.id} value={t.id}>
              {t.email} ({t.hoTen})
            </option>
          ))}
        </select>
        <select className="qt-o" name="doiTuong" defaultValue={sp.doiTuong ?? ''}>
          <option value="">Mọi đối tượng</option>
          {dsDoiTuongRaw.map((d) => (
            <option key={d.doiTuong} value={d.doiTuong}>
              {d.doiTuong}
            </option>
          ))}
        </select>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Từ
          <input className="qt-o" type="date" name="tuNgay" defaultValue={sp.tuNgay} />
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Đến
          <input className="qt-o" type="date" name="denNgay" defaultValue={sp.denNgay} />
        </label>
        <button className="qt-nut" type="submit">
          Lọc
        </button>
        <Link className="qt-nut phu" href="/quan-tri/nhat-ky">
          Xóa lọc
        </Link>
      </form>

      <BangNhatKy ds={dong} />

      <div className="qt-loc">
        {p > 1 && (
          <Link className="qt-nut phu" href={`/quan-tri/nhat-ky${qs({ p: String(p - 1) })}`}>
            ← Trước
          </Link>
        )}
        <span>
          Trang {p}/{soTrang}
        </span>
        {p < soTrang && (
          <Link className="qt-nut phu" href={`/quan-tri/nhat-ky${qs({ p: String(p + 1) })}`}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}

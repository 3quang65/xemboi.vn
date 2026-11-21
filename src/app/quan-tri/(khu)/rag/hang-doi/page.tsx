import type { Metadata } from 'next';
import Link from 'next/link';
import type { LoaiViecRag, NoiChay, Prisma, TrangThaiViec } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { phanTichInt } from '@/lib/rag/pham-vi';
import { chayLaiViec, huyViec } from '../hanh-dong';
import {
  catVanBan,
  ngayGio,
  nhanTrangThaiViec,
  so,
  TEN_LOAI_VIEC,
  TEN_NOI_CHAY,
  TEN_TRANG_THAI_VIEC,
  ThongBao,
} from '../HienThi';

export const metadata: Metadata = { title: 'Hàng đợi xử lý RAG' };
export const dynamic = 'force-dynamic';

const CO = 50;
const TRANG_THAI_HOP_LE = new Set<string>(['CHO', 'DANG_CHAY', 'XONG', 'LOI', 'HUY']);
const NOI_CHAY_HOP_LE = new Set<string>(['MAY_TRAM', 'VPS']);
const LOAI_VIEC_HOP_LE = new Set<string>(Object.keys(TEN_LOAI_VIEC));

type Tham = {
  tt?: string;
  loai?: string;
  noiChay?: string;
  nguonId?: string;
  p?: string;
  bao?: string;
  loi?: string;
};

export default async function HangDoiRag({ searchParams }: { searchParams: Promise<Tham> }) {
  await yeuCauQuyen('rag.quan_ly_nguon');
  const sp = await searchParams;
  const p = Math.max(1, Number(sp.p) || 1);
  const nguonId = phanTichInt(sp.nguonId);

  const where: Prisma.RagViecWhereInput = {};
  if (sp.tt && TRANG_THAI_HOP_LE.has(sp.tt)) where.trangThai = sp.tt as TrangThaiViec;
  if (sp.loai && LOAI_VIEC_HOP_LE.has(sp.loai)) where.loai = sp.loai as LoaiViecRag;
  if (sp.noiChay && NOI_CHAY_HOP_LE.has(sp.noiChay)) where.noiChay = sp.noiChay as NoiChay;
  if (nguonId !== null) where.nguonId = nguonId;

  const [nhomTrangThai, mayXuLy, dsNguon, tongLoc, dsViec] = await Promise.all([
    prisma.ragViec.groupBy({ by: ['trangThai'], _count: true }),
    prisma.ragMayXuLy.findMany({ orderBy: { nhipTimLuc: 'desc' } }),
    prisma.ragNguon.findMany({
      orderBy: { ma: 'asc' },
      select: { id: true, ma: true, tenGoc: true },
    }),
    prisma.ragViec.count({ where }),
    prisma.ragViec.findMany({
      where,
      orderBy: [{ taoLuc: 'desc' }, { id: 'desc' }],
      skip: (p - 1) * CO,
      take: CO,
      include: { tep: { select: { duongDan: true } } },
    }),
  ]);

  const demTheoTt: Record<string, number> = { CHO: 0, DANG_CHAY: 0, XONG: 0, LOI: 0, HUY: 0 };
  let tongViec = 0;
  for (const r of nhomTrangThai) {
    demTheoTt[r.trangThai] = r._count;
    tongViec += r._count;
  }

  const mapNguon = new Map(dsNguon.map((n) => [n.id, n]));
  const soTrang = Math.max(1, Math.ceil(tongLoc / CO));
  const qs = (thay: Partial<Tham>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, bao: undefined, loi: undefined, ...thay })) {
      if (v) u.set(k, String(v));
    }
    const s = u.toString();
    return s ? `?${s}` : '';
  };
  const quayVe = '/quan-tri/rag/hang-doi' + qs({});

  return (
    <>
      <h1>Hàng đợi xử lý RAG</h1>
      <p className="qt-phu">
        Theo dõi các bước xử lý tài liệu trên máy trạm và máy chủ. Chỉ người quản lý nguồn mới vào được trang này.
      </p>

      <ThongBao bao={sp.bao} loi={sp.loi} />

      <div className="qt-luoi">
        <Link href="/quan-tri/rag/hang-doi" className="qt-so" style={{ color: 'inherit', textDecoration: 'none' }}>
          <div className="qt-so-nhan">Tổng việc</div>
          <div className="qt-so-gt">{so(tongViec)}</div>
        </Link>
        {(['CHO', 'DANG_CHAY', 'XONG', 'LOI', 'HUY'] as const).map((tt) => (
          <Link
            key={tt}
            href={`/quan-tri/rag/hang-doi${qs({ tt, p: undefined })}`}
            className="qt-so"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <div className="qt-so-nhan">{TEN_TRANG_THAI_VIEC[tt]}</div>
            <div className="qt-so-gt">{so(demTheoTt[tt] ?? 0)}</div>
          </Link>
        ))}
      </div>

      {mayXuLy.length > 0 && (
        <div className="qt-the">
          <h2>Máy xử lý đã ghi nhận</h2>
          <table className="qt-bang">
            <thead>
              <tr>
                <th>Mã máy</th>
                <th>Nơi chạy</th>
                <th>Mô tả</th>
                <th>Nhịp tim gần nhất</th>
              </tr>
            </thead>
            <tbody>
              {mayXuLy.map((m) => (
                <tr key={m.id}>
                  <td><b>{m.id}</b></td>
                  <td>{TEN_NOI_CHAY[m.noiChay] ?? m.noiChay}</td>
                  <td>{m.moTa ?? '–'}</td>
                  <td>{ngayGio(m.nhipTimLuc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form className="qt-loc" method="get">
        <select className="qt-o" name="tt" defaultValue={sp.tt ?? ''}>
          <option value="">Mọi trạng thái</option>
          {Object.entries(TEN_TRANG_THAI_VIEC).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="qt-o" name="loai" defaultValue={sp.loai ?? ''}>
          <option value="">Mọi bước xử lý</option>
          {Object.entries(TEN_LOAI_VIEC).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="qt-o" name="noiChay" defaultValue={sp.noiChay ?? ''}>
          <option value="">Mọi nơi chạy</option>
          {Object.entries(TEN_NOI_CHAY).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="qt-o" name="nguonId" defaultValue={sp.nguonId ?? ''} style={{ maxWidth: 240 }}>
          <option value="">Mọi nguồn</option>
          {dsNguon.map((n) => (
            <option key={n.id} value={n.id}>{n.ma} · {n.tenGoc}</option>
          ))}
        </select>
        <button className="qt-nut" type="submit">Lọc</button>
        <Link className="qt-nut phu" href="/quan-tri/rag/hang-doi">Xóa lọc</Link>
      </form>

      <p className="qt-phu" style={{ marginBottom: 8 }}>
        Khớp bộ lọc: <b>{so(tongLoc)}</b> việc (trang {p}/{soTrang}).
      </p>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Bước</th>
              <th>Nơi chạy</th>
              <th>Nguồn / Tệp</th>
              <th>Trạng thái</th>
              <th className="qt-cot-so">Số lần thử</th>
              <th>Máy nhận</th>
              <th>Lỗi / Kết quả</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {dsViec.length === 0 && (
              <tr>
                <td colSpan={10} style={{ color: 'var(--muted)' }}>
                  Không có việc nào khớp bộ lọc.
                </td>
              </tr>
            )}
            {dsViec.map((v) => {
              const nguon = v.nguonId != null ? mapNguon.get(v.nguonId) : undefined;
              return (
                <tr key={String(v.id)}>
                  <td style={{ whiteSpace: 'nowrap' }}>#{String(v.id)}</td>
                  <td>{TEN_LOAI_VIEC[v.loai] ?? v.loai}</td>
                  <td>{TEN_NOI_CHAY[v.noiChay] ?? v.noiChay}</td>
                  <td>
                    {nguon ? (
                      <Link href={`/quan-tri/rag/nguon/${nguon.id}`}><b>{nguon.ma}</b></Link>
                    ) : v.nguonId != null ? `Nguồn #${v.nguonId}` : '–'}
                    {v.tep?.duongDan && (
                      <div style={{ color: 'var(--muted)', fontSize: 11 }}>{v.tep.duongDan}</div>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{nhanTrangThaiViec(v.trangThai)}</td>
                  <td className="qt-cot-so">{v.soLanThu}/{v.toiDaThu}</td>
                  <td>{v.nhanBoi ?? '–'}</td>
                  <td style={{ maxWidth: 260, fontSize: 12 }}>
                    {v.loi ? (
                      <span style={{ color: 'var(--bad)' }}>{catVanBan(v.loi, 180)}</span>
                    ) : v.ketQua ? (
                      JSON.stringify(v.ketQua)
                    ) : '–'}
                  </td>
                  <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                    {ngayGio(v.ketThucLuc ?? v.batDauLuc ?? v.taoLuc)}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {v.trangThai === 'LOI' && (
                      <form action={chayLaiViec} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={String(v.id)} />
                        <input type="hidden" name="quayVe" value={quayVe} />
                        <button className="qt-nut phu" type="submit" style={{ padding: '3px 8px' }}>
                          Chạy lại
                        </button>
                      </form>
                    )}
                    {(v.trangThai === 'CHO' || v.trangThai === 'DANG_CHAY') && (
                      <form action={huyViec} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={String(v.id)} />
                        <input type="hidden" name="quayVe" value={quayVe} />
                        <button className="qt-nut phu" type="submit" style={{ padding: '3px 8px' }}>
                          Hủy
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="qt-loc">
        {p > 1 && (
          <Link className="qt-nut phu" href={`/quan-tri/rag/hang-doi${qs({ p: String(p - 1) })}`}>
            ← Trước
          </Link>
        )}
        <span>Trang {p}/{soTrang}</span>
        {p < soTrang && (
          <Link className="qt-nut phu" href={`/quan-tri/rag/hang-doi${qs({ p: String(p + 1) })}`}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}

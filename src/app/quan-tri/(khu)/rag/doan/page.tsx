import type { Metadata } from 'next';
import Link from 'next/link';
import type { PhamVi, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { dieuKienPhamVi, duocXemNoiBo, phanTichInt, sqlPhamVi } from '@/lib/rag/pham-vi';
import {
  catVanBan,
  nhanLoaiDoan,
  nhanPhamVi,
  so,
  TEN_LOAI_DOAN,
} from '../HienThi';

export const metadata: Metadata = { title: 'Trình duyệt đoạn RAG' };
export const dynamic = 'force-dynamic';

const CO = 50;
const LOAI_DOAN_HOP_LE = new Set<string>(Object.keys(TEN_LOAI_DOAN));

type Tham = {
  q?: string;
  nguonId?: string;
  loai?: string;
  daSoat?: string;
  phamVi?: string;
  p?: string;
};

export default async function TrinhDuyetDoan({ searchParams }: { searchParams: Promise<Tham> }) {
  const nd = await yeuCauQuyen('rag.xem_cong_khai');
  const sp = await searchParams;
  const xemNoiBo = duocXemNoiBo(nd);
  const dkPhamVi = dieuKienPhamVi(nd);
  const p = Math.max(1, Number(sp.p) || 1);
  const nguonId = phanTichInt(sp.nguonId);

  const boLoc: Prisma.RagDoanWhereInput[] = [dkPhamVi];
  if (sp.q?.trim()) {
    const q = sp.q.trim();
    boLoc.push({
      OR: [
        { vanBan: { contains: q, mode: 'insensitive' } },
        { vanBanChuan: { contains: q, mode: 'insensitive' } },
        { hanViet: { contains: q, mode: 'insensitive' } },
        { dichVi: { contains: q, mode: 'insensitive' } },
      ],
    });
  }
  if (nguonId !== null) boLoc.push({ nguonId });
  if (sp.loai && LOAI_DOAN_HOP_LE.has(sp.loai)) boLoc.push({ loai: sp.loai });
  if (sp.daSoat === '1') boLoc.push({ daSoat: true });
  else if (sp.daSoat === '0') boLoc.push({ daSoat: false });

  if (sp.phamVi === 'CONG_KHAI' || (xemNoiBo && sp.phamVi === 'NOI_BO')) {
    boLoc.push({ phamVi: sp.phamVi as PhamVi });
  } else if (sp.phamVi === 'NOI_BO' && !xemNoiBo) {
    boLoc.push({ phamVi: 'NOI_BO' });
  }

  const where: Prisma.RagDoanWhereInput = { AND: boLoc };

  const [dsNguon, tong, ds] = await Promise.all([
    prisma.ragNguon.findMany({
      where: dkPhamVi,
      orderBy: { ma: 'asc' },
      select: { id: true, ma: true, tenGoc: true },
    }),
    prisma.ragDoan.count({ where }),
    prisma.ragDoan.findMany({
      where,
      orderBy: [{ nguonId: 'asc' }, { thuTu: 'asc' }, { id: 'asc' }],
      skip: (p - 1) * CO,
      take: CO,
      select: {
        id: true,
        nguonId: true,
        thuTu: true,
        duongDan: true,
        loai: true,
        vanBan: true,
        hanViet: true,
        dichVi: true,
        phamVi: true,
        daSoat: true,
        nguon: { select: { ma: true, tenGoc: true } },
      },
    }),
  ]);

  const ids = ds.map((d) => String(d.id));
  const coVecRows = ids.length
    ? await prisma.$queryRaw<{ id: bigint }[]>`
        SELECT d.id
        FROM rag_doan d
        WHERE d.id = ANY(${ids}::bigint[])
          AND d.embedding IS NOT NULL
          AND ${sqlPhamVi(nd, 'd')}
      `
    : [];
  const tapCoVec = new Set(coVecRows.map((r) => String(r.id)));

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
      <h1>Trình duyệt đoạn RAG</h1>
      <p className="qt-phu">
        Mỗi trang hiện tối đa {CO} đoạn. Tổng khớp bộ lọc: <b>{so(tong)}</b> đoạn.
        {!xemNoiBo && ' Chỉ hiển thị đoạn ở phạm vi Công khai.'}
      </p>

      <form className="qt-loc" method="get">
        <input
          className="qt-o"
          name="q"
          defaultValue={sp.q}
          placeholder="Tìm chữ trong văn bản, Hán Việt, bản dịch"
          style={{ minWidth: 240 }}
        />
        <select className="qt-o" name="nguonId" defaultValue={sp.nguonId ?? ''} style={{ maxWidth: 260 }}>
          <option value="">Mọi nguồn</option>
          {dsNguon.map((n) => (
            <option key={n.id} value={n.id}>{n.ma} · {n.tenGoc}</option>
          ))}
        </select>
        <select className="qt-o" name="loai" defaultValue={sp.loai ?? ''}>
          <option value="">Mọi loại đoạn</option>
          {Object.entries(TEN_LOAI_DOAN).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="qt-o" name="daSoat" defaultValue={sp.daSoat ?? ''}>
          <option value="">Mọi trạng thái soát</option>
          <option value="1">Đã soát</option>
          <option value="0">Chưa soát</option>
        </select>
        {xemNoiBo && (
          <select className="qt-o" name="phamVi" defaultValue={sp.phamVi ?? ''}>
            <option value="">Mọi phạm vi</option>
            <option value="CONG_KHAI">Công khai</option>
            <option value="NOI_BO">Nội bộ</option>
          </select>
        )}
        <button className="qt-nut" type="submit">Lọc</button>
        <Link className="qt-nut phu" href="/quan-tri/rag/doan">Xóa lọc</Link>
      </form>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Mã / Nguồn</th>
              <th>Đường dẫn &amp; loại</th>
              <th>Văn bản (400 ký tự đầu)</th>
              <th>Phạm vi</th>
              <th>Vector / Soát</th>
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: 'var(--muted)' }}>
                  Không có đoạn nào khớp bộ lọc.
                </td>
              </tr>
            )}
            {ds.map((d) => (
              <tr key={String(d.id)}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <div>
                    <Link href={`/quan-tri/rag/doan/${String(d.id)}`}><b>#{String(d.id)}</b></Link>
                  </div>
                  <div style={{ fontSize: 12 }}>
                    <Link href={`/quan-tri/rag/nguon/${d.nguonId}`}>{d.nguon.ma}</Link>
                  </div>
                </td>
                <td style={{ minWidth: 160 }}>
                  <div>{d.duongDan.join(' › ') || '–'}</div>
                  <div style={{ marginTop: 4 }}>{nhanLoaiDoan(d.loai)}</div>
                </td>
                <td style={{ maxWidth: 540 }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{catVanBan(d.vanBan, 400)}</div>
                  {d.hanViet && (
                    <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted)' }}>
                      <b>Hán Việt:</b> {catVanBan(d.hanViet, 220)}
                    </div>
                  )}
                  {d.dichVi && (
                    <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted)' }}>
                      <b>Dịch Việt:</b> {catVanBan(d.dichVi, 220)}
                    </div>
                  )}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{nhanPhamVi(d.phamVi)}</td>
                <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                  <div>{tapCoVec.has(String(d.id)) ? 'Có vector' : 'Chưa có vector'}</div>
                  <div style={{ color: 'var(--muted)' }}>{d.daSoat ? 'Đã soát' : 'Chưa soát'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="qt-loc">
        {p > 1 && (
          <Link className="qt-nut phu" href={`/quan-tri/rag/doan${qs({ p: String(p - 1) })}`}>
            ← Trước
          </Link>
        )}
        <span>Trang {p}/{soTrang}</span>
        {p < soTrang && (
          <Link className="qt-nut phu" href={`/quan-tri/rag/doan${qs({ p: String(p + 1) })}`}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import type { PhamVi, PhapLy, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { dieuKienPhamVi, duocXemNoiBo, sqlPhamVi } from '@/lib/rag/pham-vi';
import {
  nhanPhamVi,
  nhanPhapLy,
  nhanTrangThaiNguon,
  pct,
  so,
  TEN_TRANG_THAI_NGUON,
} from '../HienThi';

export const metadata: Metadata = { title: 'Nguồn tài liệu RAG' };
export const dynamic = 'force-dynamic';

const CO = 100;
const PHAP_LY_HOP_LE = new Set<string>(['A', 'B', 'C']);
const TRANG_THAI_HOP_LE = new Set<string>(['DANH_MUC', 'DANG_NAP', 'DA_NAP', 'TAM_DUNG', 'LOAI']);

type Tham = {
  q?: string;
  phapLy?: string;
  phamVi?: string;
  tt?: string;
  mang?: string;
  p?: string;
};

export default async function TrangNguonRag({ searchParams }: { searchParams: Promise<Tham> }) {
  const nd = await yeuCauQuyen('rag.xem_cong_khai');
  const sp = await searchParams;
  const xemNoiBo = duocXemNoiBo(nd);
  const dkPhamVi = dieuKienPhamVi(nd);
  const p = Math.max(1, Number(sp.p) || 1);

  const boLoc: Prisma.RagNguonWhereInput[] = [dkPhamVi];
  if (sp.q?.trim()) {
    const q = sp.q.trim();
    boLoc.push({
      OR: [
        { ma: { contains: q, mode: 'insensitive' } },
        { tenGoc: { contains: q, mode: 'insensitive' } },
        { tenHanViet: { contains: q, mode: 'insensitive' } },
        { tacGia: { contains: q, mode: 'insensitive' } },
      ],
    });
  }
  if (sp.phapLy && PHAP_LY_HOP_LE.has(sp.phapLy)) {
    boLoc.push({ phapLy: sp.phapLy as PhapLy });
  }
  if (sp.phamVi === 'CONG_KHAI' || (xemNoiBo && sp.phamVi === 'NOI_BO')) {
    boLoc.push({ phamVi: sp.phamVi as PhamVi });
  } else if (sp.phamVi === 'NOI_BO' && !xemNoiBo) {
    // Tài khoản không có quyền xem nội bộ lọc ?phamVi=NOI_BO sẽ không khớp bản ghi nào.
    boLoc.push({ phamVi: 'NOI_BO' });
  }
  if (sp.tt && TRANG_THAI_HOP_LE.has(sp.tt)) {
    boLoc.push({ trangThai: sp.tt });
  }
  if (sp.mang?.trim()) {
    boLoc.push({ mang: { has: sp.mang.trim() } });
  }

  const where: Prisma.RagNguonWhereInput = { AND: boLoc };

  const [
    nhomThongKe,
    tongDoanStats,
    dsMangRaw,
    demDoanTheoNguon,
    tongLoc,
    ds,
  ] = await Promise.all([
    prisma.ragNguon.groupBy({
      by: ['phapLy', 'phamVi'],
      where: dkPhamVi,
      _count: true,
    }),
    prisma.$queryRaw<{ tongDoan: bigint; coVector: bigint }[]>`
      SELECT count(*) AS "tongDoan",
             count(*) FILTER (WHERE d.embedding IS NOT NULL) AS "coVector"
      FROM rag_doan d
      WHERE ${sqlPhamVi(nd, 'd')}
    `,
    prisma.$queryRaw<{ m: string }[]>`
      SELECT DISTINCT unnest(n.mang) AS m
      FROM rag_nguon n
      WHERE ${sqlPhamVi(nd, 'n')}
      ORDER BY 1
    `,
    prisma.$queryRaw<{ nguonId: number; soDoan: bigint; coVector: bigint }[]>`
      SELECT d."nguonId" AS "nguonId",
             count(*) AS "soDoan",
             count(*) FILTER (WHERE d.embedding IS NOT NULL) AS "coVector"
      FROM rag_doan d
      WHERE ${sqlPhamVi(nd, 'd')}
      GROUP BY d."nguonId"
    `,
    prisma.ragNguon.count({ where }),
    prisma.ragNguon.findMany({
      where,
      orderBy: [{ ma: 'asc' }],
      skip: (p - 1) * CO,
      take: CO,
      select: {
        id: true,
        ma: true,
        tenGoc: true,
        tenHanViet: true,
        tacGia: true,
        mang: true,
        phapLy: true,
        phamVi: true,
        trangThai: true,
        trangThaiTai: true,
        dungLuongMb: true,
      },
    }),
  ]);

  let tongNguon = 0;
  let nguonCongKhai = 0;
  let nguonNoiBo = 0;
  const theoPhapLy: Record<string, number> = { A: 0, B: 0, C: 0 };
  for (const row of nhomThongKe) {
    tongNguon += row._count;
    theoPhapLy[row.phapLy] = (theoPhapLy[row.phapLy] ?? 0) + row._count;
    if (row.phamVi === 'CONG_KHAI') nguonCongKhai += row._count;
    else nguonNoiBo += row._count;
  }

  const tongDoan = Number(tongDoanStats[0]?.tongDoan ?? 0n);
  const tongCoVector = Number(tongDoanStats[0]?.coVector ?? 0n);

  const mapDoan = new Map<number, { soDoan: number; coVector: number }>();
  for (const r of demDoanTheoNguon) {
    mapDoan.set(r.nguonId, { soDoan: Number(r.soDoan), coVector: Number(r.coVector) });
  }

  const soTrang = Math.max(1, Math.ceil(tongLoc / CO));
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
      <h1>Nguồn tài liệu RAG</h1>
      <p className="qt-phu">
        Danh mục sách, bộ dữ liệu và trạng thái nạp vào kho tri thức.
        {!xemNoiBo && ' Tài khoản hiện chỉ được xem các nguồn ở phạm vi Công khai.'}
      </p>

      <div className="qt-luoi">
        <div className="qt-so">
          <div className="qt-so-nhan">Tổng nguồn được xem</div>
          <div className="qt-so-gt">{so(tongNguon)}</div>
          <div className="qt-so-nhan">
            {xemNoiBo ? `${so(nguonCongKhai)} công khai · ${so(nguonNoiBo)} nội bộ` : 'Chỉ phạm vi Công khai'}
          </div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Pháp lý A (mở)</div>
          <div className="qt-so-gt">{so(theoPhapLy.A)}</div>
          <div className="qt-so-nhan">Được trích công khai</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Pháp lý B (xin phép)</div>
          <div className="qt-so-gt">{so(theoPhapLy.B)}</div>
          <div className="qt-so-nhan">{xemNoiBo ? 'Mặc định nội bộ' : 'Chỉ hiện khi đã đồng ý'}</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Pháp lý C (bản quyền)</div>
          <div className="qt-so-gt">{so(theoPhapLy.C)}</div>
          <div className="qt-so-nhan">{xemNoiBo ? 'Luôn nội bộ khi chưa phép' : 'Ẩn ngoài phạm vi'}</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Tổng số đoạn</div>
          <div className="qt-so-gt">{so(tongDoan)}</div>
          <div className="qt-so-nhan">Trong phạm vi được xem</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Đoạn đã có vector</div>
          <div className="qt-so-gt">{so(tongCoVector)}</div>
          <div className="qt-so-nhan">{pct(tongCoVector, tongDoan)} tổng số đoạn</div>
        </div>
      </div>

      <form className="qt-loc" method="get">
        <input
          className="qt-o"
          name="q"
          defaultValue={sp.q}
          placeholder="Tìm mã, tên gốc, Hán Việt, tác giả"
          style={{ minWidth: 230 }}
        />
        <select className="qt-o" name="phapLy" defaultValue={sp.phapLy ?? ''}>
          <option value="">Mọi pháp lý</option>
          <option value="A">Pháp lý A</option>
          <option value="B">Pháp lý B</option>
          <option value="C">Pháp lý C</option>
        </select>
        <select className="qt-o" name="phamVi" defaultValue={sp.phamVi ?? ''}>
          <option value="">Mọi phạm vi</option>
          <option value="CONG_KHAI">Công khai</option>
          {xemNoiBo && <option value="NOI_BO">Nội bộ</option>}
        </select>
        <select className="qt-o" name="tt" defaultValue={sp.tt ?? ''}>
          <option value="">Mọi trạng thái nạp</option>
          {Object.entries(TEN_TRANG_THAI_NGUON).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="qt-o" name="mang" defaultValue={sp.mang ?? ''}>
          <option value="">Mọi mảng</option>
          {dsMangRaw.map((r) => (
            <option key={r.m} value={r.m}>{r.m}</option>
          ))}
        </select>
        <button className="qt-nut" type="submit">Lọc</button>
        <Link className="qt-nut phu" href="/quan-tri/rag/nguon">Xóa lọc</Link>
      </form>

      <p className="qt-phu" style={{ marginBottom: 8 }}>
        Khớp bộ lọc: <b>{so(tongLoc)}</b> nguồn (trang {p}/{soTrang}).
      </p>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên gốc / Hán Việt</th>
              <th>Tác giả</th>
              <th>Pháp lý</th>
              <th>Phạm vi</th>
              <th>Trạng thái</th>
              <th className="qt-cot-so">Số đoạn</th>
              <th className="qt-cot-so">Có vector</th>
              <th>Trạng thái tải</th>
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 && (
              <tr>
                <td colSpan={9} style={{ color: 'var(--muted)' }}>
                  Không có nguồn nào khớp bộ lọc.
                </td>
              </tr>
            )}
            {ds.map((n) => {
              const tk = mapDoan.get(n.id) ?? { soDoan: 0, coVector: 0 };
              return (
                <tr key={n.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link href={`/quan-tri/rag/nguon/${n.id}`}><b>{n.ma}</b></Link>
                  </td>
                  <td>
                    <div>{n.tenGoc}</div>
                    {n.tenHanViet && (
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>{n.tenHanViet}</div>
                    )}
                    {n.mang.length > 0 && (
                      <div style={{ color: 'var(--muted)', fontSize: 11 }}>{n.mang.join(' · ')}</div>
                    )}
                  </td>
                  <td>{n.tacGia ?? '–'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{nhanPhapLy(n.phapLy)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{nhanPhamVi(n.phamVi)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{nhanTrangThaiNguon(n.trangThai)}</td>
                  <td className="qt-cot-so">
                    {tk.soDoan > 0 ? (
                      <Link href={`/quan-tri/rag/doan?nguonId=${n.id}`}>{so(tk.soDoan)}</Link>
                    ) : '0'}
                  </td>
                  <td className="qt-cot-so">{so(tk.coVector)}</td>
                  <td>
                    {n.trangThaiTai ?? '–'}
                    {n.dungLuongMb != null && (
                      <div style={{ color: 'var(--muted)', fontSize: 11 }}>{n.dungLuongMb} MB</div>
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
          <Link className="qt-nut phu" href={`/quan-tri/rag/nguon${qs({ p: String(p - 1) })}`}>
            ← Trước
          </Link>
        )}
        <span>Trang {p}/{soTrang}</span>
        {p < soTrang && (
          <Link className="qt-nut phu" href={`/quan-tri/rag/nguon${qs({ p: String(p + 1) })}`}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { dieuKienPhamVi, phanTichBigInt, sqlPhamVi } from '@/lib/rag/pham-vi';
import { suaDoan } from '../../hanh-dong';
import {
  ngayGio,
  nhanLoaiDoan,
  nhanPhamVi,
  nhanPhapLy,
  TEN_TRUONG_SUA,
  ThongBao,
} from '../../HienThi';

export const metadata: Metadata = { title: 'Chi tiết đoạn RAG' };
export const dynamic = 'force-dynamic';

export default async function ChiTietDoanRag({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bao?: string; loi?: string }>;
}) {
  const nd = await yeuCauQuyen('rag.xem_cong_khai');
  const [{ id: rawId }, sp] = await Promise.all([params, searchParams]);
  const id = phanTichBigInt(rawId);
  if (id === null) notFound();

  const dkPhamVi = dieuKienPhamVi(nd);
  const doan = await prisma.ragDoan.findFirst({
    where: { AND: [{ id }, dkPhamVi] },
    include: {
      nguon: { select: { id: true, ma: true, tenGoc: true, tenHanViet: true, phapLy: true } },
      dichViNguon: { select: { id: true, ma: true, tenGoc: true } },
      tep: { select: { duongDan: true } },
      sua: { orderBy: { luc: 'desc' }, take: 30 },
    },
  });
  if (!doan) notFound();

  const sua = coQuyen(nd.vaiTro, 'rag.sua_doan');

  const [vecRows, truoc, sau] = await Promise.all([
    prisma.$queryRaw<{ coVector: boolean }[]>`
      SELECT (d.embedding IS NOT NULL) AS "coVector"
      FROM rag_doan d
      WHERE d.id = ${id} AND ${sqlPhamVi(nd, 'd')}
    `,
    prisma.ragDoan.findFirst({
      where: {
        AND: [
          { nguonId: doan.nguonId },
          dkPhamVi,
          {
            OR: [
              { thuTu: { lt: doan.thuTu } },
              { thuTu: doan.thuTu, id: { lt: doan.id } },
            ],
          },
        ],
      },
      orderBy: [{ thuTu: 'desc' }, { id: 'desc' }],
      select: { id: true },
    }),
    prisma.ragDoan.findFirst({
      where: {
        AND: [
          { nguonId: doan.nguonId },
          dkPhamVi,
          {
            OR: [
              { thuTu: { gt: doan.thuTu } },
              { thuTu: doan.thuTu, id: { gt: doan.id } },
            ],
          },
        ],
      },
      orderBy: [{ thuTu: 'asc' }, { id: 'asc' }],
      select: { id: true },
    }),
  ]);

  const coVector = Boolean(vecRows[0]?.coVector);
  const nguoiSuaIds = [...new Set(doan.sua.map((s) => s.nguoiSuaId))];
  const dsNguoiSua = nguoiSuaIds.length
    ? await prisma.taiKhoan.findMany({
        where: { id: { in: nguoiSuaIds } },
        select: { id: true, hoTen: true, email: true },
      })
    : [];
  const mapNguoiSua = new Map(dsNguoiSua.map((t) => [t.id, t]));

  return (
    <>
      <div className="qt-loc" style={{ marginBottom: 8 }}>
        <Link href="/quan-tri/rag/doan">← Danh sách đoạn</Link>
        <span>·</span>
        <Link href={`/quan-tri/rag/nguon/${doan.nguon.id}`}>Nguồn {doan.nguon.ma}</Link>
        {truoc && (
          <>
            <span>·</span>
            <Link href={`/quan-tri/rag/doan/${String(truoc.id)}`}>← Đoạn trước</Link>
          </>
        )}
        {sau && (
          <>
            <span>·</span>
            <Link href={`/quan-tri/rag/doan/${String(sau.id)}`}>Đoạn sau →</Link>
          </>
        )}
      </div>

      <h1>Đoạn #{String(doan.id)} · {doan.nguon.tenGoc}</h1>
      <p className="qt-phu">
        {doan.duongDan.join(' › ') || '(không có mục lục)'} · {nhanLoaiDoan(doan.loai)} {nhanPhamVi(doan.phamVi)} {nhanPhapLy(doan.nguon.phapLy)}
      </p>

      <ThongBao bao={sp.bao} loi={sp.loi} />

      <div className="qt-the">
        <h2>Thông tin đoạn</h2>
        <table className="qt-bang">
          <tbody>
            <tr><th style={{ width: 180 }}>Thứ tự / Phiên bản</th><td>Thứ tự {doan.thuTu} · Phiên bản {doan.phienBan}</td></tr>
            <tr><th>Tệp nguồn</th><td>{doan.tep?.duongDan ?? '–'}{doan.trangAnh ? ` · Trang ảnh: ${doan.trangAnh}` : ''}</td></tr>
            <tr>
              <th>Vector nhúng</th>
              <td>
                {coVector ? 'Đã có vector' : 'Chưa có vector'}
                {doan.moHinhNhung ? ` (${doan.moHinhNhung})` : ''}
                {doan.nhungLuc ? ` · ${ngayGio(doan.nhungLuc)}` : ''}
              </td>
            </tr>
            <tr>
              <th>Độ tin cậy OCR / Soát</th>
              <td>
                {doan.ocrTinCay != null ? `${(doan.ocrTinCay * 100).toFixed(1)}%` : 'Văn bản sạch (không OCR)'} ·{' '}
                {doan.daSoat ? 'Đã soát' : 'Chưa soát'}
              </td>
            </tr>
            {doan.dichViNguon && (
              <tr><th>Nguồn bản dịch Việt</th><td>{doan.dichViNguon.ma} · {doan.dichViNguon.tenGoc}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="qt-the">
        <h2>Văn bản gốc</h2>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{doan.vanBan}</div>
      </div>

      <form className="qt-the" action={suaDoan} style={{ display: 'grid', gap: 10 }}>
        <h2>Hiệu đính nội dung đoạn</h2>
        <input type="hidden" name="id" value={String(doan.id)} />
        <fieldset disabled={!sua} style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          <label style={{ display: 'grid', gap: 4 }}>
            Văn bản chuẩn hóa
            <textarea className="qt-o" name="vanBanChuan" defaultValue={doan.vanBanChuan ?? ''} rows={6} />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>
            Phiên âm Hán Việt
            <textarea className="qt-o" name="hanViet" defaultValue={doan.hanViet ?? ''} rows={4} />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>
            Bản dịch tiếng Việt
            <textarea className="qt-o" name="dichVi" defaultValue={doan.dichVi ?? ''} rows={5} />
          </label>
          <label>
            <input type="checkbox" name="daSoat" defaultChecked={doan.daSoat} /> Đánh dấu đã soát
          </label>
          {sua && (
            <div>
              <button className="qt-nut" type="submit">Lưu bản sửa</button>
            </div>
          )}
        </fieldset>
      </form>

      <div className="qt-the qt-the-cuon">
        <h2>Lịch sử sửa đoạn ({doan.sua.length})</h2>
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Người sửa</th>
              <th>Trường</th>
              <th>Trước</th>
              <th>Sau</th>
            </tr>
          </thead>
          <tbody>
            {doan.sua.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: 'var(--muted)' }}>Chưa có bản sửa nào.</td>
              </tr>
            )}
            {doan.sua.map((s) => {
              const ns = mapNguoiSua.get(s.nguoiSuaId);
              return (
                <tr key={s.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{ngayGio(s.luc)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{ns ? ns.hoTen : s.nguoiSuaId}</td>
                  <td>{TEN_TRUONG_SUA[s.truong] ?? s.truong}</td>
                  <td style={{ maxWidth: 280, whiteSpace: 'pre-wrap' }}>{s.truoc || '–'}</td>
                  <td style={{ maxWidth: 280, whiteSpace: 'pre-wrap' }}>{s.sau || '–'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

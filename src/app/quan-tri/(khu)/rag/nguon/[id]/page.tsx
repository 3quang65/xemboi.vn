import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { dieuKienPhamVi, phanTichInt, sqlPhamVi } from '@/lib/rag/pham-vi';
import { capNhatNguon, chayLaiViec, huyViec } from '../../hanh-dong';
import {
  catVanBan,
  ngayGio,
  nhanLoaiDoan,
  nhanPhamVi,
  nhanPhapLy,
  nhanTrangThaiNguon,
  nhanTrangThaiViec,
  so,
  TEN_LOAI_VIEC,
  TEN_NOI_CHAY,
  TEN_TRANG_THAI_NGUON,
  TEN_XIN_PHEP,
  ThongBao,
} from '../../HienThi';

export const metadata: Metadata = { title: 'Chi tiết nguồn RAG' };
export const dynamic = 'force-dynamic';

export default async function ChiTietNguonRag({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bao?: string; loi?: string }>;
}) {
  const nd = await yeuCauQuyen('rag.xem_cong_khai');
  const [{ id: rawId }, sp] = await Promise.all([params, searchParams]);
  const id = phanTichInt(rawId);
  if (id === null) notFound();

  const dkPhamVi = dieuKienPhamVi(nd);
  const nguon = await prisma.ragNguon.findFirst({
    where: { AND: [{ id }, dkPhamVi] },
  });
  if (!nguon) notFound();

  const quanLy = coQuyen(nd.vaiTro, 'rag.quan_ly_nguon');
  const quayVe = `/quan-tri/rag/nguon/${id}`;

  const [thongKeDoan, doanDau, dsViec] = await Promise.all([
    prisma.$queryRaw<{ tong: bigint; coVector: bigint; daSoat: bigint }[]>`
      SELECT count(*) AS tong,
             count(*) FILTER (WHERE d.embedding IS NOT NULL) AS "coVector",
             count(*) FILTER (WHERE d."daSoat" = true) AS "daSoat"
      FROM rag_doan d
      WHERE d."nguonId" = ${id} AND ${sqlPhamVi(nd, 'd')}
    `,
    prisma.ragDoan.findMany({
      where: { AND: [{ nguonId: id }, dkPhamVi] },
      orderBy: [{ thuTu: 'asc' }, { id: 'asc' }],
      take: 20,
      select: {
        id: true,
        thuTu: true,
        duongDan: true,
        loai: true,
        vanBan: true,
        phamVi: true,
        daSoat: true,
      },
    }),
    prisma.ragViec.findMany({
      where: { nguonId: id },
      orderBy: [{ taoLuc: 'desc' }, { id: 'desc' }],
      take: 50,
      include: { tep: { select: { duongDan: true } } },
    }),
  ]);

  const idsDoan = doanDau.map((d) => String(d.id));
  const coVectorRows = idsDoan.length
    ? await prisma.$queryRaw<{ id: bigint }[]>`
        SELECT d.id
        FROM rag_doan d
        WHERE d.id = ANY(${idsDoan}::bigint[])
          AND d.embedding IS NOT NULL
          AND ${sqlPhamVi(nd, 'd')}
      `
    : [];
  const tapCoVector = new Set(coVectorRows.map((r) => String(r.id)));

  const tk = thongKeDoan[0] ?? { tong: 0n, coVector: 0n, daSoat: 0n };

  return (
    <>
      <p className="qt-phu">
        <Link href="/quan-tri/rag/nguon">← Danh sách nguồn</Link>
      </p>
      <h1>{nguon.ma} · {nguon.tenGoc}</h1>
      <p className="qt-phu">
        {nguon.tenHanViet && <>{nguon.tenHanViet} · </>}
        {nhanPhapLy(nguon.phapLy)} {nhanPhamVi(nguon.phamVi)} {nhanTrangThaiNguon(nguon.trangThai)}
      </p>

      <ThongBao bao={sp.bao} loi={sp.loi} />

      <div className="qt-luoi">
        <div className="qt-so">
          <div className="qt-so-nhan">Tổng đoạn</div>
          <div className="qt-so-gt">{so(tk.tong)}</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Đoạn có vector</div>
          <div className="qt-so-gt">{so(tk.coVector)}</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Đoạn đã soát</div>
          <div className="qt-so-gt">{so(tk.daSoat)}</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Việc xử lý gần đây</div>
          <div className="qt-so-gt">{so(dsViec.length)}</div>
        </div>
      </div>

      <div className="qt-the">
        <h2>Thông tin nguồn</h2>
        <table className="qt-bang">
          <tbody>
            <tr><th style={{ width: 180 }}>Tác giả / Niên đại</th><td>{nguon.tacGia ?? '–'} {nguon.nienDai ? `(${nguon.nienDai})` : ''}</td></tr>
            <tr><th>Mảng nội dung</th><td>{nguon.mang.length ? nguon.mang.join(', ') : '–'}</td></tr>
            <tr><th>Ngôn ngữ / Loại</th><td>{nguon.ngonNgu.join(', ') || '–'} · {nguon.loaiNguon}</td></tr>
            <tr><th>Nơi có bản số</th><td>{nguon.noiCoBanSo ?? '–'} {nguon.dinhDang ? `(${nguon.dinhDang})` : ''}</td></tr>
            <tr>
              <th>URL gốc</th>
              <td>
                {nguon.url ? (
                  <a href={nguon.url} target="_blank" rel="noreferrer">{nguon.url}</a>
                ) : '–'}
              </td>
            </tr>
            <tr><th>Giấy phép / Ghi công</th><td>{nguon.giayPhep ?? '–'}{nguon.ghiCong ? ` — ${nguon.ghiCong}` : ''}</td></tr>
            <tr>
              <th>Tải về máy trạm</th>
              <td>
                {nguon.trangThaiTai ?? '–'}
                {nguon.dungLuongMb != null ? ` · ${nguon.dungLuongMb} MB` : ''}
                {nguon.duongDanCucBo ? ` · ${nguon.duongDanCucBo}` : ''}
              </td>
            </tr>
            <tr><th>Ngày nạp</th><td>{ngayGio(nguon.ngayNap)}</td></tr>
          </tbody>
        </table>
      </div>

      <form className="qt-the" action={capNhatNguon} style={{ display: 'grid', gap: 10, maxWidth: 760 }}>
        <h2>Quản lý pháp lý và trạng thái nạp</h2>
        <input type="hidden" name="id" value={nguon.id} />
        <p className="qt-phu" style={{ margin: 0 }}>
          Phạm vi hiện tại là <b>{nguon.phamVi === 'CONG_KHAI' ? 'Công khai' : 'Nội bộ'}</b>. Hệ thống tự tính phạm vi bằng quy tắc trong cơ sở dữ liệu (không sửa tay trực tiếp): chỉ nguồn A hoặc đã đồng ý xin phép và bỏ cờ “Chỉ dùng nội bộ” mới thành Công khai.
        </p>
        <fieldset disabled={!quanLy} style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          <label>
            <input type="checkbox" name="chiNoiBo" defaultChecked={nguon.chiNoiBo} /> Chỉ dùng nội bộ
          </label>
          <div className="qt-loc" style={{ marginBottom: 0 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              Trạng thái xin phép
              <select className="qt-o" name="xinPhep" defaultValue={nguon.xinPhep}>
                {Object.entries(TEN_XIN_PHEP).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              Trạng thái nạp
              <select className="qt-o" name="trangThai" defaultValue={nguon.trangThai}>
                {Object.entries(TEN_TRANG_THAI_NGUON).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </label>
          </div>
          <label style={{ display: 'grid', gap: 4 }}>
            Ghi chú pháp lý
            <textarea className="qt-o" name="ghiChuPhapLy" defaultValue={nguon.ghiChuPhapLy ?? ''} rows={3} />
          </label>
          {quanLy && (
            <div>
              <button className="qt-nut" type="submit">Lưu thay đổi</button>
            </div>
          )}
        </fieldset>
      </form>

      <div className="qt-the qt-the-cuon">
        <h2>20 đoạn đầu của nguồn</h2>
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Thứ tự</th>
              <th>Đường dẫn</th>
              <th>Loại</th>
              <th>Nội dung</th>
              <th>Phạm vi</th>
              <th>Vector</th>
            </tr>
          </thead>
          <tbody>
            {doanDau.length === 0 && (
              <tr>
                <td colSpan={7} style={{ color: 'var(--muted)' }}>Nguồn này chưa có đoạn nào trong phạm vi được xem.</td>
              </tr>
            )}
            {doanDau.map((d) => (
              <tr key={String(d.id)}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link href={`/quan-tri/rag/doan/${String(d.id)}`}>#{String(d.id)}</Link>
                </td>
                <td className="qt-cot-so">{d.thuTu}</td>
                <td style={{ minWidth: 140 }}>{d.duongDan.join(' › ') || '–'}</td>
                <td>{nhanLoaiDoan(d.loai)}</td>
                <td style={{ maxWidth: 460 }}>{catVanBan(d.vanBan, 240)}</td>
                <td>{nhanPhamVi(d.phamVi)}</td>
                <td>{tapCoVector.has(String(d.id)) ? 'Có' : 'Chưa'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {Number(tk.tong) > 0 && (
          <p style={{ marginTop: 10, marginBottom: 0 }}>
            <Link href={`/quan-tri/rag/doan?nguonId=${nguon.id}`}>Xem toàn bộ {so(tk.tong)} đoạn của nguồn này →</Link>
          </p>
        )}
      </div>

      <div className="qt-the qt-the-cuon">
        <h2>Các việc xử lý của nguồn</h2>
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Mã việc</th>
              <th>Bước</th>
              <th>Nơi chạy</th>
              <th>Tệp</th>
              <th>Trạng thái</th>
              <th className="qt-cot-so">Thử</th>
              <th>Lỗi / Kết quả</th>
              <th>Thời gian</th>
              {quanLy && <th>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {dsViec.length === 0 && (
              <tr>
                <td colSpan={quanLy ? 9 : 8} style={{ color: 'var(--muted)' }}>Chưa có việc xử lý nào cho nguồn này.</td>
              </tr>
            )}
            {dsViec.map((v) => (
              <tr key={String(v.id)}>
                <td>#{String(v.id)}</td>
                <td>{TEN_LOAI_VIEC[v.loai] ?? v.loai}</td>
                <td>{TEN_NOI_CHAY[v.noiChay] ?? v.noiChay}</td>
                <td style={{ fontSize: 12 }}>{v.tep?.duongDan ?? '–'}</td>
                <td>{nhanTrangThaiViec(v.trangThai)}</td>
                <td className="qt-cot-so">{v.soLanThu}/{v.toiDaThu}</td>
                <td style={{ maxWidth: 260, fontSize: 12 }}>
                  {v.loi ? <span style={{ color: 'var(--bad)' }}>{catVanBan(v.loi, 160)}</span> : v.ketQua ? JSON.stringify(v.ketQua) : '–'}
                </td>
                <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{ngayGio(v.ketThucLuc ?? v.batDauLuc ?? v.taoLuc)}</td>
                {quanLy && (
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {v.trangThai === 'LOI' && (
                      <form action={chayLaiViec} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={String(v.id)} />
                        <input type="hidden" name="quayVe" value={quayVe} />
                        <button className="qt-nut phu" type="submit" style={{ padding: '3px 8px' }}>Chạy lại</button>
                      </form>
                    )}
                    {(v.trangThai === 'CHO' || v.trangThai === 'DANG_CHAY') && (
                      <form action={huyViec} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={String(v.id)} />
                        <input type="hidden" name="quayVe" value={quayVe} />
                        <button className="qt-nut phu" type="submit" style={{ padding: '3px 8px' }}>Hủy</button>
                      </form>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

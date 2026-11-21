import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { duocXemNoiBo, nguCanhTruyVan } from '@/lib/rag/pham-vi';
import { catVanBan, nhanLoaiDoan, nhanPhamVi, so } from '../HienThi';

export const metadata: Metadata = { title: 'Thử truy vấn RAG' };
export const dynamic = 'force-dynamic';

type KetQuaTruyVan = {
  id: bigint;
  nguonId: number;
  nguonMa: string;
  nguonTen: string;
  duongDan: string[];
  loai: string;
  vanBan: string;
  vanBanChuan: string | null;
  hanViet: string | null;
  dichVi: string | null;
  phamVi: string;
  diemTsv: number;
  diemTrgm: number;
  diemChinhXac: number;
  diem: number;
};

type Tham = { q?: string; nguCanh?: string };

export default async function ThuTruyVanRag({ searchParams }: { searchParams: Promise<Tham> }) {
  const nd = await yeuCauQuyen('rag.xem_cong_khai');
  const sp = await searchParams;
  const xemNoiBo = duocXemNoiBo(nd);
  const q = (sp.q ?? '').trim().slice(0, 500);
  const nguCanh = nguCanhTruyVan(nd, sp.nguCanh);

  let ketQua: KetQuaTruyVan[] = [];
  let ms = 0;

  if (q) {
    const pat = `%${q.replace(/[\\%_]/g, '\\$&')}%`;
    const batDau = Date.now();

    if (nguCanh === 'CONG_KHAI') {
      // Tài khoản không có rag.xem_noi_bo luôn đi nhánh này và chỉ đọc view công khai.
      ketQua = await prisma.$queryRaw<KetQuaTruyVan[]>`
        WITH q AS (
          SELECT ${q}::text AS raw_q,
                 ${pat}::text AS pat,
                 plainto_tsquery('simple', ${q}) AS tsq
        )
        SELECT d.id,
               d."nguonId" AS "nguonId",
               n.ma AS "nguonMa",
               n."tenGoc" AS "nguonTen",
               d."duongDan" AS "duongDan",
               d.loai,
               d."vanBan" AS "vanBan",
               d."vanBanChuan" AS "vanBanChuan",
               d."hanViet" AS "hanViet",
               d."dichVi" AS "dichVi",
               'CONG_KHAI'::text AS "phamVi",
               ts_rank(d.tsv, q.tsq)::float8 AS "diemTsv",
               similarity(d."vanBan", q.raw_q)::float8 AS "diemTrgm",
               (
                 CASE WHEN d."vanBan" ILIKE q.pat ESCAPE '\' OR coalesce(d."vanBanChuan", '') ILIKE q.pat ESCAPE '\' THEN 0.25 ELSE 0 END
                 + CASE WHEN coalesce(d."hanViet", '') ILIKE q.pat ESCAPE '\' OR coalesce(d."dichVi", '') ILIKE q.pat ESCAPE '\' THEN 0.15 ELSE 0 END
               )::float8 AS "diemChinhXac",
               (
                 ts_rank(d.tsv, q.tsq)
                 + similarity(d."vanBan", q.raw_q)
                 + CASE WHEN d."vanBan" ILIKE q.pat ESCAPE '\' OR coalesce(d."vanBanChuan", '') ILIKE q.pat ESCAPE '\' THEN 0.25 ELSE 0 END
                 + CASE WHEN coalesce(d."hanViet", '') ILIKE q.pat ESCAPE '\' OR coalesce(d."dichVi", '') ILIKE q.pat ESCAPE '\' THEN 0.15 ELSE 0 END
               )::float8 AS diem
        FROM rag_doan_cong_khai d
        JOIN rag_nguon_cong_khai n ON n.id = d."nguonId"
        CROSS JOIN q
        WHERE d.tsv @@ q.tsq
           OR similarity(d."vanBan", q.raw_q) > 0.05
           OR d."vanBan" ILIKE q.pat ESCAPE '\'
           OR coalesce(d."vanBanChuan", '') ILIKE q.pat ESCAPE '\'
           OR coalesce(d."hanViet", '') ILIKE q.pat ESCAPE '\'
           OR coalesce(d."dichVi", '') ILIKE q.pat ESCAPE '\'
        ORDER BY diem DESC, d.id ASC
        LIMIT 20
      `;
    } else {
      ketQua = await prisma.$queryRaw<KetQuaTruyVan[]>`
        WITH q AS (
          SELECT ${q}::text AS raw_q,
                 ${pat}::text AS pat,
                 plainto_tsquery('simple', ${q}) AS tsq
        )
        SELECT d.id,
               d."nguonId" AS "nguonId",
               n.ma AS "nguonMa",
               n."tenGoc" AS "nguonTen",
               d."duongDan" AS "duongDan",
               d.loai,
               d."vanBan" AS "vanBan",
               d."vanBanChuan" AS "vanBanChuan",
               d."hanViet" AS "hanViet",
               d."dichVi" AS "dichVi",
               d."phamVi"::text AS "phamVi",
               ts_rank(d.tsv, q.tsq)::float8 AS "diemTsv",
               similarity(d."vanBan", q.raw_q)::float8 AS "diemTrgm",
               (
                 CASE WHEN d."vanBan" ILIKE q.pat ESCAPE '\' OR coalesce(d."vanBanChuan", '') ILIKE q.pat ESCAPE '\' THEN 0.25 ELSE 0 END
                 + CASE WHEN coalesce(d."hanViet", '') ILIKE q.pat ESCAPE '\' OR coalesce(d."dichVi", '') ILIKE q.pat ESCAPE '\' THEN 0.15 ELSE 0 END
               )::float8 AS "diemChinhXac",
               (
                 ts_rank(d.tsv, q.tsq)
                 + similarity(d."vanBan", q.raw_q)
                 + CASE WHEN d."vanBan" ILIKE q.pat ESCAPE '\' OR coalesce(d."vanBanChuan", '') ILIKE q.pat ESCAPE '\' THEN 0.25 ELSE 0 END
                 + CASE WHEN coalesce(d."hanViet", '') ILIKE q.pat ESCAPE '\' OR coalesce(d."dichVi", '') ILIKE q.pat ESCAPE '\' THEN 0.15 ELSE 0 END
               )::float8 AS diem
        FROM rag_doan d
        JOIN rag_nguon n ON n.id = d."nguonId"
        CROSS JOIN q
        WHERE d.tsv @@ q.tsq
           OR similarity(d."vanBan", q.raw_q) > 0.05
           OR d."vanBan" ILIKE q.pat ESCAPE '\'
           OR coalesce(d."vanBanChuan", '') ILIKE q.pat ESCAPE '\'
           OR coalesce(d."hanViet", '') ILIKE q.pat ESCAPE '\'
           OR coalesce(d."dichVi", '') ILIKE q.pat ESCAPE '\'
        ORDER BY diem DESC, d.id ASC
        LIMIT 20
      `;
    }

    ms = Date.now() - batDau;
    try {
      await prisma.ragTruyVanLog.create({
        data: {
          nguCanh,
          taiKhoanId: nd.id,
          truyVan: q,
          soKetQua: ketQua.length,
          coNoiBo: ketQua.some((r) => r.phamVi === 'NOI_BO'),
          ms,
        },
      });
    } catch {
      // Không chặn hiển thị kết quả nếu ghi log gặp sự cố tạm thời.
    }
  }

  return (
    <>
      <h1>Thử truy vấn RAG</h1>
      <p className="qt-phu">
        Tìm kiếm theo từ khóa toàn văn và độ tương đồng chuỗi trên cơ sở dữ liệu (lấy tối đa 20 đoạn xếp hạng cao nhất).
      </p>

      <div className="qt-bao" role="note">
        Tìm ngữ nghĩa (vector) chưa bật ở web; chạy ở máy trạm.
      </div>

      <form className="qt-loc" method="get">
        <input
          className="qt-o"
          name="q"
          defaultValue={q}
          placeholder="Nhập từ khóa chữ Hán hoặc tiếng Việt, ví dụ: 紫微 hoặc Thiên Cơ"
          style={{ minWidth: 320 }}
          required
        />
        {xemNoiBo ? (
          <select className="qt-o" name="nguCanh" defaultValue={nguCanh} aria-label="Phạm vi tìm kiếm">
            <option value="CONG_KHAI">Chỉ phạm vi Công khai</option>
            <option value="NOI_BO">Toàn bộ (gồm Nội bộ)</option>
          </select>
        ) : (
          <span className="qt-nhan tot">Phạm vi tìm: Công khai</span>
        )}
        <button className="qt-nut" type="submit">Tìm thử</button>
        {q && <Link className="qt-nut phu" href="/quan-tri/rag/thu">Xóa</Link>}
      </form>

      {q && (
        <>
          <p className="qt-phu" style={{ marginBottom: 8 }}>
            Tìm “<b>{q}</b>” trong ngữ cảnh <b>{nguCanh === 'CONG_KHAI' ? 'Công khai' : 'Toàn bộ (gồm Nội bộ)'}</b>: thấy{' '}
            <b>{so(ketQua.length)}</b> đoạn ({so(ms)} ms).
          </p>

          <div className="qt-the qt-the-cuon">
            <table className="qt-bang">
              <thead>
                <tr>
                  <th className="qt-cot-so">Hạng</th>
                  <th className="qt-cot-so">Điểm</th>
                  <th>Mã đoạn</th>
                  <th>Nguồn &amp; Đường dẫn</th>
                  <th>Nội dung</th>
                  <th>Phạm vi</th>
                </tr>
              </thead>
              <tbody>
                {ketQua.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ color: 'var(--muted)' }}>
                      Không có đoạn nào khớp từ khóa này.
                    </td>
                  </tr>
                )}
                {ketQua.map((r, i) => (
                  <tr key={String(r.id)}>
                    <td className="qt-cot-so">{i + 1}</td>
                    <td className="qt-cot-so" style={{ whiteSpace: 'nowrap' }}>
                      <div><b>{r.diem.toFixed(3)}</b></div>
                      <div style={{ color: 'var(--muted)', fontSize: 11 }}>
                        tsv {r.diemTsv.toFixed(2)} · trgm {r.diemTrgm.toFixed(2)}
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link href={`/quan-tri/rag/doan/${String(r.id)}`}><b>#{String(r.id)}</b></Link>
                      <div style={{ marginTop: 4 }}>{nhanLoaiDoan(r.loai)}</div>
                    </td>
                    <td style={{ minWidth: 160 }}>
                      <div>
                        <Link href={`/quan-tri/rag/nguon/${r.nguonId}`}><b>{r.nguonMa}</b></Link> · {r.nguonTen}
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                        {r.duongDan.join(' › ') || '–'}
                      </div>
                    </td>
                    <td style={{ maxWidth: 500 }}>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{catVanBan(r.vanBanChuan ?? r.vanBan, 400)}</div>
                      {r.hanViet && (
                        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted)' }}>
                          <b>Hán Việt:</b> {catVanBan(r.hanViet, 200)}
                        </div>
                      )}
                      {r.dichVi && (
                        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted)' }}>
                          <b>Dịch Việt:</b> {catVanBan(r.dichVi, 200)}
                        </div>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{nhanPhamVi(r.phamVi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

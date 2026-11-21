import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';

export const metadata: Metadata = { title: 'Bảng điều khiển' };
export const dynamic = 'force-dynamic';

const so = (n: number | bigint) => Number(n).toLocaleString('vi-VN');

export default async function BangDieuKhien({ searchParams }: { searchParams: Promise<{ 'thieu-quyen'?: string }> }) {
  const nd = await yeuCauQuyen();
  const { 'thieu-quyen': thieu } = await searchParams;
  const xemSeo = coQuyen(nd.vaiTro, 'seo.xem');
  const xemRag = coQuyen(nd.vaiTro, 'rag.xem_cong_khai');

  const [tuKhoa, trang, nguon, doan] = await Promise.all([
    xemSeo ? prisma.seoTuKhoa.count() : 0,
    xemSeo ? prisma.seoTrang.count() : 0,
    xemRag ? prisma.ragNguon.count() : 0,
    xemRag ? prisma.ragDoan.count() : 0,
  ]);
  const [{ coVector }] = xemRag
    ? await prisma.$queryRaw<{ coVector: bigint }[]>`SELECT count(*) AS "coVector" FROM rag_doan WHERE embedding IS NOT NULL`
    : [{ coVector: 0n }];

  return (
    <>
      <h1>Bảng điều khiển</h1>
      <p className="qt-phu">Chào {nd.hoTen}.</p>
      {thieu && <div className="qt-bao loi">Tài khoản của anh/chị không có quyền “{thieu}”.</div>}
      <div className="qt-luoi">
        {xemSeo && (
          <>
            <Link href="/quan-tri/seo/tu-khoa" className="qt-so" style={{ color: 'inherit', textDecoration: 'none' }}>
              <div className="qt-so-nhan">Từ khóa trong kho</div><div className="qt-so-gt">{so(tuKhoa)}</div>
            </Link>
            <Link href="/quan-tri/seo/trang" className="qt-so" style={{ color: 'inherit', textDecoration: 'none' }}>
              <div className="qt-so-nhan">Trang SEO</div><div className="qt-so-gt">{so(trang)}</div>
            </Link>
          </>
        )}
        {xemRag && (
          <>
            <Link href="/quan-tri/rag/nguon" className="qt-so" style={{ color: 'inherit', textDecoration: 'none' }}>
              <div className="qt-so-nhan">Nguồn RAG</div><div className="qt-so-gt">{so(nguon)}</div>
            </Link>
            <Link href="/quan-tri/rag/doan" className="qt-so" style={{ color: 'inherit', textDecoration: 'none' }}>
              <div className="qt-so-nhan">Đoạn đã nạp / có vector</div><div className="qt-so-gt">{so(doan)} / {so(coVector)}</div>
            </Link>
          </>
        )}
      </div>
    </>
  );
}

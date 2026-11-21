import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import ChonSeoTrang from '../ChonSeoTrang';
import { taoNoiDung } from '../hanh-dong';
import { DS_LOAI_NOI_DUNG, MA_MANG_HOP_LE, TEN_LOAI_NOI_DUNG, TEN_MANG, ThongBao } from '../HienThi';

export const metadata: Metadata = { title: 'Tạo nội dung mới' };
export const dynamic = 'force-dynamic';

export default async function TaoNoiDungMoi({
  searchParams,
}: {
  searchParams: Promise<{ bao?: string; loi?: string }>;
}) {
  await yeuCauQuyen('noi_dung.soan');
  const sp = await searchParams;

  const dsTrangTrong = await prisma.seoTrang.findMany({
    where: { noiDungId: null },
    orderBy: [{ maTrang: 'asc' }, { duongDan: 'asc' }],
    take: 1000,
    select: { id: true, maTrang: true, duongDan: true, title: true, loai: true },
  });

  return (
    <>
      <p className="qt-phu">
        <Link href="/quan-tri/noi-dung">← Danh sách nội dung</Link>
      </p>
      <h1>Tạo mục nội dung mới</h1>
      <p className="qt-phu">Mục mới được tạo ở trạng thái Nháp; sau đó mở trang soạn để viết khối/thân bài và lưu phiên bản.</p>

      <ThongBao bao={sp.bao} loi={sp.loi} />

      <form className="qt-the" action={taoNoiDung} style={{ display: 'grid', gap: 14, maxWidth: 820 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>
            Loại nội dung <b>*</b>
          </span>
          <select className="qt-o" name="loai" defaultValue="MUC_TU_DIEN" required>
            {DS_LOAI_NOI_DUNG.map((l) => (
              <option key={l} value={l}>
                {TEN_LOAI_NOI_DUNG[l]} ({l})
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: 4 }}>
          <span>
            Tiêu đề <b>*</b>
          </span>
          <input className="qt-o" name="tieuDe" required maxLength={250} placeholder="Ví dụ: Sao Thiên Cơ (天機)" />
        </label>

        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 6 }}>
          <legend style={{ fontWeight: 600, marginBottom: 4 }}>Mảng huyền học (chọn một hoặc nhiều)</legend>
          <div className="qt-mang-luoi">
            {MA_MANG_HOP_LE.map((m) => (
              <label key={m} className="qt-mang-muc">
                <input type="checkbox" name="mang" value={m} />
                <span>
                  <b>{m}</b> · {TEN_MANG[m]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div style={{ display: 'grid', gap: 4 }}>
          <span>Gắn trang SEO chưa có nội dung ({dsTrangTrong.length.toLocaleString('vi-VN')} trang trống)</span>
          <ChonSeoTrang dsTrang={dsTrangTrong} />
        </div>

        <div className="qt-loc">
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" name="canDuyetPhapLy" />
            Cần duyệt pháp lý trước khi xuất bản
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Hạn cập nhật
            <input className="qt-o" type="date" name="hanCapNhat" />
          </label>
        </div>

        <div>
          <button className="qt-nut" type="submit">
            Tạo mục nội dung
          </button>
        </div>
      </form>
    </>
  );
}

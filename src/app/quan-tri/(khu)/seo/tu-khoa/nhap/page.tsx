import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { nhapTepTuKhoa } from '../../hanh-dong';
import ThongBao, { so } from '../../ThongBao';

export const metadata: Metadata = { title: 'Nhập tệp từ khóa' };
export const dynamic = 'force-dynamic';

export default async function NhapTep({ searchParams }: { searchParams: Promise<{ bao?: string; loi?: string }> }) {
  await yeuCauQuyen('seo.sua');
  const sp = await searchParams;
  const lo = await prisma.seoLoNhap.findMany({ orderBy: { nhapLuc: 'desc' }, take: 30 });
  return (
    <>
      <h1>Nhập tệp từ khóa</h1>
      <p className="qt-phu">Nhập lại cùng tệp không sinh từ khóa trùng: từ đã có được cập nhật lượng tìm, nguồn được gộp. Sau khi nhập, kho tự gán lại theo quy tắc (gán tay giữ nguyên).</p>
      <ThongBao bao={sp.bao} loi={sp.loi} />
      <form className="qt-the" action={nhapTepTuKhoa} style={{ display: 'grid', gap: 10, maxWidth: 560 }}>
        <label style={{ display: 'grid', gap: 4 }}>Loại tệp
          <select className="qt-o" name="loai" defaultValue="KEYWORD_PLANNER">
            <option value="KEYWORD_PLANNER">Keyword Planner (CSV xuất từ Google Ads, UTF-16 hoặc UTF-8)</option>
            <option value="AUTOCOMPLETE">Autocomplete (mỗi dòng một từ)</option>
            <option value="GOI_Y_GOOGLE">Gợi ý Google (mỗi dòng một từ)</option>
            <option value="KHAC">Danh sách tay (mỗi dòng một từ)</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: 4 }}>Tệp (tối đa 20 MB)
          <input className="qt-o" type="file" name="tep" accept=".csv,.txt,.tsv" required />
        </label>
        <div><button className="qt-nut" type="submit">Nhập</button></div>
      </form>
      <div className="qt-the qt-the-cuon">
        <h2>Các lần nhập</h2>
        <table className="qt-bang">
          <thead><tr><th>Lúc</th><th>Tệp</th><th>Loại</th><th>Khoảng</th><th className="qt-cot-so">Dòng</th><th className="qt-cot-so">Mới</th><th className="qt-cot-so">Cập nhật</th></tr></thead>
          <tbody>
            {lo.map((l) => (
              <tr key={l.id}><td>{l.nhapLuc.toLocaleString('vi-VN')}</td><td>{l.tenTep}</td><td>{l.loai}</td><td>{l.khoangThoiGian ?? '–'}</td>
                <td className="qt-cot-so">{so(l.soDong)}</td><td className="qt-cot-so">{so(l.soMoi)}</td><td className="qt-cot-so">{so(l.soCapNhat)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

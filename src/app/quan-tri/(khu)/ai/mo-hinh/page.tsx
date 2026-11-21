import type { Metadata } from 'next';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { docCauHinhLlm, laMoHinhGpt, layDanhSachMoHinh, MAC_DINH, tomTatKhoa } from '@/lib/ai/cau-hinh-llm';
import ThongBao from '../../seo/ThongBao';
import { luuCauHinh, thuMoHinh } from './hanh-dong';

export const metadata: Metadata = { title: 'Mô hình AI' };
export const dynamic = 'force-dynamic';

const VIEC = [
  { ma: 'chat', ten: 'Trợ lý chat công khai', ghiChu: 'Nhiều lượt, câu ngắn, cần nhanh: dùng bậc nhẹ (Luna).' },
  { ma: 'soan', ten: 'AI soạn bản nháp', ghiChu: 'Bài dài, phải giữ đúng mã trích dẫn [D:n]: dùng bậc mạnh hơn (6.1-sol).' },
] as const;

export default async function TrangMoHinh({ searchParams }: { searchParams: Promise<{ bao?: string; loi?: string }> }) {
  await yeuCauQuyen('ai.tro_ly');
  const sp = await searchParams;
  const ch = await docCauHinhLlm(true);
  const khoa = tomTatKhoa();
  const ds = await layDanhSachMoHinh(ch);
  const gpt = ds.ok ? ds.ds.filter(laMoHinhGpt) : [];

  return (
    <>
      <h1>Mô hình AI</h1>
      <p className="qt-phu">
        Mọi lời gọi LLM đi qua 9router của anh. Khóa API chỉ đặt trong biến môi trường <code>NINEROUTER_API_KEY</code>; trang này không nhận và không hiện khóa.
        Mỗi lần lưu đều ghi vào nhật ký thao tác.
      </p>
      <ThongBao bao={sp.bao} loi={sp.loi} />

      <div className="qt-luoi">
        <div className="qt-so"><div className="qt-so-nhan">Khóa 9router</div><div className="qt-so-gt">{khoa.co ? `••••${khoa.cuoi}` : 'Chưa có'}</div></div>
        <div className="qt-so"><div className="qt-so-nhan">Mô hình cổng mở cho khóa</div><div className="qt-so-gt">{ds.ok ? `${ds.ds.length} (GPT: ${gpt.length})` : '–'}</div></div>
      </div>
      {!khoa.co && (
        <div className="qt-bao loi" role="alert">
          Chưa có khóa. Tạo một khóa riêng tên <b>xemboi</b> trong 9router (Dashboard → API Keys), rồi thêm dòng <code>NINEROUTER_API_KEY=…</code> vào tệp <code>.env</code> và khởi động lại máy chủ.
          Chưa có khóa thì trợ lý chat dùng nhà cung cấp cũ hoặc chế độ ngoại tuyến như trước.
        </div>
      )}
      {khoa.co && !ds.ok && <div className="qt-bao loi" role="alert">Không lấy được danh sách mô hình: {ds.loi}</div>}

      <div className="qt-the">
        <h2>Cấu hình</h2>
        <form action={luuCauHinh} style={{ display: 'grid', gap: 12 }}>
          <label>Địa chỉ cổng (tương thích OpenAI)<br />
            <input className="qt-o" name="baseUrl" defaultValue={ch.baseUrl} style={{ width: 360 }} required />
          </label>
          {VIEC.map((v) => (
            <fieldset key={v.ma} style={{ border: '1px solid var(--line)', padding: 12 }}>
              <legend><b>{v.ten}</b></legend>
              <div className="qt-phu" style={{ marginTop: 0 }}>{v.ghiChu} Mặc định: <code>{MAC_DINH.moHinh[v.ma]}</code>.</div>
              <span style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <label>Mô hình <input className="qt-o" name={v.ma === 'chat' ? 'moHinhChat' : 'moHinhSoan'} defaultValue={ch.moHinh[v.ma]} list="ds-mo-hinh" style={{ width: 260 }} required /></label>
                <label>Nhiệt độ <input className="qt-o" name={v.ma === 'chat' ? 'nhietDoChat' : 'nhietDoSoan'} type="number" step="0.05" min="0" max="1.5" defaultValue={ch.nhietDo[v.ma]} style={{ width: 90 }} /></label>
              </span>
            </fieldset>
          ))}
          <datalist id="ds-mo-hinh">{gpt.map((m) => <option key={m} value={m} />)}</datalist>
          <div><button className="qt-nut" type="submit">Lưu cấu hình</button></div>
        </form>
      </div>

      <div className="qt-the">
        <h2>Thử kết nối</h2>
        <p className="qt-phu">Gửi một câu ngắn tới mô hình đã <b>lưu</b> cho từng việc (không luồng, tối đa 16 token).</p>
        <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {VIEC.map((v) => (
            <form key={v.ma} action={thuMoHinh}>
              <input type="hidden" name="viec" value={v.ma} />
              <button className="qt-nut phu" type="submit" disabled={!khoa.co}>Thử {v.ten.toLowerCase()} ({ch.moHinh[v.ma]})</button>
            </form>
          ))}
        </span>
      </div>

      {gpt.length > 0 && (
        <div className="qt-the">
          <h2>Mô hình GPT trên cổng</h2>
          <p className="qt-phu">{gpt.join(' · ')}</p>
        </div>
      )}
    </>
  );
}

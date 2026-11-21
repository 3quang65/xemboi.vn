'use client';
// Khung "AI soạn bản nháp". Gửi xong mất 30 giây đến vài phút (mô hình soạn qua 9router).
import { useFormStatus } from 'react-dom';
import { aiSoan } from './ai-soan-hanh-dong';

function NutGui({ tat }: { tat: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="qt-nut" type="submit" disabled={tat || pending}>
      {pending ? 'AI đang soạn… (có thể vài phút)' : 'AI soạn bản nháp'}
    </button>
  );
}

export default function NutAiSoan({ id, duoc, lyDo, moHinh }: { id: string; duoc: boolean; lyDo?: string; moHinh: string }) {
  return (
    <form action={aiSoan} style={{ display: 'grid', gap: 8 }}>
      <input type="hidden" name="id" value={id} />
      <label>Mã đoạn nguồn (chỉ đoạn công khai; cách nhau bởi dấu cách hoặc dấu phẩy, tối đa 40)
        <textarea className="qt-o" name="maDoan" rows={2} placeholder="12345 12346 hoặc [D:12345]" style={{ width: '100%' }} disabled={!duoc} />
      </label>
      <label>Yêu cầu thêm (không bắt buộc)
        <input className="qt-o" name="yeuCau" maxLength={2000} placeholder="ví dụ: nhấn mạnh khác biệt giữa các phái" style={{ width: '100%' }} disabled={!duoc} />
      </label>
      <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <NutGui tat={!duoc} />
        <span className="qt-phu" style={{ margin: 0 }}>{duoc ? `Mô hình: ${moHinh}. Kết quả là một phiên bản mới, không ghi đè bản cũ.` : lyDo}</span>
      </span>
    </form>
  );
}

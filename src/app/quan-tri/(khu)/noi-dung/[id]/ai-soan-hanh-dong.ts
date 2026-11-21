'use server';
// Nút "AI soạn" của trang soạn: gọi phần lõi src/lib/noi-dung/ai-soan.ts (AI chỉ tạo phiên bản NHÁP).
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { aiSoanNhap } from '@/lib/noi-dung/ai-soan';

export async function aiSoan(f: FormData) {
  const nd = await yeuCauQuyen('noi_dung.soan');
  const id = String(f.get('id') ?? '').trim();
  const quayVe = `/quan-tri/noi-dung/${encodeURIComponent(id)}`;
  // Nhận "123 456", "123,456" hoặc "[D:123] [D:456]".
  const maDoan = [...String(f.get('maDoan') ?? '').matchAll(/\d{1,18}/g)].map((m) => m[0]);
  const yeuCau = String(f.get('yeuCau') ?? '');
  let url: string;
  if (!id || !maDoan.length) {
    url = `${quayVe}?loi=${encodeURIComponent('Cần ít nhất một mã đoạn nguồn công khai')}`;
  } else {
    const kq = await aiSoanNhap(prisma, nd, { noiDungId: id, maDoan, yeuCau });
    const boQua = kq.biLoai?.length ? ` Bỏ qua ${kq.biLoai.length} mã không công khai hoặc không tồn tại: ${kq.biLoai.join(', ')}.` : '';
    url = kq.ok
      ? `${quayVe}?${kq.datTrichDan ? 'bao' : 'loi'}=${encodeURIComponent(
          kq.datTrichDan
            ? `AI đã soạn phiên bản v${kq.so} (nháp). Biên tập đọc lại trước khi gửi duyệt.${boQua}`
            : `AI đã soạn phiên bản v${kq.so} nhưng trích dẫn chưa đạt (${kq.soLoi} lỗi): sửa trước khi gửi duyệt.${boQua}`,
        )}`
      : `${quayVe}?loi=${encodeURIComponent(`AI soạn không thành: ${kq.loi}${boQua}`)}`;
  }
  revalidatePath(quayVe);
  redirect(url);
}

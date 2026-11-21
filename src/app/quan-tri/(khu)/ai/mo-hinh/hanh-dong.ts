'use server';
// Cấu hình mô hình LLM (9router). Chỉ quản trị. Khóa API không đi qua đây: nó chỉ ở biến môi trường.
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';
import { chuanHoa, docCauHinhLlm, goiLlm, KHOA_CAI_DAT, xoaBoNhoCauHinh, type ViecLlm } from '@/lib/ai/cau-hinh-llm';

const DUONG = '/quan-tri/ai/mo-hinh';
const veLai = (bao: string, loi = false): never => redirect(`${DUONG}?${loi ? 'loi' : 'bao'}=${encodeURIComponent(bao)}`);
const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

export async function luuCauHinh(f: FormData) {
  const nd = await yeuCauQuyen('ai.tro_ly');
  const vao = {
    baseUrl: chu(f, 'baseUrl'),
    moHinh: { chat: chu(f, 'moHinhChat'), soan: chu(f, 'moHinhSoan') },
    nhietDo: { chat: chu(f, 'nhietDoChat'), soan: chu(f, 'nhietDoSoan') },
  };
  const sau = chuanHoa(vao);
  if (sau.moHinh.chat !== vao.moHinh.chat || sau.moHinh.soan !== vao.moHinh.soan) veLai('Tên mô hình không hợp lệ', true);
  if (sau.baseUrl !== vao.baseUrl.replace(/\/+$/, '')) veLai('Địa chỉ cổng phải bắt đầu bằng http:// hoặc https://', true);
  await prisma.$transaction(async (tx) => {
    const truoc = await tx.caiDat.findUnique({ where: { khoa: KHOA_CAI_DAT } });
    await tx.caiDat.upsert({ where: { khoa: KHOA_CAI_DAT }, create: { khoa: KHOA_CAI_DAT, giaTri: sau, suaBoiId: nd.id }, update: { giaTri: sau, suaBoiId: nd.id } });
    await ghiNhatKy(tx, nd, 'ai.doi_llm', 'CaiDat', KHOA_CAI_DAT, truoc?.giaTri ?? null, sau);
  });
  xoaBoNhoCauHinh();
  revalidatePath(DUONG);
  veLai('Đã lưu cấu hình mô hình. Có hiệu lực trong vòng 30 giây trên mọi tiến trình.');
}

export async function thuMoHinh(f: FormData) {
  await yeuCauQuyen('ai.tro_ly');
  const viec: ViecLlm = chu(f, 'viec') === 'soan' ? 'soan' : 'chat';
  const ch = await docCauHinhLlm(true);
  const kq = await goiLlm(viec, [{ role: 'user', content: 'Trả lời đúng một từ: OK' }], { cauHinh: ch, maxTokens: 16, hetGioMs: 60_000 });
  if (!kq.ok) veLai(`Thử ${ch.moHinh[viec]} thất bại sau ${kq.ms} ms: ${kq.loi}`, true);
  else veLai(`Thử ${ch.moHinh[viec]}: đạt, ${kq.ms} ms, trả lời "${kq.vanBan.trim().slice(0, 40)}" (mô hình báo về: ${kq.moHinh}).`);
}

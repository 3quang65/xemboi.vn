'use server';
// Server action sửa cấu hình trợ lý AI (Đợt 2 - Lệnh 22). Chỉ quản trị (quyền ai.tro_ly).
// Không cấu hình mô hình LLM hay khóa kết nối ở đây; với systemPrompt chỉ lưu độ dài và sha256 vào nhật ký.
import crypto from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { boCacheTroLy } from '@/lib/ai/few-shot';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ghiNhatKy, yeuCauQuyen } from '@/lib/quan-tri/phien';

class LoiNghiepVu extends Error {}

const DUONG = '/quan-tri/ai/tro-ly';
const chu = (f: FormData, k: string) => String(f.get(k) ?? '').trim();

function veLai(chon: string | null, bao: string, loi = false): never {
  const u = new URLSearchParams();
  if (chon) u.set('chon', chon);
  u.set(loi ? 'loi' : 'bao', bao);
  redirect(`${DUONG}?${u.toString()}`);
}

function bamTomTatPrompt(prompt: string) {
  return {
    doDai: prompt.length,
    sha256: crypto.createHash('sha256').update(prompt, 'utf8').digest('hex'),
  };
}

function anhChupTroLy(a: {
  name: string;
  title: string;
  systemPrompt: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
  voiceProvider: string;
  voiceId: string;
  voiceSpeed: number;
  voicePitch: string;
  isActive: boolean;
}) {
  return {
    name: a.name,
    title: a.title,
    systemPrompt: bamTomTatPrompt(a.systemPrompt),
    welcomeMessage: a.welcomeMessage,
    suggestedQuestions: a.suggestedQuestions,
    voiceProvider: a.voiceProvider,
    voiceId: a.voiceId,
    voiceSpeed: a.voiceSpeed,
    voicePitch: a.voicePitch,
    isActive: a.isActive,
  };
}

export async function suaTroLy(f: FormData) {
  const nd = await yeuCauQuyen('ai.tro_ly');

  const id = chu(f, 'id');
  if (!id) veLai(null, 'Thiếu mã trợ lý', true);

  const name = chu(f, 'name');
  const title = chu(f, 'title');
  const systemPrompt = String(f.get('systemPrompt') ?? '').replace(/\r\n/g, '\n').trim();
  const welcomeMessage = String(f.get('welcomeMessage') ?? '').replace(/\r\n/g, '\n').trim();
  const suggestedQuestions = String(f.get('suggestedQuestions') ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  const voiceProvider = chu(f, 'voiceProvider');
  const voiceId = chu(f, 'voiceId');
  const rawTocDo = chu(f, 'voiceSpeed');
  const voiceSpeed = Number(rawTocDo);
  const voicePitch = chu(f, 'voicePitch') || 'default';
  const isActive = f.get('isActive') === 'on';

  if (!name || !title) veLai(id, 'Cần nhập tên và chức danh trợ lý', true);
  if (!systemPrompt || !welcomeMessage) veLai(id, 'Cần nhập lời chào và chỉ dẫn hệ thống (systemPrompt)', true);
  if (!voiceProvider || !voiceId) veLai(id, 'Cần nhập nhà cung cấp và mã giọng đọc', true);
  if (!rawTocDo || !Number.isFinite(voiceSpeed) || voiceSpeed < 0.5 || voiceSpeed > 2.0) {
    veLai(id, 'Tốc độ giọng đọc phải nằm trong khoảng 0.5 đến 2.0', true);
  }

  let loi: string | null = null;

  try {
    await prisma.$transaction(async (tx) => {
      const truoc = await tx.aiAgent.findUnique({ where: { id } });
      if (!truoc) {
        throw new LoiNghiepVu('Không tìm thấy bản ghi trợ lý trong cơ sở dữ liệu.');
      }

      const sau = await tx.aiAgent.update({
        where: { id },
        data: {
          name,
          title,
          systemPrompt,
          welcomeMessage,
          suggestedQuestions,
          voiceProvider,
          voiceId,
          voiceSpeed,
          voicePitch,
          isActive,
        },
      });

      await ghiNhatKy(tx, nd, 'ai.sua_tro_ly', 'AiAgent', id, anhChupTroLy(truoc), anhChupTroLy(sau));
    });
  } catch (e: unknown) {
    loi = e instanceof LoiNghiepVu ? e.message : 'Không lưu được cấu hình trợ lý. Vui lòng thử lại.';
  }

  if (loi) veLai(id, loi, true);

  boCacheTroLy(); // chat đọc bản sửa ngay ở lượt sau
  revalidatePath(DUONG);
  veLai(id, 'Đã lưu cấu hình trợ lý và ghi nhật ký.');
}

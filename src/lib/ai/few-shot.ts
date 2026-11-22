// Mẫu đối thoại few-shot của các thầy: lưu trong CaiDat (khóa AI_FEW_SHOT), không ghi đè tệp mã nguồn lúc chạy.
// few-shot-dialogues.json chỉ là bản mặc định khi CaiDat chưa có khóa này (lần đầu, hoặc CSDL lỗi).
import type { Prisma, PrismaClient } from '@prisma/client';
import macDinh from './few-shot-dialogues.json';

export type MauFewShot = { agentSlug: string; agentName: string; userQuestion: string; goldenAnswer: string; createdAt?: string };
export const KHOA_FEW_SHOT = 'AI_FEW_SHOT';

const hopLe = (x: unknown): x is MauFewShot => {
  const m = x as MauFewShot;
  return !!m && typeof m.agentSlug === 'string' && typeof m.userQuestion === 'string' && typeof m.goldenAnswer === 'string';
};
const chuanHoa = (ds: unknown): MauFewShot[] =>
  (Array.isArray(ds) ? ds : []).filter(hopLe).map((m) => ({ ...m, agentName: m.agentName || m.agentSlug }));

// Bản trong bộ nhớ để agent-persona (hàm đồng bộ) đọc được; làm mới tối đa 5 phút một lần.
let boNho: { luc: number; ds: MauFewShot[] } = { luc: 0, ds: chuanHoa(macDinh) };

export function fewShotTrongBoNho(): MauFewShot[] {
  return boNho.ds;
}

type Db = PrismaClient | Prisma.TransactionClient;

export async function docFewShot(db: Db): Promise<MauFewShot[]> {
  const cd = await db.caiDat.findUnique({ where: { khoa: KHOA_FEW_SHOT } });
  const ds = cd ? chuanHoa(cd.giaTri) : chuanHoa(macDinh);
  boNho = { luc: Date.now(), ds };
  return ds;
}

// Trợ lý sửa trong /quan-tri/ai/tro-ly (bảng AiAgent): ghi đè cấu hình mặc định trong agent-persona.ts.
export type TroLyCsdl = { name: string; title: string; avatarUrl: string | null; temperature: number; systemPrompt: string; welcomeMessage: string; suggestedQuestions: string[]; isActive: boolean };
let troLy = new Map<string, TroLyCsdl>();
let lanLamMoi = 0; // mốc riêng: docFewShot gọi từ trang quản trị không được làm lỡ việc nạp trợ lý
export function troLyTuCsdl(slug: string): TroLyCsdl | undefined {
  return troLy.get(slug);
}

/** Gọi trước khi dựng prompt: làm mới mẫu few-shot và trợ lý từ CSDL, tối đa 5 phút một lần; lỗi CSDL thì giữ bản cũ. */
export async function lamMoiFewShot(db: PrismaClient, toiDaMs = 300_000): Promise<void> {
  if (Date.now() - lanLamMoi < toiDaMs) return;
  lanLamMoi = Date.now();
  try {
    const [, ds] = await Promise.all([
      docFewShot(db),
      db.aiAgent.findMany({ select: { slug: true, name: true, title: true, avatarUrl: true, temperature: true, systemPrompt: true, welcomeMessage: true, suggestedQuestions: true, isActive: true } }),
    ]);
    troLy = new Map(ds.map(({ slug, ...x }) => [slug, x]));
  } catch { /* giữ bản cũ, thử lại sau toiDaMs */ }
}

/** Gọi sau khi sửa một trợ lý để lần chat kế tiếp đọc ngay. */
export function boCacheTroLy() {
  lanLamMoi = 0;
}

/** Ghi cả danh sách (trong giao dịch của người gọi, để ghi nhật ký cùng lúc). */
export async function ghiFewShot(tx: Db, ds: MauFewShot[]): Promise<MauFewShot[]> {
  const sach = chuanHoa(ds);
  await tx.caiDat.upsert({
    where: { khoa: KHOA_FEW_SHOT },
    create: { khoa: KHOA_FEW_SHOT, giaTri: sach as unknown as Prisma.InputJsonValue },
    update: { giaTri: sach as unknown as Prisma.InputJsonValue },
  });
  boNho = { luc: Date.now(), ds: sach };
  return sach;
}

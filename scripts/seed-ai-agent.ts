// Nạp các thầy mặc định (src/lib/ai/agent-persona.ts) vào bảng AiAgent, và mẫu few-shot vào CaiDat AI_FEW_SHOT.
// Chỉ TẠO bản ghi còn thiếu, không đè trợ lý đã sửa trong /quan-tri/ai/tro-ly. Có nhật ký 'ai.seed_tro_ly'.
// Chạy: npx tsx --env-file=.env scripts/seed-ai-agent.ts --thu   (chỉ in, không ghi)
//       npx tsx --env-file=.env scripts/seed-ai-agent.ts
import { PrismaClient } from '@prisma/client';
import { DEFAULT_AGENTS } from '../src/lib/ai/agent-persona';
import { KHOA_FEW_SHOT, ghiFewShot, fewShotTrongBoNho } from '../src/lib/ai/few-shot';

(async () => {
  const thu = process.argv.includes('--thu');
  const db = new PrismaClient();
  try {
    const coSan = new Set((await db.aiAgent.findMany({ select: { slug: true } })).map((a) => a.slug));
    const thieu = DEFAULT_AGENTS.filter((a) => !coSan.has(a.slug));
    const coFewShot = !!(await db.caiDat.findUnique({ where: { khoa: KHOA_FEW_SHOT } }));
    // fewShotTrongBoNho() lúc này là bản mặc định từ few-shot-dialogues.json (chưa đọc CSDL).
    const mau = fewShotTrongBoNho();
    console.log(`Trợ lý: có sẵn ${coSan.size}, sẽ tạo ${thieu.length}: ${thieu.map((a) => a.slug).join(', ') || '(không)'}`);
    console.log(`Few-shot: ${coFewShot ? 'CaiDat đã có, giữ nguyên' : `sẽ ghi ${mau.length} mẫu mặc định`}`);
    if (thu) return console.log('--thu: không ghi gì.');
    await db.$transaction(async (tx) => {
      for (const a of thieu) {
        await tx.aiAgent.create({ data: {
          slug: a.slug, name: a.name, title: a.title, avatarUrl: a.avatarUrl, isActive: a.isActive ?? true,
          isDefault: a.slug === 'thay-minh-triet', modelProvider: a.modelProvider, modelName: a.modelName, temperature: a.temperature,
          systemPrompt: a.systemPrompt, welcomeMessage: a.welcomeMessage, suggestedQuestions: a.suggestedQuestions,
        } });
      }
      if (!coFewShot) await ghiFewShot(tx, mau);
      if (thieu.length || !coFewShot) await tx.nhatKyThaoTac.create({ data: {
        taiKhoanId: null, hanhDong: 'ai.seed_tro_ly', doiTuong: 'AiAgent', doiTuongId: null,
        sau: { taoTroLy: thieu.map((a) => a.slug), ghiFewShot: coFewShot ? 0 : mau.length, nguon: 'scripts/seed-ai-agent.ts' },
      } });
    });
    console.log('Đã ghi.');
  } finally {
    await db.$disconnect();
  }
})().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });

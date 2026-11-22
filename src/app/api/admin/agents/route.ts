// API trợ lý AI kiểu cũ. Khu /quan-tri/ai/* dùng server action riêng; route này giữ cho công cụ ngoài còn gọi.
// Chỉ nhận phiên tài khoản có quyền ai.tro_ly (không nhận ADMIN_KEY). Mọi thao tác ghi đều ghi NhatKyThaoTac.
// Mẫu few-shot lưu ở CaiDat AI_FEW_SHOT (src/lib/ai/few-shot.ts), không ghi đè tệp mã nguồn.
import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { kiemQuyenApi, ghiNhatKy } from '@/lib/quan-tri/phien';
import { DEFAULT_AGENTS } from '@/lib/ai/agent-persona';
import { getActiveLlmConfig, updateRuntimeLlmConfig, type LlmConfig } from '@/lib/ai/llm-provider';
import { docFewShot, ghiFewShot } from '@/lib/ai/few-shot';

const NHA_CUNG_CAP: LlmConfig['provider'][] = ['gemini', 'openai', 'deepseek', '9router', 'offline'];
const thongTinLlm = () => {
  const c = getActiveLlmConfig();
  return { provider: c.provider, modelName: c.modelName, temperature: c.temperature, hasApiKey: Boolean(c.apiKey) };
};
const tomTatPrompt = (s?: string | null) => (s ? { doDai: s.length, sha256: createHash('sha256').update(s).digest('hex').slice(0, 16) } : null);
const cat = (x: unknown, n: number) => (typeof x === 'string' ? x.trim().slice(0, n) : '');

export async function GET(req: Request) {
  const nd = await kiemQuyenApi(req, 'ai.tro_ly');
  if (nd instanceof Response) return nd;
  const [dbAgents, fewShotDialogues] = await Promise.all([
    prisma.aiAgent.findMany({ include: { _count: { select: { knowledgeDocs: true, conversations: true } } }, orderBy: { createdAt: 'asc' } }),
    docFewShot(prisma),
  ]);
  // CSDL chưa nạp trợ lý (scripts/seed-ai-agent.ts) thì trả cấu hình mặc định, ghi rõ nguồn, không bịa số đếm.
  const agents = dbAgents.length ? dbAgents : DEFAULT_AGENTS.map((a) => ({ ...a, id: a.id || `agent_${a.slug}`, _count: null }));
  return NextResponse.json({ ok: true, nguon: dbAgents.length ? 'csdl' : 'mac_dinh', agents, activeLlmConfig: thongTinLlm(), fewShotDialogues });
}

export async function POST(req: Request) {
  const nd = await kiemQuyenApi(req, 'ai.tro_ly');
  if (nd instanceof Response) return nd;
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'JSON không hợp lệ' }, { status: 400 }); }

  if (body.action === 'UPDATE_LLM_CONFIG') {
    // Khóa API chỉ đọc từ biến môi trường trên máy chủ, không nhận từ yêu cầu. Chỉ ghi những trường hợp lệ được gửi lên.
    const doi: Partial<LlmConfig> = {};
    if (NHA_CUNG_CAP.includes(body.provider as LlmConfig['provider'])) doi.provider = body.provider as LlmConfig['provider'];
    if (cat(body.modelName, 100)) doi.modelName = cat(body.modelName, 100);
    if (typeof body.temperature === 'number' && body.temperature >= 0 && body.temperature <= 2) doi.temperature = body.temperature;
    const truoc = thongTinLlm();
    updateRuntimeLlmConfig(doi);
    const sau = thongTinLlm();
    await ghiNhatKy(prisma, nd, 'ai.cau_hinh_llm', 'LlmRuntime', null, truoc, sau);
    return NextResponse.json({ ok: true, activeLlmConfig: sau });
  }

  if (body.action === 'ADD_FEW_SHOT') {
    const agentSlug = cat(body.agentSlug, 100), userQuestion = cat(body.userQuestion, 2000), goldenAnswer = cat(body.goldenAnswer, 8000);
    if (!agentSlug || !userQuestion || !goldenAnswer) return NextResponse.json({ ok: false, error: 'Thiếu thông tin mẫu đối thoại' }, { status: 400 });
    const moi = { agentSlug, agentName: cat(body.agentName, 200) || agentSlug, userQuestion, goldenAnswer, createdAt: new Date().toISOString() };
    const ds = await prisma.$transaction(async (tx) => {
      const cu = await docFewShot(tx);
      const sau = await ghiFewShot(tx, [...cu, moi]);
      await ghiNhatKy(tx, nd, 'ai.few_shot', 'CaiDat', 'AI_FEW_SHOT', { soMau: cu.length }, { soMau: sau.length, them: { agentSlug, doDaiHoi: userQuestion.length, doDaiDap: goldenAnswer.length } });
      return sau;
    });
    return NextResponse.json({ ok: true, fewShotDialogues: ds });
  }

  const slug = cat(body.slug, 100);
  if (!slug || !cat(body.name, 200) || !cat(body.systemPrompt, 50_000)) return NextResponse.json({ ok: false, error: 'Thiếu slug, name hoặc systemPrompt' }, { status: 400 });
  const duLieu = {
    name: cat(body.name, 200), title: cat(body.title, 300), avatarUrl: cat(body.avatarUrl, 500) || '/icons/icon.svg',
    modelProvider: cat(body.modelProvider, 50) || 'gemini', modelName: cat(body.modelName, 100) || 'gemini-1.5-flash',
    temperature: Math.min(2, Math.max(0, Number(body.temperature) || 0.65)),
    systemPrompt: cat(body.systemPrompt, 50_000), welcomeMessage: cat(body.welcomeMessage, 5000),
    suggestedQuestions: Array.isArray(body.suggestedQuestions) ? body.suggestedQuestions.filter((x): x is string => typeof x === 'string').slice(0, 12).map((x) => x.slice(0, 300)) : [],
  };
  const agent = await prisma.$transaction(async (tx) => {
    const truoc = await tx.aiAgent.findUnique({ where: { slug } });
    const sau = await tx.aiAgent.upsert({ where: { slug }, update: duLieu, create: { slug, ...duLieu } });
    const gon = (a: typeof sau | null) => a && { slug: a.slug, name: a.name, title: a.title, modelProvider: a.modelProvider, modelName: a.modelName, temperature: a.temperature, systemPrompt: tomTatPrompt(a.systemPrompt) };
    await ghiNhatKy(tx, nd, 'ai.sua_tro_ly', 'AiAgent', sau.id, gon(truoc), gon(sau));
    return sau;
  });
  return NextResponse.json({ ok: true, data: agent });
}

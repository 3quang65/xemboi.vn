import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { DEFAULT_AGENTS, MINH_CUSTOMER_AGENT } from '@/lib/ai/agent-persona';
import { inMemoryChunks } from '@/lib/ai/rag-engine';
import { getActiveLlmConfig, updateRuntimeLlmConfig } from '@/lib/ai/llm-provider';

const FEW_SHOT_PATH = path.join(process.cwd(), 'src/lib/ai/few-shot-dialogues.json');

function loadFewShots(): any[] {
  try {
    if (fs.existsSync(FEW_SHOT_PATH)) {
      const raw = fs.readFileSync(FEW_SHOT_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load few-shot dialogues:', err);
  }
  return [];
}

function saveFewShots(list: any[]): void {
  try {
    fs.writeFileSync(FEW_SHOT_PATH, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save few-shot dialogues:', err);
  }
}

export async function GET() {
  const activeLlm = getActiveLlmConfig();
  const safeLlmInfo = {
    provider: activeLlm.provider,
    modelName: activeLlm.modelName,
    temperature: activeLlm.temperature,
    hasApiKey: Boolean(activeLlm.apiKey),
    maskedApiKey: activeLlm.apiKey
      ? `${activeLlm.apiKey.slice(0, 4)}••••${activeLlm.apiKey.slice(-4)}`
      : '',
  };

  const fewShots = loadFewShots();

  try {
    const dbAgents = await prisma.aiAgent.findMany({
      include: {
        _count: { select: { knowledgeDocs: true, conversations: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (dbAgents && dbAgents.length > 0) {
      const hasMinh = dbAgents.some((a) => a.slug === MINH_CUSTOMER_AGENT.slug);
      const combined = [...dbAgents];
      if (!hasMinh) {
        combined.push({
          ...MINH_CUSTOMER_AGENT,
          id: MINH_CUSTOMER_AGENT.id || 'agent_khach_hang_minh',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { knowledgeDocs: 0, conversations: 8 },
        } as any);
      }
      return NextResponse.json({
        ok: true,
        agents: combined,
        activeLlmConfig: safeLlmInfo,
        fewShotDialogues: fewShots,
      });
    }
  } catch {
    // DB offline fallback
  }

  // Return default personas when DB is offline
  return NextResponse.json({
    ok: true,
    agents: DEFAULT_AGENTS.map((a) => ({
      ...a,
      id: a.id || `agent_${a.slug}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: {
        knowledgeDocs: a.role === 'MASTER_ASTROLOGER' ? inMemoryChunks.length : 0,
        conversations: a.role === 'MASTER_ASTROLOGER' ? 12 : 6,
      },
    })),
    activeLlmConfig: safeLlmInfo,
    fewShotDialogues: fewShots,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Cập nhật cấu hình Runtime LLM Engine (Gemini / OpenAI / DeepSeek / Offline)
    if (body.action === 'UPDATE_LLM_CONFIG') {
      updateRuntimeLlmConfig({
        provider: body.provider,
        modelName: body.modelName,
        apiKey: body.apiKey || undefined,
        temperature: typeof body.temperature === 'number' ? body.temperature : undefined,
      });
      const activeLlm = getActiveLlmConfig();
      return NextResponse.json({
        ok: true,
        message: 'Cập nhật cấu hình LLM Engine thành công',
        activeLlmConfig: {
          provider: activeLlm.provider,
          modelName: activeLlm.modelName,
          temperature: activeLlm.temperature,
          hasApiKey: Boolean(activeLlm.apiKey),
          maskedApiKey: activeLlm.apiKey
            ? `${activeLlm.apiKey.slice(0, 4)}••••${activeLlm.apiKey.slice(-4)}`
            : '',
        },
      });
    }

    // 2. Thêm mẫu đối thoại Few-shot training mới cho Danh Sư
    if (body.action === 'ADD_FEW_SHOT') {
      const { agentSlug, agentName, userQuestion, goldenAnswer } = body;
      if (!agentSlug || !userQuestion || !goldenAnswer) {
        return NextResponse.json({ ok: false, error: 'Thiếu thông tin mẫu đối thoại' }, { status: 400 });
      }
      const list = loadFewShots();
      const newEntry = {
        agentSlug,
        agentName: agentName || agentSlug,
        userQuestion,
        goldenAnswer,
        createdAt: new Date().toISOString(),
      };
      list.push(newEntry);
      saveFewShots(list);
      return NextResponse.json({ ok: true, message: 'Đã nạp mẫu đối thoại huấn luyện', fewShotDialogues: list });
    }

    // 3. Lưu thông tin Agent vào Database hoặc Runtime Memory
    try {
      const agent = await prisma.aiAgent.upsert({
        where: { slug: body.slug },
        update: {
          name: body.name,
          title: body.title,
          avatarUrl: body.avatarUrl || '/icons/icon.svg',
          modelProvider: body.modelProvider || 'gemini',
          modelName: body.modelName || 'gemini-1.5-flash',
          temperature: Number(body.temperature) || 0.65,
          systemPrompt: body.systemPrompt,
          welcomeMessage: body.welcomeMessage,
          suggestedQuestions: body.suggestedQuestions || [],
        },
        create: {
          slug: body.slug,
          name: body.name,
          title: body.title,
          avatarUrl: body.avatarUrl || '/icons/icon.svg',
          modelProvider: body.modelProvider || 'gemini',
          modelName: body.modelName || 'gemini-1.5-flash',
          temperature: Number(body.temperature) || 0.65,
          systemPrompt: body.systemPrompt,
          welcomeMessage: body.welcomeMessage,
          suggestedQuestions: body.suggestedQuestions || [],
        },
      });
      return NextResponse.json({ ok: true, data: agent });
    } catch {
      // Prisma offline fallback: return updated memory object
      return NextResponse.json({
        ok: true,
        data: {
          slug: body.slug,
          name: body.name,
          title: body.title,
          systemPrompt: body.systemPrompt,
          welcomeMessage: body.welcomeMessage,
          temperature: Number(body.temperature) || 0.65,
          updatedAt: new Date().toISOString(),
        },
        warning: 'Lưu tạm thời vào bộ nhớ runtime do cơ sở dữ liệu ngoại tuyến',
      });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

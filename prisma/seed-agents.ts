import { PrismaClient } from '@prisma/client';
import { BAT_DAI_DANH_SU, MINH_CUSTOMER_AGENT } from '../src/lib/ai/agent-persona';

const prisma = new PrismaClient();

async function main() {
  console.log('☯️ BẮT ĐẦU SEED "BÁT ĐẠI DANH SƯ" (8 AI AGENTS) VÀO DATABASE XEMBOI.VN...');

  const allAgents = [...BAT_DAI_DANH_SU, MINH_CUSTOMER_AGENT];

  for (const agent of allAgents) {
    const upserted = await prisma.aiAgent.upsert({
      where: { slug: agent.slug },
      update: {
        name: agent.name,
        title: agent.title,
        avatarUrl: agent.avatarUrl,
        modelProvider: agent.modelProvider,
        modelName: agent.modelName,
        temperature: agent.temperature,
        systemPrompt: agent.systemPrompt,
        welcomeMessage: agent.welcomeMessage,
        suggestedQuestions: agent.suggestedQuestions,
        isActive: agent.isActive ?? true,
        isDefault: agent.isDefault ?? false,
      },
      create: {
        id: agent.id,
        slug: agent.slug,
        name: agent.name,
        title: agent.title,
        avatarUrl: agent.avatarUrl,
        modelProvider: agent.modelProvider,
        modelName: agent.modelName,
        temperature: agent.temperature,
        systemPrompt: agent.systemPrompt,
        welcomeMessage: agent.welcomeMessage,
        suggestedQuestions: agent.suggestedQuestions,
        isActive: agent.isActive ?? true,
        isDefault: agent.isDefault ?? false,
      },
    });

    console.log(`✓ Đã nạp thành công Agent: [${upserted.name}] - ${upserted.title} (Slug: ${upserted.slug})`);
  }

  console.log('🎉 HOÀN TẤT SEED 8 VỊ DANH SƯ VÀO HỆ THỐNG XEMBOI.VN!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed AI Agents:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

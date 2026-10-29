import { PrismaClient } from '@prisma/client';
import seededDocs from '../src/lib/ai/seeded-knowledge-8-agents.json';

const prisma = new PrismaClient();

async function main() {
  console.log('📚 BẮT ĐẦU NẠP KHO TRI THỨC RAG CHUYÊN BIỆT CHO 8 AI AGENTS...');

  for (const doc of seededDocs) {
    // 1. Find the agent by slug
    const agent = await prisma.aiAgent.findUnique({
      where: { slug: doc.agentSlug },
    });

    if (!agent) {
      console.warn(`⚠️ Không tìm thấy Agent có slug: ${doc.agentSlug}, bỏ qua tài liệu "${doc.title}"`);
      continue;
    }

    // 2. Upsert knowledge doc
    const existingDoc = await prisma.agentKnowledgeDoc.findFirst({
      where: {
        agentId: agent.id,
        title: doc.title,
      },
    });

    let docRecord;
    if (existingDoc) {
      docRecord = await prisma.agentKnowledgeDoc.update({
        where: { id: existingDoc.id },
        data: {
          category: doc.category,
          rawContent: doc.content,
          status: 'INDEXED',
        },
      });
    } else {
      docRecord = await prisma.agentKnowledgeDoc.create({
        data: {
          agentId: agent.id,
          title: doc.title,
          category: doc.category,
          sourceType: 'SEEDED',
          rawContent: doc.content,
          status: 'INDEXED',
        },
      });
    }

    // 3. Create or update knowledge chunk
    const existingChunk = await prisma.agentKnowledgeChunk.findFirst({
      where: { docId: docRecord.id },
    });

    if (existingChunk) {
      await prisma.agentKnowledgeChunk.update({
        where: { id: existingChunk.id },
        data: {
          content: doc.content,
          metadata: {
            tags: doc.tags,
            agentSlug: doc.agentSlug,
            agentName: doc.agentName,
          },
        },
      });
    } else {
      await prisma.agentKnowledgeChunk.create({
        data: {
          docId: docRecord.id,
          content: doc.content,
          metadata: {
            tags: doc.tags,
            agentSlug: doc.agentSlug,
            agentName: doc.agentName,
          },
        },
      });
    }

    console.log(`✓ Đã nạp tri thức: [${doc.agentName}] - 《${doc.title}》 (${doc.category})`);
  }

  console.log('🎉 HOÀN TẤT NẠP TOÀN BỘ KHO TRI THỨC RAG CHO BÁT ĐẠI DANH SƯ!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed knowledge 8 agents:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

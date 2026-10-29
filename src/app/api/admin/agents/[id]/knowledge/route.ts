import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inMemoryChunks } from '@/lib/ai/rag-engine';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const docs = await prisma.agentKnowledgeDoc.findMany({
      where: { agentId: id },
      include: { chunks: { select: { id: true, metadata: true } } },
      orderBy: { createdAt: 'desc' },
    });
    if (docs && docs.length > 0) {
      return NextResponse.json({ ok: true, docs });
    }
  } catch {}

  return NextResponse.json({
    ok: true,
    docs: inMemoryChunks.map((c, i) => ({
      id: `doc_${i}`,
      title: c.docTitle,
      category: c.category,
      sourceType: 'SEEDED',
      status: 'INDEXED',
      rawContent: c.content,
      chunks: [{ id: c.id, metadata: c.metadata }],
    })),
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, category, rawContent } = body;

    if (!title || !rawContent) {
      return NextResponse.json({ ok: false, error: 'Title and content are required' }, { status: 400 });
    }

    try {
      const doc = await prisma.agentKnowledgeDoc.create({
        data: {
          agentId: id,
          title,
          category: category || 'TU_VI',
          sourceType: 'MANUAL_UPLOAD',
          rawContent,
          status: 'INDEXED',
        },
      });

      await prisma.agentKnowledgeChunk.create({
        data: {
          docId: doc.id,
          content: rawContent,
          metadata: { title },
        },
      });

      return NextResponse.json({ ok: true, data: doc });
    } catch {
      // In-memory addition
      const chunkId = `manual_chunk_${Date.now()}`;
      inMemoryChunks.push({
        id: chunkId,
        docTitle: title,
        category: category || 'TU_VI',
        content: rawContent,
        metadata: { title },
      });
      return NextResponse.json({ ok: true, data: { id: chunkId, title, category, status: 'INDEXED' } });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

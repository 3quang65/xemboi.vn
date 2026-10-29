import { streamChatResponse } from '@/lib/ai/rag-engine';
import { upsertCustomerLead } from '@/lib/crm/customer-service';
import { prisma } from '@/lib/prisma';
import { cacheGet } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [], chartData, activeChartId, visitorId, agentSlug } = body;

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }

    // Try to resolve chart data if activeChartId is passed
    let activeChart = chartData;
    if (!activeChart && activeChartId) {
      const cached = await cacheGet<any>(`chart:${activeChartId}`);
      if (cached?.laSo) {
        activeChart = cached.laSo;
      } else {
        try {
          const dbChart = await prisma.horoscopeChart.findFirst({
            where: { OR: [{ id: activeChartId }, { slug: activeChartId }] },
          });
          if (dbChart) activeChart = dbChart;
        } catch {}
      }
    }

    // Award lead score for asking Thầy Bói
    if (visitorId) {
      upsertCustomerLead({
        visitorId,
        scoreBonus: 3,
        tagToAdd: 'Đã chat với Thầy Bói',
      }).catch(() => {});
    }

    // Prepare SSE Stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = streamChatResponse({
            userMessage: message,
            conversationHistory,
            chartData: activeChart,
            agentSlug,
          });

          let fullResponseText = '';
          let citedSources: string[] = [];

          for await (const chunk of generator) {
            fullResponseText += chunk;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)
            );
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, fullText: fullResponseText, citedSources })}\n\n`
            )
          );
          controller.close();
        } catch (err: any) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: err.message || 'Stream error' })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

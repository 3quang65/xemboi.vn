import { NextResponse } from 'next/server';
import { getNextSimulationTurn } from '@/lib/ai/dialogue-simulation';
import { getMinhChart } from '@/lib/ai/agent-persona';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages = [], speaker = 'minh' } = body;
    const chart = getMinhChart();

    const nextMsg = await getNextSimulationTurn({
      messages,
      speaker,
      chart,
    });

    return NextResponse.json({
      ok: true,
      message: nextMsg,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || 'Lỗi mô phỏng đối thoại' },
      { status: 500 }
    );
  }
}

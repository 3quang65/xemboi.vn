import { kiemQuyenApi } from '@/lib/quan-tri/phien';
import { NextResponse } from 'next/server';
import { getNextSimulationTurn } from '@/lib/ai/dialogue-simulation';
import { getMinhChart } from '@/lib/ai/agent-persona';

export async function POST(req: Request) {
  const nd = await kiemQuyenApi(req, 'hoi_thoai.xem'); // chỉ phiên tài khoản, không nhận ADMIN_KEY
  if (nd instanceof Response) return nd;
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

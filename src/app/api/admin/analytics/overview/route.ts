import { yeuCauQuanTri } from '@/lib/r1/admin-auth';
import { NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/tracking/tracker-server';

export async function GET(req: Request) {
  const chan = yeuCauQuanTri(req);
  if (chan) return chan;
  const summary = await getAnalyticsSummary();
  return NextResponse.json({ ok: true, data: summary });
}

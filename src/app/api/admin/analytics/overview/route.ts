import { NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/tracking/tracker-server';

export async function GET() {
  const summary = await getAnalyticsSummary();
  return NextResponse.json({ ok: true, data: summary });
}

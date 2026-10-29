import { NextResponse } from 'next/server';
import { recordHeartbeat } from '@/lib/tracking/tracker-server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const vid = body.visitorId || 'anon';
    const result = await recordHeartbeat(vid);
    return NextResponse.json({ ok: true, onlineCount: result.onlineCount });
  } catch {
    return NextResponse.json({ ok: true, onlineCount: 1 });
  }
}

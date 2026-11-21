import { yeuCauQuanTri } from '@/lib/quan-tri/cu';
import { NextResponse } from 'next/server';
import { listCustomers, upsertCustomerLead } from '@/lib/crm/customer-service';

export async function GET(req: Request) {
  const chan = await yeuCauQuanTri(req);
  if (chan) return chan;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const search = searchParams.get('search') || undefined;
  const tag = searchParams.get('tag') || undefined;

  const result = await listCustomers({ page, limit, search, tag });
  return NextResponse.json({ ok: true, ...result });
}

export async function POST(req: Request) {
  const chan = await yeuCauQuanTri(req);
  if (chan) return chan;
  try {
    const body = await req.json();
    const result = await upsertCustomerLead(body);
    return NextResponse.json({ ok: true, data: result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

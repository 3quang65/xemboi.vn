import { yeuCauQuanTri } from '@/lib/quan-tri/cu';
import { NextResponse } from 'next/server';
import { getCustomerDetail, updateCustomer } from '@/lib/crm/customer-service';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const chan = await yeuCauQuanTri(req);
  if (chan) return chan;
  const { id } = await params;
  const customer = await getCustomerDetail(id);
  if (!customer) {
    return NextResponse.json({ ok: false, error: 'Customer not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, data: customer });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const chan = await yeuCauQuanTri(req);
  if (chan) return chan;
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateCustomer(id, body);
    return NextResponse.json({ ok: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

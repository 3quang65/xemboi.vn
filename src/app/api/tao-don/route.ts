import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const maDon = 'XB' + Math.random().toString(36).substring(2, 8).toUpperCase();
  return NextResponse.json({
    ok: true,
    maDon,
    trangThai: 'PAID',
    soTien: 0,
    loai: body.loai || 'luan_la_so',
  });
}

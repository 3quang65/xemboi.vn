import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ma = searchParams.get('ma') || 'XB000000';
  return NextResponse.json({
    ok: true,
    maDon: ma,
    trangThai: 'PAID',
    daThanhToan: true,
  });
}

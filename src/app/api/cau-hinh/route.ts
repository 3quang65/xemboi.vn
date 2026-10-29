import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    mienPhi: true,
    gia: 199000,
    stk: '8886866789',
    nganHang: '970432',
    tenNganHang: 'VPBank',
    chuTk: 'XEMBOI VN',
    brand: 'XemBoi.vn',
  });
}

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    stk: '8886866789',
    nganHang: '970432',
    tenNganHang: 'VPBank',
    chuTk: 'XEMBOI VN',
    gia: 199000,
  });
}

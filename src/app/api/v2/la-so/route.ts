// POST /api/v2/la-so: lập lá số cho trang /tu-vi/lap-la-so. Không lưu, không ghi log nội dung ngày sinh.
import { NextResponse } from 'next/server';
import { lapLaSoCongKhai } from '@/lib/trang/la-so';

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = (await req.json()) as Record<string, unknown>; } catch { return NextResponse.json({ ok: false, loi: 'Dữ liệu gửi lên không hợp lệ.' }, { status: 400 }); }
  const kq = lapLaSoCongKhai(body ?? {});
  return NextResponse.json(kq, { status: kq.ok ? 200 : 400, headers: { 'Cache-Control': 'no-store' } });
}

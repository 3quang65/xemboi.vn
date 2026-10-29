import { NextResponse } from 'next/server';
import { searchExternalInquiries, importDiscoveredInquiries } from '@/lib/ai/customer-inquiry-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    const results = await searchExternalInquiries(query);
    return NextResponse.json({
      ok: true,
      query,
      count: results.length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Danh sách nạp trống' }, { status: 400 });
    }

    const importedCount = importDiscoveredInquiries(items);
    return NextResponse.json({
      ok: true,
      importedCount,
      message: `Đã nhập thành công ${importedCount} câu hỏi mới vào kho dữ liệu backend!`,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

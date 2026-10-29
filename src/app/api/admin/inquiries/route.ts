import { NextResponse } from 'next/server';
import { getAllInquiries, addInquiry } from '@/lib/ai/customer-inquiry-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'ALL';
    const cungTen = searchParams.get('cungTen') || 'ALL';
    const query = searchParams.get('query') || '';
    const frequency = searchParams.get('frequency') || 'ALL';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const result = getAllInquiries({
      category,
      cungTen,
      query,
      frequency,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.question || !body.category) {
      return NextResponse.json(
        { ok: false, error: 'Thiếu câu hỏi (question) hoặc chuyên mục (category)' },
        { status: 400 }
      );
    }

    const created = addInquiry(body);
    return NextResponse.json({ ok: true, inquiry: created });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

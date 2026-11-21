import { NextRequest, NextResponse } from 'next/server';
import { yeuCauQuanTri } from '@/lib/quan-tri/cu';
import { docToanBoDuLieuR1, R1DatabaseUnavailableError } from '@/lib/r1/store';
import { tinhPheuR1, xuatCsvLeads, xuatCsvPheu } from '@/lib/r1/metrics';

export async function GET(req: NextRequest) {
  const chan = await yeuCauQuanTri(req, 'r1.xem');
  if (chan) return chan;

  try {
    const loai = req.nextUrl.searchParams.get('loai') === 'leads' ? 'leads' : 'pheu';
    const { events, leads } = await docToanBoDuLieuR1();
    const ngay = new Date().toISOString().slice(0, 10);

    if (loai === 'leads') {
      const csv = xuatCsvLeads(leads);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="r1-leads-${ngay}.csv"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    const baoCao = tinhPheuR1(events, leads);
    const csv = xuatCsvPheu(baoCao);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="r1-pheu-utm-${ngay}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    if (err instanceof R1DatabaseUnavailableError) {
      return NextResponse.json(
        { ok: false, loi: 'Hệ thống tạm bận, vui lòng thử lại sau ít phút.' },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { ok: false, loi: 'Hệ thống tạm bận, vui lòng thử lại sau ít phút.' },
      { status: 503 },
    );
  }
}

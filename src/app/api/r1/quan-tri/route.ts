import { NextRequest, NextResponse } from 'next/server';
import { yeuCauQuanTri } from '@/lib/quan-tri/cu';
import { docToanBoDuLieuR1, R1DatabaseUnavailableError } from '@/lib/r1/store';
import { tinhPheuR1 } from '@/lib/r1/metrics';

export async function GET(req: NextRequest) {
  const chan = await yeuCauQuanTri(req, 'r1.xem');
  if (chan) return chan;

  const isProduction = process.env.NODE_ENV === 'production';

  try {
    const { events, leads, storage } = await docToanBoDuLieuR1();
    const baoCao = tinhPheuR1(events, leads);
    const nowMs = Date.now();
    const soLeadQuaHan = leads.filter((l) => new Date(l.hanXoa).getTime() <= nowMs).length;

    return NextResponse.json({
      ok: true,
      storage,
      isProduction,
      tongSuKienTho: events.length,
      soLeadQuaHan,
      baoCao,
      leads,
    });
  } catch (err) {
    if (err instanceof R1DatabaseUnavailableError) {
      return NextResponse.json(
        {
          ok: false,
          storage: 'unavailable',
          isProduction,
          loi: 'Không thể kết nối kho dữ liệu PostgreSQL.',
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { ok: false, storage: 'unavailable', isProduction, loi: 'Hệ thống tạm bận, vui lòng thử lại sau ít phút.' },
      { status: 503 },
    );
  }
}

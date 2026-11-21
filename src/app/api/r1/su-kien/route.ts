import { NextResponse } from 'next/server';
import { luuSuKienR1, R1DatabaseUnavailableError } from '@/lib/r1/store';

/**
 * POST /api/r1/su-kien
 * Ghi nhận sự kiện ẩn danh của thí nghiệm R1 (hỗ trợ cả fetch JSON lẫn navigator.sendBeacon).
 * Tuyệt đối KHÔNG chấp nhận hay lưu ngày giờ sinh hoặc thông tin định danh.
 */
export async function POST(req: Request) {
  try {
    const text = await req.text();
    if (!text) {
      return NextResponse.json({ ok: false, loi: 'Thiếu dữ liệu sự kiện.' }, { status: 400 });
    }
    const raw = JSON.parse(text) as Record<string, unknown>;
    const ketQua = await luuSuKienR1(raw);
    return NextResponse.json(ketQua);
  } catch (err) {
    if (err instanceof R1DatabaseUnavailableError) {
      return NextResponse.json(
        { ok: false, loi: 'Hệ thống tạm bận, vui lòng thử lại sau ít phút.' },
        { status: 503 },
      );
    }
    const loi = err instanceof Error ? err.message : 'Sự kiện không hợp lệ.';
    return NextResponse.json({ ok: false, loi }, { status: 400 });
  }
}

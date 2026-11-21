import { NextResponse } from 'next/server';
import { luuLeadR1, R1DatabaseUnavailableError } from '@/lib/r1/store';

/**
 * POST /api/r1/lien-he
 * Lưu email/Zalo người dùng chủ động đăng ký nhận thông báo mở bán (bảng riêng R1Lead).
 * Không nhận và không lưu ngày giờ sinh hay mã phiên.
 */
export async function POST(req: Request) {
  try {
    const raw = (await req.json()) as Record<string, unknown>;
    const ketQua = await luuLeadR1(raw);
    return NextResponse.json({
      ok: true,
      id: ketQua.lead.id,
      hanXoa: ketQua.lead.hanXoa,
    });
  } catch (err) {
    if (err instanceof R1DatabaseUnavailableError) {
      return NextResponse.json(
        { ok: false, loi: 'Chưa lưu được, bạn thử lại sau ít phút.' },
        { status: 503 },
      );
    }
    const loi = err instanceof Error ? err.message : 'Không thể lưu đăng ký. Vui lòng thử lại.';
    return NextResponse.json({ ok: false, loi }, { status: 400 });
  }
}

// Tệp lịch .ics cho các ngày hợp nhất của một việc (Lệnh 41). Ví dụ: /xem-ngay/khai-truong/lich.ics?soNgay=60
// Chỉ có ngày và lý do ghép từ dữ liệu 3 lớp; không nhận và không ghi thông tin cá nhân.
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { laMaViec } from '@/lib/trang/xem-ngay';
import { chonNgayHopNhat, lichIcs } from '@/lib/trang/xem-ngay-truc-quan';

const KHOANG = new Set([30, 60, 90]);

export async function GET(req: Request, ctx: { params: Promise<unknown> }) {
  const { ma } = (await ctx.params) as { ma: string };
  if (!laMaViec(ma)) return new Response('Không có việc này.', { status: 404 });
  const so = Number(new URL(req.url).searchParams.get('soNgay') ?? 30);
  const soNgay = KHOANG.has(so) ? so : 30;
  const kq = chonNgayHopNhat(ma, ngayHienTaiVN(), soNgay, 3);
  return new Response(lichIcs(kq), {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': `attachment; filename="xemboi-${ma}-${soNgay}-ngay.ics"`,
      'cache-control': 'public, max-age=3600',
      'x-robots-tag': 'noindex',
    },
  });
}

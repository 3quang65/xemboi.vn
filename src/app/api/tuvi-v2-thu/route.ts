import { NextRequest, NextResponse } from 'next/server';
import { kiemTraThongTin, lapLaSo, type ThongTinSinh } from '@/lib/tuvi-v2';

/**
 * Route thử nghiệm chứng minh engine tuvi-v2 (am-lich.ts + tuvi-raw.js + index.ts)
 * build và chạy chuẩn trong Next.js App Router.
 * GET /api/tuvi-v2-thu?ngay=15&thang=8&nam=1990&gio=10&phut=30&gioiTinh=nam
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const ngay = Number(sp.get('ngay'));
  const thang = Number(sp.get('thang'));
  const nam = Number(sp.get('nam'));
  const gio = Number(sp.get('gio'));
  const phutRaw = sp.get('phut');
  const phut = phutRaw === null || phutRaw === '' ? 0 : Number(phutRaw);
  const gioiTinhRaw = sp.get('gioiTinh');
  const gioiTinh = gioiTinhRaw === 'nam' || gioiTinhRaw === 'nu' ? gioiTinhRaw : undefined;

  const input: Partial<ThongTinSinh> = {
    lich: 'duong',
    ngay,
    thang,
    nam,
    gio,
    phut,
    gioiTinh,
  };

  const loi = kiemTraThongTin(input);
  if (loi) {
    return NextResponse.json({ loi }, { status: 400 });
  }

  try {
    const laSo = lapLaSo(input as ThongTinSinh);
    return NextResponse.json(laSo, { status: 200 });
  } catch (err) {
    const thongDiep = err instanceof Error ? err.message : 'Lỗi lập lá số';
    return NextResponse.json({ loi: thongDiep }, { status: 400 });
  }
}

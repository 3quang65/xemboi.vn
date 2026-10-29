import { NextResponse } from 'next/server';
import { TuVi } from '@/lib/core/tuvi';
import { ThuVien } from '@/lib/core/thuvien';
import { ThayBa } from '@/lib/core/thayba';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const laSo =
      body.laSo ||
      TuVi.anLaSo({
        ten: body.ten || 'Quý khách',
        ngay: Number(body.ngay) || 15,
        thang: Number(body.thang) || 6,
        nam: Number(body.nam) || 1990,
        gio: Number(body.gio ?? 12),
        gioiTinh: body.gioiTinh || body.gt || 'nam',
        lich: body.lich || 'duong',
        nhuan: Boolean(body.nhuan),
        namXem: Number(body.namXem) || 2026,
      });
    const html = ThuVien.luan(laSo, body.hoi || '', body.hc || null) || ThayBa.luanCoBan(laSo, body.hoi || '');
    return NextResponse.json({ ok: true, baiLuan: html, laSo });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Error' },
      { status: 400 }
    );
  }
}

import { NextResponse } from 'next/server';
import { Lich } from '@/lib/core/lich';
import { ThuVien } from '@/lib/core/thuvien';
import { ThayBa } from '@/lib/core/thayba';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const kieu = body.loai === 'laman' ? 'laman' : 'vochong';
    const kq =
      body.kq ||
      Lich.xemHop(
        { nam: Number(body.namA) || 1990, gioi: body.gtA === 'nu' ? 'nu' : 'nam' },
        { nam: Number(body.namB) || 1992, gioi: body.gtB === 'nam' ? 'nam' : 'nu' },
        kieu
      );
    const html = ThuVien.luanHop(kq, kieu) || ThayBa.luanHopCoBan(kq);
    return NextResponse.json({ ok: true, baiLuan: html, kq });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Error' },
      { status: 400 }
    );
  }
}

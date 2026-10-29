import { NextResponse } from 'next/server';
import { TuVi } from '@/lib/core/tuvi';
import { buildChartSlug } from '@/lib/core/slug';
import { cacheGet, cacheSet } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const info = body.info || body;
    const laSo =
      body.laSo ||
      TuVi.anLaSo({
        ten: info.ten || 'Đương Số',
        ngay: Number(info.ngay) || 15,
        thang: Number(info.thang) || 6,
        nam: Number(info.nam) || 1990,
        gio: Number(info.gio ?? 12),
        gioiTinh: info.gt || info.gioiTinh || 'nam',
        lich: info.lich || 'duong',
        nhuan: Boolean(info.nhuan),
        namXem: Number(info.namXem) || 2026,
      });

    const slug =
      body.slug ||
      buildChartSlug({
        ten: laSo.ten,
        ngay: Number(info.ngay) || laSo.duong.ngay,
        thang: Number(info.thang) || laSo.duong.thang,
        nam: Number(info.nam) || laSo.duong.nam,
        gio: Number(info.gio ?? 12),
        gt: info.gt || 'nam',
        lich: info.lich || 'duong',
        nhuan: Boolean(info.nhuan),
        namXem: laSo.namXem,
        canChiNam: laSo.canChi.nam,
      });

    await cacheSet(`chart:${slug}`, { slug, info, laSo }, 86400);
    return NextResponse.json({ ok: true, slug, url: `/la-so/${slug}`, laSo });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (slug) {
    const cached = await cacheGet(`chart:${slug}`);
    if (cached) return NextResponse.json({ ok: true, data: cached });
  }
  return NextResponse.json({ ok: true, message: 'XemBoi.vn Horoscope API Ready' });
}

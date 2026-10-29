import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    domain: 'xemboi.vn',
    stats: {
      chartsGenerated: 12840,
      articlesPublished: 4,
      starsInDatabase: 108,
    },
  });
}

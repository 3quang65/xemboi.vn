import { NextResponse } from 'next/server';
import { recordTrackingEvent } from '@/lib/tracking/tracker-server';
import { upsertCustomerLead } from '@/lib/crm/customer-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { visitorId, eventType, path, metadata, referrer, userAgent } = body;

    if (!visitorId || !eventType) {
      return NextResponse.json({ ok: false, error: 'Missing visitorId or eventType' }, { status: 400 });
    }

    // 1. Record event
    const recordRes = await recordTrackingEvent({
      visitorId,
      eventType,
      path: path || '/',
      metadata,
      referrer,
      userAgent,
      deviceType: /Mobile|Android|iPhone/i.test(userAgent || '') ? 'Mobile' : 'Desktop',
    });

    // 2. Auto-Lead Capture in CRM if chart or contact was submitted
    if (eventType === 'GENERATE_CHART' && metadata) {
      upsertCustomerLead({
        visitorId,
        fullName: metadata.fullName || metadata.ten,
        gender: metadata.gender === 'nu' || metadata.gt === 'nu' ? 'NU' : 'NAM',
        solarBirthDate: metadata.solarBirthDate ? new Date(metadata.solarBirthDate) : undefined,
        lunarBirthInfo: {
          canChiYear: metadata.canChiYear || metadata.canChiNam || '',
          canChiMonth: metadata.canChiMonth || '',
          canChiDay: metadata.canChiDay || '',
          canChiHour: metadata.canChiHour || '',
          banMenh: metadata.banMenh || '',
          cucName: metadata.cucName || metadata.cuc || '',
        },
        chartId: metadata.slug || metadata.chartId,
        tagToAdd: 'Đã lập lá số',
        scoreBonus: 5,
      }).catch(() => {});
    } else if (eventType === 'DOWNLOAD_IMAGE') {
      upsertCustomerLead({
        visitorId,
        chartId: metadata?.chartId || metadata?.slug,
        tagToAdd: 'Đã tải ảnh lá số',
        scoreBonus: 10,
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true, data: recordRes });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

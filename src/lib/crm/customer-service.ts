import { prisma } from '@/lib/prisma';

export interface AutoLeadInput {
  visitorId: string;
  fullName?: string;
  gender?: 'NAM' | 'NU';
  solarBirthDate?: Date;
  lunarBirthInfo?: {
    canChiYear: string;
    canChiMonth: string;
    canChiDay: string;
    canChiHour: string;
    banMenh: string;
    cucName: string;
    gioDiaChi?: string;
  };
  phone?: string;
  email?: string;
  zaloId?: string;
  chartId?: string;
  tagToAdd?: string;
  scoreBonus?: number;
}

// In-memory CRM fallback store
const memoryCustomers = new Map<string, any>();

// Seed sample customer profiles for rich CRM demonstration if DB is empty
if (memoryCustomers.size === 0) {
  memoryCustomers.set('cust_sample_1', {
    id: 'cust_sample_1',
    visitorId: 'xb_v_sample_1',
    fullName: 'Nguyễn Văn An',
    phone: '0912345678',
    email: 'vanan.nguyen@gmail.com',
    gender: 'NAM',
    solarBirthDate: new Date('1990-06-15'),
    lunarBirthInfo: {
      canChiYear: 'Canh Ngọ',
      banMenh: 'Lộ Bàng Thổ',
      cucName: 'Hỏa Lục Cục',
    },
    leadScore: 35,
    tags: ['Đã lập lá số', 'Bản mệnh: Lộ Bàng Thổ', 'Quan tâm Tình duyên', 'VIP'],
    adminNotes: 'Khách quan tâm đại vận 2026 Bính Ngọ và cung Phu Thê.',
    chartIds: ['la-so-tu-vi-nguyen-van-an-1990-nam-canh-ngo-d15m06y1990g12s1l0n0v2026'],
    createdAt: new Date(Date.now() - 3 * 86400000),
    updatedAt: new Date(),
  });

  memoryCustomers.set('cust_sample_2', {
    id: 'cust_sample_2',
    visitorId: 'xb_v_sample_2',
    fullName: 'Trần Thị Bích',
    phone: '0988776655',
    email: 'bich.tran@outlook.com',
    gender: 'NU',
    solarBirthDate: new Date('2020-06-01'),
    lunarBirthInfo: {
      canChiYear: 'Canh Tý',
      banMenh: 'Bích Thượng Thổ',
      cucName: 'Hỏa Lục Cục',
    },
    leadScore: 28,
    tags: ['Tháng Nhuận', 'Bản mệnh: Bích Thượng Thổ', 'Cần xem hạn 2026'],
    adminNotes: 'Hỏi xem học hành cho con sinh tháng nhuận.',
    chartIds: ['la-so-tu-vi-tran-thi-bich-2020-nu-canh-ty-d01m06y2020g08s0l1n1v2026'],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(),
  });
}

export async function upsertCustomerLead(input: AutoLeadInput) {
  const scoreBonus = input.scoreBonus ?? 5;
  const newTags = new Set<string>();
  if (input.tagToAdd) newTags.add(input.tagToAdd);
  if (input.lunarBirthInfo?.banMenh) newTags.add(`Bản mệnh: ${input.lunarBirthInfo.banMenh}`);

  try {
    // Check by visitorId or phone or email
    let existing = await prisma.customerProfile.findFirst({
      where: {
        OR: [
          { visitorId: input.visitorId },
          ...(input.phone ? [{ phone: input.phone }] : []),
          ...(input.email ? [{ email: input.email }] : []),
        ],
      },
    });

    if (existing) {
      const mergedTags = Array.from(new Set([...existing.tags, ...Array.from(newTags)]));
      const chartIds = input.chartId && !existing.chartIds.includes(input.chartId)
        ? [...existing.chartIds, input.chartId]
        : existing.chartIds;

      const updated = await prisma.customerProfile.update({
        where: { id: existing.id },
        data: {
          fullName: input.fullName || existing.fullName,
          phone: input.phone || existing.phone,
          email: input.email || existing.email,
          zaloId: input.zaloId || existing.zaloId,
          gender: input.gender || existing.gender,
          solarBirthDate: input.solarBirthDate || existing.solarBirthDate,
          lunarBirthInfo: (input.lunarBirthInfo as any) || existing.lunarBirthInfo,
          leadScore: { increment: scoreBonus },
          tags: mergedTags,
          chartIds,
        },
      });
      return { ok: true, customer: updated };
    }

    const created = await prisma.customerProfile.create({
      data: {
        visitorId: input.visitorId,
        fullName: input.fullName || null,
        phone: input.phone || null,
        email: input.email || null,
        zaloId: input.zaloId || null,
        gender: input.gender || null,
        solarBirthDate: input.solarBirthDate || null,
        lunarBirthInfo: (input.lunarBirthInfo as any) || null,
        leadScore: scoreBonus,
        tags: Array.from(newTags),
        chartIds: input.chartId ? [input.chartId] : [],
      },
    });

    return { ok: true, customer: created };
  } catch (err) {
    // Memory fallback
    let cust = Array.from(memoryCustomers.values()).find(
      (c) =>
        c.visitorId === input.visitorId ||
        (input.phone && c.phone === input.phone) ||
        (input.email && c.email === input.email)
    );

    if (cust) {
      cust.fullName = input.fullName || cust.fullName;
      cust.phone = input.phone || cust.phone;
      cust.email = input.email || cust.email;
      cust.leadScore += scoreBonus;
      cust.tags = Array.from(new Set([...cust.tags, ...Array.from(newTags)]));
      if (input.chartId && !cust.chartIds.includes(input.chartId)) {
        cust.chartIds.push(input.chartId);
      }
      cust.updatedAt = new Date();
    } else {
      const id = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      cust = {
        id,
        visitorId: input.visitorId,
        fullName: input.fullName || 'Khách vãng lai',
        phone: input.phone || null,
        email: input.email || null,
        gender: input.gender || null,
        solarBirthDate: input.solarBirthDate || null,
        lunarBirthInfo: input.lunarBirthInfo || null,
        leadScore: scoreBonus,
        tags: Array.from(newTags),
        chartIds: input.chartId ? [input.chartId] : [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryCustomers.set(id, cust);
    }

    return { ok: true, customer: cust, fallback: true };
  }
}

export async function listCustomers(params: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 20));
  const skip = (page - 1) * limit;

  try {
    const where: any = {};
    if (params.search) {
      where.OR = [
        { fullName: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.tag) {
      where.tags = { has: params.tag };
    }

    const [items, total] = await Promise.all([
      prisma.customerProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ leadScore: 'desc' }, { updatedAt: 'desc' }],
        include: {
          _count: { select: { sessions: true, conversations: true } },
        },
      }),
      prisma.customerProfile.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    // Memory fallback
    let list = Array.from(memoryCustomers.values());
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (c) =>
          (c.fullName && c.fullName.toLowerCase().includes(q)) ||
          (c.phone && c.phone.includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }
    if (params.tag) {
      list = list.filter((c) => c.tags && c.tags.includes(params.tag));
    }
    list.sort((a, b) => b.leadScore - a.leadScore);

    const total = list.length;
    const items = list.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      fallback: true,
    };
  }
}

export async function getCustomerDetail(id: string) {
  try {
    const customer = await prisma.customerProfile.findUnique({
      where: { id },
      include: {
        sessions: { take: 10, orderBy: { startedAt: 'desc' }, include: { events: { take: 5 } } },
        conversations: { take: 10, orderBy: { updatedAt: 'desc' }, include: { messages: { take: 10 } } },
      },
    });
    if (customer) return customer;
  } catch {}

  const mem = memoryCustomers.get(id);
  if (mem) {
    return {
      ...mem,
      sessions: [
        {
          id: 'sess_sample_1',
          startedAt: mem.createdAt,
          deviceType: 'Desktop',
          browser: 'Chrome',
          events: [{ eventType: 'GENERATE_CHART', path: '/la-so/...' }],
        },
      ],
      conversations: [
        {
          id: 'conv_sample_1',
          status: 'ACTIVE',
          summary: 'Khách hỏi về cung Phu Thê và tài vận năm 2026',
          messages: [
            { role: 'user', content: 'Thầy xem giúp con đường tình duyên năm nay' },
            { role: 'assistant', content: 'Thầy Minh Triết chào con, cung Phu Thê của con...' },
          ],
        },
      ],
      fallback: true,
    };
  }
  return null;
}

export async function updateCustomer(id: string, data: { tags?: string[]; adminNotes?: string; leadScore?: number }) {
  try {
    const updated = await prisma.customerProfile.update({
      where: { id },
      data,
    });
    return updated;
  } catch {}

  const mem = memoryCustomers.get(id);
  if (mem) {
    if (data.tags) mem.tags = data.tags;
    if (data.adminNotes !== undefined) mem.adminNotes = data.adminNotes;
    if (data.leadScore !== undefined) mem.leadScore = data.leadScore;
    mem.updatedAt = new Date();
    return mem;
  }
  return null;
}

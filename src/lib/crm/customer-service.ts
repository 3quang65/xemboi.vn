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

// Không gieo khách mẫu: khu quản trị chỉ hiện dữ liệu thật (Lệnh 22, đề nghị 4).

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
      sessions: [],
      conversations: [],
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

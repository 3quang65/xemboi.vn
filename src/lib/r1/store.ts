import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';
import {
  R1_EVENT_NAMES,
  type NutGiaR1,
  type R1EventName,
  type R1EventRecord,
  type R1LeadRecord,
} from './types';

export const SO_NGAY_LUU_LEAD_TOI_DA = 60;
const LOCAL_STORE_PATH = path.join(process.cwd(), 'scratch', 'r1-store.json');

interface LocalStoreData {
  events: R1EventRecord[];
  leads: R1LeadRecord[];
}

export interface R1StoreDeps {
  db?: Pick<typeof prisma, 'r1Event' | 'r1Lead'>;
  nodeEnv?: string;
  localStorePath?: string;
  logger?: Pick<Console, 'error'>;
}

export class R1DatabaseUnavailableError extends Error {
  readonly statusCode = 503;
  readonly code: string;
  readonly eventName: string;

  constructor(code: string, eventName: string) {
    super('Dịch vụ lưu trữ tạm thời gián đoạn.');
    this.name = 'R1DatabaseUnavailableError';
    this.code = code;
    this.eventName = eventName;
  }
}

export function choPhepDuPhongCucBo(nodeEnv: string | undefined = process.env.NODE_ENV): boolean {
  return nodeEnv !== 'production';
}

/**
 * Chỉ trích mã lỗi ngắn (vd Prisma P1001, P2021 hoặc tên lớp lỗi),
 * tuyệt đối không đọc/ghi err.message để tránh vô tình lọt email, Zalo hay tham số truy vấn vào log.
 */
export function trichMaLoiDb(err: unknown): string {
  if (err && typeof err === 'object') {
    const obj = err as { code?: unknown; name?: unknown };
    if (typeof obj.code === 'string' && /^[A-Za-z0-9_.-]{1,40}$/.test(obj.code)) {
      return obj.code;
    }
    if (typeof obj.name === 'string' && /^[A-Za-z0-9_.-]{1,60}$/.test(obj.name)) {
      return obj.name;
    }
  }
  return 'DB_UNKNOWN_ERROR';
}

function ghiLogLoiDbAnToan(
  logger: Pick<Console, 'error'>,
  eventName: string,
  err: unknown,
): string {
  const maLoi = trichMaLoiDb(err);
  logger.error(`[R1][DB_ERROR] suKien=${eventName} maLoi=${maLoi}`);
  return maLoi;
}

function docLocalStore(filePath: string): LocalStoreData {
  try {
    if (!fs.existsSync(filePath)) {
      return { events: [], leads: [] };
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LocalStoreData>;
    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
    };
  } catch {
    return { events: [], leads: [] };
  }
}

function ghiLocalStore(filePath: string, data: LocalStoreData): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function taoId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
}

export function laTenSuKienHopLe(ten: unknown): ten is R1EventName {
  return typeof ten === 'string' && (R1_EVENT_NAMES as readonly string[]).includes(ten);
}

export function laNutGiaHopLe(nut: unknown): nut is NutGiaR1 {
  return nut === '79k' || nut === '149k';
}

function lamSachChuoi(val: unknown, maxLen = 120): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

/**
 * Chuẩn hóa payload sự kiện R1: CHỈ giữ đúng các trường ẩn danh, loại bỏ mọi trường thừa (đặc biệt ngày giờ sinh, email).
 */
export function chuanHoaSuKienR1(raw: Record<string, unknown>): {
  sessionId: string;
  eventName: R1EventName;
  coGioSinh: boolean | null;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
} {
  const sessionId = lamSachChuoi(raw.sessionId, 80);
  if (!sessionId) throw new Error('Thiếu mã phiên ẩn danh (sessionId).');
  if (!laTenSuKienHopLe(raw.eventName)) throw new Error('Tên sự kiện không hợp lệ.');

  const coGioSinh =
    raw.eventName === 'lap_la_so'
      ? typeof raw.coGioSinh === 'boolean'
        ? raw.coGioSinh
        : null
      : null;

  return {
    sessionId,
    eventName: raw.eventName,
    coGioSinh,
    utmSource: lamSachChuoi(raw.utmSource, 100) || '(trực tiếp)',
    utmMedium: lamSachChuoi(raw.utmMedium, 100),
    utmCampaign: lamSachChuoi(raw.utmCampaign, 120),
  };
}

/**
 * Chuẩn hóa payload Lead R1: KHÔNG lưu sessionId, KHÔNG lưu ngày giờ sinh.
 */
export function chuanHoaLeadR1(raw: Record<string, unknown>): {
  emailHoacZalo: string;
  nutGiaDaBam: NutGiaR1;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
} {
  const emailHoacZalo = lamSachChuoi(raw.emailHoacZalo, 160);
  if (!emailHoacZalo || emailHoacZalo.length < 5) {
    throw new Error('Vui lòng nhập Email hoặc số Zalo hợp lệ.');
  }
  const laEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailHoacZalo);
  const laZalo =
    /^[+0-9][0-9\s.-]{7,18}$/.test(emailHoacZalo) ||
    /^@?[a-zA-Z0-9._-]{4,40}$/.test(emailHoacZalo);
  if (!laEmail && !laZalo) {
    throw new Error('Email hoặc số Zalo chưa đúng định dạng.');
  }

  if (raw.dongY !== true) {
    throw new Error('Vui lòng tích ô đồng ý xử lý dữ liệu trước khi gửi.');
  }

  if (!laNutGiaHopLe(raw.nutGiaDaBam)) {
    throw new Error('Gói đã chọn không hợp lệ.');
  }

  return {
    emailHoacZalo,
    nutGiaDaBam: raw.nutGiaDaBam,
    utmSource: lamSachChuoi(raw.utmSource, 100) || '(trực tiếp)',
    utmMedium: lamSachChuoi(raw.utmMedium, 100),
    utmCampaign: lamSachChuoi(raw.utmCampaign, 120),
  };
}

export async function luuSuKienR1(
  raw: Record<string, unknown>,
  deps: R1StoreDeps = {},
): Promise<{
  ok: true;
  id: string;
  storage: 'postgres' | 'local-fallback';
}> {
  const data = chuanHoaSuKienR1(raw);
  const db = deps.db ?? prisma;
  const nodeEnv = deps.nodeEnv ?? process.env.NODE_ENV;
  const filePath = deps.localStorePath ?? LOCAL_STORE_PATH;
  const logger = deps.logger ?? console;

  try {
    const created = await db.r1Event.create({ data });
    return { ok: true, id: created.id, storage: 'postgres' };
  } catch (err) {
    const maLoi = ghiLogLoiDbAnToan(logger, data.eventName, err);
    if (!choPhepDuPhongCucBo(nodeEnv)) {
      throw new R1DatabaseUnavailableError(maLoi, data.eventName);
    }

    const store = docLocalStore(filePath);
    const record: R1EventRecord = {
      id: taoId('r1e'),
      ...data,
      createdAt: new Date().toISOString(),
    };
    store.events.push(record);
    ghiLocalStore(filePath, store);
    return { ok: true, id: record.id, storage: 'local-fallback' };
  }
}

export async function luuLeadR1(
  raw: Record<string, unknown>,
  deps: R1StoreDeps = {},
): Promise<{
  ok: true;
  lead: R1LeadRecord;
  storage: 'postgres' | 'local-fallback';
}> {
  const data = chuanHoaLeadR1(raw);
  const db = deps.db ?? prisma;
  const nodeEnv = deps.nodeEnv ?? process.env.NODE_ENV;
  const filePath = deps.localStorePath ?? LOCAL_STORE_PATH;
  const logger = deps.logger ?? console;

  const now = new Date();
  const hanXoa = new Date(now.getTime() + SO_NGAY_LUU_LEAD_TOI_DA * 24 * 60 * 60 * 1000);

  try {
    const created = await db.r1Lead.create({
      data: {
        ...data,
        dongYLuc: now,
        hanXoa,
        createdAt: now,
      },
    });
    return {
      ok: true,
      storage: 'postgres',
      lead: {
        id: created.id,
        emailHoacZalo: created.emailHoacZalo,
        nutGiaDaBam: created.nutGiaDaBam as NutGiaR1,
        utmSource: created.utmSource,
        utmMedium: created.utmMedium,
        utmCampaign: created.utmCampaign,
        dongYLuc: created.dongYLuc.toISOString(),
        hanXoa: created.hanXoa.toISOString(),
        createdAt: created.createdAt.toISOString(),
      },
    };
  } catch (err) {
    // Tuyệt đối không ghi email/Zalo vào log — chỉ ghi tên sự kiện và mã lỗi DB
    const maLoi = ghiLogLoiDbAnToan(logger, 'gui_lien_he', err);
    if (!choPhepDuPhongCucBo(nodeEnv)) {
      throw new R1DatabaseUnavailableError(maLoi, 'gui_lien_he');
    }

    const store = docLocalStore(filePath);
    const lead: R1LeadRecord = {
      id: taoId('r1l'),
      ...data,
      dongYLuc: now.toISOString(),
      hanXoa: hanXoa.toISOString(),
      createdAt: now.toISOString(),
    };
    store.leads.push(lead);
    ghiLocalStore(filePath, store);
    return { ok: true, lead, storage: 'local-fallback' };
  }
}

export async function docToanBoDuLieuR1(deps: R1StoreDeps = {}): Promise<{
  events: R1EventRecord[];
  leads: R1LeadRecord[];
  storage: 'postgres' | 'local-fallback';
}> {
  const db = deps.db ?? prisma;
  const nodeEnv = deps.nodeEnv ?? process.env.NODE_ENV;
  const filePath = deps.localStorePath ?? LOCAL_STORE_PATH;
  const logger = deps.logger ?? console;

  try {
    const [eventsDb, leadsDb] = await Promise.all([
      db.r1Event.findMany({ orderBy: { createdAt: 'desc' } }),
      db.r1Lead.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    return {
      storage: 'postgres',
      events: eventsDb
        .filter((e) => laTenSuKienHopLe(e.eventName))
        .map((e) => ({
          id: e.id,
          sessionId: e.sessionId,
          eventName: e.eventName as R1EventName,
          coGioSinh: e.coGioSinh,
          utmSource: e.utmSource,
          utmMedium: e.utmMedium,
          utmCampaign: e.utmCampaign,
          createdAt: e.createdAt.toISOString(),
        })),
      leads: leadsDb.map((l) => ({
        id: l.id,
        emailHoacZalo: l.emailHoacZalo,
        nutGiaDaBam: (l.nutGiaDaBam === '149k' ? '149k' : '79k') as NutGiaR1,
        utmSource: l.utmSource,
        utmMedium: l.utmMedium,
        utmCampaign: l.utmCampaign,
        dongYLuc: l.dongYLuc.toISOString(),
        hanXoa: l.hanXoa.toISOString(),
        createdAt: l.createdAt.toISOString(),
      })),
    };
  } catch (err) {
    const maLoi = ghiLogLoiDbAnToan(logger, 'doc_quan_tri', err);
    if (!choPhepDuPhongCucBo(nodeEnv)) {
      throw new R1DatabaseUnavailableError(maLoi, 'doc_quan_tri');
    }

    const store = docLocalStore(filePath);
    return {
      storage: 'local-fallback',
      events: [...store.events].reverse(),
      leads: [...store.leads].reverse(),
    };
  }
}

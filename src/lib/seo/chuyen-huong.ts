// Phục vụ chuyển hướng từ bảng SeoChuyenHuong (docs/v2/17 mục 1.4). Bản đồ nạp vào bộ nhớ, làm mới sau 60 giây
// hoặc ngay khi quản trị sửa (cùng tiến trình). CSDL lỗi thì bỏ qua, không chặn trang.
import { prisma } from '@/lib/prisma';

type Muc = { id: string; den: string; ma: number };
type BanDo = { luc: number; chinhXac: Map<string, Muc>; bieuThuc: { tuMien: string; re: RegExp; muc: Muc }[] };

const HAN_MS = 60_000;
let banDo: BanDo | null = null;
let dangNap: Promise<BanDo> | null = null;
const demTruy = new Map<string, number>();
let henGhi: ReturnType<typeof setTimeout> | null = null;

/** Bỏ dấu / cuối (trừ "/"), thêm / đầu, bỏ query và fragment. */
export function chuanHoaDuongDan(s: string): string {
  let d = s.trim().replace(/[?#].*$/, '');
  try { d = new URL(d, 'https://xemboi.vn').pathname; } catch { /* giữ nguyên */ }
  if (!d.startsWith('/')) d = '/' + d;
  if (d.length > 1) d = d.replace(/\/+$/, '');
  return d;
}

export function tenMienCua(host: string | null): string {
  const h = (host || '').toLowerCase().replace(/:\d+$/, '').replace(/^www\./, '');
  return !h || h === 'localhost' || h === '127.0.0.1' || h.endsWith('.localhost') ? 'xemboi.vn' : h;
}

async function nap(): Promise<BanDo> {
  const ds = await prisma.seoChuyenHuong.findMany({ where: { batTat: true }, select: { id: true, tuMien: true, tuDuongDan: true, denUrl: true, ma: true, laBieuThuc: true } });
  const chinhXac = new Map<string, Muc>();
  const bieuThuc: BanDo['bieuThuc'] = [];
  for (const c of ds) {
    const muc = { id: c.id, den: c.denUrl, ma: c.ma };
    if (c.laBieuThuc) { try { bieuThuc.push({ tuMien: c.tuMien, re: new RegExp(c.tuDuongDan), muc }); } catch { /* bỏ biểu thức hỏng */ } }
    else chinhXac.set(`${c.tuMien}${chuanHoaDuongDan(c.tuDuongDan)}`, muc);
  }
  return { luc: Date.now(), chinhXac, bieuThuc };
}

async function layBanDo(): Promise<BanDo | null> {
  if (banDo && Date.now() - banDo.luc < HAN_MS) return banDo;
  dangNap ??= nap().finally(() => { dangNap = null; });
  try { banDo = await dangNap; } catch { return banDo; }
  return banDo;
}

export function lamMoiChuyenHuong() { banDo = null; }

function ghiTruyMuon(id: string) {
  demTruy.set(id, (demTruy.get(id) ?? 0) + 1);
  henGhi ??= setTimeout(async () => {
    henGhi = null;
    const ds = [...demTruy]; demTruy.clear();
    for (const [id, n] of ds) {
      await prisma.seoChuyenHuong.update({ where: { id }, data: { soLanTruy: { increment: n }, lanTruyCuoi: new Date() } }).catch(() => {});
    }
  }, 5_000);
}

/** Tìm đích cho (host, pathname). Trả null nếu không có chuyển hướng. */
export async function timChuyenHuong(host: string | null, pathname: string): Promise<{ den: string; ma: number } | null> {
  const bd = await layBanDo();
  if (!bd || (!bd.chinhXac.size && !bd.bieuThuc.length)) return null;
  const mien = tenMienCua(host);
  const duong = chuanHoaDuongDan(pathname);
  const m = bd.chinhXac.get(`${mien}${duong}`);
  if (m) { ghiTruyMuon(m.id); return { den: m.den, ma: m.ma }; }
  for (const b of bd.bieuThuc) {
    if (b.tuMien !== mien) continue;
    const k = duong.match(b.re);
    if (k) { ghiTruyMuon(b.muc.id); return { den: thayNhom(b.muc.den, k), ma: b.muc.ma }; }
  }
  return null;
}

/** Thay `$n` bằng nhóm n của biểu thức; `$n:w` đệm số 0 bên trái cho đủ w ký tự (ví dụ ngày 6 → `$1:2` → 06). */
export function thayNhom(den: string, k: ArrayLike<string | undefined>): string {
  return den.replace(/\$(\d)(?::(\d))?/g, (_, i: string, w?: string) => {
    const v = k[Number(i)] ?? '';
    return w ? v.padStart(Number(w), '0') : v;
  });
}

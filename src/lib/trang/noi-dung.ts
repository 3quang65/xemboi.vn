// Nội dung đã xuất bản cho trang công khai v2 (docs/v2/19 mục 2.2). Chỉ đọc bản xuất bản (NoiDung.phienBanXuatBanId)
// của nội dung ở trạng thái DA_XUAT_BAN. Markdown được tách thành khối có cấu trúc (không sinh HTML thô) để
// component React hiển thị an toàn, không cần dangerouslySetInnerHTML.
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { KHOI, type KhoiMuc } from '@/lib/noi-dung/khoi';
import { chuanHoaDuongDan } from './meta';

// ---------- markdown tối giản ----------
export type DoanChu = { loai: 'chu'; chu: string } | { loai: 'dam'; chu: string } | { loai: 'nghieng'; chu: string } | { loai: 'lienKet'; chu: string; href: string };
export type KhoiMd =
  | { loai: 'tieuDe'; cap: 2 | 3 | 4; noi: DoanChu[] }
  | { loai: 'doan'; noi: DoanChu[] }
  | { loai: 'danhSach'; coThuTu: boolean; muc: DoanChu[][] }
  | { loai: 'trich'; noi: DoanChu[] };

/** Chỉ nhận liên kết nội bộ (/...) hoặc http(s). Còn lại (javascript:, data:...) thành chữ thường. */
export function hrefAnToan(href: string): string | null {
  const h = href.trim();
  if (/^\/(?!\/)/.test(h)) return h;
  if (/^https?:\/\/[^\s]+$/i.test(h)) return h;
  return null;
}

export function tachDongChu(s: string): DoanChu[] {
  const kq: DoanChu[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let cuoi = 0;
  for (const m of s.matchAll(re)) {
    if (m.index! > cuoi) kq.push({ loai: 'chu', chu: s.slice(cuoi, m.index) });
    if (m[1]) kq.push({ loai: 'dam', chu: m[1] });
    else if (m[2] || m[3]) kq.push({ loai: 'nghieng', chu: (m[2] || m[3])! });
    else {
      const href = hrefAnToan(m[5]);
      kq.push(href ? { loai: 'lienKet', chu: m[4], href } : { loai: 'chu', chu: m[4] });
    }
    cuoi = m.index! + m[0].length;
  }
  if (cuoi < s.length) kq.push({ loai: 'chu', chu: s.slice(cuoi) });
  return kq;
}

/** Markdown → khối. Hỗ trợ ##/###/####, đoạn, danh sách -, *, 1., trích dẫn >. Bỏ HTML thô và ảnh. */
const THE_HTML = /<\/?(p|h[1-6]|ul|ol|li|strong|b|em|i|a|br|blockquote|div|span)\b[^>]*>/i;

/**
 * Bài cũ chuyển từ v1 lưu thân bằng HTML. Đổi các thẻ cấu trúc quen thuộc sang markdown tối giản
 * (tiêu đề, đoạn, danh sách, đậm/nghiêng, liên kết, trích), bỏ mọi thẻ còn lại rồi giải mã thực thể.
 * Kết quả vẫn đi qua tachMarkdown nên không có HTML thô nào tới trình duyệt.
 */
export function htmlSangMarkdown(html: string): string {
  const motDong = (x: string) => x.replace(/\s+/g, ' ').trim();
  let s = html.replace(/\r\n/g, '\n');
  s = s.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
  s = s.replace(/<a\b[^>]*href\s*=\s*["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, h, t) => `[${motDong(t)}](${h})`);
  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${motDong(t)}**`);
  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `*${motDong(t)}*`);
  s = s.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, c, t) => `\n\n${'#'.repeat(Math.min(4, Math.max(2, Number(c))))} ${motDong(t)}\n\n`);
  s = s.replace(/<(ol|ul)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, l: string, t: string) => {
    const muc = [...t.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((m, i) => `${l.toLowerCase() === 'ol' ? `${i + 1}.` : '-'} ${motDong(m[1].replace(/<[^>]+>/g, ''))}`);
    return `\n\n${muc.join('\n')}\n\n`;
  });
  s = s.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) => `\n\n> ${motDong(t.replace(/<[^>]+>/g, ' '))}\n\n`);
  s = s.replace(/<(p|div)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `\n\n${motDong(t)}\n\n`);
  s = s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '');
  s = s.split('\n').map((d) => d.trim()).join('\n');
  return s
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '‹').replace(/&gt;/g, '›').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&');
}

export function tachMarkdown(md: string | null | undefined): KhoiMd[] {
  if (!md) return [];
  const kq: KhoiMd[] = [];
  const nguon = THE_HTML.test(md) ? htmlSangMarkdown(md) : md.replace(/\r\n/g, '\n').replace(/<[^>]+>/g, '');
  for (const khoi of nguon.split(/\n\s*\n/)) {
    const dong = khoi.split('\n').map((d) => d.trimEnd()).filter((d) => d.trim());
    if (!dong.length) continue;
    const td = /^(#{1,4})\s+(.*)$/.exec(dong[0]);
    if (td && dong.length === 1) {
      kq.push({ loai: 'tieuDe', cap: Math.min(4, Math.max(2, td[1].length)) as 2 | 3 | 4, noi: tachDongChu(td[2]) });
      continue;
    }
    if (dong.every((d) => /^\s*([-*]|\d+\.)\s+/.test(d))) {
      kq.push({ loai: 'danhSach', coThuTu: /^\s*\d+\./.test(dong[0]), muc: dong.map((d) => tachDongChu(d.replace(/^\s*([-*]|\d+\.)\s+/, ''))) });
      continue;
    }
    if (dong.every((d) => d.startsWith('>'))) {
      kq.push({ loai: 'trich', noi: tachDongChu(dong.map((d) => d.replace(/^>\s?/, '')).join(' ')) });
      continue;
    }
    kq.push({ loai: 'doan', noi: tachDongChu(dong.map((d) => d.replace(/!\[[^\]]*\]\([^)]*\)/g, '').trim()).join(' ')) });
  }
  return kq;
}

// ---------- đọc CSDL ----------
export type TrichDanHienThi = { khoi: number | null; tenSach: string | null; viTri: string | null; cauTrich: string | null };
export type NoiDungHienThi = {
  id: string; tieuDe: string; tomTat: string | null; than: KhoiMd[];
  /** Mục từ điển 9 khối: mỗi khối đã tách markdown, theo thứ tự K1–K9; khối trống bị bỏ. */
  khoi: { ma: string; ten: string; noi: KhoiMd[] }[];
  trichDan: TrichDanHienThi[];
  ngayXuatBan: Date | null; ngayDuyetChuyenGia: Date | null; capNhatLuc: Date;
};

export const noiDungTheoDuongDan = cache(async (duongDan: string): Promise<NoiDungHienThi | null> => {
  try {
    const t = await prisma.seoTrang.findUnique({
      where: { duongDan: chuanHoaDuongDan(duongDan) },
      select: { noiDung: { select: { id: true, tieuDe: true, trangThai: true, phienBanXuatBanId: true, ngayXuatBan: true, ngayDuyetChuyenGia: true, capNhatLuc: true } } },
    });
    const nd = t?.noiDung;
    if (!nd || nd.trangThai !== 'DA_XUAT_BAN' || !nd.phienBanXuatBanId) return null;
    const pb = await prisma.noiDungPhienBan.findUnique({
      where: { id: nd.phienBanXuatBanId },
      select: { than: true, tomTat: true, khoi: true, trichDan: { select: { khoi: true, viTri: true, cauTrich: true, nguon: { select: { tenGoc: true, tenHanViet: true } } } } },
    });
    if (!pb) return null;
    const k = (pb.khoi ?? {}) as KhoiMuc;
    return {
      id: nd.id, tieuDe: nd.tieuDe, tomTat: pb.tomTat, than: tachMarkdown(pb.than),
      khoi: KHOI.map(({ ma, ten }) => ({ ma, ten, noi: tachMarkdown(k[ma]) })).filter((x) => x.noi.length),
      trichDan: pb.trichDan.map((c) => ({ khoi: c.khoi, tenSach: c.nguon ? c.nguon.tenHanViet || c.nguon.tenGoc : null, viTri: c.viTri, cauTrich: c.cauTrich })),
      ngayXuatBan: nd.ngayXuatBan, ngayDuyetChuyenGia: nd.ngayDuyetChuyenGia, capNhatLuc: nd.capNhatLuc,
    };
  } catch {
    return null; // CSDL lỗi: trang hiện phần dữ liệu tính được, không có diễn giải
  }
});

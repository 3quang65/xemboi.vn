// Kiểm từ cấm theo bảng TuCam (docs/v2/17 mục 1.1, 07 mục 3.5). Dùng cho title/meta/h1/thân bài trước khi xuất bản.
import type { PrismaClient, Prisma } from '@prisma/client';

type Db = PrismaClient | Prisma.TransactionClient;
export type PhamViTuCam = 'TIEU_DE' | 'META' | 'H1' | 'THAN_BAI' | 'NUT' | 'ANH';
export type MucCam = { cum: string; nhom: string; xuLy: string; thayBang: string | null; phamVi: string[] };
export type ViPham = { cum: string; xuLy: string; thayBang: string | null; viTri: number; doan: string };

let boNho: { luc: number; ds: MucCam[] } | null = null;

export async function layTuCam(db: Db, moi = false): Promise<MucCam[]> {
  if (!moi && boNho && Date.now() - boNho.luc < 60_000) return boNho.ds;
  const ds = await db.tuCam.findMany({ where: { batTat: true }, select: { cum: true, nhom: true, xuLy: true, thayBang: true, phamVi: true } });
  // Cụm dài kiểm trước để "dâng sao giải hạn" không bị báo hai lần thành "giải hạn".
  ds.sort((a, b) => b.cum.length - a.cum.length);
  boNho = { luc: Date.now(), ds };
  return ds;
}

const laChu = (c: string | undefined) => !!c && /[\p{L}\p{N}]/u.test(c);

/** Tìm cụm cấm trong văn bản (khớp nguyên cụm, không khớp giữa chữ). */
export function timTuCam(vanBan: string, ds: MucCam[], phamVi?: PhamViTuCam): ViPham[] {
  const goc = vanBan.normalize('NFC');
  const thuong = goc.toLowerCase();
  const daChiem: [number, number][] = [];
  const kq: ViPham[] = [];
  for (const m of ds) {
    if (phamVi && m.phamVi.length && !m.phamVi.includes(phamVi)) continue;
    let i = thuong.indexOf(m.cum);
    while (i !== -1) {
      const j = i + m.cum.length;
      if (!laChu(thuong[i - 1]) && !laChu(thuong[j]) && !daChiem.some(([a, b]) => i < b && j > a)) {
        daChiem.push([i, j]);
        kq.push({ cum: m.cum, xuLy: m.xuLy, thayBang: m.thayBang, viTri: i, doan: goc.slice(Math.max(0, i - 30), Math.min(goc.length, j + 30)) });
      }
      i = thuong.indexOf(m.cum, i + 1);
    }
  }
  return kq.sort((a, b) => a.viTri - b.viTri);
}

/** Kiểm văn bản; `chan` = có ít nhất một cụm CHAN_CUNG (không được xuất bản). */
export async function kiemTuCam(db: Db, vanBan: string, phamVi?: PhamViTuCam) {
  const viPham = timTuCam(vanBan, await layTuCam(db), phamVi);
  return { chan: viPham.some((v) => v.xuLy === 'CHAN_CUNG'), viPham };
}

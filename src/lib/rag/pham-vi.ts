import { Prisma, type PhamVi } from '@prisma/client';
import type { NguoiDung } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';

/** Người dùng có quyền xem dữ liệu RAG nội bộ (nguồn B/C chưa phép hoặc gắn cờ nội bộ) hay không. */
export function duocXemNoiBo(nd: NguoiDung): boolean {
  return coQuyen(nd.vaiTro, 'rag.xem_noi_bo');
}

/** Điều kiện Prisma ép buộc phạm vi ở mọi truy vấn RagNguon và RagDoan. */
export function dieuKienPhamVi(nd: NguoiDung): { phamVi?: PhamVi } {
  return duocXemNoiBo(nd) ? {} : { phamVi: 'CONG_KHAI' };
}

/** Điều kiện SQL có tham số cho $queryRaw trên rag_nguon hoặc rag_doan. */
export function sqlPhamVi(nd: NguoiDung, bietDanh?: 'n' | 'd'): Prisma.Sql {
  if (duocXemNoiBo(nd)) return Prisma.sql`TRUE`;
  if (bietDanh === 'n') return Prisma.sql`n."phamVi" = 'CONG_KHAI'::"PhamVi"`;
  if (bietDanh === 'd') return Prisma.sql`d."phamVi" = 'CONG_KHAI'::"PhamVi"`;
  return Prisma.sql`"phamVi" = 'CONG_KHAI'::"PhamVi"`;
}

/** Ngữ cảnh tìm kiếm hợp lệ: tài khoản thiếu rag.xem_noi_bo luôn bị ép về CONG_KHAI. */
export function nguCanhTruyVan(nd: NguoiDung, chon?: string): PhamVi {
  if (!duocXemNoiBo(nd)) return 'CONG_KHAI';
  return chon === 'NOI_BO' ? 'NOI_BO' : 'CONG_KHAI';
}

export function phanTichBigInt(raw: string | undefined | null): bigint | null {
  const s = (raw ?? '').trim();
  if (!/^\d+$/.test(s)) return null;
  try {
    return BigInt(s);
  } catch {
    return null;
  }
}

export function phanTichInt(raw: string | undefined | null): number | null {
  const s = (raw ?? '').trim();
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  if (!Number.isSafeInteger(n) || n < 1 || n > 2147483647) return null;
  return n;
}

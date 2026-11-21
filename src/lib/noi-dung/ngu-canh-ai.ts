// Ngữ cảnh gửi LLM ngoài khi AI soạn (docs/v2/17 mục 2.3 bước 3 và 6).
// CHỈ đọc từ view rag_doan_cong_khai / rag_nguon_cong_khai: đoạn nội bộ (nguồn C, B chưa phép, cờ "chỉ nội bộ")
// không bao giờ vào đây, kể cả khi người gọi truyền mã của chúng. Mã bị loại được trả về để giao diện báo.
import { Prisma, type PrismaClient } from '@prisma/client';
import type { DoanDaGui } from './trich-dan';

type Db = PrismaClient | Prisma.TransactionClient;
export type DoanNguCanh = DoanDaGui & { nguonMa: string; nguonTen: string; duongDan: string[] };

export async function taoNguCanhAi(db: Db, maDoan: (string | bigint | number)[]): Promise<{ doan: DoanNguCanh[]; biLoai: string[]; vanBan: string }> {
  const ids = [...new Set(maDoan.map(String).filter((s) => /^\d+$/.test(s)))];
  if (!ids.length) return { doan: [], biLoai: [], vanBan: '' };
  const rows = await db.$queryRaw<{ id: bigint; vanBan: string; duongDan: string[]; ma: string; tenGoc: string; duocTrichDai: boolean }[]>(Prisma.sql`
    SELECT d.id, d."vanBan", d."duongDan", n.ma, n."tenGoc", n."duocTrichDai"
    FROM rag_doan_cong_khai d JOIN rag_nguon_cong_khai n ON n.id = d."nguonId"
    WHERE d.id = ANY(${ids}::bigint[])
    ORDER BY array_position(${ids}::bigint[], d.id)`);
  const doan = rows.map((r) => ({ id: String(r.id), vanBan: r.vanBan, duocTrichDai: r.duocTrichDai, nguonMa: r.ma, nguonTen: r.tenGoc, duongDan: r.duongDan }));
  const co = new Set(doan.map((d) => d.id));
  const vanBan = doan.map((d) => `[D:${d.id}] (${d.nguonTen}${d.duongDan.length ? ', ' + d.duongDan.join(' / ') : ''})\n${d.vanBan}`).join('\n\n');
  return { doan, biLoai: ids.filter((i) => !co.has(i)), vanBan };
}

/** Chỉ dẫn hệ thống cho LLM: mỗi câu nhận định phải có mã đoạn; không dùng kiến thức ngoài đoạn đã cho. */
export const CHI_DAN_AI = [
  'Bạn là biên tập viên bách khoa huyền học, viết tiếng Việt trung lập, không phán đoán số mệnh cá nhân.',
  'Chỉ dùng thông tin trong các đoạn nguồn được cung cấp. Mỗi câu nhận định phải kèm ít nhất một mã đoạn dạng [D:số] ngay sau câu.',
  'Không tự tạo mã đoạn. Không trích nguyên văn dài; diễn đạt lại và ghi mã.',
  'Nếu các đoạn không đủ để trả lời, ghi rõ "chưa đủ nguồn" thay vì suy đoán.',
].join('\n');

import fs from 'node:fs';
import path from 'node:path';
import { docCsv } from '@/lib/rag/danh-gia';

/** Đọc độ khó từ docs/v2/rag-cau-hoi-chuan.csv (bảng rag_cau_hoi_chuan không lưu cột do_kho). */
export function docDoKhoCsv(): Map<string, string> {
  const tep = path.join(process.cwd(), 'docs/v2/rag-cau-hoi-chuan.csv');
  try {
    const noiDung = fs.readFileSync(tep, 'utf8');
    const dong = docCsv(noiDung);
    const map = new Map<string, string>();
    for (const r of dong) {
      if (r.ma && r.do_kho) map.set(r.ma, r.do_kho);
    }
    return map;
  } catch {
    return new Map();
  }
}

// Nạp quy tắc liên kết mặc định (07 mục 2.4) rồi sinh gợi ý DE_XUAT (Đợt 3). Chạy sau seo-quet.ts để biết liên kết đang có.
//   npx tsx --env-file=.env scripts/seo-goi-y-lien-ket.ts [--thu]
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { docCsv } from '../src/lib/seo/kho-tu-khoa';
import { goiYTheoQuyTac, napQuyTacMacDinh } from '../src/lib/seo/quy-tac-lien-ket';

const thu = process.argv.includes('--thu');

/** Cột lien_ket_ra ghi mã trang (page_id), cách nhau bởi dấu chấm phẩy; dịch sang đường dẫn, bỏ trang mẫu {…}. */
function keHoachTuCsv(): Map<string, string[]> {
  const dong = docCsv(fs.readFileSync(path.resolve(__dirname, '..', 'docs', 'v2', '16-seo-trang.csv'), 'utf8'));
  const url = new Map(dong.map((r) => [r.page_id, r.url]));
  const kq = new Map<string, string[]>();
  for (const r of dong) {
    if (!r.url || r.url.includes('{')) continue;
    const den = (r.lien_ket_ra || '').split(';').map((s) => url.get(s.trim())).filter((u): u is string => !!u && !u.includes('{') && u !== r.url);
    if (den.length) kq.set(r.url, [...new Set(den)]);
  }
  return kq;
}

(async () => {
  const db = new PrismaClient();
  try {
    if (!thu) console.log('Quy tắc:', await napQuyTacMacDinh(db));
    const keHoach = keHoachTuCsv();
    console.log(`Kế hoạch liên kết: ${keHoach.size} trang có cột lien_ket_ra.`);
    const bc = await goiYTheoQuyTac(db, { keHoach, ghi: !thu });
    for (const q of bc.quyTac) console.log(`- ${q.ten} [${q.kieu}]: xét ${q.trangXet} trang, thiếu ${q.thieu}, gợi ý mới ${q.goiYMoi}`);
    console.log(`Tổng gợi ý mới: ${bc.goiYMoi}${thu ? ' (chạy thử, chưa ghi)' : ''}`);
  } finally {
    await db.$disconnect();
  }
})().catch((e) => { console.error(e); process.exit(1); });

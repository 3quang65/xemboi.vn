// Nạp docs/v2/thuat-ngu.csv vào bảng thuat_ngu (khóa: han + mang). Chạy lại an toàn; không xóa dòng người đã thêm tay.
//   npx tsx --env-file=.env scripts/rag-nap-thuat-ngu.ts [--thu]
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const thu = process.argv.includes('--thu');

(async () => {
  const dong = fs.readFileSync(path.join(process.cwd(), 'docs/v2/thuat-ngu.csv'), 'utf8').split(/\r?\n/).filter(Boolean);
  const [dau, ...than] = dong;
  if (dau.trim() !== 'han,han_viet,bien_the,mang') throw new Error('Sai tiêu đề CSV');
  const muc = than.map((d, i) => {
    const o = d.split(',');
    if (o.length !== 4 || !o[0] || !o[1] || !o[3]) throw new Error(`Dòng ${i + 2} sai: ${d}`);
    return { han: o[0].trim(), hanViet: o[1].trim().normalize('NFC'), bienThe: o[2] ? o[2].split('|').map((x) => x.trim().normalize('NFC')) : [], mang: o[3].trim() };
  });
  const trung = muc.filter((m, i) => muc.findIndex((x) => x.han === m.han && x.mang === m.mang) !== i);
  if (trung.length) throw new Error(`Trùng khóa: ${trung.map((m) => `${m.han}/${m.mang}`).join(', ')}`);
  const db = new PrismaClient();
  try {
    const cu = new Map((await db.thuatNgu.findMany()).map((m) => [`${m.han}|${m.mang}`, m]));
    let them = 0, sua = 0;
    for (const m of muc) {
      const c = cu.get(`${m.han}|${m.mang}`);
      if (c && c.hanViet === m.hanViet && c.bienThe.join('|') === m.bienThe.join('|')) continue;
      if (c) sua++; else them++;
      if (!thu) await db.thuatNgu.upsert({ where: { han_mang: { han: m.han, mang: m.mang } }, create: m, update: { hanViet: m.hanViet, bienThe: m.bienThe } });
    }
    console.log(`${muc.length} dòng CSV: thêm ${them}, sửa ${sua}${thu ? ' (thử, chưa ghi)' : ''}. Bảng có ${await db.thuatNgu.count()} dòng.`);
  } finally {
    await db.$disconnect();
  }
})().catch((e) => { console.error(e); process.exit(1); });

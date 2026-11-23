// Quy tắc 24/11/2026 (frontend chỉ tiếng Việt): sửa title/meta/h1 trong SeoTrang và docs/v2/16-seo-trang.csv.
// - Bỏ chỗ trống {Hán}, {English} (chữ Hán, tên Anh không được hiện).
// - Bỏ "natal chart", "tên tiếng Anh".
// - Trang quẻ, Hiệp kỷ, Tetrabiblos, Thần số học nay in bản dịch: "nguyên văn" đổi sang "dịch nghĩa"/"trích sách".
// Chạy lại không đổi gì thêm. Chạy cả trên VPS sau khi triển khai mã (CSDL VPS có cùng các dòng).
// Chạy: npx tsx --env-file=.env scripts/seo-chi-tieng-viet.ts [--thu]   (--thu: chỉ in, không ghi)
import { readFileSync, writeFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

const CAP: [string, string][] = [
  ['bấm sang trang quẻ để đọc nguyên văn.', 'bấm sang trang quẻ để đọc lời quẻ, lời hào.'],
  ['Trích nguyên văn Hiệp kỷ biện phương thư, không bán vật phẩm.', 'Trích Hiệp kỷ biện phương thư có dịch nghĩa, không bán vật phẩm.'],
  ['kèm nguyên văn sách 1905–1926', 'kèm trích sách 1905–1926'],
  ['Có nguyên văn và nguồn.', 'Có trích sách và nguồn.'],
  ['12 cung hoàng đạo: ngày sinh, tên tiếng Anh, tra cung', '12 cung hoàng đạo: ngày sinh, hành tinh chủ nhà, tra cung'],
  ['Bảng 12 cung: tên tiếng Anh, ngày bắt đầu, hành tinh chủ nhà.', 'Bảng 12 cung: ngày bắt đầu, hành tinh chủ nhà.'],
  ['Tính theo Hiệp kỷ biện phương thư, trích nguyên văn.', 'Tính theo Hiệp kỷ biện phương thư, có trích sách.'],
  ['{Nạp âm} ({Hán}) là nạp âm', '{Nạp âm} là nạp âm'],
  ['Sao {Tên} ({Hán}) thuộc', 'Sao {Tên} thuộc'],
  ['theo nguyên văn thiên Thuyết quái', 'theo thiên Thuyết quái (có dịch nghĩa)'],
  ['Kinh Dịch: 64 quẻ nguyên văn, bát quái và gieo quẻ', 'Kinh Dịch: 64 quẻ có dịch nghĩa, bát quái và gieo quẻ'],
  ['64 quẻ với nguyên văn lời quẻ, lời hào và phiên âm Hán Việt,', '64 quẻ với lời quẻ, lời hào dịch tiếng Việt,'],
  ['tên Hán Việt và chữ Hán, quái trên – dưới. Bấm từng quẻ để đọc nguyên văn.', 'tên Hán Việt, quái trên – dưới. Bấm từng quẻ để đọc lời quẻ, lời hào.'],
  ['– Kinh Dịch: nguyên văn lời quẻ, lời hào', '– Kinh Dịch: lời quẻ, lời hào'],
  ['hình quẻ, nguyên văn lời quẻ và 6 hào kèm phiên âm Hán Việt,', 'hình quẻ, lời quẻ và 6 lời hào dịch tiếng Việt,'],
  ['Cung {Tên} ({English}):', 'Cung {Tên}:'],
  ['nguyên văn sách thần số học 1905–1926', 'trích sách thần số học 1905–1926'],
  ['Lá {Tên} ({English}) trong Tarot', 'Lá {Tên} trong Tarot'],
  ['Sóc (New Moon)', 'Sóc (trăng mới)'],
  ['Bản đồ sao cá nhân miễn phí: natal chart tiếng Việt', 'Bản đồ sao cá nhân miễn phí, tiếng Việt'],
  ['Lập bản đồ sao (natal chart) theo', 'Lập bản đồ sao cá nhân theo'],
  ['trích nguyên văn Hiệp kỷ biện phương thư.', 'trích Hiệp kỷ biện phương thư có dịch nghĩa.'],
  ['trích nguyên văn Hiệp kỷ.', 'trích Hiệp kỷ có dịch nghĩa.'],
];

const doi = (s: string) => CAP.reduce((t, [a, b]) => t.split(a).join(b), s);
const thu = process.argv.includes('--thu');

async function main() {
  const p = new PrismaClient();
  let soDong = 0;
  for (const d of await p.seoTrang.findMany({ select: { id: true, duongDan: true, title: true, metaDescription: true, h1: true } })) {
    const moi = { title: doi(d.title ?? ''), metaDescription: doi(d.metaDescription ?? ''), h1: doi(d.h1 ?? '') };
    const khac = (['title', 'metaDescription', 'h1'] as const).filter((k) => (d[k] ?? '') !== moi[k]);
    if (!khac.length) continue;
    soDong++;
    console.log(`${d.duongDan}: ${khac.join(', ')}`);
    if (!thu) await p.seoTrang.update({ where: { id: d.id }, data: Object.fromEntries(khac.map((k) => [k, moi[k]])) });
  }
  await p.$disconnect();

  const CSV = 'docs/v2/16-seo-trang.csv';
  const goc = readFileSync(CSV, 'utf8');
  const sau = doi(goc);
  if (sau !== goc && !thu) writeFileSync(CSV, sau);
  console.log(`${thu ? '[thử] ' : ''}SeoTrang: ${soDong} dòng đổi; CSV: ${sau !== goc ? 'có đổi' : 'không đổi'}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

// Nạp bảng 301/410 từ docs/v2/18-url-cu-xemboi.csv vào SeoChuyenHuong, nguồn DUONG_CU, ĐỂ TẮT (batTat=false).
// Bật từng dòng ở /quan-tri/seo/chuyen-huong khi trang đích v2 đã xuất bản (tránh 301 → 404).
// Dòng mẫu có {tham số} (ví dụ 730 URL xem-ngay-tot-xau) cần biểu thức riêng: bỏ qua, ghi ra để làm tay.
// Chạy lại được: khóa (tuMien, tuDuongDan); không ghi đè dòng đã bật hoặc đã sửa tay.
//   npx tsx scripts/seo-nap-url-cu.ts
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { docCsv } from '../src/lib/seo/kho-tu-khoa';

async function main() {
  const p = new PrismaClient();
  const dong = docCsv(fs.readFileSync(path.resolve(__dirname, '..', 'docs', 'v2', '18-url-cu-xemboi.csv'), 'utf8'));
  let moi = 0, giu = 0;
  const boQua: string[] = [];
  try {
    for (const r of dong) {
      const tu = r.url_cu_hoac_mau;
      if (r.quyet_dinh !== '301' && r.quyet_dinh !== '410') continue;
      if (tu.includes('{')) { boQua.push(`${tu} → ${r.url_dich} (${r.so_url} URL)`); continue; }
      const den = r.quyet_dinh === '410' ? '/' : r.url_dich;
      if (!den || tu === den) { boQua.push(`${tu}: thiếu đích`); continue; }
      const cu = await p.seoChuyenHuong.findUnique({ where: { tuMien_tuDuongDan: { tuMien: 'xemboi.vn', tuDuongDan: tu } } });
      if (cu) { giu++; continue; }
      await p.seoChuyenHuong.create({
        data: { tuDuongDan: tu, denUrl: den, ma: Number(r.quyet_dinh), nguon: 'DUONG_CU', batTat: false, ghiChu: `18-url-cu: ${r.page_id_v2 || ''} ${r.ly_do}`.slice(0, 500) },
      });
      moi++;
    }
    console.log(`Đã thêm ${moi} chuyển hướng (đang TẮT), giữ nguyên ${giu} dòng đã có.`);
    if (boQua.length) console.log('Bỏ qua, cần làm tay:\n  ' + boQua.join('\n  '));
  } finally {
    await p.$disconnect();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });

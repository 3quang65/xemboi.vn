// Nạp bảng 301/410 từ docs/v2/18-url-cu-xemboi.csv vào SeoChuyenHuong, nguồn DUONG_CU, ĐỂ TẮT (batTat=false).
// Bật từng dòng ở /quan-tri/seo/chuyen-huong khi trang đích v2 đã xuất bản (tránh 301 → 404).
// Dòng mẫu có {tham số} (ví dụ 730 URL xem-ngay-tot-xau) cần biểu thức riêng: bỏ qua, ghi ra để làm tay.
// Chạy lại được: khóa (tuMien, tuDuongDan); không ghi đè dòng đã bật hoặc đã sửa tay.
//   npx tsx scripts/seo-nap-url-cu.ts
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { docCsv } from '../src/lib/seo/kho-tu-khoa';

// Mẫu nguồn {d} {m} {yyyy} → nhóm bắt; đích {dd} {mm} {yyyy} → $n:2 / $n (đệm số 0, xem thayNhom trong src/lib/seo/chuyen-huong.ts).
// Chỉ nhận mẫu mà mọi tham số đích đều có ở nguồn; mẫu khác trả null để làm tay.
export function mauThanhBieuThuc(tu: string, dich: string): { re: string; den: string } | null {
  const NHOM: Record<string, { re: string; dich: string[] }> = {
    d: { re: '(\\d{1,2})', dich: ['dd', 'd'] },
    m: { re: '(\\d{1,2})', dich: ['mm', 'm'] },
    yyyy: { re: '(\\d{4})', dich: ['yyyy'] },
  };
  const thuTu: string[] = [];
  let loi = false;
  const thoat = (s: string) => s.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
  const re = '^' + tu.split(/(\{[a-z]+\})/).map((t) => {
    const k = t.match(/^\{([a-z]+)\}$/)?.[1];
    if (!k) return thoat(t);
    if (!NHOM[k]) { loi = true; return ''; }
    thuTu.push(k);
    return NHOM[k].re;
  }).join('') + '$';
  const den = dich.replace(/\{([a-z]+)\}/g, (_, t: string) => {
    const i = thuTu.findIndex((k) => NHOM[k].dich.includes(t));
    if (i < 0) { loi = true; return ''; }
    return t.length === 2 ? `$${i + 1}:2` : `$${i + 1}`;
  });
  return loi || !thuTu.length ? null : { re, den };
}

async function main() {
  const p = new PrismaClient();
  const dong = docCsv(fs.readFileSync(path.resolve(__dirname, '..', 'docs', 'v2', '18-url-cu-xemboi.csv'), 'utf8'));
  let moi = 0, giu = 0;
  const boQua: string[] = [];
  try {
    for (const r of dong) {
      const tu = r.url_cu_hoac_mau;
      if (r.quyet_dinh !== '301' && r.quyet_dinh !== '410') continue;
      if (tu.includes('{')) {
        const bt = mauThanhBieuThuc(tu, r.url_dich);
        if (!bt) { boQua.push(`${tu} → ${r.url_dich} (${r.so_url} URL)`); continue; }
        const cu = await p.seoChuyenHuong.findUnique({ where: { tuMien_tuDuongDan: { tuMien: 'xemboi.vn', tuDuongDan: bt.re } } });
        if (cu) { giu++; continue; }
        await p.seoChuyenHuong.create({
          data: { tuDuongDan: bt.re, denUrl: bt.den, ma: Number(r.quyet_dinh), laBieuThuc: true, nguon: 'DUONG_CU', batTat: false, ghiChu: `18-url-cu: ${r.page_id_v2 || ''} mẫu ${tu} (${r.so_url} URL)`.slice(0, 500) },
        });
        moi++;
        continue;
      }
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

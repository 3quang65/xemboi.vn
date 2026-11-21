#!/usr/bin/env node
/**
 * Script xóa lead thí nghiệm R1 đã quá hạn lưu trữ 60 ngày (Luật 91/2025/QH15).
 * Chạy tay: npm run r1:xoa-han
 * Tùy chọn: node scripts/r1-xoa-han.mjs --dry-run (chỉ đếm, chưa xóa)
 */
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const dryRun = process.argv.includes('--dry-run');
const now = new Date();
const localStorePath = path.join(process.cwd(), 'scratch', 'r1-store.json');

console.log(`[r1:xoa-han] Thời điểm kiểm tra: ${now.toISOString()}${dryRun ? ' (CHẾ ĐỘ THỬ --dry-run)' : ''}`);

// 1. Dọn trên PostgreSQL (nếu kết nối được)
const prisma = new PrismaClient();
try {
  await prisma.$connect();
  const count = await prisma.r1Lead.count({
    where: { hanXoa: { lte: now } },
  });
  if (dryRun) {
    console.log(`[r1:xoa-han] PostgreSQL: tìm thấy ${count} lead quá hạn (chưa xóa vì --dry-run).`);
  } else {
    const res = await prisma.r1Lead.deleteMany({
      where: { hanXoa: { lte: now } },
    });
    console.log(`[r1:xoa-han] PostgreSQL: đã xóa ${res.count} lead quá hạn (<= ${now.toISOString()}).`);
  }
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.log(`[r1:xoa-han] Bỏ qua PostgreSQL (không kết nối được hoặc chưa push bảng): ${msg.split('\n')[0]}`);
} finally {
  await prisma.$disconnect().catch(() => {});
}

// 2. Dọn trên tệp dự phòng cục bộ (nếu tồn tại)
if (fs.existsSync(localStorePath)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(localStorePath, 'utf8'));
    const leads = Array.isArray(parsed.leads) ? parsed.leads : [];
    const conHan = [];
    let soQuaHan = 0;
    for (const l of leads) {
      const han = new Date(l.hanXoa);
      if (Number.isFinite(han.getTime()) && han.getTime() <= now.getTime()) {
        soQuaHan++;
      } else {
        conHan.push(l);
      }
    }
    if (dryRun) {
      console.log(`[r1:xoa-han] Lưu trữ cục bộ (${localStorePath}): tìm thấy ${soQuaHan} lead quá hạn (chưa xóa vì --dry-run).`);
    } else if (soQuaHan > 0) {
      parsed.leads = conHan;
      fs.writeFileSync(localStorePath, JSON.stringify(parsed, null, 2), 'utf8');
      console.log(`[r1:xoa-han] Lưu trữ cục bộ: đã xóa ${soQuaHan} lead quá hạn, còn lại ${conHan.length} lead còn hạn.`);
    } else {
      console.log(`[r1:xoa-han] Lưu trữ cục bộ: 0 lead quá hạn (đang có ${leads.length} lead còn hạn).`);
    }
  } catch (err) {
    console.error('[r1:xoa-han] Lỗi đọc tệp cục bộ:', err);
    process.exitCode = 1;
  }
} else {
  console.log('[r1:xoa-han] Lưu trữ cục bộ: không có tệp dữ liệu.');
}

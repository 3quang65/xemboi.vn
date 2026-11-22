// Bật các chuyển hướng URL cũ (nguồn DUONG_CU, đang tắt) khi trang đích v2 đã chạy thật (docs/v2/19 mục 2.1).
// Mặc định chỉ in danh sách (chạy thử); thêm --ghi để bật. 410 chỉ bật khi có --ca-410.
// Đích được coi là sẵn sàng khi GET trên máy chủ dev/staging trả 200 (không theo chuyển hướng).
//   npx tsx --env-file=.env scripts/seo-bat-chuyen-huong.ts --goc http://localhost:3047 [--ghi] [--ca-410]
import { PrismaClient } from '@prisma/client';

function thamSo(ten: string): string | undefined {
  const i = process.argv.indexOf(ten);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

/** Đích mẫu cho dòng biểu thức: `$n:2` → 01, `$n` → 2026 (đủ cho mẫu ngày duy nhất hiện có). */
export function dichMau(den: string): string {
  return den.replace(/\$\d:2/g, '01').replace(/\$\d/g, '2026');
}

async function main() {
  const goc = (thamSo('--goc') ?? 'http://localhost:3047').replace(/\/$/, '');
  const ghi = process.argv.includes('--ghi');
  const ca410 = process.argv.includes('--ca-410');
  const p = new PrismaClient();
  try {
    const ds = await p.seoChuyenHuong.findMany({ where: { nguon: 'DUONG_CU', batTat: false }, orderBy: { tuDuongDan: 'asc' } });
    const nguonKhac = new Set((await p.seoChuyenHuong.findMany({ where: { batTat: true, laBieuThuc: false }, select: { tuDuongDan: true } })).map((x) => x.tuDuongDan));
    const bat: string[] = [];
    const cho: string[] = [];
    for (const c of ds) {
      if (c.ma === 410) {
        (ca410 ? bat : cho).push(c.id);
        console.log(`${ca410 ? 'BẬT' : 'chờ'}  410  ${c.tuDuongDan}`);
        continue;
      }
      const den = c.laBieuThuc ? dichMau(c.denUrl) : c.denUrl;
      if (nguonKhac.has(den)) { cho.push(c.id); console.log(`chờ  ${c.ma}  ${c.tuDuongDan} → ${den} (đích lại đang chuyển hướng)`); continue; }
      let ma = 0;
      try { ma = (await fetch(goc + den, { redirect: 'manual' })).status; } catch { ma = -1; }
      const ok = ma === 200;
      (ok ? bat : cho).push(c.id);
      console.log(`${ok ? 'BẬT' : 'chờ'}  ${c.ma}  ${c.tuDuongDan} → ${den} [${ma}]`);
    }
    console.log(`\n${bat.length} dòng đủ điều kiện bật, ${cho.length} dòng còn chờ.`);
    if (ghi && bat.length) {
      const r = await p.seoChuyenHuong.updateMany({ where: { id: { in: bat } }, data: { batTat: true } });
      console.log(`Đã bật ${r.count} dòng.`);
    } else if (!ghi) {
      console.log('Chạy thử, chưa ghi. Thêm --ghi để bật.');
    }
  } finally {
    await p.$disconnect();
  }
}

if (process.argv[1]?.includes('seo-bat-chuyen-huong')) main().catch((e) => { console.error(e); process.exit(1); });

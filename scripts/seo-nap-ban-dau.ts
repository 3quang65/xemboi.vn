// Nạp kho SEO ban đầu vào CSDL từ docs/v2 (Đợt 1, docs/v2/17 mục 8). Chạy lại được, không sinh dòng trùng.
//   npx tsx scripts/seo-nap-ban-dau.ts
// Thứ tự: cụm 08 → trang 16 → quy tắc + nhóm loại → từ khóa (KP, autocomplete, gợi ý Google) → gán → từ cấm.
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { baoCaoPhu, docDanhSach, docKeywordPlanner, ganTheoQuyTac, giaiMa, gopVaoKho, type DongTuKhoa } from '../src/lib/seo/kho-tu-khoa';
import { napCum08, napQuyTac, napTrangCsv, napTuCam, type MucTuCam } from '../src/lib/seo/nap-cau-hinh';
import { DANH_SACH_TU_CAM } from '../src/lib/r1/tu-cam';

const GOC = path.resolve(__dirname, '..');
const V2 = path.join(GOC, 'docs', 'v2');
const TK = path.join(V2, 'tu-khoa');
const doc = (p: string) => giaiMa(fs.readFileSync(p));

/** Đường dẫn công khai đang có page.tsx (bỏ nhóm (khu), bỏ route động, bỏ khu quản trị). */
function duongDanDangChay(): Set<string> {
  const out = new Set<string>();
  const duyet = (thu: string, url: string) => {
    for (const e of fs.readdirSync(thu, { withFileTypes: true })) {
      if (!e.isDirectory()) { if (e.name === 'page.tsx') out.add(url || '/'); continue; }
      if (/^(api|admin|quan-tri|la-so)$/.test(e.name) || e.name.startsWith('[') || e.name.startsWith('_')) continue;
      duyet(path.join(thu, e.name), e.name.startsWith('(') ? url : `${url}/${e.name}`);
    }
  };
  duyet(path.join(GOC, 'src', 'app'), '');
  return out;
}

function chuoiGoiY(x: unknown, out: string[]) {
  if (typeof x === 'string') out.push(x);
  else if (Array.isArray(x)) x.forEach((y) => chuoiGoiY(y, out));
  else if (x && typeof x === 'object') Object.values(x).forEach((y) => chuoiGoiY(y, out));
}

async function main() {
  const prisma = new PrismaClient();
  const t0 = Date.now();
  try {
    const soCum = await napCum08(prisma, doc(path.join(V2, '08-tu-khoa.csv')));
    console.log(`Cụm 08: ${soCum}`);

    const daCo = duongDanDangChay();
    const trang = await napTrangCsv(prisma, doc(path.join(V2, '16-seo-trang.csv')), daCo);
    console.log(`Trang 16: ${trang.soTrang} (mẫu có tham số: ${trang.soMau}); route đang chạy: ${[...daCo].join(' ')}`);

    const qt = await napQuyTac(prisma, JSON.parse(doc(path.join(V2, '16-quy-tac-gan-tu-khoa.json'))));
    console.log(`Quy tắc: ${qt.soQuyTac}, nhóm loại: ${qt.soNhomLoai}, quy tắc cũ bị tắt: ${qt.soTat}`);

    // Keyword Planner: mỗi tệp một lô (giữ khoảng thời gian).
    for (const tep of fs.readdirSync(TK).filter((f) => /^keyword-planner-\d+\.csv$/.test(f)).sort()) {
      const { dong, khoang } = docKeywordPlanner(doc(path.join(TK, tep)));
      const kq = await gopVaoKho(prisma, dong, 'KEYWORD_PLANNER', tep, khoang);
      console.log(`  ${tep}: ${kq.soDong} dòng, mới ${kq.soMoi}, cập nhật ${kq.soCapNhat}`);
    }
    const ac: DongTuKhoa[] = [];
    for (const tep of fs.readdirSync(TK).filter((f) => /^tu-khoa-\d+\.csv$/.test(f)).sort()) ac.push(...docDanhSach(doc(path.join(TK, tep)), 'AC'));
    const kqAc = await gopVaoKho(prisma, ac, 'AUTOCOMPLETE', 'tu-khoa-1..5.csv', null);
    console.log(`  autocomplete: ${kqAc.soDong} dòng, mới ${kqAc.soMoi}, cập nhật ${kqAc.soCapNhat}`);
    const gg: string[] = [];
    chuoiGoiY(JSON.parse(doc(path.join(TK, 'goi-y-google.json'))).hat ?? {}, gg);
    const kqGg = await gopVaoKho(prisma, docDanhSach(gg.join('\n'), 'GG'), 'GOI_Y_GOOGLE', 'goi-y-google.json', null);
    console.log(`  gợi ý Google: ${kqGg.soDong} dòng, mới ${kqGg.soMoi}, cập nhật ${kqGg.soCapNhat}`);

    const gan = await ganTheoQuyTac(prisma);
    console.log(`Gán: ${gan.soTuKhoa} từ khóa xét lại, ${gan.soCoQuyTac} khớp quy tắc`);
    const p = await baoCaoPhu(prisma);
    const pct = (a: number, b: number) => (b ? ((a / b) * 100).toFixed(1) + '%' : '-');
    console.log(`Kho: ${p.tong} từ khóa (${p.tongLuong.toLocaleString('vi')} lượt). Loại: ${p.loai} (${p.loaiLuong.toLocaleString('vi')}).`);
    console.log(`Có trang: ${p.coTrang}/${p.tong - p.loai} (${pct(p.coTrang, p.tong - p.loai)}), lượng ${pct(p.coTrangLuong, p.tongLuong - p.loaiLuong)}. Chưa gán: ${p.chuaGan} (${p.chuaGanLuong.toLocaleString('vi')}).`);
    console.log(`Đã phủ (trang XUAT_BAN): ${p.daPhu} từ khóa, ${p.daPhuLuong.toLocaleString('vi')} lượt.`);

    // Từ cấm: tu-cam.json (xemtuvi, chỉ đọc) + danh sách R1.
    const tc = JSON.parse(doc(path.join(V2, 'tai-san-xemtuvi', 'src', 'lib', 'luan-giai', 'ai', 'tu-cam.json'))) as { tuCam: string[]; thayThe: Record<string, string> };
    const ds: MucTuCam[] = [
      ...tc.tuCam.map((c) => ({ cum: c, nhom: 'NEN_TU_CAM_JSON', xuLy: 'CHAN_CUNG' as const, nguon: 'tu-cam.json' })),
      ...Object.entries(tc.thayThe).map(([c, t]) => ({ cum: c, nhom: 'NEN_TU_CAM_JSON', xuLy: 'THAY_THE' as const, thayBang: t, nguon: 'tu-cam.json' })),
      ...DANH_SACH_TU_CAM.map((m) => ({
        cum: m.cumTu,
        nhom: /giải hạn|lễ|cúng|bùa|vật phẩm/i.test(m.lyDo) ? 'LE_VAT_PHAM' : /hù dọa/i.test(m.lyDo) ? 'HU_DOA' : /cờ bạc|số đề/i.test(m.lyDo) ? 'CO_BAC' : /hứa|chắc chắn|100/i.test(m.lyDo) ? 'HUA_HEN' : 'R1',
        xuLy: 'CHAN_CUNG' as const,
        nguon: 'src/lib/r1/tu-cam.ts',
      })),
    ];
    console.log(`Từ cấm: ${await napTuCam(prisma, ds)} cụm`);
    console.log(`Xong sau ${((Date.now() - t0) / 1000).toFixed(1)} giây.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error('Lỗi:', e instanceof Error ? e.stack : e); process.exit(1); });

// Nạp dữ liệu Search Console GIẢ để làm giao diện /quan-tri/seo/xep-hang khi chưa có khóa GSC thật.
// Mọi dòng có url https://xemboi.vn/_thu-gsc/... và truy vấn bắt đầu "[THỬ]". Sau đó chạy tính cảnh báo như thật.
// Chạy: npx tsx --env-file=.env scripts/thu-gsc-gia.ts        (nạp, ghi đè bản giả cũ)
//       npx tsx --env-file=.env scripts/thu-gsc-gia.ts --xoa  (xóa sạch dữ liệu giả và cảnh báo của nó)
// Ý đồ: /_thu-gsc/a tụt vị trí (TUT_HANG kiểu vi_tri), /_thu-gsc/b tụt nhấp (TUT_HANG kiểu nhap),
//       truy vấn "[THỬ] xem tuổi" chia giữa /a và /c (TRUNG_Y_DINH).
import { PrismaClient } from '@prisma/client';
import { tinhCanhBaoGsc, ghiCanhBaoGsc } from '../src/lib/seo/gsc';

const GOC = 'https://xemboi.vn/_thu-gsc/';
const ngayChuoi = (d: Date) => d.toISOString().slice(0, 10);

(async () => {
  const db = new PrismaClient();
  try {
    const xoaCu = async () => {
      const q = await db.seoGscNgay.deleteMany({ where: { url: { startsWith: GOC } } });
      const p = await db.seoGscTrangNgay.deleteMany({ where: { url: { startsWith: GOC } } });
      const c = await db.$executeRaw`DELETE FROM "SeoCanhBao" WHERE "chiTiet"::text LIKE '%/_thu-gsc/%'`;
      return { dongTruyVan: q.count, dongTrang: p.count, canhBao: c };
    };
    if (process.argv.includes('--xoa')) {
      const kq = await xoaCu();
      const cd = await db.caiDat.findUnique({ where: { khoa: 'SEO_GSC_LAN_CUOI' } });
      if (cd && (cd.giaTri as { thu?: boolean })?.thu) await db.caiDat.delete({ where: { khoa: 'SEO_GSC_LAN_CUOI' } });
      console.log('Đã xóa dữ liệu GSC giả:', kq);
      return;
    }
    await xoaCu();
    let hat = 7; // ngẫu nhiên có hạt để chạy lại ra cùng số
    const ngauNhien = () => { hat = (hat * 16807) % 2147483647; return hat / 2147483647; };
    const den = new Date(Date.now() - 2 * 86_400_000);
    const SO_NGAY = 45;
    const truyVan = [
      { url: 'a', q: '[THỬ] lá số tử vi', h: 120, v: 4, tut: 6 },
      { url: 'a', q: '[THỬ] xem tuổi', h: 60, v: 7, tut: 0 },
      { url: 'c', q: '[THỬ] xem tuổi', h: 30, v: 12, tut: 0 },
      { url: 'b', q: '[THỬ] ngày tốt tháng chạp', h: 200, v: 3, tut: 0, nhapTut: true },
      { url: 'c', q: '[THỬ] tuổi hợp làm ăn', h: 40, v: 9, tut: 0 },
    ];
    const dongQ: Parameters<typeof db.seoGscNgay.createMany>[0]['data'] & object[] = [];
    const tongTrang = new Map<string, { ngay: Date; url: string; thietBi: string; hienThi: number; nhap: number; viTriTong: number }>();
    for (let i = SO_NGAY - 1; i >= 0; i--) {
      const ngay = new Date(`${ngayChuoi(new Date(den.getTime() - i * 86_400_000))}T00:00:00Z`);
      const ganDay = i < 7;
      for (const t of truyVan) for (const thietBi of ['MOBILE', 'DESKTOP']) {
        const phan = thietBi === 'MOBILE' ? 0.7 : 0.3;
        const hienThi = Math.max(1, Math.round(t.h * phan * (0.8 + 0.4 * ngauNhien())));
        const viTri = Math.round((t.v + (ganDay ? t.tut : 0) + ngauNhien() * 1.5) * 10) / 10;
        const tyLeNhap = t.nhapTut && ganDay ? 0.03 : Math.max(0.02, 0.35 - viTri * 0.03);
        const nhap = Math.round(hienThi * tyLeNhap);
        const url = GOC + t.url;
        dongQ.push({ ngay, url, trangId: null, truyVan: t.q, thietBi, hienThi, nhap, viTriTB: viTri });
        const k = `${ngayChuoi(ngay)}|${url}|${thietBi}`;
        const g = tongTrang.get(k) ?? { ngay, url, thietBi, hienThi: 0, nhap: 0, viTriTong: 0 };
        // Tổng theo trang lớn hơn tổng theo truy vấn vì Google ẩn truy vấn hiếm: cộng thêm 15 %.
        g.hienThi += Math.round(hienThi * 1.15); g.nhap += nhap; g.viTriTong += viTri * hienThi;
        tongTrang.set(k, g);
      }
    }
    const dongP = [...tongTrang.values()].map((g) => ({ ngay: g.ngay, url: g.url, trangId: null, thietBi: g.thietBi, hienThi: g.hienThi, nhap: g.nhap,
      viTriTB: Math.round((g.viTriTong / (g.hienThi / 1.15)) * 10) / 10 }));
    await db.seoGscNgay.createMany({ data: dongQ });
    await db.seoGscTrangNgay.createMany({ data: dongP });
    const { moc, canhBao } = await tinhCanhBaoGsc(db);
    const ghi = await ghiCanhBaoGsc(db, canhBao);
    const tu = ngayChuoi(new Date(den.getTime() - (SO_NGAY - 1) * 86_400_000));
    const kq = { thu: true, ghiChu: '[THỬ] dữ liệu giả từ scripts/thu-gsc-gia.ts', site: 'sc-domain:xemboi.vn', ngay: SO_NGAY, dongTruyVan: dongQ.length, dongTrang: dongP.length,
      tuNgay: tu, denNgay: ngayChuoi(den), mocCanhBao: moc, canhBao: { tong: canhBao.length, ...ghi }, luc: new Date().toISOString() };
    const cd = await db.caiDat.findUnique({ where: { khoa: 'SEO_GSC_LAN_CUOI' } });
    if (!cd || (cd.giaTri as { thu?: boolean })?.thu) // không đè báo cáo của lần đồng bộ thật
      await db.caiDat.upsert({ where: { khoa: 'SEO_GSC_LAN_CUOI' }, create: { khoa: 'SEO_GSC_LAN_CUOI', giaTri: kq }, update: { giaTri: kq } });
    console.log(JSON.stringify({ ...kq, loai: canhBao.map((c) => `${c.loai}:${c.khoa}`) }, null, 2));
  } finally {
    await db.$disconnect();
  }
})().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });

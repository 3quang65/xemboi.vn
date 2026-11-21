// Nạp lịch nội dung mùa vụ từ docs/v2/08-tu-khoa-uu-tien.md mục 7.2 vào SeoLichMua (Đợt 3).
//   npx tsx --env-file=.env scripts/seo-nap-lich-mua.ts [--thu]
// Chạy lại an toàn: khớp theo tên; dòng đã có thì chỉ cập nhật ngày và ghi chú, không đổi trạng thái người dùng đã đặt.
// Đỉnh tìm trong 08 là [SUY LUẬN]; "Không kịp/Không làm" ghi trạng thái HOAN, hạn lên trang = ngày bắt đầu đỉnh.
import { PrismaClient } from '@prisma/client';

type Mua = { ten: string; tu: string; den: string; han: string; hoan?: boolean; ghiChu: string };
export const LICH_MUA: Mua[] = [
  { ten: 'Tết 2027', tu: '2027-01-15', den: '2027-02-15', han: '2027-01-07', ghiChu: 'Cụm: lịch âm 2027, Tết 2027 ngày nào, tuổi xông đất 2027, giờ xuất hành, năm 2027 con gì. Kỳ vọng lượt vào gần 0 (chỉ ~4 tuần trước Tết); giá trị chính là URL có tuổi cho Tết 2028. Chỉ làm nếu R1 đạt.' },
  { ten: 'Đầu năm 2027 (khai trương, động thổ, xuất hành)', tu: '2027-02-06', den: '2027-03-07', han: '2027-02-06', hoan: true, ghiChu: 'Cụm: xem ngày khai trương, động thổ. Không kịp: E1 chưa có.' },
  { ten: 'Rằm tháng Giêng 2027', tu: '2027-02-20', den: '2027-02-20', han: '2027-02-20', hoan: true, ghiChu: 'Cụm: văn khấn rằm tháng giêng. Không làm 2027: văn khấn chưa qua kiểm bản quyền.' },
  { ten: 'Rằm tháng 7 / Vu Lan 2027', tu: '2027-08-01', den: '2027-08-31', han: '2027-06-15', ghiChu: 'Rằm 16/08/2027. Cụm: cúng rằm tháng 7 vào ngày nào, văn khấn rằm tháng 7. Trang ngày lễ (A5) chắc chắn làm; văn khấn chỉ khi đã qua luật sư.' },
  { ten: 'Cưới hỏi cuối năm 2027', tu: '2027-09-01', den: '2028-01-31', han: '2027-06-30', ghiChu: 'Cụm: xem tuổi vợ chồng, 19xx lấy vợ tuổi nào hợp, kim lâu 2028, xem ngày cưới. F1 hạn 30/06/2027; kim lâu + E1 cưới hạn 31/07/2027. Mùa có tiền nhất cho Gói 3 và E6.' },
  { ten: 'Làm nhà, động thổ 2028', tu: '2027-11-01', den: '2028-03-31', han: '2027-09-30', ghiChu: 'Cụm: xem tuổi làm nhà 2028, kim lâu, hoang ốc, tam tai 2028, ngày động thổ.' },
  { ten: 'Tử vi 2028 theo tuổi', tu: '2027-12-01', den: '2028-02-29', han: '2027-09-30', ghiChu: 'Cụm: tử vi tuổi … năm 2028 (120 trang). Khớp 07: trước 10/2027.' },
  { ten: 'Tết 2028', tu: '2028-01-01', den: '2028-01-31', han: '2027-10-31', ghiChu: 'Tết 26/01/2028. Cụm: lịch âm 2028, Tết 2028, xông đất 2028, xuất hành 2028, văn khấn ông Táo, giao thừa, mâm cúng. Văn khấn nếu đã qua kiểm.' },
  { ten: 'Khai trương, động thổ đầu năm 2028', tu: '2028-01-26', den: '2028-02-24', han: '2027-11-30', ghiChu: 'Tháng Giêng âm 2028. Cụm: xem ngày khai trương, động thổ. Cần E1 xong ở Q3/2027.' },
  { ten: 'Lịch âm 2028 (lịch năm sau)', tu: '2027-10-01', den: '2028-12-31', han: '2027-09-30', ghiChu: 'Tìm cả năm ("lịch âm năm 2027" đã 1K–10K trước năm). Rẻ, sinh từ engine.' },
];

const thu = process.argv.includes('--thu');
(async () => {
  const db = new PrismaClient();
  try {
    let moi = 0, sua = 0;
    for (const m of LICH_MUA) {
      const data = { dinhTu: new Date(m.tu), dinhDen: new Date(m.den), hanLenTrang: new Date(m.han), ghiChu: `08 mục 7.2. ${m.ghiChu}` };
      const cu = await db.seoLichMua.findFirst({ where: { ten: m.ten } });
      if (thu) { console.log(`${cu ? 'sửa' : 'mới'}: ${m.ten} (hạn ${m.han})`); continue; }
      if (cu) { await db.seoLichMua.update({ where: { id: cu.id }, data }); sua++; }
      else { await db.seoLichMua.create({ data: { ten: m.ten, ...data, trangThai: m.hoan ? 'HOAN' : 'CHUA_LAM' } }); moi++; }
    }
    if (!thu) console.log(`Lịch mùa vụ: thêm ${moi}, cập nhật ${sua}, tổng ${await db.seoLichMua.count()}.`);
  } finally {
    await db.$disconnect();
  }
})().catch((e) => { console.error(e); process.exit(1); });

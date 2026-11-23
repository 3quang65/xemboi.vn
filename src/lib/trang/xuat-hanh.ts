// Giờ và hướng xuất hành mùng 1 đến mùng 10 Tết (trang /xem-ngay/xuat-hanh, 16-seo-trang.csv XN-XUATHANH).
// Chỉ dữ liệu tính được, không có lời bình:
//  - Giờ hoàng đạo: bảng 6 mẫu của Hồ Ngọc Đức, giống mọi trang lịch (lich.ts).
//  - Hướng Hỷ thần, Tài thần, Phúc thần theo thiên can của ngày: ba bài ca trong 玉匣記 Ngọc hạp ký,
//    mục 民俗吉凶日篇 (nguồn WS12, Wikisource, CC BY-SA 4.0; đoạn rag_doan 8069, 8072, 8071).
// Ngọc hạp ký chỉ là một sách. Sách khác có thể ghi hướng khác (nhất là Tài thần); trang phải ghi rõ đây là theo sách nào.
import { amSangDuong, soNgayJulius, THIEN_CAN } from '@/lib/tuvi-v2/am-lich';
import { ngayHienTaiVN, ngayLich, tetSapToi, type GioTrongNgay } from './lich';
import { danhSachNguonCongKhai } from './nen';

export type Huong = 'Đông' | 'Tây' | 'Nam' | 'Bắc' | 'Đông Bắc' | 'Đông Nam' | 'Tây Bắc' | 'Tây Nam';

export type BaiCaHuong = {
  ma: 'hyThan' | 'taiThan' | 'phucThan';
  ten: string;
  /** Tên bài ca trong sách, chữ Hán. */
  tenBai: string;
  /** Nguyên văn bài ca, chép đúng đoạn nguồn. */
  /** Nguyên văn chỉ lưu để đối chiếu, KHÔNG hiển thị. */
  nguyenVan: string;
  /** Dịch nghĩa tiếng Việt (xemboi dịch sát chữ) để hiển thị. */
  dich: string;
  /** Vị trí trong sách. */
  viTri: string;
  /** Tên bài và vị trí bằng tiếng Việt (để hiển thị). */
  tenBaiViet: string;
  viTriViet: string;
  doanId: number;
  /** Hướng theo chỉ số thiên can 0 = Giáp … 9 = Quý. */
  theoCan: Huong[];
};

// 甲己在艮，乙庚乾，丙辛坤位喜神安，丁壬只在離宮坐，戊癸遊來在巽間。艮 Đông Bắc, 乾 Tây Bắc, 坤 Tây Nam, 離 Nam, 巽 Đông Nam.
const HY: Huong[] = ['Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Nam', 'Đông Nam', 'Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Nam', 'Đông Nam'];
// 甲乙東北，丙丁西南，戊己正北，庚辛正東，壬癸正南。
const TAI: Huong[] = ['Đông Bắc', 'Đông Bắc', 'Tây Nam', 'Tây Nam', 'Bắc', 'Bắc', 'Đông', 'Đông', 'Nam', 'Nam'];
// 甲乙東南，丙丁正東，戊北己南，庚辛坤，壬在乾方，癸在西。
const PHUC: Huong[] = ['Đông Nam', 'Đông Nam', 'Đông', 'Đông', 'Bắc', 'Nam', 'Tây Nam', 'Tây Nam', 'Tây Bắc', 'Tây'];

export const NGUON_XUAT_HANH = {
  ma: 'WS12',
  tenGoc: '玉匣記',
  tenHanViet: 'Ngọc hạp ký',
  giayPhep: 'CC BY-SA 4.0',
  ghiCong: 'Văn bản: Wikisource, CC BY-SA 4.0',
  url: 'https://zh.wikisource.org/wiki/%E7%8E%89%E5%8C%A3%E8%A8%98',
} as const;

export const BAI_CA_HUONG: BaiCaHuong[] = [
  {
    ma: 'hyThan', ten: 'Hỷ thần', tenBai: '喜神方位歌', viTri: '民俗吉凶日篇 · 喜神方位歌', tenBaiViet: 'Bài ca phương Hỷ thần', viTriViet: 'Thiên Dân tục cát hung nhật · Bài ca phương Hỷ thần', doanId: 8069, theoCan: HY,
    nguyenVan: '凡嫁娶、冠帶，新人向之大吉，出行、移徙、修造，背向之大吉。甲己在艮乙庚乾，丙辛坤位喜神安，丁壬只在離宮坐，戊癸遊來在巽間。',
    dich: 'Phàm cưới gả, làm lễ đội mũ, người mới hướng mặt về phương ấy thì rất tốt; xuất hành, dời chỗ ở, sửa dựng nhà mà quay lưng về phương ấy thì rất tốt. Ngày Giáp, Kỷ Hỷ thần ở Cấn; ngày Ất, Canh ở Càn; ngày Bính, Tân Hỷ thần yên ở Khôn; ngày Đinh, Nhâm chỉ ngồi ở cung Ly; ngày Mậu, Quý dạo đến ở Tốn.',
  },
  {
    ma: 'taiThan', ten: 'Tài thần', tenBai: '財神方位歌', viTri: '民俗吉凶日篇 · 財神方位歌', tenBaiViet: 'Bài ca phương Tài thần', viTriViet: 'Thiên Dân tục cát hung nhật · Bài ca phương Tài thần', doanId: 8072, theoCan: TAI,
    nguyenVan: '甲乙東北是財神，丙丁向在西南尋，戊己正北坐方位，庚辛正東去安身，壬癸原來正南坐，便是財神方位真。',
    dich: 'Ngày Giáp, Ất Tài thần ở Đông Bắc; ngày Bính, Đinh tìm về Tây Nam; ngày Mậu, Kỷ ngồi ở chính Bắc; ngày Canh, Tân về ở chính Đông; ngày Nhâm, Quý vốn ngồi ở chính Nam; ấy là phương Tài thần đúng thật.',
  },
  {
    ma: 'phucThan', ten: 'Phúc thần', tenBai: '福神方位歌', viTri: '民俗吉凶日篇 · 福神方位歌', tenBaiViet: 'Bài ca phương Phúc thần', viTriViet: 'Thiên Dân tục cát hung nhật · Bài ca phương Phúc thần', doanId: 8071, theoCan: PHUC,
    nguyenVan: '甲乙東南是福神，丙丁正東是堪宜，戊北己南庚辛坤，壬在乾方癸在西。',
    dich: 'Ngày Giáp, Ất Phúc thần ở Đông Nam; ngày Bính, Đinh ở chính Đông là hợp; ngày Mậu ở Bắc, ngày Kỷ ở Nam, ngày Canh, Tân ở Khôn (Tây Nam); ngày Nhâm ở phương Càn, ngày Quý ở phương Tây.',
  },
];

export type NgayXuatHanh = {
  mung: number;
  /** 'YYYY-MM-DD' dương lịch. */
  iso: string;
  duong: string;
  thu: string;
  canChiNgay: string;
  canNgay: string;
  gioHoangDao: GioTrongNgay[];
  huong: { hyThan: Huong; taiThan: Huong; phucThan: Huong };
};

export type XuatHanhTet = {
  namAm: number;
  canChiNam: string;
  conGiap: string;
  ngay: NgayXuatHanh[];
};

const hai = (n: number) => String(n).padStart(2, '0');

/** Mùng 1 đến mùng `soNgay` tháng Giêng năm âm `namAm`. */
export function xuatHanhTet(namAm: number, soNgay = 10): XuatHanhTet {
  if (!Number.isInteger(namAm) || namAm < 1801 || namAm > 2198) throw new RangeError(`Năm ngoài phạm vi: ${namAm}`);
  const ngay: NgayXuatHanh[] = [];
  for (let mung = 1; mung <= soNgay; mung++) {
    const d = amSangDuong(mung, 1, namAm);
    if (!d) throw new Error(`Không đổi được mùng ${mung} tháng Giêng ${namAm}`);
    const ct = ngayLich(d.ngay, d.thang, d.nam);
    const c = ct.canChiNgay.can;
    ngay.push({
      mung, iso: ct.iso, duong: `${hai(d.ngay)}/${hai(d.thang)}/${d.nam}`, thu: ct.thu,
      canChiNgay: ct.canChiNgay.ten, canNgay: THIEN_CAN[c],
      gioHoangDao: ct.gioHoangDao,
      huong: { hyThan: HY[c], taiThan: TAI[c], phucThan: PHUC[c] },
    });
  }
  const [y, m, d] = ngay[0].iso.split('-').map(Number);
  const dau = ngayLich(d, m, y);
  return { namAm, canChiNam: dau.canChiNam.ten, conGiap: dau.conGiapNam, ngay };
}

/** Đường dẫn /nguon/<slug> của Ngọc hạp ký nếu nguồn đang công khai; không có thì null (trang chỉ ghi tên sách). */
export async function duongDanNguonXuatHanh(): Promise<string | null> {
  const n = (await danhSachNguonCongKhai()).find((x) => x.ma === NGUON_XUAT_HANH.ma);
  return n ? `/nguon/${n.slug}` : null;
}

/**
 * Năm âm trang nên hiện: đang trong mùng 1–10 Tết thì năm hiện tại, ngoài khoảng đó thì Tết sắp tới (giờ Việt Nam).
 */
export function namXuatHanh(luc = new Date()): number {
  const h = ngayHienTaiVN(luc);
  const nay = soNgayJulius(h.ngay, h.thang, h.nam);
  const tetNay = amSangDuong(1, 1, h.nam)!;
  const lech = nay - soNgayJulius(tetNay.ngay, tetNay.thang, tetNay.nam);
  return lech >= 0 && lech <= 9 ? h.nam : tetSapToi(luc).namAm;
}

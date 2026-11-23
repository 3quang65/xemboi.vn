import { hai } from '@/components/ck/lichHelpers';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import type { NgayDuong } from '@/lib/tuvi-v2/am-lich';
import type { MacDinhTrang, ThongTinTrang } from '@/lib/trang/meta';
import {
  VIEC,
  doanThang,
  phanTichThangXemNgay,
  type MaViec,
} from '@/lib/trang/xem-ngay';

export const NGUON_LUNAR_BAT_BUOC =
  'Theo bảng nghi kỵ của thư viện mở lunar-javascript (MIT); thư viện không ghi sách gốc.';

export function thangXemNgayHopLe(nam: number, thang: number): boolean {
  return phanTichThangXemNgay(doanThang(nam, thang)) !== null;
}

export function isoTuNgayDuong(d: NgayDuong): string {
  return `${d.nam}-${hai(d.thang)}-${hai(d.ngay)}`;
}

export function homNayVaNgayMaiVN(luc = new Date()): {
  homNay: NgayDuong;
  ngayMai: NgayDuong;
  homNayIso: string;
} {
  const homNay = ngayHienTaiVN(luc);
  const ngayMai = ngayHienTaiVN(new Date(luc.getTime() + 86_400_000));
  return {
    homNay,
    ngayMai,
    homNayIso: isoTuNgayDuong(homNay),
  };
}

export function taoSchemaWebPage(
  tt: Pick<ThongTinTrang, 'title' | 'canonical' | 'description'>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: tt.title,
    url: tt.canonical,
    inLanguage: 'vi',
    ...(tt.description ? { description: tt.description } : {}),
  };
}

export function serializeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

export function macDinhHub(): MacDinhTrang {
  return {
    title: 'Xem ngày tốt xấu: hoàng đạo, 12 trực, nghi kỵ theo từng hệ',
    h1: 'Xem ngày theo từng hệ',
    description:
      'Tra cứu ngày theo 12 thần hoàng đạo, 12 trực và bảng nghi kỵ theo từng sách. Hiện cả ba lớp, không gộp thành điểm.',
  };
}

export function macDinhViec(ma: MaViec, nam: number, thang: number): MacDinhTrang {
  const ten = VIEC[ma].ten;
  const tenThuong = ten.toLowerCase();
  return {
    title:
      ma === 'cat-toc'
        ? `Ngày cắt tóc tháng ${thang}/${nam}: hoàng đạo, 12 trực, nghi kỵ`
        : `Xem ngày ${tenThuong} ${nam}: hoàng đạo, 12 trực, nghi kỵ`,
    h1: `Xem ngày ${tenThuong}`,
    description: `Danh sách ngày ghi nghi ${tenThuong} năm ${nam} theo bảng nghi kỵ, kèm 12 trực và 12 thần hoàng đạo, hắc đạo.`,
  };
}

export function macDinhThang(nam: number, thang: number): MacDinhTrang {
  return {
    title: `Xem ngày tháng ${thang}/${nam}: hoàng đạo, 12 trực, nghi kỵ`,
    h1: `Xem ngày tháng ${thang} năm ${nam}`,
    description: `Bảng xem ngày tháng ${thang}/${nam} theo ba hệ: 12 thần hoàng đạo, 12 trực và bảng nghi kỵ.`,
  };
}

export function macDinhViecThang(
  ma: MaViec,
  nam: number,
  thang: number,
): MacDinhTrang {
  const tenThuong = VIEC[ma].ten.toLowerCase();
  return {
    title: `Xem ngày ${tenThuong} tháng ${thang}/${nam}: hoàng đạo, 12 trực, nghi kỵ`,
    h1: `Xem ngày ${tenThuong} tháng ${thang}/${nam}`,
    description: `Các ngày ghi nghi ${tenThuong} tháng ${thang}/${nam} theo bảng nghi kỵ, kèm 12 trực và 12 thần hoàng đạo, hắc đạo.`,
  };
}

export function muoiHaiThangToi(
  namBatDau: number,
  thangBatDau: number,
): { nam: number; thang: number }[] {
  const ketQua: { nam: number; thang: number }[] = [];
  const moc = namBatDau * 12 + (thangBatDau - 1);
  for (let i = 0; i < 12; i++) {
    const tong = moc + i;
    const nam = Math.floor(tong / 12);
    const thang = (tong % 12) + 1;
    if (thangXemNgayHopLe(nam, thang)) {
      ketQua.push({ nam, thang });
    }
  }
  return ketQua;
}

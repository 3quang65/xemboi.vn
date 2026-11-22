// Menu, chân trang và breadcrumb cho trang công khai v2 (docs/v2/16-seo-kien-truc.md mục 3, docs/v2/19).
// Chỉ liệt kê trang ĐÃ DỰNG ở v2: thêm mục khi đợt F2–F6 dựng xong trang tương ứng, để không có liên kết chết.

export type MucMenu = { ten: string; href: string; moTa?: string; con?: MucMenu[] };

/** Đợt đã dựng xong. Tăng dần khi nghiệm thu từng đợt (F1 → F5). */
export const DOT_DA_DUNG = 3;

const TAT_CA: (MucMenu & { dot: number; conDot?: number[] })[] = [
  {
    dot: 1, ten: 'Tử vi', href: '/tu-vi', moTa: 'Lá số, 12 cung, 14 chính tinh',
    con: [
      { ten: 'Lập lá số tử vi', href: '/tu-vi/lap-la-so' },
      { ten: 'Tử vi 2027', href: '/tu-vi-2027' },
      { ten: 'Lá số trọn đời', href: '/tu-vi/tron-doi' },
      { ten: '12 cung', href: '/tu-vi/cung' },
      { ten: '14 chính tinh', href: '/tu-vi/sao' },
    ],
    conDot: [1, 1, 4, 4, 4],
  },
  {
    dot: 2, ten: 'Lịch âm', href: '/lich-am', moTa: 'Âm lịch hôm nay, đổi ngày, lịch vạn niên',
    con: [
      { ten: 'Đổi ngày âm dương', href: '/lich-am/doi-ngay' },
      { ten: 'Lịch vạn niên', href: '/lich-am/lich-van-nien' },
      { ten: 'Âm lịch ngày mai', href: '/lich-am/ngay-mai' },
      { ten: 'Tết Nguyên Đán', href: '/tet' },
    ],
    conDot: [2, 2, 2, 2],
  },
  {
    dot: 3, ten: 'Can chi & mệnh', href: '/can-chi', moTa: 'Sinh năm mệnh gì, nạp âm, con giáp',
    con: [
      { ten: 'Sinh năm bao nhiêu mệnh gì', href: '/sinh-nam' },
      { ten: '60 hoa giáp', href: '/can-chi/60-hoa-giap' },
      { ten: 'Nạp âm', href: '/nap-am' },
      { ten: 'Ngũ hành', href: '/ngu-hanh' },
      { ten: '12 con giáp', href: '/con-giap' },
      { ten: 'Màu hợp mệnh', href: '/ngu-hanh/mau-hop-menh' },
    ],
    conDot: [3, 3, 3, 3, 3, 3],
  },
  {
    dot: 4, ten: 'Xem tuổi', href: '/xem-tuoi', moTa: 'Tuổi vợ chồng, xông đất',
    con: [
      { ten: 'Xem tuổi vợ chồng', href: '/xem-tuoi/vo-chong' },
      { ten: 'Tuổi xông đất', href: '/xem-tuoi/xong-dat' },
    ],
    conDot: [4, 4],
  },
  {
    dot: 4, ten: 'Bát tự', href: '/bat-tu', moTa: 'Tứ trụ năm, tháng, ngày, giờ',
    con: [{ ten: 'Lập lá số bát tự', href: '/bat-tu/lap-la-so' }],
    conDot: [4],
  },
];

const locDot = (dot: number) => (m: (typeof TAT_CA)[number]): MucMenu => ({
  ten: m.ten, href: m.href, moTa: m.moTa,
  con: m.con?.filter((_, i) => (m.conDot?.[i] ?? m.dot) <= dot),
});

/**
 * Menu chính. Hub chưa dựng thì chưa hiện. Riêng F1: hub Tử vi đã có.
 * `dot` để test và xem trước; mặc định là DOT_DA_DUNG.
 */
export function menuChinh(dot = DOT_DA_DUNG): MucMenu[] {
  return TAT_CA.filter((m) => m.dot <= dot).map(locDot(dot));
}

export type CotChanTrang = { tieuDe: string; muc: MucMenu[] };

export function chanTrang(dot = DOT_DA_DUNG): CotChanTrang[] {
  const cot: CotChanTrang[] = menuChinh(dot).map((m) => ({ tieuDe: m.ten, muc: [{ ten: m.ten, href: m.href }, ...(m.con ?? [])] }));
  const nen: (MucMenu & { dot: number })[] = [
    { dot: 5, ten: 'Phương pháp', href: '/phuong-phap' },
    { dot: 5, ten: 'Nguồn sách', href: '/nguon' },
    { dot: 5, ten: 'Từ điển', href: '/tu-dien' },
    { dot: 5, ten: 'Kiến thức', href: '/kien-thuc' },
    { dot: 4, ten: 'Bảng giá', href: '/goi' },
    { dot: 5, ten: 'Liên hệ', href: '/lien-he' },
    { dot: 5, ten: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat-va-cookies' },
    { dot: 5, ten: 'Điều khoản sử dụng', href: '/chinh-sach-su-dung-va-khieu-nai' },
    { dot: 5, ten: 'Bản quyền', href: '/chinh-sach-ban-quyen' },
  ];
  const conLai = nen.filter((m) => m.dot <= dot).map(({ ten, href }) => ({ ten, href }));
  if (conLai.length) cot.push({ tieuDe: 'Về xemboi', muc: conLai });
  return cot;
}

// Tên ngắn cho breadcrumb. Đoạn không có trong bảng thì trang tự truyền tên (vd năm, tên sao).
const TEN_DOAN: Record<string, string> = {
  '/tu-vi': 'Tử vi', '/tu-vi/lap-la-so': 'Lập lá số', '/tu-vi/tron-doi': 'Trọn đời', '/tu-vi/cung': '12 cung', '/tu-vi/sao': 'Chính tinh',
  '/tu-vi/luan-giai': 'Luận giải', '/tu-vi-2027': 'Tử vi 2027',
  '/lich-am': 'Lịch âm', '/lich-am/doi-ngay': 'Đổi ngày', '/lich-am/lich-van-nien': 'Lịch vạn niên', '/lich-am/ngay-mai': 'Ngày mai',
  '/can-chi': 'Can chi & mệnh', '/can-chi/60-hoa-giap': '60 hoa giáp', '/sinh-nam': 'Sinh năm', '/nap-am': 'Nạp âm',
  '/ngu-hanh': 'Ngũ hành', '/ngu-hanh/mau-hop-menh': 'Màu hợp mệnh', '/con-giap': 'Con giáp',
  '/xem-tuoi': 'Xem tuổi', '/xem-tuoi/vo-chong': 'Vợ chồng', '/xem-tuoi/xong-dat': 'Xông đất',
  '/bat-tu': 'Bát tự', '/bat-tu/lap-la-so': 'Lập lá số bát tự', '/kinh-dich': 'Kinh Dịch', '/kinh-dich/gieo-que': 'Gieo quẻ',
  '/tet': 'Tết', '/xem-ngay': 'Xem ngày', '/xem-ngay/xuat-hanh': 'Xuất hành',
  '/phuong-phap': 'Phương pháp', '/nguon': 'Nguồn sách', '/tu-dien': 'Từ điển', '/kien-thuc': 'Kiến thức', '/goi': 'Bảng giá', '/lien-he': 'Liên hệ',
};

// Trang có cha không theo đường dẫn (docs/v2/16-seo-trang.csv cột "cha").
const CHA_RIENG: Record<string, string> = {
  '/tu-vi-2027': '/tu-vi', '/sinh-nam': '/can-chi', '/nap-am': '/can-chi', '/ngu-hanh': '/can-chi', '/con-giap': '/can-chi',
  '/tet': '/lich-am', '/xem-ngay/xuat-hanh': '/tet', '/xem-tuoi/xong-dat': '/tet',
};

export type MatXich = { ten: string; href: string };

/**
 * Breadcrumb từ Trang chủ tới trang hiện tại. `tenCuoi` đặt tên cho đoạn cuối (vd "Sinh năm 1990").
 * Đoạn giữa không có tên trong bảng thì bỏ qua (không bịa tên).
 */
export function breadcrumb(duongDan: string, tenCuoi?: string): MatXich[] {
  const chuoi: string[] = [];
  let p = duongDan.replace(/\/+$/, '') || '/';
  const daQua = new Set<string>();
  while (p && p !== '/' && !daQua.has(p)) {
    daQua.add(p);
    chuoi.unshift(p);
    p = CHA_RIENG[p] ?? (p.slice(0, p.lastIndexOf('/')) || '/');
  }
  const kq: MatXich[] = [{ ten: 'Trang chủ', href: '/' }];
  chuoi.forEach((h, i) => {
    const cuoi = i === chuoi.length - 1;
    const ten = cuoi ? tenCuoi ?? TEN_DOAN[h] : TEN_DOAN[h];
    if (ten) kq.push({ ten, href: h });
  });
  return kq;
}

/** JSON-LD BreadcrumbList cho breadcrumb trên. */
export function schemaBreadcrumb(ds: MatXich[], goc = 'https://xemboi.vn') {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: ds.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.ten, item: goc + (m.href === '/' ? '' : m.href) })),
  };
}

/**
 * Các đường dẫn đã có trang v2 ở đợt `dot`: dùng để chỉ hiện liên kết tới trang đã dựng
 * (trang chưa dựng thì hiện chữ "Sắp có", không gắn liên kết).
 */
export function trangDaDung(dot = DOT_DA_DUNG): Set<string> {
  const s = new Set<string>(['/']);
  for (const m of menuChinh(dot)) { s.add(m.href); m.con?.forEach((c) => s.add(c.href)); }
  for (const c of chanTrang(dot)) c.muc.forEach((m) => s.add(m.href));
  return s;
}

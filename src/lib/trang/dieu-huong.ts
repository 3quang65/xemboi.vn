// Menu, chân trang và breadcrumb cho trang công khai v2 (docs/v2/16-seo-kien-truc.md mục 3, docs/v2/19).
// Chỉ liệt kê trang ĐÃ DỰNG ở v2: thêm mục khi đợt F2–F6 dựng xong trang tương ứng, để không có liên kết chết.

/** `them`: hub phụ, ở desktop gom vào nút "Thêm" để menu vừa một hàng; ngăn kéo mobile và chân trang vẫn hiện như mục thường. */
export type MucMenu = { ten: string; href: string; moTa?: string; con?: MucMenu[]; them?: boolean };

/** Đợt đã dựng xong. Tăng dần khi nghiệm thu từng đợt (F1 → F5). */
export const DOT_DA_DUNG = 5;

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
      { ten: 'Giờ xuất hành Tết', href: '/xem-ngay/xuat-hanh' },
    ],
    conDot: [2, 2, 2, 2, 5],
  },
  {
    dot: 5, ten: 'Xem ngày', href: '/xem-ngay', moTa: 'Ngày tốt theo việc, hoàng đạo, 12 trực',
    con: [
      { ten: 'Xem ngày cưới', href: '/xem-ngay/cuoi-hoi' },
      { ten: 'Ngày khai trương', href: '/xem-ngay/khai-truong' },
      { ten: 'Ngày động thổ', href: '/xem-ngay/dong-tho' },
      { ten: 'Ngày về nhà mới', href: '/xem-ngay/nhap-trach' },
      { ten: 'Ngày mua xe', href: '/xem-ngay/mua-xe' },
      { ten: 'Ngày cắt tóc', href: '/xem-ngay/cat-toc' },
    ],
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
  {
    dot: 4, ten: 'Kinh Dịch', href: '/kinh-dich', moTa: '64 quẻ nguyên văn, gieo quẻ đồng xu',
    con: [
      { ten: 'Gieo quẻ', href: '/kinh-dich/gieo-que' },
      { ten: '64 quẻ', href: '/kinh-dich/64-que' },
    ],
    conDot: [4, 5],
  },
  {
    dot: 5, ten: 'Phong thủy', href: '/phong-thuy', moTa: 'Cung phi, bát trạch, hướng nhà, cửu tinh năm',
    con: [
      { ten: 'Tra cung phi', href: '/phong-thuy/cung-phi' },
      { ten: 'Bát trạch', href: '/phong-thuy/bat-trach' },
      { ten: 'Hướng nhà hợp tuổi', href: '/phong-thuy/huong-nha' },
      { ten: 'Cửu tinh năm, tháng', href: '/phong-thuy/cuu-tinh' },
    ],
  },
  {
    dot: 5, ten: 'Thần số học', href: '/than-so-hoc', moTa: 'Số chủ đạo, năm cá nhân, biểu đồ ngày sinh', them: true,
    con: [
      { ten: 'Tính số chủ đạo', href: '/than-so-hoc/so-chu-dao' },
      { ten: 'Biểu đồ ngày sinh', href: '/than-so-hoc/bieu-do-ngay-sinh' },
      { ten: 'Thần số học theo tên', href: '/than-so-hoc/theo-ten' },
    ],
  },
  {
    dot: 5, ten: 'Chiêm tinh', href: '/chiem-tinh', moTa: '12 cung hoàng đạo theo Tetrabiblos', them: true,
    con: [{ ten: '12 cung hoàng đạo', href: '/chiem-tinh/cung-hoang-dao' }],
  },
];

const locDot = (dot: number) => (m: (typeof TAT_CA)[number]): MucMenu => ({
  ten: m.ten, href: m.href, moTa: m.moTa, ...(m.them ? { them: true } : {}),
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
    { dot: 6, ten: 'Bảng giá', href: '/goi' },
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
  '/bat-tu': 'Bát tự', '/bat-tu/lap-la-so': 'Lập lá số bát tự', '/kinh-dich': 'Kinh Dịch', '/kinh-dich/gieo-que': 'Gieo quẻ', '/kinh-dich/64-que': '64 quẻ',
  '/tet': 'Tết', '/xem-ngay': 'Xem ngày', '/xem-ngay/xuat-hanh': 'Xuất hành',
  '/phong-thuy': 'Phong thủy', '/phong-thuy/cung-phi': 'Cung phi', '/phong-thuy/bat-trach': 'Bát trạch', '/phong-thuy/huong-nha': 'Hướng nhà', '/phong-thuy/cuu-tinh': 'Cửu tinh',
  '/than-so-hoc': 'Thần số học', '/than-so-hoc/so-chu-dao': 'Số chủ đạo', '/than-so-hoc/theo-ten': 'Theo tên',
  '/than-so-hoc/bieu-do-ngay-sinh': 'Biểu đồ ngày sinh',
  '/chiem-tinh': 'Chiêm tinh', '/chiem-tinh/cung-hoang-dao': '12 cung hoàng đạo', // /than-so-hoc/nam-ca-nhan không có trang gốc: breadcrumb bỏ qua đoạn này
  '/xem-ngay/cuoi-hoi': 'Ngày cưới', '/xem-ngay/khai-truong': 'Khai trương', '/xem-ngay/dong-tho': 'Động thổ',
  '/xem-ngay/nhap-trach': 'Nhập trạch', '/xem-ngay/mua-xe': 'Mua xe', '/xem-ngay/cat-toc': 'Cắt tóc',
  '/phuong-phap': 'Phương pháp', '/nguon': 'Nguồn sách', '/tu-dien': 'Từ điển', '/kien-thuc': 'Kiến thức', '/goi': 'Bảng giá', '/lien-he': 'Liên hệ',
  '/phuong-phap/nam-phai-bac-phai': 'Nam phái và Bắc phái', '/phuong-phap/gio-ty': 'Giờ Tý', '/phuong-phap/thang-nhuan': 'Tháng nhuận',
  '/phuong-phap/chuan-bien-tap': 'Chuẩn biên tập', '/phuong-phap/nguoi-duyet': 'Người duyệt',
  '/chinh-sach-bao-mat-va-cookies': 'Chính sách bảo mật', '/chinh-sach-su-dung-va-khieu-nai': 'Điều khoản sử dụng', '/chinh-sach-ban-quyen': 'Bản quyền',
};

// Trang có cha không theo đường dẫn (docs/v2/16-seo-trang.csv cột "cha").
const CHA_RIENG: Record<string, string> = {
  '/tu-vi-2027': '/tu-vi', '/sinh-nam': '/can-chi', '/nap-am': '/can-chi', '/ngu-hanh': '/can-chi', '/con-giap': '/can-chi',
  '/tet': '/lich-am', '/xem-ngay/xuat-hanh': '/tet', '/xem-tuoi/xong-dat': '/tet',
  '/bai-viet': '/kien-thuc',
};

// Trang lập trình có cha là một trang chỉ mục (vd /kinh-dich/que/01-thuan-can → /kinh-dich/64-que).
const CHA_THEO_TIEN_TO: [string, string][] = [
  ['/kinh-dich/que/', '/kinh-dich/64-que'], ['/kinh-dich/bat-quai/', '/kinh-dich/64-que'],
];

// Trang đã dựng nhưng không nằm trong menu hay chân trang (chỉ được liên kết từ trang cha).
const TRANG_CON: { dot: number; href: string }[] = [
  { dot: 5, href: '/phuong-phap/nam-phai-bac-phai' }, { dot: 5, href: '/phuong-phap/gio-ty' }, { dot: 5, href: '/phuong-phap/thang-nhuan' },
  { dot: 5, href: '/phuong-phap/chuan-bien-tap' }, { dot: 5, href: '/phuong-phap/nguoi-duyet' },
];

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
    p = CHA_RIENG[p] ?? CHA_THEO_TIEN_TO.find(([t]) => p.startsWith(t))?.[1] ?? (p.slice(0, p.lastIndexOf('/')) || '/');
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
  for (const t of TRANG_CON) if (t.dot <= dot) s.add(t.href);
  return s;
}

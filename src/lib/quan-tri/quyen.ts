// Ma trận quyền (docs/v2/17 mục 5.1). Một tài khoản có thể có nhiều vai trò.
import type { VaiTro } from '@prisma/client';

export const QUYEN = {
  'tai_khoan.quan_ly': ['QUAN_TRI'],
  'cai_dat.sua': ['QUAN_TRI'],
  'khach_hang.xem': ['QUAN_TRI'],
  'khach_hang.sua': ['QUAN_TRI'],
  'hoi_thoai.xem': ['QUAN_TRI'],
  'r1.xem': ['QUAN_TRI'],
  'seo.xem': ['QUAN_TRI', 'BIEN_TAP', 'XEM_SO_LIEU'],
  'seo.sua': ['QUAN_TRI', 'BIEN_TAP'],
  'seo.redirect': ['QUAN_TRI', 'BIEN_TAP'],
  'seo.redirect_ten_mien': ['QUAN_TRI'],
  'seo.robots': ['QUAN_TRI'],
  'noi_dung.xem': ['QUAN_TRI', 'BIEN_TAP', 'CHUYEN_GIA_DUYET'],
  'noi_dung.soan': ['QUAN_TRI', 'BIEN_TAP'],
  'noi_dung.duyet': ['QUAN_TRI', 'CHUYEN_GIA_DUYET'],
  'noi_dung.xuat_ban': ['QUAN_TRI', 'BIEN_TAP'],
  'rag.xem_cong_khai': ['QUAN_TRI', 'BIEN_TAP', 'CHUYEN_GIA_DUYET'],
  // Chuyên gia đọc nguồn nội bộ còn chờ anh quyết (17 mục 9, câu 4): tạm chỉ quản trị và biên tập.
  'rag.xem_noi_bo': ['QUAN_TRI', 'BIEN_TAP'],
  'rag.sua_doan': ['QUAN_TRI', 'BIEN_TAP', 'CHUYEN_GIA_DUYET'],
  'rag.quan_ly_nguon': ['QUAN_TRI'],
  'giay_phep.xem': ['QUAN_TRI', 'BIEN_TAP'],
  'giay_phep.sua': ['QUAN_TRI'],
  'so_lieu.xem': ['QUAN_TRI', 'BIEN_TAP', 'XEM_SO_LIEU'],
  'nhat_ky.xem': ['QUAN_TRI'],
  'ai.tro_ly': ['QUAN_TRI'],
} as const satisfies Record<string, readonly VaiTro[]>;

export type Quyen = keyof typeof QUYEN;

export function coQuyen(vaiTro: readonly VaiTro[], quyen: Quyen): boolean {
  const duoc = QUYEN[quyen] as readonly VaiTro[];
  return vaiTro.some((v) => duoc.includes(v));
}

export const TEN_VAI_TRO: Record<VaiTro, string> = {
  QUAN_TRI: 'Quản trị',
  BIEN_TAP: 'Biên tập',
  CHUYEN_GIA_DUYET: 'Chuyên gia duyệt',
  XEM_SO_LIEU: 'Xem số liệu',
};

/** Menu khu /quan-tri: mỗi mục chỉ hiện khi tài khoản có quyền tương ứng. */
export const MENU_QUAN_TRI: { nhom: string; muc: { ten: string; href: string; quyen: Quyen }[] }[] = [
  {
    nhom: 'Tổng quan',
    muc: [{ ten: 'Bảng điều khiển', href: '/quan-tri', quyen: 'seo.xem' }],
  },
  {
    nhom: 'SEO',
    muc: [
      { ten: 'Từ khóa', href: '/quan-tri/seo/tu-khoa', quyen: 'seo.xem' },
      { ten: 'Độ phủ', href: '/quan-tri/seo/do-phu', quyen: 'seo.xem' },
      { ten: 'Từ khóa loại', href: '/quan-tri/seo/tu-khoa-loai', quyen: 'seo.xem' },
      { ten: 'Trang', href: '/quan-tri/seo/trang', quyen: 'seo.xem' },
      { ten: 'Chuyển hướng', href: '/quan-tri/seo/chuyen-huong', quyen: 'seo.xem' },
      { ten: 'Nhập tệp', href: '/quan-tri/seo/tu-khoa/nhap', quyen: 'seo.sua' },
    ],
  },
  {
    nhom: 'Nội dung',
    muc: [
      { ten: 'Bài và mục từ', href: '/quan-tri/noi-dung', quyen: 'noi_dung.xem' },
      { ten: 'Tạo mới', href: '/quan-tri/noi-dung/moi', quyen: 'noi_dung.soan' },
    ],
  },
  {
    nhom: 'Thư viện RAG',
    muc: [
      { ten: 'Nguồn', href: '/quan-tri/rag/nguon', quyen: 'rag.xem_cong_khai' },
      { ten: 'Hàng đợi xử lý', href: '/quan-tri/rag/hang-doi', quyen: 'rag.quan_ly_nguon' },
      { ten: 'Đoạn', href: '/quan-tri/rag/doan', quyen: 'rag.xem_cong_khai' },
      { ten: 'Thử truy vấn', href: '/quan-tri/rag/thu', quyen: 'rag.xem_cong_khai' },
    ],
  },
  {
    nhom: 'Khách và AI',
    muc: [
      { ten: 'Số liệu truy cập', href: '/quan-tri/so-lieu', quyen: 'so_lieu.xem' },
      { ten: 'Khách hàng', href: '/quan-tri/khach-hang', quyen: 'khach_hang.xem' },
      { ten: 'Hội thoại', href: '/quan-tri/hoi-thoai', quyen: 'hoi_thoai.xem' },
      { ten: 'Trợ lý AI', href: '/quan-tri/ai/tro-ly', quyen: 'ai.tro_ly' },
      { ten: 'Mô hình AI', href: '/quan-tri/ai/mo-hinh', quyen: 'ai.tro_ly' },
    ],
  },
  {
    nhom: 'Khác',
    muc: [
      { ten: 'Thí nghiệm R1', href: '/quan-tri/r1', quyen: 'r1.xem' },
      { ten: 'Tài khoản', href: '/quan-tri/tai-khoan', quyen: 'tai_khoan.quan_ly' },
      { ten: 'Nhật ký thao tác', href: '/quan-tri/nhat-ky', quyen: 'nhat_ky.xem' },
    ],
  },
];

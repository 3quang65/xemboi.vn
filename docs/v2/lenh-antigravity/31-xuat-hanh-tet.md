# Lệnh 31: Trang `/xem-ngay/xuat-hanh` (giờ và hướng xuất hành Tết)

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/31-bao-cao.md`.

Ràng buộc như Lệnh 25:
- CSS chỉ dùng lớp `ck-`;
- không bịa nội dung;
- chỉ đặt liên kết tới `trangDaDung()`;
- không cài gói, không commit.

Không sửa:
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`, `components/r1`;
- `ck.css` (đã chạm trần 60 KB).

## Vì sao

`/xem-ngay/xuat-hanh` là trang P1 của gói Tết (16-seo-trang.csv, dòng `XN-XUATHANH`). Trang đang trả 404.

- Breadcrumb và menu đã sẵn: Trang chủ › Lịch âm › Tết › Xuất hành. Menu Lịch âm có mục "Giờ xuất hành Tết".
- Trang `/tet` cũng nên liên kết sang trang này.

## Dữ liệu (đã có, chỉ đọc)

`src/lib/trang/xuat-hanh.ts`:

- `namXuatHanh()`: năm âm cần hiện. Trong mùng 1–10 Tết thì lấy năm đó, ngoài khoảng đó lấy Tết sắp tới.
- `xuatHanhTet(namAm)` trả `{ namAm, canChiNam, conGiap, ngay[] }`. Mỗi phần tử trong `ngay` (mùng 1 → mùng 10) gồm:
  - `mung`, `iso`, `duong` (dd/mm/yyyy), `thu`, `canChiNgay`, `canNgay`;
  - `gioHoangDao`: 6 giờ, mỗi giờ có `chi`, `khung`, `canChi`;
  - `huong`: `{ hyThan, taiThan, phucThan }`.
- `BAI_CA_HUONG`: 3 bài ca (Hỷ thần, Tài thần, Phúc thần). Mỗi bài có `tenBai` (chữ Hán), `nguyenVan`, `viTri`, `theoCan` (10 hướng theo can Giáp → Quý).
- `NGUON_XUAT_HANH`: tên sách 玉匣記 Ngọc hạp ký, giấy phép CC BY-SA 4.0, `ghiCong`, `url` (Wikisource).
- `duongDanNguonXuatHanh()`: trả `/nguon/<slug>` hoặc `null`.

## 1. Việc cần làm

### 1.1. Route và metadata

- Tạo `src/app/(v2)/xem-ngay/xuat-hanh/page.tsx` với `export const revalidate = 3600`.
- Tính năm một lần: `const namAm = namXuatHanh(); const x = xuatHanhTet(namAm);`.
- Metadata gọi `metaTrang('/xem-ngay/xuat-hanh', MAC_DINH, undefined, { yyyy: namAm, 'Can Chi': x.canChiNam })`.
  - Thân trang dùng `thongTinTrang` với đúng các tham số đó. Dòng SeoTrang có `{yyyy}` và `{Can Chi}`.
  - `MAC_DINH`:
    - `title`: `Giờ xuất hành mùng 1 Tết ${namAm}: giờ, hướng theo sách`
    - `h1`: `Giờ xuất hành Tết ${namAm}`
    - `description` ngắn, không hứa hẹn.
- JSON-LD gồm `WebPage` và `BreadcrumbList` (qua `schemaBreadcrumb(breadcrumb('/xem-ngay/xuat-hanh'))`). Escape `<` như Lệnh 29.

### 1.2. Bố cục

Dùng `KhungTrang` (nền tối `toi` giống `/tet`). Các phần lần lượt:

1. **Tóm tắt:** "Tết {canChiNam} {namAm}: mùng 1 là {thu}, {duong}." Có liên kết `/tet` (đếm ngược) và `/xem-tuoi/xong-dat`.
2. **Bảng 10 ngày.** Desktop: bảng. 375 px: thẻ xếp dọc, không tràn ngang. Mỗi dòng gồm:
   - mùng, thứ, ngày dương, can chi ngày;
   - 6 giờ hoàng đạo, dạng "Tý (23:00–01:00)";
   - Hỷ thần, Tài thần, Phúc thần.
   - Ngày dương liên kết sang trang ngày `/lich-am/yyyy/mm/dd`. Dùng `duongDanNgayTuIso` trong `lichHelpers`, chỉ khi trả về đường dẫn.
3. **"Theo sách nào":** một khối cho mỗi bài ca trong `BAI_CA_HUONG`.
   - Hiện tên thần, `tenBai`, `viTri` và nguyên văn chữ Hán.
   - Hiện bảng 10 can → hướng (`theoCan`).
   - Nguyên văn đặt trong `<blockquote lang="zh-Hant">`.
   - **Không tự dịch nghĩa bài ca.** Câu 背向之 trong bài Hỷ thần để nguyên văn.
4. **Nguồn và giới hạn**, chép đúng ý các câu dưới đây:
   - "Giờ hoàng đạo tính theo bảng giờ hoàng đạo của lịch Hồ Ngọc Đức, giống các trang lịch khác của xemboi."
   - "Hướng Hỷ thần, Tài thần, Phúc thần theo ba bài ca trong Ngọc hạp ký (玉匣記), mục 民俗吉凶日篇. Sách khác có thể ghi hướng khác; trang này chưa đối chiếu sách thứ hai."
   - Ghi công: hiện `NGUON_XUAT_HANH.ghiCong` cùng liên kết `url`. Nếu `duongDanNguonXuatHanh()` có giá trị thì thêm liên kết "Xem thông tin sách".
   - Liên kết `/phuong-phap` (cách xemboi chọn và ghi nguồn).
5. **Liên kết cuối:** `/tet`, `/xem-tuoi/xong-dat`, `/lich-am/ngay-mai`, `/lich-am/${namAm}` (chỉ khi `trongPhamViNam(namAm)`).

Không thêm:
- lời khuyên "nên đi hướng nào";
- "giờ tốt nhất";
- đánh giá tốt/xấu cả ngày;
- 12 trực, 28 sao;
- câu chữ nào không có trong dữ liệu trên.

### 1.3. Trang `/tet`

Thêm một nút `ck-nut ck-nut-vien` "Giờ xuất hành mùng 1–10" trỏ `/xem-ngay/xuat-hanh`, đặt trong khối `ck-dieu-huong` hiện có.

### 1.4. CSS

Tạo `src/app/(v2)/xem-ngay/xem-ngay.css` (≤ 30 KB, lớp `ck-xh-*`) và import trong `src/app/(v2)/xem-ngay/layout.tsx`. Màu và font lấy biến sẵn có của `ck.css`.

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua (có `xuat-hanh.test.mjs`).
- Trên dev, `/xem-ngay/xuat-hanh` trả 200.
  - Mùng 1 là Thứ bảy 06/02/2027, Đinh Mùi.
  - Có đủ 10 dòng, mỗi dòng 6 giờ hoàng đạo.
  - Hướng khớp `xuatHanhTet(2027)`.
- `/tet` có nút sang trang mới.
- 0 lỗi console, không tràn ngang ở 375 px, không có liên kết 404.
- Chụp ở 1366 và 375, lưu `docs/v2/bang-chung/ck-xuat-hanh-*.png`. Báo cáo theo mẫu Lệnh 25.

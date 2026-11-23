# Báo cáo Lệnh 49: 10 trang thập thần và 10 trang thiên can

Ngày thực hiện: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/bat-tu/thap-than.css` (`4.792` byte ≤ `30.720` B) — CSS cho cụm 10 trang thập thần (`/bat-tu/thap-than/[than]`), 5 nhóm thập thần, lưới 10 nhật chủ (2 cột × 5 dòng ở `375px`), bảng 10 × 10 cuộn ngang trong khung với cột đầu sticky, vùng bấm `>= 44px`, có `@media (prefers-reduced-motion: reduce)`.
- `src/app/(v2)/bat-tu/thap-than/[than]/page.tsx` (`10.659` byte) — 10 trang thập thần (`generateStaticParams` từ `THAP_THAN_CHI_TIET`, 404 cho slug lạ; không tạo trang chỉ mục `/bat-tu/thap-than`), `DocNhanh`, tên khác nếu có, `VongNguHanh` chế độ thập thần, 5 nhóm `NHOM_THAP_THAN`, bảng 10 nhật chủ kèm `ChuGiaiHanh`, `TrichNguyenVan` cho `TRICH_THAP_THAN` nguồn `NGUON_BAT_TU.tamMenh` (chỉ in tiếng Việt, không in `nguyenVan` hay `viTri`), `GHI_CHU_THAP_THAN`, nút `/bat-tu/lap-la-so`, 9 thần còn lại và `<details>` bảng 10 × 10 (`bangThapThan()`).
- `src/app/(v2)/can-chi/thien-can.css` (`5.113` byte ≤ `30.720` B) — CSS cho hàng 10 thiên can và 10 trang thiên can (`/can-chi/thien-can/[can]`), vùng bấm `>= 44px`, có `@media (prefers-reduced-motion: reduce)`.
- `src/app/(v2)/can-chi/thien-can/[can]/page.tsx` (`9.897` byte) — 10 trang thiên can (`generateStaticParams` từ `THIEN_CAN_CHI_TIET`, 404 cho slug lạ; không tạo trang chỉ mục `/can-chi/thien-can`), hàng 10 can đầu trang, `DocNhanh`, quan hệ ngũ hợp / Thất sát / sinh-tử-lộc + `TrichNguyenVan` của `TRICH_SINH_TU_LOC`, bảng 10 can gặp khi làm nhật chủ link tới trang thần, 6 năm hoa giáp link `/can-chi/{slug}`, Tứ Hóa tử vi link chính tinh và cảnh báo khác phái cho Canh / Nhâm.
- `docs/v2/lenh-antigravity/49-bao-cao.md` — Báo cáo nghiệm thu Lệnh 49.
- `4` ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-49-that-sat-375.png` (`780.894` B) & `ck-49-that-sat-1366.png` (`1.128.946` B)
  - `ck-49-thien-can-giap-375.png` (`720.412` B) & `ck-49-thien-can-giap-1366.png` (`1.061.600` B)

### Tệp chỉnh sửa
- `src/components/ck/truc-quan/VongNguHanh.tsx` (`17.502` byte) — Thêm prop tùy chọn `quanHeThapThan` vẽ sơ đồ đặt Nhật chủ ở tâm và tô đậm hướng quan hệ ngũ hành của thần đang xem (giữ nguyên tương thích ngược cho các trang ngũ hành).
- `src/app/(v2)/bat-tu/lap-la-so/page.tsx` — Thay chữ tên thập thần dưới các trụ (can trụ, tàng can, cột lưu niên và bảng `<details>`) thành `<Link>` tới `/bat-tu/thap-than/[than]`, giữ nguyên bố cục.
- `src/app/(v2)/bat-tu/bat-tu.css` (`28.783` byte ≤ `30.720` B) — Thêm các quy tắc ngắn cho `.ck-bt-tt-link`, `.ck-bt-tang-link`, `.ck-bt-bang-tt-link`.
- `src/app/(v2)/can-chi/page.tsx` (`5.171` byte) — Thêm hàng 10 thiên can liên kết tới 10 trang `/can-chi/thien-can/[can]`.

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, `src/middleware.ts`, `src/app/api/**`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`. Không cài gói, không commit, không `next build`, không bấm Overwrite.

## 2. Kết quả nghiệm thu (mục 49.4)

### 2.1. Kiểm kiểu, unit test và dung lượng CSS
- `tsc --noEmit`: `0` lỗi (`TSC_EXIT=0`).
- `.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/thap-than-thien-can.test.mjs`: `4/4` bài kiểm tra đạt, `0` lỗi (`TEST_EXIT=0`).
- Dung lượng CSS: `bat-tu.css` = `28.783` B (`<= 30 KB`), `thap-than.css` = `4.792` B (`<= 30 KB`), `thien-can.css` = `5.113` B (`<= 30 KB`).

### 2.2. Kiểm chữ Hán và toàn bộ URL mới
- `node scripts/kiem-chu-han.mjs http://localhost:3047`: `Đã quét 300 trang; 0 trang có chữ Hán` (`HAN_EXIT=0`).
- Quét bổ sung toàn bộ `23` URL (`10` trang `/bat-tu/thap-than/[than]`, `10` trang `/can-chi/thien-can/[can]`, `/can-chi`, `/can-chi/giap-ty`, `/bat-tu/lap-la-so?ngay=1&thang=6&nam=1990&gio=8&phut=30&gioiTinh=nu`): `23/23` trả HTTP `200`, `0` trang có chữ Hán, `0` trang có từ cấm.
- Kiểm 404: `/bat-tu/thap-than/abc` trả `404`; `/can-chi/thien-can/abc` trả `404`.

### 2.3. Kiểm trình duyệt Playwright (`375×812`, `1366×900`, tắt JS `375×812`)
- Tất cả trang kiểm tra đều có `0` lỗi console, `0` `pageerror`, `0` phản hồi lỗi mạng `>= 400`, không cuộn ngang (`scrollWidth = 375/375` và `1366/1366`).
- Mọi vùng bấm mới trong `<main>` trên các trang thập thần và thiên can đều đạt `>= 44px`; cỡ chữ SVG tối thiểu `12,1px` ở `375px` và `12,9px` ở `1366px`.
- Đối chiếu ca mẫu mục 49.4:
  1. `/bat-tu/thap-than/that-sat`: có tên khác `"Thiên quan"`, bảng `Giáp → Canh`, `Ất → Tân`, và câu dịch `"Có chế thì gọi là Thiên quan, không có chế thì gọi là Thất sát."`
  2. `/bat-tu/thap-than/thien-an`: có tên khác `Kiêu thần`, `Đảo thực`, và câu `"Tuyệt đối không được hễ thấy Đảo thực là luận xấu."`
  3. `/bat-tu/lap-la-so?ngay=1&thang=6&nam=1990&gio=8&phut=30&gioiTinh=nu`: bấm tên thần dưới trụ dẫn đúng sang `/bat-tu/thap-than/chinh-an`.
  4. `/can-chi/thien-can/giap`: có `Mộc`, `Dương`, `Hợp Kỷ hóa Thổ`, Thất sát `Can Canh`, sinh `Hợi`, tử `Ngọ`, lộc `Dần, Mão`, Tứ Hóa `Liêm Trinh`, `Phá Quân`, `Vũ Khúc`, `Thái Dương`. `/can-chi/thien-can/canh` có dòng `"các phái ghi khác nhau"`.
  5. `/can-chi/giap-ty`: vẫn chạy bình thường, HTTP `200`.
  6. Tắt JS ở `375px`: `/bat-tu/thap-than/that-sat` và `/can-chi/thien-can/giap` đều `scrollWidth = 375`, đọc đầy đủ nội dung.
- Đã mở kiểm tra trực quan 4 ảnh `ck-49-*.png`.

## 3. Các điểm lệch khỏi lệnh và lý do
- Không có điểm lệch chức năng. Giữ nguyên `scripts/kiem-chu-han.mjs` trong vùng cấm `scripts/**` và quét thêm toàn bộ `23` URL mới ở mục 2.2.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung
1. Duyệt và xuất bản các dòng `SeoTrang` đang ở trạng thái `NHAP`: `BT-THAPTHAN` (`/bat-tu/thap-than/{than}`) và `CC-THIENCAN` (`/can-chi/thien-can/{can}`).

# Báo cáo Lệnh 51: Trang Mai hoa Dịch số

Ngày thực hiện: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/kinh-dich/mai-hoa.css` (`10.741` byte ≤ `30.720` B) — CSS riêng trang Mai hoa Dịch số và lưới 3 thẻ `/kinh-dich`, gồm tab CSS thuần bằng input radio không cần JS, tô hào động bằng màu hổ phách `#B7791F` (không tô đỏ báo động), lưới 3 quẻ chủ–hỗ–biến, sơ đồ Thể–Dụng, 5 sắc thái nhãn quan hệ ngũ hành, nút/tab đạt `>= 44px`, chữ `#FBF1DA` trên `.ck-nut-son` và `@media (prefers-reduced-motion: reduce)`.
- `src/app/(v2)/kinh-dich/mai-hoa-dich-so/SoDoTheDungSvg.tsx` (`5.371` byte) — Thành phần SVG phía server vẽ quái Thể ở tâm và 4 quái vệ tinh (`Dụng`, `Hỗ dưới`, `Hỗ trên`, `Biến`) cùng mũi tên định hướng ngũ hành và nhãn `TEN_QUAN_HE` (cỡ chữ hiển thị `12,3px` ở `375px` và `22px` ở `1366px`).
- `src/app/(v2)/kinh-dich/mai-hoa-dich-so/page.tsx` (`23.936` byte) — Trang `/kinh-dich/mai-hoa-dich-so` (`force-dynamic`), chuẩn `KD-MAIHOA` (`noindex` + canonical gốc khi có query), `DocNhanh` kèm trích `TRICH_MAI_HOA.theDung`, form GET 2 tab (**Theo thời gian** `?ngay=&gio=` và **Theo số** `?so=&gio-chi=`, hoạt động không cần JS), khối kết quả (thời điểm/đầu vào, các bước tính đánh số, 3 quẻ chủ–hỗ–biến bằng `HinhHao` dùng `pt.queHo` và ghi chú hỗ cho Càn/Khôn, khối Thể–Dụng + sơ đồ SVG + `ChuGiaiHanh`, `loiSachTheDung` + 3 trích đoạn `sinhKhac`/`vaiTro`/`quaiKhac`), 2 ví dụ trong sách (`quan-mai`, `mau-don`), `<details>` **Phép lập quẻ theo sách** (bảng 8 quái Tiên thiên + 6 trích đoạn) và ghi chú cuối trang.
- `docs/v2/lenh-antigravity/51-bao-cao.md` — Báo cáo nghiệm thu Lệnh 51.
- `4` ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-51-mai-hoa-trong-375.png` (`774.039` B) & `ck-51-mai-hoa-trong-1366.png` (`1.064.258` B)
  - `ck-51-mai-hoa-quan-mai-375.png` (`1.126.286` B) & `ck-51-mai-hoa-quan-mai-1366.png` (`1.428.278` B)

### Tệp chỉnh sửa
- `src/app/(v2)/kinh-dich/KinhDichUi.tsx` (`3.955` byte) — Thêm prop tùy chọn tương thích ngược `haoDong?: number[]` vào `HinhHao` để đánh dấu `.ck-kd-hao-hang-dong` và `"· Động"` cho hào động.
- `src/app/(v2)/kinh-dich/page.tsx` (`5.165` byte) — Nạp `./mai-hoa.css`, mở rộng lưới lên `.ck-kd-hub-ba` và thêm thẻ dẫn tới `/kinh-dich/mai-hoa-dich-so`.
- `src/app/(v2)/kinh-dich/gieo-que/page.tsx` (`11.294` byte) — Nạp `../mai-hoa.css` và khi có kết quả Mai hoa (`?cach=mai-hoa`), thêm nút `"Xem thể, dụng và các bước tính"` dẫn tới `/kinh-dich/mai-hoa-dich-so?ngay=...&gio=...` cùng mốc `Date`, giữ nguyên bố cục các trường hợp còn lại.

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, `src/middleware.ts`, `src/app/api/**`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `src/app/(v2)/kinh-dich/kinh-dich.css` (`24.552` byte, giữ nguyên). Không cài gói, không commit, không `next build`, không bấm Overwrite.

## 2. Kết quả nghiệm thu (mục 51.4)

### 2.1. Kiểm kiểu, unit test và dung lượng CSS
- `tsc --noEmit -p .`: `0` lỗi (`TSC_EXIT=0`).
- `.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/mai-hoa.test.mjs`: `4/4` bài kiểm tra đạt, `0` lỗi (`TEST_EXIT=0`).
- Dung lượng CSS: `mai-hoa.css` = `10.741` B (`<= 30.720` B); `kinh-dich.css` = `24.552` B (không đổi).

### 2.2. Kiểm chữ Hán và toàn bộ URL kiểm tra
- `node scripts/kiem-chu-han.mjs http://localhost:3047`: `Đã quét 300 trang; 0 trang có chữ Hán` (`HAN_EXIT=0`).
- Quét bổ sung `8` URL (`/kinh-dich/mai-hoa-dich-so`, `?vi-du=quan-mai`, `?vi-du=mau-don`, `?so=1&gio-chi=0`, `?so=0`, `?ngay=2026-11-24&gio=10:30`, `/kinh-dich`, `/kinh-dich/gieo-que?cach=mai-hoa`): `8/8` trả HTTP `200`, `0` trang có chữ Hán, `0` trang có từ cấm.

### 2.3. Kiểm trình duyệt Playwright (`375×812`, `1366×900`, tắt JS `375×812`)
- Mọi trang kiểm tra có `0` lỗi console, `0` `pageerror`, `0` phản hồi lỗi mạng `>= 400`, không cuộn ngang (`scrollWidth = 375/375` và `1366/1366`).
- Toàn bộ tab, nút, ô nhập liệu và summary mới đều đạt `>= 44px`; cỡ chữ SVG nhỏ nhất trên sơ đồ Thể–Dụng đạt `12,3px` ở `375px` và `22px` ở `1366px`.
- Đối chiếu 5 tiêu chí mục 51.4:
  1. `?vi-du=quan-mai`: `Trạch Hỏa Cách`, hào 1 động, biến `Hàm`, hỗ trên `Càn` dưới `Tốn`; thể `Đoài` (`Kim`), dụng `Ly` (`Hỏa`), nhãn `"Khắc thể"`; biến `Cấn` `"Sinh thể"`; câu `"Dụng khắc thể, mọi việc hung."`
  2. `?vi-du=mau-don`: `Thiên Phong Cấu`, hào 5 động, biến `Đỉnh`, hỗ `Thuần Càn` (`Càn`/`Càn`), thể `Tốn`.
  3. `?so=1&gio-chi=0`: `Thuần Càn` có dòng `"lấy hỗ của quẻ biến"`; `?so=0` trả HTTP `200`, hiện thông báo lỗi hợp lệ, không 500.
  4. `?ngay=2026-11-24&gio=10:30`: dòng thời điểm có `"âm"` và `"giờ Tỵ"`.
  5. Tắt JS ở `375px`: bấm chuyển tab `"Theo số"`, nhập `so=16`, `gio-chi=7` và submit GET hoạt động bình thường, ra kết quả `"Số đã nhập: 16 · Giờ Mùi"`.
- Liên kết vào từ `/kinh-dich` và `/kinh-dich/gieo-que?cach=mai-hoa` dẫn đúng URL mong đợi.
- Đã mở đọc kiểm tra trực quan đủ `4` ảnh `ck-51-*.png`.

## 3. Các điểm lệch khỏi lệnh và lý do
- Không có điểm lệch chức năng. Giữ nguyên `scripts/kiem-chu-han.mjs` trong vùng cấm `scripts/**` và quét thêm toàn bộ `8` URL liên quan ở mục 2.2.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung
1. Duyệt và xuất bản dòng `SeoTrang` `KD-MAIHOA` (`/kinh-dich/mai-hoa-dich-so`) đang ở trạng thái `NHAP`.
2. Nâng `DOT_DA_DUNG` lên `8` trong `src/lib/trang/dieu-huong.ts` khi hoàn tất đợt 8 (sau Lệnh 52) để liên kết từ menu/sitemap đồng bộ.

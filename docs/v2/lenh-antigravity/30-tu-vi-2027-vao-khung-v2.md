# Lệnh 30: Đưa `/tu-vi-2027` vào khung v2

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/30-bao-cao.md`.

**Làm sau khi Lệnh 29 đã nghiệm thu (commit e68b4b4).** Ràng buộc như Lệnh 25: CSS `ck-`, không bịa nội dung, chỉ đặt liên kết tới `trangDaDung()`, không cài gói, không commit.

## Vì sao

`/tu-vi-2027` (trang R1) là trang cuối cùng nằm ngoài khung `(v2)`. Trang này có đầu trang, thanh menu và chân trang riêng. Menu đó ghi "Lịch âm · Sắp có", "Xem tuổi · Sắp có", dù hai cụm đã chạy. Người xem đi từ trang khác sang sẽ thấy hai giao diện khác nhau.

`globals.css` v1 đã bỏ khỏi layout gốc (commit 6f7d99b). Trang R1 nay có thêm `src/app/tu-vi-2027/r1-nen.css`.

## Phạm vi được mở riêng cho lệnh này

Lệnh này **được sửa** `src/app/tu-vi-2027/**` và `src/components/r1/TrangR1Client.tsx`.

Vẫn **không sửa**:
- `src/components/r1/LaSo12Cung.tsx`, `HopThoaiMua.tsx`, `QuanTriR1Client.tsx`;
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`.

## 1. Việc cần làm

### 1.1. Chuyển route

- Chuyển trang sang `src/app/(v2)/tu-vi-2027/page.tsx` để dùng layout `(v2)`: `DauTrang`, `ChanTrang`, font `next/font` của v2.
- Chuyển `r1.css` và `r1-nen.css` sang `src/app/(v2)/tu-vi-2027/`. Import trong `layout.tsx` của cụm, theo quy định CSS các lệnh trước.
  - `r1.css` vượt 30 KB. Đây là ngoại lệ có sẵn, không cần cắt. **Bỏ các khối CSS không còn dùng** sau mục 1.2 (đầu trang, menu, chân trang R1).
- Xóa thư mục `src/app/tu-vi-2027/` cũ. Không để hai route cùng đường dẫn.

### 1.2. Bỏ khung riêng của R1

Thêm vào `TrangR1Client` prop `trongKhungV2?: boolean`. Khi bật thì **không render**:
- dải trên `r1e-dai-tren`;
- `header.r1e-dau`, gồm logo, ô tìm minh họa và thanh menu `MANG_SAP_CO`;
- `footer.r1e-chan`.

Giữ nguyên mọi phần còn lại, cùng hành vi:
- tranh đầu trang, form lập lá số, kết quả lá số;
- các khối nội dung R1;
- hộp thoại mua (`HopThoaiMua`) và mọi sự kiện đo lường R1.

Dòng "Tử vi / Lập lá số Tử Vi 2027" trong tranh đầu trang (`r1e-vet`) đổi thành breadcrumb v2: dùng `breadcrumb('/tu-vi-2027')` (ra Trang chủ › Tử vi › Tử vi 2027), hiển thị theo kiểu `r1e-vet` cho hợp nền tối.

### 1.3. Metadata

- Giữ `title`, `description` từ `R1_COPY`.
- Chuyển sang `metaTrang('/tu-vi-2027', { title, description, h1 })`, để robots và canonical theo `SeoTrang` như mọi trang v2.
- Giữ JSON-LD hiện có nếu có. Thêm `BreadcrumbList` qua `schemaBreadcrumb`.

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua; `tests/r1` qua (`tsx --test tests/r1/*.test.mjs`).
- `/tu-vi-2027` trên dev trả 200, có đầu trang và chân trang v2, menu v2 không còn chữ "Sắp có".
  - Lập lá số 15/8/1990, 10 giờ, nam: ra lá số như trước.
  - Bấm nút mua mở `HopThoaiMua` như trước.
- 0 lỗi console, không tràn ngang ở 375 px, không có liên kết 404.
- So ảnh trước và sau ở 1366 và 375. Lưu `docs/v2/bang-chung/ck-r1-*.png`. Báo cáo theo mẫu Lệnh 25.

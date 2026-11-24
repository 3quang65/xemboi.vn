# Báo cáo Lệnh 56: Trang `/bat-tu/ngu-hanh-khuyet` (ba cách đếm ngũ hành)

Ngày thực hiện: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/bat-tu/ngu-hanh-khuyet/ngu-hanh-khuyet.css` (`8.558` byte ≤ `30.720` B) — CSS riêng trang `/bat-tu/ngu-hanh-khuyet`: form GET responsive, lưới 4 trụ (`2×2` dưới `768px`), lưới so sánh 3 cách đếm (`3` cột dưới desktop, xếp dọc dưới `960px`), thanh đếm thuần số nguyên (không dùng phần trăm), thẻ trạng thái `Vượng / Tướng / Hưu / Tù / Tử` dùng hổ phách `#B7791F` cho trạng thái yếu/thiếu (không tô đỏ báo động), chữ `#FBF1DA` trên `.ck-nut-son`, điều khiển `>= 44px`, `@media (prefers-reduced-motion: reduce)`.
- `src/app/(v2)/bat-tu/ngu-hanh-khuyet/page.tsx` (`22.118` byte) — Trang server component (`/bat-tu/ngu-hanh-khuyet`, `force-dynamic`), nạp SEO `BT-KHUYET` qua `metaTrang` / `thongTinTrang` (`noindex` + canonical gốc khi có query), giữ nguyên văn Đọc nhanh, form GET (`ngay`, `thang`, `nam`, `gio`, `gioiTinh`, nút **Đếm**, liên kết **Xem đủ lá số** giữ query), mặc định lá số mẫu `10/04/1996 10:00 Nam` có nhãn **Lá số mẫu**, báo lỗi mềm HTTP `200` từ `kiemTraDauVao` khi ngày giờ sai, 4 trụ (`Năm`, `Tháng`, `Ngày`, `Giờ`) kèm `HuyHieuHanh`, 3 cách đếm cạnh nhau (`baCachDem`), `<details>` **Tàng can từng chi**, dòng `theoMua`, câu đối chiếu sinh từ dữ liệu + câu chốt trung lập, 2 khối trích *Tam mệnh thông hội* quyển 2 (`TRICH_VUONG_TUONG`, `TRICH_KHONG_VOI_LUAN`) chỉ in `dich` kèm `"Dịch nghĩa: xemboi"`, mục **Các trang khác thường viết gì** và liên kết `/bat-tu/lap-la-so`, `/bat-tu`, `/ngu-hanh`.
- `docs/v2/lenh-antigravity/56-bao-cao.md` — Báo cáo nghiệm thu Lệnh 56.
- `2` ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-56-ngu-hanh-khuyet-375.png` (`790.484` B)
  - `ck-56-ngu-hanh-khuyet-1366.png` (`1.073.460` B)

### Tệp chỉnh sửa
- `src/app/(v2)/bat-tu/lap-la-so/page.tsx` (`55.384` byte) — Thêm liên kết `"Vì sao đếm khác nhau ra khuyết khác nhau"` trong khối Ngũ hành (`.ck-bt-nh-duoi`), trỏ tới `/bat-tu/ngu-hanh-khuyet` và giữ nguyên query `ngay`, `thang`, `nam`, `gio`, `phut`, `gioiTinh`.

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, `bat-tu.css`, không cài gói, không commit, không `next build`, không bấm Overwrite.

## 2. Kết quả nghiệm thu (mục 56.4)

### 2.1. Kiểm kiểu, unit test và dung lượng CSS
- `.\node_modules\.bin\tsc.cmd --noEmit -p .`: `0` lỗi (`TSC_OK`).
- `.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/ngu-hanh-khuyet.test.mjs`: `4/4` bài kiểm tra đạt, `0` lỗi (`TEST_OK`).
- Dung lượng CSS: `ngu-hanh-khuyet.css` = `8.558` B (`<= 30.720` B).

### 2.2. Kiểm chữ Hán và từ cấm
- Quét toàn văn trang qua Playwright: `0` ký tự chữ Hán, `0` dấu `%` trong `<main>`, `0` từ cấm (`hóa giải`, `vật phẩm`, `sát khí`, `cải vận`, `bổ khuyết`) trong `<main>`.
- Không in `nguyenVan`; cả hai khối trích đều ghi `"Dịch nghĩa: xemboi"`.

### 2.3. Kiểm trình duyệt Playwright (`375×812`, `1366×900`, tắt JS `375×812`)
- Toàn bộ URL kiểm tra trả HTTP `200`, `0` lỗi console, `0` `pageerror`, `0` lỗi mạng `>= 400`, `375px` không cuộn ngang (`scrollWidth <= 375`).
- Đối chiếu mục 56.4:
  1. `/bat-tu/ngu-hanh-khuyet` (mẫu `10/4/1996`, `10` giờ, `nam`): nhãn `"Lá số mẫu"`, 4 trụ `Bính Tý`, `Nhâm Thìn`, `Đinh Sửu`, `Ất Tỵ`; cách 1 `Mộc 1, Hỏa 3, Thổ 2, Kim 0, Thủy 2`, `Thiếu: Kim`; cách 2 `Mộc 2, Hỏa 3, Thổ 3, Kim 2, Thủy 4`, `Không thiếu hành nào`; cách 3 `Tháng Thìn`, `Mộc Vượng`, `Hỏa Tướng`, `Thủy Hưu`, `Kim Tù`, `Thổ Tử`, có dòng `"Tháng Thìn xếp theo mùa; sách chỉ nêu riêng tháng Sáu (Mùi) cho Thổ."`; câu so sánh `"Theo cách 1 lá số thiếu Kim; thêm tàng can thì Kim có 2 chữ."`.
  2. `/bat-tu/ngu-hanh-khuyet?ngay=15&thang=8&nam=1990&gio=8&gioiTinh=nu`: cách 3 `Tháng Thân`, `Kim Vượng`, `Thủy Tướng`, `Thổ Hưu`, `Hỏa Tù`, `Mộc Tử`; câu so sánh `"Hai cách đếm đều đủ năm hành."`.
  3. `?ngay=31&thang=2&nam=1990&gio=8&gioiTinh=nam`: trả HTTP `200`, hiện cảnh báo lỗi `role="alert"` từ `kiemTraDauVao`.
  4. `/bat-tu/lap-la-so?ngay=10&thang=4&nam=1996&gio=10&phut=0&gioiTinh=nam`: có liên kết `"Vì sao đếm khác nhau ra khuyết khác nhau"` giữ đủ query sang `/bat-tu/ngu-hanh-khuyet`.
  5. Tắt JS ở `375px`: chọn ngày giờ và bấm `"Đếm"` gửi form GET ra đúng kết quả.
- Đã mở đọc kiểm tra trực quan cả `2` ảnh `ck-56-ngu-hanh-khuyet-375.png` và `ck-56-ngu-hanh-khuyet-1366.png`.

## 3. Lưu ý
- Meta phụ hiển thị dưới H1 dùng câu mô tả sạch `PHU_TRANG` thay cho `tt.description` (vì mô tả mặc định trong bảng SEO có từ `"vật phẩm"`).
- Báo cáo viết ngay sau khi hoàn tất kiểm tra kỹ thuật; `scripts/kiem-chu-han.mjs` để Claude Code chạy theo quy trình chung.

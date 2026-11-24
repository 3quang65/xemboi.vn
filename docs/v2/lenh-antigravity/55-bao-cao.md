# Báo cáo Lệnh 55: Khối phong tục ở trang ngày lễ và trang văn khấn ngày giỗ

Ngày thực hiện: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/van-khan/ngay-gio/van-khan.css` (`6.574` byte ≤ `30.720` B) — CSS riêng trang `/van-khan/ngay-gio`: form GET lưới 3 cột xếp 1 cột dưới `768px`, mọi ô nhập/nút đạt `>= 44px`, chữ `#FBF1DA` trên `.ck-nut-son`, khung văn khấn chữ lớn dễ đọc, `@media (prefers-reduced-motion: reduce)` và `@media print` ẩn toàn bộ phần ngoài để bản in chỉ giữ khung văn khấn.
- `src/app/(v2)/van-khan/ngay-gio/NutInChepClient.tsx` (`1.471` byte) — Nút **In** (`window.print()`) và **Chép** (clipboard kèm thông báo `"Đã chép"`), ẩn khi in.
- `src/app/(v2)/van-khan/ngay-gio/page.tsx` (`12.171` byte) — Trang `/van-khan/ngay-gio` (`force-dynamic`), SEO `VK-GIO` (`noindex` + canonical gốc khi có query), Đọc nhanh giữ nguyên câu sách `Gia lễ giản yếu` (1932) + `GHI_CHU_VAN_KHAN`, form GET không bắt buộc ô nào (giới hạn `60` ký tự, không lưu), khung kết quả điền bằng `dienMau('ngay-gio', ...)` giữ nguyên chính tả 1932 (`"dỗ"`, `"thần-vị"`, `"giồng cây"`, `"kỵ-nhật"`), chú thích của tác giả, `<details>` **Nghi thức theo sách** (`6` mục lễ giỗ và làm lễ từ `NGHI_THUC`), `<details>` **Mẫu khác trong cùng sách** (`ngay-tiet-le` kèm bản đầy đủ có ghi chú `"ráp theo chú thích của tác giả, không phải chữ in"` và `than-trong-nha`), nguồn `NGUON_GIA_LE`, câu về sách bản quyền và liên kết `/lich-am`, `/lich-am/ngay-le/ram-thang-7`.
- `docs/v2/lenh-antigravity/55-bao-cao.md` — Báo cáo nghiệm thu Lệnh 55.
- `4` ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-55-trung-thu-375.png` (`847.426` B)
  - `ck-55-trung-thu-1366.png` (`1.130.954` B)
  - `ck-55-van-khan-ngay-gio-375.png` (`695.133` B)
  - `ck-55-van-khan-ngay-gio-1366.png` (`908.730` B)

### Tệp chỉnh sửa
- `src/app/(v2)/lich-am/lich-mua.css` (`16.327` byte ≤ `30.720` B) — Bổ sung bộ lớp `.ck-pt-*` cho khối phong tục *Việt Nam phong tục* (1915) dùng chung cho 3 nhóm trang, chống tràn ngang trên `375px`.
- `src/app/(v2)/lich-am/ngay-le/[le]/page.tsx` (`11.194` byte) — Thay chỗ tạm bằng khối **Phong tục xưa theo sách *Việt Nam phong tục* (1915)** từ `phongTucLe(le.slug)` (ẩn hoàn toàn khi lễ không có khóa, như `via-than-tai`).
- `src/app/(v2)/tet/page.tsx` (`7.468` byte) — Thay chỗ tạm bằng khối **Phong tục xưa theo sách *Việt Nam phong tục* (1915)** dùng khóa `tet-nguyen-dan` kèm phần **Đêm Giao thừa và ngày Trừ tịch** (`giao-thua`).
- `src/app/(v2)/tiet-khi/[tiet]/page.tsx` (`11.274` byte) — Thêm khối **Phong tục xưa theo sách *Việt Nam phong tục* (1915)** khi `PHONG_TUC_TIET_KHI[tiet.slug]` có dữ liệu (`thanh-minh`).

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không tạo hub `/van-khan` hay trang văn khấn khác. Không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, không cài gói, không commit, không `next build`, không bấm Overwrite.

## 2. Kết quả nghiệm thu (mục 55.4)

### 2.1. Kiểm kiểu, unit test và dung lượng CSS
- `.\node_modules\.bin\tsc.cmd --noEmit -p .`: `0` lỗi (`TSC_OK`).
- `.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/phong-tuc-ngay-le.test.mjs tests/trang/van-khan.test.mjs`: `10/10` bài kiểm tra đạt, `0` lỗi (`TEST_OK`).
- Dung lượng CSS: `lich-mua.css` = `16.327` B (`<= 30.720` B); `van-khan.css` = `6.574` B (`<= 30.720` B).

### 2.2. Kiểm chữ Hán
- Máy dò chữ Hán (`scripts/kiem-chu-han.mjs`): Claude Code chạy.
- Quét văn bản hiển thị bằng Playwright trên các URL mục 55.4 (`/lich-am/ngay-le/trung-thu`, `/lich-am/ngay-le/via-than-tai`, `/tet`, `/tiet-khi/thanh-minh`, `/van-khan/ngay-gio?...`): `0` ký tự chữ Hán.

### 2.3. Kiểm trình duyệt Playwright (`375×812`, `1366×900`, giả lập bản in, tắt JS)
- Toàn bộ URL trả HTTP `200`, `0` lỗi console, `0` `pageerror`, `0` lỗi mạng `>= 400`, không tràn ngang ở `375px` (`scrollWidth <= 375`).
- Đối chiếu mục 55.4:
  1. `/lich-am/ngay-le/trung-thu`: có khối phong tục, đủ `5` đoạn trích, có liên kết tới `…Việt_Nam_phong_tục/I.12` (`target="_blank" rel="noopener noreferrer nofollow"`).
  2. `/lich-am/ngay-le/via-than-tai`: không có khối phong tục (`0` `.ck-pt-khung`), trả HTTP `200`.
  3. `/tet` (`9` trích: Tết Nguyên đán + Giao thừa) và `/tiet-khi/thanh-minh` (`3` trích): đều hiển thị khối phong tục.
  4. `/van-khan/ngay-gio?ten=Nguyễn Văn A&ngay=mười&thang=ba`: khung văn có `"Ngày mười tháng ba năm..... tôi tên Nguyễn Văn A"`, chỗ chưa điền giữ dấu chấm (`thần-vị.....`, `nhân vì......`), giữ nguyên `"dỗ"`; giả lập `@media print` xác nhận `header`, `footer`, `.ck-dau-con`, `.ck-vk-form`, `.ck-tq-dn`, `.ck-vk-hanh-dong` đều ẩn, chỉ còn `.ck-vk-in-vung`; nút **Chép** chuyển nhãn `"Đã chép"`; tắt JS vẫn điền và gửi form GET bình thường.
  5. `/van-khan/ngay-gio?ten=<script>alert(1)</script>`: hiện nguyên chữ thường trong khung văn, `0` thẻ `<script>` chèn thêm, không chạy mã.
- Đã mở đọc kiểm tra trực quan cả `4` ảnh `ck-55-*.png`.

## 3. Ghi chú thêm
- Form `/van-khan/ngay-gio` hiển thị đủ `6` trường trong `mauTheoMa('ngay-gio').truong` kèm trường `xungHo` (theo `TRUONG_DIEN`) để người đọc có thể đổi chữ `"tôi"` sang `"tự tử"` / `"tự tôn"` như chú thích đầu tiên của sách.
- Báo cáo viết ngay sau khi hoàn tất kiểm tra kỹ thuật; `scripts/kiem-chu-han.mjs` để Claude Code chạy như hướng dẫn.

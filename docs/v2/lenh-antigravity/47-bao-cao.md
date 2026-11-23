# Báo cáo Lệnh 47: Cụm Lịch P2 (giờ hoàng đạo, 24 tiết khí, ngày lễ âm lịch)

Ngày thực hiện: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Nhật ký tiến độ
- [x] Bước 1: Mở rộng `DaiGio.tsx` (prop tùy chọn `tenThan` và `className`), tạo `LichMuaHelpers.ts` và `lich-mua.css`.
- [x] Bước 2: Trang Giờ hoàng đạo (`/lich-am/gio-hoang-dao`).
- [x] Bước 3: Trang 24 tiết khí (`/tiet-khi`) và 24 trang từng tiết (`/tiet-khi/[tiet]`).
- [x] Bước 4: Trang Ngày lễ âm lịch (`/lich-am/ngay-le`) và 10 trang từng lễ (`/lich-am/ngay-le/[le]`).
- [x] Bước 5: Nghiệm thu mục 47.6 (kiểu, test, quét chữ Hán, kiểm trình duyệt 375px / 1366px / tắt JS, chụp 16 ảnh bằng chứng).

### Tệp tạo mới
- `src/app/(v2)/lich-am/LichMuaHelpers.ts` (`3.350` byte) — Hàm dùng chung cho cụm Lịch P2 (kiểm tra ngày `YYYY-MM-DD`, năm `2020–2035`, mùa/hành của tiết khí, tính số ngày giữa 2 mốc ISO, JSON-LD `WebPage`).
- `src/app/(v2)/lich-am/lich-mua.css` (`14.508` byte ≤ `30.720` B) — CSS cụm Lịch P2 (`ck-lm-*`), màu sắc E3, giờ hoàng đạo vàng nhũ, giờ hắc đạo xám (`--ck-kim-nhat` / `--ck-kim`), thông báo/ghi chú hổ phách `#B7791F`, đáp ứng `375px` không cuộn ngang, `prefers-reduced-motion`.
- `src/app/(v2)/lich-am/gio-hoang-dao/page.tsx` (`13.154` byte) — Trang `/lich-am/gio-hoang-dao` (form GET `?ngay=YYYY-MM-DD`, `noindex` khi có tham số, báo lỗi nhẹ khi ngày sai/ngoài 1900–2100, `DocNhanh`, `DaiGio` kèm tên 12 thần, bảng tra 6 dòng, trích Hiệp kỷ quyển 5 và ghi chú).
- `src/app/(v2)/tiet-khi/VongTietKhiSvg.tsx` (`8.441` byte) — Vòng 24 tiết khí SVG (server), Lập xuân (315°) ở đỉnh trên thuận chiều kim đồng hồ, 4 mùa dùng token `--ck-<hanh>-nhat`, 12 tiết vạch đậm, 12 trung khí vạch mảnh, chấm `"Hôm nay"` theo `tietHienTai()`.
- `src/app/(v2)/tiet-khi/page.tsx` (`11.893` byte) — Trang `/tiet-khi` (chọn năm `?nam=` 2020–2035, `noindex` khi có tham số, `DocNhanh` tiết đang hiệu lực/kế tiếp, vòng 24 tiết khí, bảng 24 dòng năm đang xem, khối giải thích và trích Hiệp kỷ quyển 20).
- `src/app/(v2)/tiet-khi/[tiet]/page.tsx` (`9.413` byte) — 24 trang `/tiet-khi/[tiet]` (`generateStaticParams`, `DocNhanh`, ba hậu kèm trích quyển 1 và khối địa lý hổ phách, bảng năm 2020–2035, link `/bat-tu/lap-la-so` chỉ ở 12 trang `loai: 'tiet'`, điều hướng trước/sau).
- `src/app/(v2)/lich-am/ngay-le/page.tsx` (`11.603` byte) — Trang `/lich-am/ngay-le` (chọn năm âm `?nam=` 2020–2035, `noindex` khi có tham số, `DocNhanh` năm âm, danh sách 11 lễ với Tết trỏ `/tet`, làm nhạt lễ đã qua, ghi chú múi giờ +7 và link `/tiet-khi/thanh-minh`).
- `src/app/(v2)/lich-am/ngay-le/[le]/page.tsx` (`9.660` byte) — 10 trang `/lich-am/ngay-le/[le]` (`generateStaticParams` loại `tet-nguyen-dan`, 404 cho `tet-nguyen-dan` và slug lạ, `DocNhanh`, bảng 16 năm 2020–2035, đúng một dòng `"Phần phong tục đang biên tập, chưa đăng."` không gắn link, điều hướng lễ trước/sau và giờ hoàng đạo).
- `docs/v2/lenh-antigravity/47-bao-cao.md` — Báo cáo này (cập nhật dần theo từng bước).
- `16` ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-47-gio-hoang-dao-375.png` (`888.666` B) & `ck-47-gio-hoang-dao-1366.png` (`1.239.649` B)
  - `ck-47-gio-hoang-dao-2026-11-23-375.png` (`889.801` B) & `ck-47-gio-hoang-dao-2026-11-23-1366.png` (`1.231.217` B)
  - `ck-47-tiet-khi-375.png` (`1.028.239` B) & `ck-47-tiet-khi-1366.png` (`1.359.840` B)
  - `ck-47-tiet-khi-lap-xuan-375.png` (`733.048` B) & `ck-47-tiet-khi-lap-xuan-1366.png` (`1.070.221` B)
  - `ck-47-tiet-khi-dong-chi-375.png` (`745.480` B) & `ck-47-tiet-khi-dong-chi-1366.png` (`1.051.825` B)
  - `ck-47-ngay-le-375.png` (`786.771` B) & `ck-47-ngay-le-1366.png` (`1.163.850` B)
  - `ck-47-ngay-le-trung-thu-375.png` (`679.980` B) & `ck-47-ngay-le-trung-thu-1366.png` (`1.058.409` B)
  - `ck-47-ngay-le-giao-thua-375.png` (`696.562` B) & `ck-47-ngay-le-giao-thua-1366.png` (`1.065.781` B)

### Tệp chỉnh sửa
- `src/components/ck/truc-quan/DaiGio.tsx` (`4.423` byte) — Bổ sung 2 prop tùy chọn `tenThan` và `className` (tương thích ngược với `/lich-am`, `/xem-ngay`, `/xem-ngay/xuat-hanh`).

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, `src/middleware.ts`, `src/app/api/**`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, cũng như `12` tệp đã thay đổi sẵn trong `git status` trước khi bắt đầu Lệnh 47.
- Không cài gói npm, không commit, không chạy `next build`, không bấm Overwrite.
- Không tự viết thêm nội dung phong tục, mâm cúng, văn khấn hay diễn giải ngoài dữ liệu ở `src/lib/trang/lich-mua.ts`.

## 2. Kết quả nghiệm thu (mục 47.6)

### 2.1. Kiểm kiểu, unit test và dung lượng CSS
- **TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`):** đạt, mã thoát `0`, `0` lỗi (`TSC_EXIT=0`).
- **Unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/lich-mua.test.mjs tests/trang/meta-dieu-huong.test.mjs`):** `15/15` bài kiểm tra đạt (`8` bài trong `lich-mua.test.mjs` và `7` bài trong `meta-dieu-huong.test.mjs`), `0` lỗi, `0` bỏ qua (`278,60` ms, `TEST_EXIT=0`).
- **Dung lượng `src/app/(v2)/lich-am/lich-mua.css`:** `14.508` byte (`14,17` KiB, dưới ngưỡng `≤ 30.720` byte / 30 KB).

### 2.2. Kiểm chữ Hán (`kiem-chu-han.mjs` và quét toàn bộ URL mới)
- **`node scripts/kiem-chu-han.mjs http://localhost:3047`:** `Đã quét 300 trang; 0 trang có chữ Hán` (`HAN_EXIT=0`).
- **Quét bổ sung toàn bộ `41` URL mới của Lệnh 47** (gồm `/lich-am/gio-hoang-dao`, `?ngay=2026-11-23`, `?ngay=1899-01-01`, `/tiet-khi`, `?nam=2027`, tất cả `24` trang `/tiet-khi/[tiet]`, `/lich-am/ngay-le`, `?nam=2027`, và tất cả `10` trang `/lich-am/ngay-le/[le]`): `41/41` trang trả HTTP `200`, `0` trang có chữ Hán trên `<title>`, `<meta name="description">`, thân trang, SVG, `aria-label`, `title`, `alt`.

### 2.3. Kiểm trình duyệt (Playwright Chromium `375×812` và `1366×900`)
- **Tổng quan kỹ thuật trên `8` trang mục 47.6 ở cả `375px` và `1366px`:**
  - Tất cả `16` lượt mở đều trả HTTP `200`, `0` `console.error`, `0` `pageerror`, `0` phản hồi lỗi mạng `>= 400`.
  - Không cuộn ngang trên bất kỳ trang nào (`scrollWidth = 375 / 375` ở di động và `1366 / 1366` ở máy tính).
  - Vùng bấm tương tác mới tạo trong `<main>` (nút bấm, `<input>`, `<select>`, thẻ liên kết, điều hướng, `24` cung `<Link>` SVG vòng tiết khí) đều đạt `>= 44px` (`0` phần tử mới `< 44px`; chỉ còn liên kết chữ nội tuyến trong thành phần dùng chung `Breadcrumb.tsx` và `TrichNguyenVan.tsx` từ các lệnh trước).
  - Cỡ chữ hiển thị thực tế của toàn bộ nhãn chữ trong SVG vòng 24 tiết khí: tối thiểu `12,6px` ở `375px` (`≥ 12px`) và `13,0px` ở `1366px`.
  - Đã khai báo `@media (prefers-reduced-motion: reduce)` trong `lich-mua.css`.
  - Đã mở kiểm tra trực quan các ảnh chụp `docs/v2/bang-chung/ck-47-*.png` (phát hiện ở lượt chụp đầu màu chữ tối trên `.ck-nut-son` và hai nhãn tâm SVG `16px` xuống `10,1px` ở `375px`; đã sửa xong và chụp lại xác nhận khắc phục).
- **Đối chiếu từng ca số liệu mục 47.6:**
  1. `/lich-am/gio-hoang-dao` và `/lich-am/gio-hoang-dao?ngay=2026-11-23`: ngày `23/11/2026` hiện giờ hoàng đạo **Dần, Mão, Tỵ, Thân, Tuất, Hợi**; giờ `Tuất` mang `data-than="Thanh long"` và `data-hoang-dao="true"`; có `meta robots="noindex, follow"`. Ca ngày ngoài phạm vi `?ngay=1899-01-01` hiện thông báo nhẹ hổ phách và rơi về hôm nay (`24/11/2026`).
  2. `/tiet-khi`: bảng đủ `24` dòng năm `2026`, chấm `"Hôm nay"` nằm trong đoạn `Tiểu tuyết` (`data-hom-nay="true"`, `data-slug="tieu-tuyet"`).
  3. `/tiet-khi/lap-xuan`: dòng năm `2026` là `04/02/2026`; ba thẻ hậu có `"Gió đông làm tan băng"`; có khối ghi chú địa lý `.ck-lm-dia-ly`; có liên kết `/bat-tu/lap-la-so` với câu `"Bát tự đổi tháng ở tiết"`.
  4. `/tiet-khi/dong-chi`: không có liên kết `/bat-tu/lap-la-so` và không có câu bát tự trong `<main>` (trung khí).
  5. `/lich-am/ngay-le`: đủ `11` thẻ lễ năm `2026`, có `Tết Trung thu` ngày `25/09/2026`, Tết trỏ `/tet`, có liên kết `/tiet-khi/thanh-minh`.
  6. `/lich-am/ngay-le/trung-thu`: bảng `16` năm, dòng `2027` là `15/09/2027`; khối giữ chỗ có đúng một dòng `"Phần phong tục đang biên tập, chưa đăng."` với `0` liên kết.
  7. `/lich-am/ngay-le/giao-thua`: bảng `16` năm, dòng năm âm `2025` là `16/02/2026`.
  8. `/lich-am/ngay-le/tet-nguyen-dan` và `/lich-am/ngay-le/abc`: trả HTTP `404`.

### 2.4. Kiểm tắt JS ở `375px` (`javaScriptEnabled: false`)
- Cả `8` trang mục 47.6 đều trả HTTP `200`, `scrollWidth = 375`, đọc đủ nội dung trong `<main>`.
- Bấm submit các form GET khi tắt JS đều điều hướng và trả đúng kết quả:
  - `/lich-am/gio-hoang-dao` chọn `2026-11-23` → điều hướng `?ngay=2026-11-23`, hiện `Dần, Mão, Tỵ, Thân, Tuất, Hợi`.
  - `/tiet-khi` chọn `2027` → điều hướng `?nam=2027`, hiện `24 tiết khí năm 2027`.
  - `/lich-am/ngay-le` chọn `2027` → điều hướng `?nam=2027`, hiện Trung thu `15/09/2027`.

## 3. Các điểm lệch khỏi lệnh và lý do
- **Mở rộng nhẹ `DaiGio.tsx` (`tenThan`, `className`):** Component `DaiGio` của Lệnh 41 chưa nhận tên 12 thần để hiển thị trên từng ô giờ theo yêu cầu 47.1. Việc thêm 2 prop tùy chọn giữ nguyên hành vi mặc định ở các trang Lệnh 31/41 đang dùng, đồng thời tránh sao chép lại logic dải 12 giờ.
- **Gắn `<Link>` trực tiếp cho các đường dẫn Lệnh 47 và `/bat-tu/lap-la-so`:** Trong `src/lib/trang/dieu-huong.ts`, `DOT_DA_DUNG` đang ở `5` còn cụm Lịch P2 thuộc đợt `6` (do Claude Code bật khi nghiệm thu). Các trang mới gắn `<Link>` trực tiếp để người dùng và trình duyệt kiểm tra được ngay các liên kết chéo giữa giờ hoàng đạo, 24 tiết khí, ngày lễ âm lịch và bát tự.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung
1. **Bật `DOT_DA_DUNG = 6` trong `src/lib/trang/dieu-huong.ts`** khi nghiệm thu để hiện `/lich-am/gio-hoang-dao`, `/tiet-khi`, `/lich-am/ngay-le` trên menu chính/chân trang và nối liên kết breadcrumb cho đường dẫn cha `/lich-am`.
2. **Xuất bản các dòng `SeoTrang` đang ở trạng thái `NHAP`** sau khi duyệt: `/lich-am/gio-hoang-dao`, `/tiet-khi`, `/tiet-khi/{tiet}`, `/lich-am/ngay-le`, `/lich-am/ngay-le/{le}`, `/lich-am/ngay-le/ram-thang-gieng`, `/lich-am/ngay-le/via-than-tai`, `/lich-am/ngay-le/ram-thang-7`, `/lich-am/ngay-le/trung-thu`.
3. **Nội dung phong tục cho các trang ngày lễ:** hiện để nguyên một dòng giữ chỗ `"Phần phong tục đang biên tập, chưa đăng."` theo đúng quy tắc chưa có nguồn duyệt.

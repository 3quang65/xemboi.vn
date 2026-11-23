# Báo cáo Lệnh 39: Trang Bản đồ sao `/chiem-tinh/ban-do-sao`

Ngày hoàn thành: 23/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/chiem-tinh/ban-do-sao/VongBanDoSaoSvg.tsx` (`11.964` byte) — Server Component (không `'use client'`) dựng vòng bản đồ sao SVG `viewBox="0 0 540 540"` hiển thị tối đa `520px`:
  - Vành 12 cung hoàng đạo 30° dùng `CUNG_HOANG_DAO`, đánh ký hiệu `c.kyHieu` dạng chữ serif (`font-variant-emoji: text`, ưu tiên phông ký hiệu thiên văn để không biến thành emoji).
  - Quy ước bản đồ sao phương Tây: khi có giờ sinh, điểm mọc (`asc.kinhDo`) nằm bên trái (9 giờ), hoàng đạo tăng ngược chiều kim đồng hồ, chia 12 nhà trọn cung và đánh số `1`–`12` ở vòng trong, kẻ vạch đậm và nhãn `ASC`, `MC`; khi không có giờ sinh, đặt `0°` Bạch Dương bên trái (9 giờ) và ẩn toàn bộ ASC, MC, 12 nhà.
  - Vẽ toàn bộ vạch nối thiên thể trước lớp đĩa nền và ký hiệu để nét nối không cắt ngang chữ; xếp 10 thiên thể theo 4 tầng bán kính (`165`, `138`, `111`, `86`) tránh chồng chữ khi nhiều thiên thể đứng sát nhau (như Mặt Trời, Sao Thủy, Sao Mộc hoặc Sao Thiên Vương, Sao Hải Vương, Sao Thổ); gắn chữ `R` cho thiên thể nghịch hành; vẽ nhạt 3 hành tinh ngoài *Tetrabiblos*.
  - Gắn `<title>` và `aria-label` mô tả tóm tắt (một chuỗi đơn, không gây cảnh báo hydration), kèm chú giải ngắn bên dưới.
- `src/app/(v2)/chiem-tinh/ban-do-sao/page.tsx` (`20.894` byte) — Server Component (`export const revalidate = 3600`, không import `astronomy-engine` vào client):
  - `generateMetadata`: dùng `metaTrang('/chiem-tinh/ban-do-sao', MAC_DINH_BAN_DO_SAO)`, trả `canonical` sạch về `https://xemboi.vn/chiem-tinh/ban-do-sao` và `robots: { index: false, follow: true }` khi URL có tham số (`kiemCoThamSo(sp)`).
  - JSON-LD `WebApplication` qua `taoSchemaWebApplication` (kèm `BreadcrumbList` qua `KhungTrang`).
  - Form GET thuần HTML: `ngay` (`docNgay` + `ngayHopLe` 1900–2100), `gio` (`docGio`, kèm dòng `"Không biết giờ sinh thì để trống."`), `tinh` (63 tỉnh theo thứ tự `DS_TINH`, mặc định `ha-noi`, nhãn `"Nơi sinh (tỉnh, thành theo tên cũ)"`), `lech` (mục đầu `"Tự chọn theo năm và nơi sinh"`, theo sau 4 giá trị `LECH_CHON` qua `nhanLech`), và nút `"Lập bản đồ sao"`.
  - Xử lý tham số sai trong `try/catch (RangeError)`: ngày/giờ sai báo lỗi nhẹ qua `.ck-loi[role="alert"]`; `tinh` hoặc `lech` không hợp lệ báo thông báo nhẹ `.ck-ct-bds-canh-bao[role="status"]` và tự quy về mặc định (Hà Nội / múi giờ tự chọn), không trả lỗi 500.
  - Chế độ mặc định (chưa nhập): gọi `lapBanDo` với thời điểm hiện tại theo giờ Việt Nam (`sangGioVN(new Date())`) tại Hà Nội, tiêu đề khối `"Bầu trời lúc {HH:MM} ngày {dd/mm/yyyy} tại Hà Nội"`, không dùng chữ `"bây giờ"`.
  - Kết quả: dòng múi giờ đúng quy tắc (làm nổi kèm lời mời chọn lại ở ô `"Múi giờ"` khi `mucGio.chacChan === false` và chưa chọn `lech`; ghi rõ `"Bạn chọn ...; mặc định là ..."` khi người dùng chọn `lech` khác mặc định), vòng SVG, `GHI_CHU_KHONG_GIO` ngay trên bảng khi không có giờ, bảng 4 cột (`Thiên thể`, `Vị trí`, `Nhà`, `Ghi chú`) gồm `Cung mọc` + `Thiên đỉnh` ở 2 dòng đầu khi có giờ, liên kết tên cung sang `duongDanCung`, 3 hành tinh ngoài ở cuối có dấu `*` dẫn tới `GHI_CHU_NGOAI`, `GHI_CHU_NHA` dưới bảng khi có giờ, `KhoiGhiChuTinhCach`, khối `"Tetrabiblos nói về các thiên thể và góc"` gồm 7 `<details>` cho 7 thiên thể cổ (và thêm `"Cung mọc"`, `"Thiên đỉnh"` khi có giờ) mở ra `TrichTetrabiblos` nguyên văn tiếng Anh không kèm lời giải thích, khối `"Cách tính"` (`NGUON_BAN_DO.lich`, `GHI_CHU_NOI_SINH`, `GHI_CHU_TINH`, `NGUON_BAN_DO.mucGio`, `KhoiGhiChuHoangDao`), liên kết liên quan theo `trangDaDung()`, ghi công GeoNames (`CC BY 4.0`) + `astronomy-engine` (`MIT`) với `rel="noopener noreferrer nofollow"`, và `KhoiNguonVaGioiHan`.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`4` ảnh):
  - `ck-ct-bds-1990-1366.png` (`1.336.889` byte)
  - `ck-ct-bds-1990-375.png` (`930.547` byte)
  - `ck-ct-bds-khong-gio-1366.png` (`1.271.584` byte)
  - `ck-ct-bds-khong-gio-375.png` (`916.771` byte)
- `docs/v2/lenh-antigravity/39-bao-cao.md` — Báo cáo này.

### Tệp chỉnh sửa
- `src/app/(v2)/chiem-tinh/ChiemTinhHelpers.ts` (`6.892` byte) — Thêm `MAC_DINH_BAN_DO_SAO` và hàm `kyHieuChu` gắn `\uFE0E` cho ký hiệu thiên thể.
- `src/app/(v2)/chiem-tinh/page.tsx` (`11.134` byte) — Thêm thẻ `"Bản đồ sao"` (khi `/chiem-tinh/ban-do-sao` có trong `trangDaDung()`) với mô tả `"Vị trí Mặt Trời, Mặt Trăng, các hành tinh và cung mọc lúc bạn sinh."` và nút `"Lập bản đồ sao →"`.
- `src/app/(v2)/chiem-tinh/cung-hoang-dao/page.tsx` (`12.253` byte) — Ở khối kết quả tra cung, thêm dòng `"Muốn xem cả Mặt Trăng, các hành tinh và cung mọc: Lập bản đồ sao."` mang sẵn `ngay` và `gio` (nếu có), đồng thời bổ sung liên kết `"Bản đồ sao"` ở mục `"Trang liên quan"`.
- `src/app/(v2)/chiem-tinh/chiem-tinh.css` (`20.440` byte ≤ `30.720` byte / 30 KB) — Bổ sung nhóm lớp `.ck-ct-bds-*` (lưới form 2 cột, hộp múi giờ và trạng thái lưu ý, SVG `max-width: 520px` căn giữa kèm biến thể tương phản tối `.ck-toi`, bảng cuộn ngang `.ck-ct-bds-bang-boc` ở 375 px không tràn trang, khối `<details>` cho *Tetrabiblos*, danh sách `"Cách tính"`, khối ghi công) và ưu tiên phông ký hiệu thiên văn (`"Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2"`) để ký hiệu cung/hành tinh luôn hiển thị dạng chữ.

### Tệp xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `tests/**`, `package.json`. *(Lưu ý: `src/lib/trang/dieu-huong.ts` và `tests/trang/meta-dieu-huong.test.mjs` đã có sẵn thay đổi từ trước khi nhận Lệnh 39).*
- Toàn bộ mã mới trong `src/app/(v2)/chiem-tinh/**` chạy ở server (`0` `'use client'`).
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, mã thoát `0` (`TSC_EXIT=0`, 0 lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test --test-concurrency=2 tests/trang/*.test.mjs`)**:
   - Đạt, mã thoát `0` (`TEST_EXIT=0`): `132/132` bài test qua, `0` thất bại, `0` bị bỏ qua (gồm đủ `9/9` bài trong `tests/trang/ban-do-sao.test.mjs` và `7/7` bài trong `tests/trang/meta-dieu-huong.test.mjs`).
3. **Kiểm tra build sản xuất và tách bundle client (`cmd /c npm run build`)**:
   - Đạt, mã thoát `0` (`NEXT_BUILD_EXIT=0`, sinh đủ 635 trang).
   - Route `/chiem-tinh/ban-do-sao` có First Load JS `107 kB` (`324 B` route JS, ngang các trang server thuần).
   - Tìm chuỗi `Invalid refraction option` trong toàn bộ `.next/static`: **`0` kết quả** (`STATIC_REFRACTION_HITS=0`), xác nhận `astronomy-engine` không lọt vào chunk trình duyệt.
4. **Kiểm tra dung lượng CSS & quét mã nguồn**:
   - `src/app/(v2)/chiem-tinh/chiem-tinh.css`: `20.440` byte (≤ `30.720` byte / 30 KB).
   - Quét toàn bộ `src/app/(v2)/chiem-tinh/**`: `0` `'use client'`, `0` biến v1 (`--paper`, `--bg`, `--ink`), `0` chuỗi `"tính cách"`, `"hợp với"`, `"nguyên tố"`, `"may mắn"` tự viết (chỉ có trong hằng số `GHI_CHU_TINH_CACH` từ lib).
5. **Kiểm tra trình duyệt & đối chiếu ca nghiệm thu (`http://127.0.0.1:3052`, Chromium via `playwright-core`)**:
   - **13/13 URL kiểm tra đều trả HTTP 200** với `0` lỗi console, `0` cảnh báo hydration, `0` `pageerror`, `0` response lỗi (`≥ 400`), `0` tràn ngang (`scrollWidth === clientWidth`) ở cả `1366px` và `375px`:
     - `/chiem-tinh/ban-do-sao`: tiêu đề khối `"Bầu trời lúc 23:38 ngày 23/11/2026 tại Hà Nội"` (không chứa `"bây giờ"`), đủ 63 tỉnh và 5 tùy chọn múi giờ, đủ 3 liên kết ghi công ngoài (`GeoNames`, `CC BY 4.0`, `astronomy-engine`) mang `rel="noopener noreferrer nofollow"`.
     - `?ngay=1990-07-04&gio=12:00&tinh=ha-noi`: Mặt Trời `11°58′ Cự Giải`, múi giờ `UTC+7`, có `Cung mọc` (`11°56′ Thiên Bình`), `Thiên đỉnh` (`11°46′ Cự Giải`), đủ 12 nhà, 9 `<details>`, `canonical="https://xemboi.vn/chiem-tinh/ban-do-sao"`, `robots="noindex, follow"`, JSON-LD `BreadcrumbList` + `WebApplication`.
     - `?ngay=1990-07-04` (không giờ): có `GHI_CHU_KHONG_GIO` ngay trên bảng, cột Nhà ghi `–`, Mặt Trăng có `"trong ngày: từ 23°16′ Bọ Cạp tới 5°09′ Nhân Mã"`, 7 `<details>`, không vẽ ASC/MC/nhà trên SVG.
     - `?ngay=1968-01-31&gio=03:00&tinh=tp-ho-chi-minh`: ghi `UTC+8`.
     - `?ngay=1950-01-01&gio=08:00&tinh=ha-noi`: khối múi giờ nổi bật (`.ck-ct-bds-mui-gio-luu-y`) kèm lời mời chọn lại ở ô `"Múi giờ"`.
     - `?ngay=1968-01-31&gio=03:00&tinh=ha-noi&lech=28800`: ghi rõ `"Giờ sinh 03:00 được tính theo UTC+8."` và `"Bạn chọn UTC+8; mặc định là UTC+7"`.
     - `?ngay=abc`, `?ngay=1850-01-01`, `?ngay=2026-02-30`: trả `200`, hiện thông báo lỗi hợp lệ trong `.ck-loi[role="alert"]`.
     - `?tinh=khong-co`, `?lech=123`: trả `200`, hiện thông báo nhẹ trong `.ck-ct-bds-canh-bao[role="status"]` và vẫn lập bản đồ mặc định bình thường.
     - `/chiem-tinh` và `/chiem-tinh/cung-hoang-dao?ngay=1990-07-04&gio=12:00`: hiển thị thẻ `"Bản đồ sao"` và dòng dẫn sang `/chiem-tinh/ban-do-sao?ngay=1990-07-04&gio=12%3A00`.
   - **Kiểm tra tương tác thực & từ cấm**: điền form GET trên `/chiem-tinh/ban-do-sao` chuyển đúng URL kết quả, bấm mở `<details>` đầu tiên thấy đúng nguyên văn tiếng Anh `"The Sun is found to produce heat and moderate dryness."`; kiểm tra `19` liên kết nội bộ duy nhất trong `<main>` đều trả HTTP `200` (`0` liên kết lỗi); quét `innerText` của `<main>` sau khi loại `GHI_CHU_TINH_CACH` cho `0` lần xuất hiện `"tính cách"`, `"hợp với"`, `"nguyên tố"`, `"may mắn"`, `"tình yêu"`, `"nghề nghiệp"`, `"vận hạn"`, `"góc chiếu"`, `"aspect"`.
   - **Kiểm tra kích thước SVG & bảng ở 375 px**:
     - SVG trên desktop rộng `520px` (chữ nhỏ nhất `17.81px`); trên `375px` rộng `329px`, chữ nhỏ nhất quy đổi `11.09px` (≥ `11px`).
     - Khung bảng `.ck-ct-bds-bang-boc` ở `375px` có `clientW = 341`, `scrollW = 540` — cuộn ngang gọn trong khung, toàn trang `scrollWidth = 375`.
   - **Duyệt ảnh chụp**: đã mở xem trực tiếp cả `4` ảnh `ck-ct-bds-*.png`; vòng tròn sắc nét, toàn bộ ký hiệu cung và thiên thể vẽ dạng vector đơn sắc không thành emoji, các thiên thể xếp tầng tách bạch dưới `MC` (Mặt Trời, Sao Thủy, Sao Mộc) và trong Ma Kết (Thiên Vương, Hải Vương, Thổ) không chồng nét hay đè chữ.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Không lặp `BreadcrumbList` trong `<script type="application/ld+json">` tại `ban-do-sao/page.tsx`**:
   - *Lý do*: `KhungTrang` (`src/components/ck/Breadcrumb.tsx`) đã tự xuất JSON-LD `BreadcrumbList` từ `schemaBreadcrumb(breadcrumb(duongDan))`. Chỉ xuất `WebApplication` tại `page.tsx` để tránh trùng lặp.
2. **Đặt `font-family` ưu tiên `"Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2"` cho ký hiệu cung/hành tinh trong `chiem-tinh.css`**:
   - *Lý do*: Khi duyệt ảnh vòng đầu trên Windows Chromium, các ký hiệu cung (`♈︎`–`♓︎`) với `var(--ck-f-tieu)` rơi về phông emoji màu dù đã có `U+FE0E` và `font-variant-emoji: text`. Đưa phông ký hiệu đơn sắc lên đầu danh sách phông khắc phục triệt để và giữ nguyên hiển thị dạng chữ sạch sẽ.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Trạng thái và `h1` của `SeoTrang` cho `/chiem-tinh/ban-do-sao`**: Truy vấn bảng `SeoTrang` hiện có bản ghi `/chiem-tinh/ban-do-sao` ở trạng thái `trangThai: "NHAP"` (nên `metaTrang` đang trả `robots: noindex, follow` kể cả khi không có tham số) và `h1` là `"Bản đồ sao cá nhân"` (khác với `h1: "Bản đồ sao"` trong `MAC_DINH_BAN_DO_SAO` của Lệnh 39.5). Khi nghiệm thu xong cần rà lại `h1` nếu muốn thống nhất thành `"Bản đồ sao"` và chuyển `trangThai` sang `"XUAT_BAN"` cùng cụm `/chiem-tinh`.

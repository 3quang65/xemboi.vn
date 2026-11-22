# Báo cáo Lệnh 31: Trang `/xem-ngay/xuat-hanh` (giờ và hướng xuất hành Tết)

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/xem-ngay/layout.tsx` (`173` byte) — Layout cụm route `/xem-ngay`, chỉ nạp `./xem-ngay.css` và trả `<>{children}</>`.
- `src/app/(v2)/xem-ngay/xem-ngay.css` (`8.336` byte ≤ 30 KB) — CSS riêng mang tiền tố `ck-xh-*`, dùng các biến `--ck-*` sẵn có trong `ck.css`; quy định bố cục khối tóm tắt, bảng 10 ngày trên desktop và thẻ xếp dọc không tràn ngang ở `≤ 768px` (kèm lưới 2 cột 6 giờ hoàng đạo), khối "Theo sách nào" với bảng 10 can → hướng co gọn ở `≤ 1000px` (5 cột) và `≤ 700px` (2 cột), khối "Nguồn và giới hạn" và dải liên kết cuối.
- `src/app/(v2)/xem-ngay/xuat-hanh/page.tsx` (`10.090` byte) — Route `/xem-ngay/xuat-hanh` (`export const revalidate = 3600`):
  - Tính năm một lần qua `namXuatHanh()` và `xuatHanhTet(namAm)`.
  - `generateMetadata()` và thân trang gọi `metaTrang` / `thongTinTrang` với tham số `{ yyyy: namAm, 'Can Chi': x.canChiNam }` và `MAC_DINH` theo Lệnh 31.
  - Gắn JSON-LD `WebPage` (escape `<` thành `\u003c`) kết hợp JSON-LD `BreadcrumbList` sẵn có từ `KhungTrang` / `Breadcrumb`.
  - Dùng `<KhungTrang ... toi>` hiển thị lần lượt: khối tóm tắt Tết kèm liên kết `/tet` và `/xem-tuoi/xong-dat` (kiểm tra `trangDaDung()`); bảng 10 ngày mùng 1–10 (thứ, ngày dương có liên kết `/lich-am/yyyy/mm/dd` qua `duongDanNgayTuIso`, can chi ngày, 6 giờ hoàng đạo dạng `Chi (khung)`, hướng Hỷ thần / Tài thần / Phúc thần); 3 khối "Theo sách nào" từ `BAI_CA_HUONG` với `<blockquote lang="zh-Hant">` giữ nguyên văn chữ Hán (không tự dịch, giữ nguyên `背向之`) và bảng 10 can → hướng; khối "Nguồn và giới hạn" kèm ghi công `NGUON_XUAT_HANH.ghiCong`, liên kết `url`, liên kết `"Xem thông tin sách"` từ `duongDanNguonXuatHanh()`, liên kết `/phuong-phap`; và khối liên kết cuối (`/tet`, `/xem-tuoi/xong-dat`, `/lich-am/ngay-mai`, `/lich-am/${namAm}` khi `trongPhamViNam(namAm)`).
- `docs/v2/lenh-antigravity/31-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-xuat-hanh-1366.png`
  - `ck-xuat-hanh-375.png`
  - `ck-xuat-hanh-tet-1366.png`

### Tệp chỉnh sửa
- `src/app/(v2)/tet/page.tsx` (`4.848` byte) — Thêm import `trangDaDung` từ `@/lib/trang/dieu-huong` và bổ sung nút `ck-nut ck-nut-vien` `"Giờ xuất hành mùng 1–10"` trỏ `/xem-ngay/xuat-hanh` (kiểm tra `daDung.has('/xem-ngay/xuat-hanh')`) bên trong khối `ck-dieu-huong`.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `package.json`.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, thoát mã `0` (0 lỗi).
2. **Kiểm tra unit test phần lõi (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/*.test.mjs`)**:
   - Đạt, thoát mã `0`: `58/58` bài test qua, 0 thất bại (gồm `tests/trang/xuat-hanh.test.mjs`).
3. **Kiểm tra CSS & quy ước tên lớp**:
   - Dung lượng `src/app/(v2)/xem-ngay/xem-ngay.css`: `8.336` byte (≤ `30.720` byte / 30 KB). `src/app/(v2)/ck.css` không sửa.
   - Quét `Select-String` trên `src/app/(v2)/xem-ngay/*`: `0` kết quả dùng biến v1 (`--paper`, `--bg`, `--ink`) hay tên lớp trần (`.so`, `.nhan`, `.gia-tri`, `.the`, `.w`).
4. **Kiểm tra HTML thô & SEO (`http://localhost:3047`)**:
   - `GET /xem-ngay/xuat-hanh`: trả **HTTP 200**.
   - `<title>`: `Giờ xuất hành mùng 1 Tết 2027: giờ, hướng theo các sách`; `<meta name="description">`: `Giờ và hướng xuất hành mùng 1 đến mùng 10 Tết Đinh Mùi 2027 theo từng sách. Ghi rõ nguồn, các sách khác nhau.`; `<h1>`: `Giờ xuất hành Tết 2027` — không còn dấu `{yyyy}` hay `{Can Chi}`.
   - `<link rel="canonical">`: `https://xemboi.vn/xem-ngay/xuat-hanh`.
   - `<meta name="robots">`: `noindex, follow` (do bản ghi `SeoTrang` đang ở trạng thái `NHAP`).
   - JSON-LD: có đúng `1` khối `WebPage` và `1` khối `BreadcrumbList` gồm `4` mắt xích (`Trang chủ` → `Lịch âm` → `Tết` → `Xuất hành`).
   - `GET /tet`: trả **HTTP 200**.
5. **Kiểm tra trình duyệt thực tế (`http://localhost:3047`, Chromium via `playwright-core`) ở `1366×900` và `375×812`**:
   - **0 lỗi console**, **0 `pageerror`**, **0 phản hồi HTTP ≥ 400**.
   - **0 tràn ngang**: `/xem-ngay/xuat-hanh` ở `1366` có `scrollWidth = 1366`, ở `375` có `scrollWidth = 375` (`thead` ẩn `display: none`, từng `tr` thành thẻ `display: block`); `/tet` ở `1366` có `scrollWidth = 1366`.
   - **Đối chiếu dữ liệu trên `/xem-ngay/xuat-hanh`**:
     - Dòng tóm tắt khớp: `"Tết Đinh Mùi 2027: mùng 1 là Thứ bảy, 06/02/2027."`, kèm 2 nút `/tet` và `/xem-tuoi/xong-dat`.
     - Bảng có đủ `10` dòng (Mùng 1 là `Thứ bảy`, `06/02/2027`, `Bính Thìn`), mỗi dòng đủ `6` giờ hoàng đạo và `3` hướng Hỷ thần / Tài thần / Phúc thần khớp hoàn toàn với `xuatHanhTet(2027)`, ngày dương liên kết đúng `/lich-am/2027/02/06` … `/lich-am/2027/02/15`.
     - Khối `"Theo sách nào"`: đủ `3` bài ca (`Hỷ thần — 喜神方位歌`, `Tài thần — 財神方位歌`, `Phúc thần — 福神方位歌`) với `<blockquote lang="zh-Hant">` khớp nguyên văn `BAI_CA_HUONG` (giữ nguyên `背向之`) và bảng `10` thiên can khớp `theoCan`.
     - Khối `"Nguồn và giới hạn"`: đủ `2` câu theo quy định, ghi công `Văn bản: Wikisource, CC BY-SA 4.0`, liên kết `https://zh.wikisource.org/wiki/玉匣記`, liên kết `"Xem thông tin sách"` (`/nguon/ngoc-hap-ky`), và liên kết `/phuong-phap`.
     - Khối `"Trang liên quan"` có đủ `4` liên kết `/tet`, `/xem-tuoi/xong-dat`, `/lich-am/ngay-mai`, `/lich-am/2027`.
     - Không xuất hiện các cụm từ cấm (`nên đi hướng nào`, `giờ tốt nhất`, `12 trực`, `28 sao`).
   - **Kiểm tra `/tet`**: có nút `.ck-dieu-huong a.ck-nut.ck-nut-vien[href="/xem-ngay/xuat-hanh"]` với nhãn `"Giờ xuất hành mùng 1–10"`.
   - **Quét liên kết nội bộ**: kiểm tra `50` đường dẫn nội bộ duy nhất thu được trên `/xem-ngay/xuat-hanh` và `/tet` → `0` liên kết lỗi (100% không trả ≥ 400).
   - **Duyệt ảnh chụp bằng mắt (`1366` và `375`)**: đã mở kiểm tra cả 3 ảnh (`ck-xuat-hanh-1366.png`, `ck-xuat-hanh-375.png`, `ck-xuat-hanh-tet-1366.png`); bố cục E3 cân đối, bảng desktop và thẻ dọc 375 px rõ nét, 3 khối chữ Hán + bảng 10 can và nút mới trên `/tet` hiển thị gọn đẹp.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Giữ nguyên chuỗi khung giờ `g.khung` dạng `23:00–00:59` từ `xuat-hanh.ts` / `am-lich.ts` (thay vì sửa chữ sang `23:00–01:00`)**:
   - *Lý do*: `src/lib/trang/xuat-hanh.ts` trả về sẵn `g.khung` theo `KHUNG_GIO` của `src/lib/tuvi-v2/am-lich.ts` (ví dụ `23:00–00:59`, `03:00–04:59`). Hiển thị nguyên `g.khung` bảo đảm đồng bộ với toàn bộ các trang lịch khác của hệ v2 và không tự chế dữ liệu ngoài `src/lib/**`.
2. **Chỉ thêm `<script type="application/ld+json">` cho `WebPage` trong `page.tsx`, dùng lại `BreadcrumbList` của `KhungTrang`**:
   - *Lý do*: Component dùng chung `KhungTrang` (qua `Breadcrumb.tsx`) đã tự xuất `<script type="application/ld+json">` chứa `schemaBreadcrumb(breadcrumb('/xem-ngay/xuat-hanh'))`. Chỉ thêm `WebPage` ở `page.tsx` giúp trang có đủ đúng 2 schema `WebPage` + `BreadcrumbList` mà không bị lặp `BreadcrumbList`.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Trạng thái `SeoTrang` của `/xem-ngay/xuat-hanh` (`maTrang: XN-XUATHANH`)**: Bản ghi trong CSDL hiện đang ở `trangThai = "NHAP"` (`noiDungId = null`), nên `metaTrang` xuất `<meta name="robots" content="noindex, follow"/>`. Khi nghiệm thu xong, chuyển `trangThai` sang `XUAT_BAN` để mở index.
- **Rà lại câu chữ `title` và `metaDescription` trong bản ghi `SeoTrang` `/xem-ngay/xuat-hanh`**: Bản ghi CSDL hiện đang đặt `"Giờ xuất hành mùng 1 Tết {yyyy}: giờ, hướng theo các sách"` và `"...theo từng sách."`, trong khi dữ liệu hiện tại mới dùng 1 sách hướng (`Ngọc hạp ký`) và lịch Hồ Ngọc Đức. Nếu muốn đồng bộ với `MAC_DINH` (`"...theo sách"`), có thể chỉnh trực tiếp trong quản trị SEO.

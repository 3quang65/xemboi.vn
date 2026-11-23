# Báo cáo Lệnh 38: Trang Cửu tinh năm, tháng trong cụm `/phong-thuy`

Ngày hoàn thành: 23/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/phong-thuy/cuu-tinh/CuuTinhHelpers.ts` (`4.496` byte) — Trợ giúp chỉ chạy ở server cho cụm Cửu tinh: hằng số SEO mặc định (`MAC_DINH_CUU_TINH`, `PHU_CUU_TINH`, `MAU_SEO_CUU_TINH_NAM`, `macDinhCuuTinhNam`, `thamSoCuuTinhNam`), thứ tự 9 ô Lạc thư đặt Nam ở trên (`THU_TU_LUOI_LAC_THU = [4, 9, 2, 3, 5, 7, 8, 1, 6]`), danh sách 4 sao Hiệp kỷ (`BON_SAO_HIEP_KY = [1, 6, 8, 9]`), thứ tự 5 câu trích `TRICH_DAN_CUU_TINH`, định dạng ngày giờ Việt Nam UTC+7 (`dinhDangNgayGioVN` theo mẫu cộng `7 * 3600_000` và đọc `getUTC*`), kiểm tra năm hợp lệ (`phanTichNamCuuTinh` 1901–2099, `phanTichNamTrangRieng` 2020–2035), ánh xạ lớp màu 7 nhóm sao (`lopMauSao`), tên tháng tiết (`tenThangTiet`), tên vị trí (`tenViTriCung`), và schema `taoSchemaCuuTinhWebPage`.
- `src/app/(v2)/phong-thuy/cuu-tinh/CuuTinhUi.tsx` (`7.307` byte) — Các Server Component dùng chung:
  - `BangCuuCung`: lưới 3×3 đặt Nam (Ly) ở trên cùng chính giữa, Bắc (Khảm) ở dưới cùng chính giữa, phía trên có câu `"Nam ở trên, theo cách vẽ Lạc thư trong sách cổ."`; mỗi ô hiển thị tên phương, cung (ở chế độ thường), số sao to, tên sao, chữ Hán nhỏ, điểm nhấn màu theo đúng tên màu (bạch, hắc, bích, lục, hoàng, xích, tử); hỗ trợ chế độ `nho` cho 12 bàn tháng.
  - `KhoiCuuTinhNam`: hiển thị `"Năm {canChi} ({nam}), {nguyen}: {tên sao trung} vào trung cung."`, mốc `"Từ {batDau} đến {ketThuc} (giờ Việt Nam, UTC+7)."`, `GHI_CHU_MOC`, `BangCuuCung` của năm, dòng tra nhanh `"Ngũ hoàng ở {phương}. Nhị hắc ở {phương}."`, và `GHI_CHU_BON_SAO` kèm vị trí 4 sao Nhất bạch, Lục bạch, Bát bạch, Cửu tử.
  - `KhoiCuuTinhThang`: lưới 12 tháng tiết (`Tháng giêng (Dần)` … `Tháng 12 (Sửu)`), tiết mở đầu, ngày giờ bắt đầu UTC+7, sao trung cung, `BangCuuCung` chế độ `nho`, làm nổi thẻ có tháng trùng `thangTietTai(new Date())` với nhãn `"Đang hiệu lực"`.
  - `DanhSachNamCuuTinh`: 16 liên kết năm `NAM_TRANG_CUU_TINH` (2020–2035), đánh dấu năm hiện tại ở trang `[nam]`.
- `src/app/(v2)/phong-thuy/cuu-tinh/page.tsx` (`7.327` byte) — Công cụ `/phong-thuy/cuu-tinh` (`export const revalidate = 3600`): `generateMetadata` qua `metaTrang('/phong-thuy/cuu-tinh', MAC_DINH_CUU_TINH)` đặt `canonical` sạch và `robots: { index: false, follow: true }` khi có tham số; JSON-LD `WebApplication`; form GET `?nam=` (khoảng `NAM_CUU_TINH_TU`–`NAM_CUU_TINH_DEN`, mặc định năm tiết từ `thangTietTai(new Date())`, báo lỗi nhẹ `.ck-loi[role="alert"]` khi ngoài khoảng hoặc sai định dạng, không lỗi 500); `KhoiCuuTinhNam`; `KhoiCuuTinhThang`; khối `"Cách tính theo sách"` in 5 câu `TRICH_CUU_TINH` bằng `KhoiTrichDan` đúng thứ tự `lacThu`, `thuanBo`, `saoNam`, `saoThang`, `tenVaHanh`; bảng 9 sao Cửu tinh (số, tên sao kèm chấm màu, chữ Hán, tên Bắc Đẩu, hành dùng `HuyHieuHanh`); liên kết `NAM_TRANG_CUU_TINH`; liên kết cùng cụm kiểm qua `trangDaDung()`; và `GhiCongHiepKy`.
- `src/app/(v2)/phong-thuy/cuu-tinh/[nam]/page.tsx` (`4.236` byte) — 16 trang năm tĩnh `/phong-thuy/cuu-tinh/[nam]` (`generateStaticParams` từ `NAM_TRANG_CUU_TINH`, `dynamicParams = false`, `export const revalidate = 3600`, gọi `notFound()` nếu ngoài 2020–2035): `generateMetadata` dùng `metaTrang` với `MAU_SEO_CUU_TINH_NAM` và `thamSoCuuTinhNam(data)`; JSON-LD `WebPage`; `<h1>` `"Cửu tinh năm {nam} ({canChi})"`; breadcrumb qua `KhungTrang` với `duongDanCuuTinh(nam)` và `tenCuoi = "Cửu tinh năm {nam}"`; không có ô chọn năm; `KhoiCuuTinhNam`; `KhoiCuuTinhThang`; thanh điều hướng năm trước / năm sau (nếu có trong `NAM_TRANG_CUU_TINH`) và về `/phong-thuy/cuu-tinh`; danh sách 16 năm; liên kết cùng cụm; và `GhiCongHiepKy`.
- `docs/v2/lenh-antigravity/38-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`6` ảnh):
  - `ck-pt-ct-2027-1366.png` (`1.511.561` byte)
  - `ck-pt-ct-2027-375.png` (`1.278.822` byte)
  - `ck-pt-ct-nam-2026-1366.png` (`1.300.065` byte)
  - `ck-pt-ct-nam-2026-375.png` (`1.039.257` byte)
  - `ck-pt-ct-hub-1366.png` (`987.281` byte)
  - `ck-pt-ct-hub-375.png` (`694.464` byte)

### Tệp chỉnh sửa
- `src/app/(v2)/phong-thuy/page.tsx` (`7.377` byte) — Thêm thẻ thứ tư `"Cửu tinh năm, tháng"` dẫn tới `/phong-thuy/cuu-tinh` với mô tả `"Sao nào vào trung cung, bay tới phương nào, theo Hiệp kỷ."` vào lưới công cụ hub `/phong-thuy`, và cập nhật câu dẫn đầu trang.
- `src/app/(v2)/phong-thuy/phong-thuy.css` (`24.932` byte ≤ `30.720` byte / 30 KB) — Đổi `.ck-pt-hub-ba` thành 2 cột trên desktop (cân đối 2×2 cho 4 thẻ) và bổ sung nhóm lớp `.ck-pt-ct-*` cho lưới 3×3 vuông (`aspect-ratio: 1 / 1` ở bàn năm, kích thước gọn ở chế độ `nho`), 7 màu sao (kèm biến thể tương phản cho `.ck-toi`), khối tra nhanh 4 sao, lưới 12 bàn tháng (3 cột desktop, 2 cột `≤ 1000px`, 1 cột `≤ 700px`), nút điều hướng năm trước/sau và responsive `375px`.

### Tệp xóa
- Không có.

### Xác nhận vùng cấm
- Trong phạm vi Lệnh 38, không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/components/ck/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `package.json`, `tests/**`. *(Lưu ý: `src/lib/trang/dieu-huong.ts`, `src/lib/trang/cuu-tinh.ts`, `tests/trang/cuu-tinh.test.mjs`, `tests/trang/meta-dieu-huong.test.mjs` là phần đã có sẵn trước khi nhận lệnh).*
- Toàn bộ tệp mới đều là Server Component (`0` `'use client'`).
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, thoát mã `0` (`TSC_EXIT=0`, 0 lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test --test-concurrency=2 tests/trang/*.test.mjs`)**:
   - Đạt, thoát mã `0` (`TEST_EXIT=0`): `123/123` bài test qua, `0` thất bại, `0` bị bỏ qua (gồm đủ `8/8` bài trong `tests/trang/cuu-tinh.test.mjs` kể cả đối chiếu 600 ô năm và 36 ô tháng Kanripo KR3g0051, và `7/7` bài trong `tests/trang/meta-dieu-huong.test.mjs`).
3. **Kiểm tra CSS & quét cụm từ cấm**:
   - `src/app/(v2)/phong-thuy/phong-thuy.css`: `24.932` byte (≤ `30.720` byte / 30 KB), chỉ dùng lớp tiền tố `ck-`.
   - Quét toàn bộ mã nguồn mới (`src/app/(v2)/phong-thuy/cuu-tinh/**` và `src/app/(v2)/phong-thuy/page.tsx`): `0` biến v1 (`--paper`, `--bg`, `--ink`), `0` `'use client'`, `0` xuất hiện các cụm từ `"hóa giải"`, `"vật phẩm"`, `"sát khí"`, `"kích hoạt"`, `"cải vận"`.
4. **Kiểm tra HTTP, đối chiếu dữ liệu, liên kết & trình duyệt (`http://127.0.0.1:3051`, Chromium via `playwright-core`)**:
   - **22/22 đường dẫn hợp lệ trả HTTP 200**: `/phong-thuy`, `/phong-thuy/cuu-tinh`, `/phong-thuy/cuu-tinh?nam=2027`, `/phong-thuy/cuu-tinh?nam=1950`, `/phong-thuy/cuu-tinh?nam=abc`, `/phong-thuy/cuu-tinh?nam=3000`, và đủ 16 trang năm `/phong-thuy/cuu-tinh/2020` … `/phong-thuy/cuu-tinh/2035`.
   - **3/3 đường dẫn ngoài phạm vi trả HTTP 404**: `/phong-thuy/cuu-tinh/2019`, `/phong-thuy/cuu-tinh/2036`, `/phong-thuy/cuu-tinh/abc`.
   - **Xử lý tham số sai & SEO**: `?nam=abc` và `?nam=3000` trả HTTP `200` kèm hộp báo lỗi `[role="alert"]` và liên kết quay lại năm hiện tại; `?nam=2027` xuất `canonical = "https://xemboi.vn/phong-thuy/cuu-tinh"` và `robots = "noindex, follow"`; nút gửi form có màu chữ `rgb(251, 241, 218)`.
   - **Đối chiếu dữ liệu**:
     - `/phong-thuy/cuu-tinh?nam=2027` (cũng kiểm tra gửi form GET từ giao diện): `"Năm Đinh Mùi (2027), Hạ nguyên: Cửu tử vào trung cung."`, `"Từ 04/02/2027 08:46 đến 04/02/2028 14:31 (giờ Việt Nam, UTC+7)."`, `"Ngũ hoàng ở Bắc (Khảm). Nhị hắc ở Tây (Đoài)."`; ô trên giữa Lạc thư là `Nam (Ly)` với `4 Tứ lục`, ô giữa là `Trung cung` với `9 Cửu tử`, ô dưới giữa là `Bắc (Khảm)` với `5 Ngũ hoàng`; tháng giêng (`Tháng giêng (Dần)`) có `5 Ngũ hoàng` ở trung cung; `Tháng 12 (Sửu)` bắt đầu `06/01/2028 02:54`; đủ 5 khối `KhoiTrichDan` và 9 dòng bảng sao.
     - `/phong-thuy/cuu-tinh/2026`: title `"Cửu tinh năm 2026: sao bay 9 phương, 12 tháng"`, description `"Cửu tinh năm 2026 (Bính Ngọ): Nhất bạch vào trung cung, Ngũ hoàng ở Nam (Ly); bàn 12 tháng tiết kèm ngày đổi tháng. Tính theo Hiệp kỷ biện phương thư."`, `<h1>` `"Cửu tinh năm 2026 (Bính Ngọ)"`, breadcrumb `Trang chủ › Phong thủy › Cửu tinh › Cửu tinh năm 2026`, `"Ngũ hoàng ở Nam (Ly). Nhị hắc ở Tây Bắc (Càn)."`, nổi bật tháng hiệu lực `Tháng 10 (Hợi)` (`"Đang hiệu lực"`), có liên kết 2025, 2027 và về `/phong-thuy/cuu-tinh`.
     - `/phong-thuy/cuu-tinh?nam=1950`: `"Canh Dần (1950)"`, `"Ngũ hoàng vào trung cung"`.
     - Trên toàn bộ các trang mới đã kiểm, `innerText` và `<meta name="description">` đều có `0` lần xuất hiện các từ `"hóa giải"`, `"vật phẩm"`, `"sát khí"`, `"kích hoạt"`, `"cải vận"`.
   - **Console, tràn ngang, liên kết nội bộ và duyệt ảnh chụp**:
     - `0` lỗi console, `0` `pageerror`, `0` response lỗi trên toàn bộ trang kiểm tra.
     - `0` tràn ngang (`scrollWidth <= clientWidth`) ở cả `1366px` và `375px`.
     - Toàn bộ `37` liên kết nội bộ duy nhất thu thập trong `<main>` trên các trang kiểm tra đều trả HTTP `200` (`0` liên kết 404).
     - Mở xem trực tiếp cả `6` ảnh chụp trong `docs/v2/bang-chung/`: lưới 3×3 cân đối hình vuông trên desktop và `375px`, 7 nhóm màu sao phân biệt rõ với độ tương phản chữ cao, 12 bàn tháng xếp 3 cột ở `1366px` và 1 cột ở `375px`, thẻ thứ tư trên hub `/phong-thuy` cân đối 2×2.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Dùng `PHU_CUU_TINH` riêng cho dòng phụ dưới `<h1>` trên `/phong-thuy/cuu-tinh` và lược cụm `"không bán vật phẩm"` ở `MAC_DINH_CUU_TINH.description`**:
   - *Lý do*: Lệnh 38 quy định `"Không có chữ 'hóa giải', 'vật phẩm', 'sát khí', 'kích hoạt', 'cải vận' trên các trang mới"`. Vì chuỗi `metaDescription` của `PT-CUUTINH` trong `docs/v2/16-seo-trang.csv` (dòng 98) có cụm `"không bán vật phẩm"`, việc dùng riêng `PHU_CUU_TINH` và giữ `MAC_DINH_CUU_TINH.description` sạch chuỗi `"vật phẩm"` bảo đảm trang không vi phạm kiểm tra từ cấm.
2. **Không lặp `BreadcrumbList` trong `<script type="application/ld+json">` của từng `page.tsx`**:
   - *Lý do*: `KhungTrang` (`src/components/ck/Breadcrumb.tsx`) đã tự xuất `BreadcrumbList` qua `schemaBreadcrumb(breadcrumb(duongDan, tenCuoi))`. Chỉ xuất `WebApplication` / `WebPage` tại `page.tsx` để tránh trùng lặp JSON-LD.
3. **Truyền trực tiếp `<h1>` `"Cửu tinh năm {nam} ({canChi})"` cho `KhungTrang` trên `/phong-thuy/cuu-tinh/[nam]`**:
   - *Lý do*: Lệnh 38.3 yêu cầu `<h1>` `"Cửu tinh năm {nam} ({canChi})"`, trong khi dòng 99 `docs/v2/16-seo-trang.csv` đang ghi cột `h1` là `"Cửu tinh năm {nam}"`. Truyền trực tiếp giúp giữ đúng yêu cầu Lệnh 38.3 ngay cả sau khi nhập dữ liệu `SeoTrang` vào CSDL.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Nhập và xuất bản 2 bản ghi `SeoTrang` cho Cửu tinh**: Truy vấn CSDL trước khi làm cho thấy `/phong-thuy/cuu-tinh` và `/phong-thuy/cuu-tinh/{nam}` hiện chưa có trong bảng `SeoTrang` (đang dùng `MAC_DINH` và `noindex, follow`). Cần nhập 2 dòng `PT-CUUTINH` và `PT-CUUTINH-NAM` từ `docs/v2/16-seo-trang.csv` vào CSDL và chuyển sang `XUAT_BAN` cùng lúc với các trang `/phong-thuy` đã dựng khác.
- **Rà cụm `"không bán vật phẩm"` ở dòng `PT-CUUTINH` trong `16-seo-trang.csv`**: Khi nhập vào `SeoTrang`, nên cân nhắc bỏ cụm `"không bán vật phẩm"` (như cách `MAC_DINH_CUU_TINH` đã làm) để `<meta name="description">` cũng hoàn toàn không chứa chuỗi `"vật phẩm"`.

# Báo cáo Lệnh 29: Trang nền: phương pháp, nguồn sách, từ điển, kiến thức, bài viết, liên hệ, chính sách (F5)

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- 4 tệp CSS riêng (không sửa `src/app/(v2)/ck.css`; mỗi tệp dùng tiền tố `ck-`, biến `--ck-*` trên `.ck`, dung lượng đều nhỏ hơn `30.720` byte / 30 KB):
  - `src/app/(v2)/phuong-phap/phuong-phap.css` (`3.710` byte)
  - `src/app/(v2)/nguon/nguon.css` (`4.321` byte)
  - `src/app/(v2)/tu-dien/tu-dien-trang.css` (`3.802` byte)
  - `src/components/ck/bai.css` (`3.556` byte — dùng chung cho `kien-thuc`, `bai-viet`, `lien-he` và 3 trang `chinh-sach-*`)
- 9 tệp `layout.tsx` (chỉ nạp `@/components/ck/tu-dien.css` cùng tệp CSS tương ứng và trả `<>{children}</>`):
  - `src/app/(v2)/phuong-phap/layout.tsx`
  - `src/app/(v2)/nguon/layout.tsx`
  - `src/app/(v2)/tu-dien/layout.tsx`
  - `src/app/(v2)/kien-thuc/layout.tsx`
  - `src/app/(v2)/bai-viet/layout.tsx`
  - `src/app/(v2)/lien-he/layout.tsx`
  - `src/app/(v2)/chinh-sach-bao-mat-va-cookies/layout.tsx`
  - `src/app/(v2)/chinh-sach-su-dung-va-khieu-nai/layout.tsx`
  - `src/app/(v2)/chinh-sach-ban-quyen/layout.tsx`
- 5 component dùng chung trong `src/components/ck/`:
  - `src/components/ck/BangQuyUoc.tsx` — Bảng quy ước tính từ `BANG_QUY_UOC` (hỗ trợ chia 3 nhóm `Lịch âm`, `Tử vi`, `Bát tự`; chỉ hiện cột `Xem thêm` khi bảng có liên kết đích đã dựng và khác trang hiện tại; mobile `≤ 700px` chuyển thành từng thẻ dọc).
  - `src/components/ck/DanhSachNguonClient.tsx` — Bộ lọc theo mảng và ô tìm theo tên sách / chữ Hán / tác giả phía client (hỗ trợ không dấu tiếng Việt, không gọi API), giữ nhãn loại nguồn, giấy phép, mảng và liên kết `/nguon/{slug}`.
  - `src/components/ck/TuDienThuatNguClient.tsx` — Mục lục neo `#nhom-{mang}` ở đầu, ô lọc theo chữ phía client (Hán Việt, chữ Hán, biến thể), hiển thị 6 nhóm thuật ngữ với liên kết tới các trang từ điển v2 đã có (`lienKet`).
  - `src/components/ck/TrangBaiViet.tsx` — Component dùng chung và `taoMetadataBaiViet` cho `/kien-thuc/[slug]` và `/bai-viet/[slug]`: kiểm tra `noiDungTheoDuongDan(duongDan)` (trả `null` thì gọi `notFound()`), cột đọc tối đa `70ch`, dòng ngày `"Đăng {ngayXuatBan}"` / `"· Cập nhật {capNhatLuc}"`, `NoiDungMd`, danh sách `"Nguồn"` khi có `trichDan`, breadcrumb `Trang chủ › Kiến thức › bài`, JSON-LD `Article`, liên kết cuối bài về `/kien-thuc` và `/phuong-phap`.
  - `src/components/ck/TrangPhapLy.tsx` — Component dùng chung và `taoMetadataPhapLy` cho `/lien-he` và 3 trang chính sách: ép `robots: { index: false, follow: true }` khi chưa có `noiDungTheoDuongDan`, chỉ hiện câu chỗ giữ quy định khi chưa xuất bản bài, không tự viết điều khoản hay thông tin liên hệ.
- 16 tệp route trang trong `src/app/(v2)/`:
  - `src/app/(v2)/phuong-phap/page.tsx` — Trang `/phuong-phap`: `<KhoiDienGiai />`, câu cố định `"Khi lập lá số, bạn đổi được các quy ước có ghi cách khác."`, bảng quy ước đủ 22 dòng chia 3 nhóm, 6 thẻ điều hướng theo đúng thứ tự (`Nam phái và Bắc phái`, `Giờ Tý`, `Tháng nhuận`, `Chuẩn biên tập`, `Người duyệt`, `Thư mục nguồn sách`).
  - `src/app/(v2)/phuong-phap/thang-nhuan/page.tsx` — Trang `/phuong-phap/thang-nhuan`: 74 dòng `bangThangNhuan()` (1900–2100) kèm Can Chi, thanh chọn nhanh neo `#tk-1900` / `#tk-2000` không cần JS, đánh dấu năm âm hiện tại nếu có, ghi chú `"Nếu tính theo UTC+7 thì nhuận tháng {n}"` ở 3 năm 1917/1922/1938, câu cố định về mốc 01/01/1968, 2 quy ước (`lich-thang-nhuan`, `tv-thang-nhuan`), `<KhoiDienGiai />`, liên kết `/lich-am/doi-ngay`, `/tu-vi/lap-la-so`.
  - `src/app/(v2)/phuong-phap/gio-ty/page.tsx` — Trang `/phuong-phap/gio-ty`: bảng 12 canh giờ tách giờ Tý làm 2 dòng (`23:00–23:59 (Tý đầu, tính ngày hôm sau)` và `00:00–00:59`), 2 quy ước (`tv-gio-ty`, `bt-ngay`), `<KhoiDienGiai />`, liên kết `/tu-vi/lap-la-so`, `/bat-tu/lap-la-so`, `/lich-am/doi-ngay`.
  - `src/app/(v2)/phuong-phap/nam-phai-bac-phai/page.tsx` — Trang `/phuong-phap/nam-phai-bac-phai`: khối `"Các điểm xemboi cho chọn khi lập lá số"` với 11 dòng nhóm Tử vi có `khac` khác rỗng, `<KhoiDienGiai />`.
  - `src/app/(v2)/phuong-phap/chuan-bien-tap/page.tsx` — Trang `/phuong-phap/chuan-bien-tap`: chỉ gồm H1, breadcrumb và `<KhoiDienGiai />` (chỗ giữ).
  - `src/app/(v2)/phuong-phap/nguoi-duyet/page.tsx` — Trang `/phuong-phap/nguoi-duyet`: chỉ gồm H1, breadcrumb và `<KhoiDienGiai />` (chỗ giữ).
  - `src/app/(v2)/nguon/page.tsx` — Trang `/nguon`: `force-dynamic` đọc `?mang=` (nếu có tham số ép `noindex, follow` và canonical `/nguon`), câu cố định đầu trang và 164 nguồn qua `<DanhSachNguonClient />`.
  - `src/app/(v2)/nguon/[slug]/page.tsx` — Trang `/nguon/[slug]`: `generateStaticParams` cho 164 nguồn (`notFound()` nếu không có), `metaTrang` dùng mẫu `/nguon/{slug-sach}`, bảng 10 trường thông tin thư mục, nút `"Xem bản số hóa"` (`rel="noopener noreferrer nofollow"`), đếm `soBaiTrichNguon(ma)` (ẩn khi = 0), JSON-LD `Book`, liên kết `/nguon` và `/phuong-phap/chuan-bien-tap`.
  - `src/app/(v2)/tu-dien/page.tsx` — Trang `/tu-dien`: khối `"Mục từ điển đã có"` (6 chỉ mục theo `trangDaDung()`), khối `"Thuật ngữ"` (336 mục chia 6 nhóm), JSON-LD `DefinedTermSet` chứa 336 `DefinedTerm`.
  - `src/app/(v2)/kien-thuc/page.tsx` — Trang `/kien-thuc`: danh sách bài từ `danhSachBaiViet()` (4 bài), phân trang `?trang=2` khi vượt 12 bài (mỗi trang hợp lệ tự canonical; tham số lạ/vượt trang ép `noindex, follow` và canonical `/kien-thuc`), hoặc chỗ giữ `"Bài đang được biên tập"` nếu rỗng.
  - `src/app/(v2)/kien-thuc/[slug]/page.tsx` — Trang bài viết `/kien-thuc/[slug]` dùng `<TrangBaiViet />`.
  - `src/app/(v2)/bai-viet/[slug]/page.tsx` — Trang bài viết `/bai-viet/[slug]` dùng `<TrangBaiViet />` (`generateStaticParams` từ `danhSachBaiViet('/bai-viet/')`).
  - `src/app/(v2)/lien-he/page.tsx` — Trang `/lien-he` (chỗ giữ `"Thông tin liên hệ đang cập nhật."`).
  - `src/app/(v2)/chinh-sach-bao-mat-va-cookies/page.tsx` — Trang `/chinh-sach-bao-mat-va-cookies` (chỗ giữ `"Nội dung đang được rà soát trước khi đăng."`).
  - `src/app/(v2)/chinh-sach-su-dung-va-khieu-nai/page.tsx` — Trang `/chinh-sach-su-dung-va-khieu-nai` (chỗ giữ `"Nội dung đang được rà soát trước khi đăng."`).
  - `src/app/(v2)/chinh-sach-ban-quyen/page.tsx` — Trang `/chinh-sach-ban-quyen` (chỗ giữ `"Nội dung đang được rà soát trước khi đăng."`).
- `docs/v2/lenh-antigravity/29-bao-cao.md` — Báo cáo này.
- 22 ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`1366` và `375` cho 11 màn hình):
  - `ck-f5-phuong-phap-1366.png`, `ck-f5-phuong-phap-375.png`
  - `ck-f5-thang-nhuan-1366.png`, `ck-f5-thang-nhuan-375.png`
  - `ck-f5-gio-ty-1366.png`, `ck-f5-gio-ty-375.png`
  - `ck-f5-nam-phai-bac-phai-1366.png`, `ck-f5-nam-phai-bac-phai-375.png`
  - `ck-f5-nguon-1366.png`, `ck-f5-nguon-375.png`
  - `ck-f5-nguon-chi-tiet-1366.png`, `ck-f5-nguon-chi-tiet-375.png`
  - `ck-f5-tu-dien-1366.png`, `ck-f5-tu-dien-375.png`
  - `ck-f5-kien-thuc-1366.png`, `ck-f5-kien-thuc-375.png`
  - `ck-f5-bai-viet-1366.png`, `ck-f5-bai-viet-375.png`
  - `ck-f5-lien-he-1366.png`, `ck-f5-lien-he-375.png`
  - `ck-f5-chinh-sach-1366.png`, `ck-f5-chinh-sach-375.png`

### Tệp chỉnh sửa
- `src/components/ck/KhungTrang.tsx` — Bổ sung prop tùy chọn `breadcrumbRieng?: MatXich[]` để các trang bài viết ở `/bai-viet/[slug]` truyền trực tiếp chuỗi `Trang chủ › Kiến thức › bài`.

### Xác nhận vùng cấm
- `src/app/(v2)/ck.css`: **không sửa**.
- `src/lib/**`, `prisma/**`, `scripts/**`, `src/app/api/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/quan-tri/**`, `src/app/tu-vi-2027/**`, `src/components/r1/**`, `package.json`: **không sửa**.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, `TSC_EXIT=0` (0 lỗi).
2. **Kiểm tra unit test phần lõi (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/*.test.mjs`)**:
   - Đạt, `TEST_EXIT=0`: `51/51` bài test qua, 0 thất bại.
3. **Kiểm tra quy định CSS & quy ước tên lớp**:
   - Dung lượng 4 tệp CSS: `phuong-phap.css` `3.710` B, `nguon.css` `4.321` B, `tu-dien-trang.css` `3.802` B, `bai.css` `3.556` B (đều `< 30.720` B). `src/app/(v2)/ck.css` giữ nguyên.
   - Quét `Select-String` toàn bộ tệp tạo mới/chỉnh sửa: `0` biến v1 (`--paper`, `--bg`, `--ink`), `0` tên lớp trần (`so`, `nhan`, `gia-tri`, `the`, `w`).
4. **Kiểm tra HTML thô (`fetch`, không đi theo redirect), `noindex` / `canonical` và 404**:
   - `17/17` URL đại diện đều trả **HTTP 200** và không còn dấu `{...}` trong `<title>` hoặc `<h1>`:
     - `/phuong-phap`, 5 trang con `/phuong-phap/*`, `/nguon`, `/nguon?mang=Kinh+D%E1%BB%8Bch`, `/nguon/tan-tien-hy-di-tran-tien-sinh-tu-vi-dau-so-toan-thu`, `/tu-dien`, `/kien-thuc?trang=2`, `/bai-viet/huong-dan-doc-la-so-tu-vi-nam-phai-cho-nguoi-moi`, `/lien-he` và 3 trang `/chinh-sach-*` đều có `<meta name="robots" content="noindex, follow"/>`.
     - `/kien-thuc` (trạng thái `XUAT_BAN` trong `SeoTrang`) có `index, follow` và canonical `https://xemboi.vn/kien-thuc`.
     - `/nguon?mang=Kinh+D%E1%BB%8Bch` và `/kien-thuc?trang=2` đều đặt canonical về URL gốc không tham số (`/nguon`, `/kien-thuc`).
   - Kiểm tra 404: `/nguon/khong-co-sach-nay-f5`, `/bai-viet/khong-co-bai-nay` và `/kien-thuc/khong-co-bai-nay` đều trả **HTTP 404**.
5. **Kiểm tra trình duyệt thực tế (`http://localhost:3047`, Chromium qua `playwright-core`) ở `1366` và `375`**:
   - **0 lỗi console** (`consoleErrors: []`), **0 `pageerror`** (`pageErrors: []`), **0 phản hồi `≥ 400`** (`badResponses: []`) trên cả 15 đường dẫn ở cả 2 kích thước màn hình.
   - **0 tràn ngang**: `scrollWidth === innerWidth` (`1366` và `375`) trên mọi trang, kể cả `/phuong-phap`, `/phuong-phap/thang-nhuan`, `/nguon`, `/nguon/[slug]`, `/tu-dien`, `/bai-viet/[slug]`.
   - **Quét liên kết nội bộ trong `<main>`**: quét `226` đường dẫn nội bộ duy nhất thu được trên các trang F5 → `0` liên kết lỗi (`brokenLinks: []`).
   - **Đối chiếu nghiệp vụ theo mục 2 Lệnh 29**:
     - `/phuong-phap`: đủ `3` nhóm (`Lịch âm` 3, `Tử vi` 14, `Bát tự` 5), tổng `22` dòng quy ước, `6` thẻ trang con đúng thứ tự.
     - `/phuong-phap/thang-nhuan`: đủ `74` dòng (1900–2100); dòng `2025` hiện `Ất Tỵ`, `Tháng 6 nhuận`, `25/07/2025` đến `22/08/2025`; dòng `1917` hiện `Đinh Tỵ`, `Tháng 2 nhuận` kèm `"Nếu tính theo UTC+7 thì nhuận tháng 3"`; `2` dòng quy ước tính (`lich-thang-nhuan`, `tv-thang-nhuan`).
     - `/phuong-phap/gio-ty`: tách 2 dòng giờ Tý (`23:00–23:59 (Tý đầu, tính ngày hôm sau)` và `00:00–00:59`) và 11 canh giờ còn lại, kèm `2` dòng quy ước (`tv-gio-ty`, `bt-ngay`).
     - `/phuong-phap/nam-phai-bac-phai`: tiêu đề `"Các điểm xemboi cho chọn khi lập lá số"`, đủ `11` dòng nhóm Tử vi có cách khác.
     - `/phuong-phap/chuan-bien-tap` và `/phuong-phap/nguoi-duyet`: chỉ có H1, breadcrumb và `<KhoiDienGiai />` (chỗ giữ).
     - `/nguon`: đủ `164` mục; bấm lọc `"Kinh Dịch"` còn `46` mục (100% có nhãn `"Kinh Dịch"`); tìm `"Chu Dịch"` còn `10` mục; bấm `"Xem tất cả"` về lại `164` mục.
     - `/nguon/tan-tien-hy-di-tran-tien-sinh-tu-vi-dau-so-toan-thu`: đủ `10` dòng thông tin, nút `"Xem bản số hóa"` có `rel="noopener noreferrer nofollow"`, có JSON-LD `Book` đúng dữ liệu.
     - `/tu-dien`: đủ `6` thẻ mục từ điển đã có, `6` nhóm với `336` thuật ngữ (`15` liên kết `/tu-vi/sao/...`), JSON-LD `DefinedTermSet` đủ `336` `DefinedTerm`; thử lọc `"Tử Vi"` thu hẹp còn `1` mục.
     - `/kien-thuc`: hiện đủ `4` bài viết đã xuất bản.
     - `/bai-viet/huong-dan-doc-la-so-tu-vi-nam-phai-cho-nguoi-moi`: breadcrumb `Trang chủ / Kiến thức / ...`, dòng ngày `"Đăng 15/01/2026 · Cập nhật 22/11/2026"`, có `3` tiêu đề cấp 3 (`<h3>`) và danh sách (`<ul>`), JSON-LD `Article`.
     - `/lien-he` và 3 trang `/chinh-sach-*`: hiện đúng câu chỗ giữ quy định, có `noindex`.
   - **Duyệt ảnh chụp `1366` và `375`**: lượt chụp đầu phát hiện ô `"Tháng nhuận"` ở 3 dòng có ghi chú UTC+7 (1917, 1922, 1938) trên mobile `375px` bị chia cột hẹp do thẻ `<span>` và `<small>` đứng rời trong flex row của `.ck-bang-the td`. Đã bọc chung vào `<div className="ck-pp-thang-o">` kèm `text-align: right` ở `≤ 700px`; chạy lại `tsc`, 51/51 test, `verify-f5.mjs` và mở lại ảnh `ck-f5-thang-nhuan-375.png` xác nhận đã hiển thị gọn đẹp.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Cho phép cột `"Xem thêm"` trong `BangQuyUoc` liên kết tới các trang con `/phuong-phap/*` vừa dựng trong F5**:
   - *Lý do*: Trong `src/lib/trang/dieu-huong.ts`, `trangDaDung()` lấy từ `menuChinh()` và `chanTrang()`, hiện mới ở `DOT_DA_DUNG = 4` và danh sách chân trang F5 chỉ liệt kê `/phuong-phap` chứ không liệt kê 5 trang con `/phuong-phap/*`. Để cột `"Xem thêm"` trên `/phuong-phap`, `/phuong-phap/thang-nhuan`, `/phuong-phap/gio-ty` và `/phuong-phap/nam-phai-bac-phai` dẫn đúng sang các trang con `/phuong-phap/*` đã hoàn thiện trong đợt F5 (và tự ẩn nếu trùng trang đang xem), `BangQuyUoc.tsx` kiểm tra hợp giữa `trangDaDung()` và tập 6 đường dẫn `/phuong-phap*` vừa dựng.
2. **Thêm prop tùy chọn `breadcrumbRieng?: MatXich[]` trên `src/components/ck/KhungTrang.tsx`**:
   - *Lý do*: `src/lib/trang/dieu-huong.ts` thuộc vùng cấm, hiện chưa có ánh xạ `/bai-viet/...` → cha `/kien-thuc` trong `CHA_RIENG`. Truyền `breadcrumbRieng` từ `TrangBaiViet.tsx` giúp breadcrumb của `/bai-viet/[slug]` hiển thị đúng `Trang chủ › Kiến thức › bài` theo Lệnh 29 mà không chạm tới `src/lib/**`.
3. **Liên kết chéo giữa các trang nền F5**:
   - Các trang `/phuong-phap/thang-nhuan`, `/phuong-phap/gio-ty`, `/phuong-phap/nam-phai-bac-phai`, `/nguon/[slug]` và cuối bài viết có gắn liên kết tới các trang F5 khác đã dựng cùng đợt (`/phuong-phap`, `/phuong-phap/chuan-bien-tap`, `/nguon`, `/kien-thuc`), còn liên kết tới các trang F1–F4 (`/lich-am/doi-ngay`, `/tu-vi/lap-la-so`, `/bat-tu/lap-la-so`, `/tu-vi`) vẫn kiểm tra qua `trangDaDung()`.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Nâng `DOT_DA_DUNG = 5` trong `src/lib/trang/dieu-huong.ts`**: Để chân trang tự động mở 8 liên kết nền F5 (`/phuong-phap`, `/nguon`, `/tu-dien`, `/kien-thuc`, `/lien-he`, `/chinh-sach-bao-mat-va-cookies`, `/chinh-sach-su-dung-va-khieu-nai`, `/chinh-sach-ban-quyen`) và bổ sung `TEN_DOAN` trong `dieu-huong.ts` cho 5 trang con `/phuong-phap/*` nếu cần dùng lại ở nơi khác.
- **Xuất bản `NoiDung` và chuyển trạng thái `SeoTrang` cho cụm F5**:
  - Toàn bộ 6 trang `/phuong-phap*`, `/nguon`, `/nguon/{slug-sach}`, `/tu-dien` hiện ở `SeoTrang.trangThai = NHAP` và chưa có `NoiDung` ở trạng thái `DA_XUAT_BAN`. Khi biên tập viên bổ sung nội dung và xuất bản, các khối `<KhoiDienGiai />` sẽ tự hiện bài và cho phép index.
  - Bốn bài viết hiện tại ở `/bai-viet/*` đã có `NoiDung` ở trạng thái `DA_XUAT_BAN` nhưng các dòng `SeoTrang` tương ứng đang đặt `noindex = true` (và thiếu `NoiDungTrichDan`, nên mục `"Nguồn"` cuối bài chưa hiện); cần rà lại cấu hình `SeoTrang` / chuyển hướng 301 sang `/kien-thuc/*` theo kế hoạch SEO.
- **Rà soát pháp lý và nội dung 4 trang `/lien-he` & `/chinh-sach-*`**: Hiện đang ở `NHAP` / chưa có `NoiDung` xuất bản, giữ nguyên trạng thái `noindex, follow` và câu chỗ giữ chờ biên tập/luật sư duyệt trước khi đăng.

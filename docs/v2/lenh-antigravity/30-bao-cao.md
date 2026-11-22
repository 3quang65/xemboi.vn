# Báo cáo Lệnh 30: Đưa `/tu-vi-2027` vào khung v2

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/tu-vi-2027/layout.tsx` (`191` byte) — Layout cụm route `/tu-vi-2027` trong nhóm `(v2)`, nạp `./r1-nen.css` và `./r1.css` theo quy định CSS của các lệnh trước.
- `src/app/(v2)/tu-vi-2027/page.tsx` (`1.192` byte) — Route `/tu-vi-2027` trong `(v2)`: `generateMetadata()` dùng `metaTrang('/tu-vi-2027', { title: R1_COPY.tieuDeTrang, description: R1_COPY.moTaMeta, h1: R1_COPY.hero.tieuDe })`, gắn JSON-LD `BreadcrumbList` qua `schemaBreadcrumb(breadcrumb('/tu-vi-2027'))`, kèm `tt.schemaJsonLd` nếu `SeoTrang` có cấu hình, và render `<TrangR1Client trongKhungV2 />` dùng chung font `Alegreya` / `Be_Vietnam_Pro`, `DauTrang` và `ChanTrang` từ `src/app/(v2)/layout.tsx`.
- `src/app/(v2)/tu-vi-2027/r1-nen.css` (`307` byte) — Nền tối thiểu cho `.r1e` trong khung `(v2)` với `:where(.r1e)` cho `button, input, select, textarea` để không đè màu nút/ô nhập của `.r1e`.
- `src/app/(v2)/tu-vi-2027/r1.css` (`48.884` byte — ngoại lệ vượt 30 KB giữ nguyên theo Lệnh 30) — Phần CSS E3 (`.r1e`) chuyển từ `src/app/tu-vi-2027/r1.css`:
  - Đã xóa phần `.r1-root` (dành cho `/quan-tri/r1`), `body:has(.r1e)`, `.r1e main`, `.r1e footer`, cùng toàn bộ khối CSS không còn dùng (`.r1e-dai-tren*`, `.r1e-dau`, `.r1e-dau-in`, `.r1e-logo*`, `.r1e-tim*`, `.r1e-hoi-van`, `.r1e-menu*`, `.r1e-sap-co`, `.r1e-chan*`, `.r1e-chu-the`, `.r1e-cam` và các quy tắc `@media` tương ứng).
  - Nối biến font `--f-tieu` / `--f-chu` tới `--ck-font-tieu` / `--ck-font-chu` của `next/font` trong `(v2)/layout.tsx`, đổi `overflow-x: hidden` thành `overflow-x: clip`, chuyển `.r1e a` sang `:where(.r1e) a`, kiểu hóa breadcrumb `.r1e-vet ol li` phân cách bằng `›` trên nền tối, tăng `z-index` của `.r1e-modal-backdrop` lên `110` (nằm trên ngăn kéo mobile `.ck-ngan-keo` có `z-index: 100`), và nâng độ đặc hiệu `.ck .r1e ...` cho các nút/ô nhập/đầu mục (`.r1e-nut`, `.r1e-nut-son`, `.r1e-nut-vien`, `.r1e-nut-lon`, `.r1e-an`, `.r1e-chia`, `.r1e-to-giay input/select`, `.r1e-modal-close`, `.r1e-zoom-btn`, `.r1e-zoom-close`, `.r1e-ls-cong .r1e-nut`, `.r1e-dc.r1e-dc-soi`) để không bị `ck.css` và `ck-nen.css` ghi đè.
- `docs/v2/lenh-antigravity/30-bao-cao.md` — Báo cáo này.
- 7 ảnh chụp đối chiếu trước và sau trong `docs/v2/bang-chung/`:
  - `ck-r1-truoc-1366.png`, `ck-r1-truoc-375.png` (trước khi chuyển vào `(v2)`)
  - `ck-r1-sau-1366.png`, `ck-r1-sau-375.png` (sau khi đưa vào khung `(v2)`)
  - `ck-r1-laso-1366.png`, `ck-r1-laso-375.png` (lập lá số `15/8/1990, 10:00, nam`)
  - `ck-r1-hopthoai-1366.png` (mở `HopThoaiMua` từ nút 149k)

### Tệp chỉnh sửa
- `src/components/r1/TrangR1Client.tsx` — Bổ sung prop `trongKhungV2?: boolean`:
  - Khi `trongKhungV2 = true`: không render `<SvgSpriteE3 />` (tránh trùng SVG `<defs>` đã có ở `(v2)/layout.tsx`), không render `.r1e-dai-tren`, `header.r1e-dau` (logo, ô tìm minh họa, menu `MANG_SAP_CO`) và `footer.r1e-chan`; không tạo thẻ `<main>` thứ hai (dùng `React.Fragment` thay cho `'main'` để tránh `<main>` lồng nhau bên trong `<main id="noi-dung-chinh">` của `(v2)/layout.tsx`), đồng thời bỏ qua listener cuộn menu `capNhatMenuCuon`.
  - Đổi dòng `.r1e-vet` trong `#lap` sang `<nav aria-label="Đường dẫn" className="r1e-vet">` dùng `breadcrumb('/tu-vi-2027')` (`Trang chủ › Tử vi › Tử vi 2027`) và `trangDaDung()` để gắn `<Link>` cho mắt xích hợp lệ.
  - Giữ nguyên toàn bộ tranh đầu trang, form lập lá số, kết quả lá số, các khối nhận định/bản mẫu/bảng giá, `HopThoaiMua` và mọi sự kiện đo lường R1.
- `src/app/tu-vi-2027/r1.css` (`16.964` byte) — Cắt bỏ phần `.r1e` đã chuyển sang `src/app/(v2)/tu-vi-2027/r1.css`, tạm giữ lại duy nhất phần `.r1-root` để không làm gãy `import '@/app/tu-vi-2027/r1.css'` của `src/app/quan-tri/(khu)/r1/page.tsx` (thuộc vùng cấm sửa).

### Tệp đã xóa
- `src/app/tu-vi-2027/page.tsx` — Gỡ route `/tu-vi-2027` cũ để không trùng đường dẫn với `src/app/(v2)/tu-vi-2027/page.tsx`.
- `src/app/tu-vi-2027/r1-nen.css` — Không còn dùng ở thư mục cũ.

### Xác nhận vùng cấm
- Không sửa `src/components/r1/LaSo12Cung.tsx`, `src/components/r1/HopThoaiMua.tsx`, `src/components/r1/QuanTriR1Client.tsx`.
- Không sửa `src/app/(v2)/ck.css`, `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `package.json`.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, thoát mã `0` (0 lỗi).
2. **Kiểm tra unit test (`tests/trang/*.test.mjs` và `tests/r1/*.test.mjs`)**:
   - `tests/trang/*.test.mjs`: Đạt `51/51` bài test qua, 0 thất bại.
   - `tests/r1/*.test.mjs`: Đạt `15/15` bài test qua, 0 thất bại (bao gồm cả `tu-cam-va-cau-chu.test.mjs` và `r4-an-nut-149k.test.mjs`).
3. **Kiểm tra HTML thô & SEO (`http://localhost:3047/tu-vi-2027` và `/quan-tri/r1`)**:
   - `GET /tu-vi-2027` trả **HTTP 200**.
   - `<title>`: `Lập lá số Tử Vi 2027 minh bạch — rõ căn cứ sao và cung` (dùng `title.absolute` từ `metaTrang`).
   - `<link rel="canonical">`: `https://xemboi.vn/tu-vi-2027`.
   - `<meta name="robots">`: `index, follow` (theo bản ghi `SeoTrang` `/tu-vi-2027` đang ở `XUAT_BAN`, `noindex: false`).
   - JSON-LD `BreadcrumbList`: đủ 3 `ListItem` (`Trang chủ` → `Tử vi` → `Tử vi 2027`).
   - `GET /quan-tri/r1` (không theo redirect): trả **HTTP 307** về `/quan-tri/dang-nhap`, không gặp lỗi 500 hay lỗi nạp CSS.
4. **Kiểm tra trình duyệt thực tế (`http://localhost:3047/tu-vi-2027`, Chromium qua `playwright-core`)**:
   - **Khung v2 & cô lập DOM**: có `.ck`, `header.ck-dau`, `footer.ck-chan`, mục `Tử vi` trên menu v2 đang chọn (`.ck-on`); đúng `1` thẻ `<main>`; `0` `.r1e-dai-tren`, `0` `header.r1e-dau`, `0` `nav.r1e-menu`, `0` `footer.r1e-chan`; `0` chữ `"Sắp có"` trên menu và chân trang v2; đúng `1` `#r1e-vl` trong DOM (không trùng SVG sprite).
   - **Font & nút bấm**: `h1` dùng `Alegreya`, nút `"Lập lá số miễn phí"` giữ nền đỏ sơn mài (`54px`), nút mua 149k giữ nền vàng lá chữ nâu tối, nút mua 79k giữ nền trong suốt viền/chữ vàng. Breadcrumb `.r1e-vet` hiển thị `Trang chủ › Tử vi › Tử vi 2027` với liên kết `/` và `/tu-vi` màu sáng (`rgb(217, 201, 166)`) trên nền tối.
   - **Kiểm tra liên kết nội bộ**: quét `33` đường dẫn nội bộ duy nhất trên `/tu-vi-2027` → `0` liên kết lỗi (`errors: []`, không có 404).
   - **Lập lá số `15/8/1990, 10:00, nam`**:
     - Ra đúng lưới lá số 12 cung 4×4: cung Mệnh tại `M.Dần` (`data-chi="2"`), `MỆNH`, chính tinh `VŨ KHÚC (V)` và `THIÊN TƯỚNG (M)`; khối `#nhan-dinh` hiện `4` mục có căn cứ và nút `"Soi căn cứ trên lá số"` làm sáng `2` ô cung `.r1e-soi`.
     - Bấm nút mua 149k (`[data-testid="btn-mua-149"]`) và nút mua 79k (`[data-testid="btn-mua-79"]`) đều mở `HopThoaiMua` (`role="dialog"`) hiển thị nguyên văn thông báo trung thực, đóng được bằng nút `×` và phím `Esc`.
     - Chọn `"Chưa rõ giờ sinh"` và lập lại: nút 149k biến mất, `[data-testid="ghi-chu-an-149"]` hiển thị đúng quy tắc R4.
   - **Tràn ngang & lỗi**:
     - Desktop `1366px`: `scrollWidth = 1366`, `innerWidth = 1366` (cả trước và sau lập lá số).
     - Mobile `375px`: `scrollWidth = 375`, `innerWidth = 375` (cả trước và sau lập lá số; khối `.r1e-ds-cung` hiển thị đầy đủ ở mobile).
     - **0 lỗi console** (`[]`), **0 `pageerror`** (`[]`), **0 phản hồi HTTP ≥ 400** (`[]`).
5. **Đối chiếu ảnh trước và sau (`1366` và `375`)**:
   - Đã mở kiểm tra bằng mắt cả 7 ảnh (`ck-r1-truoc-1366.png`, `ck-r1-sau-1366.png`, `ck-r1-truoc-375.png`, `ck-r1-sau-375.png`, `ck-r1-laso-1366.png`, `ck-r1-laso-375.png`, `ck-r1-hopthoai-1366.png`): đầu trang và thanh menu v2 đồng bộ, không còn ô tìm minh họa và nhãn `"Sắp có"`, chân trang v2 thay cho chân trang R1 cũ, toàn bộ phần nội dung từ tranh đầu trang đến bảng giá và hộp thoại mua giữ nguyên thẩm mỹ E3.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Giữ lại tạm `src/app/tu-vi-2027/r1.css` (chỉ còn phần `.r1-root` `16.964` byte) thay vì xóa cả thư mục `src/app/tu-vi-2027/`**:
   - *Lý do*: `src/app/quan-tri/(khu)/r1/page.tsx` đang có `import '@/app/tu-vi-2027/r1.css'`, và `src/app/quan-tri/**` nằm trong danh sách **không được sửa** ở Lệnh 30. Đã xóa `page.tsx` và `r1-nen.css` trong `src/app/tu-vi-2027/` để loại bỏ hoàn toàn route cũ, đồng thời giữ lại phần `.r1-root` trong `src/app/tu-vi-2027/r1.css` để `/quan-tri/r1` không bị lỗi `Module not found`.
2. **Bổ sung bộ chọn `.ck .r1e ...` trong `src/app/(v2)/tu-vi-2027/r1.css` và `React.Fragment` cho `<main>` + ẩn `<SvgSpriteE3 />` khi `trongKhungV2 = true`**:
   - *Lý do*: Khi đặt `/tu-vi-2027` vào `src/app/(v2)/layout.tsx`, trang kế thừa `ck-nen.css`, `ck.css`, `<SvgSpriteE3 />` và `<main id="noi-dung-chinh">`. Bỏ `<SvgSpriteE3 />` và `<main>` trùng giúp DOM chuẩn ngữ nghĩa và không trùng ID SVG; nâng độ đặc hiệu `.ck .r1e ...` giúp nút bấm và ô nhập trong `r1.css` không bị `.ck .r1e-nut` / `.ck button` trong `ck.css` và `ck-nen.css` (thuộc vùng không sửa) ghi đè.

## 4. Dữ liệu / việc cần Claude Code bổ sung

- **Dọn nốt CSS quản trị R1 khỏi `src/app/tu-vi-2027/`**: Di chuyển phần `.r1-root` từ `src/app/tu-vi-2027/r1.css` vào `src/app/quan-tri/(khu)/r1/r1-quan-tri.css` (hoặc `quan-tri.css`), cập nhật import ở `src/app/quan-tri/(khu)/r1/page.tsx` rồi xóa hẳn thư mục `src/app/tu-vi-2027/`.
- **Ghi chú CSS chân trang dùng chung trong `src/app/(v2)/ck.css`** *(phát hiện khi đối chiếu ảnh `ck-r1-sau-1366.png` và `ck-f5-phuong-phap-1366.png`)*: Quy tắc `.ck-chan-in` ở `src/app/(v2)/ck.css` dòng `2122` đang viết `grid-template-columns: 1.3fr repeat(auto-fit, minmax(180px, 1fr))` — trong CSS Grid không cho phép ghép `1.3fr` cùng `repeat(auto-fit, ...)`, nên Chromium bỏ qua thuộc tính này và xếp toàn bộ cột chân trang thành 1 cột dọc trên desktop (không sửa ở lệnh này vì `ck.css` ngoài phạm vi).
- **Rà lại `SeoTrang.metaDescription` của `/tu-vi-2027`**: Bản ghi `SeoTrang` hiện tại có `metaDescription` là `"Lập lá số và xem vận năm 2027 (Đinh Mùi) theo ngày giờ sinh. Mỗi nhận định ghi rõ sao, cung và sách. Không phán chung theo năm sinh."` (khác với `R1_COPY.moTaMeta` dự phòng). Nếu muốn giữ nguyên mô tả từ `R1_COPY`, cập nhật trực tiếp bản ghi `SeoTrang` trong quản trị SEO.

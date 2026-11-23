# Báo cáo Lệnh 36: Cụm `/chiem-tinh` (hub, 12 cung hoàng đạo + tra cung, 12 trang cung)

Ngày hoàn thành: 23/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/chiem-tinh/layout.tsx` (`215` byte) — Nạp `@/components/ck/tu-dien.css` và `./chiem-tinh.css` cho toàn bộ cụm `/chiem-tinh`.
- `src/app/(v2)/chiem-tinh/chiem-tinh.css` (`11.691` byte ≤ `30.720` byte / 30 KB) — Tạo kiểu tiền tố `.ck-ct-*` dùng biến `--ck-*` của `ck.css`: giữ phong cách cổ điển nền ngà – viền đồng – chữ son/nâu, bổ sung kiểu input `date`/`time` trong `.ck-to-giay`, sửa màu chữ nút gửi (`.ck button.ck-ct-nut-chinh { color: #FBF1DA; }`), giữ glyph cung ở dạng chữ serif (`font-variant-emoji: text;`), khung vòng tròn SVG 12 cung, thẻ chuyển cung nổi bật, bảng responsive `≤ 760px` và `≤ 700px`. Không dùng ảnh nền vũ trụ, tinh vân, ánh sáng huyền bí hay emoji.
- `src/app/(v2)/chiem-tinh/ChiemTinhHelpers.ts` (`6.366` byte) — Chỉ dùng ở server; khai báo hằng số SEO mặc định khớp `docs/v2/16-seo-trang.csv` (`MAC_DINH_HUB`, `MAC_DINH_CUNG_HOANG_DAO`, `macDinhCung`), `docGio`, `kiemCoThamSo`, `formatKhoangNamNay` (`khoangCungTrongNam`), `thamSoSeoCung`, `trichChoHam`, nhãn kèm tiếng Anh (`nhanLoai`, `nhanAmDuong`, `nhanHanhTinh`), và bộ sinh JSON-LD (`serializeJsonLd` escape `<` thành `\u003c`, `CollectionPage`, `WebApplication`, `DefinedTermSet`, `DefinedTerm`, `WebPage`).
- `src/app/(v2)/chiem-tinh/ChiemTinhUi.tsx` (`8.930` byte) — Các component server dùng chung: `TrichTetrabiblos` (`<blockquote lang="en">` kèm `viTriTrich` ngay dưới, không dịch), `KhoiGhiChuTinhCach` (`GHI_CHU_TINH_CACH`), `KhoiGhiChuHoangDao` (`GHI_CHU_HOANG_DAO`), `KhoiNguonVaGioiHan` (`NGUON_TETRABIBLOS.ghiCong` gắn liên kết `NGUON_TETRABIBLOS.url`, `NGUON_TETRABIBLOS.ghiChuTrich`, `GIOI_HAN`), `Thanh12Cung`, và `Vong12CungSvg` (SVG 12 ô 30°, Bạch Dương bắt đầu ở vị trí 9 giờ đi ngược chiều kim đồng hồ, ký hiệu `kyHieu` + tên Việt bấm sang trang cung, vành trong ghi 4 mốc Xuân phân/Hạ chí/Thu phân/Đông chí kèm ngày giờ VN năm nay từ `mocVaoCung(namNay)` chỉ số 0, 3, 6, 9 và lưới 4 thẻ giờ đầy đủ ngay dưới).
- `src/app/(v2)/chiem-tinh/page.tsx` (`10.472` byte) — Hub `/chiem-tinh` (`export const revalidate = 3600`, Server Component): `metaTrang`, JSON-LD `CollectionPage`, thẻ lớn **Tra cung hoàng đạo** kèm form GET ngày/giờ sinh trỏ `/chiem-tinh/cung-hoang-dao`, `<Vong12CungSvg />`, 4 khối nhóm theo *Tetrabiblos* (Chí/Phân/Cố định/Song thể; Dương/Âm; 4 tam hợp kèm chủ ngày/đêm & phương; bảng 7 hành tinh → cung chủ nhà kèm câu trích từng hành tinh), `GHI_CHU_HOANG_DAO`, `KhoiDienGiai` với `noiDungTheoDuongDan('/chiem-tinh')` chỉ hiện khi có bài xuất bản, và `KhoiNguonVaGioiHan`.
- `src/app/(v2)/chiem-tinh/cung-hoang-dao/page.tsx` (`11.551` byte) — Trang `/chiem-tinh/cung-hoang-dao` (`export const revalidate = 3600`, Server Component): `generateMetadata` đặt canonical sạch và `robots: { index: false, follow: true }` khi URL có tham số; JSON-LD `WebApplication` + `DefinedTermSet` (12 cung); form GET `ngay` (`min="1900-01-01" max="2100-12-31"`, đọc bằng `docNgay` từ `than-so-hoc.ts`) và `gio` không bắt buộc (báo lỗi ngay trong form khi ngày/giờ sai hoặc chỉ nhập giờ mà thiếu ngày); kết quả tra cung (thẻ lớn ký hiệu/tên/kinh độ 2 chữ số lẻ, khối nổi bật khi `chuyen` khác null kèm nhắc nhập giờ sinh nếu `!coGio`, và `GHI_CHU_TINH_CACH`); bảng 12 cung luôn hiện (ký hiệu, tên Việt + `tenKhac`, tiếng Anh, khoảng ngày giờ VN năm nay, chủ nhà, tam hợp); câu giải thích xê dịch 1–2 ngày; `GHI_CHU_HOANG_DAO`; liên kết hub; `KhoiNguonVaGioiHan`.
- `src/app/(v2)/chiem-tinh/cung-hoang-dao/[cung]/page.tsx` (`13.438` byte) — 12 trang cung (`generateStaticParams` từ `CUNG_HOANG_DAO`, `cungTheoSlug` undefined → `notFound()`, `export const revalidate = 3600`): `metaTrang` với mẫu `/chiem-tinh/cung-hoang-dao/{cung}` và `thamSo` (`khoang` tính theo `khoangCungTrongNam(thu, namNay)` dạng `d/m – d/m`), `tenCuoi = "Cung {ten}"`, JSON-LD `DefinedTerm` + `WebPage`, đầu trang (ký hiệu lớn, tên Việt/khác/Anh/Latinh, khoảng `tuDo°` → `tuDo + 30°`), mục Ngày Mặt Trời ở cung (năm nay & năm sau, bảng 11 năm `namNay − 5` đến `namNay + 5`, câu `khoangNgayVaoCung`, liên kết công cụ tra cung), bảng Theo Tetrabiblos (nhóm + `trichLoai`, Dương/Âm, chủ nhà + cung còn lại + `trichNha`, tam hợp 3 cung + chủ ngày/đêm + phương + `trich`, vượng/hãm với `trichVuong` và tra `vuong === ham` cho cung hãm không trùng lặp, cung đối), `GHI_CHU_TINH_CACH`, thanh 12 cung chuyển nhanh, liên kết hub/bảng 12 cung, và `KhoiNguonVaGioiHan`.
- `docs/v2/lenh-antigravity/36-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`8` ảnh):
  - `ck-chiem-tinh-hub-1366.png` (`1.445.376` byte), `ck-chiem-tinh-hub-375.png` (`1.164.634` byte)
  - `ck-chiem-tinh-cung-hoang-dao-1366.png` (`1.130.063` byte), `ck-chiem-tinh-cung-hoang-dao-375.png` (`900.688` byte) — chụp trạng thái `?ngay=2026-03-20` có khối chuyển cung
  - `ck-chiem-tinh-bo-cap-1366.png` (`1.089.269` byte), `ck-chiem-tinh-bo-cap-375.png` (`807.754` byte)
  - `ck-chiem-tinh-ma-ket-1366.png` (`1.113.707` byte), `ck-chiem-tinh-ma-ket-375.png` (`824.361` byte)

### Tệp chỉnh sửa
- Không có (chỉ tạo mới cụm `src/app/(v2)/chiem-tinh/**`, ảnh bằng chứng và báo cáo này).

### Tệp xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `package.json`, `tests/**`.
- Toàn bộ tệp trong `src/app/(v2)/chiem-tinh/**` chỉ chạy ở server (0 `'use client'`).
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, mã thoát `0` (`TSC_EXIT=0`, 0 lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test --test-concurrency=2 tests/trang/*.test.mjs`)**:
   - Đạt, mã thoát `0` (`TEST_EXIT=0`): `112/112` bài test qua, `0` thất bại, gồm đủ `5/5` bài trong `tests/trang/chiem-tinh.test.mjs` và toàn bộ `tests/trang/meta-dieu-huong.test.mjs`.
3. **Kiểm tra dung lượng CSS & tự rà nội dung cấm**:
   - `src/app/(v2)/chiem-tinh/chiem-tinh.css`: `11.691` byte (≤ `30.720` byte / 30 KB).
   - Quét toàn bộ mã nguồn `src/app/(v2)/chiem-tinh/**`: **0** `'use client'`, **0** biến v1 (`--paper`, `--bg`, `--ink`), **0** liên kết tới `/chiem-tinh/ban-do-sao`, `/chiem-tinh/ban-do-sao-doi`, `/chiem-tinh/hanh-tinh/*`, `/chiem-tinh/nha/*`, **0** từ/đoạn tả tính cách, điểm mạnh yếu, nghề hợp, tình yêu, hợp cung, xếp hạng, nguyên tố Lửa/Đất/Khí/Nước, màu/đá/số may mắn, thần thoại, hay bản dịch câu trích tiếng Anh.
   - Mọi câu trích *Tetrabiblos* đều đặt nguyên văn tiếng Anh trong `<blockquote lang="en">` kèm `viTriTrich(t)` ngay dưới và không kèm bản dịch. Chỗ kết quả tra cung và trang cung đều hiển thị nguyên văn `GHI_CHU_TINH_CACH`; cuối mọi trang đều có `NGUON_TETRABIBLOS.ghiCong` (gắn link `url`), `NGUON_TETRABIBLOS.ghiChuTrich` và `GIOI_HAN`.
4. **Kiểm tra HTTP, SEO, đối chiếu dữ liệu, menu `"Thêm"` và trình duyệt (`http://127.0.0.1:3049`, Chromium via `playwright-core`)**:
   - **18/18 URL hợp lệ trả HTTP 200**: `/chiem-tinh`, `/chiem-tinh/cung-hoang-dao`, `?ngay=1990-08-15`, `?ngay=2000-01-01`, `?ngay=2026-03-20`, `?ngay=2026-03-20&gio=23:30`, và đủ 12 trang cung (`bach-duong`, `kim-nguu`, `song-tu`, `cu-giai`, `su-tu`, `xu-nu`, `thien-binh`, `bo-cap`, `nhan-ma`, `ma-ket`, `bao-binh`, `song-ngu`).
   - **HTTP 404**: `/chiem-tinh/cung-hoang-dao/abc` trả `404`.
   - **Báo lỗi trong form (HTTP 200 + `[role="alert"]`)**: `?ngay=abc`, `?ngay=2023-02-29`, `?gio=25:00`, và `?ngay=1990-08-15&gio=25:00` đều trả `200` và hiện thông báo lỗi hợp lệ trong form.
   - **SEO & JSON-LD**: `0` trang còn `{...}` trong `<title>` hay `<h1>`; các URL có tham số (`?ngay=...`, `?ngay=...&gio=...`) trả `canonical` sạch `https://xemboi.vn/chiem-tinh/cung-hoang-dao` và `robots="noindex, follow"`; JSON-LD khớp từng loại (`CollectionPage`, `WebApplication` + `DefinedTermSet` 12 cung, `DefinedTerm` + `WebPage`, kèm `BreadcrumbList` từ `KhungTrang`).
   - **Đối chiếu dữ liệu**:
     - `15/08/1990` → `Cung Sư Tử (Leo)`; `01/01/2000` → `Cung Ma Kết (Capricorn)`;
     - `20/03/2026` (không giờ, mặc định 12:00) → `Cung Song Ngư (Pisces)`, `359.60°`, hiện khối chuyển cung `"Ngày 20/03/2026 Mặt Trời chuyển từ Song Ngư sang Bạch Dương lúc 21:45 giờ Việt Nam"`, `"Sinh trước giờ này là Song Ngư, từ giờ này là Bạch Dương"`, kèm lời nhắc nhập giờ sinh;
     - `20/03/2026 23:30` → `Cung Bạch Dương (Aries)`, `0.07°`, khối chuyển cung `21:45 giờ Việt Nam`, không hiện lời nhắc thiếu giờ;
     - Bọ Cạp → chủ nhà `Sao Hỏa (Mars)` (cùng `Bạch Dương (Aries)`), `Tam hợp thứ 4` (`Cự Giải`, `Bọ Cạp`, `Song Ngư`), `Cung hãm của Mặt Trăng (Moon)` (1 câu trích *Tetrabiblos* ch. XXII của Mặt Trăng), cung đối `Cung Kim Ngưu (Taurus)`;
     - Ma Kết → `Chí (tropical)`, `Âm (feminine, nocturnal)`, chủ nhà `Sao Thổ (Saturn)` (cùng `Bảo Bình (Aquarius)`), `Cung vượng của Sao Hỏa (Mars)` + `Cung hãm của Sao Mộc (Jupiter)` (hiện đủ cả 2 câu trích `vuongHoa` và `vuongMoc`).
   - **Console, tràn ngang, liên kết nội bộ, menu `"Thêm"` và duyệt ảnh chụp**:
     - `0` lỗi console, `0` `pageerror`, `0` response lỗi trên toàn bộ 18 URL hợp lệ ở cả `1366px` và `375px`.
     - `0` tràn ngang (`scrollWidth <= clientWidth`) ở cả `1366px` và `375px`.
     - Quét `17` liên kết nội bộ duy nhất trong `<main>` trên cụm `/chiem-tinh`: tất cả trả `200`, `0` liên kết lỗi.
     - Menu `"Thêm"` trên desktop mở được qua click, có `ck-on` ở cụm `/chiem-tinh`, hiển thị `"Chiêm tinh"` (`/chiem-tinh`) và `"12 cung hoàng đạo"` (`/chiem-tinh/cung-hoang-dao`).
     - Duyệt bằng mắt toàn bộ `8` ảnh chụp `ck-chiem-tinh-*.png`: vòng 1 gặp 1 cảnh báo hydration React 19 ở thẻ `<title>` bên trong `<svg>`, lỗi chunk dev do `.next` cũ, chữ `Bạch Dương`/`Thiên Bình` hơi sát ký hiệu trên vòng tròn SVG và bảng `Theo Tetrabiblos` trên mobile 375px lặp nhãn cột; đã sửa gọn SVG (`aria-label` và xếp ký hiệu/tên đồng tâm tại bán kính giữa mỗi cung), xóa cache `.next`, chỉnh CSS mobile cho `.ck-ct-thuoc-tinh` và `.ck-ct-gio-dong`, chạy lại toàn bộ `tsc`, `112/112` unit test, kiểm tra trình duyệt và chụp lại 8 ảnh mới xác nhận sạch, rõ, ký hiệu cung vẽ dạng chữ serif không thành emoji.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Không lặp `BreadcrumbList` trong `<script type="application/ld+json">` của từng `page.tsx`**:
   - *Lý do*: `KhungTrang` (`src/components/ck/Breadcrumb.tsx`) đã tự xuất `BreadcrumbList` từ `schemaBreadcrumb(breadcrumb(duongDan, tenCuoi))`. Chỉ xuất schema riêng của trang tại `page.tsx` để tránh trùng lặp.
2. **Dùng `aria-label` trên `<svg role="img">` thay cho `<title>`/`<desc>` lồng trong `<svg>` ở `Vong12CungSvg`, kèm 4 ô ngày giờ đầy đủ ngay dưới vòng tròn**:
   - *Lý do*: Trong React 19 SSR, `<title>` có biểu thức động bên trong `<svg>` gây hydration mismatch ở trình duyệt; chuyển sang `aria-label` triệt tiêu lỗi hydration mà vẫn giữ đủ ngữ nghĩa cho trình đọc màn hình, đồng thời 4 ô chú giải dưới hình giúp người dùng 375px đọc rõ ngày giờ đầy đủ của 4 điểm phân/chí.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Trạng thái `SeoTrang` cụm `/chiem-tinh`**: hiện 3 bản ghi đã dựng (`/chiem-tinh`, `/chiem-tinh/cung-hoang-dao`, `/chiem-tinh/cung-hoang-dao/{cung}`) trong bảng `SeoTrang` đều đang ở `trangThai: "NHAP"` (`noindex, follow`). Khi nghiệm thu xong cần chuyển sang `"XUAT_BAN"`.
- **Nội dung biên tập (`NoiDung`) cho `/chiem-tinh`**: hub đã gắn `KhoiDienGiai` với `noiDungTheoDuongDan('/chiem-tinh')` và chỉ hiển thị khi có bài đã xuất bản; hiện chưa có bài xuất bản nên khối này đang ẩn theo đúng lệnh.
- **Các trang P2/P3 chưa dựng theo lệnh**: `/chiem-tinh/ban-do-sao` (chờ giấy phép ephemeris), `/chiem-tinh/ban-do-sao-doi`, `/chiem-tinh/hanh-tinh/*`, `/chiem-tinh/nha/*` hiện không gắn liên kết ở cụm này.

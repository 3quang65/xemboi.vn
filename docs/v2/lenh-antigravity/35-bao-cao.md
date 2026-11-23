# Báo cáo Lệnh 35: Cụm `/than-so-hoc` (25 trang) và nút `"Thêm"` ở menu desktop

Ngày hoàn thành: 23/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/than-so-hoc/layout.tsx` (`216` byte) — Nạp `@/components/ck/tu-dien.css` và `./than-so-hoc.css` cho toàn bộ cụm `/than-so-hoc`.
- `src/app/(v2)/than-so-hoc/than-so-hoc.css` (`17.359` byte ≤ `30.720` byte / 30 KB) — Tạo kiểu tiền tố `.ck-tsh-*` dùng biến `--ck-*` của `ck.css`: phong cách Á Đông cổ điển với triện số lớn font serif `--ck-f-tieu`, bổ sung kiểu cho `.ck-to-giay input[type="date"]`, khắc phục độ tương phản chữ nút gửi form (`.ck button.ck-tsh-nut-chinh { color: #FBF1DA; }`), lưới 3 × 3 kèm vạch SVG đường đủ (nét liền) / đường trống (nét đứt), thẻ chữ cái theo tên và responsive `≤ 1000px`, `≤ 700px`. Không hình vũ trụ, hành tinh hay ánh sáng huyền bí.
- `src/app/(v2)/than-so-hoc/ThanSoHocHelpers.ts` (`6.486` byte) — Hằng số SEO mặc định khớp `docs/v2/16-seo-trang.csv` (`MAC_DINH_HUB`, `MAC_DINH_SO_CHU_DAO`, `MAC_DINH_BIEU_DO`, `MAC_DINH_THEO_TEN`, `macDinhSoChuDao`, `macDinhNamCaNhan`), xử lý `searchParams`, cache `layThongKeSoChuDao()` (1930–2030), hàm định dạng (`dinhDangSo`, `dinhDangTiLe`, `dinhDangBuoc`, `dinhDangBuocPhan`, `laSoMaster`, `laSoChuDaoHopLe`), và bộ sinh JSON-LD (`serializeJsonLd` escape `<` thành `\u003c`, `taoSchemaCollectionPage`, `taoSchemaWebApplication`, `taoSchemaDefinedTermSoChuDao`, `taoSchemaDefinedTermNamCaNhan`, `taoSchemaWebPage`).
- `src/app/(v2)/than-so-hoc/ThanSoHocUi.tsx` (`10.577` byte) — Thành phần dùng chung (an toàn cho cả server và client): `KhoiGhiChuYNghia` (hiển thị nguyên văn `GHI_CHU_Y_NGHIA`), `KhoiGioiHan` (hiển thị nguyên văn `GIOI_HAN`), `GhiChuNgayDuong` (gắn `/lich-am/doi-ngay`), `BangChuPythagoras` (bảng 9 cột `BANG_CHU`), `DanhSachQuyUoc` (`QUY_UOC`), `ThanhSoChuDao`, `ThanhNamCaNhan`, `LuoiBieuDoNgaySinh` (lưới 3 × 3 `LUOI`, ô trống để trống có viền mờ, tô đường đủ/trống bằng SVG + chú thích chữ, đếm số 0 và số thiếu), `KetQuaTenHienThi` (từng chữ cái gốc/bỏ dấu/số, tô khác nguyên âm kèm nhãn `"nguyên âm"`, 3 chỉ số tên/linh hồn/nhân cách).
- `src/app/(v2)/than-so-hoc/page.tsx` (`7.463` byte) — Hub `/than-so-hoc` (`export const revalidate = 3600`): `metaTrang`, JSON-LD `CollectionPage`, 3 thẻ công cụ, form ngày sinh nhỏ trỏ `/than-so-hoc/so-chu-dao`, lưới 12 số chủ đạo tách nhóm `"Số giữ nguyên"` (11, 22, 33) kèm tỉ lệ 1930–2030 theo cách 1, hàng 9 ô năm cá nhân, tóm tắt cách tính 3 dòng + bảng `BANG_CHU`, danh sách `QUY_UOC`, `KhoiDienGiai` chỉ hiện khi có bài xuất bản, cuối trang `GIOI_HAN`.
- `src/app/(v2)/than-so-hoc/so-chu-dao/page.tsx` (`11.877` byte) — Công cụ `/than-so-hoc/so-chu-dao` (`export const revalidate = 3600`): `generateMetadata` đặt canonical sạch và `robots: { index: false, follow: true }` khi có tham số; JSON-LD `WebApplication`; form GET `<input type="date" name="ngay" min="1900-01-01" max="2100-12-31">` báo lỗi trong form khi sai; kết quả thẻ lớn số chủ đạo, Cách 1 (cộng dồn), Cách 2 (rút từng phần ngày/tháng/năm), dòng đối chiếu `"Hai cách cho kết quả khác nhau..."` / `"Hai cách cùng ra..."`, năm cá nhân năm nay & năm sau (`ngayHienTaiVN().nam`), liên kết `/than-so-hoc/bieu-do-ngay-sinh?ngay=...`, `GHI_CHU_Y_NGHIA`, phần Cách tính luôn hiện với ví dụ cố định `15/08/1990` + `QUY_UOC`, thanh 12 số và `GIOI_HAN`.
- `src/app/(v2)/than-so-hoc/so-chu-dao/[so]/page.tsx` (`8.283` byte) — 12 trang số chủ đạo tĩnh (`generateStaticParams` từ `SO_CHU_DAO`, `soTuSlug` undefined → `notFound()`, `export const revalidate = 3600`): `metaTrang` với `/than-so-hoc/so-chu-dao/{n}`, JSON-LD `DefinedTerm` + `WebPage`, đầu trang số lớn serif (thêm `"Số giữ nguyên, không rút về {soGoc}"` cho 11, 22, 33), khối tổng dẫn tới (`tongDanToi`, ghi chú thêm ở 2, 4, 6), ví dụ ngày sinh năm 1990 và 2000 (`viDuNgay`) kèm phép cộng cách 1 và liên kết công cụ, thống kê 1930–2030 hai cách + dòng số ngày khác nhau, `GHI_CHU_Y_NGHIA`, thanh 12 số + liên kết, cuối trang `GIOI_HAN`.
- `src/app/(v2)/than-so-hoc/bieu-do-ngay-sinh/page.tsx` (`7.632` byte) — Công cụ `/than-so-hoc/bieu-do-ngay-sinh` (`export const revalidate = 3600`): `generateMetadata` xử lý canonical sạch và `robots: { index: false, follow: true }` khi có tham số; JSON-LD `WebApplication`; form GET ngày sinh dương lịch; lưới 3 × 3 kết quả + câu chú thích tên gọi `"mũi tên"` + bảng 4 đỉnh cao (`bonDinhCao`) + câu quy ước mốc tuổi + `GHI_CHU_Y_NGHIA`, phần Cách vẽ luôn hiện lưới mẫu `15/08/1990`, liên kết và `GIOI_HAN`.
- `src/app/(v2)/than-so-hoc/theo-ten/TinhTheoTenClient.tsx` (`2.453` byte) — Component `'use client'` tính theo họ tên hoàn toàn trên trình duyệt bằng `theoTen`: không đưa tên lên URL, không gửi request mạng, không ghi `localStorage`, cập nhật khi bấm `"Tính"` hoặc Enter, kèm câu `"Tên chỉ được tính trên máy bạn, không gửi đi."` và `GHI_CHU_Y_NGHIA`.
- `src/app/(v2)/than-so-hoc/theo-ten/page.tsx` (`2.461` byte) — Trang `/than-so-hoc/theo-ten` (`export const revalidate = 3600`): `metaTrang`, JSON-LD `WebApplication`, `<TinhTheoTenClient />`, phần server luôn hiện (`BANG_CHU`, câu quy ước tên tiếng Việt, ví dụ cố định `"Nguyễn Văn An"` tính sẵn bằng `theoTen`), liên kết và `GIOI_HAN`.
- `src/app/(v2)/than-so-hoc/nam-ca-nhan/[so]/page.tsx` (`5.895` byte) — 9 trang năm cá nhân (`generateStaticParams` từ `NAM_CA_NHAN`, `soTuSlug` undefined → `notFound()`, `export const revalidate = 3600`): `metaTrang` với `/than-so-hoc/nam-ca-nhan/{n}`, breadcrumb tự bỏ `/than-so-hoc/nam-ca-nhan` với `tenCuoi = "Năm cá nhân {n}"`, JSON-LD `DefinedTerm` + `WebPage`, đầu trang số lớn + cách tính + ví dụ ngày đầu tiên trong `ngayCoNamCaNhan(n, namNay)` kèm `phepCong`, hai bảng 12 tháng cho năm nay và năm sau (`ngayHienTaiVN().nam`), câu quy ước mốc 1/1 và ngày sinh nhật, `GHI_CHU_Y_NGHIA`, thanh 9 số + liên kết, cuối trang `GIOI_HAN`.
- `docs/v2/lenh-antigravity/35-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`15` ảnh):
  - `ck-than-so-hub-1366.png` (`1.086.441` byte), `ck-than-so-hub-375.png` (`741.446` byte)
  - `ck-than-so-so-chu-dao-1366.png` (`1.128.903` byte), `ck-than-so-so-chu-dao-375.png` (`733.873` byte)
  - `ck-than-so-so-7-1366.png` (`983.391` byte), `ck-than-so-so-7-375.png` (`638.268` byte)
  - `ck-than-so-so-33-1366.png` (`1.020.207` byte), `ck-than-so-so-33-375.png` (`659.469` byte)
  - `ck-than-so-bieu-do-1366.png` (`1.094.594` byte), `ck-than-so-bieu-do-375.png` (`715.789` byte)
  - `ck-than-so-theo-ten-1366.png` (`1.082.616` byte), `ck-than-so-theo-ten-375.png` (`723.456` byte)
  - `ck-than-so-nam-ca-nhan-5-1366.png` (`994.617` byte), `ck-than-so-nam-ca-nhan-5-375.png` (`633.530` byte)
  - `ck-than-so-menu-them-1366.png` (`434.308` byte)

### Tệp chỉnh sửa
- `src/components/ck/DauTrang.tsx` (`12.693` byte) — Menu desktop bỏ mục `"Trang chủ"`, gom mọi mục có `them === true` vào một nút cuối `"Thêm"` (hover, bấm, Esc trả focus, bấm ngoài, `aria-expanded`, `aria-haspopup`, `ck-on` khi đang ở hub/trang con trong nhóm, menu con hiện hub đậm + trang con thụt vào, ẩn nút `"Thêm"` nếu không có mục `them`). Ngăn kéo mobile giữ nguyên có `"Trang chủ"` và mọi mục kể cả `them`.
- `src/app/(v2)/ck-nen.css` (`1.697` byte < `3.072` byte / 3 KB) — Bổ sung kiểu nút `"Thêm"` và menu con canh phải `.ck-menu-con-phai` dùng bộ chọn `.ck-menu-ds .ck-menu-*` để thắng `.ck button` và các quy tắc nạp sau trong `ck.css`, đồng bộ `13.5px` ở `≤ 1240px`.

### Tệp xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css` (`60.691` byte giữ nguyên), `package.json`, `tests/**`.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, thoát mã `0` (`TSC_EXIT=0`, 0 lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test --test-concurrency=2 tests/trang/*.test.mjs`)**:
   - Đạt, thoát mã `0` (`TEST_EXIT=0`): `106/106` bài test qua, `0` thất bại (gồm đủ `9/9` bài trong `tests/trang/than-so-hoc.test.mjs` và toàn bộ `tests/trang/meta-dieu-huong.test.mjs`).
3. **Kiểm tra dung lượng CSS & rà nội dung cấm**:
   - `src/app/(v2)/than-so-hoc/than-so-hoc.css`: `17.359` byte (≤ 30 KB).
   - `src/app/(v2)/ck-nen.css`: `1.697` byte (< 3 KB).
   - `src/app/(v2)/ck.css`: giữ nguyên `60.691` byte.
   - Rà bằng lệnh tìm và đọc lại trực tiếp toàn bộ mã nguồn + ảnh chụp 25 trang: **0** biến v1 (`--paper`, `--bg`, `--ink`), **0** câu tự viết tả tính cách, điểm mạnh yếu, nghề hợp, tình duyên, ý nghĩa năm cá nhân, tên riêng "mũi tên", diễn giải đỉnh cao hay lịch sử/bách khoa Pythagoras. Mọi chỗ độc giả mong thấy ý nghĩa đều chỉ hiện nguyên văn `GHI_CHU_Y_NGHIA`; cuối mọi trang đều có `GIOI_HAN`.
4. **Kiểm tra HTTP, SEO, đối chiếu dữ liệu, menu `"Thêm"` và trình duyệt (`http://localhost:3048`, Chromium via `playwright-core`)**:
   - **29/29 đường dẫn hợp lệ trả HTTP 200**: `/than-so-hoc`, `/than-so-hoc/so-chu-dao`, `/than-so-hoc/so-chu-dao?ngay=1990-08-15`, `/than-so-hoc/so-chu-dao?ngay=2000-01-01`, đủ 12 trang `/than-so-hoc/so-chu-dao/{1..9,11,22,33}`, `/than-so-hoc/bieu-do-ngay-sinh`, `/than-so-hoc/bieu-do-ngay-sinh?ngay=1990-08-15`, `/than-so-hoc/bieu-do-ngay-sinh?ngay=2000-01-01`, `/than-so-hoc/theo-ten`, và đủ 9 trang `/than-so-hoc/nam-ca-nhan/{1..9}`.
   - **HTTP 404 đúng quy ước**: `/than-so-hoc/so-chu-dao/10`, `/than-so-hoc/so-chu-dao/07`, `/than-so-hoc/nam-ca-nhan/11` đều trả `404`.
   - **Lỗi ngày trả HTTP 200 + báo lỗi trong form**: `?ngay=2023-02-29` và `?ngay=abc` trên cả `/than-so-hoc/so-chu-dao` và `/than-so-hoc/bieu-do-ngay-sinh` đều trả `200` kèm khung `[role="alert"]`.
   - **Title, canonical, robots, JSON-LD**: 0 trang còn `{...}` trong `title` hay `h1`; các URL có `?ngay=...` trả `canonical` sạch và `robots="noindex, follow"`; JSON-LD khớp từng loại trang (`CollectionPage`, `WebApplication`, `DefinedTerm` + `WebPage`, kèm `BreadcrumbList` từ `KhungTrang`).
   - **Đối chiếu dữ liệu**:
     - `15/08/1990`: cách 1 `1 + 5 + 8 + 1 + 9 + 9 + 0 = 33`, `33 → giữ nguyên`; cách 2 `6`, `8`, `1`, `6 + 8 + 1 = 15 → 6`, hiện `"Hai cách cho kết quả khác nhau: 33 và 6"`; biểu đồ có `11`, `5`, `8`, `99`, `Số 0 xuất hiện 1 lần`, `Thiếu: 2, 3, 4, 6, 7`, đường đủ duy nhất là `Đường chéo 1-5-9 (1-5-9)` (vẽ 1 nét liền trên lưới); 4 đỉnh cao `5 (0–30)`, `7 (31–39)`, `3 (40–48)`, `9 (49 trở đi)`.
     - `04/07/1872`: xác nhận qua `tests/trang/than-so-hoc.test.mjs` (cách 1 ra `11`, cách 2 ra `2`; `docNgay` giới hạn 1900–2100 nên công cụ web từ chối năm 1872 theo đúng đặc tả).
     - `01/01/2000`: số chủ đạo `4` (`Hai cách cùng ra 4`), biểu đồ liệt kê `Hàng trên (3-6-9)` trong mục đường trống cả 3 số.
     - `"Nguyễn Thị Mỹ Đức"` trên `/than-so-hoc/theo-ten`: gửi form sinh **0** request mạng, URL giữ nguyên `http://localhost:3048/than-so-hoc/theo-ten`, `localStorage` trước và sau khi tính không thay đổi (chỉ có khóa `xb_vid` từ `TrackerComponent` của root layout, component theo tên không ghi dữ liệu nào), chuỗi bỏ dấu `NGUYENTHIMYDUC`, `6` nguyên âm `U Y E I Y U`, Linh hồn `3 + 7 + 5 + 9 + 7 + 3 = 34` → `7`, Chỉ số tên `72 → 9`, Nhân cách `38 → 11 → giữ nguyên`.
   - **Nghiệm thu menu `"Thêm"`**:
     - Desktop một hàng (`9` mục cùng `top: 142px`, `oneRow: true`, `hasTrangChu: false`, không tràn ngang) ở cả 5 độ rộng `1001`, `1240`, `1241`, `1366`, `1920` px.
     - Menu con `"Thêm"` khi mở không bị cắt mép phải ở tất cả 5 độ rộng (`right = 902 ≤ 1001`, `942 ≤ 1240`, `1145 ≤ 1241`, `1207 ≤ 1366`, `1484 ≤ 1920`).
     - Nút `"Thêm"` có `ck-on` trên `/than-so-hoc` và không có trên `/`.
     - Bàn phím: focus nút `"Thêm"`, nhấn `Enter` mở (`aria-expanded="true"`), nhấn `Escape` đóng (`aria-expanded="false"`).
     - Ngăn kéo mobile ở `375px` giữ nguyên `"Trang chủ"` và `"Thần số học"` (`43` liên kết).
   - **Console, tràn ngang, liên kết nội bộ và duyệt ảnh chụp**:
     - `0` `pageerror`, `0` phản hồi xấu ngoài 3 URL kiểm thử 404 chủ đích.
     - `0` tràn ngang (`scrollWidth === clientWidth`) ở cả `1366px` và `375px` trên toàn bộ `29` URL hợp lệ.
     - Quét `94` liên kết nội bộ duy nhất trong `<main>` trên cụm `/than-so-hoc`: `0` liên kết lỗi (`badLinks: []`).
     - Duyệt bằng mắt toàn bộ `15` ảnh chụp `ck-than-so-*.png`: ở lần chạy thử đầu gặp lỗi chunk dev do `.next` cũ trên `/than-so-hoc/so-chu-dao/7` và lặp `(7)` sau dấu `= 7` ở ví dụ năm 2000; đã chỉnh hiển thị phép cộng gọn hơn ở `so-chu-dao/[so]/page.tsx`, xóa bộ đệm `.next`, chạy lại `tsc`, test và kiểm tra trình duyệt, mở xem lại ảnh chụp mới xác nhận sạch, rõ nét ở cả `1366px` và `375px`.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Không lặp `BreadcrumbList` trong `<script type="application/ld+json">` của từng `page.tsx`**:
   - *Lý do*: `KhungTrang` (`src/components/ck/Breadcrumb.tsx`) đã tự xuất `BreadcrumbList` từ `schemaBreadcrumb(breadcrumb(duongDan, tenCuoi))`. Chỉ xuất schema riêng của trang tại `page.tsx` để tránh trùng lặp.
2. **Xử lý trường hợp năm không có ví dụ ngày sinh cách 1 (`viDuNgay(2, 1990)` và `viDuNgay(33, 2000)`)**:
   - *Lý do*: về toán học, năm 1990 có tổng chữ số năm = `19` nên mọi ngày năm 1990 đều có tổng chữ số `≥ 21 > 20` (không thể rút về `2` ngoài 11/20, mà 11 bị giữ); năm 2000 có tổng chữ số tối đa bằng `2 + 2 + 9 + 2 = 15 < 33` (không thể đạt `33`). Trang hiển thị câu thông báo đúng thực tế thay vì để khung trống.
3. **Trang chi tiết ví dụ trong `so-chu-dao/[so]` chỉ kèm ngoặc bước rút khi `buoc.length > 1` hoặc là số giữ nguyên (`11, 22, 33`)**:
   - *Lý do*: tránh lặp thừa `(7)` ngay sau `= 7` khi tổng chữ số vốn đã là một chữ số.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Trạng thái `SeoTrang` cụm `/than-so-hoc`**: hiện cả 6 bản ghi (`/than-so-hoc`, `/than-so-hoc/so-chu-dao`, `/than-so-hoc/so-chu-dao/{n}`, `/than-so-hoc/bieu-do-ngay-sinh`, `/than-so-hoc/theo-ten`, `/than-so-hoc/nam-ca-nhan/{n}`) trong bảng `SeoTrang` đang ở `trangThai: "NHAP"` (`noindex, follow`). Khi nghiệm thu xong cần chuyển sang `"XUAT_BAN"`.
- **Nội dung biên tập (`NoiDung`) cho `/than-so-hoc`**: hub đã gắn `KhoiDienGiai` với điều kiện chỉ hiện khi có bản ghi đã xuất bản; hiện chưa có bài xuất bản nên khối này đang ẩn theo đúng lệnh.
- **Phần ý nghĩa / tính cách / nghề nghiệp**: hiện toàn cụm giữ đúng `GHI_CHU_Y_NGHIA`; chỉ bổ sung sau khi có nguồn sách được phép trích dẫn.

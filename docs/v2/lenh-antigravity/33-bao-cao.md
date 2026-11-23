# Báo cáo Lệnh 33: Cụm `/kinh-dich` (hub, bảng 64 quẻ, 64 trang quẻ, 8 trang quái, cập nhật gieo quẻ)

Ngày hoàn thành: 23/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/kinh-dich/KinhDichHelpers.ts` (`4.602` byte) — Hằng số mặc định SEO (`MAC_DINH_HUB`, `MAC_DINH_64_QUE`, `MAU_SEO_QUE`, `MAU_SEO_QUAI`, `URL_64_QUE`), hàm tách slug và tạo tham số mẫu SEO (`tachSlugQue`, `thamSoQue`, `thamSoQuai`, `macDinhQue`, `macDinhQuai`), lọc ghi chú khác bản (`khacBanTheoViTri`), bộ tạo JSON-LD (`serializeJsonLd` escape `<` thành `\u003c`, `taoSchemaWebPage`, `taoSchemaDefinedTermSet64`, `taoSchemaDefinedTerm`), và `thongTinNganTheoSo`.
- `src/app/(v2)/kinh-dich/KinhDichUi.tsx` (`4.159` byte) — Thành phần UI dùng chung cho cụm `/kinh-dich`: `LienKetKiem` (chỉ đặt `<Link>` khi đường dẫn thuộc `daDungKinhDich()`), `HinhHao` (vẽ hình 3 hoặc 6 hào từ dưới lên, phân biệt âm/dương bằng hình nét liền và nét đứt có khe giữa), `DongVanHan` (nguyên văn `lang="zh-Hant"`, phiên âm `lang="vi"` ngay dưới khi có dữ liệu, ghi chú `khacBan`), và `GhiCongChuDich` (ghi công `NGUON_CHU_DICH` và `NGUON_PHIEN_AM` kèm liên kết).
- `src/app/(v2)/kinh-dich/page.tsx` (`4.940` byte) — Hub `/kinh-dich` (`export const revalidate = 3600`): `metaTrang('/kinh-dich', ...)`, JSON-LD `WebPage` (kèm `BreadcrumbList` từ `KhungTrang`), câu dẫn đếm được không kèm lịch sử/tác giả, hai thẻ lớn **64 quẻ** và **Gieo quẻ**, lưới **Bát quái** 8 quái (`BAT_QUAI_CHI_TIET`), `KhoiDienGiai` chỉ hiển thị khi `noiDungTheoDuongDan('/kinh-dich')` có bài đã xuất bản, và khối **Nguồn văn bản** (`NGUON_CHU_DICH`, `NGUON_PHIEN_AM`, liên kết `/nguon`).
- `src/app/(v2)/kinh-dich/64-que/page.tsx` (`6.100` byte) — Bảng `/kinh-dich/64-que` (`export const revalidate = 3600`): `metaTrang('/kinh-dich/64-que', ...)`, JSON-LD `DefinedTermSet` chứa đủ 64 `DefinedTerm` (`name`, `alternateName`, `url`), danh sách 64 quẻ theo thứ tự Văn Vương (`bang64()`) với liên kết trang quẻ và liên kết quái trên/dưới (xếp lưới 2 cột ở 375 px), bảng tra 8 × 8 (hàng = quái trên, cột = quái dưới, cuộn ngang trong khung `.ck-kd-bang8-khung`), liên kết cụm và khối ghi công.
- `src/app/(v2)/kinh-dich/que/[slug]/page.tsx` (`10.698` byte) — 64 trang quẻ tĩnh (`generateStaticParams`, `export const revalidate = 3600`, `queChiTiet(slug)` null → `notFound()`): metadata và `h1` theo mẫu `/kinh-dich/que/{nn}-{ten}`, JSON-LD `DefinedTerm` (`inDefinedTermSet` trỏ `/kinh-dich/64-que`) + `WebPage` + `BreadcrumbList`, khối đầu trang (ký hiệu ䷀…䷿ lớn, số quẻ, tên đầy đủ, chữ Hán, quái trên/dưới, `HinhHao`), khối nguyên văn lời quẻ + 6 hào + `用九`/`用六` + ghi chú `khacBan`, khối `KhoiDienGiai` (hoặc `"Bản dịch và lời bình tiếng Việt đang biên tập."` khi chưa có nội dung xuất bản), quẻ hỗ / quẻ đảo (`綜`, kèm câu đối xứng khi `dao.so === que.so`) / quẻ đối (`錯`), điều hướng trước/sau, liên kết cụm và ghi công.
- `src/app/(v2)/kinh-dich/bat-quai/[slug]/page.tsx` (`9.439` byte) — 8 trang quái tĩnh (`generateStaticParams`, `export const revalidate = 3600`, `quaiTheoSlug(slug)` undefined → `notFound()`): metadata và `h1` theo mẫu `/kinh-dich/bat-quai/{quai}`, JSON-LD `DefinedTerm` + `WebPage` + `BreadcrumbList`, khối đầu trang (ký hiệu ☰…☷ lớn, tên quái, chữ Hán, tượng, hình 3 hào), bảng 2 cột **Theo thiên Thuyết quái** (Tính, Vật, Thân thể, Gia đình, Phương kèm trường hợp riêng của Khôn và Đoài), dòng trích thiên `說卦` bản Kanripo KR1a0001, dòng Ngũ hành kèm câu quy ước đời sau, 2 nhóm 8 quẻ ở trên / ở dưới, thanh chuyển nhanh 8 quái và liên kết cụm.
- `docs/v2/lenh-antigravity/33-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-kinh-dich-hub-1366.png` (`795.213` byte)
  - `ck-kinh-dich-hub-375.png` (`521.155` byte)
  - `ck-kinh-dich-64-que-1366.png` (`1.121.443` byte)
  - `ck-kinh-dich-64-que-375.png` (`909.670` byte)
  - `ck-kinh-dich-que-01-1366.png` (`867.238` byte)
  - `ck-kinh-dich-que-01-375.png` (`572.125` byte)
  - `ck-kinh-dich-quai-khon-1366.png` (`829.180` byte)
  - `ck-kinh-dich-quai-khon-375.png` (`545.238` byte)
  - `ck-kinh-dich-gieo-que-1366.png` (`954.019` byte)
  - `ck-kinh-dich-gieo-que-375.png` (`678.582` byte)

### Tệp chỉnh sửa
- `src/app/(v2)/kinh-dich/gieo-que/page.tsx` (`10.245` byte) — Đổi `trangDaDung()` thành `daDungKinhDich()` để `HinhQue` gắn liên kết sang trang quẻ; bỏ khối `"Lời quẻ đang biên tập"`; khi có kết quả hiện nguyên văn lời quẻ chủ, lời các hào động theo `haoDong` (1..6, không thêm quy tắc chọn hào), liên kết `"Đọc đủ quẻ {ten}"` và liên kết quẻ biến (nếu có) cùng `GhiCongChuDich`; khi chưa gieo hiện nút `"Xem bảng 64 quẻ"`; giữ nguyên phần gieo, metadata, robots; kiểm tra `daDung` cho toàn bộ liên kết liên quan.
- `src/app/(v2)/kinh-dich/kinh-dich.css` (từ ~`4,3` KB lên `17.668` byte ≤ `30.720` byte / 30 KB) — Giữ nguyên các quy tắc hiện có của `/kinh-dich/gieo-que`, bổ sung tạo kiểu tiền tố `.ck-kd-*` dùng biến `--ck-*` của `ck.css`: font serif cho chữ Hán, kích thước ký hiệu quẻ lớn, hình 3/6 hào phân biệt âm dương bằng nét liền/nét đứt, bố cục hub, lưới 64 quẻ 2 cột ở mobile (`≤ 700px`), khung bảng 8×8 có `overflow-x: auto`, trang quẻ, bảng Thuyết quái và thanh chuyển nhanh 8 quái.

### Tệp xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/components/ck/**` (không cần sửa `HinhQue.tsx`), `src/app/(v2)/ck.css` (`60.691` byte), `package.json`, `tests/**`.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, thoát mã `0` (`TSC_EXIT=0`, 0 lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test --test-concurrency=2 tests/trang/*.test.mjs`)**:
   - Đạt, thoát mã `0` (`TEST_ALL_EXIT=0`): `90/90` bài test qua, 0 thất bại (bao gồm `chu-dich.test.mjs`, `chu-dich-64.test.mjs`, `chu-dich-64-phien-am.test.mjs`, `kinh-dich.test.mjs`, `xem-ngay.test.mjs`).
3. **Kiểm tra CSS, lớp và nội dung cấm**:
   - Dung lượng `src/app/(v2)/kinh-dich/kinh-dich.css`: `17.668` byte (≤ 30 KB). `src/app/(v2)/ck.css` giữ nguyên `60.691` byte.
   - Quét `Select-String` trên toàn bộ tệp trong `src/app/(v2)/kinh-dich/`: `0` kết quả biến v1 (`--paper`, `--bg`, `--ink`), `0` kết quả lớp trần (`.so`, `.nhan`, `.gia-tri`, `.the`, `.w`), `0` kết quả cụm từ cấm (`ý nghĩa`, `luận giải`, `tốt xấu`, `giải mã`, `lời khuyên`, `Lời quẻ đang biên tập`, `trangDaDung`).
4. **Kiểm tra HTTP, SEO, đối chiếu dữ liệu và trình duyệt (`http://localhost:3047`, Chromium via `playwright-core`)**:
   - **17/17 đường dẫn hợp lệ trả HTTP 200**: `/kinh-dich`, `/kinh-dich/64-que`, 5 trang quẻ (`01-thuan-can`, `03-thuy-loi-truan`, `04-son-thuy-mong`, `51-thuan-chan`, `64-hoa-thuy-vi-te`), đủ 8 trang quái (`can-thien`, `doai-trach`, `ly-hoa`, `chan-loi`, `ton-phong`, `kham-thuy`, `can-son`, `khon-dia`), `/kinh-dich/gieo-que`, `/kinh-dich/gieo-que?xu=9,7,8,8,7,6`.
   - **2/2 đường dẫn sai trả HTTP 404**: `/kinh-dich/que/abc`, `/kinh-dich/bat-quai/abc`.
   - **Title, H1, description và JSON-LD**: 0 trang còn chỗ trống `{...}`; Hub có `WebPage` + `BreadcrumbList`; `/kinh-dich/64-que` có `DefinedTermSet` đủ `64` `DefinedTerm` + `BreadcrumbList`; trang quẻ và trang quái có đủ `DefinedTerm` (`inDefinedTermSet = https://xemboi.vn/kinh-dich/64-que`) + `WebPage` + `BreadcrumbList`.
   - **Đối chiếu dữ liệu Chu Dịch**:
     - Quẻ 1 (`Thuần Càn`): lời quẻ `元亨利貞` + `nguyên hanh lợi trinh`, có `Dụng Cửu 用九`, hỗ = `Thuần Càn`, đảo = `Thuần Càn` + `"Quẻ đối xứng: lật ngược vẫn là chính nó."`, đối = `Thuần Khôn`, đủ 8 đoạn Hán và 8 đoạn phiên âm.
     - Quẻ 3 (`Thủy Lôi Truân`): đảo = `#4 Sơn Thủy Mông`.
     - Quẻ 4 (`Sơn Thủy Mông`): có ghi chú `"Bản gốc ghi 童蒙來求我; Năm bản khác..."`.
     - Quẻ 51 (`Thuần Chấn`): tại mục `Lục Ngũ 六五` có ghi chú `"Bản gốc ghi 意无喪有事; Năm bản khác ghi 億."`.
     - Quái Khôn: có `"Thuyết quái không ghi phương của Khôn."` và `"Ngũ hành của quái là cách quy thông dụng đời sau, Thuyết quái không ghi."`.
     - Quái Đoài: có `"Thuyết quái ghi Đoài theo mùa (chính thu), không ghi phương."`.
     - `/kinh-dich/gieo-que` (chưa gieo): có `"Xem bảng 64 quẻ"`, không còn `"Lời quẻ đang biên tập"`.
     - `/kinh-dich/gieo-que?xu=9,7,8,8,7,6`: có lời quẻ chủ (`Thủy Trạch Tiết`), lời hào 1 (`Sơ Cửu 初九`) và hào 6 (`Thượng Lục 上六`) kèm phiên âm, liên kết `"Đọc đủ quẻ Thủy Trạch Tiết"` và `"Đọc đủ quẻ biến: Phong Thủy Hoán"`.
   - **Console, tràn ngang và liên kết nội bộ**:
     - `0` lỗi console, `0` `pageerror`, `0` phản hồi HTTP ≥ 400 trên cả 17 route.
     - Không tràn ngang ở `1366px` và `375px` (`scrollWidth === clientWidth` trên toàn bộ trang kiểm tra); ở `375px` trên `/kinh-dich/64-que`, thẻ xếp 2 cột (`w = 167`, `x = 16` và `x = 193` cùng hàng) và khung bảng 8×8 cuộn ngang nội bộ (`scrollWidth = 760 > clientWidth = 341`).
     - Quét `115` liên kết nội bộ duy nhất thu được trên các trang: `0` liên kết 404/lỗi.
   - **Duyệt ảnh chụp bằng mắt (10 ảnh)**: đã mở đọc đầy đủ cả 10 ảnh (`hub`, `64-que`, `que-01`, `quai-khon`, `gieo-que` ở 1366 và 375); chữ Hán serif và ký hiệu quẻ hiển thị rõ nét, âm/dương tách hình rõ ràng, phiên âm nằm ngay dưới nguyên văn, bảng 8×8 không làm vỡ trang mobile (sau lần kiểm tra đầu đã bổ sung `overflow-wrap: anywhere` cho URL dài trong khối nguồn ở 375 px và chụp lại xác nhận gọn đẹp).

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Chèn `<script type="application/ld+json">` không lặp `BreadcrumbList` ở từng `page.tsx`**:
   - *Lý do*: `KhungTrang` (qua `Breadcrumb.tsx`) đã tự xuất sẵn `BreadcrumbList` từ `schemaBreadcrumb(breadcrumb(duongDan, tenCuoi))`. Chỉ xuất `WebPage` / `DefinedTermSet` / `DefinedTerm` tại `page.tsx` giữ đúng cặp schema mà không trùng lặp `BreadcrumbList`.
2. **Không sửa `src/components/ck/HinhQue.tsx`**:
   - *Lý do*: `HinhQue` đã hỗ trợ sẵn nhận `daDung?: Set<string>` và tự gắn `<Link href={/kinh-dich/que/${que.slug}}>` khi `daDung.has(...)` đúng, nên chỉ cần truyền `daDung={daDungKinhDich()}` ở `gieo-que/page.tsx` mà không cần chạm vào `components/ck/`.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Trạng thái `SeoTrang` của cụm `/kinh-dich`**: toàn bộ các bản ghi trong `SeoTrang` thuộc cụm `/kinh-dich` (`/kinh-dich`, `/kinh-dich/64-que`, `/kinh-dich/que/{nn}-{ten}`, `/kinh-dich/bat-quai/{quai}`, `/kinh-dich/gieo-que` cùng 2 trang dự kiến sau là `/kinh-dich/luc-hao`, `/kinh-dich/mai-hoa-dich-so`) hiện đang ở trạng thái `NHAP`, nên `metaTrang` xuất `<meta name="robots" content="noindex, follow"/>`. Sau khi nghiệm thu xong, cần chuyển sang `XUAT_BAN` cho 5 mẫu/đường dẫn đã dựng để mở index.
- **Nội dung biên tập (`NoiDung`) cho `/kinh-dich` và 64 quẻ `/kinh-dich/que/{slug}`**: tệp phiên âm `src/lib/trang/du-lieu/chu-dich-64-phien-am.json` đã có đầy đủ nên trang quẻ và trang gieo quẻ đã hiện đủ phiên âm Hán Việt; riêng phần bản dịch tiếng Việt và lời bình (`NoiDung` trạng thái `DA_XUAT_BAN`) hiện chưa có nên hub đang ẩn khối `KhoiDienGiai` và các trang quẻ đang hiện `"Bản dịch và lời bình tiếng Việt đang biên tập."` theo đúng Lệnh 33.
- **Chuỗi `NGUON_CHU_DICH.doiChieu` trong `src/lib/trang/chu-dich.ts`**: đang chứa chuỗi định danh `` `KHAC_BAN` `` hiển thị trực tiếp trên khối "Nguồn văn bản" ở `/kinh-dich`; nếu muốn câu văn tự nhiên hơn cho người đọc (ví dụ `"trừ hai chỗ khác bản đã ghi chú ngay dưới câu liên quan"`), có thể chỉnh trong `chu-dich.ts`.

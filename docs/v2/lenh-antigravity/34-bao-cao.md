# Báo cáo Lệnh 34: Cụm `/phong-thuy` (hub, tra cung phi, 8 trang cung, bát trạch, hướng nhà)

Ngày hoàn thành: 23/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/phong-thuy/layout.tsx` (`215` byte) — Nạp `@/components/ck/tu-dien.css` và `./phong-thuy.css` cho toàn bộ cụm `/phong-thuy`.
- `src/app/(v2)/phong-thuy/phong-thuy.css` (`15.537` byte ≤ `30.720` byte / 30 KB) — Tạo kiểu tiền tố `.ck-pt-*` dùng biến `--ck-*` của `ck.css`: font serif cho chữ Hán, nhãn Cát/Hung có chữ và màu dịu mắt, khối trích dẫn nguyên văn, lưới hub và 2 nhóm Đông tứ / Tây tứ, đầu trang cung và hình 3 hào (âm/dương và hào biến), bảng 8×8 có `.ck-pt-bang8-khung` cuộn ngang nội bộ ở mobile, chuỗi phiên quái 8 bước, nút chọn nhanh 8 phương và khung vòng 24 sơn SVG, sửa độ tương phản chữ nút gửi form (`.ck button.ck-pt-nut-chinh`), và responsive `≤ 1000px`, `≤ 700px`.
- `src/app/(v2)/phong-thuy/PhongThuyHelpers.ts` (`6.855` byte) — Hằng số mặc định SEO (`MAC_DINH_HUB`, `MAC_DINH_CUNG_PHI`, `MAC_DINH_BAT_TRACH`, `MAC_DINH_HUONG_NHA`, `MAU_SEO_CUNG`, `URL_BAT_TRACH`), `macDinhCung`, `thamSoCung`, phân tích/kiểm tra tham số `searchParams` (`phanTichNam` 1900–2100, `phanTichGioiTinh`, `phanTichDo` 0–359,9), định dạng độ (`dinhDangDo`), thứ tự cung Đông/Tây tứ và theo chiều kim đồng hồ, `NGUYEN_KHOI`, `NUT_HUONG_NHANH`, và bộ sinh JSON-LD (`serializeJsonLd` escape `<` thành `\u003c`, `taoSchemaCollectionPage`, `taoSchemaWebApplication`, `taoSchemaDefinedTermSetBatTrach`, `taoSchemaDefinedTermCung`, `taoSchemaWebPage`).
- `src/app/(v2)/phong-thuy/PhongThuyUi.tsx` (`6.778` byte) — Thành phần dùng chung: `KhoiTrichDan` (chữ Hán `lang="zh-Hant"`, phiên âm `lang="vi"`, `viTriTrich`, không tự dịch), `GhiCongHiepKy` (`NGUON_HIEP_KY.ghiCong` gắn `url` + `ngatCau` + `/nguon`), `GhiChuNamAm` (`"Sinh trước Tết thì dùng năm âm lịch trước đó"` + `/lich-am/doi-ngay`), `HuyHieuCatHung`, `BangBatPhuong`, `HinhBaHaoBien` (hào biến tô khác kèm chữ `"biến"`), `HinhBaHaoQuai`, `ThanhTamCung`.
- `src/app/(v2)/phong-thuy/page.tsx` (`6.839` byte) — Hub `/phong-thuy` (`export const revalidate = 3600`): `metaTrang`, JSON-LD `CollectionPage`, 3 thẻ lớn (`/phong-thuy/cung-phi`, `/phong-thuy/bat-trach`, `/phong-thuy/huong-nha`), form nhỏ tra cung phi, lưới 8 cung chia 2 nhóm Đông tứ / Tây tứ, trích `TRICH.dongTayTuTrach` và `TRICH.daiDuNien`, `KhoiDienGiai` chỉ hiện khi có bài đã xuất bản, và khối Nguồn (`NGUON_HIEP_KY`) + `GhiCongHiepKy`.
- `src/app/(v2)/phong-thuy/cung-phi/page.tsx` (`9.740` byte) — Công cụ `/phong-thuy/cung-phi` (`export const revalidate = 3600`): `generateMetadata` xử lý `canonical` sạch và `robots: { index: false, follow: true }` khi có tham số; JSON-LD `WebApplication`; form GET năm sinh âm lịch (1900–2100) + giới tính (báo lỗi trong form khi sai, không 500); kết quả cung phi (kèm `GHI_CHU_GUI_CUNG` khi `guiCung === true`), bảng 8 phương, khối Cách tính (trích `TRICH.cuuCungKienTrach`, `TRICH.khangHy23` mốc 1684, `TRICH.caiChinh`, bảng 3 nguyên `NGUYEN_KHOI`, câu nghịch/thuận hành, `GHI_CHU_GUI_CUNG`), thanh 8 cung, liên kết và ghi công.
- `src/app/(v2)/phong-thuy/cung-phi/[cung]/page.tsx` (`7.067` byte) — 8 trang cung tĩnh (`generateStaticParams` từ `BAT_CUNG`, `cungTheoSlug` undefined → `notFound()`, `export const revalidate = 3600`): `metaTrang` với `MAU_SEO_CUNG` và `thamSoCung`, `tenCuoi = "Cung {ten}"`, JSON-LD `DefinedTerm` (`inDefinedTermSet = URL_BAT_TRACH`) + `WebPage`, đầu trang (ký hiệu lớn, tên, chữ Hán, hình 3 hào, số Lạc thư, hành, nhóm, loại, phương và 3 sơn), bảng 8 phương, danh sách năm sinh 1930–2030 hai cột Nam/Nữ gắn `/sinh-nam/{nam}` (đánh dấu `*` và chú thích `GHI_CHU_GUI_CUNG` ở Khôn và Cấn), thanh 8 cung, liên kết sang `/kinh-dich/bat-quai/{slug}` và các trang cụm, cùng ghi công.
- `src/app/(v2)/phong-thuy/bat-trach/page.tsx` (`8.013` byte) — Trang `/phong-thuy/bat-trach` (`export const revalidate = 3600`): `metaTrang`, JSON-LD `DefinedTermSet` đủ 8 du niên, 8 thẻ du niên (4 cát trước, 4 hung sau, hình 3 hào biến và câu trích `trich`), bảng 8×8 cuộn ngang nội bộ ở 375 px, cách lập (trích `TRICH.phienQuai`, `TRICH.thuTuSao`, chuỗi 8 bước `phienQuai('Càn')`), nhóm Đông tứ / Tây tứ (trích `TRICH.dongTayTuTrach` và câu quy tắc cùng/khác nhóm), thanh 8 cung và ghi công.
- `src/app/(v2)/phong-thuy/huong-nha/FormHuongNhaClient.tsx` (`3.226` byte) — Form `'use client'` nhập độ la bàn (0–359,9), 8 nút nhanh điền sẵn độ (Bắc 0° đến Tây Bắc 315°), tùy chọn năm sinh âm lịch + giới tính, và chú thích năm âm lịch + `/lich-am/doi-ngay`.
- `src/app/(v2)/phong-thuy/huong-nha/VongHaiTuSonSvg.tsx` (`7.404` byte) — SVG vòng 24 sơn và 8 vùng quái (Bắc ở trên cùng, vẽ kim Hướng và Tọa khi có kết quả, đọc rõ ở 375 px).
- `src/app/(v2)/phong-thuy/huong-nha/page.tsx` (`11.135` byte) — Công cụ `/phong-thuy/huong-nha` (`export const revalidate = 3600`): `generateMetadata` xử lý `canonical` sạch và `robots: { index: false, follow: true }` khi có tham số; JSON-LD `WebApplication`; kết quả hướng, tọa, `TRICH.sonHuong`, `{trach} tứ trạch`, đối chiếu cung phi khi có năm sinh (2 dòng tính được cho phương hướng nhà và quái tọa, không kết luận hợp/không hợp, không khuyên sửa nhà), SVG vòng 24 sơn, bảng 8 quái với 3 sơn và khoảng độ cùng `TRICH.batCung`, dòng tự xác định cách đo hướng, liên kết và ghi công.
- `docs/v2/lenh-antigravity/34-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-phong-thuy-hub-1366.png` (`1.022.605` byte)
  - `ck-phong-thuy-hub-375.png` (`687.876` byte)
  - `ck-phong-thuy-cung-phi-1366.png` (`1.175.327` byte)
  - `ck-phong-thuy-cung-phi-375.png` (`825.065` byte)
  - `ck-phong-thuy-cung-kham-1366.png` (`1.009.643` byte)
  - `ck-phong-thuy-cung-kham-375.png` (`710.249` byte)
  - `ck-phong-thuy-bat-trach-1366.png` (`1.369.652` byte)
  - `ck-phong-thuy-bat-trach-375.png` (`1.066.393` byte)
  - `ck-phong-thuy-huong-nha-1366.png` (`1.256.573` byte)
  - `ck-phong-thuy-huong-nha-375.png` (`884.331` byte)

### Tệp chỉnh sửa
- `src/app/(v2)/sinh-nam/[yyyy]/page.tsx` (`13.641` byte) — Ở khối `"Cung phi Bát trạch năm {nam}"`, gắn `<Link>` cho tên cung Nam và Nữ tới `/phong-thuy/cung-phi/{slug}` qua `cungTheoTen` khi `daDung.has('/phong-thuy/cung-phi')`, và thêm liên kết `"Bát trạch →"` tới `/phong-thuy/bat-trach` cùng điều kiện. Không đổi phần khác.
- `src/app/(v2)/xem-tuoi/vo-chong/page.tsx` (`9.392` byte) — Ở dòng `"Cung phi (Bát trạch):"` của thẻ Chồng/Vợ, gắn `<Link>` tên cung tới `/phong-thuy/cung-phi/{slug}` qua `cungTheoTen` khi `daDung.has('/phong-thuy/cung-phi')`. Không đổi phần khác.

### Tệp xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/components/ck/**`, `src/app/(v2)/ck.css` (`60.691` byte), `package.json`, `tests/**`.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, thoát mã `0` (`TSC_EXIT=0`, 0 lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test --test-concurrency=2 tests/trang/*.test.mjs`)**:
   - Đạt, thoát mã `0` (`TEST_EXIT=0`): `97/97` bài test qua, `0` thất bại (gồm đủ 7 bài test của `tests/trang/phong-thuy.test.mjs`).
3. **Kiểm tra CSS và quét cụm từ cấm**:
   - `src/app/(v2)/phong-thuy/phong-thuy.css`: `15.537` byte (≤ 30 KB); `src/app/(v2)/ck.css`: giữ nguyên `60.691` byte.
   - Quét toàn bộ tệp trong `src/app/(v2)/phong-thuy/`: `0` biến v1 (`--paper`, `--bg`, `--ink`), `0` lời khuyên hay liên kết `/phong-thuy/thuoc-lo-ban`, `/phong-thuy/hoi-dap` (chỉ có 1 chuỗi `"không bán vật phẩm"` thuộc câu `metaDescription` chuẩn của `16-seo-trang.csv` trong `MAC_DINH_HUB`).
4. **Kiểm tra HTTP, SEO, đối chiếu dữ liệu và trình duyệt (`http://localhost:3047`, Chromium via `playwright-core`)**:
   - **17/17 đường dẫn hợp lệ trả HTTP 200**: `/phong-thuy`, `/phong-thuy/cung-phi`, `/phong-thuy/cung-phi?nam=1990&gt=nam`, `/phong-thuy/cung-phi?nam=1968&gt=nam`, `/phong-thuy/bat-trach`, `/phong-thuy/huong-nha`, `/phong-thuy/huong-nha?do=180&nam=1990&gt=nu`, 8 trang cung (`can-thien`, `doai-trach`, `ly-hoa`, `chan-loi`, `ton-phong`, `kham-thuy`, `can-son`, `khon-dia`), `/sinh-nam/1990`, `/xem-tuoi/vo-chong?chong=1990&vo=1992`.
   - **Lỗi đầu vào & 404**: `/phong-thuy/cung-phi/abc` trả HTTP `404`; `/phong-thuy/cung-phi?nam=abc` và `/phong-thuy/huong-nha?do=abc` trả HTTP `200` kèm khung báo lỗi `[role="alert"]`.
   - **Title, H1, canonical, robots và JSON-LD**: 0 trang còn `{...}`; các URL có query trả `canonical` sạch và `robots="noindex, follow"`; JSON-LD khớp đúng từng loại trang (`CollectionPage` ở hub, `WebApplication` ở 2 công cụ, `DefinedTermSet` đủ 8 du niên ở bát trạch, `DefinedTerm` + `WebPage` ở trang cung, kèm `BreadcrumbList` từ `KhungTrang`).
   - **Đối chiếu dữ liệu**:
     - `1990 nam`: `Cung Khảm`, `Số cửu cung: 1`, `Đông tứ mệnh`, `Hạ nguyên`; 4 cát: `Sinh khí` (`Đông Nam`), `Thiên y` (`Đông`), `Diên niên` (`Nam`), `Phục vị` (`Bắc`).
     - `1990 nữ`: `Cung Cấn`, `Số cửu cung: 5 (gửi cung Cấn, số 8)`, `Tây tứ mệnh`, có `GHI_CHU_GUI_CUNG`.
     - `1968 nam`: `Cung Khôn`, `Số cửu cung: 5 (gửi cung Khôn, số 2)`, có `GHI_CHU_GUI_CUNG`.
     - `?do=180&nam=1990&gt=nu`: `Sơn Ngọ` (`Ly`, `Nam`), tọa `Sơn Tý` (`Khảm`), `Đông tứ trạch`; Cấn: `"Phương hướng nhà (Nam) với cung Cấn: Họa hại, hung"`, `"Quái tọa Khảm với cung Cấn: Ngũ quỷ, hung"`; nút nhanh `"Đông Nam (135°)"` điền sẵn `"135"` vào `#ck-hn-do`.
     - Bảng 8 × 8 hàng Càn: `Phục vị(cát)`, `Sinh khí(cát)`, `Tuyệt mệnh(hung)`, `Ngũ quỷ(hung)`, `Họa hại(hung)`, `Lục sát(hung)`, `Thiên y(cát)`, `Diên niên(cát)`.
     - Liên kết từ `/sinh-nam/1990` tới `/phong-thuy/cung-phi/kham-thuy`, `/phong-thuy/cung-phi/can-son`, `/phong-thuy/bat-trach`; từ `/xem-tuoi/vo-chong?chong=1990&vo=1992` tới `/phong-thuy/cung-phi/kham-thuy`, `/phong-thuy/cung-phi/doai-trach`.
   - **Console, tràn ngang và liên kết nội bộ**:
     - `0` lỗi console, `0` `pageerror`, `0` phản hồi HTTP ≥ 400 (ngoài phép thử `404` chủ đích).
     - `0` tràn ngang ở `1366px` và `375px` (`scrollWidth === clientWidth`); bảng 8×8 ở `375px` cuộn ngang nội bộ (`scrollWidth = 760`, `clientWidth = 341`).
     - Quét `131` liên kết nội bộ duy nhất từ cụm `/phong-thuy`: `0` liên kết lỗi (`badLinks: []`).
   - **Duyệt ảnh chụp bằng mắt (10 ảnh)**: ở lần chụp đầu phát hiện 2 lỗi hiển thị — chữ trên nút `<button class="ck-nut ck-nut-son">` bị tối màu do `.ck button { color: inherit; }` trong `ck-nen.css`, và nhãn `"Đông 90°"`, `"Tây 270°"` ở rìa SVG vòng 24 sơn bị chạm mép `viewBox="0 0 480 480"` cùng kim đè chữ tâm `"24 sơn"`. Đã sửa bằng `.ck button.ck-pt-nut-chinh { color: #FBF1DA; }` và mở rộng `viewBox="0 0 540 540"` + vẽ kim từ `r = 60` ra rìa ngoài, chạy lại toàn bộ `tsc`, test, kiểm tra trình duyệt (kiểm chứng `btnSonColor: rgb(251, 241, 218)`) và mở xem lại các ảnh chụp xác nhận sạch đẹp.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Không lặp `BreadcrumbList` trong `<script type="application/ld+json">` của từng `page.tsx`**:
   - *Lý do*: `KhungTrang` (`Breadcrumb.tsx`) đã tự xuất sẵn `BreadcrumbList` từ `schemaBreadcrumb(breadcrumb(duongDan, tenCuoi))`. Chỉ xuất phần schema riêng của từng trang tại `page.tsx` giúp không trùng lặp `BreadcrumbList`.
2. **Hiển thị kèm số gửi cung (`5 (gửi cung Cấn, số 8)`) khi `guiCung === true`**:
   - *Lý do*: `cungPhi(1990, 'nu')` trả về `so = 5` (trung cung) gửi sang `Cấn` (`so = 8`). Ghi rõ cả hai con số cùng `GHI_CHU_GUI_CUNG` giúp người tra đối chiếu không bị nhầm giữa số cửu cung gốc và số Lạc thư của cung nhận gửi.
3. **Thêm lớp `.ck-pt-nut-chinh` cho nút gửi form `.ck-nut.ck-nut-son`**:
   - *Lý do*: không được sửa `ck.css` hoặc `ck-nen.css`, trong khi quy tắc `.ck button { color: inherit; }` ở `ck-nen.css` thắng độ ưu tiên của `.ck-nut-son`. Đặt `.ck button.ck-pt-nut-chinh { color: #FBF1DA; }` trong `phong-thuy.css` giữ đúng độ tương phản mà không chạm vào tệp dùng chung.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Trạng thái `SeoTrang` cụm `/phong-thuy`**: các bản ghi `/phong-thuy`, `/phong-thuy/cung-phi`, `/phong-thuy/cung-phi/{cung}`, `/phong-thuy/bat-trach`, `/phong-thuy/huong-nha` trong CSDL hiện ở trạng thái `NHAP` (`noindex, follow`). Khi nghiệm thu xong cần chuyển sang `XUAT_BAN` cho 5 đường dẫn/mẫu này (giữ nguyên `/phong-thuy/thuoc-lo-ban` và `/phong-thuy/hoi-dap` ở `NHAP` do chưa dựng).
- **Nội dung biên tập (`NoiDung`) cho `/phong-thuy`**: hiện chưa có bản ghi xuất bản nên hub đang ẩn khối `KhoiDienGiai` theo đúng Lệnh 34; có thể bổ sung và xuất bản nếu cần thêm phần mở rộng trên hub.

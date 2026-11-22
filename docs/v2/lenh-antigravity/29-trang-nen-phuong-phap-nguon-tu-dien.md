# Lệnh 29: Trang nền: phương pháp, nguồn sách, từ điển, kiến thức, bài viết, liên hệ, chính sách (F5)

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/29-bao-cao.md`.

**Làm sau khi Lệnh 28 đã nghiệm thu (commit 54fa12b).** Ràng buộc như Lệnh 25:
- khung `(v2)`, CSS `ck-`;
- không bịa nội dung, không viết thêm văn giải thích ngoài các câu cố định ghi trong lệnh này;
- chỉ đặt liên kết tới `trangDaDung()`;
- không cài gói, không commit.

Claude Code đã gỡ route v1 `src/app/kien-thuc` và `src/app/bai-viet`, nên các route mới đặt trong `src/app/(v2)/` không bị trùng.

## Đọc trước

- `docs/v2/16-seo-trang.csv`, các dòng `PP*`, `NGUON*`, `TUDIEN`, `KT`, `PL-*`. Cột `h1_mau`, `title_mau`, `lien_ket_ra`, `ghi_chu`.
- Phần lõi của Claude Code (chỉ đọc; test ở `tests/trang/nen.test.mjs`, `noi-dung.test.mjs`):
  - `src/lib/trang/nen.ts`
    - `BANG_QUY_UOC`: 22 dòng `{ ma, mang: 'Lịch âm'|'Tử vi'|'Bát tự', chuDe, macDinh, khac[], xemThem? }`. Đây là những gì bộ máy đang tính, viết sẵn thành câu.
    - `bangThangNhuan(tu?, den?)`: mặc định 1900–2100. Mỗi dòng `{ namAm, thangNhuan, tuNgay, denNgay, thangNeuUtc7 }` (ngày dạng `dd/mm/yyyy`). `thangNeuUtc7` khác `null` ở 3 năm 1917, 1922, 1938.
    - `danhSachNguonCongKhai()`: 164 nguồn `{ ma, slug, tenGoc, tenHanViet, tenHienThi, tacGia, nienDai, banIn, ngonNgu[], mang[], loaiNguon, tenLoai, url, giayPhep, ghiCong, uuTien }`. `nguonTheoSlug(slug)`. `soBaiTrichNguon(ma)`.
    - `danhSachThuatNgu()`: 336 thuật ngữ, đã nhóm `{ mang, ten, muc[] }`. Mỗi mục `{ han, hanViet, bienThe[], mang, lienKet }`; `lienKet` là trang v2 đã có hoặc `null`.
    - `danhSachBaiViet(tienTo?)`: bài đã xuất bản `{ tieuDe, duongDan, tomTat, ngayXuatBan, mang[] }`, mới trước. Hiện có 4 bài, cả 4 ở `/bai-viet/...`.
  - `src/lib/trang/noi-dung.ts`: `noiDungTheoDuongDan(duongDan)` trả `null` nếu chưa xuất bản. Thân bài cũ dạng HTML nay được đổi sang khối có tiêu đề và danh sách; `NoiDungMd` hiển thị như cũ.
  - `src/lib/tuvi-v2/am-lich.ts`: `KHUNG_GIO` (12 canh giờ) nếu cần cho trang giờ Tý.

## Dùng lại

- `KhungTrang`, `Breadcrumb`, `KhoiDienGiai`, `NoiDungMd`, `tu-dien.css` (Lệnh 27).
- Mẫu metadata giống `src/app/(v2)/tu-vi/sao/[slug]/page.tsx`: `metaTrang(duongDan, macDinh, mau?, thamSo?)`; trang chưa có `noiDungTheoDuongDan` thì ép `robots` noindex.

## Quy định CSS

Không thêm vào `ck.css` (đã chạm trần 60 KB). Mỗi cụm có tệp riêng, import trong `layout.tsx` của cụm, không quá 30 KB, vẫn tiền tố `ck-`:
- `src/app/(v2)/phuong-phap/phuong-phap.css`
- `src/app/(v2)/nguon/nguon.css`
- `src/app/(v2)/tu-dien/` dùng lại `src/components/ck/tu-dien.css`, thêm `tu-dien-trang.css` nếu cần.
- Trang bài (`kien-thuc`, `bai-viet`) và trang pháp lý: một tệp chung `src/components/ck/bai.css`, import trong từng `layout.tsx`.

## 1. Việc cần làm

### 1.1. `/phuong-phap`

- H1 và metadata theo dòng `PP`.
- Khối giới thiệu: `KhoiDienGiai` từ `noiDungTheoDuongDan('/phuong-phap')`. Chưa có thì hiện chỗ giữ.
- **Bảng quy ước tính** từ `BANG_QUY_UOC`, chia 3 nhóm theo `mang`. Mỗi dòng có 3 cột: chủ đề, cách xemboi tính (`macDinh`), cách khác (`khac[]`, rỗng thì ghi "—"). Cột "Xem thêm" chỉ hiện khi `xemThem` có trong `trangDaDung()`.
  - Trên mobile mỗi dòng thành một thẻ; không để trang cuộn ngang.
  - Câu cố định trên bảng: "Khi lập lá số, bạn đổi được các quy ước có ghi cách khác."
- Thẻ dẫn tới 5 trang con theo thứ tự: Nam phái và Bắc phái, Giờ Tý, Tháng nhuận, Chuẩn biên tập, Người duyệt. Thêm một thẻ dẫn `/nguon`.

### 1.2. `/phuong-phap/thang-nhuan`

- Bảng `bangThangNhuan()`: năm âm, can chi của năm (dùng `canChiNam` của lõi hoặc `namSinh` trong `can-chi.ts`), tháng nhuận, từ ngày, đến ngày.
  - Dòng của năm âm hiện tại được nhấn mạnh và có `id` để cuộn tới.
  - Bảng dài 74 dòng: có thanh chọn nhanh theo thế kỷ (1900–1999, 2000–2100) bằng neo `#`, không cần JavaScript.
  - Năm có `thangNeuUtc7` ghi chú dưới dòng: "Nếu tính theo UTC+7 thì nhuận tháng {n}".
- Câu cố định dưới tiêu đề bảng: "Trước 01/01/1968 tính theo múi giờ UTC+8 như lịch Việt Nam thời đó; từ 1968 theo UTC+7."
- Các dòng `BANG_QUY_UOC` có `ma` là `lich-thang-nhuan` và `tv-thang-nhuan`, trình bày như 1.1.
- Phần bài: `KhoiDienGiai`. Liên kết `/lich-am/doi-ngay`, `/tu-vi/lap-la-so`.

### 1.3. `/phuong-phap/gio-ty`

- Bảng 12 canh giờ (`KHUNG_GIO`): chi, khoảng giờ. Giờ Tý tách hai dòng: "23:00–23:59 (Tý đầu, tính ngày hôm sau)" và "00:00–00:59".
- Các dòng `BANG_QUY_UOC` có `ma` là `tv-gio-ty` và `bt-ngay`.
- Phần bài: `KhoiDienGiai`. Liên kết `/tu-vi/lap-la-so`, `/bat-tu/lap-la-so`, `/lich-am/doi-ngay`.

### 1.4. `/phuong-phap/nam-phai-bac-phai`

- Các dòng `BANG_QUY_UOC` nhóm Tử vi có `khac` khác rỗng: đây là chỗ các phái khác nhau. Tiêu đề khối: "Các điểm xemboi cho chọn khi lập lá số".
- Phần bài: `KhoiDienGiai`.

### 1.5. `/phuong-phap/chuan-bien-tap` và `/phuong-phap/nguoi-duyet`

- Chỉ có H1, breadcrumb và `KhoiDienGiai` (chỗ giữ khi chưa xuất bản). Không viết thêm chữ.

### 1.6. `/nguon`

- H1 và metadata theo dòng `NGUON`.
- Danh sách 164 nguồn từ `danhSachNguonCongKhai()`.
  - Bộ lọc theo mảng: các nút lấy từ tập `mang` của mọi nguồn, kèm "Tất cả". Lọc phía client hoặc bằng `?mang=`; nếu dùng tham số thì noindex và canonical về `/nguon`.
  - Ô tìm theo tên (client, không gọi API).
  - Mỗi mục: `tenHienThi`, `tenGoc` (chữ Hán, nhỏ hơn), `tacGia`, `nienDai`, nhãn `tenLoai`, nhãn `giayPhep` nếu có. Tên dẫn tới `/nguon/{slug}`.
- Câu cố định đầu trang: "Danh sách sách gốc và bộ dữ liệu xemboi dùng để đối chiếu. Sách còn bản quyền không có liên kết tải."

### 1.7. `/nguon/[slug]`

- `generateStaticParams` từ `danhSachNguonCongKhai()`. Không tìm thấy thì `notFound()`.
- Metadata: `metaTrang('/nguon/' + slug, macDinh, '/nguon/{slug-sach}', { 'Tên sách': tenHienThi, 'tác giả': tacGia ?? 'khuyết danh', năm: nienDai ?? 'chưa rõ' })`.
- Bảng thông tin: tên gốc, tên Hán Việt, tác giả, niên đại, bản in, ngôn ngữ, mảng, loại, giấy phép, ghi công.
- `url` (nếu có): nút "Xem bản số hóa", `target="_blank" rel="noopener noreferrer nofollow"`.
- Dòng "Được trích trong {n} bài đã xuất bản" từ `soBaiTrichNguon(ma)`; n = 0 thì không hiện.
- Liên kết về `/nguon` và `/phuong-phap/chuan-bien-tap`.
- Schema `Book` (JSON-LD): `name`, `author` (nếu có), `inLanguage`.

### 1.8. `/tu-dien`

- H1 và metadata theo dòng `TUDIEN`.
- **Khối "Mục từ điển đã có"**: thẻ dẫn tới các chỉ mục đang chạy, mỗi thẻ có số mục:
  - `/tu-vi/sao` (14 chính tinh)
  - `/tu-vi/cung` (12 cung)
  - `/can-chi/60-hoa-giap` (60)
  - `/nap-am` (30)
  - `/con-giap` (12)
  - `/ngu-hanh` (5)

  Chỉ hiện thẻ có trong `trangDaDung()`.
- **Thuật ngữ** từ `danhSachThuatNgu()`, chia theo nhóm, có mục lục neo ở đầu.
  - Mỗi thuật ngữ: `hanViet` (đậm), `han`, `bienThe` (nếu có, ghi "còn gọi").
  - `lienKet` khác `null` thì `hanViet` là liên kết.
  - Ô lọc theo chữ (client).
- Schema `DefinedTermSet` với các `DefinedTerm` (`name` = hanViet, `alternateName` = han).

### 1.9. `/kien-thuc`

- H1 và metadata theo dòng `KT`.
- Danh sách thẻ bài từ `danhSachBaiViet()`: tiêu đề, tóm tắt, ngày xuất bản (dd/mm/yyyy). Hiện có 4 bài.
- Phân trang `?trang=2` khi quá 12 bài; mỗi trang tự canonical (ghi chú của dòng `KT`).
- Chưa có bài thì chỉ hiện câu "Bài đang được biên tập".

### 1.10. Trang bài: `/bai-viet/[slug]` và `/kien-thuc/[slug]`

Dùng chung một component trang bài.
- Đọc `noiDungTheoDuongDan(duongDan)`. **Trả `null` thì `notFound()`**: không lấy bài khác thay như v1 đã làm.
- Metadata: `metaTrang(duongDan, { title: tieuDe, description: tomTat, h1: tieuDe })`.
- Bố cục đọc: cột chữ rộng tối đa khoảng 70 ký tự, cỡ chữ dễ đọc trên mobile.
  - Dòng ngày: "Đăng {ngayXuatBan}", thêm "· Cập nhật {capNhatLuc}" nếu khác ngày.
  - Thân: `NoiDungMd`.
  - Trích dẫn (`trichDan`): danh sách "Nguồn" ở cuối bài nếu có.
- Breadcrumb: Trang chủ › Kiến thức › bài.
- Schema `Article`: `headline`, `datePublished`, `dateModified`.
- Cuối bài: liên kết về `/kien-thuc` và `/phuong-phap`.
- `generateStaticParams` không bắt buộc; nếu có thì lấy từ `danhSachBaiViet()`.

### 1.11. `/lien-he` và 3 trang chính sách

Các trang:
- `/lien-he`
- `/chinh-sach-bao-mat-va-cookies`
- `/chinh-sach-su-dung-va-khieu-nai`
- `/chinh-sach-ban-quyen`

Mỗi trang:
- H1 theo dòng `PL-*`. Breadcrumb.
- Hiện `NoiDungMd` nếu `noiDungTheoDuongDan` có bài. Không có thì hiện chỗ giữ:
  - liên hệ: "Thông tin liên hệ đang cập nhật.";
  - chính sách: "Nội dung đang được rà soát trước khi đăng.".
- Chưa có bài thì `robots` noindex. **Không tự viết điều khoản, địa chỉ, email hay số điện thoại.**

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua.
- Kiểm trên dev, yêu cầu 0 lỗi console và không có link 404:
  - `/phuong-phap`: bảng quy ước đủ 22 dòng, 3 nhóm.
  - `/phuong-phap/thang-nhuan`: dòng 2025 nhuận tháng 6, 25/07/2025 đến 22/08/2025; dòng 1917 có ghi chú UTC+7.
  - `/phuong-phap/gio-ty`, `/phuong-phap/nam-phai-bac-phai`, `/phuong-phap/chuan-bien-tap`, `/phuong-phap/nguoi-duyet`.
  - `/nguon`: đủ 164 mục; lọc "Kinh Dịch" chỉ còn sách Kinh Dịch.
  - `/nguon/{slug}` của mục đầu danh sách, và một slug không có phải ra 404.
  - `/tu-dien`: 6 nhóm, có liên kết sang `/tu-vi/sao/...`.
  - `/kien-thuc`: 4 bài.
  - `/bai-viet/huong-dan-doc-la-so-tu-vi-nam-phai-cho-nguoi-moi`: có tiêu đề cấp 2 hoặc 3 và danh sách, không còn một khối chữ liền.
  - `/bai-viet/khong-co-bai-nay` và `/kien-thuc/khong-co-bai-nay`: 404.
  - `/lien-he` và 3 trang chính sách: hiện chỗ giữ, có noindex.
- Trang có tham số và trang chưa có diễn giải: kiểm noindex trong HTML.
- Trang không cuộn ngang ở 375 px, nhất là `/phuong-phap`, `/phuong-phap/thang-nhuan`, `/nguon`.
- Ảnh 1366 và 375 lưu `docs/v2/bang-chung/ck-f5-*.png`. Báo cáo theo mẫu Lệnh 25.

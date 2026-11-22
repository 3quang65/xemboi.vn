# Lệnh 27: cụm Can chi & mệnh v2 (F3)

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/27-bao-cao.md`.

**Làm sau khi Lệnh 26 đã nghiệm thu.**
- Ràng buộc như Lệnh 25 (khung, CSS `ck-`, không bịa nội dung, chỉ link tới `trangDaDung()`, không cài gói, không commit).

## Đọc trước

- `docs/v2/19-frontend-v2.md`, các mục F3 và 2.2 (trang từ điển: dữ liệu tính được và phần diễn giải đã duyệt).
- `docs/v2/16-seo-trang.csv`, các dòng `CC*`.
- **Lõi Claude Code đã làm** (chỉ đọc; test ở `tests/trang/can-chi.test.mjs` và `noi-dung.test.mjs`):
  - `src/lib/trang/can-chi.ts`:
    - `namSinh(y)`: can chi, con giáp, nạp âm, hành, quan hệ sinh khắc, khoảng ngày của năm âm, Lập xuân, cung phi nam/nữ, màu hợp mệnh, `tuoiAm(namXem)`.
    - `danhSachNamSinh()`: 101 năm, chia theo thập kỷ.
    - `HOA_GIAP` (60), `NAP_AM` (30), `CON_GIAP` (12). Các hàm `...TheoSlug(slug)`, `namCuaHoaGiap()`.
    - `quanHeHanh(h)`, `mauHopMenh(h)`, `NGU_HANH`, `NGUON_NAP_AM` (tên sách nguồn của bảng nạp âm).
  - `src/lib/trang/noi-dung.ts`: `noiDungTheoDuongDan(url)`.
    - Trả `null` nếu chưa có bản xuất bản.
    - Nếu có, trả `than` (khối markdown đã tách), `khoi` (K1–K9), `trichDan`.
    - Cần một component `src/components/ck/NoiDungMd.tsx` để hiện `KhoiMd[]`: tiêu đề, đoạn, danh sách, trích dẫn, chữ đậm, chữ nghiêng, link.
    - Component **không** dùng `dangerouslySetInnerHTML`.

## 1. Việc cần làm

Mọi trang từ điển và trang lập trình có chung khuôn:
- **Khối dữ liệu tính được.**
  - Bảng và thẻ lấy từ các hàm trên.
  - Có dòng nguồn nhỏ: "Bảng nạp âm theo: {NGUON_NAP_AM}".
- **Khối diễn giải.**
  - Có bản xuất bản: `NoiDungMd`, kèm trích dẫn.
  - Không có bản xuất bản: `ck-cho-noi-dung` với dòng "Phần diễn giải đang biên tập", và **ép `robots` noindex** dù `metaTrang` trả index.
- **Khối liên quan.** Link sang các mục cùng bộ và lên trang chỉ mục.

### 1.1. `/can-chi` (hub)

- Thẻ tới các trang chỉ mục bên dưới.
- Ô tra nhanh "Bạn sinh năm nào?": `select` 1930–2030, bấm thì đi tới `/sinh-nam/{yyyy}`.

### 1.2. `/sinh-nam` và `/sinh-nam/[yyyy]` (1930–2030; năm khác thì `notFound()`)

**Trang chỉ mục `/sinh-nam`:**
- Liệt kê đủ 101 năm, nhóm theo thập kỷ.
- Mỗi năm ghi can chi và nạp âm.
- Tô màu theo hành.

**Trang năm:**
- H1 từ dòng mẫu, `thamSo = { yyyy: '1990', 'Can Chi': 'Canh Ngọ', 'Nạp âm': 'Lộ Bàng Thổ' }`.
  - Khóa đúng như chữ trong dấu ngoặc của mẫu (`{Can Chi}`, `{Nạp âm}`, `{Hành}`, `{Chi}`, `{con vật}`), xem cột `title_mau` của csv.
  - Mẫu còn chỗ trống chưa điền thì console dev cảnh báo. Nghiệm thu phải không còn cảnh báo này.
- Thẻ đầu tóm tắt: tuổi con gì, mệnh gì (nạp âm và hành).
- Nếu sinh trước Tết thì thuộc năm trước. Dòng này lấy `tuNgay` và `denNgay`:
  - "Sinh từ {tuNgay} đến {denNgay} (dương lịch) thuộc năm {canChi}".
  - Kèm câu "Theo bát tự, ranh giới năm là Lập xuân {lapXuan}".
- Bảng quan hệ ngũ hành: sinh ra, được sinh bởi, khắc, bị khắc.
- Cung phi: nam và nữ, nhóm Đông/Tây tứ mệnh.
- Màu hợp mệnh: bản mệnh, tương sinh, nên tránh.
- Bảng "Tuổi âm theo năm" cho năm hiện tại và 2 năm tới.
- Link:
  - lên `/sinh-nam`;
  - sang `/can-chi/{slug hoa giáp}`, `/nap-am/{slug}`, `/con-giap/{slug chi}`;
  - sang năm trước, năm sau.
- `generateStaticParams` cho đủ 101 năm.

### 1.3. `/can-chi/60-hoa-giap` và `/can-chi/[slug]`

- **Chỉ mục:** bảng 60 dòng: số thứ tự, hoa giáp, nạp âm, hành, con giáp.
- **Trang mục:**
  - can, chi, âm dương, nạp âm, con giáp;
  - các năm 1900–2100 mang can chi này (link tới `/sinh-nam/{y}` nếu năm thuộc 1930–2030);
  - hoa giáp đứng trước và đứng sau.
- Slug lạ thì `notFound()`.

### 1.4. `/nap-am` và `/nap-am/[slug]`

- **Chỉ mục:** 30 nạp âm, nhóm theo hành.
- **Trang mục:** hành, hai hoa giáp thuộc nạp âm này, các năm sinh tương ứng.

### 1.5. `/ngu-hanh`, `/ngu-hanh/[hanh]`, `/ngu-hanh/mau-hop-menh`

- **`/ngu-hanh`:** sơ đồ tương sinh, tương khắc vẽ bằng SVG tự vẽ: vòng 5 hành, mũi tên sinh và mũi tên khắc. Mỗi hành có màu riêng.
- **`/ngu-hanh/[hanh]`:** slug `kim`, `moc`, `thuy`, `hoa`, `tho`. Trang gồm:
  - quan hệ sinh khắc;
  - các nạp âm thuộc hành;
  - màu.
- **`/ngu-hanh/mau-hop-menh`:** bảng 5 hành × (bản mệnh, tương sinh, nên tránh).
  - Kèm ô chọn năm sinh. Chọn xong thì cuộn tới hành của năm đó, hoặc dẫn sang `/sinh-nam/{y}`.

### 1.6. `/con-giap` và `/con-giap/[slug]`

- **Chỉ mục:** 12 thẻ, gồm thứ tự, tên, địa chi.
- **Trang mục:**
  - hành của chi, âm dương;
  - tam hợp, lục hợp, lục xung (link sang con giáp tương ứng);
  - 5 hoa giáp của chi;
  - các năm sinh 1930–2030.
- **Không** dùng ảnh con vật. Nếu cần biểu tượng thì vẽ SVG đơn giản, hoặc chỉ dùng chữ Hán của chi.

### 1.7. Trang chủ và menu

Claude Code sẽ tăng `DOT_DA_DUNG` lên 3. Antigravity không sửa `dieu-huong.ts`.

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua.
- Kiểm trên dev :3047 (0 lỗi console, không có link 404):
  - `/can-chi`, `/sinh-nam`, `/sinh-nam/1990`, `/sinh-nam/2030`, `/sinh-nam/1929` (404);
  - `/can-chi/60-hoa-giap`, `/can-chi/canh-ngo`;
  - `/nap-am`, `/nap-am/lo-bang-tho`;
  - `/ngu-hanh`, `/ngu-hanh/tho`, `/ngu-hanh/mau-hop-menh`;
  - `/con-giap`, `/con-giap/ngo`.
- Đối chiếu `/sinh-nam/1990`:
  - Canh Ngọ, Lộ Bàng Thổ;
  - nam Khảm, nữ Cấn;
  - năm âm 27/01/1990–14/02/1991.
- Trang chưa có diễn giải đã duyệt phải có `noindex` trong HTML.
- Ảnh 1366 và 375 lưu `docs/v2/bang-chung/ck-f3-*.png`. Báo cáo theo mẫu Lệnh 25.

# Báo cáo Lệnh 28: Xem tuổi, Tử vi trọn đời, từ điển cung và chính tinh, Bát tự, Gieo quẻ (F4)

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- 4 tệp CSS riêng theo cụm và 4 layout tương ứng (không sửa `src/app/(v2)/ck.css`; mỗi tệp dùng tiền tố `ck-`, biến `--ck-*` trên `.ck`, không vượt quá `30.720` byte / 30 KB; mỗi `layout.tsx` chỉ nạp `@/components/ck/tu-dien.css` và tệp CSS của cụm rồi trả `<>{children}</>`):
  - `src/app/(v2)/xem-tuoi/xem-tuoi.css` (`4.351` byte) + `src/app/(v2)/xem-tuoi/layout.tsx`
  - `src/app/(v2)/tu-vi/tu-vi.css` (`7.787` byte) + `src/app/(v2)/tu-vi/layout.tsx`
  - `src/app/(v2)/bat-tu/bat-tu.css` (`5.403` byte) + `src/app/(v2)/bat-tu/layout.tsx`
  - `src/app/(v2)/kinh-dich/kinh-dich.css` (`4.341` byte) + `src/app/(v2)/kinh-dich/layout.tsx`
- 2 component dùng chung trong `src/components/ck/`:
  - `src/components/ck/HinhQue.tsx` — Hiển thị quẻ Kinh Dịch bằng 6 vạch từ hào Thượng (`H6`) xuống hào Sơ (`H1`), phân biệt vạch liền (dương) và vạch đứt (âm), đánh dấu hào động (`○` / `×` kèm giá trị), thông tin thượng/hạ quái, và chỉ gắn `<Link>` tới `/kinh-dich/que/{slug}` khi đường dẫn có trong `trangDaDung()`.
  - `src/components/ck/GieoQueClient.tsx` — Client component cho hai cách gieo quẻ trên `/kinh-dich/gieo-que`: nút `"Gieo"` sinh 6 giá trị `6|7|8|9` bằng `window.crypto.getRandomValues` rồi điều hướng sang `?xu=...`; khối `<details>` tự nhập 6 lần gieo xu thật (`0–3` ngửa); nút `"Lập quẻ Mai Hoa theo giờ hiện tại"` điều hướng tới `?cach=mai-hoa`.
- 11 tệp route trang trong `src/app/(v2)/`:
  - `src/app/(v2)/xem-tuoi/page.tsx` — Hub `/xem-tuoi`: dải thông báo Tết sắp tới từ `tetSapToi()` (link `/tet`), 2 thẻ công cụ dẫn tới `/xem-tuoi/vo-chong` và `/xem-tuoi/xong-dat`, khối `<KhoiDienGiai />` (hiện `.ck-cho-noi-dung` khi chưa có bài xuất bản), liên kết liên quan tới các trang đã dựng (`trangDaDung()`).
  - `src/app/(v2)/xem-tuoi/vo-chong/page.tsx` — Trang `/xem-tuoi/vo-chong`: form GET chọn năm sinh chồng/vợ (`1930–2010`, ghi chú âm lịch/sinh trước Tết tính năm trước), render server với `xemTuoiVoChong`, ép `noindex, follow` và canonical `https://xemboi.vn/xem-tuoi/vo-chong` khi có tham số; hiển thị hai thẻ người có link `/sinh-nam/{nam}`, bảng 4 tiêu chí với nhãn màu nhẹ `Tốt` / `Bình` / `Xấu` (không đỏ chói, không chấm điểm `/10`, không kết luận hợp/không hợp), dòng tổng `"Theo 4 tiêu chí truyền thống: X tốt, Y bình, Z xấu."` và câu tham khảo cố định.
  - `src/app/(v2)/xem-tuoi/xong-dat/page.tsx` — Trang `/xem-tuoi/xong-dat`: đầu trang ghi ngày Tết sắp tới từ `tetSapToi()` và link `/tet`; form GET `?chu=&tet=` (năm Tết mặc định `tetSapToi().namAm`), ép `noindex, follow` và canonical gốc khi có tham số; render server `goiYXongDat`: thông báo `"Không có tuổi nào hợp hoàn toàn với mọi sách"` nếu `ungVien` rỗng, danh sách thẻ ứng viên (tuổi âm, năm sinh link `/sinh-nam/{nam}`, can chi, nạp âm) kèm 4 tiêu chí trong `<details>`.
  - `src/app/(v2)/tu-vi/tron-doi/page.tsx` — Trang `/tu-vi/tron-doi`: bọc `<FormLaSo namXemMacDinh={...} tronDoi />` trong `<Suspense>`, không có luận giải; ép `noindex, follow` và canonical gốc khi có tham số hoặc chưa có nội dung xuất bản.
  - `src/app/(v2)/tu-vi/cung/page.tsx` — Chỉ mục `/tu-vi/cung`: lưới 12 thẻ cung theo thứ tự `CUNG_TU_VI` (Mệnh đến Huynh Đệ), ghi thứ tự và vị trí an nghịch từ Mệnh, `<KhoiDienGiai />`.
  - `src/app/(v2)/tu-vi/cung/[slug]/page.tsx` — Trang mục `/tu-vi/cung/[slug]` (`generateStaticParams` cho đủ 12 cung; slug ngoài danh sách gọi `notFound()`): thứ tự, vị trí so với Mệnh, cung xung chiếu, hai cung tam hợp, `<KhoiDienGiai />` (tự ép `noindex, follow` khi chưa có bản xuất bản), điều hướng cung trước/sau và liên kết 12 cung.
  - `src/app/(v2)/tu-vi/sao/page.tsx` — Chỉ mục `/tu-vi/sao`: lưới 14 chính tinh tô màu theo hành, ma trận 14 chính tinh × 12 địa chi (`Miếu`, `Vượng`, `Đắc`, `Bình`, `Hãm`) cuộn ngang bên trong khung `.ck-mt-khung` trên mobile mà trang không tràn ngang, kèm dòng nguồn cụ Thiên Lương và `<KhoiDienGiai />`.
  - `src/app/(v2)/tu-vi/sao/[slug]/page.tsx` — Trang mục `/tu-vi/sao/[slug]` (`generateStaticParams` cho đủ 14 sao; slug lạ gọi `notFound()`): ngũ hành, vị trí, danh sách `"Miếu / Vượng tại"` và `"Hãm tại"`, bảng đặc tính 12 chi, dòng nguồn cụ Thiên Lương, `<KhoiDienGiai />` (ép `noindex` khi chưa có bản xuất bản), điều hướng sao trước/sau.
  - `src/app/(v2)/bat-tu/page.tsx` — Hub `/bat-tu`: form GET ngắn gửi sang `/bat-tu/lap-la-so`, link sang biểu mẫu đầy đủ và `<KhoiDienGiai />` (khối `.ck-cho-noi-dung`).
  - `src/app/(v2)/bat-tu/lap-la-so/page.tsx` — Trang `/bat-tu/lap-la-so`: form GET ngày/tháng/năm (`1900–2100`), giờ (`0–23`), phút (`0–59`), giới tính, ô `"Sinh 23:00–23:59 tính sang ngày sau"` mặc định bật (`doiNgayLuc23`); ép `noindex, follow` và canonical gốc khi có tham số; render server `kiemTraDauVao` + `lapLaSoBatTu`: bảng Tứ trụ truyền thống 4 cột `Giờ | Ngày | Tháng | Năm` (thập thần, thiên can, địa chi tô màu hành, tàng can kèm thập thần, nạp âm), thanh đếm ngũ hành 8 chữ + `"Thiếu hành: ..."` nếu thiếu, dòng khởi vận + bảng 8 đại vận nhấn mạnh bước `dangChay`, `<details>` `"Cách tính"` (`quyUoc`), và khối chỗ giữ `"Phần luận giải đang biên tập"`.
  - `src/app/(v2)/kinh-dich/gieo-que/page.tsx` — Trang `/kinh-dich/gieo-que`: đọc `?xu=...` hoặc `?cach=mai-hoa` trên server (`gieoDongXu`, `queMaiHoaHienTai`), ép `noindex, follow` và canonical gốc khi có tham số; hiển thị `<GieoQueClient />`, ba thẻ quẻ Chủ / Hỗ / Biến cạnh nhau (`<HinhQue />`, hoặc thẻ `"Không có quẻ biến"` nếu không có hào động), `moTa` cách tính, khối chỗ giữ `"Lời quẻ đang biên tập"`.
- `docs/v2/lenh-antigravity/28-bao-cao.md` — Báo cáo này.
- 22 ảnh chụp nghiệm thu tại `docs/v2/bang-chung/` (`1366` và `375` cho 11 màn hình):
  - `ck-f4-xem-tuoi-1366.png`, `ck-f4-xem-tuoi-375.png`
  - `ck-f4-vo-chong-1366.png`, `ck-f4-vo-chong-375.png`
  - `ck-f4-xong-dat-1366.png`, `ck-f4-xong-dat-375.png`
  - `ck-f4-tron-doi-1366.png`, `ck-f4-tron-doi-375.png`
  - `ck-f4-cung-1366.png`, `ck-f4-cung-375.png`
  - `ck-f4-cung-menh-1366.png`, `ck-f4-cung-menh-375.png`
  - `ck-f4-sao-1366.png`, `ck-f4-sao-375.png`
  - `ck-f4-sao-tu-vi-1366.png`, `ck-f4-sao-tu-vi-375.png`
  - `ck-f4-bat-tu-1366.png`, `ck-f4-bat-tu-375.png`
  - `ck-f4-bat-tu-ket-qua-1366.png`, `ck-f4-bat-tu-ket-qua-375.png`
  - `ck-f4-gieo-que-thai-1366.png`, `ck-f4-gieo-que-thai-375.png`

### Tệp chỉnh sửa
- `src/components/ck/BieuTuongE3.tsx` — Bổ sung 2 biểu tượng nét vàng lá (`xong-dat`, `kinh-dich`) vào `LoaiBieuTuongCongCu` và `BieuTuongCongCu`.
- `src/components/ck/FormLaSo.tsx` — Thêm prop tùy chọn `tronDoi?: boolean`:
  - Gắn liên kết chéo cho tên cung (`/tu-vi/cung/{slug}`) và tên chính tinh (`/tu-vi/sao/{slug}`) dùng `slugViet` từ `src/lib/trang/can-chi.ts` ở phần tóm tắt cung Mệnh và danh sách tóm tắt 12 cung bên trong `<details>` (không sửa `LaSo12Cung.tsx`).
  - Khi `tronDoi = true`, hiển thị thêm dòng thời gian 12 đại vận (`ketQua.daiVan`: ngang trên desktop, dọc trên mobile) và bảng 12 đại vận 5 cột với dòng `dangChay` được nhấn mạnh.

### Xác nhận vùng cấm
- `src/app/(v2)/ck.css`: **không sửa**.
- `src/lib/**` (bao gồm `src/lib/trang/dieu-huong.ts`, `xem-tuoi.ts`, `tu-vi-tu-dien.ts`, `bat-tu.ts`, `kinh-dich.ts`, `la-so.ts`), `src/app/api/**`, `src/middleware.ts`, `prisma/**`, `scripts/**`, `src/app/quan-tri/**`, `src/app/tu-vi-2027/**`, `src/components/r1/**`, `src/app/layout.tsx`, `src/app/globals.css`, các route v1 cũ: **không sửa**.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, `TSC_EXIT=0` (0 lỗi).
2. **Kiểm tra unit test phần lõi (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/*.test.mjs`)**:
   - Đạt, `TEST_EXIT=0`: `43/43` bài test qua, 0 thất bại.
3. **Kiểm tra quy định CSS & quy ước tên lớp**:
   - Dung lượng các tệp CSS cụm: `xem-tuoi.css` `4.351` B, `tu-vi.css` `7.787` B, `bat-tu.css` `5.403` B, `kinh-dich.css` `4.341` B (đều `< 30.720` B). `src/app/(v2)/ck.css` giữ nguyên.
   - Quét `Select-String` toàn bộ tệp tạo mới/chỉnh sửa: `0` biến v1 (`--paper`, `--bg`, `--ink`), `0` tên lớp trần (`so`, `nhan`, `gia-tri`, `the`, `w`).
4. **Kiểm tra HTML thô (`fetch`, không đi theo redirect) & trạng thái `noindex` / `canonical`**:
   - Tất cả `19` URL đại diện (bao gồm cả URL gốc lẫn URL có tham số), toàn bộ `12` trang `/tu-vi/cung/{slug}` và toàn bộ `14` trang `/tu-vi/sao/{slug}` đều trả **HTTP 200**, không còn dấu `{...}` trong `<title>` hoặc `<h1>`, và có `<meta name="robots" content="noindex, follow"/>`.
   - Toàn bộ trang có tham số (`/xem-tuoi/vo-chong?chong=1990&vo=1992`, `/xem-tuoi/xong-dat?chu=1985`, `/tu-vi/tron-doi?ngay=15&thang=8&nam=1990&gio=10&gioiTinh=nam`, `/bat-tu/lap-la-so?ngay=1&thang=1&nam=2000&gio=12&phut=0&gioiTinh=nam`, `/kinh-dich/gieo-que?xu=7,7,7,8,8,8`, `/kinh-dich/gieo-que?cach=mai-hoa`) đều đặt đúng `<link rel="canonical">` về đường dẫn gốc không tham số.
   - Kiểm tra 404: `/tu-vi/cung/khong-ton-tai` và `/tu-vi/sao/khong-ton-tai` đều trả **HTTP 404**.
5. **Kiểm tra trình duyệt thực tế (`http://localhost:3047`, Chromium qua `playwright-core`) ở `1366` và `375`**:
   - **0 lỗi console** (`consoleErrors: []`), **0 `pageerror`** (`pageErrors: []`), **0 phản hồi `≥ 400`** (`badResponses: []`).
   - **0 tràn ngang** (`scrollWidth === innerWidth` ở cả `1366` và `375`) trên mọi trang đã kiểm, kể cả `/tu-vi/tron-doi` sau khi lập lá số và `/tu-vi/sao` trên `375px` (`.ck-mt-khung` cuộn ngang trong khung: `khungScrollWidth = 980`, `khungClientWidth = 341`, `pageScrollWidth = 375`).
   - **Quét liên kết nội bộ trong `<main>`**: quét `57` đường dẫn nội bộ duy nhất thu được trên các trang F4 → `0` liên kết lỗi (`brokenLinks: []`).
   - **Đối chiếu từng nghiệp vụ theo mục 2 Lệnh 28**:
     - `/xem-tuoi/vo-chong?chong=1990&vo=1992`: hiện chồng `Canh Ngọ` (cung phi `Khảm`), vợ `Nhâm Thân` (cung phi `Đoài`), tiêu chí cung phi `"Họa hại"`, tổng `"Theo 4 tiêu chí truyền thống: 1 tốt, 2 bình, 1 xấu."`, câu tham khảo và liên kết `/sinh-nam/1990`, `/sinh-nam/1992`.
     - `/xem-tuoi/xong-dat?chu=1985`: hiện Tết `Đinh Mùi` (`06/02/2027`) kèm link `/tet`, `6` thẻ ứng viên kèm `<details>` 4 tiêu chí.
     - `/tu-vi/tron-doi`: nhập `15/8/1990`, `Tỵ (09:00–10:59)`, `Nam` và bấm lập → hiện lá số 4×4, bảng đại vận `12` dòng với đúng `1` dòng đang chạy (`35–44`, `2024–2033`, `Điền Trạch`, `Tân Tỵ`, `Thiên Cơ`), dòng thời gian `grid`/`row` ở `1366` và chuyển sang `flex`/`column` ở `375`.
     - `/tu-vi/lap-la-so?ngay=15&thang=8&nam=1990&gio=10&gioiTinh=nam`: phần tóm tắt và danh sách 12 cung có đủ liên kết tới các chính tinh `/tu-vi/sao/{slug}` (kể cả `/tu-vi/sao/vu-khuc`, `/tu-vi/sao/tu-vi`) và `/tu-vi/cung/{slug}`.
     - `/tu-vi/sao` và `/tu-vi/sao/tu-vi`: `Tử Vi` hành `Thổ`, Miếu tại `Dần, Tỵ, Ngọ, Thân` (và Vượng tại `Thìn, Tuất`), không có chi hãm, đúng dòng nguồn cụ Thiên Lương.
     - `/bat-tu/lap-la-so?ngay=1&thang=1&nam=2000&gio=12&phut=0&gioiTinh=nam`: tứ trụ `Kỷ Mão` (Năm), `Bính Tý` (Tháng), `Mậu Ngọ` (Ngày), `Mậu Ngọ` (Giờ); `Thiếu hành: Kim`; `8` bước đại vận với vận 1 `Ất Hợi`, `"Khởi vận lúc 8 tuổi 3 tháng, đi nghịch."`, vận 2 (`Giáp Tuất`) đang chạy; chỗ giữ `"Phần luận giải đang biên tập"`.
     - `/kinh-dich/gieo-que?xu=7,7,7,8,8,8`: quẻ chủ `#11 Địa Thiên Thái`, quẻ hỗ `#54 Lôi Trạch Quy Muội`, thẻ `"Không có quẻ biến"`, chỗ giữ `"Lời quẻ đang biên tập"`, không gắn link `/kinh-dich/que/...`. Thử bấm nút `"Gieo"` → chuyển hướng sang `?xu=...` và hiện 3 thẻ; bấm `"Lập quẻ Mai Hoa theo giờ hiện tại"` → chuyển sang `?cach=mai-hoa` có thời điểm và 3 thẻ quẻ.
   - **Duyệt ảnh chụp 1366 và 375**: sau lượt chụp đầu phát hiện hai điểm cần tinh chỉnh: (1) dòng thời gian 12 đại vận trên `/tu-vi/tron-doi` ở `1366px` bị cắt sang cuộn ngang từ vận 10 trở đi do `minmax(124px, 1fr)`, và (2) bảng Tứ trụ ở `375px` thiếu cột `Hạng mục` dính bên trái còn viền trái nhấn mạnh dòng đang chạy trong `.ck-bang-the` chỉ bám vào ô đầu. Đã thu gọn kích thước thẻ mốc đại vận xuống `minmax(92px, 1fr)` (hiển thị trọn 12 đại vận trên `1366px`), đặt `position: sticky` cho `.ck-bt-nhan-hang` và gắn viền nhấn mạnh lên hàng `<tr>` trên mobile; chạy lại `tsc`, 43/43 test, script Playwright và kiểm tra lại ảnh chụp mới xác nhận đã khắc phục gọn gàng.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Không có lệch về kiến trúc hay vùng cấm**. Lưu ý nhỏ về hiển thị tại trang `/tu-vi/sao` và `/tu-vi/sao/[slug]`: trong dữ liệu lõi `src/lib/trang/tu-vi-tu-dien.ts`, `TEN_DAC_TINH['B']` là `'Bình hòa'`, nên bảng chi tiết `/tu-vi/sao/[slug]` giữ nguyên `'Bình hòa'`, còn ô ma trận 14×12 trên `/tu-vi/sao` hiển thị `'Bình'` theo đúng chữ nêu trong Lệnh 28 để bảng gọn và rõ.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Nâng `DOT_DA_DUNG = 4` trong `src/lib/trang/dieu-huong.ts`**: Để menu chính, chân trang, ô `"Xem tuổi vợ chồng"` / `"Lá số bát tự"` ở trang chủ, và các mục `"Lá số trọn đời"` / `"12 cung"` / `"14 chính tinh"` trên hub `/tu-vi` tự động mở liên kết tới các trang F4 đã dựng. (Hiện ở `DOT_DA_DUNG = 3`, hub `/xem-tuoi` và `/bat-tu` chưa có trên menu và `/kinh-dich` chưa có trong `trangDaDung()` nên breadcrumb của `/kinh-dich/gieo-que` hiện chữ `"Kinh Dịch"` không gắn link).
- **Hoàn thiện chỗ trống mẫu `SeoTrang` cho từ điển Tử vi**:
  - Dòng `/tu-vi/cung/{cung}` hiện có `metaDescription` chứa chỗ trống `{lĩnh vực}`.
  - Dòng `/tu-vi/sao/{sao}` hiện có `metaDescription` chứa `{Hán}` và `{nguồn}`.
  - Vì Lệnh 28 yêu cầu chỉ truyền khóa `{Tên}` và không bịa nội dung, `meta.ts` đang tự bỏ qua chuỗi `metaDescription` mẫu còn chỗ trống và dùng `description` mặc định gọn, khách quan của từng route (có log `[trang] ... còn chỗ trống chưa điền` trên console phía server ở chế độ dev). Khi có trường dữ liệu hoặc chỉnh lại mẫu `SeoTrang`, `meta.ts` sẽ dùng ngay `metaDescription` từ CSDL.
- **Xuất bản `NoiDung` và chuyển trạng thái `SeoTrang` sang `XUAT_BAN`**: Toàn bộ 12 dòng `SeoTrang` liên quan đợt F4 hiện ở trạng thái `NHAP` và chưa có bản `NoiDung` xuất bản, nên toàn bộ các trang mới đều hiển thị khối chỗ giữ (`.ck-cho-noi-dung`) và ép `robots: noindex, follow`. Khi biên tập viên xuất bản bài viết cho các hub và mục từ điển (12 cung, 14 chính tinh, lời quẻ Kinh Dịch, luận giải Bát tự), nội dung và trạng thái `index` sẽ tự động kích hoạt.

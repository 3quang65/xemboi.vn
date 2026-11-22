# Báo cáo Lệnh 25: Khung chung trang công khai v2, trang chủ, hub Tử vi, lập lá số (F1)

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/ck.css` (`52.656` byte ≤ 60 KB) — CSS hướng E3 "Sơn mài đêm trăng" mang tiền tố `ck-`, toàn bộ token màu/font/họa tiết đặt dưới `.ck { --ck-... }`, cô lập khỏi `globals.css` v1, không dùng lớp `so`, `nhan`, `gia-tri`, `the`, `w` hay biến `--paper`, `--bg`, `--ink`; kèm cầu nối cô lập dưới `.ck` cho các lớp `.r1e-*` của thành phần dùng lại từ `src/components/r1/`, quy tắc responsive (`≤ 1000px`, `≤ 700px`), `prefers-reduced-motion`, và `@media print`.
- `src/app/(v2)/layout.tsx` — Khung chung trang công khai v2: nạp font `Alegreya` (`--ck-font-tieu`) và `Be_Vietnam_Pro` (`--ck-font-chu`) qua `next/font/google`, nạp `./ck.css`, gắn `<SvgSpriteE3 />`, `<DefBieuTuongCk />`, `<DauTrang mucMenu={menuChinh()} />`, `<main id="noi-dung-chinh">`, `<ChanTrang cotChan={chanTrang()} />` trong `<div className="ck ...">`.
- `src/app/(v2)/page.tsx` — Trang chủ `/` (`export const revalidate = 3600`): `generateMetadata` qua `metaTrang('/')`, dữ liệu `thongTinTrang('/')`, `homNay()`, `menuChinh()`, `trangDaDung()`, JSON-LD `Organization` và `WebSite` (`logo: https://xemboi.vn/icons/icon.svg`), đầy đủ các khối theo thứ tự: đầu trang tối (`TranhDauTrangNen`, `TranhDauTrangDai`, H1, mô tả, `<FormLaSoNgan />`), dải "Hôm nay theo lịch" (tờ lịch bloc + chi tiết âm/dương, can chi ngày/tháng/năm, tiết khí, giờ hoàng đạo kèm khung giờ, ngày lễ nếu có, nhãn "Xem lịch tháng · Sắp có" do `/lich-am` chưa có trong `trangDaDung()`), lưới 6 công cụ kiểu tấm sơn mài, dải hub từ `menuChinh()`, khối 3 cam kết lấy nguyên văn từ `R1_COPY.hero.loiHua`.
- `src/app/(v2)/tu-vi/page.tsx` — Hub `/tu-vi`: `generateMetadata` qua `metaTrang('/tu-vi', ...)`, dùng `<KhungTrang ... toi>`, hiển thị thẻ công cụ từ con của mục `Tử vi` trong `menuChinh()` (có `<Link>` tới `/tu-vi/lap-la-so` và `/tu-vi-2027`) cùng các mục "Sắp có" (`Lá số trọn đời`, `12 cung`, `14 chính tinh` không gắn link), và khối `.ck-cho-noi-dung` cho phần "Tử vi là gì" với chữ `"Phần giới thiệu đang biên tập"`.
- `src/app/(v2)/tu-vi/lap-la-so/page.tsx` — Trang `/tu-vi/lap-la-so`: `generateMetadata` qua `metaTrang('/tu-vi/lap-la-so', ...)`, dùng `<KhungTrang ... toi rong>`, truyền `namXemMacDinh={ngayHienTaiVN().nam}` cho `<FormLaSo />` bọc trong `<Suspense>`.
- `src/components/ck/BieuTuongE3.tsx` — Gradient `#ck-vl-i`, biểu tượng vàng lá `BieuTuongCongCu`, `BieuTuongCamKet`, bảng canh giờ `CANH_GIO_OPTIONS` và `gioSangCanhGioValue`.
- `src/components/ck/DauTrang.tsx` — Header kiểu E3 (`'use client'`): dải cam kết trên cùng, logo triện `TrienXemBoi` trỏ `/`, nút CTA `Lập lá số`, menu sơn đỏ desktop từ `menuChinh()` hỗ trợ mở menu con khi rê chuột và bấm bàn phím/cảm ứng (đóng bằng `Esc` và bấm ngoài), nút `☰` ở `≤ 1000px` mở ngăn kéo có `aria-expanded`, khóa cuộn nền (`document.body.style.overflow = 'hidden'`), đóng bằng `Esc` và nút `×`.
- `src/components/ck/ChanTrang.tsx` — Chân trang sơn đen từ `chanTrang()`, dòng `"© 2026 xemboi.vn"` và `"Kết quả tra cứu chỉ để tham khảo"`.
- `src/components/ck/Breadcrumb.tsx` — Breadcrumb `<nav aria-label="Đường dẫn">` nhận `MatXich[]`, tự ẩn khi chỉ có Trang chủ (`length <= 1`), chỉ gắn `<Link>` cho mắt xích trung gian có trong `trangDaDung()`, kèm JSON-LD từ `schemaBreadcrumb`.
- `src/components/ck/KhungTrang.tsx` — Khung trang con chuẩn (tùy chọn `toi`, `rong`, breadcrumb, H1, dòng phụ, vùng nội dung ngà).
- `src/components/ck/FormLaSoNgan.tsx` — Form rút gọn ở đầu trang chủ (giới tính, ngày/tháng/năm dương, giờ sinh) kiểm tra hợp lệ ngày dương trước khi chuyển GET sang `/tu-vi/lap-la-so?ngay=..&thang=..&nam=..&gio=..&gioiTinh=..`.
- `src/components/ck/FormLaSo.tsx` — Form đầy đủ cho `/tu-vi/lap-la-so` (`'use client'`): dương/âm lịch, ô `Tháng nhuận` khi chọn âm lịch, ngày/tháng/năm, 12 canh giờ kèm khung giờ đồng hồ, phút tùy chọn, năm xem mặc định năm hiện tại, tên tùy chọn; tự điền và tự lập một lần từ query string; kiểm tra trên trình duyệt trước khi gọi `POST /api/v2/la-so`; hiện lỗi từ `loi`; hiển thị kết quả với `<LaSo12Cung laSo={ketQua.laSo} luuNien2027={ketQua.luuNien} moTaQuyUoc={ketQua.moTaQuyUoc} />`, `tomTat`, `moTaQuyUoc` (ẩn nếu rỗng), nút `"In lá số"` (`window.print()`) và `"Lập lá số khác"`, cuộn xuống kết quả; không có nút mua, giá hay luận giải.
- `docs/v2/lenh-antigravity/25-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-f1-home-1366.png`
  - `ck-f1-home-375.png`
  - `ck-f1-tu-vi-1366.png`
  - `ck-f1-tu-vi-375.png`
  - `ck-f1-lap-la-so-1366.png`
  - `ck-f1-lap-la-so-375.png`
  - `ck-f1-menu-mobile-375.png`

### Tệp đã xóa
- `src/app/page.tsx` — Trang chủ v1 (đã gỡ để không trùng route `/` với `src/app/(v2)/page.tsx`; `src/lib/home-template.ts` và `public/*.js` giữ nguyên).

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `src/middleware.ts`, `prisma/**`, `scripts/**`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/quan-tri/**`, `src/app/tu-vi-2027/**`, `src/components/r1/**`.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, thoát mã `0` (`TSC_EXIT=0`, 0 lỗi). *(Lưu ý: đã xóa tệp đệm cũ `.next/types/app/page.ts` còn sót lại sau khi gỡ `src/app/page.tsx` để `tsc` khớp với cây route mới).*
2. **Kiểm tra unit test phần lõi (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/meta-dieu-huong.test.mjs tests/trang/lich.test.mjs tests/trang/la-so.test.mjs`)**:
   - Đạt, thoát mã `0` (`TEST_EXIT=0`): 18/18 bài test qua, 0 thất bại.
3. **Kiểm tra CSS & quy ước**:
   - Dung lượng `src/app/(v2)/ck.css`: `52.656` byte (≤ `61.440` byte / 60 KB).
   - Grep trên `src/app/(v2)` và `src/components/ck`: 0 kết quả dùng biến v1 (`--paper`, `--bg`, `--ink`) hay tên lớp `so`, `nhan`, `gia-tri`, `the`, `w`.
   - Khi rà ảnh chụp lần đầu phát hiện 2 lỗi CSS: `:where` thiếu ở quy tắc `.ck a` làm chữ `"Trang chủ"` trên thanh menu nhận màu đỏ sẫm ở trang con, và nhãn `"Xem lịch tháng · Sắp có"` dùng nhầm lớp `position: absolute`. Đã sửa ngay bằng `:where(.ck) a` và lớp riêng `.ck-nhan-sap-co`, sau đó chạy lại `tsc`, test và kiểm tra lại ảnh chụp mới xác nhận đã khắc phục.
4. **Kiểm tra trình duyệt trên `http://localhost:3047` (Chromium via `playwright-core`)**:
   - Mở `/`, `/tu-vi`, `/tu-vi/lap-la-so`, `/tu-vi-2027`, `/quan-tri` (chuyển hướng `307` → `/quan-tri/dang-nhap` trả `200`): **0 lỗi console**, **0 pageerror**, **0 HTTP ≥ 400**.
   - **Cô lập giao diện**:
     - `/tu-vi-2027`: giữ nguyên `.r1e`, không có `.ck`, nền `rgb(247, 240, 225)`, chữ `rgb(31, 20, 13)`.
     - `/quan-tri` (`/quan-tri/dang-nhap`): không có `.ck`, nền `rgb(244, 234, 213)`, chữ `rgb(42, 29, 20)` — không đổi giao diện.
   - **Luồng từ trang chủ & lập lá số `15/8/1990, 10 giờ, nam`**:
     - Điền form rút gọn ở `/` → chuyển sang `/tu-vi/lap-la-so?ngay=15&thang=8&nam=1990&gio=9&gioiTinh=nam`, tự điền form và tự lập ra đủ 12 cung 4×4, không có nút mua hay giá, không tràn ngang ở `1366px` (`scrollWidth = 1366`) lẫn `375px` (`scrollWidth = 375`, có danh sách đọc từng cung `.r1e-ds-cung`).
     - Đối chiếu cung Mệnh của lá số `15/8/1990, 10 giờ, nam` giữa `/tu-vi/lap-la-so` (với `namXem=2027`) và `/tu-vi-2027`: **khớp hoàn toàn** — `M.Dần` (`data-chi="2"`), `MỆNH`, chính tinh `VŨ KHÚC (V)`, `THIÊN TƯỚNG (M)`, phụ tinh gốc `Phi Liêm`, `Hóa Quyền (H)`, `Thiên Trù`, `Bạch Hổ`, `Thiên Hình (Đ)`.
     - Đã kiểm thêm nút `"Lập lá số khác"` (xóa kết quả), chuyển `"Âm lịch"` hiện ô `"Tháng nhuận"`, và kiểm tra ngày sai `31/2` hiện lỗi `"Ngày dương lịch không tồn tại."`.
   - **Liên kết & điều hướng**:
     - Kiểm tra mọi `href` trên header, footer, `/`, `/tu-vi`, `/tu-vi/lap-la-so` (`/`, `/tu-vi`, `/tu-vi/lap-la-so`, `/tu-vi-2027`): tất cả trả `200`, 0 liên kết 404.
     - Desktop dropdown `Tử vi` mở bằng click/hover và đóng bằng `Esc`. Menu mobile `375px` cập nhật `aria-expanded` (`false` → `true` → `false`), khóa `document.body.style.overflow = "hidden"`, đóng được bằng `Esc` và nút `×`.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Cầu nối 6 biến CSS và tạo kiểu có tiền tố `.ck .r1e-*` trong `ck.css`**:
   - *Lý do*: Lệnh 25 yêu cầu tái sử dụng `LaSo12Cung`, `HoaVanE3`, `TranhDauTrang` từ `src/components/r1/` mà **không sửa** `src/components/r1/**`. Các component này gắn cứng tên lớp `.r1e-*` và các biến `--f-tieu`, `--kim`, `--moc`, `--thuy`, `--hoa`, `--tho`. Để hiển thị đúng E3 và tránh bị `globals.css` v1 ghi đè (nhất là ở chế độ tối), `ck.css` khai báo 6 biến cầu nối và các quy tắc `.r1e-*` đặt **bên trong bộ chọn `.ck`**, bảo đảm không rò ra ngoài `(v2)`.
2. **Tách giờ Tý thành 2 lựa chọn trong `CANH_GIO_OPTIONS` (`Tý sớm 00:00–00:59` và `Tý muộn 23:00–23:59`)**:
   - *Lý do*: Theo quy ước Nam Phái của engine `tuvi-v2` (`gioTyMuon: 'ngaySau'`), sinh từ `23:00–23:59` được tính sang ngày hôm sau còn `00:00–00:59` giữ ngày hiện tại. Nếu gộp chung thành 1 lựa chọn giờ Tý, người dùng sẽ không phân biệt được hai mốc giờ này; khi nhận query `?gio=..` từ bên ngoài, `FormLaSo` giữ đúng giờ đồng hồ gốc cho lần tự lập đầu tiên để khớp tuyệt đối với kết quả `/tu-vi-2027`.
3. **Tên tùy chọn trên `/tu-vi/lap-la-so`**:
   - *Lý do*: Component dùng lại `LaSo12Cung` luôn cố định dòng `Họ tên: Đã ẩn` bên trong Thiên bàn (`src/components/r1/LaSo12Cung.tsx`). Vì không được sửa `components/r1`, `FormLaSo` hiển thị tên (nếu người dùng nhập) ở tiêu đề `<h2>` ngay phía trên lá số (`Lá số Tử Vi · <tên>`), còn bên trong Thiên bàn giữ nguyên theo `LaSo12Cung`.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Nội dung biên tập (`NoiDung`) cho `/tu-vi`**: Khối `"Tử vi là gì"` trên `/tu-vi` hiện đặt khối giữ chỗ `"Phần giới thiệu đang biên tập"`. Cần nối `noiDungTheoDuongDan('/tu-vi')` khi đã có bài xuất bản ở F5.
- **Trạng thái `SeoTrang` cho `/tu-vi` và `/tu-vi/lap-la-so`**: Truy vấn CSDL cho thấy `/` và `/tu-vi-2027` đang ở `XUAT_BAN`, còn `/tu-vi` và `/tu-vi/lap-la-so` vẫn đang ở `NHAP` (nên `metaTrang` đang trả `noindex, follow` đúng quy tắc mục 2.3 tài liệu `19-frontend-v2.md`). Cần biên tập viên/anh Cường bấm xuất bản khi nghiệm thu xong.
- **Các đường dẫn chưa dựng ở F1**: `/lich-am`, `/sinh-nam`, `/xem-tuoi/vo-chong`, `/bat-tu/lap-la-so`, `/tu-vi/tron-doi`, `/tu-vi/cung`, `/tu-vi/sao` đang hiện `"Sắp có"` theo `trangDaDung()` (`DOT_DA_DUNG = 1`). Sẽ tự động bật liên kết khi tăng `DOT_DA_DUNG` ở các đợt F2–F5.
- **Tùy chọn hiển thị tên trong `LaSo12Cung`** *(không bắt buộc)*: Nếu muốn in tên lên dòng `Họ tên` trong Thiên bàn ở trang `/tu-vi/lap-la-so` mà vẫn ẩn ở `/tu-vi-2027`, cần bổ sung prop tùy chọn cho `LaSo12Cung.tsx` ở đợt sau.

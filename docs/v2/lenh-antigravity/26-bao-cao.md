# Báo cáo Lệnh 26: Cụm Lịch âm v2 & Tết (F2)

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/components/ck/lichHelpers.ts` — Các hàm thuần dùng chung cho server và client: phạm vi năm `NAM_MIN = 1900`..`NAM_MAX = 2100`, `hai`, `trongPhamViNam`, `tenThangAmClient`, `nhanNgayAmChu`, `dinhDangNgayVN`, `dinhDangNgayThangVN`, `duongDanThang`, `duongDanNgay`, `duongDanNgayTuIso`, `thuTuIso`, `ngayKeTiep`, `ngayDuongHopLe`.
- `src/components/ck/ChiTietNgay.tsx` — Khối tờ lịch bloc kèm bảng chi tiết ngày âm/dương, can chi ngày/tháng/năm, nạp âm, tiết khí, ngày lễ, và bảng đủ 12 giờ trong ngày (tô nổi bật 6 giờ Hoàng đạo).
- `src/components/ck/LichThang.tsx` — Lưới tháng dương lịch 6×7 bắt đầu Thứ hai (`LichThang`) với số dương lớn, số âm nhỏ, màu nhấn mùng 1 & ngày rằm, chấm & tooltip ngày lễ (nhãn tên lễ trên desktop), viền ô hôm nay, làm mờ ô ngoài tháng, mỗi ô là link tới `/lich-am/{yyyy}/{mm}/{dd}` (ẩn link nếu ngoài 1900–2100), giữ nguyên 7 cột ở màn hình `375px` không cuộn ngang; kèm `LichThangThuNho` cho 12 lưới thu nhỏ trên trang năm.
- `src/components/ck/ChonThang.tsx` — Client component gồm hai `select` tháng (1–12) và năm (1900–2100) cùng nút `"Xem"` điều hướng tới `/lich-am/{yyyy}/{mm}`.
- `src/components/ck/DoiNgayClient.tsx` — Client component dùng thuần engine `src/lib/tuvi-v2/am-lich.ts` (`duongSangAm`, `amSangDuong`, `canChiNgay`, `canChiThang`, `canChiNam`, `napAm`, `hanhNapAm`, `thangNhuan`), có 2 tab `Dương lịch → Âm lịch` và `Âm lịch → Dương lịch` (kèm ô `"Tháng nhuận"` và gợi ý tháng nhuận thực tế của năm), phạm vi 1900–2100, báo lỗi rõ khi `amSangDuong` trả `null`, hiện can chi/nạp âm và link `"Xem chi tiết ngày"`.
- `src/components/ck/DemNguocTet.tsx` — Client component đếm ngược ngày và giờ tới 00:00 Mùng 1 Tết theo giờ Việt Nam (`+07:00`).
- `src/app/(v2)/lich-am/page.tsx` — Hub `/lich-am` (`revalidate = 3600`): `generateMetadata` qua `metaTrang` với đầy đủ tham số mẫu, đầu trang tối chứa H1 + mô tả + `<ChiTietNgay>` của `homNay()`, `<LichThang>` tháng hiện tại có điều hướng tháng trước/sau, và 4 thẻ công cụ (`Đổi ngày âm dương`, `Lịch vạn niên`, `Lịch âm ngày mai`, `Tết Nguyên Đán`).
- `src/app/(v2)/lich-am/doi-ngay/page.tsx` — Trang `/lich-am/doi-ngay`: đọc `?d=&m=&y=&chieu=&nhuan=` để điền sẵn form; khi có tham số đặt `robots: { index: false, follow: true }` và `canonical` về `https://xemboi.vn/lich-am/doi-ngay`.
- `src/app/(v2)/lich-am/lich-van-nien/page.tsx` — Trang `/lich-am/lich-van-nien` (`revalidate = 3600`): `<ChonThang>`, `<LichThang>` tháng hiện tại và bảng 24 tiết khí năm hiện tại (có link tới từng ngày).
- `src/app/(v2)/lich-am/ngay-mai/page.tsx` — Trang `/lich-am/ngay-mai` (`revalidate = 3600`): `<ChiTietNgay>` của `ngayMai()` kèm điều hướng về hôm nay, lịch tháng và ngày kia.
- `src/app/(v2)/lich-am/[yyyy]/page.tsx` — Trang năm `/lich-am/{yyyy}` (1900–2100, ngoài khoảng gọi `notFound()`): `generateStaticParams` cho 2020–2035 (`NAM_LICH_INDEX_TU..NAM_LICH_INDEX_DEN`), ép `noindex, follow` khi `!tongQuanNam(y).duocIndex`, tóm tắt Tết & tháng nhuận, 12 `<LichThangThuNho>`, bảng 24 tiết khí, bảng ngày lễ âm lịch, link năm trước/sau.
- `src/app/(v2)/lich-am/[yyyy]/[mm]/page.tsx` — Trang tháng `/lich-am/{yyyy}/{mm}` (`mm` 2 chữ số `01–12`, năm 1900–2100, sai gọi `notFound()`): ép `noindex, follow` ngoài 2020–2035, `<ChonThang>`, tóm tắt `thangAm[]` và tiết khí trong tháng, `<LichThang>`, bảng ngày lễ trong tháng, điều hướng tháng trước/năm/tháng sau.
- `src/app/(v2)/lich-am/[yyyy]/[mm]/[dd]/page.tsx` — Trang ngày `/lich-am/{yyyy}/{mm}/{dd}` (kiểm tra `ngayHopLe` và phạm vi 1900–2100, sai gọi `notFound()`): **luôn** trả `robots: { index: false, follow: true }`, `<ChiTietNgay>` cùng link ngày trước/tháng/năm/ngày sau.
- `src/app/(v2)/tet/page.tsx` — Trang `/tet` (`revalidate = 3600`): dữ liệu từ `tetSapToi()` và `leAmTrongNam()`, `<DemNguocTet>`, bảng ngày lễ quanh Tết (Ông Công ông Táo, Giao thừa năm trước Tết; Mùng 1–3 Tết và Rằm tháng Giêng năm Tết), khối `.ck-cho-noi-dung` giữ chỗ phong tục Tết.
- `docs/v2/lenh-antigravity/26-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (mỗi trang ở `1366` và `375`):
  - `ck-f2-lich-am-1366.png`, `ck-f2-lich-am-375.png`
  - `ck-f2-doi-ngay-1366.png`, `ck-f2-doi-ngay-375.png`
  - `ck-f2-van-nien-1366.png`, `ck-f2-van-nien-375.png`
  - `ck-f2-ngay-mai-1366.png`, `ck-f2-ngay-mai-375.png`
  - `ck-f2-nam-2026-1366.png`, `ck-f2-nam-2026-375.png`
  - `ck-f2-thang-2026-02-1366.png`, `ck-f2-thang-2026-02-375.png`
  - `ck-f2-ngay-2026-02-17-1366.png`, `ck-f2-ngay-2026-02-17-375.png`
  - `ck-f2-tet-1366.png`, `ck-f2-tet-375.png`

### Tệp chỉnh sửa
- `src/components/ck/BieuTuongE3.tsx` — Bổ sung 4 loại biểu tượng vàng lá (`doi-ngay`, `van-nien`, `ngay-mai`, `tet`) vào `LoaiBieuTuongCongCu` và `BieuTuongCongCu`.
- `src/app/(v2)/ck.css` — Bổ sung quy tắc tiền tố `ck-` cho các component lịch âm & Tết, chỉnh `.ck-lich-chi-tiet` đặt rõ `color: var(--ck-muc)` khi nằm trong `.ck-toi`, thêm quy tắc responsive `≤ 1000px` và `≤ 700px` (giữ lưới 7 cột trên mobile, không tràn ngang), và rút gọn khoảng trắng phần `@media` để tổng dung lượng giữ dưới trần 60 KB (`60.598` byte ≤ `61.440` byte).

### Xác nhận vùng cấm
- Không sửa `src/lib/**` (bao gồm `src/lib/trang/dieu-huong.ts`), `src/app/api/**`, `src/middleware.ts`, `prisma/**`, `scripts/**`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/quan-tri/**`, `src/app/tu-vi-2027/**`, `src/components/r1/**`.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, thoát mã `0` (`TSC_EXIT=0`, 0 lỗi).
2. **Kiểm tra unit test phần lõi (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/*.test.mjs`)**:
   - Đạt, thoát mã `0` (`TEST_EXIT=0`): 42/42 bài test qua, 0 thất bại.
3. **Kiểm tra CSS & quy ước**:
   - Dung lượng `src/app/(v2)/ck.css`: `60.598` byte (`≤ 61.440` byte / 60 KB).
   - Quét `Select-String` trên `src/app/(v2)` và `src/components/ck`: `FORBIDDEN_COUNT=0` (0 biến v1 `--paper`, `--bg`, `--ink`; 0 tên lớp trần `so`, `nhan`, `gia-tri`, `the`, `w`).
4. **Kiểm tra trình duyệt & HTML trên `http://localhost:3047` (Chromium via `playwright-core` & `fetch`)**:
   - **Tình trạng HTTP 200, 0 lỗi console, 0 pageerror, 0 tràn ngang (`scrollWidth === innerWidth` ở cả `1366` và `375`), 0 chỗ trống `{...}` sót trong title/description/H1** trên tất cả trang:
     - `/lich-am`, `/lich-am/doi-ngay`, `/lich-am/doi-ngay?d=17&m=2&y=2026&chieu=duong`, `/lich-am/lich-van-nien`, `/lich-am/ngay-mai`, `/lich-am/2026`, `/lich-am/1999`, `/lich-am/2026/02`, `/lich-am/2026/02/17`, `/lich-am/2026/02/16`, `/tet`.
   - **Kiểm tra liên kết**: quét toàn bộ 187 đường dẫn nội bộ duy nhất trong `<main>` trên các trang đã mở — `0` liên kết lỗi (`brokenLinks: []`).
   - **Kiểm tra 404**: `/lich-am/1899` → `404`; `/lich-am/2026/13` → `404`; `/lich-am/2026/02/30` → `404`.
   - **Đối chiếu tay**:
     - `/lich-am/2026/02/17`: hiển thị `Thứ ba, ngày 17/02/2026 — mùng 1 tháng Giêng năm Bính Ngọ`, ngày lễ `Tết Nguyên Đán`.
     - `/lich-am/2026/02/16`: hiển thị có `Giao thừa`.
   - **Mã nguồn HTML thô (`robots` & `canonical`)**:
     - `/lich-am/2026/02/17`: `<meta name="robots" content="noindex, follow"/>`.
     - `/lich-am/1999`: `<meta name="robots" content="noindex, follow"/>`.
     - `/lich-am/1999/05`: `<meta name="robots" content="noindex, follow"/>`.
     - `/lich-am/doi-ngay?d=17&m=2&y=2026&chieu=duong`: `robots` là `noindex, follow`, `canonical` về `https://xemboi.vn/lich-am/doi-ngay`.
   - **Kiểm tra tương tác client**:
     - `/lich-am/doi-ngay`: chuyển tab `Âm lịch → Dương lịch`, thử `15/4/2026` có chọn `Tháng nhuận` → hiện báo lỗi `"Năm âm lịch 2026 (Bính Ngọ) không có tháng nhuận."`; bỏ chọn nhuận và đổi `1/1/2026` → hiện `"Thứ ba, 17/02/2026"`, `"Mùng 1 tháng Giêng năm Bính Ngọ"`, và link `/lich-am/2026/02/17`.
     - `/lich-am/lich-van-nien`: chọn Tháng 2, Năm 2026, bấm `"Xem"` → điều hướng tới `/lich-am/2026/02`.
   - **Duyệt ảnh chụp 1366 và 375**: sau lượt chụp đầu phát hiện nhãn `"Hoàng đạo"` ở ô `Giờ Thân` trên màn hình `375px` bị xuống dòng; đã chỉnh `white-space: nowrap` và thu gọn padding ô giờ ở `≤ 700px` trong `ck.css`, sau đó chạy lại toàn bộ `tsc`, test, `verify-f2.mjs` và kiểm tra lại ảnh mới xác nhận khắc phục sạch.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Rút gọn khoảng trắng định dạng phần `@media` trong `src/app/(v2)/ck.css`**:
   - *Lý do*: Khi bổ sung CSS cho 5 component và 8 route của cụm Lịch âm, dung lượng `ck.css` chạm ngưỡng `61.555` byte (vượt `61.440` byte đúng 115 byte). Để tuân thủ chặt trần 60 KB (`19-frontend-v2.md`), đã bỏ khoảng trắng/xuống dòng thừa ở phần `@media` mà giữ nguyên toàn bộ bộ chọn và giá trị thuộc tính của Lệnh 25, đưa tổng dung lượng xuống `60.598` byte.
2. **Bảo vệ link biên năm `1900–2100` trong `LichThang` và `ChiTietNgay`/`ngay-mai`/`[dd]`**:
   - *Lý do*: Tháng 01/1900 và 12/2100 có các ô ngoài tháng rơi sang năm 1899 hoặc 2101 (trả 404 theo đặc tả `[yyyy]`), và trang chi tiết ngày ở hai đầu biên 01/01/1900 hoặc 31/12/2100 không có ngày trước/sau hợp lệ. Do đó các hàm helper chỉ gắn `<Link>` khi năm thuộc `1900–2100`, tránh phát sinh liên kết 404.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Tăng `DOT_DA_DUNG` lên `2` trong `src/lib/trang/dieu-huong.ts`**: Hiện trang chủ `src/app/(v2)/page.tsx` đã đọc `trangDaDung()`; khi Claude Code tăng `DOT_DA_DUNG = 2`, menu chính, chân trang, nút `"Xem lịch tháng"` và ô `"Lịch âm hôm nay"` trên trang chủ sẽ tự động bật liên kết tới cụm Lịch âm.
- **Bổ sung `/tet` vào `trangDaDung(2)` và `menuChinh(2)`** *(nếu muốn)*: Hiện `TAT_CA` ở `dieu-huong.ts` chưa liệt kê `/tet` trong nhánh `Lịch âm` nên ở trang `/tet`, mắt xích `Lịch âm` trong breadcrumb sẽ chỉ có link khi `DOT_DA_DUNG = 2`, còn bản thân `/tet` vẫn chưa xuất hiện trong menu/chân trang nếu không thêm vào `TAT_CA` hoặc `trangDaDung`.
- **Xuất bản `SeoTrang` cho cụm Lịch âm và `/tet`**: Các dòng `/lich-am`, `/lich-am/doi-ngay`, `/lich-am/lich-van-nien`, `/lich-am/ngay-mai`, `/lich-am/{yyyy}`, `/lich-am/{yyyy}/{mm}`, `/tet` trong CSDL hiện đang ở `trangThai = NHAP` (nên `metaTrang` đang trả `noindex, follow`). Cần biên tập viên/anh Cường chuyển sang `XUAT_BAN` cho các trang hợp chuẩn khi nghiệm thu xong (riêng `/lich-am/{yyyy}/{mm}/{dd}` luôn giữ `noindex, follow` theo lệnh).
- **Nội dung biên tập phong tục cho `/tet`**: Khối `.ck-cho-noi-dung` trên `/tet` hiện đặt chữ giữ chỗ `"Phần giới thiệu phong tục ngày Tết đang biên tập."`, cần nối `noiDungTheoDuongDan('/tet')` khi có bài xuất bản ở F5.

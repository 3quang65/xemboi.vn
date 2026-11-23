# Báo cáo Lệnh 37: Thêm phần ý nghĩa vào cụm `/than-so-hoc` (lời Nhật Nguyệt + nguyên văn sách cổ)

Ngày hoàn thành: 23/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/than-so-hoc/theo-ten/KetQuaTenUi.tsx` (`2.826` byte) — Tách `TheChiSoTen` và `KetQuaTenHienThi` từ `ThanSoHocUi.tsx` sang tệp riêng chỉ dùng `@/lib/trang/than-so-hoc` và `../ThanSoHocHelpers` để component client `TinhTheoTenClient.tsx` không kéo gián tiếp `than-so-hoc-y-nghia.ts` và tệp JSON 160 KB vào bundle client.
- `docs/v2/lenh-antigravity/37-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`8` ảnh):
  - `ck-tsh-yn-so-chu-dao-7-1366.png` (`1.204.777` byte), `ck-tsh-yn-so-chu-dao-7-375.png` (`852.529` byte)
  - `ck-tsh-yn-nam-ca-nhan-1-1366.png` (`1.335.428` byte), `ck-tsh-yn-nam-ca-nhan-1-375.png` (`1.034.989` byte)
  - `ck-tsh-yn-bieu-do-1985-10-13-1366.png` (`1.561.084` byte), `ck-tsh-yn-bieu-do-1985-10-13-375.png` (`1.366.206` byte)
  - `ck-tsh-yn-hub-1366.png` (`1.223.410` byte), `ck-tsh-yn-hub-375.png` (`907.741` byte)

### Tệp chỉnh sửa
- `src/app/(v2)/than-so-hoc/ThanSoHocUi.tsx` (`13.696` byte) — Đánh dấu chỉ dùng ở server component; chuyển `KetQuaTenHienThi` sang `theo-ten/KetQuaTenUi.tsx`; cập nhật doc comment `KhoiGhiChuYNghia`; thêm `DongGhiCongYNghia` (`Dữ liệu: Nhật Nguyệt (nhatnguyet.org)` gắn liên kết `NGUON_Y_NGHIA.url` với `rel="noopener"`), `TrichSachItem` (`<blockquote lang="en">`, dòng nguồn `*{sach}*, {tacGia}, {chuong}.`, tự thu gọn đoạn dài > 600 ký tự vào `<details><summary>Đọc đoạn trích (tiếng Anh)</summary>`), và `KhoiYNghia` (hỗ trợ `gon`, `anGhiChu`, `thuGonTrichChung`, `capTieuDe`, tách rõ `trichRieng` và `trichChung`, cuối khối có dòng ghi công và danh sách `sachDuocTrich`).
- `src/app/(v2)/than-so-hoc/so-chu-dao/[so]/page.tsx` (`8.471` byte) — Thêm mục `<h2>Ý nghĩa số chủ đạo {n}</h2>` + `<KhoiYNghia y={yNghia('so-chu-dao', n)} />` ngay sau mục `"Tổng nào ra {n}"` và trước `"Ví dụ ngày sinh"`; gỡ `<KhoiGhiChuYNghia />` cũ ở cuối trang, giữ `<KhoiGioiHan />`.
- `src/app/(v2)/than-so-hoc/so-chu-dao/page.tsx` (`12.081` byte) — Ở khối kết quả khi đã nhập ngày, thay `<KhoiGhiChuYNghia />` cũ bằng `<KhoiYNghia y={yNghia('so-chu-dao', ketQua.cach1.so)} gon capTieuDe="h4" />` kèm liên kết `"Xem thêm →"`; giữ nguyên giao diện khi chưa nhập ngày.
- `src/app/(v2)/than-so-hoc/nam-ca-nhan/[so]/page.tsx` (`6.197` byte) — Thêm mục `<h2>Ý nghĩa năm cá nhân {n}</h2>` + `<KhoiYNghia y={yNghia('nam-ca-nhan', n)} />` ngay sau khối cách tính đầu trang; gỡ `<KhoiGhiChuYNghia />` cũ ở cuối trang, giữ `<KhoiGioiHan />`.
- `src/app/(v2)/than-so-hoc/bieu-do-ngay-sinh/page.tsx` (`12.925` byte) — Giữ nguyên khi chưa nhập ngày; khi đã nhập ngày: đặt `<KhoiGhiChuYNghia />` ngay trên nhóm phần ý nghĩa, bổ sung ý nghĩa `dinh-cao` chế độ `gon` kèm `<details>` `"Sách cổ viết về con số …"`, bảng `4 số thách thức` + ý nghĩa `thach-thuc` chế độ `gon` (kể cả số 0), `Số thái độ` (`thaiDo`) + `thai-do` chế độ `gon`, `Số ngày sinh` (`rutDon(ngay)`) + `ngay-sinh` chế độ `gon`, và khối `Nợ nghiệp` (`noNghiepNgaySinh(ngay)` cho ngày 13, 14, 16, 19) kèm câu nguyên văn và `trichChung` thu gọn; gỡ `<KhoiGhiChuYNghia />` cũ ở cuối kết quả.
- `src/app/(v2)/than-so-hoc/page.tsx` (`8.532` byte) — Bổ sung dòng ngắn `loi` loại `manh` vào 12 ô số chủ đạo, `loi` loại `yNghia` vào 9 ô năm cá nhân, và gắn `<DongGhiCongYNghia className="ck-tsh-yn-nguon-luoi" />` dưới mỗi lưới.
- `src/app/(v2)/than-so-hoc/theo-ten/TinhTheoTenClient.tsx` (`2.403` byte) — Đổi import `KetQuaTenHienThi` sang `./KetQuaTenUi` và gỡ `<KhoiGhiChuYNghia />` khỏi phần kết quả client.
- `src/app/(v2)/than-so-hoc/theo-ten/page.tsx` (`2.491` byte) — Đổi import `KetQuaTenHienThi` sang `./KetQuaTenUi`.
- `src/app/(v2)/than-so-hoc/than-so-hoc.css` (`21.763` byte ≤ `30.720` byte / 30 KB) — Chuyển lưới hub 12 số chủ đạo và 9 năm cá nhân sang 3 cột desktop / 2 cột tablet / 1 cột mobile; bổ sung lớp `.ck-tsh-yn-*` cho `<dl>` (2 cột ở desktop, 1 cột ở `≤ 700px`), trích dẫn `blockquote` kiểu cụm Chiêm tinh (`white-space: pre-line`, `overflow-wrap: anywhere`), `<details>` gọn gàng không tràn ngang, lưới 2 cột thẻ chỉ số trên biểu đồ ngày sinh.

### Tệp xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `package.json`, `tests/**`.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, thoát mã `0` (`TSC_EXIT=0`, 0 lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test --test-concurrency=2 tests/trang/*.test.mjs`)**:
   - Đạt, thoát mã `0` (`TEST_EXIT=0`): `115/115` bài test qua, `0` thất bại (gồm đủ `12/12` bài trong `tests/trang/than-so-hoc.test.mjs`).
3. **Kiểm tra dung lượng CSS, import client và build production (`next build`)**:
   - `src/app/(v2)/than-so-hoc/than-so-hoc.css`: `21.763` byte (≤ 30 KB), `0` biến v1 (`--paper`, `--bg`, `--ink`).
   - Quét toàn bộ tệp `'use client'` trong `src/`: `0` tệp import `than-so-hoc-y-nghia` hay `ThanSoHocUi` (`CLIENT_IMPORT_CHECK_OK`).
   - `.\node_modules\.bin\next.cmd build` thoát mã `0` (`BUILD_EXIT=0`), dựng đủ `617/617` trang (`/than-so-hoc/theo-ten` có First Load JS `110 kB`, size trang `3.39 kB`).
   - Tìm chuỗi `"Cheasley"` trong toàn bộ `.next\static`: `CHEASLEY_HITS=0` (JSON không bị kéo vào bundle client).
4. **Kiểm tra trên dev server (`http://127.0.0.1:3050`) và trình duyệt (`playwright-core` + Chrome)**:
   - **29/29 URL kiểm tra trả HTTP 200**: `/than-so-hoc`, 12 trang `/than-so-hoc/so-chu-dao/{1..9,11,22,33}`, 9 trang `/than-so-hoc/nam-ca-nhan/{1..9}`, `/than-so-hoc/bieu-do-ngay-sinh` (kèm `?ngay=1990-08-15`, `?ngay=1985-10-13`, `?ngay=2000-01-01`), `/than-so-hoc/so-chu-dao` (kèm `?ngay=1990-08-15`), `/than-so-hoc/theo-ten`.
   - **Đối chiếu dữ liệu với kho `than-so-hoc-nhat-nguyet.json` (và bảng `SUA_OCR` của `than-so-hoc-y-nghia.ts`)**:
     - `/than-so-hoc/so-chu-dao/7`: mục `Điểm mạnh` hiển thị đúng `"Phân tích sâu, tìm kiếm chân lý, thiên về tâm linh/tri thức."`, có `3` đoạn `trichRieng` dưới tiêu đề `"Sách cổ viết về số chủ đạo 7"` và không có `trichChung`.
     - `/than-so-hoc/so-chu-dao/33`: có `10` đoạn `trichChung` dưới tiêu đề `"Sách cổ viết về con số 33 nói chung"` kèm dòng `"Các đoạn này nói về con số 33, không riêng cho số chủ đạo."` và `0` đoạn `trichRieng`.
     - `/than-so-hoc/so-chu-dao/1`: có `3` đoạn `trichRieng` dưới tiêu đề `"Sách cổ viết về số chủ đạo 1"` và không có mục `"nói chung"`.
     - `/than-so-hoc/nam-ca-nhan/1`: mục `"Ý nghĩa năm cá nhân 1"` đặt sau khối cách tính, có `10` đoạn `trichChung` kèm dòng giải thích không riêng cho năm cá nhân.
     - `/than-so-hoc/bieu-do-ngay-sinh?ngay=1985-10-13`: có `GHI_CHU_Y_NGHIA` đặt trên phần ý nghĩa, 4 đỉnh cao (`5, 9, 5, 6`) kèm `<details>` sách cổ, bảng và thẻ 4 thách thức (`3, 1, 2, 4`), số thái độ `5`, số ngày sinh `4`, khối nợ nghiệp `13` với câu `"Ngày sinh 13 được thần số học xếp vào nhóm nợ nghiệp (13, 14, 16, 19)."` + `10` đoạn `trichChung` thu gọn; `?ngay=1990-08-15` không hiện nợ nghiệp; `?ngay=2000-01-01` hiện thách thức số `0` kèm ý nghĩa từ kho; URL không tham số giữ nguyên không hiện khối ý nghĩa.
     - `/than-so-hoc`: lưới 12 số chủ đạo in đủ lời `manh`, lưới 9 năm cá nhân in đủ lời `yNghia`, mỗi lưới có dòng ghi công riêng ở dưới.
     - Mọi khối `.ck-tsh-yn-khoi` và cả 2 lưới trên hub đều có `"Dữ liệu: Nhật Nguyệt (nhatnguyet.org)"` với `<a href="https://nhatnguyet.org" rel="noopener">`.
     - Mọi `<blockquote lang="en">` khớp nguyên văn với kho sau `SUA_OCR`, không có câu nào bị dịch; mọi đoạn > 600 ký tự nằm trong `<details><summary>Đọc đoạn trích (tiếng Anh)</summary>`.
     - `/than-so-hoc/theo-ten`: nhập `"Nguyễn Thị Mỹ Đức"` bấm `"Tính"` vẫn tính hoàn toàn trên máy (`0` request mạng) và không hiện câu `GHI_CHU_Y_NGHIA` thừa.
   - **Console, tràn ngang, liên kết nội bộ và duyệt ảnh chụp**:
     - `0` lỗi console, `0` `pageerror`, `0` response lỗi trên toàn bộ 29 URL.
     - `0` tràn ngang (`scrollWidth <= clientWidth`) ở cả `1366px` và `375px` trên toàn bộ 29 URL (kể cả khi mở toàn bộ `<details>` ở `375px` trên trang số chủ đạo 33, năm cá nhân 1, biểu đồ `1985-10-13`).
     - Quét `100` liên kết nội bộ duy nhất trong `<main>` trên cụm `/than-so-hoc`: `0` liên kết lỗi (`linkStatusBad: []`).
     - Mở xem trực tiếp cả `8` ảnh chụp (`1366px` và `375px`): `<dl>` 2 cột gọn ở desktop và 1 cột rõ ràng ở `375px`, `blockquote` khung ngà viền đồng giống cụm Chiêm tinh, `<details>` không tràn ngang, nút và chữ tương phản rõ.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Tách `KetQuaTenUi.tsx` khỏi `ThanSoHocUi.tsx`**:
   - *Lý do*: `TinhTheoTenClient.tsx` là client component (`'use client'`) và trước đây import `KetQuaTenHienThi` từ `ThanSoHocUi.tsx`. Nếu đặt `KhoiYNghia` (import `NGUON_Y_NGHIA`, `sachDuocTrich` từ `than-so-hoc-y-nghia.ts`) vào `ThanSoHocUi.tsx` mà giữ import đó, Next.js có thể kéo tệp JSON ~160 KB vào client bundle của `/than-so-hoc/theo-ten`. Tách riêng giúp giữ nguyên client bundle gọn nhẹ (`CHEASLEY_HITS=0`).
2. **Thay `<KhoiGhiChuYNghia />` ở `so-chu-dao/page.tsx` bằng `KhoiYNghia` chế độ `gon` và gỡ khỏi `TinhTheoTenClient.tsx`**:
   - *Lý do*: Nội dung mới của `GHI_CHU_Y_NGHIA` bắt đầu bằng `"Phần ý nghĩa dưới đây là lời của Nhật Nguyệt..."`. Trên công cụ `/than-so-hoc/so-chu-dao?ngay=...`, thay bằng `KhoiYNghia gon` giúp câu ghi chú khớp với nội dung ngay dưới; trên `/than-so-hoc/theo-ten` (client-only, không có kho ý nghĩa), gỡ câu này để không hiện lời dẫn trơ trọi.
3. **Đặt `<KhoiGhiChuYNghia />` một lần trên nhóm chỉ số của `/than-so-hoc/bieu-do-ngay-sinh` và không dựng `<details>` rỗng cho `no-nghiep:19`**:
   - *Lý do*: Trang biểu đồ hiển thị 10–11 khối ý nghĩa liên tiếp (4 đỉnh cao, 4 thách thức, thái độ, ngày sinh, và nợ nghiệp nếu có); đặt 1 khối `GHI_CHU_Y_NGHIA` ngay đầu nhóm giúp trang dễ đọc mà vẫn giữ nguyên dòng ghi công `Dữ liệu: Nhật Nguyệt (nhatnguyet.org)` ở cuối từng khối con. Với ngày 19 (`no-nghiep:19` trong kho có `trichChung = []`), không tạo `<details>` rỗng.
4. **Đổi lưới 12 số chủ đạo và 9 năm cá nhân trên `/than-so-hoc` từ 9 cột sang 3 cột (`2` cột ở `≤ 1000px`, `1` cột ở `≤ 700px`)**:
   - *Lý do*: Sau khi gắn câu lời Nhật Nguyệt (khoảng 50–95 ký tự) vào từng ô, lưới 9 cột trước đây quá hẹp để hiển thị gọn ở 1366px và 375px.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Xin phép sử dụng nội dung Nhật Nguyệt (`nhatnguyet.org`)**: Theo ghi chú giấy phép trong `docs/v2/14-so-giay-phep.md` và `src/lib/trang/than-so-hoc-y-nghia.ts`, kho đang dùng trước theo lời đồng ý tạm của anh Cường; cần hoàn tất thủ tục xin phép chính thức theo CC BY-NC 4.0.
- **Trạng thái `SeoTrang` cụm `/than-so-hoc`**: Chuyển các bản ghi cụm `/than-so-hoc` từ `NHAP` sang `XUAT_BAN` khi nghiệm thu xong để mở lập chỉ mục.
- **Dữ liệu thiếu trong kho cho 2 trường hợp biên**: `no-nghiep:19` hiện có `trichChung = []` (chỉ hiển thị câu giải thích và dòng ghi công), còn `thach-thuc:0` chỉ có lời Việt và không có đoạn sách cổ.

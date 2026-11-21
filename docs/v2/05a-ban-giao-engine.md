# Báo cáo bàn giao Engine An Sao Tử Vi v2 (`src/lib/tuvi-v2`)

> Ngày lập: **20/11/2026** · Tham chiếu bất biến: [`docs/v2/tai-san-xemtuvi/`](tai-san-xemtuvi/README.md) · Kế hoạch gốc: [`docs/v2/04-dinh-vi-kinh-doanh.md`](04-dinh-vi-kinh-doanh.md).
> Nguyên tắc: không sửa thư mục tham chiếu, không đụng `src/lib/core/` và các trang/API cũ, không sửa kỳ vọng mẫu, không commit git.

---

## 1. Đã port gì

### 1.1. Mã nguồn & dữ liệu (`src/lib/tuvi-v2/`)

| Tệp đã tạo | Nguồn tiếp nhận | Ghi chú |
|---|---|---|
| [`src/lib/tuvi-v2/NOTICE`](../../src/lib/tuvi-v2/NOTICE) | `tai-san-xemtuvi/NOTICE` | Chép nguyên văn ghi công Apache-2.0 (TuViMCP) và nguồn thuật toán lịch. |
| [`src/lib/tuvi-v2/lich-raw.js`](../../src/lib/tuvi-v2/lich-raw.js) (+ `.d.ts`) | `tai-san-xemtuvi/src/lib/tuvi/lich-raw.js` | Giữ nguyên phần đầu ghi nguồn. **Cần xử lý giấy phép trước khi bán** (xem mục 4). |
| [`src/lib/tuvi-v2/tuvi-raw.js`](../../src/lib/tuvi-v2/tuvi-raw.js) (+ `.d.ts`) | `tai-san-xemtuvi/src/lib/tuvi/tuvi-raw.js` | Giữ nguyên phần đầu Apache-2.0. Bổ sung đủ tùy chọn cho mọi mục 10 đặc tả và trả `tuanCung`, `trietCung` theo mục 9. |
| [`src/lib/tuvi-v2/tiet-khi.mjs`](../../src/lib/tuvi-v2/tiet-khi.mjs) (+ `.d.ts`) | `tai-san-xemtuvi/src/lib/tuvi/tiet-khi.mjs` | Giữ nguyên phần đầu ghi nguồn (VSOP87D / `astronomia`, MIT). |
| [`src/lib/tuvi-v2/lich.mjs`](../../src/lib/tuvi-v2/lich.mjs) | `tai-san-xemtuvi/lib/tuvi/lich.mjs` | Giữ nguyên phần đầu ghi nguồn. **Cần xử lý giấy phép trước khi bán** (xem mục 4). |
| [`src/lib/tuvi-v2/nap-am.mjs`](../../src/lib/tuvi-v2/nap-am.mjs) | `tai-san-xemtuvi/lib/tuvi/nap-am.mjs` | Giữ nguyên phần đầu ghi nguồn (bảng cổ điển 60 hoa giáp nạp âm). |
| [`src/lib/tuvi-v2/nhe.ts`](../../src/lib/tuvi-v2/nhe.ts) | `tai-san-xemtuvi/src/lib/tuvi/nhe.ts` | Hàm nhẹ xử lý múi giờ, canh giờ cho UI. |
| [`src/lib/tuvi-v2/index.ts`](../../src/lib/tuvi-v2/index.ts) | Viết mới theo mục 9 & 10 đặc tả | Xuất `lapLaSo(input)`, `luuNien`, `kiemTraThongTin`, `moTaQuyUoc`, `namAmHienTai`, `tomTatLaSo`, `QUY_UOC_MAC_DINH` cùng đầy đủ kiểu TypeScript (`ThongTinSinh`, `LaSo`, `QuyUoc`, `LuuNien`, `Cung`, `Sao`). |
| `src/lib/tuvi-v2/data/` | `tai-san-xemtuvi/data/tuvi/` | Chép `lich-moc-chuan.json`, `tet-wikipedia-1984-2091.json`, `nap-am.json` và thư mục `mau/`. |

### 1.2. Đáp ứng mục 9 & mục 10 của đặc tả (`tuvi-an-sao-spec.md`)

- **Đầu ra mục 9:** `lapLaSo(input)` trả về `LaSo` có đầy đủ `quyUoc`, `gioChuan`, `tuanCung`/`trietCung` (mảng chỉ số cung `0–11` bên cạnh chuỗi `tuan`/`triet`), `menhChuCach: { theoChiNam, theoCungMenh }`, và hàm riêng `luuNien(ls, namXem, dayDu)`.
- **Mọi điểm bất đồng mục 10 (10.1–10.18 + mục 6):** đều là tùy chọn trong `QuyUoc`, mặc định đúng đặc tả và trả kèm trong `ls.quyUoc`:
  - Đã có sẵn từ bản cũ (11 khóa): `gioTyMuon` (bổ sung thêm nhánh `congNgayAm` của iztro), `muiGioLich`, `hoaLinh`, `thienGiai`, `khoiViet`, `phaToai`, `luuHa`, `thienTruQuy`, `menhChu`, `tuViTyNgo`, `dacTinhHoa`.
  - Bổ sung mới trong đợt bàn giao (9 khóa): `chuanHoaGioMienNam` (10.3), `tuHoa` Việt/TQ (10.4), `chieuHoaLinh` Việt/thuận (10.5), `thuongSu` cố định/Trung Châu (10.12), `thangNhuan` tháng chính/chia ngày 15/tháng sau (10.13), `tuanTriet` 2 cung/1 cung (10.15), `bangDoSang` (10.16), `ranhGioiNam` (10.17), `gioMatTroiThuc` (10.18).
- **Cấu hình chạy kiểm thử & kiểu:** thêm `"test:tuvi"` vào [`package.json`](../../package.json); thêm `"docs/v2/tai-san-xemtuvi"` vào `exclude` của [`tsconfig.json`](../../tsconfig.json) để `tsc` không quét mã tham chiếu luận giải cũ (không sửa tệp bên trong thư mục tham chiếu).

---

## 2. Kết quả chạy kiểm thử & kiểm tra kiểu (số liệu chạy thật)

Lệnh chạy: `npm run test:tuvi` (Node `v24.22.1`) và `npx tsc --noEmit`.

| Tệp kiểm thử (`tests/tuvi-v2/`) | Nguồn | Tổng | Đạt | Todo | Fail |
|---|---|---:|---:|---:|---:|
| [`engine.test.cjs`](../../tests/tuvi-v2/engine.test.cjs) | Port `tests/engine.test.cjs` | 7 | 7 | 0 | 0 |
| [`research-cases.test.cjs`](../../tests/tuvi-v2/research-cases.test.cjs) | Port `tests/research-cases.test.cjs` (+1 test mục 10 mới) | 23 | 23 | 0 | 0 |
| [`tiet-khi.test.cjs`](../../tests/tuvi-v2/tiet-khi.test.cjs) | Port `tests/tiet-khi.test.cjs` | 5 | 5 | 0 | 0 |
| [`lich.test.mjs`](../../tests/tuvi-v2/lich.test.mjs) | Port `test/tuvi/lich.test.mjs` | 7 | 7 | 0 | 0 |
| [`nap-am.test.mjs`](../../tests/tuvi-v2/nap-am.test.mjs) | Port `test/tuvi/nap-am.test.mjs` | 7 | 7 | 0 | 0 |
| [`mau-luoc-do.test.mjs`](../../tests/tuvi-v2/mau-luoc-do.test.mjs) | Port `test/tuvi/mau-luoc-do.test.mjs` | 3 | 3 | 0 | 0 |
| [`mau-53-la-so.test.cjs`](../../tests/tuvi-v2/mau-53-la-so.test.cjs) | **MỚI:** đối chiếu đủ 53 lá (11 TC + 42 MR) | 54 | 54 | 0 | 0 |
| **Tổng cộng (`npm run test:tuvi`)** | | **106** | **106** | **0** | **0** |

- **`npx tsc --noEmit`:** **0 lỗi** (mã thoát `0`).
- **Ghi chú về TC06 và TC07:** `VIEC-CAN-LAM.md` được viết trước khi `tuvi-raw.js` (commit `1cfc5e1`) sửa giờ Tý muộn (`gioTyMuon: 'ngaySau'`) và âm lịch trước 1968 (`muiGioLich: 'lichSu'`). Trên bản tiếp nhận hiện tại, cả TC06 lẫn TC07 đều khớp hoàn toàn nên chạy đạt trực tiếp, không cần đánh dấu `todo`.

---

## 3. Danh sách lá lệch trên 53 lá số mẫu

- **Số lá lệch: `0 / 53`** (11/11 lá trong `tuvi-test-cases.json` + 42/42 lá trong `nghien-cuu/mau/mo-rong.json`).
- Các trường bắt buộc đã đối chiếu từng lá: `lunar` (`amLich`), `canChi` (năm/tháng/ngày/giờ), `menh`, `than`, `cuc`, `tuHoa`, và đủ 14 `chinhTinh`.
- Đối chiếu bổ sung trên toàn bộ 42 lá mở rộng (`amDuong`, `napAmNam`, `thanCu`, `tuan`, `triet`, 97 `sao`, `trangSinh`, `daiHan`, `tieuHan`, `menhChu`, `thanChu`): cũng ghi nhận **0 lệch** (bỏ qua 3 sao tùy chọn phái Trung Quốc chưa an: Thiên Nguyệt, Thiên Vu, Âm Sát).
- **Lưu ý học thuật (mục 13 đặc tả):** kết quả `0/53` xác nhận engine JS nhất quán 100% với đặc tả và engine tham chiếu Python. Chưa thay thế bước chuyên gia đối chiếu bản in sách cổ ở các mục 13.2–13.3 (bảng độ sáng, Thiên Giải, Thiên Trù can Quý, Khôi Việt, Phá Toái, Lưu Hà).

---

## 4. Giấy phép phần đổi lịch âm (Hồ Ngọc Đức)

**Ngày tra cứu:** `20/11/2026`.

### 4.1. Điều khoản gốc đã xác minh

1. **Trang gốc Đại học Leipzig** (`https://www.informatik.uni-leipzig.de/~duc/amlich/`): trả về `HTTP 404 Not Found` ngày 20/11/2026.
2. **Bản lưu trữ Wayback Machine của tệp gốc `amlich-hnd.js`** (chụp `05/09/2024`, link trực tiếp: `https://web.archive.org/web/20240905135905id_/https://www.informatik.uni-leipzig.de/~duc/amlich/amlich-hnd.js`):
   > ```text
   > Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
   > Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
   >
   > Permission to use, copy, modify, and redistribute this software and its
   > documentation for personal, non-commercial use is hereby granted provided that
   > this copyright notice and appropriate documentation appears in all copies.
   > ```
3. **Gói npm `amlich` v0.0.2** (`https://github.com/vanng822/amlich`, tệp `lib/amlich-aa98.js`): không khai báo `license` trong `package.json` và giữ nguyên nguyên văn đoạn bản quyền **non-commercial use** năm 2006 ở trên.
4. **GitHub mirror bản 2004** (`https://github.com/hochanh/amlich/blob/master/amlich-hnd.js`):
   > ```text
   > Copyright 2004 Ho Ngoc Duc [http://come.to/duc]. All Rights Reserved.
   > Permission to use, copy, modify, and redistribute this software and its
   > documentation for personal, non-commercial use is hereby granted provided that
   > this copyright notice appears in all copies.
   > ```
5. **Gói npm `amlich.js` v1.0.6** (`https://github.com/codeaholicguy/amlich.js`): ghi `"license": "MIT"` trong `package.json`, nhưng mã nguồn vẫn chép thuật toán/hằng số từ bản Hồ Ngọc Đức mà không kèm văn bản cấp phép thương mại của tác giả gốc → **không dùng làm cơ sở pháp lý để miễn trừ rủi ro**.

### 4.2. So sánh `lich-raw.js` và `lich.mjs` với mã gốc

Cả hai tệp đều là **chép lại / chuyển thể trực tiếp** từ `amlich-hnd.js` (2006), không phải viết lại độc lập từ Jean Meeus:

- **`lich-raw.js` (dòng 32–128):** giữ nguyên tên hàm (`INT`, `jdFromDate`, `jdToDate`, `getSunLongitude`, `getNewMoonDay`, `getLunarMonth11`, `getLeapMonthOffset`), tên biến (`T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, a11, b11`), hằng số nguyên văn (`2415021.076998695`, `29.530588853`, nhánh `T < -11` và đa thức `deltat`), cấu trúc `do ... while (arc !== last && i < 14)`; chỉ nén dòng và đổi tên hàm giao tiếp `convertSolar2Lunar` → `duongSangAm`.
- **`lich.mjs` (dòng 31–245):** sát nguyên bản hơn nữa — giữ nguyên tên hàm `NewMoon`, `SunLongitude` và gần như từng dòng câu lệnh của `amlich-hnd.js`, chỉ đổi `var` → `const/let` và thêm vỏ nhận múi giờ.

### 4.3. Kết luận & kế hoạch xử lý trước khi bán

- **Kết luận:** **KHÔNG dùng thương mại trực tiếp được** cho phần đổi lịch âm (`lich-raw.js` dòng 31–128 và `lich.mjs`). Các phần còn lại dùng thương mại hợp lệ: `tuvi-raw.js` (**Apache-2.0**, giữ `NOTICE`), `tiet-khi.mjs` (VSOP87D từ `astronomia`, **MIT**), `nap-am.mjs` (bảng cổ điển).
- **Kế hoạch viết lại độc lập (clean-room) từ Jean Meeus (chưa làm trong lượt này):**
  1. **Ngày Julius (JDN):** cài trực tiếp công thức Chương 7 (*Astronomical Algorithms*, 2nd ed., 1998) cho lịch Gregory/Julius.
  2. **Thời điểm Sóc (New Moon):** cài trực tiếp Chương 49 (công thức 49.1–49.4 cho pha trăng mới) kèm bảng/đa thức $\Delta T$ chuẩn NASA/Espenak–Meeus thay cho đa thức `deltat` của `amlich-hnd.js`.
  3. **Trung khí (kinh độ Mặt Trời bội 30°):** tái sử dụng trực tiếp hàm `kinhDoMatTroi` / `kinhDoTaiJde` trong `tiet-khi.mjs` (VSOP87D, giấy phép MIT đã có sẵn).
  4. **Quy tắc lịch âm Việt Nam công khai:** tháng 11 là tháng chứa Đông Chí (270°); nếu hai tháng 11 liên tiếp có 13 kỳ sóc thì tháng nhuận là tháng đầu tiên không chứa trung khí; tính theo UTC+7 từ 1968 và UTC+8 trước 1968.
  5. **Kiểm chứng bắt buộc sau khi viết lại:**
     - Khớp `108/108` ngày mùng 1 Tết trong [`tet-wikipedia-1984-2091.json`](../../src/lib/tuvi-v2/data/tet-wikipedia-1984-2091.json).
     - Khớp `200/200` mốc (1900–2099) trong [`lich-moc-chuan.json`](../../src/lib/tuvi-v2/data/lich-moc-chuan.json).
     - Kiểm round-trip `duongSangAm ↔ amSangDuong` trên toàn bộ 73.414 ngày giai đoạn 1900–2100 và kiểm tra lại toàn bộ `npm run test:tuvi`.
- **Phương án song song:** liên hệ email TS. Hồ Ngọc Đức xin xác nhận cho phép dùng thương mại; tuy nhiên nên chọn tự viết lại clean-room (chỉ ~4–5h) để chủ động 100% pháp lý.

---

## 5. Xếp ưu tiên 15 quy tắc chưa có test cho Gói 2 (149k)

Gói 2 (149.000đ, bản ra mắt Tết 2027) bán: **Luận giải 12 cung có nhãn căn cứ `[Cung – Sao – Tứ Hóa]` + Đại vận 10 năm + Lộ trình 12 tháng năm 2027 (Đinh Mùi) + 8 lượt hỏi đáp**, kèm cam kết hoàn tiền 100% nếu sai an sao (`04-dinh-vi-kinh-doanh.md` mục 3.2–3.3).

### Nhóm P0 — BẮT BUỘC có test trước khi mở bán (6 quy tắc)

| # (`L-82ef28`) | Mục spec | Quy tắc | Vì sao bắt buộc cho Gói 2 (149k) |
|---:|---|---|---|
| **1** | 6 | Độ sáng Miếu/Vượng/Đắc/Bình/Hãm | Ảnh hưởng trực tiếp chất lượng luận giải 12 cung; hiện 0/53 lá kiểm `doSang`. Cần test đủ 14×12 ô chính tinh + phụ tinh chủ chốt. |
| **2** | 7.4 | Sao lưu `L.*` (9 sao phái Việt + 6 sao phụ) | Xương sống của mục **Vận năm 2027 (Đinh Mùi)**; hiện chỉ kiểm 2 năm iztro và 2026, cần phủ đủ 10 can × 12 chi và riêng năm Đinh Mùi 2027. |
| **3** | 7.3 | Lưu tứ hóa theo can năm xem | Cốt lõi Vận 2027 (can Đinh: Thái Âm Hóa Lộc, Thiên Đồng Hóa Quyền, Thiên Cơ Hóa Khoa, Cự Môn Hóa Kỵ); cần test đủ 10 can năm xem. |
| **4** | 7.3 | Đại vận đang đi theo tuổi mụ năm xem | Gói 2 có mục **Đại vận 10 năm**; cần test ca biên chuyển đại vận (tuổi đầu/cuối khoảng, tuổi trước khởi đại vận). |
| **5** | 7.5 | Lưu nguyệt / Đẩu Quân theo năm xem | Gói 2 bán trực tiếp **Lộ trình 12 tháng năm 2027**; hiện chưa có bộ test đối chiếu 12 tháng cho nam/nữ ở năm Đinh Mùi 2027. |
| **9** | 1.7 / 10.17 | Ranh giới năm Tết vs Lập Xuân | Khách sinh giữa 04/02 và mùng 1 Tết rất hay đối chiếu với trang khác rồi khiếu nại hoàn tiền (vd 05/02/2008, 10/02/1985). |

### Nhóm P1 — Nên bổ sung trong T3 hoặc trước Soft Launch T6 (6 quy tắc)

| # | Mục spec | Quy tắc | Ghi chú |
|---:|---|---|---|
| **13** | 5.13 | Ngũ hành sao, loại sao (cát/sát), hành cung | 1 test bảng tĩnh (~20 phút), bảo vệ độ chuẩn của nhãn căn cứ `[Cung – Sao]`. |
| **14** | 3.3 | Quan hệ Mệnh–Cục (sinh/khắc/bình) | Thêm kiểm tra trên 25 lá sẵn có (~20 phút), đủ 25/25 cặp ngũ hành. |
| **10** | 1.2 / 10.3 | Giờ miền Nam 1960–1975 UTC+8 → UTC+7 | Đã có test hàm trong `research-cases.test.cjs`; cần thêm 2 lá mẫu có trường nơi sinh (Sài Gòn vs Hà Nội 01/05/1970 11:30). |
| **6** | 4.1 | 3 lớp (cục, số bù) Tử Vi còn trống | Thổ 5 bù 3, Hỏa 6 bù 0, Hỏa 6 bù 3 → thêm 3 lá là đạt 20/20 lớp. |
| **7** | 5.6 | 5 ngày âm thiếu cho sao theo ngày | Ngày 2, 11, 13, 22, 23 (Tam Thai, Bát Tọa, Ân Quang, Thiên Quý). |
| **8** | 7.2 | 3 tổ hợp Tiểu hạn còn trống | Dần×nữ, Mùi×nam, Hợi×nữ (đạt 24/24 tổ hợp). |

### Nhóm P2 — Hoãn sau Tết / Ngoài phạm vi (3 quy tắc)

| # | Mục spec | Quy tắc | Lý do hoãn |
|---:|---|---|---|
| **12** | 10.x | Bộ lá song song cho chế độ phái khác | Đã có unit test từng cờ tùy chọn trong `research-cases.test.cjs`; bộ lá mẫu song song để sau khi mở tính năng đổi phái nâng cao cho P2. |
| **11** | 1.2 / 10.18 | Giờ mặt trời thực | Mặc định tắt ở bản ra mắt Tết 2027. |
| **15** | 8.3 | Cân lượng | Không thuộc Tử Vi Đẩu Số; ngoài phạm vi. |

---

## 6. Tiết kiệm thời gian mốc T3 và ước lượng giờ còn lại cho engine

Trong [`04-dinh-vi-kinh-doanh.md`](04-dinh-vi-kinh-doanh.md) mục 5.4, mốc **T3** phân bổ **24 giờ cho engine** (`16h` viết sạch engine Lịch Âm + An Sao TS + `8h` viết ≥80 unit test; `6h` còn lại của T3 là nộp hồ sơ Hộ kinh doanh).

| Hạng mục engine | Kế hoạch T3 gốc | Đã hoàn thành lượt này | Việc còn lại ước tính |
|---|---:|---:|---:|
| Lõi an sao, lưu niên, tiết khí VSOP87D, nạp âm, lớp TS `index.ts` | 16h | Xong phần an sao + TS + 20 khóa `QuyUoc` | **4–5h:** viết lại sạch (clean-room) đổi lịch âm từ Meeus + sửa lỗi phụ `thangNhuan(2033)` |
| Bộ unit test (mục tiêu ≥80 test) | 8h | Đạt **106/106 test** (gồm đủ 53 lá số mẫu) | **3–4h:** bổ sung test cho 6 quy tắc P0 (độ sáng, Vận 2027, ranh giới Tết) + P1 nhanh (#13, #14, #6–#8) |
| Kiểm nối adapter để thay `src/lib/core/` (lượt sau) | *(tính ở T4)* | Chưa đụng theo yêu cầu | **1–2h:** nối trang/API sang `src/lib/tuvi-v2` và smoke test |
| **Tổng cộng** | **24h** | **Tiết kiệm ~15–17h** | **7–9h thuần engine** *(8–11h nếu gồm bước nối adapter)* |

> Nếu xin được xác nhận cấp phép thương mại bằng văn bản từ TS. Hồ Ngọc Đức, phần viết lại đổi lịch âm (4–5h) không cần làm; phần việc engine còn lại chỉ còn **3–4 giờ** (bổ sung test P0/P1).

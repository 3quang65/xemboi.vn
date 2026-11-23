# Báo cáo Lệnh 43: Tử vi, kinh dịch, xem tuổi, bản đồ sao, cung hoàng đạo trực quan

Ngày hoàn thành: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/kinh-dich/gieo-que/SoDoGieoQue.tsx` (`8.441` byte) — Server Component dựng sơ đồ gieo quẻ trực quan từ `sauHao(ketQua)`: khi có hào động vẽ Quẻ chủ cạnh Quẻ biến với 6 hàng đồng bộ từ Hào 6 (Thượng) xuống Hào 1 (Sơ), chấm son bên trái cùng nhãn (`○ lão dương` / `× lão âm` theo `giaTri` 9/6), mũi tên SVG mảnh nối sang hào đổi ở Quẻ biến; khi không có hào động chỉ vẽ Quẻ chủ kèm nhãn `"Sáu hào đều tĩnh"`; Quẻ hỗ nhỏ hơn đặt bên dưới; tên quẻ bấm mở trang quẻ `/kinh-dich/que/...`.
- `docs/v2/lenh-antigravity/43-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`15` ảnh):
  - `ck-43-tu-vi-1366.png` (`2.368.039` byte)
  - `ck-43-tu-vi-375.png` (`1.041.453` byte)
  - `ck-43-gieo-que-1366.png` (`1.073.387` byte)
  - `ck-43-gieo-que-375.png` (`764.701` byte)
  - `ck-43-gieo-que-tinh-1366.png` (`1.020.455` byte)
  - `ck-43-xem-tuoi-1366.png` (`990.067` byte)
  - `ck-43-xem-tuoi-375.png` (`686.651` byte)
  - `ck-43-xem-tuoi-grayscale-1366.png` (`572.287` byte)
  - `ck-43-ban-do-sao-1366.png` (`1.246.952` byte)
  - `ck-43-ban-do-sao-375.png` (`938.107` byte)
  - `ck-43-ban-do-sao-khong-gio-1366.png` (`1.212.930` byte)
  - `ck-43-cung-hoang-dao-1366.png` (`961.834` byte)
  - `ck-43-cung-hoang-dao-375.png` (`642.838` byte)
  - `ck-43-cung-chi-tiet-1366.png` (`1.094.086` byte)
  - `ck-43-cung-chi-tiet-375.png` (`797.179` byte)

### Tệp chỉnh sửa
- `src/components/ck/FormLaSo.tsx` (`30.091` byte) — Gắn `DocNhanh` (`docNhanhTuVi(ketQua)`, bọc `ThuatNgu` cho `"Tam phương tứ chính"` và `"Đại vận"`) ngay phía trên `<LaSo12Cung>`; truyền `highlightedChis={tamPhuongTuChinh(chiDangChon).tatCa}` xuống `LaSo12Cung` (mặc định chọn cung Mệnh); bổ sung hàng 12 nút chip `"{ten} · {tenChi}"` (`aria-pressed="true"` cho nút đang chọn) ngay dưới lá số cùng dòng `"Tam phương tứ chính của {cung}: {4 cung}"` và lưới 4 thẻ chính tinh từng cung từ `ketQua.laSo.cung`; giữ nguyên phần bảng & dòng thời gian đại vận của `/tu-vi/tron-doi` với nền nhấn `.ck-dv-dang-chay` và nhãn `"Đang chạy"`.
- `src/app/(v2)/tu-vi/tu-vi.css` (`10.898` byte ≤ `30.720` B / 30 KB) — Bổ sung kiểu cho `.ck-tv-dn-boc`, hàng chip tam phương tứ chính (6 cột desktop, 4 cột tablet, cuộn ngang `flex-nowrap` trên `≤ 700px`, nút cao `≥ 44px`) và lưới 4 thẻ chính tinh.
- `src/app/(v2)/kinh-dich/gieo-que/page.tsx` (`10.632` byte) — Gắn `DocNhanh` (`docNhanhQue(ketQua)`, bọc `ThuatNgu` cho `"Hào động"` và `"Quẻ hỗ"`) ngay đầu kết quả; thay khối 3 thẻ cũ bằng `<SoDoGieoQue>`; gập `"Cách tính quẻ"` vào `<details>` theo chuẩn 22.
- `src/app/(v2)/kinh-dich/kinh-dich.css` (`25.211` byte ≤ `30.720` B / 30 KB) — Bổ sung kiểu cho sơ đồ Quẻ chủ–Quẻ biến cạnh nhau (tên quẻ chính `40px` desktop / `32px` di động, chấm son bên trái, mũi tên SVG, vạch hào liền/đứt), trạng thái `"Sáu hào đều tĩnh"`, Quẻ hỗ nhỏ bên dưới, `<details>` `"Cách tính quẻ"`, và nâng chiều cao nút/select/summary lên `≥ 44px`.
- `src/app/(v2)/xem-tuoi/vo-chong/page.tsx` (`11.110` byte) — Gắn `DocNhanh` (`docNhanhXemTuoi(ketQua)`); bổ sung Thanh tổng 4 ô liền nhau theo thứ tự tiêu chí tô theo `muc` (`tot` xanh kèm `✓`, `binh` mực thường kèm `–`, `diu` hổ phách `#B7791F` sọc chéo kèm `!`); đổi phần hiển thị 4 tiêu chí từ bảng sang 4 thẻ với nhãn `"Hợp"` / `"Bình thường"` / `"Chưa hợp"` và lọc bỏ chữ `"xấu"` ở phần hiển thị.
- `src/app/(v2)/xem-tuoi/xem-tuoi.css` (`7.840` byte ≤ `30.720` B / 30 KB) — Bổ sung kiểu cho `.ck-xt-thanh-tong` (4 ô ngang liền nhau ở cả `1366px` lẫn `375px`, phân biệt cả khi grayscale), 4 thẻ tiêu chí `.ck-xt-tc-*` dùng hổ phách `#B7791F` (không đỏ), và đảm bảo vùng bấm liên kết `≥ 44px`.
- `src/app/(v2)/chiem-tinh/ban-do-sao/VongBanDoSaoSvg.tsx` (`12.416` byte) — Đặt ký hiệu thiên thể theo `gianNhan(kinhDo[], 9)` trên vòng `r = 150`; giữ chấm nhỏ ở vòng trong `r = 178` tại vị trí thật của từng thiên thể; vẽ vạch mảnh nối ký hiệu với chấm thật khi lệch quá `1°`; đặt nhãn nghịch hành `R` hướng tâm (`r = 126`) để không đè hành tinh lân cận.
- `src/app/(v2)/chiem-tinh/ban-do-sao/page.tsx` (`25.765` byte) — Thêm 4 thẻ mốc ở đầu kết quả (`Mặt Trời`, `Mặt Trăng`, `Cung mọc (ASC)`, `Thiên đỉnh (MC)`) dùng `vietViTri`; khi không có giờ sinh, `Cung mọc` và `Thiên đỉnh` ghi `"Cần giờ sinh"`, `Mặt Trăng` ghi khoảng trong ngày (`trongNgay`); giữ nguyên danh sách vị trí và không viết tính cách.
- `src/app/(v2)/chiem-tinh/ChiemTinhUi.tsx` (`12.781` byte) — Mở rộng `Vong12CungSvg` thêm prop tùy chọn `cungChon?: string` và `nho?: boolean` để dùng lại ở đầu trang từng cung, tô đậm cung đang xem và giữ nguyên hiển thị ở `/chiem-tinh`.
- `src/app/(v2)/chiem-tinh/cung-hoang-dao/page.tsx` (`13.545` byte) — Đổi danh sách 12 cung sang lưới 12 thẻ (3 cột ở `375px`, 4 cột ở `1366px`) gồm ký hiệu to, tên Việt, khoảng ngày (`formatKhoangNamNay`), gắn nhãn `"Mặt Trời đang ở đây"` cho cung chứa Mặt Trời hôm nay từ `cungTaiThoiDiem(new Date())`; giữ bảng chi tiết 12 cung bên dưới trong `<details>`.
- `src/app/(v2)/chiem-tinh/cung-hoang-dao/[cung]/page.tsx` (`13.651` byte) — Gắn `<Vong12CungSvg namNay={namNay} cungChon={c.slug} nho />` vào khối đầu trang từng cung, tô cung đang xem; giữ nguyên toàn bộ nội dung hiện có, không thêm mô tả tính cách.
- `src/app/(v2)/chiem-tinh/chiem-tinh.css` (`25.490` byte ≤ `30.720` B / 30 KB) — Kiểu cho vòng mốc chấm thật Bản đồ sao (cả chế độ `.ck-toi`), 4 thẻ mốc đầu trang Bản đồ sao, lưới 12 thẻ Cung hoàng đạo (`4` cột desktop / `3` cột ở `≤ 700px`), vòng 12 cung nhỏ ở đầu trang chi tiết cung và `min-height: 44px` cho nút/chip.

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `prisma/**`, `src/lib/**` (chỉ đọc `src/lib/trang/truc-quan-43.ts`), `src/middleware.ts`, `src/app/api/**`, `scripts/**`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**` (gồm `LaSo12Cung.tsx`), `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `src/components/ck/truc-quan/truc-quan.css` (`18.133` B, giữ nguyên), `src/app/(v2)/bat-tu/**` (giữ nguyên `bat-tu.css` trên đĩa), `tests/**`, `package.json`.
- Không mở/lưu lại 5 tệp `xem-ngay` và `lich-am` đang có sẵn thay đổi định dạng từ trước.
- Không cài gói npm, không commit, không chạy `next build`.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**:
   - Đạt, mã thoát `0` (`TSC_EXIT=0`, `0` lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/truc-quan-43.test.mjs tests/trang/la-so.test.mjs tests/trang/kinh-dich.test.mjs tests/trang/xem-tuoi.test.mjs tests/trang/ban-do-sao.test.mjs tests/trang/chiem-tinh.test.mjs`)**:
   - Đạt, mã thoát `0` (`TEST_EXIT=0`): `31/31` bài test qua, `0` thất bại, `0` bị bỏ qua.
3. **Kiểm tra dung lượng CSS (≤ 30.720 byte / 30 KB)**:
   - `src/app/(v2)/tu-vi/tu-vi.css`: `10.898` byte.
   - `src/app/(v2)/kinh-dich/kinh-dich.css`: `25.211` byte.
   - `src/app/(v2)/xem-tuoi/xem-tuoi.css`: `7.840` byte.
   - `src/app/(v2)/chiem-tinh/chiem-tinh.css`: `25.490` byte.
   - `src/components/ck/truc-quan/truc-quan.css`: `18.133` byte.
4. **Kiểm tra trình duyệt trên `http://localhost:3047` (Chrome via `playwright-core`) ở 3 khổ `1366px`, `768px`, `375px`**:
   - Tất cả `10` đường dẫn kiểm tra đều trả **HTTP 200**, `0` console error, `0` `pageerror`, `0` HTTP ≥ 400, không có từ cấm (`forbidden: null`).
   - **Không tràn ngang trang:** `scrollWidth === innerWidth` (`1366`, `768`, `375`) trên mọi trang; ở `375px`, chỉ dải chip `.ck-tv-tp-chip-ds` cuộn ngang nội bộ (`clientW = 317px`, `scrollW = 1723px`), còn trang vẫn `scrollWidth = 375px`.
   - **Vùng bấm ≥ 44px:** `smallControls: []` ở toàn bộ khổ `375px` và `768px` (ở `1366px` chỉ còn nút header `.ck-dau-cta` thuộc `DauTrang.tsx` / `ck.css` trong vùng cấm sửa).
   - **Nghiệm thu 43.6.1 (Tử vi `15/08/1990 9 giờ, nam, năm xem 2026`):**
     - `DocNhanh` mở đầu đúng: `"Mệnh an tại Dần: Vũ Khúc (Vượng), Thiên Tướng (Miếu). Thân cư Phu Thê tại Tý; Thổ Ngũ Cục, bản mệnh Lộ Bàng Thổ; năm 2026 đang ở đại vận cung Điền Trạch (35–44 tuổi)."`.
     - Mặc định chọn chip `"Mệnh · Dần"` (`aria-pressed="true"`), làm sáng 4 cung có `data-chi` `[2, 6, 8, 10]` (Dần, Ngọ, Thân, Tuất) và in `"Tam phương tứ chính của Mệnh: Mệnh (Dần), Quan Lộc (Ngọ), Thiên Di (Thân), Tài Bạch (Tuất)"` kèm chính tinh từng cung.
     - Bấm chip `"Quan Lộc · Ngọ"`: `aria-pressed="true"` chuyển sang `"Quan Lộc · Ngọ"`, lá số làm sáng `[0, 2, 6, 10]` (Tý, Dần, Ngọ, Tuất) và dòng tóm tắt cập nhật tương ứng.
     - Trên `/tu-vi/tron-doi`: đại vận đang chạy (`35–44 tuổi`, `2024–2033`, `Điền Trạch · Tân Tỵ`) giữ nguyên nền nhấn `.ck-dv-dang-chay` và nhãn `"Đang chạy"` ở cả dòng thời gian và bảng.
   - **Nghiệm thu 43.6.2 (Gieo quẻ `7, 8, 9, 7, 6, 8` và ca tĩnh `7, 8, 7, 8, 7, 8`):**
     - `DocNhanh` ra đúng: `"Quẻ chủ Lôi Hỏa Phong (quẻ 55): trên Chấn (Lôi), dưới Ly (Hỏa); động hào tam, hào ngũ, biến thành Trạch Lôi Tùy (quẻ 17); quẻ hỗ Trạch Phong Đại Quá (quẻ 28)."`.
     - Sơ đồ hiển thị Quẻ chủ cạnh Quẻ biến, đúng `2` chấm son bên trái + nhãn `× lão âm` (hào 5, giá trị 6) và `○ lão dương` (hào 3, giá trị 9) + `2` mũi tên SVG nối sang hào biến tương ứng; Quẻ hỗ `#28 Trạch Phong Đại Quá` nhỏ hơn ở bên dưới; các liên kết trỏ `/kinh-dich/que/55-loi-hoa-phong`, `/kinh-dich/que/17-trach-loi-tuy`, `/kinh-dich/que/28-trach-phong-dai-qua`.
     - Cỡ chữ tên quẻ chính: `40px` ở `1366px`, `32px` ở `375px`.
     - Ca tĩnh (`7, 8, 7, 8, 7, 8` — Thủy Hỏa Ký Tế): không vẽ Quẻ biến (`doiQueCount: 0`), hiển thị nhãn `"Sáu hào đều tĩnh"` và Quẻ hỗ `Hỏa Thủy Vị Tế`.
   - **Nghiệm thu 43.6.3 (Xem tuổi chồng `1990`, vợ `1992`):**
     - `DocNhanh` ghi đúng: `"Chồng Canh Ngọ 1990, vợ Nhâm Thân 1992: trong 4 tiêu chí, 1 hợp, 2 bình thường, 1 chưa hợp."`.
     - Thanh tổng 4 ô liền nhau giữ đủ ký hiệu `✓`, `–`, `!` và phân biệt rõ ngay cả ở ảnh xám (`ck-43-xem-tuoi-grayscale-1366.png`); ô `"Chưa hợp"` dùng màu hổ phách `rgb(183, 121, 31)` (`#B7791F`) kèm nền sọc chéo dịu, không dùng đỏ; `hasXauWord: false` trên vùng nội dung hiển thị.
   - **Nghiệm thu 43.6.4 (Bản đồ sao `03/02/1962 12:00 Hà Nội` và bản không giờ sinh):**
     - 4 thẻ mốc đầu kết quả: Mặt Trời `13°53′ Bảo Bình` (`Nhà 10`), Mặt Trăng `19°00′ Ma Kết` (`Nhà 9`), Cung mọc (ASC) `23°35′ Kim Ngưu` (`Nhà 1`), Thiên đỉnh (MC) `11°16′ Bảo Bình` (`Nhà 10`).
     - Bản đồ sao `03/02/1962` có cụm nhiều hành tinh ở Bảo Bình: `dots = 10`, `lines = 7` (vạch nối cho 7 thiên thể lệch `> 1°`), `discCount = 10`, đo `getBoundingClientRect()` toàn bộ đĩa `[data-tt-disc]` cho `overlaps: []` (`0` đè nhau).
     - Bản không giờ sinh: Cung mọc & Thiên đỉnh ghi `"Cần giờ sinh"`; Mặt Trăng ghi khoảng trong ngày `"11°45′ Ma Kết – 26°19′ Ma Kết"`.
   - **Nghiệm thu 43.6.5 (Cung hoàng đạo danh sách & chi tiết + hồi quy `/chiem-tinh`):**
     - `/chiem-tinh/cung-hoang-dao`: đủ `12` thẻ (`4` cột ở `1366px`, `3` cột ở `375px`), duy nhất thẻ `Nhân Mã` mang nhãn `"Mặt Trời đang ở đây"`.
     - `/chiem-tinh/cung-hoang-dao/nhan-ma`: đầu trang có `Vong12CungSvg` bản nhỏ tô đúng cung `Nhân Mã` (`240°–270°`), nội dung Tetrabiblos giữ nguyên, không thêm mô tả tính cách.
     - `/chiem-tinh`: giữ nguyên vòng 12 cung đầy đủ, HTTP 200, `0` lỗi.
   - **Nghiệm thu 43.6.6 (Chế độ tắt JS — `javaScriptEnabled: false`):**
     - Kinh dịch (`?xu=7,8,9,7,6,8`): `DocNhanh`, sơ đồ 2 quẻ, popover `ThuatNgu` (`popOpen: 1`), `<details>` `"Cách tính quẻ"` (`detailsOpen: 1`), và nguyên văn đều hoạt động đầy đủ không cần JS.
     - Xem tuổi (`?chong=1990&vo=1992`), Bản đồ sao (`?ngay=1962-02-03&gio=12:00&tinh=ha-noi`), Cung hoàng đạo (`tableOpen: 1`) và trang chi tiết cung: hiển thị và thao tác đầy đủ không cần JS.
     - Tử vi (`/tu-vi/lap-la-so` và `/tu-vi/tron-doi`): phần biểu mẫu dựng sẵn trong HTML (`formVisible: 1`), còn bước gửi `POST /api/v2/la-so`, dựng lá số 12 cung và chuyển chip tam phương tứ chính trên `FormLaSo` chạy ở phía client nên **cần JS**.
   - **Duyệt ảnh chụp:** đã mở xem trực tiếp toàn bộ `15` ảnh `ck-43-*.png` (`375px`, `1366px` và ảnh xám) — bố cục gọn, không đè chữ, lưới 3 cột 12 cung trên 375px và cụm Bảo Bình trên bản đồ sao 1962 hiển thị tách bạch rõ ràng.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Lọc thay cụm `"du niên xấu"` khi hiển thị trên `/xem-tuoi/vo-chong/page.tsx`:**
   - *Lý do:* Hàm `xemTuoiVoChong` trong `src/lib/trang/xem-tuoi.ts` (dòng 87, vùng cấm sửa của Lệnh 43) vẫn trả chuỗi `"Hai cung phối thành Họa hại (thuộc nhóm du niên xấu)."` ở trường `giaiThich` và `docNhanhXemTuoi` chép nguyên `chiTiet`. Để tuân thủ yêu cầu 43.3.3 (`Bỏ mọi chữ "xấu" ở phần hiển thị`) mà không sửa `src/lib/**`, trang hiển thị dùng `lamDiuNhanHienThi` đổi `"du niên xấu"` → `"du niên chưa hợp"` tại lớp giao diện.
2. **Đặt ký hiệu nghịch hành `R` hướng tâm (`R_NGHICH = 126`) trong `VongBanDoSaoSvg.tsx`:**
   - *Lý do:* Nếu đặt `R` lệch ngang bên phải ký hiệu như trước (`tx + 12.5`), khi nhiều hành tinh tụ trong 10° (như ca `03/02/1962`) chữ `R` sẽ chạm vào ký hiệu kế bên. Đặt `R` lùi vào tâm theo cùng góc `thetaNhan` giữ khoảng trống sạch với cả ký hiệu lẫn vòng nhà.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- Trong `src/lib/trang/xem-tuoi.ts` (dòng 87), chuỗi `giaiThich` của tiêu chí `cung-phi` vẫn còn cụm `"(thuộc nhóm du niên xấu)"`; nên đổi sang `"chưa hợp"` ở tầng lib khi mở khóa sửa `src/lib/**` để `docNhanhXemTuoi` trả thẳng chuỗi không chứa chữ `"xấu"`.

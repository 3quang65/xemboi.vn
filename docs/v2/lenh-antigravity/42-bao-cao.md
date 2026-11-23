# Báo cáo Lệnh 42: Thần số học, hướng nhà, cửu tinh trực quan

Ngày hoàn thành: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/components/ck/truc-quan/LaBan.tsx` (`21.281` byte) — SVG Server Component dùng chung vẽ la bàn 24 sơn và 8 quái: Bắc ở trên mặc định (hỗ trợ chế độ xoay tĩnh `?xoay=huong` đưa hướng nhà lên trên, không xoay động), chữ `B / Đ / N / T` ngoài vòng; khi có `cungPhi` gồm 3 vòng từ trong ra (8 quái + ký hiệu quẻ, du niên cát nền `--ck-moc-nhat` viền liền + `✦` và không cát nền hổ phách `#FBF4E4` + gạch chéo + viền đứt `#B7791F` + `◇` phân biệt rõ ở ảnh xám, và 24 sơn mỗi sơn 15°); khi không có `cungPhi` giữ 2 vòng 8 quái và 24 sơn minh họa cách chia phương; có `doHuong` vẽ mũi tên son từ tâm tới sơn `laHuong`, đoạn nét đứt tới `laToa`, nhãn `Hướng …°` ở đầu mũi tên và vạch ranh sơn hổ phách khi đo sát ranh; bấm vào quái mở `<details>` chi tiết bên dưới (gồm du niên, sao, Hán tự và trích dẫn Hiệp kỷ).
- `src/components/ck/truc-quan/MoChiTietAnchorClient.tsx` (`883` byte) — Client component nhỏ gắn listener `click` cho các liên kết `a[data-mo-details]` (kể cả trong SVG) để mở `<details>` đích và cuộn tới nơi (tôn trọng `prefers-reduced-motion`); khi tắt JS, neo `#id` thuần HTML vẫn nhảy tới đúng khối `<details>`.
- `src/app/(v2)/phong-thuy/huong-nha/NutSaoChepLienKetClient.tsx` (`1.133` byte) — Client component rất nhỏ cho nút `"Sao chép liên kết"` (`min-height: 44px`), có fallback khi clipboard API bị chặn và thông báo `aria-live="polite"`.
- `src/app/(v2)/phong-thuy/cuu-tinh/DuongSaoBayClient.tsx` (`4.279` byte) — Client component bọc lưới 3×3 Cửu tinh: nút `"Xem sao bay"` / `"Ẩn đường sao bay"` / `"Chạy lại"` điều khiển lớp phủ SVG vẽ dần 8 đoạn nối theo `duongBay(ban)` (`0,6s` mỗi bước) cùng chấm chạy qua 9 ô; ở `@media (prefers-reduced-motion: reduce)` hiển thị sẵn đường nối tĩnh kèm số thứ tự bước `1..9` và ẩn chấm chuyển động.
- `docs/v2/lenh-antigravity/42-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`13` ảnh):
  - `ck-42-than-so-bieu-do-1366.png` (`1.657.756` byte)
  - `ck-42-than-so-bieu-do-375.png` (`1.338.568` byte)
  - `ck-42-than-so-chu-dao-1366.png` (`1.425.552` byte)
  - `ck-42-than-so-chu-dao-375.png` (`1.037.182` byte)
  - `ck-42-huong-nha-1366.png` (`1.478.188` byte)
  - `ck-42-huong-nha-375.png` (`1.065.672` byte)
  - `ck-42-huong-nha-grayscale-1366.png` (`109.912` byte)
  - `ck-42-huong-nha-xoay-ranh-1366.png` (`1.492.285` byte)
  - `ck-42-cuu-tinh-2027-1366.png` (`1.199.290` byte)
  - `ck-42-cuu-tinh-2027-375.png` (`815.983` byte)
  - `ck-42-cuu-tinh-2027-thang-1366.png` (`1.219.927` byte)
  - `ck-42-cuu-tinh-2027-thang-375.png` (`841.498` byte)
  - `ck-42-cuu-tinh-2031-1366.png` (`1.194.082` byte)

### Tệp chỉnh sửa
- `src/components/ck/truc-quan/index.ts` (`675` byte) — Xuất thêm `LaBan`, `type LaBanProps`, `MoChiTietAnchorClient`.
- `src/components/ck/truc-quan/truc-quan.css` (`18.133` byte ≤ `30.720` B / 30 KB) — Bổ sung kiểu cho `.ck-tq-lb-*` (thanh trên, nút xoay, khung la bàn, chú giải, lưới `<details>` 2 cột desktop / 1 cột mobile, bảo đảm vùng bấm ≥ `44px` và SVG rộng ≥ `320px` ở `375px`).
- `src/app/(v2)/than-so-hoc/ThanSoHocUi.tsx` (`23.934` byte) — Bổ sung `NGHIA_THUAT_NGU_TSH`, `VongTronSoChuDao` (vòng tròn lớn, viền đôi cho `11, 22, 33`, phép cộng thu gọn dưới vòng), `BonDinhCaoTrucQuan` (kim tự tháp 6 cột ở `≥ 768px` nối tâm SVG + thanh dòng thời gian 4 đoạn với khoảng tuổi không chồng nhau từ lib, năm dương lịch tương ứng, đoạn cuối `"từ X tuổi"` mờ dần sang phải, đoạn `chiSoDinhHienTai` có nhãn `"Đang ở đây"` + vạch đứng tại tuổi hiện tại; ở `< 768px` chuyển thành 4 thẻ xếp dọc); nâng cấp `LuoiBieuDoNgaySinh` (ô có số nền đậm ghi lặp chữ số, ô thiếu nền giấy viền đứt + chữ mờ `40%`, vạch đường đủ nét liền `--ck-moc`, đường trống nét đứt hổ phách `#B7791F`, bấm vạch mở `<details>` tên đường, ghi chú quy ước hàng lưới `3·6·9 / 2·5·8 / 1·4·7`).
- `src/app/(v2)/than-so-hoc/bieu-do-ngay-sinh/page.tsx` (`15.934` byte) — Gắn `DocNhanh` (`docNhanhThanSo(d, năm VN)`), `VongTronSoChuDao`, `LuoiBieuDoNgaySinh` nâng cấp, `BonDinhCaoTrucQuan`, bọc `ThuatNgu` ở các thuật ngữ `"Số chủ đạo"`, `"Năm cá nhân"`, `"Đỉnh cao"`, đưa bảng 4 đỉnh cao vào `<details>` `"Xem dạng bảng 4 đỉnh cao"`.
- `src/app/(v2)/than-so-hoc/so-chu-dao/page.tsx` (`13.858` byte) — Gắn `DocNhanh`, `VongTronSoChuDao`, `BonDinhCaoTrucQuan`, `LuoiBieuDoNgaySinh` và bọc `ThuatNgu` khi đã nhập ngày sinh.
- `src/app/(v2)/than-so-hoc/nam-ca-nhan/[so]/page.tsx` (`11.159` byte) — Nâng cấp đầu trang sang vòng tròn số lớn, bọc `ThuatNgu` cho `"Năm cá nhân"`, bổ sung form nhập ngày sinh tại trang kèm `DocNhanh`, `VongTronSoChuDao`, `BonDinhCaoTrucQuan`, `LuoiBieuDoNgaySinh` khi có `?ngay=...` (đặt `noindex` và giữ `canonical`).
- `src/app/(v2)/than-so-hoc/than-so-hoc.css` (`30.293` byte ≤ `30.720` B / 30 KB) — Kiểu cho vòng tròn Số chủ đạo, viền đôi master, kim tự tháp 6 cột + thanh thời gian 4 đỉnh cao + 4 thẻ dọc ở `< 768px`, ô thiếu viền đứt mờ `40%`, vạch xanh/hổ phách và `<details>` đường.
- `src/app/(v2)/phong-thuy/PhongThuyUi.tsx` (`6.801` byte) — Đổi `HuyHieuCatHung` sang chữ `"✦ Cát"` / `"◇ Không cát"`, cập nhật tiêu đề cột trong `BangBatPhuong`.
- `src/app/(v2)/phong-thuy/huong-nha/FormHuongNhaClient.tsx` (`3.247` byte) — Cho phép để trống độ la bàn khi chỉ muốn tra cung phi.
- `src/app/(v2)/phong-thuy/huong-nha/page.tsx` (`14.726` byte) — Gắn `DocNhanh` (`docNhanhHuongNha`), nút `"Sao chép liên kết"`, 2 thẻ Hướng & Tọa đặt cạnh nhau cả ở `375px`, hộp cảnh báo sát ranh sơn `ganRanhSon(do)` nền hổ phách nhạt, liệt kê đủ 3 quan hệ du niên (`Mệnh – Hướng`, `Mệnh – Tọa`, `Trạch (tọa) – Hướng`), dùng `LaBan` kèm link xoay tĩnh `?xoay=huong` và tô vạch ranh sơn gần nhất, chuyển `BangBatPhuong` vào `<details>` `"Xem dạng bảng"`.
- `src/app/(v2)/phong-thuy/cung-phi/[cung]/page.tsx` (`7.665` byte) — Dùng lại `LaBan` (không hướng) theo `laBanCaNhan(cung.ten)`, chuyển `BangBatPhuong` vào `<details>` `"Xem dạng bảng"`, tô màu ký hiệu quái theo hành.
- `src/app/(v2)/phong-thuy/bat-trach/page.tsx` (`8.455` byte) — Thêm mục `"Cách chia 8 quái và 24 sơn trên la bàn"` dùng `LaBan` với `laBanCaNhan()` không có cung phi.
- `src/app/(v2)/phong-thuy/cuu-tinh/CuuTinhHelpers.ts` (`4.266` byte) — Thêm `phanTichLop` và `phanTichThangTiet`, bỏ `lopMauSao` không còn dùng.
- `src/app/(v2)/phong-thuy/cuu-tinh/CuuTinhUi.tsx` (`18.942` byte) — Gắn `DocNhanh` (`docNhanhCuuTinh`), ghi rõ `"Năm đổi ở Lập xuân"` kèm ngày giờ VN, nút phân đoạn `"Năm"` / `"Tháng …"` + dải 12 tháng tiết `?lop=thang&thang=N`; lưới 3×3 xếp theo `VI_TRI_LUOI_CUU_TINH`, có vành 8 phương quanh lưới, màu theo hành của sao, ô Ngũ hoàng viền hổ phách `#B7791F` kèm nhãn `"Ngũ hoàng"`, mỗi ô bấm mở `<details>` chi tiết sao, gắn `DuongSaoBayClient` + đường nối tĩnh trong `<details>` khi không JS + `ChuGiaiHanh`; thu gọn 12 bàn tháng vào `<details>`.
- `src/app/(v2)/phong-thuy/cuu-tinh/page.tsx` (`7.887` byte) — Hỗ trợ tham số `lop` / `thang`, giữ nguyên bảng 9 sao bên dưới và đổi chấm màu theo hành (`ck-tq-cham-*`).
- `src/app/(v2)/phong-thuy/cuu-tinh/[nam]/page.tsx` (`5.138` byte) — Hỗ trợ `searchParams` cho `?lop=thang&thang=N`, đặt `noindex, follow` và giữ nguyên `canonical` khi có tham số.
- `src/app/(v2)/phong-thuy/phong-thuy.css` (`30.368` byte ≤ `30.720` B / 30 KB) — Gỡ lớp cũ không dùng (`.ck-pt-vong-*`, `.ck-pt-cham-mau`, `.ck-pt-ct-mau-*`), đổi toàn bộ sắc `"không cát / hung"` sang hổ phách `#B7791F`, giữ 2 cột Hướng/Tọa ở `375px`, bổ sung kiểu vành 8 phương Cửu tinh, nhãn Ngũ hoàng, phân đoạn Năm/Tháng, hoạt cảnh CSS `@keyframes` `"Xem sao bay"` và `@media (prefers-reduced-motion: reduce)`.

### Tệp đã xóa
- `src/app/(v2)/phong-thuy/huong-nha/VongHaiTuSonSvg.tsx` — Thay thế hoàn toàn bởi thành phần dùng chung `src/components/ck/truc-quan/LaBan.tsx`.

### Xác nhận vùng cấm
- Không sửa `prisma/**`, `src/lib/**`, `src/middleware.ts`, `src/app/api/**`, `scripts/**`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `src/app/(v2)/bat-tu/**` (giữ nguyên `bat-tu.css` trên đĩa), `src/app/(v2)/chiem-tinh/**`, `src/app/(v2)/xem-ngay/**`, `src/app/(v2)/lich-am/**`, `tests/**`, `package.json`.
- Không cài gói npm, không commit, không chạy `next build`.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**:
   - Đạt, mã thoát `0` (`TSC_EXIT=0`, `0` lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --test tests/trang/phan-truc-quan.test.mjs tests/trang/than-so-hoc.test.mjs tests/trang/phong-thuy.test.mjs tests/trang/cuu-tinh.test.mjs`)**:
   - Đạt, mã thoát `0` (`TEST_EXIT=0`): `34/34` bài test qua, `0` thất bại, `0` bị bỏ qua.
3. **Kiểm tra dung lượng CSS & từ cấm**:
   - `src/components/ck/truc-quan/truc-quan.css`: `18.133` byte (`≤ 30.720` B).
   - `src/app/(v2)/than-so-hoc/than-so-hoc.css`: `30.293` byte (`≤ 30.720` B).
   - `src/app/(v2)/phong-thuy/phong-thuy.css`: `30.368` byte (`≤ 30.720` B).
   - `forbiddenHits: []` trên toàn bộ `14` URL đã kiểm tra (`hóa giải|vật phẩm|sát khí|cải vận`).
4. **Kiểm tra trình duyệt trên `http://localhost:3047` (Chromium via `playwright-core`) ở 3 khổ `1366px`, `768px`, `375px`**:
   - Tất cả `14` đường dẫn trả **HTTP 200**, `0` console error, `0` `pageerror`, `0` HTTP `≥ 400`, `0` tràn ngang (`overflows: []`).
   - **Thần số học (`01/06/1990`, năm `2026`):**
     - `DocNhanh` mở đầu bằng `"Số chủ đạo 8; năm 2026 là năm cá nhân 8; đang ở đỉnh cao thứ 2 (số 2, 29–37 tuổi); lưới ngày sinh thiếu 2, 3, 4, 5, 7, 8."`.
     - Vòng tròn Số chủ đạo ở `375px`: `112 × 112px` (`≥ 96px`), cỡ chữ số `52px` (`≥ 48px`); ca số master `15/08/1990` (số `33`) hiển thị viền đôi; phép cộng thu gọn hiển thị ngay dưới vòng tròn.
     - 4 đỉnh cao: `0–28 tuổi (1990–2018)`, `29–37 tuổi (2019–2027)`, `38–46 tuổi (2028–2036)`, `từ 47 tuổi (từ 2037)`; kim tự tháp 6 cột và thanh ngang hiện ở `≥ 768px`, chuyển 4 thẻ dọc ở `375px`; nhãn `"Đang ở đây"` + vạch đứng nằm đúng tại `Đỉnh 2` (`số 2`, tuổi `36`).
     - Lưới `3×3`: ô có số (`11`, `6`, `99`) nền đậm, ô thiếu (`2, 3, 4, 5, 7, 8`) nền giấy viền đứt và chữ mờ `40%`; vạch đường trống (`2-5-8`, `3-5-7`) nét đứt hổ phách, bấm vạch mở `<details>` tên đường (`thanSoLineOpensDetails: true`); ghi chú `"Hàng trên 3 · 6 · 9, hàng giữa 2 · 5 · 8, hàng dưới 1 · 4 · 7"` nằm ngay dưới lưới.
   - **Hướng nhà (`nữ 1990`, `do=135`):**
     - **Cung phi:** **Cấn** (`☶`, số `5` gửi cung `Cấn`, số `8`, Tây tứ mệnh, hành Thổ).
     - **4 phương cát (khớp `batPhuong('Cấn')`):** **Tây Nam (Sinh khí)**, **Tây Bắc (Thiên y)**, **Tây (Diên niên)**, **Đông Bắc (Phục vị)**; 4 phương không cát: Nam (Họa hại), Đông (Lục sát), Bắc (Ngũ quỷ), Đông Nam (Tuyệt mệnh).
     - Mũi tên hướng màu son chỉ đúng tâm sơn **Tốn** (`135°`), đoạn tọa nét đứt chỉ sơn **Càn** (`315°`), nhãn `Hướng 135°` ở đầu mũi tên; 2 thẻ `Hướng nhà` (`135° · Sơn Tốn`) và `Tọa` (`315° · Sơn Càn`) xếp 2 cột cạnh nhau cả ở `375px` (`sideBySide: true`); nút `"Sao chép liên kết"` cập nhật trạng thái `"Đã sao chép liên kết"`.
     - Khi thử `do=157&xoay=huong`: hộp cảnh báo hổ phách `Sát ranh sơn` hiển thị đúng `ganRanhSon(157).cau`, vạch ranh giới tô hổ phách tại `157,5°`, la bàn xoay tĩnh với nhãn `"Đang xoay: hướng nhà ở trên"`.
     - Ở `375px`: la bàn rộng `333px` (`≥ 320px`), cỡ chữ 24 sơn đo thực tế `10,54px` (`≥ 10px`), bấm quái trên la bàn mở `<details>` (`compassClickOpensDetails: true`), bảng 8 phương nằm trong `<details>` `"Xem dạng bảng"`.
     - Ảnh xám (`ck-42-huong-nha-grayscale-1366.png`): phân biệt rõ 4 ô cát (nền liền, viền liền, ký hiệu `✦`, chữ `"Cát"`) và 4 ô không cát (nền gạch chéo, viền đứt, ký hiệu `◇`, chữ `"Không cát"`).
   - **Cửu tinh (`2027`, lớp tháng `1/2027`, `2031`):**
     - Năm `2027` (`Đinh Mùi`, Hạ nguyên): Trung cung `9 Cửu tử` (Hỏa), Ngũ hoàng ở **Bắc (Khảm)** có viền hổ phách `#B7791F` và nhãn `"Ngũ hoàng"`, ghi rõ `"Năm đổi ở Lập xuân"` (`04/02/2027 08:46` đến `04/02/2028 14:31`).
     - Lớp tháng `1/2027` (`?lop=thang&thang=1`): hiển thị bàn tháng giêng (Dần) với số sao thật từng ô (Trung cung `5 Ngũ hoàng`, Bắc `1 Nhất bạch`, Nam `9 Cửu tử`, kèm số sao năm nhỏ để đối chiếu), ghi tiết mở đầu `Lập xuân 04/02/2027 08:46`, đặt `robots: noindex, follow` và giữ nguyên `canonical: https://xemboi.vn/phong-thuy/cuu-tinh/2027`.
     - Năm `2031` (`Tân Hợi`): sao `5 Ngũ hoàng` vào Trung cung, nhãn `"Ngũ hoàng"` nằm đúng tại ô giữa; bấm ô bất kỳ mở `<details>` (`cuuTinhCellOpensDetails: true`); bấm `"Xem sao bay"` bật hoạt cảnh (`flightOverlayActive: 1`).
     - Với `prefers-reduced-motion: reduce`: `overlayDisplay: "block"`, `dotDisplay: "none"`, `lineAnimation: "none"` (vẽ sẵn đường nối có đánh số bước `1..9`, không chuyển động).
   - **Kiểm tra vùng bấm & tắt JS:**
     - `smallBtns: 0`, `smallControls: 0`, `smallCells: 0` (toàn bộ vùng bấm ≥ `44px`).
     - Chế độ tắt JS (`javaScriptEnabled: false`): `ThuatNgu` mở (`popOpen: 1`) và đóng (`popClosed: 0`) popover thuần HTML; `<details>` `"Xem dạng bảng 4 đỉnh cao"` (`bdTableOpen: 1`) và `"Xem đường sao bay dạng tĩnh"` (`staticBayOpen: 1`) mở bình thường.
   - **Duyệt ảnh chụp:** đã mở xem trực tiếp toàn bộ `13` ảnh `ck-42-*.png` — bố cục rõ ràng, không đè chữ ở kim tự tháp, không bị mũi tên cắt nét chữ quái trên la bàn, nhãn Ngũ hoàng và đường nối hiển thị sắc nét ở cả `375px` lẫn `1366px`.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Dùng thành phần phụ Client nhỏ `MoChiTietAnchorClient` hỗ trợ mở `<details>` khi bấm từ SVG (`LuoiBieuDoNgaySinh`, `LaBan`, `BangCuuCung`):**
   - *Lý do:* Neo HTML thuần (`<a href="#id">`) cuộn tới đúng phần tử `<details id="...">` khi tắt JS nhưng không tự thêm thuộc tính `open` cho `<details>`. `MoChiTietAnchorClient` giữ toàn bộ phần vẽ vẫn là Server Component thuần, bảo đảm bấm vạch lưới / quái la bàn / ô Cửu tinh tự động mở ngay `<details>` tương ứng khi có JS mà không làm mất khả năng hoạt động khi tắt JS.
2. **Đưa bảng 12 bàn tháng nhỏ ở `KhoiCuuTinhThang` vào `<details>` `"Xem cả 12 bàn tháng năm …"`:**
   - *Lý do:* Khi đã có nút phân đoạn `Năm` / `Tháng` và dải chọn nhanh 12 tháng tiết ngay trên lưới chính theo 42.3.4, việc gập lưới 12 bàn tháng đầy đủ vào `<details>` phía dưới giúp giữ đúng nguyên tắc "kết luận trên, bảng đầy đủ dưới" của Chuẩn trực quan 22 mà vẫn bảo toàn toàn bộ bảng tra cứu.
3. **Bổ sung biểu mẫu nhập ngày sinh nhỏ ngay trên `/than-so-hoc/nam-ca-nhan/[so]`:**
   - *Lý do:* Lệnh 42.1 liệt kê cả 3 trang (`/bieu-do-ngay-sinh`, `/so-chu-dao`, `/nam-ca-nhan/[so]`) cho mục `"Khi đã nhập ngày sinh"`. Trước đó `/nam-ca-nhan/[so]` chỉ là trang tĩnh theo con số `1..9`; việc thêm ô nhập `?ngay=YYYY-MM-DD` (kèm `noindex` và giữ `canonical`) giúp hiển thị đủ `DocNhanh`, vòng tròn Số chủ đạo, 4 đỉnh cao và lưới 3×3 ngay trên trang khi người dùng nhập ngày sinh.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- Không có dữ liệu thiếu trong phạm vi Lệnh 42; toàn bộ hàm và dữ liệu từ `src/lib/trang/phan-truc-quan.ts`, `than-so-hoc.ts`, `phong-thuy.ts`, `cuu-tinh.ts` đáp ứng đầy đủ các yêu cầu hiển thị và đối chiếu.

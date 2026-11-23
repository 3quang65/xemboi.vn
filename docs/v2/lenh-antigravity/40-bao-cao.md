# Báo cáo Lệnh 40: Thành phần trực quan dùng chung + làm lại kết quả Bát tự

Ngày hoàn thành: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/components/ck/truc-quan/truc-quan.css` (`7.209` byte ≤ `30.720` B / 30 KB) — CSS dùng chung cho khối trực quan (tiền tố `ck-tq-`), khai báo 5 token màu nhạt trên `.ck` (`--ck-moc-nhat`, `--ck-hoa-nhat`, `--ck-tho-nhat`, `--ck-kim-nhat`, `--ck-thuy-nhat`) dùng `color-mix(in srgb, ...)` kèm giá trị dự phòng hex, kiểu cho `DocNhanh` (1 cột ở `≤ 640px`, 2 cột ở `≤ 1024px`, 3 cột ở desktop), `ThuatNgu` (`popover`, vùng bấm ≥ 44×44 px), `ChuGiaiHanh`, `TrichNguyenVan`, khối `<details>` `"Sách ghi"`, `@media (prefers-reduced-motion: reduce)` và `@media print`.
- `src/components/ck/truc-quan/DocNhanh.tsx` (`2.564` byte) — Server Component (không `'use client'`) hiển thị dòng phụ (tùy chọn `dongPhu`), dải trên câu dẫn (`trenCau`), câu tóm tắt (`20px`, đậm vừa), lưới thẻ sự kiện nền `--ck-<hanh>-nhat`, chữ serif lớn tô màu `--ck-<hanh>`, 1–2 dòng `chiTiet`, và `<details>` `"Sách ghi"` khi thẻ có `trich`.
- `src/components/ck/truc-quan/ThuatNgu.tsx` (`960` byte) — Server Component tạo nút gạch chân chấm (`popoverTarget`) mở hộp `[popover="auto"]` hiển thị tên thuật ngữ, nghĩa ngắn và nút đóng `×` (`popoverTargetAction="hide"`), chạy thuần HTML không JS.
- `src/components/ck/truc-quan/ChuGiaiHanh.tsx` (`806` byte) — Server Component hiển thị hàng 5 chấm màu ngũ hành (`Mộc`, `Hỏa`, `Thổ`, `Kim`, `Thủy`).
- `src/components/ck/truc-quan/TrichNguyenVan.tsx` (`949` byte) — Server Component in nguyên văn chữ Hán (giữ nguyên dấu lược `"…"`), kèm tên sách, tác giả, niên đại, quyển/mục, số đoạn và liên kết ghi công Kanripo (`CC BY-SA 4.0`).
- `src/components/ck/truc-quan/index.ts` (`370` byte) — Xuất gọn các thành phần và kiểu của `src/components/ck/truc-quan/`.
- `src/app/(v2)/bat-tu/lap-la-so/SoDoQuanHeSvg.tsx` (`10.807` byte) — Server Component vẽ cung quan hệ giữa 4 trụ theo thứ tự trái→phải `Giờ · Ngày · Tháng · Năm` bằng SVG `viewBox="0 0 400 H"` (`vectorEffect="non-scaling-stroke"`): `hang === 'can'` vẽ phía trên hàng can, `hang === 'chi'` vẽ phía dưới hàng chi; cung xa cao/sâu hơn cung gần; tách tầng và lệch nhẹ đầu mút khi trùng cặp (như Xung và Hình cùng cặp Ngày–Giờ ở ca thứ hai); 5 kiểu nét khác biệt cả ở ảnh xám (`hop` liền, `chua-thanh` chấm thưa, `xung` gạch dài `#B7791F`, `hinh` chấm dày nâu, `hai` gạch-chấm tím xám); kèm `ChuGiaiQuanHe`, `MauNetQuanHeSvg`, và dải chip `.ck-bt-qh-chip-ds` thay thế trên màn `< 640px` khi số tầng cung > 2.
- `src/app/(v2)/bat-tu/lap-la-so/DaiVanCuonClient.tsx` (`1.108` byte) — Client component rất nhỏ chỉ dùng để cuộn thẻ Đại vận đang chạy (`[data-dang-chay="true"]`) vào giữa dải trên màn hẹp khi tải trang (tôn trọng `prefers-reduced-motion`, không làm trôi cuộn dọc trang).
- `docs/v2/lenh-antigravity/40-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`5` ảnh):
  - `ck-bt40-ca1-1366.png` (`1.357.440` byte)
  - `ck-bt40-ca1-375.png` (`895.026` byte)
  - `ck-bt40-ca2-1366.png` (`1.468.570` byte)
  - `ck-bt40-ca2-375.png` (`991.607` byte)
  - `ck-bt40-ca2-grayscale-1366.png` (`105.683` byte)

### Tệp chỉnh sửa
- `src/components/ck/canChiHelpers.ts` (`4.250` byte) — Thêm hằng số `CAN_HAN` (甲乙丙丁戊己庚辛壬癸) ngay sau `CHI_HAN`.
- `src/app/(v2)/bat-tu/lap-la-so/page.tsx` (`36.456` byte) — Giữ nguyên form và `generateMetadata`; truyền rõ `namXem` (giờ VN) vào `lapLaSoBatTu`; dựng lại toàn bộ phần kết quả theo đúng thứ tự A–F của Lệnh 40 và áp đủ 8 điểm từ mục `"Học từ thị trường"`:
  - **A. Đọc nhanh:** dùng `DocNhanh` với `docNhanh(ketQua, quanHe)`, dòng ngày giờ sinh phía trên, dải 8 chữ Hán cỡ lớn (`Giờ, Ngày · Bạn, Tháng, Năm`) kèm tên Việt ngay dưới từng chữ đặt phía trên câu `cau`, bọc `ThuatNgu` ở tiêu đề thuật ngữ.
  - **B. Tứ trụ dạng thẻ chữ lớn:** 4 cột `Giờ · Ngày · Tháng · Năm` (nền nhạt theo hành chi, riêng trụ Ngày viền son 2px + nhãn `"Nhật chủ"` và `"Bạn"`), thập thần của can dạng pill bọc `ThuatNgu` ở 3 trụ còn lại, can/chi cỡ serif `48px` (`1366px`/`768px`) và `32px` (`375px`) tô màu `--ck-<hanh>` kèm chữ Hán, viên tàng can tô màu hành kèm `ThuatNgu` thập thần, nạp âm nguyên chuỗi lib, SVG quan hệ trên/dưới + chú giải nét & hành ngay dưới hình, bảng chi tiết cũ chuyển vào `<details>` `"Xem dạng bảng"`.
  - **C. Quan hệ giữa các trụ:** danh sách `quanHe` kèm huy hiệu nhóm khớp kiểu nét trên hình, tên loại bọc `ThuatNgu`, `moTa` nguyên văn, `<details>` `"Sách ghi"` in `TrichNguyenVan`; có xung hoặc hình thì in thẳng `xungKhongVoiDoan` / `hinhKhongVoiDoan` không gập ngay bên dưới.
  - **D. Ngũ hành:** 5 cột đứng trên desktop / 5 thanh dày (`18px` ≥ 14px) trên di động kèm số lượng, `%` trên 8 chữ, tag `"Nhật chủ"` và tag `"Khuyết"` + khung gạch đứt `"0, chưa có"` cho hành bằng 0, `ChuGiaiHanh` và dòng chú thích `"Đếm 8 chữ lộ (4 can, 4 chi), chưa tính tàng can."` ngay dưới tiêu đề.
  - **E. Đại vận:** in nguyên `giaoVan(ketQua).cau`, dải 8 thẻ (hiện đủ 8 cột ở `1366px`, cuộn ngang `scroll-snap` ở `< 1100px`), can chi 2 chữ lớn tô màu `hanhCan`/`hanhChi` kèm chữ Hán, **năm** nổi bật phía trên (`1999–2008`) và **`"x–y tuổi mụ"`** bên dưới, thẻ đang chạy khung son + nhãn `"Đang chạy"`, thẻ đã qua làm nhạt nhẹ; bỏ bảng đại vận cũ.
  - **F. Cách tính & Luận giải:** bổ sung `Lệnh tháng (chi tháng)`, `Tiết trước`, `Tiết sau` cùng `quyUoc` trong `<details>` `"Cách tính"`; giữ khối `"Luận giải lá số Bát tự"` và `"Tra cứu liên quan"` như cũ.
- `src/app/(v2)/bat-tu/bat-tu.css` (`21.409` byte ≤ `30.720` B / 30 KB) — Bổ sung kiểu cho dải 8 chữ Hán, thẻ Tứ trụ 4 cột ở cả `375px` và `1366px` (viên tàng can dẹt `border-radius: 999px`, 2 dòng gọn cao `~44px`), SVG/nhãn/chú giải quan hệ, danh sách mục C, biểu đồ cột/thanh Ngũ hành, dải thẻ Đại vận, bảng thông số trong `"Cách tính"`, bảo đảm vùng bấm ≥ 44px và giữ kiểu form/bảng cho `/bat-tu` và `<details>` `"Xem dạng bảng"`.

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `tests/**`, `package.json`. *(Ghi chú: `src/app/(v2)/chiem-tinh/chiem-tinh.css`, `src/lib/trang/truc-quan-43.ts`, `tests/trang/truc-quan-43.test.mjs` là tệp có sẵn trong workspace trước khi thực hiện Lệnh 40, không đụng tới).*
- Không cài gói npm, không commit, không chạy `next build`.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**:
   - Đạt, mã thoát `0` (`TSC_EXIT=0`, 0 lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/bat-tu.test.mjs tests/trang/bat-tu-truc-quan.test.mjs`)**:
   - Đạt, mã thoát `0` (`TEST_EXIT=0`): `12/12` bài test qua, `0` thất bại, `0` bị bỏ qua.
3. **Kiểm tra dung lượng CSS & chữ cấm**:
   - `src/components/ck/truc-quan/truc-quan.css`: `7.209` byte (≤ `30.720` B).
   - `src/app/(v2)/bat-tu/bat-tu.css`: `21.409` byte (≤ `30.720` B).
   - Toàn bộ lớp mới mang tiền tố `ck-`; không dùng biến v1; 100% tiếng Việt, không sót chữ tiếng Anh hay từ cấm (`forbiddenMatch: null`).
4. **Kiểm tra trình duyệt trên `http://localhost:3047` (Chromium via `playwright-core`) ở 3 khổ `1366px`, `768px`, `375px`**:
   - Mở `/bat-tu`, `/bat-tu/lap-la-so`, **Ca 1** (`?ngay=1&thang=6&nam=1990&gio=8&phut=30&gioiTinh=nu`), **Ca 2** (`?ngay=19&thang=4&nam=1975&gio=2&phut=0&gioiTinh=nam`): tất cả trả **HTTP 200**, `0` console error, `0` `pageerror`, `0` HTTP ≥ 400.
   - **Không tràn ngang:** `scrollWidth === innerWidth` (`1366`, `768`, `375`) trên cả 4 URL; `cardOverflow: false`; dải Đại vận ở `1366px` vừa đủ 8 thẻ (`scrollWidth === clientWidth === 1120px`); ở `375px` và `768px`, `DaiVanCuonClient` căn giữa thẻ đang chạy (`activeCentered: true`) mà không làm trôi cuộn dọc trang (`scrollY: 0`).
   - **Lưới thẻ `DocNhanh`:** `1` cột ở `375px`, `2` cột ở `768px`, `3` cột ở `1366px`.
   - **Ca 1 (`01/06/1990 08:30 nữ`):**
     - Dải 8 chữ Hán: `甲辰 丁酉 辛巳 庚午` (`Giáp Thìn Đinh Dậu Tân Tỵ Canh Ngọ`, theo thứ tự Giờ–Ngày–Tháng–Năm khớp 4 thẻ trụ) đặt ngay trên câu `cau` nguyên văn: `"Nhật chủ Đinh Hỏa, sinh tháng Tỵ (mùa hạ); 8 chữ nhiều Hỏa và Kim nhất, chưa có Thủy; hiện đang ở đại vận Mậu Dần (2019–2028)."`.
     - 4 trụ L→R: `Giờ (Giáp Thìn)`, `Ngày (Đinh Dậu, nhãn Nhật chủ + Bạn)`, `Tháng (Tân Tỵ)`, `Năm (Canh Ngọ)`; đúng `2` quan hệ (`Lục hợp` Dậu–Thìn và `Tam hợp thiếu một chữ` Tỵ–Dậu thiếu Sửu).
     - Cỡ chữ Can/Chi đo được: `48px` ở `1366px` và `768px`, `32px` ở `375px` (đạt chuẩn ≥ 44px desktop và ≥ 30px/32px di động).
     - Ngũ hành: hiển thị đủ `%` (`12,5%`, `37,5%`, `0%`), tag `Nhật chủ` ở `Hỏa`, khung gạch đứt `"0, chưa có"` + tag `Khuyết` ở `Thủy`.
     - Đại vận: in nguyên `giaoVan` (`"Đại vận đi nghịch. Khởi vận sau khi sinh 8 năm 9 tháng (3 ngày tính 1 năm), tức khoảng tháng 3/1999. Vận đầu Canh Thìn tính từ năm 1999, ghi theo tuổi mụ là 10 tuổi."`), thẻ 1 ghi `1999–2008` (`19px`) và `10–19 tuổi mụ` (`12px`).
   - **Ca 2 (`19/04/1975 02:00 nam`) và kiểm tra ảnh xám:**
     - 4 trụ L→R: `Đinh Sửu`, `Ất Mùi`, `Canh Thìn`, `Ất Mão`; đủ `6` quan hệ (`2` cung `Can hợp` phía trên nối Ất–Canh năm–tháng và Canh–Ất tháng–ngày; `4` cung phía dưới gồm `Xung` Mùi–Sửu, `Hình` Mùi–Sửu tách tầng không đè nhau, `Hại` Mão–Thìn, `Thiếu Hợi` Mão–Mùi), kèm `2` đoạn nguyên văn không gập `xungKhongVoiDoan` và `hinhKhongVoiDoan`.
     - Kiểm tra va chạm hộp nhãn cung quan hệ (`.ck-bt-qh-nhan`): `pillOverlaps: []` ở cả `375px`, `768px`, `1366px`.
     - Ảnh xám (`filter: grayscale(1)` — `ck-bt40-ca2-grayscale-1366.png`): cả 5 kiểu nét (liền, chấm thưa, gạch dài, chấm dày, gạch-chấm) phân biệt rõ ràng.
   - **Vùng bấm ≥ 44px:** `smallTargets: []` ở cả `375px`, `768px`, `1366px`.
   - **Tắt JS (`javaScriptEnabled: false`):** trang hiển thị đủ nội dung; bấm `ThuatNgu` mở hộp `:popover-open` và bấm `×` đóng lại; bấm `<details>` `"Sách ghi"`, `"Xem dạng bảng"` và `"Cách tính"` (có đủ `Lệnh tháng`, `Lập hạ`, `Mang chủng`, `quyUoc`) mở bình thường.
   - **Duyệt ảnh chụp:** đã mở xem trực tiếp toàn bộ `5` ảnh `ck-bt40-*.png` — bố cục sạch, chữ rõ tương phản tốt, không đè nhãn ở cả `375px` lẫn `1366px`.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Dùng `<span popover="auto">` thay cho `<div popover>` trong `ThuatNgu.tsx`:**
   - *Lý do:* `ThuatNgu` được đặt cả trong phần tử nội tuyến và tiêu đề (`<h2>`, `<p>`, `<span>`, `<li>`); nếu dùng `<div>` bên trong `<h2>`/`<p>`/`<span>` sẽ vi phạm HTML content model và có thể gây cảnh báo hydration trong React 19 / Next.js. Dùng `<span popover="auto">` kết hợp `.ck-tq-tn-hop:popover-open { display: block; }` giữ hợp lệ HTML mà hiển thị hộp popover khối đầy đủ như thiết kế.
2. **Ngưỡng chuyển chip quan hệ ở `375px` (`soTang > 2`) trong `SoDoQuanHeSvg.tsx`:**
   - *Lý do:* Mục `"Học từ thị trường"` cho phép chuyển sang hàng chip ở `375px` khi các cung đè nhau quá 2 tầng (`> 2` tầng), còn ở `≥ 768px` vẫn vẽ cung. Với cả Ca 1 (`1` tầng) và Ca 2 (`2` tầng), các cung SVG và nhãn đều tách bạch không chồng lên nhau ngay ở `375px` (`pillOverlaps: []`), nên hình cung vẫn giữ được ở `375px` và tự động chuyển sang hàng chip nếu lá số có từ `3` tầng cung trở lên.
3. **Chú thích mục `Ngũ hành` giữ nguyên câu dưới tiêu đề:**
   - *Lý do:* Thay câu cũ `"Đếm 8 chữ can chi, chưa tính tàng can"` bằng dòng `"Đếm 8 chữ lộ (4 can, 4 chi), chưa tính tàng can."` (theo mục `"Học từ thị trường"` điểm 4) đặt ngay dưới `<h2>Ngũ hành</h2>` để tránh lặp thông tin ở đáy thẻ.
4. **Dùng `giaoVan(ketQua).cau` thay cho câu khởi vận ngắn cũ ở đầu mục `Đại vận`:**
   - *Lý do:* Áp dụng điểm 5 mục `"Học từ thị trường"`; câu `giaoVan(ketQua).cau` đã bao gồm đủ chiều đi thuận/nghịch, số năm tháng khởi vận sau sinh, tháng/năm dương lịch ước tính và quy ước tuổi mụ ở vận đầu.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- Không có dữ liệu thiếu bắt buộc ở phạm vi Lệnh 40; các mục trong mục `"Để sau"` của `40-bat-tu-truc-quan.md` (bấm lưu niên phủ lá số, lập tam trụ khi không rõ giờ, hiệu chỉnh giờ mặt trời) giữ nguyên chờ lệnh riêng theo phân công.

## 5. Sửa sau duyệt

Sau khi số liệu cả 2 ca được duyệt, đã sửa trọn 5 điểm trình bày theo yêu cầu và kiểm tra lại:

1. **Thống nhất thứ tự dải 8 chữ Hán ở Đọc nhanh (`page.tsx`):** Đổi từ `ketQua.tru` (`Năm–Tháng–Ngày–Giờ`) sang `bonTru` (`Giờ–Ngày–Tháng–Năm`: `甲辰 丁酉 辛巳 庚午` / `Giáp Thìn Đinh Dậu Tân Tỵ Canh Ngọ`), khớp từng cột với 4 thẻ trụ bên dưới.
2. **Bỏ pill `"Nhật chủ"` lặp ở thẻ trụ Ngày (`page.tsx`, `bat-tu.css`):** Chỉ render `.ck-bt-tt-hang` (`.ck-bt-tt-pill`) cho 3 trụ Giờ, Tháng, Năm (`!laNgay`); trụ Ngày giữ huy hiệu đỏ `"Nhật chủ"` + nhãn `"Bạn"` và dùng `.ck-bt-tru-phan-dau` (`min-height` cố định `104px` desktop / `96px` mobile) để hàng chữ Thiên can của cả 4 cột vẫn thẳng hàng (`ngayPillCount: 0`).
3. **Thu gọn viên tàng can ở `375px` (`bat-tu.css`):** Sửa quy tắc `.ck-bt-tang-vien` trong `@media (max-width: 700px)` thành viên nang dẹt (`width: 100%; border-radius: 999px; min-height: 44px; padding: 4px 6px`), xếp can ở dòng trên và thập thần (`9.5px`, `nowrap`) ở dòng dưới — đo thực tế ở `375px`: `tangPillMinW = 67.3px`, `tangPillMaxH = 44.1px`, `tangPillOverflow = false`, vùng bấm `.ck-tq-tn-nut` vẫn đạt `≥ 44px` (`smallTargets: []`).
4. **Bỏ dòng lặp ở đáy Ngũ hành (`page.tsx`, `bat-tu.css`):** Xóa `<p className="ck-bt-nh-ghi-chu">Đếm 8 chữ can chi, chưa tính tàng can</p>` ở đáy `.ck-bt-nh-khung`, chỉ giữ dòng `"Đếm 8 chữ lộ (4 can, 4 chi), chưa tính tàng can."` dưới `<h2>Ngũ hành</h2>` và `ChuGiaiHanh` ở chân thẻ (`hasOnlyNewDem8Chu: true`).
5. **Làm nổi số năm trên thẻ Đại vận (`page.tsx`, `bat-tu.css`):** Bỏ chữ `"năm"` đứng trước để hiển thị thẳng `"1999–2008"` bằng cỡ chữ lớn `19px` serif (`dvNamSize: 19`), ngay dưới Can Chi (`22px`), còn dòng `"10–19 tuổi mụ"` đặt nhỏ hơn (`dvTuoiSize: 12`) bên dưới.
6. **Kiểm tra lại sau khi sửa:**
   - `.\node_modules\.bin\tsc.cmd --noEmit -p .`: thoát mã `0` (`0` lỗi).
   - `src/app/(v2)/bat-tu/bat-tu.css`: `21.409` byte (≤ `30.720` B).
   - Playwright trên `http://localhost:3047` ở `375px`, `768px`, `1366px` (đủ `/bat-tu`, `/bat-tu/lap-la-so`, Ca 1, Ca 2, và chế độ tắt JS): `0` console error, `0` `pageerror`, `0` HTTP ≥ 400, `0` tràn ngang (`scrollWidth === innerWidth`), `0` đè nhãn (`pillOverlaps: []`), `smallTargets: []`.
   - Đã chụp lại đủ `5` ảnh (bao gồm [ck-bt40-ca2-375.png](file:///d:/VibeCode/Antigravity/xemboi.vn/docs/v2/bang-chung/ck-bt40-ca2-375.png)) và mở xem trực tiếp xác nhận cả 5 điểm sửa hiển thị đúng.


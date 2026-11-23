# Báo cáo Lệnh 41: Xem ngày và lịch âm trực quan

Ngày hoàn thành: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/components/ck/truc-quan/DaiGio.tsx` (`4.102` byte) — Server Component hiển thị dải 12 giờ trong ngày (`1×12` ở `≥ 768px`, `2×6` ở `< 768px`): ô giờ hoàng đạo nền `--ck-moc-nhat` kèm vạch đáy `3px` `--ck-moc` và chữ đậm, ô giờ hắc đạo nền giấy nhạt chữ xám vừa (không dùng đỏ), `daQua` mờ `55%`, `hienTai` khung son `2px` kèm nhãn `"Bây giờ"`, trục mốc `"23:00 · 05:00 · 11:00 · 17:00 · 23:00"` khớp vị trí Tý/Mão/Ngọ/Dậu trên desktop và dòng `ghiChuTy`, kèm chú giải `ChuGiaiDaiGio` dùng lại được và `aria-label` đầy đủ cho từng ô.
- `src/components/ck/truc-quan/TheNgayChon.tsx` (`1.376` byte) — Server Component thẻ ngày chọn hợp nhất theo việc: dòng đầu gồm thứ + ngày dương lớn cùng ngày âm và can chi ngày, danh sách `lyDo` in nguyên văn, thẻ `dauDanh` có viền son `2px` và huy hiệu `"Hợp nhất trong khoảng"`, bấm cả thẻ mở trang chi tiết ngày (`duongDanNgayTuIso`).
- `src/app/(v2)/xem-ngay/LuoiLichXemNgay.tsx` (`11.565` byte) — Server Component dùng lại `thangLich` (`src/lib/trang/lich.ts`) dựng lưới lịch 7 cột (`T2–CN`) cho cả chế độ tổng hợp (`/xem-ngay`, `/xem-ngay/thang-mm-yyyy`) và chế độ theo việc (`hop` viền xanh, `ky` nền hổ phách rất nhạt, `khac` để trơn), kèm ngày âm nhỏ (mùng 1 dạng `1/10`), chấm xanh khi thần hoàng đạo, tên trực nhỏ, Chủ nhật màu son, hôm nay có khung nhấn, bấm ô mở trang ngày và chú giải rõ ràng; xuất kèm `BangThangTongHop` dùng chung trong `<details>` `"Xem dạng bảng"`.
- `docs/v2/lenh-antigravity/41-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`10` ảnh):
  - `ck-xn41-hub-1366.png` (`1.437.213` byte)
  - `ck-xn41-hub-375.png` (`1.119.240` byte)
  - `ck-xn41-khai-truong-60-1366.png` (`1.399.665` byte)
  - `ck-xn41-khai-truong-60-375.png` (`1.062.779` byte)
  - `ck-xn41-lich-am-1366.png` (`1.237.763` byte)
  - `ck-xn41-lich-am-375.png` (`862.189` byte)
  - `ck-xn41-ngay-1366.png` (`995.442` byte)
  - `ck-xn41-ngay-375.png` (`670.407` byte)
  - `ck-xn41-xuat-hanh-1366.png` (`1.326.447` byte)
  - `ck-xn41-xuat-hanh-375.png` (`1.061.952` byte)

### Tệp chỉnh sửa
- `src/components/ck/truc-quan/DocNhanh.tsx` (`3.030` byte) — Bổ sung prop tùy chọn `muc?: 'tot' | 'binh' | 'diu'` trên `TheDocNhanhItem` (`tot`: xanh `--ck-moc`; `binh`: mực thường; `diu`: hổ phách `#B7791F`, không đỏ), `luoiCot?: 3 | 4` (mặc định `3` giữ nguyên trang Bát tự) và `tieuDeId?: string`.
- `src/components/ck/truc-quan/TrichNguyenVan.tsx` (`1.021` byte) — Cho phép `tacGia` và `nienDai` tùy chọn trên `NguonSachItem` để nhận trực tiếp `NGUON_XEM_NGAY` và `NGUON_XUAT_HANH` mà giữ nguyên đầu ra cho Bát tự.
- `src/components/ck/truc-quan/index.ts` (`560` byte) — Xuất thêm `DaiGio`, `ChuGiaiDaiGio`, `TheNgayChon`, `MucDocNhanh` và các kiểu liên quan.
- `src/components/ck/truc-quan/truc-quan.css` (`14.022` byte ≤ `30.720` B / 30 KB) — Bổ sung kiểu cho `DocNhanh` (`muc` + lưới 4 cột desktop), `DaiGio` (`1×12` desktop/tablet, `2×6` ở `≤ 767px`, trục giờ khớp 25%/50%/75%) và `TheNgayChon`.
- `src/components/ck/ChiTietNgay.tsx` (`4.634` byte) — Thêm prop tùy chọn `anBangGio?: boolean` (mặc định `false`) để ẩn bảng 12 giờ cũ trên các trang đã đặt `DaiGio` bên dưới, không ảnh hưởng các trang khác như `/lich-am/ngay-mai`.
- `src/app/(v2)/xem-ngay/BaHeGiaiThich.tsx` (`5.518` byte) — Dùng lại `TrichNguyenVan` cho 3 đoạn trích nguyên văn từ Ngọc hạp ký và Khâm định Hiệp kỷ biện phương thư.
- `src/app/(v2)/xem-ngay/page.tsx` (`16.664` byte) — Làm lại `/xem-ngay`: đầu mục `"Hôm nay"` dùng `DocNhanh` (`docNhanhNgay`, bọc `ThuatNgu` ở 12 thần, 12 trực, giờ hoàng đạo) + chữ ngày chính cỡ lớn tô theo hành nạp âm ngày, ngay sau là `DaiGio`, 3 lớp chi tiết giữ nguyên nội dung đặt bên dưới trong `<details open>`, thẻ phụ `"Ngày mai"` bổ sung dòng `"Giờ hoàng đạo: …"`, khối `"Chọn ngày theo việc"` chuyển thành lưới nút phân đoạn (`2` cột ở `375px`, `3` ở `768px`, `4` ở `1366px`) có tên việc và số ngày hợp, và `"Bảng xem ngày cả tháng"` chuyển sang `LuoiLichXemNgay` 7 cột kèm `<details>` `"Xem dạng bảng"`.
- `src/app/(v2)/xem-ngay/[ma]/page.tsx` (`15.700` byte) — Thêm khối `"Ngày hợp nhất cho {việc}"` ngay dưới tiêu đề với 3 nút phân đoạn link `?trong=30|60|90` (mặc định `30`, giá trị lạ về `30`, trang có tham số đặt `robots: noindex` và giữ `canonical` không tham số), dòng tóm tắt số ngày hợp/kỵ, tối đa 3 `TheNgayChon`, link `"Tải về lịch (.ics)"` có thuộc tính `download`, `<details>` `"Cách xếp"` in nguyên văn `tieuChi` và `ghiChu`; chuyển trang tháng chung `/xem-ngay/thang-mm-yyyy` sang lưới 7 cột kèm `<details>` `"Xem dạng bảng"`.
- `src/app/(v2)/xem-ngay/KhoiViecThang.tsx` (`8.930` byte) — Chuyển bảng tháng theo việc sang `LuoiLichXemNgay` 7 cột (`hop` viền xanh, `ky` nền hổ phách rất nhạt, `khac` để trơn, có chú giải), gộp bảng chi tiết ngày nên/kỵ cũ vào `<details>` `"Xem dạng bảng"`.
- `src/app/(v2)/xem-ngay/xuat-hanh/page.tsx` (`9.803` byte) — Đổi danh sách giờ hoàng đạo mùng 1–10 Tết sang 10 thẻ ngày dùng `DaiGio` kèm chú giải chung `ChuGiaiDaiGio`, `GHI_CHU_GIO_TY` và hướng 3 thần; dùng `TrichNguyenVan` cho 3 bài ca hướng.
- `src/app/(v2)/xem-ngay/xem-ngay.css` (`27.208` byte ≤ `30.720` B / 30 KB) — Bổ sung kiểu cho nút phân đoạn việc, thanh chọn khoảng `30/60/90 ngày`, lưới lịch 7 cột (cả 375px lẫn 1366px), thẻ ngày Tết xuất hành; loại bỏ quy tắc bảng xuất hành cũ và đổi nhãn `"Không nên"` từ đỏ sang hổ phách dịu.
- `src/app/(v2)/lich-am/page.tsx` (`4.205` byte) — Gắn `DaiGio` cho hôm nay ngay dưới khối ngày `ChiTietNgay` (bật `anBangGio` để không lặp).
- `src/app/(v2)/lich-am/[yyyy]/[mm]/[dd]/page.tsx` (`4.047` byte) — Gắn `DaiGio` ngay dưới `ChiTietNgay` (tự động không có `hienTai` khi không phải hôm nay).

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `src/app/(v2)/bat-tu/**` (giữ nguyên `bat-tu.css` trên đĩa), `tests/**`, `package.json`. *(Ghi chú: `src/app/(v2)/chiem-tinh/chiem-tinh.css` đã có chỉnh sửa sẵn trong workspace trước khi thực hiện Lệnh 41, không đụng tới).*
- Không cài gói npm, không commit, không chạy `next build`.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**:
   - Đạt, mã thoát `0` (`TSC_EXIT=0`, `0` lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/xem-ngay.test.mjs tests/trang/xem-ngay-truc-quan.test.mjs tests/trang/lich.test.mjs tests/trang/xuat-hanh.test.mjs tests/trang/bat-tu-truc-quan.test.mjs`)**:
   - Đạt, mã thoát `0` (`TEST_EXIT=0`): `40/40` bài test qua, `0` thất bại, `0` bị bỏ qua.
3. **Kiểm tra dung lượng CSS**:
   - `src/components/ck/truc-quan/truc-quan.css`: `14.022` byte (≤ `30.720` B).
   - `src/app/(v2)/xem-ngay/xem-ngay.css`: `27.208` byte (≤ `30.720` B).
4. **Kiểm tra trình duyệt trên `http://localhost:3047` (Chromium via `playwright-core`) ở 3 khổ `1366px`, `768px`, `375px`**:
   - Đã kiểm toàn bộ `12` đường dẫn (`/xem-ngay`, `/xem-ngay/khai-truong`, `/xem-ngay/khai-truong?trong=60`, `/xem-ngay/khai-truong?trong=90`, `/xem-ngay/khai-truong?trong=abc`, `/xem-ngay/thang-11-2026`, `/xem-ngay/khai-truong/thang-11-2026`, `/xem-ngay/xuat-hanh`, `/lich-am`, `/lich-am/2026/11/24`, `/lich-am/2026/11/25`, và kiểm tra hồi quy `/bat-tu/lap-la-so?ngay=1&thang=6&nam=1990&gio=8&phut=30&gioiTinh=nu`): tất cả trả **HTTP 200**, `0` console error, `0` `pageerror`, `0` HTTP ≥ 400, không có từ cấm (`hóa giải|vật phẩm|sát khí|cải vận`).
   - **Không tràn ngang:** `scrollWidth === innerWidth` (`1366`, `768`, `375`) trên cả `12` URL.
   - **Nghiệm thu 41.5.1 (ngày `24/11/2026` — hôm nay):**
     - Trên `/xem-ngay`, `/lich-am` và `/lich-am/2026/11/24`: `DaiGio` tô đúng `6` ô hoàng đạo `Tý, Sửu, Thìn, Tỵ, Mùi, Tuất` khớp `ngayLich(24, 11, 2026).gioHoangDao`; giờ hiện tại (00:xx giờ VN) đánh dấu `Tý` với khung son và nhãn `"Bây giờ"`.
     - Trên `/lich-am/2026/11/25`: `hienTai` rỗng (`[]`) và `daQua` = `0`, đúng 6 ô hoàng đạo `Tý, Dần, Mão, Ngọ, Mùi, Dậu`.
   - **Nghiệm thu 41.5.2 (`/xem-ngay/khai-truong?trong=60` và tệp `.ics`):**
     - 3 thẻ `TheNgayChon` ra đúng thứ tự `chonNgayHopNhat('khai-truong', 24/11/2026, 60)`:
       1. **Thứ sáu 08/01/2027** (`Âm 1/12 · Ngày Đinh Hợi`, có nhãn `"Hợp nhất trong khoảng"`)
       2. **Thứ hai 11/01/2027** (`Âm 4/12 · Ngày Canh Dần`)
       3. **Chủ nhật 17/01/2027** (`Âm 10/12 · Ngày Bính Thân`)
     - `?trong=60` và `?trong=abc` đều đặt `meta[name="robots"]` = `noindex, follow` và giữ `canonical` = `https://xemboi.vn/xem-ngay/khai-truong`; `?trong=abc` quay về mặc định `30 ngày` (`Thứ ba 01/12/2026`, `Thứ ba 24/11/2026`, `Chủ nhật 06/12/2026`).
     - `GET /xem-ngay/khai-truong/lich.ics?soNgay=60`: HTTP `200`, `content-type: text/calendar; charset=utf-8`, `content-disposition: attachment; filename="xemboi-khai-truong-60-ngay.ics"`, hợp lệ `BEGIN:VCALENDAR`..`END:VCALENDAR`, đúng `3` `VEVENT` (`20270108`, `20270111`, `20270117`), dòng dài nhất `75` byte UTF-8.
   - **Nghiệm thu 41.5.3 (375px & kích thước bấm):**
     - Dải `DaiGio` ở `1366px` và `768px` nằm `1` hàng × `12` ô; ở `375px` gập thành `2` hàng × `6` ô, không tràn ô (`overflowing: false`).
     - Nút phân đoạn việc trên `/xem-ngay`: `2` cột ở `375px` (chiều cao nhỏ nhất `69px` ≥ `44px`), `3` cột ở `768px` (`73px`), `4` cột ở `1366px` (`73px`).
     - Các ô lưới lịch 7 cột (`LuoiLichXemNgay`), nút chọn khoảng `30/60/90 ngày`, nút `.ics`: đều ≥ `44px` ở cả `375px` lẫn `1366px`.
     - Chữ ngày chính trên `/xem-ngay` (`24/11/2026`, hành Kim): `44px` ở `1366px` và `768px`, `34px` ở `375px` (đạt chuẩn ≥ 40px / ≥ 32px).
   - **Nghiệm thu 41.5.4 (Tắt JS — `javaScriptEnabled: false`):**
     - Bấm `ThuatNgu` mở hộp `:popover-open` (`1`) và bấm `×` đóng lại (`0`).
     - Bấm `<details>` `"Xem dạng bảng"` và `"Cách xếp"` đều mở bình thường.
     - Bấm link `"60 ngày"` điều hướng sang `/xem-ngay/khai-truong?trong=60` và hiển thị đủ 3 ngày hợp nhất (`Thứ sáu 08/01/2027` đứng đầu).
   - **Kiểm tra hồi quy Bát tự (`/bat-tu/lap-la-so`):** `DocNhanh` giữ đúng `3` cột ở `1366px`, `6` khối `TrichNguyenVan` hiển thị nguyên vẹn, `0` tràn ngang.
   - **Duyệt ảnh chụp:** đã mở xem trực tiếp toàn bộ `10` ảnh `ck-xn41-*.png` (`375px` và `1366px`) — bố cục sạch, tương phản tốt, không đè chữ, lưới lịch và dải giờ cân đối ở cả hai khổ.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Thêm prop tùy chọn `anBangGio` trên `ChiTietNgay.tsx` cho `/lich-am` và `/lich-am/[yyyy]/[mm]/[dd]`:**
   - *Lý do:* `ChiTietNgay` vốn đã dựng một lưới 12 giờ (`4×3`) bên trong khung thông tin ngày. Nếu giữ lưới cũ ngay phía trên `DaiGio` thì mỗi trang hiển thị tới hai khối 12 giờ trùng nhau. Tham số `anBangGio` mặc định `false` giúp ẩn lưới cũ trên `/lich-am` và `/lich-am/[yyyy]/[mm]/[dd]` để `DaiGio` làm khối giờ duy nhất, trong khi các trang chưa đụng tới như `/lich-am/ngay-mai` giữ nguyên hành vi cũ.
2. **Đổi bảng 10 ngày Tết ở `/xem-ngay/xuat-hanh` thành 10 thẻ ngày đặt `DaiGio` đủ chiều rộng:**
   - *Lý do:* Bảng 7 cột cũ đặt 6 giờ hoàng đạo thành danh sách thu gọn trong một ô `<td>`; khi đổi sang `DaiGio` gồm 12 ô theo chiều ngang, đặt 12 ô vào trong một cột bảng sẽ bị ép hẹp và tràn khung ở cả desktop lẫn 375px. Dựng mỗi ngày Mùng 1–10 thành một thẻ xếp dọc gồm đầu thẻ (ngày, can chi, 3 hướng thần) và dải `DaiGio` toàn chiều ngang giữ đúng `1×12` ở `≥ 768px` và `2×6` ở `375px`, đồng thời dùng chung một `ChuGiaiDaiGio` và một `GHI_CHU_GIO_TY` để tránh lặp chữ 10 lần.
3. **Cho phép `tacGia` và `nienDai` tùy chọn trên `TrichNguyenVan.tsx`:**
   - *Lý do:* `NGUON_XEM_NGAY` và `NGUON_XUAT_HANH` trong `src/lib/**` (vùng cấm sửa) không có trường `tacGia` (hoặc không có `nienDai` như `NGUON_XUAT_HANH`). Cho phép hai trường này tùy chọn giúp dùng lại trực tiếp `TrichNguyenVan` mà không bịa thêm dữ liệu nguồn và không làm thay đổi chuỗi hiển thị trên các trang Bát tự đã duyệt.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- Không có dữ liệu thiếu bắt buộc ở phạm vi Lệnh 41; toàn bộ dữ liệu từ `xem-ngay-truc-quan.ts`, `xem-ngay.ts`, `lich.ts`, `xuat-hanh.ts` và route `/xem-ngay/[ma]/lich.ics` đã đáp ứng đủ.

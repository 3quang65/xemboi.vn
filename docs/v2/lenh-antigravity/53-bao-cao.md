# Báo cáo Lệnh 53: Lục hào nâng cao và thịnh suy Mai hoa

Ngày thực hiện: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `docs/v2/lenh-antigravity/53-bao-cao.md` — Báo cáo nghiệm thu Lệnh 53.
- `4` ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-53-luc-hao-tien-cua-375.png` (`874.737` B) & `ck-53-luc-hao-tien-cua-1366.png` (`1.161.072` B)
  - `ck-53-mai-hoa-quan-mai-375.png` (`1.158.365` B) & `ck-53-mai-hoa-quan-mai-1366.png` (`1.463.104` B)

### Tệp chỉnh sửa (chỉ trong `src/app/(v2)/kinh-dich/**`)
- `src/app/(v2)/kinh-dich/luc-hao/GieoLucHaoClient.tsx` (`3.708` byte) — Thêm `<select name="viec">` chọn việc hỏi từ `VIEC_HOI` (mặc định rỗng = chỉ an quẻ) và giữ tham số `viec` khi gieo xu hoặc khi tắt JS (`?gieo=1&viec=...`).
- `src/app/(v2)/kinh-dich/luc-hao/page.tsx` (`33.926` byte) — Nối `haoNangCao`, `phucThan`, `dungThanTheoViec`, `ungKy` và `TRICH_NANG_CAO`:
  - Bảng an quẻ bổ sung cột **Vượng suy** (tháng, kèm chú thích `lâm nguyệt kiến` / `dư khí`) và **Nhật thần** (`Lâm nhật thần`, `Ngày sinh`, `Ngày khắc`, `Ngày hợp`, `Ngày xung`, `Ám động`, `Nhật phá`); ở `375px` gộp gọn hai nhãn vào dòng phụ để không cuộn ngang.
  - Phục thần vắng trong quẻ (`Phục: {lucThan} {chi} {hanh}`) đặt ngay dưới hào phi thần kèm khối trích `TRICH_NANG_CAO.phucThan` nguồn *Hỏa châu lâm* (`NGUON_HOA_CHAU_LAM`).
  - Khi chọn `viec` hợp lệ: tô hào dụng thần và hào `haoVuong`, gắn nhãn `Dụng` / `Chọn vượng` / `Nguyên` / `Kỵ` / `Cừu`, khối **Dụng thần: {lucThan}** (kèm xử lý `nguyetKien` và trích `nguyetKienDung`, `dungThan`/`tuXem`, `nguyenKyCuu`, `chonHaoVuong`), `<details>` **Mốc ứng kỳ theo sách** kèm câu `"Sách nêu các mốc có thể ứng; trang không chọn mốc nào."` và trích `ungKy`.
  - Bổ sung `vuongTuong` và `amDong` vào `<details>` **Các bước an quẻ theo sách**; bỏ qua `viec` không hợp lệ không 500; không in `nguyenVan`.
- `src/app/(v2)/kinh-dich/luc-hao.css` (`12.884` byte ≤ `30.720` B) — Thêm quy tắc cho ô chọn việc hỏi, cột Vượng suy & Nhật thần (ẩn trên `<= 720px` và thay bằng dòng phụ), nhãn bất lợi màu hổ phách `#B7791F` (không dùng đỏ báo động), khối phục thần, dụng thần, thẻ Nguyên/Kỵ/Cừu và ứng kỳ.
- `src/app/(v2)/kinh-dich/mai-hoa-dich-so/page.tsx` (`28.679` byte) — Thêm khối **Thịnh suy theo thời lệnh** (`thinhSuyMaiHoa`): dùng `thoiGianAnQue` cho ngày dương (theo ngày nhập hoặc ngày hiện tại khi lập theo số) để in đủ cột `Tháng` và `Ngày`, riêng hai ví dụ sách lấy chi tháng `(tháng âm + 1) % 12` và chỉ in cột `Tháng`; kèm dòng ghi chi đang dùng và `<details>` 3 đoạn trích `TRICH_MAI_HOA_THINH_SUY` (`queKhi`, `thinhSuy`, `thoiLenh`).
- `src/app/(v2)/kinh-dich/mai-hoa.css` (`11.518` byte ≤ `30.720` B) — Thêm lớp nhãn `Thịnh` / `Bình` / `Suy` (hổ phách `#B7791F` cho `Suy`) và dòng ghi thời lệnh.

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Toàn bộ sửa đổi mã nguồn chỉ nằm trong `src/app/(v2)/kinh-dich/**`. Không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, không cài gói, không commit, không `next build`, không bấm Overwrite.

## 2. Kết quả nghiệm thu (mục 53.4)

### 2.1. Kiểm kiểu, unit test và dung lượng CSS
- `.\node_modules\.bin\tsc.cmd --noEmit -p .`: `0` lỗi (`TSC_EXIT=0`).
- `.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/luc-hao-nang-cao.test.mjs tests/trang/mai-hoa.test.mjs tests/trang/luc-hao.test.mjs`: `18/18` bài kiểm tra đạt, `0` lỗi (`TEST_EXIT=0`).
- Dung lượng CSS: `luc-hao.css` = `12.884` B (`<= 30.720` B); `mai-hoa.css` = `11.518` B (`<= 30.720` B).

### 2.2. Kiểm chữ Hán
- Máy dò chữ Hán (`scripts/kiem-chu-han.mjs`): Claude Code chạy.
- Quét HTML và văn bản hiển thị bằng Playwright/fetch trên cả `5` URL nghiệm thu mục 53.4: `5/5` trả HTTP `200`, `0` ký tự chữ Hán, `0` từ cấm.

### 2.3. Kiểm trình duyệt Playwright (`375×812`, `1366×900`, tắt JS `375×812`)
- Mọi trang kiểm tra có `0` lỗi console, `0` `pageerror`, `0` phản hồi lỗi mạng `>= 400`, không cuộn ngang (`scrollWidth = 375/375` và `1366/1366`), toàn bộ nút/ô chọn/summary mới đều đạt `>= 44px`.
- Đối chiếu 5 ca nghiệm thu mục 53.4:
  1. `/kinh-dich/luc-hao?xu=987678&ngay=2026-11-24&gio=10:30&viec=tien-cua`: Ký Tế tháng Hợi có H6 Tý `Vượng`, H3 Hợi `Vượng, lâm nguyệt kiến`, H1 Mão `Tướng`, H4 Thân `Hưu tù` + `Ngày xung` (không ghi `Ám động`); phục thần `Phục: Thê tài Ngọ Hỏa` dưới hào 3; Dụng thần `Thê tài` vắng nằm ở phục thần; Nguyên thần `Tử tôn` hào 1, Kỵ thần `Huynh đệ` hào 3, 6, Cừu thần `Phụ mẫu` hào 4.
  2. `/kinh-dich/luc-hao?xu=777777&ngay=2026-11-24&gio=10:30&viec=cha-me`: 2 hào Phụ mẫu (hào 3 Thìn, hào 6 Tuất); mở `<details>` **Mốc ứng kỳ theo sách** có dòng `"Sách nêu các mốc có thể ứng; trang không chọn mốc nào."` và mốc tuần không hào 3 Thìn: `ngày Thìn, Tuất`.
  3. `/kinh-dich/luc-hao?xu=987678&viec=sai-ma`: trả HTTP `200`, bỏ qua việc sai, không 500.
  4. `/kinh-dich/mai-hoa-dich-so?vi-du=quan-mai`: chỉ có cột `Tháng (Sửu)`, Thể Đoài `Bình`, Biến Cấn `Thịnh`.
  5. `/kinh-dich/mai-hoa-dich-so?ngay=2026-11-24&gio=10:30`: có hai cột `Tháng (Hợi)` và `Ngày (Dần)`, Thể Càn tháng `Bình` ngày `Bình`, Dụng Cấn ngày `Suy`.
  6. Tắt JS ở `375px`: chọn `viec=tien-cua` và bấm `"An quẻ lục hào"` submit GET hoạt động bình thường.
- Đã mở đọc kiểm tra trực quan đủ `4` ảnh `ck-53-*.png`.

## 3. Các điểm lệch khỏi lệnh và lý do
- Không có điểm lệch. Báo cáo viết ngay sau khi hoàn tất kiểm tra Playwright, `tsc --noEmit` và 3 bộ unit test; phần quét toàn site `kiem-chu-han.mjs` do Claude Code chạy như hướng dẫn.

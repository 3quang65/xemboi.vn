# Báo cáo Lệnh 48: Cặp con giáp (79 trang) và Tứ Hóa

Ngày thực hiện: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/xem-tuoi/con-giap/LocTuoiCapClient.tsx` (`4.187` byte) — Hàng 12 nút `"Tuổi của bạn"` lọc nhanh 11 cặp khác chi dạng thẻ dọc; giữ sẵn toàn bộ 12 nhóm trong `<details>` để tắt JS vẫn mở đọc đủ.
- `src/app/(v2)/xem-tuoi/con-giap/page.tsx` (`10.348` byte) — Trang `/xem-tuoi/con-giap`: `DocNhanh`, ma trận 12 × 12 con giáp (cột đầu dính `sticky` khi cuộn ngang ở 375px, phân biệt 5 nhóm bằng nền, viền và ký hiệu riêng cho người mù màu, bỏ qua Tam hội trên ô ma trận để Dần × Mão trắng, đường chéo viền chấm), chú giải 5 nhóm bằng `MauNetTraCuuSvg`, `VongConGiap` tổng quan bên cạnh ở 1366px, khối `GHI_CHU_CAP` và liên kết sang `/xem-tuoi/vo-chong`, `/con-giap`.
- `src/app/(v2)/xem-tuoi/[cap]/page.tsx` — 78 trang cặp `/xem-tuoi/{chi-a}-va-{chi-b}` (`generateStaticParams`, chuyển hướng 308 cho slug đảo chiều về `slugChuan`, 404 cho slug lạ), `DocNhanh`, `VongConGiap` chế độ cặp 2 chi, từng thẻ quan hệ kèm `ThuatNgu` và `TrichNguyenVan` từ `TRICH_BAT_TU` / `NGUON_BAT_TU`, thẻ nhỏ "Cùng phương" cho tam hội, `GHI_CHU_CAP`, nút `/xem-tuoi/vo-chong`, lưới liên kết chéo 11 cặp của từng tuổi và `/con-giap/{slug}`.
- `src/app/(v2)/tu-vi/tu-hoa/page.tsx` (`13.084` byte) — Trang `/tu-vi/tu-hoa`: form GET `?nam=YYYY` (1900–2100, `noindex` khi có tham số, báo lỗi nhẹ hổ phách khi sai năm), `DocNhanh`, bảng 10 can × 4 hóa (`BANG_TU_HOA`) kèm link chính tinh và dấu khác phái, câu phú Toàn thư trong `TrichNguyenVan` (bản dịch 10 vế + giải thích, không in `nguyenVan`), 2 bảng so phái Canh và Nhâm (`SO_PHAI_TU_HOA`, in đậm ô khác Sách Việt), 4 ghi chú `GHI_CHU_TU_HOA` và liên kết `/tu-vi/lap-la-so`, `/tu-vi/sao`, `/phuong-phap/nam-phai-bac-phai`.
- `docs/v2/lenh-antigravity/48-bao-cao.md` — Báo cáo nghiệm thu Lệnh 48.
- `8` ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-48-con-giap-375.png` (`984.935` B) & `ck-48-con-giap-1366.png` (`1.386.330` B)
  - `ck-48-dan-va-ti-375.png` (`843.508` B) & `ck-48-dan-va-ti-1366.png` (`1.185.428` B)
  - `ck-48-thin-va-thin-375.png` (`723.121` B) & `ck-48-thin-va-thin-1366.png` (`1.084.465` B)
  - `ck-48-tu-hoa-1990-375.png` (`964.915` B) & `ck-48-tu-hoa-1990-1366.png` (`1.253.641` B)

### Tệp chỉnh sửa
- `src/components/ck/truc-quan/VongConGiap.tsx` (`25.613` byte) — Thêm 2 prop tùy chọn `chiCap` và `hienNetTongQuan` (tương thích ngược 100% với `/con-giap/[slug]`), tách đường cong các quan hệ trên cùng cặp để không đè nét.
- `src/app/(v2)/xem-tuoi/xem-tuoi.css` (`20.148` byte ≤ `30.720` B) — Nối thêm CSS ma trận 12×12, bộ lọc thẻ dọc và trang cặp (tất cả vùng bấm mới `>= 44px`, không đỏ báo động, có `@media (prefers-reduced-motion: reduce)`).
- `src/app/(v2)/tu-vi/tu-vi.css` (`15.234` byte ≤ `30.720` B) — Nối thêm CSS trang Tứ Hóa và bảng so phái (chuyển thẻ ở `<= 720px`, không cuộn ngang, có `@media (prefers-reduced-motion: reduce)`).

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, `src/middleware.ts`, `src/app/api/**`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, cũng như `/xem-tuoi/vo-chong` và `/xem-tuoi/xong-dat`. Không cài gói, không commit, không `next build`, không bấm Overwrite.

## 2. Kết quả nghiệm thu (mục 48.4)

### 2.1. Kiểm kiểu, unit test và dung lượng CSS
- `tsc --noEmit`: `0` lỗi (`TSC_EXIT=0`).
- `.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/cap-con-giap.test.mjs tests/trang/tu-hoa.test.mjs`: `9/9` bài kiểm tra đạt, `0` lỗi (`TEST_EXIT=0`).
- Dung lượng CSS: `xem-tuoi.css` = `20.148` B (`<= 30 KB`), `tu-vi.css` = `15.234` B (`<= 30 KB`).

### 2.2. Kiểm chữ Hán và toàn bộ URL mới
- `node scripts/kiem-chu-han.mjs http://localhost:3047`: `Đã quét 300 trang; 0 trang có chữ Hán` (`HAN_EXIT=0`).
- Quét bổ sung toàn bộ `84` URL (gồm `/xem-tuoi/con-giap`, `78` trang `/xem-tuoi/[cap]`, `/xem-tuoi/vo-chong`, `/xem-tuoi/xong-dat`, `/tu-vi/tu-hoa`, `/tu-vi/tu-hoa?nam=1990`, `/tu-vi/tu-hoa?nam=1800`): `84/84` trả HTTP `200`, `0` trang có chữ Hán, `0` trang chứa từ cấm (`hóa giải`, `vật phẩm`, `sát khí`, `cải vận`, `đại kỵ`).
- Chuyển hướng và 404: `/xem-tuoi/ti-va-dan` trả HTTP `308` về `/xem-tuoi/dan-va-ti`; `/xem-tuoi/meo-va-cho` trả HTTP `404`.

### 2.3. Kiểm trình duyệt Playwright (`375×812`, `1366×900`, tắt JS `375×812`)
- Tất cả trang kiểm tra đều có `0` lỗi console, `0` `pageerror`, `0` phản hồi lỗi mạng `>= 400`, không cuộn ngang toàn trang (`scrollWidth = 375/375` và `1366/1366`).
- Mọi vùng bấm tương tác mới trong `<main>` đều đạt kích thước `>= 44px`; cỡ chữ SVG thực tế tối thiểu `12,1px` ở `375px` và `12,3px` ở `1366px`.
- Đối chiếu ca mẫu mục 48.4:
  1. `/xem-tuoi/con-giap`: đủ `144` ô; `Dần × Ngọ` là `● Tam hợp` (`hop`), `Tý × Ngọ` là `⇄ Xung` (`xung`), `Sửu × Mùi` là `⇄ Xung+△ Hình` (`xung`), `Dần × Tỵ` là `◇ Hại+△ Hình`, `Dần × Mão` ô trắng (`khong`); bấm `Dần × Tỵ` sang `/xem-tuoi/dan-va-ti`; bấm nút lọc `Dần` lọc còn 1 nhóm `11` thẻ.
  2. `/xem-tuoi/dan-va-ti`: có `2` thẻ quan hệ (`Tương hình`, `Lục hại`), mỗi thẻ có mục `Sách ghi` dịch nghĩa; `/xem-tuoi/thin-va-thin` có `Tự hình`; `/xem-tuoi/ty-va-ty` có dòng không thuộc nhóm hợp, xung, hình, hại nào.
  3. `/xem-tuoi/vo-chong` và `/xem-tuoi/xong-dat`: trả `200`, hiển thị bình thường như cũ.
  4. `/tu-vi/tu-hoa?nam=1990`: đủ `10` dòng; Giáp gồm `Liêm Trinh, Phá Quân, Vũ Khúc, Thái Dương`; `Canh` và `Nhâm` có dấu `Khác phái *`; dòng `Canh` được tô nổi (`data-chon="1"`); bảng so phái Canh hàng iztro ghi Khoa `Thái Âm`, Kỵ `Thiên Đồng`; `meta robots="noindex, follow"`.
  5. Tắt JS ở `375px`: `/xem-tuoi/con-giap` vẫn đọc đủ các nhóm thẻ (`scrollWidth = 375`), `/tu-vi/tu-hoa` submit form GET `?nam=1990` ra đúng dòng Canh (`scrollWidth = 375`).
- Đã mở kiểm tra trực quan toàn bộ 8 ảnh chụp `ck-48-*.png` (lượt đầu phát hiện cỡ chữ nhãn tên con vật/tâm SVG nhỏ dưới 12px và một số link sao quá ngắn dưới 44px; đã sửa và chụp lại đạt).

## 3. Các điểm lệch khỏi lệnh và lý do
- Không có điểm lệch chức năng. Riêng `scripts/kiem-chu-han.mjs` nằm trong vùng cấm `scripts/**` nên giữ nguyên không sửa file này; đã chạy `kiem-chu-han.mjs` trên 300 trang crawl từ trang chủ và chạy thêm bước quét tự động đầy đủ toàn bộ `84` URL mới của Lệnh 48 ở mục 2.2.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung
1. Bật `DOT_DA_DUNG = 7` trong `src/lib/trang/dieu-huong.ts` khi nghiệm thu để hiện `/xem-tuoi/con-giap` và `/tu-vi/tu-hoa` trên menu chính và chân trang.
2. Duyệt và xuất bản các dòng `SeoTrang` đang ở trạng thái `NHAP`: `XT-CAP-IDX`, `XT-CAP`, `TUVI-TUHOA`.

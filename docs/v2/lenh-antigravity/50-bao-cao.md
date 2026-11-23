# Báo cáo Lệnh 50: 10 trang hành tinh (Chiêm tinh)

Ngày thực hiện: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/chiem-tinh/hanh-tinh.css` (`3.737` byte ≤ `30.720` B) — CSS riêng cho 10 trang thiên thể và khối 10 thiên thể trên `/chiem-tinh`, gồm vùng bấm chip/nút `>= 44px`, chữ sáng `#FBF1DA` trên `.ck-nut-son`, ghi đè cỡ chữ vòng 12 cung nhỏ để chữ SVG hiển thị `>= 12px` ở `375px`, lưới 3 thẻ `Nhà / Vượng / Hãm` tự xếp 1 cột dưới `960px` và `@media (prefers-reduced-motion: reduce)`.
- `src/app/(v2)/chiem-tinh/hanh-tinh/[x]/page.tsx` (`12.898` byte) — 10 trang hành tinh (`/chiem-tinh/hanh-tinh/{slug}`, `revalidate = 3600`, `generateStaticParams` từ `HANH_TINH_CHI_TIET`, 404 cho slug lạ), dùng `metaTrang` / `thongTinTrang` theo mẫu `CT-HANHTINH` kèm làm sạch chữ Anh, `DocNhanh`, khối **Hôm nay ở đâu** (`cungHienTai`, `<Vong12CungSvg nho />`, nút `/chiem-tinh/ban-do-sao`), khối **Cung trong sách** và **Sách ghi** (chỉ có ở 7 thiên thể cổ, dùng `<TrichTetrabiblos>` chỉ in `vi` và `Dịch nghĩa: xemboi`, 3 hành tinh ngoài bỏ hẳn hai khối này), chip 9 thiên thể còn lại và `<KhoiNguonVaGioiHan>`.
- `docs/v2/lenh-antigravity/50-bao-cao.md` — Báo cáo nghiệm thu Lệnh 50.
- `4` ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-50-sao-tho-375.png` (`828.197` B) & `ck-50-sao-tho-1366.png` (`1.091.429` B)
  - `ck-50-sao-diem-vuong-375.png` (`671.542` B) & `ck-50-sao-diem-vuong-1366.png` (`985.151` B)

### Tệp chỉnh sửa
- `src/app/(v2)/chiem-tinh/page.tsx` (`12.066` byte) — Nạp `./hanh-tinh.css` và thêm mục `"10 thiên thể trong chiêm tinh"` với 10 chip dẫn tới `/chiem-tinh/hanh-tinh/{slug}`, giữ nguyên các phần còn lại.

### Tệp đã xóa
- Không có. (Không tạo `/chiem-tinh/nha/[n]` theo đúng mục 50.2.)

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, `src/middleware.ts`, `src/app/api/**`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `src/app/(v2)/chiem-tinh/chiem-tinh.css` (`25.605` byte, giữ nguyên). Không cài gói, không commit, không `next build`, không bấm Overwrite.

## 2. Kết quả nghiệm thu (mục 50.3)

### 2.1. Kiểm kiểu, unit test và dung lượng CSS
- `tsc --noEmit -p .`: `0` lỗi (`TSC_EXIT=0`).
- `.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/hanh-tinh.test.mjs`: `4/4` bài kiểm tra đạt, `0` lỗi (`TEST_EXIT=0`).
- Dung lượng CSS: `hanh-tinh.css` = `3.737` B (`<= 30.720` B); `chiem-tinh.css` = `25.605` B (không đổi).

### 2.2. Kiểm chữ Hán, chữ Anh và toàn bộ URL mới
- `node scripts/kiem-chu-han.mjs http://localhost:3047`: `Đã quét 300 trang; 0 trang có chữ Hán` (`HAN_EXIT=0`).
- Quét bổ sung toàn bộ `11` URL (`10` trang `/chiem-tinh/hanh-tinh/[x]` và `/chiem-tinh`): `11/11` trả HTTP `200`, `0` trang có chữ Hán, `0` trang có chữ Anh thừa (`Sun`, `Moon`, `Mercury`, `Venus`, `Mars`, `Jupiter`, `Saturn`, `Uranus`, `Neptune`, `Pluto`, `benefic`, `malefic`, `diurnal`, `nocturnal`, `masculine`, `feminine`), `0` trang có từ cấm.
- Kiểm 404: `/chiem-tinh/hanh-tinh/pluto` trả HTTP `404`.

### 2.3. Kiểm trình duyệt Playwright (`375×812`, `1366×900`, tắt JS `375×812`)
- Toàn bộ trang kiểm tra có `0` lỗi console, `0` `pageerror`, `0` phản hồi lỗi mạng `>= 400`, không cuộn ngang (`scrollWidth = 375/375` và `1366/1366`).
- Vùng bấm các chip và nút mới đạt `>= 44px`; cỡ chữ SVG nhỏ nhất trên 10 trang hành tinh đạt `12,2px` ở cả `375px` và `1366px`.
- Đối chiếu 5 tiêu chí mục 50.3:
  1. `/chiem-tinh/hanh-tinh/sao-tho`: hiển thị đủ `Hung tinh`, `Dương`, `Thuộc ngày`; nhà `Ma Kết`, `Bảo Bình`; vượng `Thiên Bình`; hãm `Bạch Dương`; có câu `"cái lạnh của Sao Thổ được xếp vào ban ngày..."`.
  2. `/chiem-tinh/hanh-tinh/mat-troi`: hiển thị đúng cung hôm nay (24/11/2026: `"Hôm nay Mặt Trời ở cung Nhân Mã"`).
  3. `/chiem-tinh/hanh-tinh/sao-diem-vuong`: chỉ có năm `1930`, ghi chú `GHI_CHU_NGOAI`, vị trí hôm nay; không có khối `"Cung trong sách"` hay `"Sách ghi"`.
  4. `/chiem-tinh/hanh-tinh/pluto`: trả HTTP `404`.
  5. Tắt JS ở `375px` trên `/chiem-tinh/hanh-tinh/sao-tho`: `scrollWidth = 375`, đọc đầy đủ mọi khối.
- Đã mở đọc kiểm tra trực quan cả `4` ảnh `ck-50-*.png`.

## 3. Các điểm lệch khỏi lệnh và lý do
- Không có điểm lệch chức năng. Giữ nguyên `scripts/kiem-chu-han.mjs` trong vùng cấm `scripts/**` và quét thêm toàn bộ `11` URL liên quan ở mục 2.2.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung
1. Duyệt và xuất bản dòng `SeoTrang` `CT-HANHTINH` (`/chiem-tinh/hanh-tinh/{x}`) đang ở trạng thái `NHAP`.
2. Thêm danh mục `/chiem-tinh/hanh-tinh/*` vào `dieu-huong.ts` hoặc `sitemap` (nếu cần liệt kê từng thiên thể khi nâng `DOT_DA_DUNG`).

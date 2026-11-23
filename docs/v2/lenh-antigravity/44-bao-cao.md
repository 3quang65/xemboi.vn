# Báo cáo Lệnh 44: Bát tự lưu niên và tam trụ

Ngày: 24/11/2026.

- **Người làm:** Antigravity viết toàn bộ mã.
- **Người nghiệm thu:** Claude Code. Antigravity hết hạn mức Gemini (lỗi 429) lúc 01:55, ngay ở bước tự kiểm thử cuối, nên Claude Code nghiệm thu thay và ghi báo cáo này.

## Tệp

- **Sửa:**
  - `src/app/(v2)/bat-tu/lap-la-so/page.tsx`;
  - `SoDoQuanHeSvg.tsx` (thêm vị trí 4 cho lưu niên);
  - `src/app/(v2)/bat-tu/page.tsx`;
  - `bat-tu.css` (28.623 B, dưới trần 30 KB).
- **Thêm:** `src/app/(v2)/bat-tu/lap-la-so/KhongRoGioClient.tsx`.
- **Không commit** (editor chỉ định dạng lại, không đổi nội dung):
  - các tệp `xem-ngay`, `lich-am`;
  - `phong-thuy.css`, `tu-vi.css`, `xem-tuoi.css`.

## Nghiệm thu (Claude Code xem trên trình duyệt ở 1366px và 375px)

1. **Ca 1 với `ln=2026`:**
   - cột "Lưu niên 2026" viền đứt, có nhãn Kiếp tài;
   - đúng 2 quan hệ: can hợp Tân–Bính (tháng với lưu niên), tự hình Ngọ–Ngọ (năm với lưu niên);
   - trang có `noindex, follow`.
2. **Ca 1 với `ln=2027`:** Tỷ kiên (cùng can); có tam hội Ngọ–Tỵ–Mùi và lục hợp Ngọ–Mùi.
3. **Tam trụ 01/06/1990 nữ:**
   - ra Canh Ngọ, Tân Tỵ, Đinh Dậu; cột giờ ghi "Chưa rõ giờ";
   - quan hệ chỉ còn "Thiếu Sửu"; có dòng "Đếm 6 chữ";
   - không có hộp báo chưa chắc.
4. **Tam trụ 05/04/1975 nam:** có hộp "Trụ tháng đổi trong ngày sinh", không có hộp trụ năm.
5. **Tam trụ 04/02/2024 nữ, URL kèm `gio=10`:**
   - `khongRoGio` được ưu tiên hơn `gio`;
   - có hộp hổ phách cho cả trụ năm và trụ tháng.
6. **375px:**
   - không cuộn ngang;
   - lưu niên thành hàng riêng phía trên bốn trụ;
   - quan hệ của lưu niên hiện thành chip.
7. **`tsc`:** 0 lỗi.

## Chưa kiểm

- Chưa có ảnh `ck-44-*`.
- Chưa thử với JS bị tắt; form vẫn là GET thường.

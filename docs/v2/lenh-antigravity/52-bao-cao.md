# Báo cáo Lệnh 52: Trang Lục hào

Ngày: 24/11/2026.

Antigravity làm trang, chạy Playwright (ALL_52_CHECKS_PASSED) và chụp 4 ảnh. Sau đó lần chạy của nó dừng lại lúc đang chờ máy dò chữ Hán, nên chưa viết báo cáo. Claude Code tự nghiệm thu lại và viết báo cáo này.

## 1. Tệp

### Tạo mới (Antigravity)
- `src/app/(v2)/kinh-dich/luc-hao/page.tsx` (19.957 B): trang `/kinh-dich/luc-hao`.
- `src/app/(v2)/kinh-dich/luc-hao/GieoLucHaoClient.tsx` (2.843 B): nút gieo 3 đồng xu.
- `src/app/(v2)/kinh-dich/luc-hao.css` (8.728 B, ≤ 30 KB).
- Ảnh trong `docs/v2/bang-chung/`: `ck-52-luc-hao-can-{375,1366}.png`, `ck-52-luc-hao-bien-{375,1366}.png`.

### Sửa
- `src/app/(v2)/kinh-dich/page.tsx`: nạp `luc-hao.css`, thêm thẻ Lục hào.
- `src/app/(v2)/kinh-dich/gieo-que/page.tsx`: khi có kết quả xu, thêm liên kết "An quẻ lục hào" tới `/kinh-dich/luc-hao?xu=…`.

### Claude Code sửa khi nghiệm thu
- `luc-hao/page.tsx`: bỏ câu tự viết "Hào Thế là bản vị quẻ", thay bằng ý của sách: "Theo sách: cách hào Thế hai vị là hào Ứng."

## 2. Nghiệm thu (mục 52.4)

1. **`?xu=777777&ngay=2026-11-24&gio=10:30`:**
   - Thuần Càn, cung Càn (Kim), Bát thuần, có "Lục xung".
   - Hào 6 Phụ mẫu Tuất Thế, hào 3 Phụ mẫu Thìn Ứng, hào 1 Tử tôn Tý.
   - Tháng Kỷ Hợi, ngày Nhâm Dần, nên hào 1 là Huyền Vũ; tuần không Thìn, Tỵ, có nhãn ở hào 3. Đạt.
2. **`?xu=888777`:** Thiên Địa Bĩ, cung Càn, Tam thế, có "Lục hợp". Đạt.
3. **`?xu=987678`:**
   - Thủy Hỏa Ký Tế, cung Khảm, Tam thế (Thế hào 3, Ứng hào 6), biến Trạch Sơn Hàm.
   - Cột hào biến chỉ có ở hào 1 (Quan quỷ Thìn Thổ) và hào 4 (Huynh đệ Hợi Thủy).
   - Lục thân hào biến tính theo cung Khảm của quẻ chính. Đạt.
4. **`?xu=12`:** trả 200 và báo "Cần nhập đúng 6 số 6, 7, 8 hoặc 9 …". Đạt.
5. **Kiểm tra chung:**
   - `tsc --noEmit -p .`: 0 lỗi.
   - Test (`tests/trang`, `tests/r1`, `nap-am`): 233/233 đạt.
   - Màn hình 375px: `scrollWidth` 375 = `clientWidth`, không cuộn ngang; lục thần gộp vào dòng phụ.
   - `node scripts/kiem-chu-han.mjs` (đã thêm `/kinh-dich/luc-hao?xu=987678` và `?xu=777777`): xem mục 3.

## 3. Máy dò chữ Hán

0 trang có chữ Hán.

## 4. Không làm (theo 52.3)

Không làm phục thần, dụng thần theo việc hỏi, vượng suy theo mùa, ứng kỳ. Các mục này đã ghi ở `viec-can-anh.md` mục 27.

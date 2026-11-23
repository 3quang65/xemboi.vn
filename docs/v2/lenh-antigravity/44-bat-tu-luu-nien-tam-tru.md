# Lệnh 44: Bát tự: lưu niên phủ lên lá số, tam trụ khi không rõ giờ

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 43.

**Báo cáo:** ghi vào `docs/v2/lenh-antigravity/44-bao-cao.md` theo mẫu Lệnh 25, kèm ảnh 375px và 1366px.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md`;
- Lệnh 40 và báo cáo của nó;
- mục "Để sau" trong `40-bat-tu-truc-quan.md`;
- `docs/v2/thiet-ke/doi-thu/bat-tu-thi-truong.md`, điểm 7 và 9. Mẫu tham khảo: masterseanchan cho lưu niên, miniwebtool cho tam trụ.

**Ràng buộc:** như Lệnh 40.
- Không sửa `src/lib/**`, `tests/**`;
- không cài gói, không commit, không chạy `next build`;
- CSS mỗi cụm ≤ 30 KB;
- không lời luận.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/bat-tu-luu-nien.ts` (test `tests/trang/bat-tu-luu-nien.test.mjs`)

**`luuNienBatTu(laSo, nam)`** trả `{ nam, canChi, hanhCan, hanhChi, thapThanCan, quanHe[], cau }`.
- `quanHe[]` cùng dạng với `quanHeTru`, nhưng `tru` có thể chứa **4** (vị trí lưu niên).
- Chỉ gồm các quan hệ có lưu niên tham gia.

**`namTrongDaiVan(laSo, thuTu)`** trả 10 năm `{ nam, canChi }` của bước đại vận đó.

**`lapTamTru({ ngay, thang, nam, gioiTinh, namXem? })`** trả `{ laSo, demNguHanh, thieuHanh, quanHe, chuaChac[], cau }`.
- `laSo` lập với 12:00. **Chỉ dùng 3 trụ đầu**; trụ giờ của nó không được hiện.
- `chuaChac[]` là các câu báo trụ năm hoặc tháng đổi trong ngày sinh, và khoảng tuổi khởi vận.

## 44.1. Lưu niên

1. **Chọn năm (link thường, không JS):**
   - trên mỗi thẻ đại vận thêm `<details>` "10 năm";
   - bên trong là 10 nút link `?…&ln=YYYY#luu-nien` (giữ nguyên các tham số lá số), mỗi nút ghi năm và can chi;
   - năm hiện tại có chấm son;
   - `ln` ngoài khoảng 1900–2100 hoặc không phải số thì bỏ qua;
   - trang có `ln` đặt `noindex`.
2. **Khi có `ln`:** ngay dưới hình tứ trụ thêm khối `id="luu-nien"` gồm:
   - một **thẻ cột thứ 5 "Lưu niên {năm}"**:
     - can chi chữ to, tô màu hành, kèm chữ Hán;
     - thập thần của can dạng pill;
     - viền đứt màu son nhạt để phân biệt với 4 trụ gốc;
     - ở ≥ 768px đặt bên phải trụ Năm (thứ tự Giờ · Ngày · Tháng · Năm · Lưu niên); ở 375px đặt thành hàng riêng phía trên hình.
   - **hình cung** cho `quanHe` của lưu niên:
     - mở rộng `SoDoQuanHeSvg` nhận 5 vị trí, hoặc viết một biến thể;
     - cùng 5 kiểu nét như Lệnh 40;
     - cung nối tới cột lưu niên;
     - ở 375px được dùng hàng chip như Lệnh 40.
   - câu `cau` nguyên văn;
   - danh sách `quanHe`, mỗi mục có `moTa` và `<details>` "Sách ghi" (dùng lại mục C của Lệnh 40).
   - link "Bỏ lưu niên" về URL không có `ln`.
3. Không có `ln` thì trang giữ nguyên như Lệnh 40.

## 44.2. Tam trụ khi không rõ giờ

1. **Form:**
   - thêm ô chọn "Không rõ giờ sinh" (`khongRoGio=1`). Khi chọn, ô giờ và phút bị vô hiệu (CSS `:has()` hoặc thuộc tính `disabled` qua JS nhỏ; không JS thì server bỏ qua giờ);
   - dropdown giờ ghi kèm chi cho từng khung, ví dụ "07 giờ (Thìn)".
2. **Kết quả khi `khongRoGio=1`:** dùng `lapTamTru`.
   - **Đọc nhanh:** in `cau` của tam trụ. Có thể dùng `DocNhanh` với 3 thẻ (nhật chủ, tháng sinh, ngũ hành 6 chữ).
   - **Tứ trụ:**
     - cột Giờ là thẻ trống, viền đứt, chữ "Chưa rõ giờ" và link "Thêm giờ sinh" (về form, giữ ngày đã nhập);
     - 3 cột còn lại như Lệnh 40.
   - **`chuaChac`:** mỗi câu là một hộp nền hổ phách nhạt, đặt ngay trên hình tứ trụ.
   - **Ngũ hành:** đếm trên 6 chữ, dòng chú "Đếm 6 chữ (3 can, 3 chi), chưa có trụ giờ".
   - **Quan hệ:** dùng `quanHe` của tam trụ.
   - **Đại vận:** vẫn hiện, kèm câu trong `chuaChac` về khoảng tuổi khởi vận (nếu có).
3. `khongRoGio=1` đi kèm `gio` thì ưu tiên `khongRoGio`.

## 44.3. Nghiệm thu

1. **Ca 1 với `ln=2026`:**
   - cột lưu niên Bính Ngọ, pill "Kiếp tài";
   - đúng 2 quan hệ: can hợp Tân–Bính (trụ tháng–lưu niên) và tự hình Ngọ–Ngọ (trụ năm–lưu niên).
2. **Ca 1 với `ln=2027` (Đinh Mùi):** pill "Tỷ kiên"; 2 quan hệ: tam hội Hỏa (Ngọ năm, Tỵ tháng, Mùi lưu niên, cung nối 3 cột) và lục hợp Ngọ–Mùi.
3. **Tam trụ 01/06/1990 nữ:**
   - 3 trụ Canh Ngọ, Tân Tỵ, Đinh Dậu;
   - quan hệ chỉ còn "Tam hợp thiếu một chữ" (Tỵ–Dậu thiếu Sửu);
   - không có hộp trụ năm/tháng chưa chắc.
4. **Tam trụ 05/04/1975 nam:** có hộp "Trụ tháng đổi trong ngày sinh".
5. **Tam trụ 04/02/2024 nữ:** có hộp cả trụ năm và trụ tháng.
6. **Kiểm tra chung:**
   - 375px không cuộn ngang ngoài dải đại vận; vùng bấm ≥ 44px;
   - tắt JS vẫn dùng được;
   - `tsc` sạch.

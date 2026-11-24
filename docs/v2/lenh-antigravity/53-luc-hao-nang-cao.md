# Lệnh 53: Lục hào nâng cao và thịnh suy Mai hoa

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Báo cáo:** `docs/v2/lenh-antigravity/53-bao-cao.md`, theo mẫu Lệnh 25.
- Kèm ảnh 375px và 1366px của các URL ở mục 53.4.
- **Viết báo cáo ngay khi xong, không chờ máy dò chữ Hán.** Nếu máy dò còn chạy, ghi "máy dò: Claude Code chạy" là được (Lệnh 52 trước đã dừng ở bước chờ này).

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md`;
- trang `src/app/(v2)/kinh-dich/luc-hao/page.tsx` và `mai-hoa-dich-so/page.tsx` (đang chạy, đã xuất bản);
- `docs/v2/doi-chieu/mai-hoa-luc-hao.md`: các trang Việt đang in gì.

**Ràng buộc:**
- **Phạm vi sửa:** như Lệnh 51, chỉ sửa trong `src/app/(v2)/kinh-dich/**`.
- **Chỉ tiếng Việt:** không in `nguyenVan`.
- **Không luận việc:**
  - không "quẻ này tốt / xấu", không lời khuyên;
  - chỉ in nhãn và câu sách có trong thư viện;
  - nhãn bất lợi (Hưu tù, Nhật phá, Suy, kỵ thần) dùng màu hổ phách `#B7791F`, không đỏ báo động.
- **CSS:** thêm vào `luc-hao.css` / `mai-hoa.css` (mỗi tệp ≤ 30 KB).
- **Cấm:** không cài gói, không commit, không `next build`, không bấm Overwrite.

## Dữ liệu (đã có, chỉ đọc)

### `src/lib/trang/luc-hao-nang-cao.ts`

Test: `tests/trang/luc-hao-nang-cao.test.mjs`.

| Tên | Trả gì |
|---|---|
| `haoNangCao(qa, chiThang, chiNgay)` | 6 hào như `qa.hao`, thêm `vuongSuy {muc: 'Vượng'/'Tướng'/'Hưu tù', lamNguyetKien, duKhi}` và `nhatThan[]` (Lâm nhật thần, Ngày sinh, Ngày khắc, Ngày hợp, Ngày xung, Ám động, Nhật phá). |
| `phucThan(qa)` | lục thân vắng trong quẻ: `{viTri, lucThan, chi, hanh, phiThan}`; rỗng nếu đủ năm loại. |
| `VIEC_HOI` | 16 việc hỏi `{ma, ten, dung, trich}` theo sách. |
| `dungThanTheoViec(qa, hao, maViec)` | `{viec, lucThan, cacHao, phuc, haoVuong, nguyen, ky, cuu}`. `cacHao` rỗng thì dụng thần nằm ở phục thần (`phuc`). `haoVuong` là vị trí hào được chọn khi có nhiều hào (null nếu không phân được). `nguyen` / `ky` / `cuu` là `{lucThan, cacHao: [vị trí]}`. |
| `ungKy(hao, chiThang, chiNgay)` | danh sách `{dieuKien, ngay[], thang?[]}`: các mốc sách nêu cho hào đó. |
| `TRICH_NANG_CAO` | 8 câu: `dungThan`, `tuXem`, `nguyenKyCuu`, `chonHaoVuong`, `vuongTuong`, `amDong`, `phucThan`, `ungKy`. Mỗi câu có `nguon` (`WS07` Tăng san bốc Dịch, `WS09` Hỏa châu lâm). |
| `NGUON_HOA_CHAU_LAM` | nguồn cho các câu `WS09`. |

Chi lấy theo chỉ số Tý 0 … Hợi 11. Trang Lục hào đã có `thoiGianAnQue()` trả `chiThang`, `chiNgay`.

### `src/lib/trang/mai-hoa.ts` (phần mới cuối tệp)

- `thinhSuyMaiHoa(pt, chiThang, chiNgay)`: mảng `{vai, quai, thang, ngay}` với giá trị `'Thịnh' | 'Suy' | 'Bình'`.
- `TRICH_MAI_HOA_THINH_SUY`: 3 câu `queKhi`, `thinhSuy`, `thoiLenh`.
- Chi tháng và chi ngày: dùng `thoiGianAnQue` của `luc-hao.ts`, theo ngày dương đã nhập.
- **Với hai ví dụ sách** (chỉ có số âm lịch): chi tháng = `(tháng âm + 1) % 12`, không có ngày.
- **Lập theo số:** dùng ngày giờ hiện tại.

## 53.1. Trang Lục hào: thêm vào kết quả

1. **Bảng an quẻ:** thêm cột "Vượng suy" (tháng) và "Nhật thần".
   - Nhãn nhỏ; "lâm nguyệt kiến" và "dư khí" là chú thích phụ.
   - 375px: gộp hai nhãn vào dòng phụ, không cuộn ngang.
2. **Phục thần:**
   - Khi `phucThan(qa)` có kết quả, ghi dưới hào phi thần: "Phục: {lucThan} {chi} {hanh}".
   - Có ô giải thích bằng `TrichNguyenVan` cho `TRICH_NANG_CAO.phucThan` (nguồn `NGUON_HOA_CHAU_LAM`).
3. **Dụng thần theo việc hỏi:**
   - Form GET thêm `<select name="viec">` (mặc định trống = không chọn), các mục `VIEC_HOI`. Query `?xu=…&viec=tien-cua`.
   - Khi có `viec`:
     - tô hào dụng thần (và hào `haoVuong` nếu có);
     - ghi nhãn nhỏ "Nguyên" / "Kỵ" / "Cừu" cạnh các hào tương ứng;
     - khối "Dụng thần: {lucThan}" nêu các hào, hoặc phục thần nếu vắng;
     - gọi `dungThanTheoViec(qa, hao, viec, chiThang)`; khi `nguyetKien` là true, ghi thêm "Nguyệt kiến mang đúng hành dụng thần" và trích `TRICH_NANG_CAO.nguyetKienDung` (sách lấy nguyệt kiến làm dụng thần, không cần tìm phục); phục thần vẫn in như cũ;
     - có trích `dungThan` hoặc `tuXem` (theo `viec.trich`), `nguyenKyCuu`; có `chonHaoVuong` khi có nhiều hào.
4. **Ứng kỳ:** khi có `viec`, thêm khối `<details>` "Mốc ứng kỳ theo sách". Mỗi hào dụng thần in các dòng `dieuKien → ngày …(tháng …)`, kèm trích `ungKy`.
   - Ghi rõ một câu: "Sách nêu các mốc có thể ứng; trang không chọn mốc nào."
5. **Các bước an quẻ theo sách:** thêm `vuongTuong`, `amDong`.

## 53.2. Trang Mai hoa: thêm thịnh suy

- **Bảng nhỏ "Thịnh suy theo thời lệnh":** 5 quái (Thể, Dụng, Hỗ dưới, Hỗ trên, Biến), cột Tháng và Ngày.
- Dòng ghi chi tháng, chi ngày đang dùng.
- Trích `queKhi`, `thinhSuy`, `thoiLenh` trong `<details>`.
- Ví dụ sách chỉ có cột Tháng.

## 53.3. Không làm

- Thần sát (Lộc, Mã, Quý nhân, Đào hoa), quái thân, can nạp giáp từng hào.
- Luận "thái vượng", "đại tượng cát hung" của chương ứng kỳ.

## 53.4. Nghiệm thu

1. **`/kinh-dich/luc-hao?xu=987678&ngay=2026-11-24&gio=10:30&viec=tien-cua`:**
   - Ký Tế, tháng Hợi:
     - hào 6 Tý: "Vượng";
     - hào 3 Hợi: "Vượng, lâm nguyệt kiến";
     - hào 1 Mão: "Tướng";
     - hào 4 Thân: "Hưu tù".
   - Ngày Nhâm Dần: hào 4 Thân động bị xung, ghi "Ngày xung" (không ghi ám động).
   - Phục thần "Thê tài Ngọ Hỏa" dưới hào 3.
   - Dụng thần Thê tài: vắng, nằm ở phục thần. Nguyên thần Tử tôn hào 1; kỵ thần Huynh đệ hào 3, 6; cừu thần Phụ mẫu hào 4.
2. **`?xu=777777&ngay=2026-11-24&gio=10:30&viec=cha-me`:**
   - hai hào Phụ mẫu (3 Thìn, 6 Tuất);
   - có mốc tuần không cho hào 3 Thìn: ngày Thìn, Tuất.
3. **`?xu=987678&viec=sai-ma`:** bỏ qua việc không hợp lệ, không 500.
4. **`/kinh-dich/mai-hoa-dich-so?vi-du=quan-mai`:**
   - tháng Sửu;
   - Thể Đoài "Bình", Biến Cấn "Thịnh".
5. **`/kinh-dich/mai-hoa-dich-so?ngay=2026-11-24&gio=10:30`:**
   - tháng Hợi, ngày Dần;
   - thể Càn: tháng "Bình", ngày "Bình";
   - dụng Cấn: ngày "Suy" (Dần Mộc khắc Thổ).
6. **Kiểm tra chung:**
   - `tsc --noEmit`: 0 lỗi;
   - test `tests/trang/luc-hao-nang-cao.test.mjs`, `tests/trang/mai-hoa.test.mjs` đạt;
   - ảnh 375px và 1366px của mục 1 và 4.

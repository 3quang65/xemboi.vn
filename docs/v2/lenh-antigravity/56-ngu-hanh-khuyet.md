# Lệnh 56: Trang `/bat-tu/ngu-hanh-khuyet` (ba cách đếm ngũ hành)

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 55.

**Báo cáo:** `docs/v2/lenh-antigravity/56-bao-cao.md`, theo mẫu Lệnh 25.
- Kèm ảnh 375px và 1366px của các URL ở mục 56.4.
- **Viết báo cáo ngay khi xong.**

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md`;
- `docs/v2/doi-chieu/tinh-yeu-goi-bai.md` mục 3.2: các trang Việt viết gì về "mệnh khuyết";
- trang `src/app/(v2)/bat-tu/lap-la-so/page.tsx`: cách đọc query, khối Ngũ hành, `HuyHieuHanh`.

**Thị trường:**
- Bài top phần lớn là trang bán đá, vòng, vật phẩm.
- Họ tính khuyết bằng một cách đếm duy nhất, không dẫn sách, rồi khuyên "bổ khuyết".
- Trang mình đặt ba cách đếm cạnh nhau trên cùng lá số, để người đọc tự thấy "khuyết" đổi theo cách đếm.

**Ràng buộc:**
- **Phạm vi sửa:**
  - tạo `src/app/(v2)/bat-tu/ngu-hanh-khuyet/` (page.tsx, CSS ≤ 30 KB);
  - thêm một liên kết từ khối Ngũ hành của `bat-tu/lap-la-so/page.tsx`: "Vì sao đếm khác nhau ra khuyết khác nhau", trỏ tới trang này và giữ query ngày giờ.
- **Không có:** điểm, phần trăm, "tốt/xấu", "bổ khuyết", màu hợp, đá, vật phẩm, nghề hợp, hướng hợp.
- **Cấm từ:** hóa giải, vật phẩm, sát khí, cải vận.
- **Chỉ tiếng Việt.** Không in `nguyenVan`; chỉ in `dich`, ghi nhãn "Dịch nghĩa: xemboi".
- **Cấm:** không cài gói, không commit, không `next build`.

## Dữ liệu (đã có, chỉ đọc)

Thư viện: `src/lib/trang/ngu-hanh-khuyet.ts`, test `tests/trang/ngu-hanh-khuyet.test.mjs`.

| Tên | Trả gì |
|---|---|
| `baCachDem(lapLaSoBatTu(v))` | `cach1 {dem, thieu}`: 8 chữ; `cach2 {dem, thieu, chiTiet[{tru, chi, tangCan[{can, hanh}]}]}`: 4 can và tàng can; `cach3 {chiThang, hanhVuong, theoMua, trangThai}`: vượng, tướng, hưu, tù, tử theo tháng sinh. |
| `TRICH_VUONG_TUONG` | câu sách về vượng, tướng, hưu, tù, tử (*Tam mệnh thông hội*, quyển 2). In `viTriViet` và `dich`. |
| `TRICH_KHONG_VOI_LUAN` | câu sách dặn không vội luận tốt xấu theo vượng suy. In `viTriViet` và `dich`. |
| `NAM_HANH` | thứ tự hành để vẽ bảng. |

Query giống `/bat-tu/lap-la-so`: `ngay`, `thang`, `nam`, `gio`, `phut`, `gioiTinh`, dùng `kiemTraDauVao` trước khi lập.

- Không có query thì dùng lá số mẫu 10/4/1996, 10 giờ, nam, ghi rõ "Lá số mẫu".
- Không làm chế độ "không rõ giờ".

SEO đã có (NHAP): `BT-KHUYET`, H1 "Ngũ hành khuyết trong bát tự".

## 56.1. Bố cục

1. **H1 và đọc nhanh** (giữ đúng chữ):
   > "Ngũ hành khuyết" là khi đếm các chữ trong lá số bát tự mà không thấy một hành nào đó. Nhưng đếm thế nào thì mỗi nơi một kiểu. Trang này đếm ba cách trên cùng một lá số để anh chị thấy kết quả khác nhau ra sao.

2. **Form:** ngày, tháng, năm, giờ, giới tính (GET); nút "Đếm". Bên dưới là liên kết "Xem đủ lá số" tới `/bat-tu/lap-la-so` với cùng query.

3. **Bốn trụ:** hàng 4 ô Năm, Tháng, Ngày, Giờ, mỗi ô ghi can, chi và huy hiệu hành.

4. **Ba cách đếm, đặt cạnh nhau** (lưới ba cột ở 1366px, xếp dọc ở 375px). Mỗi cột có:
   - tiêu đề;
   - một dòng cách đếm;
   - thanh đếm 5 hành, dùng màu hành có sẵn;
   - dòng "Thiếu: …" hoặc "Không thiếu hành nào".

   | Cột | Tiêu đề | Dòng cách đếm | Thêm |
   |---|---|---|---|
   | 1 | Cách 1: đếm 8 chữ | Đếm 4 can và 4 chi, mỗi chữ một lần. Đây là cách phần lớn các trang đang dùng. | |
   | 2 | Cách 2: thêm tàng can | Đếm 4 can, rồi thay mỗi chi bằng các can ẩn trong chi (tàng can), mỗi can tính một lần, chưa chia nặng nhẹ. | `<details>` "Tàng can từng chi" liệt kê `chiTiet`. |
   | 3 | Cách 3: xét tháng sinh | Sách xét hành nào đang vượng theo tháng sinh, rồi xếp năm hành vào vượng, tướng, hưu, tù, tử. | Không có thanh đếm. Thay bằng 5 thẻ hành ghi trạng thái; nếu `theoMua` thì thêm "Tháng {chi} xếp theo mùa; sách chỉ nêu riêng tháng Sáu (Mùi) cho Thổ". |

5. **Câu so sánh**, sinh từ dữ liệu:
   - **Cách 1 thiếu, cách 2 không thiếu:** "Theo cách 1 lá số thiếu {hành}; thêm tàng can thì {hành} có {n} chữ."
   - **Cả hai không thiếu:** "Hai cách đếm đều đủ năm hành."
   - **Cả hai cùng thiếu:** "Cả hai cách đều không thấy {hành}."

   Cuối khối luôn có thêm câu: "Hành ít hay vắng trong lá số chưa nói lên điều tốt hay xấu."

6. **Sách nói gì:** hai khối trích (`TRICH_VUONG_TUONG`, `TRICH_KHONG_VOI_LUAN`), ghi `viTriViet` và nhãn "Dịch nghĩa: xemboi".

7. **Các trang khác thường viết gì** (giữ đúng chữ):
   > Nhiều trang tính khuyết theo một cách đếm duy nhất, rồi gợi ý màu sắc, đồ vật, đá để "bổ" hành thiếu. Hai câu sách trích ở trên không đếm số chữ: sách xét hành nào vượng, hành nào suy theo tháng sinh, và dặn thấy vượng chưa chắc là tốt, thấy suy chưa chắc là xấu.

8. **Liên kết:** `/bat-tu/lap-la-so`, `/bat-tu`, `/ngu-hanh` (nếu trang tồn tại).

## 56.2. Không làm

- Kết luận "mệnh thiếu gì", "dụng thần", "hỷ thần".
- Trọng số tàng can.
- Nạp âm năm sinh.

## 56.3. Ghi chú kỹ thuật

- Trang là server component, không lưu dữ liệu người dùng.
- Ngày giờ không hợp lệ thì hiện lỗi từ `kiemTraDauVao`, không văng trang.

## 56.4. Nghiệm thu

1. **`/bat-tu/ngu-hanh-khuyet`** (lá số mẫu 10/4/1996, 10 giờ, nam):
   - bốn trụ Bính Tý, Nhâm Thìn, Đinh Sửu, Ất Tỵ;
   - cách 1: Mộc 1, Hỏa 3, Thổ 2, Kim 0, Thủy 2, thiếu Kim;
   - cách 2: Mộc 2, Hỏa 3, Thổ 3, Kim 2, Thủy 4, không thiếu;
   - cách 3: tháng Thìn, Mộc vượng, Hỏa tướng, Thủy hưu, Kim tù, Thổ tử, có dòng "xếp theo mùa";
   - câu so sánh "Theo cách 1 lá số thiếu Kim; thêm tàng can thì Kim có 2 chữ."
2. **`/bat-tu/ngu-hanh-khuyet?ngay=15&thang=8&nam=1990&gio=8&gioiTinh=nu`:**
   - cách 3: tháng Thân, Kim vượng, Thủy tướng, Thổ hưu, Hỏa tù, Mộc tử;
   - hai cách đếm đều đủ năm hành.
3. **`?ngay=31&thang=2&nam=1990&gio=8&gioiTinh=nam`:** hiện lỗi, trang 200.
4. **`/bat-tu/lap-la-so?...`:** có liên kết sang trang này, giữ query.
5. **Kiểm tra chung:**
   - 375px không cuộn ngang;
   - `tsc --noEmit`: 0 lỗi;
   - test `ngu-hanh-khuyet` đạt.

# Ma trận phủ bộ lá số mẫu (cũ 11 + mở rộng 12)

Nguồn: `tuvi-test-cases.json` (TC01–TC11) + `mau/mo-rong.json` (MR01–MR12). Tổng 23 lá: nam 12, nữ 11.

## 1. Cung Mệnh × giới (số lá; nam/nữ)

| Cung Mệnh | Nam | Nữ | Mã lá |
|---|---|---|---|
| Tý | 0 | 3 | TC04, TC09, TC11 |
| Sửu | 1 | 0 | TC10 |
| Dần | 2 | 1 | TC01, TC03, MR06 |
| Mão | 1 | 0 | TC08 |
| Thìn | 1 | 1 | MR03, MR11 |
| Tỵ | 1 | 1 | MR01, MR10 |
| Ngọ | 1 | 1 | MR04, MR07 |
| Mùi | 1 | 1 | TC06, TC07 |
| Thân | 1 | 1 | MR02, MR08 |
| Dậu | 1 | 1 | TC05, MR12 |
| Tuất | 1 | 1 | MR05, MR09 |
| Hợi | 1 | 0 | TC02 |

Phủ đủ 12/12 cung Mệnh: có

## 2. Cục × giới

| Cục | Nam | Nữ | Mã lá |
|---|---|---|---|
| Thủy Nhị Cục | 3 | 2 | TC01, TC02, TC05, MR04, MR09 |
| Mộc Tam Cục | 1 | 3 | TC09, MR01, MR08, MR12 |
| Kim Tứ Cục | 3 | 1 | TC10, MR02, MR06, MR07 |
| Thổ Ngũ Cục | 3 | 3 | TC03, TC07, TC08, TC11, MR05, MR10 |
| Hỏa Lục Cục | 2 | 2 | TC04, TC06, MR03, MR11 |

Phủ đủ 5/5 cục: có

## 3. Cung Mệnh × cục (ô đã phủ ✔, ô còn thiếu ·)

| Cung \ Cục | Thủy Nhị Cục | Mộc Tam Cục | Kim Tứ Cục | Thổ Ngũ Cục | Hỏa Lục Cục |
|---|---|---|---|---|---|
| Tý | · | ✔ | · | ✔ | ✔ |
| Sửu | · | · | ✔ | · | · |
| Dần | ✔ | · | ✔ | ✔ | · |
| Mão | · | · | · | ✔ | · |
| Thìn | · | · | · | · | ✔ |
| Tỵ | · | ✔ | · | ✔ | · |
| Ngọ | ✔ | · | ✔ | · | · |
| Mùi | · | · | · | ✔ | ✔ |
| Thân | · | ✔ | ✔ | · | · |
| Dậu | ✔ | ✔ | · | · | · |
| Tuất | ✔ | · | · | ✔ | · |
| Hợi | ✔ | · | · | · | · |

Đã phủ 22/60 ô. Ô còn thiếu (38): Tý/Thủy Nhị Cục; Tý/Kim Tứ Cục; Sửu/Thủy Nhị Cục; Sửu/Mộc Tam Cục; Sửu/Thổ Ngũ Cục; Sửu/Hỏa Lục Cục; Dần/Mộc Tam Cục; Dần/Hỏa Lục Cục; Mão/Thủy Nhị Cục; Mão/Mộc Tam Cục; Mão/Kim Tứ Cục; Mão/Hỏa Lục Cục; Thìn/Thủy Nhị Cục; Thìn/Mộc Tam Cục; Thìn/Kim Tứ Cục; Thìn/Thổ Ngũ Cục; Tỵ/Thủy Nhị Cục; Tỵ/Kim Tứ Cục; Tỵ/Hỏa Lục Cục; Ngọ/Mộc Tam Cục; Ngọ/Thổ Ngũ Cục; Ngọ/Hỏa Lục Cục; Mùi/Thủy Nhị Cục; Mùi/Mộc Tam Cục; Mùi/Kim Tứ Cục; Thân/Thủy Nhị Cục; Thân/Thổ Ngũ Cục; Thân/Hỏa Lục Cục; Dậu/Kim Tứ Cục; Dậu/Thổ Ngũ Cục; Dậu/Hỏa Lục Cục; Tuất/Mộc Tam Cục; Tuất/Kim Tứ Cục; Tuất/Hỏa Lục Cục; Hợi/Mộc Tam Cục; Hợi/Kim Tứ Cục; Hợi/Thổ Ngũ Cục; Hợi/Hỏa Lục Cục.

Ghi chú: cung Mệnh và cục gắn với can năm nên một số ô có thể không bao giờ xảy ra; chưa kiểm ô nào bất khả (cần tra spec 3.2). Phủ 60 ô cần thêm lá, ngoài phạm vi việc này.

## 4. Giới

- Nam 12, nữ 11, tổng 23. Tiêu chí nghiệm thu (gộp 24 lá, mỗi giới ≥ 12) **chưa đạt**: bộ cũ chỉ có 11 lá (nam 6, nữ 5), lệnh test cố định 12 lá mới → tối đa 23 lá; một giới chỉ đạt 11. Cần quyết: thêm 1 lá (sửa test thành 13) hoặc đổi tiêu chí thành 23 lá.

## 5. Lá đặc biệt

- MR04 (Nam Đinh Sửu 19/06/1997 23:30): tymuon
- MR05 (Nam Canh Dần 15/10/1950 00:30): truoc1968
- MR09 (Nữ Mậu Thân 18/09/1968 20:00): nhuan

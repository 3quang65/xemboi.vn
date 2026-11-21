# Phủ 60 ô Mệnh×Cục — L-a36542

Nguồn: 11 lá `tuvi-test-cases.json` (TC01–TC11) + 42 lá `mau/mo-rong.json` (MR01–12, MR-GB01–10, MR-M01–20) = **53 lá** (ma-tran-phu.md cũ chỉ tính 23 lá, 22/60 ô; nay bộ đã 53 lá).

## 1. Bất khả hay không?

Cục = f(can cung Mệnh, chi cung Mệnh) theo spec 3.2; can cung Mệnh = ngũ hổ độn từ can năm (2.5). Với mỗi chi cung Mệnh, 5 nhóm can năm (Giáp·Kỷ, Ất·Canh, Bính·Tân, Đinh·Nhâm, Mậu·Quý) cho đủ 5 cục khác nhau (mỗi cột chi của bảng 3.2 có đủ Thủy/Mộc/Kim/Thổ/Hỏa). Cung Mệnh lại chỉ phụ thuộc tháng âm + giờ, độc lập với can năm; mỗi nhóm can có cả can dương lẫn âm nên chi năm không ràng buộc.
**Kiểm bằng engine tham chiếu** (`docs/nghien-cuu/tuvi-ref-engine.py`): chạy 11.520 lá (80 năm 1944–2023 × 12 tháng dương × 12 canh giờ, ngày 10, nam) → gặp đủ **60/60 ô** (ít nhất 190 lần/ô). Kết luận: **0 ô bất khả**; mọi ô trống đều là thiếu lá thật.

## 2. Bảng 60 ô (số lá phủ; · = thiếu)

| Mệnh \ Cục | Thủy Nhị Cục | Mộc Tam Cục | Kim Tứ Cục | Thổ Ngũ Cục | Hỏa Lục Cục |
|---|---|---|---|---|---|
| Tý | **· thiếu** | 2 | 2 | 2 | 1 |
| Sửu | 1 | **· thiếu** | 2 | **· thiếu** | 2 |
| Dần | 1 | 2 | 2 | 1 | **· thiếu** |
| Mão | 1 | **· thiếu** | **· thiếu** | 2 | 1 |
| Thìn | 1 | **· thiếu** | **· thiếu** | 1 | 2 |
| Tỵ | **· thiếu** | 1 | **· thiếu** | 2 | **· thiếu** |
| Ngọ | 2 | **· thiếu** | 2 | **· thiếu** | **· thiếu** |
| Mùi | 1 | 1 | **· thiếu** | 3 | 1 |
| Thân | 1 | 2 | 1 | 1 | 1 |
| Dậu | 1 | 2 | **· thiếu** | **· thiếu** | **· thiếu** |
| Tuất | 1 | **· thiếu** | 1 | 1 | 1 |
| Hợi | 1 | **· thiếu** | **· thiếu** | **· thiếu** | **· thiếu** |

**Đã phủ 37/60. Bất khả 0. Thiếu thật 23.**

## 3. Ứng viên lá để lấp 23 ô thiếu

Mỗi dòng: dương lịch dd/mm/yyyy giờ, giới, can chi năm, âm lịch (ngày/tháng/năm). Kết quả Mệnh/Cục lấy từ chính engine tham chiếu. Chọn ưu tiên các lá đồng thời lấp ngày âm chưa có (2, 11, 13, 22, 23), lớp (cục, bù) của Tử Vi chưa có, và tổ hợp chi năm×giới của tiểu hạn chưa có. **Đây là ứng viên, chưa phải kỳ vọng chốt**: trước khi thêm vào `mo-rong.json` phải đối chiếu độc lập (iztro / ansaotuvi) theo `quy-trinh-kiem-chung.md`, và `kiem-mo-rong.py` phải chạy 0 lệch.

| # | Mệnh | Cục | Dương lịch | Giới | Năm | Âm lịch |
|---|---|---|---|---|---|---|
| 1 | Tý | Thủy Nhị Cục | 13/03/1984 06:00 | nam | Giáp Tý | 11/2/1984 |
| 2 | Sửu | Mộc Tam Cục | 08/02/1987 02:00 | nam | Đinh Mão | 11/1/1987 |
| 3 | Sửu | Thổ Ngũ Cục | 08/06/1986 10:00 | nữ | Bính Dần | 2/5/1986 |
| 4 | Dần | Hỏa Lục Cục | 08/03/1984 02:00 | nam | Giáp Tý | 6/2/1984 |
| 5 | Mão | Mộc Tam Cục | 03/03/1986 22:00 | nữ | Bính Dần | 23/1/1986 |
| 6 | Mão | Kim Tứ Cục | 08/02/1987 22:00 | nam | Đinh Mão | 11/1/1987 |
| 7 | Thìn | Mộc Tam Cục | 13/03/1984 22:00 | nam | Giáp Tý | 11/2/1984 |
| 8 | Thìn | Kim Tứ Cục | 13/03/1995 22:00 | nữ | Ất Hợi | 13/2/1995 |
| 9 | Tỵ | Thủy Nhị Cục | 03/03/1986 18:00 | nữ | Bính Dần | 23/1/1986 |
| 10 | Tỵ | Kim Tứ Cục | 08/06/1995 02:00 | nữ | Ất Hợi | 11/5/1995 |
| 11 | Tỵ | Hỏa Lục Cục | 03/02/1987 18:00 | nam | Đinh Mão | 6/1/1987 |
| 12 | Ngọ | Mộc Tam Cục | 13/03/1995 18:00 | nữ | Ất Hợi | 13/2/1995 |
| 13 | Ngọ | Thổ Ngũ Cục | 28/08/1984 06:00 | nam | Giáp Tý | 2/8/1984 |
| 14 | Ngọ | Hỏa Lục Cục | 08/01/1984 14:00 | nữ | Quý Hợi | 6/12/1983 |
| 15 | Mùi | Kim Tứ Cục | 03/03/1986 14:00 | nữ | Bính Dần | 23/1/1986 |
| 16 | Dậu | Kim Tứ Cục | 03/02/1984 10:00 | nam | Giáp Tý | 2/1/1984 |
| 17 | Dậu | Thổ Ngũ Cục | 28/05/1987 18:00 | nam | Đinh Mão | 2/5/1987 |
| 18 | Dậu | Hỏa Lục Cục | 23/02/1986 10:00 | nữ | Bính Dần | 15/1/1986 |
| 19 | Tuất | Mộc Tam Cục | 08/07/1986 18:00 | nữ | Bính Dần | 2/6/1986 |
| 20 | Hợi | Mộc Tam Cục | 03/03/1986 06:00 | nữ | Bính Dần | 23/1/1986 |
| 21 | Hợi | Kim Tứ Cục | 08/02/1987 06:00 | nam | Đinh Mão | 11/1/1987 |
| 22 | Hợi | Thổ Ngũ Cục | 28/07/1995 18:00 | nữ | Ất Hợi | 2/7/1995 |
| 23 | Hợi | Hỏa Lục Cục | 03/02/1984 06:00 | nam | Giáp Tý | 2/1/1984 |

Sau khi lấp 23 ô, còn thiếu: ngày âm 22 và tổ hợp tiểu hạn Mùi×nam → thêm 1–2 lá nữa (nam năm Mùi, âm lịch ngày 22), không nằm trong 23 ô.

## 4. Ghi chú

- Không chi tiền. Tập hợp lá mới nên là việc của Tùng/Minh nếu thêm vào mo-rong.json (cần sha và chạy `kiem-mo-rong.py`); em chưa sửa `mo-rong.json`.
- Trước đó đã có kiểm vét cạn cho vài vòng sao (Tứ hóa 10 can, Địa Không/Kiếp, Thái Tuế/Bác Sĩ, đại vận 5 cục×2 giới) bằng engine, không cần lá; bảng này chỉ nói về lá.

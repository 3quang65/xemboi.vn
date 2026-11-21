# Kiểm chứng điều kiện máy đọc của đoạn mẫu màn chọn gói (L-d29a34)

Ngày 30/10/2026 · Minh. Đối tượng: `src/lib/luan-giai/doan-mau.json` (84 quy tắc: Phu Thê 32, Quan Lộc 52), đối chiếu câu gốc ở `luan-giai-12-cung.md` mục 3.2, 9.2 và cách chọn trong `doan-mau.js`.

Cách kiểm: liệt kê đủ 12 vị trí Tử Vi để biết mỗi tổ hợp chính tinh xuất hiện ở chi nào (vd Thái Dương đơn thủ chỉ ở Tý, Thìn, Tỵ, Ngọ, Tuất, Hợi), rồi so từng điều kiện với câu gốc. Bộ so khớp đòi cung có **đúng** các sao ghi trong điều kiện (không thừa, không thiếu); "chung" thì chỉ cần có sao đó.

## Kết luận chính

1. **6 quy tắc sai hoặc thiếu điều kiện**, đều ở Phu Thê: TDU-01, TDU-02 (ghi chi không thể xảy ra), TD-02, TCO-02, TS-02, PQ-02 (thiếu chi hoặc thiếu tổ hợp mà câu gốc nêu).
2. **38 quy tắc riêng của Quan Lộc không bao giờ được hiển thị.** Thứ tự chọn là Quan Lộc "chung" → Phu Thê → Quan Lộc riêng. Cả 14 chính tinh đều có quy tắc "chung", nên hễ Quan Lộc có chính tinh là quy tắc chung thắng. Quan Lộc vô chính diệu thì bước 3 cũng bị bỏ qua. Kết quả: khách chỉ thấy 14 quy tắc chung của Quan Lộc, hoặc Phu Thê khi Quan Lộc vô chính diệu. Các quy tắc riêng Quan Lộc vẫn đúng để dùng chỗ khác, nhưng trong file này chỉ là dữ liệu thừa.
3. **3 quy tắc bị che, không bao giờ được chọn**: PHU-PQ-03 (bị PHU-TV-02 che), QUAN-TT-03 (bị TV-03 che), QUAN-TS-03 (bị TV-04 che). Ngoài ra một phần điều kiện của THL-02, TS-02, PQ-02, TT-02 (Phu Thê) bị LT-02/VK-02 che.
4. **Lỗi hiển thị**: 6 câu hiện rõ còn dấu `**` thô (TD-04, THL-03, CM-01, CM-03, TL-03, TS-01), vì `ChonGoi.tsx` in chữ thường. Riêng CM-03 còn mất viết hoa chữ đầu. Cần bỏ `**` trong `tachDoanMau`.
5. **28 quy tắc nên loại khỏi màn chào bán** vì câu hiện rõ mở đầu nặng nề ("dễ chia tay", "dễ đến dễ đi", "đổ vỡ", "trắc trở", "chức vị nhỏ", "rắc rối pháp lý"…). Phu Thê: TV-02, LT-02, TD-02, VK-02, TDU-02, TCO-02, TA-02, THL-02, CM-02, TT-02, TL-02, TS-02, PQ-02, PQ-03. Quan Lộc (riêng, đằng nào cũng không hiện): TV-02, LT-03, LT-04, TD-02, TDU-02, TDU-04, TCO-02, TA-02, THL-02, THL-03, CM-02, TT-02, TL-02, PQ-02.

Quy ước "vế sau, không thêm": câu gốc gộp nhiều tổ hợp, mỗi tổ hợp có nhận định riêng. `tachDoanMau` luôn hiện vế đầu, nên nếu thêm điều kiện cho tổ hợp ở vế sau thì khách sẽ thấy nhận định của tổ hợp khác. Vì vậy không thêm, coi là đúng. Riêng câu dạng "A, hoặc B, C: nhận định" (một nhận định áp cho cả nhóm) thì phải đủ điều kiện, nên đánh Sai nếu thiếu.

## Đề xuất sửa (giao Bảo, ~30 phút)

- Sửa 6 điều kiện theo cột "Sửa gì". Thêm test: mọi điều kiện riêng phải là tổ hợp và chi có thể xảy ra (dùng engine an sao).
- Bỏ 28 quy tắc "Loại" khỏi `doan-mau.json` (sửa bộ lọc trong `tools/tao-du-lieu-luan-giai.cjs`, không sửa tay file JSON), bỏ 3 quy tắc bị che.
- Bỏ `**` trong `tachDoanMau`.
- Quyết định sản phẩm: Phu Thê chỉ hiện khi Quan Lộc vô chính diệu. Nếu muốn khách thấy đoạn cụ thể theo lá số hơn (có chi, có tổ hợp), nên đổi thứ tự thành Quan Lộc riêng (đã lọc câu nặng) → Quan Lộc chung → Phu Thê.

## Bảng 84 quy tắc

Điều kiện: `Sao+Sao@chi` = cung có đúng các sao đó, tại các chi ghi; không ghi chi = chi nào cũng được; `(chung)` = cung có sao đó. Cột "Mẫu": Giữ/Loại khi dùng làm đoạn chào bán.

| # | Mã | Điều kiện hiện tại | Đúng/Sai | Sửa gì | Mẫu |
|---|---|---|---|---|---|
| 1 | PHU-TV-01 | Tử Vi@Ngọ \| Thiên Phủ+Tử Vi | Đúng | — | Giữ |
| 2 | PHU-TV-02 | Phá Quân+Tử Vi@Sửu,Mùi | Đúng | Tử Tham, Tử Sát ở vế sau, không thêm (câu hiện rõ chỉ đúng cho Tử Phá) | Loại |
| 3 | PHU-TV-03 | Thiên Tướng+Tử Vi@Thìn,Tuất | Đúng | — | Giữ |
| 4 | PHU-LT-01 | Liêm Trinh+Thiên Phủ@Thìn,Tuất | Đúng | — | Giữ |
| 5 | PHU-LT-02 | Liêm Trinh@Dần,Thân \| Liêm Trinh+Tham Lang \| Liêm Trinh+Thất Sát \| Liêm Trinh+Phá Quân \| Liêm Trinh+Thiên Tướng | Đúng | Trùng điều kiện với THL-02, TS-02, PQ-02, TT-02 (LT-02 đứng trước nên luôn thắng), không hại | Loại |
| 6 | PHU-TD-01 | Thiên Đồng@Mão | Đúng | Đồng Lương, Đồng Nguyệt ở vế sau, không thêm | Giữ |
| 7 | PHU-TD-02 | Thiên Đồng@Dậu,Thìn,Tuất \| Cự Môn+Thiên Đồng@Sửu,Mùi | Sai (thiếu) | Thêm chi Tỵ: điều kiện 1 thành Thiên Đồng@Thìn,Tỵ,Dậu,Tuất (câu gốc có "Tỵ") | Loại |
| 8 | PHU-VK-01 | Vũ Khúc@Thìn,Tuất | Đúng | Vũ Phủ, Vũ Tướng ở vế sau, không thêm | Giữ |
| 9 | PHU-VK-02 | Thất Sát+Vũ Khúc@Mão,Dậu \| Phá Quân+Vũ Khúc@Tỵ,Hợi | Đúng | — | Loại |
| 10 | PHU-VK-03 | Tham Lang+Vũ Khúc@Sửu,Mùi | Đúng | — | Giữ |
| 11 | PHU-TDU-01 | Thái Dương@Mão,Thìn,Tỵ,Ngọ | Sai | Thái Dương đơn thủ không bao giờ ở Mão (Mão là Nhật Lương). Bỏ Mão: Thái Dương@Thìn,Tỵ,Ngọ; thêm {Thái Dương+Thiên Lương, chi Mão} | Giữ |
| 12 | PHU-TDU-02 | Thái Dương@Dậu,Tuất,Hợi,Tý | Sai | Thái Dương đơn thủ không ở Dậu. Bỏ Dậu: Thái Dương@Tuất,Hợi,Tý; thêm {Thái Dương+Thiên Lương, chi Dậu} | Loại |
| 13 | PHU-TCO-01 | Thiên Cơ@Tỵ,Ngọ,Mùi | Đúng | Cơ Lương, Cơ Nguyệt ở vế sau, không thêm | Giữ |
| 14 | PHU-TCO-02 | Thiên Cơ@Hợi | Sai (thiếu) | Câu dạng "A, hoặc B, C: nhận định" nên nhận định áp cho cả nhóm. Sửa Thiên Cơ@Tý,Sửu,Hợi; thêm Thái Âm+Thiên Cơ@Dần; Cự Môn+Thiên Cơ@Mão,Dậu | Loại |
| 15 | PHU-TP-01 | Thiên Phủ@Tỵ,Hợi | Đúng | — | Giữ |
| 16 | PHU-TP-02 | Thiên Phủ@Sửu,Mùi,Mão,Dậu | Đúng | — | Giữ |
| 17 | PHU-TA-01 | Thái Âm@Dậu,Tuất,Hợi | Đúng | — | Giữ |
| 18 | PHU-TA-02 | Thái Âm@Mão,Thìn,Tỵ | Đúng | — | Loại |
| 19 | PHU-THL-01 | Tham Lang@Thìn,Tuất | Đúng | — | Giữ |
| 20 | PHU-THL-02 | Tham Lang@Dần,Thân,Tý,Ngọ \| Liêm Trinh+Tham Lang | Đúng | Liêm Tham bị LT-02 che (LT-02 đứng trước) | Loại |
| 21 | PHU-THL-03 | Tham Lang+Tử Vi@Mão,Dậu | Đúng | — | Giữ |
| 22 | PHU-CM-01 | Cự Môn@Tý,Ngọ,Hợi | Đúng | — | Giữ |
| 23 | PHU-CM-02 | Cự Môn@Thìn,Tuất,Tỵ | Đúng | — | Loại |
| 24 | PHU-CM-03 | Cự Môn+Thiên Cơ | Đúng | Đồng Cự ở vế sau, không thêm (đã có ở TD-02) | Giữ |
| 25 | PHU-TT-02 | Thiên Tướng@Mão,Dậu \| Liêm Trinh+Thiên Tướng@Tý,Ngọ | Đúng | Liêm Tướng bị LT-02 che | Loại |
| 26 | PHU-TL-01 | Thiên Lương@Tý,Ngọ | Đúng | — | Giữ |
| 27 | PHU-TL-02 | Thiên Lương@Tỵ,Hợi | Đúng | — | Loại |
| 28 | PHU-TS-01 | Thất Sát@Dần,Thân | Đúng | — | Giữ |
| 29 | PHU-TS-02 | Liêm Trinh+Thất Sát \| Thất Sát+Vũ Khúc | Sai (thiếu) | Thiếu vế đầu: thêm Thất Sát@Tý,Thìn,Ngọ,Tuất. Liêm Sát bị LT-02 che, Vũ Sát bị VK-02 che (ở Mão, Dậu) | Loại |
| 30 | PHU-PQ-01 | Phá Quân@Tý,Ngọ | Đúng | — | Giữ |
| 31 | PHU-PQ-02 | Phá Quân@Dần,Thân \| Liêm Trinh+Phá Quân \| Phá Quân+Vũ Khúc | Sai (thiếu) | Thêm Thìn, Tuất: Phá Quân@Dần,Thìn,Thân,Tuất. Liêm Phá bị LT-02 che, Vũ Phá bị VK-02 che | Loại |
| 32 | PHU-PQ-03 | Phá Quân+Tử Vi | Đúng nhưng không bao giờ được chọn | Tử Phá chỉ ở Sửu, Mùi, đã khớp TV-02 đứng trước. Bỏ, hoặc gộp câu vào TV-02 | Loại |
| 33 | QUAN-TV-01 | Tử Vi@Ngọ \| Thiên Phủ+Tử Vi | Đúng | — | Giữ |
| 34 | QUAN-TV-02 | Tử Vi@Tý | Đúng | — | Loại |
| 35 | QUAN-TV-03 | Thiên Tướng+Tử Vi | Đúng | Trùng với QUAN-TT-03 (TV-03 thắng) | Giữ |
| 36 | QUAN-TV-04 | Thất Sát+Tử Vi | Đúng | Tử Phá, Tử Tham ở vế sau, không thêm. Trùng QUAN-TS-03 | Giữ |
| 37 | QUAN-TV-05 | Tử Vi (chung) | Đúng | — | Giữ |
| 38 | QUAN-LT-01 | Liêm Trinh@Dần,Thân | Đúng | — | Giữ |
| 39 | QUAN-LT-02 | Liêm Trinh+Thiên Phủ \| Liêm Trinh+Thiên Tướng | Đúng | — | Giữ |
| 40 | QUAN-LT-03 | Liêm Trinh+Tham Lang@Tỵ,Hợi | Đúng | — | Loại |
| 41 | QUAN-LT-04 | Liêm Trinh+Thất Sát | Đúng | Liêm Phá ở vế sau, không thêm | Loại |
| 42 | QUAN-LT-05 | Liêm Trinh (chung) | Đúng | — | Giữ |
| 43 | QUAN-TD-01 | Thiên Đồng@Mão | Đúng | Đồng Lương, Đồng Âm ở vế sau, không thêm | Giữ |
| 44 | QUAN-TD-02 | Thiên Đồng@Dậu | Đúng | Tỵ, Hợi ở vế sau với nhận định khác, không thêm | Loại |
| 45 | QUAN-TD-03 | Thiên Đồng@Thìn,Tuất | Đúng | Đồng Cự ở vế sau, không thêm | Giữ |
| 46 | QUAN-TD-04 | Thiên Đồng (chung) | Đúng | Câu hiện rõ còn dấu ** thô | Giữ |
| 47 | QUAN-VK-01 | Vũ Khúc@Thìn,Tuất | Đúng | — | Giữ |
| 48 | QUAN-VK-03 | Tham Lang+Vũ Khúc | Đúng | Vũ Sát ở vế sau, không thêm | Giữ |
| 49 | QUAN-VK-04 | Vũ Khúc (chung) | Đúng | — | Giữ |
| 50 | QUAN-TDU-02 | Thái Dương@Tuất,Hợi | Đúng | Tý ở vế sau với nhận định khác, không thêm | Loại |
| 51 | QUAN-TDU-04 | Thái Dương+Thái Âm@Sửu,Mùi | Đúng | — | Loại |
| 52 | QUAN-TDU-05 | Thái Dương (chung) | Đúng | — | Giữ |
| 53 | QUAN-TCO-01 | Thiên Cơ@Tỵ,Ngọ,Mùi | Đúng | Còn dấu ** ở phần mờ | Giữ |
| 54 | QUAN-TCO-02 | Thiên Cơ@Hợi,Tý,Sửu | Đúng | — | Loại |
| 55 | QUAN-TCO-03 | Thiên Cơ+Thiên Lương@Thìn,Tuất | Đúng | — | Giữ |
| 56 | QUAN-TCO-04 | Thiên Cơ (chung) | Đúng | — | Giữ |
| 57 | QUAN-TP-01 | Thiên Phủ@Tỵ,Hợi | Đúng | — | Giữ |
| 58 | QUAN-TP-02 | Thiên Phủ@Sửu,Mùi,Mão,Dậu | Đúng | — | Giữ |
| 59 | QUAN-TP-03 | Thiên Phủ (chung) | Đúng | — | Giữ |
| 60 | QUAN-TA-01 | Thái Âm@Dậu,Hợi | Đúng | Tuất ở vế sau, không thêm | Giữ |
| 61 | QUAN-TA-02 | Thái Âm@Thìn,Tỵ | Đúng | — | Loại |
| 62 | QUAN-TA-04 | Thái Âm (chung) | Đúng | — | Giữ |
| 63 | QUAN-THL-01 | Tham Lang@Thìn,Tuất | Đúng | — | Giữ |
| 64 | QUAN-THL-02 | Tham Lang@Tý,Ngọ | Đúng | — | Loại |
| 65 | QUAN-THL-03 | Tham Lang@Dần,Thân | Đúng | Câu hiện rõ còn dấu ** thô | Loại |
| 66 | QUAN-THL-04 | Tham Lang (chung) | Đúng | — | Giữ |
| 67 | QUAN-CM-01 | Cự Môn@Tý,Ngọ | Đúng | Câu hiện rõ còn dấu ** thô | Giữ |
| 68 | QUAN-CM-02 | Cự Môn@Tỵ | Đúng | Thìn, Tuất ở vế sau với nhận định khác, không thêm | Loại |
| 69 | QUAN-CM-03 | Cự Môn (chung) | Đúng | Câu hiện rõ bắt đầu bằng "**làm…": hiện dấu ** thô và không viết hoa được chữ đầu | Giữ |
| 70 | QUAN-TT-01 | Thiên Tướng@Sửu,Mùi | Đúng | — | Giữ |
| 71 | QUAN-TT-02 | Thiên Tướng@Mão,Dậu | Đúng | — | Loại |
| 72 | QUAN-TT-03 | Thiên Tướng+Tử Vi | Đúng nhưng không bao giờ được chọn | Bị QUAN-TV-03 che. Bỏ hoặc gộp | Giữ |
| 73 | QUAN-TT-04 | Thiên Tướng (chung) | Đúng | — | Giữ |
| 74 | QUAN-TL-01 | Thiên Lương@Tý,Ngọ | Đúng | — | Giữ |
| 75 | QUAN-TL-02 | Thiên Lương@Tỵ,Hợi | Đúng | — | Loại |
| 76 | QUAN-TL-03 | Thiên Lương@Sửu,Mùi | Đúng | Câu nhắc QUAN-TDU-03, mã này không có trong dữ liệu. Còn dấu ** | Giữ |
| 77 | QUAN-TL-04 | Thiên Lương (chung) | Đúng | — | Giữ |
| 78 | QUAN-TS-01 | Thất Sát@Dần,Thân | Đúng | Tý, Ngọ ở vế sau, không thêm. Còn dấu ** | Giữ |
| 79 | QUAN-TS-03 | Thất Sát+Tử Vi | Đúng nhưng không bao giờ được chọn | Bị QUAN-TV-04 che. Bỏ hoặc gộp | Giữ |
| 80 | QUAN-TS-04 | Thất Sát (chung) | Đúng | — | Giữ |
| 81 | QUAN-PQ-01 | Phá Quân@Tý,Ngọ | Đúng | Thìn, Tuất ở vế sau, không thêm | Giữ |
| 82 | QUAN-PQ-02 | Phá Quân@Dần,Thân | Đúng | — | Loại |
| 83 | QUAN-PQ-03 | Phá Quân+Tử Vi | Đúng | Liêm Phá, Vũ Phá ở vế sau, không thêm | Giữ |
| 84 | QUAN-PQ-04 | Phá Quân (chung) | Đúng | — | Giữ |

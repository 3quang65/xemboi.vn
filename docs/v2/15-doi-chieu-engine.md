# 15. Đối chiếu engine lịch âm và tử vi với repo ngoài

Ngày 21/11/2026. Script ở `D:\VibeCode\Antigravity\repo-huyen-hoc\doi-chieu\`: `lich-am.mts`, `tu-vi.mts`, `tham-do*.mts`. Kết quả thô nằm trong `ket-qua-*.json` cùng thư mục.

## Kết luận

Không tìm thấy lỗi nào trong engine. Mọi chỗ lệch đều thuộc một trong hai loại:

- khác quy ước giữa các trường phái, và engine đã có sẵn tùy chọn cho đúng quy ước đó;
- ngày sóc rơi sát nửa đêm. Ở những ngày này mình đúng theo DE440 (lịch thiên văn của NASA JPL), trừ một ca lệch 4 giây và không ảnh hưởng chế độ mặc định.

Đã thêm test hồi quy `tests/tuvi-v2/doi-chieu-nhat-nguyet.test.mjs`, gồm 14.735 ca lịch âm và 777 lá số. Kết quả:

- `npm run test:tuvi`: 131/131 đạt (trước là 128).
- Thử cố ý bỏ một quy ước thì test báo lỗi ngay, nên test có tác dụng thật.

## 1. Lịch âm (`src/lib/tuvi-v2/am-lich.ts`)

| So với | Số ca | Khớp | Ghi chú |
|---|---:|---:|---|
| Nhat-Nguyet, dương→âm, UTC+7 | 5.975 | 5.965 | 10 ngày lệch thuộc 4 tháng có sóc sát nửa đêm, xem bảng dưới |
| Nhat-Nguyet, can chi ngày/tháng/năm | 5.975 | 100% | |
| Nhat-Nguyet, âm→dương | 1.752 + 304 + 304 | 100% | Với ngày không tồn tại (30 của tháng thiếu, tháng nhuận không có), mình trả null. Họ cho tràn sang ngày khác. Cách của mình chặt hơn và đúng hơn cho form nhập. |
| Nhat-Nguyet, UTC+8 (lịch Trung Quốc) | 2.532 | 2.531 | Ca lệch: sóc 00:00:15 ngày 8/8/2097 |
| lunar-javascript (6tail), UTC+8, mẫu 25.524 ngày 1900–2100 | 25.524 | 25.479 | 45 ngày lệch đều trước 1929, khi Trung Quốc còn dùng giờ địa phương Bắc Kinh (UTC+7:46). Không liên quan lịch Việt. |

Ngày sóc sát nửa đêm Hà Nội, đối chiếu với bảng 9 trong bài báo của Nhat-Nguyet (tính bằng DE440):

| Tháng | Giờ sóc theo DE440 (Hà Nội) | Mình | Nhat-Nguyet | Đúng |
|---|---|---|---|---|
| 6/1944 | 20/6 23:59:33 | mùng 1 = 20/6 | 21/6 | **mình** |
| 7/1967 | 8/7 00:00:04 | 7/7 (UTC+7 thuần) | 8/7 | họ, lệch 4 giây. Chế độ lịch sử mặc định (UTC+8 trước 1968) cho 8/7, đúng. |
| 5/2054 | 8/5 00:00:28 | 8/5 | (không có ca) | mình |
| 12/2072 | 9/12 23:58:44 hoặc 23:59:46 | 9/12 | 10/12 | **mình** |
| 11/2077 | 15/11 23:59:52 hoặc 16/11 00:01:02 | 15/11 | 16/11 | tùy mô hình ΔT, chưa phân định được |
| 10/2085 | 18/10 23:59:35 hoặc 19/10 00:00:59 | 18/10 | (không có ca) | tùy ΔT |

Trong mẫu, lịch Việt (UTC+7) khác lịch Trung (UTC+8) ở 973 ngày. Vì vậy không được dùng thư viện lịch Trung Quốc thay cho am-lich.ts.

## 2. Tử vi (`src/lib/tuvi-v2`)

### 2.1. So với Nhat-Nguyet: 777 lá số phái Việt

Các phần sau khớp 100% với quy ước mặc định:

- 14 chính tinh;
- cung Mệnh, cung Thân, cục, tên 12 cung;
- Tuần, Triệt;
- vòng Tràng Sinh, vòng Thái Tuế, vòng Bác Sĩ;
- lục cát, lục sát, Lộc Tồn, Thiên Mã, khoảng 60 tạp diệu;
- đại vận;
- lưu niên 2026: tiểu hạn, lưu Thái Tuế, lưu tứ hóa, sao lưu, lưu nguyệt.

Có 4 quy ước khác. Engine đã có sẵn tùy chọn cho cả 4, và bật tùy chọn đó lên thì khớp 100%:

| Mục | Mặc định của mình | Nhat-Nguyet | Khớp khi dùng mặc định | Tùy chọn cho khớp 100% |
|---|---|---|---:|---|
| Thiên Giải | Thân + 2(tháng−1) | Thân + (tháng−1) | 11% | `thienGiai: 'thanThuan'` |
| Thiên Khôi, Thiên Việt | Toàn Thư | "Canh Tân phùng Mã Hổ" | 83% | `khoiViet: 'canhTanMaHo'` |
| Lưu Hà | Đinh Thân, Canh Thìn (sách Trung Quốc) | bảng ansaotuvi | 75% | `luuHa: 'ansaotuvi'` |
| Múi giờ âm lịch trước 1968 | UTC+8 (lịch sử) | UTC+7 | 9 ca lệch ngày âm (1911–1965) | `muiGioLich: 'utc7'` |

Còn hai điểm khác chưa có tùy chọn. Cả hai cần chuyên gia quyết:

- **Độ sáng**, 4 ô khác bảng (mình / họ):
  - Phá Quân ở Thìn, Tuất: Vượng / Đắc;
  - Thiên Lương ở Tý: Đắc / Vượng;
  - Thất Sát ở Hợi: Hãm / Vượng.
- **Hóa Khoa can Nhâm:** mình Thiên Phủ, họ Tả Phù. Cả hai cách đều có trong sách Việt.

Ngoài ra họ viết "Kim Bạc Kim", mình viết "Kim Bạch Kim". Chỉ là chính tả.

### 2.2. So với iztro (紫微斗數, phái Trung Quốc), cùng 777 đầu vào

Để tách lỗi lịch khỏi lỗi an sao, nạp vào iztro đúng ngày âm và giờ của mình.

- **Khớp 100%:** 14 chính tinh, Mệnh, Thân, cục, Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Khôi Việt, Kình Đà, Không Kiếp, Lộc Tồn, Thiên Mã, đại vận, vòng Tràng Sinh, cùng phần lớn tạp diệu.
- **Lệch do quy ước**, đã có tùy chọn:
  - Hỏa Tinh, Linh Tinh (`chieuHoaLinh`);
  - Thiên Trù can Quý (`thienTruQuy`);
  - Tứ hóa can Canh, Nhâm (`tuHoa: 'trungQuoc'`).
- **Trùng tên nhưng khác sao:** Giải Thần, Phi Liêm, Thiên Quý của iztro (解神, 蜚廉, 天貴) tính theo công thức khác sao cùng tên của phái Việt.
- **Độ sáng:** bảng Trung Quốc khác hẳn bảng Việt, như dự kiến.
- **7 ngày âm iztro báo "invalid lunar date":** ngày đó có trong lịch Việt nhưng không có trong lịch Trung, vì hai lịch khác nhau.

## 3. Việc cần anh hoặc chuyên gia quyết

1. **Độ sáng 4 ô và Hóa Khoa can Nhâm.** Gộp vào danh sách hỏi chuyên gia đang chờ (Th.1, LN.MỆNH, độ sáng Văn Xương và Thiên Hư so với tuvi.vn).
2. **Thiên Giải, Khôi Việt, Lưu Hà.** Tuvi.vn và Nhat-Nguyet theo cách nào thì nên lấy cách đó làm mặc định để khách không thấy lá số khác các trang quen. Cần so thêm vài lá với tuvi.vn trước khi đổi.
3. **Múi giờ trước 1968.** Mình giữ UTC+8 (đúng lịch sử, theo Quyết định 121-CP có hiệu lực từ 1/1/1968). Các trang Việt phổ biến có thể dùng UTC+7 cho mọi năm. Khách sinh trước 1968 sẽ thấy lệch 1 ngày ở khoảng 1% số ngày. Nên hiển thị nhãn giải thích như đang làm.

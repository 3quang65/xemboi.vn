# Câu hỏi còn mở về trường phái an sao (cần anh Cường hoặc Minh quyết)

Nguồn: spec mục 10, `doi-chieu.md`, các biến thể trong `tuvi-test-cases.json` (TC04, TC06, TC07) và `mau/mo-rong.json` (MR04, MR09). Mặc định hiện tại đều theo spec; chưa có điểm nào chuyên gia ngoài xác nhận. Chọn 8 điểm ảnh hưởng khách nhiều nhất.

## 1. Giờ Tý muộn 23:00–23:59 (10.1)
- **Trạng thái: ĐÃ GIẢI (10/11/2026)** — kết quả: A (sang ngày sau). Nguồn: `tuvi-an-sao-spec.md` dòng 707 (mục 10.1): ngày can chi đổi từ đầu giờ Tý, đa số sách và iztro làm vậy. Còn lại: chuyên gia xác nhận (`doi-chieu.md` dòng 18) và quyết định hiện cả hai cách ở tùy chọn nâng cao.
- A (mặc định): tính sang ngày hôm sau. B: giữ ngày cũ.
- Khuyến nghị: A. Can chi ngày đổi từ đầu giờ Tý; đa số sách và iztro làm vậy.
- Khách: sinh giờ này bị lệch ngày âm, can chi ngày, có thể cả Tử Vi (MR04 lệch 1 ngày âm, TC06 lệch sao). Nên hiện cả hai cách trong phần "tùy chọn nâng cao".

## 2. Tháng nhuận (10.13)
- **Nhãn: cần nguồn** — spec dòng 719 (mục 10.13) chọn A nhưng chỉ dựa 'sách cụ Thiên Lương và đa số site Việt', chưa có sách đối chiếu độc lập. Lệch nguồn nội bộ: `doi-chieu.md` dòng 16 (TC04) ghi mặc định là chia đôi ở ngày 15 (B), trái với A; cần thống nhất trước khi chốt. Người cấp: chuyên gia Tử Vi phái Việt do Minh chọn.
- A (mặc định): an như tháng chính. B: ngày 16 trở đi tính tháng sau. C: tính hẳn tháng sau.
- Khuyến nghị: A, vì sách cụ Thiên Lương và đa số site Việt dùng; nhưng đây là điểm yếu nhất về nguồn.
- Khách: MR09 (nhuận 7/1968) Mệnh Tuất với A, Hợi với B/C; TC04 Tý với A, Sửu với B/C. Lệch cả cung Mệnh nên toàn lá số khác. Cần hiện cảnh báo cho khách sinh tháng nhuận.

## 3. Múi giờ âm lịch trước 1968 và giờ miền Nam 1960–1975 (10.2, 10.3)
- **Trạng thái: ĐÃ GIẢI (10/11/2026)** — kết quả: A (UTC+8 trước 1968, đổi theo IANA tz). Nguồn: `tuvi-an-sao-spec.md` dòng 708–709 (mục 10.2, 10.3): lịch Việt chỉ chính thức theo UTC+7 từ 1968, giờ khai sinh miền Nam ghi theo UTC+8, đổi theo IANA tz. Còn lại: thêm ô 'nơi sinh' (việc giao diện).
- A (mặc định): UTC+8 trước 01/01/1968, đổi giờ đồng hồ miền Nam về UTC+7. B: UTC+7 mọi năm (engine cũ, nhiều site).
- Khuyến nghị: A, vì người sinh thời đó sống theo lịch UTC+8 (VD Tết Mậu Thân).
- Khách: TC07 Mệnh Mùi/Thổ Ngũ Cục (A) so với Thân/Thủy Nhị Cục (B), tức khác cả cục. Khách lớn tuổi hay đối chiếu với lá cũ nên cần ô "nơi sinh" (miền Nam trước 1975).

## 4. Tứ hóa can Canh và Nhâm (5.8, 10.4)
- **Trạng thái: ĐÃ GIẢI (10/11/2026)** — kết quả: A (bảng Việt). Nguồn: `tuvi-an-sao-spec.md` dòng 710 (mục 10.4, bảng 5.8): thống nhất trong sách Việt (Thái Thứ Lang, Thiên Lương), repo hiện tại đã khớp. Còn lại: soạn câu giải thích trợ giúp cho khách từ app Trung Quốc.
- A (mặc định): Việt, Canh Nhật Vũ Đồng Âm; Nhâm Khoa Thiên Phủ. B: Trung Quốc, Canh Nhật Vũ Âm Đồng; Nhâm Khoa Tả Phù.
- Khuyến nghị: A, vì sách Việt thống nhất.
- Khách: sinh năm Canh hoặc Nhâm có Quyền/Khoa/Kỵ rơi sao khác, đổi luận giải. Khách đem lá từ app Trung Quốc về sẽ thấy lệch; cần câu giải thích trong trợ giúp.

## 5. Hỏa Tinh, Linh Tinh (10.5, 10.6)
- **Nhãn: cần nguồn** — tạm A. Spec dòng 711–712 (mục 10.5, 10.6) khớp câu phú và iztro; repo cũ bị gắn 'sai, cần sửa'. Nhưng chưa có sách Việt in nào nêu số trang, và chưa có chuyên gia ngoài xác nhận (ghi cuối tệp). Người cấp: chuyên gia do Minh chọn.
- A (mặc định): chiều theo âm dương nam nữ, Hỏa Linh ngược nhau, nhóm Tỵ Dậu Sửu khởi Hỏa Mão, Linh Tuất. B: iztro luôn thuận; repo cũ Hỏa Tuất, Linh Mão.
- Khuyến nghị: A, khớp câu phú; repo cũ nhiều khả năng đảo nhầm.
- Khách: lệch hai sát tinh ở nhóm tuổi Tỵ, Dậu, Sửu (một phần ba số người), ảnh hưởng luận cung Mệnh/Tài/Quan. Cần chuyên gia xác nhận trước ra mắt.

## 6. Thiên Khôi/Việt và nhóm sao nhỏ (10.7–10.11)
- **Nhãn: cần nguồn** — Khôi/Việt: A đã có nguồn (câu phú, iztro; spec dòng 714). Nhưng Thiên Trù (spec dòng 717: 'không có nguồn thứ ba') và Thiên Giải (dòng 713: 'không tìm được nguồn sách Việt độc lập') chỉ có 1 nguồn; Phá Toái, Lưu Hà (dòng 715–716) chờ chuyên gia. Giữ A, gắn 'chờ xác nhận'.
- A (mặc định): Khôi Việt theo câu phú Toàn Thư (Giáp Mậu Canh Sửu Mùi…), Phá Toái bảng iztro, Lưu Hà Đinh Thân/Canh Thìn, Thiên Trù Quý ở Tuất, Thiên Giải `Thân + 2(M−1)`. B: cách của repo cũ (đảo Khôi/Việt ở 4 can; Phá Toái, Lưu Hà khác; Thiên Trù Hợi).
- Khuyến nghị: A, nhưng gắn nhãn "chờ xác nhận" với Thiên Giải và Thiên Trù (chỉ có 1 nguồn).
- **Tra nguồn 13/11/2026 (L-a7d3d9): CHƯA CÓ nguồn thứ hai độc lập** cho Thiên Giải và Thiên Trù (2 truy vấn web không ra bảng an sao nào, không có sách gốc). Thiên Giải: vẫn 1 nguồn `Thân + 2(M−1)`. Thiên Trù: spec (Quý ở Tuất) và iztro (Quý ở Hợi) mâu thuẫn, không xác nhận được. Cách lấy: bản in Toàn Thư/Thái Thứ Lang (anh Cường hoặc Minh cấp) hoặc chạy iztro ở trạm may-ai. Chi tiết: `nghien-cuu/nguon-thien-giai-thien-tru_L-a7d3d9.md`.
- Khách: Khôi Việt là quý nhân, hay được nêu trong luận giải; sai sẽ lộ ra khi khách so lá. Sao nhỏ ít được luận nên rủi ro thấp.

## 7. Mệnh chủ (10.14)
- **Nhãn: cần Minh chốt** — đề xuất A (theo chi năm sinh, hiện thêm cách kia). Nguồn: `tuvi-an-sao-spec.md` dòng 720 (mục 10.14) và dòng 682 ('cần chuyên gia xác nhận'). Đây là quyết định sản phẩm: repo engine hiện theo cung Mệnh, cần Minh duyệt rồi giao Bảo sửa.
- A (mặc định): theo chi năm sinh, hiện thêm cách kia. B: theo chi cung Mệnh (engine repo hiện tại).
- Khuyến nghị: A, theo phái Việt; cần Bảo sửa engine repo cho khớp.
- Khách: Mệnh chủ xuất hiện ở đầu lá số, hai cách cho hai sao khác nhau với phần lớn người; khách thấy ngay.

## 8. Độ sáng (10.16, mục 6)
- **Nhãn: cần Minh chốt** — đề xuất A (bảng Việt, spec dòng 722, mục 10.16). Riêng độ sáng Tử Vi Tý/Ngọ (spec dòng 585) và Hóa Lộc/Quyền/Kỵ (dòng 587) là quy ước riêng của ansaotuvi: Minh quyết ẩn hoặc hiện mức nhẹ trước 27/11, song song nhờ chuyên gia duyệt.
- A (mặc định): bảng Việt (miếu, vượng, đắc, bình, hãm) của repo. B: bảng 7 bậc Trung Quốc. Riêng độ sáng Tử Vi ở Tý, Ngọ và của Hóa Lộc, Quyền, Kỵ đang ghi "cần duyệt" ở spec.
- Khuyến nghị: A cho cả lá số; với các ô "cần duyệt" thì hiện ở mức nhẹ, không dùng làm căn cứ kết luận mạnh trong bài trả phí.
- Khách: độ sáng quyết định giọng luận (sao hãm thì luận nặng). Sai ở Tử Vi Tý/Ngọ ảnh hưởng nhiều người; nên nhờ chuyên gia duyệt hai ô này trước ra mắt 27/11.

Chưa có nguồn: ý kiến chuyên gia ngoài cho các điểm 5, 6, 8. Cách lấy: Minh chọn chuyên gia Tử Vi phái Việt rà bản này; anh Cường duyệt nếu cần chi phí.

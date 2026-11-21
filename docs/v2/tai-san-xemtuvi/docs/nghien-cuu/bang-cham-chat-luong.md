# Bảng chấm chất lượng luận giải trả phí (5 tiêu chí)

Người lập: Thư (kiểm duyệt). Ngày 30/10/2026. Việc L-b2e9b9.
Áp dụng: mọi nội dung khách trả tiền (bài luận cung, chuyên đề, đại vận, vận năm, đoạn xem trước của gói). Dưới chuẩn thì không lên site, trả người viết kèm phiếu.
Chuẩn đối chiếu: skill `tuvi-luan-giai`; `docs/nghien-cuu/luan-giai-12-cung.md` (mã CHUNG-, MENH-, PHU-…); `docs/nghien-cuu/luan-giai/dai-van.md` (VAN-); `docs/luan-giai/van-nam/QUY-TAC.md` (NAM-); dữ liệu lá số do engine sinh (`du-lieu.md` hoặc khối "Sao các cung liên quan" trong bản).
Thay cho thang 0–10 bốn tiêu chí ở `kiem-duyet-1.md`, `kiem-duyet-van-nam.md` từ nay.

## 0. Cổng an toàn (kiểm trước, không cho điểm)

Vi phạm một dòng dưới đây thì **trượt ngay**, không chấm tiếp:
- Từ cấm, mê tín: giải hạn, cúng, bùa, vật phẩm, "phạm Thái Tuế", "năm hạn", "mua gói để hóa giải".
- Gây sợ, phán cố định: yểu, chết, tai nạn có ngày giờ, ly hôn chắc chắn, phá sản, chẩn đoán bệnh.
- Lời khuyên tài chính, y tế, pháp lý cụ thể dựa vào sao (vd "tái cơ cấu khoản vay năm nay").
- Thiếu câu ghi nội dung do hệ thống tạo, mang tính tham khảo (quy ước `CLAUDE.md`).
- Lộ thông tin thật của khách (tên, ngày sinh thật trong bài mẫu, số điện thoại…).

## 1. Năm tiêu chí, thang 1–5

Mức 2 và 4 dùng khi bài nằm giữa hai mô tả.

### 1.1. Đúng (đúng sách, đúng lá số, có nguồn)

| Mức | Mô tả |
|---|---|
| 5 | Mọi sao, cung, độ sáng, Tứ hóa, Tuần Triệt khớp dữ liệu engine. Mỗi ý truy được về một mã quy tắc có nguồn. Điều kiện của quy tắc đủ, kể cả vế loại trừ (bản "cần thận trọng" khi đủ điều kiện). Trường phái được gán đúng. Mức thành/phá cách đúng CHUNG-CC-08. |
| 3 | Dữ liệu sao đúng, nhưng có 1–2 chỗ: dùng quy tắc khi điều kiện chưa đủ, bỏ vế loại trừ, ghi độ sáng sai ở câu phụ, gán quy ước sản phẩm cho một trường phái. |
| 1 | Sai vị trí sao hoặc sao mang hóa; kết luận ngược sách; bịa quy tắc không có trong bộ nguồn; dẫn sai trường phái cho tổ hợp không tồn tại ở phái đó. |

- Đạt: "Thất Sát miếu ở Quan Lộc tại Dần cho thấy bạn quyết đoán, chịu được áp lực." (VN01: Quan Lộc Giáp Dần, Thất Sát (M); QUAN-TS-04.)
- Không đạt: "Theo phái Trung Châu, Thái Âm Kỵ gốc gặp Lộc năm…" cho tuổi Canh. Bảng Trung Quốc can Canh không có Thái Âm hóa Kỵ (SPEC 10.4), nên không được dẫn Trung Châu.

### 1.2. Sâu (đủ lớp phân tích)

| Mức | Mô tả |
|---|---|
| 5 | Đi đủ 10 bước của skill: chính tinh + độ sáng, tam phương tứ chính, cách cục kèm điều kiện phá, sao phụ và sát tinh, giáp cung, Tứ hóa (tách lớp gốc, vận, năm), Tuần Triệt; yếu tố trái chiều được cân, có kết luận tổng hợp ghi rõ là tổng hợp. |
| 3 | Có chính tinh và tam phương nhưng bỏ sót 1–2 yếu tố đổi được kết luận (Không Kiếp đồng cung với Lộc, Tuần Triệt ở chính cung, giáp Khoa Quyền). |
| 1 | Ghép câu rời theo từng sao, không có tam phương, không cân yếu tố trái chiều. Khách đọc thấy như trang miễn phí. |

- Đạt: "Phá Quân hóa Lộc ở Tài Bạch cho thấy bạn dám chi để thu, dù Địa Kiếp cùng cung làm thu chi dễ lên xuống." (luận mẫu TC01 trong `luan-giai-12-cung.md`; TAI-PQ-01, CHUNG-SP-02.)
- Không đạt: "Phá Quân mang Hóa Lộc ở Tài Bạch: mở thêm cơ hội và nguồn lực, nên chủ động nắm bắt." (cùng lá, bỏ qua Địa Kiếp (H) đồng cung.)

### 1.3. Cụ thể (gắn lá số người đọc)

| Mức | Mô tả |
|---|---|
| 5 | Mỗi đoạn nêu tên sao, cung, độ sáng của chính lá số và nói nó nghĩa gì cho đúng chuyên đề đang luận (tình cảm thì nói về người đồng hành, không nói chuyện mục tiêu công việc). Đổi lá số khác thì câu không còn đúng. |
| 3 | Có nêu tên sao nhưng câu diễn giải dùng chung cho nhiều cung, nhiều người. |
| 1 | Câu khuôn, chép y hệt giữa các bài, các chuyên đề; bỏ tên sao đi vẫn đọc được. |

- Đạt: "Hóa Kỵ của năm vào Cự Môn ở Phụ Mẫu: giấy tờ và trao đổi với cấp trên là nơi dễ hiểu lầm nhất trong năm." (VN01, NAM-HOA-07.)
- Không đạt: "Hóa Kỵ tại Mệnh là điểm nhạy cảm, dễ băn khoăn hoặc vướng mắc." (không nói Kỵ hóa vào sao nào, nghĩa gì với Tham Lang.)

### 1.4. Áp dụng được (lời khuyên làm được)

| Mức | Mô tả |
|---|---|
| 5 | Mỗi mảng có ít nhất một hành động cụ thể, làm được trong đời thường, gắn với đúng điểm vừa luận, không vượt giới hạn chuyên môn. |
| 3 | Lời khuyên đúng hướng nhưng chung ("nên cẩn trọng", "chủ động nắm bắt"), không biết bắt đầu từ đâu. |
| 1 | Không có lời khuyên, hoặc lời khuyên lạc chuyên đề, hoặc khuyên điều vượt giới hạn (vay, đầu tư, chữa bệnh). |

- Đạt: "Trước mỗi buổi trao đổi quan trọng với cấp trên, gửi đề xuất bằng văn bản và chốt lại kết luận sau buổi họp." (VN01, gắn Cự Môn hóa Kỵ năm.)
- Không đạt: "Nên chọn mục tiêu rõ và tránh dàn trải sức lực." đặt trong bài Phu Thê (mau-2 ban-03), không phải việc người đọc làm được trong chuyện tình cảm.

### 1.5. Giọng (thương hiệu "hiểu mình, định hướng")

| Mức | Mô tả |
|---|---|
| 5 | Nghiêm túc, gần gũi, câu tự nhiên như người hiểu nghề đang nói chuyện; xu hướng ("thường", "dễ") thay vì khẳng định; sao hãm, Kỵ viết trung tính kèm lối ra; thuật ngữ có giải thích ngắn. |
| 3 | Không gây sợ nhưng câu máy, lặp khuôn, nhiều thuật ngữ không giải thích, hoặc có 1 câu khẳng định như hứa kết quả. |
| 1 | Phán định, hứa chắc, giọng thầy bói; hoặc khô như bảng tra. |

- Đạt: "Hỏa Tinh, Linh Tinh hãm trong cung: đôi lúc hai người dễ nóng lời. Khi bất đồng, hẹn một lúc bình tĩnh để nói." (VN01, Tình cảm.)
- Không đạt: "Thái Âm miếu ở đây: năm tài lộc dồi dào." (VN03 vòng 1, hứa kết quả; phải là "thường cho thấy năm có nguồn lợi".)

## 2. Ngưỡng

- **Đạt** khi đồng thời: qua cổng an toàn (mục 0), **tổng ≥ 20/25**, **không tiêu chí nào < 4**.
- **Đúng < 5 là trượt ngay** (sai sách, sai lá số, thiếu nguồn, điều kiện quy tắc chưa đủ), dù tổng cao.
- Bài trượt: trả người viết; chấm lại chỉ các đoạn bị nêu, trừ khi lỗi nằm ở bộ quy tắc (khi đó chấm lại mọi bài dùng quy tắc đó).
- Chấm theo đoạn hay theo bài: bài trả phí chấm cả bài, điểm mỗi tiêu chí lấy theo đoạn yếu nhất; đoạn xem trước của gói chấm riêng từng đoạn.

## 3. Mẫu phiếu chấm

```
Phiếu: <mã bài> · <file> · <đoạn/tiêu đề> · người viết: <tên> · ngày <dd/mm>
Lá số đối chiếu: <file dữ liệu, mục>
Cổng an toàn: Qua / Trượt (<dòng vi phạm>)
```

| Tiêu chí | Điểm (1–5) | Trích dẫn lỗi (vị trí + câu) | Sửa gì |
|---|---|---|---|
| Đúng | | | |
| Sâu | | | |
| Cụ thể | | | |
| Áp dụng được | | | |
| Giọng | | | |
| **Tổng** | **/25** | Kết luận: **Đạt / Trượt** (lý do theo mục 2) | |

## 4. Ba phiếu chấm thử

### Phiếu 1: VN01, Vận năm 2027 (cả bài)

`docs/luan-giai/van-nam/VN01.md` · người viết: Hạnh · đối chiếu `docs/luan-giai/van-nam/du-lieu.md` mục VN01. Cổng an toàn: **Qua**.
Đã đối chiếu khớp: năm thứ 9 của vận Phu Thê 22–31, Tử Phủ (M) có Tuần, Hỏa Linh (H); Lưu Thái Tuế và Kình Dương năm ở Mùi; tiểu hạn Hợi Cự Môn (Đ) nhận Kỵ năm, L. Thiên Khôi; Tứ hóa gốc Mậu và năm Đinh; Lộc Tồn năm ở Ngọ gặp Địa Không (H); 12 tháng Đẩu Quân.

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 4 | (a) Tổng quan, đoạn tam phương tiểu hạn + Sự nghiệp, Gợi ý: "theo Toàn Thư, đây là năm thuận cho học thêm…", "đây là năm nên đăng ký". NAM-TH-04 đòi Xương Khúc **tại** cung tiểu hạn hoặc Thái Tuế; ở đây cả hai ở Tỵ (xung chiếu), Văn Xương hãm gặp L. Đà La (VAN-SP-06). (b) Ghi chú trường phái: "Xemtuvi.vn luận năm theo phái Việt: đọc cả cung Lưu Thái Tuế (trọng điểm năm)…" gán quy ước sản phẩm cho phái Việt (NAM-TRANH-01). (c) Bảng tháng T6: "có Đà La và Địa Kiếp hãm", dữ liệu ghi Đà La (Đ), chỉ Địa Kiếp (H). | (a) Hạ thành "có yếu tố thuận cho học thêm, nhưng sao văn hãm và ở cung xung chiếu nên cần chuẩn bị kỹ"; gợi ý thành "nếu đang cân nhắc chứng chỉ, có thể lên kế hoạch từ đầu năm". (b) "Xemtuvi.vn đọc cả hai cung…; an sao và Tứ hóa theo phái Việt". (c) "có Đà La và Địa Kiếp (hãm)". (a), (b) là lỗi 3 và 8 của phiếu vòng 1, chưa sửa. |
| Sâu | 4 | Tài chính: không nhắc Kình Dương (H) gốc cùng ở Tài Bạch Ngọ với L. Lộc Tồn, Địa Không. Bối cảnh 10 năm gộp VAN-CT-TV-02 và TP-02 thành một câu nén. | Thêm một vế: "Kình Dương gốc cùng cung nên có lúc phải cạnh tranh mới giữ được phần lợi". |
| Cụ thể | 5 | Mỗi đoạn gắn sao, cung, độ sáng của lá này; hai lớp Tứ hóa ở Tử Tức đọc tách đúng. | — |
| Áp dụng được | 5 | Gợi ý hành động cụ thể ở cả 4 mảng và 12 tháng (đề xuất bằng văn bản, phương án B, lịch nghỉ cố định). | — |
| Giọng | 5 | Giọng xu hướng, Kỵ và Hỏa Linh viết trung tính kèm lối ra; "năm thuận chứ chưa phải năm định" đúng tinh thần. | — |
| **Tổng** | **23/25** | **Trượt** vì Đúng = 4 (< 5). Sửa 3 chỗ ở dòng Đúng là đạt. | |

### Phiếu 1b: VN01 chấm lại vòng 2

`docs/luan-giai/van-nam/VN01.md` (sau 859159b, 5b0ec85) · người viết: Hạnh · ngày 30/10 · việc L-65158e · đối chiếu `docs/luan-giai/van-nam/du-lieu.md` mục VN01. Cổng an toàn: **Qua** (không có từ cấm, có câu "do hệ thống tạo… tham khảo", ngày sinh ghi giả lập).
Kiểm 3 lỗi Đúng của Phiếu 1 và vế Sâu:
- (a) NAM-TH-04: **đã sửa**. Bài ghi Văn Xương (hãm) gốc và Văn Khúc của năm ở Tật Ách (Tỵ), cung đối diện tiểu hạn, đi cùng L. Đà La; "chưa phải năm thi cử thuận theo sách"; điểm thuận chuyển sang Hóa Khoa năm ở Thiên Cơ (Mùi, cung Thái Tuế), NAM-HOA-06. Khớp dữ liệu. Gợi ý Sự nghiệp đổi thành "lên kế hoạch từ đầu năm và chuẩn bị hồ sơ kỹ".
- (b) Ghi chú trường phái: **đã sửa**, đúng mẫu câu NAM-TRANH-01 (quy ước xemtuvi.vn; TB, KL lấy tiểu hạn làm cung năm chính); thêm NAM-TRANH-04 (Đẩu Quân theo TT, một số sách Việt khởi tháng từ tiểu hạn).
- (c) T6: **đã sửa**, "Đà La và Địa Kiếp (hãm)"; dữ liệu Thiên Di Thìn: Đà La (Đ), Địa Kiếp (H).
- Tài chính: **đã thêm** Kình Dương (hãm) gốc ở Tài Bạch Ngọ (dữ liệu: Kình Dương (H), Địa Không (H), L. Lộc Tồn), dẫn TAI-SP-05 nhánh hãm. Bối cảnh 10 năm tách VAN-CT-TV-02 (Thất Sát xung từ Dần; Đà La, Địa Kiếp ở Thiên Di Thìn, đúng tam hợp của Thân) và VAN-CT-TP-02 (Tuần tại cung). Khớp dữ liệu.

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 5 | Không còn lỗi. Một điểm ở bộ quy tắc, không tính vào bài: T11 "Văn Xương, Thiên Việt của năm (cung không có Kình, Đà, Kỵ) thường thuận học hỏi" đúng câu chữ NAM-LUU-04, nhưng Huynh Đệ Dậu có Văn Khúc (H) gốc cùng cung và Dậu là vị trí hãm của Xương Khúc (SPEC bảng độ sáng); vế loại trừ NAM-LUU-04 hiện chỉ xét "Văn Xương gốc hãm", chưa xét Văn Khúc gốc hãm hay độ sáng của sao lưu (VAN-SP-06 nói "Xương Khúc hãm"). | Đức: chốt NAM-LUU-04 có thêm vế "Xương hoặc Khúc hãm cùng cung" không; nếu có, Hạnh thêm vào T11 một vế "Văn Khúc gốc hãm cùng cung nên giấy tờ vẫn cần rà". Không chặn bản này. |
| Sâu | 5 | Đã bù Kình Dương ở Tài chính và tách hai quy tắc vận ở bối cảnh. Đủ lớp: chính tinh + độ sáng, tam phương, sát tinh, Tứ hóa tách gốc/năm, Tuần Triệt, kết luận ghi "nhận xét tổng hợp". | — |
| Cụ thể | 5 | Như vòng 1; vế mới đều gắn sao, cung, độ sáng của lá này. | — |
| Áp dụng được | 5 | Như vòng 1; Tài chính thêm "đi chậm và chọn thương vụ mình hiểu rõ" (lời khuyên chung, không phải lời khuyên tài chính cụ thể). | — |
| Giọng | 5 | Giọng xu hướng giữ nguyên; vế Kình Dương viết trung tính kèm lối ra. | — |
| **Tổng** | **25/25** | **Đạt**: qua cổng an toàn, tổng ≥ 20, không tiêu chí < 4, Đúng = 5. Được lên site trả phí. | |

### Phiếu 2: mau-2 bản 01, đoạn "Tứ hóa"

`docs/luan-giai/mau-2/ban-01.md` · tiêu đề `### Tứ hóa` (3 gạch đầu dòng) · bộ ghép tự động · đối chiếu khối "Sao các cung liên quan" và bảng 12 cung trong chính file (nữ, Quý Sửu, Mệnh Dần Tham Lang (Đ) hóa Kỵ, Tuần). Cổng an toàn: **Qua**.
Đã đối chiếu khớp: Tứ hóa Quý (Phá Quân Lộc ở Tài Bạch Tuất, Cự Môn Quyền ở Phụ Mẫu, Thái Âm Khoa ở Huynh Đệ, Tham Lang Kỵ ở Mệnh); tam phương Mệnh Dần là Ngọ, Tuất, Thân.

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 3 | Gạch 2: "Phá Quân mang Hóa Lộc ở Tài Bạch…: mở thêm cơ hội và nguồn lực cho bản thân, nên chủ động nắm bắt." Tài Bạch có Địa Kiếp (H) đồng cung với Hóa Lộc; MENH-HOA-01 và TAI-CC-08 ghi Lộc gặp Không Kiếp thì dễ hao tán. Bài chọn bản tốt khi điều kiện bản thận trọng đã đủ (dạng lỗi lặp lần ba, sau DV09 và VN02 lỗi 2). Ngoài đoạn: cùng file ghi tác giả Tân Biên là "Vân Đằng Thái **Thúc**" (2 chỗ, mã ML-S09-TOT, ML-TT-TUẦN), đúng là Vân Đằng Thái Thứ Lang (SPEC mục 13). | Viết hai mặt như luận mẫu TC01: "dám chi để thu, dù Địa Kiếp cùng cung làm thu chi dễ lên xuống" (TAI-PQ-01, CHUNG-SP-02). Bộ ghép (quy-tac-khung) thêm vế loại trừ Không Kiếp cho mọi đoạn Hóa Lộc. Sửa tên tác giả ở nguồn quy tắc ML-. |
| Sâu | 2 | Không xét giáp Khoa Quyền: Mệnh Dần kẹp giữa Hóa Khoa (Sửu) và Hóa Quyền (Mão) là thế giáp cát (CHUNG-PP-09), luận mẫu TC01 có nêu. Không nói Tham Lang hóa Kỵ gặp Hỏa Tinh, Tuần cùng cung. | Thêm gạch giáp Khoa Quyền; gộp Kỵ với Tham Lang và Tuần thành một ý. |
| Cụ thể | 2 | Gạch 1: "Hóa Kỵ tại Mệnh là điểm nhạy cảm, dễ băn khoăn hoặc vướng mắc" không nêu Kỵ hóa vào Tham Lang, đúng cho mọi Mệnh có Kỵ. Gạch 2: câu khuôn "ảnh hưởng đến tính cách và hướng đi của bạn". | Dùng MENH-HOA-04: Tham Lang hóa Kỵ thì mong muốn nhiều, hay tự đặt kỳ vọng cao; Toàn Thư khuyên "làm việc chỉ cầu bảy phần". |
| Áp dụng được | 2 | "chuẩn bị kỹ và giao tiếp rõ ràng", "chủ động nắm bắt", "giữ nhịp đều, dự phòng" đều chung, không nói làm gì. | Một hành động gắn đúng điểm: vd "chọn một mục tiêu chính mỗi năm, đặt mức đủ tốt thay vì hoàn hảo". |
| Giọng | 3 | Không gây sợ, nhưng câu máy ghép, gạch 3 dài 50 chữ với bốn chữ "nên/giữ/dự phòng/chủ động" liền nhau. | Tách câu, mỗi câu một ý. |
| **Tổng** | **12/25** | **Trượt** (Đúng 3 < 5; Sâu, Cụ thể, Áp dụng < 4). Tiêu chí thấp nhất: Sâu, Cụ thể, Áp dụng (2). | |

### Phiếu 3: mau-2 bản 03, đoạn "Cách cục"

`docs/luan-giai/mau-2/ban-03.md` · tiêu đề `### Cách cục` (3 gạch đầu dòng) · chuyên đề Phu Thê · bộ ghép tự động · đối chiếu khối "Sao các cung liên quan" trong file (nam, Ất Hợi, Phu Thê Tý: Tham Lang (H), Hỏa Tinh (H), Đào Hoa, Thiên Không; tam hợp Thìn Thất Sát (H) + Kình Dương (Đ), Thân Phá Quân (H) + Địa Kiếp (Đ) có Tuần; xung Ngọ Tử Vi (M) có Triệt). Cổng an toàn: **Qua**.

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 2 | Gạch 1 và 3: "Thế Sát Phá Tham… (thành cách nhưng có khuyết)", "Thế Tham Đào… (thành cách nhưng có khuyết)". Theo CHUNG-CC-08, Hỏa Tinh **hãm tọa thủ ngay cung chính** là mức 3 (phá cách); tổng điểm phá cũng đủ 4 (Hỏa tọa 2 + Kình 1 + Kiếp 1). Phá cách thì không được gọi tên cách, chỉ nói "có dáng dấp của…". Ngoài ra "Tham Đào" không có quy tắc nào trong bộ nghiên cứu `luan-giai-12-cung.md` (chỉ có trong `quy-tac-khung.json`), tức là đoạn chưa truy được nguồn. | Hạ cả hai xuống mức 3: "có dáng dấp của thế Sát Phá Tham, cần nỗ lực nhiều hơn". Bỏ gạch Tham Đào cho tới khi Đức lập quy tắc có nguồn. Bảo sửa bộ tính mức cách trong bộ ghép (yếu tố hãm tọa thủ phải ra mức 3). |
| Sâu | 2 | Ba chính tinh tạo cách đều hãm (Tham, Sát, Phá) nhưng không nêu. Không xét Triệt ở Quan Lộc làm Tử Vi miếu xung chiếu yếu đi trong phần cách cục. | Nêu một câu: cả ba sao chủ cách đều hãm nên nhịp biến động thiên về thử thách; Tử Vi miếu xung chiếu là điểm tựa nhưng bị Triệt nên đến chậm. |
| Cụ thể | 1 | Gạch 1 và 2 **chép y hệt** đoạn Cách cục của bản 01 (Mệnh, người khác, chuyên đề khác), không một chữ nói về người đồng hành. | Viết theo chuyên đề Phu Thê: nói về nhịp quan hệ, cách hai người gắn bó (PHU-THL-02: nên đặt nền tin cậy và cam kết rõ). |
| Áp dụng được | 2 | "nên chọn mục tiêu rõ và tránh dàn trải sức lực", "chọn một mục tiêu chính" là lời khuyên công việc, đặt sai chuyên đề tình cảm. | Gợi ý cho quan hệ: vd "trước khi gắn bó lâu dài, cùng nói rõ điều mỗi người cần; khi nóng, hẹn lúc khác nói". |
| Giọng | 3 | Không gây sợ, nhưng nhiều thuật ngữ không giải thích ("hội chiếu", "sát tinh", "thế"), câu máy, ba gạch cùng một khuôn. | Giải thích ngắn thuật ngữ lần đầu xuất hiện; viết câu tự nhiên. |
| **Tổng** | **10/25** | **Trượt** (Đúng 2 < 5; 4 tiêu chí < 4). Tiêu chí thấp nhất: Cụ thể (1). | |

### Phiếu 2b: mau-2 bản 01, đoạn "Tứ hóa", chấm lại

`docs/luan-giai/mau-2/ban-01.md` (sau 4b66536, c3ac597, 1a97321, 8f578e4) · bộ ghép tự động (Bảo) · ngày 30/10 · việc T-a4504a · đối chiếu khối "Sao các cung liên quan" trong file. Cổng an toàn: **Qua**.
Kết quả kiểm: `git diff 78e185c 8f578e4` cho thấy đoạn Tứ hóa **không đổi một chữ**; bốn commit chỉ sửa Cách cục, tên tác giả, câu đuôi độ sáng. Tên tác giả Tân Biên trong file đã đúng (Vân Đằng Thái Thứ Lang, ML-S09-TOT, ML-TT-TUẦN).

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 3 | Gạch 2 vẫn: "Phá Quân mang Hóa Lộc ở Tài Bạch…: mở thêm cơ hội và nguồn lực cho bản thân, nên chủ động nắm bắt." Tài Bạch có Địa Kiếp (H) đồng cung với Hóa Lộc; MENH-HOA-01, TAI-CC-08: Lộc gặp Không Kiếp thì dễ hao tán. Thiếu vế loại trừ (lần thứ tư). | Bộ ghép thêm vế loại trừ Không Kiếp cho mọi đoạn Hóa Lộc (`quy-tac-khung.json`, KHUNG-*-HOA-Lộc-*); lời theo TAI-PQ-01, CHUNG-SP-02: "dám chi để thu, dù Địa Kiếp cùng cung làm thu chi dễ lên xuống". |
| Sâu | 2 | Vẫn không xét giáp Khoa (Sửu) – Quyền (Mão) kẹp Mệnh Dần (CHUNG-PP-09, CHUNG-CC-10: Mệnh có Kỵ thì giáp cát giảm). Kỵ không gộp với Tham Lang, Hỏa Tinh, Tuần. | Thêm đoạn giáp Khoa Quyền theo CC-10; gộp Kỵ + Tham Lang + Tuần thành một ý (CHUNG-TUAN-06). |
| Cụ thể | 2 | Gạch 1 "Hóa Kỵ tại Mệnh là điểm nhạy cảm, dễ băn khoăn hoặc vướng mắc" không nói Kỵ hóa vào Tham Lang; gạch 2 vẫn câu khuôn "ảnh hưởng đến tính cách và hướng đi của bạn". Câu này chỉ xuất hiện ở bài Mệnh nên test đoạn trùng (chỉ so giữa chuyên đề) không bắt được. | Dùng MENH-HOA-04 + CHUNG-HOA-THL-01: Tham Lang hóa Kỵ thì mong muốn nhiều, kỳ vọng cao; "làm việc chỉ cầu bảy phần". |
| Áp dụng được | 2 | "chuẩn bị kỹ và giao tiếp rõ ràng", "chủ động nắm bắt", "giữ nhịp đều, dự phòng" vẫn chung. | Một hành động gắn đúng điểm, vd "đặt mức đủ tốt thay vì hoàn hảo cho mục tiêu chính của năm". |
| Giọng | 3 | Gạch 3 vẫn một câu ~50 chữ, bốn động từ khuyên liền nhau. | Tách câu, mỗi câu một ý. |
| **Tổng** | **12/25** | **Trượt** (Đúng 3 < 5; Sâu, Cụ thể, Áp dụng < 4). Không đổi so với Phiếu 2: lỗi nằm ở khối Tứ hóa của bộ ghép, chưa nằm trong phạm vi bốn commit. | |

### Phiếu 3b: mau-2 bản 03, đoạn "Cách cục", chấm lại

`docs/luan-giai/mau-2/ban-03.md` (sau 4b66536, c3ac597, 1a97321, 8f578e4) · chuyên đề Phu Thê · bộ ghép tự động (Bảo) · ngày 30/10 · việc T-a4504a · đối chiếu khối "Sao các cung liên quan" trong file. Cổng an toàn: **Qua**.
Đã sửa so với Phiếu 3: Sát Phá Tham hạ xuống mức 3, chỉ nói "có dáng dấp của…" (đúng CC-08: Hỏa Tinh (H) tọa thủ Phu Thê); gạch Tham Đào đã bỏ; gạch 1 có thêm một câu theo chuyên đề tình cảm.

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 4 | (a) Gạch 2 nêu lý do phá cách là "yếu tố hung ở tứ chính nặng", nguồn liệt kê Kình Dương + Địa Kiếp là yếu tố phá. Ở lá này Kình Dương (Đ) Thìn, Địa Kiếp (Đ) Thân đều đắc địa; CHUNG-SP-03, CHUNG-TP-06: sát tinh đắc địa hội bộ Sát Phá Tham là trợ lực. Lý do đúng của mức 3 là Hỏa Tinh **hãm tọa thủ** Phu Thê (CC-08 vế 1). (b) Gạch 1 nói "Tham Lang chưa đủ sáng" nhưng không nói Hỏa Tinh cũng hãm, vẫn luận "năng lượng nhanh và nóng" như Hỏa đắc (CHUNG-CC-09: Tham hãm thì chỉ luận "Tham Lang gặp Hỏa Tinh"). | (a) Bộ tính mức cách: không cộng điểm phá cho sát tinh đắc địa khi cách là Sát Phá Tham (SP-03); câu lý do nêu đúng yếu tố quyết định mức ("Hỏa Tinh hãm ngay cung này"). (b) Câu Hỏa Tham ghi rõ cả hai sao hãm. Cần Đức xác nhận cách đọc CC-08 so với SP-03 (CC-08 chưa phân biệt độ sáng sát tinh). |
| Sâu | 2 | Vẫn không nêu ba sao chủ cách đều hãm (Tham Lang Tý, Thất Sát Thìn, Phá Quân Thân); không xét Tử Vi (M) hóa Khoa xung chiếu bị Triệt trong phần cách cục. | Như Phiếu 3: một câu "ba sao chủ cách đều hãm nên nhịp biến động thiên về thử thách; Tử Vi miếu hóa Khoa ở cung đối là điểm tựa nhưng bị Triệt nên đến chậm". |
| Cụ thể | 2 | Gạch 2 **chép y hệt** ở 7/10 bản (ban-01, 03, 04, 07, 08, 09, 10), chỉ khác tiền tố "Với Mệnh:" / "Với Phu Thê:", không một chữ về người đồng hành. Câu đầu gạch 1 cũng y hệt ban-01. Test `luan-giai-cach-cuc-cc08` "đoạn trùng = 0" qua được vì tiền tố làm câu khác chuỗi và test chỉ so trong cùng một lá số. Có tiến bộ: câu cuối gạch 1 nói về quan hệ. | Câu Sát Phá Tham viết theo chuyên đề (PHU-THL-02: dễ đến dễ đi, nhiều cảm xúc mạnh, nên đặt nền tin cậy, cam kết rõ). Test so câu sau khi bỏ tiền tố "Với <cung>:" và so giữa các lá số. |
| Áp dụng được | 3 | Có một hành động đúng chuyên đề ("trước khi gắn bó lâu dài, hãy cùng nói rõ điều mỗi người cần"), nhưng cùng gạch vẫn còn "chọn một mục tiêu chính" (lời khuyên công việc); gạch 2 "cần nỗ lực nhiều hơn để phát huy" không biết làm gì. | Bỏ "chọn một mục tiêu chính" khỏi câu Hỏa Tham ở chuyên đề Phu Thê; gạch 2 thêm một việc làm được trong quan hệ (vd "khi nóng, hẹn lúc khác nói"). |
| Giọng | 3 | Tiền tố "Với Phu Thê:" đọc như máy; "tứ chính", "thế", "cách" chưa giải thích; gạch 1 dài ~60 chữ, hai mệnh đề khuyên nối bằng dấu hai chấm và chấm phẩy. | Giải thích ngắn thuật ngữ lần đầu; bỏ tiền tố; tách câu. |
| **Tổng** | **14/25** | **Trượt** (Đúng 4 < 5; Sâu, Cụ thể, Áp dụng, Giọng < 4). Tăng 4 điểm so với Phiếu 3. | |

**Đức trả lời (30/10):** đọc theo SP-03/TP-06. Đã bổ sung vào CHUNG-CC-08 vế "Ngoại lệ Sát Phá Tham" và thêm CHUNG-TRANH-13: với cách Sát Phá Tham, sát tinh đắc địa (bảng SP-10) = 0 điểm phá, là trợ lực, không nêu làm lý do phá cách; bình/hãm vẫn tính điểm; cách khác không đổi. Lá này: Kình Dương (Đ) Thìn, Địa Kiếp (Đ) Thân = 0 điểm; vẫn mức 3 vì Hỏa Tinh hãm tọa thủ Phu Thê. Góp ý (a) của phiếu là đúng.

### Phiếu 2c: mau-2 bản 01, đoạn "Tứ hóa", chấm vòng 3

`docs/luan-giai/mau-2/ban-01.md` (sau e347da5; quy tắc 61841b1; kiểm thử 9eb03f0) · bộ ghép tự động (Bảo) · ngày 30/10 · việc T-a4504a vòng 2 · đối chiếu khối "Sao các cung liên quan" và bảng 12 cung trong file. Cổng an toàn: **Qua** (không từ cấm, có câu "do hệ thống… tham khảo").
Đã sửa so với Phiếu 2b: gạch Lộc có vế loại trừ Địa Kiếp (Tài Bạch Tuất: Phá Quân (V) hóa Lộc, Địa Kiếp (H)), đúng MENH-HOA-01, TAI-CC-08; thêm gạch giáp Khoa (Sửu) – Quyền (Mão) có Kỵ tọa thủ, đúng câu CHUNG-CC-10; gạch Kỵ nói rõ hóa vào Tham Lang, dẫn "làm việc chỉ cầu bảy phần" (MENH-HOA-04). Đã đối chiếu khớp dữ liệu.

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 5 | Không còn lỗi trái lá số hay thiếu vế loại trừ. Câu hỏi cho Đức (không chặn): hai cung giáp đều bị không vong (Sửu bị Triệt, Mão bị Tuần); CHUNG-CC-10 chưa nói hóa ở cung giáp bị Tuần/Triệt thì lực giáp còn bao nhiêu. | Đức: chốt có thêm vế Tuần/Triệt ở cung giáp vào CC-10 không. |
| Sâu | 4 | Kỵ chưa gộp với Tuần cùng cung (CHUNG-TUAN-06) và Hỏa Tinh đồng cung; ý Tuần + Kỵ chỉ có ở mục "Cát hung tinh đi kèm", tách khỏi đoạn Tứ hóa. | Gạch Kỵ thêm một vế: "Tuần cùng cung làm mặt vướng này nhẹ và đến chậm". |
| Cụ thể | 3 | (a) Cụm chèn khuôn làm câu sai nghĩa: gạch 1 "cái lợi dễ hao tán **về tính cách và hướng đi của bạn**" (Lộc ở Tài Bạch là chuyện tiền, nguồn lực, không "hao tán về tính cách"); gạch 2 "giúp bạn **về tính cách và hướng đi của bạn**" (lặp "của bạn"). (b) Gạch 4 vẫn câu khuôn "thuận lợi và điểm vướng cùng tồn tại… giữ nhịp đều, dự phòng…" (KHUNG-menh-DH-Lộc-Ky), chép y hệt ở ban-08 (2 lần). | Bộ ghép bỏ cụm chèn chuyên đề khi câu quy tắc đã có chủ ngữ riêng, hoặc viết lại: "nguồn tiền đến nhưng dễ hụt"; "có người uy tín sẵn lòng giúp, nhưng bạn cần chủ động đón nhận" (đúng câu CC-10). Gạch 4 nêu tên hai sao: "Phá Quân hóa Lộc ở Tài Bạch kéo lên, Tham Lang hóa Kỵ ở Mệnh kéo xuống". |
| Áp dụng được | 4 | Gạch 1 "chia việc thành bước nhỏ, chốt phần chắc trước" và gạch 3 "đặt kỳ vọng vừa phải" làm được. Gạch 2 "cần chủ động đón nhận", gạch 4 "tận dụng mặt thuận, giữ nhịp đều, dự phòng" vẫn chung. | Gạch 4 một việc cụ thể, vd "giữ một khoản dự phòng trước khi mở hướng mới". |
| Giọng | 3 | Hai cụm chèn ở mục Cụ thể đọc ra ngay là máy ghép; gạch 4 vẫn một câu ~50 chữ, bốn động từ khuyên liền nhau (lỗi Phiếu 2, 2b chưa sửa). | Tách câu, mỗi câu một ý; bỏ cụm chèn. |
| **Tổng** | **19/25** | **Trượt** (tổng < 20; Cụ thể, Giọng < 4). Tăng 7 điểm so với Phiếu 2b; Đúng đã đạt 5. Còn 2 việc ở bộ ghép: cụm chèn chuyên đề và câu KHUNG-menh-DH-Lộc-Ky. | |

### Phiếu 3c: mau-2 bản 03, đoạn "Cách cục", chấm vòng 3

`docs/luan-giai/mau-2/ban-03.md` (sau e347da5) · chuyên đề Phu Thê · bộ ghép tự động (Bảo) · ngày 30/10 · việc T-a4504a vòng 2 · đối chiếu khối "Sao các cung liên quan" (Phu Thê Tý: Tham Lang (H), Hỏa Tinh (H); Thìn Thất Sát (H), Kình Dương (Đ); Thân Phá Quân (H), Địa Kiếp (Đ), Tuần; Ngọ Tử Vi (M) hóa Khoa, Triệt). Cổng an toàn: **Qua**.
Đã sửa so với Phiếu 3b: bỏ tiền tố "Với Phu Thê:"; gạch Sát Phá Tham viết theo chuyên đề (PHU-THL-02: dễ đến dễ đi, cần nền tin cậy); nguồn gạch 2 chỉ còn Hỏa Tinh, Kình Dương (Đ) và Địa Kiếp (Đ) không còn bị tính phá (đúng ngoại lệ CC-08, TRANH-13); thêm gạch "cả ba sao chủ cách đều hãm" (đúng dữ liệu). Mức 3 đúng (Hỏa Tinh hãm tọa thủ).

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 4 | (a) Gạch 2 vẫn ghi lý do "yếu tố hung ở tứ chính (bốn cung chiếu vào Phu Thê) nặng". Mức 3 ở lá này do **Hỏa Tinh hãm tọa thủ** (CC-08 vế 1), không do cộng dồn ở tứ chính; câu hiện tại làm khách hiểu Kình, Kiếp (đắc, là trợ lực) cũng là yếu tố hung. Thêm: tứ chính gồm cả Phu Thê, không phải "bốn cung chiếu vào". (b) Gạch 1 "Tham Lang chưa đủ sáng" vẫn không nói Hỏa Tinh cũng hãm (Phiếu 3b (b), CHUNG-CC-09). | (a) Bộ ghép sinh câu lý do theo yếu tố quyết định mức: hãm tọa thủ → "Hỏa Tinh hãm ngay cung này"; Kỵ hóa vào sao cách → "<sao> hóa Kỵ"; cộng điểm ≥ 4 → "nhiều yếu tố hung ở tứ chính". Giải thích: "tứ chính (cung này và ba cung chiếu về)". (b) "Tham Lang và Hỏa Tinh đều hãm". |
| Sâu | 3 | Đã nêu ba sao chủ cách đều hãm. Còn thiếu Tử Vi (M) hóa Khoa ở Quan Lộc xung chiếu bị Triệt là điểm tựa của cách (Phiếu 3, 3b); trong bài chỉ có ở mục Tứ hóa và Sao phụ, tách rời, không nối với cách. | Thêm vế vào gạch 3: "Tử Vi miếu hóa Khoa ở cung đối diện là điểm tựa, nhưng bị Triệt nên đến chậm". |
| Cụ thể | 4 | Không còn gạch chép nguyên giữa các lá số. Phần đuôi "nhưng yếu tố hung ở tứ chính (bốn cung chiếu vào …) nặng nên chưa thể coi là cách vững, cần nỗ lực nhiều hơn để phát huy" vẫn là khuôn chung (giống ban-01, ban-10, chỉ đổi tên cung). | Như dòng Đúng (a): câu lý do nêu tên sao của lá số. |
| Áp dụng được | 3 | **Lùi so với 3b**: bỏ mất câu làm được "trước khi gắn bó lâu dài, hãy cùng nói rõ điều mỗi người cần". Còn lại "cần nỗ lực nhiều hơn để phát huy", "cần nhiều lần điều chỉnh hơn" không biết làm gì; chỉ có "tiết chế khi hai người bất đồng" là hướng đúng. | Gạch 2 hoặc 3 thêm một việc trong quan hệ (vd "trước khi gắn bó lâu dài, cùng nói rõ điều mỗi người cần; khi nóng, hẹn lúc khác nói"). |
| Giọng | 4 | Đỡ máy hơn nhiều (bỏ tiền tố, có giải thích tứ chính). Còn cụm "khi luận chuyện tình cảm và hôn nhân" ở gạch 3 là lời của người luận, không phải câu nói với khách; gạch 2 dài ~50 chữ. | "…đều hãm, nên chuyện tình cảm của bạn thường nhiều thử thách hơn…"; tách gạch 2 thành hai câu. |
| **Tổng** | **18/25** | **Trượt** (tổng < 20; Đúng 4 < 5; Sâu, Áp dụng < 4). Tăng 4 điểm so với Phiếu 3b. | |

**Kiểm thêm vòng 3 (toàn mau-2, 10 bản):**
- Câu Sát Phá Tham chép y hệt giữa các lá số: **hết** (trước 7/10 bản). Còn trùng phần mô tả cách giữa ban-01 và ban-07 (cùng chuyên đề Mệnh, chấp nhận được) và phần đuôi lý do PHA3 (ban-01, 03, 10). Script `dem-sao-bo-sot.cjs`: bỏ sót 0/66, câu khuôn "ảnh hưởng đến …:" 37/148 (25%), "mỗi người cảm nhận khác nhau" 9/148.
- Câu trùng nhiều nhất giữa các lá số (ngoài Cách cục): "hay muốn đổi hướng, nên cân nhắc trước khi quyết" (Địa Kiếp, 7 bản); "các đặc điểm của cung thường biểu hiện chậm hoặc kín đáo hơn…" (Tuần, 5 bản); "ý nghĩ thoáng, nhiều ý tưởng… cụ thể hóa bằng kế hoạch" (Thiên Không, 5 bản); "hay nghĩ khác lạ, cần thực tế hóa ý tưởng" (Địa Không, 5 bản).
- Khối cách cục lệch câu chữ so bản cũ (Bảo báo): **ban-01 gạch Sát Phá Tham** mức 3 đúng nhưng lý do sai: Hỏa Tinh (Đ) đã = 0 điểm, Địa Kiếp (H) tam hợp 1 + Tuần tọa 2 = 3 < 4, nên mức 3 là do **Tham Lang hóa Kỵ** (CC-08 vế "Hóa Kỵ hóa vào chính sao tạo cách"); câu lại ghi "yếu tố hung ở tứ chính nặng", nguồn liệt kê Địa Kiếp, không có Hóa Kỵ. Cùng lỗi Đúng (a) của Phiếu 3c. Gạch Hỏa Tham ban-01 không nêu Tham Lang hóa Kỵ (luận mẫu TC01 có). **ban-07** câu Sát Phá Tham mức 2 có đuôi "nhịp biến động cao hơn nên cần cân nhắc kỹ…", không dùng khuôn "tiềm năng của cách có, nhưng thành quả đến qua nhiều lần thử" của CC-08 mức 2 (không sai, chỉ lệch mẫu).
- Lời khuyên lạc đề ở bài tình cảm (ban-03, 06, 09) — vẫn còn 8 câu, đều đến từ câu sao phụ dùng chung chưa có bản Phu Thê:
  - ban-03: "Thiên Khôi đồng cung Phu Thê: dễ gặp quý nhân, người hướng dẫn" (PT-PS-4, lỗi đã nêu từ đợt 2); "Thiên Không…: nên cụ thể hóa bằng kế hoạch" (KHUNG-phu-the-SP-ThienKhong-chinh); "Địa Kiếp…: hay muốn đổi hướng, nên cân nhắc trước khi quyết" (KHUNG-phu-the-SP-ĐịaKiếp-tam-hop).
  - ban-06: "…nên thực tế hóa ý tưởng, cân nhắc trước khi đổi hướng và giữ dự phòng" (KHUNG-phu-the-CC-KhongKiepChieu); "Thiên Việt đồng cung Phu Thê: có sự nâng đỡ, cơ hội từ người đi trước" (PT-PS-5); "Địa Không…: cần thực tế hóa ý tưởng" (KHUNG-phu-the-SP-ĐịaKhông-xung). Thêm: câu Phúc Đức vô chính diệu có vế "phái Việt coi gặp Tuần hoặc Triệt là thuận hơn" dù Phúc Đức không có Tuần/Triệt.
  - ban-09: "Hóa Lộc tại Phu Thê mở ra cơ hội và nguồn lực, nên chủ động nắm bắt" (PT-HOA-0, câu Mệnh; cũng chưa gộp Tuần cùng cung); "Thiên Không ở Quan Lộc…: cụ thể hóa bằng kế hoạch" (KHUNG-phu-the-SP-ThiênKhông-xung); "Lộc Tồn…: thận trọng với tài chính… không bỏ lỡ cơ hội" (KHUNG-phu-the-SP-LộcTồn-tam-hop). Thêm: câu Nhật Nguyệt (KHUNG-phu-the-CC-NhatNguyet-PHA) để nguyên cả hai nhánh "cùng sáng thì…; kém sáng thì…" dù lá này Thái Dương (V), Thái Âm (M); phải chọn đúng nhánh.

### Phiếu 2d: mau-2 bản 01, đoạn "Tứ hóa", chấm vòng 4

`docs/luan-giai/mau-2/ban-01.md` (sau f7b661b) · bộ ghép tự động (Bảo) · ngày 30/10 · việc T-a4504a vòng 3 · đối chiếu khối "Sao các cung liên quan" và bảng 12 cung trong file. Cổng an toàn: **Qua** (không từ cấm, có câu "do hệ thống… tham khảo", không lộ dữ liệu khách).
Đã sửa so với Phiếu 2c: bỏ hai cụm chèn "về tính cách và hướng đi của bạn" (gạch 1, 2); gạch Kỵ gộp Tuần cùng Mệnh ("nhẹ hơn và đến chậm", đúng CHUNG-TUAN-06); gạch 4 nêu tên hai sao (Phá Quân, Tham Lang), bỏ câu khuôn "thuận lợi và điểm vướng cùng tồn tại… giữ nhịp đều, dự phòng", có một việc cụ thể. Lộc + Địa Kiếp, giáp Khoa (Sửu) – Quyền (Mão), Kỵ vào Tham Lang vẫn khớp dữ liệu.

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 5 | Không lỗi. Câu hỏi CC-10 (cung giáp Sửu bị Triệt, Mão bị Tuần) vẫn mở, không chặn. | Đức: chốt vế Tuần/Triệt ở cung giáp (CC-10). |
| Sâu | 4 | Kỵ đã gộp Tuần; còn Hỏa Tinh (Đ) đồng cung Kỵ chưa gộp (Phiếu 2c). Ngoài đoạn: mục Cát hung còn câu KHUNG-menh-DH-Tuần-Ky "Mệnh có Tuần trong khi **tam phương** có Hóa Kỵ…" lặp ý gạch Kỵ và gọi sai chỗ Kỵ (Kỵ tọa thủ Mệnh, không phải tam phương). | Bảo: khi gạch Kỵ đã gộp Tuần cùng cung thì tắt KHUNG-*-DH-Tuần-Ky; nếu giữ, đổi "tam phương" thành vị trí thật của Kỵ. |
| Cụ thể | 4 | Gạch 2 "có người uy tín sẵn lòng giúp" chưa nói là ai: Khoa ở Huynh Đệ (Thái Âm), Quyền ở Phụ Mẫu (Cự Môn). Gạch 4 nhắc lại ý gạch 1 và 3. | Hạnh: câu CC-10 thêm nguồn giúp theo cung giáp ("anh chị em, cha mẹ hoặc người đi trước"). |
| Áp dụng được | 4 | Gạch 1, 3, 4 làm được ("chốt phần chắc trước", "cầu bảy phần", "giữ một khoản dự phòng"). Gạch 2 "cần chủ động đón nhận" vẫn chung. | Gạch 2 một việc, vd "chủ động hỏi ý người đi trước khi gặp việc lớn". |
| Giọng | 4 | Hết cụm chèn, câu tách ý. Còn "Đây là điểm cần đầu tư công sức nơi bản thân" cứng. | Không chặn. |
| **Tổng** | **21/25** | **Đạt** (qua cổng, tổng ≥ 20, không tiêu chí < 4, Đúng = 5). Tăng 2 điểm so với Phiếu 2c. Đoạn Tứ hóa ban-01 được dùng làm đoạn xem trước. | |

### Phiếu 3d: mau-2 bản 03, đoạn "Cách cục", chấm vòng 4

`docs/luan-giai/mau-2/ban-03.md` (sau f7b661b) · chuyên đề Phu Thê · bộ ghép tự động (Bảo) · ngày 30/10 · việc T-a4504a vòng 3 · đối chiếu khối "Sao các cung liên quan" (Phu Thê Tý: Tham Lang (H), Hỏa Tinh (H), Thiên Không; Thìn Thất Sát (H), Kình Dương (Đ); Thân Phá Quân (H), Địa Kiếp (Đ), Tuần; Ngọ Tử Vi (M) hóa Khoa, Triệt). Cổng an toàn: **Qua**.
Đã sửa so với Phiếu 3c: lý do phá cách nêu đúng yếu tố quyết định "Hỏa Tinh hãm ngay tại cung này" (CC-08 vế 1), không còn gán Kình/Kiếp đắc là hung (TRANH-13); gạch Hỏa Tham ghi "Tham Lang và Hỏa Tinh đều hãm" (CC-09); có lại câu làm được "trước khi gắn bó lâu dài, hãy cùng nói rõ điều mỗi người cần, và khi nóng thì hẹn lúc khác nói"; gạch 3 bỏ "khi luận chuyện tình cảm…", nói thẳng với khách.

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 5 | Không lỗi trái lá số, mức 3 và lý do đúng. | — |
| Sâu | 3 | Lần thứ tư chưa có: Tử Vi (M) hóa Khoa ở Quan Lộc xung chiếu, bị Triệt, là điểm tựa của cách (Phiếu 3, 3b, 3c). Thêm: Kình Dương (Đ), Địa Kiếp (Đ) là **trợ lực** của Sát Phá Tham (CC-08 ngoại lệ, SP-03) nhưng không còn được nhắc ở đâu trong bài (script: Địa Kiếp@Thiên Di bỏ sót); Tuần ở Thiên Di làm Phá Quân hãm bớt xấu (TUAN-06) cũng không nêu. Ba sao chủ cách hãm chỉ có mặt xấu, không có yếu tố trái chiều được cân. | Bảo: gạch 3 thêm vế điểm tựa: "Tử Vi miếu hóa Khoa ở cung đối diện là điểm tựa nhưng bị Triệt nên đến chậm; Kình Dương, Địa Kiếp đắc địa trong tam hợp là sức bền giúp vượt thử thách". Nghiệm thu: ban-03 mục Cách cục có tên Tử Vi + Triệt và Kình Dương/Địa Kiếp. |
| Cụ thể | 5 | Mọi gạch nêu sao, độ sáng của lá này và nói về quan hệ. | — |
| Áp dụng được | 5 | Gạch 1 "tiết chế khi hai người bất đồng", gạch 2 hai việc làm được, đúng chuyên đề. | — |
| Giọng | 4 | (a) **Cụm chèn sai chỗ**: "Hỏa Tinh hãm ngay tại cung này **(tứ chính gồm cung này và ba cung chiếu về)**": câu không còn chữ "tứ chính", phần giải thích treo. (b) Lặp ý trong cùng gạch: "nhịp nhanh, cảm xúc mạnh, dễ đến dễ đi" rồi "nhịp quan hệ dễ lên xuống"; gạch 2 dài ~75 chữ. Cùng dạng ở ban-01 Cách cục: "nhịp sống nhiều chuyển biến… Với bản thân, đời sống nhiều chuyển biến". | Bảo: chỉ chèn giải thích "tứ chính" khi câu lý do có chữ "tứ chính" (nhánh cộng điểm ≥ 4); bỏ câu chuyên đề nối sau nếu trùng ý câu mô tả cách, hoặc tách gạch 2 thành hai câu. |
| **Tổng** | **22/25** | **Trượt** vì Sâu 3 < 4 (dù tổng ≥ 20). Tăng 4 điểm so với Phiếu 3c. Chỉ còn một việc ở Sâu. | |

**Kiểm thêm vòng 4 (toàn mau-2, sau f7b661b):**
- Lý do phá cách theo yếu tố quyết định: **đạt** ở ban-01 (Tham Lang hóa Kỵ, KHUNG-menh-CC-SatPhaTham-PHA3-ky) và ban-03 (Hỏa Tinh hãm tọa thủ, PHA3-ham).
- Cụm chèn sai nghĩa "về tính cách và hướng đi của bạn": **hết** (grep 0 kết quả). Còn 1 cụm treo "(tứ chính gồm…)" ở ban-03 (Phiếu 3d Giọng a). Khuôn "ảnh hưởng đến …:" còn 33/139 câu (24%), "mỗi người cảm nhận khác nhau" 9/139.
- Nhật Nguyệt ban-09: **đúng nhánh** (KHUNG-phu-the-CC-NhatNguyet-SANG-PHA, "cả hai sao đều sáng"; Thái Dương (V) Thìn, Thái Âm (M) Tuất, khớp CHUNG-CC-05).
- Lời khuyên lạc đề bài tình cảm: hết 8 câu đã nêu, nhưng **cách tắt câu gây bỏ sót sao** (lùi): script `dem-sao-bo-sot.cjs` từ 0/66 lên **6/66 (9%)**: ban-03 Thiên Không@Phu Thê, Địa Kiếp@Thiên Di; ban-06 Địa Không@Quan Lộc; ban-09 **Hóa Lộc@Phu Thê** (Thái Âm (M) hóa Lộc tọa thủ, có Tuần — hóa quan trọng nhất của bài tình cảm này nay không có câu nào), Thiên Không@Quan Lộc, Lộc Tồn@Thiên Di. Bài trả phí bỏ một Tứ hóa tọa thủ chính cung là lỗi Sâu nặng (bước Tứ hóa của skill). Sửa đúng: Hạnh viết bản Phu Thê cho các câu này (vd Hóa Lộc tại Phu Thê: người đồng hành mang lại sự ấm áp, hỗ trợ; Tuần cùng cung nên đến chậm), Bảo thay câu thay vì tắt. Nghiệm thu: script bỏ sót 0/66 và grep 3 bài tình cảm không còn câu lạc đề.
- Còn sót lạc đề: ban-06 "Địa Kiếp ở Quan Lộc… hay muốn đổi hướng, nên cân nhắc trước khi quyết" (KHUNG-phu-the-SP-ĐịaKiếp-xung, bản xung của câu đã tắt ở tam hợp); nhẹ hơn: ban-09 "Tả Phù… dễ hợp tác" (hợp tác là chuyện việc), "Linh Tinh…: nên giữ nhịp nghỉ ngơi".
- Câu Phúc Đức vô chính diệu ban-06: **chưa sửa**, vẫn "phái Việt coi gặp Tuần hoặc Triệt là thuận hơn" dù Phúc Đức Dậu không có Tuần/Triệt; thêm lỗi Đúng: CHUNG-VCD-03 ghi Phúc Đức vô chính diệu "nên gặp Tuần, **kỵ Triệt**", nên gộp "Tuần hoặc Triệt" là sai với cung Phúc Đức. Câu cũng không nêu tên chính tinh mượn ở cung đối diện. Bảo: chỉ in vế Tuần/Triệt khi cung có Tuần/Triệt, và với Phúc Đức tách Tuần (thuận) / Triệt (kỵ).

### Phiếu 2e: mau-2 bản 01, đoạn "Tứ hóa", chấm vòng 5

`docs/luan-giai/mau-2/ban-01.md` (sau 900d384) · bộ ghép tự động (Bảo) · ngày 30/10 · việc T-a4504a vòng 4 · đối chiếu khối "Sao các cung liên quan" và bảng 12 cung trong file. Cổng an toàn: **Qua** (không từ cấm, có câu "do hệ thống… tham khảo", không lộ dữ liệu khách).
Kết quả kiểm: `git diff 419854b 900d384` cho thấy 4 gạch Tứ hóa **không đổi**. Đã sửa ngoài đoạn theo Phiếu 2d (Sâu): bỏ câu KHUNG-menh-DH-Tuần-Ky ("tam phương có Hóa Kỵ") ở mục Cát hung, hết lặp ý và hết gọi sai chỗ Kỵ.

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 5 | Không lỗi. Câu hỏi CC-10 (cung giáp Sửu bị Triệt, Mão bị Tuần) vẫn mở, không chặn. | Đức: chốt vế Tuần/Triệt ở cung giáp. |
| Sâu | 4 | Hỏa Tinh (Đ) đồng cung Kỵ vẫn chưa gộp vào gạch Kỵ (Phiếu 2c, 2d). | Không chặn. Muốn lên 5: gạch Kỵ thêm vế Hỏa Tinh đồng cung + một câu "Tóm lại". |
| Cụ thể | 4 | Gạch 2 "có người uy tín sẵn lòng giúp" chưa nói là ai (Khoa ở Huynh Đệ, Quyền ở Phụ Mẫu). | Hạnh: câu CC-10 nêu nguồn giúp theo cung giáp. |
| Áp dụng được | 4 | Gạch 2 "cần chủ động đón nhận" vẫn chung. | Vd "chủ động hỏi ý người đi trước khi gặp việc lớn". |
| Giọng | 4 | "Đây là điểm cần đầu tư công sức nơi bản thân" vẫn cứng. Ngoài đoạn (lùi mới): Tổng quan "đa tài, ham học hỏi, giỏi giao tiếp. **Nhiều tài và có duyên giao tiếp**" lặp ý ngay câu sau (ML-S09-TOT); Cách cục gạch 3 "Hỏa Tinh đắc địa **trong tam phương**" trong khi Hỏa Tinh tọa thủ Mệnh. | Bảo/Hạnh: bỏ câu lặp ở ML-S09-TOT; câu trợ lực ghi "ngay tại Mệnh" khi sát tinh tọa thủ. Không chặn đoạn Tứ hóa. |
| **Tổng** | **21/25** | **Đạt** (qua cổng, tổng ≥ 20, không tiêu chí < 4, Đúng = 5). Giữ kết quả Phiếu 2d. | |

### Phiếu 3e: mau-2 bản 03, đoạn "Cách cục", chấm vòng 5

`docs/luan-giai/mau-2/ban-03.md` (sau 900d384) · chuyên đề Phu Thê · bộ ghép tự động (Bảo) · ngày 30/10 · việc T-a4504a vòng 4 · đối chiếu khối "Sao các cung liên quan" (Phu Thê Tý: Tham Lang (H), Hỏa Tinh (H); Phúc Đức Thìn: Thất Sát (H), Kình Dương (Đ); Thiên Di Thân: Phá Quân (H), Địa Kiếp (Đ), Tuần; Quan Lộc Ngọ: Tử Vi (M) hóa Khoa, Triệt). Cổng an toàn: **Qua**.
Đã sửa so với Phiếu 3d: bỏ cụm treo "(tứ chính gồm…)"; bỏ câu lặp "nhịp quan hệ dễ lên xuống"; thêm gạch 4 "Kình Dương, Địa Kiếp đắc địa trong tam phương là trợ lực của thế Sát Phá Tham" (KHUNG-phu-the-CC-SatPhaTham-TroLuc), vị trí và độ sáng khớp dữ liệu, đúng CHUNG-SP-03, TP-06, CC-08 ngoại lệ.

| Tiêu chí | Điểm | Trích dẫn lỗi | Sửa gì |
|---|---|---|---|
| Đúng | 5 | Không lỗi; mức 3, lý do (Hỏa Tinh hãm tọa thủ), trợ lực đều đúng. | — |
| Sâu | 4 | Đã cân yếu tố trái chiều: ba sao chủ cách hãm (mặt khó) và Kình, Kiếp đắc (trợ lực). Còn thiếu để lên 5: (a) Tử Vi (M) hóa Khoa ở Quan Lộc bị Triệt chưa nối vào cách (ý dính CHUNG-TP-05, chờ chuyên gia; không trừ điểm vì lý do này); (b) Tuần ở Thiên Di làm Phá Quân hãm bớt xấu (CHUNG-TUAN-06, có nguồn KL, WC7) chưa nêu trong cách; (c) không có câu tổng hợp. Cả Khoa, Triệt Quan Lộc, Tuần Thiên Di đều có mặt ở mục Tứ hóa và Sao phụ, nên không tính là bỏ sót yếu tố đổi kết luận (mức 3). | Không chặn. Muốn lên 5 mà không cần TP-05: gạch Tứ hóa "Tử Vi mang Hóa Khoa…" gộp Triệt cùng cung theo TUAN-06 (như gạch Kỵ + Tuần của ban-01); gạch 3 thêm vế Tuần ở Thiên Di (TUAN-06); thêm "Tóm lại". |
| Cụ thể | 5 | Mọi gạch nêu sao, độ sáng của lá này, nói về quan hệ. Gạch 4 dùng khuôn chung với ban-01 ("có thêm sức bền để vượt thử thách") và chưa nêu cung (Phúc Đức, Thiên Di), không đủ để hạ điểm. | Nêu cung của sát tinh trợ lực. |
| Áp dụng được | 5 | Gạch 1, 2 có việc làm được, đúng chuyên đề. | — |
| Giọng | 4 | Gạch 2 vẫn ~60 chữ; "trợ lực", "tam phương" chưa giải thích. | Tách gạch 2; giải thích ngắn "tam phương". |
| **Tổng** | **23/25** | **Đạt** (qua cổng, tổng ≥ 20, không tiêu chí < 4, Đúng = 5). Tăng 1 điểm so với Phiếu 3d. Sâu lên 4 nhờ ý trợ lực có nguồn, **không phải chấm ngoại lệ**. | |

**Ghi chú cho Đức (TP-05):** câu KHUNG-phu-the-TRIET-xung (ban-03 Sao phụ: "các sao tại Quan Lộc bị giảm cường độ nên phần đóng góp của cung này cho chuyện tình cảm… dịu hơn") và KHUNG-*-TUAN-tam-hop đang dùng chính ý của CHUNG-TP-05 (sao ở cung có Tuần/Triệt chiếu sang mang cường độ đã giảm) nhưng ghi nguồn NL, KL như quy tắc đã duyệt. Cần chốt một chiều: TP-05 được dùng thì cho phép luôn ý "Tử Vi hóa Khoa bị Triệt nên điểm tựa đến chậm"; chưa được dùng thì hai khung trên cũng phải gắn cờ chờ duyệt.

**Kiểm thêm vòng 5 (toàn mau-2, sau 900d384):**
- Script `dem-sao-bo-sot.cjs`: bỏ sót **6/66 (9%)**, không giảm so với vòng 4. Đã bù: ban-03 Địa Kiếp@Thiên Di (qua gạch trợ lực). Lùi mới: ban-06 **Địa Kiếp@Quan Lộc** (câu lạc đề KHUNG-phu-the-SP-ĐịaKiếp-xung bị tắt thay vì viết bản Phu Thê; Quan Lộc có cặp Địa Không (Đ) + Địa Kiếp (Đ) xung chiếu, cả hai nay không có câu nào — TP-06: cặp sát tinh mới là yếu tố đáng kể). Còn nguyên: ban-03 Thiên Không@Phu Thê; ban-06 Địa Không@Quan Lộc; ban-09 **Hóa Lộc@Phu Thê** (Tứ hóa tọa thủ chính cung, lần thứ hai), Thiên Không@Quan Lộc, Lộc Tồn@Thiên Di. Khuôn "ảnh hưởng đến …:" 32/140 (23%), "mỗi người cảm nhận khác nhau" 9/140.
- Phúc Đức vô chính diệu ban-06: **đã sửa** vế "gặp Tuần hoặc Triệt" (Phúc Đức Dậu không có Tuần/Triệt). Còn: chưa nêu tên chính tinh mượn ở cung đối diện; "khi luận chuyện tình cảm và hôn nhân, nên mượn…" là lời người luận, không nói với khách.
- Nghiệm thu còn mở (P0 trước khi mau-2 lên site trả phí): script 0/66; Hạnh viết bản Phu Thê cho Hóa Lộc tọa thủ, Thiên Không, Không Kiếp xung, Lộc Tồn; Bảo **thay** câu, không tắt.

### Tổng hợp chấm thử

| Bài | Đúng | Sâu | Cụ thể | Áp dụng | Giọng | Tổng | Kết luận |
|---|---|---|---|---|---|---|---|
| VN01 (cả bài, vòng 1) | 4 | 4 | 5 | 5 | 5 | 23 | Trượt (Đúng < 5), sửa 3 chỗ là đạt |
| VN01 (cả bài, vòng 2, Phiếu 1b) | 5 | 5 | 5 | 5 | 5 | 25 | **Đạt**, lên site được; 1 câu hỏi quy tắc NAM-LUU-04 cho Đức (không chặn) |
| mau-2 ban-01 · Tứ hóa | 3 | 2 | 2 | 2 | 3 | 12 | Trượt |
| mau-2 ban-03 · Cách cục | 2 | 2 | 1 | 2 | 3 | 10 | Trượt |
| mau-2 ban-01 · Tứ hóa (Phiếu 2b, sau 8f578e4) | 3 | 2 | 2 | 2 | 3 | 12 | Trượt, đoạn không đổi |
| mau-2 ban-03 · Cách cục (Phiếu 3b, sau 8f578e4) | 4 | 2 | 2 | 3 | 3 | 14 | Trượt |
| mau-2 ban-01 · Tứ hóa (Phiếu 2c, sau e347da5) | 5 | 4 | 3 | 4 | 3 | 19 | Trượt (sát ngưỡng) |
| mau-2 ban-03 · Cách cục (Phiếu 3c, sau e347da5) | 4 | 3 | 4 | 3 | 4 | 18 | Trượt |
| mau-2 ban-01 · Tứ hóa (Phiếu 2d, sau f7b661b) | 5 | 4 | 4 | 4 | 4 | 21 | **Đạt** |
| mau-2 ban-03 · Cách cục (Phiếu 3d, sau f7b661b) | 5 | 3 | 5 | 5 | 4 | 22 | Trượt (Sâu 3 < 4) |
| mau-2 ban-01 · Tứ hóa (Phiếu 2e, sau 900d384) | 5 | 4 | 4 | 4 | 4 | 21 | **Đạt** (đoạn không đổi; giữ) |
| mau-2 ban-03 · Cách cục (Phiếu 3e, sau 900d384) | 5 | 4 | 5 | 5 | 4 | 23 | **Đạt** (Sâu lên 4 nhờ trợ lực, không cần ngoại lệ) |

Nhận xét: bài viết tay theo quy tắc (VN01) chỉ vướng điều kiện quy tắc; bản ghép tự động mau-2 hỏng ở bộ ghép (câu khuôn dùng chung giữa chuyên đề, tính sai mức cách, thiếu vế loại trừ), nên phải sửa ở `quy-tac-khung.json` và bộ ghép, không sửa từng bài. Mau-2 chưa được lên site trả phí.

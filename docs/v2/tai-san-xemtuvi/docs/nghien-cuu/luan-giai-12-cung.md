# Bộ quy tắc luận giải 12 cung Tử Vi Đẩu Số (xemtuvi.vn)

Phiên bản nháp 1, 30/10/2026 (việc L-fcc128, mốc M2). **Chưa qua chuyên gia duyệt.**

Mục đích: nền tảng chuyên môn cho luận giải trả phí. AI và người viết chỉ luận điều có trong bộ quy tắc này, và ghi trường phái khi các phái khác nhau. Cách dùng: skill `tuvi-luan-giai` (kho vanphongai).

Tệp này được **gộp tự động** (`python3 scripts/luan-giai/gop-luan-giai.py docs/nghien-cuu`; đếm: `scripts/luan-giai/dem-quy-tac.py`) từ các phần trong `docs/nghien-cuu/luan-giai/` (sửa ở phần nháp rồi gộp lại, không sửa thẳng tệp này). Quy ước định dạng, mã nguồn, giọng văn: `luan-giai/QUY-UOC.md`. Tên sao, cung, độ sáng: `tuvi-an-sao-spec.md` (mục 2, 4, 5, 6).

Đọc mã quy tắc: `[CUNG-CHỦĐỀ-số]`, ví dụ `[QUAN-TS-02]` = cung Quan Lộc, sao Thất Sát, quy tắc 2. Cờ `⚑1nguồn`: chỉ có một nguồn; `⚑chưa-nguồn`: chưa tìm được nguồn. Mã nguồn sách (TT, TB, NL, KL, TC, PT…) ở mục 0.10; mã nguồn web theo từng phần (WC chung, WM cung 1–3, WT cung 4–6, WQ cung 7–9, WD cung 10–12) ở Phụ lục A.

**Điểm còn tranh luận**: mục 0.9 (chung) và mục `.6` của từng cung (mã `…-TRANH-…`).

## Mục lục

- 0. Nguyên tắc chung (phương pháp, tính chất sao, tứ hóa, Tuần Triệt, vô chính diệu, cách cục lớn, so sánh trường phái, tranh luận, danh mục nguồn)
- 1. Mệnh · 2. Huynh Đệ · 3. Phu Thê · 4. Tử Tức · 5. Tài Bạch · 6. Tật Ách
- 7. Thiên Di · 8. Nô Bộc · 9. Quan Lộc · 10. Điền Trạch · 11. Phúc Đức · 12. Phụ Mẫu
- Phụ lục A. Ghi chú và nguồn web theo từng phần
- Phụ lục B. Luận thử lá số TC01 (Mệnh, Quan Lộc, Phu Thê)

## Hạn chế đã biết

- Nguồn đọc trực tiếp: *Toàn Thư* (bản chữ Hán, Wikisource; nhóm tự dịch), *Tân Biên*, *Khảo Luận*, *Nghiệm Lý* (bản quét archive.org, có số trang ở cung 4–9). Các nguồn khác qua bản chép trên web. *Tân Biên* và *Khảo Luận* chép lại *Toàn Thư* ở nhiều câu, nên "2 nguồn" không phải lúc nào cũng độc lập.
- Một số ô độ sáng trong sách lệch với bảng spec mục 6 (ghi ở các mục Tranh luận); bộ quy tắc giữ theo bảng spec cho đến khi chuyên gia chốt.
- Đã lược hoặc trung tính hóa: số con, số anh em, số lần kết hôn, tuổi thọ, tai nạn, tù tội, mồ mả, phán xét đạo đức; chỗ lược có ghi chú.

## 0. Nguyên tắc chung của bộ luận giải 12 cung

Phiên bản nháp 30/10/2026 · Nhóm Nghiên cứu Tử vi · Theo `QUY-UOC.md`. Phần này đứng đầu `docs/nghien-cuu/luan-giai-12-cung.md`; các phần `cung-*.md` áp dụng nguyên tắc ở đây, không nhắc lại.

**Mức kiểm chứng nguồn.** Nguồn có ghi *(đã đọc)* là văn bản nhóm đã đọc trực tiếp trong lần soạn này (Toàn Thư bản Wikisource, các trang web WC). Mã sách Việt (TB, CN, HS) và TC, PT ghi theo nội dung thường được các nguồn khác dẫn lại; **chưa đối chiếu bản in**, không ghi số trang. Riêng NL, KL ghi *(bản quét, đã đọc)* là đã đọc trực tiếp bản quét archive.org (bổ sung 30/10/2026, xem 0.10). Chuyên gia duyệt cần ưu tiên kiểm các dòng chỉ có mã sách Việt.

Mã chủ đề bổ sung cho phần CHUNG (ngoài danh sách trong QUY-UOC): **PP** phương pháp, **CT** tính chất chính tinh, **TUAN** Tuần Triệt, **VCD** vô chính diệu, **PHAI** so sánh trường phái. Mã nguồn web của phần này dùng tiền tố **WC** để không trùng W của các nhóm cung.

---

### 0.1. Phương pháp luận một cung (PP)

#### Thứ tự các bước
- **[CHUNG-PP-01]** Luận một cung theo sáu bước, không đảo thứ tự: (1) chính tinh tọa thủ; (2) độ sáng của chính tinh; (3) tam phương tứ chính (cung tam hợp, cung xung chiếu) và cung nhị hợp, cung giáp; (4) sao phụ, sát tinh; (5) Tứ hóa; (6) Tuần, Triệt. Sau cùng mới kết luận xu hướng. — *Nguồn: TT (Đàm tinh yếu luận: "Đệ nhất khán Mệnh cung cát hung, miếu vượng, hóa cát hóa kỵ…; tam khán Thiên Di, Tài Bạch, Quan Lộc tam phương tinh thần") (đã đọc); TB (phần phương pháp giải đoán)*
- **[CHUNG-PP-02]** Thứ tự xem cả lá số: cung Mệnh trước, rồi Thân, rồi ba cung tam phương của Mệnh (Thiên Di, Tài Bạch, Quan Lộc), rồi Phúc Đức; luận cung khác cũng đặt trong bối cảnh Mệnh–Thân này. — *Nguồn: TT (Đàm tinh yếu luận, thứ tự "đệ nhất… tứ khán Phúc Đức cung") (đã đọc); NL (phần Mệnh, Thân)*
- **[CHUNG-PP-03]** Chính tinh là "xương sống" của cung; sao phụ chỉ làm tăng, giảm hoặc nhuộm màu tính chất chính tinh, không thay được chính tinh. — *Nguồn: TT (Thái Vi phú: "Tử Vi, Thiên Phủ toàn y Phụ Bật chi công; Thất Sát, Phá Quân chuyên y Dương Linh chi ngược") (đã đọc); TB; NL (tập 1: "trung tinh là tư cách để tô điểm cho tượng hình thêm khởi sắc (Long Phượng Thai Tọa Quang Quí)") (bản quét, đã đọc)*

#### Độ sáng
- **[CHUNG-PP-04]** Độ sáng 5 bậc Miếu > Vượng > Đắc > Bình > Hãm theo bảng mục 6 của `tuvi-an-sao-spec.md`. Chính tinh miếu vượng phát huy mặt tích cực; hãm thì mặt thách thức nổi rõ hơn, cần dựa nhiều vào cát tinh và nỗ lực cá nhân. — *Nguồn: SPEC (mục 6); TT (Đàm tinh yếu luận, bảng miếu vượng từng sao; Hình tính phú: "Tinh luận miếu vượng") (đã đọc)*
- **[CHUNG-PP-05]** Chính tinh hãm, lại gặp sát tinh và Hóa Kỵ cùng hội: đây là tổ hợp nhiều thách thức nhất của cung; diễn đạt là "giai đoạn/lĩnh vực cần thận trọng và chuẩn bị kỹ", không phán kết quả xấu. — *Nguồn: TT (Luận cách tinh số cao hạ: "nhược cư hãm địa hựu gia sát hóa kỵ, vi hạ cách") (đã đọc); NL*

#### Tam phương tứ chính, nhị hợp, giáp
- **[CHUNG-PP-06]** Tứ chính của một cung = cung đó + hai cung tam hợp (cách 4 cung) + cung xung chiếu (cách 6 cung). Sao ở tứ chính đều ảnh hưởng cung đang luận; sao tọa thủ mạnh nhất, xung chiếu kế tiếp, tam hợp sau. — *Nguồn: TT (Đẩu số phát vi luận: "Tứ chính cát tinh định vi quý, tam phương sát củng thiểu vi kỳ"; "đối chiếu hề tường hung tường cát, hợp chiếu hề quan tiện quan vinh") (đã đọc); TB*
- **[CHUNG-PP-07]** Cát tinh hội ở tứ chính làm cung tốt lên; sát tinh hội ở tam phương làm giảm, dù chính tinh tốt. — *Nguồn: TT (Đẩu số phát vi luận, câu dẫn ở PP-06; Đàm tinh yếu luận: "tam phương hữu ác tinh xung chiếu…") (đã đọc); NL*
- **[CHUNG-PP-08]** Cung nhị hợp (theo lục hợp địa chi: Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi) có ảnh hưởng phụ, yếu hơn tam hợp và xung chiếu; chỉ dùng để bổ sung. — *Nguồn: TB; KL (Phối chiếu, mục "Nhị hợp": "Tí nhị hợp với Sửu… Ngọ nhị hợp với Mùi"; xung chiếu "quan trọng hơn hai cung tam chiếu và nhị hợp") (bản quét, đã đọc)*
- **[CHUNG-PP-09]** Cung bị hai sao kẹp hai bên (giáp) chịu ảnh hưởng của cặp đó. Giáp cát (Tử Phủ, Tả Hữu, Xương Khúc, Khôi Việt, Khoa Quyền Lộc, Nhật Nguyệt) là thuận lợi; giáp sát (Không Kiếp, Hỏa Linh, Kình Đà) là áp lực. — *Nguồn: TT (Luận cách tinh số cao hạ: "tam giáp mệnh hung, lục giáp cát"; Thái Vi phú: "Phụ Bật giáp đế vi thượng phẩm", "Nhật Nguyệt giáp Tài, bất quyền tắc phú") (đã đọc); TB*

#### Sao, Tứ hóa, Tuần Triệt ở tam phương và xung chiếu (TP)
Bổ sung 30/10/2026 sau luận thử TC01. NL, KL dưới đây là bản quét archive.org nhóm đã đọc (xem 0.10).
- **[CHUNG-TP-01]** Chính tinh **tọa thủ** quyết định tính chất cung; sao ở cung xung chiếu và hai cung tam hợp (gọi chung là **hội chiếu**) chỉ làm tăng hoặc giảm, không đổi tính chất. Ngoại lệ: cung vô chính diệu mượn chính tinh cung xung chiếu (VCD-01). — *Nguồn: TT (Phát vi luận: "đối chiếu hề tường hung tường cát, hợp chiếu hề quan tiện quan vinh") (đã đọc); NL (tập 2: "cái quan trọng chính yếu của Tử vi là tam hợp. Nắm được tam hợp rồi phăng ra nhị hợp và xung chiếu") (bản quét, đã đọc)*
- **[CHUNG-TP-02]** Mức ảnh hưởng mặc định khi viết: tọa thủ > xung chiếu > tam hợp > nhị hợp, giáp (như PP-06). Một sao tốt hoặc xấu ở hội chiếu chỉ viết thành một câu "được hỗ trợ từ …" hoặc "chịu thêm áp lực từ …", gắn với lĩnh vực của cung chứa sao đó; không viết thành kết luận chính của cung. — *Nguồn: TT (Phát vi luận, câu ở TP-01) (đã đọc); KL (Phối chiếu: "Vì chiếu trực tiếp nên cung xung chiếu quan trọng hơn hai cung tam chiếu và nhị hợp") (bản quét, đã đọc). NL nhấn tam hợp hơn, xem TRANH-09.*
- **[CHUNG-TP-03]** **Tứ hóa ở hội chiếu**: Lộc, Quyền, Khoa ở tam phương tứ chính cộng dồn cho cung (Tam hóa củng, SP-07); Hóa Kỵ ở hội chiếu vẫn tác động nhưng nhẹ hơn Kỵ tọa thủ, diễn đạt "một điểm vướng đến từ lĩnh vực <cung chứa Kỵ>". Hóa Lộc xung chiếu Lộc Tồn là "song Lộc" (thuận), còn đồng cung lại kém hơn. — *Nguồn: TT (Hóa Lộc: "ác diệu lai lâm tịnh Dương Đà Hỏa Kỵ xung chiếu, diệc bất vi hại"; Thái Vi phú: "Lộc phùng xung phá, cát xứ tàng hung") (đã đọc); KL (Lộc tồn: "Lộc tồn được Hóa lộc xung chiếu là cách song lộc… có Hóa lộc đồng cung thì lại xấu đi") (bản quét, đã đọc)*
- **[CHUNG-TP-04]** **Tuần, Triệt không chiếu**: Tuần, Triệt đứng giữa hai cung chỉ tác động hai cung đó, không chiếu sang cung tam hợp, xung chiếu như sao nằm trong cung (Thiên Không, Thiên Tài…). — *Nguồn: NL (tập 1: "Đã đặt đứng giữa 2 cung có nghĩa là chỉ có liên quan tới 2 cung. Không như Thiên Không…") (bản quét, đã đọc); KL (Tuần Triệt: Triệt "tách đôi hai cung", Tuần "nối hai cung cạnh nhau") (bản quét, đã đọc)*
- **[CHUNG-TP-05]** Sao nằm trong cung có Tuần hoặc Triệt khi hội chiếu sang cung đang luận thì mang theo cường độ đã bị điều chỉnh tại gốc: sao tốt chiếu sang yếu đi, sao xấu chiếu sang nhẹ đi (theo TUAN-02). Viết: "sự hỗ trợ từ … đến chậm hoặc không trọn vẹn". — *Nguồn: NL (tập 1, câu ở TP-04) (bản quét, đã đọc). (Quy ước nhóm suy từ TP-04 và TUAN-02, cần chuyên gia duyệt.)* ⚑1nguồn
- **[CHUNG-TP-06]** Sát tinh ở hội chiếu: một sát tinh lẻ chỉ làm giảm nhẹ; sát tinh thành cặp (Kình Đà, Hỏa Linh, Không Kiếp) cùng hội vào tứ chính mới làm giảm rõ. Sát tinh đắc địa hội chiếu bộ Sát Phá Tham được tính là trợ lực (SP-03). — *Nguồn: TT (Phát vi luận: "tam phương sát củng thiểu vi kỳ"; Luận cách tinh số cao hạ: "tam giáp" Kiếp Không, Hỏa Linh, Dương Đà) (đã đọc); KL (Không Kiếp: "Không Kiếp, Tử Phủ cùng đắc địa thì gặp nhiều bước thăng"; "Kình Đà, Không Kiếp đắc địa hội hợp cũng được hưởng giàu sang") (bản quét, đã đọc)*

#### Thứ tự ưu tiên khi các yếu tố mâu thuẫn
- **[CHUNG-PP-10]** Ưu tiên: chính tinh và độ sáng > tổ hợp tứ chính (cách cục) > Tứ hóa > sát tinh/cát tinh lẻ > Tuần Triệt > sao nhỏ (vòng Bác Sĩ, Thái Tuế, Tràng Sinh). Kết luận cuối cùng theo **xu hướng chung** của nhiều yếu tố, không theo một sao đơn lẻ. — *Nguồn: TT (Luận cách tinh số cao hạ: "cát hung tương bạn thủ chiếu vi trung cách") (đã đọc); TB. (Thứ tự bậc là tổng hợp của nhóm, cần chuyên gia duyệt.)*
- **[CHUNG-PP-11]** Cách cục tốt mà gặp tứ sát, Không Kiếp hoặc Hóa Kỵ hội chiếu thì coi là "phá cách": giữ tính chất cách, giảm mức độ thuận lợi. — *Nguồn: TT (Luận cách tinh số cao hạ, câu dẫn ở PP-05) (đã đọc); NL*
- **[CHUNG-PP-12]** Khi hai nguồn hoặc hai yếu tố mâu thuẫn không phân định được, viết cả hai khả năng và nói điều kiện nào nghiêng về bên nào; không tự chọn một kết quả tuyệt đối. — *Nguồn: QUY-UOC (mục Phái khác nhau); SPEC (mục 10)*
- **[CHUNG-PP-13]** Ngũ hành của cung (theo địa chi), của chính tinh và của bản Mệnh chỉ dùng để điều chỉnh mức độ (sao sinh cung/Mệnh thì thuận, khắc thì giảm), không đảo ngược tính chất sao. — *Nguồn: SPEC (mục 5.13, hành cung); TB* ⚑1nguồn

---

### 0.2. Tính chất 14 chính tinh (CT)

Ngũ hành theo Toàn Thư (*Chư tinh vấn đáp luận*), đối chiếu WC4. "Hóa khí" là chữ Toàn Thư dùng để nói bản chất sao. Mỗi sao: tính chất cốt lõi, viết ở dạng xu hướng.

- **[CHUNG-CT-TV-01]** **Tử Vi**: Thổ, Bắc đẩu, đế tinh. Chủ về vị thế, khả năng lãnh đạo, lòng tự trọng, mong được tôn trọng; cần Tả Hữu phò trợ mới phát huy hết. — *Nguồn: TT (Chư tinh vấn đáp — Tử Vi: "Tử Vi thuộc Thổ, nãi trung thiên chi tôn tinh vi đế tọa"; Thái Vi phú "Tử Phủ toàn y Phụ Bật") (đã đọc); WC4 (Yin Earth, Emperor Star) (đã đọc)*
- **[CHUNG-CT-TCO-01]** **Thiên Cơ**: Mộc, Nam đẩu, thiện tinh. Chủ về trí óc, mưu tính, linh hoạt, hay thay đổi; hợp việc cần suy nghĩ, kế hoạch. — *Nguồn: TT (Chư tinh vấn đáp — Thiên Cơ: "Thiên Cơ thuộc Mộc… hóa khí viết thiện") (đã đọc); WC4 (Yin Wood) (đã đọc)*
- **[CHUNG-CT-TDU-01]** **Thái Dương**: Hỏa, tinh của mặt trời, hóa quý. Chủ về sự tỏa sáng, danh tiếng, tinh thần cống hiến, vai trò người nam/người cha; sáng ban ngày (Dần→Ngọ) mạnh, ở các cung Thân→Hợi yếu. — *Nguồn: TT (Chư tinh vấn đáp — Thái Dương: "Thái Dương tinh thuộc Hỏa, nhật chi tinh dã… hóa quý hóa lộc") (đã đọc); WC4 (Yang Fire) (đã đọc); SPEC mục 6*
- **[CHUNG-CT-VK-01]** **Vũ Khúc**: Kim, Bắc đẩu, tài tinh. Chủ về tiền bạc, quyết đoán, thực tế, kỷ luật; tính cương. — *Nguồn: TT (Chư tinh vấn đáp — Vũ Khúc: "Vũ Khúc Bắc đẩu đệ lục tinh, thuộc Kim") (đã đọc); WC4 (Yin Metal) (đã đọc); TB (Vũ Khúc là tài tinh)*
- **[CHUNG-CT-TD-01]** **Thiên Đồng**: Thủy, Nam đẩu, phúc tinh. Chủ về sự hiền hòa, hưởng thụ, dễ thích nghi; có xu hướng ngại khó, cần động lực. — *Nguồn: TT (Chư tinh vấn đáp — Thiên Đồng: "Thiên Đồng tinh thuộc Thủy… hóa phúc") (đã đọc); WC4 (Yang Water) (đã đọc)*
- **[CHUNG-CT-LT-01]** **Liêm Trinh**: Hỏa (WC4 ghi thêm Mộc), Bắc đẩu, "tù tinh". Chủ về nguyên tắc, kỷ luật, tham vọng, cảm xúc mạnh; tính hai mặt rõ (chính trực hoặc cứng nhắc). — *Nguồn: TT (Chư tinh vấn đáp — Liêm Trinh: "Liêm Trinh thuộc Hỏa… hóa tù vi sát") (đã đọc); WC4 (Yin Fire, secondary Wood) (đã đọc)*
- **[CHUNG-CT-TP-01]** **Thiên Phủ**: Thổ, Nam đẩu chủ lệnh, kho tàng. Chủ về sự ổn định, giữ gìn, quản lý, tích lũy, tính bao dung. — *Nguồn: TT (Chư tinh vấn đáp — Thiên Phủ: "Thiên Phủ thuộc Thổ, Nam đẩu chủ lệnh đệ nhất tinh") (đã đọc); WC4 (Yang Earth, Treasury) (đã đọc)*
- **[CHUNG-CT-TA-01]** **Thái Âm**: Thủy, tinh của mặt trăng, hóa phú, chủ điền trạch. Chủ về sự dịu dàng, tinh tế, tích lũy, nhà cửa, vai trò người nữ/người mẹ; sáng ở các cung đêm (Thân→Tý). — *Nguồn: TT (Chư tinh vấn đáp — Thái Âm: "Thái Âm nãi Thủy chi tinh, vi điền trạch chủ, hóa phú") (đã đọc); WC4 (Yin Water) (đã đọc); SPEC mục 6*
- **[CHUNG-CT-THL-01]** **Tham Lang**: Thủy (WC4: Mộc kiêm Thủy), Bắc đẩu, đào hoa tinh. Chủ về ham muốn, giao tiếp, tài năng đa dạng, nghệ thuật, hưởng thụ. — *Nguồn: TT (Chư tinh vấn đáp — Tham Lang: "thuộc Thủy… hóa khí vi đào hoa") (đã đọc); WC4 (Yang Wood, secondary Water) (đã đọc)*
- **[CHUNG-CT-CM-01]** **Cự Môn**: Thủy (kiêm Kim), Bắc đẩu, "ám tinh". Chủ về lời nói, tranh luận, phân tích, nghi vấn; hợp nghề dùng lời nói, nghiên cứu; cần chú ý hiểu lầm trong giao tiếp. — *Nguồn: TT (Chư tinh vấn đáp — Cự Môn: "Cự Môn thuộc Thủy, Kim… hóa khí vi ám") (đã đọc); WC4 (Yin Water, secondary Earth) (đã đọc)*
- **[CHUNG-CT-TT-01]** **Thiên Tướng**: Thủy, Nam đẩu, "ấn tinh". Chủ về trách nhiệm, phụng sự, công bằng, hình thức chỉn chu; dễ chịu ảnh hưởng sao xung quanh. — *Nguồn: TT (Chư tinh vấn đáp — Thiên Tướng: "Thiên Tướng thuộc Thủy… hóa khí viết ấn") (đã đọc); WC4 (Yang Water) (đã đọc)*
- **[CHUNG-CT-TL-01]** **Thiên Lương**: Thổ, Nam đẩu, "ấm tinh", chủ thọ. Chủ về che chở, nâng đỡ người khác, đạo lý, vai trò người lớn, khả năng vượt khó. — *Nguồn: TT (Chư tinh vấn đáp — Thiên Lương: "Thiên Lương thuộc Thổ… ti thọ, hóa khí vi ấm vi phúc thọ") (đã đọc); WC4 (Yang Earth) (đã đọc)*
- **[CHUNG-CT-TS-01]** **Thất Sát**: Hỏa–Kim, Nam đẩu, tướng tinh. Chủ về quyết liệt, độc lập, dám làm, thích thử thách; dễ nóng vội. — *Nguồn: TT (Chư tinh vấn đáp — Thất Sát: "Thất Sát Nam đẩu đệ lục tinh dã, thuộc Hỏa, Kim") (đã đọc); WC4 (Yin Metal, secondary Fire) (đã đọc)*
- **[CHUNG-CT-PQ-01]** **Phá Quân**: Thủy, Bắc đẩu, "hao tinh". Chủ về phá cũ lập mới, thay đổi, tiên phong; chi tiêu và biến động lớn, cần kế hoạch dự phòng. — *Nguồn: TT (Chư tinh vấn đáp — Phá Quân: "Phá Quân thuộc Thủy… cố hóa khí viết hao") (đã đọc); WC4 (Yin Water) (đã đọc)*
- **[CHUNG-CT-NH-01]** Ngũ hành chính tinh giữa các nguồn có khác biệt nhỏ ở "hành kiêm" (Tham Lang Thủy/Mộc, Liêm Trinh Hỏa/Mộc, Thất Sát Kim/Hỏa); dùng hành chính theo Toàn Thư, chỉ nêu hành kiêm khi luận sinh khắc. — *Nguồn: TT (Chư tinh vấn đáp) (đã đọc); WC4 (đã đọc)*

---

### 0.3. Nhóm sao phụ (SP)

- **[CHUNG-SP-01]** **Lục cát tinh**: Tả Phù – Hữu Bật (trợ lực, người giúp), Văn Xương – Văn Khúc (học vấn, văn chương, thi cử), Thiên Khôi – Thiên Việt (quý nhân, cơ hội được nâng đỡ). Đi thành cặp, hội đủ đôi mạnh hơn lẻ. — *Nguồn: TT (Hình tính phú: "Tả Phụ Hữu Bật ôn lương quy mô… Thiên Khôi Thiên Việt cụ túc uy nghi"; Thái Vi phú: "Khôi Việt đồng hành, vị cư đài phụ") (đã đọc); TB*
- **[CHUNG-SP-02]** **Lục sát tinh**: Kình Dương – Đà La, Hỏa Tinh – Linh Tinh, Địa Không – Địa Kiếp. Chủ về áp lực, va chạm, biến động bất ngờ, hao tốn. Diễn đạt là "thách thức/cần chú ý", không phải điềm dữ. — *Nguồn: TT (Luận cách tinh số cao hạ: "tam giáp" là Kiếp Không, Hỏa Linh, Dương Đà; Phát vi luận: "Dương Đà Thất Sát hạn vận mạc phùng") (đã đọc); TB (lục sát tinh)*
- **[CHUNG-SP-03]** Sát tinh đắc địa có mặt tích cực (quyết đoán, dám làm, bứt phá): Kình Đà đắc ở Thìn Tuất Sửu Mùi; Hỏa Linh đắc Dần–Ngọ; Không Kiếp đắc Dần Thân Tỵ Hợi. Bộ Sát Phá Tham gặp sát tinh đắc địa được coi là hợp. — *Nguồn: SPEC (mục 6); TT (Thái Vi phú: "Thất Sát Phá Quân chuyên y Dương Linh") (đã đọc)*
- **[CHUNG-SP-04]** **Lộc Tồn**: chủ tài lộc ổn định, giữ của, tính thận trọng; luôn bị Kình Dương, Đà La kẹp hai bên. — *Nguồn: TT (Thái Vi phú: "Lộc Tồn thủ ư điền tài, đôi kim tích ngọc") (đã đọc); SPEC (mục 5.1, vòng Lộc Tồn)*
- **[CHUNG-SP-05]** **Thiên Mã**: chủ di chuyển, thay đổi, năng động. Mã gặp Lộc (Lộc Tồn hoặc Hóa Lộc) là "Lộc Mã giao trì": vận động sinh tài. Mã gặp Tuần Triệt hoặc không vong: dễ bôn ba mà ít kết quả, cần định hướng. — *Nguồn: TT (Thái Vi phú: "Mã ngộ không vong, chung thân bôn tẩu"; "Mã đầu đới kiếm"; Định bần tiện cục: "Mã lạc không vong") (đã đọc); TB*
- **[CHUNG-SP-06]** **Đào Hoa – Hồng Loan – Thiên Hỷ**: chủ duyên, sức hút, giao tiếp, niềm vui, chuyện tình cảm và hỷ sự. KL tách: Đào Hoa thiên về sức hút, vật chất; Hồng Loan cởi mở, thiên về tinh thần; Thiên Hỷ may mắn, công danh, cưới hỏi. — *Nguồn: KL (mục "Đào hoa – Hồng loan – Thiên hỷ": "ba sao vui vẻ, may mắn, tình cảm… Hồng loan vui vẻ cởi mở thiên về tinh thần") (bản quét archive.org, đã đọc); TB; NL*
- **[CHUNG-SP-07]** **Tam Hóa (Khoa, Quyền, Lộc) hội tứ chính**: tăng danh, quyền, lộc cho cung. — *Nguồn: TT (Hình tính phú: "Quyền Lộc nãi cửu khiếu chi kỳ"; Cốt tủy phú "Khoa Quyền Lộc củng") (đã đọc); TB*
- **[CHUNG-SP-08]** Nhóm sao trợ giúp phái Việt hay dùng: Tam Thai – Bát Tọa, Ân Quang – Thiên Quý, Long Trì – Phượng Các, Thai Phụ – Phong Cáo (danh dự, học vấn, được giúp đỡ); Thiên Hình – Thiên Riêu, Thiên Khốc – Thiên Hư, Cô Thần – Quả Tú (kỷ luật, cảm xúc, nhu cầu riêng tư). Đây là sao tăng giảm mức độ, không quyết định cung. — *Nguồn: SPEC (mục 5.14 danh mục sao); TB; NL (tập 1: trung tinh "để tô điểm cho tượng hình thêm khởi sắc (Long Phượng Thai Tọa Quang Quí)") (bản quét, đã đọc)*
- **[CHUNG-SP-09]** Vòng Tràng Sinh, vòng Bác Sĩ, vòng Thái Tuế: chỉ dùng tô thêm, không đặt làm kết luận chính. — *Nguồn: TB; SPEC (mục 5.1–5.3). KL lại coi trọng vòng Lộc Tồn, Thái Tuế, Tràng Sinh như một bước xem riêng ("Coi các vòng Lộc tồn Thái tuế và Trường sinh") (bản quét, đã đọc); mặc định vẫn giữ PP-10.* ⚑1nguồn
- **[CHUNG-SP-10]** **Độ sáng sát tinh** (dùng đúng bảng, không tự suy): Kình Dương, Đà La đắc ở Thìn Tuất Sửu Mùi, hãm các cung còn lại; Hỏa Tinh, Linh Tinh đắc Dần Mão Thìn Tỵ Ngọ, bình Sửu Mùi, hãm Thân Dậu Tuất Hợi Tý; Địa Không, Địa Kiếp đắc Dần Thân Tỵ Hợi, hãm các cung còn lại. — *Nguồn: SPEC (mục 6, bảng độ sáng); KL (bản quét archive.org, đã đọc: "Không Kiếp đắc địa ở tứ sinh (Dần Thân Tỵ Hợi)"; "Kình dương, Đà la đắc địa" ở tứ mộ)*
- **[CHUNG-SP-11]** **Kiếp Sát** (an theo chi năm, luôn ở tứ sinh Dần Thân Tỵ Hợi): sát tinh nhỏ, chủ tính nóng vội, quyết liệt, dám làm; đi với Thất Sát là "song sát", việc gì cũng dám làm. Diễn đạt: "quyết đoán nhưng dễ vội; nên cẩn thận khi làm việc với máy móc, vật sắc, và khi ra quyết định gấp". KL coi Kiếp Sát nhẹ hơn lục sát; NL xếp Kiếp Sát, Lưu Hà vào nhóm có thể "lấn lướt lục sát" (xem TRANH-11). — *Nguồn: KL (bản quét archive.org, đã đọc: mục "Kiếp sát – Phá toái – Lưu hà": "khao khát nóng vội… đi với Thất sát là cách song sát chuyện gì cũng dám làm"); NL (tập 1: "Thiên Hình, Hoá Kỵ, Kiếp Sát, Lưu Hà có những quyền cước có thể lợi hại lấn lướt lục sát") (bản quét, đã đọc) (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-SP-12]** **Lưu Hà** (an theo can năm, hành Thủy): mặt tích cực là lưu loát, hùng biện, có tài thuyết phục; mặt cần chú ý là dễ dùng lời lẽ, mưu tính quá mức. Lưu Hà gặp Thanh Long là "rồng gặp nước", báo cơ hội tốt; Lưu Hà gặp Cự Môn, Hóa Kỵ: nên cẩn trọng khi đi sông nước, bơi lội. — *Nguồn: KL (bản quét archive.org, đã đọc: mục "Lưu hà": "lưu loát, hùng biện… Lưu hà, Thanh long: rồng xanh vùng vẫy trên sông là vận hội tốt"; mục cách "Thanh long, Lưu hà"); NL (tập 2: "sát tinh như Thiên Hình (Kim) Lưu Hà (Thuỷ) Kiếp sát (Hoả)") (bản quét, đã đọc) (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-SP-13]** **Kiếp Sát, Lưu Hà với Lộc Tồn**: hai sao này được coi là khắc Lộc Tồn; Lộc Tồn đồng cung hoặc hội chiếu với Kiếp Sát, Lưu Hà thì tài lộc khó bền, dễ được rồi hao. Diễn đạt: "kiếm được nhưng cần kỷ luật giữ tiền, tránh đầu tư liều". — *Nguồn: KL (bản quét archive.org, đã đọc: mục "Lưu hà và Kiếp sát": "Hà Sát là hai đại khắc tinh của Lộc tồn… Cung Tài có tam hợp hay xung chiếu Kiếp sát, Lưu hà với Lộc tồn"); NL (tập 2: "Lộc Tồn… không bền… là trường hợp Lộc Tồn có Lưu Hà, Kiếp sát canh chừng") (bản quét, đã đọc) (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-SP-14]** **Bộ giải thần** (Thiên Giải, Địa Giải, Giải Thần) và **Tứ đức** (Thiên Đức, Nguyệt Đức, Long Đức, Phúc Đức): sao cứu giải nhẹ. KL xếp Hóa Khoa là "đệ nhất giải thần", Thiên Giải cứu giải tương đối, Địa Giải, Giải Thần, Tứ đức cứu giải nhỏ. Diễn đạt: "khi gặp khó dễ có người giúp hoặc có lối tháo gỡ; hiệu quả tùy cách mình sống và ứng xử". Không dùng làm kết luận chính, không gợi ý cúng bái. — *Nguồn: KL (bản quét archive.org, đã đọc: "Cứu giải mạnh tương đối: Thiên tài, Quang Quí, Tả Hữu, Thiên giải. Cứu giải nhỏ: Địa giải, Giải thần, Thiên đức, Nguyệt đức…"; Thiên Giải, Địa Giải "cứu giải chung chung"); NL (tập 1: "Thiên Quan, Thiên Phúc quí nhân, Thiên Đức, Nguyệt Đức, Long đức, Phúc đức, Giải Thần… nhưng không sức mạnh quyền uy như Thiên Ất") (bản quét, đã đọc)*
- **[CHUNG-SP-15]** **Tứ đức** còn chỉ tính cẩn trọng, hướng thiện, quan tâm đời sống tinh thần. KL lưu ý: có Tứ đức không phải điều đáng mừng sẵn mà là lời nhắc tự bồi đắp đức tính; ba sao Thiên Đức, Nguyệt Đức, Phúc Đức luôn ở tam hợp Thiếu Dương (cùng Thiên Không), nên có tác dụng cân bằng Thiên Không. — *Nguồn: KL (bản quét archive.org, đã đọc: mục "Bộ sao Tứ Đức"; mục "Nguyệt đức – Thiên đức": "chủ về hối cải, tín ngưỡng… còn thiếu sót nhân đức, cần phải nghĩ cách bồi đắp"); NL (tập 2: "Gác bỏ mọi phù vân lần bước theo tứ đức… vì Thiên Không bao giờ cũng…") (bản quét, đã đọc)*
- **[CHUNG-SP-16]** **Thiên Quan – Thiên Phúc**: phúc tinh (cùng hành Hỏa theo KL), chủ thiện tâm, giúp người, niềm tin tâm linh; Thiên Quan cứu giải mạnh hơn Thiên Phúc. Gặp Thiên Tướng, Thiên Y, Thiên Riêu: hợp nghề chăm sóc sức khỏe (QUAN-CC-06). NL3 còn coi cung có Quan Phúc là nơi "cần suy nghĩ mà xử lý" (sao báo cần cẩn trọng). — *Nguồn: KL (bản quét archive.org, đã đọc: mục "Thiên quan – Thiên phúc": "Cứu giải, đức độ… Quan Phúc, Tướng, Riêu – Y: bác sĩ mát tay"; "Thiên quan cũng làm phúc, cứu giải mạnh hơn"); NL (tập 1: "Thiên Quan = (dương Hỏa) giải trừ uẩn khúc. Thiên Phúc = (âm Thổ) thực hiện từ thiện"; tập 3) (bản quét, đã đọc)*
- **[CHUNG-SP-17]** **Thiên Y** (an theo tháng, luôn đồng cung Thiên Riêu): chủ thuốc men, nghề y dược, tính sạch sẽ, cẩn trọng. Riêu–Y ở Mệnh: nhạy cảm, trực giác tốt, nên chú ý chăm sóc sức khỏe định kỳ; với Thiên Tướng, Thiên Quan, Thiên Phúc: hợp nghề y, chăm sóc. Ở Phu Thê, Quan Lộc chỉ tô thêm: người bạn đời hoặc môi trường làm việc gắn với chăm sóc, sức khỏe. — *Nguồn: KL (bản quét archive.org, đã đọc: mục "Thiên y": "sao cứu giải bệnh tật, chủ việc thuốc men, nghề y dược… Thiên y luôn luôn ở đồng cung với Thiên riêu"). (Câu ở Phu Thê, Quan Lộc là nhận xét nhóm.)* ⚑1nguồn
- **[CHUNG-SP-18]** **Thiên Nguyệt**: không có mục riêng trong TT, KL; NL chỉ nhắc "Thiên Nguyệt Đức" (chỉ Thiên Đức, Nguyệt Đức). Bộ luận **không luận** Thiên Nguyệt; nếu có trên lá số thì bỏ qua, không suy diễn. — *Nguồn: kết quả tra TT (Wikisource), KL, NL (bản quét) ngày 30/10/2026: không có quy tắc (đã đọc)*

---

### 0.4. Tứ hóa (HOA)

- **[CHUNG-HOA-01]** Tứ hóa an theo can năm sinh (bảng SPEC mục 5.8, phái Việt); Hóa nằm cùng cung với sao được hóa. — *Nguồn: SPEC (mục 5.8, 10.4); WC3 (Tứ hóa theo thiên can năm) (đã đọc)*
- **[CHUNG-HOA-02]** Ý nghĩa chung: **Hóa Lộc** mở ra, cung cấp, thuận lợi tài lộc và cơ hội; **Hóa Quyền** quyền hạn, sức mạnh, chủ động; **Hóa Khoa** danh tiếng, được công nhận, học vấn, gặp người giúp; **Hóa Kỵ** ràng buộc, trở ngại, điều khiến mình bận tâm nhiều. — *Nguồn: WC5 (Hua Lu "opens and supplies", Hua Quan "grants authority", Hua Ke "recognition and reputation", Hua Ji "binds, obstructs and holds attention") (đã đọc); TB; TT (Thái Vi phú: "Lộc phùng xung phá, cát xứ tàng hung") (đã đọc)*
- **[CHUNG-HOA-03]** Hóa Kỵ diễn đạt là "lĩnh vực cần đầu tư công sức, dễ vướng bận, nên chủ động chuẩn bị", tuyệt đối không viết như điềm dữ. Hóa Kỵ cùng sao ám (Cự Môn) ở Mệnh/Thân/Tật: sách gốc diễn đạt nặng, chỉ nói "nên chú ý sức khỏe tinh thần, nghỉ ngơi". — *Nguồn: TT (Thái Vi phú: "Kỵ ám đồng cư thân mệnh tật ách…") (đã đọc) (sách gốc diễn đạt nặng, đã trung tính hóa); QUY-UOC*
- **[CHUNG-HOA-04]** Tứ hóa bản mệnh (can năm sinh) khác Tứ hóa đại vận, lưu niên; phần luận 12 cung chỉ dùng Tứ hóa bản mệnh, không trộn với hóa của vận. — *Nguồn: WC5 (phân biệt natal và decade/annual) (đã đọc); WC3 (Trung Châu có quy tắc hóa riêng cho đại vận, lưu niên) (đã đọc)*
- **[CHUNG-HOA-05]** Khoa Quyền Lộc hãm hoặc gặp sát: tác dụng giảm ("công danh lận đận"), diễn đạt là "thành quả đến chậm, cần kiên trì". — *Nguồn: TT (Phát vi luận: "Khoa Quyền hãm ư hung hương công danh thặng đặng") (đã đọc); NL*
- **[CHUNG-HOA-06]** **Hóa mang tính của sao bị hóa**: Tứ hóa biểu hiện cách ứng xử của mình theo tính chất chính tinh được hóa; luận "<sao> hóa <Lộc/Quyền/Khoa/Kỵ>" = tính sao (mục 0.2) × nghĩa của hóa (HOA-02) × lĩnh vực của cung. Ví dụ KL: Liêm Trinh hóa Lộc là "tác phong nghiêm chỉnh như Liêm Trinh thì mới có lộc", Thái Dương hóa Kỵ là "lên mặt ta đây thì bị chê bai". — *Nguồn: KL (bản quét archive.org, đã đọc: mục "Sao Tứ hóa": "Tứ hóa là các hóa tinh biểu hiện thái độ và cách ứng xử của mình khi gặp hoàn cảnh của những sao mình hóa ra"); TT (Đẩu số chuẩn thằng / quyển 2: "như Giáp sinh nhân Liêm Trinh hóa Lộc, Phá Quân hóa Quyền, Vũ Khúc hóa Khoa, Thái Dương hóa Kỵ") (đã đọc)*
- **[CHUNG-HOA-07]** **Cung có cả cát hóa và Hóa Kỵ** (Lộc hoặc Quyền đồng cung Kỵ, nhất là thêm Kình Dương, Hỏa, Linh, Không): việc làm có tiến có lùi, được nhanh mất nhanh, khó bền; diễn đạt "thành quả lên xuống, cần giữ nhịp đều và dự phòng". KL nhấn Kỵ nặng: "ba sao tốt cộng lại cũng chỉ mạnh bằng một Hóa Kỵ". — *Nguồn: TT (quyển 2, Hóa Kỵ: "Quyền Lộc dữ Kỵ đồng cung hựu kiêm Dương Hỏa Linh Không, tác sự tiến thoái, hoành phát hoành phá") (đã đọc); KL (bản quét archive.org, đã đọc: "Ba sao tốt, Lộc Quyền Khoa cộng lại cũng chỉ mạnh bằng một sao xấu Hóa ky") (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-HOA-08]** **Hóa Kỵ được cát tinh cứu**: Kỵ gặp Tử Phủ, Xương Khúc, Hóa Khoa hoặc cát tinh hội chiếu thì nhẹ đi; Hóa Khoa là "đệ nhất giải thần". Kỵ gặp thêm sát tinh thì nặng hơn. — *Nguồn: TT (quyển 2, Hóa Kỵ: "như ngộ Tử Phủ Xương Khúc đồng cát lợi"; "nhược đắc cát tinh lai trợ cứu") (đã đọc); KL (bản quét archive.org, đã đọc: "Hóa khoa được coi là sao cứu giải mạnh nhất, đệ nhất giải thần") (sách gốc diễn đạt nặng, đã trung tính hóa)*

Chính tinh khi hóa (bảng Tứ hóa phái Việt, SPEC mục 5.8). Nghĩa "phải… thì mới…" là cách KL diễn giải (mục "Lộc Quyền Khoa Kỵ theo tuổi"); dùng làm gợi ý phát huy, không phán định.
- **[CHUNG-HOA-TV-01]** **Tử Vi** hóa Khoa (tuổi Ất): được tiếng nhờ sự đàng hoàng, chững chạc; hóa Quyền (tuổi Nhâm): có địa vị khi giữ phong thái đường hoàng. Tử Vi gặp Thất Sát thì "hóa quyền", biến sức mạnh thành uy. — *Nguồn: KL (bản quét archive.org, đã đọc: "Tử vi hóa ra Hóa khoa, nghĩa là muốn cứu giải phải đàng hoàng"; "Tử vi, tỏ ra đàng hoàng thì có địa vị"); TT (Chư tinh vấn đáp — Thất Sát: "ngộ Tử Vi tắc hóa quyền giáng phúc") (đã đọc)*
- **[CHUNG-HOA-TCO-01]** **Thiên Cơ** hóa Lộc (Ất): có lộc nhờ tính toán kỹ; hóa Quyền (Bính): có quyền nhờ khéo léo, tính kỹ; hóa Khoa (Đinh): nổi danh nhờ kiến thức, tay nghề; hóa Kỵ (Mậu): dễ bị chê vì tính toán chi li, mưu tính quá; ở cung yếu thì dù có Tài Quan tốt cũng kém vinh. Diễn đạt Kỵ: "nghĩ nhiều, hay đổi ý; nên chốt kế hoạch và làm đến cùng". — *Nguồn: KL (bản quét archive.org, đã đọc: Tuổi Ất "Thiên cơ… phải tính toán kỹ như Thiên cơ thì có lộc"; Tuổi Mậu "Thiên Cơ: mưu mô bủn xỉn thì bị ghét"); TT (quyển 2: "Thiên Cơ hóa Kỵ lạc nhàn cung, túng hữu tài quan diệc bất vinh") (đã đọc) (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-HOA-TDU-01]** **Thái Dương** hóa Lộc (Canh): có lộc khi sáng suốt, dám thể hiện; hóa Quyền (Tân): có địa vị khi biết thể hiện; hóa Kỵ (Giáp): dễ bị ganh ghét nếu tỏ ra hơn người. Thái Dương sáng (Dần đến Ngọ) hóa Kỵ thì nhẹ, TT còn coi là thuận; ở Sửu Mùi Kỵ làm Thái Dương sáng thêm; Thái Dương hãm hóa Kỵ là nặng nhất, diễn đạt "cần chú ý quan hệ với người nam, cấp trên và chăm sóc mắt". — *Nguồn: TT (quyển 2, Hóa Kỵ: "nhược Thái Dương tại Dần Mão Thìn Tỵ Ngọ hóa Kỵ… vi phúc luận. Nhược Nhật Nguyệt hãm địa hóa Kỵ, chủ đại hung") (đã đọc); KL (bản quét archive.org, đã đọc: "Thái dương gặp Hóa ky thì xấu lắm chỉ trừ khi ở Sửu, Mùi được Hóa ky làm cho sáng ra"; Tuổi Giáp "nếu kiêu căng thì người đời ghen ghét") (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-HOA-VK-01]** **Vũ Khúc** hóa Khoa (Giáp): nổi danh nhờ óc kinh tài; hóa Lộc (Kỷ): có lộc nhờ đầu óc kinh doanh; hóa Quyền (Canh): có quyền khi giỏi tài chính, "lợi cầu mưu sự hữu thành"; hóa Kỵ (Nhâm): quá tính toán lợi lộc thì khó thành, tiền bạc dễ vướng. Vũ Khúc hoặc Tham Lang hóa Kỵ ở Mệnh tại tứ sinh, tứ mộ, có sát tinh: hợp nghề đòi tay nghề tinh xảo, kỹ thuật. — *Nguồn: KL (bản quét archive.org, đã đọc: Tuổi Kỷ "Vũ khúc, có đầu óc kinh doanh thì có lộc"; Tuổi Nhâm "Vũ khúc, quá mưu mô, lý tài thì không thành công"); TT (quyển 2: "Vũ Khúc lâm hạn hóa Quyền tinh, tối lợi cầu mưu sự hữu thành"; quyển 1: "Dần Thân Tỵ Hợi an mệnh hoặc Sửu Mùi Thìn Tuất ngộ hữu Tham Lang Vũ Khúc tại mệnh hóa Kỵ gia sát, tất tác tế xảo nghệ thuật chi nhân") (đã đọc)*
- **[CHUNG-HOA-TD-01]** **Thiên Đồng** hóa Lộc (Bính): có lộc nhờ uyển chuyển, mềm mỏng; hóa Quyền (Đinh): có quyền nhờ khéo léo; hóa Khoa (Canh, bảng Việt): có danh nhờ sự khéo léo, hòa nhã. Phái Việt không có Thiên Đồng hóa Kỵ (bảng Trung Quốc có, tuổi Canh; xem TRANH-10). — *Nguồn: KL (bản quét archive.org, đã đọc: Tuổi Bính "Thiên Đồng… muốn có Lộc phải uyển chuyển, mềm mỏng"; Tuổi Đinh; Tuổi Canh "Thiên đồng: uyển chuyển khéo léo thì có danh"); TT (Chư tinh vấn đáp — Thiên Đồng: "hóa lộc vi thiện, phùng cát vi tường") (đã đọc)*
- **[CHUNG-HOA-LT-01]** **Liêm Trinh** hóa Lộc (Giáp): có lộc nhờ tác phong nghiêm chỉnh, tích cực; hóa Kỵ (Bính): dễ bị chê nếu nóng vội, xen vào việc người. KL: Liêm Trinh rất sợ Hóa Kỵ; nhưng Kỵ đồng cung Liêm Tham ở Tỵ Hợi lại chế được mặt xấu của Liêm Tham, và TT ghi Liêm Trinh hóa Kỵ ở Hợi, người mệnh Thủy "không hại". Diễn đạt Kỵ: "giữ nguyên tắc nhưng mềm trong cách nói; cẩn trọng giấy tờ, hợp đồng". — *Nguồn: KL (bản quét archive.org, đã đọc: Tuổi Bính "Liêm trinh: lanh chanh, xỏ mồm như Liêm trinh chỉ bị người chê cười"; "Liêm trinh rất sợ Hóa ky"; "Hóa ky đồng cung với Liêm Tham tại Tỵ Hợi thì chế khắc được tai họa Liêm Tham gây ra"); TT (quyển 2: "như Liêm Trinh tại Hợi hóa Kỵ thị dã… hựu phùng Thủy mệnh nhân hóa Kỵ dã bất vi hại") (đã đọc) (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-HOA-TP-01]** **Thiên Phủ** hóa Khoa (tuổi Nhâm) chỉ có trong bảng phái Việt; KL và bảng Trung Quốc cho tuổi Nhâm hóa Khoa ở Tả Phù. Luận: thêm uy tín, được tin cậy về quản lý, giữ gìn; ghi chú khác biệt trường phái (TRANH-06). — *Nguồn: SPEC (mục 5.8, 10.4). KL (Tuổi Nhâm "Tả phụ, phải khéo léo, chăm chỉ mới có danh") ghi khác.* ⚑1nguồn
- **[CHUNG-HOA-TA-01]** **Thái Âm** hóa Lộc (Đinh): có lộc nhờ khôn ngoan, mềm dẻo; hóa Quyền (Mậu): có địa vị nhờ lanh lợi, TT: Thái Âm miếu hóa Quyền "thanh tú thông minh"; hóa Khoa (Quý): có danh nhờ mềm mỏng, khéo léo; hóa Kỵ (Ất, và Canh theo bảng Việt): dễ bị chê nếu quá nặng chuyện tiền. Thái Âm sáng (Dậu đến Tý) hóa Kỵ thì nhẹ, TT coi là thuận; ở Sửu Mùi Kỵ làm Nhật Nguyệt sáng thêm (MENH-HOA-05); Thái Âm hãm hóa Kỵ, nhất là Mệnh nữ: diễn đạt "cần chăm sóc đời sống cảm xúc, quan hệ với mẹ, người nữ trong nhà". — *Nguồn: TT (quyển 2: "Thái Âm tại Dậu Tuất Hợi Tý hóa Kỵ vi phúc luận"; "Thái Âm nhập miếu hóa Quyền tinh, thanh tú thông minh") (đã đọc); KL (bản quét archive.org, đã đọc: Tuổi Ất "Nguyệt hóa ra Hóa ky, tham tiền quá thì nguy"; "Đàn bà rất sợ mệnh có Thái âm gặp Hóa ky") (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-HOA-THL-01]** **Tham Lang** hóa Lộc (Mậu): có lộc nhờ tham vọng, biết tính kế; TT: Tham hóa Lộc ở tứ mộ "dù gặp cát cũng chỉ trung bình"; hóa Quyền (Kỷ): có quyền nhờ tham vọng; hóa Kỵ (Quý): chạy theo ham muốn, tiền bạc quá thì khổ. Tham Lang hóa Kỵ ở tứ mộ: làm ăn nhiều việc nhưng có thể khá giả; ở tứ sinh, tứ mộ có sát tinh: hợp nghề tay nghề tinh xảo (HOA-VK-01). Tham Lang hóa Kỵ gặp Thiên Riêu: dễ vướng tai tiếng chuyện tình, tiền. Diễn đạt Kỵ ở Mệnh: "mong muốn lớn, dễ không thỏa; nên chọn một mục tiêu chính, cẩn trọng trong quan hệ tình cảm và tiền bạc". — *Nguồn: KL (bản quét archive.org, đã đọc: Tuổi Quý "Tham lang, tham lam quá, chạy theo tiền thì sẽ khổ"; "Tham Ky ở Tứ mộ buôn bán đa đoan nhưng giàu có"; "Tham lang ghét Riêu Ky… dễ bị tai tiếng… vì tình và tiền"); TT (quyển 1: "Tham Lang Vũ Khúc tại mệnh hóa Kỵ gia sát, tất tác tế xảo nghệ thuật chi nhân"; quyển 2: "Tham Lang hóa Lộc cư tứ mộ, túng nhiên ngộ cát diệc trung bình") (đã đọc) (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-HOA-CM-01]** **Cự Môn** hóa Lộc (Tân): có lộc nhờ ăn nói đanh thép, biện luận giỏi; hóa Quyền (Quý): có địa vị nhờ thuyết phục, TT: "tối hỷ cầu mưu vạn sự thành"; hóa Kỵ (Đinh): tranh cãi, nói nhiều dễ bị ghét. Cự Môn hóa Kỵ ở Sửu Mùi: KL coi là cách giàu sang; ở Mệnh, Thân, Tật thì theo HOA-03. Diễn đạt Kỵ: "chú ý lời nói, tránh tranh cãi; hợp nghề cần phân tích, phản biện". — *Nguồn: KL (bản quét archive.org, đã đọc: Tuổi Đinh "Cự môn: tranh cãi, to mồm như Cự môn thì chỉ tổ bị ghét"; Tuổi Tân; cách "Hóa ky Sửu Mùi… Mệnh có Cự môn gặp Hóa ky đồng cung ở Sửu Mùi"); TT (quyển 2: "Cự Môn chủ hạn hóa Quyền tinh, tối hỷ cầu mưu vạn sự thành"; Thái Vi phú "Kỵ ám đồng cư thân mệnh tật ách") (đã đọc)*
- **[CHUNG-HOA-TL-01]** **Thiên Lương** hóa Quyền (Ất): có quyền khi kín đáo, hiền hậu; hóa Khoa (Kỷ): được danh nhờ nhu thuận, hiền hậu; hóa Lộc (Nhâm): có lộc khi biết giữ miệng; Hóa Lộc đi cùng Thiên Lương thì "càng giàu thêm". Thiên Lương không hóa Kỵ. — *Nguồn: KL (bản quét archive.org, đã đọc: Tuổi Ất "Thiên lương hóa thành Hóa quyền nghĩa là phải kín đáo, hiền hậu thì có quyền"; Tuổi Kỷ; Tuổi Nhâm "Thiên Lương, ngậm miệng thì có lộc"; mục Hóa lộc).* ⚑1nguồn
- **[CHUNG-HOA-PQ-01]** **Phá Quân** hóa Quyền (Giáp): có địa vị khi dám liều, dám làm; hóa Lộc (Quý): có lộc nhờ mạnh dạn xông pha. TT: Phá Quân "hóa Lộc Khoa Quyền hỷ dị thường", nhưng hãm địa lại thêm sát thì dễ phải rời gốc, đi xa lập nghiệp. Phá Quân không hóa Kỵ. — *Nguồn: KL (bản quét archive.org, đã đọc: Tuổi Giáp "Phá quân: tuổi Giáp phải liều lĩnh như Phá quân, mới có địa vị"; Tuổi Quý "Phá quân, sẽ có lộc nếu mạnh dạn xông xáo"); TT (quyển 2: "Phá Quân nhất diệu tối nan đương, hóa Lộc Khoa Quyền hỷ dị thường; nhược hoàn hãm địa nhưng gia sát, phá tổ ly tông xuất viễn hương") (đã đọc)*
- **[CHUNG-HOA-XK-01]** **Văn Xương, Văn Khúc**: Xương hóa Khoa (Bính), Khúc hóa Khoa (Tân): có danh nhờ học vấn, một nghề chuyên môn; Khúc hóa Kỵ (Kỷ), Xương hóa Kỵ (Tân): làm ra vẻ học thức, khôn ngoan quá thì bị ghét; Xương Khúc không sợ sát tinh, chỉ sợ Hóa Kỵ (học hành, thi cử, giấy tờ dễ trục trặc). — *Nguồn: KL (bản quét archive.org, đã đọc: Tuổi Bính, Kỷ, Tân; mục Xương Khúc: "Xương Khúc không sợ Sát tinh, chỉ sợ Hóa Ky"; "Xương Khúc, Tuần Triệt hay Hóa Ky: thi cử lận đận"); TT (Chư tinh vấn đáp — Văn Xương: "Văn Xương chủ khoa giáp"; Văn Khúc: "chủ khoa giáp văn xa chi tú") (đã đọc). (TT xác nhận phần Khoa và học vấn; phần Kỵ chỉ theo KL.)*

---

### 0.5. Tuần, Triệt (TUAN)

- **[CHUNG-TUAN-01]** Cách an: Tuần theo tuần giáp của can chi năm sinh, Triệt theo can năm; phái Việt đặt mỗi sao ở **vạch giữa hai cung**, ảnh hưởng cả hai. — *Nguồn: SPEC (mục 5.12, 10.15); TB*
- **[CHUNG-TUAN-02]** Tuần Triệt không đổi tính chất sao, chỉ làm tăng hoặc giảm cường độ: sao tốt (miếu vượng, cát tinh) bị giảm; sao xấu (hãm, sát tinh) bớt xấu, có khi chuyển tốt. — *Nguồn: WC6 ("Tuần – Triệt không làm thay đổi tính chất các sao, mà chỉ làm tăng lên hoặc giảm đi ảnh hưởng") (đã đọc); WC7 ("Sao hãm địa gặp Tuần Triệt thì lại bớt xấu đi, hoặc trở thành tốt") (đã đọc); TT (Hình tính phú: "Sát lạc không vong cánh vô uy lực") (đã đọc)*
- **[CHUNG-TUAN-03]** Thời điểm: phái Việt cho rằng Triệt thể hiện rõ ở giai đoạn đầu đời rồi nhẹ dần, Tuần ít rõ thời trẻ và rõ dần về sau; một số sách nêu mốc tuổi cụ thể nhưng không thống nhất. Bộ luận **không nêu tuổi cụ thể** (kể cả cho cung Thân), chỉ dùng mẫu câu TUAN-09. — *Nguồn: WC6 (đã đọc); WC7 (đã đọc); NL (tập 3: "Mệnh hay Thân từ sơ sanh đã bị Tuần hay Triệt kìm hãm, nay gặp được giai đoạn tháo gỡ") (bản quét, đã đọc). (Sửa 30/10/2026: bỏ mốc "30 tuổi" vì mâu thuẫn MENH-TRANH-07, PHU-YN-05.)*
- **[CHUNG-TUAN-04]** Toàn Thư coi "không vong" là điểm cần xem kỹ nhất ở Mệnh, Thân, Lộc, Mã; trong đó Thiên Không, Triệt không nặng hơn Tuần không. — *Nguồn: TT (Đàm tinh yếu luận: "Lộc Mã bất lạc không vong, Thiên Không Tiệt Không tối khẩn, Tuần Không thứ chi") (đã đọc); WC6 (thứ tự mạnh yếu theo tuổi) (đã đọc)*
- **[CHUNG-TUAN-05]** Diễn đạt Tuần Triệt ở cung tốt: "thuận lợi đến chậm hơn, cần tự lực"; ở cung xấu: "thách thức được giảm nhẹ". Không dùng các từ "bị chặn đứng", "mất hết". — *Nguồn: QUY-UOC (giọng văn); WC6 (đã đọc)*
- **[CHUNG-TUAN-06]** **Cung có cả sao tốt và sao xấu (kể cả Hóa Kỵ) gặp Tuần hoặc Triệt**: áp dụng TUAN-02 cho từng sao, không chọn một chiều. Kết quả: cả mặt mạnh lẫn mặt vướng đều dịu đi, "biên độ hẹp lại" (ít bứt phá lớn, ít vấp lớn). Viết: "điểm mạnh … cần thời gian để bộc lộ; điểm vướng … cũng nhẹ hơn". — *Nguồn: KL (bản quét archive.org, đã đọc: Tuần Triệt "biến tốt thành tương đối xấu, xấu thành tương đối tốt"); WC7 ("Sao hãm địa gặp Tuần Triệt thì lại bớt xấu đi") (đã đọc)*
- **[CHUNG-TUAN-07]** **Mệnh hoặc Thân gặp Tuần, Triệt**: khởi đầu chậm, việc phải làm nhiều lần mới thông; thuận hơn khi đến giai đoạn vận có Tuần (với Mệnh/Thân bị Triệt) hoặc Triệt (với Mệnh/Thân bị Tuần) "tháo gỡ". Diễn đạt: "đường đi đầu có nhiều lần làm lại; bền bỉ thì về sau thông suốt hơn". Không nêu tuổi (TUAN-03). — *Nguồn: NL (tập 2: "Mệnh hay Thân bị Tuần thì khi gặp Triệt tháo gỡ, hay Mệnh, Thân bị Triệt gặp Tuần mới cởi mở"; tập 3: "Mệnh hay Thân bị Tuần hay Triệt chận đầu, chờ đến thời gian gặp Tuần hay Triệt còn lại cởi mở mới đắc ý") (bản quét, đã đọc); KL (bản quét archive.org, đã đọc: Tuần Triệt ở Mệnh "tuổi trẻ bôn ba") (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-TUAN-08]** **Lộc Tồn gặp Tuần, Triệt** ("Lộc phùng không"): tài lộc khó tích lũy, dễ vào rồi ra; diễn đạt "kiếm được nhưng cần kỷ luật tài chính, tự lực, tránh trông chờ thừa hưởng". Nếu Lộc Tồn ở cung Thân hoặc Phu Thê thì áp dụng cho lĩnh vực cung đó. — *Nguồn: KL (bản quét archive.org, đã đọc: "Tuần Triệt bất khả ngộ Lộc tồn, tư cơ phá hoại: Lộc tồn gặp Tuần Triệt thì cơ nghiệp chẳng còn"); NL (tập 1: "Lộc tồn bị Tuần chặn nghẹt"; "Lộc Tồn thường trực có Tuần đóng kín… tay làm hàm nhai") (bản quét, đã đọc); TT (Đàm tinh yếu luận: "Lộc Mã bất lạc không vong") (đã đọc) (sách gốc diễn đạt nặng, đã trung tính hóa)*
- **[CHUNG-TUAN-09]** **Mẫu câu thời điểm dùng chung** cho Tuần, Triệt, cung Thân và mọi yếu tố "sớm/muộn": "Ảnh hưởng này thường rõ hơn ở giai đoạn đầu đời (Triệt) / về sau (Tuần, cung Thân); mỗi người cảm nhận khác nhau tùy hoàn cảnh và nỗ lực." Không viết số tuổi, không viết "sau 30 tuổi mới…". — *Nguồn: QUY-UOC (không phán định mệnh cố định); MENH-TRANH-07, PHU-YN-05 (quy ước của bộ luận). (Quy ước nhóm.)*

---

### 0.6. Vô chính diệu (VCD)

- **[CHUNG-VCD-01]** Cung không có chính tinh: mượn chính tinh của cung xung chiếu để luận, lực yếu hơn chính tinh tọa thủ; xét thêm tam hợp và sao phụ tại cung. — *Nguồn: TB; NL; TT (Luận cách tinh số cao hạ: "Mệnh cung vô chính diệu giả, Tài Quan nhị cung hữu cát tinh củng chiếu, phú quý toàn mỹ") (đã đọc)*
- **[CHUNG-VCD-02]** Vô chính diệu có cát tinh hội chiếu ở tam phương vẫn có thể tốt; vô chính diệu không cát tinh: sách gốc diễn đạt rất nặng ("Mệnh vô chính diệu…"), chỉ nói "cần xây nền tảng, dễ chịu ảnh hưởng môi trường". — *Nguồn: TT (Cốt tủy phú: "Mệnh vô chính diệu…") (đã đọc) (sách gốc diễn đạt nặng, đã trung tính hóa); TT (Luận cách tinh số cao hạ, câu ở VCD-01) (đã đọc)*
- **[CHUNG-VCD-03]** Vô chính diệu gặp Tuần hoặc Triệt, hoặc Tam Không (Thiên Không, Địa Không, Tuần/Triệt) là ngoại lệ được phái Việt coi là thuận; Phúc Đức vô chính diệu "nên gặp Tuần, kỵ Triệt". — *Nguồn: WC6 (phú "Phúc vô chính diệu, tu cần Không tý, kỵ ngộ Triệt Tinh") (đã đọc); WC7 (Mệnh vô chính diệu, Tam Không) (đã đọc)*

---

### 0.7. Cách cục lớn dùng chung (CC)

Bốn bộ chính tinh theo tam hợp (các sao luôn đứng tam hợp/xung chiếu với nhau do cách an ở SPEC mục 4). Điều kiện chi tiết từng cung do nhóm cung ghi.

- **[CHUNG-CC-01]** **Tử Phủ Vũ Tướng**: thiên về ổn định, quản lý, tổ chức, tài chính; phát huy tốt khi có Tả Hữu, Tam Hóa. **Tử Phủ đồng cung** (Dần, Thân) là cách phúc hậu bền lâu. — *Nguồn: TT (Cốt tủy phú: "Tử Phủ đồng cung chung thân phúc hậu"; Thái Vi phú: "Tử Vi Thiên Phủ toàn y Phụ Bật chi công") (đã đọc); TB*
- **[CHUNG-CC-02]** **Sát Phá Tham** (thêm Liêm Trinh: Sát Phá Liêm Tham): thiên về hành động, khai phá, thay đổi, hợp môi trường cạnh tranh và đi xa; hợp sát tinh đắc địa. — *Nguồn: TT (Cốt tủy phú: "Thất Sát Phá Quân nghi xuất ngoại"; Thái Vi phú: "Thất Sát Phá Quân chuyên y Dương Linh") (đã đọc); TB*
- **[CHUNG-CC-03]** **Cơ Nguyệt Đồng Lương**: thiên về trí tuệ, chuyên môn, công việc ổn định trong tổ chức (hành chính, giáo dục, dịch vụ, nghiên cứu); hợp Tam Hóa, Xương Khúc. — *Nguồn: TT (Cốt tủy phú: "Cơ Nguyệt Đồng Lương tác lại nhân") (đã đọc); TB*
- **[CHUNG-CC-04]** **Cự Nhật**: Cự Môn và Thái Dương đồng cung (Dần, Thân) hoặc chiếu nhau; thiên về ngôn luận, truyền đạt, ngoại giao, danh tiếng. Thái Dương sáng thì Cự Môn bớt thị phi. — *Nguồn: TT (Cốt tủy phú: "Cự Nhật đồng cung quan phong tam đại") (đã đọc); TB*
- **[CHUNG-CC-05]** **Nhật Nguyệt**: Nhật Nguyệt cùng sáng (Nhật Nguyệt tịnh minh), Nhật Nguyệt chiếu Mệnh vô chính diệu ở Mùi (Minh châu xuất hải) là cách tốt; Nhật Nguyệt cùng hãm thì cần nỗ lực nhiều hơn. — *Nguồn: TT (Định quý cục: "Nhật Nguyệt tịnh minh", "Minh châu xuất hải") (đã đọc); TB*
- **[CHUNG-CC-06]** **Thất Sát triều đẩu** (Thất Sát ở Dần, Thân, Tý, Ngọ đối Tử Vi/Thiên Phủ) và **Phủ Tướng triều viên** là cách quý về sự nghiệp. — *Nguồn: TT (Cốt tủy phú: "Thất Sát triều đẩu tước lộc vinh xương"; Định quý cục: "Phủ Tướng triều viên") (đã đọc); TB*
- **[CHUNG-CC-07]** Mọi cách tốt đều có điều kiện "không bị phá": gặp sát tinh hãm, Không Kiếp, Hóa Kỵ hội chiếu thì giảm (xem PP-11). Gọi tên cách phải nêu đủ điều kiện, không gọi khi chỉ đạt một phần. — *Nguồn: TT (Luận cách tinh số cao hạ) (đã đọc); NL*
- **[CHUNG-CC-08]** **Ba mức thành/phá cách** (dùng khi gọi tên mọi cách): (1) **Thành cách**: đủ sao, đúng vị trí và độ sáng cách yêu cầu; tứ chính không có sát tinh hãm, Không Kiếp, Hóa Kỵ. (2) **Thành cách nhưng có khuyết**: đủ điều kiện (1) về sao, vị trí, nhưng tứ chính có yếu tố phá (sát tinh, Không Kiếp, Hóa Kỵ, Tuần/Triệt) với tổng điểm phá dưới 4, không yếu tố nào vừa tọa thủ vừa hãm. Vẫn gọi tên cách, kèm "có khuyết", diễn đạt "tiềm năng của cách có, nhưng thành quả đến qua nhiều lần thử, điều chỉnh". (3) **Phá cách**: yếu tố phá tọa thủ ngay cung chính mà hãm, hoặc Hóa Kỵ hóa vào chính sao tạo cách, hoặc tổng điểm phá ≥ 4 (yếu tố tọa thủ tính 2 điểm, ở xung chiếu hoặc tam hợp tính 1 điểm; Tuần, Triệt chỉ tính khi đóng ở chính cung, vì không chiếu, TP-04). Không gọi như thế mạnh; chỉ nói "có dáng dấp của cách …, cần nỗ lực nhiều hơn". Thiếu điều kiện về sao, vị trí, độ sáng thì **không gọi tên** (CC-07). **Ngoại lệ Sát Phá Tham** (CC-02, chốt 30/10, trả lời Phiếu 3b): khi cách đang xét là Sát Phá Tham / Sát Phá Liêm Tham, sát tinh (Kình Đà, Hỏa Linh, Không Kiếp) **đắc địa** theo bảng SP-10 là **trợ lực**, tính 0 điểm phá, không làm mất mức (1), không được nêu làm lý do phá cách (SP-03, TP-06); sát tinh **bình hoặc hãm** vẫn tính điểm như trên, hãm tọa thủ vẫn là mức (3); Hóa Kỵ, Tuần, Triệt không đổi. Các cách khác giữ nguyên: sát tinh đắc địa vẫn tính điểm. Xem TRANH-13. — *Nguồn: TT (Luận cách tinh số cao hạ: "cát hung tương bạn thủ chiếu vi trung cách"; "nhược cư hãm địa hựu gia sát hóa kỵ, vi hạ cách") (đã đọc); NL (tập 1: "chỉ vì phá cách nghịch lý tam hợp") (bản quét, đã đọc). (Cách tính điểm và ngưỡng 4 là quy ước nhóm để AI nhất quán, cần chuyên gia duyệt.)*
- **[CHUNG-CC-09]** **Tham Hỏa (Tham Linh)**: TT: Tham Lang và Hỏa Tinh cùng thủ Mệnh, cùng miếu vượng ("Tham Hỏa tương phùng"), hoặc Hỏa Tinh tam hợp chiếu Mệnh có Tham Lang ("Hỏa quý cách"); KL: Tham Lang đồng cung Hỏa hoặc Linh ở tứ mộ (Thìn Tuất Sửu Mùi). Mặc định: đồng cung ở tứ mộ là thành cách; Tham Lang miếu vượng ở cung khác gặp Hỏa/Linh là thành cách theo TT, ghi chú KL chặt hơn; Tham Lang chỉ **đắc** (Dần, Thân) hoặc hãm thì **không gọi tên cách**, chỉ luận "Tham Lang gặp Hỏa Tinh" (sao phụ). Tham Lang hóa Kỵ đồng cung: theo CC-08 mức (3). — *Nguồn: TT (quyển 1: "Tham Hỏa tương phùng, vị nhị tinh thủ mệnh đồng cư miếu vượng thị dã"; "luận Tham Lang ngộ Hỏa danh vi Hỏa quý cách, tam hợp chiếu thân mệnh thị dã") (đã đọc); KL (bản quét archive.org, đã đọc: "Tham lang ngộ Hỏa, Linh, tứ mộ cung… Mệnh có Tham lang đồng cung với Hỏa, Linh ở tứ mộ (Thìn, Tuất, Sửu, Mùi) thì giàu sang, quyền thế")*
- **[CHUNG-CC-10]** **Giáp cát bởi Tứ hóa**: cung bị kẹp bởi **bất kỳ hai** trong ba cát hóa (Khoa–Quyền, Khoa–Lộc, Quyền–Lộc) đều tính là giáp cát; đủ cả Lộc Tồn thay cho một hóa cũng tính. Cung bị giáp có Hóa Kỵ tọa thủ hoặc sát tinh hãm thì lợi ích giáp giảm (CC-08 mức 2), viết "có người uy tín sẵn lòng giúp, nhưng mình cần chủ động đón nhận". — *Nguồn: TT (quyển 1: "giáp quý giáp lộc thiểu nhân tri, giáp quyền giáp khoa thế sở nghi"; quyển 3: "lục giáp thị Tử Phủ, Tả Hữu, Xương Khúc, Khôi Việt, Khoa Quyền Lộc, Nhật Nguyệt") (đã đọc); KL (bản quét archive.org, đã đọc: "Khoa, Lộc giáp mệnh vi quý cách: Mệnh ở Tí có Hóa khoa ở Hợi, Hóa lộc ở Sửu"; "Lộc tồn có thể thay thế cho một trong ba sao Khoa Quyền Lộc"). (Câu về Kỵ tọa thủ là nhận xét nhóm.)*
- **[CHUNG-CC-11]** **Thất Sát triều đẩu / ngưỡng đẩu**: Thất Sát miếu ở Dần, Thân (triều đẩu) hoặc Tý, Ngọ (ngưỡng đẩu), cung đối có Tử Vi hoặc Thiên Phủ. Điều kiện thành cách và mức giảm theo CC-08. Các sách đánh giá Tý Ngọ khác nhau (TB thấp hơn Dần Thân, KL coi ngang), xem QUAN-TRANH và TRANH-12. — *Nguồn: TT (Cốt tủy phú: "Thất Sát triều đẩu tước lộc vinh xương") (đã đọc); KL (bản quét archive.org, đã đọc: Thất Sát "Miếu địa Dần Thân (triều đẩu), Tí Ngọ (ngưỡng đẩu)"; Phúc "Ở thế triều đẩu và ngưỡng đẩu đắc phúc nhưng phải ly hương lập nghiệp")*

---

### 0.8. So sánh trường phái và mặc định của xemtuvi.vn (PHAI)

| Tiêu chí | Phái Việt (TB, NL, CN) | Trung Châu (TC, Vương Đình Chi) | Tứ Hóa / Phi tinh (PT, Khâm Thiên Môn, phái Lương…) |
|---|---|---|---|
| Gốc phương pháp | Tam hợp: chính tinh + tam phương tứ chính + cách cục | Tam hợp, nhấn "tinh hệ" (quan hệ tương tác các sao) | Phi hóa theo can cung, theo dõi đường đi giữa các cung |
| Số sao | Nhiều (~100 sao, gồm vòng Tràng Sinh, Thái Tuế, Bác Sĩ) | Đầy đủ, có hệ sao tạp diệu riêng | Rút gọn, chủ yếu chính tinh + tứ hóa |
| Tuần, Triệt | Coi trọng, vẽ giữa hai cung | Tuần không/Triệt không đặt vào một cung (như iztro) ⚑ | Ít dùng |
| Tứ hóa | Theo can năm; Canh, Nhâm khác bảng Trung Quốc | Hóa năm, hóa đại vận, lưu niên có quy tắc riêng | Hóa năm + hóa can từng cung (tự hóa, phi hóa) là trung tâm |
| Độ sáng | 5 bậc | 6–7 bậc | Ít nhấn độ sáng |

- **[CHUNG-PHAI-01]** Phái tam hợp lấy Toàn Thư làm gốc, xoay quanh cách cục và tam phương tứ chính; phái phi tinh/tứ hóa không có trong sách cổ, dựa trên phi hóa theo can cung; Trung Châu do Vương Đình Chi phổ biến, nổi tiếng với lý thuyết tinh hệ và quy tắc hóa cho đại vận, lưu niên. — *Nguồn: WC3 (đã đọc); TC*
- **[CHUNG-PHAI-02]** Phái Việt đặt Tuần Triệt ở hai cung, Trung Quốc (iztro) chọn một cung; tứ hóa can Canh, Nhâm khác nhau giữa hai bên. — *Nguồn: SPEC (mục 5.12, 10.4, 10.15)*
- **[CHUNG-PHAI-03]** **Mặc định xemtuvi.vn**: an sao và độ sáng theo phái Việt (SPEC mục 10); luận theo phương pháp tam hợp phái Việt (mục 0.1), dùng Toàn Thư làm nguồn cổ đối chiếu. Trung Châu chỉ dùng tham khảo khi luận tổ hợp sao, ghi rõ "theo Trung Châu". Phi tinh **không dùng** trong bản luận 12 cung giai đoạn này. — *Lý do (quyết định nhóm): khách Việt quen lá số phái Việt; một phương pháp nhất quán dễ kiểm duyệt; phi tinh cần bộ quy tắc riêng, chưa có nguồn đối chiếu. Nguồn: SPEC (mục 10); WC3 (đã đọc)*

---

### 0.9. Điểm còn tranh luận chung (TRANH)

- **[CHUNG-TRANH-01]** **Ngũ hành Tuần Triệt**: có ít nhất bốn quan điểm (Triệt Kim–Tuần Hỏa phổ biến nhất; theo hành cung; Triệt Kim–Tuần Thủy; Triệt Hỏa–Tuần Thổ). Bộ luận không dùng ngũ hành Tuần Triệt để kết luận. — *Nguồn: WC6 (đã đọc)*
- **[CHUNG-TRANH-02]** **Mức ảnh hưởng Tuần Triệt**: phái Việt coi trọng (có mốc thời gian, đảo tốt xấu); Toàn Thư chỉ nêu "không vong" như một yếu tố cần xét; WC7 ghi có quan điểm Tuần ảnh hưởng đều cả đời. Mặc định theo TUAN-02, TUAN-03 và luôn diễn đạt mềm. — *Nguồn: WC6; WC7; TT (Đàm tinh yếu luận) (đều đã đọc)*
- **[CHUNG-TRANH-03]** **Độ sáng Tử Vi ở Tý, Ngọ, Sửu, Mùi**: SPEC ghi Tý B, Ngọ M, Sửu Đ, Mùi Đ; Toàn Thư ghi "miếu Sửu Mùi Ngọ, bình Tý, vô hãm"; một số sách Việt ghi Tý Ngọ cùng bậc. Theo SPEC, ghi chú khác biệt ở cung có Tử Vi Sửu/Mùi. — *Nguồn: SPEC (mục 6); TT (Đàm tinh yếu luận, bảng miếu vượng: "Tử Vi miếu Sửu Mùi Ngọ, vượng Dần Thân Mão Dậu Tỵ Hợi, bình Tý, vô hãm") (đã đọc)*
- **[CHUNG-TRANH-04]** **Độ sáng Hóa Lộc/Quyền/Kỵ** (đắc ở tứ mộ) là quy ước riêng của dòng ansaotuvi, ít sách nói; không dùng độ sáng của Tứ hóa để kết luận. — *Nguồn: SPEC (mục 6, chú thích)*
- **[CHUNG-TRANH-05]** **Hóa Kỵ**: phái tam hợp coi là sao trở ngại; phái phi tinh coi Kỵ là điểm "thu, giữ, nợ, ràng buộc" theo hướng phi hóa, mang ý nghĩa trung tính hơn. Bộ luận dùng nghĩa tam hợp nhưng diễn đạt trung tính (HOA-03). — *Nguồn: WC5 (đã đọc); PT* ⚑1nguồn
- **[CHUNG-TRANH-06]** **Tứ hóa can Canh, Nhâm**: Việt Canh "Nhật Vũ Đồng Âm", Nhâm Khoa Thiên Phủ; Trung Quốc Canh "Nhật Vũ Âm Đồng", Nhâm Khoa Tả Phù. Lá số tuổi Canh, Nhâm: luận theo bảng Việt, ghi chú khác biệt ở sao bị ảnh hưởng. — *Nguồn: SPEC (mục 5.8, 10.4)*
- **[CHUNG-TRANH-07]** **Thái Âm ở Dậu** và nhiều ô khác: bảng Việt "miếu", bảng Trung Quốc 7 bậc "bất". Theo bảng Việt. — *Nguồn: SPEC (mục 6)*
- **[CHUNG-TRANH-08]** **Hành kiêm của chính tinh** (Tham Lang, Liêm Trinh, Thất Sát, Cự Môn) khác nhau giữa các nguồn; xem CT-NH-01. — *Nguồn: TT (Chư tinh vấn đáp); WC4 (đều đã đọc)*
- **[CHUNG-TRANH-09]** **Xung chiếu hay tam hợp nặng hơn**: TT và KL coi xung chiếu trực tiếp nên quan trọng hơn tam hợp; NL lại nói "cái quan trọng chính yếu của Tử vi là tam hợp". Mặc định theo TT, KL (PP-06, TP-02). — *Nguồn: KL (bản quét archive.org, đã đọc: Phối chiếu); NL (tập 2) (bản quét, đã đọc); TT (Phát vi luận) (đã đọc)*
- **[CHUNG-TRANH-10]** **Tứ hóa can Canh, Nhâm trong sách cổ**: TT nêu "Thiên Đồng tại Tuất hóa Kỵ, Đinh sinh nhân ngộ cát" và KL ghi tuổi Nhâm hóa Khoa Tả Phù, đều theo bảng khác bảng phái Việt của SPEC. Khi trích các câu này phải ghi rõ bảng gốc, luận theo bảng Việt (TRANH-06). — *Nguồn: TT (quyển 2, Hóa Kỵ) (đã đọc); KL (bản quét archive.org, đã đọc: Tuổi Nhâm "Lương Vi Phụ Vũ"); SPEC (mục 5.8)*
- **[CHUNG-TRANH-11]** **Mức nặng của Kiếp Sát, Lưu Hà**: KL coi là sát tinh "cũng khá nặng nề, nhưng không thê thảm như Không Kiếp, Kình Đà, Hỏa Linh"; NL cho rằng có thể "lấn lướt lục sát". Mặc định: xếp dưới lục sát (PP-10, nhóm sao nhỏ), diễn đạt mềm (SP-11, SP-12). — *Nguồn: KL (bản quét archive.org, đã đọc: mục "Kiếp sát – Phá toái – Lưu hà"); NL (tập 1) (bản quét, đã đọc)*
- **[CHUNG-TRANH-12]** **Thất Sát ở Tý, Ngọ (ngưỡng đẩu)**: TB cho rằng Thất Sát ở Tý Ngọ kém Dần Thân, "may rủi đi liền"; KL xếp Tý Ngọ cùng bậc miếu với Dần Thân và gọi là ngưỡng đẩu. Luận cả hai ý, không chọn một (PP-12). — *Nguồn: TB (theo QUAN-TS-01); KL (bản quét archive.org, đã đọc: mục Thất sát)*
- **[CHUNG-TRANH-13]** **Sát tinh đắc địa trong cách Sát Phá Tham: trợ lực hay yếu tố phá**: phái Việt coi là trợ lực (TB, Tử Vi Chỉ Nam của Song An Đỗ Văn Lưu: "bộ Sát Phá Tham cần Lục Sát Tinh đắc địa"; KL: "Kình Đà, Không Kiếp đắc địa hội hợp cũng được hưởng giàu sang"); TT chỉ nói Sát Phá "chuyên y Dương Linh" (dựa vào Kình, Linh) và vẫn xếp "cư hãm địa hựu gia sát" là hạ cách, không có ngoại lệ rõ cho Không Kiếp; một số trang phổ thông ghi nhiều sát tinh mà thiếu Lộc thì Sát Phá Tham dễ "làm rồi đổ". Mặc định theo phái Việt (CC-08 ngoại lệ Sát Phá Tham): đắc = 0 điểm, bình/hãm = tính điểm. Khi có từ ba sát tinh đắc địa trở lên ở tứ chính mà không có Lộc Tồn/Hóa Lộc, vẫn giữ mức theo điểm nhưng luận thêm một câu "sức bứt phá lớn, cần nhịp nghỉ và tích lũy" (không hạ mức). Cần chuyên gia duyệt. — *Nguồn: TB; Tử Vi Chỉ Nam (trích qua hoc.kabala.vn/nguyen-tac-can-ban-giai-doan-mot-la-so-tu-vi, chưa đọc bản gốc) ⚑; KL (bản quét archive.org, đã đọc); TT (Thái Vi phú; Luận cách tinh số cao hạ) (đã đọc); thayungkhiem.vn/sat-pha-tham (trang phổ thông)*

---

### 0.10. Danh mục nguồn

**Sách (mã theo QUY-UOC)**
- **TT**: *Tử Vi Đẩu Số Toàn Thư* (紫微斗數全書), tương truyền Hy Di Trần Đoàn; bản Hán văn trên Wikisource: https://zh.wikisource.org/wiki/紫微斗數全書 (quyển 1: Thái Vi phú, Hình tính phú, Đẩu số chuẩn thằng, Phát vi luận, Chư tinh vấn đáp luận, Cốt tủy phú, Định quý/phú/bần tiện cục; quyển 3: Đàm tinh yếu luận, Luận cách tinh số cao hạ). Bản dịch Việt: Vũ Tài Lục; Hư Chu (NXB, năm: chưa xác minh). Nhóm đã đọc bản Hán văn quyển 1, 2, 3 (quyển 2: https://zh.wikisource.org/wiki/紫微斗數全書/卷二 , có các thiên Tứ hóa, chư tinh nhập hạn).
- **TB**: *Tử Vi Đẩu Số Tân Biên*, Vân Đằng Thái Thứ Lang (NXB, năm: chưa xác minh). Chưa đối chiếu bản in.
- **NL**: *Tử Vi Nghiệm Lý Toàn Thư* (3 tập) và *Tử Vi Nghiệm Lý – Lý Mệnh Học*, Thiên Lương. Bản quét có lớp chữ OCR trên archive.org: https://archive.org/details/TViNghihmLToanThu-dv , https://archive.org/details/TVnghiemlyLyMenhHoc-dv (đã đọc 30/10/2026; trích "tập 1/2/3" theo file quét, không ghi trang). Bảng độ sáng của SPEC đi theo dòng sách này qua ansaotuvi.
- **CN**: *Tử Vi Chỉ Nam*, Song An Đỗ Văn Lưu. Chưa đối chiếu (tra archive.org 30/10/2026: không tìm thấy bản quét).
- **KL**: *Tử Vi Khảo Luận*, TS Hoàng Thường, TS Hàm Chương. Bản quét có lớp chữ OCR: https://archive.org/details/tuvikhaoluan (đã đọc 30/10/2026; trích theo tên mục, không ghi trang). Lưu ý: KL có chép lại nhiều câu phú của TT; với các câu phú đó KL không phải nguồn độc lập.
- **HS**: *Tử Vi Hàm Số*, Nguyễn Phát Lộc. Chưa dùng trực tiếp (WC6 có nhắc tác giả).
- **TC**: Trung Châu phái, Vương Đình Chi (*Đẩu Số Giảng Nghĩa*, *Đẩu Số Tinh Diệu Tinh Hoa*). Chưa đối chiếu bản in; mô tả phái theo WC3.
- **PT**: Phi tinh / Tứ Hóa phái (Khâm Thiên Môn của Thái Minh Hoằng; phái Lương Nhược Du). Mô tả theo WC3.
- **SPEC**: `docs/nghien-cuu/tuvi-an-sao-spec.md` (đặc tả an sao xemtuvi.vn, bản 30/10/2026), mục 2, 5, 6, 10.
- **QUY-UOC**: `docs/nghien-cuu/luan-giai/QUY-UOC.md`.

**Web (mã WC, đã đọc 30/10/2026)**
- **WC1**: Wikisource, 紫微斗數全書/卷一 — https://zh.wikisource.org/wiki/紫微斗數全書/卷一
- **WC2**: Wikisource, 紫微斗數全書/卷三 — https://zh.wikisource.org/wiki/紫微斗數全書/卷三
- **WC3**: Wikipedia tiếng Trung, mục 紫微斗數 (phần 推算派別: 三合, 飛星/四化, 自化/欽天門, 中州派) — https://zh.wikipedia.org/wiki/紫微斗數
- **WC4**: Master Sean Chan, "ZWDS Main Stars" (ngũ hành, nhóm Bắc/Nam đẩu 14 chính tinh) — https://www.masterseanchan.com/zwds-main-stars/
- **WC5**: Master Sean Chan, "ZWDS Si Hua" (ý nghĩa Tứ hóa, hóa bản mệnh và hóa vận) — https://www.masterseanchan.com/zwds-si-hua/
- **WC6**: Đặng Xuân Xuyến, "Tuần Triệt và những dấu hỏi", trích *Tử Vi Kiến Giải* (NXB Thanh Hóa, 2009) — https://trangvhntnguoncoi.wordpress.com/2020/10/17/tuan-triet-va-nhung-dau-hoi/
- **WC7**: Học quán Sơn Chu, "Tiếp về Tuần Triệt" (dẫn lại vietbao1623.blogspot.com, có nhắc Thiên Lương, Thái Thứ Lang) — https://sonchu.vn/nghien-cuu/tiep-ve-tuan-triet

Ghi chú: các trích dẫn TT ở trên ghi theo âm Hán Việt của nguyên văn trên WC1, WC2. Mã TT và WC1/WC2 cùng một văn bản, không tính là hai nguồn độc lập.

## 1. Cung Mệnh

### 1.1. Ý nghĩa cung (YN)

- **[MENH-YN-01]** Cung Mệnh cho biết bản chất, tính cách, tiềm năng và "khung" chung của cả đời. Khi luận phải xét cùng cung đối (Thiên Di) và tam hợp (Tài Bạch, Quan Lộc), tức "tam phương tứ chính". — *Nguồn: TC (WM8, mục "1- Cung Mệnh"); TT (WM7, 斗数骨髓赋: "分对宫之体用，定三合之源流")*
- **[MENH-YN-02]** Thứ tự xét: trước hết xem cách cục ở Mệnh, sau đó mới xét từng sao. Cùng một giờ sinh vẫn có thể khác nhau tùy cách phối hợp. — *Nguồn: TT (WM7, 斗数骨髓赋: "先明格局，次看众星"); TC (WM8: "xem xét tổ hợp các sao của cung Mệnh… định được đại khái vận thế")*
- **[MENH-YN-03]** Cung Phúc Đức và Thiên Di là hai cung phụ phải xem kỹ khi đánh giá Mệnh. — *Nguồn: TT (WM7, 斗数骨髓赋: "第一先看福德，再三细考迁移"); TB (WM3, phần dẫn cung Phu Thê nêu nguyên tắc xét Mệnh, Thân, Phúc Đức trước) ⚑1nguồn*
- **[MENH-YN-04]** Mệnh có cách cục cao thì đại hạn xấu cũng ít khi quá xấu. Mệnh có cách cục thấp thì hạn tốt cũng chỉ thuận lợi nhất thời. Cách dùng cho bài luận: Mệnh là "nền", hạn là "hoàn cảnh". — *Nguồn: TC (WM8, mục 1); TB (WM5, tr.324 theo người chép: tiểu luận xem hạn, Mệnh là căn bản)*

**Cung Thân và quan hệ Mệnh–Thân**

- **[MENH-YN-05]** Vị trí: Thân chỉ đóng ở 6 cung: Mệnh (giờ Tý, Ngọ), Phúc Đức (Sửu, Mùi), Quan Lộc (Dần, Thân), Thiên Di (Mão, Dậu), Tài Bạch (Thìn, Tuất), Phu Thê (Tỵ, Hợi). — *Nguồn: spec mục 2.3; TT (WM6, 安身命例)*
- **[MENH-YN-06]** Mệnh là gốc tiên thiên (bẩm sinh). Thân là phần hậu thiên, tức sự phát triển do bản thân vun đắp, ứng rõ hơn ở nửa sau cuộc đời (một nguồn Việt nêu mốc tuổi; khi viết không nêu tuổi, dùng mẫu câu CHUNG-TUAN-09). — *Nguồn: TT (WM7, 斗数骨髓赋: "立命可知贵贱，安身便晓根基"); TC (WM8: cung Thân "luận đoán sự phát triển Hậu thiên"); WM1 ("Thân ăn về hậu vận, từ 30 tuổi trở ra")*
- **[MENH-YN-07]** Mệnh tốt và Thân tốt thì thuận lợi lâu dài. Mệnh tốt mà Thân kém thì như ngọc đẹp bị khắc lỗi, giảm phần trọn vẹn. Mệnh kém mà Thân tốt thì nửa sau đời khá hơn. Khi viết bài, nên gợi ý cách nỗ lực hậu thiên để bù phần thiếu. — *Nguồn: TC (WM8, mục 1); TT (WM7, 斗数骨髓赋: "命好身好限好到老荣昌"); WM1 (ví dụ Mệnh xấu, Thân tốt thì hậu vận khá)*
- **[MENH-YN-08]** Thân cư cung nào thì đời sống chịu ảnh hưởng nhiều của lĩnh vực đó. Ví dụ Thân cư Phu Thê nghĩa là chịu ảnh hưởng nhiều của người phối ngẫu, **không** có nghĩa là "sợ vợ" hay "nhờ chồng". — *Nguồn: WM1 (mục "Thân cư Thê"); TC (WM8, mục 1, Thân là hậu thiên); KL (mục cung Thân, "Cung Thân nằm ở cung nào thì ảnh hưởng lớn lao") (bản quét, đã đọc)*

### 1.2. 14 chính tinh tại Mệnh

#### Tử Vi
- **[MENH-TV-01]** Miếu ở Dần, Thân, Tỵ, Ngọ (M), vượng ở Thìn, Tuất (V), đắc ở Sửu, Mùi (Đ): người trung hậu, nghiêm cẩn, chững chạc, có phong thái lãnh đạo. — *Nguồn: TB (WM4, "Đặc tính tinh đẩu — Tử Vi"); TT (WM6, 命宫·紫微: "为人忠厚老成，谦恭耿直")*
- **[MENH-TV-02]** Bình ở Tý, Mão, Dậu, Hợi (B), hoặc thiếu Tả Hữu: uy lực giảm, khả năng "cứu giải" yếu. TT gọi đây là "cô quân" (vua thiếu bề tôi): có tố chất dẫn dắt nhưng thiếu người phò tá. Nên chủ động xây dựng quan hệ và đội ngũ. — *Nguồn: TB (WM4: "kém rực rỡ, giảm uy lực"); TT (WM6: "不入庙无左右为孤君")*
- **[MENH-TV-03]** Gặp Thiên Phủ, Thiên Tướng, Tả Hữu, Xương Khúc, Khôi Việt hội họp: uy tín và quyền hành rõ rệt, tài lộc vững. — *Nguồn: TB (WM4: "uy quyền hiển hách… như vua gặp bề tôi trung lương"); TT (WM6: "若与府相左右日月昌曲三合嘉会… 巨富大贵")*
- **[MENH-TV-04]** Gặp Kình, Đà, Không, Kiếp hoặc Tuần Triệt: dễ gặp trở ngại, có xu hướng tìm đến đời sống tinh thần, ít màng danh lợi. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM4: "như vua bị vây hãm… hay sinh ra những sự chẳng lành"); TT (WM6, 紫微入男命诀: "羊陀火铃来相会，只好空门礼梵王")*

#### Liêm Trinh
- **[MENH-LT-01]** Miếu ở Thìn, Tuất (M), vượng ở Tý, Ngọ, Dần, Thân (V), đắc ở Sửu, Mùi (Đ): liêm khiết, thẳng thắn, có tố chất làm việc trong môi trường kỷ luật hoặc quản lý. — *Nguồn: TB (WM4, "Liêm Trinh": "Liêm khiết, thẳng thắn"); TT (WM6, 命宫·廉贞: "入庙武职贵"; "六甲生人命坐寅申者上格")*
- **[MENH-LT-02]** Hãm ở Tỵ, Hợi, Mão, Dậu (H): tính cứng, dễ tranh luận gay gắt, khắt khe. Hợp nghề chuyên môn hoặc tay nghề, thường sớm tự lập xa gia đình. Nên học cách mềm mỏng khi va chạm. — *Nguồn: TB (WM4: hãm "khắc nghiệt"); TT (WM6: "性硬浮荡，好忿争"; "巳亥陷宫弃祖孤单，巧艺")*
- **[MENH-LT-03]** Liêm Trinh rất cần Thiên Tướng đồng cung, vì Tướng chế bớt phần khắc nghiệt và nóng nảy của Liêm. — *Nguồn: TT (WM6: "此星最喜天相同宫能化其恶"); TB (WM4 và WM5 tr.54, mục Thiên Tướng: "Chế được tính khắc nghiệt nóng nảy của Liêm")*
- **[MENH-LT-04]** Liêm miếu, vượng, đắc thủ Mệnh hoặc Thân còn mang tính "đào hoa thứ hai", tức có duyên, có sức hút. — *Nguồn: TB (WM4: "gọi là Đào Hoa thứ hai"); TT (WM6, phần tổng luận: "廉真…在身命为次桃花")*

#### Thiên Đồng
- **[MENH-TD-01]** Miếu ở Dần, Thân (M), vượng ở Tý (V), đắc ở Mão, Tỵ, Hợi (Đ): hiền hòa, nhân hậu, vui vẻ, thường gặp may. Ý thích hay thay đổi. — *Nguồn: TB (WM4, "Thiên Đồng"); TT (WM6, 命宫·天同: "天同入庙肥满清明，仁慈耿直")*
- **[MENH-TD-02]** Hãm ở Ngọ, Dậu, Thìn, Tuất, Sửu, Mùi (H): vẫn nhân hậu nhưng dễ thất thường, dễ vướng thị phi. Nên giữ kế hoạch rõ ràng. Ngoại lệ: Thiên Đồng ở Tuất là cách "phản bối", nhưng người tuổi Đinh (được Hóa) lại thành tốt. — *Nguồn: TB (WM4: hãm "canh cải, thất thường… thị phi"); TT (WM7, 斗数骨髓赋: "天同戌宫为反背，丁人化吉主大贵"; WM6: "午宫陷")*
- **[MENH-TD-03]** Đồng Lương ở Dần, Thân, gặp Tả Hữu: tài và quan đều đẹp. — *Nguồn: TT (WM7, 斗数骨髓赋: "寅申最喜同梁会"; WM6: "与天梁左右嘉会…财官双美"); KL (phú Thiên Đồng, "Dần Thân tối hỷ Đồng Lương hội", giàu và sang; KL không nêu điều kiện Tả Hữu) (bản quét, đã đọc)*

#### Vũ Khúc
- **[MENH-VK-01]** Miếu ở Thìn, Tuất, Sửu, Mùi (M), vượng ở Tý, Ngọ, Dần, Thân (V), đắc ở Mão, Dậu (Đ): cương nghị, quyết đoán, thẳng thắn, giỏi kiếm tiền và tạo tài sản. — *Nguồn: TB (WM5 tr.51; WM4 "Vũ Khúc"); TT (WM6, 命宫·武曲: "性刚果决，心直无毒")*
- **[MENH-VK-02]** Hãm ở Tỵ, Hợi (H, đồng cung Phá Quân): dễ cứng nhắc, chi tiêu bốc đồng. Hợp nghề chuyên môn hoặc tay nghề. Nên lập kỷ luật tài chính. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM5 tr.51: "tham lam, ương ngạnh, phá tán"); TT (WM6: "陷地巧艺之人… 更遇廉贞破军羊忌空劫冲破下局")*
- **[MENH-VK-03]** Vũ Khúc mang tính "Cô, Quả": độc lập, ít bộc lộ tình cảm. Nên chủ động chia sẻ trong các mối quan hệ thân thiết. — *Nguồn: TB (WM4, WM5 tr.51: "Vũ Khúc có tính chất như Cô, Quả"); TT (WM6, nữ mệnh: "陷地值杀孤单"); KL (mục Vũ Khúc, đắc địa thì "uy dũng, cương trực, cô độc") (bản quét, đã đọc)*
- **[MENH-VK-04]** Vũ Khúc miếu, vượng, đắc gặp sát tinh thì không đáng lo nhiều. — *Nguồn: TB (WM4, WM5 tr.51); TT (WM6: Vũ Khúc "入庙与昌曲同行… 武职最旺", ý tương tự); KL (mục Vũ Khúc, đắc địa thì "chẳng sợ sát tinh nào") (bản quét, đã đọc)*

#### Thái Dương
- **[MENH-TDU-01]** Miếu ở Tỵ, Ngọ (M), vượng ở Dần, Mão, Thìn (V), đắc ở Sửu, Mùi (Đ): thông minh, nhân hậu, rộng rãi, hơi nóng tính, có uy. — *Nguồn: TB (WM4, "Thái Dương"); TT (WM6, 命宫·太阳: "入庙形貌堂堂… 心慈… 好济施")*
- **[MENH-TDU-02]** Hãm ở Thân, Dậu, Tuất, Hợi, Tý (H): công việc dễ thăng trầm, lúc đầu siêng rồi sau nản. Rời quê lập nghiệp thì thuận hơn. Nên giữ nhịp bền bỉ. — *Nguồn: TB (WM4: "giảm uy quyền, hay nhầm lẫn"); TT (WM6: "陷地虽化权禄也凶… 先勤终懒，成败不一，出外离祖可吉")*
- **[MENH-TDU-03]** Sinh ban ngày thì Thái Dương thuận lý, sáng hơn. Sinh ban đêm thì giảm sáng. — *Nguồn: TB (WM4: "sinh ban ngày là thuận lý"); TT (WM6: "夜生陷日生庙旺")*
- **[MENH-TDU-04]** Thái Dương hãm gặp Tuần Triệt lại sáng hơn. Thái Dương miếu, vượng gặp Tuần Triệt thì bị che. — *Nguồn: TB (WM4); KL (mục Thái Dương, "hãm địa gặp Tuần Triệt thì sáng lại"; KL chỉ nêu vế hãm, chưa thấy vế miếu bị che) (bản quét, đã đọc)*

#### Thiên Cơ
- **[MENH-TCO-01]** Miếu ở Thìn, Tuất, Mão, Dậu (M), vượng ở Tỵ, Thân (V), đắc ở Tý, Ngọ, Sửu, Mùi (Đ): sáng suốt, khéo léo, nhiều mưu kế, nhân hậu, tính hơi gấp. — *Nguồn: TB (WM4, "Thiên Cơ"); TT (WM6, 命宫·天机: "性急心慈，机谋多变")*
- **[MENH-TCO-02]** Hãm ở Dần, Hợi (H), hoặc gặp Cự Môn kèm Kình Đà Hỏa Linh, Kỵ: thành tựu khó bền, hợp kinh doanh hoặc nghề kỹ thuật khéo tay. Nên tránh dàn trải. — *Nguồn: TB (WM4: hãm "kém sáng suốt"); TT (WM6: "加巨门羊陀火铃忌… 亦不耐久，只宜经商巧艺")*
- **[MENH-TCO-03]** Cơ Lương hội: giỏi bàn mưu lược, phân tích. Bộ Cơ Nguyệt Đồng Lương hợp công việc hành chính hoặc chuyên viên. — *Nguồn: TT (WM6: "与天梁会合善谈兵"; WM7: "机月同梁作吏人"); KL (phú Thiên Cơ, "Cơ Lương hội hợp thiện đàm binh"; Cơ Nguyệt Đồng Lương "thường là công chức") (bản quét, đã đọc)*

#### Thiên Phủ
- **[MENH-TP-01]** Miếu ở Dần, Thân, Tý, Ngọ (M), vượng ở Thìn, Tuất (V), đắc ở Tỵ, Hợi, Mùi (Đ): ôn hòa, nhân hậu, thông minh, học rộng, biết xoay xở, có khả năng giải nguy. — *Nguồn: TB (WM4, "Thiên Phủ"); TT (WM6, 命宫·天府: "心性温和，聪明俊秀，博学机变，能解一切灾厄")*
- **[MENH-TP-02]** Bình ở Mão, Dậu, Sửu (B). Gặp Tuần Triệt hoặc Không Kiếp thì như kho bị thủng: tiền khó tích lũy. Nên quản lý tài chính chặt chẽ. — *Nguồn: TB (WM4: "ví như kho tàng bị phá vỡ… hao tán"); TT (WM6: Thiên Phủ ở Hợi, Mão, Mùi, Thìn, Dậu với tuổi Giáp, Canh thì "先大后小，有始无终")*
- **[MENH-TP-03]** Gặp Kình Đà Hỏa Linh: TB cho rằng Phủ chế được (chỉ suy giảm khi gặp đủ cả bốn sao). TT cho rằng dễ thiên về toan tính quá mức. Xem 1.6. — *Nguồn: TB (WM4); TT (WM6: "羊陀火铃会合奸诈")*

#### Thái Âm
- **[MENH-TA-01]** Miếu ở Dậu, Tuất, Hợi (M), vượng ở Thân, Tý (V), đắc ở Sửu, Mùi (Đ): ôn hòa, nhân hậu, thanh tú, thông minh, có khiếu văn chương nghệ thuật. Thuận về nhà đất và tích lũy. — *Nguồn: TB (WM4, "Thái Âm"); TT (WM6, 命宫·太阴: "心性温和，清秀耿直聪明"; thơ "酉戌亥垣为得地")*
- **[MENH-TA-02]** Hãm ở Dần, Mão, Thìn, Tỵ, Ngọ (H): dễ nhầm lẫn, tài sản khó giữ. Xa quê lập nghiệp thì thuận hơn. Nên cẩn thận khi ra quyết định tài chính. — *Nguồn: TB (WM4: "kém sáng suốt, hay nhầm lẫn… phát tán"); TT (WM6: "陷地化吉科权禄，反以凶论，出外离祖则吉")*
- **[MENH-TA-03]** Sinh ban đêm thì Thái Âm thuận lý. Sinh từ mùng 1 đến 15 âm lịch (trăng thượng huyền) càng sáng. — *Nguồn: TB (WM4); KL lại cho rằng Thái Âm đắc địa, sinh ban đêm "từ ngày 10 đến 20 thì toàn mỹ" (bản quét, đã đọc) ⚑1nguồn*

#### Tham Lang
- **[MENH-THL-01]** Miếu ở Sửu, Mùi (M), vượng ở Thìn, Tuất (V), đắc ở Dần, Thân (Đ): nhiều ham muốn và năng lượng, giao tế giỏi, có uy và tài lộc. Gặp Hỏa Tinh hoặc Linh Tinh càng mạnh (xem 1.4). — *Nguồn: TB (WM4, "Tham Lang"); TT (WM6, 命宫·贪狼: "入庙多居武艺之中，遇火铃…合局"; WM7: "贪狼火星居庙旺名镇诸邦")*
- **[MENH-THL-02]** Hãm ở Tý, Ngọ, Mão, Dậu, Tỵ, Hợi (H): thiếu kiên nhẫn, làm vội nên "khéo quá hóa vụng", dễ sa vào thú vui. Nên rèn kỷ luật và chọn mục tiêu dài hạn. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TT (WM6: "性格不常，心多计较，作事急速不耐静，作巧反拙，好赌博花酒"); TB (WM4: hãm "hay nhầm lẫn…")*
- **[MENH-THL-03]** Vũ Tham ở tứ mộ (Thìn, Tuất, Sửu, Mùi): phát muộn, ngoài 30 tuổi mới phát. Tham Vũ ở Thân mà Mệnh không có cát tinh thì vất vả hơn. — *Nguồn: TT (WM7, 斗数骨髓赋: "贪武墓中居三十才发福"; "先贫后富武贪同身命之宫"); TB (WM5, tr.116 theo người chép: "Tham Vũ mộ trung cư tam thập tổng phát phúc"; "Tham Vũ Thân cung vi hạ cách")*

#### Cự Môn
- **[MENH-CM-01]** Miếu ở Mão, Dậu (M), vượng ở Tý, Ngọ, Dần (V), đắc ở Thân, Hợi (Đ): nhân hậu, ăn nói sắc sảo, có uy về lời nói, hợp nghề dùng ngôn ngữ (luật, giảng dạy, tư vấn). — *Nguồn: TB (WM4, "Cự Môn": "ăn nói đanh thép. Chủ uy quyền, tài lộc"); TT (WM6, 命宫·巨门: "入庙身长肥胖敦厚清秀")*
- **[MENH-CM-02]** Hãm ở Thìn, Tuất, Sửu, Mùi, Tỵ (H): hay nghi ngờ, học nhiều nhưng không chuyên sâu, dễ vướng thị phi, ít hợp người. Nên thận trọng lời nói và kiểm chứng trước khi kết luận. — *Nguồn: TT (WM6: "多疑且多学少精，与人寡合，多是多非"; WM7: "辰戌应嫌陷巨门"); TB (WM4: hãm "thường gây ra thị phi")*
- **[MENH-CM-03]** Cự Môn hãm gặp Hóa Khoa thì giảm hẳn phần bất lợi. — *Nguồn: TB (WM4: "Khoa giải trừ được tính hung của Cự hãm địa"); KL (mục Cự Môn, "Cự môn hãm địa cần có Hóa khoa cứu giải") (bản quét, đã đọc)*

#### Thiên Tướng
- **[MENH-TT-01]** Miếu ở Dần, Thân (M), vượng ở Thìn, Tuất, Tý, Ngọ (V), đắc ở Sửu, Mùi, Tỵ, Hợi (Đ): đôn hậu, can đảm, chững chạc, thích cái đẹp, cơm áo đầy đủ. Chế được sát tinh. — *Nguồn: TB (WM5 tr.54; WM4 "Thiên Tướng"); TT (WM6, 命宫·天相: "相貌敦厚持重，清白好酒食，衣禄丰足")*
- **[MENH-TT-02]** Hãm ở Mão, Dậu (H), gặp Kình Dương đồng cung hoặc Tuần Triệt: dễ mất thế chủ động, "ấn tín sứt mẻ". Nên chuẩn bị kỹ trước khi nhận trọng trách. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM5 tr.54: "như dao kề trên đầu"; "ông tướng mất đầu… mất hết quyền lực"); TT (WM6: "与武破羊陀同行则为巧艺，更加火铃巨机，则伤刑")*

#### Thiên Lương
- **[MENH-TL-01]** Miếu ở Ngọ, Thìn, Tuất (M), vượng ở Dần, Mão, Thân (V), đắc ở Sửu, Mùi (Đ): nhân hậu, khoan dung, ngay thẳng, có mưu cơ, biết quyền biến. Có khả năng "giải" khó khăn, thường gặp nguy rồi qua. — *Nguồn: TB (WM5 tr.55; WM4 "Thiên Lương"); TT (WM6, 命宫·天梁: "聪明耿直，心无私曲好济施，有寿")*
- **[MENH-TL-02]** Hãm ở Dậu, Tỵ, Hợi (H): vẫn nhân hậu nhưng hay thay đổi, ham chơi, nhiều dịch chuyển. Nên chọn một hướng đi và theo đuổi đến cùng. — *Nguồn: TB (WM5 tr.55: hãm Tỵ Hợi "canh cải, thất thường, ham chơi"); TT (WM6: "要入庙方富贵，陷地遇火羊破局"; WM7: "天梁天马陷飘荡无疑")*
- **[MENH-TL-03]** Thiên Lương ở Ngọ: đường công danh trong sạch, hiển đạt. — *Nguồn: TT (WM7, 斗数骨髓赋: "梁居午位官资清显"); TB (WM5 tr.55: Ngọ là miếu địa)*

#### Thất Sát
- **[MENH-TS-01]** Miếu ở Dần, Thân, Tý, Ngọ (M): can đảm, quyết liệt, có mưu lược, hợp vai trò cầm quân hoặc khai phá. — *Nguồn: TB (WM4, "Thất Sát"); TT (WM6, 命宫·七杀: "庙旺有谋略"; WM7: "七杀朝斗爵禄荣昌")*
- **[MENH-TS-02]** Hãm ở Mão, Dậu, Thìn, Tuất (H), thêm Kình Đà Hỏa Linh: dễ bốc đồng, nóng giận, thành quả khó bền. Nên học kiềm chế và quản trị rủi ro. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM4: hãm "liều lĩnh"); TT (WM6: "羊陀火铃冲会，又在陷地… 虽富贵不耐久")*
- **[MENH-TS-03]** Tử Vi đồng cung với Thất Sát (Tỵ, Hợi) làm Sát được "hóa quyền", như vua mang kiếm báu: cá tính mạnh, có năng lực quản lý. — *Nguồn: TB (WM4, Tử Vi: "ban quyền hành cho Sát… ví như vua mang kiếm báu"); TT (WM6: "遇紫微掌生杀之权"; tổng luận "七杀…遇帝为权")*

#### Phá Quân
- **[MENH-PQ-01]** Miếu ở Tý, Ngọ (M), vượng ở Sửu, Mùi (V), Thìn, Tuất (V theo spec, TB ghi Đ): can đảm, dám đổi mới, mạnh mẽ. Ở Tý, Ngọ thì công danh thăng tiến. — *Nguồn: TB (WM4, "Phá Quân"); TT (WM7, 斗数骨髓赋: "子午破军加官进禄"; WM6: "子午宫入庙")*
- **[MENH-PQ-02]** Hãm ở Dần, Thân, Mão, Dậu, Tỵ, Hợi (H): thích thay đổi, khó hợp quần, dễ hao tán. Tự lập xa quê thì phát. Nên có kế hoạch tài chính và kiên nhẫn trong hợp tác. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM4: hãm "liều lĩnh… phá tán"); TT (WM6: "性刚寡合，好争强。弃祖发福")*
- **[MENH-PQ-03]** Phá Quân gặp Tử Vi, Thiên Lương, Thiên Phủ (hoặc Hỷ, Lộc) thì bớt tính phá. — *Nguồn: TT (WM6: "喜紫微有威权，天梁天府能制其恶"); TB (WM4: "Gặp Lương, Hỷ hay Lộc… chế bớt được tính hung của Phá")*

### 1.3. Bộ sao phụ quan trọng (SP)

- **[MENH-SP-01]** Tả Phụ, Hữu Bật: được người giúp đỡ, tính rộng lượng. Đi với sao tốt thì làm tốt thêm, đi với sao xấu thì làm xấu thêm. — *Nguồn: TB (WM4, "Tả Phụ – Hữu Bật"); TT (WM7: "左辅右弼禀性克宽克厚"; WM6, 命宫·右弼: "心怀宽恕好施济")*
- **[MENH-SP-02]** Văn Xương, Văn Khúc đắc địa: thông minh, hiếu học, thích văn chương nghệ thuật, học nhiều biết rộng. Gặp sát tinh hoặc Kỵ thì giảm. — *Nguồn: TB (WM4, "Văn Xương – Văn Khúc"); TT (WM7: "文曲武曲为人多学多能"; WM6, 命宫·文曲)*
- **[MENH-SP-03]** Thiên Khôi, Thiên Việt (quý nhân): thông minh, cao thượng, dễ được người trên nâng đỡ, thuận đường học hành. — *Nguồn: TB (WM4, "Thiên Khôi – Thiên Việt"); TT (WM7: "天魁天钺盖世文章"; "魁星临命位列三台")*
- **[MENH-SP-04]** Lộc Tồn: thận trọng, giỏi giữ của, nhân hậu, nhưng có phần cô độc. Đứng một mình ở Mệnh, không có sao hỗ trợ, thì dễ thành người chỉ lo giữ tiền. — *Nguồn: TB (WM4, "Lộc Tồn": "cô độc, nghiêm cẩn"); TT (WM6, 命宫·禄存: "老成持重… 单守命身，看财之奴")*
- **[MENH-SP-05]** Thiên Mã ở Mệnh: đa tài, năng động, hay di chuyển. Gặp Lộc Tồn ("Lộc Mã giao trì") thì công việc và tài lộc hanh thông. — *Nguồn: TB (WM4, "Thiên Mã"); TT (WM7: "天禄天马惊人甲第")*
- **[MENH-SP-06]** Kình Dương, Đà La đắc địa ở Thìn, Tuất, Sửu, Mùi: can đảm, quả quyết, nhanh nhẹn. Hãm thì dễ nóng nảy, liều lĩnh. Kình đi cùng Hỏa Tinh có thể thành uy quyền. — *Nguồn: TB (WM4, "Kình Dương – Đà La"); TT (WM7: "擎羊火星威权出众"; "巨破擎羊性必刚")*
- **[MENH-SP-07]** Hỏa Tinh, Linh Tinh: tính mạnh, nhanh. Đắc địa ở Dần, Mão, Thìn, Tỵ, Ngọ. Đi cùng Tham Lang miếu thì thành cách tốt (xem CC). Nếu không thì dễ nóng vội. — *Nguồn: TB (WM4, "Hỏa Tinh – Linh Tinh"); TT (WM7: "贪铃并守将相之名"; "火星铃星专作祸")*
- **[MENH-SP-08]** Địa Không, Địa Kiếp đắc ở Dần, Thân, Tỵ, Hợi: thành bại thất thường, "hoạnh phát hoạnh phá", như "thuyền giữa sóng". Nên tránh đầu cơ, giữ dự phòng tài chính. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM4, "Địa Kiếp – Địa Không"); TT (WM7: "命中遇劫恰如浪里行船")*
- **[MENH-SP-09]** Thiên Không cùng Hồng Loan ở Mệnh: cần khoảng lặng riêng, quan tâm đời sống tinh thần, ít đặt nặng danh lợi bề ngoài *(sách gốc diễn đạt "ẩn dật, muốn tu", đã trung tính hóa)*. Thiên Không cùng Đào Hoa: nhiều ý tưởng, khéo tính toán. — *Nguồn: TB (WM4, "Thiên Không"); WM1 (ví dụ Mệnh có Liêm, Thiên Không, Hồng Loan: "lòng chỉ muốn tu")*

### 1.4. Cách cục chính (CC)

- **[MENH-CC-01]** Tử Phủ đồng cung (Dần, Thân): phúc dày, đời sống vững vàng. — *Nguồn: TT (WM7: "紫府同宫终身福厚"); TB (WM4, Tử Vi: "Gặp Phủ: của cải súc tích")*
- **[MENH-CC-02]** Thất Sát triều đẩu / ngưỡng đẩu: Thất Sát thủ Mệnh ở Dần, Thân, Tý, Ngọ, có cát tinh, không gặp sát. Công danh lớn, tuổi trẻ vất vả rồi mới thành. — *Nguồn: TT (WM7: "七杀朝斗爵禄荣昌"; "朝斗仰斗爵禄荣昌"); WM9 (mục "Cách cục Thất Sát triều đẩu")*
- **[MENH-CC-03]** Thạch trung ẩn ngọc: Cự Môn ở Tý, Ngọ (V), gặp Lộc, Quyền, Khoa. Tài năng "ngọc trong đá", cần thời gian và Hóa Lộc hoặc Tuần Triệt để bộc lộ. Bền vững. — *Nguồn: TT (WM7: "子午巨门石中隐玉"; WM6: "身命居子午宫为石中隐玉格，更会科权禄，终身福厚"); TB (WM4, Cự Môn: "ví như ngọc quý giấu trong đá. Cần gặp Hóa Lộc… hay Tuần, Triệt")*
- **[MENH-CC-04]** Nhật chiếu lôi môn: Thái Dương ở Mão (V). Nguyệt lãng thiên môn: Thái Âm ở Hợi (M). Đều là cách sáng, chủ hiển đạt. — *Nguồn: TT (WM7: "日照雷门富贵荣华，月朗天门进爵封侯"; WM6: Thái Dương "卯宫庙"); TB (WM4: Thái Dương vượng ở Mão, Thái Âm miếu ở Hợi)*
- **[MENH-CC-05]** Nhật Nguyệt phản bối: Thái Dương và Thái Âm đều ở vị trí hãm, mất sáng. Bài luận nên nhấn vào sự bền bỉ và học cách tự tạo cơ hội. — *Nguồn: TT (WM7: "日月最嫌反背乃为失辉"); TB (WM4: Nhật hãm Thân–Tý, Nguyệt hãm Dần–Ngọ)*
- **[MENH-CC-06]** Tham Hỏa (hoặc Tham Linh) tương phùng: Tham Lang miếu, vượng gặp Hỏa hoặc Linh. Phát mạnh, có uy danh, nhất là trong kinh doanh hoặc lĩnh vực cạnh tranh. — *Nguồn: TT (WM7: "贪狼火星居庙旺名镇诸邦"; "贪铃并守将相之名"); TB (WM4, Thái Dương: "Hỏa, Linh đắc địa" tăng sáng; mục Tham Lang chủ uy quyền); KL (mục Tham Lang, "Tham lang thích Hỏa Linh… làm ăn phát đạt", mạnh nhất ở tứ mộ) (bản quét, đã đọc)*
- **[MENH-CC-07]** Sát Phá Tham (Thất Sát, Phá Quân, Tham Lang) ở tam phương Mệnh: đời nhiều biến động, hợp ra ngoài lập nghiệp, khai phá, đổi mới. — *Nguồn: TT (WM7: "七杀破军宜出外"); WM9 ("Thất Sát, Tham Lang, Phá Quân… chủ khai sáng cải cách")*
- **[MENH-CC-08]** Cơ Nguyệt Đồng Lương (Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương ở tam phương): hợp nghề chuyên viên, hành chính, tổ chức. Ổn định hơn là đột phá. — *Nguồn: TT (WM7: "机月同梁作吏人"); KL (phú Thiên Cơ, "Cơ Nguyệt Đồng Lương hội chiếu thường là công chức") (bản quét, đã đọc)*
- **[MENH-CC-09]** Mệnh vô chính diệu (không có chính tinh): mượn chính tinh ở cung xung chiếu (Thiên Di) để luận. TT xem đây là cách yếu. Nhóm diễn đạt trung tính: tính cách linh hoạt, chịu ảnh hưởng mạnh của hoàn cảnh và các sao phụ. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TT (WM7: "命无正曜，夭折孤贫"); TB (WM2, mục 2.47: "Vô Chính diệu: coi Chính diệu xung chiếu như Chính diệu tọa thủ")*
- **[MENH-CC-10]** Phủ Tướng triều viên: Thiên Phủ và Thiên Tướng chiếu về Mệnh. Mệnh vững, cơm áo đầy đủ. — *Nguồn: TT (WM7, 女命骨髓赋: "府相朝垣命必荣"; 斗数骨髓赋: "天府天相乃为衣禄之神"); KL (mục Cách cục, xếp vào Quí cách: "Phủ tướng triều viên") (bản quét, đã đọc)*

### 1.5. Tứ hóa tại Mệnh (HOA)

- **[MENH-HOA-01]** Hóa Lộc ở Mệnh: phúc lộc, tài lộc tăng, giữ được vị trí. Gặp sát tinh cũng không hại nhiều. Riêng khi gặp Không Kiếp hoặc Hao thì dễ hao tán. — *Nguồn: TT (WM7, 问化禄: "禄为福德之神… 恶曜来临并羊陀火忌冲照，亦不为害"); TB (WM4, "Hóa Lộc": "Tăng tài, tiến lộc… Gặp Kiếp, Không… hao tán")*
- **[MENH-HOA-02]** Hóa Quyền ở Mệnh: mạnh mẽ, quyết đoán, thích nắm quyền. Gặp Khoa, Lộc thì dễ thành người dẫn đầu. Gặp sát thì dễ bị gièm pha. — *Nguồn: TT (WM7, 问化权: "守身命科禄相逢出将入相… 如逢羊陀耗使劫空，听谗贻累"); TB (WM4, "Hóa Quyền": "gặp sao tốt thêm tốt, gặp sao xấu thêm xấu")*
- **[MENH-HOA-03]** Hóa Khoa ở Mệnh: thông minh, học rộng, có danh tiếng về học thuật. Gặp sát tinh vẫn ít hại. — *Nguồn: TT (WM7, 问化科: "主掌文墨之星… 虽四杀冲破，亦为富贵"); TB (WM4, "Hóa Khoa": "Gặp sát tinh: vô hại")*
- **[MENH-HOA-04]** Hóa Kỵ ở Mệnh: việc hay trục trặc, dễ đa nghi, hay lo. Lời khuyên của chính TT là "làm việc chỉ cầu bảy phần" (đặt kỳ vọng vừa phải). Kỵ ở tứ mộ, hoặc Mệnh dương gặp năm sinh dương, thì nhẹ hơn. — *Nguồn: TT (WM7, 问化忌: "守身命一生不顺… 处事只求七分"); TB (WM4, "Hóa Kỵ": đắc địa tứ mộ "đỡ lo ngại"; Mệnh dương, tuổi dương "chiết giảm")*
- **[MENH-HOA-05]** Hóa Kỵ ở Sửu, Mùi cùng Nhật Nguyệt: Kỵ trở thành "mây ngũ sắc", làm Nhật Nguyệt sáng thêm. — *Nguồn: TB (WM4, "Hóa Kỵ"); KL (mục Thái Dương, "đồng cung với Hóa ky tại Sửu, Mùi thì thật toàn mỹ"; mục Thái Âm ý tương tự) (bản quét, đã đọc)*

### 1.6. Điểm còn tranh luận (TRANH)

- **[MENH-TRANH-01]** Độ sáng Thất Sát ở Hợi: spec ghi H. TB ghi vượng ở Tỵ, Hợi. TT ghi Tỵ, Hợi "和平" (bình). Cần chuyên gia chốt. Tạm theo spec, nhưng khi luận Tử Sát ở Hợi không nên viết theo hướng hãm. — *Nguồn: spec mục 6; TB (WM4, Thất Sát); TT (WM6, 七杀: "巳亥宫和平")*
- **[MENH-TRANH-02]** Thất Sát ở Thìn, Tuất: TB và spec ghi hãm. TT ghi "入庙" (miếu). Thất Sát ở Mão, Dậu: TT ghi "旺地". Đây là khác biệt giữa sách Việt và Toàn Thư. — *Nguồn: TB (WM4); TT (WM6, 七杀 thơ cung vị)*
- **[MENH-TRANH-03]** Thiên Lương ở Tý: TB ghi vượng, spec ghi Đ. Phá Quân ở Thìn, Tuất: TB ghi đắc, spec ghi V. Phá Quân ở Dần, Thân: TT ghi "得地", TB và spec ghi hãm. — *Nguồn: TB (WM4, WM5 tr.55); TT (WM6, 破军); spec mục 6*
- **[MENH-TRANH-04]** Thiên Cơ ở Sửu, Mùi: TT ghi "陷地" (hãm). TB và spec ghi đắc. — *Nguồn: TT (WM6, 天机: "丑未宫陷地"); TB (WM4)*
- **[MENH-TRANH-05]** Thiên Phủ gặp Kình Đà Hỏa Linh: TB cho rằng Phủ chế được sát. TT cho rằng gặp sát thì sinh toan tính. Gợi ý: viết "có khả năng kiểm soát rủi ro, nhưng cần tránh tính toán quá mức". *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (WM4); TT (WM6)*
- **[MENH-TRANH-06]** Mệnh vô chính diệu: TT đánh giá rất thấp. TB (và cách làm phổ biến ở Việt Nam) mượn sao xung chiếu, không coi là xấu mặc nhiên. Bài trả phí **không** viết theo hướng TT. — *Nguồn: TT (WM7); TB (WM2, mục 2.47)*
- **[MENH-TRANH-07]** Mốc ứng của cung Thân: WM1 nêu "từ 30 tuổi". TC chỉ nói "hậu thiên", không nêu tuổi. Bài luận nên nói "nửa sau cuộc đời, càng trưởng thành càng rõ", không chốt tuổi. — *Nguồn: WM1; TC (WM8)*
- **[MENH-TRANH-08]** Phần luận theo can năm sinh (ví dụ "người tuổi Giáp, Canh…") có rất nhiều trong TT nhưng ít xuất hiện trong TB. Chưa đưa vào bộ quy tắc. Cần quyết định có dùng hay không. — *Nguồn: TT (WM6, các dòng "…生人财官格"); TB (WM4, không có phần này)*

---

## 2. Cung Huynh Đệ

### 2.1. Ý nghĩa cung (YN)

- **[HUYNH-YN-01]** Cung Huynh Đệ cho biết về anh chị em: đông hay ít, hòa thuận hay xa cách, có giúp được nhau không. Trước khi xét sao ở cung này phải xem cung Phúc Đức. Phúc Đức tốt thì bù được phần xấu của cung Huynh Đệ; Phúc Đức kém thì phần tốt cũng giảm. — *Nguồn: TB (WM2, phần dẫn cung Huynh Đệ); TC (WM8, mục "2- Cung Huynh đệ": xét cùng tam phương tứ chính)*
- **[HUYNH-YN-02]** Cung đối là Nô Bộc (Giao Hữu), tam hợp là Điền Trạch và Tật Ách. Theo Trung Châu, cung này còn dùng để xem bạn đồng môn, đồng nghiệp ngang cấp, tức "người cùng xuất thân". — *Nguồn: TC (WM8, mục 2); spec mục 2.4 (thứ tự cung); NL (Giây liên lạc Bào với Nô, "Bào và Nô mới đứng song hàng"; ý đồng nghiệp ngang cấp chỉ thấy ở TC) (bản quét, đã đọc)*
- **[HUYNH-YN-03]** Sách cổ ghi số anh chị em cụ thể theo từng sao. Trong xã hội hiện đại, gia đình ít con, nên con số này **không** dùng làm phán đoán. Bài luận chỉ nói xu hướng: gắn bó hay xa cách, hỗ trợ hay cạnh tranh. Số người ghi trong ngoặc ở mục 2.2 chỉ để chuyên gia tham khảo. — *Nguồn: TC (WM8: "dùng Tử Vi Đẩu Số luận đoán cung Huynh đệ… có khuyết điểm rất lớn" trong xã hội hiện đại); TB (WM2: "chỉ là tương đối chính xác… phải suy luận thêm bớt")*
- **[HUYNH-YN-04]** Nhóm sao "ổn định" (Tử Vi, Thiên Phủ, Thiên Tướng, Thiên Đồng, Thiên Lương) ở cung Huynh Đệ nói chung chủ anh em hòa hợp. Nhóm sao "động" (Tham Lang, Vũ Khúc, Thất Sát, Phá Quân, Thiên Cơ) chủ khó đồng lòng. Gặp thêm sát tinh thì dễ tranh chấp. — *Nguồn: TC (WM8, mục 2); TT (WM6, 兄弟: Thất Sát "主孤克", Vũ Khúc "不合", Phá Quân "陷地加杀孤单")*
- **[HUYNH-YN-05]** Chính tinh Nam Đẩu (Thiên Phủ, Thiên Tướng, Thiên Lương, Thất Sát, Thiên Đồng, Thái Dương, Thiên Cơ) ở cung này thì anh em trai nhiều hơn. Chính tinh Bắc Đẩu (Thái Âm, Tham Lang, Cự Môn, Liêm Trinh, Vũ Khúc, Phá Quân) thì chị em gái nhiều hơn. Có cả hai loại thì xét cung dương hay âm. — *Nguồn: TB (WM2, mục "1. Tiên quyết") ⚑1nguồn*
- **[HUYNH-YN-06]** Cung Huynh Đệ vô chính diệu: mượn chính tinh ở cung xung chiếu (Nô Bộc) để luận. — *Nguồn: TB (WM2, mục 2.47); TT (WM6, 子女 có nguyên tắc tương tự: "如本宫无星曜专看对宫") ⚑1nguồn*

### 2.2. 14 chính tinh tại Huynh Đệ

#### Tử Vi
- **[HUYNH-TV-01]** Tử Vi ở Ngọ (M): có anh hoặc chị lớn, anh chị em đều khá giả, có thể nương tựa nhau. — *Nguồn: TB (WM2, 2.1: "Đơn thủ tại Ngọ: có anh trên, anh chị em đều khá giả"); TT (WM6, 兄弟: "紫微有倚靠年长之兄")*
- **[HUYNH-TV-02]** Tử Vi ở Tý (B): vẫn có anh hoặc chị lớn, nhưng anh chị em thường xa nhau từ nhỏ. Gặp Kình Đà Hỏa Linh Không Kiếp thì kém hòa thuận. — *Nguồn: TB (WM2, 2.1); TT (WM6: "加羊陀火铃空劫克害有则欠和")*
- **[HUYNH-TV-03]** Tử Phủ: anh chị em khá đông (khoảng 3 người), đều có vị thế. Tử Tướng: đông, khá giả nhưng ít nhường nhịn nhau. Tử Phá: có thể có anh chị em khác cha hoặc khác mẹ, sớm xa cách. — *Nguồn: TB (WM2, 2.1); TT (WM6: "天府同三人，天相同三四人，破军同亦有三人，或各胞生")*

#### Liêm Trinh
- **[HUYNH-LT-01]** Liêm Trinh ở Dần, Thân (V): ít anh chị em (khoảng 2), tình cảm ổn. Liêm Tướng: hai người, đều có vị thế. Liêm Phủ: khá giả nhưng không hợp tính. — *Nguồn: TB (WM2, 2.2); TT (WM6, 兄弟: "廉贞入庙二人… 天相同二人… 天府同加左右昌曲有三人")*
- **[HUYNH-LT-02]** Liêm Tham, Liêm Sát, Liêm Phá (đều là các tổ hợp có sao hãm hoặc nhiều động): anh chị em ít, dễ bất đồng, mỗi người một ngả. Cần chủ động giữ liên lạc và minh bạch khi có chuyện chung về tài sản. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM2, 2.2); TT (WM6: "贪狼同招怨… 七杀同一人… 见羊陀火铃空劫有克且不和")*

#### Thiên Đồng
- **[HUYNH-TD-01]** Thiên Đồng ở Mão (Đ): anh chị em đông. Đồng Nguyệt ở Tý: đông, thuận hòa, khá giả, chị em gái nhiều hơn. Đồng Lương (Dần, Thân): khá giả. — *Nguồn: TB (WM2, 2.3); TT (WM6, 兄弟: "天同入庙四五人，天梁同二三人… 太阴同四五人")*
- **[HUYNH-TD-02]** Thiên Đồng ở Thìn, Tuất (H), hoặc Đồng Nguyệt ở Ngọ: ít anh chị em, dễ xa cách. Đồng Cự (Sửu, Mùi): trong nhà dễ thiếu hòa khí, ở riêng mới êm. — *Nguồn: TB (WM2, 2.3); TT (WM6: "陷地，只二人，见羊陀火铃空劫忌，少宜分居不和")*

#### Vũ Khúc
- **[HUYNH-VK-01]** Vũ Khúc ở Thìn, Tuất (M): ít anh chị em (khoảng 2), khá giả nhưng không hợp tính. Vũ Phủ: có của, có vị thế. Vũ Tham: về sau đều khá nhưng sớm mỗi người một nơi. — *Nguồn: TB (WM2, 2.4); TT (WM6, 兄弟: "武曲庙旺有二人，不合")*
- **[HUYNH-VK-02]** Vũ Phá (Tỵ, Hợi, H) và Vũ Sát (Mão, Dậu): ít anh chị em, dễ va chạm, nên sống riêng. Gặp Xương Khúc, Tả Hữu thì khá hơn. — *Nguồn: TB (WM2, 2.4); TT (WM6: "破军七杀同有一人，不和睦，加昌曲左右有三人")*

#### Thái Dương
- **[HUYNH-TDU-01]** Thái Dương ở Thìn, Tỵ, Ngọ (V/M): anh chị em đông, có vị thế, anh em trai nhiều hơn. Nhật Lương ở Mão: đông, đều hiển đạt. — *Nguồn: TB (WM2, 2.5); TT (WM6, 兄弟: "太阳庙旺三人… 太阴同五人")*
- **[HUYNH-TDU-02]** Thái Dương ở Tuất, Hợi, Tý (H): ít, không hòa, khó giúp nhau. Nhật Cự ở Thân: ít, bất đồng, nên ở xa. — *Nguồn: TB (WM2, 2.5); TT (WM6: "陷地，不和欠力，加羊陀火铃空劫更克减半")*

#### Thiên Cơ
- **[HUYNH-TCO-01]** Thiên Cơ ở Tỵ, Ngọ, Mùi (V/Đ): ít đến vừa (tối đa khoảng 3). Cơ Lương (Thìn, Tuất): hai người, khá giả và thuận hòa. Cơ Nguyệt ở Thân: khoảng ba người. — *Nguồn: TB (WM2, 2.6); TT (WM6, 兄弟: "天机庙旺有二人… 天梁同二人，太阴同二三人")*
- **[HUYNH-TCO-02]** Thiên Cơ ở Hợi (H), hoặc Cơ Cự (Mão, Dậu): ít, khó đồng lòng. Gặp sát tinh thì dễ va chạm. — *Nguồn: TB (WM2, 2.6: Cơ Cự "không hợp tính nhau"); TT (WM6: "与巨门同二人，陷地，相背不一心… 见羊陀火铃虽有而克害")*

#### Thiên Phủ
- **[HUYNH-TP-01]** Thiên Phủ ở Tỵ, Hợi (Đ): anh chị em đông (TB ghi từ 5 người). Tử Phủ có Tả Hữu, Xương Khúc thì càng đông. — *Nguồn: TB (WM2, 2.7); TT (WM6, 兄弟: "天府有五人，紫微同加左右昌曲有六七人")*
- **[HUYNH-TP-02]** Thiên Phủ ở Sửu, Mùi, Mão, Dậu (B/Đ), hoặc gặp sát tinh: số người giảm, trong nhà dễ thiếu hòa khí. — *Nguồn: TB (WM2, 2.7: "trong nhà thiếu hòa khí"); TT (WM6: "见羊陀火铃空劫只二人")*

#### Thái Âm
- **[HUYNH-TA-01]** Thái Âm ở Dậu, Tuất, Hợi (M): đông, khá giả, chị em gái nhiều hơn. Thái Âm gặp Khoa, Quyền cũng đông. — *Nguồn: TB (WM2, 2.8); TT (WM6, 兄弟: "太阴入庙兄弟五人… 科权同四五人")*
- **[HUYNH-TA-02]** Thái Âm ở Mão, Thìn, Tỵ (H): ít, khó sống gần nhau lâu. Gặp sát tinh thì số giảm, nên ở riêng. *(sách gốc có câu nặng về sức khỏe anh chị em, đã bỏ)* — *Nguồn: TB (WM2, 2.8: "Anh chị em không thể chung sống với nhau lâu được"); TT (WM6: "见羊陀火铃空劫减半，且克宜分居相背")*

#### Tham Lang
- **[HUYNH-THL-01]** Tham Lang ở Thìn, Tuất (V): khoảng hai người. Tử Tham (Mão, Dậu): tối đa khoảng ba, thường mỗi người một nơi, tự lập vất vả. — *Nguồn: TB (WM2, 2.9); TT (WM6, 兄弟: "贪狼庙旺二人… 紫微同有三人")*
- **[HUYNH-THL-02]** Tham Lang ở Tý, Ngọ (H) hoặc Liêm Tham (Tỵ, Hợi): ít, dễ bất hòa, có thể có anh chị em khác cha hoặc khác mẹ. Gặp sát thì càng ít gắn bó. — *Nguồn: TB (WM2, 2.9: "có thêm nhiều anh chị em dị bào"; Liêm Tham "thiếu hòa khí"); TT (WM6: "陷地宜各胞，廉贞同不和… 加羊陀火铃空劫孤单")*

#### Cự Môn
- **[HUYNH-CM-01]** Cự Môn ở Tý, Ngọ, Hợi (V/Đ): khoảng hai người, hay bất đồng ý kiến. Nhật Cự ở Dần có Tả Hữu, Xương Khúc: khoảng ba người, khá giả. — *Nguồn: TB (WM2, 2.10); TT (WM6, 兄弟: "巨门庙旺二人… 太阳同加左右昌曲有三人")*
- **[HUYNH-CM-02]** Cự Môn ở Thìn, Tuất, Tỵ (H): ít, nên ở riêng, đôi khi có anh chị em khác cha hoặc khác mẹ. Lời ăn tiếng nói dễ gây hiểu lầm giữa anh em. — *Nguồn: TB (WM2, 2.10); TT (WM6: "陷地，各胞有，宜分居"; WM7: "巨到二宫，必是兄弟无义" → đã trung tính hóa)*

#### Thiên Tướng
- **[HUYNH-TT-01]** Thiên Tướng ở Tỵ, Hợi, Sửu, Mùi (Đ): từ hai người trở lên, tương đối hòa. Tử Tướng: đông. Liêm Tướng: đều có vị thế. — *Nguồn: TB (WM2, 2.11); TT (WM6, 兄弟: "天相和平有二三人… 紫微同有三四人… 廉贞同二人")*
- **[HUYNH-TT-02]** Thiên Tướng ở Mão, Dậu (H), hoặc gặp sát tinh: ít, ít gắn bó. — *Nguồn: TB (WM2, 2.11: "nhiều nhất là hai người"); TT (WM6: "见杀全无… 见羊陀火铃空劫孤单")*

#### Thiên Lương
- **[HUYNH-TL-01]** Thiên Lương ở Tý, Ngọ (Đ/M): hai hoặc ba người, khá giả và thuận hòa. Đồng Lương: ba người, khá giả. — *Nguồn: TB (WM2, 2.12); TT (WM6, 兄弟: "天梁庙旺二人和顺… 天同同三人")*
- **[HUYNH-TL-02]** Thiên Lương ở Tỵ, Hợi (H): ít, sớm xa nhau, có người sống phóng khoáng, hay đi xa. Gặp sát thì ít hơn. — *Nguồn: TB (WM2, 2.12); TT (WM6: "陷宫全无… 见羊陀火铃空劫少")*
- **[HUYNH-TL-03]** Thiên Lương ở Huynh Đệ gặp Kình Dương đồng cung: dễ có tranh chấp kéo dài với anh em hoặc đồng nghiệp. Nên rõ ràng giấy tờ. — *Nguồn: TC (WM8, mục 2: "Thiên lương thủ cung Huynh đệ gặp Kình dương đồng độ chủ về kiện tụng liên miên"); KL lại cho rằng, nói chung, "Thiên lương không sợ Kình dương" (không xét riêng cung này) (bản quét, đã đọc) ⚑1nguồn*

#### Thất Sát
- **[HUYNH-TS-01]** Thất Sát chủ "cô": ít anh chị em, mỗi người độc lập. Ở Dần, Thân (M): khá giả nhưng ít hòa. Ở Tý, Ngọ: khoảng ba người (theo TT), nên ở riêng. Gặp Xương Khúc, Tả Hữu thì tốt hơn. — *Nguồn: TT (WM6, 兄弟: "七杀主孤克，在子午寅申宫方有三人，也不和宜各人，加昌曲左右更好"); TB (WM2, 2.13: Dần Thân "tuy khá giả nhưng khiếm hòa")*
- **[HUYNH-TS-02]** Thất Sát ở Thìn, Tuất (H): rất ít anh chị em hoặc ít gắn bó. Tử Sát: tối đa khoảng ba, đều khá giả. *(sách gốc ghi "không có anh chị em", đã trung tính hóa)* — *Nguồn: TB (WM2, 2.13); TT (WM6: "七杀主孤克")*

#### Phá Quân
- **[HUYNH-PQ-01]** Phá Quân ở Tý, Ngọ (M): khoảng ba người, khá giả nhưng ít hòa, sớm xa nhau. Có Xương Khúc, Tả Hữu thì hòa thuận hơn. — *Nguồn: TB (WM2, 2.14); TT (WM6, 兄弟: "破军入庙三人… 加昌曲左右有三人和睦")*
- **[HUYNH-PQ-02]** Phá Quân ở Dần, Thân, Thìn, Tuất (H/V), hoặc gặp sát tinh: ít, khó sống gần nhau. Vũ Phá, Liêm Phá: dễ xích mích. — *Nguồn: TB (WM2, 2.14); TT (WM6: "陷地加杀孤单，武曲同二人… 廉贞同一人")*

### 2.3. Bộ sao phụ quan trọng (SP)

- **[HUYNH-SP-01]** Tả Phụ, Hữu Bật: thêm anh chị em, biết giúp nhau. Gặp sát thì vẫn có nhưng ít hỗ trợ. — *Nguồn: TB (WM2, 2.18); TT (WM6, 兄弟: "左辅有三人… 有空劫欠力不和")*
- **[HUYNH-SP-02]** Văn Xương, Văn Khúc: anh chị em thông minh, có học, có danh. Gặp nhiều sao xấu thì giảm. — *Nguồn: TB (WM2, 2.16); TT (WM6: "文昌文曲诸宫皆有三人… 陷宫孤单")*
- **[HUYNH-SP-03]** Khôi, Việt: anh chị em có vị thế. Khoa, Quyền, Lộc: anh chị em giỏi giang, có thể có người thành đạt hơn mình. — *Nguồn: TB (WM2, 2.17, 2.20); TC (WM8: gặp Lộc Quyền Khoa "trong số anh chị em ắt sẽ có người được cảnh ngộ khá hơn mệnh tạo")*
- **[HUYNH-SP-04]** Lộc Tồn: ít anh chị em, khá giả nhưng sớm xa nhau. Gặp sát thì dễ va chạm. — *Nguồn: TB (WM2, 2.19); TT (WM6: "禄存相生有兄弟见杀克害招怨")*
- **[HUYNH-SP-05]** Kình, Đà, Hỏa, Linh, Không, Kiếp: anh chị em dễ ở xa nhau, hoặc có cạnh tranh, đố kỵ. Đi cùng nhiều sao tốt thì số người giảm và có bất hòa. Đi cùng nhiều sao xấu thì rất ít gắn bó. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM2, 2.15); TC (WM8: "chủ về anh em ở riêng nơi khác hoặc bất lợi"); TT (WM6: các dòng "加羊陀火铃空劫…")*
- **[HUYNH-SP-06]** Thiên Mã: anh chị em khá giả nhưng không ở gần nhau. Song Hao: giảm số người, có người tiêu xài phóng tay. — *Nguồn: TB (WM2, 2.22, 2.23) ⚑1nguồn*
- **[HUYNH-SP-07]** Quang, Quý: có anh chị em nuôi hoặc anh chị em kết nghĩa. — *Nguồn: TB (WM2, 2.24) ⚑1nguồn*

### 2.4. Cách cục chính (CC)

- **[HUYNH-CC-01]** Tử Vi gặp Tả Hữu: anh chị em khá giả, thuận hòa. — *Nguồn: TB (WM2, 2.35); TT (WM6, 兄弟: "右弼三人，同府相紫微昌曲有四五人")*
- **[HUYNH-CC-02]** Nhật Nguyệt cùng Thai, hoặc Thai được Nhật Nguyệt giáp: có thể có anh chị em sinh đôi. — *Nguồn: TB (WM2, 2.37); KL (mục Thái Âm, phần Bào: "Nhật, Nguyệt giáp Thai có anh em song sinh") (bản quét, đã đọc)*
- **[HUYNH-CC-03]** Tuế, Xương, Khúc: trong anh chị em có người rất nổi bật về học vấn và công danh. — *Nguồn: TB (WM2, 2.42) ⚑1nguồn*
- **[HUYNH-CC-04]** Tang Môn, Thiên Mã, hoặc Tang Môn, Trực Phù, Thái Tuế: anh chị em hay tranh luận, mỗi người một nơi. Nên giữ hòa khí khi bàn chuyện chung. — *Nguồn: TB (WM2, 2.40, 2.41) ⚑1nguồn*
- **[HUYNH-CC-05]** Cung Huynh Đệ có sao Hình, Kỵ, lại gặp Thiên Vu: dễ tranh chấp tài sản với anh em, hoặc tranh quyền lợi với đồng nghiệp. — *Nguồn: TC (WM8, mục 2); TB (WM2, 2.39: "Phá, Hình, Kỵ: anh chị em làm hại nhau" → đã trung tính hóa)*
- **[HUYNH-CC-06]** Vô chính diệu: xem HUYNH-YN-06. Tuần, Triệt án ngữ: anh chị em khó sống gần nhau lâu, anh hoặc chị cả có thể phải lập nghiệp xa. *(sách gốc có câu về tuổi thọ anh cả, đã bỏ)* — *Nguồn: TB (WM2, 2.34) ⚑1nguồn*

### 2.5. Tứ hóa tại Huynh Đệ (HOA)

- **[HUYNH-HOA-01]** Hóa Lộc, Hóa Quyền, Hóa Khoa: anh chị em giỏi giang, có của, học giỏi. Lộc, Quyền, Khoa có khi chỉ chủ anh chị em đông. — *Nguồn: TB (WM2, 2.20); TC (WM8, mục 2)*
- **[HUYNH-HOA-02]** Hóa Kỵ: anh chị em bất đồng, xa cách. Kỵ cùng Hình hoặc sát tinh thì dễ tranh chấp. Nên giao tiếp thẳng thắn và rõ ràng chuyện tiền bạc. — *Nguồn: TB (WM2, 2.21); TC (WM8: "gặp thêm các sao Hình - Kị thì chủ về xảy ra kiện tụng" → đã trung tính hóa)*

### 2.6. Điểm còn tranh luận (TRANH)

- **[HUYNH-TRANH-01]** Số lượng anh chị em: TB và TT đều ghi con số cụ thể, nhiều chỗ khớp nhau (Tử Phủ 3, Liêm Tướng 2, Thiên Phủ đơn thủ 5, Thái Âm miếu 5), nhưng cũng có chỗ lệch (Thất Sát ở Tý, Ngọ: TT ghi 3, TB ghi "may lắm 1"). TC cho rằng cách luận số lượng đã lỗi thời. Quyết định: không đưa con số vào bài trả phí. — *Nguồn: TB (WM2); TT (WM6, 兄弟); TC (WM8)*
- **[HUYNH-TRANH-02]** TB phân mức tốt xấu theo vị trí, khác bảng độ sáng của spec ở vài ô. Thiên Đồng ở Tỵ, Hợi: spec ghi Đ, nhưng TB xếp vào nhóm kém (tối đa 2, xa cách). Thiên Cơ ở Tý: spec ghi Đ, nhưng TB xếp cùng nhóm kém với Hợi, Sửu. Khi luận theo TB, ghi rõ đây là "luận theo vị trí của TB". — *Nguồn: TB (WM2, 2.3, 2.6); spec mục 6*
- **[HUYNH-TRANH-03]** Phạm vi cung: TB chỉ xét anh chị em ruột (thêm anh chị em dị bào, anh chị em nuôi). TC mở rộng sang bạn đồng môn và đồng nghiệp ngang cấp. Gợi ý cho bài hiện đại: nói cả hai, ưu tiên anh chị em. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (WM2); TC (WM8)*
- **[HUYNH-TRANH-04]** TB có nhiều tổ hợp về đạo đức hoặc tình dục của anh chị em (ví dụ Hồng, Đào, Cái; Đào, Riêu, Hỷ). Nhóm **không đưa** các tổ hợp này vào, vì phán xét người thứ ba và trái giọng thương hiệu. — *Nguồn: TB (WM2, 2.43–2.45)*
- **[HUYNH-TRANH-05]** Nam/Bắc Đẩu quyết định anh em trai hay chị em gái nhiều hơn (HUYNH-YN-05): chỉ thấy trong TB, chưa thấy trong TT hay TC. Chưa nên dùng. — *Nguồn: TB (WM2, mục 1) ⚑1nguồn*

---

## 3. Cung Phu Thê

### 3.1. Ý nghĩa cung (YN)

- **[PHU-YN-01]** Cung Phu Thê cho biết về hôn nhân: dễ hay khó thành, mức hòa hợp, mẫu người phối ngẫu, thời điểm lập gia đình thuận lợi. Trước khi xét sao ở Phu Thê phải luận Mệnh, Thân, Phúc Đức, rồi đến Quan Lộc, Nô Bộc. Mệnh, Thân, Phúc Đức tốt thì giảm được nhiều phần bất lợi của cung Phu Thê. — *Nguồn: TB (WM3, phần dẫn; WM5 tr.266 theo người chép); WM1 (mục "Phải xem Mệnh, Thân, Phúc")*
- **[PHU-YN-02]** Tam phương tứ chính của Phu Thê gồm Quan Lộc (đối cung), Phúc Đức và Thiên Di (tam hợp). Luận Phu Thê phải đặt cạnh tinh hệ cung Mệnh, rồi dung hòa hai bên. — *Nguồn: TC (WM8, mục "3- Cung Phu Thê"); TB (WM3, phần dẫn: phối hợp Mệnh, Thân, Phúc, Quan, Nô)*
- **[PHU-YN-03]** Chính tinh mạnh hơn trung tinh. Chính tinh tốt gặp trung tinh xấu thì giảm tốt chứ không thành xấu. Chính tinh xấu gặp trung tinh tốt thì bớt xấu chứ chưa thành tốt. — *Nguồn: WM1 (mục "Ảnh hưởng chính tinh so với trung tinh"); TB (WM3, cấu trúc: luận chính tinh trước, phụ tinh sau) ⚑1nguồn*
- **[PHU-YN-04]** Nhiều cát tinh chưa chắc đã tốt, hung tinh chưa chắc đã xấu. Ví dụ Xương Khúc chủ phối ngẫu chu đáo nhưng cũng dễ có người thứ ba; Đà La chủ phối ngẫu xa quê, nhưng gặp Lộc Tồn, Thiên Mã thì phát ở xa và tình cảm tốt. — *Nguồn: TC (WM8, mục 3); TB (WM3, 16: Xương Khúc "thường có vợ lẽ, nhân tình")*
- **[PHU-YN-05]** Nhiều cách ghi "nên muộn lập gia đình". Kinh nghiệm Việt Nam cho rằng điều này rất nghiệm: kết hôn khi đã chín chắn thì tránh được phần lớn đổ vỡ. Trong bài luận diễn đạt là "kết hôn khi đã hiểu rõ nhau, ổn định sự nghiệp", không chốt tuổi. — *Nguồn: WM1 (mục "Trường hợp phải lập gia đình trễ mới tốt"); TT (WM6, 三妻妾: nhiều sao ghi "迟娶吉", "晚娶谐老")*
- **[PHU-YN-06]** Phu Thê vô chính diệu: mượn chính tinh ở cung xung chiếu (Quan Lộc) để luận. — *Nguồn: TB (WM2, 2.47, nguyên tắc chung áp cho mọi cung; trong WM3 không lặp lại) ⚑1nguồn*

### 3.2. 14 chính tinh tại Phu Thê

#### Tử Vi
- **[PHU-TV-01]** Tử Vi ở Ngọ (M) hoặc Tử Phủ: hòa hợp lâu bền, cả hai đều khá giả. TT nói Tử Vi ở Phu thì cưới muộn sẽ bền, người phối ngẫu tính cương. — *Nguồn: TB (WM3, 1; WM5 tr.266); WM1 ("Tử vi tại Ngọ: hòa hợp đến già, khá giả"); TT (WM6, 三妻妾: "紫微晚聘谐老性刚，天府同谐老")*
- **[PHU-TV-02]** Tử Phá (Sửu, Mùi): dễ giận hờn, kém thuận hòa. Tử Tham: nên cưới muộn, cần chú ý tính ghen. Tử Sát: lúc đầu trắc trở rồi thành. Gặp sát tinh thì càng cần kiên nhẫn. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM3, 1); WM1 (Tử Phá "kém thuận hòa", Tử Tham "trễ mới tốt, ghen tuông", Tử Sát "tiên trở hậu thành"); TT (WM6: "破军同刑剋，加羊陀火铃亦刑，贪狼同有吉星免刑")*
- **[PHU-TV-03]** Tử Tướng (Thìn, Tuất): cả hai đều cứng cỏi, lúc đầu hòa sau dễ xích mích nhưng vẫn khá giả. Hợp khi người chồng lớn tuổi hơn. — *Nguồn: TB (WM3, 1); WM1 ("Tử Tướng: cùng cứng cỏi, xích mích. Nhưng khá giả")*

#### Liêm Trinh
- **[PHU-LT-01]** Liêm Phủ (Thìn, Tuất): nên cưới muộn. Cả hai tính mạnh nhưng sống được với nhau lâu dài, gia đình sung túc, có danh giá. — *Nguồn: TB (WM3, 2); WM1 ("Liêm Phủ: trễ mới tốt. Chung sống tốt, khá giả"); TT (WM6: "府谐老性刚者无克")*
- **[PHU-LT-02]** Liêm Trinh ở Dần, Thân, hoặc Liêm Tham, Liêm Sát, Liêm Phá, Liêm Tướng: tình duyên nhiều thay đổi, dễ bất hòa. Nên tìm hiểu kỹ, cưới muộn và giữ giao tiếp cởi mở. *(sách gốc ghi "ba lần lập gia đình", "tử biệt sinh ly", đã trung tính hóa)* — *Nguồn: TB (WM3, 2); WM1 ("Liêm đơn thủ Dần Thân: mấy lần lập gia đình"; Liêm Tướng, Liêm Phá "bất hòa"); TT (WM6: "廉贞三度作新郎，即贪狼同愈克七杀同亦刑")*

#### Thiên Đồng
- **[PHU-TD-01]** Thiên Đồng ở Mão (Đ): cưới muộn thì mọi việc dễ và bền lâu. Đồng Lương (Dần, Thân): sớm thành đôi, thường là người quen hoặc hai gia đình thân nhau, đẹp đôi. Đồng Nguyệt ở Tý: tương tự, người chồng thường nể và được nhờ vợ. — *Nguồn: TB (WM3, 3); WM1 ("Đồng tại Mão: trễ mới tốt"; "Đồng Lương… đẹp đôi, khá giả, cưới sớm"); TT (WM6: "天同迟娶谐老… 天梁同极美夫妇")*
- **[PHU-TD-02]** Thiên Đồng ở Dậu, Thìn, Tuất (H), Tỵ, hoặc Đồng Cự (Sửu, Mùi): dễ đến dễ đi, hay cãi nhau, có thể xa cách một thời gian rồi mới đoàn tụ. Gặp tứ sát thì càng cần nhẫn nại. — *Nguồn: TB (WM3, 3); WM1 ("Đồng tại Dậu: bất hòa"; "Đồng Cự: xa nhau một thời rồi mới đoàn tụ"); TT (WM6: "加四杀欠和生离，巨门同加四杀亦克")*

#### Vũ Khúc
- **[PHU-VK-01]** Vũ Khúc ở Thìn, Tuất (M): nên cưới muộn, hợp người gần tuổi. Gặp cát tinh thì nhờ phối ngẫu mà có của. Vũ Phủ: đôi khi bất hòa nhưng cùng hưởng giàu sang. Vũ Tướng: phối ngẫu đảm đang, có của. — *Nguồn: TB (WM3, 4); WM1 ("Vũ khúc tại Thìn Tuất: trễ mới tốt"; "Vũ Phủ… khá giả đến già"); TT (WM6: "武曲背克宜迟娶，同年夫妇也相当，加吉星因妻得财")*
- **[PHU-VK-02]** Vũ Sát (Mão, Dậu), Vũ Phá (Tỵ, Hợi, H): cả hai đều mạnh và giỏi, nhưng cưới sớm thì dễ va chạm và đổ vỡ. Nên kết hôn khi đã chín chắn. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM3, 4); WM1 ("Vũ Sát: hình khắc, dễ xa nhau"; "Vũ Phá: giỏi, trễ mới tốt"); TT (WM6: "七杀同克二三妻，加羊陀火铃空劫更克")*
- **[PHU-VK-03]** Vũ Tham (Sửu, Mùi): nên cưới muộn, hai người thường chênh tuổi nhiều. Cả hai đều tài giỏi, đảm đang. — *Nguồn: TB (WM3, 4); WM1 ("Vũ Tham: trễ mới tốt"); TT (WM6: "贪狼同招迟无刑")*

#### Thái Dương
- **[PHU-TDU-01]** Thái Dương ở Mão, Thìn, Tỵ, Ngọ (V/M): vợ chồng hòa hợp, cùng hưởng sung túc lâu dài. TT ghi cưới muộn thì tốt và nhờ phối ngẫu mà quý. — *Nguồn: TB (WM3, 5); WM1 ("Thái dương sáng: hòa hợp, khá giả đến già"); TT (WM6: "太阳庙旺迟娶吉… 因妻得贵")*
- **[PHU-TDU-02]** Thái Dương ở Dậu, Tuất, Hợi, Tý (H): việc cưới xin hay trắc trở, cưới muộn thì thuận. Nhật Cự ở Thân: nên cưới muộn. Nhật Nguyệt (Sửu, Mùi): cả hai đều có vị thế, nên cưới muộn. — *Nguồn: TB (WM3, 5); WM1 ("Thái dương tối: cưới xin trắc trở, trễ mới tốt"; "Nhật Cự… Thân: trễ mới tốt"); TT (WM6: "早娶克")*
- **[PHU-TDU-03]** Nhật Cự ở Dần (V): có bất hòa nhưng sống với nhau đến già, sung túc. Nhật Lương có Tả Hữu: phối ngẫu hiền và sáng suốt. — *Nguồn: TB (WM3, 5); WM1 ("Nhật, Cự đồng cung tại Dần: bất hòa nhưng chung sống đến già"); TT (WM6: "与天梁同加左右招贤明之妻")*

#### Thiên Cơ
- **[PHU-TCO-01]** Thiên Cơ ở Tỵ, Ngọ, Mùi (V/Đ): sớm lập gia đình, cả hai tính mạnh nhưng sống được với nhau, đều có tài. Cơ Lương (Thìn, Tuất): dễ thành đôi, thường là người quen, hòa hợp lâu dài. Cơ Nguyệt ở Thân: cả hai giỏi, khá giả, cưới sớm. — *Nguồn: TB (WM3, 6); WM1 ("Thiên cơ ở Tý, Ngọ, Mùi: thành hôn sớm"; "Cơ Lương… hòa thuận đến già"; "Cơ Nguyệt… Thân: cưới sớm"); TT (WM6: "天机宜年少刚强之… 天梁同宜年长，太阴同内助美容")*
- **[PHU-TCO-02]** Thiên Cơ ở Hợi (H), Tý, Sửu, hoặc Cơ Nguyệt ở Dần, Cơ Cự (Mão, Dậu): nên cưới muộn, hai người dễ không hợp tính, dễ tranh chấp. Gặp tứ sát thì cần chú ý giữ gắn kết. — *Nguồn: TB (WM3, 6); WM1 ("Thiên cơ ở Hợi, Tý, Sửu: trễ mới tốt"; "Cơ Cự… trễ mới tốt"); TT (WM6: "加羊陀火铃主生离，晚娶吉")*

#### Thiên Phủ
- **[PHU-TP-01]** Thiên Phủ ở Tỵ, Hợi (Đ): vợ chồng khá giả, hòa thuận đến già. TT ghi phối ngẫu được yêu chiều, có vị thế. — *Nguồn: TB (WM3, 7); WM1 ("Thiên phủ ở Tỵ Hợi: khá giả, hòa thuận đến già"); TT (WM6: "天府相生宠爱夫主贵")*
- **[PHU-TP-02]** Thiên Phủ ở Sửu, Mùi, Mão, Dậu (B/Đ): sung túc nhưng hay cãi nhau. Gặp sát tinh thì nên cưới muộn để tránh trắc trở. — *Nguồn: TB (WM3, 7); WM1 ("khá giả và chung sống đến già nhưng hay cãi nhau"); TT (WM6: "见羊陀火铃空劫迟娶免刑，晚娶得谐老")*
- **[PHU-TP-03]** Thiên Phủ ở Tý, Ngọ (luôn đồng cung Vũ Khúc: Vũ Phủ; Phủ miếu, Vũ vượng): luận theo phần Vũ Phủ của PHU-VK-01: đôi lúc khác quan điểm nhưng cùng xây nền tảng vật chất, sung túc lâu dài. TT ghi Vũ Phủ ở Tý Ngọ là cách tài quan với người tuổi Đinh, Kỷ, Quý. — *Nguồn: TB (WM3, theo PHU-VK-01); TT (quyển 2, Thiên Phủ: "Tý Ngọ cung dữ Vũ Khúc đồng độ, Đinh Kỷ Quý sinh nhân vi phúc, tài quan cách") (đã đọc). (TT nói cho Mệnh; áp vào Phu Thê là nhận xét nhóm.)*

#### Thái Âm
- **[PHU-TA-01]** Thái Âm ở Dậu, Tuất, Hợi (M): cưới sớm, hòa thuận lâu dài. Người nam thường nể vợ và được vợ giúp; người nữ gặp chồng hiền, có vị thế. Gặp Xương Khúc càng đẹp. — *Nguồn: TB (WM3, 8); WM1 ("Thái âm sáng: khá giả, cưới sớm, chung sống bạc đầu"); TT (WM6: "太阴入庙男女皆贵美夫妇，加昌曲极美")*
- **[PHU-TA-02]** Thái Âm ở Mão, Thìn, Tỵ (H): dễ bất hòa, cưới xin gặp trở ngại. Nên cưới muộn và tìm hiểu kỹ người phối ngẫu. Gặp sát tinh, Kỵ thì dễ xa cách. *(sách gốc mô tả phối ngẫu rất nặng, đã trung tính hóa)* — *Nguồn: TB (WM3, 8); WM1 ("Thái âm tối: bất hòa… trễ mới tốt"); TT (WM6: "加羊陀火铃空劫耗忌，不克主生离")*

#### Tham Lang
- **[PHU-THL-01]** Tham Lang ở Thìn, Tuất (V): phối ngẫu giỏi, có của hoặc có vị thế nhưng hay ghen hoặc ham vui. Cưới muộn thì tránh được đổ vỡ. — *Nguồn: TB (WM3, 9); WM1 ("Tham lang ở Thìn, Tuất, Tý, Ngọ: tốt nhưng hay ghen, trễ mới tốt"); TT (WM6: "入庙宜迟娶")*
- **[PHU-THL-02]** Tham Lang ở Dần, Thân, Tý, Ngọ, hoặc Liêm Tham: dễ đến dễ đi, nhiều cảm xúc mạnh. Nên cưới muộn, đặt nền tảng tin cậy và cam kết rõ. Gặp sát tinh thì càng cần thận trọng. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM3, 9); TT (WM6: "贪狼男女不得美，三次作新郎… 廉贞同主克，加羊陀火铃主生离"); WM1 (Liêm Tham "xung khắc")*
- **[PHU-THL-03]** Tử Tham (Mão, Dậu): nên cưới muộn mới bền, cần chú ý tính ghen. TT: Tử Tham hợp khi người phối ngẫu lớn tuổi hơn. — *Nguồn: TB (WM3, 9); WM1 ("Tử Tham… thành hôn trễ mới tốt, ghen tuông"); TT (WM6: "紫微同年长方可对")*

#### Cự Môn
- **[PHU-CM-01]** Cự Môn ở Tý, Ngọ, Hợi (V/Đ): đẹp đôi, có vị thế, ở được với nhau nhưng hay bất đồng lời qua tiếng lại. TT ghi hợp khi phối ngẫu lớn tuổi hơn. — *Nguồn: TB (WM3, 10); WM1 ("Cự môn tại Tý, Ngọ, Hợi: khá giả, ở được với nhau, nhưng hay bất hòa"); TT (WM6: "巨门宜年长定克欠和")*
- **[PHU-CM-02]** Cự Môn ở Thìn, Tuất, Tỵ (H): dễ xung khắc, dễ chia tay. Gặp tứ sát, Không Kiếp thì càng cần học cách giao tiếp không gây tổn thương. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM3, 10); WM1 ("Cự môn tại Thìn, Tuất, Tỵ: xung khắc, hay bỏ nhau"); TT (WM6: "加羊陀火铃空劫定克二妻或主生离")*
- **[PHU-CM-03]** Cơ Cự: phối ngẫu tài giỏi, có vị thế nhưng nên cưới muộn. Đồng Cự: phối ngẫu thông minh, có thể xa cách một thời gian. — *Nguồn: TB (WM3, 10); TT (WM6: "天机同内助美貌，天同同性聪之妻")*

#### Thiên Tướng
- **[PHU-TT-01]** Thiên Tướng ở Phu Thê: người nam nể vợ, vợ thường là con gái trưởng; người nữ có xu hướng lấn át chồng. Ở Tỵ, Hợi, Sửu, Mùi (Đ): phối ngẫu đẹp, khôn ngoan, đảm đang. Nên cưới muộn, hợp khi chồng lớn tuổi hơn nhiều. — *Nguồn: TB (WM3, 11); WM1 ("Thiên tướng: trai nể vợ, gái lấn áp chồng, trễ mới tốt"); TT (WM6: "天相貌美贤淑夫宜年长，亲上成亲")*
- **[PHU-TT-02]** Thiên Tướng ở Mão, Dậu (H), hoặc Liêm Tướng (Tý, Ngọ), hoặc gặp sát tinh: việc cưới xin nhiều trở ngại, dễ bất hòa. Cưới muộn thì tránh được phần lớn. — *Nguồn: TB (WM3, 11); WM1 ("Liêm Tướng đồng cung: bất hòa"); TT (WM6: "加羊陀火铃空劫刑克")*
- **[PHU-TT-03]** Thiên Tướng ở Phu Thê gặp Tuần hoặc Triệt: hôn nhân dễ trắc trở lần đầu. — *Nguồn: WM1 ("Tuần Triệt gặp Tướng thì hình khắc" → đã trung tính hóa); TB (WM4, Thiên Tướng gặp Tuần Triệt "mất hết quyền lực")*

#### Thiên Lương
- **[PHU-TL-01]** Thiên Lương ở Tý, Ngọ (Đ/M): cưới sớm và dễ dàng, đều có vị thế, phối ngẫu có nhan sắc hoặc phong lưu. Đồng Lương, Cơ Lương: hòa hợp (xem các mục trên). — *Nguồn: TB (WM3, 12; bản chép ghi "Tỵ, Ngọ", xem PHU-TRANH-02); WM1 ("Thiên lương ở Tý, Ngọ: vợ đẹp, chồng sang, khá giả"); TT (WM6: "天梁妻宜大美容，天同同和气，天机招美淑")*
- **[PHU-TL-02]** Thiên Lương ở Tỵ, Hợi (H): dễ đến dễ đi. Gặp sát tinh thì kém thuận hòa. Nên giữ cam kết và dành thời gian chung. — *Nguồn: TB (WM3, 12); TT (WM6: "加羊陀火铃空劫朵不和顺")*
- **[PHU-TL-03]** Thiên Lương ở Sửu, Mùi (Đ ở cả hai cung theo SPEC mục 6; ở Sửu, Mùi Thiên Lương luôn đơn thủ, cung đối diện là Thiên Cơ, xem SPEC mục 12 lá số TC02, TC05): sách đã đọc **không có câu riêng** cho hai vị trí này, nên chỉ dùng câu chung của sao ở Phu Thê: phối ngẫu có nét ưa nhìn (nam) hoặc phong lưu, có phong thái (nữ). Gặp Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp thì kém thuận hòa, nên giữ cam kết và dành thời gian chung (như PHU-TL-02). **Không** suy "cưới sớm, dễ dàng" của Tý, Ngọ (PHU-TL-01) hay "dễ đến dễ đi" của Tỵ, Hợi (PHU-TL-02) sang Sửu, Mùi. — *Nguồn: TB (bản quét Internet Archive, tr. 212, mục 14.12 Thiên Lương: "Trai lấy vợ có nhan sắc, gái lấy chổng phong lưu"; mục này chỉ có dòng Tỵ Ngọ, Tỵ Hợi, Nhật/Đồng/Cơ đồng cung, không có Sửu Mùi) (đã đọc 30/10/2026); TT (WM6, 妻妾: "天梁妻宜大美容…加羊陀火铃空劫朵不和顺", câu chung không theo vị trí); NL (tập 1, bản quét: "Cơ ở Sửu thì Lương ở Mùi trái lại cơ ở Mùi thì Lương ở Sửu", chỉ xác nhận thế đơn thủ, xung chiếu Thiên Cơ)* ⚑ câu chung của sao, không có nguồn riêng cho Sửu, Mùi

#### Thất Sát
- **[PHU-TS-01]** Thất Sát ở Dần, Thân (M): nên cưới muộn. Phối ngẫu giỏi, có vị thế, thường là con trưởng. Cả hai tính mạnh. — *Nguồn: TB (WM3, 13); WM1 ("Thất sát: trễ mới tốt"); TT (WM6: "七杀… 或迟娶免刑")*
- **[PHU-TS-02]** Thất Sát ở Tý, Ngọ, Thìn, Tuất (H ở Thìn, Tuất), hoặc Liêm Sát, Vũ Sát: cưới sớm dễ đổ vỡ, đời sống chung nhiều sóng gió. Nên kết hôn khi đã trưởng thành về cảm xúc và tài chính. *(sách gốc diễn đạt rất nặng, đã trung tính hóa)* — *Nguồn: TB (WM3, 13); WM1 ("sớm thì hình khắc chia ly"); TT (WM6: "七杀早克，武曲同亦克… 廉贞主生离")*

#### Phá Quân
- **[PHU-PQ-01]** Phá Quân ở Tý, Ngọ (M): vợ chồng khá giả nhưng nên cưới muộn, nếu không trong đời có lúc xa nhau. — *Nguồn: TB (WM3, 14); WM1 ("Phá quân: trễ mới tốt, sớm thì hình khắc chia ly"); TT (WM6: "破军男女俱克别聚")*
- **[PHU-PQ-02]** Phá Quân ở Dần, Thân (H), Thìn, Tuất, hoặc Liêm Phá, Vũ Phá: tình duyên nhiều biến động, dễ phải làm lại từ đầu. Nên cưới muộn và tìm người có giá trị sống tương đồng. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM3, 14); TT (WM6: "武曲同克三，廉贞亦克且欠和")*
- **[PHU-PQ-03]** Tử Phá: hợp khi người vợ lớn tuổi hơn. — *Nguồn: TB (WM3, 1 và 14: "Nên lấy vợ nhiều tuổi hơn"); TT (WM6: "紫微同宜年长之妻")*

### 3.3. Bộ sao phụ quan trọng (SP)

- **[PHU-SP-01]** Văn Xương, Văn Khúc: phối ngẫu thông minh, có học, sống thuận hòa. Cần lưu ý dễ có người thứ ba xen vào. — *Nguồn: TB (WM3, 16); TT (WM6: "文昌妻少内助聪明"; "文曲相生会太阴诸吉星谐老"); TC (WM8: Xương Khúc "đồng thời có thể có tình nhân bên ngoài")*
- **[PHU-SP-02]** Thiên Khôi, Thiên Việt: phối ngẫu đẹp, có học, có của, thường là con trưởng. — *Nguồn: TB (WM3, 17); TT (WM6: "天魁天钺多主夫妇美丽，坐妻宫必主得妻财")*
- **[PHU-SP-03]** Tả Phụ, Hữu Bật: đi với sao tốt thì cưới xin dễ, vợ chồng giúp nhau. Đi với sao xấu thì tăng phần bất lợi. — *Nguồn: TB (WM3, 18); TT (WM6: "左辅右弼谐老"); WM1 ("Tả Hữu: tăng ảnh hưởng cho các sao tốt hay xấu")*
- **[PHU-SP-04]** Lộc Tồn: nên cưới muộn để tránh bất hòa. TT: không trở ngại, hợp người nhỏ tuổi hơn. — *Nguồn: TB (WM3, 23); WM1 ("Lộc tồn, Cô Quả, nên cưới trễ sẽ tránh chia ly"); TT (WM6: "禄存相生无克，妻宜年少并头迟娶者")*
- **[PHU-SP-05]** Thiên Mã: gặp nhau ở nơi xa mà thành duyên. Lộc, Mã, Thanh Long: dễ thành, gặp ở xa, khá giả và hòa thuận. — *Nguồn: TB (WM3, 24, 48); WM1 ("Thiên Mã: nên duyên ở nơi xa")*
- **[PHU-SP-06]** Kình, Đà, Hỏa, Linh, Không, Kiếp: miếu vượng thì có bất hòa hoặc xa cách ngắn; hãm thì dễ trắc trở, cần chọn bạn đời kỹ. Kình Đà miếu có cát tinh, cưới muộn thì ổn. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM3, mục Sát tinh); WM1 (mục "Ảnh hưởng trung tinh": sát tinh miếu vượng "bất hòa hoặc chia ly thời gian ngắn"); TT (WM6: "羊陀入庙加吉星，迟娶免刑或久和，陷地早克"; "火星铃星入庙加吉无刑")*
- **[PHU-SP-07]** Đào Hoa, Hồng Loan: cưới xin dễ, phối ngẫu đẹp, tài hoa, nhưng dễ rắc rối tình cảm. Gặp nhiều sao xấu thì dễ chia tay. — *Nguồn: TB (WM3, 31); WM1 ("Đào Hồng: cưới xin dễ nhưng nếu Đào Hồng hãm: hình khắc, chia ly")*
- **[PHU-SP-08]** Cô Thần, Quả Tú: vợ chồng dễ xa cách hoặc bất hòa. Nên dành thời gian chung. — *Nguồn: TB (WM3, 30); WM1 ("Cô Quả: bất hòa, hay xa cách")*
- **[PHU-SP-09]** Phục Binh, Tướng Quân: tìm hiểu, qua lại một thời gian rồi mới cưới. Quang, Quý: lấy nhau vì ân tình. Song Hao: cưới dễ nhưng chi tiêu phóng tay. — *Nguồn: TB (WM3, 26–29); WM1 (Phục Binh, Tướng Quân, Quang Quý, Song Hao: cùng nội dung)*
- **[PHU-SP-10]** Tuần, Triệt án ngữ ở Phu Thê: nên cưới muộn hoặc thành hôn ở xa. Lần đầu dễ gặp cản trở hoặc hai bên chê nhau, nhưng không có nghĩa là không có vợ chồng. — *Nguồn: TB (WM3, 34); WM1 ("Có Tuần Triệt thì lập gia đình gặp cản trở… chỉ khó lần đầu thôi")*
- **[PHU-SP-11]** Thiên Riêu, Thiên Diêu ở Phu Thê: TB và WM1 diễn đạt theo hướng đạo đức tiêu cực. Bài luận chỉ nói "cần xây dựng sự tin cậy, rõ ràng trong cam kết". *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM3, 33); WM1 ("Thiên Diêu: hoang dâm, bất chính")*

### 3.4. Cách cục chính (CC)

- **[PHU-CC-01]** Quyền tinh ở Phu Thê (Thiên Tướng với Quốc Ấn, Tướng Quân với Quốc Ấn, Hóa Quyền, Khôi Việt, Tử Vi với Tả Hữu, Thiên Phủ với Tả Hữu): người phối ngẫu có uy, nắm vai trò quyết định trong nhà. — *Nguồn: WM1 (mục "Thân cư Thê và chồng sợ vợ": danh sách quyền tinh); TB (WM3, 11: Thiên Tướng "trai nể vợ… gái lấn át chồng"; 20: Hóa Quyền "trai nể vợ")*
- **[PHU-CC-02]** Cô, Quả, Đào Hồng hãm, Tả Hữu, Không Kiếp hội ở Phu Thê: báo hiệu nguy cơ chia ly. Lộc Tồn, Vũ Khúc, Cự Kỵ cũng thường báo hiệu xa cách. Bài luận diễn đạt là "cần đầu tư nhiều hơn cho gắn kết, tránh vội vàng". *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: WM1 (mục "Vài dữ kiện thí dụ"); TB (WM3, 30, 31, mục Sát tinh)*
- **[PHU-CC-03]** Tử Phủ ở Phu Thê gặp Không Kiếp: cái tốt bị phá, mai mối nhiều lần không thành. Thân tốt thì cưới muộn vẫn tốt. — *Nguồn: WM1 (ví dụ "Tử Phủ, Không Kiếp ở Thê… lập gia đình muộn, vào năm 35 tuổi, được tốt") ⚑1nguồn*
- **[PHU-CC-04]** Cự Môn gặp Hỏa Tinh, Linh Tinh: mối mai nhiều nhưng khó chọn được người hợp. — *Nguồn: TB (WM3, 36) ⚑1nguồn*
- **[PHU-CC-05]** Thiên Tướng cùng Đào Hoa, Hồng Loan: phối ngẫu đẹp, khá giả, hiền, có danh giá. — *Nguồn: TB (WM3, 39); KL (mục Thiên Tướng, "Hồng loan đi với Thiên tướng thì con gái lấy chồng sang"; KL nói về nữ số, không nêu riêng cung) (bản quét, đã đọc)*
- **[PHU-CC-06]** Thời điểm dễ kết hôn: đại hạn và tiểu hạn trùng ở cung Phu Thê, hạn có Nhật Nguyệt chiếu, hạn có Đào, Hồng, Hỷ, hoặc hạn có Sát, Phá, Liêm, Tham. Cần cả đại hạn lẫn tiểu hạn cùng báo. — *Nguồn: WM1 (mục "Hạn lấy vợ, lấy chồng"); TT (WM6, 三妻妾: "斗君过度在妻宫逢吉星妻妾美无灾克"); KL (mục giải đoán đại vận: vận tới "cung Phối có cưới hỏi"; mục Thiên Hỷ: Đào Hồng Hỷ là "tin cưới hỏi"; KL không nêu Nhật Nguyệt, Sát Phá Liêm Tham) (bản quét, đã đọc)*
- **[PHU-CC-07]** Thiên Phủ hoặc Vũ Phủ ở Phu Thê gặp Tuần, Triệt hoặc Địa Không, Địa Kiếp ("kho bị thủng"): quan hệ vẫn có nền tảng nhưng tài chính chung dễ hao hụt, dễ bất đồng vì tiền; nên minh bạch và thống nhất cách quản lý tài chính chung, có quỹ dự phòng. Không Kiếp hãm nặng hơn Tuần, Triệt. — *Nguồn: KL (Thiên phủ: "nếu bị Tuần không, Thiên không, Không Kiếp hãm thì kho Thiên phủ tan tành và trống rỗng"; cách "Thiên phủ ngộ Tuần") (bản quét archive.org, đã đọc); TT (WM6, Phu Thê: "kiến Dương Đà Hỏa Linh Không Kiếp trì thú miễn hình") (đã đọc); MENH-TP-02 (kho thủng ở Mệnh) (sách gốc diễn đạt nặng, đã trung tính hóa)*

### 3.5. Tứ hóa tại Phu Thê (HOA)

- **[PHU-HOA-01]** Hóa Lộc: phối ngẫu có của, giàu có. — *Nguồn: TB (WM3, 19); WM1 ("Hóa lộc: hôn phối giàu")*
- **[PHU-HOA-02]** Hóa Quyền: người nam nể vợ, người nữ có chồng có vị thế. Phối ngẫu có quyền quyết định. — *Nguồn: TB (WM3, 20); WM1 ("Hóa quyền: vợ lấn quyền, chồng sang")*
- **[PHU-HOA-03]** Hóa Khoa: phối ngẫu có học thức, có danh chức. — *Nguồn: TB (WM3, 21); WM1 ("Hóa khoa: hôn phối có học, có chức")*
- **[PHU-HOA-04]** Hóa Kỵ: vợ chồng dễ bất hòa, hiểu lầm. Kỵ cùng Kiếp, hoặc cùng Đà, Đào, Hồng thì càng cần minh bạch và tin cậy. *(các tổ hợp gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (WM3, 22, 42, 43); WM1 ("Hóa kỵ: bất hòa")*

### 3.6. Điểm còn tranh luận (TRANH)

- **[PHU-TRANH-01]** Mức độ "khắc": TT dùng rất nhiều chữ "克/刑/生离" (khắc, hình, sinh ly), cả với sao miếu. TB và WM1 cũng nhiều nhưng thường kèm điều kiện "cưới muộn thì tránh được". TC (WM8) nhấn vào "nỗ lực hậu thiên để bổ cứu". Bài trả phí theo hướng TB, WM1 và TC (có điều kiện, có lời khuyên), không theo giọng TT. — *Nguồn: TT (WM6, 三妻妾); TB (WM3); WM1; TC (WM8, mục 3)*
- **[PHU-TRANH-02]** Thiên Lương ở Phu Thê: bản chép TB (WM3) ghi "Đơn thủ tại Tỵ, Ngọ: lấy nhau sớm" rồi ngay sau lại ghi "Tỵ, Hợi: dễ gặp dễ xa". Có thể là lỗi chép (đúng là "Tý, Ngọ"), vì WM1 ghi "Thiên lương ở Tý, Ngọ". Đã đối chiếu bản quét TB (Internet Archive, tr. 212, mục 14.12, 30/10/2026): bản quét **cũng** ghi "Đơn thủ tại Tỵ, Ngọ", nên chỗ lệch nằm trong chính bản sách đã số hóa, không phải lỗi chép của trang web; vẫn đọc là "Tý, Ngọ" theo WM1 và vì Tỵ đã có dòng riêng. TB cũng không có dòng cho Sửu, Mùi (xem PHU-TL-03). — *Nguồn: TB (WM3, 12; bản quét tr. 212); WM1*
- **[PHU-TRANH-03]** Thiên Cơ ở Tý: WM1 ghi "Thiên cơ ở Tý, Ngọ, Mùi: thành hôn sớm" và cũng ghi "ở Hợi, Tý, Sửu: trễ mới tốt" (Tý xuất hiện ở cả hai). TB (WM3) ghi nhóm tốt là "Tỵ, Ngọ, Mùi". Có thể WM1 chép nhầm Tỵ thành Tý. Tạm theo TB. — *Nguồn: WM1; TB (WM3, 6)*
- **[PHU-TRANH-04]** Tuổi phối ngẫu: TT và TB ghi nhiều quy tắc "chồng nên lớn tuổi hơn", "vợ nên là trưởng nữ". Đây là chuẩn mực xã hội cũ. Đề xuất chỉ nêu như "xu hướng hợp với người chín chắn hơn hoặc có vai trò trưởng", không đưa thành điều kiện. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TT (WM6, 三妻妾); TB (WM3)*
- **[PHU-TRANH-05]** Số lần kết hôn ("ba lần lập gia đình", "克二三妻"): cả TT và TB đều có. Nhóm quyết định không nêu số lần trong bài luận, chỉ nói "tình duyên nhiều biến động". — *Nguồn: TT (WM6: Liêm Trinh "三度作新郎"); TB (WM3, 2)*
- **[PHU-TRANH-06]** Vợ lẽ và quan hệ ngoài hôn nhân: TB xem cung Nô Bộc để luận "vợ lẽ" (WM1 cũng ghi). Nhóm không đưa vào bài luận. Các tổ hợp mang tính bạo lực (TB WM3 mục 41: "Sát, Đà, Riêu, Dưỡng, Linh, Hỏa") **tuyệt đối không dùng**. — *Nguồn: WM1 ("Xem về vợ bé, phải xem cung Nô"); TB (WM3, phần dẫn và mục 41)*
- **[PHU-TRANH-07]** Thân cư Phu Thê: dân gian cho là "sợ vợ" hoặc "nhờ chồng". WM1 bác bỏ, cho rằng chỉ là "đời chịu ảnh hưởng nhiều của phối ngẫu". Cung Phu Thê phải tốt thì mới "nhờ" được. Theo WM1. — *Nguồn: WM1 (mục "Thân cư Thê"); TC (WM8: Thân là hậu thiên)*

---

## 4. Cung Tử Tức

### 4.1. Ý nghĩa cung (YN)

- **[TU-YN-01]** Cung Tử Tức xem về con cái: duyên con, sớm hay muộn, dễ hay vất vả khi nuôi dạy, tính cách con và mức hòa hợp giữa cha mẹ với con. — *Nguồn: TB (tr. 198, "Xem cung Tử Tức để biết rõ con cái"); TT (q.2 «四子女»)*
- **[TU-YN-02]** Lối luận hiện đại mở rộng cung này sang học trò, người mình dìu dắt và "sản phẩm" mình tạo ra (tác phẩm, dự án). Sách cổ Việt không nói điều này; chỉ dùng khi khách chưa có con hoặc hỏi về công việc sáng tạo. — *Nguồn: WT10 (Children palace: "students and disciples", "creative output")* ⚑1nguồn
- **[TU-YN-03]** Trước khi xét sao tại Tử Tức phải xét cung Phúc Đức (liên quan việc nối dõi) và cung Mệnh, Thân. Tử Tức có nhiều sao xấu nhưng Phúc Đức, Mệnh, Thân sáng đẹp thì không đáng lo; ngược lại Tử Tức đẹp mà Phúc, Mệnh, Thân kém thì cũng giảm. Sách gốc tự nhận các nhận định về số con "chỉ là tương đối". — *Nguồn: TB (tr. 198); TB (tr. 228, phụ luận); KL (Chương Ba, Coi các cung — cung Phúc: "Cung Phúc đẹp thì dù các cung khác có xấu cũng không đáng lo") (bản quét, đã đọc)*
- **[TU-YN-04]** Xét thêm cung đối (Điền Trạch) xem có xung phá không; cung Tử Tức không có chính tinh thì lấy sao cung đối mà luận. Theo thứ tự cung ở spec 2.4, tam hợp của Tử Tức là Phụ Mẫu và Nô Bộc, xung chiếu là Điền Trạch. — *Nguồn: TT (q.2 «四子女»: "次看对宫有冲刑否", "如本宫无星曜专看对宫"); WT10 (trục Tử Tức – Điền Trạch)*
- **[TU-YN-05]** Sao lành, sao quý thủ Tử Tức thì con cái đông vui, thành đạt; sát tinh (Kình, Đà, Hỏa, Linh, Không, Kiếp) và Hóa Kỵ thủ cung thì quan hệ cha mẹ – con dễ có "hình khắc", nghĩa là xa cách, bất đồng, hoặc nuôi dạy vất vả. — *Nguồn: TT (q.2 «四子女»: "若加羊陀火玲空劫杀忌主生子女有刑克", "若善星贵星守子女宫必主其人生子昌盛贵显"); TT (q.1 «斗数发微论»: "刑殺守子宮，子難奉老"); NL (Chính không bằng chiếu, chiếu không bằng giáp — sát tinh ở cung người thân, gồm tử tức: "Kình Đà thì hình thương xa cách") (bản quét, đã đọc); KL (Chương Ba, Coi các cung — cung Tử: Long trì, Phượng các, Thiên đức… chủ con "khá giả, xinh đẹp"; Hình, Kỵ, Kiếp, Hỏa, Linh bất lợi cho đường con, sách diễn đạt nặng hơn) (bản quét, đã đọc)*
- **[TU-YN-06]** Mệnh xấu mà Tử Tức tốt thì về già được nhờ con; Mệnh tốt mà Tử Tức xấu thì về già dễ thiếu chỗ dựa từ con (cổ nhân: "Mệnh hung nhi cát, do hữu Tử cung cát"). — *Nguồn: TB (tr. 228, phụ luận Tử Tức); KL (Chương Ba, Coi các cung — cung Tử: "Cung Tử tức cũng là hình ảnh đời mình về già") (bản quét, đã đọc)*
- **[TU-YN-07]** Nam Đẩu tinh thủ Tử Tức thiên về con trai, Bắc Đẩu tinh thiên về con gái. TB xếp Thiên Phủ, Thiên Tướng, Thiên Lương, Thất Sát, Thiên Đồng, Thái Dương, Thiên Cơ vào Nam Đẩu; Thái Âm, Tham Lang, Cự Môn, Liêm Trinh, Vũ Khúc, Phá Quân vào Bắc Đẩu; hai sao Nam – Bắc đồng cung thì dương cung thiên trai, âm cung thiên gái. — *Nguồn: TB (tr. 198, mục 13.1); TT (q.2 «四子女»: "三方四正得南斗星多主生男，北斗星多主生女")*

> Ghi chú cho người viết: không dự đoán giới tính, số con hay khả năng sinh con cho khách. YN-07 chỉ để hiểu sách; khi viết bài thì chuyển thành "mối quan hệ với con", "phong cách làm cha mẹ". *(Nhận xét nhóm, không phải quy tắc gốc)*

### 4.2. 14 chính tinh tại cung

Sách gốc nêu số con cụ thể. Dưới đây giữ nguyên số trong ngoặc để đối chiếu; khi luận chỉ dùng "đông con / ít con / muộn con / hòa hợp / xa cách".

#### Tử Vi
- **[TU-TV-01]** Tử Vi miếu (Ngọ) hoặc bình (Tý) đơn thủ: đông con, con về sau thành đạt, khá giả (TB: Ngọ "ba trai hai gái", Tý "bốn con"; TT: miếu vượng "nam tam nữ nhị", thêm Tả Hữu, Xương Khúc thì đông hơn). — *Nguồn: TB (tr. 199, mục 13.2.1); TT (q.2 «四子女»: "紫微庙旺男三女二，加左右昌曲有五人")*
- **[TU-TV-02]** Tử Vi gặp Kình, Đà, Hỏa, Linh, Không, Kiếp: số con giảm, có thể có con muộn hoặc con nuôi, con trưởng là con nuôi. — *Nguồn: TT (q.2 «四子女»: "加羊陀火铃空劫只一双，不然偏室生者多，或招祀子居长"); TB (tr. 203, mục 13.3.14 Kình Đà Không Kiếp: "khó nuôi con")*
- **[TU-TV-03]** Đồng cung: Tử Phủ đông con (TB "từ năm con"; TT "四五人"); Tử Tướng khá đông; Tử Sát con khó nuôi lúc nhỏ, lớn lên thường ở xa cha mẹ; Tử Phá ít con, con hay bất đồng với cha mẹ; Tử Tham ít con. — *Nguồn: TB (tr. 199, mục 13.2.1); TT (q.2 «四子女»: "天府同加吉星四五人", "破军同三人"; "七杀…紫微同再吉星有三人")*

#### Liêm Trinh
- **[TU-LT-01]** Liêm Trinh vượng (Dần, Thân) đơn thủ: ít con (TB "hai con"); Liêm Phủ: con khá đông, về sau khá giả (TB "ba đến năm"; TT "quý tử ba người"); Liêm Tướng: con lúc nhỏ vất vả chăm, lớn lên thành đạt. — *Nguồn: TB (tr. 199, mục 13.2.2); TT (q.2 «四子女»: "廉贞一人，天府同主贵子三人…天相同有二子")*
- **[TU-LT-02]** Liêm Trinh hãm (Tỵ, Hợi với Tham Lang; Mão, Dậu với Phá Quân) hoặc gặp Thất Sát: hiếm con, nuôi dạy vất vả, con cần được chăm sóc sức khỏe nhiều; gặp thêm sát tinh thì càng hiếm muộn *(sách gốc diễn đạt nặng, đã trung tính hóa)*. — *Nguồn: TB (tr. 199, mục 13.2.2); TT (q.2 «四子女»: "若贪狼破军七杀同主孤，再加羊陀火铃空劫全无")*

#### Thiên Đồng
- **[TU-TD-01]** Thiên Đồng đắc (Mão) đơn thủ, hoặc Đồng Âm tại Tý, Đồng Lương tại Dần: đông con, có con thành đạt nổi trội. — *Nguồn: TB (tr. 199–200, mục 13.2.3); TT (q.2 «四子女»: "天同庙旺五子有贵…太阴同五人")*
- **[TU-TD-02]** Thiên Đồng hãm (Thìn, Tuất): ít con, nuôi con vất vả; Đồng Âm tại Ngọ (Thái Âm hãm): số con giảm còn khoảng một nửa. — *Nguồn: TB (tr. 199–200, mục 13.2.3: Thìn Tuất "rất khó nuôi con", Đồng Âm Ngọ "may mắn lắm mới có hai con"); TT (q.2 «四子女»: "在午宫陷地减半")*
- **[TU-TD-03]** Đồng Cự: có con nhưng nuôi vất vả, lớn lên anh chị em dễ bất hòa, mỗi người một nơi; Thiên Đồng hãm (Dậu): ít con, sách nói đổi chỗ ở nhiều thì "mới có nhiều con". — *Nguồn: TB (tr. 199–200, mục 13.2.3); TT (q.2 «四子女»: "巨门同三人")*

#### Vũ Khúc
- **[TU-VK-01]** Vũ Khúc miếu (Thìn, Tuất) đơn thủ: ít con, nhưng con khá giả; Vũ Phủ: ít con, con về sau thành đạt. — *Nguồn: TB (tr. 200, mục 13.2.4); TT (q.2 «四子女»: "武曲主一子"; mục 天府: "武曲同二人")*
- **[TU-VK-02]** Vũ Khúc hãm (Tỵ, Hợi, đồng cung Phá Quân): ít con, nuôi vất vả; Vũ Sát (Mão, Dậu): hiếm con, cha mẹ – con dễ xa cách *(sách gốc diễn đạt nặng, đã trung tính hóa)*. — *Nguồn: TB (tr. 200, mục 13.2.4); TT (q.2 «四子女»: "破军同主刑，止有一人…七杀同主孤")*
- **[TU-VK-03]** Vũ Tham: có con muộn thì thuận; Vũ Tướng: sách nói thường có con nuôi trước rồi mới có con ruột. Hai sách khớp nhau ở cả hai ý này. — *Nguồn: TB (tr. 200: "muộn sinh con mới dễ nuôi", "nếu có con nuôi, tất thêm con đẻ"); TT (q.2 «四子女»: "贪狼晚招二子，天相同先招外子，后亲生一子")*

#### Thái Dương
- **[TU-TDU-01]** Thái Dương sáng (Thìn, Tỵ, Ngọ) đơn thủ: đông con, con thành đạt; Nhật Nguyệt đồng cung: đông con, có con nổi trội. — *Nguồn: TB (tr. 200, mục 13.2.5); TT (q.2 «四子女»: "太阳入庙男三女二晚子贵…太阴同五人")*
- **[TU-TDU-02]** Thái Dương hãm (Tuất, Hợi, Tý): có con muộn thì thuận, số con ít hơn; gặp thêm sát tinh thì càng ít. — *Nguồn: TB (tr. 200: "muộn sinh con mới dễ nuôi"); TT (q.2 «四子女»: "陷地有三子…再加羊陀火铃空劫止留一子")*
- **[TU-TDU-03]** Nhật Cự tại Dần (Thái Dương vượng): con khá giả; Nhật Cự tại Thân (Thái Dương hãm): ít con, muộn thì thuận, con sinh sau thành đạt; Nhật Lương tại Mão tốt hơn tại Dậu. — *Nguồn: TB (tr. 200, mục 13.2.5); TT (q.2 «四子女»: "巨门同三人")*

#### Thiên Cơ
- **[TU-TCO-01]** Thiên Cơ sáng (Tỵ, Ngọ, Mùi) đơn thủ: ít con (sách ghi hai). — *Nguồn: TB (tr. 200, mục 13.3.6); TT (q.2 «四子女»: "天机庙旺二人")*
- **[TU-TCO-02]** Thiên Cơ ở Hợi (hãm), Tý, Sửu: duyên con mỏng hơn; gặp Kình, Đà, Hỏa, Linh, Không, Kiếp thì càng hiếm muộn. — *Nguồn: TB (tr. 200: "may mắn lắm mới có hai con"); TT (q.2 «四子女»: "加羊陀火铃空劫全无子")*
- **[TU-TCO-03]** Cơ Lương: con khá giả, có con nổi trội (TB "năm con"; TT tại Dần "hai ba người") — hai sách lệch số, xem TU-TRANH-01. Cơ Cự: ít con, muộn thì thuận. Cơ Âm: TB và TT đều ghi khả năng có "con dị bào" (con khác cha hoặc khác mẹ) hoặc con của vợ/chồng trước. — *Nguồn: TB (tr. 200–201); TT (q.2 «四子女»: "或庶生多，巨门一人，天梁同在寅宫有二三人…太阴同二三人")*

#### Thiên Phủ
- **[TU-TP-01]** Thiên Phủ đắc (Tỵ, Hợi) đơn thủ: đông con, có con nổi trội; ở Sửu, Mùi, Mão, Dậu: con vừa phải. — *Nguồn: TB (tr. 201, mục 13.3.7); TT (q.2 «四子女»: "天府五人")*
- **[TU-TP-02]** Thiên Phủ gặp Kình, Đà, Hỏa, Linh, Không, Kiếp: số con giảm; Thiên Phủ một mình thêm Không Kiếp thì sách nói "cô quân" (ít nương tựa con). — *Nguồn: TT (q.2 «四子女»: mục 天府 "加羊陀火铃空劫止三人"; mục 紫微 "若独守再加空劫孤君"); TB (tr. 203, mục 13.3.14)*

#### Thái Âm
- **[TU-TA-01]** Thái Âm miếu (Dậu, Tuất, Hợi): đông con, thiên con gái, sinh con gái đầu thì thuận, có con nổi trội. — *Nguồn: TB (tr. 201, mục 13.3.8); TT (q.2 «四子女»: "太阴女三男二先女后男，庙旺有贵子")*
- **[TU-TA-02]** Thái Âm hãm (Mão, Thìn, Tỵ): con ít hơn, muộn thì thuận; con có thể thiếu quyết đoán, quan hệ với cha mẹ dễ bất đồng. — *Nguồn: TB (tr. 201: "may mắn lắm mới có ba con… thường xung khắc với cha mẹ"); TT (q.2 «四子女»: "陷地减半，招软弱之子")*

#### Tham Lang
- **[TU-THL-01]** Tham Lang đắc (Dần, Thân) hoặc vượng (Thìn, Tuất): ít con; con có chí, có thể thành đạt nhưng cá tính mạnh, dễ khác quan điểm với cha mẹ. — *Nguồn: TB (tr. 201, mục 13.3.9: Dần Thân "sau con cũng hiển đạt, nhưng không hợp tính với cha mẹ"); TT (q.2 «四子女»: "贪狼庙旺二人，早有刑克")*
- **[TU-THL-02]** Tham Lang hãm (Tý, Ngọ): ít con, con nhỏ khó chăm, lớn lên khó dạy, cha mẹ cần kiên nhẫn *(sách gốc diễn đạt nặng, đã trung tính hóa)*. — *Nguồn: TB (tr. 201, mục 13.3.9); WT6 (Tham Lang hãm "ít con, khó dạy bảo")*

#### Cự Môn
- **[TU-CM-01]** Cự Môn sáng (Tý, Ngọ vượng; Hợi đắc) đơn thủ: có con, con sớm xa cha mẹ (đi học, lập nghiệp xa); hai sách lệch về số con (TB "năm con trở lên", TT "hai, trước khó sau dễ"). — *Nguồn: TB (tr. 201, mục 13.3.10); TT (q.2 «四子女»: "巨门入庙二人，先难后易")*
- **[TU-CM-02]** Cự Môn hãm (Thìn, Tuất, Tỵ): ít con, con lớn lên dễ bất đồng với cha mẹ, trong nhà cần chú ý hòa khí; gặp Kình, Đà, Hỏa, Linh thì ít con hơn. — *Nguồn: TB (tr. 201); TT (q.2 «四子女»: "加羊陀火铃子少")*

#### Thiên Tướng
- **[TU-TT-01]** Thiên Tướng đắc (Tỵ, Hợi, Sửu, Mùi) đơn thủ, không gặp Kình Đà Hỏa Linh: con vừa phải và nên người. — *Nguồn: TB (tr. 201–202, mục 13.3.11); TT (q.2 «四子女»: "天相无羊陀火铃同有二子成器")*
- **[TU-TT-02]** Thiên Tướng hãm (Mão, Dậu) hoặc gặp sát tinh: ít con, muộn thì thuận; TT nói có thể nhận con nuôi trước hoặc có con với người phối ngẫu sau. — *Nguồn: TB (tr. 202: "Nếu muộn sinh mới dễ nuôi"); TT (q.2 «四子女»: "有杀先招祀子居长…见羊陀火铃空劫必克，宜偏室生")*

#### Thiên Lương
- **[TU-TL-01]** Thiên Lương miếu (Ngọ) hoặc đắc (Tý), đơn thủ: con hiếu, có con nổi trội (TB "năm con trở lên"; TT "hai người") — lệch số, xem TU-TRANH-01. — *Nguồn: TB (tr. 202, mục 13.3.12); TT (q.2 «四子女»: "天梁庙旺二人")*
- **[TU-TL-02]** Thiên Lương hãm (Tỵ, Hợi): ít con, con lớn lên mỗi người một nơi; gặp Kình, Đà, Hỏa, Linh, Không, Kiếp thì sớm có chuyện xa cách. — *Nguồn: TB (tr. 202: "con cái thường ly tán, phiêu bạt"); TT (q.2 «四子女»: "加羊陀火铃空劫早克")*

#### Thất Sát
- **[TU-TS-01]** Thất Sát miếu (Dần, Thân, Tý, Ngọ) đơn thủ: ít con nhưng con khá giả, có con nổi trội (TB tại Dần Thân); Tử Sát có cát tinh thì con khá hơn. Bản chất sao là "cô", nên số con thường ít. — *Nguồn: TB (tr. 202, mục 13.3.13); TT (q.2 «四子女»: "七杀主孤一人之分，紫微同再吉星有三人")*
- **[TU-TS-02]** Thất Sát hãm (Thìn, Tuất) hoặc gặp Kình, Đà, Hỏa, Linh, Không, Kiếp: hiếm con; con có thể cá tính rất mạnh, khó dạy, cần nhiều tâm sức *(sách gốc diễn đạt nặng, đã trung tính hóa)*. — *Nguồn: TB (tr. 202); TT (q.2 «四子女»: "见羊陀火铃空劫全无，纵有不成器")*

#### Phá Quân
- **[TU-PQ-01]** Phá Quân miếu (Tý, Ngọ): có con (TB và TT cùng ghi ba), con cương cường, sớm tự lập, thường ở xa cha mẹ. — *Nguồn: TB (tr. 202, mục 13.3.14: "sau còn ba con… thường ở xa cha mẹ"); TT (q.2 «四子女»: "破军入庙三人，刚强之子")*
- **[TU-PQ-02]** Phá Quân hãm (Dần, Thân): ít con, quan hệ cha mẹ – con dễ căng thẳng; gặp Không Kiếp, Hỏa, Đà mà không có sao chế thì càng ít con. — *Nguồn: TB (tr. 202: "dù sinh nhiều sau cũng bị hình khắc"); TT (q.2 «四子女»: "无制见空劫火陀少子")*
- **[TU-PQ-03]** Phá Quân vượng (Thìn, Tuất): ít con, con không hợp tính, thường xa cách cha mẹ; Liêm Phá ít con, nuôi vất vả; Vũ Phá ít con. — *Nguồn: TB (tr. 202–203); TT (q.2 «四子女»: "廉贞同一人")*

### 4.3. Bộ sao phụ quan trọng (SP)

- **[TU-SP-01]** Tả Phù, Hữu Bật: thêm con; gặp nhiều cát tinh thì có con nổi trội; gặp sát tinh thì giảm. — *Nguồn: TB (tr. 203, mục 13.3.19); TT (q.2 «四子女»: "左辅单居男三女一，见紫微天府诸吉星主贵子…右弼三人加吉星有贵子，见羊陀火铃空劫减半")*
- **[TU-SP-02]** Văn Xương, Văn Khúc: gặp sao sáng thì con thông minh, sớm thành đạt; gặp sao xấu thì nuôi con vất vả. — *Nguồn: TB (tr. 203, mục 13.3.17); TT (q.2 «四子女»: "文昌三人，加吉星更多，有擎陀火铃空劫只可一子之分")*
- **[TU-SP-03]** Thiên Khôi, Thiên Việt: có con nổi trội (quý tử). — *Nguồn: TB (tr. 203, mục 13.3.18); TT (q.2 «四子女»: "魁钺单守主有贵子")*
- **[TU-SP-04]** Lộc Tồn: con ít, muộn tốt hơn sớm, con hay ở xa cha mẹ; TT nói thích hợp nhận con nuôi. Hai sách khớp ý "cô". — *Nguồn: TB (tr. 203, mục 13.3.20); TT (q.2 «四子女»: "禄存主孤宜庶出一螟蛉之子")*
- **[TU-SP-05]** Kình Dương, Đà La, Địa Không, Địa Kiếp: con ít, nuôi vất vả, quan hệ cha mẹ – con dễ bất hòa; đi cùng nhiều sao xấu thì hiếm muộn *(sách gốc diễn đạt nặng, đã trung tính hóa)*. — *Nguồn: TB (tr. 203, mục 13.3.14); TT (q.2 «四子女»: "羊陀陷宫孤单，加吉星庙旺有一人，如对宫有吉星多无杀冲，亦有三四人")*
- **[TU-SP-06]** Hỏa Tinh, Linh Tinh: gặp sao sáng thì muộn con nhưng con khá giả; gặp sao xấu thì hiếm con, con ở xa. — *Nguồn: TB (tr. 204, mục 13.3.16); TT (q.2 «四子女»: "火星逢吉同不孤，陷宫加杀刑伤…铃星独守孤单")*
- **[TU-SP-07]** Cô Thần, Quả Tú, Thiên Hình: muộn con, con nhỏ hay ốm vặt. — *Nguồn: TB (tr. 204, 205, mục 13.3.25, 13.3.42); KL (Chương Hai, mục Cô Quả ở các cung — Phúc, Tử, Bào: "hiếm muộn"; Chương Ba, cung Tử xếp Hình, Cô, Quả vào nhóm bất lợi cho đường con) (bản quét, đã đọc)*
- **[TU-SP-08]** Long Trì, Phượng Các: con đẹp, có con nổi trội; Ân Quang, Thiên Quý: có con nuôi hiếu thảo; Hồng Loan: con khéo tay. — *Nguồn: TB (tr. 204–205, mục 13.3.37, 13.3.38, 13.3.44); KL (Chương Hai, mục Quang Quý — Tử: "Con hiếu đễ. Có con nuôi"; Chương Ba, cung Tử: Long trì, Phượng các chủ con "khá giả, xinh đẹp"; không nhắc Hồng Loan) (bản quét, đã đọc)*
- **[TU-SP-09]** Tuần, Triệt án ngữ: con đầu lòng vất vả chăm, con lớn khó sống chung một nhà với cha mẹ; sách nói nhiều sao tốt thì số con giảm, nhiều sao xấu thì lại tăng (đảo chiều). — *Nguồn: TB (tr. 205, mục 13.3.45); KL lại xếp Tuần, Triệt vào nhóm bất lợi cho đường con (Chương Ba, cung Tử), không nêu đảo chiều (bản quét, đã đọc)* ⚑1nguồn
- **[TU-SP-10]** Đại Hao, Tiểu Hao, Thiên Khốc, Thiên Hư: con hay đi xa, dễ tiêu xài, cha mẹ – con dễ khác ý. — *Nguồn: TB (tr. 205, mục 13.3.39, 13.3.40)* ⚑1nguồn

### 4.4. Cách cục chính (CC)

- **[TU-CC-01]** Vô chính diệu: lấy chính tinh cung xung chiếu (Điền Trạch) mà luận như chính tinh tọa thủ. — *Nguồn: TB (tr. 207, mục 13.3.68); TT (q.2 «四子女»: "如本宫无星曜专看对宫有何星宿")*
- **[TU-CC-02]** Sinh ban ngày mà Thái Âm mờ ám thủ Tử Tức (hoặc Thái Dương chiếu), sinh ban đêm mà Thái Dương mờ ám thủ (hoặc Thái Âm chiếu): duyên con muộn, nuôi con nhỏ vất vả. — *Nguồn: TB (tr. 198, mục 13.1); TT (q.2 «四子女»: "日生最怕太阴临，夜生最怕太阳照，此星若在儿女宫方恐无儿")*
- **[TU-CC-03]** Thái Dương ở dương cung thì con đầu thường là trai; Thái Âm ở âm cung thì con đầu thường là gái; TB nói thêm: Tử Tức dương cung sinh trai đầu, âm cung sinh gái đầu thì "dễ nuôi". — *Nguồn: TT (q.2 «四子女»: "若太阳星落在阳宫主先生男，太阴星落在阴宫主先生女"); TB (tr. 198, mục 13.1)*
- **[TU-CC-04]** Sát tinh thủ Tử Tức mà không có sao chế hóa, không được sinh: duyên con rất mỏng *(sách gốc diễn đạt nặng: "tuyệt tự", đã trung tính hóa)*. Tử Tức xấu nhưng tam hợp, Phúc Đức, Mệnh Thân tốt thì vẫn có con, con khá giả. — *Nguồn: TT (q.2 «四子女»: "专看刑杀守本宫无制化相生"); TB (tr. 199, mục 13.1, đoạn cuối)*
- **[TU-CC-05]** "Truyền tinh": cung Tử Tức của cha mẹ và cung Mệnh của con có nhiều sao giống nhau thì cha mẹ – con hợp nhau, về sau được nhờ con; nhiều sao khác nhau ("bất truyền tinh") thì ít hợp. — *Nguồn: TB (tr. 228, mục 18.2)* ⚑1nguồn

### 4.5. Tứ hóa tại cung (HOA)

- **[TU-HOA-01]** Hóa Lộc tại Tử Tức: con khá giả, về sau được nhờ con. — *Nguồn: TB (tr. 203, mục 13.3.21); KL (Chương Hai, mục Hóa Lộc: "Ở bất luận cung nào, Hóa lộc cũng mang đến thịnh đạt", nói chung, không riêng Tử Tức) (bản quét, đã đọc)*
- **[TU-HOA-02]** Hóa Quyền: con sớm thành đạt, có chí. — *Nguồn: TB (tr. 203, mục 13.3.22)* ⚑1nguồn
- **[TU-HOA-03]** Hóa Khoa: con thông minh, học hành tốt. — *Nguồn: TB (tr. 203, mục 13.3.23)* ⚑1nguồn
- **[TU-HOA-04]** Hóa Kỵ: muộn con, nuôi con nhỏ vất vả, cha mẹ – con dễ bất đồng. — *Nguồn: TB (tr. 204, mục 13.3.24); TT (q.2 «四子女»: Kỵ nằm trong nhóm "主生子女有刑克")*

### 4.6. Điểm còn tranh luận (TRANH)

- **[TU-TRANH-01]** Số con: TB và TT lệch nhau ở nhiều sao (Cơ Lương: TB năm, TT hai ba; Thiên Lương miếu: TB năm trở lên, TT hai; Cự Môn sáng: TB năm trở lên, TT hai). Ngoài ra số con ngày nay phụ thuộc lựa chọn của gia đình. Kết luận nhóm: chỉ luận xu hướng, không nêu số. — *Nguồn: TB (tr. 200–202); TT (q.2 «四子女»)*
- **[TU-TRANH-02]** Độ sáng: bảng spec mục 6 ghi Thiên Đồng ở Tỵ, Hợi là **đắc**, nhưng TB luận Thiên Đồng Tỵ Hợi ở Tử Tức theo hướng xấu (con ly tán). Thiên Cơ ở Tý, Sửu spec ghi **đắc**, nhưng TB xếp chung với Hợi (hãm) vào nhóm yếu. Giữ bảng spec cho độ sáng; khi luận hai vị trí này thì dùng giọng trung tính. — *Nguồn: TB (tr. 199–200); spec mục 6*
- **[TU-TRANH-03]** Phạm vi cung: TB và TT chỉ bàn con cái; trang hiện đại WT10 mở sang học trò, sản phẩm sáng tạo. Nên dùng phần mở rộng như lớp nghĩa phụ, ghi rõ là lối hiện đại. — *Nguồn: TB (tr. 198); WT10*
- **[TU-TRANH-04]** Những quy tắc TB về sẩy thai, dị tật, "con là thần nhân giáng thế", "con dâm đãng", và quy tắc vòng Tràng Sinh định đúng số con (mục 13.3.27–13.3.36, 13.3.43, 13.3.47–13.3.67) bị **loại khỏi luận giải** vì hoặc gây sợ, hoặc phán xét đạo đức, hoặc mang tính thần bí. — *Nguồn: TB (tr. 204–207)*
- **[TU-TRANH-05]** Phân loại Nam/Bắc Đẩu: TB đưa Thái Dương, Thiên Cơ vào Nam Đẩu để suy giới tính con; TT chỉ nói chung "Nam Đẩu nhiều thì sinh trai" và tách riêng quy tắc Thái Dương dương cung / Thái Âm âm cung. Chưa có sách thứ ba để chốt. — *Nguồn: TB (tr. 198); TT (q.2 «四子女»)*

---

## 5. Cung Tài Bạch

### 5.1. Ý nghĩa cung (YN)

- **[TAI-YN-01]** Cung Tài Bạch xem cách kiếm tiền, nguồn sống (sinh kế), mức sung túc và cách tiêu, giữ tiền. — *Nguồn: TB (tr. 190, "Xem cung Tài Bạch để biết rõ sự giàu nghèo, và sinh kế"); TT (q.2 «五财帛»); WT11 ("liquid money and earning capacity")*
- **[TAI-YN-02]** Trước khi xét sao tại Tài Bạch phải xét Mệnh, Thân, Phúc Đức, Quan Lộc, Thiên Di. Các cung này đẹp thì Tài Bạch kém cũng không đáng lo; các cung này kém thì Tài Bạch đẹp cũng chưa trọn. — *Nguồn: TB (tr. 190); TT (q.3 «论男女命同异»: "男命先看身命，次看财帛宫禄迁移，俱要庙旺为吉")*
- **[TAI-YN-03]** Tam hợp Tài Bạch là Mệnh và Quan Lộc; cung xung chiếu là Phúc Đức. Cần xem Phúc Đức vì đó là cung đối của Tài Bạch (Tài tốt mà Phúc kém: kiếm được tiền nhưng khó thấy an lòng). — *Nguồn: TT (q.3 «谈星要论»: "四看福德宫…以福德宫对财帛宫也"); WT11 (Wealth–Fortune axis, tam phương Mệnh – Quan – Di); spec mục 2.4*
- **[TAI-YN-04]** Vũ Khúc là "tài tinh", chủ cung Tài Bạch; Thiên Phủ chủ kho (tài bạch, điền trạch). Tài Bạch sáng đẹp có tài tinh tọa thủ, Mệnh Thân xa Song Hao và sát tinh thì thường sung túc. — *Nguồn: TT (q.1 «诸星问答论» mục 武曲: "乃财帛宫主"; mục 天府: "职掌财帛、田宅、衣禄之神"); TB (tr. 230, chú "Tài tinh là tên riêng của Vũ Khúc"; tr. 234, mục 20.3)*
- **[TAI-YN-05]** Tài Bạch là dòng tiền vào ra, Điền Trạch là nơi tích lũy; nên đọc hai cung cùng nhau (Tài mạnh mà Điền yếu: kiếm nhiều nhưng khó tích lũy). — *Nguồn: WT11 ("Caibo is the river, Property is the reservoir"); TT (q.3 «财宅»: các cách xét chung Tài – Điền)*

> Ghi chú cho người viết: Tài Bạch nói về **phong cách kiếm và giữ tiền**, không phải con số thu nhập. Không hứa giàu, không phán nghèo; dùng "thuận lợi khi…", "nên chú ý…". *(Nhận xét nhóm, không phải quy tắc gốc)*

### 5.2. 14 chính tinh tại cung

#### Tử Vi
- **[TAI-TV-01]** Tử Vi miếu (Ngọ) đơn thủ hoặc Tử Tướng: tài lộc dồi dào, có tích lũy; Tử Vi ở Tý (bình): khá nhưng kém hơn ở Ngọ. Gợi ý: tự nắm các quyết định lớn dựa trên bảng tổng tài sản xem lại mỗi quý; đặt hạn mức cho khoản chi vì thể diện. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 190, mục 12.1); TT (q.2 «五财帛»: "紫微丰足仓箱…天相同财帛蓄积")*
- **[TAI-TV-02]** Tử Vi gặp Kình, Đà, Hỏa, Linh, Không, Kiếp: tài lộc không vượng như thường. Gợi ý: hỏi ý người am hiểu tài chính trước quyết định lớn. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TT (q.2 «五财帛»: "加羊陀火铃空劫不旺"); TB (tr. 194–195, mục 12.15–12.17: Kình Đà, Hỏa Linh, Không Kiếp mờ ám thì hao tán)*
- **[TAI-TV-03]** Đồng cung: Tử Phủ giàu, giữ của bền, hợp nghề tài chính; Tử Sát kiếm tiền nhanh; Tử Phá buổi đầu chật vật, về sau dễ kiếm. — *Nguồn: TB (tr. 190, mục 12.1); TT (q.2 «五财帛»: "天府同富足终身保守…七杀同加吉财帛横发", "破军同先难后易")*

#### Liêm Trinh
- **[TAI-LT-01]** Liêm Trinh vượng (Dần, Thân) đơn thủ: kiếm tiền qua cạnh tranh, môi trường sôi động; giàu chậm nhưng chắc. Liêm Phủ, Liêm Tướng: khá giả, giữ của bền. Gợi ý: chọn lĩnh vực cạnh tranh nhưng luật chơi minh bạch; tự viết nguyên tắc tiền bạc (cho vay, hùn vốn) và giữ đúng. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 190, mục 12.2); TT (q.2 «五财帛»: "廉贞在申寅宫闹中生财…天相同富足仓箱")*
- **[TAI-LT-02]** Liêm Trinh hãm (Tỵ, Hợi, đồng cung Tham Lang): tài chính dễ lên xuống thất thường, dễ vướng tranh chấp vì tiền; nên giữ giấy tờ, hợp đồng minh bạch *(sách gốc diễn đạt nặng, đã trung tính hóa)*. — *Nguồn: TB (tr. 190: "Hay mắc tai họa vì tiền, nhất là kiện tụng"); TT (q.2 «五财帛»: "贪狼生横发横破")*
- **[TAI-LT-03]** Liêm Phá (Mão, Dậu, Liêm hãm): tiền vào ra thất thường, hay tiêu nhiều nhưng hết lại có; buổi đầu khó, sau dễ hơn. Liêm Sát: kiếm tiền trong môi trường xáo động. — *Nguồn: TB (tr. 190, mục 12.2); TT (q.2 «五财帛»: "陷宫先难后易…七杀同闹中取")*

#### Thiên Đồng
- **[TAI-TD-01]** Thiên Đồng đắc (Mão) đơn thủ, hoặc Đồng Âm tại Tý: tay trắng làm nên, càng về sau càng khá; Đồng Lương: kinh doanh ngày càng phát. Gợi ý: chọn nguồn thu gắn với việc mình thích làm lâu dài; đặt ngày cố định trong tháng xem lại khoản chi theo cảm hứng. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 190–191, mục 12.3); TT (q.2 «五财帛»: "天同白手生财晚发…天梁同财大旺")*
- **[TAI-TD-02]** Thiên Đồng hãm (Thìn, Tuất): tài chính hay eo hẹp; Dậu (hãm): tiền tụ tán thất thường; Đồng Âm tại Ngọ: phải vất vả, về già mới khá. Gợi ý: giữ bảng ngân sách tối giản ba nhóm: thiết yếu, tiết kiệm, tiêu dùng. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 190–191); TT (q.2 «五财帛» mục 太阴: "陷宫成败不聚")*
- **[TAI-TD-03]** Đồng Cự: tiền tụ tán thất thường, dễ thị phi vì tiền; đi xa, làm ăn nơi khác thì thuận hơn. — *Nguồn: TB (tr. 191); TT (q.2 «五财帛»: "巨门同财气进退")*

#### Vũ Khúc
- **[TAI-VK-01]** Vũ Khúc miếu (Thìn, Tuất) đơn thủ: tài lộc lớn; gặp cát hóa thì càng vượng. Gợi ý: dành khoản cố định mỗi năm cho học hỏi và các mối quan hệ để kỷ luật không quá cứng. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 191, mục 12.4); TT (q.2 «五财帛»: "武曲丰足化吉有巨万家资")*
- **[TAI-VK-02]** Vũ Phủ: giàu, giữ của bền; Vũ Tướng: của cải dồi dào, hay gặp người nâng đỡ. — *Nguồn: TB (tr. 191); TT (q.2 «五财帛»: "天相同财帛丰盈，遇贵生财成家"; q.3 «财宅»: "紫府武曲居财帛更兼权禄富奢翁")*
- **[TAI-VK-03]** Vũ Tham: từ sau khoảng 30 tuổi mới phát; Vũ Sát: tay trắng lập nghiệp, đầu vất vả sau dễ. Hai sách khớp gần như nguyên văn. Gợi ý: đào sâu một nguồn thu chính trước khi mở thêm nguồn khác. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 191: "từ ngoài 30 trở đi, mới giàu"; "tay trắng lập nghiệp"); TT (q.2 «五财帛»: "七杀同白手生财成家，贪狼同三十年后方发财")*
- **[TAI-VK-04]** Vũ Khúc hãm (Tỵ, Hợi, đồng cung Phá Quân): tiền vào tay này ra tay kia, trước ít sau có; hợp ngành sản xuất, thương mại. Gặp Kình, Đà, Hỏa, Linh thì khó tụ, kỵ nhất gặp Không vong. Gợi ý: chuyển một phần thu nhập sang tài khoản khó rút ngay khi nhận tiền. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 191: "tiền vào tay này sang tay kia, trước không sau có"); TT (q.2 «五财帛»: "破军同东来西去先无后有…加羊陀火铃不聚极怕空亡")*

#### Thái Dương
- **[TAI-TDU-01]** Thái Dương sáng (Dần đến Ngọ): dễ kiếm tiền, sung túc. Gợi ý: xây uy tín cá nhân rõ ràng; chờ một ngày trước khi nhận lời cho mượn hoặc tài trợ khoản lớn. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 191, mục 12.5); TT (q.2 «五财帛»: "太阳入庙丰足")*
- **[TAI-TDU-02]** Thái Dương hãm (Thân đến Tý): phải vất vả mới đủ dùng, về già mới sung túc. Gợi ý: đặt mục tiêu tài chính theo mốc 5 năm, không so với người cùng tuổi. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 191); TT (q.2 «五财帛»: "陷宫劳碌不遂")*
- **[TAI-TDU-03]** Nhật Nguyệt đồng cung: trước ít sau nhiều; gặp Tả Hữu, cát tinh thì phát khá. Nhật Cự: TB nói tại Dần giàu, tại Thân vất vả; TT nói chung "sớm thành bại, trung niên chưa đầy". — *Nguồn: TB (tr. 191–192); TT (q.2 «五财帛»: "太阴同加左右吉星发财不小…巨门同早年成败中未充盈")*

#### Thiên Cơ
- **[TAI-TCO-01]** Thiên Cơ sáng (Tỵ, Ngọ, Mùi) đơn thủ: tiền bạc sung túc; bản chất là kiếm tiền bằng trí óc, tính toán, "lao tâm". Gợi ý: chọn một nguồn thu phụ từ chuyên môn, giới hạn thời gian để không quá sức; giữ kế hoạch tài chính ít nhất sáu tháng rồi mới đổi. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 191, mục 12.6); TT (q.2 «五财帛»: "天机劳心费力生财")*
- **[TAI-TCO-02]** Thiên Cơ ở Hợi (hãm), Tý, Sửu: kiếm tiền chậm và khó; gặp Kình, Đà, Hỏa, Linh, Không, Kiếp thì một đời có thành có bại. Gợi ý: thử ý tưởng kiếm tiền ở quy mô nhỏ trước khi mở rộng. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 191); TT (q.2 «五财帛»: "加羊陀火铃空劫一生有成有败"); KL (Chương Hai, mục Thiên Cơ — Tài: "Cơ Cự, Cơ Lương hay Cơ đơn thủ ở Ngọ Mùi thì phát tài, còn ở các cung khác thì chật vật") (bản quét, đã đọc). Lưu ý: KL xếp cả Tỵ vào nhóm chật vật, TB xếp Tỵ vào nhóm sáng*
- **[TAI-TCO-03]** Cơ Lương: dễ làm giàu nhờ mưu trí, có nguồn thu ngoài; Cơ Cự: giàu nhờ cạnh tranh, hoạt động sôi nổi; Cơ Âm tại Thân tay trắng mà khá, tại Dần thành bại thất thường. — *Nguồn: TB (tr. 191); TT (q.2 «五财帛»: "巨门同闹中求取，天梁同机关巧计生外财，太阴同陷宫成败")*

#### Thiên Phủ
- **[TAI-TP-01]** Thiên Phủ đắc (Tỵ, Hợi) đơn thủ: sung túc, giữ của bền; ở Sửu, Mùi, Mão, Dậu: khá nhưng kém hơn. Gợi ý: chia tài sản thành ba ngăn: dự phòng, mục tiêu gần, mục tiêu xa; tiền tích lũy chỉ dùng cho mục tiêu đã định. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 191, mục 12.7); TT (q.2 «五财帛»: "天府富足")*
- **[TAI-TP-02]** Thiên Phủ gặp Kình, Đà, Hỏa, Linh, Không, Kiếp: có thành có bại, không còn ổn định. Gợi ý: kiểm lại quỹ khẩn cấp trước mỗi khoản chi lớn. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TT (q.2 «五财帛»: "见羊陀火铃空劫有成败"); TB (tr. 194–195, mục 12.15–12.17)*

#### Thái Âm
- **[TAI-TA-01]** Thái Âm miếu (Dậu, Tuất, Hợi): dễ kiếm tiền, tích lũy tốt; Thái Âm cùng Lộc Tồn, Tả Hữu thì rất khá. Gợi ý: tích lũy định kỳ một tỷ lệ cố định của thu nhập; ghi lý do mua trước các món ngoài dự tính. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 192, mục 12.8); TT (q.2 «五财帛»: "太阴入庙富足仓箱…禄存兼左右同主大富")*
- **[TAI-TA-02]** Thái Âm hãm (Mão, Thìn, Tỵ): phải vất vả, thành bại khó tụ, về già mới sung túc. Gợi ý: ghi lại những lần tiền tụ rồi tán để tìm khoản chi lặp lại cần cắt. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 192); TT (q.2 «五财帛»: "陷宫成败不聚")*

#### Tham Lang
- **[TAI-THL-01]** Tham Lang vượng (Thìn, Tuất) đơn thủ: có thể phát nhanh ("hoạnh phát"), càng về già càng khá. Gợi ý: trích ngay một phần khoản thu lớn bất ngờ vào tích lũy; đặt trần chi giải trí mỗi tháng. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 192, mục 12.9); TT (q.2 «五财帛»: "贪狼庙旺横发")*
- **[TAI-THL-02]** Tham Lang hãm (Tý, Ngọ): dễ tiêu xài vì vui chơi, tài chính eo hẹp; nên lập kỷ luật chi tiêu *(sách gốc diễn đạt nặng, đã trung tính hóa)*. Tại Dần, Thân (đắc): tiền vào ra nhanh. — *Nguồn: TB (tr. 192: "hoang phí, chơi bời nên hao tán"); TT (q.2 «五财帛»: "陷地贫穷")*
- **[TAI-THL-03]** Tham Lang gặp Hỏa Tinh: trước 30 tuổi có thành có bại, sau 30 có thể phát nhanh. — *Nguồn: TT (q.2 «五财帛»: "见火星三十年前成败，三十年后横发"); WT7 (Tham Lang gặp Hỏa, Linh "giàu nhanh hoặc được của bất ngờ")*

#### Cự Môn
- **[TAI-CM-01]** Cự Môn sáng (Tý, Ngọ vượng; Hợi đắc) đơn thủ: tay trắng lập nghiệp, hợp môi trường cạnh tranh, sôi động. Gợi ý: rèn kỹ năng đàm phán giá; thống nhất điều khoản thanh toán bằng văn bản trước khi làm. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 192, mục 12.10: "tay trắng lập nghiệp… nhất là trong lúc náo loạn, cạnh tranh"); TT (q.2 «五财帛»: "巨门白手生财成家，宜闹中取")*
- **[TAI-CM-02]** Cự Môn hãm (Thìn, Tuất, Tỵ): tiền tụ tán thất thường, dễ thị phi vì tiền; gặp Kình, Đà, Hỏa, Linh, Không, Kiếp thì nhiều đường hao. Gợi ý: bàn chuyện tiền chung riêng tư, nói rõ từng con số. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 192); TT (q.2 «五财帛»: "加羊陀火铃空劫破财多端")*

#### Thiên Tướng
- **[TAI-TT-01]** Thiên Tướng đắc (Tỵ, Hợi, Sửu, Mùi) đơn thủ: sung túc, hay có mối lợi tự đến. Gợi ý: lưu lời giới thiệu, phản hồi tốt từ đối tác; tự hỏi "cần không, đủ tiền không, để sau được không" trước khi chi theo lời rủ. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 193, mục 12.11); TT (q.2 «五财帛»: "天相富足")*
- **[TAI-TT-02]** Thiên Tướng hãm (Mão, Dậu): bình thường, hợp nghề kỹ thuật, công nghệ; gặp Kình, Đà, Hỏa, Linh, Không, Kiếp, Hao, Kỵ thì thành bại, khó tích lũy. Gợi ý: học một kỹ năng kỹ thuật có chứng chỉ để nâng mức thu nhập. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 193: "bình thường, nên chuyên về công nghệ"); TT (q.2 «五财帛»: "加羊陀火铃空劫耗忌，成败无积聚")*

#### Thiên Lương
- **[TAI-TL-01]** Thiên Lương miếu (Ngọ), đắc (Tý): tài chính vững, ít phải lo sinh kế. Gợi ý: lập kế hoạch tài chính sớm cho các mốc lớn của gia đình; đặt giới hạn tổng cho khoản giúp đỡ trong năm. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 193, mục 12.12); TT (q.2 «五财帛»: "天梁富足入庙上等富贵")*
- **[TAI-TL-02]** Thiên Lương hãm (Tỵ, Hợi): kiếm tiền phải đi nhiều nơi, vất vả, khó giữ của. Gợi ý: gom tiết kiệm về một nơi, hạn chế để rải rác. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 193: "lang thang nay đây mai đó đi kiếm tiền… không giữ được của"); TT (q.2 «五财帛»: "陷宫辛勤求财度日"); WT7 (hãm "phiêu bạt, vất vả kiếm tiền")*

#### Thất Sát
- **[TAI-TS-01]** Thất Sát miếu (Dần, Thân) đơn thủ: trước ít sau nhiều, đến tuổi trung niên kiếm tiền nhanh; tại Tý, Ngọ (miếu): tụ tán thất thường nhưng hay có khoản thu bất ngờ. Gợi ý: xác định mức thu tối thiểu mỗi tháng, chỉ nhận rủi ro mới khi giữ được mức này; chia khoản thu theo đợt cho từng tháng tới. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 193, mục 12.13); KL (Chương Hai, mục Thất Sát — Tài: "Dần Thân kiếm tiền dễ dàng", "Tí Ngọ tiền bạc thất thường", "Thất sát Tử vi ở Tỵ dễ làm giàu", "Sát Liêm đồng cung tiền bạc thất thường", "Sát Vũ đồng cung lập nghiệp tự lực, vất vả buổi đầu") (bản quét, đã đọc); WT7 (Thất Sát miếu vượng gặp Lộc, Quyền, Khoa "nguồn tiền tài dồi dào", "của bất ngờ")*
- **[TAI-TS-02]** Thất Sát hãm (Thìn, Tuất): tài chính hay eo hẹp *(sách gốc: "suốt đời thiếu thốn", đã trung tính hóa)*; WT7 nói gặp Tả Hữu, Xương Khúc thì cải thiện. TT không có mục Thất Sát đơn thủ ở Tài Bạch. Gợi ý: chờ ba ngày trước quyết định tiền bạc lớn hơn một tháng thu nhập. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 193); KL (Chương Hai, mục Thất Sát — Tài: "Sát Thìn Tuất: thiếu thốn") (bản quét, đã đọc); WT7*

#### Phá Quân
- **[TAI-PQ-01]** Phá Quân miếu (Tý, Ngọ) đơn thủ: có tích lũy, kiếm tiền mạnh tay, dám chi để thu lớn; tại Thìn, Tuất (vượng) cũng khá, tụ tán nhưng hết lại có. Gợi ý: tách quỹ thử nghiệm riêng cho ý tưởng mới, hết quỹ thì dừng; viết trước mức lỗ tối đa khi đổi hướng. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 193–194, mục 12.14); TT (q.2 «五财帛»: "破军在子午宫，多有金银宝贝蓄积，辰戌旺宫亦财盛")*
- **[TAI-PQ-02]** Phá Quân hãm (Dần, Thân): kiếm tiền khó, chi nhiều hơn thu; hợp nghề thủ công, mỹ thuật. Gặp Không Kiếp thì rất eo hẹp. Gợi ý: theo dõi chênh lệch thu chi mỗi tháng, cắt khoản chi lớn nhất khi âm. *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 194: "kiếm tiền khó khăn, thu vào ít phóng ra nhiều, nên làm nghề thủ công hay mỹ thuật"); TT (q.2 «五财帛»: "陷宫破祖不聚…加空劫极贫")*

### 5.3. Bộ sao phụ quan trọng (SP)

- **[TAI-SP-01]** Lộc Tồn: sung túc, dễ có tiền; gặp sát tinh thì trước ít sau có. — *Nguồn: TB (tr. 194, mục 12.21); TT (q.2 «五财帛»: "禄存富足仓箱堆金积玉…羊陀火铃空劫耗忌先无后有")*
- **[TAI-SP-02]** Tả Phù, Hữu Bật: dễ làm giàu, hay được người giúp về tiền; gặp sát tinh, Hao, Kỵ thì thành bại không tụ. — *Nguồn: TB (tr. 194, mục 12.20); TT (q.2 «五财帛»: "左辅右弼，诸宫富足，会诸吉星得贵人财，加羊陀火铃空劫耗忌，主成败而不聚")*
- **[TAI-SP-03]** Thiên Khôi, Thiên Việt: dễ kiếm tiền, gặp quý nhân; TT nói kiếm tiền theo lối "thanh cao". — *Nguồn: TB (tr. 194, mục 12.19); TT (q.2 «五财帛»: "魁钺主清高中生财一生遂意")*
- **[TAI-SP-04]** Văn Xương, Văn Khúc: nhiều sao sáng thì khá giả; nhiều sao xấu thì hao, hay phiền vì tiền nhưng vẫn có người giúp. — *Nguồn: TB (tr. 194, mục 12.18); TT (q.2 «五财帛»: "文昌富足仓箱，加吉星财气旺"; "文曲…加羊陀火铃空劫…东来西去")*
- **[TAI-SP-05]** Kình Dương, Đà La: đắc địa (tứ mộ) thì kiếm tiền trong môi trường cạnh tranh, nhanh; hãm thì hao, phải vất vả xoay xở. — *Nguồn: TB (tr. 194, mục 12.15); TT (q.2 «五财帛»: "擎羊辰戌丑未宫闹中生财，陷地破祖不聚"; "陀罗闹中生财，陷宫辛勤求财度日")*
- **[TAI-SP-06]** Hỏa Tinh, Linh Tinh: sáng thì phát nhanh nhưng cũng hao nhanh ("hoạnh phát hoạnh phá"); hãm thì vất vả. — *Nguồn: TB (tr. 194, mục 12.16); TT (q.2 «五财帛»: "火星独守横发横破，陷宫辛勤"; "铃星入庙独守横发，陷地孤寒辛苦度日")*
- **[TAI-SP-07]** Địa Không, Địa Kiếp: đắc địa thì có thể lên nhanh nhưng đi xuống bất ngờ, hay đầu tư táo bạo; hãm thì eo hẹp. Nên tránh rủi ro cao *(gợi ý của nhóm)*. — *Nguồn: TB (tr. 195, mục 12.17); TT (q.3 «财福»: "劫空临财福之乡生来贫贱")*
- **[TAI-SP-08]** Thiên Mã: dễ kiếm tiền ở phương xa; Lộc Tồn (hoặc Hóa Lộc) gặp Thiên Mã: làm ăn xa, buôn bán phát đạt. — *Nguồn: TB (tr. 195–196, mục 12.24, 12.39, 12.44); KL (Chương Ba, Coi các cung — cung Tài: "Lộc Mã giao trì… thì cũng giàu sang có ngày"; không nói riêng về phương xa) (bản quét, đã đọc)*
- **[TAI-SP-09]** Đại Hao, Tiểu Hao: dễ chi tiêu quá tay; sáng thì dễ kiếm nhưng tiêu hết, hãm thì eo hẹp. — *Nguồn: TB (tr. 195, mục 12.27); KL (Phú Ma Thị: "Song Hao thiết kỵ ư tài cung"; Chương Hai, mục Song Hao — Tài: "Tán tài") (bản quét, đã đọc)*
- **[TAI-SP-10]** Cô Thần, Quả Tú: tiết kiệm, khéo giữ của; Đẩu Quân: giữ của vững; Ân Quang, Thiên Quý: hay có người giúp tiền. — *Nguồn: TB (tr. 195, mục 12.25, 12.28, 12.29); KL (Phú Ma Thị: Cô Thần, Quả Tú "nên đóng ở cung Điền Trạch và cung Tài bạch để giữ của"; mục Quang Quý — Tài: "Được người giúp") (bản quét, đã đọc); NL (Quyền uy của Đẩu Quân: Đẩu Quân "ở cung điền tài thì giữ gìn điền sản") (bản quét, đã đọc)*
- **[TAI-SP-11]** Tuần, Triệt án ngữ Tài Bạch: cùng nhiều sao tốt thì kiếm tiền khó, vào ra nhanh; cùng nhiều sao xấu thì trước khó sau dễ (đảo chiều). — *Nguồn: TB (tr. 195–196, mục 12.34); KL (Chương Hai, mục Tuần Triệt: "chính tinh tọa chủ vốn xấu, gặp Tuần Triệt sẽ được giải thoát"; mục Vũ Khúc: Tuần Triệt thuộc "các sao khắc Vũ khúc ở Tài Điền") (bản quét, đã đọc)*

### 5.4. Cách cục chính (CC)

- **[TAI-CC-01]** Nhật Nguyệt giáp Tài: cung Tài Bạch (hoặc Mệnh) có Thái Dương, Thái Âm ở hai cung kẹp hai bên, thêm cát tinh, thì "không quý cũng giàu". Ví dụ TT: Tài tại Mùi có Thiên Phủ, Nhật ở Ngọ, Nguyệt ở Thân. — *Nguồn: TT (q.3 «财帛»: "日月夹财加吉曜不贵则富"; q.1 «定富局»: "日月夹财…财帛宫亦然"); TB (tr. 230, mục 19.1.4)*
- **[TAI-CC-02]** Tả Hữu giáp hoặc hợp chiếu Tài Bạch, Quan Lộc: cơm áo dồi dào. — *Nguồn: TT (q.3 «财帛»: "左右财官兼夹拱衣禄丰隆"); TB (tr. 194, mục 12.20)*
- **[TAI-CC-03]** Tử Phủ, Vũ Khúc ở Tài Bạch kèm Hóa Quyền, Hóa Lộc: rất giàu. Tử Vi với Tả Hữu ở Tài Bạch: hợp nghề quản lý tài chính. — *Nguồn: TT (q.3 «财宅»: "紫府武曲居财帛更兼权禄富奢翁"; q.3 «论诸星同垣…»: "紫微辅弼同宫…在财帛宫则为财赋之官"); TB (tr. 190–191, mục 12.1, 12.4: "thường làm quan về tài chính")*
- **[TAI-CC-04]** Vũ Khúc hoặc Thái Âm ở Tài Bạch: hợp công việc liên quan tài chính, ngân quỹ. — *Nguồn: TT (q.3 «财宅»: "武曲太阴多居财赋之任…取财帛宫遇武曲或遇太阴星"); TT (q.1 «诸星问答论» mục 武曲: "与太阴以互权…财帛田宅为专司之所"); KL (Chương Hai, mục Vũ Khúc: "Vũ khúc là Tài bạch tinh… có óc kinh doanh"; KL không nhắc Thái Âm ở điểm này) (bản quét, đã đọc)*
- **[TAI-CC-05]** Tài Lộc giáp Mã: Thiên Mã thủ cung, Vũ Khúc và Lộc kẹp hai bên, gặp đất sinh vượng càng tốt. TB áp cho Mệnh, Điền, Tài; TT ghi cho Mệnh. — *Nguồn: TT (q.1 «定富局»: "财禄夹马 马守命武禄来夹是也"); TB (tr. 230, mục 19.1.6)*
- **[TAI-CC-06]** Vũ Khúc sáng ở Tài Bạch tại tứ mộ (Thìn, Tuất, Sửu, Mùi) và Thái Âm sáng chiếu Điền Trạch: cách giàu đẹp nhất theo TB. — *Nguồn: TB (tr. 234, mục 20.3)* ⚑1nguồn
- **[TAI-CC-07]** Vô chính diệu: lấy chính tinh xung chiếu (Phúc Đức) mà luận; khó giàu lớn, trừ hai trường hợp: có Tuần/Triệt án ngữ (trước khó sau dễ, về già sung túc), hoặc Nhật Nguyệt cùng sáng xung chiếu hay hợp chiếu (giàu). — *Nguồn: TB (tr. 197, mục 12.56); KL đồng ý hai ngoại lệ (mục Nhật Nguyệt — Tài: "Nhật Nguyệt sáng chiếu rất giầu có"; mục Tuần Triệt: vô chính diệu có Tuần Triệt "thì lại tốt") nhưng (bàn ở cung Di) không tán thành mượn chính tinh cung đối (bản quét, đã đọc)* ⚑1nguồn
- **[TAI-CC-08]** Không Kiếp ở Tài Bạch hoặc Phúc Đức: tài chính dễ chật vật; Hóa Quyền, Hóa Lộc ở Tài Bạch hoặc Phúc Đức: sớm có điều kiện. — *Nguồn: TT (q.3 «财福»: "权禄守财福之位出世荣华，劫空临财福之乡生来贫贱"); TB (tr. 194–195, mục 12.17, 12.21, 12.22)*

### 5.5. Tứ hóa tại cung (HOA)

- **[TAI-HOA-01]** Hóa Lộc tại Tài Bạch: dễ kiếm tiền, sung túc. — *Nguồn: TB (tr. 194, mục 12.21); TT (q.3 «财福»: "权禄守财福之位出世荣华")*
- **[TAI-HOA-02]** Hóa Quyền: làm giàu nhanh, có quyền chủ động trong tiền bạc, hay gặp người giúp. — *Nguồn: TB (tr. 195, mục 12.22); TT (q.3 «财福»)*
- **[TAI-HOA-03]** Hóa Khoa: kiếm tiền nhờ uy tín, danh tiếng; hay gặp người giúp. — *Nguồn: TB (tr. 195, mục 12.22)* ⚑1nguồn
- **[TAI-HOA-04]** Hóa Kỵ: dễ hao tiền, tiền bạc vướng bận; TT nói Kỵ thủ cung thì việc buôn bán, nghề nghiệp "đều không lợi", nên chỉ làm "bảy phần". Gợi ý: quản lý chi tiêu, tránh đầu tư liều. — *Nguồn: TB (tr. 195, mục 12.23: "Tán tài"); TT (q.1 «诸星问答论» mục 化忌: "虽商贾技艺人，皆不宜利…处事只求七分")*

### 5.6. Điểm còn tranh luận (TRANH)

- **[TAI-TRANH-01]** Tử Tham ở Tài Bạch: TB nói "được hưởng của hương hỏa, nhưng về sau cũng suy kém"; TT nói "hiện thành, gia kế về sau càng đầy" (紫微同守现成，家计自后更丰盈). Hai sách **ngược nhau** về giai đoạn sau. Khi luận: chỉ nói "có nền tảng sẵn, cần chủ động duy trì". — *Nguồn: TB (tr. 190, 192); TT (q.2 «五财帛»)*
- **[TAI-TRANH-02]** Độ sáng: spec mục 6 ghi Thiên Đồng ở Tỵ, Hợi là **đắc**, Thiên Cơ ở Tý, Sửu là **đắc**, nhưng TB luận các vị trí này ở Tài Bạch theo hướng kém (hoang phí; kiếm tiền chậm). Giữ bảng spec, dùng giọng trung tính. — *Nguồn: TB (tr. 190–191); spec mục 6*
- **[TAI-TRANH-03]** Phạm vi cách cục: TB mở "Kim Sán Quang Huy" (Thái Dương ở Ngọ) và "Nhật Nguyệt chiếu bích" sang cả cung Điền, Tài; TT chỉ ghi Kim Sán Quang Huy cho Mệnh tại Ngọ, Nhật Nguyệt chiếu bích cho Điền Trạch. Nhóm chỉ dùng hai cách này cho Tài Bạch như yếu tố phụ. — *Nguồn: TB (tr. 230, mục 19.1.3, 19.1.5); TT (q.1 «定富局»: "金灿光辉 太阳单守，命在午宫是也", "日月照璧 日月临田宅宫是也")*
- **[TAI-TRANH-04]** TB có nhiều quy tắc phán xét đạo đức (Hình + Lực Sĩ "hay đi ăn trộm", Không Kiếp + Tả Hữu "lừa đảo", Đào Hồng "nhờ nhan sắc", Xương Khúc "thích đánh bạc"; mục 12.18, 12.26, 12.36–12.38, 12.52) và câu mở chương "giàu nhưng chết non". Nhóm **loại khỏi luận giải**: không suy tư cách đạo đức của khách từ lá số. — *Nguồn: TB (tr. 190, 194–197)*
- **[TAI-TRANH-05]** Thất Sát đơn thủ ở Tài Bạch: TT không có mục riêng, chỉ có tổ hợp Tử Sát, Vũ Sát, Liêm Sát; quy tắc TAI-TS-01/02 chủ yếu dựa TB, WT7 chỉ là trang hiện đại không ghi sách. Cập nhật 30/10/2026 (L-b2e4a1): KL (Chương Hai, mục Thất Sát — Tài) khớp TB ở cả 6 ý (Dần Thân, Tý Ngọ, Tử Sát Tỵ, Liêm Sát, Vũ Sát, Thìn Tuất), nên TS-01/02 đủ 2 sách; NL không có mục Thất Sát theo cung (đã tìm trong bản quét 3 tập). KL và TB cùng dòng sách Việt thập niên 1960, chưa chắc độc lập hoàn toàn. — *Nguồn: TT (q.2 «五财帛»); TB (tr. 193); WT7*

---

## 6. Cung Tật Ách

> **Ranh giới bắt buộc cho cung này.** Sách gốc (TB tr. 181–189) liệt kê bệnh cụ thể, tai nạn, tù tội, cả "lúc chết". Tệp này **chỉ giữ**: (1) vùng cơ thể / chức năng nên chú ý, (2) thể trạng chung mạnh hay cần chăm sóc, (3) lời khuyên sinh hoạt, khám định kỳ. Mọi câu về tai nạn, tù tội, tự tử, mất mạng, bệnh nặng có tên đều **đã lược**; chỗ lược ghi "*(sách gốc có ý về tai nạn/bệnh nặng; đã lược)*". Bài luận không được dùng từ chẩn đoán, không thay lời khuyên của bác sĩ. *(Nhận xét nhóm; phù hợp WT9: "suggestive, not diagnostic")*

### 6.1. Ý nghĩa cung (YN)

- **[TAT-YN-01]** Cung Tật Ách xem thể chất bẩm sinh, vùng cơ thể hay chức năng dễ yếu, khả năng hồi phục. (Sách gốc còn dùng để xem tai ương và "lúc chết"; sản phẩm không dùng phần này.) — *Nguồn: TB (tr. 181, đoạn mở chương 11); TT (q.2 «六疾厄»); WT9 ("the body's baseline… recurring conditions")*
- **[TAT-YN-02]** Trước khi xét Tật Ách phải xét Mệnh, Thân và Phúc Đức: các cung này sáng đẹp, có phúc tinh, cứu tinh thì Tật Ách xấu cũng không đáng lo; TT dạy xem sao ở Mệnh có hãm và gặp sát, Kỵ không, rồi mới xét Tật Ách. — *Nguồn: TB (tr. 181; tr. 234, mục 20.6); TT (q.2 «六疾厄»: "先看命宫星曜落陷加羊陀火铃空劫化忌守照如何，又看疾厄宫星曜善恶庙旺落陷如何断之")*
- **[TAT-YN-03]** Phải cân hai nhóm sao: nhóm "cứu giải" (giúp giảm, hồi phục) và nhóm "tác họa" (gây yếu); bù trừ hai nhóm mới kết luận. — *Nguồn: TB (tr. 181, mục 11.1, 11.2); TT (q.2 «六疾厄»: xét "善恶庙旺落陷")*
- **[TAT-YN-04]** Tật Ách xung chiếu Phụ Mẫu (spec mục 2.4): thể chất có phần thừa hưởng từ cha mẹ; NL coi đây là trục "nhân quả gia đình" giữa Phụ Mẫu và Tật Ách. Tam hợp Tật Ách là Huynh Đệ và Điền Trạch. — *Nguồn: NL (tr. 129–131, "Phụ Mẫu liên quan gì tới Tật Ách"); WT9 (Health–Parents axis, "inherited body")*
- **[TAT-YN-05]** Mỗi sao tượng trưng cho bộ phận, chức năng trong cơ thể; phải kết hợp tính chất sao với biểu tượng để suy ra vùng cần chú ý. — *Nguồn: TB (tr. 181; tr. 235, mục 20.6: "nhận xét biểu tượng những cơ thể trong người bằng các sao"); WT9 (ngũ hành sao ↔ cơ quan)*

### 6.2. 14 chính tinh tại cung

Phần lớn sách không tách rõ miếu/hãm cho từng sao ở Tật Ách; nơi sách có tách thì ghi, nơi không tách thì (a) là trạng thái sáng / ít sát, (b) là hãm hoặc gặp sát tinh, Hóa Kỵ.

#### Tử Vi
- **[TAT-TV-01]** Tử Vi (đơn thủ Tý, Ngọ; Tử Phủ; Tử Sát) là sao cứu giải: thể trạng khá, ít bệnh, có bệnh dễ gặp thầy thuốc. — *Nguồn: TB (tr. 181, mục 11.1.1); TT (q.2 «六疾厄»: "紫微灾少，天府同亦少"); WT8 (Tử Vi "hóa giải nhiều tai ương")*
- **[TAT-TV-02]** Tử Vi gặp Kình Dương, Linh Tinh: nên chú ý những vấn đề âm thầm, khó tự nhận biết (khám định kỳ); gặp Không Kiếp: chú ý tim mạch và căng thẳng tinh thần; Tử Phá: chú ý khí huyết, tuần hoàn. — *Nguồn: TT (q.2 «六疾厄»: "如加破军血气不和，同羊铃主有暗疾，加空劫主疢疾心气疾"); WT8 (Tử Vi với Không Kiếp: mắt, dạ dày; với Phá Quân, Kình Dương: thần kinh)*

#### Liêm Trinh
- **[TAT-LT-01]** Liêm Trinh vượng/miếu gặp cát tinh: thể trạng bình hòa. Xu hướng chung của sao: nên chú ý vùng lưng, tay chân, da (thời nhỏ hay mụn nhọt). — *Nguồn: TT (q.2 «六疾厄»: "廉贞襁褓灾疮腰足之疾，入庙加吉和平"); TB (tr. 182, mục 11.2.1: "tỳ vết ở chân tay hay ở lưng")*
- **[TAT-LT-02]** Liêm Trinh hãm, đồng cung Tham Lang (Tỵ, Hợi): nên chú ý mắt và nghỉ ngơi điều độ *(sách gốc có ý về tai nạn/bệnh nặng; đã lược)*. — *Nguồn: TT (q.2 «六疾厄»: "遇贪狼同，陷地眼疾灾多"); TB (tr. 182: "Tham đồng cung: mắt kém")*
- **[TAT-LT-03]** Liêm Sát, Liêm Phá, Liêm Phủ: TT cho là "ít tai ương"; TB lại ghi Liêm Sát mắt kém, Liêm Phá tay chân có vết *(phần nặng đã lược)*. Xem TAT-TRANH-02. — *Nguồn: TT (q.2 «六疾厄»: "七杀破军天府同灾少"); TB (tr. 182, 185)*

#### Thiên Đồng
- **[TAT-TD-01]** Thiên Đồng miếu/vượng: ít bệnh; xu hướng chung nên chú ý tiêu hóa, bụng. — *Nguồn: TT (q.2 «六疾厄»: "天同入庙灾少"); TB (tr. 182, mục 11.2.2: "bộ máy tiêu hóa không được lành mạnh")*
- **[TAT-TD-02]** Thiên Đồng hãm hoặc gặp Hóa Kỵ: chú ý dạ dày, ruột, gan. Đồng Cự: chú ý tim và cảm xúc ("tâm khí"); Đồng Âm gặp Kình, Hỏa: chú ý khí huyết. — *Nguồn: TB (tr. 182: "Cự đồng cung: bệnh tâm khí; Nguyệt đồng cung: bệnh huyết khí; Kỵ đồng cung: đau dạ dày hay ruột gan"); TT (q.2 «六疾厄»: "巨门同心气疾，太阴同加羊火血气疾")*

#### Vũ Khúc
- **[TAT-VK-01]** Vũ Khúc sáng; Vũ Tham ở miếu (Sửu, Mùi): thể trạng khá. Xu hướng chung: chú ý da, tay chân, thời nhỏ hay va chạm nhẹ. — *Nguồn: TT (q.2 «六疾厄»: "武曲襁褓灾迍手足头面有伤…贪狼同庙旺无疾"); TB (tr. 182, mục 11.2.3: "Bệnh ngoài da, chân tay có tỳ vết")*
- **[TAT-VK-02]** Vũ Khúc gặp Kình, Đà: hay ốm vặt; Vũ Tướng: nên chú ý vấn đề âm thầm, khám định kỳ; Vũ Sát: chú ý tiêu hóa, vùng hậu môn – trực tràng; Vũ Phá (Vũ hãm tại Tỵ, Hợi): chú ý mắt. — *Nguồn: TB (tr. 182, 184, 185: "Tướng đồng cung: có ám tật", "Sát đồng cung: bệnh ở bộ máy tiêu hóa… bệnh trĩ", Phá "Vũ đồng cung: mắt kém"); TT (q.2 «六疾厄»: "羊陀同一生常有灾，天相同招暗疾，七杀同血疾"; mục 破军 "武曲同目视疾")*
- **[TAT-VK-03]** Vũ Tham hãm gặp tứ sát: chú ý mắt, tay chân, vùng hậu môn và da. — *Nguồn: TT (q.2 «六疾厄»: "陷地加四杀，眼手足疾痔疾疯疮"); TT (q.1 «羊陀火铃四星总论»: "武曲并贪狼…疾厄若逢之，四时不离着")* ⚑1nguồn

#### Thái Dương
- **[TAT-TDU-01]** Thái Dương (kể cả khi sáng): chú ý vùng đầu, huyết áp, mạch máu (hay nhức đầu). — *Nguồn: TB (tr. 183, mục 11.2.4: "Căng mạch máu, hay nhức đầu"); TT (q.2 «六疾厄»: "太阳头风")*
- **[TAT-TDU-02]** Thái Dương hãm, hoặc gặp Riêu, Đà, Kỵ, hoặc Nhật Nguyệt gặp Hóa Kỵ, Kình Đà: chú ý mắt, nên khám mắt định kỳ *(phần nặng đã lược)*. — *Nguồn: TB (tr. 183: "Sáng sủa, Riêu, Đà, Kỵ: đau mắt"); TT (q.2 «六疾厄»: "太阴同加化忌，羊陀主眼目有伤，陷宫亦主目疾欠光明")*

#### Thiên Cơ
- **[TAT-TCO-01]** Thiên Cơ sáng: thời nhỏ hay ốm vặt; xu hướng chung chú ý da, gân cơ, khớp (tê mỏi). — *Nguồn: TT (q.2 «六疾厄»: "天机襁褓多灾"); TB (tr. 183, mục 11.2.5: "Bệnh ngoài da hay bệnh tê thấp")*
- **[TAT-TCO-02]** Thiên Cơ hãm (Hợi) hoặc gặp Kình Đà, Hỏa: chú ý vùng đầu mặt, mắt và sức mạnh tay chân. — *Nguồn: TT (q.2 «六疾厄»: "陷地头面破相…加羊火陷宫有目疾，四肢无力"); TB (tr. 183: "Kình, Đà: chân tay yếu gân")*
- **[TAT-TCO-03]** Cơ Cự: chú ý khí huyết; Cơ Lương: chú ý vùng bụng dưới, hệ bài tiết – sinh dục ("hạ bộ"); Cơ Âm: chú ý da (mụn nhọt). Hai sách khớp cả ba ý. — *Nguồn: TB (tr. 183: "Cự đồng cung: bệnh khí huyết; Lương đồng cung: bệnh ở hạ bộ; Nguyệt đồng cung: có nhiều mụn nhọt"); TT (q.2 «六疾厄»: "巨门同血气疾，天梁同下部疾，太阴同疮灾")*

#### Thiên Phủ
- **[TAT-TP-01]** Thiên Phủ là sao cứu giải: ít bệnh, có bệnh thì có cách chữa; NL nói Phủ, Tướng ở Tật Ách thì bệnh thường nhẹ, "dễ gặp thầy thuốc". — *Nguồn: TT (q.2 «六疾厄»: "天府灾少临灾有救"); TB (tr. 181, mục 11.1.1); NL (tr. 131)*
- **[TAT-TP-02]** Thiên Phủ gặp Kình, Đà, Hỏa, Linh, Không, Kiếp: sức đề kháng giảm, nên chú ý hệ thần kinh – da, dạ dày, khớp; khám định kỳ. — *Nguồn: TT (q.2 «六疾厄»: "加羊陀火铃空劫有疯疾"); WT8 (Thiên Phủ: dạ dày, tê chân tay, đau khớp)*

#### Thái Âm
- **[TAT-TA-01]** Thái Âm miếu/vượng: ít bệnh; xu hướng chung chú ý bụng, tiêu hóa. — *Nguồn: TT (q.2 «六疾厄»: "太阴庙旺无灾"); TB (tr. 183, mục 11.2.6: "Đau bụng")*
- **[TAT-TA-02]** Thái Âm hãm: dễ mệt vì làm quá sức, nên chú ý hô hấp (phổi); gặp Riêu, Đà, Kỵ hoặc Kình Đà Hỏa Linh: chú ý mắt. — *Nguồn: TB (tr. 183: "Mờ ám: đau phổi; Mờ ám, Riêu, Đà, Kỵ: mắt kém"); TT (q.2 «六疾厄»: "陷地灾多主劳伤之症…羊陀火铃眼目疾")*

#### Tham Lang
- **[TAT-THL-01]** Tham Lang đắc (Dần, Thân) đơn thủ: chú ý chân; Vũ Tham miếu: ít bệnh. — *Nguồn: TB (tr. 183, mục 11.2.7: "Đơn thủ tại Dần, Thân: bệnh ở chân"); TT (q.2 «六疾厄» mục 武曲: "贪狼同庙旺无疾")*
- **[TAT-THL-02]** Tham Lang hãm (Tý, Ngọ): nên giữ lối sống điều độ (ăn uống, vui chơi), chú ý gan, hệ sinh sản *(sách gốc có ý về bệnh do chơi bời, tai nạn; đã trung tính hóa và lược)*. TT không có mục Tham Lang đơn thủ ở Tật Ách. — *Nguồn: TB (tr. 183–184: "Đơn thủ tại Tý, Ngọ: chơi bời mà mắc bệnh"); WT8 (Tham Lang: gan, hệ sinh dục)*

#### Cự Môn
- **[TAT-CM-01]** Cự Môn: thời trẻ da hay mụn nhọt; chú ý vùng bụng dưới. — *Nguồn: TB (tr. 184, mục 11.2.8: "Bệnh ở hạ bộ… lúc ít tuổi có nhiều mụn nhọt"); TT (q.2 «六疾厄»: "巨门少年脓血之厄")*
- **[TAT-CM-02]** Cự Môn gặp Kình Dương, Hỏa Tinh: nên điều độ rượu bia và sinh hoạt; gặp Hóa Kỵ: chú ý tai, mắt; Cự Môn với Kình Đà ở Mệnh hoặc Tật Ách: thể trạng dễ gầy yếu, cần bồi bổ *(phần nặng đã lược)*. — *Nguồn: TB (tr. 184: "Kình, Hỏa đồng cung: bệnh do tửu sắc gây nên"); TT (q.2 «六疾厄»: "加羊火酒色之疾，加忌有耳目之忧"; q.3 «论诸星同垣…»: "巨门羊陀于身命疾厄羸黄困弱")*

#### Thiên Tướng
- **[TAT-TT-01]** Thiên Tướng sáng: ít bệnh; xu hướng chung chú ý vùng đầu, mặt, da. — *Nguồn: TT (q.2 «六疾厄»: "天相灾少"); TB (tr. 184, mục 11.2.9: "Bệnh ở đầu hay mặt")*
- **[TAT-TT-02]** Thiên Tướng hãm (Mão, Dậu): chú ý khí huyết và da (sắc mặt kém tươi); hai sách khớp gần nguyên văn. — *Nguồn: TB (tr. 184: "Đơn thủ tại Mão, Dậu: da mặt vàng, có bệnh thuộc về khí huyết hay bệnh ngoài da"); TT (q.2 «六疾厄»: "面皮黄肿血气之疾")*

#### Thiên Lương
- **[TAT-TL-01]** Thiên Lương sáng là sao cứu giải: giảm bệnh, có bệnh dễ qua; ở Tý, Sửu (đắc) đơn thủ chỉ hay cảm nóng lạnh nhẹ, không đáng lo. — *Nguồn: TB (tr. 181, mục 11.1.1; tr. 184, mục 11.2.10); WT8 (Thiên Lương "giải trừ được bệnh tật")*
- **[TAT-TL-02]** Thiên Lương hãm (Hợi, Tỵ) hoặc gặp Kình Dương, Không Kiếp: bệnh dễ kéo dài, nên chữa dứt điểm; chú ý tỳ vị, tiêu hóa. Đồng Lương gặp tứ sát: chú ý tim, cảm xúc. — *Nguồn: TB (tr. 184: Hợi "mắc bệnh hàn nhiệt"); WT8 (Kình, Không làm bệnh kéo dài; tỳ vị); TT (q.2 «六疾厄» mục 天同: "天梁同加四杀心气疾")*

#### Thất Sát
- **[TAT-TS-01]** Thất Sát (kể cả miếu): thời nhỏ sức khỏe kém hơn, cần chăm sóc kỹ; lớn lên chú ý vùng hậu môn – trực tràng. — *Nguồn: TB (tr. 184, mục 11.2.11: "lúc ít tuổi sức khỏe rất kém"); TT (q.2 «六疾厄»: "七杀幼年多灾，长主痔疾")*
- **[TAT-TS-02]** Thất Sát gặp sát tinh, hoặc Vũ Sát: chú ý tiêu hóa, tay chân; gặp Đại Hao/Tiểu Hao, Mộc Dục, Hóa Kỵ: nên khám sức khỏe tổng quát định kỳ *(sách gốc có ý về bệnh nặng, phẫu thuật; đã lược)*. — *Nguồn: TB (tr. 184); TT (q.2 «六疾厄»: "武曲同加四杀手足伤残" — đã trung tính hóa)*

#### Phá Quân
- **[TAT-PQ-01]** Phá Quân (kể cả miếu Tý, Ngọ): cơ địa "nóng", thời nhỏ da hay mụn nhọt, mẩn ngứa; Tử Phá: ít bệnh. — *Nguồn: TB (tr. 184, mục 11.2.12: "Máu nóng, nên lúc ít tuổi có nhiều mụn nhọt, chốc lở"); TT (q.2 «六疾厄»: "破军幼年疮癞浓血羸黄…紫微同灾少")*
- **[TAT-PQ-02]** Phá Quân hãm hoặc gặp Kình, Đà, Hình, Kỵ: dễ căng thẳng, nóng nảy, nên chăm sức khỏe tinh thần; Vũ Phá: chú ý mắt *(sách gốc có ý về tai nạn, tù tội, bệnh tâm thần; đã lược)*. — *Nguồn: TB (tr. 185: "Vũ đồng cung: mắt kém"; "Kình, Đà, Hình, Kỵ… có tật ở mắt"); TT (q.2 «六疾厄»: "武曲同目视疾")*

### 6.3. Bộ sao phụ quan trọng (SP)

- **[TAT-SP-01]** Hóa Khoa, Thiên Giải, Địa Giải, Giải Thần: sao cứu giải; có bệnh dễ gặp thầy gặp thuốc. — *Nguồn: TB (tr. 181, mục 11.1.2, 11.1.3); KL (Chương Ba, Coi các cung — cung Tật: "cứu tinh như Thiên giải, Quan Phúc, Giải thần… thì đỡ lo tai nạn"; mục Hóa Khoa: "Hóa khoa cứu giải bệnh tật") (bản quét, đã đọc)*
- **[TAT-SP-02]** Tả Phù, Hữu Bật: đơn thủ thì bình hòa, lúc cần có người giúp; gặp nhiều sát tinh thì kém đi. — *Nguồn: TB (tr. 182, mục 11.1.9); TT (q.2 «六疾厄»: "左辅独守平和，加吉星灾少…右弼独守逢灾有救，见羊陀火铃空劫灾多")*
- **[TAT-SP-03]** Văn Xương, Văn Khúc đơn thủ: ít bệnh; gặp sát tinh thì kém. — *Nguồn: TT (q.2 «六疾厄»: "文昌独守灾少…文曲灾少加吉星一世无灾")* ⚑1nguồn
- **[TAT-SP-04]** Lộc Tồn: sao cứu giải, nhưng gặp nhiều sát tinh thì mất tác dụng; TT nói thời nhỏ hay ốm, gặp cát tinh thì ít bệnh. — *Nguồn: TB (tr. 181, mục 11.1.4); TT (q.2 «六疾厄»: "禄存少年多灾，加吉星灾少")*
- **[TAT-SP-05]** Tuần, Triệt án ngữ Tật Ách: nhìn chung giảm bớt bệnh tật. — *Nguồn: TB (tr. 182, mục 11.1.10: "Suốt đời mạnh khỏe"); NL (tr. 131: Ách có Tuần hay Triệt thì giảm cường độ tật ách)*
- **[TAT-SP-06]** Kình Dương: chú ý tai, vùng hậu môn, đau đầu, tay chân thiếu lực; Đà La: thời nhỏ hay đau răng, chú ý răng miệng, vùng đầu mặt. — *Nguồn: TB (tr. 185, mục 11.2.13, 11.2.14: Kình "bệnh ở tai… trĩ", Đà "lúc ít tuổi hay đau răng"); TT (q.2 «六疾厄»: "陀罗幼年灾，磨唇齿头面…擎羊有头疯之症，或四肢欠力")*
- **[TAT-SP-07]** Kình Đà cùng thủ Tật Ách: chú ý mắt. — *Nguồn: TT (q.1 «斗数发微论»: "羊陀守疾厄，眼目昏盲" — đã trung tính hóa); TB (tr. 185–186, Đà La gặp Riêu Kỵ "đáng lo ngại nhất là bệnh đau mắt")*
- **[TAT-SP-08]** Hỏa Tinh, Linh Tinh: sáng thì thân thể tráng kiện; hãm thì hay sốt, nóng lạnh. — *Nguồn: TB (tr. 185, mục 11.2.15); KL (Chương Hai, mục Hỏa Linh: đắc địa "Sức khỏe dồi dào", hãm địa nghiêng về hệ thần kinh, chi tiết khác TB) (bản quét, đã đọc); NL (Hùng khí của lục sát tinh: "Linh Hoả giảm thiểu sức khoẻ"; NL lưu ý tuổi Kim dù đắc địa vẫn nên giữ sức khỏe) (bản quét, đã đọc)*
- **[TAT-SP-09]** Địa Không, Địa Kiếp: chú ý máu và da (mụn nhọt). — *Nguồn: TB (tr. 186, mục 11.2.16: "Xấu máu nên hay có mụn nhọt, chốc lở"); KL lại gắn Không Kiếp ở Tật (mục Hỉ Thần) với vùng hậu môn, không nói máu, da (bản quét, đã đọc)* ⚑1nguồn
- **[TAT-SP-10]** Thiên Khốc, Thiên Hư: chú ý phổi (ho), thận, răng; Thiên Riêu, Mộc Dục: chú ý thận, xương khớp (tê thấp). — *Nguồn: TB (tr. 187, 188, mục 11.2.24, 11.2.25, 11.2.32, 11.2.35)* ⚑1nguồn
- **[TAT-SP-11]** Đại Hao, Tiểu Hao: chú ý tiêu hóa, bệnh do ăn uống; nên ăn uống điều độ. — *Nguồn: TB (tr. 186–187, mục 11.2.21); KL lại cho rằng Song Hao ở Tật "giải trừ hạn xấu" (Chương Ba, cung Tật) (bản quét, đã đọc)* ⚑1nguồn
- **[TAT-SP-12]** Tang Môn, Bạch Hổ: chú ý khí huyết, tim, xương; nữ giới nên theo dõi kỹ khi mang thai, sinh nở *(phần nặng đã lược)*. — *Nguồn: TB (tr. 187, mục 11.2.22, 11.2.23); KL (Phú Ma Thị: "Ách địa hiểm Thai phùng Bạch hổ", nữ giới nên đề phòng khi sinh nở *(sách gốc diễn đạt nặng, đã trung tính hóa)*) (bản quét, đã đọc)*
- **[TAT-SP-13]** Đào Hoa, Hồng Loan: chú ý tim và vùng bụng dưới. — *Nguồn: TB (tr. 187, mục 11.2.28)* ⚑1nguồn
> **Trạng thái — Hồng Loan của năm (Lưu Hồng Loan) tại Tật Ách: không có nguồn** (việc L-a21be5, Đức tra 30/10/2026). Đã đọc: TB chương 11 Tật Ách (bản quét tr. 181–189; chỉ có TAT-SP-13 cho Hồng Loan gốc và mục 11.2.31 Thai gặp "Hồng, Đào, Kình, Kỵ, Mộc", đều nêu bệnh cụ thể); TB Phần 3 §3.2.36 Hồng Loan nhập hạn (tr. 264: "Nhiều sao sáng sủa tốt đẹp: mọi sự hành thông… hỉ khí đầy nhà"; "Nhiều sao mờ ám xấu xa: đau yếu, buồn phiền…"), câu này nói cho **cung hạn** Hồng Loan đi vào, không riêng Tật Ách, đã dùng ở VAN-SP-14; KL "Cung Tật" (tr. 408) và mục Hồng loan (không nhắc Tật Ách); TT q.2 〈六疾厄〉 (không có 紅鸞). Vì vậy **không tạo quy tắc TAT cho Lưu Hồng Loan**. Hồng Loan gốc ở Tật Ách vẫn theo TAT-SP-13, nhưng câu đó nêu bộ phận cơ thể nên **không dùng trong bài vận năm** (NAM-MANG-05 và dòng trạng thái ngay dưới nó trong `docs/luan-giai/van-nam/QUY-TAC.md`).
- **[TAT-SP-14]** Đế Vượng, Tràng Sinh: ít bệnh; Tràng Sinh gặp nhiều sao xấu thì bệnh lâu khỏi; Dưỡng: bệnh hay kéo dài. Gợi ý: chữa dứt điểm, tái khám. — *Nguồn: TB (tr. 181, 189, mục 11.1.5, 11.1.6, 11.2.41); KL (Chương Hai, mục Trường Sinh: "Chỉ trừ cung Tật khi gặp sao xấu thì bệnh lâu khỏi"; mục Đế Vượng: "giải trừ bệnh tật") (bản quét, đã đọc)*

### 6.4. Cách cục chính (CC)

- **[TAT-CC-01]** Phủ, Tướng ở Tật Ách (khi Phụ Mẫu có Tử Vi đi cùng Sát, Phá, Tham): bệnh thường nhẹ, thuộc "nội thương", dễ gặp thầy thuốc. — *Nguồn: NL (tr. 130–131); TT (q.2 «六疾厄»: "天府灾少临灾有救", "天相灾少")*
- **[TAT-CC-02]** Tật Ách vô chính diệu, hoặc có Tuần/Triệt: NL coi là thế "lấy đức chinh phục tai ách", giảm cường độ. — *Nguồn: NL (tr. 131); KL (Chương Hai, mục Tuần Triệt: "Tuần Triệt đóng ở Tật ngăn trở được bệnh tật"; cung vô chính diệu có Tuần Triệt "thì lại tốt") (bản quét, đã đọc)*
- **[TAT-CC-03]** Nhật, Nguyệt ở Tật Ách (hoặc Mệnh) gặp Không vong: chú ý mắt và lưng, cột sống *(sách gốc diễn đạt nặng, đã trung tính hóa)*. — *Nguồn: TT (q.3 «论诸星同垣…»: "日月疾厄命宫空腰陀目瞽"); TB (tr. 183, Thái Dương "Tuần, Triệt án ngữ: đau mắt")*
- **[TAT-CC-04]** Hóa Kỵ và Cự Môn (ám tinh) cùng ở Mệnh, Thân hoặc Tật Ách: thể trạng dễ suy nhược, cần bồi bổ và nghỉ ngơi. — *Nguồn: TT (q.1 «太微赋»: "忌暗同居身命疾厄，沉困尪羸"; q.1 «重补斗数彀率»: "巨暗同垣於身命疾厄羸瘦其軀"); KL lại gắn Cự Môn cùng Hóa Kỵ ở Tật với rủi ro sông nước, không nói suy nhược (Chương Hai, mục Cự Môn) (bản quét, đã đọc)* ⚑1nguồn
- **[TAT-CC-05]** Phúc Đức xấu, Tật Ách nhiều sao tác họa, Mệnh gặp nhiều sát tinh, bại tinh: thể chất cần được chăm sóc đặc biệt *(sách gốc: "chắc chắn là có tàn tật", đã trung tính hóa)*; ngược lại Phúc Đức tốt thì giảm nhiều. — *Nguồn: TB (tr. 234, mục 20.6); TB (tr. 181); KL (Chương Ba, Thế đứng các sao: "Mệnh Phúc tốt mà Di, Tật, Vận ngộ hung sát cũng đỡ xấu") (bản quét, đã đọc)*

### 6.5. Tứ hóa tại cung (HOA)

- **[TAT-HOA-01]** Hóa Lộc tại Tật Ách: có tác dụng cứu giải như Hóa Khoa, nhưng gặp nhiều sát tinh thì mất tác dụng. — *Nguồn: TB (tr. 181, mục 11.1.4); KL (Chương Ba, cung Tật: "Cung Tật cần có… Khoa Quyền Lộc"; mục Hóa Lộc: "thịnh đạt nếu không gặp sao xấu") (bản quét, đã đọc)*
- **[TAT-HOA-02]** Hóa Quyền: cùng nhiều sao cứu giải thì hồi phục nhanh; cùng nhiều sao tác họa thì bệnh nặng hơn *(đã trung tính hóa)* — nên khám sớm khi có dấu hiệu. — *Nguồn: TB (tr. 182, mục 11.1.8)* ⚑1nguồn
- **[TAT-HOA-03]** Hóa Khoa: cứu giải khá mạnh, "đau yếu gặp thầy gặp thuốc". — *Nguồn: TB (tr. 181, mục 11.1.2); KL (Chương Hai, mục Hóa Khoa: "Hóa khoa cứu giải bệnh tật, chế ngự được các sát tinh") (bản quét, đã đọc)*
- **[TAT-HOA-04]** Hóa Kỵ: thể trạng dễ suy nhược, hay đau bụng vặt; nữ nên theo dõi kỹ sức khỏe sinh sản *(phần nặng đã lược)*. — *Nguồn: TB (tr. 186, mục 11.2.18); TT (q.1 «斗数准绳»: "疾厄逢忌定有尪羸")*

### 6.6. Điểm còn tranh luận (TRANH)

- **[TAT-TRANH-01]** Mức chi tiết: TB gán bệnh, tai nạn rất cụ thể cho từng tổ hợp; nguồn hiện đại WT9 chỉ coi Tật Ách là "gợi ý, không chẩn đoán". Nhóm theo WT9: chỉ dùng vùng/chức năng nên chú ý. — *Nguồn: TB (tr. 181–189); WT9*
- **[TAT-TRANH-02]** Liêm Trinh đồng cung Thất Sát/Phá Quân: TT nói "ít tai ương" (七杀破军天府同灾少), TB lại xếp vào nhóm tác họa nặng. Ngược nhau; khi luận dùng mức trung tính ("nên chú ý mắt, tay chân"). — *Nguồn: TT (q.2 «六疾厄»); TB (tr. 182, 185)*
- **[TAT-TRANH-03]** Tuần, Triệt: TB mục 11.1.10 nói Tuần Triệt án ngữ thì "suốt đời mạnh khỏe", nhưng cùng chương lại ghi Tuần Triệt đi với Thái Dương, Thiên Cơ, Thiên Tướng, Thiên Mã là xấu. Tự mâu thuẫn; NL ủng hộ ý "giảm". Khi luận: coi Tuần Triệt là làm dịu, không khẳng định. — *Nguồn: TB (tr. 182–184, 186); NL (tr. 131)*
- **[TAT-TRANH-04]** Mục 11.2.42 "Thiên Khôi" trong TB lặp nguyên văn mục Thiên Tướng (11.2.9); có thể là lỗi in hoặc lỗi số hóa. **Không dùng.** — *Nguồn: TB (tr. 184, 189)*
- **[TAT-TRANH-05]** TB có các câu "bệnh ma làm", "đau yếu vì ma quỷ phá phách" (Thiên Cơ gặp Hỏa Linh; Thiên Riêu gặp Hỏa Linh). Đây là nội dung mê tín, **loại khỏi luận giải**. — *Nguồn: TB (tr. 183, 188)*
- **[TAT-TRANH-06]** Thiên Lương, Tham Lang đơn thủ ở Tật Ách: TT không có mục riêng, chỉ có tổ hợp; quy tắc TAT-TL và TAT-THL dựa TB và WT8 (trang hiện đại không ghi sách). Cần NL hoặc CN để kiểm chứng thêm. — *Nguồn: TT (q.2 «六疾厄»); TB (tr. 183–184); WT8*

---

## 7. Cung Thiên Di

### 7.1. Ý nghĩa cung (YN)
- **[DI-YN-01]** Thiên Di cho biết việc giao thiệp bên ngoài, những thuận lợi và trở ngại khi rời nhà. Đây là cung xung chiếu cung Mệnh nên phải xét rất kỹ — *Nguồn: TB (tr. 174, §10); TT (卷一·問紫微: 「遷移雖是強宮，更要相佐，有吉星照命，則因人之貴」)*
- **[DI-YN-02]** Thiên Di không chỉ là chuyện đi xa. Cung này còn là "thế đối diện" với Mệnh: môi trường xã hội, đối thủ, áp lực bên ngoài. Có Di thì có động lực phấn đấu, không có Di thì đời tẻ lạnh — *Nguồn: NL (tr. 132 "Giàu nhờ bạn, sang vì vợ"; tr. 190 "Di – một lực lượng phải để ý"); KL (8. Cung Di: "môi trường hay dở, sang hèn cũng xem ở Thiên di") (bản quét, đã đọc)*
- **[DI-YN-03]** Thiên Di là cung mạnh (cường cung) nhưng cần có sao phù tá. Cát tinh từ Di chiếu về Mệnh thì đương số được quý nhân nâng đỡ — *Nguồn: TT (卷一·問紫微); TB (tr. 174, §10: "cần phải nhận xét rất cẩn thận ảnh hưởng của các sao tọa thủ tại cung này")*
- **[DI-YN-04]** Luận Thiên Di phải đọc cùng trục Mệnh–Di và tam hợp của Di (Phu Thê, Phúc Đức). Phái Trung Hoa gọi trục này là 命遷線 — *Nguồn: TB (tr. 174); WQ5 (trang Thiên Di)*
- **[DI-YN-05]** Gợi ý cách viết bài: Thiên Di nên đọc là "cách mình xuất hiện trước xã hội, cơ hội khi mở rộng môi trường, đi học/làm xa, hợp tác bên ngoài", không đọc thành điềm tai nạn *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: NL (tr. 132, 190); TB (tr. 174)*

### 7.2. 14 chính tinh tại cung

#### Tử Vi (miếu Dần Tỵ Ngọ Thân; vượng Thìn Tuất; đắc Sửu Mùi; bình Tý Mão Dậu Hợi)
- **[DI-TV-01]** (a) Tử Vi tại Ngọ, hoặc đồng cung Thiên Phủ: ra ngoài thường gặp quý nhân phù trợ, việc hanh thông, càng đi xa càng toại ý — *Nguồn: TB (tr. 174, §10.1); TT (卷二·七遷移: 紫微「天府同出入通達」「同左右出外貴人扶持發福」)*
- **[DI-TV-02]** (b) Tử Vi tại Tý (bình hòa): vẫn được nhiều người giúp nhưng không trọn vẹn như ở Ngọ — *Nguồn: TB (tr. 174, §10.1); KL (Tử vi ở các cung: "phúc lộc lâu dài nếu Tử vi cư Tí Ngọ")*
- **[DI-TV-03]** Tử Tướng hoặc Tử Sát: được kính nể, hay gần môi trường có địa vị, lời nói có trọng lượng, ra ngoài có tài lộc — *Nguồn: TB (tr. 174, §10.1); TT (卷二·七遷移: 「天相同在外發財」; 七殺「紫微同在外多遂志」)*
- **[DI-TV-04]** Tử Phá: ra ngoài nhiều hơn ở nhà, được người trên quý mến nhưng dễ gặp người khó chịu. Thường lập nghiệp xa quê *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 174, §10.1); TT (卷二·七遷移: 「破軍同貴人見愛，小人不足」)*
- **[DI-TV-05]** Tử Tham: ra ngoài hay gặp chuyện phiền lòng, dễ bị người khác dèm pha, quấy rầy. Nên chọn kỹ môi trường và người cộng tác — *Nguồn: TB (tr. 174, §10.1); KL (Tử vi ở các cung — Di: "gặp Phá quân Tham lang thường bị dèm pha, quấy nhiễu")*

#### Liêm Trinh (miếu Thìn Tuất; vượng Tý Dần Ngọ Thân; đắc Sửu Mùi; hãm Mão Tỵ Dậu Hợi)
- **[DI-LT-01]** (a) Liêm Trinh đơn thủ tại Dần, Thân (vượng): thường gặp quý nhân, được kính trọng, việc hanh thông. Ra ngoài nhiều, ở nhà ít — *Nguồn: TB (tr. 174, §10.2); TT (卷二·七遷移: 廉貞「出外通達近貴，在家日少」); KL (Liêm trinh — Thiên di: "rất tốt nếu … đơn thủ tại Dần, Thân")*
- **[DI-LT-02]** Liêm Phủ, Liêm Tướng: ra ngoài lợi hơn ở nhà, dễ kiếm tiền, được vị nể nhờ phong thái đĩnh đạc — *Nguồn: TB (tr. 174, §10.2); TT (卷二·七遷移: 「天相同動中則吉」; 天府「廉貞武曲鬧中取財」)*
- **[DI-LT-03]** (b) Liêm Tham (đồng cung ở Tỵ Hợi, vị trí hãm): ra ngoài bất lợi, dễ vướng thị phi, kiện tụng; ít gặp người giúp. Nên giữ minh bạch giấy tờ, hợp đồng *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 174, §10.2); TT (卷二·七遷移: 貪狼「廉貞同加四殺，在外艱難」); KL (Liêm trinh — Thiên di)*
- **[DI-LT-04]** Liêm Sát, Liêm Phá: TB cho là đi xa không được lợi, nên thận trọng khi đi lại và ở môi trường nguy hiểm. TT lại cho Liêm Sát "ra ngoài chiêu được tài" (在外廣招財). Hai sách khác nhau, xem DI-TRANH-03 — *Nguồn: TB (tr. 174, §10.2); TT (卷二·七遷移); KL (Liêm trinh — Thiên di)*

#### Thiên Đồng (miếu Dần Thân; vượng Tý; đắc Mão Tỵ Hợi; hãm Sửu Thìn Ngọ Mùi Dậu Tuất)
- **[DI-TD-01]** (a) Thiên Đồng tại Mão (đắc): càng xa nhà càng hanh thông, không nên ở lâu một chỗ, hay gặp quý nhân — *Nguồn: TB (tr. 174, §10.3); TT (卷二·七遷移: 天同「出外遇貴人扶持」)*
- **[DI-TD-02]** Đồng Lương (Dần Thân, miếu), Đồng Âm tại Tý: luôn có quý nhân phù trợ, được kính trọng, buôn bán thuận — *Nguồn: TB (tr. 175, §10.3); TT (卷二·七遷移: 「天梁同貴人見愛」; 太陰「天同同在廟旺地出外白手生財成家」)*
- **[DI-TD-03]** (b) Thiên Đồng tại Dậu, Thìn, Tuất (hãm): hay phải xa nhà, dễ gặp chuyện phiền lòng, thị phi. Nên chọn việc ổn định, tránh tranh chấp — *Nguồn: TB (tr. 174–175, §10.3); TT (卷二·七遷移: 「加羊陀火鈴空劫在外少遂志」)*
- **[DI-TD-04]** Đồng Âm tại Ngọ (hãm): dễ gặp cạnh tranh, ghen ghét khi ra ngoài. Đồng Cự: hay vướng thị phi, nói dễ quá lời — *Nguồn: TB (tr. 175, §10.3); TT (卷二·七遷移: 「巨門同勞心，太陰同辛苦」)*

#### Vũ Khúc (miếu Sửu Thìn Mùi Tuất; vượng Tý Dần Ngọ Thân; đắc Mão Dậu; hãm Tỵ Hợi)
- **[DI-VK-01]** (a) Vũ Khúc đơn thủ tại Thìn, Tuất (miếu): buôn bán phát tài, đi xa lợi hơn ở nhà — *Nguồn: TB (tr. 175, §10.4); TT (卷一·太微賦: 「財蔭坐於遷移，巨商高賈」); KL (phần phú: "Vũ khúc Thiên di, cự thương cao mại")*
- **[DI-VK-02]** Vũ Phủ, Vũ Tướng: gặp quý nhân, được kính nể, tài lộc vượng. Vũ Tham: buôn lớn, trước khó sau dễ, cạnh tranh gắt — *Nguồn: TB (tr. 175, §10.4); TT (卷二·七遷移: 武曲「貪狼同作巨商」; 天相「武曲同在外發財」)*
- **[DI-VK-03]** (b) Vũ Phá (Tỵ Hợi, vị trí hãm của Vũ), Vũ Sát: kiếm được tiền nhưng ra ngoài hay phiền lòng, thân tâm khó yên. Nên cẩn trọng khi đi lại và khi làm việc rủi ro cao *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 175, §10.4); TT (卷二·七遷移: 武曲「七殺破軍同身心不得靜守」)*

#### Thái Dương (miếu Tỵ Ngọ; vượng Dần Mão Thìn; đắc Sửu Mùi; hãm Tý Thân Dậu Tuất Hợi)
- **[DI-TDU-01]** (a) Thái Dương tại Dần, Mão, Thìn, Tỵ, Ngọ: gặp quý nhân, ra ngoài được kính trọng, tài lộc dồi dào. Hợp làm việc ở bên ngoài, khó chịu cảnh ngồi yên một chỗ — *Nguồn: TB (tr. 175, §10.5); TT (卷二·七遷移: 太陽「宜出外發福不耐靜守」)*
- **[DI-TDU-02]** (b) Thái Dương tại Thân, Dậu, Tuất, Hợi (hãm): ra ngoài dễ bị hiểu lầm, khó được lòng người. Nên cẩn trọng khi đi lại đường thủy *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 175, §10.5); TT (卷二·七遷移: 「加羊陀火鈴空劫在外心身不清閒」)*
- **[DI-TDU-03]** Nhật Nguyệt đồng cung (Sửu Mùi): ra ngoài lợi hơn ở nhà, gần môi trường có địa vị. Gặp Tuần/Triệt hoặc Hóa Kỵ lại càng tốt (cách đặc biệt của Nhật Nguyệt Sửu Mùi) — *Nguồn: TB (tr. 175, §10.5); TT (卷二·七遷移: 太陽「太陰同出外忙中吉」); KL (Thái dương ở các cung — Di: "Nhật Nguyệt, Tam hóa: phú quí, quyền uy")*
- **[DI-TDU-04]** Thái Dương xa nhà lập nghiệp: TT cho rằng người có Thái Dương ở Thiên Di khó giữ tổ nghiệp, rời gốc lập nghiệp nơi khác ("移根換葉，出祖為家") — *Nguồn: TT (卷一·問太陽); TB (tr. 175, §10.5)*

#### Thiên Cơ (miếu Mão Thìn Dậu Tuất; vượng Tỵ Thân; đắc Tý Sửu Ngọ Mùi; hãm Dần Hợi)
- **[DI-TCO-01]** (a) Thiên Cơ tại Tỵ, Ngọ, Mùi: ra ngoài hanh thông, gặp quý nhân. Ở nhà lại dễ có thị phi — *Nguồn: TB (tr. 175, §10.6); TT (卷二·七遷移: 天機「出外遇貴居家有是非」)*
- **[DI-TCO-02]** (b) Thiên Cơ tại Hợi, Tý, Sửu: xa nhà không được yên. TB xếp chung Tý, Sửu (đắc) với Hợi (hãm), xem DI-TRANH-02 — *Nguồn: TB (tr. 175, §10.6); TT (卷二·七遷移: 「加羊陀火鈴在外多是非身不安靜」)*
- **[DI-TCO-03]** Cơ Lương (Thìn Tuất): càng xa nhà càng may, được tôn trọng. Cơ Cự: có tài lộc, có quý nhân nhưng dễ khẩu thiệt. Cơ Âm tại Thân: buôn bán thuận, được mến; tại Dần: không nên xa nhà lâu, dễ bị đố kỵ — *Nguồn: TB (tr. 175–176, §10.6); TT (卷二·七遷移: 「巨門同動中則吉，天梁同出外稱意，太陰同忙中吉」); KL (Thiên cơ — Di: "Cơ Lương hay Cơ Nguyệt đồng cung ở Thân thì may mắn, có quí nhân giúp")*

#### Thiên Phủ (miếu Tý Dần Ngọ Thân; vượng Thìn Tuất; đắc Tỵ Mùi Hợi; bình Sửu Mão Dậu)
- **[DI-TP-01]** (a) Thiên Phủ tại Tỵ, Hợi: gặp quý nhân, có tài lộc. Tại Sửu, Mùi, Mão, Dậu: xa nhà lợi và yên thân hơn ở nhà, buôn bán thuận — *Nguồn: TB (tr. 176, §10.7); TT (卷二·七遷移: 天府「出外遇貴人扶」)*
- **[DI-TP-02]** Tử Phủ, Liêm Phủ, Vũ Phủ: ra ngoài có quý nhân, tài lộc dễ kiếm. Liêm Phủ, Vũ Phủ hợp kiếm tiền ở môi trường sôi động, kinh doanh lớn — *Nguồn: TB (tr. 176, §10.7); TT (卷二·七遷移: 「同紫微發福，廉貞武曲鬧中取財作巨商」)*
- **[DI-TP-03]** (b) Thiên Phủ không có vị trí hãm theo bảng. Gặp Tuần hoặc Không Kiếp thì giảm tốt rõ rệt ("kho bị mở", tài lộc ngoài xã hội khó giữ) — *Nguồn: KL (Thiên phủ: "Thiên phủ rất sợ Tuần"; "gặp Không Kiếp, Tuần Triệt … tài lộc bị giảm đáng kể"); TT (卷二·七遷移: 紫微「加羊陀火鈴空劫在外不安靜」)* ⚑1nguồn

#### Thái Âm (miếu Dậu Tuất Hợi; vượng Tý Thân; đắc Sửu Mùi; hãm Dần Mão Thìn Tỵ Ngọ)
- **[DI-TA-01]** (a) Thái Âm tại Dậu, Tuất, Hợi (miếu): được kính trọng, dễ kiếm tiền khi ra ngoài — *Nguồn: TB (tr. 176, §10.8); TT (卷二·七遷移: 太陰「入廟出外遇貴發財」)*
- **[DI-TA-02]** (b) Thái Âm tại Mão, Thìn, Tỵ (hãm): ra ngoài dễ gặp chuyện phiền lòng, khó được lòng người. Nên giữ ôn hòa, tránh va chạm — *Nguồn: TB (tr. 176, §10.8); TT (卷二·七遷移: 「陷宮招是非」)*
- **[DI-TA-03]** Âm Dương đồng cung: rất tốt khi ra ngoài. Đồng Âm tại Tý: quý nhân phù trợ; tại Ngọ: dễ bị cạnh tranh ghen ghét — *Nguồn: TB (tr. 176, §10.8); TT (卷二·七遷移: 「太陽同極美」「天同同在廟旺地出外白手生財成家」)*

#### Tham Lang (miếu Sửu Mùi; vượng Thìn Tuất; đắc Dần Thân; hãm Tý Mão Tỵ Ngọ Dậu Hợi)
- **[DI-THL-01]** (a) Tham Lang đơn thủ tại Thìn, Tuất (vượng): dễ kiếm tiền, hay gặp quý nhân — *Nguồn: TB (tr. 176, §10.9); KL (Tham lang — Di: "Ở Thìn Tuất có quí nhân giúp đỡ")*
- **[DI-THL-02]** Vũ Tham (Sửu Mùi, miếu): buôn bán lớn, trước khó sau dễ, cạnh tranh gắt — *Nguồn: TB (tr. 176, §10.9); TT (卷二·七遷移: 貪狼「武曲同作巨商」); KL (Tham lang — Di: "Cùng với Vũ khúc thì buôn bán phát tài")*
- **[DI-THL-03]** (b) Tham Lang tại Tý, Ngọ (hãm) hoặc Dần, Thân: ra ngoài nhiều vất vả, hay phiền lòng. Nên cẩn trọng khi di chuyển, chọn môi trường lành mạnh *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 176, §10.9); TT (卷二·七遷移: 貪狼「獨守在外勞碌，鬧中橫進財」); KL (Tham lang — Di: "Kỳ dư với các sao khác đều bất lợi")*
- **[DI-THL-04]** Tử Tham, Liêm Tham: may ít rủi nhiều, dễ có người dèm pha, quấy rầy hoặc vướng rắc rối pháp lý. Nên minh bạch, hạn chế giao du phức tạp — *Nguồn: TB (tr. 176, §10.9); TT (卷二·七遷移: 「廉貞同加四殺，在外艱難」)*

#### Cự Môn (miếu Mão Dậu; vượng Tý Dần Ngọ; đắc Thân Hợi; hãm Sửu Thìn Tỵ Mùi Tuất)
- **[DI-CM-01]** (a) Cự Môn tại Tý, Ngọ, Hợi: ra ngoài được vị nể, lời nói được tin, tài lộc dễ kiếm — *Nguồn: TB (tr. 177, §10.10); TT (卷一·問巨門 nói chung Cự ở Di "招是非" nên TT không ủng hộ trường hợp tốt này, xem DI-TRANH-04); KL lại cho rằng Cự Môn ở Di "bị khẩu thiệt", không tách riêng Tý Ngọ Hợi (Cự môn ở các cung — Di) (bản quét, đã đọc)* ⚑1nguồn
- **[DI-CM-02]** (b) Cự Môn tại Thìn, Tuất, Tỵ (hãm): hay vướng thị phi, kiện tụng; nên cẩn trọng lời nói và khi đi lại *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 177, §10.10); TT (卷一·問巨門: 「在遷移則招是非」; 卷二·七遷移: 巨門「出外勞心不安，與人不足多是非」); KL (Cự môn — Di: "bị khẩu thiệt")*
- **[DI-CM-03]** Cự Môn ở Thiên Di nói chung: môi trường bên ngoài nhiều tranh luận, cạnh tranh bằng lời. Nên chọn vai trò dùng lời nói một cách có kiểm soát (đàm phán, tư vấn) *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TT (卷一·問巨門); TB (tr. 177)*

#### Thiên Tướng (miếu Dần Thân; vượng Tý Thìn Ngọ Tuất; đắc Sửu Tỵ Mùi Hợi; hãm Mão Dậu)
- **[DI-TT-01]** (a) Thiên Tướng tại Tỵ, Hợi, Sửu, Mùi: được kính trọng, tài lộc dễ kiếm, có người trên nâng đỡ — *Nguồn: TB (tr. 177, §10.11); TT (卷二·七遷移: 天相「出外貴人提撕」)*
- **[DI-TT-02]** (b) Thiên Tướng tại Mão, Dậu (hãm): xa nhà không được lợi nhiều nhưng vẫn được mến — *Nguồn: TB (tr. 177, §10.11); TT (卷二·七遷移: 「廉貞同加羊陀火鈴招是非小人不足」)* ⚑1nguồn
- **[DI-TT-03]** Tử Tướng, Liêm Tướng, Vũ Tướng: được vị nể, gần môi trường sang trọng. Vũ Tướng ra ngoài phát tài — *Nguồn: TB (tr. 177, §10.11); TT (卷二·七遷移: 「紫微同吉利，武曲同在外發財」)*

#### Thiên Lương (miếu Thìn Ngọ Tuất; vượng Dần Mão Thân; đắc Tý Sửu Mùi; hãm Tỵ Dậu Hợi)
- **[DI-TL-01]** (a) Thiên Lương tại Tý, Ngọ: được kính trọng, yêu mến, gần môi trường có địa vị. Tại Sửu, Mùi: gặp quý nhân — *Nguồn: TB (tr. 177, §10.12); TT (卷二·七遷移: 天梁「出外近貴貴人成就」); KL (Thiên lương — Di: "Lương ở Tí Ngọ: được người kính nể, giúp đỡ")*
- **[DI-TL-02]** Lương Đồng, Lương Cơ, Lương Nhật tại Mão: được kính nể, càng xa nhà càng may. Cơ Lương hợp đi xa bằng nghề, bằng kỹ năng chuyên môn — *Nguồn: TB (tr. 177, §10.12); TT (卷二·七遷移: 「天同同福厚，天機同藝術途中走」); KL (Thiên lương — Di)*
- **[DI-TL-03]** (b) Thiên Lương tại Tỵ, Hợi (hãm): hay di chuyển, ít ở một chỗ, có xu hướng lập nghiệp xa quê *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 177, §10.12); KL (Thiên lương — Di: "Lương Tỵ Hợi: lang thang …")*

#### Thất Sát (miếu Tý Dần Ngọ Thân; vượng Tỵ; đắc Sửu Mùi; hãm Mão Thìn Dậu Tuất Hợi)
- **[DI-TS-01]** (a) Thất Sát tại Dần, Thân: có uy, được kính nể, lời nói được tin, hay lui tới nơi có quyền lực. Ra ngoài nhiều hơn ở nhà — *Nguồn: TB (tr. 177, §10.13); TT (卷二·七遷移: 七殺「在外日多，在家日少」); KL (Thất sát — Di: "vị trí Dần Thân … tốt vì có quí nhân giúp đỡ")*
- **[DI-TS-02]** Thất Sát tại Tý, Ngọ: được nể và tin nhưng may rủi đi liền nhau. Nên tính kỹ rủi ro khi đi xa, đi lại — *Nguồn: TB (tr. 177, §10.13); TT (卷二·七遷移: 「加羊陀火鈴空劫又操心不寧或流蕩天涯」)*
- **[DI-TS-03]** (b) Thất Sát tại Thìn, Tuất (hãm): ra ngoài bất lợi, thường lập nghiệp xa quê *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 177, §10.13); KL (Thất sát — Di: "các cung khác đều xấu vì ra ngoài hay gặp tai nạn")*
- **[DI-TS-04]** Tử Sát: được kính nể, có tài lộc khi ra ngoài. Vũ Sát, Liêm Sát: có uy nhưng nên đặc biệt cẩn trọng an toàn khi đi lại, tránh môi trường nhiều hung khí *(sách gốc diễn đạt nặng, đã trung tính hóa)*. TT lại cho rằng Vũ Sát "động thì cát", Liêm Sát "ở ngoài sinh tài" — *Nguồn: TB (tr. 178, §10.13); TT (卷二·七遷移)*

#### Phá Quân (miếu Tý Ngọ; vượng Sửu Thìn Mùi Tuất; hãm Dần Mão Tỵ Thân Dậu Hợi)
- **[DI-PQ-01]** (a) Phá Quân tại Tý, Ngọ (miếu): được nể, tài lộc dễ kiếm, nhưng đôi khi gặp rủi ro. TT: nhập miếu thì ra ngoài nổi trội (在外崢嶸) — *Nguồn: TB (tr. 178, §10.14); TT (卷二·七遷移: 破軍「入廟在外崢嶸」); KL (Phá quân — Di)*
- **[DI-PQ-02]** (b) Phá Quân tại Dần, Thân (hãm): ra ngoài vất vả, nên đặc biệt cẩn trọng khi tham gia giao thông. Càng xoay xở tiền bạc liều lĩnh càng dễ gặp rắc rối *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 178, §10.14); TT (卷一·問破軍: 「在遷移奔走無力」); KL (Phá quân — Di: "Ở Dần Thân: tai nạn xe cộ")*
- **[DI-PQ-03]** Phá Quân tại Thìn, Tuất: may đi liền với rủi, người kính trọng có mà người ganh ghét cũng nhiều. Thích đi đây đi đó — *Nguồn: TB (tr. 178, §10.14); TT (卷二·七遷移: 破軍「出外勞心不寧」)*
- **[DI-PQ-04]** Phá Quân gặp Xương Khúc, Vũ Khúc ở Thiên Di: hợp nghề biểu diễn, nghệ thuật lưu diễn. Gặp sát tinh: bôn ba kiếm sống bằng tay nghề — *Nguồn: TT (卷二·七遷移: 「加羊陀火鈴，奔馳巧藝走途中，加文昌文曲武曲相會優伶之人」); KL (phú: "Vũ Phá tương ngộ Xương, Khúc, thông minh xảo nghệ") chỉ cùng ý phần tay nghề, ghi cho Mệnh và đọc là kỹ nghệ máy móc, không nói nghề biểu diễn (bản quét, đã đọc)* ⚑1nguồn

### 7.3. Bộ sao phụ quan trọng (SP)
- **[DI-SP-01]** Xương, Khúc, Khôi, Việt: gặp nhiều quý nhân, được gần người có chức vị cao — *Nguồn: TB (tr. 178, §10.18); TT (卷二·七遷移: 文昌「出外遇貴發達」, 文曲「在外近貴」)*
- **[DI-SP-02]** Tả Phù, Hữu Bật: ra ngoài được nhiều người giúp, nên năng động, không nên ngồi yên — *Nguồn: TB (tr. 178, §10.19); TT (卷二·七遷移: 左輔「動中貴人扶持發福」, 右弼「出外遇貴人扶持發達，不宜靜守」)*
- **[DI-SP-03]** Lộc Tồn (và Hóa Lộc): dễ kiếm tiền, may mắn, buôn bán thuận khi ra ngoài — *Nguồn: TB (tr. 178, §10.20); TT (卷二·七遷移: 祿存「出外衣祿遂心」)*
- **[DI-SP-04]** Thiên Mã: đi đây đi đó, được mến. Lộc Mã cùng ở Di: buôn bán lưu động rất phát tài — *Nguồn: TB (tr. 179, §10.24, §10.29); TT (卷一·問紫微: 「天相祿馬交馳…可為貴論」, câu nói chung về Lộc Mã, không riêng Thiên Di)*
- **[DI-SP-05]** Kình, Đà: ra ngoài nhiều trắc trở. Sáng sủa (đắc ở Thìn Tuất Sửu Mùi): vẫn dễ kiếm tiền, có quý nhân; mờ ám: nhiều thị phi, khó kiếm tiền — *Nguồn: TB (tr. 178, §10.14 [đánh số trùng trong sách]); TT (卷二·七遷移: 擎羊「入廟在外衣祿遂心…陷地有成下人多不足」, 陀羅「會吉星在外遇貴得財，陷地…多招是非」)*
- **[DI-SP-06]** Hỏa, Linh: ra ngoài không yên chân, đường xa cô quạnh. Gặp cát tinh thì vẫn có thể kiếm tiền ở môi trường sôi động — *Nguồn: TB (tr. 178, §10.16); TT (卷一·斗數發微論: 「火鈴到遷移，長途寂寞」; 卷二·七遷移: 火星「出外不安，加吉星鬧中進財」)*
- **[DI-SP-07]** Không, Kiếp: dễ bị lừa hoặc gặp người mưu lợi. Nên thận trọng trong giao dịch, hợp tác bên ngoài *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 178, §10.17; tr. 179, §10.32); TT (卷二·七遷移: 「加羊陀火鈴空劫在外不安靜」)*
- **[DI-SP-08]** Song Hao: hay phải xa nhà nhưng được nhiều người mến — *Nguồn: TB (tr. 179, §10.23); KL lại cho rằng Song Hao, ngoài Mệnh ở Dần Thân Mão Dậu và Tài miếu địa, thì "phá tán hoàn toàn" (37. Song Hao) (bản quét, đã đọc)* ⚑1nguồn
- **[DI-SP-09]** Thiên Hình: nên đặc biệt cẩn trọng an toàn giao thông và khi dùng dụng cụ sắc nhọn *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 179, §10.25)* ⚑1nguồn
- **[DI-SP-10]** Đào, Hồng, Hỷ: dễ gặp duyên khi đi xa (quen người bạn đời ở nơi khác), ra ngoài được nhiều người có cảm tình — *Nguồn: TB (tr. 179, §10.26); KL (Đào Hồng ở các cung — Di: "Đắt đào đắt kép") (bản quét, đã đọc)*
- **[DI-SP-11]** Thái Tuế, Đà La, Hóa Kỵ cùng ở Di: dễ vướng tranh cãi, kiện cáo. Nên lưu giữ giấy tờ rõ ràng — *Nguồn: TB (tr. 179, §10.30); KL (Thái tuế ở các cung — Di: "Miệng tiếng, cãi vã"; phần Đại tiểu vận: "Vận Thái tuế mà gặp Đà Ky thì mắc thị phi kiện tụng") (bản quét, đã đọc)*

### 7.4. Cách cục chính (CC)
- **[DI-CC-01]** Vô chính diệu: lấy chính tinh xung chiếu (tức chính tinh cung Mệnh) mà luận như chính tinh tọa thủ — *Nguồn: TB (tr. 180, §10.36); TB (tr. 171, quy tắc vô chính diệu ở Nô, cùng nguyên tắc); KL lại phản đối cách này: "Chẳng lẽ lấy chính tinh của Mệnh… làm sao của cung Di", coi Di vô chính diệu là "môi trường thả nổi" (8. Cung Di) (bản quét, đã đọc)* ⚑1nguồn
- **[DI-CC-02]** "Tài Ấm tọa Thiên Di" (Vũ Khúc với Thiên Lương chiếu hoặc ở Thiên Di): hợp buôn bán lớn, kinh doanh bên ngoài — *Nguồn: TT (卷一·太微賦: 「財蔭坐於遷移，巨商高賈」; 卷一·重補斗數彀率: 「財蔭居遷移為高商豪客」); KL (phần phú: "Vũ khúc Thiên di, cự thương cao mại")*
- **[DI-CC-03]** Lộc Tồn ở Mệnh, Thân hoặc Thiên Di tại Tý, Ngọ: tài lộc dồi dào — *Nguồn: KL (phú: "Lộc tồn Tí Ngọ vị, mệnh thân Thiên di phùng chi, lợi lộc nghi"); TB (tr. 178, §10.20)*
- **[DI-CC-04]** Lộc Mã giao trì ở Thiên Di: buôn bán lưu động, xuất ngoại làm ăn có lợi — *Nguồn: TB (tr. 179, §10.29); TT (卷一·問紫微: 「祿馬交馳」 là quý cách, nói chung, không riêng Thiên Di)*
- **[DI-CC-05]** Tuần/Triệt án ngữ Thiên Di: ra ngoài dễ có chuyện phiền lòng. Gặp Tham, Phá hoặc Thiên Mã cùng Tuần/Triệt thì nên đặc biệt cẩn trọng khi đi lại *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 179, §10.27)* ⚑1nguồn
- **[DI-CC-06]** Mệnh–Di cùng một "phe" chính tinh: phe Tử Phủ Vũ Tướng Sát Phá Liêm Tham hoặc phe Cơ Nguyệt Đồng Lương Cự Nhật. Thế mạnh yếu giữa Mệnh và Di xét theo ngũ hành của sao và của cung (vd Vũ Khúc Kim ở Mệnh khắc Tham Lang Mộc ở Di thì Mệnh thắng thế) — *Nguồn: NL (tr. 190–191); KL (phần Đại tiểu vận: "Thiên di cũng có chính tinh thì phải so bì cao thấp, hơn kém") (bản quét, đã đọc); KL không nêu cách xét ngũ hành*

### 7.5. Tứ hóa tại cung (HOA)
- **[DI-HOA-01]** Hóa Lộc ở Thiên Di: dễ kiếm tiền, may mắn khi ra ngoài. Đi lại vì công việc có lợi — *Nguồn: TB (tr. 178, §10.20); WQ5 (Hua Lu in Travel palace)*
- **[DI-HOA-02]** Hóa Khoa, Hóa Quyền ở Thiên Di: được kính trọng, có danh giá bên ngoài, hay được lui tới nơi có địa vị — *Nguồn: TB (tr. 178, §10.21); WQ5 (Hua Ke/Hua Quan in Travel palace)*
- **[DI-HOA-03]** Hóa Kỵ ở Thiên Di: hay vướng thị phi, nhiều chuyện phiền lòng khi ra ngoài. Với Nhật Nguyệt đồng cung thì Kỵ lại làm tốt thêm (DI-TDU-03) — *Nguồn: TB (tr. 178–179, §10.22; tr. 175, §10.5); WQ5 (Hua Ji in Travel palace)*
- **[DI-HOA-04]** Tam hóa (Khoa Quyền Lộc) hội ở Thiên Di cùng Nhật Nguyệt sáng: có địa vị, uy tín ngoài xã hội — *Nguồn: KL (Thái dương ở các cung — Di); KL (Thái âm — Di: "Nhật Nguyệt sáng gặp Tam hóa: được nhiều người quí trọng")* ⚑1nguồn

### 7.6. Điểm còn tranh luận (TRANH)
- **[DI-TRANH-01]** Thái Dương tại Tý: bảng độ sáng ghi **hãm**. TB §10.5 lại ghi "đơn thủ tại Tý: nhiều người mến phục kính trọng", tốt hơn mức hãm. Luận theo bảng (hãm), ghi chú rằng TB có mặt tích cực — *Nguồn: TB (tr. 175); spec mục 6*
- **[DI-TRANH-02]** Thiên Cơ tại Tý, Sửu: bảng ghi **đắc**, nhưng TB §10.6 xếp chung với Hợi (hãm) là "xa nhà không được yên thân". Cần chuyên gia chốt — *Nguồn: TB (tr. 175); spec mục 6*
- **[DI-TRANH-03]** Liêm Sát, Vũ Sát ở Di: TB thiên về rủi ro khi đi lại, TT lại thiên về "ra ngoài sinh tài / động thì cát". Đề xuất: luận cả hai mặt, cơ hội lớn đi kèm rủi ro, nên làm việc có quy trình an toàn — *Nguồn: TB (tr. 174, 178); TT (卷二·七遷移)*
- **[DI-TRANH-04]** Cự Môn tại Tý, Ngọ, Hợi: TB cho là tốt (lời nói được tin). TT viết chung "Cự ở Thiên Di chiêu thị phi", không tách miếu/hãm. Đề xuất: miếu vượng thì đọc là "giỏi ăn nói nhưng môi trường nhiều tranh luận" — *Nguồn: TB (tr. 177); TT (卷一·問巨門)*
- **[DI-TRANH-05]** TB §10.12 (Thiên Lương) có dòng "tọa thủ tại Dần, Mão, Thìn, Tỵ, Ngọ…" trùng nguyên văn dòng của Thái Dương §10.5. Có lẽ là lỗi in hoặc lỗi chép, không dùng — *Nguồn: TB (tr. 177)*
- **[DI-TRANH-06]** TB nhiều chỗ nói về "kết thúc đời ở xa nhà" và "tai nạn". Đã trung tính hóa thành "xu hướng lập nghiệp xa quê" và "nên cẩn trọng an toàn". TT 卷一 (Thái Dương: 出祖為家) ủng hộ cách đọc "lập nghiệp xa quê". Không được viết lại thành dự báo tai nạn — *Nguồn: TB (tr. 174–180); TT (卷一·問太陽)*

---

## 8. Cung Nô Bộc (Giao Hữu)

### 8.1. Ý nghĩa cung (YN)
- **[NO-YN-01]** Nô Bộc cho biết về người giúp việc và bạn bè, nay hiểu là nhân viên, cấp dưới, đồng nghiệp, đối tác, mạng lưới quan hệ. Ngoài ra còn liên quan một phần đến chuyện hôn nhân — *Nguồn: TB (tr. 168, §9); NL (tr. 132: "nô cũng là bạn, có biết bao chủ nhân ông lập nên nghiệp lớn, nhờ ở Nô có hạng")*
- **[NO-YN-02]** Không nên coi Nô là "kẻ hầu hạ". Nô gồm cả người chịu sự điều hành của mình, người cùng hàng nhưng ít thâm niên, người tài đang tạm khuất. Quan, Nô, Di đều là "ngoại nhân", mỗi cung một tư thế với Mệnh — *Nguồn: NL (tr. 132); TB (tr. 168)*
- **[NO-YN-03]** Phương pháp của TB: xét **cùng lúc** độ sáng của chính tinh (hoặc sát tinh) ở cung Mệnh và ở cung Nô, kết hợp hai cung để đoán đại cương, rồi mới xét trung tinh, bàng tinh để đoán chi tiết. Chính tinh chia ba nhóm: (1) Tử, Phủ, Cự, Nhật, Cơ, Nguyệt, Đồng, Lương; (2) Sát, Phá, Liêm, Tham; (3) Vũ, Tướng — *Nguồn: TB (tr. 168–171, §9.1); NL (Giây liên lạc Bào với Nô: xét đắc/hãm của Mệnh cùng lúc với Bào, Nô; "Mệnh luôn luôn làm chủ tình thế") (bản quét, đã đọc); NL chia hai phe chính tinh, không chia ba nhóm như TB*
- **[NO-YN-04]** Nô Bộc là "cung nhược" theo thứ bậc cung. Sao tôn quý ở vị trí thấp thì chủ nhân phải vất vả. Sát tinh ứng ở cung 8 (Nô) thì người dưới khó giúp được — *Nguồn: TT (卷一·斗數發微論: 「尊星列賤位，主人多勞。惡星應八宮，奴僕無助」); TT (卷二 phần đầu: 「子女、奴僕、兄弟、父母為弱宮」)*
- **[NO-YN-05]** Gợi ý cách viết bài: viết theo hướng "phong cách làm việc nhóm, kiểu người hợp tác, cách xây dựng đội ngũ và chọn bạn", không phán người khác tốt hay xấu tuyệt đối *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: NL (tr. 132); TB (tr. 168)*

### 8.2. 14 chính tinh tại cung
*Ghi chú: TB không chia từng sao cho cung Nô mà luận theo nhóm sao kết hợp với Mệnh (§9.1). Dưới đây, dòng (a)/(b) của mỗi sao ghép TT (卷二·八奴僕, có từng sao) với kết luận TB cho nhóm của sao đó.*

#### Tử Vi
- **[NO-TV-01]** (a) Tử Vi ở Nô sáng sủa: người dưới đông và đắc lực, giúp chủ sinh tài. Tử Tướng: đắc lực. TB (nhóm 1 sáng ở Nô, Mệnh nhóm 2 sáng): thuê người trước khó sau dễ, bạn bè khá giả nhưng trên dưới khó hợp tính nhau — *Nguồn: TT (卷二·八奴僕: 紫微「成行得力，旺主生財…天相同得力」); TB (tr. 170, §9.1)*
- **[NO-TV-02]** (b) Tử Vi gặp Kình Đà Hỏa Linh: người dưới kém lực. Gặp Không Kiếp: dễ có oán, người rời đi. Tử Phá: trước khó sau có — *Nguồn: TT (卷二·八奴僕: 「加擎羊火鈴陀羅欠力，破軍同先難後有招…加空劫招怨逃走」); TB (tr. 169–170, §9.1: nhóm 1 mờ ám ở Nô thì người giúp việc bất lực, ly tán)*
- **[NO-TV-03]** TT 卷一 cho rằng Tử Vi rơi vào Nô (cung nhược) thì chủ nhân lao lực, có người giúp cũng không thành phúc. Ý này khác với 卷二, xem NO-TRANH-02 — *Nguồn: TT (卷一·問紫微: 「如落疾厄、兄弟、奴僕、相貌、四陷宮，主人勞碌作事無成，雖得助亦不為福」); TT (卷一·斗數發微論: 「尊星列賤位，主人多勞」)*

#### Liêm Trinh
- **[NO-LT-01]** (a) Liêm Trinh nhập miếu ở Nô (Thìn Tuất): "một tiếng gọi trăm người dạ", đội ngũ nghe lời. TB (nhóm 2 sáng ở Nô, Mệnh nhóm 1 sáng): người giúp việc đắc lực, đông, bạn bè khá giả — *Nguồn: TT (卷二·八奴僕: 廉貞「入廟一呼百諾」); TB (tr. 168, §9.1)*
- **[NO-LT-02]** (b) Liêm Trinh hãm (Mão Dậu Tỵ Hợi): người dưới dễ không cùng lòng, về sau mới có người hợp. Liêm Tham kém lực; Liêm Sát khó giữ người — *Nguồn: TT (卷二·八奴僕: 「廉貞陷地奴背主，晚年方招得…貪狼同欠力，七殺同背主」); TB (tr. 168, §9.1: nhóm 2 mờ ám thì người giúp việc kém, về sau ly tán, ít bạn)*

#### Thiên Đồng
- **[NO-TD-01]** (a) Thiên Đồng vượng tướng ở Nô: người dưới đắc lực. Đồng Âm đắc lực; Đồng Lương giúp chủ — *Nguồn: TT (卷二·八奴僕: 天同「得力旺相…太陰同得力，天梁同助主」); TB (tr. 170, §9.1: nhóm 1 sáng ở Nô thì người giúp việc đông, đắc lực, trung thành [khi Mệnh nhóm 2 mờ])*
- **[NO-TD-02]** (b) Thiên Đồng hãm hoặc gặp sát tinh: có người không cùng lòng. Gặp Không Kiếp thì người rời đi. Đồng Cự: trước khó sau dễ — *Nguồn: TT (卷二·八奴僕: 「巨門先難後易…加羊陀火鈴有背主之奴，若見空劫怨主會走」); TB (tr. 170, §9.1)*

#### Vũ Khúc
- **[NO-VK-01]** (a) Vũ Khúc ở cung vượng: người dưới không ít, "một hô trăm dạ". Vũ Phủ đông người; Vũ Tướng đắc lực. TB (Vũ Tướng sáng ở Nô): người giúp việc rất tài giỏi, bạn bè quý hiển giàu có — *Nguồn: TT (卷二·八奴僕: 武曲「旺宮不少，一呼百諾，天府同多奴多婢…天相同得力」); TB (tr. 168, §9.1)*
- **[NO-VK-02]** (b) Vũ Phá: dễ có oán, về già mới có người hợp. Vũ Sát: khó giữ người. Vũ Tham: kém lực. TB (Vũ Tướng mờ ám ở Nô): người giúp việc bất lực, dễ rời đi, bạn bè khó khăn — *Nguồn: TT (卷二·八奴僕: 「破軍同招怨，會走，末年有招…七殺同，背主，貪狼同欠力」); TB (tr. 168, §9.1)*

#### Thái Dương
- **[NO-TDU-01]** (a) Thái Dương nhập miếu ở Nô: người dưới vượng chủ. Âm Dương đồng cung: có nhiều người. KL: Nhật Nguyệt sáng ở Nô thì người dưới dễ lạm quyền, nên phân quyền rõ — *Nguồn: TT (卷二·八奴僕: 太陽「入廟旺主發…太陰同多招」); KL (Thái dương ở các cung — Nô: "Nhật Nguyệt sáng: người dưới lạm quyền")*
- **[NO-TDU-02]** (b) Thái Dương hãm ở Nô: ít người hợp, có cũng dễ rời đi. KL: Nhật Nguyệt hãm thì người làm ra vào luôn, không ai ở lâu — *Nguồn: TT (卷二·八奴僕: 「陷宮無分，有也怨主，會走」); KL (Thái dương — Nô)*

#### Thiên Cơ
- **[NO-TCO-01]** (a) Thiên Cơ nhập miếu ở Nô: người dưới đắc lực. Cơ Cự gặp cát tinh có người giúp — *Nguồn: TT (卷二·八奴僕: 天機「入廟得力…巨門加吉星有奴婢」); TB (tr. 169–170, §9.1: nhóm 1 sáng ở Nô)*
- **[NO-TCO-02]** (b) Thiên Cơ hãm hoặc gặp Không vong: người dưới dễ có oán. Cơ Lương: về sau mới có người hợp. Cơ Âm: kém lực. Gặp sát tinh thì khó có người — *Nguồn: TT (卷二·八奴僕: 「陷空怨主，天梁同晚招，太陰同欠力…加擎陀火鈴空劫全難」); TB (tr. 169, §9.1: nhóm 1 mờ ám)*

#### Thiên Phủ
- **[NO-TP-01]** (a) Thiên Phủ ở Nô: người dưới đắc lực, "một hô trăm dạ". Tử Phủ: giúp chủ dựng nhà — *Nguồn: TT (卷二·八奴僕: 天府「得力一呼百諾，紫微同助主…」); TB (tr. 169–170, §9.1: nhóm 1 sáng ở Nô)*
- **[NO-TP-02]** (b) Thiên Phủ gặp Kình Đà Hỏa Linh Không Kiếp: nhiều người không cùng lòng, dễ rời đi. TT 卷一 coi Nô là chỗ "hãm nhược" của Thiên Phủ — *Nguồn: TT (卷二·八奴僕: 「加陀羊火鈴空劫多背主，逃走」; 卷一·問天府: 「以奴僕相貌為陷弱」)*

#### Thái Âm
- **[NO-TA-01]** (a) Thái Âm miếu địa ở Nô (Dậu Tuất Hợi): người dưới đắc lực, thành hàng. Đồng Âm vượng chủ — *Nguồn: TT (卷二·八奴僕: 太陰「廟地得力成行…天同同旺主」); TB (tr. 170, §9.1)*
- **[NO-TA-02]** (b) Thái Âm hãm ở Nô: ít người hợp. Gặp sát tinh thì có rồi lại đi. Cơ Âm kém lực — *Nguồn: TT (卷二·八奴僕: 「天機同欠力…加羊陀火鈴空劫，雖有而走，陷地全無」); KL (Thái dương — Nô: "Nhật Nguyệt hãm địa: tôi tớ ra vào luôn")*

#### Tham Lang
- **[NO-THL-01]** (a) Tham Lang ở Nô: ban đầu khó có người hợp. TT 卷一 nói thêm Tham Lang miếu vượng ở Nô thì dễ hao tổn vì người dưới. Đây là sao mà "miếu" ở Nô **không** làm tốt hơn — *Nguồn: TT (卷二·八奴僕: 貪狼「初難招敗主之奴」; 卷一·問貪狼: 「奴僕居於廟旺，必因奴僕所破」)*
- **[NO-THL-02]** (b) Tham Lang hãm ở Nô: khó có người. Liêm Tham ít. Tử Tham gặp sát: có mà khó giữ. TB (nhóm 2 mờ ám ở Nô): người giúp việc thưa, kém, bạn bè ly tán — *Nguồn: TT (卷二·八奴僕: 「陷地全無，廉貞同亦少…加羊陀火鈴空劫雖有難育」); TB (tr. 169, §9.1)*

#### Cự Môn
- **[NO-CM-01]** (a) Cự Môn nhập miếu ở Nô (Mão Dậu): những năm đầu người dưới chưa đắc lực, dễ thị phi, ít ở lâu. Cự Nhật giúp chủ giữ nhà; Cự Đồng về sau mới có người hợp — *Nguồn: TT (卷二·八奴僕: 巨門「入廟早年不得力，招是非，不能久居，太陽同助主衛家…天同同末年招得」); TB (tr. 169–170, §9.1)*
- **[NO-CM-02]** (b) Cự Môn hãm ở Nô: dễ bị bạn bè, người dưới oán trách, dễ vỡ lòng tin. Nên rõ ràng trong giao kết, phản hồi trực tiếp — *Nguồn: TT (卷一·問巨門: 「在奴僕則多怨逆」); KL (Cự môn — Nô: "tôi tớ bạn bè oán trách. Bị phản bội nếu hãm địa")*

#### Thiên Tướng
- **[NO-TT-01]** (a) Thiên Tướng ở Nô: về sau mới có người hợp. Tử Tướng đông người. TB (Vũ Tướng sáng ở Nô): người giúp việc trung thành, bạn bè khá giả, có lòng tốt — *Nguồn: TT (卷二·八奴僕: 天相「末年招得，紫微同多奴多婢」); TB (tr. 168–170, §9.1)*
- **[NO-TT-02]** (b) Thiên Tướng hãm (Mão Dậu) hoặc gặp sát tinh: người dưới kém lực, dễ rời đi. Vũ Tướng (theo TT) có oán — *Nguồn: TT (卷二·八奴僕: 「武曲同怨主…加羊陀火鈴空劫欠力逃走」); TB (tr. 168, §9.1: Vũ Tướng mờ ám thì người giúp việc bất lực)*

#### Thiên Lương
- **[NO-TL-01]** (a) Thiên Lương ở Nô: người dưới nhiều và vượng chủ. Đồng Lương có người giữ nhà. TT 卷一 nói Lương ở Nô luận là "dư dả" — *Nguồn: TT (卷二·八奴僕: 天梁「奴多旺主，天同同有衛家之奴」; 卷一·問天梁: 「居奴僕、疾厄、相貌作豐餘之論」)*
- **[NO-TL-02]** (b) Cơ Lương: người dưới không một lòng. Thiên Lương hãm (Tỵ Dậu Hợi) gặp sát tinh: theo TB, người giúp việc kém, ly tán — *Nguồn: TT (卷二·八奴僕: 「天機同不一心」); TB (tr. 169, §9.1: nhóm 1 mờ ám ở Nô)*

#### Thất Sát
- **[NO-TS-01]** (a) Thất Sát ở Nô (kể cả khi miếu): người dưới cá tính mạnh, dễ lấn chủ, cần kiểm soát tài chính chặt — *Nguồn: TT (卷二·八奴僕: 七殺「欺主有剛強之僕，多盜家財」); TB (tr. 170, §9.1: nhóm 2 sáng ở Nô [Mệnh nhóm 1 mờ]: người giúp việc đắc lực nhưng hay lấn quyền người trên)*
- **[NO-TS-02]** (b) Thất Sát hãm hoặc Vũ Sát, Liêm Sát: khó giữ người, kém lực. Gặp sát tinh: khó có người hợp — *Nguồn: TT (卷二·八奴僕: 「武曲同背主廉貞欠力，加羊陀火鈴空劫全，難招」); TB (tr. 168–169, §9.1)*

#### Phá Quân
- **[NO-PQ-01]** (a) Phá Quân nhập miếu ở Nô (Tý Ngọ): người dưới đắc lực. Tử Phá: đắc lực — *Nguồn: TT (卷二·八奴僕: 破軍「入廟得力…紫微同得力」); TB (tr. 168, §9.1: nhóm 2 sáng ở Nô)*
- **[NO-PQ-02]** (b) Phá Quân hãm ở Nô: dễ có oán, dễ bị nói xấu, người rời đi. Vũ Phá trái ý; Liêm Phá kém lực — *Nguồn: TT (卷二·八奴僕: 「陷宮招怨背主，武曲同違背…廉貞同欠力」; 卷一·問破軍: 「在奴僕謗怨逃走」)*

### 8.3. Bộ sao phụ quan trọng (SP)
- **[NO-SP-01]** Xương, Khúc, Khôi, Việt: bạn bè có học thức, địa vị. Nhiều sao sáng: nên kết giao người có học, có vị thế. Nhiều sao mờ: nên giữ khoảng cách với những người này — *Nguồn: TB (tr. 172, §9.2.1); TT (卷二·八奴僕: 文昌「入廟獨守得力助主」, 文曲「入廟得力，陷宮無分」)*
- **[NO-SP-02]** Tả, Hữu: nhiều sao sáng thì người giúp việc rất đắc lực, bạn bè tốt. Nhiều sao mờ thì người giỏi nhưng khó tin cậy — *Nguồn: TB (tr. 172, §9.2.2); TT (卷二·八奴僕: 左輔「獨守旺相一呼百諾」, 右弼「獨守成行，加羊陀火鈴空劫耗忌，背主盜財而走」)*
- **[NO-SP-03]** Lộc Tồn ở Nô: TB nói khó thuê người, ít bạn. TT 卷二 nói người dưới nhiều. Xem NO-TRANH-01 — *Nguồn: TB (tr. 172, §9.2.3); TT (卷二·八奴僕: 祿存「奴僕多，加吉星衛主起家」; 卷一·太微賦: 「祿居奴僕縱有官也奔馳」)*
- **[NO-SP-04]** Kình Dương ở Nô: người dưới khó đắc lực, không lâu bền; nhập miếu thì về sau mới có. Đà La: kém lực, nhập miếu gặp cát tinh thì có phần — *Nguồn: TT (卷二·八奴僕: 擎羊「背主招怨不得力…入廟晚年方可招」, 陀羅「欠力怨主，入廟加吉星有分」); TB (tr. 168–171, §9.1 nhóm "Sát tinh" ở Nô)*
- **[NO-SP-05]** Hỏa, Linh ở Nô: người dưới không đắc lực. Gặp cát tinh và nhập miếu thì có một vài người giúp được — *Nguồn: TT (卷二·八奴僕: 火星「獨守怨主不得力，加吉星入廟可招一二」, 鈴星「會吉星入廟，助主衛家」); TB (§9.1 nhóm "Sát tinh")*
- **[NO-SP-06]** Tả, Hữu gặp Không, Kiếp: nên thận trọng với người mới quen, kiểm tra kỹ trước khi giao việc, giao tiền *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 173, §9.2.12); TT (卷二·八奴僕: 左輔「加羊陀火鈴空劫耗忌背主難招」)*
- **[NO-SP-07]** Tả, Hữu, Tướng Quân, Phục Binh cùng ở Nô: người giúp việc đắc lực, tận tâm, trung thành — *Nguồn: TB (tr. 173, §9.2.13); KL lại xếp Phục Binh vào nhóm xấu ở Nô ("gặp lũ Phục binh, Hóa kỵ, Phá toái thì bạn bè, gia nhân phản chủ"; 9. Cung Nô) (bản quét, đã đọc)* ⚑1nguồn
- **[NO-SP-08]** Song Hao: khó giữ người làm lâu, bạn bè hay rủ rê chơi bời. Nên chọn bạn kỹ — *Nguồn: TB (tr. 172, §9.2.6); KL chỉ nói chung Song Hao ngoài vị trí đắc thì "phá tán hoàn toàn", không nói riêng cung Nô (37. Song Hao) (bản quét, đã đọc)* ⚑1nguồn
- **[NO-SP-09]** Tướng Quân: người giúp việc hay lấn người trên. Khốc, Hư: hay bị người dưới phàn nàn. Phục Binh: sao sáng thì có người phụ giúp, sao mờ thì có người không thật lòng — *Nguồn: TB (tr. 172, §9.2.7–9.2.9); KL cho Phục Binh "xấu ở tất cả các cung" trừ cách Binh Hình Tướng Ấn, không chia sáng/mờ (Phục binh ở các cung) (bản quét, đã đọc)* ⚑1nguồn
- **[NO-SP-10]** Đào Hoa ở Nô: quan hệ xã giao rộng, dễ phát sinh chuyện tình cảm phức tạp qua các mối quan hệ bên ngoài. Nên giữ ranh giới rõ *(sách gốc diễn đạt nặng và thiên lệch giới, đã trung tính hóa)* — *Nguồn: TB (tr. 172, §9.2.10); KL (Đào Hồng ở các cung — Nô: "Lả lơi với bạn bè người dưới") (bản quét, đã đọc)*

### 8.4. Cách cục chính (CC)
- **[NO-CC-01]** Bảng kết hợp Mệnh × Nô của TB, tóm tắt các quy luật lặp lại: (1) Nô có sát tinh sáng sủa: người quanh mình tài giỏi nhưng khó tin cậy, trước tụ sau tán; (2) Nô có Vũ Tướng sáng: gần như mọi tổ hợp đều có người giúp tài giỏi; (3) Mệnh và Nô cùng mờ ám: ít người giúp, bạn bè thưa — *Nguồn: TB (tr. 168–171, §9.1); NL (Giây liên lạc Bào với Nô, nguyên tắc 4 và 8: Mệnh, Bào, Nô cùng hãm thì "bạn bè phần đông vô tài và phân tán") (bản quét, đã đọc); NL cùng ý điểm (3), và điểm (2) ở mức chung (Nô có chính tinh nhóm Tử Phủ đắc địa thì "vẫn được việc", nguyên tắc 7); NL không nói về sát tinh ở Nô (điểm 1)*
- **[NO-CC-02]** Chính tinh ở Nô sáng hơn ở Mệnh (đặc biệt nhóm Sát Phá Liêm Tham hoặc Khoa Quyền Lộc ở Nô): người dưới giỏi nhưng dễ lấn quyền. Nên giao quyền có giới hạn, quy trình rõ *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 169, 172, §9.1, §9.2.4); KL (Thái dương — Nô: "người dưới lạm quyền")*
- **[NO-CC-03]** Vô chính diệu ở Nô: lấy chính tinh xung chiếu (cung Huynh Đệ) mà luận như chính tinh tọa thủ. Nếu Nô có chính tinh đồng cung với sát tinh thì chỉ cần xét độ sáng của chính tinh — *Nguồn: TB (tr. 171, §9.1); NL (Giây liên lạc Bào với Nô: Nô vô chính diệu lấy chính tinh Bào "xung chiếu", kèm chính tinh tam hợp) (bản quét, đã đọc); NL xét thêm tam hợp, không nói vế đồng cung sát tinh*
- **[NO-CC-04]** Tuần, Triệt án ngữ ở Nô: thuê người trước khó sau dễ nhưng không lâu bền. Nhiều sao sáng thì luận ngược thành mờ, nhiều sao mờ thì luận ngược thành sáng — *Nguồn: TB (tr. 173, §9.2.11)* ⚑1nguồn
- **[NO-CC-05]** "Giàu nhờ bạn": Quan, Nô, Di là ba cung "ngoại nhân". Khi Nô có chính tinh đắc cách, sinh xuất cho Mệnh, người dưới hết lòng với Mệnh. NL minh họa bằng lá số Canh Tuất — *Nguồn: NL (tr. 132–133); KL (9. Cung Nô: "Giàu nhờ bạn mà nghèo cũng vì bạn"; Nô có sao tốt thì "bạn bè tận tâm", "được việc") (bản quét, đã đọc); KL không xét sinh xuất, sinh nhập*

### 8.5. Tứ hóa tại cung (HOA)
- **[NO-HOA-01]** Khoa, Quyền, Lộc ở Nô: người giúp việc khá giả nhưng hay lấn át người trên, bạn bè tốt và quý hiển — *Nguồn: TB (tr. 172, §9.2.4); WQ5 (Hua Lu/Hua Ke in Friends palace: đội ngũ và mạng lưới là nguồn lợi, có vị thế)*
- **[NO-HOA-02]** Hóa Quyền ở Nô (theo WQ5): có quyền điều hành đội ngũ. Theo TB thì dễ thành người dưới lấn quyền. Hai cách đọc ngược nhau, xem NO-TRANH-03 — *Nguồn: TB (tr. 172, §9.2.4); WQ5 (Hua Quan in Friends palace)*
- **[NO-HOA-03]** Hóa Kỵ ở Nô: hay mắc thị phi, dễ bị người giúp việc hoặc bạn bè nói xấu, trách móc. Nên phản hồi minh bạch, giữ lời hứa — *Nguồn: TB (tr. 172, §9.2.5); WQ5 (Hua Ji in Friends palace: xung đột với cấp dưới, khó giữ nhân sự)*

### 8.6. Điểm còn tranh luận (TRANH)
- **[NO-TRANH-01]** Lộc Tồn ở Nô: TB nói "khó thuê mượn người làm, ít bạn bè". TT 卷二 nói "người dưới nhiều, thêm cát tinh thì giữ chủ dựng nhà". TT 卷一 (Thái Vi phú) lại nói "Lộc ở Nô thì dù có chức cũng bôn ba". Ba câu không thống nhất. Đề xuất: không luận Lộc Tồn ở Nô theo một chiều; ghi là "nguồn lực dễ tràn ra ngoài, cần quản lý chi phí nhân sự" *(Nhận xét nhóm)* — *Nguồn: TB (tr. 172); TT (卷一·太微賦; 卷二·八奴僕)*
- **[NO-TRANH-02]** Tử Vi ở Nô: TT 卷二 cho là tốt (người dưới thành hàng, đắc lực). TT 卷一 cho là "sao tôn ở vị trí thấp, chủ nhân lao lực". Hai câu ở hai quyển của cùng một sách. Đề xuất: đọc là "đội ngũ mạnh nhưng chủ nhân phải tự gánh nhiều" — *Nguồn: TT (卷一·問紫微, 卷一·斗數發微論; 卷二·八奴僕)*
- **[NO-TRANH-03]** Tứ hóa ở Nô: TB đọc Khoa Quyền Lộc ở Nô là "người dưới lấn át người trên". Nguồn hiện đại WQ5 đọc là "mình có quyền với đội ngũ". WQ5 độ tin cậy thấp, ưu tiên TB — *Nguồn: TB (tr. 172); WQ5*
- **[NO-TRANH-04]** TB không cho từng sao ở Nô mà dùng nhóm sao × Mệnh. TT cho từng sao nhưng không xét Mệnh. Phần 8.2 ghép hai cách. Khi viết bài phải nêu được cả độ sáng sao ở Nô **và** ở Mệnh, không chỉ đọc sao ở Nô — *Nguồn: TB (tr. 168–171); TT (卷二·八奴僕)*
- **[NO-TRANH-05]** Bản TT Wikisource có vài chỗ chữ khó hiểu: mục Liêm Trinh có "天同同多奴多婢" dù Liêm Trinh không đồng cung Thiên Đồng; mục Cự Môn có "天同天一心". Có lẽ là lỗi chép, nên không dùng các vế này — *Nguồn: TT (卷二·八奴僕)*

---

## 9. Cung Quan Lộc (Sự Nghiệp)

### 9.1. Ý nghĩa cung (YN)
- **[QUAN-YN-01]** Quan Lộc cho biết công danh, sự nghiệp và **khả năng chuyên môn** — *Nguồn: TB (tr. 158, §8); KL (cung Quan lộc: công danh, nghề nghiệp, khoa bảng, quyền hành)*
- **[QUAN-YN-02]** Quan Lộc là tam hợp với Mệnh, là "người bạn sống còn" của Mệnh, như quân sư luôn cộng tác với Mệnh. Quan yếu thì Mệnh chịu thiệt — *Nguồn: NL (tr. 132); TT (卷一·問紫微: 「若居官祿身命，三宮最要左右守衛」)*
- **[QUAN-YN-03]** Sao chủ của Quan Lộc: Tử Vi được gọi là "chủ tinh cung Quan Lộc", Thái Dương là "chính chủ quan lộc tinh", Thiên Tướng là "quan lộc văn tinh". Ba sao này vào Quan Lộc được coi là đúng chỗ — *Nguồn: TT (卷一·問紫微 thơ: 「紫微原屬土，官祿宮主星」; 問太陽: 「正主官祿星」「乃官祿之樞機」; 問天相: 「是為官祿文星」); KL (Thái dương: "Thái dương là quan lộc tinh"; Thiên tướng: "sao chủ về quan lộc")*
- **[QUAN-YN-04]** Luận Quan Lộc phải xét tam phương tứ chính: Mệnh, Tài Bạch, Quan Lộc, và Phu Thê xung chiếu. Không luận riêng một cung — *Nguồn: TT (卷三: 「三看遷移財帛官祿三方星辰刑沖剋破」); WQ5 (Career palace: trục Phu Thê–Quan Lộc, tam phương Mệnh·Tài·Quan·Phu)*
- **[QUAN-YN-05]** Cách viết bài trả phí cho Quan Lộc gồm 3 lớp: (1) **thiên hướng nghề nghiệp** theo chính tinh và bộ sao; (2) **phong cách làm việc** theo tính chất sao (nhanh/chậm, ổn định/thay đổi, độc lập/phối hợp); (3) **môi trường phù hợp** (tổ chức lớn/nhỏ, kinh doanh/chuyên môn, cố định/lưu động). Sách cổ dùng khung "văn chức / võ chức / buôn bán / kỹ nghệ / y dược / sư phạm"; bài viết chuyển sang nghề hiện đại *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 158–167); TT (卷二·九官祿)*
- **[QUAN-YN-06]** Bảng chuyển từ cổ sang nghề hiện đại *(Nhận xét nhóm, không phải quy tắc gốc)*: "văn chức" → hành chính, quản lý, chuyên môn trí thức; "võ nghiệp/quân sự" → ngành kỷ luật (quân đội, công an), vận hành hiện trường, an ninh, phẫu thuật, kỹ thuật cường độ cao, khởi nghiệp mạo hiểm; "kỹ nghệ, máy móc" → kỹ thuật, công nghệ, sản xuất; "hình luật" → pháp lý, kiểm toán, thanh tra; "doanh thương" → kinh doanh, bán hàng, thương mại; "tài chánh, kinh tế" → tài chính, ngân hàng, kế toán; "y dược, sư phạm" → y tế, chăm sóc, giáo dục, đào tạo; "lưu động" → công việc di chuyển, logistics, du lịch, kinh doanh quốc tế — *Nguồn: TB (tr. 158–166); WQ5 (các trang Career palace)*

### 9.2. 14 chính tinh tại cung

#### Tử Vi (miếu Dần Tỵ Ngọ Thân; vượng Thìn Tuất; đắc Sửu Mùi; bình Tý Mão Dậu Hợi)
- **[QUAN-TV-01]** (a) Tử Vi tại Ngọ, hoặc Tử Phủ: công danh hiển hách, giàu sang và địa vị đi cùng nhau. TT: Tử Vi miếu vượng gặp Tả Hữu Xương Khúc Khôi Việt thì đạt địa vị rất cao; Tử Phủ quyền quý, danh lợi lưỡng toàn — *Nguồn: TB (tr. 158, §8.1); TT (卷二·九官祿: 紫微「廟旺遇左右昌曲魁鉞…天府同權貴名利兩全」; 卷一·斗數發微論: 「官祿遇紫府，富而且貴」)*
- **[QUAN-TV-02]** (b) Tử Vi tại Tý (bình) hoặc gặp Kình Đà Hỏa Linh: công danh bình thường. Không có Tả Hữu thì thành "cô quân", có tài nhưng thiếu người phò tá — *Nguồn: TB (tr. 158, §8.1: "Đơn thủ tại Tý: bình thường"); TT (卷二·九官祿: 「加羊陀火鈴平常」; 卷一·問紫微: 「無輔弼同行則為孤君」)*
- **[QUAN-TV-03]** Tử Tướng: văn võ toàn tài, trước nhỏ sau lớn, giỏi tổ chức, nhiều sáng kiến nhưng dễ vượt quyền cấp trên. TT: trong ngoài quyền quý, thanh chính — *Nguồn: TB (tr. 158, §8.1); TT (卷二·九官祿: 「天相加內外權貴清正」)*
- **[QUAN-TV-04]** Tử Sát: có uy quyền, hợp ngành kỷ luật. Tử Phá: thành công ở ngành kỷ luật hoặc kinh doanh nhưng lên xuống thất thường; TT nói Tử Phá "an thân trong chốn náo nhiệt". Tử Tham: bình thường, càng lên cao càng cần thận trọng — *Nguồn: TB (tr. 158, §8.1); TT (卷二·九官祿: 「破軍同鬧中安身」); KL (Tử vi ở các cung — Quan: "đồng cung với Thất sát có khiếu võ nghiệp, với Phá quân, Tham lang thì thăng trầm")*
- **[QUAN-TV-05]** Thiên hướng và phong cách: vai trò lãnh đạo, điều hành, đứng đầu một bộ phận hoặc tổ chức. Hợp môi trường có cấu trúc, có thứ bậc. Cần đội ngũ phụ tá (Tả Hữu) mới phát huy hết. Ví dụ nghề hiện đại: quản lý cấp cao, quản lý nhà nước, chủ doanh nghiệp gia đình — *Nguồn: TT (卷一·問紫微: 「若居官祿身命，三宮最要左右守衛」); WQ5 (Zi Wei in Career palace)*

#### Liêm Trinh (miếu Thìn Tuất; vượng Tý Dần Ngọ Thân; đắc Sửu Mùi; hãm Mão Tỵ Dậu Hợi)
- **[QUAN-LT-01]** (a) Liêm Trinh đơn thủ tại Dần, Thân (vượng): hiển đạt ở ngành kỷ luật, có uy quyền, kiêm được việc chính trị, quản lý, được kính nể. TT: Liêm Trinh ở Quan Lộc có uy quyền — *Nguồn: TB (tr. 158, §8.2); TT (卷一·問廉貞: 「在官祿有威權」); KL (Liêm trinh — Quan: "tại Dần Thân … có uy quyền được người kính nể")*
- **[QUAN-LT-02]** Liêm Phủ, Liêm Tướng: giàu sang, uy quyền, văn võ kiêm toàn, được kính nể. TT: Liêm Tướng, Liêm Phủ "áo gấm phú quý" — *Nguồn: TB (tr. 158, §8.2); TT (卷二·九官祿: 廉貞「天相天府同衣錦富貴」); KL (Liêm trinh — Quan)*
- **[QUAN-LT-03]** (b) Liêm Tham (Tỵ Hợi, hãm): đường công danh nhiều trở ngại, dễ vướng rắc rối pháp lý. Nên tránh vị trí nhạy cảm về quyền lợi, giữ minh bạch tuyệt đối *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 158, §8.2); KL (Liêm trinh — Quan: "đi với Tham lang thì có thể bị hình ngục"); TT (卷一·太微賦: 「刑殺同廉貞於官祿」 cách xấu)*
- **[QUAN-LT-04]** Liêm Sát: lên nhanh xuống nhanh, may rủi đi liền. Nếu làm kinh doanh hoặc kỹ thuật thì thuận và yên hơn. Liêm Phá: nên làm kỹ thuật hoặc thương mại, đi đường quan chức dễ không toại ý. TT: Liêm Trinh miếu thì võ chức quyền quý nhưng không bền — *Nguồn: TB (tr. 158, §8.2); TT (卷二·九官祿: 「廉貞入廟武職權貴不耐久…七殺同軍旅出身」); KL (Liêm trinh — Quan: "với Thất sát công danh chậm; Phá quân bất toại công danh")*
- **[QUAN-LT-05]** Thiên hướng và phong cách: nguyên tắc, quyết liệt, hợp môi trường có luật lệ rõ (pháp lý, thanh tra, quản lý nhà nước, ngành kỷ luật) hoặc kỹ thuật, thương mại khi gặp Sát, Phá. Cần giữ cân bằng giữa tham vọng và liêm chính *(Nhận xét nhóm, tổng hợp từ TB, TT)* — *Nguồn: TB (tr. 158); TT (卷一·問廉貞); WQ5 (Lian Zhen in Career palace: luật sư, thẩm phán, công chức)*

#### Thiên Đồng (miếu Dần Thân; vượng Tý; đắc Mão Tỵ Hợi; hãm Sửu Thìn Ngọ Mùi Dậu Tuất)
- **[QUAN-TD-01]** (a) Thiên Đồng tại Mão: văn võ kiêm toàn nhưng hay đổi việc. Đồng Lương (Dần Thân, miếu): phú quý, rất nổi tiếng nếu theo y khoa hay sư phạm, vào chính trường cũng toại ý. Đồng Âm tại Tý: công danh hiển hách, có tài góp ý, can gián cấp trên — *Nguồn: TB (tr. 158–159, §8.3); TT (卷二·九官祿: 天同「入廟文武皆宜」); KL (Thiên đồng — Quan lộc: "cư Tí Mão và đồng cung với Lương có tài và hiển đạt")*
- **[QUAN-TD-02]** (b) Thiên Đồng tại Dậu (hãm): công danh muộn, chức vị nhỏ, hay thay đổi, nên theo thương mại hoặc kỹ thuật. Tại Tỵ Hợi: phú quý như mây nổi, làm việc chóng chán, thích di chuyển, nên làm việc lưu động. TT: hãm thì làm vị trí thừa hành — *Nguồn: TB (tr. 158, §8.3); TT (卷二·九官祿: 「陷宮胥吏論」); KL (Thiên đồng — Quan lộc: "tại Tỵ Hợi phú quí bất thường, tại Dậu thì muộn công danh")*
- **[QUAN-TD-03]** Thiên Đồng tại Thìn, Tuất: việc di chuyển luôn, công danh trước nhỏ sau lớn, có tài ăn nói và lý luận. Đồng Cự: công danh chật vật, cần người trên dìu dắt, dễ vướng thị phi; TT lại nói Đồng Cự "trước nhỏ sau lớn" — *Nguồn: TB (tr. 158–159, §8.3); TT (卷二·九官祿: 「巨門同先小後大」); KL (Thiên đồng — Quan lộc: "xấu nếu gặp Cự đồng cung")*
- **[QUAN-TD-04]** Thiên hướng và phong cách: Thiên Đồng thích **thay đổi, cải tiến**. Mức thay đổi theo độ sáng: miếu (Dần Thân) có toàn quyền thay đổi; vượng (Tý) chỉ thay đổi trong vai trò cố vấn; bình hòa lưỡng lự rồi mới đổi; hãm dễ đổi tùy tiện mà mất uy tín. Hợp nghề dịch vụ, chăm sóc, giáo dục, y tế, công việc có nhịp linh hoạt — *Nguồn: KL (Thiên đồng: "Thiên đồng và canh cải"); TB (tr. 158–159, §8.3)*

#### Vũ Khúc (miếu Sửu Thìn Mùi Tuất; vượng Tý Dần Ngọ Thân; đắc Mão Dậu; hãm Tỵ Hợi)
- **[QUAN-VK-01]** (a) Vũ Khúc tại Thìn, Tuất (miếu): hiển đạt ở ngành kỷ luật, kinh doanh cũng nhiều tài lộc. Vũ Phủ: công danh hoạnh đạt, chức vụ thuộc **tài chính, kinh tế**. TT: Vũ Khúc gặp Khoa Quyền Lộc là "quan về tài chính" — *Nguồn: TB (tr. 159, §8.4); TT (卷二·九官祿: 武曲「入廟與昌曲左右同宮，武職崢嶸…會科權祿為財富之官」); KL (Vũ khúc — Quan: "đồng cung Thiên phủ thì công danh hoạnh đạt")*
- **[QUAN-VK-02]** (b) Vũ Khúc hãm hoặc gặp Đà, Linh, Kiếp, Kỵ: con đường chức vị khó thành, nên tự kinh doanh hoặc làm chuyên môn. Vũ Phá (Tỵ Hợi): đi đường kỷ luật vất vả, kinh doanh lại toại ý — *Nguồn: TB (tr. 159, §8.4); TT (卷二·九官祿: 「陷宮及陀鈴劫忌功名無分」; 「破軍同軍旅內出身」)*
- **[QUAN-VK-03]** Vũ Tham: giàu nhờ kinh doanh, có chức vụ cũng sớm quay lại thương trường; tuổi trẻ chưa thông, khoảng sau 30 tuổi mới toại ý. TT cảnh báo Vũ Tham dễ thành "quan tham", nên giữ minh bạch tài chính. Vũ Sát: hiển đạt ở ngành kỷ luật, hay công tác xa, lên xuống thất thường — *Nguồn: TB (tr. 159, §8.4); TT (卷二·九官祿: 「貪狼同為貪污之官…七殺同橫立功名」); KL (Vũ khúc — Quan: "đồng cung Tham lang: buôn bán giầu có"; "đồng cung Thất sát: võ hiển")*
- **[QUAN-VK-04]** Thiên hướng và phong cách: quyết đoán, thực tế, giỏi quản trị tiền và nguồn lực. Hợp tài chính, ngân hàng, kế toán, kinh doanh, quản lý vận hành. Hợp môi trường có chỉ tiêu, đo kết quả rõ — *Nguồn: KL (Vũ khúc: "sao chủ về tài lộc, tính cương nghị, có óc kinh doanh"); TB (tr. 159, §8.4)*

#### Thái Dương (miếu Tỵ Ngọ; vượng Dần Mão Thìn; đắc Sửu Mùi; hãm Tý Thân Dậu Tuất Hợi)
- **[QUAN-TDU-01]** (a) Thái Dương sáng (Ngọ, Tỵ): công danh sớm đạt, văn võ kiêm toàn. Tại Thìn: cũng vậy nhưng dễ bị ghen ghét, hay phải làm việc không hợp chí hướng. TT: Thái Dương nhập miếu văn võ đều tốt, gặp Tả Hữu Xương Khúc Khôi Việt và Khoa Quyền Lộc thì địa vị rất cao — *Nguồn: TB (tr. 159, §8.5); TT (卷二·九官祿: 太陽「入廟文武為良…左右昌曲魁鉞同更君科祿權，定居一品之貴」; 卷一·問太陽: 「最宜在官祿宮」)*
- **[QUAN-TDU-02]** (b) Thái Dương tại Tuất, Hợi (hãm): đường công danh nhiều trở ngại, tuổi trẻ vất vả, lớn tuổi mới toại ý; có tài nhưng ít cơ hội thể hiện, dù vậy vẫn được kính trọng vì đức độ và văn tài. Tại Tý: công danh muộn, giỏi ăn nói, văn chương — *Nguồn: TB (tr. 159, §8.5); TT (卷二·九官祿: 「不見羊陀火鈴吉」 tức gặp sát thì giảm); KL (Thái dương — Mệnh: "Thái dương hãm địa về già mới an nhàn"; hãm địa "có tài không thực hiện được lý tưởng") (bản quét, đã đọc); KL nói Thái Dương hãm nói chung, không riêng cung Quan*
- **[QUAN-TDU-03]** Cự Nhật tại Dần: công danh hiển hách, nên theo **pháp lý** vì giỏi lý luận, xét đoán. Cự Nhật tại Thân: lên xuống thất thường, về già mới toại ý. Nhật Lương tại Mão: công danh sớm, nên theo y dược, sư phạm, về sau nổi tiếng; tại Dậu: có tài nhưng muộn, vẫn nên y dược, sư phạm — *Nguồn: TB (tr. 159, §8.5); TT (卷二·九官祿: 巨門「太陽同有進退，入廟久長」); KL (Thiên lương — Quan: "Lương Nhật ở Mão: quí hiển, có tài sư phạm … khiếu Y Dược")*
- **[QUAN-TDU-04]** Nhật Nguyệt đồng cung (Sửu Mùi): công danh trắc trở lúc đầu, có tài mà chưa đắc chí. Rất cần Tuần/Triệt án ngữ thì về sau hiển hách — *Nguồn: TB (tr. 160, §8.5); KL (Thái âm — Quan: "Nhật Nguyệt đồng cung Sửu Mùi không gặp Tuần Triệt: bất đắc chí")*
- **[QUAN-TDU-05]** Thiên hướng và phong cách: hướng ngoại, thích được ghi nhận, hợp công việc xuất hiện trước công chúng hoặc truyền đạt: giáo dục, truyền thông, chính sách công, bán hàng, lãnh đạo tổ chức. Thái Dương sáng thì nổi bật sớm; hãm thì nên chọn chuyên môn sâu, bền bỉ để thành công muộn — *Nguồn: TT (卷一·問太陽: 「在數主人有貴氣，能為文為武」); WQ5 (Tai Yang in Career palace: giáo viên, phát thanh viên, chính trị, lãnh đạo bán hàng)*

#### Thiên Cơ (miếu Mão Thìn Dậu Tuất; vượng Tỵ Thân; đắc Tý Sửu Ngọ Mùi; hãm Dần Hợi)
- **[QUAN-TCO-01]** (a) Thiên Cơ tại Tỵ, Ngọ, Mùi: phú quý song toàn nhưng không ồn ào; nên theo **kỹ thuật, máy móc**. TT: Thiên Cơ nhập miếu thì quyền quý, gặp Văn Khúc là người tham mưu giỏi — *Nguồn: TB (tr. 160, §8.6); TT (卷二·九官祿: 天機「入廟權貴，會文曲為良臣」)*
- **[QUAN-TCO-02]** (b) Thiên Cơ tại Hợi, Tý, Sửu: công danh muộn và chật vật, nên làm kinh doanh hoặc kỹ thuật. TT: hãm thì dễ rời chức, đứng ở vị trí thừa hành — *Nguồn: TB (tr. 160, §8.6); TT (卷二·九官祿: 「陷宮退官失職，吏員立腳」)*
- **[QUAN-TCO-03]** Cơ Lương (Thìn Tuất): công danh hiển đạt, cẩn thận, hay suy xét xa gần, thích bàn về chính trị, chiến lược; làm **tham mưu** thì có chức lớn; làm thầy thuốc, thầy giáo cũng nổi tiếng. Cơ Cự: nhiều mưu trí, rất thích máy móc. Cơ Âm tại Thân (bản OCR ghi "Thìn", nhưng Cơ Âm chỉ đồng cung ở Dần Thân): nên theo khoa học hoặc sư phạm, buôn bán cũng thuận; tại Dần: tương tự nhưng muộn hơn — *Nguồn: TB (tr. 160, §8.6); TT (卷二·九官祿: 「天梁同文武之材」); KL (Thiên cơ — Quan: "Cơ Lương hay Cơ Cự văn võ kiêm toàn. Cơ Nguyệt Dần Thân có khiếu y dược")*
- **[QUAN-TCO-04]** Thiên hướng và phong cách: tư duy phân tích, lên kế hoạch, thích cải tiến quy trình. Hợp vai trò tham mưu, chiến lược, kỹ sư, lập trình, nghiên cứu, y dược. Hợp môi trường cho phép suy nghĩ và thử nghiệm hơn là việc lặp lại — *Nguồn: TB (tr. 160, §8.6); WQ5 (Tian Ji in Career palace: "chủ trí mưu")*

#### Thiên Phủ (miếu Tý Dần Ngọ Thân; vượng Thìn Tuất; đắc Tỵ Mùi Hợi; bình Sửu Mão Dậu)
- **[QUAN-TP-01]** (a) Thiên Phủ tại Tỵ, Hợi: công danh bền vững nhưng không ồn ào. Tử Phủ, Liêm Phủ, Vũ Phủ: công danh hiển hách, phú quý; Vũ Phủ thiên về tài chính, kinh tế. TT: Thiên Phủ nhập miếu văn võ đều cát, không gặp sát tinh và hao tinh thì toàn mỹ — *Nguồn: TB (tr. 160, §8.7); TT (卷二·九官祿: 天府「入廟文武皆吉，無羊陀火鈴空耗全美，紫微同文武聲名，廉貞武曲同權貴」); KL (Thiên phủ — Tài, Điền, Quan: "thường tất tốt, đặc biệt ở Tỵ, Hợi")*
- **[QUAN-TP-02]** (b) Thiên Phủ tại Sửu, Mùi, Mão, Dậu (bình/đắc): thành công trong kinh doanh; nếu có chức danh thì cũng chỉ một thời gian. Gặp Không Kiếp: bình thường — *Nguồn: TB (tr. 160, §8.7); TT (卷二·九官祿: 「見空劫平常」)*
- **[QUAN-TP-03]** Thiên hướng và phong cách: ổn định, thận trọng, giỏi giữ và quản lý tài sản, nguồn lực. Hợp tổ chức lớn, quản trị hành chính, tài chính, quản lý tài sản, ngân hàng. Không hợp môi trường quá mạo hiểm — *Nguồn: KL (Thiên phủ: "có tài tổ chức, có thể giầu có, bình yên và vững vàng"); TT (卷一·問天府: 「職掌財帛、田宅、衣祿之神」)*

#### Thái Âm (miếu Dậu Tuất Hợi; vượng Tý Thân; đắc Sửu Mùi; hãm Dần Mão Thìn Tỵ Ngọ)
- **[QUAN-TA-01]** (a) Thái Âm tại Dậu, Hợi (miếu): công danh sớm đạt, văn võ kiêm toàn. Tại Tuất: cũng vậy nhưng dễ bị ghen ghét, có khi phải làm việc không hợp chí hướng. TT: Thái Âm nhập miếu nhiều quý; gặp Thái Dương, Xương Khúc, Tả Hữu thì địa vị cao — *Nguồn: TB (tr. 160, §8.8); TT (卷二·九官祿: 太陰「入廟多貴…會太陽昌曲左右三品之貴」)*
- **[QUAN-TA-02]** (b) Thái Âm tại Thìn, Tỵ (hãm): đường công danh nhiều trở ngại, tuổi trẻ vất vả, lớn tuổi mới toại ý, vẫn được kính trọng vì đức độ và văn tài. Tại Mão: công danh muộn, giỏi ăn nói, văn chương. TT: hãm thì "khí cao", dễ phá, khó hiển đạt — *Nguồn: TB (tr. 160, §8.8); TT (卷二·九官祿: 「陷地氣高橫破難顯達」)*
- **[QUAN-TA-03]** Đồng Âm tại Tý: hiển hách, giỏi góp ý cấp trên; tại Ngọ: nên làm kỹ thuật hoặc kinh doanh. Cơ Âm: nên theo khoa học, sư phạm, buôn bán cũng thuận. TT: Cơ Âm tiến thân trong chốn bận rộn, ở vị trí thừa hành — *Nguồn: TB (tr. 160–161, §8.8); TT (卷二·九官祿: 「天同同文武皆宜，天機同鬧中進身吏員立腳」)*
- **[QUAN-TA-04]** Thiên hướng và phong cách: tinh tế, chu đáo, kiên nhẫn, có khiếu thẩm mỹ, văn chương. Hợp nghề sáng tạo nội dung, thiết kế, giáo dục, chăm sóc, tài chính cá nhân, bất động sản. Hợp môi trường ổn định, tôn trọng sự tỉ mỉ — *Nguồn: KL (Thái âm: "sao chủ về tiền bạc, nhà đất … có khiếu văn chương, mỹ thuật"); TB (tr. 160, §8.8)*

#### Tham Lang (miếu Sửu Mùi; vượng Thìn Tuất; đắc Dần Thân; hãm Tý Mão Tỵ Ngọ Dậu Hợi)
- **[QUAN-THL-01]** (a) Tham Lang tại Thìn, Tuất (vượng): hiển đạt ở ngành kỷ luật, kinh doanh cũng toại ý. Vũ Tham (Sửu Mùi): giàu nhờ kinh doanh, sau 30 tuổi mới thuận. TT: Tham Lang nhập miếu gặp Hỏa Linh thì nắm quyền lớn ở ngành kỷ luật; Tử Tham quyền quý không nhỏ — *Nguồn: TB (tr. 161, §8.9); TT (卷二·九官祿: 貪狼「入廟遇火鈴武職掌大權，紫微同文武之職權貴非小」)*
- **[QUAN-THL-02]** (b) Tham Lang tại Tý, Ngọ (hãm): chức vị nhỏ, lên xuống thất thường; nên giữ liêm chính, tránh cám dỗ quyền lợi *(sách gốc diễn đạt nặng, đã trung tính hóa)*. TT: hãm thì dễ thành "quan tham" — *Nguồn: TB (tr. 161, §8.9); TT (卷二·九官祿: 「陷宮貪污之官」); KL (Tham lang — Quan: "ở Tí Ngọ thì tham nhũng")*
- **[QUAN-THL-03]** Tham Lang tại Dần, Thân: chức vị nhỏ ở ngành kỷ luật, không thật toại nguyện, nhưng **buôn bán lại phát đạt**. Liêm Tham: nhiều trở ngại, nên tránh vị trí có quyền lợi nhạy cảm — *Nguồn: TB (tr. 161, §8.9); KL (Tham lang — Quan: "đồng cung với Liêm trinh thì quan nhỏ …")*
- **[QUAN-THL-04]** Thiên hướng và phong cách: năng động, giao tiếp giỏi, nhiều tham vọng, thích cái mới. Hợp kinh doanh, bán hàng, giải trí, nghệ thuật biểu diễn, ngoại giao, ngành dịch vụ. Cần kỷ luật cá nhân để không phân tán *(Nhận xét nhóm, tổng hợp TB, TT)* — *Nguồn: TB (tr. 161, §8.9; tr. 166, §8.36); TT (卷一·問貪狼: 「好高吟浮蕩」)*

#### Cự Môn (miếu Mão Dậu; vượng Tý Dần Ngọ; đắc Thân Hợi; hãm Sửu Thìn Tỵ Mùi Tuất)
- **[QUAN-CM-01]** (a) Cự Môn tại Tý, Ngọ (vượng): văn võ kiêm toàn, **làm thầy giáo cũng nổi tiếng**, nhiều tài, nhất là ăn nói và tổ chức, có mưu trí, phú quý bền, được kính nể. Tại Hợi: công danh sớm, nhưng không nên lên quá cao. TT: Cự nhập miếu quyền quý ở ngành kỷ luật, văn nhân thì không bền; Cơ Cự ở Mão cát mỹ — *Nguồn: TB (tr. 161, §8.10); TT (卷二·九官祿: 巨門「入廟武職權貴，文人不耐久…天機同在卯宮吉美，在酉宮雖美無始終」); KL (Cự môn — Quan: "tại Tí Ngọ: văn võ kiêm toàn")*
- **[QUAN-CM-02]** (b) Cự Môn tại Tỵ (hãm): công danh trắc trở, chức vị nhỏ. Tại Thìn, Tuất (hãm): trước nhỏ sau lớn, hay đổi việc, giỏi xét đoán, lý luận, ăn nói hùng hồn nhưng nhiều thị phi, dễ bị gièm pha. TT: hãm thì gặp nhiều điều hối tiếc, gặp sát tinh dễ mất vị trí — *Nguồn: TB (tr. 161, §8.10); TT (卷二·九官祿: 「陷宮遭悔吝，加羊陀火鈴空劫更不美，退宮卸職」); KL (Cự môn — Quan: "tại Tỵ công danh trắc trở; tại Thìn Tuất về sau mới phát")*
- **[QUAN-CM-03]** Thiên hướng và phong cách: **làm việc bằng lời nói và lập luận**. Hợp luật sư, thẩm phán, giáo viên, giảng viên, nhà báo, đàm phán, tư vấn, bán hàng tư vấn. Môi trường phù hợp: nơi tranh luận được tôn trọng. Cần chú ý cách nói để giảm thị phi — *Nguồn: KL (Cự môn: "là sao của các nhà hùng biện, luật sư, thẩm phán, thầy giáo"); TB (tr. 161, §8.10); WQ5 (Ju Men in Career palace)*

#### Thiên Tướng (miếu Dần Thân; vượng Tý Thìn Ngọ Tuất; đắc Sửu Tỵ Mùi Hợi; hãm Mão Dậu)
- **[QUAN-TT-01]** (a) Thiên Tướng tại Sửu, Mùi: công danh nhẹ bước, văn võ kiêm toàn. Tại Tỵ, Hợi: không rực rỡ bằng nhưng vẫn toại ý, nên theo **kỹ thuật hoặc mỹ thuật**. TT: Thiên Tướng nhập miếu văn võ đều hợp, bổng lộc dồi dào; Thiên Tướng ở Quan Lộc thì hiển vinh — *Nguồn: TB (tr. 162, §8.11); TT (卷二·九官祿: 天相「入廟文武皆宜食祿千鍾」; 卷一·問天相: 「官祿得之則顯榮」); KL (Thiên tướng — Quan: "đi với Tử, Liêm, Vũ ở Sửu Mùi … thịnh đạt về văn và võ nghiệp")*
- **[QUAN-TT-02]** (b) Thiên Tướng tại Mão, Dậu (hãm): chức vị nhỏ, lên xuống thất thường. TT: hãm thì có thành có bại; gặp sát tinh dễ bị giáng chức — *Nguồn: TB (tr. 162, §8.11); TT (卷二·九官祿: 「陷地成敗…加羊陀火鈴空劫有貶謫」)*
- **[QUAN-TT-03]** Tử Tướng: giỏi tổ chức, có thể vượt quyền cấp trên. Liêm Tướng: giàu sang, được nể. Vũ Tướng: làm chức vụ cũng toại, kinh doanh cũng sớm giàu. TT: Vũ Tướng hợp chức ở vùng biên, nơi xa; Liêm Tướng quyền quý nổi bật — *Nguồn: TB (tr. 162, §8.11); TT (卷二·九官祿: 「武曲同邊夷之職，廉貞同崢嶸權貴」)*
- **[QUAN-TT-04]** Thiên hướng và phong cách: người điều phối, "phó tướng" đáng tin, công bằng, giữ chuẩn mực. Hợp hành chính, nhân sự, pháp chế, thư ký điều hành, ngoại giao, quản lý dự án. TT gọi Thiên Tướng là sao "ấn", "quan lộc văn tinh" — *Nguồn: TT (卷一·問天相: 「化氣曰印，是為官祿文星，佐帝之位」); WQ5 (Tian Xiang in Career palace: cố vấn cấp cao, ngoại giao, người thứ hai)*

#### Thiên Lương (miếu Thìn Ngọ Tuất; vượng Dần Mão Thân; đắc Tý Sửu Mùi; hãm Tỵ Dậu Hợi)
- **[QUAN-TL-01]** (a) Thiên Lương tại Tý, Ngọ: công danh hoạnh đạt, văn võ kiêm toàn, nhưng văn chức hiển hách hơn võ chức, danh tiếng lớn. TT: Thiên Lương miếu ở Ngọ gặp Tả Hữu Khôi Việt là người tài văn võ — *Nguồn: TB (tr. 162, §8.12); TT (卷二·九官祿: 天梁「廟午會左右魁鉞，文武之材」); KL (Thiên lương — Quan: "Lương Tí Ngọ … quí hiển")*
- **[QUAN-TL-02]** (b) Thiên Lương tại Tỵ, Hợi (hãm): phú quý như mây nổi, làm việc chóng chán, thích di chuyển; nên làm công việc lưu động. Gặp sát tinh: bình thường — *Nguồn: TB (tr. 162, §8.12); KL (Thiên lương — Quan: "Lương Tỵ Hợi: chóng chán, hay thay đổi"); TT (卷二·九官祿: 「加羊陀火鈴空劫平」)*
- **[QUAN-TL-03]** Thiên Lương tại Sửu, Mùi: bình thường, nên theo **y dược hoặc sư phạm**, buôn bán cũng thuận. Đồng Lương, Cơ Lương, Nhật Lương: xem QUAN-TD-01, QUAN-TCO-03, QUAN-TDU-03 — *Nguồn: TB (tr. 162, §8.12); KL (Thiên lương — Quan: "có tài sư phạm, chính trị, chiến lược, có khiếu về Y Dược")*
- **[QUAN-TL-04]** Thiên hướng và phong cách: người che chở, hướng dẫn, nguyên tắc, thích giúp đỡ. Hợp y tế, giáo dục, tư vấn, công tác xã hội, bảo hiểm, thanh tra, chính sách. Môi trường hợp: nơi đề cao đạo đức nghề nghiệp — *Nguồn: TT (卷一·問天梁: 「司壽化氣為蔭…循直無私，臨事果決」); TB (tr. 162, §8.12)*

#### Thất Sát (miếu Tý Dần Ngọ Thân; vượng Tỵ; đắc Sửu Mùi; hãm Mão Thìn Dậu Tuất Hợi)
- **[QUAN-TS-01]** (a) Thất Sát tại Dần, Thân: văn võ kiêm toàn, **thành công trong việc khó**, càng vượt nhiều trở ngại càng hiển đạt, uy quyền lớn. Tại Tý, Ngọ: hiển đạt nhưng kém hơn, may rủi đi liền. TT: Thất Sát miếu vượng thì võ chức nổi bật, quyền quý không nhỏ; ở Quan Lộc đắc địa thì "hóa họa thành phúc" — *Nguồn: TB (tr. 162, §8.13); TT (卷二·九官祿: 七殺「廟旺武職崢嶸權貴非小，不宜文人」; 卷一·問七殺: 「在官祿得地，化禍為祥」); KL (Thất sát — Quan: "triều đẩu ở Dần Thân, ngưỡng đẩu ở Tí Ngọ thì rất đẹp, văn võ kiêm toàn, uy quyền lớn, nhưng may rủi liền nhau")*
- **[QUAN-TS-02]** (b) Thất Sát tại Thìn, Tuất (hãm): xuất thân từ ngành kỷ luật nhưng không lâu bền; công việc có rủi ro cao về an toàn nên cần quy trình bảo hộ *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TB (tr. 163, §8.13); KL (Thất sát — Quan)* 
- **[QUAN-TS-03]** Tử Sát: có uy quyền, hợp ngành kỷ luật. Vũ Sát: hiển đạt, hay công tác xa, lên xuống thất thường. Liêm Sát: lên nhanh xuống nhanh; làm kinh doanh, kỹ thuật thì yên hơn. TT: Vũ Sát quyền quý; Liêm Sát công danh hiển đạt — *Nguồn: TB (tr. 163, §8.13); TT (卷二·九官祿: 「武曲同權貴，廉貞同功名顯達」); KL (Thất sát — Quan: "Sát Liêm, Sát Vũ hiển đạt binh nghiệp nhưng thăng giáng thất thường")*
- **[QUAN-TS-04]** Thiên hướng và phong cách: quyết đoán, chịu áp lực, thích thử thách, làm việc độc lập. Hợp khởi nghiệp, quân đội/công an, phẫu thuật, xây dựng, xử lý khủng hoảng, bán hàng chỉ tiêu cao. TT: không hợp công việc văn phòng thuần túy — *Nguồn: TT (卷二·九官祿: 「不宜文人」); WQ5 (Qi Sha in Career palace: nhà sáng lập, sĩ quan, bác sĩ phẫu thuật)*

#### Phá Quân (miếu Tý Ngọ; vượng Sửu Thìn Mùi Tuất; hãm Dần Mão Tỵ Thân Dậu Hợi)
- **[QUAN-PQ-01]** (a) Phá Quân tại Tý, Ngọ (miếu): hiển đạt nhưng lên xuống thất thường, lập nghiệp trong thời biến động; giỏi việc khó và nguy hiểm, nhiều mưu trí, dũng mãnh. Tại Thìn, Tuất (vượng): thành công, có uy quyền, mưu trí, hay lấn quyền cấp trên, buôn bán cũng phát. TT: Phá Quân miếu vượng thì võ chức nổi bật — *Nguồn: TB (tr. 163, §8.14); TT (卷二·九官祿: 破軍「廟旺武職軒勝」); KL (Phá quân — Quan lộc: "Ở Thìn Tuất: văn võ kiêm toàn, có uy quyền")*
- **[QUAN-PQ-02]** (b) Phá Quân tại Dần, Thân (hãm): công danh trắc trở, chức vị nhỏ, giàu sang cũng không bền; nên kinh doanh hoặc làm kỹ thuật. TT 卷一: Phá Quân ở Quan Lộc chủ thanh bần (nói chung) — *Nguồn: TB (tr. 163, §8.14); TT (卷一·問破軍: 「在官祿主清貧」); KL (Phá quân — Quan lộc: "Ở Dần Thân … chậm lên chức, buôn bán, hay làm kỹ nghệ thì khéo tay")*
- **[QUAN-PQ-03]** Tử Phá: thành công nhưng thất thường; đi buôn cũng phát. Liêm Phá: nên làm kỹ thuật, thương mại; TT nói văn nhân không bền, làm thừa hành lại tốt. Vũ Phá: đi đường kỷ luật vất vả, kinh doanh toại ý; TT nói Vũ Phá thêm Quyền Lộc, Xương Khúc thì hiển đạt — *Nguồn: TB (tr. 163, §8.14); TT (卷二·九官祿: 「武曲同加權祿，文昌文曲顯達…紫微同宮名振揚，廉貞同文人不耐久，胥吏最美」)*
- **[QUAN-PQ-04]** Thiên hướng và phong cách: người phá cũ lập mới, hợp tái cấu trúc, khởi nghiệp, kỹ thuật thực hành, xây dựng, kinh doanh nhiều biến động. Phong cách: làm nhanh, dám thay đổi, không thích lề lối. Nên có đối tác giữ ổn định *(Nhận xét nhóm, tổng hợp TB, TT)* — *Nguồn: TB (tr. 163, §8.14); TT (卷二·九官祿)*

### 9.3. Bộ sao phụ quan trọng (SP)
- **[QUAN-SP-01]** Xương, Khúc ở Quan Lộc: công danh hiển đạt, văn tài lỗi lạc. TT: Văn Xương nhập miếu cùng Thái Dương, Khoa Quyền Lộc là người tài văn võ; Văn Khúc miếu vượng văn võ đều hợp — *Nguồn: TB (tr. 164, §8.15); TT (卷二·九官祿: 文昌「入廟太陽同加吉科權祿，文武之材」, 文曲「廟旺文武皆宜」)*
- **[QUAN-SP-02]** Khôi, Việt: có chức danh lớn; gặp nhiều sao tốt thì nắm đầu mối việc lớn, quản lý nhiều người — *Nguồn: TB (tr. 164, §8.16); TT (卷二·九官祿: 紫微「廟旺遇左右昌曲魁鉞…」 cùng nhóm cát tinh)*
- **[QUAN-SP-03]** Tả, Hữu: được nhiều người nâng đỡ trên đường công danh. TT: Tả Phù nhập miếu tài văn võ, hợp nhất là ngành kỷ luật; Hữu Bật hợp võ chức, gặp Tử Phủ Xương Khúc thì tài quan song mỹ — *Nguồn: TB (tr. 164, §8.17); TT (卷二·九官祿: 左輔「入廟文武之材，武職最旺」, 右弼「與紫府昌曲同，財官雙美」)*
- **[QUAN-SP-04]** Lộc Tồn: có chức danh và tiền bạc, có tài tổ chức. TT: Lộc Tồn gặp cát tinh văn võ đều tốt, tài quan song mỹ — *Nguồn: TB (tr. 164, §8.18); TT (卷二·九官祿: 祿存「會吉文武皆良，財官雙美」)*
- **[QUAN-SP-05]** Thiên Mã: công danh hiển đạt, nên làm việc lưu động, có tài tổ chức và thao lược. Lộc Mã: chức danh khá lớn, tài lộc tăng dần, giỏi kinh doanh, hợp công việc di chuyển — *Nguồn: TB (tr. 165, §8.22, §8.30); TT (卷一·問紫微: 「天相祿馬交馳，不落空亡，更坐生鄉，可為貴論」)*
- **[QUAN-SP-06]** Kình Dương: TT cho rằng nhập miếu thì lợi nhất cho ngành kỷ luật, gặp cát tinh quyền quý, hãm thì chỉ hư danh. TB: Kình gặp Lực Sĩ thì công danh trắc trở, có công khó được ghi nhận. Kình ở Tứ Mộ gặp Mã: công tác nơi xa, vất vả — *Nguồn: TT (卷二·九官祿: 擎羊「入廟最利武職…陷地平常，虛名而已」); TB (tr. 165–166, §8.32, §8.33)*
- **[QUAN-SP-07]** Đà La: độc thủ thì bình thường, gặp cát tinh cũng chỉ hư danh. Hỏa Tinh: muộn mới toại công danh, sớm có thành có bại; gặp Tử Vi, Tham Lang thì tốt. Linh Tinh độc thủ ở cung vượng thì tốt — *Nguồn: TT (卷二·九官祿: 陀羅「獨守平常」, 火星「晚年功名遂心，早年成敗，會紫微貪狼吉」, 鈴星「獨守旺宮吉」); TB (tr. 163–164, §8.14 "Sát tinh")*
- **[QUAN-SP-08]** Sát tinh (Kình Đà Hỏa Linh Không Kiếp) ở Quan Lộc kết hợp chính tinh Mệnh, theo bảng của TB: Mệnh nhóm Sát Phá Liêm Tham sáng gặp sát tinh sáng ở Quan thì hoạnh phát ở ngành kỷ luật, thời biến động nhưng không bền; Mệnh nhóm Tử Phủ Cự Nhật Cơ Nguyệt Đồng Lương gặp sát tinh ở Quan thì công danh trắc trở, dễ có hư danh — *Nguồn: TB (tr. 163–164, §8.14); KL (Bàn về Hung, Sát tinh ngộ chế: Mệnh Sát Phá Tham gặp Kình Đà Không Kiếp Hỏa Linh "lại là dịp đi lên", Mệnh Tử Phủ Vũ Tướng gặp thì "đi xuống") (bản quét, đã đọc); KL áp dụng cho cung vận, cùng nguyên lý*
- **[QUAN-SP-09]** Khốc, Hư: hay suy xét, lý luận. Sáng sủa: ăn nói hoạt bát, hùng hồn, được kính phục; tuổi trẻ trở ngại, đứng tuổi mới toại; nên theo pháp lý hoặc chính trị — *Nguồn: TB (tr. 165, §8.21); KL (mục Khốc Hư: ở Tí Ngọ "có văn tài, có chí lớn nhất là tài hùng biện"; "tiên trở hậu thành") (bản quét, đã đọc); KL nói chung, không riêng cung Quan*
- **[QUAN-SP-10]** Thái Tuế, Bạch Hổ, Quan Phù gặp Xương Khúc: hùng biện, giỏi lý luận, văn chương; hợp pháp lý, chính trị, kinh tế — *Nguồn: TB (tr. 166, §8.34); KL (Thái tuế ở các cung — Quan, Tài: "Làm luật sư, giáo sư, chính khách") (bản quét, đã đọc)*
- **[QUAN-SP-11]** Xương Khúc, Tấu Thư, Long Trì, Phượng Các: có khiếu âm nhạc và các bộ môn văn nghệ. Hồng, Đào, Riêu, Tấu gặp Cơ hoặc Vũ: hợp nghệ thuật biểu diễn (múa, hát, kịch) — *Nguồn: TB (tr. 166, §8.35, §8.36); KL (Xương Khúc: "đi với Thái tuế, Tấu thư, Long trì, Phượng các thì… ca kịch sĩ và nhạc sĩ") (bản quét, đã đọc)*
- **[QUAN-SP-12]** Bạch Hổ, Tấu Thư đồng cung: có khiếu văn chương, **học ngoại ngữ nhanh**, cầu danh dễ — *Nguồn: TB (tr. 166, §8.39); KL chỉ nói Bạch Hổ chủ "lý luận", Tấu Thư "nói năng thuyết phục"; không thấy ý học ngoại ngữ (bản quét, đã đọc)* ⚑1nguồn
- **[QUAN-SP-13]** Hình, Riêu, Thiên Y: làm thầy thuốc hoặc báo chí. Mã, Hỏa, Linh: hợp cơ khí, vận tải. Binh, Hình, Tướng, Ấn: có chức trong ngành kỷ luật nhưng chuyên việc văn phòng — *Nguồn: TB (tr. 166, §8.38, §8.40, §8.41); KL (Thiên y — Mệnh: "Cùng Tướng, Y, Hình: bác sĩ phẫu thuật"; Tướng quân: "Tướng Ấn Binh Hình: quyền chức võ nghiệp") (bản quét, đã đọc); KL không nói vế "chuyên việc văn phòng"*
- **[QUAN-SP-14]** Tam Thai, Bát Tọa (TB ghi tắt "Thai, Tọa"; không phải sao Thai vòng Tràng Sinh), Đào, Hồng: công danh sớm, mưu sự nhanh thành. Đào Hoa cư Quan: tuổi trẻ đã có vị trí — *Nguồn: TB (tr. 166, §8.42); KL (tr. 130, phú: "Đào hoa cư Quan, tảo tuế đắc quan hành chính"); TB (phần an sao, §8.12: "Bộ sao Thai Tọa (Tam Thai, Bát Tọa)") (bản quét, đã đọc); NL cũng gọi "Thai Toạ" là bộ phụ tinh "trong quĩ đạo Tả Hữu Xương Khúc" (Chính không bằng chiếu, chiếu không bằng giáp) (bản quét, đã đọc)*

### 9.4. Cách cục chính (CC)
- **[QUAN-CC-01]** Vô chính diệu: lấy chính tinh xung chiếu (cung Phu Thê) mà luận. Quan Lộc vô chính diệu thì dù có nhiều sao tốt chiếu cũng không toàn mỹ, công danh khó hiển đạt, chức vị bình thường. Có hai ngoại lệ: (1) Tuần/Triệt án ngữ: lúc đầu trở ngại, về sau vẫn hiển đạt, nhưng dễ lên nhanh xuống nhanh; (2) Nhật Nguyệt cùng sáng xung chiếu hoặc hợp chiếu: công danh rực rỡ, nên theo chính trị, kinh tế, có thêm Tuần/Triệt thì càng tốt — *Nguồn: TB (tr. 166–167, §8.45); KL (phú tr. 131: "Nhật Nguyệt cư Quan lộc, phú quí nan danh")*
- **[QUAN-CC-02]** "Tử Phủ ở Quan Lộc": vừa giàu vừa sang — *Nguồn: TT (卷一·斗數發微論: 「官祿遇紫府，富而且貴」); TB (tr. 158, §8.1; tr. 160, §8.7)*
- **[QUAN-CC-03]** Thái Dương hội Văn Xương ở Quan Lộc: đỗ đạt cao, có vị trí ở triều đình (nay: vị trí cao trong tổ chức lớn, học vấn nổi bật) — *Nguồn: TT (卷一·太微賦: 「太陽會文昌於官祿，皇殿朝班，富貴全美」; 卷一·重補斗數彀率: 「太陽會文昌於官祿金殿傳臚」); TT (卷二·九官祿: 太陽 gặp 昌曲 thì quý)*
- **[QUAN-CC-04]** Nhật Nguyệt ở Quan Lộc: phú quý khó tả. Riêng Nhật Nguyệt đồng cung ở Sửu, Mùi gặp Hóa Kỵ thì công danh hoạnh đạt — *Nguồn: KL (tr. 131, phú "Nhật Nguyệt cư Quan lộc"); TB (tr. 164, §8.19)*
- **[QUAN-CC-05]** Thất Sát triều đẩu (Dần Thân) / ngưỡng đẩu (Tý Ngọ) ở Quan Lộc: uy quyền lớn, văn võ kiêm toàn, nhưng may rủi liền nhau. Thất Sát Dần Thân gặp Hóa Quyền đồng cung: chức vụ lớn, uy quyền hiển hách — *Nguồn: KL (Thất sát — Quan); TB (tr. 162, §8.13; tr. 165, §8.29); NL (mục lục: "Thất sát ngưỡng và triều đẩu", tr. 186)*
- **[QUAN-CC-06]** Cơ Nguyệt Đồng Lương ở Dần Thân Thìn Tuất gặp Xương Khúc, Tả Hữu: nên theo nghề **y**, dạy học cũng nổi tiếng. Có thêm Khoa, Quang, Quý, Thiên Quan, Thiên Phúc thì vinh hiển trong nghề y — *Nguồn: TB (tr. 165, §8.27, §8.28); KL (Thiên cơ — Quan: "Cơ Nguyệt Dần Thân có khiếu y dược"; Thiên lương — Quan: "có khiếu về Y Dược")*
- **[QUAN-CC-07]** Đồng, Âm, Kình đồng cung tại Ngọ: hiển đạt ở ngành kỷ luật, lập công nơi xa, nổi danh thời biến động — *Nguồn: TB (tr. 165, §8.25); KL (phú: "Đồng, Âm, Dương cư Ngọ vị, Bính Mậu trấn ngự biên cương") (bản quét, đã đọc); KL ghi cho Mệnh ở Ngọ, tuổi Bính Mậu*
- **[QUAN-CC-08]** Xương Khúc giáp Quan Lộc: thi cử đỗ cao. Long Phượng giáp Quan Lộc: có chức vị lớn (KL ghi riêng cho tuổi Thân) — *Nguồn: KL (tr. 131, phú: "Xương Khúc giáp Quan, Đình tác cao khoa"; "Long Phượng giáp quan, Thân cư cấm thất"); NL lại cho rằng trong các cách giáp Long Phượng, Tả Hữu, Xương Khúc "duy cách giáp Long Phượng chỉ gỡ gạc phần nào cho Mệnh" (Chính không bằng chiếu, chiếu không bằng giáp) (bản quét, đã đọc)* ⚑1nguồn
- **[QUAN-CC-09]** Kiếp, Hư, Hao, Quyền cùng hội Quan Lộc: đường công danh nhiều trở ngại, dễ bị người ghen ghét gièm pha. Nên làm việc có bằng chứng, lưu hồ sơ — *Nguồn: TB (tr. 165, §8.31); KL (Không Kiếp ở các cung — Quan: "Công danh kém", "Bị dèm pha") (bản quét, đã đọc); KL nói riêng Không Kiếp*
- **[QUAN-CC-10]** Lương, Phá Toái đồng cung (TB ghi "Lương, Phá" kèm chú thích Phá Toái/Phá Quân): hiển đạt ở ngành kỷ luật, dũng mãnh, hay làm việc mạo hiểm, về sau có uy quyền — *Nguồn: TB (tr. 166, §8.44); KL lại cho rằng Phá Toái "làm hao tán chính diệu", nhất là sao hiền như Thiên Lương (34. Phá toái) (bản quét, đã đọc)* ⚑1nguồn

### 9.5. Tứ hóa tại cung (HOA)
- **[QUAN-HOA-01]** Khoa, Quyền, Lộc ở Quan Lộc: tài lộc thêm dồi dào, uy quyền thêm hiển hách, chức danh thêm lớn — *Nguồn: TB (tr. 164, §8.20); TT (卷二·九官祿: 太陽, 武曲 gặp 科權祿 thì quý); WQ5 (Hua Lu/Quan/Ke in Career palace)*
- **[QUAN-HOA-02]** Hóa Lộc ở Quan Lộc: chính công việc là nguồn thu chính. Hóa Quyền: có quyền điều hành thực chất. Hóa Khoa: nổi danh nhờ chuyên môn, hợp học thuật, chuyên gia — *Nguồn: WQ5 (Hua Lu/Quan/Ke in Career palace); TB (tr. 164, §8.20)*
- **[QUAN-HOA-03]** Hóa Kỵ ở Quan Lộc: hay gặp chuyện phiền lòng, công danh trắc trở. Nhưng nếu gặp Nhật Nguyệt đồng cung tại Sửu, Mùi thì công danh hoạnh đạt — *Nguồn: TB (tr. 164, §8.19); WQ5 (Hua Ji in Career palace: sự nghiệp có biến cố, tái cấu trúc)*
- **[QUAN-HOA-04]** Thái Dương ở Quan Lộc hợp nhất khi hóa Lộc hoặc hóa quý (Khoa) — *Nguồn: TT (卷一·問太陽: 「後化貴化祿，最宜在官祿宮」); KL (Thái dương — Mệnh: "Thái dương đóng ở cung Quan là tốt nhất"; "Thái dương thích Xương, Khúc, Khoa, Quyền, Lộc") (bản quét, đã đọc)*

### 9.6. Điểm còn tranh luận (TRANH)
- **[QUAN-TRANH-01]** Thái Dương đơn thủ ở Quan Lộc: bản OCR TB §8.5 ghi "Đơn thủ tại Tý, Ngọ: công danh sớm đạt", rồi lại ghi "Đơn thủ tại Tý: công danh muộn màng", tự mâu thuẫn. Theo bảng độ sáng (Tý hãm, Tỵ Ngọ miếu), dòng đầu nhiều khả năng là "Tỵ, Ngọ". Đã luận theo hướng đó, cần đối chiếu bản in giấy — *Nguồn: TB (tr. 159); spec mục 6*
- **[QUAN-TRANH-02]** Thái Âm tại Mão (bảng: hãm) và Cự Môn tại Thìn Tuất (bảng: hãm): TB mô tả nhẹ hơn mức hãm ("muộn màng, có tài ăn nói", "trước nhỏ sau lớn"). Khi viết bài nên giữ mặt tích cực của TB, không viết là hãm nặng — *Nguồn: TB (tr. 160–161); spec mục 6*
- **[QUAN-TRANH-03]** Thiên Cơ tại Tý, Sửu (bảng: đắc): TB xếp chung với Hợi (hãm) là "muộn màng và chật vật". Bảng và TB không khớp — *Nguồn: TB (tr. 160); spec mục 6*
- **[QUAN-TRANH-04]** Kình Dương ở Quan Lộc: TT cho là lợi cho ngành kỷ luật khi nhập miếu. TB cho Kình gặp Lực Sĩ là trắc trở. Hai sách khác nhau về mức tốt xấu, cần xét độ sáng của Kình (đắc ở Thìn Tuất Sửu Mùi) — *Nguồn: TT (卷二·九官祿); TB (tr. 165–166)*
- **[QUAN-TRANH-05]** Phá Quân ở Quan Lộc: TT 卷一 nói chung "chủ thanh bần". TT 卷二 và TB lại cho Phá Quân miếu vượng hiển đạt. Đề xuất: theo độ sáng, câu của 卷一 chỉ áp dụng khi hãm — *Nguồn: TT (卷一·問破軍; 卷二·九官祿); TB (tr. 163)*
- **[QUAN-TRANH-06]** Sách cổ chia nghề theo "văn/võ" và nhiều câu nói về quan trường thời phong kiến. Bảng chuyển sang nghề hiện đại (QUAN-YN-06) là cách diễn giải của nhóm, cần chuyên gia duyệt trước khi dùng cho bài trả phí. Các mục TB về nghề tôn giáo, pháp sư (§8.37) và câu về tuổi thọ (§8.43) **không dùng**, vì ngoài phạm vi định hướng và có yếu tố mê tín — *Nguồn: TB (tr. 166)*
- **[QUAN-TRANH-07]** WQ5 có nhiều câu "classical commentary" bằng chữ Hán (vd 「紫微居官祿, 為官司之主」) mà nhóm **không tìm thấy** trong TT bản WQ2. Không được trích các câu này như nguyên văn sách cổ — *Nguồn: WQ5; TT (WQ2)*
- **[QUAN-TRANH-08]** Thất Sát đơn thủ ở Quan Lộc tại Tý, Ngọ so với Dần, Thân: TB xếp Tý Ngọ thấp hơn ("đều hiển đạt, nhưng không được rực rỡ như trên… may đi liền với rủi"), còn Dần Thân "thành công trong những việc thật khó khăn". KL không phân hơn kém: Thất Sát ở thế triều đẩu (Dần Thân) hay ngưỡng đẩu (Tý Ngọ) đều "rất đẹp, văn võ kiêm toàn, uy quyền lớn, nhưng may rủi liền nhau", và KL xếp cả bốn cung này vào miếu địa. Tức là ý "may rủi" TB chỉ gán cho Tý Ngọ, KL gán cho cả hai thế. Khi viết bài không nên hạ thấp Tý Ngọ so với Dần Thân; nêu tính thăng trầm chung *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TB (tr. 162, §8.13) (bản quét, đã đọc); KL (Thất sát ở các cung — Quan; phần miếu hãm: "Miếu địa Dần Thân (triều đẩu), Tí Ngọ (ngưỡng đẩu)") (bản quét, đã đọc)*

---

## 10. Cung Điền Trạch

### 10.1. Ý nghĩa cung (YN)

- **[DIEN-YN-01]** Điền Trạch luận về nhà ở, đất đai, bất động sản, tài sản tích lũy lâu dài, việc giữ hay tự tạo cơ nghiệp gia đình, và không khí nơi ở. — *Nguồn: TT (卷二 十田宅, các câu "得祖業 / 自置 / 退祖" xoay quanh tổ nghiệp và tự tậu); WD7; WD13*
- **[DIEN-YN-02]** Sao chủ cung Điền Trạch là **Thái Âm** (TT: "太陰…為田宅主"); **Thiên Phủ** và **Vũ Khúc** cũng được xem là sao quản tài sản, nhà đất. — *Nguồn: TT (卷一 諸星問答論 — Thái Âm, Thiên Phủ "職掌財帛田宅", Vũ Khúc "財帛田宅為專司之所"); WD7*
- **[DIEN-YN-03]** Ngôn ngữ luận chính của sách cổ ở cung này là ba trục: có được hưởng nền tảng gia đình (tổ nghiệp) không, có tự tạo dựng được không, và tạo dựng sớm hay muộn ("先無後有", "晚置"). Bài luận nên diễn đạt theo các trục này thay vì phán "có/không có nhà". *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: TT (卷二 十田宅); WD4*
- **[DIEN-YN-04]** Tam hợp của Điền Trạch là **Tật Ách** và **Huynh Đệ**; cung xung chiếu là **Tử Tức**. Cần xét sao ở ba cung này khi luận Điền Trạch. — *Nguồn: spec 2.4 (suy ra từ thứ tự cung); WD7 (xét tam hợp, xung chiếu); NL (Giây liên lạc Bào với Nô: "Tử và Điền chỉ cần cân nhắc bên nào nặng nhẹ, cung nào khắc cung nào") (bản quét, đã đọc); NL xác nhận cặp đối xung Tử–Điền, vế tam hợp vẫn suy từ thứ tự cung*

### 10.2. 14 chính tinh tại Điền Trạch

#### Tử Vi
- **[DIEN-TV-01]** Tử Vi miếu/vượng (Dần, Thìn, Tỵ, Ngọ, Thân, Tuất): nhà đất thịnh, có khả năng tự tậu và mở rộng; gặp Lộc Tồn/Hóa Lộc càng tốt. — *Nguồn: TT (卷二 十田宅: "紫微茂盛自置旺相"); WD7; WD13*
- **[DIEN-TV-02]** Tử Vi bình hòa (Tý, Mão, Dậu, Hợi; bảng spec không có ô hãm) hoặc gặp Kình, Đà, Hỏa, Linh, Không, Kiếp: nhà đất có lúc tậu được, có lúc phải chuyển nhượng; nên tích lũy thận trọng, tránh mua bán dồn dập. — *Nguồn: TT ("加羊陀火鈴空劫，有置有去"); WD7 ("bình hòa: tài sản vừa phải"; "gặp Không Kiếp Kình: hay dời đổi")*
- **[DIEN-TV-03]** Tử Vi đồng cung Thiên Phủ (Dần, Thân): rất tốt cho nhà đất, giữ được nền cũ và tự tậu thêm. — *Nguồn: TT (Thiên Phủ: "紫微同大富"); WD10 (Dần/Thân gặp Thiên Phủ: có phúc tổ tiên); WD13*
- **[DIEN-TV-04]** Tử Vi đồng cung Phá Quân: khó giữ nền cũ, dễ thay đổi nơi ở, cơ nghiệp chủ yếu tự tạo. Đồng cung Thiên Tướng: có sẵn cơ nghiệp, nhất là được Tả Hữu, Xương Khúc. — *Nguồn: TT ("破軍同退祖，天相同有見成家業，得左右昌曲"); WD13 (đồng Phá Quân thì khó giữ)*

#### Liêm Trinh
- **[DIEN-LT-01]** Liêm Trinh miếu/vượng (Tý, Dần, Thìn, Ngọ, Thân, Tuất): xu hướng tự tay gây dựng nhà cửa, thích không gian có thẩm mỹ. — *Nguồn: WD10 (miếu: tự tay gây dựng gia sản); WD7 (miếu vượng: nhà đẹp)*
- **[DIEN-LT-02]** Liêm Trinh hãm (Mão, Tỵ, Dậu, Hợi), nhất là gặp Hóa Kỵ hoặc sát tinh: nền tảng gia đình khó giữ nguyên vẹn, dễ phát sinh vướng mắc giấy tờ, tranh chấp nhà đất; nên làm thủ tục pháp lý kỹ. *(sách gốc diễn đạt nặng "phá tổ", đã trung tính hóa)* — *Nguồn: TT ("廉貞破祖"); WD7 (hãm gặp Kỵ, sát: tranh chấp, giấy tờ); WD13*
- **[DIEN-LT-03]** Liêm Trinh đồng Thiên Phủ: giữ được cơ nghiệp có sẵn; đồng Thiên Tướng: trước chưa có, sau mới có; đồng Thất Sát: tự tậu; đồng Tham Lang: có nền gia đình nhưng không bền, cần giữ gìn. — *Nguồn: TT ("天府同守見成家業，天相同先無後有，七殺同自置，貪狼同有祖業不耐久"); WD13 (đồng Thiên Phủ mới giữ được tổ nghiệp)*

#### Thiên Đồng
- **[DIEN-TD-01]** Thiên Đồng miếu/vượng/đắc (Tý, Dần, Mão, Tỵ, Thân, Hợi): thường trước ít sau nhiều, tự gây dựng là chính và về sau khá vững. — *Nguồn: TT ("天同先少後多，自置甚旺"); WD10 (miếu: tự lập, hậu vận ổn); WD4 ("Đồng: Sau giàu")*
- **[DIEN-TD-02]** Thiên Đồng hãm (Sửu, Thìn, Ngọ, Mùi, Dậu, Tuất), gặp Kình Đà, Không Kiếp, Hóa Kỵ: nhà đất đến muộn, dễ phải chuyển chỗ ở; nên ưu tiên ổn định chỗ ở trước rồi mới đầu tư. *(sách gốc nói "全無", đã trung tính hóa)* — *Nguồn: TT ("加羊陀火鈴空忌全無"); WD10 (hãm + sát: trung niên mới có nhà); WD7 (hãm + Kình Đà Kiếp: hay dời đổi)*
- **[DIEN-TD-03]** Thiên Đồng đồng Thái Âm ở Tý (cả hai sáng): rất tốt cho tài sản nhà đất; đồng Cự Môn: nhà đất ít, không nên vội mua thêm; đồng Thiên Lương: trước hao sau tăng. — *Nguồn: TT ("太陰同入廟大富，巨門同田少，天梁同先退後進"); WD10 (Tý tốt hơn Ngọ); WD13 (đồng Cự Môn không nên mua thêm)*

#### Vũ Khúc
- **[DIEN-VK-01]** Vũ Khúc miếu/vượng, nhất là đơn thủ (Thìn, Tuất) hay ở vị trí sáng: dễ được hưởng nền tảng gia đình lớn, có thể có nhiều bất động sản, kể cả cho thuê. — *Nguồn: TT ("武曲單居旺地，得祖父大業"); WD7 (miếu: nhiều tài sản, cho thuê); WD13*
- **[DIEN-VK-02]** Vũ Khúc hãm (Tỵ, Hợi): trước có hao hụt rồi sau mới thành; nên tích lũy từng bước. — *Nguồn: TT ("陷地退後方成"); WD7 (hãm: có nhưng khó giữ)*
- **[DIEN-VK-03]** Vũ Khúc đồng Phá Quân hoặc gặp Đại Hao: tài sản nhà đất dễ biến động, có cũng khó lâu bền; cần kỷ luật tài chính, tránh vay đòn bẩy lớn. *(sách gốc nói "破蕩家產", đã trung tính hóa)* — *Nguồn: TT ("破軍大耗同破蕩家產，有也不耐久"); WD13 (gặp Phá Quân thì yếu); WD7*
- **[DIEN-VK-04]** Vũ Khúc đồng Thiên Phủ: giữ được cơ nghiệp có sẵn; đồng Tham Lang: tậu muộn (sau trung niên), gặp Hỏa/Linh thì rất tốt; đồng Thiên Tướng: trước hao sau có. — *Nguồn: TT ("天府同守見成家業，貪狼同晚置，見火鈴星同極美…天相同先見破後方有"); WD7 (đồng Tham Lang: tài sản tăng sau trung niên; gặp Hỏa Linh tăng)*

#### Thái Dương
- **[DIEN-TDU-01]** Thái Dương miếu/vượng (Dần, Mão, Thìn, Tỵ, Ngọ): có nền tảng gia đình, thời đầu thịnh rồi về sau bình ổn; nhà đất có nhưng hay thay đổi. — *Nguồn: TT ("太陽入廟得祖業，初旺未平"); TT (卷一 諸星問答論: Thái Dương vượng "居田宅則得祖父蔭澤"); WD13 (miếu: nhiều điền sản nhưng hay thay đổi)*
- **[DIEN-TDU-02]** Thái Dương hãm (Thân, Dậu, Tuất, Hợi, Tý), gặp sát tinh: khó giữ tài sản thừa hưởng, chủ yếu tự gây dựng; không nên kinh doanh địa ốc mạo hiểm. *(sách gốc nói "全無", đã trung tính hóa)* — *Nguồn: TT ("陷地逢羊陀火鈴空劫全無"); WD13 (lạc hãm: không nên kinh doanh địa ốc); WD7 (Tuất/Hợi/Tý: khó sở hữu nhà)*
- **[DIEN-TDU-03]** Thái Dương đồng Cự Môn ở Dần: nhà đất vượng; ở Thân: khó giữ nền cũ nhưng vẫn có tài sản. Đồng Thái Âm (Sửu, Mùi) gặp cát tinh: nhiều đất đai. — *Nguồn: TT ("巨門同在寅宮旺盛，在申宮退祖，不為無田產…太陰同加吉星田多"); WD10 (Cự Dương ở Dần tốt hơn Thân; Âm Dương Sửu Mùi thừa kế tốt)*

#### Thiên Cơ
- **[DIEN-TCO-01]** Thiên Cơ miếu/vượng (Mão, Thìn, Tỵ, Thân, Dậu, Tuất): xu hướng không giữ nhà cũ mà tự tạo nơi ở mới; nhà đất phát triển theo nỗ lực bản thân. — *Nguồn: TT ("天機退祖新創置"); WD13 (khó giữ nhà cha mẹ, có thể tự mua); WD7 (Dần/Thân, Mão/Dậu: phát triển tốt)*
- **[DIEN-TCO-02]** Thiên Cơ hãm (Dần, Hợi) gặp sát tinh hoặc Hóa Kỵ: hay chuyển dời chỗ ở, nơi ở dễ ồn ào; nên chọn nhà kỹ về môi trường xung quanh. — *Nguồn: WD7 (hãm gặp sát: nhiều biến động); WD13 (Hóa Kỵ hay chuyển dời; lạc hãm nhà ồn ào); WD10*
- **[DIEN-TCO-03]** Cơ Cự ở Mão: có ruộng vườn; ở Dậu: khó giữ tổ nghiệp, trước lớn sau nhỏ. Cơ Lương: tậu được, về già khá giả. Cơ Âm: tự tậu và vượng. — *Nguồn: TT ("巨門同在卯宮有田莊，在酉宮不守祖業，先大後小，天梁同有置晚年富，太陰同自置旺相"); WD4 ("Cơ, Cự ở … Mão, Dậu: có nhiều nhà, ruộng")*

#### Thiên Phủ
- **[DIEN-TP-01]** Thiên Phủ miếu/vượng/đắc: ruộng vườn tốt, vừa giữ được nền cũ vừa tự tậu thêm; là một trong những sao tốt nhất cho cung này. — *Nguồn: TT ("天府田園茂盛，守祖自置旺相"); WD4 ("Phủ ở Điền: Khá, hưởng gia tài"); WD13*
- **[DIEN-TP-02]** Thiên Phủ bình hòa (Sửu, Mão, Dậu; bảng spec không có ô hãm) hoặc gặp sát tinh, Không Kiếp, Tuần/Triệt: tài sản ít hơn, có thành có bại; cần quản lý giấy tờ và tránh tranh chấp. — *Nguồn: TT ("見羊陀火鈴空劫更少，有成敗"); WD4 ("Phủ gặp Thiên Không hay Địa Không: khó bền gia tài"; "Phủ Tuần, Triệt: xấu"); WD7 (bình hòa: mua được một ít)*
- **[DIEN-TP-03]** Thiên Phủ đồng Tử Vi: rất giàu về điền sản; đồng Liêm Trinh hoặc Vũ Khúc: giữ được tổ nghiệp và phát triển. — *Nguồn: TT ("紫微同大富，廉貞武曲同守祖業榮昌"); WD4 ("Phủ, Tử ngộ Tồn: có nhà đất, hưởng gia tài")*

#### Thái Âm
- **[DIEN-TA-01]** Thái Âm miếu/vượng (Tý, Thân, Dậu, Tuất, Hợi): nhiều nhà đất; đây là sao chủ của cung nên ảnh hưởng mạnh; gặp Tả Hữu, Hóa Quyền, Hóa Lộc, Lộc Tồn càng tốt. — *Nguồn: TT ("太陰入廟田多…同左右權祿及祿存主多田產"); WD4 ("Nhật, Nguyệt miếu: có nhiều nhà đất"); WD13*
- **[DIEN-TA-02]** Thái Âm hãm (Dần, Mão, Thìn, Tỵ, Ngọ), nhất là gặp Hóa Kỵ và sát tinh: tài sản lúc đầu tạm đủ, về sau dễ giảm; nên tích lũy đều, hạn chế đầu cơ. *(sách gốc nói "田全無", đã trung tính hóa)* — *Nguồn: TT ("陷地加忌及羊陀火鈴空劫田全無"); WD4 ("Nhật, Nguyệt hãm: tạm đủ, sau sa sút"); WD13 (hãm địa thì ít)*
- **[DIEN-TA-03]** Thái Âm đồng Thiên Cơ: tự tạo dựng; đồng Thiên Đồng: tay trắng tự tậu. — *Nguồn: TT ("天機同自創置，天同同白手自置"); WD7 (Dần/Thân: nhà ổn định)* 

#### Tham Lang
- **[DIEN-THL-01]** Tham Lang miếu/vượng (Sửu, Thìn, Mùi, Tuất; đắc Dần, Thân): có nền tảng gia đình nhưng giữa chừng có hao hụt, rồi tự tậu lại; gặp Tam hóa/Lộc thì có nhiều nhà đất. — *Nguồn: TT ("廟旺有祖業，也去中未自有置"); WD4 ("Tham, tam Hoá: có nhà đất"); WD13 (miếu địa thì có tổ nghiệp)*
- **[DIEN-THL-02]** Tham Lang hãm (Tý, Mão, Tỵ, Ngọ, Dậu, Hợi): khó giữ nền cũ, nhà đất ít và đến muộn; trước có vướng mắc rồi sau mới ổn. — *Nguồn: TT ("貪狼陷宮退祖一世田少"); WD4 ("Tham: bị kiện hết, sau lại thành"); WD13 (lạc hãm thì không có tổ nghiệp)*
- **[DIEN-THL-03]** Tham Lang gặp Hỏa Tinh hoặc Linh Tinh: giữ được tổ nghiệp và tự tạo thêm, nhưng sách lưu ý về an toàn cháy nổ trong nhà; nên chú ý phòng cháy, điện. *(sách gốc nói "恐火焚屋宅", đã trung tính hóa)* — *Nguồn: TT ("見火鈴星守祖業，有自創，但恐火焚屋宅"); WD13 (đồng Hỏa Linh: tự mua nhiều nhưng nhà hay hư hao); WD7*

#### Cự Môn
- **[DIEN-CM-01]** Cự Môn miếu/vượng (Tý, Dần, Mão, Ngọ, Dậu; đắc Thân, Hợi): có thể tậu được nhà đất một cách bất ngờ, nhanh; gặp Lộc thì tự mua được. — *Nguồn: TT ("巨門廟旺橫發置買"); WD13 (miếu địa gặp Lộc thì tự mua được); WD7 (Mão/Dậu: thành công về bất động sản)*
- **[DIEN-CM-02]** Cự Môn hãm (Sửu, Thìn, Tỵ, Mùi, Tuất): ít được chia phần, dễ vì nhà đất mà sinh thị phi; mua bán nên rõ ràng giấy tờ, tránh góp chung mơ hồ. — *Nguồn: TT ("陷地無分，因田產招非"); WD4 ("Cự môn ở cung không miếu, vượng: nhà cửa đổi bán luôn, hay bị kiện, sau mới thành"); WD13 (lạc hãm thì không nên mua thêm)*
- **[DIEN-CM-03]** Cự Môn đồng Thái Dương: trước chưa có, sau mới có. — *Nguồn: TT ("太陽同先無後有"); WD10 (Cự Dương ở Dần tốt hơn ở Thân)*

#### Thiên Tướng
- **[DIEN-TT-01]** Thiên Tướng miếu/vượng/đắc: có phần tài sản gia đình, nhà cửa ngăn nắp, có hậu thuẫn; trung niên thường ổn định chỗ ở. — *Nguồn: TT ("天相廟旺有分"); WD7 (miếu vượng: nhà nề nếp, gia đình hỗ trợ); WD13 (trung niên mới mua ổn định)*
- **[DIEN-TT-02]** Thiên Tướng hãm (Mão, Dậu): nhà đất ít lúc đầu, có thể mất rồi mua lại; gặp Không Kiếp, Đại Hao thì dễ hao hụt, nên tránh bảo lãnh, thế chấp rủi ro. — *Nguồn: WD7 (hãm: ít tài sản, mất rồi mua lại); WD10 (hãm: khó mua nhà đầu đời; Không Kiếp Hao: hao tài); WD13 (gặp Không Kiếp dễ phá)*
- **[DIEN-TT-03]** Thiên Tướng đồng Tử Vi: tự tậu được; đồng Vũ Khúc: ít được chia phần; đồng Liêm Trinh gặp sát tinh: nền tảng gia đình dễ phân tán. — *Nguồn: TT ("紫微同自置，武曲同無分，廉貞加羊陀火鈴空劫飄零祖業"); WD7*

#### Thiên Lương
- **[DIEN-TL-01]** Thiên Lương miếu/vượng (Dần, Mão, Thìn, Ngọ, Thân, Tuất): thường được hưởng nhà cửa từ gia đình. — *Nguồn: TT ("天梁入廟旺有祖業"); WD4 ("Lương: được Tổ để nhà cửa cho"); WD13*
- **[DIEN-TL-02]** Thiên Lương hãm (Tỵ, Dậu, Hợi), gặp Hỏa, Kiếp, Kình hoặc Thiên Mã: chỗ ở hay thay đổi, khó ổn định sớm. — *Nguồn: WD7 (hãm gặp Hỏa/Kiếp/Kình: bất ổn); WD13 (gặp Thiên Mã và Địa Kiếp: trôi dạt); WD10 (Dần/Thân gặp Thiên Mã: chuyển nhà)*
- **[DIEN-TL-03]** Thiên Lương đồng Thiên Đồng: trước khó sau dễ; đồng Thiên Cơ không gặp sát: cuối cùng vẫn có nhà đất. — *Nguồn: TT ("天同同先難後易，天機同不見羊陀火鈴空劫，終有田宅"); WD4 ("Đồng, Lương Dần, Thân: nhờ người thành giàu")*

#### Thất Sát
- **[DIEN-TS-01]** Thất Sát miếu/vượng/đắc (Tý, Sửu, Dần, Tỵ, Ngọ, Mùi, Thân): ít dựa vào nền cũ, tự lực gây dựng bằng ý chí, về sau ổn định. — *Nguồn: WD7 (Dần/Thân: không thừa kế, tự xây, về già ổn; mạnh gặp cát tinh: gây dựng bằng ý chí); WD13 (miếu địa có nhà đất tổ tiên); WD10 (miếu/đắc: thừa kế hoặc tự xây)*
- **[DIEN-TS-02]** Thất Sát hãm (Mão, Thìn, Dậu, Tuất, Hợi) hoặc gặp sát tinh, Không Kiếp: tài sản dễ biến động, "có mà như không"; nên giữ tài sản ở dạng an toàn, tránh quyết định nóng. — *Nguồn: WD13 (hãm địa: có mà như không); WD10 (hãm + Tứ Sát: khuynh bại; Không Kiếp: phá tán); WD7 (hãm hoặc gặp sát: hao)*
- **[DIEN-TS-03]** TT không có mục riêng cho Thất Sát ở Điền Trạch; chỉ nêu Thất Sát đồng Vũ Khúc ("lòng không mặn mà với nhà đất") và đồng Liêm Trinh ("tự tậu"). — *Nguồn: TT (卷二 十田宅: mục Vũ Khúc "七殺同心不欲", mục Liêm Trinh "七殺同自置"); WD10* 

#### Phá Quân
- **[DIEN-PQ-01]** Phá Quân miếu/vượng (Tý, Ngọ; vượng Sửu, Thìn, Mùi, Tuất): ở Tý Ngọ giữ được nền cũ và phát triển nhưng có lúc vào lúc ra; nhìn chung "trước phá sau thành", hợp sửa sang, cải tạo. — *Nguồn: TT (卷二: "破軍在子午宮守祖業榮昌，但見有進退"; 卷一: "田宅遇破軍，先破後成"); WD4 ("Phá Quân (miếu): trước không, sau thành"); WD7 (miếu vượng: cải tạo, đầu tư)*
- **[DIEN-PQ-02]** Phá Quân hãm (Dần, Mão, Tỵ, Thân, Dậu, Hợi) hoặc gặp Hao, Kỵ, sát tinh: nhà đất khó giữ, dễ bán đi; nên ưu tiên tài sản dễ quản lý, tránh mua bán theo cảm hứng. *(sách gốc nói "有也盡/全無", đã trung tính hóa)* — *Nguồn: TT ("加羊陀火鈴退祖田少…耗忌全無"); WD4 ("Phá Quân hãm: bán gia tài, có cũng hết"; "Hao, Phá Quân: chẳng có gì"); WD13 (lạc hãm thì phá dỡ nhà cũ)*
- **[DIEN-PQ-03]** Phá Quân đồng Tử Vi: có cơ nghiệp sẵn; đồng Liêm Trinh: trước hao sau tự tậu. — *Nguồn: TT ("紫微同有見成家業，廉貞同先破後有置"); WD4 ("Liêm, Phá: bán hết rồi lại thành")*

### 10.3. Bộ sao phụ quan trọng (SP)

- **[DIEN-SP-01]** Lộc Tồn ở Điền Trạch: ruộng vườn nhiều, tự tậu; gặp cát tinh thì giữ và phát triển nền cũ; gặp sát, Không Kiếp thì ít đi. Lộc Tồn là một trong ba cung quan trọng nhất của sao này (Mệnh, Điền, Tài). — *Nguồn: TT (卷二: "祿存田園多旺自置…"; 卷一: Lộc Tồn "十二宮中惟身命、田宅、財帛為要"); WD10 (Lộc Tồn: tài sản đất đai)*
- **[DIEN-SP-02]** Tả Phụ, Hữu Bật, Văn Xương, Văn Khúc, Khôi Việt hội cát: nhà cửa đẹp, dễ mua bán, được người giúp; gặp sát tinh thì có vào có ra. — *Nguồn: TT ("文昌會諸吉田園廣置…文曲旺地有分…左輔有祖業"); WD13 (Xương Khúc Tả Hữu Khôi Việt: nhà đẹp, dễ mua bán); WD10*
- **[DIEN-SP-03]** Kình Dương, Đà La: sách xếp Điền Trạch vào ba cung kỵ Kình Đà nhất. Kình "nhập miếu" (bảng spec: đắc ở Sửu, Thìn, Mùi, Tuất) thì trước hao sau thành; Đà thì vất vả tích lũy, gặp cát tinh trước không sau có. — *Nguồn: TT (卷一: Kình Đà "怕臨兄弟、田宅、父母三宮"; 卷二: "擎羊入廟先破後成…陀羅退祖辛勤度日"); WD4 ("Kình, Đà: trước có sau hết"); WD10*
- **[DIEN-SP-04]** Hỏa Tinh, Linh Tinh: ít dựa vào nền cũ; gặp cát tinh thì trước không sau có. Nhiều nguồn nhắc nên chú ý an toàn điện, lửa trong nhà. — *Nguồn: TT ("火星獨守退祖業，會吉星先無後有…鈴星…入廟加吉星自有置"); WD13 (Hỏa Linh dễ cháy nhà); WD10 (hỏa tai, điện)*
- **[DIEN-SP-05]** Địa Không, Địa Kiếp: nhà đất dễ biến động, mua nhanh bán nhanh; khi đi cùng sát tinh khác thì sách cổ đánh giá rất bất lợi cho việc giữ tài sản. — *Nguồn: TT (nhiều mục: "加…空劫…全無/有進有退"); WD13 (Kình Đà Không Kiếp: mua nhanh bán nhanh); WD10 (nhà thường biến động)*
- **[DIEN-SP-06]** Thiên Mã ở Điền Trạch: hay chuyển nhà, có thể có nhà đất xa quê. — *Nguồn: WD10 (chuyển nhà, di cư); WD13 (mua đất xa quê hoặc nước ngoài)*
- **[DIEN-SP-07]** Đại Hao, Tiểu Hao: hao hụt tài sản, đặc biệt khi đi cùng Phá Quân hoặc Vũ Khúc. — *Nguồn: TT (Vũ Khúc "破軍大耗同破蕩家產"); WD4 ("Hao, Phá Quân: chẳng có gì"); WD7*

### 10.4. Cách cục chính (CC)

- **[DIEN-CC-01]** **Nhật Nguyệt chiếu bích** (日月照璧): Thái Dương và Thái Âm ở/chiếu cung Điền Trạch, ưa ở mộ khố (Sửu, Mùi); thuộc nhóm cách giàu, chủ tích lũy nhà đất. — *Nguồn: TT (卷一 定富局: "日月照璧 日月臨田宅宮是也，喜居墓庫"); WD7 (Sửu/Mùi: tích lũy tài sản); WD13 (Nhật Nguyệt cùng sáng chiếu thì nhiều nhà đất)*
- **[DIEN-CC-02]** **Nguyệt sinh thương hải** (月生滄海): Thái Âm ở Tý thủ cung Điền Trạch (bảng spec: Thái Âm Tý vượng); chủ phúc lộc, tài sản thanh nhã. — *Nguồn: TT (卷一 定貴局: "月生滄海 月在子宮守田宅是也"); WD7 (Thái Âm Tý: thịnh vượng)*
- **[DIEN-CC-03]** **Tài ấm giáp ấn** (財蔭夾印): Thiên Tướng được Vũ Khúc và Thiên Lương giáp hai bên; sách ghi cách này áp dụng cho cả cung Điền Trạch. — *Nguồn: TT (卷一: "財蔭夾印 相守命武梁來夾是也，田宅宮亦然")* ⚑1nguồn
- **[DIEN-CC-04]** Tài Bạch và Điền Trạch có Tả Phụ, Hữu Bật, lại có Thái Âm, Vũ Khúc đồng độ, không gặp sát tinh: cách người quản lý tài chính, tài sản. — *Nguồn: TT (卷一: "財帛田宅有左右守衛，又與太陰武曲同度，不見惡星，必為財賦之官")* ⚑1nguồn
- **[DIEN-CC-05]** **Vô chính diệu**: thường ít hưởng nền cũ, tự gây dựng, hay thay đổi chỗ ở; tài sản riêng thường đến muộn. Có Tuần/Triệt án ngữ: đầu khó sau dễ. Nhật Nguyệt sáng hội chiếu: càng về sau càng thuận. Quy tắc chung: lấy chính tinh cung xung chiếu (Tử Tức) làm căn bản, trừ khi có Tuần/Triệt án ngữ. — *Nguồn: WD15 (Đặng Xuân Xuyến, dẫn *Tử Vi Chân Truyền*); WD13; WD7 (Nhật Nguyệt miếu vượng chiếu: tốt)*

### 10.5. Tứ hóa tại cung (HOA)

- **[DIEN-HOA-01]** Hóa Lộc nhập Điền Trạch: gia vận tốt, nhà đất sinh lời; một nguồn lưu ý dễ chuộng tiện nghi xa hoa. — *Nguồn: WD13; WD10; WD7 (Hóa Lộc: tài sản tăng)*
- **[DIEN-HOA-02]** Hóa Quyền: có nhiều bất động sản, nắm quyền quản lý tài sản gia đình; người trong nhà dễ tranh ý kiến. — *Nguồn: WD13; WD10 (uy tín, quản lý tài sản); WD7*
- **[DIEN-HOA-03]** Hóa Khoa: quản lý tài sản ngăn nắp, nhà cửa nề nếp, dễ giữ của; nơi ở có không khí văn hóa. — *Nguồn: WD13; WD10; WD7 (Khoa: tài sản ổn, có văn hóa)*
- **[DIEN-HOA-04]** Hóa Kỵ: dễ vướng thị phi, tranh chấp, giấy tờ về nhà đất; lần mua nhà đầu dễ trục trặc, nên kiểm tra pháp lý kỹ. — *Nguồn: TT (Thái Âm, Thiên Đồng "加…忌…全無"); WD13; WD10; WD7*

### 10.6. Điểm còn tranh luận (TRANH)

- **[DIEN-TRANH-01]** **Không Kiếp ở Điền Trạch**: TT luôn xếp Không Kiếp vào nhóm làm giảm hoặc mất tài sản; WD4 (KHHB 1973) lại có câu "Không, Kiếp miếu vượng: phát to". Mặc định của nhóm: theo TT, diễn đạt "biến động, mua nhanh bán nhanh"; ghi chú khả năng "phát mạnh rồi biến động". — *Nguồn: TT; WD4*
- **[DIEN-TRANH-02]** **Hóa Kỵ ở Điền Trạch**: TT và một số sách Việt coi là xấu (thị phi, hao); riêng KL (sách Việt) lại coi Kỵ ở Điền, Tài là "giữ được của". Một số trang theo hướng Tứ Hóa (PT) cho rằng Kỵ "giữ điền", tài sản khó bán nhưng cũng khó mất. Chưa có sách PT gốc để đối chiếu. — *Nguồn: WD10; WD13; PT (qua WD10, chưa đối chiếu sách); KL (phú: "Hóa ky Điền, Tài, phản vi giai luận", tức Kỵ ở Điền, Tài "lại là tốt vì giữ được của") (bản quét, đã đọc); KL là sách Việt theo hướng "giữ của", dù phần Hóa kỵ ở các cung của KL lại ghi Kỵ ở Tài "hao tán"*
- **[DIEN-TRANH-03]** **Cự Môn**: TT nói miếu vượng thì "hoành phát" mua nhà; WD13 lại nói Cự Môn nói chung "không nên có tổ nghiệp, có thì dễ tranh chấp". Mặc định: phân theo miếu/hãm như TT. — *Nguồn: TT; WD13*
- **[DIEN-TRANH-04]** **Thất Sát**: TT không có mục riêng ở Điền Trạch; quy tắc DIEN-TS-01/02 dựa trên các trang Việt (WD7, WD10, WD13) và không thống nhất (WD13 nói miếu thì có tổ nghiệp; WD7 nói Dần Thân không thừa kế). Cần chuyên gia hoặc bản in TB/NL xác nhận. — *Nguồn: TT; WD7; WD13*
- **[DIEN-TRANH-05]** **Thái Dương**: TT nói nhập miếu thì được tổ nghiệp; WD13 lại nói Thái Dương "không nên thủ" Điền Trạch, miếu địa cũng hay thay đổi. Hai ý có thể dung hòa ("có nhưng hay đổi" như TT "初旺未平"). — *Nguồn: TT; WD13*
- **[DIEN-TRANH-06]** Cách nói cổ "Tử Vi ở Điền: hà tiện, có của chôn" (WD4) mang tính hình ảnh; nhóm không dùng nguyên văn, chỉ diễn đạt "thiên về tích lũy, giữ của". *(Nhận xét nhóm, không phải quy tắc gốc)* — *Nguồn: WD4*

---

## 11. Cung Phúc Đức

Định hướng diễn đạt (bắt buộc cho bài luận): Phúc Đức = **nền tảng tinh thần, sự an vui nội tâm, cách hưởng thụ và nghỉ ngơi, gia phong, nề nếp và sự nâng đỡ của dòng họ**. Không luận mồ mả, âm phần, nghiệp báo, dù nhiều sách Việt có phần này (xem PHUC-TRANH-04).

### 11.1. Ý nghĩa cung (YN)

- **[PHUC-YN-01]** Phúc Đức luận về mức độ an nhàn hay lao tâm, khả năng hưởng thụ, đời sống tinh thần và sự nâng đỡ của gia đình, họ hàng. Ngôn ngữ chính của TT ở cung này là cặp "享福/安靜" (hưởng phúc, an tĩnh) đối với "勞心費力/不得寧靜" (lao tâm, không yên). — *Nguồn: TT (卷二 十一福德); WD6 (Tử Vi Đại Toàn: cát tinh miếu vượng thì an vui, hung tinh hãm thì phúc mỏng, vất vả); WD8*
- **[PHUC-YN-02]** Sao chủ cung Phúc Đức là **Thiên Đồng** (TT: "天同…為福德宮之主宰"). Hóa Lộc được gọi là "thần phúc đức". — *Nguồn: TT (卷一 諸星問答論 — Thiên Đồng; Hóa Lộc "祿為福德之神"); WD11 (Thiên Đồng ở Phúc: hưởng phúc khi đồng Thái Âm, Thiên Lương)* 
- **[PHUC-YN-03]** Phúc Đức được coi là cung rất quan trọng, có sức nâng đỡ hoặc kéo giảm các cung khác; TT dặn "trước hết xem Phúc Đức, rồi xét kỹ Thiên Di". — *Nguồn: TT (卷一: "第一先看福德，再三細考遷移"); WD14 (Phúc Đức ảnh hưởng 11 cung còn lại); WD8*
- **[PHUC-YN-04]** Cung xung chiếu của Phúc Đức là **Tài Bạch** (TT: "以福德宮對財帛宮"); tam hợp là **Thiên Di** và **Phu Thê**. Khi luận cách hưởng thụ cần xem cả cách kiếm tiền (Tài Bạch). — *Nguồn: TT (卷三: "四看福德宮權祿劫空廟陷，以福德宮對財帛宮也"); spec 2.4 (suy ra tam hợp); WD8 (xét cung đối Tài Bạch)*

### 11.2. 14 chính tinh tại Phúc Đức

#### Tử Vi
- **[PHUC-TV-01]** Tử Vi miếu/vượng/đắc: phúc dày, an vui, đời sống tinh thần vững; dễ gặp người nâng đỡ. — *Nguồn: TT ("紫微福厚享福安樂"); WD6 (miếu vượng: phúc thọ); WD8; WD11*
- **[PHUC-TV-02]** Tử Vi bình hòa (Tý, Mão, Dậu, Hợi) hoặc gặp Kình, Đà, Linh, Không, Kiếp, Hóa Kỵ: phúc mỏng hơn, hay lo nghĩ; nên chủ động tạo khoảng nghỉ ngơi, chia sẻ việc. — *Nguồn: TT ("加羊陀鈴空劫福薄"); WD6 (gặp sát, Không Kiếp, Kỵ: nhiều lo nghĩ); WD8 (hãm/bình gặp sát: lo nghĩ, phúc khí giảm)*
- **[PHUC-TV-03]** Tử Vi đồng Thiên Phủ hoặc Thiên Tướng: trọn đời tốt đẹp; đồng Phá Quân: lao tâm, khó yên. — *Nguồn: TT ("天府天相同終身獲吉，破軍同勞心費力不安"); WD11 (đồng Phủ/Tướng: cát tường; đồng Phá Quân: bất an); WD8 (đồng Thiên Tướng: sung túc)*

#### Liêm Trinh
- **[PHUC-LT-01]** Liêm Trinh miếu/vượng hoặc đơn thủ (Dần, Thân): "trong bận rộn mà sinh phúc" — người bận việc nhưng tìm được niềm vui từ công việc; có nề nếp. — *Nguồn: TT ("廉貞獨守忙中生福"); WD8 (miếu: phúc khí ổn, gia đạo có nề nếp); WD14 (đứng một mình trong hoang mang thì có phúc)*
- **[PHUC-LT-02]** Liêm Trinh hãm (Mão, Tỵ, Dậu, Hợi), nhất là đồng Phá Quân hoặc Tham Lang, gặp sát tinh: hay lao tâm, khó tĩnh; về cuối đời mới như ý. Nên tập thói quen nghỉ ngơi, giảm ôm việc. — *Nguồn: TT ("破軍同不守靜，勞心費力，再加羊陀火鈴勞苦終身，末年如意"; Tham Lang "廉貞同福薄"); WD6 (Liêm Trinh: bận rộn, lo âu); WD11 (đồng Phá Quân lao tâm; Mão Dậu cùng Phá Quân vất vả)*
- **[PHUC-LT-03]** Liêm Trinh đồng Thiên Tướng: có phúc thọ; đồng Thiên Phủ: an lạc không lo. — *Nguồn: TT ("天相同有福有壽，天府同安樂無憂"); WD11; WD8*

#### Thiên Đồng
- **[PHUC-TD-01]** Thiên Đồng miếu/vượng/đắc (Tý, Dần, Mão, Tỵ, Thân, Hợi): vui vẻ, biết hưởng thụ, tinh thần lạc quan; là sao chủ nên ở đây rất hợp. — *Nguồn: TT ("天同快樂有福有壽"); WD6 (miếu vượng: vui, có phúc); WD11 (Tý, Tỵ, Hợi tốt)*
- **[PHUC-TD-02]** Thiên Đồng hãm (Sửu, Thìn, Ngọ, Mùi, Dậu, Tuất) gặp Tứ sát, Không Kiếp: tinh thần dễ dao động, thiếu quyết đoán, đời sống nội tâm nhiều thăng trầm. — *Nguồn: WD6 (hãm gặp Tứ sát Không Kiếp: vất vả); WD8 (hãm: dao động, thiếu quyết đoán); WD11 (Dậu, Thìn, Tuất kém)*
- **[PHUC-TD-03]** Thiên Đồng đồng Cự Môn: nhiều lo ít vui; đồng Thái Âm: hưởng phúc; đồng Thiên Lương: thanh nhàn vui vẻ. — *Nguồn: TT ("巨門同多憂少喜，太陰同享福，天梁同清閒快樂"); WD11; WD8 (đồng Cự Môn: buồn phiền)*

#### Vũ Khúc
- **[PHUC-VK-01]** Vũ Khúc miếu/vượng: an nhàn hưởng phúc, có người gánh vác gia đạo. — *Nguồn: TT ("入廟安然享福"); WD11 (miếu vượng: an nhàn); WD6 (miếu vượng: an thọ); WD8*
- **[PHUC-VK-02]** Vũ Khúc hãm (Tỵ, Hợi — đồng Phá Quân) hoặc gặp sát tinh: lao tâm vì tiền bạc, trách nhiệm; đồng Phá Quân thì "đông tẩu tây hành", khó yên một chỗ. — *Nguồn: TT ("武曲勞心費力…破軍同東走西行，不寧靜"); WD11 (hãm: hao tâm; đồng Phá Quân bất an); WD6 (hãm gặp sát: vất vả)*
- **[PHUC-VK-03]** Vũ Khúc đồng Thiên Tướng: về già an khang; đồng Tham Lang: về già hưởng phúc, gặp Hỏa Linh thì an dật; đồng Thất Sát: kém an. — *Nguồn: TT ("天相同老境安康，七殺同欠安康，貪狼同晚年享福，見火鈴星安逸"); WD11; WD8 (đồng Thất Sát nhiều rủi ro)*

#### Thái Dương
- **[PHUC-TDU-01]** Thái Dương miếu/vượng (Dần, Mão, Thìn, Tỵ, Ngọ): "trong bận rộn mà phát phúc"; họ hàng có danh tiếng; sống tích cực. — *Nguồn: TT ("太陽忙中發福"); WD8 (Dần–Ngọ: an nhàn, họ hàng có danh tiếng); WD11; WD6 (miếu vượng: phúc quý)*
- **[PHUC-TDU-02]** Thái Dương hãm (Tý, Thân, Dậu, Tuất, Hợi) gặp sát tinh, Kỵ, Hao: dễ nóng nảy, áp lực, bận rộn mà ít thảnh thơi; nên cân bằng công việc – nghỉ ngơi. *(sách gốc nói "終身不美", đã trung tính hóa)* — *Nguồn: TT ("加羊陀火鈴空劫忌耗，終身不美之論"); WD8 (hãm: nóng nảy, áp lực); WD6 (hãm gặp sát: bận rộn)*
- **[PHUC-TDU-03]** Thái Dương đồng Thái Âm hoặc Thiên Lương: vui vẻ; đồng Cự Môn: phí sức, kém yên. Nữ mệnh có Thái Dương ở Phúc gặp cát tinh: dễ gặp người bạn đời hiền minh. — *Nguồn: TT ("太陰同快樂，巨門同費力欠安，天梁同快樂，女人會吉星招賢明之夫"); WD11*

#### Thiên Cơ
- **[PHUC-TCO-01]** Thiên Cơ miếu/vượng (Mão, Thìn, Tỵ, Thân, Dậu, Tuất): trước lao sau nhàn; sáng suốt, nhiều suy nghĩ; đồng Thiên Lương hoặc Thái Âm thì an vui. — *Nguồn: TT ("天機先勞後逸…天梁同享福，太陰同主快樂"); WD14 ("trước thì lao khổ sau mới được nhàn hạ"); WD11 (Tỵ Ngọ Mùi, Mão Dậu tốt; đồng Lương hưởng phúc)*
- **[PHUC-TCO-02]** Thiên Cơ hãm (Dần, Hợi) gặp sát tinh hoặc Hóa Kỵ: hay lo xa, bôn tẩu, khó tĩnh tâm; nên tập trung ít mục tiêu hơn. — *Nguồn: TT ("加羊陀火鈴空劫奔走不得寧靜"); WD6 (lao tâm, Hóa Kỵ làm nặng thêm); WD8 (hãm: lo xa, bất an)*
- **[PHUC-TCO-03]** Thiên Cơ đồng Cự Môn: lao lực, kém yên. — *Nguồn: TT ("巨門同勞力欠安"); WD11 (đồng Cự Môn: lao lực mới yên)*

#### Thiên Phủ
- **[PHUC-TP-01]** Thiên Phủ miếu/vượng/đắc: an tĩnh hưởng phúc, hậu vận thuận. — *Nguồn: TT ("天府安靜享福"); WD6 (miếu vượng: an thọ); WD8 (phúc tốt, hậu vận thuận); WD11 (Dần Thân Tỵ Hợi Tý Ngọ tốt)*
- **[PHUC-TP-02]** Thiên Phủ bình hòa (Sửu, Mão, Dậu; bảng spec không có ô hãm) hoặc gặp sát tinh, Không Kiếp, Hóa Kỵ, Tuần/Triệt: ít được hưởng nhàn, phải tự lo nhiều. — *Nguồn: TT ("加羊陀火鈴空劫耗忌勞苦過日"); WD8 (Sửu Mùi Mão Dậu ít phúc); WD11 (Mão Dậu Sửu Mùi kém; Tuần Triệt Không Kiếp kém)*
- **[PHUC-TP-03]** Thiên Phủ đồng Tử Vi: vui vẻ; đồng Liêm Trinh: thân an mà tâm bận; đồng Vũ Khúc: sớm vất vả, trung vãn an lạc. — *Nguồn: TT ("紫微同快樂，廉貞同身安心忙，武曲同早年更辛苦，中晚安樂享福"); WD8 (đồng Tử, Vũ, Liêm: tốt)*

#### Thái Âm
- **[PHUC-TA-01]** Thái Âm miếu/vượng (Tý, Thân, Dậu, Tuất, Hợi): hưởng phúc, vui vẻ, đời sống tinh thần dịu dàng, tinh tế. — *Nguồn: TT ("太陰入廟享福快樂"); WD14 ("nhập miếu là hưởng phúc khoái lạc"); WD11 (Dậu Tuất Hợi Tý: hưởng phúc)*
- **[PHUC-TA-02]** Thái Âm hãm (Dần, Mão, Thìn, Tỵ, Ngọ) hoặc gặp sát tinh: dễ buồn phiền, suy tư, có lúc cô đơn hoặc bi quan; nên có người tâm sự và hoạt động lành mạnh. — *Nguồn: TT ("加羊陀火鈴空劫，有憂有喜，不得安靜"); WD6 (hãm: cô đơn, bi quan); WD8 (hãm: buồn phiền, suy tư)*
- **[PHUC-TA-03]** Thái Âm đồng Thái Dương: rất đẹp; đồng Thiên Đồng: an tĩnh; đồng Thiên Cơ: tâm bận. — *Nguồn: TT ("太陽同極美…天機同心忙，天同同安靜無憂"); WD11*

#### Tham Lang
- **[PHUC-THL-01]** Tham Lang miếu/vượng (Sửu, Thìn, Mùi, Tuất): thích hưởng thụ, lạc quan; đồng Vũ Khúc hoặc Tử Vi thì về già vui vẻ thanh nhàn. — *Nguồn: TT ("紫微同晚年快樂"; Vũ Khúc "貪狼同晚年享福"); WD6 (miếu vượng: thích hưởng lạc); WD8 (Thìn Tuất: an nhàn; đồng Vũ: thanh nhàn)*
- **[PHUC-THL-02]** Tham Lang hãm (Tý, Mão, Tỵ, Ngọ, Dậu, Hợi): lao tâm, cảm xúc dễ bất ổn; đồng Liêm Trinh thì phúc mỏng; nên giữ nhịp sống điều độ. — *Nguồn: TT ("貪狼勞心不安，廉貞同福薄"); WD14 ("lạc hãm là lao tâm…gặp Liêm Trinh thì phúc bạc"); WD8 (hãm: bất ổn cảm xúc)*

#### Cự Môn
- **[PHUC-CM-01]** Cự Môn miếu/vượng (Tý, Dần, Mão, Ngọ, Dậu; đắc Thân, Hợi): có phúc, trí tuệ, được giúp đỡ, nhưng vẫn kèm thị phi; đồng Thiên Đồng thì hưởng phúc. — *Nguồn: TT ("天同同享福"); WD6 (miếu vượng: có phúc nhưng kèm thị phi); WD8 (miếu: phúc tốt, trí tuệ; Hợi Tý Ngọ tốt)*
- **[PHUC-CM-02]** Cự Môn hãm (Sửu, Thìn, Tỵ, Mùi, Tuất), gặp sát tinh: lao lực kém yên, hay lo; nên học cách buông bớt và giao tiếp rõ ràng. — *Nguồn: TT ("巨門勞力不安…加羊陀火鈴空劫生平多憂"); WD14 ("lạc hãm là lao tâm không yên"); WD6 (hãm: lo lắng, căng thẳng thần kinh)*
- **[PHUC-CM-03]** Cự Môn đồng Thái Dương: có lo có vui; đồng Thiên Cơ: tâm bận không yên. — *Nguồn: TT ("太陽同有憂有喜，天機同心忙不安"); WD14 ("cùng với Nhật có buồn có vui")*

#### Thiên Tướng
- **[PHUC-TT-01]** Thiên Tướng miếu/vượng/đắc: an dật hưởng phúc; đồng Tử Vi vui vẻ. — *Nguồn: TT ("天相安逸享福有壽，紫微同快樂"); WD14 ("đắc địa thì được an nhàn hưởng phúc"); WD11 (đắc địa: an nhàn)*
- **[PHUC-TT-02]** Thiên Tướng hãm (Mão, Dậu) hoặc gặp sát tinh, Không Kiếp, Tuần/Triệt: tâm không tĩnh, dễ bị thị phi; trẻ vất vả, về già ổn hơn. — *Nguồn: TT ("加羊陀火鈴空劫不得心靜"); WD8 (Mão Dậu: trẻ vất vả, già ổn); WD11 (Tuần Triệt Không Kiếp: thị phi)*

#### Thiên Lương
- **[PHUC-TL-01]** Thiên Lương miếu/vượng/đắc: an nhàn, phong thái điềm đạm, thích học hỏi; được che chở (Thiên Lương "hóa khí là ấm", chủ phúc thọ). — *Nguồn: WD6 (miếu vượng: an nhàn, phong thái học giả); WD8 (Tý Ngọ Sửu Mùi tốt: phúc thọ, quý nhân); WD11 (Tý Ngọ tốt); TT (卷一: Thiên Lương "化氣為蔭為福壽")*
- **[PHUC-TL-02]** Thiên Lương hãm (Tỵ, Dậu, Hợi), gặp sát tinh, Thiên Mã, Hóa Kỵ, Tuần/Triệt: dễ bi quan, dễ có bất đồng; tinh thần hay xa cách gia đình. — *Nguồn: WD6 (hãm: tranh chấp, bi quan); WD8 (Tỵ Hợi kém; có sát: xa cách); WD11 (Tỵ Hợi kém; hãm cùng Thiên Mã Hóa Kỵ: suy giảm)*
- **[PHUC-TL-03]** TT (卷二 十一福德) không có mục riêng cho Thiên Lương; chỉ có tổ hợp: Lương đồng Thiên Cơ "hưởng phúc", đồng Thiên Đồng "thanh nhàn vui vẻ", đồng Thái Dương "vui vẻ". — *Nguồn: TT (mục Thiên Cơ, Thiên Đồng, Thái Dương); WD11 (Cơ Lương, Đồng Lương hưởng phúc)*

#### Thất Sát
- **[PHUC-TS-01]** Thất Sát miếu/vượng/đắc: vẫn hưởng phúc; ý chí mạnh, tự lập, thích cạnh tranh; đồng Tử Vi thì trước lao sau nhàn, cuối đời như ý. — *Nguồn: TT ("七殺入廟享福…紫微同先勞後逸，末年方如意遂心"); WD6 (miếu vượng: năng động, cạnh tranh); WD8 (đắc: ý chí mạnh, tự lập)*
- **[PHUC-TS-02]** Thất Sát hãm (Mão, Thìn, Dậu, Tuất, Hợi) gặp Kình Đà Hỏa Linh: lao tâm tốn sức, dễ căng thẳng, cô độc; đồng Vũ Khúc kém an, đồng Liêm Trinh vất vả. Nên có hoạt động giải tỏa thể chất, chia sẻ. — *Nguồn: TT ("陷地加羊陀火鈴勞心費力，武曲同欠安，廉貞同辛勤"); WD6 (hãm: tiêu cực, ít phúc); WD8 (hãm: căng thẳng, cô độc)*
- **[PHUC-TS-03]** TT có một câu định kiến nặng nề về nữ mệnh có Thất Sát đơn thủ ở Phúc Đức; nhóm **không dùng** câu này trong bất kỳ bài luận nào (xem PHUC-TRANH-02). — *Nguồn: TT (卷二 十一福德; 卷三 女命); WD6 (ghi nhận "đánh giá khắc nghiệt với nữ")*

#### Phá Quân
- **[PHUC-PQ-01]** Phá Quân miếu/vượng (Tý, Ngọ; vượng Sửu, Thìn, Mùi, Tuất): quyết đoán; gặp Vũ Khúc với Khoa, Quyền, Khôi, Việt là "tú khí", văn võ kiêm toàn; đồng Tử Vi thì an lạc. — *Nguồn: TT ("紫微同安樂"); WD6 (miếu vượng: quyết đoán); WD14 ("gặp Vũ, Khoa, Quyền, Khôi, Việt là Tú khí ắt Văn Võ kiêm toàn"); WD11*
- **[PHUC-PQ-02]** Phá Quân hãm (Dần, Mão, Tỵ, Thân, Dậu, Hợi) hoặc gặp sát tinh: lao tâm tốn sức, khó yên tĩnh, hay thay đổi; đồng Liêm Trinh vất vả. — *Nguồn: TT ("破軍勞心費力…廉貞同辛勤…加羊陀火鈴空劫操心，不得寧靜"); WD6 (hãm gặp sát: vất vả); WD8 (hãm: bất ổn, biến động)*

### 11.3. Bộ sao phụ quan trọng (SP)

- **[PHUC-SP-01]** Văn Xương, Văn Khúc miếu gặp cát tinh: hưởng phúc vui vẻ, đời sống tinh thần thiên về văn chương, nghệ thuật; hãm gặp sát thì thân tâm khó yên. — *Nguồn: TT ("文昌加吉星入廟享福快樂，陷地遇羊陀火鈴空劫，心身俱不得安靜"); WD11 (Xương Khúc gặp cát: phát về văn chương)*
- **[PHUC-SP-02]** Tả Phụ, Hữu Bật: phúc lộc đầy đủ, ít lo, được giúp; gặp sát thì lao tâm. — *Nguồn: TT ("左輔加吉星享福…右弼生平福祿全美，加吉星一生少憂"); WD11 (Tả Hữu gặp Tử Phủ, Khôi Việt: tốt)*
- **[PHUC-SP-03]** Lộc Tồn: phúc dày, sống an tĩnh; gặp sát tinh, Không Kiếp thì thân tâm không yên. — *Nguồn: TT ("祿存終身福厚安靜處世"); WD11 (Lộc Tồn gặp Không Kiếp Tuần Triệt Hao: tán bại)*
- **[PHUC-SP-04]** Thiên Khôi, Thiên Việt: có quý nhân bầu bạn, vui vẻ. — *Nguồn: TT ("魁鉞有貴人，為伴享福快樂"); WD11 (có cả hai sao là quý)*
- **[PHUC-SP-05]** Kình Dương miếu: "trong động có phúc" (phúc đến qua hoạt động, bận rộn); hãm: lao tâm. Đà La: cần cù vất vả, gặp cát tinh về già có phúc. — *Nguồn: TT ("擎羊入廟動中有福，陷宮勞心欠力…陀羅獨守辛勤"); WD11 (Kình miếu có phúc nhưng dễ bị động; Đà đứng một mình vất vả)*
- **[PHUC-SP-06]** Hỏa Tinh, Linh Tinh: vất vả, kém an; gặp cát tinh thì về già toại chí, bình hòa. — *Nguồn: TT ("火星欠安勞力辛勤，加吉星晚年遂志；鈴星勞苦，加吉星平和"); WD11 (Hỏa Linh lao khổ, gặp cát giảm)*
- **[PHUC-SP-07]** Địa Không, Địa Kiếp ở Phúc Đức: bôn ba mà ít sức, khó an nhàn. — *Nguồn: TT (卷一: "福德遇空劫，奔走無力"); WD8 (sát tinh: tinh thần bất an)*

### 11.4. Cách cục chính (CC)

- **[PHUC-CC-01]** **Ngọc tụ thiên hương** (玉袖天香): Văn Xương, Văn Khúc ở cung Phúc Đức; được thêm Tử Vi ở Ngọ thì càng đẹp. Chủ đời sống tinh thần thanh nhã, có văn hóa. — *Nguồn: TT (卷三: "昌曲吉星居福德謂之玉袖天香，更得紫微，居午宮妙"); WD11 (Xương Khúc gặp nhau cùng cát tinh: tốt)*
- **[PHUC-CC-02]** Sáu cung Mệnh, Thân, Thiên Di, Tài Bạch, Quan Lộc, Phúc Đức đều sáng, hội cát, hóa cát: phú quý, an khang; sáu cung đều hãm, hội hung hóa Kỵ thì đời nhiều vất vả. *(sách gốc nói "孤寡夭壽", đã trung tính hóa)* — *Nguồn: TT (卷三: "身命遷移財官福德六宮…俱在成照聚吉化吉，富貴高壽"); KL (Thế đứng các sao: "các cung Quan, Di, Tài có nhiều ảnh hưởng đến Mệnh"; "Mệnh Phúc xấu và Di, Tật, Vận có hung tinh thì" rất xấu) (bản quét, đã đọc)*
- **[PHUC-CC-03]** **Vô chính diệu**: quy tắc chung mượn chính tinh cung xung chiếu (Tài Bạch). Có hai ý kiến trái ngược về tốt/xấu (xem PHUC-TRANH-01). Theo Đặng Xuân Xuyến: dễ sống xa họ hàng; rất cần Tuần, không ưa Triệt. — *Nguồn: WD15 (dẫn *Tử Vi Chân Truyền*); WD8 (vô chính diệu: xem cung đối, tam hợp; có cát tinh thì phúc khí khá)*

### 11.5. Tứ hóa tại cung (HOA)

- **[PHUC-HOA-01]** Hóa Lộc nhập Phúc Đức: phúc khí tốt, có điều kiện hưởng thụ (TT gọi Hóa Lộc là "thần phúc đức"); gặp Xương Khúc thì tốt hơn, gặp Kình Đà, Kỵ thì giảm. — *Nguồn: TT (卷一: "祿為福德之神"); WD11; WD8 (Hóa Lộc mang phúc tài)*
- **[PHUC-HOA-02]** Hóa Quyền: ý chí mạnh, chủ động trong đời sống tinh thần; gặp Khôi Việt thì càng tốt. — *Nguồn: WD8 (tăng ý chí); WD11 (gặp Khôi Việt, Tham, Vũ: văn võ toàn tài)*
- **[PHUC-HOA-03]** Hóa Khoa: sáng suốt, tâm thái ôn hòa, giảm phiền muộn. — *Nguồn: WD8 (sáng suốt, giảm tai họa); WD11 (gặp Khôi Việt, Xương Khúc: tốt)*
- **[PHUC-HOA-04]** Hóa Kỵ: dễ lo nghĩ, bất an, khó hài lòng; dù có cát tinh cũng khó trọn vẹn. Nên học cách quản lý cảm xúc, chọn nhịp sống chậm hơn. — *Nguồn: TT (nhiều mục "加…忌耗…勞苦"); WD8 (Kỵ: lo nghĩ, bất hòa); WD11 (Kỵ là ác khí, gặp Khoa Quyền cũng khó bền)*

### 11.6. Điểm còn tranh luận (TRANH)

- **[PHUC-TRANH-01]** **Phúc vô chính diệu tốt hay xấu**: Đặng Xuân Xuyến (dẫn *Tử Vi Chân Truyền*) cho là dễ xa họ hàng, cần Tuần; một bài sưu tầm kinh nghiệm cụ Thiên Lương (NL) lại cho là rất tốt, nhất là khi Nhật Nguyệt sáng chiếu. Mặc định: luận theo sao xung chiếu và phụ tinh, không phán chung. — *Nguồn: WD15; NL (qua WD15, chưa đối chiếu sách)*
- **[PHUC-TRANH-02]** **Câu định kiến về nữ mệnh**: TT (卷二 và 卷三) có câu đánh giá miệt thị nữ mệnh có Thất Sát đơn thủ Phúc Đức. Câu này trái với định vị thương hiệu và không có cơ sở; **loại bỏ hoàn toàn**. Thất Sát ở Phúc với nữ mệnh luận như PHUC-TS-01/02. *(Nhận xét nhóm)* — *Nguồn: TT; WD6*
- **[PHUC-TRANH-03]** **Độ sáng lệch bảng spec**: WD11 ghi Thái Âm hãm ở Sửu, Mùi (spec: đắc); Thiên Đồng ở Ngọ tốt (spec: hãm); Phá Quân ở Thân khá (spec: hãm); Cự Môn có chỗ ghi Thân, Dậu kém (spec: Thân đắc, Dậu miếu). Mặc định theo spec. — *Nguồn: WD11; spec mục 6*
- **[PHUC-TRANH-04]** **Âm phần, mồ mả**: nhiều nguồn Việt (WD14, một phần WD8) luận Phúc Đức theo mộ phần từng đời (mộ ông nội, mộ chú…). Đây là truyền thống có thật trong sách Việt nhưng nhóm **không dùng** theo định vị sản phẩm (không mê tín, không gây sợ); chỉ giữ phần nói về tâm tính, mức an nhàn. *(Nhận xét nhóm)* — *Nguồn: WD14; WD8*
- **[PHUC-TRANH-05]** **Thiên Lương ở Phúc Đức**: bản TT trên Wikisource không có mục riêng (có thể do thất lạc khi chép); quy tắc PHUC-TL-01/02 dựa vào WD6 (Tử Vi Đại Toàn) và trang Việt. Cần bản in TT/TB đối chiếu. — *Nguồn: TT; WD6*

---

## 12. Cung Phụ Mẫu

Định hướng diễn đạt (bắt buộc): luận **sự gắn bó, nâng đỡ, khoảng cách và cách ứng xử** giữa đương số với cha mẹ, bề trên. Sách cổ dùng nhiều chữ "刑/克" (hình khắc), "重拜父母", "過房", "二姓" (cha mẹ nuôi, sống với hai họ). Nhóm diễn đạt thành "duyên gắn bó/ khoảng cách với cha mẹ", "sớm tự lập", "có thể có người nuôi dưỡng, đỡ đầu ngoài cha mẹ ruột". **Không dự đoán sức khỏe, tuổi thọ, sinh tử của cha mẹ.**

### 12.1. Ý nghĩa cung (YN)

- **[PHUMAU-YN-01]** Phụ Mẫu luận về cha mẹ: mức độ hòa hợp, sự che chở thời nhỏ, điều kiện gia đình gốc, và rộng ra là quan hệ với bề trên, người đỡ đầu. — *Nguồn: TT (卷二 十二父母); WD9 (quan hệ cha mẹ, bề trên); WD12*
- **[PHUMAU-YN-02]** Sao chủ cung Phụ Mẫu là **Thiên Lương** (TT: "為父母主", "父母宮主星"). — *Nguồn: TT (卷一 諸星問答論 — Thiên Lương); WD5 ("Lương ở Phụ mẫu: cha mẹ thọ" — coi Lương là sao tốt cho cung này)*
- **[PHUMAU-YN-03]** Khi luận cha mẹ phải xét **Thái Dương là cha, Thái Âm là mẹ** trên toàn lá số (không chỉ trong cung Phụ Mẫu): Thái Dương sáng ở Dần–Ngọ, hãm ở Thân–Tý; Thái Âm sáng ở Thân–Tý, hãm ở Dần–Ngọ. — *Nguồn: TT ("凡看父母以太陽星為父，太陰星為母"); WD5 (KHHB số 41, Anh Việt: Nhật sáng Dần Mão Thìn Tỵ Ngọ, Nguyệt sáng Thân Dậu Tuất Hợi Tý); WD9 (dẫn TB: xét Nhật Nguyệt toàn lá số)*
- **[PHUMAU-YN-04]** Tam hợp của Phụ Mẫu là **Nô Bộc** và **Tử Tức**; cung xung chiếu là **Tật Ách**. — *Nguồn: spec 2.4 (suy ra); WD9 (cung đối diện Tật Ách)*

### 12.2. 14 chính tinh tại Phụ Mẫu

#### Tử Vi
- **[PHUMAU-TV-01]** Tử Vi miếu/vượng/đắc: duyên với cha mẹ thuận, cha mẹ có vị thế; đồng Thiên Phủ hoặc Thiên Tướng cũng tốt. — *Nguồn: TT ("紫微無克，天府同亦無刑…天相同無刑"); WD5 ("Tử vi hay thiên Phủ: cha mẹ thọ"); WD12 (nhập miếu có cát: cha mẹ giàu sang)*
- **[PHUMAU-TV-02]** Tử Vi bình hòa (Tý, Mão, Dậu, Hợi) hoặc gặp sát tinh, Không Kiếp: hai thế hệ đều cá tính mạnh, dễ bất đồng quan điểm; đồng Phá Quân thì dễ xa cách sớm. *(sách gốc nói "亦克/早克", đã trung tính hóa)* — *Nguồn: TT ("加羊陀火鈴空劫亦克…破軍同早克"); WD12 (hãm/gặp sát: cá tính mạnh, bất đồng; gặp Phá Quân: chia ly); WD9 (hội Phá Quân: xa cách)*

#### Liêm Trinh
- **[PHUMAU-LT-01]** Liêm Trinh miếu/vượng, gặp Thiên Phủ, Hóa Lộc, Xương Khúc: gia đình có nề nếp, cha mẹ có uy tín; đồng Thiên Phủ thì giảm bớt xung khắc. — *Nguồn: TT ("天府同免刑"); WD9 (đắc gặp Phủ, Lộc, Xương Khúc: nề nếp, uy tín); WD12 (có Phủ Tướng thì giảm hình khắc)*
- **[PHUMAU-LT-02]** Liêm Trinh hãm (Mão, Tỵ, Dậu, Hợi) hoặc đồng Tham Lang, Thất Sát, Phá Quân, gặp sát tinh: cha mẹ nghiêm khắc, khó bày tỏ tình cảm, dễ có khoảng cách; nhiều sách khuyên tự lập, sống xa nhà sớm thì quan hệ êm hơn. *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TT ("廉貞難為父母…貪狼同早刑，七殺孤克…破軍同早刑"); WD5 ("Liêm ở Phụ mẫu: con phải lánh xa, đỡ khắc cha mẹ"); WD9 (hãm: nghiêm khắc, khó bộc lộ tình cảm)*

#### Thiên Đồng
- **[PHUMAU-TD-01]** Thiên Đồng miếu/vượng/đắc đơn thủ: cha mẹ ôn hòa, gia đình êm; đồng Thái Âm: cha mẹ đầy đủ, hòa hợp; đồng Thiên Lương (Dần, Thân): cha mẹ khá giả. — *Nguồn: TT ("天同獨守廟旺無刑…太陰同父母雙全，天梁同無刑"); WD5 ("Đồng ở Dần, Thân: cha mẹ phú quý, thọ"); WD9 (đắc: ôn hòa, lạc quan)*
- **[PHUMAU-TD-02]** Thiên Đồng hãm (Sửu, Thìn, Ngọ, Mùi, Dậu, Tuất) gặp Tứ sát hoặc Hóa Kỵ: thuở nhỏ có thể vất vả, có người nuôi dưỡng/đỡ đầu ngoài cha mẹ; đồng Cự Môn thì kém hòa, cách biệt thế hệ. — *Nguồn: TT ("加四殺重拜父母，巨門同欠和"); WD9 (hãm: nhiều thay đổi; đồng Cự Môn: xung đột cha con; gặp Hóa Kỵ: xung khắc); WD12 (thơ ấu có thể vất vả)*

#### Vũ Khúc
- **[PHUMAU-VK-01]** Vũ Khúc miếu/vượng, gặp Thiên Phủ, Thiên Tướng, Lộc Tồn, Hóa Lộc/Khoa: kinh tế gia đình ổn định, cha mẹ thực tế. — *Nguồn: WD12 (nhập miếu có Phủ, Tướng, Hóa Lộc: cha mẹ giàu có); WD9 (đắc gặp Lộc Tồn, Khoa, Phủ: kinh tế ổn); TT (Thiên Phủ mục: "廉貞武曲同，在廟旺無刑")*
- **[PHUMAU-VK-02]** Vũ Khúc hãm (Tỵ, Hợi — đồng Phá Quân) hoặc đồng Thất Sát, Tham Lang, gặp sát tinh: quan hệ cứng rắn, dễ xa cách sớm; sách nói nếu rời nền cũ, tự lập thì nhẹ hơn. — *Nguồn: TT ("武曲克早，退祖業不刑，貪狼同刑克，七殺同有刑"); WD12 (lạc hãm: dễ xung khắc); WD9 (đồng Sát, Phá: khó hòa hợp)*

#### Thái Dương
- **[PHUMAU-TDU-01]** Thái Dương miếu/vượng (Dần, Mão, Thìn, Tỵ, Ngọ): quan hệ với cha tốt, cha có uy tín; đồng Thiên Lương cũng tốt. — *Nguồn: TT ("太陽入廟無克…天梁同無刑"); WD12 (nhập miếu có cát: cha giàu có); WD9 (đắc: cha con tốt; đồng Lương ở Mão: hưởng phúc cha mẹ)*
- **[PHUMAU-TDU-02]** Thái Dương hãm (Tý, Thân, Dậu, Tuất, Hợi), gặp sát tinh: dễ có khoảng cách hoặc bất đồng với cha, cha bận rộn ít gần gũi; nên chủ động vun đắp. *(sách gốc nói "克父", đã trung tính hóa)* — *Nguồn: TT ("陷地克父，加羊陀火鈴空劫克父母早"); WD5 ("Nhật (hãm) ở Thân: xung khắc, cãi cọ"); WD9 (hãm: khoảng cách, cha bận rộn)*
- **[PHUMAU-TDU-03]** Thái Dương đồng Cự Môn gặp sát tinh: dễ tranh luận với cha. — *Nguồn: TT ("巨門同加四殺空劫早克"); WD9 (đồng Cự Môn: xung đột cha con); WD5 ("Cự môn ở Dần Thân tại Phụ mẫu" bất lợi)*

#### Thiên Cơ
- **[PHUMAU-TCO-01]** Thiên Cơ miếu/vượng: duyên cha mẹ thuận, cha mẹ có học thức; đồng Thái Âm hoặc Thiên Lương không gặp sát cũng êm. — *Nguồn: TT ("天機廟旺無刑…太陰同免刑，天梁同無刑，俱要無殺"); WD9 (đắc: cha mẹ có học thức; đồng Âm ít mâu thuẫn; đồng Lương thân thiết)*
- **[PHUMAU-TCO-02]** Thiên Cơ hãm (Dần, Hợi) gặp sát tinh: hoàn cảnh gia đình biến động, có thể sống với hai bên gia đình hoặc có cha mẹ nuôi; đồng Cự Môn thì sớm có khoảng cách. — *Nguồn: TT ("陷地逢羊陀火鈴空劫，二姓寄居，重拜父母，或過房入贅…巨門早刑"); WD12 (gặp sát tinh: gia cảnh không trọn vẹn; gặp Thiên Mã: xa nhà); WD9 (đồng Cự Môn: khó khăn thời thơ ấu)*

#### Thiên Phủ
- **[PHUMAU-TP-01]** Thiên Phủ miếu/vượng/đắc: cha mẹ đầy đủ, gia đình ổn định; đồng Tử Vi, hoặc đồng Liêm/Vũ ở vị trí sáng cũng tốt. — *Nguồn: TT ("天府父母雙全，紫微同亦無刑，廉貞武曲同，在廟旺無刑"); WD5 ("Phủ: cha mẹ đều thọ"); WD12 (tương đối tốt, gia đình ổn định)*
- **[PHUMAU-TP-02]** Thiên Phủ bình hòa (Sửu, Mão, Dậu) hoặc gặp sát tinh, Không Kiếp: kinh tế gia đình có áp lực, nên quan tâm chăm sóc cha mẹ nhiều hơn. *(sách gốc nói "主傷", đã trung tính hóa)* — *Nguồn: TT ("加羊陀火鈴空劫主傷"); WD9 (hãm: áp lực tài chính); WD12 (sát tinh đồng cung: cha mẹ dễ yếu)*

#### Thái Âm
- **[PHUMAU-TA-01]** Thái Âm miếu/vượng (Tý, Thân, Dậu, Tuất, Hợi): quan hệ với mẹ gần gũi, mẹ chăm lo; đồng Thái Dương không gặp sát: cha mẹ đầy đủ; đồng Thiên Đồng rất đẹp. — *Nguồn: TT ("太陰入廟無克…太陽同無四殺父母雙全，天機同無刑天同同極美"); WD12 (nhập miếu có cát: mẹ song toàn); WD9 (đắc: mẹ chăm lo)*
- **[PHUMAU-TA-02]** Thái Âm hãm (Dần, Mão, Thìn, Tỵ, Ngọ) hoặc gặp sát tinh, Hóa Kỵ: dễ có khoảng cách hoặc ít thấu hiểu với mẹ, có thể sống xa nhà sớm; nên chủ động chia sẻ. *(sách gốc nói "克母", đã trung tính hóa)* — *Nguồn: TT ("加羊陀火鈴克母，不然過房棄祖"); WD5 ("Nguyệt (hãm)…: xung, cãi cọ"); WD9 (hãm: lo âu, ít thấu hiểu)*

#### Tham Lang
- **[PHUMAU-THL-01]** Tham Lang miếu/vượng (Sửu, Thìn, Mùi, Tuất): cha mẹ khá giả, thông minh, giao tiếp cởi mở; đồng Tử Vi không gặp sát thì cha mẹ đầy đủ. — *Nguồn: TT ("紫微同無殺加雙全"); WD12 (nhập miếu: cha mẹ giàu, thông minh); WD9 (đắc gặp Lộc, Xương Khúc: cởi mở)*
- **[PHUMAU-THL-02]** Tham Lang hãm (Tý, Mão, Tỵ, Ngọ, Dậu, Hợi): sớm rời gia đình gốc, có thể có cha mẹ nuôi/đỡ đầu; đồng Liêm Trinh dễ cô đơn, ít được che chở. — *Nguồn: TT ("貪狼陷地早棄祖，重拜過房，入贅，廉貞同早刑主孤單"); WD12 (lạc hãm: dễ ly tán); WD9 (hãm gặp Kỵ, Không Kiếp: biến động; đồng Liêm: xung khắc)*

#### Cự Môn
- **[PHUMAU-CM-01]** Cự Môn miếu/vượng, gặp Hóa Lộc, Hóa Quyền, Lộc Tồn, Xương Khúc: cha mẹ có học thức, giao tiếp tốt, ít trắc trở. — *Nguồn: WD9 (đắc gặp Lộc, Quyền, Xương Khúc: học thức, giao tiếp tốt); WD12 (gặp Lộc, Quyền, Lộc Tồn thì tốt)*
- **[PHUMAU-CM-02]** Cự Môn hãm (Sửu, Thìn, Tỵ, Mùi, Tuất): dễ hiểu lầm, tranh cãi, sớm rời gia đình gốc; đồng Thái Dương ít hòa; gặp sát tinh thì gia đình không trọn vẹn. — *Nguồn: TT ("巨門陷地傷克棄祖過房，太陽同少和…加羊陀火鈴空劫父母不周全"); WD9 (hãm: hiểu lầm, tranh cãi); WD12 (gặp sát hoặc Kỵ: trắc trở)*

#### Thiên Tướng
- **[PHUMAU-TT-01]** Thiên Tướng miếu/vượng/đắc: cha mẹ hiền hậu, duyên thuận; đồng Tử Vi cũng tốt. — *Nguồn: TT ("天相廟旺無刑，紫微同無刑克"); WD5 ("Thiên Tướng (cũng như Tử Phủ): cha mẹ thọ"); WD12 (nhập miếu: cha mẹ hiền hậu)*
- **[PHUMAU-TT-02]** Thiên Tướng hãm (Mão, Dậu) hoặc gặp sát tinh, Không Kiếp, Hình, Kỵ: cha mẹ nghiêm khắc, có áp lực; đồng Liêm Trinh dễ bất đồng; có Khôi Việt, Tả Hữu thì được giảm nhẹ. — *Nguồn: TT ("廉貞同亦刑，加羊陀火鈴空劫早刑"); WD9 (hãm gặp Kình Đà Không Kỵ: áp lực, nghiêm khắc); WD12 (gặp sát, Hình, Kỵ giảm phúc; Khôi Việt Tả Hữu hóa giải)*

#### Thiên Lương
- **[PHUMAU-TL-01]** Thiên Lương miếu/vượng/đắc (sao chủ cung): cha mẹ nhân hậu, nhiều che chở, gia đình đầm ấm; TT nói Lương ở Phụ Mẫu "hậu trọng uy…". — *Nguồn: TT (卷一: Thiên Lương "在父母宮則厚重威…"); WD5 ("Lương ở Phụ mẫu: cha mẹ thọ"); WD9 (đắc: nhân hậu, phúc khí tốt)*
- **[PHUMAU-TL-02]** Thiên Lương hãm (Tỵ, Dậu, Hợi) gặp Kình Đà Hỏa Linh: dễ cô đơn, sớm xa gia đình gốc, có thể được người khác nuôi dưỡng/đỡ đầu. *(sách gốc nói "孤克…更名寄人", đã trung tính hóa)* — *Nguồn: TT ("天梁陷地，加羊陀火鈴孤克，棄祖入贅，更名寄人"); WD9 (hãm gặp Đà, Hỏa, Kiếp, Hình: áp lực); WD12 (hãm: sản nghiệp dễ tiêu tán)*
- **[PHUMAU-TL-03]** Thiên Lương đồng Thiên Cơ: thuận; đồng Thiên Đồng không gặp sát: thuận; đồng Thái Dương: khoảng cách đến muộn. — *Nguồn: TT ("天機同無刑…天同同加四殺有刑，無殺無刑…太陽同克遲"); WD9 (đồng Thiên Đồng: hòa hợp, trừ khi có Hóa Kỵ)*

#### Thất Sát
- **[PHUMAU-TS-01]** Thất Sát miếu/vượng/đắc gặp Hóa Quyền, Khôi Việt, Tả Hữu: đương số ý chí mạnh, vượt khó; đồng Tử Vi gặp cát tinh thì duyên cha mẹ thuận. — *Nguồn: TT ("紫微同加吉星無刑"); WD9 (đắc gặp Quyền, Khôi Việt, Tả Hữu: ý chí mạnh); WD12 (Tử Vi, Thiên Tướng hội chiếu: hóa nguy thành an)*
- **[PHUMAU-TS-02]** Thất Sát hãm (Mão, Thìn, Dậu, Tuất, Hợi) hoặc đồng Vũ Khúc, Liêm Trinh, gặp sát tinh: sớm tự lập, xa gia đình gốc, tính hai thế hệ dễ va chạm. *(sách gốc nói "克早離祖，六親骨肉孤獨", đã trung tính hóa)* — *Nguồn: TT ("七殺克早離祖…武曲同亦刑，廉貞同刑早"); WD5 ("Sát, Phá" bất lợi cho cha mẹ); WD9 (hãm gặp Kình Đà Hỏa Kiếp: nóng tính, bất đồng)*

#### Phá Quân
- **[PHUMAU-PQ-01]** Phá Quân miếu/vượng gặp Hóa Lộc, Hóa Quyền, Tả Hữu: đương số tự lập, vươn lên; đồng Tử Vi thì duyên cha mẹ thuận. — *Nguồn: TT ("紫微同無刑"); WD9 (đắc gặp Lộc, Quyền, Tả Hữu: tự lập vươn lên); WD12 (ưa Tử Vi và cát tinh)*
- **[PHUMAU-PQ-02]** Phá Quân hãm (Dần, Mão, Tỵ, Thân, Dậu, Hợi) hoặc đồng Vũ Khúc, Liêm Trinh: sớm xa gia đình gốc; sách cổ nói đổi họ tên, gửi nuôi thì nhẹ hơn — nhóm diễn đạt là "tự lập sớm, sống xa có thể giúp quan hệ êm hơn". *(sách gốc diễn đạt nặng, đã trung tính hóa)* — *Nguồn: TT ("破軍克早離祖，更名寄養免刑，武曲同克早，廉貞同亦早克"); WD5 ("Sát, Phá: …con nên lánh sớm"); WD12 (ngại Vũ, Liêm, nhất là Hóa Kỵ)*

### 12.3. Bộ sao phụ quan trọng (SP)

- **[PHUMAU-SP-01]** Thiên Khôi, Thiên Việt: cha mẹ có danh vị, gặp cát tinh thì đầy đủ; thường có học thức. — *Nguồn: TT ("魁鉞主父母榮貴同吉星雙全"); WD12 (cha mẹ có học thức, chức quyền)*
- **[PHUMAU-SP-02]** Văn Xương, Văn Khúc miếu gặp cát tinh: duyên thuận, cha mẹ có học, yêu nghệ thuật; gặp sát thì có khoảng cách. — *Nguồn: TT ("文昌加吉星入廟無刑…文曲獨守入廟無刑"); WD12 (cha mẹ có học thức, yêu nghệ thuật)*
- **[PHUMAU-SP-03]** Tả Phụ, Hữu Bật đơn thủ: duyên thuận, được cha mẹ che chở (Hữu Bật gặp cát tinh); gặp sát tinh thì có thể sống với hai bên gia đình. — *Nguồn: TT ("左輔獨守無刑…右弼獨守無刑，加吉星得父母庇蔭"); WD12 (cha mẹ khéo léo, giúp đỡ)*
- **[PHUMAU-SP-04]** Lộc Tồn: duyên thuận, cha mẹ có tài sản; gặp Không Kiếp và sát tinh thì tài sản cha mẹ thời trẻ có hao, đương số thường tự gây dựng. — *Nguồn: TT ("祿存無克，加空劫羊陀火鈴，早年有破父財"); WD12 (cha mẹ có tài sản; bản thân dễ tự gây dựng hơn hưởng gia sản)*
- **[PHUMAU-SP-05]** Kình Dương, Đà La: TT xếp Phụ Mẫu vào ba cung kỵ Kình Đà nhất; thời nhỏ dễ vất vả, sớm rời nền cũ, nhất là khi gặp Nhật Nguyệt; gặp nhiều cát tinh thì nhẹ. — *Nguồn: TT (卷一: "怕臨兄弟、田宅、父母三宮"; 卷二: "擎羊刑克早會日月重重退祖，加吉星眾免刑…陀羅幼年刑傷"); WD12 (Kình Đà: bất hòa)*
- **[PHUMAU-SP-06]** Hỏa Tinh, Linh Tinh: dễ khắc khẩu, sớm tự lập; gặp cát tinh thì bình hòa. — *Nguồn: TT ("火星獨守孤克…加吉星平和；鈴星刑克孤單"); WD12 (Hỏa Linh: khắc khẩu)*
- **[PHUMAU-SP-07]** Thiên Hình ở Phụ Mẫu (hoặc thủ Mệnh): gia đình khó trọn vẹn, đương số cứng cỏi; nhập miếu (Dần, Mão, Thân, Dậu theo spec) thì tốt hơn. — *Nguồn: TT (卷一: Thiên Hình "父母兄弟不得全…入廟則吉"); WD12 (Thiên Hình là sát tinh ở cung này)*
- **[PHUMAU-SP-08]** Thiên Khốc, Thiên Hư ở Phụ Mẫu: tài sản nhà đất gia đình dễ hao. — *Nguồn: TT (卷一: "哭虛…加臨父母內，破蕩賣田莊")* ⚑1nguồn

### 12.4. Cách cục chính (CC)

- **[PHUMAU-CC-01]** **Xét Nhật Nguyệt theo giờ sinh**: nếu Thái Dương và Thái Âm đều hãm, người sinh ban ngày lấy Thái Dương (cha), sinh ban đêm lấy Thái Âm (mẹ) làm chính để luận; sao nào "phản bối" (hãm, tối) thì quan hệ với người tương ứng cần chú ý vun đắp hơn. *(sách gốc nói "先克", đã trung tính hóa)* — *Nguồn: TT ("如二星具在陷地，只以人之本生時，日生者主父存，夜生者主母在…")* ⚑1nguồn
- **[PHUMAU-CC-02]** Thái Dương và Thái Âm đồng cung ở Phụ Mẫu: ở Sửu bất lợi cho phía cha (Thái Dương đắc nhưng kém hơn), ở Mùi bất lợi cho phía mẹ; nhìn chung đồng cung không sát tinh thì cha mẹ đầy đủ. — *Nguồn: WD9 (Sửu bất lợi cho cha, Mùi bất lợi cho mẹ); TT (Thái Âm mục: "太陽同無四殺父母雙全")*
- **[PHUMAU-CC-03]** **Vô chính diệu**: thường sớm rời quê lập nghiệp, ít dựa vào tài sản cha mẹ; có Tuần/Triệt án ngữ thì vẫn chăm lo được cho cha mẹ nhưng dễ xa nhà sớm. Mượn chính tinh cung xung chiếu (Tật Ách) để luận, xét thêm tam hợp. — *Nguồn: WD15 (Đặng Xuân Xuyến, dẫn *Tử Vi Chân Truyền*); WD9 (xem cung đối Tật Ách, tam hợp; nhiều sát tinh, Tuần Triệt: dễ xa cách, tự lập sớm)*

### 12.5. Tứ hóa tại cung (HOA)

- **[PHUMAU-HOA-01]** Hóa Lộc nhập Phụ Mẫu: cha mẹ có điều kiện, tuổi nhỏ được chăm chút. — *Nguồn: WD12; WD9 (Lộc hỗ trợ cha mẹ/đương số)*
- **[PHUMAU-HOA-02]** Hóa Quyền: cha mẹ có địa vị, uy quyền, có xu hướng áp đặt; đương số nên trao đổi thẳng thắn. — *Nguồn: WD12; WD9*
- **[PHUMAU-HOA-03]** Hóa Khoa: cha mẹ có học thức, danh tiếng; quan hệ êm. — *Nguồn: WD12; WD9*
- **[PHUMAU-HOA-04]** Hóa Kỵ: dễ bất hòa, hiểu lầm với cha mẹ; với Thái Âm Hóa Kỵ thì chú ý quan hệ với mẹ, Thái Dương Hóa Kỵ thì với cha. *(nguồn có câu "tai ương, bệnh tật cho cha mẹ" — không dùng)* — *Nguồn: WD12; WD9*

### 12.6. Điểm còn tranh luận (TRANH)

- **[PHUMAU-TRANH-01]** **Cơ Âm ở Dần, Thân**: TT nói Thiên Cơ đồng Thái Âm thì "miễn hình" (thuận); WD5 (KHHB 41) lại nói Thiên Cơ ở Dần Thân thì bất lợi cho cha mẹ, con nên sống xa. Mặc định: theo TT, ghi chú khả năng sống xa nhà. — *Nguồn: TT; WD5*
- **[PHUMAU-TRANH-02]** **Liêm Phủ và Liêm Tướng**: TT nói Liêm Trinh đồng Thiên Phủ "miễn hình"; WD9 lại nói đồng Thiên Phủ "bất hòa". Với Liêm Tướng, WD9 nói không hòa thuận/tai ương, còn có trang nói cha mẹ khá giả. Chưa đủ nguồn để chốt. — *Nguồn: TT; WD9*
- **[PHUMAU-TRANH-03]** **Khuyên "con lánh xa để đỡ khắc"** (WD5, TT "過房/更名寄養"): đây là tư tưởng hóa giải mang tính tập tục. Nhóm không dùng như lời khuyên định mệnh; chỉ diễn đạt "tự lập sớm có thể hợp với bạn". *(Nhận xét nhóm)* — *Nguồn: WD5; TT*
- **[PHUMAU-TRANH-04]** **Phụ Mẫu là cung "văn thư, giấy tờ"**: một số trang theo phái Tứ Hóa (Khâm Thiên) mở rộng Phụ Mẫu sang giấy tờ, học vấn, cấp trên. Chưa có sách PT gốc để đối chiếu; tạm chỉ dùng nghĩa "bề trên, người đỡ đầu". — *Nguồn: WD9 (nhắc Khâm Thiên mở rộng); PT (chưa đối chiếu)* ⚑1nguồn
- **[PHUMAU-TRANH-05]** **Tang Môn, Bạch Hổ, Thái Tuế cùng Nhật/Nguyệt**: WD5 có câu đoán về biến cố của cha/mẹ. Nhóm không dùng (không dự đoán sinh tử). — *Nguồn: WD5*

---

## Phụ lục A. Ghi chú và nguồn web theo từng phần

### Phần cung 1–3 (mã WM…)

Theo `QUY-UOC.md`. Độ sáng theo bảng mục 6 của `tuvi-an-sao-spec.md` (ký hiệu M/V/Đ/B/H ghi trong ngoặc sau vị trí). Mã nguồn sách: TT, TB, TC như QUY-UOC; mã W… định nghĩa ở cuối file.

Cách đọc nguồn:
- **TT** ở file này là nguyên văn Hán của *Tử Vi Đẩu Số Toàn Thư* trên Wikisource (WM6 = 卷二, WM7 = 卷一), nhóm tự dịch nghĩa; tên thiên ghi bằng chữ Hán để tra lại.
- **TB** lấy từ bản chép trên web, ghi rõ tên mục của sách (WM2, WM3, WM4) hoặc số trang theo người chép (WM5). Chưa đối chiếu bản in.
- TB một phần dựa vào TT, nên hai nguồn này **không hoàn toàn độc lập**. Ở các quy tắc có thêm WM1 (KHHB) hoặc TC (WM8) thì độ tin cậy cao hơn.

---

- **WM1**: "Kinh nghiệm tử vi: Giải đoán cung Phu thê", Trần Việt Sơn thuật theo kinh nghiệm cụ Thái Dương, đăng *Khoa Học Huyền Bí* số 74 (ký hiệu KHHB 74-K2), đăng lại trên diễn đàn Lý số Việt Nam (2012). https://lyso.vn/tu-vi/kinh-nghiem-tu-vi-giai-doan-cung-phu-the-t32224/
- **WM2**: *Tử Vi Đẩu Số Tân Biên* (Thái Thứ Lang), mục "Luận giải cung Huynh Đệ", bản chép trên Tử Vi Cổ Học (bản lưu trữ). https://web.archive.org/web/2023/https://tuvi.cohoc.net/luan-giai-cung-huynh-de-nid-1246.html
- **WM3**: *Tử Vi Đẩu Số Tân Biên*, mục "Luận giải cung Phu Thê", cùng nơi đăng. https://web.archive.org/web/2023/https://tuvi.cohoc.net/luan-giai-cung-phu-the-nid-1245.html
- **WM4**: *Tử Vi Đẩu Số Tân Biên*, mục "Đặc tính của các tinh đẩu", cùng nơi đăng. https://web.archive.org/web/20200224100426/http://tuvi.cohoc.net/dac-tinh-cua-cac-tinh-dau-trong-la-so-tu-vi-nid-1235.html
- **WM5**: Diễn đàn Lý số Việt Nam, chủ đề "Cùng nhau đọc sách Tử Vi Đẩu Số Tân Biên – Thái Thứ Lang" (2011). Người chép ghi số trang theo bản họ có: tr.51 Vũ Khúc, tr.54 Thiên Tướng, tr.55 Thiên Lương, tr.116 phú Tham Lang, tr.266 Phu Thê, tr.324 xem hạn. https://lyso.vn/tu-vi/cung-nhau-doc-sach-tu-vi-dau-so-tan-bien-thai-thu-lang-t17007/
- **WM6**: *紫微斗數全書* 卷二 (Tử Vi Đẩu Số Toàn Thư, quyển 2), nguyên văn trên Wikisource tiếng Trung. Các thiên dùng: 安身命例, 命宫, 兄弟, 妻妾, 子女. https://zh.wikisource.org/wiki/紫微斗數全書/卷二
- **WM7**: *紫微斗數全書* 卷一, Wikisource. Các thiên dùng: 斗数骨髓赋, 女命骨髓赋, 诸星问答论 (化禄, 化权, 化科, 化忌). https://zh.wikisource.org/wiki/紫微斗數全書/卷一
- **WM8**: "Nguyên tắc luận đoán 12 cung", trình bày phương pháp luận Mệnh của Vương Đình Chi (Trung Châu phái), bản dịch trên Lý số Việt Nam. Dùng làm nguồn **TC**. https://lyso.vn/xem-tu-vi/nguyen-tac-luan-doan-12-cung-t103604/
- **WM9**: "Thất Sát" (ghi nguồn lysodoanhnhan.com, tổng hợp từ tài liệu phái Trung Hoa), Lý số Việt Nam (2012). Có nhiều câu đoán nặng, chỉ dùng phần cách cục. https://lyso.vn/tu-vi/that-sat-t32744/

Ghi chú độ tin cậy: WM2, WM3, WM4 là bản chép TB trên một trang thương mại. Câu chữ khớp với đoạn trích có số trang của WM5 (Phu Thê tr.266, Thiên Lương tr.55, Thiên Tướng tr.54, Vũ Khúc tr.51), nhưng chưa đối chiếu bản in. WM6, WM7 là nguyên văn Hán, bản dịch nghĩa là của nhóm.

### Phần cung 4–6 (mã WT…)

Theo `QUY-UOC.md`. Tên sao, độ sáng theo `docs/nghien-cuu/tuvi-an-sao-spec.md` (mục 2.4, 4, 5, 6). Số thứ tự 4–5–6 theo thứ tự cung trong TT (q.2: 四子女, 五財帛, 六疾厄).

Nguồn đã đọc trực tiếp lần này:
- **TB**: bản quét có OCR trên Internet Archive [WT1]; số trang ghi theo dấu trang in trong bản quét (Tật Ách tr. 181–189, Tài Bạch tr. 190–197, Tử Tức tr. 198–207, Phụ luận Tử Tức tr. 228, Phân cục tr. 230–231, Nhận xét tr. 234).
- **TT**: đọc **nguyên bản chữ Hán** trên Wikisource [WT2–WT4], tự dịch nghĩa; không dùng bản dịch Vũ Tài Lục lần này. Ghi mục theo tên thiên trong nguyên bản.
- **NL**: bản quét có OCR trên Internet Archive [WT5], bài "Phụ Mẫu liên quan gì tới Tật Ách" (tr. 129–131).
- Trang web hiện đại (không ghi sách gốc, chỉ dùng làm nguồn phụ đối chiếu): WT6–WT11. WT12 là bản chép lại TB, **không tính là nguồn độc lập**.

Nguyên tắc chung khi dùng tệp này: sách cổ thường nêu **số con cụ thể, bệnh cụ thể, tai nạn, kiện tụng**. Tệp này giữ ý gốc ở dạng trung tính để người viết biết sách nói gì, nhưng **bài luận cho khách chỉ được dùng phần "xu hướng" và "gợi ý"**; không nêu số con, giới tính con, tên bệnh, tai nạn.

---

- **WT1** — *Tử Vi Đẩu Số Tân Biên*, Vân Đằng Thái Thứ Lang, bản quét + OCR, Internet Archive: https://archive.org/details/TuViDdauSoTanBien-VDThaiThuLang-DV (các chương dùng nằm trong tệp `…-dv05_djvu.txt` và `…-dv06_djvu.txt`).
- **WT2** — 紫微斗數全書 卷二 (Wikisource, nguyên bản chữ Hán; các mục 四子女, 五财帛, 六疾厄): https://zh.wikisource.org/wiki/紫微斗數全書/卷二
- **WT3** — 紫微斗數全書 卷一 (太微賦, 斗數準繩, 斗數發微論, 重補斗數彀率, 諸星問答論, 定富局…): https://zh.wikisource.org/wiki/紫微斗數全書/卷一
- **WT4** — 紫微斗數全書 卷三 (谈星要论, 论男女命同异, 论诸星同垣各司所宜…, 财帛, 财宅, 财福): https://zh.wikisource.org/wiki/紫微斗數全書/卷三
- **WT5** — *Tử Vi Nghiệm Lý Toàn Thư*, Thiên Lương, bản quét + OCR, Internet Archive: https://archive.org/details/TViNghihmLToanThu-dv
- **WT6** — tracuutuvi.com, "Cung Tử Tức" (không ghi sách gốc): https://tracuutuvi.com/cung-tu-tuc.html
- **WT7** — tracuutuvi.com, "Cung Tài Bạch" (không ghi sách gốc): https://tracuutuvi.com/cung-tai-bach.html
- **WT8** — tracuutuvi.com, "Cung Tật Ách" (không ghi sách gốc): https://tracuutuvi.com/cung-tat-ach.html
- **WT9** — Master Sean Chan, "ZWDS Health Palace (疾厄宮)": https://www.masterseanchan.com/zwds-palace-health/
- **WT10** — Master Sean Chan, "ZWDS Children Palace (子女宮)": https://www.masterseanchan.com/zwds-palace-children/
- **WT11** — Master Sean Chan, "ZWDS Wealth Palace (財帛宮)": https://www.masterseanchan.com/zwds-palace-wealth/
- **WT12** — xem-tuvi.blogspot.com, "Sao Thất Sát" (chép lại nội dung TB, **không phải nguồn độc lập**, chỉ dùng để xác nhận bản OCR WT1): http://xem-tuvi.blogspot.com/2010/05/sao-that-sat.html

### Phần cung 7–9 (mã WQ…)

Phần nháp của việc L-fcc128, theo `QUY-UOC.md`. Độ sáng theo bảng mục 6 của `tuvi-an-sao-spec.md`; tên sao, tên cung theo spec mục 2.4, 4, 5.

**Cách dùng nguồn trong file này**
- **TB** đọc trực tiếp bản số hóa WQ1 (OCR). Số trang ghi theo số in ở chân trang của bản đó, mục ghi theo đánh số của sách (vd §8.1).
- **TT** đọc nguyên văn chữ Hán bản Wikisource WQ2. *Quyển 2* có danh sách từng sao cho từng cung (七遷移, 八奴僕, 九官祿). *Quyển 1* gồm các phú và thiên *Chư tinh vấn đáp* (諸星問答論). Phần dịch sang tiếng Việt do nhóm làm.
- **KL** đọc bản số hóa WQ3, **NL** đọc bản số hóa WQ4. Trang KL chỉ ghi khi số trang hiện rõ trong bản OCR.
- **KL chép lại TB ở khá nhiều câu**, ví dụ Phá Quân tại Thiên Di giống TB gần như từng chữ. Vì vậy TB và KL trùng nhau không tính là hai nguồn độc lập hoàn toàn. Với chính tinh, ưu tiên cặp TB + TT, vì TT là nguồn gốc chữ Hán độc lập với TB.
- **WQ5** (trang tiếng Anh hiện đại) độ tin cậy thấp: trang này ghi tứ hóa theo "can ngày", sai với mọi phái. Chỉ dùng để tham khảo cách gọi tên nghề hiện đại, không dùng làm nguồn chính.
- Từ cổ được chuyển sang cách nói hiện đại. Ví dụ "võ nghiệp" thành "ngành kỷ luật, vận hành, quân đội/công an", "nô bộc" thành "nhân viên, cấp dưới, đồng nghiệp, bạn bè". Những chỗ chuyển như vậy là *(Nhận xét nhóm, không phải quy tắc gốc)*.

---

| Mã | Nguồn | URL / ghi chú |
|---|---|---|
| TB | *Tử Vi Đẩu Số Tân Biên*, Vân Đằng Thái Thứ Lang | Đọc qua bản số hóa WQ1 |
| TT | *Tử Vi Đẩu Số Toàn Thư* (紫微斗數全書), Hy Di Trần Đoàn | Đọc nguyên văn chữ Hán qua WQ2. Quyển 1: các phú, 諸星問答論; quyển 2: 七遷移, 八奴僕, 九官祿; quyển 3 |
| KL | *Tử Vi Khảo Luận*, Hoàng Thường (bản archive ghi cùng Hàm Chương) | Đọc qua bản số hóa WQ3. Chép lại TB ở nhiều câu, không coi là nguồn độc lập hoàn toàn |
| NL | *Tử Vi Nghiệm Lý Toàn Thư*, Thiên Lương | Đọc qua bản số hóa WQ4 |
| WQ1 | Bản số hóa TB (OCR 6 phần, cung Quan Lộc tr. 158–167, Nô Bộc tr. 168–173, Thiên Di tr. 174–180) | https://archive.org/details/TuViDdauSoTanBien-VDThaiThuLang-DV |
| WQ2 | 紫微斗數全書, Wikisource tiếng Trung (trang xem toàn văn) | https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E6%9B%B8/%E5%85%A8%E8%A6%BD |
| WQ3 | Bản số hóa KL | https://archive.org/details/tuvikhaoluan |
| WQ4 | Bản số hóa NL (3 phần + mục lục) | https://archive.org/details/TViNghihmLToanThu-dv |
| WQ5 | Master Sean Chan, các trang "Star × Palace" (Career/Friends/Travel palace, Hua Lu/Quan/Ke/Ji). **Độ tin cậy thấp**: ghi tứ hóa theo can ngày, nhiều câu "cổ văn" không xác minh được | https://www.masterseanchan.com/zwds-zi-wei-in-career-palace/ (cùng mẫu đường dẫn `zwds-<sao>-in-<career/friends/travel>-palace/`) |

### Phần cung 10–12 (mã WD…)

Phần nháp của việc L-fcc128, theo `QUY-UOC.md`. Ngày soạn: 30/10/2026.

Ghi chú phương pháp:
- **TT** ở file này được đối chiếu trực tiếp trên **nguyên bản Hán** *Tử Vi Đẩu Số Toàn Thư* (Wikisource, WD1–WD3), không qua bản dịch Việt. Tên mục ghi theo nguyên bản: 卷二 "十田宅", "十一福德", "十二父母"; 卷一 "諸星問答論", "定富局/定貴局". Phần dịch nghĩa là của nhóm.
- Độ sáng (miếu/vượng/đắc/bình/hãm) **theo bảng mục 6 của spec**. Sách nói "miếu vượng"/"hãm" mà không nêu cung thì nhóm ghép với bảng spec; chỗ sách khác bảng ghi ở mục Tranh luận.
- Tam hợp, xung chiếu suy ra từ thứ tự cung (spec mục 2.4): cung thứ n hợp với n+4, n+8 và xung n+6.
- Các câu sách gốc nói nặng (khắc cha mẹ, phá sạch, cháy nhà…) đã trung tính hóa, có chú thích.
- Trang Việt WD7–WD12 nhiều đoạn dịch lại từ TT, nên khi chỉ có TT + một trang đó, độ độc lập thấp; nhóm vẫn tính là 2 nguồn nhưng ưu tiên dẫn thêm nguồn Việt độc lập (WD4, WD5, WD6, WD13, WD15) khi có.

---

- **WD1**: *紫微斗數全書/卷二* (Tử Vi Đẩu Số Toàn Thư, quyển 2: các mục 十田宅, 十一福德, 十二父母), Wikisource tiếng Trung, bản sửa 1963110 (cập nhật 04/09/2020) — https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E6%9B%B8/%E5%8D%B7%E4%BA%8C
- **WD2**: *紫微斗數全書/卷一* (諸星問答論, 定富局/定貴局, các câu phú) — https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E6%9B%B8/%E5%8D%B7%E4%B8%80
- **WD3**: *紫微斗數全書/卷三* (cách xem Phúc Đức đối Tài Bạch, 玉袖天香, nữ mệnh) — https://zh.wikisource.org/wiki/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8%E5%85%A8%E6%9B%B8/%E5%8D%B7%E4%B8%89
  (Trong file, các trích "TT (卷一/卷二/卷三 …)" đều đọc trực tiếp từ WD1–WD3.)
- **WD4**: "Từ điển tử vi: Cung Điền Trạch và các cách nhiều nhà, ruộng", lyso.vn, ghi nguồn *Khoa Học Huyền Bí* (KHHB) số 73 C1, 21/3/1973 — https://lyso.vn/xem-tu-vi/tu-dien-tu-vi-cung-dien-trach-va-cac-cach-nhieu-nha-ruong-t32355/
- **WD5**: "Cung Phụ Mẫu đặc biệt xem Nhật, Nguyệt", lyso.vn (đăng lại 20/06/2012), ghi nguồn KHHB số 41, tác giả Anh Việt — https://lyso.vn/tu-vi/cung-phu-mau-dac-biet-xem-nhat-nguyet-t32653/
- **WD6**: "Tử vi đại toàn – phúc đức cung" (紫微大全 福德宮, bản dịch trên diễn đàn) — https://lyso.vn/giao-luu/tu-vi-dai-toan-phuc-duc-cung-t4328/
- **WD7**: "Cung Điền Trạch", tracuulasotuvi.com (dẫn TT, TB, NL) — https://tracuulasotuvi.com/cung-dien-trach.html
- **WD8**: "Cung Phúc Đức", tracuulasotuvi.com (dẫn TT, TB, HS) — https://tracuulasotuvi.com/cung-phuc-duc.html
- **WD9**: "Cung Phụ Mẫu", tracuulasotuvi.com (dẫn TT, HS, NL, KL, TB, Khâm Thiên) — https://tracuulasotuvi.com/cung-phu-mau.html
- **WD10**: "Cung Điền Trạch", thansohoconline.com — https://thansohoconline.com/cung-dien-trach.html
- **WD11**: "Cung Phúc Đức trong Tử Vi", thansohoconline.com (nội dung gần với bản dịch TT/Đại Toàn) — https://thansohoconline.com/cung-phuc-duc.html
- **WD12**: "Cung Phụ Mẫu", thansohoconline.com — https://thansohoconline.com/cung-phu-mau.html
- **WD13**: "Luận Cung Điền Trạch đẹp – Vô Chính Diệu trong Tử Vi", cohoc.vn — https://cohoc.vn/cung-dien-trach/
- **WD14**: "Phúc đức – Luận các sao ở cung Phúc Đức", lyso.vn (ghi gốc tuvilyso.net) — https://lyso.vn/xem-tu-vi/phuc-duc-t32440/ (chỉ dùng phần tâm tính; phần mộ phần không dùng)
- **WD15**: "Đôi điều về 12 cung vô chính diệu", Đặng Xuân Xuyến, đăng lại trên lyso.vn, dẫn *Tử Vi Chân Truyền* và kinh nghiệm cụ Thiên Lương — https://lyso.vn/tu-vi/doi-dieu-ve-12-cung-vo-chinh-dieu-t89110/

Mã sách dùng trong file: **TT** (đọc nguyên bản Hán qua WD1–WD3), **NL** (chỉ gián tiếp qua WD15), **PT** (chỉ gián tiếp qua WD9, WD10). Chưa đối chiếu được bản in TB, NL, CN, KL trong lần này: các trang có bản số hóa TB (dokumen.pub, scribd) chặn truy cập tự động.

## Phụ lục B. Luận thử lá số TC01 (Mệnh, Quan Lộc, Phu Thê)

Bản thử 30/10/2026, Nhóm Nghiên cứu Tử vi. Dữ liệu lấy nguyên từ `tuvi-test-cases.json` (`cases[0].kyVong`), không an lại. Quy tắc lấy từ `luan-giai-12-cung.md`. Độ sáng theo bảng spec mục 6 (như tiêu đề từng sao ở mục 9.2). **Chưa qua chuyên gia duyệt.**

**Tóm tắt lá số.**
- Nữ, Âm Nữ, năm Quý Sửu (Tang Đố Mộc), Thủy Nhị Cục. Mệnh ở Dần (can Giáp), Thân cư Phu Thê ở Tý.
- Mệnh Dần: Tham Lang (đắc) hóa Kỵ, Hỏa Tinh, Hồng Loan, Thiên Không, Cô Thần, Thanh Long, Kiếp Sát, Lưu Hà, Thiên Nguyệt; Tuần ở Dần–Mão. Giáp Mệnh: Sửu (Thái Dương, Thái Âm hóa Khoa, Kình Dương) và Mão (Thiên Cơ, Cự Môn hóa Quyền, Tả Phù, Văn Khúc, Thiên Khôi).
- Quan Lộc Ngọ: Thất Sát (miếu), Đào Hoa, Thiên Quan, Thiên Giải, Địa Giải, Nguyệt Đức, Phi Liêm, Tử Phù. Tài Bạch Tuất: Phá Quân (vượng) hóa Lộc, Địa Kiếp. Thiên Di Thân: Liêm Trinh (vượng), Thiên Hình, Quốc Ấn. Tam phương Mệnh đủ bộ Sát Phá Liêm Tham.
- Phu Thê Tý: Vũ Khúc (vượng), Thiên Phủ (miếu), Lộc Tồn, Địa Không, Thiên Riêu, Thiên Y, Bác Sĩ, Đế Vượng; Triệt ở Tý–Sửu; Kình Dương (Sửu) và Đà La (Hợi) kẹp hai bên. Tứ chính Phu Thê: Quan Lộc Ngọ (xung), Phúc Đức Thìn (Tử Vi, Thiên Tướng cùng vượng), Thiên Di Thân.

### Cung Mệnh (Dần): Tham Lang đắc địa, hóa Kỵ, Tuần

| Yếu tố trên lá số | Mã quy tắc áp dụng |
|---|---|
| Tham Lang (đắc) tọa thủ | MENH-THL-01, CHUNG-CT-THL-01, CHUNG-PP-04 |
| Hỏa Tinh (đắc) đồng cung Tham Lang | MENH-SP-07, CHUNG-SP-03; MENH-CC-06 không đủ điều kiện (Tham chỉ đắc) theo CHUNG-CC-07 |
| Hóa Kỵ tại Mệnh (cung dương, năm âm, không ở tứ mộ: không được giảm nhẹ) | MENH-HOA-04, CHUNG-HOA-03 |
| Tuần ở Dần–Mão | CHUNG-TUAN-02, CHUNG-TUAN-03, CHUNG-TUAN-05, CHUNG-TRANH-02 |
| Thiên Không cùng Hồng Loan | MENH-SP-09 |
| Cô Thần; Thanh Long, Thiếu Dương, Bệnh | CHUNG-SP-08; CHUNG-SP-09 |
| Giáp Khoa (Sửu) – Quyền (Mão) | CHUNG-PP-09, CHUNG-HOA-02 |
| Tam phương Sát Phá Liêm Tham | MENH-YN-01, MENH-CC-07, CHUNG-CC-02 |
| Phá Quân (vượng) hóa Lộc ở Tài Bạch; Địa Kiếp ở Tài Bạch | TAI-PQ-01, CHUNG-HOA-02; CHUNG-PP-07, CHUNG-SP-02 |
| Liêm Trinh (vượng) đơn thủ ở Thiên Di | DI-LT-01, MENH-YN-03 |
| Thân cư Phu Thê | MENH-YN-05, MENH-YN-06, MENH-YN-08, MENH-TRANH-07 |
| Kiếp Sát, Lưu Hà, Thiên Nguyệt | chưa có quy tắc (không luận) → đã bổ sung, xem *Luận thử lại* |

**Luận.** Tham Lang đắc địa thủ Mệnh cho thấy bạn nhiều năng lượng và mong muốn, giao tiếp tốt, có nhiều tài lẻ [MENH-THL-01][CHUNG-CT-THL-01]. Hỏa Tinh đắc địa cùng cung làm bạn nhanh, mạnh, có lúc bứt phá; nhưng Tham chỉ đắc lại hóa Kỵ nên chưa đủ cách Tham Hỏa, cần chú ý tính nóng vội [MENH-SP-07][MENH-CC-06][CHUNG-CC-07]. Hóa Kỵ tại Mệnh khiến bạn hay trăn trở, kỳ vọng cao với chính mình; Toàn Thư khuyên "làm việc chỉ cầu bảy phần" [MENH-HOA-04][CHUNG-HOA-03]. Tuần làm cả mặt mạnh lẫn mặt vướng bận dịu đi, thuận lợi đến chậm và cần tự lực [CHUNG-TUAN-02][CHUNG-TUAN-05]. Phái Việt cho rằng Tuần rõ dần khi trưởng thành; Toàn Thư chỉ coi đó là một yếu tố "không vong" cần xét [CHUNG-TUAN-03][CHUNG-TRANH-02]. Thiên Không gặp Hồng Loan cho thấy bạn cần khoảng lặng riêng và quan tâm đời sống tinh thần [MENH-SP-09]. Hóa Khoa, Hóa Quyền kẹp hai bên Mệnh là thế giáp cát, dễ được người uy tín hỗ trợ [CHUNG-PP-09][CHUNG-HOA-02]. Tam phương đủ Sát Phá Liêm Tham: đời nhiều chuyển động, hợp môi trường cạnh tranh, đổi mới, đi xa lập nghiệp [MENH-CC-07][CHUNG-CC-02]. Phá Quân hóa Lộc ở Tài Bạch cho thấy bạn dám chi để thu, dù Địa Kiếp cùng cung làm thu chi dễ lên xuống [TAI-PQ-01][CHUNG-HOA-02][CHUNG-SP-02]. Liêm Trinh sáng ở Thiên Di báo hiệu ra ngoài dễ gặp quý nhân [DI-LT-01]. Thân cư Phu Thê: càng về sau, người bạn đời càng ảnh hưởng nhiều đến hướng đi của bạn [MENH-YN-08][MENH-TRANH-07].

### Cung Quan Lộc (Ngọ): Thất Sát miếu, thế ngưỡng đẩu

| Yếu tố trên lá số | Mã quy tắc áp dụng |
|---|---|
| Thất Sát (miếu) tại Ngọ | QUAN-TS-01, QUAN-TS-04, CHUNG-CT-TS-01 |
| Thất Sát Ngọ đối Vũ Phủ ở Tý (ngưỡng đẩu) | QUAN-CC-05, CHUNG-CC-06 |
| Tứ chính có Hóa Kỵ (Dần), Địa Kiếp (Tuất), Địa Không và Triệt (Tý) | CHUNG-CC-07, CHUNG-PP-11, CHUNG-PP-07 |
| Vũ Khúc, Thiên Phủ, Lộc Tồn xung chiếu từ Tý | CHUNG-PP-06, CHUNG-CT-VK-01, CHUNG-CT-TP-01 |
| Phá Quân hóa Lộc ở Tài Bạch hội về | CHUNG-SP-07, CHUNG-HOA-02, CHUNG-CT-PQ-01 |
| Tam hợp với Mệnh (Tham Lang) | QUAN-YN-02, QUAN-YN-04 |
| Đào Hoa tại Quan Lộc | QUAN-SP-14 |
| Phi Liêm, Tử Phù, Thai (vòng Tràng Sinh) | CHUNG-SP-09 |
| Cách viết 3 lớp, chuyển nghề hiện đại | QUAN-YN-05, QUAN-YN-06 |
| Thiên Quan, Thiên Giải, Địa Giải, Nguyệt Đức | chưa có quy tắc cho Quan Lộc (không luận) → đã bổ sung, xem *Luận thử lại* |

**Luận.** Thất Sát miếu ở Quan Lộc cho thấy bạn quyết đoán, chịu được áp lực, thích thử thách và hợp vai trò độc lập [QUAN-TS-04][CHUNG-CT-TS-01]. Ngọ đối Vũ Phủ ở Tý nên thuộc thế Thất Sát ngưỡng đẩu, một cách quý về sự nghiệp [QUAN-CC-05][CHUNG-CC-06]. Các sách đánh giá khác nhau: Tân Biên cho Thất Sát ở Tý Ngọ kém Dần Thân, may rủi đi liền; Khảo Luận khen ngưỡng đẩu "rất đẹp" [QUAN-TS-01]. Tứ chính có Hóa Kỵ, Địa Kiếp, Địa Không và Triệt nên cách bị giảm: thành quả đến qua nhiều lần thử và điều chỉnh [CHUNG-CC-07][CHUNG-PP-11]. Vũ Phủ cùng Lộc Tồn chiếu sang thêm óc thực tế, giỏi quản lý tiền và nguồn lực [CHUNG-PP-06][CHUNG-CT-VK-01][CHUNG-CT-TP-01]. Phá Quân hóa Lộc ở Tài Bạch hội về giúp công việc mở ra cơ hội thu nhập [CHUNG-SP-07][CHUNG-HOA-02]. Quan Lộc là tam hợp của Mệnh nên năng lượng Tham Lang được dồn vào công việc [QUAN-YN-02][QUAN-YN-04]. Đào Hoa ở Quan Lộc gợi ý bạn có thể có vị trí khá sớm [QUAN-SP-14]. Hướng nghề hợp: khởi nghiệp, quản lý dự án khó, xử lý khủng hoảng, kinh doanh có chỉ tiêu, y tế cường độ cao; ít hợp việc văn phòng lặp lại [QUAN-TS-04][QUAN-YN-06]. Nên chọn môi trường cạnh tranh, trao quyền chủ động [CHUNG-CC-02][QUAN-YN-05]. Gợi ý: trước mỗi bước bứt phá, hãy chuẩn bị kế hoạch dự phòng [CHUNG-CT-PQ-01].

### Cung Phu Thê (Tý): Vũ Phủ, Lộc Tồn, Triệt, Thân cư

| Yếu tố trên lá số | Mã quy tắc áp dụng |
|---|---|
| Thân cư Phu Thê; xét Mệnh, Thân, Phúc trước | MENH-YN-08, PHU-TRANH-07, PHU-YN-01 |
| Vũ Khúc (vượng) + Thiên Phủ (miếu) | PHU-VK-01, CHUNG-CT-TP-01 |
| Lộc Tồn; Kình Dương – Đà La kẹp hai bên | PHU-SP-04, PHU-CC-02, CHUNG-SP-04, CHUNG-PP-09 |
| Địa Không (Tý, không đắc địa) | PHU-SP-06, CHUNG-SP-03 |
| Thiên Riêu | PHU-SP-11 |
| Triệt ở Tý–Sửu (cùng cung Thân và Lộc Tồn) | PHU-SP-10, CHUNG-TUAN-02, CHUNG-TUAN-03, CHUNG-TUAN-04 |
| Xung chiếu Thất Sát (Ngọ); tam hợp Tử Tướng (Phúc Đức), Liêm Trinh (Thiên Di) | PHU-YN-02, CHUNG-PP-06, PHUC-TV-03, PHUC-TT-01, DI-LT-01 |
| Diễn đạt "muộn", tuổi phối ngẫu, mức "khắc" | PHU-YN-05, PHU-TRANH-01, PHU-TRANH-04 |
| Bác Sĩ, Trực Phù, Đế Vượng | CHUNG-SP-09 |
| Thiên Y; không có Tứ hóa tại cung | chưa có quy tắc Thiên Y ở Phu Thê (không luận) → đã bổ sung, xem *Luận thử lại* |

**Luận.** Thân cư Phu Thê nên người bạn đời ảnh hưởng nhiều đến con đường của bạn, nhưng không có nghĩa là phụ thuộc hay "nhờ chồng" [MENH-YN-08][PHU-TRANH-07]. Vũ Phủ sáng ở đây thường cho thấy người phối ngẫu thực tế, vững tài chính; hai người có lúc khác ý nhưng cùng xây được nền sung túc [PHU-VK-01][CHUNG-CT-TP-01]. Lộc Tồn cùng cung, Kình Đà kẹp hai bên làm cả hai thận trọng nhưng dễ giữ khoảng riêng, nên cần chủ động vun đắp gắn kết [CHUNG-SP-04][CHUNG-PP-09][PHU-CC-02]. Địa Không không đắc địa nhắc bạn chọn bạn đời kỹ, không vội [PHU-SP-06]. Thiên Riêu gợi ý xây dựng tin cậy, rõ ràng trong cam kết [PHU-SP-11]. Với Triệt, lần đầu tiến tới dễ gặp cản trở, nhưng không có nghĩa là thiếu duyên [PHU-SP-10]. Triệt cũng làm bớt cường độ tốt của Vũ Phủ, thường mạnh ở giai đoạn đầu đời rồi nhẹ dần [CHUNG-TUAN-02][CHUNG-TUAN-03]. Triệt rơi vào cung Thân và Lộc Tồn là điểm Toàn Thư dặn xem kỹ [CHUNG-TUAN-04]. Vì vậy nguồn Việt nghiêng về kết hôn khi đã hiểu rõ nhau và sự nghiệp ổn định [PHU-YN-05][PHU-SP-04]. Riêng Lộc Tồn, Tân Biên khuyên cưới muộn, Toàn Thư cho là không trở ngại [PHU-SP-04]. Toàn Thư nói chuyện "khắc" rất nặng; bộ quy tắc theo Tân Biên, Trung Châu, luôn kèm điều kiện [PHU-TRANH-01]. Tử Tướng ở Phúc Đức và Liêm Trinh sáng ở Thiên Di làm nền vững, giảm phần thử thách của cung [PHU-YN-01][PHUC-TV-03][DI-LT-01].

### Nhận xét về bộ quy tắc

**Yếu tố trên lá số chưa có quy tắc** *(bản 30/10 trước bổ sung; đã xử lý ở việc L-297832, xem mục Luận thử lại cuối phụ lục)*
- Mệnh: Kiếp Sát, Lưu Hà, Thiên Nguyệt không xuất hiện ở đâu trong bộ quy tắc (grep = 0). Thanh Long chỉ có trong PHU-SP-05.
- Quan Lộc: Thiên Quan chỉ có trong QUAN-CC-06 (nghề y), Thiên Giải chỉ xuất hiện 1 lần, Nguyệt Đức = 0; Thiên Y chỉ có trong QUAN-SP-13. Bộ "giải thần" (Thiên Giải, Địa Giải, Nguyệt Đức, Thiên Đức) chưa có quy tắc chung.
- Không có quy tắc cho chính tinh cụ thể hóa Kỵ (ở đây là Tham Lang hóa Kỵ). MENH-HOA-04 chỉ nói Kỵ chung, chưa phân biệt sao bị hóa.
- Thân bị Triệt, Lộc Tồn bị Triệt: CHUNG-TUAN-04 chỉ nói "cần xem kỹ", chưa có hướng luận.
- Vũ Phủ gặp Triệt hoặc Địa Không ở Phu Thê: chỉ có quy tắc cho Mệnh (MENH-TP-02 "kho thủng") và Tử Phủ gặp Không Kiếp (PHU-CC-03). Chưa có quy tắc Thiên Phủ ở Tý, Ngọ tại Phu Thê (PHU-TP chỉ có Tỵ Hợi, Sửu Mùi Mão Dậu).

**Quy tắc mơ hồ hoặc mâu thuẫn khi kết hợp**
- Cung có cả sao tốt lẫn Hóa Kỵ gặp Tuần (Mệnh TC01): CHUNG-TUAN-02 chỉ chia hai trường hợp "sao tốt bị giảm" và "sao xấu bớt xấu", không nói cung có cả hai thì luận ra sao.
- MENH-CC-06 (Tham Hỏa) đòi Tham Lang miếu, vượng. Chưa rõ Tham Lang đắc (Dần, Thân) có được tính không, và Kỵ đồng cung có làm phá cách không.
- CHUNG-PP-09 ghi giáp "Khoa Quyền Lộc". Chưa rõ giáp chỉ hai hóa (Khoa–Quyền) có được tính là giáp cát không.
- Phá cách (CHUNG-PP-11, CHUNG-CC-07) chưa định lượng. Ở TC01, Quan Lộc có Kỵ, Kiếp ở tam hợp và Không, Triệt ở cung xung: chưa rõ đây là giảm nhẹ hay phá hẳn cách ngưỡng đẩu.
- Quy tắc QUAN-…, PHU-… chỉ viết cho sao tọa thủ. Sao và hóa ở cung xung chiếu, tam hợp (Lộc Tồn, Triệt chiếu Quan Lộc; Thất Sát chiếu Phu Thê) chỉ có trọng số định tính ở CHUNG-PP-06. Chưa rõ Tuần, Triệt ở cung xung có làm giảm lực chiếu hay không.
- Về mốc tuổi: CHUNG-TUAN-03 nêu mốc khoảng 30 tuổi, còn MENH-TRANH-07 và PHU-YN-05 dặn không chốt tuổi. Cần một quy ước diễn đạt chung.
- QUAN-TS-01 gộp ý TB ("Tý Ngọ kém hơn, may rủi") với KL ("ngưỡng đẩu Tý Ngọ rất đẹp"). Hai sách đánh giá khác nhau nhưng mục QUAN-TRANH chưa ghi.
- QUAN-SP-14 viết "Thai, Tọa", không rõ là Tam Thai – Bát Tọa hay sao Thai của vòng Tràng Sinh. TC01 có sao Thai (Tràng Sinh) ở Ngọ.
- MENH-SP-09 ("thích ẩn dật, lòng muốn tu") cần trung tính hóa thêm trước khi đưa cho AI.
- Độ sáng Không Kiếp, Hỏa Linh chỉ suy ra được từ danh sách "đắc ở…" (CHUNG-SP-03). Chưa có bảng hãm rõ ràng nên AI dễ tự suy.

**Đề xuất bổ sung (chuyển nhóm soạn quy tắc, không sửa trong bài này)**
- Thêm mục CHUNG cho "sao ở cung xung chiếu, tam hợp": hệ số ảnh hưởng, kèm cách xử lý Tuần, Triệt và Tứ hóa ở các cung đó.
- Thêm quy tắc "chính tinh × Hóa Kỵ" cho 10 sao có thể hóa Kỵ (bảng phái Việt), ít nhất ở Mệnh, Quan, Phu.
- Thêm quy tắc chung cho bộ giải thần, Thiên Quan – Thiên Phúc, Thiên Y, Lưu Hà, Kiếp Sát, Thiên Nguyệt. Nếu không tìm được 2 nguồn thì ghi rõ "không luận".
- Ghi rõ điều kiện tối thiểu của các cách Tham Hỏa, giáp Khoa Quyền, ngưỡng đẩu; định nghĩa thế nào là "phá cách".
- Thêm QUAN-TRANH (TB và KL về Thất Sát ở Tý Ngọ) và quy ước một mẫu câu chung cho các mốc tuổi của Tuần, Triệt và cung Thân.

### Luận thử lại sau bổ sung quy tắc (30/10/2026, việc L-297832)

Cùng dữ liệu TC01, chỉ luận lại các yếu tố trước đây "chưa có quy tắc" hoặc quy tắc mơ hồ. Mã quy tắc mới nằm ở phần 0 (CHUNG) và cung Phu Thê.

| Yếu tố (trước đây chưa có hoặc mơ hồ) | Quy tắc áp dụng bây giờ |
|---|---|
| Mệnh: Tham Lang hóa Kỵ | CHUNG-HOA-THL-01, CHUNG-HOA-06, CHUNG-HOA-VK-01 (Tham/Vũ hóa Kỵ ở tứ sinh có sát) |
| Mệnh: Kiếp Sát; Lưu Hà (cùng Thanh Long, Hóa Kỵ); Thiên Nguyệt | CHUNG-SP-11; CHUNG-SP-12, CHUNG-TRANH-11; CHUNG-SP-18 (không luận) |
| Mệnh: cả sao tốt và Hóa Kỵ cùng gặp Tuần | CHUNG-TUAN-06, CHUNG-TUAN-09 |
| Mệnh: Tham Hỏa khi Tham chỉ đắc, có Kỵ | CHUNG-CC-09 (không gọi tên cách), CHUNG-CC-08 |
| Mệnh: giáp Khoa (Sửu) – Quyền (Mão), Mệnh có Kỵ | CHUNG-CC-10 |
| Quan Lộc: ngưỡng đẩu có Kỵ, Kiếp ở tam hợp; Không, Triệt ở cung xung | CHUNG-CC-11, CHUNG-CC-08 (mức 2), CHUNG-TP-03, CHUNG-TP-04, CHUNG-TP-05, CHUNG-TP-06, CHUNG-TRANH-12 |
| Quan Lộc: Lộc Tồn, Vũ Phủ chiếu từ cung có Triệt | CHUNG-TP-02, CHUNG-TP-05 |
| Quan Lộc: Thiên Quan; Thiên Giải, Địa Giải, Nguyệt Đức | CHUNG-SP-16; CHUNG-SP-14, CHUNG-SP-15 |
| Phu Thê: Thiên Phủ ở Tý (Vũ Phủ); Vũ Phủ gặp Triệt, Địa Không | PHU-TP-03; PHU-CC-07 |
| Phu Thê: Thân bị Triệt; Lộc Tồn bị Triệt | CHUNG-TUAN-07; CHUNG-TUAN-08 |
| Phu Thê: Thiên Y (cùng Thiên Riêu) | CHUNG-SP-17 |
| Phu Thê: Thất Sát xung chiếu | CHUNG-TP-01, CHUNG-TP-02 |
| Mốc tuổi Tuần, Triệt, cung Thân | CHUNG-TUAN-03 (đã bỏ mốc 30 tuổi), CHUNG-TUAN-09 |
| Độ sáng Địa Không ở Tý, Hỏa Tinh ở Dần | CHUNG-SP-10 (Không hãm ở Tý; Hỏa đắc ở Dần) |

**Mệnh (đoạn thay thế).** Tham Lang hóa Kỵ cho thấy mong muốn của bạn lớn và nhiều hướng, dễ cảm thấy chưa thỏa; nên chọn một mục tiêu chính và cẩn trọng trong chuyện tình cảm, tiền bạc [CHUNG-HOA-THL-01][CHUNG-HOA-06]. Tham Lang hóa Kỵ ở cung tứ sinh, có Hỏa Tinh cùng cung, theo Toàn Thư là người hợp nghề đòi hỏi tay nghề tinh xảo, kỹ thuật [CHUNG-HOA-VK-01]. Tham Lang chỉ đắc địa và có Kỵ nên không gọi là cách Tham Hỏa, chỉ luận là Tham Lang gặp Hỏa Tinh: nhanh, mạnh, dễ nóng vội [CHUNG-CC-09][MENH-SP-07]. Tuần làm dịu cả hai mặt: điểm mạnh cần thời gian để bộc lộ, điểm vướng của Kỵ cũng nhẹ hơn [CHUNG-TUAN-06]. Ảnh hưởng này thường rõ hơn về sau, mỗi người cảm nhận khác nhau [CHUNG-TUAN-09]. Kiếp Sát thêm tính quyết liệt; nên tránh quyết định gấp và cẩn thận với máy móc, vật sắc [CHUNG-SP-11]. Lưu Hà cho bạn tài ăn nói, thuyết phục; gặp Thanh Long là dấu hiệu có cơ hội tốt [CHUNG-SP-12]. Khoa, Quyền kẹp hai bên vẫn là thế giáp cát, nhưng vì Mệnh có Kỵ nên bạn cần chủ động đón nhận sự giúp đỡ [CHUNG-CC-10]. Thiên Nguyệt: không luận [CHUNG-SP-18].

**Quan Lộc (đoạn thay thế).** Thất Sát miếu ở Ngọ đối Vũ Phủ là thế ngưỡng đẩu [CHUNG-CC-11]. Tứ chính có Hóa Kỵ (Mệnh) và Địa Kiếp (Tài Bạch) ở tam hợp, Địa Không ở cung xung: điểm phá 1 + 1 + 1 = 3; Triệt ở Tý không tính vì không chiếu; không yếu tố nào tọa thủ Quan Lộc, Kỵ không hóa vào Thất Sát. Theo CC-08 đây là mức 2, thành cách nhưng có khuyết: tiềm năng của cách có, nhưng thành quả đến qua nhiều lần thử và điều chỉnh [CHUNG-CC-08][CHUNG-TP-06]. Triệt ở Tý chỉ tác động cung Tý, Sửu, không chiếu sang Quan Lộc; nhưng Vũ Phủ và Lộc Tồn ở Tý đã bị Triệt nên sự hỗ trợ tài chính, quản lý chiếu sang đến chậm hoặc không trọn vẹn [CHUNG-TP-04][CHUNG-TP-05]. Tân Biên và Khảo Luận đánh giá Thất Sát ở Tý Ngọ khác nhau [CHUNG-TRANH-12]. Thiên Quan cùng Thiên Giải, Địa Giải, Nguyệt Đức: khi công việc gặp khó, bạn dễ có người giúp hoặc tìm được lối tháo gỡ; hợp môi trường có yếu tố chăm sóc, phục vụ cộng đồng [CHUNG-SP-16][CHUNG-SP-14][CHUNG-SP-15].

**Phu Thê (đoạn thay thế).** Vũ Phủ ở Tý: đôi lúc khác quan điểm nhưng cùng xây nền tảng sung túc; Toàn Thư coi Vũ Phủ Tý Ngọ là cách tài quan với tuổi Quý [PHU-TP-03]. Triệt và Địa Không cùng cung làm "kho" giảm: tài chính chung nên minh bạch, thống nhất cách quản lý, có quỹ dự phòng [PHU-CC-07]. Lộc Tồn bị Triệt: kiếm được nhưng cần kỷ luật tài chính, tự lực [CHUNG-TUAN-08]. Thân ở cung có Triệt: đường đi đầu có nhiều lần làm lại, bền bỉ thì về sau thông suốt hơn [CHUNG-TUAN-07][CHUNG-TUAN-09]. Thiên Y cùng Thiên Riêu: người bạn đời hoặc chuyện chung có yếu tố chăm sóc sức khỏe; nên quan tâm sức khỏe của nhau [CHUNG-SP-17]. Thất Sát xung chiếu từ Ngọ thêm tính độc lập, quyết đoán cho quan hệ, nhưng chỉ là yếu tố hội chiếu, không đổi tính chất Vũ Phủ [CHUNG-TP-01][CHUNG-TP-02].

**Kết quả kiểm tra.** Tất cả yếu tố trên ba cung đều đã có mã quy tắc; không còn dòng "chưa có quy tắc" (Thiên Nguyệt có quy tắc "không luận", CHUNG-SP-18). Điểm còn phụ thuộc quy ước nhóm, cần chuyên gia duyệt: cách tính điểm phá ở CC-08 (Quan Lộc TC01 được 3 điểm, sát ngưỡng 4), TP-05.

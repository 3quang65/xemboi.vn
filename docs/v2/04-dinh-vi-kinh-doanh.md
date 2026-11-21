# Giai đoạn 4: Định vị và Mô hình kinh doanh cho `xemboi.vn` v2 *(Bản sửa sau phản biện 04b)*

> Ngày cập nhật: **20/11/2026** · Cơ sở đầu vào: [`01-kiem-ke.md`](01-kiem-ke.md), [`02-thi-truong.md`](02-thi-truong.md), [`03-khach-hang.md`](03-khach-hang.md), [`bang-chung/trich-dan-khach-hang.md`](bang-chung/trich-dan-khach-hang.md), và phản biện độc lập [`04b-phan-bien.md`](04b-phan-bien.md).
> Bảng tính đối chiếu mở bằng Excel: [`04-kinh-te-don-vi.csv`](04-kinh-te-don-vi.csv).
> Nguyên tắc minh bạch: Mọi con số đều kèm nguồn (link trang cụ thể + ngày tra `20/11/2026`) hoặc gắn nhãn **[GIẢ ĐỊNH]** / **[SUY LUẬN]** / **[CHƯA KIỂM]**. Toàn bộ kết luận trước khi chạy thí nghiệm R1 và 20 cuộc phỏng vấn đều là **giả thuyết cần kiểm chứng** (theo cảnh báo lệch nguồn **R8** của 03).

---

## 1. Câu định vị một dòng

> **Dành cho người trẻ đang băn khoăn về công việc, tình cảm hoặc năm mới (P1) và người tự tra lá số kỹ tính (P2), `xemboi.vn` giúp đọc hiểu lá số Tử Vi rõ căn cứ từng sao–cung bằng ngôn ngữ đời sống, khác biệt ở cam kết công khai phương pháp, tuyệt đối không hù dọa và không bán lễ giải hạn.**

- **Dành cho ai:** Persona chính **P1 "Linh"** (người trẻ 22–35 tuổi đang lận đận, cần góc nhìn định hướng) và persona phụ **P2 "Tuấn"** (người biết cơ bản về lá số, khó tính về độ chuẩn).
- **Giải quyết việc gì:** Chuyển lá số Tử Vi phức tạp thành bản định hướng cụ thể theo từng mảng đời sống và vận năm 2027 (Đinh Mùi), giúp người dùng bớt hoang mang mà tự ra quyết định.
- **Khác đối thủ ở đâu:** (1) Mọi kết luận chính đều **gắn nhãn căn cứ sao–cung–Tứ Hóa** (khác văn chung chung "như AI" `#14, #15, #18, #22` và lời đoán mò `#78`); (2) **Công khai quy ước học thuật** Nam Phái, xử lý rõ tháng nhuận & giờ Tý (`#1, #24, #33, #46`); (3) **Tuyệt đối không hù dọa, không bán lễ/vật phẩm** (`#54–59, #66, #89`).

---

## 2. So sánh 3 hướng định vị và quyết định chọn

Thang điểm 1–5 (5 = thuận lợi nhất; cột "Rủi ro pháp lý & Ads": 5 = an toàn nhất). Mọi điểm là **[SUY LUẬN]** từ 02 và 03; có tính tới **cảnh báo R8 của 03** (bộ 101 trích dẫn lệch nguồn: 52 từ App Store, 30 từ báo chọn chuyện bị lừa, 19 từ Voz; thiếu Android/Facebook/TikTok).

| Tiêu chí | Hướng A: **Tử vi minh bạch, không hù dọa** *(Đề xuất)* | Hướng B: **Trợ lý chọn ngày cho việc hệ trọng** | Hướng C: **Lá số đẹp làm quà / thẻ chia sẻ** |
| :--- | :--- | :--- | :--- |
| **Khớp bằng chứng 03** | **4/5** *(hạ từ 5/5 vì R8)* — Khớp 3 cụm lớn của 03: sợ bị dọa moi tiền (**16 câu**: `#30, #54–59, #61, #62, #66, #68, #69, #73, #85, #88, #89`, lưu ý 21/26 câu ở chủ đề 1+4 đến từ báo), lo âu cần định hướng (**10 câu**: `#53, #60, #65, #67, #71, #72, #77, #99–101`), và cụm chất lượng–minh bạch–độ chuẩn (**23 câu** = chủ đề 5+7+9 của 03: `#16, #28, #76, #78, #83, #84, #93, #94, #97`; `#14, #15, #18, #19, #21–23, #26`; `#1, #20, #24, #25, #33, #46`). | **3/5** — Khớp P4 (**12 câu**: `#74, #75, #86–95`, chủ yếu xem tuổi cưới để thuyết phục cha mẹ `#90`). Chưa có trích dẫn riêng về xây nhà hay khai trương (03 mục 2). | **2/5** — Bằng chứng mỏng: chỉ có **3 câu** gián tiếp về lưu ảnh đẹp (`#27`), giao diện trẻ (`#35`) và rủ bạn dùng (`#9`). Chưa có trích dẫn nào cho thấy người Việt mua lá số làm quà tặng. |
| **Quy mô nhu cầu** | **4/5** — VnExpress 05/03/2025 dẫn khảo sát 2023 (nêu ở 03, không nêu cỡ mẫu): 84% người xem bói dưới 30 tuổi (39% tình cảm, 23% công việc). Cao điểm lặp lại mỗi dịp cuối/đầu năm (`#60, #63, #67`). | **3/5** — Nhu cầu thật nhưng gắn sự kiện hiếm (cưới hỏi, làm nhà — 1–2 lần/đời), tần suất quay lại thấp (P4 điểm quay lại 1/5 ở 03). | **2/5** — Nhu cầu giải trí/tò mò theo trào lưu `[SUY LUẬN]`; khó giữ doanh thu ổn định. |
| **Sẵn lòng trả** | **3/5** — Báo *Tuổi Trẻ* (10/02/2025, dẫn ở 02) ghi nhận mức **100.000đ/5 phút** xem livestream với người thật (`#68, #69` là *diễn giải* nên không dùng làm trích dẫn giá); `#71` cho thấy có người trả để mua sự yên tâm. Giá niêm yết tham khảo trên App Store *Thái Âm* 49k–599k (chỉ là giá niêm yết, không phải bằng chứng doanh thu thật). **Rủi ro R1:** chưa có bằng chứng trả tiền cho bản luận tự động *vì sự minh bạch*. | **4/5** — Lịch Việt niêm yết "Chọn ngày tốt" 135k/3 tháng – 280k/năm; thầy 1-1 100k–300k (`#90`). Nhưng người quyết định là cha mẹ, khó tin website lạ (03). | **2/5** — Ngưỡng chi trả cho đồ giải trí tại VN thấp (tham chiếu mức mặc định 20k của *Chợ Tử Vi* ở 02) `[SUY LUẬN]`. |
| **Đối thủ đang chiếm** | **Còn khe hở:** *Chợ Tử Vi* rẻ (mặc định 20k) nhưng thiếu chiều sâu/giữ chân; *Tra Cứu Tử Vi* (680k, báo cáo 200–500 trang) gạch giá gây cảm giác ép mua; *Thái Âm* bị chê văn AI sơ sài (`#14–22`); *LySo.vn* chỉ lập lá số không luận cho người phổ thông (02). | **Rất chật:** *Lịch Việt* (5Tr+ tải Android, có sẵn chọn ngày 50–59 việc đại sự), *Lịch Ngày Tốt* phủ SEO, và thầy quen/chùa chiếm niềm tin cha mẹ (02, `#86, #95`). | **Vắng đối thủ lớn** tại VN (*Co-Star* thành công ở Mỹ ~4,3M MAU — 02), nhưng vắng có thể vì thị trường chưa sẵn sàng trả tiền. |
| **Rủi ro pháp lý & Ads (theo 02)** | **4/5** — Định vị "tham khảo văn hóa & định hướng cá nhân, không hù dọa, không bán lễ" né được Điều 174 BLHS, Luật Quảng cáo 75/2025 và Meta *Prohibited Commercial Practices*. Vẫn phải tránh *Personal Attributes* trên Meta và không chạy TikTok Paid Ads bói toán. | **4,5/5** — "Xem ngày tốt/lịch vạn niên" lành về pháp lý & quảng cáo; chỉ cần tránh phán "tuổi đại hung" gây chia tay (`#75, #86`). | **5/5** — Thuần thẩm mỹ/giải trí, gần như không vướng rủi ro quảng cáo (vẫn tuân thủ Luật 91/2025). |
| **Tổng điểm** | **19,0 / 25 (CHỌN LÀM GIẢ THUYẾT CHÍNH)** | **17,5 / 25** | **14,0 / 25** |

### Quyết định & Điều kiện đổi hướng (thống nhất 100% với 03 mục 6 và mục 6 dưới đây)
- **Chọn Hướng A ("Tử vi minh bạch, không hù dọa")** làm giả thuyết định vị chính để kiểm chứng bằng R1 và 20 phỏng vấn.
- **Bộ tiêu chí đổi hướng / dừng (trả về đúng tiêu chí chặt của 03, KHÔNG nới lỏng):**
  1. **DỪNG mô hình thu tiền trực tiếp:** Nếu **< 4/20** người phỏng vấn từng trả bất kỳ khoản nào cho buổi xem trong 12 tháng (đúng 03 dòng 198), **HOẶC** thí nghiệm R1 ở mục 6 rơi vào mức **TRƯỢT** (`< 2,5%` bấm mua trên lá số tạo).
  2. **Đổi sang P2 làm chính (công cụ lá số chuẩn & đối chiếu học thuật):** Nếu P1 trượt tiêu chí chi tiền (`< 6/20` chi ≥ 50k), nhưng **≥ 5/20** tự lập lá số và **≥ 3/20** đã trả tiền cho app/luận giải (đúng 03 dòng 195).
  3. **Đổi sang Hướng B (P4 — chọn ngày/xem tuổi cho gia đình):** Nếu **≥ 8/20** cho biết lần chi gần nhất là xem tuổi/xem ngày cho sự kiện và cha mẹ là người quyết định/trả tiền (đúng 03 dòng 196).
  4. **Giới hạn thử lại:** Nếu R1 rơi vào vùng **CHƯA RÕ**, chỉ được chỉnh và chạy lại **tối đa 1 vòng**; không đạt thì đổi hướng hoặc dừng.

---

## 3. Mô hình doanh thu cụ thể (VNĐ)

### 3.1. Ranh giới Miễn phí vs. Trả phí

| Tầng | Người dùng nhận được gì? | Mục tiêu & Ràng buộc thực tế |
| :--- | :--- | :--- |
| **MIỄN PHÍ**<br>*(Không bắt đăng ký, không đòi tên thật / SĐT — tuân thủ Luật 91/2025/QH15)* | 1. **Lá số Tử Vi 12 cung đầy đủ 100% sao** (14 chính tinh, phụ tinh, Tứ Hóa, Tuần/Triệt, Đại/Tiểu hạn, Lưu Niên 2027), công khai quy ước Nam Phái, giải thích rõ tháng nhuận & giờ Tý (`#1, #22, #24, #25, #33, #46`).<br>2. **Chế độ "Chưa rõ giờ sinh":** vẫn xem được tổng quan miễn phí theo ngày–tháng–năm sinh (Can Chi, Ngũ Hành, trục vận 2027) và nêu rõ giới hạn không an được 12 cung (`#48`).<br>3. **Khoảnh khắc "trúng" miễn phí:** 3 nhận định cốt lõi về Mệnh–Thân và 1 chủ đề năm 2027 có ghi rõ sao–cung căn cứ, lấy từ **kho văn tĩnh tự biên soạn sạch (0đ chi phí AI)** để chống spam.<br>4. Không quảng cáo pop-up che màn hình (`#10, #11, #36`). | Tạo khoảnh khắc "nói trúng" (`#8, #32, #82`) và chứng minh độ chuẩn học thuật cho P2 **trước khi thấy giá**. |
| **TRẢ PHÍ**<br>*(Trả 1 lần qua VietQR SePay; bản ra mắt Tết xuất **trang kết quả HTML in được**)* | 1. **Bản luận giải chuyên sâu có dẫn chứng:** Mọi mục luận giải chính bắt buộc gắn nhãn `[Căn cứ: Cung X – Sao Y – Hóa Z]` trước khi dịch sang ngôn ngữ đời sống & gợi ý hành động (`#16, #18, #22`).<br>2. **Lộ trình 12 tháng năm 2027 (Đinh Mùi):** Giai đoạn thuận và giai đoạn cần giữ nhịp (không hù dọa).<br>3. **Hỏi đáp bám sát lá số (8 lượt ở Gói 2):** Khách hỏi về hoàn cảnh thật; có ô đồng ý riêng cho dữ liệu nhạy cảm và lọc tên/SĐT trước khi gọi API.<br>4. **Lưu link xem lại trong 3 năm** (có gia hạn theo yêu cầu + nút xóa dữ liệu ngay lập tức 1 chạm — tránh nghĩa vụ lưu vô thời hạn và tuân thủ Luật 91/2025, `#51, #96`). | Chi phí AI bản Gói 2 khoảng **~1,9% giá bán** với `Gemini 3.5 Flash-Lite` (hoặc **~7,1%** nếu phải nâng lên `Gemini 3.8 Flash` giá 2027 — xem mục 4.1). |

- **Xử lý người không biết giờ sinh ở tầng trả phí (R4 — sửa theo N9):** Ở bản ra mắt Tết 2027, **KHÔNG bán Gói 2 (luận 12 cung) cho người không biết giờ sinh** (chỉ cung cấp bản miễn phí theo ngày–tháng–năm sinh và giải thích minh bạch lý do để không bán kết quả sai lệch). Hệ thống sẽ đo chính xác tỷ lệ chọn "chưa rõ giờ sinh" trên phễu cùng câu 10 phỏng vấn 03: nếu nhóm này chiếm **≥ 50% (≥ 10/20)**, sau Tết sẽ bổ sung 1 gói trả phí riêng *"Vận 2027 theo Ngày Sinh (Can Chi – Ngũ Hành)"* (dự kiến 49.000đ–79.000đ, ghi rõ giới hạn không có 12 cung).

### 3.2. Bảng giá & Lộ trình mở gói (đặt cạnh đối thủ thật)

> **Phạm vi ra mắt Tết 2027 (sửa theo C4):** Để 1 người kịp triển khai chất lượng trước tháng Chạp, bản ra mắt Tết **chỉ mở duy nhất Gói 2 (149.000đ)** (hoặc đổi sang 79.000đ nếu thí nghiệm R1 cho thấy nút 79k áp đảo nút 149k). **Gói 1 lẻ và Gói 3 hoãn mở rộng sang Quý 2/2027.** Bảng dưới trình bày đủ 3 gói cho lộ trình cả năm để tính kinh tế đơn vị so sánh.

| Gói `xemboi.vn` v2 | Giá niêm yết | Trạng thái ra mắt | Nội dung chi tiết | Đối thủ gần nhất (giá niêm yết / báo chí, tra 20/11/2026) |
| :--- | :---: | :---: | :--- | :--- |
| **Gói 2: Lá Số Chuyên Sâu + Vận 2027** *(Chủ lực)* | **149.000đ** | **Mở ngay bản Tết 2027** | Toàn bộ 12 cung có nhãn căn cứ sao–cung–Tứ Hóa + Đại vận 10 năm + Lộ trình 12 tháng 2027 + **8 câu hỏi riêng** + Trang HTML in được & link lưu 3 năm. | - *Thái Âm (App Store, giá niêm yết):* Khởi Đầu **99k**, Gói Bạc **120k**, Vận 2 năm **199k**, Vàng **240k**.<br>- *Lịch Việt (App Store, giá niêm yết):* Chọn ngày 3th **135k**, 1 năm **280k**.<br>- *Chợ Tử Vi (cùng kênh web + VietQR):* mặc định **20k** (gói 149k cao gấp ~7,5× nên bắt buộc vượt trội độ sâu).<br>- *Thầy 1-1:* **100k – 300k** / chủ đề (02).<br>*(Không so trực tiếp với Tra Cứu Tử Vi 680k vì đó là báo cáo 200–500 trang khác loại).* |
| **Gói 1: Vận Hạn 2027 (Đinh Mùi)** | **79.000đ** | *Hoãn sau Tết* *(trừ khi R1 chọn 79k làm gói duy nhất)* | Luận sâu Lưu Niên 2027 (4 mảng + 12 tháng) + **3 câu hỏi riêng** + Trang HTML in được. | - *Chợ Tử Vi:* 10k / **20k** / 50k / 100k.<br>- *TuVi.vn:* Chợ Lá Số từ **50k**.<br>- *Thái Âm (niêm yết):* Khởi Đầu sale **49k** / Đồng **60k** / gốc **99k**.<br>- *Xem Bói, Tướng Số (niêm yết):* **39k / 79k**.<br>- *Livestream người thật:* **100k** / 5 phút (*Tuổi Trẻ* 10/02/2025, 02). |
| **Gói 3: Gói Đôi / Gia Đình (3 lá số + 1 cặp so hợp)** | **299.000đ** | *Hoãn Quý 2/2027* | **3 bản Gói 2 đầy đủ** (cho bản thân + 2 người thân) + **Phân tích hợp–khác cho 1 cặp chọn trước** theo góc nhìn ứng xử + **15 câu hỏi riêng**. | - *Lịch Việt (niêm yết):* Nâng Cao Trọn Đời **390k**.<br>- *Thái Âm (niêm yết):* Trọn Đời **399k – 599k**.<br>- *Xem Bói, Tướng Số (niêm yết):* Trọn Đời **499k**. |

- **Lưu ý về neo giá:** Mức sẵn lòng trả ước đoán ở 03 vốn được suy ra từ giá niêm yết đối thủ, **không phải bằng chứng độc lập**. Giá cuối cùng phải dựa trên tín hiệu từ thí nghiệm R1 (mục 6). Tuyệt đối không gạch giá ảo hay đặt đồng hồ đếm ngược giả.

### 3.3. Hình thức thu tiền & Chính sách hoàn tiền (đã sửa theo N8)
- **Chọn mua lẻ trả 1 lần (One-time purchase):** Phù hợp hành vi xem theo sự kiện/năm mới (Linghit, Click108 ở 02), khớp hạ tầng VietQR SePay (không có auto-renew), và tránh cảm giác "bẫy gia hạn tự động" kiểu *Nebula* (02).
- **Chính sách hoàn tiền kiểm chứng được (công khai trước khi thanh toán):**
  - **Hoàn 100% trong 7 ngày** về đúng tài khoản ngân hàng đã chuyển trong 48 giờ làm việc nếu xảy ra một trong các điều kiện **đo được**:
    1. **Lỗi kỹ thuật / học thuật:** Đổi sai lịch Âm–Dương, sai an sao so với quy ước Nam Phái công bố, hoặc hệ thống không trả đủ báo cáo/8 lượt hỏi đáp.
    2. **Không đạt cam kết "có căn cứ":** Có ít nhất 1 phần luận giải chính (Mệnh–Thân, Quan Lộc, Tài Bạch, Phu Thê hoặc Vận 2027) **thiếu nhãn căn cứ `[Cung – Sao]`** hoặc sai thông tin đầu vào khách đã nhập.
  - **Giới hạn chống lạm dụng:** Tối đa **1 lần hoàn tiền / số tài khoản ngân hàng chuyển tiền** (vì sản phẩm không bắt tạo tài khoản).

### 3.4. Danh sách KHÔNG bán và lý do

| Hạng mục tuyệt đối KHÔNG bán | Lý do (Pháp lý – Định vị – Nền tảng) |
| :--- | :--- |
| **1. Lễ cúng giải hạn, cắt duyên âm, dâng sao giải hạn online** | Rủi ro trực diện Điều 174 BLHS và Luật Quảng cáo 75/2025/QH15 (02 mục 4.1); đây là nỗi sợ lớn nhất của P1 (`#54–59, #66, #89`). |
| **2. Vật phẩm phong thủy gắn mác "trừ tà, đổi vận, hóa giải hạn"** | Mâu thuẫn trực diện định vị trung lập; vi phạm chính sách Meta/Google (*Prohibited Commercial Practices* / *Unreliable claims*, 02). |
| **3. Tư vấn y tế, chẩn đoán bệnh, khuyến nghị đầu tư, phán quyết sống–chết / chia tay** | Gây hại thực tế (`#65, #75, #86`). Mọi câu hỏi về triệu chứng bệnh lý phải hiện khuyến nghị gặp bác sĩ. |

---

## 4. Kinh tế đơn vị (Unit Economics — cập nhật theo C3, N2, N3, N4, N7, N8)

> Toàn bộ bảng tính được đồng bộ sang [`04-kinh-te-don-vi.csv`](04-kinh-te-don-vi.csv) (UTF-8 có BOM, mở trực tiếp bằng Excel).
> **Tỷ giá tham chiếu:** `1 USD = 25.940 VNĐ` (Vietcombank bán ra ngày 20/11/2026 tại [`portal.vietcombank.com.vn/Personal/TG/Pages/ty-gia.aspx`](https://portal.vietcombank.com.vn/Personal/TG/Pages/ty-gia.aspx)).

### 4.1. Chi phí AI cho một bản luận giải trả phí (chỉ dùng model còn bán, tính theo giá 2027 — sửa theo C3)

- **Loại bỏ model đã khai tử:** `Gemini 2.5 Flash` (đã khai tử, từ 01/12/2026 tự động chuyển sang `Gemini 3.5 Flash-Lite`) và `GPT-4.1-mini` / `GPT-5-mini` (đều đã bị OpenAI gắn trạng thái Deprecated).
- **Tính lại khối lượng token thực tế (có kể việc gửi lại ngữ cảnh lá số + báo cáo ở mỗi lượt hỏi đáp) `[GIẢ ĐỊNH kỹ thuật — bắt buộc đo thật trên 3 lá số mẫu ở T5]`:**
  - **Tạo báo cáo chính Gói 2 (2 bước):** Pass 1 phân tích 12 cung (`4k in / 5k out`) + Pass 2 viết luận giải ~4.000 chữ & lộ trình 2027 (`9k in / 8k out`) = `13.000 input / 13.000 output`.
  - **8 lượt hỏi đáp bám lá số:** Mỗi lượt phải gửi lại system prompt + lá số + tóm tắt báo cáo (~11k token) + lịch sử hội thoại tăng dần (~2,5k trung bình) ≈ `13.500 in × 8 = 107.000 input`; đầu ra mỗi lượt có đặt trần `max_thinking_tokens` ≈ `2.125 out × 8 = 17.000 output`.
  - **Tổng 1 bản Gói 2 (149.000đ, kịch bản dùng hết 8 lượt, KHÔNG tính cache để dự phòng an toàn):** **`120.000 input tokens` / `30.000 output tokens`**. *(Nếu bật Context Caching cho ~90k input lặp, phần input lặp giảm 90% giá.)*
  - **Tổng 1 bản Gói 1 (79k — 1 pass báo cáo + 3 câu hỏi, sau Tết):** **`38.000 input / 13.000 output`**. **Gói 3 (299k — 3 lá số + 15 câu hỏi, sau Tết):** **`360.000 input / 90.000 output`** (3× Gói 2). **Bản miễn phí:** **0đ AI** (kho văn tĩnh).
- **Yêu cầu bắt buộc về dữ liệu (sửa theo N7):** Chỉ sử dụng **Paid tier** trên Gemini API (`Used to improve our products = No`; Free tier có dùng dữ liệu cải thiện sản phẩm nên cấm dùng), lọc bỏ tên thật/SĐT/email trước khi gửi sang API, và lập hồ sơ chuyển dữ liệu ra nước ngoài theo Luật 91/2025 & NĐ 356/2025.

| Model (đang còn bán — áp dụng giá 2027) | Giá chính thức 2027 (USD / 1M tokens) | Nguồn & Ngày tra | Chi phí Gói 2 (120k in / 30k out, không cache) | % giá bán Gói 2 (149k) | Ghi chú triển khai |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **Gemini 3.5 Flash-Lite** *(Đề xuất chính — Paid tier)* | In `$0,30` / Out `$2,50` *(gồm thinking; cache `$0,03`)* | [aistudio.google.com/docs/pricing](https://aistudio.google.com/docs/pricing) (20/11/2026) | `$0,111` ≈ **2.880đ**<br>*(Có cache: ~2.249đ)* | **1,93%** | **Chọn làm model chính.** Giữ giá ổn định năm 2027; đặt trần thinking token ở code. Gói 1: `1.139đ`; Gói 3: `8.640đ`. |
| **Kiến trúc lai: `3.8 Flash` (báo cáo) + `3.5 Flash-Lite` (hỏi đáp)** *(Phương án nâng cấp nếu R3 cần sâu hơn)* | Báo cáo: `$1,50 / $7,50`<br>Hỏi đáp: `$0,30 / $2,50` | [aistudio.google.com/docs/pricing](https://aistudio.google.com/docs/pricing) (20/11/2026) | `$0,1916` ≈ **4.970đ** | **3,34%** | Dùng `3.8 Flash` viết 2 pass báo cáo (`3.035đ`) + `3.5 Flash-Lite` cho 8 lượt hỏi (`1.935đ`). Tối ưu nếu `3.5 Flash-Lite` không vượt R3. |
| **Gemini 3.8 Flash (toàn bộ)** *(Giá chuẩn từ 01/01/2027)* | In `$1,50` / Out `$7,50` *(tăng gấp đôi từ 01/01/2027)* | [aistudio.google.com/docs/pricing](https://aistudio.google.com/docs/pricing) (20/11/2026) | `$0,405` ≈ **10.506đ** | **7,05%** | Không cần thiết cho phần hỏi đáp; nếu dùng toàn bộ sẽ kéo biên gộp xuống ~88%–89%. |
| **GPT-6.1 Terra (OpenAI)** *(Dự phòng chính — đang còn bán)* | In `$1,00` / Out `$5,00` *(cache `$0,05`)* | Bảng giá OpenAI GPT-6 (`developers.openai.com`, tra 20/11/2026; `openai.com/api/pricing` bị 403 trên bot — cần kiểm lại trên trình duyệt) | `$0,270` ≈ **7.004đ** | **4,70%** | Model kế nhiệm chính thức thay cho `gpt-4.1-mini` & `gpt-5-mini` đã khai tử; dùng đối chứng nếu cần chuyển nhà cung cấp. |
| **DeepSeek V4.1-Flash** (`deepseek-flash`) *(Dự phòng chi phí thấp)* | Peak (08–11h & 13–17h VN): In `$0,30` / Out `$1,20`<br>Off-Peak: In `$0,15` / Out `$0,60` | [api-docs.deepseek.com/quick_start/pricing](https://api-docs.deepseek.com/quick_start/pricing) (20/11/2026) | Peak: **1.868đ**<br>Off-Peak: **934đ** | **1,25%** *(Peak)* | Rẻ và mạnh thuật ngữ Hán–Việt, nhưng giờ Peak trùng giờ hành chính VN và vẫn chịu rủi ro tâm lý máy chủ TQ (`#17`). |

### 4.2. Biên lợi nhuận đơn hàng, Độ nhạy hoàn tiền (N8) & So sánh kênh thanh toán

So sánh 2 cấu hình: **(A) Bản ra mắt Tết — chỉ bán Gói 2 (`149.000đ`)** và **(B) Cả năm sau mở rộng 3 gói (`AOV = 125.500đ` `[GIẢ ĐỊNH]`: 55% G1 + 35% G2 + 10% G3)**.

| Hạng mục chi phí biến đổi (Web VietQR SePay, model chính `Gemini 3.5 Flash-Lite`) | Bản Tết — 100% Gói 2 (`149.000đ`) | Cả năm — Pha trộn 3 gói (`AOV 125.500đ`) | Nguồn & Ghi chú |
| :--- | :---: | :---: | :--- |
| **Chi phí AI (`Gemini 3.5 Flash-Lite`, không cache)** | **2.880đ** (1,93%) | **2.500đ** (1,99%) | Pha trộn: `0,55×1.139 + 0,35×2.880 + 0,10×8.640 = 2.498đ` → làm tròn 2.500đ. |
| **Phí giao dịch vượt hạn mức SePay** | **500đ** (0,34%) | **500đ** (0,40%) | **[GIẢ ĐỊNH]** Trang [`sepay.vn/bang-gia.html`](https://sepay.vn/bang-gia.html) (20/11/2026) không công bố đơn giá vượt hạn mức; phí gói cố định tính ở mục 4.3. |
| **Dự phòng hoàn tiền (cơ sở 3%)** | **4.470đ** (3,00%) | **3.765đ** (3,00%) | **[GIẢ ĐỊNH]** Xem bảng độ nhạy 3% / 6% / 10% bên dưới. |
| **Thuế GTGT + TNCN (Hộ KD ≤ 1 tỷ/năm)** | **0đ** (0,00%) | **0đ** (0,00%) | **NĐ 141/2026/NĐ-CP** (xem 02 mục 4.1). *Nếu vượt 1 tỷ/năm: tỷ lệ thuế suất mới sau khi bỏ thuế khoán là **[CHƯA KIỂM — cần hỏi kế toán thuế]**.* |
| **Tổng COGS (chưa CAC)** | **7.850đ** (5,27%) | **6.765đ** (5,39%) | — |
| **Lợi nhuận đóng góp / đơn (trước CAC)** | **141.150đ (94,73%)** | **118.735đ (94,61%)** | — |

**Độ nhạy biên lợi nhuận trên AOV `125.500đ` (theo tỷ lệ hoàn tiền N8, nâng cấp model AI và kênh thanh toán):**
- **Hoàn tiền 3% / 6% / 10%** *(với `3.5 Flash-Lite`)*: Lợi nhuận đóng góp giảm từ **118.735đ (94,61%)** → **114.970đ (91,61%)** → **109.950đ (87,61%)**.
- **Nếu phải nâng toàn bộ lên `Gemini 3.8 Flash` giá 2027** *(AI pha trộn ~9.100đ/đơn, hoàn 3%)*: COGS = **13.365đ** → Lợi nhuận đóng góp = **112.135đ (89,35%)**.
- **So sánh kênh thanh toán khác (AI `2.500đ`, hoàn 3%):**
  - *Ví điện tử VNPay/MoMo/ZaloPay (MDR ~1,5%–2,5%, tham khảo khung trần 2,5% của [`vnpay.vn`](https://vnpay.vn/) — lấy 2,0% = `2.510đ`):* CM = **116.725đ (93,01%)**.
  - *Apple App Store / Google Play (15% cho doanh thu < `$1M`/năm = `18.825đ` — [`Apple SBP`](https://developer.apple.com/app-store/small-business-program/), [`Google Play 15%`](https://support.google.com/googleplay/android-developer/answer/10632485), tra 20/11/2026):* CM = **100.410đ (80,01%)** (mất `18.325đ/đơn` so với Web VietQR).

### 4.3. Chi phí cố định hàng tháng (cập nhật SePay 120.000đ theo N4)

| Hạng mục | Chi phí / tháng | Phân loại & Nguồn |
| :--- | :---: | :--- |
| VPS DigitalOcean Basic (2GB RAM, 1 vCPU, 50GB SSD — `$12/tháng`) | **312.000đ** | Có nguồn: [digitalocean.com/pricing/droplets](https://www.digitalocean.com/pricing/droplets) (`$12 × 25.940`, 20/11/2026) |
| Sao lưu DB + dịch vụ gửi Email giao dịch | **100.000đ** | **[GIẢ ĐỊNH]** |
| Cổng thanh toán SePay — gói Startup *(hạn mức thấp nhất 180 GD/tháng)* | **120.000đ** | Có nguồn: [sepay.vn/bang-gia.html](https://sepay.vn/bang-gia.html) (20/11/2026). *(Trả theo năm ghi "giảm tới 20%" nhưng không niêm yết số cụ thể; mùa Tết > 180 GD/tháng phải nâng gói cao hơn hoặc trả phí vượt).* |
| Tên miền `xemboi.vn` (350.000đ/năm ÷ 12) | **30.000đ** | Có nguồn: Biểu phí `.vn` [VNNIC](https://vnnic.vn/) (20/11/2026) |
| Công cụ phần mềm cơ bản | **500.000đ** | **[GIẢ ĐỊNH]** |
| **→ TỔNG MỨC 1 (Hạ tầng thuần — 1 người tự làm)** | **1.062.000đ** | `12.744.000 VNĐ / năm` |
| + Thuê CTV dựng video ngắn / biên tập bài SEO bán thời gian | **4.000.000đ** | **[GIẢ ĐỊNH]** *(Chỉ chi nếu anh Cường chọn thuê để giữ tần suất nội dung)* |
| + Sổ sách hộ kinh doanh & dự phòng quản trị | **500.000đ** | **[GIẢ ĐỊNH]** |
| **→ TỔNG MỨC 2 (Vận hành có CTV hỗ trợ)** | **5.562.000đ** | `66.744.000 VNĐ / năm` |
| + Lương cơ hội tối thiểu 1 founder toàn thời gian | **15.000.000đ** | **[GIẢ ĐỊNH]** |
| **→ TỔNG MỨC 3 (Đầy đủ gồm lương founder)** | **20.562.000đ** | `246.744.000 VNĐ / năm` |

### 4.4. CAC theo từng kênh (toàn bộ là **[GIẢ ĐỊNH]** cần đo thực tế)

| Kênh có khách | Giả định đầu vào | CAC ước tính / khách | So với CM (`118.735đ`) | Kết luận |
| :--- | :--- | :---: | :---: | :--- |
| **1. Video ngắn hữu cơ (TikTok / Reels / Shorts)** | Tự quay dựng = 0đ tiền mặt; thuê CTV ~2tr/tháng kéo 2.500 lá số × CR 2,0% = 50 đơn **[GIẢ ĐỊNH]**. | **0đ – 40.000đ** *(dao động 15k–80k)* | Lãi ~40k–118k/đơn | **Ưu tiên #1** cho mùa Tết 2027. |
| **2. SEO Google (hữu cơ)** | Đầu tư từ tháng 12/2026, độ trễ 3–6 tháng; tự viết = 0đ, thuê CTV ~2tr/tháng sau ổn định đạt 100 đơn **[GIẢ ĐỊNH]**. | **0đ – 20.000đ** *(sau 3–6 tháng)* | Lãi ~98k–118k/đơn | **Ưu tiên trung–dài hạn** (nhắm 2027–2028, không kỳ vọng cho Tết 2027). |
| **3. Giới thiệu bạn bè** *(hoãn sau Tết — sửa theo G8)* | Giảm `15.000đ` cho người được mời + tặng `+3 câu hỏi AI` (~500đ) cho người mời khi bạn mua thật **[GIẢ ĐỊNH]**. | **~15.500đ** | Lãi ~103k/đơn | Đồng nhất cơ chế thưởng với CAC (không còn lệch 40k). |
| **4. Facebook Ads lạnh** | CPC 1.500đ–3.500đ; 40% lập lá số; CR 2,5% **[GIẢ ĐỊNH]**. | **150.000đ – 350.000đ** | **LỖ 31k–231k/đơn** | **KHÔNG dùng làm kênh chính.** Chỉ chi ≤ 1tr test R1. |
| **5. Facebook Ads Retargeting** *(sau khi đủ tệp)* | Bám đuổi người đã lập lá số; **bắt buộc có banner đồng ý cookie (Luật 91/2025) và không gửi ngày sinh vào Meta Pixel (G10)** **[GIẢ ĐỊNH]**. | **30.000đ – 60.000đ** | Lãi ~58k–88k/đơn | Chỉ cân nhắc khi ≥ 3.000 lá số/tháng. |

### 4.5. Tỷ lệ chuyển đổi Free → Paid (đã sửa bối cảnh nguồn theo N3)

- **Số liệu ngành tham khảo (ghi rõ khác bối cảnh, KHÔNG coi là tỷ lệ của web tử vi VN):**
  - *RevenueCat — State of Subscription Apps 2026* ([`revenuecat.com/state-of-subscription-apps-2026/`](https://www.revenuecat.com/state-of-subscription-apps-2026/), tra 20/11/2026): Trung vị chuyển đổi Day-35 của **app di động bán thuê bao mô hình Freemium là 2,1%** (đo trên lượt cài đặt, khác với web mua lẻ 1 lần).
  - *First Page Sage — SaaS Freemium Conversion Rates* ([`firstpagesage.com/seo-blog/saas-freemium-conversion-rates/`](https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/), cập nhật 11/09/2026, tra 20/11/2026): Dải trung bình cho **SaaS B2B** từ **2,1%** (EdTech) đến **5,6%** (LegalTech).
- **3 kịch bản cho `xemboi.vn` (CẢ 3 ĐỀU LÀ `[GIẢ ĐỊNH]` tính trên lượt hoàn tất lập lá số miễn phí):**
  - **Thấp: `1,2%` `[GIẢ ĐỊNH]`** — Phản ánh độ nhạy giá khi giá bán 149k cao hơn nhiều so với mức mặc định 20k của *Chợ Tử Vi*, hoặc web mới chưa có niềm tin.
  - **Vừa (Cơ sở): `2,5%` `[GIẢ ĐỊNH]`** — Dùng làm mốc lập kế hoạch nhất quán với 02 mục 5.3.
  - **Cao (Mùa Tết): `4,5%` `[GIẢ ĐỊNH]`** — Khả thi chỉ khi đúng mùa cao điểm Tết và thông điệp + bản miễn phí rất thuyết phục.
  - *Cảnh báo độ nhạy giá:* Nếu chỉ mở Gói 2 (`149.000đ`, cao gấp 7,5× nút mặc định 20k của *Chợ Tử Vi*), CR thực tế có thể chỉ đạt vùng **1,0%–1,8%** `[GIẢ ĐỊNH]`; vì vậy thí nghiệm R1 ở mục 6 sẽ cho thấy ngay độ nhạy giữa 79k và 149k.

### 4.6. Điểm hòa vốn hàng tháng & Kiểm tra tính nhất quán với khung SOM 02 (sửa theo N2)

| Mức chi phí cố định (FC — đã gồm SePay 120k) | FC / tháng | Biên đóng góp dùng tính | Điểm hòa vốn (Đơn / tháng) | Doanh thu hòa vốn / tháng | Lượt lập lá số cần / tháng *(Thấp 1,2% / Vừa 2,5% / Cao 4,5%)* |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Mức 1 — Bản Tết 100% Gói 2 (`149k`, hữu cơ)** | 1.062.000đ | 141.150đ | **8 đơn** | 1.192.000đ | 667 / **320** / 178 |
| **Mức 1 — Cả năm pha trộn (`125,5k`, hữu cơ)** | 1.062.000đ | 118.735đ | **9 đơn** | 1.129.500đ | 750 / **360** / 200 |
| **Mức 1 — Cả năm pha trộn (có CAC 30k)** | 1.062.000đ | 88.735đ | **12 đơn** | 1.506.000đ | 1.000 / **480** / 267 |
| **Mức 2 — Vận hành + CTV nội dung (`125,5k`)** | 5.562.000đ | 118.735đ *(đã gồm CP CTV trong FC)* | **47 đơn** | 5.898.500đ | 3.917 / **1.880** / 1.045 |
| **Mức 3 — Đầy đủ gồm lương founder (`125,5k`)** | 20.562.000đ | 118.735đ | **174 đơn** | 21.837.000đ | 14.500 / **6.960** / 3.867 |

*(Độ nhạy: Nếu phải nâng toàn bộ lên `Gemini 3.8 Flash` giá 2027 với CM `112.135đ`, điểm hòa vốn tăng nhẹ lên **10 / 50 / 184 đơn/tháng** cho Mức 1 / 2 / 3.)*

**Kiểm tra tính nhất quán số học với khung SOM năm 1 ở 02 (`100.000 lượt lập lá số/năm` → `250 – 370 triệu VNĐ`):**
> *Lưu ý phương pháp (N2):* Bảng dưới chỉ kiểm tra xem bảng giá và cấu trúc chi phí của 04 có **nhất quán** với giả định SOM của 02 hay không (vì cùng dùng 100.000 lượt và CR 2,5% từ 02). Đây **KHÔNG phải kiểm chứng độc lập về nhu cầu thị trường**.

| Kịch bản năm 1 *(100.000 lượt `[GIẢ ĐỊNH]`, AOV 125.500đ)* | CR `[GIẢ ĐỊNH]` | Số đơn / năm | Doanh thu năm 1 | Tổng COGS *(6.765đ/đơn)* | Lãi sau FC Mức 2 *(66,74tr)* | Lãi sau FC Mức 3 *(246,74tr)* | Nhất quán với 02 & Thuế |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Thấp** | 1,2% | 1.200 | **150,6 triệu** | 8,12 triệu | **+75,7 triệu** | -104,3 triệu | Dưới khung SOM 250–370tr; chỉ phù hợp làm bán thời gian. |
| **Vừa (Cơ sở)** | 2,5% | 2.500 | **313,8 triệu** | 16,91 triệu | **+230,1 triệu** | **+50,1 triệu** | Nhất quán giữa khung SOM 02 (250–370tr); miễn thuế < 1 tỷ. |
| **Cao** | 4,5% | 4.500 | **564,8 triệu** | 30,44 triệu | **+467,6 triệu** | **+287,6 triệu** | Vượt khung SOM 02; vẫn miễn thuế < 1 tỷ (NĐ 141/2026). |

- **Rủi ro mùa vụ (R7):** Nếu 40–50% lượt dồn vào 2–3 tháng quanh Tết, 9 tháng thấp điểm có thể chỉ đạt ~5.000 lượt/tháng (~125 đơn/tháng) → vẫn cao hơn hòa vốn Mức 2 (47 đơn), nhưng thấp hơn Mức 3 (174 đơn). Cần giữ định phí thấp ở Mức 1–2 trong năm đầu.

---

## 5. Chiến lược có khách và Kế hoạch 90 ngày tinh gọn (20/11/2026 – 18/02/2027)

> **Mốc lịch:** Giao thừa là **05/02/2027** (29 tháng Chạp); **Mùng 1 Tết Đinh Mùi là 06/02/2027** (còn **78 ngày**); Mùng 1 tháng Chạp là **08/01/2027** (còn **49 ngày**).
> **Giả định nhân lực (C4):** Anh Cường làm **một mình ~28–30 giờ/tuần** (nếu muốn tăng tốc video từ Tuần 8, có tùy chọn thuê 1 CTV dựng video theo ngân sách Mức 2 `4tr/tháng`).

### 5.1. Kênh ưu tiên và lý do (sửa theo N11 & G11)
1. **Video ngắn hữu cơ (TikTok + Facebook Reels + YouTube Shorts) — Kênh chính duy nhất cho mùa Tết 2027:**
   - *Lý do:* Bằng chứng 03 chỉ ra P1 tìm qua Facebook và livestream (`#53, #67, #70`). Theo 02, TikTok Paid Ads siết mảng bói toán tại VN; còn theo ước tính `[GIẢ ĐỊNH]` ở mục 4.4, Facebook Ads lạnh lỗ ngay trên đơn đầu (150k–350k > AOV 125,5k). Video hữu cơ có chi phí tiền mặt thấp nhất.
   - *Lưu ý an toàn:* Quy tắc cộng đồng TikTok cho video hữu cơ tử vi hiện **[CHƯA KIỂM]** — cần thử đăng sớm 3–5 video ở T2 để kiểm tra reach; khi làm nội dung bóc tách chiêu trò hù dọa bán lễ, tuyệt đối **không nêu tên cá nhân/kênh cụ thể** để tránh kiện bôi nhọ.
2. **Cộng đồng ngách hữu cơ (nhóm Facebook, Voz, Threads) — Kênh tạo niềm tin đầu tiên:**
   - Kéo 8–10 người P2 tham gia bài thử mù R3 và nhận xét công khai về độ chuẩn an sao.
3. **SEO Google — Khoản đầu tư dài hạn cho năm 2027–2028 (KHÔNG kỳ vọng cho Tết 2027 — sửa theo N11):**
   - Do SEO cần 3–6 tháng để lên top, **không đặt KPI lượt truy cập SEO cho tháng 01–02/2027**. Chỉ viết 2–3 bài nền tảng/tuần từ tháng 01/2027 sau khi hoàn tất Keyword Planner.

### 5.2. Danh sách 20 từ khóa SEO ưu tiên (dài hạn 2027–2028)

> **Lưu ý:** Toàn bộ Search Volume là **[CHƯA KIỂM — bắt buộc tra Google Ads Keyword Planner ở Tuần 1 trước khi chốt thứ tự viết bài]**. Các trang theo từng năm sinh (11–13) được **hoãn sang sau Tết 2027**.

| # | Từ khóa ưu tiên | Ý định tìm kiếm | Persona | Search Volume | Ghi chú triển khai |
| :-: | :--- | :--- | :---: | :---: | :--- |
| 1 | `lập lá số tử vi` | Công cụ (Cao) | P1, P2 | [CHƯA KIỂM] | Trang chủ / Công cụ lập lá số (ưu tiên trước) |
| 2 | `lập lá số tử vi miễn phí` | Công cụ (Cao) | P1, P2 | [CHƯA KIỂM] | Trang chủ |
| 3 | `luận giải lá số tử vi` | Giao dịch (Rất cao) | P1, P2 | [CHƯA KIỂM] | Trang Gói 2 + mẫu có căn cứ |
| 4 | `xem tử vi 2027 đinh mùi` | Mùa vụ 2027 | P1 | [CHƯA KIỂM] | 1 bài Hub tổng quan 2027 |
| 5 | `lá số tử vi 2027` | Mùa vụ 2027 | P1, P2 | [CHƯA KIỂM] | Hub 2027 gắn form lập lá số |
| 6 | `xem vận hạn năm 2027` | Giao dịch / 2027 | P1 | [CHƯA KIỂM] | Gắn CTA Gói 2 |
| 7 | `tử vi năm 2027 theo ngày tháng năm sinh` | Công cụ / 2027 | P1 | [CHƯA KIỂM] | Form có chế độ chưa rõ giờ sinh |
| 8 | `xem tử vi không cần giờ sinh` | Công cụ (Ngách R4) | P1 | [CHƯA KIỂM] | Trang chế độ xem theo ngày sinh (`#48`) |
| 9 | `xem tử vi công việc 2027` | Giao dịch (P1) | P1 | [CHƯA KIỂM] | Bài sâu cung Quan Lộc |
| 10 | `xem tử vi tình duyên 2027` | Giao dịch (P1) | P1 | [CHƯA KIỂM] | Bài sâu cung Phu Thê |
| 11 | `tử vi tuổi 1995 năm 2027` *(mẫu nhóm 1991–2002)* | Long-tail theo tuổi | P1 | [CHƯA KIỂM] | *Hoãn sau Tết 2027* |
| 12 | `tử vi tuổi 1998 năm 2027` | Long-tail theo tuổi | P1 | [CHƯA KIỂM] | *Hoãn sau Tết 2027* |
| 13 | `tử vi tuổi 2000 năm 2027` | Long-tail theo tuổi | P1 | [CHƯA KIỂM] | *Hoãn sau Tết 2027* |
| 14 | `cách đọc lá số tử vi cơ bản` | Thông tin / Niềm tin | P2, P1 | [CHƯA KIỂM] | Bài hướng dẫn dài hạn |
| 15 | `lập lá số tử vi nam phái chuẩn` | Học thuật (P2) | P2 | [CHƯA KIỂM] | Trang công bố quy ước an sao (làm ngay T4) |
| 16 | `sinh tháng nhuận lập lá số tử vi thế nào` | Học thuật / Lỗi hay gặp | P2 | [CHƯA KIỂM] | Giải thích quy tắc tháng nhuận (`#1, #24`) |
| 17 | `sinh giờ tý 23h tính ngày nào tử vi` | Học thuật / Lỗi hay gặp | P2 | [CHƯA KIỂM] | Giải thích Dạ Tý / Tảo Tý (01 mục 3.2) |
| 18 | `bị thầy bói phán cao số giải hạn có thật không` | Niềm tin / Chống dọa | P1 | [CHƯA KIỂM] | Bài góc nhìn minh bạch (`#54, #55`) |
| 19 | `xem độ hợp hai lá số tử vi` | Giao dịch (Gói 3) | P1 | [CHƯA KIỂM] | *Hoãn Quý 2/2027 cùng Gói 3* |
| 20 | `đổi ngày dương sang âm lịch chuẩn` | Công cụ hỗ trợ | P1, P2 | [CHƯA KIỂM] | Công cụ Hồ Ngọc Đức gắn CTA lập lá số |

### 5.3. Nội dung chia sẻ & Giới thiệu bạn bè *(Cắt gọn cho bản Tết, mở rộng Quý 2/2027)*
- **Trong bản ra mắt Tết 2027:** Chỉ làm 1 nút **tải ảnh lá số 12 cung rõ nét** (PNG từ canvas/SVG, có ghi chú quy ước Nam Phái & tên miền `xemboi.vn`, che họ tên để bảo vệ riêng tư `#17, #27`) + trang kết quả **HTML tối ưu cho chế độ In / Lưu PDF của trình duyệt**.
- **Hoãn sang Quý 2/2027 (sau khi đã chứng minh có đơn trả tiền ổn định):**
  - Thẻ Story 9:16 "Tín Hiệu 2027" thiết kế riêng.
  - Hệ thống Referral 2 chiều (giảm `15.000đ` cho người mua mới + tặng `+3 câu hỏi AI` ~500đ cho người giới thiệu khi bạn thanh toán thành công → tổng chi phí tối đa ~`15.500đ/đơn`, khớp mục 4.4).

### 5.4. Lịch thực thi 90 ngày tinh gọn cho 1 người (có số giờ & nhánh lùi — sửa theo C4, N10)

- **Phạm vi bản ra mắt Tết 2027 (cắt còn 1 luồng duy nhất):** `Nhập ngày sinh (có nút chưa rõ giờ sinh)` → `Lá số 12 cung + 3 điểm miễn phí (kho văn tĩnh)` → `Thanh toán VietQR SePay 1 gói duy nhất: Gói 2 (149.000đ)` → `Trang kết quả HTML in được + 8 lượt hỏi đáp AI`.
- **Hoãn sau Tết:** Xuất PDF server, Referral, Gói 1 lẻ / Gói 3, 12 trang theo tuổi, thẻ Story 9:16.
- **Nhánh lùi bắt buộc (Cổng 08/01/2027 — Mùng 1 tháng Chạp):** Nếu tới **08/01/2027** chưa hoàn tất hệ thống tự động + qua R3 + xong pháp lý, **DỪNG code chạy đua Tết**: chuyển sang **bán thủ công giới hạn 20–30 đơn (giao trong 24h)** nếu đã xong thủ tục pháp lý, hoặc **bỏ qua sóng Tết 2027**, hoàn thiện sản phẩm cho nhu cầu quanh năm và mùa Tết 2028.

| Tuần | Thời gian | Việc chính & Phân bổ giờ *(1 người ~28–30h/tuần)* | Chỉ số / Đầu ra đo được *(KPI `[GIẢ ĐỊNH]`, chốt lại sau Keyword Planner)* |
| :-: | :--- | :--- | :--- |
| **T1** | 20/11 – 26/11 | Tra Trends CSV & Keyword Planner (3h); Soạn & biên tập tay 1 bản mẫu dán nhãn rõ (5h); Dựng trang thí nghiệm R1 có form lập lá số demo → 3 điểm mẫu → bảng giá → hộp thoại trung thực (10h); Phỏng vấn 10 người đầu (10h). *(Tổng: 28h)* | Xong bảng search volume 20 từ khóa; 10 phỏng vấn; trang R1 chạy ổn định. |
| **T2** | 27/11 – 03/12 | Hoàn tất 10 phỏng vấn còn lại & chấm tiêu chí 03 mục 6 (10h); Kéo traffic vào R1 bằng 5 video ngắn thử reach TikTok/Reels + bài nhóm FB + tối đa 1tr Ads (10h); Hỏi mã ngành Hộ KD (VSIC) & kiểm bản gốc Luật 122/2025 + NĐ 248/2026 (4h); Tổng hợp R1 & ra quyết định GO/ITERATE/PIVOT (4h). *(Tổng: 28h)* | Đạt ≥ 300 lá số tạo trên trang R1; có quyết định **GO / ITERATE / PIVOT** theo mục 6. |
| **T3** | 04/12 – 10/12 | *(Chỉ chạy khi R1 Đạt)*: Viết sạch engine Lịch Âm + An Sao Nam Phái bằng TypeScript (16h); Viết bộ ≥ 80 unit test (tháng nhuận, giờ Tý, 14 chính tinh, phụ tinh, đối chiếu sách chuẩn) (8h); Nộp hồ sơ đăng ký Hộ kinh doanh (6h). *(Tổng: 30h)* | 100% unit test lịch & an sao pass; đã nộp đăng ký Hộ kinh doanh. |
| **T4** | 11/12 – 17/12 | Tự biên soạn kho văn tĩnh cho bản miễn phí (14 chính tinh + trục vận 2027, 0đ AI) (10h); Dựng UI v2 sạch cho 1 luồng duy nhất (form + lá số + 3 điểm miễn phí + trang giá Gói 2) (12h); Tích hợp PostgreSQL + SePay webhook thật (8h). *(Tổng: 30h)* | Xong bản miễn phí 0đ AI + thanh toán VietQR chạy thật trên staging. |
| **T5** | 18/12 – 24/12 | Dựng pipeline `Gemini 3.5 Flash-Lite` (Paid tier, lọc tên/SĐT, trần thinking) + trang kết quả **HTML in được** + 8 lượt hỏi đáp (12h); Đo token thật trên 3 lá số mẫu đủ 8 lượt (3h); **Chạy bài thử mù R3 với 8–10 người P2 trên đúng pipeline thật** (9h); Nộp Thông báo nền tảng TMĐT (NĐ 248/2026) & hoàn tất hồ sơ NĐ 356/2025 (6h). *(Tổng: 30h)* | Có số token đo thật; **≥ 70% người P2** đánh giá bản tự động sâu hơn/tốt hơn đối thủ *(trượt → DỪNG mở bán, sửa prompt hoặc thử lai `3.8 Flash`)*; nộp xong hồ sơ TMĐT. |
| **T6** | 25/12 – 31/12 | Chỉnh sửa prompt/UI theo phản hồi R3 (10h); Test end-to-end luồng thanh toán – hoàn tiền – xóa dữ liệu 1 chạm (6h); **Ra mắt mềm (Soft Launch)** cho nhóm đăng ký chờ từ T1–T2 (6h); Đăng 3 video ngắn đầu (6h). *(Tổng: 28h)* | Có xác nhận thông báo TMĐT; **5–15 đơn trả tiền thật đầu tiên** `[GIẢ ĐỊNH]`; 0 lỗi an sao/thanh toán nghiêm trọng. |
| **T7** | 01/01 – 07/01/2027 | **CỔNG QUYẾT ĐỊNH 08/01/2027 (Mùng 1 tháng Chạp):** Sửa phản hồi khách đầu (8h); Đăng 3–4 video ngắn/tuần (10h); Viết 2 bài SEO nền tảng cho năm 2027–2028 (8h). *(Tổng: 26h)*. **Nếu chưa xong ổn định trước 08/01 → kích hoạt NHÁNH LÙI.** | Lũy kế **300–800 lá số**; **10–25 đơn** `[GIẢ ĐỊNH]`; hoàn tiền < 5%. |
| **T8–T10** | 08/01 – 28/01/2027 *(3 tuần)* | **Giai đoạn tháng Chạp:** Vận hành & chăm sóc khách (6h/tuần); 4–5 video ngắn/tuần *(tự làm ~12h/tuần; hoặc thuê CTV Mức 2 4tr/tháng để giảm còn 4h/tuần duyệt)*; 2 bài SEO dài hạn/tuần (6h/tuần); Tối ưu tỉ lệ chuyển đổi form & trang giá (4h/tuần). *(Tổng: ~28h/tuần)* | **300–1.000 lá số/tuần**; **10–30 đơn/tuần** `[GIẢ ĐỊNH]`. Kiểm tra chạm mốc 180 GD/tháng để nâng gói SePay. |
| **T11–T12** | 29/01 – 11/02/2027 *(2 tuần)* | **Cao điểm áp Tết & Tuần Tết Đinh Mùi (06/02):** Nâng gói SePay nếu vượt 180 GD; giám sát VPS/API & xử lý hoàn tiền trong 24h (8h/tuần); 5–7 video ngắn/tuần chủ đề Đinh Mùi (12h/tuần, nên có CTV dựng); Tổng hợp đánh giá thật ẩn danh (5h/tuần). *(Tổng: ~25h/tuần)* | **800–2.000 lá số/tuần**; **25–70 đơn/tuần** `[GIẢ ĐỊNH]`; uptime ≥ 99,5%. |
| **T13** | 12/02 – 18/02/2027 | **Tổng kết 90 ngày:** Đối soát doanh thu, chi phí token thật, tỷ lệ hoàn tiền, tỷ lệ không biết giờ sinh với CSV; chốt lộ trình Quý 2 (thêm Gói 1/Gói 3, Referral, PDF server hay gói không giờ sinh). *(Tổng: 20h)* | Lũy kế 90 ngày `[GIẢ ĐỊNH]`: **3.000–8.000 lá số**, **75–200 đơn Gói 2 (~11–30 triệu VNĐ)**; đủ dữ liệu thật thay thế toàn bộ giả định trong CSV. |

### 5.5. Bộ chỉ số theo dõi phễu (Funnel Metrics — tất cả ngưỡng là **[GIẢ ĐỊNH]** cần hiệu chỉnh sau T6)

| Bước phễu | Chỉ số đo (GA4 + DB) | Ngưỡng **TỐT** | Ngưỡng **CẦN SỬA** | Hành động khi rơi vào "Cần sửa" |
| :--- | :--- | :---: | :---: | :--- |
| **1. Vào trang → Nhập ngày sinh** | `Chart Created / Visit` | **≥ 40%** | **< 22%** | Rút gọn form 1 màn hình; nổi bật nút *"Chưa rõ giờ sinh"* (`#48`) và cam kết *"Không cần đăng nhập/SĐT"* (`#17`). |
| **2. Xem bản miễn phí → Tới bảng giá** | `Paywall View / Chart Created` | **≥ 35%** | **< 18%** | Cải thiện 3 nhận định miễn phí để tăng cảm giác "nói trúng" và dẫn chứng sao–cung rõ hơn trước khi tới khối giá. |
| **3. Lập lá số → Trả tiền thành công** | `Paid / Chart Created` | **≥ 2,5%** *(Gói 2 149k: ≥ 2,0%)* | **< 1,2%** | Kiểm 2 điểm rơi: (a) *Tạo QR không chuyển* → tối ưu UX quét VietQR; (b) *Không bấm mua* → kiểm lại mẫu đọc thử, thử mở Gói 1 (79k). |
| **4. Chất lượng sau mua** | `Refund / Paid` & Đánh giá | **Hoàn < 3%**<br>**≥ 4,5★** | **Hoàn > 6%**<br>**< 4,0★** | Đọc từng đơn bị hoàn/chấm thấp; vá prompt tăng dẫn chứng cụ thể hoặc cân nhắc kiến trúc lai `3.8 Flash` + `3.5 Flash-Lite`. |
| **5. Lưu / In / Quay lại** | Tải ảnh lá số & `D30 Return` | **Tải ảnh ≥ 12%**<br>**D30 ≥ 12%** | **Tải ảnh < 5%**<br>**D30 < 6%** | Cải thiện độ nét ảnh lá số & trang HTML in; cho phép đăng ký nhận 1 email nhắc vận quý mới (opt-in). |

---

## 6. Thí nghiệm kiểm R1 trước khi viết mã nhiều *(Viết lại toàn bộ theo C1, C2, N1, N6, G9)*

> **Mục tiêu:** Kiểm chứng giả định rủi ro nhất **R1** (P1 có sẵn lòng trả `79.000đ – 149.000đ` cho sự minh bạch, không hù dọa) đồng thời kiểm sơ bộ **R6** (có chịu nhập ngày giờ sinh vào web lạ không) — trong **7–10 ngày (T1–T2)** trước khi viết code engine/thanh toán.

### 6.1. Thiết kế luồng thí nghiệm trung thực (sửa theo C1, C2, G9)

- **Luồng trải nghiệm khớp sát sản phẩm thật (cùng mẫu số với mô hình doanh thu):**
  1. **Bước 1 — Nhập ngày giờ sinh (hoặc chọn "Chưa rõ giờ sinh"):** Không đòi tên thật, không đòi SĐT. *(Đo luôn tỷ lệ bỏ ngang form — kiểm R6 — và tỷ lệ không biết giờ sinh — kiểm R4!)*
  2. **Bước 2 — Xem bản tóm tắt miễn phí sơ bộ:** Hiện nhanh thông tin Can Chi, Ngũ Hành, 1–2 nhận định ngắn gọn kèm **1 đoạn bản luận giải mẫu đầy đủ** (có gắn nhãn rõ ngay đầu: **`[Bản mẫu có người biên tập — minh họa cấu trúc bản luận giải dự kiến]`** để không gây hiểu lầm về sản phẩm tự động — sửa theo C2).
  3. **Bước 3 — Khối giá niêm yết thật (không A/B 2 tiêu đề vì không đủ cỡ mẫu — G9):**
     - Chỉ dùng 1 thông điệp nhất quán theo định vị chọn (*"Luận giải Tử Vi 2027 rõ căn cứ từng sao–cung. Không hù dọa. Không bán lễ giải hạn. Chính sách dự kiến khi mở bán: hoàn tiền 100% trong 7 ngày"*).
     - Hiện 2 nút giá thật để đo độ nhạy giá: **"Đặt mua Vận 2027 — 79.000đ"** và **"Đặt mua Chuyên Sâu + Vận 2027 — 149.000đ"**.
  4. **Bước 4 — Hộp thoại trung thực ngay khi khách bấm nút mua (sửa theo C2):**
     > *"Sản phẩm **chưa mở bán**. Bạn vừa giúp bọn mình đo nhu cầu thực tế trước khi xây dựng hệ thống. Nếu đủ nhu cầu và ra mắt (dự kiến cuối tháng 12/2026 – đầu tháng 01/2027, **chưa chắc chắn**), bọn mình sẽ gửi thông báo cho bạn kèm ưu đãi giảm 30%. Nếu dự án không ra mắt, bọn mình sẽ gửi thông báo rõ kết quả và **xóa toàn bộ dữ liệu bạn để lại sau tối đa 60 ngày**."*
     - Kèm 1 ô nhập Email/Zalo + checkbox đồng ý xử lý dữ liệu (Luật 91/2025).
     - **KHÔNG kèm lời mời "nhận bản thử miễn phí nếu góp ý 10 phút"** trong hộp thoại này để tránh nhiễu chỉ số người muốn mua thật (sửa theo C1). *(Việc mời phỏng vấn/nhận bản thử tách sang luồng riêng từ khảo sát Google Form ở 03.)*

### 6.2. Cách đo, cỡ mẫu và ngưỡng ĐẠT / TRƯỢT đồng bộ (sửa theo C1, N1)

- **Mẫu số thống nhất:** Toàn bộ chỉ số đo trên **`Lá số đã tạo` (`Chart Created`)** — trùng 100% với mẫu số của tỷ lệ chuyển đổi trong mục 4.5!
- **Quy đổi ngược ngưỡng ĐẠT từ mục tiêu doanh thu:**
  - Mục tiêu kịch bản Cơ sở là **`2,5%` trả tiền thật trên mỗi lá số tạo**.
  - Với giả định hệ số rơi từ "bấm nút mua giả" sang "chuyển khoản thật" là **`2× – 3×`** `[GIẢ ĐỊNH]`, để đạt `2,5%` trả tiền thật thì tỷ lệ bấm nút mua trên lá số tạo (`click_per_chart`) phải đạt **`≥ 5,0% – 7,5%`**.
  - Ta chọn **ngưỡng ĐẠT = `≥ 6,0%` bấm nút mua trên lá số đã tạo** (nằm đúng giữa `5,0%–7,5%`), **KÈM theo** `lead_per_chart ≥ 2,5%` (để lại liên lạc chỉ vì ưu đãi mở bán, không có quà miễn phí) **VÀ đạt tiêu chí (b) của 03 mục 6** (`≥ 6/20` người phỏng vấn đã tự chi `≥ 50.000đ` cho buổi xem trong 12 tháng).
- **Cỡ mẫu tối thiểu & phân tách nguồn:**
  - Tối thiểu **`≥ 300` lượt hoàn tất lập lá số** *(khuyến nghị phấn đấu **400–500 lượt** vì với n = 300, khoảng tin cậy Wilson 95% của 6% là `3,8%–9,3%`, chỉ đủ ra quyết định định hướng giai đoạn sớm)*.
  - Bắt buộc gắn UTM tách riêng 3 nguồn kéo traffic (`nhóm FB`, `video ngắn hữu cơ`, `Facebook Ads ≤ 1tr`) để tránh trộn tệp khác ý định. *(Lưu ý: việc chạy Meta Ads về trang chưa mở bán có rủi ro bị từ chối quảng cáo **[CHƯA KIỂM]** — ưu tiên kéo traffic từ video ngắn hữu cơ và cộng đồng trước).*

| Kết quả thí nghiệm R1 *(trên ≥ 300 lá số tạo)* + 20 phỏng vấn 03 | Đánh giá | Quyết định bắt buộc |
| :--- | :---: | :--- |
| **`click_per_chart ≥ 6,0%`** VÀ **`lead_per_chart ≥ 2,5%`** VÀ **phỏng vấn đạt tiêu chí (b) của 03 (`≥ 6/20` đã chi `≥ 50k`)** | **ĐẠT (GO)** | Chốt gói mở bán theo nút giá được bấm nhiều hơn (79k hoặc 149k), tiến sang Tuần 3 code MVP Tết. |
| **`click_per_chart` từ `2,5% – < 6,0%`** (hoặc bấm ≥ 6% nhưng `< 2,0%` để lại liên lạc), trong khi phỏng vấn vẫn đạt `≥ 4/20` từng chi tiền | **CHƯA RÕ (ITERATE — tối đa 1 vòng)** | Chưa code thanh toán. Gọi hỏi người để lại liên lạc, chỉnh lại bản miễn phí/giá rồi chạy lại **đúng 1 vòng nữa** (≥ 300 lá số). Nếu vòng 2 vẫn < 6% → coi là TRƯỢT. |
| **`click_per_chart < 2,5%`** *(quy đổi sang trả tiền thật chỉ ~0,8%–1,2%, dưới kịch bản Thấp)* **HOẶC `< 4/20` người phỏng vấn từng chi tiền (đúng 03 dòng 198)** | **TRƯỢT (PIVOT / STOP)** | **Dừng hướng thu tiền trực tiếp từ P1.** Chuyển sang kiểm P2 hoặc P4 nếu phỏng vấn đạt ngưỡng tương ứng của 03 mục 6; nếu không thì dừng dự án, gửi thông báo kết quả cho toàn bộ người đăng ký và xóa sạch dữ liệu sau tối đa 60 ngày. |

### 6.3. Lưu ý pháp lý bắt buộc khi thử nghiệm và trước khi thu tiền thật (cập nhật N6, N7, G7)

1. **Khung pháp lý Thương mại điện tử mới hiệu lực từ 01/07/2026 (sửa theo N6):**
   - **Luật Thương mại điện tử số 122/2025/QH15** và **Nghị định 248/2026/NĐ-CP** (có hiệu lực từ **01/07/2026**, thay thế NĐ 52/2013 & NĐ 85/2021 — tham chiếu [`thuvienphapluat.vn`](https://thuvienphapluat.vn/van-ban/Thuong-mai/Luat-Thuong-mai-dien-tu-2025-so-122-2025-QH15-662035.aspx) và [`moit.gov.vn`](https://moit.gov.vn/tin-tuc/bo-cong-thuong-pho-bien-luat-thuong-mai-dien-tu-va-nghi-dinh-so-248-2026-nd-cp.html), tra 20/11/2026):
     - Tên thủ tục mới: **"Thông báo nền tảng thương mại điện tử kinh doanh trực tiếp có chức năng đặt hàng trực tuyến"**; nộp qua Cổng Dịch vụ công Quốc gia / hệ thống Bộ Công Thương; cơ quan xác nhận phân cấp về **UBND cấp tỉnh**; thời hạn phản hồi ghi nhận qua tổng hợp là **03 ngày làm việc** *(cần mở đọc văn bản gốc NĐ 248/2026 ở Tuần 2 để đối chiếu chính xác từng điều khoản)*.
   - **Áp dụng:** Ở bước thí nghiệm R1 (chưa mở bán, không có giỏ hàng, không thu tiền) thì không thuộc diện có chức năng đặt hàng trực tuyến. **Trước khi bật nút thu tiền thật (kể cả bán thủ công 20–30 đơn ở nhánh lùi)**, bắt buộc hoàn tất đăng ký Hộ kinh doanh (kiểm tra trước mã ngành VSIC tại UBND cấp xã/phường — G7) và hoàn tất thủ tục thông báo nền tảng TMĐT.
2. **Bảo vệ quyền lợi người tiêu dùng khi thu tiền trước (Luật 19/2023/QH15, hiệu lực 01/07/2024):**
   - Cấm thu tiền trước khi chưa có khả năng giao sản phẩm hoặc đưa thông tin sai sự thật. Khi mở bán chính thức hoặc bán thủ công (nhánh lùi), phải công khai rõ trước nút thanh toán: tổng giá, thời hạn giao cụ thể (90 giây với bản tự động / 24 giờ với bán thủ công), chủ thể chịu trách nhiệm, và chính sách hoàn tiền 100% nếu giao trễ hoặc sai cam kết.
3. **Bảo vệ dữ liệu cá nhân & chuyển dữ liệu ra nước ngoài (Luật 91/2025/QH15 & NĐ 356/2025/NĐ-CP — sửa theo N7):**
   - Mọi form thu ngày giờ sinh hoặc email/Zalo đều phải có checkbox đồng ý (opt-in) và hạn lưu rõ ràng (xóa sau 60 ngày nếu thí nghiệm R1 dừng; xóa sau 3 năm hoặc ngay khi khách bấm nút xóa ở bản chính thức).
   - Ô hỏi đáp tự do có thể chứa dữ liệu nhạy cảm (tình cảm, sức khỏe, tâm lý): phải có **checkbox đồng ý riêng cho dữ liệu nhạy cảm**, lọc tên thật/SĐT trước khi gọi API, chỉ dùng **Paid tier**, và lập **hồ sơ đánh giá tác động chuyển dữ liệu cá nhân ra nước ngoài** theo NĐ 356/2025 trước khi mở bán.
4. **Ghi nhận doanh thu & thuế (NĐ 141/2026/NĐ-CP):**
   - Dùng tài khoản ngân hàng kinh doanh tách riêng và ghi sổ doanh thu ngay từ đơn đầu tiên theo thời điểm thu tiền (kể cả khi doanh thu dưới 1 tỷ đồng/năm được miễn thuế GTGT/TNCN).

---

## 7. Nhật ký sửa theo phản biện `04b-phan-bien.md`

| Mã điểm | Trạng thái | Sửa ở đâu | Ghi chú ngắn |
| :-: | :-: | :--- | :--- |
| **C1** | **Đã sửa** | Mục 6.1, 6.2 | Đổi luồng thành nhập ngày sinh → xem miễn phí → thấy giá → bấm mua; cùng mẫu số `lá số tạo`; ngưỡng ĐẠT ngược ≥ 6,0% (khung 5,0–7,5%); bỏ mồi miễn phí khỏi hộp thoại; gắn kèm tiêu chí (b) của 03. |
| **C2** | **Đã sửa** | Mục 6.1, 6.2 | Sửa hộp thoại nói rõ sản phẩm **chưa mở bán**, ngày dự kiến chưa chắc chắn; dán nhãn `[Bản mẫu có người biên tập]`; bỏ cam kết hoàn tiền kiểu đang bán; cam kết báo kết quả & xóa dữ liệu sau 60 ngày nếu dừng. |
| **C3** | **Đã sửa** | Mục 3.1, 4.1, 4.2, CSV | Bỏ `2.5 Flash` và `GPT-4.1-mini` đã khai tử; chọn **`Gemini 3.5 Flash-Lite`** (Paid tier, 2.880đ/Gói 2 = 1,93%) + so sánh `3.8 Flash` giá 2027 (10.506đ), kiến trúc lai (4.970đ), `GPT-6.1 Terra` (7.004đ), `DeepSeek` giờ Peak (1.868đ); tính lại `120k in / 30k out` có gửi lại ngữ cảnh hỏi đáp; sửa mọi câu `< 1,5%`. |
| **C4** | **Đã sửa** | Mục 3.2, 5.3, 5.4 | Cắt MVP Tết còn 1 luồng `lá số → Gói 2 → HTML in được + 8 câu hỏi`; hoãn PDF server, Referral, Gói 3, 12 trang theo tuổi; thêm phân bổ giờ/tuần cho 1 người (~28–30h/tuần, kèm kho văn miễn phí); thêm **nhánh lùi 08/01/2027**; đổi KPI sang khoảng `[GIẢ ĐỊNH]`. |
| **N1** | **Đã sửa** | Mục 2, 6.2 | Trả về đúng tiêu chí dừng chặt của 03 (`< 4/20` từng chi tiền ⇒ DỪNG); thống nhất 1 bộ ngưỡng giữa Mục 2 & 6; giới hạn tối đa 1 vòng ITERATE. |
| **N2** | **Đã sửa** | Mục 4.6, CSV | Đổi thành "kiểm tra tính nhất quán số học với khung SOM 02", bỏ cụm "khả thi cao" và "khớp hoàn toàn". |
| **N3** | **Đã sửa** | Mục 4.5, CSV | Ghi rõ bối cảnh thật (RevenueCat = app thuê bao, First Page Sage = SaaS B2B); xóa số 1–3% & 3,3% không nguồn; gắn `[GIẢ ĐỊNH]` cho cả 3 kịch bản trên cả 04 và CSV; thêm cảnh báo độ nhạy giá. |
| **N4** | **Đã sửa** | Mục 4.2, 4.3, CSV | Sửa SePay gói Startup thành **120.000đ/tháng** (hạn mức 180 GD/tháng); đổi nhãn phí vượt 500đ sang `[GIẢ ĐỊNH]`; ghi chú nâng gói khi vượt 180 GD mùa Tết. |
| **N5** | **Đã sửa** | Mục 2, 3.2 | Hạ điểm khớp bằng chứng Hướng A xuống `4/5` và ghi rõ cảnh báo **R8**; sửa đúng 23 STT theo 03; ghi rõ `#68, #69` là diễn giải (không làm neo giá) và giá App Store là giá niêm yết. |
| **N6** | **Đã sửa** | Mục 6.3, 5.4 | Cập nhật sang **Luật TMĐT 122/2025/QH15** & **NĐ 248/2026/NĐ-CP** (hiệu lực 01/07/2026, UBND cấp tỉnh xác nhận); giao kiểm bản gốc ở Tuần 2. |
| **N7** | **Đã sửa** | Mục 3.1, 4.1, 6.3 | Bắt buộc **Paid tier** cho Gemini; lọc tên/SĐT trước API; thêm checkbox dữ liệu nhạy cảm ở ô hỏi đáp; lập hồ sơ chuyển dữ liệu ra nước ngoài theo NĐ 356/2025. |
| **N8** | **Đã sửa** | Mục 3.3, 4.2, CSV | Đổi giới hạn hoàn tiền thành `1 lần / STK chuyển tiền`; định nghĩa điều kiện hoàn bằng tiêu chí kiểm được; thêm độ nhạy hoàn tiền **3% / 6% / 10%** ở 04 & CSV. |
| **N9** | **Đã sửa** | Mục 3.1, 5.4 | Quy định rõ: bản Tết không bán Gói 2 cho người không biết giờ sinh; đo tỷ lệ nhóm này, nếu ≥ 50% sẽ mở gói riêng theo ngày sinh sau Tết. |
| **N10** | **Đã sửa** | Mục 5.4 (T5–T6) | Dời bài thử mù R3 sang **Tuần 5 sau khi có pipeline tự động trên đúng model thật**; tăng cỡ mẫu lên **8–10 người P2**; thêm nhánh trượt (< 70% ⇒ DỪNG mở bán). |
| **N11** | **Đã sửa** | Mục 5.1, 5.2, 5.4 | Xóa kỳ vọng SEO cho Tết 2027; coi SEO là đầu tư dài hạn 2027–2028; không đặt KPI SEO cho tháng 01–02/2027. |
| **G1–G11** | **Đã sửa** | Toàn tệp 04 & CSV | Đã sửa trọn bộ 11 góp ý: làm rõ Gói 3 (G1); bỏ neo với Tra Cứu Tử Vi 680k (G2); dẫn link trang cụ thể (G3); sửa nhãn CSV DeepSeek thành `CÔNG THỨC` (G4); đổi thuế >1 tỷ thành `[CHƯA KIỂM]` (G5); giới hạn lưu link 3 năm (G6); thêm kiểm mã ngành VSIC (G7); chỉnh cơ chế Referral khớp CAC ~15,5k (G8); bỏ A/B tiêu đề ở R1 (G9); thêm cookie consent & cấm gửi ngày sinh vào Meta Pixel (G10); sửa nguồn CAC 150–350k về mục 4.4 (G11). |

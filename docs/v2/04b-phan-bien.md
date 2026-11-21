# Giai đoạn 4b: Phản biện độc lập cho Giai đoạn 4

> Ngày phản biện: **20/11/2026**. Đối tượng: [`04-dinh-vi-kinh-doanh.md`](04-dinh-vi-kinh-doanh.md) và [`04-kinh-te-don-vi.csv`](04-kinh-te-don-vi.csv).
> Đối chiếu với: [`02-thi-truong.md`](02-thi-truong.md), [`03-khach-hang.md`](03-khach-hang.md), [`bang-chung/trich-dan-khach-hang.md`](bang-chung/trich-dan-khach-hang.md), và [`01-kiem-ke.md`](01-kiem-ke.md) (chỉ để kiểm khối lượng việc).
> Quy ước: "04 dòng N" là số dòng trong tệp 04. "CSV hàng N" là số dòng trong tệp CSV (hàng 1 là tiêu đề). Số do người phản biện tự ước tính được ghi **[ƯỚC TÍNH PHẢN BIỆN]**.
> Phản biện này không sửa 04 hay tệp nào khác.

## Tóm tắt

| Mức | Số điểm |
|:--|:-:|
| **Chặn** (phải sửa trước khi sang GĐ5) | **4** |
| **Nên sửa** | **11** |
| **Góp ý** | **11** |

Ba điểm nặng nhất:
1. **Ngưỡng ĐẠT của thí nghiệm R1 quá dễ.** Ngưỡng này vẫn cho ĐẠT khi chuyển đổi thật nằm dưới cả kịch bản Thấp của chính 04 (C1).
2. **Hộp thoại "nút mua giả" nói sai sự thật**, và bản luận mẫu do người biên tập tay không được dán nhãn. Hai chỗ này trái với định vị "minh bạch", và làm méo kết quả đo (C2).
3. **Model chính Gemini 2.5 Flash đã bị khai tử.** Từ 01/12/2026, mọi lệnh gọi tự chuyển sang model khác. Bảng chi phí AI và bài thử R3 đang dựa trên một model sắp không còn (C3).

---

## 1. Kiểm số liệu

### 1.1. Số có nguồn: mở lại nguồn để kiểm

| Số trong 04 | Vị trí | Kết quả | Số đúng hoặc ghi chú | Nguồn, ngày tra |
|:--|:--|:-:|:--|:--|
| Gemini 2.5 Flash: In $0,30 / Out $2,50 | 04 dòng 100; CSV hàng 16–17 | **Đúng giá, nhưng model đã bị khai tử** | Trang ghi nguyên văn: *"Gemini 2.5 Flash (`gemini-2.5-flash`) is deprecated and is no longer available to select in Google AI Studio."* và *"Effective December 1, 2026, all API requests to `gemini-2.5-flash` will automatically route to"* Gemini 3.5 Flash-Lite (giá $0.30 / $2.50, gồm thinking). Tức là 11 ngày nữa, "model đề xuất chính" sẽ thành một model khác. | [aistudio.google.com/docs/pricing](https://aistudio.google.com/docs/pricing) (link cũ `ai.google.dev/gemini-api/docs/pricing` chuyển hướng 301 tới đây), tra 20/11/2026 |
| Gemini 2.5 Flash-Lite: In $0,10 / Out $0,40 | 04 dòng 99; CSV hàng 13–14 | **Đúng** | Phần trang em đọc được không ghi khai tử. Trang dài 118k ký tự, em chỉ đọc 100k ký tự đầu, nên **chưa chắc chắn** về trạng thái. | Như trên |
| (04 không nhắc) Giá Flash mới | — | **Bổ sung** | Gemini 3.8 Flash: $0.75 / $3.75 đến 31/12/2026, rồi **"$1.50 starting January 1, 2027"** cho input; output cũng tăng theo mốc này ($7.50). Gemini 3 Flash Preview: $0.50 / $3.00, trang gọi là model "legacy". | Như trên |
| (04 không nhắc) Điều khoản dữ liệu Gemini | — | **Bổ sung** | Free tier: "Used to improve our products" = **Yes**. Paid tier: **No**. Liên quan Luật 91/2025 (xem N7). | Như trên |
| GPT-4.1-mini: In $0,40 / Out $1,60 | 04 dòng 101; CSV hàng 20–21 | **Đúng giá, nhưng đã bị khai tử** | Trang model ghi "$0.4" / "$1.6" per "1M tokens", kèm **"Status: Deprecated"** và khuyến nghị "we recommend starting with GPT-5 mini". Link `openai.com/api/pricing` mà 04 dẫn trả **HTTP 403**, nên em kiểm qua trang model. | [developers.openai.com/api/docs/models/gpt-4.1-mini](https://developers.openai.com/api/docs/models/gpt-4.1-mini), tra 20/11/2026 |
| DeepSeek "V4.1-Flash": Off-peak $0,15 / $0,60; Peak $0,30 / $1,20 | 04 dòng 102; CSV hàng 23 | **Đúng** | Tên gọi API là `deepseek-flash` (phiên bản "DeepSeek-V4.1-Flash-1017"). Giờ peak là 01:00–04:00 và 06:00–10:00 UTC, thứ Hai đến thứ Sáu. Đổi sang giờ Việt Nam là 08:00–11:00 và 13:00–17:00, tức trùng giờ hành chính. | [api-docs.deepseek.com/quick_start/pricing](https://api-docs.deepseek.com/quick_start/pricing), tra 20/11/2026 |
| SePay gói Startup **96.000đ/tháng** | 04 dòng 113, 125; CSV hàng 34 | **Sai** | Trang ghi gói Startup **"120,000đ /tháng"**. Trên trang **không có con số 96.000đ**. Có nút chọn trả theo năm, ghi "Giảm tới 20%". 96k chỉ đúng nếu trả cả năm và được giảm đủ 20%, nhưng trang không ghi con số này. Mức thấp nhất của gói chỉ có **180 giao dịch/tháng**. | [sepay.vn/bang-gia.html](https://sepay.vn/bang-gia.html), tra 20/11/2026 |
| SePay phí vượt hạn mức "200–533đ/GD" | 04 dòng 113; CSV hàng 25 | **Không kiểm được** | Trang nói có tính phí vượt "theo số giao dịch vượt và đơn giá của gói", nhưng **không ghi đơn giá**. CSV gắn nhãn "CÓ NGUỒN" là không đúng. | Như trên |
| RevenueCat: Freemium 2,1% / Hard paywall 10,7% (Day-35) | 04 dòng 148; CSV hàng 49–50 | **Đúng số, sai bối cảnh** | Số này đo **app di động bán thuê bao**: tỷ lệ lượt cài có ít nhất 1 thuê bao trả tiền trong 35 ngày. Nó không phải tỷ lệ "lập lá số trên web → mua 1 lần". | [revenuecat.com/state-of-subscription-apps-2026](https://www.revenuecat.com/state-of-subscription-apps-2026/) và [blog benchmarks 2026](https://revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026) (qua WebSearch), tra 20/11/2026 |
| First Page Sage: 2,1% (EdTech) – 5,6% (LegalTech) | 04 dòng 149; CSV hàng 51 | **Đúng số, sai bối cảnh** | Bản cập nhật 11/09/2026 có đúng hai số này. Nhưng đây là **SaaS B2B**, dữ liệu lấy từ khách hàng của chính First Page Sage. Câu "B2C web phổ biến 1%–3%" (04 dòng 149) và dải "3,3%–5,6%" (04 dòng 153) **em không tìm thấy trong nguồn**. CSV hàng 51 lại ghi "2.1%–5.6%", lệch với 04. | [firstpagesage.com/seo-blog/saas-freemium-conversion-rates](https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/) (qua WebSearch), tra 20/11/2026 |
| NĐ 141/2026: miễn GTGT và TNCN khi doanh thu ≤ 1 tỷ/năm | 04 dòng 115; CSV hàng 27 | **Đúng (theo báo)** | Nhiều báo xác nhận: ban hành 29/04/2026, hiệu lực từ 01/01/2026. Em **chưa đối chiếu văn bản gốc**. | [Tạp chí Công Thương](https://tapchicongthuong.vn/chinh-thuc--nang-nguong-chiu-thue-voi-ho-kinh-doanh-len-1-ty-dong-nam--ap-dung-tu-1-1-2026-514336.htm), [SGGP](https://www.sggp.org.vn/nang-nguong-chiu-thue-voi-ho-kinh-doanh-len-1-ty-dongnam-post850439.html), tra 20/11/2026 |
| Thông báo website TMĐT theo NĐ 52/2013 và NĐ 85/2021, "duyệt khoảng 3 ngày làm việc" | 04 dòng 295–297 | **Có thể lỗi thời** | Luật Thương mại điện tử số **122/2025/QH15** có hiệu lực từ **01/07/2026**. **NĐ 248/2026/NĐ-CP** (30/06/2026) hướng dẫn luật này. Một trang tổng hợp nói NĐ 248 "thay thế hoàn toàn" NĐ 52/2013 và 85/2021, nhưng em **chưa thấy văn bản gốc**. Thủ tục và thời hạn 3 ngày: **chưa kiểm**. | [thuvienphapluat – Luật 122/2025](https://thuvienphapluat.vn/van-ban/Thuong-mai/Luat-Thuong-mai-dien-tu-2025-so-122-2025-QH15-662035.aspx), [hethongphapluat – NĐ 248/2026](https://hethongphapluat.com/nghi-dinh-248-2026-nd-cp-huong-dan-luat-thuong-mai-dien-tu.html), [moit.gov.vn](https://moit.gov.vn/tin-tuc/bo-cong-thuong-pho-bien-luat-thuong-mai-dien-tu-va-nghi-dinh-so-248-2026-nd-cp.html), tra 20/11/2026 |
| Mùng 1 Tết Đinh Mùi = Thứ Bảy 06/02/2027; Giao thừa 05/02; tháng Chạp thiếu; còn 78 ngày | 04 dòng 178 | **Đúng** | Nhiều trang khớp. Em tự đếm: 10 + 31 + 31 + 6 = 78 ngày. | [thuvienphapluat](https://thuvienphapluat.vn/hoi-dap-phap-luat/tet-2027-vao-ngay-nao-tet-2027-nam-con-gi-138079418.html), [luatminhkhue](https://luatminhkhue.vn/ngay-mung-1-tet-dinh-mui-va-nhung-dieu-can-luu-y.aspx), tra 20/11/2026 |
| Tỷ giá 25.940; DigitalOcean $12; VNNIC 350k/năm; Apple/Google 15%; MDR ví 1,5–2,5% | 04 dòng 87, 113, 123, 126 | **Không kiểm** | Các số này không đổi kết luận, nên em không mở lại. Riêng MDR ví điện tử **không có link nguồn** trong 04. | — |

### 1.2. Tự tính lại CSV

| Phép tính | Ô | Em tính lại | Kết quả |
|:--|:--|:--|:-:|
| AOV | CSV hàng 9 | 43.450 + 52.150 + 29.900 = 125.500 | Đúng |
| AI Flash-Lite, Gói 2 | CSV hàng 15 | (0,0025 + 0,0048) × 25.940 = 189,4 | Đúng |
| AI Flash, Gói 2 (12k / 15k out) | CSV hàng 18–19 | 0,0375 × 25.940 = 972,8; 0,045 × 25.940 = 1.167,3 | Đúng |
| AI GPT-4.1-mini | CSV hàng 22 | 0,0292 × 25.940 = 757,4 | Đúng |
| AI DeepSeek off-peak | CSV hàng 23 | 0,01095 × 25.940 = 284,0 | Đúng |
| AI pha trộn 3 gói | CSV hàng 24 | 0,55 × 584 + 0,35 × 1.167 + 0,10 × 4.085 = 1.138 | Đúng |
| COGS và lãi đóng góp (Web, Ví, App) | CSV hàng 28–31 | 5.465 / 120.035; 7.475 / 118.025; 23.790 / 101.710 | Đúng |
| FC Mức 1, 2, 3 | CSV hàng 37, 40, 42 | 1.038.000; 5.538.000; 20.538.000 | Cộng đúng. **Đầu vào SePay sai** (xem 1.1). Với 120k: Mức 1 = 1.062.000đ |
| Hòa vốn Mức 1 / có CAC / Mức 2 / Mức 3 | CSV hàng 52–55 | 8,65 → 9; 11,53 → 12; 46,1 → 47; 171,1 → 172 | Đúng. Sửa SePay lên 120k vẫn ra **9 / 12 / 47 / 172** đơn |
| Lượt lập lá số cần cho hòa vốn | 04 dòng 159–162 | Ví dụ 47 / 0,012 = 3.917; 172 / 0,045 = 3.823 | Đúng |
| SOM năm 1, 3 kịch bản | CSV hàng 57–67 | Ví dụ 313.750.000 − 13.662.500 − 66.456.000 = 233.631.500 | Đúng |
| CAC Facebook lạnh | CSV hàng 46–47 | 1.500 / 0,4 / 0,025 = 150.000; 3.500 / 0,4 / 0,025 = 350.000 | Đúng |
| CAC giới thiệu bạn bè | CSV hàng 45 (20.000đ) và 04 dòng 141 (5k–25k) | Theo cơ chế ở 04 dòng 225, mỗi đơn qua giới thiệu tốn: giảm 15k cho người mua + mã 25k cho người mời = **tối đa 40.000đ** | **Lệch với cơ chế chính 04 mô tả** |
| Cỡ mẫu R1: n = 300, p = 5%, ±2,5% | 04 dòng 281 | 1,96 × √(0,05 × 0,95 / 300) = 2,47% | Đúng về số học. Nhưng xem mục 4 về cách dùng con số này |

**Kết luận phần tính toán:** Số học trong CSV gần như đúng hết. Chỗ sai nằm ở **đầu vào**: giá SePay, model đã khai tử, khối lượng token, tỷ lệ chuyển đổi lấy sai bối cảnh. Phép cộng trừ thì không sai.

### 1.3. Giả định token: thấp hơn thực tế

- **Vị trí:** 04 dòng 93 và CSV hàng 11 giả định 25.000 token input cho cả 2 bước viết báo cáo **và** 8 lượt hỏi đáp.
- **Vấn đề:** Mỗi lượt hỏi đáp phải gửi lại lá số, bản báo cáo (~8k token) và lịch sử chat. 8 lượt như vậy đã vượt 25k token rất xa. **[ƯỚC TÍNH PHẢN BIỆN]**: khoảng 100k–150k token input. Thêm vào đó, thinking của model mới không có trần trong giả định.
- **Ảnh hưởng (ước tính 120k token vào, 30k token ra):**

| Model, giá | Chi phí Gói 2 | So với 149k | Pha trộn trên AOV |
|:--|:-:|:-:|:-:|
| 3.5 Flash-Lite ($0.30 / $2.50, model mà 2.5 Flash tự chuyển sang) | ~2.880đ | ~1,9% | ~2,3% |
| 3.8 Flash, giá từ 01/01/2027 ($1.50 / $7.50) | ~10.500đ | ~7,0% | **~8,2%** |

- **Nhận định:** Kết luận ở 04 dòng 104 ("chất lượng quan trọng hơn giá model") vẫn đứng được. Nhưng câu "chi phí AI < 1,5% giá bán" ở 04 dòng 52 và biên 95,65% thì **không còn chắc**. Nếu chọn model Flash cao cấp, biên có thể xuống khoảng 88%.

---

## 2. Kiểm logic

| # | Vấn đề | Vị trí trong 04 | Đối chiếu bằng chứng |
|:-:|:--|:--|:--|
| L1 | **Chấm Hướng A 5/5 về "khớp bằng chứng" mà bỏ qua cảnh báo của 03.** 03 ghi rõ 21/26 câu ở chủ đề 1 và 4 đến từ báo, và báo chọn chuyện bị lừa để viết (03 dòng 28, 133). 03 cũng nêu R8: bộ trích dẫn lệch nguồn. 04 không nhắc R8 ở bất kỳ đâu. | 04 dòng 25, 30 | 03 dòng 5, 28, 133, 216 |
| L2 | **Đếm sai số câu.** 04 ghi "23 câu" nhưng chỉ liệt kê 18 STT (#14–26 là 13 câu, cộng 5 câu nữa). Trong đó có câu lạc chủ đề: #17 là lo lộ thông tin, #20 là lỗi nhập ngày, #78 thuộc P5, #93 là hoài nghi chứ không phải "đòi căn cứ". Số 23 thật ra là tổng chủ đề 5 + 7 + 9 của 03, nhưng danh sách STT của 04 khác với 03. | 04 dòng 25 | 03 dòng 19, 21, 23, 29 |
| L3 | **Dùng câu diễn giải làm neo giá.** #68 và #69 là **diễn giải**. Tệp trích dẫn ghi rõ: "Không được dùng loại này làm trích dẫn". 04 dùng hai câu này làm căn cứ "sẵn lòng trả" và để đặt giá Gói 1. Ngoài ra, cả hai người này **dừng lại** khi bị đẩy sang lễ. Họ trả 100–200k cho 5 phút với người thật, không phải cho một bản văn tự động. | 04 dòng 27, 58 | Tệp trích dẫn dòng 9, 86–87 |
| L4 | **Coi giá niêm yết là bằng chứng có người trả.** "Trả 49k–599k trên app Thái Âm" là giá niêm yết. Tệp trích dẫn ghi rõ: "Đây là giá niêm yết, không phải doanh thu thật". | 04 dòng 27 | Tệp trích dẫn dòng 123, 132 |
| L5 | **Nới lỏng tiêu chí dừng của 03.** 03 quy định: nếu < 4/20 người từng trả tiền thì **dừng** thu tiền trực tiếp. 04 thêm điều kiện "VÀ cả 2 vòng Fake Door < 1,5%". Ở mục 6, mức TRƯỢT cũng cần đồng thời "< 2%" và "phỏng vấn trượt". Ngưỡng còn lệch nhau giữa hai mục (< 2% và < 1,5%). Kết quả là đường dừng khó xảy ra hơn những gì 03 đã duyệt. | 04 dòng 41, 291 | 03 dòng 198 |
| L6 | **"Khớp đúng giữa SOM" là phép tính vòng tròn.** 04 lấy lại đúng 100.000 lượt và 2,5% từ 02, với AOV 125,5k nằm trong khung 99–149k của 02. Kết quả tất nhiên khớp 02. Đây không phải kiểm chứng. Cụm "tính khả thi cao" là nói quá. | 04 dòng 169, 172 | 02 dòng 98–99 |
| L7 | **Lấy tỷ lệ chuyển đổi sai bối cảnh, rồi gắn nhãn như có nguồn.** Mục 1.1 đã nêu: RevenueCat đo app thuê bao, First Page Sage đo SaaS B2B. CSV hàng 50–51 gắn nhãn "NGUỒN THAM CHIẾU", trong khi 04 dòng 152–153 ghi [GIẢ ĐỊNH]. Tỷ lệ chuyển đổi cũng được giữ nguyên khi giá tăng từ mức mặc định 20k của Chợ Tử Vi lên AOV 125,5k. | 04 dòng 148–153; CSV hàng 50–51 | 02 dòng 28 |
| L8 | **Bỏ ngỏ R4 ở tầng trả phí.** Bản miễn phí có chế độ "chưa rõ giờ sinh". Nhưng cả 3 gói trả phí đều cần đủ 12 cung, và 04 không nói người không biết giờ sinh mua được gì. Trong khi đó, 03 quy định: nếu ≥ 10/20 người không biết giờ sinh thì đây là việc **bắt buộc**. | 04 dòng 51, 58–60 | 03 dòng 197, 212 |
| L9 | **R3 không có nhánh xử lý khi trượt.** Bài thử mù diễn ra ở T2, **trước** khi có engine và pipeline (T3–T4). Vậy bài thử đo một bản biên tập tay, không đo bản tự động. Ngưỡng 4/5 người dựa trên mẫu quá nhỏ. Và nếu trượt thì làm gì, 04 không nói. | 04 dòng 233 | 03 dòng 211 |
| L10 | **R2 và R7 vẫn treo, nhưng kế hoạch đã dựa vào chúng.** Keyword Planner và Google Trends chưa làm (04 dòng 193). Thế mà kế hoạch tuần vẫn kỳ vọng SEO lên top trong 4–8 tuần (04 dòng 185). Chính 04 dòng 139 lại ghi SEO cần 3–6 tháng. | 04 dòng 139, 185, 193 | 03 dòng 210, 215 |

**Kết luận logic:** Chọn Hướng A (P1 + P2, minh bạch, không hù dọa) **vẫn hợp lý** và khớp lựa chọn của 03. Vấn đề không nằm ở hướng đi. Vấn đề là 04 trình bày hướng này như đã được chứng minh ("5/5", "khớp hoàn toàn", "khả thi cao"). Thực tế, 03 coi nó chỉ là giả thuyết, và R1 vẫn chưa được kiểm.

---

## 3. Kiểm khả thi

### 3.1. Bảng giá so với mức sẵn lòng trả và giá đối thủ

| Gói | Giá | Ước đoán của 03 | Đối thủ gần nhất (02) | Nhận định |
|:--|:-:|:--|:--|:--|
| Gói 1 | 79k | P1: 49–199k | Thái Âm Khởi Đầu 49k / 99k; Chợ Tử Vi mặc định 20k (cùng kênh web, cùng VietQR) | Nằm trong khung. Nhưng đắt gấp 4 lần Chợ Tử Vi, đối thủ cùng kênh. |
| Gói 2 | 149k | P1: 49–199k; P2: 99–399k | Thái Âm Bạc 120k, Vận 2 năm 199k | Hợp lý. Neo với Tra Cứu Tử Vi 680k (04 dòng 59) là so khác loại, vì báo cáo kia dài 200–500 trang. |
| Gói 3 | 299k | P1 chưa có cho nhóm; P4: 100–300k/sự kiện | Lịch Việt trọn đời 390k | Hợp lý nếu tính ra khoảng 100k/lá số. Tên "3 lá số" mà nội dung chỉ "phân tích hợp 2 người" thì dễ gây hiểu lầm. |

**Lưu ý quan trọng:** Mức sẵn lòng trả ở 03 vốn được **suy ra từ chính giá đối thủ**. Vậy câu "giá khớp mức sẵn lòng trả" chỉ có nghĩa là "giá nằm giữa giá đối thủ". Nó không phải bằng chứng độc lập. Chỉ thí nghiệm R1 mới trả lời được câu hỏi này.

### 3.2. Kế hoạch 90 ngày cho một người

Theo 01, phần lớn mã nguồn cũ (giao diện, engine, kho văn) chép từ `chotuvi.com` và phải **bỏ hoặc viết lại từ đầu** (01 dòng 11, 21–24). Đối chiếu với lịch ở 04 dòng 232–244:

| Khối việc trong 2 tuần T3–T4 (04–17/12/2026) | Nhận định **[ƯỚC TÍNH PHẢN BIỆN]** |
|:--|:--|
| Viết lại engine lịch âm và an sao Nam Phái bằng TypeScript, kèm test | Riêng việc này đã cần nhiều tuần. 30 unit test là quá ít cho hơn 100 sao. |
| Tự biên soạn kho văn rule-based cho bản miễn phí (04 dòng 51: "0đ AI") | Kho cũ bị bỏ vì vướng bản quyền (01 dòng 24). Không có dòng nào trong lịch dành cho việc viết lại kho này. |
| UI v2, thẻ chia sẻ 9:16 và 1:1, ảnh HD, PDF, link lưu, xóa dữ liệu | Mỗi thứ là một tính năng riêng. |
| SePay webhook, PostgreSQL, pipeline LLM 2 bước + hỏi đáp, prompt chống "văn AI" | Đây là phần lõi của R3. |
| Đăng ký Hộ kinh doanh và thủ tục TMĐT | Căn cứ pháp lý có thể đã đổi (mục 1.1). |
| Song song từ T5–T12: 20 bài SEO, 12 trang theo tuổi, 5 video/tuần rồi 1 video/ngày trên 3 nền tảng, hỗ trợ khách hoàn tiền trong 4 giờ vào tuần Tết | Mức 1 không có cộng tác viên. Vậy toàn bộ việc này đổ lên anh Cường. |

- **KPI quá cao:** 04 dòng 244 đặt mục tiêu ≥ 30.000 lượt lập lá số trong 90 ngày, bằng **30% SOM cả năm**. Mục tiêu này đặt cho một tên miền đang làm lại, kênh hữu cơ chưa có số liệu, và từ khóa chưa kiểm.
- **Không có đường lùi:** Cả mô hình dựa vào kịp mùa Tết. Không có phương án "nếu chưa ra mắt trước tháng Chạp (08/01/2027) thì làm gì".
- **Kết luận:** **Không làm được với một người** nếu giữ nguyên phạm vi này.

### 3.3. Kênh có khách và chính sách quảng cáo

| Kênh | Vướng chính sách theo 02? | Nhận định |
|:--|:--|:--|
| Video ngắn hữu cơ | Quảng cáo trả phí trên TikTok bị hạn chế. Video hữu cơ thì 02 chưa kiểm quy tắc cộng đồng TikTok cho nội dung tử vi. | Hợp với chính sách. Kiểu nội dung "Bóc tách chiêu trò thầy" cần tránh nêu tên người thật để không bị kiện bôi nhọ. Quy tắc cộng đồng TikTok: **chưa kiểm**. |
| SEO | Không vướng | Vướng thời gian (L10). |
| Quảng cáo Facebook lạnh | Personal Attributes, Prohibited Commercial Practices | Câu quảng cáo ở 04 dòng 279 an toàn. Còn việc chạy quảng cáo dẫn tới một trang "nút mua giả" có bị Meta coi là gây hiểu lầm hay không: **chưa kiểm**. |
| Retargeting | Pixel Meta đặt trên trang nhập ngày sinh | Cần xin đồng ý cookie và dữ liệu theo Luật 91/2025. 04 chưa nhắc. |
| Ghi nguồn sai | — | 04 dòng 182 ghi "02 chỉ rõ … Facebook Ads lạnh có CAC 150k–350k". Con số này do chính 04 giả định ở mục 4.4, không có trong 02. |

---

## 4. Thí nghiệm R1 (fake door)

### 4.1. Có đo đúng điều cần đo không? **Chưa.**

1. **Mẫu số khác nhau.** Ngưỡng ĐẠT là `price_click_rate` ≥ 5%, tính trên **người cuộn tới bảng giá của landing page** (04 dòng 283, 289). Kịch bản Cơ sở 2,5% thì tính trên **lượt lập lá số** (04 dòng 150). Theo chính 04:
   - Tỷ lệ trả tiền thật bằng 1/2 đến 1/3 tỷ lệ bấm thử. Vậy 5% bấm thử ⇒ **1,7–2,5% người xem bảng giá** trả tiền thật.
   - Phễu ở 04 dòng 253 coi "≥ 35% lá số tới bảng giá" là TỐT. Vậy 1,7–2,5% người xem bảng giá ⇒ **0,6–0,9% lượt lập lá số**.
   - Con số này **thấp hơn cả kịch bản Thấp (1,2%)**. Câu "khớp kịch bản Cơ sở" ở 04 dòng 289 là sai.
2. **Chỉ số khách để lại liên lạc bị nhiễu.** Hộp thoại mời "nhận bản luận thử miễn phí nếu tham gia góp ý 10 phút" (04 dòng 273). Người để lại Zalo có thể vì **đồ miễn phí**, không phải vì muốn trả 79–149k.
3. **Landing page khác sản phẩm thật.** Người xem landing page chưa nhập ngày sinh, chưa thấy lá số của mình. Vì vậy thí nghiệm không kiểm R6 (ngại nhập ngày sinh), cũng không kiểm "khoảnh khắc trúng" mà mô hình dựa vào.
4. **Tầng 2 (thu tiền thật) không chạy được kịp.** Thủ tục pháp lý nằm ở T3–T4, nhưng quyết định ĐẠT/TRƯỢT lại ở T2 (04 dòng 233–235). Thực tế, quyết định code chỉ dựa vào tầng "nút mua giả".
5. **Quyết định ĐẠT bỏ qua phỏng vấn.** Hàng ĐẠT (04 dòng 289) không đòi tiêu chí (b) của 03 ("≥ 6/20 đã chi ≥ 50k").

### 4.2. Cỡ mẫu và ngưỡng

- Phép tính ±2,5% là đúng. Nhưng chính độ rộng này cho thấy **n = 300 không tách được các vùng quyết định**:
  - Quan sát 15/300 (5%): khoảng tin cậy Wilson 95% ≈ **3,1%–8,1%**, chồng lên vùng "CHƯA RÕ" (2–5%).
  - Ngưỡng 8/300 người để lại liên lạc: khoảng tin cậy ≈ **1,4%–5,2%**.
- A/B 2 tiêu đề với 250 lượt mỗi bản (04 dòng 271, 281) không đủ để thấy khác biệt ở tỷ lệ khoảng 5%. Chỉ nên coi là tín hiệu định tính.
- Lấy đủ ≥ 300 người xem bảng giá trong 1 tuần (T2) với ≤ 1 triệu tiền quảng cáo là chưa chắc. **[ƯỚC TÍNH PHẢN BIỆN]**: CPC 1.500–3.500đ cho ra 285–667 lượt bấm, nhưng không phải ai cũng cuộn tới bảng giá. Cần tách số liệu theo nguồn khách, vì người đến từ quảng cáo và người đến từ nhóm Facebook có ý định khác nhau.

### 4.3. Pháp lý và đạo đức

| Vấn đề | Vị trí | Vì sao sai |
|:--|:--|:--|
| Hộp thoại ghi "Hệ thống mở khóa tự động sẽ ra mắt **vào tuần tới**" | 04 dòng 273 | Theo lịch của chính 04, ra mắt mềm là 18/12/2026 (T5), tức 3–4 tuần sau, và **chỉ khi ĐẠT**. Câu này sai sự thật, trái với định vị "minh bạch". |
| Bản luận mẫu "do anh Cường tự biên tập + chạy thử LLM tốt nhất" không được dán nhãn | 04 dòng 270 | Khách được hứa một chất lượng mà sản phẩm tự động chưa chứng minh. Kết quả đo vì thế cũng bị thổi phồng. |
| Landing page hứa "Hoàn tiền 100% trong 7 ngày" và "giảm 30% cho 50 người đầu" khi chưa có gì để bán | 04 dòng 269, 273 | Đã hứa thì phải giữ lời, kể cả khi kết quả là đổi hướng hoặc dừng. 04 không có quy trình báo kết quả cho người đã đăng ký, cũng không có hạn xóa dữ liệu nếu không ra mắt. |
| Căn cứ TMĐT | 04 dòng 295–297 | Có thể đã bị Luật 122/2025 và NĐ 248/2026 thay (mục 1.1). Phải tra lại trước Tầng 2. |

---

## 5. Kết luận

### 5.1. Bảng điểm cần sửa

| # | Mức | Điểm | Vị trí | Đề xuất sửa cụ thể |
|:-:|:--|:--|:--|:--|
| C1 | **Chặn** | Ngưỡng ĐẠT của R1 vẫn cho qua khi chuyển đổi thật dưới kịch bản Thấp. Mẫu số lệch. Chỉ số liên lạc bị nhiễu vì quà miễn phí. Bỏ qua phỏng vấn. | 04 dòng 273, 283–291 | (a) Đổi landing page thành luồng nhập ngày sinh → xem bản miễn phí → thấy giá, và đo `bấm mua / lá số tạo`, cùng mẫu số với mô hình. (b) Đặt ngưỡng ĐẠT ngược từ mục tiêu: muốn 2,5% trả tiền thật với tỷ lệ 1/2–1/3 thì cần **≥ 5–7,5% bấm mua trên lá số tạo**. (c) Tách lời mời nhận bản thử miễn phí ra khỏi chỉ số liên lạc sau khi thấy giá, hoặc bỏ hẳn lời mời này. (d) Đạt R1 phải đi kèm tiêu chí (b) của 03 mục 6. |
| C2 | **Chặn** | Hộp thoại nói sai ngày ra mắt. Bản mẫu biên tập tay không dán nhãn. Hứa hẹn không có quy trình giữ lời. | 04 dòng 269–273 | Viết lại hộp thoại: "Sản phẩm **chưa mở bán**. Bạn vừa giúp bọn mình đo nhu cầu. Nếu ra mắt (dự kiến 18/12/2026, chưa chắc), bọn mình báo bạn và giảm 30%." Dán nhãn "Bản mẫu có người biên tập". Cam kết gửi thư báo kết quả cho mọi người đăng ký, và xóa dữ liệu sau 60 ngày nếu không ra mắt. |
| C3 | **Chặn** | Model chính đã khai tử. Từ 01/12/2026, lệnh gọi tự chuyển sang 3.5 Flash-Lite. GPT-4.1-mini cũng đã khai tử. Giả định token bỏ sót việc gửi lại ngữ cảnh khi hỏi đáp. | 04 dòng 91–104, 112, 235; CSV hàng 11–24 | Chọn model đang còn bán và chọn model dự phòng. Tính theo **giá 2027** (3.8 Flash tăng gấp đôi từ 01/01/2027). Đo token thật trên 3 lá số mẫu, gồm cả 8 lượt hỏi đáp. Chạy R3 trên **đúng model sẽ dùng thật**. Sửa câu "< 1,5%" ở dòng 52 cho khớp số mới. |
| C4 | **Chặn** | Kế hoạch 90 ngày không làm được với một người. Không có đường lùi nếu lỡ Tết. KPI 30.000 lượt chưa có căn cứ. | 04 dòng 232–244 | (a) Cắt phạm vi MVP Tết: một luồng lá số → Gói 2 → trang HTML in được. Hoãn PDF, giới thiệu bạn bè, Gói 3, 12 trang theo tuổi. (b) Ghi số giờ làm mỗi tuần cho từng việc. Quyết định trước có thuê cộng tác viên (Mức 2) hay không. (c) Thêm nhánh: "nếu chưa ra mắt trước 08/01/2027 thì chuyển sang bán thủ công và nhắm mùa sau". (d) KPI đổi thành khoảng, gắn nhãn [GIẢ ĐỊNH], và chỉ đặt sau khi có số Keyword Planner. |
| N1 | Nên sửa | Nới lỏng tiêu chí dừng của 03; ngưỡng không thống nhất | 04 dòng 41, 291 | Trả lại đúng tiêu chí của 03: "< 4/20 đã trả tiền ⇒ dừng". Dùng chung một bộ ngưỡng cho mục 2 và mục 6. Giới hạn tối đa 1 vòng CHƯA RÕ. |
| N2 | Nên sửa | "Khớp đúng giữa SOM" là phép tính vòng tròn | 04 dòng 169, 172 | Ghi rõ đây là kiểm tra tính nhất quán với 02, không phải kiểm chứng. Bỏ cụm "khả thi cao". |
| N3 | Nên sửa | Tỷ lệ chuyển đổi lấy sai bối cảnh; câu "B2C web 1–3%" và số "3,3%" không có nguồn; nhãn CSV lệch | 04 dòng 148–153; CSV hàng 50–51 | Ghi bối cảnh từng nguồn (app thuê bao, SaaS B2B). Gắn nhãn [GIẢ ĐỊNH] cho cả 3 kịch bản. Xóa câu không có nguồn. Thêm một kịch bản tỷ lệ chuyển đổi giảm theo giá. |
| N4 | Nên sửa | SePay 96k sai (đúng là 120k/tháng); phí vượt hạn mức không có trên trang; gói thấp nhất 180 GD/tháng | 04 dòng 113, 125; CSV hàng 25, 34, 37 | Sửa thành 120.000đ, hoặc 96k kèm ghi chú "nếu trả theo năm, giảm tối đa 20%, chưa thấy số cụ thể". Đổi nhãn phí vượt thành [GIẢ ĐỊNH]. Chọn hạn mức theo số đơn tuần Tết (~1.200 GD/tháng). |
| N5 | Nên sửa | Phóng đại bằng chứng: chấm 5/5, đếm sai "23 câu", dùng câu diễn giải #68 #69, dùng giá niêm yết | 04 dòng 25, 27, 58 | Hạ điểm "khớp bằng chứng" và ghi cảnh báo R8. Sửa danh sách STT theo đúng 03. Ghi rõ #68 #69 là diễn giải, không dùng làm neo giá. |
| N6 | Nên sửa | Căn cứ TMĐT có thể lỗi thời | 04 dòng 295–297 | Tra Luật 122/2025/QH15 và NĐ 248/2026/NĐ-CP bản gốc. Ghi lại nghĩa vụ của website tự bán hàng từ 01/07/2026. Kiểm lại thời hạn "3 ngày". |
| N7 | Nên sửa | Ô hỏi đáp tự do sẽ thu dữ liệu nhạy cảm (tình cảm, sức khỏe) và gửi ra nước ngoài qua Gemini. 04 chỉ lo cho DeepSeek. | 04 dòng 52, 102 | Thêm ô đồng ý riêng cho dữ liệu nhạy cảm. Lập hồ sơ chuyển dữ liệu ra nước ngoài theo Luật 91/2025 và NĐ 356/2025. Chỉ dùng **Paid tier** (Free tier có dùng dữ liệu để cải thiện sản phẩm). Lọc tên và số điện thoại trước khi gửi lên API. |
| N8 | Nên sửa | Chính sách hoàn tiền: "1 lần/tài khoản" nhưng sản phẩm không có tài khoản; điều kiện (2) mang tính chủ quan; tỷ lệ 3% không có căn cứ | 04 dòng 70–71; CSV hàng 10 | Giới hạn theo số tài khoản ngân hàng chuyển tiền. Định nghĩa "chung chung" bằng tiêu chí kiểm được (ví dụ: đoạn không có nhãn căn cứ). Chạy độ nhạy với tỷ lệ hoàn 3%, 6% và 10%. |
| N9 | Nên sửa | Gói trả phí cho người không biết giờ sinh chưa được định nghĩa (R4) | 04 dòng 51, 58–60 | Thêm gói hoặc chế độ trả phí theo ngày–tháng–năm sinh, nói rõ giới hạn. Hoặc ghi rõ "không bán cho người không biết giờ sinh" và đo xem nhóm này chiếm bao nhiêu. |
| N10 | Nên sửa | R3 thử trên bản biên tập tay, mẫu 5 người, không có nhánh khi trượt | 04 dòng 233 | Chạy R3 sau khi có pipeline thật, trên đúng model sẽ dùng. Tăng lên 8–10 người. Ghi rõ: trượt thì không mở bán và quay lại sửa prompt hoặc model. |
| N11 | Nên sửa | Kỳ vọng SEO mùa Tết mâu thuẫn với "SEO cần 3–6 tháng"; R2 chưa kiểm | 04 dòng 139, 185 | Làm Keyword Planner trước khi chốt kênh. Với mùa Tết 2027, coi SEO là khoản đầu tư cho năm 2028. Không đặt KPI SEO cho tháng 1–2/2027. |
| G1 | Góp ý | Gói 3 tên "3 lá số" nhưng nội dung chỉ phân tích hợp 2 người | 04 dòng 60 | Đổi tên thành "Gói Đôi (2 lá số + hợp đôi)", hoặc nói rõ người thứ 3 nhận gì. |
| G2 | Góp ý | Neo Gói 2 với Tra Cứu Tử Vi 680k là so khác loại | 04 dòng 59; CSV hàng 4 | Neo với Thái Âm 99–199k. Ghi rõ khoảng cách với Chợ Tử Vi 20k. |
| G3 | Góp ý | Nguồn chỉ ghi tên miền gốc (sepay.vn, revenuecat.com, firstpagesage.com); MDR ví điện tử không có link | 04 dòng 113, 148–149 | Dẫn link tới đúng trang, như các link ở mục 1.1 của tệp này. |
| G4 | Góp ý | Nhãn CSV lẫn lộn: chi phí DeepSeek là số tính ra nhưng gắn "CÓ NGUỒN" | CSV hàng 23 | Đổi thành "CÔNG THỨC" và ghi công thức. |
| G5 | Góp ý | "Vượt 1 tỷ thì dự phòng ~7% theo TT 40/2021": thông tư này gắn với cách tính thuế khoán, mà 02 nói đã bỏ từ 2026 | 04 dòng 115 | Ghi [CHƯA KIỂM]. Năm 1 không ảnh hưởng. |
| G6 | Góp ý | "Lưu link vĩnh viễn / trọn đời" trái với nguyên tắc lưu dữ liệu tối thiểu, và tạo nghĩa vụ không có hạn | 04 dòng 52, 59 | Đặt thời hạn (ví dụ 3 năm, có gia hạn). Ghi điều này trong chính sách bảo mật. |
| G7 | Góp ý | Mã ngành đăng ký Hộ kinh doanh cho dịch vụ tử vi: chưa ai kiểm (cả 02 và 04) | 04 dòng 234 | Hỏi phòng đăng ký kinh doanh cấp xã/phường, hoặc tra danh mục ngành VSIC trước T3. |
| G8 | Góp ý | Chi phí giới thiệu bạn bè lệch với cơ chế đã mô tả (tối đa 40k so với 20k ghi trong CSV) | 04 dòng 141, 225; CSV hàng 45 | Tính lại, hoặc giảm thưởng. |
| G9 | Góp ý | A/B tiêu đề trong R1 không đủ mẫu | 04 dòng 271 | Bỏ A/B, hoặc coi là tín hiệu định tính. |
| G10 | Góp ý | Pixel Meta và retargeting trên trang nhập ngày sinh | 04 dòng 143, 240 | Thêm banner đồng ý cookie. Không gửi ngày sinh cho Meta qua pixel. |
| G11 | Góp ý | Ghi nguồn sai: CAC 150–350k là số của 04, không phải của 02 | 04 dòng 182 | Sửa thành "theo giả định mục 4.4". |

### 5.2. Có sang Giai đoạn 5 được chưa?

**Chưa.** Hướng định vị A (P1 + P2, minh bạch, không hù dọa, mua lẻ qua VietQR) đứng được, và GĐ5 có thể dùng lại phần lớn khung của 04. Nhưng GĐ5 sẽ thiết kế sản phẩm dựa trên ba thứ hiện đang hỏng:
- một thí nghiệm R1 không đo đúng mô hình (C1, C2);
- một model sắp không còn (C3);
- một phạm vi MVP mà một người không làm kịp Tết (C4).

Cần sửa trước 4 điểm Chặn. Trong đó C3 chỉ mất khoảng một buổi. C1, C2, C4 cần viết lại mục 6 và mục 5.4. Sau đó **chạy R1 bản đã sửa và 20 phỏng vấn**. GĐ5 chỉ nên bắt đầu khi đã có kết quả này. Các điểm Nên sửa có thể làm song song, nhưng N1 và N7 phải xong trước khi thu tiền thật.

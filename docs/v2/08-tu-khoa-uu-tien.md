# 08 — Từ khóa ưu tiên: chọn và xếp thứ tự công cụ cho bách khoa xemboi.vn

> Ngày lập: **20/11/2026**. Bảng đầy đủ: [`08-tu-khoa.csv`](08-tu-khoa.csv) (65 cụm, UTF-8 có BOM; số thập phân dùng dấu chấm).
> Đầu vào: `tu-khoa/goi-y-google.json` (autocomplete, tải 20/11/2026), `tu-khoa/keyword-planner-1..5.csv` (Google Keyword Planner, Việt Nam, 11/2025–10/2026, tải 20/11/2026), [`07`](07-bach-khoa-huyen-hoc.md), [`07b`](07b-phan-loai-huyen-hoc.md), [`04`](04-dinh-vi-kinh-doanh.md) mục 3.4, 5.2, 5.4.
> Nhãn: **KP** = số Keyword Planner. `[ƯỚC LƯỢNG]` = số suy từ autocomplete, không phải lượt tìm. `[GIẢ ĐỊNH]` = số tự đặt. `[SUY LUẬN]` = suy ra từ bằng chứng có dẫn. `[CHƯA KIỂM]` = chưa xác minh.
> Mọi lượt tìm ghi theo **khoảng** của KP: 10–100, 100–1K, 1K–10K, 10K–100K, 100K–1M, 1M–10M (trung bình tháng trong 12 tháng).

---

## 0. Kết luận trong 10 dòng

1. Dữ liệu: **12.261 gợi ý thô → 10.991 cụm duy nhất**; **5.292 cụm có số KP** (48%). Gom thành **65 cụm chủ đề** (bảng CSV), gộp lên **23 công cụ/trang** (mục 5).
2. **Lỗ hổng lớn nhất của dữ liệu:** cả **1.846 cụm bắt đầu bằng "xem…" hoặc "xông…" đều trống số** (kể cả "xem tuổi", "xem ngày", "xem ngày cưới"). Nhóm xem tuổi, xem ngày phải dùng `[ƯỚC LƯỢNG]`. Cần tải lại riêng lô này (mục 2.3).
3. Cụm lớn nhất có số: "lịch âm hôm nay" và "lịch âm" **1M–10M**; "lá số tử vi", "tử vi", "bản đồ sao", "bói tình yêu", "lịch vạn niên", "lịch âm dương" **100K–1M**.
4. Cơ hội tốt nhất (nhu cầu khá, top tìm kiếm yếu, hợp thương hiệu): **trang phương pháp Nam/Bắc phái**, **bát tự**, **Kinh Dịch / gieo quẻ**, **từ điển tử vi**, **60 hoa giáp – nạp âm**.
5. Lịch âm có nhu cầu lớn nhất nhưng top tìm kiếm bị một tờ báo phủ kín, tiền thấp. Chỉ làm đổi ngày + lịch tháng/năm. **Không làm 5.844 trang ngày.**
6. Trước Tết chỉ thêm **một gói trang tĩnh Tết 2027** (8 giờ, ô SEO T7). Không chen trước R1 và bản Tết.
7. Ba điểm lệch lớn so với 07: **bát tự lên P1**, **Kinh Dịch và bản đồ sao lên sớm**, **lịch ngày 5.844 trang bị hạ**. Chi tiết mục 6.

---

## 1. Phương pháp

### 1.1. Quy trình

| Bước | Làm gì | Công cụ |
|:-:|:--|:--|
| 1 | Gộp 65 hạt giống × (10 gợi ý gốc + gợi ý theo chữ cái a–z) | `goi-y-google.json` |
| 2 | Bỏ trùng: 12.261 dòng thô → 10.991 cụm (đúng bằng số dòng KP trả về) | Grep đếm |
| 3 | Lọc nhiễu, tách thương hiệu, tách nhóm loại hẳn (mục 3) | Grep theo mẫu |
| 4 | Gom 65 cụm chủ đề, mỗi cụm là một trang hoặc một công cụ. Gắn ý định | Đọc tay |
| 5 | Gắn nhu cầu từ KP. Thiếu KP thì dùng chỉ số thay thế | Grep KP |
| 6 | Tra 48 cụm đầu bảng bằng WebSearch ngày **20/11/2026**, ghi tên miền đầu (mục 4) | WebSearch |
| 7 | Chấm điểm cụm, gộp lên công cụ, đối chiếu 07 | Mục 5–6 |

### 1.2. Thang điểm

**Điểm cụm = N × (1 − D) × B × M.** Tối đa 5 × 0,9 × 1 × 5 = **22,5**.

| Hệ số | Thang | Cách chấm |
|:--|:--|:--|
| **N** Nhu cầu | 1–5 | Theo cụm chính KP: **5** = 100K–1M trở lên. **4** = 10K–100K. **3** = 1K–10K, hoặc có ≥ 3 cụm phụ 1K–10K. **2** = 100–1K. **1** = 10–100 hoặc không có dữ liệu. Không có KP thì dùng số biến thể autocomplete: ≥ 150 → 4; 80–149 → 3; 30–79 → 2; < 30 → 1, ghi `[ƯỚC LƯỢNG]`, **trần là 4** |
| **D** Độ khó | 1–5, quy đổi (1 − D) | Đếm **chỗ** do "ông lớn" chiếm trong 5 kết quả đầu: 0–1 → D2; 2–3 → D3; 4–5 → D4. Cụm chính ≥ 100K thì +1. Có ≥ 2 trang yếu (Google Docs, HackMD, Coda, trang spam, diễn đàn) thì −1. Không trang Việt nào trả lời đúng ý thì **D1**. Quy đổi: D1 → 0,9; D2 → 0,7; D3 → 0,5; D4 → 0,3; D5 → 0,15 |
| **B** Hợp thương hiệu | 0 / 0,4 / 0,7 / 1 | **1** = tất định hoặc tra cứu trung tính, không thể hù dọa. **0,7** = cần mẫu câu trung tính (07 mục 3.5). **0,4** = rủi ro cao hoặc làm loãng "bách khoa". **0** = loại theo 04 mục 3.4 hoặc 07 mục 4.4 |
| **M** Kiếm tiền | 1–5 | **5** = bán thẳng Gói 1/2. **4** = dẫn vào lá số, Gói 3 hoặc gói chọn ngày E6. **3** = dẫn gián tiếp vào lá số hoặc báo cáo 49k. **2** = kéo lượt xem, liên quan yếu. **1** = chỉ lượt xem |

**"Ông lớn"** (đếm khi tính D):

| Nhóm | Tên miền gặp trong lần tra |
|:--|:--|
| Trang chuyên ngành lớn | ngaydep.com, xemlicham.com, chogia.vn (chogia phủ rất nhiều cụm "xem ngày", "xem tuổi làm nhà" bằng trang sinh tự động). lichngaytot, tuvi.vn, xemtuong, lichvansu **không xuất hiện** trong công cụ tra này, xem giới hạn 2.4 |
| Báo điện tử | baohatinh.vn, baonghean.vn, vnexpress.net, znews.vn, tuoitre.vn, vtcnews.vn, cafef.vn, vietbao.vn, danviet.vn, baomoi.com, thuvienphapluat.vn, luatminhkhue.vn |
| Thương hiệu lớn viết bài vệ tinh | thegioididong.com, dienmayxanh.com, bachhoaxanh.com, fptshop.com.vn, hoanghamobile.com, cellphones.com.vn, viettelstore.vn, shopee.vn/blog, momo.vn, sapo.vn, wiki.batdongsan.com.vn, vietnamworks.com, careerlink.vn, jobsgo.vn, glints.com, hellobacsi.com, mytour.vn, vinpearl/vinwonders, dienmaycholon.com |
| Trang yếu (dấu hiệu dễ vào) | docs.google.com, hackmd.io, coda.io, muckrack.com, blockdit.com, soundcloud, comicvine, các trang công cụ nước ngoài nhỏ (miniwebtool, masterseanchan, jenova.ai), diễn đàn (tinhte.vn) |

### 1.3. Gộp điểm lên công cụ

**Điểm công cụ = điểm cụm chính (cao nhất) + 0,5 × tổng điểm các cụm phụ gộp vào.** Thứ tự cuối còn xét phụ thuộc (F1 trước C8, D1 cần A4), mùa vụ và ràng buộc 04.

---

## 2. Giới hạn dữ liệu (đọc trước khi dùng số)

### 2.1. Keyword Planner

- Cột 4 chỉ là **khoảng**, vì tài khoản không chạy quảng cáo. Không cộng các khoảng thành tổng chính xác.
- **Cột lượt tìm theo tháng trống toàn bộ.** Không thấy trực tiếp đỉnh mùa. Mùa vụ suy từ cụm gắn năm, cột "Three month change", "YoY change" và lịch âm `[SUY LUẬN]`.
- Số là **trung bình 12 tháng**. Cụm theo mùa (xông đất, văn khấn rằm tháng 7) có đỉnh cao hơn nhiều so với trung bình `[SUY LUẬN]`. Ví dụ "cúng rằm tháng 7", "văn khấn rằm tháng 7" có "Three month change" = −99% (8/2026 → 10/2026), khớp với đỉnh quanh rằm tháng 7.
- Cột "Competition" là cạnh tranh **quảng cáo**. Gần như mọi cụm là "Low". Chỉ sim, biển số, phóng sinh, vài thương hiệu phong thủy là "Medium/High". **Không dùng cột này làm độ khó SEO.**
- KP đo tới 10/2026. Cụm "2027" mới bắt đầu được gõ nên phần lớn trống. Ví dụ "tử vi 2027 đinh mùi" có trong **gợi ý gốc** nhưng KP trống. "tử vi 2027" mới ở 100–1K.

### 2.2. Danh sách từ khóa chỉ là autocomplete của 65 hạt

- Thiếu hẳn các họ từ khóa không có hạt giống: **"19xx mệnh gì"**, **"sao Thiên Cơ / sao X"**, **"đổi ngày dương sang âm"**, **"Tết 2027 ngày nào"**, **"lập lá số tử vi"** (không có trong 10.991 cụm). Các cụm này bị **đánh giá thấp** trong bảng.
- **Gợi ý gốc không đồng nghĩa lượt tìm cao.** Ví dụ "tuổi hợp với nữ 2004", "tuổi hợp nữ 2003" là gợi ý gốc nhưng KP trống; "tuổi hợp 2005" chỉ 10–100. Vì vậy em **không** cộng điểm cho cụm chỉ vì nằm ở gợi ý gốc.

### 2.3. Lỗ hổng "xem…" (quan trọng)

| Tiền tố | Số cụm | Có số KP |
|:--|--:|--:|
| `xem …`, `xông …` | 1.846 | **0** |
| Các tiền tố khác | 9.145 | 5.292 |

> **Đã kiểm lại 20/11/2026, 18:50 (Claude Code):** tạo kế hoạch Keyword Planner mới chỉ gồm 120 cụm "xem…/xông…" (kể cả "xem bói", "xem ngày", "xem tuổi vợ chồng", "xông đất 2027"). Kết quả vẫn là "—" cho mọi cụm. Vậy đây **không phải lỗi tải lô** mà là giới hạn của Keyword Planner với nhóm từ này: có thể do chính sách nội dung xem bói, nhưng chưa kiểm được. Không cần tải lại. Muốn có số cho nhóm này thì phải dùng nguồn khác (Google Search Console sau khi trang lên, hoặc so tương đối trên Google Trends).

"xem tuổi", "xem tuổi vợ chồng", "xem ngày", "xem ngày cưới", "xem bói", "xem tướng", "xem chỉ tay" đều trống. Không thể là do ít người tìm. Nguyên nhân `[CHƯA KIỂM]`: có thể do cách tải lô hoặc cách Planner xử lý lô. **Việc cần làm (30 phút):** tải lại riêng khoảng 50 cụm "xem…" quan trọng nhất (bắt đầu từ cột `tu_khoa_chinh` của các cụm 04, 32, 33, 34, 36, 39, 41 trong CSV). Đến khi có số, nhóm xem tuổi, xem ngày dùng `[ƯỚC LƯỢNG]` + KP của cụm thay thế không có chữ "xem" (ví dụ "năm 1992 hợp với tuổi nào lấy vợ" 1K–10K; "ngày tốt" 10K–100K).

### 2.3b. Bổ sung hạt giống còn thiếu (Claude Code, 20/11/2026, 18:55)

Đã tải thêm `tu-khoa/keyword-planner-6.csv`: 92 cụm cho các họ từ khóa ở mục 2.2 (Việt Nam, 11/2025–10/2026).

| Họ từ khóa | KP |
|:--|:--|
| **"19xx mệnh gì"**, 41 năm sinh từ 1970 đến 2010 | **28 năm ở mức 10K–100K, 13 năm ở mức 1K–10K**. Gộp lại đây là một trong những họ lớn nhất sau lịch âm |
| lập lá số tử vi | **10K–100K**. "lập lá số" 1K–10K; "lập lá số tử vi online/miễn phí" 100–1K |
| luận giải lá số tử vi | 1K–10K |
| tết 2027 · năm 2027 là năm con gì | **10K–100K** · **10K–100K** |
| tết 2027 vào ngày nào | 1K–10K |
| đổi ngày dương sang âm · đổi ngày âm sang dương · đổi lịch dương sang âm | 1K–10K mỗi cụm |
| sao + 14 chính tinh (ví dụ "sao thiên cơ") | 100–1K mỗi sao. "sao thái dương", "sao thái âm" 1K–10K (lẫn nghĩa thiên văn). "sao X cung mệnh" 10–100 |
| giờ tý · tháng nhuận | 1K–10K · 100–1K |
| tử vi không cần/không biết giờ sinh | 10–100 |

**Hệ quả cho bảng 5.1 (đề xuất, chưa chấm lại):**
- **#5 Mệnh theo năm sinh + 60 hoa giáp**: N lên 5. Đây là họ có nhu cầu lớn nhất trong các công cụ rẻ (20 h), tất định, hợp thương hiệu. Nên cân nhắc **đưa lên ngay sau gói Tết**, thậm chí làm 41 trang "sinh năm X mệnh gì" thay một phần từ điển sao. Lý do: từ điển sao chỉ 100–1K mỗi sao. Cần tra độ khó trên Google VN trước, vì họ này nhiều khả năng bị lichngaytot/báo lớn chiếm `[CHƯA KIỂM]`.
- **#2 Gói trang Tết 2027**: "tết 2027" và "năm 2027 là năm con gì" đều 10K–100K, cao hơn mức 1K–10K đã ghi. Vẫn giữ nhận định: lên muộn nên lượt vào Tết 2027 thấp.
- **#3 Từ điển 14 chính tinh**: nhu cầu mỗi sao thấp (100–1K). Giá trị chính là phễu từ lá số, không phải SEO.

### 2.4. Độ khó

- Công cụ WebSearch ghi rõ là tra từ Mỹ, **không phải Google.com.vn**. Kết quả khác Google Việt Nam: không thấy lichngaytot, lichvansu, tuvi.vn, xemtuong. Thấy nhiều bài vệ tinh của chuỗi bán lẻ.
- Vì vậy **D chỉ là chỉ báo tương đối giữa các cụm**, không phải độ khó tuyệt đối. Trước khi viết 10 trang đầu, cần tra lại trên Google VN (cửa sổ ẩn danh, `gl=vn`) `[CHƯA KIỂM]`.
- 17 cụm có chấm điểm nhưng chưa tra; D ghi `[SUY LUẬN]` theo cụm gần nhất. Các cụm bị loại (B = 0) không tra.

### 2.5. Lọc nhiễu

Lọc bằng mẫu nên số đếm là `[ƯỚC LƯỢNG]`: khoảng **287** cụm nhiễu, **131** cụm cờ bạc/lễ giải hạn, **181** cụm thương hiệu.

---

## 3. Làm sạch và gom cụm

### 3.1. Cụm nhiễu bỏ hẳn (~287)

| Loại | Ví dụ (có KP) |
|:--|:--|
| Game | "cung mệnh raiden/furina/…" (~60 cụm Genshin), "chiêm tinh tft" 1K–10K, "chiêm tinh cự xà tft" |
| Địa danh, quán, công ty | "ngũ hành sơn" 10K–100K, "ốc hoàng hậu" 1K–10K, "cao ốc hoàng anh gia lai", "phong thuỷ quán đà lạt" |
| Khác nghĩa | "quế" 1K–10K, "sao hạng a" 1K–10K, "tam giác abc cân tại a", "tứ trụ triều đình", "tứ trụ suy tim", "quẻ bói lyrics", "năm 17 tuổi em đi lấy chồng", "tạm xuất tái nhập" |
| Y tế (không phải huyền học) | "nốt ruồi ung thư da", "nốt ruồi ung thư hắc tố da" (100–1K) |

### 3.2. Loại hẳn theo định vị (~131 cụm mang dấu hiệu)

| Nhóm | Bằng chứng KP | Căn cứ loại |
|:--|:--|:--|
| Giải mộng ra số | 11 cụm "nằm mơ thấy … đánh số gì / đánh đề con gì" ở **1K–10K**; "giải mộng lô đề" 100–1K | 07 mục 4.4 (O2), R-d, R-h |
| Bói bài ra số | "bói bài trúng số" 1K–10K; "bói bài trúng số hôm nay" 100–1K | R-d |
| Lễ giải hạn | "cúng sao giải hạn 2026" 100–1K; "sao giải hạn 2026" 100–1K | 04 mục 3.4 |
| Sim, biển số | "sim phong thuỷ" 10K–100K (Competition Medium); "biển số đẹp" 1K–10K (High) | 07 G6 |
| Cầu siêu thai nhi, sám hối thai nhi | "văn khấn cầu siêu cho thai nhi tại nhà", "văn khấn sám hối thai nhi tại nhà" (100–1K) | 07 P5; người dùng dễ tổn thương |
| Hứa hẹn | "bói tình yêu chính xác 100" 1K–10K; "sim phong thủy cải vận" 100–1K | 07 mục 3.5 |

### 3.3. Thương hiệu đối thủ được tìm (để biết ai mạnh)

| Thương hiệu (cụm) | KP |
|:--|:--|
| tử vi chân cơ | **10K–100K** |
| tử vi cổ học | **10K–100K** |
| tử vi việt nam | **10K–100K** (có thể là thương hiệu hoặc cụm chung, `[CHƯA KIỂM]`) |
| lá số tử vi thầy cao anh | 1K–10K (thêm "tử vi cao anh", "tử vi thầy cao anh" 100–1K) |
| tử vi global | 1K–10K |
| tử vi lý số (diễn đàn) | 1K–10K |
| tử vi vn, lá số tử vi vn | 1K–10K mỗi cụm |
| tử vi hôm nay thiên tuệ | 1K–10K |
| tử vi hôm nay lichvannien / lịch vạn niên | 1K–10K |
| lịch vạn niên 365 | 1K–10K |
| bát tự quang minh | 1K–10K |
| kinh dịch hội | 1K–10K |
| phong thủy tam nguyên, phong thuỷ phùng gia, phong thủy tâm an | 1K–10K mỗi cụm |
| tử vi lê quang lăng, tử vi thái âm, kabala (tử vi/bát tự/kinh dịch), nguyên cát (bát tự/tứ trụ), tarotcuabin, tarotap, astrodienst, astromemo, xemtuong net, thần số học quỳnh hương, lịch vạn niên báo mới/eva/việt báo, phạm thu hiền, sơn chu, sơn khiêm, hà đăng, lương lâm, horos, học viện lý số | 100–1K mỗi cụm |
| lichngaytot, xemvanmenh, huyenbi, tinhmenhdo, ngoisao.net | Chỉ thấy trong autocomplete, KP trống |

Nhận xét: người tìm **gõ tên thầy và tên trường phái** (Chân Cơ, Cổ Học, Cao Anh, Lê Quang Lăng, Thiên Lương chưa thấy). Điều này ủng hộ trang `/phuong-phap` ghi rõ nguồn sách và phái `[SUY LUẬN]`.

### 3.4. Ý định

| Ý định | Ví dụ | Số cụm (trong 65) |
|:--|:--|--:|
| Dùng công cụ | lá số tử vi, bát tự online, gieo quẻ, đổi ngày, xem tuổi vợ chồng, ngày tốt | 28 |
| Tra cứu kiến thức | kim lâu là gì, ngũ hành tương sinh, cung mệnh trong tử vi, văn khấn mùng 1 | 34 |
| So sánh, chọn dịch vụ | tử vi nam phái vs bắc phái, tử vi ai | 2 |
| Thương hiệu | mục 3.3 | 1 |

---

## 4. Độ khó: kết quả tra ngày 20/11/2026

48 cụm. "Ông lớn" = số chỗ trong 5 kết quả đầu. "Yếu" = số chỗ của trang yếu. Đầy đủ trong CSV cột `top5_ten_mien`.

| Cụm tra | 5 tên miền đầu | Ông lớn | Yếu | D |
|:--|:--|:-:|:-:|:-:|
| lịch âm hôm nay | baohatinh.vn ×4, soundcloud.com | 4 | 1 | **5** |
| lá số tử vi | docs.google.com ×2, hoanghamobile.com ×2, luatminhkhue.vn | 3 | 2 | 3 |
| xem tuổi vợ chồng | apps.apple.com ×4, ngaydep.com | 1 | 0 | 2 |
| xem ngày cưới 2027 | xemlicham.com ×5 (sau đó chogia.vn) | 5 | 0 | 4 |
| thần số học | vietnamworks.com, slideshare.net, careerlink.vn, sapo.vn, momo.vn | 4 | 1 | 4 |
| số chủ đạo 7 | vietnamworks.com, shopee.vn, glints.com, viettelstore.vn, thegioididong.com | 5 | 0 | 4 |
| giờ hoàng đạo hôm nay | baohatinh.vn ×4, chogia.vn | 5 | 0 | 4 |
| tử vi 2027 đinh mùi | ngaydep.com ×4, vietbao.vn | 5 | 0 | 4 |
| lịch âm 2027 | xemlicham.com, ngaydep.com ×2, hko.gov.hk, apps.apple.com | 3 | 0 | 3 |
| đổi ngày dương sang âm | ngaydep.com, xemlicham.com ×2, docs.google.com, apps.apple.com | 3 | 1 | 3 |
| 1995 mệnh gì | vietnamworks.com, shopee.vn ×2, jobsgo.vn, hellobacsi.com | 5 | 0 | 4 |
| tuổi xông đất 2027 | thegioididong.com, dienmayxanh.com, tuoitre.vn, shopee.vn, znews.vn | 5 | 0 | 4 |
| kim lâu là gì | docs.google.com, ai-hay.vn, dienmayxanh.com ×3 | 3 | 2 | **2** |
| tam tai 2027 tuổi nào | chogia.vn, wiki.batdongsan.com.vn, thegioididong.com, health.tvbs.com.tw ×2 | 3 | 0 | 3 |
| bát tự lá số online | miniwebtool.com, masterseanchan.com, doc.asta.rwth-aachen.de, fptshop.com.vn, youmind.com | 1 | 4 | **1** |
| gieo quẻ kinh dịch | apps.apple.com, comicvine.gamespot.com, jenova.ai ×2, vjol.info.vn | 0 | 3 | **1** |
| xem ngày khai trương 2027 | xemlicham.com ×5 | 5 | 0 | 4 |
| xem tuổi làm nhà năm 2027 | chogia.vn ×5 | 5 | 0 | 4 |
| năm 1992 lấy vợ tuổi nào hợp | hellobacsi.com, shopee.vn ×3, ngaydep.com | 5 | 0 | 4 |
| văn khấn mùng 1 | fptshop.com.vn, thuvienphapluat.vn, znews.vn, vinpearl.com, vinwonders.com | 5 | 0 | 4 |
| văn khấn ông công ông táo | dienmayxanh.com, hoanghamobile.com ×2, thuvienphapluat.vn, danviet.vn | 5 | 0 | 4 |
| cung hoàng đạo theo ngày sinh | hoanghamobile.com ×2, thegioididong.com, shopee.vn ×2 | 5 | 0 | 4 |
| bản đồ sao cá nhân | fptshop.com.vn ×2, hackmd.io, vietnamworks.com, thegioididong.com | 4 | 1 | 4 |
| ngũ hành tương sinh tương khắc | wiki.batdongsan.com.vn ×2, storage-vnportal.vnpt.vn, hoanghamobile.com ×2 | 4 | 0 | 4 |
| sao Thiên Cơ tử vi | thegioididong.com ×2, muckrack.com, blockdit.com ×2 | 2 | 3 | **2** |
| cung phu thê trong tử vi | hackmd.io ×2, muckrack.com, muaban.net, hoyolab.com | 1 | 4 | **1** |
| cung mệnh trong tử vi | thegioididong.com, dienmayxanh.com, hackmd.io, jobsgo.vn, hoanghamobile.com | 4 | 1 | 4 |
| tử vi tuổi ất hợi 1995 năm 2027 nam mạng | ngaydep.com ×2, momo.vn ×2, shopee.vn (đều là bài 2025/2026) | 5 | 0 | 3 (−1: chưa có trang 2027 đúng ý) |
| màu hợp mệnh | thegioididong.com, dienmayxanh.com ×2, hoanghamobile.com, bachhoaxanh.com | 5 | 0 | 4 |
| hướng nhà hợp tuổi | wiki.batdongsan.com.vn ×5 | 5 | 0 | 4 |
| xem tuổi sinh con 2028 | vietnamworks.com, hellobacsi.com, ngaydep.com ×3 (không đúng ý) | 5 | 0 | 3 |
| tử vi nam phái | docs.google.com ×4, hackmd.io (sau đó luatminhkhue.vn) | 0 | 5 | **1** |
| lịch vạn niên | apps.apple.com ×2, thuvienphapluat.vn ×2, wordpress.org | 2 | 0 | 4 (+1 cụm 100K–1M) |
| năm 2027 là năm con gì | dienmayxanh.com, thegioididong.com, hellobacsi.com, hoanghamobile.com ×2 | 5 | 0 | 4 |
| tiết lập xuân 2027 ngày nào | ngaydep.com ×2, hko.gov.hk, wikipedia.com, wilsonvilleoregon.gov | 2 | 0 | 3 |
| giờ xuất hành mùng 1 tết 2027 | luatminhkhue.vn, znews.vn ×2, dienmayxanh.com, thuvienphapluat.vn | 5 | 0 | 4 |
| quẻ thuần càn | mytour.vn, ctext.org ×2, yellowbridge.com ×2 (tiếng Anh) | 1 | 0 | **2** |
| xem ngày động thổ 2027 | chogia.vn ×4, thegioididong.com | 5 | 0 | 4 |
| thiên hà thủy là gì | Không trang Việt nào nói về nạp âm | 0 | — | **1** |
| cách đọc lá số tử vi cơ bản | luatminhkhue.vn, fptshop.com.vn, docs.google.com, thegioididong.com, jobsgo.vn | 4 | 1 | 4 |
| sinh giờ tý 23h tính ngày nào tử vi | vnexpress.net, quantrimang.com ×4 (trang lịch, không trả lời) | 1 | — | **1** |
| văn khấn rằm tháng giêng | baomoi.com ×2, thuvienphapluat.vn, dienmayxanh.com, fptshop.com.vn | 5 | 0 | 4 |
| mâm cúng giao thừa | docs.google.com, dienmayxanh.com, fptshop.com.vn, shopee.vn ×2 | 4 | 1 | 4 |
| cung phi bát trạch | docs.google.com, wiki.batdongsan.com.vn ×3, baodautu.vn | 4 | 1 | 4 |
| lục thập hoa giáp 60 năm | Kết quả tiếng Anh, không có nguồn Việt | 0 | — | **1** |
| tính số chủ đạo online | dienmayxanh.com, miniwebtool.com, viettablet.com, thegioididong.com, hellobacsi.com | 4 | 0 | 3 (ý định công cụ: chỉ 1 công cụ trong top) |
| xem tử vi không cần giờ sinh | hoanghamobile.com ×2, fptshop.com.vn, hackmd.io, miniwebtool.com | 3 | 1 | 3 |
| sao hóa kỵ là gì | coda.io, thegioididong.com ×4 (không có định nghĩa đúng) | 4 | 1 | 3 (−1: không trả lời đúng ý) |

**Ba điều rút ra:**

1. **Mảng học thuật đang bỏ trống.** "tử vi nam phái", "sinh giờ Tý 23h", "thiên hà thủy là gì", "lục thập hoa giáp", "cung phu thê", "bát tự online", "gieo quẻ kinh dịch" đều có top yếu hoặc không ai trả lời đúng. Đây đúng là chỗ thương hiệu "có căn cứ" mạnh nhất.
2. **Bài vệ tinh của chuỗi bán lẻ** (Thế Giới Di Động, Điện Máy Xanh, FPT Shop, Hoàng Hà, Shopee, MoMo, Batdongsan) chiếm các cụm kiến thức phổ thông (mệnh, màu, cung hoàng đạo, văn khấn). Tên miền mạnh, nội dung mỏng. Khó vượt bằng bài viết; chỉ vượt được bằng **công cụ** hoặc **chiều sâu có nguồn** `[SUY LUẬN]`.
3. **Cụm "xem ngày", "xem tuổi làm nhà" bị xemlicham.com và chogia.vn phủ bằng trang sinh tự động theo tháng/năm sinh.** Muốn vào phải có công cụ tốt hơn và trang có dữ liệu riêng, không đua số trang.

---

## 5. Danh sách ưu tiên cuối cùng

Công sức lấy từ 07b, `[GIẢ ĐỊNH]`. Nhu cầu ghi theo khoảng KP của cụm chính. Điểm là điểm công cụ (mục 1.3).

### 5.0. Nền đã có trong 04 (không xếp hạng lại)

| Công cụ | Cụm chính + 5 cụm phụ | Nhu cầu | D | Điểm | Ghi chú |
|:--|:--|:--|:-:|:-:|:--|
| Lập lá số + Gói 2 (C1, C2, chế độ chưa rõ giờ, /tu-vi-2027) | **lá số tử vi** · tử vi · tử vi lá số · lá số tử vi online · tử vi ai · lá số tử vi ko biết giờ sinh | 100K–1M | 3 | **18,8** | Cao nhất bảng. Giữ nguyên R1 + bản Tết. "tử vi ai" 1K–10K cho thấy người tìm chủ động muốn luận giải bằng AI |

### 5.1. Bảng ưu tiên

| # | Công cụ / trang | Cụm chính · 5 cụm phụ | Ý định | Nhu cầu (KP) | D | Mùa vụ | Công sức | Điểm | Tầng |
|:-:|:--|:--|:--|:--|:-:|:--|:-:|:-:|:--|
| 1 | **Trang phương pháp: Nam phái, Bắc phái, giờ Tý, tháng nhuận** (R5) | **tử vi nam phái** · tử vi bắc phái · lá số tử vi nam phái · tử vi bắc phái khác gì nam phái · tử vi là gì · tử vi có đúng không | Tra cứu, so sánh | 1K–10K (bắc phái 1K–10K; là gì 1K–10K) | 1 | Quanh năm | 6 h | **10,8** | **Trước Tết** (đã có ở 04 T4) |
| 2 | **Gói trang Tết 2027**: lịch âm 2027 + Tết ngày nào + tuổi xông đất + giờ xuất hành (A3 năm, A6, F5, E5) | **lịch âm 2027** · Tết 2027 vào ngày nào · tuổi xông đất 2027 · giờ xuất hành mùng 1 tết 2027 · năm 2027 là năm con gì · 2027 mệnh gì | Tra cứu | 1K–10K đo trước năm (năm 2026: 10K–100K); xông đất 2026: 1K–10K | 3–4 | **Tết 06/02/2027** | 8 h | 3,7 (+A3) | **Làm trước Tết** (T7, có điều kiện, mục 7.2) |
| 3 | **Từ điển tử vi: 12 cung + 14 chính tinh** (C5, C4 đợt 1) | **cung mệnh trong tử vi** · cung phu thê · cung mệnh phi hóa · sao thiên cơ · tử vi phá quân · cung mệnh vô chính diệu | Tra cứu | 100–1K mỗi cụm; "sao X" chưa có hạt giống `[ƯỚC LƯỢNG]` | 1–2 | Quanh năm | 20 h | **8,4** | **Trước Tết** (khuôn + 12 cung + 5 chính tinh) → **P1** (9 chính tinh còn lại) |
| 4 | **Lịch âm: đổi ngày + lịch tháng/năm** (A1, A3) | **lịch âm dương** · lịch âm năm 2026 · lịch âm tháng này · lịch âm sang dương · đổi lịch âm qua dương · lịch âm tháng 10 | Dùng công cụ | 100K–1M (ý định lẫn lịch/đổi ngày); tháng này 10K–100K | 3 | Đầu năm, đầu tháng | 14 h | **8,0** | **P1** (2–3/2027) |
| 5 | **Mệnh theo năm sinh + 60 hoa giáp + ngũ hành** (B2, B1, B4, A7, G4 không CTA) | **sinh năm X mệnh gì** · ngũ hành tương sinh · mệnh kim là gì · tuổi dần hợp màu gì · ngũ hành can chi · thiên hà thủy là gì | Tra cứu | "2006 mệnh gì nữ" 1K–10K; "19xx mệnh gì" chưa có hạt giống; ngũ hành tương sinh 10K–100K | 1 (nạp âm) – 4 (mệnh gì) | Quanh năm | 20 h | **8,7** | **P1** (3/2027) |
| 6 | **Trang đích "Lá số tử vi trọn đời" + bài cách đọc lá số** (biến thể C1, không phán theo năm sinh) | **lá số tử vi trọn đời** · tử vi trọn đời miễn phí · lá số tử vi trọn đời miễn phí · tử vi lá số trọn đời · lá số tử vi là gì · lá số tử vi có thay đổi không | Dùng công cụ | 10K–100K | 4 `[SUY LUẬN]` | Quanh năm | 4 h | **5,4** | **P1** (3/2027) |
| 7 | **Xem tuổi vợ chồng + hợp hai lá số** (F1, C8) | **xem tuổi vợ chồng** · năm 1992 hợp với tuổi nào lấy vợ · năm 1990 lấy vợ tuổi nào hợp · xem tuổi lấy chồng · tuổi hợp · bói tình yêu theo ngày sinh của 2 người | Dùng công cụ | `[ƯỚC LƯỢNG]` 166 biến thể, KP trống; cụm thay thế 1K–10K | 2–4 | Cưới cuối năm (9/2027–1/2028) | 60 h | **9,1** | **P1** (Q2, mở cùng Gói 3) |
| 8 | **Lá số bát tự + 24 tiết khí nền** (D1, A4) | **bát tự** · bát tự online · bát tự là gì · bát tự tứ trụ · tứ trụ · lập bát tự online | Dùng công cụ | 10K–100K; 4 cụm 1K–10K | 1 | Quanh năm | 42 h | **11,1** | **P1** (6/2027) |
| 9 | **Kinh Dịch: 64 quẻ + gieo quẻ** (H1, H3) | **gieo quẻ kinh dịch** · kinh dịch · gieo quẻ kinh dịch online · kinh dịch là gì · quẻ kinh dịch · quẻ thuần càn | Dùng công cụ, tra cứu | 10K–100K (kinh dịch 10K–100K) | 1–2 | Quanh năm, tăng đầu năm `[SUY LUẬN]` | 43 h | **8,1** | **P2** (Q3, mảng đầu tiên) |
| 10 | **Xem ngày theo việc + chọn ngày trả phí** (E1, E6) | **ngày tốt** · xem ngày cưới 2027 · xem ngày khai trương · ngày tốt cắt tóc · ngày tốt hôm nay · xem ngày động thổ | Dùng công cụ | 10K–100K; nhóm "xem ngày" `[ƯỚC LƯỢNG]` 485 biến thể | 4 | Cưới cuối năm; khai trương, động thổ đầu năm | 80 h | **7,8** | **P2** (Q3, 7/2027). Lên P1 nếu 03 có tín hiệu P4 (≥ 8/20) |
| 11 | **Kim lâu, Tam tai, Hoang ốc + xem tuổi làm nhà** (B6, F2, bài "năm tuổi") | **kim lâu** · kim lâu là gì · tam tai · tam tai là gì · hoang ốc · xem tuổi làm nhà năm 2028 | Tra cứu, công cụ | 1K–10K mỗi cụm chính | 2–4 | Cưới + làm nhà (cuối năm, đầu năm) | 18 h | **5,8** | **P2** (Q3, lên trước 30/09/2027) |
| 12 | **Tử vi năm 2028 theo tuổi** (C9, ghi rõ "chỉ theo năm sinh") | **tử vi tuổi** · tử vi tuổi giáp dần nữ mạng năm 2026 · tử vi tuổi quý hợi nữ mạng 1983 năm 2026 · tử vi tuổi canh ngọ năm 2026 nữ mạng · tử vi tuổi bính ngọ 2026 · tử vi tuổi kỷ tỵ năm 2027 nữ mạng | Tra cứu | 1K–10K; 5 cụm theo tuổi 1K–10K; > 60 cụm 100–1K | 3 | **Tết 2028 (26/01/2028)** | 60 h | **5,6** | **P2** (Q3, lên trước 30/09/2027) |
| 13 | **Thần số học: số chủ đạo** (J1, J2–J4 sau) | **số chủ đạo** · thần số học · số chủ đạo 7 · thần số học online · thần số học miễn phí · tính số chủ đạo online | Dùng công cụ | 10K–100K; 6 số chủ đạo 1K–10K mỗi số | 3–4 | Quanh năm | 14 h (+24 h) | **5,3** | **P2** (Q3) |
| 14 | **Bản đồ sao cá nhân + tra cung hoàng đạo** (K3, K1, K2) | **bản đồ sao** · chiêm tinh lá số · bản đồ sao cá nhân · bản đồ sao cặp đôi · cung hoàng đạo · bản đồ sao không cần giờ sinh | Dùng công cụ | **100K–1M**; chiêm tinh lá số 10K–100K | 4 | Quanh năm | 73 h | **3,6** | **P2** (Q4, chỉ khi giấy phép ephemeris rõ) |
| 15 | **Phụ tinh + Tứ Hóa** (C4 đợt 2) | **sao hóa kỵ** · tử vi phi hóa · lá số tử vi phi hoá · cung mệnh phi hóa · sao hóa lộc · địa không địa kiếp | Tra cứu | `[ƯỚC LƯỢNG]`; phi hóa 100–1K | 3 | Quanh năm | 31 h | **3,0** | **P2** (Q4) |
| 16 | **Trang "hôm nay" + giờ hoàng đạo + ngày lễ âm lịch** (A2 một trang, E2, A5) | **lịch âm hôm nay** · giờ hoàng đạo hôm nay · lịch âm ngày mai · âm lịch hôm nay ngày bao nhiêu · cúng rằm tháng 7 vào ngày nào · giờ hoàng đạo ngày mai | Dùng công cụ | **1M–10M**; giờ hoàng đạo hôm nay 10K–100K | 5 | Hằng ngày; rằm tháng 7 (16/08/2027) | 12 h | **2,9** | **P2** (A5 trước 15/06/2027; trang "hôm nay" Q4). **Không index 5.844 trang ngày** |
| 17 | **Văn khấn + mâm cúng** (P1, P4) | **văn khấn mùng 1** · văn khấn ngày rằm · văn khấn thần tài · văn khấn rằm tháng 7 · văn khấn ông táo · văn khấn bao sái bàn thờ | Tra cứu | 10K–100K (4 cụm) | 4 | Mùng 1, rằm, rằm tháng 7, Tết | 34 h | **2,1** | **P2** (sau khi kiểm bản quyền và luật sư duyệt; rằm 7 trước 15/06, Tết trước 31/10/2027) |
| 18 | **Cung phi + hướng nhà** (G1, G2) | **hướng nhà hợp tuổi** · hướng nhà · hướng nhà tính như thế nào · tuổi dần hợp hướng nào · cung mệnh · cung mệnh là gì | Tra cứu, công cụ | 100–1K (cung mệnh 1K–10K, lẫn game) | 4 | Mùa làm nhà | 18 h | **1,3** | **P2** (Q4) |
| 19 | Mai hoa dịch số, lục hào (H4, H5) | **mai hoa dịch số** · quẻ mai hoa · kinh dịch mai hoa · gieo quẻ lục hào · gieo quẻ mai hoa · lục hào | Công cụ | 1K–10K | 2 `[SUY LUẬN]` | — | 75 h | 2,9 | **Sau** |
| 20 | Human Design (Q1) | **human design** · human design chart · human design là gì · … | Công cụ | 1K–10K | 2 `[SUY LUẬN]` | — | 80 h | 2,5 | **Sau** |
| 21 | Đặt tên con (N) | **đặt tên con** · đặt tên con gái 2026 · đặt tên con theo phong thủy · tên hay cho bé · … | Công cụ | 10K–100K | 4 `[SUY LUẬN]` | Theo năm | 95 h | 1,7 | **Sau** (R-f dữ liệu trẻ em) |
| 22 | Tarot (L) | **bói bài** · bói bài tình yêu · … | Công cụ | 10K–100K | 3 `[SUY LUẬN]` | — | 36 h | 1,6 | **Sau** |
| 23 | Xem tuổi sinh con (F3) | **xem tuổi sinh con** · … | Công cụ | `[ƯỚC LƯỢNG]` 69 biến thể | 3 | Cuối năm | 10 h | 1,2 | **Sau** (B = 0,4) |
| — | **Không làm** | tử vi hôm nay (10K–100K), tử vi trọn đời theo tuổi, bói tình yêu theo tên (100K–1M), nhân tướng/nốt ruồi (1K–10K), xin xăm (1K–10K), sao hạn (công cụ), sim/biển số/số hợp mệnh, giải mộng, lễ giải hạn | — | — | — | — | — | 0 | **Không làm** (giải mộng ra số: loại vĩnh viễn) |

### 5.2. Thứ tự triển khai (đã xét phụ thuộc)

| Thời gian | Việc | Giờ `[GIẢ ĐỊNH]` |
|:--|:--|--:|
| T4 (04) | #1 Trang phương pháp | 6 (đã tính trong 04) |
| T7 (01–07/01/2027) | #2 Gói trang Tết 2027 | 8 |
| T8 | Khuôn mục từ điển + `/nguon` + 3 cung | 6 |
| T9 | 9 cung còn lại | 6 |
| T10 | 5 chính tinh + rà từ cấm | 6 |
| **Tổng T7–T10** | **Bằng đúng 26 giờ ô SEO của 07 mục 6** | **26** |
| 2/2027 | #4 Lịch âm A1, A3 | 14 |
| 3/2027 | #5 Mệnh theo năm sinh + hoa giáp; #6 trang đích lá số trọn đời; 9 chính tinh còn lại | 33 |
| 4–5/2027 | #7 F1 rồi C8 (Gói 3) | 60 |
| 6/2027 | #8 Bát tự + tiết khí | 42 |
| **Tổng P1** | | **~149** (07 P1 ≈ 152) |
| Q3/2027 | #9 Kinh Dịch → #11 Kim lâu/làm nhà → #12 Tử vi 2028 theo tuổi → #10 Xem ngày → #13 Thần số | 215 |
| Q4/2027 | #14 Bản đồ sao (có điều kiện), #15 Phụ tinh, #16 trang "hôm nay", #17 Văn khấn Tết, #18 Hướng nhà, cập nhật gói Tết 2028 | — |

Quy tắc 07 vẫn giữ: **mỗi tháng tối đa 1 mảng mới**, cổng 3 câu, ngưỡng `Lá số tạo / lượt vào`.

---

## 6. Đối chiếu với bảng xếp hạng 07

| Hạng mục | 07 | 08 | Vì sao lệch |
|:--|:--|:--|:--|
| **Bát tự D1** | #24, P2, N = 2 | **P1**, thay thần số trong 5 việc P1 | KP "bát tự" 10K–100K, thêm 4 cụm 1K–10K. Top 5 không có trang chuyên ngành lớn (miniwebtool, masterseanchan, trang spam). Đã có `tiet-khi.mjs`. 07 chấm N theo số đối thủ (3/17), không theo lượt tìm |
| **Kinh Dịch H1 + H3** | #29, P2, điểm 6 | **Đầu P2** (Q3, mảng mới đầu tiên sau P1) | "gieo quẻ kinh dịch" 10K–100K, "kinh dịch" 10K–100K, ~45 tên quẻ 100–1K. Top: app, spam, sách tiếng Anh. Rủi ro bản quyền bản dịch vẫn phải kiểm (R-j) |
| **Bản đồ sao K3** | Sau | **P2 Q4, có điều kiện** | "bản đồ sao" 100K–1M, "chiêm tinh lá số" 10K–100K, đều lớn hơn nhiều so với cung hoàng đạo. Điều kiện: kiểm giấy phép ephemeris (07b K3) |
| **Lịch ngày A2 (5.844 trang)** | #8, P1 | **P2, chỉ 1 trang "hôm nay"**, trang ngày để `noindex` | Nhu cầu lớn nhất bảng (1M–10M) nhưng một báo chiếm 4/5 chỗ; người tìm là P3 chi 0–50.000đ/năm (03); rủi ro R-i. Đổi ngày A1 và lịch tháng/năm A3 vẫn ở P1 |
| **Thần số J1** | P1 (top 5) | P2 Q3 | Nhu cầu cao (10K–100K) nhưng top là bài vệ tinh mạnh (VietnamWorks, TGDĐ); B = 0,7. Vẫn rẻ (14 h), có thể chen vào nếu P1 còn giờ |
| **Phụ tinh C4 đợt 2** | #6, P1 | P2 Q4 | Không có số KP cho "sao X"; giá trị chủ yếu là phễu. Làm sau khi 14 chính tinh đo được `Lá số tạo / lượt vào` |
| **Gói trang Tết 2027** | Không có (07 chỉ có xông đất 2028) | **Trước Tết**, 8 giờ | Trang tĩnh rẻ, đúng mùa, đúng ngoại lệ của 04. Cắt 9 chính tinh khỏi T7–T10 để đủ giờ |
| **"Tử vi trọn đời"** | KHÔNG (C11) | Giữ KHÔNG với trang phán theo năm sinh; **thêm trang đích "Lá số trọn đời" của C1** | "tử vi trọn đời" và "lá số tử vi trọn đời" đều 10K–100K. Người tìm muốn một lá số dùng cả đời, C1 đáp đúng mà không phán |
| **Kim lâu, Tam tai** | B6 #26 (8,0), F2 #14 | Gộp, **đầu Q3** | Mỗi cụm "kim lâu", "kim lâu là gì", "tam tai", "tam tai là gì" đều 1K–10K. Top "kim lâu là gì" yếu (D2). Bài trung tính "các sách tính khác nhau" là thế mạnh |
| **60 hoa giáp – nạp âm B1** | P1 bản ngắn, P2 bản đầy đủ | Giữ P1, **nâng vai trò**: là cụm chính của #5 | "thiên hà thủy là gì", "lục thập hoa giáp" không có trang Việt nào trả lời (D1) |
| Giữ nguyên | 12 cung, 14 chính tinh trước Tết; F1 + C8 Q2; C9 trước 10/2027; văn khấn P2; các mục KHÔNG | Như 07 | Dữ liệu ủng hộ hoặc không đủ để đổi |

### 6.1. Đối chiếu 20 từ khóa của 04 mục 5.2

| # (04) | Từ khóa 04 | Có trong dữ liệu? | Số KP gần nhất |
|:-:|:--|:--|:--|
| 1–2 | lập lá số tử vi (miễn phí) | Không có hạt giống | "lá số tử vi" 100K–1M; "lá số tử vi miễn phí" 1K–10K; "lập lá số tử vi online" 100–1K |
| 3 | luận giải lá số tử vi | Không | "tử vi luận giải" 100–1K; "tử vi ai" 1K–10K |
| 4–5 | xem tử vi 2027 đinh mùi; lá số tử vi 2027 | Có trong gợi ý gốc | KP trống; "tử vi 2027" 100–1K; "lập lá số tử vi 2027" 100–1K |
| 6–7, 9–10 | xem vận hạn 2027; tử vi 2027 theo ngày sinh; công việc, tình duyên 2027 | Lỗ hổng "xem…" / không có | Chưa có số |
| 8 | xem tử vi không cần giờ sinh | Lỗ hổng "xem…" | "lá số tử vi ko biết giờ sinh" 100–1K |
| 11–13 | tử vi tuổi 1995/1998/2000 năm 2027 | Có dạng 2026 | Theo tuổi 2026: 100–1K đến 1K–10K mỗi cụm |
| 14 | cách đọc lá số tử vi cơ bản | Không | "lá số tử vi là gì" 100–1K |
| 15 | lập lá số tử vi nam phái chuẩn | Có dạng ngắn | "tử vi nam phái" 1K–10K; "lá số tử vi nam phái" 100–1K |
| 16–18 | tháng nhuận; giờ Tý 23h; thầy bói phán cao số | Không | Chưa có số; giờ Tý: top không trả lời (D1) |
| 19 | xem độ hợp hai lá số tử vi | Lỗ hổng "xem…" | Xem #7 mục 5.1 |
| 20 | đổi ngày dương sang âm lịch chuẩn | Không có hạt giống | "lịch âm dương" 100K–1M; "lịch âm sang dương", "đổi lịch âm qua dương" 100–1K |

Kết luận: thứ tự 04 hợp lý cho cụm lõi (lá số). Cần bổ sung hạt giống cho #1–3, #6–10, #16–18 và tải lại lô "xem…" trước khi chốt số.

---

## 7. Lịch nội dung mùa vụ

### 7.1. Quy tắc

- Trang mới cần **8–12 tuần** để được lập chỉ mục và ổn định thứ hạng `[GIẢ ĐỊNH]`; tên miền mới có thể lâu hơn.
- Trang theo năm dùng **URL cố định không gắn năm** (ví dụ `/xong-dat`, `/lich-am/tet`) và đổi nội dung mỗi năm, kèm trang lưu trữ theo năm. Lý do: giữ tuổi trang và liên kết qua các mùa `[SUY LUẬN]`. Điều này khác mẫu `/tu-vi-<yyyy>/…` ở 07 mục 2.5; anh quyết.
- Mốc ngày lấy từ dữ liệu của repo và kết quả tra: Tết Đinh Mùi **06/02/2027**, Tết Mậu Thân **26/01/2028** (`tai-san-xemtuvi/data/tuvi/tet-wikipedia-1984-2091.json`); 23 tháng Chạp = 30/01/2027; rằm tháng 7 âm = **16/08/2027**, rằm tháng 8 = **15/09/2027** (suy từ xemlicham.com: 17/08/2027 = 16/7 âm, 12/09/2027 = 12/8 âm); Lập Xuân **04/02/2027** (Viện Thiên văn Quốc gia Nhật Bản, eco.mtk.nao.ac.jp). Rằm tháng Giêng = **20/02/2027** (06/02 + 14 ngày). Ông Táo 2028: khoảng 18–19/01/2028 `[CHƯA KIỂM bằng engine]`.

### 7.2. Lịch

| Mùa | Đỉnh tìm `[SUY LUẬN]` | Cụm | Trang phải lên trước | Ghi chú |
|:--|:--|:--|:--|:--|
| **Tết 2027** | Giữa tháng 1 → mùng 10 Tết (≈ 15/01–15/02/2027) | lịch âm 2027, Tết 2027 ngày nào, tuổi xông đất 2027, giờ xuất hành, năm 2027 con gì | **07/01/2027** (T7) | Chỉ còn ~4 tuần trước Tết, ít hơn mức 8–12 tuần. **Kỳ vọng lượt vào Tết 2027 gần 0**; giá trị chính là URL có tuổi cho Tết 2028. Chỉ làm nếu R1 = ĐẠT và T6 xong đúng hạn. Kích hoạt nhánh lùi của 04 thì dời sang 10/2027 |
| Đầu năm 2027 (khai trương, động thổ, xuất hành) | Tháng Giêng âm (06/02–07/03/2027) | xem ngày khai trương, động thổ | Không kịp | E1 chưa có. Không làm vội |
| Rằm tháng Giêng 2027 | 20/02/2027 | văn khấn rằm tháng giêng | Không làm 2027 | Văn khấn chưa qua kiểm bản quyền |
| **Rằm tháng 7 / Vu Lan 2027** | Tháng 8/2027 (rằm 16/08) | cúng rằm tháng 7 vào ngày nào (1K–10K), văn khấn rằm tháng 7 (10K–100K) | **15/06/2027** | Trang ngày lễ (A5) rẻ, chắc chắn làm. Văn khấn chỉ làm nếu đã qua luật sư |
| **Cưới hỏi cuối năm 2027** | 9/2027–1/2028 | xem tuổi vợ chồng, 19xx lấy vợ tuổi nào hợp, kim lâu 2028, xem ngày cưới tháng X/2027–2028 | F1: **30/06/2027** (P1 đã kịp). Kim lâu + E1 cưới: **31/07/2027** | Mùa có tiền nhất cho Gói 3 và E6 |
| **Làm nhà, động thổ 2028** | 11/2027–3/2028 | xem tuổi làm nhà 2028, kim lâu, hoang ốc, tam tai 2028, ngày động thổ | **30/09/2027** | Gộp #11 |
| **Tử vi 2028 theo tuổi** | 12/2027–2/2028 | tử vi tuổi … năm 2028 (120 trang) | **30/09/2027** | Khớp 07 (trước 10/2027) |
| **Tết 2028** | 1/2028 (Tết 26/01/2028) | lịch âm 2028, Tết 2028, xông đất 2028, xuất hành 2028, văn khấn ông Táo, giao thừa, mâm cúng | **31/10/2027** | Cập nhật gói trang Tết (URL cố định). Văn khấn nếu đã qua kiểm |
| Khai trương, động thổ đầu năm 2028 | Tháng Giêng âm 2028 | xem ngày khai trương, động thổ | **30/11/2027** | Cần E1 xong ở Q3 |
| Lịch năm sau | Cả năm (KP: "lịch âm năm 2027" đã 1K–10K trước năm) | lịch âm 2028 | **30/09/2027** | Rẻ, sinh từ engine |

---

## 8. Việc cần anh Cường quyết

1. ~~Tải lại lô "xem…" và thêm hạt giống còn thiếu~~ **Đã làm 20/11 (mục 2.3, 2.3b). Lô "xem…" vẫn trống vì giới hạn của Keyword Planner. Hạt giống mới cho thấy "19xx mệnh gì" rất lớn.** Nguyên văn đề xuất cũ: tải lại lô "xem…" trên Keyword Planner (khoảng 50 cụm; bắt đầu từ các cụm 04, 32, 33, 34, 36, 39, 41 trong CSV + "xem tuổi", "xem ngày", "xem tử vi", "xem bói"). Thêm hạt giống còn thiếu: "lập lá số tử vi", "19xx mệnh gì", "sao Thiên Cơ" và 13 chính tinh khác, "đổi ngày dương sang âm", "Tết 2027".
2. Duyệt đổi 5 việc P1: **bát tự thay thần số** (mục 6).
3. Duyệt **gói trang Tết 2027** ở T7 và cắt 9 chính tinh khỏi T7–T10.
4. Chọn kiểu URL cho trang theo năm (cố định hay gắn năm, mục 7.1).
5. Tra lại độ khó 10 cụm đầu trên Google VN thật trước khi viết (mục 2.4).

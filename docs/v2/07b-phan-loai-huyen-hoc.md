# 07b — Cây phân loại huyền học cho xemboi.vn

> Ngày lập: **20/11/2026**. Dữ liệu đối thủ: [`07a-khao-sat-cong-cu.md`](07a-khao-sat-cong-cu.md) (ma trận mục 3, 17 trang/app Việt).
> Tài sản sẵn có: [`01-kiem-ke.md`](01-kiem-ke.md), [`05a-ban-giao-engine.md`](05a-ban-giao-engine.md), [`05b-lich-meeus-va-test-p0.md`](05b-lich-meeus-va-test-p0.md), [`tai-san-xemtuvi/`](tai-san-xemtuvi/).
> Định vị phải giữ: [`04-dinh-vi-kinh-doanh.md`](04-dinh-vi-kinh-doanh.md) mục 1 và 3.4 (không hù dọa, không bán lễ, không bán vật phẩm "trừ tà, đổi vận").

**Tổng:** **18 mảng, 87 công cụ con.**

---

## 0. Quy ước đọc bảng

| Cột | Nghĩa |
|:--|:--|
| **Phổ biến** | Số trang/app Việt có công cụ này trên 17 trang đọc được (07a mục 3). "+1" = thấy tên gần đúng. Không phải số đo nhu cầu |
| **Từ khóa** | Ví dụ cụm từ người dùng có thể gõ. **Search volume: tất cả `[CHƯA KIỂM]`** (Google Trends trả 429 ở 02; Keyword Planner chưa chạy, việc treo từ 02 và 04 tuần T1). "Đối thủ có trang" = thấy URL hoặc menu đối thủ dùng cụm này, là tín hiệu đối thủ đầu tư, không phải volume |
| **Tri thức** | **TĐ** = tất định, tính bằng công thức thiên văn hoặc số học, kiểm thử được. **BT** = bảng tra truyền thống: tất định khi đã chọn một sách, nhưng các sách khác nhau. **DG** = diễn giải: văn luận, phụ thuộc trường phái và người viết. **NN** = ngẫu nhiên rồi diễn giải (gieo, rút, xin). **ẢNH** = cần xử lý ảnh người dùng |
| **KT** | Khả năng kiếm tiền 1–5 `[GIẢ ĐỊNH]`: 5 = bán trực tiếp được, có giá đối thủ làm neo; 1 = chỉ kéo lượt xem |
| **Giờ** | Giờ công ước cho 1 người, gồm mã + biên tập + duyệt `[GIẢ ĐỊNH]` |
| **Rủi ro** | **P** pháp lý, **Đ** đạo đức (gây hại người dùng), **T** thương hiệu. Mức: Thấp / Vừa / Cao |
| **Tài sản** | Mã hoặc dữ liệu dùng lại được |
| **Kết luận** | **P1** = sau Tết 2027 (từ 19/02/2027, Quý 1–2). **P2** = trong năm 2027 (Quý 2–4). **Sau** = sau 2027. **KHÔNG** = không làm, có lý do. **(04)** = đã có trong kế hoạch 04 |

---

## 1. Khung rủi ro dùng chung

Áp cho mọi công cụ. Nguồn 02 đã có thì dẫn lại; nguồn mới tra ngày 20/11/2026.

| # | Quy định | Nội dung liên quan | Áp vào công cụ nào |
|:-:|:--|:--|:--|
| R-a | **NĐ 38/2021/NĐ-CP** (xử phạt văn hóa, quảng cáo), dẫn ở 02 | Theo bài [luatvietnam.vn (04/07/2022)](https://luatvietnam.vn/linh-vuc-khac/to-chuc-xem-boi-co-vi-pham-phap-luat-khong-883-90440-article.html): Điều 14 phạt tổ chức hoạt động mê tín dị đoan trong lễ hội 15–20 triệu đồng; Điều 20 phạt lợi dụng di sản để trục lợi hoặc hoạt động mê tín dị đoan 30–40 triệu đồng. Bài viết kết luận xem bói tự nó không bị cấm; vi phạm khi trục lợi, lợi dụng lòng tin, gây hại. **Chưa đọc văn bản gốc và bản hợp nhất sau NĐ 128/2022 `[CHƯA KIỂM]`** | Mọi công cụ có lời phán, nhất là sao hạn, giải hạn, xin xăm |
| R-b | **BLHS 2015 Điều 320** (hành nghề mê tín dị đoan) | Theo cùng bài luatvietnam: áp khi đã bị xử phạt hành chính hoặc đã bị kết án mà còn vi phạm. Khung 1: phạt tiền 10–100 triệu, cải tạo không giam giữ đến 3 năm, hoặc tù 6 tháng – 3 năm. Khung 2: tù 3–10 năm nếu làm chết người, thu lợi bất chính từ 200 triệu, hoặc gây ảnh hưởng xấu an ninh trật tự `[CHƯA KIỂM văn bản gốc]` | Như trên |
| R-c | **BLHS Điều 174** (lừa đảo), dẫn ở 02 | Hù dọa để thu tiền giải hạn | Sao hạn, giải hạn, tư vấn 1-1 |
| R-d | **BLHS Điều 321 (đánh bạc), 322 (tổ chức đánh bạc)** | WebSearch thấy nhiều bản án áp Điều 321 cho mua bán số lô, số đề, kể cả trên mạng (ví dụ [thuvienphapluat bản án 25/2021/HS-ST](https://thuvienphapluat.vn/banan/ban-an/ban-an-252021hsst-ngay-19042021-ve-toi-danh-bac-206732)). **Chưa đọc nguyên văn điều luật `[CHƯA KIỂM]`.** Việc gợi ý số để đánh có cấu thành hành vi nào hay không thì em không kết luận được; chỉ khẳng định đây là vùng gắn trực tiếp với cờ bạc | Giải mộng ra số, "con số may mắn hôm nay", sim số đẹp |
| R-e | **Luật Quảng cáo sửa đổi 75/2025/QH15**, dẫn ở 02 | Cấm quảng cáo mê tín dị đoan, thổi phồng | Mọi quảng cáo trả phí |
| R-f | **Luật 91/2025/QH15 + NĐ 356/2025/NĐ-CP** (dữ liệu cá nhân), dẫn ở 02 | Ngày giờ sinh, họ tên là dữ liệu cá nhân. Ảnh khuôn mặt, bàn tay **có thể** thuộc dữ liệu sinh trắc học nhạy cảm `[CHƯA KIỂM danh mục cụ thể trong NĐ 356]` | Tướng số qua ảnh, đặt tên con (dữ liệu trẻ em), nhắc giỗ (dữ liệu người đã mất, gia đình) |
| R-g | **Meta Ads**, dẫn ở 02 | *Personal Attributes*: cấm câu ám chỉ hoàn cảnh cá nhân. *Prohibited Commercial Practices*: cấm hứa kết quả phi thực tế | Mọi quảng cáo Meta |
| R-h | **Google Ads**, dẫn ở 02 + mới tra | *Unreliable claims*, *Misrepresentation* (02). Mới: [*Gambling and games*](https://support.google.com/adspolicy/answer/6018017?hl=en): với Việt Nam, loại cờ bạc trực tuyến được quảng cáo duy nhất là xổ số trực tuyến, "Operator must be an authorized agent of Vietlott"; nội dung quảng bá cờ bạc không có trong danh mục cho phép của Việt Nam | Trang giải mộng ra số, "số may mắn" sẽ khó chạy Google Ads và kéo cả tên miền vào vùng cờ bạc |
| R-i | **Google Search spam policies** — [*Scaled content abuse*](https://developers.google.com/search/docs/essentials/spam-policies) | Nguyên văn: "many pages are generated for the primary purpose of manipulating search rankings and not helping users", ví dụ "Using generative AI tools… to generate many pages without adding value for users" | Mọi nhóm trang sinh tự động: lịch ngày, theo tuổi, theo cặp |
| R-j | **Bản quyền** | Mã đổi lịch Hồ Ngọc Đức chỉ cho "personal, non-commercial use" (05a mục 4); v2 đã có `am-lich.ts` viết lại theo Meeus, khớp 108/108 Tết và 200/200 mốc (05b). Bản dịch Việt hiện đại của sách cổ (Kinh Dịch, sách xăm, văn khấn, tử vi) có thể còn bản quyền người dịch `[CHƯA KIỂM từng cuốn]` | Kinh Dịch, xin xăm, văn khấn, từ điển sao |

---

## 2. Cây phân loại (tóm tắt)

```
xemboi.vn
├── A. Lịch và thời gian (8)
├── B. Can chi – Ngũ hành – Con giáp (7)
├── C. Tử vi Đẩu số (11)
├── D. Bát tự / Tứ trụ (4)
├── E. Xem ngày giờ (6)
├── F. Xem tuổi (5)
├── G. Phong thủy (7)
├── H. Kinh Dịch (5)
├── I. Xin xăm (1)
├── J. Thần số học (4)
├── K. Chiêm tinh phương Tây (5)
├── L. Tarot (3)
├── M. Tướng số (4)
├── N. Đặt tên con (3)
├── O. Giải mộng (2)
├── P. Văn khấn và phong tục (5)
├── Q. Human Design (1)
└── R. Nền tảng và khác (6)
```

---

## 3. Chi tiết từng mảng

### A. Lịch và thời gian

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| A1 | Đổi ngày âm ↔ dương | 11 | "đổi ngày dương sang âm" (04 từ khóa #20) | TĐ | 1 | 6 | Thấp | `am-lich.ts` (clean-room, 05b) | **P1** |
| A2 | Trang lịch ngày: can chi ngày/giờ, tiết khí, giờ hoàng đạo, trực | 11 | "lịch âm hôm nay", "ngày 6/2/2027 là ngày gì" | TĐ + BT (giờ hoàng đạo, 12 trực theo bảng) | 2 | 16 | Thấp. Không gắn nhãn "ngày xấu, đại hung" | `am-lich.ts` (`canChiNgay`, `canChiGio`), `tiet-khi.mjs` | **P1** |
| A3 | Lịch tháng, lịch năm in được | 11 | "lịch âm 2027" (đối thủ có trang: XLA, LVN365) | TĐ | 1 | 8 | Thấp | `am-lich.ts` | **P1** |
| A4 | 24 tiết khí (từ điển + mốc theo năm) | 0 (+1) | "tiết lập xuân 2027 ngày nào" | TĐ (VSOP87D) + DG (phong tục) | 1 | 12 | Thấp | `tiet-khi.mjs` (MIT) | **P2** |
| A5 | Ngày lễ âm lịch, rằm, mùng 1 | 3 | "rằm tháng giêng 2027 ngày nào" | TĐ | 1 | 6 | Thấp | `am-lich.ts` | **P2** |
| A6 | Đếm ngược Tết, tính số ngày | 5 | "còn bao nhiêu ngày nữa đến Tết" | TĐ | 1 | 2 | Thấp | `am-lich.ts`, `tet-wikipedia-1984-2091.json` | **P1** (gộp A2) |
| A7 | Tuổi âm, ranh giới năm theo Tết và Lập Xuân | 1 ("Tính tuổi theo năm sinh" LNT) | "sinh tháng 1 năm 1995 tuổi gì" | TĐ | 2 | 4 | Thấp | `am-lich.ts`, `tiet-khi.mjs` | **P1** (gộp B2) |
| A8 | Nhắc giỗ, ngày kỷ niệm âm lịch | 2 | "nhắc ngày giỗ âm lịch" | TĐ | 2 | 30 | Vừa (P): cần tài khoản, email/Zalo, dữ liệu gia đình | `am-lich.ts` | **Sau**: cần tài khoản, ngoài phạm vi web 1 người |

### B. Can chi – Ngũ hành – Con giáp

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| B1 | Từ điển 60 hoa giáp (can chi + nạp âm) | ~1 ("Mệnh" TVVN) | "Giáp Tý là gì", "Hải Trung Kim là gì" | BT + DG | 2 | 20 | Thấp | `nap-am.mjs`, `nap-am.json` | **P1** bản ngắn (2–3 câu mỗi mục, làm cùng B2); bản đầy đủ P2 |
| B2 | "Sinh năm X mệnh gì" (1930–2030) | 3 ("Xem cung mệnh theo tuổi" PTS…) | "1995 mệnh gì" (WebSearch thấy wiki.batdongsan.com.vn làm "2005 Mệnh Gì", "Sinh Năm 1968 Mệnh Gì") | TĐ + BT | 2 | 10 | Thấp. Màu hợp mệnh không được dẫn tới bán vật phẩm | B1 + A7 | **P1** |
| B3 | Từ điển 12 con giáp | 12 (dạng tử vi con giáp) | "tuổi Mùi", "con giáp thứ 8" | DG (văn hóa) | 1 | 6 | Thấp | — | **P2** |
| B4 | Ngũ hành sinh khắc | ~ | "ngũ hành tương sinh tương khắc" | BT | 1 | 3 | Thấp | — | **P1** (gộp B1) |
| B5 | Tam hợp, lục hợp, tứ hành xung | ~ (trong xem tuổi) | "tứ hành xung là gì" | BT | 1 | 4 | Vừa (Đ): dễ thành "tuổi xung không được cưới" | — | **P2** (gộp F1) |
| B6 | Tam tai, Kim lâu, Hoang ốc | 1 ("Tra cứu hạn Tam Tai" TT) + trong xem tuổi | "tuổi kim lâu 2027" | BT (các sách tính Kim lâu khác nhau) | 2 | 6 | Vừa (Đ, T): chữ "hạn" dễ hù | — | **P2** (chỉ trong F1, F2, trình bày như "truyền thống tính thế này") |
| B7 | Sao chiếu mệnh Cửu Diệu / "xem sao hạn" | 6 | "sao hạn 2027 tuổi…" (LNT có trang từng tuổi, slug "cach-dang-sao-giai-han") | BT + DG | 1 | 6 | **Cao** (P R-a, R-c; T): đối thủ dẫn thẳng tới dâng sao giải hạn | — | **KHÔNG** làm công cụ. Chỉ 1 mục bách khoa "Cửu Diệu là gì" (P2), không có văn khấn giải hạn, không CTA |

### C. Tử vi Đẩu số

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| C1 | Lập lá số | 12 (+1) | "lập lá số tử vi" (04 #1) | TĐ + BT (an sao theo phái) | 3 | — | Thấp | `tuvi-v2` (Apache-2.0), 0/53 lá lệch (05a) | **(04)** R1, Tết |
| C2 | Luận giải sâu có căn cứ | — | "luận giải lá số tử vi" (04 #3) | DG | 5 | — | Vừa (Đ): lọc từ cấm | Kho `luan-giai/`, `tu-cam.json`, `quy-tac-van/` | **(04)** Gói 2 149k |
| C3 | Vận năm Lưu niên 2027 | — | "xem vận hạn năm 2027" (04 #6) | BT + DG | 4 | — | Vừa | `luuNien()`, `van-nam-2027.json` | **(04)** Gói 1 79k, sau Tết |
| C4 | Từ điển 114 sao (14 chính tinh + phụ tinh) | 5 (thư viện sao) | "sao Thiên Cơ", "sao Hóa Kỵ là gì" | DG + BT (miếu/hãm) | 3 | 45 | Thấp nếu ghi phái | `menh-chinh-tinh.json`, `luan-giai/*.md`, spec an sao. Con số **114** là quy ước phổ biến; số sao engine đang an cần đếm lại `[CHƯA KIỂM]` (05a ghi 14 chính tinh + 97 trường `sao` đối chiếu) | **P1** (14 chính tinh trước) |
| C5 | Từ điển 12 cung chức năng | 1 (TCTV "Cung Chức") | "cung Phu Thê là gì" | DG | 3 | 6 | Thấp | `luan-giai/cung-01-03.md` … `cung-10-12.md` | **P1** |
| C6 | "Sao X tại cung Y" (14 × 12 = 168 mục) | ~ | "Tử Vi cư Mệnh" | DG | 3 | 40 | Vừa (R-i nếu sinh hàng loạt) | `menh-chinh-tinh.json` (mới phủ cung Mệnh) | **P2** |
| C7 | Cách cục | ~ | "cách cục Sát Phá Tham" | DG | 3 | 20 | Thấp | `cms-data.ts` có 1 bài so sánh cách cục (mã cũ, chưa rõ nguồn gốc → viết lại) | **P2** |
| C8 | Hợp hai lá số | 1 (CTV) | "xem độ hợp hai lá số tử vi" (04 #19) | DG | 4 | 30 | Vừa (Đ): không phán chia tay (03 `#75, #86`) | `tuvi-v2` | **(04)** Gói 3, Quý 2/2027 → **P1** |
| C9 | Tử vi năm theo tuổi (60 hoa giáp × nam/nữ = 120 trang/năm) | đối thủ làm sẵn (02, LNT) | "tử vi tuổi 1995 năm 2027" (04 #11–13) | DG (chỉ theo năm sinh) | 4 | 60 | Vừa (R-i; T: phải nói rõ "chỉ theo năm sinh, không phải lá số") | `van-nam-2027.json` | **P2** (lên trang trước 10/2027 cho Tết 2028) |
| C10 | Tử vi 12 con giáp hằng ngày | 12 | "tử vi hôm nay tuổi Mão" | DG, không có căn cứ cá nhân | 2 | 1–2/ngày | **Cao (T)**: văn chung chung "như AI" (03 `#14–#22`); R-i | — | **KHÔNG** |
| C11 | Tử vi trọn đời theo năm sinh | 9 | "tử vi trọn đời tuổi Tý" | DG | 3 | 40 | **Cao (T, Đ)**: phán trọn đời theo năm sinh, trái "minh bạch căn cứ" | — | **KHÔNG** (thay bằng lá số cá nhân C1–C2) |

### D. Bát tự / Tứ trụ

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| D1 | Lá số bát tự (trụ năm theo Lập Xuân, trụ tháng theo tiết) | 3 | "lập lá số bát tự", "tứ trụ" | TĐ | 3 | 30 | Thấp | `tiet-khi.mjs`, `am-lich.ts`. **Không dùng** `tutru-boidich.ts` cũ (tính tháng theo âm lịch, sai, 01 mục 3.2) | **P2** |
| D2 | Từ điển thập thần, thần sát | ~ | "thiên ất quý nhân là gì" | BT + DG | 2 | 15 | Thấp | — | **P2** |
| D3 | Luận dụng thần, vượng suy | ~ | "cách tìm dụng thần" | DG, tranh cãi giữa các phái | 4 | 40 | Vừa (T): khó kiểm đúng sai | `cms-data.ts` có 1 bài (viết lại) | **Sau** |
| D4 | Cân xương tính số | 3 | "cân xương tính số" | BT | 1 | 3 | Vừa (Đ): bảng phán số phận theo "lượng chỉ" | — | **KHÔNG** công cụ. Có thể là 1 mục bách khoa văn hóa (Sau) |

### E. Xem ngày giờ

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| E1 | Ngày tốt theo việc (cưới hỏi, động thổ, khai trương, nhập trạch, xuất hành, ký hợp đồng, mua xe) | 10 (+1) | "xem ngày cưới tháng 3 năm 2027", "ngày tốt khai trương" | BT, **nhiều hệ** (hoàng đạo/hắc đạo, 12 trực, 28 sao, sao tốt xấu theo sách chọn ngày; nguồn và bản dịch `[CHƯA KIỂM]`) + TĐ (lịch) | 4 | 60 | Vừa (Đ): không gắn "ngày đại hung"; ghi rõ hệ nào nói gì | `am-lich.ts`, `tiet-khi.mjs` | **P1** nếu 03 cho tín hiệu P4 (≥ 8/20); nếu không thì **P2** |
| E2 | Giờ hoàng đạo | ~ (trong lịch) | "giờ hoàng đạo hôm nay" | BT | 1 | — | Thấp | A2 | **P1** (gộp A2) |
| E3 | Xem ngày an táng, tính trùng tang | 2 (trùng tang) / 3 (an táng) | "tính trùng tang" | BT | 2 | 20 | **Cao (Đ)**: người đang tang dễ tổn thương; "trùng tang liên táng" là nỗi sợ điển hình | — | **KHÔNG** |
| E4 | Chọn giờ sinh mổ | 1 (XT) | "chọn giờ sinh mổ" | BT | 2 | 10 | **Cao (Đ, P)**: can thiệp quyết định y khoa (04 mục 3.4 mục 3) | — | **KHÔNG** |
| E5 | Xuất hành đầu năm (giờ, hướng) | ~ | "giờ xuất hành mùng 1 Tết 2028" | BT | 1 | 6 | Thấp | A2 | **P2** (cho Tết 2028) |
| E6 | Chọn ngày cá nhân trả phí (hợp tuổi người làm việc) | 1 (LV bán 25k–280k) | "chọn ngày cưới hợp tuổi vợ chồng" | BT + DG | 5 | 20 (sau E1) | Vừa | E1, F1 | **P2** |

### F. Xem tuổi

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| F1 | Xem tuổi vợ chồng / kết hôn | 6 (+3) | "xem tuổi vợ chồng" (03 P4 nhắc từ khóa này) | BT (can chi, ngũ hành nạp âm, cung phi, Kim lâu) | 4 | 30 | Vừa (Đ): 03 `#75, #86` (bị phán phải chia tay). Bắt buộc mẫu câu "truyền thống tính thế này; không có nghiên cứu cho thấy…" | B1, B5, B6 | **P1** |
| F2 | Xem tuổi làm nhà | 6 | "tuổi làm nhà năm 2027" | BT (Kim lâu, Hoang ốc, Tam tai) | 3 | 12 | Vừa | B6 | **P2** |
| F3 | Xem tuổi sinh con | 5 | "sinh con năm 2028 hợp tuổi bố mẹ" | BT | 3 | 10 | Vừa (Đ): không gợi ý kế hoạch sinh theo "hợp tuổi" như lời khuyên | B1 | **P2** |
| F4 | Xem tuổi làm ăn, hợp tác | 3 | "xem tuổi hợp làm ăn" | BT | 3 | 8 | Thấp | F1 | **P2** |
| F5 | Xem tuổi xông đất, mở hàng | 6 | "tuổi xông đất 2028" | BT | 2 | 10 | Thấp | B1 | **P2** (lên trang trước 11/2027) |

### G. Phong thủy

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| G1 | Cung phi, Đông/Tây tứ mệnh (Bát trạch) | 6 (+1) | "cung mệnh 1990 nam", "đông tứ mệnh" | BT (công thức theo năm sinh + giới) | 2 | 8 | Vừa (T): thuật ngữ "Tuyệt Mệnh, Ngũ Quỷ, Họa Hại, Lục Sát" phải ghi là tên gọi truyền thống, không phán | B2 | **P2** |
| G2 | Hướng nhà, bếp, bàn thờ, giường, bàn làm việc | 6 | "hướng nhà hợp tuổi 1985" | BT | 2 | 10 | Vừa | G1 | **P2** |
| G3 | Thước Lỗ Ban | 6 | "thước lỗ ban 52.2" | BT (số đo các loại thước theo nguồn `[CHƯA KIỂM]`) | 1 | 12 | Thấp | — | **Sau** |
| G4 | Màu hợp mệnh | 5 | "1995 hợp màu gì" | BT | 1 | 3 | Vừa (T): không gắn link bán đồ | B2 | **P1** (gộp B2, không CTA mua) |
| G5 | Ý nghĩa con số, số hợp mệnh | 5 | "ý nghĩa số 8" | DG | 1 | 6 | Vừa (P R-d): gần "số may mắn" | — | **P2** (chỉ trong thần số J, không "số hôm nay") |
| G6 | Sim, biển số, số điện thoại phong thủy | 4 | "sim hợp tuổi" | DG | 2 | 12 | **Cao (T, P R-d)**: thường gắn bán sim "số đẹp" giá cao | — | **KHÔNG** |
| G7 | Vật phẩm phong thủy (đá, tượng, bùa) | 1 (LNT có mục) | "vật phẩm phong thủy hợp mệnh" | — | 5 | — | **Cao**: 04 mục 3.4 cấm; Linghit bán linh phù (07a 2.12) | — | **KHÔNG** |

### H. Kinh Dịch

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| H1 | Từ điển 64 quẻ + 8 quái | 6 (+2) (gieo quẻ) | "quẻ Thuần Càn", "64 quẻ kinh dịch" | DG trên văn bản cổ (nguyên bản công cộng; bản dịch Việt có thể còn bản quyền `[CHƯA KIỂM]`) | 2 | 35 | Thấp | — | **P2** |
| H2 | 384 hào | ~ | "hào cửu ngũ quẻ Càn" | DG | 1 | 60 | Thấp | H1 | **Sau** |
| H3 | Gieo quẻ (3 đồng xu, quẻ chủ + quẻ biến) | 6 (+2) | "gieo quẻ kinh dịch online" | NN + DG | 2 | 8 (sau H1) | Vừa (T): phải ghi "kết quả là ngẫu nhiên; dùng để suy ngẫm" | H1 | **P2** |
| H4 | Lục hào nạp giáp | 1 (LV) | "lục hào" | BT + DG | 3 | 50 | Vừa | H1 | **Sau** |
| H5 | Mai hoa dịch số | 2 | "mai hoa dịch số" | BT + DG | 1 | 25 | Vừa | H1 | **Sau** |

### I. Xin xăm

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| I1 | Xin xăm (Quan Âm, Quan Thánh, Tả Quân…) | 6 | "xin xăm Quan Âm online" | NN + văn bản xăm (bản dịch Việt `[CHƯA KIỂM bản quyền]`) | 1 | 30 | Vừa (T): gắn đền thờ cụ thể, nghi thức; TVVN có 16 loại, loãng | — | **KHÔNG** trong 2027 |

### J. Thần số học

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| J1 | Số chủ đạo (Life Path) | 7 | "thần số học", "số chủ đạo 7" | TĐ (cộng chữ số) + DG | 3 | 14 | Vừa (T): không có cơ sở khoa học; tên gọi "Pitago" là cách gọi hiện đại. Phải ghi rõ | — | **P1** |
| J2 | Chỉ số tên (Expression, Soul Urge) | ~ (XT "Thần số học Bói tên") | "thần số học theo tên" | TĐ (bảng chữ cái → số; tiếng Việt có dấu phải quy ước) + DG | 2 | 10 | Vừa | J1 | **P2** |
| J3 | Năm/tháng cá nhân | ~ | "năm cá nhân 2027" | TĐ + DG | 3 (báo cáo năm, như numerology.com) | 6 | Vừa | J1 | **P2** |
| J4 | Biểu đồ ngày sinh (lưới 3×3) | ~ | "biểu đồ ngày sinh thần số học" | TĐ + DG | 2 | 8 | Vừa | J1 | **P2** |

### K. Chiêm tinh phương Tây

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| K1 | Tra cung theo ngày sinh | 6 | "sinh ngày 15/8 cung gì" (LV có công cụ) | TĐ (theo kinh độ Mặt Trời, có thể tính chính xác ngày chuyển cung) | 1 | 3 | Thấp | `tiet-khi.mjs` (kinh độ Mặt Trời) | **P2** |
| K2 | Từ điển 12 cung, hành tinh, nhà | 6 | "cung Bạch Dương" | DG | 1 | 20 | Thấp | — | **P2** |
| K3 | Bản đồ sao cá nhân (natal chart) | 0 | "bản đồ sao", "natal chart" | TĐ (cần vị trí Mặt Trăng, hành tinh, cung mọc; thư viện `astronomia` MIT đã dùng trong `tiet-khi.mjs` — đủ hành tinh hay không `[CHƯA KIỂM]`; Swiss Ephemeris có điều khoản cấp phép riêng `[CHƯA KIỂM]`) | 3 | 50 | Vừa | `tiet-khi.mjs` | **Sau** |
| K4 | Hợp cung (78 cặp) | ~ | "Bạch Dương hợp với cung nào" | DG | 2 | 20 | Vừa (Đ) | K2 | **Sau** |
| K5 | Horoscope ngày/tuần | 6 | "tử vi 12 cung hoàng đạo hôm nay" | DG | 1 | 1–2/ngày | **Cao (T)**: như C10 | — | **KHÔNG** |

Khoa học nói gì (dùng cho mục "khoa học nói gì"): nghiên cứu mù đôi của **Carlson (1985), *Nature* 318: 419–425** cho thấy 28 nhà chiêm tinh không ghép được bản đồ sao với hồ sơ tính cách tốt hơn ngẫu nhiên ([NASA ADS](https://ui.adsabs.harvard.edu/abs/1985Natur.318..419C/abstract)). Có bài phân tích lại phản biện thiết kế nghiên cứu. **Chưa đọc toàn văn `[CHƯA KIỂM]`.**

### L. Tarot

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| L1 | Từ điển 78 lá | 4 | "ý nghĩa lá The Tower" | DG (hình bộ Rider–Waite–Smith 1909: tình trạng bản quyền và nhãn hiệu tại Việt Nam `[CHƯA KIỂM]`) | 2 | 30 | Vừa (T) | — | **Sau** |
| L2 | Rút bài 1 hoặc 3 lá | 4 | "bói bài tarot online" | NN + DG | 2 | 6 | Vừa (T) | L1 | **Sau** |
| L3 | Trải bài theo câu hỏi + AI | 0 | "tarot tình yêu" | NN + DG | 3 | 20 | Vừa (Đ): người lo âu hỏi lặp | L1, pipeline AI của Gói 2 | **KHÔNG** trong 2027 |

### M. Tướng số

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| M1 | Từ điển nhân tướng (văn hóa) | 6 | "tướng mặt chữ điền" | DG | 1 | 15 | Vừa (Đ, T): phán tính cách theo ngoại hình là định kiến | — | **Sau** |
| M2 | Đọc ảnh khuôn mặt, bàn tay | 1 (XBTS), Nebula (quốc tế) | "xem chỉ tay online" | ẢNH + DG | 3 | 60 | **Cao (P R-f, Đ)**: dữ liệu sinh trắc; định kiến | — | **KHÔNG** |
| M3 | Bói nốt ruồi | ~ (TVVN, XT, PTS) | "nốt ruồi ở cằm" | DG | 1 | 10 | Vừa (Đ): "nốt ruồi sát phu" | — | **KHÔNG** |
| M4 | Xem chữ ký | 1 (XT) | "xem chữ ký" | DG | 1 | 10 | Vừa | — | **KHÔNG** |

### N. Đặt tên con

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| N1 | Từ điển nghĩa tên Hán Việt | ~ | "tên An Nhiên nghĩa là gì" | DG trên từ điển Hán Việt (nguồn và bản quyền `[CHƯA KIỂM]`) | 3 | 80 | Thấp | — | **Sau** (khối lượng lớn) |
| N2 | Ngũ hành tên, hợp mệnh bố mẹ | 3 | "đặt tên con theo ngũ hành" | BT + DG (quy ước hành của từng chữ khác nhau) | 3 | 15 (sau N1) | Vừa (P R-f: dữ liệu trẻ em) | B2 | **Sau** |
| N3 | Thần số theo tên | ~ | "thần số học tên con" | TĐ + DG | 2 | — | Vừa | J2 | **Sau** (gộp J2) |

### O. Giải mộng

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| O1 | Ý nghĩa giấc mơ (dân gian + tâm lý học) | 4 | "mơ thấy rắn" | DG, ít nguồn chuẩn | 1 | 40 | **Cao (T)**: WebSearch "giải mã giấc mơ con số…" trả về chủ yếu trang nhà cái, sổ mơ lô đề (RR88, VSBET, 98win…). Đứng chung vùng từ khóa với cờ bạc | — | **KHÔNG** trong 2027 |
| O2 | Giấc mơ ra con số ("số may mắn", sổ mơ) | 3 (LNT, LV, XBTS có số) | "mơ thấy chó đánh con gì" | Không có cơ sở | 2 (kéo lượt xem) | 10 | **Cao (P R-d, R-h; T)**: cặp số hai chữ số gắn trực tiếp với lô đề | — | **KHÔNG, LOẠI VĨNH VIỄN** |

### P. Văn khấn và phong tục

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| P1 | Văn khấn thường dùng (rằm, mùng 1, gia tiên, ông Công ông Táo, giao thừa, Thổ công) | 5 (+1) | "văn khấn rằm tháng giêng", "văn khấn ông công ông táo" | Văn bản truyền thống. Nguồn công cộng ví dụ *Việt Nam phong tục* (Phan Kế Bính, 1915) `[CHƯA KIỂM có văn khấn hay không]`; sách văn khấn hiện đại có thể còn bản quyền | 1 | 20 | Thấp | — | **P2** |
| P2 | Văn khấn tự điền tên, địa chỉ, ngày | 1 (XT) | "văn khấn có điền tên" | TĐ (ghép chuỗi) | 1 | 6 | Thấp. Không lưu tên, địa chỉ ở máy chủ (R-f) | A1 | **P2** |
| P3 | Phong tục đời người (cưới hỏi, sinh, Tết, tang) | 3 | "lễ ăn hỏi gồm những gì" | DG (văn hóa, dân tộc học) | 1 | 25 | Thấp | — | **P2** |
| P4 | Mâm cúng theo dịp | ~ | "mâm cúng giao thừa" | DG | 1 | 8 | Thấp | — | **P2** |
| P5 | Văn khấn dâng sao giải hạn, cắt duyên âm, cầu siêu, trừ tà | ~ (LNT dẫn từ sao hạn) | "văn khấn dâng sao giải hạn" | — | 1 | — | **Cao (P R-a, R-c; T)**: trái 04 mục 3.4 | — | **KHÔNG** |

### Q. Human Design

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| Q1 | BodyGraph | 0 | "human design là gì" | TĐ (vị trí thiên thể lúc sinh và khoảng 88° Mặt Trời trước sinh theo tài liệu hệ này `[CHƯA KIỂM]`) + DG | 3 (myBodyGraph bán $49–$129, 07a 2.13) | 80 | Vừa (P: quyền tên gọi, thuật ngữ `[CHƯA KIỂM]`; T: hệ thống mới, không có truyền thống Việt) | `tiet-khi.mjs` một phần | **KHÔNG** trong 2027 (0/17 trang Việt có; nhu cầu `[CHƯA KIỂM]`) |

### R. Nền tảng và khác

| # | Công cụ | Phổ biến | Từ khóa ví dụ | Tri thức | KT | Giờ | Rủi ro | Tài sản | Kết luận |
|:-:|:--|:-:|:--|:-:|:-:|:-:|:--|:--|:-:|
| R1 | Nhịp sinh học | 1 (LS) | "nhịp sinh học" | TĐ (hàm sin), thuyết đã bị bác bỏ `[CHƯA KIỂM nguồn tổng quan]` | 1 | 4 | Vừa (T) | — | **KHÔNG** |
| R2 | Bói vui (hắt xì, nháy mắt, bói Ai Cập, bói Kiều, vỏ ốc…) | 6 | "bói hắt xì" | Không | 1 | 2–5 mỗi cái | Vừa (T): làm loãng "bách khoa" | — | **KHÔNG** |
| R3 | Hỏi đáp AI bám dữ liệu đã tính | 2 (CTV, TSH) | — | DG trên dữ liệu TĐ | 5 | — | Vừa (Đ, P R-f) | Pipeline 04 | **(04)** trong Gói 2 |
| R4 | Tư vấn 1-1 người thật, chợ thầy | 3 (TVVN, XT, LS) | "xem tử vi online với thầy" | DG | 5 | Vận hành liên tục | **Cao (Đ, P R-c)**: khó kiểm hù dọa; Sanctuary, Nebula bán theo phút | — | **KHÔNG** trong 2027 |
| R5 | Thư viện nguồn sách + trang phương pháp, trường phái | 0 (không trang nào thấy làm dạng này) | "lập lá số tử vi nam phái chuẩn" (04 #15) | — | 2 (gián tiếp: tạo tin cho P2) | 6 | Thấp | `tuvi-an-sao-spec.md`, `moTaQuyUoc()`, `ghi-chu-truong-phai.json` | **Trước Tết** (thay slot SEO của 04, xem 07 mục 6) |
| R6 | Trắc nghiệm tâm lý, nhật ký chiêm nghiệm (kiểu cece, CHANI) | 0 | "trắc nghiệm tính cách" | Tâm lý học (cần chuyên gia) | 2 | 40 | Vừa (Đ): không được thành "chẩn đoán" | — | **Sau** |

---

## 4. Tổng hợp theo kết luận

| Nhóm | Số công cụ | Công cụ |
|:--|:-:|:--|
| Đã có trong 04 | 4 | C1, C2, C3, R3 |
| Trước Tết (rẻ, không thêm giờ) | 1 | R5. Kèm phần đầu của C5 (12 cung) và C4 (14 chính tinh), vẫn tính ở P1. Chi tiết 07 mục 6 |
| **P1** (sau Tết, Quý 1–2/2027) | 15 | Độc lập (10): A1, A2, A3, B1, B2, C4, C5, C8, F1, J1. Gộp vào trang khác (5): A6, A7, B4, E2, G4 |
| **P2** (trong năm 2027) | 31 | A4, A5, B3, B5, B6, C6, C7, C9, D1, D2, E1 (lên P1 nếu 03 cho tín hiệu P4), E5, E6, F2, F3, F4, F5, G1, G2, G5, H1, H3, J2, J3, J4, K1, K2, P1, P2, P3, P4 |
| **Sau 2027** | 15 | A8, D3, G3, H2, H4, H5, K3, K4, L1, L2, M1, N1, N2, N3, R6 |
| **KHÔNG** | 21 | B7 (công cụ; chỉ cho phép 1 mục bách khoa "Cửu Diệu là gì" không CTA), C10, C11, D4, E3, E4, G6, G7, I1, K5, L3, M2, M3, M4, O1, O2, P5, Q1, R1, R2, R4 |

Kiểm đếm: 4 + 1 + 15 + 31 + 15 + 21 = **87**.

### Ba thứ quyết không làm và lý do

1. **Giải mộng ra con số (O2) — loại vĩnh viễn.** Cặp số hai chữ số sau giấc mơ có ở LNT, LV, XBTS (07a). Vùng từ khóa bị trang nhà cái chiếm. Google Ads chỉ cho xổ số Vietlott ở Việt Nam (R-h). Có bản án áp Điều 321 cho mua bán số đề qua mạng (R-d).
2. **Xem sao hạn → dâng sao giải hạn, văn khấn giải hạn, cắt duyên âm (B7, P5).** Đối thủ ghép thẳng hai thứ này (LNT slug "cach-dang-sao-giai-han"). Trái 04 mục 3.4, vào vùng R-a, R-b, R-c.
3. **Vật phẩm, bùa, linh phù, sim số đẹp (G6, G7).** Linghit bán "開光靈符" và thẻ ước nguyện (07a 2.12). Trái 04 mục 3.4 và chính sách Meta/Google (02).

---

## 5. Tài sản dùng lại được (tóm tắt)

| Tài sản | Đường dẫn | Phục vụ công cụ | Trạng thái |
|:--|:--|:--|:--|
| Lịch âm viết lại theo Meeus | `src/lib/tuvi-v2/am-lich.ts` | A1–A3, A5–A7, B2, E1, P2 | Khớp 108/108 Tết, 200/200 mốc, round-trip 73.414 ngày (05b) |
| Tiết khí VSOP87D | `src/lib/tuvi-v2/tiet-khi.mjs` | A4, A7, D1, K1 | MIT (05a) |
| 60 hoa giáp nạp âm | `src/lib/tuvi-v2/nap-am.mjs`, `data/nap-am.json` | B1, B2, F1 | Bảng cổ điển (05a) |
| Engine an sao | `src/lib/tuvi-v2/tuvi-raw.js` + `index.ts` | C1, C3, C8 | Apache-2.0, 106/106 test (05a) |
| Kho luận giải | `docs/v2/tai-san-xemtuvi/src/lib/luan-giai/` (`menh-chinh-tinh.json`, `doan-mau.json`, `quy-tac-van/`) và `docs/nghien-cuu/luan-giai/*.md` | C4, C5, C6, C9 | Cần đối chiếu nguồn từng đoạn trước khi đăng `[CHƯA KIỂM]` |
| Danh sách từ cấm | `docs/v2/tai-san-xemtuvi/src/lib/luan-giai/ai/tu-cam.json` (54 cụm + bảng thay thế) | Mọi trang | Mở rộng ở 07 mục 3.5 |
| Ghi chú trường phái | `.../ai/quy-tac-van/ghi-chu-truong-phai.json`, `moTaQuyUoc()` | R5, C4 | Có sẵn |
| **Không dùng** | `src/lib/core/*-raw.js`, `tutru-boidich.ts`, `thuvien-raw.js`… | — | Chép từ chotuvi.com hoặc sai nguyên lý (01) |

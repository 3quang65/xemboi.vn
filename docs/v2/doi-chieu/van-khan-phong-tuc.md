# Đối chiếu: Văn khấn, Phong tục, Kim lâu – Tam tai – Hoang ốc

Rà ngày 24/11/2026. Mục đích: xem trang nào trong kế hoạch SEO (`16-seo-trang.csv`, nhóm `VK-*`, `PTUC*`, `LE-*`, `XT-KIMLAU/TAMTAI/HOANGOC/LAMNHA/NAMTUOI`) dựng được ngay mà không phải tự bịa nội dung, và trang nào còn cần người viết. Liên quan `viec-can-anh.md` mục 15 và 25.

**Cách làm và giới hạn**
- Chỉ đọc web, không đăng nhập, không gửi biểu mẫu.
- Trang báo và trang lịch đọc qua WebFetch, tức là một model nhỏ tóm tắt lại. Tên thần, câu mở và câu kết là theo bản tóm tắt, nên muốn chắc từng chữ thì phải mở lại trang. Phần khảo sát 21 trang văn khấn chia cho 3 tác tử con, đọc tổng cộng khoảng 90 trang.
- Sách cổ thì đọc trực tiếp: vi.wikisource, zh.wikisource, và Kanripo KR3g0051 (tải về, tìm chữ).
- **Tệp này không chép bài văn khấn nào.** Mọi câu trích từ trang có bản quyền đều ≤15 chữ.
- Thời hạn bảo hộ theo Luật SHTT Việt Nam (Điều 27): suốt đời tác giả cộng 50 năm. Văn bản luật và văn bản hành chính không được bảo hộ (Điều 15).

---

## 0. Kết luận nhanh

| Nhóm | Dựng ngay được không | Dựa vào |
|---|---|---|
| Phần **phong tục** của trang ngày lễ (`/lich-am/ngay-le/*`: Tết, Hàn thực, Thanh minh, Đoan ngọ, rằm tháng 7, Trung thu, ông Táo) | **Được** | *Việt Nam phong tục* (Phan Kế Bính 1915, phạm vi công cộng), thiên I mục XII "Tứ thời tiết lạp", thiên II mục X "Am chúng sinh". Bài Wikipedia làm nguồn phụ. |
| `/phong-tuc/cung-duong` | **Được** | Kinh Pali bản dịch Anh của Sujato trên SuttaCentral (CC0), bài Wikipedia "Cúng dường" (CC BY-SA), Phan Kế Bính thiên II mục VI. Nên có người am hiểu Phật học đọc lại. |
| `/phong-tuc/xin-xam` | **Được**, chỉ mô tả phong tục, không giải quẻ | Wikipedia "Xin xăm"; mục 觀音籤 trong 佛學大辭典 (Đinh Phúc Bảo 1922, phạm vi công cộng); Phan Kế Bính III.21 (xin âm dương); quan điểm GHPGVN trên báo (trích ngắn). |
| `/van-khan/ngay-gio` | **Được** | *Gia lễ giản yếu* (Dương Bá Trạc 1932, phạm vi công cộng) có **mẫu văn khấn ngày giỗ**. Phan Kế Bính I.11 có tiên thường và chính kỵ. |
| `/van-khan/gia-tien` | **Được một phần** | *Gia lễ giản yếu* có mẫu khấn "ngày tiết lệ". Phan Kế Bính I.4 có lễ cáo gia tiên. Không sách nào có văn khấn thắp hương **hằng ngày**. |
| `/van-khan/cung-tuan-49-ngay` | **Được một phần** | Mẫu văn khấn lễ tang trong *Gia lễ giản yếu* có chú thích cách đổi chữ cho ngày nhập quan, 100 ngày. Phan Kế Bính I.9 có chung thất, tốt khốc, tiểu tường, đại tường. |
| `/van-khan/tet`, `/van-khan/ong-cong-ong-tao`, `/van-khan/cung-chung-sinh` | **Phần phong tục: được. Bài khấn: cần người viết** | Phong tục lấy từ Phan Kế Bính I.12 và II.10, *Sự tích táo quân*, *Văn tế thập loại chúng sinh* (Nguyễn Du). Không có bản văn khấn giao thừa, ông Táo hay chúng sinh nào thuộc phạm vi công cộng. |
| `/xem-tuoi/kim-lau`, `tam-tai`, `hoang-oc`, `nam-tuoi`, công cụ `lam-nha` | **Được nếu anh đồng ý cách trình bày** "theo tục truyền, các cách tính song song" | Không tìm thấy sách cổ nào ghi quy tắc tính. Phan Kế Bính (1915) chỉ chứng thực tục **kiêng tuổi Kim-lâu khi làm nhà**, không ghi cách tính. Các trang hiện nay dùng ít nhất 3–4 cách tính khác nhau (mục 4). |
| 15 trang văn khấn còn lại (mùng 1/rằm, Thần Tài–Thổ địa, rằm Giêng, rằm 7, rằm 8, bao sái, an vị, phóng sinh, lễ chùa, đền phủ, nhập trạch, động thổ, khai trương, đầy tháng, xe mới) | **Chưa, cần người soạn hoặc xin phép** | Nguồn chung của các báo là sách *Văn khấn cổ truyền Việt Nam* (NXB Văn hóa Thông tin, không ghi người biên soạn). Sách này vẫn còn bản quyền. Không có văn bản thay thế nào thuộc phạm vi công cộng. |
| Hub `/van-khan`, `/phong-tuc` | Dựng sau khi có trang con | Ghi chú trong CSV vẫn còn hiệu lực: chỉ mở sau khi kiểm bản quyền và hỏi luật sư. |

---

## 1. Văn khấn: các trang lớn trình bày thế nào

### 1.1 Nhận xét chung (rút từ khoảng 90 trang đã đọc)

1. **Chỉ có một nguồn sách được dẫn nhiều.** Đó là *"Văn khấn cổ truyền Việt Nam"*, NXB Văn hóa Thông tin. Sách được dẫn ở hơn 20 trang đã đọc, gồm VietNamNet, Dân trí, VTC, NLĐ/Tuổi Trẻ, phatgiao.org.vn, 24h (đăng lại từ Dân Việt), Báo Hà Tĩnh, Viettimes, Báo Quốc tế. **Không trang nào ghi người biên soạn hay năm in.** Tìm kiếm cũng không ra thông tin này, nên cần tra danh mục Thư viện Quốc gia.
2. **Văn bản gần như trùng nhau giữa các trang.** Danh sách thần (Hoàng thiên Hậu thổ, Bản cảnh Thành hoàng, Đông Trù Tư mệnh Táo phủ Thần quân, Long mạch, Tài thần, tiền chủ hậu chủ…) lặp lại gần nguyên văn. Đây là dấu hiệu chép chung một nguồn. Có hai dòng chính:
   - (a) Mở bằng "Nam mô A Di Đà Phật" 3 lần, kết bằng niệm Phật, **không có** "Cẩn cáo". Đây là dòng phổ biến nhất: VTC, lichngaytot (nhiều bài), Dân trí, VOV, Infonet, Dân Sinh.
   - (b) Mở bằng "Hoàng thiên Hậu thổ…", kết bằng "Phục duy cẩn cáo". Thấy ở VietNamNet, NLĐ và một số bài lichngaytot. Nhiều trang trộn cả hai dòng.
   - Ngoài ra có **bản Nôm ngắn**: VnExpress (Phạm Đình Hải, Nguyễn Mạnh Linh) mở thẳng bằng "Kính lạy…", kết "Cẩn cáo, thượng hưởng".
3. **Khác nhau ở chi tiết.** Có bài có, có bài không có "Hoàng thiên Hậu thổ" và "Kim niên Đương cai Thái tuế". Chính tả không thống nhất: "Đương/Đường cai", "Thái Tuế/Thái Tế". Giờ cúng chúng sinh có trang ghi trước 12 giờ trưa, có trang ghi sau 12 giờ.
4. **Phần lớn trang không ghi nguồn.** Lichngaytot không dẫn sách nào, chỉ trỏ về mục "Văn khấn cổ truyền" của chính trang. VTC, VOH, Infonet, Dân Sinh cũng không ghi nguồn ở đa số bài.
5. **Các trang tự ghi "tham khảo"**: VnExpress, VTC, VOH, Dân trí, Dân Sinh, Viettelstore. Các ý kiến được ghi tên:
   - VTC: không cần từ ngữ "quá bóng bẩy".
   - VOH: thành tâm quan trọng hơn câu chữ.
   - Dân trí (chuyên gia Phạm Cương): lời khấn nên mộc mạc.
   - VnExpress và Viettimes: chủ nhà tự khấn Nôm, không cần thầy cúng.
   - Thanh Niên (TS Dương Hoàng Lộc): có thể khấn theo cách riêng, miễn là thành tâm.
   - Giác Ngộ: "không nên quá câu nệ vào hình thức".
   - Quách Trọng Trà (znews): văn khấn cổ nhiều từ Hán Việt khó hiểu, cần làm mới. Sách của ông, *Thờ cúng cổ truyền Việt Nam – Nghi lễ và thực hành nghi lễ* (NXB Thế Giới/Nhã Nam), soạn lại văn khấn bằng tiếng Việt thường. Sách còn bản quyền.
   - **Chưa thấy** ý kiến nào về văn khấn của Đinh Văn Phong, Nguyễn Hùng Vĩ hay Ngô Đức Thịnh. Không được gắn tên các vị này khi chưa có nguồn.
6. **Không trang nào dẫn Ban Tôn giáo Chính phủ.** Các trang Phật giáo (phatgiao.org.vn, giacngo.vn) với lễ 49 ngày, cúng cô hồn, phóng sinh thì khuyên tụng kinh và theo nghi thức Phật giáo, không đưa văn khấn dân gian.
7. **Bản quyền.** Văn khấn là tục dân gian. Tuy vậy, **câu chữ cụ thể** của sách NXB Văn hóa Thông tin là một bản biên soạn, nhiều khả năng vẫn được bảo hộ. Việc hàng chục báo chép lại không làm văn bản thành tự do. Tác phẩm văn học dân gian (Điều 23 Luật SHTT) và ranh giới giữa bản biên soạn với bản dân gian cần **hỏi luật sư**, đúng như ghi chú "08 #17" trong CSV.

### 1.2 Từng trang

Ký hiệu cột "Nguồn dẫn": NXB VHTT = "Văn khấn cổ truyền Việt Nam", NXB Văn hóa Thông tin.

| Trang của ta | Trang đã đọc (đại diện) | Nguồn họ dẫn | Văn bản giữa các trang | Cấu trúc thường gặp |
|---|---|---|---|---|
| `/van-khan/mung-1-va-ngay-ram` | lichngaytot.com/van-khan-co-truyen/van-khan-mung-1-va-ngay-ram-2.html · vtcnews.vn/…-ar1013485.html · infonet.vietnamnet.vn/…-3546.html · dansinh.dantri.com.vn/…20231213064229000.htm | Không trang nào ghi nguồn | VTC, Infonet, Dân Sinh gần như cùng một bộ 2 bài (thần linh, gia tiên), dòng (a). Lichngaytot có 4 nhóm bài, bài gia tiên kết "Cẩn cáo". | Bài khấn là chính. Ít trang có lễ vật, không trang nào nêu giờ. |
| `/van-khan/than-tai-tho-dia` | vtcnews.vn/…-ar674279.html · lichngaytot.com/van-khan/van-khan-le-than-tai-6-85.html · dantri.com.vn/…20260223204504370.htm · vnexpress.net/nhung-ai-nen-cung-ngay-via-than-tai-5008227.html · thanhnien.vn/…185250206204125859.htm | Dân trí: NXB VHTT; *Văn khấn cổ truyền của người Việt* (ĐĐ Thích Nguyên Mãn hiệu đính, NXB Lao động); Nguyễn Song Hà. Thanh Niên: TS Dương Hoàng Lộc, sách *Tìm hiểu phong tục, nghi lễ thờ cúng của người Việt* (NXB Hồng Đức). VnExpress: Phạm Đình Hải. | Lõi chung giống nhau. Câu mở và câu kết khác nhau. | Dân trí và VnExpress đủ nhất: giờ, lễ vật, lưu ý. |
| `/van-khan/gia-tien` | voh.com.vn/thuong-thuc/van-khan-gia-tien-hang-ngay-639278.html · phatgiao.org.vn/…-d43709.html | phatgiao.org.vn: NXB VHTT (ghi là "gợi ý") | Hầu như không báo lớn nào có bài "hằng ngày" riêng. Kết quả tìm chủ yếu là trang bán lẻ. | VOH có giờ và 4 lưu ý. |
| `/van-khan/ram-thang-7` | vietnamnet.vn/bai-cung-ram-thang-bay-theo-van-khan-co-truyen-viet-nam-667829.html · vtcnews.vn/…-ar566864.html · lichngaytot.com/phong-tuc/bai-cung-ram-thang-7-536-185628.html · tuoitre.vn/nld/…196250905091642289.htm | VietNamNet, VTC: NXB VHTT | **Gần như giống hệt nhau ở cả 4 trang.** Bộ gồm thần linh (có Địa Tạng, Mục Kiền Liên), gia tiên, chúng sinh. | Chỉ lichngaytot có lễ vật chi tiết. |
| `/van-khan/cung-chung-sinh` | phatgiao.org.vn/…-d77192.html · phatgiao.org.vn/cach-cung-co-hon-ngay-ram-thang-bay-d35629.html | NXB VHTT; kinh Tăng Chi | Cùng một bài ở mọi trang, kết "Kính cáo". Bài d35629 chỉ có nghi thức Mông Sơn thí thực, không có văn khấn. | Lễ vật (cháo, muối, gạo). Giờ cúng mâu thuẫn giữa các trang. |
| `/van-khan/ong-cong-ong-tao` | vnexpress.net/nghi-thuc-cung-ong-tao-2025-4840466.html · vnexpress.net/chuyen-gia-huong-dan-nghi-thuc-cung-ong-tao-2026-5009232.html · vietnamnet.vn/bai-cung-tao-quan-theo-van-khan-co-truyen-viet-nam-352631.html · viettimes.vn/…post194547.html · baohatinh.vn/…29924.html | VnExpress: Phạm Đình Hải soạn bài, *Việt Nam phong tục* (lễ vật), *Ngọc hạp ký* (ngày giờ). VietNamNet: NXB VHTT, GS Lương Ngọc Huỳnh, GS Trần Lâm Biền (chỉ nói về lễ vật). | Hai dòng khác hẳn nhau: bản sách NXB VHTT, và bản Nôm của VnExpress, Viettimes, Hà Tĩnh. | Đủ nhất trong các chủ đề: ngày giờ, lễ vật, cá chép, hóa vàng. |
| `/van-khan/tet` | vnexpress.net/…-5008208.html · dantri.com.vn/…20260215101510642.htm · vietnamnet.vn/…-2482934.html, …-2486813.html, …-2485694.html · 24h.com.vn/…c46a1327687.html · lichngaytot.com/van-khan/…-3-21.html, …-3-15.html, …-3-19.html | Dân trí, VietNamNet, 24h: NXB VHTT. VnExpress: Phạm Đình Hải và *Ngọc hạp ký*. Dân trí: Phạm Cương. | Bài giao thừa ngoài trời có Hành khiển, Hành binh, Phán quan cũ và mới, giống nhau giữa các trang. Bản Nôm của VnExpress khác hẳn. | VnExpress và Dân trí có giờ (23h–1h), lễ vật, thứ tự ngoài trời trước. |
| `/van-khan/ram-thang-gieng` | vnexpress.net/nghi-le-cung-ram-thang-gieng-4427946.html · vtcnews.vn/…-d302747.html · vov.vn/…-732130.vov · lichngaytot.com/phong-tuc/…-536-196249.html · baomoi (TT&VH, tiêu đề "theo Văn khấn cổ truyền Việt Nam") | VnExpress: Nguyễn Mạnh Linh. VTC: GS Lương Ngọc Huỳnh. VOV và lichngaytot: không ghi nguồn. | **Khác nhau rõ.** VnExpress có bài ngắn. VOV và lichngaytot dùng cùng một bài dài. VTC có khoảng 4 bài. | Thiên về ý nghĩa và bài khấn, ít lễ vật. |
| `/van-khan/ram-thang-8` | lichngaytot.com/van-khan/…-3-25.html · vietnamnet.vn/…-2321962.html · tuoitre.vn/nld/…196251005064633893.htm · vtcnews.vn/…-ar1041603.html | VietNamNet, NLĐ: NXB VHTT | Bản theo sách có "Hoàng thiên Hậu thổ…" và kết "Phục duy cẩn cáo". Lichngaytot và VTC theo dòng (a). | Lichngaytot có lễ vật. NLĐ có giờ. |
| `/van-khan/ngay-gio` | lichngaytot.com/van-khan/…-5-22.html, …-5-47.html · viettelstore.vn/tin-tuc/van-khan-ngay-gio | Không ghi nguồn (VietNamNet có bài theo NXB VHTT nhưng chưa đọc) | Lichngaytot tách bài Tiên thường và bài Cát kỵ. Giỗ đầu có thêm bài khấn Thổ công riêng. | Lễ vật theo 3 miền (Viettelstore), lạy, hóa vàng. |
| `/van-khan/cung-tuan-49-ngay` | lichngaytot.com/van-khan/…-5-51.html · thegioididong.com/hoi-dap/van-khan-49-ngay-1604089 · phatgiao.org.vn/…-d36788.html · giacngo.vn/cung-com-cho-huong-linh-sau-ngay-chung-that-post2080.html | phatgiao.org.vn: tài liệu của Tỳ kheo Thích Nhuận Nghi, Kinh Địa Tạng. Giác Ngộ: Tổ Tư vấn. | Lichngaytot dùng một bài chung cho 49 và 100 ngày. Hai trang Phật giáo không có văn khấn. | Chưa trang nào trình bày đủ các tuần thất. |
| `/van-khan/bao-sai-ban-tho` | vietnamnet.vn/…-2483306.html · dantri.com.vn/…20260211100942747.htm · phatgiao.org.vn/…-d33714.html | VietNamNet: Nguyễn Song Hà. Dân trí: Phạm Cương. phatgiao.org.vn: "Văn khấn cổ truyền" (NXB VHTT), GS-TS Nguyễn Chí Bền (về thời điểm). | Cả ba theo dòng (a). | Số chân hương giữ lại, lau bằng rượu gừng. Phạm Cương: đừng biến thành chuỗi kiêng kỵ. |
| `/van-khan/an-vi-bat-huong` | vietnamnet.vn/…-2484880.html · vtcnews.vn/bai-van-khan-thay-ban-tho-moi-ar910161.html · voh.com.vn/…-574282.html | Nguyễn Song Hà (VietNamNet); hai trang còn lại không ghi | VOH có 7 bài, VietNamNet 3 bài, VTC 1 bài. Có chỗ trộn "cẩn cáo" với "Nam mô". | VOH đủ nhất: 2 mâm lễ, phủ vải đỏ. |
| `/van-khan/phong-sinh` | phatgiao.org.vn/…-d69059.html, …-d98774.html · lichngaytot.com/tam-linh/…-564-183204.html · tuoitre.vn/…20260415152127421.htm · vietnamnet.vn/…-2183639.html | Văn bản hướng dẫn Phật đản 2570 của GHPGVN (HT Thích Thiện Nhơn ký): phóng sinh chỉ dùng bồ câu. Lichngaytot dẫn ĐĐ Thích Đức Thiện và TT Thích Chơn Không. | Dùng nghi thức Phật giáo (sám hối, Tam quy, hồi hướng), không theo khung dân gian. Lichngaytot có bài dạng thơ. | Cảnh báo môi trường: không thả rùa tai đỏ, tránh "phóng tử". |
| `/van-khan/le-chua` | lichngaytot.com/van-khan/…-6-31.html, lichngaytot.com/tam-linh/di-le-chua-dung-cach-564-201686.html · vietnamnet.vn/…-2465180.html · voh.com.vn/song-dep/van-khan-tam-bao-601810.html | VietNamNet: NXB VHTT. Lichngaytot: Thầy Thích Trí Thịnh (chỉ nói về xin lộc). | Bài ban Tam Bảo **gần như giống hệt nhau** ở 3 trang. Bài Đức Ông chỉ có ở lichngaytot. | Ý nghĩa, sắm lễ, hạ lễ, khấn. Thứ tự: ban Đức Ông trước. |
| `/van-khan/le-den-phu` | lichngaytot.com/van-khan/van-khan-le-ban-cong-dong-6-70.html · voh.com.vn/thuong-thuc/van-khan-phu-tay-ho-634140.html · baophapluat.vn/di-le-phu-tay-ho-khan-sao-cho-dung-post329779.html | Không trang nào ghi nguồn văn khấn | Bài ban Công đồng của lichngaytot và VOH **gần như trùng nhau**. | Báo Pháp luật: Phủ Tây Hồ cấm đốt vàng mã, xin xăm, bói. |
| `/van-khan/nhap-trach` | lichngaytot.com/van-khan/van-khan-cung-le-nhap-trach-9-44.html · vtcnews.vn/…-ar948106.html · vnexpress.net/doi-song/nhap-trach-nha-moi-the-nao-cho-dung-3139964.html | VnExpress: Nguyễn Mạnh Linh | Lichngaytot và VTC gần nhau. Bản VnExpress ngắn hơn. | Lichngaytot có nhiều kiêng kỵ (tuổi Dần, bà bầu…). |
| `/van-khan/dong-tho` | lichngaytot.com/xay-dung/van-khan-cung-dong-tho-542-180055.html · tuvi.vn/…-a1159 · voh.com.vn/…-640567.html | tuvi.vn: "Nguyễn Thế Anh" (kèm quảng cáo dịch vụ) | **Cùng một khuôn** ở 3 trang. Cất nóc dùng chung bài, chỉ đổi chữ. | Chọn ngày, mượn tuổi (Kim lâu, Hoang ốc). Ảnh mâm cúng trên VOH ghi "Ảnh: Chat GPT". |
| `/van-khan/khai-truong` | lichngaytot.com/van-khan/…-9-76.html · vietnamnet.vn/…-2416546.html · vtcnews.vn/cac-bai-van-khan-khai-truong-cua-hang-ar910037.html · baoquocte.vn/…-355045.html | VietNamNet, VTC: NXB VHTT | Cả 4 bài **gần như giống nhau**. | Lễ vật, cách đặt bàn lễ. |
| `/van-khan/day-thang-thoi-noi` | lichngaytot.com/van-khan/van-khan-cung-day-thang-cung-mu-4-68.html, lichngaytot.com/sinh-con/cung-thoi-noi-539-180165.html · hellobacsi.com/community/… | Không trang nào ghi nguồn | **Gần như giống hệt nhau** (12 bà Mụ, 3 Đức Ông) | Mâm 12+1 phần. Trang thôi nôi của lichngaytot tự mâu thuẫn (12 tháng và 1 tháng). |
| `/van-khan/cung-xe-moi` | vnexpress.net/nen-cung-oto-moi-nhu-the-nao-5004378.html · voh.com.vn/thuong-thuc/van-khan-cung-xe-638811.html · fptshop.com.vn/…-212494 | VnExpress: ThS Trần Thị Kim Hoa (cho rằng không cần cúng xe, bài không có văn khấn) | VOH và FPT có bản gia đình và bản doanh nghiệp, khác nhau. Lichngaytot không có bài. | FPT có giờ và lưu ý cháy nổ ở hầm xe. |

---

## 2. Nguồn dùng được công khai (phạm vi công cộng hoặc giấy phép mở)

### 2.1 Dùng được ngay

| Nguồn | URL | Giấy phép | Chủ đề của ta mà nguồn này phủ (tên chương) |
|---|---|---|---|
| **Phan Kế Bính, *Việt Nam phong tục*** (đăng Đông Dương tạp chí 1913–14; in 1915, Nhà sách Khai Trí). Tác giả mất 1921. | https://vi.wikisource.org/wiki/Việt_Nam_phong_tục (trang con `/I.4`, `/I.12`…) | Phạm vi công cộng (mẫu PVCC-cũ-80). Bản chép trên Wikisource theo CC BY-SA 4.0. | **I.IV Phụng sự tổ tôn**: bàn thờ, Thổ công, Táo quân, Nghệ sư, bà Cô ông Mãnh, lễ cáo gia tiên, lễ vật. Không có sóc vọng, không có văn khấn. → `gia-tien`, hub `phong-tuc`. **I.IX Tang ma**: cúng cơm, chung thất, tốt khốc, tiểu tường, đại tường, đàm tế. → `cung-tuan-49-ngay`. **I.XI Kỵ nhật**: tiên thường và chính kỵ, bát cơm úp trứng. → `ngay-gio`. **I.XII Tứ thời tiết lạp**: Nguyên đán (giao thừa, xông đất, hóa vàng mồng 4, hạ nêu mồng 7), Hàn thực, Thanh minh, Đoan ngọ, Trung nguyên (xá tội vong nhân, đốt mã), Trung thu, Trùng cửu, Trùng thập, Táo quân 23 tháng Chạp (mũ ông, mũ bà, cá chép), Trừ tịch. → mọi trang `/lich-am/ngay-le/*`, `tet`, `ong-cong-ong-tao`, `ram-thang-7`, `ram-thang-8`. **II.VI Chùa chiền**: lễ chùa rằm và mồng một bằng oản chuối, Đức Ông là tượng Long thần mặt đỏ (Thổ thần), làm chay, quyên giáo. → `le-chua`, `cung-duong`. **II.X Am chúng sinh**: cúng cháo lá đa rằm và mồng một ba tháng hè, đại trai đàn tháng Bảy. → `cung-chung-sinh`. **III.IX Phật giáo**. **III.XXI Bốc phệ**: thi bốc, mai hoa, kim tiền, bói Kiều, xin âm dương. Không có xin thẻ. → `xin-xam`. **III.XXVII Đồng cốt**: thờ Liễu Hạnh, Thượng Ngàn, đồng Cô Cậu, hầu bóng ở phủ Dầy, đền Lộ. → `le-den-phu` (tác giả phê phán mạnh). **III.XXXI Xem ngày kén giờ**: "kỵ… tuổi Kim-lâu" khi làm nhà, nguyệt kỵ 5–14–23, Dương công kỵ nhật (13 ngày), sát chủ, thụ tử. → `kim-lau`, `lam-nha`. **III.XXXII Các việc kiêng kỵ**: kiêng làm nhà số gian chẵn, cưới mùa hè, kiêng đầu năm. **III.XXXVIII Cư sở**: xem năm hợp tuổi, hướng, ngày giờ dựng nhà. Không ghi quy tắc tính. |
| **Dương Bá Trạc, *Gia lễ giản yếu*** (Đông-Tây Ấn-quán, Hà Nội, 4/1932). Tác giả mất 1944. | https://vi.wikisource.org/wiki/Gia_lễ_giản_yếu | Phạm vi công cộng (PVCC-cũ-80-1996). Bản chép theo CC BY-SA 4.0. | **Văn tế và văn khấn**: https://vi.wikisource.org/wiki/Gia_lễ_giản_yếu/Văn_tế_và_văn_khấn. Có **5 mẫu điền tên** bằng chữ quốc ngữ, mỗi mẫu 25–60 chữ: tang ông bà cha mẹ; tang chú bác anh chị; **ngày giỗ**; **ngày tiết lệ** (lấy Tết và cơm mới làm ví dụ); **thần thờ trong nhà**. Chú thích hướng dẫn đổi chữ cho ngày nhập quan, 100 ngày. **Lễ dỗ**: chính giỗ làm buổi sớm, hôm trước làm lễ cáo, lễ vật "hương hoa dầu nước". **Lễ tết**: chỉ giữ Nguyên đán, Thanh minh, cơm mới. Tác giả **bỏ** Đoan ngọ, Thượng nguyên, Trung nguyên, Trung thu vì cho là "vô ý nghĩa". **Làm lễ**: trình tự thắp nến, 4 lạy, dâng rượu, đọc văn, 4 lạy tạ. **Lễ tang**, **Để trở**, **Khoản thức biên gia phả**. → `ngay-gio`, `gia-tien`, `cung-tuan-49-ngay`, `tet` (tiết lệ), và một phần `than-tai-tho-dia` (mẫu "thần thờ trong nhà" dùng được cho Thổ công, **không có Thần Tài**). Lưu ý: đây là sách **cải lương, giản lược**, nên lời văn khác hẳn bài phổ biến hiện nay. Trang phải nói rõ "bản năm 1932". |
| Nguyễn Du, *Văn tế thập loại chúng sinh* (Văn chiêu hồn) | https://vi.wikisource.org/wiki/Văn_tế_thập_loại_chúng_sinh | Phạm vi công cộng. Bản chép (từ *Văn tế cổ và kim*, NXB Văn hóa 1960) theo CC BY-SA 4.0. | Tác phẩm văn học, không phải văn khấn. Dùng cho phần ý nghĩa của `cung-chung-sinh` và `ram-thang-7`, trích vài câu. Trang Wikisource không nói tác phẩm được đọc trong lễ tháng Bảy, nên đừng khẳng định điều đó nếu chưa có nguồn. |
| *Sự tích táo quân* (truyện cổ, khuyết danh) | https://vi.wikisource.org/wiki/Sự_tích_táo_quân | Văn kiện vô danh; CC BY-SA 4.0 | Phần sự tích của `ong-cong-ong-tao` (Trọng Cao, Thị Nhi, Phạm Lang). |
| Wikipedia tiếng Việt | https://vi.wikipedia.org/wiki/Tết_Nguyên_Đán · /Tết_Nguyên_tiêu · /Vu-lan · /Cúng_cô_hồn · /Tết_Trung_thu · /Táo_quân · /Thổ_công · /Thần_Tài · /Tín_ngưỡng_thờ_cúng_tổ_tiên · /Giỗ · /Đám_tang_người_Việt · /Bàn_thờ · /Lư_hương · /Phóng_sinh · /Cúng_dường · /Xin_xăm · /Xăm · /Phủ_Tây_Hồ · /Tứ_phủ · /Thôi_nôi · /Phan_Kế_Bính | CC BY-SA 4.0. Nếu chép nguyên văn thì đoạn đó phải ghi công và chia sẻ cùng giấy phép. | Dùng làm nguồn phụ và để dẫn link. Chính các bài này lại dẫn báo, nên không dùng làm căn cứ cho lời khấn. **Không có bài** về Kim lâu, Hoang ốc, Tam tai, Năm tuổi, Thái tuế, Văn khấn, Nhập trạch, Động thổ, Xá tội vong nhân, Thọ Mai gia lễ (kiểm qua API ngày 24/11). |
| Kinh Pali, bản dịch Anh của Bhikkhu Sujato (SuttaCentral) | https://suttacentral.net/an2.143/en/sujato (AN 2.143: hai loại bố thí, vật chất và Pháp; Pháp thí hơn). Itivuttaka 98 và 100 cùng ý. | CC0 (bản dịch Sujato) | `/phong-tuc/cung-duong`: xemboi tự dịch sang tiếng Việt, ghi "dịch từ bản Anh CC0". **Cần kiểm lại** số kinh đúng cho khái niệm *pūjā* (cúng dường) và *dāna* (bố thí). |
| 佛學大辭典 (Đinh Phúc Bảo 1922), mục 觀音籤 | https://zh.wikisource.org/wiki/佛學大辭典/觀音籤 | Phạm vi công cộng | `/phong-tuc/xin-xam`: nguồn gốc bộ thẻ Quan Âm (dẫn 釋門正統: chùa Thiên Trúc 100 thẻ, chùa Viên Thông 130 thẻ). zh.wikisource **không có** trang 觀音靈籤 (100 quẻ). Bảng 100 quẻ và lời giải trên các trang hiện nay đều có bản quyền. |
| *Luật Đa dạng sinh học 2008* (bản trên Wikisource) | https://vi.wikisource.org/wiki/Luật_Đa_dạng_sinh_học_nước_Cộng_hòa_xã_hội_chủ_nghĩa_Việt_Nam_2008 | Văn bản luật, không được bảo hộ (Điều 15 Luật SHTT) | `/van-khan/phong-sinh`: phần lưu ý không thả loài ngoại lai xâm hại. |
| Ngọc hạp ký 玉匣記 | https://zh.wikisource.org/wiki/玉匣記 (đã có trong RAG, mã WS12) | Phạm vi công cộng; CC BY-SA 4.0 | Liên quan mục 3: có "男命禁婚年", "女命禁行嫁年", "嫁娶周堂圖", "上樑日忌", "小兒煞歌". **Không có** 金樓, 荒屋, hay 三災 theo tuổi. |
| Hiệp kỷ biện phương thư 欽定協紀辨方書 | Kanripo https://github.com/kanripo/KR3g0051 (RAG); zh.wikisource "欽定協紀辨方書 (四庫全書本)/卷03" | Phạm vi công cộng; CC BY-SA 4.0 | Quyển 3 (義例一) có các mục 太歲, 劫煞, 災煞, 歲煞 (tức Tam sát). Đây là **thần phương vị theo năm**, không phải hạn theo tuổi người. Tìm toàn bộ 35 quyển **không thấy** 三災, 金樓, 荒屋. |

### 2.2 Không dùng được, hoặc chưa dùng được

| Nguồn | Lý do |
|---|---|
| *Thọ Mai gia lễ* (thường gán cho Hồ Sĩ Tân, thế kỷ 18) | Bản Hán gốc thuộc phạm vi công cộng, nhưng **vi.wikisource không có**. Bản quét ở lib.hpu.edu.vn bị giới hạn truy cập. Mọi bản dịch quốc ngữ hiện có đều là bản dịch hiện đại, còn bản quyền của người dịch. Muốn dùng thì phải tìm bản Hán hoặc Nôm quét gốc (Thư viện số Hán Nôm, có hơn 20 bản in) rồi tự dịch. Việc này cần người đọc Hán Nôm. |
| Đào Duy Anh, *Việt Nam văn hóa sử cương* (1938) | Tác giả mất năm 1988, sách **được bảo hộ đến hết năm 2038**. Không có trên Wikisource. Chỉ dẫn tên sách được, không chép. |
| *Văn khấn cổ truyền Việt Nam* (NXB Văn hóa Thông tin) | Không rõ người biên soạn, sách còn bản quyền. Có thể ghi "theo sách…" và trích rất ngắn, nhưng không đăng toàn văn. Muốn đăng thì phải xin phép người giữ quyền. NXB Văn hóa Thông tin đã giải thể hoặc sáp nhập, nên cần luật sư tìm ai đang giữ quyền. |
| Sách Quách Trọng Trà, Toan Ánh, Thích Nguyên Mãn, sách NXB Hồng Đức | Còn bản quyền (Toan Ánh xếp loại C trong RAG) |
| Bản dịch kinh của HT Thích Minh Châu (SuttaCentral, budsas) | Không có giấy phép mở, chỉ ghi "with the kind permission" của budsas.net. Chưa rõ tình trạng. |
| Báo Giác Ngộ | Trang ghi "Toàn bộ bản quyền thuộc Báo Giác Ngộ" |

---

## 3. Kim lâu, Tam tai, Hoang ốc (và Năm tuổi)

### 3.1 Có sách cổ nào ghi quy tắc không

- **Hiệp kỷ biện phương thư** (Kanripo KR3g0051, 35 quyển, đã tìm toàn văn): **không có** 金樓, 荒屋 hay 三災. Quyển 3 có Tam sát (劫煞, 災煞, 歲煞) theo năm. Ví dụ năm Thân–Tý–Thìn thì Tam sát ở phương Tỵ–Ngọ–Mùi. Đây là phương hướng, khác với Tam tai.
- **Ngọc hạp ký** (zh.wikisource): không có Kim lâu, Hoang ốc, Tam tai theo tuổi. Sách có những quy tắc **cùng loại nhưng khác cách tính**:
  - "Nam mệnh cấm hôn niên" và "Nữ mệnh cấm hành giá niên": cấm cưới theo **chi năm sinh** đối với chi năm cưới. Ví dụ năm Tý thì nữ tuổi Mão kỵ.
  - "Thượng lương kỵ xung mệnh chủ nhà".
  - Bản trên Wikisource có chỗ bảng không theo quy luật, cần đối chiếu bản quét trước khi dùng.
- **Phan Kế Bính 1915** (III.XXXI): chỉ chứng thực tục **kỵ "tuổi Kim-lâu" khi làm nhà**, không ghi cách tính. Không nhắc Hoang ốc, Tam tai. Tác giả cho việc kén ngày là "vô lý".
- **vi.wikisource**: tìm "kim lâu" và "hoang ốc" không ra đoạn nào nói về hạn tuổi. "tam tai" chỉ có trong *Từ điển Việt–Bồ–La* (1651), nghĩa là "tai họa chung", không phải hạn theo tuổi.
- **Ý kiến có tên trên báo:**
  - Phạm Đình Hải (VnExpress, 13/6/2022, https://vnexpress.net/tuoi-kim-lau-co-lam-nha-duoc-khong-4475042.html) cho rằng Thông thư và Ngọc hạp ký **không nhắc** Hoang ốc và Tam tai.
  - KTS Hoàng Trà (Phó Viện trưởng Viện Lý học phương Đông, trên baodautu.vn, https://baodautu.vn/tim-hieu-ve-kim-lau-d114443.html) cho rằng Kim lâu chỉ là quy định truyền miệng, chưa có định nghĩa rõ.
- **Kết luận:** không tìm được nguồn cổ nào ghi các quy tắc này. Trang chỉ có thể viết theo dạng **"theo tục truyền"**. Trích Phan Kế Bính để chứng thực tục đã có từ đầu thế kỷ 20. Mặt khác, tìm toàn văn chỉ phủ được Hiệp kỷ và Ngọc hạp. Các thông thư Minh–Thanh dạng bản quét (RAG, archive.org) chưa OCR nên chưa loại trừ được.

### 3.2 Kim lâu: các cách tính đang dùng

| # | Cách tính | Trang dùng | Ghi chú |
|---|---|---|---|
| A | Lấy **tuổi mụ** (tuổi âm) chia 9. Dư 1 là Kim lâu thân, dư 3 là thê, dư 6 là tử, dư 8 là lục súc. | VTC (bảng 2026), dienmayxanh, luatduonggia, lichngaytot (gán cho "Thông thư"), VnExpress (Phạm Đình Hải, cách 1: "dân gian") | Phổ biến nhất |
| B | Xem **chữ số cuối** của tuổi mụ: 1, 3, 6, 8 là phạm | VnExpress (cách 2), lichngaytot (cách 1, dùng cho cưới) | Nhiều trang (dienmayxanh, baodautu) gọi đây là cách hiểu sai. Lichngaytot còn có biến thể **cộng các chữ số đến khi còn một chữ số**, cách này cho kết quả trùng với A. |
| C | **Bát quái trên bàn tay** theo mốc 10 năm: 10 ở Khôn, 20 Đoài, 30 Càn, 40 Khảm, 50 Trung cung, 60 Cấn, 70 Chấn, 80 Tốn, 90 Ly. Từ mốc đó đếm thuận theo từng tuổi. Rơi vào Khôn, Càn, Cấn, Tốn là phạm. | lichngaytot (cách 3, dùng cho cất nhà), VnExpress (cách 3, tác giả cho là **sai**, do "chép nhầm hoặc dịch sai") | Ví dụ của lichngaytot: 28 tuổi rơi vào Đoài, **không phạm**. Theo cách A thì 28 phạm Kim lâu thân. Hai cách mâu thuẫn ngay trong cùng một trang. |
| D | Cửu cung Lạc thư theo **từng tuổi**: 1 Khôn, 2 Đoài, 3 Càn, 4 Khảm, 5 Trung, 6 Cấn, 7 Chấn, 8 Tốn, 9 Ly, 10 Trung, rồi lặp lại | VnExpress (cách 4; Phạm Đình Hải cho là đúng, "hợp Thông thư, Ngọc hạp ký" bản triều Nguyễn) | Gần với A, nhưng tuổi 10 đặt ở Trung cung nên chu kỳ lệch. Cần đọc kỹ bài gốc để biết sau tuổi 10 đếm tiếp thế nào. |

**Các chỗ khác nhau ngoài cách tính:**
- **Áp cho ai.** Cưới hỏi xét tuổi **cô dâu** (lichngaytot, câu "lấy vợ xem tuổi đàn bà" dẫn trên baodautu). Làm nhà xét tuổi **đàn ông hay trụ cột**. Nếu chồng mất thì xét tuổi con trai, không có con trai thì xét tuổi vợ (lichngaytot).
- **Mức nặng nhẹ.** Có trang cho rằng Kim lâu chỉ đáng lo với nữ dưới 30 tuổi. Có trang nói làm nhà thì kiêng nhất Kim lâu thân và tử, còn lục súc nhẹ hơn.
- **Hóa giải** (chỉ ghi nhận, không khuyên): mượn tuổi, xin dâu hai lần, cưới sau Đông chí hoặc sau sinh nhật cô dâu.
- **Danh sách tuổi sai.** baodautu liệt kê 23, 31, 36, 38 là tuổi phạm, trái với chính quy tắc chia 9 mà bài nêu.

**So sánh ba cách A, B, C cho tuổi mụ 18–49.** X là phạm. Cột C do xemboi dựng lại theo mô tả của lichngaytot: vòng 8 cung bỏ Trung cung, khớp với ví dụ 28 → Đoài của trang. Cần đối chiếu thêm trước khi đưa lên trang.

| Tuổi | A chia 9 | B chữ số cuối | C bàn tay |
|---|---|---|---|
| 19 | X | . | Đoài . |
| 21 | X | X | Càn X |
| 23 | . | X | Cấn X |
| 24 | X | . | Chấn . |
| 25 | . | . | Tốn X |
| 26 | X | X | Ly . |
| 27 | . | . | Khôn X |
| 28 | X | X | Đoài . |
| 30 | X | . | Càn X |
| 33 | X | X | Chấn . |
| 36 | . | X | Khôn X |
| 37 | X | . | Đoài . |
| 45 | . | . | Khôn X |
| 46 | X | X | Đoài . |

→ Với cùng một người, ba cách có thể cho ba kết luận khác nhau. Trang `/xem-tuoi/kim-lau` nên hiện **cả ba hoặc bốn cột song song**, ghi trang nào dùng cách nào, và không gộp thành một kết luận "phạm" hay "không phạm".

### 3.3 Hoang ốc

- **6 cung**: Nhất Cát, Nhì Nghi, Tứ Tấn Tài là tốt; Tam Địa Sát, Ngũ Thọ Tử, Lục Hoang Ốc là xấu. Các trang thống nhất về điểm này.
- **Cách tính 1** (wiki.batdongsan.com.vn, hoatieu, dienmayxanh): khởi 10 tuổi ở Nhất Cát, 20 Nhì Nghi, 30 Tam Địa Sát, 40 Tứ Tấn Tài, 50 Ngũ Thọ Tử, 60 Lục Hoang Ốc. Từ cung của mốc 10 năm, đếm tiếp theo số lẻ của tuổi.
- **Cách tính 2** (batdongsan): cộng hai chữ số của tuổi, lấy tổng chia 6, số dư là số cung. Dư 0 là cung 6. Xemboi kiểm thấy cách này **luôn cho cùng kết quả** với cách 1 (ví dụ 45 → 9 → dư 3 → Tam Địa Sát, khớp hoatieu). Vậy hai cách là một.
- **Chỗ khác nhau:**
  - Dùng tuổi mụ (fptshop) hay "tuổi âm" (batdongsan). Thực chất là một, nhưng vài trang lẫn với tuổi dương.
  - VTC (bảng 2026) không nêu cách khởi cung.
  - Các trang không thống nhất có kiêng cả ba cung xấu như nhau hay không.
  - Phạm Đình Hải cho rằng sách triều Nguyễn không có Hoang ốc.
- **Nguồn cổ:** không tìm thấy. Câu Hán "一吉二宜三殺四如五福六荒" tìm không ra nguồn.

### 3.4 Tam tai

- **Các trang thống nhất bảng:**
  - Thân–Tý–Thìn gặp năm Dần, Mão, Thìn.
  - Dần–Ngọ–Tuất gặp năm Thân, Dậu, Tuất.
  - Hợi–Mão–Mùi gặp năm Tỵ, Ngọ, Mùi.
  - Tỵ–Dậu–Sửu gặp năm Hợi, Tý, Sửu.
  - Các trang đã đọc: nguoiquansat, mytour, thegioididong, vnreview, VTC.
- **Nhận xét của xemboi, không phải nguồn sách:** ba năm Tam tai đúng là ba vị Bệnh, Tử, Mộ của hành tam hợp, theo vòng Trường sinh. Ví dụ Thủy trường sinh ở Thân, nên Bệnh ở Dần, Tử ở Mão, Mộ ở Thìn. Ba nhóm còn lại cũng khớp. Có thể giải thích như vậy trên trang, ghi là "nhận xét".
- **Chỗ khác nhau:**
  - Năm nào nặng nhất. Thegioididong cho năm giữa nặng nhất. Các trang khác không thống nhất.
  - Gán mỗi năm với một loại họa (hỏa, thủy, phong), không có nguồn.
  - Bảng VTC 2026 ghi nhầm một nhóm là "Sửu–Tỵ–Dần". Theo bản tóm tắt WebFetch, VTC còn nói 2026 là năm **đầu** Tam tai của Hợi–Mão–Mùi. Theo bảng chung thì 2025 (Ất Tỵ) mới là năm đầu, 2026 (Bính Ngọ) là năm giữa. Cần mở lại trang VTC để kiểm.
  - Năm Tam tai tính từ Tết hay từ Lập xuân: **chưa thấy trang nào nói rõ**.
- **Nguồn cổ:** tìm toàn văn Hiệp kỷ và Ngọc hạp, rồi tìm thêm trên zh.wikisource, đều không ra 三災 theo cách tính này. Ngọc hạp ký chỉ có chữ "三災" trong bài ca nhị thập bát tú, nghĩa chung chung.

### 3.5 Năm tuổi

- Năm tuổi là năm có chi trùng với chi năm sinh. Khái niệm này không có chỗ nào để tranh cãi.
- Cách gọi "phạm Thái tuế" không khớp với sách. Trong Hiệp kỷ (quyển 3, mục 太歲), Thái tuế là thần **phương vị** của năm (kỵ hướng về).
- Ngọc hạp ký có quy tắc cấm cưới theo chi năm sinh, nhưng **không** đơn giản là "trùng chi".
- Trang `/xem-tuoi/nam-tuoi` có thể viết trung thực theo ba ý: (1) định nghĩa; (2) sách nói gì về Thái tuế, trích Hiệp kỷ quyển 3; (3) dân gian kiêng gì, theo tục truyền.

---

## 4. Kết luận: trang nào dựng được, trang nào cần người

### 4.1 Dựng được ngay, có nguồn trích được

1. **Phần phong tục** của `/lich-am/ngay-le/*`: Tết, rằm tháng Giêng (chỉ phần Thượng nguyên, ý nghĩa), Hàn thực, Thanh minh, Đoan ngọ, rằm tháng 7, Trung thu, ông Táo. Nguồn: Phan Kế Bính I.XII, II.X. Wikipedia làm nguồn phụ.
2. `/van-khan/ngay-gio`: nguồn *Gia lễ giản yếu* (mẫu văn khấn ngày giỗ, Lễ dỗ, Làm lễ) và Phan Kế Bính I.XI. Ghi rõ "bản văn của Dương Bá Trạc, 1932". Mâm cúng và bài khấn phổ biến hiện nay thì chỉ mô tả và dẫn link, không chép.
3. `/phong-tuc/cung-duong`: nguồn SuttaCentral bản Sujato (CC0), xemboi tự dịch. Wikipedia và Phan Kế Bính II.VI làm nguồn phụ. Nên có người am hiểu Phật học đọc lại.
4. `/phong-tuc/xin-xam`: chỉ mô tả phong tục và nêu quan điểm GHPGVN (TT Thích Trí Chơn trên Thanh Niên, 31/1/2025, trích ngắn). Nguồn: 佛學大辭典 觀音籤, Phan Kế Bính III.XXI (xin âm dương). **Không** đăng lời 100 quẻ.

### 4.2 Dựng được một phần

Phần nào có nguồn thì dựng, phần còn trống thì ghi rõ "chưa có văn bản".

5. `/van-khan/gia-tien`: mẫu "ngày tiết lệ" của Dương Bá Trạc, Phan Kế Bính I.IV. Văn khấn hằng ngày thì không có.
6. `/van-khan/cung-tuan-49-ngay`: mẫu văn khấn lễ tang của Dương Bá Trạc (có chú thích 100 ngày), Phan Kế Bính I.IX. Quan điểm Phật giáo chỉ dẫn link.
7. `/van-khan/tet`, `/van-khan/ong-cong-ong-tao`, `/van-khan/cung-chung-sinh`: phong tục, sự tích, *Văn tế thập loại chúng sinh* đều có. **Bài khấn** giao thừa, ông Táo, chúng sinh cần người viết.

### 4.3 Dựng được nếu anh chấp nhận cách trình bày "theo tục truyền, các cách tính song song"

8. `/xem-tuoi/kim-lau`, `/xem-tuoi/tam-tai`, `/xem-tuoi/hoang-oc`, `/xem-tuoi/nam-tuoi`, công cụ `/xem-tuoi/lam-nha`.
   - Engine tính 3–4 cách Kim lâu và 1 cách Hoang ốc. Tam tai theo bảng chung.
   - Mỗi cách ghi trang nào đang dùng. Trích Phan Kế Bính để chứng thực tục.
   - Ghi rõ "không tìm thấy quy tắc này trong Hiệp kỷ biện phương thư và Ngọc hạp ký". Phần này đã kiểm toàn văn.
   - Đây chính là câu hỏi ở `viec-can-anh.md` mục 15. Nếu anh đồng ý thì mục này dựng được ngay, không cần người viết.

### 4.4 Còn cần người soạn hoặc xin phép

Có 15 trang văn khấn: `mung-1-va-ngay-ram`, `than-tai-tho-dia` (Dương Bá Trạc chỉ có mẫu cho Thổ công), `ram-thang-gieng`, `ram-thang-7`, `ram-thang-8` (Dương Bá Trạc **bỏ** các tiết này), `bao-sai-ban-tho`, `an-vi-bat-huong`, `phong-sinh`, `le-chua`, `le-den-phu`, `nhap-trach`, `dong-tho`, `khai-truong`, `day-thang-thoi-noi`, `cung-xe-moi`.

Cùng với đó là **phần bài khấn** của `tet`, `ong-cong-ong-tao`, `cung-chung-sinh`.

**Ba hướng có thể đi:**
1. **Người soạn văn khấn mới** bằng tiếng Việt dễ hiểu, theo hướng Quách Trọng Trà và các chuyên gia "khấn mộc mạc". Người soạn đứng tên và chịu trách nhiệm. Trang ghi "bài do X soạn, tham khảo cấu trúc phổ biến".
2. **Xin phép** người giữ quyền sách *Văn khấn cổ truyền Việt Nam*. Cần luật sư tìm ra ai đang giữ quyền, vì NXB Văn hóa Thông tin không còn.
3. Với các trang Phật giáo (`phong-sinh`, `le-chua`, phần nghi thức của `cung-chung-sinh` và 49 ngày): xin văn bản nghi thức của **GHPGVN** hoặc một chùa cụ thể, kèm cho phép đăng.

**Việc nên làm tiếp:**
- Thêm các dòng nguồn vào `14-so-giay-phep.md`: Phan Kế Bính (đã có trong RAG), **Dương Bá Trạc *Gia lễ giản yếu*** (mới, chưa có trong RAG), *Văn tế thập loại chúng sinh*, SuttaCentral Sujato CC0, *Luật Đa dạng sinh học*.
- Thêm *Gia lễ giản yếu* vào `12-thu-vien-rag.csv` với mã WS mới, nhóm P Phong tục.

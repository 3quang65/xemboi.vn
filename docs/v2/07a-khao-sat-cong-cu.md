# 07a — Khảo sát công cụ, tính năng, cách kiếm tiền của đối thủ (Việt Nam và quốc tế)

> Ngày tra: **20/11/2026** (mọi link dưới đây đều tra ngày này, trừ khi ghi khác).
> Phục vụ: [`07-bach-khoa-huyen-hoc.md`](07-bach-khoa-huyen-hoc.md) và [`07b-phan-loai-huyen-hoc.md`](07b-phan-loai-huyen-hoc.md).
> Cơ sở trước đó: [`02-thi-truong.md`](02-thi-truong.md) (8 đối thủ), [`bang-chung/trich-dan-khach-hang.md`](bang-chung/trich-dan-khach-hang.md) (bảng giá App Store).

---

## 0. Phương pháp và giới hạn

- **Cách lấy dữ liệu:** WebFetch trang chủ (hoặc trang App Store). Yêu cầu trả **nguyên văn** tên menu, tên công cụ, giá và đơn vị. Tên công cụ trong ngoặc kép là nguyên văn.
- **Chỉ ghi cái thấy được.** Trang không ghi giá thì ghi "không thấy giá trên trang". Không suy đoán công cụ.
- **Giới hạn lớn:**
  1. Chỉ đọc trang chủ hoặc trang App Store. Không đăng nhập, không mua thử. Đầu vào/đầu ra chỉ ghi khi trang có form nhìn thấy được. Còn lại ghi `[CHƯA KIỂM]`.
  2. Nội dung do một mô hình nhỏ tóm tắt từ HTML. Có thể sót mục. Muốn chắc thì mở lại link bằng trình duyệt.
  3. Trang tải bằng JavaScript (Co–Star web, Click108, Google Play) chỉ trả về tiêu đề.
  4. Giá App Store là **giá niêm yết**, không phải doanh thu.
- **Kết quả truy cập:** thử **20 trang/app Việt** → đọc được **17**. Thử **15 trang/app quốc tế** → đọc được **13**, 1 trang chỉ có tiêu đề (Click108), 1 trang lỗi 403 (tarot.com). Hai link App Store cũ của Sanctuary và CHANI báo 404, đã đọc lại qua ID đúng.

### Không truy cập được (20/11/2026)

| Trang | Kết quả |
|:--|:--|
| [`ngaylanhthangtot.vn`](https://ngaylanhthangtot.vn/) | HTTP 404 (02 cũng ghi 404 cùng ngày) |
| [`xemvm.com`](https://xemvm.com/) | Không truy cập được: `ECONNREFUSED`. Chưa xác định "xemvm" trong đề bài là tên miền nào. WebSearch "xemvm" không ra trang nào trùng tên |
| [`ngaydep.com`](https://ngaydep.com/) | Không truy cập được: hết thời gian chờ 60 giây |
| [`tarot.com`](https://www.tarot.com/) | HTTP 403 |
| [`click108.com.tw`](https://www.click108.com.tw/) | Chỉ đọc được tiêu đề "科技紫微網：全球最大算命網站，張盛舒創辦". Không có menu, không có giá |
| [Sanctuary và CHANI qua link App Store cũ](https://apps.apple.com/us/app/sanctuary-astrology-tarot/id1434470960) | HTTP 404. Đã đọc lại qua ID đúng (xem mục 2) |

---

## 1. Đối thủ Việt Nam (17 trang/app đọc được)

Viết tắt dùng trong ma trận ở mục 3: chữ trong ngoặc vuông.

### 1.1. Lịch Ngày Tốt [LNT] — [lichngaytot.com](https://lichngaytot.com/)

| Mục | Nội dung (nguyên văn khi có ngoặc kép) |
|:--|:--|
| Menu chính | "Trang chủ", "Xem ngày", "Tử vi", "Bói vui", "Cung hoàng đạo", "Phong thủy", "Nhân tướng học", "Đạo và Đời", "Blog cuộc sống", "Thần số", "Phong tục", "Khác" |
| Xem ngày | "Lịch Ngày", "Lịch Tuần", "Lịch Tháng", "Lịch Năm 2026", "Lịch Âm", "Đổi lịch âm dương", "Chọn ngày tốt", "Xem ngày tốt cho việc", "Bao nhiêu ngày kể từ", "Còn bao nhiêu ngày nữa đến Tết Nguyên Đán 2026" |
| Tử vi | "Tử vi hàng ngày 12 con giáp", "Tử vi năm 2026", "Lấy Lá Số Tử Vi", "Vận trình năm", "Tử vi tháng", "Tử vi trọn đời", "Xem sao hạn", "Xông đất", "Tính tuổi theo năm sinh", "Kiến thức tử vi", "Con số may mắn", "Đặt tên cho con" |
| Bói vui | "Cân xương tính số", "Bói tình yêu", "Xem năm lấy chồng", "Sinh con theo ý muốn", "Sinh con hợp tuổi", "Xem tuổi xây nhà", "Tính trùng tang", "Xem bói ngày sinh, giờ sinh" |
| Cung hoàng đạo | "Tử vi hàng ngày 12 cung", "Tử vi hàng tuần", "Tử vi hàng tháng", "Tử vi năm 2026", "Tình yêu 12 cung hoàng đạo", "Trắc nghiệm tình yêu", "Mật ngữ 12 chòm sao" |
| Phong thủy | "Cầu tài lộc", "Tình yêu - hôn nhân", "Xem hướng nhà", "Vật phẩm phong thủy", "Chọn đất xem nhà", "Doanh nhân cần biết", "Phong thủy nhà ở, văn phòng", "Thước Lỗ Ban", "Xem phong thủy hàng ngày" |
| Nhân tướng | "Tướng khuôn mặt", "Tướng bàn tay", "Tướng nốt ruồi", "Tướng người tốt - xấu" |
| Khác | "Thần số": "Tra cứu Thần số học online". "Phong tục": "Phong tục ngày tết", "Cưới hỏi", "Xuất hành", "Khai trương", "Phong tục sinh con", "Tẩm liệm", "Chôn cất", "Xây dựng", "Giao dịch". "Khác": "Bói bài Tarot", "Danh ngôn", "Lời chúc", "Thời tiết", "VIDEO", "Văn khấn". Có mục "Giấc mơ" và "Tâm linh" |
| Đầu vào / đầu ra | `[CHƯA KIỂM]` từng công cụ. Chỉ thấy tên |
| Miễn phí / trả phí | Không thấy giá trên trang. Có nhãn "Xem Thần số học miễn phí". Có đăng nhập (email, Facebook, Google, Apple, Zalo) |
| Kiếm tiền | Quảng cáo hiển thị: 02 đã thấy mạng `Admicro_AdX`. Có link tải app. Có mục "Vật phẩm phong thủy" nhưng trang chủ không cho thấy bán |
| Bằng chứng thêm | Trang giấc mơ ghi số: "Dựa trên sổ mơ, nếu bạn nằm mơ thấy chó cắn thì hãy thử vận may của mình với những con số gợi ý dưới đây" kèm "29, 92, 93"… ([link](https://lichngaytot.com/giac-mo/mo-bi-cho-can-432-197610.html)). Có chuỗi bài theo tuổi "Xem sao hạn 2027 và sao chiếu mệnh nam mạng Ất Hợi"… với slug chứa "cach-dang-sao-giai-han" ([ví dụ](https://lichngaytot.com/xem-sao-han-2027-va-cach-dang-sao-giai-han-tuoi-at-hoi-nam-mang.html)) |
| Đáng học | Phủ rộng nhất. Một trang "Phong tục" theo từng việc đời người (cưới, sinh con, xây dựng, tang). Làm trang theo từng tuổi rất sớm (đã có 2027) |
| Cần tránh | Gợi ý cặp số hai chữ số sau giấc mơ (kiểu sổ mơ lô đề). Bài sao hạn dẫn tới cách dâng sao giải hạn. Footer ghi "Trang đang trong giai đoạn thử nghiệm chờ xin cấp phép". Tiêu đề giật (02 đã ghi) |

### 1.2. TuVi.vn [TVVN] — [tuvi.vn](https://tuvi.vn/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Trang chủ", "Lập lá số tử vi", "Xem tử vi", "Lịch vạn niên", "Gieo quẻ", "Xem bói", "Xem tuổi", "Xem ngày", "Phong thuỷ", "Khác" |
| Xem tử vi | "Tử vi 2026", "Tử vi hàng ngày", "Tử vi theo năm", "Tử vi trọn đời", "Tử vi 12 con giáp", "Lập lá số bát tự", "Cân xương tính số", "Thống kê cân xương" |
| Gieo quẻ | 16 loại xăm: "Quẻ xăm Tản Viên Sơn Thánh", "Quỷ Cốc Tử", "Diệu Cát Tường", "Khổng Minh", "Văn Vương", "Trạng Lường", "Tế Công", "Cửu Thiên Huyền Nữ", "Tả Quân", "Quan Thánh", "Ông Bổn", "Quan Âm Kim Tiền", "Hoàng Đại Tiên", "Bắc Đế", "Bà Chúa Xứ", "Quan Âm". Thêm "Quẻ kinh dịch", "Mai hoa dịch số" |
| Xem bói | "Bói tình yêu", "Bói kiều", "Bói Ai Cập", "Bói hắt xì hơi", "Bói nháy mắt", "Bói số may mắn", "Mở cửa đoán việc", "Bói bài", "Bói túi xách", "Bói vỏ ốc", các mục nốt ruồi |
| Xem tuổi | "Xem tuổi xông đất", "Xem tuổi vợ chồng", "Xem tuổi sinh con", "Xem tuổi kết hôn", "Xem tuổi hợp nhau", "Xem tuổi làm ăn", "Xem tuổi làm nhà" |
| Xem ngày | "Xem ngày tốt xấu", "Xem ngày kết hôn", "Xem ngày động thổ", "Xem ngày xuất hành", "Xem ngày nhập trạch", "Xem ngày mua xe", "Xem ngày an táng", 4 mục đếm ngày |
| Phong thủy | "Thước lỗ ban", "Xem hướng bàn thờ", "Xem hướng bếp nấu", "Xem hướng giường ngủ", "Xem hướng nhà" |
| Khác | "Tự học tử vi", "Thư viện tử vi", "Văn khấn", "Con số may mắn hôm nay", "Thần số học", "Xem tướng", "Hệ thống sao trong tử vi", "12 cung hoàng đạo", "Mệnh" |
| Đầu vào / đầu ra | Lập lá số: họ tên, ngày sinh, giờ sinh, giới tính, năm/tháng xem. Đầu ra: lá số. 02 ghi có chọn phái Tứ Hóa |
| Trả phí | Trang chủ không thấy giá. Trang Chợ Lá Số ghi nguyên văn: "Đăng lá số của bạn lên Chợ Lá Số để được các Thầy cao tay luận giải chỉ từ 50.000 đồng". Mở bình luận bằng Xu, trang không ghi tỷ lệ Xu ([link](https://tuvi.vn/li-giai-la-so-tu-vi-t763)) |
| Kiếm tiền | Banner ("Liên hệ đặt banner"), sàn thầy luận giải (Xu), "Hotline/Zalo hỗ trợ booking" |
| Đáng học | "Hệ thống sao trong tử vi", "Thư viện tử vi", "Tự học tử vi": đúng hướng từ điển. Cho chọn phái |
| Cần tránh | 16 loại xăm và hàng chục "bói vui" làm loãng. Chất lượng luận giải trên sàn phụ thuộc thầy (02) |

### 1.3. XemTuong.net [XT] — [xemtuong.net](https://xemtuong.net/) (chuyển hướng tới `chitay.xemtuong.net/home.php`)

| Mục | Nội dung |
|:--|:--|
| Menu | "Tướng Số", "Tử Vi-Tứ Trụ", "Xem Ngày", "Xem Tuổi-Xem Bói", "Gieo Quẻ", "Phong Thủy", "Bài Viết" |
| Tướng số | "Xem chỉ tay", "Xem chữ ký", "Xem Tướng Chữ", "Tướng đi", "Xem nốt ruồi", và các sách tướng: "Ma Y Thần Tướng", "Liễu Trang Thần Tướng"… |
| Tử vi – Tứ trụ | "Lá số tử vi & bình giải", "Lá số Quỷ Cốc Toán Mệnh", "Tử Vi Trọn Đời", "Ý nghĩa các sao", "Đặc tính các sao", "Xem Bát Tự - Tử Bình (mới)", "Sách Xưa Qúy Hiếm", "SÁCH NÓI", "Đặt tên con theo ngũ hành", "Chọn năm sinh con", "Chọn giờ tốt sinh mổ" |
| Xem ngày | "Xem Ngày Vạn Sự", "Xem giờ Tốt", "Xem Ngày Cưới Hỏi", "Xem ngày khai trương", "Xem ngày ký hợp đồng", "Xem ngày mua nhà", "Xem ngày xây nhà sửa nhà", "Xem ngày tốt mua xe", "Xem ngày chữa bệnh, đi thẩm mỹ", "Xem ngày nộp đơn nộp hồ sơ", "Xem ngày chôn cất ma chay", "Văn khấn có điền tên tuổi" |
| Xem tuổi – bói | "Coi tuổi kết hôn", "Xem tuổi vợ chồng", "Xem Sao Hạn năm Đinh Mùi 2027", "Xem tuổi xông nhà năm Đinh Mùi 2027", "Xem tuổi xây nhà", nhiều kiểu bói bài, "Bói Bài Tarot Hôm Nay", "Thần số học Bói tên", "Xem và chọn số đẹp" |
| Gieo quẻ | "Gieo Quẻ Dịch Số", "Bát Tự Hà Lạc", "Mai Hoa Dịch Số", "Lạc Việt Độn Toán", "Gieo Quẻ Họ Tên", "Quẻ Dịch Phục Hy", và 5 loại xăm |
| Phong thủy | "Bát Trạch Minh Cảnh", "Thước Lỗ Ban Đủ 3 Loại", "Chọn sơn nhà theo phong thủy", "Chọn hướng nhà", "La bàn phong thủy", sách "Địa lý toàn thư 1–3" |
| Đầu vào / đầu ra | Lá số tử vi, Tứ trụ, Bát Tự Hà Lạc: họ tên, ngày sinh, giờ sinh, giới tính. "VĂN KHẤN CHÍNH XÁC HỌ TÊN NGÀY CÚNG": họ tên người cúng, ngày sinh, địa chỉ, ngày cúng |
| Trả phí | "DỊCH VỤ TƯ VẤN TỨ TRỤ CHUYÊN SÂU - Có phí". Không thấy giá |
| Kiếm tiền | Trang tự ghi "Xemtuong.net phục vụ Quý vị HOÀN TOÀN MIỄN PHÍ!" và nguồn thu chủ yếu là quảng cáo. Có tư vấn tứ trụ có phí |
| Đáng học | Văn khấn tự điền tên – địa chỉ – ngày (cá nhân hóa rẻ, hữu ích). Kho sách cổ |
| Cần tránh | Hơn 150 mục, trùng lặp ("Nhân Tướng Hoc" và "Nhân Tướng Học"). "Chọn giờ tốt sinh mổ" và "Xem ngày chữa bệnh, đi thẩm mỹ" đụng y khoa |

### 1.4. Lịch Vạn Sự [LVS] — [lichvansu.wap.vn](https://lichvansu.wap.vn/)

| Mục | Nội dung |
|:--|:--|
| Menu | "LỊCH ÂM HÔM NAY", "ĐỔI NGÀY DƯƠNG - ÂM", "12 CON GIÁP", "LỊCH THÁNG", "LỊCH NĂM" (2025–2032) |
| Công cụ | "ĐỔI NGÀY DƯƠNG - ÂM". Trang chi tiết từng ngày ("Xem lịch âm ngày 1 tháng 11 năm 2026") |
| Trả phí | Không thấy |
| Kiếm tiền | Không thấy trên trang `[CHƯA KIỂM]` |
| Đáng học | Cấu trúc URL theo ngày – tháng – năm: mẫu trang sinh tự động cho SEO lịch |
| Cần tránh | Mỏng, chỉ có lịch |

### 1.5. Chợ Tử Vi [CTV] — [chotuvi.com](https://www.chotuvi.com/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Hỏi thầy", "Theo tuổi", "Hợp tuổi", "Lịch âm", "Xem ngày", "Cài app", nút "XEM TỬ VI" |
| Công cụ | "Lá số tử vi" (nút "Nhờ thầy lập lá số"), "Xem theo tuổi" ("Tử vi trọn đời", "Vận năm"), "Xem tuổi hợp" ("Vợ chồng, người yêu", "Làm ăn, hợp tác"), "Đổi lịch âm – dương", "Xem ngày tốt", "Xem tử vi hôm nay của 12 con giáp", "Tải ảnh lá số", "In / lưu PDF", "Nghe thầy đọc", "Sổ lá số trong máy này" |
| Hỏi thầy | Trang ghi lời đáp do "hệ thống tử vi tự động soạn" |
| Giá | "Lễ tùy tâm" hỏi thầy: **10.000đ = 4 câu, 20.000đ = 8 câu, 50.000đ = 20 câu**. Bản đầy đủ và "Thầy luận kỹ hai lá số" (khoảng 1.500 chữ): lễ tùy tâm, có ô "Hoặc tự nhập số tiền (đồng)". 02 đã ghi 5 nút 10k–200k cho bản đầy đủ |
| Thanh toán | "Gửi lễ qua VietQR", "Đặt lễ qua VietQR" |
| Đáng học | "Sổ lá số trong máy này" (không cần tài khoản). Tải ảnh, in PDF. Ngưỡng giá thấp |
| Cần tránh | Gọi thanh toán là "lễ" và người bán là "thầy" trong khi lời đáp do máy soạn. Mã cũ của xemboi chép từ trang này (01) |

### 1.6. Tra Cứu Tử Vi [TCTV] — [tracuutuvi.com](https://tracuutuvi.com/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Giới Thiệu" ("Gia Cát Trường Phong"), "Tra Cứu" ("Lập lá số tử vi", "Xem Tử Vi Trọn Đời"), "Xem Tuổi" ("Xem Tuổi Hợp Kết Hôn", "Xem Tuổi Sinh Con", "Xem Tuổi Vợ Chồng", "Xem Tuổi Làm Nhà"), "Thư khố" ("Cung Chức" 12 cung; "Sao": "Văn Tinh", "Hung Tinh", "Vũ Tinh", "Hào Hoa Tinh", "Đài Các Tinh", "Lộc Tinh", "Án Tinh") |
| Công cụ | Lập lá số: họ tên, giới tính, lịch dương/âm, giờ, phút, ngày, tháng, năm; nút "Tra Cứu Tử Vi". "Cân Lượng Chỉ" |
| Trả phí | "Báo Cáo Tra Cứu Tử Vi Trọn Đời dài 200 - 500 trang". Trang chủ không ghi giá. 02 thấy **680.000đ** (gạch 2.600.000đ) trên [trang trọn đời](https://tracuutuvi.com/tuvitrondoi) |
| Đáng học | "Thư khố" chia sao theo nhóm (Văn tinh, Hung tinh…): khung từ điển sao rõ. Có trang chính sách đầy đủ (bản quyền, cookies, bình luận) |
| Cần tránh | Gạch giá ảo, đếm ngược (02) |

### 1.7. Lý Số Việt Nam [LS] — [lyso.vn](https://lyso.vn/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Ứng dụng", "Lịch vạn sự", "Lá số Tử vi", "Lá số Tứ trụ", "Bát trạch", "Luận quẻ Dịch", "Nhịp Sinh học", "Diễn đàn", "Thư viện" |
| Thư viện | "Cơ bản", "Phong thủy", "Tử vi", "Tứ trụ", "Độn toán", "Sinh trắc" |
| Trả phí | Không ghi giá. Có link "Bảng giá dịch vụ tư vấn tại Lý số Hội quán" và "Tư vấn có ủng hộ phí để duy trì diễn đàn Lý số Việt Nam" |
| Kiếm tiền | Tư vấn người thật (giá `[CHƯA KIỂM]`) |
| Đáng học | Uy tín học thuật nhờ cộng đồng và diễn đàn (02). Tứ trụ và Bát trạch cùng một chỗ |
| Cần tránh | Giao diện cũ. "Nhịp Sinh học" là thuyết đã bị khoa học bác (xem 07b) |

### 1.8. Lịch Việt [LV] — web [lichviet.app](https://lichviet.app/) + app [App Store id585253443](https://apps.apple.com/vn/app/id585253443)

| Mục | Nội dung |
|:--|:--|
| Menu web | "LỊCH VẠN NIÊN", "XEM NGÀY TỐT", "TỬ VI", "ĐỔI NGÀY ÂM DƯƠNG", "PHONG THỦY", "THẦN SỐ HỌC", "TIỆN ÍCH HAY", "ỨNG DỤNG LỊCH VIỆT", nút "Nâng cấp Lịch Việt Pro" |
| Công cụ web | "Lịch âm dương", "Tính số ngày giữa hai ngày", "Tính tuổi chính xác", "Đếm ngược Tết", "Xem tử vi 12 con giáp", "Tử vi hôm nay", "Cung hoàng đạo hôm nay", "Sinh ngày bao nhiêu là cung gì", "Tra cứu thần số học", "Giải mã giấc mơ", "Văn khấn", "Lá số tử vi". Ngày tốt: "cưới hỏi", "mua xe", "mua nhà", "khai trương", "khởi công", "nhập trạch", "Ký hợp đồng", "Mua tài sản có giá trị" |
| Tính năng app | "Tra cứu Lịch Âm Dương 2026", "Phân tích ngày tốt theo từng cá nhân", "Xem tử vi 2026 đầy đủ", "Phong thủy nhà ở & cuộc sống" (đánh giá nhà, bàn làm việc, màu sơn hợp mệnh), "Thần số học – Giải mã con số cuộc đời", "Gieo quẻ Lục Hào – Hỏi việc linh ứng", "Chọn tên hay cho bé", "Quản lý & nhắc nhở sự kiện cá nhân" (giỗ, sinh nhật), gia phả, la bàn, thước Lỗ Ban, văn khấn, giải mã giấc mơ |
| Giá (App Store VN) | "Cơ bản, chu kì 7 ngày" 9.000đ; "Gói Bạc, chu kỳ 1 tháng" 39.000đ; "Gói nâng cao, chu kỳ 1 tháng" 39.000đ; "Chọn ngày tốt 7 ngày" 25.000đ; "Chọn ngày tốt 3 tháng" 135.000đ; "Chọn ngày tốt 1 năm" 280.000đ; "Gói Nâng Cao Trọn Đời" 390.000đ; "Giải mã ngày sinh 7 ngày" 30.000đ; "Bỏ quảng cáo 6 tháng" 29.000đ; "Bỏ quảng cáo 1 năm" 50.000đ |
| Quy mô | 4,6★ / khoảng 655 nghìn đánh giá (App Store). Mô tả tự ghi "Hơn 20 triệu lượt tải" |
| Kiếm tiền | Quảng cáo + gói Pro + bán lẻ "Chọn ngày tốt" theo thời hạn + bỏ quảng cáo |
| Bằng chứng thêm | Trang giấc mơ có mục "Những con số may mắn liên quan đến giấc mơ thấy tiền": "Mơ thấy tiền nói chung: số 11, 45"… ([link](https://lichviet.app/giai-ma-giac-mo-thay-tien)) |
| Đáng học | Bán **"Chọn ngày tốt" theo thời hạn**: mô hình thu tiền cho xem ngày đã có người làm. Nhắc giỗ, gia phả giữ người dùng quay lại |
| Cần tránh | Con số sau giấc mơ. Quảng cáo dày (03 chủ đề 2) |

### 1.9. Thái Âm – Vận Số Tử Vi 2027 [TA] — [App Store id1150954869](https://apps.apple.com/vn/app/id1150954869)

| Mục | Nội dung |
|:--|:--|
| Nhà phát triển | "Trung Bui". 4,6★ / 4,4k đánh giá |
| Tính năng | "Xem tử vi trọn đời", "Tử vi năm 2027 (Tiểu Vận)", "Tử vi tháng (Nguyệt Vận)", "Tử vi hàng ngày (Nhật Vận)", "Điểm huyền khí", "Chương trình giới thiệu bạn bè nhận thưởng", "Trải nghiệm linh hoạt" (2 cấp giải thích cơ bản – chuyên sâu) |
| Giá | "Khởi Đầu - Birthmonth Saleoff 50%" 49.000đ; "Gói Đồng" 60.000đ; "Khởi Đầu" 99.000đ; "Gói Bạc" 120.000đ; "Vận 2 năm" 199.000đ; "Gói Vàng" 240.000đ; "Mở Rộng" 249.000đ; "Trọn Đời Khuyến Mại 33%" 399.000đ; "Vận Trọn Đời" 549.000đ; "Trọn Đời" 599.000đ |
| Kiếm tiền | Bán lẻ gói luận giải, giới thiệu bạn bè |
| Đáng học | 2 cấp giải thích (cơ bản – chuyên sâu). Giảm giá tháng sinh |
| Cần tránh | Bị chê văn sơ sài "như AI" (03 `#14–#22`). "Điểm huyền khí" là chỉ số tự đặt, khó công bố căn cứ |

### 1.10. Xem Bói, Tướng Số, Tử Vi 2027 [XBTS] — [App Store id1218346752](https://apps.apple.com/vn/app/id1218346752)

| Mục | Nội dung |
|:--|:--|
| Nhà phát triển | "VU DUONG". 4,5★ / 8,3k đánh giá |
| Tính năng | Tướng số – chỉ tay: "Giải Mã Diện Tướng", "Luận Giải Thủ Vân", "Hợp Nhất Mệnh Vận", "Tương Hợp Nhân Tướng". Giải mộng: "Phân Tích Điềm Báo", **"Trích Xuất Lộc Số May Mắn"**, "Giải Mã Tiềm Thức", "Lời Khuyên Hóa Giải". Tử vi: "Lá Số Tử Vi Trọn Đời", "Tử Vi Chi Tiết 2027", "Tử Vi Hàng Ngày", "Xem Tuổi Xông Đất 2027". Bói toán: "Bói Bài Tarot & Bài Tây", "Gieo Quẻ Xin Xăm", "Thần Số Học (Numerology)". Tiện ích: "Thư Giãn Chữa Lành", "Kho Phong Thủy" |
| Giá | "Xem Boi - 5 Powers" 39.000đ; "Coi Bói, Xem Tử Vi, Gieo Quẻ" 79.000đ và 199.000đ; "Discount Weekly" 79.000đ; "Xem Boi - 50 Powers" 199.000đ; "Xem Bói, Coi Tử Vi Trọn Đời" 499.000đ |
| Kiếm tiền | Gói theo tuần, gói "Powers" (lượt dùng), trọn đời |
| Đáng học | Gói "lượt dùng" dễ hiểu |
| Cần tránh | "Trích Xuất Lộc Số May Mắn" ngay trong mục giải mộng. "Lời Khuyên Hóa Giải". Đọc ảnh khuôn mặt, bàn tay (dữ liệu sinh trắc) |

### 1.11. Vạn Niên Lịch [VNL] — [App Store id1616628435](https://apps.apple.com/vn/app/id1616628435)

| Mục | Nội dung |
|:--|:--|
| Nhà phát triển | "Nguyen Dinh Hung". 4,4★ / 120 đánh giá |
| Tính năng | "Xem lịch âm/dương, tiết khí, giờ hoàng đạo, tuổi xung khắc, sao chiếu mệnh, dự báo thời tiết"; "Lập lá số tử vi, tra cứu tử vi 12 con giáp, kiến thức phong thủy cùng nghi lễ và cúng lễ truyền thống"; "Chọn ngày cưới hỏi"; nhạc Phật giáo; ngày lễ |
| Premium | "Trắc nghiệm Phật pháp", "Luận giải lá số tử vi", "Xem ngày tốt", "Tắt toàn bộ quảng cáo", "Gợi ý văn khấn & ngày lễ theo thời điểm" |
| Giá | "Phiên bản Premium" 19.000đ; "Phiên bản Premium Yearly" 199.000đ |
| Đáng học | Văn khấn gợi ý theo thời điểm (đúng nhu cầu P3 `#34`) |
| Cần tránh | Ít đánh giá; gộp quá nhiều mảng (Phật pháp, hình nền) |

### 1.12. Phong Thủy Số [PTS] — [phongthuyso.vn](https://phongthuyso.vn/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Xem tuổi", "Tử vi", "Phong thuỷ", "Xem bói", "Xem ngày", "Giải mã giấc mơ" |
| Xem tuổi | "Xem tuổi làm nhà", "Xem tuổi vợ chồng", "Xem tuổi sinh con", "Xem tuổi làm ăn", "Xem tuổi hợp nhau", "Xem màu hợp tuổi", "Xem số hợp tuổi", "Xem sao hạn theo tuổi", "Xem cung mệnh theo tuổi", "Xem tuổi kết hôn theo năm sinh", "Xem tuổi xông đất 2025", "Xem tuổi mở hàng 2025", "Xem tuổi mua xe" |
| Phong thủy | "Xem hướng nhà", "Xem phong thủy sim số", "Xem hướng bàn làm việc", "Xem hướng bếp hợp tuổi", "Xem hướng phòng ngủ hợp tuổi", "Xem hướng nhà tắm hợp tuổi", "Thước lỗ bàn", "Xem hướng bàn thờ" |
| Xem bói | "Bói chỉ tay", "Ý nghĩa các con số", "Giải mã điềm báo", "Xin xăm Quan Thánh", "Xin xăm Tả Quân", "Quan Âm linh xám", "Gieo quẻ dịch số", "Bói kiều", "Bói Ai Cập"… |
| Xem ngày | 17 mục, gồm "Xem ngày hoàng đạo hắc đạo", "Xem ngày tốt đổ trần lợp mái", "Xem ngày tốt chuyển bàn thờ", "Xem ngày tốt nhận chức" |
| Trả phí | Không thấy giá, không thấy bán sim hay vật phẩm |
| Đáng học | Tách nhỏ "xem hướng" theo từng phòng. Xem ngày tách theo việc rất chi tiết |
| Cần tránh | Menu còn ghi năm cũ ("Tử vi 2024", "xông đất 2025") → trang theo năm phải có quy trình cập nhật |

### 1.13. Tử Vi Số Mệnh [TVSM] — [tuvisomenh.com.vn](https://tuvisomenh.com.vn/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Xem tử vi", "Xem tuổi", "Xem ngày tốt", "Xem bói", "Xem phong thuỷ", "Lịch vạn niên", "Blog tử vi", "Tra cứu tử vi" |
| Nhóm công cụ | "XEM TỬ VI", "XEM TUỔI", "XEM NGÀY", "XEM BÓI", "XIN XĂM", "GIEO QUẺ", "XEM PHONG THỦY", "LỊCH VẠN SỰ", "TỬ VI 12 CUNG HOÀNG ĐẠO", "TỬ VI 12 CON GIÁP", "TRA CỨU TỬ VI". Mô hình tóm tắt ghi khoảng 100 công cụ con; **chưa chép từng tên** `[CHƯA KIỂM]` |
| Trả phí | Không thấy giá. Chỉ kêu gọi "chia sẻ Link Web" để "ủng hộ chúng tôi" |

### 1.14. Lịch Vạn Niên 365 [LVN365] — [lichvannien365.com](https://lichvannien365.com/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Lịch", "Tử vi", "Phong thủy", "Bói vui", "12 cung hoàng đạo", "Nhân tướng học", "Thư viện" |
| Lịch | "Lịch âm 2026", "Lịch âm 2027", "Đổi lịch âm dương", "Xem ngày tốt xấu", "Xem ngày trùng tang", "Ngày lễ âm lịch Việt Nam", "Phong tục tập quán" |
| Tử vi | "Tử vi hàng ngày", "Tử vi tuần mới", "Tử vi tháng mới", "Vận hạn 2026", "Xông đất 2026", "Lá số tử vi", "Tử vi trọn đời" |
| Phong thủy | "Xem tuổi làm nhà", "Thước lỗ ban", "Xem tuổi", "Xem tuổi vợ chồng", "Sim phong thủy" |
| Bói vui | "Bói ngày sinh", "Bói bài", "Gieo quẻ, xin xăm", "Bói tên", "Bói tình yêu" |
| Thư viện | "Tâm linh huyền bí", "Phật pháp nhiệm màu", "Chuyện lạ" |
| Trả phí | Không thấy giá |
| Cần tránh | Mô hình tóm tắt ghi nhận **phần cuối trang có nhiều liên kết cờ bạc, cá cược, bóng đá không liên quan**. Em chưa kiểm bằng mắt `[CHƯA KIỂM]`. Nếu đúng, đây là ví dụ nội dung huyền học dính với cờ bạc mà xemboi phải tránh |

### 1.15. Thần Số Học của tôi [TSH] — [thansohoc.me](https://thansohoc.me/)

| Mục | Nội dung |
|:--|:--|
| Công cụ | Báo cáo thần số học. Đầu vào: họ tên, ngày sinh. Có "Hỏi trợ lý AI" trong báo cáo |
| Trả phí | Không thấy giá. Có "Nhắn Zalo", "Gọi điện" để liên hệ người gửi báo cáo |
| Đáng học | Một mảng, một công cụ, có AI hỏi đáp kèm báo cáo |
| Cần tránh | Không rõ ai đứng sau, không rõ giá trước khi để lại liên lạc |

### 1.16. Xem Lịch Âm [XLA] — [xemlicham.com](https://xemlicham.com/)

| Mục | Nội dung |
|:--|:--|
| Menu | "LỊCH ÂM HÔM NAY", "LỊCH ÂM 2027", "LỊCH THÁNG", "LỊCH NĂM" (2024–2035), "TIỆN ÍCH": "Xem ngày tốt theo việc", "Đếm ngược Tết 2027", "Đổi ngày dương sang âm", "Đổi ngày âm sang dương", "Các ngày kỵ" |
| Trả phí | Không. Trang ghi cung cấp thông tin "miễn phí cho người Việt Nam" |
| Đáng học | Đã có trang "Lịch âm 2027" và lịch năm đến 2035 |

### 1.17. Thiên Tuế [TT] — [thientue.vn](https://thientue.vn/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Tử vi hàng ngày", "Bói bài Tarot", "Bói bài Tây", "Tử vi 12 con giáp", "Tử vi 12 cung" |
| Nhóm công cụ | "Lịch âm dương", "Tử vi", "12 con giáp", "Cung hoàng đạo", "Xem tuổi", "Con số may mắn", "Thông tin năm", "Xem bói", "Thời gian", "Quy đổi đơn vị" |
| Công cụ tiêu biểu | "Con số may mắn hôm nay", "Gieo quẻ số may mắn hôm nay", "Quay số may mắn hôm nay", "Tra cứu Thần Số Học", "Xem bói số điện thoại", "Tra cứu hạn Tam Tai", "Tarot online" |
| Trả phí | Không thấy giá. Có bài "Lễ vật, văn khấn chuyển bàn thờ Thần Tài 2026" (nội dung thông tin) |
| Cần tránh | Ba công cụ "số may mắn" mỗi ngày: gần với chọn số xổ số/lô đề |

---

## 2. Quốc tế (13 trang/app đọc được)

### 2.1. Astrodienst — [astro.com/horoscopes](https://www.astro.com/horoscopes)

| Mục | Nội dung |
|:--|:--|
| Menu | "Horoscopes", "Astro Shop", "All about Astrology" |
| Miễn phí | "Chart drawing, Ascendant", "Extended Chart Selection", "Create an Ephemeris", "Personal Daily Horoscope", "Transits of the Year", "Psychological Horoscope", "Career and Vocation", "Relationship Horoscope", "Partner", "The Child's Horoscope", "AstroClick Travel", "Direct Atlas Query"… |
| Astro Shop | "Yearly Horoscope Analysis", "Long-Term Perspectives", "Personal Eclipse Report", "Psychological Horoscope Analysis", "Money and Success Horoscope", "Love Horoscope", "The Best Time (Electional Horoscope)", "PDF Chart Drawings", "Astrodienst Plus", "Swiss Ephemeris", "Horoscope for Two", "Youth Horoscope"… |
| Giá | Không thấy giá trên trang horoscopes và trang [Astro Shop](https://www.astro.com/cgi/aq.cgi?lang=e) `[CHƯA KIỂM]` |
| Kiếm tiền | Bán báo cáo PDF theo chủ đề, gói "Astrodienst Plus", cấp phép thư viện "Swiss Ephemeris" |
| Đáng học | **Bản đồ sao miễn phí rất chuẩn + báo cáo chủ đề trả phí.** Bán cả thư viện tính toán cho bên khác. "The Best Time (Electional Horoscope)" = xem ngày kiểu phương Tây |
| Cần tránh | Giao diện nặng chữ, khó với người mới |

### 2.2. Cafe Astrology — [cafeastrology.com](https://cafeastrology.com/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Home", "Shop", "Horoscopes", "Site Map". Site Menu: "Astrology Reports", "Birth Chart Interpretations", "Ask Annie", "Famous People", "Signs of the Zodiac", "Planets & Points", "Love Sign Compatibility", "Astrology Tools & Tables", "Astrology Reference", "Astrology Book Reviews", "Free Reports & Calculations" |
| Công cụ | Free natal chart report, compatibility report, "Free Numerology Reports", "Ascendant Calculator", "Venus Sign Table", "Mars Sign Table", "This Month's Ephemeris", "Love Compatibility Grid", "Ideal Lover Selector", "Love Oracle" |
| Trả phí | "Time Line Forecast", "Year of Transits", "Personalized Horoscope Report Package". Không thấy giá |
| Đáng học | **Mô hình bách khoa gần nhất với ý anh Cường:** từ điển ("Planets & Points", "Astrology Reference"), bảng tra ("Venus Sign Table"), người nổi tiếng, review sách, công cụ miễn phí → báo cáo trả phí |
| Cần tránh | Không có |

### 2.3. Co–Star — [App Store id1264782561](https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561) (web [costarastrology.com](https://www.costarastrology.com/) chỉ đọc được tiêu đề)

| Mục | Nội dung |
|:--|:--|
| Quy mô | 4,8★ / 206K đánh giá |
| Miễn phí | "Add friends to compare natal charts and see your compatibility.", "Read personalized daily horoscopes.", "Receive daily push notifications…", "Learn how to read your entire birth chart." |
| Premium | "Ask the stars & get answers…", "See the full natal chart of somebody who doesn't have the app.", báo cáo tình yêu, "Eros" cho cặp đôi |
| Giá (USD) | "Pro-Star monthly" $8.99; "Eros" $6.99; "5 Questions" $2.99; "10 Questions" $4.99; "25 Questions" $6.99; "Crush Report - 5" $4.99; "Your Year Ahead" $11.99; "Advanced Chart - Self" $8.99; "Advanced Chart - Relationships" $8.99; "Add Manually" $2.99 |
| Đáng học | Bán **gói câu hỏi** (giống Chợ Tử Vi), **"Your Year Ahead"** (giống Gói 1 của 04), so hợp với bạn bè làm vòng lan truyền |
| Cần tránh | Văn ngắn, gắt, đôi khi gây lo (đẩy thông báo hằng ngày) `[SUY LUẬN]` |

### 2.4. The Pattern — [App Store id1071085727](https://apps.apple.com/us/app/the-pattern/id1071085727)

| Mục | Nội dung |
|:--|:--|
| Quy mô | 4,0★ / 16K đánh giá |
| Tính năng | "In-Depth conversation feature", "Your Pattern", "Your Transits", "Bonds", "Romantic Patterns", "Friendship Patterns", "Discover Collections", "Cosmic Climate", "Custom Friends", "Connect" |
| Giá (USD) | "Go Deeper+ Monthly" $14.99; "Go Deeper+ Quarterly" $29.99; "Go Deeper+ Annual" $83.99; "3 Custom Profile Slots" $9.99; "10 Custom Profile Slots" $16.99; "20 Custom Profile Slots" $19.99; "Connect+ Quarterly" $24.99; "Super Connect - 3 pack" $8.99 |
| Đáng học | **Bán thêm "hồ sơ người khác"** (ô hồ sơ). Ngôn ngữ tâm lý, không dùng thuật ngữ |
| Cần tránh | Thuê bao tự gia hạn (04 đã quyết không dùng) |

### 2.5. Labyrinthos — [labyrinthos.co](https://labyrinthos.co/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Shop", "App", "Learn", "Blog". Learn: "Tarot Meanings List", "Lenormand Meanings List", "Tarot Spreads", "Astrology", "Rune Meanings" |
| Miễn phí | "Free Online Tarot Readings", app học tarot miễn phí, email 3 phần (Keywords, Suit Correspondences, Numerology Basics), "Calculate Your Tarot Birth Cards" |
| Bán (USD) | "Tarot of the Velvet Moon" $47; "Golden Thread Tarot Deck" $55; "Seventh Sphere Astrology Oracle" $45; "Tarot Journal and Workbook" $55 (hết hàng); "Arcana Iris Sacra Tarot Deck" $55; "Seventh Sphere Lenormand Deck" $45 |
| Đáng học | **Từ điển nghĩa lá bài + học miễn phí → bán sản phẩm vật lý tự thiết kế** (bộ bài là sản phẩm văn hóa, không gắn "trừ tà") |
| Cần tránh | Không có |

### 2.6. Numerology.com — [numerology.com](https://www.numerology.com/)

| Mục | Nội dung |
|:--|:--|
| Menu | "Your Daily Number", "About Numerology", "Your Numerology Chart", "Numerology Readings", "Numerology Forecasts" |
| Công cụ | "Life Path Number Calculator", "Life Path Number Meanings", "Your Core Numbers", "Your Birth Day Number", "Your Expression Number", "Your Name Numerology" |
| Trả phí | "Deluxe Numerology Report", "Personality Decoder", "Annual Numerology Forecast", "Your Monthly Numerology Report", "Your Numerology Reading for 2026". Không thấy giá |
| Đáng học | Máy tính miễn phí + trang nghĩa từng số → báo cáo năm |
| Cần tránh | "Get your FREE Daily Number every day when you sign up!" (đổi email lấy số hằng ngày) |

### 2.7. Sanctuary — [App Store id1417411962](https://apps.apple.com/us/app/id1417411962)

| Mục | Nội dung |
|:--|:--|
| Quy mô | 4,8★ / 44K đánh giá |
| Tính năng | "DAILY HOROSCOPES AND TAROT", "ONE-ON-ONE READINGS & PERSONALIZED INSIGHTS", "INTERACTIVE BIRTH CHART", "COMPATIBILITY CALCULATOR". "24/7 reader availability… through text chat or voice call." |
| Giá (USD) | "Sanctuary+ Monthly" $9.99 và $14.99; "Sanctuary+ Three Months" $29.99; "Sanctuary+ Annual" $49.99 và $69.99; "Sanctuary+ Reading Monthly" $49.99; "Sanctuary+ Premium Reading Monthly" $99.99; "Sanctuary+ Lifetime" $499.99; "Astrology Intro Reading" $4.99; "Tarot Intro Reading" $4.99 |
| Đáng học | Có người thật đứng tên (03 chủ đề 5: tin hơn khi có người thật) |
| Cần tránh | Tư vấn 24/7 theo phút: chất lượng khó kiểm, rủi ro lợi dụng lo âu |

### 2.8. CHANI — [App Store id1532791252](https://apps.apple.com/us/app/-/id1532791252)

| Mục | Nội dung |
|:--|:--|
| Quy mô | 4,9★ / 61K đánh giá |
| Giá (USD) | "Monthly Subscription" $11.99; "Annual Subscription" $107.99 |
| Ghi chú | Trang App Store không tách tính năng miễn phí/trả phí. Theo kết quả tìm kiếm, nhà phát triển ghi nội dung do Chani Nicholas và nhóm chiêm tinh viên viết `[CHƯA KIỂM nguyên văn]` |
| Đáng học | **Tác giả người thật đứng tên toàn bộ nội dung** → đúng tinh thần E-E-A-T. Điểm đánh giá cao nhất nhóm |

### 2.9. Nebula — [App Store id1459969523](https://apps.apple.com/us/app/id1459969523)

| Mục | Nội dung |
|:--|:--|
| Quy mô | 4,6★ / 171K đánh giá |
| Tính năng | "Birth chart reader tool…", "Zodiac compatibility calculator…", "Daily horoscope…", "Tarot card readings", "Palm readings to explore palmistry and hand lines on your hand", "Live psychic chat to connect with psychic advisors anytime." |
| Giá (USD) | "Premium subscription" $2.99 / $7.99 / $29.99 / $39.99 / $49.99; "$9.99 Chat Balance" $9.99; "Daily secrets from birth chart" $7.99; "Premium Relationship Check-In" $4.99 |
| Cần tránh | Nạp ví chat với "psychic". Đọc chỉ tay qua ảnh. Nhiều mức thuê bao khó hiểu |

### 2.10. 测测 Cece — [cece.com](https://www.cece.com/)

| Mục | Nội dung |
|:--|:--|
| Menu | "产品介绍": "测测", "测测心理师", "快乐测测". "合作共建": "测测心理开放平台", "心理咨询师", "心理科研工作者", "AI工程师" |
| Đặc điểm sản phẩm | "3d心理沙盘" (sa bàn tâm lý 3D), "测试" (trắc nghiệm), "心理" (tâm lý), "冥想" (thiền), "社区" (cộng đồng), "连麦" (gọi thoại), "小测ai" |
| Giá | Không thấy |
| Đáng học | **Chuyển định vị sang tâm lý – cộng đồng**, tuyển cả nhà nghiên cứu tâm lý. Trang chủ công ty không còn nêu tử vi hay tarot |

### 2.11. 问真八字 Wenzhen — [App Store id1665624645](https://apps.apple.com/us/app/id1665624645)

| Mục | Nội dung |
|:--|:--|
| Nhà phát triển | "Guangzhou Wenzhen Cultural Communication Co., Ltd.". 4,2★ / 88 đánh giá (cửa hàng US) |
| Tính năng | "【首创五柱排盘】", "【专业排盘】", "【易学题库】" (ngân hàng câu hỏi Dịch học), "【学堂】" (lớp học), "【名人八字库】" (kho bát tự người nổi tiếng), "【智能古籍辅助】" (tra sách cổ), "【AI学习助手】", "【八字合盘】" (hợp hai bát tự), "【研究笔记】" (ghi chú nghiên cứu) |
| Giá (USD) | "3个月黄金体验会员" $14.99; "1年黄金会员" $39.99; "5年钻石会员" $129.99 |
| Đáng học | **Phục vụ người học (P2):** kho người nổi tiếng, tra sách cổ, ghi chú, câu hỏi luyện. Hội viên nhiều năm |
| Ghi chú | Có nhiều app trùng tên "问真八字" của nhà phát triển khác (kết quả WebSearch). Bảng trên chỉ cho id1665624645 |

### 2.12. Linghit 靈機 — [Google Play `oms.mmc.fortunetelling_gm2`](https://play.google.com/store/apps/details?id=oms.mmc.fortunetelling_gm2&hl=en) + app "灵机八字" [App Store id1439304528](https://apps.apple.com/us/app/id1439304528)

| Mục | Nội dung |
|:--|:--|
| Google Play | Chỉ đọc được tiêu đề: "靈機-姻緣和合符 開光靈符 算命占卜 求籤祈福" (bùa hòa hợp nhân duyên, linh phù khai quang, xem mệnh, xin xăm cầu phúc) |
| 灵机八字 (dev "Nanyang Qingwei Network") | Mô-đun: "【新年祈福】", "【个人运程】", "【周易占卜】", "【生肖运程】", "【称骨算命】", "【前世姻缘】", "【择吉通胜】". 4,8★ / 49 đánh giá. **Chưa xác minh app này cùng chủ với Linghit** `[CHƯA KIỂM]` |
| Giá 灵机八字 (USD) | "合婚-看两个人的匹配指数" $10.99; "充值获得600福币" $0.99 … "充值获得38800福币" $48.99; "许愿树还愿,随喜功德-6元" $0.99; "健康许愿牌_高级" $4.99; "学业有成许愿牌" $2.99; "爱情许愿牌_高级" $4.99 |
| Đáng học | "合婚" (hợp hôn) bán lẻ một lần. "择吉通胜" (chọn ngày theo Thông Thắng) |
| **Cần tránh** | **Bán bùa, linh phù khai quang, thẻ ước nguyện, công đức, tiền ảo "福币"** — đúng thứ 04 mục 3.4 cấm |

### 2.13. myBodyGraph (Human Design) — [mybodygraph.com](https://www.mybodygraph.com/) + [/pricing](https://www.mybodygraph.com/pricing)

| Mục | Nội dung |
|:--|:--|
| Menu | "Pricing", "Blog", "About" ("About myBodyGraph", "About Ra Uru Hu", "About Human Design") |
| Miễn phí | "Create Your Free Chart". Tài khoản miễn phí: tạo biểu đồ không giới hạn, thư viện hơn 40.000 biểu đồ người nổi tiếng, "Ra's Human Design dictionary" |
| Giá (ký hiệu "$", trang không ghi mã tiền) | Mở khóa một biểu đồ: "Foundational" $49, "Partnership" $49, "Advanced" $99, "Personal Success" $129. Gói năm: "Core" $349/year, "Connect" $499/year, "Holistic" $699/year, "Pro" $1,199/year. "Transit Tools" $59/year |
| Đáng học | Biểu đồ miễn phí + từ điển + kho người nổi tiếng → báo cáo trả phí giá cao |
| Cần tránh | Hệ thống gắn với một tổ chức và người sáng lập; quyền tên gọi, thuật ngữ `[CHƯA KIỂM]` |

---

## 3. Ma trận công cụ × đối thủ Việt (17 trang/app)

Ký hiệu: ✓ = thấy tên công cụ/mục trên trang. ~ = chỉ thấy tên nhóm hoặc tên gần đúng. Trống = không thấy (không có nghĩa là chắc chắn không có).

| Công cụ | LNT | TVVN | XT | LVS | CTV | TCTV | LS | LV | TA | XBTS | VNL | PTS | TVSM | LVN365 | TSH | XLA | TT | **Số ✓ (+~)** |
|:--|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Lịch âm, đổi ngày âm–dương | ✓ | ✓ |  | ✓ | ✓ |  | ✓ | ✓ |  |  | ✓ |  | ✓ | ✓ |  | ✓ | ✓ | **11** |
| Lá số tử vi | ✓ | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~ | ✓ |  |  |  | **12 (+1)** |
| Tử vi 12 con giáp ngày/năm | ✓ | ✓ | ✓ | ✓ | ✓ |  |  | ✓ |  | ✓ | ✓ | ✓ | ✓ | ✓ |  |  | ✓ | **12** |
| Xem ngày tốt theo việc | ✓ | ✓ | ✓ |  | ✓ |  | ~ | ✓ |  |  | ✓ | ✓ | ✓ | ✓ |  | ✓ |  | **10 (+1)** |
| Tử vi trọn đời theo tuổi | ✓ | ✓ | ✓ |  | ✓ | ✓ |  |  | ✓ | ✓ |  | ✓ |  | ✓ |  |  |  | **9** |
| Hướng nhà / Bát trạch | ✓ | ✓ | ✓ |  |  |  | ✓ | ✓ |  |  |  | ✓ | ~ |  |  |  |  | **6 (+1)** |
| Thần số học | ✓ | ✓ | ✓ |  |  |  |  | ✓ |  | ✓ |  |  |  |  | ✓ |  | ✓ | **7** |
| Xem tuổi vợ chồng / kết hôn | ~ | ✓ | ✓ |  | ✓ | ✓ |  |  |  |  |  | ✓ | ~ | ✓ |  |  | ~ | **6 (+3)** |
| Gieo quẻ Kinh Dịch / Lục hào / Mai hoa | | ✓ | ✓ |  |  |  | ✓ | ✓ |  | ~ |  | ✓ | ✓ | ~ |  |  |  | **6 (+2)** |
| Xin xăm | | ✓ | ✓ |  |  |  |  |  |  | ✓ |  | ✓ | ✓ | ✓ |  |  |  | **6** |
| Nhân tướng / chỉ tay / nốt ruồi | ✓ | ✓ | ✓ |  |  |  |  |  |  | ✓ |  | ✓ |  | ✓ |  |  |  | **6** |
| Cung hoàng đạo | ✓ | ✓ |  |  |  |  |  | ✓ |  |  |  |  | ✓ | ✓ |  |  | ✓ | **6** |
| Xem sao hạn / Tam tai / vận hạn | ✓ |  | ✓ |  |  |  |  |  |  |  | ✓ | ✓ |  | ✓ |  |  | ✓ | **6** |
| Xông đất | ✓ | ✓ | ✓ |  |  |  |  |  |  | ✓ |  | ✓ |  | ✓ |  |  |  | **6** |
| Xem tuổi làm nhà | ✓ | ✓ | ✓ |  |  | ✓ |  |  |  |  |  | ✓ |  | ✓ |  |  |  | **6** |
| Thước Lỗ Ban | ✓ | ✓ | ✓ |  |  |  |  | ✓ |  |  |  | ✓ |  | ✓ |  |  |  | **6** |
| Bói vui (bài Tây, hắt xì, bói Kiều…) | ✓ | ✓ | ✓ |  |  |  |  |  |  |  |  | ✓ |  | ✓ |  |  | ✓ | **6** |
| Xem tuổi sinh con | ✓ | ✓ | ✓ |  |  | ✓ |  |  |  |  |  | ✓ |  |  |  |  |  | **5** |
| Văn khấn | ✓ | ✓ | ✓ |  |  |  |  | ✓ |  |  | ✓ |  |  |  |  |  | ~ | **5 (+1)** |
| Từ điển sao / thư viện tử vi | ✓ | ✓ | ✓ |  |  | ✓ | ✓ |  |  |  |  |  |  |  |  |  |  | **5** |
| Tiện ích đếm ngày / đếm ngược Tết | ✓ | ✓ |  |  |  |  |  | ✓ |  |  |  |  |  |  |  | ✓ | ✓ | **5** |
| Giải mộng / giấc mơ | ✓ |  |  |  |  |  |  | ✓ |  | ✓ |  | ✓ |  |  |  |  |  | **4** |
| Tarot | ✓ |  | ✓ |  |  |  |  |  |  | ✓ |  |  |  |  |  |  | ✓ | **4** |
| Màu / số hợp mệnh, "con số may mắn" | ✓ | ✓ |  |  |  |  |  | ✓ |  |  |  | ✓ |  |  |  |  | ✓ | **5** |
| Sim / số điện thoại phong thủy | |  | ✓ |  |  |  |  |  |  |  |  | ✓ |  | ✓ |  |  | ✓ | **4** |
| Bát tự / Tứ trụ | | ✓ | ✓ |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  | **3** |
| Cân xương tính số / cân lượng chỉ | ✓ | ✓ |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  |  | **3** |
| Đặt tên con | ✓ |  | ✓ |  |  |  |  | ✓ |  |  |  |  |  |  |  |  |  | **3** |
| Xem tuổi làm ăn / hợp tác | |  ✓ |  |  | ✓ |  |  |  |  |  |  | ✓ |  |  |  |  |  | **3** |
| Phong tục (cưới, Tết, tang) | ✓ |  |  |  |  |  |  |  |  |  | ✓ |  |  | ✓ |  |  |  | **3** |
| Phật pháp / Đạo | ✓ |  |  |  |  |  |  |  |  |  | ✓ |  |  | ✓ |  |  |  | **3** |
| Tư vấn người thật (có phí) | | ✓ | ✓ |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  | **3** |
| Hỏi đáp tự động / AI | |  |  |  | ✓ |  |  |  |  |  |  |  |  |  | ✓ |  |  | **2** |
| Tính trùng tang | ✓ |  |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  |  | **2** |
| Nhắc giỗ / gia phả | |  |  |  |  |  |  | ✓ |  |  | ✓ |  |  |  |  |  |  | **2** |
| Hợp hai lá số tử vi | |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  | **1** |
| Nhịp sinh học | |  |  |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  | **1** |
| Chọn giờ sinh mổ | |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  | **1** |
| 24 tiết khí (trang riêng) | |  |  |  |  |  |  |  |  |  | ~ |  |  |  |  |  |  | **0 (+1)** |
| Human Design | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | **0** |

**Đọc nhanh:** nhóm "lịch – lá số – con giáp – xem ngày" có ở 10–12/17 trang. Đây là mặt bằng chung, không phải điểm khác biệt. "Từ điển có nguồn" chỉ 5/17 trang có dạng thư viện, và **không trang nào ghi nguồn sách cho từng mục** trên trang chủ `[CHƯA KIỂM từng trang con]`.

---

## 4. Cách kiếm tiền quan sát được

| Cách | Trang Việt | Trang quốc tế | Hợp định vị 04? |
|:--|:--|:--|:--|
| Quảng cáo hiển thị | LNT (Admicro_AdX, theo 02), XT (tự ghi), TVVN (đặt banner), LV, VNL (có gói tắt quảng cáo) | — | Rủi ro: mạng quảng cáo có thể chèn lễ, vật phẩm, cờ bạc. P3 ghét quảng cáo (03 `#36, #41`) |
| Bán lẻ báo cáo một lần | TCTV (680k), TA (49k–599k), XBTS (39k–499k) | Astro.com, Cafe Astrology, Co–Star ("Your Year Ahead" $11.99), myBodyGraph ($49–$129), Linghit "合婚" $10.99 | **Hợp** (04 mục 3.3) |
| Gói câu hỏi / lượt dùng | CTV (10k = 4 câu), XBTS ("5 Powers") | Co–Star (5/10/25 Questions) | Hợp, đã có trong Gói 2 |
| Bán theo thời hạn cho một công cụ | LV ("Chọn ngày tốt" 7 ngày 25k / 3 tháng 135k / 1 năm 280k) | — | Hợp nếu trả một lần, không tự gia hạn |
| Thuê bao tháng/năm | LV (39k/tháng), VNL (199k/năm) | Co–Star $8.99/tháng, Pattern $14.99/tháng, CHANI $11.99/tháng, Sanctuary $9.99–$14.99/tháng, 问真八字 $39.99/năm | 04 chọn không tự gia hạn (VietQR). Chỉ cân nhắc "gói năm trả một lần" |
| Bán thêm hồ sơ người khác | — | Pattern (3/10/20 ô hồ sơ), Co–Star ("Add Manually" $2.99) | Hợp, gần Gói 3 |
| Tư vấn người thật | TVVN (từ 50k), XT, LS | Sanctuary (đến $99.99/tháng), Nebula (ví chat) | **Hoãn**: khó kiểm soát hù dọa |
| "Lễ tùy tâm" | CTV | — | Không dùng chữ "lễ" (gần với lễ cúng) |
| Bùa, linh phù, thẻ ước, công đức | — | Linghit / 灵机八字 | **Cấm** (04 mục 3.4) |
| Bán sản phẩm vật lý văn hóa | — | Labyrinthos (bộ bài $45–$55) | Có thể xét sau 2027 nếu không gắn "đổi vận" |
| Cấp phép thư viện tính toán | — | Astrodienst ("Swiss Ephemeris") | Ý tưởng dài hạn (API lịch âm) |

---

## 5. Mười bài học rút ra

1. **Mặt bằng chung không phải lợi thế.** Lịch, lá số, con giáp, xem ngày có ở 10–12/17 trang Việt. Xemboi phải làm các mục này vì người dùng mong có, nhưng thắng bằng **nguồn + nhiều trường phái + không hù dọa**, không bằng số lượng công cụ.
2. **Không trang Việt nào làm "bách khoa có nguồn".** Thư viện sao của TVVN, XT, TCTV, LS là bài viết. Trang chủ không thấy ghi sách nguồn hay người duyệt `[CHƯA KIỂM trang con]`. Cafe Astrology và CHANI cho thấy mô hình này có ở quốc tế.
3. **Trang theo tuổi, theo năm là cỗ máy SEO của đối thủ.** LNT đã có "Xem sao hạn 2027" cho từng tuổi, từng giới. XLA, LVN365 có "Lịch âm 2027". Xemboi đi sau một năm. Mục tiêu hợp lý là mùa Tết 2028 (04 mục 5.1 đã nói SEO không kịp Tết 2027).
4. **Giải mộng ở Việt Nam gắn với cặp số hai chữ số.** Thấy trên LNT, LV, XBTS ("Trích Xuất Lộc Số May Mắn"). Đây là vùng xám cờ bạc → loại (07b).
5. **Sao hạn dẫn tới dâng sao giải hạn.** LNT ghép "xem sao hạn" với "cách dâng sao giải hạn" ngay trong slug. Trái 04.
6. **Bán "chọn ngày" có người trả.** Lịch Việt niêm yết 25k–280k. Đây là ứng viên kiếm tiền thứ hai sau tử vi, khớp P4 của 03.
7. **"Gói câu hỏi" và "thêm hồ sơ người khác" là hai cách tăng giá trị đơn phổ biến** ở cả Việt (CTV) lẫn Mỹ (Co–Star, Pattern).
8. **Người thật đứng tên tạo tin.** CHANI (4,9★) ghi tác giả. Sanctuary, Nebula bán người thật nhưng theo phút, dễ lạm dụng. Xemboi chọn "người thật đứng tên biên tập", không bán tư vấn theo phút.
9. **Phục vụ người học là một ngách.** 问真八字 có kho người nổi tiếng, sách cổ, ghi chú, câu hỏi luyện. Khớp P2 "Tuấn".
10. **Cảnh báo về thứ cần tránh đã có tên cụ thể:** bùa và công đức (Linghit), liên kết cờ bạc ở chân trang (LVN365, `[CHƯA KIỂM bằng mắt]`), "lễ tùy tâm" cho lời đáp máy soạn (CTV), gạch giá ảo (TCTV), giờ sinh mổ (XT).

---

## 6. Việc còn treo

- Mở lại bằng trình duyệt: `tuvisomenh.com.vn` (chép đủ khoảng 100 công cụ), `click108.com.tw`, `tarot.com`, `ngaydep.com`, chân trang `lichvannien365.com`.
- Xác định "xemvm" là trang nào (hỏi anh Cường).
- Giá trên Astro Shop và Cafe Astrology (không hiện trên trang chủ).
- Search volume và Google Trends: vẫn `[CHƯA KIỂM]` như 02 (Google Trends trả 429).

# Khảo sát công cụ lập lá số Bát Tự trên thị trường

Ngày khảo sát: 24/11/2026. Trình duyệt trong app, desktop khoảng 800–1024px và di động 375px.
Không đăng ký, không nhập email, không trả tiền. Cookie: chọn "Decline All" nếu trang có nút đó. mingli.ru chỉ có nút "Согласен" nên để nguyên, không bấm.

## Ca mẫu và đáp án đối chiếu

Ca mẫu: nữ, dương lịch 01/06/1990 08:30, giờ Việt Nam UTC+7.

Đáp án theo engine xemboi:

- Tứ trụ: năm **Canh Ngọ**, tháng **Tân Tỵ**, ngày **Đinh Dậu**, giờ **Giáp Thìn**. Nhật chủ Đinh Hỏa.
- Đếm 8 chữ: Kim 3, Hỏa 3, Mộc 1, Thổ 1, Thủy 0.
- Đại vận: nữ, năm dương nên đi nghịch. Khởi vận lúc 8 tuổi 9 tháng. Các vận: Canh Thìn, Kỷ Mão, Mậu Dần (đang chạy năm 2026)…

## Tóm tắt kết quả trụ

| Công cụ | Năm | Tháng | Ngày | Giờ | Khớp? | Khởi vận / Mậu Dần |
|---|---|---|---|---|---|---|
| mingli.ru (Nga) | 庚午 | 辛巳 | 丁酉 | 甲辰 | Khớp | 9 tuổi (1999); Mậu Dần 2019 |
| china95.net 元亨利贞, nhập **09:30 Bắc Kinh, chế độ thường** | 庚午 | 辛巳 | 丁酉 | **乙巳** | **LỆCH giờ** | 8n9th4ng14h, giao vận 05/03/1999 23h |
| china95.net, nhập 09:30 + **真太阳时 kinh độ 105°51'** | 庚午 | 辛巳 | 丁酉 | 甲辰 | Khớp | 8n8th29ng22h, giao vận 03/03/1999 06h |
| tuvi.vn (Việt) | Canh Ngọ | Tân Tỵ | Đinh Dậu | Giáp Thìn | Khớp | Ghi "03/03/1999 (8 tuổi)", nhưng bảng đại vận lại ghi 1998, 8–17t (**mâu thuẫn**) |
| bazi-calculator.com/vi (Ba Lan, có bản Việt) | Canh | Tân Tị | Đinh Dậu | Giáp Thìn | Khớp | **05/11/1998** (~8 tuổi 5 tháng), **lệch** khoảng 4 tháng |
| miniwebtool.com/vi | 庚午 | 辛巳 | 丁酉 | 甲辰 | Khớp | 8 tuổi 9 tháng (26,29 ngày tới Lập hạ), 1999–2008; Mậu Dần 2019–2028 "📍 Hiện tại" |
| masterseanchan.com/vi (Singapore) | 庚午 | 辛巳 | 丁酉 | 甲辰 | Khớp (giờ mặt trời 08:36) | 9 / 1999–2008; Mậu Dần "29 · NAY" |

Không mở được hoặc không dùng được:

- buyiju.com (卜易居) và bazi.run: trình duyệt từ chối điều hướng.
- 问真八字 / 测测: chỉ có app, không có web.
- lichngaytot.com, lichvansu.wap.vn, tracuutuvi.com: không tìm thấy công cụ bát tự, chỉ có tử vi.
- chinesefortunecalendar.com: chỉ có "Five Pillars and Ten Characters", một biến thể không chuẩn, nên bỏ qua.

### Phát hiện quan trọng về múi giờ (cạm bẫy khi đổi sang giờ Bắc Kinh)

Đổi 08:30 giờ Việt Nam sang **09:30 giờ Bắc Kinh** rồi nhập vào công cụ Trung Quốc ở chế độ thường thì ra **giờ Ất Tỵ, sai**. Lý do: công cụ coi 09:30 là giờ đồng hồ địa phương, mà 09:00–10:59 là giờ Tỵ. Trụ giờ phụ thuộc vào **giờ mặt trời tại nơi sinh**, không phụ thuộc vào giờ đồng hồ của múi giờ khác. Có hai cách nhập đúng:

- nhập thẳng 08:30, coi như "giờ địa phương", hoặc
- nhập 09:30 kèm chế độ 真太阳时 và kinh độ Hà Nội 105°51'. Cách này ra giờ mặt trời khoảng 08:33, tức giờ Thìn.

Xemboi nên ghi rõ quy ước này và cảnh báo người dùng nhập giờ của nơi sinh.

## 1. mingli.ru — Калькулятор Бацзы

- **URL:** https://www.mingli.ru/bazi. Kết quả nằm ở URL dạng /bazi/<base64 JSON>, nên chia sẻ được.
- **Trụ:** 甲辰 / 丁酉 / 辛巳 / 庚午, xếp **giờ → năm từ trái sang phải** theo kiểu Trung Quốc. Khớp đáp án.
- **Phần đầu kết quả:** không có thẻ tóm tắt. Lưới 4 cột xuất hiện ngay. Hàng trên là âm dương + hành bằng tiếng Nga ("Ян Дерево"), rồi đến can, chi và tàng can. Bên phải có bảng Gua, Phi tinh và **ngũ giác ngũ hành bằng icon**: lửa, núi, bánh răng, giọt nước, cây. Mỗi icon gắn nhóm thập thần theo nghĩa đời sống: Личность/bạn bè, Самовыражение (Thực thương), Богатство/vợ (Tài), Власть/chồng (Quan), Ресурсы (Ấn).
- **Cỡ chữ:** can chi chính 52px (font MS PGothic). Mỗi chữ nằm trong ô vuông viền mảnh.
- **Màu ngũ hành (đo bằng getComputedStyle):**
  - Mộc rgb(52,139,46) #348B2E
  - Hỏa rgb(240,0,0) #F00000
  - Thổ rgb(106,56,20) #6A3814, nâu
  - Kim rgb(112,128,144) #708090, xám slate
  - Thủy rgb(0,130,255) #0082FF
  - Nền ô màu trắng.
- **Các thành phần khác:**
  - Tàng can: hiện ngay dưới chi, cỡ khoảng 24px, có nhãn tiếng Nga.
  - Thập thần: hiện gián tiếp qua sơ đồ ngũ giác.
  - Nạp âm, thần sát, trường sinh, hợp xung: không thấy ở bản miễn phí. Bản "ПРО" trả phí có thêm.
  - Có dấu "?" trên can ngày và chi năm (tooltip).
- **Đại vận ("Такты"):** 10 ô to, can chi 42px tô màu, kèm năm bắt đầu (1999, 2009, 2019…) và tuổi (9, 19, 29…). Bên dưới có hàng tàng can nhỏ. **Không đánh dấu vận đang chạy.** Tiếp theo là lưới "Годы жизни": 100 năm lưu niên, can chi tô màu, rất dày.
- **Chi tiết hay:** dòng "Смена сезона 06 Июня 1990 06:47" báo ngay mốc tiết khí kế tiếp (Mang chủng), giúp người dùng biết mình sinh gần ranh giới tháng hay không.
- **Di động 375px:** không responsive. Trang rộng 826px, phải cuộn ngang. Banner quảng cáo khoá học chiếm đầu trang.
- **Nên học:**
  - Chữ Hán to, màu ngũ hành tươi và dễ phân biệt.
  - Báo mốc tiết khí kế tiếp.
  - Ngũ giác thập thần gắn ý nghĩa đời sống (bản thân, biểu đạt, tài, quyền, nguồn lực).
  - URL chia sẻ được.
- **Nên tránh:**
  - Nền xám, quá nhiều khung và nút.
  - Không đánh dấu vận hiện tại.
  - Lưới 100 năm quá dày.
  - Banner bán khoá học.
  - Hộp cookie không có nút từ chối.
- **Ảnh:**
  - lá số: `tool-results\mcp-Claude_Browser-blob-1795453889929-hvfymy.jpg`
  - đại vận + lưu niên: `…-1795453897938-k6fizn.jpg`
  - mobile: `…-1795453911580-fy76xo.jpg`

## 2. china95.net — 元亨利贞网 四柱八字在线排盘

- **URL:** https://www.china95.net/paipan/bazi/. Form POST tới bazi_show.asp. Có các tuỳ chọn 普通/真太阳时 và 简排/全排.
- **Trụ:** chế độ thường với 09:30 cho ra **乙巳 giờ, sai** (xem phần cạm bẫy ở trên). Chế độ 真太阳时 với 105°51' cho ra 甲辰, khớp.
- **Phần đầu kết quả:** một khối văn bản thuần, kiểu phần mềm DOS:
  - Dòng 1: tên, nơi sinh, phương thức. Dòng 2: dương lịch và âm lịch kèm nạp âm năm.
  - Hai tiết khí bao quanh ngày sinh: 立夏 06/05 02:35 và 芒种 06/06 06:46.
  - Câu chính xác tới giờ: "起运：出生后8年9个月4天14小时" và "交运：1999年3月5日23时". Đây là cách ghi khởi vận chi tiết nhất trong các công cụ đã xem.
  - Sau đó là trụ ngang: thập thần ở trên, can, chi, tàng can kèm thập thần, 旺衰 (trường sinh), 纳音.
- **Cỡ chữ và màu:** **12px**, can chi màu đỏ #FF0000, nhãn màu xanh. **Không tô màu ngũ hành.**
- **Thần sát:** liệt kê rất nhiều, chia theo gốc tra (年干/年支/月支/日干/日支) và đặt theo cột trụ: 福星, 学堂, 羊刃, 天乙, 文昌, 太极, 桃花, 空亡, 国印, 流霞, 寡宿, 天医…
- **Không vong:** "(辰巳空)" đặt cạnh trụ.
- **Hợp/xung/hình/hại:** không có.
- **Đếm ngũ hành:** không có.
- **Đại vận:** dòng ngang 8 vận, có trường sinh, nạp âm và thập thần của từng vận; tuổi 9岁, 19岁…; năm 始于 1999 / 止于 2008. Lưu niên xếp dọc 10 năm dưới mỗi vận. Có thêm **小运** và lưu niên 1–10 tuổi (虚岁). Không đánh dấu vận hiện tại.
- **Di động:** không responsive. Trang rộng 1041px, chữ 12px gần như không đọc được.
- **Quảng cáo:** Google Ads hiện quảng cáo tiếng Việt (Long Châu) ngay trên lá số. Có nút nổi "在线算命服务".
- **Nên học:**
  - Ghi khởi vận chính xác tới ngày giờ, kèm ngày giao vận dương lịch.
  - Hiện hai tiết khí bao quanh ngày sinh.
  - Lưu niên đặt ngay trong cột đại vận.
  - Có tuỳ chọn 真太阳时 và kinh độ.
- **Nên tránh:**
  - Chữ 12px.
  - Không tô màu ngũ hành.
  - Bố cục bằng khoảng trắng toàn góc.
  - Quảng cáo đặt giữa trang.
- **Ảnh:**
  - desktop, bản 09:30 thường: `…-1795453951730-mm71da.jpg`
  - mobile, bản 真太阳时: `…-1795453969014-en6rxo.jpg`

## 3. tuvi.vn — Lập lá số Bát Tự Tứ Trụ

- **URL:** https://tuvi.vn/lap-la-so-bat-tu-tu-tru. Kết quả hiện ngay trên cùng trang. Form có trường "Họ tên"; đã nhập tên giả "Ca Mau".
- **Trụ:** Canh Ngọ, Tân Tỵ, Đinh Dậu, Giáp Thìn. Khớp. Xếp **năm → giờ từ trái sang phải**.
- **Phần đầu kết quả:** khung "Mệnh Bàn Bát Tự Tứ Trụ — Phương pháp Thiệu Vĩ Hoa". Bên phải là bảng thông tin: họ tên, giới tính (Khôn tạo), âm dương, dương lịch kèm GMT+7, âm lịch, **tiết khí (Tiểu Mãn), nguyệt lệnh (Tỵ)**, nhật chủ, nạp âm, khởi vận.
- **Bảng chính:** một bảng nhiều hàng: lịch dương, lịch âm, can, chi, bát tự, nạp âm, ngũ hành, âm dương, thập thần, **ý nghĩa thập thần**, tàng can kèm nghĩa từng thập thần, phó tinh, thập nhị thần (trường sinh), đại vận, lưu niên, thần sát, mệnh (mệnh cung, thai nguyên, niên không, nhật không).
- **Cỡ chữ:** can chi chỉ **17px chữ Việt in hoa** (CANH/TÂN…), không có chữ Hán. Ghi chú nghĩa 12px, rất nhạt.
- **Màu ngũ hành (computed style):**
  - Kim **#999999 xám nhạt**, tương phản với nền trắng khoảng 2,8:1, **trượt WCAG**
  - Thổ **#FFA000 cam**, tương phản khoảng 2,1:1, **trượt**
  - Hỏa #FF0000
  - Mộc #009130
  - Cột Nhật chủ tô nền be.
- **Đại vận và lưu niên:** hàng 10 ô với tuổi (8-17t…) và năm (1998, 2008…). **Ô vận hiện tại (Mậu Dần, 2018) và năm hiện tại (Bính Ngọ, 2026) được tô nền vàng nhạt.** Đây là điểm tốt.
- **Thần sát:** ít (Lộc Thần, Đào Hoa, Tướng Tinh, Quả Tú), xếp theo cột.
- **Không vong:** niên không Tuất–Hợi, nhật không Thìn–Tỵ, đúng.
- **Hợp/xung:** không có.
- **Đếm ngũ hành:** không có.
- **Lỗi và mâu thuẫn số liệu:**
  - Hàng "NGŨ HÀNH" ghi Thổ / Kim / Hỏa / Hỏa. Đây là **hành của nạp âm**, không phải hành của can. Ví dụ can Canh là Kim nhưng hàng này ghi Thổ. Người mới đọc sẽ hiểu sai.
  - Nạp âm giờ Giáp Thìn ghi "**Phật Đăng Hỏa**". Tên chuẩn là Phú/Phúc Đăng Hỏa (覆燈火).
  - Khởi vận ghi "03/03/1999 (8 tuổi)" nhưng đại vận ghi **1998**, 8–17t.
  - **Trộn hai quy ước tuổi:** đại vận dùng tuổi thực (8t ứng với 1998), còn lưu niên dùng **tuổi mụ** (2026 ghi 37t).
- **Di động:** cả bảng bị **thu nhỏ bằng scale** cho vừa 375px, chữ còn khoảng 5–8px, không đọc được.
- **Quảng cáo:** popup quảng cáo toàn màn hình (Google vignette) khi cuộn, banner dính chân trang "Thử thách logic", và kêu gọi "đăng lá số lên nhóm Facebook".
- **Nên học:**
  - Khung thông tin đầu có tiết khí và nguyệt lệnh.
  - Hàng "Ý nghĩa thập thần" bằng lời đời thường.
  - Tô nền vận và năm hiện tại.
  - Nút "Tải lá số".
  - Hiện không vong, thai nguyên, mệnh cung.
- **Nên tránh:**
  - Màu Kim và Thổ nhạt, trượt tương phản.
  - Ghi hành của nạp âm dưới tên "ngũ hành".
  - Thu nhỏ cả bảng trên di động.
  - Trộn tuổi mụ với tuổi thực.
  - Quảng cáo vignette.
- **Ảnh:**
  - đầu lá số: `…-1795454093285-8xg5eo.jpg`
  - đại vận / lưu niên: `…-1795454097350-ycyhz1.jpg`
  - mobile: `…-1795454102864-n23yfd.jpg`
  - popup quảng cáo: `…-1795454086415-3na6yj.jpg`

## 4. bazi-calculator.com/vi — Lập Lá số Tứ Trụ

- **URL:** https://bazi-calculator.com/vi/
- **Form:** mặc định kinh độ 105 và GMT+7. Có các ô "Không rõ giờ", "Quy định giờ mùa hè", và bảng tuỳ chọn (Can tàng hiện đại/truyền thống, phương pháp Ken Lai, "Ngày mới bắt đầu từ 23:00", Mobile mode…).
- **Trụ:** Canh, Tân Tị, Đinh Dậu, Giáp Thìn. Khớp. Công cụ báo rõ "Thời gian Mặt Trời thực = 8:32".
- **Phần đầu kết quả:**
  - Ba khung cạnh nhau: **Lá số tứ trụ | Đại vận hiện tại (2018–2028 Mậu Dần) | Ngày để so sánh** (mặc định là hôm nay). Đặt vận hiện tại và hôm nay cạnh lá số gốc là ý hay.
  - Mỗi ô can chi là **khối nền màu ngũ hành**, chữ Hán 28px đen, tên Việt và thập thần ở trên và dưới.
- **Màu nền:**
  - Hỏa #FF6D70
  - Kim #C9C3CC
  - Mộc #7FC96A
  - Thổ #FFD187
  - Thủy xanh tím (khoảng #8E9BFF)
- **Tàng can:** ô con tô màu theo hành, ghi thập thần viết tắt (Thực, Tỉ, Thương, C.Tài, T.Ấn, Sát).
- **Hợp/xung/hình/hại:** **liệt kê chữ dưới từng cột**: "bán hợp (Tị-Dậu)", "chi lục hợp (Dậu-Thìn)", "can khắc (Canh-Giáp)", "thiên địa tổ hợp: Thủy". Thêm mục "Đại vận:" liệt kê tương tác của vận đang chạy với từng trụ. Phần thần sát cũng nằm ở đây. Nhiều chỗ ghi "Phiên bản Premium hiển thị thêm…".
- **Đại vận:** bảng 10 cột, cột đầu là trụ tháng "06/1990+". Mỗi vận có tháng/năm bắt đầu và tuổi (11/2018+ (28)), can chi khối màu, tàng can, mùa, nạp âm, trường sinh, thần sát, tương tác. **Cột hiện tại có header xám và ghi "(Vận hiện tại)".**
- **Đếm ngũ hành:**
  - Thanh "Nhật Chủ vượng suy": sinh phù 44%, ức chế 56%.
  - Bảng "Thập thần. Lá số và đại vận" tính theo %: Ấn (Mộc) 14%, Tỉ Kiếp (Hỏa) 30%, Thực Thương (Thổ) 17%, Tài (Kim) 37%, Quan Sát (Thủy) 2%. Có so với ngày đối chiếu.
- **Lệch số liệu:** khởi vận **1998-11-05**, khoảng 8 năm 5 tháng, trong khi china95, miniwebtool và xemboi đều ra 8 năm 9 tháng (03/1999). Công cụ này dùng cách quy đổi khác.
- **Di động:** trang rộng 1001px, cột giờ bị cắt. Chữ thần sát và tương tác khoảng 11px. Có ô "Mobile mode" nhưng nằm trong tuỳ chọn ẩn.
- **Nên học:**
  - Khối nền màu ngũ hành cho từng chữ, nhìn là thấy cân bằng.
  - Đặt lá số gốc cạnh vận hiện tại và năm/ngày hiện tại.
  - Liệt kê tương tác bằng tiếng Việt kèm cặp chữ.
  - Cột trụ tháng đứng đầu bảng đại vận.
  - Báo giờ mặt trời thực.
- **Nên tránh:**
  - Quá nhiều chữ nhỏ.
  - Bị chặn bởi Premium.
  - Form phức tạp với hàng chục checkbox.
  - Không responsive.
  - Khởi vận lệch.
- **Ảnh:**
  - lá số: `…-1795454133878-nq4q1o.jpg`
  - đại vận: `…-1795454140892-eo5mx3.jpg`
  - mobile: `…-1795454145634-yguft7.jpg`

## 5. miniwebtool.com/vi — Công cụ tính Bát Tự (mẫu tốt nhất về trình bày)

- **URL:** https://miniwebtool.com/vi/cong-cu-tinh-bat-tu/. Form GET nên URL chia sẻ được.
- **Form:**
  - Mỗi giờ trong dropdown có ghi chi (ví dụ "08:00–08:59 · 辰").
  - Có tuỳ chọn "I do not know my birth hour" để lập tam trụ.
  - Nơi sinh theo múi giờ, tự trừ giờ mùa hè. Có tuỳ chọn 真太阳时.
  - Có các ví dụ nhanh, trong đó có ca "trước Lập xuân + giờ Dạ Tý".
- **Trụ:** 庚午 辛巳 丁酉 甲辰. Khớp.
- **Phần đầu kết quả (hero):** thẻ đỏ thẫm gradient, ghi "Lá số Tứ Trụ Bát Tự của bạn · 🐎 Ngựa · 1990". **Tám chữ Hán trắng cỡ lớn** trên một dòng. Bên dưới là ô "丁" với "NHẬT CHỦ CỦA BẠN — Âm Hỏa 🔥" và một câu mô tả tính cách. Sau đó là các nút AI luận giải (upsell) và "Tải PDF".
- **4 Trụ:**
  - Bốn thẻ cột (YEAR → HOUR), mỗi ô can/chi **52px** tô màu và nền pastel.
  - Dưới chữ: pinyin, âm dương + hành, **thẻ thập thần** dạng pill.
  - Chi có emoji con giáp.
  - Tàng can kèm **trọng số** (丁 0.7, 己 0.3), sau đó là nạp âm Hán + Việt.
  - **Cột ngày đóng khung đỏ, header "DAY · BẠN".** Có chú thích màu ở dưới.
- **Màu (palette Tailwind):**
  - Hỏa #DC2626 trên nền #FEE2E2
  - Kim #64748B trên nền #F1F5F9
  - Mộc #16A34A trên nền #DCFCE7
  - Thổ #B45309 trên nền #FEF3C7
  - Thủy xanh dương #2563EB
- **Cân bằng ngũ hành:**
  - **5 thanh ngang** kèm điểm và % (Mộc 1.3 · 16.2%, Hỏa 2.3 · 28.7% gắn tag "NHẬT CHỦ", Thổ 1.0, Kim 3.3 · 41.2%, Thủy 0.1 · 1.2%).
  - Cạnh đó là **sơ đồ ngũ hành tròn**: mũi tên xanh là tương sinh, ngôi sao nét đứt xám là tương khắc. Kích thước nút tỉ lệ với điểm.
  - Một câu kết luận "thiên nhiều nhất về Kim, ít nhất ở Thủy".
  - Có giải thích phương pháp tính: can được 1 điểm, chi 1 điểm chia theo tàng can, tổng 8.
- **Vượng suy:** thang 5 nấc từ "Cực nhược" đến "Cực vượng", ra 47.1/100 "Cân bằng". Có lý do kèm điểm ("Đắc lệnh +10"). Câu trấn an: "không bên nào tốt hơn".
- **Hỷ dụng / Kỵ:** thẻ xanh ✓ Thủy, thẻ hổ phách ⚠ Kim. Ghi rõ dùng phương pháp phù ức và **thừa nhận chưa tính hợp xung hình hại**.
- **Đại vận:**
  - Hộp giải thích: "vận hành nghịch (逆行) — can năm nghịch hướng với lá số nữ… khởi ở khoảng 8 tuổi 9 tháng, tính từ 26.29 ngày giữa ngày sinh và 立夏, theo quy tắc ba ngày = một năm".
  - **Dải thẻ cuộn ngang:** mỗi thẻ có tuổi, năm, can chi to, thập thần, con giáp. **Thẻ hiện tại viền đỏ "📍 Hiện tại"**. Vận hợp hỷ dụng thần viền xanh "✓ Thuận lợi".
- **Lưu niên:** 3 năm tới (2026–2028). Mỗi năm có nhãn ("Năm đan xen", "Năm nhiều thử thách"), thập thần can/chi, một câu lời khuyên, cảnh báo bản mệnh. Nói rõ năm bát tự đổi tại Lập xuân.
- **Không rõ giờ:** chỉ hiện 3 cột và ghi tổng 6.0 điểm. Hành vắng mặt gắn tag "KHUYẾT". Có đoạn giải thích "các trụ năm, tháng, ngày không phụ thuộc vào giờ".
- **Tuyên bố:** "không phải khoa học… không cấu thành lời khuyên". Giọng văn không hù doạ.
- **Di động 375px:** responsive tốt. 4 cột vừa màn hình, chữ Hán vẫn to. Nhãn thập thần dài bị cắt ("Thương Q…").
- **Nên tránh:**
  - Bản tiếng Việt còn sót tiếng Anh: YEAR/MONTH/DAY/HOUR, viết tắt F/EG/RW/HO/IW/7K, "Male/Female", "I do not know my birth hour".
  - Quảng cáo dược phẩm cài giữa nội dung.
  - Upsell AI hơi nhiều.
- **Ảnh:**
  - hero: `…-1795454206255-a42ex5.jpg`
  - 4 trụ: `…-1795454210500-92gp8l.jpg`
  - ngũ hành: `…-1795454213927-qc1h8c.jpg`
  - đại vận: `…-1795454218332-0j7xjl.jpg`
  - mobile: `…-1795454221989-pncyth.jpg`

## 6. masterseanchan.com/vi — Máy tính BaZi với giờ mặt trời

- **URL:** https://www.masterseanchan.com/vi/may-tinh-bazi-bang-tu-tru-voi-gio-mat-troi/
- **Form:** chọn quốc gia → thành phố (Hà Nội 105,85°E). **Xem trước phần hiệu chỉnh giờ mặt trời ngay trên form:** giờ đồng hồ 08:30, kinh độ +3,4 phút, phương trình thời gian +2,4 phút, ra giờ mặt trời 08:36, "✓ 時辰 không đổi". Nếu hiệu chỉnh làm giờ đổi sang ngày hôm trước, form có cảnh báo "⚠ Ngày đã dịch sang ngày trước".
- **Trụ:** khớp.
- **Phần đầu kết quả:**
  - Dòng tóm tắt "1 Jun 1990 · ♀ Nữ · Nhật Chủ 丁 Âm Hỏa · Giờ mặt trời 08:30 → 08:36".
  - Thẻ nhật chủ: ô vuông đỏ "丁" kèm câu ẩn dụ ("ngọn nến hay ánh sao").
  - **Thanh cường nhược** gradient từ Rất nhược đến Rất vượng, ra "Vượng". Dụng thần 金 Metal, hỷ 土, kỵ 火. Cách cục 正格·月劫格.
- **Tứ trụ:**
  - Thẻ 4 cột, header nâu đậm.
  - Chữ Hán **40px nét mảnh** (serif), pinyin, hành.
  - Tàng can hiện thành **pill thập thần tô màu theo nhóm**.
  - Ô "空亡" đặt ngay trên Tỵ và Thìn.
- **Màu (kiểu "cổ điển sang"):**
  - Hỏa #9B2335 đỏ son
  - Kim #7A7A8C
  - Mộc #3D6B45
  - Thổ #8B5E3C
  - Nền kem #FDFAF3
- **Các tab:** Lá số gốc | Vận trình (大运·流年) | Shen Sha | Tương tác (刑冲合).
- **Tương tác được VẼ:** các thanh ngang nằm dưới hàng trụ, kéo dài đúng qua các cột liên quan: "六合 辰酉" phủ cột ngày–giờ, "半合 巳酉" phủ cột tháng–ngày. Đây là cách trực quan nhất trong các công cụ đã xem.
- **Vận trình:** dải 8 thẻ đại vận, thẻ hiện tại ghi "29 · NAY". Bấm một vận thì hiện lưu niên của vận đó. Bấm một năm thì **phủ năm đó lên lá số gốc** để xem tương tác.
- **Lỗi:**
  - Mục "PHÂN BỐ NGŨ HÀNH" hiện "**MỘC undefined, HỎA undefined, THỔ undefined, METAL 5, THỦY undefined**": bug bản địa hoá.
  - Trộn tiếng Anh: Useful God, Neutral, METAL, "This chart sits on the strength borderline…".
  - Bấm "Decline" cookie làm trang tải lại và **mất lá số vừa lập**, quay về lá số "thời khắc hiện tại" (Singapore).
- **Quảng cáo:** popup upsell "Your 2027… US$88" và toast "Ghi danh Bootcamp".
- **Di động:** thẻ trụ cuộn ngang, cột Giờ bị đẩy ra ngoài màn hình. Toast quảng cáo che phần đầu trang.
- **Nên học:**
  - Xem trước giờ mặt trời và cảnh báo đổi ngày ngay trên form.
  - Vẽ quan hệ hợp/xung bằng thanh phủ cột.
  - Bấm lưu niên để phủ lên lá số.
  - Bảng màu trầm sang.
  - Pill thập thần cho tàng can.
  - Đánh dấu không vong ngay tại chữ.
- **Ảnh:**
  - lá số: `…-1795454264472-8vfxce.jpg`
  - thanh tương tác: `…-1795454295024-x9yehu.jpg`
  - mobile: `…-1795454299665-1odn3k.jpg`
  - popup bán hàng: `…-1795454256806-zx29a2.jpg`

Đường dẫn đầy đủ của ảnh: `C:\Users\CUONG\.claude\projects\C--Users-CUONG-AppData-Local-Claude-Data-claude-pzs8sxrjxfjjc-scratch-workspaces-9d3e0c6f-51ff-482f-8e5a-2bacdc41e64e-55c86d87-33d1-4d3e-b897-e99f334424bf-scratch-2026-11-02-dc0dec\690e64e9-9a1a-4487-932c-8ccb833e44fe\tool-results\` + tên tệp. Thư mục này có thể bị dọn, nên sao ra nếu cần giữ.

## Chỗ lệch số liệu và quy ước giữa các công cụ

1. **Trụ giờ khi đổi múi giờ:** china95 ở chế độ thường với 09:30 giờ Bắc Kinh ra 乙巳, sai. Phải dùng giờ địa phương hoặc 真太阳时. Các công cụ còn lại đều ra 甲辰.
2. **Khởi vận:**
   - china95 (8n9th4ng), miniwebtool (8n9th), tuvi.vn (03/03/1999), mingli và masterseanchan (9 tuổi / 1999) khớp với xemboi.
   - **bazi-calculator: 05/11/1998**, khoảng 8n5th, lệch.
   - **tuvi.vn tự mâu thuẫn:** ghi khởi vận 03/1999 nhưng bảng đại vận bắt đầu từ 1998.
3. **Ghi tuổi:**
   - tuvi.vn: đại vận ghi tuổi thực (8–17t), lưu niên ghi **tuổi mụ** (2026 = 37t).
   - china95: tiểu vận ghi 虚岁.
   - mingli, masterseanchan, miniwebtool: tuổi tròn theo năm bắt đầu (9 / 19 / 29, hoặc 8–17).
   - Không công cụ nào nói rõ đang dùng loại tuổi nào.
4. **Đếm ngũ hành:**
   - Xemboi đếm thô 8 chữ: Kim 3, Hỏa 3, Mộc 1, Thổ 1, Thủy 0.
   - miniwebtool có trọng số tàng can: Kim 3.3, Hỏa 2.3, Mộc 1.3, Thổ 1.0, Thủy 0.1.
   - bazi-calculator tính %: Kim 37, Hỏa 30, Thổ 17, Mộc 14, Thủy 2.
   - masterseanchan bị lỗi.
   - Các cách đều hợp lệ nhưng cho ra số khác nhau. Phải ghi rõ phương pháp đang dùng.
5. **Vượng suy và dụng thần trái ngược nhau:**
   - miniwebtool: "Cân bằng 47/100", **Hỷ dụng Thủy, Kỵ Kim**.
   - masterseanchan: "Vượng", **Dụng Kim, Hỷ Thổ, Kỵ Hỏa**.
   - bazi-calculator: sinh phù 44% / ức chế 56%.
   - Xemboi không nên đưa dụng thần như chân lý. Cần ghi trường phái và mức chắc chắn.
6. **Đổi ngày ở giờ Tý:**
   - masterseanchan theo kiểu **夜子时**: giờ 23:25 vẫn giữ ngày cũ (辛丑) nhưng can giờ lấy theo ngày mới (庚子). Thấy được ở lá số "thời khắc hiện tại".
   - bazi-calculator có tuỳ chọn "Ngày mới bắt đầu từ 23:00", mặc định tắt.
   - mingli.ru có tuỳ chọn "Сдвоенный час Крысы" (chia đôi giờ Tý).
   - miniwebtool có ví dụ riêng cho "giờ Dạ Tý".
   - **Chưa kiểm thử ca 23h trên từng công cụ.** Đây chỉ là quy ước đọc từ giao diện.
7. **Năm đổi theo Lập xuân:** miniwebtool và masterseanchan ghi rõ là năm đổi theo Lập xuân. china95 hiện tiết khí. Ca mẫu sinh tháng 6 nên không kiểm được chỗ lệch Tết và Lập xuân. Không thấy công cụ nào dùng Tết (tuvi.vn ghi "trụ năm tính dựa trên năm sinh âm lịch" trong bài giới thiệu, dễ gây hiểu lầm). Cần thêm ca kiểm thử sinh khoảng 20/01–04/02.
8. **Tên nạp âm:** tuvi.vn ghi "Phật Đăng Hỏa", chuẩn là Phú/Phúc Đăng Hỏa (覆燈火). tuvi.vn còn ghi hàng "Ngũ hành" là hành của nạp âm.
9. **Thần sát:** mỗi công cụ ra một bộ khác nhau, tuỳ bảng tra và gốc tra (năm hay ngày). Ví dụ: china95 có 羊刃 ở Ngọ; tuvi.vn chỉ có 4 sao; bazi-calculator có Dương nhận ở Tỵ. Nên chọn ít sao, ghi gốc tra.

## Bảng so sánh ngắn

| Tiêu chí | mingli | china95 | tuvi.vn | bazi-calc | miniwebtool | masterseanchan |
|---|---|---|---|---|---|---|
| Đúng ca mẫu | ✓ | ✓ khi dùng 真太阳时 | ✓ | ✓ | ✓ | ✓ |
| Khởi vận 8n9th | ~ (9) | ✓ chi tiết | ✓ (tự mâu thuẫn) | ✗ 8n5th | ✓ | ~ (9) |
| Chữ Hán to | ✓ 52px | ✗ 12px | ✗ chỉ chữ Việt 17px | ~ 28px | ✓ 52px | ✓ 40px |
| Màu ngũ hành | màu chữ tươi | ✗ | màu chữ, Kim/Thổ nhạt | khối nền | chữ + nền pastel | màu trầm |
| Thẻ tóm tắt đầu trang | ✗ | khối text | khung thông tin | ✗ | ✓ hero | ✓ nhật chủ + cường nhược |
| Thập thần / tàng can | ngũ giác / ✓ | ✓ / ✓ | ✓ có nghĩa / ✓ | ✓ / ✓ | ✓ pill / ✓ trọng số | ✓ / ✓ pill |
| Hợp xung hình hại | ✗ | ✗ | ✗ | liệt kê chữ | ✗ (nói rõ là chưa tính) | **vẽ thanh phủ cột** |
| Đếm ngũ hành | ✗ | ✗ | ✗ | % theo thập thần | thanh + vòng sinh khắc | lỗi undefined |
| Đánh dấu vận hiện tại | ✗ | ✗ | ✓ nền | ✓ | ✓ viền + nhãn | ✓ "NAY" |
| Không rõ giờ | không rõ | ✗ | ✗ | ✓ | ✓ tam trụ + giải thích | ✓ |
| Mobile 375 | ✗ cuộn ngang | ✗ | ✗ thu nhỏ | ✗ | ✓ | ~ cuộn trong thẻ |
| Quảng cáo / upsell | khoá học | Google Ads | vignette + sticky | Premium | Ads + AI | popup US$88 |

## 10 điểm nên áp dụng cho trang bát tự xemboi

Trang hiện tại có 3 thẻ thông tin, bảng Tứ trụ, 5 thanh đếm ngũ hành và bảng đại vận 8 bước.

1. **Thẻ "hero" ở đầu trang.** Tám chữ Hán và Việt cỡ lớn trên một dòng (ví dụ 庚午 辛巳 **丁酉** 甲辰), cùng ô Nhật chủ "Đinh Hỏa — ngọn nến" và một câu mô tả hiền. Trộn 3 thẻ thông tin hiện tại vào thẻ này. Học từ miniwebtool và masterseanchan.
2. **Bảng Tứ trụ dạng 4 thẻ cột.** Can và chi ≥ 44px, kèm tên Việt, âm dương + hành, **pill thập thần**. Tàng can có pill thập thần và (tuỳ chọn) trọng số. Nạp âm Hán + Việt. **Cột Nhật chủ đóng khung, ghi "Bạn"**. Xếp theo thứ tự giờ → năm như sách Trung Quốc, hoặc năm → giờ, nhưng phải cố định và ghi rõ.
3. **Màu ngũ hành đủ tương phản (≥ 4,5:1) trên nền giấy kem.** Gợi ý theo hướng masterseanchan cổ điển nhưng đậm hơn:
   - Mộc #2F6B3A
   - Hỏa #A8242F
   - Thổ #8A5A2B
   - Kim #5E6470
   - Thủy #1F4E8C
   - Nền pastel nhẹ cho từng ô.
   - Tránh Kim xám nhạt và Thổ cam như tuvi.vn.
4. **Vẽ quan hệ giữa các trụ.** Thanh hoặc cung nối dưới hàng chi, ghi "Lục hợp Thìn–Dậu", "Bán hợp Tỵ–Dậu", "Canh khắc Giáp"; xung và hại dùng màu khác. Trên di động, chuyển thành danh sách chip. Đây là chỗ đối thủ Việt chưa ai làm.
5. **Biến 5 thanh ngũ hành thành "Cân bằng ngũ hành".**
   - Thanh ngang kèm số và % (đếm 8 chữ, có nút bật "tính cả tàng can").
   - **Vòng tương sinh/tương khắc** với nút to nhỏ theo điểm.
   - Tag "Nhật chủ" và "Khuyết".
   - Một câu kết luận.
   - Ghi rõ phương pháp đếm.
6. **Đại vận thành dải thẻ cuộn ngang.**
   - Mỗi thẻ có tuổi bắt đầu, năm dương lịch, can chi màu, thập thần.
   - **Thẻ đang chạy viền đỏ "Hiện tại"**.
   - Hộp đầu giải thích "Nữ, năm dương nên nghịch hành, khởi vận 8 tuổi 9 tháng (26 ngày đến Lập hạ ÷ 3)". Ghi **ngày giao vận dương lịch** kiểu china95.
7. **Lưu niên gắn với đại vận.** Bấm thẻ vận thì hiện 10 năm, năm hiện tại được tô. Bấm năm thì phủ năm đó lên lá số, hiện hợp/xung với từng trụ. Học từ masterseanchan và bazi-calculator.
8. **Khung "Thông số tính".** Gồm:
   - tiết khí đang ở (Tiểu mãn) và hai mốc tiết bao quanh (Lập hạ 06/05 02:35, Mang chủng 06/06 06:46)
   - nguyệt lệnh
   - giờ mặt trời thực (08:30 → ~08:33 Hà Nội) và cảnh báo khi giờ hoặc ngày bị đổi
   - không vong (niên Tuất–Hợi, nhật Thìn–Tỵ, đánh dấu ngay trên chữ Thìn, Tỵ)
   - thai nguyên, mệnh cung
9. **Xử lý "không rõ giờ" đàng hoàng.** Lập tam trụ, cột giờ hiện ô trống có chữ "chưa rõ giờ", đếm trên 6 chữ, kèm câu giải thích phần nào vẫn chắc chắn. Trong dropdown giờ, ghi chi cho từng khung giờ (08:00–08:59 · Thìn).
10. **Giọng văn và độ tin cậy.**
    - Kèm ý nghĩa đời thường cho từng thập thần (học hàng "Ý nghĩa thập thần" của tuvi.vn).
    - Vượng suy và dụng thần ghi kèm **phương pháp (phù ức) và mức chắc chắn**, vì ngay ca mẫu, miniwebtool ra Kỵ Kim còn masterseanchan ra Dụng Kim.
    - Không hù doạ, không popup, không quảng cáo xen giữa lá số.
    - Responsive thật ở 375px: 4 cột vừa màn hình, không thu nhỏ cả bảng.
    - Thuật ngữ 100% tiếng Việt, không sót tiếng Anh như miniwebtool và masterseanchan.

### Quy ước xemboi cần ghi rõ trên trang (chú thích nhỏ dưới lá số)

- Năm đổi tại **Lập xuân**, tháng đổi theo **tiết** (không theo Tết, không theo mùng 1 âm lịch).
- Giờ tính theo **giờ địa phương nơi sinh** (UTC+7 cho Việt Nam). Có hay không hiệu chỉnh giờ mặt trời thực thì phải nói rõ. Nếu có, hiện phút hiệu chỉnh.
- Giờ Tý: nói rõ đổi ngày lúc 23:00 hay 0:00 (Tảo Tý / Dạ Tý), và can giờ 23–24h lấy theo ngày nào.
- Khởi vận: 3 ngày = 1 năm, 1 ngày = 4 tháng, 2 giờ = 10 ngày. Đếm tới tiết kế tiếp hoặc tiết trước tuỳ thuận hay nghịch. Hiện tới tháng và ngày giao vận.
- Tuổi: dùng **một loại** (khuyên dùng tuổi thực, hoặc ghi rõ "tuổi mụ") cho cả đại vận lẫn lưu niên.
- Đếm ngũ hành: thô theo 8 chữ hay có trọng số tàng can.

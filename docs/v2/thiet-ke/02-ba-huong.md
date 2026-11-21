# 02 — Ba hướng thị giác cho xemboi.vn v2 (chờ anh Cường chọn)

> Ngày lập: **20/11/2026**. Đầu vào: [`01-soi-doi-thu.md`](01-soi-doi-thu.md), `04` mục 1 và 5.3, `03` (P1, P2), `07` mục 2, [`la-so-mau.json`](la-so-mau.json).
> Ba tệp: [`huong-a.html`](huong-a.html), [`huong-b.html`](huong-b.html), [`huong-c.html`](huong-c.html). Mỗi tệp tự chứa, có đủ 7 khối theo thứ tự: hero → form → lá số → nhận định → 2 giá → phác thảo trang chủ bách khoa → ảnh chia sẻ `#anh-chia-se` 1080×1350. Cuối mỗi tệp có thêm "Hồ sơ hướng" (màu, chữ, lưới, góc, chuyển động).
> **Ảnh đã chụp (Claude Code, 20/11/2026, Chromium headless).** Kết quả kiểm:
> - Cả ba trang không lỗi JS, không cuộn ngang ở 375px, font Google tải đủ.
> - Ảnh chia sẻ đúng 1080×1350.
> - Đã sửa ảnh chia sẻ của C: sân trong bị tràn đè lên hàng cung dưới. Đã bỏ chú giải, la bàn và chú thích sơ đồ trong ảnh, còn trang web giữ nguyên.
> - Lỗi nhỏ còn lại ở B: viên "2027: bạn 30 tuổi mụ" đè lên dòng chú thích dưới lá số ở 375px.
>
> Chụp ảnh chia sẻ ở kích thước gốc: mở tệp với `?chup=1`, phần tử `#anh-chia-se` sẽ bỏ `transform: scale()`.

---

## Dùng chung cho cả ba hướng

- **Dữ liệu:** lá số chép nguyên từ `la-so-mau.json` (nữ, 15/8/1998, 09:30) vào mảng `CUNG` trong mỗi tệp, không fetch tệp ngoài. Em đã soát lại từng cung với JSON: đủ chính tinh, cát tinh, sát tinh, độ sáng, can cung, tràng sinh, đại vận, tiểu hạn, Tuần, Triệt, 9 sao lưu và Lưu Tứ Hóa 2027.
- **Tứ Hóa:** hiện thành nhãn "Hóa Lộc / Quyền / Khoa / Kỵ" gắn vào sao được hóa (Tham Lang, Thái Âm, Hữu Bật, Thiên Cơ). Không lặp lại thành sao riêng. JSON có ghi độ sáng riêng của sao Hóa; em để thông tin này ở chú thích khi rê chuột. Nếu P2 muốn thấy nó ngay trên lá số thì cần bàn lại.
- **Vô chính diệu:** ghi "Vô chính diệu · xung chiếu …" kèm sao ở cung đối diện. Đây là phép tra vị trí, em không thêm luận giải.
- **Nhận định:** dùng `chuDe2027`. Tiêu đề, nội dung, nhãn căn cứ, nguồn sách và dòng "Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt)." đều chép nguyên văn. Câu nội dung có một chỗ ngắt câu lạ sẵn trong JSON ("…xung quanh. (đặt trong nền Đại vận…)."). Em giữ nguyên, nên sửa ở kho câu.
- **Giá:** đúng 04 mục 3.1 và 3.3: miễn phí và 149.000đ, trả một lần qua VietQR, hoàn 100% trong 7 ngày theo hai điều kiện đo được. Không gạch giá, không đếm ngược.
- **Độ sáng:** cả ba hướng có câu "Độ sáng là mức phát huy của sao ở cung đó, không phải nhãn tốt xấu". Không hướng nào tô đỏ sát tinh hay sao Hãm. Sát tinh chỉ in nhạt hơn.
- **Font:** mỗi tệp tối đa 2 họ. Em đã tra mảng `subsets` trong metadata Google Fonts (qua API `gwfh.mranftl.com`, ngày 20/11/2026). Cả 6 họ đều có `vietnamese`: IBM Plex Sans, IBM Plex Mono, Bricolage Grotesque, Newsreader, Archivo, Spectral.
- **Tương phản:** em tự tính theo công thức độ chói WCAG 2.x, chưa đo bằng công cụ. Các cặp chữ thường đều ≥ 4,5:1. Màu san hô `#E8542F` của B chỉ đạt 3,5:1 nên chỉ dùng cho chữ ≥ 24px.
- **Không dùng:** đỏ–vàng kim, rồng phượng, bát quái, quả cầu, nền vũ trụ lấp lánh, gradient tím–xanh, emoji, icon mặc định, chữ chạy, popup, quảng cáo, ảnh stock. Biểu tượng danh mục ở A là SVG vẽ tay đơn nét. Riêng ô Kinh Dịch có 6 vạch quẻ vì đó là nội dung của mảng, không phải bát quái trang trí.
- **Dung lượng:** mỗi tệp chỉ có HTML, CSS, JS thuần và SVG, không thư viện, không ảnh bitmap. Em ước mỗi tệp khoảng 50–65 KB, dưới mức 150 KB. **Chưa đo số byte thật** vì phiên này không có Bash.
- **Ô "Hôm nay theo lịch"** (20/11/2026 = 12/10 Bính Ngọ, ngày Mậu Tuất, tháng Kỷ Hợi) lấy từ ảnh chụp Lịch Việt và xemtuvi. **Chưa kiểm bằng engine.**

---

## Hướng A — Đài thiên văn

![Hướng A ở 375px](huong-a-375.png)
![Hướng A ở 1366px](huong-a-1366.png)
![Hướng A, ảnh chia sẻ](huong-a-chia-se.png)

**Ý tưởng một câu:** lá số vẽ như mặt một khí cụ thiên văn: mỗi vạch là một tuổi, mỗi nhận định là một đường ngắm chỉ thẳng vào sao và cung làm căn cứ.

**Vì sao hợp P1/P2 và định vị:** P2 thấy độ chính xác dạng "số đo": chữ mono, vạch tuổi, độ sáng dạng thanh 5 nấc, quy ước công khai. P1 thấy sự điềm tĩnh: nền than chì, một màu cam duy nhất, không có màu báo động. "Minh bạch" hiện ra thành các đường ngắm: tam giác Mệnh – Quan Lộc – Tài Bạch và nét đứt xung chiếu Thiên Di ở tâm vòng.

**Lá số:** vòng tròn 12 cung giữ đúng vị trí truyền thống (Ngọ trên, Tý dưới). Đi từ ngoài vào trong: vành vạch tuổi (mỗi vạch 1 tuổi, kim cam ở tuổi mụ 30 năm 2027) → vành can chi và đại vận → vành 12 cung với chính tinh, độ sáng, Hóa → cung Tuần/Triệt màu lục → đĩa giữa có chòm Mệnh–Quan–Tài. Trên máy tính, 12 thẻ cung đầy đủ xếp hai bên vòng, đúng phía của cung. Trên điện thoại, vòng chỉ ghi tên cung; 12 thẻ xếp từ cung Mệnh nằm bên dưới. Bấm vòng thì thẻ sáng lên, và ngược lại.

**Hệ nhận diện:** nền tối mặc định (có bản sáng). IBM Plex Sans + IBM Plex Mono. Lưới 48px mờ như giấy đồ thị, góc bo 2px, không đổ bóng. Chuyển động: kim tuổi quét một lần, vòng ở hero xoay vào chỗ rồi đứng yên.

**Bách khoa:** mỗi mảng là một "khí cụ" vẽ nét: vòng cho tử vi, lưới lịch, 4 cột bát tự, vạch quẻ. Ô "Hôm nay theo lịch" như một màn hình đọc số.

| Ưu | Nhược |
|:--|:--|
| Khác hẳn mọi trang Việt đã soi: chưa trang nào vẽ lá số hình tròn có vạch tuổi | P2 quen lưới 4×4. Vòng tròn có thể bị nghi "không phải lá số thật" dù vị trí đúng. Cần kiểm khi thử với P2 |
| Ảnh chia sẻ nổi bật trên bảng tin, kiểu Co–Star nhưng có nội dung Việt | Nền tối + chữ mono dễ thành "công nghệ, lạnh". Anh có thể thấy gần lối "vũ trụ" dù không có sao lấp lánh |
| P2 tin nhờ chi tiết đo đạc: vạch tuổi, độ sáng 5 nấc, quy ước | Trên 375px, chữ trong vòng nhỏ (tên cung khoảng 9px). Người dùng phải đọc thẻ bên dưới |
| Hệ "khí cụ" dùng lại được cho lịch âm, bát tự, Kinh Dịch | Khó làm nhất: hình học SVG, vị trí chữ trong từng múi phải canh tay |

---

## Hướng B — Sổ tay tô dạ quang

![Hướng B ở 375px](huong-b-375.png)
![Hướng B ở 1366px](huong-b-1366.png)
![Hướng B, ảnh chia sẻ](huong-b-chia-se.png)

**Ý tưởng một câu:** lá số như một trang tạp chí đã được đọc kỹ và tô dạ quang đúng chỗ: chữ to, giọng thân thiện, và mỗi nhận định tô sáng đúng những sao làm căn cứ.

**Vì sao hợp P1/P2 và định vị:** P1 lướt Facebook cần thứ tươi, trẻ, không u ám: màu chàm, xanh mạ non, form điền như viết một câu ("Mình là nữ, sinh ngày…"). P2 cần thấy căn cứ: bấm nhãn "Thiên Tướng (Đắc)" thì đúng chữ Thiên Tướng trong cung Nô Bộc được quẹt dạ quang. "Minh bạch" thành một thao tác nhìn thấy được. Câu ở hero: "Một năm để đọc kỹ, không phải để sợ."

**Lá số:** lưới 4×4 truyền thống, bao ngoài bằng một "đường đời" có số tuổi bắt đầu từng đại vận (2, 12, 22… 112). Mốc đang đi được tô xanh mạ, kèm nhãn "2027: bạn 30 tuổi mụ". Ô giữa như trang bìa tạp chí: chữ "Mậu Dần" rất to và đủ thiên bàn. Tuần, Triệt là hai miếng băng dính dán lên ranh giới hai cung. Khi tải trang, căn cứ của chủ đề 2027 đã tô sẵn. Trên điện thoại có bản đồ nhỏ 4×4 (tên cung, chính tinh), bấm vào thì nhảy tới thẻ đầy đủ bên dưới.

**Hệ nhận diện:** nền giấy sáng mặc định (có bản tối). Bricolage Grotesque (tiêu đề, số to, giao diện) + Newsreader (đoạn đọc dài). Góc bo lớn, nút bo tròn, bóng đặc lệch 8px kiểu giấy cắt dán. Chuyển động: vệt dạ quang quẹt 0,5 giây, nút nghiêng nhẹ khi rê chuột.

**Bách khoa:** trang chủ là một "mục lục tạp chí": số chương to 01–08, ô tìm kiếm cỡ tiêu đề, lịch ngày dạng tờ lịch bloc. Hợp với một site có rất nhiều bài tra cứu (07 mục 2.1).

| Ưu | Nhược |
|:--|:--|
| Thể hiện định vị "có căn cứ" rõ nhất, bằng một thao tác ai cũng hiểu là tô sáng | Lối nút bo tròn, bóng đặc, màu chanh đang là xu hướng chung (neo-brutalism), dễ bị thấy "giống template". Nên giảm bóng, chỉ giữ vệt dạ quang làm dấu riêng |
| Trẻ, ấm, dễ thương mà không trẻ con. Hợp P1 nhất | P2 khó tính có thể thấy "vui quá, chưa đủ học thuật" |
| Lá số vẫn là lưới 4×4 quen thuộc nên P2 đọc ngay | Lá số độc đáo ít hơn A và C, vì vẫn là 12 ô. Nét riêng nằm ở đường đời, chữ to và vệt dạ quang |
| Làm nhanh nhất: chỉ HTML/CSS grid. Nền sáng đọc bài dài tốt cho SEO | Muốn tô được căn cứ, mỗi câu trong kho văn phải có tham chiếu máy đọc được (khóa sao, khóa cung), không chỉ chuỗi "[Căn cứ: …]". Đây là việc dữ liệu thêm |

---

## Hướng C — Ngôi nhà 12 gian

![Hướng C ở 375px](huong-c-375.png)
![Hướng C ở 1366px](huong-c-1366.png)
![Hướng C, ảnh chia sẻ](huong-c-chia-se.png)

**Ý tưởng một câu:** lá số là mặt bằng một ngôi nhà 12 gian quanh sân trong: mỗi cung là một gian, sao là đồ đạc trong gian, đại vận là số đo ghi ngoài tường.

**Vì sao hợp P1/P2 và định vị:** với P1, "nhà" là hình ảnh yên ổn và dễ hiểu: lá số là nơi để đi một vòng, không phải bản án. Với P2, bản vẽ kỹ thuật là ngôn ngữ của sự chính xác: ký hiệu, chú giải, số đo, khung tên. Bản vẽ còn có mũi tên Bắc chỉ xuống dưới, vì lá số truyền thống đặt Nam (Ngọ) ở trên.

**Lá số:** tường ngoài 6px, vách 3px. Các gian sát sân có cửa mở ra sân. Tuần, Triệt là vách gạch chéo màu đất nung giữa hai gian. Sân trong là "khung tên bản vẽ" chứa thiên bàn, sơ đồ nhỏ trục Mệnh (tam hợp Quan Lộc, Tài Bạch; xung chiếu Thiên Di) và mũi tên Bắc. Bốn phía ghi đường kích thước "ĐV 22–31"; đại vận đang đi in màu đất nung kèm chữ "2027". Mỗi gian có số gian đếm từ Mệnh, nhãn "Tam hợp Mệnh" hoặc "Xung chiếu Mệnh". Nhận định hiện như một ghi chú trên bản vẽ, kèm hai gian Nô Bộc và Phúc Đức có khoanh nét đứt đúng sao làm căn cứ.

**Hệ nhận diện:** nền giấy can xanh xám mặc định (có bản tối). Archivo với trục độ rộng 62–125% (bản rộng in hoa cho nhãn gian) + Spectral cho đoạn đọc. Lưới 24px và 120px, góc bo 0 cho bản vẽ, ba cấp nét. Chuyển động: trục tam hợp "vẽ" ra trong 1,2 giây.

**Bách khoa:** cả site là một tòa nhà nhiều gian. Tử vi là gian lớn nhất, các mảng khác là gian nhỏ hơn có số gian. Ẩn dụ này mở rộng tự nhiên khi thêm mảng mới.

| Ưu | Nhược |
|:--|:--|
| Ẩn dụ giải thích được "cung là gì" cho người mới mà không cần chữ | Nhìn thoáng qua có thể giống trang kiến trúc hay bất động sản, chưa ra ngay là tử vi |
| Điềm tĩnh nhất, hợp "không hù dọa" nhất | Dễ nhầm ý: "nhà" trùng với cung Điền Trạch (nhà cửa). Cần câu chữ cẩn thận |
| Giữ lưới 4×4 chuẩn nên P2 đọc được ngay, lại có thêm ký hiệu kỹ thuật | Trên bảng tin, ảnh ít "bắt mắt" hơn A (tối, tròn) và B (màu mạnh) |
| Cách lá số được trình bày gần như chưa ai làm. Có nét Việt ở chi tiết sân trong | Chi tiết nét mảnh (kích thước, cửa) sẽ mất khi thu nhỏ trên điện thoại. Bản mobile chỉ còn mặt bằng gọn |

---

## So nhanh (điểm 1–5 là [SUY LUẬN] của em, chưa thử với người dùng)

| Tiêu chí | A · Đài thiên văn | B · Sổ tay dạ quang | C · Ngôi nhà 12 gian |
|:--|:-:|:-:|:-:|
| Khác đối thủ ngay cái nhìn đầu | 5 | 4 | 4 |
| Hợp P1 (trẻ, lướt điện thoại, sợ bị dọa) | 3 | 5 | 4 |
| Hợp P2 (cần đủ sao, đúng học thuật) | 5 | 3 | 4 |
| Thể hiện "minh bạch, có căn cứ" | 4 | 5 | 4 |
| Ảnh chia sẻ nổi trên bảng tin | 5 | 4 | 3 |
| Dùng được cho trang chủ bách khoa nhiều bài | 3 | 5 | 4 |
| Công làm (5 = dễ nhất) | 2 | 5 | 3 |

---

## Em khuyên: Hướng B, và mượn một ý của A

**Chọn B làm nền** vì ba lý do:
1. **Khớp định vị nhất.** Khác biệt cốt lõi trong 04 là "mỗi kết luận gắn căn cứ sao–cung". B biến cam kết đó thành thứ nhìn thấy và bấm được (vệt dạ quang), thay vì chỉ là một dòng chữ.
2. **Khớp persona chính.** P1 lướt Facebook trên điện thoại. B sáng, ấm, chữ to, form điền như kể chuyện. Nó trái hẳn với đỏ–vàng–ông thầy của trang Việt, và trái với vẻ lạnh của Co–Star.
3. **Hợp quy mô bách khoa và sức một người làm.** Nền sáng đọc bài dài tốt, kiểu mục lục tạp chí chứa được hàng trăm mục từ. Lá số dựng bằng CSS grid nên làm nhanh nhất trước mốc Tết trong 04.

**Mượn từ A:** đưa ảnh chia sẻ của B thêm một bản nền tối (nền than `#15171C` có sẵn trong token tối của B). Ảnh lá số tối nổi trên bảng tin hơn, như ảnh A đã cho thấy.

**Hai điều kiện để B không thành "template":**
- Giảm bóng đặc và bo tròn. Chỉ giữ **vệt dạ quang** và **đường đời có số tuổi** làm hai dấu nhận diện riêng.
- Kho văn tĩnh phải có tham chiếu máy đọc được cho từng câu (ví dụ `{cung: 7, sao: "thienTuong"}`) để tô đúng chỗ. Nếu chưa làm kịp trước Tết thì tạm tô cả cung.

**Nếu anh ưu tiên P2 hoặc ấn tượng thị giác hơn P1,** chọn A. Khi đó cần thử nhanh với 3–5 người P2 xem vòng tròn có làm họ mất tin không.

---

## Việc còn lại sau khi chụp ảnh (em chưa mở được trình duyệt để tự xem)

Em đã đọc lại mã từng tệp để soát thẻ đóng mở, dữ liệu sao và logic JS, nhưng **chưa thấy bản render thật**. Khi chụp, Claude Code nên soát kỹ các chỗ dễ lỗi sau:
- **A:** chữ trong các múi chéo của vòng (Tỵ, Mùi, Sửu, Hợi) có chạm vạch chia không; nhãn "TUẦN", "TRIỆT" trong đĩa giữa; bảng 12 ô nhỏ trong ảnh chia sẻ có bị cắt chữ không (mỗi ô cao cố định 150px).
- **B:** vị trí các vòng số tuổi trên đường bao ở 375px; nhãn "2027: bạn 30 tuổi mụ" có đè lên chữ không; ô Thiên Di và Điền Trạch trong ảnh chia sẻ (cao 262px) có bị cắt dòng sao lưu không.
- **C:** đường kích thước bốn phía có thẳng hàng với vách không; chữ xoay dọc ở hai bên; khung tên ở sân trong ảnh chia sẻ có tràn không.
- **Cả ba:** tải font Google có lỗi gì không; ảnh chia sẻ chụp với `?chup=1` phải ra đúng 1080×1350.

# 05 — Vòng 4: hướng E3 "Sơn mài đêm trăng" (nâng từ E2)

> Ngày lập: **20/11/2026**. Tệp: [`huong-e3.html`](huong-e3.html). Không sửa `huong-e2.html` và các bản cũ.
> Đầu vào: `huong-e2.html` (đã gồm 4 chỗ Claude Code sửa ở mục 7 của `04-vong-3.md`), ảnh `vong3/e2-la-so-1366.png`, `huong-e2-1366.png`, `huong-e2-chia-se.png`, ảnh tuvi.vn `doi-thu/11-tuvi-vn-la-so-luoi-desktop.png`, [`la-so-mau.json`](la-so-mau.json).
>
> **Lưu ý về brief:** em không tìm thấy tệp `briefs/10-thiet-ke-a-dong.md` trong kho (Glob và Grep đều không ra). Em giữ quy ước lá số theo bản đã chép lại ở `03-vong-2.md` mục 2.1 và theo E2. Nếu brief gốc có điểm nào khác thì cần đối chiếu lại.
>
> **Em chưa mở được trình duyệt.** Mọi chỗ ghi "vừa", "không đè" dưới đây là em tính theo kích thước CSS và bề rộng ước lượng của font. Claude Code cần chụp ảnh để xác nhận (mục 6).

---

## 1. Ý anh → cách làm ở E3

### 1.1. Màu tổng thể: "sâu và huyền bí hơn"

| Ý anh | Cách làm ở E3 |
|:--|:--|
| Sơn đen sâu hơn, nhiều lớp, pha xanh chàm đêm | `--bg-den` gồm 4 lớp: nền `#0C0809 → #070405` (tối hơn E2 `#1C0B08`), quầng chàm `rgba(38,52,104,.5)` tỏa từ góc trên phải, quầng son trầm ở góc trên trái, dải bóng chéo rất mờ như mặt sơn đánh bóng. Khung lá số và ô sơn mài nhỏ dùng `--bg-khung` mới, ngả đen tím (`#2A1218 → #070304`) |
| Vàng lá mạnh, quý hơn | Gradient kim loại 7 nấc (`--vang-la`, SVG `#vl`), có nấc gần trắng `#FFF0BE` để ánh lên. Thêm `#vl-i` (userSpaceOnUse) cho biểu tượng, để nét ngang đơn không bị mất (gradient theo bounding box làm nét thẳng một chiều không hiện) |
| Nhũ vàng rắc rất nhẹ | `--bui`: nhiễu fractal lọc ngưỡng gắt, chỉ còn những chấm vàng lẻ, phủ ở đầu trang, header, khối giá, chân trang, ô tranh bách khoa |
| Đỏ son làm điểm nhấn | Giữ: menu, triện, nhãn Tuần/Triệt/Thân, thẻ gói 149.000đ, lề son trang nhận định, chữ "Căn cứ" |
| Đoạn dài trên ngà, nền tối cho đầu trang, dải phân đoạn, khung, giá, chân trang | Nhịp trang: header tối → tranh tối → **dải giới thiệu ngà** (đoạn giới thiệu và 3 cam kết đã chuyển xuống đây, không còn nằm trên nền tối như E2) → dải mây tối → lá số kem → nhận định ngà → dải mây → giá tối → dải mây → bách khoa kem → chia sẻ ngà → hồ sơ kem → chân trang tối |
| Quầng đèn dầu hoặc trăng | Có cả hai: quầng trăng bán kính 170, quầng đèn dầu bán kính 140 phủ lên thầy và người xem, quầng ấm hắt ra từ gian giữa đình |
| Khói hương mảnh, rất chậm, tắt khi giảm chuyển động | 3 sợi khói từ lư hương trước sân đình, nét 1,3, gradient mờ dần lên trên, chạy nét 26 giây/vòng và lắc ngang 7px trong 18 giây. Tắt khi `prefers-reduced-motion` và `?chup=1` |
| Bụi sao vàng, tiết chế | Khoảng 100 chấm sao, 1/9 là sao 4 cánh vàng lá lấp lánh 6–9 giây. Không đặt sao sau vùng chữ tiêu đề |

### 1.2. Đầu trang: tranh làng quê

| Ý anh | Cách làm ở E3 |
|:--|:--|
| Tranh SVG nội tuyến, phong cách sơn mài | Một nhóm `#tranh` trong sprite ẩn, dùng lại bằng `<use>` ở hai chỗ: tranh nền desktop (1920×820) và dải tranh mobile (cắt khung `viewBox="190 290 940 470"`). Mảng bóng phẳng sơn đen, nâu cánh gián, son trầm. Viền và điểm sáng vàng lá. Trăng khảm vỏ trứng |
| Cây đa, mái đình, sân đình, thầy bói, người xem, trăng, mây, sao | Có đủ. Mô tả chi tiết và tọa độ ở mục 3 |
| Desktop: tranh làm nền cả bề ngang, chữ và form đặt lên trên | Tranh rộng cố định 1920px, căn giữa, nên tọa độ vùng chữ không đổi theo bề rộng màn hình (mép trái nội dung luôn ở x = 400 của tranh). Cảnh chính đặt **dưới tiêu đề, bên trái form**, nên không bị form che |
| Chữ tương phản ≥ 4,5:1 | Tiêu đề nằm trên vùng trời `#0B0C1C`, không có sao, có thêm quầng tối `rgba(5,6,14,.6)` sau chữ. Chữ `#F7EBD0` trên nền đó khoảng 16:1. Chỗ sáng nhất gần tiêu đề là rìa quầng trăng, khoảng 13,9:1 |
| Form vẫn nổi rõ | Tờ ngà như E2, khung đen 6px, chỉ vàng, thêm quầng vàng ấm rất nhẹ quanh form |
| Mobile: dải ngang phía trên tiêu đề, không che form | Ở ≤ 1000px, tranh nền ẩn, hiện dải tranh cao `clamp(170px, 46vw, 380px)`, `slice` neo đáy. Ở 375px dải cao khoảng 172px, thấy trăng, tán đa, đình, hai người. Form nằm dưới tiêu đề |
| Logo triện kèm chữ | Triện son 58px, vạch vàng dọc, chữ "xemboi.vn" vàng lá nghiêng, dòng phụ có hai hạt thoi vàng |
| Menu có dải hoa văn vàng | Dải hồi văn vàng 12px giữa header và menu. Menu son có chỉ vàng trên dưới và thêm một vạch vàng bóng đổ phía dưới |
| Mục đang chọn rõ | Ô đang chọn là "thẻ" sơn đen giữa nền son, vạch vàng lá 3px ở mép trên, hai chỉ vàng hai bên, chữ vàng sáng đậm 700, hạt xà cừ ở đáy, `aria-current="page"` |

### 1.3. Lá số

| Ý anh | Cách làm ở E3 |
|:--|:--|
| a. Chữ to hơn | Ở desktop: phụ tinh **15px** (dòng 21), chính tinh **17,5px đậm** (dòng 24), tên cung **16px đậm** (dòng 23), góc ô 13,5/12,5px (dòng 18), dòng đáy **12,5px** (dòng 18). Ô sao lưu "L" 15px |
| Lá số rộng tới khoảng 1240px | Khung ngoài 1236px. Lưới 1190px, ô 297px (E2 274,5px) |
| Ô cao thêm, Thiên Di và Điền Trạch nhiều sao nhất | Hàng trên **312px** (chứa Tỵ, Thân), ba hàng dưới 280px. Phép tính ở mục 5 |
| b. Màu sao rực hơn | Hỏa `#C8150C`, Mộc `#1A7429`, Thổ `#A04F00`, Thủy `#102A5C`, Kim `#5E6670`. Mọi màu ≥ 4,9:1 ở mép ngà. Bảng ở mục 2 |
| Kim, Thủy tách khỏi chữ mực | Kim là xám ánh lam, sáng hơn mực rõ (độ chói 0,13 so với 0,008 của mực). Thủy là xanh lam đậm, khác sắc với mực nâu đen |
| c. Thiên bàn: bỏ bia, bảng đặt thẳng trên ngà | Bảng, tiêu đề "Lá Số Tử Vi", dòng "xemboi.vn · quy ước Nam phái" đặt thẳng trên nền ngà, căn giữa. Chỉ có quầng ngà sáng rất mờ ở tâm |
| Tam hợp, xung chiếu rõ, liền mạch, chạy sau chữ | SVG nằm dưới chữ (z-index thấp hơn). Tam hợp nét liền `#B3261C` 1,7px, độ đậm 0,88. Xung chiếu nét đứt `#8A6420` 1,5px. Không còn lớp nét mờ phụ |
| Chữ có quầng ngà | Toàn khối chữ Thiên bàn có `text-shadow` 14 lớp màu `#FBF7EC` (8 hướng lệch 1px, 4 hướng lệch 2px có nhòe, 1 quầng 6px). Nét đi qua chữ bị "khoét" quanh nét chữ |
| Tiêu đề, triện son, bát quái chìm | Tiêu đề Alegreya nghiêng 40px. Triện 72px ở góc phải dưới, dưới cạnh Tuất–Dần của tam giác. Bát quái 400px ở tâm, độ đậm 0,07 |
| d. Khung mỏng còn khoảng một nửa | Khung sơn 24px → **12px**. Viền son 6px → **3px**. Chỉ vàng kép → một chỉ vàng. Góc hoa văn 60px → **40px** (giữ hồi văn và cuộn mây) |
| Giữ: Tuần/Triệt không đè chữ | Nhãn giờ nằm **giữa vạch như tuvi.vn**: Tuần trên vạch Thân–Dậu, Triệt trên mép trên của Sửu–Tý, tại vạch chia hai cung. Vị trí đo bằng `offsetLeft/offsetTop` sau khi dựng. Hai ô kề mỗi nhãn được nới 14px đệm (Thân đệm dưới, Dậu đệm trên, Sửu và Tý đệm trên) |
| Giữ: sao lưu có ô "L", chú giải, ô Mệnh nổi, dữ liệu đúng JSON | Giữ. Ô Mệnh thêm viền kép (son trong, chỉ vàng mảnh). Dữ liệu `CUNG`, `LUU`, `TB` chép nguyên từ E2, không đổi |

### 1.4. Phần dưới lá số

| Ý anh | Cách làm ở E3 |
|:--|:--|
| Đoạn chuyển có dải hoa văn hoặc mây vàng | Hai loại: **dải mây** (46px, sơn đen, mẫu mây cuộn và hạt thoi vàng lặp ngang, chỉ vàng kép trên dưới) giữa vùng sáng và vùng tối. **Mây chuyển** (đường chỉ vàng, mây vàng ở giữa, nằm vắt qua ranh giới) giữa hai vùng sáng |
| Tiêu đề mục có họa tiết chung | Mọi mục đều có cùng một bộ: ấn tròn có sao 4 cánh, hai cuộn mây hai bên (92×30), tiêu đề Alegreya 44px, đoạn mô tả, vạch chia có hạt thoi viền kép |
| Khoảng cách đều nhịp | Mọi mục 84px trên dưới (mobile 54px), tiêu đề cách nội dung 42px |
| Nhận định như trang sách cổ hoặc cuộn giấy | Hai trục cuộn sơn đen đầu vàng ở trên và dưới. Giấy ngà có thớ, **lề son kép** bên trái, số mục "I · 2027" ở lề. Đoạn văn có chữ hoa đầu đoạn lớn màu son |
| Nhãn căn cứ rõ | Thẻ son "CĂN CỨ" đứng trước câu căn cứ (nguyên văn `chuDe2027.canCu`), chữ son đậm |
| Trích sao dẫn chứng đẹp | Hàng "Sao dẫn chứng": các thẻ ngà nhỏ, chữ màu theo hành như trên lá số: Nô Bộc (Mùi), L. Thái Tuế, Thiên Tướng (Đ), L. Hóa Lộc → Thái Âm, Phúc Đức (Thìn). Tất cả lấy từ câu căn cứ và `luuNien2027`, không thêm sao mới |
| Bảng giá: gói 149.000đ là "đồ quý" | Thẻ sơn son nằm trên nền sơn đen, viền vàng lá kép, quầng vàng mờ, 4 góc hoa văn vàng, số giá 54px vàng lá, nhãn "Gói chính" vàng lá ở giữa mép trên |
| Gói miễn phí giản dị hơn | Chỉ có viền kem mảnh, không nền, giá 40px màu kem |
| Rõ ràng, không câu ép mua | Giữ nguyên chữ của E2. Không gạch giá, không đếm ngược |
| Bách khoa: ô kiểu tranh sơn mài nhỏ | Mỗi ô gồm hai phần. Trên là **tấm sơn mài** cao 104px (đen hoặc son xen kẽ, nhũ vàng, chỉ vàng trong). Dưới là phần chữ trên ngà: tên 21px, mô tả 15px màu mực |
| Biểu tượng vàng lá vẽ tay | 9 biểu tượng: lá số 12 cung có sao (Tử vi), lịch có trăng (Lịch âm), **đôi chim trên cành, có tim** (Xem tuổi), lịch có mặt trời (Xem ngày), 4 trụ (Bát tự), quẻ 6 hào (Kinh Dịch), ô Lạc thư (Thần số học), **la bàn** (Phong thủy), sách (Từ điển) |
| Tờ lịch bloc giống thật | Gáy sơn đen có 2 ghim kim loại. Tờ giấy có mép răng cưa và 4 lớp tờ xếp chồng ở dưới. Đầu tờ: "THÁNG MƯỜI MỘT · 2026" chữ son, gạch son. Số ngày **128px đỏ**. Thứ in hoa giãn chữ. Ngày lễ màu xanh. Phần âm lịch hai cột: số ngày âm lớn và tháng; can chi ngày, tháng, năm, tiết. Giờ hoàng đạo. **Câu ngạn ngữ**: tục ngữ quen thuộc "Không thầy đố mày làm nên.", hợp với ngày 20/11 |
| Chân trang sơn đen sâu, dải hoa văn, cột link gọn | Dải mây vàng ở trên, dải hồi văn ở dưới. Logo có triện. Tiêu đề cột vàng lá, có chỉ vàng dưới. 4 cột (mobile 1 cột) |

### 1.5. Giữ nguyên

- Nội dung chữ và dữ liệu của E2. Chỉ thêm 2 dòng: chú thích tranh (ẩn với trình đọc màn hình) và hàng "Sao dẫn chứng" (trình bày lại dữ liệu đã có).
- Lịch bloc: dữ liệu như E2, vẫn ghi "chưa kiểm bằng engine lịch".
- Ảnh chia sẻ `#anh-chia-se` 1080×1350, `?chup=1` bỏ scale và tắt chuyển động. Đã đổi theo lá số mới: khung 14px, viền son 3px, màu sao mới, Thiên bàn không bia, nhãn Tuần/Triệt giữa vạch. Chiều cao trong: 2×14 + 2×3 + 2×10 + 86 + 8 + (300 + 3×280 + 2) + 8 + 44 = **1342px**, dư 8px.
- Font: Alegreya và Be Vietnam Pro (subset vietnamese đã kiểm ở `04-vong-3.md` mục 3). Không thêm họ font.
- Mobile 375px: form, menu cuộn có dấu "›", lưới thu nhỏ có nút Phóng to, danh sách 12 cung, giữ như E2.

---

## 2. Bảng màu mới và tương phản

**Cách tính.** Em tính tay theo công thức độ chói tương đối WCAG 2.x (như `04-vong-3.md` mục 2). **Chưa đo lại bằng công cụ.** Số làm tròn 1 chữ số.

### 2.1. Ngũ hành trên nền ô lá số

| Hành | E2 | **E3** | Độ chói L | Giữa ngà `#FBF5E8` | **Mép ngà `#F6ECD7`** | Ô Mệnh `#FAF0DC` |
|:--|:--|:--|:-:|:-:|:-:|:-:|
| Kim, xám bạc ánh lam | `#4A4F58` | **`#5E6670`** | 0,131 | 5,3 | **5,0** | 5,1 |
| Mộc, xanh lá tươi | `#1B5A25` | **`#1A7429`** | 0,129 | 5,4 | **5,0** | 5,2 |
| Thủy, xanh lam đậm | `#14233A` | **`#102A5C`** | 0,025 | 12,8 | **11,9** | 12,3 |
| Hỏa, đỏ tươi | `#9C1810` | **`#C8150C`** | 0,128 | 5,4 | **5,0** | 5,2 |
| Thổ, cam vàng | `#7E3D00` | **`#A04F00`** | 0,131 | 5,3 | **5,0** | 5,1 |

- Mọi màu đều qua AA (≥ 4,5:1) cho chữ thường ở điểm bất lợi nhất. Chính tinh 17,5px đậm là chữ lớn (ngưỡng 3:1), nên dư nhiều.
- Muốn rực hơn nữa thì sẽ rơi xuống dưới 4,5:1. Ví dụ cam `#B85C00` chỉ khoảng 3,9:1 ở mép ngà.
- **Phân biệt với chữ mực `#1F140D`** (L ≈ 0,008): Kim sáng hơn mực khoảng 3:1 về độ chói và có ánh lam. Thủy gần mực về độ sáng nhưng khác hẳn sắc (lam, không nâu).

### 2.2. Nền tối mới và chữ trên đó

| Cặp | Tỉ lệ |
|:--|:-:|
| `--kem #F3E8D0` trên nền đen `#0C0809` / chỗ sáng nhất của quầng chàm (≈ `#191E38`) | 16,6 / 13,4 |
| `--kem-2 #D9C9A6` trên nền đen / quầng chàm | 12,4 / 10,0 |
| `--vang #E6C77E` (tiêu đề, nhãn) trên quầng chàm | 10,0 |
| Tiêu đề trang `#F7EBD0` trên trời trong tranh `#0B0C1C` | 16,4 |
| Tiêu đề trang ở rìa quầng trăng gần nhất (≈ `#201F29`) | ≈ 13,9 |
| Chữ kem trên thẻ son của gói chính, chỗ sáng nhất `#A3241A` | 6,1 (`--kem-do` 5,3) |
| Nhãn Tuần/Triệt `#F6E6BE` trên `#6E150E` | 9,6 (như E2) |
| Số ngày lịch bloc `#B3181A` trên giấy `#FFFDF7` | ≈ 6,5 |

Các cặp khác (mực trên ngà, nút, viền ô nhập) giữ như `04-vong-3.md` mục 2.

---

## 3. Bức tranh đầu trang

### 3.1. Hệ tọa độ

- `viewBox` 0 0 1920 820, vẽ ở cỡ thật 1920×820 px, căn giữa đầu trang (`left:50%; margin-left:-960px`).
- Mép trái nội dung luôn ở **x = 400** của tranh, ở mọi bề rộng màn hình lớn hơn 1160px. Ở 1366px:
  - cột chữ: x 400–1004;
  - form: x 1060–1520.
- Vùng tiêu đề và chữ: x 400–1000, y khoảng 70–270. Vùng này để trời trống, không sao.

### 3.2. Các lớp, từ xa đến gần

| # | Lớp | Tọa độ chính | Màu, chất |
|:-:|:--|:--|:--|
| 1 | Trời | cả khung | Chuyển từ chàm đêm `#060816` xuống nâu đất `#1E100B`, thêm quầng chàm tâm (1300, 140) |
| 2 | Sao | y < 470, tránh vùng chữ, quanh trăng và vùng tán | Chấm vàng nhạt, 1/9 là sao 4 cánh vàng lá lấp lánh |
| 3 | Trăng khảm vỏ trứng | tâm (905, 392), r 50, viền vàng r 52,5, quầng r 170 | Cách làm vỏ trứng giữ từ E2 đã sửa (mảnh vàng ngà, khe mảnh, co 0,93) |
| 4 | Mây | (150, 200) 210×56; (1560, 170) 230×62; (1230, 300) 150×40 | Mây cuộn sơn son viền vàng (symbol của E2) |
| 5 | Lũy tre xa | hai lớp, đỉnh y 588–632 và 628–662, chân y 712 | Viền gợn sóng bằng cung tròn, đen chàm, viền vàng 0,1–0,16 |
| 6 | Cây cau (chỉ thấy ở màn rộng) | thân x ≈ 1640 và 1806 | Bóng đen, lá có nét vàng |
| 7 | **Đình** | mái dưới: hai đầu đao (724, 546) và (1116, 546), bờ nóc y 522–531, diềm mái y 592. Mái trên (chồng diêm): x 838–1002, bờ nóc y 487–494, mặt nguyệt (920, 478) r 6,5. Tường, cột: x 790–1050, y 590–660. Nền, bậc: y 660–684 | Mái nâu cánh gián chuyển sắc, viền vàng. **Ngói âm dương gợi bằng 26 nét vàng dọc** (độ đậm 0,32). Hai đầu kìm cong ở bờ nóc. 6 cột son. Gian giữa hắt ánh đèn ấm |
| 8 | Sân đình | y 684–820 | Nâu đất, gạch gợi bằng vạch vàng rất mờ, vạch dọc hội tụ về (920, 600). Một dải sương mờ y 630–710 |
| 9 | **Cây đa**: tán sau | 6 cụm: (160, 490), (230, 440), (340, 380), (480, 350), (620, 385), (720, 450), bán trục 70–140 × 36–66 | Cụm lá viền "vỏ sò" (các cung lồi ra), viền vàng lá, một vòng trong mờ, vài mảnh vàng quỳ. Ba sắc: nâu cánh gián, đen, son trầm |
| 10 | Rễ phụ | 8 sợi buông từ y ≈ 520: x 286, 312, 340, 372, 590, 618, 648, 676; 4 sợi chạm đất (y 704–726) | Nâu đen, hai sợi có ánh vàng |
| 11 | Thân đa, cành | thân từ chân x 396–552 (y 724) lên chạc y ≈ 530; 3 cành chính vào tán | Gốc bành ra, vân vàng mờ dọc thân |
| 12 | Tán trước | 3 cụm: (300, 500), (470, 470), (630, 500) | Che chạc cây, cho tán có chiều sâu |
| 13 | Chiếu | hình thang (630–874 ở y 714, 606–900 ở y 752) | Nâu cói, viền son, chỉ vàng trong, nan chéo mờ |
| 14 | Quầng đèn dầu | tâm (762, 694), r 140 | Vàng cam, chập chờn 5 giây |
| 15 | **Thầy bói** | đầu (693, 666) r 8,2; khăn xếp y 651,5–664; vai y 680, x 679–706; lưng thẳng xuống hông y ≈ 706; chân xếp bằng: gối sau x 661, gối trước x 727, đáy y 729 | Áo the đen, cổ giao lĩnh vàng có lót trắng, khăn xếp đen 2 nếp vàng, râu bạc. Tay trước cầm sách mở (x 720–744, y 694–703), tay sau đặt trên gối. Viền vàng ở phía mặt hướng về đèn |
| 16 | **Người xem** | đối xứng thầy qua trục x = 759,5 (`matrix(-1 0 0 1 1519 0)`): đầu (826, 667), thân x 792–858 | Áo tứ thân nâu cánh gián, yếm đỏ, khăn vấn, búi tóc, hai tay chắp trước ngực |
| 17 | Tráp, đèn dầu, ống thẻ | tráp x 750–788, y 710–729; đèn trên tráp, ngọn lửa (762, 688–698); ống thẻ x 776–783 có 3 thẻ | Tráp sơn son viền vàng, đèn đồng, bóng đèn thủy tinh mờ |
| 18 | Nón lá | x 896–930, y 726–750 | Vàng rơm chuyển sắc, nan mờ |
| 19 | Lư hương, khói | lư x 968–1002, y 664–722; 3 nén hương đầu đỏ; khói lên tới y ≈ 410 | Đồng tối viền vàng. Khói kem mờ dần |

**Tỉ lệ.** Người ngồi cao khoảng 77px (đỉnh khăn 651,5 → đáy 729). Cây đa cao khoảng 440px (đỉnh tán ≈ 285 → gốc 724), gấp khoảng 5,7 lần người. Tán rộng khoảng 680px. Đình nằm sau cây và hai người, nóc mái dưới ở y 522, nền đình ở y 660–684, cao hơn mặt chiếu để ra cảm giác xa.

**Mobile.** Cùng nhóm `#tranh`, khung cắt `190 290 940 470`, neo đáy. Ở 375px thấy phần y ≈ 330–760: trăng, tán đa, đình, hai người, lư hương.

### 3.3. Chỗ em chưa chắc

1. **Dáng thầy bói** em dựng bằng toạ độ, chưa nhìn thấy hình.
   - Thân hình em vẽ ở góc nghiêng ba phần tư. Gối trước và gối sau cách nhau 66px, rộng hơn dáng nghiêng thật một chút, để đọc ra là "ngồi xếp bằng". Nếu trông như "ngồi trên đệm tròn" thì nên thu gối sau vào khoảng 6px.
   - Lưng: từ vai (y 680) xuống hông (y 706) chỉ 26px. Nếu người trông lùn, nên kéo vai lên 4px và dời đầu, khăn lên theo.
   - Tay cầm sách: sách nằm ngang tầm ngực, chìa ra trước gối. Ở cỡ nhỏ có thể đọc thành "đang bưng khay".
2. **Khăn xếp** chỉ là một vòm dẹt có 2 nếp vàng. Ở 77px rất khó ra đúng nếp khăn xếp. Có thể trông giống mũ. Nếu vậy nên bỏ một nếp và làm vòm dẹt hơn.
3. **Người xem** em vẽ bằng cách lật ngang dáng thầy, đổi áo và khăn. Dáng nữ có thể hơi thô vì vai bằng vai thầy. Nếu cần, thu `scale(.94)` quanh đáy.
4. **Cụm lá đa** sinh bằng mã (viền vỏ sò, hạt giống cố định). Em chưa chắc trông ra "tán đa cổ thụ" hay giống "mây". Rễ phụ là 8 nét thẳng hơi lượn, có thể quá đều.
5. **Mái đình** nhìn chính diện, hai đầu đao cong lên. Đầu đao có thể chưa đủ vút. Nếu chưa đẹp, đẩy đỉnh đao lên khoảng 10px: (724, 546) → (720, 536).
6. **Vùng chữ và tán cây.** Đỉnh tán (y ≈ 280) sát đáy tiêu đề nếu tiêu đề xuống 3 dòng (y ≈ 266). Dòng chú thích nghiêng dưới tiêu đề có thể chạm viền vàng của tán. Em đã thêm bóng tối cho chữ, nhưng nên xem ảnh.
7. **Chuyển động trong `<use>`**: khói, đèn, sao nằm trong sprite rồi được `<use>` dựng lại. Trình duyệt hiện đại thường vẫn chạy CSS animation trong bản sao này. Nếu không chạy thì tranh đứng yên, không hỏng hình.

---

## 4. Thiên bàn mới: vị trí các nét

- Kích thước thật của Thiên bàn được **đo bằng `clientWidth/clientHeight` sau khi dựng**, không ghi cứng như E2. Desktop khoảng 593×559, ảnh chia sẻ khoảng 512×559.
- Đầu mút: Dần ở góc trái dưới, Ngọ ở 1/4 cạnh trên, Tuất ở 3/4 cạnh phải, Thân (xung chiếu) ở góc phải trên. Lùi vào 8px. Cách đặt giống E2 và tuvi.vn.
- Cạnh Ngọ → Tuất cắt qua dòng phụ và phần phải của bảng. Cạnh Dần → Thân (nét đứt) cắt ngang bảng. Chữ đọc được nhờ quầng ngà.
- Triện ở góc phải dưới (cách mép phải 24px, mép dưới 30px), nằm dưới cạnh Tuất → Dần.
- Nhãn Triệt nằm giữa đáy Thiên bàn, nửa trên nhãn lấn vào Thiên bàn 11px. Chú giải "Tam hợp / Xung chiếu" kết thúc ở khoảng y 505, còn hở khoảng 40px.

---

## 5. Tự soát tệp

- **Thẻ đóng.** Em liệt kê mọi `<div` và `</div>` theo dòng (Grep), soát từng khối tĩnh và từng chuỗi JS (`veO`, `veTB`, `veDS`). Tất cả đều khớp. `section`, `article`, `aside`, `form`, `ul`, `details` em soát bằng mắt, cũng khớp.
- **Đủ sao so với JSON.** Mảng `CUNG`, `LUU`, `THANG`, `TB` chép nguyên từ E2. E2 đã soát với JSON (`04-vong-3.md` mục 4): 14 chính tinh, 83 phụ tinh, 9 sao lưu, 4 Lưu Tứ Hóa.
- **Ô nhiều sao nhất, cỡ chữ mới** (desktop):
  - **Tỵ (Điền Trạch)**, cột cát 7 sao + L. Thiên Mã = 8 dòng. Cần: đệm 10 + đầu ô (23 + 2×24) + 10 + 8×21 + 3 + khoảng trống 6 + dòng đáy 24 + đệm 8 = **300px**, ô cao **312px**.
  - **Thân (Thiên Di)**, 2 chính tinh, 6 và 5 dòng, cộng 14px đệm Tuần: 10 + 71 + 10 + 126 + 3 + 6 + 24 + 8 + 14 = **272px** ≤ 312px.
  - Mão (6 dòng) 234px; Sửu (2 chính tinh, 4 dòng, đệm Triệt 14px) 230px; đều ≤ 280px.
  - Ảnh chia sẻ: Tỵ cần khoảng 265px (ô 300px), Thân khoảng 243px.
- **Bề ngang** (ước theo bề rộng đo được trên ảnh E2, nhân tỉ lệ cỡ chữ):
  - "THIÊN LƯƠNG (V)" ở E2 15px đo khoảng 130px → 17,5px khoảng 152px. Cột giữa rộng 163px.
  - Chính tinh dòng 2 trở xuống nằm thấp hơn hai cột góc, nên kể cả có tràn vài px cũng không chạm chữ.
  - Phụ tinh: cột 133px. "Kình Dương (H)" đậm khoảng 117px.
  - Ảnh chia sẻ: chính tinh 15,5px khoảng 135px trong cột 140px.
- **Overflow.** Trong lá số không có `overflow:hidden` hay `ellipsis`. Các chỗ `overflow:hidden` còn lại đều cố ý:
  - `.dau-trang` (chặn tranh 1920px tràn ngang);
  - `.ls-khung.nho`;
  - `.cs-khung` và `#anh-chia-se`;
  - `.sr`.

  Thêm `body{overflow-x:hidden}` để chặn trục cuộn của nhận định tràn ra vài px ở mobile.
- **Animation vẽ nét.** `stroke-dasharray` = chu vi tam giác tính từ toạ độ thật + 4. Desktop khoảng 1757px (561 + 600 + 592 + 4). Tắt khi `prefers-reduced-motion` hoặc `?chup=1`, nét về đủ.
- **Dung lượng.** Chỉ có HTML, CSS, JS thuần, SVG nội tuyến, không ảnh bitmap. Em ước khoảng 120–135 KB, **chưa đo byte thật** vì không có Bash. Giới hạn là 220 KB.

---

## 6. Ảnh Claude Code cần chụp

| Tệp ảnh (trong `docs/v2/thiet-ke/`) | Cách chụp |
|:--|:--|
| `huong-e3-375.png` | Toàn trang, khung nhìn 375px |
| `huong-e3-1366.png` | Toàn trang, khung nhìn 1366px |
| `huong-e3-chia-se.png` | Mở `huong-e3.html?chup=1`, chụp phần tử `#anh-chia-se`. Ảnh phải đúng 1080×1350 |

Nên chụp thêm `vong4/e3-dau-1366.png` (cận đầu trang) và `vong4/e3-la-so-1366.png` (cận lá số) để soát kỹ tranh và Thiên bàn.

![Hướng E3 ở 375px](huong-e3-375.png)
![Hướng E3 ở 1366px](huong-e3-1366.png)
![Hướng E3, ảnh chia sẻ](huong-e3-chia-se.png)

**Cần soát kỹ trên ảnh:**
- **Tranh:**
  - dáng thầy bói, khăn xếp, người xem (mục 3.3);
  - tán đa có ra "cây" không;
  - đầu đao đình;
  - khói có lộ không;
  - tiêu đề có chạm tán không.
- **Lá số:**
  - "THIÊN LƯƠNG (V)", "THIÊN TƯỚNG (Đ)" có chạm cột góc không;
  - nhãn Tuần, Triệt có đè chữ không;
  - quầng ngà có làm chữ Thiên bàn bị nhòe không;
  - tam giác có liền mạch, đủ rõ không.
- **Màu sao:** Kim và Thủy có tách khỏi chữ mực không; Thổ có ra "cam vàng" hay vẫn nâu.
- **375px:**
  - không cuộn ngang;
  - form không cắt chữ;
  - nhãn radio không rớt dòng;
  - dải tranh không che form.
- **Kỹ thuật:** console không lỗi; đo byte thật của tệp.

---

## 7. Những chỗ em chưa chắc khác

1. **Màu sao vẫn chưa rực bằng tuvi.vn.** Cam và xanh lá của tuvi.vn chỉ khoảng 2–3:1 trên nền sáng. Em giữ ≥ 4,5:1 theo yêu cầu, nên Thổ `#A04F00` vẫn trầm hơn cam tuvi.vn.
2. **Quầng chữ Thiên bàn dùng 14 lớp `text-shadow`.** Chữ có thể hơi "dày" ở màn hình độ phân giải thấp. Nếu vậy, bỏ 4 lớp lệch 2px.
3. **Nhãn Triệt giữa vạch:** em nới 14px đệm trên cho Sửu và Tý. Hàng dưới vì thế thoáng phía trên hơn các hàng khác.
4. **Lá số cao khoảng 1230px ở desktop** (lưới 1152px + chú giải). Cao hơn một màn hình, giống E2.
5. **Câu ngạn ngữ** "Không thầy đố mày làm nên." là tục ngữ phổ biến. Em chọn vì hợp ngày 20/11, chưa đối chiếu với nguồn tục ngữ cụ thể. Khi làm thật, cần một kho câu có nguồn cho từng ngày.
6. **Brief gốc `briefs/10-thiet-ke-a-dong.md` không có trong kho** (xem đầu tệp).

## Claude Code chụp và kiểm (20/11/2026)

Đã chụp `huong-e3-1366.png`, `huong-e3-375.png`, `huong-e3-chia-se.png` và thư mục `vong4/`. Kết quả kiểm ở 1366px và 375px:
- console không lỗi;
- không ô chọn nào bị cắt chữ;
- ảnh chia sẻ không tràn.

Đường tam hợp và xung chiếu hiện đúng sau khi chạy xong hiệu ứng vẽ nét (khoảng 2,4 giây).

Đã sửa một lỗi: bảng màu trong "Hồ sơ hướng" làm trang tràn ngang 427px ở mobile. Đã thêm `.hs table{display:block;overflow-x:auto}`, giờ trang đúng 375px.

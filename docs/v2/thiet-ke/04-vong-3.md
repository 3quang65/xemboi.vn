# 04 — Vòng 3: hướng E2 "Sơn mài" (bản chỉnh kỹ từ E)

> Ngày lập: **20/11/2026**. Tệp: [`huong-e2.html`](huong-e2.html). Không sửa `huong-a…f.html`.
> Đầu vào:
> - [`huong-e.html`](huong-e.html) và các ảnh `vong3/e-luoi-1366.png`, `vong3/e-375-dau.png`, `vong3/e-375-laso.png`;
> - ảnh lá số tuvi.vn `doi-thu/11-tuvi-vn-la-so-luoi-desktop.png`;
> - [`la-so-mau.json`](la-so-mau.json);
> - [`03-vong-2.md`](03-vong-2.md);
> - brief `briefs/10-thiet-ke-a-dong.md`, giữ nguyên mọi quy ước lá số bắt buộc trong đó.
>
> **Em chưa mở được trình duyệt.** Mọi chỗ ghi "vừa", "không đè" dưới đây là em tính theo kích thước CSS và bề rộng ước lượng của font. Claude Code cần chụp ảnh để xác nhận (mục 5).

Ý chính của E2:
- Sơn mài chỉ làm **khung và điểm nhấn**: đầu trang, khung lá số, khối giá, chân trang.
- Mọi phần đọc dài nằm trên **nền ngà hoặc kem, chữ mực nâu đen**. Trang có nhịp tối, sáng xen nhau: tối, kem, ngà, đỏ, kem, ngà, kem, tối.
- Lá số như **một bức tranh treo**: tấm ngà mịn, viền son, chỉ vàng kép, khung đen sơn bóng, 4 góc vàng lá.

---

## 1. Lỗi E → cách sửa ở E2

### A. Lá số

| # | Lỗi ở E | Cách sửa ở E2 |
|:-:|:--|:--|
| A1 | Tấm ngà phẳng; vân ngang như gỗ dán, nhiễu sau chữ | Bỏ hẳn vân ngang `--tho-nga`. Nền ngà là `radial-gradient`: tâm `#FDF9F0`, giữa `#FBF5E8`, mép `#F6ECD7`, nên có chiều sâu nhẹ. Thớ giấy là nhiễu đẳng hướng (không có hướng, không thành sọc), độ đậm 7%, bị mask chỉ hiện ở dải ngoài cùng (`radial-gradient(closest-side, transparent 72%, #000)`). Vùng chữ sao ở giữa ô gần như không có hạt |
| A2 | Khung chưa ra chất sơn mài | Khung 4 lớp từ ngoài vào: (1) đen sơn dày 24px, nền tỏa từ `#3A1510` ra `#0F0504`, có hai dải bóng chéo rất mờ như mặt sơn đánh bóng; (2) chỉ vàng kép (border và outline lệch vào 6px); (3) viền son `#7A1810` dày 6px, có chỉ vàng hai mép; (4) tấm ngà. Bóng đổ sâu hai tầng. 4 góc là hoa văn vàng lá tự vẽ: góc chỉ dày đè lên chỉ kép, hồi văn ở góc, hai cuộn mây ở đầu chỉ trong, nét tô bằng gradient kim loại `#vl`. Đường chia cung bên trong 1px `#CDB58C` (nâu vàng nhạt), viền lưới `#9C7E4A` |
| A3 | Thiên bàn: đường kẻ cắt ngang bảng; tam giác lệch, kéo ra tận góc; triện nhỏ; bát quái mờ | Bảng thông tin nằm trên một **bia ngà riêng**: nền đặc, viền vàng nâu, viền ngoài son mảnh, bóng nhẹ. Bia che đường kẻ, nên đường chỉ hiện ở phần rìa Thiên bàn. Tam hợp nét liền son 1,3px, **chấm tròn son ở 3 đầu** (Dần, Ngọ, Tuất). Xung chiếu nét đứt nâu vàng, đầu Thân là chấm rỗng. Đầu mút lùi vào 7px, nằm đúng trên rìa Thiên bàn về phía cung (Ngọ ở 1/4 cạnh trên, Tuất ở 3/4 cạnh phải, như tuvi.vn), không chạy ra góc ô. SVG có viewBox đúng kích thước thật của Thiên bàn (549×584px) nên chấm không méo. Triện son to lên 74px, đóng chéo đè lên góc phải dưới của bia như dấu đóng trên văn bản. Bát quái thành huy hiệu nhỏ 34px, nét rõ, ở đầu bia. Tiêu đề "Lá Số Tử Vi" là Alegreya nghiêng 700, 38px, màu son, có dòng nhỏ "xemboi.vn · quy ước Nam phái" ở trên và vạch chia vàng có hạt thoi ở dưới |
| A4 | Chữ nhỏ, ô chật | Lá số rộng 1180px (lưới 1100px, ô 274,5 × 292px; ô tuvi.vn khoảng 186px). Phụ tinh **13,5px**, dòng 20px. Chính tinh **15px đậm**, dòng 22px. Tên cung **15px đậm**, giãn chữ 0,06em, dòng 22px. Góc ô 12,5–13px. Dòng đáy 12px |
| A5 | Thổ, Kim nhạt | Cả 5 màu ngũ hành đều ≥ 7:1 ở điểm bất lợi nhất (mép ngà và ô Mệnh), bảng ở mục 2. Thổ `#7E3D00` (vàng cam sẫm, ngả hổ phách), Kim `#4A4F58` (xám bạc sẫm, hơi lạnh). Màu ô Mệnh nhạt lại thành `#FAF0DC` và đánh dấu bằng viền son trong 1,5px, để màu sao vẫn đạt 7:1 |
| A6 | Nhãn "TUẦN" đè "Tràng Sinh" và "TẬT ÁCH" | Hai cung xếp dọc (Thân–Dậu): JS thêm `dem-duoi` cho ô trên và `dem-tren` cho ô dưới, mỗi ô nới thêm 13px đệm. Nhãn cao 20px nằm giữa vạch, mỗi bên chiếm 10px, nên còn hở 3px với chữ gần nhất. Hai cung xếp ngang ở hàng dưới (Sửu–Tý): nhãn Triệt đặt hẳn phía trên vạch, như mấu thẻ dính vào vạch, nằm trong khoảng trống đáy Thiên bàn (bia kết thúc ở y = 531, triện ở y ≤ 553, nhãn ở 564–584) |
| A7 | Sao lưu in nghiêng, dày đặc | Chữ đứng, độ đậm 400 (sao thường), màu theo hành. Thay chữ "L. " bằng **ô vuông nhỏ có chữ L** (14px, viền theo màu sao). Chữ "L. " vẫn còn trong mã cho trình đọc màn hình. Nhóm sao lưu cách nhóm trên 3px, luôn xếp cuối cột. Có `title` "sao lưu năm 2027" |

### B. Màu và chất sơn mài

| # | Lỗi ở E | Cách sửa ở E2 |
|:-:|:--|:--|
| B1 | Nâu đen phủ gần cả trang, nặng, mỏi mắt | Nền tối chỉ còn ở dải trên, header, khối đầu trang (gồm form), khối giá (đỏ son) và footer. Lá số, nhận định, bách khoa, ảnh chia sẻ, hồ sơ đặt trên ngà `#F7F0E1` hoặc kem `#EEE3CB`, chữ mực `#1F140D`. Form lập lá số là tờ ngà đặt trên nền sơn đen, nên chỗ nhập liệu vẫn sáng |
| B2 | Sơn mài chưa ra chất | Đen sơn: nền chuyển sắc, quầng đỏ son tỏa từ góc trên trái, một dải bóng chéo `rgba(255,236,200,.05)` như mặt sơn bóng. Đỏ son: `radial-gradient` 4 nấc `#A3241A → #7E1A11 → #5A110B → #3E0B07`, cũng có dải bóng. Vàng lá: gradient kim loại 6 nấc sáng tối (`--vang-la`, SVG `#vl`) cho logo, tiêu đề trên nền tối, góc khung, nút, nhãn "Gói chính". Khảm vỏ trứng: trăng ở hình đầu trang, khoảng 150 mảnh ngà 5 sắc độ, khe sơn đen, có bóng cầu. Xà cừ: `conic-gradient` ánh hồng, lục, lam nhạt, chỉ ở dấu menu đang chọn và dấu đầu dòng của gói chính |
| B3 | Thiếu huyền bí ở đầu trang | Hình SVG tự vẽ 560×230: vòm sao 3 cung tròn (một cung chấm như 28 vạch tú), **chòm Bắc Đẩu** nối nét vàng mảnh, chỉ về **sao Tử Vi** (có vòng sáng và chữ "sao Tử Vi"), trăng khảm vỏ trứng viền vàng lá, 3 đám **mây cuộn sơn son viền vàng**, vài mảnh vàng quỳ. Em không vẽ rồng, phượng vì chưa chắc vẽ đẹp, đúng như brief cho phép |
| B4 | Tương phản | Chữ thường ≥ 4,5:1. Chữ chính trong lá số ≥ 7:1. Chữ vàng chỉ dùng cho tiêu đề, logo, số giá (chữ ≥ 24px). Trên nền tối không có chữ xám: chữ phụ là kem `#D9C9A6` (≥ 9,9:1) hoặc `#EAD9B4` trên đỏ (≥ 5,3:1). Chữ gradient vàng có `@supports` dự phòng: trình duyệt không hỗ trợ `background-clip:text` vẫn thấy chữ vàng đặc, không bị trong suốt |

### C. Chữ và font

| # | Lỗi ở E | Cách sửa ở E2 |
|:-:|:--|:--|
| C1 | Playfair Display kiểu Tây | Tiêu đề: **Alegreya** (500–800, có nghiêng). Thân bài và lá số: **Be Vietnam Pro** (400–700). Không dùng họ thứ 3 (lý do ở mục 3) |
| C2 | Cỡ thân, dòng, độ dài dòng | Thân 16px. Đoạn đọc dài 17px (nhận định), dòng 1,65–1,75. Đoạn nhận định giới hạn `66ch`, các đoạn khác 60–78ch. Mobile thân 16–16,5px |
| C3 | Dấu bị cắt | Không còn `overflow:hidden` trong ô cung, cũng không còn `text-overflow: ellipsis`. Chữ in hoa có dấu chồng dùng dòng ≥ 1,45 lần cỡ chữ: tên cung 15/22px, chính tinh 15/22px, nhãn Tuần/Triệt 11,5/18px. Tiêu đề dòng 1,2–1,25 |

### D. Mobile 375px

| # | Lỗi ở E | Cách sửa ở E2 |
|:-:|:--|:--|
| D1 | Select cắt chữ ("Ngày 1:", "Xem 2(") | Mỗi ô có nhãn riêng ở trên (Ngày sinh, Tháng, Năm, Giờ sinh, Phút, Năm xem), lựa chọn chỉ còn số ("15", "8", "30", "2027") hoặc "09 giờ (Tỵ)". Ở ≤ 700px, hàng giờ chia 2 cột (giờ 1,4 phần, phút 1 phần), năm xem xuống một hàng riêng. Bề rộng cột ở 375px: ngày, tháng, năm khoảng 95px mỗi cột; giờ khoảng 172px. Select dùng mũi tên tự vẽ, chừa 30px bên phải |
| D2 | Menu ngang bị cắt không gợi ý | Giữ cuộn ngang. Có `scroll-snap`. Khi còn mục bị khuất, mép phải mờ dần và hiện dấu "›". JS bỏ dấu này khi đã cuộn tới cuối |
| D3 | Danh sách 12 cung | Giữ lưới thu nhỏ, chạm hoặc bấm "Phóng to" để xem cỡ thật trong khung cuộn ngang. Thẻ cung làm lại: nền ngà, viền trái (son cho Mệnh), số thứ tự trong ô thoi, tên cung Alegreya 21px tô màu hành cung, chính tinh 15,5px, hai cột cát/sát 15,5px dòng 1,85, sao lưu có ô "L", nhãn Mệnh/Thân/Tuần/Triệt/đại vận dạng thẻ viền son |

### Phần giữ nguyên

- Nội dung chữ; 2 giá (0đ và 149.000đ); nhận định có nhãn căn cứ (nguyên văn `chuDe2027`); nút "Soi căn cứ"; bách khoa 9 mảng; lịch bloc; footer.
- Ảnh chia sẻ `#anh-chia-se`: 1080×1350, `?chup=1` bỏ scale.
  - Chiều cao trong: khung sơn 2×26, viền son 2×5, đệm 2×12, đầu 92, lưới 4×274 + 2, chân 48, hai khoảng 8. Tổng **1340px**, dư 10px.
  - Khi `?chup=1`, tắt mọi chuyển động để ảnh ra trạng thái cuối.
- Dữ liệu `CUNG`, `LUU`, `TB` chép lại từ E, đã soát lại với JSON (mục 4).

---

## 2. Bảng màu token và tương phản

**Cách tính.** Em tính tay theo công thức độ chói tương đối WCAG 2.x:
- đổi từng kênh sRGB 8 bit c sang tuyến tính: c/255 ≤ 0,04045 thì chia 12,92, ngược lại lấy ((c/255 + 0,055)/1,055)^2,4;
- L = 0,2126R + 0,7152G + 0,0722B;
- tỉ lệ = (L sáng + 0,05)/(L tối + 0,05).

Với nền chuyển sắc, em lấy điểm bất lợi nhất (mép ngà `#F6ECD7` cho chữ tối; chỗ sáng nhất của nền tối cho chữ sáng). Số làm tròn 1 chữ số. **Chưa đo lại bằng công cụ.**

### 2.1. Nền

| Token | Mã | L | Dùng cho |
|:--|:--|:-:|:--|
| `--giay` | `#FBF5E8` | 0,916 | Giữa tấm ngà lá số |
| `--giay-mep` | `#F6ECD7` | 0,845 | Mép tấm ngà, mép bia Thiên bàn |
| `--menh` | `#FAF0DC` | 0,878 | Ô cung Mệnh |
| `--nga-1` | `#F7F0E1` | 0,875 | Nền các khối đọc |
| `--nga-2` | `#EEE3CB` | 0,774 | Nền kem: lá số, bách khoa, hồ sơ |
| `--the` | `#FBF7EE` | 0,932 | Thẻ nhận định, ô bách khoa, thẻ cung |
| `--den` | `#160907` (sáng nhất `#3A1510`) | 0,004 (0,015) | Sơn đen |
| `--do` | `#8E1B12` (sáng nhất `#A3241A`) | 0,066 (0,091) | Sơn đỏ |

### 2.2. Chữ trên nền sáng

| Token | Mã | Trên `--giay` | Trên mép ngà | Trên ô Mệnh | Trên `--nga-2` |
|:--|:--|:-:|:-:|:-:|:-:|
| `--muc` | `#1F140D` | 16,6 | 15,4 | 15,9 | 14,2 |
| `--muc-2` | `#4A3829` | 10,2 | 9,5 | 9,8 | 8,7 |
| `--muc-3` (chú thích) | `#6A5442` | 6,5 | 6,0 | 6,3 | 5,6 |
| `--son` | `#8E1B12` | 8,4 | 7,7 | 8,0 | 7,1 |
| **`--kim`** | `#4A4F58` | 7,6 | **7,0** | 7,3 | – |
| **`--moc`** | `#1B5A25` | 7,6 | **7,1** | 7,3 | – |
| **`--thuy`** | `#14233A` | 14,5 | 13,4 | 13,9 | – |
| **`--hoa`** | `#9C1810` | 7,6 | **7,0** | 7,3 | – |
| **`--tho`** | `#7E3D00` | 7,6 | **7,0** | 7,3 | – |

So với E (`03-vong-2.md`, mục 2.1): Kim 4,9 → 7,6; Thổ 4,8 → 7,6; Mộc 5,5 → 7,6; Hỏa 5,9 → 7,6 (trên nền giữa tấm ngà).

### 2.3. Chữ trên sơn mài và nút

| Cặp | Tỉ lệ |
|:--|:-:|
| `--kem` `#F3E8D0` trên đen `#160907` / chỗ sáng nhất `#3A1510` | 16,0 / 13,3 |
| `--kem` trên đỏ `#8E1B12` / `#A3241A` | 7,5 / 6,1 |
| `--kem-2` `#D9C9A6` trên đen / `#3A1510` | 12,0 / 9,9 |
| `--kem-do` `#EAD9B4` trên đỏ `#8E1B12` / `#A3241A` | 6,5 / 5,3 |
| Chữ menu `#F6E6BE` trên `#7A1A12` / `#5A110B` | 8,6 / 11,2 |
| `--vang` `#E2C27A` trên đen / `#3A1510` (chỉ cho tiêu đề) | 11,4 / 9,4 |
| Nấc tối nhất của dải vàng lá `#A67C2E` trên đen (chỉ cho chữ ≥ 24px) | 5,2 |
| Nhãn Tuần/Triệt/Thân: `#F6E6BE` trên `#6E150E` | 9,6 |
| Triện: `#FBEBC8` trên `#A8231B` | 6,1 |
| Nút vàng: `#2A140C` trên nấc tối nhất `#B8913F` | 6,0 |
| Nút son: `#FBF1DA` trên `#8E1B12` / `#A3241A` | 8,1 / 6,3 |
| Viền ô nhập `#9A7B45` trên `#FBF6EA` (thành phần giao diện, cần ≥ 3:1) | 3,7 |
| Biểu tượng nâu vàng `#8A6420` trên `--the` | 5,0 |

---

## 3. Font và bằng chứng subset vietnamese

Em đọc thẳng `METADATA.pb` trong kho `github.com/google/fonts` (nhánh `main`, bản raw) ngày 20/11/2026, cùng cách làm của vòng 2.

| Font | Tệp đã đọc | Dòng subsets (chép nguyên) | Ghi chú |
|:--|:--|:--|:--|
| **Alegreya** | `ofl/alegreya/METADATA.pb` | `subsets: "cyrillic"`, `"cyrillic-ext"`, `"greek"`, `"greek-ext"`, `"latin"`, `"latin-ext"`, `"menu"`, **`"vietnamese"`** | Font biến thiên, trục `wght` 400–900; tệp `Alegreya[wght].ttf`, `Alegreya-Italic[wght].ttf`. Designer: Juan Pablo del Peral, HT Fonts |
| **Be Vietnam Pro** | `ofl/bevietnampro/METADATA.pb` | `subsets: "latin"`, `"latin-ext"`, `"menu"`, **`"vietnamese"`** | 100–900, có nghiêng. Designer: Lâm Bảo, Tony Le, ViệtAnh Nguyễn |

**Vì sao chọn Alegreya thay Playfair Display.**
- Playfair là chữ Didone: tương phản dọc gắt, chân ngang mảnh như chữ in thế kỷ 18. Đó là vẻ "tạp chí thời trang Tây".
- Alegreya là chữ có chân gốc **bút viết**: nét to nhỏ theo nhịp bút, chân nhọn, đầu nét vát. Nó gần cảm giác nét bút lông hơn, nên đặt cạnh triện, mây, hồi văn thì hòa.
- Bản nghiêng mềm như chữ viết tay. Em dùng bản này cho logo, "Lá Số Tử Vi" ở Thiên bàn và ảnh chia sẻ.
- Alegreya có đủ độ đậm 400–900, nên tiêu đề nhấn được. Prata ở F chỉ có một độ đậm.

**Vì sao giữ Be Vietnam Pro.**
- Do người Việt thiết kế, dấu tiếng Việt đặt gọn.
- Chữ in hoa có dấu chồng (Ề, Ổ, Ệ) không bị dồn. Lá số dùng rất nhiều kiểu chữ này: ĐIỀN TRẠCH, THIÊN TƯỚNG.
- Ở 13,5px vẫn rõ.
- Chỗ chật ở bản E là do ô hẹp, không phải do font. E2 nới ô ra 274px.

**Không dùng họ thứ 3.**
- Trong Google Fonts em chưa tìm được chữ thư pháp Việt thật có subset vietnamese mà đủ đẹp.
- Các chữ viết tay có subset vietnamese mà em biết (Dancing Script, Charm…) là kiểu Tây hoặc kiểu Thái, dùng cho logo sẽ lệch chất.
- Bản nghiêng Alegreya đủ làm logo. Nếu muốn logo thư pháp thật, nên đặt người viết rồi xuất SVG (như đã khuyên ở vòng 2).

---

## 4. Tự soát tệp sau khi viết

- **Thẻ đóng.** Em đếm thẻ mở và đóng của `section`, `div`, `ul`, `form`, `article`, `aside`, `header`, `footer`, `main`, `nav`, `details`, `summary`, `table`, `ol` trong phần HTML tĩnh và trong các chuỗi JS dựng ô cung, Thiên bàn, thẻ cung. Từng khối đều khớp.
- **Đủ sao so với JSON.**
  - 14 chính tinh: Tý 1, Sửu 2, Dần 0, Mão 1, Thìn 1, Tỵ 2, Ngọ 1, Mùi 1, Thân 2, Dậu 2, Tuất 1, Hợi 0.
  - 83 phụ tinh, khớp số mục `phuTinh` của từng cung: Tý 4, Sửu 6, Dần 5, Mão 7, Thìn 8, Tỵ 9, Ngọ 10, Mùi 7, Thân 10, Dậu 6, Tuất 5, Hợi 6.
  - 9 sao lưu và 4 Lưu Tứ Hóa, đúng cung theo `luuNien2027`.
  - Độ sáng và hành của phụ tinh soát lại theo `catTinh`, `hungTinh`.
- **Chỗ trong ô.**
  - Cột dài nhất là Tỵ, cột cát: 7 sao + L. Thiên Mã = 8 dòng.
  - Chiều cao cần: đệm 9 + đầu ô 66 (tên cung 22 + 2 chính tinh × 22) + 10 + 8 × 20 + 3 + dòng đáy 23 + đệm 7 = **278px**, ô cao 292px.
  - Thiên Di (2 chính tinh, cột 6 và 5, cộng 13px đệm Tuần) cần 251px. Tật Ách cũng nhỏ hơn 292px.
  - Ảnh chia sẻ: ô Tỵ cần khoảng 256px, ô cao 274px.
- **Bề ngang** (ước lượng theo bề rộng trung bình của Be Vietnam Pro).
  - Cột phụ tinh 122px. Tên dài nhất là "Kình Dương (H)" đậm, khoảng 105px.
  - Cột giữa cho chính tinh khoảng 145px. "THIÊN TƯỚNG (Đ)", "THIÊN LƯƠNG (V)" khoảng 127–131px.
  - Ảnh chia sẻ: cột phụ 112px, cột giữa 130px, chính tinh 14px khoảng 119px.
- **Overflow.** Trong lá số không còn `overflow:hidden` hay `ellipsis`. Còn `overflow:hidden` ở 4 chỗ:
  - `.dau-trang`, để chặn bóng và hình tràn ngang;
  - `.ls-khung.nho`, khung chứa lưới đã thu nhỏ;
  - `#anh-chia-se`, khung 1080×1350 cố định;
  - `.cs-khung`.

  Cả 4 chỗ đều không cắt chữ nếu kích thước đúng như tính.
- **Animation vẽ nét.** `stroke-dasharray` = chu vi tam giác tính bằng JS từ toạ độ thật, cộng 4. Ở lá số chính khoảng 1733px (584,7 + 591,3 + 552,8 + 4).
  - Khi bật `prefers-reduced-motion` hoặc `?chup=1`, animation tắt, `stroke-dashoffset` về 0, nên nét hiện đủ.
- **Dung lượng.** Chỉ có HTML, CSS, JS thuần và SVG, không ảnh bitmap, không thư viện. Em ước khoảng 85–95 KB, **chưa đo byte thật** vì không có Bash. Giới hạn là 180 KB.

---

## 5. Ảnh Claude Code cần chụp

| Tệp ảnh (trong `docs/v2/thiet-ke/`) | Cách chụp |
|:--|:--|
| `huong-e2-375.png` | Toàn trang, khung nhìn 375px |
| `huong-e2-1366.png` | Toàn trang, khung nhìn 1366px |
| `huong-e2-chia-se.png` | Mở `huong-e2.html?chup=1`, chụp phần tử `#anh-chia-se`. Ảnh phải đúng 1080×1350 |

Nên chụp thêm `vong3/e2-luoi-1366.png` (cận lưới lá số ở 1366px) để so trực tiếp với `vong3/e-luoi-1366.png`.

![Hướng E2 ở 375px](huong-e2-375.png)
![Hướng E2 ở 1366px](huong-e2-1366.png)
![Hướng E2, ảnh chia sẻ](huong-e2-chia-se.png)

**Cần soát kỹ trên ảnh:**
- **Ô Tỵ, Ngọ, Thân:** chính tinh in hoa có chạm hai cột góc không; cột phụ tinh có chạm nhau không. Không còn dấu "…" che lỗi nên nếu chật sẽ thấy chữ chồng.
- **Nhãn Tuần** (vạch Thân–Dậu) và **Triệt** (mép đáy Thiên bàn, giữa Sửu và Tý) có đè chữ nào không.
- **Thiên bàn:** đoạn đường kẻ lộ ra ở rìa có đủ để nhận ra tam hợp không, hay bị bia che quá nhiều; triện có đè chữ trong bia không.
- **Trăng vỏ trứng:** các mảnh có đều, đẹp không, hay trông như lưới ô vuông.
- **Mây cuộn** ở đầu trang có cân không.
- **375px:**
  - form không cắt chữ;
  - dấu "›" ở menu hiện, rồi mất khi cuộn tới cuối;
  - trang không cuộn ngang thừa.
- **Font:** tải được Alegreya, Be Vietnam Pro; dấu chữ in hoa (ĐIỀN TRẠCH, THIÊN LƯƠNG) không bị cắt.
- **Kỹ thuật:** không lỗi JS; đo byte thật của tệp.

---

## 6. Những chỗ em chưa chắc

1. **Bề rộng chữ là ước lượng.** Be Vietnam Pro đậm in hoa khá rộng. Nếu "THIÊN TƯỚNG (Đ)" thực tế quá 145px thì sẽ chạm cột góc. Lúc đó có ba cách:
   - giảm chính tinh xuống 14,5px;
   - thu cột góc từ 56/46px xuống 52/42px;
   - nới lá số lên 1220px.
2. **Thổ `#7E3D00` có thể bị đọc thành "nâu"** hơn là "vàng cam". Đây là đánh đổi để đạt 7:1. Nếu anh thấy lệch quy ước, có thể dùng `#8A4500` cho phụ tinh (khoảng 6,3:1, vẫn qua AA) và giữ `#7E3D00` cho chính tinh. Em chưa làm vì hai sắc Thổ trong một lá số dễ gây hiểu nhầm.
3. **Kim `#4A4F58` và Thủy `#14233A`** đều tối. Phân biệt được nhờ Kim nhạt hơn và ánh xám, Thủy gần đen ánh lam, nhưng trên màn hình rẻ có thể khó tách. Cần xem ảnh chụp.
4. **Nhãn Triệt đặt phía trên vạch** (như mấu thẻ), không nằm giữa vạch như tuvi.vn. Em làm vậy để không đè số đại vận "12" của Sửu và "G.Tý" của Tý. Nếu anh muốn giống hẳn tuvi.vn thì phải nới đệm trên của hai ô này giống cách làm với Tuần.
5. **Bia Thiên bàn che phần lớn tam giác.** Chỉ còn đoạn ở rìa và chấm đầu mút. Người quen tuvi.vn có thể thấy thiếu đường kẻ. Nếu vậy thì thu bia hẹp lại (ví dụ 340px, bảng 13px) để đường lộ nhiều hơn.
6. **Trăng vỏ trứng và mây** em vẽ bằng toạ độ, chưa thấy hình thật. Em chọn mây và sao, không vẽ rồng phượng, để tránh hình xấu.
7. **`:has()`** dùng để tô ô radio đang chọn. Trình duyệt cũ không hỗ trợ thì ô vẫn chọn được, chỉ không đổi nền.
8. **Lá số cao khoảng 1300px ở desktop**, cao hơn một màn hình 1366×768. Đây là cái giá của chữ to và ô thoáng. Tuvi.vn cũng phải cuộn.
9. **Các chỗ khác tuvi.vn do dữ liệu** vẫn như `03-vong-2.md` mục 2.5: tháng Th., LN., số sao lưu, vài độ sáng, "Thiên Riêu", thiếu Cân lượng và Lai nhân cung. E2 không đổi dữ liệu.
10. **Lịch bloc** vẫn là dữ liệu mẫu em tự tính, chưa kiểm bằng engine lịch.

## 7. Claude Code chụp và sửa thêm (20/11/2026)

Đã chụp `huong-e2-1366.png`, `huong-e2-375.png`, `huong-e2-chia-se.png` và `vong3/e2-la-so-1366.png`. Đã kiểm ở 1366px và 375px:
- console không lỗi;
- không cuộn ngang ở 375px;
- không ô chọn nào bị cắt chữ;
- không chữ nào bị overflow cắt; chỉ các thẻ `.sr` dành cho trình đọc màn hình và lưới thu nhỏ, đều là cố ý;
- ảnh chia sẻ không tràn.

Đã sửa trực tiếp trong `huong-e2.html` sau khi chụp:
1. **Tam hợp bị đứt khúc sau bia Thiên bàn.** Thêm một lớp nét mờ (độ đậm 0,16) đè lên bia. Tam giác liền mạch mà chữ trong bảng vẫn đọc rõ.
2. **Trăng khảm vỏ trứng trông như quả bóng nứt** (khe sơn đen quá dày). Đổi sang mảnh vàng ngà, khe mảnh màu vàng nâu, co mảnh 0,93 thay vì 0,8.
3. **Mây đầu trang to và nặng.** Thu nhỏ 2 đám mây lớn, sơn son trầm hơn.
4. **"Âm lịch" bị rớt dòng ở desktop.** Hai nhóm radio xếp thành 2 hàng, nhãn bên trái. Trên mobile nhãn nằm trên.

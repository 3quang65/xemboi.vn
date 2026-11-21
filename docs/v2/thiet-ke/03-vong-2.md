# 03 — Vòng 2: quen thuộc nhưng đẹp hơn hẳn (chờ anh Cường chọn)

> Ngày lập: **20/11/2026**. Ba tệp: [`huong-d.html`](huong-d.html), [`huong-e.html`](huong-e.html), [`huong-f.html`](huong-f.html).
> Đầu vào:
> - Ảnh lá số mẫu trên tuvi.vn: `doi-thu/11-tuvi-vn-la-so-luoi-desktop.png` và bản mobile.
> - Ảnh trang lập lá số tuvi.vn: `doi-thu/01-tuvi-vn-lap-la-so-desktop.png`.
> - Tài liệu vòng 1: [`02-ba-huong.md`](02-ba-huong.md).
> - Dữ liệu: [`la-so-mau.json`](la-so-mau.json).
> - Tài liệu `04` mục 3.1, 3.3; `07` mục 2.1, 2.2, 3.5.
>
> **Em chưa mở được trình duyệt** nên chưa thấy bản render thật. Mọi chỗ ghi "vừa", "không tràn" dưới đây là em tính theo kích thước CSS. Claude Code cần chụp ảnh để xác nhận (xem mục cuối).

---

## 1. Anh chê gì ở vòng 1, vòng 2 sửa thế nào

| Anh chê | Vòng 2 |
|:--|:--|
| Thiếu chất huyền học | Có triện son, hồi văn góc khung, mây cuộn, bát quái chìm (D, E), Thọ tròn và diềm mái (F). Tiêu đề kiểu thư pháp (D) hoặc chữ có chân cổ điển (E, F). |
| Lá số khó đọc, vòng tròn và mặt bằng nhà quá lạ | Bỏ hết. Dùng đúng lưới 4×4 kiểu tuvi.vn: cùng vị trí 12 cung, cùng bố cục trong ô, cùng màu sao theo ngũ hành. |
| Màu và chữ chưa đẹp | Màu lấy từ chất liệu Á Đông thật: giấy dó, mực tàu, son, sơn mài, vàng kim, hoàng thổ, xanh ngọc. Font có chân hoặc chữ trang trọng, đủ dấu tiếng Việt. |
| Chưa đủ ấn tượng | Lá số đặt như một tờ giấy có khung, có triện, có hoa văn góc. Ảnh chia sẻ là một tờ lá số in hoàn chỉnh. |

Bố cục trang theo thói quen của trang tử vi Việt (tuvi.vn, lịch ngày tốt):
1. Dải trên cùng.
2. Logo và ô tìm kiếm.
3. Thanh menu ngang màu đậm.
4. Đường dẫn.
5. Form lập lá số.
6. Lá số.
7. Luận giải.

Không quảng cáo, không popup, không banner "xem ngay".

---

## 2. Phần dùng chung cho cả ba biến thể

### 2.1. Quy ước lá số giữ nguyên như tuvi.vn

Em đặt ảnh tuvi.vn của chính lá mẫu cạnh mã và soát từng điểm:

- **Lưới 4×4.** Tỵ, Ngọ, Mùi, Thân ở hàng trên. Thìn, Mão bên trái. Dậu, Tuất bên phải. Dần, Sửu, Tý, Hợi ở hàng dưới. Thiên bàn chiếm 4 ô giữa.
- **Góc trái trên của ô:** can chi viết tắt kiểu tuvi.vn ("Đ.Tỵ", "Ấ.Mão"), dòng dưới là dấu âm dương cộng hành cung ("−Hỏa", "+Thổ").
- **Góc phải trên:** số đại vận (92, 82…) và tháng (Th.x).
- **Giữa:** tên cung in hoa, đậm, tô màu theo hành của cung, giống tuvi.vn (Điền Trạch đỏ, Nô Bộc vàng cam, Thiên Di xám, Phu Thê đen). Dưới tên cung là chính tinh in hoa, đậm, kèm độ sáng trong ngoặc.
- **Phụ tinh chia hai cột:** trái là cát tinh, phải là sát tinh, mỗi sao tô màu theo hành của sao.
- **Tứ Hóa:** Hóa Lộc, Quyền, Khoa, Kỵ là sao riêng trong cột phụ tinh, như tuvi.vn. Dữ liệu lấy từ `catTinh`/`hungTinh` trong JSON.
- **Sao lưu 2027:** viết "L. Thái Tuế", "L. Hóa Lộc"…, chữ nghiêng, xếp cuối cột.
- **Dòng đáy:** ĐV.x, vòng Tràng Sinh, LN.x.
- **Tuần, Triệt:** là nhãn nằm trên vạch giữa hai cung. Tuần ở vạch Thân–Dậu, Triệt ở vạch Sửu–Tý, đúng như tuvi.vn.
- **Thiên bàn:**
  - Bảng: họ tên (đã ẩn), năm, tháng, ngày, giờ, năm xem, âm dương, bản mệnh, cục, chủ mệnh, chủ thân, Thân cư.
  - Dòng tháng, ngày ghi kiểu "8 (6)", "15 (24)": số trong ngoặc là âm lịch, như tuvi.vn.
  - Đường tam hợp Mệnh: Dần – Ngọ – Tuất, nét liền màu son.
  - Đường xung chiếu: Dần – Thân, nét đứt.
  - Triện đỏ "xem bói" ở góc phải dưới.
- **Chú giải dưới lá số:** độ sáng M, V, Đ, B, H và 5 ô màu ngũ hành.
- **Màu ngũ hành:** đúng quy ước, chỉ chỉnh sắc độ cho đủ tương phản trên nền giấy:

  | Hành | Màu | Mã |
  |:--|:--|:--|
  | Kim | xám bạc | `#64676E` |
  | Mộc | xanh lá | `#2D6E32` |
  | Thủy | xanh đen | `#1F2B3D` |
  | Hỏa | đỏ | `#B0241B` |
  | Thổ | vàng cam, sẫm lại | `#995A00` |

  Màu Thổ là chỗ khác tuvi.vn nhiều nhất. Cam sáng của tuvi.vn chỉ đạt khoảng 2:1 trên nền trắng, nên em sẫm lại cho đọc được.

### 2.2. Đẹp hơn tuvi.vn ở đâu

| Điểm | tuvi.vn (ảnh `11-…-desktop.png`) | Vòng 2 |
|:--|:--|:--|
| Khung | Viền đen đơn, nền phẳng | Tờ giấy có thớ, viền kép mảnh, hồi văn hoặc Thọ tròn ở 4 góc, bóng đổ nhẹ |
| Chữ trong ô | Sans-serif hệ thống, đậm nhạt lẫn lộn | Một họ font có chân hoặc sans tốt, cỡ 12–13,5px, dòng cao cố định 17px. Không chữ nào chạm nhau |
| Kích thước ô | Ô hẹp khoảng 186px, chữ sát nhau | Ô 260px × 248px, đủ chỗ cho ô nhiều sao nhất (xem 2.4) |
| Màu Thổ, Kim | Cam sáng, xám nhạt, khó đọc | Sẫm lại, đạt ≥ 4,5:1 |
| Ô Mệnh | Không đánh dấu riêng | Nền ấm hơn, viền son mảnh |
| Cung Thân | "<THÂN>" dính vào tên | Nhãn nhỏ nền son "THÂN" |
| Vô chính diệu | Bỏ trống | Ghi "Vô chính diệu" chữ nghiêng |
| Thiên bàn | Đường kẻ màu sặc, chữ "Lá Số Tử Vi" kiểu quảng cáo | Đường son và đồng rất mảnh, chú thích tam hợp/xung chiếu, bát quái hoặc Thọ tròn chìm, triện son |
| Đáy ô | ĐV, LN cùng màu | Cung ĐV và LN đang là "MỆNH" in son để thấy ngay |
| Chữ đậm | Không rõ quy tắc | Đậm cho lục cát, lục sát, Lộc Tồn, Thiên Mã, Tứ Hóa (em chọn, có ghi ở chú giải) |
| Chú thích khi rê chuột | Không | Mỗi sao có `title`: tên, hành, độ sáng, "sao lưu năm 2027" |
| Mobile | Ảnh lưới thu nhỏ, phải tự zoom | Lưới thu nhỏ vừa màn hình. Chạm thì phóng cỡ thật, vuốt ngang. Có nút Phóng to/Thu nhỏ, và danh sách 12 cung bên dưới |

### 2.3. Mobile 375px

- Lưới 4×4 giữ nguyên, JS thu nhỏ bằng `transform: scale()` cho vừa bề ngang (khoảng 0,3).
- Chạm vào lưới hoặc bấm "Phóng to": về cỡ thật trong khung cuộn ngang (`overflow-x: auto`, có quán tính cuộn).
- Bấm "Thu nhỏ" để về như cũ.
- Dưới lưới (màn ≤ 1000px) có **"Đọc từng cung"**: 12 thẻ mở/đóng, xếp theo thứ tự Mệnh → Huynh Đệ → Phu Thê → … → Phụ Mẫu. Mỗi thẻ có:
  - chính tinh, cát tinh, sát tinh tô màu ngũ hành;
  - nhãn Mệnh, Thân cư, Tuần, Triệt, đại vận đang đi, Lưu Thái Tuế;
  - với cung vô chính diệu: thêm dòng tra vị trí cung xung chiếu, không luận.
- Menu ngang cuộn ngang bằng tay, không gập thành nút ba gạch, vì người dùng trang tử vi Việt quen thấy hết các mảng.

### 2.4. Kiểm chỗ trong ô (cung nhiều sao nhất)

| Cung | Chính tinh | Cột cát (gồm sao lưu) | Cột sát (gồm sao lưu) |
|:--|:-:|:-:|:-:|
| **Tỵ – Điền Trạch** | 2 | **8** | 3 |
| Ngọ – Quan Lộc | 1 | 6 | 6 |
| Thân – Thiên Di | 2 | 6 | 5 |
| Thìn – Phúc Đức | 1 | 4 | 5 |

- **Chiều cao.** Cột dài nhất là 8 dòng × 17px = 136px. Cộng đầu ô (tên cung + 2 chính tinh = 56px), dòng đáy, các khoảng cách: khoảng 232px. Ô cao 248px, còn dư khoảng 15px. Ảnh chia sẻ: ô 268px, dòng 19px, khoảng 248px.
- **Bề ngang.** Cột phụ tinh rộng khoảng 117px. Tên dài nhất là "Kình Dương (H)" in đậm, khoảng 95–105px tùy font.
- **Dự phòng.** Mỗi `<li>` có `white-space: nowrap` và `text-overflow: ellipsis`. Nếu font render rộng hơn dự tính thì chữ bị cắt có dấu "…" chứ không chồng lên nhau. **Cần soát trên ảnh chụp** xem có ô nào bị "…" không.
- **Số sao.** Em đã soát với JSON:
  - 14 chính tinh;
  - 83 phụ tinh, đúng số mục `phuTinh` của từng cung (Tý 4, Sửu 6, Dần 5, Mão 7, Thìn 8, Tỵ 9, Ngọ 10, Mùi 7, Thân 10, Dậu 6, Tuất 5, Hợi 6);
  - 9 sao lưu và 4 Lưu Tứ Hóa.

### 2.5. Chỗ lá số của mình KHÁC tuvi.vn (do dữ liệu, không phải giao diện)

Em đọc ảnh tuvi.vn ở độ phân giải thấp, nên các chỗ dưới đây **cần soát lại** trước khi kết luận:

1. **Tháng (Th.x).** Em lấy từ `luuNien2027.luuNguyet` nên Th.1 ở Mùi. tuvi.vn đặt Th.1 ở Hợi (cung tiểu hạn). Hai bên khác cách khởi tháng: từ Lưu Thái Tuế hay từ tiểu hạn. Cần anh hoặc chuyên gia chọn quy ước rồi ghi vào trang quy ước.
2. **LN.x.** Em tính theo Lưu Thái Tuế 2027 tại Mùi (LN.MỆNH ở Mùi). tuvi.vn ghi LN.MỆNH ở Sửu, có thể theo lối "lưu niên đại vận". Em chưa kiểm cách tuvi.vn tính.
3. **Sao lưu.** tuvi.vn hiện thêm L. Hồng Loan, L. Đào Hoa, L. Kiếp Sát, L. Thiên Khôi, L. Thiên Việt… JSON chỉ có 9 sao lưu và 4 Lưu Tứ Hóa, em chỉ in đúng những sao này. Hành của sao lưu em lấy theo sao gốc vì JSON không ghi.
4. **Độ sáng vài phụ tinh** khác tuvi.vn:
   - Văn Xương ở Tỵ: tuvi.vn (Đ), JSON (H).
   - Thiên Hư ở Thân: tuvi.vn (Đ), JSON (H).

   Đây là bảng độ sáng của engine, cần đối chiếu riêng.
5. **Tên sao.** tuvi.vn viết "Thiên Diêu", JSON viết "Thiên Riêu". Em giữ theo JSON.
6. **Thiên bàn** thiếu "Cân lượng" và "Lai nhân cung" vì JSON không có. Nếu muốn giống hẳn tuvi.vn thì engine cần xuất thêm hai trường này.

### 2.6. Các khối khác trên trang

- **Nhận định.** Dùng `chuDe2027` trong JSON, chép nguyên văn: nhãn căn cứ, tiêu đề, nội dung, 2 nguồn sách, dòng "Kho câu tĩnh tổng hợp từ sách (chưa qua chuyên gia kiểm duyệt)."
  - Chỗ ngắt câu lạ "…xung quanh. (đặt trong nền Đại vận…)." có sẵn trong JSON. Em giữ nguyên, nên sửa ở kho câu.
  - Nút "Soi căn cứ trên lá số" tô ô Nô Bộc (Mùi) và Phúc Đức (Thìn).
- **Giá.** Theo `04` mục 3.1 và 3.3:
  - Miễn phí 0đ; gói 149.000đ trả một lần qua VietQR, không gia hạn tự động.
  - Hoàn 100% trong 7 ngày theo 2 điều kiện đo được.
  - Câu "không bán lễ, vật phẩm hay dịch vụ giải hạn".
  - Không gạch giá, không đếm ngược.
- **Bách khoa.** 9 mảng đúng menu, mỗi mảng có biểu tượng SVG vẽ nét: lưới lá số, tờ lịch có trăng, vòng 12 chi, lịch có dấu chọn, 4 cột tứ trụ, 6 hào, ô 3×3, la bàn, sách mở. Tử vi ghi "Đang mở", còn lại "Sắp có".
- **Lịch âm hôm nay** kiểu tờ lịch bloc. Ngày 20/11/2026: thứ Sáu, ngày Nhà giáo Việt Nam, 12/10 Bính Ngọ, ngày Mậu Tuất, tháng Kỷ Hợi, tiết Lập Đông, giờ hoàng đạo Dần, Thìn, Tỵ, Thân, Dậu, Hợi.
  - Can chi ngày: em tự tính từ mốc 1/1/2000 là ngày Mậu Ngọ.
  - Ngày âm: tính theo sóc 9/11/2026.
  - Giờ hoàng đạo: theo bảng em nhớ cho ngày Thìn/Tuất.
  - **Chưa kiểm bằng engine lịch.** Trên trang có ghi rõ là dữ liệu mẫu.
- **Ảnh chia sẻ `#anh-chia-se`.**
  - Kích thước CSS cố định 1080×1350, `overflow: hidden`.
  - Mở `?chup=1` thì bỏ `transform: scale()`, khung ngoài về đúng 1080×1350, cột chú thích bên cạnh rơi xuống dưới.
  - Mọi khối bên trong có chiều cao cố định. Tổng chiều cao thật: D 1318px, E 1322px, F 1318px, đều dưới 1350px. Đây là chỗ vòng 1 hướng C bị tràn.
  - Không in họ tên, không có câu phán.
- **Font.** Em kiểm subset `vietnamese` trong `METADATA.pb` của kho `github.com/google/fonts` (dữ liệu nguồn của fonts.google.com) ngày 20/11/2026. WebFetch thẳng vào fonts.google.com chỉ nhận được tiêu đề trang, vì trang dựng bằng JS.

  | Font | Dùng ở | Subset vietnamese |
  |:--|:--|:--|
  | Dancing Script | D | có |
  | Noto Serif | D | có |
  | Playfair Display | E | có |
  | Be Vietnam Pro | E | có |
  | Prata | F | có (không có latin-ext, nhưng tiếng Việt dùng subset vietnamese) |
  | Lora | F | có |

- **Tương phản.** Em tự tính theo công thức WCAG 2.x, chưa đo bằng công cụ. Bảng chi tiết nằm trong "Hồ sơ hướng" ở cuối mỗi tệp.
  - Mọi cặp chữ thường đều ≥ 4,5:1.
  - Thấp nhất là sao Thổ và Kim trên nền ô Mệnh: khoảng 4,6–4,7:1.
  - Màu đồng và vàng đậm chỉ dùng cho nét kẻ.
- **Dung lượng.** Mỗi tệp chỉ có HTML, CSS, JS thuần và SVG, không ảnh bitmap, không thư viện. Em ước khoảng 55–70 KB mỗi tệp, dưới 160 KB. **Chưa đo byte thật** vì phiên này không có Bash.

---

## 3. Ba biến thể

### D — Giấy dó, mực tàu, son đỏ

![Hướng D ở 375px](huong-d-375.png)
![Hướng D ở 1366px](huong-d-1366.png)
![Hướng D, ảnh chia sẻ](huong-d-chia-se.png)

**Ý tưởng:** trang như một tập lá số chép tay trên giấy dó: nền ngà có thớ, chữ mực đen nâu, nhấn son đỏ, tiêu đề thư pháp, triện son đóng ở thiên bàn.

- **Gần tuvi.vn nhất:**
  - thanh menu đỏ son đậm;
  - form đặt trên cuộn giấy có hai trục gỗ ở hai bên, như tuvi.vn nhưng mảnh và sạch hơn;
  - tiêu đề "Lập lá số Tử Vi" thư pháp đỏ kẹp giữa hai cụm mây.
- **Hoa văn:**
  - dải hồi văn đồng dưới menu và ở chân trang;
  - góc hồi văn son ở khung form, khung lá số, thiên bàn;
  - bát quái chìm 6% ở thiên bàn.
- **Chữ:** Dancing Script cho tiêu đề lớn; Noto Serif cho mọi chữ còn lại, kể cả lá số.
- **Chuyển động:** tam giác tam hợp tự vẽ ra, triện "đóng dấu" xuống thiên bàn.

| Ưu | Nhược |
|:--|:--|
| Quen nhất với người đang dùng tuvi.vn: cùng tông đỏ–ngà, cùng bố cục, chỉ sạch và sang hơn | Ít "lạ" nhất. Ai thích cái mới thấy bình thường |
| Nền sáng đọc bài dài tốt (SEO, bách khoa), in ra giấy đẹp | Dancing Script là chữ viết tay kiểu Tây, chưa phải thư pháp Việt thật. Nếu muốn đúng chất nên đặt người viết logo và vài tiêu đề rồi xuất SVG |
| Lá số trên nền giấy sáng: tương phản màu ngũ hành tốt nhất trong ba hướng | Thớ giấy bằng feTurbulence có thể hơi "bẩn" trên màn hình rẻ. Cần xem ảnh chụp để chỉnh độ đậm |

### E — Sơn mài

![Hướng E ở 375px](huong-e-375.png)
![Hướng E ở 1366px](huong-e-1366.png)
![Hướng E, ảnh chia sẻ](huong-e-chia-se.png)

**Ý tưởng:** cả trang là một tấm sơn mài: nền đen son có hạt vàng quỳ rắc thưa và vân sơn mờ; các khối xen kẽ đỏ son thẫm; viền và chữ tiêu đề vàng kim. Lá số đặt trên tấm ngà, lồng trong khung đen sơn dày có chỉ vàng, như một bức tranh treo.

- **Hoa văn:** góc hồi văn vàng, mây cuộn vàng, bát quái chìm màu đồng ở thiên bàn, triện son chữ vàng.
- **Ảnh chia sẻ:** tờ lá số ngà trong khung sơn mài đỏ đen.
- **Chữ:** Playfair Display (tiêu đề, giá, logo nghiêng) và Be Vietnam Pro (giao diện, lá số).
- **Chuyển động:** ánh vàng lướt qua logo và tiêu đề một lần; ô bách khoa nhấc lên khi rê chuột.

| Ưu | Nhược |
|:--|:--|
| Ấn tượng và "sang" nhất. Ảnh chia sẻ nổi rõ trên bảng tin | Xa thói quen nhất: trang tử vi Việt gần như toàn nền sáng. Nền tối dễ gợi "thầy bói online", dù không có chi tiết hù dọa |
| Lá số vẫn trên nền ngà nên đọc rõ như D | Đọc bài dài trên nền tối mỏi mắt hơn. Phần bách khoa nhiều chữ sẽ chịu thiệt |
| Hợp làm trang của gói 149.000đ: cảm giác "đồ quý" | Vàng kim dễ thành "lòe" nếu sau này thêm nhiều khối. Cần giữ tỉ lệ vàng ít |

### F — Cung đình Huế

![Hướng F ở 375px](huong-f-375.png)
![Hướng F ở 1366px](huong-f-1366.png)
![Hướng F, ảnh chia sẻ](huong-f-chia-se.png)

**Ý tưởng:** màu của điện Thái Hòa: nền giấy vàng nhạt có vân mây xanh ngọc rất mờ, menu xanh ngọc cổ, dưới menu là diềm mái hoàng thổ (Thọ tròn xen mây, chỉ đỏ son).

- **Lá số:** đặt trong khung xanh ngọc dày có chỉ hoàng thổ, 4 góc là Thọ tròn nhỏ; thiên bàn có Thọ tròn lớn chìm.
- **Nút:** xanh ngọc, có vòng viền vàng như khung câu đối.
- **Chữ:** Prata (tiêu đề, logo, số lớn) và Lora (thân bài, lá số).
- **Chuyển động:** mây trôi rất chậm ở khối lập lá số; Thọ tròn xoay vào chỗ một lần.

| Ưu | Nhược |
|:--|:--|
| Có bản sắc Việt rõ (Huế), khác hẳn đối thủ mà vẫn nền sáng, dễ đọc | Xanh ngọc + vàng có thể bị thấy "giống trang du lịch, nhà hàng Huế" hơn là trang tử vi |
| Nhẹ nhàng nhất, hợp P1 (nữ trẻ, sợ bị dọa) | Thọ tròn em vẽ là hình học cách điệu, chưa phải chữ Thọ chuẩn. Cần người vẽ lại nếu chọn F |
| Lora hẹp nên ô cung thoáng nhất trong ba hướng | Prata chỉ có một độ đậm, tiêu đề ít nhấn nhá |

---

## 4. Em khuyên: chọn D làm nền, mượn khung sơn mài của E cho ảnh chia sẻ và trang gói 149.000đ

1. **D giữ đúng điều anh nói: người dùng huyền học trung thành, khó đổi.**
   - Cùng tông đỏ son, nền ngà, menu đỏ, cuộn giấy, lưới 4×4 như tuvi.vn.
   - Người quen tuvi.vn vào là đọc được ngay, nhưng thấy rõ sạch, sắc, sang hơn.
   - Đây là cách "quen nhưng đẹp hơn hẳn" ít rủi ro nhất.
2. **Nền sáng hợp bách khoa.** Mảng bách khoa sẽ có hàng trăm trang chữ dài (`07`). D đọc lâu không mỏi và in đẹp.
3. **E đặt đúng chỗ thì thành điểm nhấn.** Ảnh chia sẻ dùng tờ ngà trong khung sơn mài sẽ nổi trên Facebook, Zalo hơn tờ giấy dó, mà trang web vẫn sáng. Trang gói trả phí dùng sơn mài thì có cảm giác "đồ quý" mà không cần chữ quảng cáo.
4. **F để dự phòng.** F đẹp và nhẹ, nhưng em ngại bị đọc thành "chủ đề du lịch Huế". Nếu thử với 3–5 người P1 mà họ thích F hơn D rõ rệt thì đổi.

Ba việc nên làm nếu anh chọn D:
- Đặt người viết thư pháp làm logo "xemboi" và 5–6 tiêu đề lớn ("Lá Số Tử Vi", "Lập lá số Tử Vi"…), xuất SVG, thay Dancing Script.
- Chốt quy ước tháng (Th.) và LN ở mục 2.5 trước khi dựng thật.
- Cho engine xuất thêm "Cân lượng" và "Lai nhân cung" nếu muốn thiên bàn giống hẳn tuvi.vn.

---

## 5. Việc Claude Code cần làm khi chụp ảnh

**Chụp và đặt đúng tên** trong `docs/v2/thiet-ke/`:

| Tệp ảnh | Cách chụp |
|:--|:--|
| `huong-d-375.png`, `huong-e-375.png`, `huong-f-375.png` | Toàn trang, khung nhìn 375px |
| `huong-d-1366.png`, `huong-e-1366.png`, `huong-f-1366.png` | Toàn trang, khung nhìn 1366px |
| `huong-d-chia-se.png`, `huong-e-chia-se.png`, `huong-f-chia-se.png` | Mở tệp với `?chup=1`, chụp phần tử `#anh-chia-se`. Ảnh phải ra đúng 1080×1350 |

Nên chụp thêm một ảnh cận lá số ở 1366px (ví dụ `huong-d-la-so.png`) để anh nhìn rõ chữ trong ô.

**Soát kỹ các chỗ em chưa thấy được:**
- **Ô Tỵ, Ngọ, Thân** (nhiều sao nhất):
  - có sao nào bị cắt "…" không;
  - dòng đáy ĐV/Tràng Sinh/LN có bị đẩy ra ngoài ô không.
- **Góc trái trên** của ô Tuất, Hợi ("N.Tuất", "Q.Hợi"): có chạm tên cung không.
- **Thiên bàn:**
  - bảng thông tin có đè lên triện không;
  - đường tam hợp có cắt ngang chữ khó đọc không. Chữ có viền sáng, nhưng vẫn cần xem.
- **Nhãn Tuần, Triệt:** nằm đúng trên vạch Thân–Dậu và Sửu–Tý chưa.
- **Ở 375px:**
  - lưới thu nhỏ có vừa ngang không, trang có cuộn ngang thừa không;
  - chạm vào lưới có phóng to và vuốt ngang được không;
  - danh sách 12 cung có hiện không.
- **D:**
  - thớ giấy có quá đậm hoặc "bẩn" không;
  - hai trục cuộn giấy có lệch form không.
- **E:**
  - hạt vàng có quá dày không;
  - chữ tiêu đề gradient vàng có hiện đủ không. Nếu trình duyệt không hỗ trợ `background-clip: text` thì chữ sẽ trong suốt.
- **F:** mây trôi có gây cuộn ngang không.
- **Cả ba:**
  - tải font Google có lỗi không, dấu tiếng Việt in hoa (THIÊN LƯƠNG, ĐIỀN TRẠCH) có bị cắt đầu không;
  - không lỗi JS;
  - đo byte thật của mỗi tệp (phải dưới 160 KB).

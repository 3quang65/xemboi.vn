# 01 — Soi đối thủ về thị giác

> Ngày lập: **20/11/2026**. Nguồn: ảnh chụp sẵn trong [`doi-thu/`](doi-thu/), số đo trong [`doi-thu/_thong-tin.json`](doi-thu/_thong-tin.json) và [`_thong-tin-them.json`](doi-thu/_thong-tin-them.json) (màu nền `bodyBg`, font `bodyFont`/`hFont`, số khối giống quảng cáo `adLike`), và ảnh bằng chứng [`../bang-chung/`](../bang-chung/).
> Em không chụp lại và không WebFetch thêm. Ảnh em đã mở để xem: bản desktop của cả 10 trang; bản mobile của tuvi.vn, Chợ Tử Vi, lichngaytot; bằng chứng `02-tracuutuvi-trondoi`, `03-tuvi-vn-cholagi` (lá số), `04-chotuvi-paywall`. Bản mobile của các trang còn lại **chưa xem**.
> Mã màu dưới đây có hai loại. Màu **đo** lấy từ JSON. Màu **ước** là em ước bằng mắt trên ảnh, ghi chữ "≈".
> `adLike` là số phần tử *trông giống* quảng cáo do script đếm, **chưa phải số quảng cáo thật**. Ví dụ Co–Star = 0 nhưng có nút "Shop".

---

## 1. Bảng so sánh

| # | Trang | Màu chủ đạo | Chữ (đo) | Cách vẽ lá số / sản phẩm chính | Mật độ quảng cáo | Cảm xúc gợi ra |
|:-:|:--|:--|:--|:--|:--|:--|
| 1 | **tuvi.vn** | Nền trắng `rgb(255,255,255)` (đo). Thanh menu đỏ đậm ≈ `#A51C1C`. Khung cuộn giấy vàng nâu, hoa văn mây, bát quái mờ làm nền | Body: font hệ thống. Tiêu đề: Roboto. Logo kiểu thư pháp | Lá số (`bang-chung/03`): **lưới 4×4 kẻ ô đen**, chữ nhiều màu (đỏ, xanh lá, cam, xám) cho từng loại sao, viết tắt dày đặc ("ĐV.QUAN", "LN.TÀI"), ô giữa có đường chéo và dòng "Trang tử vi cổ học hàng đầu Việt Nam". Bên cạnh là khung "Nạp Xu!" | `adLike` **14** (desktop) / **16** (mobile). Trên mobile, một quảng cáo video "Stock your lab" chiếm **hơn nửa màn hình** ngay dưới form | Chợ đông, cũ, rối. Có ý "cổ học" nhưng đọc mệt. Badge "Hot!" đỏ vàng |
| 2 | **Chợ Tử Vi** | Hero tím than ≈ `#1E1A2E` với lồng đèn đỏ vàng, sạp chợ, ông thầy râu bạc. Thân trang nền kem `rgb(244,234,213)` (đo) | Body: **Be Vietnam Pro**. Tiêu đề: **Noto Serif** (đo) | Không thấy lá số trên trang chủ. Sản phẩm là "Hỏi thầy": nhân vật thầy nói "Khà khà… Có duyên mới gặp". Trang trả tiền (`bang-chung/04-paywall`) là các nút **"Lễ nhỏ 10.000đ / Lễ vừa 20.000đ (chọn sẵn) / … / Lễ hậu 200.000đ"** và "Gửi lễ qua VietQR" | `adLike` 0 | Dễ thương, dân gian, ấm. Nhưng dựng hình ảnh "thầy" và chữ "lễ", **đúng cái P1 sợ**. Bảng màu gần y hệt trang R1 hiện tại (kem + serif) |
| 3 | **lichngaytot** | Trắng / xám `rgb(246,246,246)` (đo). Menu đỏ tươi ≈ `#E3173A`. 12 biểu tượng con giáp trong vòng tròn đỏ hồng | Roboto (đo) | Không có lá số. Trang tử vi là danh sách bài kiểu báo, ảnh minh họa lịch Tết đỏ vàng | `adLike` **34** (cả hai bản). Ảnh thấy banner Petrolimex, quảng cáo sàn tiền số OKX, sticker "Săn deal Shopee -50%", popup "Đăng nhập bằng Google" che đáy mobile | Báo lá cải. Quảng cáo nhiều hơn nội dung. Mobile gần như không đọc được gì ở màn đầu |
| 4 | **tracuutuvi** | Đen + vàng chanh ≈ `#F5C518`. Ảnh stock nhà sư ngồi thiền ngược sáng | Roboto (đo), tiêu đề **in hoa toàn bộ** | Trang chủ là form. Trang "Trọn đời" (`bang-chung/02`): sách bìa đỏ có bát quái, giá **680.000đ gạch 2.600.000đ**, **đồng hồ đếm ngược** "Thời gian còn lại 10:29:25", form đòi họ tên + **số điện thoại** | `adLike` 0, nhưng toàn trang là landing page bán hàng | Huyền bí kiểu phim, ép mua. Đúng các chiêu ở danh sách cấm |
| 5 | **xemtuvi.mobi** | Trắng, menu đỏ nâu ≈ `#8E1A10`, ô vàng nhạt | Roboto (đo) | Màn đầu là **bảng kết quả xổ số miền Bắc**. Tiêu đề trang: "Tử vi online – Kết quả xổ số kiến thiết ba miền" (đo) | `adLike` 0 | Lẫn lộn tử vi với xổ số. Mất tin ngay với P2 |
| 6 | **Lịch Việt (web)** | Trắng + xanh lá tươi ≈ `#2DB52D`. Banner thần số học **nền tím vũ trụ lấp lánh** có số bay | Font hệ thống. Tiêu đề "SF UI Text" (đo) | Không có lá số ở màn đầu. Thẻ lịch ngày số rất to (20 / 12), ảnh minh họa cưới hỏi, mua xe, mua nhà kiểu stock | `adLike` 0. Có nút "Nâng cấp Lịch Việt Pro" vương miện, nút Messenger và Zalo nổi | App tiện ích, sặc sỡ, thân thiện với P3. Không có chiều sâu cho P2 |
| 7 | **Thái Âm** | Nền trắng (đo), lớp phủ tím hồng nhạt. Xanh đêm `rgb(25,25,112)` (đo) cho chữ | Tiêu đề **Philosopher** (serif), body Times New Roman (đo, có thể do font chưa tải) | Ảnh desktop: **popup "Tải app Thái Âm"** kèm mã QR che kín form ngay khi vào. Phía dưới hứa "Ảnh lá số tải về máy, một chạm là có file PNG" | `adLike` 0 / 1 | Dịu, sạch hơn mặt bằng chung, gần SaaS. Popup làm mất thiện cảm. Biểu tượng emoji ở danh sách tính năng |
| 8 | **Co–Star** (Mỹ) | Xám rất nhạt `rgb(247,247,247)` (đo), chữ đen xám, gần như **không có màu** | Tiêu đề **Romana** (serif mảnh). Menu **monospace in hoa** | Không vẽ lá số ở trang chủ. Hiện 3 điện thoại, nền lưới phối cảnh mảnh như bản vẽ, ảnh chân dung đen trắng | `adLike` 0 | Lạnh, thông minh, kiểu tạp chí. Khẩu hiệu "NASA data and biting truth": **dựa dữ liệu nhưng giọng phán** |
| 9 | **The Pattern** (Mỹ) | Xám ấm ≈ `#F3EFEC`, khối đen than ở phần sau | Tiêu đề **dm-sans** (đo); chữ "THE PATTERN" giãn cách rất rộng; tiêu đề phụ serif | Không vẽ lá số; hiện app với các thẻ tính cách | `adLike` 1 | Sâu lắng, cao cấp, ít chữ |
| 10 | **Chani** (Mỹ) | Nền **giấy kẻ ô** xám, đen, điểm hồng tím | Tiêu đề **Caraque** (đo), chữ vẽ tay viền rỗng | Không vẽ lá số ở trang chủ. Hình sao vẽ tay, sách, lịch 2027 | `adLike` 0, nhưng có **dải chữ chạy** ở đỉnh, **popup cookie** to, banner "giảm 35%" | Zine, nghệ, vui, cá tính mạnh. Nhiều chiêu bán hàng |

### Chung cho 7 trang Việt (1–7; Thái Âm là ngoại lệ một phần)
- **Màu:** đỏ đậm, đỏ tươi, vàng, đen, hoặc tím vũ trụ. Không trang nào dùng một bảng màu điềm tĩnh, có chủ đích.
- **Chữ:** gần như toàn **Roboto** hoặc font hệ thống (5/7 đo được). Chợ Tử Vi dùng Be Vietnam Pro + Noto Serif, Thái Âm dùng Philosopher.
- **Biểu tượng:** cuộn giấy, mây, bát quái, âm dương, lồng đèn, ông thầy, nhà sư, sách bìa đỏ.
- **Lá số:** trang duy nhất em thấy vẽ lá số (tuvi.vn) dùng **lưới 4×4 kẻ ô dày đặc nhiều màu**. Đủ sao cho P2, nhưng không ai muốn chụp đăng Facebook.
- **Kiếm tiền:** quảng cáo dày (tuvi.vn, lichngaytot), gạch giá + đếm ngược + đòi SĐT (tracuutuvi), "lễ" (Chợ Tử Vi), popup tải app (Thái Âm).

### Chung cho 3 trang Mỹ (8–10)
- Gần như đơn sắc, nhiều khoảng trắng, chữ có cá tính (serif mảnh, mono, chữ vẽ tay).
- Trang chủ **không trưng lá số**: họ bán cảm giác, không bán độ chính xác.
- Co–Star và Chani vẫn có "giọng phán" hoặc chiêu bán (chữ chạy, giảm giá).

---

## 2. Khoảng trống thị giác mà xemboi chiếm được

Trang tử vi Việt hoặc ồn (đỏ–vàng, bát quái, quảng cáo, "thầy", "lễ"), hoặc trình bày lá số như một bảng tính nhiều màu khó đọc. Trang chiêm tinh Mỹ thì yên tĩnh và có gu, nhưng giấu lá số đi, bán cảm giác và giọng phán. **Chưa ai coi bản thân lá số Tử Vi là một vật thể được thiết kế:** vẽ chính xác như một bản đồ hay bản vẽ, đủ từng sao và độ sáng để P2 soi, đủ đẹp và yên để P1 chụp đăng, và mỗi câu nhận định **chỉ thẳng vào** sao–cung làm căn cứ ngay trên hình. Khoảng trống của xemboi là **"lá số như một ấn phẩm chính xác"**: tông màu điềm tĩnh, ít màu, không biểu tượng huyền bí, không quảng cáo; cái đẹp đến từ độ chính xác và cách sắp chữ. Cùng một hệ đó dùng được cho cả bách khoa: mỗi công cụ (lịch âm, bát tự, Kinh Dịch) cũng là một "hình vẽ dữ liệu" có chú giải nguồn.

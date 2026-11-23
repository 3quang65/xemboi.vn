# 21. Học cách trình bày từ 4 repo: làm tính năng trực quan hơn

Ngày 24/11/2026. Tiếp theo tài liệu 20, tài liệu đó chỉ nói về thuật toán và dữ liệu. Lần này em chỉ đọc mã giao diện và xem ảnh README của bốn repo, không chạy mã nào của họ. Ảnh tham khảo để ở `docs/v2/thiet-ke/tham-khao-4-repo/`, không commit.

**Vấn đề anh nêu:** các trang kết quả của xemboi chủ yếu đổ dữ liệu ra bảng. Em đối chiếu bằng cùng một ca, 01/06/1990 08:30, nữ (fengshui.skill cũng dùng ca này trong ảnh mẫu):

| Trang xemboi | Hiện tại | Thiếu so với 4 repo |
|---|---|---|
| Bát tự `/bat-tu/lap-la-so` | 3 thẻ thông tin, rồi bảng Tứ trụ (thập thần, can, chi, tàng can, nạp âm), 5 thanh mảnh đếm ngũ hành, bảng đại vận 8 bước | Không có câu tóm tắt đầu trang. Trụ là ô bảng, không phải chữ lớn. Không vẽ quan hệ hợp/xung giữa các trụ. Thuật ngữ không bấm xem nghĩa được |
| Tử vi `/tu-vi/lap-la-so` | Lá số 4×4 kiểu cổ, có phóng to, có "Đọc từng cung" | Trang này tốt nhất. Còn thiếu tô tam phương tứ chính khi bấm cung, và thẻ chi tiết cung trên di động |
| Cửu tinh `/phong-thuy/cuu-tinh/2027` | Lưới 3×3 Lạc thư, màu theo sao | Không có la bàn bao ngoài. Không thấy đường sao bay. Không chuyển được lớp năm/tháng ngay trên lưới |
| Hướng nhà `/phong-thuy/huong-nha` | Ô nhập độ, 8 nút phương, vòng 24 sơn và 8 quái | Vòng tròn chưa gắn với người xem: chưa có vòng du niên theo cung phi, chưa tô hướng nhà vừa nhập |
| Thần số học `/than-so-hoc/bieu-do-ngay-sinh` | Lưới 3×3 có đường liền/đứt, bảng đỉnh cao | Ô có số và ô trống trông gần như nhau. Đỉnh cao chỉ là bảng, không thấy mình đang ở chặng nào |
| Xem ngày `/xem-ngay` | Hôm nay/ngày mai theo 3 lớp, bảng cả tháng, chọn ngày theo việc | Không có dải 12 giờ hoàng đạo. Bảng tháng là bảng, chưa phải lưới lịch. Chưa có "3 ngày hợp nhất" kèm một câu lý do |

## 1. Mỗi repo trình bày thế nào

### 1.1 fengshui.skill (MIT từ commit fe2a025)
Ảnh: `fengshui-bazi-chart.png`, `fengshui-feixing-cast.gif`. Mẫu ở `skills/bazi-mingli/assets/templates/bazi.html` (50 KB) và `skills/fengshui-master/assets/templates/feixing.html` (22 KB).

- **"Nhìn là hiểu" ở đầu trang bát tự:** một câu tóm tắt bằng lời thường, rồi 4 thẻ sự kiện: nhật chủ (có câu sách cổ), mùa sinh/lệnh tháng, đếm ngũ hành (kèm câu "thiếu không có nghĩa phải bù"), đại vận/lưu niên đang chạy.
- **Bốn nút chuyển lớp:** Bảng / Lời thường / Hợp xung hình hại / Tàng can. Cùng một lá số, người mới xem lời thường, người rành xem bảng.
- **Trụ là thẻ chữ lớn:** can chi viết to, tô màu theo ngũ hành. Nhật chủ có khung nổi.
- **Thập thần có chú nghĩa ngắn ngay bên dưới,** ví dụ "Chính tài: tiền ổn định".
- **Thuật ngữ gạch chân chấm:** bấm vào thì hiện bảng giải nghĩa bằng lời thường.
- **Vòng cung quan hệ dưới các trụ:** lục hợp vẽ nét liền, phần khuyết (缺丑) vẽ nét chấm, có chú giải kiểu nét.
- **Panel bên:** bấm một can thì panel hiện câu sách, thông căn, thấu can.
- **Phi tinh (GIF):** lưới 3×3 nằm trong vòng 24 sơn. Bấm "Khởi bàn" thì các sao bay theo đường Lạc thư, có vệt nét đứt. Có các lớp vận bàn / sơn tinh / hướng tinh / lưu niên để bật tắt. Bấm ô thì hiện chi tiết.

### 1.2 taibu (giao diện `src/` theo AGPL-3.0: chỉ học ý, không chép mã)
Ảnh: không có ảnh. Em đọc các file `src/components/{ziwei,bazi,liuyao,meihua,daily}/`.

- **Kết luận đặt trên, căn cứ gập dưới:** ở mai hoa có chip 吉/平/凶, một câu tóm tắt, rồi `<details>` "依据" (căn cứ). Đây là mẫu rõ nhất.
- **"Điểm chính của quẻ" (`liuyao-highlights.ts`):** biến dữ kiện engine đã tính thành câu ngắn, không thêm lời luận. Ví dụ "Dụng thần trì thế", "Sáu hào tĩnh, không hào động".
- **Ô nhật chủ:** can ngày 64px trên nền nhạt màu hành, kèm một câu "Nhật chủ X, hành Y".
- **Đường quan hệ vẽ thẳng lên bảng trụ:** hợp, xung, hình, hại, phá.
  - Màu theo tính chất.
  - Kiểu nét khác nhau (liền, gạch, chấm, gạch-chấm) để người mù màu vẫn phân biệt được.
  - Rê chuột vào thì làm nổi đường đó.
- **Tử vi:**
  - Bấm một cung thì vẽ tam phương tứ chính bằng SVG phủ lên lá số: tam hợp nét liền, đối cung nét đứt. Cung đang chọn tô đậm, cung liên quan tô nhạt.
  - Trên màn hẹp (container query < 672px): lá số rút gọn, phụ tinh ẩn, dưới lá số hiện thẻ chi tiết của cung đang chọn.
  - Đại vận, lưu niên, lưu nguyệt là các dải chip cuộn ngang, mỗi cấp mở ra cấp dưới.
- **Gieo quẻ:**
  - Ba đồng xu SVG lật 3D bằng CSS thuần.
  - Hào hiện dần từ dưới lên, có bộ đếm "đã gieo n/6".
  - Hào động đánh dấu ○ và ×, có `aria-live` đọc kết quả.
- **Vận ngày:**
  - Dải 13 giờ tô theo cát/hung, có vạch "lúc này".
  - Ô 3×3 la bàn (Bắc ở trên) ghi chỗ các cát thần.
  - Lịch tháng 7 cột.
  - Chỉ ghi bậc (cát/bình), không chấm điểm số.
- **Chỗ chưa chắc được ghi rõ:** "chưa rõ giờ sinh"; trụ giờ hiện "—"; vòng ngũ hành ghi "chưa xác định".
- **Bản đồ sao:** nhãn hành tinh bị chồng thì được dàn ra, có đường dẫn về vị trí thật. Có 4 ô neo: Mặt Trời, Mặt Trăng, ASC, MC. Bảng góc chiếu gập vào `<details>`.

### 1.3 Nhật Nguyệt (mã MIT; lời luận giải CC BY-NC, không dùng)
Ảnh: các tệp `nhatnguyet-*.png`. Hình vẽ nằm ở `js/packages/*/src/ve-svg.ts` và `svg.ts`. Toàn bộ là chuỗi SVG dựng ở máy chủ, không có JS và không dùng thư viện biểu đồ. Cách này hợp với Next.js SSR của mình.

- **Thần số học:**
  - Số chủ đạo đặt trong vòng tròn lớn, chữ số cỡ 76. Số chủ 11/22/33 có viên nhãn vàng.
  - 6 chỉ số phụ xếp lưới 2×3.
  - Đỉnh cao là dòng thời gian 4 đoạn, đoạn chứa tuổi hiện tại tô đậm.
  - Lưới ngày sinh: ô có số tô nền và lặp chữ số ("111"); ô trống in mờ.
- **Bát tự:**
  - Phần đầu ghi "Nhật chủ X (Dương Mộc)" và tiết sinh, đặt trước bảng.
  - Trụ ngày có khung.
  - Can chi cỡ 40, tô theo hành.
  - Đại vận là dải thẻ ngang.
- **Tử vi:**
  - Tứ Hóa hiện bằng viên nhãn màu: Lộc xanh lá, Quyền nâu vàng, Khoa xanh dương, Kỵ đỏ gạch.
  - Sao Miếu/Vượng tô đậm, sao Hãm tô xám.
  - Chú giải đặt ngay trong thiên bàn.
  - Có thuật toán co chữ cho vừa ô (`tu-vi/src/ve-svg.ts:103-169`), đáng học.
- **Phong thủy:**
  - La bàn ba vòng: 24 sơn, 8 quái, 8 du niên.
  - Du niên tốt nền xanh nhạt, du niên xấu nền đỏ nhạt.
  - Tâm la bàn ghi số cung phi. Sơn hướng tô một màu, sơn tọa tô màu khác.
- **Widget lịch:**
  - **Giờ hoàng đạo:** dải 12 ô tô theo màu trời. Giờ hắc đạo phủ trắng mờ, giờ hoàng đạo có vạch nhấn ở đáy. Ở màn hẹp gập thành 2×6.
  - **Lịch tháng:** ngày âm nhỏ dưới ngày dương. Mùng 1 và rằm có màu nhấn. Bấm ngày thì mở chi tiết ngay dưới lưới.
- **Ngày tốt (ảnh `nhatnguyet-ngay-tot.png`):**
  - Chọn việc bằng nút, rồi chọn khoảng 30/60/90 ngày.
  - Kết quả chỉ có 3 thẻ ngày, thẻ hợp nhất có viên nhãn.
  - Mỗi thẻ có **một câu lý do làm từ dữ liệu**, ví dụ "ngày Quý Mão, chi Mão tam hợp với chi tháng Hợi".
  - Cuối có dòng ghi rõ "chưa tính tuổi người làm" và link xuất lịch `.ics`.
- **Hướng nhà:** hướng không hợp tô màu hổ phách chứ không tô đỏ, để người xem không sợ.

### 1.4 numerologist_skills
Chỉ có một bộ slide HTML (theme "Dark Botanical"). Không có giao diện sản phẩm nào để học.

## 2. Tám nguyên tắc rút ra

1. **Kết luận trước, dữ liệu sau.** Mỗi trang kết quả mở bằng khối "Đọc nhanh": một câu cùng 3–4 thẻ sự kiện. Bảng đầy đủ để dưới, hoặc trong `<details>`.
   - **Ràng buộc của mình:** câu trong khối Đọc nhanh phải ghép từ dữ liệu đã tính hoặc trích sách có nguồn, giống cách taibu và Nhật Nguyệt làm. Không viết lời luận mới. Không dùng các từ cấm theo định vị 04.
2. **Một chữ quan trọng thì viết to.** Nhật chủ, số chủ đạo, quẻ chủ, sao trung cung đều phải to hơn hẳn phần còn lại.
3. **Ngũ hành có hai cấp màu:** màu đậm cho chữ, màu nhạt cho nền. Dùng chung cho mọi trang, có chú giải bằng chấm màu.
4. **Quan hệ thì vẽ thành đường** thay vì liệt kê thành chữ: hợp/xung giữa các trụ, tam phương tứ chính, đường sao bay. Mỗi loại quan hệ một kiểu nét để người mù màu vẫn đọc được.
5. **Thuật ngữ bấm được.** Gạch chân chấm, bấm vào thì mở nghĩa ngắn lấy từ `tu-dien` hoặc `thuat-ngu.csv` sẵn có. Không cần JS: dùng thuộc tính HTML `popover` hoặc `<details>`.
6. **Cho thấy "mình đang ở đâu":** đại vận đang chạy, đỉnh cao ứng với tuổi hiện tại, giờ hiện tại trong dải 12 giờ, hôm nay trên lịch.
7. **Chọn lọc thay vì liệt kê hết:** chỉ đưa 3 ngày hợp nhất, mỗi ngày một câu lý do, không chấm phần trăm. Danh sách đầy đủ để sau một link.
8. **Ghi rõ chỗ chưa chắc:** khi chưa rõ giờ sinh, chưa xác định, hay đó chỉ là quy ước truyền thống. Màu cho kết quả "không hợp" nên dịu (hổ phách), không dùng đỏ báo động.

## 3. Đề xuất cho từng trang, xếp theo ưu tiên

Cột "Ai làm" theo phân vai hiện nay. Em làm phần lib (`src/lib/**`): dữ liệu quan hệ và câu Đọc nhanh. Antigravity làm giao diện.

| # | Trang | Việc | Lấy ý từ | Ai làm | Ghi chú |
|---|---|---|---|---|---|
| 1 | Dùng chung | Thành phần `DocNhanh` (một câu + thẻ sự kiện), `ThuatNgu` (popover nghĩa ngắn), token ngũ hành đậm/nhạt và chú giải chấm màu | fengshui.skill, taibu | Em: dữ liệu thuật ngữ. AG: component trong `components/ck/` | Các trang sau đều dùng lại |
| 2 | Bát tự | Khối Đọc nhanh (nhật chủ, lệnh tháng, đếm hành, đại vận đang chạy); trụ dạng thẻ chữ lớn; nhật chủ có khung; thập thần kèm chú nghĩa; đường hợp/xung dưới trụ; đại vận thành dải thẻ cuộn ngang có nhãn "Đang chạy"; tab Bảng / Lời thường | fengshui.skill, taibu, Nhật Nguyệt | Em: `quanHeTru()` (lục hợp, tam hợp, xung, hình, hại, phá giữa 4 trụ, có nguồn) và câu Đọc nhanh. AG: giao diện | Ca mẫu 01/06/1990 đối chiếu ảnh `fengshui-bazi-chart.png` |
| 3 | Xem ngày | Dải 12 giờ hoàng đạo có vạch giờ hiện tại; lịch tháng dạng lưới 7 cột (ngày âm nhỏ, mùng 1 và rằm nhấn màu); "3 ngày hợp nhất cho việc X" mỗi ngày một câu lý do; xuất `.ics` | Nhật Nguyệt, taibu | Em: hàm chọn 3 ngày kèm lý do từ dữ liệu 3 lớp. AG: giao diện | Không chấm điểm phần trăm |
| 4 | Thần số học | Số chủ đạo trong vòng tròn lớn; đỉnh cao thành dòng thời gian 4 chặng, tô chặng hiện tại; lưới ngày sinh tô ô có số, làm mờ ô trống | Nhật Nguyệt | AG (dữ liệu đã có) | Không thêm lời luận, việc 18 vẫn chờ anh |
| 5 | Hướng nhà, bát trạch | La bàn 3 vòng (24 sơn, 8 quái, 8 du niên theo cung phi của người xem); tô sơn hướng và sơn tọa của độ vừa nhập; du niên không hợp tô hổ phách | Nhật Nguyệt | AG (dữ liệu đã có trong `phong-thuy.ts`) | Không ghi "hóa giải" |
| 6 | Cửu tinh | La bàn bao quanh lưới 3×3; nút "Xem sao bay" chạy đường Lạc thư bằng CSS (tắt khi người dùng đặt `prefers-reduced-motion`); chuyển lớp năm/tháng ngay trên lưới; bấm ô thì mở chi tiết | fengshui.skill (GIF) | AG | |
| 7 | Tử vi | Bấm cung thì vẽ tam phương tứ chính (SVG phủ lên lá số); Mệnh được chọn sẵn; trên di động có thẻ chi tiết cung dưới lá số; Tứ Hóa thành viên nhãn màu | taibu, Nhật Nguyệt | Em: hàm tam phương (nếu `la-so.ts` chưa có). AG: một client island nhỏ | Không đụng `src/lib/core` |
| 8 | Kinh dịch, gieo quẻ | Ba đồng xu lật bằng CSS; hào hiện dần từ dưới lên; hào động ○/×; mũi tên sang quẻ biến; khối "Điểm chính của quẻ" ghép từ dữ kiện | taibu, Nhật Nguyệt | Em: câu điểm chính. AG: hiệu ứng | |
| 9 | Bản đồ sao | Dàn nhãn hành tinh bị chồng, có đường dẫn về vị trí thật; 4 ô neo (Mặt Trời, Mặt Trăng, ASC, MC); bảng tọa độ gập lại | taibu | AG | Cần xem lại `VongBanDoSaoSvg.tsx` đã tránh chồng nhãn chưa |
| 10 | Xem tuổi | 12 con giáp xếp lưới 3×4, chấm màu theo tam hợp / xung / hại với tuổi người xem | Nhật Nguyệt | AG (dữ liệu có trong `xem-tuoi.ts`) | |

Mục 1–3 tốn ít công nhất mà tác động nhiều nhất: các trang được xem nhiều nhất đều thôi "chỉ là bảng".

## 4. Giới hạn kỹ thuật khi làm

- **Không thêm thư viện npm.** Mọi hình là SVG viết tay, dựng ở máy chủ (cách của Nhật Nguyệt). Phần tương tác là client island nhỏ, hoặc dùng `<details>`, `popover` hay tham số URL (`?cung=`, `?lop=`).
- **CSS mỗi cụm ≤ 30 KB**, chạy tốt ở bề rộng 375px. Lá số rộng thì kèm dạng thẻ hoặc thẻ chi tiết cho di động.
- **Hiệu ứng** (xu lật, sao bay) phải tắt được khi người dùng đặt `prefers-reduced-motion`. Nội dung phải đọc đủ khi tắt JS.
- **Giấy phép:**
  - taibu `src/` (AGPL): chỉ học ý.
  - Nhật Nguyệt: mã MIT, chép được nếu ghi công; lời luận (CC BY-NC) không dùng.
  - fengshui.skill: MIT từ commit fe2a025.
  - Ghi vào sổ 14 khi chép đoạn mã nào.
- **Nội dung:** câu Đọc nhanh, lý do ngày tốt và điểm chính của quẻ đều ghép từ dữ liệu đã tính, theo mẫu câu cố định có test. Không để AI tự viết.

## 5. Lệnh Antigravity dự kiến

Gồm 4 lệnh, giao lần lượt, mỗi lệnh xong em duyệt rồi mới giao lệnh sau:

| Lệnh | Gồm mục | Việc của em cần xong trước |
|---|---|---|
| 40 | Mục 1, 2 (khối dùng chung + bát tự) | `quanHeTru()`, câu Đọc nhanh bát tự, nghĩa ngắn thuật ngữ cho popover |
| 41 | Mục 3 (xem ngày) | Hàm "3 ngày hợp nhất" kèm lý do |
| 42 | Mục 4, 5, 6 (thần số học, hướng nhà, cửu tinh) | Không có |
| 43 | Mục 7, 8, 9, 10 (tử vi, kinh dịch, bản đồ sao, xem tuổi) | Hàm tam phương, câu điểm chính của quẻ |

## 6. Ảnh tham khảo (`docs/v2/thiet-ke/tham-khao-4-repo/`, không commit)

- `fengshui-bazi-chart.png`: bát tự có khối nhìn là hiểu, trụ chữ lớn, vòng quan hệ.
- `fengshui-feixing-cast.gif`: sao bay trong la bàn 24 sơn.
- `nhatnguyet-ngay-tot.png`: 3 ngày tốt, mỗi ngày một câu lý do.
- `nhatnguyet-gio-hoang-dao.png`: dải 12 giờ, giờ hắc đạo làm mờ.
- `nhatnguyet-lich-thang.png`, `nhatnguyet-huong-nha.png`, `nhatnguyet-tu-vi-12-con-giap.png`, `nhatnguyet-cung-menh.png`, `nhatnguyet-lo-ban.png`, `nhatnguyet-lich-hom-nay.png`.
- `xemboi-hien-tai-*.jpg`: ảnh chụp trang xemboi hôm nay để so trước và sau.

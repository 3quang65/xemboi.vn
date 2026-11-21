# Đặc tả kỹ thuật an sao Tử Vi Đẩu Số phái Việt Nam (xemtuvi.vn)

Phiên bản: 30/10/2026 · Người soạn: Agent Nghiên cứu Tử vi · Trạng thái: **bản nháp, chờ chuyên gia duyệt** (xem mục 13)

Tài liệu đi kèm:

- `~/xemtuvi.vn/docs/nghien-cuu/tuvi-test-cases.json`: 11 lá số kiểm thử, máy đọc được, kèm bộ test lịch và test sao lưu.
- `~/xemtuvi.vn/docs/nghien-cuu/tuvi-ref-engine.py`: engine tham chiếu viết độc lập theo đúng đặc tả này (Python, không thư viện ngoài). Hàm `chart(nam, thang, ngay, gio, phut, gioiTinh, late_ty, leap_rule, tz_rule)` trả về toàn bộ vị trí sao. Lập trình viên có thể dùng nó làm "đáp án" khi viết engine thật.

Bản đối chiếu chính: engine trong repo `xemboi.vn` (`src/lib/core/tuvi-raw.js`, `lich-raw.js`, `thayba-raw.js`), port từ TuViMCP/ansaotuvi theo sách cụ Thiên Lương. Bản đối chiếu thứ hai: thư viện iztro (phái Trung Quốc, đọc qua mã nguồn và bộ test công khai). Kết quả đối chiếu tự động trên 3.000 lá số ngẫu nhiên nằm ở mục 11.

---

## 0. Quy ước trong tài liệu

- **Địa chi**, đánh số 0–11: Tý 0, Sửu 1, Dần 2, Mão 3, Thìn 4, Tỵ 5, Ngọ 6, Mùi 7, Thân 8, Dậu 9, Tuất 10, Hợi 11.
- **Thiên can**, đánh số 0–9: Giáp 0, Ất 1, Bính 2, Đinh 3, Mậu 4, Kỷ 5, Canh 6, Tân 7, Nhâm 8, Quý 9.
- `m12(x) = ((x mod 12) + 12) mod 12`. Mọi phép cộng trừ trên địa bàn đều lấy `m12`.
- "Thuận" là tăng chỉ số (Tý → Sửu → Dần…), "nghịch" là giảm.
- `Y` = chi năm sinh âm lịch, `C` = can năm sinh, `M` = tháng sinh âm lịch (1–12, sau khi xử lý nhuận), `D` = ngày sinh âm lịch (1–30), `H` = chỉ số canh giờ (Tý 0 … Hợi 11).
- `menh`, `than` = chỉ số địa chi của cung Mệnh và cung an Thân.
- `dir` = +1 nếu **Dương Nam hoặc Âm Nữ**, −1 nếu **Âm Nam hoặc Dương Nữ**. Năm dương là năm có can chẵn (Giáp, Bính, Mậu, Canh, Nhâm), tương đương chi chẵn.
- Dấu ⚠ đánh dấu điểm các nguồn bất đồng; chi tiết và lựa chọn mặc định ở mục 10.

---

## 1. Chuyển đổi lịch và giờ sinh

### 1.1. Đầu vào

Người dùng nhập: ngày, tháng, năm, giờ, phút (giờ đồng hồ tại nơi sinh), giới tính, tùy chọn lịch (dương hoặc âm, có cờ "tháng nhuận" khi nhập âm lịch), nơi sinh (tùy chọn, để xử lý múi giờ lịch sử).

### 1.2. Chuẩn hóa giờ đồng hồ về UTC+7

Giờ khai sinh là giờ đồng hồ theo múi giờ chính thức tại thời điểm sinh. Múi giờ chính thức ở Việt Nam từng thay đổi:

| Giai đoạn | Miền Bắc (Asia/Hanoi cũ) | Miền Nam (Asia/Ho_Chi_Minh) |
|---|---|---|
| Từ 1975-06-13 đến nay | UTC+7 | UTC+7 |
| 1960-01-01 → 1975-06-13 | UTC+7 | **UTC+8** |
| Trước 1960 | Có nhiều lần đổi (thời Pháp, Nhật); xem cơ sở dữ liệu IANA tz | Như cột trái |

Quy tắc: đổi giờ đồng hồ sang UTC bằng cơ sở dữ liệu IANA (`Asia/Ho_Chi_Minh` cho cả nước nếu không biết nơi sinh), rồi cộng 7 giờ. Kết quả là "giờ chuẩn UTC+7", dùng cho mọi bước sau. Ví dụ: sinh ở Sài Gòn 11:30 ngày 1/5/1970 (đồng hồ UTC+8) thì giờ chuẩn là 10:30, tức giờ **Tỵ**, không phải giờ Ngọ như khi đọc thẳng giờ đồng hồ.

⚠ Có thầy dùng **giờ mặt trời thực** (hiệu chỉnh theo kinh độ nơi sinh và phương trình thời gian, ví dụ Hà Nội chậm khoảng 10–20 phút so với UTC+7). Mặc định **không** hiệu chỉnh; nên có tùy chọn nâng cao "giờ mặt trời thực" về sau.

### 1.3. Giờ sinh → 12 canh giờ

`H = floor(((gio + 1) mod 24) / 2)` với `gio` là giờ chuẩn 0–23.

| H | Canh giờ | Khoảng | H | Canh giờ | Khoảng |
|---|---|---|---|---|---|
| 0 | Tý | 23:00–00:59 | 6 | Ngọ | 11:00–12:59 |
| 1 | Sửu | 01:00–02:59 | 7 | Mùi | 13:00–14:59 |
| 2 | Dần | 03:00–04:59 | 8 | Thân | 15:00–16:59 |
| 3 | Mão | 05:00–06:59 | 9 | Dậu | 17:00–18:59 |
| 4 | Thìn | 07:00–08:59 | 10 | Tuất | 19:00–20:59 |
| 5 | Tỵ | 09:00–10:59 | 11 | Hợi | 21:00–22:59 |

### 1.4. Giờ Tý muộn (23:00–23:59) ⚠

- **Mặc định: giờ 23:00–23:59 tính sang ngày hôm sau.** Trước khi đổi âm lịch, cộng 1 ngày dương lịch; ngày âm, tháng âm, năm âm, can chi ngày đều lấy theo ngày hôm sau. Canh giờ vẫn là Tý.
- Biến thể (engine repo hiện dùng): giữ nguyên ngày, chỉ đổi canh giờ thành Tý.
- Biến thể iztro: cộng 1 vào **ngày âm** (vượt số ngày của tháng thì quay về 1) nhưng **giữ nguyên tháng âm**.

Lý do chọn mặc định: ngày can chi đổi ở đầu giờ Tý (23h) theo phép làm lịch cổ; đa số sách Việt và iztro đều coi Tý muộn thuộc ngày sau. Cách "chỉ cộng ngày, giữ tháng" của iztro gây sai khi sinh đêm cuối tháng, vì tháng Mệnh không đổi theo. Cần cho người dùng chọn lại, vì đây là nguyên nhân hàng đầu khiến khách so lá số giữa các site thấy khác nhau.

### 1.5. Dương lịch → âm lịch Việt Nam

Dùng thuật toán Hồ Ngọc Đức (dựa trên *Astronomical Algorithms* của Jean Meeus), tính sóc (điểm trăng mới) và trung khí theo kinh độ Mặt Trời. Engine repo (`lich-raw.js`) đã cài đúng thuật toán này. Các bước:

1. `jdFromDate(d, m, y)`: số ngày Julius (lịch Gregory từ 15/10/1582, Julius trước đó).
2. `getNewMoonDay(k, tz)`: ngày Julius của lần sóc thứ k tính từ sóc 1/1/1900, quy về múi giờ `tz`.
3. `getSunLongitude(jd, tz)`: kinh độ Mặt Trời lúc 0h giờ địa phương, chia 12 khu vực 30°.
4. `getLunarMonth11(y, tz)`: ngày đầu tháng 11 âm (tháng chứa Đông chí).
5. Năm âm có tháng nhuận nếu khoảng giữa hai tháng 11 liên tiếp có 13 lần sóc. Tháng nhuận là **tháng đầu tiên sau tháng 11 không chứa trung khí**.
6. `duongSangAm`: xác định tháng chứa ngày cần đổi, số thứ tự tháng tính từ tháng 11, trừ đi nếu đã qua tháng nhuận.

Tham số múi giờ ⚠:

- **Mặc định: `tz = 7` cho ngày từ 01/01/1968, `tz = 8` cho ngày trước 01/01/1968.**
- Lý do: lịch âm Việt Nam chính thức tính theo kinh tuyến 105°Đ (UTC+7) từ năm 1968 (miền Bắc). Trước đó lịch dùng ở Việt Nam về cơ bản theo lịch Trung Quốc (UTC+8). Tết Mậu Thân là ví dụ nổi tiếng: miền Bắc đón Tết 29/1/1968, miền Nam (vẫn dùng lịch UTC+8) đón 30/1/1968.
- Engine repo dùng UTC+7 cho mọi năm. Hai cách cho kết quả khác nhau ở khoảng 4% số ngày trước 1968 (đo bằng engine tham chiếu, 1930–1967). Xem TC07: sinh 1/2/1965 là 30 tháng Chạp Giáp Thìn theo UTC+8, nhưng mùng 1 Tết Ất Tỵ theo UTC+7, khác cả năm sinh.
- Miền Nam 1968–1975 vẫn in lịch theo UTC+8. Tùy chọn nâng cao: nếu nơi sinh ở miền Nam và ngày sinh trong khoảng 1968–1975, cho người dùng chọn lịch nào. Mặc định vẫn dùng UTC+7.

Bảng các khoảng ngày (1930–2049) mà lịch Việt (UTC+7) và lịch Trung Quốc (UTC+8) khác nhau, sinh từ engine tham chiếu. Một engine dùng thư viện lịch Trung Quốc (như iztro với `lunar-lite`) sẽ ra lá số sai ở các ngày này:

| Khoảng ngày dương | Ngày đầu khoảng, theo lịch VN (ngày tháng năm) | Ngày cuối khoảng, theo lịch TQ (ngày tháng năm) |
|---|---|---|
| 22/07/1933-20/08/1933 | 1 6 1933  | 29 6 1933  |
| 17/11/1933-16/12/1933 | 1 10 1933  | 29 10 1933  |
| 03/02/1935-04/03/1935 | 1 1 1935  | 29 1 1935  |
| 12/01/1937-10/02/1937 | 1 12 1936  | 29 12 1936  |
| 25/08/1938-22/10/1938 | 1 8 1938  | 29 8 1938  |
| 19/04/1939-18/05/1939 | 1 3 1939  | 29 3 1939  |
| 22/03/1947-20/04/1947 | 1 2 1947 nhuận | 29 2 1947 nhuận |
| 13/08/1950-11/09/1950 | 1 7 1950  | 29 7 1950  |
| 04/06/1951-03/07/1951 | 1 5 1951  | 29 5 1951  |
| 09/08/1953-07/09/1953 | 1 7 1953  | 29 7 1953  |
| 02/11/1956-01/12/1956 | 1 10 1956  | 29 10 1956  |
| 01/03/1957-30/03/1957 | 1 2 1957  | 29 2 1957  |
| 21/11/1957-20/12/1957 | 1 10 1957  | 29 10 1957  |
| 14/05/1961-12/06/1961 | 1 4 1961  | 29 4 1961  |
| 05/10/1964-03/11/1964 | 1 9 1964  | 29 9 1964  |
| 01/02/1965-02/03/1965 | 1 1 1965  | 29 1 1965  |
| 01/12/1967-30/12/1967 | 1 11 1967  | 29 11 1967  |
| 29/01/1968-27/02/1968 | 1 1 1968  | 29 1 1968  |
| 16/02/1969-17/03/1969 | 1 1 1969  | 29 1 1969  |
| 13/12/1974-11/01/1975 | 1 11 1974  | 29 11 1974  |
| 11/04/1975-10/05/1975 | 1 3 1975  | 29 3 1975  |
| 02/09/1978-01/10/1978 | 1 8 1978  | 29 8 1978  |
| 26/02/1979-27/03/1979 | 1 2 1979  | 29 2 1979  |
| 30/05/1984-28/06/1984 | 1 5 1984  | 29 5 1984  |
| 23/11/1984-19/04/1985 | 1 11 1984  | 30 2 1985  |
| 01/12/1986-30/12/1986 | 1 11 1986  | 29 11 1986  |
| 26/07/1987-22/09/1987 | 1 7 1987  | 30 7 1987  |
| 01/08/1989-30/08/1989 | 1 7 1989  | 29 7 1989  |
| 24/09/1995-23/10/1995 | 1 8 1995 nhuận | 29 8 1995 nhuận |
| 15/07/1996-13/08/1996 | 1 6 1996  | 29 6 1996  |
| 10/12/1996-08/01/1997 | 1 11 1996  | 29 11 1996  |
| 01/10/1997-30/10/1997 | 1 9 1997  | 29 9 1997  |
| 29/12/1997-27/01/1998 | 1 12 1997  | 29 12 1997  |
| 25/06/2006-24/07/2006 | 1 6 2006  | 29 6 2006  |
| 17/02/2007-18/03/2007 | 1 1 2007  | 29 1 2007  |
| 27/11/2008-26/12/2008 | 1 11 2008  | 29 11 2008  |
| 26/03/2009-24/04/2009 | 1 3 2009  | 29 3 2009  |
| 07/11/2018-06/12/2018 | 1 10 2018  | 29 10 2018  |
| 06/03/2019-04/04/2019 | 1 2 2019  | 29 2 2019  |
| 14/12/2020-12/01/2021 | 1 11 2020  | 29 11 2020  |
| 02/02/2030-03/03/2030 | 1 1 2030  | 29 1 2030  |
| 21/04/2031-20/05/2031 | 1 3 2031 nhuận | 29 3 2031 nhuận |
| 11/03/2032-09/04/2032 | 1 2 2032  | 29 2 2032  |
| 12/09/2034-11/10/2034 | 1 8 2034  | 29 8 2034  |
| 15/04/2037-14/05/2037 | 1 3 2037  | 29 3 2037  |
| 04/04/2038-03/05/2038 | 1 3 2038  | 29 3 2038  |
| 15/12/2039-13/01/2040 | 1 11 2039  | 29 11 2039  |
| 26/08/2041-24/09/2041 | 1 8 2041  | 29 8 2041  |
| 26/10/2049-24/11/2049 | 1 10 2049  | 29 10 2049  |

Ghi chú 1987: Việt Nam nhuận tháng 7 (26/07 = 1/7; 24/08 = 1/7 nhuận; 23/09 = 1/8), Trung Quốc nhuận tháng 6 (26/07 = 1/6 nhuận; 24/08 = 1/7; 23/09 = 1/8). Vì vậy 02/09/1987 là 10/7 nhuận ở Việt Nam nhưng 10/7 thường ở Trung Quốc. Đối chiếu ngoài: xemlicham.com và baolamdong.vn (lịch Việt), lunar-python và lunardate (lịch Trung Quốc). Dòng 1987 ở bảng trên không đánh dấu nhuận.

Các trường hợp đã kiểm chứng với nguồn báo chí (VnExpress "Lịch sai do dịch sách Trung Quốc", RFA 07/02/2007):

- 1984: Trung Quốc nhuận tháng 10, Việt Nam không nhuận. Hệ quả: Tết Ất Sửu ở Việt Nam là **21/1/1985**, ở Trung Quốc là 20/2/1985. Từ 23/11/1984 đến 19/4/1985 hai lịch lệch nhau.
- 2006: sóc lúc 23:05 ngày 25/6 giờ Việt Nam, nên mùng 1 tháng 6 Bính Tuất ở Việt Nam là 25/6/2006, ở Trung Quốc là 26/6/2006.
- 2007: Tết Đinh Hợi ở Việt Nam là **17/2/2007**, ở Trung Quốc là 18/2/2007.
- Tương lai gần: Tết Canh Tuất 2030 ở Việt Nam là 2/2/2030, ở Trung Quốc là 3/2/2030.

### 1.6. Tháng nhuận ⚠

Đầu ra của bước đổi lịch có cờ `nhuan`. Khi an sao cần một số tháng `M` (1–12):

- **Mặc định: tháng nhuận an như tháng chính** (sinh tháng 4 nhuận thì `M = 4`). Engine repo đang làm vậy, phù hợp sách cụ Thiên Lương và đa số trang lập lá số Việt.
- Biến thể A: ngày 1–15 của tháng nhuận tính tháng chính, ngày 16 trở đi tính tháng sau (iztro dùng khi bật `fixLeap`).
- Biến thể B: tháng nhuận tính hẳn là tháng sau.

Tháng nhuận ảnh hưởng các sao an theo tháng (Mệnh, Thân, Tả Hữu, Hình Riêu, Thiên Giải, Địa Giải, Tam Thai, Bát Tọa, Đẩu Quân…) **và có thể đổi luôn vị trí cả 14 chính tinh**. Lý do: đổi tháng thì cung Mệnh đổi; cục lấy theo can chi cung Mệnh (nạp âm) nên cục có thể đổi; Tử Vi an theo **ngày và cục**, nên Tử Vi và các chính tinh theo sau có thể dời chỗ, đại vận cũng đổi tuổi khởi. Không được viết "chính tinh không đổi" trong nội dung cho khách.

Ví dụ cục đổi (nữ, âm 19/4 nhuận Canh Tý, tức 10/6/2020, giờ Thìn): mặc định (tháng 4) Mệnh Sửu, Hỏa Lục Cục, Tử Vi tại Tý; biến thể A/B (tháng 5) Mệnh Dần, Thổ Ngũ Cục, Tử Vi tại Thìn. TC04 trong file test có cả ba kết quả nhưng Tý và Sửu cùng nạp âm nên cục không đổi, không lộ được điểm này; ca cục đổi nằm ở `tests/research-cases.test.cjs` (test "tháng nhuận: cục đổi").

Lưu ý lỗi nhỏ của repo: hàm phụ `thangNhuan(2033)` trả 0, trong khi năm âm 2033 có tháng 11 nhuận (hàm chỉ dò tháng nhuận nằm giữa tháng 11 năm trước và tháng 11 năm đó). Hàm đổi lịch chính vẫn đúng.

### 1.7. Ranh giới năm

Năm sinh tính theo **năm âm lịch (mùng 1 Tết)**, không theo Lập Xuân. Đây là quy ước của Tử Vi Đẩu Số ở cả Việt Nam lẫn Trung Quốc (Lập Xuân dùng cho Tứ Trụ). Người sinh từ 1/1 dương lịch đến trước Tết thuộc năm âm trước.

---

## 2. Can chi, âm dương, cung Mệnh, cung Thân, 12 cung

### 2.1. Can chi

- Năm âm `N`: can `C = (N + 6) mod 10`, chi `Y = (N + 8) mod 12`.
- Tháng (ngũ hổ độn, tháng Giêng là tháng Dần): can tháng `= (C mod 5) × 2 + 2 + (M − 1)` lấy mod 10; chi tháng `= (M + 1) mod 12`. Tháng nhuận dùng can chi của tháng chính.
- Ngày: với `JD` là số ngày Julius của ngày dương (sau khi xử lý giờ Tý muộn): can `= (JD + 9) mod 10`, chi `= (JD + 1) mod 12`.
- Giờ (ngũ thử độn): can giờ Tý `= (can ngày mod 5) × 2`; can giờ `H` `= can giờ Tý + H` lấy mod 10.

Bảng khởi can tháng Giêng và can giờ Tý:

| Can năm | Can tháng Giêng (Dần) | Can ngày | Can giờ Tý |
|---|---|---|---|
| Giáp, Kỷ | Bính | Giáp, Kỷ | Giáp |
| Ất, Canh | Mậu | Ất, Canh | Bính |
| Bính, Tân | Canh | Bính, Tân | Mậu |
| Đinh, Nhâm | Nhâm | Đinh, Nhâm | Canh |
| Mậu, Quý | Giáp | Mậu, Quý | Nhâm |

### 2.2. Âm dương nam nữ

- Năm dương: can Giáp, Bính, Mậu, Canh, Nhâm. Năm âm: can còn lại.
- Hiển thị "Dương Nam", "Âm Nam", "Dương Nữ", "Âm Nữ".
- `dir = +1` với Dương Nam, Âm Nữ; `dir = −1` với Âm Nam, Dương Nữ.
- "Âm dương thuận lý" nếu tính âm dương của chi cung Mệnh trùng tính âm dương của năm sinh (chi chẵn là dương), ngược lại là "nghịch lý". Repo đang tính như vậy.

### 2.3. Cung Mệnh, cung Thân

Khởi tháng Giêng ở cung Dần, đếm thuận đến tháng sinh. Từ cung đó coi là giờ Tý:

- Đếm **nghịch** đến giờ sinh: cung **Mệnh**. Công thức `menh = m12(2 + (M − 1) − H)`.
- Đếm **thuận** đến giờ sinh: cung an **Thân**. Công thức `than = m12(2 + (M − 1) + H)`.

Kiểm tra bất biến: Thân chỉ có thể trùng Mệnh (giờ Tý, Ngọ), Phúc Đức (Sửu, Mùi), Quan Lộc (Dần, Thân), Thiên Di (Mão, Dậu), Tài Bạch (Thìn, Tuất), Phu Thê (Tỵ, Hợi).

### 2.4. Thứ tự 12 cung

Từ cung Mệnh đi **thuận** (tăng chỉ số địa chi): Mệnh, Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di, Tật Ách, Tài Bạch, Tử Tức, Phu Thê, Huynh Đệ.

(Tương đương: từ Mệnh đi nghịch là Huynh Đệ, Phu Thê, Tử Tức…) Cung Nô Bộc còn gọi là Giao Hữu; Quan Lộc còn gọi là Sự Nghiệp.

### 2.5. Thiên can 12 cung (ngũ hổ độn)

Can cung Dần = can tháng Giêng (bảng 2.1). Từ Dần đi thuận, mỗi cung tăng một can: `canCung(c) = ((C mod 5) × 2 + 2 + m12(c − 2)) mod 10`. Vì vậy hai cung Tý, Sửu mang can tiếp theo sau Hợi (cùng vòng 12 với Dần…Hợi). Ví dụ năm Giáp: Dần Bính, Mão Đinh, Thìn Mậu, Tỵ Kỷ, Ngọ Canh, Mùi Tân, Thân Nhâm, Dậu Quý, Tuất Giáp, Hợi Ất, Tý Bính, Sửu Đinh.

---

## 3. Cục và nạp âm

### 3.1. Nạp âm

Chỉ số lục thập hoa giáp `n` (0 = Giáp Tý … 59 = Quý Hợi) là số duy nhất trong 0–59 thỏa `n mod 10 = can` và `n mod 12 = chi` (công thức tương đương `n = (6 × can − 5 × chi) mod 60`). Nạp âm là phần tử thứ `floor(n / 2)` của bảng 30 nạp âm. Hành của nạp âm là chữ cuối (Kim, Thủy, Mộc, Hỏa, Thổ).

- **Bản mệnh** = nạp âm của can chi năm sinh.
- **Cục** = hành nạp âm của **can chi cung Mệnh** (can lấy theo mục 2.5): Thủy → Thủy nhị cục (2), Mộc → Mộc tam cục (3), Kim → Kim tứ cục (4), Thổ → Thổ ngũ cục (5), Hỏa → Hỏa lục cục (6).

Bảng 60 hoa giáp và nạp âm:

| # | Can chi | Nạp âm | # | Can chi | Nạp âm |
|---|---|---|---|---|---|
| 1 | Giáp Tý | Hải Trung Kim | 31 | Giáp Ngọ | Sa Trung Kim |
| 2 | Ất Sửu | Hải Trung Kim | 32 | Ất Mùi | Sa Trung Kim |
| 3 | Bính Dần | Lô Trung Hỏa | 33 | Bính Thân | Sơn Hạ Hỏa |
| 4 | Đinh Mão | Lô Trung Hỏa | 34 | Đinh Dậu | Sơn Hạ Hỏa |
| 5 | Mậu Thìn | Đại Lâm Mộc | 35 | Mậu Tuất | Bình Địa Mộc |
| 6 | Kỷ Tỵ | Đại Lâm Mộc | 36 | Kỷ Hợi | Bình Địa Mộc |
| 7 | Canh Ngọ | Lộ Bàng Thổ | 37 | Canh Tý | Bích Thượng Thổ |
| 8 | Tân Mùi | Lộ Bàng Thổ | 38 | Tân Sửu | Bích Thượng Thổ |
| 9 | Nhâm Thân | Kiếm Phong Kim | 39 | Nhâm Dần | Kim Bạch Kim |
| 10 | Quý Dậu | Kiếm Phong Kim | 40 | Quý Mão | Kim Bạch Kim |
| 11 | Giáp Tuất | Sơn Đầu Hỏa | 41 | Giáp Thìn | Phú Đăng Hỏa |
| 12 | Ất Hợi | Sơn Đầu Hỏa | 42 | Ất Tỵ | Phú Đăng Hỏa |
| 13 | Bính Tý | Giản Hạ Thủy | 43 | Bính Ngọ | Thiên Hà Thủy |
| 14 | Đinh Sửu | Giản Hạ Thủy | 44 | Đinh Mùi | Thiên Hà Thủy |
| 15 | Mậu Dần | Thành Đầu Thổ | 45 | Mậu Thân | Đại Trạch Thổ |
| 16 | Kỷ Mão | Thành Đầu Thổ | 46 | Kỷ Dậu | Đại Trạch Thổ |
| 17 | Canh Thìn | Bạch Lạp Kim | 47 | Canh Tuất | Thoa Xuyến Kim |
| 18 | Tân Tỵ | Bạch Lạp Kim | 48 | Tân Hợi | Thoa Xuyến Kim |
| 19 | Nhâm Ngọ | Dương Liễu Mộc | 49 | Nhâm Tý | Tang Đố Mộc |
| 20 | Quý Mùi | Dương Liễu Mộc | 50 | Quý Sửu | Tang Đố Mộc |
| 21 | Giáp Thân | Tuyền Trung Thủy | 51 | Giáp Dần | Đại Khê Thủy |
| 22 | Ất Dậu | Tuyền Trung Thủy | 52 | Ất Mão | Đại Khê Thủy |
| 23 | Bính Tuất | Ốc Thượng Thổ | 53 | Bính Thìn | Sa Trung Thổ |
| 24 | Đinh Hợi | Ốc Thượng Thổ | 54 | Đinh Tỵ | Sa Trung Thổ |
| 25 | Mậu Tý | Tích Lịch Hỏa | 55 | Mậu Ngọ | Thiên Thượng Hỏa |
| 26 | Kỷ Sửu | Tích Lịch Hỏa | 56 | Kỷ Mùi | Thiên Thượng Hỏa |
| 27 | Canh Dần | Tùng Bách Mộc | 57 | Canh Thân | Thạch Lựu Mộc |
| 28 | Tân Mão | Tùng Bách Mộc | 58 | Tân Dậu | Thạch Lựu Mộc |
| 29 | Nhâm Thìn | Trường Lưu Thủy | 59 | Nhâm Tuất | Đại Hải Thủy |
| 30 | Quý Tỵ | Trường Lưu Thủy | 60 | Quý Hợi | Đại Hải Thủy |

### 3.2. Bảng tra cục nhanh (can năm × chi cung Mệnh)

| Can năm \ Chi cung Mệnh | Tý | Sửu | Dần | Mão | Thìn | Tỵ | Ngọ | Mùi | Thân | Dậu | Tuất | Hợi |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Giáp, Kỷ | Thủy 2 | Thủy 2 | Hỏa 6 | Hỏa 6 | Mộc 3 | Mộc 3 | Thổ 5 | Thổ 5 | Kim 4 | Kim 4 | Hỏa 6 | Hỏa 6 |
| Ất, Canh | Hỏa 6 | Hỏa 6 | Thổ 5 | Thổ 5 | Kim 4 | Kim 4 | Mộc 3 | Mộc 3 | Thủy 2 | Thủy 2 | Thổ 5 | Thổ 5 |
| Bính, Tân | Thổ 5 | Thổ 5 | Mộc 3 | Mộc 3 | Thủy 2 | Thủy 2 | Kim 4 | Kim 4 | Hỏa 6 | Hỏa 6 | Mộc 3 | Mộc 3 |
| Đinh, Nhâm | Mộc 3 | Mộc 3 | Kim 4 | Kim 4 | Hỏa 6 | Hỏa 6 | Thủy 2 | Thủy 2 | Thổ 5 | Thổ 5 | Kim 4 | Kim 4 |
| Mậu, Quý | Kim 4 | Kim 4 | Thủy 2 | Thủy 2 | Thổ 5 | Thổ 5 | Hỏa 6 | Hỏa 6 | Mộc 3 | Mộc 3 | Thủy 2 | Thủy 2 |

### 3.3. Quan hệ Mệnh – Cục

So hành bản mệnh với hành cục: bình hòa (cùng hành), Mệnh sinh Cục, Cục sinh Mệnh, Mệnh khắc Cục, Cục khắc Mệnh. Repo đã có hàm `sinhKhac`.

---

## 4. An 14 chính tinh

### 4.1. An Tử Vi theo cục và ngày sinh

Với cục `K` (2–6) và ngày âm `D` (1–30):

1. Tìm số nhỏ nhất `x ≥ 0` sao cho `(D + x)` chia hết cho `K`.
2. `q = (D + x) / K`.
3. Đếm từ cung Dần là 1, thuận đến `q`: cung `p = m12(2 + q − 1)`.
4. Nếu `x` chẵn thì `TuVi = m12(p + x)`; nếu `x` lẻ thì `TuVi = m12(p − x)`.

Thiên Phủ đối xứng với Tử Vi qua trục Dần–Thân: `ThienPhu = m12(4 − TuVi)`.

Bảng tra Tử Vi (đầy đủ 30 ngày × 5 cục):

| Ngày \ Cục | Thủy 2 | Mộc 3 | Kim 4 | Thổ 5 | Hỏa 6 |
|---|---|---|---|---|---|
| 1 | Sửu | Thìn | Hợi | Ngọ | Dậu |
| 2 | Dần | Sửu | Thìn | Hợi | Ngọ |
| 3 | Dần | Dần | Sửu | Thìn | Hợi |
| 4 | Mão | Tỵ | Dần | Sửu | Thìn |
| 5 | Mão | Dần | Tý | Dần | Sửu |
| 6 | Thìn | Mão | Tỵ | Mùi | Dần |
| 7 | Thìn | Ngọ | Dần | Tý | Tuất |
| 8 | Tỵ | Mão | Mão | Tỵ | Mùi |
| 9 | Tỵ | Thìn | Sửu | Dần | Tý |
| 10 | Ngọ | Mùi | Ngọ | Mão | Tỵ |
| 11 | Ngọ | Thìn | Mão | Thân | Dần |
| 12 | Mùi | Tỵ | Thìn | Sửu | Mão |
| 13 | Mùi | Thân | Dần | Ngọ | Hợi |
| 14 | Thân | Tỵ | Mùi | Mão | Thân |
| 15 | Thân | Ngọ | Thìn | Thìn | Sửu |
| 16 | Dậu | Dậu | Tỵ | Dậu | Ngọ |
| 17 | Dậu | Ngọ | Mão | Dần | Mão |
| 18 | Tuất | Mùi | Thân | Mùi | Thìn |
| 19 | Tuất | Tuất | Tỵ | Thìn | Tý |
| 20 | Hợi | Mùi | Ngọ | Tỵ | Dậu |
| 21 | Hợi | Thân | Thìn | Tuất | Dần |
| 22 | Tý | Hợi | Dậu | Mão | Mùi |
| 23 | Tý | Thân | Ngọ | Thân | Thìn |
| 24 | Sửu | Dậu | Mùi | Tỵ | Tỵ |
| 25 | Sửu | Tý | Tỵ | Ngọ | Sửu |
| 26 | Dần | Dậu | Tuất | Hợi | Tuất |
| 27 | Dần | Tuất | Mùi | Thìn | Mão |
| 28 | Mão | Sửu | Thân | Dậu | Thân |
| 29 | Mão | Tuất | Ngọ | Ngọ | Tỵ |
| 30 | Thìn | Hợi | Hợi | Mùi | Ngọ |

### 4.2. Nhóm Tử Vi (đi nghịch từ Tử Vi)

| Sao | Vị trí |
|---|---|
| Tử Vi | `T` |
| Thiên Cơ | `T − 1` |
| (trống) | `T − 2` |
| Thái Dương | `T − 3` |
| Vũ Khúc | `T − 4` |
| Thiên Đồng | `T − 5` |
| (trống 2 cung) | `T − 6`, `T − 7` |
| Liêm Trinh | `T − 8` (tức `T + 4`) |

### 4.3. Nhóm Thiên Phủ (đi thuận từ Thiên Phủ)

| Sao | Vị trí |
|---|---|
| Thiên Phủ | `P` |
| Thái Âm | `P + 1` |
| Tham Lang | `P + 2` |
| Cự Môn | `P + 3` |
| Thiên Tướng | `P + 4` |
| Thiên Lương | `P + 5` |
| Thất Sát | `P + 6` |
| (trống 3 cung) | `P + 7` … `P + 9` |
| Phá Quân | `P + 10` |

### 4.4. Bảng tra 14 chính tinh theo vị trí Tử Vi

| Tử Vi | Thiên Cơ | Thái Dương | Vũ Khúc | Thiên Đồng | Liêm Trinh | Thiên Phủ | Thái Âm | Tham Lang | Cự Môn | Thiên Tướng | Thiên Lương | Thất Sát | Phá Quân |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tý | Hợi | Dậu | Thân | Mùi | Thìn | Thìn | Tỵ | Ngọ | Mùi | Thân | Dậu | Tuất | Dần |
| Sửu | Tý | Tuất | Dậu | Thân | Tỵ | Mão | Thìn | Tỵ | Ngọ | Mùi | Thân | Dậu | Sửu |
| Dần | Sửu | Hợi | Tuất | Dậu | Ngọ | Dần | Mão | Thìn | Tỵ | Ngọ | Mùi | Thân | Tý |
| Mão | Dần | Tý | Hợi | Tuất | Mùi | Sửu | Dần | Mão | Thìn | Tỵ | Ngọ | Mùi | Hợi |
| Thìn | Mão | Sửu | Tý | Hợi | Thân | Tý | Sửu | Dần | Mão | Thìn | Tỵ | Ngọ | Tuất |
| Tỵ | Thìn | Dần | Sửu | Tý | Dậu | Hợi | Tý | Sửu | Dần | Mão | Thìn | Tỵ | Dậu |
| Ngọ | Tỵ | Mão | Dần | Sửu | Tuất | Tuất | Hợi | Tý | Sửu | Dần | Mão | Thìn | Thân |
| Mùi | Ngọ | Thìn | Mão | Dần | Hợi | Dậu | Tuất | Hợi | Tý | Sửu | Dần | Mão | Mùi |
| Thân | Mùi | Tỵ | Thìn | Mão | Tý | Thân | Dậu | Tuất | Hợi | Tý | Sửu | Dần | Ngọ |
| Dậu | Thân | Ngọ | Tỵ | Thìn | Sửu | Mùi | Thân | Dậu | Tuất | Hợi | Tý | Sửu | Tỵ |
| Tuất | Dậu | Mùi | Ngọ | Tỵ | Dần | Ngọ | Mùi | Thân | Dậu | Tuất | Hợi | Tý | Thìn |
| Hợi | Tuất | Thân | Mùi | Ngọ | Mão | Tỵ | Ngọ | Mùi | Thân | Dậu | Tuất | Hợi | Mão |

Kiểm tra bất biến: Tử Vi và Thiên Phủ đồng cung khi Tử Vi ở Dần hoặc Thân. Mỗi lá số có đúng 14 chính tinh trên 12 cung, luôn có 2 đến 4 cung vô chính diệu.

---

## 5. Phụ tinh, sát tinh, tứ hóa và các vòng sao

Mỗi dòng ghi công thức theo quy ước mục 0. Cột "Repo" cho biết engine `tuvi-raw.js` hiện an **đúng** (khớp 100% trên 3.000 lá số thử), **khác** (có ⚠, xem mục 10) hay **thiếu**.

### 5.1. Vòng Lộc Tồn – Bác Sĩ (theo can năm, 12 sao + 2 sát tinh)

Lộc Tồn theo can năm:

| Can | Giáp | Ất | Bính | Đinh | Mậu | Kỷ | Canh | Tân | Nhâm | Quý |
|---|---|---|---|---|---|---|---|---|---|---|
| Lộc Tồn | Dần | Mão | Tỵ | Ngọ | Tỵ | Ngọ | Thân | Dậu | Hợi | Tý |

- Kình Dương `= LT + 1`, Đà La `= LT − 1` (luôn thuận/nghịch cố định, không theo giới tính). Repo: đúng.
- Vòng Bác Sĩ: bắt đầu tại cung Lộc Tồn, đi theo `dir` (Dương Nam/Âm Nữ thuận, Âm Nam/Dương Nữ nghịch), lần lượt: **Bác Sĩ, Lực Sĩ, Thanh Long, Tiểu Hao, Tướng Quân, Tấu Thư, Phi Liêm, Hỷ Thần, Bệnh Phù, Đại Hao, Phục Binh, Quan Phủ**. Sao thứ i (0–11) ở `m12(LT + dir × i)`. Repo: đúng.

### 5.2. Vòng Thái Tuế (theo chi năm, 12 sao, luôn đi thuận)

Bắt đầu tại cung chi năm sinh `Y`: **Thái Tuế, Thiếu Dương, Tang Môn, Thiếu Âm, Quan Phù, Tử Phù, Tuế Phá, Long Đức, Bạch Hổ, Phúc Đức, Điếu Khách, Trực Phù**. Sao thứ i ở `m12(Y + i)`. Repo: đúng.

Các sao đồng cung cố định trong vòng này (phái Việt): **Thiên Không** cùng cung Thiếu Dương (`Y + 1`), **Nguyệt Đức** cùng Tử Phù (`Y + 5`), **Thiên Đức** cùng Phúc Đức (`Y + 9`). Repo: đúng.

### 5.3. Vòng Tràng Sinh (theo cục, 12 sao)

Khởi Tràng Sinh theo cục: Thủy nhị và Thổ ngũ ở **Thân**, Mộc tam ở **Hợi**, Kim tứ ở **Tỵ**, Hỏa lục ở **Dần**. Đi theo `dir`: **Tràng Sinh, Mộc Dục, Quan Đới, Lâm Quan, Đế Vượng, Suy, Bệnh, Tử, Mộ, Tuyệt, Thai, Dưỡng**. Repo và iztro: đúng, khớp nhau.

### 5.4. Sao an theo tháng sinh `M`

| Sao | Công thức | Ghi chú | Repo |
|---|---|---|---|
| Tả Phù | `Thìn + (M − 1)` | thuận | đúng |
| Hữu Bật | `Tuất − (M − 1)` | nghịch | đúng |
| Thiên Hình | `Dậu + (M − 1)` | | đúng |
| Thiên Riêu | `Sửu + (M − 1)` | | đúng |
| Thiên Y | cùng cung Thiên Riêu | | đúng |
| Địa Giải | `Mùi + (M − 1)` | tương đương Tả Phù + 3 | đúng |
| Thiên Giải ⚠ | `Thân + 2 × (M − 1)` | mặc định theo dòng sách Thiên Lương; biến thể xem 10.7 | đúng |
| Đẩu Quân | `Y − (M − 1) + H` | từ chi năm đếm nghịch đến tháng sinh, rồi thuận đến giờ sinh; cũng là cung tháng Giêng của lưu nguyệt (mục 7.5) | đúng |
| Thiên Nguyệt (tùy chọn) | theo M: Tuất, Tỵ, Thìn, Dần, Mùi, Mão, Hợi, Mùi, Dần, Ngọ, Tuất, Dần | ít dùng ở phái Việt; iztro có | thiếu |
| Thiên Vu (tùy chọn) | theo `(M − 1) mod 4`: Tỵ, Thân, Dần, Hợi | như trên | thiếu |
| Âm Sát (tùy chọn) | theo `(M − 1) mod 6`: Dần, Tý, Tuất, Thân, Ngọ, Thìn | như trên | thiếu |

### 5.5. Sao an theo giờ sinh `H`

| Sao | Công thức | Repo |
|---|---|---|
| Văn Xương | `Tuất − H` | đúng |
| Văn Khúc | `Thìn + H` | đúng |
| Địa Không | `Hợi − H` | đúng |
| Địa Kiếp | `Hợi + H` | đúng |
| Thai Phụ | `Ngọ + H` (tức Văn Khúc + 2) | đúng |
| Phong Cáo | `Dần + H` (tức Văn Khúc − 2) | đúng |

### 5.6. Sao an theo ngày sinh `D` (dựa vào sao tháng/giờ)

| Sao | Công thức | Repo |
|---|---|---|
| Tam Thai | `TaPhu + (D − 1)` (từ Tả Phù là ngày 1, đếm thuận) | đúng |
| Bát Tọa | `HuuBat − (D − 1)` (từ Hữu Bật là ngày 1, đếm nghịch) | đúng |
| Ân Quang | `VanXuong + (D − 2)` (từ Văn Xương là ngày 1 đếm thuận đến ngày sinh, lùi 1 cung) | đúng |
| Thiên Quý | `VanKhuc − (D − 2)` (từ Văn Khúc là ngày 1 đếm nghịch, lùi 1 cung) | đúng |

### 5.7. Sao an theo can năm `C`

| Sao | Giáp | Ất | Bính | Đinh | Mậu | Kỷ | Canh | Tân | Nhâm | Quý | Repo |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Thiên Khôi ⚠ | Sửu | Tý | Hợi | Hợi | Sửu | Tý | Sửu | Ngọ | Mão | Mão | khác ở Đinh, Mậu, Canh, Nhâm |
| Thiên Việt ⚠ | Mùi | Thân | Dậu | Dậu | Mùi | Thân | Mùi | Dần | Tỵ | Tỵ | khác ở Đinh, Mậu, Canh, Nhâm |
| Thiên Quan | Mùi | Thìn | Tỵ | Dần | Mão | Dậu | Hợi | Dậu | Tuất | Ngọ | đúng |
| Thiên Phúc | Dậu | Thân | Tý | Hợi | Mão | Dần | Ngọ | Tỵ | Ngọ | Tỵ | đúng |
| Lưu Hà ⚠ | Dậu | Tuất | Mùi | Thân | Tỵ | Ngọ | Thìn | Mão | Hợi | Dần | khác ở Đinh, Canh |
| Thiên Trù ⚠ | Tỵ | Ngọ | Tý | Tỵ | Ngọ | Thân | Dần | Ngọ | Dậu | Tuất | đúng (iztro: Quý ở Hợi) |
| Văn Tinh | `LT + 3` | | | | | | | | | | đúng |
| Đường Phù | `LT + 5` | | | | | | | | | | đúng |
| Quốc Ấn | `LT + 8` | | | | | | | | | | đúng |
| Triệt (2 cung) | Thân–Dậu | Ngọ–Mùi | Thìn–Tỵ | Dần–Mão | Tý–Sửu | Thân–Dậu | Ngọ–Mùi | Thìn–Tỵ | Dần–Mão | Tý–Sửu | đúng |

Văn Tinh, Đường Phù, Quốc Ấn là sao riêng của sách Việt (từ Kình Dương đếm thuận: Kình là 1, Văn Tinh ở cung 3; từ Văn Tinh tới Đường Phù 3 cung; từ Đường Phù tới Quốc Ấn 4 cung).

### 5.8. Tứ hóa theo can năm ⚠

| Can | Hóa Lộc | Hóa Quyền | Hóa Khoa | Hóa Kỵ |
|---|---|---|---|---|
| Giáp | Liêm Trinh | Phá Quân | Vũ Khúc | Thái Dương |
| Ất | Thiên Cơ | Thiên Lương | Tử Vi | Thái Âm |
| Bính | Thiên Đồng | Thiên Cơ | Văn Xương | Liêm Trinh |
| Đinh | Thái Âm | Thiên Đồng | Thiên Cơ | Cự Môn |
| Mậu | Tham Lang | Thái Âm | Hữu Bật | Thiên Cơ |
| Kỷ | Vũ Khúc | Tham Lang | Thiên Lương | Văn Khúc |
| Canh | Thái Dương | Vũ Khúc | **Thiên Đồng** | **Thái Âm** |
| Tân | Cự Môn | Thái Dương | Văn Khúc | Văn Xương |
| Nhâm | Thiên Lương | Tử Vi | **Thiên Phủ** | Vũ Khúc |
| Quý | Phá Quân | Cự Môn | Thái Âm | Tham Lang |

Sao Hóa nằm cùng cung với sao được hóa. Repo: đúng theo bảng này. iztro (phái Trung Quốc) khác ở hai can in đậm: Canh là Thái Dương, Vũ Khúc, Thái Âm, Thiên Đồng (Khoa Thái Âm, Kỵ Thiên Đồng), Nhâm là Hóa Khoa **Tả Phù**. Xem 10.4.

### 5.9. Sao an theo chi năm `Y`

| Sao | Công thức hoặc bảng | Repo |
|---|---|---|
| Long Trì | `Thìn + Y` | đúng |
| Phượng Các | `Tuất − Y` | đúng |
| Giải Thần | cùng cung Phượng Các | đúng |
| Thiên Khốc | `Ngọ − Y` | đúng |
| Thiên Hư | `Ngọ + Y` | đúng |
| Hồng Loan | `Mão − Y` | đúng |
| Thiên Hỷ | `Hồng Loan + 6` (xung chiếu Hồng Loan) | đúng |
| Thiên Tài | `menh + Y` (từ cung Mệnh coi là Tý, đếm thuận đến chi năm) | đúng |
| Thiên Thọ | `than + Y` (từ cung Thân coi là Tý, đếm thuận đến chi năm) | đúng |
| Cô Thần | Dần Mão Thìn → **Tỵ**; Tỵ Ngọ Mùi → **Thân**; Thân Dậu Tuất → **Hợi**; Hợi Tý Sửu → **Dần** | đúng |
| Quả Tú | `CoThan − 4`: tương ứng Sửu, Thìn, Mùi, Tuất | đúng |
| Phá Toái ⚠ | Tý Ngọ Mão Dậu → **Tỵ**; Dần Thân Tỵ Hợi → **Dậu**; Thìn Tuất Sửu Mùi → **Sửu** | khác (repo đổi chỗ Tỵ và Dậu) |
| Thiên Mã | Dần Ngọ Tuất → **Thân**; Thân Tý Thìn → **Dần**; Tỵ Dậu Sửu → **Hợi**; Hợi Mão Mùi → **Tỵ** | đúng |
| Hoa Cái | Dần Ngọ Tuất → Tuất; Thân Tý Thìn → Thìn; Tỵ Dậu Sửu → Sửu; Hợi Mão Mùi → Mùi (= Mã + 2) | đúng |
| Kiếp Sát | Dần Ngọ Tuất → Hợi; Thân Tý Thìn → Tỵ; Tỵ Dậu Sửu → Dần; Hợi Mão Mùi → Thân (= Mã + 3) | đúng |
| Đào Hoa | Dần Ngọ Tuất → **Mão**; Thân Tý Thìn → **Dậu**; Tỵ Dậu Sửu → **Ngọ**; Hợi Mão Mùi → **Tý** (= Mã + 7) | đúng |
| Hỏa Tinh, Linh Tinh ⚠ | xem 5.10 | khác ở nhóm Tỵ Dậu Sửu |
| Tuần (2 cung) | xem 5.12 | đúng |

### 5.10. Hỏa Tinh, Linh Tinh ⚠

Cung khởi theo tam hợp chi năm (câu phú "Dần Ngọ Tuất nhân Sửu Mão phương; Thân Tý Thìn nhân Dần Tuất dương; Tỵ Dậu Sửu nhân Mão Tuất vị; Hợi Mão Mùi nhân Dậu Tuất phòng", chữ đầu là Hỏa, chữ sau là Linh):

| Chi năm | Hỏa khởi | Linh khởi |
|---|---|---|
| Dần, Ngọ, Tuất | Sửu | Mão |
| Thân, Tý, Thìn | Dần | Tuất |
| Tỵ, Dậu, Sửu | Mão | Tuất |
| Hợi, Mão, Mùi | Dậu | Tuất |

Từ cung khởi coi là giờ Tý, đếm đến giờ sinh. Phái Việt:

- Dương Nam, Âm Nữ (`dir = +1`): Hỏa đếm **thuận** (`HoaKhoi + H`), Linh đếm **nghịch** (`LinhKhoi − H`).
- Âm Nam, Dương Nữ (`dir = −1`): Hỏa đếm **nghịch** (`HoaKhoi − H`), Linh đếm **thuận** (`LinhKhoi + H`).

Repo: đúng chiều đi, nhưng nhóm Tỵ Dậu Sửu đang đặt Hỏa khởi Tuất, Linh khởi Mão (ngược câu phú). Sai khoảng 24% lá số (711/3.000, đúng bằng tỷ lệ người sinh năm Tỵ, Dậu, Sửu). iztro dùng cùng bảng khởi như trên nhưng **luôn đếm thuận** cho cả hai sao (phái Trung Quốc).

### 5.11. Sao cố định và sao theo cung

| Sao | Vị trí | Repo |
|---|---|---|
| Thiên La | luôn ở Thìn | đúng |
| Địa Võng | luôn ở Tuất | đúng |
| Thiên Thương ⚠ | cung Nô Bộc (`menh + 5`) | đúng |
| Thiên Sứ ⚠ | cung Tật Ách (`menh + 7`) | đúng |

### 5.12. Tuần, Triệt

- **Tuần** (Tuần Trung Không Vong): hai cung không có trong tuần giáp chứa can chi năm sinh. Đầu tuần (ngày Giáp) có chi `G = m12(Y − C)`; Tuần ở `G + 10` và `G + 11`. Ví dụ năm Ất Hợi: `G = 11 − 1 = 10` (Giáp Tuất), Tuần ở Thân–Dậu.
- **Triệt** (Triệt Lộ Không Vong): theo can năm, bảng ở 5.7.
- Phái Việt đánh dấu Tuần, Triệt nằm ở **ranh giới giữa hai cung** (ảnh hưởng cả hai). Engine trả về cặp hai cung; giao diện vẽ ở giữa vạch ngăn.
- iztro (phái Trung Quốc) chỉ chọn **một** trong hai cung (cung có âm dương cùng năm sinh) cho "tuần không", "triệt không". Không theo cách này.

### 5.13. Đặc tính khác cần trả về

- Mỗi sao có ngũ hành và loại (chính tinh, cát tinh, sát/hung tinh). Repo đã có bảng `SAO` (giữ nguyên).
- Hành cung (cố định): Tý Thủy, Sửu Thổ, Dần Mộc, Mão Mộc, Thìn Thổ, Tỵ Hỏa, Ngọ Hỏa, Mùi Thổ, Thân Kim, Dậu Kim, Tuất Thổ, Hợi Thủy.

### 5.14. Danh mục sao và số lượng

| Nhóm | Số sao | Danh sách |
|---|---|---|
| Chính tinh | 14 | mục 4 |
| Vòng Lộc Tồn | 15 | Lộc Tồn, Kình Dương, Đà La + 12 sao vòng Bác Sĩ |
| Vòng Thái Tuế | 15 | 12 sao + Thiên Không, Nguyệt Đức, Thiên Đức |
| Vòng Tràng Sinh | 12 | mục 5.3 |
| Theo tháng | 9 (+3 tùy chọn) | Tả Phù, Hữu Bật, Thiên Hình, Thiên Riêu, Thiên Y, Thiên Giải, Địa Giải, Đẩu Quân; tùy chọn Thiên Nguyệt, Thiên Vu, Âm Sát |
| Theo giờ | 6 | Văn Xương, Văn Khúc, Địa Không, Địa Kiếp, Thai Phụ, Phong Cáo |
| Theo ngày | 4 | Tam Thai, Bát Tọa, Ân Quang, Thiên Quý |
| Theo can năm | 9 | Thiên Khôi, Thiên Việt, Thiên Quan, Thiên Phúc, Lưu Hà, Thiên Trù, Văn Tinh, Đường Phù, Quốc Ấn |
| Tứ hóa | 4 | Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ |
| Theo chi năm | 16 | Long Trì, Phượng Các, Giải Thần, Thiên Khốc, Thiên Hư, Hồng Loan, Thiên Hỷ, Thiên Tài, Thiên Thọ, Cô Thần, Quả Tú, Phá Toái, Thiên Mã, Hoa Cái, Kiếp Sát, Đào Hoa |
| Theo năm + giờ | 2 | Hỏa Tinh, Linh Tinh |
| Cố định / theo cung | 4 | Thiên La, Địa Võng, Thiên Thương, Thiên Sứ |
| Tuần, Triệt | 2 | mục 5.12 |
| Sao lưu (vận hạn) | 15 | mục 7.4 |
| **Tổng** | **127 (+3 tùy chọn)** | 97 sao gốc (cùng danh mục với repo) + 12 Tràng Sinh + Tuần, Triệt + 15 sao lưu; thêm 3 sao tùy chọn |

---

## 6. Độ sáng (Miếu, Vượng, Đắc, Bình, Hãm)

Ký hiệu: M miếu, V vượng, Đ đắc địa, B bình hòa, H hãm, "–" không xét. Bảng theo cung Tý → Hợi. Mặc định dùng bảng của engine repo (dòng sách cụ Thiên Lương, qua ansaotuvi). Bảng này khớp các điểm chính của sách Việt: Kình Đà đắc ở tứ mộ, Thái Dương sáng từ Dần đến Ngọ và hãm từ Thân đến Hợi, Thái Âm sáng từ Thân đến Tý.

| Sao | Tý | Sửu | Dần | Mão | Thìn | Tỵ | Ngọ | Mùi | Thân | Dậu | Tuất | Hợi |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tử Vi | B | Đ | M | B | V | M | M | Đ | M | B | V | B |
| Liêm Trinh | V | Đ | V | H | M | H | V | Đ | V | H | M | H |
| Thiên Đồng | V | H | M | Đ | H | Đ | H | H | M | H | H | Đ |
| Vũ Khúc | V | M | V | Đ | M | H | V | M | V | Đ | M | H |
| Thái Dương | H | Đ | V | V | V | M | M | Đ | H | H | H | H |
| Thiên Cơ | Đ | Đ | H | M | M | V | Đ | Đ | V | M | M | H |
| Thiên Phủ | M | B | M | B | V | Đ | M | Đ | M | B | V | Đ |
| Thái Âm | V | Đ | H | H | H | H | H | Đ | V | M | M | M |
| Tham Lang | H | M | Đ | H | V | H | H | M | Đ | H | V | H |
| Cự Môn | V | H | V | M | H | H | V | H | Đ | M | H | Đ |
| Thiên Tướng | V | Đ | M | H | V | Đ | V | Đ | M | H | V | Đ |
| Thiên Lương | Đ | Đ | V | V | M | H | M | Đ | V | H | M | H |
| Thất Sát | M | Đ | M | H | H | V | M | Đ | M | H | H | H |
| Phá Quân | M | V | H | H | V | H | M | V | H | H | V | H |
| Kình Dương / Đà La | H | Đ | H | H | Đ | H | H | Đ | H | H | Đ | H |
| Hỏa Tinh / Linh Tinh | H | B | Đ | Đ | Đ | Đ | Đ | B | H | H | H | H |
| Văn Xương / Văn Khúc | H | Đ | H | H | Đ | H | H | Đ | H | H | Đ | H |
| Địa Không / Địa Kiếp | H | H | Đ | H | H | Đ | H | H | Đ | H | H | Đ |
| Hóa Lộc / Quyền / Kỵ | H | Đ | H | H | Đ | H | H | Đ | H | H | Đ | H |
| Hóa Khoa | Đ | Đ | Đ | Đ | Đ | Đ | Đ | Đ | Đ | Đ | Đ | Đ |
| Đại Hao / Tiểu Hao | H | H | Đ | Đ | H | H | H | H | Đ | Đ | H | H |
| Thiên Khốc / Thiên Hư | Đ | H | H | Đ | H | H | Đ | H | H | Đ | H | H |
| Thiên Mã | – | – | Đ | – | – | Đ | – | – | Đ | – | – | Đ |
| Thiên Hình | – | – | Đ | Đ | – | – | – | – | Đ | Đ | – | – |
| Thiên Riêu | – | – | Đ | Đ | – | – | – | – | – | Đ | Đ | – |

Chú thích và điểm cần duyệt:

- Tử Vi ở Ngọ: bảng repo ghi **M** (miếu), ở Tý ghi **B**. Một số sách Việt ghi Tử Vi ở Tý, Ngọ cùng "miếu" hoặc cùng "bình". Cần chuyên gia chốt.
- Độ sáng của iztro (phái Trung Quốc) có 7 bậc (miếu, vượng, đắc, lợi, bình, bất, hãm) và khác bảng Việt ở nhiều ô, ví dụ Thái Âm ở Dậu: iztro "bất", bảng Việt "miếu". **Không dùng** bảng độ sáng của iztro.
- Bảng độ sáng cho Hóa Lộc, Hóa Quyền, Hóa Kỵ trong repo (đắc ở tứ mộ) là quy ước của riêng ansaotuvi, ít sách nói. Có thể ẩn trên giao diện cho đến khi chuyên gia xác nhận.
- Lộc Tồn, Thiên Mã, Tả Hữu, Khôi Việt, Đào Hồng… độ sáng ít ảnh hưởng luận giải; giữ "–" trừ Thiên Mã, Thiên Hình, Thiên Riêu như bảng.

---

## 7. Vận hạn: đại vận, tiểu hạn, lưu niên, lưu nguyệt

### 7.1. Đại vận (đại hạn 10 năm)

- Khởi tại **cung Mệnh**, tuổi bắt đầu bằng **số cục** (Thủy 2, Mộc 3, Kim 4, Thổ 5, Hỏa 6).
- Đi theo `dir`: Dương Nam, Âm Nữ thuận; Âm Nam, Dương Nữ nghịch.
- Cung thứ i (0–11) theo chiều trên có đại vận từ tuổi `K + 10i` đến `K + 10i + 9`.
- Tuổi tính theo **tuổi mụ** (tuổi âm): `tuoi = namAmXem − namAmSinh + 1`.
- Repo: đúng (hàm `khoangCach`, `daiVanTu`). iztro: cùng quy tắc.

### 7.2. Tiểu hạn

Khởi tuổi 1 (năm sinh) theo tam hợp chi năm:

| Chi năm sinh | Cung khởi tiểu hạn tuổi 1 |
|---|---|
| Dần, Ngọ, Tuất | Thìn |
| Thân, Tý, Thìn | Tuất |
| Tỵ, Dậu, Sửu | Mùi |
| Hợi, Mão, Mùi | Sửu |

Nam đi thuận, nữ đi nghịch (không xét âm dương năm). Mỗi năm qua một cung; ô cung ghi tên chi của năm có tiểu hạn ở đó: cung khởi ghi chi năm sinh, cung kế tiếp ghi chi năm sau. Năm `X` có tiểu hạn tại `m12(khoi + gt × (chiX − Y))` với `gt = +1` nam, `−1` nữ. Repo: đúng.

### 7.3. Lưu niên

- **Lưu Thái Tuế**: cung có chi trùng chi năm đang xem. Cung này là "cung lưu niên" chính ở phái Việt.
- **Lưu tứ hóa**: tứ hóa theo **can năm đang xem** (bảng 5.8), hóa vào sao gốc trên lá số.
- **Đại vận đang đi**: cung có khoảng tuổi chứa tuổi mụ năm xem.
- (Tùy chọn, phái Trung Quốc) Lưu niên cung Mệnh = cung Lưu Thái Tuế; 12 cung lưu niên xếp lại từ đó. Phái Việt ít dùng; có thể bổ sung sau.

### 7.4. Sao lưu (an theo can chi năm đang xem, ký hiệu "L.")

Dùng đúng công thức sao gốc, thay can chi năm sinh bằng can chi năm xem:

| Sao lưu | Công thức (C', Y' là can, chi năm xem) |
|---|---|
| L. Thái Tuế | `Y'` |
| L. Tang Môn | `Y' + 2` |
| L. Bạch Hổ | `Y' + 8` |
| L. Thiên Khốc | `Ngọ − Y'` |
| L. Thiên Hư | `Ngọ + Y'` |
| L. Lộc Tồn | bảng Lộc Tồn theo `C'` |
| L. Kình Dương | `L.LT + 1` |
| L. Đà La | `L.LT − 1` |
| L. Thiên Mã | bảng Thiên Mã theo `Y'` |
| L. Thiên Khôi, L. Thiên Việt | bảng Khôi Việt theo `C'` |
| L. Văn Xương | `L.LT + 3` |
| L. Văn Khúc | theo `C'`: Giáp Dậu, Ất Thân, Bính Ngọ, Đinh Tỵ, Mậu Ngọ, Kỷ Tỵ, Canh Mão, Tân Dần, Nhâm Tý, Quý Hợi |
| L. Hồng Loan, L. Thiên Hỷ | `Mão − Y'`, `Dậu − Y'` |
| Lưu tứ hóa (4 sao) | mục 7.3 |

Phái Việt phổ biến nhất chỉ hiện 9 sao đầu (Thái Tuế, Tang Môn, Bạch Hổ, Khốc, Hư, Lộc Tồn, Kình, Đà, Mã) và lưu tứ hóa; các sao lưu còn lại để tùy chọn. Đối chiếu iztro (test `getHoroscopeStar("癸","卯","yearly")` và `("庚","辰","decadal")`): khớp toàn bộ sao chung (L. Lộc Tồn, Kình, Đà, Mã, Khôi, Việt, Xương, Khúc, Hồng Loan, Thiên Hỷ). Test nằm trong mục `testLuuNien` của file JSON.

Repo: **thiếu**. `anLaSo` không trả sao lưu nào; `thayba-raw.js` chỉ mô tả bằng chữ Lưu Thái Tuế, tiểu hạn, đại vận, lưu tứ hóa và lưu nguyệt (để đưa vào prompt AI), không có L. Lộc Tồn, L. Kình, L. Đà, L. Mã, L. Tang Môn, L. Bạch Hổ, L. Khốc, L. Hư. Cần bổ sung hàm `anLuuNien(laSo, namAm)` trả vị trí các sao lưu để vẽ lên lá số.

### 7.5. Lưu nguyệt

Phái Việt dùng **Đẩu Quân** theo năm xem: từ cung Lưu Thái Tuế (chi năm xem) coi là tháng Giêng, đếm **nghịch** đến tháng sinh, rồi từ đó coi là giờ Tý đếm **thuận** đến giờ sinh. Cung đó là tháng Giêng của năm xem; các tháng sau đi thuận. Công thức: tháng `t` của năm có chi `Y'` ở cung `m12(Y' − (M − 1) + H + (t − 1))`. Repo (`thayba-raw.js`): đúng.

### 7.6. Lưu nhật, lưu thời

Ít dùng trong luận giải trả phí. Không làm trong MVP.

---

## 8. Mệnh chủ, Thân chủ, cân lượng

### 8.1. Bảng

| Chi | Mệnh chủ | Thân chủ |
|---|---|---|
| Tý | Tham Lang | Linh Tinh |
| Sửu | Cự Môn | Thiên Tướng |
| Dần | Lộc Tồn | Thiên Lương |
| Mão | Văn Khúc | Thiên Đồng |
| Thìn | Liêm Trinh | Văn Xương |
| Tỵ | Vũ Khúc | Thiên Cơ |
| Ngọ | Phá Quân | Hỏa Tinh |
| Mùi | Vũ Khúc | Thiên Tướng |
| Thân | Liêm Trinh | Thiên Lương |
| Dậu | Văn Khúc | Thiên Đồng |
| Tuất | Lộc Tồn | Văn Xương |
| Hợi | Cự Môn | Thiên Cơ |

### 8.2. Tra theo chi nào ⚠

- **Thân chủ**: tra theo **chi năm sinh** (mọi nguồn thống nhất). Repo: đúng.
- **Mệnh chủ**: hai cách.
  - Theo **chi năm sinh** (cách phổ biến trên các lá số in sẵn và nhiều trang lập lá số Việt; website xemtuvi.vn cũ cũng làm vậy).
  - Theo **chi cung Mệnh** (Tử Vi Đẩu Số Toàn Thư bản Trung Quốc, iztro; engine repo hiện làm vậy).
- **Mặc định khuyến nghị: Mệnh chủ theo chi năm sinh**, hiển thị thêm dòng phụ "theo cung Mệnh" khi hai cách khác nhau. Lý do: sản phẩm định vị phái Việt; khách so với các site Việt khác sẽ thấy khớp. File test có cả hai giá trị (`menhChu.theoChiNamSinh`, `menhChu.theoChiCungMenh`). Cần chuyên gia xác nhận.
- Thân chủ cho năm Tý: một số sách Trung Quốc ghi Hỏa Tinh cho cả Tý và Ngọ. Giữ Linh Tinh cho Tý theo sách Việt.

### 8.3. Cân lượng (cân xương tính số)

Cân lượng (tổng "lượng, chỉ" theo năm, tháng, ngày, giờ sinh) thuộc phép **cân xương đoán số** gán cho Viên Thiên Cang, không phải phần của Tử Vi Đẩu Số. Trên lá số Việt in sẵn đôi khi có ô này. Khuyến nghị: **không làm trong MVP**. Nếu làm sau, cần lấy đủ 4 bảng (60 năm, 12 tháng, 30 ngày, 12 giờ) từ một bản in có nguồn rõ và cho chuyên gia đối chiếu; agent này chưa xác minh được đủ bảng từ nguồn độc lập nên không đưa số liệu vào đây.

---

## 9. Đầu ra engine (gợi ý cấu trúc)

Giữ cấu trúc hiện có của `anLaSo` (repo) để không vỡ phần luận giải, bổ sung:

- `quyUoc`: các lựa chọn đã dùng (giờ Tý muộn, tháng nhuận, múi giờ lịch, bảng Khôi Việt, Mệnh chủ…), để hiển thị "Lá số lập theo…" và lưu cùng lá số. Đây cũng là điểm khác biệt "minh bạch học thuật" của sản phẩm.
- `gioChuan`: giờ sau khi chuẩn hóa UTC+7 (mục 1.2).
- `luuNien(namAm)`: hàm riêng trả sao lưu (mục 7.4) và tiểu hạn, đại vận, lưu nguyệt.
- `tuan`, `triet`: mảng 2 chỉ số cung.
- `menhChu`: `{ theoNam, theoCungMenh }`.

---

## 10. Các điểm bất đồng và lựa chọn mặc định

| # | Vấn đề | Các cách | Mặc định đề xuất | Lý do | Repo hiện tại |
|---|---|---|---|---|---|
| 10.1 | Giờ Tý muộn 23:00–23:59 | (a) sang ngày sau; (b) giữ ngày; (c) cộng ngày âm, giữ tháng (iztro) | (a) | Ngày can chi đổi ở đầu giờ Tý; đa số sách và iztro coi Tý muộn thuộc ngày sau; (c) sai khi sinh cuối tháng | (b), cần sửa |
| 10.2 | Múi giờ tính âm lịch trước 1968 | UTC+8 hoặc UTC+7 | UTC+8 trước 01/01/1968 | Lịch Việt Nam chỉ chính thức theo UTC+7 từ 1968; người sinh trước đó đã sống với lịch UTC+8 (ví dụ Tết Mậu Thân miền Nam) | UTC+7 mọi năm, cần sửa |
| 10.3 | Giờ đồng hồ miền Nam 1960–1975 (UTC+8) | đổi về UTC+7 hoặc không | đổi theo IANA tz | Giờ khai sinh ghi theo đồng hồ UTC+8 | không xử lý, cần bổ sung |
| 10.4 | Tứ hóa can Canh, Nhâm | Việt: Canh "Nhật Vũ Đồng Âm", Nhâm Khoa Thiên Phủ. Trung Quốc: Canh "Nhật Vũ Âm Đồng", Nhâm Khoa Tả Phù | Bảng Việt (5.8) | Thống nhất trong sách Việt (Thái Thứ Lang, Thiên Lương), khớp repo | đúng |
| 10.5 | Hỏa/Linh: chiều đếm | Việt: theo âm dương nam nữ, Hỏa Linh ngược chiều nhau. Trung Quốc: cả hai thuận | Việt | Sách Việt thống nhất | đúng |
| 10.6 | Hỏa/Linh: khởi nhóm Tỵ Dậu Sửu | Hỏa Mão, Linh Tuất (câu phú, iztro) hoặc Hỏa Tuất, Linh Mão (repo) | Hỏa Mão, Linh Tuất | Khớp câu phú khởi Hỏa Linh và iztro; repo nhiều khả năng đảo nhầm | **sai**, cần sửa |
| 10.7 | Thiên Giải | (a) `Thân + 2(M−1)` (ansaotuvi/Thiên Lương); (b) theo cặp tháng: tháng 1–2 Thân, 3–4 Tuất, 5–6 Tý, 7–8 Dần, 9–10 Thìn, 11–12 Ngọ (sao Giải Thần theo tháng của Trung Quốc, iztro gọi là "nguyệt giải"); (c) `Thân + (M−1)` (một số trang Việt) | (a), tạm thời | Không tìm được nguồn sách Việt độc lập để kiểm chứng; giữ cách của repo để không đổi kết quả cũ | (a) |
| 10.8 | Thiên Khôi, Thiên Việt | (A) Giáp Mậu Canh: Sửu/Mùi; Ất Kỷ: Tý/Thân; Bính Đinh: Hợi/Dậu; Tân: Ngọ/Dần; Nhâm Quý: Mão/Tỵ (Toàn Thư, iztro). (B) một số sách Việt: "Canh Tân phùng Mã Hổ" (Canh Ngọ/Dần). (C) repo (engine cũ): Đinh Dậu/Hợi, Mậu và Canh Mùi/Sửu, Nhâm Tỵ/Mão (đảo Khôi và Việt ở 4 can) | (A) | Khớp câu phú cổ "Giáp Mậu Canh ngưu dương…", khớp iztro (cả bộ test sao lưu với can Canh) | khác ở Đinh, Mậu, Canh, Nhâm (khoảng 40% lá số: 1.199/3.000, mục 11) |
| 10.9 | Phá Toái | Tý Ngọ Mão Dậu Tỵ, Dần Thân Tỵ Hợi Dậu, Thìn Tuất Sửu Mùi Sửu (iztro, sách Trung Quốc) hoặc repo (đổi Tỵ và Dậu) | bảng iztro | Có nguồn mã nguồn mở và sách Trung Quốc thống nhất; chưa thấy sách Việt nào ghi như repo | khác, chờ chuyên gia |
| 10.10 | Lưu Hà | Đinh Thân, Canh Thìn (sách Trung Quốc) hoặc Đinh Thìn, Canh Thân (repo) | Đinh Thân, Canh Thìn | Câu phú Lưu Hà phổ biến trong sách Trung Quốc "Giáp kê, Ất khuyển, Bính dương, Đinh hầu, Mậu xà, Kỷ mã, Canh long, Tân thố, Nhâm trư, Quý hổ" | khác, chờ chuyên gia |
| 10.11 | Thiên Trù | Quý ở Tuất (repo) hoặc Hợi (iztro) | Tuất | Không có nguồn thứ ba; giữ repo | đúng theo mặc định |
| 10.12 | Thiên Thương, Thiên Sứ | Việt và iztro mặc định: Thương ở Nô Bộc, Sứ ở Tật Ách. Phái Trung Châu (Vương Đình Chi): Âm Nam/Dương Nữ đổi chỗ | Thương Nô, Sứ Tật | Thống nhất trong sách Việt | đúng |
| 10.13 | Tháng nhuận | như tháng chính; chia đôi ở ngày 15; tính tháng sau | như tháng chính | Sách cụ Thiên Lương và đa số site Việt | đúng |
| 10.14 | Mệnh chủ | theo chi năm sinh hoặc chi cung Mệnh | chi năm sinh, hiện thêm cách kia | Phái Việt; site cũ xemtuvi.vn đã dùng | theo cung Mệnh |
| 10.15 | Tuần, Triệt chiếm một hay hai cung | Việt: hai cung (vẽ ở vạch giữa). Trung Quốc: chọn một cung | hai cung | Phái Việt | đúng |
| 10.16 | Độ sáng | bảng Việt (repo) hoặc bảng Trung Quốc 7 bậc | bảng Việt | Phái Việt | đúng |
| 10.17 | Ranh giới năm | Tết hoặc Lập Xuân | Tết | Quy ước Tử Vi cả hai phái | đúng |
| 10.18 | Giờ mặt trời thực | có hoặc không hiệu chỉnh | không, có tùy chọn nâng cao | Đa số thầy Việt dùng giờ đồng hồ | không |

---

## 11. Kết quả đối chiếu engine repo

Phương pháp: chạy `tuvi-raw.js` (repo) và engine tham chiếu (`tuvi-ref-engine.py`) trên 3.000 bộ ngày giờ sinh ngẫu nhiên (1930–2024, giờ 0–22, nam và nữ), so từng sao, Mệnh, Thân, cục, Tuần, Triệt, Tràng Sinh, đại vận, tiểu hạn, Mệnh chủ, Thân chủ. Engine tham chiếu chạy với cùng quy ước của repo ở các điểm repo đúng, để tách riêng từng nguyên nhân lệch.

| Hạng mục | Số lá số lệch / 3.000 | Nguyên nhân |
|---|---|---|
| 14 chính tinh, Mệnh, Thân, cục, tứ hóa, sao theo ngày | 3–46 | Toàn bộ do múi giờ lịch trước 1968 (10.2); ngoài ra khớp 100% |
| Hỏa Tinh, Linh Tinh | 711 | 10.6 (nhóm Tỵ Dậu Sửu) |
| Thiên Khôi, Thiên Việt | 1.199 | 10.8 (repo đảo Khôi và Việt ở 4 can Đinh, Mậu, Canh, Nhâm, tức khoảng 4/10 lá số) |
| Phá Toái | 1.985 | 10.9 |
| Lưu Hà | 612 | 10.10 |
| Thiên Nguyệt, Thiên Vu, Âm Sát | 3.000 | repo không an (tùy chọn) |
| Mọi sao còn lại (khoảng 75 sao), Tuần, Triệt, Tràng Sinh, đại vận, tiểu hạn, Thân chủ | 0 (ngoài lệch do múi giờ trước 1968) | khớp |

Ngoài bảng trên, repo còn:

- Không đổi ngày cho giờ Tý muộn (10.1). Bộ thử ngẫu nhiên không có giờ 23 nên lỗi này không nằm trong bảng; TC06 thể hiện nó (lệch 30 trường, gồm toàn bộ chính tinh).
- Không chuẩn hóa giờ đồng hồ miền Nam 1960–1975 (10.3).
- Không có sao lưu trong `anLaSo` (7.4).
- Mệnh chủ theo cung Mệnh (10.14).
- Hàm `thangNhuan` sai với tháng 11 nhuận năm 2033 (1.6).

Đánh giá chung: lõi thuật toán của repo (lịch, Mệnh Thân, cục, 14 chính tinh, khoảng 80 phụ tinh, vận hạn) đúng và ổn định. Cần sửa 4 bảng sao (Hỏa Linh, Khôi Việt, Phá Toái, Lưu Hà) sau khi chuyên gia chốt, và 3 quy ước đầu vào (giờ Tý muộn, múi giờ lịch trước 1968, giờ đồng hồ miền Nam). Không sửa file trong repo ở bước này.

---

## 12. Bộ lá số kiểm thử

Dữ liệu đầy đủ (vị trí 100 sao, Tràng Sinh, đại vận, tiểu hạn, Tuần Triệt, Mệnh chủ, Thân chủ, các biến thể quy ước, danh sách trường repo đang lệch) nằm trong `~/xemtuvi.vn/docs/nghien-cuu/tuvi-test-cases.json`. Bảng dưới tóm tắt Mệnh, Thân, cục và 14 chính tinh. Ngày giờ là giờ chuẩn UTC+7.

| ID | Sinh (dương lịch) | Âm lịch | Mệnh | Thân | Cục | 14 chính tinh |
|---|---|---|---|---|---|---|
| TC01 | 30/12/1973 22:30, nữ | 7/12 Quý Sửu, giờ Hợi | Dần | Tý (Phu Thê) | Thủy Nhị Cục | Tý: Vũ Khúc, Thiên Phủ; Sửu: Thái Dương, Thái Âm; Dần: Tham Lang; Mão: Thiên Cơ, Cự Môn; Thìn: Tử Vi, Thiên Tướng; Tỵ: Thiên Lương; Ngọ: Thất Sát; Thân: Liêm Trinh; Tuất: Phá Quân; Hợi: Thiên Đồng |
| TC02 | 6/3/2023 08:00, nam | 15/2 Quý Mão, giờ Thìn | Hợi | Mùi (Tài Bạch) | Thủy Nhị Cục | Tý: Liêm Trinh, Thiên Tướng; Sửu: Thiên Lương; Dần: Thất Sát; Mão: Thiên Đồng; Thìn: Vũ Khúc; Tỵ: Thái Dương; Ngọ: Phá Quân; Mùi: Thiên Cơ; Thân: Tử Vi, Thiên Phủ; Dậu: Thái Âm; Tuất: Tham Lang; Hợi: Cự Môn |
| TC03 | 20/12/1995 18:00, nam | 29/10 Ất Hợi, giờ Dậu | Dần | Thân (Thiên Di) | Thổ Ngũ Cục | Tý: Tham Lang; Sửu: Thiên Đồng, Cự Môn; Dần: Vũ Khúc, Thiên Tướng; Mão: Thái Dương, Thiên Lương; Thìn: Thất Sát; Tỵ: Thiên Cơ; Ngọ: Tử Vi; Thân: Phá Quân; Tuất: Liêm Trinh, Thiên Phủ; Hợi: Thái Âm |
| TC04 | 10/6/2020 10:00, nữ | 19/4 (nhuận) Canh Tý, giờ Tỵ | Tý | Tuất (Phu Thê) | Hỏa Lục Cục | Tý: Tử Vi; Dần: Phá Quân; Thìn: Liêm Trinh, Thiên Phủ; Tỵ: Thái Âm; Ngọ: Tham Lang; Mùi: Thiên Đồng, Cự Môn; Thân: Vũ Khúc, Thiên Tướng; Dậu: Thái Dương, Thiên Lương; Tuất: Thất Sát; Hợi: Thiên Cơ |
| TC05 | 15/2/1985 09:00, nam | 26/1 Ất Sửu, giờ Tỵ | Dậu | Mùi (Phu Thê) | Thủy Nhị Cục | Tý: Phá Quân; Sửu: Thiên Cơ; Dần: Tử Vi, Thiên Phủ; Mão: Thái Âm; Thìn: Tham Lang; Tỵ: Cự Môn; Ngọ: Liêm Trinh, Thiên Tướng; Mùi: Thiên Lương; Thân: Thất Sát; Dậu: Thiên Đồng; Tuất: Vũ Khúc; Hợi: Thái Dương |
| TC06 | 1/8/2023 23:30, nam | 16/6 Quý Mão, giờ Tý | Mùi | Mùi (Mệnh) | Hỏa Lục Cục | Tý: Tham Lang; Sửu: Thiên Đồng, Cự Môn; Dần: Vũ Khúc, Thiên Tướng; Mão: Thái Dương, Thiên Lương; Thìn: Thất Sát; Tỵ: Thiên Cơ; Ngọ: Tử Vi; Thân: Phá Quân; Tuất: Liêm Trinh, Thiên Phủ; Hợi: Thái Âm |
| TC07 | 1/2/1965 12:00, nữ | 30/12 Giáp Thìn, giờ Ngọ | Mùi | Mùi (Mệnh) | Thổ Ngũ Cục | Tý: Cự Môn; Sửu: Thiên Tướng; Dần: Thiên Đồng, Thiên Lương; Mão: Vũ Khúc, Thất Sát; Thìn: Thái Dương; Ngọ: Thiên Cơ; Mùi: Tử Vi, Phá Quân; Dậu: Thiên Phủ; Tuất: Thái Âm; Hợi: Liêm Trinh, Tham Lang |
| TC08 | 15/8/1990 07:30, nam | 25/6 Canh Ngọ, giờ Thìn | Mão | Hợi (Tài Bạch) | Thổ Ngũ Cục | Tý: Tham Lang; Sửu: Thiên Đồng, Cự Môn; Dần: Vũ Khúc, Thiên Tướng; Mão: Thái Dương, Thiên Lương; Thìn: Thất Sát; Tỵ: Thiên Cơ; Ngọ: Tử Vi; Thân: Phá Quân; Tuất: Liêm Trinh, Thiên Phủ; Hợi: Thái Âm |
| TC09 | 2/9/1987 15:00, nữ | 10/7 (nhuận) Đinh Mão, giờ Thân | Tý | Thìn (Quan Lộc) | Mộc Tam Cục | Tý: Cự Môn; Sửu: Thiên Tướng; Dần: Thiên Đồng, Thiên Lương; Mão: Vũ Khúc, Thất Sát; Thìn: Thái Dương; Ngọ: Thiên Cơ; Mùi: Tử Vi, Phá Quân; Dậu: Thiên Phủ; Tuất: Thái Âm; Hợi: Liêm Trinh, Tham Lang |
| TC10 | 10/4/1988 04:00, nam | 24/2 Mậu Thìn, giờ Dần | Sửu | Tỵ (Quan Lộc) | Kim Tứ Cục | Tý: Cự Môn; Sửu: Thiên Tướng; Dần: Thiên Đồng, Thiên Lương; Mão: Vũ Khúc, Thất Sát; Thìn: Thái Dương; Ngọ: Thiên Cơ; Mùi: Tử Vi, Phá Quân; Dậu: Thiên Phủ; Tuất: Thái Âm; Hợi: Liêm Trinh, Tham Lang |
| TC11 | 25/11/1981 21:00, nữ | 29/10 Tân Dậu, giờ Hợi | Tý | Tuất (Phu Thê) | Thổ Ngũ Cục | Tý: Tham Lang; Sửu: Thiên Đồng, Cự Môn; Dần: Vũ Khúc, Thiên Tướng; Mão: Thái Dương, Thiên Lương; Thìn: Thất Sát; Tỵ: Thiên Cơ; Ngọ: Tử Vi; Thân: Phá Quân; Tuất: Liêm Trinh, Thiên Phủ; Hợi: Thái Âm |

Nguồn đối chiếu của từng ca:

- **TC01** (nữ, 30/12/1973 22:30): đối chiếu với bài chấm lá số mẫu "Nữ mệnh Quý Sửu 30-12-1973" của Lê Bảo Huy (sites.google.com/view/le-bao-huy). Nguồn ghi âm lịch 7/12 Quý Sửu; tháng Ất Sửu, ngày Canh Tý, giờ Đinh Hợi; bản mệnh Tang Đố Mộc; Thủy nhị cục; âm dương nghịch lý; Thất Sát đơn thủ ở Ngọ (Quan Lộc), Liêm Trinh đơn thủ ở Thân (Thiên Di), Nô Bộc vô chính diệu ở Mùi. Cả ba nguồn (bài mẫu, repo, engine tham chiếu) khớp. Bài mẫu ghi "Thiên Lương đơn thủ ở Mùi" trong mục Điền Trạch, mâu thuẫn với chính câu "Nô Bộc vô chính diệu ở Mùi" trên cùng trang; với Mệnh Dần thì Điền Trạch là Tỵ, nên coi chữ "Mùi" là lỗi chép.
- **TC02** (06/03/2023 giờ Thìn): bộ test chính thức của iztro (`getMajorStar('2023-03-06', 4)`) cho đủ vị trí 14 chính tinh và tứ hóa năm Quý. Khớp hoàn toàn với repo và engine tham chiếu.
- **TC03** (nam, 20/12/1995 18h): ca ví dụ dùng trong tài liệu nội bộ của repo. Repo và engine tham chiếu khớp toàn bộ, trừ 5 sao ở mục 10.
- **TC04** (nữ, 10/06/2020 10h, tháng 4 nhuận): kiểm thử tháng nhuận, có 3 biến thể.
- **TC05** (nam, 15/02/1985 9h): kiểm thử lịch Việt khác lịch Trung Quốc (Tết 1985). Nguồn: VnExpress, RFA về lệch lịch năm 1984–1985. Engine dùng lịch Trung Quốc sẽ ra năm Giáp Tý, sai toàn bộ.
- **TC06** (nam, 01/08/2023 23:30): kiểm thử giờ Tý muộn. Nguồn: bộ test iztro `getStartIndex('2023-08-01', 12)` (Tý muộn) cho Tử Vi ở Ngọ, `timeIndex 0` (Tý sớm) cho Tử Vi ở Sửu. Engine tham chiếu ra Ngọ; repo ra Sửu (đang tính như Tý sớm).
- **TC07** (nữ, 01/02/1965 12h): kiểm thử múi giờ lịch trước 1968.
- **TC08–TC11**: các ca phủ đủ nhóm tam hợp năm sinh (Ngọ, Mão, Thìn, Dậu), các can có bất đồng (Canh, Đinh, Mậu, Tân) và đủ 5 cục.

Ngoài 11 lá số, file JSON có:

- `testLich`: 10 mốc lịch đã kiểm chứng (Tết 1968, 1985, 2007, 2030; sóc 25/6/2006; tháng nhuận các năm 1984, 1985, 2020, 2023, 2025).
- `testIztroTuViTheoGio`: vị trí Tử Vi ngày 01/08/2023 cho đủ 13 mốc giờ, lấy từ bộ test của iztro. Repo và engine tham chiếu khớp cả 12 giờ thường; giờ Tý muộn khớp với engine tham chiếu.
- `testLuuNien`: sao lưu năm Quý Mão và bộ sao theo can chi Canh Thìn, lấy từ bộ test của iztro.

Cách dùng: với mỗi ca, gọi engine với `input` và `quyUoc`, so từng trường của `kyVong`. Trường `repoXemboi.lech` là danh sách lệch đã biết của engine hiện tại; khi sửa engine, danh sách này phải về rỗng (trừ các sao tùy chọn).

Giới hạn nguồn: không chạy được iztro trực tiếp vì môi trường chặn npm registry, GitHub và jsDelivr; dữ liệu iztro lấy từ mã nguồn và bộ test công khai đọc qua Code Climate. Chỉ TC01, TC02, TC05 (phần lịch) và TC06 có nguồn ngoài độc lập; các ca còn lại đối chiếu giữa hai engine độc lập (repo và engine tham chiếu) và đều khớp ở mọi điểm không thuộc mục 10.

---

## 13. Độ tin cậy và điểm cần chuyên gia xác nhận

### 13.1. Độ tin cậy cao (đã kiểm bằng hai engine độc lập và ít nhất một nguồn ngoài)

- Đổi lịch âm Việt Nam UTC+7, tháng nhuận, các năm lệch với lịch Trung Quốc.
- Can chi năm, tháng, ngày, giờ; Mệnh, Thân, cục, nạp âm.
- 14 chính tinh (khớp bộ test iztro và bài mẫu TC01).
- Vòng Lộc Tồn, Bác Sĩ, Thái Tuế, Tràng Sinh; Kình Đà; Tả Hữu; Xương Khúc; Không Kiếp; Thiên Mã, Đào Hoa, Hồng Loan, Thiên Hỷ, Hoa Cái, Kiếp Sát, Cô Quả, Khốc Hư, Long Phượng, Tam Thai, Bát Tọa, Ân Quang, Thiên Quý, Thai Phụ, Phong Cáo, Thiên Quan, Thiên Phúc, Thiên Hình, Thiên Riêu, Thiên Đức, Nguyệt Đức, Thiên Tài, Thiên Thọ, Tuần, Triệt (khớp cả repo lẫn iztro).
- Đại vận, tiểu hạn, sao lưu chính.

### 13.2. Độ tin cậy trung bình (có mặc định, nên duyệt)

1. Hỏa Tinh, Linh Tinh nhóm Tỵ Dậu Sửu (10.6): đề xuất sửa repo.
2. Thiên Khôi, Thiên Việt can Đinh, Mậu, Canh, Nhâm, và biến thể "Canh Tân phùng Mã Hổ" (10.8).
3. Phá Toái (10.9), Lưu Hà (10.10).
4. Giờ Tý muộn (10.1).
5. Múi giờ lịch trước 1968 và lịch miền Nam 1968–1975 (10.2, 10.3).
6. Mệnh chủ theo chi năm hay chi cung Mệnh (10.14).

### 13.3. Độ tin cậy thấp (chỉ có một nguồn, cần sách gốc)

1. Thiên Giải (10.7): ba cách, chưa có sách Việt để kiểm.
2. Thiên Trù can Quý (10.11).
3. Độ sáng: Tử Vi ở Tý/Ngọ, độ sáng Hóa Lộc/Quyền/Kỵ (mục 6).
4. Cân lượng (8.3): chưa đưa số liệu.
5. Các sao Văn Tinh, Đường Phù, Quốc Ấn (riêng sách Việt): công thức khớp giữa repo và nhiều trang Việt, nhưng chưa đối chiếu trực tiếp với bản in Thái Thứ Lang.

### 13.4. Việc cần chuyên gia làm

- Lấy bản in *Tử Vi Đẩu Số Tân Biên* (Vân Đằng Thái Thứ Lang) và *Tử Vi Chỉ Nam* (Song An Đỗ Văn Lưu): đối chiếu bảng 5.7, 5.9, 5.10, mục 6 và 8.2; chốt từng dòng ⚠ ở mục 10.
- Cho 3–5 lá số thật mà thầy đã lập tay (có ngày giờ, giới tính) để bổ sung vào `tuvi-test-cases.json`, ưu tiên người sinh năm Tỵ, Dậu, Sửu, can Đinh, Mậu, Canh, Nhâm, sinh giờ 23h, sinh trước 1968.
- Duyệt văn bản "Lá số lập theo…" hiển thị cho khách (mục 9).

### 13.5. Hạn chế của lần nghiên cứu này

- Môi trường không cho cài iztro (npm registry, GitHub, jsDelivr bị chặn). Dữ liệu iztro lấy từ mã nguồn và bộ test công khai đọc qua Code Climate, không chạy trực tiếp.
- Không truy cập được bản số hóa các sách kinh điển; các câu phú dẫn trong tài liệu là câu phú phổ biến, cần đối chiếu bản in.
- Kết quả "khớp" giữa repo và engine tham chiếu chứng minh hai bản cài đặt nhất quán với đặc tả, chưa chứng minh đặc tả đúng ở các điểm thuộc 13.2 và 13.3.

### 13.6. Nguồn đã dùng

- Engine repo xemboi.vn: `src/lib/core/tuvi-raw.js`, `lich-raw.js`, `thayba-raw.js` (port từ TuViMCP/ansaotuvi, Apache-2.0, theo sách cụ Thiên Lương).
- iztro (SylarLong, MIT): `src/star/location.ts`, `majorStar.ts`, `minorStar.ts`, `decorativeStar.ts`, `src/astro/palace.ts`, `src/__tests__/star/star.test.ts`; README trên jsDelivr. Đọc qua codeclimate.com.
- ansaotuvi (PyPI, fork của lasotuvi, MIT): thông tin dòng mã.
- LamjinLab, chuyên mục Metaphysics: dẫn tới kho ziweiknows/ziwei-chart (dựa trên iztro).
- Lê Bảo Huy, "Xem lá số tử vi mẫu nữ mệnh Quý Sửu 30-12-1973" (sites.google.com/view/le-bao-huy).
- VnExpress, "Lịch sai do dịch sách Trung Quốc"; RFA tiếng Việt, "Vì sao lại có sự khác biệt trong âm lịch của Việt Nam và Trung Quốc?" (07/02/2007).
- Hồ Ngọc Đức, thuật toán âm lịch Việt Nam (theo Jean Meeus, *Astronomical Algorithms*); doxuta/amlich (Go) cùng thuật toán.
- Sách kinh điển được nêu làm khung đối chiếu: *Tử Vi Đẩu Số Toàn Thư*, *Tử Vi Khảo Luận* (Hoàng Thường), *Tử Vi Đẩu Số Tân Biên* (Vân Đằng Thái Thứ Lang), *Tử Vi Chỉ Nam* (Song An Đỗ Văn Lưu). Chưa đối chiếu được bản in trong lần này (xem 13.5).

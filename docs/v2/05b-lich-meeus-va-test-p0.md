# Báo cáo 05b — Viết lại Âm Lịch (Meeus) & Bổ sung Test P0

> Ngày lập: **20/11/2026** · Tiếp nối: [`docs/v2/05a-ban-giao-engine.md`](05a-ban-giao-engine.md) · Không sửa `docs/v2/tai-san-xemtuvi/`, `src/lib/core/`, kỳ vọng mẫu; không commit git.

---

## 1. Viết lại sạch `src/lib/tuvi-v2/am-lich.ts` và bỏ phụ thuộc mã Hồ Ngọc Đức

- Tạo mới [`src/lib/tuvi-v2/am-lich.ts`](../../src/lib/tuvi-v2/am-lich.ts) **viết độc lập, không đọc hay chép từ `lich-raw.js`, `lich.mjs` hay bất kỳ bản mã Hồ Ngọc Đức nào**.
- Thuật toán thiên văn công khai sử dụng:
  - **Ngày Julius (JDN):** Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998), Chương 7 (tr. 59–63).
  - **Thời điểm trăng mới (Sóc):** Jean Meeus (1998), Chương 49 (mốc J2000, công thức 49.1, 25 số hạng tuần hoàn tr. 351 và 14 số hạng hành tinh $A_1\text{–}A_{14}$). Khớp ví dụ 49.a (`k = -283`): `2443192.65118` (đúng tới chữ số thập phân thứ 5).
  - **Kinh độ Mặt Trời:** tái sử dụng `kinhDoTaiJde` (VSOP87D + FK5 + quang sai + đốt sai Meeus 22.2) từ [`src/lib/tuvi-v2/tiet-khi.mjs`](../../src/lib/tuvi-v2/tiet-khi.mjs) (giấy phép MIT).
  - **Hiệu chỉnh $\Delta T = \text{TT} - \text{UT}$:** đa thức phân đoạn của Fred Espenak & Jean Meeus (NASA TP-2006-214141).
  - **Quy tắc lịch Việt:** tháng 11 chứa ngày Đông chí ($270^\circ$); chu kỳ 13 kỳ sóc thì tháng đầu tiên sau tháng 11 không chứa trung khí là tháng nhuận; múi giờ lịch sử **UTC+8 trước 01/01/1968**, **UTC+7 từ 01/01/1968**.
- **Sửa lỗi `thangNhuan(2033)`:** bản mới quét cả hai chu kỳ Đông chí liền kề (`namAm - 1` và `namAm`), trả đúng **`11`** (tháng 11 nhuận năm 2033); bản cũ `lich-raw.js` trả `0`.
- **Chuyển mã chạy thật:** [`src/lib/tuvi-v2/tuvi-raw.js`](../../src/lib/tuvi-v2/tuvi-raw.js) và [`src/lib/tuvi-v2/index.ts`](../../src/lib/tuvi-v2/index.ts) đã chuyển hoàn toàn sang `am-lich.ts`. **Không còn dòng `import` hay `require` nào tới `lich-raw.js` hay `lich.mjs` trong mã chạy thật** (`src/lib/tuvi-v2/`). `lich-raw.js` chỉ còn xuất hiện làm đáp án đối chiếu trong [`tests/tuvi-v2/am-lich.test.mjs`](../../tests/tuvi-v2/am-lich.test.mjs).

---

## 2. Kiểm tương đương trên toàn bộ giai đoạn 1900–2100 (73.414 ngày)

Đối chiếu từng ngày từ `01/01/1900` đến `31/12/2100` (đầu ra `am-lich.ts` vs `lich-raw.js`, kèm round-trip 73.414/73.414 ngày đều khớp 100%):

| Phạm vi / chế độ kiểm tra | Tổng mẫu | Số lệch | Tỷ lệ lệch | Ghi chú xác minh |
|---|---:|---:|---:|---|
| `tet-wikipedia-1984-2091.json` (UTC+7) | 108 năm | **0** | 0,00% | Khớp đủ 108/108 năm cả 2 chiều |
| `lich-moc-chuan.json` (1900–2099, UTC+7) | 200 mốc | **0** | 0,00% | Khớp đủ 200/200 mốc & round-trip |
| So `lich-raw.js` **chế độ lịch sử** (UTC+8 `<1968`, UTC+7 `≥1968`) | 73.414 ngày | **64 ngày** | 0,087% | **0 ngày lệch trong 106 năm 1948–2053** |
| So `lich-raw.js` **UTC+7 cố định** mọi năm | 73.414 ngày | **122 ngày** | 0,166% | 2 ngày lỗi `ngay: 0` cũ + 4 kỳ Sóc sát 00:00 |
| So `lich-raw.js` **UTC+8 cố định** mọi năm | 73.414 ngày | **35 ngày** | 0,048% | 5 ngày lỗi `ngay: 0` cũ + 1 kỳ Sóc năm 2097 |

### Phân tích từng ca lệch giữa `am-lich.ts` và `lich-raw.js`

1. **Lỗi `ngay: 0` trong `lich-raw.js` (bản mới ĐÚNG, bản cũ SAI):**
   - Ở UTC+7: `07/05/2054` và `09/04/2062` (`lich-raw.js` trả `ngay: 0` — ngày âm không tồn tại; `am-lich.ts` trả đúng ngày `30`).
   - Ở UTC+8: thêm 3 ngày `19/04/1939`, `22/03/1947`, `26/03/2009` (`lich-raw.js` trả `ngay: 0`; `am-lich.ts` trả đúng ngày `30`).
   - Trong chế độ lịch sử: 4 ngày (`19/04/1939`, `22/03/1947`, `07/05/2054`, `09/04/2062`).
2. **Các kỳ Sóc rơi trong khoảng 3–72 giây trước 00:00 địa phương:**
   - `20/06/1944` (UTC+7): `am-lich.ts` tính Sóc lúc `23:59:35 UTC+7` (`16:59:35 UTC`, NASA Fred Espenak ghi `17:00 UTC`). **Không lệch ở chế độ lịch sử** vì năm 1944 dùng UTC+8 (`00:59:35 UTC+8`).
   - `07/07/1967` (UTC+7): `am-lich.ts` tính Sóc lúc `23:59:57 UTC+7` (`16:59:57 UTC`, NASA ghi `17:01 UTC`, lệch 3 giây quanh ranh giới 00:00 do sai số xấp xỉ của Meeus Chương 49). **Không lệch ở chế độ lịch sử** vì năm 1967 dùng UTC+8 (`00:59:57 UTC+8`).
   - `09/12/2072` (`23:58:48 UTC+7`, lệch 30 ngày tháng 11/2072) và `15/11/2077` (`23:59:50 UTC+7`, lệch 30 ngày tháng 10/2077): đều ở tương lai gần 50 năm tới, nơi sai số dự báo $\Delta T$ ($\pm 30\text{–}60\text{s}$) quyết định ngày Sóc; đa thức NASA Espenak–Meeus trong `am-lich.ts` cập nhật hơn đa thức Meeus 1979 của bản cũ.
   - `07/08/2097` (chỉ ở UTC+8): Sóc lúc `23:59:39 UTC+8`. Không ảnh hưởng chế độ lịch sử (dùng UTC+7).

> Kết luận tương đương: Trong chế độ mặc định của sản phẩm (`lichSu`: UTC+8 trước 1968, UTC+7 từ 1968), `am-lich.ts` **khớp 100% (0 ngày lệch) suốt 106 năm 1948–2053**, khớp `108/108` Tết Wikipedia, khớp `200/200` mốc chuẩn, sửa 4 ngày lỗi `ngay: 0` và sửa lỗi `thangNhuan(2033) = 11`.

---

## 3. Kết quả kiểm thử & kiểm tra kiểu (số liệu chạy thật)

Lệnh chạy: `npm run test:tuvi` (Node `v24.22.1`, Python `3.15.2` qua `python -I`) và `npx tsc --noEmit`.

| Tệp kiểm thử (`tests/tuvi-v2/`) | Loại | Tổng | Đạt | Fail | Nguồn kỳ vọng |
|---|---|---:|---:|---:|---|
| [`engine.test.cjs`](../../tests/tuvi-v2/engine.test.cjs) | Độc lập (cũ) | 7 | 7 | 0 | Bất biến + mẫu cũ (đã chuyển gọi `am-lich.ts`) |
| [`lich.test.mjs`](../../tests/tuvi-v2/lich.test.mjs) | Độc lập (cũ) | 7 | 7 | 0 | Bộ test cũ của `lich.mjs` (giữ nguyên) |
| [`mau-53-la-so.test.cjs`](../../tests/tuvi-v2/mau-53-la-so.test.cjs) | Độc lập (cũ) | 54 | 54 | 0 | 53 lá từ `tuvi-ref-engine.py` |
| [`mau-luoc-do.test.mjs`](../../tests/tuvi-v2/mau-luoc-do.test.mjs) | Độc lập (cũ) | 3 | 3 | 0 | Lược đồ JSON mẫu |
| [`nap-am.test.mjs`](../../tests/tuvi-v2/nap-am.test.mjs) | Độc lập (cũ) | 7 | 7 | 0 | Bảng 60 hoa giáp + 5 mốc sách cổ |
| [`research-cases.test.cjs`](../../tests/tuvi-v2/research-cases.test.cjs) | Độc lập (cũ) | 23 | 23 | 0 | 11 lá TC + iztro + đặc tả (đã chuyển `am-lich.ts`) |
| [`tiet-khi.test.cjs`](../../tests/tuvi-v2/tiet-khi.test.cjs) | Độc lập (cũ) | 5 | 5 | 0 | 40 mốc JPL DE421 qua Skyfield |
| [`am-lich.test.mjs`](../../tests/tuvi-v2/am-lich.test.mjs) | **Độc lập (MỚI)** | 8 | 8 | 0 | Meeus 49.a, 108 Tết Wiki, 200 mốc, `2033`, 73.414 ngày |
| [`p0-van-han-va-ranh-gioi.test.cjs`](../../tests/tuvi-v2/p0-van-han-va-ranh-gioi.test.cjs) | **Độc lập (MỚI)** | 10 | 10 | 0 | `python -I tuvi-ref-engine.py` + đặc tả + Wiki + VSOP87D |
| [`p0-do-sang-hoi-quy.test.cjs`](../../tests/tuvi-v2/p0-do-sang-hoi-quy.test.cjs) | **Hồi quy (MỚI)** | 3 | 3 | 0 | Bảng mục 6 đặc tả (chép từ `ansaotuvi`, chưa kiểm sách cổ) |
| **Tổng test độc lập** | | **124** | **124** | **0** | *(106 cũ + 18 mới)* |
| **Tổng test hồi quy** | | **3** | **3** | **0** | *(P0 #1 độ sáng, mang nhãn `hoi-quy`)* |
| **Tổng cộng (`npm run test:tuvi`)** | | **127** | **127** | **0** | Thời gian chạy: ~0,56 giây |

- **`npx tsc --noEmit`:** **0 lỗi** (mã thoát `0`).

---

## 4. Tình trạng kiểm chứng 6 quy tắc P0 (05a mục 5)

| # P0 | Quy tắc | Tệp test | Trạng thái kiểm chứng | Phạm vi đã phủ |
|---:|---|---|---|---|
| **#1** | Độ sáng Miếu/Vượng/Đắc/Bình/Hãm (mục 6) | `p0-do-sang-hoi-quy.test.cjs` | **HỒI QUY** *(chưa kiểm độc lập sách cổ)* | Phủ đủ 14×12 = 168 ô chính tinh + 19 phụ tinh chủ chốt tại mọi cung đạt được (12/12, 8/8 cho Kình/Đà/Đại-Tiểu Hao, 4/4 cho Thiên Mã) + quy ước `tuViTyNgo`, `dacTinhHoa`. |
| **#2** | Sao lưu `L.*` (mục 7.4) | `p0-van-han-va-ranh-gioi.test.cjs` | **ĐỘC LẬP** (`python -I tuvi-ref-engine.py` + công thức 7.4) | Đủ 60 năm Hoa Giáp 1984–2043 (10 can × 12 chi × 15 sao = 900 kiểm tra) + kiểm riêng Đinh Mùi 2027 (9 sao mặc định & 15 sao đầy đủ). |
| **#3** | Lưu tứ hóa theo can năm xem (mục 7.3 & 5.8) | `p0-van-han-va-ranh-gioi.test.cjs` | **ĐỘC LẬP** (`python -I tuvi-ref-engine.py` + bảng 5.8) | Đủ 10/10 Thiên Can năm xem (2024–2033) + Đinh Mùi 2027 (Thái Âm Lộc, Thiên Đồng Quyền, Thiên Cơ Khoa, Cự Môn Kỵ) trên 4 lá khác nhau + chế độ `tuHoa: 'trungQuoc'` cho Canh 2030, Nhâm 2032. |
| **#4** | Đại vận đang đi theo tuổi mụ (mục 7.1 & 7.3) | `p0-van-han-va-ranh-gioi.test.cjs` | **ĐỘC LẬP** (`python -I tuvi-ref-engine.py` + công thức 7.1) | Đủ 5 Cục (Thủy 2 → Hỏa 6) × 2 chiều thuận/nghịch cho tuổi mụ 1–65 (tuổi trước khởi đại vận `null`, biên đầu/cuối khoảng, bước chuyển cung) + năm 2027 cho đủ 11 lá TC01–TC11. |
| **#5** | Lưu nguyệt / Đẩu Quân 2027 (mục 7.5) | `p0-van-han-va-ranh-gioi.test.cjs` | **ĐỘC LẬP** (`python -I tuvi-ref-engine.py` + công thức 7.5) | Đủ 12 tháng sinh × 12 canh giờ = 144 tổ hợp cho cả nam và nữ ở năm Đinh Mùi 2027 + bất biến không phụ thuộc giới tính + trùng Đẩu Quân gốc + 3 quy ước tháng nhuận. |
| **#9** | Ranh giới năm Tết vs Lập Xuân (mục 1.7 & 10.17) | `p0-van-han-va-ranh-gioi.test.cjs` | **ĐỘC LẬP** (`python -I` + Wikipedia + VSOP87D) | 4 ca `[Lập Xuân, Tết)` (`05/02/2008`, `07/02/1994`, `15/02/1996`, `05/02/2027`) giữ năm âm cũ; chuyển năm đúng mùng 1 Tết (`07/02/2008`, `06/02/2027`) & Giao thừa 23:30 (`ngaySau` vs `giuNgay`); ca đối chứng `10/02/1985`. |

> **Phát hiện sai sót nhỏ trong tài liệu tham chiếu (không sửa thư mục bất biến):** `docs/v2/tai-san-xemtuvi/nghien-cuu/mau/dac-ta-chua-phu_L-82ef28.md` (dòng 19) ghi ví dụ `10/02/1985 (Tết 20/02/1985, năm Giáp Tý)`. Thực tế đó là **Tết Trung Quốc**; theo lịch Việt Nam (UTC+7, `tet-wikipedia-1984-2091.json` và đặc tả mục 1.5), Tết Ất Sửu là **`21/01/1985`**, nên `10/02/1985` là `21/01/1985` âm lịch (**Ất Sửu**), không phải Giáp Tý. Bộ test P0 #9 đã ghi nhận rõ ca bẫy này và bổ sung 3 ca biên lịch Việt thật (`07/02/1994`, `15/02/1996`, `05/02/2027`) bên cạnh `05/02/2008`.

---

## 5. Rủi ro còn lại trước khi mở bán Gói 2 (149k)

1. **Rủi ro học thuật — Bảng độ sáng (P0 #1) & các mục 13.2–13.3 chưa có chuyên gia đối chiếu bản in sách cổ:**
   - Test `p0-do-sang-hoi-quy.test.cjs` mới khóa hồi quy theo bảng `ansaotuvi` trong đặc tả mục 6, chưa kiểm độc lập với bản in *Tử Vi Đẩu Số Tân Biên* (Thái Thứ Lang) / *Tử Vi Chỉ Nam* (Đỗ Văn Lưu). Các điểm dễ gây tranh cãi khi khách đối chiếu: Tử Vi tại Tý/Ngọ, độ sáng Hóa Lộc/Quyền/Kỵ, Thiên Giải, Thiên Trù can Quý, Khôi Việt can Canh.
2. **Rủi ro pháp lý khi đóng gói thương mại — Tệp `lich-raw.js` và `lich.mjs` vẫn còn nằm trong `src/lib/tuvi-v2/`:**
   - Dù mã chạy thật đã bỏ hoàn toàn mọi `import`/`require` tới hai tệp này, trước khi đưa lên bản thương mại nên **di chuyển `lich-raw.js` vào thư mục `tests/tuvi-v2/fixtures/` (chỉ dùng cho test so sánh) và gỡ `lich.mjs`** để bảo đảm bản build triển khai không mang theo bất kỳ tệp mã Hồ Ngọc Đức nào.
3. **Rủi ro đóng gói Next.js (T4) — `require('./am-lich.ts')` trong `tuvi-raw.js`:**
   - Chạy tốt trên Node `v24.22.1` và `tsc --noEmit` đạt 0 lỗi, nhưng chưa chạy `npm run build` (Next.js Webpack/SWC) sau khi nối trang/API sang `src/lib/tuvi-v2`. Ở bước T4 cần xác nhận bundler Next.js phân giải `require('./am-lich.ts')` ổn định (hoặc chuyển phần đầu `tuvi-raw.js` sang ES module / truyền `AmLich` từ `index.ts`).
4. **Phủ test nhóm P1 (chưa bắt buộc cho lượt này, nên làm trước Soft Launch T6):**
   - 6 quy tắc P1 trong 05a (#13 ngũ hành sao/hành cung, #14 quan hệ Mệnh–Cục, #10 hai lá nơi sinh miền Nam 1960–1975, #6 3 lớp Tử Vi, #7 5 ngày âm sao theo ngày, #8 3 tổ hợp Tiểu hạn).

---

## 6. Dọn engine

### 6.1. Các thay đổi đã thực hiện

1. **Dời toàn bộ mã lịch cũ (Hồ Ngọc Đức) ra khỏi `src/`:**
   - Chuyển `lich-raw.js`, `lich-raw.d.ts` và `lich.mjs` từ `src/lib/tuvi-v2/` sang `tests/tuvi-v2/doi-chieu/`.
   - Thêm dòng cảnh báo ở đầu cả 3 tệp: `Mã Hồ Ngọc Đức, chỉ dùng làm đáp án so sánh trong test, cấm import vào src/.`
   - Cập nhật import trong [`tests/tuvi-v2/am-lich.test.mjs`](../../tests/tuvi-v2/am-lich.test.mjs) và [`tests/tuvi-v2/lich.test.mjs`](../../tests/tuvi-v2/lich.test.mjs); dọn dòng nhắc `lich-raw.js` trong [`src/lib/tuvi-v2/NOTICE`](../../src/lib/tuvi-v2/NOTICE).
   - Bổ sung test bảo vệ bản quyền [`tests/tuvi-v2/cam-lich-cu-trong-src.test.mjs`](../../tests/tuvi-v2/cam-lich-cu-trong-src.test.mjs): quét toàn bộ `src/` (trừ `src/lib/core/` cũ), tự động FAIL nếu còn tệp Hồ Ngọc Đức trong `src/lib/tuvi-v2/` hoặc có tệp nhắc tới `lich-raw` / `doi-chieu`.
2. **Chuẩn hóa ESM cho Next.js & Node và tạo route thử:**
   - Đổi phần vỏ [`src/lib/tuvi-v2/tuvi-raw.js`](../../src/lib/tuvi-v2/tuvi-raw.js) từ UMD/`require('./am-lich.ts')` sang chuẩn ESM (`import AmLich from './am-lich.ts'`, xuất cả named exports và `export default`), giữ nguyên 100% logic an sao. Chạy thông suốt trên cả `node --test` (kể cả các tệp `.cjs`) lẫn `next build`.
   - Tạo route thử [`src/app/api/tuvi-v2-thu/route.ts`](../../src/app/api/tuvi-v2-thu/route.ts) (`GET ?ngay=&thang=&nam=&gio=&phut=&gioiTinh=`) gọi `kiemTraThongTin` và `lapLaSo` từ `@/lib/tuvi-v2`.
3. **Tự dò Python trong test độc lập P0:**
   - [`tests/tuvi-v2/p0-van-han-va-ranh-gioi.test.cjs`](../../tests/tuvi-v2/p0-van-han-va-ranh-gioi.test.cjs) dò lần lượt `python3`, `python`, `py -3` (chạy cờ `-I`); nếu máy không có Python thì tự động `skip` 10 test gọi `tuvi-ref-engine.py` kèm thông báo rõ, không làm fail toàn bộ bộ test.

### 6.2. Kết quả build, test và gọi thử route (số liệu chạy thật)

- **`npm run build` (Next.js `15.5.28`):** **Đạt (mã thoát `0`)** — biên dịch trong `5.2s`, lint & type-check đạt, tạo đủ `42/42` trang tĩnh, route động `ƒ /api/tuvi-v2-thu` (`200 B`) build sạch không lỗi.
- **`npm run test:tuvi`:** **128 / 128 đạt, 0 fail, 0 skip** *(125 độc lập + 3 hồi quy; gồm thêm 1 test bảo vệ bản quyền `cam-lich-cu-trong-src.test.mjs`)*.
- **`npx tsc --noEmit`:** **0 lỗi** (mã thoát `0`).
- **Gọi thử `GET /api/tuvi-v2-thu?ngay=15&thang=8&nam=1990&gio=10&phut=30&gioiTinh=nam` trên `npm run dev`:** `HTTP 200 OK`:
  - **Âm lịch:** 25/6/1990 (`nhuan: false`) · Can Chi: năm **Canh Ngọ**, tháng **Quý Mùi**, ngày **Nhâm Tý**, giờ **Ất Tỵ**.
  - **Mệnh:** **Dần** · **Thân:** Tý (cung Phu Thê) · **Cục:** **Thổ Ngũ Cục**.
  - **14 chính tinh:** Tý: Tham Lang (H); Sửu: Thiên Đồng (H), Cự Môn (H); Dần: Vũ Khúc (V), Thiên Tướng (M); Mão: Thái Dương (V), Thiên Lương (V); Thìn: Thất Sát (H); Tỵ: Thiên Cơ (V); Ngọ: Tử Vi (M); Thân: Phá Quân (H); Tuất: Liêm Trinh (M), Thiên Phủ (V); Hợi: Thái Âm (M).

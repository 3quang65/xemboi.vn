# 13 — Repo mã nguồn huyền học: chọn cái nên dùng

Tra ngày 20–21/11/2026. Danh sách đủ 144 repo ở [`13-repo-tham-khao.csv`](13-repo-tham-khao.csv).

**Cách đọc số liệu**
- **Số sao và ngày cập nhật** lấy từ trang repo hoặc trang topic GitHub (`/topics/ziwei`, `bazi`, `lunar-calendar`, `am-lich`, `tu-vi`, `iching`, `fengshui`, `qimen`, `astrology`, `tarot`, `numerology`, `palmistry`, `physiognomy`) ngày 20/11/2026.
- Cột `commit_cuoi` ghi ngày "Updated" trên trang topic. Ngày này gần với lần push cuối nhưng không phải mã commit đã kiểm. Repo em mở trực tiếp mà trang không hiện ngày thì ghi "chưa rõ".
- `da_kiem_url = co` nghĩa là em đã mở chính trang repo hoặc trang gói và đọc giấy phép. `khong` nghĩa là chỉ thấy trong trang topic hoặc kết quả tìm. Với các dòng `khong`, giấy phép ghi "chưa rõ" và phải kiểm lại trước khi dùng.
- Em không tải mã về, không chạy thử, chưa so kết quả thật với engine của mình. Các con số độ chính xác trong bảng là do tác giả repo tự công bố, chưa kiểm độc lập.

---

## 1. Kết luận nhanh

1. **Không thay engine tử vi và lịch âm.** `src/lib/tuvi-v2` đã có 19 khóa quy ước trường phái, lịch Meeus/VSOP87D viết độc lập, và 53 lá số đối chiếu (05a, 05b). Chưa repo nào em thấy theo Nam phái Việt đầy đủ bằng. Giá trị lớn nhất của các repo bên ngoài là **làm bộ đối chiếu kiểm thử**.
2. **Bộ đối chiếu nên lấy về ngay:**
   - Tử vi: `iztro`, MIT. Đã dùng trong test hiện có.
   - Lịch âm Việt: vector test của `Nhat-Nguyet`, CC BY 4.0, mặc định UTC+7. Kèm `lunar-vn` (Python, UTC+7).
   - Bát tự: `tommitoan/bazica` (MIT, tiết khí lấy từ JPL DE440, có nhãn tiếng Việt) và `viet-bazi-engine` (MIT, tiếng Việt).
   - Tiết khí và sóc: `sxtwl` (BSD-3) và `lunar-python` (MIT).
3. **Thư viện dùng thẳng:**
   - `astronomy-engine` (MIT) cho chiêm tinh.
   - `i-ching` (MIT) cho cấu trúc 64 quẻ.
   - `tarot-json` (MIT; ảnh Rider-Waite public domain ở Mỹ).
   - MediaPipe (Apache-2.0), chỉ khi anh duyệt mảng tướng số.
4. **Port bảng tra (MIT):**
   - Nghi kỵ, thần sát, Bành Tổ từ `lunar-javascript`.
   - Nạp giáp lục hào từ `najia` và `ichingshifa`.
5. **Cấm nhúng:** mọi bản port mã Hồ Ngọc Đức, AGPL (`mingyu`, `kerykeion`, `sweph`, Horosa, CompassEx), GPL (`ziwei-chart`), các repo phi thương mại (`meihua-yishu`, `HeiGe-SuanMing`) và repo không có giấy phép (mục 4).

---

## 2. Bảng "chọn dùng" theo mảng

| Mảng | Repo đề xuất | Cách dùng | Giấy phép | Lý do |
|---|---|---|---|---|
| **Tử vi (an sao)** | [SylarLong/iztro](https://github.com/SylarLong/iztro) (R001) | Đối chiếu | MIT | 4,4k sao, có Jest + Codecov, có vi-VN, cấu hình được giờ Tý muộn, Tết/Lập Xuân, phái Trung Châu. Khác Nam phái ở nhiều điểm (mục 5.5) nên chỉ đối chiếu, không thay. |
| | [nmhaaa3218/TuViMCP](https://github.com/nmhaaa3218/TuViMCP) (R011), [doanguyen/lasotuvi](https://github.com/doanguyen/lasotuvi) (R009) | Đối chiếu (cùng gốc) | Apache-2.0 / MIT | Gốc của `tuvi-raw.js`. Dùng để bắt lỗi chuyển thể, không phải nguồn độc lập. |
| | [iZenDeveloper/viet-tuvi-engine](https://github.com/iZenDeveloper/viet-tuvi-engine) (R012) | Đối chiếu bổ sung | MIT | Engine Việt độc lập, có test, có hợp lá số. 0 sao, chưa ghi nguồn sách, nên chỉ tin khi khớp thêm một nguồn khác. |
| | [Renhuai123/ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu) (R003) | Tham khảo | MIT (mã), CC BY-NC-SA (trích giảng) | 19k sao. Đáng học cách khai báo 4 quy ước tháng nhuận và giờ mặt trời thực. Khác phái (Nghê Hải Hạ). |
| | [SylarLong/react-iztro](https://github.com/SylarLong/react-iztro) (R002) | Tham khảo giao diện | MIT | Bố cục 12 cung. |
| **Lịch âm Việt** | [Nhat-Nguyet/nhatnguyet-lunar…](https://github.com/Nhat-Nguyet/nhatnguyet-lunar-ziwei-bazi-numerology) (R042) | Đối chiếu (vector test) | MIT (mã), CC BY 4.0 (vector) | 17.291 vector lõi, mặc định Việt Nam UTC+7. Repo tự nêu ví dụ Tết 1985: Việt Nam 21/01, Trung Quốc 20/02. Repo mới, ít sao, phải kiểm chéo. |
| | [junkeythong/amlichvietnam](https://github.com/junkeythong/amlichvietnam) (R041) | Đối chiếu | MIT | PyPI `lunar-vn`, UTC+7, 1900–2100. Viết lại theo đặc tả Hồ Ngọc Đức nên chỉ chạy trong test. |
| | `lich-raw.js` đã có trong `tests/` | Đối chiếu | Hồ Ngọc Đức, chỉ phi thương mại | Giữ ở `tests/`, không vào `src/` (05b). |
| **Can chi, tiết khí, hoàng lịch** | [6tail/lunar-javascript](https://github.com/6tail/lunar-javascript) (R025) | Port bảng tra + đối chiếu | MIT | Có nghi kỵ hằng ngày, hoàng đạo/hắc đạo, cát thần hung sát, Bành Tổ bách kỵ. Tính theo lịch Trung Quốc nên chỉ lấy bảng, không lấy hàm đổi ngày. |
| | [6tail/tyme4ts](https://github.com/6tail/tyme4ts) (R027) | Đối chiếu | MIT | Bản kế nhiệm lunar, không phụ thuộc runtime. README không ghi nghi kỵ, cần kiểm thêm. |
| | [yuangu/sxtwl_cpp](https://github.com/yuangu/sxtwl_cpp) (R030), [6tail/lunar-python](https://github.com/6tail/lunar-python) (R028) | Đối chiếu (Python `-I`) | BSD-3 / MIT | Hai đáp án sóc và tiết khí độc lập với Meeus. |
| | [h4x0r/stem-branch](https://github.com/h4x0r/stem-branch) (R051) | Đối chiếu | Apache-2.0 | VSOP87D hiệu chỉnh theo DE441. Có thần sát và cửu tinh. |
| **Bát tự** | [tommitoan/bazica](https://github.com/tommitoan/bazica) (R056) | Đối chiếu + port bảng | MIT | Go, 1700–2399, `solar-term.json` sinh từ DE440, nhãn Anh–Việt, thập thần, đại vận, 58 thần sát, có test. |
| | [iZenDeveloper/viet-bazi-engine](https://github.com/iZenDeveloper/viet-bazi-engine) (R057) | Đối chiếu | MIT | Tiếng Việt, chọn được ranh giới giờ Tý, mọi quy ước ghi trong metadata. Bản rc. |
| | [ml8s/liki](https://github.com/ml8s/liki) (R097) | Đối chiếu luật | MIT | 829 khẳng định luật có dẫn sách, 192 ca ranh giới tiết khí. |
| | [hkargc/paipan](https://github.com/hkargc/paipan) (R055) | Tham khảo | WTFPL | Hình xung hợp hại, giờ mặt trời thực. Thuật toán gốc lấy từ bieyu.com, chưa rõ giấy phép. |
| **Kinh Dịch / Lục Hào / Mai Hoa** | [strobus/i-ching](https://github.com/strobus/i-ching) (R071) | Thư viện | MIT | Cấu trúc 64 quẻ, 8 quái, biến quẻ. Không có lời quẻ. |
| | [bopo/najia](https://github.com/bopo/najia) (R069), [kentang2017/ichingshifa](https://github.com/kentang2017/ichingshifa) (R068) | Port | MIT | Nạp giáp, lục thân, lục thần, thế ứng. `najia` có test từng hàm. |
| | [muyen/meihua-yishu](https://github.com/muyen/meihua-yishu) (R070) | Chỉ đọc | CC BY-NC-SA 4.0 | Học cách lập quẻ Mai Hoa. Không chép dữ liệu. |
| **Phong thủy** | Không có repo đủ tốt | Tự viết | — | Bát Trạch (quái mệnh, 4 hướng tốt, 4 hướng xấu) chỉ cần vài bảng. Tham khảo [alvamind](https://github.com/alvamind/bazi-calculator-by-alvamind) (MIT) để so. Huyền Không: [mikaboshi](https://github.com/minagawah/mikaboshi) (MIT, đã deprecated) và `NineStar` của lunar-python. CompassEx là AGPL. |
| **Chiêm tinh** | [cosinekitty/astronomy](https://github.com/cosinekitty/astronomy) (R108) | Thư viện | MIT | npm `astronomy-engine`, sai số ±1′ so với NOVAS. Đủ cho cung Mặt Trời/Mặt Trăng và vị trí hành tinh. Hệ nhà phải tự viết. |
| | [AstroDraw/AstroChart](https://github.com/AstroDraw/AstroChart) (R112) | Thư viện | MIT | Vẽ bánh xe lá số SVG. |
| | [kerykeion](https://github.com/g-battaglia/kerykeion) (R109) | Đối chiếu cục bộ | AGPL-3.0 | Chỉ sinh đáp án test trên máy, không đưa lên server. |
| **Tarot** | [metabismuth/tarot-json](https://github.com/metabismuth/tarot-json) (R119) | Thư viện dữ liệu | MIT | 78 lá kèm ảnh. Lời giải nghĩa tiếng Việt phải tự viết. |
| **Thần số học** | Không cần repo | Tự viết | — | Công thức cộng chữ số ngắn. Repo tiếng Việt duy nhất ([R126](https://github.com/minhphuc010194/NumerologyWebApp)) không có giấy phép. [R125](https://github.com/evoluteur/motivational-numerology) là AGPL. |
| **Kỳ Môn / Lục Nhâm / Thái Ất** | [kentang2017/kinqimen](https://github.com/kentang2017/kinqimen) (R086), [qfdk/qimen](https://github.com/qfdk/qimen) (R089) | Tham khảo | MIT | Chỉ để học. Ngoài phạm vi P1–P2. |
| **Tướng số / chỉ tay** | [MediaPipe](https://github.com/google-ai-edge/mediapipe) (R130), [yeonsumia/palmistry](https://github.com/yeonsumia/palmistry) (R131) | Thư viện / tham khảo | Apache-2.0 | Khả thi kỹ thuật (mốc mặt, mốc tay chạy trên trình duyệt). Rủi ro cao, xem mục 6. |
| **AI / RAG / dataset** | [ChenJiangxi/BaziQA](https://github.com/ChenJiangxi/BaziQA) (R136), [DestinyLinker/MingLi-Bench](https://github.com/DestinyLinker/MingLi-Bench) (R137) | Đối chiếu tầng AI | MIT (đề gốc có chủ) | Benchmark nội bộ cho tầng luận. Không đăng lại đề. |
| | [ChesterRa/mingpan](https://github.com/ChesterRa/mingpan) (R096), `taibu/packages/core` (R095) | Tham khảo kiến trúc | Apache-2.0 / MIT (chỉ packages) | Mẫu "engine trả dữ kiện, AI chỉ luận" giống hướng xemboi đang đi. |
| | [voidforall/fengshui.skill](https://github.com/voidforall/fengshui.skill) (R145), [fanzr-arch/numerologist_skills](https://github.com/fanzr-arch/numerologist_skills) (R146) | Học ý prompt + bảng xuất xứ; vector phong thủy | MIT từ fe2a025 / không có LICENSE | Phân tích và so sánh ở [20-hoc-tu-4-repo.md](20-hoc-tu-4-repo.md). |
| **Trang tử vi Việt mã mở** | `lasotuvi-django`, `astro-lens`, `0xaldric/tuvi`, `tuvi-api` | Tham khảo cấu trúc | Phần lớn chưa rõ | Đều nhỏ (0–20 sao). Không có trang Việt mã mở nào ở quy mô sản phẩm. |

---

## 3. Top 10 repo nên lấy về ngay

Để ngoài `src/`, ví dụ trong `tests/tuvi-v2/fixtures/` hoặc một thư mục tham khảo riêng. Claude Code sẽ tải sau khi anh duyệt.

| # | Repo | Để làm gì | Giấy phép |
|---|---|---|---|
| 1 | [SylarLong/iztro](https://github.com/SylarLong/iztro) | Đối chiếu an sao. Nạp **ngày âm do `am-lich.ts` tính** để tách lỗi lịch khỏi lỗi an sao. | MIT |
| 2 | [Nhat-Nguyet/nhatnguyet-lunar…](https://github.com/Nhat-Nguyet/nhatnguyet-lunar-ziwei-bazi-numerology) (chỉ thư mục `ca-kiem/`) | Vector test lịch Việt (UTC+7): sóc, tiết khí, Tết, tháng nhuận. | CC BY 4.0 (phải ghi công) |
| 3 | [junkeythong/amlichvietnam](https://github.com/junkeythong/amlichvietnam) (`lunar-vn`) | Đáp án Python thứ hai cho lịch Việt. | MIT |
| 4 | [6tail/lunar-javascript](https://github.com/6tail/lunar-javascript) | Bảng nghi kỵ, thần sát, Bành Tổ cho xem ngày (P2). Đối chiếu can chi và bát tự. | MIT |
| 5 | [6tail/lunar-python](https://github.com/6tail/lunar-python) | Đáp án Python cho tiết khí và bát tự. Có `NineStar`. | MIT |
| 6 | [yuangu/sxtwl_cpp](https://github.com/yuangu/sxtwl_cpp) | Đáp án sóc và tiết khí độc lập với Meeus. | BSD-3-Clause |
| 7 | [tommitoan/bazica](https://github.com/tommitoan/bazica) | `solar-term.json` (DE440) và bộ bát tự để đối chiếu, nhãn tiếng Việt. | MIT |
| 8 | [iZenDeveloper/viet-bazi-engine](https://github.com/iZenDeveloper/viet-bazi-engine) | Đối chiếu bát tự tiếng Việt, các quy ước ranh giới ngày. | MIT |
| 9 | [bopo/najia](https://github.com/bopo/najia) | Port nạp giáp lục hào cho Kinh Dịch (P2). | MIT |
| 10 | [cosinekitty/astronomy](https://github.com/cosinekitty/astronomy) (`astronomy-engine`) | Thư viện chiêm tinh (P2 Q4). Kiểm chéo sóc và tiết khí thêm một lần. | MIT |

Dự bị: `strobus/i-ching` (cấu trúc quẻ), `ml8s/liki` (luật bát tự có dẫn sách), `tarot-json`, `AstroChart`.

---

## 4. Repo cấm nhúng vì giấy phép

Các repo dưới đây chỉ đọc để hiểu thuật toán, rồi tự viết lại. Không chép mã, không chép dữ liệu, không thêm vào `package.json`.

| Nhóm | Repo | Giấy phép |
|---|---|---|
| **Mã Hồ Ngọc Đức và bản port** | [vanng822/amlich](https://github.com/vanng822/amlich) (đầu tệp ghi *Copyright (c) 2006 Ho Ngoc Duc*, chỉ cho "personal, non-commercial use", em đã đọc), [NghiaCaNgao/LunarDate](https://github.com/NghiaCaNgao/LunarDate), [nacana22/lunar-date](https://github.com/nacana22/lunar-date), [lunar-calendar-ts-vi](https://github.com/tuanquynh0508/lunar-calendar-ts-vi), [codeaholicguy/amlich.js](https://github.com/codeaholicguy/amlich.js), tệp `lunar-calendar.js` trong [LapLaSoTuViJavaScript](https://github.com/nhattamchinh159/LapLaSoTuViJavaScript), `hailiang194/am-duong-lich` | Phi thương mại. Nhãn MIT ở bản port không xóa được giới hạn của mã gốc. |
| **AGPL-3.0** | [Brhiza/mingyu](https://github.com/Brhiza/mingyu), [Horosa](https://github.com/Horace-Maxwell/Horosa-Web-App-comprehensively-improved-Windows), [kerykeion](https://github.com/g-battaglia/kerykeion), [sweph](https://github.com/timotejroiko/sweph) (≥2.10.1), [CompassEx](https://github.com/Jockeyvb/CompassEx), [motivational-numerology](https://github.com/evoluteur/motivational-numerology), phần web/server của [taibu](https://github.com/hhszzzz/taibu) | AGPL: chạy trên server cũng phải công bố mã. |
| **GPL** | [ziweiknows/ziwei-chart](https://github.com/ziweiknows/ziwei-chart) (GPL-3.0+), [ChineseCalendarLib](https://github.com/livedcode/ChineseCalendarLib) (GPL-3.0), `sweph` ≤2.10.0 (GPL-2.0) | Không nhúng vào mã đóng. |
| **Phi thương mại** | [muyen/meihua-yishu](https://github.com/muyen/meihua-yishu) (CC BY-NC-SA 4.0), [HeiGe-SuanMing](https://github.com/HeiGeAi/HeiGe-SuanMing) (PolyForm NC), `ai-freer/fortune-skill` (PolyForm NC theo mô tả), trích giảng trong `Renhuai123/ziwei-doushu/docs/tianji-ziwei` (CC BY-NC-SA), dữ liệu luận giải của Nhat-Nguyet (CC BY-NC 4.0 từ 20/11/2026), đề thi gốc trong BaziQA | Cấm dùng trong sản phẩm thu phí. |
| **Không có giấy phép** | `lasotuvi-django`, `astro-lens`, `NumerologyWebApp`, `SoulMatrix` (nghi thổi sao: 4,7k sao nhưng 1 fork, không tải), và mọi dòng "chưa rõ" trong CSV | Mặc định giữ toàn quyền. |
| **Thận trọng** | [Taogram/taobi](https://github.com/Taogram/taobi) (MPL-2.0): dùng được nếu giữ nguyên tệp và công bố sửa đổi trong tệp đó. [hkargc/paipan](https://github.com/hkargc/paipan) (WTFPL): nguồn gốc bieyu.com chưa rõ giấy phép. | |

Không gặp repo LGPL nào đáng kể. Ngoại lệ là `sweph`, dùng được theo LGPL-3.0 nếu đã mua giấy phép Swiss Ephemeris chuyên nghiệp (giá chưa kiểm).

---

## 5. Đề xuất cho các công cụ P1

### 5.1 Lịch âm: đổi ngày, lịch tháng/năm (A1, A3)
- **Dùng repo nào:**
  - Không thêm thư viện. Tiếp tục chạy `am-lich.ts`, đã khớp 108/108 Tết và 200/200 mốc (05b).
  - Lấy vector `ca-kiem/` của Nhat-Nguyet, `lunar-vn` và `sxtwl` làm ba đáp án độc lập.
  - So tiết khí với `bazica/data/solar-term.json` (DE440).
  - Giờ hoàng đạo theo chi ngày là một bảng 6×12 công khai. Tự viết, rồi so với `lunar-javascript`.
- **Tiết kiệm được:**
  - Không phải tự dựng đáp án cho 1900–2100.
  - Có sẵn ca biên khó: sóc gần nửa đêm, tháng nhuận, năm lệch Trung Quốc như 1985, mốc đổi múi giờ 1968.
  - Phần giao diện lịch tháng/năm không có repo nào đáng lấy. Tự làm.
- **Rủi ro:**
  - Repo Nhat-Nguyet mới (8 sao). Nếu vector của họ lệch engine thì phải xem nguồn thứ ba trước khi sửa engine.
  - Quy ước trước 1968: engine dùng UTC+8. Các repo khác có thể dùng UTC+7 cho mọi năm, nên cần lọc ca trước 1968.
  - CC BY bắt buộc ghi công nếu đưa vector vào repo.

### 5.2 Mệnh theo năm sinh, 60 hoa giáp, ngũ hành (B1, B2, B4)
- **Dùng repo nào:**
  - Không cần. Đã có `nap-am.json` và `nap-am.mjs`.
  - Cung phi (quái mệnh) cho Bát Trạch tự viết vài dòng. So với `alvamind` (MIT) và `lunar-javascript`.
- **Tiết kiệm được:** gần như không. Đây là việc tra bảng.
- **Rủi ro:**
  - Ranh giới năm: Tết hay Lập Xuân. Người sinh từ 01/01 đến trước Tết dễ khiếu nại. Trang phải ghi rõ "tính theo năm âm lịch bắt đầu từ mùng 1 Tết".
  - Cung phi nam/nữ và năm từ 2000 trở đi có hai cách tính phổ biến. Phải chọn một cách và ghi quy ước.

### 5.3 Xem tuổi vợ chồng + hợp hai lá số (F1, C8)
- **Dùng repo nào:**
  - Không repo nào có bộ luật kiểu Việt: ngũ hành nạp âm sinh khắc, thiên can hợp/xung, địa chi tam hợp/lục hợp/xung/hại, cung phi bát trạch, kim lâu, tam tai.
  - Tự soạn bảng từ sách, có dẫn nguồn.
  - Đối chiếu phần hình xung hợp hại với `hkargc/paipan` (WTFPL, chỉ đọc).
  - Phần "hợp hai lá số" tham khảo mục compatibility của `viet-tuvi-engine` (MIT).
- **Tiết kiệm được:** ít. Các bảng hợp/xung có sẵn trong nhiều repo MIT, nhưng đều là dữ liệu chung, ai cũng soạn được.
- **Rủi ro:**
  - Đây là công cụ "phán", dễ gây tranh cãi. Mỗi trang Việt cho một kết quả khác nhau.
  - Phải công khai thang điểm và quy ước, tránh câu kiểu "không nên cưới".
  - Không có bộ đối chiếu chuẩn nào.

### 5.4 Bát tự + 24 tiết khí (D1, A4)
- **Dùng repo nào:**
  - **Tự viết** trên `am-lich.ts` và `tiet-khi.mjs` (đã có VSOP87D).
  - Port bảng thập thần, tàng can, trường sinh, nạp âm, thần sát từ `bazica` (MIT, có nhãn Việt) hoặc `lunar-javascript` (MIT). Giữ dòng ghi công trong NOTICE.
  - Đối chiếu bằng `bazica`, `viet-bazi-engine`, `lunar-python` và luật của `liki`.
- **Tiết kiệm được:**
  - Bảng tra và bộ ca đối chiếu có sẵn.
  - Ước lượng của em: phần lớn công sức đối chiếu và soạn bảng thần sát được rút ngắn. Chưa đo bằng giờ.
- **Rủi ro và khác biệt quy ước cần ghi rõ trên trang:**
  - Năm bát tự đổi tại **Lập Xuân**, khác tử vi đổi tại Tết. Hai công cụ trên cùng site sẽ cho can chi năm khác nhau với người sinh trong khoảng 04/02 đến trước Tết. Phải giải thích.
  - Tháng đổi tại 12 tiết, tính theo **giờ Việt Nam**. Repo Trung Quốc tính theo UTC+8, nên ca sinh trong giờ giao tiết sẽ lệch trụ tháng.
  - Giờ Tý: Tý sớm/muộn, đổi trụ ngày lúc 23:00 hay 00:00. `viet-bazi-engine` và `bazi-ts-lib` đều cho chọn.
  - Khởi đại vận: quy tắc 3 ngày = 1 năm, cách làm tròn tháng/ngày mỗi repo một kiểu.
  - Giờ mặt trời thực: tắt mặc định như tử vi.
  - Dụng thần và cách cục khác nhau theo phái. Không repo nào là chuẩn. Chỉ nên hiển thị dữ kiện, phần luận gắn nhãn trường phái.

### 5.5 Đối chiếu tử vi với engine hiện có
Đề xuất cách chạy:
- Với mỗi lá mẫu, nạp vào iztro **ngày âm do `am-lich.ts` tính** (`isLeapMonth` theo kết quả của mình).
- Đặt `dayDivide` và `yearDivide` khớp quy ước đang so.
- Chỉ so những sao không thuộc danh sách khác biệt bên dưới. Sao thuộc danh sách thì so với nhánh `quyUoc` tương ứng của engine (engine đã có các nhánh kiểu `iztro`, `trungQuoc`, `motCung`).

Khác biệt quy ước sẽ gặp:

| Điểm | Engine xemboi (mặc định) | iztro |
|---|---|---|
| Lịch âm | Việt Nam UTC+7, trước 1968 dùng UTC+8 | Phụ thuộc `lunar-typescript` / `lunar-lite`, lịch Trung Quốc. Lệch ở các năm như 1985 và các ngày sóc gần nửa đêm. |
| Giờ Tý 23:00–23:59 | `ngaySau` | `dayDivide`: `current` (giữ ngày) hoặc `forward` (sang ngày sau) |
| Ranh giới năm | Tết | `yearDivide`: `normal` (Tết) hoặc `exact` (Lập Xuân) |
| Tứ hóa can Canh, Nhâm | Bảng Việt | Phái Trung Quốc (cấu hình lại được qua `mutagens`) |
| Hỏa Tinh, Linh Tinh | Chiều theo âm dương nam nữ | Cả hai đều đi thuận |
| Thiên Trù can Quý | Tuất | Hợi |
| Tuần, Triệt | Hai cung | Một cung |
| Mệnh chủ | Theo chi năm sinh | Theo chi cung Mệnh (mặc định). Phái `zhongzhou` theo chi năm sinh. |
| Tháng nhuận | An như tháng chính | Nhận `isLeapMonth`. Quy tắc an sao cho tháng nhuận chưa kiểm trong tài liệu. |

Sau iztro, nên thêm hai nguồn:
- `viet-tuvi-engine`: cùng phái Việt, độc lập về mã.
- `fortel-ziweidoushu`: phái Trung Châu, để kiểm nhánh `trungChau`.

---

## 6. Đánh giá mảng tướng số và chỉ tay bằng AI

- **Kỹ thuật:** khả thi. MediaPipe (Apache-2.0) cho mốc khuôn mặt và bàn tay ngay trên trình duyệt. Có repo mẫu tách đường chỉ tay bằng UNet (`yeonsumia/palmistry`, Apache-2.0, không ghi nguồn dataset).
- **Học thuật:** không có repo nào gắn đặc điểm hình học với sách tướng Việt hay Trung có dẫn nguồn. Phần "luận" vẫn phải tự soạn.
- **Rủi ro:**
  - Ảnh mặt và ảnh tay là dữ liệu sinh trắc học. Theo hiểu biết của em, đây là dữ liệu cá nhân nhạy cảm theo quy định bảo vệ dữ liệu cá nhân của Việt Nam. Văn bản và điều khoản cụ thể **[CHƯA KIỂM]**, cần luật sư xác nhận.
  - Nếu làm thì chạy hoàn toàn trên trình duyệt, không gửi ảnh lên server, không lưu.
  - Chặn mọi suy đoán về sức khỏe, sắc tộc, tính cách tiêu cực.
- **Khuyến nghị:** chưa làm ở P1–P2.

---

## 7. Việc cần anh quyết

1. **Duyệt top 10** (mục 3) để Claude Code tải về. Mã chỉ đặt ngoài `src/`, phục vụ kiểm thử. Riêng `lunar-javascript`, `najia` và `astronomy-engine` sẽ thành thư viện hoặc bản port, nên khi dùng phải thêm vào NOTICE.
2. **Có dùng vector test CC BY 4.0 của Nhat-Nguyet không.** Dùng thì phải ghi công trong NOTICE hoặc README test.
3. **Bát tự:** tự viết trên `am-lich.ts` và port bảng từ `bazica` (em khuyến nghị cách này), hay nhúng thẳng `lunar-javascript` và chấp nhận lệch lịch Việt ở ca giao tiết.
4. **Chiêm tinh (P2 Q4):** `astronomy-engine` MIT (em khuyến nghị), hay mua giấy phép Swiss Ephemeris chuyên nghiệp để dùng `sweph` (chính xác hơn, tốn phí, giá chưa kiểm).
5. **Tướng số / chỉ tay AI:** làm hay không. Em khuyến nghị chưa làm, xem mục 6.
6. **Lời quẻ Kinh Dịch tiếng Việt:** không repo mở nào có. Chọn một trong ba: tự dịch từ chữ Hán (public domain), xin phép một bản dịch, hoặc chỉ dùng tóm tắt tự viết.
7. **Quy tắc giấy phép cho cả dự án:** cấm thêm phụ thuộc AGPL, GPL, phi thương mại hoặc không có giấy phép. Em đề xuất thêm bước quét giấy phép tự động khi build. Việc này nằm ngoài `docs/`, cần anh cho phép.
8. **Lấy `taibu/packages/core` (MIT) hay không.** Repo có nhiều mã hữu ích nhưng trộn AGPL ở thư mục khác, dễ chép nhầm. Em khuyến nghị chỉ đọc.

---

## 8. Giới hạn của lần tra này

- Trang topic GitHub chỉ hiện 20 repo đầu mỗi chủ đề. Còn khoảng 400 repo `bazi`, 175 repo `iching`, 1.100 repo `astrology` em chưa xem.
- Không tìm được kho Gitee nào ngoài trang `6tail/lunar-javascript` hiện trong kết quả tìm. Không mở được trang PyPI `ansaotuvi` (lỗi tải trang).
- Không thấy dataset Hugging Face nào bằng tiếng Việt về tử vi hay Kinh Dịch.
- Số sao biến động theo ngày. Số liệu tính đến 20/11/2026.

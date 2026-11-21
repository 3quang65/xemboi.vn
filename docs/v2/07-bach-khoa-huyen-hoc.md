# 07 — Bách khoa huyền học xemboi.vn: bản đồ sản phẩm và lộ trình

> Ngày lập: **20/11/2026**. Tài liệu chính của loạt 07.
> Đầu vào: [`07a-khao-sat-cong-cu.md`](07a-khao-sat-cong-cu.md) (30 trang/app đọc được: 17 Việt, 13 quốc tế), [`07b-phan-loai-huyen-hoc.md`](07b-phan-loai-huyen-hoc.md) (18 mảng, 87 công cụ), [`01`](01-kiem-ke.md), [`02`](02-thi-truong.md), [`03`](03-khach-hang.md), [`04`](04-dinh-vi-kinh-doanh.md), [`05a`](05a-ban-giao-engine.md), [`05b`](05b-lich-meeus-va-test-p0.md).
> Nhãn: `[GIẢ ĐỊNH]` = số tự đặt. `[SUY LUẬN]` = suy ra từ bằng chứng có dẫn. `[CHƯA KIỂM]` = chưa xác minh được.
> **Ràng buộc cứng:** không việc nào trong tài liệu này được chen trước R1 và bản Tết của 04. Bách khoa phục vụ phễu Gói 2, không thay Gói 2.

---

## 1. Tầm nhìn

xemboi.vn là **bách khoa huyền học Việt Nam minh bạch**. Ai cũng tra được miễn phí lịch âm, can chi, lá số và nghĩa từng sao, từng quẻ, từng con số. Mỗi kết quả ghi rõ **căn cứ** (công thức nào, bảng nào, sách nào, trường phái nào). Mỗi mục tách hai phần: **"Truyền thống nói gì"** (theo từng phái, có trích nguồn) và **"Khoa học nói gì"** (phần nào là thiên văn học thật, phần nào là quy ước văn hóa, phần nào chưa có bằng chứng). Không hù dọa, không bán lễ, không bán vật phẩm. Tiền đến từ bản luận giải sâu có căn cứ, không đến từ nỗi sợ.

Vì sao có cửa: 17/17 trang Việt khảo sát đều có công cụ, nhưng **không trang nào thấy ghi nguồn sách cho từng mục hay tên người duyệt** trên trang chủ (07a mục 5 điểm 2, `[CHƯA KIỂM trang con]`). Mô hình "từ điển + bảng tra + công cụ miễn phí → báo cáo trả phí" đã chạy ở Cafe Astrology, Astrodienst, myBodyGraph (07a mục 2).

---

## 2. Kiến trúc thông tin

### 2.1. Bốn loại trang

| Loại trang | Vai trò | Ví dụ | Dữ liệu |
|:--|:--|:--|:--|
| **Công cụ** | Nhập → tính → ra kết quả có căn cứ | Lập lá số, đổi ngày âm–dương, tra mệnh theo năm sinh | Tất định (TĐ) hoặc bảng tra (BT) từ engine |
| **Mục từ điển** | Một khái niệm, một trang | Sao Thiên Cơ, quẻ Thuần Càn, Giáp Tý, tiết Lập Xuân, số chủ đạo 7 | Biên tập tay, có nguồn, có người duyệt |
| **Bài kiến thức** | Giải thích, so sánh, hướng dẫn | "Vì sao hai trang ra hai lá số khác nhau", "Sinh giờ Tý 23h tính ngày nào" | Biên tập tay |
| **Nguồn và phương pháp** | Gốc của niềm tin | Thư mục sách, quy ước Nam Phái, bảng trường phái, chuẩn biên tập, người duyệt | Biên tập tay |

Cộng thêm: **trang sản phẩm** (Gói 1/2/3 của 04) và **trang chủ đề** (hub) cho từng mảng.

### 2.2. Sơ đồ tầng

```
Trang chủ (ô tìm kiếm + 4 công cụ chính + "Hôm nay theo lịch")
│
├── Trang chủ đề (8 hub, gộp 18 mảng của 07b)
│   ├── Tử vi            (C)        → công cụ: lá số · từ điển: 114 sao, 12 cung, cách cục · bài · nguồn
│   ├── Lịch & ngày      (A, E)     → công cụ: đổi ngày, lịch ngày/tháng/năm, xem ngày · từ điển: 24 tiết khí, 12 trực, ngày lễ
│   ├── Can chi & tuổi   (B, F)     → công cụ: mệnh theo năm sinh, xem tuổi · từ điển: 60 hoa giáp, 12 con giáp, ngũ hành
│   ├── Bát tự           (D)        → công cụ: lá số bát tự · từ điển: 10 can, 12 chi, thập thần
│   ├── Phong thủy       (G)        → công cụ: cung phi, hướng · từ điển: 8 cung, 8 hướng
│   ├── Kinh Dịch        (H)        → công cụ: gieo quẻ · từ điển: 64 quẻ, 8 quái
│   ├── Số & sao Tây     (J, K)     → công cụ: thần số, tra cung hoàng đạo · từ điển: số 1–9/11/22/33, 12 cung
│   └── Phong tục        (P)        → văn khấn, mâm cúng, phong tục đời người
│
├── /tu-dien            (chỉ mục mọi bộ từ điển, A–Z)
├── /phuong-phap        (quy ước, trường phái, giới hạn, chuẩn biên tập, người duyệt)
├── /nguon              (thư mục sách, có tình trạng bản quyền)
└── /goi                (Gói 1/2/3, chính sách hoàn tiền của 04)
```

### 2.3. Khuôn một mục từ điển (bắt buộc đủ 9 khối)

| # | Khối | Nội dung |
|:-:|:--|:--|
| 1 | Tên + tên khác | "Thiên Cơ (天機)", tên gọi khác nếu có |
| 2 | Tóm tắt 2 câu | Đọc xong biết khái niệm là gì |
| 3 | **Truyền thống nói gì** | Theo từng phái, mỗi ý một nguồn `[Sách, tác giả, năm, chương/trang]` |
| 4 | **Các phái khác nhau ở đâu** | Bảng so sánh nếu có khác biệt (ví dụ Tứ Hóa can Canh, can Nhâm: spec an sao mục 10.4) |
| 5 | **Cách tính** | Chỉ khi tất định: công thức hoặc bảng, link mã nguồn/test |
| 6 | **Khoa học nói gì** | Ngắn, có nguồn. Không có nghiên cứu thì ghi "chưa có nghiên cứu kiểm chứng" |
| 7 | Liên quan | 3–5 mục từ điển + 1 công cụ + 1 bài |
| 8 | Nguồn | Danh sách đầy đủ, link sang `/nguon/...` |
| 9 | Người duyệt + ngày duyệt + giới hạn | "Biên tập: … · Duyệt học thuật: … · Duyệt ngày …" + câu giới hạn (mục 3.3) |

Học từ Thái Âm (07a 1.9): mỗi mục có **hai tầng đọc**: "đọc nhanh" (khối 1–3) và "đọc sâu" (khối 4–8).

### 2.4. Liên kết chéo

| Từ | Tới | Quy tắc |
|:--|:--|:--|
| Kết quả công cụ (lá số) | Mục từ điển | **Mỗi sao, mỗi cung, mỗi can chi trên lá số bấm được** sang mục từ điển. Đây là liên kết giá trị nhất: phục vụ P2 "muốn biết căn cứ" (03 `#16, #22`) |
| Mục từ điển | Công cụ | Nút "Xem sao này trên lá số của bạn" → form lập lá số |
| Mục từ điển | Mục từ điển | 3–5 mục cùng nhóm (ví dụ chính tinh cùng vòng Tử Vi) |
| Mục từ điển, bài | Nguồn | Mọi trích dẫn link sang `/nguon/<sach>` |
| Bài kiến thức | Công cụ + Gói | Tối đa 1 CTA sản phẩm/bài, đặt cuối bài, không pop-up (04 mục 3.1) |
| Trang theo năm/tuổi | Trang năm trước/sau | Điều hướng ngang (2026 ↔ 2027 ↔ 2028) |
| Mọi trang | `/phuong-phap` | Chân trang: "Cách xemboi tính và biên tập" |
| Trang có rủi ro hù dọa (xem tuổi, xem ngày) | Bài "Vì sao các nơi xem tuổi cho kết quả khác nhau" | Bắt buộc |

### 2.5. Cấu trúc URL

Chữ thường, không dấu, gạch ngang. Giữ route đã có: `/tu-vi-2027` (R1), `/kien-thuc`.

| Loại | Mẫu URL | Ví dụ |
|:--|:--|:--|
| Hub | `/<mang>` | `/tu-vi`, `/lich-am`, `/can-chi`, `/kinh-dich` |
| Công cụ | `/<mang>/<cong-cu>` | `/tu-vi/lap-la-so`, `/lich-am/doi-ngay`, `/xem-tuoi/vo-chong` |
| Từ điển tử vi | `/tu-vi/sao/<sao>`, `/tu-vi/cung/<cung>`, `/tu-vi/sao/<sao>/<cung>` | `/tu-vi/sao/thien-co`, `/tu-vi/cung/phu-the`, `/tu-vi/sao/tu-vi/menh` |
| Lịch | `/lich-am/<yyyy>`, `/lich-am/<yyyy>/<mm>`, `/lich-am/<yyyy>/<mm>/<dd>` | `/lich-am/2027/02/06` |
| Tiết khí | `/tiet-khi/<tiet>`, `/tiet-khi/nam/<yyyy>` | `/tiet-khi/lap-xuan` |
| Can chi | `/can-chi/<hoa-giap>`, `/sinh-nam/<yyyy>`, `/con-giap/<chi>`, `/ngu-hanh/<hanh>`, `/nap-am/<ten>` | `/can-chi/dinh-mui`, `/sinh-nam/1995`, `/nap-am/thien-ha-thuy` |
| Kinh Dịch | `/kinh-dich/que/<so>-<ten>` | `/kinh-dich/que/01-thuan-can` |
| Thần số | `/than-so-hoc/so-chu-dao/<n>` | `/than-so-hoc/so-chu-dao/7` |
| Phong tục | `/phong-tuc/<chu-de>`, `/van-khan/<dip>` | `/van-khan/ong-cong-ong-tao` |
| Theo năm/tuổi | `/tu-vi-<yyyy>/tuoi-<hoa-giap>-<gioi>` | `/tu-vi-2028/tuoi-at-hoi-nam` |
| Nguồn | `/nguon`, `/nguon/<sach>` | `/nguon/viet-nam-phong-tuc-phan-ke-binh` |
| Phương pháp | `/phuong-phap/<chu-de>` | `/phuong-phap/quy-uoc-nam-phai`, `/phuong-phap/gio-ty`, `/phuong-phap/thang-nhuan` |

### 2.6. Ước số trang tra cứu sinh ra được (P1 + P2)

Tất cả `[GIẢ ĐỊNH]` về phạm vi. Nguyên tắc chống *Scaled content abuse* (07b R-i): **chỉ index trang có dữ liệu tính riêng hoặc nội dung biên tập riêng**. Trang chỉ khác nhau vài con số thì gộp hoặc `noindex`.

| Nhóm | Cách sinh | Số trang | Index? |
|:--|:--|--:|:--|
| Lịch ngày 2020–2035 | Engine `am-lich.ts` | ~5.844 | Có (mỗi ngày có can chi, tiết khí, giờ hoàng đạo, lễ riêng). Ngoài 2020–2035: `noindex` (engine vẫn tính 1900–2100) |
| Lịch tháng + năm 2020–2035 | Engine | 192 + 16 | Có |
| 24 tiết khí + trang năm | Biên tập + `tiet-khi.mjs` | 24 + 16 | Có |
| Ngày lễ âm lịch | Biên tập + engine | ~20 | Có |
| 60 hoa giáp + 30 nạp âm + 5 hành + 12 con giáp | Biên tập | 107 | Có |
| "Sinh năm X" 1930–2030 | Engine + B1 | 101 | Có (mỗi năm có ngày Tết, Lập Xuân, ranh giới tuổi riêng) |
| Tử vi: 12 cung + 114 sao | Biên tập | 126 | Có |
| Tử vi: sao tại cung (14 × 12) | Biên tập | 168 | Chỉ index khi đã biên tập xong mục đó |
| Tử vi: cách cục | Biên tập | ~30 | Có |
| Tử vi năm theo tuổi (Tết 2028) | Biên tập có khuôn | 120 | Có, ghi rõ "chỉ theo năm sinh" |
| Bát tự: 10 can, 12 chi, 10 thập thần, thần sát | Biên tập | ~72 | Có |
| Xem ngày theo việc × tháng (2027–2028) | Engine + bảng | 8 × 12 × 2 = 192 | Có |
| Xem tuổi theo cặp con giáp | Biên tập ngắn | 78 | Có. **Cặp hoa giáp (1.830): `noindex`**, chỉ là kết quả công cụ |
| Xông đất 2028 theo tuổi gia chủ | Bảng | 60 | Có |
| Phong thủy: 8 cung phi + 8 hướng | Biên tập | 16 | Có |
| Kinh Dịch: 64 quẻ + 8 quái | Biên tập | 72 | Có |
| Thần số: 12 số chủ đạo + 9 năm cá nhân | Biên tập | 21 | Có |
| Chiêm tinh: 12 cung, 10 hành tinh, 12 nhà | Biên tập | 34 | Có |
| Văn khấn, mâm cúng, phong tục | Biên tập | ~60 | Có |
| Nguồn sách + phương pháp | Biên tập | ~40 | Có |
| **Tổng** | | **~7.400** | Trong đó **~750 mục biên tập tay**, còn lại sinh từ engine |

Hệ quả: ~750 mục × 20–30 phút = **250–375 giờ biên tập** `[GIẢ ĐỊNH]`. Với 28–30 giờ/tuần (04), đây là việc của **cả năm 2027**, không phải của một quý. Đó là lý do phải xếp hạng ở mục 4.

### 2.7. schema.org

| Kiểu | Dùng ở đâu | Thuộc tính chính | Ghi chú |
|:--|:--|:--|:--|
| `Organization`, `WebSite` | Toàn site | `name`, `url`, `logo` | — |
| `BreadcrumbList` | Mọi trang | — | — |
| [`DefinedTermSet`](https://schema.org/DefinedTermSet) | Mỗi bộ từ điển ("114 sao Tử vi", "64 quẻ", "60 hoa giáp", "24 tiết khí") | `name`, `hasDefinedTerm` | Kiểu dành cho glossary, dictionary |
| [`DefinedTerm`](https://schema.org/DefinedTerm) | Mỗi mục từ điển | `name`, `alternateName`, `description`, `inDefinedTermSet`, `termCode` | `inDefinedTermSet` chỉ đặt trên mục, không đặt trên bộ (theo case study ở kết quả tìm kiếm, `[CHƯA KIỂM]` với validator) |
| `Article` | Bài kiến thức | `author` (`Person`), `datePublished`, `dateModified`, `citation` | — |
| `WebPage` | Mục từ điển, bài | `reviewedBy` (`Person`), `lastReviewed` | Thể hiện người duyệt thật |
| `Book` | `/nguon/<sach>` | `name`, `author`, `datePublished`, `inLanguage`, `isbn` (nếu có) | Đích của `citation` |
| `WebApplication` | Trang công cụ | `applicationCategory`, `offers` (giá 0) | **Không** gắn `AggregateRating` khi chưa có đánh giá thật |
| `Product` + `Offer` | `/goi` | `price` 149000, `priceCurrency` VND | Khớp giá niêm yết 04 |
| `FAQPage` | **Không ưu tiên** | — | Google giới hạn FAQ rich result từ 08/2023 ([Google Search Central](https://developers.google.com/search/blog/2023/08/howto-faq-changes)); theo Search Engine Journal, FAQ rich result đã ngừng hiển thị năm 2026 (`[CHƯA KIỂM tài liệu Google gốc]`) |
| `Event` | **Không dùng** cho ngày lễ âm lịch | — | Ngày lễ không có địa điểm, đơn vị tổ chức cụ thể |

---

## 3. Chuẩn biên tập (E-E-A-T)

### 3.1. Trích nguồn

- **Mẫu:** `[Tên sách — Tác giả — năm — bản/nhà xuất bản — chương hoặc trang]`. Chưa đối chiếu trang thì ghi "chưa đối chiếu trang".
- **Ba hạng nguồn** (ghi rõ hạng bên cạnh mỗi nguồn):
  1. **Nguồn gốc:** sách cổ, sách chuyên môn của tác giả có tên.
  2. **Nguồn thứ cấp:** sách phổ thông, nghiên cứu, bài báo khoa học.
  3. **Nguồn web:** chỉ để tham khảo chéo. Không dùng làm căn cứ duy nhất.
- **Tình trạng bản quyền** ghi ở `/nguon/<sach>`: "công cộng" / "còn bản quyền, chỉ trích ngắn" / `[CHƯA KIỂM]`. Không chép nguyên bản dịch hiện đại (07b R-j). Đây cũng là bài học từ 01: kho văn cũ chép từ chotuvi.com phải bỏ.
- **Ứng viên nguồn công cộng cần kiểm:** *Việt Nam phong tục* (Phan Kế Bính, 1915) cho mảng phong tục; các bản Kinh Dịch của người dịch đã mất trên 50 năm. **Thời hạn bảo hộ theo luật Việt Nam và tình trạng từng cuốn: `[CHƯA KIỂM]`**, cần tra trước khi dùng.
- **Tử vi:** spec an sao đã ghi theo "sách cụ Thiên Lương" và đối chiếu iztro (tai-san-xemtuvi `tuvi-an-sao-spec.md` dòng 10). Tên sách, năm, nhà xuất bản đầy đủ: `[CHƯA KIỂM]`, phải bổ sung trước khi đăng từ điển sao.

### 3.2. Ghi chú trường phái

- Mỗi mục có khác biệt giữa các phái thì **bắt buộc có bảng so sánh**. Không chọn ngầm.
- Mặc định của xemboi ghi trên mọi kết quả: ví dụ tử vi "Nam Phái, giờ Tý muộn tính ngày sau, tháng nhuận an như tháng chính" (đúng `moTaQuyUoc()` và spec mục 10).
- Các điểm bất đồng đã có sẵn dữ liệu: 18 điểm mục 10 spec an sao (Tứ Hóa, Hỏa Linh, Thiên Giải, Tuần Triệt 1 hay 2 cung, giờ Tý, tháng nhuận…) và `ghi-chu-truong-phai.json`.
- Mảng khác cần lập bảng tương tự trước khi mở: Kim lâu (nhiều cách tính), thần số (Pythagoras và Chaldean), xem ngày (hoàng đạo, 12 trực, 28 sao).

### 3.3. Tuyên bố giới hạn (mẫu câu, đặt cuối mỗi trang)

| Loại trang | Câu mẫu |
|:--|:--|
| Lịch, tiết khí | "Phần ngày giờ được tính bằng thiên văn học (thuật toán Meeus, VSOP87D). Phần tốt xấu là quy ước văn hóa, không phải dự báo." |
| Tử vi, bát tự, thần số, chiêm tinh | "Đây là tri thức văn hóa phương Đông/phương Tây để tham khảo và tự suy ngẫm. Chưa có nghiên cứu khoa học nào chứng minh khả năng dự báo. Không thay tư vấn y tế, tài chính, pháp lý." |
| Xem tuổi, xem ngày | "Các sách và các thầy tính khác nhau. Kết quả này theo [hệ đã ghi]. Không nên dùng làm lý do duy nhất để hủy hôn, dời việc lớn." (03 `#75, #86`) |
| Gieo quẻ, rút bài | "Kết quả được chọn ngẫu nhiên. Hãy dùng như một câu hỏi để suy ngẫm, không như lời phán." |
| Có nhắc sức khỏe | "Nếu có triệu chứng, hãy gặp bác sĩ." (04 mục 3.4) |

**"Khoa học nói gì"** dùng nguồn có thật, ví dụ: Carlson (1985), *Nature* 318: 419–425: 28 nhà chiêm tinh không ghép được bản đồ sao với hồ sơ tính cách tốt hơn ngẫu nhiên ([NASA ADS](https://ui.adsabs.harvard.edu/abs/1985Natur.318..419C/abstract); có bài phân tích lại phản biện; chưa đọc toàn văn `[CHƯA KIỂM]`). Hiệu ứng Barnum/Forer: Forer (1949), "The fallacy of personal validation", *Journal of Abnormal and Social Psychology* (số trang các nguồn ghi khác nhau, `[CHƯA KIỂM]`). Giọng văn tôn trọng, không chế giễu người tin (03 mục 4: "Không tranh luận nếu người được hỏi nói tử vi là mê tín").

### 3.4. Người duyệt

| Vai | Ai | Duyệt gì | Khi nào |
|:--|:--|:--|:--|
| Biên tập viên chính | Anh Cường (tên thật hay bút danh do anh quyết, nhưng phải là người thật) | Mọi trang: từ cấm, giọng văn, nguồn | Trước khi đăng |
| Người duyệt học thuật | 1–2 cộng tác viên kiểu P2 (đã tự học, có cộng đồng) cho từng mảng. Chi phí `[CHƯA KIỂM giá thị trường]` | Đúng sai theo phái, bảng so sánh phái | Trước khi index mục từ điển |
| Người duyệt pháp lý | Luật sư theo đợt | Mảng có rủi ro Vừa trở lên (xem tuổi, xem ngày, văn khấn) và mọi trang bán hàng | Trước khi mở mảng |

Quy tắc: **không ghi chức danh không kiểm được** ("thầy 30 năm kinh nghiệm", "chuyên gia hàng đầu"). Học CHANI (07a 2.8): người viết có tên. Tránh mô hình CTV (07a 1.5): gọi là "thầy" cho lời do máy soạn. **AI chỉ được viết nháp.** Trang chỉ được index khi có người duyệt ký tên và ngày duyệt.

### 3.5. Danh sách từ cấm hù dọa

**Nền:** 54 cụm trong `tu-cam.json` (giải hạn, cúng sao, bùa chú, trừ tà, chết yểu, khắc chồng, tai ương, phải cúng, vong linh…) và bảng thay thế đi kèm. Bổ sung cho các mảng mới:

| Nhóm | Cụm cấm bổ sung | Xử lý |
|:--|:--|:--|
| **Cờ bạc** | "số đề", "lô đề", "đánh con gì", "con gì về", "bạch thủ", "song thủ", "bao lô", "dàn đề", "soi cầu", "chốt số", "nhà cái", "số trúng", "số may mắn hôm nay" | Chặn cứng, không có cụm thay thế. Riêng "lô", "đề" dễ trùng ("lô đất", "đề bài") → máy gắn cờ, người duyệt xem |
| **Lễ, vật phẩm** | "dâng sao", "giải sao", "cắt duyên âm", "duyên âm", "vong theo", "bị yểm", "trấn trạch", "linh phù", "khai quang", "kích tài lộc", "đổi vận", "chuyển vận", "hóa giải bằng", "thỉnh về" | Chặn cứng |
| **Hù dọa xem tuổi, xem ngày** | "đại hung", "đại kỵ", "không được cưới", "phải chia tay", "trùng tang", "liên táng", "sát chủ", "phạm Thái Tuế thì", "năm tuổi xui" | Thay bằng mẫu: "Theo [hệ], ngày/tuổi này được xếp là [tên gọi]. Hệ khác xếp là …" |
| **Hứa hẹn quảng cáo** | "chính xác 100%", "biết trước tương lai", "linh ứng", "xem là trúng", "thầy cao tay" | Chặn trong tiêu đề, meta, quảng cáo (Google *Unreliable claims*, Meta *Prohibited Commercial Practices*, 02) |

**Thuật ngữ kỹ thuật được phép** (Tuyệt Mệnh, Ngũ Quỷ, Họa Hại, Lục Sát trong Bát trạch; Hóa Kỵ, Kình Dương, Đà La, Thiên Hình trong tử vi): chỉ dùng trong thân bài, dạng "Truyền thống gọi hướng này là *Tuyệt Mệnh*, nghĩa là …". **Không** dùng trong tiêu đề, meta description, nút bấm, thông báo, ảnh chia sẻ.

---

## 4. Bảng xếp hạng công cụ

### 4.1. Công thức

**Điểm = N × M × B ÷ C** (tối đa 125). Mọi điểm là `[SUY LUẬN]`, vì chưa có search volume.

| Hệ số | Thang 1–5 | Cách chấm |
|:--|:--|:--|
| **N** Nhu cầu | Từ "Phổ biến" ở 07b: ≥ 10 trang → 5; 7–9 → 4; 5–6 → 3; 3–4 → 2; ≤ 2 → 1. Cộng 1 nếu có bằng chứng 03 hoặc từ khóa đã có trong 04 mục 5.2 | Search volume `[CHƯA KIỂM]`: chấm lại sau Keyword Planner |
| **M** Kiếm tiền | Cột KT của 07b | — |
| **B** Hợp thương hiệu | 5 = tất định, không thể hù dọa; 3 = cần mẫu câu trung tính; **1 = phủ quyết** | B = 1 thì **không làm**, bất kể điểm |
| **C** Chi phí | ≤ 8 giờ → 1; 9–20 → 2; 21–40 → 3; 41–80 → 4; > 80 → 5 | Giờ ở 07b `[GIẢ ĐỊNH]` |

### 4.2. Bảng điểm

| # | Công cụ (mã 07b) | N | M | B | Giờ | C | **Điểm** | Rủi ro chính | Tầng |
|:-:|:--|:-:|:-:|:-:|:-:|:-:|:-:|:--|:-:|
| 1 | Từ điển 12 cung (C5) | 2 | 3 | 5 | 6 | 1 | **30,0** | Thấp | Trước Tết → P1 |
| 2 | Từ điển 14 chính tinh (C4 đợt 1) | 4 | 3 | 5 | 14 | 2 | **30,0** | Thấp; thông tin sách nguồn chưa đủ (3.1) | Trước Tết → P1 |
| 3 | Đổi ngày âm–dương (A1) | 5 | 1 | 5 | 6 | 1 | **25,0** | Thấp | P1 |
| 4 | Xem tuổi làm ăn (F4) — *chỉ làm sau F1* | 2 | 3 | 4 | 8 | 1 | **24,0** | Dùng lại engine F1 nên rẻ | P2 |
| 5 | Mệnh theo năm sinh + 60 hoa giáp bản ngắn (B2 + B1 ngắn + A7, B4, G4) | 4 | 2 | 5 | 17 | 2 | **20,0** | Màu hợp mệnh không được dẫn tới bán đồ | P1 |
| 6 | Từ điển ~100 phụ tinh (C4 đợt 2) — *sau đợt 1* | 4 | 3 | 5 | 31 | 3 | **20,0** | Thấp | P1 (tràn sang Quý 2) |
| 7 | Thần số: số chủ đạo (J1) | 4 | 3 | 3 | 14 | 2 | **18,0** | Không có cơ sở khoa học → ghi rõ | P1 |
| 8 | Lịch ngày, tháng, năm + giờ hoàng đạo + đếm ngược (A2, A3, A6, E2) | 5 | 2 | 5 | 26 | 3 | **16,7** | R-i (5.844 trang) | P1 |
| 9 | Xem tuổi vợ chồng (F1) | 4 | 4 | 3 | 30 | 3 | **16,0** | Đ: phán chia tay (03 `#75, #86`) | P1 |
| 10 | Xông đất 2028 (F5) | 4 | 2 | 4 | 10 | 2 | **16,0** | Thấp | P2 (đăng trước 11/2027) |
| 11 | Ngày tốt theo việc (E1) | 5 | 4 | 3 | 60 | 4 | **15,0** | Đ: "ngày đại hung"; nhiều hệ | P1 có điều kiện / P2 |
| 12 | Chọn ngày cá nhân trả phí (E6) — *sau E1* | 2 | 5 | 3 | 20 | 2 | **15,0** | Cần E1 trước | P2 |
| 13 | Tử vi năm theo tuổi, Tết 2028 (C9) | 5 | 4 | 3 | 60 | 4 | **15,0** | R-i; phải ghi "chỉ theo năm sinh" | P2 (Quý 3) |
| 14 | Xem tuổi làm nhà (F2) | 3 | 3 | 3 | 12 | 2 | **13,5** | Kim lâu, Hoang ốc dễ hù | P2 |
| 15 | Bát trạch + hướng nhà (G1, G2) | 4 | 2 | 3 | 18 | 2 | **12,0** | Thuật ngữ "Tuyệt Mệnh, Ngũ Quỷ" | P2 |
| 16 | Sao tại cung 168 mục (C6) | 3 | 3 | 4 | 40 | 3 | **12,0** | R-i | P2 |
| 17 | Cách cục (C7) | 2 | 3 | 4 | 20 | 2 | **12,0** | Thấp | P2 |
| 18 | Từ điển 12 con giáp (B3) | 3 | 1 | 4 | 6 | 1 | **12,0** | Thấp | P2 |
| 19 | Hợp hai lá số tử vi (C8) | 2 | 4 | 4 | 30 | 3 | **10,7** | Đ: không phán chia tay | P1 (theo 04: Gói 3, Quý 2/2027) |
| 20 | Nguồn + phương pháp (R5) | 1 | 2 | 5 | 6 | 1 | **10,0** | Thấp | **Trước Tết** (nền E-E-A-T) |
| 21 | Ngày lễ âm lịch (A5) | 2 | 1 | 5 | 6 | 1 | **10,0** | Thấp | P2 |
| 22 | 60 hoa giáp bản đầy đủ (B1) | 2 | 2 | 5 | 20 | 2 | **10,0** | Thấp | P2 |
| 23 | Xem tuổi sinh con (F3) | 3 | 3 | 2 | 10 | 2 | **9,0** | Đ | P2 |
| 24 | Lá số bát tự (D1) | 2 | 3 | 4 | 30 | 3 | **8,0** | Thấp | P2 |
| 25 | Văn khấn tự điền (P2) | 2 | 1 | 4 | 6 | 1 | **8,0** | R-f: không lưu tên, địa chỉ | P2 |
| 26 | Tam tai, Kim lâu, Hoang ốc (B6, trong F1/F2) | 2 | 2 | 2 | 6 | 1 | **8,0** | Đ, T | P2 |
| 27 | Xuất hành đầu năm (E5) | 2 | 1 | 4 | 6 | 1 | **8,0** | Thấp | P2 |
| 28 | Thần số mở rộng (J2–J4) | 2 | 3 | 3 | 24 | 3 | **6,0** | Như J1 | P2 |
| 29 | Kinh Dịch 64 quẻ + gieo quẻ (H1, H3) | 3 | 2 | 4 | 43 | 4 | **6,0** | Bản quyền bản dịch | P2 |
| 30 | Văn khấn + mâm cúng (P1, P4) | 4 | 1 | 4 | 28 | 3 | **5,3** | Bản quyền sách văn khấn | P2 |
| 31 | Cung hoàng đạo: tra + từ điển (K1, K2) | 3 | 1 | 4 | 23 | 3 | **4,0** | Thấp | P2 |
| 32 | Thập thần, thần sát (D2) | 1 | 2 | 4 | 15 | 2 | **4,0** | Thấp | P2 |
| 33 | Phong tục đời người (P3) | 2 | 1 | 4 | 25 | 3 | **2,7** | Thấp | P2 |
| 34 | 24 tiết khí (A4) | 1 | 1 | 5 | 12 | 2 | **2,5** | Thấp | P2 (rẻ, nền cho D1) |

Ghi chú: dòng 4, 6, 12 điểm cao vì dùng lại việc làm trước (F1, C4 đợt 1, E1). Thứ tự làm theo phụ thuộc, không theo điểm thuần. Dòng 19 (C8) điểm thấp hơn nhưng vẫn ở P1 vì 04 đã hẹn Gói 3 vào Quý 2/2027.

### 4.3. Năm công cụ P1 đáng làm nhất (sau Tết 2027, Quý 1–2)

| # | Công cụ | Vì sao |
|:-:|:--|:--|
| 1 | **Từ điển tử vi: 12 cung + 114 sao** (C5, C4) | Điểm cao nhất. Gắn thẳng vào lá số đang bán (mỗi sao bấm được). Trả lời đúng lời chê "không hiển thị đủ các sao" (03 `#22`). Có sẵn kho luận giải. Bắt đầu nhỏ trước Tết (mục 6) |
| 2 | **Lịch âm: đổi ngày + trang ngày/tháng/năm** (A1–A3) | 11/17 đối thủ có, P3 dùng hằng ngày (03 chủ đề 3, 12 câu). Engine Meeus đã khớp 108/108 Tết (05b). Rẻ nhất trên mỗi trang SEO |
| 3 | **Tra mệnh theo năm sinh + 60 hoa giáp** (B2, B1) | Có ranh giới Tết/Lập Xuân thật (dữ liệu khác nhau từng năm, không phải trang mỏng). Đầu vào cho xem tuổi |
| 4 | **Xem tuổi vợ chồng / hợp đôi** (F1 + C8) | P4 của 03 (12 câu), mở đường Gói 3 299k của 04 (Quý 2/2027). Co–Star, Pattern, Linghit "合婚" đều bán hợp đôi |
| 5 | **Thần số học: số chủ đạo** (J1) | 7/17 đối thủ, hợp người trẻ (P1). Công thức tất định, 14 giờ |

Dự phòng số 6: **Ngày tốt theo việc** (E1). Lên P1 thay cho số 5 **nếu** 20 phỏng vấn của 03 cho tín hiệu P4 (≥ 8/20 lần chi gần nhất là xem tuổi/xem ngày, 03 mục 6).

### 4.4. Không làm, có lý do

| Công cụ | Điểm (để tham khảo) | Lý do |
|:--|:-:|:--|
| **Giải mộng ra con số** (O2) | 4×2×1÷2 = 4 | **Phủ quyết, loại vĩnh viễn.** Cờ bạc (07b R-d, R-h). Đối thủ đưa cặp số hai chữ số (07a 1.1, 1.8, 1.10) |
| Giải mộng dạng ý nghĩa (O1) | 4×1×2÷4 = 2 | Vùng từ khóa bị trang nhà cái chiếm; ít nguồn chuẩn. Không làm 2027 |
| **Xem sao hạn → dâng sao, văn khấn giải hạn** (B7, P5) | 3×1×1÷1 = 3 | **Phủ quyết.** Trái 04 mục 3.4; R-a, R-b, R-c |
| **Vật phẩm, bùa, linh phù** (G7) | 2×5×1÷3 = 3,3 | **Phủ quyết.** 04 mục 3.4; ví dụ Linghit (07a 2.12) |
| Sim, biển số phong thủy (G6) | 2×2×1÷2 = 2 | Phủ quyết: gắn bán sim "số đẹp", gần "số may mắn" |
| Tử vi 12 con giáp hằng ngày, horoscope ngày (C10, K5) | 5×2×2÷4 = 5 | Văn chung chung "như AI" (03 `#14–#22`); viết hằng ngày → R-i; 1 người không kham |
| Tử vi trọn đời theo năm sinh (C11) | 4×3×1÷3 = 4 | Phủ quyết: phán trọn đời chỉ theo năm sinh, trái "căn cứ" |
| Đọc ảnh mặt, chỉ tay (M2) | 2×3×1÷4 = 1,5 | Phủ quyết: dữ liệu sinh trắc (R-f), định kiến ngoại hình |
| Tính trùng tang, ngày an táng (E3) | 2×2×1÷2 = 2 | Phủ quyết: người đang tang dễ tổn thương |
| Chọn giờ sinh mổ (E4) | 1×2×1÷2 = 1 | Phủ quyết: quyết định y khoa |
| Tư vấn 1-1, chợ thầy (R4) | 3×5×2÷5 = 6 | Không kiểm được hù dọa; chi phí vận hành liên tục. Xét lại sau 2027 |
| Xin xăm (I1) | 3×1×2÷3 = 2 | Ngẫu nhiên + gắn đền cụ thể; bản quyền bản dịch xăm `[CHƯA KIỂM]` |
| Human Design (Q1) | 1×3×2÷5 = 1,2 | 0/17 trang Việt; quyền thuật ngữ `[CHƯA KIỂM]`; tốn 80 giờ |
| Bói vui, nhịp sinh học, cân xương, nốt ruồi, chữ ký (R1, R2, D4, M3, M4) | ≤ 3 | Loãng "bách khoa", nhiều câu phán số phận |

---

## 5. Mô hình kiếm tiền cho bách khoa

### 5.1. Ba tầng

| Tầng | Gồm gì | Giá | Đối chiếu 04 và đối thủ |
|:--|:--|:--|:--|
| **Miễn phí tra cứu** | Mọi công cụ TĐ/BT, mọi mục từ điển, bài, nguồn. Không bắt đăng ký | 0đ | Đúng 04 mục 3.1. Đối thủ Việt cũng miễn phí phần này (07a mục 4) |
| **Trả phí luận giải sâu (một lần)** | Gói 2 Lá số chuyên sâu + Vận 2027 | **149.000đ** | **04, mở bản Tết** |
| | Gói 1 Vận năm | **79.000đ** | 04, sau Tết |
| | Gói 3 Gia đình (3 lá số + 1 cặp so hợp) | **299.000đ** | 04, Quý 2/2027. **Công cụ F1, C8 là cửa vào miễn phí của gói này** |
| | Vận năm theo ngày sinh (không giờ sinh) | 49.000–79.000đ | 04 mục 3.1, có điều kiện (≥ 10/20 không biết giờ sinh) |
| | **Mới — Chọn ngày cho một việc lớn** (E6) | **99.000đ/việc** `[GIẢ ĐỊNH]` | Neo: Lịch Việt "Chọn ngày tốt" 25.000đ/7 ngày, 135.000đ/3 tháng, 280.000đ/năm (07a 1.8); thầy 100–300k (03 P4). Bán theo **việc**, không theo thời hạn |
| | **Mới — Thêm câu hỏi** | 8 câu **29.000đ** `[GIẢ ĐỊNH]` | Neo: Chợ Tử Vi 20.000đ = 8 câu (07a 1.5); Co–Star "10 Questions" $4.99 (07a 2.3). Chi phí AI 8 lượt hỏi ~1.935đ ở 3.5 Flash-Lite (04 mục 4.1, phần hỏi đáp) |
| | **Mới — Báo cáo thần số năm** (J3) | **49.000đ** `[GIẢ ĐỊNH]` | Neo: Lịch Việt "Giải mã ngày sinh 7 ngày" 30.000đ; numerology.com có "Annual Numerology Forecast" (không thấy giá) |
| **Hội viên** | "Thẻ năm" trả **một lần** qua VietQR, **không tự gia hạn**: Gói 1 vận năm mới + chọn ngày không giới hạn trong năm + 2 hồ sơ người thân | **299.000–399.000đ/năm** `[GIẢ ĐỊNH]` | Neo: Lịch Việt "Gói Nâng Cao Trọn Đời" 390.000đ; Vạn Niên Lịch 199.000đ/năm; 问真八字 $39.99/năm. **Chỉ mở khi** có ≥ 3 sản phẩm trả phí chạy ổn **và** D30 ≥ 12% (ngưỡng "TỐT" của 04 mục 5.5). Sớm nhất Quý 4/2027 |

### 5.2. Không dùng

| Cách | Lý do |
|:--|:--|
| Quảng cáo hiển thị năm 2027 | Mạng quảng cáo có thể chèn lễ, vật phẩm, cờ bạc vào trang (07a mục 4). P3 ghét quảng cáo (03 `#36, #41`). Doanh thu quảng cáo mỗi lượt xem ở Việt Nam `[CHƯA KIỂM]`. Xét lại khi có số liệu lượt xem thật |
| Xu, điểm, tiền ảo | Che giá thật (TVVN "Xu", Linghit "福币"). 04 mục 6.3 yêu cầu công khai tổng giá |
| Thuê bao tự gia hạn | 04 mục 3.3 đã quyết (VietQR không tự gia hạn; tránh kiểu Nebula) |
| Chữ "lễ", "lễ tùy tâm" cho thanh toán | Gần nghĩa lễ cúng (CTV, 07a 1.5) |
| Tư vấn theo phút | Mục 4.4 |

### 5.3. Đường đi của tiền (phễu)

`Từ khóa tra cứu` → `Mục từ điển / công cụ miễn phí` → `Lập lá số (bấm từ mục từ điển)` → `3 điểm miễn phí (04)` → `Gói 1 / Gói 2 / Gói 3`.

Chỉ số phải thêm vào 04 mục 5.5: **`Lá số tạo / lượt vào từ trang từ điển`**. Ngưỡng `[GIẢ ĐỊNH]`: ≥ 3% thì mở rộng từ điển; < 1% sau 90 ngày thì dừng mở mảng mới, chỉ giữ mảng đã có.

---

## 6. Tác động lên kế hoạch 90 ngày của 04

**Nguyên tắc: không thêm giờ.** Chỉ đổi nội dung của các ô "bài SEO" mà 04 mục 5.4 đã có sẵn:

- **T7** (01–07/01/2027): "Viết 2 bài SEO nền tảng" = **8 giờ**.
- **T8–T10** (08–28/01/2027): "2 bài SEO dài hạn/tuần (6h/tuần)" = **18 giờ**.
- Tổng **26 giờ**. Không đụng T1–T6 (R1, engine, thanh toán, R3) và T11–T13 (cao điểm Tết).

| Tuần | Việc (thay cho bài SEO) | Giờ | Tài sản dùng |
|:-:|:--|:-:|:--|
| T7 | Khuôn mục từ điển (9 khối, mục 2.3) + hub `/tu-dien` + schema `DefinedTermSet` + trang `/nguon` | 4 | — |
| T7 | 12 cung, đợt 1 (6 cung) | 4 | `luan-giai/cung-01-03.md`, `cung-04-06.md` |
| T8 | 12 cung, đợt 2 (6 cung) + 3 chính tinh | 6 | `cung-07-09.md`, `cung-10-12.md`, `menh-chinh-tinh.json` |
| T9 | 6 chính tinh | 6 | `menh-chinh-tinh.json` |
| T10 | 5 chính tinh còn lại + rà từ cấm toàn bộ | 6 | `tu-cam.json` + bảng mục 3.5 |
| **Tổng** | **12 cung + 14 chính tinh + khuôn + nguồn** | **26** | |

- **Trang `/phuong-phap`** (quy ước Nam Phái, giờ Tý, tháng nhuận) đã nằm trong 04 (từ khóa #15–17, ghi "làm ngay T4"). Không tính thêm giờ ở đây.
- **Vì sao chọn từ điển tử vi chứ không chọn lịch âm:** từ điển gắn trực tiếp vào lá số đang bán (mỗi sao bấm được), có thể giúp P2 tin hơn khi đang ở trang giá `[SUY LUẬN]`. Lịch âm cần giao diện lịch mới; để sau Tết.
- **Điều kiện chạy:** R1 = ĐẠT **và** qua cổng 08/01/2027. Nếu kích hoạt nhánh lùi của 04 → hoãn hết bảng trên.
- **Không đặt KPI SEO cho Tết 2027** (giữ đúng 04 N11). Mục tiêu là trang đã được index sẵn cho cả năm 2027 và Tết 2028.
- **Việc không được làm trước Tết:** công cụ có logic mới (xem tuổi, thần số, xem ngày), bộ trang sinh tự động lớn (5.844 trang lịch ngày), mọi nội dung AI viết hàng loạt.
- **Một điểm cần sửa ở 04:** từ khóa #20 ghi "Công cụ Hồ Ngọc Đức gắn CTA lập lá số". Theo 05a mục 4, mã Hồ Ngọc Đức chỉ cho dùng phi thương mại; công cụ đổi ngày phải chạy trên `am-lich.ts` (Meeus, 05b). Em không sửa 04, chỉ ghi lại để anh quyết.

### Lộ trình 2027 (sau Tết)

| Thời gian | Việc | Gắn với 04 |
|:--|:--|:--|
| 19/02 – 31/03 | P1: lịch âm (A1–A3), mệnh theo năm sinh (B2), ~100 phụ tinh (C4 đợt 2) | Song song mở Gói 1 79k |
| Quý 2 | P1: xem tuổi vợ chồng (F1), hợp hai lá số (C8), thần số (J1). E1 nếu có tín hiệu P4 | Mở Gói 3 299k, Referral |
| Quý 3 | P2: tử vi năm theo tuổi cho Tết 2028 (C9), xem ngày + chọn ngày trả phí (E1, E6), sao tại cung (C6), Bát trạch (G1, G2) | Chuẩn bị mùa Tết 2028 |
| Quý 4 | P2: xông đất 2028 (F5), xuất hành (E5), văn khấn Tết (P1, P4), Kinh Dịch (H1, H3), bát tự (D1). Xét "thẻ năm" | Mùa Tết 2028 |

---

## 7. Rủi ro lớn nhất của hướng bách khoa và cách giữ

| # | Rủi ro | Biểu hiện | Cách giữ |
|:-:|:--|:--|:--|
| 1 | **Dàn trải** | 87 công cụ, ~750 mục biên tập (250–375 giờ `[GIẢ ĐỊNH]`), 1 người 28–30 giờ/tuần. Gói 1, Gói 3 bị chậm | (a) Tiền vẫn đến từ tử vi: **không mảng mới nào được làm chậm Gói 1 (sau Tết) và Gói 3 (Quý 2)**. (b) **Mỗi tháng tối đa 1 mảng mới.** (c) **Cổng 3 câu** trước khi thêm công cụ: có trong P1/P2 không? Có thuật toán kiểm thử được hoặc nguồn sách không? Có dẫn tới sản phẩm trả phí hoặc phục vụ persona đã kiểm (03) không? Thiếu một câu là không làm. (d) Sau 90 ngày, mảng nào có `Lá số tạo / lượt vào` < 1% thì ngừng đầu tư |
| 2 | **Chất lượng và SEO** | Trang mỏng hàng loạt bị coi là *Scaled content abuse* (07b R-i). Văn AI chung chung (03 `#14–#22`) | (a) Chỉ index trang có dữ liệu tính riêng hoặc nội dung biên tập riêng (mục 2.6). (b) AI chỉ viết nháp; người duyệt ký tên. (c) Mỗi mục từ điển ≥ 1 nguồn hạng 1 hoặc 2. (d) Mỗi tháng rà ngẫu nhiên 10% trang đã đăng |
| 3 | **Pháp lý** | Mê tín dị đoan (NĐ 38/2021, BLHS 320), cờ bạc (BLHS 321/322), lừa đảo (174), quảng cáo (Luật 75/2025), dữ liệu (Luật 91/2025), bản quyền bản dịch | (a) Ba thứ phủ quyết ở 4.4. (b) Bộ lọc từ cấm mục 3.5 chạy trước khi đăng và trên mọi đầu ra AI. (c) Luật sư duyệt mảng rủi ro Vừa trước khi mở. (d) Đọc văn bản gốc NĐ 38/2021 và BLHS 320–322 (hiện chỉ có bài tư vấn, `[CHƯA KIỂM]`). (e) Mỗi nguồn sách có trạng thái bản quyền |
| 4 | **Thương hiệu** | Tên miền có chữ "bói" nhưng định vị "minh bạch". Phần "khoa học nói gì" có thể làm người tin phật lòng. Mảng phong tục, văn khấn dễ trượt sang giải hạn | (a) Giọng tôn trọng, không chế giễu. (b) "Khoa học nói gì" ngắn, có nguồn, không kết luận thay người đọc. (c) Văn khấn chỉ có loại thường dùng (P1–P4); P5 phủ quyết |
| 5 | **Lượt xem không thành tiền** | P3 (lịch hằng ngày) chỉ chi 0–50.000đ/năm (03). Lịch ngày chiếm ~5.844/7.400 trang | (a) Đo `Lá số tạo / lượt vào` theo từng mảng. (b) Không lấy lượt xem làm mục tiêu; mục tiêu là đơn Gói 1/2/3 |
| 6 | **Người duyệt** | Không có chuyên gia; dễ ghi chức danh giả | (a) Ghi đúng vai: "biên tập", "duyệt học thuật". (b) Mời người P2 từ cộng đồng (04 mục 5.1 đã có kênh nhóm FB, Voz). (c) Không index mục chưa duyệt |

---

## 8. Việc cần anh Cường quyết

1. Duyệt 5 công cụ P1 ở mục 4.3 (hoặc đổi số 5 sang E1 sau 20 phỏng vấn).
2. Đồng ý đổi 26 giờ "bài SEO" T7–T10 sang từ điển tử vi (mục 6), có điều kiện R1 đạt.
3. Tên người biên tập hiển thị trên trang (tên thật hay bút danh).
4. Bổ sung đầy đủ tên sách "cụ Thiên Lương" (tên sách, năm, nhà xuất bản) để làm nguồn từ điển sao.
5. Xác nhận "xemvm" trong đề bài là trang nào (07a mục 0).
6. Ghi nhận điểm lệch ở 04 từ khóa #20 (Hồ Ngọc Đức → `am-lich.ts`).

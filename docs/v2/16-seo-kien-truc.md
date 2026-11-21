# 16 — Kiến trúc SEO toàn site xemboi.vn: sitemap, phân bổ từ khóa, chuẩn onpage, internal link

> Ngày lập: **21/11/2026**. Người lập: Claude (vai chuyên gia SEO), cho anh Cường.
> Tệp đi kèm: [`16-seo-trang.csv`](16-seo-trang.csv) (119 trang đơn + 32 mẫu trang lập trình/từ điển), [`16-quy-tac-gan-tu-khoa.json`](16-quy-tac-gan-tu-khoa.json) (quy tắc gán từng từ khóa vào trang, gồm nhóm LOẠI).
> Đầu vào: `tu-khoa/tom-tat-tu-khoa.md`, `tu-khoa/tat-ca-tu-khoa.csv` (đã đọc dòng 1–3.460 liền mạch, rồi lấy mẫu dòng 5.250–5.410, 8.965–10.740, 11.100–11.213), [`08`](08-tu-khoa-uu-tien.md), [`07`](07-bach-khoa-huyen-hoc.md) mục 2, 3, 4.4, [`07b`](07b-phan-loai-huyen-hoc.md), [`12`](12-thu-vien-rag.md) mục 3, `src/app/*` (route hiện có), sitemap thật của xemtuvi.vn (tải ngày 21/11/2026).
> Nhãn: `[KP]` = số Keyword Planner trong tệp. `[ƯỚC LƯỢNG]` = cộng tay từ `tom-tat`, chưa chạy script. `[GIẢ ĐỊNH]` = số tự đặt. `[SUY LUẬN]` = suy ra từ bằng chứng có dẫn. `[CHƯA KIỂM]` = chưa xác minh.

---

## 0. Kết luận trong 10 dòng

1. **Mô hình 4 tầng:** trang chủ → **11 hub P1–P2** (Tử vi, Lịch âm, Xem ngày, Xem tuổi, Can chi & mệnh, Bát tự, Phong thủy, Kinh Dịch, Thần số học, Chiêm tinh, Phong tục) + 4 hub P3 (Tarot, Đặt tên con, Human Design, Giải mộng) → trang công cụ và trang điều hướng → trang lá.
2. **Quy mô:** khoảng **1.610 trang được index**. Gồm 119 trang đơn, 768 mục từ điển viết theo khuôn và 723 trang lập trình. Có thêm **5.844 trang ngày âm lịch để `noindex`**, đúng như 08 đã quyết.
3. **Ba họ chiếm phần lớn lượng tìm:** lịch âm khoảng 11,9 triệu/tháng, "sinh năm X mệnh gì" khoảng 1,48 triệu và tử vi/lá số khoảng 1,6 triệu `[ƯỚC LƯỢNG]`. Cả ba đều nằm ở P1.
4. **Một ý định chỉ có một URL.** "lịch âm", "lịch âm hôm nay", "âm lịch hôm nay", "lịch âm dương", "lịch âm tháng này" đều về **`/lich-am`**. Quy tắc đầy đủ ở mục 5.2.
5. **Nhóm LOẠI có 17 lý do** (cờ bạc, giải hạn, sim/biển số, nốt ruồi, bói theo tên, thương hiệu đối thủ, tin rác…), tổng khoảng 0,6–0,7 triệu/tháng `[ƯỚC LƯỢNG]`. Không đặt trang cho nhóm này.
6. **Tỷ lệ phủ ước tính khoảng 97–99%** tổng lượng tìm của các từ khóa không bị loại `[ƯỚC LƯỢNG]`. Số chính xác chờ chạy script (mục 11).
7. **Internal link có 26 quy tắc máy thực thi được** (mục 7). Lực liên kết dồn về `/tu-vi/lap-la-so`, nơi bán Gói 2. Mọi trang index nằm cách trang chủ tối đa 3 cú nhấp.
8. **Kỹ thuật:** tách sitemap theo loại trang. 301 từ xemtuvi.vn (13 trang tĩnh + 158 bài, đã đọc sitemap thật) và từ các route cũ của xemboi. **Hai lỗi đang có:** `src/app/sitemap.ts` còn khai báo 204 URL sắp bỏ; `/la-so/<slug>` đang cho index trang chứa ngày sinh người dùng.
9. **Thứ tự 7 đợt** theo 08 mục 5.2. Riêng **đợt 1 (lịch, 2/2027)** đã phủ khoảng 65% tổng lượng tìm.
10. **Ba quyết định lớn cần anh duyệt:** gộp mọi truy vấn "lịch âm…" về `/lich-am` và mở ngay ở đợt 1 (lệch 08 #16); trang `/boi-tinh-yeu` theo ngày sinh (cụm 500K); hợp nhất xemtuvi.vn và xử lý URL lá số cá nhân. Chi tiết ở mục 10.

---

## 1. Giới hạn của bản thiết kế này

| Giới hạn | Ảnh hưởng | Cách xử lý |
|:--|:--|:--|
| Lượng tìm KP là **khoảng làm tròn** (10, 50, 500, 5.000…), là trung bình 12 tháng (08 mục 2.1) | Mọi tổng ở đây chỉ để so sánh tương đối | Ghi `[ƯỚC LƯỢNG]`. Số chính xác lấy từ script ở mục 11 |
| **1.846 cụm "xem…/xông…" không có số KP** (08 mục 2.3) | Nhóm xem tuổi, xem ngày bị đánh giá thấp trong tỷ lệ phủ | Vẫn gán trang cho nhóm này (quy tắc JSON). Đo lại bằng Search Console sau khi lên trang |
| **Chưa chạy script gán.** Em không có Bash | Tỷ lệ phủ là ước lượng | Claude Code chạy theo mục 11, báo phần chưa gán để em chỉnh vòng 2 |
| Độ khó tra từ Mỹ, không phải Google.com.vn (08 mục 2.4) | Thứ tự ưu tiên có thể đổi | Tra lại 10 cụm đầu bằng `gl=vn` trước khi viết `[CHƯA KIỂM]` |
| Số trang xemtuvi.vn `/la-so-tu-vi/*`: sitemap dài khoảng 166 nghìn ký tự, công cụ chỉ đọc được 100 nghìn ký tự đầu | Chưa biết chính xác số URL lá số cá nhân | `[CHƯA KIỂM]`. Ước khoảng 2–3 nghìn URL `[ƯỚC LƯỢNG]`. Cần tải đủ sitemap |

---

## 2. Nguyên tắc kiến trúc

1. **Từ ngoài vào trong:** trang chủ → hub mảng → trang công cụ/điều hướng cụm → trang lá. Trang lá chỉ trả lời một ý định hẹp.
2. **Một ý định một URL.** Từ khóa chính của trang này không được là từ khóa phụ của trang khác (mục 5.2).
3. **Công cụ trước, bài sau.** Ở các cụm mà bài vệ tinh của chuỗi bán lẻ đang chiếm top (mệnh, màu, cung hoàng đạo, văn khấn), chỉ vượt được bằng công cụ hoặc bằng chiều sâu có nguồn (08 mục 4, điểm 2).
4. **Chỉ index trang có dữ liệu riêng hoặc biên tập riêng** (07 mục 2.6, chống *scaled content abuse*). Trang chỉ khác nhau vài con số thì gộp hoặc `noindex`.
5. **URL:** chữ thường, không dấu, gạch ngang, không dấu `/` cuối. Giữ `/tu-vi-2027` và `/kien-thuc`. Mẫu URL bám 07 mục 2.5, có 3 điều chỉnh:
   - Trang theo mùa dùng **URL cố định**: `/tet`, `/xem-tuoi/xong-dat`, `/xem-ngay/xuat-hanh`, `/tu-vi-theo-tuoi` (08 mục 7.1).
   - Trang lá theo năm giữ năm trong URL vì truy vấn luôn ghi năm: `/lich-am/2027`, `/tu-vi-2028/tuoi-at-hoi-nam`.
   - `/boi-tinh-yeu` nằm ở cấp gốc để URL chứa đúng từ khóa, nhưng breadcrumb thuộc hub Xem tuổi.
6. **Độ sâu tối đa 3 cú nhấp** từ trang chủ tới mọi trang index. Bộ trang lớn (101 năm sinh, 64 quẻ, 168 sao tại cung) phải có **trang chỉ mục liệt kê đủ**.

---

## 3. Cây sitemap (từ ngoài vào trong)

Ký hiệu: **[CC]** công cụ · **[ĐH]** điều hướng · **[TĐ]** từ điển · **[BV]** bài viết · **[LT]** lập trình · **[MV]** mùa vụ · `×N` số trang sinh · (P1/P2/P3) ưu tiên.

- **Tầng 0 — `/` Trang chủ** (P1). Từ khóa: "xem bói".
  - **Tầng 1 — Hub Tử vi `/tu-vi`** (P1). Từ khóa: "tử vi".
    - [CC] `/tu-vi/lap-la-so`: lá số tử vi (P1, **trang tiền số 1**)
    - [CC] `/tu-vi/luan-giai`: trang bán Gói 2 (P1)
    - [CC] `/tu-vi-2027`: R1 đang chạy (P1)
    - [CC] `/tu-vi/tron-doi`: lá số trọn đời (P1)
    - [CC] `/tu-vi/hop-la-so`: C8, Gói 3 (P1, Q2)
    - [BV] `/tu-vi/cach-doc-la-so` (P1)
    - [ĐH] `/tu-vi/cung` → [TĐ] `/tu-vi/cung/{cung}` ×12 (P1)
    - [ĐH] `/tu-vi/sao` (ma trận sao × cung)
      - [TĐ] `/tu-vi/sao/{chinh-tinh}` ×14 (P1)
        - [TĐ] `/tu-vi/sao/{sao}/{cung}` ×168 (P3, chỉ index khi đã duyệt)
      - [TĐ] `/tu-vi/sao/{phu-tinh}` ×~100 (P2)
    - [TĐ] `/tu-vi/tu-hoa` (P2) · [TĐ] `/tu-vi/cach-cuc/{cach}` ×~30 (P3)
    - [ĐH] `/tu-vi-theo-tuoi` (P2) → [LT] `/tu-vi-{yyyy}/tuoi-{can}-{chi}-{nam|nu}` ×120 mỗi năm (P2)
  - **Hub Lịch âm `/lich-am`** (P1). Từ khóa: "lịch âm", "lịch âm hôm nay", "âm lịch hôm nay", "lịch âm dương".
    - [CC] `/lich-am/doi-ngay` · [CC] `/lich-am/lich-van-nien` · [CC] `/lich-am/ngay-mai` (P1)
    - [CC] `/lich-am/gio-hoang-dao` (P2)
    - [LT] `/lich-am/{yyyy}` ×16 (P1)
      - [LT] `/lich-am/{yyyy}/{mm}` ×192 (P1)
        - [LT] `/lich-am/{yyyy}/{mm}/{dd}` ×5.844 (**noindex**)
    - [ĐH] `/tiet-khi` → [TĐ] `/tiet-khi/{tiet}` ×24 (P2)
    - [ĐH] `/lich-am/ngay-le` → [MV] rằm tháng Giêng, vía Thần Tài, rằm tháng 7, Trung thu + ×15 lễ khác (P2)
    - [MV] `/tet` (P1, gói Tết)
  - **Hub Xem ngày `/xem-ngay`** (P2). Từ khóa: "ngày tốt".
    - [CC] `/xem-ngay/{cuoi-hoi|khai-truong|dong-tho|nhap-trach|mua-xe|cat-toc}` ×6 (P2)
    - [MV] `/xem-ngay/xuat-hanh` (P1, gói Tết)
    - [CC] `/xem-ngay/chon-ngay`: E6 trả phí (P2)
    - [LT] `/xem-ngay/thang-{mm}-{yyyy}` ×24 · [LT] `/xem-ngay/{viec}/thang-{mm}-{yyyy}` ×192 (P2)
  - **Hub Xem tuổi `/xem-tuoi`** (P1). Từ khóa: "xem tuổi".
    - [CC] `/xem-tuoi/vo-chong` (P1) · [CC] `/boi-tinh-yeu` (P1, **cần anh duyệt**)
    - [MV] `/xem-tuoi/xong-dat` (P1, gói Tết)
    - [CC] `/xem-tuoi/lam-nha` · `/xem-tuoi/lam-an` (P2) · [BV] `/xem-tuoi/sinh-con` (P3)
    - [TĐ] `/xem-tuoi/{kim-lau|tam-tai|hoang-oc|nam-tuoi}` (P2)
    - [ĐH] `/xem-tuoi/con-giap` → [LT] `/xem-tuoi/{chi-a}-va-{chi-b}` ×78 (P2)
  - **Hub Can chi & mệnh `/can-chi`** (P1).
    - [ĐH] `/sinh-nam` → [LT] `/sinh-nam/{yyyy}` ×101, 1930–2030 (P1, **họ lớn thứ 2**)
    - [ĐH] `/can-chi/60-hoa-giap` → [TĐ] `/can-chi/{can}-{chi}` ×60 (P1)
    - [ĐH] `/nap-am` → [TĐ] `/nap-am/{ten}` ×30 (P1)
    - [TĐ] `/ngu-hanh` (P1)
      - [TĐ] `/ngu-hanh/{hanh}` ×5 (P1)
      - [TĐ] `/ngu-hanh/mau-hop-menh` (P1)
    - [ĐH] `/con-giap` → [TĐ] `/con-giap/{chi}` ×12 (P1)
    - [TĐ] `/can-chi/thien-can/{can}` ×10 (P2)
  - **Hub Bát tự `/bat-tu`** (P1, 6/2027).
    - [CC] `/bat-tu/lap-la-so` (P1)
    - [BV] `/bat-tu/ngu-hanh-khuyet` (P2) · [BV] `/bat-tu/dung-than` (P3)
    - [TĐ] `/bat-tu/thap-than/{than}` ×10 (P2)
  - **Hub Phong thủy `/phong-thuy`** (P2).
    - [CC] `/phong-thuy/cung-phi` → [TĐ] `/phong-thuy/cung-phi/{cung}` ×8
    - [TĐ] `/phong-thuy/bat-trach` · [CC] `/phong-thuy/huong-nha` · [CC] `/phong-thuy/thuoc-lo-ban` (P3)
  - **Hub Kinh Dịch `/kinh-dich`** (P2, mảng mới đầu Q3).
    - [CC] `/kinh-dich/gieo-que`: nhận cụm "quẻ" 500K
    - [ĐH] `/kinh-dich/64-que`
      - [TĐ] `/kinh-dich/que/{nn}-{ten}` ×64
      - [TĐ] `/kinh-dich/bat-quai/{quai}` ×8
    - [CC] `/kinh-dich/mai-hoa-dich-so` · `/kinh-dich/luc-hao` (P3)
  - **Hub Thần số học `/than-so-hoc`** (P2).
    - [CC] `/than-so-hoc/so-chu-dao` → [TĐ] `/than-so-hoc/so-chu-dao/{n}` ×12
    - [CC] `/than-so-hoc/theo-ten` · [CC] `/than-so-hoc/bieu-do-ngay-sinh` · [TĐ] `/than-so-hoc/nam-ca-nhan/{n}` ×9
  - **Hub Chiêm tinh `/chiem-tinh`** (P2).
    - [CC] `/chiem-tinh/ban-do-sao`: nhận cụm 500K, chỉ mở khi giấy phép ephemeris rõ · [CC] `/chiem-tinh/ban-do-sao-doi` (P3)
    - [ĐH + CC] `/chiem-tinh/cung-hoang-dao` → [TĐ] `/chiem-tinh/cung-hoang-dao/{cung}` ×12
    - [TĐ] `/chiem-tinh/hanh-tinh/{x}` ×10 · `/chiem-tinh/nha/{n}` ×12 (P3)
  - **Hub Phong tục `/phong-tuc`** (P2, chỉ mở sau khi kiểm bản quyền và luật sư duyệt).
    - [ĐH] `/van-khan` → [BV/MV] `/van-khan/{dip}` ×21: mùng 1 và ngày rằm, Thần Tài, gia tiên, rằm tháng 7, cúng chúng sinh, ông Công ông Táo, Tết, rằm tháng Giêng, rằm tháng 8, giỗ, tuần và 49 ngày, bao sái, an vị, phóng sinh, lễ chùa, đền phủ, nhập trạch, động thổ, khai trương, đầy tháng, xe mới
    - [BV] `/phong-tuc/cung-duong` · [BV] `/phong-tuc/xin-xam` (P3, **cần anh duyệt**)
  - **Hub P3 (sau 2027):** `/boi-bai` (+78 lá) · `/dat-ten-con` · `/human-design` · `/giai-mong` (+~30 chủ đề, **cần anh duyệt**) · bài `/kien-thuc/nhan-tuong-hoc`.
  - **Trang nền (tầng 1):**
    - `/phuong-phap` (+5 trang: Nam/Bắc phái, giờ Tý, tháng nhuận, chuẩn biên tập, người duyệt)
    - `/nguon` (+~35 sách)
    - `/tu-dien` (A–Z, +`/tu-dien/cuu-dieu`)
    - `/kien-thuc` (+4 bài nền)
    - `/goi` (bảng giá)

### 3.1. Đếm trang

| Nhóm | Số trang | Index? |
|:--|--:|:--|
| Trang đơn (hub, công cụ, điều hướng, bài, mùa vụ) | **119** | Có. P3 chỉ index khi đã có người duyệt |
| Mục từ điển theo khuôn (24 bộ) | **768** | Có, khi đủ 9 khối và có người duyệt (07 mục 2.3) |
| Trang lập trình (7 mẫu) | **723** | Có, khi qua cổng chống trang mỏng (mục 4) |
| Trang ngày âm lịch | 5.844 | **Không** (`noindex,follow`, không vào sitemap) |
| **Tổng được index** | **≈ 1.610** | Trong đó **P1 ≈ 520 trang** (43 trang đơn + 477 trang từ bộ) |

Phần biên tập tay gồm 119 trang đơn và 768 mục từ điển, tổng 887 trang. Với 20–30 phút mỗi mục từ điển `[GIẢ ĐỊNH, 07 mục 2.6]`, đây vẫn là việc của cả năm 2027.

---

## 4. Trang sinh hàng loạt: công thức và cổng chống trang mỏng

| page_id | Công thức URL | Số trang | Dữ liệu riêng mỗi trang (điều kiện index) | Index |
|:--|:--|--:|:--|:--|
| CC-SINHNAM | `/sinh-nam/{yyyy}`, yyyy ∈ 1930…2030 | 101 | Ngày Tết năm đó và năm sau, Lập Xuân, ranh giới tuổi, can chi, nạp âm, cung phi nam/nữ, các năm Kim lâu và Tam tai của người đó | Có |
| LICH-NAM | `/lich-am/{yyyy}`, 2020…2035 | 16 | Ngày Tết, tháng nhuận, 24 tiết khí năm đó, ngày lễ | Có |
| LICH-THANG | `/lich-am/{yyyy}/{mm}` | 192 | Lưới ngày âm dương, tiết khí, lễ trong tháng | Có |
| LICH-NGAY | `/lich-am/{yyyy}/{mm}/{dd}` | 5.844 | Can chi ngày, giờ hoàng đạo, trực | **noindex** (08 mục 6). Xét lại sau 90 ngày đo Search Console |
| XN-THANG | `/xem-ngay/thang-{mm}-{yyyy}`, 2027–2028 | 24 | Bảng ngày theo 3 hệ | Có |
| XN-VIEC-THANG | `/xem-ngay/{viec}/thang-{mm}-{yyyy}`, 8 việc × 12 × 2 | 192 | Danh sách ngày đạt ngưỡng cho việc đó | Có nếu có ≥ 1 ngày đạt hoặc có đoạn giải thích riêng; nếu không thì `noindex` |
| XT-CAP | `/xem-tuoi/{chi-a}-va-{chi-b}`, a ≤ b theo thứ tự Tý → Hợi | 78 | Quan hệ địa chi, đoạn biên tập ngắn | Có. URL đảo thứ tự thì 301. 1.830 cặp hoa giáp: chỉ là kết quả công cụ, `noindex` |
| TUVI-NAM-TUOI | `/tu-vi-{yyyy}/tuoi-{can}-{chi}-{nam\|nu}` | 120/năm | Biên tập theo khuôn, ghi rõ "chỉ theo năm sinh" | Có (C9) |

**Cổng chống trang mỏng.** Backend kiểm cổng này trước khi bật `index` và đưa trang vào sitemap:
- (a) Có ≥ 3 trường dữ liệu tính riêng cho trang.
- (b) Có ≥ 250 từ không lặp nguyên văn với trang anh em `[GIẢ ĐỊNH]`. Đo bằng shingle 5 từ, trùng ≤ 60%.
- (c) Có `reviewedBy` và `lastReviewed`.
- (d) Có ≥ 3 liên kết vào từ trang đã index.

Trượt một điều kiện thì trang mang `noindex,follow`.

---

## 5. Phân bổ từ khóa

### 5.1. Lượng tìm theo mảng và trang nhận `[ƯỚC LƯỢNG từ tom-tat-tu-khoa.md]`

| Mảng | Trang nhận chính | Lượng tìm/tháng | Ghi chú |
|:--|:--|--:|:--|
| Lịch âm | `/lich-am`, đổi ngày, vạn niên, năm, tháng, ngày mai, giờ hoàng đạo | ~11,9 triệu | "lịch âm" 10,77 tr; "âm lịch" 0,58 tr; "lịch vạn" 0,52 tr; "giờ hoàng" 71K |
| Mệnh theo năm sinh + ngũ hành + con giáp | `/sinh-nam/{yyyy}`, `/ngu-hanh*`, `/con-giap/*` | ~1,7 triệu | 28 năm ở mức 50K, 13 năm ở mức 5K; "ngũ hành" sau khi trừ "ngũ hành sơn" ~115K |
| Tử vi + lá số | `/tu-vi`, `/tu-vi/lap-la-so`, trọn đời, 2027, từ điển | ~1,5 triệu | Sau khi trừ thương hiệu (~0,19 tr) và tử vi hằng ngày (~0,08 tr) |
| Bói tình yêu (theo ngày sinh) | `/boi-tinh-yeu` | ~0,51 triệu | Đã trừ phần theo tên ~70K (LOẠI) |
| Kinh Dịch + gieo quẻ | `/kinh-dich*` | ~0,7 triệu | "quẻ" 500K là phần lớn |
| Chiêm tinh + bản đồ sao + cung hoàng đạo | `/chiem-tinh*` | ~0,65 triệu | Đã trừ TFT và bói vui |
| Văn khấn + cúng | `/van-khan/*`, `/phong-tuc`, ngày lễ | ~0,5 triệu | "văn khấn" 376K; "cúng" 50K; "cúng rằm" 27K |
| Thần số học | `/than-so-hoc*` | ~0,17 triệu | — |
| Xem ngày, xem tuổi, kim lâu, tam tai | `/xem-ngay*`, `/xem-tuoi*` | ~0,2 triệu có số KP; **phần "xem…" không có số** | Bị đánh giá thấp (mục 1) |
| Bát tự | `/bat-tu*` | ~0,1 triệu | Đã trừ "tứ trụ việt nam" (nhiễu) |
| Phong thủy, hướng nhà | `/phong-thuy*` | ~0,06 triệu | Đã trừ thương hiệu |
| P3: tarot, đặt tên, giải mộng (nghĩa), xin xăm (bài), nhân tướng, HD | hub P3 | ~0,33 triệu | — |
| **Cộng phần được gán** | | **≈ 18,2 triệu** | |
| **LOẠI** (mục 5.3) | không đặt trang | **≈ 0,6–0,7 triệu** | |
| **Tổng tệp** | | **19.011.600** `[KP, tom-tat dòng 3]` | |

**Tỷ lệ phủ ước tính:** 18,2 / (19,0 − 0,65) ≈ **97–99%** `[ƯỚC LƯỢNG]`. Phần hụt nằm ở các cụm 50 lượt rời rạc mà regex chưa bắt. Vòng 2 sẽ xử lý.

### 5.2. Quy tắc chống ăn thịt từ khóa (cannibalization)

**Nguyên tắc chung:**
- **C1.** Mỗi trang có đúng 1 từ khóa chính. Từ khóa chính và từ khóa phụ của trang A không được xuất hiện trong title hoặc H1 của trang B.
- **C2.** Hai cụm cùng **kết quả trả lời** (cùng con số, cùng bảng) thì về một URL. Khác kết quả trả lời thì tách.
- **C3.** Truy vấn có **năm sinh cụ thể** (1930–2019 chắc chắn là năm sinh; 2020–2030 tùy ngữ cảnh) về `/sinh-nam/{yyyy}`. Có **hai năm sinh** về công cụ `/xem-tuoi/vo-chong`.
- **C4.** Truy vấn có **năm dương lịch đang diễn ra** (2024–2029) đi với *tam tai, kim lâu, hoang ốc, thái tuế, xông đất, làm nhà, màu hợp mệnh X* thì về trang khái niệm, vì trang đó có bảng theo năm. Không về `/sinh-nam`.
- **C5.** Trang theo dõi thực tế: nếu Search Console cho thấy 2 URL thay nhau xếp hạng cho cùng truy vấn quá 30% số ngày trong 28 ngày, gộp (301) URL yếu hơn vào URL mạnh hơn.

**Bảng quyết định cụ thể:**

| Truy vấn | Về đâu | Lý do |
|:--|:--|:--|
| lịch âm (5M) · lịch âm hôm nay (5M) · âm lịch hôm nay (500K) · lịch âm dương (500K) · lịch âm tháng này (50K) · hôm nay mùng mấy âm lịch · âm lịch hôm nay ngày bao nhiêu | **`/lich-am`** | Cùng câu trả lời: ngày âm hôm nay + lưới tháng hiện tại. Tách ra sẽ chia lực của ~11 triệu lượt cho 3–4 URL na ná nhau |
| lịch âm ngày mai (50K) · lịch âm mai | `/lich-am/ngay-mai` | Câu trả lời khác (ngày khác) |
| lịch vạn niên (500K) · lịch vạn sự · tải lịch vạn niên | `/lich-am/lich-van-nien` | Ý định: duyệt năm–tháng bất kỳ + thông tin vạn sự. Theo dõi theo C5 với `/lich-am` |
| lịch âm năm 2026 · lịch âm 2026 · lịch vạn niên năm 2026 · lịch âm năm nay | `/lich-am/2026` | Trang năm |
| lịch âm tháng 8 2026 · lịch âm tháng 8 (không ghi năm) | `/lich-am/2026/08` | Không ghi năm thì về tháng sắp tới gần nhất |
| đổi ngày dương sang âm · đổi ngày âm sang dương · lịch âm sang dương | `/lich-am/doi-ngay` | Công cụ đổi ngày |
| ngày tốt hôm nay · lịch âm hôm nay có đẹp không · ngày tốt xấu hôm nay và ngày mai | `/xem-ngay` | Hỏi **tốt xấu** thì về Xem ngày. Hỏi **ngày bao nhiêu** thì về Lịch |
| giờ hoàng đạo hôm nay · giờ hoàng đạo · giờ hoàng đạo là gì · giờ hoàng đạo ngày mai | `/lich-am/gio-hoang-dao` | Một công cụ có ô chọn ngày, H2 giải thích "là gì" |
| lá số tử vi (500K) · lập lá số tử vi · tử vi lá số · lá số tử vi online/miễn phí | `/tu-vi/lap-la-so` | Ý định dùng công cụ |
| tử vi (500K) · tử vi là gì | `/tu-vi` | Hub trả lời "là gì" và dẫn sang công cụ |
| lá số tử vi trọn đời · tử vi trọn đời · tử vi trọn đời tuổi X | `/tu-vi/tron-doi` | Bổ ngữ "trọn đời" là ý định riêng (08 #6). Trang này **không** nhắm "lá số tử vi" trần |
| tử vi 2027 · lá số tử vi 2027 | `/tu-vi-2027` | R1 |
| tử vi tuổi X năm 2027 nam/nữ mạng | `/tu-vi-2027/tuoi-…` (khi có) | Không về R1, vì R1 là lá số cá nhân |
| luận giải lá số tử vi · tử vi ai | `/tu-vi/luan-giai` | Ý định mua |
| 1985 mệnh gì · sinh năm 1985 · 1985 hợp màu gì · năm 1985 lấy vợ tuổi nào hợp · tam tai 1985 | `/sinh-nam/1985` | C3. Một trang mạnh cho mỗi năm thay vì 4–5 trang mỏng |
| năm 2027 là năm con gì · năm 2027 mệnh gì | `/sinh-nam/2027` | Cùng câu trả lời (Đinh Mùi, Thiên Hà Thủy) |
| tết 2027 · tết 2027 vào ngày nào · tết 2027 là năm con gì | `/tet` | Ý định là ngày Tết; trang dẫn sang `/sinh-nam/2027` |
| mệnh kim là gì · mệnh kim màu gì · màu hợp mệnh kim · mệnh gì sinh kim | `/ngu-hanh/kim` | Một hành một trang |
| màu hợp mệnh · màu đỏ hợp mệnh gì · màu hợp các mệnh | `/ngu-hanh/mau-hop-menh` | Bảng tổng và tra ngược |
| tuổi dần hợp màu gì · các năm tuổi dần · tuổi hợi hợp với con gì | `/con-giap/dan`, `/con-giap/hoi` | Con giáp không kèm năm |
| tuổi dần hợp hướng nào · hướng nhà cho tuổi bính thìn | `/phong-thuy/huong-nha` | Hướng phụ thuộc năm sinh và giới tính, không phụ thuộc con giáp |
| ngũ hành (50K) · ngũ hành tương sinh (50K) · tương sinh tương khắc | `/ngu-hanh` | Cùng khái niệm |
| cung mệnh · cung mệnh là gì · cung mệnh trong tử vi | `/tu-vi/cung/menh` | Kèm hộp "Bạn đang tìm cung phi bát trạch?" dẫn sang `/phong-thuy/cung-phi` |
| cung mệnh nam 1992 · cung mệnh bát trạch · cung mệnh vợ chồng | `/sinh-nam/1992` hoặc `/phong-thuy/cung-phi` | Nghĩa bát trạch |
| mệnh là gì | `/kien-thuc/menh-la-gi` | Trang gỡ nhập nhằng 3 nghĩa |
| văn khấn mùng 1 (50K) · văn khấn ngày rằm (50K) · văn khấn rằm mùng 1 hàng tháng | **`/van-khan/mung-1-va-ngay-ram`** | Hai bài văn gần như trùng nhau. Hai trang sẽ thành nội dung trùng lặp |
| văn khấn rằm tháng 7 | `/van-khan/ram-thang-7` | Văn bản riêng |
| cúng rằm tháng 7 vào ngày nào · cúng rằm tháng 7 cần chuẩn bị gì | `/lich-am/ngay-le/ram-thang-7` | Ý định là ngày và mâm cúng, không phải văn bản khấn |
| gieo quẻ kinh dịch · quẻ (500K) · xin quẻ · rút quẻ | `/kinh-dich/gieo-que` | Ý định dùng công cụ |
| kinh dịch · kinh dịch là gì | `/kinh-dich` | Hub |
| quẻ thuần càn | `/kinh-dich/que/01-thuan-can` | Một quẻ kép |
| quẻ càn | `/kinh-dich/bat-quai/can` | Một quái đơn, dẫn sang Thuần Càn |
| bản đồ sao (500K) · chiêm tinh lá số (50K) | `/chiem-tinh/ban-do-sao` | Cùng là natal chart |
| cung hoàng đạo · cung hoàng đạo theo ngày sinh | `/chiem-tinh/cung-hoang-dao` | Gộp công cụ tra vào trang chỉ mục |
| số chủ đạo · tính số chủ đạo online | `/than-so-hoc/so-chu-dao` | Công cụ |
| thần số học · nhân số học | `/than-so-hoc` | Hai tên của cùng một môn |
| số chủ đạo 7 · thần số học số 7 | `/than-so-hoc/so-chu-dao/7` | Từ điển |
| bát tự · tứ trụ · bát tự là gì | `/bat-tu` | Hub |
| bát tự online · lập bát tự · tứ trụ mệnh bàn | `/bat-tu/lap-la-so` | Công cụ |
| xem tuổi vợ chồng · xem tuổi chồng 1997 vợ 2003 | `/xem-tuoi/vo-chong` | Hai năm (C3) |
| bói tình yêu (500K) · bói tình yêu theo ngày sinh | `/boi-tinh-yeu` | Nếu anh duyệt (mục 10) |
| kim lâu · kim lâu là gì · kim lâu 2027 | `/xem-tuoi/kim-lau` | C4 |
| 2003 có kim lâu không | `/sinh-nam/2003` | C3 |

### 5.3. Nhóm LOẠI: không đặt trang

Thứ tự trong JSON: quy tắc LOẠI chạy **trước** mọi quy tắc nội dung, nên một cụm có dấu hiệu loại thì bị loại, dù có chứa từ khóa hợp lệ.

| page_id | Lý do | Căn cứ | Ví dụ thật trong tệp `[KP]` | Lượng `[ƯỚC LƯỢNG]` |
|:--|:--|:--|:--|--:|
| `LOAI:co_bac_so_de` | Giấc mơ hoặc lá bài ra con số, lô đề | 07 mục 4.4 O2 (loại vĩnh viễn), 07b R-d, R-h | "nằm mơ thấy người chết đánh số gì" 5K; "bói bài trúng số" 5K; "giải mộng lô đề" 500 | ~65K |
| `LOAI:thai_nhi_nguoi_de_ton_thuong` | Cầu siêu, sám hối thai nhi | 07 P5; 08 mục 3.2 | "văn khấn cầu siêu cho thai nhi tại nhà" 500 | ~1,5K |
| `LOAI:le_giai_han_tru_ta` | Giải hạn, dâng sao, cắt duyên âm, khai quang, cải vận | 04 mục 3.4; 07 B7, P5, G7 | "cúng sao giải hạn 2026" 500; "sim phong thủy cải vận" 500 | ~5K |
| `LOAI:vat_pham` | "bỏ gì vào ví", "đeo gì", "xăm gì" dẫn tới bán đồ | 07 G7 | "mệnh kim bỏ gì vào ví" 500; "mệnh kim đeo gì de thu hút tài lộc" 500 | ~4K |
| `LOAI:y_te_sinh_mo` | Nốt ruồi ung thư, ngày sinh mổ, phẫu thuật | 07 E4; 04 mục 3.4 | "nốt ruồi ung thư da" 500 | ~1,5K |
| `LOAI:tang_le_trung_tang` | Trùng tang, an táng, bốc mộ | 07 E3 | "ngày tốt bốc mộ tháng 11 âm lịch năm 2025" 50 | <1K |
| `LOAI:hu_doa_so_phan` | "khi nào chết", "đoản mệnh", "khắc chồng", "ngoại tình" | 07 mục 3.5 | "đoản mệnh là gì" 500 | ~1K |
| `LOAI:hua_hen_chinh_xac_100` | "chính xác 100%" | 07 mục 3.5; 08 mục 3.2 | "bói tình yêu chính xác 100" 5K | ~6K |
| `LOAI:chi_tay_sinh_trac` | Xem tướng hoặc chỉ tay qua ảnh | 07 M2 (R-f) | "xem chỉ tay" (không có số) | — |
| `LOAI:not_ruoi` | Bói nốt ruồi | 07 M3 | "nốt ruồi ở cằm" 5K | ~59K |
| `LOAI:sim_bien_so_so_dep` | Sim, biển số, số hợp mệnh | 07 G6; 08 mục 3.2 | "sim phong thuỷ" 50K; "biển số đẹp" 5K | ~95K |
| `LOAI:sao_han_tra_cuu` | Tra sao hạn từng năm (công cụ B7) | 07b B7 | "sao hạn năm 2026" 5K | ~15K |
| `LOAI:tu_vi_hang_ngay` | Tử vi, horoscope hằng ngày | 07 C10, K5 | "tử vi hôm nay" 50K | ~80K |
| `LOAI:boi_vui_xep_hang` | "cung hoàng đạo … nhất", bói Kiều, love tester | 07 R2 (loãng bách khoa, định kiến) | "12 cung hoàng đạo ai tài giỏi nhất" 500 | ~10K |
| `LOAI:boi_theo_ten_khong_can_cu` | Bói tình yêu theo tên | 07 R2; không có căn cứ tính | "bói tình yêu tên" 50K; "qua tên" 5K | ~65K |
| `LOAI:thuong_hieu_doi_thu` | Truy vấn điều hướng tới trang khác | Không thể thỏa ý định; 08 mục 3.3 | "tử vi chân cơ" 50K; "tử vi cổ học" 50K; "bát tự quang minh" 5K | ~190K |
| `LOAI:nguoi_noi_tieng` | Lá số người thật có thể nhận diện | Rủi ro chính trị, đời tư; giờ sinh không kiểm được | "lá số tử vi phạm nhật vượng" 500 | ~2K |
| `LOAI:tai_lieu_ban_quyen` | Tải PDF hoặc ebook | 07b R-j | "nhân tướng học pdf" 500 | ~3K |
| `LOAI:nhieu_*` (3 nhóm) | Địa danh, quán, game, phim, nhạc, khác nghĩa | 08 mục 3.1 | "ngũ hành sơn" 50K; "ốc hoàng hậu" 5K; "chiêm tinh tft" 5K; "sứ mệnh là gì" 5K; "tứ trụ việt nam" 5K | ~120K |

Khi đã có `TD-CUUDIEU` (mục bách khoa "Cửu Diệu là gì", 07 B7), riêng các cụm *"sao hạn **là gì**"* được gán vào trang này **trước** quy tắc loại sao hạn.

### 5.4. Nhóm hoãn (có trang, nhưng P3)

| Nhóm | Trang | Lượng | Vì sao chưa làm | Ghi chú |
|:--|:--|--:|:--|:--|
| Tarot | `/boi-bai` | ~80K | 07 L "Sau"; bản quyền hình bộ bài `[CHƯA KIỂM]` | — |
| Đặt tên con | `/dat-ten-con` | ~64K | 07 N "Sau"; R-f | — |
| Xin xăm (bài văn hóa) | `/phong-tuc/xin-xam` | ~90K | 07 I1 KHÔNG làm công cụ | **"quẻ xăm thượng thượng" 50K** |
| Giải mộng (nghĩa, không số) | `/giai-mong` | ~40K | 07 O1 KHÔNG trong 2027 | Vùng từ khóa bị trang nhà cái chiếm |
| Mai hoa, lục hào | `/kinh-dich/mai-hoa-dich-so`, `/luc-hao` | ~35K | 07b H4, H5 "Sau" | — |
| Nhân tướng | `/kien-thuc/nhan-tuong-hoc` | ~15K | 07 M1 "Sau" | — |
| Human Design | `/human-design` | ~13K | 07 Q1 KHÔNG 2027 | — |

---

## 6. Chuẩn onpage theo loại trang

### 6.1. Bảng chuẩn

| Mục | Trang chủ | Hub | Công cụ | Điều hướng | Từ điển | Bài viết | Lập trình | Mùa vụ |
|:--|:--|:--|:--|:--|:--|:--|:--|:--|
| **Title** | Thương hiệu + 3 công cụ chính, ≤ 60 ký tự | `{Khái niệm} là gì? {3 nhánh}`, ≤ 60 | `{Từ khóa chính} – {lợi ích khác biệt}`, ≤ 60 | `{Bộ}: {số mục} {đơn vị}` | `{Tên} trong {môn}: {2 khía cạnh}` | Câu hỏi đúng từ khóa | Mẫu có biến; sau khi điền phải ≤ 60 | `{Dịp} {yyyy} vào ngày nào? …` |
| **Meta** (120–155 ký tự) | Liệt kê công cụ + "có căn cứ, không hù dọa" | Phạm vi mảng + nguồn | Nhập gì, ra gì, khác gì đối thủ | Số mục, cách duyệt | Định nghĩa 1 câu + nguồn | Trả lời ngắn + điều sẽ học | Câu trả lời có số liệu riêng của trang | Ngày dương cụ thể + nội dung |
| **H1** | 1 câu định vị | Tên mảng | Đúng từ khóa chính | Tên bộ | Tên mục | Câu hỏi hoặc chủ đề | Mẫu có biến | `{Dịp} {yyyy}` |
| **Khung H2/H3** | Công cụ / Hôm nay / Mùa vụ / Vì sao tin được | Là gì → Công cụ → Từ điển → Bài → Nguồn | Công cụ (trên cùng) → Cách đọc kết quả → Căn cứ → Các phái khác nhau → FAQ → Giới hạn | Bảng hoặc lưới đủ mục → giải thích ngắn | Đủ **9 khối của 07 mục 2.3** | Trả lời → Giải thích → So sánh → FAQ → Nguồn | Kết quả → Giải thích → Liên quan | Ngày → Phong tục → Chuẩn bị → Văn khấn (link) → FAQ |
| **Đoạn mở đầu** | ≤ 2 câu | 2–3 câu trả lời "là gì" | Công cụ hiện trong màn hình đầu tiên; 1 câu "Nhập…, nhận…" | 1 câu | **Khối 2: tóm tắt 2 câu** trả lời ngay | 40–60 từ trả lời thẳng câu hỏi | Câu trả lời có số: "Sinh năm 1995 là tuổi Ất Hợi, mệnh Sơn Đầu Hỏa…" | Ngày dương và thứ trong câu đầu |
| **FAQ** | Không | 3–5 câu | 4–6 câu | Không | 3–5 câu | 4–8 câu | 3–4 câu theo mẫu có biến | 3–5 câu |
| **Schema** | Organization, WebSite | CollectionPage, BreadcrumbList | WebApplication (offers giá 0) | CollectionPage hoặc DefinedTermSet | DefinedTerm + WebPage (reviewedBy, lastReviewed) | Article (author, citation) | WebPage hoặc Article | Article hoặc WebPage. **Không Event** |
| **Ảnh** | 1 ảnh OG | 1 sơ đồ | 1 ảnh kết quả mẫu (SVG/WebP) | Không bắt buộc | 1 sơ đồ (vị trí sao trên lá số, hình 6 hào…) | 1–3 sơ đồ | Ảnh OG sinh tự động | 1 ảnh minh họa |
| **Độ dài tối thiểu** `[GIẢ ĐỊNH]` | 300 từ | 400–800 | 300–600 dưới công cụ | 150 + bảng | 600–1.200 | 1.200–2.500 | 250 từ riêng + dữ liệu | 800–1.500 |
| **E-E-A-T** | Link `/phuong-phap`, `/nguon` | Nguồn chính của mảng | Căn cứ + quy ước phái + giới hạn | Nguồn của bộ | Khối 8 nguồn + khối 9 người duyệt | Tác giả, người duyệt, ngày, nguồn | Câu nguồn mẫu + người duyệt mẫu | Nguồn phong tục |
| **Index** | Có | Có | Trang gốc có; kết quả theo tham số **noindex** | Có | Có khi đủ 9 khối và có người duyệt | Có khi có người duyệt | Qua cổng mục 4 | Có |

### 6.2. Quy tắc chung (áp mọi trang)

- **Title:**
  - ≤ 60 ký tự. Từ khóa chính ở đầu.
  - Hậu tố "| xemboi.vn" chỉ thêm khi còn chỗ.
  - **Cấm** từ trong 07 mục 3.5: "chính xác 100%", "linh ứng", "đại hung", tên hung tinh, tên hướng xấu. Riêng "Tuyệt Mệnh, Ngũ Quỷ, Họa Hại, Lục Sát" chỉ được dùng trong thân bài.
- **Meta:** 120–155 ký tự. Có ít nhất 1 dữ kiện cụ thể (ngày, số, tên nguồn). Không hứa hẹn.
- **H1:** đúng 1 thẻ, gần với từ khóa chính, có thể khác title.
- **FAQ:** dùng **câu hỏi có thật trong bộ từ khóa** (dạng "là gì", "bao nhiêu", "nào", "có … không"). Đặt dưới dạng H2/H3 thường. **Không gắn `FAQPage`** (07 mục 2.7: Google đã giới hạn kết quả nhiều định dạng cho FAQ).
- **Khối giới hạn** cuối mỗi trang, dùng mẫu câu 07 mục 3.3 theo loại (lịch / tử vi–bát tự–thần số–chiêm tinh / xem tuổi–xem ngày / gieo quẻ).
- **Khối người duyệt:** "Biên tập: … · Duyệt học thuật: … · Duyệt ngày …". Thiếu khối này thì trang **không được index** (07 mục 3.4).
- **Khối nguồn, theo 12 mục 3:**

  | Mảng | Nguồn |
  |:--|:--|
  | Tử vi | *Tử Vi Đẩu Số toàn thư* (WS01); sách cụ Thiên Lương (thông tin xuất bản `[CHƯA KIỂM]`, 07 mục 3.1) |
  | Lịch, xem ngày | *Hiệp kỷ biện phương thư*, *Tinh lịch khảo nguyên*, *Ngọc hạp ký* |
  | Bát tự | *Uyên hải Tử Bình*, *Trích thiên tủy*, *Tam mệnh thông hội* |
  | Ngũ hành | *Ngũ hành đại nghĩa* |
  | Kinh Dịch | Chu Dịch chính văn; Chu Hy *Bản nghĩa*; bản dịch Ngô Tất Tố, Phan Bội Châu; Legge 1882 |
  | Phong tục | *Việt Nam phong tục* (Phan Kế Bính 1915) |
  | Phong thủy | *Bát trạch minh kính* |
  | Chiêm tinh | *Tetrabiblos* |
  | Thần số | **Không có nguồn A** (12 mục 3), chỉ trình bày cách tính |

- **Ảnh:**
  - Định dạng WebP hoặc AVIF/SVG. Khai báo `width`/`height`. `loading="lazy"` cho mọi ảnh trừ ảnh LCP.
  - Alt tả nội dung, ví dụ "Lá số tử vi 12 cung mẫu, quy ước Nam phái". Không nhồi từ khóa.
  - Không dùng ảnh AI dựng "thầy".
  - Ảnh OG 1200×630 sinh tự động, có tên miền.
- **Canonical:**
  - Mọi trang tự canonical.
  - Bỏ tham số (`utm_*`, `?ngay=`, `?nam=`).
  - Trang kết quả công cụ (có tham số ngày sinh) canonical về trang công cụ và mang `noindex`.
  - Chọn một bản: `https://xemboi.vn` (không www, không `/` cuối). Bản còn lại 301 về.
- **Phân trang** (`/kien-thuc?trang=2`, chỉ mục dài): mỗi trang tự canonical, index, follow. Title thêm "– Trang 2". Không dùng `rel=prev/next` (Google không còn dùng tín hiệu này). Không canonical trang 2 về trang 1.
- **noindex:**
  - Trang ngày âm lịch; kết quả công cụ; `/la-so/*`; tìm kiếm nội bộ.
  - Trang P3 chưa duyệt; mục sao tại cung chưa biên tập.
  - Trang lập trình trượt cổng mục 4.
- **Core Web Vitals:**
  - Ngưỡng "tốt" theo Google ở phân vị 75: **LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1**.
  - Trang từ điển và trang lập trình: SSG/ISR.
  - Công cụ: render khung bằng SSR, tính ở client sau tương tác.
  - Font tự host, có subset tiếng Việt, `font-display: swap`.
  - JS mỗi trang ≤ 150 KB nén `[GIẢ ĐỊNH]`.
  - Lưới lịch render sẵn. Đặt kích thước cố định cho khung công cụ để không nhảy bố cục.
  - Không quảng cáo hiển thị (07 mục 5.2).

### 6.3. Title / meta / H1 cụ thể cho trang P1

Đầy đủ cho 43 trang đơn P1 và 10 mẫu bộ P1 trong CSV (cột `title_mau`, `meta_mau`, `h1_mau`). Dưới đây là các trang quan trọng nhất kèm FAQ lấy từ câu hỏi thật trong bộ từ khóa.

| Trang | Title | H1 | FAQ (câu hỏi có trong tệp) |
|:--|:--|:--|:--|
| `/lich-am` | Lịch âm hôm nay – lịch âm dương tháng này \| xemboi.vn | Lịch âm hôm nay: {thứ}, {dd/mm/yyyy} là ngày {âm} | Hôm nay mùng mấy âm lịch? · Lịch âm là lịch gì? · Lịch âm khác lịch dương như thế nào? · Lịch âm bao nhiêu năm nhuận một lần? · Lịch âm xuất phát từ đâu? |
| `/lich-am/doi-ngay` | Đổi ngày dương sang âm, âm sang dương (1900–2100) | Đổi ngày dương sang âm và âm sang dương | Lịch âm iPhone bị sai vì sao? · Sinh giờ Tý tính ngày nào? · Tháng nhuận đổi thế nào? |
| `/lich-am/lich-van-nien` | Lịch vạn niên 1900–2100: âm dương, can chi, tiết khí | Lịch vạn niên trực tuyến 1900–2100 | Lịch vạn niên là gì? · Ai làm ra lịch vạn niên? · Có bản không quảng cáo không? |
| `/sinh-nam/{yyyy}` | Sinh năm {yyyy} mệnh gì? Tuổi {Can Chi}, {Nạp âm} | Sinh năm {yyyy} mệnh gì? | {yyyy} mệnh gì? · {yyyy} tuổi con gì? · {yyyy} hợp màu gì? · Năm {yyyy} lấy vợ tuổi nào hợp? · Tam tai {yyyy} vào năm nào? |
| `/ngu-hanh` | Ngũ hành tương sinh, tương khắc: bảng và cách hiểu | Ngũ hành tương sinh và tương khắc | Ngũ hành gồm những yếu tố nào? · Ngũ hành tương sinh như thế nào? · Mệnh gì khắc mệnh gì? · Mệnh gì sinh mệnh gì? |
| `/ngu-hanh/kim` | Mệnh Kim là gì? Màu hợp, mệnh sinh – khắc, năm sinh | Mệnh Kim là gì | Mệnh Kim màu gì? · Mệnh gì sinh Kim? · Cùng mệnh Kim có hợp nhau không? |
| `/tu-vi/lap-la-so` | Lá số tử vi online miễn phí – an sao theo Nam phái | Lập lá số tử vi online miễn phí | Không biết giờ sinh có lập được không? · Lá số tử vi có thay đổi không? · Vì sao mỗi trang ra một lá số khác? |
| `/tu-vi/cach-doc-la-so` | Lá số tử vi là gì? Cách đọc lá số cho người mới | Lá số tử vi là gì và đọc thế nào | Lá số tử vi gồm những gì? · Lá số tử vi mỗi năm mỗi khác hay sao? · Lá số tử vi xấu thì phải làm sao? (trả lời trung tính, không bán lễ) |
| `/tu-vi/cung/menh` | Cung Mệnh trong tử vi là gì? Ý nghĩa, cách xem | Cung Mệnh trong tử vi | Cung mệnh là gì? · Cung mệnh vô chính diệu là gì? · Cung mệnh gặp Tuần, Triệt? |
| `/phuong-phap/nam-phai-bac-phai` | Tử vi Nam phái và Bắc phái khác nhau thế nào? | Tử vi Nam phái và Bắc phái: các điểm khác nhau | Tử vi bắc phái khác gì nam phái? · Lá số tử vi nam phái lập thế nào? |
| `/tet` | Tết 2027 vào ngày nào? Còn bao nhiêu ngày đến Tết | Tết 2027 vào ngày nào? | Tết 2027 là năm con gì? · Còn bao nhiêu ngày nữa đến Tết? · Năm 2027 mệnh gì? |
| `/xem-tuoi/vo-chong` | Xem tuổi vợ chồng: hợp – khắc theo từng hệ, có giải thích | Xem tuổi vợ chồng có căn cứ | Xem tuổi cưới thì xem tuổi âm hay dương? · Kim lâu có cưới được không? · Nam tuổi Mão nữ tuổi Thìn có hợp nhau không? |
| `/bat-tu` | Bát tự là gì? Tứ trụ năm, tháng, ngày, giờ giải thích | Bát tự (tứ trụ) là gì | Bát tự gồm những gì? · Bát tự và tử vi khác gì nhau? · Bát tự hay tử vi đúng hơn? |

---

## 7. Internal link: quy tắc máy thực thi được

### 7.1. Quy tắc

| Mã | Áp cho | Quy tắc |
|:--|:--|:--|
| IL-01 | Mọi trang | Breadcrumb theo cột `cha` của CSV, tới trang chủ. Có `BreadcrumbList`. Mục cuối không có link |
| IL-02 | Mọi trang | Chân trang link `/phuong-phap`, `/nguon`, `/goi`, `/tu-dien` (anchor cố định, thương hiệu) |
| IL-03 | Trang chủ | Link tới **11 hub P1–P2** + 5 công cụ: lập lá số, lịch âm, đổi ngày, tra năm sinh, gieo quẻ. Khối mùa vụ link tới trang mùa đang tới (mục 8.6) |
| IL-04 | Hub | Link tới **mọi** trang tầng 2 trong mảng + 6–10 trang lá nhiều lượt tìm nhất + 1 hub liền kề (Tử vi ↔ Bát tự, Lịch ↔ Xem ngày, Can chi ↔ Xem tuổi) |
| IL-05 | Trang điều hướng | Link tới **mọi** trang lá của bộ. Độ sâu ≤ 3 |
| IL-06 | Mọi trang lá | 1 link lên trang cha + 1 link lên hub (ngoài breadcrumb, trong thân bài) |
| IL-07 | `/sinh-nam/{y}` | 2 năm liền kề (y−1, y+1) + 2 năm cùng con giáp (y−12, y+12) + `/can-chi/{can-chi}` + `/nap-am/{ten}` + `/ngu-hanh/{hanh}` + `/con-giap/{chi}` + `/xem-tuoi/vo-chong?nam={y}` (nofollow vì có tham số) + `/tu-vi/lap-la-so` |
| IL-08 | `/lich-am/{y}/{m}` | Tháng trước và tháng sau + cùng tháng năm trước và năm sau + `/lich-am/{y}` + ngày lễ và tiết khí trong tháng + `/xem-ngay/thang-{m}-{y}` (nếu có) |
| IL-09 | `/lich-am/{y}` | 12 tháng + năm trước và năm sau + `/sinh-nam/{y}` + `/tet` (nếu y là năm Tết sắp tới) |
| IL-10 | `/xem-tuoi/{a}-va-{b}` | `/con-giap/{a}`, `/con-giap/{b}` + 3 cặp cùng nhóm tam hợp của {a} + `/xem-tuoi/vo-chong` + `/kien-thuc/vi-sao-cac-noi-xem-tuoi-khac-nhau` |
| IL-11 | `/tu-vi-{y}/tuoi-…` | Cùng tuổi khác giới + cùng tuổi năm trước và năm sau + `/can-chi/{can-chi}` + `/sinh-nam/{năm sinh}` + `/tu-vi-2027` hoặc `/tu-vi/lap-la-so` (CTA duy nhất) |
| IL-12 | Chính tinh | Các sao cùng vòng: **vòng Tử Vi** (Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh) hoặc **vòng Thiên Phủ** (Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân) + `/tu-vi/sao/{sao}/menh` + `/tu-vi/cung/menh` |
| IL-13 | Cung tử vi | 3 cung còn lại của nhóm tam hợp – xung chiếu (ví dụ Mệnh → Tài Bạch, Quan Lộc, Thiên Di) + 2–3 chính tinh hay gặp |
| IL-14 | Quẻ Kinh Dịch | Quẻ số trước và số sau + 2 quái thành phần + nút "Gieo quẻ" |
| IL-15 | Mục từ điển | Khối 7 "Liên quan": **3–5 mục từ điển + 1 công cụ + 1 bài** (07 mục 2.3) |
| IL-16 | **Công cụ → từ điển** | Mỗi sao, cung, can chi, quẻ, tiết khí hiện trên kết quả công cụ đều **bấm được** sang mục từ điển (07 mục 2.4). Đây là liên kết giá trị nhất |
| IL-17 | **Từ điển → công cụ** | Nút "Xem {sao/cung} này trên lá số của bạn" → `/tu-vi/lap-la-so`. Tương tự: quẻ → gieo quẻ, năm sinh → xem tuổi |
| IL-18 | Bài viết | Đoạn đầu (200 từ đầu) có 1 link tới công cụ chính của mảng. Thân bài có 3–8 link ngữ cảnh tới mục từ điển khi nhắc thuật ngữ **lần đầu**. Mỗi đích chỉ link 1 lần mỗi trang |
| IL-19 | Trang xem tuổi, xem ngày | **Bắt buộc** link `/kien-thuc/vi-sao-cac-noi-xem-tuoi-khac-nhau` (07 mục 2.4) |
| IL-20 | Mọi trang có trích dẫn | Mỗi nguồn link `/nguon/{sach}` |
| IL-21 | Trang theo năm | Điều hướng ngang năm trước ↔ năm sau (`/tet` lưu trữ không index; `/lich-am/{y}`; `/tu-vi-{y}`) |
| IL-22 | **Dồn lực về trang tiền** | Mọi trang Tử vi, Can chi, Bát tự, Xem tuổi có **đúng 1 CTA** tới `/tu-vi/lap-la-so` hoặc `/tu-vi/luan-giai`, đặt cuối bài, không pop-up (04 mục 3.1). `/tu-vi/lap-la-so` nhận link từ hub, trang chủ, 14 chính tinh, 12 cung, 101 năm sinh, 60 hoa giáp: **≥ 200 link vào**. `/tu-vi/luan-giai` chỉ nhận link từ công cụ, `/goi` và bài liên quan. **Không** đặt link bán trong mục từ điển (giữ tính bách khoa) |
| IL-23 | Ngưỡng số link | Liên kết trong thân bài (không tính menu và chân trang): hub ≤ 150, trang điều hướng ≤ 300 (ma trận), công cụ ≤ 60, từ điển ≤ 40, bài ≤ 50, lập trình ≤ 40. Menu + chân trang ≤ 40 |
| IL-24 | Độ sâu | Tính BFS từ `/` theo link trong HTML đã render. Mọi URL trong sitemap phải có độ sâu ≤ 3. Sâu hơn thì **build báo lỗi** |
| IL-25 | Trang mồ côi | Mỗi tuần quét: mọi URL trong sitemap phải có **≥ 3 link vào từ trang đã index**, trong đó ≥ 1 từ trang cha. Thiếu thì đưa vào danh sách sửa. URL không có trong sitemap mà vẫn bị crawl tới thì kiểm noindex hoặc 301 |
| IL-26 | Trang lập trình | Anchor sinh từ mẫu có biến (mục 7.2). Không chèn khối "từ khóa liên quan" sinh hàng loạt. Không dùng link chân trang để đẩy trang lập trình |

### 7.2. Phân bố anchor text (cho các link **vào** một trang)

| Loại | Tỷ lệ mục tiêu | Ví dụ cho `/sinh-nam/1995` |
|:--|--:|:--|
| Chính xác | 20–30% | "1995 mệnh gì" |
| Một phần / biến thể | 40–50% | "người sinh năm 1995", "tuổi Ất Hợi 1995", "mệnh Sơn Đầu Hỏa 1995" |
| Ngữ cảnh dài | 10–20% | "xem mệnh và màu hợp của người sinh năm 1995" |
| Thương hiệu / URL | 5–10% | "xemboi.vn/sinh-nam/1995" |
| Chung chung | ≤ 10% | "xem chi tiết" (chỉ trong nút) |

Backend sinh anchor theo trọng số trên, xoay vòng theo trang nguồn (băm `page_id` nguồn). Mỗi trang đích cố định các biến thể.

---

## 8. Kỹ thuật

### 8.1. sitemap.xml tách theo loại

`/sitemap.xml` là sitemap index, trỏ tới các tệp sau:

| Tệp | Nội dung |
|:--|:--|
| `sitemap-trang.xml` | Trang chủ, hub, công cụ, điều hướng, phương pháp, `/goi` |
| `sitemap-tu-dien.xml` | Mọi mục từ điển đã duyệt |
| `sitemap-bai-viet.xml` | Bài viết, nguồn sách |
| `sitemap-lich.xml` | Lịch năm và tháng (**không** có ngày) |
| `sitemap-sinh-nam.xml` | 101 trang năm sinh |
| `sitemap-xem-tuoi.xml` | 78 cặp con giáp |
| `sitemap-xem-ngay.xml` | Trang tháng, trang việc × tháng |
| `sitemap-tu-vi-nam.xml` | Tử vi năm theo tuổi |
| `sitemap-mua-vu.xml` | Tết, ngày lễ, xông đất, xuất hành, văn khấn theo mùa |

**Quy tắc:**
- Chỉ đưa URL **đang index được** (qua cổng mục 4).
- `lastmod` là ngày nội dung đổi thật (không dùng `new Date()` cho mọi URL như `src/app/sitemap.ts` đang làm).
- Bỏ `changefreq` và `priority` (Google không dùng).
- Mỗi tệp ≤ 50.000 URL.

**Phải sửa `src/app/sitemap.ts`** (việc của đợt 0, không sửa trong lần này). Tệp này đang khai báo:
- `/tu-vi-hom-nay`, `/tu-vi-ngay-mai` và 24 trang con theo tuổi (thuộc nhóm LOẠI C10);
- 180 trang `/tu-vi-tron-doi/tuoi-*` (07 C11 KHÔNG);
- các bài `/bai-viet/*` lấy từ `cms-data.ts` (01: nghi chép lại).

Và **không** có `/tu-vi-2027`.

### 8.2. robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /quan-tri
Disallow: /admin
Disallow: /tim-kiem
Sitemap: https://xemboi.vn/sitemap.xml
```

- **Không** chặn `/la-so/` hay `/lich-am/*/*/*` bằng robots, vì Google cần crawl được thì mới thấy thẻ `noindex`.
- Không chặn tham số rộng.

### 8.3. Canonical, hreflang, máy chủ

- **hreflang: không cần.** Site chỉ có tiếng Việt. Nếu sau này có bản tiếng Anh thì thêm `vi` / `en` / `x-default`.
- **Máy chủ:**
  - HTTP → HTTPS và www → không www: 301 một bước, không chuỗi.
  - Chữ hoa → chữ thường: 301.
  - Có `/` cuối → bỏ `/` cuối: 301.
- **`/la-so/[slug]` (route cũ của xemboi):** hiện tự canonical và có thể được index (`src/app/la-so/[slug]/page.tsx` dòng 35), trong khi slug chứa dữ liệu sinh. Cần đổi thành `noindex,nofollow` và gỡ khỏi sitemap. Vấn đề riêng tư (R-f).

### 8.4. Bảng chuyển hướng 301

**A. Route cũ của xemboi.vn** (đọc từ `src/app`):

| Đường cũ | Đích | Ghi chú |
|:--|:--|:--|
| `/tu-vi-hom-nay`, `/tu-vi-hom-nay/{tuoi}` | `/tu-vi` | C10 bỏ. Nếu Search Console cho thấy không có lượt vào thì dùng **410** |
| `/tu-vi-ngay-mai`, `/tu-vi-ngay-mai/{tuoi}` | `/tu-vi` | Như trên |
| `/tu-vi-tron-doi` | `/tu-vi/tron-doi` | — |
| `/tu-vi-tron-doi/tuoi-{can}-{chi}(-nam-mang\|-nu-mang)` ×180 | `/tu-vi/tron-doi` | Không 301 sang hoa giáp vì khác ý định |
| `/tu-tru` | `/bat-tu` | — |
| `/boi-dich` | `/kinh-dich/gieo-que` | — |
| `/bai-viet/tu-vi-nam-phai` | `/phuong-phap/nam-phai-bac-phai` | — |
| `/bai-viet/lich-van-nien-am-duong` | `/lich-am/lich-van-nien` | — |
| `/bai-viet/tu-tru-bat-tu` | `/bat-tu` | — |
| `/bai-viet/kinh-dich-phong-thuy` | `/kinh-dich` | — |
| `/bai-viet/huong-dan-doc-la-so-tu-vi-nam-phai-cho-nguoi-moi` | `/tu-vi/cach-doc-la-so` | — |
| `/bai-viet/thuat-toan-am-lich-ho-ngoc-duc-va-cach-tinh-gio-ty-dem` | `/phuong-phap/gio-ty` | — |
| `/bai-viet/cach-cuc-tu-phu-vu-tuong-va-sat-pha-tham-trong-tu-vi` | `/tu-vi/cach-cuc` (chỉ mục) | — |
| `/bai-viet/ung-dung-tu-tru-bat-tu-va-chon-dung-than-cai-van` | `/bat-tu/dung-than` | — |
| `/la-so/{slug}` | Giữ, nhưng `noindex` | Hoặc 301 `/tu-vi/lap-la-so` nếu bỏ tính năng chia sẻ |

> **Anh quyết 21/11/2026: KHÔNG làm phần B.** xemtuvi.vn là trang riêng.

**B. xemtuvi.vn → xemboi.vn** (đọc sitemap thật ngày 21/11/2026: `pages.xml` 13 URL, `articles.xml` 158 URL, `horoscopes.xml` lá số người dùng). **Chỉ làm khi anh quyết hợp nhất (mục 10).**

| Nguồn | Đích | Cách |
|:--|:--|:--|
| `xemtuvi.vn/` | `/` | 301 |
| `/la-so-tu-vi.html` | `/tu-vi/lap-la-so` | 301 |
| `/kien-thuc.html` | `/kien-thuc` | 301 |
| `/kien-thuc/{slug}.html` ×152 | Ánh xạ theo chủ đề trong slug: `sao-{x}…` → `/tu-vi/sao/{x}`; `luan-giai-{sao}-cung-menh…` → `/tu-vi/sao/{sao}/menh` (nếu chưa index thì → `/tu-vi/sao/{sao}`); `{yyyy}-menh-gi…` → `/sinh-nam/{yyyy}`; còn lại → bài gần nhất hoặc `/kien-thuc` | 301 theo bảng ánh xạ do script sinh. **Không** đẩy cả loạt về trang chủ (Google coi là soft 404) |
| `/tin-tuc/{slug}.html` ×2 | `/tu-vi/cach-doc-la-so`, `/tu-vi/sao/thien-tru` (hoặc chỉ mục sao) | 301 |
| `/su-kien/*` ×3 (affiliate), `/giftcode.html`, `/nap-tien.html`, `/huong-dan/huong-dan-nap-xu-va-thanh-toan.html` | `/goi` | 301. Mô hình xu bị bỏ (07 mục 5.2) |
| `/chinh-sach-*.html` ×4, `/dong-gop-y-kien.html`, `/huong-dan.html`, `/tin-tuc.html`, `/su-kien.html` | Trang chính sách hoặc liên hệ tương ứng trên xemboi | 301 |
| `/la-so-tu-vi/{MÃ}.html` (lá số cá nhân, số lượng `[CHƯA KIỂM]`) | **410 Gone** (khuyến nghị), hoặc 301 `/tu-vi/lap-la-so` | Sitemap xemtuvi đang **công khai lá số của người dùng**. Gỡ `horoscopes.xml` ngay, kể cả khi chưa hợp nhất |

Sau khi chuyển: giữ 301 ít nhất 1 năm. Dùng công cụ *Change of Address* trong Search Console nếu chuyển cả tên miền `[CHƯA KIỂM điều kiện áp dụng cho trường hợp gộp một phần]`.

### 8.5. Theo dõi

- Search Console theo từng sitemap con. Báo cáo "Đã thu thập – hiện chưa lập chỉ mục" cho trang lập trình là chỉ báo sớm của trang mỏng.
- Chỉ số 07: `Lá số tạo / lượt vào` theo nhóm trang. Ngưỡng 3% / 1% theo 07 mục 5.3.

### 8.6. Lịch mùa vụ và hạn xuất bản

**Quy tắc:**
- Trang mới lên trước đỉnh **≥ 10 tuần** (08 mục 7.1: cần 8–12 tuần).
- Trang mùa vụ đã có tuổi (URL cố định): cập nhật nội dung năm mới trước đỉnh **6–8 tuần**, giữ URL.
- Khối mùa vụ ở trang chủ đổi trước đỉnh 4 tuần.

| Dịp | Ngày | Trang | Hạn lên hoặc cập nhật |
|:--|:--|:--|:--|
| Tết Đinh Mùi 2027 | 06/02/2027 (thứ Bảy) | `/tet`, `/lich-am/2027`, `/sinh-nam/2027`, `/xem-tuoi/xong-dat`, `/xem-ngay/xuat-hanh` | **07/01/2027** (T7). Đã trễ so với 10 tuần, kỳ vọng lượt vào thấp (08 mục 7.2) |
| Ông Táo 2027 | 30/01/2027 | `/van-khan/ong-cong-ong-tao` | **Không làm 2027**: văn khấn chưa qua kiểm bản quyền |
| Vía Thần Tài 2027 | 15/02/2027 `[SUY LUẬN: mùng 10 = 06/02 + 9]` | `/lich-am/ngay-le/via-than-tai` | Không kịp. Làm cho 2028 |
| Rằm tháng Giêng 2027 | 20/02/2027 | `/lich-am/ngay-le/ram-thang-gieng` | Không làm 2027 (08) |
| Rằm tháng 7 / Vu Lan | 16/08/2027 | `/lich-am/ngay-le/ram-thang-7` (+ văn khấn nếu đã qua luật sư) | **15/06/2027** |
| Trung thu | 15/09/2027 | `/lich-am/ngay-le/trung-thu`, `/van-khan/ram-thang-8` | **07/07/2027** (đề xuất mới, không có trong 08) |
| Mùa cưới | 9/2027–1/2028 | `/xem-tuoi/vo-chong`; `/xem-tuoi/kim-lau`, `/xem-ngay/cuoi-hoi` | F1: 30/06/2027; Kim lâu, ngày cưới: **31/07/2027** |
| Làm nhà, tử vi 2028, lịch 2028 | 11/2027–3/2028 | `/xem-tuoi/lam-nha`, 120 trang `/tu-vi-2028/*`, `/lich-am/2028` | **30/09/2027** |
| Tết Mậu Thân 2028 | 26/01/2028 | Cập nhật `/tet`, xông đất, xuất hành; mới: `/van-khan/ong-cong-ong-tao` (~18–19/01/2028 `[CHƯA KIỂM engine]`), `/van-khan/tet`, `/van-khan/bao-sai-ban-tho` | **31/10/2027** |
| Vía Thần Tài, rằm tháng Giêng 2028 | 04/02/2028, 09/02/2028 `[SUY LUẬN]` | 2 trang ngày lễ + `/van-khan/than-tai-tho-dia` | **30/11/2027** |
| Mùng 1, rằm hàng tháng | Hàng tháng | `/van-khan/mung-1-va-ngay-ram`, `/lich-am` | Thường xuyên |

---

## 9. Thứ tự triển khai theo đợt (bám 08 mục 5.2)

Lượng tìm phủ: `[ƯỚC LƯỢNG]`, tính theo từ khóa chính và phụ đã gán. Giờ công lấy theo 08 `[GIẢ ĐỊNH]`.

| Đợt | Thời gian | Trang | Số trang index | Lượng tìm phủ thêm | Phụ thuộc kỹ thuật |
|:-:|:--|:--|--:|--:|:--|
| **0** | Đến 28/01/2027 (T4, T7–T10) | Nền kỹ thuật (mục 8: sitemap tách, robots, canonical, breadcrumb, cổng index, sửa `/la-so`, gỡ `horoscopes.xml`); `/tu-vi`, `/tu-vi/lap-la-so` (cùng bản Tết 04); `/tu-vi-2027` (đã có); `/phuong-phap` + 5 trang; gói Tết: `/tet`, `/lich-am/2027`, `/sinh-nam/2027`, xông đất, xuất hành; `/nguon`, `/tu-dien`; 12 cung; 5 chính tinh | ~45 | ~1,3 triệu (tử vi, lá số, Tết, năm 2027) | Engine lá số (R1), `lich.mjs`, `nap-am.mjs`; khuôn từ điển 9 khối; trang người duyệt có người thật |
| **1** | 2/2027 | `/lich-am` (hôm nay + tháng), đổi ngày, vạn niên, ngày mai; 16 trang năm; 192 trang tháng; trang ngày (noindex) | ~210 | **~11,9 triệu** | Engine âm lịch clean-room (05b); kiểm giấy phép `lich-raw.js` (README tài sản); SSG cho 208 trang |
| **2** | 3/2027 | `/can-chi`, `/sinh-nam` + 101 năm, 60 hoa giáp (bản ngắn), 30 nạp âm, `/ngu-hanh` + 5 hành + màu hợp mệnh, 12 con giáp; `/tu-vi/tron-doi`, `/tu-vi/cach-doc-la-so`, `/tu-vi/luan-giai`; 9 chính tinh còn lại | ~230 | ~1,75 triệu | `tiet-khi.mjs` (Lập Xuân), `tet-wikipedia-1984-2091.json`; dữ liệu nạp âm; cổng chống trang mỏng mục 4 |
| **3** | 4–5/2027 | `/xem-tuoi`, `/xem-tuoi/vo-chong` (F1), `/tu-vi/hop-la-so` (C8), `/boi-tinh-yeu` (nếu duyệt) | ~4 | ~0,5 triệu (+ cụm "xem tuổi…" chưa có số) | Engine F1 (can chi, nạp âm, cung phi, Kim lâu); Gói 3 thanh toán |
| **4** | 6/2027 | `/bat-tu`, `/bat-tu/lap-la-so`; `/lich-am/ngay-le` + rằm tháng 7 (hạn 15/06) | ~5 | ~0,13 triệu | Trụ tháng theo tiết; **không** dùng `tutru-boidich.ts` |
| **5** | Q3/2027 | Kinh Dịch (hub, gieo quẻ, 64 quẻ, 8 quái) → kim lâu, tam tai, hoang ốc, năm tuổi, làm nhà → 120 trang tử vi 2028 theo tuổi + `/tu-vi-theo-tuoi` → Xem ngày (hub, 6 việc, 24 + 192 trang tháng) → Thần số (hub, công cụ, 12 số); Trung thu | ~430 | ~1,05 triệu | Kiểm bản quyền bản dịch Kinh Dịch (R-j); bảng hệ xem ngày có nguồn; 07 mục 3.2 bảng phái Kim lâu |
| **6** | Q4/2027 | Bản đồ sao (có điều kiện), cung hoàng đạo + 12 cung, ~100 phụ tinh + Tứ Hóa, giờ hoàng đạo, tiết khí, các ngày lễ; Phong tục + ~21 bài văn khấn (sau luật sư); Phong thủy; cập nhật gói Tết 2028 | ~200 | ~1,25 triệu | Giấy phép ephemeris (07b K3); luật sư duyệt văn khấn; `astronomia` đủ hành tinh `[CHƯA KIỂM]` |
| **7** | 2028+ | P3: tarot, đặt tên, giải mộng, xin xăm (bài), nhân tướng (bài), HD, mai hoa, lục hào, cách cục, 168 sao tại cung, bản đồ sao đôi, thước Lỗ Ban | ~480 | ~0,33 triệu | Theo từng mảng; quy tắc 07: mỗi tháng tối đa 1 mảng mới |

Ghi chú:
- Đợt 1 cộng đợt 0 đã phủ khoảng **70% tổng lượng tìm**, nhưng lịch âm có tiền thấp (08 mục 6). Đo `Lá số tạo / lượt vào` ngay từ đợt 1 để biết lịch có kéo về lá số hay không.
- Đợt 1 **lệch 08 #16**: 08 xếp trang "hôm nay" vào Q4. Lý do lệch: `/lich-am` vốn phải hiện ngày hôm nay và tháng hiện tại, tách ra là tạo thêm URL tranh nhau (mục 5.2).

---

## 10. Việc cần anh Cường quyết

> **Anh đã quyết (21/11/2026):**
> - Duyệt mục 1, 2, 4, 5, 8, 9.
> - Mục 3: **không hợp nhất**. xemtuvi.vn là trang riêng, bỏ bảng 8.4B.
> - Mục 6: từ khóa bị loại (đối thủ, gõ sai) đưa vào mục quản lý riêng trong backend. Sau này sẽ làm landing page để phủ.
> - Mục 7: làm sau; ưu tiên SEO và marketing.
> - **Lá số không bao giờ index trên xemboi.vn**: `/la-so/*` noindex, nofollow, không vào sitemap.
>
> Chi tiết ở 16-quyet-dinh-anh.md.

1. **Gộp "lịch âm" + "lịch âm hôm nay" + "âm lịch hôm nay" + "lịch âm dương" về `/lich-am` và mở ở đợt 1 (2/2027), thay vì Q4 như 08 #16.**
   - Được: một URL nhận khoảng 11 triệu lượt tìm.
   - Mất: top hiện do một tờ báo chiếm (08: D5), tiền thấp.
   - Đề xuất: **đồng ý**, vì chi phí thêm gần bằng 0 (cùng engine).
2. **Trang `/boi-tinh-yeu`.**
   - Nhận cụm "bói tình yêu" (500K) bằng công cụ so hai **ngày sinh** (can chi, ngũ hành, cung hoàng đạo), dùng lại engine F1. Không bói theo tên.
   - Rủi ro: người tìm muốn trò vui theo tên, nên tỷ lệ thoát cao.
   - Phương án khác: đưa cả cụm (~0,58 triệu) vào LOẠI.
   - Đề xuất: **làm, cùng đợt F1**, giọng nhẹ nhàng, ghi rõ giới hạn.
3. **Hợp nhất xemtuvi.vn vào xemboi.vn bằng 301** (13 trang + 158 bài theo bảng mục 8.4B), và **xử lý URL lá số cá nhân `/la-so-tu-vi/{MÃ}.html`**.
   - Đề xuất cho lá số cá nhân: 410, và gỡ `horoscopes.xml` ngay vì đang công khai lá số người dùng.
   - Cùng việc này: đặt `noindex` cho `/la-so/*` trên xemboi.
4. **URL trang theo năm:**
   - Cố định: `/tet`, `/xem-tuoi/xong-dat`, `/xem-ngay/xuat-hanh`, `/tu-vi-theo-tuoi`.
   - Gắn năm: `/lich-am/{yyyy}`, `/tu-vi-{yyyy}/…`.
   - Trả lời câu 4 của 08 mục 8.
5. **Văn khấn mùng 1 và ngày rằm gộp 1 trang.** Hai cụm 50K về 1 URL.
6. **Đưa thương hiệu đối thủ vào LOẠI** (~190K, gồm "tử vi cổ học", "tử vi chân cơ"). Riêng **"tử vi việt nam" (50K) em giữ là cụm chung** cho hub `/tu-vi`, vì chưa rõ đây là tên thương hiệu hay cụm chung (08 mục 3.3).
7. **Ba bài P3 có rủi ro thương hiệu:** `/phong-tuc/xin-xam` (quẻ xăm thượng thượng 50K), `/giai-mong` (chỉ phần nghĩa, không số), `/kien-thuc/nhan-tuong-hoc`. Làm sau 2027, hay bỏ hẳn?
8. **12 con giáp lên P1** cùng đợt mệnh (07 xếp P2): cụm "tuổi X hợp màu gì" khoảng 30K, công sức ~6 giờ.
9. **Form lập lá số đặt ở `/tu-vi/lap-la-so`** và `/tu-vi-2027` dẫn sang, hay ngược lại? Đề xuất: `/tu-vi/lap-la-so` là trang lâu dài; `/tu-vi-2027` là trang theo năm.

---

## 11. Cách chạy script gán từ khóa (cho Claude Code)

1. Đọc `tu-khoa/tat-ca-tu-khoa.csv`. Cột `tu_khoa` chuẩn hóa: **NFC**, chữ thường, gộp khoảng trắng, `trim`. Cột `luong_tim` trống hoặc "-" tính là 0.
2. Đọc `16-quy-tac-gan-tu-khoa.json`. Với mỗi quy tắc:
   - Biên dịch mỗi chuỗi trong `khop` và `tru` bằng `new RegExp(s)`, **không cờ**.
   - Một từ khóa **khớp quy tắc** khi khớp **ít nhất một** regex `khop` và **không** khớp regex nào trong `tru`.
3. Từ khóa khớp nhiều quy tắc thì lấy quy tắc có `uu_tien` **nhỏ nhất**. Một `page_id` có thể có nhiều quy tắc (ví dụ `CC`, `PTUC`, `HOME`).
4. **Đầu ra cần báo:**
   - (a) Tổng lượng tìm theo `page_id`.
   - (b) Tổng LOẠI theo lý do.
   - (c) **Tỷ lệ phủ = lượng đã gán vào trang / (tổng − LOẠI)**.
   - (d) Danh sách **chưa gán** xếp theo lượng giảm dần (200 dòng đầu).
   - (e) 30 từ khóa lượng cao nhất của mỗi trang, để em soát gán sai.
   - (f) Các `page_id` trong JSON nhưng không có trong `16-seo-trang.csv`, và ngược lại.
5. Script thực tế: `node docs/v2/tu-khoa/gan-tu-khoa.mjs`. Đầu ra `docs/v2/tu-khoa/gan-tu-khoa.csv` (cột `tu_khoa, luong_tim, page_id, so_quy_tac_khop`) và `docs/v2/tu-khoa/gan-tu-khoa-bao-cao.md`.
6. Số liệu đã đo:

| vòng | tổng từ khóa | LOẠI (số / lượng) | đã gán (số / lượng phủ phần không LOẠI) | chưa gán |
|---|---:|---:|---:|---:|
| 1 (đã chạy) | 11.212 | 2.584 / 727.250 | 8.474 / 100,0% | 154 / 1.950 |
| 2 (quy tắc mục 12, **chưa chạy**) | 11.212 | dự kiến tăng vài trăm từ khóa đuôi, lượng tăng ít | dự kiến ≥ 99% lượng | dự kiến tăng (đuôi bị gỡ khỏi hub) |

Số vòng 2 là **dự kiến**, chưa đo. Claude Code chạy lại rồi ghi số thật vào bảng này.

## 12. Vòng 2 gán từ khóa

Vòng 1 phủ đủ lượng tìm nhưng hub hút đuôi dài sai ý định, nhiều trang lá trống. Vòng 2 sửa `16-quy-tac-gan-tu-khoa.json` (viết lại toàn bộ thứ tự) và thêm 2 trang vào `16-seo-trang.csv`.

### 12.1. Thay đổi chính

**Thứ tự `uu_tien` mới**

| khoảng | nhóm |
|---|---|
| 10–94 | Mọi nhóm LOẠI, kể cả thương hiệu và người nổi tiếng |
| 95–111 | Trang đặc thù cần chạy sớm: NGUON-SACH, HD, KT-SOSANH, TAROT-LA → TAROT, DTC, GM-CHUDE → GM, KT-NHANTUONG, HOME (chỉ danh sách trắng neo `^…$`), PP-*, KT-HAILASO, KT-KHACNHAU, KT-AMLICH |
| 115–212 | LICH-NGAY, mùa vụ, XN-VIEC-THANG → các trang XN theo việc → XN-CHONNGAY → XN-THANG, văn khấn, LICH-* |
| 230–294 | XT-*, XT-CAP-IDX, PT-CUNGPHI-LEAF → PT-CUNGPHI, XT-VOCHONG (kéo lên 248, trước CC-SINHNAM), CC-*, PT-HOIDAP, BT-* |
| 300–426 | TUVI-* (TUVI-SAOCUNG trước PHUTINH, CHINHTINH; TUVI-SAO-IDX, TUVI-CUNG-IDX trước TUVI-CUNG), PT-*, KD-*, TSH-*, CT-* (CT-NHA trước CT-BANDOSAO) |
| 600–690 | Hub. Mỗi hub có tru chặn đuôi thuộc trang lá; TUVI, PT, HOME có danh sách trắng neo `^…$` |

**Nhóm LOẠI mới hoặc mở rộng**

| nhóm | nhận gì (ví dụ đã thấy trong `gan-tu-khoa.csv`) |
|---|---|
| `LOAI:thay_dia_phuong_dich_vu` (mới) | "xem bói hà nội", "xem bói gò vấp", "xem bói mà phượng quận 1", "bói bài dương gia thủ đức", "tarot hà nội", "thầy cúng uy tín tại hà nội" |
| `LOAI:diem_bao_dan_gian` (mới) | "xem bói giật mắt trái", "xem bói ù tai", "phong thủy rắn vào nhà", "phong thủy mèo đến nhà", "xem bói bằng chân gà", "xem bói kiếp trước" |
| `LOAI:nhieu_thiet_bi_thu_tuc` (mới) | "xem ngày active iphone", "xem ngày bảo hành samsung", "xem ngày phát hành thẻ vpbank", "xem ngày vào đoàn", "tuổi hợp pháp", "tuổi nào cho em hợp âm" |
| `LOAI:nhieu_game_phim_nhac` | thêm "cung mệnh 1 yae miko", "cung mệnh escoffier", "cung mệnh băng nhà lữ hành", phim, truyện, anime, game TFT (chiêm tinh riven, samira…), game võ hiệp (ngũ hành vltk, tlbb) |
| `LOAI:nhieu_khac_nghia` | thêm quy tắc riêng cho "tứ trụ" nghĩa chính trị, thể thao, kpop (khoảng 100 từ khóa vòng 1 nằm ở hub BT); "rửa bát tự động", "râu bát tự", y học cổ truyền, đồng hồ lịch vạn niên |
| `LOAI:thuong_hieu_doi_thu` | thêm "tử vi eva/khâm thiên/uyên minh/rosy/voz…", kênh phong thủy (mixi, master phùng phương, gia nguyễn…), "xem tướng net", vansu, huyenbi, lichngay… |
| `LOAI:nguoi_noi_tieng` | thêm donald trump, obama, kim jong un, nghệ sĩ kpop trong cụm cung hoàng đạo |
| `LOAI:chi_tay_sinh_trac`, `LOAI:not_ruoi`, `LOAI:y_te_sinh_mo`, `LOAI:tang_le_trung_tang`, `LOAI:vat_pham`, `LOAI:sim_bien_so_so_dep`, `LOAI:sao_han_tra_cuu`, `LOAI:tu_vi_hang_ngay` | thêm bàn tay, bàn chân, mụn ruồi; chọn giới tính con, ngày dự sinh; nhập mộ, lăng mộ; ví tiền, đeo nhẫn; số đt, số tài khoản; "sao vận hạn"; "tử vi ngày 20 11 2026", tử vi theo 12 cung hoàng đạo |

**Gán nhầm cụ thể đã sửa**

| từ khóa | vòng 1 | vòng 2 | cách sửa |
|---|---|---|---|
| sao thiên phủ; sao thiên phủ cung mệnh; cung mệnh liêm trinh thiên phủ | VK-DENPHU | TUVI-CHINHTINH; TUVI-SAOCUNG | VK-DENPHU tru "thiên phủ, tử phủ, liêm trinh" |
| lịch âm phủ; ngũ hành lục phủ ngũ tạng | VK-DENPHU | LICH; LOẠI | tru "âm phủ, lục phủ" |
| cung mệnh diên niên / lục sát / thiên y / họa hại / bát quái | TUVI-CUNG | PT-CUNGPHI | quy tắc PT-CUNGPHI bắt "cung mệnh + 8 sao bát trạch", TUVI-CUNG tru các từ này |
| cung mệnh khôn là gì; cung mệnh khảm thủy là gì | PT-CUNGPHI | PT-CUNGPHI-LEAF | trang lá mới chạy trước |
| cung mệnh không có chính tinh | PT-CUNGPHI (regex "khôn" khớp "không") | TUVI-CUNG | neo `khôn( \|$)` |
| năm 1992 hợp với tuổi nào lấy vợ; tuổi hợp với nữ 2003 | CC-SINHNAM | XT-VOCHONG | XT-VOCHONG lên 248, CC-SINHNAM tru "vợ, chồng, tuổi hợp" |
| tam tai 1995; 1991 tam tai vào năm nào; 2002 có kim lâu không | CC-SINHNAM | XT-TAMTAI; XT-KIMLAU | bỏ tru năm sinh ở XT-TAMTAI, XT-KIMLAU, XT-HOANGOC, XT-NAMTUOI |
| tuổi dậu hợp màu gì 2005; màu hợp mệnh nữ 2002 | CC-SINHNAM | CC-MAUHOP | CC-SINHNAM tru "màu" |
| hướng nhà tuổi 1984 nam mạng; cung mệnh nam 1992 | CC-SINHNAM | PT-HUONGNHA; PT-CUNGPHI | CC-SINHNAM tru "hướng, cung mệnh" |
| lịch âm tiếng anh là gì; lịch âm khmer; lịch âm khác lịch dương như thế nào | LICH | KT-AMLICH (mới) | quy tắc 111 |
| bói bài quan âm; bói bài khổng minh | TAROT | PTUC-XINXAM | TAROT tru, XINXAM thêm mẫu |
| bói bài kinh dịch; bói bài mai hoa; bói bài bát quái | TAROT | KD-GIEOQUE; KD-MAIHOA; KD-QUAI | TAROT tru |
| kinh dịch và tarot cái nào đúng hơn | TAROT | KT-SOSANH | KT-SOSANH lên 97, thêm tarot |
| phong thuỷ lông mày; phong thuỷ răng; xem bói răng | PT; HOME | KT-NHANTUONG | mẫu "phong thủy/xem bói + bộ phận mặt" |
| nằm mơ thấy rắn đen (và mọi "mơ thấy X") | GM | GM-CHUDE | trang lá chạy trước hub |
| lịch vạn niên tháng 8/2026; lịch âm dương tháng 10/2026 | LICH-VANNIEN; LICH | LICH-THANG | regex tháng nhận cả dấu "/" |
| xem tuổi vợ chồng theo ngày tháng năm sinh | XT | XT-VOCHONG | bỏ tru "ngày" |
| lá số tử vi sinh ở nước ngoài; sinh đôi | TUVI-LAPLASO | KT-HAILASO | quy tắc mới, KT-KHACNHAU bỏ "lá số" |
| phong thủy cây lưỡi hổ; ao cá trước nhà; cột điện trước cổng | PT | PT-HOIDAP (mới) | quy tắc 269 |

### 12.2. Trang mới

| page_id | URL | nhận gì | lý do |
|---|---|---|---|
| KT-AMLICH | /kien-thuc/am-lich-la-gi | câu hỏi kiến thức về âm lịch (là gì, tiếng Anh, nguồn gốc, khác lịch dương, lịch Khmer) | Hub LICH là công cụ "hôm nay"; câu hỏi định nghĩa cần bài viết riêng. "lịch âm tiếng anh là gì" có 500 lượt |
| PT-HOIDAP | /phong-thuy/hoi-dap | đuôi "phong thủy + cây, ao, cổng, bếp, gương, giường, chung cư…", "mệnh gì hợp trồng cây" | Gom khoảng 50 đuôi lẻ khỏi hub PT. Bài FAQ, không bán vật phẩm. Tách trang riêng khi một chủ đề vượt khoảng 5K lượt/tháng |

Trang 16-seo-trang.csv khác: PT bỏ "phong thủy kê giường ngủ" khỏi `tu_khoa_phu` (chuyển sang PT-HOIDAP), thêm PT-HOIDAP vào `lien_ket_ra`.

### 12.3. Trang lá, trang lập trình được nhận từ khóa nhờ vòng 2

GM-CHUDE, TAROT-LA (tarot death card, king of cups, kẻ khờ, tarot số 17…), TUVI-SAOCUNG (tử vi cư ngọ, sao X cung mệnh), TUVI-SAO-IDX (ngũ hành của 14 chính tinh), TUVI-CUNG-IDX (cung mệnh ở đâu trong lá số tử vi), LICH-NGAY (xem ngày 20 11 2026, lịch âm mùng 5 tháng 9), LICH-NGAYLE-IDX (âm lịch hôm nay là ngày lễ gì), LICH-TIETKHI (cúng lập thu), BT-THAPTHAN (ngũ hành và thập thần), XT-CAP-IDX (tuổi hợp tý, tuổi gì hợp với hợi, xem tuổi tam hợp), PT-CUNGPHI-LEAF, CT-NHA (ic trong bản đồ sao, bản đồ sao các nhà), XN-VIEC-THANG (ngày tốt cắt tóc tháng 8), KT-HAILASO. XT-CAP giữ 2 từ khóa ("nam tuổi mão nữ tuổi thìn có hợp nhau không").

### 12.4. Trang vẫn không nhận từ khóa và lý do

| page_id | lý do |
|---|---|
| PP, PP-CHUANBIENTAP, PP-NGUOIDUYET, NGUON, TUDIEN, KT | Trang E-E-A-T hoặc điều hướng. Không cần từ khóa riêng; giá trị nằm ở link nội bộ và tín hiệu tin cậy |
| GOI | Trang giao dịch, người vào từ CTA trong trang. Không nhắm từ khóa |
| LICH-TIETKHI-IDX, LICH-NGAYLE, CC-NAPAM-IDX, VK-RAMGIENG | `tat-ca-tu-khoa.csv` **không có** từ khóa phù hợp (đã grep "tiết khí", "nạp âm", "đoan ngọ", "thanh minh", "văn khấn rằm tháng giêng": không ra dòng nào). Giữ trang vì cấu trúc (chỉ mục, nền bát tự); xét lại khi có dữ liệu GSC hoặc bộ từ khóa mới |

### 12.5. Quyết định có lệch so với yêu cầu soát tay

- "tử vi trọn đời tuổi X" vẫn về TUVI-TRONDOI, không tách sang TUVI-NAM-TUOI: 16-seo-trang.csv đã ghi trang này nhận cụm đó và giải thích vì sao không làm "trọn đời theo tuổi".
- "tuổi X hợp màu gì" (không có năm) vẫn về CC-CONGIAP theo thiết kế; có năm sinh thì về CC-MAUHOP.
- "xem bói" + chủ đề chung (công việc, tương lai, trẻ em, gia đạo) vẫn để HOME vì không có trang sâu hơn. HOME không còn nhận địa phương, bàn tay, bàn chân, nốt ruồi, giật mắt, ù tai.
- Đuôi tên riêng không rõ ("oner mệnh gì", "phúc mệnh gì") để **chưa gán** thay vì ép vào hub CC.

### 12.6. Độ chính xác ước tính

Cách làm: lấy 10 cụm × 30 dòng liên tiếp, cách đều nhau khoảng 1.120 dòng trong `gan-tu-khoa.csv` (dòng 2, 1120, 2240, 3360, 4480, 5600, 6720, 7840, 8960, 10080). Tổng **300 từ khóa**. Em áp quy tắc vòng 2 bằng tay cho từng từ khóa (không chạy được script), rồi chấm đúng hay sai ý định.

| cụm (dòng đầu) | chủ đề chính | đúng / 30 | sai |
|---|---|---:|---|
| 2 | lịch âm, mệnh theo năm | 30 | — |
| 1120 | tử vi theo tuổi | 30 | — |
| 2240 | giải mộng, giờ hoàng đạo | 29 | "giờ hoàng đạo hôm nay để thắp hương" về VK-GIATIEN thay vì LICH-GHD |
| 3360 | nhân tướng học | 30 | — |
| 4480 | tuổi hợp, kim lâu | 30 | — |
| 5600 | bói bài | 30 | — |
| 6720 | kinh dịch | 29 | "kinh dịch và phong thủy" về PT thay vì KD |
| 7840 | sao hạn, sim | 30 | — |
| 8960 | xem bói, bát tự | 27 | "xem an mệnh hoà duyên" (2 từ khóa, có thể là thương hiệu) về KT-MENH; "xem bói an cư lợi hại" về HOME, chưa rõ ý định |
| 10080 | số chủ đạo, xem tuổi | 27 | "xem tuổi anh em có hợp nhau không" (2 từ khóa) về XT-VOCHONG thay vì XT; "xem tuổi an cư lợi hại" chưa rõ ý định |
| **Tổng** | | **292 / 300 (97,3%)** | |

Giới hạn của con số này:
- Mẫu là cụm liên tiếp, không ngẫu nhiên từng dòng. Tệp xếp theo lượng rồi theo chữ cái, nên mỗi cụm thường cùng một chủ đề. Sai số thật có thể lớn hơn ±2 điểm phần trăm của mẫu ngẫu nhiên cỡ 300.
- Em chấm bằng tay theo regex, có thể sót trường hợp regex khớp ngoài dự tính. Con số chỉ có giá trị sau khi Claude Code chạy lại và đối chiếu cột `page_id` mới với bảng trên.
- Tính theo lượng tìm, độ chính xác cao hơn: 10 từ khóa lớn nhất (≈ 13,5 triệu lượt) và toàn bộ cụm "{năm} mệnh gì" đều về đúng trang.
- Ước tính thận trọng cho toàn bộ tệp: **khoảng 90–95% theo số từ khóa**, phần thiếu nằm ở đuôi dài lượng 0–50.

### 12.7. Việc Claude Code cần kiểm khi chạy lại

1. JSON hợp lệ, mọi regex biên dịch được (có dùng lookahead `(?=` ở CC-SINHNAM, cú pháp JavaScript hợp lệ).
2. Ghi số thật vào bảng mục 11.6.
3. Xem lại danh sách "Trang trong CSV không nhận từ khóa nào". Ngoài các trang ở mục 12.4, nếu còn trang nào trống thì báo em.
4. Soát 30 từ khóa lớn nhất của: HOME, TUVI, PT, XN, TAROT, CC-SINHNAM, PT-HOIDAP, KT-AMLICH, `LOAI:thay_dia_phuong_dich_vu`, `LOAI:nhieu_khac_nghia` (quy tắc "tứ trụ" và các mẫu ngắn như "tăm ", "trung tâm" có thể bắt nhầm).
5. Mục "khớp từ 3 quy tắc trở lên": với thứ tự mới, phần lớn là LOẠI khớp chồng hoặc trang lá khớp cùng hub của nó; đó là chủ ý, không phải lỗi.

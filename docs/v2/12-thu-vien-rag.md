# 12 — Thư viện RAG huyền học: khảo sát nguồn và kế hoạch nạp

> Ngày lập: **21/11/2026**. Bảng đầy đủ: [`12-thu-vien-rag.csv`](12-thu-vien-rag.csv) (314 nguồn, UTF-8 có BOM, 15 cột; trong ô dùng dấu `;` thay dấu phẩy).
> Đầu vào: [`07`](07-bach-khoa-huyen-hoc.md), [`07b`](07b-phan-loai-huyen-hoc.md) (18 mảng A–R), [`08`](08-tu-khoa-uu-tien.md) (công cụ P1), `tai-san-xemtuvi/docs/nghien-cuu/luan-giai-12-cung.md` (nguồn kho câu hiện có).
> **Phạm vi lần này: chỉ khảo sát và lập danh mục. Chưa tải sách nào.**
> Nhãn: `[CHƯA KIỂM]` = chưa xác minh. `[SUY LUẬN]` = suy ra, chưa có bằng chứng trực tiếp.

---

## 0. Kết luận nhanh

1. **314 nguồn**: **A 164** (nạp được), **B 102** (phải đọc điều khoản hoặc xin phép), **C 48** (còn bản quyền). **197** URL đã mở bằng WebFetch hoặc thấy trong kết quả WebSearch (`da_kiem_url=co`), **117** chưa mở (phần lớn là repo Kanripo và tệp daizhige: tên lấy từ danh mục đã mở, chưa mở từng tệp).
2. **Xương sống là văn bản cổ loại A.** Có hai nguồn văn bản sạch, không cần OCR: **Kanripo** (51 sách thuật số của Tứ khố 術數類 + sách lịch + Dịch học; CC BY-SA 4.0) và **zh.wikisource** (Tử Vi Đẩu Số toàn thư, Uyên hải Tử Bình, Trích thiên tủy, Hỏa châu lâm, Chu Dịch…).
3. **Tử vi có rất ít văn bản cổ.** Chỉ có *Toàn thư* (Wikisource + bản khắc Minh trên archive.org) và bản *Tục Đạo tạng* (chép nhiều lỗi). Các sách Việt mà kho câu đang dựa vào (Thái Thứ Lang, Thiên Lương, Hoàng Thường – Hàm Chương, Nguyễn Phát Lộc) **đều là C**: chưa tìm được năm mất tác giả. Bản quét của chúng trên archive.org do người dùng tải lên, không có bằng chứng được phép.
4. **Bản dịch tiếng Việt hiện đại phần lớn là C.** Chỉ có hai bản dịch Kinh Dịch chắc chắn đã hết hạn: **Ngô Tất Tố** và **Phan Bội Châu**. Cộng thêm *Việt Nam phong tục* của Phan Kế Bính.
5. **Phát hiện đáng giá:** một bộ **~110 bản quét sách thuật số Minh–Thanh** trên archive.org (chủ đề "Thuật số", tải lên 5/2026; có Bát trạch minh kính, Địa lý ngũ quyết, Ngọc đường thông thư, Bốc phệ chính tông, bản Minh của Tử Vi Đẩu Số toàn thư). Ngoài ra có **lịch Hiệp kỷ triều Nguyễn 1942 và 1944** cùng sách địa lý **Tả Ao** (Thư viện số Hán Nôm, Columbia).

---

## 1. Tóm tắt số nguồn

### 1.1. Theo loại pháp lý

| Loại | Số nguồn | Gồm chủ yếu |
|:-:|--:|:--|
| **A** | **164** | Kanripo 71 · Wikisource 26 · bản quét archive.org 35 · Ngô Tất Tố + Phan Bội Châu 2 · Waseda/NDL/Wellcome 6 · danh mục Kanripo 2 · bộ dữ liệu MIT/CC0/CC BY 11 · sách Tây PD 11 |
| **B** | **102** | daizhige 38 · ảnh NLC trên archive 12 · Thư viện số Hán Nôm/Columbia/BL/BnF 21 · kho và nền tảng khác (ctext, NCL, Academia Sinica, Waseda, NDL, NLC) 9 · bộ dữ liệu không rõ giấy phép 9 · sách Tây chưa rõ năm mất 9 · bản quét chưa rõ bản in 3 · Tạp chí Hán Nôm 1 |
| **C** | **48** | Sách tử vi Việt 10 · sách Việt hiện đại khác 11 · học thuật (luận văn, sách, bài báo) 21 · bộ dữ liệu CC BY-NC 4 · khác 2 |

### 1.2. Theo mảng (mảng chính của từng dòng; mã theo 07b)

| Mảng | Số | Ghi chú |
|:--|--:|:--|
| H Kinh Dịch | 64 | Mảng giàu nguồn A nhất (Kanripo KR1a, Wikisource, Ngô Tất Tố, Phan Bội Châu, sách Nôm 1880) |
| R Nền tảng/khác | 58 | Kho, thư mục (Tứ khố đề yếu), lục nhâm, kỳ môn, thái ất (mức tham khảo), học thuật chung |
| G Phong thủy | 51 | Táng thư, Hám long kinh, Bát trạch minh kính, Địa lý ngũ quyết, Tả Ao |
| D Bát tự | 30 | Tam mệnh thông hội, Uyên hải Tử Bình, Trích thiên tủy, Cùng thông bảo giám, Lạc Lộc Tử |
| A Lịch | 23 | Kanripo 天文算法類, Hiệp kỷ lịch Nguyễn, bài Tạp chí Hán Nôm |
| M Tướng số | 23 | Chỉ tham khảo (M2 bị phủ quyết ở 07 mục 4.4) |
| C Tử vi | 20 | 3 nguồn cổ A; còn lại C hoặc học thuật |
| E Xem ngày | 13 | Hiệp kỷ biện phương thư, Ngọc hạp ký, các bộ thông thư Minh |
| K Chiêm tinh | 12 | Tetrabiblos, Alan Leo, Lilly |
| P Phong tục | 6 | Việt Nam phong tục (A); Toan Ánh (C) |
| J Thần số | 5 | Toàn bộ là sách Tây đầu thế kỷ 20; phần lớn B |
| B Can chi | 3 | Nhưng nạp âm, thần sát còn nằm trong Tam mệnh thông hội, Ngũ hành đại nghĩa, Hiệp kỷ biện phương thư |
| I, O, F, L | 2 · 2 · 1 · 1 | Chỉ lưu danh mục; I, O không làm năm 2027 |
| N, Q | 0 | Không tìm nguồn (Đặt tên con và Human Design xếp "Sau" ở 08) |

### 1.3. Theo loại nguồn

`sach_co` 227 · `sach_hien_dai` 24 · `hoc_thuat` 33 · `bo_du_lieu` 30 (đếm bằng Grep trên CSV).

---

## 2. Cách xếp pháp lý và cách tính bản quyền

**A** = phạm vi công cộng hoặc giấy phép mở → nạp RAG được (vẫn ghi công khi giấy phép yêu cầu).
**B** = có bản số nhưng điều khoản trang cấm thu thập tự động, không ghi giấy phép, hoặc tình trạng chưa rõ → đọc điều khoản và xin phép trước.
**C** = còn bản quyền → chỉ nạp khi mua quyền hoặc được phép. Trên trang chỉ trích ngắn, kèm dẫn nguồn.

**Thời hạn theo luật Việt Nam:** quyền tài sản của phần lớn tác phẩm được bảo hộ suốt đời tác giả và **50 năm tiếp theo năm tác giả mất**, chấm dứt lúc 24 giờ ngày 31/12 của năm cuối (khoản 2 Điều 27 Luật Sở hữu trí tuệ, theo [LuatVietnam](https://luatvietnam.vn/tin-phap-luat/het-thoi-han-bao-ho-so-huu-tri-tue-thi-tac-pham-thuoc-ve-ai-230-30900-article.html) và [Thư viện Pháp luật](https://thuvienphapluat.vn/hoi-dap-phap-luat/quyen-tac-gia-duoc-bao-ho-bao-lau-ke-tu-thoi-diem-tac-gia-qua-doi-138039157.html); **chưa đối chiếu văn bản luật gốc bản hợp nhất 2022** `[CHƯA KIỂM]`).

Cách tính tại năm 2026: **tác giả mất trong năm 1975 hoặc trước đó → đã hết hạn.** Ví dụ: mất năm 1975 → bảo hộ đến hết 31/12/2025 → từ 01/01/2026 thuộc công cộng.

| Tác giả | Năm mất | Kết quả | Căn cứ năm mất |
|:--|:-:|:--|:--|
| Phan Kế Bính | 1921 | Hết hạn từ 1972 → **A** | Bài báo SGGP/Đại biểu Nhân dân trong kết quả tìm kiếm; Wikisource gắn mẫu PD |
| Ngô Tất Tố | 1954 | Hết hạn từ 2005 → **A** | Hiểu biết chung + vi.wikisource gắn mẫu PD cho bản dịch `[nên đối chiếu]` |
| Phan Bội Châu | 1940 | Hết hạn → **A** | Hiểu biết chung `[nên đối chiếu]` |
| Nguyễn Hiến Lê | 1984 | Bảo hộ đến hết **31/12/2034** → **C** | Kết quả tìm kiếm (1912–1984) |
| Toan Ánh | 2009 | Đến hết **31/12/2059** → **C** | Kết quả tìm kiếm (mất 14/5/2009) |
| Thu Giang Nguyễn Duy Cần | thường ghi 1998 | **C** | Chưa tìm được nguồn trong phiên |
| Trần Văn Giáp (dịch *Vân đài loại ngữ*) | chưa kiểm | Nếu mất trước 1976 thì bản dịch là A | `[CHƯA KIỂM]` |
| Vân Đằng Thái Thứ Lang · Thiên Lương · Hoàng Thường · Hàm Chương · Nguyễn Phát Lộc · Song An Đỗ Văn Lưu · Bửu Cầm | **chưa tìm được** | Xếp **C** cho an toàn | Không có nguồn nào trong lần tra này |

Ghi nhớ: **bản dịch là tác phẩm phái sinh có quyền riêng của dịch giả**, kể cả khi nguyên tác đã thuộc công cộng.

---

## 3. 30 nguồn nên nạp trước

Tiêu chí: loại **A**; phục vụ **tử vi** (sản phẩm đang bán) và công cụ P1 ở 08: từ điển 12 cung + 14 chính tinh, lịch âm, mệnh theo năm sinh + 60 hoa giáp + nạp âm, xem tuổi vợ chồng, **bát tự** (08 đưa lên P1), sau đó là **Kinh Dịch** (đầu P2). Văn bản sạch được ưu tiên hơn ảnh quét.

| # | Mã CSV | Nguồn | Mảng / công cụ | Dạng |
|:-:|:--|:--|:--|:--|
| 1 | WS01 | 紫微斗數全書 *Tử Vi Đẩu Số toàn thư* (Wikisource) | C4, C5, C6, C7 | văn bản |
| 2 | AR01 | 新鐫希夷陳先生紫微斗數全書, bản khắc Minh (archive) | đối chiếu WS01 | ảnh → OCR |
| 3 | WS02 | 紫微斗數, bản Tục Đạo tạng (Wikisource) | đối chiếu, lịch sử văn bản | văn bản (nhiều lỗi) |
| 4 | KR3g0042 | 三命通會 *Tam mệnh thông hội* (Kanripo, đủ 12 quyển) | D1, B1 nạp âm, thần sát | văn bản |
| 5 | KR3g0051 | 欽定協紀辨方書 *Hiệp kỷ biện phương thư* (Kanripo) | A, E1, B (thần sát ngày, trực, hoàng đạo) | văn bản |
| 6 | KR3g0050 | 御定星歷考原 *Tinh lịch khảo nguyên* | A, E, B | văn bản |
| 7 | WS03 | 淵海子平大全 *Uyên hải Tử Bình* (+ AR02 bản khắc) | D1, D2 thập thần | văn bản |
| 8 | WS05 | 滴天髓 *Trích thiên tủy* (42 thiên) | D1 | văn bản |
| 9 | TV04 | 窮通寶鑑欄江綱 *Cùng thông bảo giám* (Waseda) | D1 điều hậu | ảnh → OCR |
| 10 | KR3g0037 | 珞琭子三命消息賦註 (Từ Tử Bình chú) | D1, nguồn gốc Tử Bình | văn bản |
| 11 | KR3g0033 | 李虛中命書 *Lý Hư Trung mệnh thư* | D1, lịch sử | văn bản |
| 12 | KR3g0041 | 星學大成 *Tinh học đại thành* | D, thần sát chung với tử vi | văn bản |
| 13 | WS15 | 五行大義 *Ngũ hành đại nghĩa* | B1–B4 ngũ hành, can chi | văn bản |
| 14 | WS16 + WS17 | 四庫全書總目提要 q.108–109 (術數類) | trang `/nguon`: mô tả 50 sách, tranh luận tác giả | văn bản |
| 15 | KR1a0001 | 周易 chính văn | H1 | văn bản |
| 16 | WS13 | 周易 kèm Thập dực | H1 | văn bản |
| 17 | KR1a0031 | 原本周易本義 (Chu Hy) | H1 | văn bản |
| 18 | KR1a0016 | 伊川易傳 (Trình Di) | H1 | văn bản |
| 19 | WS25 + VN10 | *Kinh Dịch*, Ngô Tất Tố dịch | H1, nguồn tiếng Việt chính | văn bản + ảnh |
| 20 | VN11 | *Quốc văn Chu Dịch diễn giải*, Phan Bội Châu | H1 | ảnh → OCR |
| 21 | AR35 | 周易六十四卦解音, sách Nôm 1880 | H1, góc nhìn Việt | ảnh → OCR Nôm |
| 22 | KR3g0030 | 京氏易傳 *Kinh thị Dịch truyện* | H5 lục hào (nạp giáp) | văn bản |
| 23 | WS09 | 火珠林 *Hỏa châu lâm* | H3, H5 | văn bản |
| 24 | WS06 | 梅花易數 *Mai hoa Dịch số* | H4 | văn bản |
| 25 | WS24 | *Việt Nam phong tục*, Phan Kế Bính (1915) | P, E, G (các mục Bốc phệ, Địa lý, Xem ngày kén giờ, Kiêng kỵ) | văn bản |
| 26 | WS12 | 玉匣記 *Ngọc hạp ký* | E1, E5 (nguồn của nhiều sách "ngọc hạp" dân gian) | văn bản |
| 27 | AR03 | 八宅明鏡 *Bát trạch minh kính* | G1, G2, F (cung phi) | ảnh → OCR |
| 28 | KR3g0019 + KR3g0020 | 宅經 *Trạch kinh* + 葬書 *Táng thư* | G (nền lý thuyết) | văn bản |
| 29 | WS26 / TX18 | Legge, *The Yî King* (1882) | H1, đối chiếu bản Anh | văn bản |
| 30 | TX01 | Ptolemy, *Tetrabiblos* (Ashmand 1822) | K1–K3 (P2 Q4) | văn bản |

**Không có nguồn A tốt cho thần số học (J1).** Các sách nền (Balliett, Clement, Taylor) đều là B vì chưa rõ năm mất tác giả. Mục từ điển thần số tạm dựa vào phần "cách tính" tất định, chưa dựa vào RAG.

---

## 4. Lộ trình 3 đợt nạp

| Đợt | Thời điểm `[GIẢ ĐỊNH]` | Nạp gì | Điều kiện | Khối lượng `[ƯỚC LƯỢNG]` |
|:-:|:--|:--|:--|:--|
| **1** | Sau khi anh duyệt danh mục; không chen trước R1 và bản Tết (04) | Văn bản sạch loại A: Kanripo (KR3g, KR1a đã chọn, KR3f0018), Wikisource (WS01–WS17, WS24–WS25). Kèm bảng thuật ngữ Hán ↔ Việt cho 114 sao, 10 can, 12 chi, 60 hoa giáp, 64 quẻ | Ghi công CC BY-SA; không cần OCR | Khoảng 30–40 sách, vài chục MB văn bản |
| **2** | Khi làm bát tự (6/2027) và Kinh Dịch (Q3/2027) | (a) **OCR** các bản quét A: AR01–AR32, TV04, VN10, VN11, AR35. (b) **Nguồn B sau khi xin phép:** daizhige (Tử Bình chân thuyên, Trích thiên tủy xiển vi, Cùng thông bảo giám, Thần phong thông khảo), Thư viện số Hán Nôm + Columbia (Hiệp kỷ lịch, Tả Ao), ctext API. (c) Bài Tạp chí Hán Nôm về lịch (chỉ để biên tập viên đọc, không đưa nguyên văn ra trang) | Thư trả lời đồng ý của từng nơi; có quy trình kiểm OCR (người duyệt soát mẫu 5%) | OCR chữ Hán dọc là khâu tốn công nhất `[CHƯA KIỂM công cụ OCR]` |
| **3** | Từ Q4/2027, nếu có ngân sách | Sách **C** đã mua quyền hoặc được phép: Tân Biên, Nghiệm Lý, Khảo Luận, Tử Vi Hàm Số (nếu tìm được người giữ quyền). Sách Tây K, J (sau khi kiểm năm mất). Học thuật cho khối "Khoa học nói gì" (Carlson 1985, các kỷ yếu NYCU) chỉ ở dạng **tóm ý + dẫn nguồn** | Hợp đồng hoặc thư cho phép bằng văn bản | Phụ thuộc đàm phán |

Nguyên tắc chung: **RAG chỉ là công cụ tra cho người biên tập và cho phần luận giải trả phí.** Mọi câu đưa lên trang từ điển vẫn qua người duyệt (07 mục 3.4). Nguồn C dù đã nạp cũng không được hiển thị nguyên đoạn dài.

---

## 5. Cấu trúc lưu trong PostgreSQL 16 + pgvector

### 5.1. Bảng

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Một dòng = một nguồn (khớp cột `ma` của 12-thu-vien-rag.csv)
CREATE TABLE nguon (
  id              bigserial PRIMARY KEY,
  ma              text UNIQUE NOT NULL,
  ten_goc         text NOT NULL,
  ten_han_viet    text,
  tac_gia         text,
  nien_dai        text,
  ban_in          text,              -- 文淵閣四庫全書, khắc bản Nam Dương Đường 1600…
  ngon_ngu        text[],
  mang            text[],            -- {'C','D'}
  loai_nguon      text,
  url             text,
  phap_ly         char(1) NOT NULL CHECK (phap_ly IN ('A','B','C')),
  giay_phep       text,              -- 'PD', 'CC BY-SA 4.0', 'thư cho phép số …'
  ghi_cong        text,              -- dòng ghi công bắt buộc hiện trên trang
  duoc_trich_dai  boolean NOT NULL DEFAULT false,  -- false với B/C chưa có phép
  sha256          text,              -- băm tệp gốc lúc nạp
  ngay_nap        date,
  trang_thai      text               -- 'danh_muc' | 'da_nap' | 'tam_dung'
);

-- Một dòng = một đoạn (chunk)
CREATE TABLE doan (
  id            bigserial PRIMARY KEY,
  nguon_id      bigint NOT NULL REFERENCES nguon(id),
  duong_dan     text[] NOT NULL,     -- {'卷一','諸星問答論','天機'}
  thu_tu        int NOT NULL,        -- thứ tự trong nguồn, để ghép lại ngữ cảnh
  loai          text NOT NULL,       -- 'chinh_van' | 'chu' | 'so' | 'phu' | 'bang'
  van_ban       text NOT NULL,       -- nguyên văn, giữ nguyên dị thể
  van_ban_chuan text,                -- đã chuẩn hóa: giản → phồn, dị thể → chính thể
  han_viet      text,                -- phiên âm Hán Việt do máy sinh (có cờ trong meta)
  dich_vi       text,                -- bản dịch nếu có
  dich_vi_nguon_id bigint REFERENCES nguon(id),  -- bản dịch có pháp lý riêng
  trang_anh     text,                -- số tờ/trang ảnh quét để người duyệt mở lại
  ocr_tin_cay   real,                -- NULL nếu là văn bản gốc
  embedding     vector(1024),
  tsv           tsvector,
  meta          jsonb
);
CREATE INDEX doan_hnsw ON doan USING hnsw (embedding vector_cosine_ops);
CREATE INDEX doan_tsv  ON doan USING gin (tsv);
CREATE INDEX doan_trgm ON doan USING gin (van_ban_chuan gin_trgm_ops);

-- Câu nào đã được dùng ở trang nào, ai duyệt
CREATE TABLE trich_dan (
  id          bigserial PRIMARY KEY,
  doan_id     bigint NOT NULL REFERENCES doan(id),
  trang       text NOT NULL,         -- '/tu-vi/sao/thien-co'
  ma_cau      text,                  -- khớp mã câu kho luận giải, ví dụ 'MENH-TL-01'
  kieu        text NOT NULL,         -- 'nguyen_van' | 'dich' | 'tom_y'
  cau_trich   text,
  nguoi_duyet text,
  ngay_duyet  date
);

-- Bảng thuật ngữ để nối câu hỏi tiếng Việt với văn bản chữ Hán
CREATE TABLE thuat_ngu (
  han       text NOT NULL,           -- 天機
  han_viet  text NOT NULL,           -- Thiên Cơ
  bien_the  text[],                  -- {'天机'}
  mang      text NOT NULL,
  PRIMARY KEY (han, mang)
);
```

Lý do thiết kế:
- `phap_ly` và `duoc_trich_dai` nằm ở **nguồn**. Truy vấn sinh trang lọc `WHERE duoc_trich_dai` trước khi cho phép hiện nguyên văn dài.
- `trich_dan` nối thẳng với khối 3 và khối 8 của khuôn mục từ điển (07 mục 2.3) và với mã câu của kho luận giải hiện có (`MENH-TL-01`…). Như vậy mỗi nhận định trên trang lần ngược được tới đúng quyển, thiên của sách.
- `pg_trgm` với chữ Hán phụ thuộc locale/ICU của cơ sở dữ liệu: **phải thử trên VPS** `[CHƯA KIỂM]`. Nếu không chạy thì tách chữ Hán thành bigram trong `tsv`.

### 5.2. Cách cắt đoạn văn cổ

1. **Cắt theo cấu trúc tự nhiên, không theo số token cố định.** Thứ bậc: quyển → thiên → mục → đoạn. Lưu cả đường dẫn vào `duong_dan`, và đặt đường dẫn ở đầu chuỗi đem nhúng (ví dụ `紫微斗數全書 · 卷一 · 諸星問答論 · 天機`).
2. **Đơn vị theo thể loại:**
   - *Phú* (骨髓賦, 太微賦): mỗi đoạn 2–4 cặp câu đối, không cắt giữa cặp.
   - *Vấn đáp* (諸星問答論): một sao = một đoạn; dài quá thì tách theo câu hỏi.
   - *Mười hai cung*: một tổ hợp "sao × cung" = một đoạn, đúng khuôn trang `/tu-vi/sao/<sao>/<cung>`.
   - *Kinh Dịch*: một hào hoặc một lời quẻ = một đoạn. Truyện/chú của cùng hào là đoạn riêng (`loai='chu'`), nối bằng `meta.cha`.
   - *Bảng* (an sao, thần sát theo tháng, nạp âm): **không nhúng**. Lưu dạng JSON có cấu trúc trong `meta`, đối chiếu với engine.
3. **Độ dài mục tiêu: khoảng 150–400 chữ Hán mỗi đoạn** `[GIẢ ĐỊNH, cần đo lại]`. Văn Hán cổ rất đặc, đoạn dài làm loãng nghĩa. Gối đầu 1 câu giữa hai đoạn liền nhau, chỉ khi cùng thiên.
4. **Chính văn và chú tách riêng.** Bản Kanripo/Wikisource thường xen chú nhỏ trong ngoặc. Tách ra để khi trích không nhầm lời chú (đời sau) thành lời kinh.
5. **Chuẩn hóa nhưng giữ bản gốc.** daizhige dùng giản thể, Kanripo dùng phồn thể: cột `van_ban_chuan` đưa về một dạng (OpenCC giản → phồn, bảng dị thể) để tìm. Cột `van_ban` giữ nguyên để trích.
6. **Ảnh quét:** lưu số trang và độ tin cậy OCR. Đoạn có `ocr_tin_cay` thấp không được trích lên trang khi chưa có người soát.
7. **Câu hỏi tiếng Việt → văn bản Hán:** mở rộng truy vấn bằng `thuat_ngu` (Thiên Cơ → 天機), rồi tìm lai: vector + `tsv`/trigram, gộp điểm theo kiểu RRF `[SUY LUẬN: tên sao, tên cung là từ khóa chính xác nên tìm từ khóa sẽ mạnh hơn vector]`.

### 5.3. Mô hình embedding

Yêu cầu: nhúng được cả tiếng Việt lẫn chữ Hán cổ trong **cùng một không gian**, tự chạy trên VPS, giấy phép cho phép dùng thương mại, số chiều ≤ 2.000 để dùng chỉ mục HNSW kiểu `vector`. pgvector (bản 0.8.7) ghi: HNSW/IVFFlat cho `vector` tối đa **2.000 chiều**, `halfvec` tối đa **4.000 chiều** ([README pgvector](https://github.com/pgvector/pgvector)).

| Mô hình | Giấy phép | Chiều | Điểm mạnh | Điểm yếu / chưa kiểm |
|:--|:--|:-:|:--|:--|
| **BAAI/bge-m3** (đề xuất mặc định) | MIT ([HF](https://huggingface.co/BAAI/bge-m3)) | 1024 | Đa ngữ, rất phổ biến (~33 triệu lượt tải), có thêm vector thưa (sparse) hợp với tên sao/thuật ngữ | Chưa có số đo trên văn ngôn `[CHƯA KIỂM]` |
| **Qwen/Qwen3-Embedding-0.6B** (ứng viên số 2) | Apache-2.0 ([HF](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)) | 1024 (chỉnh được 32–1024) | 100+ ngôn ngữ, ngữ cảnh 32K, nhận chỉ dẫn (instruction), MTEB đa ngữ 64,33; nhà phát triển Trung Quốc nên có thể mạnh với chữ Hán `[SUY LUẬN]` | Bản 4B (2.560 chiều) và 8B (4.096 chiều) vượt giới hạn 2.000 → phải dùng `halfvec` hoặc cắt chiều |
| AITeamVN/Vietnamese_Embedding | Apache 2.0 ([HF](https://huggingface.co/AITeamVN/Vietnamese_Embedding)) | 1024 | Tinh chỉnh từ bge-m3 bằng ~300.000 bộ ba tiếng Việt, tốt cho câu hỏi Việt ↔ đoạn Việt | Có thể kém hơn bge-m3 gốc với chữ Hán `[SUY LUẬN]`; ngữ cảnh 2.048 token |

**Đề xuất:** bắt đầu bằng **bge-m3**, `vector(1024)`. Trước khi nạp đại trà, lập **bộ thử 100 câu hỏi tiếng Việt** (ví dụ "Thiên Lương ở Ngọ nghĩa là gì") kèm đoạn Hán đúng (lấy từ kho luận giải đã có mã câu). Đo recall@10 cho cả ba mô hình, có và không có mở rộng thuật ngữ, rồi chọn. Tốc độ chạy trên CPU của VPS: `[CHƯA KIỂM]`.

Không dùng: mô hình có giấy phép phi thương mại (ví dụ các bộ CC BY-NC). API embedding thương mại cũng dùng được, nhưng khi đó văn bản sẽ gửi ra ngoài; với nguồn C có thể vi phạm điều kiện cấp phép.

---

## 6. Rủi ro pháp lý và cách tránh

| # | Rủi ro | Nguồn liên quan | Cách tránh |
|:-:|:--|:--|:--|
| 1 | **Nạp bản quét sách Việt còn bản quyền** do người lạ tải lên archive.org | VN01–VN07, VN13, VN23 | Không tải. Mua bản in, tìm người giữ quyền (gia đình, NXB). Trong lúc chờ: chỉ trích ngắn + dẫn nguồn, như kho luận giải đang làm |
| 2 | **Bản dịch hiện đại của sách cổ** bị coi là "công cộng" vì nguyên tác cổ | VN08, VN16, VN18–VN21 | Luôn dịch từ nguyên văn Hán (A). Bản dịch người khác chỉ dùng tham khảo, không chép |
| 3 | **CC BY-SA** (Kanripo, Wikisource): nếu xuất bản lại văn bản đã chấm câu hay hiệu đính thì phải ghi công và chia sẻ cùng giấy phép | Mọi dòng KR, WS | Lưu nội bộ để tra; trích ngắn trên trang kèm dòng "Văn bản: Kanripo/Wikisource, CC BY-SA 4.0". Lời luận giải do xemboi viết là tác phẩm mới, không chép nguyên khối văn bản đã biên tập. Ranh giới "tác phẩm phái sinh" của bản dịch: **hỏi luật sư** |
| 4 | **Điều khoản cấm thu thập tự động** | ctext (trang ctext ghi rõ scraping vi phạm điều khoản), Gutenberg (cấm robot), NCL Đài Loan (dùng ngoài xem phải xin phép, có thể trả phí) | Không chạy crawler. Dùng API có khóa, bản tải chính thức hoặc mirror được phép, hoặc thư đồng ý |
| 5 | **Nguồn không rõ gốc** | daizhige (không giấy phép, không ghi nguồn số hóa), ảnh NLC, các bộ HF không thẻ | Xếp B. Chỉ dùng để đối chiếu, tìm chỗ khác nhau. Khi trích thì trích theo bản A (Kanripo/Wikisource/bản quét) |
| 6 | **Bộ dữ liệu máy sinh** bị dùng như "sách" | DS11–DS13 | Không dùng làm căn cứ. Vi phạm nguyên tắc "mỗi nhận định phải ghi nguồn sách" |
| 7 | **Giấy phép phi thương mại** (CC BY-NC) trên site có bán gói | DS11, DS12, DS14, DS19 | Loại khỏi RAG |
| 8 | **Dữ liệu cá nhân** (ngày sinh người thật) | DS24 | Không đăng lại; nếu dùng để thử engine thì xóa định danh (Luật 91/2025 đã nêu ở 07) |
| 9 | **Nội dung thuộc mảng bị phủ quyết** (giải mộng ra số, tướng mặt, văn sớ giải hạn, mộ táng) | AR37, DZ36, nhóm M, HN17, VN20 | Chỉ giữ ở mức danh mục. Bộ lọc từ cấm (07 mục 3.5) chạy trên mọi đầu ra của RAG |
| 10 | **Luật Việt Nam về khai thác văn bản và dữ liệu (TDM)** cho AI | Toàn bộ | Chưa kiểm có ngoại lệ TDM hay không `[CHƯA KIỂM]`. Mặc định coi việc nạp nguồn C là "sao chép" cần phép |

**Nguyên tắc chốt:** văn bản cổ loại A là xương sống. Sách và bản dịch tiếng Việt hiện đại phần lớn là C: dùng để người biên tập đọc và đối chiếu, chỉ trích ngắn kèm dẫn nguồn, không nạp nguyên văn khi chưa có phép.

---

## 7. Giới hạn của lần khảo sát này

- **Bị chặn hoặc không mở được:** kanripo.org và ctext.org (403), Gutenberg (503, `Retry-After` 6 giờ), Columbia DLC (chặn máy), NDL Search API (429 ở một lượt). Các URL của những trang này chỉ lấy từ kết quả WebSearch.
- **Chưa tìm thấy bản số:** 子平真詮 bản Hán văn sạch (chỉ có bản bình chú trên daizhige), 斗數宣微 (không ra kết quả), 沈氏玄空學 toàn văn, *Khâm định vạn niên thư* 欽定萬年書 của Khâm Thiên Giám (chỉ thấy được nhắc trong bài JAHH 2019), *Lịch triều hiến chương loại chí* bản Hán, *Tử Vi Chỉ Nam*, sách của Phan Tử Ngư.
- **Chưa tra:** Thư viện Huế, kho Mộc bản triều Nguyễn, Harvard-Yenching, HathiTrust (trừ 1 dòng), Google Books, 識典古籍, kho của Viện Hán Nôm (trang web chưa mở được).
- *Bản triều bạn nghịch liệt truyện* là sách sử, không thuộc huyền học hay lịch pháp, nên không đưa vào.
- Tên tác giả, niên đại của các bản quét archive.org ghi theo **metadata người tải**, nhiều chỗ không thống nhất (ví dụ AR05). Phải đối chiếu trang quét trước khi trích.
- Số lượng mảng ở mục 1.2 tính theo **mảng đầu tiên** của mỗi dòng. Một sách như *Hiệp kỷ biện phương thư* phục vụ cả A, B, E.

---

## 8. Việc cần anh Cường quyết

1. **Duyệt danh sách 30 nguồn đợt 1** (mục 3). Sau khi anh đồng ý, Claude Code sẽ xin phép riêng trước khi tải.
2. **Gửi thư xin phép** (em soạn sẵn được): Thư viện Quốc gia Việt Nam / Columbia (Hiệp kỷ lịch, Tả Ao), chủ repo daizhige, ctext (API), Viện Hán Nôm (*Lịch triều hiến chương loại chí* A.1551).
3. **Sách tử vi Việt (C):** anh có biết người giữ quyền của Thái Thứ Lang, Thiên Lương không? Không có thì chỉ dùng ở mức trích ngắn, và bỏ hẳn các bản quét archive.
4. **Chọn mô hình embedding** sau bộ thử 100 câu (mặc định bge-m3).
5. **Hỏi luật sư một lần** về: CC BY-SA khi dịch từ văn bản Kanripo/Wikisource; ngoại lệ khai thác dữ liệu cho AI ở Việt Nam; điều kiện dùng ảnh của thư viện nước ngoài cho mục đích thương mại.

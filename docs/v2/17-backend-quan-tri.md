# 17 — Backend quản trị xemboi.vn: SEO, nội dung, thư viện RAG, giấy phép

> Ngày lập: **21/11/2026**. Người giao: anh Cường ("Tất cả các phần từ quản lý RAG, SEO... đều đưa vào trong backend để quản lý").
> Phạm vi: **chỉ thiết kế**. Chưa sửa `src/`, `prisma/`. Khối Prisma ở mục 6 là **đề xuất, chưa áp dụng**.
> Đầu vào đã đọc: `prisma/schema.prisma`; `src/app/admin/**`, `src/app/quan-tri/**`, `src/app/api/admin/**`, `src/app/api/r1/quan-tri/**`, `src/lib/r1/admin-auth.ts`, `src/lib/ai/rag-engine.ts`, `src/lib/ai/customer-inquiry-service.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`; docs `04`, `07` (mục 2, 3), `08`, `12` (mục 4–6), `14`, `tu-khoa/tom-tat-tu-khoa.md`, `tu-khoa/tat-ca-tu-khoa.csv`, `tu-khoa/keyword-planner-*.csv`, `08-tu-khoa.csv`, `12-thu-vien-rag.csv`, `D:\VibeCode\Antigravity\thu-vien-rag\so-tai.csv` (đọc vài dòng đầu).
> **`16-seo-kien-truc.md` và `16-seo-trang.csv` chưa có lúc viết** (Glob `docs/v2/16*` không ra tệp nào). Mô hình SEO ở đây vì thế là **mô hình tổng quát**. Khi có 16, chỉ cần ánh xạ cột CSV vào bộ nhập trang (mục 1.2.4), không phải đổi bảng.
> Nhãn: `[CHƯA KIỂM]` = chưa xác minh. `[GIẢ ĐỊNH]` = giả định cần anh xác nhận. `[ƯỚC LƯỢNG]` = số ước, chưa đo.

---

## 0. Kết luận nhanh

1. **Có lỗ hổng phải vá ngay, trước mọi việc khác (Đợt 0).** Không có `src/middleware.ts`. Trong `src/app/api/admin/**` không route nào kiểm quyền: Grep `daXacThucQuanTri|ADMIN_KEY` chỉ ra các route R1. Hệ quả:
   - Ai biết đường dẫn cũng đọc được danh sách khách hàng: `GET /api/admin/customers` gọi `listCustomers` (`src/app/api/admin/customers/route.ts:4-12`). Model `CustomerProfile` có `phone`, `email`, `lunarBirthInfo`.
   - Ai cũng đổi được nhà cung cấp LLM và khóa API: `POST /api/admin/agents` với `action: 'UPDATE_LLM_CONFIG'` (`src/app/api/admin/agents/route.ts:99-105`).
   - `robots.ts` chỉ chặn `/quan-tri` và `/api/`, không chặn `/admin`.
2. **Một cửa quản trị duy nhất: `/quan-tri`.** Cây `/admin/*` cũ gộp vào đây. Đăng nhập theo tài khoản và 4 vai trò (quản trị, biên tập, chuyên gia duyệt, xem số liệu), thay cho một `ADMIN_KEY` dùng chung. Mọi thao tác ghi đều vào nhật ký.
3. **Năm module, chung một CSDL Postgres 16 + pgvector:**
   - **SEO:** kho từ khóa, trang và mẫu trang, internal link, redirect, sitemap, số liệu Search Console, lịch mùa vụ.
   - **Nội dung:** quy trình nháp → AI soạn → biên tập → chuyên gia duyệt → xuất bản → cập nhật; có phiên bản và trích nguồn.
   - **RAG:** danh mục nguồn, hàng đợi xử lý, trình duyệt đoạn, bộ đánh giá.
   - **Giấy phép:** sổ mã ngoài, sổ nguồn sách, thư xin phép, cổng kiểm trước khi mở tên miền.
   - **Nền tảng:** tài khoản, nhật ký, cài đặt, sao lưu.
4. **Nguồn C và nguồn "chỉ nội bộ" bị chặn ở tầng CSDL, không dựa vào giao diện** (mục 3.5). Có bốn lớp:
   - cột `pham_vi` được ràng buộc bằng `CHECK`;
   - vai trò Postgres riêng cho web công khai, không có quyền đọc bảng đoạn gốc;
   - Row-Level Security;
   - view `rag_doan_cong_khai`, kèm một bài test chạy dưới vai trò web.

   Thêm một quy tắc: **đoạn nội bộ không bao giờ được gửi sang LLM bên ngoài**.
5. **Phân việc giữa hai máy:**
   - **Máy trạm Windows có GPU:** giữ 40–90 GB sách gốc; phát hiện tệp, trích, OCR, phiên âm, cắt đoạn, embedding. Việc có GPU là `[GIẢ ĐỊNH, anh xác nhận]`.
   - **VPS:** chỉ chứa văn bản đã cắt, vector, hàng đợi và giao diện.
   - VPS hiện là DigitalOcean 2 GB RAM, 1 vCPU, 50 GB SSD (04 mục chi phí). Máy này **không đủ chỗ cho sách gốc**, và nhiều khả năng **không đủ RAM để chạy bge-m3 khi có truy vấn** `[CHƯA KIỂM]`. Cách nhúng câu hỏi lúc chạy thật để anh quyết (mục 9).
6. **Bản RAG cũ không dùng tiếp được.** `generateVectorEmbedding` (`src/lib/ai/rag-engine.ts:57-90`) sinh "vector giả" 1536 chiều bằng băm từ, không phải embedding ngữ nghĩa.
   - Dữ liệu `AgentKnowledgeDoc/Chunk` được chuyển sang bảng mới với cờ **nội bộ**, rồi cắt lại và nhúng lại bằng bge-m3 1024 chiều.
   - Vector cũ bỏ đi (mục 6.4).
7. **Không thêm dịch vụ trả phí bắt buộc.**
   - Mọi thành phần chính là mã nguồn mở hoặc API miễn phí (Search Console API).
   - Ahrefs, LLM API, nâng VPS, lưu sao lưu ngoài là tùy chọn. Chi phí và phương án thay thế ở mục 8.5.
8. **Lộ trình 5 đợt** (mục 8):
   - Đợt 0: vá bảo mật (4–6 giờ).
   - Đợt 1: tài khoản + kho từ khóa + trang/redirect/sitemap + danh mục nguồn + nạp văn bản sạch Kanripo/Wikisource, đủ để bắt đầu SEO và RAG (khoảng 70–95 giờ).
   - Đợt 2–4: nội dung, đồ thị liên kết, Search Console, OCR, cổng giấy phép.

   Mọi con số giờ là `[ƯỚC LƯỢNG]`.

---

## 1. Module SEO

### 1.1. Kho từ khóa

**Dữ liệu đang có** (đã đọc):

| Tệp | Dạng | Dùng để |
|:--|:--|:--|
| `docs/v2/tu-khoa/tat-ca-tu-khoa.csv` | `tu_khoa,luong_tim,canh_tranh,thang_cao_nhat,nguon` (nguồn: `AC`, `GG`, `KP`, ghép bằng `+`) | Nạp gốc: 11.212 từ khóa không trùng; 5.337 có lượng tìm KP (theo `tom-tat-tu-khoa.md`) |
| `docs/v2/tu-khoa/keyword-planner-1..6.csv` | Bản xuất Keyword Planner: 2 dòng tiêu đề phụ, rồi hàng cột phân tách bằng tab. Các cột: `Keyword`, `Avg. monthly searches`, `Three month change`, `YoY change`, `Competition`, `Competition (indexed value)`, `Searches: Nov 2025` … `Searches: Oct 2026` | Lượng tìm theo **từng tháng** → mùa vụ |
| `docs/v2/tu-khoa/goi-y-google.json` | Gợi ý Google | Đánh dấu nguồn `GG` |
| `docs/v2/08-tu-khoa.csv` | `cum,tu_khoa_chinh,so_bien_the,y_dinh,cong_cu_trang,nhu_cau,nguon_nhu_cau,do_kho,top5_ten_mien,mua_vu,hop_thuong_hieu,kiem_tien,diem,tang` | Nạp **cụm** (mã cụm ví dụ `01-lap-la-so-tu-vi`), độ khó D1–D5, điểm, tầng ưu tiên |

**Chức năng:**

1. **Nhập tệp** (trang `/quan-tri/seo/tu-khoa/nhap`). Có ba bộ đọc:
   - **Keyword Planner:** tự dò BOM và mã hóa (UTF-8/UTF-16) `[CHƯA KIỂM: Google xuất UTF-16 hay UTF-8 tùy lựa chọn]`; bỏ qua dòng cho tới hàng có ô đầu là `Keyword`; đọc 12 cột `Searches: <tháng>`.
   - **Autocomplete:** danh sách chuỗi, không có lượng tìm.
   - **CSV chung:** người nhập chọn cột tương ứng.

   Mỗi lần nhập tạo một **lô nhập** (`SeoLoNhap`), cho phép xem lại hoặc hoàn tác.
2. **Chuẩn hóa chuỗi trước khi gộp.** Đưa về NFC, chữ thường, gộp khoảng trắng, cắt dấu câu ở hai đầu. Có thêm cột `chuoiKhongDau` để tìm. **Không gộp** hai từ khóa chỉ khác dấu (ví dụ "phong thủy" và "phong thuỷ" vẫn là hai dòng). Lý do: KP trả số riêng cho từng dạng (`tom-tat-tu-khoa.md` có cả hai). Giao diện hiện cạnh nhau để người biên tập gom về một cụm.
3. **Chỉ số lưu cho mỗi từ khóa:**
   - `luongTim`: số KP, vốn là khoảng đã làm tròn 10/50/500/5.000…; ghi rõ điều này trên giao diện, theo 08 mục 2.1.
   - `luongTheoThang` (JSON 12 tháng) và `thangCaoNhat`.
   - `heSoMuaVu` = tháng cao nhất ÷ trung bình 12 tháng.
   - `canhTranh`: đây là cạnh tranh **quảng cáo**, không phải độ khó SEO.
   - `doKho` 1–5 theo thang D của 08, kèm `doKhoNguon` ("tra tay 20/11/2026" hoặc "SUY_LUAN").
   - `yDinh`, `mang` (mã 07b A–R).
4. **Lọc nhiễu và loại theo định vị** bằng quy tắc regex (mục 1.1.1): game, địa danh, quán ăn (08 mục 3.1); cờ bạc, giải hạn, sim số (08 mục 3.2); thương hiệu đối thủ (08 mục 3.3). Trạng thái: `MOI · GIU · NHIEU · LOAI_DINH_VI · THUONG_HIEU_DOI_THU`.
5. **Gom cụm.** Cụm có ba nguồn:
   - (a) nạp từ `08-tu-khoa.csv`;
   - (b) quy tắc regex;
   - (c) gợi ý theo tiền tố 2–3 âm tiết, đúng cách `tom-tat.py` đang làm, để người biên tập bấm chấp nhận.

   Mỗi cụm có đúng một **trang đích chính**.
6. **Gán từ khóa vào trang.** Thứ tự ưu tiên: gán tay > quy tắc cụ thể (độ ưu tiên cao) > quy tắc chung. Quy tắc có thể trỏ tới **mẫu trang** và dùng nhóm bắt của regex để sinh đường dẫn. Ví dụ `^(19[3-9]\d|20[0-3]\d) mệnh gì( nữ| nam)?$` → `/sinh-nam/$1`. Mẫu `/sinh-nam/<yyyy>` lấy từ 07 mục 2.5.
7. **Báo cáo.** Mọi báo cáo đều có nút xuất CSV.
   - **Tỷ lệ phủ:** tính hai cách, theo số từ khóa và theo tổng lượng tìm. Chỉ tính từ khóa `GIU`; từ khóa có trang đích đang `XUAT_BAN` là "đã phủ".
   - **Từ khóa chưa có trang:** xếp theo lượng tìm × điểm cụm của 08.
   - **Trùng ý định giữa hai trang (cannibalization):** dựa trên ba tín hiệu.
     - (a) Một cụm có từ khóa gán vào ≥ 2 trang.
     - (b) Dữ liệu Search Console: một truy vấn có lượt hiển thị ở ≥ 2 URL trong 28 ngày, URL thứ hai chiếm ≥ 20 % lượt hiển thị `[GIẢ ĐỊNH ngưỡng]`.
     - (c) Hai trang có title+H1 gần nhau về ngữ nghĩa, cosine ≥ 0,92 `[GIẢ ĐỊNH ngưỡng]`.

#### 1.1.1. Ví dụ quy tắc gán (nạp sẵn khi khởi tạo)

| Ưu tiên | Biểu thức (cờ `iu`) | Kết quả |
|--:|:--|:--|
| 100 | `số đề\|lô đề\|đánh con gì\|con gì về\|soi cầu\|bạch thủ\|nhà cái` | `trangThai = LOAI_DINH_VI` (07 mục 3.5, nhóm cờ bạc) |
| 100 | `cúng sao\|giải hạn\|dâng sao\|giải sao` | `LOAI_DINH_VI` (04 mục 3.4) |
| 90 | `genshin\|raiden\|furina\|tft\|ngũ hành sơn\|ốc hoàng\|cao ốc\|tạm xuất\|tam giác abc` | `NHIEU` (08 mục 3.1) |
| 80 | `tử vi chân cơ\|tử vi cổ học\|cao anh\|lê quang lăng\|bát tự quang minh` | `THUONG_HIEU_DOI_THU` |
| 50 | `^(19[3-9]\d\|20[0-3]\d) mệnh gì` | Mẫu `sinh-nam`, đường dẫn `/sinh-nam/$1` |
| 50 | `^quẻ (thuần càn\|…)` | Mẫu `que-kinh-dich` (cần bảng 64 tên quẻ → số) |
| 40 | `lịch âm tháng (\d{1,2})( năm)? (20\d\d)` | Mẫu `lich-thang`, `/lich-am/$3/$1` |

Quy tắc chỉ là gợi ý cho đến khi người biên tập bấm "Áp dụng". Mỗi lần áp dụng ghi nhật ký kèm số dòng bị đổi.

#### 1.1.2. Kho từ khóa loại và để dành (quản lý riêng). Anh quyết ngày 21/11/2026

Anh dặn: từ khóa bị loại không bỏ đi, mà đưa vào **một mục quản lý riêng**. Sau này sẽ làm landing page để phủ từ khóa **đối thủ** và từ **gõ sai**.

- **Trang:** `/quan-tri/seo/tu-khoa-loai`. Tách khỏi kho chính, nên không tính vào tỷ lệ phủ.
- **Nạp sẵn** từ các nhóm `LOAI:<lý do>` của `16-quy-tac-gan-tu-khoa.json` (vòng 2: khoảng 3.583 từ khóa, khoảng 740K lượt/tháng). Mỗi nhóm thành một bản ghi `SeoNhomLoai`.
- **Mỗi nhóm có:**
  - mã, lý do, nguồn quyết định (07, 08 hay anh);
  - **chính sách:**
    - `LOAI_VINH_VIEN`: cờ bạc, hù dọa, lễ giải hạn trừ tà, y tế. Giữ phủ quyết của 07, 08.
    - `DE_DANH_LANDING`: thương hiệu đối thủ, gõ sai, không dấu.
    - `CHO_QUYET`.
  - trang đích dự kiến; người đổi chính sách, lúc nào.
- **Phân loại thêm cho từ gõ sai:**
  - so chuỗi bỏ dấu và khoảng cách Levenshtein ≤ 2 với từ khóa đã có trang;
  - gợi ý từ gốc ("tu vi" → "tử vi", "lich am" → "lịch âm", "thân số học" → "thần số học");
  - gợi ý gộp vào trang của từ gốc hay dựng landing riêng.
- **Từ khóa đối thủ:**
  - gom theo tên thương hiệu (tử vi cổ học, tử vi chân cơ, lịch vạn niên 365…);
  - ghi tổng lượng tìm theo thương hiệu;
  - đánh dấu thương hiệu đã đăng ký nhãn hiệu (nếu biết) để soát rủi ro trước khi dựng landing so sánh hoặc thay thế.
- **Thao tác:**
  - đổi chính sách cả nhóm hoặc từng từ;
  - "Tạo landing" → sinh bản nháp `SeoTrang` loại `LANDING`, gán sẵn các từ khóa đã chọn;
  - xuất CSV.
- **Báo cáo riêng:** lượng tìm theo nhóm và theo chính sách; số từ đã có landing.
- **Prisma (bổ sung vào 6.2):**

```prisma
model SeoNhomLoai {
  id          String   @id @default(cuid())
  ma          String   @unique // ví dụ "thuong_hieu_doi_thu"
  lyDo        String
  chinhSach   ChinhSachLoai @default(CHO_QUYET)
  nguonQuyet  String?  // "07 mục 3.5", "08 mục 3.3", "anh 21/11/2026"
  trangDichId String?  // landing dự kiến (SeoTrang)
  ghiChu      String?
  capNhatBoi  String?
  capNhatLuc  DateTime @updatedAt
  tuKhoa      SeoTuKhoa[]
}

enum ChinhSachLoai {
  LOAI_VINH_VIEN
  DE_DANH_LANDING
  CHO_QUYET
}
// SeoTuKhoa thêm: nhomLoaiId String?, tuGocId String? (từ gốc nếu là gõ sai), laGoSai Boolean @default(false)
// TrangThaiTuKhoa thêm: GO_SAI.  LoaiTrang thêm: LANDING.
```

### 1.2. Trang và mẫu trang lập trình

#### 1.2.1. Mô hình

- **`SeoTrang`**: một dòng là một URL công khai.
  - Gồm cả trang biên tập tay và trang sinh từ mẫu. Theo 07 mục 2.6, tổng khoảng **7.400** trang, trong đó **~750** trang biên tập tay.
  - Lưu sẵn ("vật chất hóa") cả trang sinh từ mẫu, vì cần theo dõi thứ hạng, liên kết và trạng thái index **cho từng URL**. 7.400 dòng là nhỏ với Postgres.
  - Các trường chính: `duongDan`, `loai`, `title`, `metaDescription`, `h1`, `canonical`, `noindex`, `nofollow`, `schemaJsonLd`, `nhomSitemap`, `trangThai`, `ngayCapNhatNoiDung` (dùng làm `lastmod`), `tuKhoaChinhId`, `diemOnpage`, `doSau`, `soLienKetVao`, `embedding`.
- **`SeoMauTrang`**: một mẫu sinh nhiều trang, ví dụ `lich-ngay` sinh `/lich-am/<yyyy>/<mm>/<dd>`.
  - Có: mẫu đường dẫn; mẫu title, meta, H1, JSON-LD dùng biến `{nam}`, `{canChi}`…; `nguonDuLieu` (tên hàm engine); `dieuKienIndex`.
  - Ví dụ điều kiện index: chỉ index lịch ngày 2020–2035, ngoài khoảng đó `noindex` (07 mục 2.6). Cặp hoa giáp 1.830 trang luôn `noindex`.
  - Nút **"Đồng bộ mẫu"** sinh hoặc cập nhật các dòng `SeoTrang` và báo số dòng thêm, sửa, ẩn.
- **Sửa title/meta của một trang sinh từ mẫu:** gõ đè tại trang đó. Cờ `ghiDeMau` giữ lại phần sửa tay khi đồng bộ mẫu lần sau.

#### 1.2.2. Chấm điểm onpage tự động

Chấm lại mỗi lần lưu trang hoặc lưu phiên bản nội dung. Điểm 0–100. Lỗi **chặn** không cho xuất bản; lỗi **cảnh báo** chỉ trừ điểm. Ngưỡng độ dài là `[GIẢ ĐỊNH]`, chỉnh được trong `CaiDat`.

| # | Kiểm | Mức | Ghi chú |
|--:|:--|:--|:--|
| 1 | Title 30–60 ký tự; ước bề rộng ≤ ~580 px | Cảnh báo | Bề rộng ước bằng bảng độ rộng ký tự Arial; Google cắt theo pixel `[CHƯA KIỂM ngưỡng chính xác]` |
| 2 | Meta description 70–160 ký tự | Cảnh báo | |
| 3 | Đúng **một** H1, có từ khóa chính (so sánh có dấu, NFC) | Cảnh báo | |
| 4 | Từ khóa chính có trong title | Cảnh báo | |
| 5 | Từ khóa chính (hoặc biến thể cùng cụm) có trong 100 từ đầu | Cảnh báo | |
| 6 | **Từ cấm** trong title, meta, H1, nút, alt ảnh | **Chặn** | Theo `TuCam` (mục 1.7). Thuật ngữ kỹ thuật như *Tuyệt Mệnh*, *Hóa Kỵ* chỉ được dùng trong thân bài (07 mục 3.5) |
| 7 | Từ cấm trong thân bài | Chặn với nhóm "chặn cứng"; gắn cờ với nhóm "gắn cờ" (ví dụ "lô", "đề") | |
| 8 | Mục từ điển đủ **9 khối** (07 mục 2.3) | **Chặn** với loại `MUC_TU_DIEN` | Khối 5 "Cách tính" được trống khi mục không tất định, nhưng phải đánh dấu "không áp dụng" |
| 9 | Có ≥ 1 trích nguồn hợp lệ; khối 3 mỗi ý có nguồn | **Chặn** với từ điển và bài | Nguồn phải trỏ tới `/nguon/<sach>` hoặc `RagNguon` có `pham_vi = CONG_KHAI` (mục 3.5) |
| 10 | Có người duyệt + ngày duyệt (khối 9) | **Chặn index** (vẫn xuất bản được ở chế độ `noindex`) | 07 mục 3.4: "Trang chỉ được index khi có người duyệt ký tên và ngày duyệt" |
| 11 | Mọi ảnh có `alt` khác rỗng, không chứa từ cấm | Cảnh báo | |
| 12 | Câu giới hạn đúng loại trang (07 mục 3.3) | Cảnh báo | |
| 13 | Khối hỏi đáp (FAQ) trong thân bài | Cộng điểm nhỏ | **Không** tự gắn `FAQPage` JSON-LD (07 mục 2.7 ghi không ưu tiên) |
| 14 | JSON-LD đọc được, đúng kiểu theo loại trang, đủ thuộc tính bắt buộc (07 mục 2.7); **không** có `AggregateRating` khi chưa có đánh giá thật | Chặn nếu JSON hỏng; cảnh báo nếu thiếu thuộc tính | Chưa gọi công cụ kiểm của Google; chỉ kiểm cấu trúc |
| 15 | Canonical trỏ về chính nó hoặc tới trang đang `XUAT_BAN`, không `noindex` | Chặn | |
| 16 | ≥ 3 liên kết ra nội bộ và ≥ 1 liên kết vào (trừ trang mới tạo) | Cảnh báo | Từ đồ thị liên kết (mục 1.3) |
| 17 | Không có hứa hẹn "chính xác 100%", "linh ứng"… trong title, meta | Chặn | 07 mục 3.5, nhóm "Hứa hẹn quảng cáo" |

#### 1.2.3. Xem trước kết quả Google

- Khung giả lập **máy tính** và **điện thoại**: dòng tên trang và breadcrumb URL, title cắt theo bề rộng ước tính, meta cắt khoảng 155–160 ký tự `[GIẢ ĐỊNH]`.
- Hiện cảnh báo khi Google có thể **viết lại title**: title quá dài, lặp từ khóa, khác hẳn H1. Đây chỉ là chỉ báo `[SUY LUẬN]`.
- Ghi rõ trên giao diện: "Mô phỏng gần đúng, Google có thể hiển thị khác".

#### 1.2.4. Nhập trang hàng loạt

- Bộ nhập CSV, người dùng chọn cột tương ứng. Dùng để nạp `16-seo-trang.csv` khi phiên kia viết xong; chưa biết cột nên chưa cố định ánh xạ.
- Nhập ở chế độ **thử** trước: hiện danh sách dòng mới, dòng sửa, dòng xung đột đường dẫn. Bấm xác nhận mới ghi.

### 1.3. Internal link

1. **Thu thập đồ thị:**
   - Việc `seo.quet` chạy trên VPS mỗi đêm. Bắt đầu từ trang chủ và các sitemap, lấy HTML đã render, rút mọi `<a href>` nội bộ cùng anchor.
   - Cùng lúc ghi mã HTTP, canonical thực tế, meta robots thực tế, title thực tế. Từ đó so với giá trị trong CSDL để bắt lệch.
   - Tốc độ 2 yêu cầu/giây: 7.400 trang mất khoảng 1 giờ `[ƯỚC LƯỢNG]`.
2. **Chỉ số:**
   - `doSau`: số bước nhấp ngắn nhất từ trang chủ, tính bằng BFS.
   - `soLienKetVao`, `soLienKetRa`.
   - **Trang mồ côi:** có trong sitemap hoặc `XUAT_BAN` nhưng `soLienKetVao = 0`.
   - **Quá sâu:** `doSau > 3`.
   - Liên kết tới trang 404, 3xx hoặc `noindex`.
3. **Gợi ý theo quy tắc (`SeoQuyTacLienKet`).** Nạp sẵn 07 mục 2.4:
   - lá số → mục từ điển của từng sao, cung, can chi;
   - mục từ điển → 3–5 mục cùng nhóm + 1 công cụ + 1 bài;
   - mọi trích dẫn → `/nguon/<sach>`;
   - trang năm ↔ năm trước/sau;
   - xem tuổi, xem ngày → bài "Vì sao các nơi xem tuổi cho kết quả khác nhau" (bắt buộc).

   Mỗi quy tắc có số liên kết tối thiểu/tối đa và mẫu anchor.
4. **Gợi ý theo độ gần ngữ nghĩa:**
   - Mỗi trang có `embedding` (bge-m3, 1024 chiều), nhúng từ `title + H1 + 500 ký tự đầu`, chạy theo lô trên máy trạm.
   - Với mỗi trang, lấy 10 trang gần nhất chưa có liên kết. Ưu tiên cùng mảng, loại trang đích `noindex`.
   - Người biên tập bấm chấp nhận, sửa anchor hoặc bỏ qua. Lựa chọn bỏ qua được nhớ, lần sau không gợi ý lại.
5. **Phân bố anchor text** (theo từng trang đích):
   - Chia anchor thành: khớp chính xác từ khóa chính, khớp một phần, thương hiệu/URL, chung chung ("xem thêm", "tại đây").
   - Cảnh báo khi:
     - khớp chính xác > 50 %;
     - một anchor duy nhất chiếm > 60 %;
     - chung chung > 30 %.

     Cả ba ngưỡng là `[GIẢ ĐỊNH]`, chưa có nguồn công bố.

### 1.4. Redirect 301, sitemap, robots

**Redirect** (`SeoChuyenHuong`):
- Trường: `tuMien` (xemboi.vn, xemtuvi.vn, v3.xemtuvi.vn…), `tuDuongDan`, `denUrl`, mã (301/308/410), cờ biểu thức chính quy, `nguon` (`XEMTUVI`, `DUONG_CU`, `DOI_SLUG`, `TAY`), số lần được truy cập, lần cuối.
- **Tự sinh khi đổi slug:** sửa `duongDan` của một trang đã xuất bản thì tự thêm redirect từ đường cũ.
- **Danh sách URL của xemtuvi.vn:** lấy từ sitemap của xemtuvi.vn hoặc từ bản xuất Search Console của property xemtuvi.vn. `[CHƯA KIỂM: anh có quyền vào property GSC của xemtuvi.vn không; xemtuvi.vn có những route nào]`. Em không đoán bảng ánh xạ; bảng sẽ được lập khi có danh sách URL thật.
- **Cách chạy:**
  - Đề xuất: một việc "Xuất redirect" ghi tệp `map` cho nginx trên VPS rồi nạp lại nginx. Cách này nhanh, không đi qua Next.js, và chạy được cho tên miền xemtuvi.vn trỏ cùng VPS. `[CHƯA KIỂM: VPS có dùng nginx không]`.
  - Phương án thay thế: một route Node trong Next đọc bảng (có bộ đệm 60 giây). Không dùng `redirects()` trong `next.config` vì mỗi lần đổi phải build lại.
- **Kiểm vòng lặp và chuỗi redirect:** chặn A→B→A; cảnh báo chuỗi dài hơn 1 bước.

**Sitemap:**
- `/sitemap.xml` là **chỉ mục**, trỏ tới `/sitemaps/<nhom>.xml`. Nhóm theo loại: `cong-cu`, `tu-dien`, `bai`, `lich-ngay`, `lich-thang`, `sinh-nam`, `nguon`, `phuong-phap`…
- Mỗi tệp tối đa 50.000 URL, theo giao thức sitemaps.org `[CHƯA KIỂM lại trang gốc trong phiên này]`.
- Chỉ đưa trang `XUAT_BAN` và không `noindex`.
- `lastmod` = `ngayCapNhatNoiDung`. **Sửa lỗi hiện tại:** `src/app/sitemap.ts` đặt `lastModified: now` cho mọi URL (dòng 9–19), nghĩa là ngày nào mọi trang cũng báo "vừa đổi".

**robots.txt:**
- Sinh từ `CaiDat`.
- Chặn `/quan-tri`, `/api/`, `/admin` (hiện thiếu `/admin`).
- Trên tên miền chạy thử thì chặn toàn bộ.
- Trang quản trị gửi thêm header `X-Robots-Tag: noindex`.

### 1.5. Theo dõi xếp hạng

**Google Search Console API** (miễn phí):
- Tạo một service account, thêm vào property làm người dùng.
- Việc `seo.gsc` chạy mỗi ngày, kéo dữ liệu theo `date × page × query × device`. Mỗi yêu cầu tối đa 25.000 dòng, phân trang bằng `startRow`.
  - Nguồn số 25.000: Windsor.ai và Search Engine Land.
  - Blog Google 2022 nêu giới hạn xuất khoảng 50.000 dòng/ngày/site/loại tìm kiếm.
  - Dữ liệu giữ 16 tháng.

  `[CHƯA KIỂM trên tài liệu tham chiếu API hiện hành]`. Nguồn: [Search Engine Land – 25.000 dòng](https://searchengineland.com/google-search-console-search-analytics-api-now-gives-you-25000-rows-per-request-302015), [Google Search Central – giới hạn dữ liệu](https://developers.google.com/search/blog/2022/10/performance-data-deep-dive), [Search Engine Land – 16 tháng](https://searchengineland.com/google-search-console-analytics-api-now-has-16-months-of-data-300430).
- **Lưu hai bảng.** `SeoGscNgay` theo truy vấn, và `SeoGscTrangNgay` là tổng theo trang. Lý do: Google ẩn truy vấn hiếm, nên tổng theo truy vấn **nhỏ hơn** tổng theo trang.
- Vì Search Console chỉ giữ 16 tháng, **CSDL của mình là kho lâu dài**.

**Báo tụt hạng** (`SeoCanhBao`, loại `TUT_HANG`):
- So vị trí trung bình 7 ngày gần nhất với 28 ngày trước đó, theo từng cặp trang–truy vấn.
- Điều kiện báo: lượt hiển thị ≥ 50 trong 7 ngày **và** vị trí tụt ≥ 3 bậc. Hoặc theo trang: số nhấp giảm ≥ 40 %. Các ngưỡng là `[GIẢ ĐỊNH]`.

**Ahrefs:**
- Tắt mặc định.
- Theo trung tâm trợ giúp Ahrefs, API v3 có từ gói Lite, mỗi gói có hạn mức "API units", mua thêm unit chỉ ở gói Enterprise. Cùng trang đó lại ghi "ứng dụng mới cần Enterprise để kích hoạt". **Giá chưa kiểm.** Nguồn: [Ahrefs – About API v3](https://help.ahrefs.com/en/articles/6559232-about-api-v3), [Ahrefs pricing](https://ahrefs.com/pricing).
- Thiết kế chừa sẵn bảng `SeoNguonNgoai` dạng JSON để cắm sau, không làm trong lộ trình.
- **Phương án thay thế miễn phí:** Search Console + Bing Webmaster Tools + tra tay 10 cụm đầu trên Google VN như 08 mục 2.4 đề xuất.

### 1.6. Lịch nội dung mùa vụ

- `SeoLichMua`: mùa, khoảng đỉnh tìm, **hạn lên trang**, các cụm, các trang, trạng thái.
- Nạp sẵn 9 dòng từ 08 mục 7.2. Ví dụ: Tết 2027 hạn 07/01/2027; Rằm tháng 7 hạn 15/06/2027; cưới hỏi cuối năm hạn 30/06 và 31/07/2027; Tết 2028 hạn 31/10/2027.
- Bảng điều khiển hiện "còn N ngày tới hạn" và tỷ lệ trang của mùa đã `XUAT_BAN`.
- Nối với `heSoMuaVu` của từ khóa, để gợi ý mùa mới khi nạp thêm dữ liệu KP.

### 1.7. Từ cấm (dùng chung cho SEO, Nội dung, RAG)

- `TuCam`: cụm, nhóm, cách xử lý (`CHAN_CUNG`, `GAN_CO`, `THAY_THE`), câu thay thế, phạm vi (tiêu đề, meta, thân bài, nút, ảnh), ngoại lệ.
- Nạp từ:
  - 54 cụm trong `docs/v2/tai-san-xemtuvi/src/lib/luan-giai/ai/tu-cam.json`;
  - bảng bổ sung 07 mục 3.5 (cờ bạc, lễ và vật phẩm, hù dọa, hứa hẹn).
- Danh sách thuật ngữ kỹ thuật được phép **chỉ trong thân bài** là một bảng riêng (07 mục 3.5).
- Một hàm kiểm duy nhất `kiemTuCam(vanBan, phamVi)` dùng cho: chấm onpage, nháp AI, câu trả lời RAG công khai.

---

## 2. Module Nội dung

### 2.1. Loại nội dung

Một model `NoiDung` chung cho mọi loại; mỗi bản ghi nối 1–1 với một `SeoTrang`.

| Loại | Thân lưu ở | Bắt buộc riêng |
|:--|:--|:--|
| `MUC_TU_DIEN` | `khoi` JSON gồm 9 khóa `k1…k9` theo 07 mục 2.3; hai tầng đọc "đọc nhanh" (k1–k3), "đọc sâu" (k4–k8) | Đủ 9 khối; khối 3 mỗi ý một nguồn; khối 4 có bảng so sánh phái nếu có khác biệt (07 mục 3.2) |
| `BAI` | Markdown | ≥ 1 nguồn; tối đa 1 CTA sản phẩm, đặt cuối bài (07 mục 2.4) |
| `CONG_CU` | Markdown cho phần giới thiệu, hướng dẫn, giới hạn; phần tính toán vẫn nằm trong mã | Câu giới hạn đúng loại; phần "cách tính" link tới mã hoặc test |
| `NGUON_SACH` | Markdown + nối tới `RagNguon` | Tình trạng bản quyền (07 mục 3.1) lấy **tự động** từ `RagNguon.phapLy` và `xinPhep`, không gõ tay |
| `PHUONG_PHAP`, `HUB` | Markdown | |

### 2.2. Quy trình

```
NHAP ──(AI soạn)──► AI_SOAN ──► BIEN_TAP ──(gửi duyệt)──► CHO_CHUYEN_GIA
  ▲                                ▲                         │
  │                                └──── CAN_SUA ◄───────────┤ (yêu cầu sửa)
  │                                                          ▼
LUU_TRU ◄── CAN_CAP_NHAT ◄──(đến hạn)── DA_XUAT_BAN ◄── DA_DUYET
```

| Chuyển trạng thái | Ai làm | Điều kiện |
|:--|:--|:--|
| → `AI_SOAN` | Biên tập | Chọn nguồn RAG trong phạm vi **công khai** (mục 3.5); máy tạo nháp có mã đoạn |
| → `BIEN_TAP` | Biên tập | Nháp AI đã qua kiểm trích dẫn (dưới đây) |
| → `CHO_CHUYEN_GIA` | Biên tập | Không còn lỗi "chặn" trừ mục 10 (người duyệt) |
| → `DA_DUYET` | Chuyên gia duyệt **được giao đúng mảng** | Ghi `NoiDungDuyet` (ý kiến, ngày) |
| → `DA_XUAT_BAN` | Biên tập hoặc quản trị | Phiên bản được duyệt **đúng là** phiên bản xuất bản; sửa sau khi duyệt thì phải duyệt lại. Với mảng rủi ro Vừa trở lên (xem tuổi, xem ngày, văn khấn): cần thêm một bản ghi duyệt `PHAP_LY` (07 mục 3.4) |
| → `CAN_CAP_NHAT` | Máy | Đến `hanCapNhat` (ví dụ trang theo năm), hoặc **nguồn được trích bị đổi phạm vi** sang nội bộ (mục 3.5) |

**Theo 07 mục 3.4, "AI chỉ được viết nháp".** Phiên bản do AI tạo không thể xuất bản trực tiếp. Phải có ít nhất một phiên bản do người lưu sau đó.

### 2.3. AI soạn có RAG, bắt buộc trích nguồn

1. Biên tập viên nhập yêu cầu, ví dụ "Mục từ điển sao Thiên Cơ, khối 3".
2. Hệ thống tìm trong **`rag_doan_cong_khai`**, với mở rộng thuật ngữ Hán↔Việt (12 mục 5.2 bước 7), rồi hiện danh sách đoạn. Biên tập viên tích chọn đoạn được dùng.
3. Gửi LLM: chỉ dẫn hệ thống + các đoạn đã chọn, mỗi đoạn có mã `[D:12345]`. Yêu cầu: **mỗi câu nhận định có ít nhất một mã đoạn**.
4. **Bộ kiểm trích dẫn** chạy trên đầu ra (bằng mã, không bằng LLM):
   - mọi mã đoạn trong nháp phải thuộc tập đã gửi, không có mã bịa;
   - khối 3 không được có đoạn văn nào thiếu mã;
   - trích nguyên văn dài hơn N ký tự chỉ được khi `RagNguon.duocTrichDai = true`.

   Không đạt thì nháp bị gắn cờ, không vào được `BIEN_TAP`.
5. Mỗi mã đoạn hợp lệ thành một dòng `NoiDungTrichDan` (khối, kiểu: nguyên văn/dịch/tóm ý, chỗ trong sách). Đây chính là bảng `trich_dan` của 12 mục 5.1.
6. **Đoạn nội bộ (nguồn C, B chưa có phép, cờ "chỉ nội bộ")** chỉ hiện ở **cột bên phải** để biên tập viên đọc đối chiếu. Đoạn nội bộ **không** được gửi tới LLM ngoài. Lý do: 12 mục 5.3 lưu ý gửi văn bản nguồn C ra API ngoài có thể vi phạm điều kiện cấp phép. Mã chặn việc này nằm ở hàm `taoNguCanhAi()`: hàm này chỉ nhận đoạn lấy từ view công khai.
7. LLM dùng lớp `src/lib/ai/llm-provider.ts` đang có (Gemini/OpenAI/DeepSeek). Mỗi lần gọi ghi `AiSoanViec`: mô hình, số token vào/ra, chi phí ước tính. Giá token để anh điền trong `CaiDat`; em chưa tra giá trong phiên này `[CHƯA KIỂM]`.

### 2.4. Phiên bản, người duyệt, E-E-A-T

- `NoiDungPhienBan` **không sửa, chỉ thêm**: số thứ tự, khối/thân, người tạo (người hoặc AI), kết quả kiểm (từ cấm, onpage, trích dẫn).
- Giao diện có xem **so sánh hai phiên bản** (diff theo khối) và nút **khôi phục**. Khôi phục tạo một phiên bản mới, không ghi đè.
- `HoSoTacGia`: tên thật hoặc bút danh, nhưng phải là người thật (07 mục 3.4). Có slug `/tac-gia/<slug>` và giới thiệu. **Không** ghi chức danh không kiểm được.
  - JSON-LD `author`, `reviewedBy`, `lastReviewed` lấy từ đây và từ `NoiDungDuyet`, không gõ tay.
- **Cập nhật định kỳ:** `chuKyCapNhatNgay` theo loại, ví dụ trang theo năm 365 ngày, trang công cụ 180 ngày `[GIẢ ĐỊNH]`. Đến hạn thì vào hàng "Cần cập nhật" trên bảng điều khiển.

---

## 3. Module RAG

### 3.1. Danh mục nguồn

**Nạp:**
- `docs/v2/12-thu-vien-rag.csv`: 314 dòng, 15 cột, khóa `ma`.
- Ghép với `D:\VibeCode\Antigravity\thu-vien-rag\so-tai.csv` theo cột `ma`. Các cột của so-tai: `ma,ten,phap_ly,trang_thai,dung_luong_mb,noi_luu_hoac_ly_do,url`; `trang_thai` có các giá trị như "đã tải", "lỗi".
- Có xem trước khác biệt trước khi ghi. Ví dụ phát hiện `phap_ly` của một dòng khác nhau giữa hai tệp thì dừng, chờ người quyết.

**Trường của `RagNguon`:** toàn bộ cột của 12 (`ten_goc`, `ten_han_viet`, `tac_gia`, `nien_dai`, `ngon_ngu`, `mang`, `loai_nguon`, `noi_co_ban_so`, `url`, `dinh_dang`, `phap_ly`, `ghi_chu_phap_ly`, `uu_tien`, `da_kiem_url`), cộng thêm:

| Trường | Ý nghĩa |
|:--|:--|
| `trangThaiTai`, `dungLuongMb`, `duongDanCucBo` | Từ so-tai |
| `xinPhep` | `KHONG_CAN · CHUA_XIN · DA_GUI · DONG_Y · TU_CHOI · CAN_TRA_PHI` |
| `chiNoiBo` | Cờ "chỉ nội bộ". **Mặc định lúc nhập:** A → `false`; B, C, và nguồn chưa xếp loại → `true` |
| `duocTrichDai` | 12 mục 5.1: `false` với B/C chưa có phép |
| `giayPhep`, `ghiCong` | Dòng ghi công hiện trên trang (ví dụ "Văn bản: Kanripo, CC BY-SA 4.0") |
| `phamVi` | `CONG_KHAI` hoặc `NOI_BO`. **Do quy tắc tính, không gõ tay** (mục 3.5) |

### 3.2. Pipeline xử lý

#### 3.2.1. Các bước, nơi chạy

| # | Bước | Đầu vào → đầu ra | Nơi chạy | Công cụ đề xuất (đều mã nguồn mở) |
|--:|:--|:--|:--|:--|
| 1 | **Phát hiện tệp** | Thư mục `thu-vien-rag\<nguồn>\**` → `RagTep` (đường dẫn tương đối, cỡ, sha256, kiểu) | Máy trạm | Python, quét theo `duongDanCucBo` |
| 2a | **Trích văn bản sạch** | txt Kanripo, wikitext/JSON Wikisource, CSV/JSON Hugging Face → `RagVanBan` | Máy trạm | Python; với wikitext dùng `mwparserfromhell` `[CHƯA KIỂM giấy phép]` |
| 2b | **OCR** chữ Hán (in dọc), Hán Nôm | PDF ảnh, ảnh → `RagVanBan` theo trang, kèm `ocrTinCay` | Máy trạm GPU `[GIẢ ĐỊNH]` | PaddleOCR (Apache-2.0 theo hiểu biết, `[CHƯA KIỂM lại]`). Chất lượng với chữ Hán dọc và chữ Nôm: `[CHƯA KIỂM]`; 12 mục 4 đã nói đây là khâu tốn công nhất. Archive.org thường có sẵn tệp OCR kèm bản quét: dùng làm **đối chiếu**, không dùng thẳng |
| 2c | **Phiên âm MP3** bài giảng | MP3 → văn bản có mốc thời gian | Máy trạm GPU | Whisper (MIT theo hiểu biết, `[CHƯA KIỂM lại]`). Bài giảng của ai, có quyền không: **chưa rõ** → mặc định nguồn C, nội bộ |
| 3 | **Làm sạch** | Bỏ đầu trang/chân trang, ghép dòng gãy, OpenCC giản→phồn cho `vanBanChuan` (giữ `vanBan` gốc), tách chú khỏi chính văn | Máy trạm | OpenCC (Apache-2.0 theo hiểu biết, `[CHƯA KIỂM lại]`) |
| 4 | **Cắt đoạn** | Theo 12 mục 5.2: cấu trúc quyển → thiên → mục; phú 2–4 cặp câu; vấn đáp một sao một đoạn; Kinh Dịch một hào một đoạn; bảng **không nhúng**; 150–400 chữ Hán `[GIẢ ĐỊNH]` | Máy trạm | Bộ cắt riêng cho từng thể loại, có bộ test |
| 5 | **Embedding** | `duong_dan + van_ban_chuan` → vector 1024 | Máy trạm GPU | bge-m3 (MIT, 12 mục 5.3). Chọn chính thức sau bộ thử 100 câu |
| 6 | **Nạp pgvector** | Lô 500–2.000 đoạn → `rag_doan` | Máy trạm → VPS qua **đường hầm SSH** (OpenSSH có sẵn trên Windows, miễn phí), vai trò Postgres `xemboi_worker` | `COPY` hoặc chèn theo lô |
| 7 | **Tạo `tsv`, chỉ mục, thống kê** | Bigram chữ Hán cho `tsv` nếu `pg_trgm` không chạy với chữ Hán (12 mục 5.1: `[CHƯA KIỂM]`) | VPS | SQL |
| 8 | **Nhúng câu hỏi lúc chạy thật** | Câu hỏi → vector | **Chưa chốt** (mục 9) | |

**Vì sao sách gốc không lên VPS:** 40–90 GB lớn hơn ổ 50 GB của VPS (04).

**Văn bản và vector lên VPS cho đợt 1 (Kanripo + Wikisource) nhỏ:**
- 12 mục 4 ước "vài chục MB văn bản".
- Giả sử 30 MB UTF-8 ≈ 10 triệu chữ Hán ≈ 40.000 đoạn.
- Vector: 40.000 × 4 KB ≈ 160 MB, cộng chỉ mục HNSW cỡ tương đương.
- Tất cả `[ƯỚC LƯỢNG]`.

#### 3.2.2. Hàng đợi

- **Không cần Redis.** Bảng `RagViec` trong Postgres; tiến trình nhận việc bằng `SELECT … FOR UPDATE SKIP LOCKED` theo `noiChay` (`VPS` hoặc `MAY_TRAM`).
- Mỗi việc có: loại bước, tệp hoặc nguồn, trạng thái `CHO · DANG_CHAY · XONG · LOI · HUY`, số lần thử, giới hạn thử (mặc định 3), thông báo lỗi, máy nào nhận, giờ bắt đầu/kết thúc, tham số, kết quả.
  - Kết quả gồm số đoạn, số token, giây GPU.
- Xong bước này thì tự sinh việc bước sau.
- Nút **"Chạy lại"**: làm lại một việc, hoặc làm lại mọi việc lỗi của một nguồn.
- Nút **"Làm lại từ bước N"** cho một nguồn: xóa đầu ra từ bước N trở đi, giữ phần sửa tay ở `RagDoanSua` để áp lại (mục 3.3).
- **Máy trạm tắt thì việc nằm chờ.** Giao diện hiện "máy trạm: lần cuối liên lạc HH:MM". Tiến trình máy trạm gửi nhịp tim mỗi 60 giây vào bảng `RagMayXuLy`.
- **Phiên bản công cụ:** mỗi đầu ra ghi `phienBanCongCu` (ví dụ `paddleocr x.y`, `bge-m3@<commit>`, `catdoan v3`). Nhờ vậy biết đoạn nào cần làm lại khi đổi công cụ.

### 3.3. Trình duyệt đoạn

- **Lọc:** nguồn, mảng, phạm vi, loại đoạn (chính văn/chú/sớ/phú/bảng), OCR tin cậy < ngưỡng, chưa soát, có nhãn X.
- **Xem một đoạn:**
  - đường dẫn quyển › thiên › mục;
  - đoạn trước và sau;
  - nguyên văn và bản chuẩn hóa;
  - phiên âm Hán Việt máy sinh (có cờ);
  - với bản quét: **ảnh trang gốc**, cắt từ tệp trên máy trạm và tải lên VPS dưới dạng ảnh nhỏ, chỉ cho người đã đăng nhập.
- **Sửa OCR:**
  - sửa trực tiếp, mỗi lần sửa ghi `RagDoanSua` (trước, sau, ai, lúc nào);
  - sau khi sửa: đặt `daSoat = true`, tự xếp việc **nhúng lại** đoạn đó;
  - 12 mục 4 yêu cầu người duyệt soát mẫu 5 %: có nút "Lấy mẫu 5 % của nguồn này".
- **Gắn nhãn:** theo mảng (07b), sao (114), cung (12), quẻ (64), can (10), chi (12), can chi (60), tiết khí (24).
  - Nhãn có nguồn gốc: `TAY`, `MAY` (khớp `ThuatNgu`), `QUY_TAC`.
  - Có gắn hàng loạt theo kết quả lọc.
  - Bảng `ThuatNgu` (12 mục 5.1) sửa ngay trong module này.

### 3.4. Thử truy vấn và bộ đánh giá

- **Thử truy vấn** (`/quan-tri/rag/thu`):
  - nhập câu tiếng Việt, chọn ngữ cảnh **Công khai** hoặc **Nội bộ**;
  - xem câu đã mở rộng thuật ngữ (Thiên Cơ → 天機);
  - xem kết quả vector, kết quả từ khóa (`tsv`/trigram), và kết quả gộp RRF, mỗi đoạn kèm điểm từng nhánh;
  - lưu một kết quả tốt thành câu hỏi chuẩn.
- **Bộ câu hỏi chuẩn** (`RagCauHoiChuan`):
  - 12 mục 5.3 đề nghị 100 câu, lấy đáp án từ kho luận giải đã có mã câu;
  - mỗi câu có danh sách **đoạn đúng** hoặc **nguồn + vị trí đúng**.
- **Lần đánh giá** (`RagDanhGia`):
  - chọn mô hình nhúng, có/không mở rộng thuật ngữ, trọng số gộp, k;
  - đo recall@10, MRR, và **tỷ lệ đúng nguồn** (đoạn đứng đầu có thuộc đúng sách không);
  - lưu chi tiết từng câu để so giữa các lần.
- Kết quả đánh giá là căn cứ để anh chọn bge-m3, Qwen3-Embedding-0.6B hay AITeamVN/Vietnamese_Embedding (12 mục 5.3).

### 3.5. Chính sách hiển thị: chặn ở tầng truy vấn

**Quy tắc phạm vi:**

```
phamVi = CONG_KHAI  khi và chỉ khi  chiNoiBo = false
                                    VÀ ( phapLy = 'A'  HOẶC  xinPhep = 'DONG_Y' )
các trường hợp còn lại            → NOI_BO
```

- Nguồn C và B chưa có phép **không bao giờ** là `CONG_KHAI`.
- Nguồn A vẫn có thể bị anh bật `chiNoiBo`, ví dụ để soát chất lượng trước.

**Bốn lớp chặn, tất cả nằm ở CSDL** (SQL ở mục 6.3):

1. **Ràng buộc `CHECK` trên `rag_nguon`:** `pham_vi = 'NOI_BO' OR (chi_noi_bo = false AND (phap_ly = 'A' OR xin_phep = 'DONG_Y'))`. Không câu lệnh nào, kể cả lỗi lập trình, ghi được `CONG_KHAI` cho nguồn C chưa có phép.
2. **Trigger đồng bộ:** `pham_vi` của nguồn thay đổi thì cập nhật `pham_vi` của mọi đoạn thuộc nguồn đó, và của các đoạn có `dich_vi_nguon_id` trỏ tới nguồn đó. Lý do: bản dịch có pháp lý riêng (12 mục 2), nên đoạn có bản dịch nội bộ cũng thành nội bộ.
   - Cùng lúc, mọi `NoiDung` đang `DA_XUAT_BAN` có trích đoạn bị hạ phạm vi chuyển sang `CAN_CAP_NHAT` và sinh cảnh báo.
3. **Vai trò Postgres riêng:**
   - `xemboi_web`: chuỗi kết nối của tiến trình phục vụ trang công khai.
     - **Không có quyền `SELECT` trên bảng `rag_doan`**.
     - Chỉ đọc được view `rag_doan_cong_khai` (định nghĩa `WHERE pham_vi = 'CONG_KHAI'`).
     - Trên `rag_nguon` chỉ đọc được view `rag_nguon_cong_khai`.
   - `xemboi_quantri`: dùng cho trang quản trị.
   - `xemboi_worker`: dùng cho máy trạm.
4. **Row-Level Security trên `rag_doan`:** chính sách cho `xemboi_web` là `USING (pham_vi = 'CONG_KHAI')`. Lớp này để phòng khi ai đó lỡ cấp quyền bảng cho vai trò web.

**Ở tầng mã:**
- `src/lib/rag/tim-cong-khai.ts` chỉ dùng client Prisma có `DATABASE_URL` (vai trò web).
- `src/lib/rag/tim-noi-bo.ts` dùng `DATABASE_URL_QUAN_TRI`, và bắt buộc nhận đối tượng phiên đăng nhập có vai trò hợp lệ. Mỗi lần gọi ghi `RagTruyVanLog`.
- Luật ESLint `no-restricted-imports` cấm import `@/lib/db/quan-tri` từ ngoài `src/app/quan-tri/**`, `src/app/api/quan-tri/**`, `src/lib/quan-tri/**`.
- Route quản trị đặt `dynamic = 'force-dynamic'` và `Cache-Control: no-store`, để bộ đệm không bao giờ phục vụ kết quả nội bộ cho người ngoài.

**Bài test bắt buộc** (`tests/rag-pham-vi.test.mjs`): đăng nhập Postgres bằng `xemboi_web` rồi kiểm:
- (a) `SELECT 1 FROM rag_doan` phải lỗi "permission denied";
- (b) mọi dòng của `rag_doan_cong_khai` đều nối tới nguồn có `phap_ly = 'A'` hoặc `xin_phep = 'DONG_Y'`;
- (c) thử `UPDATE rag_nguon SET pham_vi = 'CONG_KHAI'` trên một nguồn C phải lỗi.

**Trường hợp chỉ có một tiến trình Next.js.** Tiến trình đó có cả hai chuỗi kết nối, nên lớp 3 chỉ chặn được lỗi ở đường mã công khai. Không chặn được nếu ai đó cố tình dùng client quản trị trong route công khai. Muốn chặn triệt để thì tách tiến trình:
- `web` chạy cổng 3000, **không có** biến `DATABASE_URL_QUAN_TRI`;
- `quantri` chạy cổng 3001, trên tên miền con `quantri.xemboi.vn`, sau nginx.

RAM 2 GB có đủ chạy hai tiến trình Next + Postgres không: `[CHƯA KIỂM]` → mục 9.

**Hai tình huống đặc biệt:**
- **Chuyên gia duyệt là cộng tác viên bên ngoài** (07 mục 3.4) mà được đọc đoạn nguồn C: vẫn tính là "kiểm chứng nội bộ" nếu có thỏa thuận bảo mật `[GIẢ ĐỊNH]` → anh quyết (mục 9).
- **Trang công khai nhắc tên một sách C chỉ ở dạng thư mục** (không trích chữ nào), ví dụ "tham khảo: Tử Vi Đẩu Số Tân Biên": mặc định **chặn**, vì anh dặn "không hiển thị công khai khi chưa xin phép". Anh có thể nới (mục 9).

### 3.6. Thống kê dung lượng và chi phí

| Chỉ số | Lấy từ |
|:--|:--|
| Dung lượng sách gốc theo nguồn, mảng, loại A/B/C | `RagNguon.dungLuongMb` (so-tai), `RagTep.kichThuoc` |
| Số tệp, số trang OCR, số đoạn, số đoạn đã nhúng, số đoạn đã soát | Đếm trên bảng |
| Dung lượng CSDL | `pg_total_relation_size('rag_doan')`, kích thước từng chỉ mục HNSW |
| Ổ VPS còn trống | Việc `he-thong.kiem` ghi số đo vào `CaiDat` mỗi giờ |
| Chi phí embedding | Chạy cục bộ: **0 đồng phí API**. Ghi giây GPU và số token theo lô; tiền điện không tính. Nếu sau này dùng API: số token × đơn giá trong `CaiDat` |
| Chi phí LLM (AI soạn, chat) | `AiSoanViec` và `ChatMessage.tokenUsage` (đã có trong schema) × đơn giá trong `CaiDat` |

---

## 4. Module Giấy phép

1. **Sổ mã ngoài**, nạp từ `14-so-giay-phep.md` và `repo-huyen-hoc\giay-phep-thuc-te.csv`:
   - `GpMaNgoai`: 140 repo, mã `R001…R144`, nhóm "cần xin phép" 52 / "mở, ghi công" 88, giấy phép trong tệp, ghi chú khảo sát.
   - `GpMaNgoaiSuDung`: tương ứng **mục 1 của 14**. Mỗi lần nhúng ghi một dòng gồm ngày, commit, tệp đã dùng, dùng ở đâu, **có chạy trên web không**, đã ghi NOTICE chưa. Dòng đầu tiên: Nhat-Nguyet R042, CC BY 4.0 với `ca-kiem/*.json`, chỉ dùng trong test.
   - Mục 1 của 14 ghi R042 dùng CC BY 4.0, còn bảng mục 3 ghi "MIT (LICENSE)". Đây là hai tệp khác nhau trong cùng repo hay ghi lệch: `[CHƯA KIỂM]`. Bộ nhập sẽ **không tự sửa**, chỉ đánh dấu để anh xem.
2. **Sổ nguồn sách:** chính là `RagNguon` (mục 3.1), xem theo góc pháp lý. Lọc được "C đang nạp", "B chưa xin", "đã gửi thư chưa trả lời > 30 ngày".
3. **Thư xin phép** (`GpXinPhep`): dùng chung cho nguồn sách, mã và ảnh.
   - Trường: người nhận, kênh, ngày gửi, ngày trả lời, kết quả, điều kiện, phí, hạn hiệu lực, **tệp bằng chứng** (bản lưu thư đồng ý).
   - Ghi `DONG_Y` thì cập nhật `xinPhep` của nguồn hoặc mã liên quan, qua cùng một giao dịch có ghi nhật ký. Nhờ ràng buộc ở mục 3.5, chỉ lúc này nguồn mới có thể thành công khai.
   - Có mẫu thư theo 12 mục 8: Thư viện Quốc gia, Columbia, daizhige, ctext, Viện Hán Nôm.
4. **Cổng kiểm trước khi mở tên miền chính** (`/quan-tri/giay-phep/kiem-mo`), chặn khi còn bất kỳ mục nào dưới đây:
   - (a) `GpMaNgoaiSuDung` có `chayTrenWeb = true`, mã thuộc nhóm "cần xin phép" và chưa `DONG_Y`. Gồm cả mã gốc Hồ Ngọc Đức: 14 ghi chỉ cho phi thương mại, trong khi `src/app/quan-tri/page.tsx:21` đang ghi "Engine Âm Dương Lịch: Thuật toán Hồ Ngọc Đức". Cần kiểm engine đang chạy thực sự dùng mã nào.
   - (b) Mã MIT/Apache/BSD đang chạy trên web mà chưa có dòng trong tệp NOTICE.
   - (c) `NoiDungTrichDan` của trang đã xuất bản trỏ tới đoạn hoặc nguồn `NOI_BO`.
   - (d) Trang đã xuất bản có dòng ghi công CC BY-SA bị thiếu.

   Cùng một hàm kiểm chạy ở ba nơi: giao diện, script `scripts/kiem-giay-phep.mjs` (thoát mã ≠ 0 khi có chặn, dùng trong bước triển khai), và bảng điều khiển.
5. **Nhắc trước khi mở:**
   - Anh đặt `NGAY_MO_TEN_MIEN` trong `CaiDat`.
   - Từ T−30 ngày: băng đỏ trên mọi trang quản trị; mốc T−14 và T−7 có hiện nhắc.
   - Không gửi email, vì chưa có dịch vụ gửi thư. Nếu anh muốn, có thể gửi qua Zalo OA hoặc SMTP miễn phí của Gmail `[CHƯA KIỂM điều khoản]`.

---

## 5. Nền tảng

### 5.1. Tài khoản và vai trò

**Cách làm:**
- Tự làm đăng nhập bằng email + mật khẩu, băm **argon2id**.
- Phiên lưu trong bảng: cookie chứa mã ngẫu nhiên 32 byte; CSDL chỉ lưu bản băm SHA-256 của mã. Cookie `HttpOnly`, `Secure`, `SameSite=Lax`, hết hạn 7 ngày.
- Vai trò `QUAN_TRI` bật mã hai lớp TOTP từ Đợt 4.
- Lý do không dùng Auth.js: chỉ có vài tài khoản nội bộ đăng nhập bằng mật khẩu; tự làm ít phụ thuộc hơn. Dùng Auth.js cũng được, không đổi mô hình dữ liệu.
- **Lớp kiểm:**
  - `src/middleware.ts` chỉ kiểm **có** cookie, để chặn sớm `/quan-tri/**`, `/api/quan-tri/**`, `/admin/**`, `/api/admin/**`.
  - Mọi route và layout gọi `yeuCauQuyen('<quyền>')` ở phía server (Node) để kiểm phiên thật và vai trò.
- **`ADMIN_KEY` cũ:**
  - giữ làm "khóa khẩn cấp" duy nhất cho script `scripts/tao-quan-tri.mjs`, dùng để tạo tài khoản quản trị đầu tiên;
  - sau đó gỡ khỏi các route R1 (đổi sang tài khoản);
  - đặt cờ `CHO_PHEP_ADMIN_KEY=0`.
- **Giới hạn thử đăng nhập:** 5 lần sai trong 15 phút → khóa 15 phút theo email và IP `[GIẢ ĐỊNH ngưỡng]`.

**Ma trận quyền:**

| Quyền | Quản trị | Biên tập | Chuyên gia duyệt | Xem số liệu |
|:--|:-:|:-:|:-:|:-:|
| Tài khoản, vai trò, cài đặt, sao lưu | ✔ | | | |
| Khách hàng (CRM: có số điện thoại, email, ngày sinh) | ✔ | | | |
| Hội thoại khách, R1 lead | ✔ | | | |
| SEO: xem | ✔ | ✔ | | ✔ |
| SEO: sửa trang, từ khóa, liên kết | ✔ | ✔ | | |
| SEO: redirect, robots, xuất bản sitemap | ✔ | ✔ (redirect thường) / ✔ chỉ quản trị với redirect cả tên miền | | |
| Nội dung: soạn, AI soạn, gửi duyệt | ✔ | ✔ | | |
| Nội dung: duyệt chuyên môn | ✔ | | ✔ (chỉ mảng được giao) | |
| Nội dung: xuất bản | ✔ | ✔ (sau khi đã duyệt) | | |
| RAG: xem đoạn **công khai** | ✔ | ✔ | ✔ | |
| RAG: xem đoạn **nội bộ** (C, B chưa phép, chỉ nội bộ) | ✔ | ✔ | ✔ (chỉ mảng được giao, nếu anh đồng ý; mục 9) | |
| RAG: sửa OCR, gắn nhãn | ✔ | ✔ | ✔ | |
| RAG: nhập nguồn, chạy pipeline, đổi `chiNoiBo` | ✔ | | | |
| Giấy phép: xem | ✔ | ✔ | | |
| Giấy phép: ghi xin phép, đổi `xinPhep` | ✔ | | | |
| Số liệu (Search Console, R1 phễu, lưu lượng): xem | ✔ | ✔ | | ✔ |
| Nhật ký thao tác: xem | ✔ | | | |

Một tài khoản có thể có nhiều vai trò. Chuyên gia có danh sách `mangDuyet` (mã mảng 07b).

### 5.2. Nhật ký thao tác

- `NhatKyThaoTac`: ai, lúc nào, IP, hành động (ví dụ `seo.trang.sua`, `rag.nguon.doi_pham_vi`), đối tượng và mã, **trước/sau** dạng JSON, chỉ ghi các trường đổi.
- **Chỉ thêm:** vai trò `xemboi_quantri` không có quyền `UPDATE`/`DELETE` trên bảng này.
- Ghi bằng một hàm bọc `ghiNhatKy()` gọi trong cùng giao dịch với thao tác.
- Đọc nội dung nội bộ cũng ghi (`RagTruyVanLog`). Mục đích: chứng minh được nguồn C chỉ được đọc bởi người có quyền.

### 5.3. Sao lưu

| Gì | Cách | Lịch | Giữ |
|:--|:--|:--|:--|
| CSDL Postgres (gồm vector) | `pg_dump -Fc` trên VPS, nén | Mỗi đêm | 7 bản ngày + 4 bản tuần trên VPS |
| Bản sao ngoài VPS | Máy trạm kéo về qua `scp` (miễn phí) | Mỗi đêm khi máy bật | 30 ngày |
| Thư viện sách gốc 40–90 GB | Ổ cứng ngoài, chép bằng `robocopy /MIR` | Hằng tuần | Tùy anh |
| Thử khôi phục | Khôi phục bản mới nhất vào CSDL tạm, đếm dòng các bảng chính | Hằng tháng | Ghi kết quả vào `NhatKyThaoTac` |

- Vector sinh lại được từ văn bản, nhưng mất nhiều giờ GPU. Vì vậy vẫn sao lưu.
- Lưu trữ ngoài trả phí (S3, Backblaze B2…) chỉ là tùy chọn, giá chưa kiểm (mục 8.5).
- **Bản sao lưu chứa dữ liệu khách hàng.** Phải mã hóa bản sao trên máy trạm (ví dụ 7-Zip AES-256), theo tinh thần Luật 91/2025 mà 06/07 đã nhắc.

### 5.4. Trang quản trị cũ: giữ, gộp, bỏ

| Hiện có | Quyết định | Lý do |
|:--|:--|:--|
| `src/app/quan-tri/page.tsx` | **Thay** bằng bảng điều khiển mới `/quan-tri` | Trang tĩnh, ghi "Hoạt động 100%" không đo; nêu engine Hồ Ngọc Đức (vướng giấy phép theo 14) |
| `/quan-tri/r1` + `/api/r1/quan-tri/*`, `src/lib/r1/admin-auth.ts` | **Giữ**, chuyển xác thực sang tài khoản | Đang dùng cho thí nghiệm R1; đường dẫn giữ nguyên |
| `/admin/dashboard`, `/admin/analytics` + `/api/admin/analytics/overview` | **Gộp** vào `/quan-tri/so-lieu` | Cùng một việc: số liệu lưu lượng |
| `/admin/customers`, `/admin/customers/[id]` + API | **Giữ**, chuyển sang `/quan-tri/khach-hang`, chỉ vai trò quản trị | Có dữ liệu cá nhân |
| `/admin/conversations` + `/api/admin/conversations`, `/simulate` | **Giữ**, chuyển sang `/quan-tri/hoi-thoai` | Theo dõi chat; phần mô phỏng dùng để thử |
| `/admin/agents` + `/api/admin/agents` | **Tách đôi.** Cấu hình nhân vật, giọng, mô hình → `/quan-tri/ai/tro-ly`. Kho tri thức → module RAG | Khóa API LLM **không** được nhập qua giao diện rồi giữ trong bộ nhớ như hiện tại; để trong biến môi trường |
| `/api/admin/agents/[id]/knowledge` | **Bỏ** sau khi chuyển dữ liệu (mục 6.4) | Thay bằng RAG mới; còn đường lùi `inMemoryChunks` |
| `/admin/inquiries` + `/api/admin/inquiries`, `/external` | **Bỏ** phần "tìm bên ngoài"; giữ ý tưởng "kho câu hỏi" dưới dạng **nguồn từ khóa/FAQ** trong SEO | `searchExternalInquiries` (`src/lib/ai/customer-inquiry-service.ts:162`) trả **danh sách viết sẵn trong mã**, có nhãn nguồn "Diễn đàn Webtretho & Hội Tử Vi Việt Nam" nhưng không gọi mạng; có câu "hóa giải sao Cô Thần Quả Tú" (dính từ cấm "hóa giải bằng…", 07 mục 3.5); ghi đè tệp JSON trong `src/` lúc chạy |
| `src/app/admin/layout.tsx` | **Bỏ**, thay bằng layout `/quan-tri` có menu theo quyền | Ghi cứng "Admin: Cuong", không có đăng nhập |
| Toàn bộ `/admin/*` | Sau khi chuyển: chuyển hướng 308 sang `/quan-tri/*` | |

---

## 6. Mô hình dữ liệu Prisma (đề xuất, chưa áp dụng)

### 6.1. Nguyên tắc

- Postgres 16 + pgvector. Schema hiện có đã bật `previewFeatures = ["postgresqlExtensions"]` và `extensions = [pgvector(map: "vector")]` (`prisma/schema.prisma:4,10`).
- **Đổi từ `prisma db push` sang `prisma migrate`.** 06 mục 6 đang ghi `npx prisma db push`. `db push` không chạy được SQL tự viết, mà thiết kế này cần SQL tự viết cho: chỉ mục HNSW, `CHECK`, trigger, RLS, view, vai trò. Mỗi migration có tệp `migration.sql` được sửa tay phần đó.
- Bảng RAG đặt tên `snake_case` bằng `@@map`, để SQL thuần (tìm vector, RRF) dễ viết. Khớp tên `nguon`, `doan` của 12 mục 5.1, thêm tiền tố `rag_`.
- `embedding` và `tsv` khai báo `Unsupported(...)?` (cho phép trống): Prisma tạo được dòng, còn ghi và đọc vector bằng `$queryRaw`.

### 6.2. Khối schema mới

```prisma
// ==========================================
// 12. NỀN TẢNG: TÀI KHOẢN, PHIÊN, NHẬT KÝ, CÀI ĐẶT
// ==========================================

enum VaiTro {
  QUAN_TRI
  BIEN_TAP
  CHUYEN_GIA_DUYET
  XEM_SO_LIEU
}

model TaiKhoan {
  id               String          @id @default(cuid())
  email            String          @unique
  hoTen            String
  matKhauBam       String          // argon2id
  vaiTro           VaiTro[]
  mangDuyet        String[]        // mã mảng 07b được giao duyệt (chuyên gia)
  totpBiMat        String?         // đã mã hóa bằng khóa trong env
  dangHoatDong     Boolean         @default(true)
  lanDangNhapCuoi  DateTime?
  soLanSai         Int             @default(0)
  khoaDen          DateTime?
  taoLuc           DateTime        @default(now())
  capNhatLuc       DateTime        @updatedAt

  phien            PhienDangNhap[]
  hoSo             HoSoTacGia?
  nhatKy           NhatKyThaoTac[]
}

model PhienDangNhap {
  id          String    @id @default(cuid())
  maBam       String    @unique // sha256 của mã trong cookie
  taiKhoanId  String
  taiKhoan    TaiKhoan  @relation(fields: [taiKhoanId], references: [id], onDelete: Cascade)
  ip          String?
  userAgent   String?
  taoLuc      DateTime  @default(now())
  hetHan      DateTime
  thuHoiLuc   DateTime?

  @@index([taiKhoanId])
  @@index([hetHan])
}

model NhatKyThaoTac {
  id          BigInt    @id @default(autoincrement())
  taiKhoanId  String?
  taiKhoan    TaiKhoan? @relation(fields: [taiKhoanId], references: [id], onDelete: SetNull)
  hanhDong    String    // "seo.trang.sua", "rag.nguon.doi_pham_vi", "nd.xuat_ban"...
  doiTuong    String    // tên model
  doiTuongId  String?
  truoc       Json?
  sau         Json?
  ip          String?
  luc         DateTime  @default(now())

  @@index([doiTuong, doiTuongId])
  @@index([taiKhoanId, luc])
  @@index([hanhDong, luc])
}

model CaiDat {
  khoa        String   @id // "NGAY_MO_TEN_MIEN", "ONPAGE_NGUONG", "GIA_TOKEN", "ROBOTS"...
  giaTri      Json
  suaBoiId    String?
  suaLuc      DateTime @updatedAt
}

// ==========================================
// 13. SEO
// ==========================================

enum YDinh {
  CONG_CU
  TRA_CUU
  SO_SANH
  THUONG_HIEU
  GIAO_DICH
  CHUA_RO
}

enum TrangThaiTuKhoa {
  MOI
  GIU
  NHIEU
  LOAI_DINH_VI
  THUONG_HIEU_DOI_THU
}

enum CachGan {
  QUY_TAC
  TAY
}

enum LoaiTrang {
  TRANG_CHU
  HUB
  CONG_CU
  TU_DIEN
  BAI
  NGUON
  PHUONG_PHAP
  SAN_PHAM
  LICH
  THEO_NAM
  TAC_GIA
  KHAC
}

enum TrangThaiTrang {
  NHAP
  XUAT_BAN
  AN
  DA_CHUYEN // đã redirect đi nơi khác
}

enum NguonLienKet {
  QUET       // thấy trong HTML khi quét
  QUY_TAC
  NGU_NGHIA
  TAY
}

enum TrangThaiLienKet {
  DANG_CO
  DE_XUAT
  DA_DUYET   // đã duyệt, chờ chèn vào nội dung
  BO_QUA
}

enum TrangThaiCanhBao {
  MO
  DA_XU_LY
  BO_QUA
}

model SeoLoNhap {
  id            String   @id @default(cuid())
  tenTep        String
  loai          String   // KEYWORD_PLANNER | AUTOCOMPLETE | GOI_Y_GOOGLE | GSC | CUM_08 | TRANG_CSV | KHAC
  khoangThoiGian String? // "11/2025–10/2026"
  soDong        Int
  soMoi         Int
  soCapNhat     Int
  nhapBoiId     String?
  nhapLuc       DateTime @default(now())
}

model SeoTuKhoa {
  id              String          @id @default(cuid())
  chuoi           String          @unique // NFC, chữ thường, gộp khoảng trắng
  chuoiKhongDau   String
  luongTim        Int?            // Keyword Planner, đã làm tròn theo khoảng
  luongTheoThang  Json?           // {"2025-11": 50000, ...}
  thangCaoNhat    Int?            // 1–12
  heSoMuaVu       Float?          // max tháng / trung bình 12 tháng
  canhTranh       String?         // Low | Medium | High (quảng cáo)
  chiSoCanhTranh  Int?
  doKho           Int?            // 1–5 theo thang D của 08
  doKhoNguon      String?
  nguon           String[]        // KP, AC, GG, GSC
  yDinh           YDinh           @default(CHUA_RO)
  mang            String[]        // mã 07b
  trangThai       TrangThaiTuKhoa @default(MOI)

  cumId           String?
  cum             SeoCum?         @relation(fields: [cumId], references: [id], onDelete: SetNull)
  trangDichId     String?
  trangDich       SeoTrang?       @relation("TuKhoaTrangDich", fields: [trangDichId], references: [id], onDelete: SetNull)
  cachGan         CachGan?
  quyTacId        String?
  quyTac          SeoQuyTacGan?   @relation(fields: [quyTacId], references: [id], onDelete: SetNull)

  laTuKhoaChinhCua SeoTrang[]     @relation("TuKhoaChinhCuaTrang")
  ghiChu          String?
  taoLuc          DateTime        @default(now())
  capNhatLuc      DateTime        @updatedAt

  @@index([cumId])
  @@index([trangDichId])
  @@index([trangThai, luongTim])
  @@index([chuoiKhongDau])
}

model SeoCum {
  id           String      @id @default(cuid())
  ma           String      @unique // "01-lap-la-so-tu-vi" (08-tu-khoa.csv)
  ten          String
  tuKhoaChinh  String?
  yDinh        YDinh       @default(CHUA_RO)
  congCuTrang  String?
  diem         Float?
  tang         String?     // "P1", "Đã có (04)"...
  muaVu        String?
  trangDichId  String?
  trangDich    SeoTrang?   @relation("CumTrangDich", fields: [trangDichId], references: [id], onDelete: SetNull)
  tuKhoa       SeoTuKhoa[]
  lichMua      SeoLichMua[]
}

model SeoQuyTacGan {
  id          String      @id @default(cuid())
  ten         String
  bieuThuc    String      // regex, chạy với cờ "iu"
  ketQua      Json        // {"trangThai":"NHIEU"} | {"cumMa":"..."} | {"mauTrangMa":"sinh-nam","duongDan":"/sinh-nam/$1"}
  uuTien      Int         @default(50)
  batTat      Boolean     @default(true)
  soKhop      Int         @default(0)
  tuKhoa      SeoTuKhoa[]
  taoLuc      DateTime    @default(now())
}

model SeoMauTrang {
  id             String     @id @default(cuid())
  ma             String     @unique // "lich-ngay", "sinh-nam", "sao-tai-cung"...
  ten            String
  loaiTrang      LoaiTrang
  mauDuongDan    String     // "/lich-am/{yyyy}/{mm}/{dd}"
  mauTitle       String
  mauMeta        String
  mauH1          String
  mauSchema      Json?
  nguonDuLieu    String     // tên hàm engine hoặc bảng
  dieuKienIndex  Json?      // {"nam":{"tu":2020,"den":2035}} | {"luon":"noindex"}
  nhomSitemap    String
  trang          SeoTrang[]
  capNhatLuc     DateTime   @updatedAt
}

model SeoTrang {
  id                  String          @id @default(cuid())
  duongDan            String          @unique
  loai                LoaiTrang
  mauTrangId          String?
  mauTrang            SeoMauTrang?    @relation(fields: [mauTrangId], references: [id], onDelete: SetNull)
  thamSoMau           Json?
  ghiDeMau            Boolean         @default(false)
  noiDungId           String?         @unique
  noiDung             NoiDung?        @relation(fields: [noiDungId], references: [id], onDelete: SetNull)

  title               String
  metaDescription     String?
  h1                  String?
  canonical           String?
  noindex             Boolean         @default(false)
  nofollow            Boolean         @default(false)
  schemaJsonLd        Json?
  anhChiaSe           String?
  nhomSitemap         String
  trangThai           TrangThaiTrang  @default(NHAP)
  ngayXuatBan         DateTime?
  ngayCapNhatNoiDung  DateTime?       // dùng làm lastmod

  tuKhoaChinhId       String?
  tuKhoaChinh         SeoTuKhoa?      @relation("TuKhoaChinhCuaTrang", fields: [tuKhoaChinhId], references: [id], onDelete: SetNull)
  tuKhoaDich          SeoTuKhoa[]     @relation("TuKhoaTrangDich")
  cumDich             SeoCum[]        @relation("CumTrangDich")

  diemOnpage          Int?
  chiTietDiem         Json?
  chamLuc             DateTime?

  doSau               Int?
  soLienKetVao        Int             @default(0)
  soLienKetRa         Int             @default(0)
  maHttpLanQuet       Int?
  quetLuc             DateTime?
  embedding           Unsupported("vector(1024)")?

  lienKetRa           SeoLienKet[]    @relation("LienKetTu")
  lienKetVao          SeoLienKet[]    @relation("LienKetDen")
  gscTruyVan          SeoGscNgay[]
  gscTrang            SeoGscTrangNgay[]
  canhBao             SeoCanhBao[]
  lichMua             SeoLichMua[]

  taoLuc              DateTime        @default(now())
  capNhatLuc          DateTime        @updatedAt

  @@index([loai, trangThai])
  @@index([nhomSitemap, trangThai, noindex])
  @@index([mauTrangId])
}

model SeoLienKet {
  id          String           @id @default(cuid())
  tuTrangId   String
  tuTrang     SeoTrang         @relation("LienKetTu", fields: [tuTrangId], references: [id], onDelete: Cascade)
  denTrangId  String
  denTrang    SeoTrang         @relation("LienKetDen", fields: [denTrangId], references: [id], onDelete: Cascade)
  anchor      String
  nguon       NguonLienKet
  trangThai   TrangThaiLienKet
  doGan       Float?           // cosine, khi nguon = NGU_NGHIA
  quyTacId    String?
  quetLuc     DateTime?
  taoLuc      DateTime         @default(now())

  @@index([tuTrangId])
  @@index([denTrangId, trangThai])
}

model SeoQuyTacLienKet {
  id           String     @id @default(cuid())
  ten          String
  tuLoai       LoaiTrang?
  tuMauTrangMa String?
  dieuKien     Json?
  denMau       String     // "/tu-vi/sao/{sao}", "/nguon/{sach}"
  mauAnchor    String[]
  soToiThieu   Int        @default(0)
  soToiDa      Int        @default(5)
  batBuoc      Boolean    @default(false)
  batTat       Boolean    @default(true)
}

model SeoChuyenHuong {
  id           String    @id @default(cuid())
  tuMien       String    @default("xemboi.vn")
  tuDuongDan   String
  denUrl       String
  ma           Int       @default(301)
  laBieuThuc   Boolean   @default(false)
  nguon        String    // XEMTUVI | DUONG_CU | DOI_SLUG | TAY
  batTat       Boolean   @default(true)
  soLanTruy    Int       @default(0)
  lanTruyCuoi  DateTime?
  ghiChu       String?
  taoBoiId     String?
  taoLuc       DateTime  @default(now())

  @@unique([tuMien, tuDuongDan])
}

model SeoGscNgay {
  id        BigInt    @id @default(autoincrement())
  ngay      DateTime  @db.Date
  url       String
  trangId   String?
  trang     SeoTrang? @relation(fields: [trangId], references: [id], onDelete: SetNull)
  truyVan   String
  thietBi   String    // DESKTOP | MOBILE | TABLET
  hienThi   Int
  nhap      Int
  viTriTB   Float

  @@unique([ngay, url, truyVan, thietBi])
  @@index([trangId, ngay])
  @@index([truyVan, ngay])
}

model SeoGscTrangNgay {
  id        BigInt    @id @default(autoincrement())
  ngay      DateTime  @db.Date
  url       String
  trangId   String?
  trang     SeoTrang? @relation(fields: [trangId], references: [id], onDelete: SetNull)
  thietBi   String
  hienThi   Int
  nhap      Int
  viTriTB   Float

  @@unique([ngay, url, thietBi])
  @@index([trangId, ngay])
}

model SeoCanhBao {
  id         String           @id @default(cuid())
  loai       String           // TUT_HANG | MO_COI | QUA_SAU | TRUNG_Y_DINH | ANCHOR_LECH | LOI_HTTP | NOINDEX_TRONG_SITEMAP | CANONICAL_LECH | NGUON_BI_HA_PHAM_VI
  trangId    String?
  trang      SeoTrang?        @relation(fields: [trangId], references: [id], onDelete: Cascade)
  tuKhoaId   String?
  mucDo      Int              @default(2) // 1 cao … 3 thấp
  chiTiet    Json
  trangThai  TrangThaiCanhBao @default(MO)
  taoLuc     DateTime         @default(now())
  xuLyLuc    DateTime?
  xuLyBoiId  String?

  @@index([trangThai, loai])
}

model SeoLichMua {
  id           String     @id @default(cuid())
  ten          String     // "Tết 2028"
  dinhTu       DateTime   @db.Date
  dinhDen      DateTime   @db.Date
  hanLenTrang  DateTime   @db.Date
  cum          SeoCum[]
  trang        SeoTrang[]
  trangThai    String     @default("CHUA_LAM") // CHUA_LAM | DANG_LAM | XONG | HOAN
  ghiChu       String?
}

model TuCam {
  id        String   @id @default(cuid())
  cum       String   @unique
  nhom      String   // CO_BAC | LE_VAT_PHAM | HU_DOA | HUA_HEN | NEN_TU_CAM_JSON
  xuLy      String   // CHAN_CUNG | GAN_CO | THAY_THE
  thayBang  String?
  phamVi    String[] // TIEU_DE, META, H1, THAN_BAI, NUT, ANH
  nguon     String   // "tu-cam.json", "07 mục 3.5"
  batTat    Boolean  @default(true)
}

// ==========================================
// 14. NỘI DUNG
// ==========================================

enum LoaiNoiDung {
  MUC_TU_DIEN
  BAI
  CONG_CU
  NGUON_SACH
  PHUONG_PHAP
  HUB
}

enum TrangThaiNoiDung {
  NHAP
  AI_SOAN
  BIEN_TAP
  CHO_CHUYEN_GIA
  CAN_SUA
  DA_DUYET
  DA_XUAT_BAN
  CAN_CAP_NHAT
  LUU_TRU
}

enum VaiTroDuyet {
  BIEN_TAP
  CHUYEN_GIA
  PHAP_LY
}

enum KetLuanDuyet {
  DONG_Y
  YEU_CAU_SUA
  TU_CHOI
}

enum KieuTrich {
  NGUYEN_VAN
  DICH
  TOM_Y
  THAM_KHAO
}

model HoSoTacGia {
  id            String    @id @default(cuid())
  taiKhoanId    String?   @unique
  taiKhoan      TaiKhoan? @relation(fields: [taiKhoanId], references: [id], onDelete: SetNull)
  tenHienThi    String
  slug          String    @unique
  gioiThieu     String?   @db.Text
  vaiTroHienThi String?   // không ghi chức danh không kiểm được (07 mục 3.4)
  lienKet       String[]
  anh           String?
}

model NoiDung {
  id                  String            @id @default(cuid())
  loai                LoaiNoiDung
  tieuDe              String
  mang                String[]
  trangThai           TrangThaiNoiDung  @default(NHAP)
  trang               SeoTrang?

  tacGiaId            String?
  bienTapId           String?
  chuyenGiaId         String?
  phienBanXuatBanId   String?           @unique
  ngayDuyetChuyenGia  DateTime?
  ngayXuatBan         DateTime?
  hanCapNhat          DateTime?
  chuKyCapNhatNgay    Int?
  canDuyetPhapLy      Boolean           @default(false)
  postCuId            String?           @unique // nối Post cũ khi chuyển dữ liệu

  phienBan            NoiDungPhienBan[]
  duyet               NoiDungDuyet[]
  aiViec              AiSoanViec[]
  taoLuc              DateTime          @default(now())
  capNhatLuc          DateTime          @updatedAt

  @@index([loai, trangThai])
  @@index([hanCapNhat])
}

model NoiDungPhienBan {
  id         String            @id @default(cuid())
  noiDungId  String
  noiDung    NoiDung           @relation(fields: [noiDungId], references: [id], onDelete: Cascade)
  so         Int
  khoi       Json?             // MUC_TU_DIEN: {"k1":..., ..., "k9":...}
  than       String?           @db.Text // markdown
  tomTat     String?
  nguonTao   String            // TAY | AI | NHAP_CU
  taoBoiId   String?
  aiViecId   String?
  kiemTra    Json?             // kết quả từ cấm, onpage, trích dẫn
  ghiChu     String?
  taoLuc     DateTime          @default(now())

  trichDan   NoiDungTrichDan[]
  duyet      NoiDungDuyet[]

  @@unique([noiDungId, so])
}

model NoiDungTrichDan {
  id              String          @id @default(cuid())
  phienBanId      String
  phienBan        NoiDungPhienBan @relation(fields: [phienBanId], references: [id], onDelete: Cascade)
  khoi            Int?            // 3, 8...
  doanId          BigInt?
  doan            RagDoan?        @relation(fields: [doanId], references: [id], onDelete: Restrict)
  nguonId         Int?
  nguon           RagNguon?       @relation(fields: [nguonId], references: [id], onDelete: Restrict)
  kieu            KieuTrich
  cauTrich        String?
  viTri           String?         // "q.2, 安大限訣" / "tr. 261"
  daDoiChieu      Boolean         @default(false)
  nguoiDoiChieuId String?
  maCauKho        String?         // "MENH-TL-01" (kho luận giải)

  @@index([doanId])
  @@index([nguonId])
}

model NoiDungDuyet {
  id           String          @id @default(cuid())
  noiDungId    String
  noiDung      NoiDung         @relation(fields: [noiDungId], references: [id], onDelete: Cascade)
  phienBanId   String
  phienBan     NoiDungPhienBan @relation(fields: [phienBanId], references: [id], onDelete: Cascade)
  vaiTro       VaiTroDuyet
  nguoiDuyetId String
  ketLuan      KetLuanDuyet
  nhanXet      String?         @db.Text
  luc          DateTime        @default(now())

  @@index([noiDungId, luc])
}

model AiSoanViec {
  id              String   @id @default(cuid())
  noiDungId       String
  noiDung         NoiDung  @relation(fields: [noiDungId], references: [id], onDelete: Cascade)
  yeuCau          Json
  doanDaGui       BigInt[] // chỉ đoạn CONG_KHAI
  nhaCungCap      String
  moHinh          String
  tokenVao        Int?
  tokenRa         Int?
  chiPhiUocVnd    Int?
  trangThai       String   // CHO | XONG | LOI | KHONG_DAT_TRICH_DAN
  loi             String?
  taoBoiId        String?
  taoLuc          DateTime @default(now())
  xongLuc         DateTime?
}

// ==========================================
// 15. THƯ VIỆN RAG
// ==========================================

enum PhapLy {
  A
  B
  C
}

enum TrangThaiXinPhep {
  KHONG_CAN
  CHUA_XIN
  DA_GUI
  DONG_Y
  TU_CHOI
  CAN_TRA_PHI
}

enum PhamVi {
  CONG_KHAI
  NOI_BO
}

enum KieuTep {
  TXT
  WIKITEXT
  JSON
  CSV
  PDF_CHU
  PDF_ANH
  ANH
  MP3
  KHAC
}

enum LoaiViecRag {
  PHAT_HIEN
  TRICH
  OCR
  PHIEN_AM
  LAM_SACH
  CAT_DOAN
  NHUNG
  NAP_DB
  TAO_CHI_MUC
  NHUNG_TRANG_SEO
}

enum NoiChay {
  VPS
  MAY_TRAM
}

enum TrangThaiViec {
  CHO
  DANG_CHAY
  XONG
  LOI
  HUY
}

model RagNguon {
  id             Int              @id @default(autoincrement())
  ma             String           @unique // khớp cột `ma` của 12-thu-vien-rag.csv
  tenGoc         String
  tenHanViet     String?
  tacGia         String?
  nienDai        String?
  banIn          String?
  ngonNgu        String[]
  mang           String[]
  loaiNguon      String           // sach_co | sach_hien_dai | hoc_thuat | bo_du_lieu | noi_bo_xemboi
  noiCoBanSo     String?
  url            String?
  dinhDang       String?
  phapLy         PhapLy
  ghiChuPhapLy   String?
  giayPhep       String?
  ghiCong        String?
  uuTien         Int?
  daKiemUrl      Boolean          @default(false)

  trangThaiTai   String?          // từ so-tai.csv: "đã tải" | "lỗi" | ...
  dungLuongMb    Float?
  duongDanCucBo  String?          // trên máy trạm

  xinPhep        TrangThaiXinPhep @default(CHUA_XIN)
  chiNoiBo       Boolean          @default(true)
  duocTrichDai   Boolean          @default(false)
  phamVi         PhamVi           @default(NOI_BO) // ràng buộc CHECK ở migration.sql
  sha256         String?
  trangThai      String           @default("DANH_MUC") // DANH_MUC | DANG_NAP | DA_NAP | TAM_DUNG | LOAI
  ngayNap        DateTime?

  tep            RagTep[]
  doan           RagDoan[]        @relation("DoanCuaNguon")
  doanDich       RagDoan[]        @relation("BanDichCuaDoan")
  trichDan       NoiDungTrichDan[]
  xinPhepThu     GpXinPhep[]
  tacTu          AiAgent[]        // trợ lý AI nào được dùng nguồn này

  taoLuc         DateTime         @default(now())
  capNhatLuc     DateTime         @updatedAt

  @@index([phapLy, phamVi])
  @@map("rag_nguon")
}

model RagTep {
  id              String      @id @default(cuid())
  nguonId         Int
  nguon           RagNguon    @relation(fields: [nguonId], references: [id], onDelete: Cascade)
  duongDan        String      // tương đối so với gốc thư viện
  kieu            KieuTep
  kichThuoc       BigInt
  sha256          String
  soTrang         Int?
  trangThai       String      @default("MOI") // MOI | DANG_XU_LY | XONG | LOI | BO_QUA
  vanBan          RagVanBan[]
  doan            RagDoan[]
  viec            RagViec[]
  phatHienLuc     DateTime    @default(now())

  @@unique([nguonId, duongDan])
  @@index([sha256])
  @@map("rag_tep")
}

model RagVanBan {
  id              String   @id @default(cuid())
  tepId           String
  tep             RagTep   @relation(fields: [tepId], references: [id], onDelete: Cascade)
  trang           Int?     // số trang ảnh hoặc số đoạn audio
  vanBanTho       String   @db.Text
  vanBanSach      String?  @db.Text
  ocrTinCay       Float?   @db.Real
  phienBanCongCu  String
  taoLuc          DateTime @default(now())

  @@index([tepId, trang])
  @@map("rag_van_ban")
}

model RagViec {
  id         BigInt        @id @default(autoincrement())
  loai       LoaiViecRag
  noiChay    NoiChay
  nguonId    Int?
  tepId      String?
  tep        RagTep?       @relation(fields: [tepId], references: [id], onDelete: Cascade)
  thamSo     Json?
  trangThai  TrangThaiViec @default(CHO)
  uuTien     Int           @default(50)
  soLanThu   Int           @default(0)
  toiDaThu   Int           @default(3)
  loi        String?       @db.Text
  nhanBoi    String?       // mã máy xử lý
  ketQua     Json?         // {soDoan, soToken, giayGpu, ...}
  taoLuc     DateTime      @default(now())
  batDauLuc  DateTime?
  ketThucLuc DateTime?

  @@index([trangThai, noiChay, uuTien, taoLuc])
  @@index([nguonId, loai])
  @@map("rag_viec")
}

model RagMayXuLy {
  id          String   @id // "may-tram-1", "vps"
  moTa        String?
  noiChay     NoiChay
  phienBan    Json?    // phiên bản công cụ đã cài
  nhipTimLuc  DateTime
  @@map("rag_may_xu_ly")
}

model RagDoan {
  id             BigInt         @id @default(autoincrement())
  nguonId        Int
  nguon          RagNguon       @relation("DoanCuaNguon", fields: [nguonId], references: [id], onDelete: Cascade)
  tepId          String?
  tep            RagTep?        @relation(fields: [tepId], references: [id], onDelete: SetNull)
  duongDan       String[]       // {'卷一','諸星問答論','天機'}
  thuTu          Int
  loai           String         // chinh_van | chu | so | phu | bang | giang
  chaId          BigInt?        // chú/sớ → chính văn
  vanBan         String         @db.Text
  vanBanChuan    String?        @db.Text
  hanViet        String?        @db.Text
  dichVi         String?        @db.Text
  dichViNguonId  Int?
  dichViNguon    RagNguon?      @relation("BanDichCuaDoan", fields: [dichViNguonId], references: [id], onDelete: SetNull)
  trangAnh       String?
  ocrTinCay      Float?         @db.Real
  daSoat         Boolean        @default(false)
  phamVi         PhamVi         @default(NOI_BO) // trigger đồng bộ từ rag_nguon
  bamNoiDung     String         // sha256(vanBan) để phát hiện trùng
  phienBan       Int            @default(1)
  embedding      Unsupported("vector(1024)")?
  moHinhNhung    String?
  nhungLuc       DateTime?
  tsv            Unsupported("tsvector")?
  meta           Json?
  taoLuc         DateTime       @default(now())
  capNhatLuc     DateTime       @updatedAt

  sua            RagDoanSua[]
  nhan           RagDoanNhan[]
  trichDan       NoiDungTrichDan[]

  @@index([nguonId, thuTu])
  @@index([phamVi])
  @@index([bamNoiDung])
  @@map("rag_doan")
}

model RagDoanSua {
  id        String   @id @default(cuid())
  doanId    BigInt
  doan      RagDoan  @relation(fields: [doanId], references: [id], onDelete: Cascade)
  truong    String   // van_ban | van_ban_chuan | han_viet | dich_vi
  truoc     String   @db.Text
  sau       String   @db.Text
  nguoiSuaId String
  luc       DateTime @default(now())

  @@index([doanId])
  @@map("rag_doan_sua")
}

model RagNhan {
  id      String        @id @default(cuid())
  loai    String        // MANG | SAO | CUNG | QUE | CAN | CHI | CAN_CHI | TIET_KHI | KHAC
  ma      String        // "thien-co", "01-thuan-can", "giap-ty"
  ten     String
  tenHan  String?
  doan    RagDoanNhan[]

  @@unique([loai, ma])
  @@map("rag_nhan")
}

model RagDoanNhan {
  doanId     BigInt
  doan       RagDoan  @relation(fields: [doanId], references: [id], onDelete: Cascade)
  nhanId     String
  nhan       RagNhan  @relation(fields: [nhanId], references: [id], onDelete: Cascade)
  nguonGan   String   // TAY | MAY | QUY_TAC
  nguoiGanId String?
  luc        DateTime @default(now())

  @@id([doanId, nhanId])
  @@index([nhanId])
  @@map("rag_doan_nhan")
}

model ThuatNgu {
  han      String
  hanViet  String
  bienThe  String[]
  mang     String

  @@id([han, mang])
  @@index([hanViet])
  @@map("thuat_ngu")
}

model RagCauHoiChuan {
  id          String   @id @default(cuid())
  cauHoi      String
  mang        String?
  doanDung    BigInt[]
  nguonDungMa String[]
  viTriDung   String?
  ghiChu      String?
  taoBoiId    String?
  taoLuc      DateTime @default(now())
  @@map("rag_cau_hoi_chuan")
}

model RagDanhGia {
  id          String   @id @default(cuid())
  moHinhNhung String
  cauHinh     Json     // {k, moRongThuatNgu, trongSoRrf, ...}
  soCau       Int
  recallAt10  Float
  mrr         Float
  tyLeDungNguon Float
  chiTiet     Json     // từng câu: hạng của đoạn đúng
  chayBoiId   String?
  luc         DateTime @default(now())
  @@map("rag_danh_gia")
}

model RagTruyVanLog {
  id         BigInt   @id @default(autoincrement())
  nguCanh    PhamVi   // CONG_KHAI | NOI_BO
  taiKhoanId String?
  truyVan    String
  soKetQua   Int
  coNoiBo    Boolean  @default(false)
  ms         Int
  luc        DateTime @default(now())

  @@index([nguCanh, luc])
  @@map("rag_truy_van_log")
}

// ==========================================
// 16. GIẤY PHÉP
// ==========================================

model GpMaNgoai {
  id              String             @id @default(cuid())
  ma              String             @unique // "R001"
  repo            String
  url             String
  giayPhepTep     String?            // đọc từ LICENSE
  giayPhepKhaoSat String?
  nhom            String             // CAN_XIN | MO_GHI_CONG
  xinPhep         TrangThaiXinPhep   @default(CHUA_XIN)
  ghiChu          String?
  suDung          GpMaNgoaiSuDung[]
  xinPhepThu      GpXinPhep[]
}

model GpMaNgoaiSuDung {
  id           String    @id @default(cuid())
  maNgoaiId    String
  maNgoai      GpMaNgoai @relation(fields: [maNgoaiId], references: [id], onDelete: Restrict)
  ngay         DateTime  @db.Date
  commit       String?
  tepDaDung    String
  dungODau     String
  chayTrenWeb  Boolean
  daGhiNotice  Boolean   @default(false)
  ghiCong      String?
  ghiChu       String?
}

model GpXinPhep {
  id             String            @id @default(cuid())
  doiTuong       String            // NGUON | MA_NGOAI | ANH | KHAC
  nguonId        Int?
  nguon          RagNguon?         @relation(fields: [nguonId], references: [id], onDelete: SetNull)
  maNgoaiId      String?
  maNgoai        GpMaNgoai?        @relation(fields: [maNgoaiId], references: [id], onDelete: SetNull)
  nguoiNhan      String
  kenh           String            // email | thư | form | gặp trực tiếp
  ngayGui        DateTime?
  ngayTraLoi     DateTime?
  ketQua         TrangThaiXinPhep  @default(DA_GUI)
  dieuKien       String?           @db.Text
  chiPhiVnd      Int?
  hetHan         DateTime?
  tepBangChung   String?
  ghiChu         String?
  taoBoiId       String?
  taoLuc         DateTime          @default(now())
}
```

**Sửa model cũ** (cũng chỉ là đề xuất):

```prisma
model AiAgent {
  // ... giữ nguyên các trường hiện có ...
  nguonRag  RagNguon[]   // thay quan hệ knowledgeDocs sau khi chuyển dữ liệu
}
// AgentKnowledgeDoc, AgentKnowledgeChunk: giữ CHỈ ĐỌC trong 1 đợt rồi xóa (mục 6.4).
// Post, Category: giữ CHỈ ĐỌC tới khi NoiDung/SeoTrang chạy ổn, rồi xóa.
```

### 6.3. SQL tự viết trong `migration.sql`

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- (1) Ràng buộc phạm vi: nguồn C/B chưa phép không thể CONG_KHAI
ALTER TABLE rag_nguon ADD CONSTRAINT rag_nguon_pham_vi_hop_le CHECK (
  "phamVi" = 'NOI_BO'
  OR ("chiNoiBo" = false AND ("phapLy" = 'A' OR "xinPhep" = 'DONG_Y'))
);

-- (2) Tự tính phạm vi khi đổi pháp lý / xin phép / cờ nội bộ
CREATE OR REPLACE FUNCTION rag_nguon_tinh_pham_vi() RETURNS trigger AS $$
BEGIN
  NEW."phamVi" := CASE
    WHEN NEW."chiNoiBo" = false AND (NEW."phapLy" = 'A' OR NEW."xinPhep" = 'DONG_Y')
    THEN 'CONG_KHAI'::"PhamVi" ELSE 'NOI_BO'::"PhamVi" END;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_rag_nguon_pham_vi BEFORE INSERT OR UPDATE ON rag_nguon
  FOR EACH ROW EXECUTE FUNCTION rag_nguon_tinh_pham_vi();

-- (3) Đồng bộ phạm vi xuống đoạn (gồm đoạn có bản dịch thuộc nguồn này)
CREATE OR REPLACE FUNCTION rag_dong_bo_pham_vi_doan() RETURNS trigger AS $$
BEGIN
  IF NEW."phamVi" IS DISTINCT FROM OLD."phamVi" THEN
    UPDATE rag_doan d SET "phamVi" =
      CASE WHEN n."phamVi" = 'CONG_KHAI'
             AND (d."dichViNguonId" IS NULL OR dn."phamVi" = 'CONG_KHAI')
           THEN 'CONG_KHAI'::"PhamVi" ELSE 'NOI_BO'::"PhamVi" END
    FROM rag_nguon n LEFT JOIN rag_nguon dn ON dn.id = d."dichViNguonId"
    WHERE n.id = d."nguonId" AND (d."nguonId" = NEW.id OR d."dichViNguonId" = NEW.id);
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_rag_nguon_dong_bo AFTER UPDATE OF "phamVi" ON rag_nguon
  FOR EACH ROW EXECUTE FUNCTION rag_dong_bo_pham_vi_doan();
-- Thêm trigger BEFORE INSERT trên rag_doan để đặt "phamVi" theo nguồn lúc chèn (không tin giá trị máy trạm gửi lên).

-- (4) Chỉ mục: một HNSW đầy đủ (quản trị) + một HNSW một phần (công khai)
CREATE INDEX rag_doan_hnsw_tat_ca  ON rag_doan USING hnsw (embedding vector_cosine_ops);
CREATE INDEX rag_doan_hnsw_cong_khai ON rag_doan USING hnsw (embedding vector_cosine_ops)
  WHERE "phamVi" = 'CONG_KHAI';
CREATE INDEX rag_doan_tsv  ON rag_doan USING gin (tsv);
CREATE INDEX rag_doan_trgm ON rag_doan USING gin ("vanBanChuan" gin_trgm_ops);  -- [CHƯA KIỂM với chữ Hán trên VPS]
CREATE INDEX seo_trang_hnsw ON "SeoTrang" USING hnsw (embedding vector_cosine_ops);

-- (5) View công khai
CREATE VIEW rag_nguon_cong_khai AS
  SELECT id, ma, "tenGoc", "tenHanViet", "tacGia", "nienDai", "banIn", mang, url, "giayPhep", "ghiCong", "duocTrichDai"
  FROM rag_nguon WHERE "phamVi" = 'CONG_KHAI';
CREATE VIEW rag_doan_cong_khai WITH (security_barrier = true) AS
  SELECT id, "nguonId", "duongDan", "thuTu", loai, "chaId", "vanBan", "vanBanChuan", "hanViet",
         CASE WHEN "dichViNguonId" IS NULL THEN NULL ELSE "dichVi" END AS "dichVi",
         embedding, tsv, meta
  FROM rag_doan WHERE "phamVi" = 'CONG_KHAI'
    AND ("ocrTinCay" IS NULL OR "daSoat" = true OR "ocrTinCay" >= 0.9);  -- 12 mục 5.2 bước 6; ngưỡng [GIẢ ĐỊNH]

-- (6) Vai trò
CREATE ROLE xemboi_web     LOGIN PASSWORD '...';
CREATE ROLE xemboi_quantri LOGIN PASSWORD '...';
CREATE ROLE xemboi_worker  LOGIN PASSWORD '...';
REVOKE ALL ON rag_doan, rag_nguon, rag_doan_sua, rag_van_ban, rag_tep, rag_viec FROM xemboi_web;
GRANT SELECT ON rag_doan_cong_khai, rag_nguon_cong_khai, thuat_ngu TO xemboi_web;
GRANT SELECT, INSERT, UPDATE ON rag_doan, rag_tep, rag_van_ban, rag_viec, rag_may_xu_ly TO xemboi_worker;
GRANT SELECT ON rag_nguon TO xemboi_worker;              -- worker KHÔNG đổi được pháp lý
REVOKE UPDATE, DELETE ON "NhatKyThaoTac" FROM xemboi_quantri;  -- nhật ký chỉ thêm
-- (quyền đầy đủ của xemboi_web/xemboi_quantri trên các bảng khác: liệt kê trong migration, không dùng GRANT ALL)

-- (7) Row-Level Security — lớp phòng hờ
ALTER TABLE rag_doan ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_web ON rag_doan FOR SELECT TO xemboi_web USING ("phamVi" = 'CONG_KHAI');
CREATE POLICY p_quantri ON rag_doan FOR ALL TO xemboi_quantri USING (true) WITH CHECK (true);
CREATE POLICY p_worker ON rag_doan FOR ALL TO xemboi_worker USING (true) WITH CHECK (true);
```

Những điểm `[CHƯA KIỂM]` phải thử trên VPS trước khi chạy thật:
- Phiên bản pgvector đang cài. Lọc kèm HNSW chạy tốt hơn từ 0.8 (iterative scan); 12 dẫn README bản 0.8.7.
- Bộ lập kế hoạch có dùng chỉ mục một phần khi truy vấn qua view không. Kiểm bằng `EXPLAIN`.
- View chạy với quyền của chủ view. Theo hiểu biết của em, RLS của bảng gốc khi đó áp theo chủ view, không theo `xemboi_web`. Lớp chặn chính vẫn là điều kiện `WHERE` của view cộng với việc thu quyền bảng gốc. Nếu muốn RLS áp theo người gọi thì dùng `security_invoker = true` (có từ Postgres 15).

### 6.4. Chuyển dữ liệu cũ

**`AgentKnowledgeDoc` / `AgentKnowledgeChunk`:**

1. **Kiểm kê** (chỉ đọc): `SELECT "sourceType", category, count(*) FROM "AgentKnowledgeDoc" GROUP BY 1,2;` và đếm chunk. Số dòng hiện có: `[CHƯA KIỂM]`. 06 ghi Postgres cục bộ từng tắt, và route `knowledge` có đường lùi `inMemoryChunks`.
2. **Mỗi `AgentKnowledgeDoc` → một `RagNguon`:**
   - mã `XB-<8 ký tự đầu id>`, `loaiNguon = 'noi_bo_xemboi'`;
   - **`phapLy = 'C'`, `chiNoiBo = true`** với mọi `sourceType`. Lý do: `CRAWLED` là nội dung cào của người khác; `SEEDED`/`MANUAL_UPLOAD` chưa rõ gốc. Người biên tập xếp loại lại từng dòng sau.
   - Quan hệ `agentId` → bảng nối `AiAgent ↔ RagNguon`.
3. **`rawContent` → `RagVanBan`** (`phienBanCongCu = 'chuyen-tu-agent-knowledge'`), rồi cho chạy pipeline từ bước 3 (làm sạch → cắt → nhúng bge-m3).
4. **Không chép cột `embedding vector(1536)`.** Đó là vector băm giả (`rag-engine.ts:57-90`), không cùng không gian với bge-m3, và sai số chiều.
5. **Chạy song song:** cờ `RAG_V2=1` cho `rag-engine` đọc bảng mới qua `tim-cong-khai.ts`. Bảng cũ để chỉ đọc. Sau 2 tuần không lỗi: xóa route `/api/admin/agents/[id]/knowledge`, mảng `inMemoryChunks`, hàm `generateVectorEmbedding` và hai model cũ.
6. **Lưu ý:** sau khi chuyển, mọi tài liệu cũ là `NOI_BO`. Vì vậy **chat công khai sẽ không còn dùng chúng** cho tới khi được xếp lại thành A hoặc có phép. Đây là chủ ý; xem việc cần anh quyết.

**`Post` / `Category`:**
- Mỗi `Post` → `NoiDung` loại `BAI` (`postCuId` giữ id cũ), một `NoiDungPhienBan` với `nguonTao = 'NHAP_CU'`, và một `SeoTrang` mang `seoTitle`, `seoDescription`, `canonicalUrl`, `schemaJsonLd`.
- Trạng thái: `isPublished = true` → `DA_XUAT_BAN` nhưng **`noindex = true`** cho tới khi qua quy trình duyệt. Lý do: 07 mục 3.4 không cho index trang chưa có người duyệt.
- `Category` → nhãn `mang` + trang `HUB`.
- `CMS_ARTICLES` (mảng tĩnh trong `src/lib/core/cms-data`, đang dùng trong `sitemap.ts`): nạp bằng một script seed theo cùng cách.

---

## 7. Trang quản trị và API

### 7.1. Danh sách trang

Quyền viết tắt: **QT** quản trị · **BT** biên tập · **CG** chuyên gia duyệt · **SL** xem số liệu.

| Đường dẫn | Chức năng | Quyền |
|:--|:--|:--|
| `/quan-tri/dang-nhap` | Đăng nhập, mã hai lớp (Đợt 4) | Mọi người |
| `/quan-tri` | Bảng điều khiển: việc của tôi, cảnh báo SEO, hàng đợi RAG, hạn mùa vụ, băng nhắc giấy phép | Mọi vai trò (khối hiện theo quyền) |
| `/quan-tri/seo/tu-khoa` | Kho từ khóa: lọc, gán, đổi trạng thái hàng loạt | BT, QT (SL chỉ xem) |
| `/quan-tri/seo/tu-khoa/nhap` | Nhập CSV KP, autocomplete, cụm 08 | BT, QT |
| `/quan-tri/seo/cum` | Cụm, trang đích, gợi ý gom cụm | BT, QT |
| `/quan-tri/seo/quy-tac` | Quy tắc gán regex, chạy thử, áp dụng | BT, QT |
| `/quan-tri/seo/bao-cao` | Tỷ lệ phủ, từ khóa chưa có trang, trùng ý định | BT, QT, SL |
| `/quan-tri/seo/trang` | Danh sách trang: lọc theo loại, điểm, trạng thái index | BT, QT, SL (xem) |
| `/quan-tri/seo/trang/[id]` | Sửa title/meta/H1/canonical/noindex/JSON-LD, điểm onpage, xem trước Google, liên kết vào/ra, số liệu Search Console | BT, QT |
| `/quan-tri/seo/mau-trang` | Mẫu trang lập trình, đồng bộ mẫu | BT, QT |
| `/quan-tri/seo/lien-ket` | Đồ thị, mồ côi, độ sâu > 3, gợi ý (quy tắc + ngữ nghĩa), phân bố anchor | BT, QT |
| `/quan-tri/seo/chuyen-huong` | Redirect, nhập danh sách xemtuvi.vn, kiểm vòng lặp, xuất map nginx | BT (thường), QT (cả tên miền) |
| `/quan-tri/seo/sitemap-robots` | Nhóm sitemap, số URL mỗi nhóm, sửa robots | QT |
| `/quan-tri/seo/xep-hang` | Search Console: theo trang, theo truy vấn, tụt hạng | BT, QT, SL |
| `/quan-tri/seo/lich-mua` | Lịch mùa vụ, hạn lên trang | BT, QT, SL |
| `/quan-tri/seo/tu-cam` | Danh sách từ cấm, thử một đoạn văn | BT, QT |
| `/quan-tri/noi-dung` | Danh sách theo trạng thái (kiểu bảng Kanban), "việc của tôi" | BT, QT, CG (chỉ hàng chờ duyệt mảng của mình) |
| `/quan-tri/noi-dung/moi` | Tạo: chọn loại, mảng, trang SEO | BT, QT |
| `/quan-tri/noi-dung/[id]` | Soạn theo khối; cột phải là đoạn RAG (công khai/nội bộ); AI soạn; kiểm; gửi duyệt | BT, QT |
| `/quan-tri/noi-dung/[id]/phien-ban` | Lịch sử, so sánh, khôi phục | BT, QT, CG |
| `/quan-tri/noi-dung/[id]/duyet` | Màn duyệt của chuyên gia: phiên bản, nguồn, đoạn gốc, ý kiến | CG, QT |
| `/quan-tri/noi-dung/tac-gia` | Hồ sơ tác giả, người duyệt (E-E-A-T) | QT |
| `/quan-tri/rag/nguon` | Danh mục nguồn, lọc A/B/C, phạm vi, trạng thái tải, xin phép | QT, BT (xem) |
| `/quan-tri/rag/nguon/nhap` | Nạp 12-thu-vien-rag.csv + so-tai.csv, xem khác biệt | QT |
| `/quan-tri/rag/nguon/[ma]` | Chi tiết nguồn: tệp, thống kê, đổi `chiNoiBo`, chạy lại từ bước N | QT (sửa), BT (xem) |
| `/quan-tri/rag/hang-doi` | Hàng đợi theo bước, máy, trạng thái; lỗi; chạy lại; nhịp tim máy trạm | QT |
| `/quan-tri/rag/doan` | Trình duyệt đoạn, lọc, gắn nhãn hàng loạt | QT, BT, CG |
| `/quan-tri/rag/doan/[id]` | Xem/sửa đoạn, ảnh trang gốc, lịch sử sửa | QT, BT, CG |
| `/quan-tri/rag/thuat-ngu` | Bảng thuật ngữ Hán ↔ Việt | QT, BT |
| `/quan-tri/rag/thu` | Thử truy vấn (công khai/nội bộ), so nhánh vector/từ khóa | QT, BT, CG |
| `/quan-tri/rag/danh-gia` | Bộ câu hỏi chuẩn, chạy đánh giá, so các lần | QT, BT |
| `/quan-tri/rag/thong-ke` | Dung lượng, số đoạn, chi phí | QT, BT, SL |
| `/quan-tri/giay-phep/ma-ngoai` | Sổ mã ngoài (14), dòng sử dụng | QT, BT (xem) |
| `/quan-tri/giay-phep/xin-phep` | Thư xin phép, bằng chứng, mẫu thư | QT |
| `/quan-tri/giay-phep/kiem-mo` | Cổng kiểm trước khi mở tên miền | QT, BT (xem) |
| `/quan-tri/so-lieu` | Gộp dashboard + analytics cũ | QT, BT, SL |
| `/quan-tri/r1` | Giữ nguyên chức năng R1 | QT, SL (không thấy lead) |
| `/quan-tri/khach-hang`, `/quan-tri/khach-hang/[id]` | CRM cũ | QT |
| `/quan-tri/hoi-thoai` | Hội thoại cũ + mô phỏng | QT |
| `/quan-tri/ai/tro-ly` | Cấu hình trợ lý AI (persona, giọng, mô hình, nguồn RAG được dùng) | QT |
| `/quan-tri/he-thong/tai-khoan` | Tài khoản, vai trò, mảng duyệt | QT |
| `/quan-tri/he-thong/nhat-ky` | Nhật ký thao tác, lọc | QT |
| `/quan-tri/he-thong/cai-dat` | Ngưỡng onpage, giá token, ngày mở tên miền | QT |
| `/quan-tri/he-thong/sao-luu` | Lần sao lưu gần nhất, lần thử khôi phục | QT |

### 7.2. API

Mọi route nằm dưới `/api/quan-tri/`. Mỗi route gọi `yeuCauQuyen()`, ghi nhật ký với thao tác ghi, `dynamic = 'force-dynamic'`.

| Nhóm | Route | Phương thức |
|:--|:--|:--|
| Xác thực | `/api/quan-tri/dang-nhap`, `/dang-xuat`, `/toi` | POST, POST, GET |
| Tài khoản | `/api/quan-tri/tai-khoan`, `/tai-khoan/[id]` | GET, POST / GET, PATCH |
| Nhật ký | `/api/quan-tri/nhat-ky` | GET |
| Cài đặt | `/api/quan-tri/cai-dat/[khoa]` | GET, PUT |
| Từ khóa | `/api/quan-tri/seo/tu-khoa` (lọc, phân trang), `/tu-khoa/hang-loat` (đổi trạng thái/gán), `/tu-khoa/nhap` (multipart, `?thu=1` để chạy thử) | GET / POST / POST |
| Cụm, quy tắc | `/api/quan-tri/seo/cum[/id]`, `/seo/quy-tac[/id]`, `/seo/quy-tac/[id]/chay-thu`, `/ap-dung` | CRUD / POST |
| Báo cáo | `/api/quan-tri/seo/bao-cao/phu`, `/chua-co-trang`, `/trung-y-dinh` (`?csv=1`) | GET |
| Trang | `/api/quan-tri/seo/trang[/id]`, `/trang/[id]/cham-diem`, `/trang/nhap` | CRUD / POST / POST |
| Mẫu trang | `/api/quan-tri/seo/mau-trang[/id]`, `/mau-trang/[id]/dong-bo` | CRUD / POST |
| Liên kết | `/api/quan-tri/seo/lien-ket` (lọc), `/lien-ket/goi-y`, `/lien-ket/[id]` (duyệt/bỏ), `/lien-ket/do-thi` | GET / GET / PATCH / GET |
| Redirect | `/api/quan-tri/seo/chuyen-huong[/id]`, `/chuyen-huong/kiem`, `/chuyen-huong/xuat-nginx` | CRUD / POST / POST |
| Search Console | `/api/quan-tri/seo/gsc/trang`, `/gsc/truy-van`, `/gsc/dong-bo` (chạy tay) | GET / POST |
| Cảnh báo, mùa | `/api/quan-tri/seo/canh-bao[/id]`, `/seo/lich-mua[/id]` | GET, PATCH / CRUD |
| Từ cấm | `/api/quan-tri/tu-cam[/id]`, `/tu-cam/kiem` | CRUD / POST |
| Nội dung | `/api/quan-tri/noi-dung[/id]`, `/[id]/phien-ban`, `/[id]/chuyen-trang-thai`, `/[id]/duyet`, `/[id]/ai-soan`, `/[id]/kiem` | CRUD / GET, POST / POST / POST / POST / POST |
| RAG nguồn | `/api/quan-tri/rag/nguon[/ma]`, `/rag/nguon/nhap`, `/rag/nguon/[ma]/chay-lai` | GET, PATCH / POST / POST |
| RAG hàng đợi | `/api/quan-tri/rag/viec` (lọc), `/rag/viec/[id]/chay-lai`, `/rag/viec/[id]/huy`, `/rag/may` | GET / POST / POST / GET |
| RAG đoạn | `/api/quan-tri/rag/doan` (lọc), `/rag/doan/[id]` (sửa), `/rag/doan/nhan-hang-loat`, `/rag/doan/[id]/anh` | GET / PATCH / POST / GET |
| RAG truy vấn | `/api/quan-tri/rag/tim` (`nguCanh=CONG_KHAI\|NOI_BO`) | POST |
| RAG đánh giá | `/api/quan-tri/rag/cau-hoi-chuan[/id]`, `/rag/danh-gia`, `/rag/danh-gia/chay` | CRUD / GET / POST |
| RAG thống kê | `/api/quan-tri/rag/thong-ke` | GET |
| Giấy phép | `/api/quan-tri/giay-phep/ma-ngoai[/id]`, `/su-dung`, `/xin-phep[/id]`, `/kiem-mo` | CRUD / CRUD / CRUD / GET |
| Công khai (không cần đăng nhập) | `/sitemap.xml`, `/sitemaps/[nhom].xml`, `/robots.txt` | GET |

**Máy trạm không gọi API.** Tiến trình Python nối thẳng Postgres qua đường hầm SSH bằng vai trò `xemboi_worker`. Lý do: nạp vector theo lô bằng `COPY` nhanh hơn qua HTTP, và không mở cổng Postgres ra Internet.

### 7.3. Phác giao diện dạng chữ

> **Mọi con số trong các bản phác dưới đây là số minh họa để hình dung bố cục, không phải số đo.** Ví dụ: số đoạn, số giây GPU, điểm, ngày mở tên miền.

**Bảng điều khiển `/quan-tri`**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ XEMBOI · QUẢN TRỊ          [Tìm mọi thứ…]                 Cường (QT, BT) ▾  │
├───────────────┬──────────────────────────────────────────────────────────────┤
│ Bảng điều khiển│ ⚠ Còn 27 ngày tới ngày mở tên miền · 3 mục chặn  [Xem cổng] │
│ SEO        ▸  ├──────────────────────┬────────────────────┬──────────────────┤
│ Nội dung   ▸  │ VIỆC CỦA TÔI         │ CẢNH BÁO SEO       │ HÀNG ĐỢI RAG     │
│ Thư viện RAG ▸│ 4 nháp cần biên tập  │ 2 tụt hạng         │ Máy trạm: 3' trước│
│ Giấy phép  ▸  │ 2 bị yêu cầu sửa     │ 11 trang mồ côi    │ CHỜ 1.204        │
│ Số liệu       │ 1 đến hạn cập nhật   │ 1 trùng ý định     │ LỖI 7  [Chạy lại]│
│ R1            │                      │ 0 lỗi 404          │ Đoạn: 38.112     │
│ Khách hàng    ├──────────────────────┴────────────────────┴──────────────────┤
│ Hội thoại     │ MÙA VỤ   Tết 2028 · hạn 31/10/2027 · 6/14 trang xuất bản ███░│
│ Hệ thống   ▸  │ PHỦ TỪ KHÓA  18 % theo số · 41 % theo lượng tìm               │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

**Sửa trang `/quan-tri/seo/trang/[id]`**

```
/sinh-nam/1990  · Mẫu: sinh-nam · XUAT_BAN · Điểm 82/100      [Lưu] [Xuất bản]
┌─ Thẻ ───────────────────────────────┐ ┌─ Xem trước Google ── [Máy tính|ĐT] ┐
│ Title  [Sinh năm 1990 mệnh gì? …] 48│ │ xemboi.vn › sinh-nam › 1990        │
│ Meta   [Người sinh năm 1990 …   ]138│ │ Sinh năm 1990 mệnh gì? Canh Ngọ …  │
│ H1     [Sinh năm 1990: Canh Ngọ …]  │ │ Người sinh năm 1990 (từ 27/01/1990 │
│ Canonical [tự]   □ noindex □ nofollow│ │ …) thuộc tuổi Canh Ngọ, mệnh …     │
│ Từ khóa chính: "1990 mệnh gì" 50.000│ └────────────────────────────────────┘
│ JSON-LD [WebPage ▾] {…}  ✔ hợp lệ    │ ┌─ Điểm onpage ──────────────────────┐
└──────────────────────────────────────┘ │ ✔ Title có từ khóa  ✔ 1 H1         │
┌─ Liên kết ───────────────────────────┐ │ ✔ Không từ cấm      ⚠ 2 ảnh thiếu alt│
│ Vào 4 · Ra 7 · Độ sâu 2              │ │ ✖ Chưa có người duyệt → chưa index │
│ Gợi ý: /can-chi/canh-ngo (0,91) [+]  │ └────────────────────────────────────┘
└──────────────────────────────────────┘ Search Console 28 ngày: 1.240 hiển thị · 37 nhấp · vị trí 14,2 ▼3
```

**Trình duyệt đoạn `/quan-tri/rag/doan/[id]`**

```
紫微斗數全書 (WS01) · A · CÔNG KHAI · 卷一 › 諸星問答論 › 天機      đoạn 412/1.930
┌─ Ảnh trang (nếu là bản quét) ─┐ ┌─ Văn bản ─────────────────────────────────┐
│                               │ │ Nguyên văn  [天機南斗益筭之星…        ] ✎  │
│        [ảnh tờ 23b]           │ │ Chuẩn hóa   [天機南斗益算之星…        ]     │
│                               │ │ Hán Việt(máy) Thiên Cơ Nam Đẩu ích toán … │
│ OCR tin cậy: 0,81  ⚠ chưa soát│ │ Loại: chinh_van · Chú con: 2 đoạn         │
└───────────────────────────────┘ └───────────────────────────────────────────┘
Nhãn: [mảng C] [sao: Thiên Cơ] [+ thêm]                    [◀ Trước] [Đã soát ✔] [Sau ▶]
Lịch sử sửa: 21/11 Cường: 筭→算 (chuẩn hóa)            Được trích ở: /tu-vi/sao/thien-co (khối 3)
```

**Hàng đợi `/quan-tri/rag/hang-doi`**

```
Máy: may-tram-1 ● (nhịp tim 40 giây trước, GPU) · vps ●
Bước        CHỜ   ĐANG  XONG    LỖI
PHAT_HIEN     0     0    412      0
TRICH        12     1    380      3  [Xem lỗi] [Chạy lại tất cả lỗi]
OCR         640     1     22      4
CAT_DOAN     30     0    350      0
NHUNG       512     1  37.600     0   ~ 1,8 giây GPU / 100 đoạn
NAP_DB        0     0  37.600     0
```

**Cổng kiểm `/quan-tri/giay-phep/kiem-mo`**

```
Ngày mở tên miền: 18/12/2026 (còn 27 ngày)                      KẾT QUẢ: ✖ CHẶN
✖ Mã cần xin phép đang chạy trên web: 1   (vd. mã âm lịch gốc Hồ Ngọc Đức?) [Xem]
✖ Trang đã xuất bản trích đoạn NỘI BỘ: 2                                     [Xem]
⚠ Mã MIT đang chạy chưa có dòng NOTICE: 3                                     [Xem]
✔ Ghi công CC BY-SA đủ trên 14 trang trích Kanripo/Wikisource
```

---

## 8. Lộ trình dựng

**Cách giao cho Antigravity:**
- Mỗi đợt là một nhánh git riêng (`quan-tri-dot-0` …). Claude Code giao từng đợt kèm đoạn "Giao việc" bên dưới.
- Antigravity **không được**:
  - đổi `phamVi` bằng tay trong SQL;
  - cấp `GRANT ALL`;
  - gửi đoạn `NOI_BO` vào LLM;
  - dùng `prisma db push` trên CSDL thật.
- Mọi đợt phải có test chạy được và một tệp `docs/v2/17-dot-N-ket-qua.md` ghi: cái gì đã làm, cái gì chưa, số liệu kiểm.

Số giờ là giờ dựng của Antigravity cộng thời gian anh kiểm, `[ƯỚC LƯỢNG]`, chưa đo tốc độ thực tế.

### Đợt 0: vá bảo mật (4–6 giờ). Làm ngay

> **Đã làm 21/11/2026 (Claude Code, chưa commit, chưa đưa lên VPS):**
> - Thêm `src/middleware.ts` (runtime nodejs) chặn `/admin/**` (chuyển về `/quan-tri/r1`) và `/api/admin/**` (401).
> - Thêm `yeuCauQuanTri(req)` vào `src/lib/r1/admin-auth.ts` và gọi ở đầu cả 16 handler trong `src/app/api/admin/**`.
> - `UPDATE_LLM_CONFIG` không nhận `apiKey` nữa; bỏ ô nhập key trên `/admin/agents`; key chỉ hiện 4 ký tự cuối.
> - `robots.ts` chặn `/admin`; khu quản trị gửi `X-Robots-Tag: noindex` và `Cache-Control: no-store`.
> - Nghiệm thu bằng `node scripts/kiem-dot0.mjs` trên `next dev`: 57/57 ĐẠT. 16 handler × (không khóa → 401, có khóa → không 401, khóa sai → 401); trang /admin; robots; sitemap; meta noindex `/la-so/`. Cookie đăng nhập hợp lệ mở được `/admin` và `/api/admin`.

> Anh quyết 21/11/2026: lá số **không bao giờ** được index trên xemboi.vn. Đã thêm `robots` noindex/nofollow cho `/la-so/[slug]`. Đợt này còn phải: kiểm sitemap không chứa `/la-so/`; bộ chấm onpage chặn xuất bản mọi trang kết quả lá số có `index`.

- **Phạm vi:**
  - `src/middleware.ts` chặn `/admin/**`, `/api/admin/**` bằng cookie ADMIN_KEY sẵn có (`daXacThucQuanTri`).
  - Thêm kiểm `daXacThucQuanTri(req)` vào từng route trong `src/app/api/admin/**`.
  - Bỏ action `UPDATE_LLM_CONFIG` nhận `apiKey` từ giao diện.
  - Thêm `/admin` vào `robots.ts`, thêm header `X-Robots-Tag: noindex`.
- **Nghiệm thu:**
  - `curl` không có cookie vào `/api/admin/customers` → 401;
  - có cookie → 200;
  - test tự động cho 8 route.
- **Rủi ro:** thấp. Tạm thời vẫn là một khóa chung, Đợt 1 thay.

### Đợt 1: nền để bắt đầu SEO và nạp RAG (70–95 giờ)

**Phạm vi:**
1. **Nền tảng:**
   - chuyển sang `prisma migrate`;
   - model `TaiKhoan`, `PhienDangNhap`, `NhatKyThaoTac`, `CaiDat`;
   - đăng nhập, `yeuCauQuyen`, layout `/quan-tri` có menu theo quyền;
   - script tạo quản trị đầu tiên;
   - chuyển `/quan-tri/r1` sang tài khoản;
   - sao lưu `pg_dump` hằng đêm + kéo về máy trạm.
2. **SEO tối thiểu:**
   - `SeoTuKhoa`, `SeoLoNhap`, `SeoCum`, `SeoQuyTacGan`;
   - nhập 4 loại tệp ở mục 1.1, nạp 11.212 từ khóa và cụm 08;
   - quy tắc mục 1.1.1;
   - báo cáo phủ và từ khóa chưa có trang;
   - `SeoMauTrang`, `SeoTrang` (sửa thẻ, chưa chấm điểm);
   - `SeoChuyenHuong` + tự sinh redirect khi đổi slug;
   - sitemap chỉ mục theo nhóm với `lastmod` thật; robots từ `CaiDat`;
   - `TuCam` + hàm `kiemTuCam` (dùng cho title/meta).
3. **RAG tối thiểu:**
   - `RagNguon`, `RagTep`, `RagVanBan`, `RagViec`, `RagMayXuLy`, `RagDoan`, `ThuatNgu`;
   - SQL mục 6.3 đầy đủ (CHECK, trigger, view, vai trò, RLS);
   - nạp 314 nguồn + so-tai;
   - tiến trình Python trên máy trạm cho bước 1, 2a, 3, 4, 5, 6 (chỉ văn bản sạch Kanripo + Wikisource, 12 mục 4 đợt 1);
   - trang nguồn, hàng đợi, trình duyệt đoạn (xem + sửa, chưa gắn nhãn hàng loạt);
   - `/quan-tri/rag/thu` ở chế độ chỉ từ khóa nếu chưa chốt cách nhúng câu hỏi.
4. **Test `tests/rag-pham-vi.test.mjs`** (mục 3.5): bắt buộc xanh trước khi gộp nhánh.

**Nghiệm thu:**
- đăng nhập được 4 vai trò, mỗi vai trò chỉ thấy đúng menu;
- nhập lại cùng tệp KP không sinh dòng trùng;
- sitemap không chứa trang `noindex`;
- nạp xong ít nhất WS01 (Tử Vi Đẩu Số toàn thư) và 5 sách Kanripo, có đoạn và vector;
- test phạm vi xanh;
- thử đổi một nguồn C sang `CONG_KHAI` bằng SQL thì bị từ chối.

> **Đã làm 21–22/11/2026** (Claude Code, Antigravity, agent phụ). Chạy trên Postgres máy trạm. Chưa commit, chưa đưa lên VPS. Xem thêm `00-BAN-CU-BAN-MOI.md`.
> - **Nền:**
>   - migration `0000_nen`, `0001_dot1_mo_hinh`, `0002_dot1_rag_pham_vi`;
>   - tài khoản, 4 vai trò, phiên `qt_phien`, nhật ký thao tác;
>   - `scripts/tao-tai-khoan.ts`.
> - **SEO:**
>   - `scripts/seo-nap-ban-dau.ts` nạp 65 cụm, 153 trang (32 mẫu), 174 quy tắc, 24 nhóm loại, 77 từ cấm và 11.212 từ khóa;
>   - đối chiếu với `gan-tu-khoa.csv`: 0 lệch, nạp lại không sinh dòng mới;
>   - 6 trang `/quan-tri/seo/*`;
>   - sitemap chỉ mục từ CSDL, giữ nhóm `hien-tai` cho 213 URL v1;
>   - 301 phục vụ ở middleware;
>   - 104 dòng `DUONG_CU` từ `18-url-cu-xemboi.csv` nạp sẵn ở trạng thái **tắt** (`scripts/seo-nap-url-cu.ts`).
> - **RAG:**
>   - 314 nguồn (164 A công khai, 150 B/C nội bộ);
>   - 72 nguồn đã xử lý, 32.061 đoạn, 32.033 có vector (bge-m3, RTX 2080 Ti, khoảng 300 đoạn/giây);
>   - pipeline ở `tools/rag-may-tram/`.
>   - Trang quản trị RAG (`/quan-tri/rag/{nguon,hang-doi,doan,thu}`): Antigravity dựng theo `lenh-antigravity/19-rag-quan-tri.md`. Claude Code duyệt ngày 22/11:
>     - mọi truy vấn đều lọc phạm vi qua `src/lib/rag/pham-vi.ts`, SQL đều có tham số;
>     - tài khoản `cg` chỉ thấy 164 nguồn công khai;
>     - đã đổi lớp CSS v1 bị đụng (`so`, `nhan`, `gia-tri`) sang `qt-*`.
>   - Tìm ngữ nghĩa trên web chưa bật. Trang Thử truy vấn chỉ tìm theo chữ; trên CSDL máy trạm (`ctype C`), trigram không tách được chữ Hán nên trang dùng thêm `ILIKE`.
> - **Nghiệm thu:**
>   - `scripts/kiem-dot1-quyen.mjs`: 4 vai trò, menu và quyền đúng;
>   - `scripts/kiem-dot1-seo.mjs`: sitemap không có trang noindex hoặc nháp; 301, regex và 410 chạy đúng; robots đúng;
>   - `tests/dot1/rag-pham-vi.test.mjs` 11/11.
> - **Làm thêm ngày 22/11, sau commit `62074c0`:**
>   - Sao lưu: `scripts/sao-luu-csdl.mjs` chạy `pg_dump -Fc` rồi `pg_restore --list` để kiểm, giữ 7 bản ngày và 4 bản tuần. Lần đầu: 126 MB, 23 giây, lưu ở `may-tram/sao-luu`. Chưa đặt lịch chạy, chưa mã hóa, chưa chạy trên VPS.
>   - Chuyển hướng hỗ trợ `$n:w` (đệm số 0). Đã nạp 1 biểu thức thay 730 URL `xem-ngay-tot-xau-ngay-{d}-{m}-{yyyy}` → `/lich-am/{yyyy}/{mm}/{dd}`, đang tắt. `kiem-dot1-seo.mjs` có thêm bài kiểm cho trường hợp này.
>   - **Không lọc đoạn ngắn**, bỏ mục này khỏi kế hoạch. 1.518 đoạn dưới 8 ký tự gồm 1.130 hào từ Kinh Dịch (ví dụ "九二：貞吉。") và 388 dòng cấu trúc quẻ ("巽下坎上"); 2.168 đoạn chú/sớ trỏ về chúng. Cách xử lý chuyển sang Đợt 3: khi nhúng, ghép thêm `duongDan` và đoạn cha làm ngữ cảnh, rồi đo recall.
> - **Chưa làm:**
>   - nạp bảng `thuat_ngu`;
>   - tìm lai RRF (Đợt 3);
>   - phân loại gõ sai (Levenshtein, 1.1.2).

**Rủi ro:**
- GPU máy trạm chưa xác nhận (nếu không có: bge-m3 chạy CPU, chậm hơn nhiều, `[CHƯA KIỂM]` tốc độ);
- VPS 2 GB RAM chật khi thêm chỉ mục HNSW;
- `pg_trgm` với chữ Hán;
- chuyển `db push` → `migrate` trên CSDL đang có dữ liệu R1: phải tạo migration nền (`migrate diff` + `migrate resolve`), làm thử trên bản sao trước.

### Đợt 2: nội dung và chấm điểm (55–75 giờ)

- **Phạm vi:**
  - `NoiDung`, `NoiDungPhienBan`, `NoiDungDuyet`, `NoiDungTrichDan`, `HoSoTacGia`, `AiSoanViec`;
  - soạn theo 9 khối; AI soạn chỉ với đoạn công khai + bộ kiểm trích dẫn;
  - quy trình trạng thái đầy đủ; so sánh/khôi phục phiên bản;
  - chấm onpage 17 tiêu chí; xem trước Google;
  - chuyển `Post`/`CMS_ARTICLES` sang `NoiDung`;
  - chuyển `AgentKnowledgeDoc/Chunk` (mục 6.4);
  - gộp `/admin/*` vào `/quan-tri/*` rồi redirect 308.
- **Nghiệm thu:**
  - một mục từ điển thiếu khối 3 không gửi duyệt được;
  - một nháp AI có mã đoạn bịa bị gắn cờ;
  - sửa sau khi duyệt thì trạng thái quay lại chờ duyệt;
  - trang chưa có người duyệt tự `noindex`.
- **Rủi ro:** chất lượng nháp AI với văn bản Hán cổ; chi phí token (đo ở `AiSoanViec`); giao diện soạn theo khối tốn công hơn dự tính.

> **Tiến độ 22/11/2026** (chưa commit):
> - **Phần lõi** (Claude Code) nằm ở `src/lib/noi-dung/`, gồm hàm thuần và test:
>   - `khoi.ts`: 9 khối;
>   - `trich-dan.ts`: bộ kiểm trích dẫn (mã bịa, khối 3 thiếu nguồn, trích nguyên văn dài);
>   - `quy-trinh.ts`: luật chuyển trạng thái; AI chỉ viết nháp; sửa sau khi duyệt thì quay về chờ duyệt; duyệt pháp lý; tự noindex;
>   - `onpage.ts`: 17 tiêu chí; tiêu chí 16 chờ đồ thị liên kết ở Đợt 3;
>   - `ngu-canh-ai.ts`: `taoNguCanhAi` chỉ đọc view công khai.
>
>   Cả 4 tiêu chí nghiệm thu đều có test trong `tests/dot2/` (thuần 7/7, CSDL 1/1).
> - Quyền `noi_dung.xem`, menu "Nội dung".
> - Trang `/quan-tri/tai-khoan` (Claude Code):
>   - tạo tài khoản, sửa vai trò và mảng duyệt, vô hiệu hóa, đặt lại mật khẩu, thu hồi phiên;
>   - bớt quyền thì đăng xuất ngay;
>   - chống tự khóa và giữ ít nhất một quản trị.
> - **Giao diện soạn, duyệt, so sánh phiên bản, xem trước Google**, và trang `/quan-tri/nhat-ky`: Antigravity làm theo `lenh-antigravity/21-noi-dung-quan-tri.md`, **xong ngày 22/11**. Báo cáo ở `21-bao-cao.md`.
>   - Antigravity đã chạy cả vòng trên trình duyệt: thiếu khối thì bị chặn, mã bịa bị báo; giao chuyên gia, chuyên gia đồng ý; sửa sau khi duyệt thì quay về chờ duyệt; xuất bản thì `noindex=false`. Dữ liệu thử đã dọn.
>   - Claude Code đã soát: mọi action kiểm quyền ở dòng đầu, gọi lại `kiemChuyen` trên máy chủ, ghi nhật ký cùng giao dịch, không có SQL ghép chuỗi hay lớp CSS cũ.
>   - Nút "AI soạn" do Claude Code gắn (`[id]/NutAiSoan.tsx`, `[id]/ai-soan-hanh-dong.ts`); kiểm bằng `scripts/kiem-dot2-ai-soan.mjs`.
>   - Hai đề nghị sửa lõi:
>     1. Đưa lỗi trích dẫn vào onpage cho mọi loại: **không sửa**, vì giao diện đã tự gộp; sửa ở lõi sẽ đếm lỗi hai lần.
>     2. Điểm onpage vẫn trừ 10 cho T10 sau khi chuyên gia đã duyệt: **để Đợt 3**, việc quét đêm sẽ chấm lại `diemOnpage` theo duyệt thật.
>   - Chưa thử luồng duyệt pháp lý và vài bộ lọc phụ trên trình duyệt.
> - **Chuyển bài cũ** bằng `scripts/chuyen-bai-cu.ts` (có cờ `--thu` để chạy thử), chạy lại nhiều lần vẫn an toàn:
>   - mỗi `Post` (khóa `post:<id>`) và mỗi bài trong `CMS_ARTICLES` (khóa `cms:<slug>`) thành một `NoiDung` loại BAI;
>   - mỗi bài có một phiên bản `NHAP_CU` (thân giữ HTML cũ) và một `SeoTrang` `/bai-viet/<slug>`, `noindex=true`;
>   - danh mục chuyển thành nhãn `mang`;
>   - không xóa hay sửa bảng cũ.
>
>   Máy trạm có 0 Post và 4 bài CMS; đã chuyển 4/4, chạy lại thì báo "đã có 4". Trên VPS chưa chạy.
>
>   **Còn lại:** gộp danh mục thành trang HUB khi dựng trang hub.
> - **Chuyển tri thức trợ lý cũ** bằng `scripts/chuyen-tri-thuc-cu.ts` (có cờ `--thu`; test `tests/dot2/chuyen-tri-thuc-cu.test.mjs` 1/1), làm bước 1–4 của 6.4:
>   - mỗi `AgentKnowledgeDoc` thành một `RagNguon` hạng C, `chiNoiBo`, NOI_BO, gắn trợ lý cũ;
>   - `rawContent` ghi ra `thu-vien-rag/noi-bo-xemboi/<ma>.txt`, rồi máy trạm chạy `chay.py xu-ly --nguon XB-…`. `chay.py` nay nhận thêm tiền tố `XB-`;
>   - không chép vector 1536 chiều.
>
>   **Lệch 6.4:** mã là `XB-` cộng 10 ký tự hex đầu của sha256(id), không phải 8 ký tự đầu id. Lý do: cuid tạo gần nhau trùng phần đầu, vì phần đầu là dấu thời gian.
>
>   Máy trạm có 0 tài liệu cũ; dữ liệu thật nằm trên CSDL VPS, chưa chạy ở đó. Bước 5 (cờ `RAG_V2`, xóa route cũ sau 2 tuần) chưa làm.
> - **LLM qua 9router** (anh chốt ngày 22/11: dùng dòng GPT trên 9router):
>   - `src/lib/ai/cau-hinh-llm.ts`: cấu hình lưu `CaiDat` khóa `LLM`; khóa API chỉ ở `NINEROUTER_API_KEY`; hàm `goiLlm` gửi `stream:false`;
>   - mặc định trợ lý chat dùng `cx/gpt-6-luna`, AI soạn dùng `cx/gpt-6.1-sol` (thử thật 22/11: cả hai model gọi đạt khoảng 1,1 giây; soạn một mục từ điển từ 6 đoạn mất 15 giây, trích dẫn 0 lỗi), cổng `https://token.vip.vn/v1`;
>   - `llm-provider.ts` ưu tiên 9router khi có khóa, nếu không thì giữ đường cũ;
>   - trang `/quan-tri/ai/mo-hinh` (quyền `ai.tro_ly`, chỉ quản trị): sửa mô hình và nhiệt độ, thử kết nối, ghi nhật ký `ai.doi_llm`;
>   - test `tests/dot2/cau-hinh-llm.test.mjs` 5/5;
>   - khóa `xemboi` (anh tạo) đã ghi vào `.env` máy trạm; khi đưa lên VPS cần thêm vào env của web.
>
>   Codex đi qua gói thuê bao nên không tính tiền theo token; vì vậy `GIA_TOKEN` để 0 và chỉ đếm token.
> - **AI soạn (Đợt 2b): xong.** Phần lõi `src/lib/noi-dung/ai-soan.ts`:
>   - `aiSoanNhap` lấy đoạn công khai, gọi `soan`, kiểm trích dẫn, rồi lưu phiên bản `AI`, các dòng trích dẫn và `AiSoanViec` (token; chi phí 0 vì đi qua thuê bao);
>   - nhật ký ghi `nd.ai_soan`;
>   - từ chối khi nội dung đang chờ duyệt hoặc đã duyệt.
>
>   Test `tests/dot2/ai-soan.test.mjs` 5/5 (mô hình giả). Nút "AI soạn" đã gắn vào trang soạn và thử với khóa thật.
> - **Gộp `/admin/*` vào `/quan-tri/*`: xong** (Antigravity làm 4 trang theo `lenh-antigravity/22-gop-admin-vao-quan-tri.md`, báo cáo ở `22-bao-cao.md`):
>   - `/quan-tri/so-lieu` (`so_lieu.xem`; `visitorId` chỉ hiện 6 ký tự);
>   - `/quan-tri/khach-hang` và `[id]` (danh sách che SĐT và email; mở chi tiết ghi `khach_hang.xem_chi_tiet`; sửa nhãn, ghi chú, điểm qua `suaKhachHang` với quyền mới `khach_hang.sua`, ghi `khach_hang.sua`);
>   - `/quan-tri/hoi-thoai` (vẫn gọi `/api/admin/conversations*`, nay kiểm quyền `hoi_thoai.xem`);
>   - `/quan-tri/ai/tro-ly` (sửa persona và giọng, nhật ký `ai.sua_tro_ly` chỉ lưu độ dài và sha256 của `systemPrompt`; không có ô khóa API; few-shot chỉ đọc).
>
>   Claude Code đã soát mã, thêm nhóm menu "Khách và AI", bỏ mục "CRM cũ", thêm chuyển hướng 308 trong `src/middleware.ts` (`/admin/dashboard|analytics` → so-lieu, `/admin/customers[/id]` → khach-hang, `/admin/conversations` → hoi-thoai, `/admin/agents` → ai/tro-ly, `/admin`, `/admin/inquiries` → `/quan-tri`) và **xóa `src/app/admin/`** (anh đã cho phép). `kiem-dot1-quyen.mjs` kiểm 13 trang và 5 chuyển hướng: đạt.
>
>   Đề nghị của Antigravity, để sau:
>   1. few-shot đang ghi đè tệp `src/lib/ai/few-shot-dialogues.json` lúc chạy (route cũ): chuyển vào CSDL;
>   2. bảng `AiAgent` ở máy trạm trống (persona chỉ khai báo tĩnh): cần bước seed;
>   3. tách `/api/admin/conversations*` sang `/api/quan-tri/hoi-thoai`, bỏ nhánh `ADMIN_KEY`, ghi nhật ký các thao tác POST;
>   4. bỏ số liệu giả dự phòng trong `tracker-server.ts` và `customer-service.ts`.
> - **Còn lại của Đợt 2:** chạy hai script chuyển dữ liệu trên VPS (khi deploy, xem `viec-can-anh.md`); bước 5 của 6.4 (cờ `RAG_V2`); 4 đề nghị trên.

### Đợt 3: liên kết, Search Console, đánh giá RAG (45–65 giờ)

- **Phạm vi:**
  - việc quét trang hằng đêm, `SeoLienKet`, độ sâu, mồ côi;
  - quy tắc liên kết 07 mục 2.4;
  - nhúng trang SEO + gợi ý ngữ nghĩa; phân bố anchor;
  - đồng bộ Search Console hằng ngày, `SeoGscNgay`/`SeoGscTrangNgay`, cảnh báo tụt hạng, trùng ý định;
  - `SeoLichMua` nạp 08 mục 7.2;
  - `RagCauHoiChuan`, `RagDanhGia`, tìm lai vector + từ khóa + RRF; chạy bộ 100 câu để chọn mô hình;
  - xuất map nginx cho redirect xemtuvi.vn (khi có danh sách URL).
- **Nghiệm thu:**
  - đồ thị khớp kiểm tay trên 20 trang;
  - Search Console kéo đủ 16 tháng lần đầu;
  - một báo cáo đánh giá có recall@10 cho ít nhất 2 mô hình.
- **Rủi ro:** quét 7.400 trang trên VPS yếu (chạy ban đêm, giới hạn tốc độ); dữ liệu Search Console của tên miền mới còn ít.

> **Tiến độ Đợt 3, 22/11/2026** (máy trạm, chưa lên VPS):
> - **Bộ quét** `src/lib/seo/quet.ts` + `scripts/seo-quet.ts`:
>   - hạt giống là `/`, mọi `<loc>` trong sitemap và trang `XUAT_BAN`; không theo chuyển hướng; 2 yêu cầu/giây mặc định;
>   - ghi `SeoLienKet` (QUET, DANG_CO) khi cả hai đầu là `SeoTrang`; cập nhật `doSau`, `soLienKetVao/Ra`, `maHttpLanQuet`;
>   - cảnh báo `MO_COI`, `QUA_SAU`, `LOI_HTTP` (hỏng và 3xx), `NOINDEX_TRONG_SITEMAP`, `CANONICAL_LECH`; lần sau hết lỗi thì tự đóng; quét dở (chạm trần) thì không đóng và không báo mồ côi;
>   - báo cáo lần cuối ở `CaiDat` `SEO_QUET_LAN_CUOI`.
>
>   Chạy thật trên dev server: 216 trang, 71 giây, toàn bộ 200, 1.970 liên kết nội bộ; chỉ 7 trang có trong `SeoTrang` (150 trang còn `NHAP`). Kiểm tay 4 trang (`/`, `/kien-thuc`, một bài viết, `/tu-vi-2027`): danh sách liên kết khớp hoàn toàn với DOM trên trình duyệt. Nghiệm thu cần 20 trang: làm tiếp khi có thêm trang v2.
>
>   **Phát hiện thật:** `/tu-vi-2027` (trang v2 duy nhất đang chạy) **mồ côi**: không trang nào trỏ tới, và nó cũng không trỏ đi đâu. Cần gắn liên kết khi làm trang chủ và hub v2.
> - **Quy tắc liên kết** `src/lib/seo/quy-tac-lien-ket.ts` + `scripts/seo-goi-y-lien-ket.ts`: 8 quy tắc 07 mục 2.4 (kế hoạch `lien_ket_ra` của 16-seo-trang.csv, cùng nhóm, form lập lá số, năm kề, `/phuong-phap`, bài "vì sao xem tuổi khác nhau", và 2 quy tắc chỉ hiển thị). Lần đầu sinh 579 gợi ý `DE_XUAT`; chạy lại không trùng; cặp đã bỏ qua không gợi ý lại.
> - **Phân bố anchor** `src/lib/seo/anchor.ts`: 5 loại, 3 ngưỡng `[GIẢ ĐỊNH]`.
> - **Lịch mùa vụ:** `scripts/seo-nap-lich-mua.ts` nạp 10 dòng 08 mục 7.2.
> - Test `tests/dot3/`: thuần 7/7, CSDL 1/1, GSC 4/4.
> - **Giao diện: xong** (Antigravity, Lệnh 23, báo cáo `23-bao-cao.md`): `/quan-tri/seo/lien-ket` 6 tab (tổng quan, cảnh báo, trang mồ côi/quá sâu, gợi ý chấp nhận/bỏ qua, anchor, quy tắc bật/tắt), khối "Liên kết" trong `seo/trang/[id]`, `/quan-tri/seo/lich-mua`. Mọi thao tác cần `seo.sua`, ghi nhật ký `seo.canh_bao`, `seo.goi_y_lien_ket`, `seo.quy_tac_lien_ket`, `seo.lich_mua`. Claude Code đã soát mã, thêm 2 mục menu SEO, `kiem-dot1-quyen.mjs` kiểm 15 trang: đạt.
>   - Sửa lõi theo đề nghị của Antigravity: trước đây gợi ý đã được chèn vào HTML bị đổi thành `DANG_CO` song song với dòng `QUET`, nên một cặp có hai dòng `DANG_CO`. Nay chỉ còn dòng `QUET`, mang theo `quyTacId` của gợi ý; dòng gợi ý bị bỏ. Có test.
>   - Đề nghị còn lại (thêm quan hệ khóa ngoại `SeoLienKet.quyTacId`): để lần đổi schema sau.
> - **Đồng bộ Search Console: mã xong, đang tắt vì chưa có khóa** (`src/lib/seo/gsc.ts` + `scripts/seo-gsc.ts`):
>   - tự ký JWT RS256 bằng `node:crypto` cho tài khoản dịch vụ, không thêm thư viện; khóa là tệp JSON ngoài repo (env `GSC_KHOA_TEP`, mặc định `../may-tram/gsc-xemboi.json`), không ghi CSDL, không in ra; chưa có tệp thì script báo và thoát 0;
>   - kéo từng ngày, 2 truy vấn: ngày×trang×truy vấn×thiết bị → `SeoGscNgay`, ngày×trang×thiết bị → `SeoGscTrangNgay`; tự phân trang 25.000 dòng; kéo lại ngày nào thì thay dữ liệu ngày đó. Mặc định kéo lại 5 ngày gần nhất (Google chốt chậm 2–3 ngày); `--lan-dau` kéo 16 tháng;
>   - cảnh báo, mốc là ngày mới nhất có dữ liệu, so 7 ngày gần nhất với 28 ngày trước đó `[GIẢ ĐỊNH ngưỡng]`: `TUT_HANG` theo cặp trang–truy vấn (≥ 50 hiển thị trong 7 ngày và vị trí tụt ≥ 3) và theo trang (nhấp trung bình ngày giảm ≥ 40 %, cần ≥ 20 nhấp trong 28 ngày); `TRUNG_Y_DINH` (mục 1.1 bước 7b); cảnh báo hết đúng thì tự đóng. Báo cáo lần cuối ở `CaiDat` `SEO_GSC_LAN_CUOI`;
>   - test `tests/dot3/gsc.test.mjs` 4/4 (khóa RSA tự sinh, fetch giả, dữ liệu `[THỬ]` năm 2099). Sửa một lỗi tìm ra khi test: so cột `DATE` với tham số `Date` bị lệch một ngày theo múi giờ phiên, nay so bằng chuỗi `::date`.
>   - Trang `/quan-tri/seo/xep-hang` (Lệnh 24, Antigravity, 22/11) gồm 4 tab: tổng quan, theo trang, theo truy vấn, cảnh báo. Trang được dựng và kiểm trên dữ liệu giả `[THỬ]` từ `scripts/thu-gsc-gia.ts` (45 ngày, 3 URL `/_gia-gsc/`, 4 cảnh báo; tiền tố khác `/_thu-gsc` của `tests/dot3/gsc.test.mjs` vì test dọn theo tiền tố đó); khi có dữ liệu GSC thật thì chạy `--xoa` để dọn.
> - **Lệnh 24, Antigravity làm, Claude Code duyệt 22/11:**
>   - Trang `/quan-tri/rag/danh-gia` có 4 tab: bảng 29 cấu hình, so sánh A/B, từng câu, bộ câu hỏi chuẩn.
>   - Trang `rag/thu` có thêm nút "Lưu thành câu hỏi chuẩn", mã câu dạng `G000001…`. Câu `Q…` không sửa hay xóa được từ giao diện.
>   - Claude Code thêm vào menu hai mục "Xếp hạng" và "Đánh giá", đưa `seo/xep-hang` vào `kiem-dot1-quyen.mjs` (đạt 16/16 với quản trị), và nới cột tên cấu hình.
>   - So cấu hình VPS (0,72) với cấu hình tốt nhất (0,87): B hơn 48 câu, A hơn 21 câu, bằng nhau 31 câu.
> - **Gợi ý liên kết theo ngữ nghĩa** (`tools/rag-may-tram/nhung_trang_seo.py` + `src/lib/seo/goi-y-ngu-nghia.ts` + `scripts/seo-goi-y-ngu-nghia.ts`):
>   - nhúng bge-m3 `title + H1 + 500 ký tự đầu của <main>` (đọc trang đang chạy, không theo chuyển hướng); trang chưa dựng thì dùng meta description. Lần đầu: 129 trang, 7 trang có nội dung thật, 122 trang dùng meta;
>   - mỗi trang lấy 10 trang gần nhất, cosine ≥ 0,65 `[GIẢ ĐỊNH]` (0,6 ra 879 gợi ý, 0,65 ra 459, 0,7 ra 125), cộng 0,05 nếu cùng mảng, bỏ trang đích noindex và cặp đã có liên kết từ nguồn khác; cặp đã bỏ qua vẫn giữ chỗ nên không quay lại. Chạy lại không sinh thêm (459 → 0);
>   - gợi ý là `SeoLienKet` nguon `NGU_NGHIA`, `DE_XUAT`, có `doGan`; hiện ở tab "Gợi ý" của `/quan-tri/seo/lien-ket`. Khi trang v2 có nội dung thật thì chạy lại `nhung_trang_seo.py`.
> - **Tìm lai RAG** (`src/lib/rag/tim-lai.ts`):
>   - bảng thuật ngữ `docs/v2/thuat-ngu.csv` (336 dòng: sao, cung, can chi, ngũ hành, bát tự, 64 quẻ và hào, chọn ngày, phong thủy) nạp vào `thuat_ngu` bằng `scripts/rag-nap-thuat-ngu.ts`. Em soạn bảng **trước** khi xem bộ câu hỏi, để kết quả đo không bị lộ đề;
>   - mở rộng: khớp cụm dài trước, một cụm có thể ra nhiều chữ Hán (thân → 申, 身), "hào 3" → 九三/六三; quẻ một âm tiết (Khiêm, Cách) chỉ mở rộng khi câu có chữ quẻ/hào/dịch/bói;
>   - nhánh từ khóa: BM25 trên **chuỗi con** của `vanBanChuan` (đã chuyển giản → phồn ở bước làm sạch), vì trên CSDL `ctype C` cả `tsvector` lẫn `pg_trgm` đều không tách được chữ Hán. Khoảng 100–370 ms/câu trên 32.061 đoạn;
>   - nhánh vector (pgvector HNSW, cần vector câu hỏi bge-m3) và gộp RRF k = 60. Trên VPS hiện chỉ chạy nhánh từ khóa (17 mục 9 câu 3, phương án c).
> - **Đánh giá RAG** (`scripts/rag-danh-gia.ts`, báo cáo `docs/v2/bao-cao-danh-gia-rag.md`, lưu `rag_danh_gia` 14 dòng):
>   - bộ chuẩn `docs/v2/rag-cau-hoi-chuan.csv`: 100 câu tiếng Việt (tử vi 45, Kinh Dịch 25, bát tự 15, chọn ngày 7, phong thủy 5, ngũ hành 3), 530 đoạn đúng. Đáp án gắn bằng tra chữ rồi đọc văn bản, **không** dùng vector, để không thiên về mô hình nào. Nạp vào `rag_cau_hoi_chuan` (id = mã câu);
>   - kết quả hit@10 (câu có ít nhất một đoạn đúng trong top 10): từ khóa + mở rộng 31 %; bge-m3 35 % → **58 %** khi mở rộng thuật ngữ; **Qwen3-Embedding-0.6B + mở rộng 70 %** (recall@10 39,7 %, MRR 0,456, đúng nguồn 63 %); AITeamVN 26 % → 55 %;
>   - so từng câu: mở rộng thuật ngữ cứu 25 câu, làm hỏng 2; Qwen3 hơn bge-m3 17 câu, kém 5 câu (kiểm dấu, p ≈ 0,02); gộp RRF với từ khóa không hơn vector + mở rộng (10 câu kém, 4 câu hơn, chưa có ý nghĩa thống kê). AITeamVN tinh chỉnh cho tiếng Việt nhưng yếu với chữ Hán, đúng như 12 mục 5.3 đoán;
>   - hệ quả: (1) mở rộng thuật ngữ là bước lợi nhất, đã có trong mã; (2) **chỉ tìm theo từ khóa trên VPS (phương án c đang duyệt) chỉ đạt 31 %**, kém xa 70 %; (3) đề xuất đổi mô hình nhúng sang Qwen3-0.6B (cùng 1024 chiều, không đổi schema; nhúng lại 32.033 đoạn mất khoảng 6 phút). Hai việc này cần anh quyết, xem `viec-can-anh.md`;
>   - giới hạn: 100 câu nên chênh dưới khoảng 10 điểm chưa đáng tin; nhãn độ khó là phán đoán; một số câu Chu Dịch có thể thiếu vài đoạn chú ở bản khác; nhóm ngũ hành chỉ 3 câu, chưa có câu phong tục (WS24 chỉ có tiêu đề). 30 câu Qwen3 còn trượt (danh sách trong `rag_danh_gia.chiTiet`) là chỗ để cải thiện bảng thuật ngữ và cách cắt đoạn.
> - **Viết lại câu hỏi bằng LLM** (anh chỉ đạo 22/11: dùng DeepSeek V4.1 Flash hoặc Qwen của cụm máy nhà qua 9router, tiền tố `gx/`; 9router không có model embedding nào): `src/lib/rag/viet-lai-cau.ts`. LLM đọc câu tiếng Việt, trả thuật ngữ chữ Hán phồn thể và một câu văn ngôn mẫu; hai ví dụ mẫu trong lời nhắc chọn chủ đề không có trong bộ chuẩn. Thuật ngữ và cặp chữ của câu mẫu được thêm vào nhánh từ khóa (`timLai({ vietLai })`). Đo lại 100 câu:
>   - từ khóa + bảng thuật ngữ + `gx/qwen3.6-35b-nvfp4` + câu mẫu: **hit@10 80 %**, recall@10 51,2 %, MRR 0,585, đúng nguồn 73 %, 2,9 giây/câu, 100/100 câu viết lại được;
>   - cùng cách với `gx/deepseek-ai/DeepSeek-V4.1-Flash-1017`: 81 %, nhưng 11,8 giây/câu và hỏng 4/100; `gx/qwen3.8-flash-next`: 72 %, 3,5 giây;
>   - so từng câu: Qwen3.6 viết lại hơn chỉ bảng thuật ngữ 49 câu, kém 0; câu mẫu giúp thêm 10 câu, làm hỏng 2; Qwen3.6 với DeepSeek ngang nhau (8/9); hơn vector Qwen3-0.6B + mở rộng 20 câu, kém 10;
>   - tham khảo (cần GPU): vector Qwen3-0.6B nhúng câu hỏi đã viết lại bằng DeepSeek đạt 87 %.
>
>   **Quyết định cho VPS:** chạy từ khóa + bảng thuật ngữ + viết lại bằng `gx/qwen3.6-35b-nvfp4` (mặc định `MO_HINH_VIET_LAI`), không cần nhúng trên VPS. Quá giờ hoặc cụm máy nhà tắt thì lùi về bảng thuật ngữ (31 %). Đổi mô hình nhúng sang Qwen3-0.6B không còn chặn việc chạy thật; để làm khi cần nhánh vector.
> - **Trang `/quan-tri/rag/thu`** (Claude Code sửa 22/11): mặc định **Tìm lai** (bảng thuật ngữ + viết lại bằng `gx/qwen3.6-35b-nvfp4` + BM25), hiện từng bước mở rộng (cụm khớp bảng thuật ngữ, thuật ngữ LLM thêm, câu mẫu, danh sách từ khóa) và điểm BM25; có thể tắt LLM hoặc chọn **Tìm cũ** (toàn văn + trigram) để so. Phạm vi vẫn theo `nguCanhTruyVan`, đoạn được đọc lại với cùng điều kiện phạm vi; vẫn ghi `rag_truy_van_log`. Kiểm bằng HTTP: quản trị 3 chế độ đều 200, chuyên gia bị ép phạm vi công khai, tài khoản xem số liệu bị chặn.
> - **Trợ lý công khai dùng kho RAG mới (cờ `RAG_V2=1`)**, Claude Code làm 22/11:
>   - Tệp mới `src/lib/rag/tim-cong-khai.ts`, hàm `timCongKhai`. Hàm dùng cùng cấu hình đang chạy trên VPS: bảng thuật ngữ, viết lại câu hỏi bằng `gx/qwen3.6`, rồi BM25. Thời gian chờ LLM 6 giây, thử 1 lần.
>   - Chỉ đọc qua view `rag_doan_cong_khai` và `rag_nguon_cong_khai`. `timTuKhoa`, `timVector` và `timLai` có thêm tùy chọn `congKhai` để đọc view thay cho bảng gốc, vì vai trò `xemboi_web` không có quyền đọc `rag_doan`.
>   - Nguồn chưa cho trích dài thì chỉ đưa cho LLM 400 chữ, nguồn khác 900 chữ. Mỗi lần tìm ghi `rag_truy_van_log`, ngữ cảnh `CONG_KHAI`.
>   - `streamChatResponse` (`rag-engine.ts`) dùng cho `/api/chat/stream`, `/api/hoi-thay` và `/api/chat/council`:
>     - khi bật cờ, lấy 3 đoạn và thêm dặn LLM "diễn giải nguyên văn chữ Hán, nêu tên sách, không bịa";
>     - không có kết quả hoặc lỗi thì quay về kho cũ.
>   - Phần soạn sẵn của hội đồng (`council-orchestrator`, `dialogue-simulation`) vẫn dùng kho cũ, vì đoạn ở đó được chèn thẳng vào câu tiếng Việt.
>   - Chạy thật trên 3 câu, mỗi câu 1,2–2,6 giây, đều ra đúng sách. Ví dụ "hào sáu ba quẻ Khôn" ra 3 bản 含章可貞 trong Đông Pha, Chu Dịch chú sớ và Trình truyện.
>   - Test `tests/dot3/rag-cong-khai.test.mjs`, 2/2 đạt: đoạn `NOI_BO` chứa từ khóa thấy được ở bảng gốc nhưng không lọt qua đường công khai.
>   - **Chưa làm:** ghi nguồn trích ra giao diện chat. Hiện `citedSources` trả tên sách nhưng giao diện chưa hiện. Việc này giao Antigravity sau.
> - **Phần lõi còn lại của Lệnh 22**, Claude Code làm 22/11:
>   - `/api/admin/conversations` và `/simulate`:
>     - chỉ nhận phiên tài khoản có quyền `hoi_thoai.xem` (`kiemQuyenApi`), bỏ nhánh `ADMIN_KEY`;
>     - bốn thao tác POST đều ghi `NhatKyThaoTac`: `hoi_thoai.tiep_quan`, `.gui_tin`, `.trieu_tap`, `.hoi_dong`. Nhật ký `.gui_tin` chỉ lưu độ dài tin nhắn, không lưu nội dung;
>     - đã kiểm bằng HTTP: quản trị nhận 200 và nhật ký có trước/sau đúng; biên tập nhận 403; không có phiên hoặc chỉ có `ADMIN_KEY` thì nhận 401.
>   - Gỡ dữ liệu giả:
>     - `customer-service.ts` không còn gieo 2 khách mẫu có số điện thoại và email bịa;
>     - `tracker-server.ts`: khi CSDL lỗi thì trả số thật trong bộ nhớ kèm `loi`, không còn `Math.max(12/145/…)` hay `44.4%`; số người online không bị ép tối thiểu 1.
>   - Đã đưa few-shot vào CSDL và seed `AiAgent`, không cần migration:
>     - Mẫu few-shot lưu ở `CaiDat` khóa `AI_FEW_SHOT` (`src/lib/ai/few-shot.ts`). `few-shot-dialogues.json` chỉ còn là bản mặc định.
>     - `scripts/seed-ai-agent.ts` (có `--thu`) chỉ tạo các trợ lý còn thiếu; máy trạm đã nạp 9 trợ lý và 8 mẫu. Chạy lại không tạo thêm.
>     - `getAgentBySlug` ghép bản sửa trong bảng `AiAgent` lên bản mặc định; trợ lý bị tắt thì dùng mặc định. Chat làm mới mỗi 5 phút, và làm mới ngay sau khi sửa ở `/quan-tri/ai/tro-ly`.
>     - `/api/admin/agents` được viết lại:
>       - chỉ nhận phiên có quyền `ai.tro_ly`, không nhận `ADMIN_KEY`;
>       - không ghi tệp mã nguồn nữa, không bịa số hội thoại;
>       - mọi thao tác ghi nhật ký `ai.cau_hinh_llm`, `ai.few_shot`, `ai.sua_tro_ly`; prompt chỉ lưu độ dài và mã băm;
>       - `UPDATE_LLM_CONFIG` chỉ nhận nhà cung cấp hợp lệ và không xóa cấu hình bằng giá trị rỗng.
>     - Test `tests/dot3/tro-ly-csdl.test.mjs` đạt 2/2. HTTP: không có phiên thì 401, quản trị 200, biên tập 403.
>     - **Khi triển khai:** chạy `scripts/seed-ai-agent.ts --thu` rồi chạy thật trên VPS.
> - **Chưa làm:** map nginx cho xemtuvi.vn (cần danh sách URL); trợ lý công khai dùng tìm lai (cờ `RAG_V2`).

### Đợt 4: OCR, phiên âm, giấy phép, cứng hóa (55–80 giờ)

- **Phạm vi:**
  - bước 2b OCR (bản quét A: AR01–AR32…), 2c phiên âm MP3;
  - ảnh trang trong trình duyệt đoạn; lấy mẫu soát 5 %;
  - gắn nhãn hàng loạt + gắn máy theo `ThuatNgu`;
  - `GpMaNgoai`, `GpMaNgoaiSuDung`, `GpXinPhep`, cổng kiểm mở tên miền + script cho bước triển khai, nhắc T−30/14/7;
  - mã hai lớp cho quản trị; thử khôi phục sao lưu hằng tháng;
  - (tùy RAM) tách tiến trình `web`/`quantri`.
- **Nghiệm thu:**
  - 1 sách quét được OCR, soát 5 %, đo tỷ lệ ký tự sai trên mẫu;
  - cổng kiểm chặn đúng khi thêm giả một dòng "mã cần xin phép chạy trên web".
- **Rủi ro:** chất lượng OCR chữ Hán dọc và chữ Nôm (12 đã cảnh báo); quyền của bài giảng MP3; dung lượng ổ VPS khi thêm ảnh trang (chỉ đưa ảnh nhỏ, có thể để trên máy trạm và tải khi cần).

### 8.5. Chi phí và phương án thay thế

| Hạng mục | Mặc định (miễn phí) | Tùy chọn trả phí | Giá |
|:--|:--|:--|:--|
| Xếp hạng | Search Console API, Bing Webmaster Tools | Ahrefs API | Theo trợ giúp Ahrefs: có từ gói Lite, giới hạn API units; giá **chưa kiểm** ([pricing](https://ahrefs.com/pricing)) |
| Embedding | bge-m3 chạy trên máy trạm | API embedding | Chưa tra; và **không** dùng được cho nguồn C (12 mục 5.3) |
| Nhúng câu hỏi lúc chạy | Xem mục 9 | Nâng VPS RAM | 04 chỉ có giá gói 2 GB ($12/tháng ≈ 312.000 đ); giá gói lớn hơn **chưa kiểm** |
| LLM AI soạn | Lớp `llm-provider.ts` đang có | Theo nhà cung cấp anh chọn | Chưa tra trong phiên này; ghi số token để tính |
| Sao lưu ngoài | Máy trạm + ổ cứng ngoài | Lưu trữ đám mây | Chưa tra |
| OCR, phiên âm | PaddleOCR, Whisper trên máy trạm | — | — |
| Hàng đợi | Bảng Postgres | — | — |

---

## 9. Việc cần anh Cường quyết

> **22/11/2026:** anh đã trả lời. Câu 1 xong ở Đợt 0; câu 2–8, 12, 13 theo mặc định em đề xuất; câu 10 (xemtuvi.vn) và câu 9 (ngày mở tên miền) còn chờ. Chi tiết: `16-quyet-dinh-anh.md` mục 11–16 và `viec-can-anh.md`.

1. **Cho làm Đợt 0 ngay không?** Hiện ai cũng đọc được danh sách khách hàng qua `/api/admin/customers` và đổi được cấu hình LLM qua `/api/admin/agents`.
2. **Xác nhận máy trạm:** có GPU không, loại gì, bao nhiêu VRAM; máy bật khoảng mấy giờ mỗi ngày. Toàn bộ pipeline OCR và embedding dựa trên giả định này.
3. **Nhúng câu hỏi lúc chạy thật** (khi chat công khai hoặc trang dùng RAG). Bốn lựa chọn:
   - (a) nâng RAM VPS;
   - (b) thử bge-m3 lượng tử hóa ONNX trên VPS hiện tại `[CHƯA KIỂM có chạy nổi không]`;
   - (c) chỉ tìm theo từ khóa và thuật ngữ cho tới khi đủ tiền;
   - (d) dùng API ngoài chỉ để nhúng câu hỏi (câu hỏi của khách không phải văn bản nguồn C, nhưng là dữ liệu khách).

   Em đề xuất (c) cho đợt 1–2, rồi đo (b).
4. **Chuyên gia duyệt là cộng tác viên ngoài có được đọc đoạn nguồn C không**, với điều kiện ký thỏa thuận bảo mật?
5. **Trang công khai có được ghi tên sách C ở dạng "tham khảo"** (không trích chữ nào) không? Mặc định: không.
6. **Văn bản nguồn C có được lưu trên VPS không**, hay chỉ trên máy trạm? Nếu chỉ máy trạm, cần thêm một Postgres cục bộ cho tra cứu nội bộ; công sức Đợt 1 tăng khoảng 10–15 giờ `[ƯỚC LƯỢNG]`.
7. **Tài liệu RAG cũ chuyển sang thành `NOI_BO`.** Như vậy chat công khai mất các tài liệu này cho tới khi được xếp loại lại. Anh đồng ý không?
8. **Tách tiến trình quản trị sang `quantri.xemboi.vn`** (an toàn hơn, tốn RAM) hay giữ một tiến trình (Đợt 1–3)?
9. **Ngày dự kiến mở tên miền chính** để đặt nhắc giấy phép.
10. **Danh sách URL xemtuvi.vn:** anh có quyền vào Search Console của xemtuvi.vn, hoặc có sitemap của site đó không?
11. **Ai được tạo tài khoản ngay ở Đợt 1:** tên và vai trò từng người. Hồ sơ tác giả dùng tên thật hay bút danh (07 mục 3.4).
12. **Đổi `prisma db push` sang `prisma migrate`.** Bắt buộc với thiết kế này; cần anh đồng ý vì đổi cách triển khai đang ghi ở 06.
13. **Bật Ahrefs?** Mặc định không. Nếu có, anh tra giá gói Lite và hạn mức API units hiện hành.

# Giai đoạn 1: Kiểm kê hiện trạng hệ thống `xemboi.vn`

> Ngày kiểm kê: 20/11/2026 · Nhánh kiểm kê: `lam-lai-v2` (phân nhánh từ `main` commit `0ae2de8`, giữ nguyên toàn bộ mã cũ).
> Nguyên tắc báo cáo: Chỉ ghi nhận những gì quan sát trực tiếp trong mã nguồn và kiểm tra cổng dịch vụ cục bộ; phân biệt rõ chạy thật, fallback/giả lập, mã tự viết và mã sao chép.

---

## 1. Tóm tắt bức tranh hiện trạng

Hiện tại `xemboi.vn` **chưa thể vận hành thương mại** vì 3 lý do kỹ thuật – pháp lý cốt lõi:
1. **Lỗi bản quyền trực diện:** Giao diện trang chủ (`src/lib/home-template.ts`, `src/app/globals.css`), 7 tệp JS trình duyệt (`public/*.js`) và 6 tệp engine (`src/lib/core/*-raw.js`) là bản sao từ `chotuvi.com` (chỉ đổi tên thương hiệu sang "XemBoi.vn" và "Danh Sư").
2. **Hạ tầng & thanh toán đang ở trạng thái giả lập/offline:** PostgreSQL (cổng 5432) và Redis (cổng 6379) không chạy cục bộ; `.env` không cấu hình bất kỳ khóa LLM nào (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `DEEPSEEK_API_KEY` đều vắng mặt); API tạo đơn và kiểm tra đơn (`/api/tao-don`, `/api/don`) trả cứng `trangThai: 'PAID', soTien: 0` mà không ghi DB hay đối soát SePay.
3. **Tính năng AI & RAG phần lớn là kịch bản tĩnh (template/heuristic):** "Vector 1536 chiều" trong `rag-engine.ts` thực chất là hàm băm chuỗi giả lập (`generateVectorEmbedding`); 8 Danh Sư (`council-orchestrator.ts`) chạy theo kịch bản ghép chuỗi `if/else` định sẵn thay vì gọi LLM thật.

---

## 2. Bảng kiểm kê: Chạy thật vs. Giả lập / Fallback & Nguồn gốc mã

| Hạng mục / Tệp chính | Chạy thật hay Giả lập / Fallback? | Nguồn gốc mã | Hành động đề xuất cho v2 |
| :--- | :--- | :--- | :--- |
| **Trang chủ & Giao diện**<br>`src/app/page.tsx`, `src/lib/home-template.ts` (49,9 KB), `src/app/globals.css` (51,4 KB), `public/app-main.js` (150,3 KB) | **Chạy thật (client-side)** nhưng dùng `dangerouslySetInnerHTML` ghép nguyên HTML + nạp 7 file JS ngoài React. | **Sao chép từ `chotuvi.com`** (kể cả SVG thầy bói, 12 con giáp, tab, class CSS, tên biến). | **Xóa khỏi v2, thiết kế lại từ đầu** bằng React/Tailwind với bộ nhận diện riêng. |
| **Đổi lịch Âm – Dương & Lịch Vạn Niên**<br>`src/lib/core/lich-raw.js` (30,4 KB), `public/lich.js`, `src/lib/core/lich.ts` | **Chạy thật.** Tính toán thuần JS trên cả browser và Node. | Thuật toán thiên văn công khai của **Hồ Ngọc Đức** (dựa trên Jean Meeus), nhưng **file JS bị chép nguyên từ `chotuvi.com`** (cùng cấu trúc hàm `duongSangAm`, `danhGiaNgay`, `xemHop`...). | **Viết lại sạch bằng TypeScript** từ thuật toán công khai Hồ Ngọc Đức + bộ test chuẩn hóa. |
| **An sao Tử Vi**<br>`src/lib/core/tuvi-raw.js` (20,0 KB), `public/tuvi.js`, `src/lib/core/tuvi.ts` | **Chạy thật.** Trả về 12 cung, 14 chính tinh, phụ tinh, Tuần/Triệt, Đại/Tiểu hạn. Phần Lưu Niên trong `tuvi.ts` là mã mới viết thêm. | `tuvi-raw.js` có header ghi chuyển thể từ `TuViMCP` (Apache-2.0, tác giả Manh Ha Nguyen) nhưng **bản thân file JS bị chép từ `chotuvi.com`**. | **Viết lại sạch bằng TypeScript** có ghi rõ nguồn thuật toán/quy tắc an sao (xem mục 3). |
| **Kho văn bình giải miễn phí & Tử vi trọn đời / hôm nay**<br>`thayba-raw.js` (34,1 KB), `thuvien-raw.js` (65,6 KB), `trondoi-raw.js` (29,4 KB), `homnay-raw.js` (13,6 KB) + bản sao trong `public/` | **Chạy thật** (ghép chuỗi từ điển, không gọi AI). | **Sao chép văn bản & cấu trúc từ `chotuvi.com`** (chỉ sửa chữ "chotuvi" → "XemBoi.vn"). Rủi ro bản quyền nội dung rất cao. | **Bỏ hoàn toàn.** Tự biên soạn kho luận giải mới hoặc kết hợp LLM có kiểm soát. |
| **Tứ Trụ & Bói Dịch**<br>`src/lib/core/tutru-boidich.ts`, `src/app/tu-tru/page.tsx`, `src/app/boi-dich/page.tsx` | **Chạy thật ở mức sơ khai** (nhưng Tứ Trụ tính tháng theo tháng âm lịch thay vì Tiết Khí — sai nguyên lý Bát Tự). | **Mã tự viết**, phụ thuộc `lich-raw.js`. | **Cắt khỏi MVP v2** nếu nghiên cứu thị trường/khách hàng không ưu tiên; nếu làm sau phải sửa tính theo Tiết Khí. |
| **Thanh toán VietQR / SePay**<br>`/api/tao-don`, `/api/don`, `/api/ngan-hang`, `/api/cau-hinh` | **100% GIẢ LẬP.** `/api/tao-don` trả luôn `trangThai: 'PAID', soTien: 0`; `/api/don` luôn trả `daThanhToan: true`; `/api/ngan-hang` hardcode STK `8886866789` VPBank, giá `199000`. Không có webhook SePay thật. | **Mã tự viết (stub demo)**, mượn tên endpoint tiếng Việt từ `chotuvi.com`. | **Xây lại thật** với bảng đơn hàng PostgreSQL, webhook xác thực `SEPAY_API_KEY`, chống trùng giao dịch. |
| **AI LLM Provider**<br>`src/lib/ai/llm-provider.ts` | **Đang rơi vào Fallback offline.** Code có hỗ trợ gọi REST API Gemini/OpenAI/DeepSeek, nhưng `.env` không có API key nên luôn trả `provider: 'offline'`. Không có "Gemini 4 Argon" nào trong code (mặc định là `gemini-1.5-flash`). | **Mã tự viết.** | **Rút gọn lại sạch**, chọn 1–2 model thực tế (VD: Gemini 2.5 Flash / GPT-4o-mini) có theo dõi chi phí token. |
| **Hệ thống RAG & "Vector 1536 chiều"**<br>`src/lib/ai/rag-engine.ts`, `seeded-knowledge*.json` | **GIẢ LẬP vector + Fallback RAM.** Hàm `generateVectorEmbedding()` dùng phép băm nhân 31 + LCG để tạo mảng 1536 số, **không có giá trị ngữ nghĩa**. Khi Postgres tắt (hiện tại tắt), hệ thống fallback sang đếm từ khóa trên 2 file JSON trong RAM. | **Mã tự viết.** | **Bỏ pseudo-vector.** Với quy mô nhỏ/MVP, dùng cấu trúc tri thức JSON/SQL có chỉ mục theo Sao–Cung–Cách Cục sẽ chính xác và rẻ hơn nhiều. |
| **Hội đồng 8 Danh Sư**<br>`src/lib/ai/council-orchestrator.ts` (72 KB), `dialogue-simulation.ts` (142 KB), `CouncilChatEmbed.tsx` (46 KB) | **Chủ yếu là kịch bản ghép chuỗi (template heuristic)** dài ~214 KB; giả lập độ trễ 2,5 giây giữa các lượt để tạo cảm giác AI đang tranh luận. | **Mã tự viết.** | **Đánh giá lại ở Giai đoạn 3–5:** Khả năng cao cắt bỏ 8 Danh Sư, chỉ giữ 1 giọng luận nhất quán nếu khách không có nhu cầu "xem 8 thầy cãi nhau". |
| **Giọng đọc AI (TTS)**<br>`src/app/api/tts/route.ts`, `useCouncilAudioEngine.ts`, `public/audio/cache/` | **Chạy thật (phụ thuộc dịch vụ không chính thức).** Dùng `msedge-tts` (endpoint không chính thức của Microsoft Edge) và fallback Google Translate TTS; lưu cache MP3 ra đĩa cục bộ `public/audio/cache/` (dễ lỗi trên serverless/production). | **Mã tự viết.** | **Cắt khỏi MVP v2** để giảm độ phức tạp; chỉ làm lại bằng API thương mại nếu có dữ liệu khách cần nghe. |
| **CRM, Tracking, Admin Dashboard**<br>`src/app/admin/*`, `customer-service.ts`, `tracker-server.ts`, `/api/quan-tri` | **Chủ yếu Fallback RAM + số liệu cứng.** Khi Postgres/Redis tắt, CRM nạp sẵn 2 khách mẫu giả (`Nguyễn Văn An`, `Trần Thị Bích`); `/api/quan-tri` trả cứng `chartsGenerated: 12840`. Không có cơ chế đăng nhập/phân quyền chặt cho `/admin`. | **Mã tự viết.** | **Bỏ toàn bộ hệ thống tracking/CRM tự chế cồng kềnh.** Dùng GA4 + bảng đơn hàng/khách hàng tối giản trong DB có bảo vệ auth. |
| **Kiểm thử đối chiếu**<br>`scripts/cross-verify.mjs` | **Chỉ có 3 test case** và đối chiếu trực tiếp với `chotuvi.com` (dùng chính file chép của họ để so với họ → đương nhiên trùng). | **Mã tự viết.** | **Bỏ đối chiếu với `chotuvi.com`.** Viết unit test đối chiếu với sách chuẩn & lịch thiên văn công khai. |

---

## 3. Đánh giá kỹ thuật Engine An Sao hiện tại (`lich-raw.js` & `tuvi-raw.js`)

> Lưu ý: Dù logic toán học có thể tham khảo để kiểm chứng, **toàn bộ mã nguồn v2 phải được viết lại sạch từ đầu** bằng TypeScript, không tái sử dụng trực tiếp 2 tệp `*-raw.js`.

### 3.1. Các phần thuật toán đúng về mặt học thuật — có thể giữ nguyên tắc khi viết lại sạch
1. **Đổi lịch Dương ↔ Âm (Hồ Ngọc Đức, UTC+7):** Công thức Julian Day, Sóc (New Moon), Trung Khí (Sun Longitude), xác định tháng 11 Âm lịch và tháng Nhuận là chuẩn công khai, độ chính xác cao trong giai đoạn 1900–2100.
2. **An 14 Chính Tinh:** Công thức tìm cung Tử Vi theo Cục (2–6) và ngày sinh âm lịch, cùng vòng Tử Vi (nghịch) và vòng Thiên Phủ (thuận đối xứng qua trục Dần–Thân) khớp chuẩn Tử Vi Đẩu Số cổ truyền.
3. **An Mệnh, Thân, 12 Cung chức năng, Ngũ Hổ Độn (Can cung), Cục (theo Nạp Âm cung Mệnh):** Đúng quy tắc phổ thông.
4. **Các vòng phụ tinh cơ bản:** Vòng Lộc Tồn – Bác Sỹ (thuận/nghịch theo Âm Dương Nam Nữ), Vòng Thái Tuế (12 sao), Vòng Tràng Sinh (theo Cục), Lục Sát tinh, Xương Khúc, Tả Hữu, Khôi Việt, Đào Hồng, Cô Quả, Tuần, Triệt, Đại Hạn (10 năm) và Tiểu Hạn.
5. **Sao Lưu Niên (trong `tuvi.ts`):** Đã tách riêng hàm `anSaoLuuNien` cho 9 sao lưu cơ bản (Lưu Thái Tuế, Tang Môn, Bạch Hổ, Khốc, Hư, Lộc Tồn, Kình, Đà, Thiên Mã).

### 3.2. Các điểm sai sót / hạn chế / tranh cãi học thuật cần xử lý khi viết lại v2

| Vấn đề phát hiện trong `tuvi-raw.js` / `tuvi.ts` | Ảnh hưởng thực tế | Hướng xử lý cho v2 |
| :--- | :--- | :--- |
| **1. Giờ Tý muộn (23h00 – 23h59) không rõ quy ước sang ngày mới** | Trong `tuvi-raw.js`, giờ 23h trả về `chiGio = 0` (Tý) nhưng **không tăng ngày âm lịch sang ngày hôm sau** (`am.ngay` giữ nguyên ngày cũ). Trong Tử Vi VN có 2 trường phái (Tý sớm/Tý muộn đổi ngày hay giữ ngày), nếu không thông báo rõ sẽ bị khách thắc mắc "sao khác lá số thầy xem". | Quy ước rõ 1 chuẩn phổ biến nhất tại VN (23h–24h tính sang ngày hôm sau cho Dạ Tý, hoặc có tùy chọn rõ trên UI + giải thích minh bạch). |
| **2. Tháng Nhuận xử lý đơn giản (an thẳng như tháng chính)** | Dòng 109 `tuvi-raw.js`: `// tháng nhuận an như tháng chính`. Thực tế Nam Phái VN có cách chia nửa đầu tháng nhuận theo tháng trước, nửa sau (từ ngày 16) tính sang tháng sau. | Ghi rõ quy tắc áp dụng (minh bạch phương pháp) và hỗ trợ tùy chọn nếu cần. |
| **3. Trộn quy tắc Tứ Hóa & Hỏa/Linh theo một phái duy nhất không ghi chú** | `TU_HOA` dùng Can Canh = Nhật–Vũ–Đồng–Âm, Can Nhâm = Lương–Tử–Phủ–Vũ, Can Quý = Phá–Cự–Âm–Tham (thiên về Nam Phái/Thiên Lương). Trong khi `page.tsx` khai báo `phaiTuHoa: 'nam_phai'` nhưng engine không hề đọc biến này. | Khóa cứng 1 hệ quy chiếu học thuật thống nhất (VD: Tử Vi Nam Phái chuẩn phổ thông VN) và **công bố rõ trên trang kết quả** để tạo niềm tin. |
| **4. Lỗi công thức chiều Đại Hạn ở dòng 207 `tuvi-raw.js` (cần kiểm chứng kỹ)** | Dòng 115 dùng `huong = gt * amDuongNam` (theo **Can năm**, đúng chuẩn Tử Vi), nhưng dòng 207 lại viết `var huongDH = gt * amDuongChi` (theo **Chi năm**). Vì Can và Chi của 1 năm luôn cùng tính Âm/Dương (Giáp Tý đều Dương, Ất Sửu đều Âm) nên kết quả tình cờ giống nhau, nhưng viết bằng `amDuongChi` là sai về mặt khái niệm và dễ gây lỗi nếu tái sử dụng. | Khi viết lại v2, dùng thống nhất 1 hàm `isThuan(canNam, gioiTinh)` dựa trên Can năm + Giới tính. |
| **5. Tứ Trụ (`tutru-boidich.ts`) tính Trụ Tháng theo tháng Âm lịch** | Dòng 106 dùng `Lich.canChiThang(am.thang, am.nam)`. Nguyên lý Bát Tự bắt buộc tính năm theo **Lập Xuân** và tính tháng theo **12 Tiết Khí** (Lập Xuân, Kinh Trập, Thanh Minh...), không tính theo mùng 1 âm lịch. | Bỏ Tứ Trụ khỏi MVP v2 để tránh luận sai cho người sinh đầu năm / giao tiết. |
| **6. Thiếu kiểm thử đơn vị (Unit Tests) độc lập** | Chưa có bộ test đối chiếu với lịch âm chính thống (Lịch Vạn Niên Nhà nước / bảng đối chiếu Hồ Ngọc Đức) và các lá số mẫu kinh điển. | Xây bộ test tự động (Vitest) gồm ít nhất 20–30 mốc ngày (ngày thường, tháng nhuận, giao thừa, 23h đêm, 1900–2050) đối chiếu nguồn công khai. |

---

## 4. Kết luận Giai đoạn 1: Những gì giữ lại vs. Bỏ đi

- **Giữ lại (chỉ giữ ý tưởng/cấu trúc tham khảo, viết sạch lại code):**
  - Tên miền `xemboi.vn` và định hướng Next.js + TypeScript + PostgreSQL.
  - Phần schema DB hợp lý (rút gọn chỉ giữ bảng `HoroscopeChart`, `ConsultationOrder`, `CustomerProfile` tối giản, bỏ các bảng `AiAgent`, `AgentKnowledgeChunk` vector giả nếu không dùng).
  - Quy tắc toán học công khai của thuật toán âm lịch Hồ Ngọc Đức và quy tắc an sao Nam Phái (viết mới 100% bằng TypeScript + test).
- **Bỏ hoàn toàn khỏi nhánh sản phẩm v2:**
  - Toàn bộ 6 file `*-raw.js`, 7 file `public/*.js`, `src/lib/home-template.ts`, `src/app/globals.css` sao chép từ `chotuvi.com`.
  - Toàn bộ kho văn bình giải sao chép (`thuvien-raw.js`, `thayba-raw.js`, `trondoi-raw.js`, `homnay-raw.js`).
  - Các tính năng giả lập/chưa có nhu cầu chứng minh: pseudo-vector RAG 1536 chiều, hệ thống 8 Danh Sư tự thoại, TTS `msedge-tts` lưu đĩa cục bộ, Tứ Trụ/Bói Dịch sơ khai, CRM/Admin có dữ liệu mẫu giả.

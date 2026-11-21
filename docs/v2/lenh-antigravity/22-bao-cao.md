# Báo cáo Lệnh 22: Gộp khu `/admin` cũ vào `/quan-tri` (Đợt 2)

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp

### Tệp tạo mới
- `src/app/quan-tri/(khu)/so-lieu/page.tsx` — Trang `/quan-tri/so-lieu` (quyền `so_lieu.xem`): server component gọi trực tiếp `getAnalyticsSummary()` (`src/lib/tracking/tracker-server.ts`) và `prisma.visitorSession.groupBy`, hiển thị 6 ô `qt-so` (đang online, phiên hôm nay/tổng, lượt xem hôm nay/tổng, lá số đã lập, mở chat, tỷ lệ chuyển đổi), phễu tương tác, phân bổ thiết bị và bảng 20 sự kiện gần nhất với `visitorId` chỉ hiện 6 ký tự đầu.
- `src/app/quan-tri/(khu)/khach-hang/hanh-dong.ts` — Server action `suaKhachHang` (quyền `khach_hang.xem` ngay dòng đầu): không dùng `updateCustomer`, dùng `prisma.$transaction` đọc bản trước, cập nhật chỉ `tags`, `adminNotes`, `leadScore` (kẹp trong `0–100`), và gọi `ghiNhatKy(tx, nd, 'khach_hang.sua', 'CustomerProfile', id, truoc, sau)`.
- `src/app/quan-tri/(khu)/khach-hang/page.tsx` — Trang `/quan-tri/khach-hang` (quyền `khach_hang.xem`): gọi `listCustomers({ page, limit: 50, search, tag })`, lọc GET, phân trang và che bớt số điện thoại (`09******12`) cùng email (`ng***@gmail.com`).
- `src/app/quan-tri/(khu)/khach-hang/[id]/page.tsx` — Trang `/quan-tri/khach-hang/[id]` (quyền `khach_hang.xem`): gọi `getCustomerDetail(id)`, hiển thị đầy đủ thông tin liên hệ, bản mệnh, lá số, phiên, hội thoại, biểu mẫu gọi `suaKhachHang`, và ghi nhật ký `khach_hang.xem_chi_tiet` mỗi lần mở trang.
- `src/app/quan-tri/(khu)/hoi-thoai/HienThiTinNhan.tsx` — Thành phần hiển thị markdown, bảng và chủ đề màu từng vị thầy cho hội thoại.
- `src/app/quan-tri/(khu)/hoi-thoai/PhongHoiChan.tsx` — Giao diện quản lý phòng hội thoại và hội chẩn (4 tab `council`, `live`, `takeover`, `all`), gọi `/api/admin/conversations`, dùng `tenQuanTri` (`nd.hoTen`) cho người gửi quản trị và không còn chuỗi `Admin: Cuong`.
- `src/app/quan-tri/(khu)/hoi-thoai/GiaLapToaDam.tsx` — Giao diện tab `Giả lập tọa đàm`, gọi `/api/admin/conversations/simulate`, dùng `tenQuanTri` khi can thiệp và xuất biên bản `.txt`, dọn timer khi unmount.
- `src/app/quan-tri/(khu)/hoi-thoai/HoiThoaiClient.tsx` — Thành phần client bọc 5 tab và điều khiển âm thanh (`useCouncilAudioEngine`), gắn liên kết sang `/quan-tri/ai/tro-ly`.
- `src/app/quan-tri/(khu)/hoi-thoai/page.tsx` — Trang `/quan-tri/hoi-thoai` (quyền `hoi_thoai.xem`): lấy `nd.hoTen` trên server và truyền xuống `HoiThoaiClient`.
- `src/app/quan-tri/(khu)/ai/tro-ly/hanh-dong.ts` — Server action `suaTroLy` (quyền `ai.tro_ly` ngay dòng đầu): cập nhật `name`, `title`, `systemPrompt`, `welcomeMessage`, `suggestedQuestions`, `voiceProvider`, `voiceId`, `voiceSpeed`, `voicePitch`, `isActive` trong `prisma.$transaction`, ghi nhật ký `ai.sua_tro_ly` với `systemPrompt` chỉ lưu `{ doDai, sha256 }`. Không gọi `updateRuntimeLlmConfig`, không nhận API key.
- `src/app/quan-tri/(khu)/ai/tro-ly/page.tsx` — Trang `/quan-tri/ai/tro-ly` (quyền `ai.tro_ly`): bảng trợ lý từ `prisma.aiAgent` kèm số hội thoại và số nguồn RAG, biểu mẫu chỉnh sửa trợ lý đang chọn, liên kết `Mô hình AI` (`/quan-tri/ai/mo-hinh`), liên kết `Nguồn RAG của trợ lý` (`/quan-tri/rag/nguon?q=XB-`), và danh sách few-shot chỉ đọc từ `src/lib/ai/few-shot-dialogues.json` (không có nút thêm, không có ô nhập API key).
- `docs/v2/lenh-antigravity/22-bao-cao.md` — Báo cáo này.

### Tệp chỉnh sửa
- `src/app/quan-tri/quan-tri.css` — Thêm các lớp tiền tố `qt-*` ở cuối tệp cho tiêu đề trang, thanh tab, lưới chi tiết khách hàng, bố cục 2 cột hội thoại, lưới form trợ lý và thẻ mẫu few-shot.

Không sửa các tệp thuộc vùng cấm (`prisma/schema.prisma`, `prisma/migrations/`, `src/lib/quan-tri/`, `src/lib/noi-dung/`, `src/lib/seo/`, `src/lib/rag/`, `src/lib/core/`, `src/lib/crm/`, `src/lib/ai/`, `src/lib/tracking/`, `src/middleware.ts`, `src/app/admin/**`, `src/app/api/admin/**`, `docs/v2/tai-san-xemtuvi/`), không sửa `MENU_QUAN_TRI`, không xóa `/admin`, không thêm thư viện npm, không chạy migration, không commit.

## 2. Cách đã kiểm

1. **Kiểm tra kiểu TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**: thoát mã `0` (`TSC_EXIT=0`).
2. **Rà soát quy tắc CSS, SQL và bảo mật bằng grep**: quét trên cả 4 thư mục mới (`so-lieu`, `khach-hang`, `hoi-thoai`, `ai/tro-ly`) và `src/app/quan-tri/quan-tri.css` các mẫu `Admin: Cuong`, `$queryRawUnsafe`, `$executeRawUnsafe`, lớp `so`/`nhan`/`gia-tri` và các lớp v1 (`pill`, `card`, `btn`, `row`, `chip`, `muted`, `small`, `tag`, `wrap`, `err`, `warn`, `result`), `var(--paper)`, `updateRuntimeLlmConfig`, `apiKey` / `API Key`. Kết quả: `GREP_HITS=0`.
3. **Kiểm tra phân quyền Đợt 1 (`node scripts/kiem-dot1-quyen.mjs http://localhost:3047`)**: thoát mã `0` (`DOT1_EXIT=0`).
4. **Kiểm thử HTTP + Playwright Chromium đầu cuối trên `http://localhost:3047`**: đăng nhập bằng các tài khoản thử (mật khẩu đọc từ `D:\VibeCode\Antigravity\may-tram\tai-khoan-thu.json`, không in ra), kiểm quyền cả 4 vai trò + chưa đăng nhập trên cả 4 trang mới, tạo bản ghi `[THỬ]` để kiểm thao tác xem/sửa/nhật ký trên trình duyệt rồi xóa sạch sau khi kiểm (`E2E_EXIT=0`).

## 3. Kết quả từng bước ở mục 5

1. **Bước 5.1 (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**: đạt (`TSC_EXIT=0`).
2. **Bước 5.2 (`node scripts/kiem-dot1-quyen.mjs http://localhost:3047`)**: đạt (`qt@xemboi.test` 9/9, `bt@xemboi.test` 6/9, `cg@xemboi.test` 0/9, `sl@xemboi.test` 5/9, chưa đăng nhập `307 /quan-tri/dang-nhap`, `DOT1_EXIT=0`).
3. **Bước 5.3 (chạy trên `http://localhost:3047`)**:
   - **Tài khoản quản trị (`qt@xemboi.test`, `Thử Quản Trị`)**: mở được cả 4 trang `/quan-tri/so-lieu`, `/quan-tri/khach-hang`, `/quan-tri/hoi-thoai`, `/quan-tri/ai/tro-ly` với mã `200`, hiển thị đầy đủ nội dung và không có lỗi JS trên trình duyệt.
   - **Tài khoản xem số liệu (`sl@xemboi.test`)**: mở được `/quan-tri/so-lieu` (`200`, xác nhận có 6 ô `qt-so`, bảng 20 sự kiện gần nhất và `visitorId` chỉ hiện 6 ký tự đầu, không lộ `visitorId` đầy đủ trong HTML); 3 trang còn lại (`/quan-tri/khach-hang` và chi tiết `/quan-tri/khach-hang/[id]`, `/quan-tri/hoi-thoai`, `/quan-tri/ai/tro-ly`) đều chuyển hướng `307` về `/quan-tri?thieu-quyen=…`. Ngoài ra đã kiểm thêm `bt@xemboi.test` (vào được `so-lieu`, bị chặn 3 trang còn lại), `cg@xemboi.test` (bị chặn cả 4) và truy cập chưa đăng nhập (`307 /quan-tri/dang-nhap`).
   - **Khách hàng & nhật ký**: tạo khách `[THỬ] Khách Kiểm Thử 22` (`phone: 0912345612`, `email: nguyen.thu22@gmail.com`, `leadScore: 25`, `tags: ['[THỬ] Ban đầu']`):
     - Trên `/quan-tri/khach-hang`, SĐT được che thành `09******12` và email thành `ng***@gmail.com` (không xuất hiện chuỗi gốc trong HTML).
     - Mở `/quan-tri/khach-hang/[id]` hiện đầy đủ SĐT, email và ghi dòng `khach_hang.xem_chi_tiet` (`CustomerProfile`) trong `/quan-tri/nhat-ky`.
     - Sửa trên giao diện thành `leadScore: 88`, `tags: '[THỬ] Đã sửa, VIP'`, `adminNotes: 'Đã cập nhật thử Lệnh 22'` → cập nhật thành công và ghi dòng `khach_hang.sua` với đủ JSON `truoc`/`sau` trong `/quan-tri/nhat-ky`.
     - Đã xóa khách `[THỬ]`; kiểm lại còn `0` bản ghi `[THỬ]` trong `CustomerProfile`.
   - **Trang trợ lý AI (`/quan-tri/ai/tro-ly`)**: tạo bản ghi tạm `[THỬ] Trợ Lý Kiểm Thử`; kiểm xác nhận có liên kết `Mô hình AI` (`/quan-tri/ai/mo-hinh`), liên kết `Nguồn RAG của trợ lý` (`/quan-tri/rag/nguon?q=XB-`), danh sách few-shot 8 mẫu chỉ đọc (không có nút thêm) và không có ô nhập API key nào; thử sửa tên, `voiceSpeed` và `systemPrompt` → ghi dòng `ai.sua_tro_ly` trong `/quan-tri/nhat-ky` trong đó `systemPrompt` chỉ lưu `{ doDai, sha256 }` (không chứa toàn văn prompt); đã xóa trợ lý `[THỬ]` (`0` bản ghi `[THỬ]` còn lại trong `AiAgent`).
   - **Trang hội thoại (`/quan-tri/hoi-thoai`)**: tải danh sách hội thoại từ `/api/admin/conversations`, tùy chọn gửi phản hồi và chế độ giả lập hiển thị đúng `hoTen` của tài khoản đang đăng nhập (`Thử Quản Trị`), không còn chuỗi `Admin: Cuong`.
   - **Grep thư mục mới & `quan-tri.css`**: `0` kết quả khớp `Admin: Cuong`, `$queryRawUnsafe`, `$executeRawUnsafe`, `className="so"`, lớp v1 hay `var(--paper)`.

## 4. Những gì chưa làm được và lý do

- **Gửi tin nhắn / tiếp quản trực tiếp qua `POST /api/admin/conversations`**: để giữ nguyên các hội thoại hiện có (theo quy tắc 6 của Lệnh 22) và vì `conversation-store.ts` sử dụng seed bộ nhớ hoặc dữ liệu hội thoại chung khi DB chưa có dòng `ChatConversation` riêng cho thử nghiệm, nên phần `POST` gửi tin thật chưa chạy thử ghi thật; đã kiểm luồng tải danh sách `GET /api/admin/conversations`, truyền `tenQuanTri` từ server xuống client, hiển thị `select` tư cách gửi và thử gửi can thiệp trong tab `Giả lập tọa đàm`.
- **Dữ liệu thật trong `CustomerProfile` và `AiAgent` trên CSDL máy trạm**: hiện hai bảng này trên CSDL máy trạm đều có `0` bản ghi thật, nên toàn bộ kiểm thử xem chi tiết và sửa thực tế đã dùng bản ghi tạm `[THỬ]` rồi xóa sạch sau khi xong.
- **Kiểm tra kẹp biên `leadScore` ngoài `0–100` qua UI**: đã kiểm trường hợp `25 → 88` qua giao diện trình duyệt và cài logic kẹp `Math.max(0, Math.min(100, Math.round(diemSo)))` trong `suaKhachHang`; chưa chạy thêm lượt submit UI riêng với giá trị âm hoặc `> 100`.

## 5. Đề nghị sửa lõi

1. **Chuyển mẫu đối thoại few-shot khỏi tệp mã nguồn (`src/app/api/admin/agents/route.ts` & `src/lib/ai/few-shot-dialogues.json`)**: route cũ dùng `fs.writeFileSync` ghi đè tệp trong `src/` lúc chạy. Đề nghị đưa danh sách few-shot vào bảng riêng trong PostgreSQL (hoặc `CaiDat`) để khu `/quan-tri/ai/tro-ly` thêm/sửa/xóa an toàn kèm `ghiNhatKy`.
2. **Nạp chuẩn danh sách `AiAgent` vào PostgreSQL**: hiện bảng `AiAgent` trên CSDL máy trạm có `0` bản ghi (`DEFAULT_AGENTS` chỉ khai báo tĩnh trong `src/lib/ai/agent-persona.ts`). Đề nghị có bước seed chuẩn các trợ lý vào `AiAgent` (cùng việc chuyển tri thức `XB-*` nếu có `AgentKnowledgeDoc`) để trang `/quan-tri/ai/tro-ly` có dữ liệu thật để quản lý.
3. **Chuẩn hóa API hội thoại sang `/api/quan-tri/hoi-thoai` (`src/app/api/admin/conversations/route.ts` & `simulate/route.ts`)**: hiện hai route `/api/admin/conversations*` dùng `yeuCauQuanTri(req)` với quyền mặc định `khach_hang.xem` (thay vì `hoi_thoai.xem`), vẫn mở nhánh `ADMIN_KEY` qua `cu.ts`, và các hành động `POST` (`TOGGLE_TAKEOVER`, `SEND_MESSAGE`, `SUMMON_AGENT`, `TRIGGER_AUTO_COUNCIL`) chưa ghi `NhatKyThaoTac`. Đề nghị tách route mới dưới `/api/quan-tri/hoi-thoai` dùng `kiemQuyenApi(req, 'hoi_thoai.xem')` và ghi nhật ký đầy đủ.
4. **Loại bỏ nhánh dữ liệu mẫu/giả dự phòng trong `src/lib/tracking/tracker-server.ts` và `src/lib/crm/customer-service.ts`**: khi DB gặp lỗi hoặc tra `id` trùng khóa mẫu (`cust_sample_1`, `cust_sample_2`), các hàm cũ trả về số liệu cứng (`12`, `145`, `44.4%`, `onlineCount = Math.max(1, ...)`) hoặc hồ sơ mẫu bộ nhớ. Đề nghị bỏ fallback số liệu giả ở khu quản trị (trả lỗi rõ hoặc dữ liệu rỗng thật) để không gây nhầm lẫn với số liệu vận hành.

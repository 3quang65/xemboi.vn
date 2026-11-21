# Lệnh 22: gộp khu `/admin` cũ vào `/quan-tri` (Đợt 2)

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity. Chỉ bắt đầu sau khi Lệnh 21 xong. Báo cáo ghi vào `docs/v2/lenh-antigravity/22-bao-cao.md`.

Đọc trước:
- `docs/v2/00-BAN-CU-BAN-MOI.md`, nhất là mục "Bẫy CSS";
- `docs/v2/17-backend-quan-tri.md`, bảng "Giữ / Gộp / Bỏ" ở mục 4 (các dòng `/admin/*`);
- mã cũ để biết chức năng: `src/app/admin/**` và `src/app/api/admin/**`.

## 1. Mục tiêu

Khu `/admin/*` cũ dùng chung một khóa, ghi cứng "Admin: Cuong" và mang giao diện riêng. Nay làm lại 4 trang trong khu `/quan-tri` có đăng nhập theo tài khoản. Sau khi anh duyệt, Claude Code sẽ chuyển hướng 308 từ `/admin/*` sang trang mới (mục 4). **Không xóa** tệp `/admin` cũ.

| Trang mới | Thay cho | Quyền (đã có trong `src/lib/quan-tri/quyen.ts`) |
|---|---|---|
| `/quan-tri/so-lieu` | `/admin/dashboard`, `/admin/analytics` | `so_lieu.xem` |
| `/quan-tri/khach-hang`, `/quan-tri/khach-hang/[id]` | `/admin/customers`, `/admin/customers/[id]` | `khach_hang.xem` (chỉ quản trị) |
| `/quan-tri/hoi-thoai` | `/admin/conversations` | `hoi_thoai.xem` (chỉ quản trị) |
| `/quan-tri/ai/tro-ly` | `/admin/agents`, phần cấu hình | `ai.tro_ly` (chỉ quản trị) |

**Bỏ hẳn, không làm lại:**
- `/admin/inquiries`: phần "tìm bên ngoài" chỉ trả danh sách viết sẵn trong mã, lại có câu dính từ cấm.
- Tab "Kho tri thức" của `/admin/agents`: tri thức cũ đã chuyển sang RAG bằng `scripts/chuyen-tri-thuc-cu.ts`, thành các nguồn mã `XB-…`. Ở trang trợ lý, đặt liên kết "Nguồn RAG của trợ lý" tới `/quan-tri/rag/nguon?q=XB-`.

## 2. Việc cần làm

Mọi tệp nằm trong `src/app/quan-tri/(khu)/<trang>/`. Server action để trong `hanh-dong.ts` cùng thư mục.

### 2.1. `/quan-tri/so-lieu`
- Server component gọi thẳng `getAnalyticsSummary()` (`src/lib/tracking/tracker-server.ts`), không qua API.
- Hiện các ô `qt-so`: đang online, phiên hôm nay/tổng, lượt xem hôm nay/tổng, lá số đã lập, mở chat, tỷ lệ chuyển đổi.
- Bảng 20 sự kiện gần nhất. `visitorId` chỉ hiện 6 ký tự đầu. Vai trò xem số liệu không được thấy định danh đầy đủ.

### 2.2. `/quan-tri/khach-hang` và `/quan-tri/khach-hang/[id]`
- **Danh sách:**
  - gọi `listCustomers({ page, limit: 50, search, tag })` (`src/lib/crm/customer-service.ts`); lọc bằng GET;
  - số điện thoại và email **che bớt**, ví dụ `09******12`, `ng***@gmail.com`.
- **Chi tiết:**
  - gọi `getCustomerDetail(id)`, hiện đủ liên hệ;
  - mỗi lần mở trang ghi nhật ký `khach_hang.xem_chi_tiet` bằng `ghiNhatKy(prisma, nd, 'khach_hang.xem_chi_tiet', 'CustomerProfile', id)`. Lý do: đây là dữ liệu cá nhân.
- **Sửa** nhãn, ghi chú, điểm tiềm năng: server action `suaKhachHang`.
  - Trong `prisma.$transaction`: đọc bản trước, `tx.customerProfile.update(...)`, rồi `ghiNhatKy(tx, nd, 'khach_hang.sua', 'CustomerProfile', id, truoc, sau)`.
  - Chỉ ghi `tags`, `adminNotes`, `leadScore`; điểm kẹp trong 0–100.
  - **Không dùng** `updateCustomer`, vì hàm đó nuốt lỗi và có nhánh ghi vào bộ nhớ.

### 2.3. `/quan-tri/hoi-thoai`
- Chuyển giao diện `src/app/admin/conversations/page.tsx` (2.233 dòng) sang. Được tách thành nhiều component client trong `src/app/quan-tri/(khu)/hoi-thoai/`.
- **Được phép** tiếp tục gọi `/api/admin/conversations` và `/api/admin/conversations/simulate`. Hai route này đã kiểm quyền `khach_hang.xem` qua `yeuCauQuanTri`. Không sửa hai route này.
- Phải bỏ:
  - mọi chữ "Admin: Cuong" và mọi tên người ghi cứng;
  - người gửi tin "admin" phải lấy `hoTen` của tài khoản đang đăng nhập; truyền từ server component xuống làm prop.
- **CSS:**
  - giao diện cũ có nhiều lớp riêng: đổi sang lớp `qt-*` hoặc style nội tuyến;
  - **không** dùng lớp toàn cục của v1. Trước khi đặt tên lớp, grep `src/app/globals.css` và `public/**/style*.css` để tránh trùng.

### 2.4. `/quan-tri/ai/tro-ly`
- **Bảng trợ lý:** đọc từ `prisma.aiAgent`, kèm số hội thoại.
- **Sửa** tên, chức danh, `systemPrompt`, `welcomeMessage`, `suggestedQuestions`, giọng (`voiceProvider`, `voiceId`, `voiceSpeed`, `voicePitch`), `isActive`:
  - server action `suaTroLy`;
  - giao dịch và nhật ký `ai.sua_tro_ly`, có trước/sau;
  - với `systemPrompt`, nhật ký chỉ lưu độ dài và sha256, không lưu toàn văn.
- **Cấu hình LLM: KHÔNG làm ở trang này.** Claude Code đã làm trang riêng `/quan-tri/ai/mo-hinh`, dùng 9router; cấu hình lưu `CaiDat` khóa `LLM`, khóa API chỉ ở biến môi trường.
  - Trang trợ lý chỉ đặt một liên kết "Mô hình AI" tới trang đó.
  - **Không gọi** `updateRuntimeLlmConfig`.
  - **Tuyệt đối không có ô nhập API key.**
- **Mẫu đối thoại few-shot:** chỉ hiện danh sách đọc từ `src/lib/ai/few-shot-dialogues.json`. **Không làm nút thêm.** Route cũ ghi đè tệp trong `src/` lúc chạy; ghi việc này vào mục "Đề nghị sửa lõi".

## 3. Quy tắc bắt buộc (như Lệnh 21)

1. **Không sửa:**
   - `prisma/schema.prisma`, `prisma/migrations/`;
   - `src/lib/quan-tri/`, `src/lib/noi-dung/`, `src/lib/seo/`, `src/lib/rag/`, `src/lib/core/`;
   - `src/lib/crm/`, `src/lib/ai/`, `src/lib/tracking/`;
   - `src/middleware.ts`, `src/app/admin/**`, `src/app/api/admin/**`;
   - `docs/v2/tai-san-xemtuvi/`.

   Thấy cần đổi phần lõi thì ghi vào báo cáo, mục "Đề nghị sửa lõi".
2. Mọi page và mọi server action gọi `yeuCauQuyen(...)` ở **dòng đầu**. Mọi thao tác ghi có `ghiNhatKy` **trong cùng giao dịch**.
3. Cấm `$queryRawUnsafe` và `$executeRawUnsafe`.
4. **CSS:**
   - chỉ dùng lớp `qt-*` có trong `src/app/quan-tri/quan-tri.css`, hoặc thêm lớp mới ở cuối tệp đó với tiền tố `qt-`;
   - **cấm** các lớp `so`, `nhan`, `gia-tri` và biến `var(--paper)`.
5. Không thêm thư viện npm. Không chạy migration. Không commit, không chạy lệnh git làm đổi lịch sử.
6. Không sửa hay xóa khách hàng và hội thoại thật. Muốn thử thao tác sửa thì tạo khách `[THỬ]`, xong thì xóa.
7. Không đụng menu: Claude Code sẽ thêm mục menu khi duyệt.

## 4. Phần Claude Code làm sau khi duyệt (Antigravity không làm)

- Thêm mục menu.
- `src/middleware.ts`: chuyển hướng 308 `/admin/dashboard|analytics` → `/quan-tri/so-lieu`, `/admin/customers[/id]` → `/quan-tri/khach-hang[/id]`, `/admin/conversations` → `/quan-tri/hoi-thoai`, `/admin/agents` → `/quan-tri/ai/tro-ly`, `/admin/inquiries` → `/quan-tri`.
- Bỏ mục "CRM cũ (/admin)" khỏi menu. Xóa tệp cũ chỉ khi anh cho phép.

## 5. Kiểm trước khi báo xong

1. `.\node_modules\.bin\tsc.cmd --noEmit -p .` thoát mã 0.
2. `node scripts/kiem-dot1-quyen.mjs http://localhost:3047` vẫn đạt. Mật khẩu tài khoản thử ở `D:\VibeCode\Antigravity\may-tram\tai-khoan-thu.json`; **không in mật khẩu** ra.
3. Chạy tay trên `http://localhost:3047`, ghi kết quả vào báo cáo:
   - tài khoản quản trị mở được cả 4 trang;
   - tài khoản xem số liệu chỉ mở được `/quan-tri/so-lieu`; ba trang còn lại chuyển về `/quan-tri?thieu-quyen=…`;
   - mở chi tiết một khách → có dòng `khach_hang.xem_chi_tiet` trong `/quan-tri/nhat-ky`;
   - sửa nhãn khách `[THỬ]` → có dòng `khach_hang.sua` với trước/sau; xong thì xóa khách `[THỬ]`;
   - trang trợ lý không có ô nhập API key nào;
   - grep thư mục mới không còn `Admin: Cuong`, `$queryRawUnsafe` hay `className="so"`.
4. Báo cáo `22-bao-cao.md` gồm: danh sách tệp, cách đã kiểm, kết quả từng bước ở mục 5, những gì chưa làm được và lý do, đề nghị sửa lõi (nếu có).

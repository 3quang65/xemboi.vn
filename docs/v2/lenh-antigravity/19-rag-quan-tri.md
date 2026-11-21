# Lệnh 19: Dựng 4 trang quản trị RAG (Đợt 1)

Người giao: anh Cường, qua Claude Code. Ngày 22/11/2026. Model: Orchestrator (Gemini 4 Neon).

## 0. Đọc trước

1. `docs/v2/00-BAN-CU-BAN-MOI.md`: phần nào là v1, phần nào là v2. **Chỉ làm trong phần v2.**
2. `docs/v2/17-backend-quan-tri.md`:
   - mục 3.1 (danh mục nguồn), 3.2.2 (hàng đợi), 3.3 (trình duyệt đoạn), 3.4 (thử truy vấn), 3.5 (chính sách hiển thị);
   - mục 5, bảng quyền.
3. Mẫu cần làm theo. Đây là các trang SEO vừa làm xong; **chép cấu trúc, lớp CSS và cách kiểm quyền của chúng:**
   - `src/app/quan-tri/(khu)/seo/tu-khoa/page.tsx`: danh sách, lọc bằng form GET, phân trang;
   - `src/app/quan-tri/(khu)/seo/trang/[id]/page.tsx`: trang chi tiết và form sửa;
   - `src/app/quan-tri/(khu)/seo/hanh-dong.ts`: server action, gồm kiểm quyền, giao dịch, `ghiNhatKy`, chuyển về kèm `?bao=`/`?loi=`;
   - `src/app/quan-tri/(khu)/seo/ThongBao.tsx`: thông báo và định dạng số;
   - `src/app/quan-tri/quan-tri.css`: chỉ dùng các lớp `qt-*` có sẵn. Không thêm thư viện, không dùng Tailwind trong khu quản trị.
4. `src/lib/quan-tri/quyen.ts`: tên quyền `rag.xem_cong_khai`, `rag.xem_noi_bo`, `rag.sua_doan`, `rag.quan_ly_nguon`.
5. `prisma/schema.prisma`: các model `RagNguon`, `RagDoan`, `RagViec`, `RagDoanSua`, `RagTruyVanLog` (bảng `rag_nguon`, `rag_doan`, `rag_viec`…).
6. `prisma/migrations/0002_dot1_rag_pham_vi/migration.sql`: view `rag_nguon_cong_khai`, `rag_doan_cong_khai`, các trigger phạm vi.

## 1. Việc cần làm

Tạo 4 trang trong `src/app/quan-tri/(khu)/rag/` và một tệp `rag/hanh-dong.ts`. Menu đã có sẵn đường dẫn, không cần sửa menu.

| Trang | Quyền xem | Nội dung |
|---|---|---|
| `rag/nguon/page.tsx` | `rag.xem_cong_khai` | Bảng nguồn. **Cột:** mã, tên gốc / Hán Việt, tác giả, pháp lý A/B/C, phạm vi, trạng thái, số đoạn, số đoạn có vector, trạng thái tải. **Lọc:** pháp lý, phạm vi, trạng thái, mảng, ô tìm. Ô số liệu trên đầu: tổng nguồn, theo A/B/C, tổng đoạn, đoạn có vector. |
| `rag/nguon/[id]/page.tsx` | như trên | Chi tiết nguồn, 20 đoạn đầu, các việc pipeline của nguồn. Người có `rag.quan_ly_nguon` sửa được: `chiNoiBo`, `xinPhep`, `trangThai` (DANH_MUC/DANG_NAP/DA_NAP/TAM_DUNG/LOAI), `ghiChuPhapLy`. Mỗi lần sửa ghi nhật ký. **Không cho sửa `phamVi` trực tiếp:** trigger tự tính. Khi trigger báo lỗi (đặt CONG_KHAI sai luật), bắt lỗi và hiện `?loi=` dễ hiểu. |
| `rag/hang-doi/page.tsx` | `rag.quan_ly_nguon` | Bảng `rag_viec`: lọc theo trạng thái / loại / nơi chạy; đếm theo trạng thái. Hai nút **Chạy lại** (việc LOI: đưa về CHO, `soLanThu = 0`) và **Hủy** (CHO, DANG_CHAY → HUY). |
| `rag/doan/page.tsx` | `rag.xem_cong_khai` | Trình duyệt đoạn: lọc theo nguồn, loại, đã soát; tìm chữ. 50 đoạn một trang, mỗi đoạn hiện `duongDan`, `vanBan` (cắt 400 ký tự), `hanViet`/`dichVi` nếu có, phạm vi, có vector chưa. |
| `rag/doan/[id]/page.tsx` | như trên | Xem đủ đoạn. Người có `rag.sua_doan` sửa được `vanBanChuan`, `hanViet`, `dichVi`, `daSoat`. Mỗi lần sửa ghi một dòng `RagDoanSua` (trước, sau, người sửa) **và** nhật ký, trong cùng giao dịch. |
| `rag/thu/page.tsx` | `rag.xem_cong_khai` | Ô truy vấn → **chỉ tìm theo từ khóa**: `tsv @@ plainto_tsquery('simple', q)` cộng `similarity(vanBan, q)` (pg_trgm), xếp hạng, lấy 20 đoạn. Hiện điểm và mã đoạn. Mỗi lần thử ghi `RagTruyVanLog` nếu model đủ cột; nếu không đủ cột thì bỏ, đừng sửa schema. Ghi rõ trên trang: "Tìm ngữ nghĩa (vector) chưa bật ở web; chạy ở máy trạm". |

## 2. Luật bắt buộc (vi phạm thì trả về làm lại)

1. **Chặn phạm vi ở tầng truy vấn (17 mục 3.5).**
   - Người **không** có `rag.xem_noi_bo` (ví dụ vai trò CHUYEN_GIA_DUYET) chỉ được thấy dữ liệu công khai, ở **mọi** trang và **mọi** câu truy vấn: danh sách, chi tiết, đếm, tìm thử.
   - Cách làm: đọc qua view `rag_doan_cong_khai` / `rag_nguon_cong_khai`, hoặc thêm `phamVi = 'CONG_KHAI'` vào mọi câu truy vấn.
   - Mở `/rag/doan/<id>` của một đoạn NOI_BO bằng tài khoản không có quyền thì phải ra `notFound()`, không được hiện nội dung.
   - Viết một hàm dùng chung `src/lib/rag/pham-vi.ts` (ví dụ `dieuKienPhamVi(nd)`) và dùng nó ở mọi trang, đừng lặp điều kiện.
2. Mọi server action gọi `yeuCauQuyen('<quyền>')` ở dòng đầu. Có ghi thì ghi `ghiNhatKy` trong cùng `prisma.$transaction`.
3. `id` của `RagDoan` và `RagViec` là BigInt: đổi bằng `BigInt(...)`, khi trả ra giao diện thì `String(...)`.
4. SQL thô chỉ dùng `prisma.$queryRaw` có tham số (template literal). **Không** dùng `$queryRawUnsafe` và không ghép chuỗi.
5. **Không sửa:**
   - `prisma/schema.prisma`, `prisma/migrations/`;
   - `src/lib/quan-tri/*`, `src/middleware.ts`;
   - các trang SEO;
   - `src/lib/core/*`, `docs/v2/tai-san-xemtuvi/*`;
   - mọi tệp v1.
6. **Không** chạy `prisma migrate`, `db push`, `git commit`, `git push`, `git stash` hay `git reset`.
7. Chữ hiển thị bằng tiếng Việt có dấu, viết rõ, không dùng thuật ngữ khó.

## 3. Tự kiểm trước khi báo xong

- `npx tsc --noEmit -p .`: không có lỗi mới. Lỗi cũ trong `.next/types` thì bỏ qua.
- Bật Postgres máy trạm: `D:\VibeCode\Antigravity\may-tram\pgsql\bin\pg_ctl.exe -D D:\VibeCode\Antigravity\may-tram\pgdata -l D:\VibeCode\Antigravity\may-tram\pg.log -w start`. Bật dev: `npx next dev -p 3047`. Mở `http://localhost:3047/quan-tri/rag/nguon`. **Đừng mở `/` để thử: trang đó là v1.**
- Đăng nhập: mật khẩu tài khoản thử nằm trong `D:\VibeCode\Antigravity\may-tram\tai-khoan-thu.json`. **Không in mật khẩu ra báo cáo.**
  - Bằng `qt@xemboi.test`: thấy đủ 4 trang.
  - Bằng `cg@xemboi.test`: không thấy Hàng đợi, và không thấy đoạn nào có phạm vi NOI_BO.

## 4. Báo cáo

Ghi `docs/v2/lenh-antigravity/19-bao-cao.md`, gồm:
- danh sách tệp đã tạo;
- cách đã kiểm điều kiện phạm vi;
- kết quả tsc;
- những gì chưa làm được và lý do.

Claude Code sẽ duyệt mã và chạy nghiệm thu phân quyền.

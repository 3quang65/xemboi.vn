# Báo cáo Lệnh 19: Dựng 4 trang quản trị RAG (Đợt 1)

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp đã tạo

- `src/lib/rag/pham-vi.ts` — Hàm dùng chung kiểm tra quyền `rag.xem_noi_bo` (`duocXemNoiBo`), tạo điều kiện lọc Prisma (`dieuKienPhamVi`), điều kiện SQL có tham số (`sqlPhamVi`), ép ngữ cảnh truy vấn (`nguCanhTruyVan`), và chuẩn hóa tham số ID (`phanTichInt`, `phanTichBigInt`).
- `src/app/quan-tri/(khu)/rag/HienThi.tsx` — Thành phần `ThongBao`, các hàm định dạng (`so`, `pct`, `ngayGio`, `catVanBan`) và nhãn tiếng Việt có dấu dùng chung các lớp `qt-*` trong `src/app/quan-tri/quan-tri.css`.
- `src/app/quan-tri/(khu)/rag/hanh-dong.ts` — Các Server Action (`capNhatNguon`, `chayLaiViec`, `huyViec`, `suaDoan`), gọi `yeuCauQuyen` ngay dòng đầu và ghi `ghiNhatKy` trong cùng `prisma.$transaction`.
- `src/app/quan-tri/(khu)/rag/nguon/page.tsx` — Danh sách nguồn tài liệu RAG (`/quan-tri/rag/nguon`), các ô thống kê tổng quan, bộ lọc GET (tìm chữ, pháp lý, phạm vi, trạng thái nạp, mảng), đếm số đoạn và số đoạn có vector theo nguồn, phân trang 100 nguồn/trang.
- `src/app/quan-tri/(khu)/rag/nguon/[id]/page.tsx` — Chi tiết nguồn RAG, 20 đoạn đầu, danh sách việc pipeline của nguồn, form sửa (`chiNoiBo`, `xinPhep`, `trangThai`, `ghiChuPhapLy`) cho người có `rag.quan_ly_nguon`; không có trường sửa trực tiếp `phamVi` và bắt lỗi trigger phạm vi về `?loi=` tiếng Việt dễ hiểu.
- `src/app/quan-tri/(khu)/rag/hang-doi/page.tsx` — Hàng đợi xử lý `rag_viec` (`/quan-tri/rag/hang-doi`), yêu cầu quyền `rag.quan_ly_nguon`; thống kê đếm theo trạng thái, danh sách máy xử lý (`rag_may_xu_ly`), lọc theo trạng thái / loại bước / nơi chạy / nguồn, thao tác **Chạy lại** (việc `LOI` → `CHO`, `soLanThu = 0`) và **Hủy** (`CHO`/`DANG_CHAY` → `HUY`).
- `src/app/quan-tri/(khu)/rag/doan/page.tsx` — Trình duyệt đoạn (`/quan-tri/rag/doan`), lọc theo nguồn, loại đoạn, trạng thái soát, phạm vi (chỉ hiện tùy chọn nội bộ cho tài khoản có `rag.xem_noi_bo`) và tìm chữ; hiển thị 50 đoạn/trang kèm `duongDan`, `vanBan` cắt 400 ký tự, `hanViet`/`dichVi` nếu có, phạm vi và trạng thái vector.
- `src/app/quan-tri/(khu)/rag/doan/[id]/page.tsx` — Chi tiết đoạn và form hiệu đính (`vanBanChuan`, `hanViet`, `dichVi`, `daSoat`) cho người có `rag.sua_doan`; mỗi lần sửa ghi lịch sử vào `RagDoanSua` và nhật ký `NhatKyThaoTac` trong cùng giao dịch.
- `src/app/quan-tri/(khu)/rag/thu/page.tsx` — Thử truy vấn từ khóa (`/quan-tri/rag/thu`), ghi rõ `"Tìm ngữ nghĩa (vector) chưa bật ở web; chạy ở máy trạm."`; xếp hạng top 20 đoạn bằng `tsv @@ plainto_tsquery('simple', q)` + `similarity(vanBan, q)` + khớp chuỗi có tham số `ILIKE`, hiện điểm và mã đoạn, và ghi nhật ký vào `RagTruyVanLog`.
- `docs/v2/lenh-antigravity/19-bao-cao.md` — Tệp báo cáo này.

Không sửa `prisma/schema.prisma`, `prisma/migrations/`, `src/lib/quan-tri/`, `src/middleware.ts`, các trang SEO, `src/lib/core/`, `docs/v2/tai-san-xemtuvi/`, hay bất kỳ tệp v1 nào; không chạy migration hoặc lệnh git thay đổi lịch sử/commit.

## 2. Cách đã kiểm điều kiện phạm vi

1. **Tập trung tại `src/lib/rag/pham-vi.ts`**:
   - `dieuKienPhamVi(nd)` trả `{}` nếu tài khoản có `rag.xem_noi_bo`, ngược lại trả `{ phamVi: 'CONG_KHAI' }`. Mọi câu truy vấn Prisma đều ghép qua `AND: [dieuKienPhamVi(nd), ...]` để tham số URL (như `?phamVi=NOI_BO`) không thể ghi đè phạm vi.
   - `sqlPhamVi(nd, bietDanh)` dùng trong mọi câu `$queryRaw` có tham số trên `rag_nguon` và `rag_doan`.
   - `nguCanhTruyVan(nd, chon)` ép về `'CONG_KHAI'` nếu tài khoản không có `rag.xem_noi_bo`. Trong `/quan-tri/rag/thu`, nhánh `CONG_KHAI` truy vấn trực tiếp qua view `rag_doan_cong_khai` và `rag_nguon_cong_khai`.
   - Server action `suaDoan` dùng `findFirst({ where: { AND: [{ id }, dieuKienPhamVi(nd)] } })` trong giao dịch để chặn sửa đoạn `NOI_BO` từ tài khoản thiếu quyền.
2. **Kiểm tra thực tế qua HTTP trên `http://localhost:3047`**:
   - Chưa đăng nhập: cả 4 đường dẫn `/quan-tri/rag/{nguon,hang-doi,doan,thu}` đều trả `307` chuyển về `/quan-tri/dang-nhap`.
   - `qt@xemboi.test` (`QUAN_TRI`): vào đủ 4 trang và 2 trang chi tiết; thấy đủ 314 nguồn (gồm 164 công khai, 150 nội bộ), mở được chi tiết nguồn C (`DS11`), vào được Hàng đợi, thử truy vấn `"紫微"` ghi log vào `RagTruyVanLog`.
   - `bt@xemboi.test` (`BIEN_TAP`): thấy đủ 314 nguồn và vào được Nguồn, Đoạn, Thử truy vấn; không thấy Hàng đợi trong menu và vào `/quan-tri/rag/hang-doi` bị chuyển hướng kèm `thieu-quyen=rag.quan_ly_nguon`.
   - `cg@xemboi.test` (`CHUYEN_GIA_DUYET`): không thấy Hàng đợi trên menu và bị chặn khi truy cập trực tiếp (`thieu-quyen=rag.quan_ly_nguon`); ở `/quan-tri/rag/nguon` chỉ thấy 164 nguồn `CONG_KHAI`, ép `?phamVi=NOI_BO` trả 0 nguồn; mở trực tiếp chi tiết nguồn C (`/quan-tri/rag/nguon/<id>`) trả `404`; ở `/quan-tri/rag/doan?phamVi=NOI_BO` trả 0 đoạn; ở `/quan-tri/rag/thu?q=紫微&nguCanh=NOI_BO` bị ép chạy ngữ cảnh `CONG_KHAI` (đối chiếu trong `RagTruyVanLog`).
   - `sl@xemboi.test` (`XEM_SO_LIEU`): bị chặn ở cả 4 trang RAG (`thieu-quyen=`).
   - Các ID không hợp lệ hoặc không tồn tại ở `/rag/nguon/[id]` và `/rag/doan/[id]` trả `404`.
3. **Kiểm tra đoạn `NOI_BO` và trigger trong giao dịch hoàn tác**:
   - Chèn tạm 1 đoạn thuộc nguồn C (phạm vi `NOI_BO`) trong `$transaction` rồi hoàn tác: truy vấn có `{ phamVi: 'CONG_KHAI' }` trả `null` (dẫn tới `notFound()`), view `rag_doan_cong_khai` trả `0` dòng, và cập nhật trái luật `phamVi = 'CONG_KHAI'` trên nguồn C bị trigger từ chối với lỗi chứa `không được để CONG_KHAI`.

## 3. Kết quả kiểm tra và `tsc`

- `.\node_modules\.bin\tsc.cmd --noEmit -p .`: thoát mã `0`, không có lỗi TypeScript.
- `node --test tests/dot1/rag-pham-vi.test.mjs`: `11/11` bài kiểm thử đạt.
- `node scripts/kiem-dot1-quyen.mjs http://localhost:3047`: đạt cho cả 4 tài khoản thử và truy cập chưa đăng nhập (`cg@xemboi.test` hiện 3 mục menu RAG: Nguồn, Đoạn, Thử truy vấn).

## 4. Những gì chưa làm được và lý do

- **Tìm ngữ nghĩa bằng vector trên web**: chưa bật theo đúng phạm vi Lệnh 19; việc nhúng câu hỏi và tìm vector hiện chạy trên máy trạm (`tools/rag-may-tram/truy_van.py`), và giao diện `/quan-tri/rag/thu` đã hiển thị thông báo rõ cho người dùng.
- **Hạn chế của `tsv`/`pg_trgm` với chữ Hán trên Postgres cục bộ**: CSDL máy trạm dùng `datctype = 'C'`, nên `pg_trgm` trả mảng rỗng và `plainto_tsquery('simple', ...)` không tách từ với chuỗi Hán liền nhau. Vì vậy `/quan-tri/rag/thu` giữ đủ nhánh `tsv` và `similarity(vanBan, q)` đồng thời cộng thêm nhánh khớp chuỗi có tham số `ILIKE` trên `vanBan`, `vanBanChuan`, `hanViet`, `dichVi` để truy vấn chữ Hán vẫn xếp hạng và trả đúng tối đa 20 đoạn.
- **Kiểm tra đoạn `NOI_BO` trên dữ liệu thật và thao tác ghi qua UI**: CSDL hiện có 32.061 đoạn đều thuộc nguồn A (`CONG_KHAI`); 150 nguồn B/C (`NOI_BO`) chưa nạp đoạn nên đường dẫn chi tiết đoạn `NOI_BO` được kiểm chứng qua giao dịch hoàn tác và đối chiếu với HTTP `404` trên chi tiết nguồn `NOI_BO`. Các thao tác ghi qua Server Action (`capNhatNguon`, `chayLaiViec`, `huyViec`, `suaDoan`) chưa thực hiện sửa dữ liệu thật qua trình duyệt để giữ nguyên trạng thái CSDL Đợt 1; mã nguồn action, kiểm quyền đầu hàm, giao dịch `ghiNhatKy` và bắt lỗi trigger đã được rà soát và kiểm biên dịch.

# Báo cáo Lệnh 21: Trang quản trị Nội dung (Đợt 2) và trang Nhật ký

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp

### Tệp tạo mới
- `src/app/quan-tri/(khu)/noi-dung/HienThi.tsx` — Các nhãn tiếng Việt cho loại nội dung, trạng thái, 18 mảng `A`–`R`, vai trò duyệt, kết luận duyệt, kiểu trích, nguồn tạo; bản đồ chuyển tiếp trạng thái `SAU_TRANG_THAI`; thành phần `ThongBao`, `nhanTrangThaiNd`, `nhanDiemOnpage`, `ngayGio`, `ngayNgan`; hàm `docKiemTra`, `demLoiChan`, `catTitleTheoBeRong`, `catMeta`, và thuật toán diff theo dòng `diffTheoDong` tự viết (không dùng thư viện ngoài).
- `src/app/quan-tri/(khu)/noi-dung/hanh-dong.ts` — Các Server Action dùng chung (`taoNoiDung`, `luuPhienBan`, `khoiPhucPhienBan`, `chuyenTrangThai`, `giaoChuyenGia`, `duyetNoiDung`, `duyetPhapLy`, `capNhatThongTinNoiDung`), mỗi hàm gọi `yeuCauQuyen(...)` ngay dòng đầu và gọi `ghiNhatKy(tx, nd, ...)` trong cùng `prisma.$transaction`.
- `src/app/quan-tri/(khu)/noi-dung/page.tsx` — Trang `/quan-tri/noi-dung` (quyền `noi_dung.xem`): danh sách nội dung phân trang 50 dòng, lọc GET theo tiêu đề, loại, trạng thái, mảng, `cuaToi`, `denHan`; chỉ hiển thị nút `+ Tạo mới` cho tài khoản có quyền `noi_dung.soan`.
- `src/app/quan-tri/(khu)/noi-dung/ChonSeoTrang.tsx` — Thành phần client tìm nhanh `SeoTrang` chưa gắn nội dung theo mã trang, đường dẫn hoặc title.
- `src/app/quan-tri/(khu)/noi-dung/moi/page.tsx` — Trang `/quan-tri/noi-dung/moi` (quyền `noi_dung.soan`): tạo mục nội dung ở trạng thái `NHAP`, gắn nhiều mảng, gắn tùy chọn một `SeoTrang` có `noiDungId` null và ghi nhật ký `nd.tao`.
- `src/app/quan-tri/(khu)/noi-dung/[id]/page.tsx` — Trang `/quan-tri/noi-dung/[id]` (quyền `noi_dung.xem`): thanh nút chuyển trạng thái dựa trên `kiemChuyen` (nút bị chặn hiện mờ kèm `lyDo`, nút `AI soạn` ở trạng thái tắt kèm dòng `Đợt 2b`), ô soạn 9 khối `KHOI` chia 2 tầng đọc nhanh (`k1`–`k3`) / đọc sâu (`k4`–`k8`, có ô tích `Không áp dụng` cho `k5`) / cuối mục (`k9`) hoặc ô `than` markdown, ghi chú phiên bản, trích dẫn phiên bản đang xem (link `/quan-tri/rag/doan/<id>`), lịch sử phiên bản và khôi phục, cột phải chấm điểm onpage 4 nhóm (`Chặn`, `Chặn index`, `Cảnh báo`, `Cộng`), giao chuyên gia đủ 3 điều kiện (`CHUYEN_GIA_DUYET`, `dangHoatDong = true`, `mangDuyet` giao `NoiDung.mang`), form duyệt chuyên môn (`chuyenGiaId`) và form duyệt pháp lý (`canDuyetPhapLy` + `QUAN_TRI`).
- `src/app/quan-tri/(khu)/noi-dung/[id]/XemTruocGoogle.tsx` — Khung xem trước Google bản máy tính và điện thoại, cắt title theo `uocBeRong` ≤ 580 px và meta theo 158 ký tự, cảnh báo khả năng Google viết lại title, hiển thị dòng `"Mô phỏng gần đúng, Google có thể hiển thị khác."`.
- `src/app/quan-tri/(khu)/noi-dung/[id]/SoSanhPhienBan.tsx` — Chọn 2 phiên bản và hiển thị diff theo dòng cho từng khối `k1`–`k9` (hoặc `than`).
- `src/app/quan-tri/(khu)/nhat-ky/BangNhatKy.tsx` — Bảng nhật ký chỉ đọc, bấm một dòng để mở/đóng chi tiết `truoc` / `sau` dạng JSON thụt dòng.
- `src/app/quan-tri/(khu)/nhat-ky/page.tsx` — Trang `/quan-tri/nhat-ky` (quyền `nhat_ky.xem`): mới nhất trước, phân trang 100 dòng, lọc GET theo tiền tố `hanhDong`, tài khoản, đối tượng, khoảng ngày.
- `docs/v2/lenh-antigravity/21-bao-cao.md` — Báo cáo này.

### Tệp chỉnh sửa
- `src/app/quan-tri/quan-tri.css` — Thêm các lớp tiền tố `qt-*` ở cuối tệp cho bố cục 2 cột nội dung, chọn mảng, nút chuyển trạng thái, khung xem trước Google, khối diff và bảng JSON nhật ký.

Không sửa các tệp thuộc vùng cấm (`prisma/schema.prisma`, `prisma/migrations/`, `src/lib/quan-tri/`, `src/lib/noi-dung/`, `src/lib/seo/`, `src/lib/rag/`, `src/middleware.ts`, `src/lib/core/`, `docs/v2/tai-san-xemtuvi/`, các tệp v1), không thêm thư viện npm, không chạy migration, không commit.

## 2. Cách đã kiểm

1. **Rà soát quy tắc CSS & SQL**: tìm mẫu trong toàn bộ tệp mới và `quan-tri.css`, xác nhận không dùng lớp `.so`, `.nhan`, `.gia-tri`, không dùng `var(--paper)`, và không dùng `$queryRawUnsafe` / `$executeRawUnsafe`.
2. **Kiểm tra kiểu TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**: thoát mã `0`. (Claude Code cũng đã xác nhận đạt sau khi kiểm lại).
3. **Kiểm thử phần lõi Đợt 2 (`.\node_modules\.bin\tsx.cmd --test tests/dot2/noi-dung-thuan.test.mjs tests/dot2/ngu-canh-ai.test.mjs`)**: `8/8` bài test đạt (`DOT2_EXIT=0`).
4. **Kiểm thử phân quyền Đợt 1 (`node scripts/kiem-dot1-quyen.mjs http://localhost:3047`)**: đạt hết cho 4 tài khoản thử (`qt`, `bt`, `cg`, `sl`) và truy cập chưa đăng nhập (`307`).
5. **Kiểm thử đầu cuối bằng trình duyệt Chromium (Playwright) trên `http://localhost:3047`**: đăng nhập lần lượt bằng `bt@xemboi.test`, `cg@xemboi.test`, `sl@xemboi.test`, `qt@xemboi.test` (mật khẩu đọc từ `D:\VibeCode\Antigravity\may-tram\tai-khoan-thu.json`, không ghi ra terminal hay báo cáo), thực hiện đủ quy trình mục 4 bước 4 trên giao diện thật và đối chiếu trạng thái CSDL.

## 3. Kết quả từng bước ở mục 4

1. **Bước 4.1 (`tsc --noEmit`)**: đạt (`TSC_EXIT=0`).
2. **Bước 4.2 (`tests/dot2/noi-dung-thuan.test.mjs`, `tests/dot2/ngu-canh-ai.test.mjs`)**: đạt (`8/8` pass, `DOT2_EXIT=0`).
3. **Bước 4.3 (`scripts/kiem-dot1-quyen.mjs http://localhost:3047`)**: đạt (`qt` 7/7, `bt` 6/7, `cg` 0/7, `sl` 5/7, chưa đăng nhập `307 /quan-tri/dang-nhap`, `DOT1_EXIT=0`).
4. **Bước 4.4 (chạy trên trình duyệt `http://localhost:3047`)**:
   - **`bt` tạo mục từ điển `[THỬ] Sao Thiên Cơ` mảng `A`, gắn `SeoTrang` tạm (`THU-21`), lưu v1 thiếu khối 3**: lưu thành công (`v1`, điểm `60/100`, chuyển `BIEN_TAP`), danh sách lỗi có `THIEU_KHOI`, nút **"Gửi duyệt"** hiển thị ở trạng thái mờ (`disabled`) kèm lý do `"Còn 2 lỗi chặn"`.
   - **`bt` thêm mã `[D:999999999]` vào khối 3 và lưu v2**: lưu được `v2` (`60/100`), thông báo và cột lỗi báo rõ `"Phát hiện mã đoạn bịa ([D:999999999]): đoạn không tồn tại hoặc là nội bộ"`, nhóm **Chặn** có `MA_DOAN_BIA`, nút **"Gửi duyệt"** vẫn bị chặn.
   - **`bt` điền đủ 9 khối (`k5` đánh dấu không áp dụng) kèm đoạn công khai thật `[D:13]`, giao `cg`, bấm "Gửi duyệt"**: lưu `v3` (`90/100`), trích dẫn hiện link tới `/quan-tri/rag/doan/13`, so sánh `v2`–`v3` hiển thị diff, khung xem trước Google hiện đủ máy tính/điện thoại kèm câu `"Mô phỏng gần đúng, Google có thể hiển thị khác."`, nút **"AI soạn"** tắt kèm `"Đợt 2b (chưa bật gọi LLM)"`; giao `cg` (`Thử Chuyên Gia`) thành công; chuyển trạng thái từ `BIEN_TAP` sang `CHO_CHUYEN_GIA` thành công.
   - **`cg` duyệt đồng ý → `DA_DUYET`; `bt` sửa và lưu phiên bản mới**: `cg` đăng nhập lọc `Của tôi` thấy mục `[THỬ]`, gửi kết luận `DONG_Y` trên `v3` → chuyển `DA_DUYET`; sau đó `bt` sửa khối 2 và lưu `v4` → trạng thái tự quay về `CHO_CHUYEN_GIA`; thử **Khôi phục** `v3` tạo phiên bản mới `v5` (không ghi đè bản cũ).
   - **`cg` đồng ý lại → `bt` xuất bản**: `cg` gửi `DONG_Y` trên `v5` → `DA_DUYET`; `bt` bấm **"Xuất bản"** → chuyển `DA_XUAT_BAN`; kiểm tra `SeoTrang` gắn kèm (`THU-21`) có `trangThai = 'XUAT_BAN'` và `noindex = false`.
   - **Kiểm quyền `sl`, `cg` và trang `/quan-tri/nhat-ky`**: `sl` truy cập `/quan-tri/noi-dung` bị chuyển hướng kèm `thieu-quyen=noi_dung.xem` và truy cập `/quan-tri/nhat-ky` bị chuyển hướng kèm `thieu-quyen=nhat_ky.xem`; `cg` không thấy nút/link `"Tạo mới"` (`/quan-tri/noi-dung/moi`) ở cả menu lẫn danh sách; `qt` mở `/quan-tri/nhat-ky?hanhDong=nd.` thấy đủ các dòng `nd.tao`, `nd.luu_phien_ban`, `nd.giao_chuyen_gia`, `nd.chuyen_trang_thai`, `nd.duyet`, bấm dòng mở được JSON `Trước` / `Sau` thụt dòng và trang không có nút sửa/xóa.
   - **Dọn dữ liệu `[THỬ]`**: đã xóa `NoiDung` `[THỬ]` và `SeoTrang` tạm `THU-21`; kiểm lại số bản ghi `[THỬ]` còn lại trong `NoiDung` và `SeoTrang` đều bằng `0`.

## 4. Những gì chưa làm được và lý do

- **Chức năng "AI soạn"**: hiện để nút ở trạng thái tắt kèm chú thích `"Đợt 2b"` và không gọi LLM theo đúng yêu cầu của Lệnh 21.
- **Thử trích dẫn trực tiếp một đoạn `NOI_BO` thật qua trình duyệt**: 32.061 đoạn đã nạp trong CSDL hiện đều thuộc nguồn A (`CONG_KHAI`). Nhánh chặn đoạn `NOI_BO` trong `taoNguCanhAi` đã được kiểm ở `tests/dot2/ngu-canh-ai.test.mjs`, còn qua trình duyệt đã kiểm mã không tồn tại `[D:999999999]` đi qua cùng nhánh `biLoai`.
- **Luồng duyệt pháp lý (`PHAP_LY`) và một số bộ lọc phụ**: chưa tạo ca thử `canDuyetPhapLy = true` và chưa bấm thử từng tổ hợp lọc phụ (`loai`, `tt`, `mang`, `denHan=1` ở `/quan-tri/noi-dung`; `taiKhoanId`, `doiTuong`, `tuNgay`, `denNgay` ở `/quan-tri/nhat-ky`) trên trình duyệt; các phần này đã kiểm kiểu TypeScript và rà logic truy vấn Prisma.

## 5. Đề nghị sửa lõi

- **`src/lib/noi-dung/onpage.ts` (dòng 87–90)**: `chamOnpage` hiện chỉ đưa `loiTrichDan` vào `onpage.loi` khi `loai` là `MUC_TU_DIEN` hoặc `BAI`. Nếu muốn lỗi `MA_DOAN_BIA` hoặc `TRICH_DAI` cũng hiển thị và trừ điểm thống nhất trong `onpage` cho các loại khác (`CONG_CU`, `NGUON_SACH`, `PHUONG_PHAP`, `HUB`), đề nghị đẩy `loiTrichDan` ra ngoài điều kiện `MUC_TU_DIEN || BAI` (chỉ giữ `soTrichHopLe < 1` trong điều kiện đó). Hiện tại ở tầng giao diện (`HienThi.tsx` và `[id]/page.tsx`) đã tự gộp `trichDan.loi` khi tính `demLoiChan` và hiển thị danh sách lỗi cho các loại khác để tránh sót lỗi chặn.
- **`src/lib/noi-dung/onpage.ts` (dòng 92 và 121–123)**: khi lưu phiên bản mới, `coChuyenGiaDuyet` luôn là `false` nên `T10_DUYET` (`CHAN_INDEX`) trừ 10 điểm ngay trong `kiemTra.onpage.diem` lưu trên phiên bản và `SeoTrang.diemOnpage` (vì vậy bản `v3`–`v5` đạt tối đa 90/100 dù không còn lỗi `CHAN`/`CANH_BAO`). Nếu muốn `SeoTrang.diemOnpage` phản ánh điểm sau khi chuyên gia duyệt, có thể tách `coChuyenGiaDuyet` thành cờ riêng không trừ điểm hoặc chấm lại `diemOnpage` lúc duyệt/xuất bản.

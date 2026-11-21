# Báo cáo Lệnh 23: Giao diện liên kết nội bộ và lịch mùa vụ (Đợt 3)

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp

### Tệp tạo mới
- `src/app/quan-tri/(khu)/seo/lien-ket/HienThi.tsx` — Hằng số nhãn tiếng Việt cho loại cảnh báo, mức độ, nguồn/trạng thái liên kết, kiểu quy tắc, cảnh báo anchor; hàm chuẩn hóa `chiTiet` của `SeoCanhBao`; hàm định dạng ngày/giờ Việt Nam (`Asia/Ho_Chi_Minh`) và ngày UTC (`@db.Date`); thành phần `CanhBaoAnchorBadges` dùng chung cho `/quan-tri/seo/lien-ket` và `/quan-tri/seo/trang/[id]`.
- `src/app/quan-tri/(khu)/seo/lien-ket/hanh-dong.ts` — Tệp server action mới (không sửa `seo/hanh-dong.ts`), gồm `xuLyCanhBao` (chuyển `MO` → `DA_XU_LY`/`BO_QUA`, ghi `xuLyLuc`, `xuLyBoiId`, nhật ký `seo.canh_bao`), `chapNhanGoiYLienKet` và `boQuaGoiYLienKet` (chuyển `DE_XUAT` → `DA_DUYET` cho sửa anchor tối đa 200 ký tự, hoặc → `BO_QUA`, không xóa dòng, nhật ký `seo.goi_y_lien_ket`), và `batTatQuyTacLienKet` (đảo `batTat`, nhật ký `seo.quy_tac_lien_ket`). Mọi action đều gọi `yeuCauQuyen('seo.sua')` ở dòng đầu, đọc lại bản ghi và gọi `ghiNhatKy` trong cùng `prisma.$transaction`.
- `src/app/quan-tri/(khu)/seo/lien-ket/page.tsx` — Trang `/quan-tri/seo/lien-ket` (`yeuCauQuyen('seo.xem')` ở dòng đầu), chia 6 tab qua tham số GET `?tab=`:
  - `tong-quan`: các ô `qt-so` từ `CaiDat` khóa `SEO_QUET_LAN_CUOI`, cảnh báo nếu `catNgang = true`, và ô đếm cảnh báo mở theo loại bấm sang tab `canh-bao` đã lọc.
  - `canh-bao`: bảng `SeoCanhBao` trạng thái `MO`, lọc theo `loai` và `mucDo`, phân trang 50 dòng/trang, ẩn thao tác khi thiếu quyền `seo.sua`.
  - `trang`: hai bảng trang `XUAT_BAN` có `soLienKetVao = 0` và trang `doSau > 3`, liên kết sang `/quan-tri/seo/trang/[id]`.
  - `goi-y`: bảng `SeoLienKet` trạng thái `DE_XUAT`, lọc theo `quyTacId` và đường dẫn trang nguồn `q`, 50 dòng/trang, cho phép sửa anchor tối đa 200 ký tự và bấm **Chấp nhận** hoặc **Bỏ qua** trong cùng form (ẩn form khi thiếu quyền `seo.sua`).
  - `anchor`: tối đa 30 trang đích có nhiều liên kết `DANG_CO` vào nhất, gọi `danhGiaAnchor(anchors, trang.tuKhoaChinh?.chuoi)`, hiện 5 loại, anchor hay gặp nhất, cảnh báo tiếng Việt dễ hiểu và ghi chú ngưỡng là giả định.
  - `quy-tac`: bảng `SeoQuyTacLienKet` kèm nút bật/tắt (khi có quyền `seo.sua`), không cho sửa nội dung quy tắc.
- `src/app/quan-tri/(khu)/seo/lich-mua/hanh-dong.ts` — Server action `capNhatLichMua` (`yeuCauQuyen('seo.sua')` ở dòng đầu): đọc lại `SeoLichMua` trong `prisma.$transaction`, cập nhật `trangThai` (`CHUA_LAM | DANG_LAM | XONG | HOAN`) và `ghiChu` (tối đa 2.000 ký tự), ghi nhật ký `seo.lich_mua` có trước/sau. Không có action tạo hay xóa.
- `src/app/quan-tri/(khu)/seo/lich-mua/page.tsx` — Trang `/quan-tri/seo/lich-mua` (`yeuCauQuyen('seo.xem')` ở dòng đầu): bảng `SeoLichMua` sắp theo `hanLenTrang`, tính số ngày còn lại theo giờ Việt Nam (`Asia/Ho_Chi_Minh`), tô đỏ (`.qt-nhan.xau`) khi `< 30` ngày hoặc ghi `"quá hạn"` khi đã qua hạn, kèm form sửa trạng thái và ghi chú cho tài khoản có `seo.sua`.
- `docs/v2/lenh-antigravity/23-bao-cao.md` — Báo cáo này.

### Tệp chỉnh sửa
- `src/app/quan-tri/(khu)/seo/trang/[id]/page.tsx` — Giữ nguyên toàn bộ phần đang có; bổ sung khối `qt-the` **"Liên kết"** ở cuối trang gồm tóm tắt (`doSau`, `soLienKetVao`, `soLienKetRa`, `maHttpLanQuet`, `quetLuc`), cảnh báo `MO` gắn với trang (`SeoCanhBao.trangId`), kết quả `danhGiaAnchor` khi trang là đích, và 2 bảng **Liên kết vào** / **Liên kết ra** (tối đa 100 dòng mỗi bảng, trạng thái `DANG_CO` và `DE_XUAT`, đường dẫn đầu kia bấm sang trang tương ứng).
- `src/app/quan-tri/quan-tri.css` — Thêm các lớp tiền tố `qt-*` (`.qt-lk-tab`, `.qt-lk-form`, `.qt-lk-nut-nho`, `.qt-lk-tom-tat`, `.qt-lk-luoi-2`, `.qt-lm-form`, `.qt-lm-hang`, `.qt-lm-ghichu`) ở cuối tệp.

Không sửa các tệp vùng cấm (`prisma/schema.prisma`, `prisma/migrations/`, `src/lib/**`, `src/middleware.ts`, `src/app/api/**`, `docs/v2/tai-san-xemtuvi/`, `MENU_QUAN_TRI`, `src/app/quan-tri/(khu)/seo/hanh-dong.ts`), không thêm thư viện npm, không chạy migration, không commit.

## 2. Cách đã kiểm

1. **Kiểm tra kiểu TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**: chạy sau lần sửa mã cuối cùng, thoát mã `0` (`TSC=0`).
2. **Kiểm tra phân quyền Đợt 1 (`node scripts/kiem-dot1-quyen.mjs http://localhost:3047`)**: thoát mã `0` (`DOT1=0`).
3. **Rà soát bằng grep trên các thư mục mới/đã sửa và `src/app/quan-tri/quan-tri.css`**: tìm `$queryRawUnsafe`, `$executeRawUnsafe`, `var(--paper)`, `className="so"`, `className="nhan"`, `className="gia-tri"` và các lớp v1 cấm.
4. **Kiểm thử đầu cuối HTTP + Playwright Chromium trên `http://localhost:3047`**: đăng nhập bằng 4 tài khoản thử (mật khẩu đọc từ `D:\VibeCode\Antigravity\may-tram\tai-khoan-thu.json`, không in ra), kiểm tra GET qua cả 4 vai trò + chưa đăng nhập, gửi thẳng Server Action POST bằng cookie của tài khoản xem số liệu (`sl@xemboi.test`) để xác nhận máy chủ tự từ chối, chạy luồng thao tác thực trên trình duyệt Chromium đối với dữ liệu `[THỬ]` (và thao tác thuận/nghịch trên 1 dòng quy tắc và 1 dòng lịch mùa vụ thật), đối chiếu CSDL và `/quan-tri/nhat-ky`, rồi dọn sạch dữ liệu `[THỬ]`.

## 3. Kết quả từng bước ở mục 3

1. **Mục 3.1 (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**: đạt, thoát mã `0` (`TSC=0`).
2. **Mục 3.2 (`node scripts/kiem-dot1-quyen.mjs http://localhost:3047`)**: đạt, thoát mã `0` (`qt@xemboi.test` 13/13, `bt@xemboi.test` 7/13, `cg@xemboi.test` 0/13, `sl@xemboi.test` 6/13, các chuyển hướng `/admin/*` `308`, chưa đăng nhập `307 /quan-tri/dang-nhap`).
3. **Mục 3.3 (chạy trên `http://localhost:3047`)**:
   - **Phân quyền 3 trang (`/quan-tri/seo/lien-ket` cả 6 tab, `/quan-tri/seo/trang/[id]`, `/quan-tri/seo/lich-mua`)**:
     - Quản trị (`qt@xemboi.test`) và biên tập (`bt@xemboi.test`) mở được cả 3 trang (`200`) và thấy đầy đủ các nút/form thao tác.
     - Tài khoản xem số liệu (`sl@xemboi.test`) mở được cả 3 trang (`200`), không thấy bất kỳ nút/form thao tác nào (`Đã xử lý`, `Chấp nhận`, `Đang bật · Tắt`, `qt-lm-form`); khi gửi thẳng `POST` kèm `$ACTION_ID_*` tới các Server Action (`xuLyCanhBao`, `chapNhanGoiYLienKet`/`boQuaGoiYLienKet`, `batTatQuyTacLienKet`, `capNhatLichMua`) bằng cookie của `sl@xemboi.test`, máy chủ đều từ chối (`thieu-quyen=seo.sua`) và CSDL không bị thay đổi.
     - Chuyên gia (`cg@xemboi.test`) bị chặn `307` về `/quan-tri?thieu-quyen=seo.xem`; chưa đăng nhập bị chặn `307` về `/quan-tri/dang-nhap`.
   - **Tab cảnh báo**: hiển thị đúng cảnh báo mồ côi thật `/tu-vi-2027` (`MO_COI`, mức 2). Tạo 2 cảnh báo `[THỬ]` (`MO_COI` và `LOI_HTTP`), bấm **Đã xử lý** trên cảnh báo 1 → `DA_XU_LY` và **Bỏ qua** trên cảnh báo 2 → `BO_QUA`, cả hai đều ghi `xuLyLuc`, `xuLyBoiId` và 2 dòng nhật ký `seo.canh_bao` có `truoc`/`sau` trong `/quan-tri/nhat-ky`.
   - **Tab gợi ý**: tạo 3 `SeoTrang` `[THỬ]` và 2 gợi ý `DE_XUAT` `[THỬ]`; bấm **Chấp nhận** trên gợi ý 1 kèm sửa anchor thành `[THỬ] Anchor mới đã sửa` → chuyển `DA_DUYET` với anchor mới; bấm **Bỏ qua** trên gợi ý 2 → chuyển `BO_QUA` (dòng vẫn giữ nguyên trong CSDL); kiểm có đủ dòng nhật ký `seo.goi_y_lien_ket` với JSON `truoc`/`sau`. Không bấm lên `579` gợi ý thật.
   - **Tab quy tắc & anchor & trang & tổng quan**:
     - Tab `tong-quan` hiển thị đúng thông số `SEO_QUET_LAN_CUOI` (`216` trang, `71 giây`, `200: 216`, `1.970` liên kết nội bộ / `14` ghi CSDL, `209` trang ngoài CSDL, cờ cắt ngang `Không`) và ô đếm cảnh báo mở bấm lọc sang tab `canh-bao`.
     - Tab `trang` hiển thị `/tu-vi-2027` ở bảng mồ côi.
     - Tab `anchor` hiển thị các trang có liên kết `DANG_CO`, đủ 5 loại anchor, anchor hay gặp nhất, cảnh báo tiếng Việt (`Một anchor áp đảo (> 60%)`) và ghi chú ngưỡng là giả định.
     - Tab `quy-tac` hiển thị đủ `8` quy tắc; đã thử bật/tắt 1 quy tắc rồi bật lại như cũ, kiểm ghi nhận nhật ký `seo.quy_tac_lien_ket` và trạng thái trở về `batTat = true`.
   - **Lịch mùa vụ (`/quan-tri/seo/lich-mua`)**: hiển thị đủ `10` dòng thật sắp theo `hanLenTrang`, số ngày còn lại khớp ngày Việt Nam `22/11/2026` (ví dụ `Tết 2027` hạn `07/01/2027` hiện `Còn 46 ngày`). Kiểm hiển thị tô đỏ `.qt-nhan.xau` với `< 30 ngày` (`Còn 10 ngày`) và `quá hạn` bằng 2 dòng `[THỬ]` tạm. Đổi trạng thái dòng `Tết 2027` (`CHUA_LAM` → `DANG_LAM` → `CHUA_LAM`), xác nhận có 2 dòng nhật ký `seo.lich_mua` có `truoc`/`sau` và dòng thật về đúng trạng thái ban đầu.
   - **Trang `/quan-tri/seo/trang/[id]` của `/kien-thuc` (`cmwqpzxzc002t4h5v0svr3yoz`)**: khối "Liên kết" hiển thị đúng độ sâu `1`, số vào `214`, số ra `10`, mã HTTP `200`, bảng liên kết vào (`7` dòng: 5 `DANG_CO` + 2 `DE_XUAT`) và liên kết ra (`11` dòng: 5 `DANG_CO` + 6 `DE_XUAT`), cùng bảng phân bố anchor và cảnh báo `Một anchor áp đảo (> 60%)`.
   - **Trình duyệt không có lỗi JS / console**: `0` console error, `0` page error trên toàn bộ các trang/tab đã mở.
   - **Grep thư mục mới và `quan-tri.css`**: `0` kết quả khớp `$queryRawUnsafe`, `$executeRawUnsafe`, `className="so"`, `className="nhan"`, `className="gia-tri"` hay `var(--paper)`.

## 4. Những gì chưa làm được và lý do

- Các trạng thái hiện chưa phát sinh trong dữ liệu thật trên máy trạm (`catNgang = true`, `QUA_SAU` với `doSau > 3`, `LOI_HTTP`, `NOINDEX_TRONG_SITEMAP`, `CANONICAL_LECH`) mới kiểm ở tầng logic và một phần qua dữ liệu `[THỬ]` (`LOI_HTTP` ở tab cảnh báo; `< 30 ngày` và `quá hạn` ở lịch mùa vụ), chưa có dòng thật ngoài `MO_COI` (`/tu-vi-2027`) để quan sát trực tiếp.
- Mục sửa ghi chú (`ghiChu`) của `SeoLichMua` trên UI thật được giữ nguyên nội dung gốc (chỉ kiểm chuyển trạng thái `CHUA_LAM` → `DANG_LAM` → `CHUA_LAM` trên `Tết 2027` và tham số `ghiChu` ở phép chặn `sl@xemboi.test`).

## 5. Đề nghị sửa lõi

1. **Tránh trùng dòng `DANG_CO` khi quét lại (`src/lib/seo/quet.ts` dòng 249–256)**: khi một gợi ý `QUY_TAC` hoặc `NGU_NGHIA` (`DE_XUAT`/`DA_DUYET`) đã được chèn vào HTML, hàm `quetSite` vừa tạo thêm 1 dòng `nguon = 'QUET', trangThai = 'DANG_CO'`, vừa chuyển dòng gợi ý cũ sang `trangThai = 'DANG_CO'`. Với cùng một cặp `(tuTrangId, denTrangId)`, bảng `SeoLienKet` sẽ có 2 dòng `DANG_CO`, làm nhân đôi anchor trong `danhGiaAnchor` và bảng liên kết của `/quan-tri/seo/trang/[id]`. Đề nghị khi gộp chỉ giữ 1 dòng `DANG_CO` (hoặc đóng gợi ý sang trạng thái hoàn tất riêng thay vì trùng `DANG_CO`).
2. **Bổ sung quan hệ khóa ngoại cho `SeoLienKet.quyTacId` (`prisma/schema.prisma`)**: hiện `quyTacId` là chuỗi trơn chưa có `@relation` tới `SeoQuyTacLienKet`, nên giao diện phải truy vấn thêm bảng quy tắc để ánh xạ tên. Có thể bổ sung ở lần cập nhật lược đồ tiếp theo.

## 6. Xác nhận dọn dữ liệu `[THỬ]`

Đã xóa sạch toàn bộ bản ghi `[THỬ]` sau khi kiểm thử và kiểm tra lại số đếm CSDL:
- `SeoLienKet`: còn nguyên `579` dòng `DE_XUAT` và `14` dòng `DANG_CO` (như ban đầu).
- `SeoCanhBao`: còn nguyên `1` cảnh báo `MO` (`/tu-vi-2027`).
- `SeoQuyTacLienKet`: còn nguyên `8` quy tắc (`batTat = true`).
- `SeoLichMua`: còn nguyên `10` dòng với đúng trạng thái và ghi chú gốc.
- Số bản ghi `[THỬ]` còn lại trong `SeoTrang`, `SeoLichMua`, `SeoCanhBao`, `SeoLienKet`: `0`.

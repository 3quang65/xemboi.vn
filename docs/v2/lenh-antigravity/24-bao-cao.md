# Báo cáo Lệnh 24: Trang xếp hạng Search Console và đánh giá RAG (Đợt 3)

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp

### Tệp tạo mới
- `src/app/quan-tri/(khu)/seo/xep-hang/HienThi.tsx` — Kiểu `BaoCaoGscLuu`, các hàm định dạng số/CTR/ngày (`YYYY-MM-DD` tính theo UTC tránh lệch múi giờ), hàm dựng câu cảnh báo tiếng Việt dễ hiểu cho `TUT_HANG` (`vi_tri`, `nhap`) và `TRUNG_Y_DINH`, cùng thành phần biểu đồ đường SVG tự vẽ `BieuDoGscSvg` (`720×200`, 2 trục hiển thị/nhấp, nhãn ngày thưa, dùng biến CSS quản trị).
- `src/app/quan-tri/(khu)/seo/xep-hang/hanh-dong.ts` — Server action `xuLyCanhBaoGsc` (`yeuCauQuyen('seo.sua')` ở dòng đầu): đọc lại bản ghi `SeoCanhBao` trong `prisma.$transaction`, kiểm tra trạng thái `MO` và nguồn `gsc`, cập nhật `DA_XU_LY`/`BO_QUA` kèm `xuLyLuc`, `xuLyBoiId`, và ghi nhật ký `seo.canh_bao` có trước/sau trong cùng giao dịch.
- `src/app/quan-tri/(khu)/seo/xep-hang/page.tsx` — Trang `/quan-tri/seo/xep-hang` (`yeuCauQuyen('seo.xem')` ở dòng đầu), chia 4 tab qua `?tab=` (`tong-quan`, `trang`, `truy-van`, `canh-bao`) và khoảng ngày `?ngay=7|28|90` tính lùi từ ngày mới nhất có dữ liệu:
  - Khung chung: dòng thông tin từ `SEO_GSC_LAN_CUOI`, dải vàng khi `thu: true`, hộp báo khi chưa có khóa.
  - `tong-quan`: 4 ô `qt-so` (hiển thị, nhấp, CTR, vị trí trung bình có trọng số theo lượt hiển thị) kèm chênh lệch và mũi tên so với khoảng liền trước, biểu đồ SVG theo ngày, bảng đếm cảnh báo mở bấm sang tab `canh-bao`.
  - `trang`: bảng URL từ `SeoGscTrangNgay` (50 dòng/trang, sắp theo `?sap=`, lọc thiết bị `?tb=`), liên kết `/quan-tri/seo/trang/[id]` khi có `trangId`, mở chi tiết `?tab=trang&url=...` hiện biểu đồ URL, bảng truy vấn từ `SeoGscNgay` và ghi chú ẩn truy vấn hiếm.
  - `truy-van`: bảng `truyVan` từ `SeoGscNgay` (50 dòng/trang, tìm `?q=` qua `Prisma.sql`, lọc thiết bị, sắp cột), bấm truy vấn (hoặc tự mở khi lọc `?q=` khớp 1 truy vấn) hiện phân bổ URL kèm `%` hiển thị, tô vàng `.qt-xg-vang` và gắn nhãn `"có thể trùng ý định"` khi URL thứ hai `≥ 20%`.
  - `canh-bao`: lọc theo loại GSC, hiện câu tiếng Việt, nút **Đã xử lý** / **Bỏ qua** (ẩn khi thiếu `seo.sua`) và ghi chú ngưỡng giả định.
- `src/app/quan-tri/(khu)/rag/danh-gia/HienThi.tsx` — Hàm phân tích cấu hình/chi tiết `rag_danh_gia`, nhận diện cấu hình `"đang dùng trên VPS"` (`moHinhNhung = 'khong'`, `vietLai = MO_HINH_VIET_LAI` đọc từ `@/lib/rag/viet-lai-cau`, không có `capChuCauMau`), bỏ tiền tố `gx/`, nhãn mảng/độ khó, regex `^Q\d{3}$`.
- `src/app/quan-tri/(khu)/rag/danh-gia/du-lieu.ts` — Hàm `docDoKhoCsv()` đọc `docs/v2/rag-cau-hoi-chuan.csv` bằng `docCsv` (`src/lib/rag/danh-gia.ts`) trên máy chủ để lấy `do_kho` theo mã câu (trả map rỗng nếu thiếu tệp).
- `src/app/quan-tri/(khu)/rag/danh-gia/hanh-dong.ts` — Tệp server action mới (không sửa `rag/hanh-dong.ts`, chỉ dùng `prisma.ragCauHoiChuan` không SQL thô): `suaGhiChuCauHoi` và `xoaCauHoiChuan`. Cả hai đều gọi `yeuCauQuyen('rag.sua_doan')` ở dòng đầu, chặn mọi mã khớp `^Q\d{3}$`, đọc lại và gọi `ghiNhatKy(..., 'rag.cau_hoi_chuan', 'RagCauHoiChuan', ...)` trong cùng `prisma.$transaction`.
- `src/app/quan-tri/(khu)/rag/danh-gia/NutXoaCauHoi.tsx` — Thành phần client hiển thị nút **Xóa** có hộp thoại xác nhận `window.confirm` trước khi gửi `xoaCauHoiChuan`.
- `src/app/quan-tri/(khu)/rag/danh-gia/page.tsx` — Trang `/quan-tri/rag/danh-gia` (`yeuCauQuyen('rag.xem_cong_khai')` ở dòng đầu), chia tab qua `?tab=` (`bang`, `so-sanh`, `cau`, `cau-hoi`, kèm tab phụ `lan`):
  - `bang`: gom nhóm theo `(moHinhNhung, cauHinh.ten)` lấy lần mới nhất kèm link `"N lần chạy"` sang `?tab=lan&ten=...`, sắp theo `hit@10` giảm dần và cho đổi cột sắp, tô nổi `.qt-dg-tot-nhat`, gắn nhãn `"đang dùng trên VPS"`, kèm 4 dòng chú thích định nghĩa chỉ số.
  - `so-sanh`: chọn A/B mặc định là VPS và tốt nhất, lọc mảng, đếm B hơn / A hơn / bằng nhau (`null` tệ nhất) và liệt kê bảng các câu khác nhau kèm độ khó từ CSV.
  - `cau`: xem chi tiết câu hỏi (`?ma=Q001`), đoạn đúng (200 chữ đầu + mã nguồn), bảng hạng qua mọi cấu hình mới nhất và `top5` của cấu hình `?ch=` (120 chữ đầu, đoạn đúng tô xanh `.qt-dg-dung`). Dùng `dieuKienPhamVi(nd)` để chặn đoạn `NOI_BO` ở tầng truy vấn; nếu thiếu `rag.xem_noi_bo` chỉ hiện `"(nội bộ)"`.
  - `cau-hoi`: danh sách `rag_cau_hoi_chuan` (50 dòng/trang, lọc mảng, độ khó từ CSV), ghi chú đầu trang về CSV chính thức, chỉ câu khác `^Q\d{3}$` mới có nút sửa ghi chú và **Xóa**.
- `src/app/quan-tri/(khu)/rag/thu/hanh-dong.ts` — Server action `luuCauHoiChuan` (`yeuCauQuyen('rag.sua_doan')` ở dòng đầu): kiểm tra độ dài câu hỏi (≤ 500), ghi chú (≤ 1.000), mảng hợp lệ và số đoạn (1–10), đọc lại các đoạn từ `prisma.ragDoan` trong `prisma.$transaction` để tự rút `nguonDungMa`, sinh mã `G000001…` tăng dần, tạo `RagCauHoiChuan`, ghi nhật ký `rag.cau_hoi_chuan` trong cùng giao dịch rồi chuyển về `/quan-tri/rag/danh-gia?tab=cau-hoi`.
- `src/app/quan-tri/(khu)/rag/thu/KetQuaVaLuuCauHoi.tsx` — Thành phần client bổ sung ô chọn đoạn đúng (tối đa 10 ô) cạnh mỗi dòng kết quả và khối form **"Lưu thành câu hỏi chuẩn"** ngay dưới bảng kết quả khi người xem có quyền `rag.sua_doan`.
- `docs/v2/lenh-antigravity/24-bao-cao.md` — Báo cáo này.

### Tệp chỉnh sửa
- `src/app/quan-tri/(khu)/rag/thu/page.tsx` — Giữ nguyên toàn bộ logic tìm kiếm đang có; chỉ bổ sung kiểm quyền `rag.sua_doan`, `<ThongBao>`, và truyền danh sách kết quả xuống `KetQuaVaLuuCauHoi`.
- `src/app/quan-tri/quan-tri.css` — Thêm các lớp tiền tố `qt-*` (`.qt-xg-chenh`, `.qt-xg-tot`, `.qt-xg-xau`, `.qt-xg-bieu-do`, `.qt-xg-chu-giai`, `.qt-xg-cham`, `.qt-xg-vang`, `.qt-dg-tot-nhat`, `.qt-dg-dung`, `.qt-dg-chon`, `.qt-dg-chu-thich`, `.qt-dg-form-luu`, `.qt-dg-luoi-2`) ở cuối tệp.

Không sửa các tệp vùng cấm (`prisma/schema.prisma`, `prisma/migrations/`, `src/lib/**`, `src/middleware.ts`, `src/app/api/**`, `docs/v2/tai-san-xemtuvi/`, `scripts/**`, `docs/v2/rag-cau-hoi-chuan.csv`, `MENU_QUAN_TRI`, `src/app/quan-tri/(khu)/seo/hanh-dong.ts`, `src/app/quan-tri/(khu)/rag/hanh-dong.ts`), không thêm thư viện npm, không chạy migration, không commit.

## 2. Cách đã kiểm

1. **Kiểm tra kiểu TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**: chạy sau lần sửa mã cuối cùng, thoát mã `0` (`TSC_EXIT=0`).
2. **Kiểm tra phân quyền Đợt 1 (`node scripts/kiem-dot1-quyen.mjs http://localhost:3047`)**: thoát mã `0` (`DOT1_EXIT=0`).
3. **Rà soát bằng grep (`Select-String`)** trên `src/app/quan-tri/(khu)/seo/xep-hang`, `src/app/quan-tri/(khu)/rag/danh-gia`, `src/app/quan-tri/(khu)/rag/thu`, và `src/app/quan-tri/quan-tri.css`: tìm `$queryRawUnsafe`, `$executeRawUnsafe`, `var(--paper)`, `className="so"`, `className="nhan"`, `className="gia-tri"`.
4. **Kiểm thử HTTP phân quyền + Server Action + Playwright Chromium trên `http://localhost:3047`**:
   - Đăng nhập bằng 4 tài khoản thử (đọc từ `D:\VibeCode\Antigravity\may-tram\tai-khoan-thu.json`, không in mật khẩu), kiểm tra GET cho cả 4 vai trò và chưa đăng nhập.
   - Gửi thẳng `POST` dạng `multipart/form-data` kèm `$ACTION_ID_*` tới `xuLyCanhBaoGsc` và `luuCauHoiChuan` bằng cookie của tài khoản xem số liệu (`sl@xemboi.test`).
   - Mở trình duyệt Chromium (Playwright) thao tác thực tế qua tất cả các tab của `/quan-tri/seo/xep-hang`, `/quan-tri/rag/danh-gia`, và luồng tạo → sửa ghi chú → xóa câu hỏi chuẩn `[THỬ]` từ `/quan-tri/rag/thu`, đối chiếu số liệu hiển thị với `docs/v2/bao-cao-danh-gia-rag.md`, bảng `rag_danh_gia.chiTiet` và bảng `NhatKyThaoTac` trong Postgres.

## 3. Kết quả từng bước ở mục 3

1. **Mục 3.1 (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**: đạt, thoát mã `0` (`TSC_EXIT=0`).
2. **Mục 3.2 (`node scripts/kiem-dot1-quyen.mjs http://localhost:3047`)**: đạt, thoát mã `0` (`qt@xemboi.test` 15/15, `bt@xemboi.test` 9/15, `cg@xemboi.test` 0/15, `sl@xemboi.test` 8/15, 5 chuyển hướng `/admin/*` trả `308`, chưa đăng nhập `307 /quan-tri/dang-nhap`).
3. **Mục 3.3 (trên `http://localhost:3047`)**:
   - **Quyền**:
     - `qt@xemboi.test`, `bt@xemboi.test` mở được `/quan-tri/seo/xep-hang` (`200`, có nút cảnh báo) và `/quan-tri/rag/danh-gia` (`200`).
     - `sl@xemboi.test` mở được `/quan-tri/seo/xep-hang` (`200`), không thấy nút **Đã xử lý** / **Bỏ qua**; khi gửi thẳng `POST` với `$ACTION_ID_*` tới `xuLyCanhBaoGsc` hoặc `luuCauHoiChuan`, máy chủ đều từ chối (`303 /quan-tri?thieu-quyen=seo.sua` và `303 /quan-tri?thieu-quyen=rag.sua_doan`), CSDL giữ nguyên không đổi.
     - `cg@xemboi.test` bị chặn ở `/quan-tri/seo/xep-hang` (`307 /quan-tri?thieu-quyen=seo.xem`), nhưng mở được `/quan-tri/rag/danh-gia` (`200`, xem được `Q001`).
     - `sl@xemboi.test` bị chặn ở `/quan-tri/rag/danh-gia` (`307 /quan-tri?thieu-quyen=rag.xem_cong_khai`) và `/quan-tri/rag/thu` (`307`).
     - Chưa đăng nhập bị chuyển `307 /quan-tri/dang-nhap` trên cả 3 trang.
   - **`/quan-tri/seo/xep-hang`**:
     - Hiện đúng dải cảnh báo vàng: `Dữ liệu GIẢ để thử giao diện — [THỬ] dữ liệu giả từ scripts/thu-gsc-gia.ts`.
     - Tab `tong-quan`: có đủ 4 ô `qt-so` và biểu đồ SVG (`2` đường `polyline`); tại `ngay=28` hiển thị `14.511` / `1.879` / `12,95%` / `6,0`, khi đổi sang `ngay=7` đổi thành `3.506` / `133` / `3,79%` / `7,2`.
     - Tab `trang`: hiện đúng 3 URL `https://xemboi.vn/_thu-gsc/{b,a,c}`; mở chi tiết URL có biểu đồ SVG theo ngày, bảng truy vấn và ghi chú `"Tổng theo truy vấn nhỏ hơn tổng theo trang vì Google ẩn truy vấn hiếm."`.
     - Tab `truy-van` với `q=xem tuổi`: hiện 2 URL (`https://xemboi.vn/_thu-gsc/a` và `https://xemboi.vn/_thu-gsc/c`), URL thứ hai (`846` hiển thị, `33,5%`) được tô vàng (`.qt-xg-vang`) và có nhãn `"có thể trùng ý định"`.
     - Tab `canh-bao`: hiện đủ 4 cảnh báo GSC bằng câu tiếng Việt; bấm **Bỏ qua** trên 1 cảnh báo giả → còn 3 cảnh báo mở, hiện thông báo `"Đã bỏ qua cảnh báo GSC"` và có dòng `seo.canh_bao` trong `/quan-tri/nhat-ky`.
   - **`/quan-tri/rag/danh-gia`**:
     - Tab `bang`: hiển thị đủ `29` cấu hình (lấy lần mới nhất mỗi cặp mô hình + tên), trong đó dòng cao nhất `0,87 (87,0%)` là `Qwen/Qwen3-Embedding-0.6B@97b0c614be4d` · `vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu)` được tô nổi `.qt-dg-tot-nhat` (`Cao nhất`), và dòng `"đang dùng trên VPS"` là `khong` · `từ khóa + mở rộng + qwen3.6-35b-nvfp4` đạt `0,72 (72,0%)`; các số liệu khớp `docs/v2/bao-cao-danh-gia-rag.md`; bấm link `"2 lần chạy"` (vd. `"từ khóa, không mở rộng"`) mở `?tab=lan` hiện đủ `2` lần chạy.
     - Tab `so-sanh`: hai cấu hình mặc định là A (`khong · từ khóa + mở rộng + qwen3.6-35b-nvfp4`, hit@10 `0,72`) và B (`Qwen/Qwen3-Embedding-0.6B@97b0c614be4d · vector + mở rộng + DeepSeek-V4.1-Flash-1017 (câu mẫu)`, hit@10 `0,87`), kết quả: **Tổng câu = 100, B hơn A = 48, A hơn B = 21, Bằng nhau = 31**. Đối chiếu 3 câu bất kỳ với `rag_danh_gia.chiTiet` trong CSDL đều khớp hoàn toàn:
       - `Q001`: hạng A = `#35`, hạng B = `#2` (`chiTiet` CSDL: `hangA = 35`, `hangB = 2`);
       - `Q002`: hạng A = `#20`, hạng B = `#58` (`chiTiet` CSDL: `hangA = 20`, `hangB = 58`);
       - `Q003`: hạng A = `#4`, hạng B = `#1` (`chiTiet` CSDL: `hangA = 4`, `hangB = 1`).
     - `?tab=cau&ma=Q001`: hiện đủ `3` đoạn đúng (`#21`, `#60`, `#265` kèm nguồn `WS01` và 200 chữ đầu) và `top5` của cấu hình tốt nhất (hạng `#1`–`#5`, đoạn `#60` tô xanh `.qt-dg-dung`).
   - **`/quan-tri/rag/thu` → lưu câu hỏi chuẩn**:
     - Tạo câu `[THỬ] Thiên Lương ở Ngọ`, chọn mảng `tu-vi` và 2 đoạn (`#264`, `#175`), bấm **Lưu thành câu hỏi chuẩn** → chuyển về `/quan-tri/rag/danh-gia?tab=cau-hoi`, sinh `G000001` với `nguonDungMa = ["WS01"]` tự đọc từ CSDL và ghi nhật ký `rag.cau_hoi_chuan` (`id=220`).
     - Thử sửa ghi chú của `G000001` → lưu thành công và ghi nhật ký (`id=223`).
     - Bấm nút **Xóa** trên `G000001` và xác nhận `confirm("Xóa câu hỏi chuẩn G000001?")` → xóa khỏi CSDL, ghi nhật ký xóa (`sau: null`, `id=224`).
     - Trên toàn bộ các câu `Q001–Q100` ở tab `cau-hoi`: `0` nút **Xóa** (`xoaBtnOnQ = 0`).
   - **Lỗi trình duyệt**: `0` console error, `0` page error trên toàn bộ các trang đã kiểm.
   - **Grep**: `0` kết quả cho `$queryRawUnsafe`, `$executeRawUnsafe`, `className="so"`, `className="nhan"`, `className="gia-tri"`, `var(--paper)`.

## 4. Những gì chưa làm được và lý do

- **Kiểm trực quan đoạn `NOI_BO` trên `/quan-tri/rag/danh-gia?tab=cau`**: trên CSDL máy trạm hiện tại cả `32.061` đoạn trong `rag_doan` đều có `phamVi = CONG_KHAI` (`NOI_BO = 0`). Nhánh ẩn nội dung `"(nội bộ)"` khi thiếu quyền `rag.xem_noi_bo` được bảo đảm bằng điều kiện truy vấn `dieuKienPhamVi(nd)` và nhánh `anNoiBo` trong `src/app/quan-tri/(khu)/rag/danh-gia/page.tsx`, chưa có đoạn `NOI_BO` thật trên máy trạm để quan sát trực tiếp.
- **Dữ liệu Search Console thật và liên kết `trangId` trên `/quan-tri/seo/xep-hang`**: do chưa có khóa dịch vụ GSC thật, toàn bộ 45 ngày dữ liệu trên máy trạm là dữ liệu giả (`trangId = null`). Trường hợp `trangId != null` (hiển thị liên kết sang `/quan-tri/seo/trang/[id]`) và trạng thái chưa có khóa `SEO_GSC_LAN_CUOI` đã cài trong mã nhưng chưa có bản ghi thật tương ứng để quan sát trực tiếp.
- **Thử tạo câu hỏi chuẩn kèm LLM viết lại**: khi kiểm luồng tạo `[THỬ] Thiên Lương ở Ngọ` từ `/quan-tri/rag/thu`, đã chạy truy vấn với `&vietLai=0` để cho kết quả tức thì và ổn định; logic tìm mặc định của `rag/thu` giữ nguyên như ban đầu.

## 5. Đề nghị sửa lõi

Không có đề nghị bắt buộc sửa phần lõi. Lưu ý nhỏ về sai số làm tròn khi đối chiếu `docs/v2/bao-cao-danh-gia-rag.md`: ở cấu hình `BAAI/bge-m3` · `vector + mở rộng + qwen3.8-flash-next (câu mẫu)`, giá trị `recallAt10` trong CSDL là `0.3965`; script báo cáo dùng `(x * 100).toFixed(1)` ra `39.6`, trong khi `toLocaleString('vi-VN')` trên giao diện làm tròn nửa lên thành `39,7%`.

## 6. Xác nhận dọn dữ liệu `[THỬ]` và nạp lại dữ liệu GSC giả

- **Câu hỏi chuẩn `[THỬ]`**: đã xóa `G000001` bằng nút **Xóa** trên giao diện; kiểm tra lại bảng `rag_cau_hoi_chuan` còn đúng `100` dòng (`Q001–Q100`), `0` dòng `[THỬ]` hoặc mã `G…`.
- **Dữ liệu GSC giả**: sau khi bấm thử "Bỏ qua", đã chạy lại `.\node_modules\.bin\tsx.cmd --env-file=.env scripts/thu-gsc-gia.ts`, xác nhận đã nạp lại đủ `450` dòng `SeoGscNgay`, `270` dòng `SeoGscTrangNgay` và `4` cảnh báo GSC mở (`3` `TUT_HANG`, `1` `TRUNG_Y_DINH`) cho phiên duyệt tiếp theo.

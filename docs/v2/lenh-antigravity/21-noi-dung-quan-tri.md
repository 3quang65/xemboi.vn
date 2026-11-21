# Lệnh 21: trang quản trị Nội dung (Đợt 2) và trang Nhật ký

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity. Báo cáo ghi vào `docs/v2/lenh-antigravity/21-bao-cao.md`.

Đọc trước:
- `docs/v2/00-BAN-CU-BAN-MOI.md`, nhất là mục "Bẫy CSS";
- `docs/v2/17-backend-quan-tri.md`, mục 2 (Nội dung), mục 1.2.2 và 1.2.3 (onpage, xem trước Google), mục 5.2 (nhật ký);
- `docs/v2/07-bach-khoa-huyen-hoc.md`, mục 2.3 (9 khối).

## 1. Phần lõi đã có sẵn: chỉ GỌI, không sửa

Claude Code đã viết và test xong `src/lib/noi-dung/` (test: `tests/dot2/`):

| Tệp | Dùng để |
|---|---|
| `khoi.ts` | `KHOI` (tên 9 khối, tầng đọc), `kiemDuKhoi(khoi)`, `noiKhoi(khoi)`, kiểu `KhoiMuc` (`k1…k9` là markdown, `k5KhongApDung?: boolean`), `LoiNoiDung` |
| `trich-dan.ts` | `kiemTrichDan({ khoi \| than, doanDaGui })` → `{ dat, loi, maHopLe }`; `timMaDoan(s)` tìm `[D:số]` |
| `quy-trinh.ts` | `kiemChuyen(tu, den, nguCanh)` → `{ duoc, lyDo }`; `trangThaiSauKhiLuu(hienTai, nguonTao)`; `phaiNoindex(phienBanXuatBanId, duyet)`; `dongYTren(...)` |
| `onpage.ts` | `chamOnpage(dauVao)` → `{ diem, loi, chan, chanIndex }`; `uocBeRong(title)` để cắt title ở khung xem trước |
| `ngu-canh-ai.ts` | `taoNguCanhAi(db, maDoan)` → chỉ lấy đoạn từ view công khai; mã bị loại nằm trong `biLoai` |

Quyền (đã thêm vào `src/lib/quan-tri/quyen.ts`, menu "Nội dung" đã có): `noi_dung.xem`, `noi_dung.soan`, `noi_dung.duyet`, `noi_dung.xuat_ban`.

## 2. Việc cần làm

Mọi trang nằm trong `src/app/quan-tri/(khu)/noi-dung/`. Server action để chung trong `src/app/quan-tri/(khu)/noi-dung/hanh-dong.ts`.

### 2.1. `/quan-tri/noi-dung`: danh sách (quyền `noi_dung.xem`)
- Bảng: tiêu đề, loại, mảng, trạng thái, phiên bản mới nhất, điểm onpage của phiên bản đó (lấy từ `kiemTra.onpage.diem`), biên tập, chuyên gia, hạn cập nhật.
- Lọc GET: loại, trạng thái, mảng, "của tôi" (chuyên gia: mục giao cho mình), "đến hạn cập nhật".
- Phân trang 50 dòng.

### 2.2. `/quan-tri/noi-dung/moi`: tạo mới (quyền `noi_dung.soan`)
- Nhập loại, tiêu đề, mảng (nhiều giá trị). Có thể chọn một `SeoTrang` chưa gắn nội dung (`noiDungId` null), tìm theo mã trang hoặc đường dẫn.
- Tạo `NoiDung` ở trạng thái `NHAP`, `bienTapId` là người tạo. Nếu chọn trang thì gắn `SeoTrang.noiDungId`. Ghi nhật ký `nd.tao`.

### 2.3. `/quan-tri/noi-dung/[id]`: soạn và duyệt
- **Ô soạn:**
  - `MUC_TU_DIEN`: 9 ô theo `KHOI`, chia hai tầng "Đọc nhanh" (k1–k3) và "Đọc sâu" (k4–k8), rồi k9. k5 có ô tích "Không áp dụng".
  - Loại khác: một ô markdown `than`.
  - Một ô "Ghi chú phiên bản".
- **Nút "Lưu phiên bản"** (`noi_dung.soan`). Server action làm trong một `prisma.$transaction`:
  1. Tìm mọi mã `[D:n]` trong nội dung. Lấy đoạn bằng `taoNguCanhAi(tx, maDoan)`.
  2. Chạy `kiemTrichDan` với `doanDaGui` = các đoạn vừa lấy. Mã nằm trong `biLoai` phải báo lỗi rõ: "đoạn không tồn tại hoặc là nội bộ".
  3. Chạy `chamOnpage`:
     - title, meta, h1, canonical, JSON-LD lấy từ `SeoTrang` gắn kèm. Tên trường trong lược đồ:
       - `title`, `metaDescription`, `h1`, `canonical`;
       - JSON-LD ở `schemaJsonLd` (kiểu Json, truyền vào dạng `JSON.stringify`);
       - từ khóa chính ở `tuKhoaChinh.chuoi`;
       - `duongDan`;
     - từ cấm lấy bằng `layTuCam(tx)`;
     - `soTrichHopLe = maHopLe.length`;
     - `coChuyenGiaDuyet = false` (phiên bản mới chưa ai duyệt).
  4. Tạo `NoiDungPhienBan`:
     - `so` = lớn nhất + 1, `nguonTao: 'TAY'`, `taoBoiId`;
     - `kiemTra = { onpage, trichDan }`.
  5. Tạo các dòng `NoiDungTrichDan` từ `maHopLe`, với `kieu: 'TOM_Y'`, `doanId`, `khoi` = số của khối.
  6. Đổi trạng thái theo `trangThaiSauKhiLuu`.
  7. Ghi nhật ký `nd.luu_phien_ban`.
- **Cột phải:**
  - **Điểm onpage và danh sách lỗi**, chia nhóm Chặn, Chặn index, Cảnh báo, Cộng.
  - **Xem trước Google**, khung máy tính và khung điện thoại, theo 17 mục 1.2.3. Cắt title theo `uocBeRong` ≤ 580 px, meta theo 158 ký tự. Ghi rõ dòng chữ: "Mô phỏng gần đúng, Google có thể hiển thị khác".
- **Nút chuyển trạng thái:**
  - Chỉ hiện các nút mà `kiemChuyen` trả `duoc: true`.
  - Nút bị chặn thì hiện mờ, kèm `lyDo`.
  - Server action **gọi lại `kiemChuyen` ở server** trước khi ghi, không tin dữ liệu từ form.
  - Khi chuyển sang `DA_XUAT_BAN`:
    - đặt `phienBanXuatBanId` = phiên bản mới nhất và `ngayXuatBan`;
    - đặt `SeoTrang.trangThai = 'XUAT_BAN'`;
    - đặt `SeoTrang.noindex` = `phaiNoindex(...)`.
  - Ghi nhật ký `nd.chuyen_trang_thai` với trước/sau.
- **Giao chuyên gia** (`noi_dung.soan`): chọn trong các `TaiKhoan` thỏa cả ba điều kiện:
  - `vaiTro` chứa `CHUYEN_GIA_DUYET`;
  - `dangHoatDong = true`;
  - `mangDuyet` giao với `NoiDung.mang`.
- **Form duyệt** (`noi_dung.duyet`, chỉ khi người đang xem là `chuyenGiaId`):
  - Kết luận: Đồng ý / Yêu cầu sửa / Từ chối, kèm nhận xét.
  - Ghi `NoiDungDuyet` với `vaiTro: 'CHUYEN_GIA'` và `phienBanId` = phiên bản mới nhất.
  - Sau đó tự chuyển: Đồng ý → `DA_DUYET`, Yêu cầu sửa → `CAN_SUA`, Từ chối → `CAN_SUA`. Phải qua `kiemChuyen`.
  - Nếu `canDuyetPhapLy`, quản trị có thêm một form ghi `vaiTro: 'PHAP_LY'`.
- **Lịch sử phiên bản:**
  - Danh sách các phiên bản (số, người tạo hoặc AI, lúc, điểm).
  - **So sánh hai phiên bản theo từng khối**: diff theo dòng, tự viết hàm diff đơn giản, không thêm thư viện.
  - **Khôi phục**: tạo phiên bản mới bằng nội dung cũ, đi qua đúng luồng "Lưu phiên bản". Không ghi đè.
- **Trích dẫn của phiên bản đang xem:** bảng mã đoạn, nguồn, khối. Bấm vào mở `/quan-tri/rag/doan/<id>`.
- Nút "AI soạn": hiện ở trạng thái tắt, kèm dòng "Đợt 2b". **Không gọi LLM** trong lệnh này.

### 2.4. `/quan-tri/nhat-ky`: nhật ký thao tác (quyền `nhat_ky.xem`)
- Menu đã có mục này nhưng trang chưa có.
- Bảng `NhatKyThaoTac`, mới nhất trước: lúc, tài khoản (email), hành động, đối tượng và mã, IP. Bấm một dòng để mở chi tiết trước/sau, dạng JSON có thụt dòng.
- Lọc GET: hành động (tiền tố, ví dụ `nd.`), tài khoản, đối tượng, khoảng ngày. Phân trang 100 dòng.
- **Chỉ đọc.** Không có nút sửa hay xóa.

## 3. Quy tắc bắt buộc

1. **Không sửa:**
   - `prisma/schema.prisma`, `prisma/migrations/`;
   - `src/lib/quan-tri/`, `src/lib/noi-dung/`, `src/lib/seo/`, `src/lib/rag/`;
   - `src/middleware.ts`, `src/lib/core/`, `docs/v2/tai-san-xemtuvi/`;
   - mọi tệp v1.

   Thấy cần đổi phần lõi thì ghi vào báo cáo, mục "Đề nghị sửa lõi".
2. Mọi page và mọi server action gọi `yeuCauQuyen(...)` ở **dòng đầu**. Ghi `ghiNhatKy(tx, nd, ...)` **trong cùng giao dịch** với thao tác.
3. SQL thô chỉ dùng `prisma.$queryRaw` dạng template có tham số. Cấm `$queryRawUnsafe` và `$executeRawUnsafe`.
4. **CSS:**
   - chỉ dùng lớp `qt-*` trong `src/app/quan-tri/quan-tri.css`;
   - ô số liệu: `qt-so`, `qt-so-nhan`, `qt-so-gt`; cột số: `qt-cot-so`;
   - nền nhạt: `var(--line)`;
   - **cấm** các lớp `so`, `nhan`, `gia-tri` và biến `var(--paper)`.

   Cần lớp mới thì thêm vào cuối `quan-tri.css` với tiền tố `qt-`.
5. Không thêm thư viện npm. Không chạy migration. Không chạy lệnh git làm đổi lịch sử, không commit.
6. Không xóa dữ liệu thật. Dữ liệu thử phải tạo với tiêu đề bắt đầu bằng `[THỬ]`, xong thì xóa.

## 4. Kiểm trước khi báo xong

1. `.\node_modules\.bin\tsc.cmd --noEmit -p .` thoát mã 0.
2. `npx tsx --test tests/dot2/noi-dung-thuan.test.mjs tests/dot2/ngu-canh-ai.test.mjs` đạt hết.
3. `node scripts/kiem-dot1-quyen.mjs http://localhost:3047` vẫn đạt. Mật khẩu tài khoản thử ở `D:\VibeCode\Antigravity\may-tram\tai-khoan-thu.json`; **không in mật khẩu** ra báo cáo hay terminal.
4. Chạy tay trên `http://localhost:3047` các bước sau, ghi kết quả vào báo cáo:
   - bt tạo mục từ điển `[THỬ]` với mảng `A` (cg chỉ được giao mảng `A`), thiếu khối 3 → nút "Gửi duyệt" bị chặn, có lý do;
   - thêm mã `[D:999999999]` → lưu được nhưng báo "mã đoạn bịa", điểm có lỗi Chặn;
   - đủ khối, giao cg, gửi duyệt;
   - cg đồng ý → `DA_DUYET`; bt sửa và lưu phiên bản mới → trạng thái quay về `CHO_CHUYEN_GIA`;
   - cg đồng ý lại → bt xuất bản; `SeoTrang` gắn kèm có `noindex=false` vì đã có chuyên gia đồng ý;
   - sl không vào được `/quan-tri/noi-dung`; cg không thấy nút "Tạo mới";
   - xóa dữ liệu `[THỬ]`.
5. Báo cáo `21-bao-cao.md` gồm: danh sách tệp, cách đã kiểm, kết quả từng bước ở mục 4, những gì chưa làm được và lý do, đề nghị sửa lõi (nếu có).

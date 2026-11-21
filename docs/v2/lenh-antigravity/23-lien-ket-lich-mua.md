# Lệnh 23: giao diện liên kết nội bộ và lịch mùa vụ (Đợt 3)

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity. Báo cáo ghi vào `docs/v2/lenh-antigravity/23-bao-cao.md`.

Đọc trước:
- `docs/v2/00-BAN-CU-BAN-MOI.md`, nhất là mục "Bẫy CSS";
- `docs/v2/17-backend-quan-tri.md` mục 1.3 (internal link), 1.6 (lịch mùa vụ), 7.1 (danh sách trang);
- phần lõi Claude Code đã làm (chỉ đọc, **không sửa**):
  - `src/lib/seo/quet.ts`: bộ quét. Kết quả nằm ở `SeoTrang.doSau / soLienKetVao / soLienKetRa / maHttpLanQuet / quetLuc`, bảng `SeoLienKet` (nguon `QUET`, trangThai `DANG_CO`), bảng `SeoCanhBao` (loai `MO_COI`, `QUA_SAU`, `LOI_HTTP`, `NOINDEX_TRONG_SITEMAP`, `CANONICAL_LECH`; `chiTiet.nguon = 'quet'`). Báo cáo lần quét cuối: `CaiDat` khóa `SEO_QUET_LAN_CUOI`;
  - `src/lib/seo/quy-tac-lien-ket.ts`: quy tắc `SeoQuyTacLienKet` và gợi ý `SeoLienKet` nguon `QUY_TAC`, trangThai `DE_XUAT`, có `quyTacId`;
  - `src/lib/seo/anchor.ts`: `danhGiaAnchor(anchors, tuKhoaChinh)` trả số theo loại và cảnh báo.
- mẫu đã có: `src/app/quan-tri/(khu)/seo/chuyen-huong/` và `seo/trang/[id]/` (cách dùng `ThongBao`, `hanh-dong.ts`, lọc GET, phân trang).

Dữ liệu thật ở máy trạm đã có sẵn: 216 trang đã quét, 14 liên kết giữa các SeoTrang, 1 cảnh báo mồ côi (`/tu-vi-2027`), 8 quy tắc, 579 gợi ý, 10 dòng lịch mùa vụ. Muốn có lại dữ liệu mới: `npx tsx --env-file=.env scripts/seo-quet.ts http://localhost:3047 --nghi=150` rồi `npx tsx --env-file=.env scripts/seo-goi-y-lien-ket.ts`.

## 1. Việc cần làm

Mọi tệp nằm trong `src/app/quan-tri/(khu)/seo/<trang>/`. Server action để trong `hanh-dong.ts` cùng thư mục (tệp mới, không sửa `seo/hanh-dong.ts` sẵn có trừ khi bắt buộc; nếu sửa thì ghi rõ trong báo cáo).

### 1.1. `/quan-tri/seo/lien-ket` (xem: `seo.xem`; thao tác: `seo.sua`)
Một trang, chia bằng tham số GET `?tab=` (mặc định `tong-quan`):
- **tong-quan:** ô `qt-so` từ `SEO_QUET_LAN_CUOI`: lúc quét, số giây, số trang đã tải, theo mã HTTP, số liên kết nội bộ, số trang ngoài CSDL, cờ `catNgang` (nếu true thì hiện cảnh báo "quét dở, chưa tính mồ côi"). Đếm cảnh báo mở theo loại (bấm vào thì sang tab cảnh báo đã lọc).
- **canh-bao:** bảng `SeoCanhBao` trạng thái `MO`, lọc theo `loai` và `mucDo`, 50 dòng/trang. Hiện đường dẫn (từ `chiTiet.duong`, hoặc `chiTiet.tu → chiTiet.den` với `LOI_HTTP`), mã HTTP, anchor, lúc tạo. Hai nút mỗi dòng: **Đã xử lý** (`DA_XU_LY`) và **Bỏ qua** (`BO_QUA`); ghi `xuLyLuc`, `xuLyBoiId = nd.id`; nhật ký `seo.canh_bao` có trước/sau, cùng giao dịch.
- **trang:** hai bảng: trang `XUAT_BAN` có `soLienKetVao = 0` (mồ côi theo CSDL) và trang `doSau > 3`. Cột: đường dẫn (liên kết sang `/quan-tri/seo/trang/[id]`), độ sâu, vào, ra, mã HTTP, lúc quét.
- **goi-y:** bảng `SeoLienKet` trạng thái `DE_XUAT`; lọc theo quy tắc (`quyTacId`, hiện tên quy tắc), theo trang nguồn (ô tìm đường dẫn), 50 dòng/trang. Cột: từ trang → đến trang, anchor, quy tắc, nguồn (`QUY_TAC` / `NGU_NGHIA`), độ gần (nếu có).
  - **Chấp nhận** → `DA_DUYET`, cho sửa anchor (ô nhập, tối đa 200 ký tự) trong cùng form.
  - **Bỏ qua** → `BO_QUA` (lần sau bộ gợi ý không đưa lại cặp này).
  - Nhật ký `seo.goi_y_lien_ket` có trước/sau. Không xóa dòng nào.
- **anchor:** 30 trang đích có nhiều liên kết vào nhất. Với mỗi trang, lấy anchor của các liên kết `DANG_CO` trỏ tới nó, gọi `danhGiaAnchor(anchors, trang.tuKhoaChinh?.chuoi)`. Hiện số theo 5 loại, anchor hay gặp nhất, và cảnh báo (`CHINH_XAC_NHIEU`, `MOT_ANCHOR_AP_DAO`, `CHUNG_CHUNG_NHIEU`) bằng chữ tiếng Việt dễ hiểu. Ghi chú nhỏ: ngưỡng là giả định.
- **quy-tac:** bảng `SeoQuyTacLienKet` (tên, kiểu `dieuKien.kieu`, đích, số tối thiểu/tối đa, bắt buộc, bật/tắt). Nút bật/tắt (`seo.sua`, nhật ký `seo.quy_tac_lien_ket`). Không cho sửa nội dung quy tắc ở đợt này.

### 1.2. `/quan-tri/seo/trang/[id]`: thêm khối "Liên kết"
Thêm một `qt-the` mới (không đổi phần đang có):
- dòng tóm tắt: độ sâu, số vào, số ra, mã HTTP lần quét, lúc quét;
- bảng **liên kết vào** và bảng **liên kết ra** (mỗi bảng tối đa 100 dòng, trạng thái `DANG_CO` và `DE_XUAT`, ghi rõ trạng thái), mỗi dòng có anchor và đường dẫn đầu kia (bấm sang trang đó);
- kết quả `danhGiaAnchor` cho chính trang này (làm trang đích);
- cảnh báo `MO` gắn với trang này (`SeoCanhBao.trangId`).

### 1.3. `/quan-tri/seo/lich-mua` (xem: `seo.xem`; sửa: `seo.sua`)
- Bảng `SeoLichMua` sắp theo `hanLenTrang`: tên, đỉnh tìm (từ–đến), hạn lên trang, **còn bao nhiêu ngày** (tính theo giờ Việt Nam; < 30 ngày tô đỏ, đã quá hạn ghi "quá hạn"), trạng thái, ghi chú.
- Sửa trạng thái (`CHUA_LAM | DANG_LAM | XONG | HOAN`) và ghi chú qua server action; nhật ký `seo.lich_mua` có trước/sau. Không tạo, không xóa dòng ở đợt này.

## 2. Quy tắc bắt buộc (như Lệnh 21, 22)

1. **Không sửa:** `prisma/schema.prisma`, `prisma/migrations/`; `src/lib/**` (mọi thư mục con); `src/middleware.ts`; `src/app/api/**`; `docs/v2/tai-san-xemtuvi/`. Thấy cần đổi phần lõi thì ghi vào báo cáo, mục "Đề nghị sửa lõi".
2. Mọi page và server action gọi `yeuCauQuyen(...)` ở **dòng đầu**. Mọi thao tác ghi có `ghiNhatKy` **trong cùng giao dịch** (`prisma.$transaction`). Server action phải đọc lại bản ghi trong giao dịch, không tin dữ liệu ẩn trong form ngoài `id`.
3. Cấm `$queryRawUnsafe` và `$executeRawUnsafe`.
4. **CSS:** chỉ lớp `qt-*` có trong `src/app/quan-tri/quan-tri.css`, hoặc thêm lớp mới ở cuối tệp đó với tiền tố `qt-`. **Cấm** lớp `so`, `nhan`, `gia-tri` và biến `var(--paper)`.
5. Không thêm thư viện npm. Không chạy migration. Không commit.
6. **Không đụng menu** (`MENU_QUAN_TRI`): Claude Code sẽ thêm "Liên kết" và "Lịch mùa vụ" khi duyệt.
7. Chạy test theo **từng tệp, có giới hạn thời gian** (ví dụ `timeout` hoặc tự dừng sau 3 phút); `tsx --test` với Prisma dễ treo nếu chạy cả thư mục. Không để tác vụ nền chạy quá 10 phút.
8. Dữ liệu thử tạo mới phải có `[THỬ]` và xóa sau khi kiểm. **Không** bấm "Bỏ qua"/"Chấp nhận" trên gợi ý thật, trừ khi khôi phục lại đúng trạng thái `DE_XUAT` và anchor cũ sau khi thử (ghi rõ trong báo cáo); cách an toàn hơn là tạo một cặp SeoTrang `[THỬ]` và một gợi ý `[THỬ]` riêng.

## 3. Kiểm trước khi báo xong

1. `.\node_modules\.bin\tsc.cmd --noEmit -p .` thoát mã 0.
2. `node scripts/kiem-dot1-quyen.mjs http://localhost:3047` vẫn đạt (mật khẩu thử ở `D:\VibeCode\Antigravity\may-tram\tai-khoan-thu.json`; **không in mật khẩu**).
3. Chạy tay trên `http://localhost:3047`:
   - quản trị và biên tập mở được 3 trang; tài khoản xem số liệu xem được nhưng không thấy hoặc không dùng được nút thao tác (action vẫn phải tự chặn ở máy chủ: gửi thẳng form bằng tài khoản xem số liệu phải bị từ chối); chuyên gia bị chặn;
   - tab cảnh báo hiện cảnh báo mồ côi `/tu-vi-2027`;
   - chấp nhận một gợi ý `[THỬ]` có sửa anchor → `DA_DUYET`, có dòng `seo.goi_y_lien_ket` với trước/sau trong `/quan-tri/nhat-ky`; bỏ qua một gợi ý `[THỬ]` khác → `BO_QUA`;
   - lịch mùa vụ hiện 10 dòng, số ngày còn lại đúng với hôm nay; đổi trạng thái một dòng rồi đổi lại như cũ, có 2 dòng nhật ký;
   - trang `/quan-tri/seo/trang/[id]` của `/kien-thuc` hiện liên kết vào/ra khớp số `soLienKetVao/soLienKetRa`;
   - grep thư mục mới và `quan-tri.css`: không có `$queryRawUnsafe`, `className="so"`, `var(--paper)`.
4. Báo cáo `23-bao-cao.md` gồm: danh sách tệp, cách đã kiểm, kết quả từng bước ở mục 3, những gì chưa làm được và lý do, đề nghị sửa lõi (nếu có), và xác nhận đã dọn dữ liệu `[THỬ]`.

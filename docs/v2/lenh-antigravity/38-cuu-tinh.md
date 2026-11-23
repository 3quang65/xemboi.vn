# Lệnh 38: Trang Cửu tinh năm, tháng trong cụm `/phong-thuy`

Người giao: Claude Code, 23/11/2026. Người làm: Antigravity. Model: Gemini 4 Neon Extra High.
Báo cáo ghi vào `docs/v2/lenh-antigravity/38-bao-cao.md`, theo mẫu Lệnh 25.

Ràng buộc như Lệnh 34–37:
- CSS chỉ dùng lớp `ck-`;
- không bịa nội dung, không tự dịch, không tự giảng cát hung;
- chỉ đặt liên kết tới trang có trong `trangDaDung()` hoặc `TRANG_CUU_TINH`;
- không cài gói, không commit.

Không sửa:
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`, `components/r1`;
- `ck.css`, `ck-nen.css`, `DauTrang.tsx`, `tests/**`.

## Vì sao

Cửu tinh (Tử bạch) là bảng "sao nào bay tới phương nào" theo từng năm và từng tháng. Người dùng hay tìm kiểu "cửu tinh 2027", "năm 2027 ngũ hoàng ở hướng nào". Phần tính đã có trong lib, kiểm khớp 600 ô bảng năm và 36 ô bảng tháng của Hiệp kỷ biện phương thư.

**Định vị (docs/v2/04):** trang chỉ cho biết sao ở đâu và sách nói gì. **Không** viết "hóa giải", "đặt vật phẩm", "sát khí", "năm nay hướng X xấu nên tránh". Không xếp sao "tốt, xấu" ngoài đúng câu `GHI_CHU_BON_SAO` mà lib cung cấp.

## Dữ liệu (đã có, chỉ đọc)

`src/lib/trang/cuu-tinh.ts`:
- `CUU_TINH`: 9 sao `{ so, ten, han, tenBacDau, hanh }`, vd `{ so: 5, ten: 'Ngũ hoàng', han: '五黄', tenBacDau: 'Liêm trinh', hanh: 'Thổ' }`.
- `cuuTinhNam(nam)` (1901–2099) trả về:
  - `{ nam, canChi, nguyen, batDau, ketThuc, ban, thang }`;
  - `ban` là `BanCuuTinh` = `{ trung, cung: [{ ten, han, phuong, soLacThu, sao }] }`, 9 ô theo thứ tự trung cung, Càn, Đoài, Cấn, Ly, Khảm, Khôn, Chấn, Tốn;
  - `thang`: 12 tháng tiết `{ thang, chi, tiet, batDau, ban }`. Tháng 1 là tháng Dần (từ Lập xuân), tháng 12 là tháng Sửu (từ Tiểu hàn, rơi vào tháng 1 dương lịch năm sau).
- `thangTietTai(date)`: `{ nam, thang }` của thời điểm đó. Dùng để biết năm và tháng đang hiệu lực.
- `cungCuaSao(ban, so)`: ô có sao `so`.
- `TRICH_CUU_TINH`: 5 câu nguyên văn (`lacThu`, `saoNam`, `thuanBo`, `saoThang`, `tenVaHanh`), cùng kiểu `TrichDan` của cụm Phong thủy. In bằng `KhoiTrichDan` có sẵn.
- `GHI_CHU_MOC`: câu về mốc Lập xuân, tháng theo tiết. Bắt buộc in gần bảng năm.
- `GHI_CHU_BON_SAO`: câu về bốn sao Hiệp kỷ ghi trong bảng năm.
- `NAM_CUU_TINH_TU`, `NAM_CUU_TINH_DEN`, `NAM_TRANG_CUU_TINH` (2020–2035), `TRANG_CUU_TINH`, `duongDanCuuTinh(nam)`.

Thời điểm `batDau` là `Date`. In theo giờ Việt Nam (UTC+7), dạng `04/02/2027 08:46`. Có thể dùng hàm định dạng sẵn có trong cụm (vd cách `chiem-tinh` hoặc `lich` in giờ), không tự viết lại múi giờ sai.

## Việc cần làm

### 38.1. Component `BangCuuCung` (trong `PhongThuyUi.tsx` hoặc tệp mới `cuu-tinh/CuuTinhUi.tsx`)

Lưới 3×3, **Nam ở trên** theo Lạc thư ("đội cửu lý nhất"):

| | | |
|---|---|---|
| Tốn (Đông Nam) | Ly (Nam) | Khôn (Tây Nam) |
| Chấn (Đông) | Trung cung | Đoài (Tây) |
| Cấn (Đông Bắc) | Khảm (Bắc) | Càn (Tây Bắc) |

Mỗi ô:
- số sao to và tên sao (vd "5 Ngũ hoàng");
- chữ Hán nhỏ (`五黄`);
- tên phương (vd "Bắc"), ghi rõ ràng vì nhiều người quen bản đồ Bắc ở trên.

Phía trên lưới ghi một dòng nhỏ: "Nam ở trên, theo cách vẽ Lạc thư trong sách cổ."

Màu từng sao theo đúng tên màu: bạch là trắng ngà, hắc là xám đậm, bích là xanh ngọc, lục là xanh lá, hoàng là vàng, xích là đỏ, tử là tím. Chỉ làm điểm nhấn nhẹ (viền, nền nhạt), chữ phải đủ tương phản ở chế độ sáng lẫn tối. Có chế độ `nho` để in 12 bàn tháng gọn.

### 38.2. `/phong-thuy/cuu-tinh` (trang chính, công cụ)

- `<h1>` "Cửu tinh năm, tháng".
- Ô chọn năm, form GET `?nam=` (khoảng `NAM_CUU_TINH_TU`–`NAM_CUU_TINH_DEN`). Mặc định là năm tiết đang hiệu lực (`thangTietTai(new Date())`). Năm ngoài khoảng thì báo lỗi nhẹ, không văng 500.
- Khối năm: "Năm {canChi} ({nam}), {nguyen}: {tên sao trung} vào trung cung." Ngay dưới là `GHI_CHU_MOC` và mốc: "Từ {batDau} đến {ketThuc}". Sau đó là `BangCuuCung` của năm.
- Một dòng tra nhanh, chỉ nêu vị trí, không bình: "Ngũ hoàng ở {phương}. Nhị hắc ở {phương}." Rồi `GHI_CHU_BON_SAO` kèm vị trí 4 sao Nhất bạch, Lục bạch, Bát bạch, Cửu tử.
- Khối tháng: 12 tháng, mỗi tháng có tên tháng (vd "Tháng giêng (Dần)"), tiết mở đầu, ngày giờ bắt đầu, sao trung cung và `BangCuuCung` chế độ `nho`. Tháng đang hiệu lực được làm nổi. Ở 375 px xếp 1 cột hoặc cuộn ngang trong khung (không tràn trang).
- Khối "Cách tính theo sách": in 5 câu `TRICH_CUU_TINH` bằng `KhoiTrichDan`, theo thứ tự `lacThu`, `thuanBo`, `saoNam`, `saoThang`, `tenVaHanh`. Mỗi câu có nhãn ngắn, vd "Vị trí gốc của 9 sao", "Cách bay: thuận bố cửu cung", "Sao năm", "Sao tháng", "Tên và hành của 9 sao". Không giải thích thêm ngoài nhãn.
- Bảng 9 sao: số, tên, chữ Hán, tên Bắc Đẩu, hành.
- Liên kết tới các trang năm có sẵn (`NAM_TRANG_CUU_TINH`).
- Cuối trang: `GhiCongHiepKy`.

### 38.3. `/phong-thuy/cuu-tinh/[nam]`

- `generateStaticParams` từ `NAM_TRANG_CUU_TINH`, `dynamicParams = false` (năm khác thì 404).
- Nội dung giống khối năm và khối tháng ở 38.2 cho năm đó, không có ô chọn năm. `<h1>` "Cửu tinh năm {nam} ({canChi})".
- Liên kết năm trước, năm sau (nếu có trang) và về `/phong-thuy/cuu-tinh`.
- Breadcrumb: `breadcrumb(duongDanCuuTinh(nam), 'Cửu tinh năm {nam}')`.
- Metadata: title "Cửu tinh năm {nam}: sao bay 9 phương, 12 tháng"; description nêu sao trung cung và vị trí Ngũ hoàng của năm đó, lấy từ lib.

### 38.4. Hub `/phong-thuy`

Thêm thẻ thứ tư vào lưới công cụ: "Cửu tinh năm, tháng", dẫn tới `/phong-thuy/cuu-tinh`, mô tả "Sao nào vào trung cung, bay tới phương nào, theo Hiệp kỷ."

Menu đã có mục "Cửu tinh năm, tháng" (em đã sửa `dieu-huong.ts`).

### 38.5. CSS

Thêm vào `phong-thuy.css` (hiện 15,5 KB, trần 30 KB), lớp `ck-pt-ct-*`. Lưới 3×3 vuông, ô đủ lớn để đọc trên điện thoại. 12 bàn tháng: 3 cột desktop, 2 cột tablet, 1 cột 375 px.

## Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua (có `cuu-tinh.test.mjs` 8 test, `meta-dieu-huong.test.mjs`).
- Dev trả 200 cho `/phong-thuy`, `/phong-thuy/cuu-tinh`, `?nam=2027`, `?nam=1950`, 16 trang năm 2020–2035. `/phong-thuy/cuu-tinh/2019` trả 404. `?nam=abc` và `?nam=3000` không lỗi 500.
- Đối chiếu:
  - Năm 2027: Đinh Mùi, Hạ nguyên, Cửu tử vào trung cung, Ngũ hoàng ở Bắc (Khảm).
  - Năm 2026: Nhất bạch trung cung; Ngũ hoàng ở Nam (Ly); Nhị hắc ở Tây Bắc (Càn).
  - Năm 2027, tháng giêng (Dần): Ngũ hoàng trung cung. Tháng 12 (Sửu) bắt đầu tháng 1/2028.
- Không có chữ "hóa giải", "vật phẩm", "sát khí", "kích hoạt", "cải vận" trên các trang mới.
- 0 lỗi console; không tràn ngang ở 375 px; không liên kết 404.
- Chụp ở 1366 và 375, lưu `docs/v2/bang-chung/ck-pt-ct-*.png`: trang chính năm 2027, trang `/phong-thuy/cuu-tinh/2026`.

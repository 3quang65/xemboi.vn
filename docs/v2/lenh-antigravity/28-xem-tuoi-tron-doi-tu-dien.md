# Lệnh 28: Xem tuổi, Tử vi trọn đời, từ điển cung và chính tinh (F4)

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/28-bao-cao.md`.

**Làm sau khi Lệnh 27 đã nghiệm thu.** Ràng buộc như Lệnh 25:
- khung `(v2)`, CSS `ck-`;
- không bịa nội dung;
- chỉ đặt liên kết tới `trangDaDung()`;
- không cài gói, không commit.

Khung từ điển (dữ liệu tính được, diễn giải đã duyệt hoặc chỗ giữ cùng noindex, khối liên quan) giống Lệnh 27.

## Đọc trước

- `docs/v2/16-seo-trang.csv`, các dòng `XT*`, `XONGDAT`, `TUVI-TRONDOI`, `TUVI-CUNG*`, `TUVI-SAO*`, `TUVI-CHINHTINH`.
- Phần lõi của Claude Code (chỉ đọc; test nằm trong `tests/trang/`):
  - `src/lib/trang/xem-tuoi.ts`
    - `xemTuoiVoChong(namChong, namVo)`: trả 4 tiêu chí `{ ma, ten, muc: 'tot'|'binh'|'xau', giaiThich }` và `dem`. Năm hợp lệ từ 1930 đến 2010.
    - `goiYXongDat(namChu, namTet)`: trả `chu`, `namTet` và `ungVien[]`. Mỗi ứng viên có `nam`, `canChi`, `napAm`, `tuoiAm` và tiêu chí.
  - `src/lib/trang/la-so.ts`: kết quả `/api/v2/la-so` có thêm `daiVan[]`, gồm:
    - `tuTuoi`, `denTuoi`, `tuNam`, `denNam`;
    - `tenCung`, `canChi`, `chinhTinh[]`, `dangChay`.
  - `src/lib/trang/tu-vi-tu-dien.ts`
    - `CUNG_TU_VI` (12 cung) và `cungTheoSlug`.
    - `CHINH_TINH` (14 sao) và `chinhTinhTheoSlug`. Mỗi sao có `hanh` và `dacTinh` theo 12 chi (Miếu, Vượng, Đắc, Bình hòa, Hãm), kèm `mieuVuong[]` và `ham[]`.
  - `src/lib/trang/lich.ts`: dùng `tetSapToi()` để lấy năm Tết mặc định cho trang xông đất.

## 1. Việc cần làm

### 1.1. Hub `/xem-tuoi`

- Thẻ công cụ dẫn tới Vợ chồng và Xông đất.
- Khối `ck-cho-noi-dung` giới thiệu trang.

### 1.2. `/xem-tuoi/vo-chong`

**Form và tham số:**
- Form GET gồm hai `select` (năm sinh chồng, năm sinh vợ; 1930–2010) và một dòng ghi chú: "theo năm âm lịch; sinh trước Tết tính năm trước".
- Trang nhận `?chong=&vo=` và render phía server.
- Khi có tham số: `robots` noindex, canonical về `/xem-tuoi/vo-chong`.

**Kết quả:**
- Hai thẻ người. Mỗi thẻ có can chi, nạp âm và cung phi.
- Bảng 4 tiêu chí. Mỗi dòng có nhãn Tốt / Bình / Xấu, tô màu nhẹ, không dùng màu đỏ chói, kèm câu `giaiThich`.
- Dòng tổng: "Theo 4 tiêu chí truyền thống: X tốt, Y bình, Z xấu".
- Một câu cố định: "Các sách và trường phái có thể khác nhau; kết quả để tham khảo".
- **Không** chấm điểm trên thang 10, **không** kết luận "hợp" hay "không hợp", **không** dùng chữ hù dọa.

**Liên kết:** sang `/sinh-nam/{năm}` của từng người.

### 1.3. `/xem-tuoi/xong-dat`

**Form và tham số:**
- Form GET gồm năm sinh gia chủ (1930–2010). Năm Tết mặc định là `tetSapToi().namAm`.
- Tham số `?chu=&tet=`. Khi có tham số thì noindex và đặt canonical về trang gốc.

**Kết quả:**
- Danh sách ứng viên: tuổi âm, năm sinh, can chi, nạp âm.
- Mỗi ứng viên có 4 tiêu chí, gom trong `<details>`.

**Cố định trên trang:**
- Câu "Không có tuổi nào hợp hoàn toàn với mọi sách" nếu `ungVien` rỗng.
- Phần đầu trang ghi Tết `{canChi}` vào ngày nào, lấy từ `tetSapToi()`. Có link sang `/tet`.

### 1.4. `/tu-vi/tron-doi`

- Dùng lại `FormLaSo` của Lệnh 25 (có thể thêm prop chế độ `tronDoi`).
- Kết quả gồm ba phần:
  - lá số 4×4;
  - **bảng đại vận** 12 dòng: tuổi, năm dương, cung, can chi, chính tinh. Dòng có `dangChay` được nhấn mạnh;
  - dòng thời gian ngang trên desktop, chuyển thành danh sách dọc trên mobile.
- Không có luận giải.

### 1.5. `/tu-vi/cung` và `/tu-vi/cung/[slug]`

- Trang chỉ mục: 12 cung theo thứ tự, mỗi thẻ dẫn tới trang của cung.
- Trang mục:
  - thứ tự, vị trí so với Mệnh (cung thứ mấy, an nghịch);
  - liên kết cung trước và cung sau;
  - phần diễn giải lấy từ `noiDungTheoDuongDan`, nếu chưa có thì hiện chỗ giữ và đặt noindex.
- `generateStaticParams` cho đủ 12 cung.

### 1.6. `/tu-vi/sao` và `/tu-vi/sao/[slug]`

- Trang chỉ mục:
  - 14 chính tinh, tô màu theo hành;
  - **ma trận 14 sao × 12 chi** ghi Miếu, Vượng, Đắc, Bình, Hãm, tô màu theo mức;
  - trên mobile, ma trận cuộn ngang **bên trong khung**, trang không bị cuộn ngang.
- Trang sao:
  - hành;
  - bảng đặc tính theo 12 chi;
  - danh sách "Miếu/Vượng tại", "Hãm tại";
  - diễn giải đã duyệt hoặc chỗ giữ.
- Dòng nguồn: "Bảng miếu hãm theo bộ máy an sao của xemboi (quy tắc theo sách cụ Thiên Lương)".
- `generateStaticParams` cho đủ 14 sao.
- Mẫu SEO là `/tu-vi/sao/{sao}` với khóa `{Tên}`. Mẫu cung là `/tu-vi/cung/{cung}` với khóa `{Tên}`.

### 1.7. Liên kết chéo

- **Trang lá số `/tu-vi/lap-la-so`:** tên mỗi chính tinh trong phần tóm tắt, hoặc danh sách cung dạng chữ, liên kết sang `/tu-vi/sao/{slug}`.
  - Dùng `slugViet` trong `src/lib/trang/can-chi.ts`.
  - Không sửa `LaSo12Cung`. Chỉ thêm liên kết ở phần do `FormLaSo` tự hiện.
- **Menu và trang chủ:** Claude Code tăng `DOT_DA_DUNG` lên 4.

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua.
- Kiểm trên dev, yêu cầu 0 lỗi console và không có link 404:
  - `/xem-tuoi`
  - `/xem-tuoi/vo-chong?chong=1990&vo=1992`: phải ra chồng Canh Ngọ (Khảm), vợ Nhâm Thân (Đoài), cung phi "Họa hại".
  - `/xem-tuoi/xong-dat?chu=1985`
  - `/tu-vi/tron-doi`: lập 15/8/1990, 10 giờ, nam. Có 12 dòng đại vận và đúng 1 dòng đang chạy.
  - `/tu-vi/cung`, `/tu-vi/cung/menh`
  - `/tu-vi/sao`, `/tu-vi/sao/tu-vi`: Tử Vi hành Thổ, Miếu tại Dần.
- Trang có tham số và trang chưa có diễn giải: kiểm noindex trong HTML.
- Ảnh 1366 và 375 lưu `docs/v2/bang-chung/ck-f4-*.png`. Báo cáo theo mẫu Lệnh 25.

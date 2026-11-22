# Lệnh 26: cụm Lịch âm v2 (F2)

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/26-bao-cao.md`.

**Làm sau khi Lệnh 25 đã nghiệm thu.** Dùng lại toàn bộ khung `src/app/(v2)/layout.tsx`, `src/components/ck/*` và `ck.css` của Lệnh 25. Các ràng buộc của Lệnh 25 giữ nguyên:
- chỉ sửa trong `(v2)`, `components/ck` và `ck.css`;
- không bịa nội dung;
- chỉ liên kết tới trang có trong `trangDaDung()`;
- không cài gói, không commit.

## Đọc trước

- `docs/v2/19-frontend-v2.md`, mục F2.
- `docs/v2/16-seo-trang.csv`, các dòng `LICH*` và `TET`. Cột `title_mau`, `h1_mau` và `ghi_chu` nói rõ ý định của từng trang.
- **Lõi Claude Code đã làm** (chỉ đọc, có test ở `tests/trang/lich.test.mjs`): `src/lib/trang/lich.ts`.
  - `ngayLich(d, m, y)` trả về `ChiTietNgay`:
    - ngày âm;
    - can chi ngày, tháng, năm;
    - nạp âm ngày;
    - tiết khí đang ở, kèm cờ `batDauHomNay`;
    - 12 giờ, có cờ `hoangDao`;
    - ngày lễ;
    - thứ.
  - `homNay()` và `ngayMai()`: tính theo giờ Việt Nam.
  - `thangLich(nam, thang)`: lưới 6×7, tuần bắt đầu Thứ hai.
    - Mỗi ô có `iso`, `am`, `nhanAm`, `canChiNgay`, `ngayLe`, `laHomNay`, `trongThang`.
    - Kèm `thangAm[]`, `thangTruoc` và `thangSau`.
  - `tongQuanNam(nam)`: can chi, Tết, tháng nhuận, 24 tiết khí, các lễ âm lịch và cờ `duocIndex` (2020–2035).
  - `tetSapToi()`: năm âm, ngày Tết và số ngày còn lại.
  - `ngayHopLe()`, `tenThangAm()`, `THU`.
- Engine đổi ngày cho client component: `duongSangAm`, `amSangDuong` trong `src/lib/tuvi-v2/am-lich.ts`. Đây là hàm thuần, import được ở client.

## 1. Việc cần làm

Mọi trang:
- `generateMetadata` gọi `metaTrang(duongDan, macDinh, mau?, thamSo?)`.
- Trang lập trình truyền thêm `mau` (ví dụ `'/lich-am/{yyyy}/{mm}'`) và `thamSo`, để title và H1 lấy từ dòng mẫu trong SeoTrang.
  - Khóa của `thamSo` phải **đúng như chữ trong dấu ngoặc** của mẫu, kể cả dấu cách và dấu tiếng Việt. Ví dụ mẫu năm: `{ yyyy: '2026', 'Can Chi': 'Bính Ngọ' }`; mẫu ngày: `{ dd, mm, yyyy, 'âm': '1/1 Bính Ngọ' }`.
  - Mẫu còn chỗ trống chưa điền thì `thongTinTrang` bỏ chuỗi đó và dùng `macDinh`, kèm cảnh báo ở console dev. Nghiệm thu phải không còn cảnh báo này.

**Thành phần dùng chung**, đặt trong `src/components/ck/`:
- `LichThang.tsx`: lưới tháng.
  - Ô có số dương lớn, số âm nhỏ.
  - Mùng 1 và ngày rằm có màu nhấn. Ngày lễ có chấm và tooltip.
  - Ô hôm nay có viền.
  - Ô ngoài tháng thì mờ.
  - Mỗi ô là link tới `/lich-am/{yyyy}/{mm}/{dd}`.
  - Mobile: lưới vẫn 7 cột, chữ nhỏ lại, không cuộn ngang.
- `ChiTietNgay.tsx`: khối "tờ lịch".
  - Hiện số dương rất lớn, thứ, ngày âm, tên tháng âm, can chi ngày/tháng/năm, tiết khí.
  - Bảng 12 giờ, giờ hoàng đạo được tô.
  - Kèm ngày lễ.
- `ChonThang.tsx`: client component, gồm hai `select` năm (1900–2100) và tháng, cùng nút "Xem". Nút điều hướng tới `/lich-am/{yyyy}/{mm}`.

### 1.1. `/lich-am` (hub, mẫu `LICH`)

- Đầu trang tối.
  - H1 "Lịch âm hôm nay" lấy từ meta.
  - `ChiTietNgay` của `homNay()`.
- `LichThang` của tháng hiện tại, có nút tháng trước và tháng sau (link).
- Thẻ công cụ: Đổi ngày, Lịch vạn niên, Ngày mai, Tết.
- `export const revalidate = 3600`.

### 1.2. `/lich-am/doi-ngay`

- Client component có hai tab:
  - dương → âm;
  - âm → dương, có ô "tháng nhuận".
- Phạm vi năm 1900–2100.
- Kết quả hiện ngày đã đổi, can chi và link "Xem chi tiết ngày" tới `/lich-am/{yyyy}/{mm}/{dd}`.
- Nếu `amSangDuong` trả `null` (tháng nhuận không có, hoặc ngày 30 không có), hiện câu báo rõ ràng.
- Tham số trên URL (`?d=&m=&y=&chieu=`) chỉ để điền sẵn form.
  - Trang có tham số thì đặt `robots` noindex và canonical về `/lich-am/doi-ngay`.

### 1.3. `/lich-am/lich-van-nien`

- `ChonThang` và `LichThang` của tháng hiện tại.
- Bảng 24 tiết khí của năm hiện tại.

### 1.4. `/lich-am/ngay-mai`

- `ChiTietNgay` của `ngayMai()`.
- `revalidate = 3600`.

### 1.5. `/lich-am/[yyyy]` (mẫu `/lich-am/{yyyy}`)

- Chỉ nhận năm 1900–2100, ngoài khoảng thì `notFound()`.
- Nội dung:
  - H1;
  - tóm tắt từ `tongQuanNam`: Tết ngày nào, thứ mấy; năm nhuận tháng mấy;
  - 12 lưới tháng thu nhỏ, mỗi lưới link tới trang tháng;
  - bảng tiết khí;
  - bảng ngày lễ (tên, ngày âm, ngày dương, thứ).
- `generateStaticParams` chỉ cho 2020–2035. Năm khác vẫn render động.
- `duocIndex = false` (ngoài 2020–2035): `generateMetadata` ép `robots` noindex.
  - Lấy kết quả `metaTrang` rồi ghi đè `robots` khi `!tongQuanNam(y).duocIndex`.
- Link năm trước, năm sau.

### 1.6. `/lich-am/[yyyy]/[mm]` (mẫu `/lich-am/{yyyy}/{mm}`)

- `mm` có 2 chữ số, 01–12.
- Nội dung: `LichThang`, `thangAm[]` (tháng này rơi vào tháng âm nào), các ngày lễ trong tháng, link tháng trước và tháng sau, link lên năm.
- Index chỉ khi năm thuộc 2020–2035, cùng cách ép robots như 1.5.

### 1.7. `/lich-am/[yyyy]/[mm]/[dd]` (mẫu `/lich-am/{yyyy}/{mm}/{dd}`)

- Nội dung: `ChiTietNgay` của ngày đó, link ngày trước và ngày sau, link lên tháng.
- **Luôn** `robots: { index: false, follow: true }`, kể cả khi `metaTrang` trả index.
- Ngày không hợp lệ thì `notFound()`.

### 1.8. `/tet` (mẫu `TET`)

- Dữ liệu từ `tetSapToi()`: "Tết {canChi} {năm} vào {thứ}, ngày {dd/mm/yyyy}" và "Còn {conNgay} ngày".
  - Đồng hồ đếm ngược là client component, chỉ đếm ngày và giờ, theo giờ Việt Nam.
- Bảng ngày lễ quanh Tết, lấy từ `leAmTrongNam`:
  - lễ ông Công ông Táo, Giao thừa của năm trước Tết;
  - các mùng của năm Tết;
  - Rằm tháng Giêng.
- Khối `ck-cho-noi-dung` cho phong tục.
- `revalidate = 3600`.

### 1.9. Liên kết

- Trang chủ:
  - Dải "Hôm nay theo lịch" có link "Xem lịch tháng" tới `/lich-am`.
  - Ô "Lịch âm hôm nay" thành link.
- Các thay đổi này tự có khi Claude Code tăng `DOT_DA_DUNG` lên 2. Antigravity **không sửa** `dieu-huong.ts`. Chỉ cần đảm bảo trang chủ đọc `trangDaDung()` chứ không viết cứng.

## 2. Nghiệm thu

- tsc 0 lỗi.
- `tests/trang/*.test.mjs` qua.
- Kiểm trên dev :3047 (0 lỗi console, không có link 404):
  - `/lich-am`, `/lich-am/doi-ngay`, `/lich-am/lich-van-nien`, `/lich-am/ngay-mai`;
  - `/lich-am/2026`, `/lich-am/2026/02`, `/lich-am/2026/02/17`;
  - `/lich-am/1899` → 404; `/lich-am/2026/13` → 404; `/lich-am/2026/02/30` → 404;
  - `/tet`.
- Đối chiếu tay. Phải khớp:
  - `/lich-am/2026/02/17`: mùng 1 tháng Giêng năm Bính Ngọ, Thứ ba;
  - `/lich-am/2026/02/16`: có "Giao thừa".
- Xem mã nguồn HTML:
  - `/lich-am/2026/02/17` có `noindex`;
  - `/lich-am/1999` có `noindex`.
- Ảnh 1366 và 375 lưu `docs/v2/bang-chung/ck-f2-*.png`.
- Báo cáo theo mẫu Lệnh 25.

# Lệnh 39: Trang Bản đồ sao `/chiem-tinh/ban-do-sao`

Người giao: Claude Code, 23/11/2026. Người làm: Antigravity. Model: Gemini 4 Neon Extra High.
Báo cáo ghi vào `docs/v2/lenh-antigravity/39-bao-cao.md`, theo mẫu Lệnh 25.

Ràng buộc như Lệnh 36–38:
- CSS chỉ dùng lớp `ck-`;
- không bịa nội dung, **không tự dịch** câu trích tiếng Anh, không tự luận giải;
- chỉ đặt liên kết tới trang có trong `trangDaDung()`;
- không cài gói, không commit.

Không sửa:
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`, `components/r1`;
- `ck.css`, `ck-nen.css`, `DauTrang.tsx`, `tests/**`.

## Vì sao

"Bản đồ sao" là cụm từ khóa lớn nhất của mảng chiêm tinh (100K–1M lượt tìm mỗi tháng). Lệnh 36 đã hoãn trang này vì chờ giấy phép lịch thiên văn. Nay đã rõ:
- vị trí thiên thể tính bằng `astronomy-engine` (MIT);
- tọa độ 63 tỉnh lấy từ GeoNames (CC BY 4.0, **phải ghi công trên trang**).

Lib đã có và đã kiểm: kinh độ 10 thiên thể khớp JPL Horizons dưới 1 phút cung; cung mọc kiểm bằng phép quay độc lập sang hệ chân trời; múi giờ Việt Nam khớp cơ sở dữ liệu IANA. Menu "Chiêm tinh" đã có mục "Bản đồ sao" và breadcrumb (em đã sửa `dieu-huong.ts`), nên trang đang 404.

## Điều quan trọng nhất: chỉ có vị trí và lời Tetrabiblos

Giữ đúng tinh thần Lệnh 36. Trang chỉ ghi:
- thiên thể nằm ở đâu (cung, độ, nhà, nghịch hành);
- phẩm vị theo Tetrabiblos (ở nhà, vượng, hãm);
- câu nguyên văn Tetrabiblos ch. IV, XIII.

**Không** viết:
- "Mặt Trăng ở Song Tử nghĩa là…", "người có cung mọc X…";
- tính cách, tình yêu, nghề nghiệp, vận hạn;
- nguyên tố Lửa/Đất/Khí/Nước;
- tên hoặc ý nghĩa của 12 nhà;
- góc chiếu (aspect);
- dịch câu tiếng Anh.

Ở chỗ người đọc mong thấy luận giải (ngay dưới bảng kết quả), in **`GHI_CHU_TINH_CACH`** bằng `KhoiGhiChuTinhCach` có sẵn.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/ban-do-sao.ts`

**Chỉ import lib này trong server component** (`page.tsx`, hoặc component không có `'use client'`). Thư viện thiên văn nặng, không được vào bundle trình duyệt. Nếu cần client component (vd ô "không biết giờ" ẩn hiện ô giờ), chỉ truyền dữ liệu thô (số, chuỗi) xuống.

Các hàm và dữ liệu:
- `DS_TINH`: 63 tỉnh `{ ma, tinh, noiLay, viDo, kinhDo }`. `tinhTheoMa(ma)`. `GHI_CHU_TINH`: 63 tỉnh theo địa giới trước 1/7/2025.
- `lapBanDo({ nam, thang, ngay, gio?, phut?, noiSinh, lechGiay? })` trả `BanDoSao`. Ngày sai hoặc ngoài 1900–2100 thì **ném `RangeError`**: trang bắt lỗi và báo nhẹ, không văng 500. `ngayHopLe()` để kiểm trước. Kết quả gồm:
  - `luc`: thời điểm UTC; `coGio`;
  - `mucGio: { lechGiay, nhan, lyDo, chacChan }`: múi giờ mặc định và lý do;
  - `lechGiay`: độ lệch đã dùng;
  - `noiSinh: { ten, viDo, kinhDo }`;
  - `thienThe`: 10 mục `ViTriThienThe`:
    - `thienThe: { ten, en, kyHieu, coDien, phatHien? }`;
    - `kinhDo`, `cung` (đối tượng `CungHoangDao` của `chiem-tinh.ts`), `doTrongCung`;
    - `nghich` (boolean); `nha` (1–12 hoặc null);
    - `phamVi` (`'nha' | 'vuong' | 'ham' | null`);
    - `trongNgay?` (chỉ Mặt Trăng khi không có giờ: `{ tu, den }`);
  - `asc`, `mc`: `{ kinhDo, cung, doTrongCung }` hoặc null khi không có giờ;
  - `nha`: 12 `{ so, cung }` hoặc null.
- `vietViTri(p)`: chuỗi "15°23′ Bạch Dương". Dùng cho mọi chỗ in vị trí.
- `nhanLech(giay)`: "UTC+7", "UTC+7:06:30". `LECH_CHON`: 4 độ lệch cho ô chọn lại múi giờ.
- `TEN_PHAM_VI[phamVi]`: `{ ten: 'ở nhà của mình' | 'ở vượng' | 'ở hãm', en, chuong }`.
- `TRICH_THIEN_THE[ten]`: câu ch. IV cho 7 thiên thể cổ. `TRICH_GOC.asc`, `TRICH_GOC.mc`: câu ch. XIII. Cùng kiểu `TrichAnh`, in bằng `TrichTetrabiblos` có sẵn.
- Ghi chú (in nguyên câu, không viết lại):
  - `GHI_CHU_NGOAI`: ba hành tinh ngoài không có trong Tetrabiblos;
  - `GHI_CHU_NHA`: cách chia nhà trọn cung;
  - `GHI_CHU_KHONG_GIO`;
  - `GHI_CHU_NOI_SINH`;
  - `GHI_CHU_TINH`.
- `NGUON_BAN_DO: { lich, toaDo, mucGio }`: ba dòng nguồn.
- `NAM_BAN_DO_TU`, `NAM_BAN_DO_DEN`, `DUONG_DAN_BAN_DO`.

## Việc cần làm

### 39.1. Form (GET)

Tham số:
- `ngay=YYYY-MM-DD` (dùng `docNgay` như trang tra cung);
- `gio=HH:MM` (dùng `docGio`, bỏ trống được);
- `tinh=<ma>`, mặc định `ha-noi`;
- `lech=<giây>`, tùy chọn, chỉ nhận giá trị trong `LECH_CHON`.

Thành phần form:
- Ô ngày.
- Ô giờ, kèm dòng nhỏ: "Không biết giờ sinh thì để trống."
- Ô chọn tỉnh (63 mục, theo thứ tự `DS_TINH`), nhãn "Nơi sinh (tỉnh, thành theo tên cũ)".
- Ô chọn "Múi giờ": mục đầu là "Tự chọn theo năm và nơi sinh" (giá trị rỗng), sau đó 4 mục `nhanLech(x)`.
- Nút "Lập bản đồ sao".

Như trang tra cung: có tham số thì `robots: noindex, follow` và canonical về `/chiem-tinh/ban-do-sao`.

### 39.2. Khi chưa nhập (mặc định)

Hiện bản đồ **bầu trời lúc này tại Hà Nội**: `lapBanDo` với giờ Việt Nam hiện tại. Tiêu đề khối: "Bầu trời lúc {HH:MM} ngày {dd/mm/yyyy} tại Hà Nội". Trang `revalidate = 3600`, nên giờ ghi phải là giờ dùng để tính, không ghi "bây giờ".

### 39.3. Kết quả

1. **Dòng múi giờ**: "Giờ sinh {gio} được tính theo {nhan} ({lyDo})". Nếu `mucGio.chacChan === false` và người dùng chưa chọn `lech`, làm nổi dòng này kèm lời mời chọn lại ở ô "Múi giờ". Nếu người dùng đã chọn `lech` khác mặc định, ghi rõ: "Bạn chọn {nhanLech(lech)}; mặc định là {mucGio.nhan}."
2. **Vòng bản đồ (SVG, server render)**:
   - Vòng 12 cung, mỗi ô 30°, ghi ký hiệu `cung.kyHieu`.
   - Có giờ: cung mọc (`asc.kinhDo`) đặt ở **bên trái** (9 giờ), hoàng đạo tăng **ngược chiều kim đồng hồ** (quy ước bản đồ sao phương Tây). Vạch ASC, MC rõ ràng, nhãn "ASC", "MC".
   - Không giờ: 0° Bạch Dương ở bên trái, không có ASC/MC/nhà.
   - Có giờ thì vòng trong chia 12 nhà trọn cung, ghi số nhà.
   - Ký hiệu thiên thể đặt theo `kinhDo`. Các thiên thể gần nhau (cách dưới ~6°) thì xếp lùi vào trong để không chồng chữ.
   - Thiên thể nghịch hành thêm chữ "R" nhỏ.
   - Ba hành tinh ngoài vẽ nhạt hơn.
   - Có `<title>` và `aria-label` mô tả tóm tắt.
   - Ở 375 px vẫn đọc được: SVG co theo chiều rộng, chữ không dưới 11 px.
3. **Bảng vị trí** (cột: Thiên thể, Vị trí, Nhà, Ghi chú):
   - **Thiên thể**: ký hiệu, tên Việt, tên Anh nhỏ.
   - **Vị trí**: `vietViTri`, liên kết tên cung tới trang cung (`duongDanCung`).
   - **Nhà**: số, hoặc "–" khi không có giờ.
   - **Ghi chú**:
     - "nghịch hành" nếu `nghich`;
     - phẩm vị: "{TEN_PHAM_VI.ten} (Tetrabiblos ch. {chuong})";
     - với Mặt Trăng không có giờ: "trong ngày: từ {vietViTri(tu)} tới {vietViTri(den)}".
   - Hai dòng đầu bảng là ASC ("Cung mọc") và MC ("Thiên đỉnh"), khi có giờ.
   - Ba hành tinh ngoài xếp cuối, có dấu "*" dẫn tới `GHI_CHU_NGOAI`.
   - Không có giờ thì in `GHI_CHU_KHONG_GIO` ngay trên bảng.
4. Có giờ: dưới bảng in `GHI_CHU_NHA`.
5. `KhoiGhiChuTinhCach`.
6. **"Tetrabiblos nói về các thiên thể và góc"**:
   - với 7 thiên thể cổ, theo thứ tự trong bảng, một `<details>` mỗi thiên thể: tóm tắt là tên thiên thể, mở ra là `TrichTetrabiblos` với `TRICH_THIEN_THE[ten]`;
   - khi có giờ, thêm hai `<details>` "Cung mọc" (`TRICH_GOC.asc`) và "Thiên đỉnh" (`TRICH_GOC.mc`);
   - không thêm chữ giải thích nào khác ngoài nhãn.

### 39.4. Phần dưới trang

- Khối "Cách tính", là danh sách ngắn, chỉ nêu sự kiện, không quảng cáo:
  - "Vị trí: {NGUON_BAN_DO.lich}".
  - "Nơi sinh: {GHI_CHU_NOI_SINH}" và `GHI_CHU_TINH`.
  - "Múi giờ: {NGUON_BAN_DO.mucGio}".
  - "Hoàng đạo nhiệt đới": `KhoiGhiChuHoangDao`.
- Dòng ghi công GeoNames (bắt buộc do CC BY 4.0): "Tọa độ tỉnh lỵ: [GeoNames](https://www.geonames.org), giấy phép [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)". Liên kết `rel="noopener noreferrer nofollow"`.
- Dòng: "Tính bằng [astronomy-engine](https://github.com/cosinekitty/astronomy) (MIT)."
- `KhoiNguonVaGioiHan`.

### 39.5. Metadata, schema

- `MAC_DINH_BAN_DO_SAO` trong `ChiemTinhHelpers.ts`:
  - title "Bản đồ sao cá nhân miễn phí: natal chart tiếng Việt";
  - h1 "Bản đồ sao";
  - description "Lập bản đồ sao (natal chart) theo ngày, giờ, nơi sinh: vị trí hành tinh, cung mọc, 12 nhà. Nguồn lịch thiên văn ghi rõ."
- Dùng `metaTrang('/chiem-tinh/ban-do-sao', …)` như các trang khác.
- JSON-LD `WebApplication` (dùng `taoSchemaWebApplication`) và BreadcrumbList qua `KhungTrang`.

### 39.6. Liên kết vào trang

- Hub `/chiem-tinh`: thêm thẻ "Bản đồ sao" mô tả "Vị trí Mặt Trời, Mặt Trăng, các hành tinh và cung mọc lúc bạn sinh."
- Trang `/chiem-tinh/cung-hoang-dao`, ở kết quả tra cung: một dòng "Muốn xem cả Mặt Trăng, các hành tinh và cung mọc: [Lập bản đồ sao]". Liên kết mang sẵn `ngay`, `gio` nếu có.

### 39.7. CSS

Thêm vào `chiem-tinh.css` (hiện 11,7 KB, trần 30 KB), lớp `ck-ct-bds-*`:
- vòng SVG tối đa khoảng 520 px, căn giữa;
- bảng cuộn ngang trong khung ở 375 px, không tràn trang;
- màu theo biến có sẵn, đủ tương phản ở chế độ sáng và tối.

## Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua, trong đó có `ban-do-sao.test.mjs` (9 test) và `meta-dieu-huong.test.mjs`.
- Dev trả 200, không lỗi 500, cho:
  - `/chiem-tinh/ban-do-sao` và `?ngay=1990-07-04&gio=12:00&tinh=ha-noi`;
  - `?ngay=1990-07-04` (không giờ);
  - `?ngay=1968-01-31&gio=03:00&tinh=tp-ho-chi-minh` (UTC+8);
  - `?ngay=1950-01-01&gio=08:00&tinh=ha-noi` (múi giờ chưa chắc, có lời mời chọn lại);
  - `?ngay=1968-01-31&gio=03:00&tinh=ha-noi&lech=28800` (người dùng chọn lại);
  - `?ngay=abc`, `?ngay=1850-01-01`, `?ngay=2026-02-30`, `?tinh=khong-co`, `?lech=123` (báo nhẹ hoặc bỏ qua tham số sai, không 500).
- Đối chiếu ca Hà Nội 4/7/1990 12:00:
  - Mặt Trời ở Cự Giải khoảng 12°;
  - bảng ghi múi giờ UTC+7;
  - có ASC, MC, đủ 12 nhà.
- Trong `.next` sau `next build`, **không có `astronomy-engine` trong chunk client** (tìm chuỗi `Invalid refraction option` trong `.next/static`, phải 0 kết quả).
- Không có các chữ "tính cách", "hợp với", "nguyên tố", "may mắn" trên trang, trừ chữ nằm trong `GHI_CHU_TINH_CACH`.
- 0 lỗi console; không tràn ngang ở 375 px; không liên kết 404.
- Chụp ở 1366 và 375, lưu `docs/v2/bang-chung/ck-ct-bds-*.png`:
  - ca có giờ (Hà Nội 1990);
  - ca không giờ.

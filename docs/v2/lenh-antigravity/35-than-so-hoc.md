# Lệnh 35: Cụm `/than-so-hoc` (hub, số chủ đạo, 12 trang số, biểu đồ ngày sinh, theo tên, 9 trang năm cá nhân) + nút "Thêm" ở menu

Người giao: Claude Code, 23/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/35-bao-cao.md`.

Ràng buộc như Lệnh 25, 31–34:
- CSS chỉ dùng lớp `ck-`;
- không bịa nội dung;
- chỉ đặt liên kết tới trang có trong `trangDaDung()`;
- không cài gói, không commit.

Không sửa:
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`, `components/r1`;
- `ck.css` (đã chạm trần 60 KB).

Lệnh này **được sửa** `src/components/ck/DauTrang.tsx` (mục 1.9).

## Vì sao

Menu đã có mục "Thần số học" (`/than-so-hoc`, có cờ `them: true`), nhưng các trang đang 404.

Dòng SEO: `TSH`, `TSH-TINH`, `TSH-SO`, `TSH-TEN`, `TSH-BIEUDO`, `TSH-NAMCANHAN` trong `docs/v2/16-seo-trang.csv`. Chữ trong các dòng này đã sửa cho khớp nội dung dưới đây.

## Điều quan trọng nhất: KHÔNG có phần "ý nghĩa"

Thần số học **chưa có nguồn được phép trích** (docs/v2/12 mục 3). Vì vậy trang **chỉ có cách tính và số liệu đếm được**. Cụ thể, không viết:
- tính cách, điểm mạnh yếu, "người số 7 là người…";
- nghề hợp, tình yêu hợp, "số 3 hợp số 6";
- "năm cá nhân 1 là năm khởi đầu…", "mũi tên quyết tâm…", "đỉnh cao này là thời kỳ…";
- lịch sử môn học, Pythagoras, "thần số học là gì" theo kiểu bách khoa.

Ở chỗ người đọc mong thấy ý nghĩa (trang từng số, trang năm cá nhân, kết quả công cụ), hiện **đúng câu `GHI_CHU_Y_NGHIA`**. Câu tự viết chỉ được tả **cách tính** hoặc **điều đếm được**.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/than-so-hoc.ts`

Tệp nhẹ, không import gì, nên dùng được cả trong component client.

| Tên | Trả về |
|---|---|
| `SO_CHU_DAO` | `[1..9, 11, 22, 33]` |
| `SO_MASTER` | `[11, 22, 33]` |
| `NAM_CA_NHAN` | `[1..9]` |
| `docNgay(s)` | nhận `"1990-08-15"` hoặc `"15/08/1990"` → `{ ngay, thang, nam }`; sai hoặc ngoài 1900–2100 → `undefined` |
| `vietNgay(d)`, `isoNgay(d)` | `"15/08/1990"`, `"1990-08-15"` |
| `rutGon(n)` | `{ so, buoc }`, vd `29` → `buoc [29, 11]` (giữ 11, 22, 33) |
| `soChuDao(d)` | `{ cach1, cach2, khac }`. Mỗi cách có `{ phepCong, tong, buoc, so }`; `cach2.phan` = `[ngày rút, tháng rút, năm rút]` |
| `namCaNhan(ngay, thang, namXet)` | `{ phepCong, tong, buoc, so }` (1–9) |
| `ngayCoNamCaNhan(n, namXet)` | 12 dòng `{ thang, ngay: number[] }` (có 29/2) |
| `LUOI` | lưới 3 × 3: `[[3,6,9],[2,5,8],[1,4,7]]` (hàng trên trước) |
| `DUONG_BIEU_DO` | 8 đường `{ ma, ten ("Hàng trên"…), so: [a,b,c] }` |
| `bieuDoNgaySinh(d)` | `{ dem: {1..9: số lần}, soKhong, thieu: number[], duongDay, duongTrong }` |
| `bonDinhCao(d)` | 4 dòng `{ thu, so, phepCong, tuTuoi, denTuoi }`; `denTuoi` null ở đỉnh 4 |
| `BANG_CHU` | 9 cột `{ so, chu: ['A','J','S'] }` |
| `NGUYEN_AM` | A E I O U Y |
| `theoTen(hoTen)` | `{ chu: [{goc, chu, so, nguyenAm}], ten, linhHon, nhanCach }`, mỗi chỉ số dạng `{ phepCong, tong, buoc, so }`; tên không có chữ → `undefined` |
| `thongKeSoChuDao()` | `{ tu: 1930, den: 2030, tongNgay, soNgayKhac, cach1: {so: số ngày}, cach2 }` |
| `viDuNgay(so, nam, toiDa)` | vài ngày trong năm có số chủ đạo `so` (cách 1) |
| `tongDanToi(so)` | các tổng (trước khi rút) cho ra `so`, vd 11 → `[11, 29, 38, 47]` |
| `soTuSlug(s, ds)` | số hoặc `undefined` (chặn "07", "10") |
| `duongDanSoChuDao(n)`, `duongDanNamCaNhan(n)` | đường dẫn |
| `QUY_UOC` | 5 câu về các điểm sách tính khác nhau |
| `GIOI_HAN` | câu giới hạn cuối trang (bắt buộc) |
| `GHI_CHU_Y_NGHIA` | câu giải thích vì sao chưa có phần ý nghĩa |

Lấy năm hiện tại theo giờ Việt Nam: `ngayHienTaiVN().nam` từ `src/lib/trang/lich.ts`.

## 1. Việc cần làm

### 1.1. Route

| Đường dẫn | Dòng SEO | Ghi chú |
|---|---|---|
| `src/app/(v2)/than-so-hoc/page.tsx` | `TSH` | hub |
| `src/app/(v2)/than-so-hoc/so-chu-dao/page.tsx` | `TSH-TINH` | công cụ, tham số `?ngay=1990-08-15`, render ở server |
| `src/app/(v2)/than-so-hoc/so-chu-dao/[so]/page.tsx` | `TSH-SO` | 12 trang |
| `src/app/(v2)/than-so-hoc/bieu-do-ngay-sinh/page.tsx` | `TSH-BIEUDO` | công cụ, `?ngay=`, render ở server |
| `src/app/(v2)/than-so-hoc/theo-ten/page.tsx` | `TSH-TEN` | phần tính là component client |
| `src/app/(v2)/than-so-hoc/nam-ca-nhan/[so]/page.tsx` | `TSH-NAMCANHAN` | 9 trang |

- Trang `[so]`: `soTuSlug(params.so, SO_CHU_DAO)` (hoặc `NAM_CA_NHAN`) undefined → `notFound()`. `generateStaticParams` lấy từ danh sách.
- Mọi trang `export const revalidate = 3600`.
- Trang công cụ có tham số: `robots: { index: false, follow: true }`, canonical sạch, làm theo `src/app/(v2)/phong-thuy/cung-phi/page.tsx`.
- Form `method="get"` dùng `<input type="date" name="ngay" min="1900-01-01" max="2100-12-31">`. Ngày sai hiện báo lỗi trong form, không 500.
- **Không có** `/than-so-hoc/nam-ca-nhan` (trang gốc). Breadcrumb tự bỏ đoạn đó.

### 1.2. Metadata

Gọi `metaTrang(duongDan, MAC_DINH, mau, thamSo)`, lấy h1 bằng `thongTinTrang` như cụm Phong thủy.

| Trang | `mau` | `thamSo` |
|---|---|---|
| hub, 3 công cụ | — | — |
| số chủ đạo | `/than-so-hoc/so-chu-dao/{n}` | `{ n: String(so) }` |
| năm cá nhân | `/than-so-hoc/nam-ca-nhan/{n}` | `{ n: String(so) }` |

JSON-LD (escape `<` như Lệnh 29):
- hub: `CollectionPage` + `BreadcrumbList`;
- 3 công cụ: `WebApplication` + `BreadcrumbList`;
- trang số: `DefinedTerm`. `description` chỉ tả phép tính, vd "Tổng chữ số ngày sinh rút gọn ra 7". Kèm `WebPage` + `BreadcrumbList`.

Breadcrumb: `breadcrumb(duongDan, tenCuoi)`. `tenCuoi` là "Số chủ đạo {n}" hoặc "Năm cá nhân {n}".

### 1.3. Hub `/than-so-hoc`

1. Ba thẻ lớn: **Tính số chủ đạo**, **Biểu đồ ngày sinh**, **Theo họ tên**.
2. Form ngày sinh nhỏ gửi sang `/than-so-hoc/so-chu-dao`.
3. **12 số chủ đạo**: lưới 12 ô (1–9, rồi 11, 22, 33 tách nhóm "số giữ nguyên"). Mỗi ô ghi số và tỉ lệ ngày sinh 1930–2030 theo cách 1 (từ `thongKeSoChuDao`, làm tròn 1 chữ số thập phân), liên kết sang trang số.
4. **Năm cá nhân**: hàng 9 ô 1–9, liên kết sang trang năm cá nhân.
5. **Cách tính tóm tắt** gồm ba dòng:
   - số chủ đạo: cộng chữ số ngày sinh dương lịch rồi rút gọn;
   - năm cá nhân: ngày, tháng sinh cộng năm đang xét;
   - tên: bảng chữ A–Z ra 1–9.

   Kèm bảng `BANG_CHU` (9 cột).
6. **Quy ước**: danh sách `QUY_UOC`.
7. `KhoiDienGiai` với `noiDungTheoDuongDan('/than-so-hoc')`, chỉ khi có nội dung đã duyệt.
8. Cuối trang: `GIOI_HAN`.

### 1.4. Công cụ số chủ đạo `/than-so-hoc/so-chu-dao`

1. Form ngày sinh dương lịch. Dưới ô nhập ghi: "Dùng ngày sinh dương lịch. Biết ngày âm thì đổi ở" + liên kết `/lich-am/doi-ngay`.
2. Khi có kết quả:
   - thẻ lớn "Số chủ đạo {cach1.so}", liên kết trang số đó;
   - **Cách 1, cộng dồn**: dòng `phepCong`, rồi chuỗi `buoc` dạng "33 → giữ nguyên" hoặc "39 → 12 → 3";
   - **Cách 2, rút từng phần**: ngày → `phan[0]`, tháng → `phan[1]`, năm → `phan[2]` (mỗi phần có bước rút), rồi `phepCong` và `buoc`;
   - nếu `khac`: một dòng in đậm "Hai cách cho kết quả khác nhau: {cach1.so} và {cach2.so}", liên kết cả hai trang số; nếu không khác: "Hai cách cùng ra {so}";
   - **Năm cá nhân** năm nay và năm sau: `namCaNhan(ngay, thang, nam)`, có phép cộng, liên kết trang năm cá nhân;
   - liên kết "Xem biểu đồ ngày sinh" → `/than-so-hoc/bieu-do-ngay-sinh?ngay=…`;
   - `GHI_CHU_Y_NGHIA`.
3. **Cách tính** (luôn hiện): một ví dụ cố định 15/08/1990, lấy kết quả từ `soChuDao` (cách 1 ra 33, cách 2 ra 6), và `QUY_UOC`.
4. `GIOI_HAN`.

### 1.5. Trang số `/than-so-hoc/so-chu-dao/{n}`

1. Đầu trang: số lớn. Với số 11, 22, 33 thêm dòng "Số giữ nguyên, không rút về {soGoc}" (11 → 2, 22 → 4, 33 → 6).
2. **Tổng nào ra {n}**: `tongDanToi(n)`, vd "11, 29, 38, 47". Với 2, 4, 6, ghi thêm: 11, 22, 33 không rút về số này theo quy ước giữ nguyên.
3. **Ví dụ ngày sinh**: `viDuNgay(n, 1990, 3)` và `viDuNgay(n, 2000, 3)`. Mỗi ví dụ in phép cộng cách 1, liên kết `/than-so-hoc/so-chu-dao?ngay=…`.
4. **Bao nhiêu ngày sinh ra {n}** (1930–2030):
   - số ngày và tỉ lệ theo cách 1 và cách 2;
   - một dòng: "Hai cách khác nhau ở {soNgayKhac} trên {tongNgay} ngày".
5. `GHI_CHU_Y_NGHIA`.
6. Thanh 12 số để chuyển nhanh; liên kết công cụ, hub, biểu đồ.
7. `GIOI_HAN`.

### 1.6. Biểu đồ ngày sinh `/than-so-hoc/bieu-do-ngay-sinh`

1. Form ngày sinh như 1.4.
2. Khi có kết quả:
   - **lưới 3 × 3** theo `LUOI`: mỗi ô in số đó lặp theo `dem` (vd "11", "999"), ô trống thì để trống có viền mờ;
   - dòng "Số 0 xuất hiện {soKhong} lần (không đặt vào lưới)";
   - "Thiếu: {thieu}";
   - **Đường đủ 3 số** và **Đường trống cả 3 số**: liệt kê `ten` + 3 số. Tô đường đó trên lưới bằng vạch, kèm chữ, không chỉ dùng màu. Thêm một dòng: "Một số sách gọi các đường này là 'mũi tên' và đặt tên riêng cho từng đường; tên gọi khác nhau giữa các sách nên trang chỉ ghi vị trí.";
   - **4 đỉnh cao**: bảng gồm thứ tự, phép cộng, số, khoảng tuổi ("0–30", "31–39", "40–48", "49 trở đi"), kèm một dòng quy ước "Đỉnh 1 kết thúc ở tuổi 36 trừ số chủ đạo (rút về 1 chữ số); mỗi đỉnh sau dài 9 năm. Sách khác có thể lấy mốc tuổi khác.";
   - `GHI_CHU_Y_NGHIA`.
3. **Cách vẽ** (luôn hiện): lưới mẫu 15/08/1990.
4. `GIOI_HAN`.

### 1.7. Theo tên `/than-so-hoc/theo-ten`

1. Phần tính là **component client** (`'use client'`):
   - **không** đưa tên lên URL, **không** gửi request, không lưu localStorage;
   - ô nhập họ tên đủ dấu, kết quả cập nhật khi bấm "Tính" hoặc Enter;
   - dưới ô ghi: "Tên chỉ được tính trên máy bạn, không gửi đi."
2. Kết quả:
   - từng chữ thành ô nhỏ (chữ gốc, chữ đã bỏ dấu, số); nguyên âm tô khác và ghi "nguyên âm";
   - ba chỉ số **Chỉ số tên** (mọi chữ), **Linh hồn** (nguyên âm), **Nhân cách** (phụ âm), mỗi chỉ số có `phepCong` và `buoc`, số liên kết trang số chủ đạo cùng số (cùng thang 1–9, 11, 22, 33);
   - `GHI_CHU_Y_NGHIA`.
3. Phần server (luôn hiện):
   - bảng `BANG_CHU`;
   - quy ước tên tiếng Việt (câu cuối của `QUY_UOC`);
   - ví dụ cố định "Nguyễn Văn An" tính sẵn bằng `theoTen`.
4. `GIOI_HAN`.

### 1.8. Năm cá nhân `/than-so-hoc/nam-ca-nhan/{n}`

1. Đầu trang: số lớn. Một dòng cách tính: "Cộng chữ số ngày sinh, tháng sinh với năm đang xét, rút về 1–9." Kèm ví dụ: ngày đầu tiên trong `ngayCoNamCaNhan(n, namNay)`, phép cộng đầy đủ.
2. **Ngày sinh có năm cá nhân {n}**: hai bảng, năm nay và năm sau.
   - Mỗi bảng 12 tháng, mỗi tháng liệt kê các ngày từ `ngayCoNamCaNhan`.
   - 375 px: bảng gọn, không tràn ngang.
3. Một dòng quy ước: "Sách lấy mốc đổi năm cá nhân là 1/1, sách lấy ngày sinh nhật."
4. `GHI_CHU_Y_NGHIA`.
5. Thanh 9 số chuyển nhanh; liên kết công cụ số chủ đạo (có tính năm cá nhân), hub.
6. `GIOI_HAN`.

### 1.9. Menu: nút "Thêm" (sửa `src/components/ck/DauTrang.tsx`)

Hiện menu desktop có "Trang chủ" + 8 hub, tổng ~1.088/1.120 px ở 1366 px, nên không còn chỗ. Sắp tới còn Chiêm tinh và Phong tục.

- **Desktop**:
  - bỏ mục "Trang chủ" (logo đã là liên kết về trang chủ);
  - mục có `m.them === true` không hiện thành mục riêng mà gom vào **một mục cuối "Thêm"**. Mục "Thêm" là nút có mũi tên, mở menu con giống các mục khác (hover, bấm, Esc, bấm ngoài để đóng; `aria-expanded`, `aria-haspopup`);
  - trong menu con "Thêm", mỗi hub là một liên kết đậm, dưới đó là các trang con thụt vào;
  - "Thêm" có `ck-on` khi trang hiện tại thuộc một hub trong nhóm.
- **Ngăn kéo mobile**: giữ nguyên, có "Trang chủ" và mọi hub (kể cả `them`).
- Không có mục `them` nào thì không hiện "Thêm".
- **Nghiệm thu menu**:
  - một hàng ở 1001, 1240, 1241, 1366, 1920 px;
  - menu con "Thêm" không bị cắt mép phải;
  - dùng được bàn phím (Tab tới nút, Enter mở, Esc đóng).
- CSS của menu đặt trong `src/app/(v2)/ck-nen.css`. Tệp này nạp **trước** `ck.css`, nên selector phải cụ thể hơn, vd `.ck-menu-ds .ck-…`. Tệp hiện 720 B; giữ dưới 3 KB.

### 1.10. CSS cụm

- Tệp mới `src/app/(v2)/than-so-hoc/than-so-hoc.css` (trần 30 KB), lớp `ck-tsh-*`, nạp bằng `layout.tsx` của cụm.
- Màu, font lấy biến của `ck.css`.
- Số lớn dùng font serif sẵn có, giữ phong cách Á Đông cổ điển như các cụm trước. Không dùng hình vũ trụ, hành tinh, ánh sáng huyền bí.

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua, có `than-so-hoc.test.mjs` và `meta-dieu-huong.test.mjs`.
- Dev trả 200:
  - `/than-so-hoc`, `/than-so-hoc/so-chu-dao`, `/than-so-hoc/so-chu-dao?ngay=1990-08-15`;
  - 12 trang `/than-so-hoc/so-chu-dao/{1..9,11,22,33}`;
  - `/than-so-hoc/bieu-do-ngay-sinh`, `/than-so-hoc/bieu-do-ngay-sinh?ngay=1990-08-15`;
  - `/than-so-hoc/theo-ten`;
  - 9 trang `/than-so-hoc/nam-ca-nhan/{1..9}`.
- Dev trả 404: `/than-so-hoc/so-chu-dao/10`, `/than-so-hoc/so-chu-dao/07`, `/than-so-hoc/nam-ca-nhan/11`.
- `?ngay=2023-02-29` và `?ngay=abc` trả 200, có báo lỗi.
- Đối chiếu:
  - 15/08/1990:
    - cách 1: `1 + 5 + 8 + 1 + 9 + 9 + 0 = 33`, giữ 33;
    - cách 2: 6, 8, 1, tổng 15, ra 6, có dòng "khác nhau";
    - biểu đồ: 1 ×2, 5, 8, 9 ×2, số 0 một lần, thiếu 2 3 4 6 7, đường đủ duy nhất là chéo 1-5-9;
    - 4 đỉnh cao: 5 (0–30), 7 (31–39), 3 (40–48), 9 (49 trở đi).
  - 04/07/1872: cách 1 ra 11, cách 2 ra 2.
  - 01/01/2000: số chủ đạo 4, hàng trên (3-6-9) trống.
  - "Nguyễn Thị Mỹ Đức": chữ bỏ dấu `NGUYENTHIMYDUC`, nguyên âm U Y E I Y U, linh hồn tổng 34 → 7.
- Không có câu nào tả tính cách, nghề hay ý nghĩa: tự rà bằng mắt và ghi vào báo cáo.
- Title không còn `{...}`; 0 lỗi console; không tràn ngang ở 375 px; không liên kết 404.
- Chụp ở 1366 và 375, lưu `docs/v2/bang-chung/ck-than-so-*.png`:
  - hub;
  - so-chu-dao có kết quả;
  - số 7, số 33;
  - biểu đồ có kết quả;
  - theo tên có kết quả;
  - năm cá nhân 5;
  - menu desktop khi mở "Thêm".
- Báo cáo theo mẫu Lệnh 25.

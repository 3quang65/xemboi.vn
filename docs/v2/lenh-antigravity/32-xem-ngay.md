# Lệnh 32: Cụm `/xem-ngay` (hub, 6 trang việc, trang tháng)

Người giao: Claude Code, 23/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/32-bao-cao.md`.

Ràng buộc như Lệnh 25 và 31:
- CSS chỉ dùng lớp `ck-`;
- không bịa nội dung, không tự dịch nguyên văn chữ Hán;
- chỉ đặt liên kết tới `trangDaDung()` hoặc trang tháng hợp lệ (mục 1.5);
- không cài gói, không commit.

Không sửa:
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`, `components/r1`;
- `ck.css` (đã chạm trần 60 KB);
- `src/app/(v2)/xem-ngay/xuat-hanh/**` (đã xong ở Lệnh 31).

## Vì sao

Cụm Xem ngày là đợt F6 (16-seo-trang.csv, nhóm `XN`). Menu chính đã có mục "Xem ngày" với 6 trang con, nhưng các trang đang 404.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/xem-ngay.ts`

Ba lớp, mỗi lớp một nguồn. **Trang hiện cả ba lớp cạnh nhau, không gộp thành điểm, không kết luận "ngày tốt nhất".**

1. **12 trực** (`truc`): `{ ten, han, nhom, viec, viecHan }`.
   - `nhom` là xếp hoàng/hắc theo câu ca Ngọc hạp ký. Nhãn hiển thị lấy từ `TEN_NHOM_TRUC[nhom]`.
   - `viec` là việc câu ca gán cho trực (dịch sát, đã có sẵn). `null` thì không hiện gì.
2. **12 thần hoàng đạo / hắc đạo** (`than`): `{ ten, han, hoangDao }`. Quy tắc theo Hiệp kỷ biện phương thư 卷七.
3. **Nghi / kỵ / cát thần / hung sát** (`nghi`, `ky`, `catThan`, `hungSat`): mảng `{ han, ten }`.
   - Đây là bảng của thư viện mở lunar-javascript. Thư viện không ghi sách gốc.
   - Mọi chỗ hiện lớp này phải có dòng: "Theo bảng nghi kỵ của thư viện mở lunar-javascript (MIT); thư viện không ghi sách gốc."

Hàm:

| Hàm | Trả về |
|---|---|
| `xemNgay(ngay, thang, nam)` | `NgayXem`: `iso`, `lich` (ChiTietNgay của lich.ts: âm lịch, thứ, giờ hoàng đạo…), `thangTiet` (tháng theo tiết: `canChi.ten`, `han`), `ngayHan`, `truc`, `than`, `nghi`, `ky`, `catThan`, `hungSat` |
| `thangXemNgay(nam, thang)` | `NgayXem[]` cả tháng dương |
| `ngayTheoViec(ma, nam, thang)` | `{ viec, ngay[], hop[], ky[] }`. Mỗi ngày: `iso, ngay, thu, am, canChiNgay, truc, than, ket ('hop' \| 'ky' \| 'khac'), phuNghi[]` |
| `VIEC[ma]` | `{ ten, chinh[], phu[], trucCauCa[], ghiChu }`. `ghiChu` khác `null` thì **bắt buộc hiện** (trang mua xe) |
| `MA_VIEC_CO_TRANG`, `laMaViec(s)` | 6 việc có trang: cuoi-hoi, khai-truong, dong-tho, nhap-trach, mua-xe, cat-toc |
| `phanTichThangXemNgay('thang-02-2027')` | `{ nam, thang }` hoặc `null` (sai mẫu hoặc ngoài 2020–2035) |
| `doanThang(nam, thang)`, `thangKe(nam, thang)` | đoạn URL `thang-mm-yyyy`; tháng trước/sau (null nếu ngoài khoảng) |
| `NGUON_XEM_NGAY` | `hiepKy`, `ngocHap`, `lunarJs`: tên sách, `ghiCong`, `url` |
| `TRICH_DOAN` | `ngocHapTruc`, `hiepKyThan`, `hiepKyNhanXet`: `nguyenVan`, `viTri`, `doanId` |

Lưu ý: `lich.canChiThang` là can chi **tháng âm**; xem ngày dùng **tháng tiết** (`thangTiet`). Hai cái có thể khác nhau; trang xem ngày chỉ hiện `thangTiet`, ghi là "tháng (theo tiết khí)".

## 1. Việc cần làm

### 1.1. Route

Next.js ưu tiên thư mục tĩnh `xuat-hanh` trước thư mục động, nên dùng hai route động:

- `src/app/(v2)/xem-ngay/page.tsx`: hub (`XN`).
- `src/app/(v2)/xem-ngay/[ma]/page.tsx`:
  - `laMaViec(ma)` → trang việc (`XN-CUOI`, `XN-KHAITRUONG`, …);
  - `phanTichThangXemNgay(ma)` khác null → trang tháng (`XN-THANG`);
  - còn lại `notFound()`.
- `src/app/(v2)/xem-ngay/[ma]/[thang]/page.tsx`: trang việc theo tháng (`XN-VIEC-THANG`). `laMaViec(ma)` và `phanTichThangXemNgay(thang)` phải cùng hợp lệ, không thì `notFound()`.
- Cả ba: `export const revalidate = 3600`. Không `generateStaticParams`.

### 1.2. Metadata (giống Lệnh 31)

Gọi `metaTrang(duongDan, MAC_DINH, mau, thamSo)`. Thân trang lấy h1 bằng `thongTinTrang` với đúng tham số đó.

| Trang | `duongDan` | `mau` | `thamSo` |
|---|---|---|---|
| hub | `/xem-ngay` | — | — |
| việc | `/xem-ngay/${ma}` | — | `{ yyyy, m }` (năm, tháng hiện tại giờ VN) |
| tháng | `/xem-ngay/thang-mm-yyyy` | `/xem-ngay/thang-{mm}-{yyyy}` | `{ yyyy, m, mm }` |
| việc theo tháng | `/xem-ngay/${ma}/thang-mm-yyyy` | `/xem-ngay/{viec}/thang-{mm}-{yyyy}` | `{ yyyy, m, mm, viec: ma, 'việc': VIEC[ma].ten.toLowerCase() }` |

- `MAC_DINH` tự viết ngắn, chỉ nói điều trang có (hoàng đạo, 12 trực, nghi kỵ). Không viết "theo tuổi", "28 sao", "đại hung", "đắt hàng".
- JSON-LD: `WebPage` + `BreadcrumbList` qua `schemaBreadcrumb(breadcrumb(duongDan, tenCuoi))`. Trang tháng truyền `tenCuoi` như "Tháng 2/2027". Escape `<` như Lệnh 29.
- Ngày "hiện tại" lấy bằng `ngayHienTaiVN()` trong `lich.ts`.

### 1.3. Hub `/xem-ngay`

Dùng `KhungTrang`. Các phần lần lượt:

1. **Hôm nay** (và một thẻ nhỏ **ngày mai**): `xemNgay(...)` của hôm nay.
   - Ngày dương, âm, thứ, can chi ngày, tháng theo tiết.
   - Thần: tên + nhãn "Hoàng đạo"/"Hắc đạo".
   - Trực: tên + `TEN_NHOM_TRUC[nhom]` + `viec` nếu có.
   - Nghi (tối đa 8 mục, còn lại "và N việc khác" mở bằng `<details>`), Kỵ (như vậy), cát thần, hung sát.
   - Liên kết sang trang ngày `/lich-am/yyyy/mm/dd` qua `duongDanNgayTuIso`.
2. **Chọn theo việc:** 6 thẻ cho `MA_VIEC_CO_TRANG`. Mỗi thẻ ghi số ngày `hop` trong tháng này (`ngayTheoViec(ma, nam, thang).hop.length`), liên kết `/xem-ngay/${ma}`. Thêm thẻ thứ 7 "Giờ xuất hành Tết" → `/xem-ngay/xuat-hanh`.
3. **Bảng tháng này:** liên kết `/xem-ngay/${doanThang(nam, thang)}` và tháng sau.
4. **Ba hệ nói gì, theo sách nào** (khối giải thích, dùng lại ở mọi trang của cụm; nên tách thành một component trong `src/app/(v2)/xem-ngay/`):
   - 12 trực: nguyên văn `TRICH_DOAN.ngocHapTruc` trong `<blockquote lang="zh-Hant">`, ghi `viTri`, ghi công Ngọc hạp ký. Kèm bảng 12 trực: tên, chữ Hán, nhóm, việc.
   - 12 thần: nguyên văn `TRICH_DOAN.hiepKyThan`; bảng 12 thần (tên, chữ Hán, hoàng/hắc). Ngay dưới, nguyên văn `TRICH_DOAN.hiepKyNhanXet` và câu: "Chính Hiệp kỷ ghi rằng không có lý do thiên văn để chỉ sáu thần này là hoàng đạo."
   - Nghi kỵ: câu bắt buộc ở phần "Dữ liệu" phía trên, kèm liên kết `NGUON_XEM_NGAY.lunarJs.url`.
   - Câu chung: "Hai hệ hoàng đạo (theo trực và theo 12 thần) có thể nói khác nhau về cùng một ngày. Trang hiện cả hai, không gộp."
   - Liên kết `/phuong-phap` và `/nguon`.

### 1.4. Trang việc `/xem-ngay/{ma}`

1. Tóm tắt:
   - tên việc;
   - mục nghi kỵ dùng để lọc: `VIEC[ma].chinh`, hiện chữ Hán kèm tên tiếng Việt lấy từ `TEN_NGHI_KY` (`src/lib/trang/xem-ngay-thuat-ngu.ts`, chỉ import);
   - `ghiChu` nếu có, đặt trong khung nổi bật.
2. **Tháng này và tháng sau**, mỗi tháng một khối (`ngayTheoViec`):
   - Danh sách ngày `hop`: ngày dương + thứ, ngày âm, can chi, trực (tên + nhóm), thần (tên + hoàng/hắc), `phuNghi` nếu có.
   - Nếu trực của ngày nằm trong `VIEC[ma].trucCauCa` thì gắn nhãn nhỏ "Trực {ten}: câu ca ghi {viec}".
   - Danh sách ngày `ky` (thu gọn trong `<details>`), ghi "Bảng ghi kỵ {tên việc}".
   - Không có ngày `hop` thì ghi "Tháng này bảng nghi kỵ không có ngày nào ghi nghi {tên việc}."
   - Liên kết "Xem cả tháng" → `/xem-ngay/${ma}/${doanThang(...)}`.
3. **12 tháng tới:** lưới liên kết tới `/xem-ngay/${ma}/thang-mm-yyyy` (chỉ tháng hợp lệ), mỗi ô ghi số ngày hợp.
4. Khối "Ba hệ nói gì" (1.3 mục 4).
5. Liên kết cuối:
   - cưới hỏi → `/xem-tuoi/vo-chong`;
   - mọi trang → `/xem-ngay`, `/lich-am`.

Không thêm: lọc theo tuổi, Kim lâu, Tam tai, văn khấn, lời khuyên.

### 1.5. Trang tháng `/xem-ngay/thang-mm-yyyy` và `/xem-ngay/{ma}/thang-mm-yyyy`

- **Trang tháng chung:** bảng cả tháng (`thangXemNgay`).
  - Cột: ngày dương + thứ, âm, can chi, thần (hoàng/hắc), trực (nhóm), nghi (5 mục đầu), kỵ (5 mục đầu).
  - 375 px: thẻ xếp dọc, không tràn ngang.
  - Hàng của hôm nay tô nhẹ.
- **Trang việc theo tháng:** giống khối tháng ở 1.4 nhưng cho đúng tháng đó, kèm danh sách mọi ngày `khac` thu gọn.
- **Điều hướng:** tháng trước/sau (`thangKe`), về trang việc hoặc hub.
- **Liên kết hợp lệ:** liên kết tới trang tháng chỉ đặt khi `phanTichThangXemNgay(doanThang(nam, thang))` khác null.

### 1.6. CSS

- Thêm vào `src/app/(v2)/xem-ngay/xem-ngay.css` (hiện 8,3 KB, trần 30 KB), lớp `ck-xn-*`.
- Nhãn hoàng đạo / hắc đạo phân biệt bằng chữ, không chỉ bằng màu.
- Màu và font lấy biến sẵn của `ck.css`.

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua (có `xem-ngay.test.mjs`).
- Dev trả 200 cho:
  - `/xem-ngay`;
  - 6 trang việc;
  - `/xem-ngay/thang-02-2027`;
  - `/xem-ngay/cuoi-hoi/thang-02-2027`.
- Dev trả 404 cho `/xem-ngay/abc`, `/xem-ngay/thang-13-2027`, `/xem-ngay/cuoi-hoi/thang-01-2040`.
- `/xem-ngay/xuat-hanh` vẫn là trang Tết của Lệnh 31.
- Số liệu khớp lib. Đối chiếu ngày 23/11/2026: tháng Kỷ Hợi (theo tiết), ngày Tân Sửu, trực Mãn (Hắc theo Ngọc hạp ký), thần Ngọc đường (Hoàng đạo).
- Trang mua xe hiện `ghiChu`; mọi trang có dòng nguồn lunar-javascript.
- 0 lỗi console, không tràn ngang ở 375 px, không có liên kết 404.
- Chụp hub, một trang việc, một trang tháng ở 1366 và 375; lưu `docs/v2/bang-chung/ck-xem-ngay-*.png`.
- Báo cáo theo mẫu Lệnh 25.

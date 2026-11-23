# Báo cáo Lệnh 32: Cụm `/xem-ngay` (hub, 6 trang việc, trang tháng)

Ngày hoàn thành: 23/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/app/(v2)/xem-ngay/XemNgayHelpers.ts` (`3.679` byte) — Hàm dùng chung cho cụm `/xem-ngay`: hằng số `NGUON_LUNAR_BAT_BUOC`, `thangXemNgayHopLe`, `homNayVaNgayMaiVN`, `taoSchemaWebPage`, `serializeJsonLd`, các hàm `macDinhHub` / `macDinhViec` / `macDinhThang` / `macDinhViecThang`, và `muoiHaiThangToi`.
- `src/app/(v2)/xem-ngay/BaHeGiaiThich.tsx` (`6.578` byte) — Khối `"Ba hệ nói gì, theo sách nào"` dùng lại ở mọi trang của cụm: câu chung hai hệ hoàng đạo không gộp; nguyên văn `TRICH_DOAN.ngocHapTruc` trong `<blockquote lang="zh-Hant">` + ghi công `NGUON_XEM_NGAY.ngocHap` + bảng 12 trực (`TEN_NHOM_TRUC`, ô việc trống khi `viec === null`); nguyên văn `TRICH_DOAN.hiepKyThan` + ghi công `NGUON_XEM_NGAY.hiepKy` + bảng 12 thần + nguyên văn `TRICH_DOAN.hiepKyNhanXet` và câu nhận xét của Hiệp kỷ; dòng nguồn bắt buộc của `lunar-javascript` + liên kết `NGUON_XEM_NGAY.lunarJs.url`; và liên kết `/phuong-phap`, `/nguon` (kiểm tra `trangDaDung()`).
- `src/app/(v2)/xem-ngay/KhoiViecThang.tsx` (`8.181` byte) — Xuất `TomTatViec` (hiển thị tên việc, `chinh` và `phu` kèm chữ Hán + `TEN_NGHI_KY`, và khung nổi bật `ghiChu` nếu có) và `KhoiViecThang` (bảng ngày `hop`, nhãn `"Trực {ten}: câu ca ghi {viec}"` theo `trucCauCa`, câu báo khi 0 ngày hợp, `<details>` danh sách `ky` và tùy chọn `khac`, dòng nguồn `lunar-javascript`, liên kết `"Xem cả tháng"` khi hợp lệ).
- `src/app/(v2)/xem-ngay/page.tsx` (`12.631` byte) — Hub `/xem-ngay` (`export const revalidate = 3600`, không `generateStaticParams`): metadata qua `metaTrang('/xem-ngay', ...)`, JSON-LD `WebPage`, thẻ **Hôm nay** và **Ngày mai** (`xemNgay(...)`, chỉ hiện `thangTiet` ghi `"Tháng (theo tiết khí)"`, ba lớp cạnh nhau không gộp điểm, Nghi/Kỵ/Cát thần/Hung sát thu gọn quá 8 mục bằng `<details>`, liên kết `/lich-am/yyyy/mm/dd`), 6 thẻ việc + thẻ thứ 7 `"Giờ xuất hành Tết"` → `/xem-ngay/xuat-hanh`, liên kết bảng tháng này và tháng sau, `<BaHeGiaiThich />`, và liên kết cuối.
- `src/app/(v2)/xem-ngay/[ma]/page.tsx` (`14.126` byte) — Route động cấp 1 (`export const revalidate = 3600`, không `generateStaticParams`):
  - Nhánh `laMaViec(ma)` (6 trang việc: `cuoi-hoi`, `khai-truong`, `dong-tho`, `nhap-trach`, `mua-xe`, `cat-toc`): gọi `metaTrang` / `thongTinTrang` với `{ yyyy, m }`, `<TomTatViec />`, khối tháng này & tháng sau (`KhoiViecThang`), lưới 12 tháng tới lọc qua `thangXemNgayHopLe`, `<BaHeGiaiThich />`, liên kết cuối (`/xem-tuoi/vo-chong` riêng cho `cuoi-hoi`, `/xem-ngay`, bảng tháng hiện tại, `/lich-am`).
  - Nhánh `phanTichThangXemNgay(ma)` (trang tháng chung): gọi `metaTrang` / `thongTinTrang` với mẫu `/xem-ngay/thang-{mm}-{yyyy}` và `{ yyyy, m, mm }`, điều hướng tháng trước/sau (`thangKe`), thanh lọc nhanh sang 6 trang việc theo tháng, bảng 7 cột `thangXemNgay(nam, thang)` (tô nhẹ hàng hôm nay, chuyển thẻ dọc ở `≤ 960px`, hiện `thangTiet`), `<BaHeGiaiThich />`, liên kết cuối.
  - Còn lại: `notFound()`.
- `src/app/(v2)/xem-ngay/[ma]/[thang]/page.tsx` (`5.673` byte) — Route động cấp 2 (`export const revalidate = 3600`, không `generateStaticParams`): kiểm tra đồng thời `laMaViec(ma)` và `phanTichThangXemNgay(thang)` (sai gọi `notFound()`), gọi `metaTrang` / `thongTinTrang` với mẫu `/xem-ngay/{viec}/thang-{mm}-{yyyy}` và `{ yyyy, m, mm, viec, 'việc' }`, `<TomTatViec />`, điều hướng tháng trước/sau + về trang việc + bảng cả tháng, `<KhoiViecThang ... hienNgayKhac />`, `<BaHeGiaiThich />`, liên kết cuối.
- `docs/v2/lenh-antigravity/32-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/`:
  - `ck-xem-ngay-hub-1366.png` (`1.180.423` byte)
  - `ck-xem-ngay-hub-375.png` (`846.703` byte)
  - `ck-xem-ngay-mua-xe-1366.png` (`1.271.662` byte)
  - `ck-xem-ngay-mua-xe-375.png` (`1.021.833` byte)
  - `ck-xem-ngay-thang-02-2027-1366.png` (`1.775.196` byte)
  - `ck-xem-ngay-thang-02-2027-375.png` (`1.616.739` byte)
  - `ck-xem-ngay-cuoi-hoi-thang-02-2027-1366.png` (`1.184.969` byte)
  - `ck-xem-ngay-cuoi-hoi-thang-02-2027-375.png` (`880.862` byte)

### Tệp chỉnh sửa
- `src/app/(v2)/xem-ngay/xem-ngay.css` (từ `8.336` byte lên `23.909` byte ≤ `30.720` byte / 30 KB) — Giữ nguyên toàn bộ phần `.ck-xh-*` của Lệnh 31, bổ sung quy tắc với tiền tố `ck-xn-*` và các biến `--ck-*` của `ck.css`: bố cục Hub (Hôm nay + Ngày mai, 3 lớp cạnh nhau, 7 thẻ việc), nhãn hoàng/hắc/nhóm trực phân biệt bằng cả chữ và màu, khung ghi chú nổi bật, bảng việc và bảng tháng 7 cột co thành thẻ xếp dọc không tràn ngang ở mobile, lưới 12 tháng tới, khối `"Ba hệ nói gì"`.

### Xác nhận vùng cấm
- Không sửa `src/lib/**`, `src/app/api/**`, `prisma/**`, `scripts/**`, `src/middleware.ts`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css` (`60.613` byte), `src/app/(v2)/xem-ngay/xuat-hanh/**`, `package.json`, `tests/**`.
- Ghi nhận sẵn từ trước khi thực hiện Lệnh 32 trong cây git có thay đổi chưa commit ở `src/lib/trang/dieu-huong.ts`, `tests/trang/meta-dieu-huong.test.mjs`, `src/lib/trang/du-lieu/`, `tests/trang/chu-dich-64.test.mjs`; không chạm vào các tệp này.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, thoát mã `0` (0 lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/*.test.mjs`)**:
   - Đạt, thoát mã `0`: `75/75` bài test qua, 0 thất bại (trong đó `tests/trang/xem-ngay.test.mjs` qua `10/10`).
3. **Kiểm tra CSS, lớp và nội dung cấm**:
   - Dung lượng `src/app/(v2)/xem-ngay/xem-ngay.css`: `23.909` byte (≤ 30 KB). `src/app/(v2)/ck.css` giữ nguyên không sửa.
   - Quét `Select-String` trên toàn bộ tệp trong `src/app/(v2)/xem-ngay/`: `0` kết quả dùng biến v1 (`--paper`, `--bg`, `--ink`), `0` kết quả `canChiThang`, `0` kết quả lớp trần (`.so`, `.nhan`, `.gia-tri`, `.the`, `.w`), `0` kết quả từ khóa cấm (`ngày tốt nhất`, `ngày đẹp nhất`, `đại hung`, `đắt hàng`, `theo tuổi`, `28 sao`, `Kim lâu`, `Tam tai`, `văn khấn`).
4. **Kiểm tra HTTP & SEO trên dev (`http://localhost:3047`, Playwright + `fetch`)**:
   - **11/11 route trả HTTP 200**:
     - `/xem-ngay` (`title`: `Xem ngày tốt xấu: hoàng đạo, 12 trực, nghi kỵ theo từng hệ`; `h1`: `Xem ngày tốt theo từng hệ`)
     - `/xem-ngay/cuoi-hoi`, `/xem-ngay/khai-truong`, `/xem-ngay/dong-tho`, `/xem-ngay/nhap-trach`, `/xem-ngay/mua-xe`, `/xem-ngay/cat-toc` (không còn chỗ trống `{yyyy}` / `{m}` chưa điền)
     - `/xem-ngay/thang-02-2027` (`title`: `Ngày tốt tháng 2/2027: hoàng đạo, 12 trực, nghi kỵ`; `h1`: `Ngày tốt tháng 2 năm 2027`)
     - `/xem-ngay/cuoi-hoi/thang-02-2027` (`title`: `Ngày tốt cưới hỏi tháng 2/2027 theo từng hệ`; `h1`: `Ngày tốt cưới hỏi tháng 2/2027`)
     - `/xem-ngay/mua-xe/thang-02-2027` (`title`: `Ngày tốt mua xe tháng 2/2027 theo từng hệ`; `h1`: `Ngày tốt mua xe tháng 2/2027`)
     - `/xem-ngay/xuat-hanh` (vẫn là trang Tết của Lệnh 31: `h1` `"Giờ xuất hành Tết 2027"`, giữ đủ `"Mùng 1"` và `"Theo sách nào"`).
   - **4/4 route không hợp lệ trả HTTP 404**:
     - `/xem-ngay/abc`, `/xem-ngay/thang-13-2027`, `/xem-ngay/cuoi-hoi/thang-01-2040`, `/xem-ngay/xuat-hanh/thang-02-2027`.
   - **JSON-LD**: mọi trang mới đều có đúng `1` khối `BreadcrumbList` và `1` khối `WebPage` với `canonical` chuẩn `https://xemboi.vn/...`.
5. **Đối chiếu số liệu & nội dung bắt buộc**:
   - Ngày 23/11/2026 trên `/xem-ngay`: khớp đủ `Kỷ Hợi`, `theo tiết khí`, `Tân Sửu`, `Trực Mãn`, `Hắc (theo Ngọc hạp ký)`, `Ngọc đường`, `Hoàng đạo`.
   - Trang `/xem-ngay/mua-xe` và `/xem-ngay/mua-xe/thang-02-2027` hiện đủ khung nổi bật `ghiChu`: `"Bảng nghi kỵ theo ngày không có mục mua xe. Trang dùng mục Giao dịch (交易), kèm Nạp tài và Lập khoán."`.
   - Cả 10 route mới của Lệnh 32 đều có khối `"Ba hệ nói gì, theo sách nào"` và nguyên văn dòng nguồn `"Theo bảng nghi kỵ của thư viện mở lunar-javascript (MIT); thư viện không ghi sách gốc."`.
6. **Kiểm tra trình duyệt thực tế (`1366×900` trên cả 11 route và `375×812` trên 4 route đại diện)**:
   - **0 lỗi console**, **0 `pageerror`**, **0 phản hồi HTTP ≥ 400**.
   - **0 tràn ngang**: tất cả 11 route ở `1366` có `scrollWidth = 1366`; tất cả 4 route ở `375` có `scrollWidth = 375`.
   - **Quét liên kết nội bộ**: kiểm tra `204` đường dẫn nội bộ duy nhất thu được trên các trang → `0` liên kết lỗi (`brokenInternalLinks: []`).
   - **Duyệt ảnh chụp bằng mắt (8 ảnh)**: đã mở đọc cả 8 ảnh chụp (`hub`, `mua-xe`, `thang-02-2027`, `cuoi-hoi/thang-02-2027` ở 1366 và 375); bố cục cân đối, 3 lớp tách rõ không gộp điểm, nhãn hoàng/hắc đạo phân biệt rõ cả chữ và màu, bảng tháng 7 cột và bảng việc xếp thẻ dọc gọn gàng trên 375 px, khối `"Ba hệ nói gì"` hiển thị đầy đủ nguyên văn chữ Hán.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Chỉ chèn `<script type="application/ld+json">` cho `WebPage` ở từng `page.tsx`, dùng lại `BreadcrumbList` của `KhungTrang`**:
   - *Lý do*: Thành phần dùng chung `KhungTrang` (qua `Breadcrumb.tsx`) đã tự xuất sẵn `BreadcrumbList` từ `schemaBreadcrumb(breadcrumb(duongDan, tenCuoi))`. Chỉ thêm `WebPage` ở mỗi `page.tsx` giữ đúng cặp `WebPage` + `BreadcrumbList` mà không bị lặp schema.
2. **Bật prop `rong` (`1280px`) trên trang tháng chung `/xem-ngay/thang-mm-yyyy`**:
   - *Lý do*: Bảng tháng có 7 cột kèm 5 mục Nghi và 5 mục Kỵ mỗi dòng; dùng khung rộng `ck-w-rong` giúp bảng thoáng và dễ đọc trên màn hình `1366px`, đồng thời giữ nguyên khung thẻ dọc trên màn hình nhỏ (`≤ 960px`).
3. **Ở chế độ mobile (`≤ 960px`) ẩn `<thead>` để chuyển bảng tháng sang thẻ dọc thay vì cuộn ngang**:
   - *Lý do*: Đáp ứng yêu cầu mục 1.5 `"375 px: thẻ xếp dọc, không tràn ngang"`.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Trạng thái `SeoTrang` của cụm `/xem-ngay`**: Toàn bộ `11` bản ghi trong bảng `SeoTrang` có `duongDan` bắt đầu bằng `/xem-ngay` (bao gồm `XN`, 6 trang việc, `XN-XUATHANH`, `XN-THANG`, `XN-VIEC-THANG`) hiện đều đang ở trạng thái `trangThai = "NHAP"`, nên `metaTrang` xuất `<meta name="robots" content="noindex, follow"/>`. Sau khi nghiệm thu xong, cần chuyển sang `XUAT_BAN` để mở index.
- **Rà lại câu chữ `metaDescription` của `/xem-ngay/khai-truong` trong `SeoTrang`**: Bản ghi CSDL hiện đang chứa cụm `"Ghi rõ hệ, không hứa 'đắt hàng'."` (chép từ ghi chú biên tập trong `16-seo-trang.csv`). Nếu muốn đổi câu mô tả hiển thị trên SERP cho tự nhiên hơn, có thể chỉnh trực tiếp trong quản trị SEO.

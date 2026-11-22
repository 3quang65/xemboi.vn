# Báo cáo Lệnh 27: Cụm Can chi & mệnh v2 (F3)

Ngày hoàn thành: 22/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/components/ck/tu-dien.css` (`13.055` byte ≤ `30.720` byte / 30 KB) — CSS riêng dùng chung cho 5 cụm từ điển (`can-chi`, `sinh-nam`, `nap-am`, `ngu-hanh`, `con-giap`), dùng hoàn toàn tiền tố `ck-`, tái sử dụng token biến `--ck-*` đặt trên `.ck` từ `ck.css`, có kiểu huy hiệu 5 hành, bảng tra năm sinh theo thập kỷ, sơ đồ SVG ngũ hành, huy chương chữ Hán 12 con giáp, khối diễn giải `NoiDungMd`, quy tắc responsive (`≤ 1000px`, `≤ 700px` gồm bảng thẻ `.ck-bang-the` và bảng gọn `.ck-bang-gon` không cắt cột ở `375px`). Không đụng tới `src/app/(v2)/ck.css`.
- `src/components/ck/canChiHelpers.ts` — Helper dùng chung server/client: ánh xạ slug/class/chữ Hán/mã màu hex 5 hành (`HANH_SLUG`, `SLUG_HANH`, `HANH_CLASS`, `HANH_HAN`, `HANH_MAU_HEX`), chữ Hán 12 địa chi (`CHI_HAN`), bảng chữ Hán phồn thể 30 nạp âm (`NAP_AM_HAN`), mã màu chip (`MAU_SAC_HEX`), tách slug `Tỵ → ti` (`slugConGiap`, `duongDanConGiap`, `timConGiapTheoSlug`), `hoaGiapLanCan`, `conGiapLanCan`, `namCuaConGiap`, `chuoiNguonNapAm`.
- `src/components/ck/NoiDungMd.tsx` — Component hiển thị `KhoiMd[]` (`tieuDe`, `doan`, `danhSach`, `trich`, chữ đậm/nghiêng/link kiểm tra lại URL an toàn) **không** dùng `dangerouslySetInnerHTML`, kèm `KhoiDienGiai` tự hiện `.ck-cho-noi-dung` (`"Phần diễn giải đang biên tập"`) khi `noiDungTheoDuongDan` trả `null`, hoặc đầy đủ thân bài + khối K1–K9 + trích dẫn khi có bản xuất bản.
- `src/components/ck/TheCanChi.tsx` — `HuyHieuHanh` (có tùy chọn gắn link `/ngu-hanh/{slug}`), `NguonNapAm` (`"Bảng nạp âm theo: ..."` từ `NGUON_NAP_AM`), `DanhSachMau` (danh sách chip kèm chấm màu).
- `src/components/ck/ChonNamSinh.tsx` — Client component chọn năm sinh `1930–2030` điều hướng sang `/sinh-nam/{yyyy}`.
- `src/components/ck/MauHopMenhClient.tsx` — Client component trên `/ngu-hanh/mau-hop-menh`: chọn năm sinh `1930–2030` (nhận sẵn danh sách từ `danhSachNamSinh()` server để đồng nhất tên nạp âm), hiện tóm tắt kèm link `/sinh-nam/{y}`, tô nổi bật và cuộn mượt tới dòng hành tương ứng trong bảng 5 hành.
- `src/components/ck/SoDoNguHanh.tsx` — Sơ đồ SVG tự vẽ vòng 5 hành theo màu riêng (`Kim`, `Thủy`, `Mộc`, `Hỏa`, `Thổ`), chữ Hán + tên Việt có link từng hành, vòng ngoài nét liền mũi tên xanh chỉ chiều **Tương sinh**, ngôi sao bên trong nét đứt mũi tên đỏ chỉ chiều **Tương khắc**, kèm chú thích.
- 5 tệp layout cụm (chỉ import `@/components/ck/tu-dien.css` và trả `<>{children}</>`, không thêm khung):
  - `src/app/(v2)/can-chi/layout.tsx`
  - `src/app/(v2)/sinh-nam/layout.tsx`
  - `src/app/(v2)/nap-am/layout.tsx`
  - `src/app/(v2)/ngu-hanh/layout.tsx`
  - `src/app/(v2)/con-giap/layout.tsx`
- 12 tệp route trang trong `src/app/(v2)/` (đều gọi `metaTrang` + `noiDungTheoDuongDan`, ép `robots: { index: false, follow: true }` khi `noiDung === null`, điền đủ khóa mẫu `{...}`):
  - `src/app/(v2)/can-chi/page.tsx` — Hub `/can-chi`: ô tra nhanh `"Bạn sinh năm nào?"` (`1930–2030`), 6 thẻ dẫn tới các trang chỉ mục, nguồn nạp âm, khối diễn giải.
  - `src/app/(v2)/sinh-nam/page.tsx` — Chỉ mục `/sinh-nam`: `<ChonNamSinh>`, thanh nhảy thập kỷ, chú thích 5 hành, đủ 101 năm `1930–2030` nhóm theo 11 thập kỷ (mỗi ô ghi can chi, nạp âm, tô viền theo hành).
  - `src/app/(v2)/sinh-nam/[yyyy]/page.tsx` — Trang năm `/sinh-nam/[yyyy]` (`generateStaticParams` 101 năm `1930–2030`, ngoài khoảng gọi `notFound()`, `revalidate = 3600`): tóm tắt con giáp/nạp âm/hành, ranh giới `tuNgay–denNgay` và lưu ý sinh trước Tết + Lập xuân `lapXuan`, bảng quan hệ ngũ hành, cung phi nam/nữ kèm nhóm Đông/Tây tứ mệnh, bảng màu hợp mệnh, bảng `"Tuổi âm theo năm"` cho năm hiện tại và 2 năm tới, điều hướng năm trước/sau và liên kết sang hoa giáp/nạp âm/ngũ hành/con giáp/lịch âm/tử vi.
  - `src/app/(v2)/can-chi/60-hoa-giap/page.tsx` — Chỉ mục `/can-chi/60-hoa-giap`: bảng 60 dòng (STT, hoa giáp, âm dương, nạp âm, hành, con giáp).
  - `src/app/(v2)/can-chi/[slug]/page.tsx` — Trang mục `/can-chi/[slug]` (`generateStaticParams` 60 slug, slug lạ gọi `notFound()`): can, chi, âm dương, nạp âm, con giáp, các năm `1900–2100` (link `/sinh-nam/{y}` trong `1930–2030`), hoa giáp trước và sau.
  - `src/app/(v2)/nap-am/page.tsx` — Chỉ mục `/nap-am`: 30 nạp âm nhóm theo 5 hành (mỗi thẻ ghi tên, chữ Hán, 2 hoa giáp).
  - `src/app/(v2)/nap-am/[slug]/page.tsx` — Trang mục `/nap-am/[slug]` (`generateStaticParams` 30 slug, slug lạ gọi `notFound()`): chữ Hán, hành, 2 hoa giáp kèm các năm sinh `1900–2100`, bảng màu theo hành, nạp âm cùng hành.
  - `src/app/(v2)/ngu-hanh/page.tsx` — Trang `/ngu-hanh`: `<SoDoNguHanh />` và bảng sinh khắc + màu bản mệnh 5 hành.
  - `src/app/(v2)/ngu-hanh/[hanh]/page.tsx` — Trang mục `/ngu-hanh/[hanh]` (`generateStaticParams` 5 slug `kim`, `moc`, `thuy`, `hoa`, `tho`, slug lạ gọi `notFound()`): quan hệ sinh khắc, 6 nạp âm thuộc hành, bảng màu đầy đủ.
  - `src/app/(v2)/ngu-hanh/mau-hop-menh/page.tsx` — Trang `/ngu-hanh/mau-hop-menh`: `<MauHopMenhClient />` kèm nguồn nạp âm và khối diễn giải.
  - `src/app/(v2)/con-giap/page.tsx` — Chỉ mục `/con-giap`: 12 thẻ (thứ tự, chữ Hán trong huy chương sơn mài, tên, địa chi, hành, âm dương), không dùng ảnh con vật.
  - `src/app/(v2)/con-giap/[slug]/page.tsx` — Trang mục `/con-giap/[slug]` (`generateStaticParams` 12 slug gồm `ty` cho Tý và `ti` cho Tỵ, slug lạ gọi `notFound()`): chữ Hán, hành chi, âm dương, tam hợp/lục hợp/lục xung có link con giáp tương ứng, 5 hoa giáp của chi, các năm sinh `1930–2030`, điều hướng chi trước/sau.
- `docs/v2/lenh-antigravity/27-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`1366` và `375` cho đủ 12 trang đại diện, 24 tệp):
  - `ck-f3-can-chi-1366.png`, `ck-f3-can-chi-375.png`
  - `ck-f3-sinh-nam-1366.png`, `ck-f3-sinh-nam-375.png`
  - `ck-f3-sinh-nam-1990-1366.png`, `ck-f3-sinh-nam-1990-375.png`
  - `ck-f3-60-hoa-giap-1366.png`, `ck-f3-60-hoa-giap-375.png`
  - `ck-f3-canh-ngo-1366.png`, `ck-f3-canh-ngo-375.png`
  - `ck-f3-nap-am-1366.png`, `ck-f3-nap-am-375.png`
  - `ck-f3-lo-bang-tho-1366.png`, `ck-f3-lo-bang-tho-375.png`
  - `ck-f3-ngu-hanh-1366.png`, `ck-f3-ngu-hanh-375.png`
  - `ck-f3-ngu-hanh-tho-1366.png`, `ck-f3-ngu-hanh-tho-375.png`
  - `ck-f3-mau-hop-menh-1366.png`, `ck-f3-mau-hop-menh-375.png`
  - `ck-f3-con-giap-1366.png`, `ck-f3-con-giap-375.png`
  - `ck-f3-con-giap-ngo-375.png`, `ck-f3-con-giap-ngo-1366.png`

### Tệp chỉnh sửa
- `src/components/ck/BieuTuongE3.tsx` — Bổ sung 5 loại biểu tượng nét vàng lá E3 (`hoa-giap`, `nap-am`, `ngu-hanh`, `mau-hop`, `con-giap`) vào `LoaiBieuTuongCongCu` và `BieuTuongCongCu` cho lưới 6 thẻ trên hub `/can-chi`.

### Xác nhận vùng cấm
- `src/app/(v2)/ck.css`: **không sửa** (giữ nguyên commit `f4e8d70`).
- `src/lib/**` (bao gồm `src/lib/trang/dieu-huong.ts`, `src/lib/trang/can-chi.ts`), `src/app/api/**`, `src/middleware.ts`, `prisma/**`, `scripts/**`, `src/app/quan-tri/**`, `src/app/tu-vi-2027/**`, `src/components/r1/**`, `src/app/layout.tsx`, `src/app/globals.css`: **không sửa**.
- Không cài gói npm, không commit.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit`)**:
   - Đạt, `TSC_EXIT=0` (0 lỗi).
2. **Kiểm tra unit test phần lõi (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/*.test.mjs`)**:
   - Đạt, `TEST_EXIT=0`: 42/42 bài test qua, 0 thất bại.
3. **Kiểm tra CSS & quy ước**:
   - Dung lượng `src/components/ck/tu-dien.css`: `13.055` byte (≤ `30.720` byte / 30 KB); `src/app/(v2)/ck.css` không thay đổi.
   - Quét grep các tệp mới/sửa: 0 biến v1 (`--paper`, `--bg`, `--ink`), 0 tên lớp trần (`so`, `nhan`, `gia-tri`, `the`, `w`), 0 `dangerouslySetInnerHTML` trong `NoiDungMd.tsx`.
4. **Kiểm tra cảnh báo mẫu `SeoTrang` trên toàn bộ 215 đường dẫn F3**:
   - Chạy kiểm trực tiếp `thongTinTrang` qua toàn bộ 101 năm `/sinh-nam/{1930..2030}`, 60 hoa giáp, 30 nạp âm, 5 hành, 12 con giáp và 7 trang hub/chỉ mục/màu hợp mệnh: `TOTAL_WARNINGS=0` (không còn chỗ trống `{...}` nào chưa điền).
5. **Kiểm tra trình duyệt & HTML trên `http://localhost:3047` (Chromium via `playwright-core` & `fetch`)**:
   - **HTTP 200, 0 lỗi console, 0 `pageerror`, 0 request `≥ 400`, 0 tràn ngang (`scrollWidth === innerWidth` ở cả `1366` và `375`), 0 chỗ trống `{...}` trong `title`/`meta`/`h1`, và có `<meta name="robots" content="noindex, follow"` trong HTML thô** cho tất cả 15 URL kiểm tra:
     - `/can-chi`, `/sinh-nam`, `/sinh-nam/1990`, `/sinh-nam/2030`, `/can-chi/60-hoa-giap`, `/can-chi/canh-ngo`, `/nap-am`, `/nap-am/lo-bang-tho`, `/ngu-hanh`, `/ngu-hanh/tho`, `/ngu-hanh/mau-hop-menh`, `/con-giap`, `/con-giap/ngo`, `/con-giap/ty`, `/con-giap/ti`.
   - **Kiểm tra 404**: `/sinh-nam/1929`, `/sinh-nam/2031`, `/can-chi/khong-ton-tai`, `/nap-am/khong-ton-tai`, `/ngu-hanh/khong-ton-tai`, `/con-giap/khong-ton-tai` đều trả `404`.
   - **Quét liên kết nội bộ**: quét đủ `220` đường dẫn nội bộ duy nhất trong `<main>` trên các trang đã mở → `0` liên kết lỗi (`brokenLinks: []`).
   - **Đối chiếu `/sinh-nam/1990`**: hiển thị đúng `Canh Ngọ`, `Lộ Bàng Thổ`, nam `Khảm` (Đông tứ mệnh), nữ `Cấn` (Tây tứ mệnh), khoảng năm âm `27/01/1990`–`14/02/1991`, `Lập xuân 04/02/1990`, và dòng nguồn `"Bảng nạp âm theo: ..."`.
   - **Kiểm tra tương tác client**:
     - `/can-chi`: chọn `1990` và bấm `"Tra mệnh"` → chuyển tới `http://localhost:3047/sinh-nam/1990`.
     - `/ngu-hanh/mau-hop-menh`: chọn `1990` và bấm `"Đối chiếu màu"` → hiện `"Sinh năm 1990 — tuổi Canh Ngọ, mệnh Lộ Bàng Thổ (hành Thổ)."` kèm link `/sinh-nam/1990` và tô nổi bật hàng `#hanh-tho` (`.ck-hang-chon`).
   - **Duyệt ảnh chụp 1366 và 375**: ở lượt chụp đầu phát hiện hai điểm cần cải thiện: (1) bộ chọn `.ck-giap-the > span` vô tình ghi đè màu nâu tối và cỡ chữ 14px lên huy chương chữ Hán `.ck-giap-han` trên `/con-giap`, và (2) trên màn hình `375px`, các bảng 4–6 cột trên `/ngu-hanh`, `/ngu-hanh/mau-hop-menh`, `/con-giap/[slug]`, `/can-chi/60-hoa-giap` bị cắt bớt cột bên phải trong khung cuộn ngang. Đã sửa bằng cách tách riêng lớp `.ck-giap-phu` và tăng độ rõ chữ Hán vàng trên nền sơn mài, thêm kiểu bảng dạng thẻ `.ck-bang-the` (dùng `data-nhan`) và bảng gọn `.ck-bang-gon` cho `≤ 700px`; chạy lại `tsc`, 42/42 test, script Playwright và kiểm tra lại ảnh mới xác nhận khắc phục sạch sẽ.

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Tách slug của địa chi `Tỵ` thành `ti` (`/con-giap/ti`) trong `canChiHelpers.ts`**:
   - *Lý do*: Trong `src/lib/trang/can-chi.ts` (thuộc vùng cấm sửa), hàm `slugViet('Tý')` và `slugViet('Tỵ')` đều trả về `'ty'`, khiến `CON_GIAP` chỉ có 11 slug duy nhất thay vì 12 và `conGiapTheoSlug('ty')` luôn khớp `Tý` (không thể vào trang `Tỵ`). Để cả 12 con giáp đều có URL riêng hợp lệ và không phát sinh cảnh báo trùng `key`/route, `canChiHelpers.ts` quy ước `Tỵ → 'ti'` (`slugConGiap`, `duongDanConGiap`, `timConGiapTheoSlug`), giữ nguyên `/con-giap/ty` cho `Tý` (Chuột).
2. **Bổ sung bảng chữ Hán phồn thể 30 nạp âm (`NAP_AM_HAN`) trong `canChiHelpers.ts`**:
   - *Lý do*: Dòng mẫu `/nap-am/{ten}` trong bảng `SeoTrang` dùng chỗ trống `{Hán}` trong `metaDescription`, nhưng dữ liệu `NAP_AM` ở `src/lib/trang/can-chi.ts` chưa có trường chữ Hán. Việc bổ sung ánh xạ 30 nạp âm tương ứng giúp điền trọn vẹn mẫu `SeoTrang` để dev console không phát sinh cảnh báo thiếu chỗ trống.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- **Nâng `DOT_DA_DUNG = 3` trong `src/lib/trang/dieu-huong.ts`**: Để menu chính, chân trang, ô `"Sinh năm mệnh gì"` ở trang chủ và chuỗi `Breadcrumb` của 5 cụm mới tự động bật liên kết (hiện mục Lệnh 27 ghi Claude Code sẽ tăng ở bước nghiệm thu).
- **Sửa trùng slug `Tý` / `Tỵ` trong `src/lib/trang/can-chi.ts`**: Cần quy ước slug riêng cho `Tỵ` (ví dụ `'ti'`, trùng với quy ước tạm trong `canChiHelpers.ts`) trong `CON_GIAP` / `conGiapTheoSlug` để `tests/trang/can-chi.test.mjs` kiểm đủ 12 slug duy nhất (hiện test mới kiểm `HOA_GIAP` 60 slug và `NAP_AM` 30 slug duy nhất, chưa kiểm `new Set(CON_GIAP.map(c => c.slug)).size === 12`).
- **Tùy chọn mở rộng `NAP_AM` và `TAT_CA`**:
  - Có thể thêm trường `han` vào `NAP_AM` trong `src/lib/trang/can-chi.ts` / `nap-am.json` để dùng chung một nguồn chuẩn thay cho bảng phụ ở UI.
  - Nếu muốn `/ngu-hanh/mau-hop-menh` xuất hiện trong menu con và `trangDaDung()` (hiện mới có 5 mục con dưới `/can-chi`), có thể thêm vào `TAT_CA` của `dieu-huong.ts`.
- **Xuất bản `NoiDung` và `SeoTrang` cho cụm Can chi & mệnh**: Toàn bộ 13 dòng `SeoTrang` của cụm này hiện đang ở `trangThai = NHAP` và chưa có bài `NoiDung` xuất bản (`noiDungTheoDuongDan` trả `null`), nên mọi trang đang hiển thị `.ck-cho-noi-dung` (`"Phần diễn giải đang biên tập"`) và tự ép `noindex, follow` đúng quy tắc F3. Khi biên tập viên xuất bản bài từ điển vào CSDL và đổi trạng thái `SeoTrang`, `KhoiDienGiai` + `NoiDungMd` và trạng thái `index` sẽ tự động kích hoạt.

# Lệnh 25: khung chung trang công khai v2, trang chủ, hub Tử vi, lập lá số (F1)

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/25-bao-cao.md`.

## Đọc trước

- **`docs/v2/19-frontend-v2.md`**: toàn bộ. Đặc biệt:
  - mục 1.1 (nhóm route, tiền tố `ck-`);
  - mục 1.2 (hợp đồng, các thư mục **không được sửa**).
- **`docs/v2/00-BAN-CU-BAN-MOI.md`**: mục "Bẫy CSS".
- **Thiết kế:**
  - `docs/v2/thiet-ke/huong-e3.html` và `docs/v2/thiet-ke/05-vong-4.md`: hướng E3 "Sơn mài đêm trăng". Đây là mẫu giao diện.
  - `docs/v2/thiet-ke/06-dau-trang-mau.md`: tọa độ tranh đầu trang.
- **Mẫu đang chạy** (chỉ đọc, **không sửa**):
  - `src/app/tu-vi-2027/page.tsx` và `r1.css`: CSS E3 thật, lớp `r1e-*`.
  - `src/components/r1/TrangR1Client.tsx`:
    - header, form, các dải;
    - cách gọi API và hiện lá số.
  - `src/components/r1/LaSo12Cung.tsx`:
    - lá số 4×4;
    - props `{ laSo, luuNien2027, moTaQuyUoc, highlightedChis? }`;
    - prop `luuNien2027` nhận lưu niên của **bất kỳ** năm nào, chỉ có tên prop là cũ.
  - `src/components/r1/HoaVanE3.tsx`, `TranhDauTrang.tsx`: hoa văn, tranh SVG. Import và dùng lại, không chép.
- **Phần lõi Claude Code đã làm** (chỉ đọc, **không sửa**). Mọi tệp đều có test ở `tests/trang/`.
  - `src/lib/trang/meta.ts`:
    - `metaTrang(duongDan, macDinh)` dùng cho `generateMetadata`;
    - `thongTinTrang()` lấy `h1`, `schemaJsonLd`, `duocIndex`.
  - `src/lib/trang/dieu-huong.ts`:
    - `menuChinh()`, `chanTrang()`;
    - `breadcrumb(duongDan, tenCuoi?)`, `schemaBreadcrumb()`;
    - `trangDaDung()`: tập đường dẫn đã có trang v2.
  - `src/lib/trang/lich.ts`:
    - `homNay()` trả `ChiTietNgay`: ngày âm, can chi ngày/tháng/năm, tiết khí, giờ hoàng đạo, ngày lễ, thứ.
  - `src/lib/trang/la-so.ts` và `POST /api/v2/la-so`:
    - body `{ lich: 'duong'|'am', ngay, thang, nam, nhuan?, gio (0–23), phut?, gioiTinh: 'nam'|'nu', ten?, namXem? }`;
    - trả `{ ok: true, ketQua: { laSo, luuNien, namXem, moTaQuyUoc, tomTat } }` hoặc `{ ok: false, loi }`.

## Ràng buộc

**Chỉ được tạo hoặc sửa:**
- `src/app/(v2)/**`
- `src/components/ck/**`
- `src/app/(v2)/ck.css`
- xóa `src/app/page.tsx`: trang chủ v1, phải xóa vì trùng route `/` với `src/app/(v2)/page.tsx`.

`src/lib/home-template.ts` và `public/*.js` **giữ nguyên**. Claude Code gỡ ở F5.

**Không sửa:**
- `src/lib/**`, `src/app/api/**`, `src/middleware.ts`, `prisma/**`, `scripts/**`
- `src/app/layout.tsx`, `src/app/globals.css`
- `src/app/quan-tri/**`, `src/app/tu-vi-2027/**`, `src/components/r1/**`

**Không cài gói npm, không commit.**

**CSS:**
- Mọi lớp mới mang tiền tố `ck-`.
- Không dùng tên lớp `so`, `nhan`, `gia-tri`, `the`, `w`. Không dùng biến `--paper`, `--bg`, `--ink` của v1.
  - Token riêng đặt dưới `.ck { --ck-... }`.
- Phần tử gốc `<div className="ck">` tự đặt nền, màu chữ, font. **Không** dựa vào `body`.
- `ck.css` ≤ 60 KB.
- Không ảnh ngoài; font qua `next/font/google` như `tu-vi-2027/page.tsx`.

**Giao diện:**
- Quen thuộc và đúng E3: nền sơn mài tối ở đầu trang, dải ngà cho phần đọc, chỉ vàng, mây cuộn.
- Lá số 4×4 dùng `LaSo12Cung`, màu ngũ hành như `/tu-vi-2027`.
- Không lạ hơn đối thủ, chỉ đẹp và sạch hơn.

**Không bịa nội dung:**
- Câu chữ trên trang chỉ được là:
  - nhãn giao diện;
  - hướng dẫn thao tác;
  - số liệu do hàm trả về;
  - title, h1, meta từ `thongTinTrang`.
- Không viết đoạn luận giải, không viết "theo sách X", không viết cam kết hay giá.
- Chỗ cần đoạn giới thiệu thì để khối `ck-cho-noi-dung` với chữ "Phần giới thiệu đang biên tập".
- Ba cam kết ở trang chủ lấy nguyên từ `src/lib/r1/copy.ts` (`R1_COPY`), nếu có.

**Liên kết:**
- Chỉ gắn `<Link>` tới đường dẫn có trong `trangDaDung()`.
- Mục chưa dựng hiện chữ "Sắp có", không gắn link.
- Không được có liên kết 404.

## 1. Việc cần làm

### 1.1. Khung chung `src/app/(v2)/layout.tsx`

**Layout:**
- Nạp font Alegreya và Be Vietnam Pro, dùng biến font riêng `--ck-font-tieu`, `--ck-font-chu`.
- Nạp `./ck.css`.
- Bọc trang trong `<div className="ck ...">`. Dùng `<header>`, `<main>`, `<footer>` đúng ngữ nghĩa.

**`src/components/ck/DauTrang.tsx`, header kiểu E3** (dải trên tối, logo, menu sơn đỏ):
- Menu chính lấy từ `menuChinh()`.
- Mục có `con` thì mở menu con khi rê chuột (desktop) và khi bấm (bàn phím, cảm ứng).
- **Mobile ≤ 1000px:** nút ☰ mở ngăn kéo menu.
  - Có `aria-expanded`.
  - Đóng bằng Esc và bằng nút đóng.
  - Khóa cuộn nền khi mở.
- Logo trỏ `/`.

**`src/components/ck/ChanTrang.tsx`:**
- Các cột từ `chanTrang()`.
- Dòng bản quyền "© 2026 xemboi.vn".
- Dòng nhỏ "Kết quả tra cứu chỉ để tham khảo".

**`src/components/ck/Breadcrumb.tsx`:**
- Nhận `MatXich[]`.
- Hiện `<nav aria-label="Đường dẫn">`.
- Kèm `<script type="application/ld+json">` từ `schemaBreadcrumb`.
- Trang chủ không hiện breadcrumb.

**`src/components/ck/KhungTrang.tsx`:** khung nội dung chuẩn cho trang con:
- breadcrumb, H1, dòng phụ;
- vùng nội dung ngà;
- props `tieuDe`, `phu?`, `duongDan`, `tenCuoi?`, `children`, `toi?` (đầu trang tối như E3).

### 1.2. Trang chủ `src/app/(v2)/page.tsx` (`/`)

Giữ nhịp E3 nhưng là trang chủ của **cả site**, không chỉ tử vi.

**Metadata:** `generateMetadata` gọi `metaTrang('/', { title: 'XemBói.vn – Lá số tử vi, lịch âm, tra mệnh có căn cứ' })`. H1 lấy từ `thongTinTrang('/')`.

**Các khối, theo thứ tự:**

1. **Đầu trang tối:**
   - Tranh `TranhDauTrangNen` và `TranhDauTrangDai`.
   - H1 và dòng phụ (metaDescription).
   - Bên phải là **form lập lá số rút gọn**:
     - các trường: ngày, tháng, năm dương, giờ sinh, giới tính;
     - nút "Lập lá số" dẫn sang `/tu-vi/lap-la-so?ngay=..&thang=..&nam=..&gio=..&gioiTinh=..` (GET).
     - trang lá số tự điền form từ query và tự lập.
2. **Dải "Hôm nay theo lịch"** (ngà), dữ liệu từ `homNay()` gọi phía server:
   - Ngày dương, thứ, ngày âm và tên tháng âm.
   - Can chi ngày, tháng, năm. Tiết khí hiện tại.
   - Các giờ hoàng đạo: tên chi và khung giờ.
   - Ngày lễ nếu có.
   - Trang dùng `export const revalidate = 3600` để đổi ngày đúng giờ Việt Nam.
   - Nếu `/lich-am` chưa nằm trong `trangDaDung()` thì chưa gắn liên kết "Xem lịch tháng".
3. **Lưới công cụ:**
   - Ô "Lập lá số tử vi", "Tử vi 2027": có link.
   - Ô "Lịch âm hôm nay", "Sinh năm mệnh gì", "Xem tuổi vợ chồng", "Lá số bát tự": theo `trangDaDung()`; chưa có thì hiện "Sắp có".
   - Mỗi ô là tấm sơn mài nhỏ như ô bách khoa E3.
4. **Dải hub:** mỗi mục `menuChinh()` một thẻ, gồm tên, `moTa` và các con.
5. **Khối cam kết:** từ `R1_COPY` nếu có. Không có thì bỏ khối này.
6. **Chân trang.**

**JSON-LD:**
- `Organization` và `WebSite`.
- Chỉ các trường chắc chắn: `name`, `url`, `logo` = `/icons/icon.svg`.

### 1.3. Hub Tử vi `src/app/(v2)/tu-vi/page.tsx` (`/tu-vi`)

- Dùng `KhungTrang`, đầu trang tối.
- `metaTrang('/tu-vi', { title: 'Tử vi Đẩu số: lá số, 12 cung, 14 chính tinh' })`.
- Thẻ công cụ: các con của mục Tử vi trong `menuChinh()`, kèm các mục "Sắp có" (Trọn đời, 12 cung, 14 chính tinh).
- Khối `ck-cho-noi-dung` cho phần "Tử vi là gì". Claude Code sẽ nối `NoiDung` ở F5.

### 1.4. Lập lá số `src/app/(v2)/tu-vi/lap-la-so/page.tsx`

**Trang:**
- Server page dùng `KhungTrang` và `metaTrang('/tu-vi/lap-la-so', { title: 'Lập lá số tử vi miễn phí, an sao theo Nam phái' })`.
- Client component `src/components/ck/FormLaSo.tsx`.

**Form:**
- Chọn lịch dương/âm; nếu âm thì có thêm ô "tháng nhuận".
- Ngày, tháng, năm.
- Giờ: chọn theo 12 canh giờ, kèm khung giờ đồng hồ. Có thêm ô phút (tùy chọn).
- Giới tính, tên (tùy chọn), năm xem (mặc định năm hiện tại).
- Kiểm tra trên trình duyệt trước khi gửi.
- Lỗi hiện từ `loi` của API.

**Xử lý:**
- Gửi `POST /api/v2/la-so`.
- Đọc query `?ngay&thang&nam&gio&gioiTinh` (từ trang chủ) để điền sẵn và tự lập một lần.

**Kết quả:**
- `LaSo12Cung` với `luuNien2027={ketQua.luuNien}`.
- Dòng tóm tắt `tomTat`.
- Danh sách `moTaQuyUoc` (bỏ qua nếu rỗng).
- Nút "In lá số" (`window.print()`, có CSS in).
- Nút "Lập lá số khác".

**Không có:** nút mua, giá hay luận giải. Gói 2 làm ở F4.

**Trạng thái:** đang tải, lỗi, kết quả. Cuộn xuống kết quả sau khi lập.

### 1.5. Liên kết vào `/tu-vi-2027`

Trang chủ và hub `/tu-vi` đều trỏ tới `/tu-vi-2027`, để trang này hết "mồ côi" (17 mục Đợt 3).

## 2. Nghiệm thu (ghi vào báo cáo)

**Lệnh và kiểm tra:**
- Chạy:
  - `npx tsc --noEmit`: 0 lỗi;
  - `npx tsx --env-file=.env --test tests/trang/meta-dieu-huong.test.mjs tests/trang/lich.test.mjs tests/trang/la-so.test.mjs`.
- Dev server ở :3047 (đang chạy). Mở `/`, `/tu-vi`, `/tu-vi/lap-la-so`, `/tu-vi-2027`, `/quan-tri`:
  - 0 lỗi console;
  - không có trang 404.
- `/quan-tri` và `/tu-vi-2027` **không đổi giao diện**. Đây là bằng chứng CSS `ck-` không rò.
- Lập lá số 15/8/1990, 10 giờ, nam:
  - ra lá số 4×4;
  - trùng các sao ở cung Mệnh với `/tu-vi-2027` cùng đầu vào.
- Từ trang chủ, form rút gọn chuyển sang trang lá số và tự lập.
- Bấm mọi liên kết trên header, footer, trang chủ: không có 404.

**Ảnh chụp** (bằng công cụ của Antigravity) lưu `docs/v2/bang-chung/ck-f1-*.png`:
- 1366 và 375 cho `/`, `/tu-vi`, `/tu-vi/lap-la-so` (có kết quả);
- menu mobile đang mở.

**Báo cáo:**
- Liệt kê tệp tạo hoặc sửa.
- Liệt kê chỗ phải lệch khỏi lệnh và lý do.
- Liệt kê dữ liệu còn thiếu cần Claude Code bổ sung.

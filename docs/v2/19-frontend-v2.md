# 19. Dựng toàn bộ trang công khai v2, thay hẳn v1

Ngày lập: 22/11/2026. Người lập: Claude Code.

Anh Cường yêu cầu:
- Dựng toàn bộ frontend v2 thay thế v1, làm xong ở máy trạm trước.
- Khi xong hết mới đưa lên VPS **một lần**.

---

## 0. Kết luận nhanh

**Điều kiện xong hết:**
- Không còn trang nào trả giao diện v1 "Bát Đại Danh Sư".
- Toàn bộ trang P1 trong `16-seo-trang.csv` đã có trang v2.
- Mọi URL v1 hoặc chuyển 301 sang trang v2, hoặc trả 410, đúng theo `18-url-cu-xemboi.md`.

**Phạm vi:**
- Trang P2 (Xem ngày, Phong thủy, Kinh Dịch, Thần số học, Chiêm tinh, Phong tục) làm tiếp sau, ở đợt F6.
- Riêng `/kinh-dich/gieo-que` làm ngay ở F4, vì nó thay trang v1 `/boi-dich`.

**Giao diện:**
- Hướng E3 "Sơn mài đêm trăng", đã chạy ở `/tu-vi-2027`.
- Lá số theo khung 4×4 kiểu tuvi.vn, màu theo ngũ hành.
- Phải quen thuộc với người xem tử vi, đẹp hơn đối thủ chứ không lạ hơn.

**Chia việc:**
- Claude Code làm:
  - lớp dữ liệu `src/lib/trang/*`;
  - siêu dữ liệu SEO, chuyển hướng, sitemap;
  - test, nghiệm thu, triển khai.
- Antigravity làm phần nhìn thấy:
  - `src/app/(v2)/**`, `src/components/ck/**`, `src/app/(v2)/ck.css`;
  - mỗi đợt một lệnh `docs/v2/lenh-antigravity/NN-*.md`.

**Index:**
- Trang v2 mặc định `noindex` cho tới khi `SeoTrang.trangThai = XUAT_BAN` (mục 2.3).
- Lý do: dựng xong chưa có nghĩa là nội dung đã được duyệt.

## 1. Kiến trúc

### 1.1. Nhóm route và CSS

- Toàn bộ trang công khai v2 nằm trong nhóm route `src/app/(v2)/`.
  - Nhóm này có `layout.tsx` riêng: font Alegreya và Be Vietnam Pro, `ck.css`, header, footer.
  - Tên nhóm không hiện trên URL.
- **CSS dùng tiền tố `ck-`** ("công khai"). Lý do: `globals.css` của v1 vẫn nạp ở root layout cho tới F5.
  - `globals.css` v1 đặt sẵn `body`, `main`, `footer`, `.so`, `.nhan`, `--paper`.
  - Vì vậy trang v2 phải tự đặt nền và chữ trên phần tử gốc `.ck`.
  - Không dựa vào style của `body`.
- Token màu, nền sơn mài, dải mây, nhũ vàng: lấy từ `src/app/tu-vi-2027/r1.css` (lớp `r1e-*`), đổi tên sang `ck-*`.
  - `r1.css` giữ nguyên cho tới khi `/tu-vi-2027` chuyển vào nhóm `(v2)` ở F5.
- `ck.css` (phần dùng chung) không vượt 60 KB. Sau Lệnh 26 nó đã chạm trần (60,6 KB), nên từ Lệnh 27 trở đi:
  - CSS riêng của từng cụm đặt ở `src/app/(v2)/<cụm>/<cụm>.css`, vẫn dùng tiền tố `ck-`;
  - tệp này được import trong `layout.tsx` của cụm (Next chỉ nạp CSS của cụm khi vào cụm đó);
  - mỗi tệp cụm không vượt 30 KB; không sửa `ck.css` trừ khi thêm token dùng chung.
- Tranh SVG đầu trang dùng lại `src/components/r1/TranhDauTrang.tsx`.

### 1.2. Hợp đồng giữa hai bên

- `src/lib/trang/*` (Claude Code viết) trả dữ liệu thuần, đã tính xong:
  - không có JSX;
  - không đọc `searchParams`;
  - có test trong `tests/trang/`.
- `page.tsx` trong `(v2)` (Antigravity viết):
  - là server component;
  - gọi hàm ở `src/lib/trang/*`;
  - xuất `generateMetadata` bằng `metaTrang()`;
  - truyền dữ liệu xuống component trong `src/components/ck/`.
- Component cần tương tác (form lập lá số, đổi ngày, chọn tháng) là client component.
  - Chỉ gọi API sẵn có hoặc hàm thuần của engine.
  - Không gọi CSDL.
- Antigravity **không sửa**:
  - `src/lib/**`, `src/app/api/**`, `src/middleware.ts`, `prisma/**`, `scripts/**`;
  - `src/app/quan-tri/**`, `src/app/tu-vi-2027/**`, `src/components/r1/**`;
  - `src/app/layout.tsx` (root).
- Cần thêm dữ liệu thì ghi vào báo cáo để Claude Code làm.

### 1.3. Thư viện trang (`src/lib/trang/`)

| Tệp | Nội dung |
|:--|:--|
| `meta.ts` | `metaTrang(duongDan, macDinh)`. Đọc `SeoTrang` theo đường dẫn, trả `Metadata` của Next: title, description, canonical, robots. Kèm `h1Trang()`. |
| `dieu-huong.ts` | Menu chính (các hub P1), menu chân trang, đường dẫn breadcrumb. |
| `lich.ts` | `thangLich(nam, thang)` cho lưới tháng dương kèm ngày âm. `ngayLich(d, m, y)` cho chi tiết ngày: can chi ngày, tháng, năm; tiết khí; giờ hoàng đạo; ngày lễ. `homNay()` theo giờ Việt Nam. |
| `can-chi.ts` | `namSinh(yyyy)`: can chi, con giáp, nạp âm, hành, khoảng ngày dương của năm âm, cung phi nam và nữ. Kèm `hoaGiap()`, `napAmTheoTen()`, `conGiap()`, `nguHanh()`. |
| `noi-dung.ts` | `noiDungTheoDuongDan(url)`: bản xuất bản của `NoiDung` nối với `SeoTrang`, kèm khối K1–K9 và trích dẫn. |

## 2. Lộ trình

Mỗi đợt kết thúc bằng: tsc sạch, test `tests/trang` qua, ảnh chụp 1366 và 375 ở `docs/v2/bang-chung/ck-*`, và một commit.

| Đợt | Nội dung | Lệnh Antigravity |
|:--|:--|:--|
| **F1** | Khung chung (header, menu, footer, breadcrumb). Trang chủ `/`. Hub `/tu-vi`. Công cụ `/tu-vi/lap-la-so` (form và lá số 4×4, dùng lại engine v2 và `LaSo12Cung`). | 25 |
| **F2** | Lịch âm: hub `/lich-am`, `/lich-am/doi-ngay`, `/lich-am/lich-van-nien`, `/lich-am/ngay-mai`, `/lich-am/{yyyy}`, `/lich-am/{yyyy}/{mm}`, `/lich-am/{yyyy}/{mm}/{dd}` (noindex). Trang mùa vụ `/tet`, `/xem-ngay/xuat-hanh`. | 26 |
| **F3** | Can chi và mệnh: hub `/can-chi`, `/sinh-nam` và `/sinh-nam/{yyyy}` ×101, `/can-chi/60-hoa-giap` và `/can-chi/{can}-{chi}` ×60, `/nap-am` ×30, `/ngu-hanh` ×5, `/ngu-hanh/mau-hop-menh`, `/con-giap` ×12. | 27 |
| **F4** | Hub `/xem-tuoi`, `/xem-tuoi/vo-chong`, `/xem-tuoi/xong-dat`. `/tu-vi/tron-doi`. `/tu-vi/cung` ×12 và `/tu-vi/sao` ×14. `/tu-vi/luan-giai`, `/goi`. Hub `/bat-tu` và `/bat-tu/lap-la-so`. `/kinh-dich/gieo-que`. | 28 |
| **F5** | Trang nền: `/phuong-phap` +5, `/nguon` +35, `/tu-dien`, `/kien-thuc` +2, `/lien-he`, 3 trang chính sách. Trang bài viết theo `NoiDung`. Chuyển `/tu-vi-2027` vào `(v2)`. Gỡ v1. | 29 |
| **Nghiệm thu** | Quét toàn site (`scripts/kiem-dot1-seo.mjs`, quét liên kết). Bật 301/410 URL cũ bằng `scripts/seo-bat-chuyen-huong.ts --ghi` (chỉ bật dòng có đích trả 200). Không còn trang mồ côi. Mọi URL `18-url-cu-xemboi.csv` trả đúng 301 hoặc 410. Ảnh chụp đủ trang P1. | — |
| **Triển khai** | Theo bộ nhớ "Thứ tự triển khai mã trên VPS", một lần. | — |
| F6 (sau) | Hub P2: Xem ngày, Phong thủy, Kinh Dịch đủ 64 quẻ, Thần số học, Chiêm tinh, Phong tục. | 30+ |

### 2.1. Gỡ v1 (F5)

Các trang v1 sẽ gỡ:
- `src/app/page.tsx`, `src/lib/home-template.ts`;
- các route `tu-vi-hom-nay`, `tu-vi-ngay-mai`, `tu-vi-tron-doi`, `tu-tru`, `boi-dich`, `kien-thuc`, `bai-viet`, `la-so`;
- script `public/*.js?v=35`.

URL cũ xử lý như sau:

| URL v1 | Xử lý |
|:--|:--|
| `/tu-vi-hom-nay`, `/tu-vi-ngay-mai` | 410, nhóm `tu_vi_hang_ngay` đã loại. `/tu-vi-ngay-mai` → 301 `/lich-am/ngay-mai`. |
| `/tu-vi-tron-doi`, `/tu-vi-tron-doi/{slug}` | 301 `/tu-vi/tron-doi`. |
| `/tu-tru` | 301 `/bat-tu/lap-la-so`. |
| `/boi-dich` | 301 `/kinh-dich/gieo-que`. |
| `/la-so/{slug}` | Giữ nếu còn lá số đã lưu (noindex), dựng lại bằng giao diện v2. |
| `/bai-viet/{slug}` | 301 sang đường dẫn v2 của bài, nếu bài đã chuyển sang `NoiDung`. Còn lại 410. |
| `/kien-thuc` | Giữ URL, thay bằng trang v2. |

Các việc khác khi gỡ v1:
- **Root layout:** bỏ `globals.css` v1 và bỏ metadata "Bát Đại Danh Sư".
  - Biến màu mà `quan-tri.css` đang dùng (`--bg`, `--ink`, `--line`, `--card`, `--muted`, `--red`, `--good`, `--bad`, `--mid`, kèm các biến `-bg`) chuyển vào `quan-tri.css`.
- **Chat "Hội đồng thầy":** giữ API `/api/chat/*`. Giao diện chat v2 đặt ở `/tu-vi/luan-giai`, không còn nổi trên mọi trang.
  - Cần anh duyệt, xem `viec-can-anh.md`.

### 2.2. Nội dung các trang từ điển

Các bộ trang từ điển: hoa giáp, nạp âm, con giáp, cung, sao.

**Phần dữ liệu tính được** (bảng tra, công thức, năm tương ứng):
- Lấy từ engine và `src/lib/tuvi-v2/data/*.json`.
- Có nguồn sách ghi sẵn trong JSON.

**Phần diễn giải:**
- Lấy từ `NoiDung` đã xuất bản.
- Chưa có bản xuất bản thì trang chỉ hiện phần dữ liệu, kèm dòng "Phần diễn giải đang biên tập", và giữ `noindex`.
- Không dùng AI để sinh diễn giải ngay lúc hiển thị.

### 2.3. Quy tắc index

Một trang v2 chỉ được index khi `SeoTrang` của nó có `trangThai = XUAT_BAN` và `noindex = false`. Mọi trường hợp khác trả `robots: noindex, follow`.
- Trang không có dòng `SeoTrang` thì `metaTrang` trả noindex và ghi cảnh báo ở môi trường dev.
- Trước khi triển khai, anh (hoặc biên tập viên) bấm xuất bản các trang công cụ ở `/quan-tri/seo/trang`.
  - Claude Code sẽ lập sẵn danh sách trang đủ điều kiện.

## 3. Nhật ký

- 22/11: lập kế hoạch. Bắt đầu F1.
- 22/11: Claude Code xong phần lõi `src/lib/trang/*`, có test ở `tests/trang/` (6 tệp, 31 test):
  - `meta`, `dieu-huong`, `la-so` và route `POST /api/v2/la-so`;
  - `lich`: ngày, tháng, năm, lễ, Tết;
  - `can-chi`;
  - `xem-tuoi`;
  - `noi-dung`.
  Lệnh 25 đã giao Antigravity. Lệnh 26 và 27 đã soạn, chờ 25 xong mới giao.
- 22/11: thêm lõi F4:
  - `tu-vi-tu-dien.ts`: 12 cung, 14 chính tinh, bảng miếu hãm lấy từ engine.
  - `bat-tu.ts`: tứ trụ theo tiết khí, tàng can, thập thần, đại vận. Thay `lapTuTru` v1, vốn lấy trụ tháng theo tháng âm.
  - `kinh-dich.ts`: 64 quẻ Văn Vương, gieo đồng xu, Mai Hoa theo thời gian. Thay `gieoQueDich` v1, vốn chỉ có 11 quẻ và tự viết lời khuyên.
  Tổng `tests/trang` là 42 test. Lệnh 28 đã soạn, gồm cả Bát tự và Gieo quẻ. Bát tự và Gieo quẻ không phải chờ dữ liệu nên không dời sang F6: trang hiện phần tính được, phần luận giải để chỗ giữ.
- 22/11: nghiệm thu Lệnh 26 (Lịch âm, `/tet`).
  - 14 URL trả mã đúng (200/404). Quét 185 liên kết nội bộ, không có 404. 0 lỗi console.
  - Ở màn hình 375px không cuộn ngang. Đối chiếu ngày Tết 17/02/2026 khớp.
  - Đã nâng `DOT_DA_DUNG = 2` và thêm `/tet` vào menu Lịch âm.
- 22/11: nghiệm thu Lệnh 27 (Can chi & mệnh).
  - 18 URL trả mã đúng. Quét 228 liên kết nội bộ, không có 404. Trang 1990 khớp: Canh Ngọ, Lộ Bàng Thổ, nam Khảm, nữ Cấn, năm âm từ 27/01/1990.
  - Sửa lỗi ở lõi: Tý và Tỵ trùng slug `ty`. Nay Tỵ dùng `ti`, có test kèm. Tổng `tests/trang` là 43 test.
  - Đã nâng `DOT_DA_DUNG = 3` và thêm "Màu hợp mệnh" vào menu.
  - CSS cụm ở `src/components/ck/tu-dien.css` (13 KB).

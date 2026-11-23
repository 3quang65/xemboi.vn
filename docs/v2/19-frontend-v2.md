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
- 22/11: nghiệm thu Lệnh 28 (F4).
  - 17 URL trả mã đúng. Quét 67 liên kết, không có 404. Đối chiếu tay bảng Bát tự 1/1/2000 (thập thần, tàng can, nạp âm, đếm hành) khớp. Gieo quẻ không có lỗi console.
  - Liên kết từ lá số sang trang cung và sao: tên cung, tên sao của engine khớp slug từ điển.
  - Lõi thêm `linhVuc` cho 12 cung, chữ Hán cho 14 chính tinh và `NGUON_AN_SAO`, để điền mẫu SEO `{lĩnh vực}`, `{Hán}`, `{nguồn}`.
  - Đã nâng `DOT_DA_DUNG = 4`. Menu có thêm Kinh Dịch, tạm trỏ `/kinh-dich/gieo-que` vì hub để F6. `/goi` dời sang đợt 5 (chưa dựng). Tổng `tests/trang` là 44 test.
- 22/11: nghiệm thu Lệnh 29 (F5: phương pháp, nguồn sách, từ điển, kiến thức, bài viết, liên hệ, chính sách).
  - Lõi mới `src/lib/trang/nen.ts`: 164 nguồn công khai (nhãn mảng và chữ "metadata" đã làm sạch), 336 thuật ngữ nhóm theo 6 mảng có liên kết sang trang đã có, bảng tháng nhuận 1900–2100 theo quy ước lịch sử (UTC+8 trước 1968; ghi chú 3 năm 1917, 1922, 1938 nếu tính UTC+7), bảng 22 quy ước tính lấy từ đặc tả bộ máy.
  - `tachMarkdown` nay đổi thân HTML của bài v1 sang khối (tiêu đề, danh sách, đậm, liên kết, trích) thay vì dồn một đoạn.
  - 19 URL trả mã đúng, quét 246 liên kết không có 404; 4 trang pháp lý và liên hệ là chỗ giữ, noindex. Bốn bài `/bai-viet/*` có `SeoTrang.noindex = true` từ lúc chuyển bài cũ: giữ vậy tới khi quyết 301 (viec-can-anh mục 12).
  - Lõi sửa thay cho cách lách của Antigravity: `DOT_DA_DUNG = 5`; `trangDaDung()` có thêm 5 trang con `/phuong-phap/*`; `/bai-viet` nhận cha `/kien-thuc` trong breadcrumb. `/goi` dời sang đợt 6 (chờ anh chốt giá). Tổng `tests/trang` là 51 test.
  - Gỡ v1 (mục 2.1): đã xóa route `tu-vi-hom-nay`, `tu-vi-ngay-mai`, `tu-vi-tron-doi`, `tu-tru`, `boi-dich`, `kien-thuc`, `bai-viet`, `la-so`, `home-template.ts`, 7 tệp `public/*.js` và 4 component v1. `/tu-vi-hom-nay/*` và `/tu-vi-ngay-mai/{slug}` trả 410; `/tu-vi-ngay-mai` 301 `/lich-am/ngay-mai`; `/tu-vi-tron-doi/*`, `/tu-tru`, `/boi-dich` 301 như bảng. **Lệch bảng:** `/la-so/{slug}` tạm 301 `/tu-vi/lap-la-so` (chưa dựng lại trang lá số lưu bằng v2). Chuyển hướng đặt trong `next.config.mjs` và route handler, vì `SeoChuyenHuong` khớp theo tên miền xemboi.vn còn các route này chỉ từng chạy ở bản thử. `public/sw.js` thay bằng bản tự xóa bộ nhớ đệm và gỡ đăng ký.
  - Bỏ hẳn `src/app/globals.css` và script giao diện tối v1 khỏi layout gốc. Biến màu, nền và font Google của khu quản trị chuyển vào `quan-tri.css`; v2 thêm `ck-nen.css` (nút, ô nhập kế thừa font), trang R1 thêm `r1-nen.css`. Kiểm 15 trang ở 375 px: không tràn ngang; v2 không còn biến v1.
- 22/11: sửa lỗi build. Lúc `next build`, mỗi tiến trình con mở bể kết nối Prisma riêng, vượt `max_connections`; 532 truy vấn lỗi bị lib nuốt nên trang tĩnh có thể ra rỗng hoặc 404. Nay build dùng 1 kết nối mỗi tiến trình, và lỗi CSDL lúc build làm build thất bại (`nemLoiKhiBuild`). Build lại: 0 lỗi, 489 trang.
- 22/11: nghiệm thu Lệnh 30 (`/tu-vi-2027` vào khung v2).
  - Trang chuyển sang `src/app/(v2)/tu-vi-2027/`, bỏ đầu trang, menu "Sắp có" và chân trang riêng của R1; breadcrumb v2; một thẻ `<main>`. Lập lá số, hộp thoại mua và đo lường R1 giữ nguyên; `tests/r1` 15/15.
  - CSS phần quản trị R1 (`.r1-root`) chuyển sang `src/app/quan-tri/(khu)/r1/r1-quan-tri.css`; thư mục `src/app/tu-vi-2027/` đã xóa. Mọi trang công khai nay nằm trong `(v2)`.
  - Sửa `.ck-chan-in` trong `ck.css`: `1.3fr` ghép `repeat(auto-fit, …)` không hợp lệ nên chân trang desktop bị dồn một cột từ F1; nay `minmax(240px, 1.3fr) repeat(auto-fit, minmax(170px, 1fr))`.
- 22/11: rà 55 trang P1, còn 8 trang 404. Dựng `/xem-ngay/xuat-hanh` (Lệnh 31).
  - Dữ liệu `src/lib/trang/xuat-hanh.ts`:
    - Giờ hoàng đạo mùng 1–10 Tết.
    - Hướng Hỷ thần, Tài thần, Phúc thần theo can ngày, lấy từ ba bài ca của Ngọc hạp ký (WS12, Wikisource CC BY-SA, đoạn `rag_doan` 8069, 8071, 8072).
    - Test đọc lại nguyên văn chữ Hán để đối chiếu bảng; `tests/trang` nay có 58 test.
  - Dòng SEO đổi từ "theo các sách" thành "theo Ngọc hạp ký", vì trang mới đối chiếu một sách.
  - Thêm route chờ bài `/tu-vi/cach-doc-la-so`: 404 tới khi có bài xuất bản.
  - Bảy trang P1 còn lại cần anh quyết hoặc cần người viết, xem viec-can-anh mục 13.
- 22/11: bật chuyển hướng URL cũ ở CSDL máy trạm (`seo-bat-chuyen-huong.ts --ghi --ca-410`).
  - 49 dòng đã bật: 301 khi trang đích trả 200, cùng các dòng 410.
  - 57 dòng còn chờ trang đích P2 (F6).
  - Lúc deploy phải chạy lại script này trên VPS, trỏ `--goc` vào máy chủ v3.
- 22/11: quét toàn site dev. Trang lịch chỉ mở năm 2025–2028.
  - 1.954 trang trả 200, 0 liên kết hỏng, 0 title còn `{...}`, 0 trang v1.
  - Đang index được 3 trang: `/`, `/tu-vi-2027`, `/kien-thuc`. Còn lại chờ xuất bản (viec-can-anh mục 6.2).
  - Sửa: sitemap bỏ nhóm `hien-tai`, vì nhóm này còn liệt kê 213 URL v1 đã 301/410. Đã xóa `src/lib/seo/sitemap-cu.ts`.
- 22/11: **triển khai một lần lên v3.xemtuvi.vn** (bản `releases/20261122-2118`, mã commit 7b997bf).
  - CSDL: sao lưu `sao-luu/truoc-v2-*.dump`; thử trên bản sao `xemboi_v3_thu` trước (đã xóa sau khi xong).
    - Tạo bằng postgres: role NOLOGIN `xemboi_web`, `xemboi_quantri`, `xemboi_worker`; extension `pg_trgm`.
    - Chạy `migrate resolve --applied 0000_nen` rồi `migrate deploy` (0001, 0002). Migration chỉ thêm bảng, không sửa bảng cũ.
  - Dữ liệu từ máy trạm (`--data-only --disable-triggers`): 24 bảng công khai, gồm 164 nguồn, 32.061 đoạn `CONG_KHAI`, 336 thuật ngữ, kho SEO, 4 bài.
    - Không chuyển: tài khoản, phiên, nhật ký, số GSC giả, việc RAG.
    - Dữ liệu R1 giữ nguyên: 14 R1Event, 10 PageEvent, 8 phiên. 2 sự kiện thử lúc kiểm đã xóa.
  - Env: thêm `NINEROUTER_API_KEY`. `CaiDat.LLM.baseUrl` = `http://127.0.0.1:20128/v1`. Đã seed 9 trợ lý AI.
  - nginx: mở mọi đường dẫn, giữ `X-Robots-Tag: noindex, nofollow`.
    - Snippet proxy thêm `X-Forwarded-Host` và `proxy_redirect`, vì `/quan-tri` từng chuyển sang `https://localhost:3027`.
    - Bản nginx cũ lưu ở `/home/claude/nginx-*.bak-*`.
  - Cron (giờ VN): 1:30 `seo-quet.ts` rồi `seo-goi-y-lien-ket.ts`; 3:00 `sao-luu-csdl.mjs`. `seo-gsc.ts` chờ khóa (viec-can-anh mục 1).
  - Kiểm từ ngoài:
    - 31 trang chính trả 200, thời gian 0,2–0,8 giây;
    - URL v1 trả 410 hoặc 301 đúng bảng; trang lạ trả 404;
    - 0 lỗi console; log dịch vụ sạch.
  - Quay lại bản cũ: trỏ `current` về `releases/20261121-0011`, restart, khôi phục dump `truoc-v2`.
- 23/11: đã push nhánh `lam-lai-v2` lên GitHub.
- 23/11: **F6 Xem ngày.**
  - Lib `src/lib/trang/xem-ngay.ts`:
    - tháng tiết tính theo giờ VN;
    - trực đối chiếu Hiệp kỷ 716/716;
    - 12 thần khớp `getDayTianShen` của lunar-javascript cho mọi ngày 2025–2027;
    - nghi kỵ và thần sát lấy từ lunar-javascript 1.7.8 (MIT, ghi trong sổ 14), có tên tiếng Việt cho đủ 142 + 152 mục.
  - Antigravity làm giao diện (Lệnh 32): hub, 6 trang việc, trang tháng.
  - Menu thêm mục "Xem ngày". `ck.css` thêm quy tắc thu khoảng cách menu ở 1001–1240px để menu không xuống dòng.
  - SEO nhóm XN: bỏ các cụm "28 sao", "theo tuổi" vì trang chưa có; bỏ ghi chú biên tập lọt vào phần mô tả. Đã sửa CSDL máy trạm; lần deploy tới phải sửa trên VPS bằng `may-tram/seo-xn-moi.json`.
  - Quét dev: 1.372 trang trả 200, 0 liên kết hỏng, 0 chỗ trống.
- 23/11: **F6 Kinh Dịch.**
  - Dữ liệu:
    - nguyên văn 64 quẻ `src/lib/trang/du-lieu/chu-dich-64.json` (Kanripo KR1a0001, CC BY-SA 4.0, đối chiếu KR1a0006);
    - phiên âm `chu-dich-64-phien-am.json` (ghép từ DS05, Apache-2.0; 232 quyết định chữ đa âm, 39 chỗ chưa chắc chờ người duyệt, xem `viec-can-anh.md` mục 16);
    - lib `src/lib/trang/chu-dich.ts`: quẻ hỗ/đảo/đối, 8 quái với câu Thuyết quái (kèm phiên âm), `daDungKinhDich()`.
  - Antigravity làm giao diện (Lệnh 33): hub `/kinh-dich`, `/kinh-dich/64-que` (danh sách + bảng 8×8), 64 trang quẻ, 8 trang quái (dựng tĩnh), lời quẻ và lời hào động trên trang gieo quẻ.
  - Trang chỉ có nguyên văn, phiên âm và phần tính được; bản dịch, lời bình chờ `NoiDung` đã duyệt.
  - Menu Kinh Dịch thêm "64 quẻ"; breadcrumb trang quẻ, quái đi qua `/kinh-dich/64-que`.
  - Quét dev: 1.446 trang, 1.443 trả 200; 3 trang 500 do dev Next đọc JSON dở khi dựng song song, gọi lại đều 200. 0 chỗ trống.
- 23/11: **F6 Phong thủy.**
  - Nguồn: Hiệp kỷ biện phương thư (Kanripo KR3g0051, CC BY-SA 4.0). Kho chỉ có bản quét Bát trạch minh kính, OCR không dùng được, nên không dẫn sách đó.
    - Cung phi theo câu "九宫建宅" (quyển 35); mốc thượng nguyên năm 1684 (quyển 8).
    - 8 du niên theo phép đại du niên "相宅家用之" (quyển 2), tính từ hào biến; khớp 64/64 ô bảng tay ở `xem-tuoi.ts`.
    - 24 sơn thuộc 8 cung (quyển 2). Số 5 gửi Khôn/Cấn ghi rõ là quy ước, Hiệp kỷ không chép.
    - Lib `src/lib/trang/phong-thuy.ts`; test so từng câu trích với bản Kanripo.
  - Antigravity làm giao diện (Lệnh 34): hub, công cụ cung phi, 8 trang cung (dựng tĩnh), bát trạch (bảng 8 × 8), công cụ hướng nhà (vòng 24 sơn SVG); liên kết từ `/sinh-nam/*` và xem tuổi vợ chồng.
  - Menu thêm mục "Phong thủy" (8 mục). Thu khoảng cách menu trong `ck-nen.css` (ck.css đã chạm trần) để vừa một dòng từ 1001px.
  - SEO nhóm PT: bỏ "Bát trạch minh kính", "hướng bếp, bàn thờ". Đã sửa CSDL máy trạm; deploy tới sửa trên VPS bằng `may-tram/seo-pt-moi.json`.
  - Bật 7 chuyển hướng URL cũ sang `/phong-thuy/cung-phi`, `/phong-thuy/huong-nha` ở CSDL máy trạm; còn 32 dòng chờ trang đích.
  - Chưa làm: thước Lỗ Ban, hỏi đáp phong thủy (viec-can-anh mục 17).
  - Quét dev: 1.458 trang, 1.453 trả 200; 5 trang 500 lúc dev biên dịch song song, gọi lại đều 200 (bản build dựng tĩnh các trang này không lỗi). 0 chỗ trống, 0 trang v1.
- 23/11: **F6 Thần số học.**
  - Không có nguồn loại A (12 mục 3), nên cụm chỉ có cách tính và số liệu đếm được; mỗi chỗ người đọc chờ "ý nghĩa" hiện câu `GHI_CHU_Y_NGHIA` giải thích vì sao chưa đăng (viec-can-anh mục 18).
  - Lib `src/lib/trang/than-so-hoc.ts`: số chủ đạo hai cách (cộng dồn, rút từng phần; khác nhau ở 4.725/36.890 ngày 1930–2030), năm cá nhân, biểu đồ 3×3 (8 đường, chỉ ghi vị trí, không dùng tên "mũi tên" của sách), 4 đỉnh cao, tên tiếng Việt (bỏ dấu, Đ = D, Y nguyên âm). Đã đối chiếu quy tắc master của Taylor 1926 trên bản quét archive.org.
  - Antigravity làm giao diện (Lệnh 35): hub, công cụ số chủ đạo, 12 trang số, biểu đồ ngày sinh, theo tên (tính trên trình duyệt, không gửi tên đi), 9 trang năm cá nhân.
  - Sửa sau duyệt: dòng "tổng từ 3 đến 45" là số đoán, đổi sang khoảng đếm thật 4–48; ví dụ ngày sinh tự chọn năm có ví dụ (số 2 không có ngày nào năm 1990, số 33 không có năm 2000).
  - Menu: cờ `them` trong `dieu-huong.ts`; desktop gom hub phụ vào nút "Thêm" và bỏ mục "Trang chủ" (logo đã dẫn về). Một hàng ở 1001–1920px.
  - SEO nhóm TSH sửa chữ cho khớp (bỏ "tính cách, nghề", "ý nghĩa"); deploy tới sửa VPS bằng `may-tram/seo-tsh-moi.json`. Không có URL cũ nào chuyển hướng sang cụm này.
  - Quét dev: 1.483 trang, 1.473 trả 200; 10 trang 500 lúc dev biên dịch song song, gọi lại đều 200 (build qua). 0 chỗ trống, 0 trang v1. 121/121 test, tsc 0 lỗi.
- 23/11: **F6 Chiêm tinh.**
  - Lib `src/lib/trang/chiem-tinh.ts`: 12 cung, giờ Mặt Trời vào cung (VSOP87D, tìm quanh mốc ước rồi chia đôi), tra cung theo ngày giờ sinh có báo ngày chuyển cung, dữ liệu Tetrabiblos quyển I (ch. XIV, XV, XX, XXI, XXII) kèm câu trích nguyên văn Ashmand 1822, đã kiểm khớp từng chữ với tệp Gutenberg.
  - Antigravity làm giao diện (Lệnh 36): hub có vòng 12 cung SVG, công cụ tra cung + bảng 12 cung, 12 trang cung. Đã duyệt chữ: không có tính cách, nguyên tố, hợp cung, bản dịch.
  - Menu "Thêm" có Chiêm tinh. Không làm bản đồ sao, hành tinh, nhà (để sau).
  - 129/129 test, tsc 0 lỗi.
- 23/11: **Thần số học: phần ý nghĩa.**
  - Lib `than-so-hoc-y-nghia.ts` (chỉ server) + `du-lieu/than-so-hoc-nhat-nguyet.json` sinh từ kho Nhật Nguyệt (commit 708b5c3): 65 đơn vị, 159 đoạn sách. Bảng `SUA_OCR` sửa 14 lỗi OCR, JSON giữ nguyên nguồn.
  - `than-so-hoc.ts` thêm thái độ, 4 thách thức, nợ nghiệp ngày sinh; khớp 600/600 ca Nhật Nguyệt.
  - Antigravity làm giao diện (Lệnh 37): `KhoiYNghia` (lời, đoạn sách riêng và chung tách rõ, ghi công cuối khối), trang số chủ đạo, năm cá nhân, biểu đồ ngày sinh, dòng ngắn trên hub. Tách `KetQuaTenUi.tsx` để JSON không vào bundle client (build: 0 chỗ "Cheasley" trong `.next/static`).
  - Đã duyệt: lời in đúng nguyên chữ, tiếng Anh không dịch, mọi khối có ghi công. 138/138 test, tsc 0 lỗi, build 617 trang.
- 23/11: **Phong thủy: Cửu tinh năm, tháng.**
  - Lib `src/lib/trang/cuu-tinh.ts`: sao năm (mốc 1684 thượng nguyên, nghịch), sao tháng theo chi năm, bàn thuận bố, mốc đổi năm/tháng theo tiết (VSOP87D). 5 câu trích Hiệp kỷ (quyển 2, 8) có phiên âm.
  - Test đối chiếu Kanripo: 600 ô bảng năm, 36 ô bảng tháng, câu trích khớp nguyên văn; công thức rút gọn của fengshui.skill khớp 1684–2223.
  - Antigravity làm giao diện (Lệnh 38): bàn 3×3 Nam ở trên, màu theo tên sao, 12 bàn tháng, trang chính có chọn năm (có tham số thì noindex), 16 trang năm, thẻ thứ tư ở hub Phong thủy.
  - Sửa kèm: câu cung phi "九宫建宅" ở quyển 35, không phải 34 (Kanripo thiếu quyển 14 nên số tệp lệch).
  - 138/138 test, tsc 0 lỗi, build qua.
- Deploy lần tới phải chạy `npm ci` vì có gói mới `lunar-javascript`.
- 23/11: **Bản đồ sao** `/chiem-tinh/ban-do-sao` (cụm Chiêm tinh).
  - Lib `ban-do-sao.ts`: astronomy-engine 2.1.19 (MIT) cho 10 thiên thể, khớp JPL Horizons DE441 dưới 1′ ở 6 mốc 1901–2026; cung mọc, thiên đỉnh kiểm bằng phép quay sang hệ chân trời; nhà trọn cung; phẩm vị ch. XX, XXII; lời Tetrabiblos ch. IV, XIII.
  - Múi giờ Việt Nam theo IANA, tách hai miền 1960–6/1975 theo vĩ tuyến 17; 1947–1955 ghi "chưa chắc", cho chọn lại. 63 tỉnh lỵ từ GeoNames (CC BY 4.0).
  - Antigravity làm giao diện (Lệnh 39): form GET, mặc định "bầu trời lúc này tại Hà Nội", vòng SVG (ASC bên trái), bảng vị trí, 9 khối trích, ghi công. Thư viện thiên văn chỉ chạy ở server (0 chuỗi của nó trong `.next/static`).
  - Kèm theo: tắt ba API chat cũ thời v1 (`BAT_CHAT_CU=1` để bật lại).
  - 147/147 test, tsc 0 lỗi, build qua.
- Deploy lần tới phải chạy `npm ci` vì có gói mới `astronomy-engine`.
- 23/11: **triển khai lên v3.xemtuvi.vn** (bản `releases/20261123-2345`, mã commit c0abafd, đã push `lam-lai-v2`).
  - Gồm mọi việc từ bản 22/11: Xem ngày (Lệnh 33–34), Phong thủy + Cửu tinh, Kinh Dịch, Thần số học (cả phần ý nghĩa Nhật Nguyệt), Chiêm tinh + Bản đồ sao.
  - `npm ci` (gói mới `lunar-javascript`, `astronomy-engine`), `migrate status` không có migration mới, build qua.
  - Sao lưu CSDL trước khi chuyển: `~/sao-luu/xemboi/xemboi-20261123-2347.dump`.
  - SEO: nạp lại 31 dòng XN, PT, KD, TSH, CT bằng `napTrangCsv` với tập trang rỗng. NHAP 154 → 156, XUAT_BAN giữ 7 (không tự xuất bản).
  - Chuyển hướng: bật thêm 25 dòng 301 mà đích đã trả 200; còn 32 dòng chờ trang `/xem-tuoi/*`. Bảng chỉ khớp miền `xemboi.vn`, nên trên `v3.xemtuvi.vn` các URL cũ vẫn 404 cho tới khi chuyển tên miền.
  - Kiểm: 8 trang ngoài trả 200 (0,2–0,6 giây); API chat cũ trả 410; log dịch vụ sạch.
  - Quay lại: trỏ `current` về `releases/20261122-2118`, restart.
- 24/11: **chuẩn trực quan** (docs/v2/21, 22) áp cho mọi công cụ cũ và mới; mỗi công cụ soi ≥ 4 công cụ thị trường trước khi làm.
  - Bát tự (Lệnh 40, Antigravity làm giao diện):
    - Đọc nhanh, 4 thẻ trụ chữ lớn, hình cung quan hệ (5 kiểu nét, phân biệt được cả ở ảnh xám), ngũ hành có % và tag Khuyết, dải đại vận có "Đang chạy" và mốc giao vận;
    - thành phần dùng chung đặt ở `components/ck/truc-quan/`.
  - Dữ liệu (Claude Code, đều có test):
    - `bat-tu-truc-quan.ts`: quan hệ can chi trích Tam mệnh thông hội, mốc giao vận;
    - `xem-ngay-truc-quan.ts` cùng tệp `lich.ics`;
    - `phan-truc-quan.ts`;
    - `truc-quan-43.ts`.
  - Lệnh 41–43 đã viết, giao lần lượt.
  - Soi thị trường bát tự với 6 công cụ: 4 trụ và mốc khởi vận khớp; các trang lệch nhau ở dụng thần và cách đếm ngũ hành, nên mình không hiện dụng thần.

# Kiểm kê URL cũ của xemboi.vn và bảng chuyển hướng 301 sang v2

Ngày thu thập sitemap công khai: **22/11/2026** (từ `https://xemboi.vn/sitemap.xml` và 11 sitemap con; toàn bộ trả HTTP 200, không bị chặn bot, không cào từng trang).  
Dữ liệu chi tiết từng URL/mẫu: [18-url-cu-xemboi.csv](file:///d:/VibeCode/Antigravity/xemboi.vn/docs/v2/18-url-cu-xemboi.csv) (UTF-8 không BOM, 116 dòng đại diện cho 845 URL).  
Đối chiếu theo: [16-seo-trang.csv](file:///d:/VibeCode/Antigravity/xemboi.vn/docs/v2/16-seo-trang.csv), [16-quy-tac-gan-tu-khoa.json](file:///d:/VibeCode/Antigravity/xemboi.vn/docs/v2/16-quy-tac-gan-tu-khoa.json), [gan-tu-khoa.csv](file:///d:/VibeCode/Antigravity/xemboi.vn/docs/v2/tu-khoa/gan-tu-khoa.csv) và [07-bach-khoa-huyen-hoc.md](file:///d:/VibeCode/Antigravity/xemboi.vn/docs/v2/07-bach-khoa-huyen-hoc.md) (mục 3.5).

---

## 1. Tổng số URL theo nhóm sitemap

| Nhóm sitemap | Tổng URL | Số dòng CSV | GIU | 301 | 410 | CHO_QUYET | Ghi chú |
|:--|--:|--:|--:|--:|--:|--:|:--|
| `static` | 7 | 7 | 1 | 1 | 0 | 5 | Trang chủ, `/tin-tuc`, `/lien-he` và 4 trang chính sách |
| `lich-van-nien` | 13 | 13 | 0 | 13 | 0 | 0 | `/lich-van-su`, `/lich-van-nien` và 11 năm `2025`–`2035` |
| `xem-ngay-tot-xau` | 730 | 1 | 0 | 730 | 0 | 0 | 1 mẫu lập trình `/xem-ngay-tot-xau-ngay-{d}-{m}-{yyyy}` (01/01/2026–31/12/2027) |
| `articles` | 2 | 2 | 0 | 0 | 2 | 0 | 2 bài "xem bói hôm nay" theo ngày cụ thể |
| `xem-tuoi` | 18 | 18 | 1 | 14 | 3 | 0 | Hub `/xem-tuoi`, công cụ xem tuổi, sao hạn, số hợp tuổi |
| `xem-ngay` | 21 | 21 | 1 | 19 | 1 | 0 | Hub `/xem-ngay` và các trang xem ngày theo việc |
| `xem-boi` | 20 | 20 | 1 | 4 | 15 | 0 | Phần lớn là nốt ruồi, điềm báo, bói vui; có `/boi-tinh-yeu` |
| `tu-vi` | 5 | 5 | 1 | 2 | 2 | 0 | Hub `/tu-vi`, lập lá số tử vi/bát tự và 2 trang cân xương |
| `phong-thuy` | 9 | 9 | 1 | 7 | 1 | 0 | Hub `/phong-thuy`, 6 trang hướng, thước Lỗ Ban, sim số |
| `gieo-que-xin-xam` | 19 | 19 | 0 | 19 | 0 | 0 | Kinh Dịch, Mai Hoa, `/gieo-que-xin-xam` và 16 trang `/que-xam-*` |
| `nhan-tuong` | 1 | 1 | 0 | 1 | 0 | 0 | `/nhan-tuong` → `/kien-thuc/nhan-tuong-hoc` |
| **Tổng cộng** | **845** | **116** | **6** | **810** | **24** | **5** | |

---

## 2. Thống kê quyết định (`GIU` / `301` / `410` / `CHO_QUYET`)

| Quyết định | Số URL | Tỷ lệ URL | Số dòng CSV | Tóm tắt nội dung |
|:--|--:|--:|--:|:--|
| **GIU** | **6** | 0,7% | 6 | `/`, `/xem-tuoi`, `/xem-ngay`, `/boi-tinh-yeu`, `/tu-vi`, `/phong-thuy` |
| **301** | **810** | 95,9% | 81 | 80 URL lẻ + 1 mẫu 730 URL ngày (`/xem-ngay-tot-xau-ngay-{d}-{m}-{yyyy}` → `/lich-am/{yyyy}/{mm}/{dd}`) |
| **410** | **24** | 2,8% | 24 | Thuộc các nhóm `LOAI:*` trong `16-quy-tac-gan-tu-khoa.json`: `not_ruoi` (6), `boi_vui_xep_hang` (6: vỏ ốc, túi xách, ai cập, kiều, 2 cân xương), `diem_bao_dan_gian` (3: nháy mắt, hắt xì, mở cửa đoán việc), `tu_vi_hang_ngay` (3: xem bói hằng ngày + 2 bài tin tức), `sao_han_tra_cuu` (2), `sim_bien_so_so_dep` (3: sim số, bói số, số hợp tuổi), `tang_le_trung_tang` (1: an táng) |
| **CHO_QUYET** | **5** | 0,6% | 5 | `/lien-he` và 4 trang `/chinh-sach-*` chưa có trong `16-seo-trang.csv` |

### Lưu ý kỹ thuật khi triển khai 301
1. **Mẫu 730 URL ngày (`xem-ngay-tot-xau`)**: cần quy tắc regex trong middleware/bảng `SeoChuyenHuong` chuẩn hóa `{d}`, `{m}` không có số 0 đầu sang 2 chữ số `{mm}`, `{dd}` (ví dụ `/xem-ngay-tot-xau-ngay-6-2-2027` → `/lich-am/2027/02/06`). Lưu ý `LICH-NGAY` đang cấu hình `noindex,follow` trong v2 — vẫn nên 301 để giữ trải nghiệm người dùng từ link cũ thay vì trả 404.
2. **Hai trang đích đang gắn `CẦN ANH DUYỆT` trong `16-seo-trang.csv`**:
   - `PTUC-XINXAM` (`/phong-tuc/xin-xam`, P3): đang nhận 301 từ **17 URL** (`/gieo-que-xin-xam` + 16 `/que-xam-*`). Nếu anh quyết **không** xuất bản bài văn hóa xin xăm, toàn bộ 17 URL này chuyển sang `410`.
   - `XT-BOITINHYEU` (`/boi-tinh-yeu`, P1): liên quan **3 URL** (giữ `/boi-tinh-yeu`, 301 `/boi-cap-tinh-nhan` và `/boi-tinh-yeu-theo-ngay-sinh`). Nếu anh bỏ trang này, 3 URL chuyển 301 về `XT-VOCHONG` (`/xem-tuoi/vo-chong`).
3. **Thứ tự triển khai theo đợt**: một số đích 301 thuộc P2/P3 (như `/phong-thuy/thuoc-lo-ban`, `/boi-bai`, `/kinh-dich/mai-hoa-dich-so`, `/van-khan/an-vi-bat-huong`, `/kien-thuc/nhan-tuong-hoc`). Khi cắt tên miền chính sang v2 ở đợt sớm, chỉ bật 301 sang các URL đã có trang thật, tránh chuỗi 301 → 404.

---

## 3. Danh sách `CHO_QUYET` để anh xem

Tất cả 5 URL `CHO_QUYET` đều nằm trong `sitemap-static.xml` vì `docs/v2/16-seo-trang.csv` hiện chưa liệt kê bộ trang liên hệ và pháp lý:

| URL cũ | Nhóm | Gợi ý phương án cho anh chọn |
|:--|:--|:--|
| `/lien-he` | `static` | **Nên giữ** (`/lien-he`) vì mọi site thương mại/E-E-A-T đều cần trang liên hệ; hoặc 301 về `/phuong-phap` nếu chưa dựng riêng |
| `/chinh-sach-ban-quyen` | `static` | Giữ nguyên URL hoặc 301 về bộ trang pháp lý chuẩn của v2 (ví dụ `/chinh-sach/ban-quyen` hoặc `/dieu-khoan`) |
| `/chinh-sach-su-dung-va-khieu-nai` | `static` | Giữ nguyên URL hoặc 301 về trang điều khoản sử dụng / hoàn tiền của v2 |
| `/chinh-sach-bao-mat-va-cookies` | `static` | Giữ nguyên URL hoặc 301 về trang chính sách bảo mật v2 (bắt buộc khi có thu thập dữ liệu/thanh toán VietQR) |
| `/chinh-sach-binh-luan-va-gop-y` | `static` | Nếu v2 không mở bình luận công khai: 301 sang `/lien-he` hoặc `/chinh-sach-su-dung-va-khieu-nai` (hoặc `410`) |

---

## 4. Các trang v2 chưa có mà site cũ có nhiều URL (gợi ý cho `16-seo-trang.csv`)

1. **Bộ trang pháp lý & liên hệ (5 URL ở `static`)** — **Đề xuất bổ sung vào `16-seo-trang.csv`** (mạng `nen-tang`, P1): tối thiểu 4 trang `/lien-he`, chính sách bảo mật, điều khoản sử dụng/hoàn tiền, bản quyền để đáp ứng yêu cầu pháp lý và E-E-A-T, đồng thời hứng trực tiếp 5 URL cũ.
2. **Các trang hướng phong thủy theo từng không gian (6 URL ở `phong-thuy`)**: site cũ tách riêng `xem-huong-nha`, `xem-huong-bep`, `xem-huong-ban-tho`, `xem-huong-phong-ngu`, `xem-huong-ban-lam-viec`, `xem-huong-nha-tam-hop-tuoi`. Hiện v2 gom toàn bộ về `PT-HUONGNHA` (`/phong-thuy/huong-nha`). **Gợi ý**: giữ gom ở P2; sau khi lên sóng, nếu GSC cho thấy `hướng bếp` hoặc `hướng bàn thờ` có lượng tìm lớn và cần bài sâu riêng thì tách thêm 2 trang con `/phong-thuy/huong-bep` và `/phong-thuy/huong-ban-tho`.
3. **Các trang xem ngày theo việc chi tiết hơn (nhóm `xem-ngay`)**: site cũ có các trang riêng cho `mua-nha`, `ky-hop-dong`, `nhan-chuc`, `dat-bep-sua-bep`, `chuyen-ban-tho`, `xay-dung`, `do-tran-lop-mai` (ngoài 7 việc v2 đã có). Hiện đã ánh xạ về đích gần nghĩa nhất (`XN-MUAXE`, `XN-KHAITRUONG`, `XN-DONGTHO`, `VK-ANVI`). **Gợi ý**: nếu dữ liệu GSC của site cũ cho thấy `/xem-ngay-tot-mua-nha` hoặc `/xem-ngay-tot-ky-hop-dong` có thứ hạng tốt, cân nhắc bổ sung vào `16-seo-trang.csv` thay vì gom vào `XN-MUAXE` / `XN-KHAITRUONG`.
4. **Cụm 16 trang `/que-xam-*` (nhóm `gieo-que-xin-xam`)**: site cũ có 16 URL riêng cho từng loại xăm (Quan Âm, Khổng Minh, Tả Quân, Bà Chúa Xứ, Quỷ Cốc Tử…). **Không đề xuất** tách 16 trang con vào `16-seo-trang.csv` vì định vị v2 (07 I1) không làm công cụ xin xăm; chỉ giữ 1 bài văn hóa `PTUC-XINXAM` (nếu anh duyệt) để hứng 301, hoặc trả `410` toàn bộ.
5. **Cụm 24 URL bị loại (`LOAI:*`)**: nốt ruồi (6), bói vui/cân xương (6), điềm báo (3), xem bói hằng ngày (3), sao hạn (2), sim/bói số (3), an táng (1) — **không bổ sung**, giữ `410 Gone` đúng định vị v2.

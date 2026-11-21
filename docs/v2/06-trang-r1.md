# Báo cáo Trang Thí Nghiệm R1 (`/tu-vi-2027`) — Mốc T1 Kế hoạch 90 ngày

> Ngày lập: **20/11/2026** · Cơ sở: [`04-dinh-vi-kinh-doanh.md`](04-dinh-vi-kinh-doanh.md) (mục 1, 3.1, 3.2, 6), [`03-khach-hang.md`](03-khach-hang.md), [`05a-ban-giao-engine.md`](05a-ban-giao-engine.md), [`05b-lich-meeus-va-test-p0.md`](05b-lich-meeus-va-test-p0.md).
> Phạm vi: Không gắn cổng thanh toán/VietQR/STK; không sửa `src/lib/tuvi-v2/`, `src/lib/core/`, các trang cũ; không commit git.

---

## 1. Các tuyến & tệp đã tạo

| Thành phần | Đường dẫn | Vai trò |
|---|---|---|
| Trang thí nghiệm R1 | [`src/app/tu-vi-2027/page.tsx`](../../src/app/tu-vi-2027/page.tsx), [`r1.css`](../../src/app/tu-vi-2027/r1.css) | Giao diện mobile-first (`/tu-vi-2027`), tông sáng thanh tĩnh, không đỏ đen dọa nạt |
| Luồng tương tác & Lá số | [`TrangR1Client.tsx`](../../src/components/r1/TrangR1Client.tsx), [`LaSo12Cung.tsx`](../../src/components/r1/LaSo12Cung.tsx), [`HopThoaiMua.tsx`](../../src/components/r1/HopThoaiMua.tsx) | Form không hỏi tên/SĐT, lá số 12 cung thật (thẻ dễ đọc 375px + lưới 4×4), bản mẫu biên tập, khối giá (ẩn 149k khi chưa rõ giờ), hộp thoại trung thực |
| Logic R1 & kho câu tĩnh | [`copy.ts`](../../src/lib/r1/copy.ts), [`ban-mau-bien-tap.ts`](../../src/lib/r1/ban-mau-bien-tap.ts), [`kho-cau-tinh.ts`](../../src/lib/r1/kho-cau-tinh.ts), [`metrics.ts`](../../src/lib/r1/metrics.ts), [`tu-cam.ts`](../../src/lib/r1/tu-cam.ts), [`store.ts`](../../src/lib/r1/store.ts), [`admin-auth.ts`](../../src/lib/r1/admin-auth.ts) | Câu chữ chuẩn 04 mục 6.1, 3 nhận định Mệnh–Thân + 1 chủ đề 2027 từ `tom-tat-mien-phi.json` & `menh-chinh-tinh.json`, tính Wilson 95%, lọc từ cấm, bảo vệ riêng tư |
| API R1 | `src/app/api/r1/{la-so,su-kien,lien-he,quan-tri,quan-tri/auth,quan-tri/csv}/route.ts` | Lập lá số stateless (không lưu ngày sinh), ghi sự kiện ẩn danh, lưu lead tách bảng, quản trị + xuất CSV UTF-8 BOM |
| Trang quản trị R1 | [`src/app/quan-tri/r1/page.tsx`](../../src/app/quan-tri/r1/page.tsx), [`QuanTriR1Client.tsx`](../../src/components/r1/QuanTriR1Client.tsx) | Phễu theo UTM, Wilson 95%, vạch ngưỡng ĐẠT/CHƯA RÕ/TRƯỢT, bảng lead, xuất CSV |
| Cơ sở dữ liệu & Dọn hạn | [`prisma/schema.prisma`](../../prisma/schema.prisma) (`R1Event`, `R1Lead`), [`scripts/r1-xoa-han.mjs`](../../scripts/r1-xoa-han.mjs) | Lưu sự kiện ẩn danh tách hẳn bảng Lead (+60 ngày), chạy tay `npm run r1:xoa-han` |
| Bộ kiểm thử R1 | `tests/r1/{metrics,r4-an-nut-149k,tu-cam-va-cau-chu}.test.mjs` | 11 bài test: Wilson 95% & ngưỡng, ẩn nút 149k (R4), quét từ cấm, đúng nguyên văn 04 mục 6.1, tách quyền riêng tư |

---

## 2. Kết quả kiểm thử, hiệu năng & ảnh chụp bằng chứng

- **`npm run test:r1`:** **11 / 11 đạt** (0 fail).
- **`npm run test:tuvi`:** **128 / 128 đạt** (0 fail, không đụng `src/lib/tuvi-v2`).
- **`npx tsc --noEmit`:** **0 lỗi**.
- **`npm run build`:** **Đạt** (Next.js `15.5.28`, `/tu-vi-2027` chỉ `11,4 kB`, First Load JS `114 kB`).
- **Lighthouse Mobile (`/tu-vi-2027`, chạy trên bản production):**
  - **Performance: `100 / 100`** (ngưỡng yêu cầu ≥ 85) — FCP `1,5s`, LCP `1,5s`, TBT `0ms`, CLS `0,019`.
  - **Accessibility: `100 / 100`** (ngưỡng yêu cầu ≥ 95).
- **Kiểm thử trình duyệt thật (Playwright Chrome trên 375px và 1366px):** 0 lỗi console, 0 lỗi trang, 0 tràn ngang trên màn 375px, tải CSV phễu & lead trả `HTTP 200`, script `npm run r1:xoa-han` xóa đúng bản ghi quá hạn 60 ngày.

### Ảnh chụp bằng chứng (`docs/v2/bang-chung/`)

| Ảnh | Khung hình | Nội dung kiểm chứng |
|---|---|---|
| [`r1-mobile-375-hero-form.png`](bang-chung/r1-mobile-375-hero-form.png) | Mobile `375×812` | Hero định vị 04 mục 1, 3 cam kết, form không hỏi tên/SĐT |
| [`r1-mobile-375-laso-nhandinh.png`](bang-chung/r1-mobile-375-laso-nhandinh.png) | Mobile `375×812` | Lá số 12 cung thật dạng thẻ dễ đọc ở 375px + bộ lọc cung |
| [`r1-mobile-375-mau-gia.png`](bang-chung/r1-mobile-375-mau-gia.png) | Mobile `375×812` | Đoạn bản mẫu biên tập + khối giá 79.000đ / 149.000đ đúng thông điệp |
| [`r1-mobile-375-hopthoai.png`](bang-chung/r1-mobile-375-hopthoai.png) | Mobile `375×812` | Hộp thoại trung thực nguyên văn 04 mục 6.1 bước 4 + ô Email/Zalo + đồng ý |
| [`r1-mobile-375-chua-ro-gio.png`](bang-chung/r1-mobile-375-chua-ro-gio.png) | Mobile `375×812` (full) | Luồng chưa rõ giờ: Can Chi, Ngũ Hành, 2027, giải thích không an 12 cung, **ẩn nút 149.000đ** (R4) |
| [`r1-desktop-1366-laso-4x4.png`](bang-chung/r1-desktop-1366-laso-4x4.png) | Desktop `1366×900` | Sơ đồ lá số 4×4 truyền thống + Thiên Bàn + Lưu Niên 2027 |
| [`r1-desktop-1366-full.png`](bang-chung/r1-desktop-1366-full.png) | Desktop `1366×900` (full) | Toàn bộ trang `/tu-vi-2027` sau khi lập lá số có giờ sinh |
| [`r1-desktop-1366-quantri.png`](bang-chung/r1-desktop-1366-quantri.png) | Desktop `1366×900` | Trang quản trị `/quan-tri/r1`: thước ngưỡng, Wilson 95%, bảng UTM, bảng lead |

---

## 3. Danh sách sự kiện đo lường & bảo vệ quyền riêng tư

Tất cả sự kiện lưu tại bảng `R1Event` kèm mã phiên ẩn danh (`sessionId` lưu trong `sessionStorage`, hết phiên tự hủy) và 3 tham số `utm_source`, `utm_medium`, `utm_campaign`. **Tuyệt đối không lưu ngày giờ sinh kèm mã phiên hay email/Zalo** (API `POST /api/r1/la-so` tính toán tức thì, không ghi DB; `chuanHoaSuKienR1` và `chuanHoaLeadR1` loại bỏ toàn bộ trường thừa).

| Tên sự kiện (`eventName`) | Thời điểm bắn | Dữ liệu đi kèm | Ý nghĩa phân tích |
|---|---|---|---|
| `xem_trang` | Vừa mở `/tu-vi-2027` | `sessionId`, UTM | Mẫu số đầu phễu theo từng nguồn traffic |
| `bat_dau_form` | Tương tác đầu tiên vào form | `sessionId`, UTM | Số người bắt đầu nhập thông tin (kiểm R6) |
| `bo_form` | Rời trang (`pagehide` / `visibilitychange: hidden`) khi đã `bat_dau_form` nhưng chưa `lap_la_so` | `sessionId`, UTM (gửi qua `sendBeacon`) | Tỷ lệ bỏ ngang form vì ngại nhập ngày sinh (kiểm R6) |
| `lap_la_so` | Lập lá số / tổng quan thành công | `sessionId`, `coGioSinh: true \| false`, UTM | **Mẫu số thống nhất** cho `click_per_chart`, `lead_per_chart` và đo tỷ lệ chưa rõ giờ (R4) |
| `xem_gia` | Khối giá đi vào khung nhìn (≥ 35%) | `sessionId`, UTM | Tỷ lệ người đọc hết phần miễn phí xuống tới bảng giá |
| `bam_mua_79` | Bấm nút `"Đặt mua Vận 2027 — 79.000đ"` | `sessionId`, UTM | Ý định mua mức giá 79k |
| `bam_mua_149` | Bấm nút `"Đặt mua Chuyên Sâu + Vận 2027 — 149.000đ"` | `sessionId`, UTM | Ý định mua mức giá 149k (chỉ xuất hiện khi có giờ sinh) |
| `gui_lien_he` | Gửi thành công Email/Zalo trong hộp thoại | `sessionId`, UTM *(không kèm email/Zalo)* | Tính `lead_per_chart` mà không nối danh tính với mã phiên |

**Bảng Lead riêng (`R1Lead`):** chỉ lưu `emailHoacZalo`, `nutGiaDaBam` (`"79k"` | `"149k"`), `utmSource`, `utmMedium`, `utmCampaign`, `dongYLuc`, `hanXoa` (`= createdAt + 60 ngày`). Chạy `npm run r1:xoa-han` (hoặc `npm run r1:xoa-han -- --dry-run`) để xóa mọi lead quá hạn.

---

## 4. Cách đọc trang quản trị `/quan-tri/r1`

1. **Đăng nhập:** mở `/quan-tri/r1`, nhập khóa `ADMIN_KEY` cấu hình trong `.env` (cookie `HttpOnly` hiệu lực 12 giờ; trang đã gắn `noindex, nofollow` và `robots.ts` chặn `/quan-tri`).
2. **Đọc thước ngưỡng ĐẠT / CHƯA RÕ / TRƯỢT (đúng 04 mục 6.2):**
   - **Cỡ mẫu tối thiểu:** theo dõi thanh tiến độ **`≥ 300` lá số đã tạo** (khuyến nghị **400–500**). Trước mốc 300 lá số, nhãn trạng thái chỉ mang tính tham khảo sớm.
   - **ĐẠT (GO):** `click_per_chart ≥ 6,0%` **VÀ** `lead_per_chart ≥ 2,5%` *(kết hợp điều kiện bắt buộc bên ngoài: phỏng vấn 03 đạt `≥ 6/20` người đã tự chi `≥ 50.000đ` trong 12 tháng)*.
   - **CHƯA RÕ (ITERATE — tối đa 1 vòng):** `click_per_chart` trong `[2,5%, 6,0%)` hoặc `click ≥ 6,0%` nhưng `lead_per_chart < 2,5%`.
   - **TRƯỢT (PIVOT / STOP):** `click_per_chart < 2,5%` *(hoặc `< 4/20` người phỏng vấn từng chi tiền)*.
3. **Đọc khoảng tin cậy Wilson 95%:** mỗi chỉ số (`click_per_chart`, `lead_per_chart`, `ty_le_chua_ro_gio`) hiển thị dạng `Tỷ lệ [cận dưới – cận trên]`. Ví dụ với `n = 300`, `k = 18` → `6,0% [3,8% – 9,3%]`. Nếu cận trên đã nằm dưới 2,5% hoặc cận dưới đã vượt 6,0% thì tín hiệu rõ ràng hơn nhiều so với điểm ước lượng đơn lẻ.
4. **Đọc tỷ lệ 79k vs 149k và tỷ lệ chưa rõ giờ (R4):**
   - Để chọn gói mở bán công bằng giữa 79k và 149k, nhìn dòng **"Riêng nhóm có giờ"** (vì nhóm chưa rõ giờ không thấy nút 149k).
   - Nếu **tỷ lệ chưa rõ giờ ≥ 50%**, hệ thống hiện cảnh báo theo R4 (04 mục 3.1) để lên kế hoạch bổ sung gói vận năm theo ngày sinh sau Tết.
5. **Tách từng nguồn UTM & xuất CSV:** luôn đọc riêng từng hàng UTM (`facebook / group`, `tiktok / video`, `facebook / ads`) vì ý định từng nguồn khác nhau; bấm **"Xuất CSV phễu"** hoặc **"Xuất CSV lead"** (UTF-8 có BOM, mở trực tiếp bằng Excel).

---

## 5. Việc anh Cường PHẢI làm trước khi chạy traffic

1. **Điền thông tin chủ thể chịu trách nhiệm ở chân trang:** thay `[ĐIỀN TÊN/ĐỊA CHỈ]` và `[ĐIỀN EMAIL/SĐT LIÊN HỆ]` trong [`src/lib/r1/copy.ts`](../../src/lib/r1/copy.ts) bằng tên thật/hộ kinh doanh (hoặc cá nhân chịu trách nhiệm) và địa chỉ liên hệ thật.
2. **Đặt tên miền, HTTPS và đẩy schema PostgreSQL lên server thật:**
   - Trỏ tên miền `xemboi.vn` (hoặc subdomain chạy thử), cấu hình HTTPS và biến môi trường `.env` trên VPS (`DATABASE_URL`, `ADMIN_KEY` đủ mạnh).
   - Chạy `npx prisma db push` để tạo hai bảng `R1Event` và `R1Lead` trên PostgreSQL thật (tránh chạy chế độ tệp dự phòng cục bộ trên production).
   - Kiểm tra lịch chạy định kỳ hoặc nhắc lịch chạy tay `npm run r1:xoa-han` trước mốc 60 ngày.
3. **Tự rà lại toàn bộ câu chữ hiển thị trên `/tu-vi-2027`:** đọc lại Hero, bản mẫu biên tập (`ban-mau-bien-tap.ts`), mô tả 2 gói 79k/149k và chân trang để chắc chắn đúng giọng anh muốn và không vi phạm chính sách quảng cáo Meta (*Personal Attributes*) nếu định chi ≤ 1 triệu test Ads.
4. **Nhờ người có chuyên môn kiểm duyệt kho câu nhận định tĩnh:** tệp `tom-tat-mien-phi.json` gốc có ghi chú **`"Chưa qua kiểm duyệt Thư"`** (và bảng độ sáng trong engine theo 05b cũng chưa có chuyên gia rà bản in sách cổ). Trước khi chạy traffic rộng, anh nên nhờ người hiểu Tử Vi Nam Phái đọc duyệt các câu Mệnh–Thân và chủ đề 2027, đồng thời đối chiếu bản luận mẫu cố định (`ban-mau-bien-tap.ts`).
5. **Gắn UTM thống nhất cho từng nguồn kéo khách:** luôn gắn đủ `?utm_source=...&utm_medium=...&utm_campaign=...` cho 3 nhóm nguồn (ví dụ: `utm_source=facebook&utm_medium=group`, `utm_source=tiktok&utm_medium=organic`, `utm_source=facebook&utm_medium=ads`) trước khi đăng bài/video.

---

## 6. Rủi ro còn lại

1. **PostgreSQL cục bộ hiện đang tắt lúc dựng trang:** các bài test E2E chạy qua lớp dự phòng cục bộ (`scratch/r1-store.json`); khi triển khai lên VPS **bắt buộc** chạy `npx prisma db push` và xác minh trên `/quan-tri/r1` dòng *Kho lưu trữ* hiện **`PostgreSQL`**.
2. **Tracker cũ trong `RootLayout` (`src/lib/tracking/useTracker.tsx`):** theo yêu cầu không sửa trang cũ, `RootLayout` vẫn gửi `PAGE_VIEW` chung vào hệ thống tracking cũ; tuy nhiên trang `/tu-vi-2027` KHÔNG gọi `GENERATE_CHART` hay gửi ngày sinh vào tracker cũ, nên không vi phạm nguyên tắc quyền riêng tư R1.
3. **Chất lượng học thuật kho câu tĩnh ("chưa qua kiểm duyệt"):** nếu người dùng P2 ("Tuấn") đọc thấy một câu ở `tom-tat-mien-phi.json` chưa sát phái họ quen, họ có thể phản hồi trên nhóm Facebook; hiện giao diện đã ghi rõ nguồn sách và chú thích *"chưa qua chuyên gia kiểm duyệt"* để minh bạch.
4. **Rủi ro chính sách Meta Ads với trang chưa mở bán (đã nêu ở 04 mục 6.2):** nếu chạy Facebook Ads vào trang fake door, tài khoản quảng cáo có thể bị từ chối vì đích đến chưa bán sản phẩm thật — nên ưu tiên kéo traffic hữu cơ từ video ngắn và nhóm Facebook trước.
5. **Độ lệch đo `bo_form` trên trình duyệt di động iOS/in-app browser Facebook:** một số trình duyệt nhúng trong ứng dụng Facebook có thể cắt sự kiện `pagehide`/`sendBeacon` khi người dùng vuốt đóng webview đột ngột, nên cần đọc `bo_form` cùng tỷ lệ `lap_la_so / bat_dau_form` để đối chứng.

---

## 7. Sửa lỗi tệp dự phòng

### 7.1. Thay đổi đã thực hiện (chuẩn bị triển khai `v3.xemtuvi.vn`)
1. **Chặn ghi tệp dự phòng ở production ([`src/lib/r1/store.ts`](../../src/lib/r1/store.ts)):**
   - Chỉ cho phép dự phòng vào `scratch/r1-store.json` khi `NODE_ENV !== 'production'` (`choPhepDuPhongCucBo`).
   - Khi `NODE_ENV === 'production'` mà PostgreSQL lỗi: **không tạo hay ghi tệp dự phòng**, ném `R1DatabaseUnavailableError` (`statusCode = 503`), ghi `console.error('[R1][DB_ERROR] suKien=... maLoi=...')` chỉ gồm tên sự kiện và mã lỗi ngắn (`err.code`/`err.name`), **không ghi `err.message`, email, Zalo hay ngày sinh**.
2. **Phản hồi API 503 an toàn (`src/app/api/r1/{su-kien,lien-he,quan-tri,quan-tri/csv}/route.ts`):**
   - Trả `HTTP 503` kèm thông báo chung khi DB lỗi, không lộ chi tiết hệ thống.
3. **Trải nghiệm khách & cảnh báo quản trị:**
   - Phía khách ([`TrangR1Client.tsx`](../../src/components/r1/TrangR1Client.tsx)): lỗi ghi sự kiện đo được bỏ qua lặng lẽ, không làm gián đoạn luồng xem lá số.
   - Hộp thoại đăng ký ([`HopThoaiMua.tsx`](../../src/components/r1/HopThoaiMua.tsx)): khi gửi Email/Zalo gặp lỗi (503 hoặc lỗi mạng) hiện rõ **`"Chưa lưu được, bạn thử lại sau ít phút"`**, tuyệt đối không báo thành công giả.
   - Trang quản trị [`/quan-tri/r1`](../../src/components/r1/QuanTriR1Client.tsx): hiển thị rõ kho dữ liệu đang dùng (`PostgreSQL` / `Tệp cục bộ dự phòng` / `Không kết nối được PostgreSQL`); nếu đang ở `production` mà kho không phải `PostgreSQL` sẽ bật **banner cảnh báo đỏ**.
4. **Cập nhật [`.env.example`](../../.env.example):** tách rõ mục biến bắt buộc cho R1 (`DATABASE_URL`, `ADMIN_KEY`) bằng giá trị mẫu an toàn.
5. **Bổ sung kiểm thử ([`tests/r1/store-fallback.test.mjs`](../../tests/r1/store-fallback.test.mjs)):** kiểm tra 4 ca (`production + DB lỗi` không tạo tệp và trả 503; `development + DB lỗi` vẫn dùng tệp dự phòng; log lỗi không chứa email/Zalo/ngày sinh ngay cả khi `err.message` chứa; UI guard cho thông báo lỗi và cảnh báo đỏ production).

### 7.2. Kết quả chạy kiểm chứng thực tế (sau sửa lỗi)
- **`npm run test:r1`:** **15 / 15 đạt** (`0 fail`, `206 ms` — tăng từ 11 lên 15 test).
- **`npm run test:tuvi`:** **128 / 128 đạt** (`0 fail`, `628 ms` — không sửa `src/lib/tuvi-v2` hay `src/lib/core`).
- **`npx tsc --noEmit`:** **0 lỗi** (mã thoát `0`).
- **`npm run build`:** **Đạt** (Next.js `15.5.28`, biên dịch `1,58s`, `49/49` trang tĩnh, `/tu-vi-2027` `11,4 kB`, `/quan-tri/r1` `4,21 kB`).


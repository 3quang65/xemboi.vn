# Lệnh 55: Khối phong tục ở trang ngày lễ và trang văn khấn ngày giỗ

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 54.

**Báo cáo:** `docs/v2/lenh-antigravity/55-bao-cao.md`, theo mẫu Lệnh 25.
- Kèm ảnh 375px và 1366px của các URL ở mục 55.4.
- **Viết báo cáo ngay khi xong**, không chờ máy dò chữ Hán.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md`;
- `docs/v2/doi-chieu/van-khan-phong-tuc.md` mục 0, 1, 4: các trang Việt đang in gì, vì sao mình chỉ dùng hai sách này;
- trang `src/app/(v2)/lich-am/ngay-le/[le]/page.tsx`, `src/app/(v2)/tet/page.tsx`, `src/app/(v2)/tiet-khi/[tiet]/page.tsx`.

**Thị trường:**
- Các trang văn khấn chép cùng một sách còn bản quyền và không ghi người soạn.
- Phần phong tục thường tự viết, không dẫn sách.
- Trang mình dùng hai sách hết bản quyền, in nguyên văn, ghi rõ năm in.

**Ràng buộc:**
- **Phạm vi sửa:**
  - `src/app/(v2)/lich-am/ngay-le/[le]/page.tsx`, `src/app/(v2)/tet/page.tsx`, `src/app/(v2)/tiet-khi/[tiet]/page.tsx` (chỉ thêm khối);
  - tạo `src/app/(v2)/van-khan/ngay-gio/` (page.tsx, layout.tsx nếu cần, CSS ≤ 30 KB);
  - CSS chung của các trang này nếu cần (mỗi tệp ≤ 30 KB).
- **Không tạo:**
  - hub `/van-khan`: ghi chú kế hoạch SEO bảo chỉ mở sau khi kiểm bản quyền;
  - các trang văn khấn khác.
- **Nguyên văn:**
  - in đúng `van`, không sửa chữ, không "hiện đại hóa" chính tả 1932 hay 1915 (ví dụ "dỗ", "thần-vị" giữ nguyên);
  - đoạn trích in dạng trích dẫn, ghi `viTriViet`, liên kết `url` (mở tab mới, `rel="noopener"`).
- **Không viết thêm lời khấn, không thêm mâm cúng**, không "nên/không nên".
- **Chỉ tiếng Việt.**
- **Cấm:** không cài gói, không commit, không `next build`, không bấm Overwrite.

## Dữ liệu (đã có, chỉ đọc)

### `src/lib/trang/phong-tuc-ngay-le.ts`

Test: `tests/trang/phong-tuc-ngay-le.test.mjs`.

| Tên | Trả gì |
|---|---|
| `phongTucLe(slug)` / `PHONG_TUC_NGAY_LE[slug]` | `{tomTat, trich[{viTriViet, van, url}], lienQuan?}`. Các khóa: `tet-nguyen-dan`, `ram-thang-gieng`, `tet-han-thuc`, `tet-doan-ngo`, `ram-thang-7`, `trung-thu`, `ong-cong-ong-tao`, `giao-thua`. Lễ không có khóa thì không hiện khối. |
| `PHONG_TUC_TIET_KHI['thanh-minh']` | như trên, cho trang tiết Thanh minh. |
| `NGUON_PHONG_TUC` | tên sách, tác giả, năm, giấy phép, url. |
| `GHI_CHU_PHONG_TUC` | câu đặt đầu khối. |

### `src/lib/trang/van-khan.ts`

Test: `tests/trang/van-khan.test.mjs`.

| Tên | Trả gì |
|---|---|
| `mauTheoMa('ngay-gio')` | `{ten, van, truong, chuThich[], trangSach, url}`. |
| `dienMau('ngay-gio', giaTri)` | văn đã điền; trường không nhập giữ nguyên dấu chấm. |
| `TRUONG_DIEN` | nhãn tiếng Việt cho từng trường. |
| `NGHI_THUC` | đoạn nguyên văn về lễ giỗ và cách làm lễ: `{chuDe, viTri, van, url}`. Trang giỗ lấy các đoạn có `chuDe` bắt đầu "Lễ giỗ", "Làm lễ ở đâu", "Đồ lễ", "Nơi đặt bàn lễ", "Trình tự làm lễ"; bỏ các đoạn lễ tang, lễ tết. |
| `NGUON_GIA_LE`, `GHI_CHU_VAN_KHAN` | nguồn và câu ghi chú. |
| `mauTheoMa('ngay-tiet-le')`, `mauTheoMa('than-trong-nha')` | hai mẫu khác, chỉ dùng ở mục "Mẫu khác trong cùng sách". |
| `vanTheoChuThich` | mẫu tiết lệ có trường này: bản Claude Code ráp theo chú thích tác giả, không phải chữ in. Nếu in thì ghi rõ "ráp theo chú thích của tác giả". |

SEO đã nạp NHAP: `VK-GIO`.

## 55.1. Khối phong tục ở trang ngày lễ, Tết, tiết Thanh minh

- **Vị trí:**
  - trang `/lich-am/ngay-le/{le}`, `/tet` và `/tiet-khi/thanh-minh`;
  - sau phần ngày tháng, trước liên kết cuối trang.
- **Tiêu đề:** "Phong tục xưa theo sách *Việt Nam phong tục* (1915)".
- **Nội dung:**
  - `GHI_CHU_PHONG_TUC` (chữ nhỏ);
  - `tomTat`;
  - các `trich`: khối trích, `viTriViet` và liên kết "Đọc nguyên chương";
  - chân khối ghi `NGUON_PHONG_TUC`: tác giả, năm, "phạm vi công cộng", "bản chép Wikisource, CC BY-SA 4.0".
- **Trang `/tet`:** dùng khóa `tet-nguyen-dan`, cộng thêm `giao-thua` nếu trang có phần giao thừa.
- **375px:** khối trích không tràn ngang.

## 55.2. Trang `/van-khan/ngay-gio`

- **H1, title, mô tả:** theo `VK-GIO`.
- **Đọc nhanh:** "Bài khấn ngày giỗ in trong sách *Gia lễ giản yếu* của Dương Bá Trạc (1932). Điền tên, ngày tháng để có bản in ra; chữ của sách giữ nguyên." và `GHI_CHU_VAN_KHAN`.
- **Form (GET):**
  - các ô theo `mauTheoMa('ngay-gio').truong`, nhãn lấy từ `TRUONG_DIEN`, không bắt buộc ô nào;
  - query theo tên trường, ví dụ `?ten=…&ngay=…`;
  - giới hạn mỗi ô 60 ký tự;
  - không lưu, không gửi đi đâu.
- **Kết quả:**
  - khung văn khấn (`dienMau`), chữ lớn dễ đọc;
  - nút "In" (`window.print()`, CSS in chỉ giữ khung văn);
  - nút "Chép" (clipboard, có thông báo đã chép).
- **Chú thích của tác giả:** danh sách `chuThich`.
- **Nghi thức theo sách:** `<details>` các đoạn `NGHI_THUC` về lễ giỗ và làm lễ (nguyên văn, ghi vị trí).
- **Mẫu khác trong cùng sách:** `<details>` in nguyên văn mẫu "ngày tiết lệ" (ghi chú nếu dùng `vanTheoChuThich`) và "thần thờ trong nhà".
- **Nguồn:**
  - `NGUON_GIA_LE` (tác giả, năm, phạm vi công cộng, bản chép Wikisource CC BY-SA 4.0, liên kết trang sách);
  - một câu: "Các bài khấn ngày giỗ phổ biến trên mạng hiện nay chép từ sách khác còn bản quyền nên trang không đăng lại."
- **Liên kết:** `/lich-am`, `/lich-am/ngay-le/ram-thang-7`.

## 55.3. Không làm

- Hub `/van-khan`, các trang văn khấn khác.
- Mâm cúng.
- Ngày giỗ tự tính theo âm lịch: để lệnh sau.

## 55.4. Nghiệm thu

1. **`/lich-am/ngay-le/trung-thu`:**
   - có khối phong tục;
   - 5 đoạn trích;
   - liên kết tới `…Việt_Nam_phong_tục/I.12`.
2. **`/lich-am/ngay-le/via-than-tai`:** không có khối (sách không nói), trang vẫn 200.
3. **`/tet` và `/tiet-khi/thanh-minh`:** có khối.
4. **`/van-khan/ngay-gio?ten=Nguyễn Văn A&ngay=mười&thang=ba`:**
   - khung văn có "Nguyễn Văn A";
   - các chỗ chưa điền vẫn là dấu chấm;
   - in thử (Ctrl+P preview) chỉ còn khung văn.
5. **`/van-khan/ngay-gio?ten=<script>`:** hiện chữ thường, không chạy mã.
6. **Kiểm tra chung:**
   - `tsc --noEmit`: 0 lỗi;
   - test `phong-tuc-ngay-le`, `van-khan` đạt;
   - ảnh 375px và 1366px của mục 1 và 4.

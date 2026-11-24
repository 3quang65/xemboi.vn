# Lệnh 54: Trang Bói tình yêu (`/boi-tinh-yeu`)

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 53.

**Báo cáo:** `docs/v2/lenh-antigravity/54-bao-cao.md`, theo mẫu Lệnh 25.
- Kèm ảnh 375px và 1366px của các URL ở mục 54.4.
- **Viết báo cáo ngay khi xong**, không chờ máy dò chữ Hán (Claude Code chạy).

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md`;
- `docs/v2/doi-chieu/tinh-yeu-goi-bai.md` mục 1: các trang Việt đang làm gì và bản trung thực của mình;
- trang `src/app/(v2)/xem-tuoi/[cap]/page.tsx` (cặp con giáp), `src/app/(v2)/chiem-tinh/` (cung hoàng đạo), `src/app/(v2)/than-so-hoc/so-chu-dao/` để dùng lại khối và màu.

**Thị trường:** các trang Việt cộng thành điểm /10 hoặc phần trăm, bói theo tên, tả tính cách cặp đôi, tiêu đề "chuẩn 100%". Không trang nào ghi tên sách. Trang mình đặt từng hệ cạnh nhau, ghi rõ hệ và sách, **không cộng điểm**.

**Ràng buộc:**
- **Phạm vi sửa:**
  - tạo `src/app/(v2)/boi-tinh-yeu/` (page.tsx, layout.tsx nếu cần, `boi-tinh-yeu.css` ≤ 30 KB);
  - thêm một thẻ liên kết ở `src/app/(v2)/xem-tuoi/page.tsx`.
  - Không sửa chỗ khác.
- **Chỉ tiếng Việt.** Trích Tetrabiblos chỉ in `vi`, không in `en`.
- **Không viết thêm nội dung:**
  - không điểm, không phần trăm, không "hợp nhau", "nên cưới", "chia tay";
  - không tả tính cách cặp đôi.
  - Mọi câu kết quả lấy từ thư viện.
- **Màu:** góc "không hòa", quan hệ xung, hình, hại dùng hổ phách `#B7791F`, không đỏ báo động.
- **Cấm:** không cài gói, không commit, không `next build`, không bấm Overwrite.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/boi-tinh-yeu.ts`

Test: `tests/trang/boi-tinh-yeu.test.mjs`.

| Tên | Trả gì |
|---|---|
| `boiTinhYeu(a, b, gioA?, gioB?)` | `a`, `b` là `{ngay, thang, nam}`. Trả `{ a, b, conGiap, hoangDao, thanSo }`. |
| `a` / `b` (`NguoiTinhYeu`) | `namAm`, `chiNam` (Tý 0), `truocTet`, `cung` (kết quả `traCung`: `cung`, `chuyen`, `coGio`), `soChuDao`, `soChuDaoCach2` (null nếu hai cách bằng nhau), `tinhCam` (lời Nhật Nguyệt, có thể null). |
| `conGiap` | `CapConGiap` như trang `/xem-tuoi/{cap}`: `tomTat`, `quanHe[]` (`ten`, `nhom`, `cau`, `trich`), `duongDan`. |
| `hoangDao` | `goc {cach, loai}`, `cungTamHop`, `cungAmDuong`, `chacChan` (false khi sinh đúng ngày đổi cung mà không nhập giờ). |
| `TEN_GOC[loai]` | `{ten, do, hoa}`; `hoa` true là "hòa", false là "không hòa", null là ch. XVI không xếp. |
| `TRICH_HOANG_DAO` | `gocChieu` (Tetrabiblos I.XVI tr. 25), `amDuong` (I.XV tr. 23). Dùng như `TrichNguyenVan` của trang Chiêm tinh: in `vi`, ghi "Tetrabiblos, quyển I, chương …, tr. …". |
| `GHI_CHU_TINH_YEU` | câu đặt ngay trên kết quả. |
| `thanSo.nguon` | `NGUON_Y_NGHIA` để ghi công Nhật Nguyệt. |

SEO đã nạp NHAP: `XT-BOITINHYEU` (H1, title, mô tả lấy từ đó qua `metaTrang` / `thongTinTrang`).

## 54.1. Bố cục trang

- **H1, Đọc nhanh:**
  - nội dung: "Nhập ngày sinh hai người. Trang đặt cạnh nhau ba hệ: địa chi năm sinh, cung hoàng đạo và thần số học; mỗi hệ ghi rõ sách. Trang không cộng điểm và không kết luận hai người có hợp hay không.";
  - thẻ ghi "Tam mệnh thông hội · Tetrabiblos · Nhật Nguyệt".
- **Form (GET):**
  - hai ngày sinh dương lịch, query `?a=1996-04-10&b=2000-08-05`;
  - giờ sinh không bắt buộc, query `&ga=…&gb=…` (0–23);
  - nhãn "Người thứ nhất", "Người thứ hai"; không hỏi tên, không hỏi giới tính.
- **Kết quả** (khi có cả `a` và `b`):
  0. `GHI_CHU_TINH_YEU` (chữ nhỏ, khung nhạt).
  1. **Khối "Địa chi năm sinh"** (hệ can chi):
     - dòng mỗi người: "Sinh 20/01/1990 · năm âm Kỷ Tỵ".
       - Nếu `truocTet`: thêm nhãn nhỏ "sinh trước Tết, tính theo năm âm trước".
     - `conGiap.tomTat`;
     - danh sách `quanHe` (tên + `cau`);
     - liên kết "Xem đủ cặp này" tới `conGiap.duongDan`.
  2. **Khối "Cung hoàng đạo"** (hệ Tetrabiblos):
     - cung mỗi người (ký hiệu, tên, liên kết trang cung);
     - dòng góc: `TEN_GOC[goc.loai].ten`, với nhãn:
       - "Ptolemy gọi là hòa" khi `hoa === true`;
       - "Ptolemy gọi là không hòa" (hổ phách) khi `hoa === false`;
       - không nhãn khi `hoa === null`;
     - hai dòng có/không: "Cùng một tam hợp", "Cùng dương hoặc cùng âm";
     - nếu `!chacChan`: hộp hổ phách "Một người sinh đúng ngày Mặt Trời đổi cung; nhập giờ sinh để biết chắc cung.";
     - `<details>` "Sách nói gì": trích `gocChieu`, `amDuong`, kèm câu "Chương này nói về các phần của vòng hoàng đạo, không nói về hai người.".
  3. **Khối "Thần số học"**:
     - hai cột (375px: xếp chồng);
     - mỗi cột: "Số chủ đạo {soChuDao}" (liên kết `/than-so-hoc/so-chu-dao?ngay=…`);
       - nếu `soChuDaoCach2`: "(cách rút từng phần ra {n})";
     - đoạn `tinhCam` dưới nhãn "Tình cảm, theo Nhật Nguyệt"; null thì bỏ đoạn;
     - chân khối: "Không có sách nào trong kho ghép hai số chủ đạo thành một kết quả, nên trang chỉ đặt hai số cạnh nhau." và ghi công `NGUON_Y_NGHIA`.
  4. **Đọc thêm:**
     - `/xem-tuoi/vo-chong` (xem tuổi vợ chồng theo năm sinh);
     - `/xem-tuoi/con-giap`;
     - `/chiem-tinh/cung-hoang-dao`;
     - `/than-so-hoc`;
     - `/kien-thuc/vi-sao-cac-noi-xem-tuoi-khac-nhau`, nhưng chỉ khi trang này trả 200; nếu không chắc thì bỏ.
- **Ngày sai** (ngoài 1900–2100, sai định dạng): báo lỗi trong form, không 500.

## 54.2. Liên kết vào

Trang `/xem-tuoi`: thêm thẻ "Bói tình yêu theo ngày sinh" → `/boi-tinh-yeu`.

## 54.3. Không làm

- Xem tuổi vợ chồng 4 tầng trong trang này: còn vướng đại / tiểu du niên.
- So Mặt Trời, Mặt Trăng hai người (Tetrabiblos quyển IV): chờ anh duyệt.
- Bói theo tên, Tarot, Cao Ly Đầu Hình, điểm chung.

## 54.4. Nghiệm thu

1. **`/boi-tinh-yeu?a=1996-04-10&b=2000-08-05`:**
   - Bính Tý và Canh Thìn có "Tam hợp";
   - Bạch Dương và Sư Tử: "Tam hợp (cách 4 cung, 120°)", "Ptolemy gọi là hòa", cùng tam hợp: có, cùng dương: có;
   - số chủ đạo 3 và 6.
2. **`?a=1990-01-20&b=1990-03-01`:**
   - người thứ nhất "năm âm Kỷ Tỵ", có nhãn "sinh trước Tết";
   - người thứ hai Canh Ngọ.
3. **`?a=2000-07-22&b=1996-04-10`:**
   - 22/7/2000 là ngày Mặt Trời đổi từ Cự Giải sang Sư Tử, nên có hộp "nhập giờ sinh".
   - Thêm `&ga=23` thì hộp mất.
4. **`?a=abc&b=2000-08-05`:** báo lỗi, không 500.
5. **`/boi-tinh-yeu`** (chưa nhập): chỉ có form và đọc nhanh.
6. **Kiểm tra chung:**
   - `tsc --noEmit`: 0 lỗi;
   - test `tests/trang/boi-tinh-yeu.test.mjs` đạt;
   - ảnh 375px và 1366px của mục 1.

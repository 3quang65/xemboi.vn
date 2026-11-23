# Lệnh 43: Tử vi, kinh dịch, xem tuổi, bản đồ sao, cung hoàng đạo trực quan

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 42. Báo cáo ghi vào `docs/v2/lenh-antigravity/43-bao-cao.md` theo mẫu Lệnh 25, kèm ảnh 375px và 1366px.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md`;
- ảnh `docs/v2/thiet-ke/tham-khao-4-repo/nhatnguyet-tu-vi-12-con-giap.png`, `xemboi-hien-tai-tu-vi.jpg`.

**Dùng lại:** `components/ck/truc-quan/` (`DocNhanh`, `ThuatNgu`, `TrichNguyenVan`).

**Ràng buộc:** như Lệnh 40.
- Cấm sửa `src/lib/**`, `components/r1/**` (gồm `LaSo12Cung.tsx`), `tests/**`, `ck.css`, `ck-nen.css`.
- Không cài gói, không commit, không chạy `next build`.
- Chiêm tinh: **không** viết tính cách, chỉ in vị trí và chuỗi lib trả về.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/truc-quan-43.ts` (test: `tests/trang/truc-quan-43.test.mjs`)

| Hàm | Trả gì |
|---|---|
| `docNhanhTuVi(ketQua)` | `{ cau, the[], tamPhuongMenh }`; thẻ: mệnh, thân, cục, tam phương, đại vận đang chạy |
| `tamPhuongTuChinh(chi)` | `{ ban, tamHop: [a, b], xungChieu, tatCa }` (chỉ số chi 0 = Tý) |
| `docNhanhQue(ketQuaGieo)` | `{ cau, the[] }`; thẻ: quẻ chủ, hào động, quẻ biến (nếu có), quẻ hỗ |
| `sauHao(ketQuaGieo)` | 6 hào từ dưới lên `{ thu, hao, dong, haoBien, giaTri? }` |
| `docNhanhXemTuoi(ketQuaVoChong)` | `{ cau, the[] }`, mỗi tiêu chí một thẻ, `muc` là `tot` / `binh` / `diu` |
| `gianNhan(goc[], khoang = 8)` | góc vẽ nhãn đã giãn, cùng thứ tự đầu vào |

Thẻ có `muc` tô như Lệnh 41: `tot` xanh, `binh` mực thường, `diu` hổ phách. Không dùng đỏ.

## 43.1. Tử vi (`FormLaSo.tsx`, phần kết quả)

1. **Đọc nhanh:** `DocNhanh` với `docNhanhTuVi(ketQua)`, đặt ngay trên lá số 12 cung.
2. **Chọn cung để xem tam phương tứ chính:**
   - dưới lá số đặt một hàng 12 nút chip, mỗi nút ghi tên cung và chi, vd "Mệnh · Dần";
   - mặc định chọn cung Mệnh;
   - bấm nút: truyền `highlightedChis={tamPhuongTuChinh(chi).tatCa}` vào `LaSo12Cung` (prop đã có, không sửa `LaSo12Cung`);
   - dưới hàng chip, in dòng "Tam phương tứ chính của {cung}: {4 cung}" và chính tinh từng cung, lấy từ `laSo.cung`;
   - nút đang chọn: `aria-pressed="true"`; ở 375px chip cuộn ngang hoặc gập 3 hàng × 4 nút, vùng bấm ≥ 44px.
3. **Đại vận:** bảng đại vận đang có thêm nền nhấn và nhãn "Đang chạy" cho dòng `dangChay`. Nếu đã có thì giữ nguyên.

## 43.2. Kinh dịch (`/kinh-dich/gieo-que` và client gieo quẻ)

1. Sau khi gieo, in `DocNhanh` với `docNhanhQue(kq)`.
2. **Hình quẻ:**
   - vẽ quẻ chủ và quẻ biến cạnh nhau bằng `sauHao(kq)`; quẻ hỗ nhỏ hơn, đặt bên dưới;
   - hào dương: vạch liền; hào âm: hai vạch;
   - hào động: chấm son bên trái và nhãn nhỏ (○ lão dương, × lão âm theo `giaTri` 9/6), một mũi tên mảnh nối sang hào tương ứng ở quẻ biến.
3. Không có hào động: chỉ vẽ quẻ chủ và quẻ hỗ, ghi "Sáu hào đều tĩnh".
4. Bấm tên quẻ mở trang quẻ (`/kinh-dich/que/...`) như link hiện có.

## 43.3. Xem tuổi vợ chồng (`/xem-tuoi/vo-chong`)

1. `DocNhanh` với `docNhanhXemTuoi(kq)`.
2. Thanh tổng: 4 ô liền nhau theo thứ tự tiêu chí; ô tô theo `muc`, kèm ký hiệu ✓ / – / ! để ảnh xám vẫn đọc được.
3. Mỗi tiêu chí là một thẻ: tên, giá trị (Hợp / Bình thường / Chưa hợp), `chiTiet`. Bỏ mọi chữ "xấu" ở phần hiển thị (lib đã đổi nhãn).

## 43.4. Bản đồ sao (`VongBanDoSaoSvg.tsx`)

1. Ký hiệu thiên thể hiện đặt đúng `kinhDo`, nên khi gần nhau thì đè lên nhau.
   - Đặt ký hiệu theo `gianNhan(kinhDo[], 9)`.
   - Ở vòng trong, giữ một chấm nhỏ tại vị trí thật.
   - Khi lệch quá 1°, vẽ một vạch mảnh nối ký hiệu với chấm.
2. Danh sách vị trí bên dưới hình giữ nguyên số liệu, sắp theo thứ tự hiện có.
3. **4 thẻ mốc trên đầu kết quả:**
   - Mặt Trời, Mặt Trăng, Cung mọc, Thiên đỉnh, mỗi thẻ ghi tên cung và độ (`vietViTri`);
   - không có giờ sinh: thẻ Cung mọc và Thiên đỉnh ghi "Cần giờ sinh"; Mặt Trăng ghi khoảng trong ngày (`trongNgay`).

## 43.5. Cung hoàng đạo (`/chiem-tinh/cung-hoang-dao` và `[cung]`)

1. Trang danh sách: lưới 12 thẻ (3 cột ở 375px, 4 hoặc 6 cột ở 1366px).
   - Mỗi thẻ: ký hiệu to, tên Việt, khoảng ngày.
   - Thẻ của cung đang chứa Mặt Trời hôm nay có nhãn "Mặt Trời đang ở đây", lấy từ dữ liệu sẵn có của trang.
2. Trang từng cung:
   - đầu trang là một vòng 12 cung nhỏ (dùng lại `Vong12CungSvg`), tô cung đang xem;
   - giữ nguyên nội dung hiện có. Không thêm mô tả tính cách.

## 43.6. Nghiệm thu

1. **Tử vi**, 15/08/1990 9 giờ, nam, năm xem 2026:
   - Đọc nhanh bắt đầu "Mệnh an tại Dần: Vũ Khúc (Vượng), Thiên Tướng (Miếu).";
   - chọn chip Mệnh thì sáng 4 cung Dần, Ngọ, Thân, Tuất;
   - chọn chip Quan Lộc thì sáng Ngọ, Tuất, Tý, Dần.
2. **Gieo quẻ** với 6 hào nhập tay 7, 8, 9, 7, 6, 8 (nếu trang có ô nhập; nếu không thì dùng một lần gieo bất kỳ và ghi lại):
   - quẻ chủ Lôi Hỏa Phong, động hào 3 và 5, biến thành Trạch Lôi Tùy, hỗ Trạch Phong Đại Quá.
3. **Xem tuổi** chồng 1990, vợ 1992: "1 hợp, 2 bình thường, 1 chưa hợp"; ảnh xám vẫn đọc được thanh tổng.
4. **Bản đồ sao:** chọn ngày có 3 hành tinh trong vòng 10° (vd 03/02/1962, khi nhiều hành tinh tụ ở Bảo Bình). Ký hiệu không đè nhau, có vạch nối.
5. **Ảnh 375px:** không cuộn ngang ngoài hàng chip; vùng bấm ≥ 44px.
6. Tắt JS vẫn đọc được (tử vi là client nên ghi rõ phần nào cần JS); `tsc` sạch; CSS mỗi cụm ≤ 30 KB.

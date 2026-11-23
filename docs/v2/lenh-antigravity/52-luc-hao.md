# Lệnh 52: Trang Lục hào (`/kinh-dich/luc-hao`)

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 51.

**Báo cáo:** `docs/v2/lenh-antigravity/52-bao-cao.md`, theo mẫu Lệnh 25, kèm ảnh 375px và 1366px của các trang ở mục 52.4.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md`;
- `src/app/(v2)/kinh-dich/gieo-que/page.tsx` (gieo 3 xu, nhập `?xu=`, `HinhHao`);
- trang Mai hoa vừa làm ở Lệnh 51.

**Thị trường:** các trang Việt an quẻ lục hào in bảng 6 hào. Họ không ghi theo sách nào, không cho đối chiếu, và thường kèm một đoạn luận tự viết. Trang mình chỉ an quẻ, ghi rõ từng bước theo *Tăng san bốc Dịch*. Dữ liệu đã đối chiếu với bảng an sẵn 64 quẻ của sách: 383/384 hào khớp; hào còn lại là lỗi chép của bảng, đã ghi trong test.

**Dùng lại:**
- `HinhHao`, cách nhập và gieo xu của trang gieo quẻ (`gieoDongXu`);
- `DocNhanh`, `TrichNguyenVan`, `KhungTrang`, `metaTrang` / `thongTinTrang`, `breadcrumb`;
- màu ngũ hành.

**Ràng buộc:**
- **Phạm vi sửa:** như Lệnh 51.
- **CSS:** thêm vào `mai-hoa.css` nếu còn chỗ (≤ 30 KB), hoặc tạo `luc-hao.css`.
- **Chỉ tiếng Việt:** không in `nguyenVan`.
- **Không viết thêm nội dung:**
  - không luận việc, không "dụng thần cho việc X là…", không lời khuyên;
  - không tô đỏ báo động: tuần không, nguyệt phá dùng nhãn nhỏ màu hổ phách `#B7791F`.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/luc-hao.ts`

Test: `tests/trang/luc-hao.test.mjs`.

| Tên | Trả gì |
|---|---|
| `anQue(hao, haoDong, thoiGian?)` | `QueAn`: `{ que, cung, hanhCung, tenThuTu, queBien, cungQueBien, hao[6], lucXung, lucHop, thoiGian }` |
| `hao[i]` | `{ viTri, hao, dong, chi, hanh, lucThan, theUng, lucThan6, tuanKhong, nguyetPha, bien }`; `bien` là `{ chi, hanh, lucThan }` hoặc `null` |
| `thoiGianAnQue(ngay, thang, nam, gio, phut?)` | can chi tháng (theo tiết) và ngày, truyền vào `anQue` |
| `thoiGian` (trong `QueAn`) | `{ thang, ngay, tuanKhong: [chi, chi] }` để in dòng "Tháng …, ngày …, tuần không …" |
| `TAM_CUNG` | 64 `{ que, cung, thuTu, tenThuTu, the, ung }`, xếp theo tám cung như sách |
| `THU_TU_CUNG` | thứ tự 8 cung |
| `LUC_THAN`, `LUC_THAN_6` | nhãn |
| `TRICH_LUC_HAO` | 8 câu sách: `tamCung`, `theUng`, `napChi`, `lucThan`, `haoBien`, `lucThan6`, `tuanKhong`, `lucHop` |
| `NGUON_LUC_HAO` | dùng cho `TrichNguyenVan` |

Ghi chú: `gieoDongXu()` (trong `kinh-dich.ts`) trả `giaTriHao` 6/7/8/9. Hào âm/dương là `x % 2`; hào động là 6 hoặc 9.

SEO đã nạp NHAP: `KD-LUCHAO`.

## 52.1. Bố cục trang

- **H1, mô tả:** theo `KD-LUCHAO`.
- **Đọc nhanh:**
  - nội dung: "Lục hào gieo 3 đồng xu sáu lần để được quẻ, rồi an cho mỗi hào một địa chi (nạp giáp), một lục thân theo hành của cung, đánh dấu hào thế và hào ứng; ngày gieo cho lục thần và tuần không, tháng gieo cho nguyệt phá.";
  - kèm thẻ ghi tên sách.
- **Form (GET):**
  - nút "Gieo 3 đồng xu" (như trang gieo quẻ), hoặc ô tự nhập 6 số 6/7/8/9 từ hào đầu lên, query `?xu=789678`;
  - ngày giờ gieo, mặc định lúc này: `?ngay=2026-11-24&gio=10:30`.
- **Kết quả:**
  1. **Dòng tên:**
     - tên quẻ (link trang quẻ), "cung {cung.ten} ({hanhCung})", `tenThuTu`;
     - thẻ "Lục xung" / "Lục hợp" khi đúng.
     - Nếu có biến: "biến {queBien.ten}" (link).
  2. **Dòng thời gian:** "Tháng {thang} · Ngày {ngay} · Tuần không {tuanKhong}".
  3. **Bảng an quẻ** (6 hàng, hào 6 ở trên cùng).
     - Cột: Lục thần, Lục thân, Chi + hành (chấm màu), Hình hào (hào động có dấu), Thế/Ứng, Hào biến (lục thân, chi, hành).
     - Nhãn nhỏ "Tuần không", "Nguyệt phá".
     - 375px: ẩn cột hình hào, gộp Lục thần vào dòng phụ, không cuộn ngang.
  4. **Cách an:** `<details>` "Các bước an quẻ theo sách", gồm `TrichNguyenVan` cho `tamCung`, `theUng`, `napChi`, `lucThan`, `haoBien`, `lucThan6`, `tuanKhong`, `lucHop`.
- **Bảng tám cung:**
  - `<details>` "64 quẻ theo tám cung" (`TAM_CUNG`): 8 cột (375px: 2 cột);
  - mỗi ô có tên quẻ (link) và "thế {the}".
- **Ghi chú cuối trang:**
  - "Trang chỉ an quẻ theo sách, không luận việc.";
  - liên kết `/kinh-dich/gieo-que`, `/kinh-dich/mai-hoa-dich-so`.

## 52.2. Liên kết vào

- **Trang `/kinh-dich`:** thêm thẻ Lục hào.
- **Trang `/kinh-dich/gieo-que`:** khi có kết quả xu, thêm dòng "An quẻ lục hào" → `/kinh-dich/luc-hao?xu=…` cùng giá trị.

## 52.3. Không làm

Phục thần, dụng thần theo việc hỏi, vượng suy theo mùa, ứng kỳ: sách bàn dài, cần người duyệt.

## 52.4. Nghiệm thu

1. **`?xu=777777&ngay=2026-11-24&gio=10:30`:**
   - Càn vi Thiên, cung Càn (Kim), bát thuần, có "Lục xung";
   - hào 6 Phụ mẫu Tuất Thế, hào 3 Phụ mẫu Thìn Ứng, hào 1 Tử tôn Tý;
   - tháng Hợi.
2. **`?xu=888777`:** Thiên Địa Bĩ, "Lục hợp".
3. **`?xu=987678`:** có quẻ biến; cột hào biến chỉ ở hào động; lục thân hào biến theo cung quẻ chính.
4. **`?xu=12`:** báo lỗi, không 500.
5. **Kiểm tra chung:**
   - `node scripts/kiem-chu-han.mjs`: 0 trang có chữ Hán;
   - `tsc --noEmit`: 0 lỗi;
   - ảnh 375px và 1366px của mục 1 và mục 3.

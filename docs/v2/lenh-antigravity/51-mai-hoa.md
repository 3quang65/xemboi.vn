# Lệnh 51: Trang Mai hoa Dịch số (`/kinh-dich/mai-hoa-dich-so`)

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 50.

**Báo cáo:** `docs/v2/lenh-antigravity/51-bao-cao.md`, theo mẫu Lệnh 25, kèm ảnh 375px và 1366px của các trang ở mục 51.4.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md`.
- Trang mẫu `src/app/(v2)/kinh-dich/gieo-que/page.tsx`: cách in quẻ chủ, hỗ, biến bằng `HinhHao`, và nút sang trang quẻ.
- `src/app/(v2)/kinh-dich/KinhDichUi.tsx`.

**Thị trường:** các trang và ứng dụng Việt đang có chỉ in quẻ chủ, hào động, quẻ biến rồi một đoạn luận tự viết, không ghi sách. Trang mình hơn ở ba điểm:
1. In đủ các bước tính.
2. Có thể, dụng, sinh khắc theo đúng câu sách.
3. Có hai ví dụ chép trong sách để người đọc tự đối chiếu.

**Dùng lại:**
- `HinhHao`, `LienKetKiem`, `DocNhanh`, `TrichNguyenVan`, `KhungTrang`;
- `metaTrang` / `thongTinTrang`, `breadcrumb`;
- màu ngũ hành đang có (`ChuGiaiHanh` nếu cần).

**Ràng buộc:**
- **Phạm vi sửa:** như Lệnh 48. Không sửa `src/lib/**`, `tests/**`, `scripts/**`, `prisma/**`, middleware, `src/app/api/**`, `layout.tsx` gốc, `quan-tri`, `components/r1`, `ck.css`, `ck-nen.css`, `DauTrang.tsx`.
- **Cấm:** không cài gói, không commit, không `next build`, không bấm Overwrite.
- **CSS:** `kinh-dich.css` đã 24,5 KB, nên tạo tệp mới `src/app/(v2)/kinh-dich/mai-hoa.css` (≤ 30 KB).
- **Chỉ tiếng Việt:** không in `nguyenVan`.
- **Không viết thêm nội dung:**
  - không đoán việc, không "quẻ này báo…", không lời khuyên;
  - chỉ in quan hệ ngũ hành và câu sách có sẵn trong `mai-hoa.ts`;
  - không dùng màu đỏ báo động cho "hung": dùng hổ phách `#B7791F`.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/mai-hoa.ts`

Test: `tests/trang/mai-hoa.test.mjs`.

| Tên | Trả gì |
|---|---|
| `queMaiHoaLuc(ngay, thang, nam, gio, phut?)` | lập quẻ theo thời gian cho một ngày giờ dương lịch (giờ Việt Nam). Trả `KetQuaGieo` + `thoiDiem` (chuỗi có ngày âm, năm can chi, giờ chi). `moTa[]` là 3 dòng các bước tính. |
| `queMaiHoaTheoSo(soVat, chiGio)` | lập quẻ theo số đếm được: `chiGio` từ 0 (Tý) đến 11 (Hợi). Số không hợp lệ thì ném `RangeError`, trang hiện lỗi. |
| `queMaiHoaTheoThoiGian(chiNam, thang, ngay, chiGio)` | lập quẻ từ số âm lịch có sẵn; dùng cho ví dụ sách |
| `phanTichMaiHoa(kq)` | `{ the, dung, viTriDung, queHo, hoTuQueBien, bien, cacQuai[4] { vai, tenVai, quai, quanHe }, loiSachTheDung }` |
| `TEN_QUAN_HE[quanHe]` | nhãn: Tỷ hòa, Thể khắc, Khắc thể, Thể sinh, Sinh thể |
| `TRICH_MAI_HOA` | 10 câu sách: `soTienThien`, `chiaTam`, `chiaSau`, `thoiGian`, `soVat`, `queHo`, `theDung`, `vaiTro`, `sinhKhac`, `quaiKhac`. Mỗi câu có `doanId`, `viTriViet`, `dich`. |
| `VI_DU_SACH` | 2 ví dụ trong sách, `{ ma, ten, chiNam, thang, ngay, chiGio, trich }`: `quan-mai` (xem hoa mai), `mau-don` (xem hoa mẫu đơn) |
| `NGUON_MAI_HOA` | dùng cho `TrichNguyenVan`: `tenSach` = `tenHanViet`, cùng `tacGia`, `nienDai`, `ghiCong`, `url` |

SEO đã nạp NHAP: `KD-MAIHOA`.

## 51.1. Bố cục trang

- **H1 và mô tả:** theo `KD-MAIHOA`.
- **Đọc nhanh** (`DocNhanh`):
  - nội dung: "Mai hoa Dịch số lập quẻ từ con số: năm, tháng, ngày, giờ âm lịch, hoặc một số đếm được. Quái không có hào động là thể (mình), quái có hào động là dụng (việc); xét ngũ hành sinh khắc giữa thể với dụng, hỗ, biến.";
  - kèm câu `TRICH_MAI_HOA.theDung`.
- **Form (GET, không JS bắt buộc):** hai tab.
  1. **Theo thời gian:** ô ngày dương lịch và giờ (mặc định lúc mở trang); nút "Lập quẻ lúc này". Query `?ngay=2026-11-24&gio=10:30`.
  2. **Theo số:** ô số nguyên dương (vd số đồ vật đếm được) và chọn giờ (12 giờ chi, mặc định giờ hiện tại). Query `?so=16&gio-chi=7`.
- **Kết quả** (khi có query):
  1. Dòng thời điểm (`thoiDiem`) hoặc số đã nhập.
  2. **Các bước tính:** in `moTa[]` từng dòng, đánh số.
  3. **Ba quẻ** cạnh nhau: chủ, hỗ, biến (`HinhHao`, hào động tô).
     - Mỗi quẻ link trang quẻ.
     - Khi `hoTuQueBien`, ghi nhỏ dưới quẻ hỗ: "Càn, Khôn không có hỗ, lấy hỗ của quẻ biến" và trích `queHo`.
  4. **Thể và dụng:**
     - thẻ Thể (`the`: tên, tượng, hành, chấm màu) và thẻ Dụng (`dung`), đặt trên hoặc dưới theo `viTriDung`;
     - sơ đồ 4 quái quanh thể (`cacQuai`). Mỗi quái có mũi tên và nhãn `TEN_QUAN_HE`; sinh thể / tỷ hòa màu dịu, khắc thể màu hổ phách.
  5. **Sách ghi:**
     - `loiSachTheDung` in đậm;
     - dưới đó `TrichNguyenVan` cho `sinhKhac`, `vaiTro`, `quaiKhac`.
- **Ví dụ trong sách:** 2 thẻ `VI_DU_SACH`, mỗi thẻ có:
  - tên;
  - `TrichNguyenVan(trich)`;
  - nút "Xem cách tính", dẫn tới `?vi-du=quan-mai`. Trang lập bằng `queMaiHoaTheoThoiGian` và in như kết quả, kèm dòng "Ví dụ chép trong sách".
- **Cách lập quẻ:** `<details>` "Phép lập quẻ theo sách", gồm:
  - bảng 8 quái với số Tiên thiên (`BAT_QUAI`, `soTienThien`);
  - `TrichNguyenVan` cho `soTienThien`, `thoiGian`, `soVat`, `chiaTam`, `chiaSau`, `queHo`.
- **Ghi chú** (nhỏ, cuối trang): "Trang chỉ tính quẻ và in quan hệ ngũ hành theo sách; không đoán việc thay người xem." Kèm liên kết `/kinh-dich/gieo-que`, `/kinh-dich/64-que`.

## 51.2. Liên kết vào

- **Trang `/kinh-dich`:** thêm thẻ Mai hoa Dịch số (chỉ thêm liên kết).
- **Trang `/kinh-dich/gieo-que`:**
  - **Có kết quả Mai hoa:** thêm dòng "Xem thể, dụng và các bước tính" → `/kinh-dich/mai-hoa-dich-so?ngay=…&gio=…`, cùng thời điểm.
  - **Còn lại:** không đổi bố cục.

## 51.3. Không làm

- Không làm lục hào: đợt sau.
- Không tính vượng suy theo mùa: sách ghi tháng tứ quý chồng lên mùa, chưa rõ cách lấy.
- Không làm phép "hậu thiên" lấy quái theo người, vật, phương hướng.

## 51.4. Nghiệm thu

1. **`?vi-du=quan-mai`:**
   - Trạch Hỏa Cách, hào 1 động, biến Hàm, hỗ trên Càn dưới Tốn;
   - thể Đoài (Kim), dụng Ly (Hỏa), nhãn "Khắc thể"; biến Cấn "Sinh thể";
   - câu "Dụng khắc thể, mọi việc hung."
2. **`?vi-du=mau-don`:** Thiên Phong Cấu, hào 5 động, biến Đỉnh, hỗ Càn Càn, thể Tốn.
3. **`?so=1&gio-chi=0`:** Thuần Càn có dòng "lấy hỗ của quẻ biến". `?so=0` hiện lỗi, không 500.
4. **`?ngay=2026-11-24&gio=10:30`:** dòng thời điểm có "âm" và "giờ Tỵ".
5. **Kiểm tra chung:**
   - `node scripts/kiem-chu-han.mjs`: 0 trang có chữ Hán;
   - `tsc --noEmit`: 0 lỗi;
   - ảnh 375px và 1366px của `?vi-du=quan-mai` và trang trống.

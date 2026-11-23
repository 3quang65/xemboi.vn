# Lệnh 45: Nhóm trang tra cứu trực quan (ngũ hành, con giáp, can chi, nạp âm, năm sinh, xông đất)

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 44.

**Báo cáo:** `docs/v2/lenh-antigravity/45-bao-cao.md`, theo mẫu Lệnh 25, kèm ảnh 375px và 1366px.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md`;
- ảnh `docs/v2/thiet-ke/tham-khao-4-repo/fengshui-london-wuxing.png` (vòng ngũ hành) và `nhatnguyet-tu-vi-12-con-giap.png`.

**Dùng lại:** `components/ck/truc-quan/` (`DocNhanh`, `ThuatNgu`, `TrichNguyenVan`, `ChuGiaiHanh`).

**Ràng buộc:** như Lệnh 40. Không sửa `src/lib/**`, `tests/**`. Không cài gói, không commit, không chạy `next build`. CSS mỗi cụm ≤ 30 KB. Không lời luận, không viết tính cách con giáp.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/tra-cuu-truc-quan.ts` (test `tests/trang/tra-cuu-truc-quan.test.mjs`)

| Hàm | Trả gì |
|---|---|
| `vongNguHanh(chon?)` | `dinh[5]` `{ hanh, goc, x, y, vaiTro? }` trên đường tròn bán kính 1 (Hỏa ở đỉnh); `canh[10]` `{ tu, den, loai: 'sinh' \| 'khac', noiBat }` |
| `quanHeConGiap(chi)` | `{ chi, tamHop, tamHoi, lucHop, xung, hai, hinh, tuHinh, trich }`. `trich` là mã trong `TRICH_BAT_TU` để in nguyên văn bằng `TrichNguyenVan` |
| `vongConGiap()` | 12 con giáp `{ chi, ten, slug, goc, hanh }`, Tý ở đỉnh, mỗi chi 30° |
| `luoi60HoaGiap(namNay)` | 60 ô `{ stt, ten, slug, napAm, hanh, cacNam[], laNamNay }` |
| `docNhanhNamSinh(nam, namXem)` | `{ cau, the[] }` cho trang năm sinh |

## 45.1. `VongNguHanh` (`components/ck/truc-quan/VongNguHanh.tsx`, SVG server component)

- **Đỉnh và cạnh:**
  - 5 đỉnh là vòng tròn màu hành (nền `-nhat`, viền và chữ `--ck-<hanh>`), ghi tên hành.
  - Cạnh sinh: cung cong theo vòng ngoài, nét liền, có mũi tên.
  - Cạnh khắc: đường thẳng tạo ngôi sao, nét đứt, có mũi tên, màu mực nhạt (không đỏ).
- **Khi có `chon`:**
  - 4 cạnh `noiBat` đậm, các cạnh khác mờ 30%;
  - đỉnh có nhãn nhỏ theo `vaiTro`: "Sinh ra", "Sinh cho", "Khắc", "Bị khắc".
- **Kích thước và chú giải:**
  - rộng 100% (tối đa 360px), chữ ≥ 12px ở 375px;
  - có chú giải 2 kiểu nét;
  - có `aria-label` mô tả 10 quan hệ.
- **Dùng ở:**
  - `/ngu-hanh` (không chọn, đặt trên bảng tra sinh khắc);
  - `/ngu-hanh/[hanh]` (chọn hành của trang);
  - `/nap-am/[slug]` (chọn hành của nạp âm).

## 45.2. `VongConGiap` (`components/ck/truc-quan/VongConGiap.tsx`, SVG)

- **Vòng 12 ô:**
  - mỗi ô ghi tên con giáp và chi, tô theo hành chi;
  - mỗi ô là link tới `/con-giap/[slug]`.
- **Khi có chi đang xem:**
  - ô đó viền son;
  - vẽ tam giác **tam hợp** (nét liền `--ck-moc`);
  - đường **lục hợp** (nét liền mảnh);
  - đường **xung** qua tâm (gạch dài, hổ phách `#B7791F`);
  - đường **hại** (gạch-chấm, tím xám);
  - **hình** (chấm dày, nâu) nối các chi cùng nhóm hình;
  - dùng đúng 5 kiểu nét của Lệnh 40 để người xem quen mắt.
- **Ở 375px:** vòng rộng 100%, tên con giáp có thể rút còn chi.
- **Dùng ở:**
  - `/con-giap` (không chọn);
  - `/con-giap/[slug]`: dưới vòng là danh sách quan hệ, mỗi dòng có `<details>` "Sách ghi" in `TrichNguyenVan` theo `trich`;
  - `/sinh-nam/[yyyy]`: chọn chi của năm.

## 45.3. Lưới 60 hoa giáp (`/can-chi/60-hoa-giap`)

- **Bố cục lưới:**
  - 6 hàng × 10 cột ở ≥ 768px, mỗi hàng một con giáp đầu (Giáp Tý, Giáp Tuất, …); ở 375px chuyển thành 10 hàng × 6 cột hoặc danh sách gọn.
  - Thứ tự đi đúng `stt`.
- **Mỗi ô:**
  - can chi;
  - nạp âm chữ nhỏ;
  - nền nhạt theo hành nạp âm;
  - hai năm trong `cacNam`;
  - link tới `/can-chi/[slug]`.
- Ô `laNamNay` viền son, nhãn "Năm nay".
- Có `ChuGiaiHanh`.
- Bảng hiện có (nếu có) giữ nguyên nội dung, đặt trong `<details>` "Xem dạng bảng".

## 45.4. Năm sinh (`/sinh-nam/[yyyy]`)

1. `DocNhanh` với `docNhanhNamSinh(nam, năm hiện tại)`, đặt đầu trang.
2. Ngay dưới là hàng 2 hình nhỏ:
   - `VongConGiap` chọn chi của năm;
   - `VongNguHanh` chọn hành nạp âm.
   - Ở 375px hai hình xếp dọc.
3. Phần nội dung cũ giữ nguyên.

## 45.5. Xông đất (`/xem-tuoi/xong-dat`)

- Dùng thẻ có `muc` như Lệnh 43 (`docNhanhXemTuoi` không áp được vì khác dữ liệu).
- Mỗi ứng viên là một thẻ, gồm:
  - năm, can chi;
  - thanh nhỏ gồm các ô tiêu chí tô theo `muc` (✓ / – / ! để ảnh xám đọc được);
  - số tốt / xấu ghi bằng chữ "hợp / chưa hợp".
- Giữ thứ tự lib trả về.

## 45.6. Nghiệm thu

1. **`/ngu-hanh/moc`:**
   - Mộc sinh Hỏa, Thủy sinh Mộc, Mộc khắc Thổ, Kim khắc Mộc nổi bật;
   - 6 cạnh còn lại mờ.
2. **`/con-giap/` của Dần:**
   - tam hợp Dần Ngọ Tuất;
   - lục hợp Hợi;
   - xung Thân;
   - hại Tỵ;
   - hình vô ân Dần Tỵ Thân;
   - mỗi mục có "Sách ghi".
3. **`/can-chi/60-hoa-giap`:** đúng 1 ô "Năm nay" (năm âm hiện tại).
4. **`/sinh-nam/1990`:** câu đọc nhanh bắt đầu "Sinh năm âm 1990 là tuổi Canh Ngọ (Ngựa), nạp âm Lộ Bàng Thổ hành Thổ".
5. **Ảnh và khả dụng:**
   - ảnh xám: phân biệt được sinh/khắc và 5 kiểu nét quan hệ;
   - 375px không cuộn ngang, vùng bấm ≥ 44px;
   - tắt JS vẫn dùng được.
6. **Kỹ thuật:** `tsc` sạch; CSS mỗi cụm ≤ 30 KB.

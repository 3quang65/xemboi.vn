# Báo cáo Lệnh 45: Nhóm trang tra cứu trực quan (ngũ hành, con giáp, can chi, nạp âm, năm sinh, xông đất)

Ngày hoàn thành: 24/11/2026.

## 1. Danh sách tệp tạo, sửa, xóa

### Tệp tạo mới
- `src/components/ck/truc-quan/VongNguHanh.tsx` (`9.849` byte) — SVG Server Component dựng vòng 5 hành từ `vongNguHanh(chon?)` trong `src/lib/trang/tra-cuu-truc-quan.ts`: 5 đỉnh màu hành kèm link `/ngu-hanh/[hanh]`, cung sinh vòng ngoài nét liền có mũi tên (`--ck-moc`), đường khắc ngôi sao bên trong nét đứt màu mực nhạt `#5A4636` (không đỏ); khi có `chon` làm nổi 4 cạnh `noiBat` và mờ 30% 6 cạnh còn lại, gắn nhãn `Sinh ra` / `Sinh cho` / `Khắc` / `Bị khắc`; rộng 100% tối đa `360px`, chữ SVG `>= 15` đơn vị (`>= 12,3px` khi dựng ở màn `375px`), kèm chú giải 2 kiểu nét và `aria-label` mô tả 10 quan hệ.
- `src/components/ck/truc-quan/VongConGiap.tsx` (`13.246` byte) — SVG Server Component dựng vòng 12 địa chi từ `vongConGiap()` và `quanHeConGiap()` (`Tý` ở đỉnh, mỗi chi `30°`, tô màu theo hành chi, mỗi ô là link `/con-giap/[slug]`); khi chọn chi tô viền son, vẽ đủ 5 nhóm nét chuẩn Lệnh 40 (tam hợp `--ck-moc` nét liền, lục hợp nét liền mảnh, xung qua tâm gạch dài hổ phách `#B7791F`, hại gạch-chấm tím xám `#6B5B7B`, hình/tự hình chấm dày nâu `#7C4A2D`) có tách cung Bézier tránh chồng nét (nhất là ca Dần: xung Dần–Thân, hại Dần–Tỵ, hình Dần–Tỵ–Thân); trên `<= 520px` tự rút gọn còn chi để đọc rõ ở `375px`; đồng thời xuất `KIEU_NET_TRA_CUU` và `MauNetTraCuuSvg`.
- `docs/v2/lenh-antigravity/45-bao-cao.md` — Báo cáo này.
- Ảnh chụp nghiệm thu trong `docs/v2/bang-chung/` (`18` ảnh):
  - `ck-45-ngu-hanh-1366.png` (`1.021.297` byte)
  - `ck-45-ngu-hanh-375.png` (`674.410` byte)
  - `ck-45-ngu-hanh-moc-1366.png` (`1.064.226` byte)
  - `ck-45-ngu-hanh-moc-375.png` (`690.206` byte)
  - `ck-45-ngu-hanh-moc-grayscale-1366.png` (`32.290` byte)
  - `ck-45-nap-am-1366.png` (`1.034.926` byte)
  - `ck-45-con-giap-1366.png` (`1.070.421` byte)
  - `ck-45-con-giap-375.png` (`680.874` byte)
  - `ck-45-con-giap-dan-1366.png` (`1.129.372` byte)
  - `ck-45-con-giap-dan-375.png` (`742.903` byte)
  - `ck-45-con-giap-dan-grayscale-1366.png` (`62.168` byte)
  - `ck-45-60-hoa-giap-1366.png` (`1.125.587` byte)
  - `ck-45-60-hoa-giap-375.png` (`759.079` byte)
  - `ck-45-sinh-nam-1990-1366.png` (`1.255.777` byte)
  - `ck-45-sinh-nam-1990-375.png` (`872.903` byte)
  - `ck-45-xong-dat-1366.png` (`1.076.011` byte)
  - `ck-45-xong-dat-375.png` (`695.989` byte)
  - `ck-45-xong-dat-grayscale-1366.png` (`48.858` byte)

### Tệp chỉnh sửa
- `src/components/ck/truc-quan/index.ts` (`880` byte) — Xuất thêm `VongNguHanh`, `VongConGiap`, `KIEU_NET_TRA_CUU`, `MauNetTraCuuSvg` và các kiểu TypeScript liên quan.
- `src/components/ck/truc-quan/truc-quan.css` (`19.547` byte ≤ `30.720` B / 30 KB) — Bổ sung kiểu `.ck-tq-vnh-*` và `.ck-tq-vcg-*` (vòng ngũ hành, vòng 12 con giáp, chú giải nét, rút gọn chỉ hiện chi ở `<= 520px`, tôn trọng `prefers-reduced-motion`).
- `src/components/ck/tu-dien.css` (`17.833` byte ≤ `30.720` B / 30 KB) — Bổ sung bố cục đầu trang `/ngu-hanh/[hanh]`, danh sách quan hệ và khối lưu ý hổ phách ở `/con-giap/[slug]`, lưới 60 hoa giáp (10 cột ở `>= 768px`, 5 cột ở `481–767px`, 3 cột ở `<= 480px`), hàng 2 hình xếp dọc ở `<= 767px` cho `/sinh-nam/[yyyy]`, và chuẩn vùng bấm `>= 44px`.
- `src/app/(v2)/ngu-hanh/page.tsx` (`4.318` byte) — Thay `SoDoNguHanh` bằng `<VongNguHanh />` và `<ChuGiaiHanh />` đặt phía trên bảng tra sinh khắc.
- `src/app/(v2)/ngu-hanh/[hanh]/page.tsx` (`7.012` byte) — Gắn `<VongNguHanh chon={hanhVal} />` cạnh lưới 4 thẻ quan hệ sinh khắc.
- `src/app/(v2)/nap-am/[slug]/page.tsx` (`7.412` byte) — Bổ sung `<VongNguHanh chon={na.hanh} />` ngay dưới khối tổng quan nạp âm.
- `src/app/(v2)/con-giap/page.tsx` (`2.908` byte) — Bổ sung `<VongConGiap />` phía trên lưới 12 con giáp.
- `src/app/(v2)/con-giap/[slug]/page.tsx` (`12.304` byte) — Gắn `<VongConGiap chiChon={cg.chi} />` ở đầu trang cùng danh sách 6 dòng quan hệ (Tam hợp, Tam hội, Lục hợp, Lục xung, Lục hại, Tương hình / Tự hình) có ký hiệu nét chuẩn, `ThuatNgu` popover, và `<details>` `"Sách ghi"` in `TrichNguyenVan` theo `qh.trich`; kèm câu nhắc hổ phách không vội luận dữ. Không viết tính cách con giáp.
- `src/app/(v2)/can-chi/60-hoa-giap/page.tsx` (`5.102` byte) — Dựng lưới 60 hoa giáp theo `luoi60HoaGiap(homNay().am.nam)` đúng thứ tự `stt`, nền nhạt theo hành nạp âm, đủ 2 năm `cacNam`, link `/can-chi/[slug]`, đánh dấu duy nhất ô `laNamNay` bằng viền son và nhãn `"Năm nay"`, kèm `ChuGiaiHanh`; bảng cũ giữ nguyên bên trong `<details>` `"Xem dạng bảng"`.
- `src/app/(v2)/sinh-nam/[yyyy]/page.tsx` (`14.879` byte) — Gắn `DocNhanh` (`docNhanhNamSinh(nam, homNay().am.nam)`, bọc `ThuatNgu` cho `"Nạp âm"`) ở đầu trang, ngay dưới là hàng 2 hình (`VongConGiap` chọn chi của năm và `VongNguHanh` chọn hành nạp âm, xếp dọc ở `375px`), giữ nguyên toàn bộ phần nội dung cũ.
- `src/app/(v2)/xem-tuoi/xong-dat/page.tsx` (`12.806` byte) — Nâng cấp thẻ ứng viên `goiYXongDat` theo thứ tự lib trả về: thêm thanh nhỏ 4 ô tiêu chí tô theo `muc` với ký hiệu `✓` / `–` / `!` để ảnh xám đọc được, hiển thị số tiêu chí bằng `"hợp / chưa hợp"`, loại bỏ chữ `"xấu"` ở phần kết quả, dùng tông hổ phách `#B7791F` cho mức chưa hợp (không đỏ).
- `src/app/(v2)/xem-tuoi/xem-tuoi.css` (`10.579` byte ≤ `30.720` B / 30 KB) — Kiểu cho thanh 4 ô `.ck-xd-thanh`, thẻ ứng viên xông đất, nền sọc hổ phách `#B7791F` cho mức chưa hợp, và vùng bấm `>= 44px`.

### Tệp đã xóa
- Không có.

### Xác nhận vùng cấm
- Không sửa `prisma/**`, `src/lib/**` (chỉ đọc `src/lib/trang/tra-cuu-truc-quan.ts`, `can-chi.ts`, `lich.ts`, `bat-tu-truc-quan.ts`, `xem-tuoi.ts`), `src/middleware.ts`, `src/app/api/**`, `scripts/**`, `src/app/layout.tsx`, `src/app/quan-tri/**`, `src/components/r1/**`, `src/app/(v2)/ck.css`, `src/app/(v2)/ck-nen.css`, `src/components/ck/DauTrang.tsx`, `tests/**`, `package.json`.
- Không mở/lưu các tệp đang có chỉnh sửa sẵn từ các lệnh trước (`bat-tu/**`, `chiem-tinh/**`, `lich-am/**`, `phong-thuy/**`, `tu-vi/**`, `xem-ngay/**`, `xem-tuoi/vo-chong/page.tsx`, `FormLaSo.tsx`).
- Không cài gói npm, không commit, không chạy `next build`.

## 2. Kết quả nghiệm thu

1. **Kiểm tra TypeScript (`.\node_modules\.bin\tsc.cmd --noEmit -p .`)**:
   - Đạt, mã thoát `0` (`TSC_EXIT=0`, `0` lỗi).
2. **Kiểm tra unit test (`.\node_modules\.bin\tsx.cmd --env-file=.env --test tests/trang/tra-cuu-truc-quan.test.mjs tests/trang/can-chi.test.mjs tests/trang/xem-tuoi.test.mjs`)**:
   - Đạt, mã thoát `0` (`TEST_EXIT=0`): `16/16` bài test qua, `0` thất bại, `0` bị bỏ qua.
3. **Kiểm tra dung lượng CSS (≤ 30.720 byte / 30 KB)**:
   - `src/components/ck/truc-quan/truc-quan.css`: `19.547` byte.
   - `src/components/ck/tu-dien.css`: `17.833` byte.
   - `src/app/(v2)/xem-tuoi/xem-tuoi.css`: `10.579` byte.
4. **Kiểm tra trình duyệt trên `http://localhost:3047` (Chrome via `playwright-core`) ở 3 khổ `1366px`, `768px`, `375px`**:
   - Toàn bộ `9` đường dẫn kiểm tra (`/ngu-hanh`, `/ngu-hanh/moc`, `/nap-am/lo-bang-tho`, `/con-giap`, `/con-giap/dan`, `/con-giap/ngo`, `/can-chi/60-hoa-giap`, `/sinh-nam/1990`, `/xem-tuoi/xong-dat?chu=1985&tet=2026`) đều trả **HTTP 200**, `0` `console.error`, `0` `pageerror`, `0` HTTP `>= 400`.
   - **Không tràn ngang & vùng bấm `>= 44px`:** `scrollWidth === innerWidth` (`1366`, `768`, `375`) trên cả `9` trang; `smallControls: []` (0 nút/ô lưới/liên kết điều hướng dưới `44px`) ở cả 3 khổ.
   - **Nghiệm thu 45.6.1 (`/ngu-hanh/moc` và `/ngu-hanh`, `/nap-am/lo-bang-tho`):**
     - Đúng `4` cạnh `noiBat` (`moc->hoa` sinh, `thuy->moc` sinh, `moc->tho` khắc, `kim->moc` khắc) và `6` cạnh còn lại `opacity="0.3"`; đường khắc dùng màu mực `#5A4636` nét đứt (không đỏ).
     - Các đỉnh hiển thị đủ vai trò `Sinh ra` (Hỏa), `Khắc` (Thổ), `Bị khắc` (Kim), `Sinh cho` (Thủy).
     - Tại `375px` (ngay cả trong khung hẹp của `/ngu-hanh/moc` rộng `295px`), cỡ chữ SVG dựng thực tế đạt `12,3px`–`13,9px` (`>= 12px`).
   - **Nghiệm thu 45.6.2 (`/con-giap/dan` và `/con-giap`, `/con-giap/ngo`):**
     - Vòng 12 ô đầy đủ link `/con-giap/ty`..`/con-giap/hoi` (Tỵ dùng `/con-giap/ti`); Dần viền son.
     - Vẽ tách bạch 5 kiểu nét trong ảnh màu lẫn ảnh xám (`ck-45-con-giap-dan-grayscale-1366.png`): tam hợp Dần Ngọ Tuất (`--ck-moc` nét liền), lục hợp Dần Hợi (nét liền mảnh), xung Dần Thân (`#B7791F` gạch dài qua tâm), hại Dần Tỵ (tím xám gạch-chấm cong ngoài), hình vô ân Dần Tỵ Thân (nâu chấm dày cong trong).
     - Danh sách bên dưới đủ 6 dòng (Tam hợp, Tam hội, Lục hợp, Lục xung, Lục hại, Tương hình) kèm `"Sách ghi"` `TrichNguyenVan` và popover `ThuatNgu`; không có tính cách con giáp.
     - Tại `375px`, vòng rút gọn chỉ hiện tên chi (`tenConHidden: true`).
   - **Nghiệm thu 45.6.3 (`/can-chi/60-hoa-giap`):**
     - Đủ `60` ô đúng thứ tự `stt`; `10` cột ở `1366px` và `768px`, `3` cột gọn ở `375px` không cuộn ngang.
     - Duy nhất ô `43` (`Bính Ngọ`, `1966 · 2026`) có viền son và nhãn `"Năm nay"`. Bảng `60` dòng cũ giữ nguyên bên trong `<details>` `"Xem dạng bảng"`.
   - **Nghiệm thu 45.6.4 (`/sinh-nam/1990`):**
     - Câu `DocNhanh` mở đầu đúng: `"Sinh năm âm 1990 là tuổi Canh Ngọ (Ngựa), nạp âm Lộ Bàng Thổ hành Thổ; năm âm này tính từ Tết 27/01/1990 tới 14/02/1991. Năm 2026 tròn 37 tuổi mụ."`.
     - Hai hình (`VongConGiap` Ngọ + `VongNguHanh` Thổ) đặt cạnh nhau ở `1366px`/`768px` (`y = 1006` / `1126`) và xếp dọc ở `375px` (`y = 1490` và `y = 1958`).
   - **Nghiệm thu 45.6.5 (`/xem-tuoi/xong-dat?chu=1985&tet=2026`):**
     - Trả `4` thẻ ứng viên đúng thứ tự lib (`2001 Tân Tỵ`, `1998 Mậu Dần`, `1977 Đinh Tỵ`, `1974 Giáp Dần`), mỗi thẻ có thanh 4 ô `✓`/`–`/`!`, nhãn `"hợp · chưa hợp"`, `hasXauWord: false`.
   - **Nghiệm thu 45.6.6 (Chế độ tắt JS — `javaScriptEnabled: false`):**
     - `/con-giap/dan`: mở `<details>` `"Sách ghi"` (`sachOpen: 1`) và popover `ThuatNgu` (`popoverOpen: 1`) không cần JS.
     - `/can-chi/60-hoa-giap`: mở `"Xem dạng bảng"` (`bangOpen: 1`) không cần JS.
     - `/sinh-nam/1990`: `DocNhanh` và popover `"Nạp âm"` (`popoverOpen: 1`) hoạt động không cần JS.
     - `/xem-tuoi/xong-dat?chu=1985&tet=2026`: mở `<details>` `"Xem 4 tiêu chí đối chiếu"` (`detailsOpen: 1`) không cần JS.
   - **Duyệt ảnh chụp:** đã mở xem trực tiếp các ảnh `ck-45-*.png` (cả `1366px`, `375px` và ảnh xám) — 5 nét quan hệ trên ca Dần, hai mức đậm/mờ trên vòng Mộc, lưới 60 hoa giáp, bố cục 2 vòng năm 1990 và thanh 4 ô xông đất đều tách bạch, không đè chữ. *(Ghi chú nhỏ: bộ lọc từ cấm báo khớp cụm `"vật phẩm"` trong dòng mô tả có sẵn của `SeoTrang` trên `/ngu-hanh/moc` nguyên văn là `"Không gắn bán vật phẩm."` — không phải nội dung tự thêm).*

## 3. Các điểm lệch khỏi lệnh và lý do

1. **Lưới `/can-chi/60-hoa-giap` ở `375px` dùng `3` cột thay vì `6` cột:**
   - *Lý do:* Lệnh 45.3 ghi `"ở 375px chuyển thành 10 hàng × 6 cột hoặc danh sách gọn"`. Trên khổ `375px` (bề rộng khả dụng `343px`), `6` cột chỉ còn `~52px`/cột nên tên can chi và nạp âm sẽ bị ép xuống nhiều dòng hẹp hoặc tràn. Dùng `3` cột (`~110px`/cột, `min-height: 84px`) giữ trọn can chi, nạp âm, hai năm sinh trong `cacNam` và vùng bấm `>= 44px` với `scrollWidth = 375`.
2. **Dịch chuỗi mô tả tiêu chí của `goiYXongDat` qua `lamDiuNhanHienThi` trong `/xem-tuoi/xong-dat/page.tsx`:**
   - *Lý do:* Không sửa `src/lib/trang/xem-tuoi.ts` (vùng cấm sửa); mọi hiển thị trong trang xông đất được chuyển sang dùng `"hợp"` / `"bình thường"` / `"chưa hợp"` và loại chữ `"xấu"` tại lớp giao diện.

## 4. Dữ liệu còn thiếu cần Claude Code bổ sung

- Không có dữ liệu mới bị thiếu ở tầng `src/lib/trang/tra-cuu-truc-quan.ts`. Nếu muốn đồng bộ câu chữ trong `src/lib/trang/xem-tuoi.ts` khi mở khóa `src/lib/**`, có thể cập nhật thêm để lớp giao diện không cần lọc `"xấu"`.

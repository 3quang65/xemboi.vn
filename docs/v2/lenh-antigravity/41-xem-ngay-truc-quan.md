# Lệnh 41: Xem ngày và lịch âm trực quan

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity. **Chỉ làm sau khi Lệnh 40 đã được duyệt.**

Báo cáo ghi vào `docs/v2/lenh-antigravity/41-bao-cao.md`, theo mẫu Lệnh 25, kèm ảnh 375px và 1366px.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md` (bắt buộc);
- ảnh `docs/v2/thiet-ke/tham-khao-4-repo/nhatnguyet-gio-hoang-dao.png`, `nhatnguyet-ngay-tot.png`, `nhatnguyet-lich-thang.png`.

**Dùng lại thành phần của Lệnh 40** (`components/ck/truc-quan/`: `DocNhanh`, `ThuatNgu`, `TrichNguyenVan`). Không viết lại.

**Ràng buộc và phạm vi cấm sửa:** như Lệnh 40. Không chạy `next build`.

## Vì sao

Trang `/xem-ngay` hiện liệt kê 3 lớp bằng chữ và bảng. Người xem muốn biết ba điều:
1. hôm nay thế nào;
2. giờ nào tốt;
3. muốn làm việc X thì chọn ngày nào.

Công cụ trên thị trường trả lời ba câu này bằng hình:
- dải 12 giờ có màu;
- 3 thẻ ngày tốt, mỗi thẻ một câu lý do;
- lưới lịch tháng có ngày âm nhỏ.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/xem-ngay-truc-quan.ts` (có test)

- `daiGio(chiTietNgay, luc?)` trả `{ gio[], soHoangDao, laHomNay, ghiChuTy }`.
  - Mỗi `gio` có `{ chi, khung, canChi, hoangDao, chiSo, hienTai, daQua }`.
  - `hienTai` và `daQua` chỉ có khi ngày xem là hôm nay (giờ Việt Nam).
- `docNhanhNgay(ngayXem, luc?)` trả `{ cau, the[] }`.
  - Mỗi thẻ có `{ ma, nhan, giaTri, muc?: 'tot' | 'binh' | 'diu', chiTiet }`.
  - Thẻ không có `hanh`, nên tô màu theo `muc`:
    - `tot`: xanh `--ck-moc`;
    - `binh`: mực thường;
    - `diu`: hổ phách `#B7791F` (không dùng đỏ).
  - `DocNhanh` của Lệnh 40 chưa nhận `muc` thì thêm prop tùy chọn, không phá trang bát tự.
- `chonNgayHopNhat(ma, tu?, soNgay = 30, soChon = 3)` trả `{ viec, tu, den, soNgay, dem: { hop, ky, khac }, chon[], tieuChi, ghiChu }`.
  - Mỗi `chon` có `{ iso, duong, thu, am, canChiNgay, truc, than, phuNghi, lyDo[], dauDanh }`.
  - `soNgay` chỉ dùng 30, 60 hoặc 90.
- Tệp lịch: `/xem-ngay/{ma}/lich.ics?soNgay=30|60|90`. Route đã có, chỉ cần đặt link.
- Dữ liệu cũ: `xemNgay`, `ngayTheoViec`, `thangXemNgay` (`xem-ngay.ts`); `ngayLich`, `thangLich` (`lich.ts`).

## 41.1. Thành phần mới

**`DaiGio`** (`components/ck/truc-quan/DaiGio.tsx`, server component) nhận `{ dai: DaiGio, tieuDe? }`:
- 12 ô cùng cỡ trên 1 hàng ở ≥ 768px; ở 375px gập thành **2 hàng × 6 ô**.
- Mỗi ô ghi tên chi (đậm), khung giờ (nhỏ), can chi giờ (nhỏ hơn).
- Màu ô:
  - giờ hoàng đạo: nền `--ck-moc-nhat`, có vạch đáy 3px `--ck-moc`, chữ đậm;
  - giờ hắc đạo: nền giấy nhạt, chữ xám vừa, **không đỏ**.
- `daQua`: mờ 55%.
- `hienTai`: khung son 2px và nhãn nhỏ "Bây giờ".
- Dưới dải là trục chú thích "23:00 · 05:00 · 11:00 · 17:00 · 23:00" (khớp vị trí ô Tý, Mão, Ngọ, Dậu), rồi dòng `ghiChuTy` chữ nhỏ.
- Có chú giải: ô xanh là hoàng đạo, ô nhạt là hắc đạo.
- Thêm `aria-label` cho từng ô, ví dụ "Giờ Tỵ 09:00–10:59, hoàng đạo, bây giờ".

**`TheNgayChon`** (cùng thư mục):
- Thẻ một ngày đã chọn:
  - dòng đầu: "Thứ tư 08/01/2027" chữ lớn, ngày âm và can chi ngày bên cạnh;
  - danh sách `lyDo`, mỗi dòng một câu, in nguyên văn.
- `dauDanh` có viền son và nhãn **"Hợp nhất trong khoảng"**.
- Bấm thẻ thì mở trang chi tiết ngày (`duongDanNgayTuIso`).

## 41.2. `/xem-ngay` (trang chính)

1. Đầu mục "Hôm nay": `DocNhanh` với `docNhanhNgay(xemNgay(hôm nay))`, ngay sau là `DaiGio`. Ba lớp chi tiết đang có giữ nguyên nội dung nhưng đặt bên dưới (có thể gập trong `<details open>`).
2. "Ngày mai" giữ thẻ phụ như hiện nay, thêm một dòng "Giờ hoàng đạo: …".
3. "Chọn ngày theo việc":
   - các việc thành **nút phân đoạn** (grid 2 cột ở 375px, 3–4 cột ở 1366px);
   - mỗi nút ghi tên việc và số ngày hợp của tháng (đang có `soHop`).
4. "Bảng xem ngày cả tháng" chuyển thành **lưới lịch 7 cột**:
   - mỗi ô: ngày dương to, ngày âm nhỏ (mùng 1 ghi dạng "1/11"), chấm xanh nếu thần hoàng đạo, tên trực chữ nhỏ;
   - Chủ nhật ngày dương màu son; hôm nay có nền nhấn;
   - bấm ô mở trang ngày;
   - bảng cũ chuyển vào `<details>` "Xem dạng bảng";
   - xem `LichThang.tsx` để dùng lại cách dựng lưới. Không sửa `lich.ts`.

## 41.3. `/xem-ngay/[ma]` (từng việc)

Ngay dưới tiêu đề, thêm khối **"Ngày hợp nhất cho {việc}"**:
- Nút phân đoạn "30 ngày / 60 ngày / 90 ngày" là link `?trong=30|60|90`. Mặc định 30. Giá trị lạ thì về 30. Trang có tham số đặt `robots: noindex`, giữ canonical không tham số như các trang khác.
- Dòng tóm tắt: "Từ {tu} tới {den}: {hop} ngày bảng ghi nên, {ky} ngày ghi kỵ."
- Tối đa 3 `TheNgayChon`. Không có ngày nào thì ghi rõ và gợi ý chọn khoảng dài hơn.
- `<details>` "Cách xếp": in `tieuChi` (danh sách đánh số) và `ghiChu`, nguyên văn.
- Link **"Tải về lịch (.ics)"** tới `/xem-ngay/{ma}/lich.ics?soNgay={trong}`, có thuộc tính `download`.
- Bảng tháng đang có của việc chuyển sang lưới 7 cột như 41.2.4:
  - ô "hợp" viền xanh;
  - ô "kỵ" nền hổ phách rất nhạt;
  - ô "không nhắc" để trơn;
  - có chú giải.

## 41.4. Lịch âm

- **`/lich-am`:** thêm `DaiGio` cho hôm nay, ngay dưới khối ngày.
- **Trang chi tiết ngày** (tìm theo `duongDanNgay`): thêm `DaiGio` (không có `hienTai` vì không phải hôm nay, trừ khi đúng hôm nay).
- **`/xem-ngay/xuat-hanh`:** danh sách giờ hoàng đạo đổi sang `DaiGio`.

## 41.5. Nghiệm thu

1. **Ngày 24/11/2026** (dùng `?ngay=` nếu trang hỗ trợ, nếu không thì so với hôm nay): 6 ô hoàng đạo đúng như `ngayLich(...).gioHoangDao`.
2. **`/xem-ngay/khai-truong?trong=60`:** 3 thẻ đúng thứ tự `chonNgayHopNhat('khai-truong', hôm nay, 60)`. Ghi 3 ngày đó vào báo cáo. Tải được tệp `.ics` và mở được bằng lịch của máy.
3. **Ảnh 375px:** dải giờ thành 2×6, không cuộn ngang; nút việc ≥ 44px.
4. Tắt JS vẫn dùng được (mọi tương tác là link hoặc `<details>`).
5. CSS mỗi cụm ≤ 30 KB; `tsc` sạch.

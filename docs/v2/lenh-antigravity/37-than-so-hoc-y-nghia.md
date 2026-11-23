# Lệnh 37: Thêm phần ý nghĩa vào cụm `/than-so-hoc` (lời Nhật Nguyệt + nguyên văn sách cổ)

Người giao: Claude Code, 23/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/37-bao-cao.md`.

Ràng buộc như Lệnh 25, 31–36:
- CSS chỉ dùng lớp `ck-`;
- không bịa nội dung;
- **không tự dịch** câu trích tiếng Anh;
- chỉ đặt liên kết tới trang có trong `trangDaDung()`;
- không cài gói, không commit.

Không sửa:
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`, `components/r1`;
- `ck.css`, `ck-nen.css`, `DauTrang.tsx`.

## Vì sao

Ở Lệnh 35, cụm Thần số học chỉ có phần tính, vì lúc đó chưa có nguồn cho phần ý nghĩa. Nay anh Cường cho dùng kho của Nhật Nguyệt (nhatnguyet.org), xin phép sau. Kho gồm:
- lời của Nhật Nguyệt bằng tiếng Việt: điểm mạnh, điểm yếu, công việc, tình cảm, tiền bạc, sức khỏe, lời nhắc, ý nghĩa;
- đoạn nguyên văn tiếng Anh từ 8 sách thần số học in 1905–1926 (phạm vi công cộng).

## Quy tắc chữ trên trang

1. Lời Nhật Nguyệt in **đúng nguyên chữ** trả từ lib. Không sửa, không thêm câu, không tóm tắt.
2. Mỗi khối ý nghĩa phải có dòng ghi công, nằm cuối khối: `Dữ liệu: Nhật Nguyệt (nhatnguyet.org)`, trong đó "nhatnguyet.org" là liên kết `NGUON_Y_NGHIA.url` với `rel="noopener"`. Đây là điều kiện bắt buộc của giấy phép.
3. Đoạn sách tiếng Anh đặt trong `<blockquote lang="en">`, kèm dòng nguồn: *{sach}*, {tacGia}, {chuong}. Không dịch. Không cắt chữ giữa câu. Đoạn dài hơn 600 ký tự thì thu gọn bằng `<details>`, phần `<summary>` ghi "Đọc đoạn trích (tiếng Anh)".
4. Có hai loại đoạn trích, phải tách rõ:
   - `trichRieng`: tiêu đề "Sách cổ viết về số chủ đạo {n}". Với chỉ số khác thì thay tên chỉ số.
   - `trichChung`: tiêu đề "Sách cổ viết về con số {n} nói chung". Ngay dưới tiêu đề ghi một dòng: "Các đoạn này nói về con số {n}, không riêng cho {tên chỉ số}."
5. Câu `GHI_CHU_Y_NGHIA` (đã đổi chữ) đặt **ngay trên** khối ý nghĩa, không đặt cuối trang như trước. Giữ `KhoiGioiHan` ở cuối trang.
6. Không viết thêm "người số X thường…" ở chỗ khác, không xếp hạng số "tốt" hay "xấu".

## Dữ liệu (đã có, chỉ đọc)

`src/lib/trang/than-so-hoc-y-nghia.ts`. **Chỉ import ở server component.** Tệp JSON khoảng 160 KB, không được kéo vào `TinhTheoTenClient` hay component `'use client'` nào.
- `yNghia(chiSo, so)` trả về `{ tenChiSo, tenAnh, moTaChiSo?, loi: [{k, ten, vb}], trichRieng, trichChung }`, hoặc `undefined` nếu kho không có số đó.
- `chiSo` là một trong: `'so-chu-dao' | 'ngay-sinh' | 'thai-do' | 'dinh-cao' | 'thach-thuc' | 'nam-ca-nhan' | 'no-nghiep'`.
- `NHAN_LOI`, `NGUON_Y_NGHIA`, `sachDuocTrich(ds)`, `soCoYNghia(chiSo)`.

`src/lib/trang/than-so-hoc.ts` có thêm:
- `thaiDo(d)`: số thái độ (ngày + tháng). Có `phepCong`.
- `thachThuc(d)`: 4 số thách thức 0–8. Có `phepTru`.
- `noNghiepNgaySinh(ngay)`: 13, 14, 16, 19 hoặc `undefined`.
- `GHI_CHU_Y_NGHIA`: chữ mới.

## Việc cần làm

### 37.1. Component chung trong `ThanSoHocUi.tsx`

Thêm `KhoiYNghia({ y, gon? })`, nhận một `YNghiaSo`:
- đầu khối: `GHI_CHU_Y_NGHIA`;
- `moTaChiSo` (nếu có) in nhỏ, dạng câu giới thiệu chỉ số;
- danh sách `loi` dạng `<dl>`: `<dt>{ten}</dt><dd>{vb}</dd>`;
- `trichRieng`, rồi `trichChung`, theo quy tắc 3 và 4. Khi `gon` bật, chỉ hiện `loi` và tối đa 2 đoạn `trichRieng`, kèm liên kết "Xem thêm" tới trang số tương ứng nếu trang đó có;
- cuối khối: dòng ghi công (quy tắc 2) và danh sách sách được trích (`sachDuocTrich`).

Bỏ `KhoiGhiChuYNghia` cũ, hoặc chỉ dùng nó bên trong `KhoiYNghia`.

### 37.2. `/than-so-hoc/so-chu-dao/[so]`

Thay chỗ đang đặt `<KhoiGhiChuYNghia />` bằng mục `<h2>Ý nghĩa số chủ đạo {n}</h2>` + `<KhoiYNghia y={yNghia('so-chu-dao', n)} />`. Đặt mục này **sau** khối đầu trang (cách tính) và **trước** "Ví dụ ngày sinh".

### 37.3. `/than-so-hoc/nam-ca-nhan/[so]`

Thêm mục `<h2>Ý nghĩa năm cá nhân {n}</h2>` + `KhoiYNghia` với `yNghia('nam-ca-nhan', n)`, đặt sau khối cách tính.

### 37.4. `/than-so-hoc/bieu-do-ngay-sinh` (khi đã nhập ngày)

Ngoài biểu đồ và 4 đỉnh cao đang có, thêm vào kết quả:
- **Bốn đỉnh cao**: mỗi đỉnh in thêm `yNghia('dinh-cao', so)` ở chế độ `gon` (chỉ `loi`). Các đoạn trích để trong một `<details>` "Sách cổ viết về con số …".
- **Bốn số thách thức** (`thachThuc`): bảng gồm thứ tự, phép trừ, số, rồi `yNghia('thach-thuc', so)` ở chế độ `gon`. Số 0 cũng có trong kho.
- **Số thái độ** (`thaiDo`): phép cộng, số, `yNghia('thai-do', so)` ở chế độ `gon`.
- **Số ngày sinh** (`rutDon(ngay)`): `yNghia('ngay-sinh', so)` ở chế độ `gon`.
- **Nợ nghiệp**: chỉ hiện khi `noNghiepNgaySinh(ngay)` có giá trị. Kho không có lời Việt cho nợ nghiệp, chỉ có đoạn sách nói chung, nên hiện câu "Ngày sinh {ngay} được thần số học xếp vào nhóm nợ nghiệp (13, 14, 16, 19)." rồi các đoạn `trichChung` thu gọn.

Ở trang chưa nhập ngày, giữ nguyên như cũ.

### 37.5. Trang hub `/than-so-hoc`

Ở lưới 12 số chủ đạo, dưới mỗi số thêm một dòng ngắn là `loi` loại `manh` (điểm mạnh) của số đó, kèm một dòng ghi công chung dưới lưới. Ở lưới năm cá nhân, dòng ngắn là `loi` loại `yNghia`.

### 37.6. CSS

Thêm vào `than-so-hoc.css` (hiện 17 KB, trần 30 KB), lớp `ck-tsh-yn-*`:
- `<dl>` hai cột ở desktop, một cột ở 375 px;
- blockquote dùng kiểu trích dẫn của cụm Chiêm tinh hoặc Kinh Dịch nếu có;
- `details` gọn gàng, không tràn ngang.

## Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua (`than-so-hoc.test.mjs` có 12 test).
- Dev trả 200 cho:
  - `/than-so-hoc`;
  - 12 trang số chủ đạo;
  - 9 trang năm cá nhân;
  - `/than-so-hoc/bieu-do-ngay-sinh?ngay=1990-08-15` và `?ngay=1985-10-13` (ngày 13: có khối nợ nghiệp).
- Đối chiếu với kho:
  - Trang số chủ đạo 7 có "Phân tích sâu, tìm kiếm chân lý, thiên về tâm linh/tri thức." ở mục Điểm mạnh.
  - Trang số 33 có 10 đoạn "nói chung" và không có đoạn "riêng".
  - Trang số 1 có 3 đoạn "riêng" và không có mục "nói chung".
- Mọi khối ý nghĩa có dòng "Dữ liệu: Nhật Nguyệt (nhatnguyet.org)". Không có câu tiếng Anh nào bị dịch.
- Bundle client của `/than-so-hoc/theo-ten` không chứa chữ "Cheasley" (tức JSON không bị kéo vào client). Kiểm bằng cách tìm chữ này trong `.next/static` sau `next build`, hoặc ghi rõ trong báo cáo là đã kiểm theo import.
- 0 lỗi console; không tràn ngang ở 375 px; không liên kết 404.
- Chụp ở 1366 và 375, lưu `docs/v2/bang-chung/ck-tsh-yn-*.png`: số chủ đạo 7, năm cá nhân 1, biểu đồ ngày 13/10/1985.
- Báo cáo theo mẫu Lệnh 25.

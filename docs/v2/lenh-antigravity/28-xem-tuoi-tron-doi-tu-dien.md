# Lệnh 28: Xem tuổi, Tử vi trọn đời, từ điển cung và chính tinh (F4)

Người giao: Claude Code, 22/11/2026. Người làm: Antigravity.
Báo cáo ghi vào `docs/v2/lenh-antigravity/28-bao-cao.md`.

**Làm sau khi Lệnh 27 đã nghiệm thu.** Ràng buộc như Lệnh 25:
- khung `(v2)`, CSS `ck-`;
- không bịa nội dung;
- chỉ đặt liên kết tới `trangDaDung()`;
- không cài gói, không commit.

Khung từ điển (dữ liệu tính được, diễn giải đã duyệt hoặc chỗ giữ cùng noindex, khối liên quan) giống Lệnh 27.

## Đọc trước

- `docs/v2/16-seo-trang.csv`, các dòng `XT*`, `XONGDAT`, `TUVI-TRONDOI`, `TUVI-CUNG*`, `TUVI-SAO*`, `TUVI-CHINHTINH`.
- Phần lõi của Claude Code (chỉ đọc; test nằm trong `tests/trang/`):
  - `src/lib/trang/xem-tuoi.ts`
    - `xemTuoiVoChong(namChong, namVo)`: trả 4 tiêu chí `{ ma, ten, muc: 'tot'|'binh'|'xau', giaiThich }` và `dem`. Năm hợp lệ từ 1930 đến 2010.
    - `goiYXongDat(namChu, namTet)`: trả `chu`, `namTet` và `ungVien[]`. Mỗi ứng viên có `nam`, `canChi`, `napAm`, `tuoiAm` và tiêu chí.
  - `src/lib/trang/la-so.ts`: kết quả `/api/v2/la-so` có thêm `daiVan[]`, gồm:
    - `tuTuoi`, `denTuoi`, `tuNam`, `denNam`;
    - `tenCung`, `canChi`, `chinhTinh[]`, `dangChay`.
  - `src/lib/trang/tu-vi-tu-dien.ts`
    - `CUNG_TU_VI` (12 cung) và `cungTheoSlug`.
    - `CHINH_TINH` (14 sao) và `chinhTinhTheoSlug`. Mỗi sao có `hanh` và `dacTinh` theo 12 chi (Miếu, Vượng, Đắc, Bình hòa, Hãm), kèm `mieuVuong[]` và `ham[]`.
  - `src/lib/trang/lich.ts`: dùng `tetSapToi()` để lấy năm Tết mặc định cho trang xông đất.

## Dùng lại từ Lệnh 27 (commit 0bcb670)

- `KhoiDienGiai` và `NoiDungMd` (`src/components/ck/NoiDungMd.tsx`): hiển thị phần diễn giải, hoặc chỗ giữ khi chưa có bản xuất bản.
- `src/components/ck/tu-dien.css`: khung từ điển. `HuyHieuHanh` và `DanhSachMau` (`TheCanChi.tsx`).
- `canChiHelpers.ts`: màu và chữ Hán của 5 hành.
- Slug con giáp nay lấy thẳng từ `CON_GIAP[i].slug` trong lõi: Tý là `ty`, Tỵ là `ti`.

## Quy định CSS (bổ sung 22/11, sau Lệnh 26)

`src/app/(v2)/ck.css` đã chạm trần 60 KB. **Không thêm CSS vào `ck.css`.**
- CSS riêng của cụm này đặt ở `src/app/(v2)/<cụm>/<cụm>.css`, vẫn dùng tiền tố `ck-`.
- Import tệp đó trong `src/app/(v2)/<cụm>/layout.tsx`. Layout này chỉ trả `children` và import CSS, không thêm khung.
- Tệp cụm không vượt 30 KB.
- Các cụm của lệnh này: `xem-tuoi`, `tu-vi` (dùng `tu-vi/tu-vi.css`), `bat-tu`, `kinh-dich`. Khung từ điển dùng lại `src/components/ck/tu-dien.css` của Lệnh 27.

## 1. Việc cần làm

### 1.1. Hub `/xem-tuoi`

- Thẻ công cụ dẫn tới Vợ chồng và Xông đất.
- Khối `ck-cho-noi-dung` giới thiệu trang.

### 1.2. `/xem-tuoi/vo-chong`

**Form và tham số:**
- Form GET gồm hai `select` (năm sinh chồng, năm sinh vợ; 1930–2010) và một dòng ghi chú: "theo năm âm lịch; sinh trước Tết tính năm trước".
- Trang nhận `?chong=&vo=` và render phía server.
- Khi có tham số: `robots` noindex, canonical về `/xem-tuoi/vo-chong`.

**Kết quả:**
- Hai thẻ người. Mỗi thẻ có can chi, nạp âm và cung phi.
- Bảng 4 tiêu chí. Mỗi dòng có nhãn Tốt / Bình / Xấu, tô màu nhẹ, không dùng màu đỏ chói, kèm câu `giaiThich`.
- Dòng tổng: "Theo 4 tiêu chí truyền thống: X tốt, Y bình, Z xấu".
- Một câu cố định: "Các sách và trường phái có thể khác nhau; kết quả để tham khảo".
- **Không** chấm điểm trên thang 10, **không** kết luận "hợp" hay "không hợp", **không** dùng chữ hù dọa.

**Liên kết:** sang `/sinh-nam/{năm}` của từng người.

### 1.3. `/xem-tuoi/xong-dat`

**Form và tham số:**
- Form GET gồm năm sinh gia chủ (1930–2010). Năm Tết mặc định là `tetSapToi().namAm`.
- Tham số `?chu=&tet=`. Khi có tham số thì noindex và đặt canonical về trang gốc.

**Kết quả:**
- Danh sách ứng viên: tuổi âm, năm sinh, can chi, nạp âm.
- Mỗi ứng viên có 4 tiêu chí, gom trong `<details>`.

**Cố định trên trang:**
- Câu "Không có tuổi nào hợp hoàn toàn với mọi sách" nếu `ungVien` rỗng.
- Phần đầu trang ghi Tết `{canChi}` vào ngày nào, lấy từ `tetSapToi()`. Có link sang `/tet`.

### 1.4. `/tu-vi/tron-doi`

- Dùng lại `FormLaSo` của Lệnh 25 (có thể thêm prop chế độ `tronDoi`).
- Kết quả gồm ba phần:
  - lá số 4×4;
  - **bảng đại vận** 12 dòng: tuổi, năm dương, cung, can chi, chính tinh. Dòng có `dangChay` được nhấn mạnh;
  - dòng thời gian ngang trên desktop, chuyển thành danh sách dọc trên mobile.
- Không có luận giải.

### 1.5. `/tu-vi/cung` và `/tu-vi/cung/[slug]`

- Trang chỉ mục: 12 cung theo thứ tự, mỗi thẻ dẫn tới trang của cung.
- Trang mục:
  - thứ tự, vị trí so với Mệnh (cung thứ mấy, an nghịch);
  - liên kết cung trước và cung sau;
  - phần diễn giải lấy từ `noiDungTheoDuongDan`, nếu chưa có thì hiện chỗ giữ và đặt noindex.
- `generateStaticParams` cho đủ 12 cung.

### 1.6. `/tu-vi/sao` và `/tu-vi/sao/[slug]`

- Trang chỉ mục:
  - 14 chính tinh, tô màu theo hành;
  - **ma trận 14 sao × 12 chi** ghi Miếu, Vượng, Đắc, Bình, Hãm, tô màu theo mức;
  - trên mobile, ma trận cuộn ngang **bên trong khung**, trang không bị cuộn ngang.
- Trang sao:
  - hành;
  - bảng đặc tính theo 12 chi;
  - danh sách "Miếu/Vượng tại", "Hãm tại";
  - diễn giải đã duyệt hoặc chỗ giữ.
- Dòng nguồn: "Bảng miếu hãm theo bộ máy an sao của xemboi (quy tắc theo sách cụ Thiên Lương)".
- `generateStaticParams` cho đủ 14 sao.
- Mẫu SEO là `/tu-vi/sao/{sao}` với khóa `{Tên}`. Mẫu cung là `/tu-vi/cung/{cung}` với khóa `{Tên}`.

### 1.7. Liên kết chéo

- **Trang lá số `/tu-vi/lap-la-so`:** tên mỗi chính tinh trong phần tóm tắt, hoặc danh sách cung dạng chữ, liên kết sang `/tu-vi/sao/{slug}`.
  - Dùng `slugViet` trong `src/lib/trang/can-chi.ts`.
  - Không sửa `LaSo12Cung`. Chỉ thêm liên kết ở phần do `FormLaSo` tự hiện.
- **Menu và trang chủ:** Claude Code tăng `DOT_DA_DUNG` lên 4.

### 1.8. Bát tự: hub `/bat-tu` và `/bat-tu/lap-la-so`

Lõi: `src/lib/trang/bat-tu.ts`.
- `kiemTraDauVao(v)` trả câu lỗi hoặc `null`.
- `lapLaSoBatTu({ ngay, thang, nam, gio, phut?, gioiTinh, doiNgayLuc23?, namXem? })` trả:
  - `tru[4]` (Năm, Tháng, Ngày, Giờ). Mỗi trụ có can, chi, hành, âm dương, nạp âm, `thapThanCan`, `tangCan[]` (kèm thập thần);
  - `nhatChu`, `demNguHanh`, `thieuHanh`;
  - `tiet.truoc/sau`;
  - `daiVan { chieu, khoiVan, ds[8] }`;
  - `quyUoc[]`.

**Trang `/bat-tu/lap-la-so`:**
- Form GET: ngày, tháng, năm (1900–2100), giờ, phút, giới tính, ô "sinh 23:00–23:59 tính sang ngày sau" (mặc định bật).
- Trang render phía server từ `searchParams`. Có tham số thì noindex và đặt canonical về trang gốc.
- Kết quả là **bảng tứ trụ kiểu truyền thống**: 4 cột theo thứ tự Giờ, Ngày, Tháng, Năm (từ phải sang trái như sách, hoặc trái sang phải nhưng ghi rõ). Các hàng:
  - thập thần;
  - thiên can, tô màu hành;
  - địa chi, tô màu hành;
  - tàng can kèm thập thần;
  - nạp âm.
- Thanh đếm ngũ hành 8 chữ. Có dòng "Thiếu hành: …" nếu có.
- Bảng đại vận 8 bước: tuổi, năm, can chi. Bước `dangChay` được nhấn mạnh.
- Dòng "Khởi vận lúc X tuổi Y tháng, đi thuận/nghịch".
- Danh sách `quyUoc` đặt trong `<details>` "Cách tính".
- **Không** luận giải vượng suy, dụng thần, tính cách. Thay vào đó là khối chỗ giữ "Phần luận giải đang biên tập".

**Hub `/bat-tu`:** form ngắn, khối giới thiệu `ck-cho-noi-dung`, link sang lập lá số.

### 1.9. Kinh Dịch: `/kinh-dich/gieo-que` (thay `/boi-dich` v1)

Lõi: `src/lib/trang/kinh-dich.ts`.
- `QUE_64` (thứ tự Văn Vương). Mỗi quẻ có `so`, `ten` ("Địa Thiên Thái"), `slug` ("11-dia-thien-thai"), `thuong`, `ha`, `hao[6]` từ dưới lên.
- `gieoDongXu(giaTri?)`: 6 giá trị 6/7/8/9. Tự ngẫu nhiên nếu không truyền.
- `queMaiHoaTheoThoiGian(chiNam, thangAm, ngayAm, chiGio)` (chỉ số chi 0 = Tý).
- Kết quả gồm `queChu`, `queBien`, `queHo`, `haoDong[]`, `moTa[]`.

**Trang, hai cách:**
1. **Gieo đồng xu.**
   - Nút "Gieo" (client) sinh 6 giá trị rồi điều hướng tới `?xu=9,7,8,8,7,6`. Trang server đọc tham số đó và gọi `gieoDongXu(...)`, nhờ vậy link chia sẻ được.
   - Người tự gieo xu thật có thể nhập tay 6 lần (chọn số ngửa 0–3 mỗi lần).
2. **Mai Hoa theo giờ hiện tại.** Gọi `queMaiHoaHienTai()` (trả thêm `thoiDiem` để hiện).
   - Hiện `moTa` để người xem thấy cách tính.

**Hiển thị:**
- Vẽ quẻ bằng 6 vạch: vạch liền (dương) và vạch đứt (âm). Hào động có dấu.
- Ba quẻ đặt cạnh nhau: chủ, hỗ, biến.
- Tên quẻ dẫn tới `/kinh-dich/que/{slug}` **chỉ khi** `trangDaDung()` có trang đó. F4 chưa dựng trang quẻ, nên chỉ hiện tên.

**Ràng buộc:**
- Không lời đoán cát hung, không lời khuyên. Thay bằng chỗ giữ "Lời quẻ đang biên tập".
- Trang có tham số thì noindex.

## 2. Nghiệm thu

- tsc 0 lỗi; `tests/trang/*` qua.
- Kiểm trên dev, yêu cầu 0 lỗi console và không có link 404:
  - `/xem-tuoi`
  - `/xem-tuoi/vo-chong?chong=1990&vo=1992`: phải ra chồng Canh Ngọ (Khảm), vợ Nhâm Thân (Đoài), cung phi "Họa hại".
  - `/xem-tuoi/xong-dat?chu=1985`
  - `/tu-vi/tron-doi`: lập 15/8/1990, 10 giờ, nam. Có 12 dòng đại vận và đúng 1 dòng đang chạy.
  - `/tu-vi/cung`, `/tu-vi/cung/menh`
  - `/tu-vi/sao`, `/tu-vi/sao/tu-vi`: Tử Vi hành Thổ, Miếu tại Dần.
  - `/bat-tu/lap-la-so?ngay=1&thang=1&nam=2000&gio=12&phut=0&gioiTinh=nam`: tứ trụ Kỷ Mão, Bính Tý, Mậu Ngọ, Mậu Ngọ; đại vận 1 là Ất Hợi, đi nghịch.
  - `/kinh-dich/gieo-que?xu=7,7,7,8,8,8`: ra Địa Thiên Thái, không có quẻ biến, quẻ hỗ Lôi Trạch Quy Muội.
- Trang có tham số và trang chưa có diễn giải: kiểm noindex trong HTML.
- Ảnh 1366 và 375 lưu `docs/v2/bang-chung/ck-f4-*.png`. Báo cáo theo mẫu Lệnh 25.

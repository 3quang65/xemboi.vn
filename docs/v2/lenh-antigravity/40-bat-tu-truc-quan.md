# Lệnh 40: Thành phần trực quan dùng chung + làm lại kết quả Bát tự

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity. Báo cáo ghi vào `docs/v2/lenh-antigravity/40-bao-cao.md`, theo mẫu Lệnh 25, **kèm ảnh 375px và 1366px** của ca mẫu.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md` (chuẩn 10 điều, bắt buộc);
- `docs/v2/21-hoc-giao-dien-4-repo.md` mục 1.1–1.3.

**Ảnh tham khảo** (`docs/v2/thiet-ke/tham-khao-4-repo/`):
- `fengshui-bazi-chart.png` là ảnh quan trọng nhất. Lá số trong ảnh chính là ca mẫu bên dưới, nên kết quả của mình phải ra cùng các quan hệ đó.
- `xemboi-hien-tai-*.jpg`: ảnh trang hiện tại.
- Ảnh đối thủ bát tự trong `docs/v2/thiet-ke/doi-thu/` (tệp `bat-tu-thi-truong.md` và ảnh kèm, nếu đã có).

**Ràng buộc như Lệnh 36–39:**
- CSS chỉ dùng lớp `ck-`; mỗi cụm CSS ≤ 30 KB;
- không bịa nội dung, không tự dịch câu Hán, không tự luận giải;
- không cài gói, không commit.

**Không sửa:**
- `src/lib/**`, `src/app/api/**`, `prisma`, `scripts`, `src/middleware.ts`, `src/app/layout.tsx`, `quan-tri`, `components/r1`;
- `ck.css`, `ck-nen.css`, `DauTrang.tsx`, `tests/**`.

## Vì sao

Anh Cường chê các trang kết quả "thuần túy show dữ liệu". Trang bát tự hiện là 3 thẻ, rồi bảng, 5 thanh mảnh và bảng đại vận. Người mới không biết nhìn vào đâu. Lệnh này làm hai việc:
1. tạo bộ thành phần dùng chung cho mọi công cụ sau này;
2. làm trang bát tự thành mẫu đầu tiên.

## Ca mẫu (dùng để kiểm và chụp ảnh)

`/bat-tu/lap-la-so?ngay=1&thang=6&nam=1990&gio=8&phut=30&gioiTinh=nu`

**Kết quả đúng:**
- Trụ: năm Canh Ngọ, tháng Tân Tỵ, ngày **Đinh Dậu** (nhật chủ Đinh Hỏa), giờ Giáp Thìn.
- Quan hệ: đúng 2 mục:
  - **lục hợp Dậu–Thìn** (trụ ngày, trụ giờ);
  - **tam hợp Kim cục thiếu Sửu** (Tỵ ở trụ tháng, Dậu ở trụ ngày).
- Ảnh fengshui.skill cũng ra đúng hai quan hệ này (六合 và 缺丑).

**Ca thứ hai, đủ cả 5 nhóm nét:** `?ngay=19&thang=4&nam=1975&gio=2&phut=0&gioiTinh=nam`
- Trụ: Ất Mão, Canh Thìn, Ất Mùi, Đinh Sửu.
- 6 quan hệ:
  - can hợp Ất–Canh (năm–tháng) và Canh–Ất (tháng–ngày): một can hợp với hai can, cả hai cung phải hiện;
  - tam hợp Mộc thiếu Hợi (Mão năm, Mùi ngày);
  - xung Mùi–Sửu và hình Mùi–Sửu: **cùng một cặp trụ ngày–giờ**, hai cung phải tách nhau (một cao một thấp, hoặc lệch nhau), không đè lên nhau;
  - hại Mão–Thìn (năm–tháng).

## Dữ liệu (đã có, chỉ đọc)

**`src/lib/trang/bat-tu.ts`:** `lapLaSoBatTu()` như cũ.

**`src/lib/trang/bat-tu-truc-quan.ts`** (mới, có test):
- `quanHeTru(laSo)` trả `QuanHeTru[]`. Mỗi mục có:
  - `loai`, `nhom` (`'hop' | 'chua-thanh' | 'xung' | 'hinh' | 'hai'`), `ten`;
  - `hang` (`'can' | 'chi'`);
  - `tru` (chỉ số 0 năm, 1 tháng, 2 ngày, 3 giờ, tăng dần);
  - `chu`, `hanh?`, `thieu?`;
  - `moTa` (câu in nguyên văn);
  - `trich` (mảng khóa của `TRICH_BAT_TU`).
- `docNhanh(laSo, quanHe)` trả `{ cau, the[] }`. Mỗi thẻ: `{ ma, nhan, giaTri, hanh?, chiTiet, trich? }`.
- `TRICH_BAT_TU[khoa]` trả `{ nguon, doanId, viTri, nguyenVan }`. `NGUON_BAT_TU[nguon]` trả `{ tenGoc, tenHanViet, tacGia, nienDai, ghiCong, url }`. Nguyên văn in **nguyên chữ Hán**, không dịch. Dấu "…" trong `nguyenVan` là chỗ lược, in như vậy.
- `GIAI_NGHIA_BAT_TU[thuật ngữ]`: nghĩa ngắn cho popover. `nghiaThapThan(t)`.
- `TEN_NHOM_QUAN_HE`, `TEN_LOAI_QUAN_HE`.

**Chữ Hán cho can chi:** `CHI_HAN` trong `components/ck/canChiHelpers.ts`. Không có `CAN_HAN` thì thêm vào `canChiHelpers.ts` (thư mục `components/ck`, được sửa): 甲乙丙丁戊己庚辛壬癸.

## 40.1. Thành phần dùng chung: `src/components/ck/truc-quan/`

Mọi thành phần là server component (không `'use client'`) và chạy được khi tắt JS. CSS chung để ở `src/components/ck/truc-quan/truc-quan.css`, import trong từng thành phần.

1. **Token màu nhạt** trong `truc-quan.css`, trên `.ck`:
   - `--ck-moc-nhat`, `--ck-hoa-nhat`, `--ck-tho-nhat`, `--ck-kim-nhat`, `--ck-thuy-nhat`;
   - làm bằng `color-mix(in srgb, var(--ck-moc) 12%, #fffaf0)` hoặc giá trị tương đương, có phương án dự phòng hex.
2. **`DocNhanh`** `{ cau, the, tieuDe? = 'Đọc nhanh' }`:
   - câu tóm tắt chữ to (≈ 20px, đậm vừa), như một lời dẫn;
   - lưới thẻ: 1 cột ở 375px, 2 cột ở 768px, 3 cột ở 1366px;
   - mỗi thẻ: nhãn nhỏ viết hoa, `giaTri` chữ serif lớn tô màu `hanh` (nếu có), nền `--ck-<hanh>-nhat`, 1–2 dòng `chiTiet`;
   - nếu thẻ có `trich` thì thêm `<details>` nhỏ "Sách ghi" chứa `TrichNguyenVan`.
3. **`ThuatNgu`** `{ ten, nghia, id }`:
   - chữ có gạch chân chấm, dạng `<button type="button" popovertarget={id}>`;
   - hộp `<div popover id={id}>` có tên thuật ngữ, nghĩa ngắn và nút đóng;
   - `id` do trang truyền vào, phải duy nhất trong trang;
   - trình duyệt không hỗ trợ popover thì chữ vẫn đọc được.
4. **`ChuGiaiHanh`**: hàng 5 chấm màu kèm tên hành.
5. **`TrichNguyenVan`** `{ trich, nguon }`:
   - khối trích, chữ Hán cỡ lớn hơn chữ thường một chút;
   - dòng nguồn: *Tam mệnh thông hội* (三命通會), Vạn Dân Anh, Minh, 卷二 · 論支元六合 · đoạn 4338. Văn bản: Kanripo, CC BY-SA 4.0 (có link).

## 40.2. Trang `/bat-tu/lap-la-so`: phần kết quả theo thứ tự mới

Form giữ nguyên. Sau khi có `ketQua`:

**A. Đọc nhanh.** Dùng `DocNhanh` với `docNhanh(ketQua, quanHe)`. Thay cho 3 thẻ cũ: ngày sinh và tiết khí đã nằm trong thẻ của lib. Ngày giờ sinh đã nhập in thành một dòng nhỏ phía trên câu.

**B. Tứ trụ dạng thẻ chữ lớn**, thay bảng làm phần chính.
- 4 cột theo thứ tự truyền thống, trái sang phải: **Giờ, Ngày, Tháng, Năm**. Giữ chú thích "đọc từ phải sang trái".
- Mỗi cột từ trên xuống:
  - tên trụ;
  - thập thần của can, bọc bằng `ThuatNgu` (nghĩa lấy từ `nghiaThapThan`);
  - **can** chữ serif ≥ 44px ở 1366px (≥ 30px ở 375px), tô màu hành, chữ Hán nhỏ bên cạnh hoặc bên dưới;
  - **chi**, cùng cỡ chữ, tô màu hành, có chữ Hán;
  - tàng can là các viên nhỏ, mỗi viên tô màu hành kèm thập thần;
  - nạp âm.
- Cột **Ngày** có khung nổi (viền son 2px, nền `--ck-the-nen` đậm hơn) và nhãn "Nhật chủ".
- Thẻ cột có nền nhạt theo hành của **chi**. Không dùng nền đỏ.
- **Vẽ quan hệ** bằng SVG đặt dưới hàng chi; quan hệ `hang === 'can'` vẽ phía trên hàng can.
  - Mỗi quan hệ là một cung nối tâm các cột trong `tru`. Ba trụ thì nối liền ba điểm.
  - Cung xa (năm–giờ) cao hơn cung gần, để các cung không đè nhau.
  - Giữa cung có viên nhãn ngắn: "Lục hợp", "Tam hợp Kim", "Thiếu Sửu", "Xung", "Hình", "Hại".
  - Kiểu nét theo `nhom`, phải phân biệt được khi xem ảnh xám:

    | Nhóm | Nét | Màu |
    |---|---|---|
    | `hop` | liền 2px | `--ck-moc` |
    | `chua-thanh` | chấm thưa 2px | xám |
    | `xung` | gạch dài | hổ phách `#B7791F` |
    | `hinh` | chấm dày | nâu |
    | `hai` | gạch-chấm | tím xám |

  - Chú giải kiểu nét đặt ngay dưới hình.
  - SVG dùng `viewBox` theo 4 cột và co theo bề rộng. Dùng `vector-effect: non-scaling-stroke` để nét không phình.
- **Bảng chi tiết** (bảng cũ, giữ nguyên nội dung) chuyển vào `<details>` có tiêu đề "Xem dạng bảng".

**C. Quan hệ giữa các trụ** (mục riêng ngay dưới hình):
- Danh sách `quanHe`. Mỗi dòng có:
  - viên nhãn nhóm (màu và kiểu viền giống nét trên hình);
  - `ten`, tên thuật ngữ bọc `ThuatNgu`, nghĩa lấy từ `GIAI_NGHIA_BAT_TU[ten]`;
  - `moTa`;
  - `<details>` "Sách ghi" chứa các `TrichNguyenVan` theo `trich`.
- Không có quan hệ nào thì in câu của thẻ `quan-he`.
- Có xung hoặc hình thì in `TrichNguyenVan` của `xungKhongVoiDoan` hoặc `hinhKhongVoiDoan` ngay dưới danh sách, không gập. Đây là câu sách nói không vội luận là dữ.

**D. Ngũ hành:**
- 5 cột đứng hoặc 5 thanh dày (≥ 14px): số lớn trên đầu, nền `--ck-<hanh>-nhat`, phần đầy màu hành đậm.
- Hành bằng 0 vẽ khung gạch đứt, ghi "0, chưa có".
- Thêm `ChuGiaiHanh` và dòng "Đếm 8 chữ can chi, chưa tính tàng can" (in nguyên câu này).

**E. Đại vận:**
- Dải thẻ cuộn ngang, có `scroll-snap`.
- Mỗi thẻ: "Vận n", can chi 2 chữ lớn tô màu hành (can theo `hanhCan`, chi theo `hanhChi`), "x–y tuổi", "năm a–b".
- Thẻ `dangChay` có khung son và nhãn **"Đang chạy"**. Thẻ đã qua nhạt hơn một chút.
- Ở 1366px, 8 thẻ hiện đủ không cần cuộn nếu vừa.
- Câu "Khởi vận… đi thuận/nghịch" giữ nguyên.
- Bảng đại vận cũ bỏ (thông tin đã có trên thẻ).
- Được phép thêm một client component rất nhỏ để cuộn thẻ đang chạy vào giữa khi tải trang. Có `prefers-reduced-motion` thì không cuộn mượt.

**F.** "Cách tính" và chỗ "Luận giải" giữ như cũ.

## 40.3. Thuật ngữ bấm được

Bọc bằng `ThuatNgu`, nghĩa lấy từ `GIAI_NGHIA_BAT_TU`, ít nhất ở các chỗ:
- tiêu đề hoặc nhãn: Nhật chủ, Thập thần, Tàng can, Nạp âm, Lệnh tháng, Đại vận;
- mọi tên thập thần trong 4 cột;
- mọi tên quan hệ ở mục C.

## 40.4. Nghiệm thu (ghi kết quả vào báo cáo)

1. Ca mẫu ra đúng trụ, đúng 2 quan hệ, đúng câu Đọc nhanh (in nguyên `cau` của lib).
2. Ảnh 375px, 768px, 1366px:
   - không cuộn ngang ngoài dải đại vận;
   - chữ can chi đạt cỡ ở 40.2.B;
   - vùng bấm ≥ 44px.
3. Ảnh xám (`filter: grayscale(1)` qua devtools) của hình quan hệ ca thứ hai: vẫn phân biệt được các kiểu nét.
4. Tắt JS: trang vẫn đọc đủ nội dung; popover và `<details>` không làm mất chữ.
5. `bat-tu.css` và `truc-quan.css` mỗi tệp ≤ 30 KB.
6. `npx tsc --noEmit -p .` sạch.
7. Không chạy `next build` (nó đè `.next` của dev server). Nếu buộc phải chạy thì ghi vào báo cáo.

## Học từ thị trường

Đã khảo sát 6 công cụ với cùng ca mẫu 1: tuvi.vn, bazi-calculator.com/vi, china95.net, mingli.ru, miniwebtool.com/vi, masterseanchan.com/vi. Báo cáo đầy đủ ở `docs/v2/thiet-ke/doi-thu/bat-tu-thi-truong.md`.

**Số liệu.**
- Cả 6 ra cùng 4 trụ với engine của mình.
- Khởi vận: china95 05/03/1999, tuvi.vn 03/03/1999, miniwebtool 8 năm 9 tháng. Mình ra 8 năm 9 tháng, khoảng 3/1999. Khớp.
- Các trang lệch nhau ở cách đếm ngũ hành và ở dụng thần: hai trang ra hai kết luận trái ngược. Mình **không** hiện dụng thần; giữ như vậy.

**Áp vào 40.2. Bắt buộc, phần nào đã làm thì giữ.**
1. **Đầu khối A, mẫu miniwebtool:** một dòng 8 chữ Hán to (Canh Ngọ, Tân Tỵ, Đinh Dậu, Giáp Thìn) và tên Việt dưới mỗi chữ, đặt trên câu `cau`.
2. **Thẻ trụ (B):**
   - thẻ Ngày có nhãn nhỏ **"Bạn"** cạnh "Nhật chủ";
   - thập thần của can là pill nhỏ;
   - tàng can ghi kèm thập thần (dữ liệu `tangCan[].thapThan` có sẵn);
   - nạp âm ghi đúng chuỗi `napAm` của lib, không tự sửa.
3. **Hình quan hệ ở 375px:**
   - nếu các cung đè nhau quá 2 tầng, được phép đổi sang **hàng chip** dưới 4 thẻ;
   - mỗi chip ghi "Lục hợp · Ngày–Giờ · Dậu Thìn", viền theo kiểu nét của nhóm;
   - ở ≥ 768px vẫn vẽ cung.
4. **Ngũ hành (D):**
   - mỗi thanh ghi số và % (trên 8 chữ);
   - tag "Nhật chủ" trên hành của nhật chủ, tag "Khuyết" cho hành 0;
   - một dòng chữ nhỏ: "Đếm 8 chữ lộ (4 can, 4 chi), chưa tính tàng can."
   - Không thêm trọng số tàng can: chưa có nguồn cho trọng số.
5. **Đại vận (E):**
   - ngay trên dải thẻ in câu `giaoVan(laSo).cau`. Hàm mới trong `bat-tu-truc-quan.ts`, đã có test.
   - Mỗi thẻ ghi **năm** to ("1999–2008"), tuổi mụ nhỏ bên dưới ("10–19 tuổi mụ").
   - Không ghi "tuổi" trơn: tuvi.vn bị lẫn đúng chỗ này.
6. **Khối "Cách tính" (`<details>` cuối trang):**
   - in nguyên `laSo.quyUoc`;
   - thêm tiết trước/sau (`laSo.tiet`) và tháng lệnh (chi tháng).
   - Mẫu: mingli và tuvi.vn. Thông tin này giúp người dùng tự so với trang khác.
7. **Màu:**
   - dùng token `--ck-<hanh>` sẵn có. Đã đo tương phản trên nền giấy: Kim 5,35, Mộc 5,41, Thủy 12,8, Hỏa 5,42, Thổ 5,35, đều ≥ 4,5.
   - Không dùng #999 hay vàng nhạt cho chữ (lỗi của tuvi.vn).
8. **Sạch sẽ:**
   - không popup, không quảng cáo xen lá số;
   - 100% tiếng Việt, không sót nhãn tiếng Anh (lỗi của miniwebtool bản Việt).

**Để sau (không làm trong lệnh này):**
- bấm lưu niên để phủ lên lá số (masterseanchan);
- lập tam trụ khi không rõ giờ;
- hiệu chỉnh giờ mặt trời.

Em sẽ chuẩn bị dữ liệu rồi giao thành lệnh riêng.

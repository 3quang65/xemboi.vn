# Lệnh 42: Thần số học, hướng nhà, cửu tinh trực quan

Người giao: Claude Code, 24/11/2026. Người làm: Antigravity.

**Thứ tự:** làm sau Lệnh 41 (hoặc ngay sau Lệnh 40 nếu Lệnh 41 đang chờ duyệt). Báo cáo ghi vào `docs/v2/lenh-antigravity/42-bao-cao.md` theo mẫu Lệnh 25, kèm ảnh 375px và 1366px.

**Đọc trước:**
- `docs/v2/22-chuan-truc-quan.md` (bắt buộc, nhất là bảng 10 điểm);
- `docs/v2/thiet-ke/doi-thu/than-so-huong-nha-cuu-tinh-thi-truong.md` (nếu đã có lúc làm: áp các điểm hợp lý, không trái ràng buộc);
- ảnh tham khảo trong `docs/v2/thiet-ke/tham-khao-4-repo/`:
  - `nhatnguyet-huong-nha.png`, `nhatnguyet-cung-menh.png`;
  - `fengshui-feixing-cast.gif`;
  - `xemboi-hien-tai-cuu-tinh.jpg`, `xemboi-hien-tai-bieu-do-ngay-sinh.jpg`.

**Dùng lại thành phần Lệnh 40:** `components/ck/truc-quan/` (`DocNhanh`, `ThuatNgu`, `TrichNguyenVan`, `truc-quan.css`). Không viết lại.

**Ràng buộc** như Lệnh 40:
- không sửa `src/lib/**`, `prisma`, `tests/**`, `ck.css`, `ck-nen.css`, `DauTrang.tsx`, `layout.tsx`, `src/app/api/**`;
- không cài gói; không commit; không chạy `next build`;
- CSS mỗi cụm ≤ 30 KB;
- không dùng "hóa giải / vật phẩm / sát khí / cải vận"; không đỏ cho "không cát" (dùng hổ phách `#B7791F`);
- không tự viết lời luận: chỉ in chuỗi lib trả về.

## Dữ liệu (đã có, chỉ đọc): `src/lib/trang/phan-truc-quan.ts` (test: `tests/trang/phan-truc-quan.test.mjs`)

Cả ba hàm `docNhanh*` trả `{ cau, the[] }`. Mỗi thẻ có `{ ma, nhan, giaTri, hanh?, muc?, chiTiet }`; tô màu theo `hanh` nếu có, không thì theo `muc` (giống Lệnh 41).

| Công cụ | Hàm | Ghi chú |
|---|---|---|
| Thần số học | `docNhanhThanSo(ngaySinh, namXet)` | Trả thêm `dinhCao` (4 chặng) và `chiSoDinhHienTai` (0..3). |
| Hướng nhà | `docNhanhHuongNha(nam, gioiTinh, doHuong?)` | Có `doHuong` thì thêm 3 thẻ: hướng, nhóm trạch, du niên của hướng. |
| La bàn | `laBanCaNhan(cungPhi?, doHuong?)` | Xem chi tiết dưới bảng. |
| Cửu tinh | `docNhanhCuuTinh(nam, luc?)` | Thẻ tháng chỉ có khi đang ở trong năm xét. |
| Lưới cửu tinh | `VI_TRI_LUOI_CUU_TINH`, `duongBay(ban)` | Xem chi tiết dưới bảng. |

`laBanCaNhan(cungPhi?, doHuong?)` trả:
- `son[24]`, mỗi ô `{ son, goc, cung, duNien?, laHuong, laToa }`. `goc` là độ giữa sơn: 0 = Bắc, theo chiều kim đồng hồ.
- `quai[8]`, mỗi quái `{ cung, tu, den, goc, duNien? }`.

`VI_TRI_LUOI_CUU_TINH` cho ô `[hàng, cột]` của từng cung, Nam ở trên.

`duongBay(ban)` trả 9 bước theo thứ tự sao bay, mỗi bước `{ so, cung, o: [hàng, cột] }`.

Dữ liệu cũ vẫn dùng như hiện nay: `than-so-hoc.ts`, `phong-thuy.ts`, `cuu-tinh.ts`.

## 42.1. Thần số học

**Trang:** `/than-so-hoc/bieu-do-ngay-sinh`, `/than-so-hoc/so-chu-dao`, `/than-so-hoc/nam-ca-nhan/[so]`.

Khi đã nhập ngày sinh:

1. **Đọc nhanh:** `DocNhanh` với `docNhanhThanSo(d, năm hiện tại VN)`, đặt ngay dưới tiêu đề kết quả.
2. **Số chủ đạo:** một vòng tròn lớn (≥ 96px ở 375px). Số ở giữa, cỡ ≥ 48px. Dưới vòng là phép cộng thu gọn. Số 11, 22, 33 thêm viền đôi.
3. **Dòng thời gian 4 đỉnh cao:**
   - một thanh ngang chia 4 đoạn theo khoảng tuổi; đoạn cuối "từ X tuổi" vẽ mờ dần sang phải;
   - mỗi đoạn ghi số đỉnh cao to, khoảng tuổi nhỏ;
   - đoạn `chiSoDinhHienTai` tô nền nhấn, kèm nhãn "Đang ở đây" và một vạch đứng tại tuổi hiện tại;
   - ở 375px, thanh chuyển thành 4 thẻ xếp dọc, giữ vạch "Đang ở đây".
4. **Lưới ngày sinh 3×3:**
   - giữ bố cục số hiện có;
   - ô có số: nền đậm, ghi đủ số lần lặp (vd "11");
   - ô thiếu: nền giấy, viền đứt, chữ số mờ 40%;
   - đường đủ hoặc đường trống (`duongDay` / `duongTrong` của `bieuDoNgaySinh`) vẽ thành vạch mảnh xuyên 3 ô: đủ là nét liền `--ck-moc`, trống là nét đứt hổ phách;
   - bấm vạch mở `<details>` tên đường, lấy từ dữ liệu sẵn có.
5. Thuật ngữ "đỉnh cao", "năm cá nhân", "số chủ đạo" dùng `ThuatNgu`, nội dung lấy từ phần giải nghĩa có sẵn trên trang.

## 42.2. Hướng nhà, bát trạch

**Trang:** `/phong-thuy/huong-nha` (query: `nam`, `gt`, `do`). `/phong-thuy/cung-phi/[cung]` dùng lại cùng la bàn, không có hướng.

1. **Đọc nhanh:** `docNhanhHuongNha(nam, gt, do?)`.
2. **La bàn cá nhân** (`components/ck/truc-quan/LaBan.tsx`, SVG server component, nhận `LaBanCaNhan`). Ba vòng, từ trong ra:
   - **Vòng trong, 8 quái:** ký hiệu quẻ và tên.
   - **Vòng giữa, du niên của 8 phương với cung phi:**
     - cát: nền `--ck-moc-nhat`, chữ `--ck-moc`;
     - không cát: nền hổ phách rất nhạt, chữ hổ phách.
     - Ghi tên du niên ngắn (Sinh khí, Thiên y, …).
   - **Vòng ngoài, 24 sơn:** chữ nhỏ, mỗi sơn chiếm 15°.
3. **Hướng và tọa:**
   - Có `do`: vẽ mũi tên từ tâm tới sơn `laHuong` (màu son, đầu mũi tên rõ), và đoạn ngắn về sơn `laToa` (nét đứt);
   - ghi "Hướng 135°" ở đầu mũi tên.
4. **Quy ước vẽ:**
   - Bắc ở **trên** như la bàn thường. Ghi chú nhỏ "Bắc ở trên" và chữ B/Đ/N/T ngoài vòng.
   - Không xoay động (tránh chóng mặt). Có `prefers-reduced-motion` thì càng không.
5. **Cỡ và thao tác:**
   - ở 375px la bàn rộng 100% (tối thiểu 320px), chữ 24 sơn ≥ 10px;
   - bấm một quái mở `<details>` bên dưới, gồm du niên, sao, Hán tự (dữ liệu `DuNien`).
6. Bảng 8 phương hiện có chuyển vào `<details>` "Xem dạng bảng".
7. **`/phong-thuy/bat-trach`:** thêm một la bàn mẫu không có cung phi (chỉ 24 sơn và 8 quái) minh họa cách chia phương.

## 42.3. Cửu tinh

**Trang:** `/phong-thuy/cuu-tinh` và `/phong-thuy/cuu-tinh/[nam]`.

1. **Đọc nhanh:** `docNhanhCuuTinh(nam)`.
2. **Lưới 3×3:**
   - đặt theo `VI_TRI_LUOI_CUU_TINH`, Nam ở trên như hiện nay;
   - quanh lưới có vành ghi 8 phương (Nam trên, Bắc dưới, Đông trái, Tây phải) để người quen la bàn Bắc-trên không lẫn;
   - mỗi ô: số sao to, tên sao, màu theo `hanh` của sao (nền `-nhat`, chữ đậm);
   - ô Ngũ hoàng có viền hổ phách và nhãn nhỏ "Ngũ hoàng".
3. **"Xem sao bay":**
   - nút bật hoạt cảnh: một chấm đi lần lượt qua 9 ô theo `duongBay(ban)`, mỗi bước khoảng 0,6 giây, vẽ dần đường nối;
   - làm bằng CSS hoặc SVG animation, không thêm thư viện;
   - tôn trọng `prefers-reduced-motion`: chỉ vẽ sẵn đường nối có đánh số bước, không chuyển động;
   - không bật JS thì vẫn thấy đường nối tĩnh trong `<details>`.
4. **Lớp năm / tháng:**
   - nút phân đoạn "Năm" / "Tháng …" là link `?lop=thang&thang=N`. Mặc định là năm.
   - Lớp tháng dùng `cuuTinhNam(nam).thang[N-1].ban`; ghi tiết bắt đầu tháng.
   - Trang có tham số đặt `noindex`, canonical giữ nguyên.
5. Bảng 9 sao hiện có giữ nguyên, đặt dưới.

## 42.4. Nghiệm thu (ghi vào báo cáo)

1. **Thần số, 01/06/1990, năm 2026:**
   - Đọc nhanh bắt đầu "Số chủ đạo 8; năm 2026 là năm cá nhân 8;";
   - "Đang ở đây" đúng đoạn `chiSoDinhHienTai`;
   - lưới làm mờ đúng các số thiếu.
2. **Hướng nhà, nữ 1990, `do=135`:**
   - mũi tên chỉ đúng sơn `xetHuong(135).sonHuong`;
   - 4 ô cát của vòng giữa khớp `batPhuong(cung phi)`.
   - Ghi cung phi và 4 phương cát vào báo cáo.
3. **Cửu tinh 2027:** trung cung 9, Ngũ hoàng ở ô Khảm (Bắc). Năm 2031: sao 5 vào trung cung, nhãn "Ngũ hoàng" nằm ở ô giữa. Chụp thêm một lớp tháng.
4. **Ảnh 375px:** không cuộn ngang; vùng bấm ≥ 44px; chữ 24 sơn đọc được.
5. **Ảnh xám:** phân biệt được cát/không cát trên la bàn (có ký hiệu hoặc kiểu viền, không chỉ khác màu).
6. **Kiểm tra cuối:** tắt JS vẫn đọc đủ; `tsc` sạch; CSS mỗi cụm ≤ 30 KB.

## Học từ thị trường (bắt buộc áp)

Báo cáo đầy đủ: `docs/v2/thiet-ke/doi-thu/than-so-huong-nha-cuu-tinh-thi-truong.md`. Đã khảo sát 13 công cụ.

**Số liệu.**
- Thần số học: số chủ đạo, năm cá nhân và 4 đỉnh cao khớp engine ở mọi nơi.
- Bát trạch: cung phi nữ 1990 là Cấn ở mọi nơi. menh.guru đảo phương Đông/Nam; 3 công cụ còn lại khớp engine.
- Cửu tinh 2027: 5/5 nơi khớp đủ 9 ô.
- Không công cụ miễn phí nào có: mũi tên trên lưới ngày sinh, số sao lớp tháng, hoạt cảnh sao bay. Đây là chỗ mình hơn được.

**Áp vào 42.1–42.3:**
1. **Khoảng tuổi đỉnh cao không chồng nhau.**
   - In đúng `tuTuoi`–`denTuoi` của lib: 0–28, 29–37, 38–46, 47+ cho ca mẫu.
   - Mèo Béo ghi "28–37" khiến tuổi 28 thuộc hai chặng. Không lặp lỗi này.
   - Bên cạnh khoảng tuổi ghi năm dương tương ứng (năm sinh + tuổi).
2. **Mỗi nút đỉnh cao hiện phép cộng** (`phepCong`) ngay dưới số, chữ nhỏ.
   - Ở ≥ 768px được vẽ dạng kim tự tháp (mẫu numerologist.com) thay cho thanh ngang. Vẫn phải có "Đang ở đây".
   - Ở 375px giữ 4 thẻ dọc.
3. **Bố cục lưới 3×3:** dưới lưới ghi chú nhỏ "Hàng trên 3 · 6 · 9, hàng giữa 2 · 5 · 8, hàng dưới 1 · 4 · 7 (theo `LUOI`)". Có trang xếp kiểu bàn phím số (7 · 8 · 9 ở trên) nên người dùng dễ lẫn.
4. **La bàn:**
   - nút link `?xoay=huong` để xoay tĩnh la bàn sao cho hướng nhà nằm trên cùng (mẫu menh.guru, 1518);
   - mặc định vẫn Bắc ở trên; khi xoay ghi rõ "Đang xoay: hướng nhà ở trên";
   - không có hoạt cảnh xoay.
5. **Cảnh báo sát ranh sơn:**
   - gọi `ganRanhSon(do)` (hàm mới trong `phan-truc-quan.ts`, đã có test);
   - khi `gan` là true, in `cau` trong hộp nền hổ phách nhạt ngay dưới thẻ hướng;
   - trên la bàn tô vạch ranh giới gần nhất.
6. **Thẻ Hướng và Tọa đặt cạnh nhau** (2 cột cả ở 375px), mỗi thẻ có độ, sơn, quái.
   - URL kết quả đã có tham số `nam`, `gt`, `do`; thêm nút "Sao chép liên kết" (client nhỏ, có `aria-live`).
7. **Cửu tinh:**
   - bấm từng ô mở `<details>` tên sao, hành, Hán tự (dữ liệu sẵn có);
   - in "Năm đổi ở Lập xuân" kèm ngày (đã có trong `cau`);
   - lớp tháng phải hiện số sao thật của tháng. Thị trường chỉ ghi Cát/Bình, mình hơn ở chỗ này.
8. **Không chép:**
   - màu đỏ cho phương xấu (hầu hết đối thủ dùng đỏ);
   - popup hay mục "hóa giải", "vật phẩm";
   - điểm số tự chế (20/100, 74/100);
   - nhãn Thái Tuế, Tam Sát: chưa có nguồn trong sổ giấy phép nên không thêm.

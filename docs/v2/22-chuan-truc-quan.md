# 22. Chuẩn trực quan cho mọi công cụ xemboi

Ngày 24/11/2026. Anh Cường yêu cầu: nâng cấp giao diện cho **tất cả** công cụ đã làm và công cụ sẽ làm sau. Mỗi công cụ phải vừa đúng số liệu vừa đẹp. Trước khi làm phải so với công cụ cùng loại trên thị trường.

Cơ sở: tài liệu 21 (học từ 4 repo), các ảnh đối thủ trong `docs/v2/thiet-ke/doi-thu/`. Mọi lệnh Antigravity từ Lệnh 40 trở đi phải dẫn chiếu tài liệu này. Lệnh nào không đạt mục 2 thì không duyệt.

## 1. Quy trình cho mỗi công cụ

1. **Soi thị trường trước.** Lập cùng một ca mẫu trên ít nhất 4 công cụ: Việt Nam, Trung Quốc hoặc quốc tế, và 4 repo ở tài liệu 21. Chụp ảnh lưu vào `docs/v2/thiet-ke/doi-thu/<cong-cu>-thi-truong.md` (không commit ảnh). Ghi lại hai thứ:
   - các công cụ ra số liệu khác nhau ở đâu, và vì quy ước nào;
   - cái gì làm cho trang của họ dễ hiểu.
2. **Claude Code làm phần dữ liệu** (`src/lib/**`):
   - số liệu, quan hệ, câu Đọc nhanh, nghĩa ngắn;
   - câu trích có số đoạn trong kho RAG, kèm tệp đối chiếu trong `tests/trang/doi-chieu/`;
   - test đối chiếu với nguồn độc lập.
3. **Antigravity làm giao diện,** theo lệnh có ca mẫu và ảnh tham khảo.
4. **Claude Code duyệt** bằng cùng ca mẫu ở ba khổ 375, 768 và 1366 px. Phải đúng từng chữ so với lib và đạt đủ mục 2.

## 2. Mười một điều một trang kết quả phải có

| # | Điều | Cách kiểm |
|---|---|---|
| 1 | **Khối Đọc nhanh ở đầu kết quả:** một câu tóm tắt và 3–5 thẻ sự kiện. Mọi câu ghép từ số liệu đã tính, không lời luận | Câu lấy từ lib, có test. Không có chữ cấm của tài liệu 04 |
| 2 | **Chữ chính viết to:** nhật chủ, số chủ đạo, quẻ, sao trung cung, ngày đang xem. Chữ lớn nhất trang, tô màu theo hành | Chữ chính ≥ 40px ở 1366px, ≥ 32px ở 375px |
| 3 | **Ngũ hành hai cấp màu:** màu đậm cho chữ (`--ck-moc`…), màu nhạt cho nền. Dùng chung cho cả site, có chú giải chấm màu | Dùng token chung, không mã màu riêng từng trang |
| 4 | **Quan hệ vẽ thành đường** (hợp, xung, tam phương, sao bay…), mỗi nhóm một kiểu nét: liền, gạch, chấm, gạch-chấm | Tắt màu (grayscale) vẫn phân biệt được |
| 5 | **Thuật ngữ bấm được:** gạch chân chấm, bấm vào mở nghĩa ngắn. Nghĩa chỉ nói cách tính, không nói tốt xấu | Dùng `popover` HTML hoặc `<details>`, chạy được khi tắt JS |
| 6 | **"Mình đang ở đâu":** đại vận đang chạy, giờ hiện tại, hôm nay, chặng tuổi hiện tại đều được đánh dấu rõ | Có nhãn chữ, không chỉ màu |
| 7 | **Kết luận trên, căn cứ dưới:** bảng đầy đủ, cách tính, nguyên văn sách để trong `<details>` hoặc mục riêng phía dưới | Người mới không phải đọc bảng mới hiểu |
| 8 | **Chọn lọc:** đưa ít mục mà rõ (ví dụ 3 ngày hợp nhất, mỗi ngày một câu lý do). Danh sách đầy đủ để sau một nút hoặc link | Không chấm điểm %, không xếp hạng hù dọa |
| 9 | **Màu dịu cho cái "không hợp":** dùng hổ phách hoặc xám, không dùng đỏ báo động. Câu sách "không vội luận là dữ" đặt cạnh xung và hình | Không có nền đỏ đậm |
| 10 | **Di động trước:** 375px không cuộn ngang trừ dải chủ ý (đại vận, giờ). Lưới lớn (lá số) có thẻ chi tiết hoặc chế độ phóng to. Vùng bấm ≥ 44px. Có `prefers-reduced-motion` | Ảnh 375px trong báo cáo lệnh |
| 11 | **Chỉ tiếng Việt:** không chữ Hán, không chữ Anh thừa; trích sách in bản dịch kèm dòng nguồn | Chạy `node scripts/kiem-chu-han.mjs` báo 0 trang có chữ Hán trước khi báo xong |

## 3. Thành phần dùng chung (`src/components/ck/truc-quan/`, làm trong Lệnh 40)

- `DocNhanh`: nhận `{ cau, the[] }`. Thẻ có nhãn nhỏ, chữ lớn tô theo hành, 1–2 dòng chi tiết, trích dẫn nếu có.
- `ThuatNgu`: nhận `{ ten, nghia }`. Chữ gạch chân chấm, bấm mở hộp nghĩa (thuộc tính `popover`, không JS).
- `ChuGiaiHanh`: hàng chấm màu ngũ hành.
- `TrichNguyenVan`: nhãn `"Sách ghi"`, bản dịch tiếng Việt, tên sách và vị trí tiếng Việt, ghi công dịch nghĩa và giấy phép. Không in chữ Hán.
- Token màu nhạt `--ck-<hanh>-nhat`, đặt trong `truc-quan.css` của thư mục này (không sửa `ck.css`).

Trang nào dùng lại được thì phải dùng các thành phần này, không viết lại.

## 4. Áp cho các công cụ hiện có

| Lệnh | Công cụ | Việc dữ liệu (Claude Code) | Trạng thái |
|---|---|---|---|
| 40 | Thành phần dùng chung + Bát tự | `bat-tu-truc-quan.ts`: quanHeTru, docNhanh, giaoVan (có test) | Xong 24/11 (586c666) |
| 41 | Xem ngày, lịch âm | `xem-ngay-truc-quan.ts`: daiGio, chonNgayHopNhat, lich.ics (xong, có test) | Xong 24/11 |
| 42 | Thần số học, hướng nhà / bát trạch, cửu tinh | `phan-truc-quan.ts`: đọc nhanh, la bàn 24 sơn, đường sao bay (xong, có test) | Xong 24/11 |
| 43 | Tử vi, kinh dịch, bản đồ sao, xem tuổi, cung hoàng đạo | `truc-quan-43.ts`: tam phương tứ chính, đọc nhanh quẻ, xem tuổi, giãn nhãn (xong, có test) | Xong 24/11 |
| 44 | Bát tự: lưu niên, tam trụ | `bat-tu-luu-nien.ts`: luuNienBatTu, namTrongDaiVan, lapTamTru (có test) | Xong 24/11 |
| 45 | Ngũ hành, con giáp, 60 hoa giáp, năm sinh, xông đất | `tra-cuu-truc-quan.ts`: vòng ngũ hành, vòng con giáp có trích sách, lưới hoa giáp (có test) | Xong 24/11 (chữ Hán gỡ ở Lệnh 46) |
| 46 | Chỉ tiếng Việt: gỡ chữ Hán, chữ Anh thừa trên mọi trang | `chu-dich-64-dich.json` (64 quẻ dịch), trường `dich`/`viTriViet`/`vi`, `chu-viet.ts`; test `khong-chu-han.test.mjs`, script `kiem-chu-han.mjs` | Xong 24/11 (quét 118 trang: 0 trang có chữ Hán) |
| 47 | Lịch P2: giờ hoàng đạo, 24 tiết khí (+72 hậu), ngày lễ âm lịch | `lich-mua.ts` (test `lich-mua.test.mjs`) | Xong 24/11 (37 trang; menu đợt 6 đã bật) |
| 48 | Con giáp từng cặp (79 trang), Tứ Hóa | `cap-con-giap.ts`, `tu-hoa.ts` (có test) | Xong 24/11 (80 trang; menu đợt 7 đã bật) |
| 49 | Thập thần (10), thiên can (10) | `thap-than.ts`, `thien-can.ts` (có test) | Xong 24/11 (20 trang; tên thần trên lá số bát tự thành liên kết) |
| 50 | Hành tinh chiêm tinh (10) | `hanh-tinh.ts` (có test) | Xong 24/11 (10 trang; trang /chiem-tinh có hàng 10 thiên thể) |
| 51 | Mai hoa Dịch số (lập quẻ theo thời gian, theo số; thể dụng; 2 ví dụ sách) | `mai-hoa.ts` (test `mai-hoa.test.mjs`) | Xong 24/11 (2 ví dụ sách khớp; thẻ ở /kinh-dich và /kinh-dich/gieo-que) |
| 52 | Lục hào: gieo 3 xu, an quẻ nạp giáp (cung, thế ứng, lục thân, lục thần, tuần không, nguyệt phá) | `luc-hao.ts` (test `luc-hao.test.mjs`, đối chiếu bảng 64 quẻ của sách) | Xong 24/11 (khớp ví dụ sách; bảng 375px không cuộn ngang) |
| 53 | Lục hào nâng cao (vượng suy, nhật thần, phục thần, dụng thần theo 16 việc, nguyên kỵ cừu, ứng kỳ) và thịnh suy Mai hoa | `luc-hao-nang-cao.ts`, `mai-hoa.ts` (test `luc-hao-nang-cao.test.mjs`) | Xong 24/11 (khớp daogiao.io.vn phần phục thần; 375px không cuộn ngang; quét 300 trang 0 chữ Hán) |
| 54 | Bói tình yêu: con giáp năm sinh, cung hoàng đạo và góc chiếu (Tetrabiblos I.XVI), số chủ đạo hai người; không điểm | `boi-tinh-yeu.ts` (test `boi-tinh-yeu.test.mjs`) | Đang làm |
| 55 | Phong tục theo sách (Phan Kế Bính 1915) ở trang lễ, Tết, Thanh minh; văn khấn ngày giỗ điền sẵn (Dương Bá Trạc 1932) | `phong-tuc-ngay-le.ts`, `van-khan.ts` (test cùng tên) | Đang làm |
| sau | Mọi công cụ mới | Theo mục 1 và 2 ngay từ lệnh đầu | |

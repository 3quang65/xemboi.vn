# Bảng "đặc tả chưa phủ bởi lá" — L-82ef28

Nguồn đối chiếu: `docs/nghien-cuu/tuvi-an-sao-spec.md` (xemtuvi.vn, commit 4043095), 11 lá `tuvi-test-cases.json` + 42 lá `mau/mo-rong.json` = 53 lá. Cách đo: liệt kê các trường kỳ vọng thật sự có trong `kyVong` của lá (canChi, lunar, menh, than, thanCu, cuc, chinhTinh, sao, tuHoa, tuan/triet, trangSinh, daiHan, tieuHan, menhChu, thanChu) và các tham số đầu vào; quy tắc nào không có trường kỳ vọng, hoặc nhánh tham số không có lá nào chạm → "chưa phủ". Số liệu là đếm trực tiếp trên 53 lá, không ước.

"Phủ bằng kiểm vét cạn" nghĩa là đã có kiểm riêng bằng engine (không bằng lá): Tứ hóa 10 can (L-49ec35), Địa Không/Kiếp theo giờ + vòng Thái Tuế/Bác Sĩ (L-a6010c, L-74e235), đại vận 5 cục×2 giới (L-3c07da). Các mục đó không tính vào bảng dưới.

## A. Quy tắc chưa có lá nào kiểm (15 mục)

| # | Mục spec | Quy tắc | Vì sao chưa phủ (số đo) | Lá đề xuất thêm |
|---|---|---|---|---|
| 1 | 6 | Độ sáng Miếu/Vượng/Đắc/Bình/Hãm (bảng Việt, 14 chính tinh + vài phụ tinh) | 0/53 lá có trường `doSang`; cả mục 6 chưa có kỳ vọng | Thêm trường `doSang` cho 12 lá có Tử Vi ở 12 cung khác nhau (đã có đủ 12 vị trí Tử Vi) → phủ 14×12 ô chính tinh. Cần nguồn thứ hai ngoài bảng repo (bảng chưa có sách gốc). |
| 2 | 7.4 | Sao lưu L.* (Thái Tuế, Tang Môn, Bạch Hổ, Khốc, Hư, Lộc Tồn, Kình, Đà, Mã…) | `testLuuNien` chỉ có 2 mẫu (Quý Mão 2023, Canh Thìn) và chỉ 10 sao iztro; thiếu Thái Tuế/Tang Môn/Bạch Hổ/Khốc/Hư lưu | 10 lá "năm xem" ứng với 10 can × 12 chi (ít nhất mỗi can 1 lần, mỗi chi 1 lần); kỳ vọng tính tay từ công thức 7.4 |
| 3 | 7.3 | Lưu tứ hóa theo can năm xem | Không lá nào có kỳ vọng lưu tứ hóa | 10 năm xem (mỗi can 1) — tái dùng 10 lá ở #2 |
| 4 | 7.3 | Đại vận đang đi theo tuổi mụ năm xem (tìm cung chứa tuổi) | Chỉ kỳ vọng bảng đại hạn, không có "năm xem → cung đại vận" | 3 lá: tuổi mụ rơi đầu/cuối/giữa khoảng đại hạn (ca biên tuổi chia hết 10±1) |
| 5 | 7.5 | Lưu nguyệt / Đẩu Quân theo năm xem | 0 lá | 2 lá (một nam, một nữ; tháng 1 và tháng 12 âm) |
| 6 | 4.1 | An Tử Vi: lớp (cục, số bù) | 3/20 lớp chưa có lá: Thổ5 bù 3 (ngày âm ≡2 mod 5), Hỏa6 bù 0 (ngày 6,12,18,24,30), Hỏa6 bù 3 (ngày 3,9,15,21,27) | 3 lá, đã chọn sẵn trong `ma-tran-60-o_L-a36542.md` (Dần/Hỏa 6/2/1984, Tỵ/Hỏa 6/1/1987, Ngọ/Thổ 2/8/1984…) |
| 7 | 5.6 | Sao theo ngày (Tam Thai, Bát Tọa, Ân Quang, Thiên Quý) | Ngày âm chưa có lá: 2, 11, 13, 22, 23 (25/30 ngày có) | 5 lá ngày âm 2, 11, 13, 22, 23 (gộp với lá của #6 và 60 ô: chỉ còn thiếu 22) |
| 8 | 7.2 | Tiểu hạn theo chi năm × giới | 3/24 tổ hợp chưa có: Dần×nữ, Mùi×nam, Hợi×nữ | 3 lá (2 lá đã nằm trong danh sách 23 ô, còn Mùi×nam) |
| 9 | 10.17 / 1.7 | Ranh giới năm: Tết vs Lập Xuân (sinh sau 4/2 trước mùng 1 Tết) | 0 lá có ngày dương trong khoảng [Lập Xuân, Tết) | 2 lá: 05/02/2008 (Tết 07/02/2008, can chi năm Đinh Hợi, không phải Mậu Tý) và 10/02/1985 (Tết 20/02/1985, năm Giáp Tý, không phải Ất Sửu) |
| 10 | 1.2 / 10.3 | Giờ đồng hồ miền Nam 1960–1975 UTC+8 → UTC+7 (cần nơi sinh) | Đầu vào lá không có trường nơi sinh; 12 lá sinh 1960–1975 đều không khai múi giờ riêng (`muiGio` bỏ trống/mặc định) | 2 lá: Sài Gòn 11:30 01/05/1970 (ví dụ có sẵn trong spec 1.2) và Hà Nội cùng ngày giờ để đối chứng; cần thêm trường `noiSinh` |
| 11 | 1.2 | Tùy chọn giờ mặt trời thực | 0 lá | Chưa làm theo mặc định (không hiệu chỉnh); chỉ cần 1 lá khi bật tùy chọn |
| 12 | 10.x | Phương án phái khác (10.1 b/c giờ Tý; 10.7 Thiên Giải a/b/c; 10.8 Khôi Việt B/C; 10.9 Phá Toái; 10.10 Lưu Hà; 10.12 Thương/Sứ Trung Châu; 10.14 Mệnh chủ theo cung) | Lá chỉ có kỳ vọng mặc định; `bienThe` có ở một phần lá cũ nhưng chưa có lá nào cho phương án phái khác của 10.7–10.12 | 6 lá "chế độ phái": mỗi lá ghi cả hai kỳ vọng, nêu rõ sản phẩm đang theo phái nào (Việt) |
| 13 | 5.13 | Ngũ hành sao, loại sao (cát/sát), hành cung | 0 lá có trường kỳ vọng | 1 lá bảng tĩnh (không phụ thuộc ngày sinh); kiểm toàn bảng bằng test dữ liệu, không cần nhiều lá |
| 14 | 3.3 | Quan hệ Mệnh–Cục (sinh/khắc/bình) | Không có trường kỳ vọng dù đủ 25/25 cặp (nạp âm × cục) có lá | Thêm trường `quanHeMenhCuc` cho 25 lá có sẵn (không cần lá mới) |
| 15 | 8.3 | Cân lượng | Spec nói không thuộc Tử Vi; 0 lá | Không thêm lá; ghi "ngoài phạm vi" |

## B. Ô trống Mệnh×Cục (phần của #6/#7)

23/60 ô chưa có lá, 0 ô bất khả (xem `ma-tran-60-o_L-a36542.md`).

## C. Đã phủ đủ (để khỏi làm lại)

Can năm 10/10, chi năm 12/12, tháng âm 12/12, canh giờ 12/12, Tử Vi đủ 12 cung, Thân cư 6/6, Tuần 6/6 cặp, Triệt 5/5 cặp (Triệt chỉ có 5 cặp, không có Tuất–Hợi), tháng nhuận 5 lá, giờ Tý muộn/biên giờ (MR-GB01–10), Hỏa/Linh 8/8 lớp (nhóm chi năm × chiều), nạp âm×cục 25/25, âm dương×giới 4/4.

## D. Thứ tự đề xuất

Việc có giá trị cao nhất cho phần khách trả tiền: #1 (độ sáng, hiện không có kiểm nào), #2–#3 (vận Vận 2027 phụ thuộc sao lưu và lưu tứ hóa), #9 (ranh giới năm). Tạo lá do Đức/Tùng; em chưa sửa `mo-rong.json`, chưa nhập lá nào. Cần quyết: có thêm trường `doSang`/`quanHeMenhCuc` vào lá cũ không (đổi cấu trúc kyVong → báo Minh).

Không chi tiền.

# Quy ước soạn bộ quy tắc luận giải 12 cung (việc L-fcc128)

Dùng chung cho mọi phần nháp trong thư mục này. Sẽ gộp thành `docs/nghien-cuu/luan-giai-12-cung.md`.

## Mã nguồn (dùng đúng mã này, thêm mã mới thì ghi định nghĩa ở cuối file phần của mình)
- **TT**: *Tử Vi Đẩu Số Toàn Thư* (Hy Di Trần Đoàn; bản dịch Việt Vũ Tài Lục / Hư Chu). Có các thiên Chư tinh vấn đáp, Phú, Cốt tủy phú.
- **TB**: *Tử Vi Đẩu Số Tân Biên*, Vân Đằng Thái Thứ Lang.
- **NL**: *Tử Vi Nghiệm Lý Toàn Thư*, Thiên Lương.
- **CN**: *Tử Vi Chỉ Nam*, Song An Đỗ Văn Lưu.
- **KL**: *Tử Vi Khảo Luận*, Hoàng Thường.
- **HS**: *Tử Vi Hàm Số*, Nguyễn Phát Lộc.
- **TC**: Trung Châu phái, Vương Đình Chi (*Đẩu Số Giảng Nghĩa*, *Đẩu Số Tinh Diệu Tinh Hoa*...).
- **PT**: Phi tinh / Tứ Hóa phái (Khâm Thiên Môn...), phái Đài Loan.
- **W1, W2…**: trang web cụ thể (ghi URL đầy đủ ở cuối file phần).

## Định dạng quy tắc (bắt buộc, để đếm tự động)
Mỗi quy tắc là một dòng gạch đầu dòng:
```
- **[MA-CUNG-XX-nn]** <nội dung quy tắc> — *Nguồn: TB (chương …); NL (phần …)*
```
- `MA-CUNG`: MENH, HUYNH, PHU, TU, TAI, TAT, DI, NO, QUAN, DIEN, PHUC, PHUMAU, CHUNG.
- `XX`: mã sao/chủ đề: TV Tử Vi, LT Liêm Trinh, TD Thiên Đồng, VK Vũ Khúc, TDU Thái Dương, TCO Thiên Cơ, TP Thiên Phủ, TA Thái Âm, THL Tham Lang, CM Cự Môn, TT Thiên Tướng, TL Thiên Lương, TS Thất Sát, PQ Phá Quân; YN ý nghĩa cung; SP sao phụ; CC cách cục; HOA tứ hóa; TRANH tranh luận.
- Quy tắc chính (ý nghĩa cung, 14 chính tinh miếu/hãm, cách cục chính): **≥ 2 nguồn**. Chỉ có 1 nguồn thì thêm ` ⚑1nguồn` cuối dòng. Không có nguồn thì ` ⚑chưa-nguồn` (tối đa 10%).
- Phái khác nhau: ghi cả hai trong cùng quy tắc ("TB cho rằng…; TC cho rằng…") hoặc đưa vào mục Tranh luận.

## Trích nguồn trung thực
- Chỉ ghi số trang/chương nếu thực sự đã thấy (bản số hóa, trích dẫn có ghi trang). Không nhớ chính xác → ghi tên thiên/phần (vd "Chư tinh vấn đáp — Tử Vi") hoặc chỉ mã sách. **Không bịa số trang.**
- Ghi theo những gì sách nói, không tự sáng tác quy tắc. Nhận xét riêng của nhóm ghi rõ "*(Nhận xét nhóm, không phải quy tắc gốc)*".

## Giọng văn và ranh giới (bắt buộc)
- Định vị "hiểu mình, định hướng": mô tả xu hướng tính cách, điểm mạnh, thách thức, gợi ý phát huy.
- Hãm địa / sát tinh: diễn đạt trung tính ("dễ nóng vội, nên…", "cần chú ý…"). Không chép nguyên văn câu đe dọa (yểu, tù tội, chết, khắc chết, tuyệt tự…); nếu sách gốc nói thế, ghi trung tính và chú "*(sách gốc diễn đạt nặng, đã trung tính hóa)*".
- Không giải hạn, không cúng, bùa, vật phẩm; không phán định mệnh cố định; không chẩn đoán bệnh cụ thể (cung Tật Ách: chỉ nói "nên chú ý vùng/chức năng…, khám định kỳ").

## Khung mỗi cung
```
## <Số>. Cung <Tên>
### <Số>.1. Ý nghĩa cung (YN) — phạm vi luận, sao chủ, cung tam hợp/xung chiếu cần xét
### <Số>.2. 14 chính tinh tại cung — mỗi sao 1 tiểu mục ####, tối thiểu 2 quy tắc: (a) miếu/vượng/đắc, (b) hãm; thêm tổ hợp đồng cung chính nếu có
### <Số>.3. Bộ sao phụ quan trọng (SP) — Tả Hữu, Xương Khúc, Khôi Việt, Lộc Tồn, Thiên Mã, Kình Đà, Hỏa Linh, Không Kiếp, Đào Hồng Hỷ, Hình Riêu… chọn các sao có ý nghĩa riêng ở cung này
### <Số>.4. Cách cục chính (CC) — tên cách, điều kiện, ý nghĩa; gồm vô chính diệu
### <Số>.5. Tứ hóa tại cung (HOA) — Lộc, Quyền, Khoa, Kỵ nhập cung
### <Số>.6. Điểm còn tranh luận (TRANH)
```
Độ sáng (miếu/hãm từng sao ở từng cung địa bàn): theo bảng mục 6 của `docs/nghien-cuu/tuvi-an-sao-spec.md`, không tự đổi; sách khác bảng thì ghi vào Tranh luận. Tên sao, tên cung: theo spec mục 2.4, 4, 5.

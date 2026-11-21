# Quy trình kiểm chứng một quy tắc an sao mới

Áp cho mọi quy tắc mới hoặc bị nghi sai. Spec trong `docs/nghien-cuu/tuvi-an-sao-spec.md` thắng trí nhớ; không tự sửa spec, ghi vào báo cáo cho Minh.

**Ví dụ xuyên suốt: Tứ hóa can Canh** (spec 5.8 và 10.4). Việt: Nhật Vũ **Đồng** **Âm**; Trung Quốc: Nhật Vũ **Âm Đồng**.

1. **Nhận quy tắc.** Ghi 1 dòng: sao/vòng sao nào, điều kiện, cách A so với cách B. VD: "Canh hóa Thiên Đồng hay Thái Âm làm Quyền/Khoa/Kỵ?"
2. **Tìm nguồn.** Ít nhất 1 nguồn sách Việt (ghi tên sách, trang/mục) và 1 nguồn độc lập (engine mã mở hoặc sách khác). Không có nguồn thứ hai thì ghi "chưa có nguồn thứ hai" và mức tin cậy thấp. VD: Thái Thứ Lang, Thiên Lương cho bảng Việt; iztro cho bảng Trung Quốc.
3. **Ghi mã QT.** Mã `QT-<mục spec>`, VD `QT-10.4`; mỗi dòng danh mục có: mã, quy tắc, trường phái, nguồn, mặc định, ngày, người ghi. Chưa có mã thì thêm dòng mới ở spec mục 10 rồi mới đặt mã.
4. **Chọn mặc định.** Mặc định theo phái Việt trừ khi có lý do ghi rõ; cách còn lại thành tùy chọn. VD: mặc định bảng Việt, bảng Trung Quốc không dùng.
5. **Thêm lá số mẫu.** Cần ≥ 1 lá mà hai cách cho kết quả khác nhau (VD lá có can năm Canh). Sinh kỳ vọng bằng `tuvi-ref-engine.py`, không điền tay: `python3 -I tuvi-ref-engine.py <năm> <tháng> <ngày> <giờ> <phút> <nam|nu>`. Thêm vào `mau/mo-rong.json` (id `MR..`), ghi biến thể vào `bienThe`.
6. **Viết test.** Test đọc lá mẫu và so đúng trường bị ảnh hưởng (VD `tuHoa` của lá can Canh), đặt cạnh `tests/research-cases.test.cjs`. Kiểm test đỏ trước (với cách sai), rồi xanh.
7. **Chạy qua trạm kiểm thử.** Tại chỗ chỉ `node --test` tối đa 3 tệp nêu đích danh. Còn lại: `office test gui <tệp…>` hoặc `--tat-ca`; chạy trong thư mục làm việc. Báo số pass/fail thật, không "xanh" cảm tính.
8. **Cập nhật danh mục.** Ghi mã QT, trạng thái (đã kiểm / chờ chuyên gia), sha commit, tên nhánh vào danh mục và `ma-tran-phu.md` nếu lá mới đổi ô phủ. Điểm chưa chốt thì đưa vào `cau-hoi-mo.md`.
9. **Báo cáo.** ≤ 10 dòng: mã việc, mã QT, nhánh + sha, kết quả test (VD "2/2 pass"), vướng, "không chi tiền".

Lưu ý: chưa có sẵn tệp danh mục QT riêng trong repo; bước 3 và 8 tạm dùng spec mục 10 làm danh mục cho đến khi Minh quyết có tệp riêng.

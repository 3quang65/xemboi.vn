# Việc cần làm với engine an sao (từ đặc tả ngày 30/10/2026)

Nguồn: `tuvi-an-sao-spec.md` (mục 10, 11, 13) và `tuvi-test-cases.json`. Đã kiểm độc lập: phần lõi (Mệnh, Cục, 14 chính tinh) khớp 9/11 lá số mẫu; các sao phụ lệch đúng như đặc tả nêu.

Nguyên tắc: mỗi điểm các trường phái khác nhau phải là **tùy chọn** trong engine, có giá trị mặc định theo đặc tả, và hiển thị cho người xem biết đang dùng cách nào.

## Làm ngay (có căn cứ rõ)
1. **Âm lịch trước 01/01/1968 tính theo múi giờ +8** (lịch Việt Nam chỉ theo +7 từ 1968). Gỡ `todo` của TC07 khi xong.
2. **Giờ 23:00–23:59 tính sang ngày hôm sau** (giờ Tý muộn), có tùy chọn giữ ngày cũ. Gỡ `todo` của TC06.
3. **Nhập giờ phút**, không chỉ chọn canh giờ, để áp dụng được mục 1–2 và quy đổi giờ miền Nam 1960–1975 (mục 4).
4. **Quy đổi giờ khai sinh miền Nam 1960–1975** (đồng hồ chạy +8): thêm ô "Nơi sinh: miền Nam trước 1975".
5. **An các sao lưu** trên lá số (Lưu Thái Tuế, Lưu Lộc Tồn, Lưu Kình, Lưu Đà, Lưu Mã, lưu tứ hóa…) theo mục 7 đặc tả.

## Làm thành tùy chọn, chờ chuyên gia chốt mặc định
6. Hỏa Tinh, Linh Tinh với tuổi Tỵ Dậu Sửu.
7. Thiên Khôi, Thiên Việt can Đinh, Mậu, Canh, Nhâm.
8. Phá Toái, Lưu Hà, Thiên Trù can Quý, Thiên Giải.
9. Mệnh chủ theo chi năm sinh (đặc tả khuyến nghị mặc định) hay chi cung Mệnh.
10. Độ sáng Tử Vi ở Tý, Ngọ; độ sáng của Hóa Lộc, Quyền, Kỵ.

## Chưa làm
- Cân lượng: chưa có nguồn đáng tin, không hiển thị cho đến khi có.

Mỗi sửa đổi: thêm/cập nhật test, `npm test` đạt hết, ghi lại trong commit lý do và nguồn.

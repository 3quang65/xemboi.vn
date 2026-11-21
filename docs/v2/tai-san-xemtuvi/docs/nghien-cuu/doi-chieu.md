# Đối chiếu engine với 11 lá số mẫu

Ngày: 30/10/2026. Căn cứ: `tests/research-cases.test.cjs` đọc `tuvi-test-cases.json`. Kiểm thử chạy trong `npm test` và trong git pre-commit (`.githooks/pre-commit`).

## Kết quả
- **11/11 lá số mẫu đạt** trên mọi trường được kiểm: âm lịch, can chi, âm dương, bản mệnh, cung Mệnh/Thân, Cục, 14 chính tinh, Tứ hóa, Tuần, Triệt, sao khác, Tràng sinh, đại hạn, tiểu hạn, Thân chủ, Mệnh chủ.
- Không còn `todo` trong test. Báo cáo cũ "9/11 khớp, 2 còn todo" đã lỗi thời: TC06 và TC07 đã có test và đạt từ các commit trước.
- Trường `repoXemboi.lech` trong JSON mô tả engine repo **xemboi.vn** (cũ), không phải engine hiện tại. Không dùng để đánh giá engine xemtuvi.vn.

## Chỗ engine chưa an hoặc khác đặc tả (không làm test đỏ)
| # | Nội dung | Tình trạng | Cần gì |
|---|---|---|---|
| 1 | Thiên Nguyệt, Thiên Vu, Âm Sát | Engine chưa an. Test bỏ qua (`KHONG_AN`) | Chuyên gia chốt có an không (đặc tả 5.4) |
| 2 | Bác Sĩ (kỳ vọng) / Bác Sỹ (engine) | Khác chính tả. Test đã map `TEN_ENGINE` | Thống nhất tên gọi |
| 3 | TC01: nguồn ghi Thiên Lương ở Mùi | Coi là lỗi chép; engine và kỳ vọng: Tỵ | Xác nhận với nguồn gốc |
| 4 | TC04: tháng nhuận | Mặc định: nửa đầu (1–15) tính tháng chính, nửa sau tính tháng sau. Có biến thể "tính hẳn sang tháng sau" | Chuyên gia chốt mặc định |
| 5 | TC05/TC07: lịch Việt khác lịch Trung Quốc; trước 1968 | Mặc định theo đặc tả: âm lịch trước 01/01/1968 tính UTC+8. Có biến thể UTC+7 | Chuyên gia chốt (`VIEC-CAN-LAM.md` mục 1) |
| 6 | TC06: giờ Tý muộn 23h–24h | Mặc định: sang ngày hôm sau. Có biến thể giữ ngày cũ | Chuyên gia chốt mặc định |
| 7 | TC02: độ sáng | Độ sáng theo phái Việt là tùy chọn (đặc tả mục 6). Khác iztro (phái Trung Quốc) | Không cần sửa |
| 8 | Hỏa/Linh, Khôi/Việt, Phá Toái, Lưu Hà, Thiên Trù, Thiên Giải | Là tùy chọn có mặc định; test đã kiểm từng nhóm | Chuyên gia chốt mặc định (`VIEC-CAN-LAM.md` mục 6–10) |
| 9 | Cân lượng | Chưa làm, chưa có nguồn đáng tin | Chưa có việc |

## Git pre-commit
- Hook: `.githooks/pre-commit` chạy `npm test`. Đỏ thì chặn commit.
- Đã thử thật: stage một test cố tình đỏ rồi commit, commit bị chặn (exit 1). Test thử đã xóa.
- Cài đặt: `npm install` tự đặt `core.hooksPath` qua script `prepare`. Bỏ qua hook một lần: `git commit --no-verify` (chỉ dùng khi có lý do ghi trong commit).

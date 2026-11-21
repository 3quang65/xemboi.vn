# Kiểm Tứ hóa 10 can: spec vs engine — L-49ec35 (2026-11-13)
Không sửa code/quy ước, không chi tiền. Đối chiếu bằng script (so 40 ô, thứ tự Lộc/Quyền/Khoa/Kỵ).
Nguồn so: spec mục 5.8 (`tuvi-an-sao-spec.md`), engine tham chiếu `tuvi-ref-engine.py` (dòng 233–237), engine sản phẩm `src/lib/tuvi/tuvi-raw.js` (TU_HOA, dòng 79–84).

## Kết quả: **0 ô lệch / 40** giữa spec, engine tham chiếu và engine sản phẩm
| Can | Spec 5.8 | Engine tham chiếu | Engine sản phẩm | Ô lệch |
|---|---|---|---|---|
| Giáp | Liêm Trinh / Phá Quân / Vũ Khúc / Thái Dương | Liêm Trinh / Phá Quân / Vũ Khúc / Thái Dương | Liêm Trinh / Phá Quân / Vũ Khúc / Thái Dương | 0 |
| Ất | Thiên Cơ / Thiên Lương / Tử Vi / Thái Âm | Thiên Cơ / Thiên Lương / Tử Vi / Thái Âm | Thiên Cơ / Thiên Lương / Tử Vi / Thái Âm | 0 |
| Bính | Thiên Đồng / Thiên Cơ / Văn Xương / Liêm Trinh | Thiên Đồng / Thiên Cơ / Văn Xương / Liêm Trinh | Thiên Đồng / Thiên Cơ / Văn Xương / Liêm Trinh | 0 |
| Đinh | Thái Âm / Thiên Đồng / Thiên Cơ / Cự Môn | Thái Âm / Thiên Đồng / Thiên Cơ / Cự Môn | Thái Âm / Thiên Đồng / Thiên Cơ / Cự Môn | 0 |
| Mậu | Tham Lang / Thái Âm / Hữu Bật / Thiên Cơ | Tham Lang / Thái Âm / Hữu Bật / Thiên Cơ | Tham Lang / Thái Âm / Hữu Bật / Thiên Cơ | 0 |
| Kỷ | Vũ Khúc / Tham Lang / Thiên Lương / Văn Khúc | Vũ Khúc / Tham Lang / Thiên Lương / Văn Khúc | Vũ Khúc / Tham Lang / Thiên Lương / Văn Khúc | 0 |
| Canh | Thái Dương / Vũ Khúc / Thiên Đồng / Thái Âm | Thái Dương / Vũ Khúc / Thiên Đồng / Thái Âm | Thái Dương / Vũ Khúc / Thiên Đồng / Thái Âm | 0 |
| Tân | Cự Môn / Thái Dương / Văn Khúc / Văn Xương | Cự Môn / Thái Dương / Văn Khúc / Văn Xương | Cự Môn / Thái Dương / Văn Khúc / Văn Xương | 0 |
| Nhâm | Thiên Lương / Tử Vi / Thiên Phủ / Vũ Khúc | Thiên Lương / Tử Vi / Thiên Phủ / Vũ Khúc | Thiên Lương / Tử Vi / Thiên Phủ / Vũ Khúc | 0 |
| Quý | Phá Quân / Cự Môn / Thái Âm / Tham Lang | Phá Quân / Cự Môn / Thái Âm / Tham Lang | Phá Quân / Cự Môn / Thái Âm / Tham Lang | 0 |

## Biến thể (phái, nguồn)
- **Canh** — Việt (đang dùng): Lộc Thái Dương, Quyền Vũ Khúc, Khoa Thiên Đồng, Kỵ Thái Âm ("Nhật Vũ Đồng Âm"). Trung Quốc (iztro): Khoa Thái Âm, Kỵ Thiên Đồng ("Nhật Vũ Âm Đồng"). Nguồn: spec 5.8, 10.4 (Thái Thứ Lang, Thiên Lương; đã giải 10/11 → A).
- **Nhâm** — Việt (đang dùng): Khoa Thiên Phủ. Trung Quốc (iztro): Khoa Tả Phù. Nguồn: spec 5.8, 10.4.
- **Quý** — spec không ghi biến thể; **chưa có nguồn** cho biến thể nào. Bảng đang dùng (Phá Cự Âm Tham) trùng cả hai phái theo spec. Cách lấy: Toàn Thư/Thái Thứ Lang bản in (anh Cường/Minh cấp), hoặc chạy iztro ở trạm may-ai. Em không tự suy diễn biến thể.
- Chưa kiểm bằng lá số cụ thể: đây là đối chiếu bảng tra (can → 4 sao), không phụ thuộc tháng nhuận/giờ Tý/chuyển tiết; phần can năm theo tiết khí do test an sao khác lo.

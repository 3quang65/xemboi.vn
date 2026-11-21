# Tài sản chuyển từ dự án xemtuvi.vn (Văn phòng AI)

Chép ngày 20/11/2026 từ VPS, repo `~/xemtuvi.vn` (commit `1cfc5e1`, 14/11/2026) và thư mục nghiên cứu `~/duc/nghien-cuu`.
Đây là **bản tham chiếu**. Không sửa trong thư mục này; port sang mã xemboi ở chỗ khác.

## Có gì

| Thư mục | Nội dung |
|---|---|
| `src/lib/tuvi/` | Engine đang chạy trên xemtuvi.vn. `lich-raw.js` (âm lịch, can chi, tiết khí, ngày tốt xấu), `tuvi-raw.js` (an sao, độ sáng, đại vận, tiểu hạn, sao lưu, lưu tứ hóa, lưu nguyệt), `tiet-khi.mjs` (24 tiết khí VSOP87D), `index.ts` (lớp TypeScript), `nhe.ts`. |
| `lib/tuvi/`, `data/tuvi/`, `test/tuvi/` | Module sạch, tự chứa: `lich.mjs` (đổi lịch 1900–2100, múi giờ theo tên), `nap-am.mjs`. Dữ liệu chuẩn: `tet-wikipedia-1984-2091.json`, `lich-moc-chuan.json`, `nap-am.json`. |
| `tests/` | `engine.test.cjs`, `research-cases.test.cjs`, `tiet-khi.test.cjs`, `kiem-chung-qua-khu.test.cjs`. |
| `docs/nghien-cuu/` | `tuvi-an-sao-spec.md` (843 dòng, 13 mục, kèm bảng các điểm trường phái bất đồng), `tuvi-ref-engine.py` (engine Python độc lập để đối chiếu), `tuvi-test-cases.json` (11 lá số TC01–TC11), `VIEC-CAN-LAM.md`, tài liệu luận giải. |
| `src/lib/luan-giai/` | Lớp luận giải theo luật (JSON đoạn mẫu, mệnh chính tinh, tóm tắt miễn phí) và phần gọi AI. 2,1 MB. Chỉ để tham khảo giọng văn và cấu trúc. |
| `nghien-cuu/` | Nghiên cứu kiểm chứng của nhân viên "Đức": quy trình 9 bước, 42 lá số mẫu mở rộng (`mau/mo-rong.json`), script kiểm, ma trận 60 ô Mệnh×Cục, 15 quy tắc chưa có test (`mau/dac-ta-chua-phu_L-82ef28.md`), nguồn sách. |

## Đã kiểm lại trên máy anh (20/11/2026, Node 24, Python 3.15)

- `node --test tests/engine.test.cjs tests/research-cases.test.cjs tests/tiet-khi.test.cjs`: **34/34 đạt**.
- `node --test test/tuvi/*.mjs` (lich, nap-am, mau-luoc-do): **17/17 đạt**.
- `python -I nghien-cuu/mau/kiem-mo-rong.py docs/nghien-cuu nghien-cuu/mau/mo-rong.json`: **42/42 khớp** engine Python tham chiếu.
- Đã kiểm vét cạn trước đó (theo hồ sơ của Đức): Tứ hóa 10 can 0/40 lệch; đại vận 5 cục × 2 giới 0/480 lệch; Địa Không/Kiếp, vòng Thái Tuế, Bác Sĩ.

## Chưa chắc

1. **Engine JS chưa được đối chiếu với đủ 53 lá số mẫu.** 42 lá mở rộng mới chỉ kiểm với engine Python. Theo `VIEC-CAN-LAM.md`, phần lõi JS khớp 9/11 lá TC. Hai lá lệch là TC06 (giờ Tý muộn) và TC07 (âm lịch trước 1968 theo UTC+8).
2. **15 quy tắc chưa có test.** Danh sách nằm trong `nghien-cuu/mau/dac-ta-chua-phu_L-82ef28.md`. Nặng nhất là độ sáng (chưa có test nào), sao lưu, lưu tứ hóa, đại vận hiện hành, giờ miền Nam 1960–1975 và ranh giới năm Tết/Lập Xuân.
3. **Ma trận Mệnh×Cục mới phủ 37/60 ô.**

## Giấy phép (phải xử lý trước khi bán)

- `tuvi-raw.js` được chuyển thể từ TuViMCP (Manh Ha Nguyen), giấy phép **Apache-2.0**. Dùng thương mại được, nhưng phải giữ `NOTICE` và ghi công.
- `lich-raw.js` và `lib/tuvi/lich.mjs` theo thuật toán Hồ Ngọc Đức và đặt tên hàm giống bản amlich gốc (`jdFromDate`, `getNewMoonDay`…). **Chưa kiểm được điều khoản giấy phép** của mã gốc: trang leipzig không truy cập được ngày 20/11. Nếu mã gốc chỉ cho dùng phi thương mại thì phải viết lại phần đổi lịch trực tiếp từ Meeus, rồi kiểm bằng `tet-wikipedia-1984-2091.json` và `lich-moc-chuan.json`.

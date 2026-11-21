# Nguồn Khôi/Việt (tuổi Tân), Thiên Giải, 10 ô độ sáng — v1
Việc L-79a9f5 (cha L-8b9ac9) · 2026-11-11 · Đạt · không sửa code, không đổi quy ước, không chi tiền.

Ghi chú đầu vào: `giao-duc.md` của Minh (trao-doi/L-286cf8/L-8b9ac9/) nói về việc khác (chuẩn hóa 528 mã, jsonl), không có nội dung Khôi/Việt/Thiên Giải. Em dùng spec `~/xemtuvi.vn/docs/nghien-cuu/tuvi-an-sao-spec.md` (sha 8 ký tự chưa tính lại) + `~/duc/nghien-cuu/cau-hoi-mo.md`. Môi trường không có sách gốc, không tra web → mọi nguồn ngoài spec ghi **chưa xác minh**.
"Nguồn 2" và "10 ô độ sáng" brief không định nghĩa; em hiểu: nguồn 2 = nguồn thứ hai ngoài spec; 10 ô = 10 ô độ sáng đang nghi vấn (mục c). Anh Minh/Bảo sửa nếu hiểu khác.

## (a) Nguồn
### Thiên Khôi / Thiên Việt (spec 5.7, 10.8)
| Can năm | Giáp | Ất | Bính | Đinh | Mậu | Kỷ | Canh | **Tân** | Nhâm | Quý |
|---|---|---|---|---|---|---|---|---|---|---|
| Khôi | Sửu | Tý | Hợi | Hợi | Sửu | Tý | Sửu | **Ngọ** | Mão | Mão |
| Việt | Mùi | Thân | Dậu | Dậu | Mùi | Thân | Mùi | **Dần** | Tỵ | Tỵ |

- Tuổi Tân: Khôi Ngọ, Việt Dần. Cả ba cách (A Toàn Thư/iztro, B "Canh Tân phùng Mã Hổ", C engine cũ) ở Tân: A và B cùng Ngọ/Dần. Engine cũ (C) đảo Khôi/Việt ở Đinh, Mậu, Canh, Nhâm, **Tân không bị ảnh hưởng** (spec dòng 437–438). Nguồn: spec 5.7, 10.8. → Tân là ô **đã đồng thuận, rủi ro thấp**.
- Câu phú liên quan: "Lục Tân phùng Mã Hổ" (Tân gặp Ngọ/Dần) — trích từ trí nhớ/spec, **chưa xác minh bản in**.
- Khác biệt thật nằm ở Canh: A = Sửu/Mùi; B = Ngọ/Dần (gộp Canh theo Tân). Đây là điểm cần chuyên gia, không phải Tân.
- Độ tin cậy: A cao (phú + iztro + bộ test); nguồn sách Việt in (Thái Thứ Lang, Đỗ Văn Lưu): **chưa xác minh**.

### Thiên Giải (spec 5.6, 10.7)
- (a) `Thân + 2(M−1)`: T1 Thân, T2 Tuất, T3 Tý, T4 Dần, T5 Thìn, T6 Ngọ, T7 Thân… (lặp 6 tháng). Nguồn: ansaotuvi/dòng Thiên Lương — theo spec; **chưa xác minh bản in**.
- (b) theo cặp tháng: 1–2 Thân, 3–4 Tuất, 5–6 Tý, 7–8 Dần, 9–10 Thìn, 11–12 Ngọ (iztro "nguyệt giải"). Khác (a) ở các tháng chẵn (T2: Thân vs Tuất…).
- (c) `Thân + (M−1)`: đi thuận 1 cung/tháng, "một số trang Việt" — **chưa xác minh**, không có trang cụ thể.
- Lưu ý dễ nhầm: "Địa Giải" (Mùi + M−1) và "Giải Thần" (cùng Phượng Các, theo năm) là hai sao khác Thiên Giải (spec 5.6, 5.9).
- Trạng thái: chỉ **một** nguồn xác lập (a); (b),(c) là biến thể. Spec ghi "không tìm được nguồn sách Việt độc lập".

## (b) Đề xuất sửa spec 10.7/10.8 (chỉ đề xuất, chưa sửa)
1. 10.8: thêm dòng "Tuổi Tân: ba cách đều Ngọ/Dần, không ảnh hưởng"; đổi cột Repo thành "khác ở Đinh, Mậu, Canh, Nhâm (Tân khớp)" — đã đúng, chỉ làm rõ. Biến thể B chỉ khác A ở Canh: ghi rõ "chỉ Canh".
2. 10.8: thêm cột "nguồn in" = chưa xác minh cho từng cách; gắn nhãn "chờ chuyên gia" cho Canh.
3. 10.7: viết ra bảng 12 tháng cho (a), (b), (c) để người duyệt nhìn được chỗ khác nhau (tháng chẵn khác giữa a và b; c khác cả hai).
4. 10.7: đổi lý do "giữ để không đổi kết quả cũ" thành nhãn "tạm — 1 nguồn, rủi ro thấp" (Thiên Giải ít được luận); nhắc không nhầm Địa Giải/Giải Thần.
5. Cuối mục 10: thêm trạng thái "đã giải/chờ" cho từng dòng như cau-hoi-mo.md đã làm.

## (c) 10 ô độ sáng nghi vấn (bảng spec mục 6) + 10 câu hỏi đóng cho chuyên gia
Khôi/Việt/Thiên Giải: bảng không có hàng riêng (spec dòng 38: giữ "–"). 10 ô chọn từ chú thích spec 584–587:
ô 1 Tử Vi–Tý (B), ô 2 Tử Vi–Ngọ (M), ô 3–6 Hóa Lộc/Quyền/Kỵ ở Sửu, Thìn, Mùi, Tuất (Đ), ô 7 Thái Âm–Dậu (M), ô 8 Khôi, ô 9 Việt, ô 10 Thiên Giải (cả ba "–").

Câu hỏi đóng (trả Có/Không hoặc A/B):
1. Tử Vi ở Tý: Bình (B, hiện tại) hay Miếu?
2. Tử Vi ở Ngọ: Miếu (hiện tại) hay Bình?
3. Hóa Lộc/Quyền/Kỵ có độ sáng không? (Có/Không; nếu Không → ẩn trên giao diện)
4. Nếu Có: "Đắc ở tứ mộ Sửu Thìn Mùi Tuất" đúng không? (Đúng/Sai — nếu sai ghi bảng đúng)
5. Hóa Kỵ nên dùng cùng bảng với Hóa Lộc/Quyền không? (Có/Không)
6. Thái Âm ở Dậu: Miếu (bảng Việt)? (Đúng/Sai)
7. Thiên Khôi/Thiên Việt có xét độ sáng không? (Có/Không — hiện "–")
8. Tuổi Canh: Khôi/Việt Sửu/Mùi (A) hay Ngọ/Dần (B)? (A/B)
9. Tuổi Tân: Khôi Ngọ, Việt Dần — đúng? (Đúng/Sai)
10. Thiên Giải: (a) Thân+2(M−1), (b) theo cặp tháng, hay (c) Thân+(M−1)? (a/b/c)
(Thiên Giải độ sáng "–" hiện giữ nguyên, không cần hỏi riêng.)

## Còn thiếu
- Bản in *Tử Vi Đẩu Số Tân Biên* (Thái Thứ Lang), *Tử Vi Chỉ Nam* (Đỗ Văn Lưu): chưa có — cần Minh/chuyên gia cấp. Mọi mục "chưa xác minh" ở trên chờ bản này.

## Ghi chú L-36d197 (2026-11-11)
- Việc L-36d197 dùng lại tệp này (cùng nội dung với L-79a9f5): đủ (a) nguồn Khôi/Việt tuổi Tân + Thiên Giải, (b) đề xuất sửa spec 10.7/10.8, (c) 10 câu hỏi đóng.
- Đối chiếu Tứ hóa can Canh (liên quan câu 8 về Canh): xem `nghien-cuu/2026-11-11-L-910702-tu-hoa-canh.md` — Tân Biên vẫn **chưa xác minh**.
- Ghi chú `giao-duc.md`: bản ở /srv/ai-ngoai/trao-doi/L-286cf8/L-8b9ac9/ nói về việc khác (528 mã, jsonl), không chứa Khôi/Việt → không dùng làm nguồn.

## Ghi chú L-a5d19f (2026-11-11)
- Việc L-a5d19f trùng L-79a9f5/L-36d197: dùng lại nội dung, không làm lại. Nguồn gốc: commit 85c91f9 (dat/nghien-cuu/). Lần chạy trước của phòng cách ly vướng vì không thấy giao-duc.md; tệp này không chứa Khôi/Việt nên không cần.

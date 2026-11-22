# Việc cần anh Cường xử lý (gom một lần)

> Em (Claude Code) cứ làm tiếp theo kế hoạch ở máy trạm. Việc nào bắt buộc cần anh thì ghi vào đây; anh rảnh thì xử lý một lượt.
> Mỗi mục ghi: việc gì, vì sao cần anh, và **em đang tạm làm theo mặc định nào** để không chặn việc khác.
> Cập nhật lần cuối: 22/11/2026, sau khi anh trả lời lượt 1.

## Còn chờ anh

1. **Khóa Search Console của xemboi.vn** (anh đã đồng ý cấp). Các bước:
   1. Google Cloud Console → tạo project (hoặc dùng project có sẵn) → bật **Google Search Console API**.
   2. Tạo **tài khoản dịch vụ** (service account), tạo khóa dạng **JSON** và tải về.
   3. Search Console → property xemboi.vn → Cài đặt → Người dùng và quyền → thêm email của tài khoản dịch vụ (dạng `…@….iam.gserviceaccount.com`), quyền **Restricted** là đủ.
   4. Đặt tệp JSON vào `D:\VibeCode\Antigravity\may-tram\gsc-xemboi.json` (ngoài repo). Em không in nội dung tệp ra.

   Mã đồng bộ đã xong (`scripts/seo-gsc.ts`); chưa có tệp thì script tự bỏ qua. Có tệp rồi em chạy `--lan-dau` kéo 16 tháng, rồi đặt cron hằng ngày lúc deploy. Nếu property không phải dạng tên miền (`sc-domain:xemboi.vn`) mà là dạng URL thì báo em để đặt `GSC_SITE`.
2. **Chọn mô hình nhúng cho RAG và cách tìm trên VPS** (kết quả đo 100 câu ở `docs/v2/bao-cao-danh-gia-rag.md`):
   - Đo: Qwen3-Embedding-0.6B + mở rộng thuật ngữ tìm đúng **70 %** câu trong top 10; bge-m3 (đang dùng) 58 %; AITeamVN 55 %; chỉ tìm theo từ khóa (phương án đang duyệt cho VPS) **31 %**.
   - Em đề xuất: (a) đổi sang **Qwen3-0.6B** (Apache-2.0, cùng 1024 chiều nên không đổi schema; nhúng lại kho khoảng 6 phút); (b) **không** chỉ dùng từ khóa trên VPS mà thử chạy Qwen3-0.6B bản ONNX lượng tử hóa trên VPS 2 GB, nếu không nổi thì để máy trạm nhúng câu hỏi qua một cổng nội bộ, hoặc nâng VPS (tốn tiền, anh quyết).
   - Trong lúc chờ: giữ bge-m3, phần chạy thật vẫn là từ khóa + mở rộng.
3. **Ngày dự kiến mở tên miền chính** (17 mục 9, câu 9), để đặt nhắc giấy phép. Không có mặc định.
4. **Tài khoản quản trị cho người thật** (17 mục 9, câu 11): trang `/quan-tri/tai-khoan` đã xong, anh tự tạo khi cần; hồ sơ tác giả tạm dùng bút danh.
5. **xemtuvi.vn** (site riêng của anh, em không sửa): `horoscopes.xml` đang công khai lá số người dùng (giới tính, giờ, ngày sinh) và cho index.

## Anh đã trả lời ngày 22/11/2026

| Việc | Trả lời | Em làm thế nào |
|---|---|---|
| Push và deploy `lam-lai-v2` lên v3.xemtuvi.vn | Đồng ý | Làm một lần khi xong Đợt 3 ở máy trạm, theo thứ tự triển khai VPS đã ghi; deploy xong thì báo lại kèm kiểm tra |
| Thêm `NINEROUTER_API_KEY` vào env web trên VPS | Đồng ý | Làm lúc deploy; cổng trên VPS gọi thẳng `http://127.0.0.1:20128/v1` |
| Chạy script chuyển dữ liệu và đặt cron trên VPS | Đồng ý | Lúc deploy: chạy `--thu` trước rồi mới chạy thật (`chuyen-bai-cu.ts`, `chuyen-tri-thuc-cu.ts`); cron đêm `seo-quet.ts` rồi `seo-goi-y-lien-ket.ts`, sáng `seo-gsc.ts` (khi có khóa); nạp một lần `seo-nap-lich-mua.ts`; sao lưu `sao-luu-csdl.mjs` 3 giờ sáng, giữ 7 bản ngày + 4 bản tuần, chưa mã hóa |
| 5 URL cũ `CHO_QUYET` | Anh giao em quyết | **Đã làm:** giữ slug cũ `/lien-he` và 3 trang `/chinh-sach-*` (thêm vào `16-seo-trang.csv`: `PL-LIENHE`, `PL-BAOMAT`, `PL-DIEUKHOAN`, `PL-BANQUYEN`); `/chinh-sach-binh-luan-va-gop-y` 301 về `/lien-he`. Hai trang bảo mật và điều khoản cần luật sư đọc trước khi xuất bản |
| Rủi ro điều khoản khi chat công khai đi qua Codex thuê bao | Không sao | Giữ 9router + Codex |
| Đổi `prisma db push` sang `prisma migrate` | Đồng ý | Máy trạm đã dùng migrate (`0000_nen` → `0002`). Trên VPS: sao lưu, thử `migrate resolve --applied 0000_nen` + `migrate deploy` trên bản sao CSDL trước, rồi mới làm trên CSDL thật |
| Các câu còn mở ở 17 mục 9 | Đồng ý theo mặc định | Xem bảng dưới |
| `PTUC-XINXAM` (17 URL xin xăm) | (đã chốt trước: xin xăm làm sau) | Chuyển hướng để **tắt**; có bài thì bật, bỏ hẳn thì đổi 410 |

### 17 mục 9: các mặc định đã được duyệt

- Máy trạm: chạy OCR và nhúng khi máy bật, không hẹn giờ (câu 2).
- Nhúng câu hỏi lúc chạy thật: (c) chỉ tìm theo từ khóa và thuật ngữ; Đợt 3 đo thử (b) bge-m3 ONNX trên VPS (câu 3).
- Chuyên gia ngoài **không** đọc đoạn nguồn C (câu 4).
- Trang công khai **không** ghi tên sách C (câu 5).
- Văn bản nguồn C **chỉ ở máy trạm** (câu 6).
- Tài liệu RAG cũ thành `NOI_BO` (câu 7).
- Giữ một tiến trình, chưa tách `quantri.xemboi.vn` tới hết Đợt 3 (câu 8).
- Không bật Ahrefs (câu 13).

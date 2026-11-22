# Việc cần anh Cường xử lý (gom một lần)

> Em (Claude Code) cứ làm tiếp theo kế hoạch ở máy trạm. Việc nào bắt buộc cần anh thì ghi vào đây; anh rảnh thì xử lý một lượt.
> Mỗi mục ghi: việc gì, vì sao cần anh, và **em đang tạm làm theo mặc định nào** để không chặn việc khác.
> Cập nhật lần cuối: 22/11/2026, sau F5 (thêm mục 7–12).

## Còn chờ anh

1. **Khóa Search Console của xemboi.vn** (anh đã đồng ý cấp). Các bước:
   1. Google Cloud Console → tạo project (hoặc dùng project có sẵn) → bật **Google Search Console API**.
   2. Tạo **tài khoản dịch vụ** (service account), tạo khóa dạng **JSON** và tải về.
   3. Search Console → property xemboi.vn → Cài đặt → Người dùng và quyền → thêm email của tài khoản dịch vụ (dạng `…@….iam.gserviceaccount.com`), quyền **Restricted** là đủ.
   4. Đặt tệp JSON vào `D:\VibeCode\Antigravity\may-tram\gsc-xemboi.json` (ngoài repo). Em không in nội dung tệp ra.

   Mã đồng bộ đã xong (`scripts/seo-gsc.ts`); chưa có tệp thì script tự bỏ qua. Có tệp rồi em chạy `--lan-dau` kéo 16 tháng, rồi đặt cron hằng ngày lúc deploy. Nếu property không phải dạng tên miền (`sc-domain:xemboi.vn`) mà là dạng URL thì báo em để đặt `GSC_SITE`.
2. **(Không gấp) Đổi mô hình nhúng sang Qwen3-0.6B.** Tìm trên VPS đã chốt theo lời anh: từ khóa + viết lại câu hỏi bằng `gx/qwen3.6-35b-nvfp4` của cụm máy nhà, đo 100 câu được 80 % (trước 31 %), không cần nhúng trên VPS. Đổi mô hình nhúng chỉ cần khi bật nhánh vector; nó vẫn hơn bge-m3 (70 % so với 58 %). Em để bge-m3 tới khi anh bảo đổi. Lưu ý: tìm trên VPS sẽ phụ thuộc cụm máy nhà; cụm tắt thì tự lùi về 31 %.
3. **Ngày dự kiến mở tên miền chính** (17 mục 9, câu 9), để đặt nhắc giấy phép. Không có mặc định.
4. **Tài khoản quản trị cho người thật** (17 mục 9, câu 11): trang `/quan-tri/tai-khoan` đã xong, anh tự tạo khi cần; hồ sơ tác giả tạm dùng bút danh.
6. **Frontend v2 (docs/v2/19).** Em đang tự làm theo mặc định dưới đây. Anh chỉ cần trả lời nếu muốn khác:
   1. **Chat "Hội đồng thầy" v1:** khung chat nổi đã bỏ khỏi mọi trang (component `CouncilChatEmbed` còn giữ trong mã, chưa trang nào dùng); API `/api/chat/*` giữ nguyên. Chỗ đặt giao diện chat xem mục 7.
   2. **Trang v2 dựng xong vẫn để `noindex`.** Trước ngày triển khai, em lập danh sách trang công cụ đủ điều kiện. Anh (hoặc biên tập viên) bấm xuất bản ở `/quan-tri/seo/trang`.
      - Trang từ điển chỉ index khi có diễn giải đã duyệt.
   3. **Đã làm (22/11):** gỡ trang v1. `/tu-vi-hom-nay`, `/tu-vi-ngay-mai` trả 410; `/tu-vi-tron-doi`, `/tu-tru`, `/boi-dich`, `/la-so/*` chuyển 301 sang trang v2. Service worker cũ thay bằng bản tự dọn bộ nhớ đệm.
   4. **Đã xong:** Bát tự (`/bat-tu/lap-la-so`) và Gieo quẻ (`/kinh-dich/gieo-que`) đã dựng ở F4, nên dùng 301 như mục 3.
7. **Trang trả phí `/goi` và `/tu-vi/luan-giai`.** Kế hoạch SEO ghi đây là sản phẩm trả phí (79k / 149k / 299k, VietQR); giá hiện chỉ có trong bản thử nhu cầu R1, chưa có luồng thanh toán thật. Cần anh chốt: giá, nội dung từng gói, và `/tu-vi/luan-giai` là báo cáo trả phí hay chat với "Hội đồng thầy". **Em đang để:** cả hai trang chưa dựng, `/goi` ẩn khỏi menu (đợt 6).
8. **Thông tin liên hệ cho `/lien-he`:** email, Zalo hoặc số điện thoại muốn công khai, tên đơn vị chủ quản. **Em đang để:** trang hiện "Thông tin liên hệ đang cập nhật" và `noindex`.
9. **Ba trang chính sách** (bảo mật và cookie, sử dụng và khiếu nại, bản quyền): cần người viết và luật sư đọc trước khi đăng. **Em đang để:** chỗ giữ, `noindex`. Bản bảo mật bắt buộc có trước khi mở form thu email/Zalo hoặc thanh toán.
10. **Người duyệt học thuật** (`/phuong-phap/nguoi-duyet`): bảng hồ sơ tác giả đang trống. Cần tên (hoặc bút danh), lý lịch ngắn của người viết và người duyệt. **Em đang để:** chỗ giữ, `noindex`.
11. **Xuất bản nội dung nền:** các trang `/phuong-phap/*`, `/nguon`, `/tu-dien`, `/kien-thuc/*` đã có dòng SEO ở trạng thái nháp và chưa có bài. Trang có dữ liệu tính được (bảng quy ước, bảng tháng nhuận, thư mục 164 nguồn, 336 thuật ngữ) vẫn dùng được ngay nhưng để `noindex` tới khi biên tập viên viết phần bài và bấm xuất bản.
12. **Bốn bài cũ ở `/bai-viet/*`** đã đăng, giữ nguyên đường dẫn. Kế hoạch SEO định chuyển 301 hai bài sang `/tu-vi/cach-doc-la-so` và `/phuong-phap/gio-ty`; em chỉ bật khi trang đích có bài đã duyệt, để không chuyển người đọc sang trang trống.
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

# Việc cần anh Cường xử lý (gom một lần)

> Em (Claude Code) cứ làm tiếp theo kế hoạch ở máy trạm. Việc nào bắt buộc cần anh thì ghi vào đây; anh rảnh thì xử lý một lượt.
> Mỗi mục ghi: việc gì, vì sao cần anh, và **em đang tạm làm theo mặc định nào** để không chặn việc khác.
> Cập nhật lần cuối: 22/11/2026.

## A. Khi đưa lên VPS (một lần, cuối cùng)

Anh dặn dựng xong hết ở máy trạm rồi mới đưa lên VPS. Lúc đó cần anh:

1. **Cho phép push và deploy** nhánh `lam-lai-v2` lên v3.xemtuvi.vn. Em chưa push gì.
2. **Thêm `NINEROUTER_API_KEY` vào env của web trên VPS.** Dùng khóa `xemboi` anh đã tạo (đã có trong `.env` máy trạm). Trên VPS cổng có thể gọi thẳng `http://127.0.0.1:20128/v1` thay cho `https://token.vip.vn/v1` (sửa ở `/quan-tri/ai/mo-hinh`).
3. **Cho chạy hai script chuyển dữ liệu trên CSDL VPS** (chỉ thêm bản ghi mới, không xóa bảng cũ):
   - `scripts/chuyen-bai-cu.ts`: bài `Post` và bài CMS → `NoiDung` (để `noindex` cho tới khi duyệt lại);
   - `scripts/chuyen-tri-thuc-cu.ts`: tài liệu trợ lý cũ → `RagNguon` hạng C, nội bộ.
   Em sẽ chạy `--thu` trước để anh xem số lượng.
4. **Sao lưu trên VPS:** đặt lịch chạy `scripts/sao-luu-csdl.mjs` hằng đêm và có mã hóa bản sao lưu hay không. Mặc định em đề xuất: cron 3 giờ sáng, giữ 7 bản ngày + 4 bản tuần, chưa mã hóa (máy chỉ anh vào).

## B. Quyết định nội dung và SEO

5. **5 URL cũ `CHO_QUYET`** (18-url-cu-xemboi.md mục 3): `/lien-he`, `/chinh-sach-ban-quyen`, `/chinh-sach-su-dung-va-khieu-nai`, `/chinh-sach-bao-mat-va-cookies`, `/chinh-sach-binh-luan-va-gop-y`. Giữ nguyên slug hay chuyển sang slug pháp lý mới? **Mặc định:** giữ nguyên slug (không tạo chuyển hướng), trang bình luận/góp ý trỏ 301 về `/lien-he`.
6. **`PTUC-XINXAM`:** anh đã chốt "xin xăm làm sau". 17 URL cũ (`/gieo-que-xin-xam` + 16 `/que-xam-*`) đang 301 về `/phong-tuc/xin-xam` chưa có bài. **Mặc định:** để các chuyển hướng này ở trạng thái **tắt**; khi nào có bài thì bật, nếu bỏ hẳn thì đổi sang 410.
7. **Rủi ro điều khoản Codex:** chat công khai và AI soạn đang đi qua kết nối Codex (gói thuê bao) của 9router. Dùng thuê bao cá nhân cho chatbot công khai có thể trái điều khoản của OpenAI. Anh cân nhắc có chuyển phần chat công khai sang khóa API trả theo token không. **Mặc định:** giữ như hiện tại ở máy trạm và bản thử v3.

## C. Các câu còn mở ở 17 mục 9

Mục 1 (Đợt 0) đã xong. Các mục dưới đây em đang chạy theo mặc định ghi bên cạnh:

8. **Máy trạm có GPU gì, bật mấy giờ mỗi ngày** (mục 2). Mặc định: chạy OCR và nhúng khi máy bật, không hẹn giờ.
9. **Nhúng câu hỏi lúc chạy thật** (mục 3). Mặc định: (c) chỉ tìm theo từ khóa và thuật ngữ; Đợt 3 sẽ đo thử (b) bge-m3 ONNX trên VPS.
10. **Chuyên gia ngoài có được đọc đoạn nguồn C** khi ký thỏa thuận bảo mật (mục 4). Mặc định: không.
11. **Trang công khai có ghi tên sách C dạng "tham khảo"** (mục 5). Mặc định: không.
12. **Văn bản nguồn C có lưu trên VPS không** (mục 6). Mặc định: chỉ máy trạm.
13. **Tài liệu RAG cũ thành `NOI_BO`**, chat công khai mất chúng cho tới khi xếp loại lại (mục 7). Mặc định: đồng ý (đã viết script theo hướng này).
14. **Tách `quantri.xemboi.vn`** (mục 8). Mặc định: giữ một tiến trình tới hết Đợt 3.
15. **Ngày mở tên miền chính** (mục 9), để đặt nhắc giấy phép.
16. **Search Console của xemtuvi.vn, hoặc sitemap** (mục 10). Đợt 3 cũng cần **quyền Search Console của xemboi.vn** (tài khoản dịch vụ, chỉ đọc) để đồng bộ số liệu hằng ngày.
17. **Ai được tạo tài khoản quản trị:** tên, vai trò; hồ sơ tác giả dùng tên thật hay bút danh (mục 11). Trang `/quan-tri/tai-khoan` đã làm xong, anh tự tạo được.
18. **Đổi `prisma db push` sang `prisma migrate`** (mục 12). Cần trước khi deploy.
19. **Bật Ahrefs?** (mục 13). Mặc định: không.

## D. xemtuvi.vn (site riêng của anh, em không sửa)

20. `horoscopes.xml` của xemtuvi.vn đang công khai lá số người dùng (giới tính, giờ, ngày sinh) và cho index (16-quyet-dinh-anh.md).

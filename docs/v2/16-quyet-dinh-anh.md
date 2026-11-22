# Quyết định của anh Cường về kiến trúc SEO (16)

## 21/11/2026
1. **Duyệt.** Gộp "lịch âm", "lịch âm hôm nay", "âm lịch hôm nay" và "lịch âm dương" về `/lich-am`, làm ngay.
2. **Duyệt.** Làm `/boi-tinh-yeu` theo cách so hai ngày sinh, không bói theo tên.
3. **Không hợp nhất.** xemtuvi.vn là trang riêng, không chuyển 301 về xemboi.vn. Bỏ bảng 8.4B.
4. **Duyệt.** URL theo năm: `/tet` cố định, còn `/lich-am/{yyyy}` và `/tu-vi-{yyyy}/…` gắn năm.
5. **Duyệt.** Gộp văn khấn mùng 1 và ngày rằm vào một trang.
6. **Từ khóa bị loại** (đối thủ, gõ sai, nhóm LOẠI) đưa vào **một mục quản lý riêng trong backend**. Sau này sẽ làm landing page để phủ từ khóa đối thủ và từ gõ sai. Xem 17 mục 1.1.2.
7. **Làm sau.** Xin xăm, giải mộng (chỉ giải nghĩa) và nhân tướng học. Ưu tiên hiện nay là SEO và marketing.
8. **Duyệt.** 12 con giáp lên P1.
9. **Duyệt.** Form lập lá số đặt cố định ở `/tu-vi/lap-la-so`; `/tu-vi-2027` là trang theo năm, dẫn sang form.

10. **Lá số không bao giờ được index trên xemboi.vn.** `/la-so/*` và mọi trang kết quả lá số đều noindex, nofollow và không vào sitemap. Đã thêm `robots` noindex vào `src/app/la-so/[slug]/page.tsx` (chưa commit).

Còn chờ anh (xemtuvi.vn, site riêng): `horoscopes.xml` của xemtuvi.vn đang công khai lá số người dùng (kèm giới tính, giờ và ngày sinh) và cho index.

## 22/11/2026 (trả lời sổ `viec-can-anh.md`, lượt 1)
11. **Đồng ý** push và deploy `lam-lai-v2` lên v3.xemtuvi.vn khi xong Đợt 3 ở máy trạm; thêm `NINEROUTER_API_KEY` vào VPS; chạy script chuyển dữ liệu và đặt cron trên VPS.
12. **Giao em quyết** 5 URL cũ `CHO_QUYET`: giữ slug cũ cho `/lien-he` và 3 trang `/chinh-sach-*`; `/chinh-sach-binh-luan-va-gop-y` 301 về `/lien-he` (18-url-cu-xemboi.md mục 3).
13. **Không sao** với rủi ro điều khoản khi chat công khai chạy qua Codex thuê bao trên 9router.
14. **Đồng ý** cấp quyền Search Console xemboi.vn (tài khoản dịch vụ, chờ tệp khóa).
15. **Đồng ý** đổi `prisma db push` sang `prisma migrate`.
16. **Đồng ý** các mặc định ở 17 mục 9 (chi tiết trong `viec-can-anh.md`).

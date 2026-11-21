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

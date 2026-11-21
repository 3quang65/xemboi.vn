# Lệnh 20: Kiểm kê URL của xemboi.vn đang chạy và lập bảng 301 sang v2

Người giao: anh Cường, qua Claude Code. Ngày 22/11/2026. Model: Gemini 4 Neon (High).

## 0. Bối cảnh

Đọc `docs/v2/00-BAN-CU-BAN-MOI.md` trước.

**xemboi.vn đang chạy thật là site cũ, khác hẳn mã trong repo.** Khi v2 chuyển sang tên miền chính, mọi URL đang có trong sitemap và đang được Google index phải thuộc một trong ba trường hợp:
- giữ nguyên, vì v2 có trang cùng đường dẫn;
- 301 sang trang v2 gần nghĩa nhất;
- 410, nếu nội dung thuộc nhóm bị loại theo định vị (07 mục 3.5, nhóm `LOAI:` trong `docs/v2/16-quy-tac-gan-tu-khoa.json`).

Mục đích là không mất thứ hạng đang có.

## 1. Việc cần làm

1. Tải sitemap chỉ mục `https://xemboi.vn/sitemap.xml`. Hiện có 11 sitemap con: static, lich-van-nien, xem-ngay-tot-xau, articles, xem-tuoi, xem-ngay, xem-boi, tu-vi, phong-thuy, gieo-que-xin-xam, nhan-tuong.
2. Tải từng sitemap con và lấy mọi `<loc>`. **Chỉ đọc sitemap**, không cào từng trang. Nếu một nhóm có trên 5.000 URL dạng lập trình (ví dụ ngày theo lịch), mô tả nhóm đó bằng **mẫu** (ví dụ `/lich-van-nien/{yyyy}/{mm}/{dd}`), kèm số lượng và 5 ví dụ, không liệt kê từng URL.
3. Với mỗi URL hoặc mẫu, quyết định:
   - `GIU`: v2 có trang cùng đường dẫn;
   - `301`: kèm `page_id` và URL đích trong `docs/v2/16-seo-trang.csv`. Mẫu lập trình thì ghi mẫu đích, ví dụ `/lich-am/{yyyy}/{mm}/{dd}`;
   - `410`: kèm lý do (nhóm LOAI nào);
   - `CHO_QUYET`: không chắc.
4. Đối chiếu từ khóa: dùng `docs/v2/tu-khoa/gan-tu-khoa.csv` (từ khóa → page_id) để chọn trang đích khớp ý định tìm kiếm nhất, không chỉ khớp chữ trong URL.

## 2. Đầu ra

- `docs/v2/18-url-cu-xemboi.csv`, các cột: `url_cu_hoac_mau,nhom_sitemap,so_url,vi_du,quyet_dinh,page_id_v2,url_dich,ly_do`. UTF-8, không BOM.
- `docs/v2/18-url-cu-xemboi.md`, báo cáo ngắn:
  - tổng số URL theo nhóm;
  - số GIU / 301 / 410 / CHO_QUYET;
  - danh sách CHO_QUYET để anh xem;
  - các trang v2 chưa có mà site cũ có nhiều URL (gợi ý bổ sung vào 16-seo-trang.csv).

## 3. Luật

- Chỉ đọc web công khai (sitemap). Không đăng nhập, không gửi form, không vượt captcha hay chặn bot. Nếu bị chặn thì dừng và ghi vào báo cáo.
- Không sửa mã nguồn, schema hay các tệp 16-*. Chỉ tạo hai tệp đầu ra ở trên.
- Không `git commit`.
- Không đụng `xemtuvi.vn`: đó là site riêng của anh, không chuyển.

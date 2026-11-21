# Bản cũ và bản mới: đọc trước khi làm (cập nhật 22/11/2026)

Tệp này dành cho anh Cường, Claude Code và Antigravity. Mục đích là tránh nhầm giữa bản cũ và bản mới. Ngày 22/11, Claude Code đã nhầm một lần: mở trang `/` ở máy, thấy giao diện cũ, rồi tưởng mình đang sửa nhầm bản.

## 1. Ba "xemboi" khác nhau

| Tên gọi | Ở đâu | Là gì | Có được sửa không |
|---|---|---|---|
| **xemboi.vn đang chạy thật** | Tên miền chính, sau Cloudflare | Site **cũ khác hẳn**, có sitemap 11 nhóm: lịch vạn niên, xem ngày, xem tuổi, tử vi, phong thủy, gieo quẻ, nhân tướng… Mã của site này **không nằm trên máy anh**. | Không. Khi v2 lên tên miền chính, mọi URL đang có thứ hạng phải được giữ, hoặc 301 sang trang v2 (nguồn `DUONG_CU` trong `SeoChuyenHuong`). |
| **Bản v1 trong repo này** | Commit `0ae2de8` (30/10/2026) | Giao diện "Hội đồng Bát Đại Danh Sư". Trang chủ `/` hiện vẫn là của bản này. | Không phát triển thêm. Chỉ vá lỗi bảo mật (Đợt 0). Sẽ thay dần bằng trang v2. |
| **Bản v2 (làm lại)** | Repo này, nhánh **`lam-lai-v2`**. Chạy thử ở **v3.xemtuvi.vn** (VPS, `xemboi-v3.service`, cổng 3027) | Bản làm lại chuyên nghiệp theo `docs/v2/01…17` | **Có. Mọi việc mới làm ở đây.** |

> Nhớ nhanh: thư mục `D:\VibeCode\Antigravity\xemboi.vn` + nhánh `lam-lai-v2` = bản v2. Không có thư mục v2 nào khác.

## 2. Trong repo: phần nào là v1, phần nào là v2

**Phần v2. Làm và sửa ở đây:**
- `docs/v2/`: toàn bộ thiết kế, từ nghiên cứu, định vị, từ khóa, SEO đến backend.
- `src/app/tu-vi-2027/`, `src/components/r1/`, `src/lib/r1/`, `src/app/api/r1/`: trang thí nghiệm R1 (giao diện E3). **Đây là trang công khai v2 duy nhất đã chạy.**
- `src/lib/tuvi-v2/`, `src/app/api/tuvi-v2-thu/`, `tests/tuvi-v2/`: engine lá số v2 (05a, 05b, 15).
- `src/app/quan-tri/(khu)/`, `src/app/quan-tri/dang-nhap/`, `src/lib/quan-tri/`, `src/app/api/quan-tri/`: khu quản trị v2. Có tài khoản, 4 vai trò, phiên đăng nhập (17 mục 5).
- `src/lib/seo/`, `src/app/quan-tri/(khu)/seo/`, `src/app/sitemap.xml/`, `src/app/sitemap/[tep]/`, `src/app/robots.ts`: module SEO (17 mục 1).
- `src/middleware.ts`: chặn khu quản trị và phục vụ chuyển hướng 301.
- `prisma/migrations/` và các model mới ở cuối `prisma/schema.prisma`, gồm RAG, SEO, nội dung và tài khoản.
- `tools/rag-may-tram/`, `tests/dot1/`: pipeline RAG trên máy trạm.
- `scripts/seo-nap-ban-dau.ts`, `scripts/tao-tai-khoan.ts`, `scripts/kiem-dot0.mjs`, `scripts/kiem-dot1-quyen.mjs`.

**Phần v1. Chưa làm lại; đừng lấy làm mẫu thiết kế:**
- Trang chủ `src/app/page.tsx`, `src/lib/home-template.ts`.
- `src/app/tu-vi-hom-nay`, `tu-vi-ngay-mai`, `tu-vi-tron-doi`, `tu-tru`, `boi-dich`, `kien-thuc`, `bai-viet`, `la-so`.
- `src/app/admin/*`: **đã xóa ngày 22/11/2026**. Bốn trang thay thế ở `/quan-tri/so-lieu`, `/quan-tri/khach-hang`, `/quan-tri/hoi-thoai`, `/quan-tri/ai/tro-ly`; đường cũ chuyển 308 (`src/middleware.ts`).
- `src/app/api/admin/*`: API cũ, **vẫn còn** (trang hội thoại mới còn gọi). Đợt 0 đã khóa lại; sẽ tách sang `/api/quan-tri/*` rồi xóa.
- `src/lib/core/*`: engine và dữ liệu cũ. Đọc thì được, **không sửa**.
- `src/lib/ai/*`, `src/components/CouncilChat*`, `FloatingChatWidget`: "Bát Đại Danh Sư".
- `README.md`: vẫn mô tả bản v1.

## 3. Thử ở máy thì mở trang nào

- Trang v2: `http://localhost:3047/tu-vi-2027` và `http://localhost:3047/quan-tri` (đăng nhập bằng tài khoản thử; mật khẩu ở `D:\VibeCode\Antigravity\may-tram\tai-khoan-thu.json`, ngoài repo).
- **Đừng mở `/` rồi kết luận về v2.** Trang `/` vẫn là v1. Cũng vì vậy mà nginx của v3.xemtuvi.vn chuyển `/` sang `/tu-vi-2027`.
- CSDL ở máy là Postgres 16 + pgvector tại `D:\VibeCode\Antigravity\may-tram`. Bật bằng lệnh `pgsql/bin/pg_ctl.exe -D pgdata -l pg.log -w start`.

## 4. Ai làm gì

| Việc | Người làm | Ghi chú |
|---|---|---|
| Thiết kế, tài liệu `docs/v2`, nghiên cứu | Antigravity (Gemini 4 Neon), Opus phản biện qua Agent SDK | Quota Claude trong Antigravity rất ít; việc dài dùng Gemini |
| Dựng giao diện công khai, trang quản trị theo mẫu có sẵn | Antigravity (Orchestrator Neon) | Claude Code duyệt |
| Lược đồ CSDL, migration, bảo mật, phân quyền, nghiệm thu | Claude Code | Antigravity không sửa `prisma/schema.prisma`, `prisma/migrations`, `src/lib/quan-tri` và `src/middleware.ts` |
| Đưa lên VPS (v3.xemtuvi.vn) | Claude Code, khi anh cho phép | Theo các bước trong bộ nhớ "xemboi v3 trên VPS" |

**Bẫy CSS khi dựng trang quản trị:** `globals.css` của v1 đã định nghĩa sẵn lớp `.so`, `.nhan` và biến `--paper` (màu kem ở chế độ tối, chữ sẽ không đọc được). Trang `/quan-tri` chỉ dùng lớp `qt-*`: ô số liệu dùng `qt-so`, `qt-so-nhan`, `qt-so-gt`; cột số dùng `qt-cot-so`; nền nhạt dùng `var(--line)`. Lệnh 19 đã mắc lỗi này một lần.

Lệnh giao cho Antigravity nằm trong `docs/v2/lenh-antigravity/NN-ten.md`. Báo cáo kèm theo đặt cùng chỗ, tên `NN-bao-cao.md`. Khi giao việc, chỉ dán vào khung chat một câu ngắn trỏ tới tệp lệnh, để ai cũng xem lại được đã giao gì.

## 5. Lịch sử mốc

- 30/10: v1 (`0ae2de8`).
- 20/11: bắt đầu làm lại v2. Trang R1 lên v3.xemtuvi.vn; giao diện E3 lên ngày 21/11.
- 21/11: Đợt 0 vá bảo mật (`de28323`).
- 21–22/11: Đợt 1 (chưa commit):
  - Postgres và pgvector ở máy;
  - RAG có phạm vi chặn bằng SQL;
  - tài khoản và 4 vai trò;
  - module SEO: kho 11.212 từ khóa, trang quản trị, sitemap từ CSDL, 301.

# XemBoi.vn — Nền Tảng An Sao Tử Vi & Hội Đồng Bát Đại Danh Sư AI

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-green?style=flat&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

**XemBoi.vn** là hệ thống huyền học phương Đông thế hệ mới, kết hợp tinh hoa thuật toán thiên văn cổ truyền (Tử Vi Đẩu Số, Tứ Trụ Bát Tự, Chu Dịch, Phong Thủy) với công nghệ Trí Tuệ Nhân Tạo đa chuyên gia (Multi-Agent Council Consultation).

---

## 🌟 Tính Năng Nổi Bật

### 1. Thuật Toán Lập Tinh Bàn Tử Vi Đẩu Số Chuẩn Xác
- **Thuật toán thiên văn Nam Phái**: An đủ 12 Cung địa bàn, 14 Chính tinh, các bộ Phụ tinh, Lục sát tinh, Tứ Hóa (Lộc - Quyền - Khoa - Kỵ), Tuần - Triệt, Vòng Tràng Sinh, Bác Sỹ, Thái Tuế.
- **Tam Hợp & Tam Giác Mệnh Chiếu**: Hiển thị trực quan đường nét tam giác mệnh, tài, quan thanh mảnh, tinh tế, dễ xem.
- **Lưu niên 2026 (Bính Ngọ)**: Cập nhật đầy đủ sao Lưu (Lưu Thái Tuế, Lưu Kình, Lưu Đà, Lưu Tang Môn, Lưu Hổ...) và đại vận 10 năm.

### 2. Tọa Đàm Hội Đồng Bát Đại Danh Sư (Multi-Agent Debate)
- **Tọa đàm phản biện đa chiều**: Các Danh Sư cùng hội chẩn một lá số, tiếp nối ý của nhau tự nhiên như một buổi đàm đạo trà thất:
  - **Thầy Minh Triết**: Chủ trì hội đồng, đại sư Tử Vi Đẩu Số tổng quan mệnh cục.
  - **Thầy Thái Sơn**: Chuyên gia quản trị tài chính, dòng tiền và đầu tư thực chiến.
  - **Thầy Tâm An**: Cố vấn tình duyên, thấu cảm tâm lý và hóa giải xung khắc gia đạo.
  - **Thầy Tuệ Phong**: Bậc thầy phong thủy Bát Trạch, trường khí và loan đầu địa lý.
  - **Thầy Thiên Minh**: Chuyên gia trạch cát, bói dịch và chọn thời điểm cát lành năm 2026.
  - **Thầy Lạc Việt**: Đại sư Tứ Trụ Bát Tự, phân tích ngũ hành khuyết thiếu & Dụng Thần.
  - **Thầy Huyền Cơ**: Học giả Chu Dịch 64 quẻ, bấm độn thời vận và dự báo biến dịch.
  - **Cô Linh Đan**: Cố vấn tâm linh, giải mã giấc mơ, âm đức tổ tiên và gieo trồng phước điền.
- **Ngôn ngữ đàm đạo người thật**: Loại bỏ hoàn toàn lối trả lời khuôn sáo dạng báo cáo (`### 1. Phân tích`), văn phong ấm áp, thấu cảm, giàu hình ảnh ẩn dụ dân gian.

### 3. Kiến Trúc AI Multi-LLM Gateway & RAG 2.0
- **Multi-LLM Bridge**: Kết nối linh hoạt với Google Gemini API (Gemini 2.0 Flash / 1.5 Flash), OpenAI (GPT-4o), DeepSeek Chat.
- **Offline High-Fidelity Engine**: Hệ thống tự động kích hoạt bộ đàm đạo tự nhiên nội bộ khi không có API Key, đảm bảo hoạt động 100% không gián đoạn.
- **RAG 2.0 Kho Tri Thức 64+ Chuyên Khảo**: Tích hợp tìm kiếm vector 1536-dim kết hợp trọng số chuyên môn của từng Danh Sư.
- **Continuous Learning (Few-Shot Prompting)**: Cổng nạp mẫu đối thoại vàng giúp các Danh Sư học hỏi phong thái người thật liên tục.

### 4. Cổng Quản Trị Hệ Thống Toàn Diện
- **Quản lý AI Agents & RAG** (`/admin/agents`): Tùy chỉnh prompt, nạp tri thức vector, cấu hình cổng LLM, huấn luyện Few-Shot và Test Playground trực tiếp.
- **Ngân hàng Câu hỏi Khách hàng** (`/admin/inquiries`): Tự động ghi nhận băn khoăn thực tế của đương số để tối ưu chất lượng luận giải.
- **CRM & Analytics** (`/admin/analytics`, `/admin/customers`): Theo dõi chân dung đương số, hành vi tạo lá số và doanh thu.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend & Fullstack Framework**: Next.js 15.1 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Grid/Flexbox
- **AI & RAG Engine**: Server-Sent Events (SSE Streaming), Custom Vector Embedding Search (1536 dims), Multi-LLM Provider
- **Database & ORM**: PostgreSQL (pgvector), Prisma ORM
- **Cache & Memory**: Redis (ioredis)
- **Thanh toán tự động**: VietQR, SePay Webhook

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu môi trường
- Node.js >= 18.18 (khuyến nghị Node.js 20 LTS)
- PostgreSQL (hỗ trợ pgvector nếu dùng tính năng nạp tài liệu database)
- Redis (tùy chọn để tăng tốc cache)

### 2. Cài đặt các gói phụ thuộc
```bash
git clone https://github.com/<your-username>/xemboi-vn.git
cd xemboi-vn
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` từ file mẫu:
```bash
cp .env.example .env
```
Cấu hình các tham số cần thiết trong `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/xemboi_vn?schema=public"
REDIS_URL="redis://localhost:6379"
ADMIN_KEY="xemboi_admin_2026"

# (Tùy chọn) Khóa API AI - Nếu để trống, hệ thống sẽ tự động dùng Lõi Đàm Đạo Nội Bộ
GEMINI_API_KEY=""
```

### 4. Khởi tạo cơ sở dữ liệu
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000) (hoặc port được cấp phát).

### 6. Đóng gói môi trường sản xuất (Production Build)
```bash
npm run build
npm run start
```

---

## 📁 Cấu Trúc Thư Mục

```text
xemboi.vn/
├── public/                 # Tài nguyên tĩnh, icon 8 Danh Sư, font chữ
├── prisma/
│   ├── schema.prisma       # Mô hình CSDL (AI Agent, Inquiries, Customer Profile...)
│   └── seed-*.ts           # Kịch bản nạp dữ liệu tri thức ban đầu
├── src/
│   ├── app/
│   │   ├── api/            # API Routes (hoi-thay, chat/council, chat/stream, admin...)
│   │   ├── admin/          # Cổng quản trị (agents, inquiries, analytics, customers...)
│   │   ├── la-so/[slug]/   # Trang chi tiết lá số & khung đàm đạo Bát Đại Danh Sư
│   │   └── page.tsx        # Trang chủ an sao Tử Vi
│   ├── components/         # Giao diện lá số, Hội Đồng Bát Đại Danh Sư (CouncilChatEmbed)
│   └── lib/
│       ├── ai/             # Lõi AI (llm-provider, agent-persona, rag-engine, few-shot...)
│       ├── core/           # Thuật toán an sao Tử Vi Đẩu Số, lịch âm dương Hồ Ngọc Đức
│       └── prisma.ts       # Prisma Client singleton
├── .env.example            # Biến môi trường mẫu
└── package.json            # Cấu hình dự án
```

---

## 📄 Bản Quyền & Giấy Phép

Phát triển bởi đội ngũ **XemBoi.vn**. Bảo lưu mọi quyền.
Dự án được xây dựng phục vụ nghiên cứu và bảo tồn văn hóa cổ học phương Đông kết hợp công nghệ AI tiên tiến.
